/**
 * A regra do filtro de coluna (`_FiltroDeColuna.vue`), usada por todas as tabelas da central.
 *
 * A chave segue a da API: `<campo>_<operador>`. Texto: "eq", "ne", "contains", "ncontains" e as
 * variantes que diferenciam maiúsculas ("containss", "ncontainss"). Seleção: "in", com a lista
 * dos valores marcados; a célula vazia ("-") entra como `SEM_VALOR`.
 */
import type { Filtros } from './_FiltroDeColuna.vue'

export const SEM_VALOR = '__sem__'

export function passaNosFiltros(filtros: Filtros, valor: (campo: string) => string) {
  return Object.entries(filtros).every(([chave, alvo]) => {
    const i = chave.lastIndexOf('_')
    const campo = chave.slice(0, i)
    const op = chave.slice(i + 1)
    const v = valor(campo)
    if (Array.isArray(alvo)) return alvo.includes(v || SEM_VALOR)
    const a = v.toLowerCase()
    const b = alvo.toLowerCase()
    switch (op) {
      case 'eq': return a === b
      case 'ne': return a !== b
      case 'contains': return a.includes(b)
      case 'ncontains': return !a.includes(b)
      case 'containss': return v.includes(alvo)
      case 'ncontainss': return !v.includes(alvo)
      default: return true
    }
  })
}

/** Tira os filtros das colunas que saíram da tabela. */
export function semAsColunas(filtros: Filtros, campos: string[]): Filtros {
  return Object.fromEntries(Object.entries(filtros).filter(([k]) => !campos.some(c => k.startsWith(`${c}_`))))
}
