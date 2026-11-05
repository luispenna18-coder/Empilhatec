import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import FadeUp from "@/components/FadeUp";

const HIGHLIGHTS = [
  "30 anos de expertise exclusiva em intralogística no Amazonas",
  "Cobertura completa no estado do Amazonas com logística própria",
  "Técnicos treinados com padrão internacional KION Group — a maior do mundo no setor",
  "Resposta rápida garantida: estoque próprio de peças e equipamentos em Manaus",
];

export default function AboutSection() {
  return (
    <section className="section-py bg-white">
      <div className="site-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <FadeUp direction="left">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src="/images/fachada-multylog.jpg"
                  alt="Fachada da Empilhatec Empilhadeiras"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#E2E2E5] rounded-xl px-5 py-4 shadow-xl border border-gray-300">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 text-center">Representante Autorizado</p>
                <div className="flex items-center justify-center gap-3">
                  <Image
                    src="/images/brands/logo-still-transparent.png"
                    alt="STILL"
                    width={72}
                    height={26}
                    className="object-contain"
                  />
                  <span className="w-px h-5 bg-gray-400" />
                  <Image
                    src="/images/brands/logo-linde-t.png"
                    alt="Linde"
                    width={72}
                    height={26}
                    className="object-contain"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Amazonas — Manaus / AM</p>
              </div>
            </div>
          </FadeUp>

          {/* Text */}
          <FadeUp direction="right" delay={0.1}>
            <div>
              <span className="text-[#E85A00] text-sm font-semibold uppercase tracking-widest">
                Sobre a Empilhatec
              </span>
              <h2 className="heading-lg font-display text-[#1C1C1E] mt-2 mb-6 tracking-wide">
                Muito Mais que uma Locadora
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Somos uma empresa com mais de 30 anos de experiência em movimentação de cargas
                intralogísticas. Como representante autorizado da STILL no Amazonas, oferecemos
                soluções completas de locação, venda, assistência técnica e peças para toda a sua
                operação.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Nossa sede em Manaus atende clientes em todo o estado do Amazonas, com estoque
                próprio, equipe certificada e o compromisso de manter sua operação funcionando sem
                imprevistos.
              </p>

              <ul className="space-y-3 mb-8">
                {HIGHLIGHTS.map((item, i) => (
                  <FadeUp key={item} delay={0.2 + i * 0.08}>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-[#E85A00] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  </FadeUp>
                ))}
              </ul>

              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 font-semibold text-[#E85A00] hover:text-[#C44A00] transition-colors"
              >
                Conheça nossa história <ArrowRight size={16} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
