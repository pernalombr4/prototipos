/**
 * Formatação de data e dinheiro no idioma da tela. As datas do módulo são o dia do tribunal (`AAAA-MM-DD`), sem
 * fuso: formatar em UTC evita que o dia mude no relógio de quem lê.
 */
import { paraData } from './prazos'

export function dia(d: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(paraData(d))
}
export function diaCurto(d: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(paraData(d))
}
export function diaComSemana(d: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(paraData(d))
}
export function semana(d: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(paraData(d))
}
export function dataHora(d: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d)
}
export function dinheiro(v: number, locale: string, compacto = false) {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL', maximumFractionDigits: compacto ? 1 : 0, notation: compacto ? 'compact' : 'standard' }).format(v)
}
/** "26/10 09:02": a hora em que a captura chegou ou a fonte rodou. */
export function diaHoraCurto(d: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d)
}
