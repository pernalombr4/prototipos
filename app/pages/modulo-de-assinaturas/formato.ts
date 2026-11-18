/**
 * Datas no idioma da tela. Toda data do módulo leva a hora (M27): o envelope vence e é assinado numa hora, não num dia.
 * O fuso é o de São Paulo, o do workspace fictício, para o print sair igual em qualquer máquina.
 */
import { HOJE } from './mocks'

const FUSO = 'America/Sao_Paulo'

export function dataHora(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: FUSO }).format(new Date(iso))
}
export function dataHoraCurta(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: FUSO }).format(new Date(iso))
}
export function hora(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: FUSO }).format(new Date(iso))
}
export function data(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: FUSO }).format(new Date(iso))
}
/** Minutos entre a data e o "agora" do protótipo. */
export function minutosDesde(iso: string) {
  return Math.max(0, Math.round((new Date(HOJE).getTime() - new Date(iso).getTime()) / 60000))
}
export function diasDesde(iso: string) {
  return Math.floor(minutosDesde(iso) / 1440)
}
export function diasAte(iso: string) {
  return (new Date(iso).getTime() - new Date(HOJE).getTime()) / 86400000
}
