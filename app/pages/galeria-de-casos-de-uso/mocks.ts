/**
 * O dado do protótipo: fictício, sem API.
 *
 * O caso de uso NÃO está no `@be-enlighten/enspace-sdk-schemas` (procurado em
 * 2026-10-20: nenhum tipo `UseCase`). O que a tela do develop mostra de cada
 * caso hoje (visitada em 2026-10-20):
 *
 *   nome          "QA Comercial - Brasil (pt-br)"
 *   descrição     "Caso de uso de QA"
 *   imagem        uma por caso, na janela do "Saiba Mais"
 *   grupo         "General" ("Casos de uso disponíveis nesta categoria")
 *   localidade    Brasil (pt-br), Estados Unidos (en-us), Global, no texto do
 *                 bundle da tela (`brazil`, `usa`, `global`)
 *
 * A rota que a tela lê é `use-cases` (endpoint visto no bundle da tela de
 * criar workspace). O resto da forma (complexidade, destaque, o que vem
 * junto, data e usos) é invenção do protótipo, a mesma dos protótipos
 * `menu-lateral` e `tela-de-workspaces`, copiada para cá porque protótipo não
 * importa de outro. Os casos, os números e as datas são inventados.
 */

export const workspaceAtual = { nome: 'Grupo Aurora', slug: 'grupo-aurora' }

export interface Localidade { id: 'pt-br' | 'en-us' | 'global' }
export const localidades: Localidade['id'][] = ['pt-br', 'en-us', 'global']

export type Complexidade = 'iniciante' | 'intermediario' | 'avancado'

export interface TelaDoCaso { rotulo: string, icone: string, tipoDeTela: string }
export interface MenuDoCaso { rotulo: string, icone: string, telas: TelaDoCaso[] }
export interface CategoriaDoCaso { nome: string, icone: string, campos: string[] }

export interface CasoDeUso {
  id: string
  nome: string
  icone: string
  /** Hoje o produto chama o grupo de "categoria" ("General"). O protótipo propõe "área". */
  area: string
  descricao: string
  /** Inventado pelo protótipo. */
  complexidade: Complexidade
  /** Inventado pelo protótipo: curadoria do ENSPACE. */
  destaque?: boolean
  localidades: Localidade['id'][]
  /** Inventado pelo protótipo. */
  criadoEm: string
  /** Inventado pelo protótipo. */
  usos: number
  menus: MenuDoCaso[]
  categorias: CategoriaDoCaso[]
  status: string[]
  /** Do ENSPACE ou criado neste workspace (rodada 3). */
  origem: 'enspace' | 'workspace'
  /** Criado no workspace e publicado na galeria do ENSPACE (rodada 3). */
  publicado?: boolean
  /** Workspace que criou, quando `origem` é 'workspace'. */
  autor?: string
  /** Imagens enviadas ao criar (rodada 3); sem elas, a prévia é desenhada. */
  imagens?: { nome: string, url: string }[]
}

export const AREAS = ['Jurídico', 'Comercial', 'Financeiro', 'Pessoas', 'Compras', 'Atendimento', 'TI', 'Operações'] as const

const tl = (rotulo: string, icone: string, tipoDeTela = 'consultas'): TelaDoCaso => ({ rotulo, icone, tipoDeTela })

type CasoSemOrigem = Omit<CasoDeUso, 'origem'>

const doEnspace: CasoSemOrigem[] = [
  {
    id: 'cu-chamados', nome: 'Central de chamados', icone: 'i-lucide-life-buoy', area: 'Atendimento',
    complexidade: 'intermediario', destaque: true, localidades: ['pt-br', 'global'], criadoEm: '2025-03-28', usos: 7220,
    descricao: 'Chamados com prazo de atendimento, fila por equipe e o painel do que está estourando.',
    menus: [{ rotulo: 'Atendimento', icone: 'i-lucide-life-buoy', telas: [tl('Fila da equipe', 'i-lucide-inbox', 'triagem'), tl('Meus chamados', 'i-lucide-user', 'meus-itens'), tl('Prazos', 'i-lucide-chart-column', 'paineis')] }],
    categorias: [{ nome: 'Chamados', icone: 'i-lucide-life-buoy', campos: ['Solicitante', 'Assunto', 'Prioridade', 'Prazo', 'Equipe'] }],
    status: ['Aberto', 'Em atendimento', 'Aguardando', 'Resolvido'],
  },
  {
    id: 'cu-onboarding', nome: 'Implantação de clientes', icone: 'i-lucide-rocket', area: 'Atendimento',
    complexidade: 'avancado', localidades: ['pt-br'], criadoEm: '2025-10-06', usos: 412,
    descricao: 'Cada cliente novo vira um projeto com marcos, responsável e a data prometida de entrada em produção.',
    menus: [{ rotulo: 'Implantação', icone: 'i-lucide-rocket', telas: [tl('Clientes em implantação', 'i-lucide-list'), tl('Marcos da semana', 'i-lucide-flag', 'tarefas'), tl('Saúde da carteira', 'i-lucide-chart-column', 'paineis')] }],
    categorias: [
      { nome: 'Implantações', icone: 'i-lucide-rocket', campos: ['Cliente', 'Plano', 'Responsável', 'Início', 'Entrada prevista'] },
      { nome: 'Marcos', icone: 'i-lucide-flag', campos: ['Implantação', 'Marco', 'Prazo', 'Concluído em'] },
    ],
    status: ['Kickoff', 'Configuração', 'Treinamento', 'Em produção'],
  },
  {
    id: 'cu-contratos', nome: 'Gestão de contratos', icone: 'i-lucide-file-signature', area: 'Jurídico',
    complexidade: 'intermediario', destaque: true, localidades: ['pt-br', 'global'], criadoEm: '2025-03-12', usos: 4120,
    descricao: 'Do pedido à assinatura e ao vencimento. Traz a fila de aprovação, o painel do que vence em 30 dias e os aditivos ligados ao contrato.',
    menus: [
      { rotulo: 'Contratos', icone: 'i-lucide-file-signature', telas: [tl('Contratos ativos', 'i-lucide-list'), tl('Vencendo em 30 dias', 'i-lucide-calendar-clock'), tl('Para aprovar', 'i-lucide-circle-check-big', 'triagem')] },
      { rotulo: 'Painel jurídico', icone: 'i-lucide-chart-column', telas: [tl('Visão geral', 'i-lucide-chart-pie', 'paineis')] },
    ],
    categorias: [
      { nome: 'Contratos', icone: 'i-lucide-file-signature', campos: ['Contraparte', 'Valor', 'Início', 'Vencimento', 'Responsável', 'Renovação automática'] },
      { nome: 'Aditivos', icone: 'i-lucide-file-plus', campos: ['Contrato de origem', 'Motivo', 'Novo valor'] },
    ],
    status: ['Rascunho', 'Em aprovação', 'Assinado', 'Vencido'],
  },
  {
    id: 'cu-contencioso', nome: 'Contencioso', icone: 'i-lucide-scale', area: 'Jurídico',
    complexidade: 'avancado', localidades: ['pt-br'], criadoEm: '2025-06-02', usos: 870,
    descricao: 'Processos, prazos e audiências, com a pauta da semana e os prazos que vencem.',
    menus: [{ rotulo: 'Contencioso', icone: 'i-lucide-scale', telas: [tl('Processos', 'i-lucide-folder-open'), tl('Prazos da semana', 'i-lucide-alarm-clock', 'tarefas'), tl('Audiências', 'i-lucide-calendar-days')] }],
    categorias: [{ nome: 'Processos', icone: 'i-lucide-gavel', campos: ['Número', 'Vara', 'Parte contrária', 'Valor da causa', 'Fase'] }],
    status: ['Inicial', 'Instrução', 'Sentença', 'Recurso', 'Encerrado'],
  },
  {
    id: 'cu-procuracoes', nome: 'Procurações, poderes e representação societária', icone: 'i-lucide-stamp', area: 'Jurídico',
    complexidade: 'intermediario', localidades: ['pt-br'], criadoEm: '2026-01-19', usos: 96,
    descricao: 'Quem pode assinar pelo quê, até quando, e o aviso antes de a procuração vencer.',
    menus: [{ rotulo: 'Procurações', icone: 'i-lucide-stamp', telas: [tl('Procurações vigentes', 'i-lucide-list'), tl('Vencendo em 60 dias', 'i-lucide-calendar-clock')] }],
    categorias: [{ nome: 'Procurações', icone: 'i-lucide-stamp', campos: ['Outorgado', 'Poderes', 'Validade', 'Cartório'] }],
    status: ['Vigente', 'A renovar', 'Revogada'],
  },
  {
    id: 'cu-funil', nome: 'Funil de vendas', icone: 'i-lucide-filter', area: 'Comercial',
    complexidade: 'iniciante', destaque: true, localidades: ['pt-br', 'en-us', 'global'], criadoEm: '2024-11-20', usos: 9850,
    descricao: 'Oportunidades em etapas, do primeiro contato ao fechamento, com metas do mês e o painel de conversão.',
    menus: [{ rotulo: 'Vendas', icone: 'i-lucide-trending-up', telas: [tl('Funil', 'i-lucide-kanban'), tl('Minhas oportunidades', 'i-lucide-user', 'meus-itens'), tl('Conversão', 'i-lucide-chart-column', 'paineis')] }],
    categorias: [{ nome: 'Oportunidades', icone: 'i-lucide-target', campos: ['Cliente', 'Valor', 'Etapa', 'Previsão de fechamento', 'Origem'] }],
    status: ['Prospecção', 'Proposta', 'Negociação', 'Ganho', 'Perdido'],
  },
  {
    id: 'cu-propostas', nome: 'Propostas comerciais', icone: 'i-lucide-file-text', area: 'Comercial',
    complexidade: 'iniciante', localidades: ['pt-br', 'en-us'], criadoEm: '2025-01-08', usos: 2310,
    descricao: 'Uma categoria pronta para propostas, com versão, desconto e aprovação de margem.',
    menus: [{ rotulo: 'Propostas', icone: 'i-lucide-file-text', telas: [tl('Propostas abertas', 'i-lucide-list')] }],
    categorias: [{ nome: 'Propostas', icone: 'i-lucide-file-text', campos: ['Oportunidade', 'Versão', 'Desconto', 'Margem', 'Validade'] }],
    status: ['Em elaboração', 'Enviada', 'Aceita', 'Recusada'],
  },
  {
    id: 'cu-pos-venda', nome: 'Pós-venda e renovação', icone: 'i-lucide-repeat', area: 'Comercial',
    complexidade: 'intermediario', localidades: ['global'], criadoEm: '2025-08-27', usos: 1045,
    descricao: 'Carteira de clientes com data de renovação, risco de saída e a próxima conversa marcada.',
    menus: [{ rotulo: 'Carteira', icone: 'i-lucide-repeat', telas: [tl('Renovações do trimestre', 'i-lucide-calendar-days'), tl('Clientes em risco', 'i-lucide-triangle-alert')] }],
    categorias: [{ nome: 'Contas', icone: 'i-lucide-building', campos: ['Cliente', 'Receita anual', 'Renovação', 'Risco'] }],
    status: ['Saudável', 'Atenção', 'Em risco', 'Renovado'],
  },
  {
    id: 'cu-pagar', nome: 'Contas a pagar', icone: 'i-lucide-wallet', area: 'Financeiro',
    complexidade: 'intermediario', destaque: true, localidades: ['pt-br'], criadoEm: '2025-02-17', usos: 5630,
    descricao: 'Lançamento, aprovação e pagamento, com a agenda da semana e o que está atrasado.',
    menus: [{ rotulo: 'Financeiro', icone: 'i-lucide-wallet', telas: [tl('Lançamentos', 'i-lucide-list'), tl('Aprovar pagamento', 'i-lucide-circle-check-big', 'triagem'), tl('Agenda de pagamentos', 'i-lucide-calendar-days')] }],
    categorias: [
      { nome: 'Contas a pagar', icone: 'i-lucide-receipt', campos: ['Fornecedor', 'Valor', 'Vencimento', 'Centro de custo', 'Nota fiscal'] },
      { nome: 'Fornecedores', icone: 'i-lucide-truck', campos: ['CNPJ', 'Contato', 'Banco'] },
    ],
    status: ['Lançada', 'Aprovada', 'Paga', 'Atrasada'],
  },
  {
    id: 'cu-reembolso', nome: 'Reembolsos', icone: 'i-lucide-hand-coins', area: 'Financeiro',
    complexidade: 'iniciante', localidades: ['pt-br', 'global'], criadoEm: '2025-04-30', usos: 3140,
    descricao: 'Quem pede anexa o comprovante. Quem aprova vê a fila. O financeiro paga.',
    menus: [{ rotulo: 'Reembolsos', icone: 'i-lucide-hand-coins', telas: [tl('Minhas solicitações', 'i-lucide-user', 'minhas-requisicoes'), tl('Fila de aprovação', 'i-lucide-inbox', 'triagem')] }],
    categorias: [{ nome: 'Reembolsos', icone: 'i-lucide-hand-coins', campos: ['Valor', 'Data da despesa', 'Comprovante', 'Projeto'] }],
    status: ['Enviado', 'Aprovado', 'Pago', 'Recusado'],
  },
  {
    id: 'cu-admissao', nome: 'Admissão de colaboradores', icone: 'i-lucide-user-plus', area: 'Pessoas',
    complexidade: 'intermediario', destaque: true, localidades: ['pt-br'], criadoEm: '2025-05-14', usos: 2780,
    descricao: 'Da vaga aprovada ao primeiro dia: documentos, equipamentos e acessos, cada um com responsável.',
    menus: [{ rotulo: 'Admissões', icone: 'i-lucide-user-plus', telas: [tl('Em andamento', 'i-lucide-list'), tl('Checklist do primeiro dia', 'i-lucide-list-checks', 'tarefas')] }],
    categorias: [{ nome: 'Admissões', icone: 'i-lucide-user-plus', campos: ['Nome', 'Cargo', 'Data de início', 'Gestor', 'Documentos'] }],
    status: ['Documentos', 'Equipamento', 'Acessos', 'Concluída'],
  },
  {
    id: 'cu-ferias', nome: 'Férias e ausências', icone: 'i-lucide-palmtree', area: 'Pessoas',
    complexidade: 'iniciante', localidades: ['pt-br', 'en-us', 'global'], criadoEm: '2025-07-21', usos: 1960,
    descricao: 'Uma tela de calendário da equipe com quem está fora e quando volta.',
    menus: [{ rotulo: 'Pessoas', icone: 'i-lucide-users-round', telas: [tl('Calendário da equipe', 'i-lucide-calendar-days', 'personalizada')] }],
    categorias: [{ nome: 'Ausências', icone: 'i-lucide-palmtree', campos: ['Pessoa', 'Tipo', 'Início', 'Volta'] }],
    status: [],
  },
  {
    id: 'cu-desempenho', nome: 'Avaliação de desempenho', icone: 'i-lucide-chart-no-axes-combined', area: 'Pessoas',
    complexidade: 'avancado', localidades: ['pt-br'], criadoEm: '2026-02-11', usos: 238,
    descricao: 'Ciclo semestral com autoavaliação, avaliação do gestor e a reunião de calibração.',
    menus: [{ rotulo: 'Desempenho', icone: 'i-lucide-chart-no-axes-combined', telas: [tl('Ciclo atual', 'i-lucide-list'), tl('Minhas avaliações', 'i-lucide-user', 'meus-itens'), tl('Calibração', 'i-lucide-chart-column', 'paineis')] }],
    categorias: [{ nome: 'Avaliações', icone: 'i-lucide-clipboard-check', campos: ['Avaliado', 'Gestor', 'Ciclo', 'Nota', 'Comentários'] }],
    status: ['Autoavaliação', 'Gestor', 'Calibração', 'Concluída'],
  },
  {
    id: 'cu-compras', nome: 'Solicitações de compra', icone: 'i-lucide-shopping-cart', area: 'Compras',
    complexidade: 'iniciante', destaque: true, localidades: ['pt-br', 'en-us'], criadoEm: '2024-12-03', usos: 6410,
    descricao: 'Pedido, cotação e aprovação por alçada. Quem pede acompanha sem precisar perguntar.',
    menus: [{ rotulo: 'Compras', icone: 'i-lucide-shopping-cart', telas: [tl('Minhas solicitações', 'i-lucide-user', 'minhas-requisicoes'), tl('Cotações', 'i-lucide-list'), tl('Aprovar por alçada', 'i-lucide-circle-check-big', 'triagem')] }],
    categorias: [{ nome: 'Solicitações de compra', icone: 'i-lucide-shopping-cart', campos: ['Item', 'Quantidade', 'Valor estimado', 'Centro de custo', 'Urgência'] }],
    status: ['Solicitada', 'Em cotação', 'Aprovada', 'Comprada'],
  },
  {
    id: 'cu-fornecedores', nome: 'Homologação de fornecedores', icone: 'i-lucide-truck', area: 'Compras',
    complexidade: 'intermediario', localidades: ['pt-br'], criadoEm: '2025-09-15', usos: 690,
    descricao: 'Documentos, certidões e a avaliação de risco antes de o fornecedor poder receber pedido.',
    menus: [{ rotulo: 'Fornecedores', icone: 'i-lucide-truck', telas: [tl('Em homologação', 'i-lucide-list'), tl('Certidões vencendo', 'i-lucide-calendar-clock')] }],
    categorias: [{ nome: 'Fornecedores', icone: 'i-lucide-truck', campos: ['Razão social', 'CNPJ', 'Certidões', 'Risco', 'Validade'] }],
    status: ['Documentos', 'Análise', 'Homologado', 'Bloqueado'],
  },
  {
    id: 'cu-acessos', nome: 'Gestão de acessos', icone: 'i-lucide-key-round', area: 'TI',
    complexidade: 'avancado', localidades: ['pt-br', 'global'], criadoEm: '2025-08-09', usos: 640,
    descricao: 'Pedidos de acesso a sistemas, com o dono do sistema aprovando e revisão a cada trimestre.',
    menus: [{ rotulo: 'Acessos', icone: 'i-lucide-key-round', telas: [tl('Pedidos', 'i-lucide-list'), tl('Revisão trimestral', 'i-lucide-refresh-cw', 'tarefas')] }],
    categorias: [{ nome: 'Pedidos de acesso', icone: 'i-lucide-key-round', campos: ['Sistema', 'Perfil', 'Justificativa', 'Validade'] }],
    status: ['Pedido', 'Aprovado', 'Concedido', 'Revogado'],
  },
  {
    id: 'cu-ativos', nome: 'Inventário de equipamentos', icone: 'i-lucide-laptop', area: 'TI',
    complexidade: 'iniciante', localidades: ['pt-br', 'en-us', 'global'], criadoEm: '2025-11-03', usos: 1320,
    descricao: 'Notebooks, celulares e licenças, com quem está usando e quando vence a garantia.',
    menus: [{ rotulo: 'Equipamentos', icone: 'i-lucide-laptop', telas: [tl('Inventário', 'i-lucide-list'), tl('Garantias vencendo', 'i-lucide-calendar-clock')] }],
    categorias: [{ nome: 'Equipamentos', icone: 'i-lucide-laptop', campos: ['Patrimônio', 'Modelo', 'Usuário', 'Garantia'] }],
    status: ['Em estoque', 'Em uso', 'Manutenção', 'Baixado'],
  },
  {
    id: 'cu-ocorrencias', nome: 'Ocorrências de operação', icone: 'i-lucide-siren', area: 'Operações',
    complexidade: 'intermediario', localidades: ['pt-br'], criadoEm: '2025-09-02', usos: 1180,
    descricao: 'Registro de ocorrência com causa, ação tomada e prazo da ação corretiva.',
    menus: [{ rotulo: 'Ocorrências', icone: 'i-lucide-siren', telas: [tl('Abertas', 'i-lucide-list'), tl('Ações corretivas', 'i-lucide-list-checks', 'tarefas')] }],
    categorias: [{ nome: 'Ocorrências', icone: 'i-lucide-siren', campos: ['Local', 'Gravidade', 'Causa', 'Ação corretiva', 'Prazo'] }],
    status: ['Registrada', 'Em análise', 'Corrigida'],
  },
]

export const casosDeUso: CasoDeUso[] = doEnspace.map(c => ({ ...c, origem: 'enspace' as const }))

/** O develop hoje tem 1 caso só no workspace de exploração: o cenário "Como hoje" mostra 1. */
export const umCaso: CasoDeUso[] = [casosDeUso.find(c => c.id === 'cu-funil')!]

/* ------------------------------------------------------------------
   Rodada 3: a estrutura que o workspace tem agora, de onde sai o
   "Criar caso de uso". Nomes inventados, de uma empresa fictícia.
------------------------------------------------------------------ */

export interface CategoriaDoWorkspace extends CategoriaDoCaso { id: string, status: string[] }
export interface MenuDoWorkspace extends MenuDoCaso { id: string }

export const estruturaDoWorkspace: { categorias: CategoriaDoWorkspace[], menus: MenuDoWorkspace[] } = {
  categorias: [
    { id: 'c1', nome: 'Pedidos de compra', icone: 'i-lucide-shopping-cart', campos: ['Item', 'Quantidade', 'Centro de custo', 'Aprovador', 'Entrega prevista'], status: ['Rascunho', 'Em aprovação', 'Aprovado', 'Entregue'] },
    { id: 'c2', nome: 'Fornecedores', icone: 'i-lucide-truck', campos: ['Razão social', 'CNPJ', 'Contato', 'Avaliação'], status: ['Ativo', 'Bloqueado'] },
    { id: 'c3', nome: 'Contratos de locação', icone: 'i-lucide-building', campos: ['Imóvel', 'Locador', 'Valor mensal', 'Reajuste', 'Fim da vigência'], status: ['Vigente', 'A renovar', 'Encerrado'] },
    { id: 'c4', nome: 'Chamados internos', icone: 'i-lucide-life-buoy', campos: ['Solicitante', 'Assunto', 'Prioridade'], status: ['Aberto', 'Em atendimento', 'Resolvido'] },
  ],
  menus: [
    { id: 'm1', rotulo: 'Compras', icone: 'i-lucide-shopping-cart', telas: [tl('Pedidos abertos', 'i-lucide-list'), tl('Aprovar pedido', 'i-lucide-circle-check-big', 'triagem'), tl('Fornecedores', 'i-lucide-truck')] },
    { id: 'm2', rotulo: 'Imóveis', icone: 'i-lucide-building', telas: [tl('Contratos vigentes', 'i-lucide-list'), tl('Reajustes do mês', 'i-lucide-calendar-clock')] },
    { id: 'm3', rotulo: 'Atendimento interno', icone: 'i-lucide-life-buoy', telas: [tl('Fila', 'i-lucide-inbox', 'triagem')] },
  ],
}
