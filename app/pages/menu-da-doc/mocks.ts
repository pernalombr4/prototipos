/**
 * O dado desta tela: as páginas da documentação, as 3 árvores de menu e as
 * tarefas de teste.
 *
 * ⚠️ Nota sobre a regra 23 (mock tipado pelo `enspace-sdk-schemas`).
 * Página de documentação não é entidade da API do ENSPACE: o docs.enspace.io é
 * um Nuxt Content, e cada página é um arquivo markdown do repositório `en-docs`.
 * O SDK não tem schema para isso, então os tipos abaixo são locais.
 *
 * Diferente dos outros protótipos, aqui o dado NÃO é inventado: a estrutura E os
 * textos (título, descrição, títulos de seção) são os da documentação pública,
 * extraídos para `paginas.ts`. O que está em discussão é ONDE cada página fica,
 * e isso só se julga com as páginas de verdade. Não há dado de cliente: é a
 * documentação aberta do produto.
 */
import type { Idioma } from '~/composables/useIdioma'
import { arvoreA, arvoreB, arvoreDeHoje, paginasDaDoc } from './paginas'

export type Lingua = 'pt' | 'en' | 'es'
export type PorLingua<T> = Record<Lingua, T>

/** O idioma do protótipo (`pt-BR`) e a chave do dado extraído (`pt`). */
export function lingua(idioma: Idioma): Lingua {
  return idioma === 'pt-BR' ? 'pt' : idioma
}

/** Uma página da documentação, como está no `content/pt/1.docs` do en-docs. */
export interface PaginaDaDoc {
  /** Caminho do arquivo em `content/pt/1.docs`, sem `.md`. `novo:` = índice que a proposta cria. */
  id: string
  /** Endereço de hoje, depois de `/pt/docs/`. */
  url: string
  titulo: PorLingua<string>
  descricao: PorLingua<string>
  /** Os títulos de seção (H2) do arquivo. */
  secoes: PorLingua<string[]>
  headline: PorLingua<string>
  icone: string
  /** O ícone que a barra de hoje mostra (só `navigation.icon`). */
  iconeNoMenu?: string
  status: 'published' | 'updated' | 'draft' | 'deprecated'
  /** Se `en` e `es` acharam a página correspondente. Se não, o texto fica em PT. */
  traduzida: { en: boolean, es: boolean }
  palavras: number
  /** Índice que a proposta cria (grupo que hoje não tem página). */
  nova?: boolean
}

/**
 * Um nó do menu.
 *
 * - `titulo`: título de seção fixo, que não recolhe (só na proposta B, como o
 *   "Membro", "Configurações" e "Ajuda" do menu do ENSPACE).
 * - `pasta`: tem filhos. Hoje ela só abre e fecha; nas propostas ela também
 *   abre a própria página índice.
 * - `pagina`: abre uma página.
 */
export interface No {
  id: string
  tipo: 'titulo' | 'pasta' | 'pagina'
  /** Página que o nó abre. Hoje, a pasta não abre página (o índice é o 1º filho). */
  pagina?: string
  /** Pedaço do endereço. */
  slug: string
  /** Nome gerado do nome da pasta, quando hoje a pasta não tem índice ("Ai", "Logic And Control"). */
  literal?: string
  /** Hoje: de qual página a pasta tira o nome. */
  rotuloDe?: string
  /** Nome próprio da proposta, quando ele não é o título da página. */
  rotulo?: PorLingua<string>
  icone?: string
  filhos?: No[]
  /** Página que dividia nível com pasta e virou pasta com índice (mesma URL). */
  viraPasta?: boolean
}

export type Menu = 'hoje' | 'a' | 'b' | 'c' | 'd'
export const menus: Menu[] = ['hoje', 'a', 'b', 'c', 'd']

/* Os caminhos que se repetem, a partir de `content/pt/1.docs`. */
const W = '5.Workspace'
const S = `${W}/4.Sections`
const ST = `${S}/3.Settings`
const TY = `${ST}/04.Structure/2.Types`
const FI = `${TY}/02.Fields`
const NO = `${ST}/04.Structure/4.Spaceflow/2.Nodes`
const IN = `${ST}/08.Integrations`

/* ------------------------------------------------------------------ *
 * C · COMBINADA: a ordem da A com o mapa da B                         *
 *                                                                     *
 * A barra é a da A. Muda 1 coisa: a página "Seções de menu" sai de    *
 * "Comece aqui", sobe para a raiz, logo abaixo de Boas-vindas, e vira *
 * o "Mapa do menu": o menu lateral do ENSPACE desenhado na página,    *
 * com cada item levando à página dele. É a sugestão do PESQUISA.md    *
 * ("o espelho do menu como página de índice").                        *
 * ------------------------------------------------------------------ */

/** A página que vira o mapa. Na A ela é "Seções de menu", dentro de "Comece aqui". */
export const paginaDoMapa = '5.Workspace/4.Sections/1.index'

function paraC(nos: No[]): No[] {
  return nos.map(n => ({ ...n, id: n.id.replace(/^a:/, 'c:'), filhos: n.filhos ? paraC(n.filhos) : n.filhos }))
}

function montarC(): No[] {
  const base = paraC(arvoreA)
  const comeceAqui = base.find(n => n.pagina === 'novo:comece-aqui')
  if (comeceAqui?.filhos) comeceAqui.filhos = comeceAqui.filhos.filter(n => n.pagina !== paginaDoMapa)
  const mapa: No = {
    id: 'c:mapa',
    tipo: 'pasta',
    pagina: paginaDoMapa,
    slug: 'menu-map',
    rotulo: { pt: 'Mapa do menu', en: 'Menu map', es: 'Mapa del menú' },
    icone: 'i-lucide-map',
    filhos: [],
    viraPasta: true,
  }
  return [base[0]!, mapa, ...base.slice(1)]
}

export const arvoreC = montarC()

/* ------------------------------------------------------------------ *
 * D · ATÉ 4 NÍVEIS: a C com um teto de 4 níveis na barra              *
 *                                                                     *
 * 4 mudanças sobre a C, e só elas:                                    *
 *   1. tipos de campo e nós do Spaceflow saem do espelho e vão para   *
 *      "Referência", na raiz, com as famílias e os grupos como pasta. *
 *      Ferramentas de IA vai junto. As telas Campos e Spaceflow ficam *
 *      no espelho, sem filhos;                                        *
 *   2. os grupos de Integrações (Assinadores Digitais, Canais de       *
 *      Mensagem, E-mails, IA) saem; cada integração fica direto em    *
 *      Integrações;                                                   *
 *   3. Ações em Massa vira irmã de Ações em Itens;                    *
 *   4. Etapas, Tarefas, Transições e Gatilhos viram seções da página  *
 *      Fluxos. É a única junção de conteúdo.                          *
 * ------------------------------------------------------------------ */

/** Os índices que a D cria. Valores da proposta, nos 3 idiomas. */
const paginasNovasD: PaginaDaDoc[] = [
  {
    id: 'novo:referencia',
    url: '',
    titulo: { pt: 'Referência', en: 'Reference', es: 'Referencia' },
    descricao: {
      pt: 'Catálogos para consultar: tipos de campo, nós do Spaceflow e ferramentas do agente de IA.',
      en: 'Catalogs to look up: field types, Spaceflow nodes and AI agent tools.',
      es: 'Catálogos para consultar: tipos de campo, nodos de Spaceflow y herramientas del agente de IA.',
    },
    secoes: { pt: [], en: [], es: [] },
    headline: { pt: '', en: '', es: '' },
    icone: 'i-lucide-library-big',
    iconeNoMenu: 'i-lucide-library-big',
    status: 'draft',
    traduzida: { en: true, es: true },
    palavras: 0,
    nova: true,
  },
  {
    id: 'novo:tipos-de-campo',
    url: '',
    titulo: { pt: 'Tipos de campo', en: 'Field types', es: 'Tipos de campo' },
    descricao: {
      pt: 'Cada tipo de campo que uma categoria pode ter, agrupado por família.',
      en: 'Each field type a category can have, grouped by family.',
      es: 'Cada tipo de campo que puede tener una categoría, agrupado por familia.',
    },
    secoes: { pt: [], en: [], es: [] },
    headline: { pt: 'Referência', en: 'Reference', es: 'Referencia' },
    icone: 'i-lucide-text-cursor-input',
    status: 'draft',
    traduzida: { en: true, es: true },
    palavras: 0,
    nova: true,
  },
]

const paginasDoFluxo = [`${TY}/04.Flow/2.Steps`, `${TY}/04.Flow/3.Tasks`, `${TY}/04.Flow/4.Transitions`, `${TY}/04.Flow/5.Triggers`]

/** Na D, página que virou seção de outra: id da página → id da página que a recebe. */
export const fundidasNaD: Record<string, string> = Object.fromEntries(
  paginasDoFluxo.map(id => [id, `${TY}/04.Flow/1.index`]),
)

/**
 * Na B (rodada 6), "Seções de menu" vira uma seção de Boas-vindas. Os grupos
 * da barra já são as seções do menu, e o conteúdo dela começa por "Como
 * utilizar esta documentação", que é assunto de boas-vindas.
 */
export const fundidasNaB: Record<string, string> = { '5.Workspace/4.Sections/1.index': '1.home' }

/** Páginas fundidas, por menu. */
export const fundidas: Partial<Record<Menu, Record<string, string>>> = { b: fundidasNaB, d: fundidasNaD }

/** Nome da seção que a página fundida vira, quando não é o título dela. */
export const tituloDaSecaoFundida: Record<string, PorLingua<string>> = {
  '5.Workspace/4.Sections/1.index': {
    pt: 'Como a documentação se organiza',
    en: 'How the documentation is organized',
    es: 'Cómo se organiza la documentación',
  },
}

function copiar(nos: No[], de: string, para: string): No[] {
  return nos.map(n => ({ ...n, id: n.id.replace(de, para), filhos: n.filhos ? copiar(n.filhos, de, para) : n.filhos }))
}

function acharNo(nos: No[], pagina: string): No | undefined {
  for (const n of nos) {
    if (n.pagina === pagina) return n
    const achado = acharNo(n.filhos ?? [], pagina)
    if (achado) return achado
  }
  return undefined
}

/** Nenhuma página solta: no nível que tem pasta, a página vira pasta com índice. */
function semPaginaSolta(nos: No[]): No[] {
  if (nos.some(n => n.tipo === 'pasta' && n.filhos?.length)) {
    return nos.map(n => (n.tipo === 'pagina' ? { ...n, tipo: 'pasta', filhos: [], viraPasta: true } : n))
  }
  return nos
}

function montarD(): No[] {
  const base = copiar(arvoreC, 'c:', 'd:')

  // 1. Catálogos para "Referência"
  const campos = acharNo(base, `${FI}/01.index`)!
  const eventosECondicoes = (campos.filhos ?? []).filter(n => !n.filhos?.length)
  const familias = (campos.filhos ?? []).filter(n => n.filhos?.length)
  campos.filhos = []
  const tiposDeCampo: No = {
    id: 'd:tipos-de-campo',
    tipo: 'pasta',
    pagina: 'novo:tipos-de-campo',
    slug: 'field-types',
    filhos: semPaginaSolta([...familias, ...eventosECondicoes]),
  }

  const spaceflow = acharNo(base, `${ST}/04.Structure/4.Spaceflow/1.index`)!
  const nos = spaceflow.filhos!.find(n => n.pagina === `${NO}/1.index`)!
  spaceflow.filhos = []
  const nosDoSpaceflow: No = {
    ...nos,
    slug: 'spaceflow-nodes',
    rotulo: { pt: 'Nós do Spaceflow', en: 'Spaceflow nodes', es: 'Nodos de Spaceflow' },
  }

  const iFerramentas = base.findIndex(n => n.pagina === '7.AI Tools/1.index')
  const [ferramentas] = base.splice(iFerramentas, 1)
  const referencia: No = {
    id: 'd:referencia',
    tipo: 'pasta',
    pagina: 'novo:referencia',
    slug: 'reference',
    icone: 'i-lucide-library-big',
    filhos: [tiposDeCampo, nosDoSpaceflow, { ...ferramentas!, icone: undefined }],
  }
  base.splice(iFerramentas, 0, referencia)

  // 2. Integrações sem os grupos
  const integracoes = acharNo(base, `${IN}/1.index`)!
  integracoes.filhos = semPaginaSolta((integracoes.filhos ?? []).flatMap(g => (g.pagina?.startsWith('novo:') ? g.filhos ?? [] : [g])))

  // 3. Ações em Massa vira irmã de Ações em Itens
  const categoriasDoMembro = acharNo(base, `${S}/2.Member/4.Types/1.index`)!
  const acoesEmItens = acharNo(base, `${S}/2.Member/4.Types/3.Items/1.index`)!
  const emMassa = acoesEmItens.filhos!.find(n => n.pagina === `${S}/2.Member/4.Types/3.Items/6.Mass Actions/1.index`)!
  acoesEmItens.filhos = acoesEmItens.filhos!.filter(n => n !== emMassa)
  const i = categoriasDoMembro.filhos!.indexOf(acoesEmItens)
  categoriasDoMembro.filhos!.splice(i + 1, 0, emMassa)

  // 4. Fluxos recebe as 4 páginas pequenas como seções
  const fluxos = acharNo(base, `${TY}/04.Flow/1.index`)!
  fluxos.filhos = []

  return base
}

export const arvoreD = montarD()

export const arvores: Record<Menu, No[]> = {
  hoje: arvoreDeHoje,
  a: arvoreA,
  b: arvoreB,
  c: arvoreC,
  d: arvoreD,
}

export const paginas = new Map([...paginasDaDoc, ...paginasNovasD].map(p => [p.id, p]))

/* ------------------------------------------------------------------ *
 * CAMINHOS                                                            *
 * ------------------------------------------------------------------ */

/** Do topo até o nó que abre a página. */
export function caminhoAte(arvore: No[], paginaId: string): No[] {
  for (const no of arvore) {
    if (no.pagina === paginaId && no.tipo !== 'titulo') return [no]
    const resto = caminhoAte(no.filhos ?? [], paginaId)
    if (resto.length) return [no, ...resto]
  }
  return []
}

/**
 * O menor número de cliques na barra para abrir a página, partindo dela
 * fechada: 1 clique por pasta que precisa abrir, mais 1 na página.
 * Título fixo não conta: ele não recolhe.
 */
export function cliquesMinimos(menu: Menu, paginaId: string): number {
  const caminho = caminhoAte(arvores[menu], paginaId)
  if (!caminho.length) return 0
  return caminho.slice(0, -1).filter(n => n.tipo === 'pasta').length + 1
}

/** O endereço da página em cada menu. Hoje é o do site; nas propostas, o que a árvore geraria. */
export function enderecoNo(menu: Menu, paginaId: string): string {
  if (menu === 'hoje') return `/pt/docs/${paginas.get(paginaId)?.url ?? ''}`
  const caminho = caminhoAte(arvores[menu], paginaId)
  return `/pt/docs/${caminho.map(n => n.slug).filter(Boolean).join('/')}`
}

export function nomeDoNo(no: No, l: Lingua): string {
  if (no.rotulo) return no.rotulo[l]
  if (no.literal) return no.literal
  const id = no.pagina ?? no.rotuloDe
  return id ? (paginas.get(id)?.titulo[l] ?? id) : no.id
}

/* ------------------------------------------------------------------ *
 * O MESMO ASSUNTO EM MAIS DE UMA TELA                                 *
 *                                                                     *
 * As páginas repetem de propósito: a pessoa chega por telas           *
 * diferentes. A proposta é ligar as portas umas às outras.            *
 * ------------------------------------------------------------------ */


export const assuntosRepetidos: string[][] = [
  [`${ST}/05.Access/2.Members/3.Seal`, `${W}/5.Resources/4.Document Seal`],
  [`${S}/2.Member/4.Types/4.Reports Extraction`, `${W}/5.Resources/Standard Reports`, `${TY}/06.Reports`],
  [`${S}/4.Help/2.BENI AI`, `${W}/5.Resources/3.AI Chat`],
  [`6.Modules/3.Monetary Adjustment/1.index`, `${TY}/13.Monetary Correction`, `${S}/2.Member/4.Types/2.Field Guides/Monetary Value`, `${FI}/04.Value and Time/4.Currency`],
  [`${S}/2.Member/3.Spaceflows`, `${ST}/04.Structure/4.Spaceflow/1.index`],
  [`${S}/2.Member/4.Types/1.index`, `${TY}/01.index`],
  [`${S}/2.Member/4.Types/2.Field Guides/Document Editor`, `${FI}/08.Documents/Document Editor`],
  [`4.User/8.Notifications`, `${ST}/03.System/4.Notifications`, `${TY}/09.Notifications`],
  [`4.User/4.Integrations`, `${IN}/1.index`],
  [`4.User/3.Billing`, `${ST}/03.System/6.Billing`],
  [`${TY}/04.Flow/5.Triggers`, `${NO}/2.Triggers/1.index`],
  [`${S}/2.Member/5.Tasks/1.index`, `${TY}/04.Flow/3.Tasks`, `${NO}/3.Actions/Task-Node`],
  [`${ST}/09.AI Agents`, `${NO}/4.AI/AI Agent-Node`],
]

/** Na D, a tela no espelho e o catálogo em Referência são o mesmo assunto. */
const assuntosDaD: string[][] = [
  [`${FI}/01.index`, 'novo:tipos-de-campo'],
  [`${ST}/04.Structure/4.Spaceflow/1.index`, `${NO}/1.index`],
]

export function outrasPortas(paginaId: string, menu: Menu = 'a'): string[] {
  const grupos = menu === 'd' ? [...assuntosRepetidos, ...assuntosDaD] : assuntosRepetidos
  const ids = grupos.filter(g => g.includes(paginaId)).flat()
    .map(id => fundidas[menu]?.[id] ?? id)
  return [...new Set(ids)].filter(id => id !== paginaId)
}

/* ------------------------------------------------------------------ *
 * TAREFAS DE TESTE                                                    *
 *                                                                     *
 * O que um leigo procuraria, escrito sem dizer onde fica. O texto de  *
 * cada tarefa está no textos.ts, nos 3 idiomas.                       *
 * ------------------------------------------------------------------ */

export type ChaveDeTarefa =
  | 'booleano' | 'tarefasRapidas' | 'ausencia' | 'clicksign'
  | 'credencial' | 'senha' | 'expressao' | 'aprovacao'

export const tarefas: { chave: ChaveDeTarefa, alvo: string }[] = [
  { chave: 'booleano', alvo: `${FI}/05.Options/2.Unique/Boolean` },
  { chave: 'tarefasRapidas', alvo: `${S}/2.Member/5.Tasks/2.Quick` },
  { chave: 'ausencia', alvo: `${ST}/05.Access/2.Members/2.Temporary absences` },
  { chave: 'clicksign', alvo: `${IN}/2.Digital Signers/Clicksign/3.Preparation in ENSPACE` },
  { chave: 'credencial', alvo: `${ST}/11.Credentials` },
  { chave: 'senha', alvo: '4.User/7.Profile Security' },
  { chave: 'expressao', alvo: `${W}/6.Support Materials/3. Logic and Expressions/6.Conditional Operations` },
  { chave: 'aprovacao', alvo: `${NO}/3.Actions/Approval-Node` },
]

/** A página que abre ao entrar e ao começar uma tarefa. */
export const paginaInicial = '1.home'

/* ------------------------------------------------------------------ *
 * O MAPA DO MENU (proposta C)                                         *
 *                                                                     *
 * O menu lateral do ENSPACE, na ordem e com os ícones de lá (a mesma  *
 * captura da B: protótipo `menu-lateral`, develop, 16/09/2026, e o    *
 * print da Mikaela, 29/09/2026). Só os submenus que o produto tem     *
 * aparecem abertos. O nome de cada item é o título da página na doc,  *
 * menos "Agendadas" e "Rápidas", que são os nomes do submenu.         *
 * ------------------------------------------------------------------ */

export interface ItemDoMapa {
  pagina: string
  icone?: string
  rotulo?: PorLingua<string>
  filhos?: ItemDoMapa[]
}

export interface BlocoDoMapa {
  chave: 'membro' | 'configuracoes' | 'ajuda' | 'perfil'
  itens: ItemDoMapa[]
}

const EMAILS = `${ST}/07.Emails`
const INTERFACE = `${ST}/06.Interface`

export const mapaDoMenu: BlocoDoMapa[] = [
  {
    chave: 'membro',
    itens: [
      { pagina: `${S}/2.Member/2.Home`, icone: 'i-lucide-house' },
      { pagina: `${S}/2.Member/3.Spaceflows`, icone: 'i-lucide-workflow' },
      { pagina: `${S}/2.Member/4.Types/1.index`, icone: 'i-lucide-layout-grid' },
      {
        pagina: `${S}/2.Member/5.Tasks/1.index`,
        icone: 'i-lucide-list-checks',
        filhos: [
          { pagina: `${S}/2.Member/5.Tasks/3.Scheduled`, rotulo: { pt: 'Agendadas', en: 'Scheduled', es: 'Programadas' } },
          { pagina: `${S}/2.Member/5.Tasks/2.Quick`, rotulo: { pt: 'Rápidas', en: 'Quick', es: 'Rápidas' } },
        ],
      },
      { pagina: `${S}/2.Member/6.Schedule/1.index`, icone: 'i-lucide-calendar' },
    ],
  },
  {
    chave: 'configuracoes',
    itens: [
      { pagina: `${ST}/02.Overview`, icone: 'i-lucide-gauge' },
      { pagina: `${ST}/03.System/1.index`, icone: 'i-lucide-settings' },
      {
        pagina: `${ST}/04.Structure/1.index`,
        icone: 'i-lucide-database',
        filhos: [
          { pagina: `${TY}/01.index` },
          { pagina: `${ST}/04.Structure/3.Lists/1.index` },
          { pagina: `${ST}/04.Structure/4.Spaceflow/1.index` },
        ],
      },
      { pagina: `${ST}/05.Access/1.index`, icone: 'i-lucide-id-card' },
      {
        pagina: `${INTERFACE}/1.index`,
        icone: 'i-lucide-compass',
        filhos: [{ pagina: `${INTERFACE}/2.Menus` }, { pagina: `${INTERFACE}/3.Screens` }, { pagina: `${INTERFACE}/4.UseCases` }],
      },
      {
        pagina: `${EMAILS}/1.index`,
        icone: 'i-lucide-mail',
        filhos: [{ pagina: `${EMAILS}/2.Sent Emails` }, { pagina: `${EMAILS}/3.Email Templates` }, { pagina: `${EMAILS}/4.Email Boxes` }],
      },
      { pagina: `${IN}/1.index`, icone: 'i-lucide-link' },
      { pagina: `${ST}/09.AI Agents`, icone: 'i-lucide-cpu' },
      { pagina: `${ST}/10.Logs/1.index`, icone: 'i-lucide-activity' },
      { pagina: `${ST}/11.Credentials`, icone: 'i-lucide-key-round' },
    ],
  },
  {
    chave: 'ajuda',
    itens: [
      { pagina: `${S}/4.Help/2.BENI AI`, icone: 'i-lucide-bot' },
      { pagina: `${S}/4.Help/3.Releases`, icone: 'i-lucide-copy' },
      { pagina: `${S}/4.Help/4.Documentation`, icone: 'i-lucide-book-open' },
      { pagina: `${S}/4.Help/5.Beni Builder`, icone: 'i-lucide-hammer' },
    ],
  },
  {
    chave: 'perfil',
    itens: [
      { pagina: '4.User/2.Profile', icone: 'i-lucide-user-round' },
      { pagina: '4.User/3.Billing', icone: 'i-lucide-receipt' },
      { pagina: '4.User/4.Integrations', icone: 'i-lucide-plug' },
      { pagina: '4.User/5.Developer', icone: 'i-lucide-code' },
      { pagina: '4.User/6.Lab', icone: 'i-lucide-flask-conical' },
      { pagina: '4.User/7.Profile Security', icone: 'i-lucide-shield' },
      { pagina: '4.User/8.Notifications', icone: 'i-lucide-bell' },
    ],
  },
]

const paginasDoMapa = new Set(
  mapaDoMenu.flatMap(b => b.itens.flatMap(i => [i.pagina, ...(i.filhos ?? []).map(f => f.pagina)])),
)

/**
 * O caminho mais curto pelo mapa, na C: 1 clique para abrir o mapa, 1 no item
 * do mapa que é a página ou a pasta mais funda acima dela, e 1 por nível daí
 * para baixo, pelos cartões de "Nesta seção". Página fora do mapa devolve null.
 */
export function cliquesPeloMapa(paginaId: string, menu: 'c' | 'd' = 'c'): number | null {
  const caminho = caminhoAte(arvores[menu], paginaId)
  let ultimo = -1
  caminho.forEach((no, i) => { if (no.pagina && paginasDoMapa.has(no.pagina)) ultimo = i })
  return ultimo < 0 ? null : 2 + (caminho.length - 1 - ultimo)
}
