"use client";

import { useEffect, useRef } from "react";

interface HeroVideoProps {
  src: string;
  /** Primeiro quadro do vídeo: aparece enquanto ele carrega e fica no lugar dele para quem prefere menos movimento. */
  poster: string;
}

/**
 * Vídeo de fundo do hero, mudo e em loop. Só toca enquanto o hero está na tela (poupa bateria de quem rola a página)
 * e fica parado na capa para quem pediu menos movimento no sistema.
 */
export default function HeroVideo({ src, poster }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const video = ref.current!;
    const observer = new IntersectionObserver(([entry]) => {
      // o catch cobre o modo de pouca energia do iPhone, que bloqueia o play(): fica a capa
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden
      className="hero-video absolute inset-0 h-full w-full object-cover"
    />
  );
}
