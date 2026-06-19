const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'icons');
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#2D2F56"/>
  <rect x="96" y="140" width="320" height="252" rx="8" fill="#E8C0C4" stroke="#6A1020" stroke-width="8"/>
  <rect x="128" y="108" width="256" height="48" rx="6" fill="#D4B8CC" stroke="#6A1020" stroke-width="6"/>
  <text x="256" y="290" text-anchor="middle" font-size="120" fill="#6A1020" font-family="serif">&#10022;</text>
</svg>`;

fs.writeFileSync(path.join(dir, 'icon.svg'), svg);

function drawIcon(size) {
  try {
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2D2F56';
    ctx.fillRect(0, 0, size, size);
    const pad = size * 0.15;
    ctx.fillStyle = '#E8C0C4';
    ctx.strokeStyle = '#6A1020';
    ctx.lineWidth = size * 0.015;
    const bw = size - pad * 2;
    const bh = size * 0.55;
    const by = size * 0.28;
    ctx.fillRect(pad, by, bw, bh);
    ctx.strokeRect(pad, by, bw, bh);
    ctx.fillStyle = '#D4B8CC';
    const spineH = size * 0.1;
    ctx.fillRect(pad + bw * 0.1, by - spineH, bw * 0.8, spineH);
    ctx.strokeRect(pad + bw * 0.1, by - spineH, bw * 0.8, spineH);
    ctx.fillStyle = '#6A1020';
    ctx.font = 'bold ' + (size * 0.22) + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u2726', size / 2, by + bh * 0.45);
    return canvas.toBuffer('image/png');
  } catch (e) {
    return null;
  }
}

[192, 512].forEach(function (size) {
  const buf = drawIcon(size);
  if (buf) {
    fs.writeFileSync(path.join(dir, 'icon-' + size + '.png'), buf);
    console.log('Created icon-' + size + '.png');
  } else {
    fs.writeFileSync(path.join(dir, 'icon-' + size + '.png'), fs.readFileSync(path.join(dir, 'icon.svg')));
    console.log('Created icon-' + size + '.png from SVG fallback');
  }
});
