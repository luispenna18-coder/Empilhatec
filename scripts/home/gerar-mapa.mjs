// Gera lib/brasil-mapa.ts: contorno dos estados do Brasil como caminhos SVG (projeção simples),
// para o mapa de atendimento da Home (Amazonas e Roraima destacados).
// Fonte dos limites: GeoJSON público de estados do Brasil (dados do IBGE).
// Uso: node scripts/home/gerar-mapa.mjs
import fs from 'node:fs/promises';

const URL_GEO = 'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?intrarregiao=UF&qualidade=intermediaria&formato=application/vnd.geo+json';
const res = await fetch(URL_GEO);
if (!res.ok) throw new Error(`falha ao baixar o GeoJSON: ${res.status}`);
const geo = await res.json();

const TOL = 0.055; // graus; maior = arquivo menor
const LAT0 = (-14 * Math.PI) / 180;
const K = Math.cos(LAT0);
const proj = ([lon, lat]) => [lon * K, -lat];

function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let maxD = 0, idx = 0;
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1e-9;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / len;
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= tol) return [a, b];
  return [...simplify(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplify(pts.slice(idx), tol)];
}

const estados = [];
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
const SIGLA_POR_COD = { 11:'RO',12:'AC',13:'AM',14:'RR',15:'PA',16:'AP',17:'TO',21:'MA',22:'PI',23:'CE',24:'RN',25:'PB',26:'PE',27:'AL',28:'SE',29:'BA',31:'MG',32:'ES',33:'RJ',35:'SP',41:'PR',42:'SC',43:'RS',50:'MS',51:'MT',52:'GO',53:'DF' };
for (const f of geo.features) {
  const sigla = SIGLA_POR_COD[Number(f.properties.codarea)];
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  let d = '';
  for (const poly of polys) for (const ring of poly) {
    const proj0 = ring.map(proj);
    // anel fechado: divide no ponto mais distante do início para simplificar as duas metades
    let k = 1, far = 0;
    proj0.forEach((q, i) => { const dd = Math.hypot(q[0] - proj0[0][0], q[1] - proj0[0][1]); if (dd > far) { far = dd; k = i; } });
    const pts = [...simplify(proj0.slice(0, k + 1), TOL * K).slice(0, -1), ...simplify(proj0.slice(k), TOL * K)];
    if (pts.length < 3) continue;
    pts.forEach(([x, y]) => { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); });
    const f2 = (n) => n.toFixed(2);
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const m0 = mid(pts[0], pts[1]);
    d += `M${f2(m0[0])} ${f2(m0[1])}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length], m = mid(p, q);
      d += `Q${f2(p[0])} ${f2(p[1])} ${f2(m[0])} ${f2(m[1])}`;
    }
    d += 'Z';
  }
  estados.push({ sigla, nome: sigla, d });
}
const pad = 1;
const [vx, vy, vw, vh] = [minX - pad, minY - pad, maxX - minX + 2 * pad, maxY - minY + 2 * pad];
const [mx, my] = proj([-59.9936, -3.110039]); // Empilhatec, Manaus
const out = `// ARQUIVO GERADO por scripts/home/gerar-mapa.mjs — não edite à mão.
export const BRASIL_VIEWBOX = "${vx.toFixed(2)} ${vy.toFixed(2)} ${vw.toFixed(2)} ${vh.toFixed(2)}";
export const MANAUS = { x: ${mx.toFixed(2)}, y: ${my.toFixed(2)} };
export const ESTADOS: { sigla: string; nome: string; d: string }[] = ${JSON.stringify(estados)};
`;
await fs.writeFile(new URL('../../lib/brasil-mapa.ts', import.meta.url), out);
console.log(`${estados.length} estados; ${(out.length / 1024).toFixed(0)} KB; viewBox ${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`);
console.log('siglas:', estados.map((e) => e.sigla).join(' '));
