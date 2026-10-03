"use client";

import { useState } from "react";
import MachineCard from "@/components/MachineCard";
import type { Product } from "@/lib/products";

export default function CategoryBrowser({ products }: { products: Product[] }) {
  const brands = [...new Set(products.map((p) => p.brand))];
  const [brand, setBrand] = useState<string>("todas");
  const shown = brand === "todas" ? products : products.filter((p) => p.brand === brand);

  return (
    <>
      {brands.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar por marca">
          {["todas", ...brands].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrand(b)}
              aria-pressed={brand === b}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                brand === b
                  ? "bg-[#E85A00] text-white"
                  : "border border-gray-200 bg-white text-[#1C1C1E] hover:border-[#E85A00]/50"
              }`}
            >
              {b === "todas" ? `Todas as marcas (${products.length})` : `${b} (${products.filter((p) => p.brand === b).length})`}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((p) => (
          <MachineCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
