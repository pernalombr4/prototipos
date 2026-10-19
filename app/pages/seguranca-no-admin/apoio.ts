/**
 * Funções puras do protótipo: data, número e a avaliação da lista de destinos.
 * Nada aqui chama rede.
 */
import type { Idioma } from '~/composables/useIdioma'
import { AGORA } from './mocks'
import type { RegraDeDestino } from './mocks'

export function dataHora(d: Date | string | null | undefined, idioma: Idioma) {
  if (!d) return ''
  return new Intl.DateTimeFormat(idioma, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(d))
}

export function data(d: Date | string | null | undefined, idioma: Idioma) {
  if (!d) return ''
  return new Intl.DateTimeFormat(idioma, { dateStyle: 'short' }).format(new Date(d))
}

/** "há 3 min", "em 10 dias": relativo ao AGORA fixo do protótipo. */
export function relativo(d: Date | string | null | undefined, idioma: Idioma) {
  if (!d) return ''
  const diff = new Date(d).getTime() - AGORA.getTime()
  const abs = Math.abs(diff)
  const rtf = new Intl.RelativeTimeFormat(idioma, { numeric: 'auto', style: 'short' })
  if (abs < 60_000) return rtf.format(Math.round(diff / 1000), 'second')
  if (abs < 3_600_000) return rtf.format(Math.round(diff / 60_000), 'minute')
  if (abs < 86_400_000) return rtf.format(Math.round(diff / 3_600_000), 'hour')
  if (abs < 60 * 86_400_000) return rtf.format(Math.round(diff / 86_400_000), 'day')
  return rtf.format(Math.round(diff / (30 * 86_400_000)), 'month')
}

export function numero(n: number, idioma: Idioma) {
  return new Intl.NumberFormat(idioma).format(n)
}

export function diasAte(d: Date | string | null | undefined) {
  if (!d) return Infinity
  return Math.round((new Date(d).getTime() - AGORA.getTime()) / 86_400_000)
}

/* ------------------------------------------------------------------ *
 * Destinos de saída                                                   *
 * ------------------------------------------------------------------ */

export type ModoDeDestino = 'todos' | 'registrar' | 'lista'

/** Faixas que nunca saem: rede interna, loopback e o endereço de metadados da nuvem. */
const REDE_INTERNA = [/^10\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./, /^127\./, /^169\.254\./, /^localhost$/, /^0\.0\.0\.0$/]

function globParaRegex(glob: string) {
  const esc = glob.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
  return new RegExp(`^${esc}$`, 'i')
}

/** A URL pode ter variável do fluxo ({{item.cnpj}}): o teste preenche com um valor qualquer, como a execução faria. */
export function normalizarUrl(url: string) {
  const preenchida = url.trim().replace(/\{\{[^}]+\}\}/g, '00000000000191')
  try {
    return new URL(/^https?:\/\//i.test(preenchida) ? preenchida : `https://${preenchida}`)
  }
  catch {
    return null
  }
}

export function regraCasa(regra: Pick<RegraDeDestino, 'padrao'>, url: URL) {
  const p = regra.padrao.trim()
  if (/^https?:\/\//i.test(p)) return globParaRegex(p).test(`${url.protocol}//${url.host}${url.pathname}`)
  /* "*.empresa.com" vale também para "empresa.com", como esperam as allowlists de mercado. */
  return globParaRegex(p).test(url.hostname) || (p.startsWith('*.') && globParaRegex(p.slice(2)).test(url.hostname))
}

export type Avaliacao =
  | { resultado: 'invalida' }
  | { resultado: 'interna' }
  | { resultado: 'permitido' | 'bloqueado' | 'registrado', regra: number | null }

/**
 * Primeira regra que casa decide. Sem regra: "todo o resto" decide pelo modo.
 * "Só registrar" nunca bloqueia: marca o que seria bloqueado.
 */
export function avaliar(urlBruta: string, regras: RegraDeDestino[], modo: ModoDeDestino): Avaliacao {
  const url = normalizarUrl(urlBruta)
  if (!url) return { resultado: 'invalida' }
  if (REDE_INTERNA.some(r => r.test(url.hostname))) return { resultado: 'interna' }
  if (modo === 'todos') return { resultado: 'permitido', regra: null }
  const i = regras.findIndex(r => regraCasa(r, url))
  const acao = i >= 0 ? regras[i]!.acao : 'bloquear'
  if (acao === 'permitir') return { resultado: 'permitido', regra: i >= 0 ? i : null }
  return { resultado: modo === 'registrar' ? 'registrado' : 'bloqueado', regra: i >= 0 ? i : null }
}
