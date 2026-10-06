import { BRASIL_VIEWBOX, ESTADOS, MANAUS } from "@/lib/brasil-mapa";
import { whatsappLink } from "@/lib/constants";

const ATENDIDOS = new Set(["AM", "RR"]);
const CINZA = ESTADOS.filter((e) => !ATENDIDOS.has(e.sigla));
const LARANJA = ESTADOS.filter((e) => ATENDIDOS.has(e.sigla));

// mesma projeção de scripts/home/gerar-mapa.mjs: x = lon * cos(14°), y = -lat
const K = Math.cos((14 * Math.PI) / 180);
const pos = (lon: number, lat: number) => ({ x: lon * K, y: -lat });
const ROTULOS = [
  { sigla: "AM", ...pos(-64.6, -4.2), size: 2.1 },
  { sigla: "RR", ...pos(-61.1, 2.2), size: 1.25 },
];

const CAMADAS = 7; // espessura do relevo
const DX = 0.1;
const DY = 0.16;

const ESTADOS_CARDS = [
  { sigla: "AM", nome: "Amazonas", cidade: "Manaus (sede)" },
  { sigla: "RR", nome: "Roraima", cidade: "Boa Vista" },
];

const NUMEROS = [
  { valor: "30", unidade: "anos", legenda: "de história em Manaus" },
  { valor: "2", unidade: "estados", legenda: "Amazonas e Roraima" },
  { valor: "4,7", unidade: "no Google", legenda: "média de 61 avaliações" },
  { valor: "4", unidade: "marcas", legenda: "STILL, Linde, Baoli e Skyjack" },
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
                <g id="mapa-cinza">
                  {CINZA.map((e) => <path key={e.sigla} d={e.d} />)}
                </g>
                <g id="mapa-laranja">
                  {LARANJA.map((e) => <path key={e.sigla} d={e.d} />)}
                </g>
                <linearGradient id="face-cinza" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#E9E9ED" />
                  <stop offset="1" stopColor="#D5D5DA" />
                </linearGradient>
                <linearGradient id="face-laranja" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#F26A12" />
                  <stop offset="1" stopColor="#DC5000" />
                </linearGradient>
                <filter id="sombra-chao" x="-15%" y="-15%" width="140%" height="145%">
                  <feGaussianBlur stdDeviation="0.9" />
                </filter>
              </defs>

              {/* sombra projetada no chão */}
              <g filter="url(#sombra-chao)" opacity={0.32} transform="translate(1 1.9)">
                <use href="#mapa-cinza" fill="#000" />
                <use href="#mapa-laranja" fill="#000" />
              </g>

              {/* espessura: camadas empilhadas do fundo para a face */}
              {Array.from({ length: CAMADAS }, (_, i) => {
                const n = CAMADAS - i; // da camada mais funda para a mais próxima
                const t = n / CAMADAS;
                return (
                  <g key={n} transform={`translate(${(DX * n).toFixed(2)} ${(DY * n).toFixed(2)})`}>
                    <use href="#mapa-cinza" fill={`rgb(${Math.round(158 + (1 - t) * 40)},${Math.round(158 + (1 - t) * 40)},${Math.round(166 + (1 - t) * 40)})`} />
                    <use href="#mapa-laranja" fill={`rgb(${Math.round(150 + (1 - t) * 20)},${Math.round(58 + (1 - t) * 14)},0)`} />
                  </g>
                );
              })}

              {/* face superior */}
              <use href="#mapa-cinza" fill="url(#face-cinza)" stroke="#FFFFFF" strokeWidth={0.32} strokeLinejoin="round" />
              <use href="#mapa-laranja" fill="url(#face-laranja)" stroke="#FFFFFF" strokeWidth={0.32} strokeLinejoin="round" />

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
                  style={{ fontFamily: "inherit", letterSpacing: "0.02em" }}
                >
                  {r.sigla}
                </text>
              ))}

              {/* sede */}
              <circle cx={MANAUS.x} cy={MANAUS.y} r={0.95} fill="#FFFFFF" stroke="#C44A00" strokeWidth={0.25} />
              <text
                x={MANAUS.x + 1.6}
                y={MANAUS.y + 0.45}
                fontSize={1.45}
                fontWeight={800}
                fill="#C44A00"
                stroke="#EFEFF2"
                strokeWidth={0.5}
                paintOrder="stroke"
                style={{ fontFamily: "inherit", letterSpacing: "0.04em" }}
              >
                MANAUS
              </text>
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

        {/* Números */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-gray-300/70 pt-10 lg:grid-cols-4">
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
    </section>
  );
}
