/**
 * Regras de data do protótipo: formato, período, atraso e a RN004.
 * Datas em `AAAA-MM-DD`, comparadas como texto (a ordem do texto é a ordem da data).
 */
import type { Idioma } from '~/composables/useIdioma'
import { HOJE } from './mocks'
import type { TarefaRapida } from './mocks'

export type Periodo = 'todos' | 'hoje' | 'semana' | 'mes'
export type CampoDeData = 'criado' | 'prazo' | 'prazoFinal'

/** Filtro de uma coluna de data da tabela (RF012). */
export interface FiltroDeColuna { de: string | null, ate: string | null }

export function formatar(data: string | null, idioma: Idioma): string {
  if (!data) return ''
  const [a, m, d] = data.split('-').map(Number) as [number, number, number]
  return new Intl.DateTimeFormat(idioma, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(a, m - 1, d)))
}

function somarDias(data: string, dias: number): string {
  const [a, m, d] = data.split('-').map(Number) as [number, number, number]
  return new Date(Date.UTC(a, m - 1, d + dias)).toISOString().slice(0, 10)
}

/** Semana de domingo a sábado, como o calendário do produto. */
export function noPeriodo(data: string | null, periodo: Periodo): boolean {
  if (periodo === 'todos') return true
  if (!data) return false
  if (periodo === 'hoje') return data === HOJE
  if (periodo === 'mes') return data.slice(0, 7) === HOJE.slice(0, 7)
  const dia = new Date(`${HOJE}T00:00:00Z`).getUTCDay()
  const inicio = somarDias(HOJE, -dia)
  return data >= inicio && data <= somarDias(inicio, 6)
}

/** RN005: o atraso conta só pelo vencimento. */
export function atrasada(t: TarefaRapida): boolean {
  return t.status !== 'completed' && !!t.due_date && t.due_date < HOJE
}

/**
 * RN006 (proposta da rodada 4): o prazo final vencido. Tarefa não concluída
 * cujo prazo final já passou. Pela RN004, ela também está atrasada; este
 * estado toma o lugar do "Atrasada" onde o selo aparece.
 */
export function prazoFinalVencido(t: TarefaRapida): boolean {
  return t.status !== 'completed' && !!t.final_due_date && t.final_due_date < HOJE
}

/** RN004: prazo final igual ou posterior ao vencimento. Sem uma das datas, não há o que comparar. */
export function ordemValida(prazo: string | null, prazoFinal: string | null): boolean {
  return !prazo || !prazoFinal || prazoFinal >= prazo
}

/** Data de criação fictícia, derivada do id, só para o filtro "Criado em" funcionar. */
export function criadoEm(t: TarefaRapida): string {
  return somarDias(HOJE, -((t.id % 9) + 1))
}
