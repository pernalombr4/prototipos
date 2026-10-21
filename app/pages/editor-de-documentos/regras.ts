/**
 * As regras do editor de modelos: a condição de um trecho ("Se", "Senão, se",
 * "Nos demais casos") e o filtro de uma repetição usam o mesmo formato.
 *
 * Teste = 1 conector (todas ou qualquer uma) e itens, que são regras ou grupos.
 * O grupo tem o próprio conector e só regras dentro (1 nível, sem grupo de grupo).
 */
import type { TipoNoModelo } from './mocks'

export type Op =
  | 'igual' | 'diferente' | 'maior' | 'menor' | 'maiorIgual' | 'menorIgual'
  | 'umDe' | 'nenhumDe' | 'contem' | 'vazio' | 'preenchido' | 'antes' | 'depois'

export type Valor = string | number | null | (string | number)[]

export interface Regra { tipo: 'regra', campo: string | null, op: Op | null, valor: Valor }
export interface Grupo { tipo: 'grupo', conector: 'E' | 'OU', regras: Regra[] }
export interface Teste { conector: 'E' | 'OU', itens: (Regra | Grupo)[] }

/** Uma condição do modelo: as variantes em ordem e, se ligado, o "nos demais casos". */
export interface Condicao { variantes: Teste[], senao: boolean }

export interface Repeticao {
  campo: string
  formato: 'tabela' | 'numerada' | 'marcadores' | 'texto'
  colunas: string[]
  numerar: boolean
  total: string | null
  filtro: Teste | null
  ordem: { coluna: string, sentido: 'asc' | 'desc' } | null
  /** Tem a parte "Se a lista estiver vazia" no bloco (o texto fica no documento). */
  vazio: boolean
}

/** O que a linha de regra precisa saber de um campo. */
export interface CampoDeRegra { ref: string, rotulo: string, tipo: TipoNoModelo }

export const SEM_VALOR: Op[] = ['vazio', 'preenchido']

export function opsDoTipo(tipo: TipoNoModelo | undefined): Op[] {
  switch (tipo) {
    case 'numero':
    case 'moeda': return ['igual', 'diferente', 'maior', 'menor', 'maiorIgual', 'menorIgual', 'vazio', 'preenchido']
    case 'data': return ['antes', 'depois', 'igual', 'vazio', 'preenchido']
    case 'opcao':
    case 'pessoa': return ['umDe', 'nenhumDe', 'vazio', 'preenchido']
    case 'texto': return ['igual', 'diferente', 'contem', 'vazio', 'preenchido']
    default: return []
  }
}

export function novaRegra(): Regra {
  return { tipo: 'regra', campo: null, op: null, valor: null }
}

export function novoTeste(): Teste {
  return { conector: 'E', itens: [novaRegra()] }
}

/** O valor de partida quando a pessoa escolhe o campo ou o operador. */
export function valorInicial(tipo: TipoNoModelo | undefined, op: Op | null): Valor {
  if (!op || SEM_VALOR.includes(op)) return null
  if (op === 'umDe' || op === 'nenhumDe') return []
  if (tipo === 'numero' || tipo === 'moeda') return null
  return ''
}

export function regraCompleta(r: Regra): boolean {
  if (!r.campo || !r.op) return false
  if (SEM_VALOR.includes(r.op)) return true
  if (Array.isArray(r.valor)) return r.valor.length > 0
  return r.valor !== null && r.valor !== ''
}

export function testeCompleto(t: Teste): boolean {
  return t.itens.length > 0 && t.itens.every(i => i.tipo === 'regra' ? regraCompleta(i) : i.regras.length > 0 && i.regras.every(regraCompleta))
}

/* ------------------------------ avaliar ------------------------------ */

function comoData(v: unknown): number {
  if (v instanceof Date) return v.getTime()
  return new Date(String(v)).getTime()
}

export function avaliarRegra(r: Regra, ler: (ref: string) => unknown, tipo: TipoNoModelo | undefined): boolean {
  if (!r.campo || !r.op) return false
  const atual = ler(r.campo)
  const vazio = atual === null || atual === undefined || atual === ''
  if (r.op === 'vazio') return vazio
  if (r.op === 'preenchido') return !vazio
  if (vazio) return false
  if (tipo === 'data') {
    const a = comoData(atual)
    const b = comoData(r.valor)
    const dia = (n: number) => Math.floor(n / 86_400_000)
    if (r.op === 'antes') return a < b
    if (r.op === 'depois') return a > b
    if (r.op === 'igual') return dia(a) === dia(b)
    return false
  }
  if (r.op === 'umDe' || r.op === 'nenhumDe') {
    const lista = (Array.isArray(r.valor) ? r.valor : [r.valor]).map(String)
    const dentro = lista.includes(String(atual))
    return r.op === 'umDe' ? dentro : !dentro
  }
  if (r.op === 'contem') return String(atual).toLowerCase().includes(String(r.valor).toLowerCase())
  const numerico = tipo === 'numero' || tipo === 'moeda'
  const a = numerico ? Number(atual) : String(atual)
  const b = numerico ? Number(r.valor) : String(r.valor)
  switch (r.op) {
    case 'igual': return a === b
    case 'diferente': return a !== b
    case 'maior': return a > b
    case 'menor': return a < b
    case 'maiorIgual': return a >= b
    case 'menorIgual': return a <= b
  }
  return false
}

export function avaliarTeste(t: Teste, ler: (ref: string) => unknown, tipoDe: (ref: string) => TipoNoModelo | undefined): boolean {
  const regra = (r: Regra) => avaliarRegra(r, ler, r.campo ? tipoDe(r.campo) : undefined)
  const res = t.itens.map(i => i.tipo === 'regra'
    ? regra(i)
    : (i.conector === 'E' ? i.regras.every(regra) : i.regras.some(regra)))
  return t.conector === 'E' ? res.every(Boolean) : res.some(Boolean)
}

/** Qual parte da condição aparece: o índice da variante, 'senao' ou null (nada). */
export function parteQueAparece(c: Condicao, ler: (ref: string) => unknown, tipoDe: (ref: string) => TipoNoModelo | undefined): number | 'senao' | null {
  const i = c.variantes.findIndex(v => avaliarTeste(v, ler, tipoDe))
  if (i >= 0) return i
  return c.senao ? 'senao' : null
}

/* ------------------------------ marcação ------------------------------ */

function literal(v: string | number | null, tipo: TipoNoModelo | undefined): string {
  if (tipo === 'numero' || tipo === 'moeda' || tipo === 'pessoa') return String(v ?? 0)
  return `'${String(v ?? '').replace(/'/g, '\\\'')}'`
}

export function marcarRegra(r: Regra, caminho: (ref: string) => string, tipo: TipoNoModelo | undefined): string {
  if (!r.campo || !r.op) return ''
  const x = caminho(r.campo)
  const v = r.valor
  switch (r.op) {
    case 'igual': return `${x} === ${literal(v as string, tipo)}`
    case 'diferente': return `${x} !== ${literal(v as string, tipo)}`
    case 'maior': return `${x} > ${literal(v as number, tipo)}`
    case 'menor': return `${x} < ${literal(v as number, tipo)}`
    case 'maiorIgual': return `${x} >= ${literal(v as number, tipo)}`
    case 'menorIgual': return `${x} <= ${literal(v as number, tipo)}`
    case 'antes': return `${x} < ${literal(v as string, 'texto')}`
    case 'depois': return `${x} > ${literal(v as string, 'texto')}`
    case 'contem': return `${x}.includes(${literal(v as string, 'texto')})`
    case 'vazio': return `!${x}`
    case 'preenchido': return `!!${x}`
    case 'umDe':
    case 'nenhumDe': {
      const lista = Array.isArray(v) ? v : [v as string]
      const sinal = r.op === 'umDe' ? '===' : '!=='
      const junta = r.op === 'umDe' ? ' OR ' : ' AND '
      const partes = lista.map(i => `${x} ${sinal} ${literal(i, tipo)}`)
      return partes.length > 1 ? `(${partes.join(junta)})` : partes[0] ?? ''
    }
  }
  return ''
}

export function marcarTeste(t: Teste, caminho: (ref: string) => string, tipoDe: (ref: string) => TipoNoModelo | undefined): string {
  const junta = (c: 'E' | 'OU') => (c === 'E' ? ' AND ' : ' OR ')
  const regra = (r: Regra) => marcarRegra(r, caminho, r.campo ? tipoDe(r.campo) : undefined)
  return t.itens
    .map(i => i.tipo === 'regra' ? regra(i) : `(${i.regras.map(regra).join(junta(i.conector))})`)
    .join(junta(t.conector))
}

/**
 * O motor de hoje não tem "senão": cada parte vira um IF próprio, que exige que
 * as partes de antes não valham (a documentação ensina 2 IFs complementares).
 */
export function marcarPartes(c: Condicao, caminho: (ref: string) => string, tipoDe: (ref: string) => TipoNoModelo | undefined): string[] {
  const exprs = c.variantes.map(v => marcarTeste(v, caminho, tipoDe))
  const partes = exprs.map((e, i) => (i === 0 ? e : [...exprs.slice(0, i).map(a => `!(${a})`), `(${e})`].join(' AND ')))
  if (c.senao) partes.push(exprs.map(a => `!(${a})`).join(' AND '))
  return partes
}

/* ------------------------------ guardar no documento ------------------------------ */

export function codificar(o: unknown) {
  return encodeURIComponent(JSON.stringify(o))
}

export function decodificar<T>(s: string | undefined): T | null {
  if (!s) return null
  try { return JSON.parse(decodeURIComponent(s)) as T }
  catch { return null }
}

export function copia<T>(o: T): T {
  return JSON.parse(JSON.stringify(o)) as T
}
