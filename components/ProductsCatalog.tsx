"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, FEATURED_PRODUCTS, CATEGORY_LABELS, type Category } from "@/lib/products";
import { ArrowRight } from "lucide-react";
import FadeUp from "@/components/FadeUp";

type Filter = "principais" | "outros" | Category;

const OUTROS_CATEGORIES: Category[] = ["rebocador", "selecionadora"];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "principais", label: "Principais" },
  { key: "retratil", label: "Retrátil" },
  { key: "contrabalancada", label: "Contrabalançada" },
  { key: "patolada", label: "Patolada" },
  { key: "transpaleteira", label: "Transpaleteira" },
  { key: "outros", label: "Outros" },
];

export default function ProductsCatalog() {
  const [active, setActive] = useState<Filter>("principais");

  const displayed =
    active === "principais"
      ? FEATURED_PRODUCTS
      : active === "outros"
      ? PRODUCTS.filter((p) => OUTROS_CATEGORIES.includes(p.category as Category))
      : PRODUCTS.filter((p) => p.category === active);

  return (
    <section className="section-py bg-[#F5F5F7]">
      <div className="site-container">
        {/* Header */}
        <FadeUp>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[#E85A00] text-sm font-semibold uppercase tracking-widest">
              Catálogo STILL
            </span>
            <h2 className="heading-lg font-display text-[#1C1C1E] mt-1 tracking-wide">
              Equipamentos Principais
            </h2>
          </div>
          <Link
            href="/maquinas"
            className="flex items-center gap-2 text-sm font-semibold text-[#E85A00] hover:text-[#C44A00] transition-colors"
          >
            Ver catálogo completo <ArrowRight size={16} />
          </Link>
        </div>
        </FadeUp>

        {/* Filters */}
        <FadeUp delay={0.1}>
        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`px-5 py-2.5 rounded text-sm font-semibold transition-all ${
                active === f.key
                  ? "bg-[#E85A00] text-white"
                  : "bg-white text-[#1C1C1E] hover:bg-gray-200 border border-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        </FadeUp>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {displayed.map((product, i) => (
            <FadeUp key={product.id} delay={i * 0.08}>
            <Link
              href={`/maquinas/${product.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className={`object-contain ${product.imagePadding ?? "p-6"} group-hover:scale-110 transition-transform duration-500 ${product.imageBlend ? "mix-blend-multiply" : ""}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />
                {product.featured && (
                  <span className="absolute top-3 left-3 bg-[#E85A00] text-white text-xs font-bold px-2 py-1 rounded">
                    Destaque
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* Info */}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  {CATEGORY_LABELS[product.category]}
                </p>
                <h3 className="font-sans font-bold text-lg text-[#1C1C1E] mb-2 group-hover:text-[#E85A00] transition-colors duration-200">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4 flex-wrap">
                  <span className="whitespace-nowrap">{product.capacity}</span>
                  {product.energy && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                      <span className="whitespace-nowrap">{product.energy}</span>
                    </>
                  )}
                </div>

                <div className="flex gap-2 mt-auto">
                  {product.available?.includes("locacao") && (
                    <span className="text-xs bg-[#E85A00]/10 text-[#E85A00] font-medium px-2.5 py-1 rounded">
                      Locação
                    </span>
                  )}
                  {product.available?.includes("venda") && (
                    <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2.5 py-1 rounded">
                      Venda
                    </span>
                  )}
                </div>
              </div>
            </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
