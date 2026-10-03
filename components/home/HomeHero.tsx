import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { whatsappLink } from "@/lib/constants";

const FATOS = ["Desde 1996 em Manaus", "STILL · Linde · Baoli", "Amazonas e Roraima"];

export default function HomeHero() {
  return (
    <PageBanner
      image="/images/banners/home.webp"
      alt="Empilhadeira STILL com operador no porto"
      position="center 55%"
      size="hero"
    >
      <div className="max-w-2xl pb-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white before:mr-3 before:inline-block before:h-0.5 before:w-7 before:bg-[#E85A00] before:align-middle">
          Representante autorizado STILL e Linde
        </p>
        <h1 className="mt-4 font-display leading-[0.95] text-white" style={{ fontSize: "clamp(3rem, 6vw, 6rem)" }}>
          Sua operação
          <br />
          não pode parar.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/95">
          Venda, locação, peças e assistência técnica de empilhadeiras no Amazonas e em Roraima, com a Empilhatec há 30
          anos em Manaus.
        </p>
        <div className="mt-8 flex flex-col gap-3 [text-shadow:none] sm:flex-row">
          <a
            href={whatsappLink("Olá! Quero falar com um especialista da Empilhatec.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E85A00] px-7 py-4 font-semibold text-white transition hover:bg-[#C44A00]"
          >
            <MessageCircle size={20} /> Falar com um especialista
          </a>
          <Link
            href="/maquinas"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/70 bg-black/20 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-[#1C1C1E]"
          >
            Ver máquinas <ArrowRight size={18} />
          </Link>
        </div>
        <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-white/90">
          {FATOS.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF7A2B]" aria-hidden /> {f}
            </li>
          ))}
        </ul>
      </div>
    </PageBanner>
  );
}
