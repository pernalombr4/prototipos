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
  'id' | 'name' | 'reference' | 'status' | 'description' | 'icon' | 'members_count'
>

export interface Workspace extends CamposDaApi {
  /** Papel do usuário — vem da listagem por membro, não do modelo Workspace. */
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

export interface Template {
  id: string
  nome: string
  descricao: string
  icone: string
  localidades: string[]
  inclui: string[]
}

/**
 * Templates fictícios. No develop, a Localidade Brasil hoje responde
 * "Não há dados" — o estado vazio é real e está no protótipo como estado.
 * Estes existem para mostrar como o passo se comporta quando houver.
 */
export const templates: Template[] = [
  {
    id: 'chamados',
    name: 'Central de chamados',
    description: 'Abertura, triagem e acompanhamento de pedidos internos.',
    icon: 'i-lucide-life-buoy',
    localidades: ['pt-br', 'global'],
    inclui: ['Categoria de chamados', 'Formulário de abertura', 'Fluxo de triagem', 'Painel de SLA'],
  },
  {
    id: 'rh',
    name: 'Jornada do colaborador',
    description: 'Admissão, férias, benefícios e desligamento num lugar só.',
    icon: 'i-lucide-users',
    localidades: ['pt-br'],
    inclui: ['Categoria de pessoas', 'Fluxo de admissão', 'Solicitação de férias'],
  },
  {
    id: 'juridico',
    name: 'Contratos e prazos',
    description: 'Guarda de contratos com alerta de vencimento e reajuste.',
    icon: 'i-lucide-scale',
    localidades: ['pt-br', 'global'],
    inclui: ['Categoria de contratos', 'Alerta de vencimento', 'Correção monetária'],
  },
]
