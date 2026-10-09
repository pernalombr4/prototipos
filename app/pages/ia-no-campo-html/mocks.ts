/**
 * Dado do protótipo: fictício, tipado, sem API.
 *
 * O item é o mesmo contrato do protótipo pastas-do-item (categoria Contratos
 * do workspace enspace-releases, estrutura de 08/10/2026). Os 2 campos HTML
 * (Parecer do jurídico e Observações internas) são inventados para esta
 * demanda: o primeiro vem preenchido e com erros de digitação de propósito,
 * para "Corrigir ortografia" ter o que corrigir; o segundo vem vazio, para
 * mostrar o placeholder e o "Rascunhar com os dados do item".
 *
 * Agentes e modelos seguem o cadastro de Configurações › Agentes de IA
 * (en-docs, "AI Agents", lido em 09/10/2026) e o schema `Agent` do SDK.
 */
import type { Agent, Item } from '@be-enlighten/enspace-sdk-schemas'

export const workspace = { name: 'Enspace Releases', reference: 'enspace-releases' }

export const categoria = { slug: 'contratos', name: 'Contratos' }

export const item: Item = {
  id: 48213,
  created_at: new Date('2026-09-30T09:28:30'),
  updated_at: new Date('2026-10-06T16:02:11'),
  deleted_at: null,
  reference: 'CON7A21F0C93B4E1D8A55B2C10E4F6A9',
  request_email: 'compras@tecnoverde.example',
  status: 'active',
  stage_status: null,
  data: {
    fornecedor: 'Tecnoverde Soluções Ambientais Ltda.',
    objeto: 'Coleta e destinação de resíduos das 3 unidades de Campinas',
    moeda: 'BRL',
    valor: 'R$ 43.358,10',
    indice: 'IPCA acumulado de 11,46%',
    valor_corrigido: 'R$ 48.327,14',
    vigencia: '31/12/2026',
    parecer: [
      '<p>O contrato com a Tecnoverde vence em 31/12/2026. O fornecedor mandou a proposta de renovaçao com reajuste pelo IPCA acumulado de 11,46%, oque leva o valor mensal de R$ 43.358,10 para R$ 48.327,14.</p>',
      '<p>a unidade 2 ainda nao devolveu o aditivo assinado e sem ele a renovaçao fica travada. O juridico pediu o documento em 03/10/2026 e ainda não teve retorno.</p>',
    ].join(''),
    observacoes: '',
  },
}

/** Os campos da Visão Geral, na ordem do formulário. Rótulos da categoria (dado do workspace, não se traduzem). */
export const campos = [
  { chave: 'fornecedor', rotulo: 'Fornecedor relacionado', tipo: 'relacao' },
  { chave: 'objeto', rotulo: 'Objeto do contrato', tipo: 'texto' },
  { chave: 'valor', rotulo: 'Valor do contrato', tipo: 'moeda' },
  { chave: 'valor_corrigido', rotulo: 'Valor corrigido', tipo: 'moeda' },
  { chave: 'vigencia', rotulo: 'Vigência até', tipo: 'texto' },
  { chave: 'parecer', rotulo: 'Parecer do jurídico', tipo: 'html' },
  { chave: 'observacoes', rotulo: 'Observações internas', tipo: 'html' },
] as const

/** Os campos que o BENI lê como contexto: todos menos os HTML. */
export const camposDeContexto = campos.filter(c => c.tipo !== 'html')

/** As folders do item, como a tela mostra hoje. Só a Visão Geral tem conteúdo nesta proposta. */
export const pastas = [
  { id: 'visao-geral', icone: 'i-lucide-layers' },
  { id: 'comentarios', icone: 'i-lucide-message-circle' },
  { id: 'logs', icone: 'i-lucide-shield-check' },
  { id: 'spaceflows', icone: 'i-lucide-workflow' },
  { id: 'anexos', icone: 'i-lucide-paperclip' },
  { id: 'notas', icone: 'i-lucide-notebook-text' },
] as const

/* ------------------------------------------------------------ modelos ---- */

/**
 * Os modelos do cadastro de agente (en-docs, "AI Agents", tabela "Language
 * Model"). "auto" é proposta deste protótipo: o ENSPACE escolhe o modelo.
 * As notas de velocidade e inteligência (1 a 5) e o custo são inventados,
 * para mostrar o formato; o perfil de cada um sai da documentação.
 */
export interface Modelo {
  id: string
  nome: string
  provedor: string
  velocidade: number
  inteligencia: number
  custo: 1 | 2 | 3
}

export const modelos: Modelo[] = [
  { id: 'auto', nome: 'Auto', provedor: '', velocidade: 4, inteligencia: 4, custo: 2 },
  { id: 'claude-sonnet-4.6', nome: 'Claude Sonnet 4.6', provedor: 'Anthropic', velocidade: 4, inteligencia: 4, custo: 2 },
  { id: 'claude-opus-4.6', nome: 'Claude Opus 4.6', provedor: 'Anthropic', velocidade: 2, inteligencia: 5, custo: 3 },
  { id: 'gpt-5.4', nome: 'GPT-5.4', provedor: 'OpenAI', velocidade: 3, inteligencia: 5, custo: 3 },
  { id: 'gpt-5.2', nome: 'GPT-5.2', provedor: 'OpenAI', velocidade: 3, inteligencia: 4, custo: 3 },
  { id: 'gpt-5-mini', nome: 'GPT-5-mini', provedor: 'OpenAI', velocidade: 5, inteligencia: 3, custo: 1 },
  { id: 'gemini-3.1-pro-preview', nome: 'Gemini 3.1 Pro Preview', provedor: 'Google', velocidade: 3, inteligencia: 5, custo: 3 },
  { id: 'gemini-3-flash', nome: 'Gemini 3 Flash', provedor: 'Google', velocidade: 5, inteligencia: 3, custo: 1 },
  { id: 'deepseek-r1', nome: 'DeepSeek-r1', provedor: 'DeepSeek', velocidade: 2, inteligencia: 4, custo: 2 },
  { id: 'deepseek-v3.2', nome: 'DeepSeek-v3.2', provedor: 'DeepSeek', velocidade: 4, inteligencia: 3, custo: 1 },
]

/* ------------------------------------------------------------ agentes ---- */

/**
 * Agente com o que a lista do campo precisa saber de quem pede.
 * `podeUsar` é inventado: o cadastro restringe por membro ("restrict which
 * workspace members can use this agent"), e o back-end responderia isso por
 * quem está logado. Agente sem acesso ou inativo não aparece na lista.
 */
export type AgenteDoCampo = Agent & { podeUsar: boolean }

const base = { created_at: new Date('2026-08-01T10:00:00'), updated_at: new Date('2026-09-20T15:30:00') }

/* Cores do BENI de cada agente: dado do cadastro (`beniTheme`), não cor de interface. */
export const agentes: AgenteDoCampo[] = [
  { ...base, id: 11, reference: 'AGT01', slug: 'assistente-juridico', name: 'Assistente Jurídico', description: 'Escreve pareceres e cláusulas no padrão do jurídico.', role: 'Assistente jurídico', approach: 'Cita a cláusula antes de concluir.', model: 'claude-opus-4.6', type: 'chat', status: 'active', icon: 'i-lucide-scale', beniTheme: { colors: { body: '#1e3a8a', bodyTo: '#1e40af', eyes: '#fde68a' }, headItem: 'helmet' }, podeUsar: true },
  { ...base, id: 12, reference: 'AGT02', slug: 'revisor-de-contratos', name: 'Revisor de Contratos', description: 'Aponta erro, ambiguidade e prazo que falta.', role: 'Revisor técnico', approach: 'Sugere, nunca reescreve tudo.', model: 'gpt-5.4', type: 'reviewer', status: 'active', icon: 'i-lucide-file-check', beniTheme: { colors: { body: '#7c3aed', bodyTo: '#5b21b6', eyes: '#a7f3d0' }, headItem: 'crown' }, podeUsar: true },
  { ...base, id: 13, reference: 'AGT03', slug: 'redator-comercial', name: 'Redator Comercial', description: 'Texto para fornecedor e cliente, em tom cordial.', role: 'Redator', approach: 'Frases curtas e diretas.', model: 'claude-sonnet-4.6', type: 'chat', status: 'active', icon: 'i-lucide-pen-tool', beniTheme: { colors: { body: '#f97316', bodyTo: '#ea580c', eyes: '#ffffff' }, headItem: 'partyhat' }, podeUsar: true },
  { ...base, id: 14, reference: 'AGT04', slug: 'analista-financeiro', name: 'Analista Financeiro', description: 'Reajuste, índice e impacto no orçamento.', role: 'Analista financeiro', approach: 'Mostra a conta.', model: 'gemini-3.1-pro-preview', type: 'chat', status: 'active', icon: 'i-lucide-calculator', beniTheme: { colors: { body: '#059669', bodyTo: '#047857', eyes: '#fef9c3' }, headItem: 'beanie' }, podeUsar: true },
  { ...base, id: 15, reference: 'AGT05', slug: 'tradutor-tecnico', name: 'Tradutor Técnico', description: 'Traduz mantendo os termos do contrato.', role: 'Tradutor', approach: 'Mantém o glossário.', model: 'gpt-5-mini', type: 'chat', status: 'active', icon: 'i-lucide-languages', beniTheme: { colors: { body: '#0891b2', bodyTo: '#0e7490', eyes: '#ffffff' }, headItem: null }, podeUsar: true },
  { ...base, id: 16, reference: 'AGT06', slug: 'atendimento-n1', name: 'Atendimento N1', description: 'Responde chamados com base na Base de Conhecimento.', role: 'Atendente', approach: 'Pergunta antes de responder.', model: 'gemini-3-flash', type: 'chat', status: 'active', icon: 'i-lucide-headset', beniTheme: { colors: { body: '#db2777', bodyTo: '#be185d', eyes: '#ffffff' }, headItem: 'stanhat' }, podeUsar: true },
  { ...base, id: 17, reference: 'AGT07', slug: 'onboarding', name: 'Agente de Onboarding', description: 'Inativo: não aparece no campo.', role: 'Guia', approach: '', model: 'gpt-5-mini', type: 'chat', status: 'inactive', podeUsar: true },
  { ...base, id: 18, reference: 'AGT08', slug: 'compliance', name: 'Compliance', description: 'Restrito à diretoria: não aparece para quem não tem acesso.', role: 'Compliance', approach: '', model: 'claude-opus-4.6', type: 'reviewer', status: 'active', podeUsar: false },
]

/** O que a lista do campo mostra: ativos e com acesso. */
export const agentesVisiveis = agentes.filter(a => a.status === 'active' && a.podeUsar)

/* -------------------------------------------- menções, links, pedidos ---- */

/** Membros para o "@". Nomes fictícios. */
export const membros = [
  { label: 'Renata Albuquerque', iniciais: 'RA' },
  { label: 'Diego Furtado', iniciais: 'DF' },
  { label: 'Camila Prado', iniciais: 'CP' },
  { label: 'Otávio Nunes', iniciais: 'ON' },
  { label: 'Larissa Bento', iniciais: 'LB' },
  { label: 'Marcos Teixeira', iniciais: 'MT' },
]

/** Itens do workspace que o link encontra pela busca (categoria e referência inventadas). */
export const itensParaLink = [
  { titulo: 'Aditivo da unidade 2', categoria: 'Contratos', ref: 'CON9D3F1A7C2E5B' },
  { titulo: 'Tecnoverde Soluções Ambientais', categoria: 'Fornecedores', ref: 'FOR2C6A8E0D4F1B' },
  { titulo: 'Proposta de renovação 2027', categoria: 'Contratos', ref: 'CON4E09C7A2B13D' },
  { titulo: 'Reajuste anual pelo IPCA', categoria: 'Base de conhecimento', ref: 'KB8F1E3D5C7B9A' },
  { titulo: 'Coleta de resíduos: unidade 3', categoria: 'Chamados', ref: 'CHA6B4D2F0E8C6' },
  { titulo: 'Grupo Atalaia Segurança', categoria: 'Fornecedores', ref: 'FOR1B88E2D0F64' },
]

/** Pedidos salvos (os "Skills" do Notion). Começa com 1, para a lista não nascer vazia. */
export interface PedidoSalvo { id: string, nome: string, prompt: string }

export const pedidosSalvosIniciais: PedidoSalvo[] = [
  { id: 'ps1', nome: 'Parecer no padrão do jurídico', prompt: 'reescreva como parecer do jurídico, com conclusão e prazo' },
]
