import { BRASIL_VIEWBOX, ESTADOS, MANAUS } from "@/lib/brasil-mapa";
import { whatsappLink } from "@/lib/constants";

const ATENDIDOS = new Set(["AM", "RR"]);
const CINZA = ESTADOS.filter((e) => !ATENDIDOS.has(e.sigla));
const LARANJA = ESTADOS.filter((e) => ATENDIDOS.has(e.sigla));

// mesma projeção de scripts/home/gerar-mapa.mjs: x = lon * cos(14°), y = -lat
const K = Math.cos((14 * Math.PI) / 180);
const pos = (lon: number, lat: number) => ({ x: lon * K, y: -lat });
const ROTULOS = [
  { sigla: "AM", ...pos(-64.6, -4.2), size: 2.6 },
  { sigla: "RR", ...pos(-61.1, 2.2), size: 1.5 },
];

const CAMADAS = 20; // espessura do relevo
const DX = 0.03;
const DY = 0.055;

const ESTADOS_CARDS = [
  { sigla: "AM", nome: "Amazonas", cidade: "Manaus (sede)" },
  { sigla: "RR", nome: "Roraima", cidade: "Boa Vista" },
];

export default function CoverageMap() {
  return (
    <section className="section-py bg-[#EFEFF2]">
      <div className="site-container">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Mapa em relevo */}
          <div className="relative">
            <svg
              viewBox={BRASIL_VIEWBOX}
              role="img"
              aria-label="Mapa do Brasil com o Amazonas e Roraima em destaque"
              className="mx-auto h-auto w-full max-w-[38rem] overflow-visible"
            >
              <defs>
                <g id="mapa-todos">
                  {ESTADOS.map((e) => <path key={e.sigla} d={e.d} />)}
                </g>
                <filter id="sombra-chao" x="-15%" y="-15%" width="140%" height="145%">
                  <feGaussianBlur stdDeviation="0.55" />
                </filter>
                {/* bisel de cada estado: luz vinda do canto superior esquerdo, borda clara em cima e escura embaixo */}
                <filter id="bisel" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="0.3" result="relevo" />
                  <feDiffuseLighting in="relevo" surfaceScale="1.4" diffuseConstant="1" lightingColor="#FFFFFF" result="luz">
                    <feDistantLight azimuth="225" elevation="58" />
                  </feDiffuseLighting>
                  <feComposite in="SourceGraphic" in2="luz" operator="arithmetic" k1="0.55" k2="0.6" k3="0" k4="0" result="iluminado" />
                  <feComposite in="iluminado" in2="SourceAlpha" operator="in" />
                </filter>
                <filter id="bisel-laranja" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="0.3" result="relevo" />
                  <feDiffuseLighting in="relevo" surfaceScale="1.4" diffuseConstant="1" lightingColor="#FFFFFF" result="luz">
                    <feDistantLight azimuth="225" elevation="58" />
                  </feDiffuseLighting>
                  <feComposite in="SourceGraphic" in2="luz" operator="arithmetic" k1="0.3" k2="0.8" k3="0" k4="0" result="iluminado" />
                  <feComposite in="iluminado" in2="SourceAlpha" operator="in" />
                </filter>
                <filter id="etiqueta" x="-20%" y="-40%" width="140%" height="200%">
                  <feDropShadow dx="0" dy="0.12" stdDeviation="0.18" floodColor="#1C1C1E" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* sombra projetada no chão */}
              <g filter="url(#sombra-chao)" opacity={0.45} transform="translate(0.7 1.3)">
                <use href="#mapa-todos" fill="#1C1C1E" />
              </g>

              {/* espessura: camadas empilhadas do fundo para a face */}
              {Array.from({ length: CAMADAS }, (_, i) => {
                const n = CAMADAS - i; // da camada mais funda para a mais próxima
                const t = n / CAMADAS;
                const c = Math.round(150 + (1 - t) * 45);
                return (
                  <g key={n} transform={`translate(${(DX * n).toFixed(2)} ${(DY * n).toFixed(2)})`}>
                    {/* laranja antes do cinza: a parede do AM não vaza sobre a parede dos vizinhos */}
                    {LARANJA.map((e) => <path key={e.sigla} d={e.d} fill={`rgb(${Math.round(176 + (1 - t) * 28)},${Math.round(64 + (1 - t) * 12)},0)`} />)}
                    {CINZA.map((e) => <path key={e.sigla} d={e.d} fill={`rgb(${c},${c},${c + 4})`} stroke={`rgb(${c},${c},${c + 4})`} strokeWidth={0.06} />)}
                  </g>
                );
              })}

              {/* face superior: cada estado com o próprio bisel, o que desenha as divisas em alto-relevo */}
              {CINZA.map((e) => <path key={e.sigla} d={e.d} fill="#CDCDD0" filter="url(#bisel)" />)}
              {LARANJA.map((e) => <path key={e.sigla} d={e.d} fill="#E25800" filter="url(#bisel-laranja)" />)}

              {/* siglas dos estados atendidos */}
              {ROTULOS.map((r) => (
                <text
                  key={r.sigla}
                  x={r.x}
                  y={r.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={r.size}
                  fontWeight={800}
                  fill="#FFFFFF"
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "0.01em" }}
                >
                  {r.sigla}
                </text>
              ))}

              {/* sede */}
              {/* sede: etiqueta branca para o nome ficar legível sobre o laranja e sobre o cinza */}
              <circle cx={MANAUS.x} cy={MANAUS.y} r={0.62} fill="#FFFFFF" stroke="#B84400" strokeWidth={0.14} />
              <g transform={`translate(${MANAUS.x + 1.1} ${MANAUS.y})`}>
                <rect x={0} y={-0.95} width={6.1} height={1.9} rx={0.3} fill="#FFFFFF" filter="url(#etiqueta)" />
                <text
                  x={3.05}
                  y={0.05}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={1.15}
                  fontWeight={800}
                  fill="#E25800"
                  style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
                >
                  MANAUS
                </text>
              </g>
            </svg>
          </div>

          {/* Estados e sede */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Onde atuamos</p>
            <h2 className="mt-2 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.4vw, 3.2rem)" }}>
              Presença no Amazonas e em Roraima
            </h2>
            <p className="mt-3 text-gray-600">
              Dealer autorizado STILL e Linde, com atendimento a indústrias, centros de distribuição e operações logísticas.
            </p>

            <ul className="mt-6 space-y-3">
              {ESTADOS_CARDS.map((e) => (
                <li key={e.sigla} className="flex items-center gap-5 rounded-xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm">
                  <span className="w-9 text-xl font-extrabold text-[#E85A00]">{e.sigla}</span>
                  <span className="flex-1">
                    <span className="block font-semibold text-[#1C1C1E]">{e.nome}</span>
                    <span className="block text-sm text-gray-500">{e.cidade}</span>
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#E85A00]" aria-hidden />
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="leading-relaxed text-gray-600">
                Nossa sede em <strong className="text-[#1C1C1E]">Manaus (AM)</strong> garante estoque próprio de peças e
                atendimento ágil em toda a região.
              </p>
              <a
                href={whatsappLink("Olá! Gostaria de solicitar uma cotação.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-lg bg-[#E85A00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C44A00]"
              >
                Solicitar cotação
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
