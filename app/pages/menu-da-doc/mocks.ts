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

export type Menu = 'hoje' | 'a' | 'b'
export const menus: Menu[] = ['hoje', 'a', 'b']

export const arvores: Record<Menu, No[]> = {
  hoje: arvoreDeHoje,
  a: arvoreA,
  b: arvoreB,
}

export const paginas = new Map(paginasDaDoc.map(p => [p.id, p]))

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

const W = '5.Workspace'
const S = `${W}/4.Sections`
const ST = `${S}/3.Settings`
const TY = `${ST}/04.Structure/2.Types`
const FI = `${TY}/02.Fields`
const NO = `${ST}/04.Structure/4.Spaceflow/2.Nodes`
const IN = `${ST}/08.Integrations`

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

export function outrasPortas(paginaId: string): string[] {
  const grupo = assuntosRepetidos.find(g => g.includes(paginaId))
  return grupo ? grupo.filter(id => id !== paginaId) : []
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
