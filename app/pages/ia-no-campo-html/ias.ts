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
 * O formato da chave segue o prefixo público de cada empresa; a chave nunca
 * sai do navegador.
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
  formato?: RegExp
  inicioDaChave?: string
  urlDaChave?: string
}

export const ias: IaConectavel[] = [
  { id: 'openai', nome: 'ChatGPT', empresa: 'OpenAI', provedor: 'OpenAI', disponivel: true, formato: /^sk-(?!ant-)[\w-]{17,}$/, inicioDaChave: 'sk-', urlDaChave: 'https://platform.openai.com/api-keys' },
  { id: 'anthropic', nome: 'Claude', empresa: 'Anthropic', provedor: 'Anthropic', disponivel: true, formato: /^sk-ant-[\w-]{16,}$/, inicioDaChave: 'sk-ant-', urlDaChave: 'https://console.anthropic.com/settings/keys' },
  { id: 'google', nome: 'Gemini', empresa: 'Google', provedor: 'Google', disponivel: true, formato: /^AIza[\w-]{20,}$/, inicioDaChave: 'AIza', urlDaChave: 'https://aistudio.google.com/apikey' },
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
