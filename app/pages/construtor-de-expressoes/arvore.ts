/**
 * A expressão como árvore: o que o construtor visual edita.
 *
 * PROPOSTA. A árvore é a forma visual; o texto da expressão continua sendo o que
 * se grava no campo (`config.expressionEditor.expression`), como hoje. Dois
 * caminhos ligam os dois:
 *   - `gerar(expressao, modo)`: árvore → texto. Só sai texto que o motor do modo
 *     calcula certo (medido no develop, ver `motor-hoje.ts`);
 *   - `ler(texto, modo)`: texto → árvore. O que o construtor não sabe desenhar
 *     vira um bloco "trecho", que guarda o texto original sem mexer.
 *
 * Modo "hoje": gera para o motor que existe (math, dayjs, sumArray, format e o
 * Handlebars com `{{~v2}}`), respeitando os limites dele.
 * Modo "proposta": gera `{{~v3}}` + uma conta do mathjs com os campos no escopo.
 * Precisa de mudança no motor; está em `motor-proposta.ts`.
 */
import { parse } from 'mathjs'
import { niveisDeParenteses } from './motor-hoje'

export type Modo = 'hoje' | 'proposta'
/** Onde a lacuna está: peça solta, dentro de uma conta ou dentro de uma data. */
export type Contexto = 'topo' | 'conta' | 'data'
export type Tipo = 'numero' | 'texto' | 'data' | 'logico' | 'lista' | 'qualquer'
export type Unidade = 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute'
export type OpConta = '+' | '-' | '*' | '/' | '^' | '%'
export type OpCompara = '==' | '!=' | '>' | '<' | '>=' | '<='
export type Agregacao = 'somar' | 'contar' | 'media' | 'maior' | 'menor'
export type AcaoData = 'somar' | 'subtrair' | 'diferenca' | 'formatar'

export interface CampoDaCategoria {
  ref: string
  nome: string
  tipo: Tipo
  /** Colunas, quando o campo é uma lista (repetidor). */
  colunas?: CampoDaCategoria[]
  /** Opções, quando o campo é uma lista de seleção. */
  opcoes?: string[]
}

export type No =
  | { id: string, k: 'lacuna', espera: Tipo }
  /** `passo`: o nome é de um passo da expressão, não de um campo (proposta). */
  | { id: string, k: 'campo', ref: string, seVazio?: string, passo?: boolean }
  | { id: string, k: 'numero', valor: number | null }
  | { id: string, k: 'texto', valor: string }
  | { id: string, k: 'logico', valor: boolean }
  | { id: string, k: 'hoje' }
  | { id: string, k: 'conta', op: OpConta, a: No, b: No }
  | { id: string, k: 'compara', op: OpCompara, a: No, b: No }
  | { id: string, k: 'logica', op: 'and' | 'or', a: No, b: No }
  | { id: string, k: 'nao', a: No }
  | { id: string, k: 'se', cond: No, entao: No, senao: No }
  | { id: string, k: 'funcao', nome: NomeFuncao, args: No[] }
  | { id: string, k: 'lista', ag: Agregacao, lista: string, coluna: string, filtro?: { coluna: string, valor: No } }
  | { id: string, k: 'data', acao: AcaoData, base: No, qtd?: No, unidade?: Unidade, outra?: No, padrao?: string }
  | { id: string, k: 'cada', lista: string, corpo: string, separador: string }
  | { id: string, k: 'trecho', texto: string, motivo: string }

export type NomeFuncao = 'arredondar' | 'paraBaixo' | 'paraCima' | 'absoluto' | 'menor' | 'maior' | 'media' | 'juntar' | 'contem' | 'maiusculas' | 'tamanho'

export interface DefFuncao {
  args: { tipo: Tipo, chave: string }[]
  variadico?: boolean
  retorno: Tipo
  modos: Modo[]
  /** Nome no mathjs (modo hoje) e na proposta. */
  hoje?: string
  proposta: string
}

export const FUNCOES: Record<NomeFuncao, DefFuncao> = {
  arredondar: { args: [{ tipo: 'numero', chave: 'valor' }, { tipo: 'numero', chave: 'casas' }], retorno: 'numero', modos: ['hoje', 'proposta'], hoje: 'round', proposta: 'round' },
  paraBaixo: { args: [{ tipo: 'numero', chave: 'valor' }], retorno: 'numero', modos: ['hoje', 'proposta'], hoje: 'floor', proposta: 'floor' },
  paraCima: { args: [{ tipo: 'numero', chave: 'valor' }], retorno: 'numero', modos: ['hoje', 'proposta'], hoje: 'ceil', proposta: 'ceil' },
  absoluto: { args: [{ tipo: 'numero', chave: 'valor' }], retorno: 'numero', modos: ['hoje', 'proposta'], hoje: 'abs', proposta: 'abs' },
  menor: { args: [{ tipo: 'numero', chave: 'valor' }, { tipo: 'numero', chave: 'valor' }], variadico: true, retorno: 'numero', modos: ['hoje', 'proposta'], hoje: 'min', proposta: 'min' },
  maior: { args: [{ tipo: 'numero', chave: 'valor' }, { tipo: 'numero', chave: 'valor' }], variadico: true, retorno: 'numero', modos: ['hoje', 'proposta'], hoje: 'max', proposta: 'max' },
  media: { args: [{ tipo: 'numero', chave: 'valor' }, { tipo: 'numero', chave: 'valor' }], variadico: true, retorno: 'numero', modos: ['hoje', 'proposta'], hoje: 'mean', proposta: 'mean' },
  juntar: { args: [{ tipo: 'qualquer', chave: 'parte' }, { tipo: 'qualquer', chave: 'parte' }], variadico: true, retorno: 'texto', modos: ['proposta'], proposta: 'juntar' },
  contem: { args: [{ tipo: 'texto', chave: 'texto' }, { tipo: 'texto', chave: 'trecho' }], retorno: 'logico', modos: ['proposta'], proposta: 'contem' },
  maiusculas: { args: [{ tipo: 'texto', chave: 'texto' }], retorno: 'texto', modos: ['proposta'], proposta: 'maiusculas' },
  tamanho: { args: [{ tipo: 'texto', chave: 'texto' }], retorno: 'numero', modos: ['proposta'], proposta: 'tamanho' },
}

/** Uma expressão: peças que se juntam em texto, passos nomeados (proposta) e o formato de exibição. */
export interface Expressao {
  pecas: No[]
  passos: { nome: string, no: No }[]
  formato: Formato | null
}

export interface Formato {
  tipo: 'numero' | 'moeda' | 'percentual' | 'data'
  casas?: number
  moeda?: 'BRL' | 'USD' | 'EUR'
  estiloData?: 'short' | 'medium' | 'long' | 'full'
}

/** Cópia funda que aceita objeto reativo do Vue (o `structuredClone` recusa Proxy). */
export function clonar<T>(x: T): T {
  return x === undefined ? x : JSON.parse(JSON.stringify(x))
}

let sequencia = 0
export const novoId = () => `n${++sequencia}`

export function lacuna(espera: Tipo = 'qualquer'): No {
  return { id: novoId(), k: 'lacuna', espera }
}

export function expressaoVazia(): Expressao {
  return { pecas: [lacuna('qualquer')], passos: [], formato: null }
}

/* ======================================================================
   Tipos
   ====================================================================== */

export function tipoDoNo(no: No, campos: CampoDaCategoria[], passos: Expressao['passos'] = []): Tipo {
  switch (no.k) {
    case 'lacuna': return no.espera
    case 'campo': {
      const p = no.passo ? passos.find(x => x.nome === no.ref) : undefined
      if (p) return tipoDoNo(p.no, campos, passos)
      return campoPorRef(campos, no.ref)?.tipo ?? 'qualquer'
    }
    case 'numero': return 'numero'
    case 'texto': return 'texto'
    case 'logico': return 'logico'
    case 'hoje': return 'data'
    case 'conta': return 'numero'
    case 'compara':
    case 'logica':
    case 'nao': return 'logico'
    case 'se': {
      const t = tipoDoNo(no.entao, campos, passos)
      return t === 'qualquer' ? tipoDoNo(no.senao, campos, passos) : t
    }
    case 'funcao': return FUNCOES[no.nome].retorno
    case 'lista': return 'numero'
    case 'data': return no.acao === 'diferenca' ? 'numero' : no.acao === 'formatar' ? 'texto' : 'data'
    case 'cada': return 'texto'
    case 'trecho': return 'qualquer'
  }
}

export function campoPorRef(campos: CampoDaCategoria[], ref: string) {
  return campos.find(c => c.ref === ref)
}

/** Os filhos de um nó, na ordem em que aparecem. */
export function filhos(no: No): No[] {
  switch (no.k) {
    case 'conta':
    case 'compara':
    case 'logica': return [no.a, no.b]
    case 'nao': return [no.a]
    case 'se': return [no.cond, no.entao, no.senao]
    case 'funcao': return no.args
    case 'data': return [no.base, no.qtd, no.outra].filter(Boolean) as No[]
    case 'lista': return no.filtro ? [no.filtro.valor] : []
    default: return []
  }
}

export function percorrer(no: No, fn: (n: No) => void) {
  fn(no)
  filhos(no).forEach(f => percorrer(f, fn))
}

/** Troca o nó `id` dentro da árvore por `novo`. Devolve a árvore nova. */
export function trocar(raiz: No, id: string, novo: No): No {
  if (raiz.id === id) return novo
  const r: any = { ...raiz }
  for (const chave of ['a', 'b', 'cond', 'entao', 'senao', 'base', 'qtd', 'outra'] as const) {
    if (r[chave]) r[chave] = trocar(r[chave], id, novo)
  }
  if (r.k === 'funcao') r.args = r.args.map((x: No) => trocar(x, id, novo))
  if (r.k === 'lista' && r.filtro) r.filtro = { ...r.filtro, valor: trocar(r.filtro.valor, id, novo) }
  return r
}

export function acharNo(raiz: No, id: string): No | null {
  let achado: No | null = null
  percorrer(raiz, (n) => { if (n.id === id) achado = n })
  return achado
}

/* ======================================================================
   Gerar o texto: modo HOJE
   ====================================================================== */

const PRECEDENCIA: Record<string, number> = {
  'se': 1, 'or': 2, 'and': 3, 'compara': 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6, 'nao': 7, '^': 8,
}

function precedencia(no: No): number {
  if (no.k === 'se') return 1
  if (no.k === 'logica') return PRECEDENCIA[no.op]!
  if (no.k === 'compara') return 4
  if (no.k === 'conta') return PRECEDENCIA[no.op]!
  if (no.k === 'nao') return 7
  if (no.k === 'numero' && (no.valor ?? 0) < 0) return 7
  return 9
}

function aspas(texto: string) {
  return `"${texto.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

interface Gerador {
  modo: Modo
  campos: CampoDaCategoria[]
  v2: boolean
  /** Campos que o formulário não enxergaria sozinho (só em bloco do Handlebars). */
  ancoras: Set<string>
}

/** Um operando dentro de `math()` no modo hoje. */
function campoNaConta(no: Extract<No, { k: 'campo' }>, g: Gerador): string {
  const campo = campoPorRef(g.campos, no.ref)
  const tipo = campo?.tipo ?? 'numero'
  const caminho = `data.${no.ref}`
  if (tipo === 'texto') {
    if (g.v2) {
      g.ancoras.add(caminho)
      return `"{{{${caminho}}}}"`
    }
    return `"{{${caminho}}}"`
  }
  const padrao = no.seVazio ?? (tipo === 'logico' ? 'false' : '0')
  if (g.v2) return `{{#if ${caminho}}}{{${caminho}}}{{else}}${padrao}{{/if}}`
  return `{{${caminho} | (${padrao})}}`
}

function contaHoje(no: No, g: Gerador): string {
  const filho = (n: No, minimo: number) => {
    const s = contaHoje(n, g)
    return precedencia(n) < minimo ? `(${s})` : s
  }
  switch (no.k) {
    case 'campo': return campoNaConta(no, g)
    case 'numero': return String(no.valor ?? 0)
    case 'texto': return aspas(no.valor)
    case 'logico': return no.valor ? 'true' : 'false'
    case 'conta': {
      const p = PRECEDENCIA[no.op]!
      if (no.op === '^') {
        // A base de uma potência vai entre parênteses quando é campo: -3 ^ 2 dá -9 no mathjs.
        const base = no.a.k === 'campo' || (no.a.k === 'numero' && (no.a.valor ?? 0) < 0) ? `(${contaHoje(no.a, g)})` : filho(no.a, p + 1)
        return `${base} ^ ${filho(no.b, p)}`
      }
      return `${filho(no.a, p)} ${no.op} ${filho(no.b, p + 1)}`
    }
    case 'compara': {
      const ta = tipoDoNo(no.a, g.campos)
      const tb = tipoDoNo(no.b, g.campos)
      if ((ta === 'texto' || tb === 'texto') && (no.op === '==' || no.op === '!=')) {
        // O `==` do mathjs converte texto em número e falha. `equalText` compara texto.
        const s = `equalText(${contaHoje(no.a, g)}, ${contaHoje(no.b, g)})`
        return no.op === '==' ? s : `not ${s}`
      }
      return `${filho(no.a, 5)} ${no.op} ${filho(no.b, 5)}`
    }
    case 'logica': return `${filho(no.a, PRECEDENCIA[no.op]!)} ${no.op} ${filho(no.b, PRECEDENCIA[no.op]! + 1)}`
    case 'nao': return `not ${filho(no.a, 8)}`
    case 'se': {
      // O "então" encadeado precisa de parênteses (sem eles o develop dá erro); o "senão" encadeado, não.
      const entao = no.entao.k === 'se' ? `(${contaHoje(no.entao, g)})` : filho(no.entao, 2)
      return `${filho(no.cond, 2)} ? ${entao} : ${filho(no.senao, 1)}`
    }
    case 'funcao': {
      const def = FUNCOES[no.nome]
      return `${def.hoje}(${no.args.map(a => contaHoje(a, g)).join(', ')})`
    }
    case 'lista': return `sumArray(data.${no.lista}, ${no.coluna})`
    // Trecho dentro de uma conta volta como estava escrito.
    case 'trecho': return no.texto
    default: return '0'
  }
}

/** Uma peça solta (fora de `math()`) no modo hoje. */
function pecaHoje(no: No, g: Gerador): string {
  switch (no.k) {
    case 'texto': return no.valor
    case 'campo': {
      const caminho = `data.${no.ref}`
      if (g.v2) {
        if (no.seVazio !== undefined) return `{{#if ${caminho}}}{{${caminho}}}{{else}}${no.seVazio}{{/if}}`
        return `{{${caminho}}}`
      }
      return no.seVazio !== undefined ? `{{${caminho} | (${no.seVazio})}}` : `{{${caminho}}}`
    }
    case 'lista': return `sumArray(data.${no.lista}, ${no.coluna})`
    case 'data': {
      const base = no.base.k === 'hoje' ? '{{$enspace.date.currentDay}}' : no.base.k === 'campo' ? `{{data.${no.base.ref}}}` : ''
      const outra = !no.outra ? '' : no.outra.k === 'hoje' ? '{{$enspace.date.currentDay}}' : no.outra.k === 'campo' ? `{{data.${no.outra.ref}}}` : ''
      const qtd = !no.qtd ? '0' : no.qtd.k === 'campo' ? (g.v2 ? `{{data.${no.qtd.ref}}}` : `{{data.${no.qtd.ref} | (0)}}`) : String(no.qtd.k === 'numero' ? no.qtd.valor ?? 0 : 0)
      // Sem aspas na unidade: com aspas o develop ignora a soma.
      if (no.acao === 'somar') return `dayjs(${base}).add(${qtd}, ${no.unidade ?? 'day'})`
      if (no.acao === 'subtrair') return `dayjs(${base}).subtract(${qtd}, ${no.unidade ?? 'day'})`
      // A diferença conta de `outra` até `base`: dayjs(fim).diff(início).
      if (no.acao === 'diferenca') return `dayjs(${outra}).diff(${base}, ${no.unidade ?? 'day'})`
      return `dayjs(${base}).format(${no.padrao ?? 'DD/MM/YYYY'})`
    }
    case 'cada': {
      g.ancoras.add(`data.${no.lista}`)
      const sep = no.separador ? `{{#unless @last}}${no.separador}{{/unless}}` : ''
      return `{{#each data.${no.lista}}}${no.corpo}${sep}{{/each}}`
    }
    case 'trecho': return no.texto
    case 'lacuna': return ''
    default: return `math(${contaHoje(no, g)})`
  }
}

function jsonDoFormato(f: Formato): string {
  if (f.tipo === 'data') return JSON.stringify({ type: 'date', d_style: f.estiloData ?? 'short' })
  const base: Record<string, any> = { type: 'number' }
  if (f.tipo === 'moeda') { base.n_style = 'currency'; base.n_currency = f.moeda ?? 'BRL' }
  if (f.tipo === 'percentual') base.n_style = 'percent'
  if (f.casas !== undefined) { base.n_minimumFractionDigits = f.casas; base.n_maximumFractionDigits = f.casas }
  return JSON.stringify(base)
}

export function precisaDeV2(e: Expressao) {
  let sim = false
  e.pecas.forEach(p => percorrer(p, (n) => { if (n.k === 'cada') sim = true }))
  return sim
}

function gerarHoje(e: Expressao, campos: CampoDaCategoria[]): string {
  const g: Gerador = { modo: 'hoje', campos, v2: precisaDeV2(e), ancoras: new Set() }
  let corpo = e.pecas.map(p => pecaHoje(p, g)).join('')
  const unica = e.pecas.length === 1 ? e.pecas[0]! : null
  if (e.formato && unica && unica.k !== 'texto' && unica.k !== 'trecho' && unica.k !== 'lacuna') {
    // Campo sozinho vai pelo caminho (`data.x`), que o `format()` do develop lê sem trocar o valor.
    const dentro = unica.k === 'campo' ? `data.${unica.ref}` : corpo
    corpo = `format(${dentro}, ${jsonDoFormato(e.formato)})`
  }
  if (g.v2) {
    const ancoras = [...g.ancoras].map(a => `{{${a}}}`).join('')
    return `{{~v2}}${corpo}${ancoras ? `{{#if false}}${ancoras}{{/if}}` : ''}`
  }
  return corpo
}

/* ======================================================================
   Gerar o texto: modo PROPOSTA (`{{~v3}}`, mathjs com os campos no escopo)
   ====================================================================== */

const UNIDADE_PT: Record<Unidade, string> = { day: 'dias', week: 'semanas', month: 'meses', year: 'anos', hour: 'horas', minute: 'minutos' }
const UNIDADE_EN = Object.fromEntries(Object.entries(UNIDADE_PT).map(([k, v]) => [v, k])) as Record<string, Unidade>

function proposta(no: No, campos: CampoDaCategoria[], passos: Expressao['passos']): string {
  const filho = (n: No, minimo: number) => {
    const s = proposta(n, campos, passos)
    return precedencia(n) < minimo ? `(${s})` : s
  }
  switch (no.k) {
    case 'lacuna': return '?'
    case 'campo': {
      if (no.passo) return no.ref
      const s = `data.${no.ref}`
      return no.seVazio !== undefined ? `seVazio(${s}, ${seVazioLiteral(no, campos)})` : s
    }
    case 'numero': return String(no.valor ?? 0)
    case 'texto': return aspas(no.valor)
    case 'logico': return no.valor ? 'true' : 'false'
    case 'hoje': return 'hoje()'
    case 'conta': {
      const p = PRECEDENCIA[no.op]!
      if (no.op === '^') return `${filho(no.a, p + 1)} ^ ${filho(no.b, p)}`
      return `${filho(no.a, p)} ${no.op} ${filho(no.b, p + 1)}`
    }
    case 'compara': {
      const ta = tipoDoNo(no.a, campos, passos)
      const tb = tipoDoNo(no.b, campos, passos)
      const a = proposta(no.a, campos, passos)
      const b = proposta(no.b, campos, passos)
      if (ta === 'data' || tb === 'data') {
        const f = { '==': 'mesmoDia', '!=': 'mesmoDia', '<': 'antesDe', '>': 'depoisDe', '<=': 'antesOuNoDia', '>=': 'depoisOuNoDia' }[no.op]
        return no.op === '!=' ? `not ${f}(${a}, ${b})` : `${f}(${a}, ${b})`
      }
      if (ta === 'texto' || tb === 'texto') return no.op === '==' ? `igual(${a}, ${b})` : no.op === '!=' ? `not igual(${a}, ${b})` : `${filho(no.a, 5)} ${no.op} ${filho(no.b, 5)}`
      return `${filho(no.a, 5)} ${no.op} ${filho(no.b, 5)}`
    }
    case 'logica': return `${filho(no.a, PRECEDENCIA[no.op]!)} ${no.op} ${filho(no.b, PRECEDENCIA[no.op]! + 1)}`
    case 'nao': return `not ${filho(no.a, 8)}`
    case 'se': return `${filho(no.cond, 2)} ? ${filho(no.entao, 2)} : ${filho(no.senao, 1)}`
    case 'funcao': return `${FUNCOES[no.nome].proposta}(${no.args.map(a => proposta(a, campos, passos)).join(', ')})`
    case 'lista': {
      const nome = { somar: 'somarColuna', contar: 'contarLinhas', media: 'mediaDaColuna', maior: 'maiorDaColuna', menor: 'menorDaColuna' }[no.ag]
      const args = no.ag === 'contar' ? [`data.${no.lista}`] : [`data.${no.lista}`, aspas(no.coluna)]
      if (no.filtro) args.push(aspas(no.filtro.coluna), proposta(no.filtro.valor, campos, passos))
      if (no.ag === 'contar' && no.filtro) args.splice(1, 0, '""')
      return `${nome}(${args.join(', ')})`
    }
    case 'data': {
      const base = proposta(no.base, campos, passos)
      const u = aspas(UNIDADE_PT[no.unidade ?? 'day'])
      if (no.acao === 'somar') return `somarTempo(${base}, ${proposta(no.qtd ?? lacuna('numero'), campos, passos)}, ${u})`
      if (no.acao === 'subtrair') return `somarTempo(${base}, -${filho(no.qtd ?? lacuna('numero'), 7)}, ${u})`
      if (no.acao === 'diferenca') return `tempoEntre(${base}, ${proposta(no.outra ?? lacuna('data'), campos, passos)}, ${u})`
      return `formatarData(${base}, ${aspas(no.padrao ?? 'DD/MM/YYYY')})`
    }
    case 'cada': return `juntarLinhas(data.${no.lista}, ${aspas(no.corpo)}, ${aspas(no.separador)})`
    case 'trecho': return no.texto
  }
}

function seVazioLiteral(no: Extract<No, { k: 'campo' }>, campos: CampoDaCategoria[]) {
  const tipo = campoPorRef(campos, no.ref)?.tipo
  if (tipo === 'texto') return aspas(no.seVazio ?? '')
  if (tipo === 'logico') return no.seVazio === 'true' ? 'true' : 'false'
  return String(Number(no.seVazio ?? 0) || 0)
}

function gerarProposta(e: Expressao, campos: CampoDaCategoria[]): string {
  const linhas = e.passos.map(p => `${p.nome} = ${proposta(p.no, campos, e.passos)}`)
  const pecas = e.pecas.map(p => proposta(p, campos, e.passos))
  linhas.push(pecas.length > 1 ? `juntar(${pecas.join(', ')})` : pecas[0] ?? '')
  return `{{~v3}}${linhas.join('\n')}`
}

export function gerar(e: Expressao, modo: Modo, campos: CampoDaCategoria[]): string {
  return modo === 'hoje' ? gerarHoje(e, campos) : gerarProposta(e, campos)
}

/* ======================================================================
   Conferir: o que impede salvar e o que só avisa
   ====================================================================== */

export interface Problema {
  nivel: 'erro' | 'aviso'
  chave: string
  /** Parâmetros da mensagem. */
  p?: Record<string, string | number>
  /** O bloco onde o problema está. */
  no?: string
}

export function conferir(e: Expressao, modo: Modo, campos: CampoDaCategoria[]): Problema[] {
  const lista: Problema[] = []
  const todos = [...e.passos.map(p => p.no), ...e.pecas]
  let lacunas = 0
  todos.forEach(raiz => percorrer(raiz, (n) => {
    if (n.k === 'lacuna') lacunas++
    if (n.k === 'trecho') lista.push({ nivel: 'aviso', chave: 'trecho', p: { motivo: n.motivo }, no: n.id })
    if (n.k === 'campo' && (n.passo ? !e.passos.some(p => p.nome === n.ref) : !campoPorRef(campos, n.ref)))
      lista.push({ nivel: 'erro', chave: 'campoSumiu', p: { ref: n.ref }, no: n.id })
    if (n.k === 'conta' && n.op === '/' && n.b.k === 'numero' && n.b.valor === 0)
      lista.push({ nivel: 'erro', chave: 'divisaoPorZero', no: n.id })
    if (n.k === 'conta' && n.op === '/' && n.b.k === 'campo')
      lista.push({ nivel: 'aviso', chave: 'divisaoPorCampo', p: { campo: campoPorRef(campos, n.b.ref)?.nome ?? n.b.ref }, no: n.id })
    if (n.k === 'data' && n.acao === 'formatar' && /,/.test(n.padrao ?? ''))
      lista.push({ nivel: 'erro', chave: 'virgulaNoPadrao', no: n.id })
    if (n.k === 'compara') {
      const ta = tipoDoNo(n.a, campos, e.passos)
      const tb = tipoDoNo(n.b, campos, e.passos)
      if (ta !== 'qualquer' && tb !== 'qualquer' && ta !== tb && !(ta === 'numero' && tb === 'logico'))
        lista.push({ nivel: 'erro', chave: 'tiposDiferentes', no: n.id })
    }
  }))
  if (lacunas) lista.unshift({ nivel: 'erro', chave: 'lacunas', p: { n: lacunas } })

  if (modo === 'hoje') {
    e.pecas.forEach((p) => {
      if (['conta', 'compara', 'logica', 'nao', 'se', 'funcao'].includes(p.k)) {
        const g: Gerador = { modo, campos, v2: precisaDeV2(e), ancoras: new Set() }
        const corpo = contaHoje(p, g).replace(/\{\{[^}]*\}\}\}?/g, 'x').replace(/sumArray\([^)]*\)/g, 'x')
        const niveis = niveisDeParenteses(corpo)
        if (niveis > 2) lista.push({ nivel: 'erro', chave: 'parenteses', p: { n: niveis }, no: p.id })
      }
      if (p.k === 'texto' && /math\(|dayjs\(|format\(|sumArray\(|\{\{/.test(p.valor))
        lista.push({ nivel: 'erro', chave: 'textoComComando', no: p.id })
      if (p.k === 'data' && p.acao !== 'formatar') lista.push({ nivel: 'aviso', chave: 'dataVaziaHoje', no: p.id })
    })
    const v2 = precisaDeV2(e)
    if (v2) lista.push({ nivel: 'aviso', chave: 'v2Escapa' })
    if (e.formato && e.pecas.length > 1) lista.push({ nivel: 'aviso', chave: 'formatoSoComUmaPeca' })
    if (e.pecas.some(p => p.k === 'campo' && campoPorRef(campos, p.ref)?.tipo === 'texto')
      || e.pecas.some(p => { let t = false; percorrer(p, n => { if (n.k === 'campo' && campoPorRef(campos, n.ref)?.tipo === 'texto' && p.k !== 'campo') t = true }); return t }))
      lista.push({ nivel: 'aviso', chave: 'textoComAspas' })
  }
  return lista
}

/* ======================================================================
   Ler o texto de volta: modo HOJE
   ====================================================================== */

interface Leitura {
  expressao: Expressao
  /** Correções que o construtor fez ao ler (expressão antiga do construtor de blocos). */
  correcoes: string[]
}

function acharFechamento(texto: string, abre: number) {
  let nivel = 0
  for (let i = abre; i < texto.length; i++) {
    if (texto[i] === '(') nivel++
    if (texto[i] === ')' && --nivel === 0) return i
  }
  return -1
}

/** Lê um campo escrito como `{{data.x}}` ou `{{data.x | (padrão)}}`. */
function lerMustache(miolo: string): No | null {
  const partes = miolo.split('|').map(s => s.trim())
  const m = partes[0]!.match(/^\{?data\.([\w.]+)\}?$/)
  if (!m) return null
  const padrao = partes[1]?.match(/^\((.*)\)$/)?.[1]
  const no: No = { id: novoId(), k: 'campo', ref: m[1]! }
  if (padrao !== undefined) (no as any).seVazio = padrao
  return no
}

function deMathjs(n: any, variaveis: Map<string, No>, correcoes: string[], original: string, filho?: (x: any) => No): No {
  const trecho = (motivo: string): No => ({ id: novoId(), k: 'trecho', texto: n.toString(), motivo })
  // Os filhos passam pelo mesmo leitor que chamou (o da proposta reconhece as funções dela).
  const rec = filho ?? ((x: any) => deMathjs(x, variaveis, correcoes, original))
  switch (n.type) {
    case 'ParenthesisNode': return rec(n.content)
    case 'ConstantNode': {
      if (typeof n.value === 'number') return { id: novoId(), k: 'numero', valor: n.value }
      if (typeof n.value === 'boolean') return { id: novoId(), k: 'logico', valor: n.value }
      if (typeof n.value === 'string') {
        const v = variaveis.get(n.value)
        if (v) return { ...v, id: novoId() }
        return { id: novoId(), k: 'texto', valor: n.value }
      }
      return trecho('constante')
    }
    case 'SymbolNode': {
      const v = variaveis.get(n.name)
      if (v) return { ...v, id: novoId() }
      return trecho('simbolo')
    }
    case 'AccessorNode': {
      const s = n.toString() as string
      const m = s.match(/^data\.(\w+)$/)
      return m ? { id: novoId(), k: 'campo', ref: m[1]! } : trecho('acesso')
    }
    case 'OperatorNode': {
      const args = n.args.map((a: any) => rec(a))
      if (n.fn === 'unaryMinus' && args[0].k === 'numero') return { id: novoId(), k: 'numero', valor: -(args[0].valor ?? 0) }
      if (n.fn === 'unaryMinus') return { id: novoId(), k: 'conta', op: '*', a: { id: novoId(), k: 'numero', valor: -1 }, b: args[0] }
      if (n.fn === 'not') {
        const a = args[0]
        if (a.k === 'compara' && a.op === '==') return { ...a, op: '!=' }
        return { id: novoId(), k: 'nao', a }
      }
      const opConta: Record<string, OpConta> = { add: '+', subtract: '-', multiply: '*', divide: '/', pow: '^', mod: '%' }
      if (opConta[n.fn] && args.length === 2) return { id: novoId(), k: 'conta', op: opConta[n.fn]!, a: args[0], b: args[1] }
      const opCmp: Record<string, OpCompara> = { equal: '==', unequal: '!=', larger: '>', smaller: '<', largerEq: '>=', smallerEq: '<=' }
      if (opCmp[n.fn] && args.length === 2) return { id: novoId(), k: 'compara', op: opCmp[n.fn]!, a: args[0], b: args[1] }
      if ((n.fn === 'and' || n.fn === 'or') && args.length === 2) return { id: novoId(), k: 'logica', op: n.fn, a: args[0], b: args[1] }
      return trecho('operador')
    }
    case 'ConditionalNode':
      return {
        id: novoId(),
        k: 'se',
        cond: rec(n.condition),
        entao: rec(n.trueExpr),
        senao: rec(n.falseExpr),
      }
    case 'FunctionNode': {
      const nome = n.fn?.name ?? n.name
      const args: No[] = n.args.map((a: any) => rec(a))
      const def = (Object.entries(FUNCOES) as [NomeFuncao, DefFuncao][]).find(([, d]) => d.hoje === nome)
      if (def) return { id: novoId(), k: 'funcao', nome: def[0], args }
      if (nome === 'equalText' && args.length === 2) return { id: novoId(), k: 'compara', op: '==', a: args[0]!, b: args[1]! }
      // Funções que o construtor de blocos antigo gera: sum, subtract, multiply, divide.
      const encadear = (op: OpConta) => args.slice(1).reduce<No>((acc, b) => ({ id: novoId(), k: 'conta', op, a: acc, b }), args[0]!)
      if (nome === 'sum' && args.length >= 1) { correcoes.push('sum'); return encadear('+') }
      if (nome === 'multiply' && args.length >= 2) { correcoes.push('multiply'); return encadear('*') }
      if ((nome === 'subtract' || nome === 'divide') && args.length === 2) {
        correcoes.push(nome)
        return encadear(nome === 'subtract' ? '-' : '/')
      }
      if ((nome === 'subtract' || nome === 'divide') && args.length > 2) {
        // Hoje dá 0 no develop. Ler como conta encadeada é o que a pessoa quis montar.
        correcoes.push(`${nome}3`)
        return encadear(nome === 'subtract' ? '-' : '/')
      }
      return trecho('funcao')
    }
    default: return trecho('outro')
  }
}

function lerMath(corpo: string, correcoes: string[]): No {
  const variaveis = new Map<string, No>()
  let i = 0
  const marcar = (no: No) => {
    const nome = `__v${i++}`
    variaveis.set(nome, no)
    return nome
  }
  let texto = corpo.replace(/\{\{\{?([^}]+)\}?\}\}/g, (bruto, miolo) => {
    const no = lerMustache(miolo)
    return no ? marcar(no) : bruto
  })
  texto = texto.replace(/sumArray\(\s*data\.(\w+)\s*,\s*(\w+)\s*\)/g, (_, lista, coluna) => marcar({ id: novoId(), k: 'lista', ag: 'somar', lista, coluna }))
  try {
    const no = deMathjs(parse(texto), variaveis, correcoes, corpo)
    // A conta inteira sem bloco: guarda o texto original com o `math(` em volta.
    return no.k === 'trecho' ? { ...no, texto: `math(${corpo})` } : no
  }
  catch {
    return { id: novoId(), k: 'trecho', texto: `math(${corpo})`, motivo: 'naoLe' }
  }
}

function lerDayjs(trecho: string, correcoes: string[]): No | null {
  const m = trecho.match(/^dayjs\(([^)]*)\)\.(add|subtract|diff|format)\(([^)]*)\)$/)
  const dataDe = (s: string): No | null => {
    const t = s.trim()
    if (t === '{{$enspace.date.currentDay}}') return { id: novoId(), k: 'hoje' }
    const c = t.match(/^\{\{\s*data\.(\w+)\s*\}\}$/)
    return c ? { id: novoId(), k: 'campo', ref: c[1]! } : null
  }
  if (!m) return null
  const base = dataDe(m[1]!)
  if (!base) return null
  const args = m[3]!.split(',').map(s => s.trim())
  const unidadeDe = () => (args[1] ?? 'day') as Unidade
  if (m[2] === 'format') return { id: novoId(), k: 'data', acao: 'formatar', base, padrao: args[0]!.replace(/['"]/g, '') }
  if (/['"]/.test(args[1] ?? '')) {
    // Com aspas o develop ignora a unidade. O construtor lê sem aspas e avisa.
    correcoes.push('unidadeComAspas')
    args[1] = args[1]!.replace(/['"]/g, '')
  }
  if (m[2] === 'diff') {
    const outra = dataDe(args[0]!)
    // dayjs(fim).diff(início): no construtor, "dias de [início] até [fim]".
    return outra ? { id: novoId(), k: 'data', acao: 'diferenca', base: outra, outra: base, unidade: unidadeDe() } : null
  }
  const q = args[0]!
  const qtdCampo = q.match(/^\{\{\s*data\.(\w+)(?:\s*\|\s*\(0\))?\s*\}\}$/)
  const qtd: No = qtdCampo ? { id: novoId(), k: 'campo', ref: qtdCampo[1]! } : { id: novoId(), k: 'numero', valor: Number(q) }
  return { id: novoId(), k: 'data', acao: m[2] === 'add' ? 'somar' : 'subtrair', base, qtd, unidade: unidadeDe() }
}

function lerFormato(json: string, correcoes: string[]): Formato | null {
  try {
    const o = JSON.parse(json.replace(/'/g, '"'))
    if (o.type === 'date') return { tipo: 'data', estiloData: o.d_style }
    if (o.type !== 'number') correcoes.push(`formato:${o.type}`)
    const casas = o.n_maximumFractionDigits ?? o.n_minimumFractionDigits
    if (o.n_style === 'currency') return { tipo: 'moeda', moeda: o.n_currency ?? 'BRL', casas }
    if (o.n_style === 'percent') return { tipo: 'percentual', casas }
    return { tipo: 'numero', casas }
  }
  catch { return null }
}

function lerPecasHoje(texto: string, correcoes: string[]): No[] {
  const pecas: No[] = []
  let solto = ''
  const fecharSolto = () => {
    if (solto) pecas.push({ id: novoId(), k: 'texto', valor: solto })
    solto = ''
  }
  let i = 0
  while (i < texto.length) {
    const resto = texto.slice(i)
    if (resto.startsWith('math(')) {
      const fim = acharFechamento(texto, i + 4)
      if (fim > 0) {
        fecharSolto()
        pecas.push(lerMath(texto.slice(i + 5, fim), correcoes))
        i = fim + 1
        continue
      }
    }
    const soma = resto.match(/^sumArray\(\s*data\.(\w+)\s*,\s*(\w+)\s*\)/)
    if (soma) {
      fecharSolto()
      pecas.push({ id: novoId(), k: 'lista', ag: 'somar', lista: soma[1]!, coluna: soma[2]! })
      i += soma[0].length
      continue
    }
    const dj = resto.match(/^dayjs\([^)]*\)(?:\.[a-zA-Z]+\([^)]*\))*/)
    if (dj) {
      fecharSolto()
      pecas.push(lerDayjs(dj[0], correcoes) ?? { id: novoId(), k: 'trecho', texto: dj[0], motivo: 'data' })
      i += dj[0].length
      continue
    }
    const each = resto.match(/^\{\{#each data\.(\w+)\}\}([\s\S]*?)(?:\{\{#unless @last\}\}([\s\S]*?)\{\{\/unless\}\})?\{\{\/each\}\}/)
    if (each) {
      fecharSolto()
      pecas.push({ id: novoId(), k: 'cada', lista: each[1]!, corpo: each[2]!, separador: each[3] ?? '' })
      i += each[0].length
      continue
    }
    const seVazio = resto.match(/^\{\{#if data\.(\w+)\}\}\{\{data\.\1\}\}\{\{else\}\}([^{]*)\{\{\/if\}\}/)
    if (seVazio) {
      fecharSolto()
      pecas.push({ id: novoId(), k: 'campo', ref: seVazio[1]!, seVazio: seVazio[2]! })
      i += seVazio[0].length
      continue
    }
    const ancora = resto.match(/^\{\{#if false\}\}(?:\{\{[^}]+\}\})*\{\{\/if\}\}/)
    if (ancora) { i += ancora[0].length; continue }
    if (resto.startsWith('{{')) {
      const fim = resto.indexOf('}}')
      const no = fim > 0 ? lerMustache(resto.slice(2, fim)) : null
      if (no) {
        fecharSolto()
        pecas.push(no)
        i += fim + 2
        continue
      }
      // Bloco do Handlebars que o construtor não desenha: fica como trecho.
      const bloco = resto.match(/^\{\{[#^/!][\s\S]*?\}\}/)
      if (bloco) {
        fecharSolto()
        pecas.push({ id: novoId(), k: 'trecho', texto: bloco[0], motivo: 'handlebars' })
        i += bloco[0].length
        continue
      }
    }
    solto += texto[i]
    i++
  }
  fecharSolto()
  return pecas
}

function lerHoje(texto: string): Leitura {
  const correcoes: string[] = []
  let corpo = texto.trim()
  corpo = corpo.replace(/\{\{~v[12]\}\}/g, '')
  let formato: Formato | null = null
  const f = corpo.match(/^format\(([\s\S]*),\s*(\{[^)]*\})\s*\)$/)
  if (f) {
    formato = lerFormato(f[2]!, correcoes)
    corpo = f[1]!.trim()
    const caminho = corpo.match(/^data\.(\w+)$/)
    if (caminho) corpo = `{{data.${caminho[1]}}}`
  }
  const pecas = lerPecasHoje(corpo, correcoes)
  return { expressao: { pecas: pecas.length ? pecas : [lacuna()], passos: [], formato }, correcoes }
}

/* ======================================================================
   Ler o texto de volta: modo PROPOSTA
   ====================================================================== */

function deProposta(n: any, passos: string[]): No {
  const trecho = (motivo: string): No => ({ id: novoId(), k: 'trecho', texto: n.toString(), motivo })
  if (n.type === 'ParenthesisNode') return deProposta(n.content, passos)
  if (n.type === 'SymbolNode' && passos.includes(n.name)) return { id: novoId(), k: 'campo', ref: n.name, passo: true }
  if (n.type === 'FunctionNode') {
    const nome = n.fn?.name ?? n.name
    const a = n.args
    const lerArg = (x: any) => deProposta(x, passos)
    const lit = (x: any) => (x?.type === 'ConstantNode' ? String(x.value) : '')
    if (nome === 'hoje') return { id: novoId(), k: 'hoje' }
    if (nome === 'seVazio') {
      const c = lerArg(a[0])
      if (c.k === 'campo') return { ...c, seVazio: lit(a[1]) || (a[1]?.type === 'UnaryMinus' ? a[1].toString() : a[1]?.toString()) }
    }
    if (nome === 'igual') return { id: novoId(), k: 'compara', op: '==', a: lerArg(a[0]), b: lerArg(a[1]) }
    const datas: Record<string, OpCompara> = { mesmoDia: '==', antesDe: '<', depoisDe: '>', antesOuNoDia: '<=', depoisOuNoDia: '>=' }
    if (datas[nome]) return { id: novoId(), k: 'compara', op: datas[nome]!, a: lerArg(a[0]), b: lerArg(a[1]) }
    if (nome === 'somarTempo') {
      const qtd = a[1]
      const negativo = qtd?.type === 'OperatorNode' && qtd.fn === 'unaryMinus'
      return { id: novoId(), k: 'data', acao: negativo ? 'subtrair' : 'somar', base: lerArg(a[0]), qtd: lerArg(negativo ? qtd.args[0] : qtd), unidade: UNIDADE_EN[lit(a[2])] ?? 'day' }
    }
    if (nome === 'tempoEntre') return { id: novoId(), k: 'data', acao: 'diferenca', base: lerArg(a[0]), outra: lerArg(a[1]), unidade: UNIDADE_EN[lit(a[2])] ?? 'day' }
    if (nome === 'formatarData') return { id: novoId(), k: 'data', acao: 'formatar', base: lerArg(a[0]), padrao: lit(a[1]) }
    const ags: Record<string, Agregacao> = { somarColuna: 'somar', contarLinhas: 'contar', mediaDaColuna: 'media', maiorDaColuna: 'maior', menorDaColuna: 'menor' }
    if (ags[nome]) {
      const lista = a[0]?.toString().replace(/^data\./, '')
      const coluna = ags[nome] === 'contar' ? lit(a[1]) : lit(a[1])
      const no: No = { id: novoId(), k: 'lista', ag: ags[nome]!, lista, coluna }
      if (a[2] && a[3]) (no as any).filtro = { coluna: lit(a[2]), valor: lerArg(a[3]) }
      return no
    }
    if (nome === 'juntarLinhas') return { id: novoId(), k: 'cada', lista: a[0]?.toString().replace(/^data\./, ''), corpo: lit(a[1]), separador: lit(a[2]) }
    const def = (Object.entries(FUNCOES) as [NomeFuncao, DefFuncao][]).find(([, d]) => d.proposta === nome)
    if (def) return { id: novoId(), k: 'funcao', nome: def[0], args: a.map(lerArg) }
    return trecho('funcao')
  }
  return deMathjs(n, new Map(), [], '', x => deProposta(x, passos))
}

function lerProposta(texto: string): Leitura {
  const corpo = texto.replace(/^\s*\{\{~v3\}\}/, '')
  const linhas = corpo.split('\n').map(l => l.trim()).filter(Boolean)
  const passos: Expressao['passos'] = []
  const nomes: string[] = []
  let final: No = lacuna()
  linhas.forEach((linha, i) => {
    const m = linha.match(/^([a-zA-Z_]\w*)\s*=(?!=)\s*(.+)$/)
    try {
      if (m && i < linhas.length - 1) {
        passos.push({ nome: m[1]!, no: deProposta(parse(m[2]!), nomes) })
        nomes.push(m[1]!)
      }
      else {
        final = deProposta(parse(linha), nomes)
      }
    }
    catch {
      const no: No = { id: novoId(), k: 'trecho', texto: linha, motivo: 'naoLe' }
      if (m && i < linhas.length - 1) passos.push({ nome: m[1]!, no })
      else final = no
    }
  })
  const pecas = final.k === 'funcao' && final.nome === 'juntar' ? final.args : [final]
  return { expressao: { pecas, passos, formato: null }, correcoes: [] }
}

export function ler(texto: string, modo: Modo): Leitura {
  if (!texto.trim()) return { expressao: expressaoVazia(), correcoes: [] }
  if (/^\s*\{\{~v3\}\}/.test(texto) || modo === 'proposta') {
    if (/^\s*\{\{~v3\}\}/.test(texto)) return lerProposta(texto)
  }
  return lerHoje(texto)
}

/** Quantos blocos "trecho" a leitura deixou. */
export function contarTrechos(e: Expressao) {
  let n = 0
  ;[...e.passos.map(p => p.no), ...e.pecas].forEach(r => percorrer(r, (x) => { if (x.k === 'trecho') n++ }))
  return n
}
