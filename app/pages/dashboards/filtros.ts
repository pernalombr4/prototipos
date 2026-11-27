/**
 * PROPOSTA (rodada 2): o filtro de campo do dashboard, no desenho do protótipo
 * `visualizacoes-da-tela-de-itens` (rodada 5, a linha de filtros no desenho do Notion).
 *
 * Todo campo pertence a 1 categoria. O filtro do dashboard, o filtro salvo no painel
 * e o filtro só da visão usam o mesmo formato (`FiltroDeCampo`) e o mesmo chip.
 *
 * O operador muda com o tipo do campo: seleção, relação, membro e sim ou não marcam
 * várias opções ("é", "não é"); número e moeda comparam.
 */
import type { Ref } from 'vue'
import type { FiltroDeCampo, Operador } from './agregacao'
import { campoDe, ehMedida, ehMoeda, filtroVazio, opcoesDoCampo } from './agregacao'
import { formatarValor } from './formatar'
import type { Textos } from './textos'

export const semValor = (op: Operador) => op === 'preenchido' || op === 'vazio'
export const ehLista = (op: Operador) => op === 'em' || op === 'foraDe'

export function operadoresDoCampo(categoria: string, campo: string): Operador[] {
  const c = campoDe(categoria, campo)
  return c && ehMedida(c) ? ['maior', 'menor', 'preenchido', 'vazio'] : ['em', 'foraDe', 'preenchido', 'vazio']
}

/** Filtro novo: o 1º operador do tipo e nada escolhido, então ainda não filtra. */
export function filtroNovo(categoria: string, campo: string): FiltroDeCampo {
  return { categoria, campo, operador: operadoresDoCampo(categoria, campo)[0]!, valores: [] }
}

/** Trocar entre "é" e "não é" mantém as opções marcadas; nos outros casos, o valor recomeça. */
export function comOperador(f: FiltroDeCampo, op: Operador): FiltroDeCampo {
  if (ehLista(op) && ehLista(f.operador)) return { ...f, operador: op }
  if (!ehLista(op) && !ehLista(f.operador) && !semValor(op) && !semValor(f.operador)) return { ...f, operador: op }
  return { ...f, operador: op, valores: [] }
}

export function useDescricaoDeFiltro(t: Ref<Textos>) {
  function valores(f: FiltroDeCampo, junta = ', '): string {
    const c = campoDe(f.categoria, f.campo)
    if (ehLista(f.operador)) {
      const opcoes = opcoesDoCampo(f.categoria, f.campo, t.value.rotulos)
      return f.valores.map(v => opcoes.find(o => o.value === v)?.label ?? v).join(junta)
    }
    return formatarValor(Number(f.valores[0]), { locale: t.value.locale, moeda: ehMoeda(c), funcao: 'soma' })
  }

  /** Só o valor, para o chip: "Status: Assinado, Encerrado"; "Valor: maior que R$ 50 mil". */
  function valorCurto(f: FiltroDeCampo): string {
    if (filtroVazio(f)) return ''
    if (semValor(f.operador)) return t.value.filtro.operadores[f.operador]
    if (f.operador === 'em') return valores(f)
    return `${t.value.filtro.operadores[f.operador]} ${valores(f)}`
  }

  /** A frase inteira, para a lista do ícone de filtro do painel: "Status é Assinado ou Encerrado". */
  function descrever(f: FiltroDeCampo): string {
    const nome = campoDe(f.categoria, f.campo)?.name ?? f.campo
    if (filtroVazio(f)) return nome
    const op = t.value.filtro.operadores[f.operador]
    if (semValor(f.operador)) return `${nome} ${op}`
    const v = valores(f, t.value.filtro.ou)
    return `${nome} ${op} ${v}`
  }

  return { valorCurto, descrever }
}
