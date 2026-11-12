/**
 * Rodada 6: as contas de tempo e de data da tarefa. Duração em minutos,
 * escrita como no ClickUp ("3h 20m"); 1 dia vale 8 horas.
 */
import type { TarefaDoItem } from './mocks'

/** "3h 20m", "1,5h", "90m", "2d" ou só o número (horas). Devolve minutos, ou null se não entende. */
export function lerDuracao(texto: string): number | null {
  const s = texto.trim().toLowerCase().replace(/,/g, '.')
  if (!s) return null
  if (/^\d+(\.\d+)?$/.test(s)) return Math.round(Number.parseFloat(s) * 60) || null
  const re = /(\d+(?:\.\d+)?)\s*(d|h|min|m)/g
  let total = 0
  for (const [, n, u] of s.matchAll(re)) {
    const v = Number.parseFloat(n!)
    total += u === 'd' ? v * 480 : u === 'h' ? v * 60 : v
  }
  if (s.replace(re, '').trim()) return null
  return Math.round(total) || null
}

/** 150 vira "2h 30m"; 45 vira "45m"; 0 vira "0m". */
export function duracao(min: number) {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (!h) return `${m}m`
  return m ? `${h}h ${m}m` : `${h}h`
}

/** O cronômetro: 0:12:05. */
export function relogio(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const p = (n: number) => String(n).padStart(2, '0')
  return `${Math.floor(s / 3600)}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`
}

export const minutosDe = (x: TarefaDoItem) => (x.registros ?? []).reduce((a, r) => a + r.minutos, 0)

/* ---------- datas ---------- */

export const mesmoDia = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
/** Data e hora juntas: a data de `dia` com a hora de `hora` (18:00 sem hora). */
export function comHora(dia: Date, hora?: Date | null) {
  const d = new Date(dia)
  d.setHours(hora ? hora.getHours() : 18, hora ? hora.getMinutes() : 0, 0, 0)
  return d
}
const somar = (d: Date, n: number) => {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

/** Os atalhos do seletor de datas, como no ClickUp, contados a partir de hoje. */
export function atalhosDeData(hoje: Date) {
  const sabado = somar(hoje, (6 - hoje.getDay() + 7) % 7)
  const segunda = somar(hoje, ((8 - hoje.getDay()) % 7) || 7)
  return [
    { id: 'hoje', data: hoje, dia: true },
    { id: 'amanha', data: somar(hoje, 1), dia: true },
    { id: 'fimDeSemana', data: sabado, dia: true },
    { id: 'proximaSemana', data: segunda, dia: true },
    { id: 'proximoFimDeSemana', data: somar(sabado, 7), dia: false },
    { id: 'duasSemanas', data: somar(hoje, 14), dia: false },
    { id: 'quatroSemanas', data: somar(hoje, 28), dia: false },
  ]
}
