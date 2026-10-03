// Monta lib/products.data.ts a partir de data/catalogo/*.json (dados dos fabricantes) e apaga
// as imagens que não entram no site.
//
// Uso: node montar.mjs            gera lib/products.data.ts e data/catalogo/selecao.json
//      node montar.mjs --limpar   também apaga de public/ os arquivos de imagem não usados
//
// Campos como categoria, energia, intensidade de uso, tipo de aplicação e de controle seguem a
// ficha de cada máquina (a mesma classificação usada na Multylog, que vende as mesmas máquinas);
// capacidade e altura foram conferidas com as tabelas dos fabricantes. Descrições foram escritas
// em português do Brasil a partir dos textos oficiais. Imagens e fichas vêm só dos fabricantes.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../..');
const MULTYLOG = '/Users/luispenna/Library/CloudStorage/OneDrive-Insper-InstitutodeEnsinoePesquisa/projetos/multylog-site/lib/products.ts';
const limpar = process.argv.includes('--limpar');

// slug do scraper -> id usado nas URLs do site (mesmos ids da Multylog)
const MAPA = {
  'fm-x-1720': 'fmx-17-20', 'rce-20-25': 'rce-20-25', 'rc-44-25-c': 'rc-44-25c', 'egv-16-ng': 'egv-16-ng',
  'egv-16-sf': 'egv16-sf', 'erx-27': 'erx-27', 'exh-20': 'exh-20', 'exh-sf-20c': 'exh-sf-20', 'ech-15c': 'ech-20',
  'opx-20-25': 'opx-25', 'ltx-50': 'ltx-50', 'linde-h20-h35': 'linde-h20-h35', 'linde-h50-h80-evo': 'linde-h50-h80',
  'linde-t14-s-t20-t25-s-sf': 'linde-t20-t25', 'kbg-25': 'kbg-25', 'kbd-25-35': 'kbd-25-35', 'kbd-70': 'kbd-70',
  'sj4726-32-e': 'sj4726-32-e',
};

const NOMES = { 'linde-h20-h35': 'H20 – H35', 'linde-h50-h80': 'H50 – H80 EVO', 'linde-t20-t25': 'T20 – T25 S/SF', 'rc-44-25c': 'RC 44-25 C', 'exh-sf-20': 'EXH-SF 20 C', 'ech-20': 'ECH 15 C', 'opx-25': 'OPX 20-25' };

// ajustes onde a tabela do fabricante difere da ficha de referência
const AJUSTES = {
  // valores conferidos nas tabelas e cabeçalhos dos fabricantes; null = não verificável, omitido
  'fmx-17-20': { speed: '14 km/h' },
  'rc-44-25c': { speed: '17,5 km/h' },
  'egv16-sf': { liftHeight: 'até 5.466 mm', speed: '6,2 km/h' },
  'erx-27': { capacity: '2.750 kg', liftHeight: 'até 152 mm', speed: '12 km/h' },
  'ech-20': { capacity: '1.500 kg', liftHeight: 'até 115 mm', speed: '4,5 km/h' },
  'exh-20': { capacity: '1.600 – 2.000 kg', liftHeight: 'até 125 mm' },
  'exh-sf-20': { speed: '8,5 km/h' },
  'opx-25': { capacity: '2.000 – 2.500 kg', liftHeight: null, energy: 'Elétrica (24 V)' },
  'linde-h20-h35': { liftHeight: 'até 7.780 mm', energy: 'GLP / Diesel' },
  'linde-h50-h80': { liftHeight: 'até 9.655 mm', energy: 'Diesel' },
  'linde-t20-t25': { liftHeight: 'até 115 mm' },
  'kbg-25': { liftHeight: 'até 6.500 mm', speed: null },
  'kbd-25-35': { liftHeight: 'até 6.500 mm' },
  'kbd-70': { liftHeight: 'até 6.000 mm' },
};

const DESCRICOES = {
  'fmx-17-20': 'A FM-X 17/20 é a empilhadeira retrátil elétrica da STILL, fabricada no Brasil. Com excepcional capacidade de carga residual, comandos precisos e ergonômicos e excelente campo de visão, leva a armazenagem em altas elevações e corredores estreitos a outro nível, com elevação de até 13 metros.',
  'rce-20-25': 'A empilhadeira elétrica contrabalançada STILL RCE está pronta para qualquer serviço: transporte ocasional e empilhamento, em ambientes internos e externos. Reúne potência, robustez e eficiência, e conta com cockpit ergonômico, display colorido e iluminação em LED.',
  'rc-44-25c': 'Projetada e produzida no Brasil, a empilhadeira a combustão STILL RC 44-25 C é ideal para carga e descarga de caminhões, transporte de mercadorias e empilhamento. Versátil, com conjunto mecânico de ótimo desempenho e baixo custo de manutenção.',
  'egv-16-ng': 'Empilhadeira elétrica patolada da STILL com capacidade de 1.600 kg e elevação de até 5.466 mm, indicada para a movimentação horizontal e vertical de cargas em armazéns e corredores estreitos.',
  'egv16-sf': 'A EGV 16 SF foi desenvolvida pela STILL do Brasil para atender, de forma fácil e econômica, a movimentação horizontal e vertical dos mais variados tipos de carga, com capacidade de até 1.600 kg. Projetada para operação com operador a pé ou embarcado.',
  'erx-27': 'A ERX é a transpaleteira elétrica da STILL que reúne ergonomia, agilidade e robustez. Ideal para a movimentação horizontal de materiais e para o carregamento e descarregamento de caminhões e contêineres, inclusive em docas niveladoras, e conta com direção elétrica.',
  'exh-20': 'Transporte horizontal, a qualquer altura e em qualquer lugar: a transpaleteira elétrica com operador a pé EXH 20 é um ágil assistente de armazém. Destaque para a ergonomia do timão, com comandos posicionados para uma operação intuitiva.',
  'exh-sf-20': 'Agilidade e operação intuitiva em outra dimensão: a EXH-SF 20 C, com plataforma dobrável para operador embarcado, é o assistente inteligente para o transporte horizontal de cargas leves a médias. As dimensões estreitas facilitam a condução em espaços apertados.',
  'ech-20': 'A alternativa ideal de transpaleteira elétrica compacta. Com dimensões reduzidas e peso operacional de apenas 115 kg, é a parceira para o transporte horizontal de mercadorias em rotas curtas e regulares e em espaços confinados.',
  'opx-25': 'Seja no varejo, na indústria automotiva ou alimentícia: a selecionadora de pedidos horizontal STILL OPX, com capacidade de carga de até 2,5 toneladas, é um polivalente inovador, eficiente e confiável.',
  'ltx-50': 'O trator elétrico com operador em pé STILL LTX 50 puxa carretas de até 5.000 kg com precisão em corredores estreitos, em operações de comboio logístico (tugger train). Atinge até 14 km/h para entregas pontuais dentro da fábrica.',
  'linde-h20-h35': 'Empilhadeiras a combustão Linde da série 1202 para cargas de 2.000 a 3.500 kg. Robustas e versáteis, com acionamento hidrostático, controle por pedal duplo e ótima visibilidade, são indicadas para operações em vários turnos e uso externo em condições adversas.',
  'linde-h50-h80': 'Empilhadeiras a diesel Linde para cargas de 5.000 a 8.000 kg, com elevada capacidade de movimentação, custos de assistência reduzidos e operação segura. Motores potentes e acionamento hidrostático direto para trabalho intensivo.',
  'linde-t20-t25': 'Transpaleteiras Linde T14 S e T20–T25 S/SF com chassi mais estreito que o próprio palete e direção elétrica precisa, que garantem alta capacidade de movimentação em corredores apertados.',
  'kbg-25': 'Empilhadeira Baoli a GLP da série KBD/G 25-35, concebida para confiabilidade, produtividade e eficiência de custo. Fabricada na unidade do grupo KION em Jinan, é a escolha para quase todas as aplicações.',
  'kbd-25-35': 'Empilhadeira Baoli a diesel da série KBD/G 25-35, concebida para confiabilidade, produtividade e eficiência de custo. Fabricada na unidade do grupo KION em Jinan, é a escolha para quase todas as aplicações.',
  'kbd-70': 'A série Baoli KBD 50-100 oferece capacidades de 5, 6, 7 e 10 toneladas a 600 mm de centro de carga. É a escolha para quem busca um equipamento de qualidade robusta, sem opções desnecessárias.',
  'sj4726-32-e': 'Plataforma elevatória de tesoura elétrica Skyjack, disponível em dois modelos: SJ4726 E (altura de trabalho de 9,65 m) e SJ4732 E (11,48 m). Plataforma com extensão retrátil de 1,22 m e motorização elétrica, indicada para trabalho em altura em ambientes internos.',
};

const CATEGORIAS_ORDEM = ['retratil', 'contrabalancada', 'patolada', 'transpaleteira', 'selecionadora', 'rebocador', 'plataforma-elevatoria'];

// cabeçalhos das tabelas da Linde e da Skyjack (originais em inglês)
const CABECALHO = {
  Model: 'Modelo', 'Load capacity/Load': 'Capacidade de carga', 'Load centre distance': 'Centro de carga', Wheelbase: 'Distância entre eixos',
  'Aisle width with pallet 800 x 1200 along forks': 'Corredor (palete 800 × 1200)', 'Travel speed, with/without load': 'Velocidade (com/sem carga)',
  Lift: 'Elevação', 'Turning radius': 'Raio de giro', 'Battery voltage/rated capacity (5h)': 'Bateria (V / capacidade)',
};
const SKY = {
  'Work Height': 'Altura de trabalho', 'Raised Platform Height': 'Altura da plataforma elevada', 'Lowered Platform Height': 'Altura da plataforma recolhida',
  'Overall Width': 'Largura total', 'Overall Length': 'Comprimento total', 'Stowed Height (Rails Up)': 'Altura recolhida (guarda-corpos erguidos)',
  'Stowed Height (Rails Down)': 'Altura recolhida (guarda-corpos abaixados)', 'Platform Width (Inside Dimension)': 'Largura da plataforma (interna)',
  'Platform Length (Inside Dimension)': 'Comprimento da plataforma (interno)', 'Extension Deck (Roll Out)': 'Extensão da plataforma',
  'Ground Clearance': 'Altura livre do solo', 'Capacity (Overall)': 'Capacidade total', 'Distributed Capacity (Main Platform)': 'Capacidade (plataforma principal)',
  'Distributed Capacity (Extension Deck)': 'Capacidade (extensão)',
};
const metrico = (v) => {
  const m = v.match(/\(([^)]*)\)/);
  let t = (m ? m[1] : v).trim();
  t = /^[\d,]+\s*kg$/.test(t) ? t.replace(/,/g, '.') : t.replace(/\./g, ',');
  return t.replace(/\s*sec$/, ' s').replace('Full Height', 'Altura total').replace(/\s+/g, ' ');
};
// linhas da tabela da Skyjack que entram no site, já traduzidas
const SKY_LINHAS = ['Work Height', 'Raised Platform Height', 'Lowered Platform Height', 'Overall Width', 'Overall Length',
  'Stowed Height (Rails Down)', 'Platform Width (Inside Dimension)', 'Platform Length (Inside Dimension)', 'Extension Deck (Roll Out)',
  'Weight', 'Drive Speed (Stowed)', 'Gradeability', 'Capacity (Overall)', 'Distributed Capacity (Main Platform)',
  'Distributed Capacity (Extension Deck)', 'Maximum # of Persons'];
Object.assign(SKY, { Weight: 'Peso', 'Drive Speed (Stowed)': 'Velocidade (plataforma recolhida)', Gradeability: 'Rampa máxima', 'Maximum # of Persons': 'Máximo de pessoas' });

// ---------- escolha de imagens ----------
const EXCLUIR = /neXXt|Fleet|Stage|Footer|Logo|Li-Ion_Technology|Banner|_Header_.*KBE/i;
const CARD_PADRAO = /800x800|Studio|Freisteller|Teaser|Mobile|Header|1024x1024|teaser_16x9/i;
const CARD_MANUAL = { 'rce-20-25': '04-galeria', 'exh-sf-20': '16-caracteristica' };
const PRIORIDADE = ['aplicacao', 'outra', 'galeria', 'detalhe', 'caracteristica', 'giro', 'destaque'];
const MAX_GALERIA = 8;

async function dhash(file) {
  const { data } = await sharp(file).resize(9, 8, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  let bits = '';
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) bits += data[y * 9 + x] > data[y * 9 + x + 1] ? '1' : '0';
  return bits;
}
const dist = (a, b) => [...a].filter((c, i) => c !== b[i]).length;

async function escolherImagens(slug, id, imagens) {
  const validas = imagens.filter((i) => i.papel !== 'banner' && !EXCLUIR.test(i.fonte));
  const comHash = [];
  for (const im of validas) comHash.push({ ...im, h: await dhash(path.join(ROOT, 'public', im.arquivo)) });
  // remove quase duplicatas (mesma foto em jpg e webp), mantendo a de maior resolução
  const unicas = [];
  for (const im of comHash.sort((a, b) => b.largura * b.altura - a.largura * a.altura)) {
    if (!unicas.some((u) => dist(u.h, im.h) <= 5)) unicas.push(im);
  }
  const base = (f) => path.basename(f).replace(/\.\w+$/, '');
  let card = CARD_MANUAL[id] && comHash.find((i) => base(i.arquivo) === CARD_MANUAL[id]);
  card ??= unicas.find((i) => CARD_PADRAO.test(i.fonte)) ?? unicas.find((i) => i.papel === 'giro') ?? unicas[0];
  // se o card escolhido era duplicata de outra, usa a versão que sobreviveu
  const cardFinal = unicas.find((u) => dist(u.h, card.h) <= 5) ?? card;
  const resto = unicas.filter((i) => i !== cardFinal)
    .sort((a, b) => PRIORIDADE.indexOf(a.papel) - PRIORIDADE.indexOf(b.papel) || a.arquivo.localeCompare(b.arquivo));
  const galeria = [cardFinal, ...resto].slice(0, MAX_GALERIA);
  return { card: cardFinal, galeria };
}

// ---------- principal ----------
const { PRODUCTS: REF } = await import(MULTYLOG);
const dados = [];
for (const f of ['still', 'linde', 'baoli', 'skyjack']) dados.push(...JSON.parse(await fs.readFile(path.join(ROOT, `data/catalogo/${f}.json`), 'utf8')));

const GAL = JSON.parse(await fs.readFile(path.join(ROOT, 'data/catalogo/galeria.json'), 'utf8'));
const existe = async (f) => fs.access(f).then(() => true, () => false);
const produtos = [];
const usados = new Set();
for (const d of dados) {
  const id = MAPA[d.slug];
  const ref = REF.find((p) => p.id === id);
  if (!id || !ref) { console.log('sem correspondência:', d.slug); continue; }
  const existentes = [];
  for (const im of d.imagens) if (await existe(path.join(ROOT, 'public', im.arquivo))) existentes.push(im);
  let { card, galeria } = await escolherImagens(d.slug, id, existentes);
  // galeria = as mesmas fotos que a Multylog exibe, baixadas do fabricante (galeria.mjs)
  const refs = GAL[id]?.itens ?? [];
  if (refs.length) {
    const comoImg = (r) => ({ arquivo: r.arquivo, largura: r.largura, altura: r.altura });
    if (refs[0].ordem === 0) {
      card = refs[0];
      galeria = refs.map(comoImg);
    } else {
      // a capa da Multylog não é de fabricante: mantém a nossa capa e depois as fotos de referência
      const hCapa = await dhash(path.join(ROOT, 'public', card.arquivo));
      const resto = [];
      for (const r of refs) if (dist(hCapa, await dhash(path.join(ROOT, 'public', r.arquivo))) > 4) resto.push(comoImg(r));
      galeria = [card, ...resto];
    }
  }
  galeria.forEach((g) => usados.add(g.arquivo));
  usados.add(card.arquivo);

  let versoes;
  if (d.marca === 'Skyjack' && d.tabela?.[0]) {
    const t = d.tabela[0];
    versoes = { columns: ['Especificação', ...t.colunas.slice(1)], rows: SKY_LINHAS.map((k) => t.linhas.find((r) => r[0] === k)).filter(Boolean).map((r) => [SKY[r[0]] ?? r[0], ...r.slice(1).map(metrico)]) };
  } else if (d.tabela?.linhas?.length) {
    versoes = { columns: d.tabela.colunas.map((c) => CABECALHO[c] ?? c), rows: d.tabela.linhas.slice(0, 12) };
  }

  produtos.push({
    id,
    name: NOMES[id] ?? ref.name.replace(/\s*\((Linde|Baoli|STILL|Skyjack)\)$/, ''),
    category: ref.category,
    capacity: ref.capacity,
    ...(ref.liftHeight ? { liftHeight: ref.liftHeight } : {}),
    energy: ref.energy,
    speed: ref.speed,
    intensityOfUse: ref.intensityOfUse,
    applicationType: ref.applicationType,
    controlType: ref.controlType,
    brand: d.marca,
    available: ref.available,
    featured: ref.featured ?? false,
    ...AJUSTES[id],
    description: DESCRICOES[id],
    image: card.arquivo,
    imageSize: { w: card.largura, h: card.altura },
    gallery: galeria.map((g) => ({ src: g.arquivo, w: g.largura, h: g.altura, ...(g.legenda ? { alt: g.legenda } : {}) })),
    ...(d.ficha_tecnica ? { datasheet: d.ficha_tecnica.arquivo, datasheetLang: d.ficha_tecnica.idioma ?? 'pt' } : {}),
    ...(versoes ? { versions: versoes } : {}),
    source: d.url ?? d.fontes?.brasil ?? '',
  });
}
const limparNulos = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined));
const ORDEM_MARCA = { STILL: 0, Linde: 1, Baoli: 2, Skyjack: 3 };
for (let i = 0; i < produtos.length; i++) produtos[i] = limparNulos(produtos[i]);
produtos.sort((a, b) => CATEGORIAS_ORDEM.indexOf(a.category) - CATEGORIAS_ORDEM.indexOf(b.category) || ORDEM_MARCA[a.brand] - ORDEM_MARCA[b.brand]);

const header = `// ARQUIVO GERADO por scripts/catalogo/montar.mjs — não edite à mão.
// Fontes: sites oficiais da STILL, Linde, Baoli e Skyjack (imagens, fichas técnicas e tabelas).
import type { ProductData } from "./products";

export const PRODUCTS_DATA = `;
await fs.writeFile(path.join(ROOT, 'lib/products.data.ts'), `${header}${JSON.stringify(produtos, null, 2)} as unknown as ProductData[];\n`);
await fs.writeFile(path.join(ROOT, 'data/catalogo/selecao.json'), JSON.stringify([...usados].sort(), null, 2));
console.log(`${produtos.length} produtos; ${usados.size} imagens usadas`);

// resumo
for (const p of produtos) console.log(p.id.padEnd(14), p.category.padEnd(16), `${p.gallery.length} fotos`.padEnd(9), p.datasheet ? 'ficha' : '—', p.versions ? `versões:${p.versions.rows.length}` : '');

if (limpar) {
  let apagados = 0, bytes = 0;
  for (const marca of ['still', 'linde', 'baoli', 'skyjack']) {
    const raiz = path.join(ROOT, 'public/images/machines', marca);
    for (const dir of await fs.readdir(raiz)) {
      for (const f of await fs.readdir(path.join(raiz, dir))) {
        const rel = `/images/machines/${marca}/${dir}/${f}`;
        if (!usados.has(rel)) { const p = path.join(raiz, dir, f); bytes += (await fs.stat(p)).size; await fs.unlink(p); apagados++; }
      }
    }
  }
  console.log(`apagados ${apagados} arquivos (${(bytes / 1e6).toFixed(1)} MB)`);
}
