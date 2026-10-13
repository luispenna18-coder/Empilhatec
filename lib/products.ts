import { PRODUCTS_DATA } from "./products.data";

export type Category =
  | "retratil"
  | "contrabalancada"
  | "patolada"
  | "transpaleteira"
  | "selecionadora"
  | "rebocador"
  | "plataforma-elevatoria";

export interface GalleryImage {
  src: string;
  w: number;
  h: number;
  alt?: string;
}

export interface VersionsTable {
  columns: string[];
  rows: string[][];
}

export interface ProductData {
  id: string;
  name: string;
  category: Category;
  capacity: string;
  liftHeight?: string;
  energy?: string;
  speed?: string;
  intensityOfUse?: string;
  applicationType?: string;
  controlType?: string;
  brand: string;
  available?: ("locacao" | "venda")[];
  featured?: boolean;
  description: string;
  /** Foto de capa (card e topo da galeria). */
  image: string;
  imageSize: { w: number; h: number };
  gallery: GalleryImage[];
  /** Ficha técnica em PDF, servida pelo próprio site. */
  datasheet?: string;
  datasheetLang?: "pt" | "en";
  versions?: VersionsTable;
  /** Página do fabricante de onde os dados foram obtidos. */
  source: string;
}

export interface Product extends ProductData {
  imagePadding?: string;
  imageBlend?: boolean;
}

export const PRODUCTS: Product[] = PRODUCTS_DATA;

export const CATEGORY_LABELS: Record<Category, string> = {
  retratil: "Retrátil",
  contrabalancada: "Contrabalançada",
  patolada: "Patolada",
  transpaleteira: "Transpaleteira",
  selecionadora: "Selecionadora de Pedidos",
  rebocador: "Rebocador",
  "plataforma-elevatoria": "Plataforma Elevatória",
};

export interface CategoryInfo {
  label: string;
  plural: string;
  description: string;
}

export const CATEGORY_INFO: Record<Category, CategoryInfo> = {
  retratil: {
    label: "Retrátil",
    plural: "Empilhadeiras Retráteis",
    description: "Armazenagem em grandes alturas e corredores estreitos, com excelente capacidade residual.",
  },
  contrabalancada: {
    label: "Contrabalançada",
    plural: "Empilhadeiras Contrabalançadas",
    description: "Elétricas, a GLP ou a diesel, para carga, descarga e empilhamento dentro e fora do galpão.",
  },
  patolada: {
    label: "Patolada",
    plural: "Empilhadeiras Patoladas",
    description: "Compactas e ágeis para movimentação vertical em armazéns e operações de corredor.",
  },
  transpaleteira: {
    label: "Transpaleteira",
    plural: "Transpaleteiras",
    description: "Movimentação horizontal de paletes com operador a pé ou embarcado.",
  },
  selecionadora: {
    label: "Selecionadora de Pedidos",
    plural: "Selecionadoras de Pedidos",
    description: "Separação de pedidos com produtividade e ergonomia para o operador.",
  },
  rebocador: {
    label: "Rebocador",
    plural: "Rebocadores",
    description: "Tratores elétricos para comboios logísticos e abastecimento de linhas de produção.",
  },
  "plataforma-elevatoria": {
    label: "Plataforma Elevatória",
    plural: "Plataformas Elevatórias",
    description: "Trabalho em altura com segurança, em plataformas de tesoura elétricas.",
  },
};

export const CATEGORY_ORDER: Category[] = [
  "retratil",
  "contrabalancada",
  "patolada",
  "transpaleteira",
  "selecionadora",
  "rebocador",
  "plataforma-elevatoria",
];

const BRAND_ORDER: Record<string, number> = { STILL: 0, Linde: 1, Baoli: 2, Skyjack: 3 };

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function productsByCategory(category: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === category).sort(
    (a, b) => (BRAND_ORDER[a.brand] ?? 9) - (BRAND_ORDER[b.brand] ?? 9),
  );
}

/** Categorias que têm ao menos uma máquina, na ordem de exibição. */
export function categoriesWithProducts(): Category[] {
  return CATEGORY_ORDER.filter((c) => PRODUCTS.some((p) => p.category === c));
}

export function isCategory(value: string): value is Category {
  return (CATEGORY_ORDER as string[]).includes(value);
}
