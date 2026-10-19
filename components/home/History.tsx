import Link from "next/link";
import { ArrowRight } from "lucide-react";
import YouTubeVideo from "@/components/YouTubeVideo";

export default function History() {
  return (
    <section className="section-py bg-[#F5F5F7]">
      <div className="site-container">
        <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Nossa história</p>
          <h2 className="mt-3 text-balance font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            Mais de 30 anos movimentando o Amazonas
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            A Empilhatec nasceu em Manaus, em 1996, e é hoje representante autorizada das marcas STILL e Linde, do KION
            Group, no Amazonas e em Roraima.
          </p>
          <Link href="/sobre" className="group mt-7 inline-flex items-center gap-2 font-semibold text-[#E85A00]">
            Conheça a Empilhatec
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* capa: quadro de 8,25 s do próprio vídeo, em 1920×1080 */}
        <div className="mx-auto max-w-5xl rounded-3xl shadow-xl">
          <YouTubeVideo
            id="lQ1zWi8R9Go"
            title="Empilhatec, Empilhadeiras da Amazônia"
            poster="/images/home/video-institucional-capa.jpg"
            duration="36 s"
            sizes="(min-width:1088px) 64rem, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
