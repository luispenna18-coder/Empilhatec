// Extrai o catálogo de empilhadeiras NOVAS do site da STILL Brasil (fonte oficial).
//
// Uso:  node still.mjs                 -> todas as categorias
//       node still.mjs rce-15-20 e-20  -> só os modelos citados (slug da URL)
//
// Saída (relativa à raiz do projeto):
//   data/catalogo/still.json                       dados de cada modelo
//   public/images/machines/still/<slug>/NN-*.ext   imagens na MAIOR definição que o site serve
//   public/datasheets/still/<slug>.pdf             ficha técnica em português
//
// A STILL só serve arquivos com URL assinada (parâmetro s=). Por isso usamos as URLs
// exatamente como aparecem na página e escolhemos, para cada imagem, a variante de
// maior largura — a mesma definição que o visitante vê no site da STILL.
import { parse } from 'node-html-parser';
import sharp from 'sharp';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const BASE = 'https://www.still.com.br';
const HUB = `${BASE}/empilhadeiras/empilhadeiras-novas.html`;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const MIN_SIDE = 300;

const onlyFichas = process.argv.includes('--fichas');
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
// galeria da página-família a somar às imagens do modelo (a Multylog usa a galeria da família FM-X)
const FAMILIA = { 'fm-x-1720': 'fm-x' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();

async function getText(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}
async function getBuf(url) {
  const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!r.ok) throw new Error(`${r.status}`);
  return { buf: Buffer.from(await r.arrayBuffer()), type: r.headers.get('content-type') ?? '' };
}

// ---------- descoberta ----------
async function discoverModels() {
  const hub = await getText(HUB);
  const cats = [...new Set([...hub.matchAll(/href="(\/empilhadeiras\/empilhadeiras-novas\/[a-z0-9-]+)\.html"/g)].map((m) => m[1]))];
  const models = new Map(); // url -> { categoria }
  for (const cat of cats) {
    let html;
    try { html = await getText(`${BASE}${cat}.html`); } catch { continue; }
    const re = new RegExp(`href="(${cat.replace(/[/]/g, '\\/')}\\/[a-z0-9-]+\\.html)"`, 'g');
    for (const m of html.matchAll(re)) models.set(`${BASE}${m[1]}`, { categoria: cat.split('/').pop() });
    await sleep(300);
  }
  return models;
}

// ---------- extração de um modelo ----------
function pickImages(rawHtml, folders) {
  const html = rawHtml.replace(/&amp;/g, '&');
  const found = [...new Set(html.match(/https:\/\/data\.still\.de\/assets\/[^"'\s)\\]+/g) ?? [])];
  const groups = new Map(); // caminho sem query -> variantes
  for (const u of found) {
    const [p] = u.split('?');
    if (!/\.(jpe?g|png)$/i.test(p) || !folders.some((f) => p.includes(`/${f}/images/`))) continue;
    if (/Footer|Logo|Icon/i.test(p)) continue;
    const w = Number(new URL(u).searchParams.get('w') ?? 0);
    const webp = new URL(u).searchParams.get('fm') === 'webp';
    const g = groups.get(p) ?? [];
    g.push({ u, w, webp });
    groups.set(p, g);
  }
  return [...groups.entries()].map(([p, variants]) => {
    // maior largura; em empate, prefere o formato original (jpg/png) ao webp
    variants.sort((a, b) => b.w - a.w || Number(a.webp) - Number(b.webp));
    return { base: p, url: variants[0].u };
  });
}

const roleOf = (p) => (/Stage/i.test(p) ? 'banner' : /Teaser/i.test(p) ? 'destaque' : /Galerie|Gallery/i.test(p) ? 'galeria'
  : /Einsatzslider/i.test(p) ? 'detalhe' : /_(SEF|USP)_/i.test(p) ? 'caracteristica' : /Einsatz|usecase/i.test(p) ? 'aplicacao' : 'outra');
const ROLE_ORDER = ['destaque', 'galeria', 'aplicacao', 'detalhe', 'caracteristica', 'banner', 'outra'];

async function scrapeModel(url, categoria) {
  const slug = url.split('/').pop().replace('.html', '');
  const html = await getText(url);
  const root = parse(html);
  const pdfs = [...new Set((html.replace(/&amp;/g, '&').match(/https:\/\/data\.still\.de\/assets\/[^"'\s)\\]+\.pdf[^"'\s)\\]*/g) ?? []))];
  // pasta do produto: aparece em /Vehicles/<Linha>/<Pasta>/(pdfs|images)/
  const folders = [...html.matchAll(/data\.still\.de\/assets\/products\/Vehicles\/[^/]+\/([^/]+)\/(?:images|pdfs?)\//g)].map((m) => m[1]);
  const counts = folders.reduce((a, f) => ((a[f] = (a[f] ?? 0) + 1), a), {});
  const folder = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const lineOf = (f) => html.match(new RegExp(`data\\.still\\.de/assets/products/Vehicles/([^/]+)/${f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/`))?.[1];
  const mainLine = folder && lineOf(folder);
  const imgFolders = Object.entries(counts).filter(([f, n]) => n >= 5 && lineOf(f) === mainLine
    && !/^(images|Safety|Driver_Assistance|vorgaengermodelle)/i.test(f)).map(([f]) => f);

  const tableEl = root.querySelector('table.content-table__main');
  const table = tableEl && {
    colunas: tableEl.querySelectorAll('.content-table__headline').map((e) => clean(e.text)),
    linhas: tableEl.querySelectorAll('tr').map((tr) => tr.querySelectorAll('td').map((c) => clean(c.text))).filter((r) => r.length),
  };
  const legendas = {};
  for (const a of root.querySelectorAll('a.content-image-gallery__item-link')) {
    const [href] = (a.getAttribute('href') ?? '').replace(/&amp;/g, '&').split('?');
    const t = clean(a.getAttribute('title'));
    if (href && t) legendas[href] = t;
  }
  const destaques = Object.fromEntries(root.querySelectorAll('li.product-stage__attribute').map((li) => [
    clean(li.querySelector('.product-stage__attribute-key')?.text), clean(li.querySelector('.product-stage__attribute-value')?.text),
  ]));
  const descricaoLonga = root.querySelectorAll('p').map((p) => clean(p.text)).sort((a, b) => b.length - a.length)[0] ?? '';

  const tokens = slug.split('-').filter(Boolean);
  const norm = (u) => u.split('?')[0].split('/').pop().toLowerCase().replace(/[^a-z0-9]/g, '');
  const tds = pdfs.filter((u) => /_TD\.pdf/i.test(u.split('?')[0]) && /_(BR|PRT|PT)[_.]/i.test(u.split('?')[0].split('/').pop()));
  // termos de letras devem aparecer no nome; os numéricos só contam se o nome do arquivo tiver números
  const matches = (u) => {
    const n = norm(u);
    if (/igo/i.test(u.split('?')[0]) && !/igo/.test(slug)) return false; // ficha de outra variante
    return tokens.every((t) => (/^[a-z]+$/.test(t) ? n.includes(t) : !/\d/.test(n) || n.includes(t)));
  };
  const datasheet = tds.filter(matches)
    .sort((a, b) => Number(/_(PRT|PT|BR)_TD/i.test(b)) - Number(/_(PRT|PT|BR)_TD/i.test(a)))[0];

  return {
    slug, url, categoria,
    tipo: clean(root.querySelector('.product-stage__text-box-headline-1')?.text),
    nome: clean(root.querySelector('.product-stage__text-box-headline-2')?.text) || clean(root.querySelector('title')?.text),
    resumo: clean(root.querySelector('meta[name="description"]')?.getAttribute('content')),
    descricao: descricaoLonga,
    destaques, tabela: table,
    imagensFonte: (imgFolders.length ? pickImages(html, imgFolders) : []).map((i) => ({ ...i, legenda: legendas[i.base] })),
    datasheetFonte: datasheet,
  };
}

// ---------- download ----------
async function download(m) {
  const imgDir = path.join(ROOT, 'public/images/machines/still', m.slug);
  const hashes = new Set();
  const imagens = [];
  let n = 0;
  const ordered = [...m.imagensFonte].sort((a, b) => ROLE_ORDER.indexOf(roleOf(a.base)) - ROLE_ORDER.indexOf(roleOf(b.base)) || a.base.localeCompare(b.base));
  for (const { base, url, legenda } of ordered) {
    try {
      const { buf, type } = await getBuf(url);
      if (!type.startsWith('image/')) continue;
      const meta = await sharp(buf).metadata();
      if (!meta.width || Math.min(meta.width, meta.height) < MIN_SIDE) continue;
      const h = crypto.createHash('sha1').update(buf).digest('hex');
      if (hashes.has(h)) continue;
      hashes.add(h);
      await fs.mkdir(imgDir, { recursive: true });
      const role = roleOf(base);
      const file = `${String(++n).padStart(2, '0')}-${role}.${meta.format === 'jpeg' ? 'jpg' : meta.format}`;
      await fs.writeFile(path.join(imgDir, file), buf);
      imagens.push({ arquivo: `/images/machines/still/${m.slug}/${file}`, papel: role, largura: meta.width, altura: meta.height, bytes: buf.length, legenda: legenda ?? null, fonte: base });
    } catch (e) { console.log(`   ! imagem falhou (${e.message}): ${base.split('/').pop()}`); }
    await sleep(150);
  }
  let datasheet = null;
  if (m.datasheetFonte) {
    try {
      const { buf, type } = await getBuf(m.datasheetFonte);
      if (type.includes('pdf') || buf.subarray(0, 4).toString() === '%PDF') {
        const dir = path.join(ROOT, 'public/datasheets/still');
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(path.join(dir, `${m.slug}.pdf`), buf);
        datasheet = { arquivo: `/datasheets/still/${m.slug}.pdf`, bytes: buf.length, fonte: m.datasheetFonte.split('?')[0] };
      }
    } catch (e) { console.log(`   ! ficha falhou: ${e.message}`); }
  }
  const { imagensFonte, datasheetFonte, ...rest } = m;
  return { ...rest, marca: 'STILL', imagens, ficha_tecnica: datasheet };
}

// ---------- execução ----------
const discovered = await discoverModels();
console.log(`Descobertos ${discovered.size} modelos em ${new Set([...discovered.values()].map((v) => v.categoria)).size} categorias`);
const targets = [...discovered].filter(([u]) => only.length === 0 || only.includes(u.split('/').pop().replace('.html', '')));

if (onlyFichas) {
  const file = path.join(ROOT, 'data/catalogo/still.json');
  const data = JSON.parse(await fs.readFile(file, 'utf8'));
  let got = 0;
  for (const m of data.filter((x) => !x.ficha_tecnica)) {
    try {
      const fresh = await scrapeModel(m.url, m.categoria);
      if (!fresh.datasheetFonte) { console.log(`– ${m.nome}: sem ficha na página`); continue; }
      const { buf, type } = await getBuf(fresh.datasheetFonte);
      if (!(type.includes('pdf') || buf.subarray(0, 4).toString() === '%PDF')) continue;
      const dir = path.join(ROOT, 'public/datasheets/still');
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, `${m.slug}.pdf`), buf);
      m.ficha_tecnica = { arquivo: `/datasheets/still/${m.slug}.pdf`, bytes: buf.length, fonte: fresh.datasheetFonte.split('?')[0] };
      got++; console.log(`✔ ${m.nome}: ficha ok`);
    } catch (e) { console.log(`✘ ${m.nome}: ${e.message}`); }
    await sleep(400);
  }
  await fs.writeFile(file, JSON.stringify(data, null, 2));
  console.log(`\nFichas novas: ${got}; ainda sem ficha: ${data.filter((x) => !x.ficha_tecnica).length}`);
  process.exit(0);
}

const out = [];
for (const [url, { categoria }] of targets) {
  try {
    const m = await scrapeModel(url, categoria);
    const famSlug = FAMILIA[m.slug];
    if (famSlug) {
      const famUrl = [...discovered.keys()].find((k) => k.endsWith(`/${famSlug}.html`));
      if (famUrl) {
        const fam = await scrapeModel(famUrl, categoria);
        const have = new Set(m.imagensFonte.map((i) => i.base));
        m.imagensFonte.push(...fam.imagensFonte.filter((i) => !have.has(i.base)));
      }
    }
    const done = await download(m);
    out.push(done);
    console.log(`✔ ${done.nome} [${categoria}] — ${done.imagens.length} imagens, ficha ${done.ficha_tecnica ? 'ok' : 'NÃO'}, tabela ${done.tabela?.linhas.length ?? 0} linhas`);
  } catch (e) { console.log(`✘ ${url}: ${e.message}`); }
  await sleep(500);
}
await fs.mkdir(path.join(ROOT, 'data/catalogo'), { recursive: true });
const file = path.join(ROOT, 'data/catalogo/still.json');
let prev = [];
if (only.length) { try { prev = JSON.parse(await fs.readFile(file, 'utf8')); } catch {} }
const merged = [...prev.filter((p) => !out.some((o) => o.slug === p.slug)), ...out];
await fs.writeFile(file, JSON.stringify(merged, null, 2));
console.log(`\nSalvo: ${path.relative(ROOT, file)} (${merged.length} modelos)`);
