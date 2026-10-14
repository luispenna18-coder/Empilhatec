import Image from "next/image";

interface PageBannerProps {
  image: string;
  alt: string;
  /** Posição do recorte da foto (CSS object-position). */
  position?: string;
  /** "tall" para banners com texto e botões; "hero" para a Home; padrão é compacto, com só o título. */
  size?: "default" | "tall" | "hero";
  /** Desfoque leve atrás do texto (lado esquerdo), que some em direção ao centro da foto. */
  blur?: boolean;
  /** Posição vertical do texto: na base (padrão) ou centralizado. */
  align?: "end" | "center";
  children: React.ReactNode;
}

/**
 * Banner de topo das páginas. A foto aparece em plena luz; o degradê escurece só o lado do texto
 * (no celular, uma película leve), como nos banners de referência.
 */
export default function PageBanner({ image, alt, position = "center", size = "default", blur = false, align = "end", children }: PageBannerProps) {
  const height =
    size === "hero" ? "min-h-[clamp(480px,76vh,760px)]" : size === "tall" ? "min-h-[clamp(380px,56vh,600px)]" : "min-h-[clamp(260px,38vh,420px)]";
  return (
    <section className={`relative mt-[var(--header-h)] flex ${align === "center" ? "items-center" : "items-end"} overflow-hidden bg-[#3a3a3f] ${height}`}>
      <Image
        src={image}
        alt={alt}
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />
      {blur && (
        <div
          className="absolute inset-0 backdrop-blur-[5px]"
          style={{
            maskImage: "linear-gradient(to right, #000 0%, #000 30%, transparent 62%)",
            WebkitMaskImage: "linear-gradient(to right, #000 0%, #000 30%, transparent 62%)",
          }}
          aria-hidden
        />
      )}
      {/* película leve no celular; degradê lateral e base no desktop */}
      <div className="absolute inset-0 bg-black/30 lg:bg-transparent" aria-hidden />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-black/60 via-black/20 to-transparent lg:block" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
      <div className={`site-container relative w-full ${align === "center" ? "py-16" : "pb-10 pt-16 lg:pb-14"} text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]`}>
        {children}
      </div>
    </section>
  );
}
