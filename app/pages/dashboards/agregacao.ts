/**
 * O motor dos painéis: recebe a configuração de um painel e devolve os números.
 *
 * No protótipo roda no navegador, sobre o `mocks.ts`. Na proposta, é o que vai para
 * o back-end (recomendação 1 do relatório): a tela pede "contagem de Contratos por
 * Status e Unidade" e recebe os grupos prontos, em vez de baixar todos os itens.
 *
 * As regras que este arquivo fixa são a proposta para o dev:
 * - múltipla seleção conta o item em cada opção marcada (hoje, "A | B" vira 1 grupo);
 * - relação agrupa pelo item relacionado, com o nome dele (hoje, só o 1º valor conta);
 * - valor vazio vira o grupo "Sem valor", que aparece e pode ser clicado;
 * - campo virtual (expressão) entra como medida;
 * - acima do teto de grupos, o resto vira "Outros", e a tela diz quantos;
 * - o filtro do dashboard só vale no painel cuja categoria tem o campo.
 */
import type { CampoDoMock, CategoriaDoMock, ItemDoMock, Valor } from './mocks'
import { AGORA, CATEGORIAS, ITENS, categoriaPorSlug, itemPorId } from './mocks'

export type Funcao = 'contagem' | 'soma' | 'media' | 'mediana' | 'minimo' | 'maximo' | 'distintos'
export type Visualizacao = 'numero' | 'barras' | 'barrasHorizontais' | 'linha' | 'area' | 'rosca' | 'funil' | 'tabela'
export type Granularidade = 'dia' | 'semana' | 'mes' | 'trimestre' | 'ano'
export type Ordem = 'natural' | 'valorDesc' | 'valorAsc' | 'rotulo'
export type Operador = 'igual' | 'diferente' | 'maior' | 'menor' | 'preenchido' | 'vazio'
export type PresetDePeriodo = '7d' | '30d' | '90d' | 'month' | 'quarter' | 'year'
export type Periodo = PresetDePeriodo | { from: Date, to: Date }

export interface Condicao {
  campo: string
  operador: Operador
  /** Opção (value), id do item relacionado, número ou nome do membro. */
  valor?: string
}

export interface ConfigDoPainel {
  id: string
  /** Vazio: o título sai da frase da configuração. */
  titulo: string
  categoria: string
  funcao: Funcao
  /** Campo de número, moeda ou virtual. Obrigatório quando a função não é contagem. */
  medida?: string
  agruparPor?: string
  granularidade: Granularidade
  quebrarPor?: string
  condicoes: Condicao[]
  juncao: 'e' | 'ou'
  /** `dashboard`: segue o período do topo. `todo`: ignora período (estoque, como "em negociação agora"). */
  periodo: 'dashboard' | 'todo'
  /** Campo de data que o período lê. Padrão: Criado em. */
  campoDeData: string
  visualizacao: Visualizacao
  ordem: Ordem
  /** Teto de grupos; o resto vira "Outros". 0 = sem teto. */
  limite: number
  mostrarValores: boolean
  /** Ícone opcional: hoje é obrigatório. */
  icone?: string
  /** Largura e altura na grade de 12 colunas. */
  w: number
  h: number
}

/** Filtro do topo do dashboard, por campo comum. */
export interface FiltroDoDashboard {
  /** Chave do campo comum (`chaveComum`). */
  chave: string
  valores: string[]
}

export interface Grupo {
  chave: string
  rotulo: string
  valor: number
  ids: number[]
  /** Valor de cada parte da quebra, pela chave da parte. */
  partes: Record<string, number>
  idsDaParte: Record<string, number[]>
}

export interface Resultado {
  grupos: Grupo[]
  quebras: { chave: string, rotulo: string }[]
  /** A medida sobre o recorte inteiro, sem dividir por grupo: o número do painel "Número". */
  total: number
  /** Itens no recorte. */
  itens: number
  ids: number[]
  /** Agrupado por campo que aceita mais de 1 valor: a soma das barras pode passar do total. */
  multiplo: boolean
  /** Grupos que entraram em "Outros". */
  emOutros: number
  /** Filtros do dashboard que este painel não pôde usar (a categoria não tem o campo). */
  filtrosIgnorados: string[]
}

export const VAZIO = '__vazio'
export const OUTROS = '__outros'

/* ------------------------------ tipos de campo ----------------------------- */

const DIMENSAO = new Set(['EnlDropdown', 'radioButton', 'multiSelect', 'checkbox', 'EnlCheckbox', 'EnlChips', 'inputSwitch', 'EnRel', 'EnRelMulti', 'EnTreeSelect', 'date', 'datetime-local', 'EnlCalendar'])
const MULTIPLO = new Set(['multiSelect', 'checkbox', 'EnlCheckbox', 'EnlChips', 'EnRelMulti'])
const MEDIDA = new Set(['EnlNumber', 'EnCurrency', 'EnlExpressionEditor', 'EnDuration'])
const DATA = new Set(['date', 'datetime-local', 'EnlCalendar'])

export const ehDimensao = (c: CampoDoMock) => DIMENSAO.has(c.type)
export const ehMedida = (c: CampoDoMock) => MEDIDA.has(c.type)
export const ehData = (c: CampoDoMock) => DATA.has(c.type)
export const ehMultiplo = (c: CampoDoMock) => MULTIPLO.has(c.type)
export const ehMoeda = (c?: CampoDoMock) => c?.type === 'EnCurrency' || c?.refId === 'valor_mensal'

export function campoDe(slug: string, refId?: string): CampoDoMock | undefined {
  if (!refId) return undefined
  return categoriaPorSlug.get(slug)?.campos.find(c => c.refId === refId)
}

/** Ícone do tipo de campo, para o seletor. */
export function iconeDoTipo(c: CampoDoMock): string {
  if (c.sistema && c.refId === 'user') return 'i-lucide-user-round'
  switch (c.type) {
    case 'EnlDropdown': case 'radioButton': return 'i-lucide-circle-chevron-down'
    case 'multiSelect': case 'checkbox': case 'EnlChips': return 'i-lucide-list-checks'
    case 'inputSwitch': return 'i-lucide-toggle-right'
    case 'EnRel': case 'EnRelMulti': return 'i-lucide-link'
    case 'date': case 'datetime-local': case 'EnlCalendar': return 'i-lucide-calendar'
    case 'EnlNumber': return 'i-lucide-hash'
    case 'EnCurrency': return 'i-lucide-circle-dollar-sign'
    case 'EnlExpressionEditor': return 'i-lucide-sigma'
    default: return 'i-lucide-text-cursor'
  }
}

/* ---------------------------------- período -------------------------------- */

const DIA = 86_400_000
const inicioDoDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const fimDoDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)

/** Janela do período, com o "hoje" do protótipo (`AGORA`), não o relógio da máquina. */
export function intervalo(p: Periodo): { from: Date, to: Date } {
  if (typeof p !== 'string') {
    const [a, b] = p.from <= p.to ? [p.from, p.to] : [p.to, p.from]
    return { from: inicioDoDia(a), to: fimDoDia(b) }
  }
  const hoje = AGORA
  const to = fimDoDia(hoje)
  switch (p) {
    case '7d': return { from: inicioDoDia(new Date(hoje.getTime() - 6 * DIA)), to }
    case '30d': return { from: inicioDoDia(new Date(hoje.getTime() - 29 * DIA)), to }
    case '90d': return { from: inicioDoDia(new Date(hoje.getTime() - 89 * DIA)), to }
    case 'month': return { from: new Date(hoje.getFullYear(), hoje.getMonth(), 1), to }
    case 'quarter': return { from: new Date(hoje.getFullYear(), Math.floor(hoje.getMonth() / 3) * 3, 1), to }
    case 'year': return { from: new Date(hoje.getFullYear(), 0, 1), to }
  }
}

/** A granularidade que cabe no período: dia até 31 dias, semana até 120, mês depois. */
export function granularidadeSugerida(p: Periodo): Granularidade {
  const { from, to } = intervalo(p)
  const dias = (to.getTime() - from.getTime()) / DIA
  if (dias <= 31) return 'dia'
  if (dias <= 120) return 'semana'
  return 'mes'
}

/* --------------------------------- valores --------------------------------- */

function bruto(item: ItemDoMock, refId: string): Valor | Date | undefined {
  if (refId === 'created_at') return item.created_at
  if (refId === 'updated_at') return item.updated_at
  if (refId === 'user') return item.user
  return item.data[refId]
}

function comoData(v: Valor | Date | undefined): Date | null {
  if (v instanceof Date) return v
  if (typeof v === 'string' && v) return new Date(v)
  return null
}

export function numeroDe(item: ItemDoMock, refId: string): number | null {
  const v = bruto(item, refId)
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

/** Início do balde de data, que vira a chave ordenável do grupo. */
function balde(d: Date, g: Granularidade): Date {
  switch (g) {
    case 'dia': return inicioDoDia(d)
    case 'semana': {
      const x = inicioDoDia(d)
      const dow = (x.getDay() + 6) % 7 // semana começa na segunda
      return new Date(x.getTime() - dow * DIA)
    }
    case 'mes': return new Date(d.getFullYear(), d.getMonth(), 1)
    case 'trimestre': return new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1)
    case 'ano': return new Date(d.getFullYear(), 0, 1)
  }
}

function proximoBalde(d: Date, g: Granularidade): Date {
  switch (g) {
    case 'dia': return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    case 'semana': return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7)
    case 'mes': return new Date(d.getFullYear(), d.getMonth() + 1, 1)
    case 'trimestre': return new Date(d.getFullYear(), d.getMonth() + 3, 1)
    case 'ano': return new Date(d.getFullYear() + 1, 0, 1)
  }
}

export function rotuloDoBalde(d: Date, g: Granularidade, locale: string): string {
  switch (g) {
    case 'dia': return d.toLocaleDateString(locale, { day: '2-digit', month: 'short' })
    case 'semana': return d.toLocaleDateString(locale, { day: '2-digit', month: 'short' })
    case 'mes': return d.toLocaleDateString(locale, { month: 'short', year: '2-digit' })
    case 'trimestre': return `T${Math.floor(d.getMonth() / 3) + 1} ${String(d.getFullYear()).slice(2)}`
    case 'ano': return String(d.getFullYear())
  }
}

/** As chaves de grupo de um item num campo: 1 para campo simples, várias para múltipla seleção. */
function chavesDo(item: ItemDoMock, campo: CampoDoMock, g: Granularidade): string[] {
  const v = bruto(item, campo.refId)
  if (ehData(campo)) {
    const d = comoData(v)
    return d ? [String(balde(d, g).getTime())] : [VAZIO]
  }
  if (Array.isArray(v)) return v.length ? v : [VAZIO]
  if (v === null || v === undefined || v === '') return [VAZIO]
  return [String(v)]
}

export interface RotulosDoMotor {
  vazio: string
  outros: string
  sim: string
  nao: string
  locale: string
}

export function rotuloDaChave(campo: CampoDoMock, chave: string, g: Granularidade, r: RotulosDoMotor): string {
  if (chave === VAZIO) return r.vazio
  if (chave === OUTROS) return r.outros
  if (ehData(campo)) return rotuloDoBalde(new Date(Number(chave)), g, r.locale)
  if (campo.type === 'inputSwitch') return chave === 'true' ? r.sim : r.nao
  if (campo.type === 'EnRel' || campo.type === 'EnRelMulti') {
    const rel = itemPorId.get(Number(chave))
    const cat = rel && categoriaPorSlug.get(rel.categoria)
    return rel && cat ? String(rel.data[cat.display] ?? rel.reference) : chave
  }
  return campo.options?.find(o => o.value === chave)?.label ?? chave
}

/* --------------------------------- condições -------------------------------- */

function passa(item: ItemDoMock, c: Condicao, categoria: CategoriaDoMock): boolean {
  const campo = categoria.campos.find(x => x.refId === c.campo)
  if (!campo) return true
  const v = bruto(item, c.campo)
  const vazio = v === null || v === undefined || v === '' || (Array.isArray(v) && !v.length)
  switch (c.operador) {
    case 'preenchido': return !vazio
    case 'vazio': return vazio
    case 'igual': return Array.isArray(v) ? v.includes(c.valor ?? '') : String(v ?? '') === c.valor
    case 'diferente': return Array.isArray(v) ? !v.includes(c.valor ?? '') : String(v ?? '') !== c.valor
    case 'maior': return typeof v === 'number' && v > Number(c.valor)
    case 'menor': return typeof v === 'number' && v < Number(c.valor)
  }
}

/* ------------------------------- campos comuns ------------------------------ */

/**
 * O campo comum que o filtro do dashboard usa: mesmo nome e mesmo tipo em mais de uma
 * categoria (a "Unidade" de Contratos, Clientes e Chamados). Relação conta também na
 * própria categoria de destino: o filtro "Cliente" vale em Clientes pelo próprio item.
 */
export interface CampoComum {
  chave: string
  nome: string
  campo: CampoDoMock
  /** Slug da categoria e refId do campo em cada uma que tem. */
  em: Record<string, string>
}

export function chaveComum(c: CampoDoMock) {
  return `${c.name}|${c.type}|${c.relacao ?? ''}`
}

export function camposComuns(slugs: string[]): CampoComum[] {
  const mapa = new Map<string, CampoComum>()
  for (const slug of slugs) {
    const cat = categoriaPorSlug.get(slug)
    if (!cat) continue
    for (const campo of cat.campos) {
      if (!ehDimensao(campo) || ehData(campo)) continue
      const chave = chaveComum(campo)
      const atual = mapa.get(chave) ?? { chave, nome: campo.name, campo, em: {} }
      atual.em[slug] = campo.refId
      mapa.set(chave, atual)
    }
  }
  for (const comum of mapa.values()) {
    const destino = comum.campo.relacao
    if (destino && slugs.includes(destino)) comum.em[destino] = '__proprio'
  }
  return [...mapa.values()].filter(c => Object.keys(c.em).length >= 2)
}

/** As opções de um campo comum para o filtro: opção, membro ou item relacionado. */
export function opcoesDoComum(c: CampoComum): { value: string, label: string }[] {
  if (c.campo.relacao) {
    const cat = categoriaPorSlug.get(c.campo.relacao)!
    return ITENS.filter(i => i.categoria === c.campo.relacao)
      .map(i => ({ value: String(i.id), label: String(i.data[cat.display] ?? i.reference) }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }
  return c.campo.options ?? []
}

/* ---------------------------------- funções -------------------------------- */

export function aplicarFuncao(f: Funcao, ids: number[], medida?: string): number {
  if (f === 'contagem' || !medida) return ids.length
  const itens = ids.map(id => itemPorId.get(id)!).filter(Boolean)
  if (f === 'distintos') return new Set(itens.map(i => JSON.stringify(bruto(i, medida) ?? null))).size
  const nums = itens.map(i => numeroDe(i, medida)).filter((n): n is number => n !== null)
  if (!nums.length) return 0
  switch (f) {
    case 'soma': return nums.reduce((s, n) => s + n, 0)
    case 'media': return nums.reduce((s, n) => s + n, 0) / nums.length
    case 'minimo': return Math.min(...nums)
    case 'maximo': return Math.max(...nums)
    case 'mediana': {
      const o = [...nums].sort((a, b) => a - b)
      const m = Math.floor(o.length / 2)
      return o.length % 2 ? o[m]! : (o[m - 1]! + o[m]!) / 2
    }
  }
}

/* ---------------------------------- o motor -------------------------------- */

export interface Contexto {
  periodo: Periodo
  filtros: FiltroDoDashboard[]
  comuns: CampoComum[]
  rotulos: RotulosDoMotor
}

/** Os itens que o painel conta, antes de agrupar: categoria, condições, período e filtros do topo. */
export function recorte(cfg: ConfigDoPainel, ctx: Contexto): { ids: number[], filtrosIgnorados: string[] } {
  const cat = categoriaPorSlug.get(cfg.categoria)
  if (!cat) return { ids: [], filtrosIgnorados: [] }
  const janela = cfg.periodo === 'dashboard' ? intervalo(ctx.periodo) : null
  const ignorados: string[] = []
  const aplicaveis: { refId: string, valores: string[] }[] = []
  for (const f of ctx.filtros) {
    if (!f.valores.length) continue
    const comum = ctx.comuns.find(c => c.chave === f.chave)
    const refId = comum?.em[cfg.categoria]
    if (!comum) continue
    if (!refId) ignorados.push(comum.nome)
    else aplicaveis.push({ refId, valores: f.valores })
  }
  const ids: number[] = []
  for (const item of ITENS) {
    if (item.categoria !== cfg.categoria) continue
    if (janela) {
      const d = comoData(bruto(item, cfg.campoDeData))
      if (!d || d < janela.from || d > janela.to) continue
    }
    if (cfg.condicoes.length) {
      const ok = cfg.juncao === 'e'
        ? cfg.condicoes.every(c => passa(item, c, cat))
        : cfg.condicoes.some(c => passa(item, c, cat))
      if (!ok) continue
    }
    let dentro = true
    for (const f of aplicaveis) {
      const v = f.refId === '__proprio' ? String(item.id) : bruto(item, f.refId)
      const lista = Array.isArray(v) ? v : [String(v ?? '')]
      if (!lista.some(x => f.valores.includes(x))) { dentro = false; break }
    }
    if (dentro) ids.push(item.id)
  }
  return { ids, filtrosIgnorados: ignorados }
}

export function agregar(cfg: ConfigDoPainel, ctx: Contexto): Resultado {
  const { ids, filtrosIgnorados } = recorte(cfg, ctx)
  const total = aplicarFuncao(cfg.funcao, ids, cfg.medida)
  const dim = campoDe(cfg.categoria, cfg.agruparPor)
  const base: Resultado = { grupos: [], quebras: [], total, itens: ids.length, ids, multiplo: false, emOutros: 0, filtrosIgnorados }
  if (!dim || cfg.visualizacao === 'numero') return base

  const quebra = campoDe(cfg.categoria, cfg.quebrarPor)
  const g = cfg.granularidade
  const porGrupo = new Map<string, Set<number>>()
  const porParte = new Map<string, Map<string, Set<number>>>()
  const chavesDeQuebra = new Set<string>()

  for (const id of ids) {
    const item = itemPorId.get(id)!
    const ks = chavesDo(item, dim, g)
    const qs = quebra ? chavesDo(item, quebra, g) : []
    for (const k of ks) {
      if (!porGrupo.has(k)) porGrupo.set(k, new Set())
      porGrupo.get(k)!.add(id)
      for (const q of qs) {
        chavesDeQuebra.add(q)
        if (!porParte.has(k)) porParte.set(k, new Map())
        const m = porParte.get(k)!
        if (!m.has(q)) m.set(q, new Set())
        m.get(q)!.add(id)
      }
    }
  }

  /* Linha e área no tempo: os baldes vazios do período entram com zero. */
  if (ehData(dim) && cfg.periodo === 'dashboard') {
    const { from, to } = intervalo(ctx.periodo)
    for (let d = balde(from, g); d <= to; d = proximoBalde(d, g)) {
      const k = String(d.getTime())
      if (!porGrupo.has(k)) porGrupo.set(k, new Set())
    }
  }

  const ordemDasOpcoes = (c: CampoDoMock, k: string) => {
    if (k === VAZIO) return 1e9
    const i = c.options?.findIndex(o => o.value === k) ?? -1
    return i < 0 ? 1e8 : i
  }

  let grupos: Grupo[] = [...porGrupo.entries()].map(([chave, set]) => {
    const lista = [...set]
    const partes: Record<string, number> = {}
    const idsDaParte: Record<string, number[]> = {}
    for (const [q, s] of porParte.get(chave) ?? []) {
      idsDaParte[q] = [...s]
      partes[q] = aplicarFuncao(cfg.funcao, idsDaParte[q]!, cfg.medida)
    }
    return { chave, rotulo: rotuloDaChave(dim, chave, g, ctx.rotulos), valor: aplicarFuncao(cfg.funcao, lista, cfg.medida), ids: lista, partes, idsDaParte }
  })

  /* Opção que existe e ficou sem item também aparece, com zero (só lista de opções, sem filtro de valor). */
  if (dim.options && !ehData(dim) && dim.refId !== 'user' && !cfg.condicoes.some(c => c.campo === dim.refId)) {
    for (const o of dim.options) {
      if (!porGrupo.has(o.value)) grupos.push({ chave: o.value, rotulo: o.label, valor: 0, ids: [], partes: {}, idsDaParte: {} })
    }
  }

  const ordem: Ordem = ehData(dim) ? 'natural' : cfg.ordem
  grupos.sort((a, b) => {
    if (a.chave === VAZIO && ordem !== 'valorDesc' && ordem !== 'valorAsc') return 1
    if (b.chave === VAZIO && ordem !== 'valorDesc' && ordem !== 'valorAsc') return -1
    switch (ordem) {
      case 'valorDesc': return b.valor - a.valor
      case 'valorAsc': return a.valor - b.valor
      case 'rotulo': return a.rotulo.localeCompare(b.rotulo, ctx.rotulos.locale)
      case 'natural':
        if (ehData(dim)) return Number(a.chave) - Number(b.chave)
        if (dim.options) return ordemDasOpcoes(dim, a.chave) - ordemDasOpcoes(dim, b.chave)
        return b.valor - a.valor
    }
  })

  /* Sem valor e zero no funil não ajudam: o funil mostra só as etapas. */
  if (cfg.visualizacao === 'funil') grupos = grupos.filter(x => x.chave !== VAZIO)
  /*
   * Funil: cada etapa conta quem chegou até ela, ou seja, os itens que estão nela
   * e nas etapas seguintes. Contar só o status atual dá "181% da etapa anterior".
   */
  if (cfg.visualizacao === 'funil' && (cfg.funcao === 'contagem' || cfg.funcao === 'soma')) {
    for (let i = grupos.length - 2; i >= 0; i--) {
      const g = grupos[i]!
      const seguinte = grupos[i + 1]!
      grupos[i] = { ...g, valor: g.valor + seguinte.valor, ids: [...g.ids, ...seguinte.ids] }
    }
  }

  let emOutros = 0
  if (cfg.limite > 0 && grupos.length > cfg.limite && !ehData(dim)) {
    const ficam = grupos.slice(0, cfg.limite)
    const resto = grupos.slice(cfg.limite)
    emOutros = resto.length
    const idsResto = [...new Set(resto.flatMap(x => x.ids))]
    const partes: Record<string, number> = {}
    const idsDaParte: Record<string, number[]> = {}
    for (const q of chavesDeQuebra) {
      idsDaParte[q] = [...new Set(resto.flatMap(x => x.idsDaParte[q] ?? []))]
      partes[q] = aplicarFuncao(cfg.funcao, idsDaParte[q]!, cfg.medida)
    }
    grupos = [...ficam, { chave: OUTROS, rotulo: ctx.rotulos.outros, valor: aplicarFuncao(cfg.funcao, idsResto, cfg.medida), ids: idsResto, partes, idsDaParte }]
  }

  const quebras = quebra
    ? [...chavesDeQuebra]
        .sort((a, b) => (quebra.options ? ordemDasOpcoes(quebra, a) - ordemDasOpcoes(quebra, b) : a.localeCompare(b)))
        .map(chave => ({ chave, rotulo: rotuloDaChave(quebra, chave, g, ctx.rotulos) }))
    : []

  return { ...base, grupos, quebras, multiplo: ehMultiplo(dim) || (!!quebra && ehMultiplo(quebra)), emOutros }
}

/* ------------------------------ sugestão de gráfico ------------------------- */

/** As visualizações que fazem sentido com o dado escolhido, a sugerida primeiro. */
export function visualizacoesPossiveis(cfg: Pick<ConfigDoPainel, 'categoria' | 'agruparPor' | 'quebrarPor' | 'funcao'>): { possiveis: Visualizacao[], sugerida: Visualizacao } {
  const dim = campoDe(cfg.categoria, cfg.agruparPor)
  if (!dim) return { possiveis: ['numero'], sugerida: 'numero' }
  const comQuebra = !!cfg.quebrarPor
  if (ehData(dim)) return { possiveis: ['linha', 'area', 'barras', 'tabela'], sugerida: comQuebra ? 'area' : 'linha' }
  const muitos = dim.type === 'EnRel' || dim.type === 'EnRelMulti' || dim.refId === 'user' || (dim.options?.length ?? 0) > 8
  const possiveis: Visualizacao[] = ['barras', 'barrasHorizontais', 'tabela']
  if (!comQuebra && !muitos && (dim.options?.length ?? 2) <= 6) possiveis.push('rosca')
  if (!comQuebra && dim.options && !ehMultiplo(dim) && (cfg.funcao === 'contagem' || cfg.funcao === 'soma')) possiveis.push('funil')
  return { possiveis, sugerida: muitos ? 'barrasHorizontais' : 'barras' }
}

/** Painel novo: contagem da categoria, sem agrupamento, seguindo o período do topo. */
export function painelEmBranco(id: string, categoria = CATEGORIAS[0]!.slug): ConfigDoPainel {
  return {
    id,
    titulo: '',
    categoria,
    funcao: 'contagem',
    granularidade: 'mes',
    condicoes: [],
    juncao: 'e',
    periodo: 'dashboard',
    campoDeData: 'created_at',
    visualizacao: 'numero',
    ordem: 'natural',
    limite: 10,
    mostrarValores: false,
    w: 3,
    h: 2,
  }
}
