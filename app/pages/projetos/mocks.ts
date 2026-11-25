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
}

export const projetosBase: Projeto[] = [
  {
    id: 1,
    referencia: 'PRJ1A2B',
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
  },
  {
    id: 2,
    referencia: 'PRJ3C4D',
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
  },
  {
    id: 3,
    referencia: 'PRJ5E6F',
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
  },
  {
    id: 4,
    referencia: 'PRJ7G8H',
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
    return {
      id: 100 + i,
      referencia: `PRJ${(9100 + i * 37).toString(16).toUpperCase()}`,
      nome: `${tipo.prefixo} ${cidade}${i >= cidades.length ? ` ${Math.floor(i / cidades.length) + 1}` : ''}`,
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
