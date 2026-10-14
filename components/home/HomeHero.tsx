import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import HeroVideo from "@/components/home/HeroVideo";
import { whatsappLink } from "@/lib/constants";

/**
 * Hero da Home com vídeo de fundo ocupando a primeira tela, no formato do site da Carmak: título grande e
 * centralizado (segunda linha no laranja da marca), parágrafo e os dois botões. O vídeo é o institucional da
 * Empilhatec no YouTube (youtu.be/lQ1zWi8R9Go) até antes da tela final de contato; nos planos com legenda, a faixa
 * do meio já vem desfocada no arquivo, para a legenda não aparecer entre as letras do título.
 */
export default function HomeHero() {
  return (
    <section className="relative mt-[var(--header-h)] flex min-h-[calc(100svh_-_var(--header-h))] items-center overflow-hidden bg-[#141416] text-white">
      <HeroVideo src="/videos/home-hero.mp4" poster="/videos/home-hero.webp" />
      {/* escurece o vídeo por igual e um pouco mais no meio, atrás do texto */}
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_center,rgba(0,0,0,0.5),transparent)]" aria-hidden />

      <div className="site-container relative w-full py-20 text-center">
        <h1
          className="font-display font-extrabold leading-none tracking-[-0.03em] text-balance"
          style={{ fontSize: "clamp(2.6rem, 6.5vw, 6.25rem)" }}
        >
          <span className="hero-rise block">Soluções logísticas</span>
          <span className="hero-rise mx-auto mt-[0.06em] block w-fit bg-gradient-to-r from-[#FF8A3D] to-[#E85A00] bg-clip-text pb-[0.06em] text-transparent [animation-delay:0.1s]">
            na Amazônia
          </span>
        </h1>
        <p className="hero-rise mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-white/85 [animation-delay:0.22s] [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] sm:text-xl">
          Venda, locação, peças e assistência técnica no Amazonas e em Roraima. Há 30 anos atendendo indústrias, centros
          de distribuição e o porto de Manaus.
        </p>
        <div className="hero-rise mt-10 flex flex-col justify-center gap-3 [animation-delay:0.34s] sm:flex-row sm:gap-4">
          <a
            href={whatsappLink("Olá! Quero falar com um especialista da Empilhatec.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E85A00] px-7 py-4 font-semibold text-white transition hover:bg-[#C44A00]"
          >
            <MessageCircle size={20} /> Falar com especialista
          </a>
          <Link
            href="/sobre"
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/70 bg-black/20 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-[#1C1C1E]"
          >
            Conhecer a Empilhatec
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
