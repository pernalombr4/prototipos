/**
 * O catálogo de widgets da Home, os limites de tamanho e o arranjo padrão.
 *
 * Rodada 5: as lâminas do Painel de tarefas viram widgets da Home, uma por
 * uma, como a Home de develop já faz (en-space@develop be2a5d850,
 * `src/utils/workspaceHome.ts`, sobre o catálogo do SDK,
 * en-sdk@develop 58a81c6 `packages/ui/src/components/tasks/insights/catalog.ts`).
 * O `painel` de cada lâmina é o id do painel no SDK; `naHomeDeDevelop` diz se
 * a Home de develop já oferece a lâmina ou se ela só existe no Painel de
 * tarefas hoje.
 *
 * O catálogo é uma árvore de 2 níveis: a fonte do dado (Tarefas, Categorias,
 * Navegação e agenda, Equipe e notas) e, dentro dela, cada widget. Em Tarefas,
 * os widgets se dividem em Números, Listas e Gráficos.
 *
 * Saíram na rodada 5, a pedido da redatora: "Itens de uma visualização" e
 * "Número de uma visualização".
 *
 * Todo widget lê dado que o ENSPACE já tem; o que não existe no produto hoje
 * está marcado como NOVO no comentário.
 */
import type { ItemDaGrade, LimitesDoPainel } from '~/components/ux/UxGradeDePaineis.vue'

export type TipoDeWidget =
  // Tarefas: números (cartões de KPI do SDK)
  | 'kpiAbertas'
  | 'kpiConcluidas'
  | 'kpiCriadas'
  | 'kpiVencidas'
  | 'kpiVencem7'
  // Tarefas: listas
  | 'vencidas'
  | 'vencemEmBreve'
  | 'minhasTarefas'
  | 'tarefasDelegadas'
  // Tarefas: gráficos
  | 'status'
  | 'prioridade'
  | 'carga'
  | 'atividade'
  | 'saudeDosPrazos'
  | 'entradaESaida'
  // Categorias
  | 'categorias'
  // Navegação e agenda
  | 'atalhos'
  | 'recentes'
  | 'agenda'
  | 'graficoDePainel'
  // Equipe e notas
  | 'comunicado'
  | 'notas'
  | 'beni'

/** As lâminas do Painel de tarefas que o `_WLamina.vue` desenha. */
export const LAMINAS = ['kpiAbertas', 'kpiConcluidas', 'kpiCriadas', 'kpiVencidas', 'kpiVencem7', 'vencidas', 'vencemEmBreve', 'status', 'prioridade', 'carga', 'atividade', 'entradaESaida'] as const satisfies readonly TipoDeWidget[]
export type LaminaDeTarefas = typeof LAMINAS[number]

/** O 1º nível do catálogo: de onde vem o dado. */
export type GrupoDoCatalogo = 'tarefas' | 'categorias' | 'navegacao' | 'equipe'

/** As seções de Tarefas no 2º nível. */
export type SecaoDeTarefas = 'numeros' | 'listas' | 'graficos'

export interface ConfigDoWidget {
  /** Categorias escolhidas (widget `categorias`), na ordem; vazio = todas as que a pessoa acessa, na ordem do workspace. */
  categorias?: string[]
}

export interface Widget {
  id: string
  tipo: TipoDeWidget
  config: ConfigDoWidget
  /** O administrador acrescentou à Home padrão depois que a pessoa personalizou. */
  novo?: boolean
}

export interface DefinicaoDoWidget {
  tipo: TipoDeWidget
  icone: string
  grupo: GrupoDoCatalogo
  secao?: SecaoDeTarefas
  limites: LimitesDoPainel
  tamanho: { w: number, h: number }
  /** Só o administrador vê no catálogo. */
  soAdmin?: boolean
  /** Id do painel no catálogo de tarefas do SDK. */
  painel?: string
  /** A Home de develop já oferece esta lâmina (no padrão ou no "Adicionar painel"). */
  naHomeDeDevelop?: boolean
  /** Segue o "Minhas tarefas · Workspace" do topo da Home. */
  segueEscopo?: boolean
}

const KPI = { minW: 2, maxW: 6, minH: 3, maxH: 4, wCelular: 1 }

export const CATALOGO: DefinicaoDoWidget[] = [
  // Tarefas > Números
  { tipo: 'kpiAbertas', icone: 'i-lucide-inbox', grupo: 'tarefas', secao: 'numeros', painel: 'kpi-open', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 3, h: 3 }, limites: KPI },
  { tipo: 'kpiConcluidas', icone: 'i-lucide-circle-check', grupo: 'tarefas', secao: 'numeros', painel: 'kpi-completed', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 3, h: 3 }, limites: KPI },
  { tipo: 'kpiCriadas', icone: 'i-lucide-circle-plus', grupo: 'tarefas', secao: 'numeros', painel: 'kpi-created', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 3, h: 3 }, limites: KPI },
  { tipo: 'kpiVencidas', icone: 'i-lucide-alarm-clock', grupo: 'tarefas', secao: 'numeros', painel: 'kpi-overdue', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 3, h: 3 }, limites: KPI },
  { tipo: 'kpiVencem7', icone: 'i-lucide-calendar-clock', grupo: 'tarefas', secao: 'numeros', painel: 'kpi-dueSoon', segueEscopo: true, tamanho: { w: 3, h: 3 }, limites: KPI },
  // Tarefas > Listas
  { tipo: 'vencidas', icone: 'i-lucide-alarm-clock', grupo: 'tarefas', secao: 'listas', painel: 'dueList', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  { tipo: 'vencemEmBreve', icone: 'i-lucide-hourglass', grupo: 'tarefas', secao: 'listas', painel: 'dueList', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  { tipo: 'minhasTarefas', icone: 'i-lucide-list-checks', grupo: 'tarefas', secao: 'listas', tamanho: { w: 6, h: 8 }, limites: { minW: 4, maxW: 12, minH: 5, maxH: 14 } },
  { tipo: 'tarefasDelegadas', icone: 'i-lucide-send', grupo: 'tarefas', secao: 'listas', tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  // Tarefas > Gráficos
  { tipo: 'status', icone: 'i-lucide-chart-pie', grupo: 'tarefas', secao: 'graficos', painel: 'status', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 4, h: 6 }, limites: { minW: 3, maxW: 8, minH: 5, maxH: 10 } },
  { tipo: 'prioridade', icone: 'i-lucide-flag', grupo: 'tarefas', secao: 'graficos', painel: 'breakdown', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 4, h: 6 }, limites: { minW: 3, maxW: 8, minH: 4, maxH: 10 } },
  { tipo: 'carga', icone: 'i-lucide-users', grupo: 'tarefas', secao: 'graficos', painel: 'workload', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 4, h: 6 }, limites: { minW: 3, maxW: 12, minH: 4, maxH: 12 } },
  { tipo: 'atividade', icone: 'i-lucide-calendar-check', grupo: 'tarefas', secao: 'graficos', painel: 'activity', naHomeDeDevelop: true, segueEscopo: true, tamanho: { w: 8, h: 5 }, limites: { minW: 5, maxW: 12, minH: 4, maxH: 8 } },
  { tipo: 'saudeDosPrazos', icone: 'i-lucide-heart-pulse', grupo: 'tarefas', secao: 'graficos', painel: 'dueHealth', segueEscopo: true, tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 8, minH: 4, maxH: 7 } },
  { tipo: 'entradaESaida', icone: 'i-lucide-arrow-left-right', grupo: 'tarefas', secao: 'graficos', painel: 'throughput', segueEscopo: true, tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 5, maxH: 10 } },
  // Categorias
  { tipo: 'categorias', icone: 'i-lucide-layout-grid', grupo: 'categorias', painel: 'categories', naHomeDeDevelop: true, tamanho: { w: 12, h: 3 }, limites: { minW: 4, maxW: 12, minH: 3, maxH: 10 } },
  // Navegação e agenda
  { tipo: 'atalhos', icone: 'i-lucide-bookmark', grupo: 'navegacao', tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 12, minH: 3, maxH: 9 } },
  { tipo: 'recentes', icone: 'i-lucide-history', grupo: 'navegacao', tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 6, minH: 4, maxH: 10 } },
  { tipo: 'agenda', icone: 'i-lucide-calendar-days', grupo: 'navegacao', tamanho: { w: 4, h: 6 }, limites: { minW: 3, maxW: 6, minH: 4, maxH: 10 } },
  { tipo: 'graficoDePainel', icone: 'i-lucide-chart-column', grupo: 'navegacao', tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 10 } },
  // Equipe e notas
  { tipo: 'comunicado', icone: 'i-lucide-megaphone', grupo: 'equipe', soAdmin: true, tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 12, minH: 3, maxH: 6 } },
  { tipo: 'notas', icone: 'i-lucide-notebook-pen', grupo: 'equipe', tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 8, minH: 3, maxH: 9 } },
  { tipo: 'beni', icone: 'i-lucide-sparkles', grupo: 'equipe', tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 8, minH: 4, maxH: 7 } },
]

export const GRUPOS: { grupo: GrupoDoCatalogo, icone: string }[] = [
  { grupo: 'tarefas', icone: 'i-lucide-list-checks' },
  { grupo: 'categorias', icone: 'i-lucide-layout-grid' },
  { grupo: 'navegacao', icone: 'i-lucide-compass' },
  { grupo: 'equipe', icone: 'i-lucide-users' },
]

export const SECOES: SecaoDeTarefas[] = ['numeros', 'listas', 'graficos']

export function definicao(tipo: TipoDeWidget) {
  return CATALOGO.find(d => d.tipo === tipo)!
}

/**
 * O arranjo padrão do workspace, o que o administrador entrega a todos.
 * Começa como a Home de develop (4 números, Vencidas, Vencem em breve e
 * Categorias) e soma os widgets da proposta.
 */
export const PADRAO_WIDGETS: Widget[] = [
  { id: 'w-abertas', tipo: 'kpiAbertas', config: {} },
  { id: 'w-concluidas', tipo: 'kpiConcluidas', config: {} },
  { id: 'w-criadas', tipo: 'kpiCriadas', config: {} },
  { id: 'w-kpi-vencidas', tipo: 'kpiVencidas', config: {} },
  { id: 'w-vencidas', tipo: 'vencidas', config: {} },
  { id: 'w-vencem', tipo: 'vencemEmBreve', config: {} },
  { id: 'w-categorias', tipo: 'categorias', config: { categorias: [] } },
  { id: 'w-tarefas', tipo: 'minhasTarefas', config: {} },
  { id: 'w-grafico', tipo: 'graficoDePainel', config: {} },
  { id: 'w-comunicado', tipo: 'comunicado', config: {} },
  { id: 'w-atalhos', tipo: 'atalhos', config: {} },
  { id: 'w-recentes', tipo: 'recentes', config: {} },
]

export const PADRAO_LAYOUT: ItemDaGrade[] = [
  { id: 'w-abertas', w: 3, h: 3 },
  { id: 'w-concluidas', w: 3, h: 3 },
  { id: 'w-criadas', w: 3, h: 3 },
  { id: 'w-kpi-vencidas', w: 3, h: 3 },
  { id: 'w-vencidas', w: 6, h: 6 },
  { id: 'w-vencem', w: 6, h: 6 },
  { id: 'w-categorias', w: 12, h: 3 },
  { id: 'w-tarefas', w: 6, h: 8 },
  { id: 'w-grafico', w: 6, h: 8 },
  { id: 'w-comunicado', w: 4, h: 5 },
  { id: 'w-atalhos', w: 4, h: 5 },
  { id: 'w-recentes', w: 4, h: 5 },
]
