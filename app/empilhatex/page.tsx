import { Fragment } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, Hourglass, MessageCircle, Phone, Play, ShieldCheck, Zap } from "lucide-react";
import FadeUp from "@/components/FadeUp";
import PageBanner from "@/components/PageBanner";
import YouTubeVideo from "@/components/YouTubeVideo";
import { SITE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Empilhatex | Empilhatec Empilhadeiras",
  description:
    "Empilhatex: locação de empilhadeiras elétricas com bateria de lítio da linha STILL, da Empilhatec, no Amazonas e em Roraima.",
};

const PROPOSTA = whatsappLink("Olá! Quero uma proposta Empilhatex para empilhadeiras com bateria de lítio.");

const SEM = ["Sem troca de bateria no meio do turno", "Sem sala de baterias", "Sem manutenção da bateria"];

// Números e comparação: página "Tecnologia STILL Li-Ion" (still.com.br), para baterias STILL Li-Ion.
// Ciclos: Li-Ion até 3.000 (padrão) e até 4.000 (Plus); chumbo-ácido até 1.400.
const NUMEROS = [
  { icon: Zap, valor: "30%", texto: "de melhoria no uso da energia" },
  { icon: BatteryCharging, valor: "60 min", texto: "de recarga repõem cerca de 60% da bateria" },
  { icon: Hourglass, valor: "2×", texto: <>a vida útil de uma bateria de <span className="whitespace-nowrap">chumbo-ácido</span></> },
  { icon: ShieldCheck, valor: "Zero", texto: "manutenção na bateria" },
];

const COMPARACAO = [
  { item: "Recarga", chumbo: "Só carga total: recargas parciais encurtam a vida útil", litio: "Nas pausas, em qualquer nível de carga" },
  { item: "Troca de bateria", chumbo: "Necessária em operações de vários turnos", litio: "Não precisa: a bateria fica na máquina" },
  { item: "Manutenção da bateria", chumbo: "Água, limpeza e equalização", litio: "Nenhuma" },
  { item: "Sala de baterias", chumbo: "Sala de troca e carga, com ventilação", litio: "Dispensada: a carga é feita no local de trabalho" },
  { item: "Potência", chumbo: "Cai conforme a bateria descarrega", litio: "Máxima, mesmo com a carga baixa" },
  { item: "Ciclos de carga", chumbo: "Até 1.400", litio: "De 3.000 a 4.000" },
  { item: "Operação por ano", chumbo: "Até 1.000 horas", litio: "Até 1.500 horas" },
];

const LINHA = [
  {
    titulo: "Transpaleteiras",
    texto: "Carga e descarga de caminhões",
    href: "/maquinas/categoria/transpaleteira",
    image: "/images/empilhatex/linha-transpaleteira.webp",
    alt: "Transpaleteira STILL conectada a uma tomada para recarga",
    position: "30% 50%",
  },
  {
    titulo: "Retráteis",
    texto: "Armazenagem em altura",
    href: "/maquinas/categoria/retratil",
    image: "/images/empilhatex/linha-retratil.webp",
    alt: "Empilhadeira retrátil STILL FM-X em um corredor de armazém, vista de cima",
    position: "25% 60%",
  },
  {
    titulo: "Selecionadoras",
    texto: "Separação de pedidos nos corredores",
    href: "/maquinas/categoria/selecionadora",
    image: "/images/empilhatex/linha-selecionadora.webp",
    alt: "Selecionadora de pedidos STILL OPX com bateria de lítio em um armazém",
    position: "35% 50%",
  },
  {
    titulo: "Contrabalançadas",
    texto: "Do pátio à linha de produção",
    href: "/maquinas/categoria/contrabalancada",
    image: "/images/empilhatex/linha-contrabalancada.webp",
    alt: "Empilhadeira contrabalançada STILL RX 20 em um pátio com caixas plásticas",
    position: "62% 50%",
  },
];

export default function EmpilhatexPage() {
  return (
    <>
      {/* 1. Topo */}
      <PageBanner
        image="/images/banners/empilhatex.webp"
        alt="Transpaleteira STILL com bateria de lítio em uma doca de carga"
        position="center 40%"
        size="tall"
      >
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white before:mr-3 before:inline-block before:h-0.5 before:w-7 before:bg-[#E85A00] before:align-middle">
            Uma marca Empilhatec
          </p>
          <h1 className="font-display leading-none text-white" style={{ fontSize: "clamp(2.8rem, 5.2vw, 5.6rem)" }}>
            Empilhatex
          </h1>
          <div className="mt-4 h-0.5 w-12 bg-[#E85A00]" />
          <p className="mt-5 max-w-[30rem] font-display leading-tight text-white" style={{ fontSize: "clamp(1.4rem, 2.2vw, 2.1rem)" }}>
            Frota 100% lítio para quem não pode parar
          </p>
          <p className="mt-3 max-w-[30rem] text-lg leading-relaxed text-white/95">
            Locação de empilhadeiras elétricas STILL com bateria de lítio, no Amazonas e em Roraima.
          </p>
          <div className="mt-8 flex flex-col gap-3 [text-shadow:none] sm:flex-row">
            <a
              href={PROPOSTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E85A00] px-7 py-4 font-semibold text-white transition hover:bg-[#C44A00]"
            >
              Solicitar proposta Empilhatex <ArrowRight size={18} />
            </a>
            <a
              href="#video"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/70 bg-black/20 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-[#1C1C1E]"
            >
              <Play size={18} /> Assistir ao vídeo
            </a>
          </div>
        </div>
      </PageBanner>

      {/* 2. Manifesto e vídeo */}
      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Manifesto</p>
            <h2 className="mt-3 text-balance font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Nascemos elétricos
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
              A Empilhatex nasceu dentro da Empilhatec com uma ideia só: colocar a empilhadeira de lítio para trabalhar
              nas operações da Amazônia.
            </p>
            <ul className="mt-6 space-y-3">
              {SEM.map((t) => (
                <li key={t} className="flex items-center gap-3 text-lg font-semibold text-[#1C1C1E]">
                  <Zap size={18} className="shrink-0 fill-[#E85A00] text-[#E85A00]" /> {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-xl leading-relaxed text-gray-500">
              A máquina recarrega nas pausas e volta ao trabalho com potência total. Por trás dela, os mais de 30 anos da
              Empilhatec em Manaus e o padrão técnico da STILL.
            </p>
          </div>

          <FadeUp>
            <div id="video" className="scroll-mt-[calc(var(--header-h)+1.5rem)] rounded-3xl shadow-xl">
              <YouTubeVideo
                id="KX4dYUATC-Y"
                title="A revolução em empilhadeiras de lítio está na Empilhatec"
                poster="/images/empilhatex/video-capa.jpg"
                duration="1 min 12 s"
              />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 3. Por que lítio: números da STILL */}
      <section className="section-py bg-white">
        <div className="site-container grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#e9e9eb] shadow-lg">
            <Image
              src="/images/empilhatex/recarga-rx20.webp"
              alt="Operador conectando o carregador a uma empilhadeira STILL RX20-20 com bateria de lítio"
              fill
              quality={90}
              sizes="(min-width:1024px) 46vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "30% 50%" }}
            />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1C1C1E] shadow-lg">
              <Zap size={15} className="fill-[#E85A00] text-[#E85A00]" /> Recarga nas pausas
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Por que lítio</p>
            <h2 className="mt-3 text-balance font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              O que muda na sua operação
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              {NUMEROS.map((n, i) => (
                <FadeUp key={n.valor} delay={i * 0.08} className="h-full">
                  <div className="h-full rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-[#E85A00]/40 hover:shadow-lg sm:p-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E85A00]/10 text-[#E85A00]">
                      <n.icon size={18} />
                    </span>
                    <p className="mt-3 font-display text-3xl leading-none text-[#1C1C1E] sm:text-4xl">{n.valor}</p>
                    <p className="mt-1.5 text-sm leading-snug text-gray-600">{n.texto}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Lítio × chumbo-ácido */}
      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Lítio × chumbo-ácido</p>
            <h2 className="mt-3 text-balance font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              A diferença está na bateria
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Lado a lado, o que muda quando a bateria de chumbo-ácido dá lugar à de lítio.
            </p>
          </div>

          <FadeUp>
            {/* Grade única: as linhas das duas colunas ficam sempre alinhadas */}
            <div
              className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-x-3 sm:gap-x-6 lg:gap-x-10"
              style={{ gridTemplateRows: `repeat(${COMPARACAO.length + 1}, auto)` }}
            >
              {/* cartão branco atrás da coluna do lítio */}
              <div className="rounded-3xl bg-white shadow-xl ring-1 ring-black/5" style={{ gridColumn: 2, gridRow: "1 / -1" }} aria-hidden />

              <div className="px-1 pb-2 pt-3 sm:px-6 sm:pt-6" style={{ gridColumn: 1, gridRow: 1 }}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F2F2F2]">
                  <Image
                    src="/images/empilhatex/bateria-chumbo-acido.webp"
                    alt="Bateria de chumbo-ácido para empilhadeira"
                    fill
                    sizes="(min-width:1024px) 28rem, 45vw"
                    className="object-cover opacity-90 grayscale"
                  />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Tradicional</p>
                <h3 className="mt-1 text-xl font-bold text-gray-500 sm:text-2xl">Chumbo-ácido</h3>
              </div>
              <div className="relative px-3 pb-2 pt-3 sm:px-8 sm:pt-6" style={{ gridColumn: 2, gridRow: 1 }}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F2F2F2]">
                  <Image
                    src="/images/empilhatex/bateria-litio.webp"
                    alt="Bateria de lítio STILL Li-Ion para empilhadeira"
                    fill
                    sizes="(min-width:1024px) 28rem, 45vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Empilhatex</p>
                <h3 className="mt-1 text-xl font-bold text-[#1C1C1E] sm:text-2xl">Lítio</h3>
              </div>

              {COMPARACAO.map((c, i) => {
                const ultima = i === COMPARACAO.length - 1;
                return (
                  <Fragment key={c.item}>
                    <div className={`px-1 sm:px-6 ${ultima ? "pb-2" : ""}`} style={{ gridColumn: 1, gridRow: i + 2 }}>
                      <div className="h-full border-t border-gray-300/70 py-4 sm:py-5">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-400 sm:text-xs">{c.item}</p>
                        <p className="mt-1.5 text-sm leading-snug text-gray-500 sm:text-base">{c.chumbo}</p>
                      </div>
                    </div>
                    <div className={`relative px-3 sm:px-8 ${ultima ? "pb-3 sm:pb-6" : ""}`} style={{ gridColumn: 2, gridRow: i + 2 }}>
                      <div className="h-full border-t border-gray-100 py-4 sm:py-5">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#E85A00] sm:text-xs">{c.item}</p>
                        <p className="mt-1.5 text-sm font-semibold leading-snug text-[#1C1C1E] sm:text-base">{c.litio}</p>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 5. Linha STILL em lítio */}
      <section className="section-py bg-white">
        <div className="site-container">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Linha STILL em lítio</p>
              <h2 className="mt-3 text-balance font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
                Uma máquina de lítio para cada etapa
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                As empilhadeiras elétricas STILL de 24, 48 e 80 V têm versão com bateria de lítio, da transpaleteira à
                contrabalançada.
              </p>
            </div>
            <Link href="/maquinas" className="group inline-flex shrink-0 items-center gap-2 font-semibold text-[#E85A00]">
              Ver equipamentos <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* No celular, os cartões deslizam para o lado; no desktop, ficam em quatro colunas */}
          <div className="-mx-[clamp(1rem,4vw,3rem)] mt-10 flex snap-x snap-mandatory scroll-px-[clamp(1rem,4vw,3rem)] gap-4 overflow-x-auto px-[clamp(1rem,4vw,3rem)] pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
            {LINHA.map((m) => (
              <Link
                key={m.titulo}
                href={m.href}
                className="group relative aspect-[3/4] w-[72%] shrink-0 snap-start overflow-hidden rounded-3xl bg-[#3a3a3f] sm:w-[42%] lg:w-auto"
              >
                <Image
                  src={m.image}
                  alt={m.alt}
                  fill
                  quality={90}
                  sizes="(min-width:1024px) 22vw, (min-width:640px) 42vw, 72vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: m.position }}
                />
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" aria-hidden />
                <span className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="block text-xl font-bold text-white">{m.titulo}</span>
                  <span className="mt-1 flex items-center justify-between gap-3 text-sm text-white/80">
                    {m.texto}
                    <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Proposta */}
      <section className="bg-[#E85A00]">
        <div className="site-container flex flex-col items-start justify-between gap-6 py-12 lg:flex-row lg:items-center lg:py-14">
          <div>
            <h2 className="font-display leading-none text-white" style={{ fontSize: "clamp(1.9rem, 3.2vw, 3rem)" }}>
              Teste o lítio na sua operação
            </h2>
            <p className="mt-3 max-w-xl text-lg text-white/90">
              Fale com a equipe Empilhatex. Indicamos a máquina, a bateria e o carregador certos para o seu turno.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={PROPOSTA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#1C1C1E] px-7 py-4 font-semibold text-white transition hover:bg-black"
            >
              <MessageCircle size={20} /> Solicitar proposta Empilhatex
            </a>
            <a
              href={`tel:${SITE.phone.replace(/\D/g, "")}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-white px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-[#E85A00]"
            >
              <Phone size={20} /> {SITE.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
