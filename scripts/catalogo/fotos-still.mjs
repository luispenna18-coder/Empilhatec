// Monta um acervo de referência com fotos do site da STILL Brasil (operações, setores, casos de
// clientes, segurança, serviços, locação, energia de lítio e máquinas), organizado por tema.
// NÃO vai para o site publicado: fica em brand_assets/fotos-still/ como repertório de escolha.
//
// Uso: node fotos-still.mjs --listar     só conta o que existe, por tema (não baixa)
//      node fotos-still.mjs              baixa (maior largura servida de cada foto)
import sharp from 'sharp';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const OUT = path.join(ROOT, 'brand_assets/fotos-still');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const listar = process.argv.includes('--listar');
const MIN_W = 1000;     // largura mínima da foto
// limite de fotos por tema (0 = não baixar); evita acumular o que não serve de repertório
const MAX_POR_TEMA = {
  'setores-aplicacoes': 45, 'casos-clientes': 40, 'energia-litio': 20, locacao: 5, 'inovacao-digital': 15,
  'seguranca-operador': 30, intralogistica: 25, 'empresa-noticias': 20, 'maquinas-operacao': 60,
  'maquinas-produto': 25, 'maquinas-detalhe': 0, outros: 10,
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getText = async (u) => (await fetch(u, { headers: { 'User-Agent': UA } })).text();

// ---------- páginas ----------
const sitemap = await getText('https://www.still.com.br/sitemap.xml');
const paginas = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))].filter((u) => !/\.(pdf|jpg|png)$/i.test(u));

function tema(pagina, base) {
  const p = new URL(pagina).pathname;
  const f = path.basename(base);
  if (/aplicacoes-na-industria/.test(p)) return 'setores-aplicacoes';
  if (/referencias/.test(p)) return 'casos-clientes';
  if (/seguranca|assistencia-ao-operador/.test(p)) return 'seguranca-operador';
  if (/locacao/.test(p)) return 'locacao';
  if (/sistemas-intralogisticos/.test(p)) return 'intralogistica';
  if (/sistemas-de-energia|li-ion/.test(p)) return 'energia-litio';
  if (/digitalizacao|inovacoes/.test(p)) return 'inovacao-digital';
  if (/empresa/.test(p)) return 'empresa-noticias';
  if (/empilhadeiras-novas\//.test(p) || /empilhadeiras\.html/.test(p)) {
    return /Einsatz|usecase|Anwendung|Application|Rollout|Eurospin|IMG_|_Use|Slider|Arbeits|Warehouse|Lager/i.test(f) ? 'maquinas-operacao'
      : /Teaser|Freisteller|Studio|800x800|Galerie|Gallery|diagonal|Heck|Front|Seiten|Mobile/i.test(f) ? 'maquinas-produto' : 'maquinas-detalhe';
  }
  return 'outros';
}
const IGNORAR = /icon|logo|flag|sprite|favicon|Footer|_old|Li-Ion_Technology_old|thumb|avatar|button|bg_|pattern/i;

// ---------- coleta ----------
const fotos = new Map(); // base -> { url, w, paginas:Set, tema }
for (const pg of paginas) {
  let html = '';
  try { html = (await getText(pg)).replace(/&amp;/g, '&'); } catch { continue; }
  for (const u of new Set(html.match(/https:\/\/data\.still\.de\/assets\/[^"'\s)\\]+/g) ?? [])) {
    const [base] = u.split('?');
    if (!/\.(jpe?g|png)$/i.test(base) || IGNORAR.test(base)) continue;
    const w = Number(new URL(u).searchParams.get('w') ?? 0);
    const webp = new URL(u).searchParams.get('fm') === 'webp';
    const cur = fotos.get(base);
    if (!cur) fotos.set(base, { url: u, w, webp, paginas: new Set([pg]), tema: tema(pg, base) });
    else {
      cur.paginas.add(pg);
      if (w > cur.w || (w === cur.w && cur.webp && !webp)) { cur.url = u; cur.w = w; cur.webp = webp; }
      // se a mesma foto aparece em páginas "editoriais", esse tema vence o de modelo
      if (cur.tema.startsWith('maquinas') && !tema(pg, base).startsWith('maquinas')) cur.tema = tema(pg, base);
    }
  }
  await sleep(120);
}
const dimNome = (b) => { const m = path.basename(b).match(/(\d{3,4})x(\d{3,4})/); return m ? Number(m[1]) : 0; };
const todas = [...fotos.entries()].map(([base, v]) => ({ base, ...v, larguraProvavel: Math.max(v.w, dimNome(base)) }))
  .filter((f) => f.larguraProvavel === 0 || f.larguraProvavel >= MIN_W);

const porTema = {};
for (const f of todas) (porTema[f.tema] ??= []).push(f);
console.log(`${paginas.length} páginas; ${fotos.size} fotos distintas; ${todas.length} com largura ≥ ${MIN_W}px (ou desconhecida)\n`);
for (const [t, l] of Object.entries(porTema).sort((a, b) => b[1].length - a[1].length)) console.log(String(l.length).padStart(5), t);
if (listar) process.exit(0);

// ---------- download ----------
async function dhash(buf) {
  const { data } = await sharp(buf).resize(9, 8, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  let b = ''; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) b += data[y * 9 + x] > data[y * 9 + x + 1] ? '1' : '0'; return b;
}
const dist = (a, b) => [...a].filter((c, i) => c !== b[i]).length;
const manifest = [];
const vistos = new Set(); const hashes = [];
for (const [t, lista] of Object.entries(porTema)) {
  const lim = MAX_POR_TEMA[t] ?? 10;
  if (lim === 0) continue;
  const ordenadas = lista.sort((a, b) => b.larguraProvavel - a.larguraProvavel).slice(0, lim * 2);
  let n = 0;
  for (const f of ordenadas) {
    if (n >= lim) break;
    try {
      const r = await fetch(f.url, { headers: { 'User-Agent': UA } });
      if (!r.ok) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      const meta = await sharp(buf).metadata();
      if (!meta.width || meta.width < MIN_W) continue;
      const sha = crypto.createHash('sha1').update(buf).digest('hex');
      const h = await dhash(buf);
      if (vistos.has(sha) || hashes.some((x) => dist(x, h) <= 3)) continue;
      vistos.add(sha); hashes.push(h);
      const nome = path.basename(f.base).replace(/\.\w+$/, '').replace(/[^A-Za-z0-9._-]+/g, '_').slice(0, 70);
      const dir = path.join(OUT, t);
      await fs.mkdir(dir, { recursive: true });
      const file = `${nome}.${meta.format === 'jpeg' ? 'jpg' : meta.format}`;
      await fs.writeFile(path.join(dir, file), buf);
      manifest.push({ tema: t, arquivo: `${t}/${file}`, largura: meta.width, altura: meta.height, bytes: buf.length, paginas: [...f.paginas].slice(0, 3), fonte: f.base });
      n++;
      await sleep(80);
    } catch { /* ignora */ }
  }
  console.log(`${t.padEnd(22)} ${n} baixadas`);
}
await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
const mb = manifest.reduce((s, m) => s + m.bytes, 0) / 1e6;
console.log(`\nTotal: ${manifest.length} fotos, ${mb.toFixed(0)} MB em brand_assets/fotos-still/`);
