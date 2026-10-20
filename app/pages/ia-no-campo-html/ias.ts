/**
 * As contas de IA cuja chave o workspace pode conectar. PROPOSTA (rodadas 7 e 10).
 *
 * Todos os modelos funcionam sem chave nenhuma, cobrados em en-credits do
 * ENSPACE (redatora, 2026-10-20). Conectar a chave de uma conta própria só
 * muda quem paga: o consumo dos modelos daquela empresa passa a ser cobrado na
 * conta dela. Hoje o ENSPACE aceita a chave da OpenAI (Configurações ›
 * Integrações › OpenAI); Anthropic e Google são SIMULADAS aqui, para mostrar o
 * formato com mais de uma; Moonshot AI (Kimi) e DeepSeek entram como "Em breve".
 *
 * `provedor` é o mesmo texto do campo `provedor` dos modelos (mocks.ts): é por
 * ele que o seletor de Modelo e a barra da proposta sabem em que conta o
 * consumo de cada modelo cai.
 *
 * SIMULAÇÃO (rodada 8): qualquer chave preenchida conecta, para mostrar o que
 * acontece depois de colar a chave. `inicioDaChave` só preenche o exemplo do
 * campo. A chave nunca sai do navegador.
 */
import { modelos } from './mocks'

export type IdDaIa = 'openai' | 'anthropic' | 'google' | 'kimi' | 'deepseek'

export interface IaConectavel {
  id: IdDaIa
  /** o produto, como a pessoa conhece */
  nome: string
  /** a empresa dona da conta e da cobrança */
  empresa: string
  provedor: string
  disponivel: boolean
  inicioDaChave?: string
  urlDaChave?: string
}

export const ias: IaConectavel[] = [
  { id: 'openai', nome: 'ChatGPT', empresa: 'OpenAI', provedor: 'OpenAI', disponivel: true, inicioDaChave: 'sk-', urlDaChave: 'https://platform.openai.com/api-keys' },
  { id: 'anthropic', nome: 'Claude', empresa: 'Anthropic', provedor: 'Anthropic', disponivel: true, inicioDaChave: 'sk-ant-', urlDaChave: 'https://console.anthropic.com/settings/keys' },
  { id: 'google', nome: 'Gemini', empresa: 'Google', provedor: 'Google', disponivel: true, inicioDaChave: 'AIza', urlDaChave: 'https://aistudio.google.com/apikey' },
  { id: 'kimi', nome: 'Kimi', empresa: 'Moonshot AI', provedor: 'Moonshot AI', disponivel: false },
  { id: 'deepseek', nome: 'DeepSeek', empresa: 'DeepSeek', provedor: 'DeepSeek', disponivel: false },
]

export const iaPorId = (id: IdDaIa) => ias.find(i => i.id === id)!

/** A IA de que o modelo depende; "auto" não depende de uma só. */
export function iaDoModelo(modeloId: string): IaConectavel | null {
  const provedor = modelos.find(m => m.id === modeloId)?.provedor
  return provedor ? ias.find(i => i.provedor === provedor) ?? null : null
}

export const modelosDa = (id: IdDaIa) => modelos.filter(m => m.provedor === iaPorId(id).provedor)

/*
 * O "Auto" escolhe o modelo pelo pedido (rodadas 9 e 10), entre todos os
 * modelos, com chave ou sem: pedido curto e de conferência vai ao modelo
 * rápido; o resto, ao de mais qualidade. Regra inventada para o protótipo; a
 * do produto é do time.
 */
const acoesRapidas = ['corrigir', 'traduzir', 'encurtar', 'simplificar', 'lista']
const filaRapida = ['gpt-5-mini', 'gemini-3-flash', 'claude-sonnet-4.6']
const filaDeQualidade = ['claude-sonnet-4.6', 'gpt-5.4', 'gemini-3.1-pro-preview']

export function modeloDoAuto(acao: string) {
  const id = (acoesRapidas.includes(acao) ? filaRapida : filaDeQualidade)[0]
  return modelos.find(m => m.id === id) ?? null
}

/** As contas com chave conectada no workspace. O andaime escolhe quais. */
export const useIasConectadas = () => useState<IdDaIa[]>('ias-conectadas', () => [])

/**
 * O pedido para abrir o modal das chaves (_ConectarIa). Um modal só na página
 * (index.vue); quem pede passa o que fazer ao voltar.
 */
export interface PedidoDeConexao {
  /** abre direto no passo da chave desta conta */
  ia?: IdDaIa | null
  aoVoltar?: (conectou: IdDaIa[]) => void
}

export const conexao = reactive<{ aberto: boolean, pedido: PedidoDeConexao }>({ aberto: false, pedido: {} })

export function pedirConexao(pedido: PedidoDeConexao = {}) {
  conexao.pedido = pedido
  conexao.aberto = true
}
