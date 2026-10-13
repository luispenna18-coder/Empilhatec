"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import Logo from "@/components/Logo";
import { NAV_LINKS, SITE, whatsappLink } from "@/lib/constants";

const COTACAO = whatsappLink("Olá! Gostaria de solicitar uma cotação.");

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Barra principal */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled || mobileOpen ? "border-transparent bg-white/95 shadow-md backdrop-blur" : "border-gray-200 bg-white"
        }`}
      >
        <div className="site-container flex h-16 items-center justify-between gap-6 lg:h-[4.75rem]">
          <Logo />

          <div className="flex items-center gap-2 lg:gap-8">
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative px-3.5 py-2 text-sm font-semibold transition-colors ${
                      active ? "text-[#1C1C1E]" : "text-gray-500 hover:text-[#1C1C1E]"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-3.5 -bottom-[1.05rem] h-[3px] origin-left rounded-full bg-[#E85A00] transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </nav>

            <a
              href={COTACAO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#E85A00] px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#E85A00]/30 transition-all hover:bg-[#C44A00] hover:shadow-lg sm:px-5"
            >
              <MessageCircle size={17} />
              <span className="hidden sm:inline">Solicitar cotação</span>
              <span className="sr-only sm:hidden">Solicitar cotação</span>
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#1C1C1E] lg:hidden"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu no celular */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg lg:hidden">
          <nav className="site-container flex flex-col py-3" aria-label="Principal (celular)">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between border-l-4 px-4 py-3.5 text-base font-semibold transition-colors ${
                    active ? "border-[#E85A00] bg-[#E85A00]/5 text-[#1C1C1E]" : "border-transparent text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 flex flex-col gap-1 border-t border-gray-100 px-4 pt-4 text-sm text-gray-600">
              <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="flex items-center gap-2 py-1.5"><Phone size={15} /> {SITE.phone}</a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 py-1.5"><Mail size={15} /> {SITE.email}</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
