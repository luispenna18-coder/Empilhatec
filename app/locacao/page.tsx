"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  DollarSign,
  Wrench,
  Sliders,
  TrendingUp,
  Truck,
} from "lucide-react";
import QuoteForm from "@/components/QuoteForm";
import Steps from "@/components/Steps";
import { useState } from "react";
import { SITE } from "@/lib/constants";

const BENEFITS = [
  {
    icon: Truck,
    title: "Entrega Rápida no Amazonas",
    body: "Cobertura em todo o estado do Amazonas com estoque próprio. Logística ágil para Manaus e região metropolitana. Suas operações não param esperando por equipamento.",
  },
  {
    icon: ShieldCheck,
    title: "Operação Sem Preocupações",
    body: "Em caso de quebra ou manutenção, realizamos substituição do equipamento. Assistência técnica especializada sempre disponível para manter sua operação funcionando.",
  },
  {
    icon: DollarSign,
    title: "Investimento Previsível",
    body: "Valor mensal fixo que inclui manutenção preventiva e corretiva, peças de reposição e suporte técnico. Você planeja seus custos com precisão, sem imprevistos.",
  },
  {
    icon: Wrench,
    title: "Assistência Técnica Especializada",
    body: "Técnicos certificados e treinados diretamente pela STILL. Peças genuínas disponíveis. Atendimento prioritário para clientes de locação em todo o Amazonas.",
  },
  {
    icon: Sliders,
    title: "Flexibilidade Operacional",
    body: "Ajuste a quantidade de equipamentos conforme picos sazonais ou mudanças na operação. Contratos flexíveis que acompanham as necessidades da sua empresa, sem amarras.",
  },
  {
    icon: TrendingUp,
    title: "Otimização Financeira",
    body: "Despesa operacional dedutível. Não imobiliza recursos que podem ser investidos no core business. Acesso a equipamentos de última geração sem comprometer seu caixa.",
  },
];

const BASE = "https://data.still.de/bilder/001";

const EQUIPMENT = [
  { name: "Empilhadeira Contrabalançada", image: `${BASE}/RCE_20_25.png`, href: "/maquinas?categoria=contrabalancada", brands: ["STILL"] },
  { name: "Retrátil", image: `${BASE}/FM-X_17-20.png`, href: "/maquinas?categoria=retratil", brands: ["STILL"] },
  { name: "Patolada", image: `${BASE}/EGV_16_NG.png`, href: "/maquinas?categoria=patolada", brands: ["STILL"] },
  { name: "Transpaleteira", image: `${BASE}/ERX_27.png`, href: "/maquinas?categoria=transpaleteira", brands: ["STILL"] },
  { name: "Selecionadora de Pedidos", image: "https://data.still.de/assets/products/Vehicles/Order_Pickers/OPX_20-25/images/OPX-20_800x800.png?w=800&fit=max&fm=webp", href: "/maquinas?categoria=selecionadora", brands: ["STILL"] },
];

const COMPARISON = [
  {
    label: "Preservação de Caixa",
    compra: "Capital imobilizado no ativo",
    locacao: "Caixa 100% livre para o negócio",
  },
  {
    label: "Previsibilidade de Custos",
    compra: "Manutenção gera custos imprevistos",
    locacao: "Mensalidade fixa, sem surpresas",
  },
  {
    label: "Disponibilidade da Frota",
    compra: "Paradas dependem do seu time técnico",
    locacao: "Substituição garantida em caso de falha",
  },
  {
    label: "Idade Média da Frota",
    compra: "Equipamento envelhece sem renovação",
    locacao: "Frota sempre nova, sem envelhecimento",
  },
  {
    label: "Foco no Core Business",
    compra: "Gestão de frota consome tempo e recursos",
    locacao: "Zero preocupação com o equipamento",
  },
  {
    label: "Proteção contra Obsolescência",
    compra: "Risco de desvalorização e revenda difícil",
    locacao: "Sem risco de ativo — troca quando quiser",
  },
];

const container = "max-w-7xl mx-auto px-4 sm:px-8 lg:px-12";

export default function LocacaoPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden mt-16 lg:mt-[4.5rem] aspect-[4/3] md:aspect-auto md:h-[clamp(400px,52vh,600px)]">
        <Image
          src="/images/locacao-banner.jpg"
          alt="Empilhadeiras STILL no galpão"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={95}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(28,28,30,0.72) 0%, rgba(28,28,30,0.50) 35%, rgba(28,28,30,0.08) 60%, rgba(28,28,30,0) 75%)" }} />
        <div className="site-container relative h-full flex items-end pb-12 lg:pb-16">
          <div>
            <h1 className="font-display text-white tracking-wide leading-none" style={{ fontSize: "clamp(2.6rem, 4.5vw, 5.2rem)" }}>
              Locação
            </h1>
            <div className="w-12 h-0.5 bg-[#E85A00] mt-4 mb-6" />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/maquinas"
                className="inline-flex items-center gap-2 border border-white/70 hover:border-white text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                Ver Equipamentos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vantagens ────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className={container}>
          <h2
            className="font-display text-[#1C1C1E] tracking-wide mb-12"
            style={{ fontSize: "clamp(1.8rem, 3vw, 3rem)" }}
          >
            Vantagens da Locação
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map(({ icon: Icon, title, body }) => {
              const isActive = active === title;
              return (
                <button
                  key={title}
                  onClick={() => setActive(isActive ? null : title)}
                  className={`flex flex-col gap-3 p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer
                    ${isActive
                      ? "bg-[#E85A00] border-[#E85A00] shadow-lg scale-[1.02]"
                      : "bg-[#F5F5F7] border-gray-200 hover:border-[#E85A00]/40 hover:shadow-md"
                    }`}
                >
                  <Icon size={28} strokeWidth={1.25} className={isActive ? "text-white" : "text-[#E85A00]"} />
                  <div>
                    <h3 className={`font-sans font-bold text-base leading-snug mb-1.5 ${isActive ? "text-white" : "text-[#1C1C1E]"}`}>
                      {title}
                    </h3>
                    <p className={`font-sans text-sm leading-relaxed ${isActive ? "text-white/90" : "text-[#3D3D3D]"}`}>
                      {body}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-12">
            <Link
              href="/maquinas"
              className="inline-flex items-center gap-2 border border-gray-400 hover:border-gray-700 text-[#1C1C1E] font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Ver Equipamentos
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tabela Comparativa ───────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-[#F5F5F7]">
        <div className={container}>

          {/* Cabeçalho */}
          <div className="mb-10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="w-6 h-0.5 bg-[#E85A00]" />
              <span className="text-[#E85A00] text-xs font-semibold uppercase tracking-widest">Tabela Comparativa</span>
              <span className="w-6 h-0.5 bg-[#E85A00]" />
            </div>
            <div className="hidden sm:grid grid-cols-[1fr_140px_1fr] items-center gap-6">
              <div className="text-right">
                <h2 className="font-display font-bold text-[#E85A00] tracking-wide leading-tight" style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.4rem)" }}>
                  Compra de<br />Equipamento
                </h2>
                <p className="text-gray-700 text-sm mt-2 leading-snug">
                  Imobiliza capital e gera custos ocultos<br />com manutenção e depreciação.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#E85A00] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <g transform="translate(24,0) scale(-1,1)">
                      <path d="M3 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M12 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      <path d="M7 17l5 0" /><path d="M3 17v-6h13v6" /><path d="M5 11v-4h4" />
                      <path d="M9 11v-6h4l3 6" /><path d="M22 15h-3v-10" /><path d="M16 13l3 0" />
                    </g>
                  </svg>
                </div>
                <span className="font-display text-[#1C1C1E] text-2xl tracking-widest">VS</span>
                <div className="w-14 h-14 rounded-full bg-[#1C1C1E] flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <g transform="translate(24,0) scale(-1,1)">
                      <path d="M3 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M12 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                      <path d="M7 17l5 0" /><path d="M3 17v-6h13v6" /><path d="M5 11v-4h4" />
                      <path d="M9 11v-6h4l3 6" /><path d="M22 15h-3v-10" /><path d="M16 13l3 0" />
                    </g>
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="font-display font-bold text-[#1C1C1E] tracking-wide leading-tight" style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.4rem)" }}>
                  Locação<br />de Frota
                </h2>
                <p className="text-gray-700 text-sm mt-2 leading-snug">
                  Custos fixos, manutenção inclusa, alta<br />disponibilidade e vantagens fiscais.
                </p>
              </div>
            </div>
            <div className="sm:hidden flex items-center justify-around">
              <h2 className="font-display font-bold text-[#E85A00] text-xl tracking-wide">Compra</h2>
              <span className="font-display text-[#1C1C1E] text-3xl tracking-widest">VS</span>
              <h2 className="font-display font-bold text-[#1C1C1E] text-xl tracking-wide">Locação</h2>
            </div>
          </div>

          {/* Linhas de comparação */}
          <div className="flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
            {COMPARISON.map(({ label, compra, locacao }, i) => (
              <div key={label} className={i % 2 === 0 ? "bg-white" : "bg-[#F9F9FB]"}>

                <div className="sm:hidden px-4 py-4 flex flex-col gap-3">
                  <span className="text-[#1C1C1E] font-bold text-[10px] uppercase tracking-widest text-center bg-[#F5F5F7] py-1 rounded">{label}</span>
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white text-xs font-bold">✓</span>
                    <span className="text-[#1C1C1E] font-semibold text-sm leading-snug">{locacao}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#F0F0F0] flex items-center justify-center text-gray-400 text-xs font-bold">✕</span>
                    <span className="text-gray-500 text-sm leading-snug">{compra}</span>
                  </div>
                </div>

                <div className="hidden sm:grid grid-cols-[1fr_160px_1fr] items-stretch">
                  <div className="flex items-center justify-end gap-3 px-5 py-4 border-r border-gray-200">
                    <span className="text-gray-800 text-sm leading-snug text-right">{compra}</span>
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#F0F0F0] flex items-center justify-center text-gray-400 text-xs font-bold">✕</span>
                  </div>
                  <div className="flex items-center justify-center px-3 py-4 bg-[#F5F5F7] border-x border-gray-200">
                    <span className="text-[#1C1C1E] font-bold text-[10px] sm:text-xs uppercase tracking-wide leading-tight text-center">{label}</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-4">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white text-xs font-bold">✓</span>
                    <span className="text-[#1C1C1E] font-semibold text-sm leading-snug">{locacao}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Banner intermediário ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ height: "clamp(240px, 32vw, 460px)" }}>
        <Image
          src="/images/locacao-galpao-09.jpg"
          alt="Empilhadeira em operação no galpão"
          fill
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(28,28,30,0.82) 0%, rgba(28,28,30,0.55) 40%, rgba(28,28,30,0.10) 70%, rgba(28,28,30,0) 100%)" }} />
        <div className="relative z-10 h-full flex items-center">
          <div className={`${container} w-full`}>
            <h2
              className="font-display text-white tracking-wide leading-tight mb-8"
              style={{ fontSize: "clamp(1.8rem, 3.8vw, 4rem)" }}
            >
              Com a Locação<br />Seu Negócio<br />Nunca Para
            </h2>
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=Olá!%20Quero%20solicitar%20uma%20cotação%20de%20locação.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-white text-white text-sm font-semibold uppercase tracking-widest px-7 py-3 rounded-xl hover:bg-white hover:text-[#1C1C1E] transition-colors"
            >
              Solicite sua cotação
            </a>
          </div>
        </div>
      </section>

      {/* ── Equipamentos ─────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-white">
        <div className={container}>
          <div className="text-center mb-12">
            <span className="text-[#E85A00] text-sm font-semibold uppercase tracking-widest">
              Frota Disponível
            </span>
            <h2
              className="font-display text-[#1C1C1E] mt-2 tracking-wide"
              style={{ fontSize: "clamp(1.8rem, 3vw, 3rem)" }}
            >
              Equipamentos para Locação
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Clique no equipamento para ver as especificações técnicas completas.
            </p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {EQUIPMENT.map((eq) => (
              <Link
                key={eq.name}
                href={eq.href}
                className="group shrink-0 w-52 bg-[#F5F5F7] rounded-xl overflow-hidden border border-gray-100 hover:border-[#E85A00]/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="aspect-square bg-white relative">
                  <Image
                    src={eq.image}
                    alt={eq.name}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform"
                    sizes="208px"
                  />
                </div>
                <div className="p-4 pb-5">
                  <p className="text-[#1C1C1E] font-bold text-base leading-tight mb-3">{eq.name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {eq.brands.map((brand) => (
                      <span
                        key={brand}
                        className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 border border-gray-200 rounded-full px-2.5 py-1 bg-white"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cotação ──────────────────────────────────────────────────── */}
      <section className="bg-[#F5F5F7] py-16 lg:py-24">
        <div className={container}>
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-6 h-0.5 bg-[#E85A00]" />
                <span className="text-[#E85A00] text-sm font-semibold uppercase tracking-widest">
                  Solicite sua cotação
                </span>
              </div>
              <h2
                className="font-display font-normal text-[#1C1C1E] tracking-wide leading-none mb-5"
                style={{ fontSize: "clamp(1.8rem, 3vw, 3.2rem)" }}
              >
                Proposta Personalizada em até 24h
              </h2>
              <div className="w-12 h-0.5 bg-[#E85A00] mb-6" />
              <Steps />
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=Olá!%20Quero%20uma%20cotação%20de%20locação%20de%20empilhadeiras.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
              >
                Ou fale pelo WhatsApp
              </a>
            </div>
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
