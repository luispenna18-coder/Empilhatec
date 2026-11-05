import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MachineTabs, { type ShowcaseCard, type ShowcaseTab } from "@/components/home/MachineTabs";
import {
  CATEGORY_INFO,
  CATEGORY_LABELS,
  FEATURED_PRODUCTS,
  categoriesWithProducts,
  productsByCategory,
  type Category,
  type Product,
} from "@/lib/products";

/** Categorias com aba própria; as demais (selecionadora, rebocador) ficam em "Outros". */
const ABAS: Category[] = ["retratil", "contrabalancada", "patolada", "transpaleteira"];

// só os campos que o cartão mostra, para não mandar o catálogo inteiro ao navegador
const toCard = (p: Product): ShowcaseCard => ({
  id: p.id,
  name: p.name,
  label: `${p.brand} · ${CATEGORY_LABELS[p.category]}`,
  alt: `${p.brand} ${p.name}`,
  capacity: p.capacity,
  energy: p.energy,
  image: p.image,
  featured: !!p.featured,
  rent: !!p.available?.includes("locacao"),
  sale: !!p.available?.includes("venda"),
});

/** Vitrine da Home: máquinas em destaque e por categoria; cada cartão abre a página da máquina. */
export default function MachineShowcase() {
  const tabs: ShowcaseTab[] = [
    { label: "Principais", cards: FEATURED_PRODUCTS.map(toCard) },
    ...ABAS.map((c) => {
      const items = productsByCategory(c);
      return {
        label: CATEGORY_LABELS[c],
        cards: items.map(toCard),
        more: { label: `Ver as ${items.length} ${CATEGORY_INFO[c].plural.toLowerCase()}`, href: `/maquinas/categoria/${c}` },
      };
    }),
    {
      label: "Outros",
      cards: categoriesWithProducts()
        .filter((c) => !ABAS.includes(c))
        .flatMap((c) => productsByCategory(c))
        .map(toCard),
    },
  ].filter((t) => t.cards.length > 0);

  return (
    <section className="section-py bg-white" aria-labelledby="equipamentos-principais">
      <div className="site-container">
        <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Máquinas</p>
          <h2
            id="equipamentos-principais"
            className="mt-3 font-display leading-none text-[#1C1C1E]"
            style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}
          >
            Equipamentos principais
          </h2>
          <Link href="/maquinas" className="group mt-5 inline-flex items-center gap-2 font-semibold text-[#E85A00]">
            Ver catálogo completo
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <MachineTabs tabs={tabs} />
      </div>
    </section>
  );
}
