/**
 * PROPOSTA de motor para as expressões novas (`{{~v3}}`), com as mesmas
 * bibliotecas do ENSPACE: mathjs para a conta, dayjs para as datas.
 *
 * Precisa de mudança no motor (front e back). Não muda nada do que existe: a
 * expressão sem prefixo e a com `{{~v2}}` continuam no motor de hoje.
 *
 * O que muda em relação a hoje, e por quê:
 *   1. Os campos entram como VALOR no escopo do mathjs (`data.preco`), em vez de
 *      texto trocado dentro da conta. Texto com aspas, número negativo e campo
 *      vazio deixam de quebrar a conta.
 *   2. Uma leitura só, pelo `math.parse`. Acaba o limite de 2 níveis de
 *      parênteses e a ordem fixa sumArray → math → dayjs → format.
 *   3. Datas, texto e listas viram funções do mathjs (`math.import`), então
 *      cabem dentro de qualquer conta e de qualquer condição.
 *   4. Passos com nome (`subtotal = ...`), um por linha, como o LET do Excel.
 *   5. O erro aparece com o motivo; não vira 0 em silêncio.
 *   6. O formato de exibição sai da expressão e vira configuração do campo.
 */
import { all, create } from 'mathjs'
import dayjs from 'dayjs'

const math = create(all)

const UNIDADES: Record<string, dayjs.ManipulateType> = {
  dias: 'day', semanas: 'week', meses: 'month', anos: 'year', horas: 'hour', minutos: 'minute',
}

const vazio = (v: unknown) => v === null || v === undefined || v === '' || (typeof v === 'number' && Number.isNaN(v))
const data = (v: unknown) => {
  if (vazio(v)) throw new Error('data-vazia')
  const d = dayjs(String(v))
  if (!d.isValid()) throw new Error('data-invalida')
  return d
}
const linhas = (v: unknown) => (Array.isArray(v) ? v : [])
const coluna = (lista: unknown, col: string, filtroCol?: string, filtroValor?: unknown) =>
  linhas(lista)
    .filter(l => !filtroCol || String(l?.[filtroCol]) === String(filtroValor))
    .map(l => l?.[col])
    .filter(v => !vazio(v))
    .map(Number)

let hojeDoPrototipo = dayjs().format('YYYY-MM-DD')

math.import({
  seVazio: (v: unknown, padrao: unknown) => (vazio(v) ? padrao : v),
  hoje: () => hojeDoPrototipo,
  somarTempo: (d: unknown, qtd: number, unidade: string) => data(d).add(Number(qtd), UNIDADES[unidade] ?? 'day').format('YYYY-MM-DD'),
  tempoEntre: (inicio: unknown, fim: unknown, unidade: string) => data(fim).diff(data(inicio), UNIDADES[unidade] ?? 'day'),
  formatarData: (d: unknown, padrao: string) => data(d).format(padrao),
  antesDe: (a: unknown, b: unknown) => data(a).isBefore(data(b), 'day'),
  depoisDe: (a: unknown, b: unknown) => data(a).isAfter(data(b), 'day'),
  mesmoDia: (a: unknown, b: unknown) => data(a).isSame(data(b), 'day'),
  antesOuNoDia: (a: unknown, b: unknown) => !data(a).isAfter(data(b), 'day'),
  depoisOuNoDia: (a: unknown, b: unknown) => !data(a).isBefore(data(b), 'day'),
  igual: (a: unknown, b: unknown) => String(a ?? '') === String(b ?? ''),
  contem: (a: unknown, b: unknown) => String(a ?? '').toLowerCase().includes(String(b ?? '').toLowerCase()),
  maiusculas: (a: unknown) => String(a ?? '').toUpperCase(),
  tamanho: (a: unknown) => String(a ?? '').length,
  juntar: (...partes: unknown[]) => partes.map(p => (vazio(p) ? '' : String(p))).join(''),
  somarColuna: (l: unknown, c: string, fc?: string, fv?: unknown) => coluna(l, c, fc, fv).reduce((a, b) => a + b, 0),
  contarLinhas: (l: unknown, _c?: string, fc?: string, fv?: unknown) => linhas(l).filter(x => !fc || String(x?.[fc]) === String(fv)).length,
  mediaDaColuna: (l: unknown, c: string, fc?: string, fv?: unknown) => {
    const v = coluna(l, c, fc, fv)
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0
  },
  maiorDaColuna: (l: unknown, c: string, fc?: string, fv?: unknown) => Math.max(...coluna(l, c, fc, fv), Number.NEGATIVE_INFINITY),
  menorDaColuna: (l: unknown, c: string, fc?: string, fv?: unknown) => Math.min(...coluna(l, c, fc, fv), Number.POSITIVE_INFINITY),
  juntarLinhas: (l: unknown, molde: string, sep: string) =>
    linhas(l).map(linha => molde.replace(/\{\{(\w+)\}\}/g, (_, k) => String(linha?.[k] ?? ''))).join(sep),
}, { override: true })

/** O que a proposta tranca: nada de definir função nova nem de importar (receita de segurança do mathjs). */
const avaliar = math.evaluate
const bloqueadas = ['import', 'createUnit', 'reviver', 'evaluate', 'parse', 'simplify', 'derivative', 'resolve', 'compile']
math.import(Object.fromEntries(bloqueadas.map(n => [n, () => { throw new Error('bloqueada') }])), { override: true })

export interface ResultadoProposta {
  valor: unknown
  erro: string | null
}

export function calcularProposta(expressao: string, contexto: Record<string, any>, hoje?: string): ResultadoProposta {
  if (hoje) hojeDoPrototipo = hoje
  const corpo = expressao.replace(/^\s*\{\{~v3\}\}/, '').trim()
  if (!corpo) return { valor: '', erro: null }
  // Número vazio vale vazio (null), não texto vazio: `seVazio` decide o que mostrar.
  const escopo = new Map<string, unknown>([['data', JSON.parse(JSON.stringify(contexto.data ?? {}))]])
  try {
    const r = avaliar(corpo, escopo)
    const valor = r && typeof r === 'object' && 'entries' in r ? (r as any).entries.at(-1) : r
    if (typeof valor === 'number' && !Number.isFinite(valor)) return { valor: null, erro: 'infinito' }
    return { valor, erro: null }
  }
  catch (e: any) {
    const msg = String(e?.message ?? e)
    if (msg.includes('data-vazia')) return { valor: null, erro: 'dataVazia' }
    if (msg.includes('data-invalida')) return { valor: null, erro: 'dataInvalida' }
    if (/Cannot convert/.test(msg)) return { valor: null, erro: 'tipo' }
    if (/Undefined symbol/.test(msg)) return { valor: null, erro: 'simbolo' }
    if (/Unexpected|Syntax|Parenthesis|Value expected/i.test(msg)) return { valor: null, erro: 'sintaxe' }
    return { valor: null, erro: 'outro' }
  }
}
