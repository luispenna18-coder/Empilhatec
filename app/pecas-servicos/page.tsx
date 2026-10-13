import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, CalendarCheck, ClipboardCheck, MessageCircle, Package, Phone, ShieldCheck, Wrench } from "lucide-react";
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

const FATOS = [
  { icon: BadgeCheck, title: "Dealer autorizado", text: "STILL e Linde, no Amazonas e em Roraima" },
  { icon: Package, title: "Peças originais", text: "Com estoque em Manaus" },
  { icon: Wrench, title: "Equipe especializada", text: "Técnicos que conhecem as marcas" },
];

const COMO_PEDIR = [
  { n: "01", title: "Informe a máquina", text: "Marca, modelo e número de série, que fica na placa." },
  { n: "02", title: "Confirmamos a peça", text: "Identificamos o item certo e a disponibilidade." },
  { n: "03", title: "Receba ou retire", text: "A peça chega até você ou fica pronta em Manaus." },
];

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
      <PageBanner image="/images/banners/pecas-servicos.webp" alt="Técnico fazendo a manutenção de uma empilhadeira" position="center 40%" size="tall">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white before:mr-3 before:inline-block before:h-0.5 before:w-7 before:bg-[#E85A00] before:align-middle">Pós-venda Empilhatec</p>
          <h1 className="mt-4 font-display leading-[0.95] text-white" style={{ fontSize: "clamp(2.6rem, 5vw, 5rem)" }}>
            Peças e serviços para a sua frota não parar.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/95">
            Peças originais e planos de manutenção com a equipe de quem representa a fábrica no Amazonas e em Roraima.
          </p>
          <div className="mt-8 flex flex-col gap-3 [text-shadow:none] sm:flex-row">
            <a
              href="#pecas"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E85A00] px-7 py-4 font-semibold text-white transition hover:bg-[#C44A00]"
            >
              <Package size={18} /> Peças
            </a>
            <a
              href="#assistencia"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/70 bg-black/20 px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-[#1C1C1E]"
            >
              <Wrench size={18} /> Planos de manutenção
            </a>
          </div>
        </div>
      </PageBanner>

      {/* Fatos */}
      <section className="border-b border-gray-200 bg-white" aria-label="Diferenciais">
        <div className="site-container grid gap-6 py-8 sm:grid-cols-3">
          {FATOS.map((f) => (
            <div key={f.title} className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E85A00]/10 text-[#E85A00]">
                <f.icon size={24} />
              </span>
              <div>
                <p className="font-bold text-[#1C1C1E]">{f.title}</p>
                <p className="text-sm text-gray-500">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Peças */}
      <section id="pecas" className="section-py scroll-mt-[calc(var(--header-h)+1rem)] bg-[#F5F5F7]">
        <div className="site-container">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-lg">
              <Image
                src="/images/pecas-servicos/pecas-originais.webp"
                alt="Técnico segurando uma peça original"
                fill
                quality={90}
                sizes="(min-width:1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Peças</p>
              <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
                Peças originais para manter a máquina no padrão de fábrica
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                Peças originais STILL e Linde garantem encaixe exato, o desempenho previsto pelo fabricante e a segurança
                da operação. Mantemos estoque em Manaus para reduzir o tempo de espera da sua máquina parada.
              </p>
              <ul className="mt-6 space-y-3 text-gray-700">
                {[
                  "Peças originais e de reposição para empilhadeiras elétricas e a combustão",
                  "Ajuda para identificar a peça certa pelo modelo e pelo número de série",
                  "Itens de desgaste e de reposição, como filtros, correias, pneus e componentes hidráulicos e elétricos",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <BadgeCheck size={20} className="mt-0.5 shrink-0 text-[#E85A00]" /> {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLink("Olá! Preciso de uma peça para empilhadeira.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E85A00] px-6 py-3.5 font-semibold text-white transition hover:bg-[#C44A00]"
                >
                  <MessageCircle size={18} /> Pedir uma peça pelo WhatsApp
                </a>
                <a
                  href="#pedido"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-6 py-3.5 font-semibold text-[#1C1C1E] transition hover:border-[#E85A00] hover:text-[#E85A00]"
                >
                  Usar o formulário
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Como pedir uma peça</h3>
            <ol className="mt-5 grid gap-6 sm:grid-cols-3">
              {COMO_PEDIR.map((p) => (
                <li key={p.n} className="border-t-2 border-[#E85A00] pt-4">
                  <span className="text-4xl font-extrabold leading-none text-[#E85A00]/30">{p.n}</span>
                  <p className="mt-2 text-lg font-bold text-[#1C1C1E]">{p.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

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
          <p className="mt-6 text-sm text-gray-500">
            Os planos são definidos conforme o equipamento, a quantidade de máquinas e a rotina de uso de cada operação.
          </p>
        </div>
      </section>

      {/* Máquina parada */}
      <section className="bg-[#E85A00]">
        <div className="site-container flex flex-col items-start justify-between gap-6 py-12 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-display leading-none text-white" style={{ fontSize: "clamp(1.9rem, 3.2vw, 3rem)" }}>
              Máquina parada?
            </h2>
            <p className="mt-3 max-w-xl text-lg text-white/90">Abra um chamado e a nossa equipe técnica entra em contato.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink("Olá! Minha máquina está parada e preciso de assistência técnica.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#1C1C1E] px-7 py-4 font-semibold text-white transition hover:bg-black"
            >
              <MessageCircle size={20} /> Abrir chamado no WhatsApp
            </a>
            <a
              href={`tel:${SITE.phone.replace(/\D/g, "")}`}
              className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-white px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-[#E85A00]"
            >
              <Phone size={20} /> {SITE.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section id="pedido" className="section-py scroll-mt-[calc(var(--header-h)+1rem)] bg-[#F5F5F7]">
        <div className="site-container grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Fale com o pós-venda</p>
            <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
              Peça uma peça ou abra um chamado
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Preencha os dados da máquina e a sua necessidade. Quanto mais detalhes, mais rápido identificamos a solução.
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
