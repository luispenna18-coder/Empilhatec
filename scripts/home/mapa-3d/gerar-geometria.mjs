// Gera scripts/home/mapa-3d/estados.json: o contorno de cada estado, simplificado e suavizado,
// para o render 3D do mapa de atendimento da Home (render.html).
// Cada trecho de divisa é processado uma vez só e usado pelos dois estados vizinhos,
// então as peças 3D encaixam sem frestas.
// Fonte dos limites: malha de UFs do IBGE.
// Uso: node scripts/home/mapa-3d/gerar-geometria.mjs
import fs from 'node:fs/promises';

const URL_GEO = 'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?intrarregiao=UF&qualidade=intermediaria&formato=application/vnd.geo+json';
const TOL = 0.12; // simplificação de cada trecho (graus); maior = contorno mais simples
const SUAVIZACAO = 2; // passadas de Chaikin, que arredondam os cantos
const AREA_MIN = 0.12; // ilhas isoladas menores que isso (graus²) saem do mapa
const BOCA_MAX = 0.25; // enseadas e lagoas com boca mais estreita que isso (graus) são fechadas no litoral...
const ENSEADA_MIN = 0.8; // ...desde que o contorno percorra pelo menos isso por dentro delas

// projeção simples: x = lon * cos(14°), y = lat (corrige a largura na latitude média do Brasil)
const K = Math.cos((14 * Math.PI) / 180);
const proj = ([lon, lat]) => [lon * K, lat];

const SIGLA_POR_COD = { 11:'RO',12:'AC',13:'AM',14:'RR',15:'PA',16:'AP',17:'TO',21:'MA',22:'PI',23:'CE',24:'RN',25:'PB',26:'PE',27:'AL',28:'SE',29:'BA',31:'MG',32:'ES',33:'RJ',35:'SP',41:'PR',42:'SC',43:'RS',50:'MS',51:'MT',52:'GO',53:'DF' };

const res = await fetch(URL_GEO);
if (!res.ok) throw new Error(`falha ao baixar a malha do IBGE: ${res.status}`);
const geo = await res.json();

const chave = (p) => `${p[0]},${p[1]}`;
const areaComSinal = (pts) => pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;
const area = (pts) => Math.abs(areaComSinal(pts));

// 1. anéis abertos (sem o ponto repetido do fim), por estado e polígono
const aneis = [];
const usos = new Map(); // chave do vértice -> quantos estados passam por ele
for (const f of geo.features) {
  const sigla = SIGLA_POR_COD[Number(f.properties.codarea)];
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  const vistos = new Set();
  polys.forEach((poly, pi) => poly.forEach((anel, ai) => {
    const pts = anel.slice(0, -1);
    aneis.push({ sigla, pi, ai, pts });
    for (const p of pts) { const k = chave(p); if (!vistos.has(k)) { vistos.add(k); usos.set(k, (usos.get(k) || 0) + 1); } }
  }));
}

// ilhas pequenas que não encostam em nenhum outro estado saem (com os buracos do mesmo polígono)
const fora = new Set();
for (const a of aneis) {
  if (a.ai !== 0) continue;
  const isolada = a.pts.every((p) => usos.get(chave(p)) === 1);
  if (isolada && area(a.pts) < AREA_MIN) fora.add(`${a.sigla}/${a.pi}`);
}
const validos = aneis.filter((a) => !fora.has(`${a.sigla}/${a.pi}`));

// 2. nós: vértices onde os vizinhos mudam de um anel para outro (encontro de divisas, divisa com o litoral)
const pares = new Map();
for (const { pts } of validos) {
  const n = pts.length;
  pts.forEach((p, i) => {
    const a = chave(pts[(i - 1 + n) % n]), b = chave(pts[(i + 1) % n]);
    const par = a < b ? `${a}|${b}` : `${b}|${a}`;
    const k = chave(p);
    if (!pares.has(k)) pares.set(k, new Set());
    pares.get(k).add(par);
  });
}
const ehNo = (p) => pares.get(chave(p)).size > 1;

// 3. corta cada anel nos nós; trechos iguais (em qualquer sentido) viram um só
const trechos = []; // { pts, fechado }
const indice = new Map();
function registrar(pts, fechado) {
  let seq = pts.map(chave);
  if (fechado) {
    // anel inteiro compartilhado (ex.: DF dentro de GO): normaliza início e sentido
    let m = 0; seq.forEach((k, i) => { if (k < seq[m]) m = i; });
    const giro = [...seq.slice(m), ...seq.slice(0, m)];
    const inv = [giro[0], ...giro.slice(1).reverse()];
    const usarInv = inv[1] < giro[1];
    const canon = (usarInv ? inv : giro).join(';');
    if (!indice.has(canon)) {
      const base = [...pts.slice(m), ...pts.slice(0, m)];
      indice.set(canon, trechos.push({ pts: usarInv ? [base[0], ...base.slice(1).reverse()] : base, fechado: true }) - 1);
    }
    const id = indice.get(canon);
    const proprio = [...seq.slice(m), ...seq.slice(0, m)].join(';') === trechos[id].pts.map(chave).join(';');
    return { id, invertido: !proprio };
  }
  const ida = seq.join(';'), volta = [...seq].reverse().join(';');
  const canon = ida < volta ? ida : volta;
  if (!indice.has(canon)) indice.set(canon, trechos.push({ pts: ida < volta ? pts : [...pts].reverse(), fechado: false }) - 1);
  return { id: indice.get(canon), invertido: canon !== ida };
}
for (const a of validos) {
  const nos = a.pts.map((p, i) => (ehNo(p) ? i : -1)).filter((i) => i >= 0);
  if (nos.length === 0) { a.partes = [registrar(a.pts, true)]; continue; }
  const pts = [...a.pts.slice(nos[0]), ...a.pts.slice(0, nos[0])];
  const cortes = nos.map((i) => i - nos[0]);
  a.partes = cortes.map((c, j) => registrar(pts.slice(c, (cortes[j + 1] ?? pts.length) + 1).concat(j === cortes.length - 1 ? [pts[0]] : []), false));
}

// 4. simplifica (Douglas-Peucker, pontas fixas) e suaviza (Chaikin, pontas fixas) cada trecho uma vez
function simplificar(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1e-9;
  let maxD = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / len;
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= tol) return [a, b];
  return [...simplificar(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplificar(pts.slice(idx), tol)];
}
const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
function suavizar(pts, fechado) {
  for (let it = 0; it < SUAVIZACAO; it++) {
    const out = [];
    const n = pts.length;
    if (fechado) {
      for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; out.push(lerp(p, q, 0.25), lerp(p, q, 0.75)); }
    } else {
      out.push(pts[0]);
      for (let i = 0; i < n - 1; i++) {
        if (i > 0) out.push(lerp(pts[i], pts[i + 1], 0.25));
        if (i < n - 2) out.push(lerp(pts[i], pts[i + 1], 0.75));
      }
      out.push(pts[n - 1]);
    }
    pts = out;
  }
  return pts;
}
// lado de dentro de cada trecho que pertence a um só estado (litoral e fronteira com outros países),
// no sentido em que o trecho foi guardado: +1 se o estado fica à esquerda
for (const a of validos) {
  const sentido = Math.sign(areaComSinal(a.pts));
  for (const { id, invertido } of a.partes) {
    const t = trechos[id];
    t.usos = (t.usos || 0) + 1;
    t.lado = invertido ? -sentido : sentido;
  }
}

// fecha enseadas e lagoas de boca estreita (ex.: Lagoa dos Patos), sem cortar penínsulas
function fecharEnseadas(p, lado) {
  const acum = [0];
  for (let k = 1; k < p.length; k++) acum.push(acum[k - 1] + Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]));
  const out = [];
  let i = 0;
  while (i < p.length) {
    out.push(p[i]);
    let pulo = -1;
    for (let j = p.length - 1; j > i + 1 && acum[j] - acum[i] >= ENSEADA_MIN; j--) {
      if (Math.hypot(p[j][0] - p[i][0], p[j][1] - p[i][1]) >= BOCA_MAX) continue;
      // a volta (trecho de i a j + corda) gira ao contrário do estado quando a área está fora dele: é enseada
      if (Math.sign(areaComSinal(p.slice(i, j + 1))) !== lado) { pulo = j; break; }
    }
    i = pulo > 0 ? pulo : i + 1;
  }
  return out;
}

let fechadas = 0;
for (const t of trechos) {
  let p = t.pts.map(proj);
  if (!t.fechado && t.usos === 1) {
    const n = p.length;
    p = fecharEnseadas(p, t.lado);
    if (p.length < n) fechadas++;
  }
  if (t.fechado) {
    // divide no ponto mais distante do início para simplificar as duas metades
    let k = 1, longe = 0;
    p.forEach((q, i) => { const d = Math.hypot(q[0] - p[0][0], q[1] - p[0][1]); if (d > longe) { longe = d; k = i; } });
    const s = [...simplificar(p.slice(0, k + 1), TOL).slice(0, -1), ...simplificar([...p.slice(k), p[0]], TOL).slice(0, -1)];
    t.final = suavizar(s, true);
  } else {
    t.final = suavizar(simplificar(p, TOL), false);
  }
}

// 5. remonta os anéis a partir dos trechos e agrupa por estado
const r3 = (n) => Math.round(n * 1000) / 1000;
const estados = new Map();
for (const a of validos) {
  let pts = [];
  for (const { id, invertido } of a.partes) {
    const t = trechos[id];
    let q = invertido ? [...t.final].reverse() : t.final;
    if (t.fechado && invertido) q = [q[q.length - 1], ...q.slice(0, -1)]; // mantém o mesmo ponto inicial
    pts = pts.concat(pts.length ? q.slice(1) : q);
  }
  if (!a.partes.every(({ id }) => trechos[id].fechado)) pts = pts.slice(0, -1); // o último ponto repete o primeiro
  if (pts.length < 3) continue;
  if (!estados.has(a.sigla)) estados.set(a.sigla, []);
  const polys = estados.get(a.sigla);
  if (a.ai === 0) polys[a.pi] = [pts.map(([x, y]) => [r3(x), r3(y)])];
  else polys[a.pi]?.push(pts.map(([x, y]) => [r3(x), r3(y)]));
}

const saida = [...estados].map(([sigla, polys]) => ({ sigla, poligonos: polys.filter(Boolean) }));
const total = saida.reduce((s, e) => s + e.poligonos.flat(2).length, 0);
await fs.writeFile(new URL('./estados.json', import.meta.url), JSON.stringify({ projecao: 'x = lon * cos(14°), y = lat', estados: saida }));
console.log(`${saida.length} estados, ${trechos.length} trechos de divisa, ${fora.size} ilhas removidas, ${fechadas} trechos com enseadas fechadas, ${total} pontos`);
