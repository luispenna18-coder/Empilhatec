import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarClock, Gauge, Headset, MessageCircle, PackageCheck, Wallet, Wrench } from "lucide-react";
import FadeUp from "@/components/FadeUp";
import MachineCard from "@/components/MachineCard";
import PageBanner from "@/components/PageBanner";
import QuoteForm from "@/components/QuoteForm";
import { SITE, whatsappLink } from "@/lib/constants";
import { getProduct, type Product } from "@/lib/products";

export const metadata: Metadata = {
  title: "Locação de empilhadeiras | Empilhatec Empilhadeiras",
  description:
    "Locação de empilhadeiras STILL e Linde em Manaus, com entrega ágil pelo Norte do país e assistência técnica do dealer autorizado.",
};

// PONTOS A CONFIRMAR COM O CLIENTE (texto provisório, escrito a partir do que se sabe do negócio e do setor):
// prazos de contrato, o que a locação inclui (manutenção, frete, treinamento) e locação com operador.

const POR_QUE = [
  {
    icon: Wallet,
    title: "Caixa preservado",
    text: "Em vez de imobilizar capital na compra do equipamento, você mantém o dinheiro para o que move o seu negócio.",
  },
  {
    icon: CalendarClock,
    title: "Custo previsível",
    text: "Um valor planejado ao longo do contrato, sem surpresas com manutenção pesada e reposição de componentes.",
  },
  {
    icon: Gauge,
    title: "Frota na medida da operação",
    text: "Mais máquinas nos picos de produção e na safra, menos quando o ritmo cai. A frota acompanha a sua demanda.",
  },
];

const PARA_QUEM = [
  {
    title: "Indústria",
    text: "Linhas de produção do Polo Industrial de Manaus pedem equipamento disponível em todos os turnos.",
    image: "/images/locacao/setor-industria.webp",
  },
  {
    title: "Logística e distribuição",
    text: "Carga e descarga de caminhões e movimentação de paletes com agilidade, do cais ao estoque.",
    image: "/images/locacao/setor-logistica.webp",
  },
  {
    title: "Alimentos e bebidas",
    text: "Giro rápido e ambientes internos, onde as máquinas elétricas fazem diferença no dia a dia.",
    image: "/images/locacao/setor-alimentos-bebidas.webp",
  },
  {
    title: "Eletroeletrônicos",
    text: "Movimentação cuidadosa de componentes e produtos de alto valor agregado.",
    image: "/images/locacao/setor-eletroeletronicos.webp",
  },
];

const SUPORTE = [
  { icon: Wrench, title: "Manutenção preventiva e corretiva", text: "Equipe técnica da Empilhatec, que conhece as máquinas STILL e Linde." },
  { icon: BadgeCheck, title: "Peças originais", text: "Reposição com peças do fabricante e estoque em Manaus." },
  { icon: Headset, title: "Atendimento próximo", text: "Um time na sua região para resolver o que aparecer, sem depender de assistência distante." },
  { icon: PackageCheck, title: "Orientação na escolha", text: "Ajudamos a definir o tipo, a capacidade e a energia certos para o seu galpão." },
];

const PASSOS = [
  { n: "01", title: "Conte o que você precisa", text: "Tipo de equipamento, capacidade e período de uso." },
  { n: "02", title: "Receba uma proposta sob medida", text: "Indicamos o modelo ideal e o formato de contrato." },
  { n: "03", title: "Entrega ágil pelo Norte do país", text: "O equipamento chega até a sua operação." },
  { n: "04", title: "Acompanhamento durante o contrato", text: "Assistência técnica e suporte para a máquina não parar." },
];

const FROTA_IDS = ["fmx-17-20", "rce-20-25", "linde-h20-h35", "exh-20", "erx-27", "sj4726-32-e"];

export default function LocacaoPage() {
  const frota = FROTA_IDS.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p));

  return (
    <>
      {/* 1. Topo */}
      <PageBanner image="/images/banners/locacao.webp" alt="Empilhadeira subindo a rampa de um caminhão" position="center 55%" size="tall">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white [text-shadow:none]">
            <BadgeCheck size={14} className="text-[#FF7A2B]" /> Dealer autorizado STILL e Linde
          </span>
          <h1 className="mt-5 font-display leading-[0.95] text-white" style={{ fontSize: "clamp(2.6rem, 5vw, 5rem)" }}>
            Locação de empilhadeiras para a sua operação render mais.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/95">
            Equipamento certo, entrega ágil pelo Norte do país e assistência técnica de quem conhece a máquina.
          </p>
          <div className="mt-8 flex flex-col gap-3 [text-shadow:none] sm:flex-row">
            <a
              href="#proposta"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E85A00] px-7 py-4 font-semibold text-white transition hover:bg-[#C44A00]"
            >
              Solicitar proposta <ArrowRight size={18} />
            </a>
            <a
              href={whatsappLink("Olá! Quero uma proposta de locação de empilhadeira.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/70 bg-black/20 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-[#1C1C1E]"
            >
              <MessageCircle size={18} /> Falar no WhatsApp
            </a>
          </div>
        </div>
      </PageBanner>

      {/* 2. Por que locar */}
      <section className="section-py bg-white">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Por que locar</p>
            <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Mais eficiência, sem imobilizar capital
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {POR_QUE.map((b, i) => (
              <FadeUp key={b.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-gray-200 p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E85A00]/10 text-[#E85A00]">
                    <b.icon size={24} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-[#1C1C1E]">{b.title}</h3>
                  <p className="mt-2 leading-relaxed text-gray-600">{b.text}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Dealer STILL */}
      <section className="bg-[#1C1C1E]">
        <div className="site-container grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
            <Image
              src="/images/locacao/still-dealer.webp"
              alt="Empilhadeira STILL em operação"
              fill
              quality={90}
              sizes="(min-width:1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Dealer autorizado</p>
            <h2 className="mt-3 font-display leading-none text-white" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              STILL e Linde, com a assistência de fábrica na sua região
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-300">
              STILL e Linde fazem parte do KION Group, um dos maiores fabricantes de equipamentos de movimentação de
              materiais do mundo. Como dealer autorizado no Amazonas e em Roraima, a Empilhatec reúne equipamentos,
              peças e padrão técnico de fábrica, e entrega de forma ágil pelo Norte do país.
            </p>
            <ul className="mt-6 space-y-3 text-gray-200">
              {[
                "Linha completa: contrabalançadas, retráteis, patoladas, transpaleteiras e mais",
                "Opções elétricas, a GLP e a diesel",
                "Peças originais e assistência técnica autorizada",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <BadgeCheck size={20} className="mt-0.5 shrink-0 text-[#E85A00]" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Para quem é */}
      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Para quem é</p>
            <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Soluções para cada tipo de operação
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PARA_QUEM.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.06}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-xl">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#1C1C1E]">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.text}</p>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Suporte durante a locação */}
      <section className="section-py bg-white">
        <div className="site-container grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src="/images/locacao/suporte-manutencao.webp"
              alt="Técnico fazendo manutenção em empilhadeira"
              fill
              sizes="(min-width:1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Suporte na locação</p>
            <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Quem aluga também conta com quem conhece a máquina
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {SUPORTE.map((s) => (
                <div key={s.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E85A00]/10 text-[#E85A00]">
                    <s.icon size={22} />
                  </span>
                  <div>
                    <h3 className="font-bold text-[#1C1C1E]">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Equipamentos para locar */}
      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Equipamentos</p>
              <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
                Máquinas disponíveis para locação
              </h2>
            </div>
            <Link href="/maquinas" className="group inline-flex items-center gap-2 font-semibold text-[#E85A00]">
              Ver todas as máquinas <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {frota.map((p) => (
              <MachineCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Como funciona */}
      <section className="section-py bg-white">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Como funciona</p>
            <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Do primeiro contato à máquina trabalhando
            </h2>
          </div>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PASSOS.map((p) => (
              <li key={p.n} className="relative border-t-2 border-[#E85A00] pt-5">
                <span className="text-4xl font-extrabold leading-none text-[#E85A00]/30">{p.n}</span>
                <h3 className="mt-3 text-lg font-bold text-[#1C1C1E]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. Locação ou compra */}
      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Locação ou compra?</p>
            <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              A escolha depende da sua operação
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border-2 border-[#E85A00] bg-white p-8">
              <h3 className="text-xl font-bold text-[#E85A00]">Locação</h3>
              <ul className="mt-4 space-y-3 text-gray-700">
                {[
                  "Preserva o capital da empresa",
                  "Custo mensal planejado",
                  "Frota que acompanha picos e safras",
                  "Manutenção e assistência com a Empilhatec",
                ].map((t) => (
                  <li key={t} className="flex gap-3"><BadgeCheck size={20} className="mt-0.5 shrink-0 text-[#E85A00]" /> {t}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-8">
              <h3 className="text-xl font-bold text-[#1C1C1E]">Compra</h3>
              <ul className="mt-4 space-y-3 text-gray-700">
                {[
                  "Equipamento no patrimônio da empresa",
                  "Indicada para uso intenso e permanente",
                  "Pode ser combinada com contrato de manutenção",
                  "Equipamentos novos STILL, Linde e Baoli",
                ].map((t) => (
                  <li key={t} className="flex gap-3"><BadgeCheck size={20} className="mt-0.5 shrink-0 text-gray-400" /> {t}</li>
                ))}
              </ul>
              <Link href="/maquinas" className="group mt-6 inline-flex items-center gap-2 font-semibold text-[#E85A00]">
                Conhecer as máquinas <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <p className="mt-6 text-gray-600">Em dúvida? Nossa equipe compara os dois cenários para a sua operação.</p>
        </div>
      </section>

      {/* 9. Empilhatex */}
      <section className="relative overflow-hidden bg-[#1C1C1E]">
        <Image
          src="/images/locacao/empilhatex-litio.webp"
          alt="Transpaleteira elétrica com bateria de lítio em operação"
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="site-container relative flex flex-col items-start justify-between gap-6 py-14 lg:flex-row lg:items-center lg:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Empilhatex</p>
            <h2 className="mt-3 font-display leading-none text-white" style={{ fontSize: "clamp(1.9rem, 3.2vw, 3rem)" }}>
              Máquinas elétricas com bateria de lítio para locação
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Menos paradas para recarga, operação silenciosa e sem emissões no galpão.
            </p>
          </div>
          <Link
            href="/empilhatex"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#E85A00] px-7 py-4 font-semibold text-white transition hover:bg-[#C44A00]"
          >
            Conhecer a Empilhatex <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 10. Proposta */}
      <section id="proposta" className="section-py scroll-mt-[calc(var(--header-h)+1rem)] bg-white">
        <div className="site-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Proposta de locação</p>
            <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Solicite a sua proposta
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Conte o que você precisa e nossa equipe retorna com uma proposta sob medida.
            </p>
            <ul className="mt-8 space-y-4 text-gray-700">
              <li>
                <span className="block text-xs uppercase tracking-wider text-gray-400">WhatsApp</span>
                <a href={whatsappLink("Olá! Quero uma proposta de locação.")} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-[#E85A00]">
                  {SITE.whatsappDisplay}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-gray-400">Telefone</span>
                <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="font-semibold hover:text-[#E85A00]">{SITE.phone}</a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-gray-400">E-mail</span>
                <a href={`mailto:${SITE.email}`} className="font-semibold hover:text-[#E85A00]">{SITE.email}</a>
              </li>
            </ul>
          </div>
          <div>
            <QuoteForm />
          </div>
        </div>
      </section>
    </>
  );
}
