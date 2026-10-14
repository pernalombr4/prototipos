/**
 * O dado do protótipo "Meus relatórios". Fictício, sem API.
 *
 * A ESTRUTURA vem do develop, lida em 14/10/2026 na resposta de
 * `GET /c-report-requests?__relations=processed_report,report` (a lista da
 * tela `/workspaces/<ws>/myReports`). O `enspace-sdk-schemas` não tem esse
 * tipo, então ele está declarado aqui com os nomes de campo da resposta.
 *
 * Os VALORES são inventados: categoria, visualização, filtro, tamanho.
 *
 * Campos que a resposta NÃO tem e o protótipo acrescentou estão no bloco
 * `proto`, cada um com o motivo. É o que o back-end precisaria guardar para
 * a tela nova mostrar tudo.
 */
import type { ItemType } from '@be-enlighten/enspace-sdk-schemas'

/** O "agora" do protótipo. Todas as datas relativas saem dele. */
export const AGORA = new Date('2026-10-14T15:40:00-03:00')

/** Formato que o modal "Formato de extração" oferece: Excel, CSV, DBF. */
export type Formato = 'xlsx' | 'csv' | 'dbf'

/**
 * Status do pedido. `complete` é o único visto no develop; os outros três são
 * os estados que a tela precisa ter (o pedido nasce, processa e pode falhar).
 * O nome exato no back-end está por confirmar.
 */
export type StatusDoPedido = 'pending' | 'processing' | 'complete' | 'error'

/** De onde a extração saiu. `unique_key` como a API grava. */
export type ChaveDaOrigem = 'c_items' | 'tasks' | 'c_flow_item_tasks'

/** O arquivo gerado. Mesmo formato do `processed_report` da resposta. */
export interface ArquivoGerado {
  id: number
  name: string
  ext: '.xlsx' | '.csv' | '.dbf'
  mime: string
  /** Em KB, como a API devolve (7.31 = 7,31 KB). */
  size: number
  url: string
  created_at: string
}

/** Filtro aplicado na tela de origem, já em linguagem de gente. */
export interface FiltroAplicado {
  campo: string
  operador: 'e' | 'contem' | 'entre' | 'antes' | 'depois' | 'vazio'
  valor: string
}

/** Um pedido de relatório. Espelha um elemento de `/c-report-requests`. */
export interface PedidoDeRelatorio {
  id: number
  /** O pedido inteiro: origem (`unique_key`), categoria (`type`), formulário e filtros. */
  data: {
    unique_key: ChaveDaOrigem
    type?: number
    form?: number
    group: number
    _sort?: string
    [chave: string]: unknown
  }
  extraction_format: Formato
  /** Os filtros como a API guarda (o modal "Filtros" de hoje mostra isto em JSON). */
  filters: Record<string, unknown>
  status: StatusDoPedido
  user: number
  created_at: string
  updated_at: string
  processed_report: ArquivoGerado | null
  /** Modelo do construtor de relatórios da categoria. `null` = Relatório Padrão. */
  report: { id: number, name: string } | null

  /** ACRÉSCIMOS DO PROTÓTIPO. Nada disto vem na resposta de hoje. */
  proto: {
    /** Nome da visualização de onde saiu. Hoje a API não guarda. */
    visualizacao: string
    /** Quantos registros o arquivo tem. A coluna "Registros" de hoje fica "-". */
    registros: number | null
    /** As colunas que foram para o arquivo. */
    colunas: string[]
    /** Os mesmos filtros de `filters`, traduzidos. Hoje a tela mostra o JSON. */
    filtros: FiltroAplicado[]
    /** Ordenação legível, a partir de `_sort`. */
    ordenacao: string
    /** Quando a pessoa baixou. Serve ao filtro "Não baixados". */
    baixadoEm: string[]
    /** Mensagem quando `status` = `error`. */
    erro?: string
    /** Progresso de 0 a 100 enquanto processa. */
    progresso?: number
  }
}

/** As categorias do workspace fictício. Tipadas pelo schema real. */
export const categorias: ItemType[] = [
  { id: 108, name: 'Contratos', slug: 'contratos', icon: 'i-lucide-file-signature', created_at: new Date('2025-03-02'), updated_at: new Date('2026-09-30') },
  { id: 112, name: 'Fornecedores', slug: 'fornecedores', icon: 'i-lucide-truck', created_at: new Date('2025-03-02'), updated_at: new Date('2026-08-11') },
  { id: 117, name: 'Chamados de suporte', slug: 'chamados-de-suporte', icon: 'i-lucide-life-buoy', created_at: new Date('2025-06-18'), updated_at: new Date('2026-10-01') },
  // Caso de canto: nome longo que estoura a coluna.
  { id: 121, name: 'Solicitações de compra de equipamentos de TI acima do limite de aprovação', slug: 'solicitacoes-de-compra-ti', icon: 'i-lucide-shopping-cart', created_at: new Date('2026-01-09'), updated_at: new Date('2026-10-10') },
]

const MIME: Record<Formato, string> = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  dbf: 'application/dbase',
}

/** Monta datas a partir de "dias atrás" e "hh:mm", relativas ao AGORA. */
function quando(diasAtras: number, hora: string, segundos = 0): string {
  const [h, m] = hora.split(':').map(Number)
  const d = new Date(AGORA)
  d.setDate(d.getDate() - diasAtras)
  d.setHours(h!, m!, segundos, 0)
  return d.toISOString()
}

function maisSegundos(iso: string, s: number): string {
  return new Date(new Date(iso).getTime() + s * 1000).toISOString()
}

const COLUNAS = {
  contratos: ['Referência', 'Status', 'Contratante', 'Fornecedor', 'Valor do contrato', 'Início da vigência', 'Fim da vigência', 'Responsável', 'Criado em'],
  fornecedores: ['Referência', 'Razão social', 'Categoria', 'Cidade', 'Avaliação', 'Contato', 'Criado em'],
  chamados: ['Referência', 'Status', 'Assunto', 'Prioridade', 'Cliente', 'Responsável', 'SLA', 'Aberto em', 'Fechado em'],
  compras: ['Referência', 'Status', 'Solicitante', 'Equipamento', 'Quantidade', 'Valor estimado', 'Centro de custo', 'Aprovador'],
  rapidas: ['Título', 'Status', 'Prioridade', 'Responsável', 'Prazo', 'Criada em', 'Concluída em'],
  agendadas: ['Tarefa', 'Item', 'Categoria', 'Status', 'Responsável', 'Prazo', 'SLA', 'Concluída em'],
}

let proximoArquivo = 3200

interface Semente {
  id: number
  chave: ChaveDaOrigem
  categoria?: number
  formato: Formato
  status: StatusDoPedido
  dias: number
  hora: string
  /** Tempo de processamento em segundos. */
  duracao: number
  registros: number | null
  kb: number
  visualizacao: string
  modelo?: string
  filtros: FiltroAplicado[]
  ordenacao?: string
  baixado?: number[]
  erro?: string
  progresso?: number
}

function colunasDa(s: Semente): string[] {
  if (s.chave === 'tasks') return COLUNAS.rapidas
  if (s.chave === 'c_flow_item_tasks') return COLUNAS.agendadas
  if (s.categoria === 108) return COLUNAS.contratos
  if (s.categoria === 112) return COLUNAS.fornecedores
  if (s.categoria === 117) return COLUNAS.chamados
  return COLUNAS.compras
}

/** Nome de arquivo de hoje: `default_` + 10 letras sorteadas. É o que cai na pasta Downloads. */
function nomeDeHoje(): string {
  const letras = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let s = ''
  for (let i = 0; i < 10; i++) s += letras[(i * 7 + proximoArquivo) % letras.length]
  return `default_${s}`
}

function montar(s: Semente): PedidoDeRelatorio {
  const criado = quando(s.dias, s.hora)
  const pronto = s.status === 'complete'
  const atualizado = s.status === 'pending' ? criado : maisSegundos(criado, s.duracao)
  const filters: Record<string, unknown> = { _sort: 'created_at:DESC' }
  if (s.categoria) filters.type = s.categoria
  s.filtros.forEach((f, i) => { filters[`filtro_${i}`] = f.valor })
  return {
    id: s.id,
    data: { unique_key: s.chave, type: s.categoria, form: s.categoria ? s.categoria * 30 : undefined, group: 34, ...filters },
    extraction_format: s.formato,
    filters,
    status: s.status,
    user: 1108,
    created_at: criado,
    updated_at: atualizado,
    processed_report: pronto
      ? {
          id: proximoArquivo++,
          name: `${nomeDeHoje()}.${s.formato}`,
          ext: `.${s.formato}` as ArquivoGerado['ext'],
          mime: MIME[s.formato],
          size: s.kb,
          url: '#',
          created_at: atualizado,
        }
      : null,
    report: s.modelo ? { id: 40 + s.id % 7, name: s.modelo } : null,
    proto: {
      visualizacao: s.visualizacao,
      registros: s.registros,
      colunas: colunasDa(s),
      filtros: s.filtros,
      ordenacao: s.ordenacao ?? 'Criado em, do mais novo para o mais antigo',
      baixadoEm: (s.baixado ?? []).map(min => maisSegundos(atualizado, min * 60)),
      erro: s.erro,
      progresso: s.progresso,
    },
  }
}

const F = (campo: string, operador: FiltroAplicado['operador'], valor: string): FiltroAplicado => ({ campo, operador, valor })

/**
 * Os pedidos, do mais novo para o mais antigo. Cobrem os casos de canto:
 * um gerando agora, um na fila, um que falhou, um com 0 registros, um enorme,
 * um DBF, um com modelo do construtor, um nunca baixado e o nome que estoura.
 */
const sementes: Semente[] = [
  { id: 412, chave: 'c_items', categoria: 117, formato: 'xlsx', status: 'processing', dias: 0, hora: '15:38', duracao: 0, registros: null, kb: 0, visualizacao: 'Abertos esta semana', filtros: [F('Status', 'e', 'Aberto, Em atendimento'), F('Aberto em', 'depois', '07/10/2026')], progresso: 64 },
  { id: 411, chave: 'tasks', formato: 'csv', status: 'pending', dias: 0, hora: '15:38', duracao: 0, registros: null, kb: 0, visualizacao: 'Tarefas Rápidas', filtros: [] },
  { id: 410, chave: 'c_items', categoria: 108, formato: 'xlsx', status: 'complete', dias: 0, hora: '15:20', duracao: 2, registros: 248, kb: 61.4, visualizacao: 'Vencendo em 30 dias', filtros: [F('Fim da vigência', 'entre', '14/10/2026 e 13/11/2026'), F('Status', 'e', 'Vigente')], ordenacao: 'Fim da vigência, do mais próximo para o mais distante', baixado: [1] },
  { id: 409, chave: 'c_items', categoria: 108, formato: 'xlsx', status: 'error', dias: 0, hora: '11:02', duracao: 41, registros: null, kb: 0, visualizacao: 'Todos os contratos', filtros: [], erro: 'O relatório passou de 100.000 registros. Filtre a tabela ou use uma visualização menor e extraia de novo.' },
  { id: 408, chave: 'c_flow_item_tasks', formato: 'xlsx', status: 'complete', dias: 0, hora: '09:47', duracao: 3, registros: 1312, kb: 214.9, visualizacao: 'Atrasadas', filtros: [F('Prazo', 'antes', '14/10/2026'), F('Status', 'e', 'Pendente, Em andamento')] },
  { id: 407, chave: 'c_items', categoria: 112, formato: 'csv', status: 'complete', dias: 1, hora: '17:31', duracao: 1, registros: 0, kb: 0.4, visualizacao: 'Sem avaliação', filtros: [F('Avaliação', 'vazio', '')], baixado: [3] },
  { id: 406, chave: 'c_items', categoria: 121, formato: 'xlsx', status: 'complete', dias: 1, hora: '10:15', duracao: 2, registros: 37, kb: 18.2, visualizacao: 'Aguardando aprovação da diretoria', modelo: 'Compras para o comitê', filtros: [F('Status', 'e', 'Aguardando aprovação'), F('Valor estimado', 'depois', 'R$ 50.000,00')], baixado: [2, 600] },
  { id: 405, chave: 'tasks', formato: 'xlsx', status: 'complete', dias: 2, hora: '16:58', duracao: 1, registros: 86, kb: 12.7, visualizacao: 'Tarefas Rápidas', filtros: [F('Responsável', 'e', 'Ana Ribeiro'), F('Prioridade', 'e', 'Alta, Urgente')], baixado: [0] },
  { id: 404, chave: 'c_items', categoria: 117, formato: 'xlsx', status: 'complete', dias: 3, hora: '08:30', duracao: 58, registros: 118420, kb: 18874.3, visualizacao: 'Todos os chamados', filtros: [F('Aberto em', 'depois', '01/01/2025')], baixado: [4] },
  { id: 403, chave: 'c_items', categoria: 108, formato: 'dbf', status: 'complete', dias: 5, hora: '14:12', duracao: 2, registros: 512, kb: 96.0, visualizacao: 'Para o financeiro', modelo: 'Contratos para auditoria', filtros: [F('Status', 'e', 'Vigente, Renovado')], baixado: [5] },
  { id: 402, chave: 'c_items', categoria: 112, formato: 'xlsx', status: 'complete', dias: 6, hora: '11:40', duracao: 1, registros: 204, kb: 33.1, visualizacao: 'Fornecedores ativos', filtros: [F('Situação', 'e', 'Ativo')] },
  { id: 401, chave: 'c_flow_item_tasks', formato: 'csv', status: 'complete', dias: 8, hora: '09:05', duracao: 2, registros: 940, kb: 88.6, visualizacao: 'Minha fila', filtros: [F('Responsável', 'e', 'Você')], baixado: [1] },
  { id: 400, chave: 'c_items', categoria: 108, formato: 'xlsx', status: 'complete', dias: 9, hora: '15:44', duracao: 2, registros: 251, kb: 62.0, visualizacao: 'Vencendo em 30 dias', filtros: [F('Fim da vigência', 'entre', '05/10/2026 e 04/11/2026'), F('Status', 'e', 'Vigente')], baixado: [2] },
  { id: 399, chave: 'c_items', categoria: 117, formato: 'xlsx', status: 'error', dias: 12, hora: '10:20', duracao: 6, registros: null, kb: 0, visualizacao: 'Por cliente', filtros: [F('Cliente', 'contem', 'Atlântida')], erro: 'A geração parou por uma falha no servidor. Tente de novo; se repetir, fale com o suporte.' },
  { id: 398, chave: 'tasks', formato: 'csv', status: 'complete', dias: 14, hora: '18:02', duracao: 1, registros: 61, kb: 6.9, visualizacao: 'Tarefas Rápidas', filtros: [F('Status', 'e', 'Concluída')], baixado: [0] },
  { id: 397, chave: 'c_items', categoria: 121, formato: 'xlsx', status: 'complete', dias: 16, hora: '13:27', duracao: 2, registros: 44, kb: 20.4, visualizacao: 'Aguardando aprovação da diretoria', modelo: 'Compras para o comitê', filtros: [F('Status', 'e', 'Aguardando aprovação')], baixado: [8] },
  { id: 396, chave: 'c_items', categoria: 108, formato: 'xlsx', status: 'complete', dias: 21, hora: '09:58', duracao: 3, registros: 1874, kb: 402.5, visualizacao: 'Todos os contratos', filtros: [], baixado: [1, 1440] },
  { id: 395, chave: 'c_items', categoria: 112, formato: 'csv', status: 'complete', dias: 23, hora: '16:16', duracao: 1, registros: 199, kb: 21.8, visualizacao: 'Fornecedores ativos', filtros: [F('Situação', 'e', 'Ativo')] },
  { id: 394, chave: 'c_flow_item_tasks', formato: 'xlsx', status: 'complete', dias: 28, hora: '08:44', duracao: 4, registros: 2210, kb: 361.0, visualizacao: 'Concluídas no mês', filtros: [F('Concluída em', 'entre', '01/09/2026 e 30/09/2026')], baixado: [3] },
  { id: 393, chave: 'c_items', categoria: 117, formato: 'xlsx', status: 'complete', dias: 35, hora: '11:11', duracao: 2, registros: 302, kb: 74.3, visualizacao: 'Fechados com SLA estourado', filtros: [F('SLA', 'e', 'Estourado'), F('Status', 'e', 'Fechado')], baixado: [6] },
  { id: 392, chave: 'c_items', categoria: 108, formato: 'csv', status: 'complete', dias: 41, hora: '17:50', duracao: 2, registros: 233, kb: 27.5, visualizacao: 'Vencendo em 30 dias', filtros: [F('Status', 'e', 'Vigente')], baixado: [0] },
  { id: 391, chave: 'tasks', formato: 'xlsx', status: 'complete', dias: 47, hora: '10:03', duracao: 1, registros: 52, kb: 9.8, visualizacao: 'Tarefas Rápidas', filtros: [], baixado: [12] },
  { id: 390, chave: 'c_items', categoria: 112, formato: 'dbf', status: 'complete', dias: 55, hora: '15:31', duracao: 2, registros: 187, kb: 41.2, visualizacao: 'Para o financeiro', filtros: [F('Situação', 'e', 'Ativo')], baixado: [2] },
  { id: 389, chave: 'c_items', categoria: 108, formato: 'xlsx', status: 'complete', dias: 62, hora: '09:20', duracao: 2, registros: 240, kb: 58.9, visualizacao: 'Vencendo em 30 dias', filtros: [F('Status', 'e', 'Vigente')], baixado: [1] },
]

export function pedidosIniciais(): PedidoDeRelatorio[] {
  proximoArquivo = 3200
  return sementes.map(montar)
}

/**
 * Os itens da tela de Contratos, a origem que o protótipo usa para a jornada
 * de extrair. Estrutura da tabela nova de itens; valores fictícios.
 */
export interface ContratoDaTabela {
  id: number
  referencia: string
  status: 'Vigente' | 'Em negociação' | 'Encerrado' | 'Renovado'
  contratante: string
  fornecedor: string
  valor: string
  fim: string
  [chave: string]: unknown
}

export const contratos: ContratoDaTabela[] = [
  { id: 1, referencia: 'CTR-2026-0412', status: 'Vigente', contratante: 'Unidade Campinas', fornecedor: 'Limpeza Horizonte Ltda.', valor: 'R$ 184.000,00', fim: '28/10/2026' },
  { id: 2, referencia: 'CTR-2026-0398', status: 'Vigente', contratante: 'Unidade Recife', fornecedor: 'Vigilância Ponto Forte', valor: 'R$ 96.500,00', fim: '02/11/2026' },
  { id: 3, referencia: 'CTR-2026-0377', status: 'Em negociação', contratante: 'Matriz', fornecedor: 'Nuvem Sul Tecnologia', valor: 'US$ 42.300,00', fim: '15/11/2026' },
  { id: 4, referencia: 'CTR-2025-1190', status: 'Renovado', contratante: 'Unidade Curitiba', fornecedor: 'Café da Serra Distribuidora', valor: 'R$ 18.900,00', fim: '31/12/2026' },
  { id: 5, referencia: 'CTR-2025-1102', status: 'Vigente', contratante: 'Matriz', fornecedor: 'Gráfica Ipê Amarelo', valor: 'R$ 7.250,00', fim: '09/01/2027' },
  { id: 6, referencia: 'CTR-2025-0988', status: 'Encerrado', contratante: 'Unidade Recife', fornecedor: 'Transportes Rota 101', valor: 'R$ 230.000,00', fim: '30/09/2026' },
  { id: 7, referencia: 'CTR-2025-0951', status: 'Vigente', contratante: 'Unidade Campinas', fornecedor: 'Manutenção Predial Alicerce', valor: 'R$ 64.800,00', fim: '18/02/2027' },
  { id: 8, referencia: 'CTR-2025-0870', status: 'Vigente', contratante: 'Matriz', fornecedor: 'Consultoria Trilha Fiscal', valor: 'R$ 120.000,00', fim: '01/03/2027' },
]
