import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/constants";

export default function HomeHero() {
  return (
    <section className="relative mt-16 overflow-hidden bg-[#1C1C1E] lg:mt-[4.5rem]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#E85A00]/15 blur-3xl" aria-hidden />
      <div className="site-container relative grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">
            Representante autorizado STILL e Linde
          </p>
          <h1 className="mt-4 font-display leading-[0.95] text-white" style={{ fontSize: "clamp(2.8rem, 5.6vw, 5.6rem)" }}>
            Sua operação
            <br />
            não pode parar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
            Venda, locação, peças e assistência técnica de empilhadeiras no Amazonas e em Roraima, com a Empilhatec há
            30 anos em Manaus.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-7 py-4 font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Ver máquinas <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:ml-auto">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border-2 border-[#E85A00]/60" aria-hidden />
          <div className="relative h-full overflow-hidden rounded-3xl bg-black">
            <Image
              src="/images/home/hero.jpg"
              alt="Empilhadeira STILL no galpão de um cliente da Empilhatec"
              fill
              priority
              quality={90}
              sizes="(min-width:1024px) 34rem, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 rounded-2xl bg-white px-5 py-3 shadow-xl">
            <p className="text-3xl font-extrabold leading-none text-[#E85A00]">1996</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">fundada em Manaus</p>
          </div>
        </div>
      </div>
    </section>
  );
}
