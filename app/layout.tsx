import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const bebas = DM_Sans({
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Empilhatec Empilhadeiras | Venda, locação, peças e assistência em Manaus",
  description:
    "Representante autorizado STILL e Linde no Amazonas e em Roraima. Mais de 30 anos de experiência em venda, locação, peças e assistência técnica de empilhadeiras em Manaus.",
  keywords: "empilhadeiras, locação de empilhadeiras, STILL, Manaus, Amazonas, AM",
  openGraph: {
    title: "Empilhatec Empilhadeiras",
    description: "Representante autorizado STILL e Linde no Amazonas e em Roraima",
    locale: "pt_BR",
    type: "website",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Organization"],
  name: "Empilhatec Empilhadeiras",
  description:
    "Representante autorizado STILL para o Amazonas. Mais de 30 anos de experiência em locação, venda, manutenção e peças de empilhadeiras.",
  telephone: "+55-92-3663-4112",
  email: "comercial@empilhatec.com",
  foundingDate: "1994",
  areaServed: [
    { "@type": "State", name: "Amazonas" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Crisanto Jobim, 55",
    addressLocality: "Manaus",
    addressRegion: "AM",
    addressCountry: "BR",
  },
  sameAs: [
    "https://www.instagram.com/empilhatec_empilhadeiras/",
    "https://www.facebook.com/empilhatecempilhadeiras1/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${bebas.variable} ${outfit.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
