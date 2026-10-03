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
- 2026-10-03 Navegação e rodapé, Home nova (fotos do Instagram, logo oficial, mapa AM/RR)
- 2026-10-03 aba Máquinas: blocos por categoria, lista por categoria e página de cada máquina, com carrossel igual ao da Multylog

- 2026-10-03 acervo de 258 fotos da STILL em `brand_assets/fotos-still/` (repertório; fora do git)
- 2026-10-03 Locação nova (dealer STILL, entrega ágil pelo Norte, setores, suporte, frota, proposta); sem FAQ
- 2026-10-03 Peças e Serviços nova: peças originais + planos de manutenção (sem multimarcas/cobertura), chamado técnico e formulário
- 2026-10-03 Sobre: foto do Deocleciano (LinkedIn), linha do tempo em estrada, foto da frota no lugar da foto da equipe; banners claros em todas as páginas; hero da Home em foto

## Próximos passos
1. Logo em vetor, equipe, logos das marcas e fotos originais do cliente (OneDrive ou cliente); hoje o logo vem do Instagram e as fotos são do Instagram e da STILL
2. Empilhatex (conteúdo da aba)
3. Formulários por e-mail
4. Layout novo (paleta e composição), com o designer
5. SEO, imagens, deploy (GitHub + Vercel) e domínio

## Pendências do cliente
Fotos originais e vídeos dos reels · depoimentos e autorização para citar avaliações do Google · horários e WhatsApp oficial · relação com a Empilhacom · "30 anos" × "20 anos" × Grupo Pontes · fichas técnicas de LTX 50, OPX 25, KBG 25, KBD 25-35 e KBD 70 (via KION).
Detalhes em `brand_assets/pesquisa-internet/dossie-empresa.md` e `brand_assets/inconsistencias.md`.

## A confirmar na Locação (texto provisório)
Prazos de contrato · o que a locação inclui (manutenção, frete, treinamento) · locação com operador (LinkedIn cita "locação de mão de obra") · se "entrega ágil pelo Norte do país" tem prazo numérico · "técnicos certificados pelos fabricantes" (vem do site antigo).

## A confirmar em Peças e Serviços (texto provisório)
Formato e condições dos planos de manutenção · itens de peças em estoque · prazo de entrega de peças · "equipe especializada/certificada".

## A confirmar na Sobre
Datas da linha do tempo (2005 autorizada STILL, 2015 Linde e Baoli, 2020 setor de peças): nenhuma fonte pública confirmou. Foto da equipe: não existe; usada uma foto da frota. A capa do LinkedIn do Deocleciano mostra a fachada da empresa e pode servir como foto da sede, se o cliente autorizar.

## Regras do projeto
- Imagens e fichas das máquinas: só de STILL, Linde, Baoli e Skyjack. Nunca da Multylog nem de revendas concorrentes.
- Não editar `lib/products.data.ts` à mão: ajustar `scripts/catalogo/montar.mjs` e rodar `node scripts/catalogo/montar.mjs --limpar`.
