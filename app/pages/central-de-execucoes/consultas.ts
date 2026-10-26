/**
 * As consultas que as telas da central fazem sobre o mock. No produto, cada uma vira uma rota ou um
 * parâmetro de rota (perguntas P1 a P11 do relatório); aqui, filtro de array em memória.
 *
 * Fase 2 é a proposta inteira, com a cadeia (`lineage`, `raiz`, `gravou`). Fase 1 é o que o backend
 * já guarda: sem cadeia, sem o que cada execução gravou, e a busca por item só acha as execuções
 * com o item ligado direto (`link_item`).
 */
import type { CausaId, Evento, Execucao, Fluxo, ItemDoMock } from './mocks'
import { AGORA, categorias, fluxos, responsavelDaTarefa, todasAsExecucoes, todosOsItens } from './mocks'
import { fluxosDaOperacao, operacoes } from './operacoes'
import type { LigacaoManual } from './ligacoes'
import { ajusteDe, manuais } from './ligacoes'
import type { GrupoDeStatus, Textos, TipoDeDisparo } from './textos'

export type Fase = 1 | 2
export type Periodo = 'h24' | 'd7'
export type Cenario = 'operacao' | 'emDia' | 'vazio' | 'parcial' | 'carregando' | 'erro'

const HORA = 3_600_000
const DIA = 24 * HORA
export const AGORA_MS = AGORA.getTime()
export const duracaoDoPeriodo = (p: Periodo) => (p === 'h24' ? DIA : 7 * DIA)

export const fluxoPorId = new Map(fluxos.map(f => [f.id, f]))
export const itemPorId = new Map(todosOsItens.map(i => [i.id, i]))
export const execPorId = new Map(todasAsExecucoes.map(e => [e.id, e]))

/* ------------------------------------------------------------------ *
 * O conjunto de dados de cada cenário do andaime                      *
 * ------------------------------------------------------------------ */

export interface Dados {
  fluxos: Fluxo[]
  execucoes: Execucao[]
  /** Quantos fluxos o workspace tem, para o aviso de acesso parcial. */
  totalDeFluxos: number
}

export function dadosDoCenario(c: Cenario): Dados {
  if (c === 'vazio') return { fluxos, execucoes: [], totalDeFluxos: fluxos.length }
  if (c === 'parcial') {
    const visiveis = fluxos.filter(f => !f.restrito)
    const ids = new Set(visiveis.map(f => f.id))
    return { fluxos: visiveis, execucoes: todasAsExecucoes.filter(e => ids.has(e.workflow as number)), totalDeFluxos: fluxos.length }
  }
  if (c === 'emDia') {
    // a mesma operação, com as falhas já reprocessadas e concluídas
    return {
      fluxos,
      execucoes: todasAsExecucoes.map(e => (e.status === 'error' || e.status === 'stopped')
        ? { ...e, status: 'completed', causa: undefined, motivo: undefined, no_com_erro: undefined } as Execucao
        : e),
      totalDeFluxos: fluxos.length,
    }
  }
  return { fluxos, execucoes: todasAsExecucoes, totalDeFluxos: fluxos.length }
}

/* ------------------------------------------------------------------ *
 * Status                                                              *
 * ------------------------------------------------------------------ */

export function grupoDe(e: Execucao): GrupoDeStatus {
  if (e.status === 'working') return e.esperando ? 'esperando' : 'rodando'
  if (e.status === 'queued') return 'esperando'
  if (e.status === 'error') return 'erro'
  if (e.status === 'stopped' || e.status === 'held') return 'parada'
  return 'concluida'
}

/** O filtro da lista global. Os números da Visão geral abrem a lista com ele preenchido. */
export interface FiltroDaLista {
  grupos: GrupoDeStatus[]
  fluxos: number[]
  /** O id da operação (`operacoes.ts`). */
  operacao?: string
  disparo?: TipoDeDisparo
  item?: number
  comCadeia: boolean
  soOrigem: boolean
  periodo?: Periodo
}

export const filtroVazio = (): FiltroDaLista => ({ grupos: [], fluxos: [], comCadeia: true, soOrigem: true })

/** O resumo de cada cadeia, pela origem: o que a lista "Só a origem" usa para filtrar e contar. */
export function resumoDasCadeias(execs: Execucao[]) {
  const m = new Map<number, { n: number, grupos: Set<GrupoDeStatus>, fluxos: Set<number>, erros: number }>()
  for (const e of execs) {
    const o = origemDe(e)
    const r = m.get(o) ?? { n: 0, grupos: new Set(), fluxos: new Set(), erros: 0 }
    r.n++
    r.grupos.add(grupoDe(e))
    r.fluxos.add(e.workflow as number)
    if (grupoDe(e) === 'erro' || grupoDe(e) === 'parada') r.erros++
    m.set(o, r)
  }
  return m
}

/**
 * Filtra a lista. Com "Só a origem de cada cadeia", cada cadeia vira uma linha (a da origem) e os
 * filtros de status, fluxo e operação valem para qualquer execução da cadeia: a cadeia que falhou
 * no 5º passo continua aparecendo em "Com erro".
 */
export function aplicarFiltro(execs: Execucao[], f: FiltroDaLista, fase: Fase, busca = ''): Execucao[] {
  let lista = f.periodo ? noPeriodo(execs, f.periodo) : execs
  const porCadeia = !f.item && f.soOrigem && fase === 2
  const resumo = porCadeia ? resumoDasCadeias(lista) : undefined
  const membros = (e: Execucao) => resumo?.get(e.id)
  if (f.item) {
    const item = itemPorId.get(f.item)
    lista = item ? jornadaDoItem(item, lista, fase, f.comCadeia).reverse() : []
  }
  else if (porCadeia) lista = lista.filter(e => e.input.workflow_timeline.lineage.length === 0)
  if (f.grupos.length) lista = lista.filter(e => (membros(e) ? [...membros(e)!.grupos].some(g => f.grupos.includes(g)) : f.grupos.includes(grupoDe(e))))
  if (f.fluxos.length) lista = lista.filter(e => (membros(e) ? [...membros(e)!.fluxos].some(id => f.fluxos.includes(id)) : f.fluxos.includes(e.workflow as number)))
  if (f.operacao) {
    const ids = new Set(fluxosDaOperacao(f.operacao, fluxos).map(x => x.id))
    const daOperacao = (id: number) => ids.has(id)
    lista = lista.filter(e => (membros(e) ? [...membros(e)!.fluxos].some(daOperacao) : daOperacao(e.workflow as number)))
  }
  if (f.disparo) lista = lista.filter(e => tipoDoDisparo(e) === f.disparo)
  const q = busca.trim().toLowerCase()
  if (q) {
    lista = lista.filter(e => e.title?.toLowerCase().includes(q)
      || e.reference?.toLowerCase().includes(q)
      || fluxoPorId.get(e.workflow as number)?.name.toLowerCase().includes(q)
      || (e.item && itemPorId.get(e.item)?.reference?.toLowerCase().includes(q)))
  }
  return lista
}

export const ordemDosGrupos: GrupoDeStatus[] =['rodando', 'esperando', 'erro', 'parada', 'concluida']

export const estiloDoGrupo: Record<GrupoDeStatus, { cor: 'success' | 'info' | 'error' | 'neutral' | 'warning', icone: string }> = {
  rodando: { cor: 'info', icone: 'i-lucide-loader' },
  esperando: { cor: 'warning', icone: 'i-lucide-hourglass' },
  concluida: { cor: 'success', icone: 'i-lucide-circle-check' },
  erro: { cor: 'error', icone: 'i-lucide-circle-x' },
  parada: { cor: 'error', icone: 'i-lucide-octagon-x' },
}

/** A linha embaixo do status: o motivo, em palavras. */
export function motivoDoStatus(e: Execucao, t: Textos): string | undefined {
  if (e.status === 'error' && e.causa) return t.causas[e.causa].titulo
  if (e.status === 'stopped' && e.motivo) return t.motivos[e.motivo]
  if (e.status === 'queued' && e.motivo) return t.motivos[e.motivo]
  if (e.esperando === 'tarefa') return t.esperando.tarefa(responsavelDaTarefa[e.workflow as number])
  if (e.esperando === 'atraso') return t.esperando.atraso
  return undefined
}

/* ------------------------------------------------------------------ *
 * Quem disparou                                                       *
 * ------------------------------------------------------------------ */

export function tipoDoDisparo(e: Execucao): TipoDeDisparo {
  const d = e.disparo
  if (d.tipo === 'manual') return 'pessoa'
  if (d.tipo === 'agendamento') return 'agendamento'
  if (d.tipo === 'webhook') return 'webhook'
  if (d.tipo === 'email') return 'email'
  return d.porExecucao ? 'fluxo' : 'pessoa'
}

export const iconeDoDisparo: Record<TipoDeDisparo, string> = {
  pessoa: 'i-lucide-user-round',
  fluxo: 'i-lucide-workflow',
  agendamento: 'i-lucide-calendar-clock',
  webhook: 'i-lucide-webhook',
  email: 'i-lucide-mail',
}

export const textoDoEvento = (ev: Evento, t: Textos) => t.evento(categorias[ev.categoria], ev.acao)

/** O texto da coluna "Disparada por". Na fase 1 não se sabe qual fluxo gravou o item. */
export function descreverDisparo(e: Execucao, t: Textos, fase: Fase): { icone: string, texto: string, detalhe?: string } {
  const d = e.disparo
  const tipo = tipoDoDisparo(e)
  if (d.tipo === 'manual') return { icone: iconeDoDisparo.pessoa, texto: t.disparo.manual(d.pessoa) }
  if (d.tipo === 'agendamento') return { icone: iconeDoDisparo.agendamento, texto: t.disparo.agendamento(d.rotulo) }
  if (d.tipo === 'webhook') return { icone: iconeDoDisparo.webhook, texto: t.disparo.webhook }
  if (d.tipo === 'email') return { icone: iconeDoDisparo.email, texto: t.disparo.email }
  const evento = textoDoEvento(d.evento, t)
  if (d.pessoa) return { icone: iconeDoDisparo.pessoa, texto: t.disparo.porPessoa(evento, d.pessoa) }
  if (tipo === 'fluxo' && fase === 2 && d.porExecucao) {
    const causa = execPorId.get(d.porExecucao)
    const f = causa && fluxoPorId.get(causa.workflow as number)
    return { icone: iconeDoDisparo.fluxo, texto: t.disparo.porFluxo(f?.name ?? ''), detalhe: evento }
  }
  return { icone: 'i-lucide-zap', texto: t.disparo.soEvento(evento) }
}

/* ------------------------------------------------------------------ *
 * Cadeia                                                              *
 * ------------------------------------------------------------------ */

export const origemDe = (e: Execucao) => e.input.workflow_timeline.lineage[0] ?? e.id
export const passoDe = (e: Execucao) => e.input.workflow_timeline.lineage.length + 1

/** Quantas execuções cada origem tem na cadeia dela (a própria incluída). */
export function tamanhoDasCadeias(execs: Execucao[]) {
  const m = new Map<number, number>()
  for (const e of execs) m.set(origemDe(e), (m.get(origemDe(e)) ?? 0) + 1)
  return m
}

export interface PassoDaCadeia { e: Execucao, nivel: number, fluxo: Fluxo, inicio: number, fim: number }

/** A cadeia inteira de uma execução, da origem à última, na ordem em que começaram. */
export function cadeiaDe(alvo: Execucao, execs: Execucao[]) {
  const origem = origemDe(alvo)
  const membros = execs
    .filter(e => e.id === origem || e.input.workflow_timeline.lineage[0] === origem)
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
  const passos: PassoDaCadeia[] = membros.map(e => ({
    e,
    nivel: e.input.workflow_timeline.lineage.length,
    fluxo: fluxoPorId.get(e.workflow as number)!,
    inicio: e.created_at.getTime(),
    fim: (e.stopped_at ?? e.created_at).getTime(),
  }))
  const inicio = passos[0]?.inicio ?? alvo.created_at.getTime()
  // O fim é o último passo que aconteceu, igual à tela do item. A espera em aberto não estica a cadeia:
  // a barra dela vai até a borda e fica listrada.
  const fim = Math.max(inicio, ...passos.map(p => p.fim))
  for (const p of passos) if (['rodando', 'esperando'].includes(grupoDe(p.e))) p.fim = fim
  return {
    origem: execPorId.get(origem) ?? alvo,
    passos,
    inicio,
    fim,
    fluxos: new Set(passos.map(p => p.fluxo.id)).size,
    emAndamento: passos.some(p => ['rodando', 'esperando'].includes(grupoDe(p.e))),
    parada: passos.find(p => p.e.status === 'stopped'),
  }
}

/* ------------------------------------------------------------------ *
 * Período, números e gráficos                                         *
 * ------------------------------------------------------------------ */

export const noPeriodo = (execs: Execucao[], p: Periodo, deslocamento = 0) => {
  const fim = AGORA_MS - deslocamento * duracaoDoPeriodo(p)
  const inicio = fim - duracaoDoPeriodo(p)
  return execs.filter(e => { const t = e.created_at.getTime(); return t > inicio && t <= fim })
}

export function numeros(execs: Execucao[], p: Periodo) {
  const atual = noPeriodo(execs, p)
  const anterior = noPeriodo(execs, p, 1)
  const conta = (lista: Execucao[], g: GrupoDeStatus) => lista.filter(e => grupoDe(e) === g).length
  const agora = execs.filter(e => ['rodando', 'esperando'].includes(grupoDe(e)))
  return {
    total: atual.length,
    rodando: agora.filter(e => grupoDe(e) === 'rodando').length,
    esperandoPessoa: agora.filter(e => e.esperando === 'tarefa').length,
    naFila: agora.filter(e => e.status === 'queued').length,
    esperando: agora.filter(e => grupoDe(e) === 'esperando').length,
    erro: { n: conta(atual, 'erro'), delta: conta(atual, 'erro') - conta(anterior, 'erro') },
    concluidas: { n: conta(atual, 'concluida'), delta: conta(atual, 'concluida') - conta(anterior, 'concluida') },
    paradas: { n: conta(atual, 'parada'), delta: conta(atual, 'parada') - conta(anterior, 'parada') },
  }
}

export interface Barra { inicio: number, rotulo: string, concluidas: number, erro: number, outras: number }

/** Execuções por dia (7 dias) ou por hora (24 horas). */
export function serie(execs: Execucao[], p: Periodo, locale: string): Barra[] {
  const passo = p === 'h24' ? HORA : DIA
  const n = p === 'h24' ? 24 : 7
  const fimDoBalde = (() => {
    const d = new Date(AGORA)
    if (p === 'h24') d.setMinutes(0, 0, 0)
    else d.setHours(0, 0, 0, 0)
    return d.getTime() + passo
  })()
  const formato = new Intl.DateTimeFormat(locale, p === 'h24' ? { hour: '2-digit' } : { weekday: 'short', day: '2-digit' })
  const barras: Barra[] = Array.from({ length: n }, (_, k) => {
    const inicio = fimDoBalde - (n - k) * passo
    return { inicio, rotulo: formato.format(inicio), concluidas: 0, erro: 0, outras: 0 }
  })
  for (const e of execs) {
    const k = Math.floor((e.created_at.getTime() - (fimDoBalde - n * passo)) / passo)
    const b = barras[k]
    if (!b) continue
    const g = grupoDe(e)
    if (g === 'concluida') b.concluidas++
    else if (g === 'erro' || g === 'parada') b.erro++
    else b.outras++
  }
  return barras
}

export function fluxosComMaisFalhas(execs: Execucao[], p: Periodo, quantos = 5) {
  const m = new Map<number, number>()
  for (const e of noPeriodo(execs, p)) {
    if (grupoDe(e) !== 'erro' && grupoDe(e) !== 'parada') continue
    m.set(e.workflow as number, (m.get(e.workflow as number) ?? 0) + 1)
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, quantos)
    .map(([id, n]) => ({ fluxo: fluxoPorId.get(id)!, n }))
}

/* ------------------------------------------------------------------ *
 * Precisa de atenção                                                  *
 * ------------------------------------------------------------------ */

export interface Problema {
  fluxo: Fluxo
  causa: CausaId | 'cadeia'
  falhas: Execucao[]
  desde: Date
  ultima: Execucao
  ultimoItem?: ItemDoMock
}

/** Uma linha por fluxo com falha ou parada no período, a mais recente primeiro. */
export function problemas(execs: Execucao[], p: Periodo): Problema[] {
  const porFluxo = new Map<number, Execucao[]>()
  for (const e of noPeriodo(execs, p)) {
    if (e.status !== 'error' && e.status !== 'stopped') continue
    const lista = porFluxo.get(e.workflow as number) ?? []
    lista.push(e)
    porFluxo.set(e.workflow as number, lista)
  }
  return [...porFluxo.entries()].map(([id, falhas]) => {
    falhas.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    const ultima = falhas[0]!
    return {
      fluxo: fluxoPorId.get(id)!,
      causa: ultima.status === 'stopped' ? 'cadeia' as const : (ultima.causa ?? 'tempo'),
      falhas,
      desde: falhas[falhas.length - 1]!.created_at,
      ultima,
      ultimoItem: ultima.item ? itemPorId.get(ultima.item) : undefined,
    }
  }).sort((a, b) => b.ultima.created_at.getTime() - a.ultima.created_at.getTime())
}


/* ------------------------------------------------------------------ *
 * Operações                                                           *
 * ------------------------------------------------------------------ */

export function saudeDasOperacoes(d: Dados, p: Periodo) {
  const lista = problemas(d.execucoes, p)
  return operacoes.value.map((op) => {
    const fs = fluxosDaOperacao(op.id, d.fluxos)
    const ids = new Set(fs.map(f => f.id))
    const execs = noPeriodo(d.execucoes, p).filter(e => ids.has(e.workflow as number))
    const comProblema = lista.filter(x => ids.has(x.fluxo.id))
    const erros = execs.filter(e => grupoDe(e) === 'erro' || grupoDe(e) === 'parada').length
    const selo = comProblema.length === 0 ? 'ok' as const : erros / Math.max(1, execs.length) > 0.05 ? 'falha' as const : 'atencao' as const
    return { op, fluxos: fs.length, execucoes: execs.length, comProblema: comProblema.length, selo }
  }).filter(x => x.fluxos > 0)
}

/* ------------------------------------------------------------------ *
 * Busca por item e jornada                                            *
 * ------------------------------------------------------------------ */

export function buscarItens(termo: string, d: Dados, quantos = 6): ItemDoMock[] {
  const q = termo.trim().toLowerCase()
  if (q.length < 2) return []
  const comExecucao = new Set(d.execucoes.map(e => e.item).filter(Boolean))
  return todosOsItens
    .filter(i => comExecucao.has(i.id) && (i.reference!.toLowerCase().includes(q) || i.titulo.toLowerCase().includes(q)))
    // o item de origem (o contrato) vem antes dos itens que a cadeia criou
    .sort((a, b) => Number(!!a.criado_por_execucao) - Number(!!b.criado_por_execucao) || b.id - a.id)
    .slice(0, quantos)
}

/**
 * As execuções da jornada de um item. Fase 2: as que rodaram nele, as da cadeia que ele começou e
 * as que descendem delas. Fase 1: só as que rodaram direto nele.
 */
export function jornadaDoItem(item: ItemDoMock, execs: Execucao[], fase: Fase, comCadeia = true): Execucao[] {
  const diretas = execs.filter(e => e.item === item.id)
  if (fase === 1 || !comCadeia) return diretas.sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
  const ids = new Set(diretas.map(e => e.id))
  return execs
    .filter(e => ids.has(e.id) || e.raiz === item.id || e.input.workflow_timeline.lineage.some(x => ids.has(x)))
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
}

/** O que está acontecendo agora com o item, para a frase do topo. */
export function situacaoDoItem(execs: Execucao[]) {
  if (!execs.length) return { tipo: 'nenhum' as const }
  const ultimaDe = new Map<string, Execucao>()
  for (const e of execs) ultimaDe.set(`${e.workflow}:${e.item}`, e) // em ordem: fica a mais recente
  const abertas = [...ultimaDe.values()]
  const parada = abertas.find(e => e.status === 'stopped')
  const erro = abertas.filter(e => e.status === 'error').sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0]
  const esperando = abertas.find(e => e.esperando === 'tarefa')
  const rodando = abertas.find(e => e.status === 'working' || e.status === 'queued')
  const ultimoFim = Math.max(...execs.map(e => (e.stopped_at ?? e.created_at).getTime()))
  if (erro) return { tipo: 'erro' as const, e: erro }
  if (parada) return { tipo: 'parada' as const, e: parada }
  if (esperando) return { tipo: 'esperando' as const, e: esperando }
  if (rodando) return { tipo: 'rodando' as const, e: rodando }
  return { tipo: 'tudoCerto' as const, fim: ultimoFim }
}

/** As cadeias da jornada, cada uma com os passos em ordem. */
export function cadeiasDaJornada(execs: Execucao[]) {
  const grupos = new Map<number, Execucao[]>()
  for (const e of execs) {
    const o = origemDe(e)
    grupos.set(o, [...(grupos.get(o) ?? []), e])
  }
  return [...grupos.entries()]
    .map(([origem, passos]) => ({ origem, passos, inicio: passos[0]!.created_at }))
    .sort((a, b) => a.inicio.getTime() - b.inicio.getTime())
}

/* ------------------------------------------------------------------ *
 * O mapa da operação                                                  *
 * ------------------------------------------------------------------ */

export type Saude = 'ok' | 'falha' | 'parada' | 'esperando' | 'semExecucao'

export interface NoDoMapa {
  id: string
  tipo: 'fluxo' | 'evento'
  fluxo?: Fluxo
  evento?: Evento
  camada: number
  ordem: number
  x: number
  y: number
  largura: number
  altura: number
}

/**
 * - certa: a configuração garante (o nó grava sempre, o gatilho escuta);
 * - possivel: o nó que grava depende de uma condição;
 * - foraDaConfiguracao: as execuções gravaram e a configuração não mostra (fase 2);
 * - manual: alguém ligou à mão, com motivo.
 */
export type CertezaDaLigacao = 'certa' | 'possivel' | 'foraDaConfiguracao' | 'manual'

export interface LigacaoDoMapa {
  id: string
  de: string
  para: string
  /** Execuções no período que passaram por esta ligação. */
  observadas: number
  ciclo: boolean
  /** Ligação que volta para uma camada anterior. */
  volta: boolean
  certeza: CertezaDaLigacao
  /** O fluxo da ponta e o evento, para o painel. Na chamada direta, o fluxo que chama. */
  fluxo: number
  evento?: Evento
  condicao?: string
  /** Quem confirmou a ligação incerta: a pessoa, ou as execuções do período (fase 2). */
  confirmadaPor?: 'pessoa' | 'execucoes'
  manual?: LigacaoManual
}

const chaveDoEvento = (ev: Evento) => `ev:${ev.categoria}:${ev.acao}`
export const chaveDoFluxo = (id: number) => `fl:${id}`

const LARG_FLUXO = 196
const ALT_FLUXO = 68
const LARG_EVENTO = 188
const ALT_EVENTO = 30
const COLUNA = 236
const LINHA = 92

/** Monta os nós e as ligações de uma operação, em camadas da esquerda para a direita. */
export function mapaDaOperacao(op: string | undefined, d: Dados, p: Periodo, fase: Fase) {
  const fs = fluxosDaOperacao(op, d.fluxos)
  const nos = new Map<string, NoDoMapa>()
  const ligacoes: LigacaoDoMapa[] = []
  const novoNo = (id: string, tipo: NoDoMapa['tipo'], extra: Partial<NoDoMapa>) => {
    if (!nos.has(id)) {
      nos.set(id, { id, tipo, camada: 0, ordem: 0, x: 0, y: 0, largura: tipo === 'fluxo' ? LARG_FLUXO : LARG_EVENTO, altura: tipo === 'fluxo' ? ALT_FLUXO : ALT_EVENTO, ...extra })
    }
  }
  const descartadas: LigacaoDoMapa[] = []
  const execs = noPeriodo(d.execucoes, p)
  // O que as execuções do fluxo gravaram de um evento (fase 2).
  const gravadas = (f: number, ev: Evento) => fase === 2
    ? execs.filter(e => e.workflow === f).reduce((s, e) => s + e.gravou.filter(g => g.acao === ev.acao && itemPorId.get(g.item)?.categoria === ev.categoria).length, 0)
    : 0

  for (const f of fs) {
    novoNo(chaveDoFluxo(f.id), 'fluxo', { fluxo: f })
    if (f.gatilho.tipo === 'events') {
      const ev = { categoria: f.gatilho.categoria, acao: f.gatilho.acao }
      novoNo(chaveDoEvento(ev), 'evento', { evento: ev })
      const n = fase === 2 ? execs.filter(e => e.workflow === f.id && e.disparo.tipo === 'evento').length : 0
      ligacoes.push({ id: `${chaveDoEvento(ev)}>${f.id}`, de: chaveDoEvento(ev), para: chaveDoFluxo(f.id), observadas: n, ciclo: false, volta: false, certeza: 'certa', fluxo: f.id, evento: ev })
    }
    const configurados = new Set<string>()
    for (const g of f.grava) {
      const ev = { categoria: g.categoria, acao: g.acao }
      configurados.add(chaveDoEvento(ev))
      const id = `${f.id}>${chaveDoEvento(ev)}`
      const n = gravadas(f.id, ev)
      const ciclo = f.gatilho.tipo === 'events' && f.gatilho.categoria === ev.categoria && f.gatilho.acao === ev.acao
      const ajuste = ajusteDe(id)
      const l: LigacaoDoMapa = {
        id, de: chaveDoFluxo(f.id), para: chaveDoEvento(ev), observadas: n, ciclo, volta: false,
        certeza: g.condicao ? 'possivel' : 'certa', fluxo: f.id, evento: ev, condicao: g.condicao,
        confirmadaPor: ajuste?.tipo === 'confirmada' ? 'pessoa' : g.condicao && n ? 'execucoes' : undefined,
      }
      // O descarte vale enquanto as execuções não mostram a gravação. Na fase 2, o que gravou volta ao desenho.
      if (ajuste?.tipo === 'descartada' && !n) { descartadas.push(l); continue }
      novoNo(chaveDoEvento(ev), 'evento', { evento: ev })
      ligacoes.push(l)
    }
    // Fase 2: o que as execuções gravaram e a configuração não mostra.
    if (fase === 2) {
      const vistos = new Map<string, Evento>()
      for (const e of execs) {
        if (e.workflow !== f.id) continue
        for (const g of e.gravou) {
          const cat = itemPorId.get(g.item)?.categoria
          if (cat) vistos.set(chaveDoEvento({ categoria: cat, acao: g.acao }), { categoria: cat, acao: g.acao })
        }
      }
      for (const [chave, ev] of vistos) {
        if (configurados.has(chave)) continue
        const id = `${f.id}>${chave}`
        novoNo(chave, 'evento', { evento: ev })
        ligacoes.push({
          id, de: chaveDoFluxo(f.id), para: chave, observadas: gravadas(f.id, ev), ciclo: false, volta: false,
          certeza: 'foraDaConfiguracao', fluxo: f.id, evento: ev, confirmadaPor: ajusteDe(id)?.tipo === 'confirmada' ? 'pessoa' : undefined,
        })
      }
    }
  }

  // As ligações manuais entre fluxos desta operação.
  const ids = new Set(fs.map(f => f.id))
  for (const m of manuais.value) {
    if (!ids.has(m.de) || !ids.has(m.para)) continue
    if (m.evento) {
      const chave = chaveDoEvento(m.evento)
      const id = `${m.de}>${chave}`
      const existente = ligacoes.find(l => l.id === id)
      if (existente) { existente.certeza = 'manual'; existente.manual = m; continue }
      novoNo(chave, 'evento', { evento: m.evento })
      ligacoes.push({ id, de: chaveDoFluxo(m.de), para: chave, observadas: gravadas(m.de, m.evento), ciclo: false, volta: false, certeza: 'manual', fluxo: m.de, evento: m.evento, manual: m })
    }
    else {
      const daOrigem = new Set(execs.filter(e => e.workflow === m.de).map(e => e.id))
      const n = fase === 2 ? execs.filter(e => e.workflow === m.para && daOrigem.has(e.input.workflow_timeline.lineage.at(-1) ?? -1)).length : 0
      ligacoes.push({ id: `${m.de}>>${m.para}`, de: chaveDoFluxo(m.de), para: chaveDoFluxo(m.para), observadas: n, ciclo: false, volta: false, certeza: 'manual', fluxo: m.de, manual: m })
    }
  }

  // Camadas: caminho mais longo, ignorando as ligações que fecham ciclo (DFS).
  const saidas = new Map<string, LigacaoDoMapa[]>()
  for (const l of ligacoes) saidas.set(l.de, [...(saidas.get(l.de) ?? []), l])
  const estado = new Map<string, 1 | 2>()
  const visitar = (id: string) => {
    estado.set(id, 1)
    for (const l of saidas.get(id) ?? []) {
      if (estado.get(l.para) === 1) { l.volta = true; continue }
      if (!estado.has(l.para)) visitar(l.para)
    }
    estado.set(id, 2)
  }
  const entradas = (id: string) => ligacoes.filter(l => l.para === id && !l.volta)
  const fontes = [...nos.keys()].filter(id => !ligacoes.some(l => l.para === id))
  for (const id of [...fontes, ...nos.keys()]) if (!estado.has(id)) visitar(id)

  const ordemTopologica: string[] = []
  const grau = new Map([...nos.keys()].map(id => [id, entradas(id).length]))
  const fila = [...nos.keys()].filter(id => grau.get(id) === 0)
  while (fila.length) {
    const id = fila.shift()!
    ordemTopologica.push(id)
    for (const l of saidas.get(id) ?? []) {
      if (l.volta) continue
      grau.set(l.para, grau.get(l.para)! - 1)
      if (grau.get(l.para) === 0) fila.push(l.para)
    }
  }
  for (const id of ordemTopologica) {
    const n = nos.get(id)!
    n.camada = Math.max(0, ...entradas(id).map(l => nos.get(l.de)!.camada + 1))
  }
  // empurra para a direita quem só alimenta os seguintes (o webhook fica perto do que ele grava)
  for (const id of [...ordemTopologica].reverse()) {
    const seguintes = (saidas.get(id) ?? []).filter(l => !l.volta).map(l => nos.get(l.para)!.camada)
    if (seguintes.length) nos.get(id)!.camada = Math.max(nos.get(id)!.camada, Math.min(...seguintes) - 1)
  }

  // Ordem dentro da camada: média da posição de quem chega (uma passada), depois os soltos.
  const camadas = new Map<number, NoDoMapa[]>()
  for (const id of ordemTopologica) {
    const n = nos.get(id)!
    camadas.set(n.camada, [...(camadas.get(n.camada) ?? []), n])
  }
  const maxCamada = Math.max(0, ...camadas.keys())
  let alturaTotal = 0
  for (let c = 0; c <= maxCamada; c++) {
    const lista = camadas.get(c) ?? []
    const pos = (n: NoDoMapa) => {
      const ant = entradas(n.id).map(l => nos.get(l.de)!).filter(x => x.camada < c)
      return ant.length ? ant.reduce((s, x) => s + x.ordem, 0) / ant.length : 999 + (n.fluxo?.id ?? 0)
    }
    lista.sort((a, b) => pos(a) - pos(b))
    lista.forEach((n, k) => { n.ordem = k })
    alturaTotal = Math.max(alturaTotal, lista.length)
  }
  for (const [c, lista] of camadas) {
    const deslocamento = ((alturaTotal - lista.length) * LINHA) / 2
    lista.forEach((n, k) => {
      n.x = 24 + c * COLUNA + (LARG_FLUXO - n.largura) / 2
      n.y = 24 + deslocamento + k * LINHA + (ALT_FLUXO - n.altura) / 2
    })
  }

  // Saúde de cada fluxo no período.
  const saude = new Map<number, { saude: Saude, execs: number, erros: number, ultimaFalha?: Execucao }>()
  for (const f of fs) {
    const doFluxo = execs.filter(e => e.workflow === f.id)
    const erros = doFluxo.filter(e => e.status === 'error')
    const paradas = doFluxo.filter(e => e.status === 'stopped')
    const esperando = d.execucoes.some(e => e.workflow === f.id && e.esperando === 'tarefa')
    saude.set(f.id, {
      saude: paradas.length ? 'parada' : erros.length ? 'falha' : esperando ? 'esperando' : doFluxo.length ? 'ok' : 'semExecucao',
      execs: doFluxo.length,
      erros: erros.length + paradas.length,
      ultimaFalha: [...erros, ...paradas].sort((a, b) => b.created_at.getTime() - a.created_at.getTime())[0],
    })
  }

  return {
    nos: [...nos.values()],
    ligacoes,
    descartadas,
    saude,
    largura: 24 * 2 + (maxCamada + 1) * COLUNA - (COLUNA - LARG_FLUXO),
    altura: 24 * 2 + alturaTotal * LINHA,
  }
}

/** Os fluxos que gravam e os que escutam um evento, para o painel do mapa. */
export function vizinhosDoEvento(ev: Evento, fs: Fluxo[]) {
  return {
    gravam: fs.filter(f => f.grava.some(g => g.categoria === ev.categoria && g.acao === ev.acao)),
    escutam: fs.filter(f => f.gatilho.tipo === 'events' && f.gatilho.categoria === ev.categoria && f.gatilho.acao === ev.acao),
  }
}

/* ------------------------------------------------------------------ *
 * Ligações a conferir                                                 *
 * ------------------------------------------------------------------ */

export type Pendencia =
  | { tipo: 'possivel' | 'foraDaConfiguracao', chave: string, fluxo: Fluxo, ligacao: LigacaoDoMapa }
  | { tipo: 'porVariavel' | 'externa', chave: string, fluxo: Fluxo }

/**
 * O que o ENSPACE não sabe sobre as ligações da operação e pede a quem administra:
 * - a gravação condicional que ninguém confirmou e que nenhuma execução do período confirmou;
 * - a gravação que as execuções mostram e a configuração não (fase 2);
 * - o nó que grava numa categoria definida por campo, sem ligação manual que o explique;
 * - o fluxo que começa por chamada externa, sem origem indicada.
 */
export function pendenciasDoMapa(m: ReturnType<typeof mapaDaOperacao>, fs: Fluxo[]): Pendencia[] {
  const lista: Pendencia[] = []
  for (const l of m.ligacoes) {
    const fluxo = fluxoPorId.get(l.fluxo)!
    if ((l.certeza === 'possivel' || l.certeza === 'foraDaConfiguracao') && !l.confirmadaPor) lista.push({ tipo: l.certeza, chave: l.id, fluxo, ligacao: l })
  }
  for (const f of fs) {
    const explicado = manuais.value.some(x => x.de === f.id) || m.ligacoes.some(l => l.fluxo === f.id && l.certeza === 'foraDaConfiguracao')
    if (f.gravaPorVariavel && !ajusteDe(`var:${f.id}`) && !explicado) lista.push({ tipo: 'porVariavel', chave: `var:${f.id}`, fluxo: f })
    if (f.gatilho.tipo === 'webhook' && !ajusteDe(`ext:${f.id}`) && !manuais.value.some(x => x.para === f.id)) lista.push({ tipo: 'externa', chave: `ext:${f.id}`, fluxo: f })
  }
  return lista
}
