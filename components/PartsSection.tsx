import Link from "next/link";
import Image from "next/image";
import { Package, Wrench, Truck, ShieldCheck } from "lucide-react";
import FadeUp from "@/components/FadeUp";

const FEATURES = [
  {
    icon: Package,
    label: "Peças Genuínas STILL",
    desc: "Apenas reposição original, sem improvisos.",
  },
  {
    icon: Wrench,
    label: "Multimarca",
    desc: "Atendemos outras marcas além da STILL.",
  },
  {
    icon: Truck,
    label: "Pronta Entrega",
    desc: "Estoque próprio em Manaus para agilidade máxima.",
  },
  {
    icon: ShieldCheck,
    label: "Garantia de Qualidade",
    desc: "Peças certificadas com garantia do fabricante.",
  },
];

export default function PartsSection() {
  return (
    <section className="relative section-py bg-white overflow-hidden">

      <div className="site-container">
        {/* ── Coluna de texto ── */}
        <FadeUp direction="left">
          <div className="lg:max-w-[50%]">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-0.5 bg-[#E85A00]" />
              <span className="text-[#E85A00] text-xs font-semibold uppercase tracking-widest">
                Peças e Serviços
              </span>
            </div>

            <h2 className="heading-lg font-display text-[#1C1C1E] tracking-wide leading-none mb-6">
              Manutenção sem Imprevistos
            </h2>

            <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8">
              Nossa divisão de peças e serviços garante que sua operação nunca para por falta
              de reposição. Trabalhamos com peças genuínas STILL e atendemos outras marcas do
              mercado com estoque próprio em Manaus.
            </p>

            {/* Cards 2×2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                <FadeUp key={label} delay={0.08 + i * 0.07}>
                  <div className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-[#E85A00]/40 hover:shadow-sm transition-all">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-[#F5F5F7]">
                      <Icon size={26} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-[#1C1C1E] font-semibold text-sm leading-snug">
                        {label}
                      </p>
                      <p className="text-gray-600 text-sm mt-1 leading-snug">
                        {desc}
                      </p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>

            <Link
              href="/pecas-servicos"
              className="inline-flex items-center gap-2 bg-[#E85A00] hover:bg-[#C44A00] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Ver Peças e Serviços
            </Link>
          </div>
        </FadeUp>

        {/* ── Imagem lateral desktop ── */}
        <FadeUp direction="right" delay={0.15} className="hidden lg:block">
          <div className="absolute right-0 inset-y-0 w-[46%] pointer-events-none">
            <Image
              src="/images/parts/still-exploded.png"
              alt="Empilhadeira STILL"
              fill
              className="object-contain object-right-center opacity-90"
              style={{ mixBlendMode: "multiply" }}
              sizes="46vw"
              quality={90}
            />
          </div>
        </FadeUp>

        {/* ── Imagem mobile ── */}
        <FadeUp direction="right" delay={0.1} className="lg:hidden mt-10">
          <div className="relative w-full aspect-[4/3]">
            <Image
              src="/images/parts/still-exploded.png"
              alt="Empilhadeira STILL"
              fill
              className="object-contain object-center"
              style={{ mixBlendMode: "multiply" }}
              sizes="100vw"
              quality={90}
            />
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
