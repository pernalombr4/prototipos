// Dado do protótipo — 100% fictício, mas com a ESTRUTURA do produto.
//
// O tipo `Workspace` abaixo é ancorado no schema real da API, vindo do
// `@be-enlighten/enspace-sdk-schemas`: `id`, `name`, `reference`, `status`,
// `description`, `icon` e `members_count` são os campos que existem de verdade,
// com os tipos de verdade. O que o protótipo acrescenta está marcado como tal —
// e campo acrescentado é sinal de que ou vem de outra rota, ou é invenção.
//
// Os VALORES continuam inventados: nenhuma empresa ou pessoa aqui é real.

import type { Workspace as WorkspaceApi } from '@be-enlighten/enspace-sdk-schemas'

export type Papel = 'Proprietário' | 'Full' | 'Membro' | 'Leitor'

/** O que a API entrega de verdade sobre um workspace. */
type CamposDaApi = Pick<
  WorkspaceApi,
  'id' | 'created_at' | 'name' | 'reference' | 'status' | 'description' | 'icon' | 'members_count'
>

export interface Workspace extends CamposDaApi {
  /**
   * Licença do usuário neste workspace: o `type` do membro (owner, full, standard, viewer),
   * que vem da listagem por membro, não do modelo Workspace. O nome `papel` ficou das
   * primeiras rodadas; papel no produto é outro campo (`role`).
   */
  papel: Papel
  /** Acrescentado pelo protótipo: hoje a tela não tem favorito por usuário. */
  favorito: boolean
  /** Acrescentado pelo protótipo: minutos desde o último acesso. null = nunca entrou. */
  ultimoAcessoMin: number | null
  /** Estado de convite — na tela de hoje é um estado do próprio card. */
  convitePendente?: boolean
  convidadoPor?: string
  /** Acrescentado pelo protótipo: etiquetas pessoais (ids de `etiquetasIniciais`). Não existe no produto. */
  etiquetas: string[]
  /** Acrescentado pelo protótipo: a pessoa tirou este workspace da lista dela. Não existe no produto. */
  oculto?: boolean
}

/**
 * Acrescentado pelo protótipo (rodada 17): etiquetas pessoais. Cada pessoa cria as
 * dela para agrupar a própria lista; ninguém mais vê. O produto não tem o conceito.
 */
export interface Etiqueta { id: string, nome: string }

export const etiquetasIniciais: Etiqueta[] = [
  { id: 'clientes', nome: 'Clientes' },
  { id: 'internos', nome: 'Internos' },
  { id: 'testes', nome: 'Testes' },
]

export const usuario = {
  nome: 'Mariana Duarte',
  iniciais: 'MD',
  email: 'mariana.duarte@grupoaurora.com.br',
}

export const workspaces: Workspace[] = [
  {
    id: 1,
    created_at: new Date('2022-03-14T12:00:00Z'),
    status: 'active',
    name: 'Grupo Aurora',
    reference: 'grupo-aurora',
    description: 'Chamados, RH e jurídico do Grupo Aurora',
    icon: 'i-lucide-building-2',
    papel: 'Membro',
    favorito: true,
    ultimoAcessoMin: 95,
    members_count: 340,
    etiquetas: ['internos'],
  },
  {
    id: 2,
    created_at: new Date('2023-08-02T12:00:00Z'),
    status: 'active',
    name: 'Vértice Log',
    reference: 'vertice-log',
    description: 'Processos de logística, frota e expedição',
    icon: 'i-lucide-truck',
    papel: 'Full',
    favorito: true,
    ultimoAcessoMin: 2 * 24 * 60,
    members_count: 62,
    etiquetas: ['clientes'],
  },
  {
    id: 3,
    created_at: new Date('2022-06-20T12:00:00Z'),
    status: 'active',
    name: 'RH Aurora',
    reference: 'rh-aurora',
    description: '',
    icon: 'i-lucide-users',
    papel: 'Membro',
    favorito: false,
    ultimoAcessoMin: 9 * 24 * 60,
    members_count: 28,
    etiquetas: ['internos'],
  },
  {
    // caso de canto de propósito: nome longo que estoura a linha
    id: 4,
    created_at: new Date('2024-02-11T12:00:00Z'),
    status: 'active',
    name: 'Jurídico Correções Monetárias e Acordos Trabalhistas',
    reference: 'juridico-correcoes-monetarias',
    description: 'Cálculo de correção e acompanhamento de acordos',
    icon: 'i-lucide-scale',
    papel: 'Leitor',
    favorito: false,
    ultimoAcessoMin: 41 * 24 * 60,
    members_count: 11,
    etiquetas: [],
  },
  {
    id: 5,
    created_at: new Date('2025-07-30T12:00:00Z'),
    status: 'active',
    name: 'Aurora Saúde Homologação',
    reference: 'aurora-saude-homologacao',
    description: '',
    icon: 'i-lucide-cross',
    papel: 'Proprietário',
    favorito: false,
    ultimoAcessoMin: null,
    members_count: 4,
    etiquetas: ['testes'],
  },
  {
    id: 6,
    created_at: new Date('2024-11-05T12:00:00Z'),
    status: 'active',
    name: 'Lumen Contábil',
    reference: 'lumen-contabil',
    description: 'Fechamento contábil e obrigações acessórias',
    icon: 'i-lucide-calculator',
    papel: 'Membro',
    favorito: false,
    ultimoAcessoMin: null,
    members_count: 19,
    etiquetas: [],
    convitePendente: true,
    convidadoPor: 'Rodrigo Petrone',
  },
  {
    id: 7,
    created_at: new Date('2025-09-01T12:00:00Z'),
    status: 'active',
    name: 'Base de teste de migração',
    reference: 'base-de-teste-migracao',
    description: '',
    icon: 'i-lucide-database',
    papel: 'Proprietário',
    favorito: false,
    ultimoAcessoMin: 6 * 24 * 60,
    members_count: 2,
    etiquetas: ['testes'],
  },
  {
    id: 8,
    created_at: new Date('2023-01-17T12:00:00Z'),
    status: 'active',
    name: 'Aurora Facilities',
    reference: 'aurora-facilities',
    description: 'Manutenção predial e reserva de salas',
    icon: 'i-lucide-building',
    papel: 'Membro',
    favorito: false,
    ultimoAcessoMin: 14 * 24 * 60,
    members_count: 45,
    etiquetas: ['internos'],
  },
  {
    id: 9,
    created_at: new Date('2023-04-25T12:00:00Z'),
    status: 'active',
    name: 'Aurora Compras',
    reference: 'aurora-compras',
    description: 'Requisições e cotações de compra',
    icon: 'i-lucide-shopping-cart',
    papel: 'Full',
    favorito: false,
    ultimoAcessoMin: 3 * 24 * 60,
    members_count: 37,
    etiquetas: ['internos'],
  },
  {
    id: 10,
    created_at: new Date('2025-05-12T12:00:00Z'),
    status: 'active',
    name: 'Vértice Log Homologação',
    reference: 'vertice-log-homologacao',
    description: '',
    icon: 'i-lucide-flask-conical',
    papel: 'Proprietário',
    favorito: false,
    ultimoAcessoMin: 20 * 24 * 60,
    members_count: 5,
    etiquetas: ['testes'],
  },
  {
    id: 11,
    created_at: new Date('2024-06-03T12:00:00Z'),
    status: 'active',
    name: 'Nimbus Seguros',
    reference: 'nimbus-seguros',
    description: 'Sinistros, apólices e renovações',
    icon: 'i-lucide-shield-check',
    papel: 'Full',
    favorito: false,
    ultimoAcessoMin: 5 * 24 * 60,
    members_count: 88,
    etiquetas: ['clientes'],
  },
  {
    id: 12,
    created_at: new Date('2024-09-19T12:00:00Z'),
    status: 'active',
    name: 'Casa Ipê Imóveis',
    reference: 'casa-ipe-imoveis',
    description: 'Contratos de locação e vistorias',
    icon: 'i-lucide-house',
    papel: 'Membro',
    favorito: false,
    ultimoAcessoMin: 70 * 24 * 60,
    members_count: 23,
    etiquetas: ['clientes'],
  },
  {
    id: 13,
    created_at: new Date('2025-01-08T12:00:00Z'),
    status: 'active',
    name: 'Clínica Serra Azul',
    reference: 'clinica-serra-azul',
    description: 'Agenda de exames e prontuário administrativo',
    icon: 'i-lucide-stethoscope',
    papel: 'Leitor',
    favorito: false,
    ultimoAcessoMin: 26 * 24 * 60,
    members_count: 14,
    etiquetas: ['clientes'],
  },
  {
    id: 14,
    created_at: new Date('2024-03-27T12:00:00Z'),
    status: 'active',
    name: 'Orla Energia',
    reference: 'orla-energia',
    description: 'Ordens de serviço de campo',
    icon: 'i-lucide-zap',
    papel: 'Full',
    favorito: false,
    ultimoAcessoMin: 12 * 24 * 60,
    members_count: 51,
    etiquetas: ['clientes'],
  },
  {
    // caso de canto de propósito: workspace que a pessoa já tirou da lista
    id: 15,
    created_at: new Date('2025-02-10T12:00:00Z'),
    status: 'active',
    name: 'Treinamento interno 2025',
    reference: 'treinamento-interno-2025',
    description: '',
    icon: 'i-lucide-graduation-cap',
    papel: 'Proprietário',
    favorito: false,
    ultimoAcessoMin: 300 * 24 * 60,
    members_count: 9,
    etiquetas: ['internos'],
    oculto: true,
  },
  {
    id: 16,
    created_at: new Date('2025-03-15T12:00:00Z'),
    status: 'active',
    name: 'Modelo de onboarding',
    reference: 'modelo-de-onboarding',
    description: 'Base para montar o workspace de um cliente novo',
    icon: 'i-lucide-layout-template',
    papel: 'Proprietário',
    favorito: false,
    ultimoAcessoMin: 120 * 24 * 60,
    members_count: 3,
    etiquetas: [],
  },
  {
    id: 17,
    created_at: new Date('2026-08-21T12:00:00Z'),
    status: 'active',
    name: 'Piloto Spaceflow',
    reference: 'piloto-spaceflow',
    description: '',
    icon: 'i-lucide-workflow',
    papel: 'Full',
    favorito: false,
    ultimoAcessoMin: 1 * 24 * 60,
    members_count: 7,
    etiquetas: ['testes'],
  },
  {
    id: 18,
    created_at: new Date('2026-09-30T12:00:00Z'),
    status: 'active',
    name: 'Nimbus Seguros Homologação',
    reference: 'nimbus-seguros-homologacao',
    description: '',
    icon: 'i-lucide-flask-conical',
    papel: 'Full',
    favorito: false,
    ultimoAcessoMin: null,
    members_count: 6,
    etiquetas: [],
  },
]

/** O caso da demanda: quem só pertence ao workspace da própria empresa. */
export const workspaceUnico: Workspace[] = [workspaces[0]!]

/** O que a pessoa vai fazer lá dentro — usado para explicar o que é um workspace. */
export const exemplosDoQueSeFazDentro = [
  { icone: 'i-lucide-life-buoy', texto: 'Abrir e acompanhar chamados' },
  { icone: 'i-lucide-check-square', texto: 'Ver suas tarefas e prazos' },
  { icone: 'i-lucide-folder-open', texto: 'Consultar dados e documentos' },
]

/** "há 2 horas", "há 9 dias" — texto relativo, calculado do mock. */
export function tempoRelativo(minutos: number | null): string {
  if (minutos === null) return 'Você ainda não entrou aqui'
  if (minutos < 60) return `Você esteve aqui há ${minutos} min`
  const horas = Math.round(minutos / 60)
  if (horas < 24) return `Você esteve aqui há ${horas} ${horas === 1 ? 'hora' : 'horas'}`
  const dias = Math.round(horas / 24)
  if (dias < 30) return `Você esteve aqui há ${dias} ${dias === 1 ? 'dia' : 'dias'}`
  const meses = Math.round(dias / 30)
  return `Você esteve aqui há ${meses} ${meses === 1 ? 'mês' : 'meses'}`
}

export const corDoPapel: Record<Papel, 'primary' | 'secondary' | 'neutral' | 'success'> = {
  'Proprietário': 'primary',
  'Full': 'secondary',
  'Membro': 'neutral',
  'Leitor': 'neutral',
}

/* ------------------------------------------------------------------
   Criação de workspace — estrutura tirada da jornada real do develop
   (percorrida em 16/09/2026, sem finalizar a criação).

   Passo 1 "Dados Gerais": Nome*, Referência* (preenchida a partir do
   nome), Descrição (com contador) e Ícone* — que no produto é uma
   árvore de categorias e, depois de escolhido, mostra o id técnico
   (`carbon:scales`) em vez do nome ou do desenho.
   Passo 2 "Selecionar Template (Opcional)": Localidade (Brasil pt-br,
   Estados Unidos en-us, Global — múltipla escolha) e Templates, que
   em Brasil responde "Não há dados".
------------------------------------------------------------------ */

// A biblioteca de ícones vive em `icones.ts`, gerada do @iconify-json/lucide.

export interface Localidade { id: string, nome: string }

export const localidades: Localidade[] = [
  { id: 'pt-br', nome: 'Brasil' },
  { id: 'en-us', nome: 'Estados Unidos' },
  { id: 'global', nome: 'Global' },
]

/* ------------------------------------------------------------------
   Rodada 24: o passo 2 vira a Central de casos de uso, com a cara da
   central do protótipo menu-lateral (rodada 18 de lá, padrão da Central
   de modelos do ClickUp). Os "modelos" do produto (Templates) passam a
   ser casos de uso do tipo workspace: os mesmos de
   menu-lateral/casos.ts, copiados para cá (protótipo não importa de
   outro), mais a localidade que o produto pede.
------------------------------------------------------------------ */

export type Complexidade = 'iniciante' | 'intermediario' | 'avancado'

export interface TelaDoCaso { rotulo: string, icone: string, tipoDeTela: string }
export interface MenuDoCaso { rotulo: string, icone: string, telas: TelaDoCaso[] }
export interface CategoriaDoCaso { nome: string, icone: string, campos: string[] }

export interface CasoDeUso {
  id: string
  nome: string
  icone: string
  area: string
  complexidade: Complexidade
  descricao: string
  destaque?: boolean
  /** Localidades em que o caso existe (ids de `localidades`). */
  localidades: string[]
  criadoEm: string
  usos: number
  menus: MenuDoCaso[]
  categorias: CategoriaDoCaso[]
  status: string[]
}

export const AREAS = ['Jurídico', 'Comercial', 'Financeiro', 'Pessoas', 'Compras', 'Atendimento'] as const

const tl = (rotulo: string, icone: string, tipoDeTela = 'consultas'): TelaDoCaso => ({ rotulo, icone, tipoDeTela })

export const casosDeUso: CasoDeUso[] = [
  {
    id: 'cu-chamados', nome: 'Central de chamados', icone: 'i-lucide-life-buoy', area: 'Atendimento',
    complexidade: 'intermediario', destaque: true, localidades: ['pt-br', 'global'], criadoEm: '2025-03-28', usos: 7220,
    descricao: 'Chamados com prazo de atendimento, fila por equipe e o painel do que está estourando.',
    menus: [{ rotulo: 'Atendimento', icone: 'i-lucide-life-buoy', telas: [tl('Fila da equipe', 'i-lucide-inbox', 'triagem'), tl('Meus chamados', 'i-lucide-user', 'meus-itens'), tl('Prazos', 'i-lucide-chart-column', 'paineis')] }],
    categorias: [{ nome: 'Chamados', icone: 'i-lucide-life-buoy', campos: ['Solicitante', 'Assunto', 'Prioridade', 'Prazo', 'Equipe'] }],
    status: ['Aberto', 'Em atendimento', 'Aguardando', 'Resolvido'],
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
    id: 'cu-funil', nome: 'Funil de vendas', icone: 'i-lucide-filter', area: 'Comercial',
    complexidade: 'iniciante', destaque: true, localidades: ['pt-br', 'en-us', 'global'], criadoEm: '2024-11-20', usos: 9850,
    descricao: 'Oportunidades em etapas, do primeiro contato ao fechamento, com metas do mês e o painel de conversão.',
    menus: [{ rotulo: 'Vendas', icone: 'i-lucide-trending-up', telas: [tl('Funil', 'i-lucide-kanban'), tl('Minhas oportunidades', 'i-lucide-user', 'meus-itens'), tl('Conversão', 'i-lucide-chart-column', 'paineis')] }],
    categorias: [{ nome: 'Oportunidades', icone: 'i-lucide-target', campos: ['Cliente', 'Valor', 'Etapa', 'Previsão de fechamento', 'Origem'] }],
    status: ['Prospecção', 'Proposta', 'Negociação', 'Ganho', 'Perdido'],
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
    id: 'cu-admissao', nome: 'Admissão de colaboradores', icone: 'i-lucide-user-plus', area: 'Pessoas',
    complexidade: 'intermediario', destaque: true, localidades: ['pt-br'], criadoEm: '2025-05-14', usos: 2780,
    descricao: 'Da vaga aprovada ao primeiro dia: documentos, equipamentos e acessos, cada um com responsável.',
    menus: [{ rotulo: 'Admissões', icone: 'i-lucide-user-plus', telas: [tl('Em andamento', 'i-lucide-list'), tl('Checklist do primeiro dia', 'i-lucide-list-checks', 'tarefas')] }],
    categorias: [{ nome: 'Admissões', icone: 'i-lucide-user-plus', campos: ['Nome', 'Cargo', 'Data de início', 'Gestor', 'Documentos'] }],
    status: ['Documentos', 'Equipamento', 'Acessos', 'Concluída'],
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
    id: 'cu-contencioso', nome: 'Contencioso', icone: 'i-lucide-scale', area: 'Jurídico',
    complexidade: 'avancado', localidades: ['pt-br'], criadoEm: '2025-06-02', usos: 870,
    descricao: 'Processos, prazos e audiências, com a pauta da semana e os prazos que vencem.',
    menus: [{ rotulo: 'Contencioso', icone: 'i-lucide-scale', telas: [tl('Processos', 'i-lucide-folder-open'), tl('Prazos da semana', 'i-lucide-alarm-clock', 'tarefas'), tl('Audiências', 'i-lucide-calendar-days')] }],
    categorias: [{ nome: 'Processos', icone: 'i-lucide-gavel', campos: ['Número', 'Vara', 'Parte contrária', 'Valor da causa', 'Fase'] }],
    status: ['Inicial', 'Instrução', 'Sentença', 'Recurso', 'Encerrado'],
  },
  {
    id: 'cu-reembolso', nome: 'Reembolsos', icone: 'i-lucide-hand-coins', area: 'Financeiro',
    complexidade: 'iniciante', localidades: ['pt-br', 'global'], criadoEm: '2025-04-30', usos: 3140,
    descricao: 'Quem pede anexa o comprovante; quem aprova vê a fila; o financeiro paga.',
    menus: [{ rotulo: 'Reembolsos', icone: 'i-lucide-hand-coins', telas: [tl('Minhas solicitações', 'i-lucide-user', 'minhas-requisicoes'), tl('Fila de aprovação', 'i-lucide-inbox', 'triagem')] }],
    categorias: [{ nome: 'Reembolsos', icone: 'i-lucide-hand-coins', campos: ['Valor', 'Data da despesa', 'Comprovante', 'Projeto'] }],
    status: ['Enviado', 'Aprovado', 'Pago', 'Recusado'],
  },
]
