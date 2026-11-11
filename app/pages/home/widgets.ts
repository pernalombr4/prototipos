/**
 * O catálogo de widgets da Home, os limites de tamanho e o arranjo padrão.
 *
 * Todo widget lê dado que o ENSPACE já tem (regra da casa: nada de painel sem
 * fonte nativa):
 * - tarefas: `/ws/tasks` e `/c-flow-item-tasks`, os mesmos do Painel de tarefas;
 * - itens: a visualização salva da categoria (`TypeView`), com o filtro dela;
 * - gráfico: um painel de uma tela do tipo Dashboard (Interface › Telas);
 * - agenda: as fontes da Agenda; recentes: o histórico de navegação da pessoa.
 * O que não existe no produto hoje está marcado como NOVO no comentário.
 */
import type { ItemDaGrade, LimitesDoPainel } from '~/components/ux/UxGradeDePaineis.vue'

export type TipoDeWidget =
  | 'criarRapido'
  | 'minhasTarefas'
  | 'visualizacao'
  | 'numero'
  | 'atalhos'
  | 'recentes'
  | 'agenda'
  | 'saudeDosPrazos'
  | 'graficoDePainel'
  | 'tarefasDelegadas'
  | 'notas'
  | 'comunicado'
  | 'beni'

export type GrupoDoCatalogo = 'trabalho' | 'itens' | 'navegacao' | 'equipe'

export interface ConfigDoWidget {
  /** Visualização salva (widgets `visualizacao` e `numero`). */
  visualizacao?: string
  /** Título próprio; sem ele, vale o nome da visualização. */
  titulo?: string
  /** Atalhos de criar fixados (widget `criarRapido`); vazio = os mais usados. */
  fixados?: string[]
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
  limites: LimitesDoPainel
  tamanho: { w: number, h: number }
  /** Pode haver mais de um na Home (uma visualização por widget, por exemplo). */
  repete: boolean
  /** Pede configuração ao entrar (escolher a visualização). */
  pedeConfig: boolean
  /** Só o administrador vê no catálogo. */
  soAdmin?: boolean
}

export const CATALOGO: DefinicaoDoWidget[] = [
  // Trabalho
  { tipo: 'minhasTarefas', icone: 'i-lucide-list-checks', grupo: 'trabalho', repete: false, pedeConfig: false, tamanho: { w: 6, h: 8 }, limites: { minW: 4, maxW: 12, minH: 5, maxH: 14 } },
  { tipo: 'tarefasDelegadas', icone: 'i-lucide-send', grupo: 'trabalho', repete: false, pedeConfig: false, tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 12 } },
  { tipo: 'agenda', icone: 'i-lucide-calendar-days', grupo: 'trabalho', repete: false, pedeConfig: false, tamanho: { w: 4, h: 6 }, limites: { minW: 3, maxW: 6, minH: 4, maxH: 10 } },
  // Itens e números
  { tipo: 'visualizacao', icone: 'i-lucide-table-properties', grupo: 'itens', repete: true, pedeConfig: true, tamanho: { w: 6, h: 8 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 14 } },
  { tipo: 'numero', icone: 'i-lucide-hash', grupo: 'itens', repete: true, pedeConfig: true, tamanho: { w: 3, h: 3 }, limites: { minW: 2, maxW: 4, minH: 3, maxH: 4, wCelular: 1 } },
  { tipo: 'saudeDosPrazos', icone: 'i-lucide-heart-pulse', grupo: 'itens', repete: false, pedeConfig: false, tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 6, minH: 4, maxH: 7 } },
  { tipo: 'graficoDePainel', icone: 'i-lucide-chart-column', grupo: 'itens', repete: true, pedeConfig: false, tamanho: { w: 6, h: 6 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 10 } },
  // Navegação
  { tipo: 'criarRapido', icone: 'i-lucide-circle-plus', grupo: 'navegacao', repete: false, pedeConfig: false, tamanho: { w: 12, h: 2 }, limites: { minW: 4, maxW: 12, minH: 2, maxH: 2 } },
  { tipo: 'atalhos', icone: 'i-lucide-bookmark', grupo: 'navegacao', repete: false, pedeConfig: false, tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 12, minH: 3, maxH: 9 } },
  { tipo: 'recentes', icone: 'i-lucide-history', grupo: 'navegacao', repete: false, pedeConfig: false, tamanho: { w: 4, h: 7 }, limites: { minW: 3, maxW: 6, minH: 4, maxH: 10 } },
  // Equipe e notas
  { tipo: 'comunicado', icone: 'i-lucide-megaphone', grupo: 'equipe', repete: false, pedeConfig: false, soAdmin: true, tamanho: { w: 4, h: 4 }, limites: { minW: 3, maxW: 12, minH: 3, maxH: 6 } },
  { tipo: 'notas', icone: 'i-lucide-notebook-pen', grupo: 'equipe', repete: false, pedeConfig: false, tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 8, minH: 3, maxH: 9 } },
  { tipo: 'beni', icone: 'i-lucide-sparkles', grupo: 'equipe', repete: false, pedeConfig: false, tamanho: { w: 4, h: 5 }, limites: { minW: 3, maxW: 8, minH: 4, maxH: 7 } },
]

export function definicao(tipo: TipoDeWidget) {
  return CATALOGO.find(d => d.tipo === tipo)!
}

/** O arranjo padrão do workspace, o que o administrador entrega a todos. */
export const PADRAO_WIDGETS: Widget[] = [
  { id: 'w-criar', tipo: 'criarRapido', config: { fixados: [] } },
  { id: 'w-tarefas', tipo: 'minhasTarefas', config: {} },
  { id: 'w-comunicado', tipo: 'comunicado', config: {} },
  { id: 'w-atalhos', tipo: 'atalhos', config: {} },
  { id: 'w-compras', tipo: 'visualizacao', config: { visualizacao: 'v-compras-abertas' } },
  { id: 'w-recentes', tipo: 'recentes', config: {} },
]

export const PADRAO_LAYOUT: ItemDaGrade[] = [
  { id: 'w-criar', w: 12, h: 2 },
  { id: 'w-tarefas', w: 6, h: 8 },
  { id: 'w-compras', w: 6, h: 8 },
  { id: 'w-comunicado', w: 4, h: 5 },
  { id: 'w-atalhos', w: 4, h: 5 },
  { id: 'w-recentes', w: 4, h: 5 },
]

/* ------------------------------------------------------------------ *
 * O que se cria                                                        *
 * ------------------------------------------------------------------ */

export interface OpcaoDeCriar {
  id: string
  tipo: 'tarefa' | 'item' | 'formulario'
  icone: string
  /** Categoria do item ou do formulário. */
  categoria?: string
  formulario?: string
  /** Vezes que a pessoa usou: ordena o "Criar rápido" quando nada está fixado. NOVO: contador por pessoa. */
  usos: number
}
