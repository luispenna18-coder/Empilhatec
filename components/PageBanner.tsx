import Image from "next/image";

interface PageBannerProps {
  image: string;
  alt: string;
  /** Posição do recorte da foto (CSS object-position). */
  position?: string;
  /** "tall" para banners com texto e botões; "hero" para a Home; padrão é compacto, com só o título. */
  size?: "default" | "tall" | "hero";
  /**
   * Desfoque leve atrás do texto. No desktop cobre o lado esquerdo e some em direção ao centro da foto;
   * no celular e no tablet, onde o texto ocupa quase toda a largura, sobe da base.
   */
  blur?: boolean;
  /** Posição vertical do texto: na base (padrão) ou centralizado. */
  align?: "end" | "center";
  /** Texto centralizado na horizontal: o desfoque e o escurecimento ficam no meio da foto, e não à esquerda. */
  centered?: boolean;
  children: React.ReactNode;
}

/**
 * Banner de topo das páginas. A foto aparece em plena luz; o degradê escurece só o lado do texto
 * (no celular, uma película leve), como nos banners de referência. A barra do topo fica por cima do banner,
 * transparente até a rolagem, então o banner começa no topo da página e soma a altura da barra.
 */
export default function PageBanner({ image, alt, position = "center", size = "default", blur = false, align = "end", centered = false, children }: PageBannerProps) {
  const height =
    size === "hero"
      ? "min-h-[calc(clamp(480px,76vh,760px)_+_var(--header-h))]"
      : size === "tall"
        ? "min-h-[calc(clamp(380px,56vh,600px)_+_var(--header-h))]"
        : "min-h-[calc(clamp(260px,38vh,420px)_+_var(--header-h))]";
  return (
    <section className={`relative flex ${align === "center" ? "items-center" : "items-end"} overflow-hidden bg-[#3a3a3f] ${height}`}>
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
      {blur && centered && (
        <div
          className="absolute inset-0 backdrop-blur-[5px]"
          style={{
            maskImage: "radial-gradient(ellipse 60% 65% at 50% 58%, #000 45%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 65% at 50% 58%, #000 45%, transparent 100%)",
          }}
          aria-hidden
        />
      )}
      {blur && !centered && (
        <>
          <div
            className="absolute inset-0 backdrop-blur-[5px] lg:hidden"
            style={{
              maskImage: "linear-gradient(to top, #000 0%, #000 65%, transparent 90%)",
              WebkitMaskImage: "linear-gradient(to top, #000 0%, #000 65%, transparent 90%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 hidden backdrop-blur-[5px] lg:block"
            style={{
              maskImage: "linear-gradient(to right, #000 0%, #000 30%, transparent 62%)",
              WebkitMaskImage: "linear-gradient(to right, #000 0%, #000 30%, transparent 62%)",
            }}
            aria-hidden
          />
        </>
      )}
      {/* película leve no celular; degradê lateral e base no desktop */}
      {centered ? (
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      ) : (
        <>
          <div className="absolute inset-0 bg-black/30 lg:bg-transparent" aria-hidden />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-black/60 via-black/20 to-transparent lg:block" aria-hidden />
        </>
      )}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
      {/* escurece o alto da foto para o menu transparente continuar legível */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" aria-hidden />
      <div className={`site-container relative w-full pt-[calc(var(--header-h)+4rem)] ${align === "center" ? "pb-16" : "pb-10 lg:pb-14"} ${centered ? "text-center" : ""} text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.45)]`}>
        {children}
      </div>
    </section>
  );
}
