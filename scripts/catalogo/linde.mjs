// Extrai o catálogo de empilhadeiras NOVAS do site da Linde Material Handling Brasil.
//
// Uso:  node linde.mjs                    -> todas as categorias
//       node linde.mjs h20-h35 t20-t25    -> só as linhas citadas (final da URL, minúsculo)
//       node linde.mjs --fichas           -> só tenta baixar fichas técnicas que faltam
//
// Saída (relativa à raiz do projeto):
//   data/catalogo/linde.json
//   public/images/machines/linde/<slug>/NN-*.ext   maior largura disponível (até 1920 px)
//   public/datasheets/linde/<slug>.pdf             folha de dados (folheto fica só como link)
//
// Observação: o site brasileiro da Linde monta o menu com JavaScript e hospeda mídia em
// linde-mh.pt; por isso as categorias são lidas com navegador (Playwright) e as páginas de
// linha com HTTP simples. Os textos da Linde vêm em português de Portugal.
import { chromium } from 'playwright';
import { parse } from 'node-html-parser';
import sharp from 'sharp';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const ORIGIN = 'https://www.linde-mh.com.br';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const MIN_SIDE = 300;

const CATEGORIAS = [
  'Empilhadeiras-Eletricas', 'Empilhadeiras-a-combustao', 'Empilhadeiras-Patoladas', 'Empilhadeiras-retrateis',
  'Transpaleteiras', 'Selecionadora-de-Pedidos', 'Equipamentos-para-corredores-estreitos', 'Rebocadores',
  'Comboios-logisticos', 'Empilhadeiras-com-protecao-contra-explosao', 'Equipamentos-automatizados',
];

const args = process.argv.slice(2);
const onlyFichas = args.includes('--fichas');
const only = args.filter((a) => !a.startsWith('--')).map((a) => a.toLowerCase());
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

// ---------- descoberta (navegador) ----------
async function discoverLines() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ locale: 'pt-BR' });
  const lines = new Map(); // url -> categoria
  for (const cat of CATEGORIAS) {
    const catUrl = `${ORIGIN}/pt_br/Produtos/${cat}/`;
    try {
      await page.goto(catUrl, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(1500);
      const hrefs = await page.$$eval('a[href]', (as) => [...new Set(as.map((a) => a.href.split('#')[0].split('?')[0]))]);
      const re = new RegExp(`/pt_br/Produtos/${cat}/([^/]+)/$`, 'i');
      const found = hrefs.filter((h) => re.test(h));
      if (found.length) found.forEach((h) => lines.set(h, cat));
      else lines.set(catUrl, cat); // categoria sem subpáginas: a própria página é o produto
      console.log(`  ${cat}: ${found.length || 1}`);
    } catch (e) { console.log(`  ${cat}: falhou (${e.message.split('\n')[0]})`); }
  }
  await browser.close();
  // complemento: links estáticos do hub e de cada categoria (a lista renderizada varia entre execuções)
  const staticPages = [`${ORIGIN}/pt_br/Produtos/Empilhadeiras/`, ...CATEGORIAS.map((c) => `${ORIGIN}/pt_br/Produtos/${c}/`)];
  for (const pg of staticPages) {
    const html = await getText(pg).catch(() => '');
    for (const m of html.matchAll(/href="(?:https:\/\/www\.linde-mh\.com\.br)?(\/pt_br\/Produtos\/([^\/"#?]+)\/([^\/"#?]+)\/)"/g)) {
      const cat = CATEGORIAS.find((c) => c.toLowerCase() === m[2].toLowerCase());
      if (cat && ![...lines.keys()].some((k) => k.toLowerCase() === `${ORIGIN}${m[1]}`.toLowerCase())) lines.set(`${ORIGIN}${m[1]}`, cat);
    }
  }
  // se a própria categoria foi tratada como produto mas existem linhas, remove a entrada da categoria
  for (const cat of CATEGORIAS) {
    const catUrl = `${ORIGIN}/pt_br/Produtos/${cat}/`;
    if (lines.has(catUrl) && [...lines.keys()].some((k) => k !== catUrl && k.toLowerCase().startsWith(catUrl.toLowerCase()))) lines.delete(catUrl);
  }
  return lines;
}

// ---------- extração de uma linha ----------
function imagesFrom(region, papelPadrao) {
  const groups = new Map(); // base -> { url, w }
  for (const m of region.matchAll(/https:\/\/www\.linde-mh\.(?:pt|com\.br)\/media\/[^"'\s,)]+?\.(?:jpe?g|png|webp)/gi)) {
    const u = m[0];
    if (/Videothumbnails|turntables|layoutmedia|Logo|icon/i.test(u)) continue;
    const w = Number(u.match(/w(\d+)\.\w+$/)?.[1] ?? 0);
    const base = u.replace(/w\d+(\.\w+)$/, '$1');
    const cur = groups.get(base);
    if (!cur || w > cur.w) groups.set(base, { url: u, w, papel: papelPadrao });
  }
  return groups;
}

async function scrapeLine(url, categoria) {
  const html = await getText(url);
  const root = parse(html);
  const line = url.replace(/\/$/, '').split('/').pop();
  const nome = clean(root.querySelector('h1')?.text);

  const iH1 = html.indexOf('<h1');
  const iTable = html.indexOf('<table class="tbl"');
  const token = line.toLowerCase().replace(/-(d|ds|p|r)$/i, '');
  const tokenRe = new RegExp(token.replace(/[-_]/g, '[-_]'), 'i');
  const all = new Map();
  const put = (map, papel) => { for (const [b, v] of map) if (!all.has(b)) all.set(b, { ...v, papel }); };

  // 1) destaque: teaser da própria linha (og:image ou primeiro teaser do <head>)
  const headSlice = html.slice(0, 6000);
  const og = root.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? headSlice.match(/https:\/\/www\.linde-mh\.(?:pt|com\.br)\/media\/3D_Product\/Teaser\/[^"'\s,)]+?\.(?:png|jpe?g)/)?.[0];
  if (og) put(imagesFrom(og, 'destaque'), 'destaque');
  // 2) galeria: itens do media-browser que não são vídeo
  const gal = new Map();
  for (const item of root.querySelectorAll('.media-browser__item')) {
    if (item.querySelector('[data-video-url]')) continue;
    for (const [b, v] of imagesFrom(item.outerHTML, 'galeria')) gal.set(b, v);
  }
  put(gal, 'galeria');
  // 3) características e 4) aplicações da linha (entre o título e o fim da tabela, ou com o nome da linha no caminho)
  const mid = iH1 > 0 ? html.slice(iH1, iTable > iH1 ? iTable + 20 : iH1 + 80000) : '';
  const feat = new Map();
  for (const [b, v] of imagesFrom(mid, 'caracteristica')) if (/Features|Highlights|Detail/i.test(b)) feat.set(b, v);
  put(feat, 'caracteristica');
  const apps = new Map();
  for (const [b, v] of imagesFrom(html.slice(iH1 > 0 ? iH1 : 0), 'aplicacao')) if (/Global-Content/.test(b) && tokenRe.test(b)) apps.set(b, v);
  put(apps, 'aplicacao');
  // 5) giro 360°: dois ângulos do turntable do produto
  const tt = html.match(/https:\/\/www\.linde-mh\.(?:pt|com\.br)\/media\/3D_Product\/turntables\/[^"'\s,)]+?_(\d{5})_1x1(?:w\d+)?\.png/);
  if (tt) {
    for (const f of [0, 18]) {
      const num = String(f).padStart(5, '0');
      const u = tt[0].replace(/_(\d{5})_1x1(?:w\d+)?\.png/, `_${num}_1x1w1920.png`);
      all.set(u, { url: u, w: 1920, papel: 'giro' });
    }
  }

  const pdfs = [...html.matchAll(/href="(https:\/\/[^"]+\.pdf)"/g)].map((m) => m[1]);
  const datasheet = pdfs.find((u) => /Datasheets/i.test(u));
  const brochure = pdfs.find((u) => /Brochures/i.test(u));

  const tableEl = root.querySelector('table.tbl');
  const tabela = tableEl && {
    colunas: tableEl.querySelectorAll('thead th').map((e) => clean(e.text)),
    linhas: tableEl.querySelectorAll('tbody tr').map((tr) => tr.querySelectorAll('td').map((c) => clean(c.text))),
  };

  // destaques do cabeçalho: pares número/unidade antes do título (ex.: 3.500 kg, 7.780 mm)
  const lines = root.text.split('\n').map(clean).filter(Boolean);
  const hi = lines.findIndex((l, i) => l === nome && lines.slice(i, i + 8).some((x) => /Pedir orçamento/.test(x)));
  const destaques = [];
  if (hi > 4) {
    const w = lines.slice(Math.max(0, hi - 10), hi);
    for (let i = 0; i < w.length - 1; i++) if (/^[\d.,]+$/.test(w[i]) && /^(kg|mm|t|km\/h)$/.test(w[i + 1])) destaques.push(`${w[i]} ${w[i + 1]}`);
  }
  const longos = root.querySelectorAll('p, .rte, div').map((e) => clean(e.text)).filter((t) => t.length > 250 && t.length < 1800);
  const descricao = [...root.querySelectorAll('p')].map((p) => clean(p.text)).sort((a, b) => b.length - a.length)[0] ?? longos[0] ?? '';

  return {
    slug: `linde-${line.toLowerCase()}`, linha: line, url, categoria, nome,
    resumo: clean(root.querySelector('meta[name="description"]')?.getAttribute('content')),
    descricao, destaques, tabela,
    imagensFonte: [...all.entries()].map(([base, v]) => ({ base, url: v.url, papel: v.papel })),
    datasheetFonte: datasheet, folhetoFonte: brochure,
  };
}

// ---------- download ----------
const ORDER = ['destaque', 'galeria', 'aplicacao', 'caracteristica', 'giro'];
async function download(m) {
  const imgDir = path.join(ROOT, 'public/images/machines/linde', m.slug);
  const hashes = new Set();
  const imagens = [];
  let n = 0;
  const ordered = [...m.imagensFonte].sort((a, b) => ORDER.indexOf(a.papel) - ORDER.indexOf(b.papel));
  for (const { base, url, papel } of ordered) {
    try {
      const { buf, type } = await getBuf(url);
      if (!type.startsWith('image/')) continue;
      const meta = await sharp(buf).metadata();
      if (!meta.width || Math.min(meta.width, meta.height) < MIN_SIDE) continue;
      const h = crypto.createHash('sha1').update(buf).digest('hex');
      if (hashes.has(h)) continue;
      hashes.add(h);
      await fs.mkdir(imgDir, { recursive: true });
      const file = `${String(++n).padStart(2, '0')}-${papel}.${meta.format === 'jpeg' ? 'jpg' : meta.format}`;
      await fs.writeFile(path.join(imgDir, file), buf);
      imagens.push({ arquivo: `/images/machines/linde/${m.slug}/${file}`, papel, largura: meta.width, altura: meta.height, bytes: buf.length, fonte: base });
    } catch (e) { console.log(`   ! imagem falhou (${e.message}): ${base.split('/').pop()}`); }
    await sleep(120);
  }
  const ficha = await downloadDatasheet(m);
  const { imagensFonte, datasheetFonte, folhetoFonte, ...rest } = m;
  return { ...rest, marca: 'Linde', imagens, ficha_tecnica: ficha, folheto_url: folhetoFonte ?? null };
}

async function downloadDatasheet(m) {
  if (!m.datasheetFonte) return null;
  try {
    const { buf, type } = await getBuf(m.datasheetFonte);
    if (!(type.includes('pdf') || buf.subarray(0, 4).toString() === '%PDF')) return null;
    const dir = path.join(ROOT, 'public/datasheets/linde');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${m.slug}.pdf`), buf);
    return { arquivo: `/datasheets/linde/${m.slug}.pdf`, bytes: buf.length, fonte: m.datasheetFonte };
  } catch (e) { console.log(`   ! ficha falhou: ${e.message}`); return null; }
}

// ---------- execução ----------
const file = path.join(ROOT, 'data/catalogo/linde.json');

if (onlyFichas) {
  const data = JSON.parse(await fs.readFile(file, 'utf8'));
  let got = 0;
  for (const m of data.filter((x) => !x.ficha_tecnica)) {
    const fresh = await scrapeLine(m.url, m.categoria).catch(() => null);
    const f = fresh && (await downloadDatasheet(fresh));
    if (f) { m.ficha_tecnica = f; got++; console.log(`✔ ${m.nome}: ficha ok`); } else console.log(`– ${m.nome}: sem ficha`);
  }
  await fs.writeFile(file, JSON.stringify(data, null, 2));
  console.log(`Fichas novas: ${got}`);
  process.exit(0);
}

console.log('Descobrindo linhas por categoria…');
const discovered = await discoverLines();
if (args.includes('--listar')) { console.log([...discovered.keys()].map((k) => k.replace(`${ORIGIN}/pt_br/Produtos/`, '')).join('\n')); process.exit(0); }
const targets = [...discovered].filter(([u]) => only.length === 0 || only.includes(u.replace(/\/$/, '').split('/').pop().toLowerCase()));
console.log(`${targets.length} linhas a processar`); if (!targets.length) console.log('chaves:', [...discovered.keys()].slice(0, 8));

const out = [];
for (const [url, categoria] of targets) {
  try {
    const m = await scrapeLine(url, categoria);
    const done = await download(m);
    out.push(done);
    console.log(`✔ ${done.nome} [${categoria}] — ${done.imagens.length} imagens, ficha ${done.ficha_tecnica ? 'ok' : 'NÃO'}, tabela ${done.tabela?.linhas.length ?? 0} linhas`);
  } catch (e) { console.log(`✘ ${url}: ${e.message}`); }
  await sleep(500);
}
await fs.mkdir(path.dirname(file), { recursive: true });
let prev = [];
if (only.length) { try { prev = JSON.parse(await fs.readFile(file, 'utf8')); } catch {} }
const merged = [...prev.filter((p) => !out.some((o) => o.slug === p.slug)), ...out];
await fs.writeFile(file, JSON.stringify(merged, null, 2));
console.log(`\nSalvo: ${path.relative(ROOT, file)} (${merged.length} linhas)`);
