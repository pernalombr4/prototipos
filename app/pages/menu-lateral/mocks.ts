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
  /** Grupos Permitidos: vazio significa que todo o workspace enxerga. */
  escopo?: string[]
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
    origem: 'workspace',
    escopo: [],
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
    origem: 'workspace',
    escopo: ['comercial'],
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
      { id: 'modulos', icone: 'i-lucide-package' },
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
  /*
   * RODADA 10: o grupo `Auditoria` SAIU daqui. Ela disse: "auditoria nao fica
   * em configuracao. e um grande menu a parte". Ele virou seção nativa de
   * primeiro nível, lá embaixo em `menuDoEditor`.
   *
   * O motivo cabe numa frase: configuração é onde se MUDA o workspace, e
   * auditoria é onde se OLHA o que ele fez. Quem consulta um log não está
   * configurando nada, e quem configura não quer passar pelo log.
   */
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

/* ==================================================================
   TELAS E REGRAS DO MENU
   Rodada 3. Base documental: `Configurações > Interface > Telas` do en-docs
   (somente leitura), que lista os 13 tipos e diz que os tipos que leem dados
   de categoria pedem a seleção de uma ou mais categorias na configuração.
================================================================== */

/** Os 13 tipos de tela que o produto oferece hoje, na ordem da documentação. */
export interface TipoDeTela {
  id: string
  /** Precisa escolher categoria na configuração. */
  exigeCategoria?: boolean
  /** Precisa de uma URL. */
  exigeCaminho?: boolean
}

export const tiposDeTela: TipoDeTela[] = [
  { id: 'arquivos' },
  { id: 'consultas', exigeCategoria: true },
  { id: 'consultas-grupo', exigeCategoria: true },
  { id: 'embutido', exigeCaminho: true },
  { id: 'customizado', exigeCaminho: true },
  { id: 'meus-itens', exigeCategoria: true },
  { id: 'minhas-requisicoes' },
  { id: 'paineis' },
  { id: 'requisicoes', exigeCategoria: true },
  { id: 'tarefas' },
  { id: 'tarefas-geral' },
  { id: 'personalizada' },
  { id: 'triagem', exigeCategoria: true },
]

/**
 * As telas NATIVAS que já existem e as que estão por vir.
 *
 * As quatro marcadas com `emBreve` foram informadas pela Mikaela em 17/09/2026 e
 * ainda não existem no develop. Entraram no protótipo para o desenho ser testado
 * com o menu que o ENSPACE vai ter, não só com o de hoje.
 */
export interface TelaNativa {
  id: string
  icone: string
  /** Onde ela entra na proposta. */
  lugar: 'destino' | 'analise'
  emBreve?: boolean
}

export const telasNativas: TelaNativa[] = [
  { id: 'inicio', icone: 'i-lucide-house', lugar: 'destino' },
  { id: 'inbox', icone: 'i-lucide-inbox', lugar: 'destino', emBreve: true },
  { id: 'chat-ia', icone: 'i-lucide-bot', lugar: 'destino' },
  { id: 'tarefas', icone: 'i-lucide-square-check-big', lugar: 'destino' },
  { id: 'agenda', icone: 'i-lucide-calendar-days', lugar: 'destino' },
  { id: 'spaceflows', icone: 'i-lucide-workflow', lugar: 'destino' },
  { id: 'documentos', icone: 'i-lucide-folder-open', lugar: 'destino', emBreve: true },
  { id: 'painel-tarefas', icone: 'i-lucide-chart-column', lugar: 'analise', emBreve: true },
  { id: 'painel-dados', icone: 'i-lucide-chart-pie', lugar: 'analise', emBreve: true },
  { id: 'meus-relatorios', icone: 'i-lucide-file-chart-column', lugar: 'analise', emBreve: true },
]

/**
 * AS REGRAS DE ENCAIXE DO MENU.
 *
 * "não da pra deixar o cara botar uma categoria dentro de tarefas" (Mikaela).
 * As quatro regras abaixo saem do modelo que o produto já tem: seção tem itens,
 * item é tela, e destino nativo é folha.
 */
export type TipoDeNo = 'raiz' | 'destino' | 'secao-nativa' | 'secao' | 'categoria' | 'tela'

export interface ResultadoDeEncaixe {
  pode: boolean
  /** Chave do motivo no textos.ts, quando não pode. */
  motivo?: 'destinoEhFolha' | 'categoriaSoEmCategorias' | 'telaNaoEmCategorias' | 'secaoDentroDeSecao'
}

export function podeMover(oQue: TipoDeNo, paraDentroDe: TipoDeNo): ResultadoDeEncaixe {
  // R1. Destino nativo é folha: não recebe nada. É a regra que ela citou.
  if (paraDentroDe === 'destino') return { pode: false, motivo: 'destinoEhFolha' }

  // R2. Seção não entra em seção: o menu tem dois níveis, e é o ponto da demanda.
  if ((oQue === 'secao' || oQue === 'secao-nativa' || oQue === 'destino') && paraDentroDe !== 'raiz') {
    return { pode: false, motivo: 'secaoDentroDeSecao' }
  }

  // R3. Categoria só mora na seção nativa de categorias.
  if (oQue === 'categoria' && paraDentroDe !== 'secao-nativa') {
    return { pode: false, motivo: 'categoriaSoEmCategorias' }
  }

  // R4. Tela não entra na seção nativa de categorias.
  if (oQue === 'tela' && paraDentroDe === 'secao-nativa') {
    return { pode: false, motivo: 'telaNaoEmCategorias' }
  }

  return { pode: true }
}

/** O menu como o administrador o vê no editor. Dado do protótipo. */
export interface NoDoMenu {
  id: string
  tipo: TipoDeNo
  /** Rótulo livre, escrito pelo administrador. Nativo usa chave do textos.ts. */
  rotulo?: string
  chave?: string
  icone: string
  /** Só para item do tipo tela. */
  tipoDeTela?: string
  categoriasLigadas?: number
  /** Grupos de membros que enxergam. Vazio significa que todos enxergam. */
  escopo?: string[]
  /** Só para seção, e só no modelo de trilha: trilha ou dentro de um painel. */
  lugar?: LugarDaSecao
  /** Quando lugar é painel: em qual painel a seção entra. */
  painel?: string
  /** Tela informada pela Mikaela que ainda não existe no develop. */
  emBreve?: boolean
  /**
   * De onde o item veio. É o que separa os três modos de demonstração:
   *   `nativo`    existe em qualquer workspace, sempre;
   *   `modulo`    apareceu porque um módulo foi ativado;
   *   `workspace` alguém criou em Interface > Menus.
   */
  origem?: 'nativo' | 'modulo' | 'workspace'
  /** Qual módulo trouxe este item, quando a origem é `modulo`. */
  moduloId?: string
  filhos?: NoDoMenu[]
}

export const menuDoEditor: NoDoMenu[] = [
  { id: 'n-inicio', tipo: 'destino', chave: 'inicio', icone: 'i-lucide-house' },
  /*
   * RODADA 9. Dois destinos nativos novos, no alto.
   *
   * `Inbox` ela anunciou: "teremos tambem outros menus nativos: inbox sera um
   * deles. com notificacoes pra abrir". Ainda nao existe no develop.
   *
   * `Chat de IA` e o BENI, que hoje mora dentro de Ajuda. Ela mandou tirar de
   * la: "o beni deve ser 'chat de ia' no menu grande". Ferramenta de trabalho
   * nao se guarda no balcao de suporte.
   *
   * Os dois ficam logo abaixo de Inicio porque sao fluxos pessoais, o que chega
   * para mim e o que eu pergunto, e nao objetos do workspace. E a ordem do
   * Linear (Inbox e My Issues no topo) e do Notion (AI acima do conteudo).
   */
  { id: 'n-inbox', tipo: 'destino', chave: 'inbox', icone: 'i-lucide-inbox', emBreve: true },
  { id: 'n-chat-ia', tipo: 'destino', chave: 'chatIa', icone: 'i-lucide-bot' },
  { id: 'n-tarefas', tipo: 'destino', chave: 'tarefas', icone: 'i-lucide-square-check-big' },
  { id: 'n-agenda', tipo: 'destino', chave: 'agenda', icone: 'i-lucide-calendar-days' },
  { id: 'n-spaceflows', tipo: 'destino', chave: 'spaceflows', icone: 'i-lucide-workflow' },
  { id: 'n-documentos', tipo: 'destino', chave: 'documentos', icone: 'i-lucide-folder-open', emBreve: true },
  /*
   * RODADA 9. Analise saiu de dentro do painel de Dados e virou menu de
   * primeiro nivel, acima da lista de categorias, com os dashboards dentro.
   * Pedido dela, literal: "analise deve ser um grande menu fora, de primeiro
   * nivel, com os dashboards dentro".
   *
   * No modelo de trilha isso significa icone proprio na trilha (`lugar`), e na
   * barra unica significa esta posicao: logo depois dos destinos nativos e
   * antes dos favoritos e das categorias.
   */
  {
    id: 's-analise',
    tipo: 'secao',
    origem: 'nativo',
    rotulo: 'Análise',
    icone: 'i-lucide-chart-column',
    lugar: 'trilha',
    escopo: [],
    filhos: [
      { id: 't-pt', tipo: 'tela', emBreve: true, rotulo: 'Dashboard de tarefas', icone: 'i-lucide-chart-column', tipoDeTela: 'paineis' },
      { id: 't-pd', tipo: 'tela', emBreve: true, rotulo: 'Dashboard de dados', icone: 'i-lucide-chart-pie', tipoDeTela: 'paineis' },
      { id: 't-mr', tipo: 'tela', emBreve: true, rotulo: 'Meus relatórios', icone: 'i-lucide-file-chart-column', tipoDeTela: 'personalizada' },
    ],
  },
  {
    id: 'n-categorias',
    tipo: 'secao-nativa',
    chave: 'categorias',
    icone: 'i-lucide-database',
    filhos: [
      { id: 'c-1', tipo: 'categoria', rotulo: 'Contratos', icone: 'i-lucide-file-signature' },
      { id: 'c-2', tipo: 'categoria', rotulo: 'Clientes', icone: 'i-lucide-building-2' },
      { id: 'c-3', tipo: 'categoria', rotulo: 'Chamados', icone: 'i-lucide-life-buoy' },
    ],
  },
  /*
   * AUDITORIA, rodada 10. Menu nativo de primeiro nível, fora das
   * configurações.
   *
   * Fica DEPOIS das categorias, e não antes: é primeiro nível porque é um
   * assunto próprio, não porque é diário. Acima das categorias ele empurraria
   * o trabalho de todo dia para baixo por um menu que se abre quando algo
   * precisa ser explicado.
   */
  {
    id: 's-auditoria',
    tipo: 'secao',
    origem: 'nativo',
    chave: 'auditoria',
    icone: 'i-lucide-history',
    lugar: 'trilha',
    escopo: [],
    filhos: [
      { id: 'a-logs', tipo: 'tela', chave: 'logsAuditoria', icone: 'i-lucide-scroll-text', tipoDeTela: 'personalizada' },
      { id: 'a-req', tipo: 'tela', chave: 'logsRequisicao', icone: 'i-lucide-activity', tipoDeTela: 'personalizada' },
    ],
  },
  {
    id: 's-conhecimento',
    tipo: 'secao',
    origem: 'workspace',
    rotulo: 'Conhecimento',
    icone: 'i-lucide-book-open',
    lugar: 'trilha',
    escopo: [],
    filhos: [
      { id: 't-base', tipo: 'tela', rotulo: 'Base de Conhecimento', icone: 'i-lucide-library', tipoDeTela: 'personalizada' },
      { id: 't-pol', tipo: 'tela', rotulo: 'Políticas internas', icone: 'i-lucide-file-text', tipoDeTela: 'arquivos' },
    ],
  },
  {
    id: 's-comercial',
    tipo: 'secao',
    origem: 'workspace',
    rotulo: 'Comercial',
    icone: 'i-lucide-trending-up',
    lugar: 'trilha',
    escopo: ['comercial'],
    filhos: [
      { id: 't-pv', tipo: 'tela', rotulo: 'Painel de vendas', icone: 'i-lucide-chart-line', tipoDeTela: 'paineis' },
      { id: 't-tri', tipo: 'tela', rotulo: 'Triagem de propostas', icone: 'i-lucide-list-filter', tipoDeTela: 'triagem', categoriasLigadas: 2 },
      { id: 't-req', tipo: 'tela', rotulo: 'Minhas requisições', icone: 'i-lucide-inbox', tipoDeTela: 'minhas-requisicoes' },
    ],
  },
]

/* ==================================================================
   GRUPOS DE MEMBROS, para o escopo do menu
   O produto já tem "Grupos Permitidos" na seção de menu: restringe a
   visibilidade a grupos específicos, e nenhum grupo marcado significa que
   todos veem. Base: `Configurações > Interface > Menus` do en-docs.
================================================================== */

export interface GrupoDeMembros {
  id: string
  nome: string
  pessoas: number
}

/** Fictícios. Nenhum grupo, empresa ou pessoa aqui é real. */
export const gruposDeMembros: GrupoDeMembros[] = [
  { id: 'comercial', nome: 'Comercial', pessoas: 12 },
  { id: 'juridico', nome: 'Jurídico', pessoas: 5 },
  { id: 'financeiro', nome: 'Financeiro', pessoas: 8 },
  { id: 'operacoes', nome: 'Operações', pessoas: 31 },
  { id: 'atendimento', nome: 'Atendimento', pessoas: 19 },
]

/**
 * Onde uma seção pode morar.
 *
 * No modelo de barra única existe um lugar só, então o campo nem aparece.
 * No modelo de trilha existem dois, e é a pergunta da Mikaela: "o user poderia
 * criar no menu grandão e no menu pequeno seções pra ele".
 *   - `trilha`: vira um ícone na trilha estreita, com painel próprio;
 *   - `painel`: vira uma seção dentro do painel de uma área que já existe.
 */
export type LugarDaSecao = 'trilha' | 'painel'

/** Os painéis que podem receber uma seção nova, no modelo de trilha. */
export const paineisQueRecebem = [
  { id: 'trabalho', chave: 'areaTrabalho' },
  { id: 'dados', chave: 'areaDados' },
]


/* ==================================================================
   MÓDULOS
   Base documental: `Módulos` do en-docs (somente leitura). São dois, e são
   estes: "Os módulos podem ser ativados ou desativados conforme as
   necessidades da organização", em `Configurações > Sistema > Informações
   Básicas`, seção Módulos.
================================================================== */

export interface Modulo {
  id: string
  icone: string
  /** Ativado por padrão no modo completo da demonstração. */
  ativoPorPadrao: boolean
}

export const modulos: Modulo[] = [
  { id: 'comparacoes', icone: 'i-lucide-scale', ativoPorPadrao: true },
  { id: 'correcao-monetaria', icone: 'i-lucide-percent', ativoPorPadrao: true },
]

/**
 * O menu que cada módulo traz quando é ativado.
 *
 * `Calculadora avulsa` é documentada: o módulo de Correção Monetária tem a tela
 * e ela é alcançável. Os três itens de Comparações são DERIVADOS do fluxo que a
 * documentação descreve (Visão do Responsável, Visão do Aprovador e Extrair
 * relatórios), e não de uma tela de menu que eu tenha visto. Marcado aqui para
 * ninguém ler como fato do produto.
 */
export const secoesDeModulo: NoDoMenu[] = [
  {
    id: 'm-comparacoes',
    tipo: 'secao',
    origem: 'modulo',
    moduloId: 'comparacoes',
    rotulo: 'Comparações',
    icone: 'i-lucide-scale',
    lugar: 'trilha',
    escopo: [],
    filhos: [
      { id: 'mc-minhas', tipo: 'tela', origem: 'modulo', moduloId: 'comparacoes', rotulo: 'Minhas comparações', icone: 'i-lucide-list-checks', tipoDeTela: 'consultas', categoriasLigadas: 1 },
      { id: 'mc-aprovar', tipo: 'tela', origem: 'modulo', moduloId: 'comparacoes', rotulo: 'Para aprovar', icone: 'i-lucide-circle-check-big', tipoDeTela: 'triagem', categoriasLigadas: 1 },
      { id: 'mc-relatorios', tipo: 'tela', origem: 'modulo', moduloId: 'comparacoes', rotulo: 'Relatórios de comparação', icone: 'i-lucide-file-chart-column', tipoDeTela: 'paineis' },
    ],
  },
  {
    id: 'm-correcao',
    tipo: 'secao',
    origem: 'modulo',
    moduloId: 'correcao-monetaria',
    rotulo: 'Correção monetária',
    icone: 'i-lucide-percent',
    lugar: 'painel',
    painel: 'dados',
    escopo: [],
    filhos: [
      { id: 'mm-calc', tipo: 'tela', origem: 'modulo', moduloId: 'correcao-monetaria', rotulo: 'Calculadora avulsa', icone: 'i-lucide-calculator', tipoDeTela: 'personalizada' },
    ],
  },
]


/* ==================================================================
   AS NOTIFICAÇÕES DO INBOX
   Rodada 9. "inbox sera um deles. com notificaçoes pra abrir" (Mikaela).
   Conteúdo fictício: nenhuma pessoa, empresa ou item aqui é real.
================================================================== */

export interface Notificacao {
  id: string
  icone: string
  /** O que aconteceu. Texto de maquete, como o nome das categorias. */
  texto: string
  /** Onde aconteceu, para a pessoa saber se aquilo é com ela. */
  onde: string
  /** Há quanto tempo, em unidade e valor, para o dicionário formatar. */
  quando: { valor: number, unidade: 'min' | 'h' | 'd' }
}

export const notificacoes: Notificacao[] = [
  { id: 'nt-1', icone: 'i-lucide-at-sign', texto: 'Rita A. mencionou você em um comentário', onde: 'Contrato 1284', quando: { valor: 6, unidade: 'min' } },
  { id: 'nt-2', icone: 'i-lucide-circle-check-big', texto: 'Sua requisição de compra foi aprovada', onde: 'Solicitações de compra e reembolso', quando: { valor: 40, unidade: 'min' } },
  { id: 'nt-3', icone: 'i-lucide-user-plus', texto: 'Caio M. atribuiu uma tarefa a você', onde: 'Revisar minuta do aditivo', quando: { valor: 2, unidade: 'h' } },
  { id: 'nt-4', icone: 'i-lucide-message-square', texto: 'Lúcia P. respondeu no chamado que você segue', onde: 'Chamados', quando: { valor: 5, unidade: 'h' } },
  { id: 'nt-5', icone: 'i-lucide-calendar-clock', texto: 'Um prazo que você acompanha vence amanhã', onde: 'Contrato 1301', quando: { valor: 1, unidade: 'd' } },
  { id: 'nt-6', icone: 'i-lucide-workflow', texto: 'O spaceflow de onboarding terminou', onde: 'Spaceflows', quando: { valor: 2, unidade: 'd' } },
]
