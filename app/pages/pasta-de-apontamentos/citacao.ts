/**
 * A citação com #, como a referência cruzada do GitHub: quem escreve digita #,
 * escolhe uma tarefa, o item ou outro apontamento, e o citado ganha a linha
 * "Mencionada em". O `index.vue` fornece o contexto; o campo e o detalhe usam.
 * Tudo em memória.
 */
import type { ComputedRef, InjectionKey } from 'vue'
import type { Citacao } from './mocks'

export interface Citavel extends Citacao {
  /** Linha cinza da sugestão: referência curta ou estado. */
  detalhe?: string
}

export interface ContextoDeCitacao {
  citaveis: ComputedRef<Citavel[]>
  /** Grava o "Mencionada em" no citado. */
  registrar: (alvo: string, onde: string, quem: number) => void
  /** Abre o citado: a tarefa no painel, o item na Visão Geral. */
  abrir: (chave: string) => void
}

export const CHAVE_CITACAO: InjectionKey<ContextoDeCitacao> = Symbol('citacao')

export type Parte = { texto: string } | { citacao: Citacao }

/** Quebra o texto nas citações, para mostrar cada uma como link. */
export function partesDoTexto(texto: string, citacoes: Citacao[] = []): Parte[] {
  if (!citacoes.length) return [{ texto }]
  const marcas = citacoes.map(c => ({ c, alvo: `#${c.rotulo}` }))
  const partes: Parte[] = []
  let resto = texto
  while (resto) {
    let melhor: { i: number, m: typeof marcas[number] } | null = null
    for (const m of marcas) {
      const i = resto.indexOf(m.alvo)
      if (i >= 0 && (!melhor || i < melhor.i)) melhor = { i, m }
    }
    if (!melhor) {
      partes.push({ texto: resto })
      break
    }
    if (melhor.i) partes.push({ texto: resto.slice(0, melhor.i) })
    partes.push({ citacao: melhor.m.c })
    resto = resto.slice(melhor.i + melhor.m.alvo.length)
  }
  return partes
}

export const iconeDaCitacao: Record<Citacao['tipo'], string> = {
  tarefa: 'i-lucide-clipboard-check',
  item: 'i-lucide-file-text',
  apontamento: 'i-lucide-list-checks',
}
