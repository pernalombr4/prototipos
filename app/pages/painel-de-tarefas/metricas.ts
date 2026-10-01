/**
 * As regras do painel de tarefas: de onde sai cada número.
 *
 * Tudo aqui é função pura sobre o mock. Na implementação, cada função vira
 * uma agregação no back (o painel não pode baixar milhares de tarefas no
 * navegador): o `DECISOES.md` lista o que o back precisa expor.
 *
 * Os 2 motores de tarefa do ENSPACE entram num modelo só (`TarefaDoPainel`):
 * - `/ws/tasks`: tarefas rápidas criadas à mão e as que o Spaceflow cria;
 * - `/c-flow-item-tasks`: tarefas programadas, das etapas do fluxo da categoria.
 *
 * Nenhum campo é inventado: cada propriedade do modelo aponta para a chave de
 * onde vem. Onde o dado precisa de outra rota, o comentário diz qual.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import {
  AGORA, etapas, execucoes, flowItems, fluxos, grupos, idsSemDataDeConclusao,
  itensDasTarefas, nosExecutados, pessoas, spaceflows, tarefasProgramadas, tarefasRapidas,
} from './mocks'
import type { FlowItem, TarefaProgramada } from './mocks'
import type { WorkflowExecution } from '@be-enlighten/enspace-sdk-schemas'

export const HORA = 3_600_000
export const DIA = 24 * HORA
/** Brasília, sem horário de verão desde 2019. O ENSPACE não tem fuso por workspace. */
const FUSO = -3 * HORA

/* ------------------------------------------------------------------ *
 * O modelo único                                                       *
 * ------------------------------------------------------------------ */

/**
 * Como a tarefa nasceu. Rodada 2: "a tarefa do Spaceflow é tarefa rápida", então
 * o corte que interessa ao gestor é quem criou: uma pessoa, à mão, ou um fluxo
 * (Spaceflow ou fluxo da categoria), sem separar os 2 motores de fluxo.
 */
export type Origem = 'manual' | 'fluxo'

/** O motor por baixo. Não aparece como filtro; serve para "abrir a lista certa". */
export type Motor = 'rapidas' | 'programadas'

/**
 * Status virtual: o mesmo vocabulário para os 2 motores.
 * - rápida e Spaceflow (`status`): pending, working, blocked, completed;
 * - programada (`work_status` e `status`): waiting, working, complete,
 *   removed, e `status: inactive` quando o item foi excluído.
 */
export type StatusVirtual = 'nao_iniciada' | 'em_andamento' | 'bloqueada' | 'concluida' | 'removida'

export const STATUS_ABERTOS: StatusVirtual[] = ['nao_iniciada', 'em_andamento', 'bloqueada']

/**
 * Substatus virtual: a situação do prazo, calculada na hora.
 * Aberta: no prazo, a vencer, vencida ou sem prazo.
 * Concluída: no prazo, atrasada (concluída depois do prazo) ou sem prazo.
 */
export type Situacao =
  | 'no_prazo' | 'a_vencer' | 'vencida' | 'sem_prazo'
  | 'concluida_no_prazo' | 'atrasada' | 'concluida_sem_prazo'

export type TipoDeResponsavel = 'pessoa' | 'grupo' | 'todos' | 'externo' | 'sem'

export interface Responsavel {
  tipo: TipoDeResponsavel
  id?: number
  /** `p:<id>`, `g:<id>`, `todos`, `externo`, `sem`. */
  chave: string
}

export interface TarefaDoPainel {
  chave: string
  id: number
  origem: Origem
  /** `/ws/tasks` (rápidas, inclusive as do Spaceflow) ou `/c-flow-item-tasks`. */
  motor: Motor
  nome: string
  status: StatusVirtual
  /** O valor cru, para o painel de detalhe mostrar o que o produto grava. */
  statusBruto: string
  /** `created_at` */
  criadaEm: number
  /** `completed_at` */
  concluidaEm: number | null
  /**
   * `due_date`. Vira `null` quando é igual à criação: é o nó do Spaceflow sem
   * prazo configurado, que grava a hora em que a tarefa nasceu (medido em
   * develop: 98 de 161 tarefas). Contar essas como vencidas seria mentir.
   */
  prazo: number | null
  prazoIgualACriacao: boolean
  /** Programada: 1ª entrada `working` do `task_log`. Rápida: não existe. */
  assumidaEm: number | null
  /**
   * Para quem a tarefa foi designada.
   * Rápida: `assigned_to` (1 pessoa ou ninguém).
   * Programada: `responsibility_type` com `assigned_users` e `module_groups`.
   */
  designados: Responsavel[]
  /** Quem pegou a tarefa: `assigned`, ou quem concluiu (`updated_by_email`). */
  executadaPor: number | null
  /** Categoria do item. Programada: `item_type_name`. Rápida: pela relação `item`. */
  categoria: string | null
  /** Programada: `flow_name`. Spaceflow: nome do fluxo pela execução. */
  fluxo: string | null
  /** Programada: `stage_name`. */
  etapa: string | null
  /** Programada: `item_reference`. Rápida: `reference`. */
  referencia: string
  /** Rápida criada já concluída pelo `POST`: sem `completed_at`. */
  semDataDeConclusao: boolean
  prioridade: Task['priority'] | null
}

const LIMITE_PRAZO_IGUAL = 60_000

function statusDaRapida(s: Task['status']): StatusVirtual {
  if (s === 'working') return 'em_andamento'
  if (s === 'blocked') return 'bloqueada'
  if (s === 'completed') return 'concluida'
  return 'nao_iniciada'
}

function statusDaProgramada(t: TarefaProgramada): StatusVirtual {
  if (t.status === 'inactive' || t.work_status === 'removed') return 'removida'
  if (t.work_status === 'working') return 'em_andamento'
  if (t.work_status === 'complete') return 'concluida'
  return 'nao_iniciada'
}

function designadosDaProgramada(t: TarefaProgramada): Responsavel[] {
  switch (t.responsibility_type) {
    case 'everybody':
      return [{ tipo: 'todos', chave: 'todos' }]
    case 'module_groups':
      return t.module_groups.map(id => ({ tipo: 'grupo' as const, id, chave: `g:${id}` }))
    case 'external_email':
      return [{ tipo: 'externo', chave: 'externo' }]
    default: {
      // users, request_user, field_based e responsible_rules resolvem para pessoas.
      const lista = t.assigned_users.map(id => ({ tipo: 'pessoa' as const, id, chave: `p:${id}` }))
      return lista.length ? lista : [{ tipo: 'sem', chave: 'sem' }]
    }
  }
}

function daRapida(t: Task): TarefaDoPainel {
  const criada = new Date(t.created_at).getTime()
  const prazoBruto = t.due_date ? new Date(t.due_date).getTime() : null
  const igual = prazoBruto !== null && Math.abs(prazoBruto - criada) < LIMITE_PRAZO_IGUAL
  const no = t.node_execution ? nosExecutados.get(t.node_execution) : undefined
  const execucao = no ? execucoes.find(e => e.id === no.execucao) : undefined
  return {
    chave: `t:${t.id}`,
    id: t.id,
    origem: t.node_execution ? 'fluxo' : 'manual',
    motor: 'rapidas',
    nome: t.name,
    status: statusDaRapida(t.status),
    statusBruto: t.status,
    criadaEm: criada,
    concluidaEm: t.completed_at ? new Date(t.completed_at).getTime() : null,
    prazo: igual ? null : prazoBruto,
    prazoIgualACriacao: igual,
    assumidaEm: null,
    designados: t.assigned_to ? [{ tipo: 'pessoa', id: t.assigned_to, chave: `p:${t.assigned_to}` }] : [{ tipo: 'sem', chave: 'sem' }],
    executadaPor: t.assigned_to ?? t.completed_by ?? null,
    categoria: t.item ? itensDasTarefas.get(t.item)?.categoria ?? null : null,
    fluxo: execucao?.workflow ? spaceflows.get(execucao.workflow) ?? null : null,
    etapa: null,
    referencia: t.reference,
    semDataDeConclusao: t.status === 'completed' && !t.completed_at && idsSemDataDeConclusao.has(t.id),
    prioridade: t.priority,
  }
}

function daProgramada(t: TarefaProgramada): TarefaDoPainel {
  const assumida = t.task_log.find(l => l.work_status === 'working')
  return {
    chave: `c:${t.id}`,
    id: t.id,
    origem: 'fluxo',
    motor: 'programadas',
    nome: t.task_name,
    status: statusDaProgramada(t),
    statusBruto: t.status === 'inactive' ? 'inactive' : t.work_status,
    criadaEm: Date.parse(t.created_at),
    concluidaEm: t.completed_at ? Date.parse(t.completed_at) : null,
    prazo: Date.parse(t.due_date),
    prazoIgualACriacao: false,
    assumidaEm: assumida ? Date.parse(assumida.created_at) : null,
    designados: designadosDaProgramada(t),
    executadaPor: t.assigned ?? t.updated_by ?? null,
    categoria: t.item_type_name,
    fluxo: t.flow_name,
    etapa: t.stage_name,
    referencia: t.item_reference,
    semDataDeConclusao: false,
    prioridade: null,
  }
}

/** As tarefas do workspace, dos 2 motores, no modelo do painel. */
export const todasAsTarefas: TarefaDoPainel[] = [
  ...tarefasRapidas.filter(t => !t.archived && !t.deleted_at).map(daRapida),
  ...tarefasProgramadas.map(daProgramada),
]

/* ------------------------------------------------------------------ *
 * Situação do prazo                                                    *
 * ------------------------------------------------------------------ */

/**
 * A janela de "a vencer": aberta com prazo nos próximos 7 dias. É o corte mais
 * comum do mercado (Jira, Linear, monday.com "This week"), medido na pesquisa
 * da rodada 2. Uma constante só: o painel inteiro usa a mesma janela.
 */
export const JANELA_A_VENCER = 7 * DIA

export function situacao(t: TarefaDoPainel, agora = AGORA): Situacao | null {
  if (t.status === 'removida') return null
  if (t.status === 'concluida') {
    if (t.semDataDeConclusao) return null
    if (t.prazo === null) return 'concluida_sem_prazo'
    return t.concluidaEm! > t.prazo ? 'atrasada' : 'concluida_no_prazo'
  }
  if (t.prazo === null) return 'sem_prazo'
  if (t.prazo < agora) return 'vencida'
  if (t.prazo - agora <= JANELA_A_VENCER) return 'a_vencer'
  return 'no_prazo'
}

export function estaAberta(t: TarefaDoPainel) {
  return STATUS_ABERTOS.includes(t.status)
}

/* ------------------------------------------------------------------ *
 * Filtros e período                                                    *
 * ------------------------------------------------------------------ */

export type ChaveDoPeriodo = '7d' | '30d' | '90d' | 'mes' | 'ano' | '12m' | 'tudo'

export interface Filtros {
  periodo: ChaveDoPeriodo
  origem: 'todas' | Origem
  /** Chaves de `Responsavel`. Vazio = todos. */
  responsaveis: string[]
  /** Nomes de categoria. Vazio = todas. */
  categorias: string[]
}

export interface Intervalo { inicio: number, fim: number }

/** Meia-noite de Brasília do dia de `t`. */
function inicioDoDia(t: number) {
  return Math.floor((t + FUSO) / DIA) * DIA - FUSO
}

function partes(t: number) {
  const d = new Date(t + FUSO)
  return { ano: d.getUTCFullYear(), mes: d.getUTCMonth(), dia: d.getUTCDate(), semana: d.getUTCDay() }
}

function dataLocal(ano: number, mes: number, dia = 1) {
  return Date.UTC(ano, mes, dia) - FUSO
}

export function intervaloDo(periodo: ChaveDoPeriodo, agora = AGORA): Intervalo {
  const fim = agora
  const hoje = inicioDoDia(agora)
  const { ano, mes } = partes(agora)
  switch (periodo) {
    case '7d': return { inicio: hoje - 6 * DIA, fim }
    case '30d': return { inicio: hoje - 29 * DIA, fim }
    case '90d': return { inicio: hoje - 89 * DIA, fim }
    case 'mes': return { inicio: dataLocal(ano, mes), fim }
    case 'ano': return { inicio: dataLocal(ano, 0), fim }
    case '12m': return { inicio: dataLocal(ano, mes - 11), fim }
    case 'tudo': return { inicio: 0, fim }
  }
}

/** O período anterior, do mesmo tamanho, para a comparação dos números. */
export function intervaloAnterior(i: Intervalo): Intervalo | null {
  if (i.inicio === 0) return null
  const tamanho = i.fim - i.inicio
  return { inicio: i.inicio - tamanho, fim: i.inicio }
}

export function dentro(t: number | null, i: Intervalo) {
  return t !== null && t >= i.inicio && t < i.fim
}

/**
 * Aplica origem, responsável e categoria. O período NÃO entra aqui: cada
 * bloco diz qual data ele recorta (criação, conclusão ou "agora").
 */
export function aplicarFiltros(lista: TarefaDoPainel[], f: Filtros) {
  return lista.filter((t) => {
    if (f.origem !== 'todas' && t.origem !== f.origem) return false
    if (f.categorias.length && (!t.categoria || !f.categorias.includes(t.categoria))) return false
    if (f.responsaveis.length) {
      const chaves = t.designados.map(d => d.chave)
      if (t.executadaPor) chaves.push(`p:${t.executadaPor}`)
      if (!chaves.some(c => f.responsaveis.includes(c))) return false
    }
    return true
  })
}

/* ------------------------------------------------------------------ *
 * Estatística                                                          *
 * ------------------------------------------------------------------ */

export interface Estatistica { n: number, media: number, mediana: number, p90: number, maior: number }

export function estatistica(valores: number[]): Estatistica | null {
  if (!valores.length) return null
  const v = [...valores].sort((a, b) => a - b)
  const q = (p: number) => v[Math.min(v.length - 1, Math.max(0, Math.ceil(p * v.length) - 1))]!
  return {
    n: v.length,
    media: v.reduce((s, x) => s + x, 0) / v.length,
    mediana: v.length % 2 ? v[(v.length - 1) / 2]! : (v[v.length / 2 - 1]! + v[v.length / 2]!) / 2,
    p90: q(0.9),
    maior: v[v.length - 1]!,
  }
}

/** Da criação à conclusão. Só concluídas com as 2 datas. */
export function tempoDeConclusao(t: TarefaDoPainel) {
  return t.concluidaEm !== null ? t.concluidaEm - t.criadaEm : null
}

/* ------------------------------------------------------------------ *
 * Os números do topo                                                   *
 * ------------------------------------------------------------------ */

export interface NumerosDoTopo {
  abertas: number
  porStatus: Record<'nao_iniciada' | 'em_andamento' | 'bloqueada', number>
  vencidas: number
  aVencer: number
  /** Das "a vencer", as que vencem em até 24 h: o destaque que Linear, ClickUp e Todoist dão ao dia do prazo. */
  aVencer24h: number
  concluidas: number
  concluidasAntes: number | null
  noPrazoPct: number | null
  noPrazoPctAntes: number | null
  comPrazo: number
  noPrazo: number
  tempo: Estatistica | null
  tempoAntes: Estatistica | null
  criadas: number
  semDataDeConclusao: number
}

function concluidasEm(lista: TarefaDoPainel[], i: Intervalo) {
  return lista.filter(t => t.status === 'concluida' && dentro(t.concluidaEm, i))
}

function taxaNoPrazo(lista: TarefaDoPainel[]) {
  const comPrazo = lista.filter(t => t.prazo !== null)
  const noPrazo = comPrazo.filter(t => situacao(t) === 'concluida_no_prazo')
  return { comPrazo: comPrazo.length, noPrazo: noPrazo.length, pct: comPrazo.length ? noPrazo.length / comPrazo.length : null }
}

export function numerosDoTopo(lista: TarefaDoPainel[], i: Intervalo): NumerosDoTopo {
  const abertas = lista.filter(estaAberta)
  const concluidas = concluidasEm(lista, i)
  const anterior = intervaloAnterior(i)
  const concluidasAntes = anterior ? concluidasEm(lista, anterior) : null
  const taxa = taxaNoPrazo(concluidas)
  const taxaAntes = concluidasAntes ? taxaNoPrazo(concluidasAntes) : null
  return {
    abertas: abertas.length,
    porStatus: {
      nao_iniciada: abertas.filter(t => t.status === 'nao_iniciada').length,
      em_andamento: abertas.filter(t => t.status === 'em_andamento').length,
      bloqueada: abertas.filter(t => t.status === 'bloqueada').length,
    },
    vencidas: abertas.filter(t => situacao(t) === 'vencida').length,
    aVencer: abertas.filter(t => situacao(t) === 'a_vencer').length,
    aVencer24h: abertas.filter(t => situacao(t) === 'a_vencer' && t.prazo! - AGORA <= DIA).length,
    concluidas: concluidas.length,
    concluidasAntes: concluidasAntes?.length ?? null,
    noPrazoPct: taxa.pct,
    noPrazoPctAntes: taxaAntes?.pct ?? null,
    comPrazo: taxa.comPrazo,
    noPrazo: taxa.noPrazo,
    tempo: estatistica(concluidas.map(tempoDeConclusao).filter((x): x is number => x !== null)),
    tempoAntes: concluidasAntes ? estatistica(concluidasAntes.map(tempoDeConclusao).filter((x): x is number => x !== null)) : null,
    criadas: lista.filter(t => dentro(t.criadaEm, i)).length,
    semDataDeConclusao: lista.filter(t => t.semDataDeConclusao).length,
  }
}

/* ------------------------------------------------------------------ *
 * SLA                                                                   *
 * ------------------------------------------------------------------ */

export interface BlocoSla {
  abertas: Record<'no_prazo' | 'a_vencer' | 'vencida' | 'sem_prazo', number>
  concluidas: Record<'concluida_no_prazo' | 'atrasada' | 'concluida_sem_prazo', number>
  /** Tarefas cujo prazo é a hora da criação (nó do Spaceflow sem prazo). */
  prazoIgualACriacao: number
}

export function blocoSla(lista: TarefaDoPainel[], i: Intervalo): BlocoSla {
  const abertas = { no_prazo: 0, a_vencer: 0, vencida: 0, sem_prazo: 0 }
  const concluidas = { concluida_no_prazo: 0, atrasada: 0, concluida_sem_prazo: 0 }
  for (const t of lista) {
    const s = situacao(t)
    if (!s) continue
    if (estaAberta(t) && s in abertas) abertas[s as keyof typeof abertas]++
    else if (t.status === 'concluida' && dentro(t.concluidaEm, i) && s in concluidas) concluidas[s as keyof typeof concluidas]++
  }
  const prazoIgualACriacao = lista.filter(t => t.prazoIgualACriacao && (estaAberta(t) || dentro(t.concluidaEm, i))).length
  return { abertas, concluidas, prazoIgualACriacao }
}

/* ------------------------------------------------------------------ *
 * Tempo que falta para vencer                                          *
 * ------------------------------------------------------------------ */

export type Faixa = 'vencida_7d_mais' | 'vencida_ate_7d' | 'ate_24h' | 'de_1_a_7d' | 'de_8_a_30d' | 'mais_30d' | 'sem_prazo'

export const FAIXAS: Faixa[] = ['vencida_7d_mais', 'vencida_ate_7d', 'ate_24h', 'de_1_a_7d', 'de_8_a_30d', 'mais_30d', 'sem_prazo']

/** Em que faixa uma tarefa ABERTA cai, pelo tempo até o prazo. */
export function faixaDe(t: TarefaDoPainel, agora = AGORA): Faixa {
  if (t.prazo === null) return 'sem_prazo'
  const falta = t.prazo - agora
  if (falta < -7 * DIA) return 'vencida_7d_mais'
  if (falta < 0) return 'vencida_ate_7d'
  if (falta <= DIA) return 'ate_24h'
  if (falta <= 7 * DIA) return 'de_1_a_7d'
  if (falta <= 30 * DIA) return 'de_8_a_30d'
  return 'mais_30d'
}

export function faixasDePrazo(lista: TarefaDoPainel[]) {
  const contagem = Object.fromEntries(FAIXAS.map(f => [f, 0])) as Record<Faixa, number>
  for (const t of lista) if (estaAberta(t)) contagem[faixaDe(t)]++
  return contagem
}

/**
 * As abertas de prazo passado, da que venceu há menos tempo à mais antiga
 * (rodada 6). É o espelho de `proximasAVencer`: as 2 listas partem de agora,
 * uma para trás e outra para frente. A mais antiga, quase sempre esquecida,
 * fica no fim; a lista do número Vencidas mostra a ordem inversa.
 */
export function vencidasRecentes(lista: TarefaDoPainel[], agora = AGORA) {
  return lista
    .filter(t => estaAberta(t) && t.prazo !== null && t.prazo < agora)
    .sort((a, b) => b.prazo! - a.prazo!)
}

/** Todas as abertas com prazo à frente, da mais próxima à mais distante. O painel carrega em lotes. */
export function proximasAVencer(lista: TarefaDoPainel[], agora = AGORA) {
  return lista
    .filter(t => estaAberta(t) && t.prazo !== null && t.prazo >= agora)
    .sort((a, b) => a.prazo! - b.prazo!)
}

/* ------------------------------------------------------------------ *
 * Prioridade                                                           *
 * ------------------------------------------------------------------ */

export type Prioridade = NonNullable<TarefaDoPainel['prioridade']>

/** Da mais urgente à menos: a ordem das colunas. */
export const PRIORIDADES: Prioridade[] = ['urgent', 'high', 'normal', 'low']

export interface BlocoPrioridade {
  abertas: Record<Prioridade, number>
  /**
   * Abertas sem prioridade: as tarefas de etapa. `/c-flow-item-tasks` grava
   * `priority: "0"` em todas (42 de 42, medido em develop); só `/ws/tasks`
   * (rápida e Spaceflow) tem baixa, normal, alta e urgente.
   */
  semPrioridade: number
}

/** As abertas agora, por prioridade. */
export function porPrioridade(lista: TarefaDoPainel[]): BlocoPrioridade {
  const abertas = { urgent: 0, high: 0, normal: 0, low: 0 }
  let semPrioridade = 0
  for (const t of lista) {
    if (!estaAberta(t)) continue
    if (t.prioridade && t.prioridade in abertas) abertas[t.prioridade]++
    else semPrioridade++
  }
  return { abertas, semPrioridade }
}

/* ------------------------------------------------------------------ *
 * Criadas e concluídas por período                                     *
 * ------------------------------------------------------------------ */

export type Granularidade = 'semana' | 'mes' | 'ano'

export interface Balde {
  inicio: number
  criadas: number
  concluidas: number
  /** O balde começa antes ou termina depois do período: conta só parte dele. */
  parcial: boolean
}

function inicioDoBalde(t: number, g: Granularidade) {
  const p = partes(t)
  if (g === 'ano') return dataLocal(p.ano, 0)
  if (g === 'mes') return dataLocal(p.ano, p.mes)
  // Semana começando na segunda-feira.
  const recuo = (p.semana + 6) % 7
  return inicioDoDia(t) - recuo * DIA
}

function proximoBalde(t: number, g: Granularidade) {
  const p = partes(t)
  if (g === 'ano') return dataLocal(p.ano + 1, 0)
  if (g === 'mes') return dataLocal(p.ano, p.mes + 1)
  return t + 7 * DIA
}

export function serie(lista: TarefaDoPainel[], i: Intervalo, g: Granularidade): Balde[] {
  const primeira = i.inicio === 0 ? Math.min(...lista.map(t => t.criadaEm)) : i.inicio
  if (!Number.isFinite(primeira)) return []
  const baldes: Balde[] = []
  for (let b = inicioDoBalde(primeira, g); b < i.fim; b = proximoBalde(b, g)) {
    baldes.push({ inicio: b, criadas: 0, concluidas: 0, parcial: (i.inicio !== 0 && b < i.inicio) || proximoBalde(b, g) > i.fim })
  }
  const achar = (t: number) => {
    const inicio = inicioDoBalde(t, g)
    return baldes.find(b => b.inicio === inicio)
  }
  for (const t of lista) {
    if (dentro(t.criadaEm, i)) { const b = achar(t.criadaEm); if (b) b.criadas++ }
    if (t.status === 'concluida' && dentro(t.concluidaEm, i)) { const b = achar(t.concluidaEm!); if (b) b.concluidas++ }
  }
  return baldes
}

/** A granularidade que cabe no período, quando a pessoa ainda não escolheu. */
export function granularidadePadrao(p: ChaveDoPeriodo): Granularidade {
  return p === '7d' || p === '30d' || p === '90d' || p === 'mes' ? 'semana' : 'mes'
}

/* ------------------------------------------------------------------ *
 * Status e substatus                                                   *
 * ------------------------------------------------------------------ */

export interface LinhaDeStatus {
  status: StatusVirtual
  total: number
  partes: { situacao: Situacao | 'removida', n: number }[]
}

/**
 * Abertas: a situação AGORA. Concluídas: as do período. Removidas: as que
 * saíram no período (programadas de item excluído).
 */
export function porStatus(lista: TarefaDoPainel[], i: Intervalo): LinhaDeStatus[] {
  const linhas: LinhaDeStatus[] = []
  for (const st of STATUS_ABERTOS) {
    const doStatus = lista.filter(t => t.status === st)
    const partesDaLinha = (['no_prazo', 'a_vencer', 'vencida', 'sem_prazo'] as const).map(s => ({ situacao: s, n: doStatus.filter(t => situacao(t) === s).length }))
    linhas.push({ status: st, total: doStatus.length, partes: partesDaLinha })
  }
  const concluidas = concluidasEm(lista, i)
  linhas.push({
    status: 'concluida',
    total: concluidas.length,
    partes: (['concluida_no_prazo', 'atrasada', 'concluida_sem_prazo'] as const).map(s => ({ situacao: s, n: concluidas.filter(t => situacao(t) === s).length })),
  })
  const removidas = lista.filter(t => t.status === 'removida' && dentro(t.criadaEm, i))
  linhas.push({ status: 'removida', total: removidas.length, partes: [{ situacao: 'removida', n: removidas.length }] })
  return linhas
}

/* ------------------------------------------------------------------ *
 * Por responsável                                                      *
 * ------------------------------------------------------------------ */

export type ModoDoResponsavel = 'designada' | 'executada'

export interface LinhaDeResponsavel {
  chave: string
  tipo: TipoDeResponsavel
  nome: string
  abertas: number
  /**
   * As partes da barra do gráfico (rodada 3), sem sobreposição: vencida é a
   * aberta de prazo passado, em qualquer status; pendente, em andamento e
   * bloqueada são as outras abertas, pelo status. As 4 são de agora; a
   * concluída é do período. Abertas = vencidas + pendentes + em andamento +
   * bloqueadas.
   */
  vencidas: number
  pendentes: number
  emAndamento: number
  bloqueadas: number
  concluidas: number
  noPrazoPct: number | null
  /** A média, não a mediana (rodada 3: "é a média que tem que ser entregue"). */
  tempoMedio: number | null
}

/**
 * O seletor do gráfico de responsáveis: "Todos" mostra a barra agrupada; os
 * outros, uma parte só (ordem do pedido da redatora).
 */
export type FiltroDoResponsavel = 'todos' | 'pendentes' | 'emAndamento' | 'vencidas' | 'concluidas'
export const FILTROS_DO_RESPONSAVEL: FiltroDoResponsavel[] = ['todos', 'pendentes', 'emAndamento', 'vencidas', 'concluidas']

/** Em qual parte da barra a tarefa entra (null: concluída fora do período ou removida). */
export function parteDoResponsavel(t: TarefaDoPainel, i: Intervalo): Exclude<FiltroDoResponsavel, 'todos'> | 'bloqueadas' | null {
  if (estaAberta(t)) {
    if (situacao(t) === 'vencida') return 'vencidas'
    return t.status === 'nao_iniciada' ? 'pendentes' : t.status === 'em_andamento' ? 'emAndamento' : 'bloqueadas'
  }
  return t.status === 'concluida' && dentro(t.concluidaEm, i) ? 'concluidas' : null
}

export function nomeDoResponsavel(chave: string, rotulos: { todos: string, externo: string, sem: string }) {
  if (chave === 'todos') return rotulos.todos
  if (chave === 'externo') return rotulos.externo
  if (chave === 'sem') return rotulos.sem
  const [tipo, id] = chave.split(':')
  if (tipo === 'g') return grupos.find(g => g.id === Number(id))?.nome ?? chave
  return pessoas.find(p => p.id === Number(id))?.nome ?? chave
}

/**
 * Uma linha por pessoa, grupo, "Todo mundo", e-mail externo e "sem
 * responsável". Tarefa de 2 pessoas conta 1 vez para cada uma: a soma das
 * linhas pode passar do total, e a tela diz isso.
 */
export function porResponsavel(
  lista: TarefaDoPainel[], i: Intervalo, modo: ModoDoResponsavel,
  rotulos: { todos: string, externo: string, sem: string },
): LinhaDeResponsavel[] {
  const baldes = new Map<string, TarefaDoPainel[]>()
  const incluir = (chave: string, t: TarefaDoPainel) => {
    if (!baldes.has(chave)) baldes.set(chave, [])
    baldes.get(chave)!.push(t)
  }
  for (const t of lista) {
    if (modo === 'designada') for (const d of t.designados) incluir(d.chave, t)
    else incluir(t.executadaPor ? `p:${t.executadaPor}` : 'sem', t)
  }
  return [...baldes.entries()].map(([chave, ts]) => {
    const concluidas = concluidasEm(ts, i)
    const taxa = taxaNoPrazo(concluidas)
    const tempo = estatistica(concluidas.map(tempoDeConclusao).filter((x): x is number => x !== null))
    return {
      chave,
      tipo: chave === 'todos' ? 'todos' : chave === 'externo' ? 'externo' : chave === 'sem' ? 'sem' : chave.startsWith('g:') ? 'grupo' : 'pessoa',
      nome: nomeDoResponsavel(chave, rotulos),
      abertas: ts.filter(estaAberta).length,
      vencidas: ts.filter(t => parteDoResponsavel(t, i) === 'vencidas').length,
      pendentes: ts.filter(t => parteDoResponsavel(t, i) === 'pendentes').length,
      emAndamento: ts.filter(t => parteDoResponsavel(t, i) === 'emAndamento').length,
      bloqueadas: ts.filter(t => parteDoResponsavel(t, i) === 'bloqueadas').length,
      concluidas: concluidas.length,
      noPrazoPct: taxa.pct,
      tempoMedio: tempo?.media ?? null,
    } satisfies LinhaDeResponsavel
  })
}

/* ------------------------------------------------------------------ *
 * Tempos: tarefa, etapa e fluxo                                        *
 * ------------------------------------------------------------------ */

export interface TempoDaTarefa {
  nome: string
  origem: Origem
  fluxo: string | null
  /** Só na tarefa de etapa: a etapa onde ela vive. O Spaceflow não tem etapa. */
  etapa: string | null
  estat: Estatistica
  /**
   * Só programadas com "Habilitar Atribuição": a média de criada até assumida
   * e de assumida até concluída. Só quando todas as concluídas do grupo foram
   * assumidas: aí espera + execução = a média do grupo, e a barra divide.
   */
  espera: number | null
  execucao: number | null
  /** Abertas agora com o mesmo nome e fluxo, e há quanto tempo (mediana). */
  emAndamento: number
  idadeMediana: number | null
}

export function temposPorTarefa(lista: TarefaDoPainel[], i: Intervalo, agora = AGORA): TempoDaTarefa[] {
  // Tarefa manual não tem "tipo": o nome livre de cada uma não agrupa nada.
  const chaveDe = (t: TarefaDoPainel) => t.origem === 'manual' ? '__avulsa' : `${t.motor}|${t.fluxo}|${t.nome}`
  const concluidas = concluidasEm(lista, i).filter(t => t.concluidaEm !== null)
  const porNome = new Map<string, TarefaDoPainel[]>()
  for (const t of concluidas) {
    const chave = chaveDe(t)
    if (!porNome.has(chave)) porNome.set(chave, [])
    porNome.get(chave)!.push(t)
  }
  const abertas = new Map<string, number[]>()
  for (const t of lista) {
    if (!estaAberta(t)) continue
    const chave = chaveDe(t)
    if (!abertas.has(chave)) abertas.set(chave, [])
    abertas.get(chave)!.push(agora - t.criadaEm)
  }
  return [...porNome.entries()].map(([chave, ts]) => {
    const todasAssumidas = ts.every(t => t.assumidaEm !== null)
    const espera = todasAssumidas ? estatistica(ts.map(t => t.assumidaEm! - t.criadaEm)) : null
    const execucao = todasAssumidas ? estatistica(ts.map(t => t.concluidaEm! - t.assumidaEm!)) : null
    return {
      nome: chave === '__avulsa' ? '__avulsa' : ts[0]!.nome,
      origem: ts[0]!.origem,
      fluxo: chave === '__avulsa' ? null : ts[0]!.fluxo,
      etapa: chave === '__avulsa' ? null : ts[0]!.etapa,
      estat: estatistica(ts.map(t => t.concluidaEm! - t.criadaEm))!,
      espera: espera?.media ?? null,
      execucao: execucao?.media ?? null,
      emAndamento: abertas.get(chave)?.length ?? 0,
      idadeMediana: estatistica(abertas.get(chave) ?? [])?.mediana ?? null,
    }
  }).sort((a, b) => b.estat.mediana - a.estat.mediana)
}

/** Flow items no escopo do filtro. Só existem nas tarefas criadas por fluxo. */
export function flowItemsDoFiltro(f: Filtros): FlowItem[] {
  if (f.origem === 'manual') return []
  return flowItems.filter((fi) => {
    const categoria = fluxos.find(x => x.id === fi.flow)!.categoria
    return !f.categorias.length || f.categorias.includes(categoria)
  })
}

export interface TempoDaEtapa {
  fluxo: string
  etapa: string
  ordem: number
  estat: Estatistica | null
  /** Itens nesta etapa agora, e há quanto tempo (mediana). */
  agora: number
  idadeMediana: number | null
}

/**
 * Tempo de etapa pelo `stages_log`: de `start` a `complete` do mesmo
 * `stage_id`. Entra a passagem que terminou no período. Item que volta à
 * etapa gera outra passagem.
 */
export function temposPorEtapa(itens: FlowItem[], i: Intervalo, agora = AGORA): TempoDaEtapa[] {
  return etapas.map((etapa) => {
    const duracoes: number[] = []
    const idades: number[] = []
    for (const fi of itens) {
      if (fi.flow !== etapa.fluxo) continue
      let inicio: number | null = null
      for (const l of fi.stages_log) {
        if (l.stage_id !== etapa.id) continue
        if (l.status === 'start') inicio = Date.parse(l.created_at)
        else if (inicio !== null) {
          const fim = Date.parse(l.created_at)
          if (dentro(fim, i)) duracoes.push(fim - inicio)
          inicio = null
        }
      }
      if (inicio !== null && fi.run_status === 'running' && fi.stage === etapa.id) idades.push(agora - inicio)
    }
    return {
      fluxo: fluxos.find(f => f.id === etapa.fluxo)!.nome,
      etapa: etapa.nome,
      ordem: etapa.ordem,
      estat: estatistica(duracoes),
      agora: idades.length,
      idadeMediana: estatistica(idades)?.mediana ?? null,
    }
  })
}

export interface TempoDoFluxo {
  fluxo: string
  /** Fluxo da categoria (tem etapas) ou Spaceflow (tem nós que criam tarefa). */
  tipo: 'categoria' | 'spaceflow'
  estat: Estatistica | null
  emAndamento: number
  idadeMediana: number | null
  /**
   * Onde o tempo vai, pela média, na mesma população do tempo do fluxo:
   * - categoria: a média de cada etapa nos itens que concluíram o fluxo
   *   (etapa que o item pulou conta 0), então a soma das partes é a média do
   *   fluxo;
   * - Spaceflow: a média de cada tarefa do fluxo. `entre` é o resto (a
   *   espera entre um nó e outro), quando há.
   */
  composicao: { rotulo: string, media: number }[]
  entre: number
}

/** Execuções do Spaceflow no escopo do filtro (`/workflows/executions`). */
export function execucoesDoFiltro(f: Filtros): WorkflowExecution[] {
  if (f.origem === 'manual') return []
  return execucoes.filter((e) => {
    if (!f.categorias.length) return true
    const categoria = e.item ? itensDasTarefas.get(e.item)?.categoria : undefined
    return !!categoria && f.categorias.includes(categoria)
  })
}

/**
 * Tempo de fluxo, nos 2 motores de fluxo:
 * - fluxo da categoria: do 1º `start` ao último `complete` do `stages_log`,
 *   nos flow items com `run_status: complete`;
 * - Spaceflow: de `created_at` a `stopped_at` da execução com `status: completed`.
 * Entra o que terminou no período. O que roda aparece ao lado, com a idade.
 */
export function temposPorFluxo(
  itens: FlowItem[], execs: WorkflowExecution[], lista: TarefaDoPainel[], i: Intervalo, agora = AGORA,
): TempoDoFluxo[] {
  const daCategoria = fluxos.map((fluxo) => {
    const doFluxo = itens.filter(fi => fi.flow === fluxo.id)
    const etapasDoFluxo = etapas.filter(e => e.fluxo === fluxo.id).sort((a, b) => a.ordem - b.ordem)
    const duracoes: number[] = []
    const somaPorEtapa = new Map<number, number>(etapasDoFluxo.map(e => [e.id, 0]))
    for (const fi of doFluxo) {
      if (fi.run_status !== 'complete' || !fi.stages_log.length) continue
      const inicio = Date.parse(fi.stages_log[0]!.created_at)
      const fim = Date.parse(fi.stages_log[fi.stages_log.length - 1]!.created_at)
      if (!dentro(fim, i)) continue
      duracoes.push(fim - inicio)
      // Cada passagem de start a complete soma na etapa: quem volta à etapa soma 2 vezes.
      const aberto = new Map<number, number>()
      for (const l of fi.stages_log) {
        if (l.status === 'start') aberto.set(l.stage_id, Date.parse(l.created_at))
        else if (aberto.has(l.stage_id)) {
          somaPorEtapa.set(l.stage_id, (somaPorEtapa.get(l.stage_id) ?? 0) + Date.parse(l.created_at) - aberto.get(l.stage_id)!)
          aberto.delete(l.stage_id)
        }
      }
    }
    const estat = estatistica(duracoes)
    const composicao = estat
      ? etapasDoFluxo.map(e => ({ rotulo: e.nome, media: (somaPorEtapa.get(e.id) ?? 0) / duracoes.length })).filter(c => c.media > 0)
      : []
    const somaDasPartes = composicao.reduce((a, c) => a + c.media, 0)
    const rodando = doFluxo.filter(fi => fi.run_status === 'running' && fi.stages_log.length)
    return {
      fluxo: fluxo.nome,
      tipo: 'categoria' as const,
      estat,
      emAndamento: rodando.length,
      idadeMediana: estatistica(rodando.map(fi => agora - Date.parse(fi.stages_log[0]!.created_at)))?.mediana ?? null,
      composicao,
      entre: estat ? Math.max(0, estat.media - somaDasPartes) : 0,
    }
  })
  const doSpaceflow = [...spaceflows.entries()].map(([id, nome]) => {
    const doFluxo = execs.filter(e => e.workflow === id)
    const duracoes = doFluxo
      .filter(e => e.status === 'completed' && e.stopped_at && dentro(new Date(e.stopped_at).getTime(), i))
      .map(e => new Date(e.stopped_at!).getTime() - new Date(e.created_at).getTime())
    const rodando = doFluxo.filter(e => e.status === 'working')
    // A ordem dos nós é a ordem em que as tarefas nascem na execução.
    const nomes = [...new Set(lista.filter(t => t.motor === 'rapidas' && t.fluxo === nome).sort((a, b) => a.criadaEm - b.criadaEm).map(t => t.nome))]
    const composicao = nomes.map((rotulo) => {
      const e = estatistica(lista
        .filter(t => t.fluxo === nome && t.nome === rotulo && t.status === 'concluida' && dentro(t.concluidaEm, i))
        .map(t => t.concluidaEm! - t.criadaEm))
      return e ? { rotulo, media: e.media } : null
    }).filter((x): x is { rotulo: string, media: number } => !!x)
    const estat = estatistica(duracoes)
    const somaDasPartes = composicao.reduce((a, c) => a + c.media, 0)
    return {
      fluxo: nome,
      tipo: 'spaceflow' as const,
      estat,
      emAndamento: rodando.length,
      idadeMediana: estatistica(rodando.map(e => agora - new Date(e.created_at).getTime()))?.mediana ?? null,
      // Tarefas em paralelo somariam mais que o fluxo: aí a barra não divide.
      composicao: estat && somaDasPartes <= estat.media ? composicao : [],
      entre: estat && somaDasPartes <= estat.media ? estat.media - somaDasPartes : 0,
    }
  })
  return [...daCategoria, ...doSpaceflow].filter(f => f.estat || f.emAndamento)
}

/* ------------------------------------------------------------------ *
 * Opções dos filtros                                                   *
 * ------------------------------------------------------------------ */

export const categoriasDisponiveis = [...new Set(todasAsTarefas.map(t => t.categoria).filter((c): c is string => !!c))].sort()

export const responsaveisDisponiveis = {
  pessoas: pessoas.map(p => ({ chave: `p:${p.id}`, nome: p.nome, iniciais: p.iniciais })),
  grupos: grupos.map(g => ({ chave: `g:${g.id}`, nome: g.nome })),
}
