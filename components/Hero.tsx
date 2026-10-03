"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface Slide {
  id: number;
  image: string;
  badge?: string;
  headline: string;
  subheadline: string;
  cta1: { label: string; href: string };
  cta2?: { label: string; href: string };
  overlay?: string;
  bgColor?: string;
  objectPosition?: string;
  textPadding?: string;
  textCenter?: boolean;
  textDark?: boolean;
  headlineSize?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: "/images/banner-still-03.jpg",
    headline: "Sua Operação\nNão Pode Parar",
    subheadline: "",
    cta1: { label: "Solicitar Cotação", href: "/locacao" },
    cta2: { label: "Ver Equipamentos", href: "/maquinas" },
    overlay: "linear-gradient(to right, rgba(5,5,7,0.75) 0%, rgba(5,5,7,0.55) 32%, rgba(5,5,7,0.0) 46%)",
    objectPosition: "center center",
    textPadding: "",
  },
  {
    id: 2,
    image: "/images/banner-multylog-02.jpg",
    headline: "4 Soluções para\nSua Operação",
    subheadline: "Locação · Venda · Peças · Serviços",
    cta1: { label: "Solicitar Cotação", href: "/locacao" },
    cta2: { label: "Conheça a Empilhatec", href: "/sobre" },
    textCenter: true,
    textDark: true,
    headlineSize: "clamp(1.8rem, 2.8vw, 3.4rem)",
  },
];

const INTERVAL = 4000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const dragStart = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 800);
    },
    [animating]
  );

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [paused, next]);

  const handleDragStart = (x: number) => { dragStart.current = x; };
  const handleDragEnd = (x: number) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - x;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    dragStart.current = null;
  };

  const slide = SLIDES[current];
  const slide2 = SLIDES[1];

  return (
    <>
    {/* ── Mobile: só slide 2, fundo off-white ── */}
    <section className="sm:hidden bg-[#F5F5F7] mt-16 flex items-center justify-center" style={{ minHeight: "clamp(420px, 60vh, 600px)" }}>
      <div className="text-center px-6 py-16 max-w-sm mx-auto">
        <h1 className="font-display text-gray-700 leading-none tracking-wide whitespace-pre-line mb-5" style={{ fontSize: "clamp(2.4rem, 10vw, 3.2rem)" }}>
          {slide2.headline}
        </h1>
        <div className="w-12 h-0.5 bg-[#E85A00] mx-auto mb-5" />
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">{slide2.subheadline}</p>
        <div className="flex flex-col gap-3 items-center">
          <Link href={slide2.cta1.href} className="inline-flex items-center gap-2 bg-[#E85A00] hover:bg-[#C44A00] text-white font-semibold px-7 py-3.5 rounded-xl transition-all group">
            {slide2.cta1.label} <ArrowRight size={15} />
          </Link>
          {slide2.cta2 && (
            <Link href={slide2.cta2.href} className="inline-flex items-center justify-center font-semibold px-7 py-3.5 rounded-xl border border-gray-400 text-gray-600 hover:border-[#1C1C1E] hover:text-[#1C1C1E] transition-all">
              {slide2.cta2.label}
            </Link>
          )}
        </div>
      </div>
    </section>

    {/* ── Desktop: carrossel completo ── */}
    <section
      className="hidden sm:block relative w-full overflow-hidden bg-[#1C1C1E] cursor-grab active:cursor-grabbing mt-16 lg:mt-[4.5rem]"
      style={{ height: "clamp(520px, 68vh, 780px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); dragStart.current = null; }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseUp={(e) => handleDragEnd(e.clientX)}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
    >
      {/* Banner image / bg color */}
      <div className="absolute inset-0" style={{ background: slide.bgColor ?? undefined }}>
        {!slide.bgColor && (
          <Image
            key={slide.id}
            src={slide.image}
            alt={slide.headline.replace("\n", " ")}
            fill
            className="object-cover hero-slide-enter"
            style={{ objectPosition: slide.objectPosition ?? "center center" }}
            priority={slide.id === 1}
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1400px"
            quality={90}
          />
        )}
        <div className="absolute inset-0" style={{ background: slide.overlay ?? undefined }} />
      </div>

      {/* Content */}
      <div className={`site-container relative h-full flex ${slide.textCenter ? "items-center justify-center" : "items-start"}`}>
        <div key={`text-${current}`} className={`hero-slide-enter w-full ${slide.textCenter ? "max-w-[420px] text-center" : "max-w-[600px]"}`} style={{ paddingTop: slide.textCenter ? undefined : "clamp(8rem, 20vh, 14rem)" }}>

          {/* Headline */}
          <h1
            className={`font-display leading-none tracking-wide whitespace-pre-line mb-5 ${slide.textDark ? "text-gray-700" : "text-white"}`}
            style={{ fontSize: slide.headlineSize ?? "clamp(2.4rem, 4vw, 5rem)" }}
          >
            {slide.headline}
          </h1>

          {/* Divisor */}
          <div className={`w-12 h-0.5 bg-[#E85A00] mb-5 ${slide.textCenter ? "mx-auto" : ""}`} />

          {/* Subheadline */}
          {slide.subheadline && (
            <p className={`text-lg sm:text-xl max-w-md mb-8 leading-relaxed whitespace-pre-line ${slide.textDark ? "text-gray-600" : "text-gray-300"} ${slide.textCenter ? "mx-auto" : ""}`}>
              {slide.subheadline}
            </p>
          )}

          {/* CTAs */}
          <div className="inline-flex flex-col gap-3">
            <div className={`flex items-center gap-3 ${slide.textCenter ? "justify-center" : ""}`}>
              <Link
                href={slide.cta1.href}
                className="inline-flex items-center gap-2 bg-[#E85A00] hover:bg-[#C44A00] text-white font-semibold px-7 py-3.5 rounded-xl transition-all group"
              >
                {slide.cta1.label}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              {slide.cta2 && (
                <Link
                  href={slide.cta2.href}
                  className={`inline-flex items-center justify-center font-semibold px-7 py-3.5 rounded-xl border transition-all ${slide.textDark ? "border-gray-400 text-gray-600 hover:border-[#1C1C1E] hover:text-[#1C1C1E]" : "border-white/40 text-white hover:border-white"}`}
                >
                  {slide.cta2.label}
                </Link>
              )}
            </div>

            {/* Serviços sutis — apenas slide 1 */}
            {slide.id === 1 && (
              <div className="hidden sm:flex gap-3">
                {[
                  { label: "Locação", href: "/locacao" },
                  { label: "Venda", href: "/maquinas" },
                  { label: "Peças e Serviços", href: "/pecas-servicos" },
                ].map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex-1 inline-flex items-center justify-center font-semibold py-2.5 rounded-xl border-2 border-white/60 text-white hover:border-white transition-all text-sm"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-[#E85A00] w-5" : "bg-white/40"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
    </>
  );
}
