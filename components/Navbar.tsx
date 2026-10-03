"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-white shadow-lg"
          : "bg-white/90 backdrop-blur-md"
      }`}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/logo-empilhatec.png"
              alt="Empilhatec Empilhadeiras"
              height={36}
              width={180}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  pathname === link.href
                    ? "text-[#E85A00]"
                    : "text-gray-600 hover:text-[#1C1C1E]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/locacao"
              className="inline-flex items-center gap-1.5 bg-[#E85A00] hover:bg-[#C44A00] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">Solicitar Cotação</span>
              <span className="sm:hidden">Cotação</span>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-gray-600 hover:text-[#1C1C1E] p-1"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <nav className="site-container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? "bg-[#E85A00] text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#1C1C1E]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/locacao"
              className="mt-3 text-center bg-[#E85A00] hover:bg-[#C44A00] text-white font-semibold px-4 py-3 rounded-xl transition-colors"
            >
              Solicitar Cotação
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
