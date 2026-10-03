"use client";

import { useState } from "react";
import Link from "next/link";
import FadeUp from "@/components/FadeUp";

const HIGHLIGHTED = ["AM"];

const STATES = [
  // ── NORTE ────────────────────────────────────────────────────────────
  { id: "RR", d: "M 11,96 L 98,4 L 163,53 L 130,129 L 98,96 Z" },
  { id: "AP", d: "M 239,11 L 261,46 L 250,74 L 217,74 L 217,52 Z" },
  { id: "AM", d: "M 11,96 L 98,4 L 152,4 L 163,53 L 130,129 L 120,200 L 98,214 L 76,214 L 43,172 L 11,144 Z" },
  { id: "PA", d: "M 163,53 L 217,52 L 239,11 L 261,46 L 304,60 L 304,144 L 283,200 L 250,200 L 217,185 L 185,116 L 152,4 Z" },
  { id: "TO", d: "M 261,144 L 304,144 L 304,256 L 283,256 L 261,214 Z" },
  { id: "RO", d: "M 98,214 L 130,200 L 152,214 L 152,256 L 120,270 L 98,242 Z" },
  { id: "AC", d: "M 11,185 L 43,172 L 76,214 L 76,228 L 43,228 L 11,228 Z" },
  // ── NORDESTE ─────────────────────────────────────────────────────────
  { id: "MA", d: "M 261,102 L 304,102 L 304,60 L 337,60 L 348,129 L 326,172 L 283,129 Z" },
  { id: "PI", d: "M 337,102 L 359,102 L 370,185 L 348,214 L 315,214 L 315,172 Z" },
  { id: "CE", d: "M 359,102 L 391,116 L 391,144 L 380,172 L 359,172 L 359,116 Z" },
  { id: "RN", d: "M 391,116 L 424,144 L 424,172 L 413,185 L 391,172 L 391,144 Z" },
  { id: "PB", d: "M 391,172 L 424,172 L 424,193 L 402,200 L 383,185 Z" },
  { id: "PE", d: "M 359,172 L 391,172 L 413,185 L 424,193 L 424,207 L 413,207 L 391,207 L 359,200 Z" },
  { id: "AL", d: "M 397,200 L 424,207 L 424,228 L 402,242 L 391,214 Z" },
  { id: "SE", d: "M 391,214 L 408,214 L 413,242 L 397,256 L 385,242 Z" },
  { id: "BA", d: "M 304,200 L 359,200 L 402,242 L 391,313 L 348,342 L 315,342 L 304,270 Z" },
  // ── CENTRO-OESTE ──────────────────────────────────────────────────────
  { id: "MT", d: "M 120,200 L 152,200 L 261,200 L 261,256 L 250,313 L 207,328 L 152,270 L 120,242 Z" },
  { id: "GO", d: "M 261,256 L 304,256 L 315,328 L 283,342 L 250,313 Z" },
  { id: "DF", d: "M 272,293 L 280,287 L 287,295 L 280,303 Z" },
  { id: "MS", d: "M 152,313 L 261,313 L 261,413 L 217,413 L 185,384 Z" },
  // ── SUDESTE ───────────────────────────────────────────────────────────
  { id: "MG", d: "M 250,270 L 304,270 L 359,313 L 370,370 L 337,398 L 293,370 L 250,342 Z" },
  { id: "ES", d: "M 359,313 L 370,313 L 380,356 L 370,384 L 359,356 Z" },
  { id: "RJ", d: "M 326,384 L 359,370 L 370,384 L 359,398 L 326,398 Z" },
  { id: "SP", d: "M 217,384 L 250,356 L 326,384 L 359,398 L 326,413 L 261,413 L 217,413 Z" },
  // ── SUL ───────────────────────────────────────────────────────────────
  { id: "PR", d: "M 185,413 L 261,413 L 283,441 L 239,441 L 185,427 Z" },
  { id: "SC", d: "M 185,427 L 239,441 L 283,441 L 261,484 L 228,470 L 185,470 Z" },
  { id: "RS", d: "M 185,470 L 228,470 L 261,484 L 250,554 L 228,540 L 185,512 Z" },
];

const LABELS: Record<string, [number, number]> = {
  RR: [90, 58], AP: [245, 48], AM: [80, 140], PA: [230, 110],
  TO: [283, 195], RO: [122, 230], AC: [42, 208],
  MA: [305, 115], PI: [340, 160], CE: [375, 140],
  RN: [410, 155], PB: [405, 188], PE: [390, 190], AL: [412, 220], SE: [398, 232],
  BA: [345, 270], MT: [185, 265], GO: [280, 297], DF: [282, 296],
  MS: [210, 360], MG: [307, 330], ES: [368, 348], RJ: [348, 390],
  SP: [275, 390], PR: [228, 425], SC: [228, 452], RS: [218, 500],
};

const COVERED = [
  { abbr: "AM", name: "Amazonas", city: "Manaus" },
];

export default function AreaMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-10 lg:py-14 bg-[#F0F0F2]">
      <div className="site-container">
        {/* Header */}
        <FadeUp>
        <div className="text-center mb-6">
          <span className="text-[#E85A00] text-sm font-semibold uppercase tracking-widest">
            Onde Atuamos
          </span>
          <h2 className="heading-lg font-display text-[#1C1C1E] mt-2 tracking-wide">
            Área de Atuação
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto text-sm">
            Representante autorizado STILL para o Amazonas, com estoque próprio e logística ágil a partir de Manaus.
          </p>
        </div>
        </FadeUp>

        <div className="grid lg:grid-cols-[3fr_2fr] gap-10 lg:gap-12 items-center">
          {/* SVG Map */}
          <FadeUp delay={0.1}>
          <div className="flex justify-center">
            <svg
              viewBox="0 0 480 570"
              className="w-full max-w-[360px] lg:max-w-[420px]"
              aria-label="Mapa do Brasil — área de atuação Empilhatec"
            >
              {STATES.map(({ id, d }) => {
                const isHighlighted = HIGHLIGHTED.includes(id);
                const isHovered = hovered === id;
                return (
                  <path
                    key={id}
                    d={d}
                    fill={isHighlighted ? "#E85A00" : "#C8C8CC"}
                    stroke={isHighlighted ? "#ff8040" : "#A8A8AC"}
                    strokeWidth={isHighlighted ? "1.5" : "1"}
                    opacity={isHighlighted ? 1 : 0.7}
                    onMouseEnter={() => setHovered(id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      transform: isHovered ? "scale(1.04)" : "scale(1)",
                      transition: "transform 0.2s ease",
                      cursor: isHighlighted ? "pointer" : "default",
                    }}
                  />
                );
              })}

              {Object.entries(LABELS)
                .filter(([id]) => !["DF", "ES", "RJ", "AP", "AC", "SE", "AL"].includes(id))
                .map(([id, [cx, cy]]) => {
                  const isHighlighted = HIGHLIGHTED.includes(id);
                  return (
                    <text
                      key={id}
                      x={cx} y={cy}
                      textAnchor="middle" dominantBaseline="middle"
                      fill={isHighlighted ? "#ffffff" : "#888"}
                      fontSize={isHighlighted ? "10" : "7.5"}
                      fontWeight={isHighlighted ? "bold" : "normal"}
                      fontFamily="sans-serif"
                      style={{ pointerEvents: "none" }}
                    >
                      {id}
                    </text>
                  );
                })}

              {/* Manaus marker */}
              <circle cx="80" cy="155" r="5" fill="#C8973A" stroke="white" strokeWidth="1.5" style={{ pointerEvents: "none" }} />
              <text x="88" y="159" fill="#C8973A" fontSize="8" fontFamily="sans-serif" fontWeight="bold" style={{ pointerEvents: "none" }}>Manaus</text>
            </svg>
          </div>
          </FadeUp>

          {/* Info */}
          <FadeUp delay={0.2}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#E85A00]" />
              <span className="text-gray-600 text-sm">Estado atendido pela Empilhatec</span>
            </div>

            <div className="space-y-1.5 mb-4">
              {COVERED.map((s, i) => (
                <FadeUp key={s.abbr} delay={0.25 + i * 0.07}>
                <div
                  className="flex items-center justify-between bg-white border border-gray-200 hover:border-[#E85A00]/50 rounded-lg px-4 py-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-display text-lg text-[#E85A00] tracking-wider w-9">
                      {s.abbr}
                    </span>
                    <div>
                      <p className="text-[#1C1C1E] font-medium text-sm leading-tight">{s.name}</p>
                      <p className="text-gray-500 text-xs">{s.city}</p>
                    </div>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E85A00]" />
                </div>
                </FadeUp>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Nossa sede em <span className="text-[#1C1C1E] font-medium">Manaus (AM)</span> garante
                logística ágil e estoque próprio para atendimento rápido em todo o estado do Amazonas.
              </p>
              <Link
                href="/locacao"
                className="inline-flex items-center gap-2 bg-[#E85A00] hover:bg-[#C44A00] text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors"
              >
                Solicitar Cotação
              </Link>
            </div>
          </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
