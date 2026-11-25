/**
 * O dado da Home. Fictício, tipado pelo SDK onde o SDK tem o tipo.
 *
 * - Tarefa: `Task` do `enspace-sdk-schemas` (`GET /ws/tasks`). As tarefas de
 *   fluxo (Tarefas Agendadas) vêm de `/c-flow-item-tasks` no produto; aqui as
 *   duas ficam na mesma lista, com `origem` dizendo de onde vem.
 * - Categoria: `ItemType` (`name`, `slug`, `icon`, `color`).
 * - Item: `Item`. O título e os valores moram em `data` no produto; aqui ficam
 *   achatados em `titulo`, `valor`, `etapa`, marcados como campo de protótipo.
 * - Visualização salva: `TypeView` (as abas da tela da categoria).
 *
 * Nada aqui é dado de cliente. Pessoas, empresas e valores são inventados.
 */
import type { ItemType, Task } from '@be-enlighten/enspace-sdk-schemas'

/** Agora do protótipo: quarta, 11/11/2026, 14:30 em Brasília. */
export const AGORA = new Date('2026-11-11T17:30:00.000Z')

const HORA = 3_600_000
const DIA = 24 * HORA

/** Data relativa a AGORA, em dias (e horas), já no horário de Brasília. */
function emDias(dias: number, hora = 18) {
  const base = new Date(AGORA.getTime() + dias * DIA)
  base.setUTCHours(hora + 3, 0, 0, 0)
  return base
}

/* ------------------------------------------------------------------ *
 * Pessoas                                                              *
 * ------------------------------------------------------------------ */

export interface Pessoa {
  id: number
  nome: string
  iniciais: string
}

/** Quem está logado no protótipo. */
export const EU: Pessoa = { id: 7001, nome: 'Renata Alves', iniciais: 'RA' }

export const pessoas: Pessoa[] = [
  EU,
  { id: 7002, nome: 'Otávio Mendes', iniciais: 'OM' },
  { id: 7003, nome: 'Lívia Castro', iniciais: 'LC' },
  { id: 7004, nome: 'Paulo Henrique Siqueira Barbosa', iniciais: 'PB' },
  { id: 7005, nome: 'Jéssica Moura', iniciais: 'JM' },
]

export function pessoa(id?: number | null) {
  return pessoas.find(p => p.id === id)
}

/* ------------------------------------------------------------------ *
 * Categorias, formulários e visualizações                              *
 * ------------------------------------------------------------------ */

export type Categoria = Pick<ItemType, 'name' | 'slug' | 'icon' | 'color' | 'description'> & {
  /**
   * `singular_name` da categoria (`c-item-types`). É o que vai em "Criar <singular>".
   * Sem ele, o rótulo cai para "Criar item em <nome>".
   */
  singular?: string
  /**
   * Formulários de criação da categoria (`forms` com `type` 'all' ou 'create').
   * Com 2 ou mais, a pessoa escolhe. Com 1, ele abre direto. Sem nenhum, abre
   * o modal com todos os campos da categoria (o que o produto faz hoje).
   */
  formularios: { id: string, nome: string }[]
  /** Campo de protótipo: o membro tem acesso a esta categoria? */
  acesso: boolean
}

export const categorias: Categoria[] = [
  {
    name: 'Solicitações de compra', singular: 'solicitação de compra', slug: 'solicitacoes-de-compra', icon: 'i-lucide-shopping-cart', color: 'primary', acesso: true,
    description: 'Pedidos de material, equipamento e serviço, da cotação à aprovação.',
    formularios: [{ id: 'f-material', nome: 'Material de escritório' }, { id: 'f-equipamento', nome: 'Equipamento de TI' }, { id: 'f-servico', nome: 'Contratação de serviço' }],
  },
  {
    name: 'Contratos', singular: 'contrato', slug: 'contratos', icon: 'i-lucide-file-signature', color: 'info', acesso: true,
    description: 'Contratos e aditivos com clientes e fornecedores, até a assinatura.',
    formularios: [{ id: 'f-contrato', nome: 'Contrato novo' }, { id: 'f-aditivo', nome: 'Aditivo' }],
  },
  {
    // Sem formulário: o modal mostra todos os campos da categoria.
    name: 'Chamados de TI', singular: 'chamado', slug: 'chamados-de-ti', icon: 'i-lucide-headset', color: 'warning', acesso: true,
    description: 'Pedidos de suporte, acesso e equipamento para o time de TI.',
    formularios: [],
  },
  {
    // 1 formulário: abre direto, sem a escolha.
    name: 'Reembolsos', singular: 'reembolso', slug: 'reembolsos', icon: 'i-lucide-receipt', color: 'success', acesso: true,
    description: 'Despesas de viagem e de trabalho para reembolso.',
    formularios: [{ id: 'f-reembolso', nome: 'Despesa de viagem' }],
  },
  {
    // Sem singular cadastrado: o rótulo cai para "Criar item em Fornecedores".
    name: 'Fornecedores', slug: 'fornecedores', icon: 'i-lucide-building-2', color: 'neutral', acesso: true,
    description: 'Cadastro e homologação de fornecedores.',
    formularios: [],
  },
  {
    // Sem acesso de propósito: é o estado "sem permissão" de um widget.
    name: 'Folha de pagamento', singular: 'lançamento', slug: 'folha-de-pagamento', icon: 'i-lucide-wallet', color: 'error', acesso: false,
    description: 'Lançamentos da folha de pagamento.',
    formularios: [],
  },
]

export function categoria(slug: string) {
  return categorias.find(c => c.slug === slug)
}

/* ------------------------------------------------------------------ *
 * Itens                                                                *
 * ------------------------------------------------------------------ */

export interface Item {
  /** `Item.id` e `Item.reference`. */
  id: number
  reference: string
  categoria: string
  /** Campo de protótipo: no produto vem de `data` (o campo título da categoria). */
  titulo: string
  /** Campo de protótipo: o status do item no fluxo. */
  status: 'aberto' | 'andamento' | 'concluido'
  /** Campo de protótipo: a etapa atual do fluxo da categoria. */
  etapa: string
  responsavel: number
  /** Campo de protótipo: um campo de valor da categoria, em reais. */
  valor?: number
  /** Campo de protótipo: um campo de data da categoria (vigência, vencimento). */
  prazo?: number
  urgente?: boolean
  criadoEm: number
}

let proximoId = 23140
function item(dados: Omit<Item, 'id' | 'reference'>): Item {
  proximoId += 7
  return { id: proximoId, reference: `#${proximoId}`, ...dados }
}

export const itensIniciais: Item[] = [
  item({ categoria: 'solicitacoes-de-compra', titulo: 'Notebooks para o time de atendimento', status: 'andamento', etapa: 'Aprovação', responsavel: 7001, valor: 48900, criadoEm: emDias(-2).getTime() }),
  item({ categoria: 'solicitacoes-de-compra', titulo: 'Cadeiras ergonômicas, filial Campinas', status: 'aberto', etapa: 'Cotação', responsavel: 7002, valor: 12750, criadoEm: emDias(-1).getTime() }),
  item({ categoria: 'solicitacoes-de-compra', titulo: 'Licenças do software de design para o marketing, renovação anual com 14 assentos', status: 'andamento', etapa: 'Aprovação', responsavel: 7001, valor: 22400, criadoEm: emDias(-5).getTime() }),
  item({ categoria: 'solicitacoes-de-compra', titulo: 'Material de escritório de novembro', status: 'aberto', etapa: 'Triagem', responsavel: 7003, valor: 1830.5, criadoEm: emDias(0, 9).getTime() }),
  item({ categoria: 'solicitacoes-de-compra', titulo: 'Projetor para a sala de reunião 3', status: 'andamento', etapa: 'Compra', responsavel: 7005, valor: 6120, criadoEm: emDias(-8).getTime() }),
  item({ categoria: 'solicitacoes-de-compra', titulo: 'Uniformes da equipe de campo', status: 'concluido', etapa: 'Entregue', responsavel: 7002, valor: 9400, criadoEm: emDias(-20).getTime() }),
  item({ categoria: 'solicitacoes-de-compra', titulo: 'Monitor extra para a controladoria', status: 'aberto', etapa: 'Triagem', responsavel: 7001, valor: 2190, criadoEm: emDias(-3).getTime() }),
  item({ categoria: 'contratos', titulo: 'Prestação de serviços de limpeza, Lumen Facilities', status: 'andamento', etapa: 'Vigente', responsavel: 7004, valor: 186000, prazo: emDias(12).getTime(), criadoEm: emDias(-300).getTime() }),
  item({ categoria: 'contratos', titulo: 'Locação do galpão de Jundiaí', status: 'andamento', etapa: 'Renovação', responsavel: 7001, valor: 420000, prazo: emDias(28).getTime(), criadoEm: emDias(-700).getTime() }),
  item({ categoria: 'contratos', titulo: 'Suporte de TI, Atria Sistemas', status: 'andamento', etapa: 'Vigente', responsavel: 7003, valor: 96000, prazo: emDias(140).getTime(), criadoEm: emDias(-200).getTime() }),
  item({ categoria: 'contratos', titulo: 'NDA com a Vértice Consultoria', status: 'aberto', etapa: 'Assinatura', responsavel: 7001, prazo: emDias(4).getTime(), criadoEm: emDias(-4).getTime() }),
  item({ categoria: 'chamados-de-ti', titulo: 'VPN cai a cada 10 minutos no home office', status: 'aberto', etapa: 'Fila', responsavel: 7005, urgente: true, criadoEm: emDias(0, 10).getTime() }),
  item({ categoria: 'chamados-de-ti', titulo: 'Acesso ao sistema fiscal para nova analista', status: 'andamento', etapa: 'Atendimento', responsavel: 7005, criadoEm: emDias(-1).getTime() }),
  item({ categoria: 'chamados-de-ti', titulo: 'Impressora do 2º andar sem toner', status: 'aberto', etapa: 'Fila', responsavel: 7002, criadoEm: emDias(-2).getTime() }),
  item({ categoria: 'chamados-de-ti', titulo: 'E-mail não sincroniza no celular', status: 'concluido', etapa: 'Resolvido', responsavel: 7005, criadoEm: emDias(-6).getTime() }),
  item({ categoria: 'chamados-de-ti', titulo: 'Troca de senha bloqueada após 3 tentativas', status: 'aberto', etapa: 'Fila', responsavel: 7005, urgente: true, criadoEm: emDias(-1, 15).getTime() }),
  item({ categoria: 'reembolsos', titulo: 'Viagem a Curitiba, visita ao cliente', status: 'aberto', etapa: 'Conferência', responsavel: 7001, valor: 1284.9, criadoEm: emDias(-3).getTime() }),
  item({ categoria: 'reembolsos', titulo: 'Almoço com fornecedor', status: 'andamento', etapa: 'Pagamento', responsavel: 7004, valor: 186, criadoEm: emDias(-7).getTime() }),
  item({ categoria: 'reembolsos', titulo: 'Curso de Excel avançado', status: 'aberto', etapa: 'Conferência', responsavel: 7003, valor: 690, criadoEm: emDias(-1).getTime() }),
  item({ categoria: 'fornecedores', titulo: 'Lumen Facilities', status: 'concluido', etapa: 'Homologado', responsavel: 7004, criadoEm: emDias(-400).getTime() }),
  item({ categoria: 'fornecedores', titulo: 'Atria Sistemas', status: 'concluido', etapa: 'Homologado', responsavel: 7003, criadoEm: emDias(-210).getTime() }),
  item({ categoria: 'fornecedores', titulo: 'Papelaria Bom Traço', status: 'andamento', etapa: 'Documentação', responsavel: 7002, criadoEm: emDias(-9).getTime() }),
]

/* ------------------------------------------------------------------ *
 * Tarefas                                                              *
 * ------------------------------------------------------------------ */

export type TarefaDaHome = Pick<Task, 'name' | 'status' | 'priority' | 'assigned_to' | 'creator'> & {
  /** `Task.id` e `Task.reference`. */
  id: number
  reference: string
  due_date: Date | null
  /** Campo de protótipo: rápida (`/ws/tasks`) ou agendada, do fluxo da categoria (`/c-flow-item-tasks`). */
  origem: 'rapida' | 'agendada'
  /** Campo de protótipo: o item da tarefa agendada, para o "#ref · Categoria". */
  item?: { reference: string, categoria: string }
}

let proximaTarefa = 13180
function tarefa(dados: Omit<TarefaDaHome, 'id' | 'reference' | 'status' | 'creator'> & { status?: TarefaDaHome['status'], creator?: number }): TarefaDaHome {
  proximaTarefa += 3
  return { id: proximaTarefa, reference: `#${proximaTarefa}`, status: 'pending', creator: EU.id, ...dados }
}

export const tarefasIniciais: TarefaDaHome[] = [
  // Em atraso
  tarefa({ name: 'Aprovar a compra dos notebooks do atendimento', origem: 'agendada', priority: 'high', due_date: emDias(-2, 12), assigned_to: 7001, item: { reference: '#23147', categoria: 'solicitacoes-de-compra' } }),
  tarefa({ name: 'Revisar resposta ao cliente sobre o chamado de acesso', origem: 'rapida', priority: 'high', due_date: emDias(-9, 17), assigned_to: 7001 }),
  tarefa({ name: 'Conferir notas do reembolso de Curitiba', origem: 'agendada', priority: 'normal', due_date: emDias(-1, 18), assigned_to: 7001, item: { reference: '#23259', categoria: 'reembolsos' } }),
  // Hoje
  tarefa({ name: 'Assinar o NDA da Vértice Consultoria', origem: 'agendada', priority: 'urgent', due_date: emDias(0, 16), assigned_to: 7001, item: { reference: '#23217', categoria: 'contratos' } }),
  tarefa({ name: 'Enviar a pauta da reunião de compras', origem: 'rapida', priority: 'normal', due_date: emDias(0, 17), assigned_to: 7001, status: 'working' }),
  tarefa({ name: 'Ligar para a Lumen sobre o reajuste', origem: 'rapida', priority: 'low', due_date: emDias(0, 18), assigned_to: 7001, status: 'blocked' }),
  // Próximas
  tarefa({ name: 'Negociar a renovação do galpão de Jundiaí', origem: 'agendada', priority: 'high', due_date: emDias(2, 15), assigned_to: 7001, item: { reference: '#23203', categoria: 'contratos' } }),
  tarefa({ name: 'Cotar 3 fornecedores de cadeiras', origem: 'agendada', priority: 'normal', due_date: emDias(3, 12), assigned_to: 7001, item: { reference: '#23154', categoria: 'solicitacoes-de-compra' } }),
  tarefa({ name: 'Atualizar a planilha de orçamento do trimestre com os números de outubro e as projeções revisadas', origem: 'rapida', priority: 'normal', due_date: emDias(5, 18), assigned_to: 7001 }),
  tarefa({ name: 'Preparar o relatório mensal de compras', origem: 'rapida', priority: 'low', due_date: emDias(8, 18), assigned_to: 7001 }),
  // Sem prazo
  tarefa({ name: 'Organizar a pasta de contratos antigos', origem: 'rapida', priority: 'low', due_date: null, assigned_to: 7001 }),
  tarefa({ name: 'Ler a política nova de viagens', origem: 'rapida', priority: 'normal', due_date: null, assigned_to: 7001 }),
  // Que eu deleguei
  tarefa({ name: 'Enviar a minuta revisada do contrato de limpeza', origem: 'rapida', priority: 'high', due_date: emDias(-1, 18), assigned_to: 7004 }),
  tarefa({ name: 'Homologar a Papelaria Bom Traço', origem: 'agendada', priority: 'normal', due_date: emDias(3, 18), assigned_to: 7002, item: { reference: '#23294', categoria: 'fornecedores' } }),
  tarefa({ name: 'Instalar o projetor da sala 3', origem: 'rapida', priority: 'normal', due_date: emDias(6, 18), assigned_to: 7005 }),
  // De outras pessoas, para a Saúde dos prazos do workspace
  tarefa({ name: 'Resolver a VPN do home office', origem: 'agendada', priority: 'urgent', due_date: emDias(-1, 12), assigned_to: 7005, creator: 7002 }),
  tarefa({ name: 'Trocar o toner do 2º andar', origem: 'agendada', priority: 'low', due_date: emDias(1, 12), assigned_to: 7002, creator: 7003, status: 'blocked' }),
  tarefa({ name: 'Pagar o reembolso do almoço', origem: 'agendada', priority: 'normal', due_date: emDias(-4, 12), assigned_to: 7004, creator: 7004 }),
  tarefa({ name: 'Conferir a vigência dos contratos de TI', origem: 'rapida', priority: 'normal', due_date: emDias(10, 12), assigned_to: 7003, creator: 7003 }),
  // Rodada 5: mais fila de outras pessoas, para a Carga por responsável e as listas do workspace.
  tarefa({ name: 'Liberar o acesso ao sistema fiscal da nova analista', origem: 'agendada', priority: 'high', due_date: emDias(0, 20), assigned_to: 7005, creator: 7002, status: 'working' }),
  tarefa({ name: 'Cotar o seguro da frota', origem: 'rapida', priority: 'urgent', due_date: emDias(-12, 12), assigned_to: 7002, creator: 7004 }),
  tarefa({ name: 'Revisar o fluxo de aprovação de compras', origem: 'rapida', priority: 'normal', due_date: emDias(4, 12), assigned_to: 7003, creator: 7001 }),
  tarefa({ name: 'Fechar a conciliação de outubro', origem: 'agendada', priority: 'high', due_date: emDias(1, 9), assigned_to: 7004, creator: 7003 }),
  tarefa({ name: 'Responder a auditoria interna sobre contratos', origem: 'rapida', priority: 'high', due_date: null, assigned_to: 7003, creator: 7004, status: 'working' }),
  tarefa({ name: 'Atualizar o cadastro da Atria Sistemas', origem: 'agendada', priority: 'low', due_date: emDias(6, 12), assigned_to: 7002, creator: 7002 }),
]

/* ------------------------------------------------------------------ *
 * Série diária de tarefas (rodada 5)                                   *
 * ------------------------------------------------------------------ */

/**
 * Criadas e concluídas por dia, dos últimos 28 dias até hoje. Campo de
 * protótipo: no produto, o SDK pede a série agregada ao servidor (a lâmina
 * "Entrada e saída" e as curvas dos cartões de número). As "abertas" de cada
 * dia se reconstroem de trás para a frente a partir das abertas de hoje.
 */
export interface DiaDeTarefas {
  data: Date
  criadas: number
  concluidas: number
}

function serieDeTarefas(semente: number, escala: number): DiaDeTarefas[] {
  let s = semente
  const sortear = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  return Array.from({ length: 28 }, (_, i) => {
    const data = emDias(i - 27, 12)
    const fimDeSemana = [0, 6].includes(data.getUTCDay())
    const peso = fimDeSemana ? 0.15 : 1
    return {
      data,
      criadas: Math.round(sortear() * 4 * escala * peso),
      concluidas: Math.round(sortear() * 4 * escala * peso),
    }
  })
}

export const serieDasTarefas = {
  minhas: serieDeTarefas(17, 1),
  workspace: serieDeTarefas(41, 3),
}

/* ------------------------------------------------------------------ *
 * Agenda, recentes, painéis, comunicado                                *
 * ------------------------------------------------------------------ */

export interface Evento {
  id: string
  titulo: string
  inicio: Date
  fim: Date
  /** De onde vem, como nas fontes da Agenda: tarefa, item ou calendário conectado. */
  fonte: 'tarefa' | 'item' | 'calendario'
}

/**
 * Os compromissos do calendário conectado (Outlook), de 1/11 a 31/12. A
 * Compromissos do dia, a da semana e a do mês somam a eles os prazos das tarefas e
 * as datas dos itens, que vêm do dado da Home (index.vue, `agendaCompleta`).
 *
 * Rodada 6: era a lista fixa de hoje (`eventosDeHoje`); virou o calendário do
 * período para a semana e o mês terem o que mostrar.
 */
export const eventosDoCalendario: Evento[] = (() => {
  const lista: Evento[] = []
  // AGORA é quarta: o dia da semana de AGORA + n é (3 + n) % 7.
  for (let n = -10; n <= 50; n++) {
    const semana = ((3 + n) % 7 + 7) % 7
    if (semana === 3) {
      lista.push({ id: `c-compras-${n}`, titulo: 'Reunião de compras', inicio: emDias(n, 9), fim: emDias(n, 10), fonte: 'calendario' })
      lista.push({ id: `c-otavio-${n}`, titulo: '1:1 com Otávio', inicio: emDias(n, 15), fim: emDias(n, 15.5), fonte: 'calendario' })
    }
    if (semana === 1) lista.push({ id: `c-comite-${n}`, titulo: 'Comitê de contratos', inicio: emDias(n, 14), fim: emDias(n, 15), fonte: 'calendario' })
    if (semana === 5) lista.push({ id: `c-revisao-${n}`, titulo: 'Revisão da semana com o time', inicio: emDias(n, 16), fim: emDias(n, 16.5), fonte: 'calendario' })
  }
  lista.push(
    { id: 'c-almoco', titulo: 'Almoço com a Atria Sistemas', inicio: emDias(2, 12), fim: emDias(2, 13.5), fonte: 'calendario' },
    { id: 'c-treinamento', titulo: 'Treinamento do ENSPACE para a filial', inicio: emDias(7, 10), fim: emDias(7, 11), fonte: 'calendario' },
    { id: 'c-auditoria', titulo: 'Visita da auditoria externa', inicio: emDias(13, 9), fim: emDias(13, 17), fonte: 'calendario' },
    { id: 'c-fechamento', titulo: 'Fechamento de novembro', inicio: emDias(19, 10), fim: emDias(19, 11), fonte: 'calendario' },
  )
  return lista
})()

export interface Recente {
  id: string
  tipo: 'item' | 'visualizacao' | 'tela' | 'formulario'
  nome: string
  onde: string
  icone: string
  /** Minutos atrás. */
  ha: number
}

export const recentes: Recente[] = [
  { id: 'r1', tipo: 'item', nome: 'Notebooks para o time de atendimento', onde: 'Solicitações de compra · #23147', icone: 'i-lucide-shopping-cart', ha: 12 },
  { id: 'r2', tipo: 'visualizacao', nome: 'Contratos vencendo', onde: 'Contratos', icone: 'i-lucide-file-signature', ha: 48 },
  { id: 'r3', tipo: 'item', nome: 'Locação do galpão de Jundiaí', onde: 'Contratos · #23203', icone: 'i-lucide-file-signature', ha: 95 },
  { id: 'r4', tipo: 'tela', nome: 'Painel de tarefas', onde: 'Tarefas', icone: 'i-lucide-chart-column', ha: 180 },
  { id: 'r5', tipo: 'item', nome: 'Viagem a Curitiba, visita ao cliente', onde: 'Reembolsos · #23259', icone: 'i-lucide-receipt', ha: 1440 },
  { id: 'r6', tipo: 'item', nome: 'VPN cai a cada 10 minutos no home office', onde: 'Chamados de TI · #23224', icone: 'i-lucide-headset', ha: 1500 },
]

export interface Atalho {
  id: string
  nome: string
  icone: string
  /** Onde leva, para o rótulo de baixo. */
  onde: string
  tipo: 'visualizacao' | 'tela' | 'link'
}

export const atalhosIniciais: Atalho[] = [
  { id: 'a1', nome: 'Pedidos em aberto', icone: 'i-lucide-shopping-cart', onde: 'Solicitações de compra', tipo: 'visualizacao' },
  { id: 'a2', nome: 'Contratos vencendo', icone: 'i-lucide-file-signature', onde: 'Contratos', tipo: 'visualizacao' },
  { id: 'a3', nome: 'Chamados abertos', icone: 'i-lucide-headset', onde: 'Chamados de TI', tipo: 'visualizacao' },
  { id: 'a4', nome: 'Painel de tarefas', icone: 'i-lucide-chart-column', onde: 'Tarefas', tipo: 'tela' },
  { id: 'a5', nome: 'Agenda', icone: 'i-lucide-calendar-days', onde: 'Menu', tipo: 'tela' },
  { id: 'a6', nome: 'Política de compras', icone: 'i-lucide-link', onde: 'intranet.exemplo.com.br', tipo: 'link' },
]

/** O que mais dá para fixar no widget Atalhos (o "Escolher atalhos"). */
export const atalhosDisponiveis: Atalho[] = [
  ...atalhosIniciais,
  { id: 'a7', nome: 'Urgentes da semana', icone: 'i-lucide-headset', onde: 'Chamados de TI', tipo: 'visualizacao' },
  { id: 'a8', nome: 'Reembolsos pendentes', icone: 'i-lucide-receipt', onde: 'Reembolsos', tipo: 'visualizacao' },
  { id: 'a9', nome: 'Meus pedidos', icone: 'i-lucide-shopping-cart', onde: 'Solicitações de compra', tipo: 'visualizacao' },
  { id: 'a10', nome: 'Agentes de IA', icone: 'i-lucide-bot', onde: 'Configurações', tipo: 'tela' },
]

/** Um painel da Interface (tela do tipo Dashboard), para o widget "Gráfico de um painel". */
export const painelDeCompras = {
  nome: 'Compras por mês',
  tela: 'Painéis de compras',
  meses: ['jun', 'jul', 'ago', 'set', 'out', 'nov'],
  valores: [38, 52, 47, 61, 58, 24],
}

export const comunicadoInicial = {
  titulo: 'Fechamento de novembro',
  texto: 'Os pedidos de compra de novembro entram até o dia 24. Reembolsos com nota de outubro precisam chegar até sexta.',
  autor: 'Otávio Mendes',
  /** Dias atrás. */
  ha: 1,
}

export const notaInicial = 'Ligar para a Atria antes da renovação.\nConferir o aditivo do galpão com o jurídico.'

/** O texto do BENI é maquete: no produto, sai do agente de IA do workspace. */
export const resumoDoBeni = {
  linhas: [
    { icone: 'i-lucide-alarm-clock', texto: '3 tarefas suas estão em atraso. A mais antiga venceu há 9 dias.' },
    { icone: 'i-lucide-file-signature', texto: 'O NDA da Vértice vence hoje às 16h e ainda não tem assinatura.' },
    { icone: 'i-lucide-shopping-cart', texto: '2 pedidos de compra seus esperam aprovação, somando R$ 71.300,00.' },
  ],
}

/* ---------------------------------------------------------------------------
 * IA (rodada 7). A forma vem do que o back já guarda (develop, 2026-11-24):
 * - agente: `ai_agent` (`name`, `slug`, `description`, `type`, `status`,
 *   `beniTheme`), lido por `GET /ai/agents`, que junta os do sistema e os do
 *   workspace;
 * - revisão: `ai_review_session` (`status` pending, in_progress, completed,
 *   failed), por `GET /ai/review/sessions` e `/ai/review/stats`;
 * - créditos: a carteira do workspace (`GET /ws/financial/wallet`) e o extrato
 *   (`/ws/financial/wallets/:id/transactions`);
 * - falha: execução de nó do Spaceflow com `status` error (`GET /workflows/nodes`),
 *   que se repete por `POST /workflows/nodes/:id/retry`.
 * Os valores são inventados.
 * ------------------------------------------------------------------------- */

export interface AgenteDeIA {
  slug: string
  nome: string
  descricao: string
  /** Cor do corpo do BENI (`beniTheme.colors.body`). */
  cor: string
  /** `source: 'system'`: BENI e BENI BUILDER. */
  sistema?: boolean
  tipo: 'chat' | 'reviewer'
}

export const agentesDeIA: AgenteDeIA[] = [
  { slug: 'beni', nome: 'BENI', descricao: 'O assistente do workspace: cria itens e tarefas e responde dúvidas.', cor: '#60a5fa', sistema: true, tipo: 'chat' },
  { slug: 'analista-de-contratos', nome: 'Analista de contratos', descricao: 'Revisa contratos e aditivos pelo manual jurídico da empresa.', cor: '#34d399', tipo: 'reviewer' },
  { slug: 'triagem-de-chamados', nome: 'Triagem de chamados', descricao: 'Classifica o chamado de TI e sugere a prioridade e o responsável.', cor: '#fbbf24', tipo: 'chat' },
  { slug: 'conferente-de-reembolsos', nome: 'Conferente de reembolsos', descricao: 'Confere a nota e o valor do reembolso pela política de viagens.', cor: '#a78bfa', tipo: 'chat' },
]

export interface RevisaoDeIA {
  id: string
  documento: string
  /** A referência do item de onde veio o documento. */
  item: string
  manual: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  /** De 0 a 100, só na concluída. */
  nota?: number
  /** Achados de severidade alta, só na concluída. */
  achadosAltos?: number
  em: number
}

export const revisoesDeIA: RevisaoDeIA[] = [
  { id: 'rv-1', documento: 'NDA com a Vértice Consultoria', item: '#23217', manual: 'Revisão de NDA', status: 'in_progress', em: AGORA.getTime() - 12 * 60_000 },
  { id: 'rv-2', documento: 'Aditivo da locação do galpão de Jundiaí', item: '#23203', manual: 'Revisão de aditivo', status: 'completed', nota: 64, achadosAltos: 2, em: AGORA.getTime() - 3 * HORA },
  { id: 'rv-3', documento: 'Prestação de serviços de limpeza, Lumen Facilities', item: '#23196', manual: 'Contrato de serviço', status: 'completed', nota: 88, achadosAltos: 0, em: AGORA.getTime() - DIA },
  { id: 'rv-4', documento: 'Licença do software de design', item: '#23142', manual: 'Contrato de software', status: 'failed', em: AGORA.getTime() - 2 * DIA },
  { id: 'rv-5', documento: 'Contrato de manutenção dos elevadores', item: '#23121', manual: 'Contrato de serviço', status: 'pending', em: AGORA.getTime() - 5 * 60_000 },
]

/** A carteira de IA do workspace. Consumo diário dos últimos 30 dias, em créditos. */
export const carteiraDeIA = {
  saldo: 18_400,
  consumoPorDia: [420, 380, 510, 0, 0, 640, 590, 610, 700, 480, 0, 0, 720, 810, 760, 690, 830, 0, 0, 880, 910, 850, 940, 870, 0, 0, 990, 1020, 960, 1050],
}

export interface FalhaDeAgente {
  id: string
  agente: string
  fluxo: string
  item: string
  erro: string
  em: number
}

export const falhasDeAgentes: FalhaDeAgente[] = [
  { id: 'nx-1', agente: 'triagem-de-chamados', fluxo: 'Triagem de chamados de TI', item: '#23224', erro: 'O agente passou do limite de 10 passos.', em: AGORA.getTime() - 40 * 60_000 },
  { id: 'nx-2', agente: 'conferente-de-reembolsos', fluxo: 'Conferência de reembolso', item: '#23259', erro: 'O anexo da nota não abriu (arquivo protegido por senha).', em: AGORA.getTime() - 5 * HORA },
]

export { DIA, HORA }
