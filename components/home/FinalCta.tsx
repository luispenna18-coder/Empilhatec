import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/constants";

// Mesmo formato das faixas escuras do site (ex.: Empilhatex na Locação): grafite, foto apagada,
// texto à esquerda e botão à direita.
export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#1C1C1E]">
      {/* Foto de fundo (STILL, sistemas intralogísticos) */}
      <Image
        src="/images/home/cta-armazem.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-30"
        style={{ objectPosition: "center 45%" }}
      />
      <div className="site-container relative flex flex-col items-start justify-between gap-8 py-16 lg:flex-row lg:items-center lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Fale com a Empilhatec</p>
          <h2 className="mt-3 text-balance font-display leading-none text-white" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            Vamos conversar sobre a sua operação?
          </h2>
          <p className="mt-4 text-lg text-gray-300">Conte o que você precisa e nossa equipe indica a melhor solução.</p>
        </div>
        <a
          href={whatsappLink("Olá! Gostaria de falar com um especialista.")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#E85A00] px-7 py-4 font-semibold text-white transition hover:bg-[#C44A00]"
        >
          <MessageCircle size={18} /> Falar com especialista
        </a>
      </div>
    </section>
  );
}
