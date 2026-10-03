// Extrai a plataforma tesoura Skyjack SJ4726/32 E do site oficial (skyjack.com).
//
// Uso: node skyjack.mjs   Saída: data/catalogo/skyjack.json, public/images/machines/skyjack/<slug>/,
//                         public/datasheets/skyjack/<slug>.pdf (a "Specs Sheet", que a Skyjack só publica em inglês)
//
// As imagens do giro 360° vêm em estilo reduzido (max_650x650); removemos o estilo para obter o
// arquivo original.
import { parse } from 'node-html-parser';
import sharp from 'sharp';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const ORIGIN = 'https://www.skyjack.com';
const URL_PAGE = `${ORIGIN}/product/sj472632-e`;
const SLUG = 'sj4726-32-e';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
const get = async (u) => { const r = await fetch(u, { headers: { 'User-Agent': UA }, redirect: 'follow' }); if (!r.ok) throw new Error(`${r.status} ${u}`); return r; };

const html = await (await get(URL_PAGE)).text();
const root = parse(html);

// especificações: linhas "rótulo | SJ4726 E | SJ4732 E"
const spec = root.querySelectorAll('table').map((t) => ({
  colunas: t.querySelectorAll('thead th').map((e) => clean(e.text)),
  linhas: t.querySelectorAll('tr').map((tr) => tr.querySelectorAll('td, th').map((c) => clean(c.text))).filter((r) => r.length > 1),
})).filter((t) => t.linhas.length);

// imagens: giro 360° (quadros) sem o estilo reduzido
const frames = [...new Set((html.match(/\/sites\/default\/files\/styles\/[^/]+\/public\/[^"'\s)?]*sj4726e_360_\d+\.png/g) ?? []))]
  .map((p) => `${ORIGIN}${p.replace(/\/styles\/[^/]+\/public\//, '/')}`).sort();
// escolhe 5 quadros espaçados (como a Multylog), mais um de frente
const pick = [0, 3, 6, 9, 12].map((i) => frames[Math.min(i, frames.length - 1)]).filter((v, i, a) => v && a.indexOf(v) === i);

const dirImg = path.join(ROOT, 'public/images/machines/skyjack', SLUG);
await fs.mkdir(dirImg, { recursive: true });
const imagens = []; const seen = new Set(); let n = 0;
for (const u of pick) {
  try {
    const buf = Buffer.from(await (await get(u)).arrayBuffer());
    const meta = await sharp(buf).metadata();
    const h = crypto.createHash('sha1').update(buf).digest('hex'); if (seen.has(h)) continue; seen.add(h);
    const file = `${String(++n).padStart(2, '0')}-giro.png`;
    await fs.writeFile(path.join(dirImg, file), buf);
    imagens.push({ arquivo: `/images/machines/skyjack/${SLUG}/${file}`, papel: 'giro', largura: meta.width, altura: meta.height, bytes: buf.length, fonte: u });
  } catch (e) { console.log(`   ! ${e.message}`); }
}

// PDFs
const pdfs = [...html.matchAll(/<a[^>]*href="([^"]+\.pdf)"[^>]*>[\s\S]*?<label>([^<]+)<\/label>/g)].map((m) => ({ url: new URL(m[1], ORIGIN).href, rotulo: clean(m[2]) }));
let ficha = null;
const sheet = pdfs.find((p) => /SPECS SHEET/i.test(p.rotulo));
if (sheet) {
  const buf = Buffer.from(await (await get(sheet.url)).arrayBuffer());
  const dir = path.join(ROOT, 'public/datasheets/skyjack'); await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `${SLUG}.pdf`), buf);
  ficha = { arquivo: `/datasheets/skyjack/${SLUG}.pdf`, bytes: buf.length, fonte: sheet.url, idioma: 'en' };
}

const dado = {
  slug: SLUG, marca: 'Skyjack', categoria: 'plataforma-elevatoria', url: URL_PAGE,
  nome: clean(root.querySelector('h1')?.text) || 'SJ4726/32 E',
  resumo: clean(root.querySelector('meta[name="description"]')?.getAttribute('content')),
  tabela: spec, imagens, ficha_tecnica: ficha, folhetos: pdfs.filter((p) => p !== sheet).map((p) => ({ rotulo: p.rotulo, url: p.url })),
};
await fs.mkdir(path.join(ROOT, 'data/catalogo'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'data/catalogo/skyjack.json'), JSON.stringify([dado], null, 2));
console.log(`✔ ${dado.nome} — ${imagens.length} imagens (frames disponíveis ${frames.length}), ficha ${ficha ? 'ok' : 'NÃO'}, tabelas ${spec.length}`);
