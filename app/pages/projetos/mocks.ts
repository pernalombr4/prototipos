// Dado do protótipo de Projetos. 100% fictício, com a ESTRUTURA do produto.
//
// Categoria, pessoa, cargo, grupo e item se apoiam nos schemas reais do
// `@be-enlighten/enspace-sdk-schemas` (`ItemType`, `Member`, `Role`, `MemberGroup`, `Item`).
// O PROJETO não existe no produto nem no SDK: o modelo abaixo parte do plugin `en-projects`
// que o back teve entre 2024-12-20 e 2025-06-23 (nome, tipo aberto ou fechado, descrição,
// referência, status, membros por pessoa, grupo ou cargo) e soma o que a pesquisa propôs
// (visibilidade privada, papel no projeto, permissão padrão, categorias do projeto).
// Todo campo inventado está marcado.
//
// Os VALORES são inventados. Nenhuma empresa, pessoa ou workspace aqui é real.
// ATENÇÃO (regra 33): nada aqui leva travessão, porque tudo isto aparece renderizado.

import type { ItemType, Member, MemberGroup, Role } from '@be-enlighten/enspace-sdk-schemas'

/* ==================================================================
   WORKSPACE E PESSOAS
================================================================== */

export const workspace = { nome: 'Meridiano Serviços', referencia: 'meridiano', inicial: 'M' }

/** A licença é o `type` do membro. O nome na tela segue a tela de workspaces aprovada. */
export type Licenca = Member['type']

export interface Pessoa {
  id: number
  nome: string
  /** Do produto: `Member.type` (Proprietário, Full, Membro, Leitor). */
  licenca: Licenca
  /** Do produto: `Member.role`, o cargo. */
  cargo: number
  /** Do produto, por outra rota: os grupos de membros de que a pessoa faz parte. */
  grupos: string[]
  /**
   * Acrescentado pelo protótipo: convidado de projeto. Hoje o ENSPACE não tem convidado;
   * quem é de fora usa o portal de tarefa externa.
   */
  convidado?: boolean
  /** Fictício: a empresa do convidado. */
  empresa?: string
}

type CamposDoCargo = Pick<Role, 'id' | 'name' | 'description'>
export const cargos: CamposDoCargo[] = [
  { id: 1, name: 'Diretoria', description: 'Acesso a todas as categorias.' },
  { id: 2, name: 'Coordenação', description: 'Cria e edita itens das categorias da área.' },
  { id: 3, name: 'Analista', description: 'Cria e edita os próprios itens.' },
  { id: 4, name: 'Cliente externo', description: 'Sem acesso a categorias do workspace.' },
]

type CamposDoGrupo = Pick<MemberGroup, 'name' | 'members_count'> & { id: string }
export const grupos: CamposDoGrupo[] = [
  { id: 'financeiro', name: 'Financeiro', members_count: 8 },
  { id: 'juridico', name: 'Jurídico', members_count: 5 },
  { id: 'comercial', name: 'Comercial', members_count: 12 },
  { id: 'operacoes', name: 'Operações', members_count: 31 },
]

/** Membros do workspace: as 12 pessoas nomeadas e os demais membros dos grupos. */
export const MEMBROS_DO_WORKSPACE = 64

export const pessoas: Pessoa[] = [
  { id: 1, nome: 'Rita Alcântara', licenca: 'owner', cargo: 1, grupos: [] },
  { id: 2, nome: 'Caio Brandão', licenca: 'full', cargo: 1, grupos: ['operacoes'] },
  { id: 3, nome: 'Lívia Prado', licenca: 'standard', cargo: 2, grupos: ['financeiro'] },
  { id: 4, nome: 'Otávio Nunes', licenca: 'standard', cargo: 2, grupos: ['juridico'] },
  { id: 5, nome: 'Marina Toledo', licenca: 'standard', cargo: 3, grupos: ['financeiro'] },
  { id: 6, nome: 'Henrique Sales', licenca: 'standard', cargo: 3, grupos: ['comercial'] },
  { id: 7, nome: 'Júlia Ferraz', licenca: 'standard', cargo: 3, grupos: ['juridico'] },
  { id: 8, nome: 'Renato Queiroz', licenca: 'viewer', cargo: 3, grupos: ['comercial'] },
  { id: 9, nome: 'Patrícia Moura', licenca: 'standard', cargo: 3, grupos: ['operacoes'] },
  { id: 10, nome: 'Beatriz Lemos', licenca: 'viewer', cargo: 4, grupos: [], convidado: true, empresa: 'Aurora Engenharia' },
  { id: 11, nome: 'Fernando Aguiar', licenca: 'viewer', cargo: 4, grupos: [], convidado: true, empresa: 'Aurora Engenharia' },
  { id: 12, nome: 'Sofia Ramalho Albuquerque de Vasconcelos', licenca: 'standard', cargo: 3, grupos: ['comercial'] },
]

export function pessoa(id: number) {
  return pessoas.find(p => p.id === id)
}

export function iniciais(nome: string) {
  const partes = nome.split(' ').filter(Boolean)
  return ((partes[0]?.[0] ?? '') + (partes.length > 1 ? partes[partes.length - 1]![0] : '')).toUpperCase()
}

/* ==================================================================
   CATEGORIAS
================================================================== */

type CamposDaApi = Pick<ItemType, 'id' | 'name' | 'slug' | 'description' | 'icon' | 'color'>

export interface Categoria extends CamposDaApi {
  /**
   * Acrescentado pela proposta: o projeto dono da categoria. `null` é "do workspace",
   * o lugar do cadastro que vários projetos usam (clientes, fornecedores).
   */
  projeto: number | null
  /** Fictício: quantos itens a categoria tem, para o card e a lista. */
  itens: number
  /** Rodada 3: a categoria criada por um modelo guarda a de origem (campos, fluxos e mapa). */
  copiaDe?: number
}

export const categoriasBase: Categoria[] = [
  { id: 1, name: 'Clientes', slug: 'clientes', description: 'Cadastro de clientes usado por todas as áreas.', icon: 'i-lucide-building-2', color: 'info', projeto: null, itens: 412 },
  { id: 2, name: 'Fornecedores', slug: 'fornecedores', description: 'Cadastro de fornecedores homologados.', icon: 'i-lucide-truck', color: 'info', projeto: null, itens: 188 },
  { id: 3, name: 'Chamados internos', slug: 'chamados', description: 'Pedidos de qualquer pessoa para as áreas de apoio.', icon: 'i-lucide-life-buoy', color: 'neutral', projeto: null, itens: 1293 },
  { id: 4, name: 'Contas a pagar', slug: 'contas-a-pagar', description: 'Títulos a pagar, com aprovação e baixa.', icon: 'i-lucide-receipt', color: 'success', projeto: 1, itens: 2380 },
  { id: 5, name: 'Notas fiscais', slug: 'notas-fiscais', description: 'Notas de entrada e saída.', icon: 'i-lucide-file-text', color: 'success', projeto: 1, itens: 5104 },
  { id: 6, name: 'Reembolsos', slug: 'reembolsos', description: 'Pedidos de reembolso de despesas.', icon: 'i-lucide-hand-coins', color: 'success', projeto: 1, itens: 640 },
  { id: 7, name: 'Processos judiciais', slug: 'processos', description: 'Processos ativos e encerrados.', icon: 'i-lucide-scale', color: 'warning', projeto: 2, itens: 311 },
  { id: 8, name: 'Prazos processuais', slug: 'prazos', description: 'Prazos com data fatal e responsável.', icon: 'i-lucide-alarm-clock', color: 'warning', projeto: 2, itens: 977 },
  { id: 9, name: 'Pareceres', slug: 'pareceres', description: '', icon: 'i-lucide-gavel', color: 'warning', projeto: 2, itens: 84 },
  { id: 10, name: 'Oportunidades', slug: 'oportunidades', description: 'Funil de vendas da regional Sul.', icon: 'i-lucide-target', color: 'primary', projeto: 3, itens: 529 },
  { id: 11, name: 'Propostas comerciais', slug: 'propostas', description: 'Propostas enviadas e respostas.', icon: 'i-lucide-file-signature', color: 'primary', projeto: 3, itens: 203 },
  { id: 12, name: 'Medições de obra', slug: 'medicoes', description: 'Medições mensais aprovadas pelo cliente.', icon: 'i-lucide-ruler', color: 'secondary', projeto: 4, itens: 46 },
  { id: 13, name: 'Ocorrências de obra', slug: 'ocorrencias', description: 'Registro diário de ocorrências no canteiro.', icon: 'i-lucide-triangle-alert', color: 'secondary', projeto: 4, itens: 158 },
  { id: 14, name: 'Contratos', slug: 'contratos', description: 'Contratos vigentes, aditivos e renovações.', icon: 'i-lucide-file-signature', color: 'neutral', projeto: null, itens: 734 },
  { id: 15, name: 'Solicitações de compra com aprovação em duas etapas', slug: 'solicitacoes', description: 'Compras acima do limite pedem 2 aprovações.', icon: 'i-lucide-shopping-cart', color: 'neutral', projeto: null, itens: 96 },
]

/* ==================================================================
   PROJETOS (todo este bloco é proposta)
================================================================== */

/** Proposta. Aberto: todo membro vê. Fechado: aparece no diretório e entra por pedido. Privado: só quem participa sabe que existe. */
export type Visibilidade = 'aberto' | 'fechado' | 'privado'
/** Proposta. 2 papéis, para não repetir os nomes de licença (Leitor) nem os cargos. */
export type Papel = 'admin' | 'participante'
export type TipoDeParticipante = 'pessoa' | 'grupo' | 'cargo'

export interface Participante {
  tipo: TipoDeParticipante
  /** Id da pessoa ou do cargo; slug do grupo. */
  id: number | string
  papel: Papel
}

/** Proposta: o que o Participante faz em todas as categorias do projeto. As 4 caixas dos cargos. */
export interface PermissaoPadrao {
  ver: boolean
  criar: boolean
  editar: boolean
  excluir: boolean
}

export interface Tela {
  nome: string
  icone: string
}

export interface Projeto {
  id: number
  /** Do `en-projects` apagado: `reference`. */
  referencia: string
  /** Do `en-projects` apagado: `name`. */
  nome: string
  /** Do `en-projects` apagado: `description`. */
  descricao: string
  /** Inventado: ícone e cor, como a categoria tem. */
  icone: string
  cor: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  /** Do `en-projects` (`type`: open, closed), mais "privado", que a pesquisa propôs. */
  visibilidade: Visibilidade
  /** Do `en-projects` apagado: `status`. */
  status: 'ativo' | 'arquivado'
  /** Do `en-projects` apagado: `members`, com o papel acrescentado. */
  participantes: Participante[]
  /** Inventado. */
  permissaoPadrao: PermissaoPadrao
  /** Inventado: telas e painéis do projeto no menu. */
  telas: Tela[]
  /** Inventado: o administrador põe o projeto no menu de todos os participantes. */
  noMenuDeTodos: boolean
  /** Inventado. */
  criadoEm: string
  atividade: { quem: number, oque: string, quando: string }[]
  /** Inventado (rodada 3): as atualizações de status, da mais nova para a mais antiga. */
  atualizacoes: AtualizacaoDeStatus[]
}

/* ==================================================================
   STATUS DO PROJETO (proposta da rodada 3)
   Base: as status updates do GitHub Projects e o "Project overview" do Asana.
   Campos da entidade nova de projeto, sem conflito com o que existe no código.
================================================================== */

export type Situacao = 'noPrazo' | 'emRisco' | 'atrasado' | 'concluido'

export interface AtualizacaoDeStatus {
  situacao: Situacao
  inicio: string
  fim: string
  texto: string
  autor: number
  em: string
}

/**
 * Rodada 12: a referência do projeto copia o nome, como a das categorias e dos campos do ENSPACE: minúsculas, sem
 * acento, palavras ligadas por hífen. Na criação ela pode ser alterada; depois fica fixa.
 */
export function referenciaDoNome(nome: string) {
  return nome.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export const projetosBase: Projeto[] = [
  {
    id: 1,
    referencia: 'financeiro',
    nome: 'Financeiro',
    descricao: 'Contas a pagar, notas fiscais e reembolsos da matriz e das filiais.',
    icone: 'i-lucide-landmark',
    cor: 'success',
    visibilidade: 'fechado',
    status: 'ativo',
    participantes: [
      { tipo: 'pessoa', id: 3, papel: 'admin' },
      { tipo: 'grupo', id: 'financeiro', papel: 'participante' },
      { tipo: 'pessoa', id: 2, papel: 'participante' },
    ],
    permissaoPadrao: { ver: true, criar: true, editar: true, excluir: false },
    telas: [{ nome: 'Painel do Financeiro', icone: 'i-lucide-chart-column' }],
    noMenuDeTodos: true,
    criadoEm: '2026-08-04',
    atividade: [
      { quem: 5, oque: 'aprovou 12 contas a pagar', quando: 'há 2 horas' },
      { quem: 3, oque: 'adicionou o grupo Financeiro ao projeto', quando: 'há 3 dias' },
      { quem: 1, oque: 'moveu a categoria Reembolsos para o projeto', quando: 'há 1 semana' },
    ],
    atualizacoes: [
      { situacao: 'noPrazo', inicio: '2026-08-04', fim: '2026-12-31', texto: 'Fechamento de novembro em dia. As notas da filial Joinville entram até sexta-feira.', autor: 3, em: '2026-11-24' },
      { situacao: 'emRisco', inicio: '2026-08-04', fim: '2026-12-31', texto: 'Atraso na conferência das notas de outubro. Reforço de 2 pessoas na equipe.', autor: 3, em: '2026-10-27' },
    ],
  },
  {
    id: 2,
    referencia: 'juridico',
    nome: 'Jurídico',
    descricao: 'Processos, prazos e pareceres. Conteúdo sob sigilo.',
    icone: 'i-lucide-scale',
    cor: 'warning',
    visibilidade: 'privado',
    status: 'ativo',
    participantes: [
      { tipo: 'pessoa', id: 4, papel: 'admin' },
      { tipo: 'grupo', id: 'juridico', papel: 'participante' },
    ],
    permissaoPadrao: { ver: true, criar: true, editar: true, excluir: false },
    telas: [],
    noMenuDeTodos: true,
    criadoEm: '2026-08-11',
    atividade: [
      { quem: 7, oque: 'cadastrou o prazo PZ8841', quando: 'há 40 minutos' },
      { quem: 4, oque: 'mudou a visibilidade para Privado', quando: 'há 2 semanas' },
    ],
    atualizacoes: [
      { situacao: 'emRisco', inicio: '2026-08-11', fim: '2027-03-31', texto: '3 prazos fatais na próxima semana e 1 advogado de férias.', autor: 4, em: '2026-11-23' },
    ],
  },
  {
    id: 3,
    referencia: 'comercial-sul',
    nome: 'Comercial Sul',
    descricao: 'Funil e propostas da regional Sul.',
    icone: 'i-lucide-trending-up',
    cor: 'primary',
    visibilidade: 'aberto',
    status: 'ativo',
    participantes: [
      { tipo: 'pessoa', id: 6, papel: 'admin' },
      { tipo: 'grupo', id: 'comercial', papel: 'participante' },
    ],
    permissaoPadrao: { ver: true, criar: true, editar: true, excluir: false },
    telas: [{ nome: 'Metas do trimestre', icone: 'i-lucide-target' }],
    noMenuDeTodos: false,
    criadoEm: '2026-09-02',
    atividade: [
      { quem: 12, oque: 'enviou a proposta PC2290', quando: 'ontem' },
    ],
    atualizacoes: [],
  },
  {
    id: 4,
    referencia: 'obra-aurora-engenharia',
    nome: 'Obra Aurora Engenharia',
    descricao: 'Acompanhamento da obra com o cliente: medições e ocorrências.',
    icone: 'i-lucide-hard-hat',
    cor: 'secondary',
    visibilidade: 'fechado',
    status: 'ativo',
    participantes: [
      { tipo: 'pessoa', id: 9, papel: 'admin' },
      { tipo: 'pessoa', id: 2, papel: 'participante' },
      { tipo: 'pessoa', id: 10, papel: 'participante' },
      { tipo: 'pessoa', id: 11, papel: 'participante' },
    ],
    permissaoPadrao: { ver: true, criar: true, editar: false, excluir: false },
    telas: [],
    noMenuDeTodos: true,
    criadoEm: '2026-10-20',
    atividade: [
      { quem: 10, oque: 'aprovou a medição de outubro', quando: 'há 5 horas' },
      { quem: 9, oque: 'convidou Beatriz Lemos e Fernando Aguiar', quando: 'há 1 mês' },
    ],
    atualizacoes: [
      { situacao: 'atrasado', inicio: '2026-10-20', fim: '2026-12-15', texto: 'A medição de novembro depende da aprovação do cliente. A entrega da estrutura passou para 15 de janeiro.', autor: 9, em: '2026-11-25' },
    ],
  },
]

/** Cenário de volume: 57 projetos. Os 4 de cima e 53 gerados com nomes verossímeis. */
const cidades = ['Curitiba', 'Joinville', 'Londrina', 'Maringá', 'Blumenau', 'Caxias do Sul', 'Pelotas', 'Cascavel', 'Itajaí', 'Ponta Grossa', 'Chapecó', 'Florianópolis', 'Porto Alegre', 'Santa Maria']
const tipos: { prefixo: string, icone: string, cor: Projeto['cor'] }[] = [
  { prefixo: 'Obra', icone: 'i-lucide-hard-hat', cor: 'secondary' },
  { prefixo: 'Filial', icone: 'i-lucide-store', cor: 'info' },
  { prefixo: 'Cliente', icone: 'i-lucide-briefcase', cor: 'primary' },
  { prefixo: 'Contencioso', icone: 'i-lucide-scale', cor: 'warning' },
]
export const projetosVolume: Projeto[] = [
  ...projetosBase,
  ...Array.from({ length: 53 }, (_, i): Projeto => {
    const tipo = tipos[i % tipos.length]!
    const cidade = cidades[i % cidades.length]!
    const visibilidade: Visibilidade = i % 5 === 0 ? 'privado' : i % 3 === 0 ? 'aberto' : 'fechado'
    const nome = `${tipo.prefixo} ${cidade}${i >= cidades.length ? ` ${Math.floor(i / cidades.length) + 1}` : ''}`
    return {
      id: 100 + i,
      referencia: referenciaDoNome(nome),
      nome,
      descricao: '',
      icone: tipo.icone,
      cor: tipo.cor,
      visibilidade,
      status: i % 11 === 0 ? 'arquivado' : 'ativo',
      participantes: [
        { tipo: 'pessoa', id: [2, 6, 9, 3][i % 4]!, papel: 'admin' },
        ...(i % 4 === 0 ? [{ tipo: 'pessoa' as const, id: 1, papel: 'participante' as const }] : []),
        ...(i % 6 === 0 ? [{ tipo: 'pessoa' as const, id: 3, papel: 'participante' as const }] : []),
      ],
      permissaoPadrao: { ver: true, criar: true, editar: true, excluir: false },
      telas: [],
      noMenuDeTodos: false,
      criadoEm: `2026-${String(1 + (i % 10)).padStart(2, '0')}-${String(1 + (i % 27)).padStart(2, '0')}`,
      atividade: [],
      atualizacoes: i % 4 === 3
        ? []
        : [{ situacao: (['noPrazo', 'emRisco', 'atrasado', 'noPrazo', 'concluido'] as const)[i % 5]!, inicio: '2026-09-01', fim: '2027-02-28', texto: '', autor: [2, 6, 9, 3][i % 4]!, em: '2026-11-20' }],
    }
  }),
]

/* ==================================================================
   ITENS (para a lista da categoria e o campo de vínculo)
================================================================== */

export interface Vinculo {
  categoria: number
  reference: string
  /** O texto que o campo de vínculo guarda hoje (`display`), mesmo para quem não lê a categoria. */
  display: string
}

export interface ItemDeConta {
  id: number
  /** Do produto: `Item.reference`. */
  reference: string
  descricao: string
  valor: number
  vencimento: string
  status: 'Em aprovação' | 'Aprovada' | 'Paga' | 'Vencida'
  fornecedor: Vinculo
  /** O caso que a proposta resolve: vínculo com item de projeto privado. */
  processo?: Vinculo
}

export const contasAPagar: ItemDeConta[] = [
  { id: 1, reference: 'CP10422', descricao: 'Honorários periciais', valor: 18400, vencimento: '2026-12-02', status: 'Em aprovação', fornecedor: { categoria: 2, reference: 'FO0081', display: 'Perícia Técnica Andrade' }, processo: { categoria: 7, reference: 'PJ0193', display: 'Ação trabalhista 0012345 contra Meridiano' } },
  { id: 2, reference: 'CP10418', descricao: 'Locação de andaimes', valor: 7350.9, vencimento: '2026-11-28', status: 'Aprovada', fornecedor: { categoria: 2, reference: 'FO0144', display: 'Andaimes Sul Locações' } },
  { id: 3, reference: 'CP10415', descricao: 'Licenças de software', valor: 2290, vencimento: '2026-11-30', status: 'Paga', fornecedor: { categoria: 2, reference: 'FO0012', display: 'Nuvem Clara Tecnologia' } },
  { id: 4, reference: 'CP10409', descricao: 'Custas processuais', valor: 1120.45, vencimento: '2026-11-20', status: 'Vencida', fornecedor: { categoria: 2, reference: 'FO0003', display: 'Tribunal de Justiça' }, processo: { categoria: 7, reference: 'PJ0201', display: 'Execução fiscal 0098765' } },
  { id: 5, reference: 'CP10401', descricao: 'Manutenção predial da filial Joinville', valor: 5600, vencimento: '2026-12-10', status: 'Em aprovação', fornecedor: { categoria: 2, reference: 'FO0077', display: 'Predial Norte Serviços' } },
  { id: 6, reference: 'CP10396', descricao: 'Energia elétrica', valor: 3984.12, vencimento: '2026-12-05', status: 'Aprovada', fornecedor: { categoria: 2, reference: 'FO0009', display: 'Companhia de Energia' } },
  { id: 7, reference: 'CP10390', descricao: 'Material de escritório', valor: 640, vencimento: '2026-12-12', status: 'Em aprovação', fornecedor: { categoria: 2, reference: 'FO0120', display: 'Papelaria Central' } },
  { id: 8, reference: 'CP10384', descricao: 'Consultoria tributária', valor: 12000, vencimento: '2026-12-15', status: 'Aprovada', fornecedor: { categoria: 2, reference: 'FO0055', display: 'Tributo Certo Consultoria' } },
]

/* ==================================================================
   TAREFAS (a visão que cruza projetos)
================================================================== */

export interface Tarefa {
  id: number
  titulo: string
  /** A categoria do item da tarefa; o projeto sai da categoria. */
  categoria: number
  item: string
  prazo: string
  atrasada: boolean
}

export const minhasTarefas: Tarefa[] = [
  { id: 1, titulo: 'Aprovar pagamento', categoria: 4, item: 'CP10422', prazo: '2026-11-26', atrasada: false },
  { id: 2, titulo: 'Conferir nota de entrada', categoria: 5, item: 'NF88120', prazo: '2026-11-24', atrasada: true },
  { id: 3, titulo: 'Revisar parecer', categoria: 9, item: 'PA0042', prazo: '2026-11-27', atrasada: false },
  { id: 4, titulo: 'Responder ocorrência', categoria: 13, item: 'OC0158', prazo: '2026-11-25', atrasada: false },
  { id: 5, titulo: 'Atualizar cadastro', categoria: 1, item: 'CL0412', prazo: '2026-12-01', atrasada: false },
  { id: 6, titulo: 'Validar medição de novembro', categoria: 12, item: 'ME0046', prazo: '2026-11-30', atrasada: false },
  { id: 7, titulo: 'Qualificar oportunidade', categoria: 10, item: 'OP0529', prazo: '2026-11-29', atrasada: false },
]

/* ==================================================================
   ITENS DO PROJETO NUMA VISÃO SÓ (proposta da rodada 3)

   No produto, o item não tem responsável, prazo nem status nativos: são campos da categoria
   (conferência no código de 2026-11-26). Por isso a visão do projeto lê um MAPA por categoria,
   como a Agenda lê o campo de data de cada categoria: qual campo é o Responsável, o Prazo e o
   Status, e em que coluna do quadro cada valor do status entra.
   Peça nova no back-end: a leitura de itens de várias categorias numa chamada só.
================================================================== */

export type GrupoDeStatus = 'aberto' | 'andamento' | 'concluido'

/** Fictício: os campos de cada categoria que servem ao mapa. O 1º de cada lista é o padrão. */
export interface CamposDaCategoria {
  pessoa: string[]
  data: string[]
  /** O campo de status e os valores dele, na ordem do fluxo. */
  status: string
  valores: { valor: string, grupo: GrupoDeStatus }[]
  prefixo: string
  titulos: string[]
}

export const camposDaCategoria: Record<number, CamposDaCategoria> = {
  1: { pessoa: ['Gerente da conta'], data: ['Próximo contato', 'Data de cadastro'], status: 'Situação do cliente', prefixo: 'CL', titulos: ['Rede Vale Supermercados', 'Clínica Horizonte', 'Colégio Araucária'], valores: [{ valor: 'Em cadastro', grupo: 'aberto' }, { valor: 'Ativo', grupo: 'andamento' }, { valor: 'Inativo', grupo: 'concluido' }] },
  2: { pessoa: ['Comprador'], data: ['Validade da homologação'], status: 'Homologação', prefixo: 'FO', titulos: ['Aço Forte Distribuidora', 'Andaimes Litoral', 'Papelaria Central'], valores: [{ valor: 'Em análise', grupo: 'aberto' }, { valor: 'Homologado', grupo: 'concluido' }, { valor: 'Suspenso', grupo: 'aberto' }] },
  3: { pessoa: ['Atendente', 'Solicitante'], data: ['Prazo de atendimento', 'Data de abertura'], status: 'Situação do chamado', prefixo: 'CH', titulos: ['Troca de notebook', 'Acesso ao sistema fiscal', 'Reserva de sala'], valores: [{ valor: 'Novo', grupo: 'aberto' }, { valor: 'Em atendimento', grupo: 'andamento' }, { valor: 'Aguardando solicitante', grupo: 'andamento' }, { valor: 'Resolvido', grupo: 'concluido' }] },
  4: { pessoa: ['Aprovador', 'Solicitante'], data: ['Vencimento', 'Data de emissão'], status: 'Etapa do fluxo', prefixo: 'CP', titulos: ['Honorários periciais', 'Locação de andaimes', 'Licenças de software', 'Custas processuais', 'Energia elétrica'], valores: [{ valor: 'A lançar', grupo: 'aberto' }, { valor: 'Em aprovação', grupo: 'andamento' }, { valor: 'Aprovada', grupo: 'andamento' }, { valor: 'Paga', grupo: 'concluido' }] },
  5: { pessoa: ['Conferente'], data: ['Data de entrada', 'Data de emissão'], status: 'Situação', prefixo: 'NF', titulos: ['Nota de entrada 88120', 'Nota de serviço 4471', 'Nota de entrada 88133'], valores: [{ valor: 'Recebida', grupo: 'aberto' }, { valor: 'Em conferência', grupo: 'andamento' }, { valor: 'Lançada', grupo: 'concluido' }] },
  6: { pessoa: ['Aprovador', 'Solicitante'], data: [], status: 'Etapa do fluxo', prefixo: 'RE', titulos: ['Viagem a Joinville', 'Almoço com cliente', 'Combustível de outubro'], valores: [{ valor: 'Enviado', grupo: 'aberto' }, { valor: 'Em análise', grupo: 'andamento' }, { valor: 'Reembolsado', grupo: 'concluido' }] },
  7: { pessoa: ['Advogado responsável'], data: ['Próxima audiência', 'Data de distribuição'], status: 'Fase processual', prefixo: 'PJ', titulos: ['Ação trabalhista 0012345', 'Execução fiscal 0098765', 'Ação de cobrança 0045612'], valores: [{ valor: 'Inicial', grupo: 'aberto' }, { valor: 'Instrução', grupo: 'andamento' }, { valor: 'Recurso', grupo: 'andamento' }, { valor: 'Encerrado', grupo: 'concluido' }] },
  8: { pessoa: ['Responsável'], data: ['Data fatal'], status: 'Situação', prefixo: 'PZ', titulos: ['Contestação 0012345', 'Recurso ordinário 0045612', 'Manifestação 0098765'], valores: [{ valor: 'Aberto', grupo: 'aberto' }, { valor: 'Em elaboração', grupo: 'andamento' }, { valor: 'Protocolado', grupo: 'concluido' }] },
  9: { pessoa: ['Parecerista'], data: ['Entrega prevista'], status: 'Etapa do fluxo', prefixo: 'PA', titulos: ['Parecer sobre aditivo', 'Parecer tributário'], valores: [{ valor: 'Solicitado', grupo: 'aberto' }, { valor: 'Em redação', grupo: 'andamento' }, { valor: 'Entregue', grupo: 'concluido' }] },
  10: { pessoa: ['Vendedor'], data: ['Fechamento previsto'], status: 'Etapa do funil', prefixo: 'OP', titulos: ['Rede Vale Supermercados', 'Clínica Horizonte', 'Transportes Litoral', 'Colégio Araucária'], valores: [{ valor: 'Prospecção', grupo: 'aberto' }, { valor: 'Qualificada', grupo: 'andamento' }, { valor: 'Negociação', grupo: 'andamento' }, { valor: 'Ganha', grupo: 'concluido' }] },
  11: { pessoa: ['Vendedor'], data: ['Validade'], status: 'Situação', prefixo: 'PC', titulos: ['Proposta Rede Vale', 'Proposta Clínica Horizonte'], valores: [{ valor: 'Rascunho', grupo: 'aberto' }, { valor: 'Enviada', grupo: 'andamento' }, { valor: 'Aceita', grupo: 'concluido' }] },
  12: { pessoa: ['Fiscal da obra'], data: ['Data da medição'], status: 'Etapa do fluxo', prefixo: 'ME', titulos: ['Medição de outubro', 'Medição de novembro'], valores: [{ valor: 'Lançada', grupo: 'aberto' }, { valor: 'Em aprovação do cliente', grupo: 'andamento' }, { valor: 'Aprovada', grupo: 'concluido' }] },
  13: { pessoa: ['Responsável', 'Registrado por'], data: ['Prazo de solução', 'Data da ocorrência'], status: 'Situação', prefixo: 'OC', titulos: ['Infiltração no bloco B', 'Atraso na entrega de aço', 'Andaime sem guarda-corpo'], valores: [{ valor: 'Aberta', grupo: 'aberto' }, { valor: 'Em tratamento', grupo: 'andamento' }, { valor: 'Resolvida', grupo: 'concluido' }] },
}

/** O mapa de um projeto, por categoria. `null` = a categoria não entra naquela coluna. */
export interface MapaDaCategoria {
  responsavel: string | null
  prazo: string | null
  status: string | null
  grupos: Record<string, GrupoDeStatus>
}

export function mapaPadrao(categoria: number): MapaDaCategoria {
  const c = camposDaCategoria[categoria]
  if (!c) return { responsavel: null, prazo: null, status: null, grupos: {} }
  return {
    responsavel: c.pessoa[0] ?? null,
    prazo: c.data[0] ?? null,
    status: c.status,
    grupos: Object.fromEntries(c.valores.map(v => [v.valor, v.grupo])),
  }
}

export interface ItemDoProjeto {
  id: number
  categoria: number
  /** Do produto: `Item.reference`. */
  reference: string
  titulo: string
  /** Os valores dos campos, pelo nome do campo (pessoa: id; data: AAAA-MM-DD; status: valor). */
  campos: Record<string, string | number>
}

/** Quem trabalha em cada categoria, para preencher os campos de pessoa. */
const gente: Record<number, number[]> = { 4: [3, 5, 2], 5: [5, 3], 6: [3, 5], 7: [4, 7], 8: [7, 4], 9: [4], 10: [6, 12, 8], 11: [12, 6], 12: [9, 2], 13: [9, 10, 11] }
/** Prazos em volta de hoje (2026-11-26): alguns já venceram. */
const prazos = ['2026-11-24', '2026-11-27', '2026-11-30', '2026-12-04', '2026-11-21', '2026-12-10']

let idDoItem = 0
export const itensDoProjeto: ItemDoProjeto[] = Object.entries(camposDaCategoria).flatMap(([cat, c]) =>
  c.titulos.map((titulo, i): ItemDoProjeto => {
    const quem = gente[Number(cat)] ?? [1]
    const campos: Record<string, string | number> = { [c.status]: c.valores[(i + Number(cat)) % c.valores.length]!.valor }
    c.pessoa.forEach((campo, k) => { campos[campo] = quem[(i + k) % quem.length]! })
    c.data.forEach((campo, k) => { campos[campo] = prazos[(i + Number(cat) + k * 2) % prazos.length]! })
    return { id: ++idDoItem, categoria: Number(cat), reference: `${c.prefixo}${String(4200 - i * 17 + Number(cat)).padStart(4, '0')}`, titulo, campos }
  }))

/* ==================================================================
   AUTOMAÇÕES DO PROJETO (proposta da rodada 3)

   O que já existe e a página do projeto só reúne: os fluxos do Spaceflow cujo gatilho escuta
   uma categoria do projeto (`events::c_items:<slug>::<ação>`) e os avisos de prazo de cada
   categoria (`c-type-notifications`). Nenhum motor novo.
================================================================== */

export type Gatilho = 'criado' | 'atualizado' | 'excluido' | 'agendado'

export interface Fluxo {
  id: number
  /** Do produto: o nome do workflow. */
  nome: string
  /** A categoria que o gatilho escuta. */
  categoria: number
  gatilho: Gatilho
  ativo: boolean
  /** Fictício. */
  ultimaExecucao: string | null
  execucoes30d: number
}

export const fluxosBase: Fluxo[] = [
  { id: 1, nome: 'Aprovação de pagamento acima de 10 mil', categoria: 4, gatilho: 'criado', ativo: true, ultimaExecucao: '2026-11-26', execucoes30d: 214 },
  { id: 2, nome: 'Baixa automática na conciliação', categoria: 4, gatilho: 'atualizado', ativo: true, ultimaExecucao: '2026-11-25', execucoes30d: 188 },
  { id: 3, nome: 'Lançar nota no ERP', categoria: 5, gatilho: 'atualizado', ativo: false, ultimaExecucao: '2026-10-30', execucoes30d: 0 },
  { id: 4, nome: 'Reembolso aprovado avisa o solicitante', categoria: 6, gatilho: 'atualizado', ativo: true, ultimaExecucao: '2026-11-24', execucoes30d: 41 },
  { id: 5, nome: 'Prazo fatal cria tarefa para o responsável', categoria: 8, gatilho: 'criado', ativo: true, ultimaExecucao: '2026-11-26', execucoes30d: 77 },
  { id: 6, nome: 'Encerramento do processo', categoria: 7, gatilho: 'atualizado', ativo: true, ultimaExecucao: '2026-11-19', execucoes30d: 6 },
  { id: 7, nome: 'Oportunidade ganha gera proposta', categoria: 10, gatilho: 'atualizado', ativo: true, ultimaExecucao: '2026-11-25', execucoes30d: 23 },
  { id: 8, nome: 'Medição enviada ao cliente para aprovação', categoria: 12, gatilho: 'criado', ativo: true, ultimaExecucao: '2026-11-03', execucoes30d: 2 },
  { id: 9, nome: 'Ocorrência grave avisa o fiscal', categoria: 13, gatilho: 'criado', ativo: true, ultimaExecucao: '2026-11-25', execucoes30d: 19 },
]

export interface AvisoDePrazo {
  categoria: number
  /** O campo de data que o aviso lê. */
  campo: string
  diasAntes: number
  /** Quem recebe: o campo de pessoa do item. */
  quem: string
}

export const avisosBase: AvisoDePrazo[] = [
  { categoria: 4, campo: 'Vencimento', diasAntes: 3, quem: 'Aprovador' },
  { categoria: 8, campo: 'Data fatal', diasAntes: 5, quem: 'Responsável' },
  { categoria: 8, campo: 'Data fatal', diasAntes: 1, quem: 'Responsável' },
  { categoria: 13, campo: 'Prazo de solução', diasAntes: 2, quem: 'Responsável' },
]

/* ==================================================================
   MODELO DE PROJETO (proposta da rodada 3)

   No produto, o modelo é um caso de uso (Interface > Casos de uso), com o mesmo importador.
   Copia a estrutura (categorias com campos, formulários e visualizações; fluxos; avisos;
   painel; visibilidade e permissão padrão) e nunca os itens nem os participantes.
   O importador de hoje pede 3 ajustes (exportar só as categorias do projeto, apontar o gatilho
   para a categoria nova e refazer os participantes): está no DECISOES.md.
================================================================== */

export interface ModeloDeProjeto {
  id: number
  nome: string
  descricao: string
  icone: string
  cor: Projeto['cor']
  visibilidade: Visibilidade
  /** As categorias que o modelo cria, a partir das do projeto de origem. */
  categorias: { origem: number, nome: string, icone: string }[]
  fluxos: number
  avisos: number
  paineis: number
  criadoPor: number
  criadoEm: string
}

export const modelosBase: ModeloDeProjeto[] = [
  {
    id: 1,
    nome: 'Obra',
    descricao: 'Medições aprovadas pelo cliente e registro de ocorrências do canteiro.',
    icone: 'i-lucide-hard-hat',
    cor: 'secondary',
    visibilidade: 'fechado',
    categorias: [
      { origem: 12, nome: 'Medições de obra', icone: 'i-lucide-ruler' },
      { origem: 13, nome: 'Ocorrências de obra', icone: 'i-lucide-triangle-alert' },
    ],
    fluxos: 2,
    avisos: 1,
    paineis: 1,
    criadoPor: 9,
    criadoEm: '2026-11-02',
  },
  {
    id: 2,
    nome: 'Contencioso',
    descricao: 'Processos e prazos processuais, com aviso de data fatal.',
    icone: 'i-lucide-scale',
    cor: 'warning',
    visibilidade: 'privado',
    categorias: [
      { origem: 7, nome: 'Processos judiciais', icone: 'i-lucide-scale' },
      { origem: 8, nome: 'Prazos processuais', icone: 'i-lucide-alarm-clock' },
    ],
    fluxos: 2,
    avisos: 2,
    paineis: 1,
    criadoPor: 4,
    criadoEm: '2026-09-15',
  },
]

/* ==================================================================
   SEÇÃO DO WORKSPACE (casca do menu-lateral, rodada 35)
   O menu personalizado de hoje (Interface > Menus): montado pelo administrador, igual para
   todos os grupos escolhidos. A proposta acrescenta só o atalho para a categoria de projeto.
================================================================== */

export const secaoComercial = {
  telas: [
    { id: 'painel-vendas', rotulo: 'Painel de vendas', icone: 'i-lucide-chart-line', filhos: [{ id: 'metas', rotulo: 'Metas do trimestre', icone: 'i-lucide-target' }] },
    { id: 'triagem', rotulo: 'Triagem de propostas', icone: 'i-lucide-list-filter', filhos: [] as { id: string, rotulo: string, icone: string }[] },
    { id: 'minhas-req', rotulo: 'Minhas requisições', icone: 'i-lucide-inbox', filhos: [] as { id: string, rotulo: string, icone: string }[] },
  ],
  /** Proposta: atalhos para categorias de projeto. Seguem o acesso do projeto. */
  categorias: [10, 7],
}

/* ==================================================================
   RODADA 5: o que o projeto reúne pelo menu (proposta)

   - Workflows: no formato da lista do Spaceflow (área do membro): ícone, nome, versão, status
     Ativo ou Inativo, descrição, o gatilho (trigger_ref) e a data de criação (código de 2026-11-26).
   - Tarefas: as tarefas rápidas dos itens das categorias do projeto (rodada 10: a tarefa agendada,
     de workflow, saiu do protótipo de propósito). O painel de tarefas de hoje já filtra por categoria.
   - Dashboards: o painel do projeto junta os blocos do Painel de tarefas (catálogo do SDK) com os
     painéis de itens que o administrador monta, 1 categoria por painel, como na tela Paineis.
================================================================== */

export interface DetalheDoFluxo {
  descricao: string
  versao: string
  icone: string
  criadoEm: string
}

/** Fictício, no formato do card do Spaceflow. */
export const detalhesDoFluxo: Record<number, DetalheDoFluxo> = {
  1: { descricao: 'Títulos acima de 10 mil vão para a diretoria aprovar antes do pagamento.', versao: '2.1.0', icone: 'i-lucide-badge-dollar-sign', criadoEm: '2026-08-06' },
  2: { descricao: 'Marca o título como pago quando o extrato do banco confirma.', versao: '1.4.2', icone: 'i-lucide-landmark', criadoEm: '2026-08-12' },
  3: { descricao: '', versao: '0.3.0', icone: 'i-lucide-send', criadoEm: '2026-09-01' },
  4: { descricao: 'Envia e-mail ao solicitante quando o reembolso é aprovado.', versao: '1.0.1', icone: 'i-lucide-mail', criadoEm: '2026-08-20' },
  5: { descricao: 'Cria a tarefa do prazo para o advogado responsável.', versao: '3.0.0', icone: 'i-lucide-alarm-clock', criadoEm: '2026-08-11' },
  6: { descricao: '', versao: '1.0.0', icone: 'i-lucide-archive', criadoEm: '2026-08-15' },
  7: { descricao: 'Quando a oportunidade vira Ganha, cria a proposta comercial.', versao: '1.2.0', icone: 'i-lucide-file-signature', criadoEm: '2026-09-03' },
  8: { descricao: 'Manda a medição ao cliente e espera a aprovação.', versao: '1.1.0', icone: 'i-lucide-ruler', criadoEm: '2026-10-21' },
  9: { descricao: 'Ocorrência marcada como grave avisa o fiscal da obra.', versao: '1.0.0', icone: 'i-lucide-siren', criadoEm: '2026-10-22' },
}

/** Os 4 status da tarefa rápida no produto: pending (Pendente), working, blocked e completed. */
export type StatusDaTarefa = 'aberta' | 'andamento' | 'bloqueada' | 'concluida'
/** As 4 prioridades da tarefa rápida no produto: low, normal, high e urgent. */
export type Prioridade = 'urgente' | 'alta' | 'media' | 'baixa'

/** As etiquetas do workspace (no produto, as tags que a tarefa rápida já aceita). Valores inventados. */
export interface Etiqueta { id: string, nome: string, cor: 'error' | 'warning' | 'info' | 'success' | 'neutral' | 'primary' }
export const etiquetasBase: Etiqueta[] = [
  { id: 'fiscal', nome: 'Fiscal', cor: 'warning' },
  { id: 'fechamento', nome: 'Fechamento', cor: 'info' },
  { id: 'cliente', nome: 'Pedido do cliente', cor: 'primary' },
  { id: 'processo', nome: 'Processo interno', cor: 'neutral' },
  { id: 'retrabalho', nome: 'Retrabalho', cor: 'error' },
]

export interface TarefaDoProjeto {
  id: number
  titulo: string
  /** A categoria do item; o projeto sai da categoria. Null na tarefa sem item (o item é opcional no produto). */
  categoria: number | null
  /** A referência do item. A tarefa rápida liga a no máximo 1 item, e o item é opcional. */
  item: string | null
  /** Inventado (rodada 10): o projeto da tarefa sem item. A ligada a item fica no projeto da categoria. */
  projeto?: number
  responsavel: number
  prazo: string
  status: StatusDaTarefa
  prioridade: Prioridade
  criadaEm: string
  /** No produto: description. */
  descricao?: string
  /** No produto: tag_ids (en-tags). */
  etiquetas?: string[]
  /** No produto: collaborators. */
  colaboradores?: number[]
  /** Inventado (rodada 10, back-end novo): a tarefa-mãe da subtarefa. 1 nível só. */
  mae?: number
  /** O campo `points` da tarefa rápida (existe no produto): soma nas subtarefas, como no pasta-de-apontamentos. */
  pontos?: number
}

export const tarefasBase: TarefaDoProjeto[] = [
  { id: 101, titulo: 'Aprovar pagamento', categoria: 4, item: 'CP4204', responsavel: 3, prazo: '2026-11-26', status: 'aberta', prioridade: 'alta', criadaEm: '2026-11-24' },
  { id: 102, titulo: 'Aprovar pagamento', categoria: 4, item: 'CP4187', responsavel: 3, prazo: '2026-11-24', status: 'aberta', prioridade: 'urgente', etiquetas: ['cliente'], criadaEm: '2026-11-20' },
  { id: 103, titulo: 'Conferir boleto da locação', categoria: 4, item: 'CP4170', responsavel: 1, prazo: '2026-11-28', status: 'andamento', prioridade: 'media', criadaEm: '2026-11-22' },
  { id: 104, titulo: 'Anexar comprovante de pagamento', categoria: 4, item: 'CP4153', responsavel: 5, prazo: '2026-11-21', status: 'concluida', prioridade: 'baixa', criadaEm: '2026-11-18' },
  { id: 105, titulo: 'Aprovar pagamento', categoria: 4, item: 'CP4136', responsavel: 2, prazo: '2026-11-30', status: 'aberta', prioridade: 'media', criadaEm: '2026-11-25' },
  { id: 106, titulo: 'Conferir nota de entrada', categoria: 5, item: 'NF4205', responsavel: 5, prazo: '2026-11-24', status: 'aberta', prioridade: 'alta', etiquetas: ['fiscal'], descricao: 'Comparar a nota com o pedido de compra e o recebimento no estoque.', criadaEm: '2026-11-19' },
  { id: 107, titulo: 'Corrigir CFOP da nota', categoria: 5, item: 'NF4188', responsavel: 1, prazo: '2026-12-02', status: 'andamento', prioridade: 'media', etiquetas: ['fiscal', 'retrabalho'], colaboradores: [5], criadaEm: '2026-11-23' },
  { id: 108, titulo: 'Lançar nota no ERP', categoria: 5, item: 'NF4171', responsavel: 5, prazo: '2026-11-20', status: 'concluida', prioridade: 'media', criadaEm: '2026-11-12' },
  { id: 109, titulo: 'Analisar reembolso', categoria: 6, item: 'RE4206', responsavel: 3, prazo: '2026-11-27', status: 'aberta', prioridade: 'media', criadaEm: '2026-11-24' },
  { id: 110, titulo: 'Pedir nota do almoço', categoria: 6, item: 'RE4189', responsavel: 5, prazo: '2026-11-25', status: 'bloqueada', descricao: 'O restaurante ainda não emitiu a nota. Aguardando o retorno.', prioridade: 'baixa', criadaEm: '2026-11-21' },
  { id: 111, titulo: 'Analisar reembolso', categoria: 6, item: 'RE4172', responsavel: 3, prazo: '2026-11-19', status: 'concluida', prioridade: 'media', criadaEm: '2026-11-15' },
  { id: 112, titulo: 'Fechar o mês de novembro', categoria: 4, item: 'CP4119', responsavel: 2, prazo: '2026-12-04', status: 'aberta', prioridade: 'alta', etiquetas: ['fechamento'], descricao: 'Fechar o mês com o extrato conciliado, as provisões conferidas e o relatório na diretoria.', colaboradores: [3, 5], criadaEm: '2026-11-25' },
  // Rodada 10: subtarefas e tarefa sem item (inventado: a subtarefa pede back-end novo)
  { id: 113, titulo: 'Conciliar o extrato bancário', categoria: null, item: null, projeto: 1, mae: 112, pontos: 3, responsavel: 3, prazo: '2026-11-28', status: 'concluida', prioridade: 'alta', etiquetas: ['fechamento'], criadaEm: '2026-11-25' },
  { id: 114, titulo: 'Conferir as provisões', categoria: null, item: null, projeto: 1, mae: 112, pontos: 5, responsavel: 2, prazo: '2026-12-01', status: 'andamento', prioridade: 'media', etiquetas: ['fechamento'], criadaEm: '2026-11-25' },
  { id: 115, titulo: 'Enviar o relatório à diretoria', categoria: null, item: null, projeto: 1, mae: 112, pontos: 2, responsavel: 2, prazo: '2026-12-04', status: 'aberta', prioridade: 'media', criadaEm: '2026-11-25' },
  { id: 116, titulo: 'Revisar a política de reembolso', categoria: null, item: null, projeto: 1, responsavel: 1, prazo: '2026-12-10', status: 'aberta', prioridade: 'baixa', etiquetas: ['processo'], descricao: 'Atualizar o limite de refeição e o prazo para enviar a nota.', criadaEm: '2026-11-26' },
  { id: 201, titulo: 'Protocolar contestação', categoria: 8, item: 'PZ4204', responsavel: 7, prazo: '2026-11-27', status: 'andamento', prioridade: 'alta', criadaEm: '2026-11-18' },
  { id: 202, titulo: 'Revisar parecer', categoria: 9, item: 'PA4205', responsavel: 4, prazo: '2026-11-27', status: 'aberta', prioridade: 'media', criadaEm: '2026-11-22' },
  { id: 203, titulo: 'Preparar audiência', categoria: 7, item: 'PJ4203', responsavel: 4, prazo: '2026-11-23', status: 'aberta', prioridade: 'alta', criadaEm: '2026-11-16' },
  { id: 204, titulo: 'Protocolar recurso', categoria: 8, item: 'PZ4187', responsavel: 4, prazo: '2026-11-21', status: 'concluida', prioridade: 'alta', criadaEm: '2026-11-10' },
  { id: 301, titulo: 'Qualificar oportunidade', categoria: 10, item: 'OP4206', responsavel: 6, prazo: '2026-11-29', status: 'aberta', prioridade: 'media', criadaEm: '2026-11-24' },
  { id: 302, titulo: 'Enviar proposta revisada', categoria: 11, item: 'PC4207', responsavel: 12, prazo: '2026-11-25', status: 'andamento', prioridade: 'alta', criadaEm: '2026-11-20' },
  { id: 401, titulo: 'Validar medição de novembro', categoria: 12, item: 'ME4196', responsavel: 9, prazo: '2026-11-30', status: 'aberta', prioridade: 'alta', criadaEm: '2026-11-25' },
  { id: 402, titulo: 'Tratar infiltração no bloco B', categoria: 13, item: 'OC4213', responsavel: 9, prazo: '2026-11-24', status: 'andamento', prioridade: 'alta', criadaEm: '2026-11-19' },
  { id: 403, titulo: 'Instalar guarda-corpo', categoria: 13, item: 'OC4179', responsavel: 2, prazo: '2026-11-22', status: 'concluida', prioridade: 'alta', criadaEm: '2026-11-17' },
]

/** Do legado da tela Paineis: os tipos de gráfico do painel de itens. */
export type TipoDeGrafico = 'bar_chart' | 'line_chart' | 'pie_chart' | 'donut_chart' | 'area_chart' | 'funnel_chart'
/** Do legado: a função do painel de itens. */
export type FuncaoDoPainel = 'count' | 'countDistinct' | 'mean' | 'sum' | 'median' | 'variance'
/** Os blocos do catálogo do Painel de tarefas (SDK) que o painel do projeto usa. */
export type BlocoDeTarefas = 'abertas' | 'concluidas' | 'vencidas' | 'vencem7' | 'porStatus' | 'carga' | 'filaDePrazos'

export interface PainelDeItens {
  id: string
  categoria: number
  titulo: string
  tipo: TipoDeGrafico
  /** O campo de agrupamento: o status da categoria ou "Criado em" (por mês). */
  agruparPor: string
  funcao: FuncaoDoPainel
  /** O campo de data que o período lê. */
  campoDeData: string
}

export interface DashboardDoProjeto {
  id: number
  projeto: number
  nome: string
  descricao: string
  tarefas: BlocoDeTarefas[]
  itens: PainelDeItens[]
}

export const dashboardsBase: DashboardDoProjeto[] = [
  {
    id: 1,
    projeto: 1,
    nome: 'Painel do Financeiro',
    descricao: 'Tarefas e itens das 3 categorias do Financeiro.',
    tarefas: ['abertas', 'concluidas', 'vencidas', 'vencem7', 'porStatus', 'carga', 'filaDePrazos'],
    itens: [
      { id: 'i-cp-status', categoria: 4, titulo: 'Contas a pagar por etapa', tipo: 'bar_chart', agruparPor: 'Etapa do fluxo', funcao: 'count', campoDeData: 'Vencimento' },
      { id: 'i-nf-mes', categoria: 5, titulo: 'Notas fiscais por mês', tipo: 'area_chart', agruparPor: 'Criado em', funcao: 'count', campoDeData: 'Criado em' },
      { id: 'i-re-status', categoria: 6, titulo: 'Reembolsos por etapa', tipo: 'donut_chart', agruparPor: 'Etapa do fluxo', funcao: 'count', campoDeData: 'Criado em' },
    ],
  },
  {
    id: 2,
    projeto: 3,
    nome: 'Metas do trimestre',
    descricao: '',
    tarefas: ['abertas', 'vencidas', 'carga'],
    itens: [
      { id: 'i-op-funil', categoria: 10, titulo: 'Oportunidades por etapa do funil', tipo: 'funnel_chart', agruparPor: 'Etapa do funil', funcao: 'count', campoDeData: 'Criado em' },
    ],
  },
]
