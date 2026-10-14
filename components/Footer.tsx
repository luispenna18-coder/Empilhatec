import Link from "next/link";
import Logo from "@/components/Logo";
import { NAV_LINKS, SITE, whatsappLink } from "@/lib/constants";

const MAP_EMPILHATEC =
  "https://maps.google.com/maps?q=Rua+Crisanto+Jobim,+55,+Petrópolis,+Manaus,+AM&output=embed&z=15";

export default function Footer() {
  return (
    <footer className="bg-[#0B1A2E] text-white overflow-hidden">

      {/* ── Linha 1: Logo · Tagline ── */}
      <div className="border-b border-white/10">
        <div className="site-container py-8 lg:py-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12 justify-between">

            <Logo variant="light" />

            {/* KION */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-white/40 text-xs tracking-widest uppercase">KION Supply Chain Solutions</p>
              <div className="flex items-center gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/brands/still.svg" alt="STILL" className="h-6 w-auto" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/brands/linde.svg" alt="Linde Material Handling" className="h-11 w-auto" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/brands/baoli.svg" alt="Baoli" className="h-10 w-auto" />
              </div>
            </div>

            {/* Tagline */}
            <p className="text-white/60 text-sm leading-relaxed text-center max-w-[260px]">
              Representante autorizado STILL e Linde no Amazonas e Roraima.{" "}
              <span className="font-semibold text-white/90">Mais de 30 anos movimentando o estado.</span>
            </p>

          </div>
        </div>
      </div>

      {/* ── Linha 2: Endereço + Email + Redes ── */}
      <div className="site-container py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 xl:gap-16">

          {/* Endereço */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF7A2B]">Endereço</p>
            <p className="text-white/60 text-sm leading-relaxed">{SITE.addresses.principal.street}</p>
            <p className="text-white/60 text-sm">{SITE.addresses.principal.city}</p>
            <div className="mt-5 rounded overflow-hidden w-full" style={{ height: 160 }}>
              <iframe
                src={MAP_EMPILHATEC}
                width="100%" height="160"
                style={{ border: 0, filter: "grayscale(40%) brightness(0.85)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Empilhatec"
              />
            </div>
          </div>

          {/* Navegação */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF7A2B]">Navegação</p>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/60 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div id="contato" className="flex flex-col scroll-mt-[calc(var(--header-h)+1rem)]">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF7A2B]">Contato</p>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-white/40 text-xs block">Telefone</span>
                <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="text-white/70 hover:text-white transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <span className="text-white/40 text-xs block">WhatsApp</span>
                <a
                  href={whatsappLink("Olá! Gostaria de falar com a Empilhatec.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {SITE.whatsappDisplay}
                </a>
              </li>
              <li>
                <span className="text-white/40 text-xs block">E-mail</span>
                <a href={`mailto:${SITE.email}`} className="text-white/70 hover:text-white transition-colors">
                  {SITE.email}
                </a>
              </li>
              <li>
                <span className="text-white/40 text-xs block">Horário de atendimento</span>
                <span className="text-white/70">{SITE.hours}</span>
              </li>
            </ul>

            <div className="flex gap-3 mt-6">
              {[
                { href: SITE.social.instagram, label: "Instagram", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { href: SITE.social.facebook,  label: "Facebook",  d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              ].map(({ href, label, d }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-[4px] border border-white/20 hover:border-[#E85A00] hover:bg-[#E85A00] flex items-center justify-center transition-all"
                  aria-label={label}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d={d}/></svg>
                </a>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ── Barra inferior ── */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="site-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Empilhatec Empilhadeiras. Todos os direitos reservados.
          </p>
        </div>
      </div>

    </footer>
  );
}
