import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve } from "path";

const projectRoot = resolve(import.meta.dirname, "..");
const inputSvg = readFileSync(
  resolve(projectRoot, "public/icons/apple-icon.svg"),
);
const inputSvgMaskable = readFileSync(
  resolve(projectRoot, "public/icons/apple-icon-maskable.svg"),
);

const targets = [
  { name: "apple-icon-180.png", size: 180, src: inputSvg },
  { name: "apple-icon-192.png", size: 192, src: inputSvg },
  { name: "apple-icon-512.png", size: 512, src: inputSvg },
  { name: "apple-icon-maskable-192.png", size: 192, src: inputSvgMaskable },
  { name: "apple-icon-maskable-512.png", size: 512, src: inputSvgMaskable },
];

for (const { name, size, src } of targets) {
  const outPath = resolve(projectRoot, "public/icons", name);
  await sharp(src).resize(size, size).png().toFile(outPath);
  console.log(`✓ ${name} (${size}x${size})`);
}
