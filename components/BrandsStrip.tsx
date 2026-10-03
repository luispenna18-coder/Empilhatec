import FadeUp from "@/components/FadeUp";

export default function BrandsStrip() {
  return (
    <section className="bg-[#F5F5F7] border-b border-gray-200 py-8 lg:py-10">
      <div className="site-container">
        <FadeUp>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

            {/* Esquerda — texto */}
            <div className="text-center lg:text-left">
              <p className="text-[#1C1C1E] font-bold text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight">
                Representante Autorizado STILL
              </p>
              <p className="text-[#E85A00] font-bold text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight mt-0.5">
                Amazonas
              </p>
            </div>

            {/* Divisor */}
            <div className="hidden lg:block w-px h-16 bg-gray-300 flex-shrink-0" />

            {/* Direita — KION */}
            <div className="flex flex-col items-center lg:items-start gap-3 flex-shrink-0">
              <p className="text-xs text-gray-500 font-semibold tracking-wide">
                KION Supply Chain Solutions
              </p>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl tracking-widest text-[#1C1C1E]">STILL</span>
                  <span className="text-xs text-gray-400 tracking-wider">Representante Oficial</span>
                </div>
                <div className="w-px h-10 bg-gray-300" />
                <div className="flex flex-col items-center">
                  <span className="font-bold text-lg tracking-wide text-gray-600">Linde MH</span>
                  <span className="text-xs text-gray-400 tracking-wider">KION Group</span>
                </div>
                <div className="w-px h-10 bg-gray-300" />
                <div className="flex flex-col items-center">
                  <span className="font-bold text-lg tracking-wide text-gray-600">Baoli</span>
                  <span className="text-xs text-gray-400 tracking-wider">KION Group</span>
                </div>
              </div>
            </div>

          </div>
        </FadeUp>
      </div>
    </section>
  );
}
