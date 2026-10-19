"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/lib/products";

export default function MachineGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const total = images.length;
  const go = (i: number) => setIndex((i + total) % total);
  const current = images[index];

  return (
    <div
      className="min-w-0 max-w-full outline-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(index - 1);
        if (e.key === "ArrowRight") go(index + 1);
      }}
      aria-roledescription="carrossel"
      aria-label={`Fotos de ${name}`}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-white"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt ?? `${name}, foto ${index + 1} de ${total}`}
          fill
          priority={index === 0}
          quality={90}
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-contain p-4"
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1C1C1E] shadow transition hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1C1C1E] shadow transition hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === index}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition ${
                i === index ? "border-[#E85A00]" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
