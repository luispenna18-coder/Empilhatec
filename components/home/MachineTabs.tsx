"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface ShowcaseCard {
  id: string;
  name: string;
  /** Marca e categoria, ex.: "STILL · Retrátil". */
  label: string;
  alt: string;
  capacity: string;
  energy?: string;
  image: string;
  featured: boolean;
  rent: boolean;
  sale: boolean;
}

export interface ShowcaseTab {
  label: string;
  cards: ShowcaseCard[];
  /** Página com todas as máquinas da aba, para quando elas não cabem na linha. */
  more?: { label: string; href: string };
}

/** Uma linha de cartões por aba; o resto da categoria fica na aba Máquinas. */
const POR_ABA = 4;

export default function MachineTabs({ tabs }: { tabs: ShowcaseTab[] }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <>
      <div
        className="-mx-4 mb-8 flex gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Filtrar por categoria"
      >
        {tabs.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`shrink-0 rounded-lg border px-5 py-2.5 text-sm font-semibold transition sm:px-6 sm:py-3 sm:text-base ${
              i === active
                ? "border-[#E85A00] bg-[#E85A00] text-white"
                : "border-gray-200 bg-white text-[#1C1C1E] hover:border-[#E85A00]/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* flex em vez de grid para centralizar as abas com uma ou duas máquinas, como o título */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
        {tab.cards.slice(0, POR_ABA).map((c) => (
          <Link
            key={c.id}
            href={`/maquinas/${c.id}`}
            className="group flex w-[calc((100%-0.75rem)/2)] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]"
          >
            <div className="relative aspect-square bg-[#F5F5F7] sm:aspect-[5/4]">
              <Image
                src={c.image}
                alt={c.alt}
                fill
                sizes="(min-width:1024px) 22vw, 46vw"
                className="object-contain p-3 mix-blend-multiply transition-transform duration-300 group-hover:scale-105 sm:p-4"
              />
              {c.featured && (
                <span className="absolute left-3 top-3 rounded-md bg-[#E85A00] px-2.5 py-1 text-[11px] font-bold text-white sm:text-xs">
                  Destaque
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-gray-400 sm:text-xs sm:tracking-[0.12em]">{c.label}</p>
              <h3 className="mt-1.5 text-base font-bold text-[#1C1C1E] transition-colors group-hover:text-[#E85A00] sm:text-lg">
                {c.name}
              </h3>
              {/* a capacidade não quebra no meio ("2.000 / kg"); a energia pode ser longa e quebra normalmente */}
              <p className="mt-1 text-sm text-gray-500">
                <span className="whitespace-nowrap">{c.capacity}</span>
                {c.energy && (
                  <>
                    {" "}
                    <span className="text-gray-300" aria-hidden>
                      •
                    </span>{" "}
                    {c.energy}
                  </>
                )}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {c.rent && <span className="rounded-md bg-[#E85A00]/10 px-2.5 py-1 text-xs font-semibold text-[#E85A00]">Locação</span>}
                {c.sale && <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">Venda</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {tab.more && tab.cards.length > POR_ABA && (
        <div className="mt-8 text-center">
          <Link href={tab.more.href} className="group inline-flex items-center gap-2 font-semibold text-[#E85A00]">
            {tab.more.label}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </>
  );
}
