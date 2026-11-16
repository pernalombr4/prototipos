/**
 * O estado do protótipo, em memória. Recarregar a página volta tudo ao começo.
 *
 * Um `useState` por assunto, para os componentes da pasta dividirem o mesmo
 * dado sem passar tudo por props: a lista de agentes, a biblioteca de modelos
 * de resposta, os arquivos, as políticas e o que está aberto na tela.
 */
import { agentes as agentesIniciais, arquivos as arquivosIniciais, blocos as blocosIniciais, manuais as manuaisIniciais, type Agente, type ArquivoDeReferencia, type Manual, type Severidade } from './mocks'
import { modeloPorId, modelos } from './catalogo'

const copia = <T>(x: T): T => JSON.parse(JSON.stringify(x))

export type AbaDoTopo = 'agentes' | 'conhecimento' | 'respostas' | 'playbooks' | 'atividade' | 'politicas'
export type AbaDoEditor = 'essencial' | 'personalizacao' | 'ferramentas' | 'conhecimento' | 'respostas' | 'acesso' | 'testar' | 'desempenho'
export type EstadoDoCartao = 'pendente' | 'executando' | 'confirmado' | 'cancelado' | 'erro'
export type CenarioDoChat = 'confirmacao' | 'lote' | 'minuta' | 'novo'

export interface Politicas {
  criacao: 'admins' | 'completos' | 'todos'
  modelos: string[]
  bloqueadas: string[]
  confirmacaoObrigatoria: boolean
  dominios: string[]
  limite: number | null
}

export function useAgentes() {
  return useState<Agente[]>('cda-agentes', () => copia(agentesIniciais))
}

export function useBlocos() {
  return useState('cda-blocos', () => copia(blocosIniciais))
}

export function useManuais() {
  return useState<Manual[]>('cda-manuais', () => copia(manuaisIniciais))
}

export function useArquivos() {
  return useState('cda-arquivos', () => copia(arquivosIniciais))
}

/**
 * O conhecimento que um agente consulta e como ele lê.
 *
 * Capacidade = metade do contexto do menor modelo permitido (a outra metade
 * fica para a conversa). Cabe: tudo lido inteiro. Passou: só os fixados são
 * lidos inteiros, e nos outros o agente busca os trechos de cada pergunta.
 */
export function conhecimentoDoAgente(a: Agente, docs: ArquivoDeReferencia[]) {
  const doWorkspace = a.usarDoWorkspace ? docs.filter(d => d.escopo === 'workspace') : []
  const doAgente = docs.filter(d => d.escopo === 'agente' && a.arquivos.includes(d.id))
  const todos = [...doWorkspace, ...doAgente]
  const soma = (l: ArquivoDeReferencia[]) => l.reduce((s, d) => s + d.tokens, 0)
  const total = soma(todos)
  const fixados = soma(todos.filter(d => d.fixado))
  const ids = a.modelosPermitidos.length ? a.modelosPermitidos : [a.model]
  const menor = ids.map(modeloPorId).filter(Boolean).sort((x, y) => x!.contexto - y!.contexto)[0]
  const limite = Math.floor((menor?.contexto ?? 128) / 2)
  return {
    doWorkspace,
    doAgente,
    todos,
    total,
    fixados,
    limite,
    menorModelo: menor?.name ?? '',
    pct: Math.round((total / limite) * 100),
    modo: (total <= limite ? 'inteiro' : 'trechos') as 'inteiro' | 'trechos',
    fixadosCabem: fixados <= limite,
  }
}

/** Ícone e cor de cada tipo de documento. */
export const iconeDoDocumento = (tipo: ArquivoDeReferencia['tipo']) => ({
  pdf: { icone: 'i-lucide-file-text', cor: 'text-error' },
  docx: { icone: 'i-lucide-file-type', cor: 'text-info' },
  xlsx: { icone: 'i-lucide-file-spreadsheet', cor: 'text-success' },
  texto: { icone: 'i-lucide-notebook-pen', cor: 'text-primary' },
}[tipo])

/** Severidade da regra do manual: ordem, cor e ícone (a cor nunca vem sozinha). */
export const ORDEM_DAS_SEVERIDADES: Severidade[] = ['critical', 'high', 'medium', 'low', 'info']
export const corDaSeveridade: Record<Severidade, 'error' | 'warning' | 'info' | 'neutral'> = { critical: 'error', high: 'warning', medium: 'info', low: 'neutral', info: 'neutral' }
export const iconeDaSeveridade: Record<Severidade, string> = { critical: 'i-lucide-octagon-alert', high: 'i-lucide-triangle-alert', medium: 'i-lucide-circle-alert', low: 'i-lucide-circle-dot', info: 'i-lucide-info' }

/** O modelo comporta os fixados do agente? */
export const fixadosCabemNo = (contexto: number, fixados: number) => fixados <= contexto / 2

export function usePoliticas() {
  return useState<Politicas>('cda-politicas', () => ({
    criacao: 'completos',
    // Os 3 modelos leves que inventaram dados no teste real ficam desligados no exemplo.
    modelos: modelos.map(m => m.id).filter(id => !['google/gemini-3.5-flash-lite', 'openai/gpt-6-luna', 'zai/glm-5.3-flash'].includes(id)),
    bloqueadas: ['inviteMember', 'createRole', 'updateRole'],
    confirmacaoObrigatoria: true,
    dominios: ['tjsp.jus.br', 'tjmg.jus.br', 'trt2.jus.br'],
    limite: 30000,
  }))
}

/** O que está aberto na tela. */
export function useTela() {
  return useState('cda-tela', () => ({
    aba: 'agentes' as AbaDoTopo,
    /** A central sem nenhum agente do workspace (estado vazio). */
    vazia: false,
    criarAberto: false,
    editorAberto: false,
    /** slug do agente em edição; null = agente novo */
    editando: null as string | null,
    abaDoEditor: 'essencial' as AbaDoEditor,
    chatAberto: false,
    chatAgente: 'respostas-a-oficios',
    cenario: 'confirmacao' as CenarioDoChat,
    cartao: 'pendente' as EstadoDoCartao,
  }))
}

export function agenteVazio(dono: number): Agente {
  return {
    slug: '',
    name: '',
    description: '',
    role: '',
    approach: '',
    instructions: '',
    rules: [],
    writing_style: 'professional',
    model: 'anthropic/claude-sonnet-5.5',
    modelosPermitidos: ['anthropic/claude-sonnet-5.5'],
    type: 'chat',
    status: 'active',
    source: 'workspace',
    icon: null,
    ferramentas: {},
    arquivos: [],
    usarDoWorkspace: true,
    blocos: [],
    acesso: 'todos',
    acessoAlvos: [],
    editores: [dono],
    dono,
    sugestoes: [],
    casos: [],
    uso: { conversas: 0, pessoas: 0, creditos: 0, positivas: 0, negativas: 0, confirmacoes: 0, canceladas: 0 },
    atualizadoEm: '2026-11-16',
    cor: '#60a5fa',
  }
}

export const formatarData = (iso: string, locale: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })

export const espera = (ms: number) => new Promise(r => setTimeout(r, ms))
