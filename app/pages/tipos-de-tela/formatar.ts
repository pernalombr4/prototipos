/** Número, moeda e data no idioma da tela. Nunca concatenados no template. */
import type { Idioma } from '../../composables/useIdioma'

export function moeda(v: number | null | undefined, idioma: Idioma) {
  if (v === null || v === undefined) return ''
  return new Intl.NumberFormat(idioma, { style: 'currency', currency: 'BRL' }).format(v)
}

export function numero(v: number, idioma: Idioma) {
  return new Intl.NumberFormat(idioma).format(v)
}

export function dataCurta(d: Date | null | undefined, idioma: Idioma) {
  if (!d) return ''
  return new Intl.DateTimeFormat(idioma, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
}

export function dataEHora(d: Date | null | undefined, idioma: Idioma) {
  if (!d) return ''
  return new Intl.DateTimeFormat(idioma, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}

export function mesCurto(mes: number, idioma: Idioma) {
  return new Intl.DateTimeFormat(idioma, { month: 'short' }).format(new Date(2026, mes, 1)).replace('.', '')
}

export function tamanho(kb: number, idioma: Idioma) {
  if (kb < 1024) return `${numero(kb, idioma)} KB`
  return `${new Intl.NumberFormat(idioma, { maximumFractionDigits: 1 }).format(kb / 1024)} MB`
}

/** "há 3 dias", "hoje", "em 2 dias", pelo Intl, no idioma certo. */
export function relativo(d: Date, hoje: Date, idioma: Idioma) {
  const dias = Math.round((d.getTime() - hoje.getTime()) / 86_400_000)
  return new Intl.RelativeTimeFormat(idioma, { numeric: 'auto' }).format(dias, 'day')
}
