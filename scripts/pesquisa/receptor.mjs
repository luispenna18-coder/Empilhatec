// Receptor local (127.0.0.1:8765). Recebe imagens e textos enviados pelo Chrome
// logado e grava em brand_assets/pesquisa-internet/<fonte>/.
//   POST /img?fonte=instagram/empilhatec_empilhadeiras&origem=<url>&legenda=<texto>  (corpo = bytes da imagem)
//   POST /texto?fonte=instagram/empilhatec_empilhadeiras&nome=legendas.md            (corpo = texto)
// Valida com sharp, descarta ícones, remove duplicadas e grava manifest-receptor.json.
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, '../../brand_assets/pesquisa-internet');
const MIN_SIDE = 400;
const LOW_RES = 1000;
const manifestFile = path.join(OUT, 'manifest-receptor.json');
let manifest = [];
try { manifest = JSON.parse(await fs.readFile(manifestFile, 'utf8')); } catch {}
const seen = new Set(manifest.map((m) => m.hash));

const safe = (s) => path.normalize(s).replace(/^(\.\.[/\\])+/, '').replace(/[^a-z0-9/_.@-]/gi, '_');
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Private-Network': 'true',
};

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const reply = (code, body = '') => { res.writeHead(code, cors); res.end(body); };
  if (req.method === 'OPTIONS') return reply(204);
  if (req.method !== 'POST') return reply(405);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks);
  const fonte = safe(url.searchParams.get('fonte') ?? 'outros');
  try {
    if (url.pathname === '/img') {
      const m = await sharp(body).metadata();
      if (!m.width || Math.min(m.width, m.height) < MIN_SIDE) return reply(200, 'ignorada: pequena');
      const hash = crypto.createHash('sha1').update(body).digest('hex').slice(0, 16);
      if (seen.has(hash)) return reply(200, 'duplicada');
      seen.add(hash);
      const dir = path.join(OUT, fonte, 'imagens');
      await fs.mkdir(dir, { recursive: true });
      const file = `${hash}.${m.format === 'jpeg' ? 'jpg' : m.format}`;
      await fs.writeFile(path.join(dir, file), body);
      manifest.push({
        hash, arquivo: path.relative(OUT, path.join(dir, file)), origem: url.searchParams.get('origem'),
        legenda: url.searchParams.get('legenda'), largura: m.width, altura: m.height, bytes: body.length,
        baixa_resolucao: Math.max(m.width, m.height) < LOW_RES,
      });
      await fs.writeFile(manifestFile, JSON.stringify(manifest, null, 2));
      return reply(200, `ok ${m.width}x${m.height}`);
    }
    if (url.pathname === '/texto') {
      const dir = path.join(OUT, fonte);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, safe(url.searchParams.get('nome') ?? 'texto.md')), body);
      return reply(200, 'ok');
    }
    reply(404);
  } catch (e) { reply(500, e.message); }
}).listen(8765, '127.0.0.1', () => console.log('Receptor em http://127.0.0.1:8765 — gravando em', OUT));
