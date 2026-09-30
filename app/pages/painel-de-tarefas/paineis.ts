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
  | 'serie' | 'status'
  | 'responsaveis'
  | 'tempoTarefa' | 'tempoEtapa' | 'tempoFluxo'

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
  { id: 'sla', grupo: 'prazo', icone: 'i-lucide-gauge', padrao: { w: 7, h: 7 }, limites: { minW: 4, maxW: 12, minH: 6, maxH: 12 } },
  { id: 'prazos', grupo: 'prazo', icone: 'i-lucide-hourglass', padrao: { w: 5, h: 7 }, limites: { minW: 3, maxW: 12, minH: 6, maxH: 12 } },
  { id: 'serie', grupo: 'volume', icone: 'i-lucide-chart-column', padrao: { w: 8, h: 7 }, limites: { minW: 4, maxW: 12, minH: 5, maxH: 12 } },
  { id: 'proximas', grupo: 'prazo', icone: 'i-lucide-calendar-clock', padrao: { w: 4, h: 7 }, limites: { minW: 3, maxW: 12, minH: 4, maxH: 16 } },
  { id: 'responsaveis', grupo: 'pessoas', icone: 'i-lucide-users', padrao: { w: 8, h: 8 }, limites: { minW: 5, maxW: 12, minH: 4, maxH: 16 } },
  { id: 'status', grupo: 'volume', icone: 'i-lucide-chart-bar-stacked', padrao: { w: 4, h: 8 }, limites: { minW: 3, maxW: 12, minH: 6, maxH: 12 } },
  { id: 'tempoTarefa', grupo: 'tempos', icone: 'i-lucide-square-check', padrao: { w: 12, h: 8 }, limites: { minW: 6, maxW: 12, minH: 4, maxH: 16 } },
  { id: 'tempoEtapa', grupo: 'tempos', icone: 'i-lucide-columns-3', padrao: { w: 7, h: 9 }, limites: { minW: 4, maxW: 12, minH: 5, maxH: 16 } },
  { id: 'tempoFluxo', grupo: 'tempos', icone: 'i-lucide-workflow', padrao: { w: 5, h: 9 }, limites: { minW: 4, maxW: 12, minH: 5, maxH: 16 } },
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
const CHAVE = 'enspace-prototipos:painel-de-tarefas:layout:v1'

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
