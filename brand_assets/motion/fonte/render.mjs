// Renderiza index.html quadro a quadro (30 fps) e monta o MP4 com ffmpeg.
// Uso: node render.mjs <pasta-do-motion> <saida.mp4> [inicio] [fim] [--still t1,t2,...]
import { createRequire } from 'module';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_CORE);
const [dir, out, a = '0', b] = process.argv.slice(2);
const stillArg = process.argv.find((x) => x.startsWith('--still='));
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const srv = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (e, d) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); res.end(d); });
}).listen(0);
const port = srv.address().port;
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(`http://127.0.0.1:${port}/index.html?render`);
await page.evaluate(() => window.ready);
if (stillArg) {
  for (const t of stillArg.slice(8).split(',')) { await page.evaluate((t) => window.render(+t), +t); await page.screenshot({ path: `${out}-${t}.jpg`, type: 'jpeg', quality: 85 }); }
} else {
  const dur = b ? +b : await page.evaluate(() => window.DUR);
  const ff = spawn(process.env.FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-vf', 'scale=in_range=pc:out_range=tv,format=yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((dur - +a) * 30);
  for (let i = 0; i < n; i++) {
    const t = +a + i / 30;
    await page.evaluate((t) => window.render(t), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`quadro ${i}/${n}`);
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}
await browser.close(); srv.close();
