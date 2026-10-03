// Gera lib/brasil-mapa.ts: contorno dos estados do Brasil como caminhos SVG (projeção simples),
// para o mapa de atendimento da Home (Amazonas e Roraima destacados).
// Fonte dos limites: GeoJSON público de estados do Brasil (dados do IBGE).
// Uso: node scripts/home/gerar-mapa.mjs
import fs from 'node:fs/promises';

const URL_GEO = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson';
const res = await fetch(URL_GEO);
if (!res.ok) throw new Error(`falha ao baixar o GeoJSON: ${res.status}`);
const geo = await res.json();

const TOL = 0.06; // graus; maior = arquivo menor
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
const nomeUF = (p) => p.name ?? p.NAME_1 ?? p.nome ?? p.sigla ?? '';
const SIGLA = { Acre:'AC', Alagoas:'AL', 'Amapá':'AP', Amazonas:'AM', Bahia:'BA', 'Ceará':'CE', 'Distrito Federal':'DF', 'Espírito Santo':'ES', 'Goiás':'GO', 'Maranhão':'MA', 'Mato Grosso':'MT', 'Mato Grosso do Sul':'MS', 'Minas Gerais':'MG', 'Pará':'PA', 'Paraíba':'PB', 'Paraná':'PR', Pernambuco:'PE', 'Piauí':'PI', 'Rio de Janeiro':'RJ', 'Rio Grande do Norte':'RN', 'Rio Grande do Sul':'RS', 'Rondônia':'RO', Roraima:'RR', 'Santa Catarina':'SC', 'São Paulo':'SP', Sergipe:'SE', Tocantins:'TO' };
for (const f of geo.features) {
  const nome = nomeUF(f.properties);
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  let d = '';
  for (const poly of polys) for (const ring of poly) {
    const proj0 = ring.map(proj);
    // anel fechado: divide no ponto mais distante do início para simplificar as duas metades
    let k = 1, far = 0;
    proj0.forEach((q, i) => { const dd = Math.hypot(q[0] - proj0[0][0], q[1] - proj0[0][1]); if (dd > far) { far = dd; k = i; } });
    const pts = [...simplify(proj0.slice(0, k + 1), TOL * K).slice(0, -1), ...simplify(proj0.slice(k), TOL * K)];
    if (pts.length < 3) continue;
    pts.forEach(([x, y], i) => {
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      d += `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
    });
    d += 'Z';
  }
  estados.push({ sigla: SIGLA[nome] ?? nome, nome, d });
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
