import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, MessageCircle } from "lucide-react";
import MachineGallery from "@/components/MachineGallery";
import MachineCard from "@/components/MachineCard";
import { SITE } from "@/lib/constants";
import { CATEGORY_INFO, PRODUCTS, getProduct, productsByCategory } from "@/lib/products";

type Params = { slug: string };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} ${p.brand} | Empilhatec Empilhadeiras`,
    description: p.description.slice(0, 155),
    openGraph: { images: [{ url: p.image, width: p.imageSize.w, height: p.imageSize.h }] },
  };
}

export default async function MaquinaPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const info = CATEGORY_INFO[p.category];
  const waText = encodeURIComponent(`Olá! Quero uma cotação da ${p.brand} ${p.name}.`);

  const specs: [string, string | undefined][] = [
    ["Capacidade de carga", p.capacity],
    ["Altura de elevação", p.liftHeight],
    ["Velocidade máxima", p.speed],
    ["Alimentação", p.energy],
    ["Intensidade de uso", p.intensityOfUse],
    ["Tipo de aplicação", p.applicationType],
    ["Tipo de controle", p.controlType],
    ["Marca", p.brand],
  ];
  const specRows = specs.filter((s): s is [string, string] => Boolean(s[1]));
  const highlights = specRows.slice(0, 3);

  const related = productsByCategory(p.category).filter((x) => x.id !== p.id).slice(0, 3);

  return (
    <div className="bg-white pt-[calc(var(--header-h)+1.5rem)]">
      <div className="site-container pb-16">
        <nav aria-label="Você está em" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link href="/maquinas" className="inline-flex items-center gap-1 hover:text-[#E85A00]">
            <ArrowLeft size={14} /> Máquinas
          </Link>
          <span>/</span>
          <Link href={`/maquinas/categoria/${p.category}`} className="hover:text-[#E85A00]">
            {info.plural}
          </Link>
          <span>/</span>
          <span className="text-[#1C1C1E]">{p.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Galeria */}
          <div className="min-w-0 lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
            <MachineGallery images={p.gallery} name={`${p.brand} ${p.name}`} />
          </div>

          {/* Informações */}
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E85A00]">{info.label}</p>
            <h1 className="mt-2 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2.4rem, 4vw, 4rem)" }}>
              {p.brand} {p.name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {p.energy && <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">{p.energy}</span>}
              {p.available?.includes("locacao") && (
                <span className="rounded-full bg-[#E85A00]/10 px-3 py-1 text-xs font-semibold text-[#E85A00]">Disponível para locação</span>
              )}
              {p.available?.includes("venda") && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">Disponível para venda</span>
              )}
            </div>

            <p className="mt-6 leading-relaxed text-gray-600">{p.description}</p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {highlights.map(([label, value]) => (
                <div key={label} className="rounded-xl bg-[#F5F5F7] p-4">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
                  <p className="mt-1 text-base font-bold leading-tight text-[#1C1C1E]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${SITE.whatsapp}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E85A00] px-6 py-3.5 font-semibold text-white transition hover:bg-[#C44A00]"
              >
                <MessageCircle size={18} /> Solicitar cotação
              </a>
              {p.datasheet && (
                <a
                  href={p.datasheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3.5 font-semibold text-[#1C1C1E] transition hover:border-[#E85A00] hover:text-[#E85A00]"
                >
                  <Download size={18} /> Ficha técnica{p.datasheetLang === "en" ? " (inglês)" : ""}
                </a>
              )}
            </div>

            {/* Especificações */}
            <h2 className="mt-12 text-xl font-bold text-[#1C1C1E]">Especificações técnicas</h2>
            <dl className="mt-4 divide-y divide-gray-100 border-y border-gray-100">
              {specRows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 py-3 text-sm">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="text-right font-semibold text-[#1C1C1E]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Versões / dados do fabricante */}
        {p.versions && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-[#1C1C1E]">Versões e dados técnicos</h2>
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="bg-[#F5F5F7] text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    {p.versions.columns.map((c) => (
                      <th key={c} className="px-4 py-3 font-semibold">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {p.versions.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-4 py-3 ${j === 0 ? "font-semibold text-[#1C1C1E]" : "text-gray-600"}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              Dados do fabricante. {p.datasheet ? "Consulte a ficha técnica para a lista completa de versões." : "Consulte nossa equipe para detalhes de cada versão."}
            </p>
          </section>
        )}

        {/* Relacionadas */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold text-[#1C1C1E]">Outros modelos em {info.plural}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <MachineCard key={r.id} product={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
