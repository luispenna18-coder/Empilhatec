import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import Trajetoria from "@/components/sobre/Trajetoria";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre a Empilhatec | 30+ Anos em Empilhadeiras no Amazonas",
  description: "Conheça a história da Empilhatec Empilhadeiras, representante autorizado STILL para o Amazonas há mais de 30 anos.",
};

export default function SobrePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <PageBanner image="/images/banners/sobre.webp" alt="Empilhadeira em operação de logística" position="center 45%">
        <h1 className="font-display leading-none text-white" style={{ fontSize: "clamp(2.6rem, 4.5vw, 5.2rem)" }}>
          Sobre a Empilhatec
        </h1>
        <div className="mt-4 h-0.5 w-12 bg-[#E85A00]" />
      </PageBanner>

      <section id="historia" className="section-py bg-white">
        <div className="site-container">
          <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Nossa história</p>
            <h2 className="mt-3 text-balance font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Tradição e expertise em intralogística
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                A Empilhatec Empilhadeiras nasceu em Manaus com um propósito claro: oferecer soluções
                completas em movimentação de cargas para as empresas do Amazonas. Ao longo de mais
                de 30 anos, nos tornamos muito mais que uma locadora.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Como representante autorizado da STILL no Amazonas, fazemos parte do ecossistema
                KION Group, um dos maiores grupos de equipamentos de movimentação do mundo,
                o que nos permite oferecer tecnologia de ponta com o atendimento personalizado
                de uma empresa comprometida com a região.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "Representante oficial STILL",
                  "Técnicos certificados STILL",
                  "Estoque próprio em Manaus",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-[#E85A00] flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vídeo institucional (canal da Empilhatec no YouTube) */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/2u5URToeOu0?rel=0"
                title="Empilhadeiras para Negócios: Conte com a Empilhatec!"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Gestor ── */}
      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Liderança</p>
            <h2 className="mt-3 text-balance font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Conheça nossa liderança
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Profissionais comprometidos com as melhores soluções em movimentação de cargas para o Amazonas.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                name: "Deocleciano Pontes",
                role: "GESTOR",
                linkedin: "https://www.linkedin.com/in/deocleciano-pontes-55a5b861/",
                image: "/images/deocleciano-pontes.jpg",
              },
            ].map((person) => (
              <div key={person.name} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#E85A00]/30 hover:-translate-y-1 transition-all duration-300 p-8 flex flex-col items-center text-center w-64">
                <div className="relative w-36 h-36 rounded-full overflow-hidden mb-5 border-4 border-[#E85A00]/10 group-hover:border-[#E85A00]/40 transition-colors duration-300">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-display text-2xl text-[#1C1C1E] tracking-wide">{person.name}</h3>
                <p className="text-[#E85A00] text-xs font-semibold uppercase tracking-widest mt-1 mb-5">{person.role}</p>
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0077B5] hover:bg-[#005f8e] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Linha do tempo ── */}
      <Trajetoria />
    </>
  );
}
