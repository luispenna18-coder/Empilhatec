export const SITE = {
  name: "Empilhatec Empilhadeiras",
  tagline: "Representante autorizado STILL e Linde, no Amazonas e em Roraima",
  phone: "(92) 3663-4112",
  whatsapp: "5592991144496",
  whatsappDisplay: "(92) 99114-4496",
  email: "comercial@empilhatec.com",
  hours: "Segunda a Sexta, 08h – 18h",
  addresses: {
    principal: {
      label: "Empilhatec Empilhadeiras, vendas, locação e peças",
      street: "Rua Crisanto Jobim, 55",
      city: "Petrópolis, Manaus, AM",
    },
    servicos: {
      label: "Empilhatec Empilhadeiras, manutenção e serviços",
      street: "Rua Crisanto Jobim, 55",
      city: "Petrópolis, Manaus, AM",
    },
  },
  social: {
    instagram: "https://www.instagram.com/empilhatec_empilhadeiras/",
    facebook: "https://www.facebook.com/empilhatecempilhadeiras1/",
  },
};

export const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Máquinas", href: "/maquinas" },
  { label: "Locação", href: "/locacao" },
  { label: "Peças e Serviços", href: "/pecas-servicos" },
  { label: "Sobre", href: "/sobre" },
  { label: "Empilhatex", href: "/empilhatex" },
];

/** Link do WhatsApp com mensagem pronta. */
export const whatsappLink = (message: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
