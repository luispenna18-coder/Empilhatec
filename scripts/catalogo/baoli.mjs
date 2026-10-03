// Extrai as 3 máquinas Baoli do catálogo (KBG 25, KBD 25-35, KBD 70) de fontes oficiais.
//
// O site brasileiro (baoli.com.br) tem fotos originais e textos, mas não tem especificações nem
// ficha. O site europeu (baoli-emea.com, em pt-PT) tem capacidade/altura e fotos assinadas no CDN
// da STILL, mas a ficha técnica dele é um configurador externo (não há PDF). Por isso combinamos:
//   - fotos e textos .......... baoli.com.br
//   - capacidade, altura ...... baoli-emea.com
//   - foto principal/galeria .. data.still.de/assets/baoli (maior largura servida)
//
// Uso: node baoli.mjs        Saída: data/catalogo/baoli.json e public/images/machines/baoli/<slug>/
import { parse } from 'node-html-parser';
import sharp from 'sharp';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const EMEA = 'https://www.baoli-emea.com/pt-PT/empilhadores/empilhadores-de-combustao-interna';
const MIN_SIDE = 300;

// slug (id da Multylog) -> fontes. O KBD 70 não tem página própria no site brasileiro.
const MAQUINAS = [
  { slug: 'kbg-25', nome: 'KBG 25', energia: 'GLP', br: 'https://baoli.com.br/product/kbg/', emea: `${EMEA}/kbd-25-35-/-kbg-25-35`, pasta: 'KBD_25-35' },
  { slug: 'kbd-25-35', nome: 'KBD 25-35', energia: 'Diesel', br: 'https://baoli.com.br/product/2-5-3-5-ton-combustao-interna/', emea: `${EMEA}/kbd-25-35-/-kbg-25-35`, pasta: 'KBD_25-35' },
  { slug: 'kbd-70', nome: 'KBD 70', energia: 'Diesel', br: 'https://baoli.com.br/product/4-0-5-0-ton-combustao-interna/', emea: `${EMEA}/kbd-50-100`, pasta: 'KBD_50-100' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
const getText = async (u) => { const r = await fetch(u, { headers: { 'User-Agent': UA }, redirect: 'follow' }); if (!r.ok) throw new Error(`${r.status} ${u}`); return r.text(); };
const getBuf = async (u) => { const r = await fetch(u, { headers: { 'User-Agent': UA }, redirect: 'follow' }); if (!r.ok) throw new Error(`${r.status}`); return { buf: Buffer.from(await r.arrayBuffer()), type: r.headers.get('content-type') ?? '' }; };

// WordPress: tira o sufixo -WIDTHxHEIGHT para chegar ao arquivo original
const wpOriginal = (u) => u.replace(/-\d+x\d+(\.\w+)$/, '$1');

async function scrape(m) {
  const imgs = new Map(); // base -> { url, papel }
  // --- site brasileiro: galeria do produto + imagens da descrição ---
  const brHtml = await getText(m.br);
  const br = parse(brHtml);
  for (const a of br.querySelectorAll('.woocommerce-product-gallery__image a')) {
    const u = a.getAttribute('href'); if (u) imgs.set(wpOriginal(u), { url: wpOriginal(u), papel: 'galeria' });
  }
  const desc = br.querySelector('#tab-description');
  for (const im of desc?.querySelectorAll('img') ?? []) {
    const u = im.getAttribute('src') ?? im.getAttribute('data-src'); if (!u) continue;
    const o = wpOriginal(u); if (!imgs.has(o)) imgs.set(o, { url: o, papel: 'caracteristica' });
  }
  // --- site europeu: destaques e imagens assinadas da pasta do produto ---
  const emeaHtml = (await getText(m.emea)).replace(/&amp;/g, '&');
  const emea = parse(emeaHtml);
  const destaques = Object.fromEntries(emea.querySelectorAll('li.product-stage__attribute').map((li) => [
    clean(li.querySelector('.product-stage__attribute-key')?.text), clean(li.querySelector('.product-stage__attribute-value')?.text)]));
  const groups = new Map();
  for (const u of new Set(emeaHtml.match(/https:\/\/data\.still\.de\/assets\/baoli\/[^"'\s)\\]+/g) ?? [])) {
    const [p] = u.split('?');
    if (!/\.(jpe?g|png)$/i.test(p) || !p.includes(`/${m.pasta}/`) || /Teaser/i.test(p)) continue;
    const w = Number(new URL(u).searchParams.get('w') ?? 0);
    const webp = new URL(u).searchParams.get('fm') === 'webp';
    const g = groups.get(p) ?? []; g.push({ u, w, webp }); groups.set(p, g);
  }
  for (const [p, v] of groups) {
    v.sort((a, b) => b.w - a.w || Number(a.webp) - Number(b.webp));
    imgs.set(p, { url: v[0].u, papel: /Header/i.test(p) ? 'destaque' : 'galeria' });
  }
  const titulo = clean(emea.querySelector('h1')?.text);
  const resumo = clean(emea.querySelector('meta[name="description"]')?.getAttribute('content'));
  const textos = emea.querySelectorAll('p').map((p) => clean(p.text)).filter((t) => t.length > 80);
  const brTexto = clean(desc?.text ?? '').replace(/^Description\s*/, '');
  return { ...m, tituloEmea: titulo, resumo, descricao: textos[0] ?? brTexto, destaques,
    caracteristicas: br.querySelectorAll('#tab-description p, #tab-description h3, #tab-description h4').map((e) => clean(e.text)).filter(Boolean),
    imagensFonte: [...imgs.entries()].map(([base, v]) => ({ base, ...v })) };
}

const ORDER = ['destaque', 'galeria', 'caracteristica'];
async function download(m) {
  const dir = path.join(ROOT, 'public/images/machines/baoli', m.slug);
  const hashes = new Set(); const imagens = []; let n = 0;
  for (const { base, url, papel } of [...m.imagensFonte].sort((a, b) => ORDER.indexOf(a.papel) - ORDER.indexOf(b.papel))) {
    try {
      const { buf, type } = await getBuf(url);
      if (!type.startsWith('image/')) continue;
      const meta = await sharp(buf).metadata();
      if (!meta.width || Math.min(meta.width, meta.height) < MIN_SIDE) continue;
      const h = crypto.createHash('sha1').update(buf).digest('hex');
      if (hashes.has(h)) continue; hashes.add(h);
      await fs.mkdir(dir, { recursive: true });
      const file = `${String(++n).padStart(2, '0')}-${papel}.${meta.format === 'jpeg' ? 'jpg' : meta.format}`;
      await fs.writeFile(path.join(dir, file), buf);
      imagens.push({ arquivo: `/images/machines/baoli/${m.slug}/${file}`, papel, largura: meta.width, altura: meta.height, bytes: buf.length, fonte: base });
    } catch (e) { console.log(`   ! ${e.message}: ${base.split('/').pop()}`); }
    await sleep(150);
  }
  const { imagensFonte, br, emea, pasta, ...rest } = m;
  return { ...rest, marca: 'Baoli', categoria: 'combustao', fontes: { brasil: br, europa: emea }, imagens, ficha_tecnica: null };
}

const out = [];
for (const m of MAQUINAS) {
  try { const d = await download(await scrape(m)); out.push(d); console.log(`✔ ${d.nome} — ${d.imagens.length} imagens, destaques ${JSON.stringify(d.destaques)}`); }
  catch (e) { console.log(`✘ ${m.nome}: ${e.message}`); }
  await sleep(400);
}
await fs.mkdir(path.join(ROOT, 'data/catalogo'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'data/catalogo/baoli.json'), JSON.stringify(out, null, 2));
console.log('Salvo: data/catalogo/baoli.json');
