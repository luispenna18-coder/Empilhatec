import { MessageCircle, Phone } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/constants";

export default function FinalCta() {
  return (
    <section className="bg-[#E85A00]">
      <div className="site-container flex flex-col items-start justify-between gap-6 py-12 lg:flex-row lg:items-center lg:py-14">
        <div>
          <h2 className="font-display leading-none text-white" style={{ fontSize: "clamp(1.9rem, 3.2vw, 3rem)" }}>
            Vamos conversar sobre a sua operação?
          </h2>
          <p className="mt-3 max-w-xl text-lg text-white/90">
            Conte o que você precisa e nossa equipe indica a melhor solução.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink("Olá! Gostaria de solicitar uma cotação.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#1C1C1E] px-7 py-4 font-semibold text-white transition hover:bg-black"
          >
            <MessageCircle size={20} /> Chamar no WhatsApp
          </a>
          <a
            href={`tel:${SITE.phone.replace(/\D/g, "")}`}
            className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-white px-7 py-4 font-semibold text-white transition hover:bg-white hover:text-[#E85A00]"
          >
            <Phone size={20} /> {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
