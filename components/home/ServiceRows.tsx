import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeUp from "@/components/FadeUp";

const ROWS = [
  {
    n: "01",
    title: "Comprar",
    text: "Empilhadeiras novas STILL, Linde e Baoli, de transpaleteiras a máquinas de grande capacidade. Nossa equipe ajuda a escolher o modelo certo para a sua operação.",
    cta: { label: "Ver máquinas", href: "/maquinas" },
    image: "/images/home/comprar-equipe-van.webp",
    alt: "Consultores e técnico STILL em frente a um galpão, com a van de serviço ao fundo",
    position: "center 55%",
  },
  {
    n: "02",
    title: "Locar",
    text: "Locação de empilhadeiras elétricas e a combustão, transpaleteiras e outros equipamentos, pelo período e na capacidade que a sua operação pede.",
    cta: { label: "Conhecer a locação", href: "/locacao" },
    image: "/images/home/locar-armazem.webp",
    alt: "Frota de empilhadeiras STILL trabalhando em um armazém",
    position: "center 50%",
  },
  {
    n: "03",
    title: "Peças",
    text: "Peças originais e de reposição para empilhadeiras, com estoque em Manaus para a sua máquina voltar a trabalhar mais rápido.",
    cta: { label: "Ver peças", href: "/pecas-servicos#pecas" },
    image: "/images/home/pecas-rolamento.webp",
    alt: "Técnico mostrando um rolamento original",
    position: "center 40%",
  },
  {
    n: "04",
    title: "Assistência técnica",
    text: "Manutenção preventiva e corretiva de empilhadeiras elétricas e a combustão, feita por equipe técnica certificada pelos fabricantes.",
    cta: { label: "Conhecer a assistência", href: "/pecas-servicos#assistencia" },
    image: "/images/home/assistencia-fabrica.webp",
    alt: "Técnicos montando empilhadeiras em uma linha de produção",
    position: "center 50%",
  },
];

export default function ServiceRows() {
  return (
    <section className="section-py bg-[#F5F5F7]">
      <div className="site-container">
        <div className="mb-12 max-w-2xl lg:mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">O que fazemos</p>
          <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            Tudo em empilhadeiras, em um só lugar
          </h2>
        </div>

        <div className="flex flex-col gap-14 lg:gap-24">
          {ROWS.map((r, i) => (
            <FadeUp key={r.title}>
              <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-16">
                <div className={`relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-lg ${i % 2 ? "md:order-2" : ""}`}>
                  <Image
                    src={r.image}
                    alt={r.alt}
                    fill
                    quality={90}
                    sizes="(min-width:768px) 45vw, 100vw"
                    className="object-cover"
                    style={{ objectPosition: r.position }}
                  />
                </div>
                <div>
                  <p className="text-5xl font-extrabold leading-none text-[#E85A00]/25">{r.n}</p>
                  <h3 className="mt-2 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.4vw, 3.2rem)" }}>
                    {r.title}
                  </h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-gray-600">{r.text}</p>
                  <Link
                    href={r.cta.href}
                    className="group mt-6 inline-flex items-center gap-2 font-semibold text-[#E85A00]"
                  >
                    {r.cta.label}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
