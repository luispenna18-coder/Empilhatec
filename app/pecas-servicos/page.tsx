import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, CalendarCheck, ClipboardCheck, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import FadeUp from "@/components/FadeUp";
import PageBanner from "@/components/PageBanner";
import ServiceRequestForm from "@/components/ServiceRequestForm";
import { SITE, whatsappLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Peças e Serviços | Empilhatec Empilhadeiras",
  description:
    "Peças originais STILL e Linde e planos de manutenção para empilhadeiras no Amazonas e em Roraima, com a equipe do dealer autorizado.",
};

// PONTOS A CONFIRMAR COM O CLIENTE (texto provisório): formato e condições dos planos de manutenção,
// itens de peças em estoque, prazo de entrega de peças e "equipe técnica certificada pelos fabricantes".

const PLANOS = [
  {
    icon: ClipboardCheck,
    nome: "Chamado avulso",
    resumo: "Para quando a máquina precisa de atenção: diagnóstico e reparo sob demanda.",
    itens: ["Diagnóstico e reparo", "Peças originais", "Atendimento quando você precisar"],
    destaque: false,
  },
  {
    icon: CalendarCheck,
    nome: "Manutenção preventiva",
    resumo: "Revisões programadas conforme as recomendações do fabricante, antes que o problema apareça.",
    itens: ["Cronograma de revisões", "Checklist de segurança", "Histórico de cada máquina"],
    destaque: true,
  },
  {
    icon: ShieldCheck,
    nome: "Contrato de manutenção",
    resumo: "Plano completo e sob medida, que combina preventiva, corretiva e prioridade de atendimento.",
    itens: ["Preventiva e corretiva", "Atendimento prioritário", "Condições sob medida"],
    destaque: false,
  },
];

export default function PecasServicosPage() {
  return (
    <>
      {/* Topo */}
      <PageBanner image="/images/banners/pecas-servicos.webp" alt="Técnico fazendo a manutenção de uma empilhadeira" position="center 40%" size="tall" blur>
        {/* espaço extra embaixo para o texto não ficar colado na base do banner alto */}
        <div className="pb-6 lg:pb-16">
          <h1 className="font-display leading-none text-white" style={{ fontSize: "clamp(2.6rem, 4.5vw, 5.2rem)" }}>
            Peças e serviços
          </h1>
          <div className="mt-4 h-0.5 w-12 bg-[#E85A00]" />
          <p className="mt-5 max-w-md text-lg text-white/95">
            Peças originais e planos de manutenção com a equipe de quem representa a fábrica no Amazonas e em Roraima.
          </p>
        </div>
      </PageBanner>

      {/* Assistência e planos */}
      <section id="assistencia" className="section-py scroll-mt-[calc(var(--header-h)+1rem)] bg-white">
        <div className="site-container">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Assistência técnica</p>
              <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
                Planos de manutenção sob medida para a sua operação
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                Manutenção bem feita evita paradas, prolonga a vida útil da máquina e protege o operador. Nossa equipe
                técnica atende empilhadeiras elétricas e a combustão, com planos que se encaixam no ritmo da sua operação.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
              <Image
                src="/images/pecas-servicos/assistencia-tecnica.webp"
                alt="Técnico fazendo a manutenção dentro da cabine de uma empilhadeira"
                fill
                quality={90}
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PLANOS.map((p, i) => (
              <FadeUp key={p.nome} delay={i * 0.07}>
                <article
                  className={`relative flex h-full flex-col rounded-2xl p-7 ${
                    p.destaque ? "border-2 border-[#E85A00] bg-white shadow-xl" : "border border-gray-200 bg-white"
                  }`}
                >
                  {p.destaque && (
                    <span className="absolute -top-3 left-7 rounded-full bg-[#E85A00] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                      Mais indicado
                    </span>
                  )}
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E85A00]/10 text-[#E85A00]">
                    <p.icon size={24} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-[#1C1C1E]">{p.nome}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.resumo}</p>
                  <ul className="mt-5 space-y-2 text-sm text-gray-700">
                    {p.itens.map((t) => (
                      <li key={t} className="flex gap-2.5">
                        <BadgeCheck size={18} className="mt-0.5 shrink-0 text-[#E85A00]" /> {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7">
                    <a
                      href={whatsappLink(`Olá! Quero saber mais sobre o plano: ${p.nome}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition ${
                        p.destaque
                          ? "bg-[#E85A00] text-white hover:bg-[#C44A00]"
                          : "border border-gray-300 text-[#1C1C1E] hover:border-[#E85A00] hover:text-[#E85A00]"
                      }`}
                    >
                      Solicitar este plano
                    </a>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Máquina parada: foto de uma FM-X trabalhando (galeria oficial da STILL, a mesma da ficha da máquina) */}
      <section className="relative overflow-hidden bg-[#141416]">
        {/* no desktop a foto começa mais à direita (26% e, em telas largas, 18%), para a máquina não ficar atrás dos botões */}
        <div className="absolute inset-0 lg:left-[26%] xl:left-[18%]">
          <Image
            src="/images/pecas-servicos/maquina-operando.jpg"
            alt=""
            fill
            quality={90}
            sizes="(min-width:1280px) 82vw, (min-width:1024px) 74vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "70% 58%" }}
          />
          <div className="absolute inset-y-0 left-0 hidden w-2/5 bg-gradient-to-r from-[#141416] to-transparent lg:block" aria-hidden />
        </div>
        {/* película no celular; no desktop o escuro fica só do lado do texto */}
        <div className="absolute inset-0 bg-black/55 lg:hidden" aria-hidden />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-black/70 via-black/30 to-black/0 lg:block" aria-hidden />
        <div className="site-container relative py-20 lg:py-28">
          <div className="max-w-xl">
            <h2 className="font-display leading-none text-white" style={{ fontSize: "clamp(2.2rem, 4vw, 3.6rem)" }}>
              Máquina parada?
            </h2>
            <p className="mt-4 text-lg text-white/90">Abra um chamado e a nossa equipe técnica entra em contato.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink("Olá! Minha máquina está parada e preciso de assistência técnica.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#E85A00] px-7 py-4 font-semibold text-white transition hover:bg-[#C44A00]"
              >
                <MessageCircle size={20} /> Abrir chamado no WhatsApp
              </a>
              <a
                href={`tel:${SITE.phone.replace(/\D/g, "")}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-white/80 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-[#1C1C1E]"
              >
                <Phone size={20} /> {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section id="pedido" className="section-py scroll-mt-[calc(var(--header-h)+1rem)] bg-[#F5F5F7]">
        <div className="site-container grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Fale com o pós-venda</p>
            <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Peça uma peça original
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Preencha os dados da máquina e a peça que você precisa. Quanto mais detalhes, mais rápido identificamos a peça certa.
            </p>
            <ul className="mt-8 space-y-4 text-gray-700">
              <li>
                <span className="block text-xs uppercase tracking-wider text-gray-400">WhatsApp</span>
                <a href={whatsappLink("Olá! Preciso falar com o pós-venda.")} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-[#E85A00]">
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
          <ServiceRequestForm />
        </div>
      </section>
    </>
  );
}
