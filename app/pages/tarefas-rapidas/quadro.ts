/**
 * As regras do quadro, fora do componente: agrupar, ordenar, calcular e ler prazo.
 *
 * Tudo roda em memória, sobre o array do `mocks.ts`. Nenhuma chamada de rede
 * (regra 4). O que muda aqui é o que o back precisaria passar a aceitar em
 * `GET /tasks`: `_sort`, `status`, `priority`, `assigned_to`, `points_gte`.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import type { EnKanbanColorScheme } from '@be-enlighten/enspace-sdk-ui/base'
import { etiquetas, hoje, pessoas } from './mocks'
import type { Textos } from './textos'

/* ----------------------------- agrupamento ----------------------------- */

/** Campos que o quadro aceita como raia. O produto hoje só aceita os três primeiros. */
export type ChaveAgrupamento = 'status' | 'priority' | 'assigned_to' | 'type' | 'due_date'

export interface DefinicaoDeRaia {
  valor: string
  rotulo: string
  cor: EnKanbanColorScheme
  icone: string
}

export const ordemStatus: Task['status'][] = ['pending', 'working', 'blocked', 'completed']
export const ordemPrioridade: Task['priority'][] = ['urgent', 'high', 'normal', 'low']

const corDoStatus: Record<Task['status'], EnKanbanColorScheme> = {
  pending: 'info',
  working: 'warning',
  blocked: 'error',
  completed: 'success',
}

const iconeDoStatus: Record<Task['status'], string> = {
  pending: 'i-lucide-circle-dashed',
  working: 'i-lucide-circle-dot-dashed',
  blocked: 'i-lucide-circle-pause',
  completed: 'i-lucide-circle-check',
}

export const corDaPrioridade: Record<Task['priority'], EnKanbanColorScheme> = {
  urgent: 'error',
  high: 'warning',
  normal: 'neutral',
  low: 'info',
}

export const iconeDaPrioridade: Record<Task['priority'], string> = {
  urgent: 'i-lucide-chevrons-up',
  high: 'i-lucide-chevron-up',
  normal: 'i-lucide-minus',
  low: 'i-lucide-chevron-down',
}

export const iconeDoTipo: Record<Task['type'], string> = {
  crud: 'i-lucide-square-pen',
  form: 'i-lucide-clipboard-list',
  generic: 'i-lucide-circle-small',
  approval: 'i-lucide-gavel',
  start: 'i-lucide-play',
}

/** Monta as raias do agrupamento escolhido, na ordem em que aparecem. */
export function raiasDoAgrupamento(chave: ChaveAgrupamento, t: Textos): DefinicaoDeRaia[] {
  if (chave === 'status') {
    return ordemStatus.map(s => ({
      valor: s,
      rotulo: t.status[s],
      cor: corDoStatus[s],
      icone: iconeDoStatus[s],
    }))
  }
  if (chave === 'priority') {
    return ordemPrioridade.map(p => ({
      valor: p,
      rotulo: t.prioridade[p],
      cor: corDaPrioridade[p],
      icone: iconeDaPrioridade[p],
    }))
  }
  if (chave === 'type') {
    return (['crud', 'form', 'generic', 'approval'] as Task['type'][]).map(tp => ({
      valor: tp,
      rotulo: t.tipo[tp],
      cor: 'neutral' as EnKanbanColorScheme,
      icone: iconeDoTipo[tp],
    }))
  }
  if (chave === 'assigned_to') {
    const lista: DefinicaoDeRaia[] = Object.values(pessoas).map(p => ({
      valor: String(p.id),
      rotulo: p.fullname,
      cor: 'primary' as EnKanbanColorScheme,
      icone: 'i-lucide-user',
    }))
    lista.push({ valor: 'sem', rotulo: t.semResponsavel, cor: 'neutral', icone: 'i-lucide-user-x' })
    return lista
  }
  // due_date: faixas de prazo, que é o agrupamento que o produto não tem hoje.
  return [
    { valor: 'atrasada', rotulo: t.calculos.atrasadas, cor: 'error', icone: 'i-lucide-alarm-clock' },
    { valor: 'hoje', rotulo: t.venceHoje, cor: 'warning', icone: 'i-lucide-calendar-clock' },
    { valor: 'semana', rotulo: t.venceEmDias(7), cor: 'info', icone: 'i-lucide-calendar-days' },
    { valor: 'depois', rotulo: t.venceEmDias(30), cor: 'neutral', icone: 'i-lucide-calendar' },
    { valor: 'sem', rotulo: t.semPrazo, cor: 'neutral', icone: 'i-lucide-calendar-off' },
  ]
}

/** Em que raia a tarefa cai, dado o agrupamento. */
export function raiaDaTarefa(tarefa: Task, chave: ChaveAgrupamento): string {
  if (chave === 'status') return tarefa.status
  if (chave === 'priority') return tarefa.priority
  if (chave === 'type') return tarefa.type
  if (chave === 'assigned_to') return tarefa.assigned_to ? String(tarefa.assigned_to) : 'sem'
  const dias = diasAteOPrazo(tarefa)
  if (dias === null) return 'sem'
  if (dias < 0) return 'atrasada'
  if (dias === 0) return 'hoje'
  if (dias <= 7) return 'semana'
  return 'depois'
}

/* ------------------------------ ordenação ------------------------------ */

export type ChaveOrdenacao =
  | 'due_date' | 'priority' | 'points' | 'created_at' | 'updated_at' | 'name'

export const ordenacoes: { valor: ChaveOrdenacao, rotulo: keyof Textos['campos'] }[] = [
  { valor: 'due_date', rotulo: 'prazo' },
  { valor: 'priority', rotulo: 'prioridade' },
  { valor: 'points', rotulo: 'pontos' },
  { valor: 'created_at', rotulo: 'criadoEm' },
  { valor: 'updated_at', rotulo: 'atualizadoEm' },
  { valor: 'name', rotulo: 'nome' },
]

const pesoDaPrioridade: Record<Task['priority'], number> = { urgent: 0, high: 1, normal: 2, low: 3 }

export function compararTarefas(a: Task, b: Task, chave: ChaveOrdenacao, desc: boolean): number {
  let r = 0
  switch (chave) {
    case 'due_date': {
      const da = a.due_date ? new Date(a.due_date).getTime() : Number.POSITIVE_INFINITY
      const db = b.due_date ? new Date(b.due_date).getTime() : Number.POSITIVE_INFINITY
      r = da - db
      break
    }
    case 'priority':
      r = pesoDaPrioridade[a.priority] - pesoDaPrioridade[b.priority]
      break
    case 'points':
      r = (b.points ?? 0) - (a.points ?? 0)
      break
    case 'created_at':
      r = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      break
    case 'updated_at':
      r = new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      break
    case 'name':
      r = a.name.localeCompare(b.name, 'pt-BR')
      break
  }
  return desc ? -r : r
}

/* -------------------------------- prazo -------------------------------- */

/** Dias inteiros até o prazo. Negativo quer dizer atrasada. `null` é sem prazo. */
export function diasAteOPrazo(tarefa: Task, referencia: Date = hoje): number | null {
  if (!tarefa.due_date) return null
  const prazo = new Date(tarefa.due_date)
  const a = Date.UTC(prazo.getUTCFullYear(), prazo.getUTCMonth(), prazo.getUTCDate())
  const b = Date.UTC(referencia.getUTCFullYear(), referencia.getUTCMonth(), referencia.getUTCDate())
  return Math.round((a - b) / 86_400_000)
}

export function estaAtrasada(tarefa: Task, referencia: Date = hoje): boolean {
  if (tarefa.status === 'completed') return false
  const dias = diasAteOPrazo(tarefa, referencia)
  return dias !== null && dias < 0
}

export interface PrazoLegivel {
  texto: string
  cor: 'error' | 'warning' | 'neutral'
  urgente: boolean
}

export function prazoLegivel(tarefa: Task, t: Textos): PrazoLegivel {
  const dias = diasAteOPrazo(tarefa)
  if (dias === null) return { texto: t.semPrazo, cor: 'neutral', urgente: false }
  if (tarefa.status === 'completed') {
    return { texto: formatarData(tarefa.due_date as Date), cor: 'neutral', urgente: false }
  }
  if (dias < 0) return { texto: t.atrasadaDias(Math.abs(dias)), cor: 'error', urgente: true }
  if (dias === 0) return { texto: t.venceHoje, cor: 'warning', urgente: true }
  if (dias === 1) return { texto: t.venceAmanha, cor: 'warning', urgente: false }
  if (dias <= 7) return { texto: t.venceEmDias(dias), cor: 'neutral', urgente: false }
  return { texto: formatarData(tarefa.due_date as Date), cor: 'neutral', urgente: false }
}

export function formatarData(data: Date | string | null | undefined): string {
  if (!data) return ''
  const d = new Date(data)
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
}

export function formatarDataHora(data: Date | string | null | undefined): string {
  if (!data) return ''
  const d = new Date(data)
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  return `${formatarData(d)}, ${hh}:${mm}`
}

/* ----------------------------- calculadora ----------------------------- */

export type Calculo =
  | 'contagem' | 'somaPontos' | 'mediaPontos' | 'maiorPontuacao'
  | 'atrasadas' | 'semResponsavel' | 'prazoMaisProximo' | 'nenhum'

export const calculosDisponiveis: Calculo[] = [
  'contagem', 'somaPontos', 'mediaPontos', 'maiorPontuacao',
  'atrasadas', 'semResponsavel', 'prazoMaisProximo', 'nenhum',
]

export interface ResultadoDoCalculo {
  valor: string
  /** Quando o número merece atenção, o rodapé acende. */
  alerta: boolean
}

export function calcular(tarefas: Task[], calculo: Calculo, t: Textos): ResultadoDoCalculo {
  if (calculo === 'nenhum' || !tarefas.length) {
    return { valor: calculo === 'nenhum' ? '' : '0', alerta: false }
  }
  switch (calculo) {
    case 'contagem':
      return { valor: String(tarefas.length), alerta: false }
    case 'somaPontos':
      return { valor: String(tarefas.reduce((s, x) => s + (x.points ?? 0), 0)), alerta: false }
    case 'mediaPontos': {
      const media = tarefas.reduce((s, x) => s + (x.points ?? 0), 0) / tarefas.length
      return { valor: media.toFixed(1).replace('.', ','), alerta: false }
    }
    case 'maiorPontuacao':
      return { valor: String(Math.max(...tarefas.map(x => x.points ?? 0))), alerta: false }
    case 'atrasadas': {
      const n = tarefas.filter(x => estaAtrasada(x)).length
      return { valor: String(n), alerta: n > 0 }
    }
    case 'semResponsavel': {
      const n = tarefas.filter(x => !x.assigned_to).length
      return { valor: String(n), alerta: n > 0 }
    }
    case 'prazoMaisProximo': {
      const comPrazo = tarefas
        .filter(x => x.due_date && x.status !== 'completed')
        .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
      const primeira = comPrazo[0]
      if (!primeira) return { valor: t.semPrazo, alerta: false }
      return { valor: formatarData(primeira.due_date as Date), alerta: estaAtrasada(primeira) }
    }
    default:
      return { valor: '', alerta: false }
  }
}

/* ------------------------------- auxiliares ------------------------------- */

/** A descrição chega em HTML. No cartão ela vira texto puro, de uma linha. */
export function descricaoEmTexto(html: string | null | undefined): string {
  if (!html) return ''
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

/** A referência tem 32 caracteres. Ninguém lê 32 caracteres num cartão. */
export function referenciaCurta(reference: string): string {
  return reference.slice(0, 6).toUpperCase()
}

export function etiquetasDaTarefa(tarefa: Task) {
  const ids = Array.isArray(tarefa.tag_ids) ? tarefa.tag_ids as number[] : []
  return ids.map(id => etiquetas[id]).filter(Boolean)
}
