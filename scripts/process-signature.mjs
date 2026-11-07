import Jimp from "jimp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const inputPath = join(projectRoot, "public", "signature-source.jpg");
const outputPath = join(projectRoot, "public", "signature.png");

async function main() {
  const img = await Jimp.read(inputPath);
  const src = { w: img.bitmap.width, h: img.bitmap.height };
  console.log(`Source: ${src.w}x${src.h}`);

  const cropX = Math.floor(src.w * 0.15);
  const cropY = Math.floor(src.h * 0.25);
  const cropW = Math.floor(src.w * 0.7);
  const cropH = Math.floor(src.h * 0.5);
  img.crop(cropX, cropY, cropW, cropH);
  console.log(`After rough crop: ${img.bitmap.width}x${img.bitmap.height}`);

  img.greyscale();

  const { width, height } = img.bitmap;
  const threshold = 135;

  // Pass 1 — binarize
  img.scan(0, 0, width, height, function (x, y, idx) {
    const v = this.bitmap.data[idx];
    if (v < threshold) {
      this.bitmap.data[idx] = 0;
      this.bitmap.data[idx + 1] = 0;
      this.bitmap.data[idx + 2] = 0;
      this.bitmap.data[idx + 3] = 255;
    } else {
      this.bitmap.data[idx + 3] = 0;
    }
  });

  // Pass 2 — dilation: snapshot alpha, then fill any pixel next to ink
  const DILATE = 2;
  const prevAlpha = new Uint8Array(width * height);
  img.scan(0, 0, width, height, function (x, y, idx) {
    prevAlpha[y * width + x] = this.bitmap.data[idx + 3];
  });
  img.scan(0, 0, width, height, function (x, y, idx) {
    if (this.bitmap.data[idx + 3] === 255) return;
    outer: for (let dy = -DILATE; dy <= DILATE; dy++) {
      const ny = y + dy;
      if (ny < 0 || ny >= height) continue;
      for (let dx = -DILATE; dx <= DILATE; dx++) {
        const nx = x + dx;
        if (nx < 0 || nx >= width) continue;
        if (prevAlpha[ny * width + nx] === 255) {
          this.bitmap.data[idx] = 0;
          this.bitmap.data[idx + 1] = 0;
          this.bitmap.data[idx + 2] = 0;
          this.bitmap.data[idx + 3] = 255;
          break outer;
        }
      }
    }
  });

  // Pass 3 — density-based bounding box
  const rowCounts = new Array(height).fill(0);
  const colCounts = new Array(width).fill(0);
  img.scan(0, 0, width, height, function (x, y, idx) {
    if (this.bitmap.data[idx + 3] === 255) {
      rowCounts[y]++;
      colCounts[x]++;
    }
  });

  const rowMin = 25;
  const colMin = 10;
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

  const padding = 40;
  const fcx = Math.max(0, xmin - padding);
  const fcy = Math.max(0, ymin - padding);
  const fcw = Math.min(width - fcx, xmax - xmin + 2 * padding);
  const fch = Math.min(height - fcy, ymax - ymin + 2 * padding);
  img.crop(fcx, fcy, fcw, fch);

  const maxWidth = 1200;
  if (img.bitmap.width > maxWidth) {
    img.resize(maxWidth, Jimp.AUTO);
  }

  await img.writeAsync(outputPath);
  console.log(`Wrote ${outputPath}: ${img.bitmap.width}x${img.bitmap.height}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
