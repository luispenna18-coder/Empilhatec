// Reproduz o carrossel de cada máquina com as mesmas fotos que a Multylog exibe, mas baixando
// cada arquivo DIRETO do servidor do fabricante, na maior definição que ele serve.
//
// A lista de fotos vem de multylog-site/lib/products.ts (só os endereços; nenhum arquivo é
// baixado da Multylog). Endereços de quem não é fabricante (arquivos locais da Multylog,
// revendas) são ignorados e registrados em `puladas`.
//
// Uso: node galeria.mjs        Saída: public/images/machines/<marca>/<slug>/ref-NN.ext e
//                              data/catalogo/galeria.json
import { parse } from 'node-html-parser';
import sharp from 'sharp';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const MULTYLOG = '/Users/luispenna/Library/CloudStorage/OneDrive-Insper-InstitutodeEnsinoePesquisa/projetos/multylog-site/lib/products.ts';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const MIN_SIDE = 300;
const MAPA = {
  'fm-x-1720': 'fmx-17-20', 'rce-20-25': 'rce-20-25', 'rc-44-25-c': 'rc-44-25c', 'egv-16-ng': 'egv-16-ng',
  'egv-16-sf': 'egv16-sf', 'erx-27': 'erx-27', 'exh-20': 'exh-20', 'exh-sf-20c': 'exh-sf-20', 'ech-15c': 'ech-20',
  'opx-20-25': 'opx-25', 'ltx-50': 'ltx-50', 'linde-h20-h35': 'linde-h20-h35', 'linde-h50-h80-evo': 'linde-h50-h80',
  'linde-t14-s-t20-t25-s-sf': 'linde-t20-t25', 'kbg-25': 'kbg-25', 'kbd-25-35': 'kbd-25-35', 'kbd-70': 'kbd-70', 'sj4726-32-e': 'sj4726-32-e',
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getBuf = async (u) => {
  const r = await fetch(u, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!r.ok) throw new Error(String(r.status));
  const type = r.headers.get('content-type') ?? '';
  if (!type.startsWith('image/')) throw new Error(`tipo ${type}`);
  return Buffer.from(await r.arrayBuffer());
};
const wParam = (u) => Number(new URL(u).searchParams.get('w') ?? 0);

// ---------- índice das páginas da STILL: caminho sem query -> melhor URL assinada ----------
async function indexarStill() {
  const idx = new Map();
  const add = (html) => {
    for (const u of new Set(html.replace(/&amp;/g, '&').match(/https:\/\/data\.still\.de\/assets\/[^"'\s)\\]+/g) ?? [])) {
      const [p] = u.split('?');
      if (!/\.(jpe?g|png)$/i.test(p)) continue;
      const cur = idx.get(p);
      const webp = new URL(u).searchParams.get('fm') === 'webp';
      if (!cur || wParam(u) > cur.w || (wParam(u) === cur.w && cur.webp && !webp)) idx.set(p, { url: u, w: wParam(u), webp });
    }
  };
  const get = async (u) => (await fetch(u, { headers: { 'User-Agent': UA } })).text();
  const hub = await get('https://www.still.com.br/empilhadeiras/empilhadeiras-novas.html');
  const cats = [...new Set([...hub.matchAll(/href="(\/empilhadeiras\/empilhadeiras-novas\/[a-z0-9-]+)\.html"/g)].map((m) => m[1]))];
  const pages = [];
  for (const c of cats) {
    const h = await get(`https://www.still.com.br${c}.html`).catch(() => '');
    add(h);
    for (const m of h.matchAll(new RegExp(`href="(${c.replace(/\//g, '\\/')}\\/[a-z0-9-]+\\.html)"`, 'g'))) pages.push(`https://www.still.com.br${m[1]}`);
    await sleep(150);
  }
  for (const p of [...new Set(pages)]) { add(await get(p).catch(() => '')); await sleep(150); }
  for (const e of ['kbd-25-35-/-kbg-25-35', 'kbd-50-100']) add(await get(`https://www.baoli-emea.com/pt-PT/empilhadores/empilhadores-de-combustao-interna/${e}`).catch(() => ''));
  return idx;
}

// ---------- candidatos de download por origem, do melhor para o pior ----------
function candidatos(url, idx) {
  const u = new URL(url);
  const lista = [];
  if (u.host === 'data.still.de') {
    const [p] = url.split('?');
    const melhor = idx.get(p);
    if (melhor && melhor.w >= wParam(url)) lista.push(melhor.url);
    lista.push(url);
  } else if (/(^|\.)linde-mh\.(com|pt)$/.test(u.host)) {
    for (const w of [1920, 1280, 960]) lista.push(url.replace(/w\d+(\.\w+)$/, `w${w}$1`));
    lista.push(url);
  } else if (u.host === 'baoli.com.br') {
    lista.push(url.replace(/-\d+x\d+(\.\w+)$/, '$1'), url);
  }
  return [...new Set(lista)];
}
const fabricante = (url) => !url.startsWith('/') && /^(data\.still\.de|(www\.)?linde-mh\.(com|pt)|baoli\.com\.br)$/.test(new URL(url).host);

async function dhash(buf) {
  const { data } = await sharp(buf).resize(9, 8, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  let b = '';
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) b += data[y * 9 + x] > data[y * 9 + x + 1] ? '1' : '0';
  return b;
}
const dist = (a, b) => [...a].filter((c, i) => c !== b[i]).length;

// ---------- execução ----------
console.log('Indexando páginas da STILL…');
const idx = await indexarStill();
console.log(`  ${idx.size} imagens indexadas`);

const { PRODUCTS: REF } = await import(MULTYLOG);
const dados = [];
for (const f of ['still', 'linde', 'baoli']) dados.push(...JSON.parse(await fs.readFile(path.join(ROOT, `data/catalogo/${f}.json`), 'utf8')));

const saida = {};
for (const d of dados) {
  const id = MAPA[d.slug];
  const ref = REF.find((p) => p.id === id);
  const marcaDir = d.marca.toLowerCase();
  const dir = path.join(ROOT, 'public/images/machines', marcaDir, d.slug);
  await fs.mkdir(dir, { recursive: true });
  const refs = [ref.image, ...(ref.gallery ?? [])].filter(Boolean);
  const itens = [], puladas = [], hashes = new Set(), dh = [];
  let n = 0;
  for (const [ordem, url] of refs.entries()) {
    if (!fabricante(url)) { puladas.push(url); continue; }
    let buf = null, usada = null;
    for (const c of candidatos(url, idx)) {
      try { buf = await getBuf(c); usada = c; break; } catch { /* tenta o próximo */ }
    }
    if (!buf) { puladas.push(`${url} (falhou)`); continue; }
    const meta = await sharp(buf).metadata();
    const minimo = new URL(url).host === 'baoli.com.br' ? 150 : MIN_SIDE; // ícones de características da Baoli são pequenos no próprio site
    if (!meta.width || Math.min(meta.width, meta.height) < minimo) { puladas.push(`${url} (pequena)`); continue; }
    const sha = crypto.createHash('sha1').update(buf).digest('hex');
    const h = await dhash(buf);
    if (hashes.has(sha)) continue; // arquivo idêntico repetido
    hashes.add(sha); dh.push(h);
    const file = `ref-${String(++n).padStart(2, '0')}.${meta.format === 'jpeg' ? 'jpg' : meta.format}`;
    await fs.writeFile(path.join(dir, file), buf);
    itens.push({ arquivo: `/images/machines/${marcaDir}/${d.slug}/${file}`, largura: meta.width, altura: meta.height, bytes: buf.length, ordem, fonte: usada.split('?')[0] });
    await sleep(100);
  }
  saida[id] = { itens, puladas };
  console.log(`${id.padEnd(14)} multylog ${String(refs.length).padStart(2)} | baixadas ${String(itens.length).padStart(2)} | puladas ${puladas.length}  ${itens.map((i) => i.largura).join(',')}`);
}
await fs.writeFile(path.join(ROOT, 'data/catalogo/galeria.json'), JSON.stringify(saida, null, 2));
console.log('Salvo: data/catalogo/galeria.json');
