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

/*
 * Telefone (rodada 11). Cópia das regras do protótipo comunicacao-no-workspace
 * (`estado.ts`: `numeroDoWhatsApp`, `linkDeWhatsApp`, `linkDeSms`,
 * `ehTelefoneFixo`, `telefoneLegivel`), para o widget WhatsApp e SMS da Home
 * julgar o número igual às outras telas.
 */

/** Só os dígitos, com 55 quando vier sem país (10 ou 11 dígitos). Menos de 10: nulo. */
export function numeroDoTelefone(telefone: string | null | undefined) {
  if (!telefone) return null
  const d = telefone.replace(/\D/g, '').replace(/^0+/, '')
  if (d.length < 10) return null
  return d.length <= 11 ? `55${d}` : d
}

/** `wa.me/<número>?text=`; sem número, a pessoa escolhe a conversa. */
export function linkDeWhatsApp(telefone: string | null, texto?: string) {
  const n = numeroDoTelefone(telefone)
  const base = n ? `https://wa.me/${n}` : 'https://wa.me/'
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}

/** `sms:+<número>?body=` (RFC 5724); sem número, a pessoa escolhe para quem. */
export function linkDeSms(telefone: string | null, texto?: string) {
  const n = numeroDoTelefone(telefone)
  const base = n ? `sms:+${n}` : 'sms:'
  return texto ? `${base}?body=${encodeURIComponent(texto)}` : base
}

/** Telefone fixo do Brasil (DDD e 8 dígitos): não recebe SMS. */
export function ehTelefoneFixo(telefone: string | null | undefined) {
  const n = numeroDoTelefone(telefone)
  return !!n && n.startsWith('55') && n.length === 12
}

/** O número para ler: +55 11 98765-4321. */
export function telefoneLegivel(telefone: string | null | undefined) {
  const n = numeroDoTelefone(telefone)
  if (!n) return telefone ?? ''
  if (!n.startsWith('55')) return `+${n}`
  const d = n.slice(2)
  const resto = d.slice(2)
  const corte = resto.length - 4
  return `+55 ${d.slice(0, 2)} ${resto.slice(0, corte)}-${resto.slice(corte)}`
}
