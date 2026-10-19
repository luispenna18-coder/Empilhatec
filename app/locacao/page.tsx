import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, Headset, PackageCheck, Wrench, X } from "lucide-react";
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

// Comparativo da seção "Por que locar". O que a locação inclui (manutenção, máquina substituta, prazos) vem do
// briefing-final.md; os pontos da compra, do comparativo aprovado em estrutura/copy.md.
// Fotos: teasers "Empilhadeiras Novas" e "Rental" da home do still.com.br.
const ESCOLHAS = [
  {
    titulo: "Comprar",
    destaque: false,
    image: "/images/locacao/compra-maquinas-novas.webp",
    alt: "Empilhadeiras STILL trabalhando em um armazém de estantes altas",
    position: "55% 50%",
    vantagens: [
      "A máquina entra no patrimônio da empresa",
      "Sem mensalidade depois de quitada",
      "Uso livre, sem prazo de contrato",
      "Pode ser revendida no futuro",
    ],
    desvantagens: [
      "Alto investimento inicial, com frete e impostos",
      "Manutenção, peças e reparos por conta da empresa",
      "Se a máquina quebra, a operação espera o conserto",
      "A máquina desvaloriza e envelhece com o uso",
    ],
  },
  {
    titulo: "Locar",
    destaque: true,
    image: "/images/locacao/locacao-frota-still.webp",
    alt: "Gestor ao telefone, com uma frota de empilhadeiras STILL ao fundo",
    position: "40% 50%",
    vantagens: [
      "Sem investimento inicial: o caixa fica livre",
      "Mensalidade fixa, com manutenção inclusa",
      "Máquina substituta em caso de parada",
      "Prazos de dias a anos, conforme a demanda",
    ],
    desvantagens: [
      "A máquina não entra no patrimônio da empresa",
      "Mensalidade enquanto durar o contrato",
      "Mudanças na máquina dependem de acordo",
      "Prazo e condições definidos em contrato",
    ],
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

const FROTA_IDS = ["fmx-17-20", "rce-20-25", "linde-h20-h35", "exh-20", "erx-27", "sj4726-32-e"];

export default function LocacaoPage() {
  const frota = FROTA_IDS.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p));

  return (
    <>
      {/* 1. Topo */}
      <PageBanner image="/images/banners/locacao.webp" alt="Frota de empilhadeiras elétricas STILL pronta para trabalhar" position="center 60%" size="tall">
        {/* espaço extra embaixo, igual ao banner de Peças e Serviços */}
        <div className="pb-6 lg:pb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white before:mr-3 before:inline-block before:h-0.5 before:w-7 before:bg-[#E85A00] before:align-middle">Dealer autorizado STILL</p>
          <h1 className="font-display leading-none text-white" style={{ fontSize: "clamp(2.6rem, 4.5vw, 5.2rem)" }}>
            Locação de empilhadeiras
          </h1>
          <div className="mt-4 h-0.5 w-12 bg-[#E85A00]" />
          <p className="mt-5 max-w-2xl text-lg text-white/95">
            Equipamento certo, entrega ágil pelo Norte do país e assistência técnica de quem conhece a máquina.
          </p>
        </div>
      </PageBanner>

      {/* 2. Por que locar: compra × locação */}
      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Por que locar</p>
            <h2 className="mt-3 text-balance font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Locar ou comprar?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
              Lado a lado, o que você ganha e do que abre mão em cada escolha.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:gap-8">
            {ESCOLHAS.map((e, i) => (
              // no celular a locação vem primeiro
              <FadeUp key={e.titulo} delay={i * 0.1} className={e.destaque ? "order-first h-full md:order-none" : "h-full"}>
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-3xl bg-white ${
                    e.destaque ? "shadow-xl shadow-[#E85A00]/10 ring-2 ring-[#E85A00]" : "ring-1 ring-black/5"
                  }`}
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={e.image}
                      alt={e.alt}
                      fill
                      quality={90}
                      sizes="(min-width:1024px) 31rem, (min-width:768px) 45vw, 100vw"
                      className="object-cover"
                      style={{ objectPosition: e.position }}
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
                    {e.destaque && (
                      <span className="absolute left-5 top-5 rounded-full bg-[#E85A00] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg sm:left-6 sm:top-6">
                        Recomendado
                      </span>
                    )}
                    <h3 className="absolute bottom-5 left-6 font-display text-4xl leading-none text-white sm:bottom-6 sm:left-8">
                      {e.titulo}
                    </h3>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Vantagens</p>
                    <ul className="mt-4 space-y-3">
                      {e.vantagens.map((t) => (
                        <li key={t} className="flex gap-3 text-[#1C1C1E]">
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                              e.destaque ? "bg-[#E85A00] text-white" : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            <Check size={12} strokeWidth={3} />
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-7 border-t border-gray-100 pt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Desvantagens
                    </p>
                    <ul className="mt-4 space-y-3">
                      {e.desvantagens.map((t) => (
                        <li key={t} className="flex gap-3 text-gray-600">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <X size={12} strokeWidth={3} />
                          </span>
                          {t}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-8">
                      {e.destaque ? (
                        <a
                          href="#proposta"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E85A00] px-6 py-4 font-semibold text-white transition hover:bg-[#C44A00]"
                        >
                          Solicitar proposta de locação <ArrowRight size={18} />
                        </a>
                      ) : (
                        <a
                          href={whatsappLink("Olá! Quero uma proposta de compra de empilhadeira.")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-4 font-semibold text-[#1C1C1E] transition hover:border-[#E85A00] hover:text-[#E85A00]"
                        >
                          Solicitar proposta de compra <ArrowRight size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Para quem é */}
      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <div className="mx-auto max-w-2xl text-center">
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

      {/* 4. Suporte durante a locação */}
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

      {/* 5. Equipamentos para locar */}
      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Equipamentos</p>
            <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Máquinas disponíveis para locação
            </h2>
            <Link href="/maquinas" className="group mt-5 inline-flex items-center gap-2 font-semibold text-[#E85A00]">
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

      {/* 6. Empilhatex */}
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

      {/* 7. Proposta */}
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
