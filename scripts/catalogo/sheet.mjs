// Gera uma folha de contato (miniaturas numeradas) de uma pasta de imagens, para escolha visual.
// Uso: node sheet.mjs <pasta> <saida.png>
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
const [dir, out] = process.argv.slice(2);
const files = (await fs.readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const W = 300, H = 200, COLS = 5, rows = Math.ceil(files.length / COLS);
const tiles = await Promise.all(files.map(async (f, i) => {
  const img = await sharp(path.join(dir, f)).resize(W, H, { fit: 'contain', background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toBuffer();
  const label = Buffer.from(`<svg width="${W}" height="22"><rect width="${W}" height="22" fill="#000" opacity="0.7"/><text x="6" y="16" font-size="14" fill="#fff" font-family="Arial">${f.slice(0, 26)}</text></svg>`);
  const tile = await sharp(img).composite([{ input: label, top: 0, left: 0 }]).png().toBuffer();
  return { input: tile, left: (i % COLS) * (W + 4), top: Math.floor(i / COLS) * (H + 4) };
}));
await sharp({ create: { width: COLS * (W + 4), height: rows * (H + 4), channels: 3, background: '#cccccc' } }).composite(tiles).png().toFile(out);
console.log(files.length, 'imagens ->', out);
