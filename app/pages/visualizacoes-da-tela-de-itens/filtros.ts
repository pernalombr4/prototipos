/**
 * PROPOSTA (rodada 5): a lógica de filtro que o chip, o filtro avançado, o painel e a dica da pílula usam.
 *
 * O operador muda com o tipo do campo (Notion e ClickUp fazem igual): campo de seleção e pessoa
 * marcam várias opções ("é", "não é"); valor e data comparam; texto procura.
 */
import type { Ref } from 'vue'
import type { FiltroDeCampo, GrupoDeRegras, TipoDeCampo } from './mocks'
import { CAMPOS, PESSOAS, campoPorPath, ehGrupo, nomeDaPessoa } from './mocks'
import type { Textos } from './textos'

export const OPERADORES: Record<TipoDeCampo, string[]> = {
  texto: ['contains', 'eq', 'empty', 'not_empty'],
  selecao: ['in', 'nin', 'empty', 'not_empty'],
  usuario: ['in', 'nin', 'empty', 'not_empty'],
  moeda: ['gte', 'lte', 'eq'],
  data: ['next_days', 'gte', 'lte', 'empty', 'not_empty'],
}

export const semValor = (op: string) => op === 'empty' || op === 'not_empty'
export const ehLista = (op: string) => op === 'in' || op === 'nin'

const tipoDe = (field: string): TipoDeCampo => campoPorPath(field)?.tipo ?? 'texto'

export const rotuloDoOperador = (t: Textos, field: string, op: string) =>
  t.operadores[tipoDe(field) === 'data' ? `data_${op}` : op] ?? op

export const operadoresDe = (t: Textos, field: string) =>
  OPERADORES[tipoDe(field)].map(op => ({ label: rotuloDoOperador(t, field, op), value: op }))

/** As opções de um campo de seleção ou de pessoa, no formato das caixas e do seletor. */
export function opcoesDe(field: string): { label: string, value: string | number }[] {
  const campo = campoPorPath(field)
  if (campo?.tipo === 'usuario') return PESSOAS.map(p => ({ label: p.nome, value: p.id }))
  return (campo?.opcoes ?? []).map(o => ({ label: o, value: o }))
}

function valorInicial(field: string, op: string): unknown {
  const tipo = tipoDe(field)
  if (ehLista(op)) return []
  if (semValor(op)) return null
  if (tipo === 'moeda') return 50000
  if (tipo === 'data') return op === 'next_days' ? 30 : '2026-12-31'
  return ''
}

/** Regra nova num campo: o 1º operador do tipo e um valor que ainda não filtra (lista vazia, texto vazio). */
export function regraNova(field: string): FiltroDeCampo {
  const op = OPERADORES[tipoDe(field)][0]!
  return { field, op, value: valorInicial(field, op) }
}

/** Trocar o operador mantém a lista marcada entre "é" e "não é"; nos outros casos o valor recomeça. */
export function comOperador(r: FiltroDeCampo, op: string): FiltroDeCampo {
  if (ehLista(op) && ehLista(r.op)) return { ...r, op }
  if (tipoDe(r.field) === 'moeda' && !semValor(op)) return { ...r, op }
  return { ...r, op, value: valorInicial(r.field, op) }
}

/** O campo de seleção que ainda não tem regra; repetir o campo zera a tabela. */
export function campoLivre(usados: string[]) {
  return CAMPOS.find(c => c.tipo === 'selecao' && !usados.includes(c.path)) ?? CAMPOS.find(c => c.tipo === 'texto')!
}

export const contarRegras = (g?: GrupoDeRegras): number =>
  (g?.regras ?? []).reduce((n, r) => n + (ehGrupo(r) ? contarRegras(r) : 1), 0)

/** A regra que ainda não filtra nada: lista vazia ou texto vazio. Não entra na dica da pílula. */
export const vazia = (r: FiltroDeCampo) =>
  (ehLista(r.op) && Array.isArray(r.value) && !r.value.length) || (r.op === 'contains' && !String(r.value ?? '').trim())

export function useDescricaoDeFiltro(t: Ref<Textos>, idioma: Ref<string>) {
  const moeda = (n: number) => new Intl.NumberFormat(idioma.value, { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
  const data = (s: string) => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${s}T12:00:00`))

  function valor(r: FiltroDeCampo): string {
    const tipo = tipoDe(r.field)
    if (ehLista(r.op)) {
      const lista = (Array.isArray(r.value) ? r.value : [r.value]).map(v => tipo === 'usuario' ? nomeDaPessoa(Number(v)) ?? '' : String(v))
      return lista.join(t.value.filtro.ouMinusculo)
    }
    if (tipo === 'moeda') return moeda(Number(r.value))
    if (tipo === 'data' && r.op === 'next_days') return t.value.painel.diasN(Number(r.value))
    if (tipo === 'data') return data(String(r.value))
    return `"${String(r.value ?? '')}"`
  }

  /** "Status é Aprovado ou Assinado"; a regra vazia mostra só o campo, como o chip do Notion. */
  function descrever(r: FiltroDeCampo): string {
    const campo = campoPorPath(r.field)?.label ?? r.field
    if (vazia(r)) return campo
    const op = rotuloDoOperador(t.value, r.field, r.op).toLowerCase()
    return semValor(r.op) ? `${campo} ${op}` : `${campo} ${op} ${valor(r)}`
  }

  /** Só o valor, para o chip: "Status: Aprovado, Assinado". */
  function valorCurto(r: FiltroDeCampo): string {
    if (vazia(r)) return ''
    if (semValor(r.op)) return rotuloDoOperador(t.value, r.field, r.op).toLowerCase()
    const v = ehLista(r.op) ? (Array.isArray(r.value) ? r.value : []).map(x => tipoDe(r.field) === 'usuario' ? nomeDaPessoa(Number(x)) : x).join(', ') : valor(r)
    return r.op === 'nin' ? `${t.value.filtro.naoEhCurto} ${v}` : r.op === 'in' || r.op === 'contains' ? v : `${rotuloDoOperador(t.value, r.field, r.op).toLowerCase()} ${v}`
  }

  /** O grupo numa frase, com parênteses no grupo de dentro: "Valor ≥ R$ 60.000 e (Status é Aprovado ou Prioridade é Alta)". */
  function descreverGrupo(g: GrupoDeRegras, dentro = false): string {
    const partes = g.regras
      .filter(r => ehGrupo(r) ? r.regras.length : !vazia(r))
      .map(r => ehGrupo(r) ? descreverGrupo(r, true) : descrever(r))
    const frase = partes.join(g.conector === 'or' ? t.value.filtro.ouMinusculo : t.value.filtro.eMinusculo)
    return dentro && partes.length > 1 ? `(${frase})` : frase
  }

  /** As partes do 1º nível do grupo, cada uma numa frase; o grupo de dentro vai entre parênteses. */
  function partesDoGrupo(g: GrupoDeRegras): string[] {
    return g.regras
      .filter(r => ehGrupo(r) ? r.regras.some(x => !ehGrupo(x) && !vazia(x)) : !vazia(r))
      .map(r => ehGrupo(r) ? descreverGrupo(r, true) : descrever(r))
  }

  return { descrever, valorCurto, descreverGrupo, partesDoGrupo, moeda, data }
}

/** O que a dica da pílula mostra, em partes; o desenho fica na barra. */
export interface ResumoDaVisualizacao {
  tipo: 'tabela' | 'kanban'
  agrupadoPor?: string
  /** 1 frase por filtro; o filtro avançado entra parte por parte, com "ou" entre as partes quando o conector é Ou. */
  filtros: { texto: string, ou?: boolean }[]
  ordenacao: { campo: string, crescente: boolean }[]
  quemVe: 'todos' | 'eu' | 'grupos'
  grupos?: string
  descricao?: string
  naoSalva: boolean
}
