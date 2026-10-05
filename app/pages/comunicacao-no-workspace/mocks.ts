/**
 * O dado do protótipo. Tudo fictício, nada vem do develop além da estrutura.
 *
 * - Workspace, categoria, item, membro e tarefa são tipados pelo
 *   `@be-enlighten/enspace-sdk-schemas` 0.17. O que o schema não tem está
 *   marcado com "// PROTÓTIPO:" e diz de onde veio.
 * - Formulário, e-mail, caixa de e-mail e evento da Agenda NÃO têm schema no
 *   SDK 0.17. A forma deles saiu das telas do develop (Formulários, Mail Box,
 *   E-mails Enviados, Caixas de E-mail, Agenda), visitadas em 05/10/2026.
 * - E-mails em `example.com`, domínio reservado para exemplo. Telefones
 *   inventados: o protótipo não abre o WhatsApp nem o SMS, só mostra o link.
 */
import type { Field, Item, ItemType, Member, Task, Workspace } from '@be-enlighten/enspace-sdk-schemas'

/* ------------------------------------------------------------------ *
 * Datas: o protótipo vive em segunda, 05/10/2026.
 * ------------------------------------------------------------------ */

export const HOJE = new Date('2026-10-05T09:30:00-03:00')

function dia(d: number, hora = '10:00') {
  return new Date(`2026-10-${String(d).padStart(2, '0')}T${hora}:00-03:00`)
}

/* ------------------------------------------------------------------ *
 * Workspace
 * ------------------------------------------------------------------ */

export const workspace: Workspace = {
  id: 412,
  created_at: new Date('2025-03-10T12:00:00-03:00'),
  updated_at: new Date('2026-09-30T18:00:00-03:00'),
  name: 'Aurora Serviços',
  reference: 'aurora-servicos',
  status: 'active',
  description: 'Jurídico e compras da Aurora',
  icon: 'carbon:enterprise',
  // Os módulos que a tela Sistema liga e desliga. As três primeiras chaves
  // existem no develop (Correção Monetária, Comparações, Jurídico). A quarta é
  // a proposta deste protótipo.
  modules: {
    correcao_monetaria: true,
    comparacoes: false,
    juridico: true,
    atalhos_de_comunicacao: true, // PROTÓTIPO: módulo novo
  },
  members_count: 8,
}

/**
 * Domínio das caixas. No develop: `develop.box.enspace.io` (o "Provedor" do
 * formulário de Caixa de E-mail). Aqui sem o "develop".
 */
export const DOMINIO_DAS_CAIXAS = 'box.enspace.io'

/* ------------------------------------------------------------------ *
 * Membros
 * ------------------------------------------------------------------ */

/**
 * O membro como o protótipo precisa. `Member` não traz nome nem telefone:
 * o nome vem de `meta.fname/lname` e o telefone de `User.meta.phone`, que o
 * schema tem mas a tela de perfil do develop NÃO mostra (só E-mail, Nome e
 * Sobrenome). Por isso metade dos membros aparece sem telefone.
 */
export interface MembroDoProtótipo extends Member {
  nome: string // PROTÓTIPO: meta.fname + meta.lname
  telefone: string | null // PROTÓTIPO: User.meta.phone
}

function membro(id: number, fname: string, lname: string, email: string, telefone: string | null, type: Member['type'] = 'standard'): MembroDoProtótipo {
  return {
    id,
    created_at: new Date('2025-04-01T10:00:00-03:00'),
    updated_at: new Date('2026-09-01T10:00:00-03:00'),
    user: 9000 + id,
    status: 'active',
    type,
    reference: `mbr-${id}`,
    role: null,
    custom_seal: null,
    meta: { fname, lname },
    email,
    workspace: workspace.reference,
    language: 'pt-BR',
    nome: `${fname} ${lname}`,
    telefone,
  }
}

export const membros: MembroDoProtótipo[] = [
  membro(1, 'Ana', 'Ribeiro', 'ana.ribeiro@example.com', '+55 11 98123-4410', 'full'),
  membro(2, 'Bruno', 'Teixeira', 'bruno.teixeira@example.com', '+55 11 97240-1187'),
  membro(3, 'Carla', 'Nogueira', 'carla.nogueira@example.com', null),
  membro(4, 'Diego', 'Martins', 'diego.martins@example.com', '+55 21 99318-5520'),
  membro(5, 'Elisa', 'Prado', 'elisa.prado@example.com', null),
  membro(6, 'Fábio', 'Castro', 'fabio.castro@example.com', '+55 31 98877-0042'),
  membro(7, 'Gabriela', 'Lins', 'gabriela.lins@example.com', null),
  membro(8, 'Henrique', 'Sales', 'henrique.sales@example.com', '+55 11 96655-7781'),
]

/** Quem está usando o protótipo. */
export const EU = membros[0]!

export function membroPorId(id: number | null | undefined) {
  return membros.find(m => m.id === id) ?? null
}

/* ------------------------------------------------------------------ *
 * Categorias e campos
 * ------------------------------------------------------------------ */

export type SlugDaCategoria = 'contratos' | 'solicitacoes' | 'fornecedores'

export interface Categoria extends ItemType {
  slug: SlugDaCategoria
  /** PROTÓTIPO: vem de Estrutura › Categorias › Pastas de Visualização. */
  temMailBox: boolean
  /** PROTÓTIPO: prefixo do ID Personalizado (campo "ID Personalizado"). */
  prefixo: string
}

function categoria(id: number, name: string, slug: SlugDaCategoria, prefixo: string, icon: string, description: string, temMailBox: boolean): Categoria {
  return {
    id,
    created_at: new Date('2025-03-12T10:00:00-03:00'),
    updated_at: new Date('2026-09-20T10:00:00-03:00'),
    name,
    slug,
    description,
    icon,
    color: 'primary',
    settings: {},
    itemVersioning: false,
    temMailBox,
    prefixo,
  }
}

export const categorias: Categoria[] = [
  categoria(31, 'Contratos', 'contratos', 'CTR', 'i-lucide-file-signature', 'Contratos com clientes e fornecedores, da minuta à renovação', true),
  categoria(32, 'Solicitações', 'solicitacoes', 'SOL', 'i-lucide-inbox', 'Pedidos que chegam ao jurídico pelo formulário', true),
  categoria(33, 'Fornecedores', 'fornecedores', 'FOR', 'i-lucide-truck', 'Cadastro e homologação de fornecedores', false),
]

export function categoriaPorSlug(slug: SlugDaCategoria) {
  return categorias.find(c => c.slug === slug)!
}

/** O campo como a configuração do protótipo precisa. Subconjunto do `Field`. */
export type CampoDaCategoria = Pick<Field, 'refId' | 'type' | 'name' | 'label'> & {
  categoria: SlugDaCategoria // PROTÓTIPO: no schema é `item_type` (id)
}

function campo(categoria: SlugDaCategoria, refId: string, name: string, type: Field['type']): CampoDaCategoria {
  return { categoria, refId, name, label: name, type }
}

export const campos: CampoDaCategoria[] = [
  campo('contratos', 'titulo', 'Nome do contrato', 'inputText'),
  campo('contratos', 'contraparte', 'Contraparte', 'inputText'),
  campo('contratos', 'contato_nome', 'Contato da contraparte', 'inputText'),
  campo('contratos', 'contato_email', 'E-mail do contato', 'email'),
  campo('contratos', 'contato_telefone', 'Telefone do contato', 'EnlMask'),
  campo('contratos', 'financeiro_email', 'E-mail do financeiro', 'email'),
  campo('contratos', 'valor', 'Valor', 'EnlNumber'),
  campo('contratos', 'vencimento', 'Vencimento', 'EnlCalendar'),

  campo('solicitacoes', 'titulo', 'Assunto', 'inputText'),
  campo('solicitacoes', 'solicitante_nome', 'Nome de quem pediu', 'inputText'),
  campo('solicitacoes', 'solicitante_email', 'E-mail de quem pediu', 'email'),
  campo('solicitacoes', 'solicitante_telefone', 'Telefone de quem pediu', 'EnlMask'),
  campo('solicitacoes', 'area', 'Área', 'EnlDropdown'),

  campo('fornecedores', 'titulo', 'Razão social', 'inputText'),
  campo('fornecedores', 'cnpj', 'CNPJ', 'EnlMask'),
  campo('fornecedores', 'contato_nome', 'Contato comercial', 'inputText'),
  campo('fornecedores', 'contato_email', 'E-mail comercial', 'email'),
  campo('fornecedores', 'contato_whatsapp', 'WhatsApp comercial', 'EnlMask'),
]

/** O "E-mail do Requisitante" que o develop lista entre os campos de toda categoria. */
export const CAMPO_REQUISITANTE = 'request_email'

/* ------------------------------------------------------------------ *
 * Itens
 * ------------------------------------------------------------------ */

export type StatusDoItem = 'em_minuta' | 'em_assinatura' | 'vigente' | 'em_renovacao' | 'encerrado'

export interface ItemDoProtótipo extends Item {
  categoria: SlugDaCategoria // PROTÓTIPO: no produto vem da rota (/types/:type)
  titulo: string // PROTÓTIPO: espelho de data.titulo, para busca e exibição
  etapa: StatusDoItem // PROTÓTIPO: rótulo da etapa (stage_status)
  /** PROTÓTIPO: permissão. Item que o membro não pode ver nunca aparece na busca. */
  semAcesso?: boolean
}

const contrapartes = [
  ['Lumen Engenharia Ltda.', 'Marina Alves', 'marina.alves@example.com', '+55 11 3456-7710'],
  ['Vértice Tecnologia S.A.', 'Rafael Monteiro', 'rafael.monteiro@example.com', '+55 11 99876-1203'],
  ['Cia. Paulista de Limpeza', 'Juliana Freitas', null, '+55 11 98432-6611'],
  ['Norte Sul Logística', 'Otávio Rezende', 'otavio.rezende@example.com', null],
  ['Instituto Horizonte', 'Patrícia Gomes', 'patricia.gomes@example.com', '+55 21 97711-3049'],
  ['Atlas Segurança Patrimonial', 'Sérgio Batista', 'sergio.batista@example.com', '+55 31 99210-8834'],
  ['Prisma Consultoria Tributária', 'Lívia Moura', 'livia.moura@example.com', '+55 11 91234-5567'],
  ['Granja Boa Vista Alimentos', null, null, null],
  ['Ondas Telecom', 'Caio Fernandes', 'caio.fernandes@example.com', '+55 41 98800-2211'],
  ['Studio Mira Arquitetura e Interiores Corporativos Integrados', 'Beatriz Rocha', 'beatriz.rocha@example.com', '+55 11 97765-4402'],
  ['Farol Seguros', 'Tiago Lacerda', 'tiago.lacerda@example.com', '+55 51 99654-1290'],
  ['Mercúrio Transportes', 'Renata Dias', 'renata.dias@example.com', '+55 11 98761-0098'],
] as const

const objetos = [
  'Manutenção predial',
  'Licença de software de gestão',
  'Limpeza e conservação',
  'Transporte de documentos',
  'Patrocínio cultural',
  'Vigilância 24 horas',
  'Assessoria tributária',
  'Fornecimento de refeições',
  'Link de internet dedicado',
  'Reforma do escritório de São Paulo',
  'Seguro empresarial',
  'Frete fracionado',
]

const etapas: StatusDoItem[] = ['em_minuta', 'em_assinatura', 'vigente', 'vigente', 'em_renovacao', 'vigente', 'encerrado']

function item(base: Omit<ItemDoProtótipo, 'created_at' | 'updated_at' | 'deleted_at' | 'stage_status' | 'status'> & { criado: Date, atualizado: Date }): ItemDoProtótipo {
  const { criado, atualizado, ...resto } = base
  return {
    ...resto,
    created_at: criado,
    updated_at: atualizado,
    deleted_at: null,
    stage_status: null,
    status: 'active',
  }
}

const contratos: ItemDoProtótipo[] = Array.from({ length: 36 }, (_, i) => {
  const c = contrapartes[i % contrapartes.length]!
  const objeto = objetos[i % objetos.length]!
  const numero = 231 - i
  const reference = `CTR-${String(numero).padStart(5, '0')}`
  const titulo = i < 12 ? `Contrato de ${objeto[0]!.toLowerCase()}${objeto.slice(1)}` : `${objeto} (${2024 + (i % 3)})`
  return item({
    id: 47000 + numero,
    reference,
    categoria: 'contratos',
    titulo,
    etapa: etapas[i % etapas.length]!,
    request_email: i % 4 === 0 ? 'carla.nogueira@example.com' : i % 4 === 1 ? 'bruno.teixeira@example.com' : undefined,
    user: 9001,
    form: 'default',
    data: {
      titulo,
      contraparte: c[0],
      contato_nome: c[1],
      contato_email: c[2],
      contato_telefone: c[3],
      financeiro_email: i % 5 === 0 ? 'financeiro@example.com' : null,
      valor: 12000 + ((i * 7919) % 480000),
      vencimento: dia(1 + ((i * 3) % 28)).toISOString(),
    },
    semAcesso: i === 17 || i === 29,
    criado: new Date(2026, 8 - (i % 9), 1 + (i % 27), 10),
    atualizado: new Date(2026, 9, 1 + (i % 4), 9 + (i % 8)),
  })
})

const assuntos = [
  'Revisão de cláusula de reajuste',
  'Pedido de acesso ao sistema de contratos',
  'Dúvida sobre prazo de rescisão',
  'Parecer sobre uso de imagem em campanha',
  'Notificação recebida de cliente',
  'Análise de termo de confidencialidade',
]

const solicitantes = [
  ['Lucas Almeida', 'lucas.almeida@example.com', '+55 11 98222-1400', 'Comercial'],
  ['Fernanda Souza', 'fernanda.souza@example.com', null, 'Marketing'],
  ['Igor Pacheco', null, '+55 11 97333-8090', 'Operações'],
  ['Natália Couto', 'natalia.couto@example.com', '+55 21 98444-2201', 'RH'],
] as const

const solicitacoes: ItemDoProtótipo[] = Array.from({ length: 18 }, (_, i) => {
  const s = solicitantes[i % solicitantes.length]!
  const numero = 88 - i
  const titulo = assuntos[i % assuntos.length]!
  return item({
    id: 52000 + numero,
    reference: `SOL-${String(numero).padStart(5, '0')}`,
    categoria: 'solicitacoes',
    titulo,
    etapa: (['em_minuta', 'vigente', 'encerrado'] as StatusDoItem[])[i % 3]!,
    request_email: s[1] ?? undefined,
    form: 7,
    data: {
      titulo,
      solicitante_nome: s[0],
      solicitante_email: s[1],
      solicitante_telefone: s[2],
      area: s[3],
    },
    criado: new Date(2026, 9, 1 + (i % 5), 8 + i % 9),
    atualizado: new Date(2026, 9, 2 + (i % 4), 9),
  })
})

const fornecedores: ItemDoProtótipo[] = [
  ['Papelaria Central Ltda.', '12.345.678/0001-90', 'Rita Campos', 'rita.campos@example.com', '+55 11 98012-3344'],
  ['TecnoParts Componentes', '23.456.789/0001-01', 'Vitor Hugo', 'vitor.hugo@example.com', null],
  ['Café Serra Azul', '34.567.890/0001-12', 'Sônia Lima', null, '+55 35 99123-4455'],
  ['Clima Bom Ar-condicionado', '45.678.901/0001-23', 'Márcio Neves', 'marcio.neves@example.com', '+55 11 97000-1122'],
  ['Gráfica Ponto Final', '56.789.012/0001-34', null, null, null],
  ['Verde Vivo Paisagismo', '67.890.123/0001-45', 'Clara Duarte', 'clara.duarte@example.com', '+55 41 98111-2233'],
].map((f, i) => item({
  id: 61000 + i,
  reference: `FOR-${String(40 - i).padStart(5, '0')}`,
  categoria: 'fornecedores',
  titulo: f[0]!,
  etapa: (['em_minuta', 'vigente'] as StatusDoItem[])[i % 2]!,
  form: 9,
  data: { titulo: f[0], cnpj: f[1], contato_nome: f[2], contato_email: f[3], contato_whatsapp: f[4] },
  criado: new Date(2026, 7, 5 + i, 10),
  atualizado: new Date(2026, 9, 1, 10),
}))

export const itens: ItemDoProtótipo[] = [...contratos, ...solicitacoes, ...fornecedores]

export function itemPorId(id: number | null | undefined) {
  return itens.find(i => i.id === id) ?? null
}

/**
 * O endereço do item, como a aba Mail Box mostra: referência em minúsculas,
 * ponto, workspace, @ domínio das caixas. Visto em 05/10/2026: na gaveta do
 * item aparece `levd8326af86da64a17970c1…`; na página cheia do mesmo item,
 * `.teste-ux@develop.box.enspace.io` (sem a referência, achado no BRIEFING).
 */
export function enderecoDoItem(i: ItemDoProtótipo) {
  return `${i.reference.toLowerCase()}.${workspace.reference}@${DOMINIO_DAS_CAIXAS}`
}

/* ------------------------------------------------------------------ *
 * Tarefas rápidas
 * ------------------------------------------------------------------ */

export interface TarefaDoProtótipo extends Task {
  /** PROTÓTIPO: em `meta.form` no produto. Tarefa de preencher formulário. */
  formulario?: string
}

function tarefa(id: number, name: string, status: Task['status'], priority: Task['priority'], due: Date | null, assigned_to: number | null, itemId: number | null, extra: Partial<TarefaDoProtótipo> = {}): TarefaDoProtótipo {
  return {
    id,
    created_at: dia(1, '09:00'),
    updated_at: dia(4, '17:00'),
    deleted_at: null,
    reference: `T-${id}`,
    name,
    description: null,
    workspace: workspace.reference,
    type: 'generic',
    status,
    priority,
    due_date: due,
    points: 0,
    meta: {},
    creator: 1,
    assigned_to,
    completed_by: null,
    completed_at: null,
    node_execution: null,
    item: itemId,
    notification_task: false,
    archived: false,
    collaborators: [],
    external_task: null,
    permissions: [],
    tag_ids: [],
    ...extra,
  }
}

export const tarefas: TarefaDoProtótipo[] = [
  tarefa(1042, 'Enviar minuta assinada à contraparte', 'pending', 'high', dia(6, '18:00'), 2, 47231, { description: 'A contraparte pediu a versão com as duas assinaturas.' }),
  tarefa(1043, 'Coletar aprovação do orçamento com a diretoria', 'pending', 'normal', dia(9, '12:00'), 3, 47228),
  tarefa(1044, 'Confirmar data da audiência com o escritório parceiro', 'working', 'urgent', dia(8, '15:00'), 4, 52088),
  tarefa(1045, 'Pedir ficha de cadastro ao fornecedor novo', 'pending', 'normal', dia(10, '18:00'), 6, 61001, { type: 'form', formulario: 'f-cadastro-fornecedor', description: 'O fornecedor preenche o formulário público; o item nasce em Fornecedores.' }),
  tarefa(1046, 'Responder pedido de acesso ao sistema de contratos', 'working', 'normal', dia(7, '10:00'), 5, 52087),
  tarefa(1047, 'Revisar cláusula de reajuste com o financeiro', 'blocked', 'high', dia(3, '18:00'), 7, 47229, { description: 'Bloqueada: falta o índice de reajuste deste ano.' }),
  tarefa(1048, 'Arquivar contrato encerrado de vigilância', 'completed', 'low', dia(1, '18:00'), 8, 47226),
  tarefa(1049, 'Mandar link da pesquisa de satisfação aos solicitantes', 'pending', 'low', dia(15, '18:00'), 1, null, { type: 'form', formulario: 'f-pesquisa-satisfacao' }),
  tarefa(1050, 'Conferir apólice do seguro empresarial antes da renovação do contrato principal com a seguradora', 'pending', 'normal', dia(20, '18:00'), 3, 47221),
  tarefa(1051, 'Ligar para o contato da Ondas Telecom', 'working', 'normal', dia(5, '16:00'), 2, 47223),
  tarefa(1052, 'Cobrar CNPJ atualizado da gráfica', 'pending', 'normal', null, null, 61004, { description: 'Sem responsável: ninguém pegou ainda.' }),
  tarefa(1053, 'Enviar notificação extrajudicial', 'completed', 'urgent', dia(2, '12:00'), 4, 52086),
  tarefa(1054, 'Agendar reunião de kick-off com a Vértice', 'pending', 'normal', dia(12, '11:00'), 5, 47230),
  tarefa(1055, 'Validar parecer sobre uso de imagem', 'blocked', 'normal', dia(9, '18:00'), 7, 52085),
]

/* ------------------------------------------------------------------ *
 * Formulários (sem schema no SDK 0.17)
 * ------------------------------------------------------------------ */

export interface Formulario {
  id: string // o hash de 32 caracteres que vai na URL; aqui encurtado
  nome: string
  categoria: SlugDaCategoria
  tipo: 'criacao' | 'editar' | 'geral' | 'visualizar'
  visibilidade: 'publico' | 'privado'
  respostas: number
  campos: { rotulo: string, tipo: 'texto' | 'email' | 'telefone' | 'longo' }[]
}

export const formularios: Formulario[] = [
  {
    id: 'f-solicitacao-juridica',
    nome: 'Solicitação jurídica',
    categoria: 'solicitacoes',
    tipo: 'criacao',
    visibilidade: 'publico',
    respostas: 128,
    campos: [
      { rotulo: 'Assunto', tipo: 'texto' },
      { rotulo: 'Seu nome', tipo: 'texto' },
      { rotulo: 'Seu e-mail', tipo: 'email' },
      { rotulo: 'Seu telefone', tipo: 'telefone' },
      { rotulo: 'Conte o que precisa', tipo: 'longo' },
    ],
  },
  {
    id: 'f-cadastro-fornecedor',
    nome: 'Cadastro de fornecedor',
    categoria: 'fornecedores',
    tipo: 'criacao',
    visibilidade: 'publico',
    respostas: 41,
    campos: [
      { rotulo: 'Razão social', tipo: 'texto' },
      { rotulo: 'CNPJ', tipo: 'texto' },
      { rotulo: 'E-mail comercial', tipo: 'email' },
      { rotulo: 'WhatsApp comercial', tipo: 'telefone' },
    ],
  },
  {
    id: 'f-pesquisa-satisfacao',
    nome: 'Pesquisa de satisfação do atendimento jurídico',
    categoria: 'solicitacoes',
    tipo: 'criacao',
    visibilidade: 'publico',
    respostas: 9,
    campos: [
      { rotulo: 'Número da solicitação', tipo: 'texto' },
      { rotulo: 'Nota de 1 a 5', tipo: 'texto' },
      { rotulo: 'Comentário', tipo: 'longo' },
    ],
  },
  {
    id: 'f-revisao-contrato',
    nome: 'Revisão de contrato',
    categoria: 'contratos',
    tipo: 'editar',
    visibilidade: 'privado',
    respostas: 312,
    campos: [
      { rotulo: 'Cláusula', tipo: 'texto' },
      { rotulo: 'Proposta de redação', tipo: 'longo' },
    ],
  },
  {
    id: 'f-pedido-orcamento',
    nome: 'Pedido de orçamento',
    categoria: 'solicitacoes',
    tipo: 'criacao',
    visibilidade: 'privado',
    respostas: 27,
    campos: [
      { rotulo: 'O que comprar', tipo: 'texto' },
      { rotulo: 'Valor estimado', tipo: 'texto' },
    ],
  },
]

/**
 * O link público segue a rota do develop `/public/:form/Answer`. Host fictício.
 */
export function linkPublico(f: Formulario) {
  return `https://app.enspace.io/public/${f.id}/Answer`
}

/* ------------------------------------------------------------------ *
 * E-mail (sem schema no SDK 0.17)
 * ------------------------------------------------------------------ */

/**
 * Caixa do workspace (Configurações › E-mails › Caixas de E-mail, a "Caixa de
 * Triagem"). O formulário pede Nome, a parte antes do @ e o Provedor. Não
 * confirmei se o endereço final leva o workspace; aqui leva, como o do item.
 */
export interface CaixaDeEmail {
  id: string
  nome: string
  email: string
}

export const caixas: CaixaDeEmail[] = [
  { id: 'atendimento', nome: 'Atendimento jurídico', email: `atendimento.${workspace.reference}@${DOMINIO_DAS_CAIXAS}` },
  { id: 'compras', nome: 'Compras', email: `compras.${workspace.reference}@${DOMINIO_DAS_CAIXAS}` },
]

/** Modelo de e-mail (Configurações › E-mails › Modelos de E-mail). */
export interface ModeloDeEmail {
  id: string
  nome: string
  assunto: string
  corpo: string
}

export const modelos: ModeloDeEmail[] = [
  { id: 'm-assinatura', nome: 'Envio para assinatura', assunto: '{referencia} · Documento para assinatura', corpo: '<p>Olá,</p><p>Segue o documento para assinatura. Qualquer dúvida, é só responder este e-mail.</p>' },
  { id: 'm-vencimento', nome: 'Lembrete de vencimento', assunto: '{referencia} · Vencimento próximo', corpo: '<p>Olá,</p><p>O contrato vence nos próximos dias. Podemos conversar sobre a renovação?</p>' },
  { id: 'm-documentos', nome: 'Pedido de documentos', assunto: '{referencia} · Documentos pendentes', corpo: '<p>Olá,</p><p>Para seguir com o cadastro, precisamos dos documentos abaixo.</p>' },
]

export interface Email {
  id: number
  direcao: 'recebido' | 'enviado'
  de: string
  para: string[]
  cc: string[]
  assunto: string
  /** HTML simples. */
  corpo: string
  data: Date
  /** Endereço da caixa: a do item ou uma caixa do workspace. */
  caixa: string
  /** Item vinculado. Guarda o id, nunca o nome (pedido do documento). */
  itemId: number | null
  anexos: string[]
  lido: boolean
  /** Quem enviou pelo ENSPACE (para os enviados). */
  autor?: number
}

function email(e: Omit<Email, 'cc' | 'anexos' | 'lido'> & Partial<Pick<Email, 'cc' | 'anexos' | 'lido'>>): Email {
  return { cc: [], anexos: [], lido: true, ...e }
}

const ctr231 = itens.find(i => i.reference === 'CTR-00231')!
const ctr230 = itens.find(i => i.reference === 'CTR-00230')!
const ctr229 = itens.find(i => i.reference === 'CTR-00229')!
const ctr223 = itens.find(i => i.reference === 'CTR-00223')!
const sol88 = itens.find(i => i.reference === 'SOL-00088')!
const sol87 = itens.find(i => i.reference === 'SOL-00087')!

export const emails: Email[] = [
  email({ id: 1, direcao: 'recebido', de: 'marina.alves@example.com', para: [enderecoDoItem(ctr231)], assunto: 'Re: CTR-00231 · Minuta revisada', corpo: '<p>Olá, Bruno.</p><p>Revisamos a minuta e mandamos de volta com 2 comentários na cláusula 7. Podemos assinar na quinta?</p><p>Marina</p>', data: dia(5, '08:12'), caixa: enderecoDoItem(ctr231), itemId: ctr231.id, lido: false, anexos: ['minuta-v3-comentada.pdf'] }),
  email({ id: 2, direcao: 'enviado', de: enderecoDoItem(ctr231), para: ['marina.alves@example.com'], assunto: 'CTR-00231 · Minuta revisada', corpo: '<p>Marina, boa tarde.</p><p>Segue a minuta com os ajustes que combinamos na reunião.</p>', data: dia(2, '16:40'), caixa: enderecoDoItem(ctr231), itemId: ctr231.id, autor: 2, anexos: ['minuta-v3.docx'] }),
  email({ id: 3, direcao: 'recebido', de: 'rafael.monteiro@example.com', para: [enderecoDoItem(ctr230)], assunto: 'Licença: quantidade de usuários', corpo: '<p>Bom dia. Precisamos confirmar se são 40 ou 60 usuários antes de emitir a nota.</p>', data: dia(4, '11:05'), caixa: enderecoDoItem(ctr230), itemId: ctr230.id }),
  email({ id: 4, direcao: 'enviado', de: enderecoDoItem(ctr229), para: ['juliana.freitas@example.com'], cc: ['financeiro@example.com'], assunto: 'CTR-00229 · Índice de reajuste', corpo: '<p>Juliana, qual índice vocês propõem para este ano?</p>', data: dia(1, '10:20'), caixa: enderecoDoItem(ctr229), itemId: ctr229.id, autor: 7 }),
  email({ id: 5, direcao: 'recebido', de: 'lucas.almeida@example.com', para: [enderecoDoItem(sol88)], assunto: 'Cláusula de reajuste do cliente Delta', corpo: '<p>Oi, time. O cliente Delta pediu para trocar o índice. Podem olhar?</p>', data: dia(3, '14:33'), caixa: enderecoDoItem(sol88), itemId: sol88.id }),
  email({ id: 6, direcao: 'recebido', de: 'contato@example.com', para: [caixas[0]!.email], assunto: 'Pedido de cópia de contrato', corpo: '<p>Olá, gostaria de receber a cópia do contrato assinado em agosto.</p>', data: dia(5, '07:50'), caixa: caixas[0]!.email, itemId: null, lido: false }),
  email({ id: 7, direcao: 'recebido', de: 'caio.fernandes@example.com', para: [enderecoDoItem(ctr223)], assunto: 'Visita técnica para o link dedicado', corpo: '<p>Conseguimos agendar a visita técnica para o dia 8, às 14h.</p>', data: dia(2, '09:18'), caixa: enderecoDoItem(ctr223), itemId: ctr223.id }),
  email({ id: 8, direcao: 'enviado', de: caixas[0]!.email, para: ['fornecedor.novo@example.com'], assunto: 'Cadastro de fornecedor', corpo: '<p>Segue o link do formulário de cadastro.</p>', data: dia(1, '15:00'), caixa: caixas[0]!.email, itemId: null, autor: 6 }),
  email({ id: 9, direcao: 'recebido', de: 'natalia.couto@example.com', para: [enderecoDoItem(sol87)], assunto: 'Acesso ao sistema de contratos', corpo: '<p>Preciso de acesso de leitura para a equipe de RH.</p>', data: dia(4, '17:02'), caixa: enderecoDoItem(sol87), itemId: sol87.id }),
  email({ id: 10, direcao: 'recebido', de: 'boletos@example.com', para: [caixas[1]!.email], assunto: 'Boleto de outubro', corpo: '<p>Segue o boleto com vencimento em 15/10.</p>', data: dia(3, '06:30'), caixa: caixas[1]!.email, itemId: null, anexos: ['boleto-outubro.pdf'] }),
]

/* ------------------------------------------------------------------ *
 * Agenda (sem schema no SDK 0.17)
 * ------------------------------------------------------------------ */

export interface EventoDaAgenda {
  id: string
  titulo: string
  inicio: Date
  fim: Date
  /** As 3 fontes da Agenda no develop: Tarefas, Itens e Integrações. */
  fonte: 'outlook' | 'item' | 'tarefa'
  local?: string
  /** Participantes. Do Outlook vem só o e-mail. */
  participantes: { nome?: string, email?: string, telefone?: string | null }[]
  itemId?: number
}

function evento(id: string, titulo: string, d: number, de: string, ate: string, fonte: EventoDaAgenda['fonte'], participantes: EventoDaAgenda['participantes'], extra: Partial<EventoDaAgenda> = {}): EventoDaAgenda {
  return { id, titulo, inicio: dia(d, de), fim: dia(d, ate), fonte, participantes, ...extra }
}

const contatoDe = (i: ItemDoProtótipo) => ({ nome: i.data.contato_nome as string, email: i.data.contato_email as string, telefone: i.data.contato_telefone as string })

export const eventos: EventoDaAgenda[] = [
  evento('e1', 'Alinhamento semanal do jurídico', 5, '09:00', '09:30', 'outlook', [{ email: 'ana.ribeiro@example.com' }, { email: 'bruno.teixeira@example.com' }, { email: 'carla.nogueira@example.com' }], { local: 'Reuniões do Microsoft Teams' }),
  evento('e2', 'Assinatura da minuta com a Lumen', 8, '14:00', '15:00', 'item', [contatoDe(ctr231), { nome: 'Bruno Teixeira', email: 'bruno.teixeira@example.com', telefone: '+55 11 97240-1187' }], { itemId: ctr231.id, local: 'Escritório da Lumen' }),
  evento('e3', 'Prazo: confirmar data da audiência', 8, '15:00', '15:30', 'tarefa', [{ nome: 'Diego Martins', email: 'diego.martins@example.com', telefone: '+55 21 99318-5520' }]),
  evento('e4', 'Reunião com a Vértice sobre licenças', 6, '11:00', '12:00', 'outlook', [{ email: 'rafael.monteiro@example.com' }, { email: 'elisa.prado@example.com' }], { local: 'Reuniões do Microsoft Teams' }),
  evento('e5', 'Vencimento: Contrato de link de internet dedicado', 14, '09:00', '09:30', 'item', [contatoDe(ctr223)], { itemId: ctr223.id }),
  evento('e6', 'Visita técnica da Ondas Telecom', 8, '16:00', '17:00', 'outlook', [{ email: 'caio.fernandes@example.com' }, { email: 'bruno.teixeira@example.com' }], { local: 'Recepção, 3º andar' }),
  evento('e7', 'Comitê de contratos', 13, '10:00', '11:30', 'outlook', [{ email: 'ana.ribeiro@example.com' }, { email: 'diego.martins@example.com' }, { email: 'gabriela.lins@example.com' }, { email: 'henrique.sales@example.com' }], { local: 'Sala Ipê' }),
  evento('e8', 'Prazo: revisar cláusula de reajuste', 3, '18:00', '18:30', 'tarefa', [{ nome: 'Gabriela Lins', email: 'gabriela.lins@example.com', telefone: null }]),
  evento('e9', 'Treinamento de assinatura digital', 20, '14:00', '16:00', 'outlook', [{ email: 'ana.ribeiro@example.com' }, { email: 'fabio.castro@example.com' }], { local: 'Reuniões do Microsoft Teams' }),
  evento('e10', 'Vencimento: Seguro empresarial', 27, '09:00', '09:30', 'item', [contatoDe(itens.find(i => i.reference === 'CTR-00221')!)], { itemId: itens.find(i => i.reference === 'CTR-00221')!.id }),
  evento('e11', 'Alinhamento semanal do jurídico', 12, '09:00', '09:30', 'outlook', [{ email: 'ana.ribeiro@example.com' }, { email: 'bruno.teixeira@example.com' }], { local: 'Reuniões do Microsoft Teams' }),
  evento('e12', 'Alinhamento semanal do jurídico', 19, '09:00', '09:30', 'outlook', [{ email: 'ana.ribeiro@example.com' }, { email: 'bruno.teixeira@example.com' }], { local: 'Reuniões do Microsoft Teams' }),
]
