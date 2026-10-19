"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Menu, MessageCircle, Phone, X } from "lucide-react";
import Logo from "@/components/Logo";
import { NAV_LINKS, SITE, whatsappLink } from "@/lib/constants";

const CONTATO = whatsappLink("Olá! Gostaria de falar com a Empilhatec.");

/** Páginas que abrem com foto ou vídeo escuro: nelas a barra começa transparente, por cima da imagem. */
const abreComImagem = (path: string) =>
  ["/", "/sobre", "/maquinas", "/locacao", "/pecas-servicos", "/empilhatex"].includes(path) ||
  path.startsWith("/maquinas/categoria/");

/**
 * Barra do topo no formato da Carmak: logo à esquerda, menu centralizado e, à direita, o símbolo da STILL com o
 * botão de contato. Sobre a foto do topo ela é transparente; ao rolar a página, ganha um fundo escuro translúcido com desfoque, que deixa a página aparecer por trás.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const transparente = abreComImagem(pathname) && !scrolled && !mobileOpen;

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
        className={`border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          transparente ? "border-transparent bg-transparent" : "border-white/10 bg-black/65 backdrop-blur-xl backdrop-saturate-150"
        }`}
      >
        <div className="site-container grid h-16 grid-cols-[1fr_auto] items-center gap-6 lg:h-[4.75rem] lg:grid-cols-[1fr_auto_1fr]">
          <div className="justify-self-start">
            <Logo />
          </div>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`whitespace-nowrap px-3 py-2 text-sm transition-colors xl:px-3.5 ${
                    active ? "font-semibold text-white" : "font-medium text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 justify-self-end lg:gap-5">
            <img src="/images/brands/still.svg" alt="STILL" className="hidden h-[18px] w-auto sm:block" />
            <a
              href={CONTATO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#E85A00] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#C44A00] sm:px-5"
            >
              <MessageCircle size={17} className="sm:hidden" />
              <span className="hidden sm:inline">Entre em contato</span>
              <span className="sr-only sm:hidden">Entre em contato</span>
            </a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
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
        <div className="border-b border-white/10 bg-[#0B0B0C]/95 backdrop-blur-md lg:hidden">
          <nav className="site-container flex flex-col py-3" aria-label="Principal (celular)">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between border-l-4 px-4 py-3.5 text-base font-semibold transition-colors ${
                    active ? "border-[#E85A00] bg-white/5 text-white" : "border-transparent text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 flex flex-col gap-1 border-t border-white/10 px-4 pt-4 text-sm text-white/70">
              <a href={`tel:${SITE.phone.replace(/\D/g, "")}`} className="flex items-center gap-2 py-1.5 hover:text-white">
                <Phone size={15} /> {SITE.phone}
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 py-1.5 hover:text-white">
                <Mail size={15} /> {SITE.email}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
