// One-shot script: clean a user-supplied SVG (strip <rect> backgrounds and
// wrapper <g>), sort its paths by horizontal midpoint, and write a tidy
// public/signature.svg that the page's stroke-draw animation can use.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");
const inputPath = join(projectRoot, "public", "user-signature.svg");
const outputPath = join(projectRoot, "public", "signature.svg");

const raw = await readFile(inputPath, "utf8");

const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 800 400";
const widthAttr =
  raw.match(/<svg[^>]*\bwidth="([^"]+)"/)?.[1] ?? viewBox.split(/\s+/)[2];
const heightAttr =
  raw.match(/<svg[^>]*\bheight="([^"]+)"/)?.[1] ?? viewBox.split(/\s+/)[3];

const pathMatches = [...raw.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)];
const subpaths = pathMatches.map((m) => {
  const d = m[1];
  const nums = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((mm) =>
    parseFloat(mm[0]),
  );
  let minX = Infinity;
  let maxX = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    if (nums[i] < minX) minX = nums[i];
    if (nums[i] > maxX) maxX = nums[i];
  }
  return { d, midX: Number.isFinite(minX) ? (minX + maxX) / 2 : 0 };
});
subpaths.sort((a, b) => a.midX - b.midX);

const pathsXml = subpaths
  .map(
    (s, i) =>
      `  <path d="${s.d.replace(/"/g, "&quot;")}" style="--i:${i}" />`,
  )
  .join("\n");

const styled = `<svg xmlns="http://www.w3.org/2000/svg" width="${widthAttr}" height="${heightAttr}" viewBox="${viewBox}">\n${pathsXml}\n</svg>\n`;

await writeFile(outputPath, styled);
console.log(`Wrote ${outputPath} with ${subpaths.length} paths`);
