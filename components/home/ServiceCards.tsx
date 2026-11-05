import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeUp from "@/components/FadeUp";

const CARDS = [
  {
    title: "Locação",
    text: "Empilhadeiras elétricas e a combustão, transpaleteiras e outros equipamentos, pelo período e na capacidade que a sua operação pede.",
    cta: { label: "Conhecer a locação", href: "/locacao" },
    image: "/images/home/locar-armazem.webp",
    alt: "Frota de empilhadeiras STILL trabalhando em um armazém",
    position: "center 50%",
  },
  {
    title: "Venda",
    text: "Empilhadeiras novas STILL, Linde e Baoli, de transpaleteiras a máquinas de grande capacidade. Nossa equipe ajuda a escolher o modelo certo para a sua operação.",
    cta: { label: "Ver as máquinas", href: "/maquinas" },
    image: "/images/home/comprar-equipe-van.webp",
    alt: "Consultores e técnico STILL em frente a um galpão, com a van de serviço ao fundo",
    position: "center 55%",
  },
  {
    title: "Peças e serviços",
    text: "Peças originais com estoque em Manaus e manutenção preventiva e corretiva feita por equipe técnica certificada pelos fabricantes.",
    cta: { label: "Conhecer peças e serviços", href: "/pecas-servicos" },
    image: "/images/home/pecas-rolamento.webp",
    alt: "Técnico mostrando um rolamento original",
    position: "center 40%",
  },
];

/** Os três serviços da Empilhatec em cartões com foto, no formato da seção equivalente do site da Carmak. */
export default function ServiceCards() {
  return (
    <section className="section-py bg-[#F5F5F7]">
      <div className="site-container">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">O que fazemos</p>
          <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            Tudo em empilhadeiras, em um só lugar
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <FadeUp key={c.title} delay={i * 0.08} className="h-full">
              <Link
                href={c.cta.href}
                className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    quality={90}
                    sizes="(min-width:768px) 32vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ objectPosition: c.position }}
                  />
                </div>
                <div className="flex flex-1 flex-col p-7 lg:p-9">
                  <h3 className="font-display text-[1.75rem] font-bold leading-tight text-[#1C1C1E] lg:text-[2rem]">{c.title}</h3>
                  <p className="mt-4 leading-relaxed text-gray-600 lg:text-[1.0625rem]">{c.text}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-7 font-semibold text-[#E85A00]">
                    {c.cta.label}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
