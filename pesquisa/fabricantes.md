# Fabricantes — estrutura dos sites (fonte de verdade do catálogo)
_2026-10-02 · levantamento inicial, via leitura das páginas. Detalhes de produto ainda não extraídos._

## STILL Brasil — https://www.still.com.br
- Menu: Competência em Soluções · Empilhadeiras · Sistemas Intralogísticos · Serviços · Carreira · Empresa
- Catálogo em `/empilhadeiras/empilhadeiras-novas/` com categorias:
  - Elétricas frontais (RCE 15-20, RX 20, RX 60)
  - À combustão (RC 44-25 C, série RX 70)
  - Elétricas retráteis (FM-X, FXR)
  - Transpaleteiras (EXH, FXH)
  - Selecionadoras de pedidos (OPX, PXV)
  - Tugger trains / rebocadores
- Padrão de URL de modelo: `/empilhadeiras/empilhadeiras-novas/<categoria>/<modelo>.html`
- Locação em `/empilhadeiras/locacao.html`, seminovos em `/seminovos/`

## Linde Material Handling Brasil — https://www.linde-mh.com.br/pt_br/Produtos/Empilhadeiras/
- Categorias: empilhadeiras elétricas, a combustão, transpaleteiras, selecionadoras, patoladas, retráteis, corredores estreitos (VNA), rebocadores, comboios, antiexplosão, automatizadas; seminovas
- Organização por classe de capacidade (1–2 t, 2–3,5 t, 3,5–5 t, 5–8 t, 10–18 t)
- **Localizador de produtos** (`/Product-Finder/`) com filtros por tipo, tração e capacidade → fonte da lista completa de modelos
- Páginas de produto: galeria, dados técnicos, brochuras para download

## Baoli EMEA — https://www.baoli-emea.com/pt-PT/
- ⚠️ Este é o site **europeu (EMEA)**, em português de Portugal. **Existe site brasileiro: https://baoli.com.br** (WordPress, com `/wp-json/` aberto, páginas `/product/<modelo>/`, página `/encontre-seu-representante/`). Usar o BR como fonte; EMEA só como apoio.
- Categorias: elétricos (KBET, KBE), combustão (KBD), retráteis (KBR), porta-paletes (EP, KBP), alta elevação (KBS, ES), multifuncional (KBO)

## Para o scraper (a decidir)
- Linde: usar Product Finder como índice → página de cada modelo
- STILL: percorrer as páginas de categoria → modelo
- Baoli: usar baoli.com.br (API WordPress `/wp-json/wp/v2/` + páginas `/product/`)
- Extrair por modelo: nome, categoria, capacidade, fotos em resolução máxima, tabela técnica, brochura (link, sem baixar PDF sem OK)
- Direitos de imagem: confirmar autorização da Empilhatec como revendedora

## Verificado em 2026-10-02 (viabilidade técnica)
- STILL: páginas de categoria e modelo abrem com HTTP simples (sem login). Cada modelo traz galeria em **4K** (`data.still.de/.../*_4K.jpg`), **ficha técnica em PDF em português** (`*_PRT_TD.pdf`), manual e tabela de especificações no HTML.
- Linde BR: página de categoria lista as linhas de produto (E14-E20, X20-X35, H20-H35, H50-H80 etc.) em `/pt_br/Produtos/Empilhadeiras-Eletricas/<linha>/` e `/Empilhadeiras-a-combustao/<linha>/`. Transpaleteiras, retráteis, patoladas etc. estão em outras seções (a mapear).
- Baoli BR: WordPress, extração simples.

## Alerta sobre o catálogo herdado do demo (`lib/products.ts`)
Hosts dos ativos hoje: data.still.de (56) · baoli.com.br (19) · linde-mh.com (18) · **verticalempilhadeiras.com.br (3)** · **transpotech.com.br (1)** · tudoedesign.com.br (1).
Os 5 últimos são de concorrentes/terceiros (fichas PDF da Vertical e da Transpotech, imagem de terceiro). **Devem ser substituídos pela fonte do fabricante.**
