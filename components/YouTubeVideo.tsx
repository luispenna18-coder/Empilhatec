"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeVideoProps {
  /** ID do vídeo no YouTube (o trecho depois de "watch?v="). */
  id: string;
  title: string;
  /** Capa local, mostrada até o clique. */
  poster: string;
  /** Duração exibida ao lado do botão, ex.: "1 min 12 s". */
  duration?: string;
  sizes?: string;
}

/**
 * Vídeo do YouTube com capa própria: o player só carrega depois do clique, então a página fica mais leve
 * e a capa segue o visual do site em vez da interface do YouTube.
 */
export default function YouTubeVideo({ id, title, poster, duration, sizes = "(min-width:1024px) 55vw, 100vw" }: YouTubeVideoProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl bg-black">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Assistir ao vídeo: ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer text-left"
        >
          <Image
            src={poster}
            alt=""
            fill
            quality={90}
            sizes={sizes}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-hidden />
          <span className="absolute bottom-3 left-3 flex items-center gap-4 sm:bottom-7 sm:left-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E85A00] text-white shadow-lg shadow-black/30 transition group-hover:scale-110 group-hover:bg-[#C44A00] sm:h-16 sm:w-16">
              <Play className="ml-0.5 h-5 w-5 fill-current sm:ml-1 sm:h-6 sm:w-6" />
            </span>
            {/* no celular fica só o botão, para não cobrir o título que já vem na capa */}
            <span className="hidden text-white sm:block">
              <span className="block font-semibold">Assistir ao vídeo</span>
              {duration && <span className="block text-sm text-white/70">{duration}</span>}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
