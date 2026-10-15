/**
 * O motor de expressões do ENSPACE como ele é HOJE, portado para o protótipo.
 *
 * ⚠️ NADA AQUI É PROPOSTA. É a cópia, linha por linha, da função que calcula o
 * Valor Virtual no develop (`FieldRenderer-*.js`, função `cI`, e as auxiliares de
 * `helpers-*.js`: `tT`, `jE`, `GE`, `CE`), lida no bundle em 15/10/2026.
 * Os defeitos ficam de propósito: este motor existe para o protótipo errar onde
 * o produto erra. Exemplos medidos no develop e reproduzidos aqui:
 *   - `math()` só reconhece até 2 níveis de parênteses (é uma expressão regular);
 *   - erro de cálculo vira `0`; erro de leitura vira "Expression Processing Error";
 *   - `dayjs()` encadeado só passa argumento para o último método;
 *   - a unidade de data com aspas (`'day'`) é ignorada;
 *   - `#if-condition` não tem `{{else}}`.
 *
 * Mesmas bibliotecas e versões do develop: mathjs 15.2.0 e Handlebars 4.7.9.
 * O dayjs do develop tem plugins de dia útil (`businessDiff`); aqui ele não entra
 * e `businessDiff` devolve "--", como o develop faz quando falta a data.
 */
import { all, create } from 'mathjs'
import dayjs from 'dayjs'
import Handlebars from 'handlebars/dist/handlebars.min.js'

const math = create(all)

/* ---------- lodash, só o que o motor usa ---------- */

function get(obj: unknown, caminho: string, padrao?: unknown): unknown {
  if (obj == null) return padrao
  const partes = String(caminho).replace(/\[(\w+)\]/g, '.$1').split('.').filter(p => p !== '')
  let atual: any = obj
  for (const p of partes) {
    if (atual == null) return padrao
    atual = atual[p]
  }
  return atual === undefined ? padrao : atual
}

function toNumber(v: unknown): number {
  if (typeof v === 'number') return v
  if (v == null) return 0
  if (typeof v === 'boolean') return v ? 1 : 0
  const s = String(v).trim()
  if (s === '') return 0
  return Number(s)
}

function toStringLodash(v: unknown): string {
  if (v == null) return ''
  return String(v)
}

function setCaminho(obj: any, caminho: string, valor: unknown) {
  const partes = caminho.split('.')
  let atual = obj
  partes.slice(0, -1).forEach((p) => {
    if (atual[p] == null || typeof atual[p] !== 'object') atual[p] = {}
    atual = atual[p]
  })
  atual[partes[partes.length - 1]!] = valor
}

/* ---------- as expressões regulares do develop (`qF`) ---------- */

export const PADROES = {
  variable: /\{\{(?!~|\/)([^}]+)\}\}/g,
  mod: /__mod\[([^\]]+)\]/g,
  math: /math\(([^()]+|\(([^()]+|\([^()]*\))*\))*\)/g,
  format: /format\(([^)]+)\)/g,
  sumArray: /sumArray\(([^)]+),\s*([^)]+)\)/g,
  dayjs: /dayjs\([^)]*\)(?:\.[a-zA-Z]+\([^)]*\))*/g,
  replaceVersion: /\{\{~([^}]+)\}\}/g,
}

/* ---------- valor padrão no encadeamento com `|` (`tT`) ---------- */

const Zw = /^\(([^)]*)\)$/
const Qw = /^[\w$.[\]-]+$/
const $w = /^[^\da-z]+$/i
const eT = /^(?:"[\s\S]*"|'[\s\S]*')$/

function tT(e: string): { isFallback: boolean, value: string | undefined } {
  const t = e.trim()
  if (!t) return { isFallback: false, value: undefined }
  const n = t.match(Zw)
  if (n) return { isFallback: true, value: n[1] }
  if (eT.test(t)) return { isFallback: false, value: undefined }
  return t.includes(' ') || $w.test(t) || !Qw.test(t) ? { isFallback: true, value: t } : { isFallback: false, value: undefined }
}

/* ---------- comparadores do `#if-condition` (`jE`) ---------- */

const comparadores: Record<string, (a: any, b: any) => boolean> = {
  '==': (a, b) => toStringLodash(a) === toStringLodash(b),
  '===': (a, b) => a === b,
  '!=': (a, b) => toStringLodash(a) !== toStringLodash(b),
  '<': (a, b) => toNumber(a) < toNumber(b),
  '>': (a, b) => toNumber(a) > toNumber(b),
  '>=': (a, b) => toNumber(a) >= toNumber(b),
  '<=': (a, b) => toNumber(a) <= toNumber(b),
  'gte': (a, b) => toNumber(a) >= toNumber(b),
  'in': (a, b) => (Array.isArray(a) || typeof a === 'string') && (a as any).includes(b),
  'nin': (a, b) => !((Array.isArray(a) || typeof a === 'string') && (a as any).includes(b)),
  'contains': (a, b) => a.includes(b),
  'null': a => a === null,
  'notNull': a => a !== 'null',
  'empty': a => !a,
}

/* ---------- formatação (`GE`) ---------- */

function limitesDeCasas(min: unknown, max: unknown) {
  const n = Number(min)
  const r = Number(max)
  let o = Number.isFinite(n) ? Math.min(Math.max(Math.trunc(n), 0), 20) : undefined
  const s = Number.isFinite(r) ? Math.min(Math.max(Math.trunc(r), 0), 100) : undefined
  if (o !== undefined && s !== undefined && o > s) o = s
  const c: Record<string, number> = {}
  if (o !== undefined) c.minimumFractionDigits = o
  if (s !== undefined) c.maximumFractionDigits = s
  return c
}

export function formatar(valor: any, opcoes: Record<string, any> = {}): string {
  const i = {
    type: opcoes.type || 'text',
    locale: opcoes.locale || 'pt-BR',
    d_style: opcoes.d_style || 'short',
    dt_style: opcoes.dt_style || undefined,
    dt_utc: opcoes.dt_utc || false,
    n_style: opcoes.n_style || 'decimal',
    n_currency: opcoes.n_currency || 'BRL',
    n_currencyDisplay: opcoes.n_currencyDisplay || 'symbol',
    n_minimumFractionDigits: opcoes.n_minimumFractionDigits ?? undefined,
    n_maximumFractionDigits: opcoes.n_maximumFractionDigits ?? undefined,
    n_multiplier: opcoes.n_multiplier || 1,
    t_length: opcoes.t_length || undefined,
    t_suffix: opcoes.t_suffix || '...',
    l_separator: opcoes.l_separator || ' </br> ',
    value_path: opcoes.value_path || undefined,
  }
  let e: any = valor
  switch (i.type) {
    case 'date': {
      const a: Record<string, any> = { dateStyle: i.d_style, timeStyle: i.dt_style, timeZone: i.dt_utc ? 'UTC' : undefined }
      if (/.000Z/.test(e)) a.timeZone = 'UTC'
      try {
        let t = String(e)
        if (e?.length === 10) t = t.replace(/-/g, '/')
        const limpo = Object.fromEntries(Object.entries(a).filter(([, v]) => v))
        e = new Intl.DateTimeFormat(i.locale, limpo).format(new Date(t))
      }
      catch { e = '--' }
      break
    }
    case 'number':
      e = toNumber(e) * (i.n_multiplier || 1)
      if (i.n_style === 'percent') e /= 100
      try {
        e = new Intl.NumberFormat(i.locale, {
          style: i.n_style,
          currency: i.n_currency,
          currencyDisplay: i.n_currencyDisplay,
          ...limitesDeCasas(i.n_minimumFractionDigits, i.n_maximumFractionDigits),
        }).format(e)
      }
      catch { e = String(e) }
      if (e === 'NaN') e = '--'
      break
    case 'text':
      e = i.value_path ? get(e, i.value_path) : e
      if (opcoes.t_length && e?.length > opcoes.t_length) e = `${e.substring(0, opcoes.t_length)}${opcoes.t_suffix ?? '...'}`
      break
    case 'boolean':
      e = e === true || e === 'true' ? 'Sim' : 'Não'
      break
    case 'list':
      e = i.value_path && Array.isArray(e) ? e.map(x => get(x, i.value_path || 'reference', x)) : e
      if (Array.isArray(e)) e = e.join(i.l_separator)
      break
    case 'object':
      e = JSON.stringify(e)
      break
    default:
      e = toStringLodash(e)
  }
  return e
}

/** `__mod[format?...|transformText?...]` (`CE`), só format e transformText. */
function aplicarModificador(valor: any, mod: string): any {
  const passos = (mod.match(/\[(.*?)\]/) || [])[1]?.split('|') || []
  let e = valor
  passos.forEach((p) => {
    const nome = p.split('?')[0]
    const params: Record<string, any> = {}
    new URLSearchParams(p.split('?')[1] || '').forEach((v, k) => {
      if (k in params) params[k] = [].concat(params[k], v as any)
      else params[k] = k === 'options' ? [v] : v
    })
    if (nome === 'format') e = formatar(e, params)
    if (nome === 'transformText') {
      let r = String(e ?? '')
      for (const o of params.options ?? []) {
        if (o === 'lowercase') r = r.toLowerCase()
        if (o === 'uppercase') r = r.toUpperCase()
        if (o === 'trim') r = r.trim()
        if (o === 'capitalize') r = r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()
      }
      e = r
    }
  })
  return e
}

/* ---------- as etapas do motor ---------- */

/** `lI`: soma uma coluna da lista. Linha sem o valor fica de fora. */
function somarLista(lista: unknown, coluna: string) {
  if (!Array.isArray(lista)) return 0
  return lista.reduce((acc, linha) => (linha && get(linha, coluna) !== undefined ? acc + Number(get(linha, coluna, 0)) : acc), 0)
}

/** `dI`: a troca das variáveis `{{...}}` (versão 1). */
function trocarVariaveis(texto: string, contexto: any, def = '') {
  return texto.replace(PADROES.variable, (_, bruto: string) => {
    const partes = bruto.split('|')
    let n = partes.filter(p => get(contexto, p.replace(PADROES.mod, '').trim(), false))[0] || partes[0]!
    const comPadrao = partes.find(p => tT(p).isFallback)
    const padrao = comPadrao ? tT(comPadrao) : { isFallback: false, value: undefined }
    const s = padrao.isFallback ? padrao.value! : def
    // O `.test` numa expressão regular global guarda posição entre chamadas: o develop faz assim.
    const c = PADROES.mod.test(n) ? n.match(PADROES.mod)?.[0] : partes.find(p => PADROES.mod.test(p))?.match(PADROES.mod)?.[0]
    n = PADROES.mod.test(n) ? n.replace(PADROES.mod, '') : n
    if (n.endsWith('.length')) return String((get(contexto, n.replace('.length', ''), []) as any[]).length)
    const l = `${get(contexto, n.trim(), s)}`.replace(/null|NaN/g, '') || s
    return c ? aplicarModificador(l, c) : l
  })
}

/** `fI`: a versão 2, Handlebars com o helper `if-condition`. */
function compilarV2(texto: string, contexto: any) {
  Handlebars.registerHelper('if-condition', (a: any, op: string, b: any, opcoes: any) => {
    if ((a || typeof a === 'number') && op && (b || typeof b === 'number')) {
      if (comparadores[op]?.(a, b)) {
        try { return opcoes.fn(opcoes?.data?.root) }
        catch { return '' }
      }
      return ''
    }
    return ''
  })
  return Handlebars.compile(texto)(contexto)
}

export interface OpcoesDoMotor {
  /** Devolve o valor de `format()` sem formatar, como o develop grava no item. */
  returnRaw?: boolean
  /** Data de hoje do protótipo (o develop usa a do navegador). */
  hoje?: string
}

/** `cI`: calcula a expressão para o contexto `{ data: {...} }`. */
export function calcularHoje(expressao: string, contexto: Record<string, any>, opcoes: OpcoesDoMotor = {}): string {
  const texto = toStringLodash(expressao)
  const a = JSON.parse(JSON.stringify(contexto))
  const hoje = opcoes.hoje ?? dayjs().format('YYYY-MM-DD')
  setCaminho(a, '$enspace.date', {
    currentDay: hoje,
    currentTime: dayjs(hoje),
    currentTimeISO: dayjs(hoje).toISOString(),
  })
  try {
    let versao = 'v1'
    let e = texto.replace(PADROES.replaceVersion, (_, n: string) => { versao = n; return '' })
    e = versao === 'v2' ? compilarV2(e, a) : trocarVariaveis(e, a)

    return e
      .replace(PADROES.sumArray, (_, caminho: string, coluna: string) => String(somarLista(get(a, caminho.trim(), []), coluna)))
      .replace(PADROES.math, (trecho) => {
        const corpo = trecho.replace('math', '')
        const relido = math.parse(corpo).toString()
        try { return String(math.evaluate(relido, a)) }
        catch { return '0' }
      })
      .replace(PADROES.dayjs, (trecho) => {
        const partes = trecho.split(/\)\./)
        const base = partes[0]!.replace(/dayjs\(|\)/g, '')
        let d = dayjs(base)
        if (partes.length === 1) return d.toJSON() || ''
        for (const p of partes.slice(1)) {
          const metodo = p.replace(/\([^)]+\)/, '')
          const args = (p.match(/\(([^)]+)\)/)?.[1]?.split(',') || []).map(x => x.trim())
          if (['add', 'subtract'].includes(metodo)) {
            const qtd = toNumber(args[0])
            const unidade = args[1]?.trim() || 'day'
            if (['year', 'month', 'day', 'hour', 'minute', 'second'].includes(unidade))
              d = metodo === 'add' ? d.add(qtd, unidade as any) : d.subtract(qtd, unidade as any)
            continue
          }
          if (metodo === 'diff') {
            const unidade = args[1]?.trim() || 'day'
            if (args.includes('onlyParam')) return String(d.startOf(unidade as any).diff(dayjs(args[0]).startOf(unidade as any), unidade as any))
            return String(d.diff(args[0], unidade as any))
          }
          if (metodo === 'businessDiff') return '--'
          if (metodo === 'format') return d.format(args[0]!.trim().replace(/'|"/g, ''))
        }
        return d.toJSON() || ''
      })
      .replace(PADROES.format, (_, dentro: string) => {
        const partes = dentro.match(/([^,]+)(?:,([^)]+))?/)?.slice(1) ?? []
        let cfg: Record<string, any> = {}
        try { cfg = JSON.parse(partes[1]!.trim().replace(/'/g, '"')) }
        catch { /* o develop só registra no console */ }
        const v = get(a, partes[0]!, partes[0])
        return opcoes.returnRaw ? String(v) : formatar(v, cfg)
      })
  }
  catch {
    return 'Expression Processing Error'
  }
}

/**
 * `XF`: os campos que a expressão usa. É por esta lista que o formulário do
 * develop decide quando recalcular: campo que não sai daqui não dispara o
 * cálculo (exemplo: o que aparece só dentro de `{{#each}}` ou de `{{#if}}`).
 */
export function camposQueDisparam(expressao: string): string[] {
  if (typeof expressao !== 'string') return []
  const refs: string[] = []
  const resto = expressao.replace(PADROES.sumArray, (_, caminho: string, coluna: string) => {
    refs.push(`${caminho.trim()}.${coluna.trim()}`)
    return ''
  })
  for (const m of resto.match(PADROES.variable) || []) {
    for (const parte of m.replace(/\{\{|\}\}/g, '').trim().split('|').map(x => x.trim())) {
      const n = parte.replace(/\[\d*\]+/g, '[*]').replace(PADROES.mod, '').trim()
      if (n && !n.includes('(') && !tT(n).isFallback) refs.push(n)
    }
  }
  return [...new Set(refs)]
}

/** Quantos níveis de parênteses um corpo de `math()` tem. */
export function niveisDeParenteses(corpo: string) {
  let nivel = 0
  let maximo = 0
  for (const c of corpo) {
    if (c === '(') maximo = Math.max(maximo, ++nivel)
    if (c === ')') nivel--
  }
  return maximo
}
