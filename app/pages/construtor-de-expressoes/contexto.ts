/**
 * O que o construtor compartilha com cada bloco (provide/inject), para a árvore
 * recursiva não passar 8 props de bloco em bloco.
 */
import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { CampoDaCategoria, Modo, No } from './arvore'
import type { Textos } from './textos'

export interface ContextoDoConstrutor {
  t: ComputedRef<Textos>
  modo: ComputedRef<Modo>
  campos: CampoDaCategoria[]
  passos: ComputedRef<string[]>
  /** Troca o nó `id` por `novo` em qualquer lugar da expressão. */
  trocar: (id: string, novo: No) => void
  /** Troca o nó por uma lacuna do mesmo tipo. */
  remover: (id: string) => void
  /** O bloco que o painel "Para conferir" mandou mostrar. */
  destacado: Ref<string | null>
  /** A lacuna cujo seletor deve abrir sozinho (depois de "Trocar"). */
  abrirSeletor: Ref<string | null>
  irParaTexto: () => void
}

export const CONSTRUTOR: InjectionKey<ContextoDoConstrutor> = Symbol('construtor')
