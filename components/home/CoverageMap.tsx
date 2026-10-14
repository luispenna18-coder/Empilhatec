import Image from "next/image";
import { whatsappLink } from "@/lib/constants";

const ESTADOS_CARDS = [
  { sigla: "AM", nome: "Amazonas", cidade: "Manaus (sede)" },
  { sigla: "RR", nome: "Roraima", cidade: "Boa Vista" },
];

export default function CoverageMap() {
  return (
    <section className="section-py bg-[#EFEFF2]">
      <div className="site-container">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Mapa em 3D (arte original em brand_assets/Mapa AM + RR · Manaus@1x.png) */}
          <div className="relative">
            <Image
              src="/images/home/mapa-am-rr-manaus.webp"
              alt="Mapa do Brasil em 3D com o Amazonas e Roraima em destaque e a sede em Manaus"
              width={1200}
              height={1180}
              sizes="(min-width: 640px) 38rem, 100vw"
              quality={90}
              className="mx-auto h-auto w-full max-w-[38rem]"
            />
          </div>

          {/* Estados e sede */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Onde atuamos</p>
            <h2 className="mt-2 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.4vw, 3.2rem)" }}>
              Presença no Amazonas e em Roraima
            </h2>
            <p className="mt-3 text-gray-600">
              Dealer autorizado STILL e Linde, com atendimento a indústrias, centros de distribuição e operações logísticas.
            </p>

            <ul className="mt-6 space-y-3">
              {ESTADOS_CARDS.map((e) => (
                <li key={e.sigla} className="flex items-center gap-5 rounded-xl border border-gray-200 bg-white px-5 py-3.5 shadow-sm">
                  <span className="w-9 text-xl font-extrabold text-[#E85A00]">{e.sigla}</span>
                  <span className="flex-1">
                    <span className="block font-semibold text-[#1C1C1E]">{e.nome}</span>
                    <span className="block text-sm text-gray-500">{e.cidade}</span>
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#E85A00]" aria-hidden />
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="leading-relaxed text-gray-600">
                Nossa sede em <strong className="text-[#1C1C1E]">Manaus (AM)</strong> garante estoque próprio de peças e
                atendimento ágil em toda a região.
              </p>
              <a
                href={whatsappLink("Olá! Gostaria de solicitar uma cotação.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-lg bg-[#E85A00] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C44A00]"
              >
                Solicitar cotação
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
