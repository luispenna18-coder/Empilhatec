import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import FadeUp from "@/components/FadeUp";
import PageBanner from "@/components/PageBanner";
import { CATEGORY_INFO, categoriesWithProducts, productsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Máquinas | Empilhatec Empilhadeiras",
  description:
    "Empilhadeiras retráteis, contrabalançadas, patoladas, transpaleteiras, selecionadoras de pedidos e rebocadores STILL, Linde e Baoli para locação e venda no Amazonas.",
};

export default function MaquinasPage() {
  const categories = categoriesWithProducts();

  return (
    <>
      <PageBanner image="/images/banners/maquinas.webp" alt="Empilhadeiras STILL em operação numa fábrica" position="center 45%">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white before:mr-3 before:inline-block before:h-0.5 before:w-7 before:bg-[#E85A00] before:align-middle">Catálogo</p>
        <h1 className="font-display leading-none text-white" style={{ fontSize: "clamp(2.6rem, 4.5vw, 5.2rem)" }}>
          Máquinas
        </h1>
        <div className="mt-4 h-0.5 w-12 bg-[#E85A00]" />
        <p className="mt-5 max-w-2xl text-lg text-white/95">
          Escolha o tipo de equipamento e veja todos os modelos disponíveis, de todas as marcas que representamos.
        </p>
      </PageBanner>

      <section className="section-py bg-[#F5F5F7]">
        <div className="site-container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => {
              const info = CATEGORY_INFO[cat];
              const items = productsByCategory(cat);
              const cover = items.find((p) => p.featured) ?? items[0];
              const brands = [...new Set(items.map((p) => p.brand))];
              return (
                <FadeUp key={cat} delay={(i % 3) * 0.06}>
                  <Link
                    href={`/maquinas/categoria/${cat}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#E85A00]/40 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/10] bg-white">
                      <Image
                        src={cover.image}
                        alt={info.plural}
                        fill
                        sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"
                        className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute right-4 top-4 rounded-full bg-[#1C1C1E] px-3 py-1 text-xs font-bold text-white">
                        {items.length} {items.length === 1 ? "modelo" : "modelos"}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col border-t border-gray-100 p-6">
                      <h2 className="font-sans text-xl font-bold text-[#1C1C1E]">{info.plural}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{info.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {brands.map((b) => (
                          <span key={b} className="rounded bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                            {b}
                          </span>
                        ))}
                      </div>
                      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[#E85A00]">
                        Ver modelos
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
