import Jimp from "jimp";
import potrace from "potrace";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const inputPath = join(projectRoot, "public", "signature-source.jpg");
const outputPath = join(projectRoot, "public", "signature.png");
const svgOutputPath = join(projectRoot, "public", "signature.svg");
const traceAsync = promisify(potrace.trace);

/**
 * Zhang–Suen skeletonization: reduce a binary region to a 1-pixel skeleton.
 * `src` is a Uint8Array of 0/255 values representing ink/no-ink.
 */
function skeletonize(src, width, height) {
  const arr = new Uint8Array(src);
  const at = (x, y) =>
    x >= 0 && x < width && y >= 0 && y < height && arr[y * width + x] === 255
      ? 1
      : 0;

  const runPass = (passIndex) => {
    const toDelete = [];
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (arr[y * width + x] !== 255) continue;
        const P = [
          at(x, y - 1), // P2 (N)
          at(x + 1, y - 1), // P3 (NE)
          at(x + 1, y), // P4 (E)
          at(x + 1, y + 1), // P5 (SE)
          at(x, y + 1), // P6 (S)
          at(x - 1, y + 1), // P7 (SW)
          at(x - 1, y), // P8 (W)
          at(x - 1, y - 1), // P9 (NW)
        ];
        const B = P[0] + P[1] + P[2] + P[3] + P[4] + P[5] + P[6] + P[7];
        if (B < 2 || B > 6) continue;
        let A = 0;
        for (let i = 0; i < 8; i++) {
          if (P[i] === 0 && P[(i + 1) % 8] === 1) A++;
        }
        if (A !== 1) continue;
        if (passIndex === 0) {
          if (P[0] * P[2] * P[4] !== 0) continue;
          if (P[2] * P[4] * P[6] !== 0) continue;
        } else {
          if (P[0] * P[2] * P[6] !== 0) continue;
          if (P[0] * P[4] * P[6] !== 0) continue;
        }
        toDelete.push(y * width + x);
      }
    }
    for (const i of toDelete) arr[i] = 0;
    return toDelete.length;
  };

  let iterations = 0;
  while (true) {
    const a = runPass(0);
    const b = runPass(1);
    iterations++;
    if (a === 0 && b === 0) break;
    if (iterations > 50) break;
  }
  console.log(`Skeleton done in ${iterations} iterations`);
  return arr;
}

/**
 * Dilate a binary mask by `radius` in Chebyshev distance.
 */
function dilate(src, width, height, radius) {
  const out = new Uint8Array(src);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (src[y * width + x] !== 255) continue;
      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;
          out[ny * width + nx] = 255;
        }
      }
    }
  }
  return out;
}

async function main() {
  const img = await Jimp.read(inputPath);
  const src = { w: img.bitmap.width, h: img.bitmap.height };
  console.log(`Source: ${src.w}x${src.h}`);

  const cropX = Math.floor(src.w * 0.03);
  const cropY = Math.floor(src.h * 0.15);
  const cropW = Math.floor(src.w * 0.94);
  const cropH = Math.floor(src.h * 0.7);
  img.crop(cropX, cropY, cropW, cropH);
  console.log(`After rough crop: ${img.bitmap.width}x${img.bitmap.height}`);

  const { width, height } = img.bitmap;

  // Pass 1 — ink = dark AND achromatic
  const INK_MAX = 150;
  const CHROMA_MAX = 22;
  const binary = new Uint8Array(width * height);
  let inkCount = 0;
  img.scan(0, 0, width, height, function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const hi = Math.max(r, g, b);
    const lo = Math.min(r, g, b);
    if (hi < INK_MAX && hi - lo < CHROMA_MAX) {
      binary[y * width + x] = 255;
      inkCount += 1;
    }
  });
  console.log(`Ink pixels: ${inkCount}`);

  // Light closing — bridges small ink gaps without manufacturing side-branches
  let mask = dilate(binary, width, height, 2);
  {
    const eroded = new Uint8Array(mask.length);
    const r = 2;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let ok = true;
        for (let dy = -r; dy <= r && ok; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= height) {
            ok = false;
            break;
          }
          for (let dx = -r; dx <= r; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= width || mask[ny * width + nx] !== 255) {
              ok = false;
              break;
            }
          }
        }
        if (ok) eroded[y * width + x] = 255;
      }
    }
    mask = eroded;
  }

  // Write the closed binary back — potrace will handle smoothing to bezier polygons.
  // No skeletonization: it introduces side-branches on round letters like O.
  img.scan(0, 0, width, height, function (x, y, idx) {
    if (mask[y * width + x] === 255) {
      this.bitmap.data[idx] = 0;
      this.bitmap.data[idx + 1] = 0;
      this.bitmap.data[idx + 2] = 0;
      this.bitmap.data[idx + 3] = 255;
    } else {
      this.bitmap.data[idx + 3] = 0;
    }
  });

  // Density-based bbox on the final uniform stroke
  const rowCounts = new Array(height).fill(0);
  const colCounts = new Array(width).fill(0);
  img.scan(0, 0, width, height, function (x, y, idx) {
    if (this.bitmap.data[idx + 3] === 255) {
      rowCounts[y]++;
      colCounts[x]++;
    }
  });

  const rowMin = 10;
  const colMin = 4;
  let xmin = width;
  let xmax = 0;
  let ymin = height;
  let ymax = 0;
  for (let y = 0; y < height; y++) {
    if (rowCounts[y] >= rowMin) {
      if (y < ymin) ymin = y;
      if (y > ymax) ymax = y;
    }
  }
  for (let x = 0; x < width; x++) {
    if (colCounts[x] >= colMin) {
      if (x < xmin) xmin = x;
      if (x > xmax) xmax = x;
    }
  }

  console.log(`Robust bbox: ${xmin},${ymin} → ${xmax},${ymax}`);
  if (xmax <= xmin || ymax <= ymin) {
    throw new Error("Empty bbox");
  }

  const padding = 50;
  const fcx = Math.max(0, xmin - padding);
  const fcy = Math.max(0, ymin - padding);
  const fcw = Math.min(width - fcx, xmax - xmin + 2 * padding);
  const fch = Math.min(height - fcy, ymax - ymin + 2 * padding);
  img.crop(fcx, fcy, fcw, fch);

  const maxWidth = 1400;
  if (img.bitmap.width > maxWidth) {
    img.resize(maxWidth, Jimp.AUTO);
  }

  // Soft Gaussian blur — makes edges feel like ink bleed, not pixel-cut
  img.blur(1);

  await img.writeAsync(outputPath);
  console.log(`Wrote ${outputPath}: ${img.bitmap.width}x${img.bitmap.height}`);

  // Vectorize to SVG for smooth, scalable curves
  const rawSvg = await traceAsync(outputPath, {
    threshold: 128,
    turdSize: 6,
    alphaMax: 1.3,
    optTolerance: 0.2,
    optCurve: true,
    color: "#000",
    background: "transparent",
    blackOnWhite: true,
  });

  // Split the single potrace path into sub-paths (each `M...` through next `M`),
  // sort them by horizontal position, and emit one <path> per sub-path with
  // --i set so CSS can stage them in writing order.
  const vb = rawSvg.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 1363 369";
  const widthAttr = rawSvg.match(/width="([^"]+)"/)?.[1] ?? "1363";
  const heightAttr = rawSvg.match(/height="([^"]+)"/)?.[1] ?? "369";
  const dAttrs = [...rawSvg.matchAll(/d="([^"]+)"/g)].map((m) => m[1]);

  const subpaths = [];
  for (const d of dAttrs) {
    const segments = d.split(/(?=M\s)/).filter((s) => s.trim());
    for (const seg of segments) {
      const nums = [...seg.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) =>
        parseFloat(m[0])
      );
      // Rough bbox: assume x is every other number starting at 0
      let minX = Infinity;
      let maxX = -Infinity;
      for (let i = 0; i < nums.length; i += 2) {
        if (nums[i] < minX) minX = nums[i];
        if (nums[i] > maxX) maxX = nums[i];
      }
      if (!Number.isFinite(minX)) continue;
      subpaths.push({ d: seg.trim(), midX: (minX + maxX) / 2 });
    }
  }
  subpaths.sort((a, b) => a.midX - b.midX);
  console.log(`Sub-paths: ${subpaths.length}`);

  const pathsXml = subpaths
    .map(
      (s, i) =>
        `  <path d="${s.d.replace(/"/g, "&quot;")}" style="--i:${i}" />`
    )
    .join("\n");
  const styled = `<svg xmlns="http://www.w3.org/2000/svg" width="${widthAttr}" height="${heightAttr}" viewBox="${vb}">\n${pathsXml}\n</svg>\n`;

  await writeFile(svgOutputPath, styled);
  console.log(`Wrote ${svgOutputPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
