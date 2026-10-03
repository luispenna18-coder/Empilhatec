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

        <div className="relative overflow-hidden rounded-3xl bg-[#1C1C1E] p-6 sm:p-10">
          <svg viewBox={BRASIL_VIEWBOX} role="img" aria-label="Mapa do Brasil com o Amazonas e Roraima em destaque" className="mx-auto h-auto w-full max-w-[34rem]">
            {ESTADOS.map((e) => (
              <path
                key={e.sigla}
                d={e.d}
                fill={ATENDIDOS.has(e.sigla) ? "#E85A00" : "#2C2C30"}
                stroke="#1C1C1E"
                strokeWidth={0.18}
                strokeLinejoin="round"
              />
            ))}
            <circle cx={MANAUS.x} cy={MANAUS.y} r={1.9} fill="#fff" opacity={0.25}>
              <animate attributeName="r" values="0.9;2.6;0.9" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.45;0;0.45" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle cx={MANAUS.x} cy={MANAUS.y} r={0.75} fill="#fff" stroke="#1C1C1E" strokeWidth={0.25} />
          </svg>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-[#E85A00]" /> Estados atendidos</li>
            <li className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-white" /> Sede em Manaus</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
