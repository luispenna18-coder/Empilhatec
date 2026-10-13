import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryBrowser from "@/components/CategoryBrowser";
import PageBanner from "@/components/PageBanner";
import {
  CATEGORY_INFO,
  categoriesWithProducts,
  isCategory,
  productsByCategory,
} from "@/lib/products";

type Params = { categoria: string };

export function generateStaticParams() {
  return categoriesWithProducts().map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { categoria } = await params;
  if (!isCategory(categoria)) return {};
  const info = CATEGORY_INFO[categoria];
  return {
    title: `${info.plural} | Empilhatec Empilhadeiras`,
    description: `${info.description} Veja os modelos disponíveis para locação e venda.`,
  };
}

export default async function CategoriaPage({ params }: { params: Promise<Params> }) {
  const { categoria } = await params;
  if (!isCategory(categoria)) notFound();
  const info = CATEGORY_INFO[categoria];
  const products = productsByCategory(categoria);
  if (products.length === 0) notFound();
  const others = categoriesWithProducts().filter((c) => c !== categoria);

  return (
    <>
      <PageBanner image="/images/banners/maquinas.webp" alt="Empilhadeiras STILL em operação numa fábrica" position="center 45%">
        <nav aria-label="Você está em" className="mb-4 text-sm text-white/85">
          <Link href="/maquinas" className="hover:underline">Máquinas</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{info.plural}</span>
        </nav>
        <h1 className="font-display leading-none text-white" style={{ fontSize: "clamp(2.4rem, 4vw, 4.6rem)" }}>
          {info.plural}
        </h1>
        <div className="mt-4 h-0.5 w-12 bg-[#E85A00]" />
        <p className="mt-5 max-w-2xl text-lg text-white/95">{info.description}</p>
      </PageBanner>

      <section className="section-py min-h-[60vh] bg-[#F5F5F7]">
        <div className="site-container">
          <CategoryBrowser products={products} />

          <div className="mt-14 border-t border-gray-200 pt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Outras categorias</h2>
            <div className="flex flex-wrap gap-2">
              {others.map((c) => (
                <Link
                  key={c}
                  href={`/maquinas/categoria/${c}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#1C1C1E] transition hover:border-[#E85A00]/50"
                >
                  {CATEGORY_INFO[c].plural}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
