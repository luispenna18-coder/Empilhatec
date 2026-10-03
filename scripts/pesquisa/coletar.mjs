// Coleta informações e imagens em ALTA RESOLUÇÃO sobre a Empilhatec.
//
// Uso:  node coletar.mjs                 -> todas as fontes
//       node coletar.mjs cnpj sites      -> só as fontes listadas
//       node coletar.mjs --visivel maps  -> mostra o navegador
// Fontes: cnpj, sites, wayback, maps, instagram, facebook, linkedin
//
// As imagens NUNCA são screenshots: o script pega a URL do arquivo original
// (srcset, lazy-load, og:image, CSS, rede), tenta a versão sem redimensionamento
// e baixa o arquivo bruto. Cada imagem vai para o manifest.json com dimensões.
import { chromium } from 'playwright';
import sharp from 'sharp';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../../brand_assets/pesquisa-internet');
const MIN_SIDE = 400; // ignora ícones e thumbs
const LOW_RES = 1000; // lado maior abaixo disso é sinalizado no manifest

const CONFIG = {
  cnpj: '01119521000125',
  sites: ['https://empilhatec.com', 'https://empilhacom.com'],
  maps: 'Empilhatec Empilhadeiras Manaus',
  instagram: ['empilhatec_empilhadeiras', 'empilhatec'],
  facebook: 'https://www.facebook.com/empilhatecempilhadeiras1/',
  linkedin: 'https://www.linkedin.com/company/empilhatec-da-amazônia/',
  maxPosts: 60,
  maxPages: 40,
};

const args = process.argv.slice(2);
const visivel = args.includes('--visivel');
const chosen = args.filter((a) => !a.startsWith('--'));
const want = (s) => chosen.length === 0 || chosen.includes(s);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const jitter = (a = 1200, b = 2800) => sleep(a + Math.random() * (b - a));
const slug = (s) => s.replace(/https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 80);
const report = [];
const log = (m) => { console.log(m); report.push(m); };

// ---------- imagens ----------

// Gera URLs candidatas de maior resolução, da mais provável para a original.
function candidates(u) {
  let x;
  try { x = new URL(u); } catch { return []; }
  const out = [];
  if (/googleusercontent\.com$/.test(x.host)) out.push(u.replace(/=[^/=?]*$/, '=s0'));
  if (/-\d+x\d+\.(jpe?g|png|webp)$/i.test(x.pathname)) {
    const y = new URL(u); y.pathname = y.pathname.replace(/-\d+x\d+(\.\w+)$/, '$1'); out.push(y.href);
  }
  if (x.pathname.startsWith('/_next/image') && x.searchParams.get('url')) {
    out.push(new URL(decodeURIComponent(x.searchParams.get('url')), x.origin).href);
  }
  // CDNs assinados (Instagram/Facebook/LinkedIn): não mexer nos parâmetros
  const signed = /(cdninstagram|fbcdn|licdn)\./.test(x.host);
  if (!signed) {
    const y = new URL(u); let changed = false;
    for (const p of ['w', 'h', 'width', 'height', 'resize', 'fit', 'q', 'quality', 'size']) {
      if (y.searchParams.has(p)) { y.searchParams.delete(p); changed = true; }
    }
    if (changed) out.push(y.href);
  }
  out.push(u);
  return [...new Set(out)];
}

const seenHash = new Set();
const manifest = [];

async function fetchBest(ctx, url) {
  let best = null;
  for (const c of candidates(url).slice(0, 3)) {
    try {
      const r = await ctx.request.get(c, { timeout: 30000 });
      if (!r.ok() || !(r.headers()['content-type'] ?? '').startsWith('image/')) continue;
      const buf = await r.body();
      const m = await sharp(buf).metadata();
      if (!m.width || !m.height) continue;
      const area = m.width * m.height;
      if (!best || area > best.area) best = { url: c, buf, w: m.width, h: m.height, area, format: m.format };
    } catch { /* tenta o próximo candidato */ }
  }
  return best;
}

async function saveImages(ctx, urls, dir, origem) {
  await fs.mkdir(dir, { recursive: true });
  const list = [...new Set(urls)].filter((u) => u && !u.startsWith('data:') && !/\.svg(\?|$)/i.test(u));
  let saved = 0;
  const queue = [...list];
  const worker = async () => {
    while (queue.length) {
      const original = queue.shift();
      const img = await fetchBest(ctx, original);
      if (!img || Math.min(img.w, img.h) < MIN_SIDE) continue;
      const hash = crypto.createHash('sha1').update(img.buf).digest('hex').slice(0, 16);
      if (seenHash.has(hash)) continue;
      seenHash.add(hash);
      const ext = img.format === 'jpeg' ? 'jpg' : img.format;
      const file = `${hash}.${ext}`;
      await fs.writeFile(path.join(dir, file), img.buf);
      manifest.push({
        arquivo: path.relative(OUT, path.join(dir, file)), origem, url_original: original, url_baixada: img.url,
        largura: img.w, altura: img.h, bytes: img.buf.length, baixa_resolucao: Math.max(img.w, img.h) < LOW_RES,
      });
      saved++;
    }
  };
  await Promise.all([worker(), worker(), worker(), worker()]);
  return saved;
}

// Extrai TODAS as URLs de imagem de uma página (sem screenshot).
async function pageImages(page, rootSel = 'body') {
  return page.evaluate((rootSel) => {
    const root = document.querySelector(rootSel) ?? document.body;
    const found = new Set();
    const add = (u) => { try { if (u) found.add(new URL(u, location.href).href); } catch {} };
    const best = (set) => set.split(',').map((s) => s.trim().split(/\s+/))
      .map(([u, d]) => [u, parseFloat(d) || 1]).sort((a, b) => b[1] - a[1])[0]?.[0];
    root.querySelectorAll('img').forEach((i) => {
      add(i.currentSrc || i.src);
      if (i.srcset) add(best(i.srcset));
      for (const a of ['data-src', 'data-original', 'data-lazy-src', 'data-full', 'data-large-file', 'data-orig-file']) add(i.getAttribute(a));
    });
    root.querySelectorAll('source[srcset]').forEach((s) => add(best(s.srcset)));
    root.querySelectorAll('a[href]').forEach((a) => { if (/\.(jpe?g|png|webp)(\?|$)/i.test(a.href)) add(a.href); });
    root.querySelectorAll('*').forEach((el) => {
      const bg = getComputedStyle(el).backgroundImage;
      for (const m of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)) add(m[1]);
    });
    if (root === document.body) {
      document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]').forEach((m) => add(m.content));
      document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => {
        for (const m of s.textContent.matchAll(/"(https?:[^"]+\.(?:jpe?g|png|webp)[^"]*)"/gi)) add(m[1].replace(/\\\//g, '/'));
      });
    }
    return [...found];
  }, rootSel);
}

async function scroll(page, n = 12, x = 600, y = 500) {
  await page.mouse.move(x, y);
  for (let i = 0; i < n; i++) { await page.mouse.wheel(0, 2200); await sleep(900); }
}

const writeText = async (dir, name, text) => {
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), text);
};

// ---------- fontes ----------

async function cnpj() {
  const dir = path.join(OUT, 'cnpj');
  const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${CONFIG.cnpj}`, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) return log(`cnpj: BrasilAPI respondeu ${r.status}`);
  const d = await r.json();
  await writeText(dir, 'cnpj.json', JSON.stringify(d, null, 2));
  await writeText(dir, 'cnpj.md', [
    `# CNPJ ${d.cnpj} — ${d.razao_social}`, `- Fantasia: ${d.nome_fantasia}`, `- Abertura: ${d.data_inicio_atividade}`,
    `- Situação: ${d.descricao_situacao_cadastral}`, `- Capital social: ${d.capital_social}`, `- Porte: ${d.porte}`,
    `- CNAE principal: ${d.cnae_fiscal} ${d.cnae_fiscal_descricao}`,
    `- CNAEs secundários: ${(d.cnaes_secundarios ?? []).map((c) => `${c.codigo} ${c.descricao}`).join('; ')}`,
    `- Endereço: ${d.descricao_tipo_de_logradouro} ${d.logradouro}, ${d.numero} — ${d.bairro}, ${d.municipio}/${d.uf} · ${d.cep}`,
    `- Telefones: ${d.ddd_telefone_1} ${d.ddd_telefone_2}`, `- E-mail: ${d.email}`,
    `- Sócios: ${(d.qsa ?? []).map((s) => `${s.nome_socio} (${s.qualificacao_socio}, desde ${s.data_entrada_sociedade})`).join('; ')}`,
  ].join('\n'));
  log(`cnpj: ok (${d.razao_social})`);
}

async function sites(ctx) {
  for (const base of CONFIG.sites) {
    const dir = path.join(OUT, 'sites', slug(base));
    const origin = new URL(base).origin;
    const queue = [base]; const visited = new Set(); const imgs = [];
    const page = await ctx.newPage();
    // também captura imagens que o navegador realmente carregou
    page.on('response', (r) => { if ((r.headers()['content-type'] ?? '').startsWith('image/')) imgs.push(r.url()); });
    while (queue.length && visited.size < CONFIG.maxPages) {
      const url = queue.shift();
      if (visited.has(url)) continue;
      visited.add(url);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        await scroll(page, 6);
        imgs.push(...(await pageImages(page)));
        const text = await page.evaluate(() => document.body.innerText);
        await writeText(path.join(dir, 'paginas'), `${slug(new URL(url).pathname) || 'home'}.md`, `# ${url}\n\n${text}`);
        const links = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.href));
        for (const l of links) {
          const u = new URL(l); u.hash = '';
          if (u.origin === origin && !/\.(pdf|jpe?g|png|webp|zip)$/i.test(u.pathname)) queue.push(u.href);
        }
      } catch (e) { log(`sites: falha em ${url}: ${e.message.split('\n')[0]}`); }
    }
    await page.close();
    const n = await saveImages(ctx, imgs, path.join(dir, 'imagens'), base);
    log(`sites: ${base} — ${visited.size} páginas, ${n} imagens novas`);
  }
}

async function wayback(ctx) {
  for (const base of CONFIG.sites) {
    const host = new URL(base).host;
    const cdx = await fetch(`https://web.archive.org/cdx/search/cdx?url=${host}&output=json&filter=statuscode:200&collapse=timestamp:6&limit=60`);
    const rows = cdx.ok ? (await cdx.json()).slice(1) : [];
    log(`wayback: ${host} — ${rows.length} snapshots`);
    const dir = path.join(OUT, 'wayback', slug(host));
    const page = await ctx.newPage(); const imgs = [];
    for (const [, ts, orig] of rows.map((r) => [r[0], r[1], r[2]])) {
      try {
        await page.goto(`https://web.archive.org/web/${ts}/${orig}`, { waitUntil: 'load', timeout: 45000 });
        imgs.push(...(await pageImages(page)));
        const text = await page.evaluate(() => document.body.innerText);
        await writeText(path.join(dir, 'snapshots'), `${ts}.md`, `# ${orig} @ ${ts}\n\n${text}`);
      } catch { /* snapshot indisponível */ }
      await jitter(800, 1600);
    }
    await page.close();
    const clean = imgs.filter((u) => /web\.archive\.org\/web\/\d+/.test(u))
      .map((u) => u.replace(/(\/web\/\d+)(?:[a-z]{2}_)?\//, '$1im_/'));
    log(`wayback: ${host} — ${await saveImages(ctx, clean, path.join(dir, 'imagens'), `wayback ${host}`)} imagens novas`);
  }
}

async function maps(ctx) {
  const dir = path.join(OUT, 'google');
  const page = await ctx.newPage();
  await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(CONFIG.maps)}`, { waitUntil: 'load' });
  await jitter(2500, 4000);
  const first = page.locator('a.hfpxzc').first(); // resultado de lista, se houver
  if (await first.count()) { await first.click(); await jitter(2500, 4000); }
  await writeText(dir, 'ficha.md', `# Google Maps\n\n${await page.locator('[role="main"]').first().innerText()}`);
  const urls = new Set();
  const grab = async () => (await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('img').forEach((i) => out.push(i.src));
    document.querySelectorAll('*').forEach((el) => {
      const m = getComputedStyle(el).backgroundImage.match(/url\("?([^")]+)"?\)/); if (m) out.push(m[1]);
    });
    return out.filter((u) => /googleusercontent\.com/.test(u));
  })).forEach((u) => urls.add(u));
  try {
    await page.getByRole('tab', { name: /avalia|reviews/i }).first().click(); await jitter();
    await scroll(page, 15, 200, 500);
    await writeText(dir, 'avaliacoes.md', `# Avaliações\n\n${await page.locator('[role="main"]').first().innerText()}`);
    await grab();
    await page.getByRole('tab', { name: /vis[aã]o geral|overview/i }).first().click(); await jitter();
  } catch (e) { log(`maps: avaliações indisponíveis (${e.message.split('\n')[0]})`); }
  try {
    await page.getByRole('button', { name: /foto/i }).first().click(); await jitter(2000, 3500);
    for (let i = 0; i < 20; i++) { await grab(); await scroll(page, 2, 200, 500); }
  } catch (e) { log(`maps: galeria de fotos indisponível (${e.message.split('\n')[0]})`); }
  await page.close();
  log(`maps: ${await saveImages(ctx, [...urls], path.join(dir, 'imagens'), 'google maps')} imagens novas`);
}

async function instagram(ctx) {
  for (const user of CONFIG.instagram) {
    const dir = path.join(OUT, 'instagram', user);
    const page = await ctx.newPage();
    await page.goto(`https://www.instagram.com/${user}/`, { waitUntil: 'domcontentloaded' });
    await jitter(3000, 5000);
    if (/login/.test(page.url())) { log('instagram: sem login — rode `node login.mjs` antes'); await page.close(); return; }
    await writeText(dir, 'perfil.md', `# @${user}\n\n${await page.locator('header').first().innerText()}`);
    const posts = new Set();
    for (let i = 0; i < 25 && posts.size < CONFIG.maxPosts; i++) {
      (await page.$$eval('a[href*="/p/"],a[href*="/reel/"]', (as) => as.map((a) => a.href))).forEach((h) => posts.add(h));
      await scroll(page, 1);
    }
    const legendas = []; const imgs = [];
    for (const url of [...posts].slice(0, CONFIG.maxPosts)) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' }); await jitter(2000, 3500);
        legendas.push(`## ${url}\n\n${await page.locator('article').first().innerText()}\n`);
        for (let s = 0; s < 12; s++) { // carrossel
          imgs.push(...(await pageImages(page, 'article')));
          const next = page.locator('button[aria-label="Avançar"], button[aria-label="Next"]').first();
          if (!(await next.count())) break;
          await next.click(); await sleep(700);
        }
      } catch (e) { log(`instagram: falha em ${url}`); }
    }
    await writeText(dir, 'legendas.md', legendas.join('\n'));
    await page.close();
    log(`instagram @${user}: ${posts.size} posts, ${await saveImages(ctx, imgs, path.join(dir, 'imagens'), `instagram @${user}`)} imagens novas`);
  }
}

async function facebook(ctx) {
  const dir = path.join(OUT, 'facebook');
  const page = await ctx.newPage();
  const base = CONFIG.facebook.replace(/\/$/, '');
  for (const tab of ['', '/about', '/reviews']) {
    await page.goto(base + tab, { waitUntil: 'domcontentloaded' }); await jitter(3000, 5000);
    await writeText(dir, `${tab.slice(1) || 'pagina'}.md`, await page.evaluate(() => document.body.innerText));
  }
  await page.goto(`${base}/photos`, { waitUntil: 'domcontentloaded' }); await jitter(3000, 5000);
  await scroll(page, 15);
  const links = [...new Set(await page.$$eval('a[href*="/photo"]', (as) => as.map((a) => a.href)))].slice(0, CONFIG.maxPosts);
  const imgs = [];
  for (const l of links) {
    try {
      await page.goto(l, { waitUntil: 'domcontentloaded' }); await jitter(2000, 3500);
      imgs.push(...(await pageImages(page, '[role="main"]')));
    } catch { /* ignora */ }
  }
  await page.close();
  log(`facebook: ${links.length} fotos visitadas, ${await saveImages(ctx, imgs, path.join(dir, 'imagens'), 'facebook')} imagens novas`);
}

async function linkedin(ctx) {
  const dir = path.join(OUT, 'linkedin');
  const page = await ctx.newPage();
  const base = CONFIG.linkedin.replace(/\/$/, '');
  const imgs = [];
  for (const tab of ['/about/', '/posts/', '/people/']) {
    await page.goto(base + tab, { waitUntil: 'domcontentloaded' }); await jitter(3000, 5000);
    if (/authwall|login/.test(page.url())) { log('linkedin: sem login — rode `node login.mjs` antes'); break; }
    await scroll(page, 10);
    await writeText(dir, `${tab.replace(/\//g, '') || 'home'}.md`, await page.evaluate(() => document.body.innerText));
    imgs.push(...(await pageImages(page)));
  }
  await page.close();
  log(`linkedin: ${await saveImages(ctx, imgs, path.join(dir, 'imagens'), 'linkedin')} imagens novas`);
}

// ---------- execução ----------

await fs.mkdir(OUT, { recursive: true });
if (want('cnpj')) await cnpj().catch((e) => log(`cnpj: ${e.message}`));

const needBrowser = ['sites', 'wayback', 'maps', 'instagram', 'facebook', 'linkedin'].some(want);
if (needBrowser) {
  const ctx = await chromium.launchPersistentContext(path.join(here, '.profile'), {
    channel: 'chrome', headless: !visivel, viewport: { width: 1440, height: 1000 }, locale: 'pt-BR',
  });
  const runners = { sites, wayback, maps, instagram, facebook, linkedin };
  for (const [name, fn] of Object.entries(runners)) {
    if (!want(name)) continue;
    console.log(`\n▶ ${name}`);
    await fn(ctx).catch((e) => log(`${name}: ERRO ${e.message.split('\n')[0]}`));
  }
  await ctx.close();
}

await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
const baixa = manifest.filter((m) => m.baixa_resolucao).length;
await fs.writeFile(path.join(OUT, 'relatorio-coleta.md'),
  `# Relatório de coleta — ${new Date().toISOString()}\n\n${report.map((r) => `- ${r}`).join('\n')}\n\n` +
  `Imagens: ${manifest.length} (${baixa} abaixo de ${LOW_RES}px — ver manifest.json)\n`);
console.log(`\nConcluído: ${manifest.length} imagens, ${baixa} em baixa resolução. Relatório em ${path.relative(process.cwd(), path.join(OUT, 'relatorio-coleta.md'))}`);
