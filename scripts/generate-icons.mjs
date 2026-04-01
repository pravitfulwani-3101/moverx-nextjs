import { createCanvas } from "canvas";
import { writeFileSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "../public");

function drawIcon(size, maskable = false) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  const padding = maskable ? size * 0.1 : 0;
  const innerSize = size - padding * 2;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, "#0b0f19");
  bgGrad.addColorStop(1, "#060810");

  const radius = maskable ? size * 0.18 : size * 0.22;

  ctx.beginPath();
  ctx.moveTo(padding + radius, padding);
  ctx.lineTo(padding + innerSize - radius, padding);
  ctx.quadraticCurveTo(padding + innerSize, padding, padding + innerSize, padding + radius);
  ctx.lineTo(padding + innerSize, padding + innerSize - radius);
  ctx.quadraticCurveTo(padding + innerSize, padding + innerSize, padding + innerSize - radius, padding + innerSize);
  ctx.lineTo(padding + radius, padding + innerSize);
  ctx.quadraticCurveTo(padding, padding + innerSize, padding, padding + innerSize - radius);
  ctx.lineTo(padding, padding + radius);
  ctx.quadraticCurveTo(padding, padding, padding + radius, padding);
  ctx.closePath();
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Lightning bolt
  const boltGrad = ctx.createLinearGradient(size * 0.3, size * 0.1, size * 0.7, size * 0.9);
  boltGrad.addColorStop(0, "#22c55e");
  boltGrad.addColorStop(1, "#3b82f6");

  const s = size;
  // Points scaled from 512 viewBox: 296,64 168,280 240,280 216,448 344,232 272,232 296,64
  const pts = [
    [296 / 512, 64 / 512],
    [168 / 512, 280 / 512],
    [240 / 512, 280 / 512],
    [216 / 512, 448 / 512],
    [344 / 512, 232 / 512],
    [272 / 512, 232 / 512],
  ];

  ctx.beginPath();
  ctx.moveTo(pts[0][0] * s, pts[0][1] * s);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0] * s, pts[i][1] * s);
  }
  ctx.closePath();
  ctx.fillStyle = boltGrad;
  ctx.fill();

  return canvas.toBuffer("image/png");
}

// Generate icons
const sizes = [
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
  { name: "icon-maskable-512.png", size: 512, maskable: true },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "favicon-32.png", size: 32 },
];

for (const { name, size, maskable } of sizes) {
  const buf = drawIcon(size, maskable ?? false);
  writeFileSync(join(publicDir, name), buf);
  console.log(`✓ Generated ${name} (${size}x${size})`);
}
