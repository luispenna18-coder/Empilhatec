import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";

const PONTOS = [
  "Equipamentos novos STILL, com padrão técnico de fábrica",
  "Peças originais e assistência técnica autorizada",
  "Linde e Baoli, do mesmo grupo KION, para completar a sua frota",
];

export default function DealerStill() {
  return (
    <section className="section-py bg-white" aria-labelledby="dealer-still">
      <div className="site-container grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00] before:mr-3 before:inline-block before:h-0.5 before:w-7 before:bg-[#E85A00] before:align-middle">
            Dealer autorizado STILL
          </p>
          <h2 id="dealer-still" className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            A STILL no Amazonas e em Roraima, com a Empilhatec
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            A STILL é uma marca alemã de empilhadeiras do KION Group. Como dealer autorizado, a Empilhatec traz os
            equipamentos, as peças e o padrão técnico da fábrica para o Norte do país, com atendimento local em Manaus.
          </p>
          <ul className="mt-6 space-y-3 text-gray-700">
            {PONTOS.map((t) => (
              <li key={t} className="flex gap-3">
                <BadgeCheck size={20} className="mt-0.5 shrink-0 text-[#E85A00]" /> {t}
              </li>
            ))}
          </ul>
          <Link href="/maquinas" className="group mt-8 inline-flex items-center gap-2 font-semibold text-[#E85A00]">
            Ver as máquinas STILL
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#6b6b70] shadow-xl">
          <Image
            src="/images/home/dealer-still.webp"
            alt="Logotipo STILL em placa metálica"
            fill
            quality={90}
            sizes="(min-width:1024px) 48vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 35%" }}
          />
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1C1C1E] shadow-lg">
            <BadgeCheck size={15} className="text-[#E85A00]" /> Dealer autorizado
          </span>
        </div>
      </div>
    </section>
  );
}
