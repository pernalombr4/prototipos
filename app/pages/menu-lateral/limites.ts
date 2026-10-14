/**
 * QUANTOS ITENS UMA SEÇÃO MOSTRA (rodada 19).
 *
 *   "tem que ter como há no notion uma opção de qual o máximo de menus que
 *    mostra dentro de uma seção. a pessoa pode escolher 5, 10, 15, 30...
 *    proponha quantidades factíveis. 'todos' é uma opção também." (Mikaela)
 *
 * As opções são 5, 10, 15, 30 e Todos:
 *   5   é o recorte que Categorias já tinha (rodada 1): cabe com os
 *       favoritos sem rolar, num notebook;
 *   10 e 15  são os degraus do Notion, e 15 é o que cabe numa tela de
 *       900 px com uma seção só aberta;
 *   30  é para quem tem muita coisa e prefere rolar a abrir camada;
 *   Todos  desliga o teto.
 * 20 ficou de fora: entre 15 e 30 ele não muda nada que se perceba.
 *
 * O padrão é 5 em Categorias, que é a lista que cresce sem limite, e Todos
 * nas outras, que nascem curtas. É preferência de quem usa e vale na hora.
 *
 * Cortada, a seção ganha a linha "Mais N", que abre o resto ali mesmo
 * (e "Mostrar menos" volta). Categorias continua com "Ver todas as N", que
 * abre a camada com busca, porque ali a lista pode ter centenas.
 */
import type { ContextMenuItem } from '@nuxt/ui'
import type { TextosDaTela } from './textos'

export type Limite = 5 | 10 | 15 | 30 | 'todos'
export const OPCOES_DE_LIMITE: Limite[] = [5, 10, 15, 30, 'todos']

export function useLimites() {
  const limites = useState<Record<string, Limite>>('limites-de-secao', () => ({ categorias: 5 }))
  /** Seções com "Mais N" aberto agora. Não é preferência: fecha ao recarregar. */
  const abertas = useState<string[]>('limites-abertas', () => [])

  function limite(id: string): Limite {
    return limites.value[id] ?? 'todos'
  }

  function definir(id: string, v: Limite) {
    limites.value = { ...limites.value, [id]: v }
    abertas.value = abertas.value.filter(x => x !== id)
  }

  /** A lista cortada no limite, e quantos ficaram de fora. */
  function cortar<T>(id: string, lista: T[]): { visiveis: T[], resto: number } {
    const l = limite(id)
    if (l === 'todos' || abertas.value.includes(id) || lista.length <= l) return { visiveis: lista, resto: 0 }
    return { visiveis: lista.slice(0, l), resto: lista.length - l }
  }

  /** A seção está aberta além do limite (para mostrar "Mostrar menos"). */
  function alemDoLimite(id: string, total: number) {
    const l = limite(id)
    return l !== 'todos' && total > l && abertas.value.includes(id)
  }

  function alternarMais(id: string) {
    abertas.value = abertas.value.includes(id) ? abertas.value.filter(x => x !== id) : [...abertas.value, id]
  }

  /** "Mostrar na seção", o submenu que entra no "…" e no botão direito de toda seção. */
  function itemMostrar(id: string, t: TextosDaTela): ContextMenuItem {
    return {
      label: t.mostrarNaSecao,
      icon: 'i-lucide-list-ordered',
      children: OPCOES_DE_LIMITE.map(o => ({
        label: o === 'todos' ? t.limiteTodos : t.limiteN(o),
        type: 'checkbox' as const,
        checked: limite(id) === o,
        onSelect: () => definir(id, o),
      })),
    }
  }

  return { limite, definir, cortar, alemDoLimite, alternarMais, itemMostrar }
}
