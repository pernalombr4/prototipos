/**
 * O cálculo da espera "até uma data do item", no navegador.
 *
 * Por trás o Spaceflow usa dayjs. Aqui o mesmo cálculo é feito com `Date`,
 * para não trazer dependência ao protótipo. A regra de mês segue a do dayjs:
 * 31/03 menos 1 mês dá 28/02 (ou 29/02), nunca 03/03.
 *
 * `expressaoDayjs` devolve o cálculo escrito como o back-end faria, para o dev
 * (a seção "Ver cálculo" saiu do modal na rodada 11).
 */
import type { ConfiguracaoDoAtraso, Contrato, UnidadeDoDeslocamento, Variavel } from './mocks'
import { AGORA, todasAsVariaveis } from './mocks'

export type Situacao = 'agendado' | 'passou' | 'vazio'

export interface Retomada {
  situacao: Situacao
  /** A data do campo, como está no item. */
  dataDoCampo: Date | null
  /** Quando o fluxo continua. Nula quando o fluxo encerra. */
  continuaEm: Date | null
  /** true quando a regra manda encerrar (data passada ou campo vazio). */
  encerra: boolean
}

/**
 * Lê a variável escrita ou arrastada para o campo. Aceita o formato do exemplo
 * (`{{nodes.trig.data_de_vencimento_contrato}}`) e o que o painel do develop
 * entrega hoje (`{{ input.data.data_de_vencimento_contrato }}`).
 */
export function lerVariavel(expr: string | null): Variavel | null {
  const m = expr?.trim().match(/^\{\{\s*(?:nodes\.[\w-]+|input)\.(?:data\.)?(\w+)\s*\}\}$/)
  if (!m) return null
  return todasAsVariaveis.find(x => x.refId === m[1]) ?? null
}

/** A variável de data em uso, ou nulo quando o texto não é uma variável de data conhecida. */
export function campoEscolhido(config: ConfiguracaoDoAtraso): Variavel | null {
  const v = lerVariavel(config.date_source)
  return v?.tipo === 'Date' ? v : null
}

function lerData(texto: string | null): Date | null {
  if (!texto) return null
  // 'AAAA-MM-DD' vira meia-noite local; ISO com hora fica como está
  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    const [a, m, d] = texto.split('-').map(Number)
    return new Date(a!, m! - 1, d!)
  }
  return new Date(texto)
}

export function valorDoCampo(contrato: Contrato, campo: Variavel): Date | null {
  if (campo.refId === 'created_at') return lerData(contrato.created_at)
  if (campo.refId === 'updated_at') return lerData(contrato.updated_at)
  return lerData(contrato.data[campo.refId as keyof Contrato['data']] as string | null)
}

/** Soma (ou subtrai) no estilo do dayjs. */
export function deslocar(base: Date, quanto: number, unidade: UnidadeDoDeslocamento): Date {
  const d = new Date(base)
  if (unidade === 'hour') d.setHours(d.getHours() + quanto)
  else if (unidade === 'day') d.setDate(d.getDate() + quanto)
  else if (unidade === 'week') d.setDate(d.getDate() + quanto * 7)
  else {
    const dia = d.getDate()
    d.setDate(1)
    d.setMonth(d.getMonth() + quanto)
    const ultimo = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    d.setDate(Math.min(dia, ultimo))
  }
  return d
}

export function calcular(config: ConfiguracaoDoAtraso, contrato: Contrato, agora = AGORA): Retomada {
  const campo = campoEscolhido(config)
  const dataDoCampo = campo ? valorDoCampo(contrato, campo) : null
  if (!dataDoCampo) {
    const encerra = config.if_empty === 'end'
    return { situacao: 'vazio', dataDoCampo: null, continuaEm: encerra ? null : agora, encerra }
  }

  const sinal = config.offset_direction === 'before' ? -1 : config.offset_direction === 'after' ? 1 : 0
  let alvo = sinal === 0 ? new Date(dataDoCampo) : deslocar(dataDoCampo, sinal * config.offset_amount, config.offset_unit)

  // a hora: a do campo, ou a escolhida (não vale quando o deslocamento é em horas)
  if (config.time !== 'field' && config.offset_unit !== 'hour') {
    const [h, m] = config.time.split(':').map(Number)
    alvo = new Date(alvo.getFullYear(), alvo.getMonth(), alvo.getDate(), h, m)
  }

  if (alvo.getTime() <= agora.getTime()) {
    const encerra = config.if_past === 'end'
    return { situacao: 'passou', dataDoCampo, continuaEm: encerra ? null : agora, encerra }
  }
  return { situacao: 'agendado', dataDoCampo, continuaEm: alvo, encerra: false }
}

export interface Contagem { agendado: number, passou: number, vazio: number }

export function contar(config: ConfiguracaoDoAtraso, lista: Contrato[]): Contagem {
  const c: Contagem = { agendado: 0, passou: 0, vazio: 0 }
  for (const k of lista) c[calcular(config, k).situacao]++
  return c
}

const unidadeDayjs: Record<UnidadeDoDeslocamento, string> = { hour: 'hour', day: 'day', week: 'week', month: 'month' }

/** O cálculo escrito em dayjs, como o back-end faria. Referência para o dev. */
export function expressaoDayjs(config: ConfiguracaoDoAtraso): string {
  if (config.mode === 'duration') {
    return `dayjs().add(${Number(config.delay) || 0}, '${config.unit}')`
  }
  let expr = `dayjs(${config.date_source?.trim() || '{{?}}'})`
  if (config.offset_direction !== 'on') {
    const metodo = config.offset_direction === 'before' ? 'subtract' : 'add'
    expr += `\n  .${metodo}(${config.offset_amount}, '${unidadeDayjs[config.offset_unit]}')`
  }
  if (config.time !== 'field' && config.offset_unit !== 'hour') {
    const [h, m] = config.time.split(':').map(Number)
    expr += `\n  .hour(${h}).minute(${m}).second(0)`
  }
  expr += `\n  .tz('America/Sao_Paulo', true)`
  return expr
}

/** O que o nó grava, para o dev ver o contrato da proposta. */
export function dadoGravado(config: ConfiguracaoDoAtraso) {
  if (config.mode === 'duration') {
    const { label, delay, unit } = config
    return { label, mode: 'duration', delay: Number(delay), unit }
  }
  const { label, mode, date_source, offset_amount, offset_unit, offset_direction, time, if_past, if_empty, recalculate } = config
  return { label, mode, date_source, offset_amount, offset_unit, offset_direction, time, if_past, if_empty, recalculate }
}

/** Os horários que o seletor oferece, de 30 em 30 minutos. */
export const horarios = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  return `${h}:${i % 2 ? '30' : '00'}`
})
