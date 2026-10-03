# Status — Empilhatec Empilhadeiras (versão final)

**Última atualização:** 2026-10-03
**Fase:** versão final do site (o demo foi vendido)
**Etapa atual:** reestruturação das páginas (Home, Locação, Peças e Serviços, Empilhatex)

## Estrutura aprovada
Menu: Início · Máquinas · Locação · Peças e Serviços · Sobre · Empilhatex (aba nova, conteúdo a definir).
Sem aba Contato: contatos no rodapé e botão "Solicitar cotação" no topo, à direita.
Formulários enviam por e-mail (destino a definir).

## Concluído
- 2026-05-29 briefing e pesquisa de mercado (demo)
- 2026-10-01 pesquisa da empresa na internet — `brand_assets/pesquisa-internet/` (dossiê, CNPJ, Maps, LinkedIn, Facebook, Instagram, Wayback)
- 2026-10-02 catálogo de 18 máquinas, só de fontes dos fabricantes — `scripts/catalogo/`, `lib/products.data.ts` (gerado)
- 2026-10-03 aba Máquinas: blocos por categoria, lista por categoria e página de cada máquina, com carrossel igual ao da Multylog

## Próximos passos
1. Recuperar imagens que sumiram: logo, equipe, marcas, peças, linha do tempo (OneDrive ou cliente)
2. Navegação e rodapé
3. Home nova (hero, faixa de marcas, 4 entradas em zigue-zague, mapa de atendimento, história, prova social)
4. Locação (sem FAQ; depois remover data.still.de do next.config.ts)
5. Peças e Serviços (só peças e planos de manutenção) e Empilhatex
6. Sobre, formulários por e-mail
7. Layout novo (paleta e composição), com o designer
8. SEO, imagens, deploy (GitHub + Vercel) e domínio

## Pendências do cliente
Fotos originais e vídeos dos reels · depoimentos e autorização para citar avaliações do Google · horários e WhatsApp oficial · relação com a Empilhacom · "30 anos" × "20 anos" × Grupo Pontes · fichas técnicas de LTX 50, OPX 25, KBG 25, KBD 25-35 e KBD 70 (via KION).
Detalhes em `brand_assets/pesquisa-internet/dossie-empresa.md` e `brand_assets/inconsistencias.md`.

## Regras do projeto
- Imagens e fichas das máquinas: só de STILL, Linde, Baoli e Skyjack. Nunca da Multylog nem de revendas concorrentes.
- Não editar `lib/products.data.ts` à mão: ajustar `scripts/catalogo/montar.mjs` e rodar `node scripts/catalogo/montar.mjs --limpar`.
