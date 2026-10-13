import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function History() {
  return (
    <section className="section-py bg-[#F5F5F7]">
      <div className="site-container grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg md:mx-0">
          <Image
            src="/images/home/historia.jpg"
            alt="Empilhadeira com bateria de lítio entregue pela Empilhatec"
            fill
            quality={90}
            sizes="(min-width:768px) 28rem, 90vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Nossa história</p>
          <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            Mais de 30 anos movimentando o Amazonas
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            A Empilhatec nasceu em Manaus, em 1996, e é hoje representante autorizada das marcas STILL e Linde, do KION
            Group, no Amazonas e em Roraima.
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-600">
            Atendemos a indústria e a logística da região com venda, locação, peças e assistência técnica de
            empilhadeiras, sempre perto de quem precisa.
          </p>
          <Link href="/sobre" className="group mt-7 inline-flex items-center gap-2 font-semibold text-[#E85A00]">
            Conheça a Empilhatec
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
