/**
 * O dado do protótipo "Proteções do Spaceflow". Fictício, tipado pelo SDK, sem API.
 *
 * Estrutura tirada do develop em 24/10/2026 (workspace de exploração, fluxo de
 * teste 524) e do `enspace-sdk-schemas`: o fluxo é um `Workflow`, a execução é
 * um `WorkflowExecution`. O que a proposta acrescenta vai marcado:
 * - `Workflow.settings.protections` (o `settings` hoje é objeto livre);
 * - 4 status de execução que não existem (`queued`, `skipped`, `held`, `stopped`);
 * - o motivo da execução segurada (`protection_reason`).
 *
 * Empresas, pessoas e números são inventados.
 */
import type { Workflow, WorkflowExecution } from '@be-enlighten/enspace-sdk-schemas'
import type { Gatilho, Protecoes } from './protecoes'

/** O "agora" do protótipo. Fixo, para os horários da lista não mudarem. */
export const AGORA = new Date(2026, 9, 24, 14, 20)

export const workspace = { nome: 'Jurídico Aurora', slug: 'juridico-aurora' }

/* ------------------------------------------------------------------ *
 * O fluxo                                                             *
 * ------------------------------------------------------------------ */

type FluxoComProtecoes = Omit<Workflow, 'settings'> & {
  /** PROPOSTA: hoje `settings` é `{}` livre. As proteções entram em `settings.protections`. */
  settings: { protections: Protecoes } | null
}

export function fluxoDeExemplo(protecoes: Protecoes): FluxoComProtecoes {
  return {
    id: 524,
    created_at: new Date(2026, 9, 14, 9, 12),
    updated_at: new Date(2026, 9, 22, 17, 40),
    deleted_at: null,
    name: 'Revisão de contratos',
    description: 'Resume o contrato, marca para revisão e avisa o jurídico.',
    workspace: workspace.slug,
    reference: 'wf-revisao-de-contratos',
    icon: 'i-lucide-file-text',
    status: 'active',
    trigger_ref: 'trig',
    version: '2.3.0',
    nodes: [],
    edges: [],
    settings: { protections: protecoes },
    meta: null,
  }
}

/** Quem pode receber os avisos. O dono é quem criou o fluxo. */
export const destinatariosPossiveis = [
  { id: 'dono', tipo: 'pessoa' as const, nome: 'Marina Okada', papel: 'dono' as const },
  { id: 'p-rafael', tipo: 'pessoa' as const, nome: 'Rafael Antunes' },
  { id: 'p-beatriz', tipo: 'pessoa' as const, nome: 'Beatriz Lacerda Montenegro' },
  { id: 'p-tiago', tipo: 'pessoa' as const, nome: 'Tiago Sá' },
  { id: 'c-juridico', tipo: 'cargo' as const, nome: 'Coordenação Jurídica' },
  { id: 'c-ti', tipo: 'cargo' as const, nome: 'Administradores de TI' },
]

/** Os campos do formulário do Webhook, para escolher a chave que identifica a requisição repetida. */
export const camposDoWebhook = ['id', 'numero_do_pedido', 'cnpj', 'email_do_cliente']

/* ------------------------------------------------------------------ *
 * As execuções                                                        *
 * ------------------------------------------------------------------ */

/** Os status de hoje mais os 4 da proposta. */
export type StatusDaExecucao =
  | WorkflowExecution['status']
  /** PROPOSTA: esperando vaga ou esperando a janela de horário. */
  | 'queued'
  /** PROPOSTA: descartada pela regra (limite com "ignorar", repetida, fora da vez). */
  | 'skipped'
  /** PROPOSTA: segurada até alguém liberar ou descartar. */
  | 'held'
  /** PROPOSTA: cortada pela proteção (cadeia, tempo máximo, cancelada pela nova). */
  | 'stopped'

export type MotivoDaProtecao =
  | 'limitePorMinuto'
  | 'limitePorDia'
  | 'semVaga'
  | 'mesmoItem'
  | 'janela'
  | 'pausado'
  | 'repetida'
  | 'edicoesJuntas'
  | 'cadeia'
  | 'tempoMaximo'
  | 'canceladaPelaNova'
  | 'tetoIa'
  | 'expirouNaFila'

export interface Execucao extends Omit<WorkflowExecution, 'status' | 'nodes' | 'edges'> {
  status: StatusDaExecucao
  /** PROPOSTA: por que a proteção segurou, ignorou ou cortou. */
  protection_reason?: MotivoDaProtecao
  /** PROPOSTA, só na tela: a execução em andamento está parada numa tarefa ou num atraso (não ocupa vaga). */
  esperando?: 'tarefa' | 'atraso'
}

export type Cenario = 'novo' | 'existente' | 'emUso' | 'pausado' | 'semPermissao' | 'erroAoSalvar'

/** Gerador determinístico: a lista é sempre a mesma a cada recarga. */
function aleatorio(semente: number) {
  let s = semente
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
}

const LETRAS = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
function referencia(r: () => number) {
  return Array.from({ length: 18 }, () => LETRAS[Math.floor(r() * LETRAS.length)]).join('')
}

const contratos = [
  'Contrato 2026-0412 · Vértice Engenharia',
  'Contrato 2026-0413 · Lumen Saúde',
  'Contrato 2026-0414 · Cooperativa Agroleste',
  'Aditivo 2026-0098 · Grupo Ferraz & Moura Participações Societárias',
  'Contrato 2026-0415 · Padaria Bom Grão',
  'Contrato 2026-0416 · Atlas Logística',
  'Distrato 2026-0021 · Nimbus Tecnologia',
  'Contrato 2026-0417 · Escola Recanto',
]

interface Lote { status: StatusDaExecucao, n: number, motivo?: MotivoDaProtecao, esperando?: 'tarefa' | 'atraso' }

/** Quais execuções aparecem em cada cenário, da mais nova para a mais antiga. */
function lotesDoCenario(cenario: Cenario, gatilho: Gatilho, mvp: boolean): Lote[] {
  if (cenario === 'novo') return []
  if (cenario === 'existente' || cenario === 'semPermissao' || cenario === 'erroAoSalvar') {
    return [
      { status: 'working', n: 2 },
      { status: 'working', n: 3, esperando: 'tarefa' },
      { status: 'completed', n: 14 },
      { status: 'error', n: 1 },
      { status: 'completed', n: 20 },
    ]
  }
  if (cenario === 'pausado') {
    return [
      { status: 'queued', n: 14, motivo: 'pausado' },
      { status: 'error', n: 3 },
      { status: 'working', n: 2, esperando: 'tarefa' },
      { status: 'completed', n: 30 },
    ]
  }
  // emUso: as proteções estão agindo.
  const lotes: Lote[] = [
    { status: 'queued', n: 8, motivo: 'semVaga' },
    { status: 'queued', n: 4, motivo: gatilho === 'timer' ? 'semVaga' : 'limitePorMinuto' },
    { status: 'working', n: 10 },
    { status: 'working', n: 6, esperando: 'tarefa' },
    { status: 'working', n: 1, esperando: 'atraso' },
  ]
  if (!mvp) {
    if (gatilho === 'webhook') lotes.push({ status: 'skipped', n: 3, motivo: 'repetida' })
    if (gatilho === 'itens') lotes.push({ status: 'skipped', n: 3, motivo: 'edicoesJuntas' })
    if (gatilho === 'timer') lotes.push({ status: 'skipped', n: 3, motivo: 'semVaga' })
    if (gatilho === 'email') lotes.push({ status: 'skipped', n: 3, motivo: 'repetida' })
    lotes.push({ status: 'held', n: 2, motivo: 'tetoIa' })
  }
  lotes.push(
    { status: 'stopped', n: 1, motivo: 'cadeia' },
    { status: 'completed', n: 18 },
    { status: 'error', n: 1 },
    { status: 'completed', n: 22 },
  )
  return lotes
}

export function execucoesDoCenario(cenario: Cenario, gatilho: Gatilho, mvp: boolean): Execucao[] {
  const r = aleatorio(524 + cenario.length * 7 + gatilho.length)
  const lista: Execucao[] = []
  let minutos = 0
  let id = 9000
  for (const lote of lotesDoCenario(cenario, gatilho, mvp)) {
    for (let i = 0; i < lote.n; i++) {
      minutos += lote.status === 'completed' ? 6 + Math.floor(r() * 40) : 1 + Math.floor(r() * 3)
      const inicio = new Date(AGORA.getTime() - minutos * 60000)
      lista.push({
        id: id--,
        created_at: inicio,
        updated_at: inicio,
        reference: referencia(r),
        title: contratos[Math.floor(r() * contratos.length)]!,
        workspace: workspace.slug,
        workflow: 524,
        parent: null,
        version: lote.status === 'completed' && minutos > 600 ? '2.2.0' : '2.3.0',
        status: lote.status,
        stopped_at: null,
        protection_reason: lote.motivo,
        esperando: lote.esperando,
      })
    }
  }
  return lista
}
