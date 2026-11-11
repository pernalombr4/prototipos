/**
 * Datas, horas e valores no idioma da tela. Nada concatenado no template:
 * é onde a tradução quebra primeiro.
 */
import { AGORA, DIA } from './mocks'
import type { TarefaDaHome } from './mocks'
import type { Textos } from './textos'

export type AbaDeTarefa = 'atraso' | 'hoje' | 'proximas' | 'semPrazo'

/** Começo do dia de hoje em Brasília (UTC-3). */
function inicioDoDia(d: Date) {
  const x = new Date(d.getTime() - 3 * 3_600_000)
  x.setUTCHours(0, 0, 0, 0)
  return x.getTime() + 3 * 3_600_000
}

const HOJE = inicioDoDia(AGORA)

/** Em qual aba a tarefa aberta cai. "Próximas" são os 7 dias depois de hoje. */
export function abaDa(tarefa: TarefaDaHome): AbaDeTarefa | null {
  if (!tarefa.due_date) return 'semPrazo'
  const t = tarefa.due_date.getTime()
  if (t < AGORA.getTime()) return 'atraso'
  if (t < HOJE + DIA) return 'hoje'
  if (t < HOJE + 8 * DIA) return 'proximas'
  return null
}

export function hora(d: Date, t: Textos) {
  return new Intl.DateTimeFormat(t.locale, { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(d)
}

export function dataLonga(d: Date, t: Textos) {
  const s = new Intl.DateTimeFormat(t.locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo' }).format(d)
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function dataCurta(d: Date | number, t: Textos) {
  return new Intl.DateTimeFormat(t.locale, { day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo' }).format(d)
}

/** O prazo da tarefa como a pessoa lê: "Venceu há 2 dias", "Hoje, 16:00", "Em 3 dias". */
export function prazoDaTarefa(tarefa: TarefaDaHome, t: Textos) {
  if (!tarefa.due_date) return t.tarefas.semPrazo
  const d = tarefa.due_date
  const dias = Math.round((inicioDoDia(d) - HOJE) / DIA)
  if (d.getTime() < AGORA.getTime()) return t.tarefas.venceuHa(-dias)
  if (dias === 0) return t.tarefas.hojeAs(hora(d, t))
  if (dias <= 7) return t.tarefas.emDias(dias)
  return dataCurta(d, t)
}

export function dinheiro(v: number, t: Textos) {
  return new Intl.NumberFormat(t.locale, { style: 'currency', currency: 'BRL' }).format(v)
}

export function horaAtual() {
  return Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'America/Sao_Paulo' }).format(AGORA))
}

export { HOJE }
