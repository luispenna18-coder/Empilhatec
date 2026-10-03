import { BRASIL_VIEWBOX, ESTADOS, MANAUS } from "@/lib/brasil-mapa";

const ATENDIDOS = new Set(["AM", "RR"]);
const NUMEROS = [
  { valor: "30", unidade: "anos", legenda: "de história em Manaus, desde 1996" },
  { valor: "2", unidade: "estados", legenda: "Amazonas e Roraima" },
  { valor: "4,7", unidade: "no Google", legenda: "média de 61 avaliações" },
  { valor: "4", unidade: "marcas", legenda: "STILL, Linde, Baoli e Skyjack" },
];

export default function CoverageMap() {
  return (
    <section className="section-py bg-white">
      <div className="site-container grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Área de atendimento</p>
          <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            Do Amazonas a Roraima
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-600">
            Com sede em Manaus, a Empilhatec atende indústrias, centros de distribuição e operações logísticas nos dois
            estados.
          </p>
          <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-8">
            {NUMEROS.map((n) => (
              <div key={n.unidade} className="border-l-2 border-[#E85A00] pl-4">
                <dt className="sr-only">{n.unidade}</dt>
                <dd>
                  <span className="text-5xl font-extrabold leading-none text-[#1C1C1E]">{n.valor}</span>
                  <span className="ml-2 text-sm font-semibold uppercase tracking-wide text-[#E85A00]">{n.unidade}</span>
                  <span className="mt-1 block text-sm text-gray-500">{n.legenda}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <svg viewBox={BRASIL_VIEWBOX} role="img" aria-label="Mapa do Brasil com o Amazonas e Roraima em destaque" className="mx-auto h-auto w-full max-w-[36rem] overflow-visible">
            <defs>
              <linearGradient id="mapa-cinza" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#DCDCE1" />
                <stop offset="1" stopColor="#B4B4BC" />
              </linearGradient>
              <linearGradient id="mapa-laranja" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FF7A1F" />
                <stop offset="1" stopColor="#DE5200" />
              </linearGradient>
              <filter id="mapa-sombra" x="-10%" y="-10%" width="125%" height="130%">
                <feDropShadow dx="0.5" dy="1.1" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.3" />
              </filter>
            </defs>
            {/* espessura (extrusão) + sombra */}
            <g filter="url(#mapa-sombra)" transform="translate(0.45 0.8)">
              {ESTADOS.map((e) => (
                <path key={e.sigla} d={e.d} fill={ATENDIDOS.has(e.sigla) ? "#A33E00" : "#8A8A93"} stroke={ATENDIDOS.has(e.sigla) ? "#A33E00" : "#8A8A93"} strokeWidth={0.2} strokeLinejoin="round" />
              ))}
            </g>
            {/* face superior */}
            <g>
              {ESTADOS.map((e) => (
                <path
                  key={e.sigla}
                  d={e.d}
                  fill={ATENDIDOS.has(e.sigla) ? "url(#mapa-laranja)" : "url(#mapa-cinza)"}
                  stroke="#FFFFFF"
                  strokeOpacity={0.9}
                  strokeWidth={0.22}
                  strokeLinejoin="round"
                />
              ))}
            </g>
            {/* sede */}
            <circle cx={MANAUS.x} cy={MANAUS.y} r={1.9} fill="#FFFFFF" opacity={0.35}>
              <animate attributeName="r" values="0.9;2.6;0.9" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx={MANAUS.x} cy={MANAUS.y} r={0.8} fill="#1C1C1E" stroke="#FFFFFF" strokeWidth={0.3} />
            <text
              x={MANAUS.x + 1.5}
              y={MANAUS.y + 0.45}
              fontSize={1.5}
              fontWeight={700}
              fill="#1C1C1E"
              stroke="#FFFFFF"
              strokeWidth={0.45}
              paintOrder="stroke"
              style={{ fontFamily: "inherit" }}
            >
              Manaus
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
