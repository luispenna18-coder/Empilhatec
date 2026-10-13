import Image from "next/image";
import { Star } from "lucide-react";
import { SITE } from "@/lib/constants";

const GOOGLE_URL = "https://www.google.com/maps/place/Empilhatec+da+Amaz%C3%B4nia/@-3.110039,-59.9935982,17z";
const FEED = [1, 2, 3, 4, 5, 6].map((n) => `/images/home/feed-${n}.jpg`);

export default function SocialProof() {
  return (
    <section className="section-py bg-white">
      <div className="site-container">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Quem conhece, recomenda</p>
          <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            Reputação construída em Manaus
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Google */}
          <a
            href={GOOGLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-3xl border border-gray-200 bg-[#F5F5F7] p-8 transition hover:border-[#E85A00]/50 hover:shadow-lg"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Avaliações no Google</p>
              <p className="mt-4 flex items-end gap-3">
                <span className="text-7xl font-extrabold leading-none text-[#1C1C1E]">4,7</span>
                <span className="mb-2 flex" aria-label="4,7 de 5 estrelas">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} size={22} className="fill-[#E85A00] text-[#E85A00]" />
                  ))}
                </span>
              </p>
              <p className="mt-3 text-gray-600">
                Média de <strong className="text-[#1C1C1E]">61 avaliações</strong>, com 49 delas de 5 estrelas.
              </p>
            </div>
            <span className="mt-8 font-semibold text-[#E85A00] group-hover:underline">Ver no Google Maps →</span>
          </a>

          {/* Instagram */}
          <div className="rounded-3xl border border-gray-200 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Acompanhe no Instagram</p>
                <p className="mt-1 text-xl font-bold text-[#1C1C1E]">@empilhatec_empilhadeiras</p>
              </div>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-[#1C1C1E] transition hover:border-[#E85A00] hover:text-[#E85A00]"
              >
                Seguir
              </a>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              {FEED.map((src, i) => (
                <a
                  key={src}
                  href={SITE.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                  aria-label={`Publicação ${i + 1} no Instagram da Empilhatec`}
                >
                  <Image src={src} alt="" fill sizes="(min-width:1024px) 14rem, 30vw" className="object-cover transition-transform duration-300 hover:scale-105" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
