// Servidor local do render 3D do mapa de atendimento.
// Uso: node scripts/home/mapa-3d/servidor.mjs  →  abra http://localhost:8765 no Chrome.
// A página renderiza o mapa (render.html) e envia o PNG para cá; o servidor recorta as bordas
// transparentes e grava public/images/home/mapa-atendimento.webp.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const PASTA = path.dirname(fileURLToPath(import.meta.url));
const SAIDA = path.resolve(PASTA, '../../../public/images/home/mapa-atendimento.webp');
const LARGURA = 1400; // px da imagem final (o mapa aparece com até ~600 px de largura, 2x para telas retina)
const PORTA = 8765;

const TIPOS = { '.html': 'text/html; charset=utf-8', '.json': 'application/json', '.mjs': 'text/javascript' };

http
  .createServer(async (req, res) => {
    try {
      if (req.method === 'POST' && req.url === '/salvar') {
        const partes = [];
        for await (const parte of req) partes.push(parte);
        const png = Buffer.concat(partes);
        const recortado = await sharp(png).trim({ threshold: 1 }).toBuffer();
        const info = await sharp(recortado)
          .resize({ width: LARGURA, withoutEnlargement: true })
          .webp({ quality: 90, alphaQuality: 100, effort: 6 })
          .toFile(SAIDA);
        console.log(`gravado ${path.relative(process.cwd(), SAIDA)}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ arquivo: path.basename(SAIDA), largura: info.width, altura: info.height, kb: Math.round(info.size / 1024) }));
        return;
      }
      const nome = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'render.html';
      const arquivo = path.join(PASTA, path.normalize(nome));
      if (!arquivo.startsWith(PASTA)) throw Object.assign(new Error('fora da pasta'), { code: 'ENOENT' });
      const corpo = await fs.readFile(arquivo);
      res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(corpo);
    } catch (erro) {
      res.writeHead(erro.code === 'ENOENT' ? 404 : 500);
      res.end(String(erro.message || erro));
    }
  })
  .listen(PORTA, () => console.log(`render do mapa em http://localhost:${PORTA}`));
