// Extrai o logo da Empilhatec de um post do Instagram (fundo branco) e gera PNG com fundo transparente.
// Uso: node logo.mjs <post.jpg> <saida.png>
import sharp from 'sharp';
const [src, out] = process.argv.slice(2);
const meta = await sharp(src).metadata();
const INSET = 14; // descarta a moldura fina do post
const base = await sharp(src).extract({ left: INSET, top: INSET, width: meta.width - 2 * INSET, height: meta.height - 2 * INSET }).toBuffer();
const { data, info } = await sharp(base).trim({ background: '#ffffff', threshold: 25 }).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
const px = Buffer.alloc(data.length);
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const a = 1 - Math.min(r, g, b) / 255; // quanto o pixel se afasta do branco
  if (a < 0.02) { px[i + 3] = 0; continue; }
  px[i] = Math.max(0, Math.min(255, Math.round((r - (1 - a) * 255) / a)));
  px[i + 1] = Math.max(0, Math.min(255, Math.round((g - (1 - a) * 255) / a)));
  px[i + 2] = Math.max(0, Math.min(255, Math.round((b - (1 - a) * 255) / a)));
  px[i + 3] = Math.round(a * 255);
}
await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().png().toFile(out);
const m = await sharp(out).metadata();
console.log(`${out}: ${m.width}x${m.height}`);
