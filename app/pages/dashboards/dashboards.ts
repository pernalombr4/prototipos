/**
 * Exemplos de dashboards que uma pessoa montou. Rodada 2: o ENSPACE não traz dashboard
 * pronto, porque começa sem categoria e sem campo, e o nome de um campo não diz o que
 * ele significa. Estes exemplos só abrem pelo andaime ("Dashboard montado"): são o
 * resultado de alguém ter usado o construtor, painel por painel.
 *
 * Os painéis cobrem de propósito os casos que a pesquisa apontou:
 * - múltipla seleção como agrupamento (Áreas envolvidas, Temas): aviso de soma maior que o total;
 * - relação como agrupamento (Cliente, Contrato), com teto e "Outros";
 * - campo virtual como medida (Valor mensal), que hoje é recusado;
 * - painel que ignora o período do topo (estoque: "em negociação agora");
 * - barra empilhada (quebra), que hoje não existe;
 * - funil pela ordem das opções.
 */
import type { ConfigDoPainel, FiltroDeCampo, Periodo } from './agregacao'
import { painelEmBranco } from './agregacao'

/**
 * PROPOSTA (rodada 2): a visão salva, como o segmento do Clarity. Guarda o período, os
 * filtros do dashboard e os filtros que a pessoa pôs em cada painel, para voltar ao
 * mesmo recorte depois. Nasce só para quem salvou; quem é owner ou full também pode
 * salvar para o workspace inteiro.
 */
export interface Visao {
  id: string
  nome: string
  escopo: 'eu' | 'workspace'
  periodo: Periodo
  filtros: FiltroDeCampo[]
  /** Filtros só da visão, por painel. */
  filtrosDosPaineis: Record<string, FiltroDeCampo[]>
}

export interface Dashboard {
  id: string
  nome: string
  descricao?: string
  /** Inventado pelo protótipo: grupos que veem o dashboard. Vazio = todos os membros. */
  grupos: string[]
  /** Minutos entre recargas automáticas. Hoje o padrão é 5. */
  recarga: number
  paineis: ConfigDoPainel[]
  /** Rodada 2: as visões salvas deste dashboard. */
  visoes: Visao[]
}

/** Atalho: parte do painel em branco e troca só o que muda. */
const p = (id: string, cfg: Partial<ConfigDoPainel>): ConfigDoPainel => ({ ...painelEmBranco(id), ...cfg })

export const GRUPOS_DO_WORKSPACE = ['Diretoria', 'Comercial', 'Jurídico', 'Atendimento', 'Financeiro']

export const DASHBOARDS: Dashboard[] = [
  {
    id: 'comercial',
    nome: 'Comercial',
    descricao: 'Contratos, clientes e o atendimento dos clientes com contrato.',
    grupos: ['Diretoria', 'Comercial'],
    recarga: 5,
    visoes: [
      {
        id: 'v-sp',
        nome: 'São Paulo, este trimestre',
        escopo: 'workspace',
        periodo: 'quarter',
        filtros: [
          { categoria: 'contratos', campo: 'unidade', operador: 'em', valores: ['sao_paulo'] },
          { categoria: 'chamados', campo: 'unidade', operador: 'em', valores: ['sao_paulo'] },
        ],
        filtrosDosPaineis: {},
      },
      {
        id: 'v-grandes',
        nome: 'Contratos acima de R$ 100 mil',
        escopo: 'eu',
        periodo: 'year',
        filtros: [{ categoria: 'contratos', campo: 'valor', operador: 'maior', valores: ['100000'] }],
        filtrosDosPaineis: {},
      },
    ],
    paineis: [
      p('valor-assinado', { titulo: 'Valor assinado', descricao: 'Soma do valor dos contratos com data de assinatura no período. Contrato sem data de assinatura não entra.', categoria: 'contratos', funcao: 'soma', medida: 'valor', campoDeData: 'assinatura', icone: 'i-lucide-badge-dollar-sign' }),
      p('em-negociacao', {
        titulo: 'Contratos em negociação',
        categoria: 'contratos',
        condicoes: [{ categoria: 'contratos', campo: 'status', operador: 'em', valores: ['em_negociacao'] }],
        periodo: 'todo',
        icone: 'i-lucide-handshake',
      }),
      p('ticket-medio', {
        titulo: 'Ticket médio',
        descricao: 'Valor médio dos contratos assinados no período. Acordos de confidencialidade ficam de fora, porque não têm valor.',
        categoria: 'contratos',
        funcao: 'media',
        medida: 'valor',
        campoDeData: 'assinatura',
        condicoes: [{ categoria: 'contratos', campo: 'tipo', operador: 'foraDe', valores: ['confidencialidade'] }],
        icone: 'i-lucide-scale',
      }),
      p('chamados-abertos', {
        titulo: 'Chamados em aberto',
        categoria: 'chamados',
        condicoes: [{ categoria: 'chamados', campo: 'status', operador: 'em', valores: ['aberto', 'em_atendimento', 'aguardando_cliente'] }],
        periodo: 'todo',
        icone: 'i-lucide-headset',
      }),
      p('status-unidade', { categoria: 'contratos', agruparPor: 'status', quebrarPor: 'unidade', visualizacao: 'barras', w: 8, h: 5 }),
      p('tipo', { categoria: 'contratos', agruparPor: 'tipo', visualizacao: 'rosca', w: 4, h: 5 }),
      p('valor-mes', {
        titulo: 'Valor assinado por mês',
        categoria: 'contratos',
        funcao: 'soma',
        medida: 'valor',
        agruparPor: 'assinatura',
        campoDeData: 'assinatura',
        granularidade: 'mes',
        visualizacao: 'linha',
        w: 8,
        h: 5,
      }),
      p('funil', {
        titulo: 'Funil de contratos',
        descricao: 'Cada etapa conta os contratos que chegaram até ela. Cancelados ficam de fora.',
        categoria: 'contratos',
        agruparPor: 'status',
        condicoes: [{ categoria: 'contratos', campo: 'status', operador: 'foraDe', valores: ['cancelado'] }],
        visualizacao: 'funil',
        w: 4,
        h: 5,
      }),
      p('clientes-chamados', {
        titulo: 'Clientes com mais chamados',
        categoria: 'chamados',
        agruparPor: 'cliente',
        visualizacao: 'barrasHorizontais',
        ordem: 'valorDesc',
        limite: 8,
        w: 6,
        h: 6,
      }),
      p('areas', { categoria: 'contratos', agruparPor: 'areas', visualizacao: 'barras', ordem: 'valorDesc', w: 6, h: 6 }),
      p('valor-mensal-tipo', {
        titulo: 'Valor mensal médio por tipo',
        categoria: 'contratos',
        funcao: 'media',
        medida: 'valor_mensal',
        agruparPor: 'tipo',
        visualizacao: 'tabela',
        ordem: 'valorDesc',
        w: 12,
        h: 4,
      }),
    ],
  },
  {
    id: 'atendimento',
    nome: 'Atendimento',
    descricao: 'Volume, tempo e satisfação dos chamados.',
    grupos: [],
    recarga: 5,
    visoes: [],
    paineis: [
      p('chamados', { titulo: 'Chamados no período', categoria: 'chamados', icone: 'i-lucide-inbox' }),
      p('tempo-medio', { titulo: 'Tempo médio de resolução', categoria: 'chamados', funcao: 'media', medida: 'horas', icone: 'i-lucide-timer' }),
      p('tempo-mediano', { titulo: 'Tempo mediano de resolução', categoria: 'chamados', funcao: 'mediana', medida: 'horas', icone: 'i-lucide-timer-reset' }),
      p('nota', { titulo: 'Nota média de satisfação', categoria: 'chamados', funcao: 'media', medida: 'nota', icone: 'i-lucide-star' }),
      p('mes-prioridade', { categoria: 'chamados', agruparPor: 'created_at', quebrarPor: 'prioridade', granularidade: 'mes', visualizacao: 'barras', w: 12, h: 5 }),
      p('temas', { categoria: 'chamados', agruparPor: 'temas', visualizacao: 'barrasHorizontais', ordem: 'valorDesc', w: 6, h: 5 }),
      p('canal', { categoria: 'chamados', agruparPor: 'canal', visualizacao: 'rosca', w: 6, h: 5 }),
      p('unidade-horas', { titulo: 'Tempo médio por unidade', categoria: 'chamados', funcao: 'media', medida: 'horas', agruparPor: 'unidade', visualizacao: 'tabela', ordem: 'valorDesc', w: 12, h: 4 }),
    ],
  },
  {
    id: 'despesas',
    nome: 'Despesas',
    grupos: ['Diretoria', 'Financeiro'],
    recarga: 15,
    visoes: [],
    paineis: [
      p('pago', {
        titulo: 'Total pago',
        categoria: 'despesas',
        funcao: 'soma',
        medida: 'valor',
        campoDeData: 'pagamento',
        icone: 'i-lucide-wallet',
      }),
      p('maior', { titulo: 'Maior despesa', categoria: 'despesas', funcao: 'maximo', medida: 'valor', icone: 'i-lucide-arrow-up-wide-narrow' }),
      p('centro', { categoria: 'despesas', funcao: 'soma', medida: 'valor', agruparPor: 'centro', visualizacao: 'barras', ordem: 'valorDesc', w: 6, h: 5 }),
      p('mes', { categoria: 'despesas', funcao: 'soma', medida: 'valor', agruparPor: 'pagamento', campoDeData: 'pagamento', granularidade: 'mes', quebrarPor: 'centro', visualizacao: 'area', w: 6, h: 5 }),
      p('por-contrato', { titulo: 'Contratos com mais despesa', categoria: 'despesas', funcao: 'soma', medida: 'valor', agruparPor: 'contrato', visualizacao: 'barrasHorizontais', ordem: 'valorDesc', limite: 8, w: 12, h: 6 }),
    ],
  },
]
