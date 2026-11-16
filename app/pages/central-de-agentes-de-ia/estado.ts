/**
 * O estado do protótipo, em memória. Recarregar a página volta tudo ao começo.
 *
 * Um `useState` por assunto, para os componentes da pasta dividirem o mesmo
 * dado sem passar tudo por props: a lista de agentes, a biblioteca de modelos
 * de resposta, os arquivos, as políticas e o que está aberto na tela.
 */
import { agentes as agentesIniciais, arquivos as arquivosIniciais, blocos as blocosIniciais, type Agente } from './mocks'
import { modelos } from './catalogo'

const copia = <T>(x: T): T => JSON.parse(JSON.stringify(x))

export type AbaDoTopo = 'agentes' | 'respostas' | 'playbooks' | 'atividade' | 'politicas'
export type AbaDoEditor = 'essencial' | 'personalizacao' | 'ferramentas' | 'conhecimento' | 'respostas' | 'acesso' | 'testar' | 'versoes' | 'desempenho'
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

export function useArquivos() {
  return useState('cda-arquivos', () => copia(arquivosIniciais))
}

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
    basesDeConhecimento: [],
    blocos: [],
    acesso: 'todos',
    acessoAlvos: [],
    editores: [dono],
    dono,
    sugestoes: [],
    versoes: [{ numero: 1, publicadaEm: null, por: dono, resumo: '' }],
    rascunhoPendente: true,
    casos: [],
    uso: { conversas: 0, pessoas: 0, creditos: 0, positivas: 0, negativas: 0, confirmacoes: 0, canceladas: 0 },
    atualizadoEm: '2026-11-16',
    cor: '#60a5fa',
  }
}

export const formatarData = (iso: string, locale: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })

export const espera = (ms: number) => new Promise(r => setTimeout(r, ms))
