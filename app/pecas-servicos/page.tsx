import type { Metadata } from "next";
import Image from "next/image";
import { Package, Wrench, ShieldCheck, Clock } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Peças e Serviços | Empilhatec Empilhadeiras",
  description: "Peças genuínas STILL e manutenção especializada no Amazonas. Técnicos certificados e estoque próprio em Manaus.",
};

const SERVICES = [
  { icon: Wrench, title: "Manutenção Preventiva", desc: "Plano regular de manutenção conforme cronograma do fabricante, garantindo a vida útil do equipamento." },
  { icon: ShieldCheck, title: "Manutenção Corretiva", desc: "Atendimento de emergência com técnicos certificados. Em caso de parada, agimos rápido para minimizar o impacto na sua operação." },
  { icon: Package, title: "Peças Originais STILL", desc: "Estoque próprio de peças genuínas STILL em Manaus. Reposição rápida para todos os modelos da linha." },
  { icon: Clock, title: "Atendimento Prioritário", desc: "Clientes de locação têm prioridade no atendimento técnico. SLA definido em contrato." },
];

const BRANDS = ["STILL", "Linde", "Toyota", "Hyster", "Yale", "Crown", "Baoli", "Mitsubishi"];

export default function PecasServicosPage() {
  return (
    <>
      <section className="relative w-full overflow-hidden mt-16 lg:mt-[4.5rem] aspect-[4/3] md:aspect-auto md:h-[clamp(400px,52vh,600px)]">
        <Image
          src="/images/pecas-servicos-banner.jpg"
          alt="Técnico Empilhatec realizando manutenção"
          fill
          className="object-cover object-center md:object-[center_40%]"
          priority
          sizes="100vw"
          quality={95}
        />
        <div className="absolute inset-0" style={{ background: "rgba(10,18,30,0.62)" }} />
        <div className="site-container relative h-full flex items-end pb-12 lg:pb-16">
          <div>
            <h1 className="font-display text-white tracking-wide leading-none" style={{ fontSize: "clamp(2.6rem, 4.5vw, 5.2rem)" }}>
              Peças e Serviços
            </h1>
            <div className="w-12 h-0.5 bg-[#E85A00] mt-4" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <h2 className="heading-lg font-display text-[#1C1C1E] tracking-wide mb-10">
            Nossos Serviços
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-7 border border-gray-100 hover:border-[#E85A00]/30 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#E85A00]/10 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-[#E85A00]" />
                </div>
                <h3 className="font-display text-2xl text-[#1C1C1E] tracking-wide mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Multibrand */}
      <section className="section-py bg-white">
        <div className="site-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#E85A00] text-sm font-semibold uppercase tracking-widest">
                Atendimento Multimarca
              </span>
              <h2 className="heading-lg font-display text-[#1C1C1E] tracking-wide mt-2 mb-5">
                Não Apenas STILL
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Nossa equipe técnica está preparada para atender empilhadeiras de diversas marcas.
                Se você já tem equipamentos de outro fabricante, também podemos cuidar da
                manutenção e fornecer as peças necessárias em Manaus e no Amazonas.
              </p>
              <div className="flex flex-wrap gap-2">
                {BRANDS.map((brand) => (
                  <span
                    key={brand}
                    className={`px-3 py-1.5 rounded text-sm font-semibold ${
                      brand === "STILL"
                        ? "bg-[#E85A00] text-white"
                        : "bg-[#F5F5F7] text-gray-700"
                    }`}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-[#1C1C1E] rounded-2xl p-8 text-center">
              <h3 className="font-display text-3xl text-white tracking-wide mb-3">
                Solicitar Atendimento
              </h3>
              <p className="text-gray-400 mb-6">Descreva o problema e nossa equipe entra em contato.</p>
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=Olá!%20Preciso%20de%20assistência%20técnica.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#E85A00] hover:bg-[#C44A00] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors mb-3 w-full text-center"
              >
                Via WhatsApp
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-block border border-gray-600 hover:border-white text-gray-300 hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-colors w-full text-center"
              >
                Via E-mail
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
