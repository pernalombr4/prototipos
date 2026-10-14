/**
 * As IAs que o workspace pode conectar. PROPOSTA (rodada 7).
 *
 * Hoje o ENSPACE tem uma só: a integração OpenAI (Configurações ›
 * Integrações › OpenAI). Claude e Gemini são SIMULADOS aqui, para mostrar o
 * formato com mais de uma; Kimi e DeepSeek entram como "Em breve".
 *
 * `provedor` é o mesmo texto do campo `provedor` dos modelos (mocks.ts): é por
 * ele que o seletor de Modelo sabe se o modelo está liberado.
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
 * O "Auto" escolhe entre as IAs conectadas (rodada 9): pedido curto e de
 * conferência vai ao modelo rápido; o resto, ao de mais qualidade. A ordem de
 * cada fila diz qual IA vem antes quando há mais de uma. Regra inventada para
 * o protótipo; a do produto é do time.
 */
const acoesRapidas = ['corrigir', 'traduzir', 'encurtar', 'simplificar', 'lista']
const filaRapida = ['gpt-5-mini', 'gemini-3-flash', 'claude-sonnet-4.6']
const filaDeQualidade = ['claude-sonnet-4.6', 'gpt-5.4', 'gemini-3.1-pro-preview']

export function modeloDoAuto(acao: string, conectadas: IdDaIa[]) {
  const fila = acoesRapidas.includes(acao) ? filaRapida : filaDeQualidade
  const id = fila.find(m => conectadas.includes(iaDoModelo(m)!.id))
  return modelos.find(m => m.id === id) ?? null
}

/** As IAs conectadas no workspace. O andaime põe a OpenAI quando a IA está ligada. */
export const useIasConectadas = () => useState<IdDaIa[]>('ias-conectadas', () => [])

/**
 * O pedido para abrir o modal "Conectar uma IA". Um modal só na página
 * (index.vue); quem pede passa o que fazer ao voltar.
 */
export interface PedidoDeConexao {
  /** abre direto no passo da chave desta IA */
  ia?: IdDaIa | null
  /** o que a pessoa tinha pedido ao BENI, para dizer que roda ao voltar */
  pendente?: string
  /** por que este modal abriu, quando foi por um modelo */
  motivo?: string
  aoVoltar?: (conectou: IdDaIa[]) => void
}

export const conexao = reactive<{ aberto: boolean, pedido: PedidoDeConexao }>({ aberto: false, pedido: {} })

export function pedirConexao(pedido: PedidoDeConexao = {}) {
  conexao.pedido = pedido
  conexao.aberto = true
}
