// Dado do protótipo do menu lateral. 100% fictício, com a ESTRUTURA do produto.
//
// A categoria é ancorada no schema real `ItemType` do
// `@be-enlighten/enspace-sdk-schemas`: `id`, `name`, `slug`, `description`, `icon` e `color`
// são os campos que existem de verdade, com os tipos de verdade.
//
// O que o protótipo acrescentou está marcado campo a campo. Campo acrescentado é sinal:
// ou vem de outra rota, ou é invenção da proposta (regra 23).
//
// Os VALORES são inventados. Nenhuma empresa, pessoa ou workspace aqui é real.
//
// ATENÇÃO (regra 33): nada aqui leva travessão, porque tudo isto aparece renderizado.

import type { ItemType } from '@be-enlighten/enspace-sdk-schemas'

/* ==================================================================
   CATEGORIA
================================================================== */

/** O que a API entrega de verdade sobre uma categoria. */
type CamposDaApi = Pick<ItemType, 'id' | 'name' | 'slug' | 'description' | 'icon' | 'color'>

export interface Categoria extends CamposDaApi {
  /**
   * Acrescentado pelo protótipo. Hoje não existe favorito por usuário no ENSPACE.
   * É a peça central da proposta: sete dos oito produtos pesquisados têm.
   */
  favorita: boolean
  /**
   * Acrescentado pelo protótipo. Contador de aberturas nos últimos 30 dias, por pessoa.
   * Alimenta a ordenação "Mais usadas", que o Attio chama de "Most relevant".
   */
  aberturas: number
  /**
   * Vem do produto, por outra rota: os formulários da categoria.
   * Hoje viram o terceiro nível do menu. Na proposta viram aba dentro da tela.
   */
  formularios: string[]
  /** Vem do produto: a categoria entra no menu automático. */
  noMenu: boolean
}

/**
 * O workspace normal. Oito categorias, que é o tamanho em que o menu de hoje ainda
 * parece funcionar.
 *
 * Casos de canto de propósito: nome que estoura a largura da barra (Solicitações),
 * categoria sem descrição (Fornecedores), categoria sem ícone próprio (Ocorrências),
 * categoria fora do menu automático (Auditoria interna) e categoria com quatro
 * formulários (Contratos).
 */
export const categoriasNormais: Categoria[] = [
  {
    id: 1,
    name: 'Contratos',
    slug: 'contratos',
    description: 'Contratos vigentes, aditivos e renovações.',
    icon: 'i-lucide-file-signature',
    color: 'fuchsia',
    favorita: true,
    aberturas: 84,
    formularios: ['Contrato de prestação', 'Contrato de fornecimento', 'Aditivo', 'Distrato'],
    noMenu: true,
  },
  {
    id: 2,
    name: 'Clientes',
    slug: 'clientes',
    description: 'Cadastro de clientes e seus contatos.',
    icon: 'i-lucide-building-2',
    color: 'cyan',
    favorita: true,
    aberturas: 61,
    formularios: ['Pessoa jurídica', 'Pessoa física'],
    noMenu: true,
  },
  {
    id: 3,
    name: 'Chamados',
    slug: 'chamados',
    description: 'Atendimentos abertos pelo portal e pelo e-mail.',
    icon: 'i-lucide-life-buoy',
    color: 'teal',
    favorita: true,
    aberturas: 47,
    formularios: ['Chamado padrão', 'Chamado crítico'],
    noMenu: true,
  },
  {
    id: 4,
    name: 'Solicitações de compra e reembolso',
    slug: 'solicitacoes-compra-reembolso',
    description: 'Pedidos que passam por aprovação financeira.',
    icon: 'i-lucide-receipt',
    color: 'yellow',
    favorita: false,
    aberturas: 22,
    formularios: ['Compra', 'Reembolso'],
    noMenu: true,
  },
  {
    id: 5,
    name: 'Fornecedores',
    slug: 'fornecedores',
    icon: 'i-lucide-truck',
    color: 'cyan',
    favorita: false,
    aberturas: 14,
    formularios: ['Cadastro de fornecedor'],
    noMenu: true,
  },
  {
    id: 6,
    name: 'Ocorrências',
    slug: 'ocorrencias',
    description: 'Registros de incidente e não conformidade.',
    color: 'red',
    favorita: false,
    aberturas: 9,
    formularios: ['Ocorrência'],
    noMenu: true,
  },
  {
    id: 7,
    name: 'Colaboradores',
    slug: 'colaboradores',
    description: 'Quadro de pessoal e histórico funcional.',
    icon: 'i-lucide-users',
    color: 'teal',
    favorita: false,
    aberturas: 6,
    formularios: ['Admissão', 'Movimentação'],
    noMenu: true,
  },
  {
    id: 8,
    name: 'Auditoria interna',
    slug: 'auditoria-interna',
    description: 'Planos de auditoria e achados. Fora do menu automático.',
    icon: 'i-lucide-search-check',
    color: 'yellow',
    favorita: false,
    aberturas: 2,
    formularios: ['Plano de auditoria'],
    noMenu: false,
  },
]

/**
 * O workspace da demanda: "se eu tiver muitas categorias entao... piorou".
 *
 * Trinta e duas categorias a mais, somando 40. O volume foi MODELADO, não observado:
 * o workspace de exploração do develop tem uma categoria só, e a spec proíbe criar
 * dado por API sem perguntar antes. Ver a pergunta em aberto no DECISOES.md.
 */
const nomesDeVolume = [
  'Propostas comerciais', 'Oportunidades', 'Leads', 'Visitas técnicas',
  'Orçamentos', 'Notas fiscais', 'Pagamentos', 'Centros de custo',
  'Projetos', 'Entregas', 'Marcos de projeto', 'Riscos',
  'Treinamentos', 'Certificações', 'Avaliações de desempenho', 'Férias',
  'Equipamentos', 'Manutenções', 'Frota', 'Abastecimentos',
  'Imóveis', 'Locações', 'Vistorias', 'Laudos',
  'Processos judiciais', 'Audiências', 'Procurações', 'Pareceres',
  'Políticas internas', 'Comunicados', 'Atas de reunião', 'Pesquisas de clima',
]

const iconesDeVolume = [
  'i-lucide-folder', 'i-lucide-clipboard-list', 'i-lucide-boxes', 'i-lucide-calendar-check',
  'i-lucide-banknote', 'i-lucide-scale', 'i-lucide-wrench', 'i-lucide-map-pin',
]

export const categoriasVolume: Categoria[] = [
  ...categoriasNormais,
  ...nomesDeVolume.map((name, i): Categoria => ({
    id: 100 + i,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: i % 5 === 0 ? undefined : `Registros de ${name.toLowerCase()}.`,
    icon: iconesDeVolume[i % iconesDeVolume.length],
    color: ['fuchsia', 'cyan', 'teal', 'yellow'][i % 4],
    favorita: false,
    // Decrescente de propósito: a cauda longa quase não é aberta, e é isso que
    // justifica mostrar um recorte em vez da lista inteira.
    aberturas: Math.max(0, 12 - Math.floor(i / 2)),
    formularios: ['Padrão'],
    noMenu: true,
  })),
]

/* ==================================================================
   SEÇÃO DE MENU
   Invenção do protótipo no formato, não no conceito: o ENSPACE já tem seção
   com nome, ícone, ordem e grupos permitidos em Interface > Menus. Não há
   schema exportado para ela no enspace-sdk-schemas.
================================================================== */

export interface ItemDeMenu {
  id: string
  rotulo: string
  icone: string
  /** Contador ao lado do rótulo, quando faz sentido. */
  contador?: number
  /** Tela nativa do produto que ainda não está em menu nenhum por padrão (S2-F1). */
  nativaEscondida?: boolean
}

export interface SecaoDeMenu {
  id: string
  rotulo: string
  icone: string
  /** Seção criada pelo administrador em Interface > Menus. */
  personalizada: boolean
  itens: ItemDeMenu[]
}

/** Destinos fixos da operação. Mesma ordem de hoje: regra 16, o endereço não muda. */
export const destinosDeTrabalho: ItemDeMenu[] = [
  { id: 'inicio', rotulo: 'inicio', icone: 'i-lucide-house' },
  { id: 'spaceflows', rotulo: 'spaceflows', icone: 'i-lucide-workflow' },
  { id: 'tarefas', rotulo: 'tarefas', icone: 'i-lucide-square-check-big', contador: 3 },
  { id: 'agenda', rotulo: 'agenda', icone: 'i-lucide-calendar-days' },
]

/** Seções personalizadas que o administrador montou em Interface > Menus. */
export const secoesPersonalizadas: SecaoDeMenu[] = [
  {
    id: 'conhecimento',
    rotulo: 'Conhecimento',
    icone: 'i-lucide-book-open',
    personalizada: true,
    itens: [
      { id: 'base', rotulo: 'Base de Conhecimento', icone: 'i-lucide-library', nativaEscondida: true },
      { id: 'politicas', rotulo: 'Políticas internas', icone: 'i-lucide-file-text' },
    ],
  },
  {
    id: 'comercial',
    rotulo: 'Comercial',
    icone: 'i-lucide-trending-up',
    personalizada: true,
    itens: [
      { id: 'painel-vendas', rotulo: 'Painel de vendas', icone: 'i-lucide-chart-line' },
      { id: 'triagem', rotulo: 'Triagem de propostas', icone: 'i-lucide-list-filter' },
      { id: 'minhas-req', rotulo: 'Minhas requisições', icone: 'i-lucide-inbox' },
    ],
  },
]

/* ==================================================================
   CONFIGURAÇÕES
   Os 19 itens de hoje, reagrupados em 8 grupos de 2 níveis.
   O de-para item a item está no DECISOES.md.
================================================================== */

// O rótulo NÃO mora aqui: é texto de interface nativa e precisa dos três idiomas.
// Aqui ficam só a identidade e o ícone; o rótulo sai do `textos.ts` pelo `id` (regra 35).

export interface GrupoDeConfiguracao {
  id: string
  icone: string
  itens: { id: string, icone: string }[]
}

export const gruposDeConfiguracao: GrupoDeConfiguracao[] = [
  {
    id: 'workspace',
    icone: 'i-lucide-building',
    itens: [
      { id: 'visao-geral', icone: 'i-lucide-layout-dashboard' },
      { id: 'informacoes', icone: 'i-lucide-id-card' },
      { id: 'calendario', icone: 'i-lucide-calendar' },
      { id: 'notificacoes', icone: 'i-lucide-bell' },
      { id: 'dicionarios', icone: 'i-lucide-languages' },
      { id: 'cobranca', icone: 'i-lucide-credit-card' },
    ],
  },
  {
    id: 'estrutura',
    icone: 'i-lucide-database',
    itens: [
      { id: 'cfg-categorias', icone: 'i-lucide-folder-kanban' },
      { id: 'cfg-listas', icone: 'i-lucide-list' },
      { id: 'cfg-spaceflows', icone: 'i-lucide-workflow' },
    ],
  },
  {
    id: 'acesso',
    icone: 'i-lucide-users',
    itens: [
      { id: 'membros', icone: 'i-lucide-user-round' },
      { id: 'cargos', icone: 'i-lucide-shield-check' },
      { id: 'grupos', icone: 'i-lucide-users-round' },
    ],
  },
  {
    id: 'interface',
    icone: 'i-lucide-layout',
    itens: [
      { id: 'menus', icone: 'i-lucide-menu' },
      { id: 'telas', icone: 'i-lucide-monitor' },
      { id: 'casos-de-uso', icone: 'i-lucide-package' },
    ],
  },
  {
    id: 'emails',
    icone: 'i-lucide-mail',
    itens: [
      { id: 'caixas', icone: 'i-lucide-inbox' },
      { id: 'modelos', icone: 'i-lucide-file-text' },
      { id: 'enviados', icone: 'i-lucide-send' },
    ],
  },
  {
    id: 'conexoes',
    icone: 'i-lucide-plug',
    itens: [
      { id: 'integracoes', icone: 'i-lucide-git-merge' },
      { id: 'credenciais', icone: 'i-lucide-key-round' },
    ],
  },
  {
    id: 'ia',
    icone: 'i-lucide-bot',
    itens: [
      { id: 'agentes', icone: 'i-lucide-bot' },
    ],
  },
  {
    id: 'auditoria',
    icone: 'i-lucide-history',
    itens: [
      { id: 'logs-auditoria', icone: 'i-lucide-scroll-text' },
      { id: 'logs-requisicao', icone: 'i-lucide-activity' },
    ],
  },
]

/* ==================================================================
   O MENU NATIVO DE HOJE, para a comparação lado a lado.

   ATENÇÃO, e isto foi uma correção: esta lista é o menu **nativo**, o que
   existe em QUALQUER workspace antes de alguém cadastrar qualquer coisa.
   A primeira versão reproduzia o menu do workspace `teste-ux` inteiro, com a
   categoria `leve`, o formulário `AUD Formulario` e a seção `Knowledge` que
   alguém criou lá. Aquilo é o menu de UM workspace, não do produto.

   28 itens mais 3 rótulos de grupo = 31 linhas, sem nenhuma categoria.
   Cada categoria com menu automático soma 1 linha, e mais uma por formulário
   quando expandida. Cada seção do workspace soma 1 mais os itens dela.

   No `teste-ux`, em 16/09/2026, o menu media 36 linhas: estas 31 mais 5 que
   eram daquele workspace (leve, Todos, AUD Formulario, Knowledge e
   Knowledge Base).

   Copiado do DOM do develop, que estava em pt-BR. Os rótulos NÃO passam pelo
   textos.ts de propósito: são registro de uma captura, como o GIF em
   evidencias/, e não a copy da proposta. Traduzi-los seria inventar strings
   do produto em espanhol. A legenda do painel, essa sim, está nos três idiomas.
================================================================== */

export interface LinhaDeHoje {
  rotulo: string
  nivel: 0 | 1 | 2 | 3
  grupo: 'membro' | 'configuracoes' | 'ajuda'
}

export const menuNativoDeHoje: LinhaDeHoje[] = [
  { rotulo: 'Membro', nivel: 0, grupo: 'membro' },
  { rotulo: 'Início', nivel: 1, grupo: 'membro' },
  { rotulo: 'Spaceflows', nivel: 1, grupo: 'membro' },
  { rotulo: 'Categorias', nivel: 1, grupo: 'membro' },
  { rotulo: 'Tarefas', nivel: 1, grupo: 'membro' },
  { rotulo: 'Agendadas', nivel: 2, grupo: 'membro' },
  { rotulo: 'Rápidas', nivel: 2, grupo: 'membro' },
  { rotulo: 'Agenda', nivel: 1, grupo: 'membro' },
  { rotulo: 'Configurações', nivel: 0, grupo: 'configuracoes' },
  { rotulo: 'Visão Geral', nivel: 1, grupo: 'configuracoes' },
  { rotulo: 'Sistema', nivel: 1, grupo: 'configuracoes' },
  { rotulo: 'Estrutura', nivel: 1, grupo: 'configuracoes' },
  { rotulo: 'Categorias', nivel: 2, grupo: 'configuracoes' },
  { rotulo: 'Listas', nivel: 2, grupo: 'configuracoes' },
  { rotulo: 'Spaceflow', nivel: 2, grupo: 'configuracoes' },
  { rotulo: 'Gestão de Membros', nivel: 1, grupo: 'configuracoes' },
  { rotulo: 'Interface', nivel: 1, grupo: 'configuracoes' },
  { rotulo: 'Menus', nivel: 2, grupo: 'configuracoes' },
  { rotulo: 'Telas', nivel: 2, grupo: 'configuracoes' },
  { rotulo: 'Casos de Uso', nivel: 2, grupo: 'configuracoes' },
  { rotulo: 'E-mails', nivel: 1, grupo: 'configuracoes' },
  { rotulo: 'E-mails Enviados', nivel: 2, grupo: 'configuracoes' },
  { rotulo: 'Modelos de E-mail', nivel: 2, grupo: 'configuracoes' },
  { rotulo: 'Caixas de E-mail', nivel: 2, grupo: 'configuracoes' },
  { rotulo: 'Integrações', nivel: 1, grupo: 'configuracoes' },
  { rotulo: 'Agentes de IA', nivel: 1, grupo: 'configuracoes' },
  { rotulo: 'Logs', nivel: 1, grupo: 'configuracoes' },
  { rotulo: 'Credenciais', nivel: 1, grupo: 'configuracoes' },
  { rotulo: 'Ajuda', nivel: 0, grupo: 'ajuda' },
  { rotulo: 'Releases', nivel: 1, grupo: 'ajuda' },
  { rotulo: 'Documentação', nivel: 1, grupo: 'ajuda' },
]

/** O workspace do protótipo. Fictício. */
export const workspace = {
  nome: 'Meridiano Serviços',
  referencia: 'meridiano',
  inicial: 'M',
}

/** Quem está usando. Fictícia. */
export const usuaria = {
  nome: 'Rita Alcântara',
  iniciais: 'RA',
  cargo: 'Coordenadora de operações',
}
