/**
 * Número, moeda e cor dos gráficos. O valor sai formatado no idioma da tela; a moeda
 * do workspace (real) não muda com o idioma.
 */
import type { Funcao } from './agregacao'
import { OUTROS, VAZIO } from './agregacao'

export function formatarValor(v: number, opcoes: { locale: string, moeda: boolean, funcao: Funcao, compacto?: boolean }): string {
  const { locale, moeda, funcao, compacto } = opcoes
  const inteiro = funcao === 'contagem' || funcao === 'distintos'
  if (moeda && !inteiro) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BRL',
      notation: compacto && Math.abs(v) >= 100_000 ? 'compact' : 'standard',
      maximumFractionDigits: compacto && Math.abs(v) >= 100_000 ? 1 : 0,
    }).format(v)
  }
  return new Intl.NumberFormat(locale, {
    notation: compacto && Math.abs(v) >= 100_000 ? 'compact' : 'standard',
    maximumFractionDigits: inteiro ? 0 : 1,
  }).format(v)
}

export function porcentagem(v: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 0 }).format(v)
}

/**
 * Paleta das séries, só com tokens do tema (regra 6). O SDK define 4
 * (`--vis-series-1..4`); a divisão por Unidade pede 5 ou mais, então a lista
 * segue com os tons da mesma família.
 */
const PALETA = [
  'var(--ui-color-primary-500)',
  'var(--ui-color-secondary-500)',
  'var(--ui-color-warning-500)',
  'var(--ui-color-success-600)',
  'var(--ui-color-error-400)',
  'var(--ui-color-primary-300)',
  'var(--ui-color-secondary-300)',
  'var(--ui-color-warning-300)',
]

export function corDaSerie(chave: string, indice: number): string {
  if (chave === VAZIO) return 'var(--ui-color-neutral-300)'
  if (chave === OUTROS) return 'var(--ui-color-neutral-400)'
  return PALETA[indice % PALETA.length]!
}
