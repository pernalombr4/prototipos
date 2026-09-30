/**
 * O dado do painel de tarefas. 100% inventado, gerado no navegador, sem rede.
 *
 * A FORMA vem do develop (medida em 25/09 pela rotina de QA de tarefas e
 * conferida por esta rodada em 30/09, no workspace de exploração):
 *
 * - Tarefa rápida e de Spaceflow: `GET /ws/tasks`, tipada pelo `Task` do
 *   @be-enlighten/enspace-sdk-schemas.
 * - Tarefa programada (instância de tarefa de etapa do fluxo da categoria):
 *   `GET /c-flow-item-tasks`. O SDK NÃO tem schema dela: o tipo abaixo é o
 *   payload medido, com o nome real de cada chave.
 * - Item no fluxo: `/c-flow-items`, com `run_status` e `stages_log`. Também
 *   sem schema no SDK. Forma lida no Log de Auditoria do develop em 30/09
 *   (flow item 42275: `start` e `complete` por etapa, com data).
 *
 * Os VALORES são fictícios: pessoas, grupos, fluxos e datas. Nenhum dado de
 * cliente. E-mail não entra em lugar nenhum: onde a API devolve e-mail
 * (`task_log[].email`, `unified_responsible`, `stages_log[].user`), o mock
 * guarda o id da pessoa.
 *
 * O gerador é determinístico (semente fixa): recarregar a página devolve os
 * mesmos números, o que deixa o protótipo discutível em reunião.
 */
import type { Task, WorkflowExecution } from '@be-enlighten/enspace-sdk-schemas'

/* ------------------------------------------------------------------ *
 * Relógio do protótipo                                                *
 * ------------------------------------------------------------------ */

/** Agora do protótipo: 30/09/2026, 18:00 em Brasília. Fixo de propósito. */
export const AGORA = new Date('2026-09-30T21:00:00.000Z').getTime()

/** Primeiro dia com dado. Dá 21 meses de histórico, o bastante para "por ano". */
const INICIO = new Date('2025-01-02T12:00:00.000Z').getTime()

const HORA = 3_600_000
const DIA = 24 * HORA

/* ------------------------------------------------------------------ *
 * Sorteio com semente                                                  *
 * ------------------------------------------------------------------ */

function mulberry32(semente: number) {
  let a = semente
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const sorteio = mulberry32(20260930)

function entre(min: number, max: number) {
  return min + sorteio() * (max - min)
}

function inteiro(min: number, max: number) {
  return Math.floor(entre(min, max + 1))
}

function escolher<T>(lista: readonly T[]): T {
  return lista[Math.floor(sorteio() * lista.length)]!
}

function chance(p: number) {
  return sorteio() < p
}

/** Duração com cauda longa (log-normal): a maioria rápida, algumas muito lentas. */
function duracao(medianaEmHoras: number, espalhamento = 0.9) {
  const u1 = Math.max(sorteio(), 1e-9)
  const u2 = sorteio()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return Math.exp(Math.log(medianaEmHoras) + espalhamento * z) * HORA
}

/** Soma dias úteis (segunda a sexta), como o SLA em "Dias Úteis". Sem feriado. */
function somarDiasUteis(inicio: number, dias: number) {
  let t = inicio
  let faltam = dias
  while (faltam > 0) {
    t += DIA
    const diaDaSemana = new Date(t - 3 * HORA).getUTCDay()
    if (diaDaSemana !== 0 && diaDaSemana !== 6) faltam--
  }
  return t
}

/**
 * Momento de criação, mais denso nos meses recentes: o workspace cresceu.
 * `peso` > 1 puxa para o fim do período.
 */
function momentoNoHistorico(peso = 1.6) {
  const x = Math.pow(sorteio(), 1 / peso)
  const t = INICIO + x * (AGORA - INICIO)
  // Horário comercial em Brasília (8h a 18h), para os gráficos terem cara real.
  const dia = Math.floor((t - 3 * HORA) / DIA) * DIA + 3 * HORA
  return dia + entre(8, 18) * HORA
}

function iso(t: number) {
  return new Date(t).toISOString()
}

/* ------------------------------------------------------------------ *
 * Pessoas e grupos                                                     *
 * ------------------------------------------------------------------ */

export interface Pessoa {
  /** Id do usuário, como vem em `assigned_to`, `completed_by`, `assigned`. */
  id: number
  nome: string
  iniciais: string
}

export interface Grupo {
  /** Id do grupo de membros (`/ws/member-groups`), como vem em `module_groups`. */
  id: number
  nome: string
  membros: number[]
}

export const pessoas: Pessoa[] = [
  { id: 4101, nome: 'Ana Ribeiro', iniciais: 'AR' },
  { id: 4102, nome: 'Bruno Tavares', iniciais: 'BT' },
  { id: 4103, nome: 'Carla Nunes', iniciais: 'CN' },
  { id: 4104, nome: 'Diego Moura', iniciais: 'DM' },
  { id: 4105, nome: 'Elisa Prado', iniciais: 'EP' },
  { id: 4106, nome: 'Fábio Lemos', iniciais: 'FL' },
  { id: 4107, nome: 'Gabriela Sá', iniciais: 'GS' },
  { id: 4108, nome: 'Heitor Campos', iniciais: 'HC' },
  // Nome longo de propósito: é onde a tabela de responsáveis quebra.
  { id: 4109, nome: 'Maria Clara Albuquerque Vasconcelos', iniciais: 'MV' },
]

export const grupos: Grupo[] = [
  { id: 501, nome: 'Financeiro', membros: [4105, 4106] },
  { id: 502, nome: 'Jurídico', membros: [4103, 4104] },
  { id: 503, nome: 'Atendimento N1', membros: [4101, 4107, 4108] },
]

/** Quem abre os itens (o "usuário solicitante" das tarefas de etapa). */
const solicitantes = [4101, 4102, 4107, 4108, 4109]

/* ------------------------------------------------------------------ *
 * Fluxos da categoria (c-flow): a configuração                          *
 * ------------------------------------------------------------------ */

/** `responsibility_type` da tarefa de etapa, com os 7 valores da tela. */
export type TipoDeResponsabilidade =
  | 'everybody' // Todo Mundo
  | 'request_user' // Usuário Solicitante
  | 'users' // Usuários
  | 'module_groups' // Grupo
  | 'external_email' // Email Externo
  | 'field_based' // Baseado em Campo
  | 'responsible_rules' // Regras de Responsável

export interface Fluxo {
  /** `c-type-flows.id` */
  id: number
  nome: string
  /** Nome da categoria, como vem em `item_type_name` na instância. */
  categoria: string
}

export interface Etapa {
  /** `c-flow-stages.id`, o `stage_id` do `stages_log`. */
  id: number
  fluxo: number
  nome: string
  ordem: number
}

export interface TarefaDeEtapa {
  /** `c-stage-tasks.id`, o `task` da instância. */
  id: number
  etapa: number
  nome: string
  /** `task_action_slug` */
  acao: 'confirmation' | 'fill_fields' | 'close_stage' | 'close_flow' | 'sendmail'
  /** Aba "Tempo de Resposta": Valor SLA, Cálculo do SLA e Origem SLA. */
  sla: number
  slaTipo: 'hours' | 'days' | 'workDays'
  slaOrigem: 'task_created' | 'item_created' | 'field'
  responsabilidade: TipoDeResponsabilidade
  usuarios?: number[]
  grupos?: number[]
  /** "Habilitar Atribuição": exige assumir antes de concluir. */
  exigeAtribuicao: boolean
  /** Mediana, em horas, do tempo até alguém assumir. Só serve ao gerador. */
  esperaH: number
  /** Mediana, em horas, do trabalho depois de assumida. Só serve ao gerador. */
  execucaoH: number
}

export const fluxos: Fluxo[] = [
  { id: 701, nome: 'Aprovação de contrato', categoria: 'Contratos' },
  { id: 702, nome: 'Compra de materiais', categoria: 'Solicitações de compra' },
  { id: 703, nome: 'Atendimento de TI', categoria: 'Chamados de TI' },
]

export const etapas: Etapa[] = [
  { id: 1801, fluxo: 701, nome: 'Triagem jurídica', ordem: 1 },
  { id: 1802, fluxo: 701, nome: 'Revisão de cláusulas', ordem: 2 },
  { id: 1803, fluxo: 701, nome: 'Assinatura', ordem: 3 },
  { id: 1811, fluxo: 702, nome: 'Cotação', ordem: 1 },
  { id: 1812, fluxo: 702, nome: 'Aprovação', ordem: 2 },
  { id: 1813, fluxo: 702, nome: 'Pedido emitido', ordem: 3 },
  { id: 1821, fluxo: 703, nome: 'Triagem', ordem: 1 },
  { id: 1822, fluxo: 703, nome: 'Atendimento', ordem: 2 },
  { id: 1823, fluxo: 703, nome: 'Validação', ordem: 3 },
]

export const tarefasDeEtapa: TarefaDeEtapa[] = [
  // Aprovação de contrato: a Revisão de cláusulas é o gargalo da história.
  { id: 6001, etapa: 1801, nome: 'Classificar contrato', acao: 'fill_fields', sla: 1, slaTipo: 'workDays', slaOrigem: 'task_created', responsabilidade: 'module_groups', grupos: [502], exigeAtribuicao: true, esperaH: 3, execucaoH: 2 },
  { id: 6002, etapa: 1802, nome: 'Revisar cláusulas', acao: 'fill_fields', sla: 3, slaTipo: 'days', slaOrigem: 'task_created', responsabilidade: 'users', usuarios: [4103, 4104], exigeAtribuicao: false, esperaH: 20, execucaoH: 30 },
  { id: 6003, etapa: 1802, nome: 'Aprovar valor do contrato', acao: 'confirmation', sla: 2, slaTipo: 'days', slaOrigem: 'task_created', responsabilidade: 'module_groups', grupos: [501], exigeAtribuicao: true, esperaH: 10, execucaoH: 3 },
  { id: 6004, etapa: 1803, nome: 'Coletar assinaturas', acao: 'close_flow', sla: 5, slaTipo: 'days', slaOrigem: 'task_created', responsabilidade: 'request_user', exigeAtribuicao: false, esperaH: 6, execucaoH: 40 },
  // Compra de materiais
  { id: 6011, etapa: 1811, nome: 'Cotar fornecedores', acao: 'fill_fields', sla: 48, slaTipo: 'hours', slaOrigem: 'task_created', responsabilidade: 'everybody', exigeAtribuicao: true, esperaH: 5, execucaoH: 14 },
  { id: 6012, etapa: 1812, nome: 'Aprovar compra', acao: 'confirmation', sla: 1, slaTipo: 'workDays', slaOrigem: 'task_created', responsabilidade: 'users', usuarios: [4105], exigeAtribuicao: false, esperaH: 7, execucaoH: 1 },
  { id: 6013, etapa: 1813, nome: 'Emitir pedido de compra', acao: 'close_flow', sla: 8, slaTipo: 'hours', slaOrigem: 'task_created', responsabilidade: 'module_groups', grupos: [501], exigeAtribuicao: true, esperaH: 2, execucaoH: 2 },
  // Atendimento de TI
  { id: 6021, etapa: 1821, nome: 'Classificar chamado', acao: 'fill_fields', sla: 4, slaTipo: 'hours', slaOrigem: 'item_created', responsabilidade: 'module_groups', grupos: [503], exigeAtribuicao: true, esperaH: 1, execucaoH: 0.5 },
  { id: 6022, etapa: 1822, nome: 'Resolver chamado', acao: 'close_stage', sla: 1, slaTipo: 'days', slaOrigem: 'task_created', responsabilidade: 'responsible_rules', exigeAtribuicao: false, esperaH: 3, execucaoH: 9 },
  { id: 6023, etapa: 1822, nome: 'Avisar fornecedor externo', acao: 'sendmail', sla: 3, slaTipo: 'days', slaOrigem: 'task_created', responsabilidade: 'external_email', exigeAtribuicao: false, esperaH: 12, execucaoH: 20 },
  { id: 6024, etapa: 1823, nome: 'Validar solução', acao: 'close_flow', sla: 2, slaTipo: 'days', slaOrigem: 'task_created', responsabilidade: 'request_user', exigeAtribuicao: false, esperaH: 8, execucaoH: 1 },
]

/* ------------------------------------------------------------------ *
 * O que o develop devolve: flow items e instâncias de tarefa           *
 * ------------------------------------------------------------------ */

/**
 * Uma linha do `stages_log` do flow item. No develop:
 * `{ status: "start" | "complete", stage_id, created_at, user? }`, com `user`
 * em e-mail. Aqui `user` é o id da pessoa, porque e-mail não entra no mock.
 */
export interface EntradaDoStagesLog {
  status: 'start' | 'complete'
  stage_id: number
  created_at: string
  user?: number
}

/** `/c-flow-items`: o item dentro do fluxo. Sem schema no SDK. */
export interface FlowItem {
  id: number
  /** id do item */
  item: number
  flow: number
  /** etapa atual */
  stage: number
  status: 'active' | 'inactive'
  /** Medido: `running`, `complete` (fluxo concluído) e `removed` (item excluído). */
  run_status: 'running' | 'complete' | 'removed'
  stages_log: EntradaDoStagesLog[]
  created_at: string
  updated_at: string
}

/**
 * Uma linha do `task_log` da instância (aba "Histórico" do painel da tarefa).
 * No develop: `{ email, created_at, work_status }`. Aqui, `usuario` no lugar
 * do e-mail.
 */
export interface EntradaDoTaskLog {
  usuario: number | null
  created_at: string
  work_status: 'waiting' | 'working' | 'complete'
}

/**
 * `/c-flow-item-tasks`: a tarefa programada. Sem schema no SDK; chaves com o
 * nome e o tipo medidos em develop (lista, não detalhe: o detalhe não traz
 * `is_overdue`).
 */
export interface TarefaProgramada {
  id: number
  /** a tarefa de etapa (configuração) */
  task: number
  flow_item: number
  item_reference: string
  item_type_name: string
  flow_name: string
  stage_name: string
  task_name: string
  task_action_slug: TarefaDeEtapa['acao']
  /** "Status da Tarefa" na tela: Aguardando, Trabalhando, Completa, Removido. */
  work_status: 'waiting' | 'working' | 'complete' | 'removed'
  /** `inactive` quando o item foi excluído. */
  status: 'active' | 'inactive'
  /** Calculado pelo SLA da tarefa de etapa. */
  due_date: string
  /**
   * "Status de SLA" na tela. TEXTO, calculado só na lista. Medido em develop
   * (`evidencias/dev-11-...`): aberta com prazo passado e concluída depois do
   * prazo são "Atrasado"; concluída até o prazo segue "Em Dia" depois dele.
   */
  is_overdue: 'Atrasado' | 'Em Dia'
  priority: '0'
  type: 'default'
  responsibility_type: TipoDeResponsabilidade
  /** No develop é texto com e-mails e grupos juntos. Aqui, nomes. */
  unified_responsible: string
  /** Quem assumiu ("Atribuir Responsabilidade"). id do usuário ou null. */
  assigned: number | null
  // As 2 chaves abaixo só vêm com `__relations=assigned_users,module_groups`.
  assigned_users: number[]
  module_groups: number[]
  task_log: EntradaDoTaskLog[]
  /** Só nas concluídas. */
  completed_at?: string
  /** "Concluído por". No develop é `updated_by_email`; aqui, o id da pessoa. */
  updated_by?: number
  created_at: string
  updated_at: string
  /** Só nas inativas (item excluído). */
  deleted_at?: string
}

export const flowItems: FlowItem[] = []
export const tarefasProgramadas: TarefaProgramada[] = []

/** Referência de item no formato do produto: prefixo da categoria e 29 hex. */
function referencia(prefixo: string) {
  let s = prefixo
  while (s.length < 32) s += inteiro(0, 15).toString(16).toUpperCase()
  return s
}

function prazoDaTarefa(conf: TarefaDeEtapa, criada: number, itemCriado: number) {
  const base = conf.slaOrigem === 'item_created' ? itemCriado : criada
  if (conf.slaTipo === 'hours') return base + conf.sla * HORA
  if (conf.slaTipo === 'days') return base + conf.sla * DIA
  return somarDiasUteis(base, conf.sla)
}

function responsavelDaInstancia(conf: TarefaDeEtapa, solicitante: number) {
  switch (conf.responsabilidade) {
    case 'everybody':
      return { usuarios: [] as number[], grupos: [] as number[], texto: 'Todo Mundo' }
    case 'request_user':
      return { usuarios: [solicitante], grupos: [], texto: nomeDe(solicitante) }
    case 'users':
      return { usuarios: conf.usuarios ?? [], grupos: [], texto: (conf.usuarios ?? []).map(nomeDe).join(', ') }
    case 'module_groups': {
      const g = conf.grupos ?? []
      return { usuarios: [], grupos: g, texto: g.map(id => grupos.find(x => x.id === id)!.nome).join(', ') }
    }
    case 'responsible_rules': {
      // A regra resolve para 1 pessoa por item (aqui, sorteada entre 3).
      const p = escolher([4102, 4108, 4109])
      return { usuarios: [p], grupos: [], texto: nomeDe(p) }
    }
    case 'external_email':
      return { usuarios: [], grupos: [], texto: 'E-mail externo' }
    default:
      return { usuarios: [], grupos: [], texto: '' }
  }
}

function nomeDe(id: number) {
  return pessoas.find(p => p.id === id)?.nome ?? String(id)
}

/** Quem assume uma tarefa de grupo ou de "Todo Mundo". */
function quemAssume(conf: TarefaDeEtapa, usuarios: number[], grupoIds: number[]) {
  if (usuarios.length) return escolher(usuarios)
  if (grupoIds.length) {
    const membros = grupoIds.flatMap(id => grupos.find(g => g.id === id)!.membros)
    return escolher(membros)
  }
  if (conf.responsabilidade === 'external_email') return null
  return escolher(pessoas.map(p => p.id))
}

/**
 * Gera um item andando pelo fluxo até agora. Cada etapa cria as tarefas dela
 * ao entrar (`stage_enter`); a etapa conclui quando a última tarefa conclui.
 * O que passaria de AGORA fica aberto, do jeito que estaria no develop.
 */
function gerarItemNoFluxo(fluxo: Fluxo, flowItemId: number, itemId: number, proximaTarefaId: { v: number }, criadoEm?: number) {
  const itemCriado = criadoEm ?? momentoNoHistorico()
  const solicitante = escolher(solicitantes)
  const prefixo = fluxo.categoria.slice(0, 3).toUpperCase().normalize('NFD').replace(/[^A-Z]/g, 'X')
  const ref = referencia(prefixo)
  const etapasDoFluxo = etapas.filter(e => e.fluxo === fluxo.id).sort((a, b) => a.ordem - b.ordem)
  const removido = chance(0.03)
  const momentoDaRemocao = removido ? itemCriado + entre(2, 20) * DIA : Infinity

  const log: EntradaDoStagesLog[] = []
  let t = itemCriado + entre(1, 40) * 1000
  let etapaAtual = etapasDoFluxo[0]!.id
  let concluido = true

  for (const etapa of etapasDoFluxo) {
    if (t > AGORA || t > momentoDaRemocao) { concluido = false; break }
    etapaAtual = etapa.id
    log.push({ status: 'start', stage_id: etapa.id, created_at: iso(t) })

    let fimDaEtapa = t
    let quemConcluiuPorUltimo: number | null = null
    let etapaAberta = false

    for (const conf of tarefasDeEtapa.filter(x => x.etapa === etapa.id)) {
      // A tarefa de e-mail externo só nasce em parte dos chamados.
      if (conf.acao === 'sendmail' && !chance(0.3)) continue

      const criada = t + entre(0.2, 3) * 1000
      const prazo = prazoDaTarefa(conf, criada, itemCriado)
      const resp = responsavelDaInstancia(conf, solicitante)

      // Pessoas e grupos com ritmo próprio: é o que faz o painel contar história.
      let fator = 1
      if (resp.usuarios.includes(4103)) fator *= 1.6 // Carla, sobrecarregada
      if (resp.grupos.includes(501)) fator *= 1.4 // Financeiro, lento
      // Os meses recentes pioraram: volume maior com o mesmo time.
      if (criada > AGORA - 60 * DIA) fator *= 1.25

      // Tarefa esquecida: ninguém pega, ou pega e não termina. É o que enche
      // a fila de vencidas nos últimos meses (no develop, 101 de 161 pendentes).
      const parada = criada > AGORA - 120 * DIA && chance(0.08)
      const assumida = parada && chance(0.5) ? Infinity : criada + duracao(conf.esperaH * fator, 0.8)
      const concluida = parada ? Infinity : assumida + duracao(conf.execucaoH * fator, 0.9)
      const quem = quemAssume(conf, resp.usuarios, resp.grupos)

      const taskLog: EntradaDoTaskLog[] = [{ usuario: null, created_at: iso(criada), work_status: 'waiting' }]
      let workStatus: TarefaProgramada['work_status'] = 'waiting'
      let assigned: number | null = null
      let completedAt: string | undefined

      const limite = Math.min(AGORA, momentoDaRemocao)
      // Tarefa de "Habilitar Atribuição" passa por Trabalhando; as outras
      // vão direto de Aguardando para Completa.
      if (conf.exigeAtribuicao && assumida <= limite) {
        workStatus = 'working'
        assigned = quem
        taskLog.push({ usuario: quem, created_at: iso(assumida), work_status: 'working' })
      }
      if (concluida <= limite) {
        workStatus = 'complete'
        assigned = assigned ?? (conf.exigeAtribuicao ? quem : null)
        completedAt = iso(concluida)
        taskLog.push({ usuario: quem, created_at: completedAt, work_status: 'complete' })
        if (concluida > fimDaEtapa) { fimDaEtapa = concluida; quemConcluiuPorUltimo = quem }
      }
      else {
        etapaAberta = true
      }

      const inativa = removido && momentoDaRemocao <= AGORA && workStatus !== 'complete'
      tarefasProgramadas.push({
        id: proximaTarefaId.v++,
        task: conf.id,
        flow_item: flowItemId,
        item_reference: ref,
        item_type_name: fluxo.categoria,
        flow_name: fluxo.nome,
        stage_name: etapa.nome,
        task_name: conf.nome,
        task_action_slug: conf.acao,
        work_status: inativa ? 'removed' : workStatus,
        status: inativa ? 'inactive' : 'active',
        due_date: iso(prazo),
        is_overdue: (completedAt ? Date.parse(completedAt) > prazo : prazo < AGORA) ? 'Atrasado' : 'Em Dia',
        priority: '0',
        type: 'default',
        responsibility_type: conf.responsabilidade,
        unified_responsible: resp.texto,
        assigned,
        assigned_users: resp.usuarios,
        module_groups: resp.grupos,
        task_log: taskLog,
        completed_at: completedAt,
        updated_by: completedAt && quem ? quem : undefined,
        created_at: iso(criada),
        updated_at: completedAt ?? taskLog[taskLog.length - 1]!.created_at,
        deleted_at: inativa ? iso(momentoDaRemocao) : undefined,
      })
    }

    if (etapaAberta) { concluido = false; break }
    log.push({ status: 'complete', stage_id: etapa.id, created_at: iso(fimDaEtapa), user: quemConcluiuPorUltimo ?? undefined })
    t = fimDaEtapa + entre(0.5, 2) * 1000
  }

  const runStatus: FlowItem['run_status'] = removido && momentoDaRemocao <= AGORA
    ? 'removed'
    : concluido ? 'complete' : 'running'

  flowItems.push({
    id: flowItemId,
    item: itemId,
    flow: fluxo.id,
    stage: etapaAtual,
    status: runStatus === 'removed' ? 'inactive' : 'active',
    run_status: runStatus,
    stages_log: log,
    created_at: iso(itemCriado),
    updated_at: log.length ? log[log.length - 1]!.created_at : iso(itemCriado),
  })
}

{
  const proximaTarefa = { v: 273600 }
  let flowItemId = 42300
  let itemId = 53800
  const volume: Record<number, number> = { 701: 140, 702: 170, 703: 260 }
  for (const fluxo of fluxos) {
    for (let i = 0; i < volume[fluxo.id]!; i++) gerarItemNoFluxo(fluxo, flowItemId++, itemId++, proximaTarefa)
    // O que entrou nas últimas 2 semanas e ainda anda dentro do SLA.
    for (let i = 0; i < 22; i++) gerarItemNoFluxo(fluxo, flowItemId++, itemId++, proximaTarefa, AGORA - entre(0.1, 14) * DIA)
  }
}

/* ------------------------------------------------------------------ *
 * Tarefas rápidas e de Spaceflow (`/ws/tasks`)                         *
 * ------------------------------------------------------------------ */

/**
 * O nome do fluxo e do nó do Spaceflow NÃO vem na tarefa: ela traz só
 * `node_execution` (id do nó executado). Chegar ao nome custa
 * `/workflows/nodes` (o nó, com `workflow_execution`) e `/workflows/executions`
 * (a execução, com `workflow`). Estes mapas fazem esse papel no protótipo.
 */
export const nosExecutados = new Map<number, { execucao: number, no: string }>()

/** Nome de cada Spaceflow (`/workflows`), pelo id. */
export const spaceflows = new Map<number, string>([
  [310, 'Onboarding de colaborador'],
  [311, 'Cobrança de fornecedor'],
])

/**
 * `/workflows/executions`: cada execução de um Spaceflow. Tipada pelo
 * `WorkflowExecution` do SDK. `stopped_at` é quando a execução parou (fim do
 * fluxo); `status: working` é a que ainda roda, parada numa tarefa.
 */
export const execucoes: WorkflowExecution[] = []

/**
 * A categoria do item também não vem: a tarefa traz `item` (id). Com
 * `__relations=item` vem o item legado inteiro, e dele sai a categoria.
 */
export const itensDasTarefas = new Map<number, { reference: string, categoria: string }>()

/** Tarefas criadas já concluídas pelo `POST`: ficam sem `completed_at` (medido em 25/09). */
export const idsSemDataDeConclusao = new Set<number>()

export const tarefasRapidas: Task[] = []

interface NoDoSpaceflow {
  no: string
  tipo: Task['type']
  /** `task_due_config` do nó. `null` = vazio: o prazo vira a hora da criação. */
  prazoEmDias: number | null
  responsavel: 'pessoa' | 'ninguem'
  execucaoH: number
}

/** Os nós que criam tarefa, na ordem em que a execução passa por eles. */
const fluxosDoSpaceflow: { workflow: number, categoria?: string, volume: number, nos: NoDoSpaceflow[] }[] = [
  {
    workflow: 310,
    volume: 120,
    nos: [
      { no: 'Preparar acesso aos sistemas', tipo: 'form', prazoEmDias: 2, responsavel: 'pessoa', execucaoH: 10 },
      // Nó sem prazo configurado: é o caso dos 98 de 161 medidos em develop.
      { no: 'Entregar equipamento', tipo: 'generic', prazoEmDias: null, responsavel: 'ninguem', execucaoH: 20 },
      { no: 'Aprovar período de experiência', tipo: 'approval', prazoEmDias: 5, responsavel: 'pessoa', execucaoH: 30 },
    ],
  },
  {
    workflow: 311,
    categoria: 'Solicitações de compra',
    volume: 130,
    nos: [
      { no: 'Conferir nota fiscal', tipo: 'crud', prazoEmDias: 1, responsavel: 'ninguem', execucaoH: 6 },
      { no: 'Aprovar pagamento', tipo: 'approval', prazoEmDias: null, responsavel: 'pessoa', execucaoH: 4 },
    ],
  },
]

const nomesDeTarefaAvulsa = [
  'Ligar para o fornecedor de papelaria',
  'Revisar a planilha de custos do trimestre',
  'Atualizar o cadastro do cliente Horizonte Logística',
  'Conferir o boleto em aberto da Serra Alta',
  'Marcar reunião de alinhamento com o jurídico',
  'Responder o e-mail da auditoria interna',
  'Organizar os arquivos do projeto Aurora',
  'Enviar proposta revisada para a Vila Nova Engenharia',
  'Validar a escala de plantão de outubro',
  'Revisar resposta ao cliente sobre o chamado de acesso',
]

function tarefaBase(parcial: Partial<Task> & Pick<Task, 'id' | 'name' | 'status' | 'created_at'>): Task {
  return {
    updated_at: parcial.created_at,
    deleted_at: null,
    reference: referencia('').slice(0, 32),
    description: null,
    workspace: 'produtos',
    type: 'generic',
    priority: 'normal',
    due_date: null,
    points: 0,
    meta: {},
    creator: 4101,
    assigned_to: null,
    completed_by: null,
    completed_at: null,
    node_execution: null,
    item: null,
    notification_task: false,
    archived: false,
    collaborators: null,
    external_task: null,
    permissions: null,
    tag_ids: [],
    ...parcial,
  } as Task
}

{
  let id = 22400
  let execucao = 91000
  let itemSolto = 54500

  // Spaceflow: 250 execuções nos 21 meses, cada uma criando 2 ou 3 tarefas
  // em sequência. A execução para (`stopped_at`) quando a última conclui.
  let execucaoId = 88000
  for (const fluxo of fluxosDoSpaceflow) {
    for (let i = 0; i < fluxo.volume; i++) {
      const inicio = momentoNoHistorico(1.9)
      const execId = execucaoId++
      let t = inicio + entre(1, 20) * 1000
      let parada: number | null = null
      let item: number | null = null
      if (fluxo.categoria) {
        item = itemSolto++
        itensDasTarefas.set(item, { reference: referencia('SOL'), categoria: fluxo.categoria })
      }

      for (let n = 0; n < fluxo.nos.length; n++) {
        const no = fluxo.nos[n]!
        if (t > AGORA) break
        const criada = t
        const pessoa = no.responsavel === 'pessoa' ? escolher(pessoas).id : null
        const fator = pessoa === 4103 ? 1.6 : 1
        // No develop, 101 das 161 tarefas estavam pendentes: muita tarefa de
        // Spaceflow fica esquecida, principalmente a que nasce sem responsável.
        const esquecida = chance(criada > AGORA - 240 * DIA ? (pessoa ? 0.12 : 0.3) : 0.04)
        const concluida = esquecida ? Infinity : criada + duracao(no.execucaoH * fator, 1.1)
        const prazo = no.prazoEmDias === null ? criada + inteiro(40, 900) : criada + no.prazoEmDias * DIA
        const feita = concluida <= AGORA
        const status: Task['status'] = feita ? 'completed' : chance(0.25) ? 'working' : chance(0.08) ? 'blocked' : 'pending'

        nosExecutados.set(execucao, { execucao: execId, no: no.no })
        tarefasRapidas.push(tarefaBase({
          id: id++,
          name: no.no,
          type: no.tipo,
          status,
          created_at: new Date(criada),
          updated_at: new Date(feita ? concluida : criada),
          due_date: new Date(prazo),
          assigned_to: pessoa,
          completed_at: feita ? new Date(concluida) : null,
          completed_by: feita ? (pessoa ?? escolher(pessoas).id) : null,
          node_execution: execucao++,
          item,
        }))

        if (!feita) break
        t = concluida + entre(1, 30) * 1000
        if (n === fluxo.nos.length - 1) parada = concluida
      }

      execucoes.push({
        id: execId,
        created_at: new Date(inicio),
        updated_at: new Date(parada ?? Math.min(t, AGORA)),
        reference: null,
        title: null,
        workspace: 'produtos',
        workflow: fluxo.workflow,
        parent: null,
        version: '1.0.0',
        status: parada ? 'completed' : 'working',
        stopped_at: parada ? new Date(parada) : null,
        item,
      } as WorkflowExecution)
    }
  }

  // Rápidas criadas à mão: 190 tarefas. Parte sem prazo, parte sem responsável.
  for (let i = 0; i < 190; i++) {
    const criada = momentoNoHistorico(1.5)
    const pessoa = chance(0.85) ? escolher(pessoas).id : null
    const semPrazo = chance(0.3)
    const prazo = semPrazo ? null : criada + inteiro(1, 10) * DIA
    const fator = pessoa === 4103 ? 1.7 : 1
    const esquecida = criada > AGORA - 120 * DIA && chance(0.22)
    const concluida = esquecida ? Infinity : criada + duracao(26 * fator, 1.2)
    let feita = concluida <= AGORA
    // Arquivadas e esquecidas: as mais antigas que nunca fecharam viram concluídas.
    if (!feita && criada < AGORA - 200 * DIA) feita = true
    const status: Task['status'] = feita ? 'completed' : chance(0.3) ? 'working' : chance(0.1) ? 'blocked' : 'pending'
    const tarefaId = id++
    // Criada já concluída pelo POST: sem data de conclusão. 4 casos.
    const semData = feita && i % 47 === 3
    if (semData) idsSemDataDeConclusao.add(tarefaId)

    tarefasRapidas.push(tarefaBase({
      id: tarefaId,
      name: escolher(nomesDeTarefaAvulsa),
      status,
      priority: chance(0.15) ? 'high' : chance(0.05) ? 'urgent' : 'normal',
      created_at: new Date(criada),
      updated_at: new Date(feita ? Math.min(concluida, criada + 60 * DIA) : criada),
      due_date: prazo === null ? null : new Date(prazo),
      assigned_to: pessoa,
      creator: escolher(pessoas).id,
      completed_at: feita && !semData ? new Date(Math.min(concluida, criada + inteiro(20, 60) * DIA)) : null,
      completed_by: feita && !semData ? (pessoa ?? 4101) : null,
    }))
  }
}

{
  // Trabalho da quinzena: tarefas rápidas recentes, com prazo à frente.
  let id = 23400
  for (let i = 0; i < 48; i++) {
    const criada = AGORA - entre(0.2, 14) * DIA
    const pessoa = chance(0.9) ? escolher(pessoas).id : null
    const prazo = criada + entre(2, 21) * DIA
    const concluida = criada + duracao(6 * 24, 0.7)
    const feita = concluida <= AGORA
    tarefasRapidas.push(tarefaBase({
      id: id++,
      name: escolher(nomesDeTarefaAvulsa),
      status: feita ? 'completed' : chance(0.45) ? 'working' : chance(0.08) ? 'blocked' : 'pending',
      priority: chance(0.2) ? 'high' : 'normal',
      created_at: new Date(criada),
      updated_at: new Date(feita ? concluida : criada),
      due_date: new Date(prazo),
      assigned_to: pessoa,
      creator: escolher(pessoas).id,
      completed_at: feita ? new Date(concluida) : null,
      completed_by: feita ? (pessoa ?? 4101) : null,
    }))
  }
}

/* ------------------------------------------------------------------ *
 * Rótulos                                                              *
 * ------------------------------------------------------------------ */

export const categorias = [...new Set([...fluxos.map(f => f.categoria)])]
