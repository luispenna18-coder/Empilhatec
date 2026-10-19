import Image from "next/image";
import FadeUp from "@/components/FadeUp";

// Linha do tempo em caixas sobre paletes, a partir da arte do usuário em
// brand_assets/Linha do tempo · Empilhatec 30 anos@1x.png, refeita com as cores do site e os logos vetoriais.

interface Logo {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
}

interface Marco {
  year: string;
  title: string;
  sub: string;
  /** paletes empilhados embaixo da caixa (desktop): a pilha cresce com os anos */
  paletes: number;
  logos?: Logo[];
  /** texto no lugar do logo, quando o marco não tem marca */
  nota?: string;
  /** caixa laranja dos 30 anos */
  destaque?: boolean;
}

const MARCOS: Marco[] = [
  {
    year: "1996",
    title: "Fundação",
    sub: "Manaus, AM",
    paletes: 1,
    logos: [{ src: "/images/logo-empilhatec.png", alt: "Empilhatec Empilhadeiras da Amazônia", width: 664, height: 522, className: "h-11" }],
  },
  {
    year: "2005",
    title: "Autorizado STILL",
    sub: "KION Group",
    paletes: 3,
    logos: [{ src: "/images/brands/logo_still.svg", alt: "STILL", width: 89, height: 50, className: "h-10" }],
  },
  {
    year: "2015",
    title: "Linde e Baoli",
    sub: "Portfólio ampliado",
    paletes: 5,
    logos: [
      { src: "/images/brands/linde.svg", alt: "Linde Material Handling", width: 83, height: 50, className: "h-9" },
      { src: "/images/brands/logo_baoli.svg", alt: "Baoli", width: 61, height: 50, className: "h-9" },
    ],
  },
  {
    year: "2020",
    title: "Peças próprias",
    sub: "Estoque em Manaus",
    paletes: 7,
    nota: "Resposta rápida para preventiva e corretiva",
  },
  {
    year: "2026",
    title: "Três décadas",
    sub: "Intralogística na região",
    paletes: 9,
    destaque: true,
  },
];

// Faces da caixa: frente, tampa e lateral (a profundidade vem de --d)
const KRAFT = { frente: "linear-gradient(180deg, #D1A46E 0%, #C39259 100%)", tampa: "#E4C292", lateral: "#A6763F" };
const LARANJA = { frente: "linear-gradient(180deg, #F0680F 0%, #E25600 100%)", tampa: "#FF8A40", lateral: "#B24400" };

// Palete visto de frente: tábua fina em cima e três blocos, com os vãos vazados. Repete a cada --p de altura.
const PALETE_FRENTE: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(to bottom, rgba(255,255,255,0.22) 0 1px, transparent 1px)",
    "linear-gradient(to bottom, #3A3A3D 0 24%, transparent 24%)",
    "linear-gradient(to right, #2C2C2E 0 11%, transparent 11% 44.5%, #2C2C2E 44.5% 55.5%, transparent 55.5% 89%, #2C2C2E 89% 100%)",
  ].join(", "),
  backgroundSize: "100% var(--p)",
};
const PALETE_LATERAL: React.CSSProperties = {
  backgroundImage: "linear-gradient(to bottom, #1C1C1E 0 72%, transparent 72%)",
  backgroundSize: "100% var(--p)",
};

function Caixa({ destaque, children }: { destaque?: boolean; children: React.ReactNode }) {
  const c = destaque ? LARANJA : KRAFT;
  return (
    <div className="relative pr-[var(--d)] pt-[var(--d)]">
      {/* tampa, com a fita no meio */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-[var(--d)] w-[calc(100%-var(--d))] origin-bottom-left -skew-x-45"
        style={{ background: c.tampa }}
      >
        <span className="absolute inset-y-0 left-1/2 w-[16%] -translate-x-1/2 bg-white/25" />
      </span>
      {/* lateral */}
      <span
        aria-hidden
        className="absolute bottom-0 right-0 top-[var(--d)] w-[var(--d)] origin-top-left -skew-y-45"
        style={{ background: c.lateral }}
      />
      <div className="relative shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]" style={{ background: c.frente }}>
        <span aria-hidden className="absolute left-1/2 top-0 h-3 w-[16%] -translate-x-1/2 bg-white/20" />
        {children}
      </div>
    </div>
  );
}

function Paletes({ n }: { n: number }) {
  return (
    <div aria-hidden className="relative pr-[var(--d)]">
      <span className="absolute bottom-0 right-0 top-0 w-[var(--d)] origin-top-left -skew-y-45" style={PALETE_LATERAL} />
      <div style={{ ...PALETE_FRENTE, height: `calc(var(--p) * ${n})` }} />
    </div>
  );
}

function Etiqueta({ m }: { m: Marco }) {
  return (
    <div className="rounded-xl bg-white px-3 py-4 text-center shadow-[0_1px_2px_rgba(28,28,30,0.14),0_6px_14px_-8px_rgba(28,28,30,0.25)]">
      {m.logos && (
        <div className="mb-3 flex h-11 items-center justify-center gap-3">
          {m.logos.map((l) => (
            <Image key={l.src} src={l.src} alt={l.alt} width={l.width} height={l.height} className={`${l.className} w-auto max-w-full`} />
          ))}
        </div>
      )}
      <h3 className="text-base font-bold leading-tight text-[#1C1C1E]">{m.title}</h3>
      <p className="mt-1 text-sm leading-snug text-gray-500">{m.sub}</p>
      {m.nota && <p className="mt-2 text-[13px] leading-snug text-gray-500">{m.nota}</p>}
    </div>
  );
}

function Ano({ m, compacto }: { m: Marco; compacto?: boolean }) {
  return (
    <>
      <div>
        <span className="font-display font-extrabold leading-none tracking-tight text-[#1C1C1E]" style={{ fontSize: "clamp(1.6rem, 2.2vw, 2.15rem)" }}>
          {m.year}
        </span>
      </div>
      {m.destaque && (
        <p className={`mt-1 flex font-display font-extrabold leading-none text-[#1C1C1E] ${compacto ? "flex-col gap-1" : "items-baseline gap-1.5"}`}>
          <span className="tracking-tight" style={{ fontSize: compacto ? "2.75rem" : "clamp(3rem, 4.6vw, 4.6rem)" }}>30</span>
          <span className="text-sm tracking-[0.2em]">ANOS</span>
        </p>
      )}
    </>
  );
}

/** Fundo: estantes porta-paletes em traço claro, sumindo para cima */
function Estantes() {
  const colunas = [0, 240, 480, 720, 960, 1200];
  const vigas = [60, 250, 440];
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 560"
      preserveAspectRatio="xMaxYMax slice"
      className="pointer-events-none absolute bottom-0 right-0 h-[calc(100%+1rem)] w-[84%]"
      style={{ maskImage: "linear-gradient(to top, #000 55%, transparent)", WebkitMaskImage: "linear-gradient(to top, #000 55%, transparent)" }}
    >
      {colunas.slice(0, -1).map((x) =>
        vigas.slice(1).map((y, i) => (
          <path key={`${x}-${y}`} d={`M${x + 12} ${vigas[i] + 10} L${x + 240 - 6} ${y} M${x + 240 - 6} ${vigas[i] + 10} L${x + 12} ${y}`} stroke="#E6E6EA" strokeWidth={3} />
        )),
      )}
      {vigas.map((y) => (
        <g key={y}>
          <rect x={0} y={y} width={1200} height={10} fill="#E2E2E6" />
          <rect x={0} y={y} width={1200} height={2} fill="#FFFFFF" opacity={0.7} />
        </g>
      ))}
      {colunas.map((x) => (
        <g key={x}>
          <rect x={x - 6} y={0} width={12} height={560} fill="#DEDEE3" />
          <rect x={x - 6} y={0} width={3} height={560} fill="#FFFFFF" opacity={0.7} />
        </g>
      ))}
    </svg>
  );
}

function Piso() {
  return (
    <div aria-hidden>
      <div className="h-2" style={{ backgroundImage: "repeating-linear-gradient(-45deg, #E85A00 0 12px, #1C1C1E 12px 24px)" }} />
      <div className="h-[clamp(4.5rem,8vw,8rem)] bg-gradient-to-b from-[#E4E4E8] to-[#F5F5F7]" />
    </div>
  );
}

export default function Trajetoria() {
  return (
    <section className="overflow-hidden bg-[#F5F5F7]">
      <div className="site-container pt-[clamp(2.5rem,5vw,6rem)]">
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Nossa trajetória</p>
          <h2 className="mt-3 text-balance font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            Três décadas movimentando o Amazonas
          </h2>
        </div>

        {/* Desktop: a escada de caixas, com a empilhadeira chegando pela esquerda */}
        <div className="relative mt-28 hidden [--d:12px] [--h:15rem] [--p:15px] lg:block xl:[--d:14px] xl:[--p:17px] min-[1400px]:[--h:13.25rem]">
          <Estantes />
          <div className="relative flex items-end gap-4">
            <div className="relative hidden w-[18%] shrink-0 xl:block">
              <FadeUp direction="right" distance={60} duration={0.8}>
                <span aria-hidden className="absolute -bottom-1 left-[4%] right-[6%] h-4 rounded-[50%] bg-black/30 blur-md" />
                <Image
                  src="/images/sobre/empilhadeira-still-rce.webp"
                  alt=""
                  width={748}
                  height={667}
                  sizes="(min-width:1280px) 19vw, 1px"
                  className="relative -ml-[14%] h-auto w-[114%] max-w-none"
                />
              </FadeUp>
            </div>
            <ol className="grid flex-1 grid-cols-5 items-end gap-4">
              {MARCOS.map((m, i) => (
                <li key={m.year}>
                  <FadeUp delay={0.1 + i * 0.09} distance={40} duration={0.7} className="[filter:drop-shadow(0_14px_18px_rgba(28,28,30,0.10))]">
                    <Caixa destaque={m.destaque}>
                      <div className="flex h-[var(--h)] flex-col p-3">
                        <Ano m={m} />
                        <div className="mt-auto pt-3">
                          <Etiqueta m={m} />
                        </div>
                      </div>
                    </Caixa>
                    <Paletes n={m.paletes} />
                  </FadeUp>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Celular e tablet: uma caixa por marco, em ordem */}
        <ol className="mx-auto mt-14 max-w-xl space-y-5 [--d:10px] [--p:12px] lg:hidden">
          {MARCOS.map((m) => (
            <li key={m.year}>
              <FadeUp distance={24}>
                <Caixa destaque={m.destaque}>
                  <div className="flex items-center gap-4 p-3.5">
                    <div className="flex w-[5.5rem] shrink-0 flex-col self-stretch">
                      <Ano m={m} compacto />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Etiqueta m={m} />
                    </div>
                  </div>
                </Caixa>
                <Paletes n={1} />
              </FadeUp>
            </li>
          ))}
        </ol>
      </div>
      <Piso />
    </section>
  );
}
