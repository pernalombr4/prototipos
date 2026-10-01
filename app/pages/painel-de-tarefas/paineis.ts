/**
 * O catálogo de painéis: o que existe, o tamanho padrão e os limites de cada um.
 *
 * Rodada 2: a pessoa arruma o painel como no ClickUp (mover, redimensionar,
 * ocultar e trazer de volta). O conteúdo continua fixo: o catálogo é fechado e
 * cada painel mostra sempre o mesmo número. Só o arranjo é de cada pessoa.
 *
 * Grade: 12 colunas, linha de 44 px e espaço de 16 px. Altura em pixels de um
 * painel com `h` linhas: 60 × h - 16.
 */
import type { ItemDaGrade, LimitesDoPainel } from '~/components/ux/UxGradeDePaineis.vue'

export type IdDoPainel =
  | 'abertas' | 'vencidas' | 'aVencer' | 'concluidas' | 'noPrazo' | 'tempo'
  | 'sla' | 'prazos' | 'proximas'
  | 'serie' | 'contagemStatus' | 'prioridade'
  | 'responsaveis'
  | 'tempos'

export type GrupoDoPainel = 'numeros' | 'prazo' | 'volume' | 'pessoas' | 'tempos'

export interface DefinicaoDoPainel {
  id: IdDoPainel
  grupo: GrupoDoPainel
  icone: string
  padrao: { w: number, h: number }
  limites: LimitesDoPainel
}

const NUMERO: LimitesDoPainel = { minW: 2, maxW: 4, minH: 3, maxH: 4, wCelular: 1 }

export const PAINEIS: DefinicaoDoPainel[] = [
  { id: 'abertas', grupo: 'numeros', icone: 'i-lucide-inbox', padrao: { w: 2, h: 3 }, limites: NUMERO },
  { id: 'vencidas', grupo: 'numeros', icone: 'i-lucide-alarm-clock-off', padrao: { w: 2, h: 3 }, limites: NUMERO },
  { id: 'aVencer', grupo: 'numeros', icone: 'i-lucide-alarm-clock', padrao: { w: 2, h: 3 }, limites: NUMERO },
  { id: 'concluidas', grupo: 'numeros', icone: 'i-lucide-circle-check', padrao: { w: 2, h: 3 }, limites: NUMERO },
  { id: 'noPrazo', grupo: 'numeros', icone: 'i-lucide-target', padrao: { w: 2, h: 3 }, limites: NUMERO },
  { id: 'tempo', grupo: 'numeros', icone: 'i-lucide-timer', padrao: { w: 2, h: 3 }, limites: NUMERO },
  // Rodada 3: os 3 de prazo numa linha; o SLA virou colunas com o seletor "Abertas agora" ou "Concluídas no período".
  { id: 'sla', grupo: 'prazo', icone: 'i-lucide-chart-column', padrao: { w: 4, h: 7 }, limites: { minW: 3, maxW: 12, minH: 6, maxH: 12 } },
  { id: 'prazos', grupo: 'prazo', icone: 'i-lucide-hourglass', padrao: { w: 4, h: 7 }, limites: { minW: 3, maxW: 12, minH: 6, maxH: 12 } },
  { id: 'proximas', grupo: 'prazo', icone: 'i-lucide-calendar-clock', padrao: { w: 4, h: 7 }, limites: { minW: 3, maxW: 12, minH: 4, maxH: 16 } },
  { id: 'serie', grupo: 'volume', icone: 'i-lucide-chart-line', padrao: { w: 8, h: 7 }, limites: { minW: 4, maxW: 12, minH: 5, maxH: 12 } },
  { id: 'contagemStatus', grupo: 'volume', icone: 'i-lucide-chart-column-stacked', padrao: { w: 4, h: 7 }, limites: { minW: 3, maxW: 12, minH: 5, maxH: 12 } },
  { id: 'responsaveis', grupo: 'pessoas', icone: 'i-lucide-chart-bar', padrao: { w: 8, h: 7 }, limites: { minW: 4, maxW: 12, minH: 4, maxH: 16 } },
  { id: 'prioridade', grupo: 'volume', icone: 'i-lucide-flag', padrao: { w: 4, h: 7 }, limites: { minW: 3, maxW: 12, minH: 5, maxH: 12 } },
  // Rodada 3: tarefa, etapa e fluxo voltam a ser um painel só, com seletor de nível.
  { id: 'tempos', grupo: 'tempos', icone: 'i-lucide-chart-gantt', padrao: { w: 12, h: 8 }, limites: { minW: 5, maxW: 12, minH: 5, maxH: 16 } },
]

export const GRUPOS: GrupoDoPainel[] = ['numeros', 'prazo', 'volume', 'pessoas', 'tempos']

export const DEFINICAO = Object.fromEntries(PAINEIS.map(p => [p.id, p])) as Record<IdDoPainel, DefinicaoDoPainel>

export const LIMITES = Object.fromEntries(PAINEIS.map(p => [p.id, p.limites])) as Record<IdDoPainel, LimitesDoPainel>

export function layoutPadrao(): ItemDaGrade[] {
  return PAINEIS.map(p => ({ id: p.id, ...p.padrao }))
}

/**
 * O arranjo de cada pessoa. No protótipo fica no `localStorage` do navegador
 * (declarado no DECISOES.md); no produto, numa preferência por membro.
 */
const CHAVE = 'enspace-prototipos:painel-de-tarefas:layout:v4'

export function lerLayout(): ItemDaGrade[] | null {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return null
    const lista = JSON.parse(bruto) as ItemDaGrade[]
    const validos = lista.filter(x => x && x.id in DEFINICAO && Number.isFinite(x.w) && Number.isFinite(x.h))
    return validos
  }
  catch {
    return null
  }
}

export function gravarLayout(layout: ItemDaGrade[]) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(layout))
  }
  catch {
    // Sem armazenamento (janela anônima, bloqueio): o arranjo vale até o reload.
  }
}

/* ------------------------------------------------------------------ *
 * A quickview da lista lateral (rodada 3)                              *
 * ------------------------------------------------------------------ */

/** Uma linha do resumo: ícone, rótulo e valor, como os "Details" do admin. */
export interface LinhaDoResumo {
  icone: string
  rotulo: string
  valor: string
  tom?: 'error' | 'warning' | 'success'
  /** A parte do painel que a pessoa clicou (a faixa, a situação, o status). */
  destaque?: boolean
}

/** O que a quickview mostra: o resumo do painel de onde a lista saiu. */
export interface ResumoDoRecorte {
  painel: IdDoPainel
  /** O recorte aberto: "Vencidas", "SLA · Atrasada", "Carla Nunes". */
  titulo: string
  /** O número principal do recorte, quando há um. */
  valor?: string
  /** "Agora" ou "No período", e o período. */
  selos: string[]
  linhas: LinhaDoResumo[]
}
