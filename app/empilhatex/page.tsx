import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Empilhatex | Empilhatec Empilhadeiras",
  description:
    "Empilhatex: locação de empilhadeiras elétricas com bateria de lítio da linha STILL, da Empilhatec, no Amazonas e em Roraima.",
};

// Página PROVISÓRIA: a aba foi criada; o conteúdo e a estrutura serão definidos depois.
export default function EmpilhatexPage() {
  return (
    <>
      <PageBanner image="/images/banners/empilhatex.webp" alt="Transpaleteira elétrica com bateria de lítio em operação" position="center 40%">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white before:mr-3 before:inline-block before:h-0.5 before:w-7 before:bg-[#E85A00] before:align-middle">Marca Empilhatec</p>
        <h1 className="font-display leading-none text-white" style={{ fontSize: "clamp(2.6rem, 4.5vw, 5.2rem)" }}>
          Empilhatex
        </h1>
        <div className="mt-4 h-0.5 w-12 bg-[#E85A00]" />
        <p className="mt-5 max-w-2xl text-lg text-white/95">
          Locação de empilhadeiras elétricas com bateria de lítio, da linha STILL.
        </p>
      </PageBanner>

      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-8">
            <h2 className="text-xl font-bold text-[#1C1C1E]">Em construção</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              Esta página apresentará a Empilhatex em detalhes. Enquanto isso, fale com a nossa equipe para saber mais
              sobre a locação de máquinas elétricas com bateria de lítio.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink("Olá! Quero saber mais sobre a Empilhatex.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-[#E85A00] px-6 py-3 font-semibold text-white transition hover:bg-[#C44A00]"
              >
                Falar com a equipe
              </a>
              <Link
                href="/maquinas/categoria/transpaleteira"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-[#1C1C1E] transition hover:border-[#E85A00] hover:text-[#E85A00]"
              >
                Ver máquinas <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
