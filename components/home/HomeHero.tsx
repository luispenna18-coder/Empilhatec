import PageBanner from "@/components/PageBanner";

export default function HomeHero() {
  return (
    <PageBanner
      image="/images/banners/home.webp"
      alt="Empilhadeira STILL com operador no porto"
      position="center 55%"
      size="hero"
      blur
    >
      <div className="max-w-3xl pb-2">
        <h1 className="font-display leading-[1.02] text-white" style={{ fontSize: "clamp(2.1rem, 3.4vw, 3.4rem)" }}>
          Empilhadeiras para quem
          <br className="hidden sm:block" />
          trabalha na Amazônia.
        </h1>
        <p className="mt-5 max-w-[40rem] text-lg leading-relaxed text-white/95">
          Venda, locação, peças e assistência técnica no Amazonas e em Roraima. Há 30 anos atendendo indústrias, centros
          de distribuição e o porto de Manaus.
        </p>
      </div>
    </PageBanner>
  );
}
