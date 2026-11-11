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

export type Categoria = Pick<ItemType, 'name' | 'slug' | 'icon' | 'color'> & {
  /** Formulários da categoria, como aparecem no menu dentro dela. */
  formularios: { id: string, nome: string }[]
  /** Campo de protótipo: o membro tem acesso a esta categoria? */
  acesso: boolean
}

export const categorias: Categoria[] = [
  {
    name: 'Solicitações de compra', slug: 'solicitacoes-de-compra', icon: 'i-lucide-shopping-cart', color: 'primary', acesso: true,
    formularios: [{ id: 'f-compra', nome: 'Pedir compra' }, { id: 'f-compra-urgente', nome: 'Compra urgente' }],
  },
  {
    name: 'Contratos', slug: 'contratos', icon: 'i-lucide-file-signature', color: 'info', acesso: true,
    formularios: [{ id: 'f-contrato', nome: 'Novo contrato' }, { id: 'f-aditivo', nome: 'Aditivo de contrato' }],
  },
  {
    name: 'Chamados de TI', slug: 'chamados-de-ti', icon: 'i-lucide-headset', color: 'warning', acesso: true,
    formularios: [{ id: 'f-chamado', nome: 'Abrir chamado' }],
  },
  {
    name: 'Reembolsos', slug: 'reembolsos', icon: 'i-lucide-receipt', color: 'success', acesso: true,
    formularios: [{ id: 'f-reembolso', nome: 'Pedir reembolso' }],
  },
  {
    name: 'Fornecedores', slug: 'fornecedores', icon: 'i-lucide-building-2', color: 'neutral', acesso: true,
    formularios: [{ id: 'f-fornecedor', nome: 'Cadastrar fornecedor' }],
  },
  {
    // Sem acesso de propósito: é o estado "sem permissão" de um widget.
    name: 'Folha de pagamento', slug: 'folha-de-pagamento', icon: 'i-lucide-wallet', color: 'error', acesso: false,
    formularios: [],
  },
]

export function categoria(slug: string) {
  return categorias.find(c => c.slug === slug)
}

/**
 * Visualização salva da categoria: as abas da tela de itens ("Pedidos em
 * aberto", "Urgentes da semana"). O `filtro` é do protótipo: no produto, a
 * visualização guarda o filtro, as colunas e a ordem (`TypeView`).
 */
export interface Visualizacao {
  id: string
  categoria: string
  nome: string
  filtro: (i: Item) => boolean
}

export const visualizacoes: Visualizacao[] = [
  { id: 'v-compras-abertas', categoria: 'solicitacoes-de-compra', nome: 'Pedidos em aberto', filtro: i => i.status !== 'concluido' },
  { id: 'v-compras-minhas', categoria: 'solicitacoes-de-compra', nome: 'Meus pedidos', filtro: i => i.responsavel === EU.id },
  { id: 'v-compras-aprovacao', categoria: 'solicitacoes-de-compra', nome: 'Aguardando aprovação', filtro: i => i.etapa === 'Aprovação' },
  { id: 'v-contratos-vencendo', categoria: 'contratos', nome: 'Contratos vencendo', filtro: i => i.status !== 'concluido' && (i.prazo ?? Infinity) < emDias(45).getTime() },
  { id: 'v-contratos-todos', categoria: 'contratos', nome: 'Todos', filtro: () => true },
  { id: 'v-chamados-abertos', categoria: 'chamados-de-ti', nome: 'Chamados abertos', filtro: i => i.status !== 'concluido' },
  { id: 'v-chamados-urgentes', categoria: 'chamados-de-ti', nome: 'Urgentes da semana', filtro: i => i.status !== 'concluido' && i.urgente === true },
  { id: 'v-reembolsos-pendentes', categoria: 'reembolsos', nome: 'Reembolsos pendentes', filtro: i => i.status !== 'concluido' },
  { id: 'v-fornecedores-todos', categoria: 'fornecedores', nome: 'Todos', filtro: () => true },
  { id: 'v-folha', categoria: 'folha-de-pagamento', nome: 'Lançamentos do mês', filtro: () => true },
]

export function visualizacao(id: string) {
  return visualizacoes.find(v => v.id === id)
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
  tarefa({ name: 'Ligar para a Lumen sobre o reajuste', origem: 'rapida', priority: 'low', due_date: emDias(0, 18), assigned_to: 7001 }),
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
  tarefa({ name: 'Trocar o toner do 2º andar', origem: 'agendada', priority: 'low', due_date: emDias(1, 12), assigned_to: 7002, creator: 7003 }),
  tarefa({ name: 'Pagar o reembolso do almoço', origem: 'agendada', priority: 'normal', due_date: emDias(-4, 12), assigned_to: 7004, creator: 7004 }),
  tarefa({ name: 'Conferir a vigência dos contratos de TI', origem: 'rapida', priority: 'normal', due_date: emDias(10, 12), assigned_to: 7003, creator: 7003 }),
]

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

export const eventosDeHoje: Evento[] = [
  { id: 'e1', titulo: 'Reunião de compras', inicio: emDias(0, 9), fim: emDias(0, 10), fonte: 'calendario' },
  { id: 'e2', titulo: 'Assinar o NDA da Vértice Consultoria', inicio: emDias(0, 16), fim: emDias(0, 16), fonte: 'tarefa' },
  { id: 'e3', titulo: '1:1 com Otávio', inicio: emDias(0, 15), fim: emDias(0, 15.5), fonte: 'calendario' },
  { id: 'e4', titulo: 'Vigência: Prestação de serviços de limpeza', inicio: emDias(0, 18), fim: emDias(0, 18), fonte: 'item' },
]

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
  { id: 'r5', tipo: 'formulario', nome: 'Pedir reembolso', onde: 'Reembolsos', icone: 'i-lucide-receipt', ha: 1440 },
  { id: 'r6', tipo: 'item', nome: 'VPN cai a cada 10 minutos no home office', onde: 'Chamados de TI · #23224', icone: 'i-lucide-headset', ha: 1500 },
]

export interface Atalho {
  id: string
  nome: string
  icone: string
  /** Onde leva, para o rótulo de baixo. */
  onde: string
  tipo: 'categoria' | 'visualizacao' | 'formulario' | 'tela' | 'link'
}

export const atalhosIniciais: Atalho[] = [
  { id: 'a1', nome: 'Pedidos em aberto', icone: 'i-lucide-shopping-cart', onde: 'Solicitações de compra', tipo: 'visualizacao' },
  { id: 'a2', nome: 'Contratos', icone: 'i-lucide-file-signature', onde: 'Menu Categorias', tipo: 'categoria' },
  { id: 'a3', nome: 'Abrir chamado', icone: 'i-lucide-headset', onde: 'Chamados de TI', tipo: 'formulario' },
  { id: 'a4', nome: 'Painel de tarefas', icone: 'i-lucide-chart-column', onde: 'Tarefas', tipo: 'tela' },
  { id: 'a5', nome: 'Agenda', icone: 'i-lucide-calendar-days', onde: 'Menu', tipo: 'tela' },
  { id: 'a6', nome: 'Política de compras', icone: 'i-lucide-link', onde: 'intranet.exemplo.com.br', tipo: 'link' },
]

/** O que mais dá para fixar no widget Atalhos (o "Escolher atalhos"). */
export const atalhosDisponiveis: Atalho[] = [
  ...atalhosIniciais,
  { id: 'a7', nome: 'Urgentes da semana', icone: 'i-lucide-headset', onde: 'Chamados de TI', tipo: 'visualizacao' },
  { id: 'a8', nome: 'Pedir reembolso', icone: 'i-lucide-receipt', onde: 'Reembolsos', tipo: 'formulario' },
  { id: 'a9', nome: 'Fornecedores', icone: 'i-lucide-building-2', onde: 'Menu Categorias', tipo: 'categoria' },
  { id: 'a10', nome: 'Contratos vencendo', icone: 'i-lucide-file-signature', onde: 'Contratos', tipo: 'visualizacao' },
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

export { DIA, HORA }
