/**
 * O catálogo do produto: os 19 modelos de IA e as 51 ferramentas do agente.
 *
 * ESTRUTURA lida no código do ENSPACE (develop, 2026-11-16): ids, provedores,
 * ordem, capacidades dos modelos, slugs das ferramentas, grupo e se a
 * ferramenta lê ou grava. É o que o servidor já manda (`AiModelProjection` e
 * `AgentToolCatalogItem` do enspace-sdk-schemas).
 *
 * INVENTADO pelo protótipo, marcado em cada campo:
 * - `contexto` (tamanho da janela de contexto) e `custo` (faixa relativa de
 *   preço) dos modelos: valores fictícios, para mostrar o aviso de tamanho e o
 *   consumo. O dev troca pelos números do provedor;
 * - `efeito` da ferramenta: a proposta separa "grava" em grava, envia, cobra e
 *   sai do ENSPACE, porque o risco de cada um é diferente (BRIEFING, caso real).
 */
import type { AgentToolCatalogItem, AiModelProjection } from '@be-enlighten/enspace-sdk-schemas'

/* ────────────────────────────── Modelos ────────────────────────────── */

export type Provedor = 'alibaba' | 'anthropic' | 'deepseek' | 'google' | 'minimax' | 'moonshotai' | 'openai' | 'zai'

export interface Modelo extends Pick<AiModelProjection, 'id' | 'name' | 'provider' | 'vision' | 'reasoning'> {
  provider: Provedor
  /** `fileInput` e `toolUse` vêm do `GET /ai/models`; o schema do SDK ainda não os tipa. */
  fileInput: boolean
  toolUse: boolean
  /** INVENTADO: janela de contexto em milhares de tokens. */
  contexto: number
  /** INVENTADO: faixa de preço relativa, 1 (mais barato) a 4. */
  custo: 1 | 2 | 3 | 4
}

/** Nome da empresa como a tela mostra no grupo do seletor. */
export const nomeDoProvedor: Record<Provedor, string> = {
  alibaba: 'Alibaba',
  anthropic: 'Anthropic',
  deepseek: 'DeepSeek',
  google: 'Google',
  minimax: 'MiniMax',
  moonshotai: 'Moonshot AI',
  openai: 'OpenAI',
  zai: 'Z.ai',
}

/** Ícone do provedor: o seletor do chat de hoje usa simple-icons em 5 e o genérico nos outros 3. */
export const iconeDoProvedor: Record<Provedor, string> = {
  alibaba: 'i-simple-icons-alibabadotcom',
  anthropic: 'i-simple-icons-anthropic',
  deepseek: 'i-simple-icons-deepseek',
  google: 'i-simple-icons-google',
  minimax: 'i-lucide-cpu',
  moonshotai: 'i-lucide-cpu',
  openai: 'i-simple-icons-openai',
  zai: 'i-lucide-cpu',
}

const m = (
  provider: Provedor, name: string, vision: boolean, fileInput: boolean, toolUse: boolean, reasoning: boolean, contexto: number, custo: Modelo['custo'],
): Modelo => ({ id: `${provider}/${name}`, name, provider, vision, fileInput, toolUse, reasoning, contexto, custo })

/** A ordem do servidor. O seletor agrupa por provedor em ordem alfabética. */
export const modelos: Modelo[] = [
  m('openai', 'gpt-6-luna', true, true, true, false, 128, 1),
  m('openai', 'gpt-6.1-terra', true, true, true, true, 400, 2),
  m('openai', 'gpt-6.1-sol', true, true, true, true, 400, 3),
  m('google', 'gemini-3.5-flash-lite', true, true, true, false, 1000, 1),
  m('google', 'gemini-3.8-flash', true, true, true, true, 1000, 2),
  m('google', 'gemini-4-argon', true, true, true, true, 1000, 3),
  m('anthropic', 'claude-haiku-5.5', true, true, true, true, 200, 2),
  m('anthropic', 'claude-sonnet-5.5', true, true, true, true, 1000, 3),
  m('anthropic', 'claude-opus-5.5', true, true, true, true, 1000, 4),
  m('alibaba', 'qwen3.8-flash', false, true, true, true, 128, 1),
  m('alibaba', 'qwen3.8-max', false, true, true, true, 256, 2),
  m('alibaba', 'qwen3.8-max-prime', false, true, true, true, 256, 3),
  m('zai', 'glm-5.3-flash', false, true, true, true, 128, 1),
  m('zai', 'glm-5.3', false, true, true, true, 200, 2),
  m('moonshotai', 'kimi-k3.1-pro', false, true, true, true, 256, 3),
  m('moonshotai', 'kimi-k3.1-pro-highspeed', false, true, true, true, 256, 3),
  m('deepseek', 'deepseek-v4.1-flash', false, true, true, true, 128, 1),
  m('deepseek', 'deepseek-v4-pro', false, true, true, true, 128, 2),
  m('minimax', 'minimax-m3.1-flash', false, true, true, false, 200, 1),
]

/** O modelo padrão dos agentes no servidor. */
export const MODELO_PADRAO_DO_SERVIDOR = 'alibaba/qwen3.8-max'

export const modeloPorId = (id: string) => modelos.find(x => x.id === id)

export const provedoresEmOrdem = (Object.keys(nomeDoProvedor) as Provedor[]).sort()

/* ──────────────────────────── Ferramentas ──────────────────────────── */

export type Grupo = 'estrutura' | 'itens' | 'pessoas' | 'utilitarios' | 'tarefas' | 'juridico' | 'workspaces'

/**
 * PROPOSTA: o efeito diz o que acontece fora da conversa quando a ferramenta roda.
 * `le` é o único que executa sem cartão de confirmação por padrão.
 */
export type Efeito = 'le' | 'grava' | 'envia' | 'cobra' | 'sai' | 'acesso'

export interface Ferramenta extends Pick<AgentToolCatalogItem, 'slug'> {
  grupo: Grupo
  capability: 'read' | 'write'
  efeito: Efeito
  /** Exige membro completo ou dono (lido no código). */
  soMembroCompleto?: boolean
}

const f = (grupo: Grupo, capability: 'read' | 'write', efeito: Efeito, slugs: string[], soMembroCompleto = false): Ferramenta[] =>
  slugs.map(slug => ({ slug, grupo, capability, efeito, soMembroCompleto }))

export const ferramentas: Ferramenta[] = [
  ...f('itens', 'read', 'le', ['getItemByReference', 'smartQueryItems']),
  ...f('itens', 'read', 'grava', ['exportItems']),
  ...f('itens', 'write', 'grava', ['smartCreateItem', 'smartBatchCreateItems', 'updateItem']),
  ...f('tarefas', 'read', 'le', ['findTasks', 'getMyTasks', 'getTaskDetails', 'getTaskSummary']),
  ...f('tarefas', 'write', 'grava', ['createTask', 'updateTask', 'completeTask', 'delegateTask']),
  ...f('tarefas', 'write', 'envia', ['createTaskWithNotification']),
  ...f('utilitarios', 'read', 'le', ['readFile', 'searchKnowledgeBase', 'generateFrontendLink', 'getCurrentDateTime', 'calculateDate', 'inspectPdfForm']),
  ...f('utilitarios', 'read', 'sai', ['webSearch', 'fetchWebPage']),
  ...f('utilitarios', 'write', 'envia', ['sendEmail']),
  ...f('utilitarios', 'write', 'grava', ['generateDocument', 'fillPdfForm']),
  ...f('juridico', 'read', 'cobra', ['legalLookupCase', 'legalSearchCasesByParty', 'legalGetCaseMovements', 'legalGetCaseSummary', 'legalGetPartyStatistics']),
  ...f('estrutura', 'read', 'le', ['getTypes', 'getItemTypes', 'getFields', 'getWorkspaceSchema']),
  ...f('estrutura', 'write', 'grava', ['createType', 'updateType', 'setupCategory', 'createField', 'updateField'], true),
  ...f('pessoas', 'read', 'le', ['getWorkspaceMembers', 'getMemberGroups', 'getRoles']),
  ...f('pessoas', 'write', 'acesso', ['inviteMember', 'updateMember', 'createMemberGroup', 'updateMemberGroup', 'addUsersToMemberGroup', 'createRole', 'updateRole'], true),
  ...f('workspaces', 'read', 'le', ['listMyWorkspaces']),
]

export const grupos: Grupo[] = ['itens', 'tarefas', 'utilitarios', 'juridico', 'estrutura', 'pessoas', 'workspaces']

export const ferramentaPorSlug = (slug: string) => ferramentas.find(x => x.slug === slug)!

/** O que pede confirmação quando a pessoa não mexe em nada (demanda 1). */
export const pedeConfirmacaoPorPadrao = (x: Ferramenta) => x.efeito !== 'le'

export const iconeDoEfeito: Record<Efeito, string> = {
  le: 'i-lucide-eye',
  grava: 'i-lucide-pencil-line',
  envia: 'i-lucide-send',
  cobra: 'i-lucide-coins',
  sai: 'i-lucide-globe',
  acesso: 'i-lucide-user-cog',
}

export const corDoEfeito: Record<Efeito, 'neutral' | 'warning' | 'error' | 'info'> = {
  le: 'neutral',
  grava: 'warning',
  envia: 'error',
  cobra: 'error',
  sai: 'info',
  acesso: 'error',
}
