// Separa a arte do mapa (brand_assets/Mapa AM + RR · Manaus@1x.png) em camadas para a animação da Home
// (components/home/CoverageMapArt.tsx). De baixo para cima:
//   mapa-base.webp    o Brasil todo em cinza, com AM, RR e o rótulo "MANAUS" também em cinza
//   mapa-sombra.webp  sombra de AM/RR, que aparece quando eles se destacam
//   mapa-am-rr.webp   AM e RR em laranja (sem o ponto e a linha, que ficam na camada de cima)
//   mapa-rotulo.webp  o rótulo "MANAUS" em laranja
//   mapa-ponto.webp   ponto e linha brancos de Manaus, sempre visíveis
// Todas juntas, sem deslocamento, reproduzem a arte original.
//
// Uso: node scripts/home/mapa-camadas.mjs   (rodar de novo se a arte mudar; conferir as medidas abaixo)
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'brand_assets/Mapa AM + RR · Manaus@1x.png');
const OUT = path.join(ROOT, 'public/images/home');

// medidas na arte de 1200 × 1180 (versão de 2026-10-14)
const PONTO = { x: 518.7, y: 269.5, r: 9 }; // disco branco de Manaus; em volta há uma sombra de ~3 px
const LINHA = { x0: 518, x1: 616, y0: 269, y1: 270 }; // linha branca de 2 px até o rótulo
const ROTULO = { x0: 622, y0: 247, x1: 756, y1: 284 }; // "MANAUS"
const DESCIDA_SOMBRA = 12; // px: a sombra fica um pouco abaixo de AM/RR

const { data: src, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, N = W * H;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const suave = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const dentro = (x, y, r, m = 0) => x >= r.x0 - m && x <= r.x1 + m && y >= r.y0 - m && y <= r.y1 + m;
const noPonto = (x, y, m = 0) => Math.hypot(x - PONTO.x, y - PONTO.y) <= PONTO.r + m;
const dilatar = (marca, vezes) => {
  for (let k = 0; k < vezes; k++) {
    const d = Uint8Array.from(marca);
    for (let i = W; i < N - W; i++) if (!marca[i] && (marca[i - 1] || marca[i + 1] || marca[i - W] || marca[i + W])) d[i] = 1;
    marca = d;
  }
  return marca;
};

/** Preenche os pixels marcados com a cor dos vizinhos válidos (difusão em ponto flutuante). */
function preencher(rgb, marca, valido, iteracoes = 1500) {
  const alvo = [];
  for (let i = 0; i < N; i++) if (marca[i]) alvo.push(i);
  const cor = Float32Array.from(rgb);
  for (let it = 0; it < iteracoes; it++) {
    for (const i of alvo) {
      let s0 = 0, s1 = 0, s2 = 0, n = 0;
      for (const j of [i - 1, i + 1, i - W, i + W]) {
        if (!marca[j] && !valido(j)) continue;
        s0 += cor[j * 3]; s1 += cor[j * 3 + 1]; s2 += cor[j * 3 + 2]; n++;
      }
      if (n) { cor[i * 3] = s0 / n; cor[i * 3 + 1] = s1 / n; cor[i * 3 + 2] = s2 / n; }
    }
  }
  for (const i of alvo) for (let c = 0; c < 3; c++) rgb[i * 3 + c] = Math.round(cor[i * 3 + c]);
  return alvo.length;
}

// laranja de AM, RR e do rótulo: matiz até 50° e saturação alta (os cinzas e o fundo têm saturação ~0)
const corpo = new Float32Array(N), rotulo = new Float32Array(N);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x, r = src[i * 3], g = src[i * 3 + 1], b = src[i * 3 + 2];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (mx === mn) continue;
  let h = mx === r ? 60 * (((g - b) / (mx - mn)) % 6) : mx === g ? 60 * ((b - r) / (mx - mn) + 2) : 60 * ((r - g) / (mx - mn) + 4);
  if (h < 0) h += 360;
  if (h > 50) continue;
  (dentro(x, y, ROTULO) ? rotulo : corpo)[i] = suave(0.12, 0.35, (mx - mn) / mx);
}

// ---- base: o laranja vira cinza com a luz da arte (topo laranja, luminância ~132, vira o cinza dos estados, 197)
const base = Buffer.from(src);
for (let i = 0; i < N; i++) {
  const m = Math.max(corpo[i], rotulo[i]);
  if (!m) continue;
  const lum = 0.299 * src[i * 3] + 0.587 * src[i * 3 + 1] + 0.114 * src[i * 3 + 2];
  const cinza = Math.max(0, Math.min(255, 197 + 0.82 * (lum - 132)));
  for (let c = 0; c < 3; c++) base[i * 3 + c] = Math.round(src[i * 3 + c] * (1 - m) + cinza * m);
}

// ponto e linha saem da base e de AM/RR e ficam inteiros na camada de cima (mapa-ponto.webp):
// furo = o ponto, com a sombra (até 4 px além do disco), e a linha onde ela passa sobre o laranja
const furo = new Uint8Array(N), semMarcador = new Uint8Array(N);
for (let y = 8; y < H - 8; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x;
  if (noPonto(x, y, 4)) furo[i] = 1;
  else if (dentro(x, y, LINHA, 1) && (corpo[i - 4 * W] > 0.5 || corpo[i + 4 * W] > 0.5)) furo[i] = 1;
  if (furo[i] || dentro(x, y, LINHA, 1)) semMarcador[i] = 1;
}
preencher(base, semMarcador, (j) => !semMarcador[j]);

// ---- AM/RR: pixels originais, com o furo preenchido pelo laranja limpo em volta
const pecaRgb = Buffer.from(src);
const preenchidos = preencher(pecaRgb, furo, (j) => corpo[j] >= 0.95 && !furo[j]);
const peca = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  peca[i * 4] = pecaRgb[i * 3]; peca[i * 4 + 1] = pecaRgb[i * 3 + 1]; peca[i * 4 + 2] = pecaRgb[i * 3 + 2];
  peca[i * 4 + 3] = Math.round((furo[i] ? 1 : corpo[i]) * 255);
}

// ---- rótulo: os pixels originais das letras (com 2 px de folga, onde a base já é igual à arte), opacos
const areaRotulo = dilatar(Uint8Array.from(rotulo, (v) => (v > 0.02 ? 1 : 0)), 2);
const rot = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  if (!areaRotulo[i]) continue;
  rot[i * 4] = src[i * 3]; rot[i * 4 + 1] = src[i * 3 + 1]; rot[i * 4 + 2] = src[i * 3 + 2]; rot[i * 4 + 3] = 255;
}

// ---- ponto e linha: branco (o disco e a linha) ou preto (a sombra do ponto) sobre o laranja limpo, com a
// transparência que recompõe a arte (calculada pelo canal azul, onde branco, laranja e cinza mais se diferenciam)
const ponto = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  if (!semMarcador[i]) continue;
  const sb = src[i * 3 + 2];
  const fb = furo[i] ? pecaRgb[i * 3 + 2] : base[i * 3 + 2];
  if (sb >= fb) {
    ponto.fill(255, i * 4, i * 4 + 3);
    ponto[i * 4 + 3] = Math.round(clamp01((sb - fb) / (255 - fb)) * 255);
  } else {
    ponto[i * 4 + 3] = Math.round(clamp01(1 - sb / fb) * 255); // sombra: escurece o laranja
  }
}

// ---- sombra: silhueta de AM/RR desfocada, escura e um pouco mais baixa
const silhueta = Buffer.alloc(N);
for (let i = 0; i < N; i++) silhueta[i] = Math.round(Math.max(corpo[i], furo[i]) * 255);
// o sharp devolve o desfoque em 3 canais mesmo com entrada de 1: lê com o passo certo
const { data: borrada, info: infoB } = await sharp(silhueta, { raw: { width: W, height: H, channels: 1 } })
  .blur(16)
  .raw()
  .toBuffer({ resolveWithObject: true });
const sombra = Buffer.alloc(N * 4);
for (let y = DESCIDA_SOMBRA; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x;
  sombra[i * 4] = 40; sombra[i * 4 + 1] = 24; sombra[i * 4 + 2] = 14;
  sombra[i * 4 + 3] = Math.round(borrada[((y - DESCIDA_SOMBRA) * W + x) * infoB.channels] * 0.6);
}

const salvar = (buf, ch, nome) =>
  sharp(buf, { raw: { width: W, height: H, channels: ch } }).webp({ lossless: true, effort: 6 }).toFile(path.join(OUT, nome));
await salvar(base, 3, 'mapa-base.webp');
await salvar(sombra, 4, 'mapa-sombra.webp');
await salvar(peca, 4, 'mapa-am-rr.webp');
await salvar(rot, 4, 'mapa-rotulo.webp');
await salvar(ponto, 4, 'mapa-ponto.webp');

// centro de AM/RR (origem do crescimento na animação) e do ponto (pulso), em % da arte
let sx = 0, sy = 0, sw = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const w = corpo[y * W + x]; sx += x * w; sy += y * w; sw += w; }
const pct = (v, t) => `${((v / t) * 100).toFixed(2)}%`;
console.log(`camadas geradas (${W} × ${H}); AM/RR: ${preenchidos} px preenchidos`);
console.log(`centro de AM/RR: ${pct(sx / sw, W)} ${pct(sy / sw, H)} | ponto de Manaus: ${pct(PONTO.x, W)} ${pct(PONTO.y, H)}`);
