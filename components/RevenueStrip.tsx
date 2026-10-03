import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  {
    num: "01",
    label: "Locação",
    desc: "Contratos flexíveis e pontuais para toda sua operação",
    href: "/locacao",
  },
  {
    num: "02",
    label: "Venda",
    desc: "Empilhadeiras novas e seminovos STILL certificados",
    href: "/maquinas",
  },
  {
    num: "03",
    label: "Peças e Serviços",
    desc: "Técnicos certificados e manutenção preventiva",
    href: "/pecas-servicos",
  },
] as const;

export default function RevenueStrip() {
  return (
    <section className="bg-[#F5F5F7] py-10 border-b border-gray-200">
      <div className="site-container">
        <div className="grid grid-cols-3 gap-4 max-w-[640px]">
          {SERVICES.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group relative bg-white border border-gray-200 hover:border-[#E85A00]/40 hover:shadow-md transition-all duration-300 p-7 lg:p-8 overflow-hidden"
            >
              {/* Orange top accent bar */}
              <span className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-[#E85A00] transition-all duration-500" />

              {/* Number */}
              <span className="block font-display text-[#E85A00] text-sm tracking-widest mb-4">
                {s.num}
              </span>

              {/* Divider */}
              <span className="block w-8 h-px bg-gray-200 mb-5" />

              {/* Title */}
              <span className="block font-display text-[#1C1C1E] tracking-wide mb-2" style={{ fontSize: "clamp(1.3rem, 1.6vw, 1.7rem)" }}>
                {s.label}
              </span>

              {/* Description */}
              <span className="block text-gray-500 text-sm leading-relaxed mb-6">
                {s.desc}
              </span>

              {/* CTA */}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#E85A00] group-hover:gap-2.5 transition-all duration-300">
                Saiba mais <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
