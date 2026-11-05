import CoverageMapArt from "@/components/home/CoverageMapArt";
import { whatsappLink } from "@/lib/constants";

const ESTADOS = [
  { sigla: "AM", nome: "Amazonas", cidade: "Manaus (sede)" },
  { sigla: "RR", nome: "Roraima", cidade: "Boa Vista" },
];

export default function CoverageMap() {
  return (
    <section className="section-py bg-[#EFEFF2]">
      <div className="site-container">
        <div className="mx-auto mb-10 max-w-2xl text-center lg:mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E85A00]">Onde atuamos</p>
          <h2 className="mt-3 font-display leading-none text-[#1C1C1E]" style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)" }}>
            Presença no Amazonas e em Roraima
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Dealer autorizado STILL e Linde, com atendimento a indústrias, centros de distribuição e operações logísticas.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Mapa 3D (arte original em brand_assets/Mapa AM + RR · Manaus@1x.png), separado em camadas para a animação */}
          <CoverageMapArt />

          {/* Estados atendidos e sede */}
          <div>
            <p className="flex items-center gap-2.5 font-medium text-gray-700">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E85A00]" aria-hidden />
              Estados atendidos pela Empilhatec
            </p>
            <ul className="mt-4 space-y-3">
              {ESTADOS.map((e) => (
                <li key={e.sigla} className="flex items-center gap-5 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                  <span className="w-10 text-2xl font-bold text-[#E85A00]">{e.sigla}</span>
                  <span className="flex-1">
                    <span className="block font-semibold text-[#1C1C1E]">{e.nome}</span>
                    <span className="block text-sm text-gray-500">{e.cidade}</span>
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#E85A00]" aria-hidden />
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="leading-relaxed text-gray-600">
                Nossa sede em <strong className="text-[#1C1C1E]">Manaus (AM)</strong> tem estoque próprio de peças e
                equipe técnica para atender toda a região.
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
