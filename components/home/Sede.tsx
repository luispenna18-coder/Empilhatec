import Image from "next/image";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { SITE } from "@/lib/constants";

const MAPA = "https://www.google.com/maps/place/Empilhatec+da+Amaz%C3%B4nia/@-3.110039,-59.9935982,17z";

/**
 * A sede em Manaus, com a foto da fachada nova. Espelha a seção da STILL logo acima (foto à esquerda, texto à
 * direita). A foto tem 1053 px de largura, por isso fica numa coluna e não em faixa de tela inteira.
 */
export default function Sede() {
  const { street, city } = SITE.addresses.principal;
  return (
    <section className="section-py bg-white pt-0" aria-labelledby="sede">
      <div className="site-container grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-[#2a2a2e] shadow-xl">
          <Image
            src="/images/home/fachada.webp"
            alt="Fachada da Empilhatec em Manaus, com as marcas Linde, STILL, Baoli e Empilhatec-X"
            fill
            quality={90}
            sizes="(min-width:1024px) 52vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00] before:mr-3 before:inline-block before:h-0.5 before:w-7 before:bg-[#E85A00] before:align-middle">
            Nossa sede
          </p>
          <h2 id="sede" className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            Nossa casa em Manaus
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            No mesmo endereço ficam a venda de máquinas, a locadora Empilhatec-X, o estoque de peças e a oficina. É de
            lá que a nossa equipe atende o Amazonas e Roraima.
          </p>
          <ul className="mt-6 space-y-3 text-gray-700">
            <li className="flex gap-3">
              <MapPin size={20} className="mt-0.5 shrink-0 text-[#E85A00]" /> {street}, {city}
            </li>
            <li className="flex gap-3">
              <Clock size={20} className="mt-0.5 shrink-0 text-[#E85A00]" /> {SITE.hours}
            </li>
          </ul>
          <a
            href={MAPA}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 font-semibold text-[#E85A00]"
          >
            Como chegar
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
