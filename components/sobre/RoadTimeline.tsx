import { Award, BadgeCheck, Building2, Flag, Layers, Package, type LucideIcon } from "lucide-react";

export interface Marco {
  year: string;
  title: string;
  desc: string;
}

const ICONES: LucideIcon[] = [Building2, BadgeCheck, Layers, Package, Award];

// Posições no desenho (viewBox 1200 x 860): [x, y, lado do cartão]
const POSICOES: [number, number, "acima" | "abaixo"][] = [
  [200, 290, "acima"],
  [560, 290, "acima"],
  [920, 290, "acima"],
  [860, 560, "abaixo"],
  [420, 560, "abaixo"],
];
const W = 1200;
const H = 860;
const ESTRADA = "M 0 290 H 1050 A 135 135 0 0 1 1050 560 H 130";

/** Linha do tempo em formato de estrada sinuosa (desktop largo) e lista vertical (demais telas). */
export default function RoadTimeline({ marcos }: { marcos: Marco[] }) {
  return (
    <>
      {/* Desktop largo: estrada */}
      <div className="relative mx-auto hidden w-full max-w-6xl xl:block" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <path d={ESTRADA} fill="none" stroke="#B94700" strokeWidth={84} strokeLinejoin="round" />
          <path d={ESTRADA} fill="none" stroke="#E85A00" strokeWidth={74} strokeLinejoin="round" />
          <path d={ESTRADA} fill="none" stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={3} strokeDasharray="16 14" strokeLinejoin="round" />
        </svg>

        {/* chegada */}
        <div
          className="absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg"
          style={{ left: `${(110 / W) * 100}%`, top: `${(560 / H) * 100}%` }}
          aria-hidden
        >
          <Flag size={24} className="text-[#E85A00]" />
        </div>

        {marcos.map((m, i) => {
          const [x, y, lado] = POSICOES[i];
          const Icone = ICONES[i] ?? Award;
          return (
            <div key={m.year}>
              {/* bolha sobre a estrada */}
              <div
                className="absolute flex aspect-square w-[12.5%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white shadow-xl ring-4 ring-white/70"
                style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
              >
                <Icone size={22} className="text-[#E85A00]" />
                <span className="mt-1 font-display text-2xl leading-none text-[#1C1C1E]">{m.year}</span>
              </div>
              {/* cartão com o texto */}
              <div
                className="absolute w-[25%]"
                style={{
                  left: `${(x / W) * 100}%`,
                  top: `${((lado === "acima" ? y - 95 : y + 95) / H) * 100}%`,
                  transform: lado === "acima" ? "translate(-50%, -100%)" : "translate(-50%, 0)",
                }}
              >
                <div className="rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm">
                  <h3 className="font-display text-lg tracking-wide text-[#1C1C1E]">{m.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{m.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Demais telas: lista vertical */}
      <ol className="relative mx-auto max-w-3xl xl:hidden">
        <div className="absolute bottom-0 left-8 top-0 w-1.5 -translate-x-1/2 rounded-full bg-[#E85A00]/30" aria-hidden />
        {marcos.map((m, i) => {
          const Icone = ICONES[i] ?? Award;
          return (
            <li key={m.year} className="relative flex items-start gap-5 pb-10 last:pb-0">
              <div className="relative z-10 flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-[#E85A00]">
                <Icone size={16} className="text-[#E85A00]" />
                <span className="font-display text-sm leading-none text-[#1C1C1E]">{m.year}</span>
              </div>
              <div className="flex-1 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="font-display text-lg tracking-wide text-[#1C1C1E]">{m.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{m.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
