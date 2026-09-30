/**
 * Número, porcentagem, data e duração no idioma da tela.
 * Nada é concatenado no template: é onde a tradução quebra primeiro.
 */
import { HORA } from './metricas'
import type { Textos } from './textos'

const FUSO_BRASILIA = 'America/Sao_Paulo'

export function numero(n: number, t: Textos) {
  return n.toLocaleString(t.locale)
}

export function porcentagem(x: number | null, t: Textos) {
  if (x === null) return '-'
  return (x).toLocaleString(t.locale, { style: 'percent', maximumFractionDigits: 0 })
}

/** "2 d 4 h", "5 h 20 min", "12 min". Duas unidades no máximo: é o que se lê de relance. */
export function duracao(ms: number | null, t: Textos) {
  if (ms === null || !Number.isFinite(ms)) return '-'
  const u = t.unidades
  const abs = Math.abs(ms)
  if (abs < 60_000) return u.menosDeUmMin
  // Arredonda uma vez, na unidade menor, e só depois divide: assim "7 d 24 h"
  // vira "8 d" e "3 h 60 min" vira "4 h".
  const minutos = Math.round(abs / 60_000)
  if (minutos < 24 * 60) {
    const h = Math.floor(minutos / 60)
    const m = minutos - h * 60
    if (!h) return `${m} ${u.min}`
    return m ? `${h} ${u.h} ${m} ${u.min}` : `${h} ${u.h}`
  }
  const horas = Math.round(abs / HORA)
  const d = Math.floor(horas / 24)
  const h = horas - d * 24
  return h ? `${d} ${u.d} ${h} ${u.h}` : `${d} ${u.d}`
}

export function dataCurta(ms: number, t: Textos) {
  return new Date(ms).toLocaleDateString(t.locale, { day: '2-digit', month: 'short', timeZone: FUSO_BRASILIA })
}

export function mesCurto(ms: number, t: Textos) {
  return new Date(ms).toLocaleDateString(t.locale, { month: 'short', year: '2-digit', timeZone: FUSO_BRASILIA })
}

export function ano(ms: number, t: Textos) {
  return new Date(ms).toLocaleDateString(t.locale, { year: 'numeric', timeZone: FUSO_BRASILIA })
}

export function dataHora(ms: number | null, t: Textos) {
  if (ms === null) return '-'
  return new Date(ms).toLocaleString(t.locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: FUSO_BRASILIA })
}

export function hora(ms: number, t: Textos) {
  return new Date(ms).toLocaleTimeString(t.locale, { hour: '2-digit', minute: '2-digit', timeZone: FUSO_BRASILIA })
}
