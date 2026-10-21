/**
 * O dado do protótipo. Tudo fictício; do develop vem só a estrutura.
 *
 * - Workspace, membro, categoria, item e tarefa são tipados pelo
 *   `@be-enlighten/enspace-sdk-schemas`. O que o schema não tem está marcado
 *   com "// PROTÓTIPO:" e diz de onde veio.
 * - Formulário de requisição, documento gerado e entrada de triagem NÃO têm
 *   schema no SDK. A forma deles saiu da auditoria do construtor de telas
 *   (enspace-ux-research, 14/09/2026): "Respostas de Formulários", "Meus
 *   Documentos" e a fila de Triagem com o filtro Mailbox.
 * - E-mails em `example.com`, domínio reservado para exemplo.
 */
import type { Item, ItemType, Member, Task, Workspace } from '@be-enlighten/enspace-sdk-schemas'

/* ------------------------------------------------------------------ *
 * Datas: o protótipo vive na quarta, 21/10/2026.
 * ------------------------------------------------------------------ */

export const HOJE = new Date('2026-10-21T09:30:00-03:00')

function data(iso: string, hora = '10:00') {
  return new Date(`${iso}T${hora}:00-03:00`)
}

/** Dias a partir de hoje (negativo é passado). */
function emDias(d: number, hora = '10:00') {
  const x = new Date(HOJE)
  x.setDate(x.getDate() + d)
  const [h, m] = hora.split(':').map(Number)
  x.setHours(h ?? 10, m ?? 0, 0, 0)
  return x
}

export function diasAte(d: Date) {
  return Math.round((d.getTime() - HOJE.getTime()) / 86_400_000)
}

/* ------------------------------------------------------------------ *
 * Workspace
 * ------------------------------------------------------------------ */

export const workspace: Workspace = {
  id: 412,
  created_at: new Date('2025-03-10T12:00:00-03:00'),
  updated_at: new Date('2026-10-20T18:00:00-03:00'),
  name: 'Aurora Serviços',
  reference: 'aurora-servicos',
  status: 'active',
  description: 'Jurídico, compras e TI da Aurora',
  icon: 'carbon:enterprise',
  modules: { requisicoes: true }, // PROTÓTIPO: o módulo Requisições é a proposta
  members_count: 9,
}

/* ------------------------------------------------------------------ *
 * Membros e grupos
 * ------------------------------------------------------------------ */

export interface MembroDoPrototipo extends Member {
  nome: string // PROTÓTIPO: meta.fname + meta.lname
}

function membro(id: number, fname: string, lname: string, type: Member['type'] = 'standard'): MembroDoPrototipo {
  const email = `${fname}.${lname}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
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
    email: `${email}@example.com`,
    workspace: workspace.reference,
    language: 'pt-BR',
    nome: `${fname} ${lname}`,
  }
}

export const membros: MembroDoPrototipo[] = [
  membro(1, 'Ana', 'Ribeiro', 'full'),
  membro(2, 'Bruno', 'Teixeira'),
  membro(3, 'Carla', 'Nogueira'),
  membro(4, 'Diego', 'Martins'),
  membro(5, 'Elisa', 'Prado'),
  membro(6, 'Fábio', 'Castro'),
  membro(7, 'Gabriela', 'Lins'),
  membro(8, 'Henrique', 'Sales'),
  membro(9, 'Isadora', 'Monteiro de Albuquerque Vasconcelos'),
]

/** Quem está usando o protótipo. */
export const EU = membros[0]!

export function membroPorId(id: number | null | undefined) {
  return membros.find(m => m.id === id) ?? null
}

/** PROTÓTIPO: `MemberGroup` existe no schema; aqui só o que a tela mostra. */
export interface Grupo {
  id: number
  nome: string
  membros: number[]
}

export const grupos: Grupo[] = [
  { id: 11, nome: 'Jurídico', membros: [1, 3, 5, 9] },
  { id: 12, nome: 'Compras', membros: [2, 4, 6] },
  { id: 13, nome: 'TI', membros: [7, 8] },
]

export function gruposDe(membroId: number) {
  return grupos.filter(g => g.membros.includes(membroId))
}

/* ------------------------------------------------------------------ *
 * Categorias
 * ------------------------------------------------------------------ */

export type SlugDaCategoria = 'contratos' | 'fornecedores' | 'chamados-ti'

function categoria(id: number, name: string, slug: SlugDaCategoria, icon: string, description: string): ItemType {
  return {
    id,
    created_at: new Date('2025-03-12T10:00:00-03:00'),
    updated_at: new Date('2026-08-01T10:00:00-03:00'),
    name,
    slug,
    description,
    icon,
    color: undefined,
    settings: {},
    itemVersioning: false,
  }
}

export const categorias: ItemType[] = [
  categoria(31, 'Contratos', 'contratos', 'i-lucide-file-signature', 'Contratos com clientes e fornecedores'),
  categoria(32, 'Fornecedores', 'fornecedores', 'i-lucide-truck', 'Cadastro e homologação de fornecedores'),
  categoria(33, 'Chamados de TI', 'chamados-ti', 'i-lucide-monitor-cog', 'Pedidos de suporte e acesso'),
]

export function categoriaPorSlug(slug: string) {
  return categorias.find(c => c.slug === slug)!
}

/* ------------------------------------------------------------------ *
 * Itens
 * ------------------------------------------------------------------ */

/** PROTÓTIPO: o status vem do campo Lista "Status" da categoria (`data.status`). */
export type StatusDoItem = 'novo' | 'em_andamento' | 'aguardando' | 'concluido' | 'cancelado'

export interface ItemDoPrototipo extends Item {
  titulo: string // PROTÓTIPO: data.titulo, o campo de título da categoria
  categoria: SlugDaCategoria // PROTÓTIPO: vem da rota /types/<slug>
  situacao: StatusDoItem // PROTÓTIPO: data.status
  responsavel: number | null // PROTÓTIPO: data.responsavel, campo de membro
  valor: number | null // PROTÓTIPO: data.valor, campo monetário
  vencimento: Date | null // PROTÓTIPO: data.vencimento, só em Contratos
}

const empresas = [
  'Lumen Facilities', 'Vértice Logística', 'Orvalho Alimentos', 'Cais Norte Engenharia', 'Pátio Digital',
  'Serra Clara Energia', 'Brisa Têxtil', 'Atalaia Segurança', 'Quintal Verde Paisagismo', 'Nimbus Data Center',
  'Ferrovia Sul Transportes', 'Ateliê Moura', 'Coral Saúde Ocupacional', 'Rumo Certo Consultoria',
]

const titulosDeContrato = [
  'Prestação de serviços de limpeza predial',
  'Locação de impressoras multifuncionais',
  'Licença de software de gestão financeira',
  'Manutenção preventiva de ar-condicionado',
  'Transporte de cargas fracionadas',
  'Fornecimento de refeições para o refeitório',
  'Vigilância patrimonial 24 horas',
  'Consultoria tributária',
  'Aditivo de reajuste anual',
  'Hospedagem em data center com redundância geográfica e plano de recuperação de desastres',
]

const titulosDeFornecedor = [
  'Homologação de cadastro',
  'Atualização de certidões',
  'Revisão de dados bancários',
  'Avaliação anual de desempenho',
]

const titulosDeChamado = [
  'Acesso ao sistema financeiro',
  'Notebook não liga',
  'Instalação do leitor de PDF',
  'Troca de senha do e-mail',
  'Impressora do 3º andar sem toner',
  'VPN cai a cada 10 minutos',
  'Criar caixa de e-mail compartilhada',
]

const ordemDeStatus: StatusDoItem[] = ['novo', 'em_andamento', 'aguardando', 'concluido', 'em_andamento', 'aguardando', 'concluido', 'cancelado', 'novo', 'em_andamento']

function gerarItens(): ItemDoPrototipo[] {
  const lista: ItemDoPrototipo[] = []
  let id = 1000
  const plano: { cat: SlugDaCategoria, n: number, prefixo: string }[] = [
    { cat: 'contratos', n: 30, prefixo: 'CTR' },
    { cat: 'fornecedores', n: 22, prefixo: 'FOR' },
    { cat: 'chamados-ti', n: 20, prefixo: 'CHM' },
  ]
  for (const p of plano) {
    for (let i = 0; i < p.n; i++) {
      id++
      const empresa = empresas[(i * 5 + p.prefixo.length) % empresas.length]!
      const criador = membros[(i * 3 + id) % membros.length]!
      const responsavel = i % 9 === 4 ? null : membros[(i * 7 + 2) % membros.length]!.id
      const criado = emDias(-((i * 11 + p.n) % 420) - 1, `${8 + (i % 9)}:${(i * 13) % 60 < 10 ? '0' : ''}${(i * 13) % 60}`)
      const atualizado = emDias(-((i * 3) % 40), `${9 + (i % 8)}:15`)
      let titulo: string
      let valor: number | null = null
      let vencimento: Date | null = null
      if (p.cat === 'contratos') {
        titulo = `${titulosDeContrato[i % titulosDeContrato.length]} · ${empresa}`
        valor = i % 8 === 3 ? null : Math.round(((i * 37_911) % 480_000) + 12_000)
        vencimento = emDias(((i * 17) % 200) - 25)
      }
      else if (p.cat === 'fornecedores') {
        titulo = `${titulosDeFornecedor[i % titulosDeFornecedor.length]} · ${empresa}`
      }
      else {
        titulo = titulosDeChamado[i % titulosDeChamado.length]!
      }
      lista.push({
        id,
        created_at: criado,
        updated_at: atualizado,
        deleted_at: null,
        reference: `${p.prefixo}-${String(id).slice(-4)}`,
        user: criador.id,
        mgroups: gruposDe(criador.id).map(g => g.id),
        data: {},
        stage_status: null,
        status: 'active',
        titulo,
        categoria: p.cat,
        situacao: ordemDeStatus[(i + p.n) % ordemDeStatus.length]!,
        responsavel,
        valor,
        vencimento,
      })
    }
  }
  return lista
}

export const itens: ItemDoPrototipo[] = gerarItens()

export function itemPorReferencia(ref: string) {
  return itens.find(i => i.reference === ref) ?? null
}

/** As visualizações salvas que a Lista de itens oferece como ponto de partida. */
export type VisualizacaoSalva = 'padrao' | 'vencendo' | 'alto-valor' | 'sem-responsavel'

/* ------------------------------------------------------------------ *
 * Tarefas da Fila de tarefas (fluxo de Contratos)
 * ------------------------------------------------------------------ */

export type EtapaDoFluxo = 'analise_juridica' | 'aprovacao_financeira' | 'assinatura'

export interface TarefaDoPrototipo extends Task {
  etapa: EtapaDoFluxo // PROTÓTIPO: o nó do Spaceflow que gerou a tarefa (node_execution)
  itemRef: string // PROTÓTIPO: Item.reference do `item`
  grupo: number | null // PROTÓTIPO: tarefa atribuída a um grupo (`permissions`)
}

const nomeDaEtapa: Record<EtapaDoFluxo, string> = {
  analise_juridica: 'Analisar minuta do contrato',
  aprovacao_financeira: 'Aprovar valor do contrato',
  assinatura: 'Conferir assinaturas',
}

function gerarTarefas(): TarefaDoPrototipo[] {
  const contratos = itens.filter(i => i.categoria === 'contratos')
  const etapas: EtapaDoFluxo[] = ['aprovacao_financeira', 'analise_juridica', 'aprovacao_financeira', 'assinatura', 'aprovacao_financeira', 'analise_juridica']
  return contratos.slice(0, 26).map((c, i) => {
    const etapa = etapas[i % etapas.length]!
    const concluida = i % 7 === 5
    const paraGrupo = i % 5 === 2
    const responsavel = paraGrupo ? null : (i % 3 === 0 ? EU.id : membros[(i * 2 + 1) % membros.length]!.id)
    const criada = emDias(-((i * 9) % 75) - 1, `${8 + (i % 7)}:40`)
    return {
      id: 5000 + i,
      created_at: criada,
      updated_at: criada,
      deleted_at: null,
      reference: `TAR-${1030 + i}`,
      name: nomeDaEtapa[etapa],
      description: null,
      workspace: workspace.reference,
      type: 'approval',
      status: concluida ? 'completed' : 'pending',
      priority: i % 6 === 1 ? 'urgent' : i % 4 === 0 ? 'high' : 'normal',
      due_date: emDias(((i * 5) % 14) - 4, '18:00'),
      points: 0,
      meta: {},
      creator: null,
      assigned_to: responsavel,
      completed_by: concluida ? EU.id : null,
      completed_at: concluida ? emDias(-1, '16:20') : null,
      node_execution: 7000 + i,
      item: c.id,
      notification_task: false,
      archived: false,
      collaborators: [],
      external_task: null,
      permissions: paraGrupo ? [11] : [],
      tag_ids: [],
      etapa,
      itemRef: c.reference,
      grupo: paraGrupo ? 11 : null,
    }
  })
}

export const tarefas: TarefaDoPrototipo[] = gerarTarefas()

/* ------------------------------------------------------------------ *
 * Documentos gerados por fluxo (tipo de menu Documentos)
 * ------------------------------------------------------------------ */

export type TipoDeArquivo = 'pdf' | 'docx' | 'xlsx'

/** PROTÓTIPO: sem schema no SDK. Forma da tela "Meus Documentos" do develop. */
export interface Documento {
  id: number
  nome: string
  tipo: TipoDeArquivo
  tamanhoKb: number
  itemRef: string
  categoria: SlugDaCategoria
  fluxo: string
  geradoEm: Date
}

const fluxos = ['Assinatura de contrato', 'Renovação automática', 'Homologação de fornecedor']

function gerarDocumentos(): Documento[] {
  const base = itens.filter(i => i.categoria !== 'chamados-ti').slice(0, 26)
  return base.map((it, i) => {
    const tipo: TipoDeArquivo = i % 5 === 3 ? 'xlsx' : i % 3 === 1 ? 'docx' : 'pdf'
    const prefixo = tipo === 'xlsx'
      ? 'Planilha de medição'
      : it.categoria === 'contratos'
      ? (['Contrato assinado', 'Minuta', 'Aditivo', 'Termo de rescisão'][i % 4]!)
      : (['Ficha cadastral', 'Certidão negativa', 'Relatório de avaliação'][i % 3]!)
    const ext = tipo
    return {
      id: 800 + i,
      nome: `${prefixo} ${it.reference}.${ext}`,
      tipo,
      tamanhoKb: 80 + ((i * 271) % 2400),
      itemRef: it.reference,
      categoria: it.categoria,
      fluxo: it.categoria === 'fornecedores' ? fluxos[2]! : fluxos[i % 2]!,
      geradoEm: emDias(-((i * 6) % 90), `${9 + (i % 8)}:${10 + (i % 5) * 9}`),
    }
  })
}

export const documentos: Documento[] = gerarDocumentos()

/* ------------------------------------------------------------------ *
 * Módulo Requisições: catálogo, minhas requisições e triagem
 * ------------------------------------------------------------------ */

export type Area = 'rh' | 'ti' | 'compras' | 'juridico'

export interface CampoDoFormulario {
  chave: string
  rotulo: string
  tipo: 'texto' | 'textoLongo' | 'lista' | 'data' | 'valor'
  obrigatorio?: boolean
  opcoes?: string[]
  ajuda?: string
}

/** PROTÓTIPO: sem schema no SDK. O formulário de requisição, com a área do catálogo. */
export interface FormularioDeRequisicao {
  id: number
  nome: string
  descricao: string
  area: Area
  icone: string
  prazoDias: number
  /** Grupos que enxergam. Vazio: todo membro. */
  grupos: number[]
  /** A requisição passa pela Triagem antes de virar item ("Enviar Requisição para Triagem"). */
  triagem: boolean
  categoria: SlugDaCategoria
  campos: CampoDoFormulario[]
}

const camposDeAcesso: CampoDoFormulario[] = [
  { chave: 'sistema', rotulo: 'Sistema', tipo: 'lista', obrigatorio: true, opcoes: ['Financeiro', 'Folha de pagamento', 'Compras', 'Portal do cliente'] },
  { chave: 'perfil', rotulo: 'Perfil de acesso', tipo: 'lista', obrigatorio: true, opcoes: ['Consulta', 'Edição', 'Administração'] },
  { chave: 'motivo', rotulo: 'Motivo', tipo: 'textoLongo', obrigatorio: true, ajuda: 'Explique para que você precisa do acesso.' },
]

export const formularios: FormularioDeRequisicao[] = [
  {
    id: 1, nome: 'Analisar contrato', descricao: 'Revisão jurídica de minuta, aditivo ou distrato antes da assinatura.',
    area: 'juridico', icone: 'i-lucide-scale', prazoDias: 3, grupos: [], triagem: true, categoria: 'contratos',
    campos: [
      { chave: 'assunto', rotulo: 'Assunto', tipo: 'texto', obrigatorio: true },
      { chave: 'contraparte', rotulo: 'Contraparte', tipo: 'texto', obrigatorio: true, ajuda: 'Empresa ou pessoa do outro lado do contrato.' },
      { chave: 'valor', rotulo: 'Valor estimado', tipo: 'valor' },
      { chave: 'prazo', rotulo: 'Precisa da resposta até', tipo: 'data' },
      { chave: 'detalhes', rotulo: 'O que precisa ser analisado', tipo: 'textoLongo', obrigatorio: true },
    ],
  },
  {
    id: 2, nome: 'Emitir procuração', descricao: 'Procuração para representar a empresa em cartório, banco ou órgão público.',
    area: 'juridico', icone: 'i-lucide-stamp', prazoDias: 5, grupos: [], triagem: true, categoria: 'contratos',
    campos: [
      { chave: 'assunto', rotulo: 'Assunto', tipo: 'texto', obrigatorio: true },
      { chave: 'outorgado', rotulo: 'Quem recebe os poderes', tipo: 'texto', obrigatorio: true },
      { chave: 'finalidade', rotulo: 'Finalidade', tipo: 'textoLongo', obrigatorio: true },
    ],
  },
  {
    id: 3, nome: 'Pedir acesso a sistema', descricao: 'Liberação de acesso a sistemas internos.',
    area: 'ti', icone: 'i-lucide-key-round', prazoDias: 1, grupos: [], triagem: false, categoria: 'chamados-ti',
    campos: [{ chave: 'assunto', rotulo: 'Assunto', tipo: 'texto', obrigatorio: true }, ...camposDeAcesso],
  },
  {
    id: 4, nome: 'Relatar problema em equipamento', descricao: 'Notebook, monitor, impressora ou telefone com defeito.',
    area: 'ti', icone: 'i-lucide-laptop', prazoDias: 2, grupos: [], triagem: false, categoria: 'chamados-ti',
    campos: [
      { chave: 'assunto', rotulo: 'Assunto', tipo: 'texto', obrigatorio: true },
      { chave: 'equipamento', rotulo: 'Equipamento', tipo: 'lista', obrigatorio: true, opcoes: ['Notebook', 'Monitor', 'Impressora', 'Telefone'] },
      { chave: 'detalhes', rotulo: 'O que acontece', tipo: 'textoLongo', obrigatorio: true },
    ],
  },
  {
    id: 5, nome: 'Cadastrar fornecedor', descricao: 'Inclusão de fornecedor novo, com documentos para homologação.',
    area: 'compras', icone: 'i-lucide-truck', prazoDias: 4, grupos: [], triagem: true, categoria: 'fornecedores',
    campos: [
      { chave: 'assunto', rotulo: 'Razão social', tipo: 'texto', obrigatorio: true },
      { chave: 'segmento', rotulo: 'Segmento', tipo: 'lista', obrigatorio: true, opcoes: ['Serviços', 'Materiais', 'Tecnologia', 'Logística'] },
      { chave: 'contato', rotulo: 'E-mail do contato', tipo: 'texto', obrigatorio: true },
    ],
  },
  {
    id: 6, nome: 'Solicitar compra', descricao: 'Compra de material ou serviço acima de R$ 5.000,00.',
    area: 'compras', icone: 'i-lucide-shopping-cart', prazoDias: 3, grupos: [], triagem: true, categoria: 'fornecedores',
    campos: [
      { chave: 'assunto', rotulo: 'O que comprar', tipo: 'texto', obrigatorio: true },
      { chave: 'valor', rotulo: 'Valor estimado', tipo: 'valor', obrigatorio: true },
      { chave: 'centro', rotulo: 'Centro de custo', tipo: 'lista', obrigatorio: true, opcoes: ['Administrativo', 'Comercial', 'Operações', 'TI'] },
    ],
  },
  {
    id: 7, nome: 'Aprovar pagamento fora do ciclo', descricao: 'Pagamento urgente fora da data padrão. Só para a equipe de Compras.',
    area: 'compras', icone: 'i-lucide-banknote', prazoDias: 1, grupos: [12], triagem: true, categoria: 'fornecedores',
    campos: [
      { chave: 'assunto', rotulo: 'Fornecedor', tipo: 'texto', obrigatorio: true },
      { chave: 'valor', rotulo: 'Valor', tipo: 'valor', obrigatorio: true },
    ],
  },
  {
    id: 8, nome: 'Solicitar férias', descricao: 'Pedido de férias com as datas de saída e de volta.',
    area: 'rh', icone: 'i-lucide-palmtree', prazoDias: 2, grupos: [], triagem: false, categoria: 'chamados-ti',
    campos: [
      { chave: 'assunto', rotulo: 'Período', tipo: 'texto', obrigatorio: true, ajuda: 'Por exemplo: 05/01 a 19/01.' },
      { chave: 'inicio', rotulo: 'Saída', tipo: 'data', obrigatorio: true },
      { chave: 'observacao', rotulo: 'Observação', tipo: 'textoLongo' },
    ],
  },
  {
    id: 9, nome: 'Atualizar dados cadastrais', descricao: 'Endereço, conta bancária ou dependentes.',
    area: 'rh', icone: 'i-lucide-id-card', prazoDias: 3, grupos: [], triagem: false, categoria: 'chamados-ti',
    campos: [
      { chave: 'assunto', rotulo: 'O que mudou', tipo: 'lista', obrigatorio: true, opcoes: ['Endereço', 'Conta bancária', 'Dependentes'] },
      { chave: 'detalhes', rotulo: 'Dados novos', tipo: 'textoLongo', obrigatorio: true },
    ],
  },
]

export function formularioPorId(id: number) {
  return formularios.find(f => f.id === id)!
}

/** A etapa da requisição, do ponto de vista de quem pediu. */
export type EtapaDaRequisicao = 'em_triagem' | 'revisao_pedida' | 'em_atendimento' | 'concluida' | 'reprovada' | 'cancelada'

/** PROTÓTIPO: sem schema. É a "resposta de formulário" do develop, com a etapa do item que ela gerou. */
export interface Requisicao {
  id: number
  numero: string
  formulario: number
  assunto: string
  solicitante: number
  responsavel: number | null
  etapa: EtapaDaRequisicao
  abertaEm: Date
  atualizadaEm: Date
  origem: 'formulario' | 'email'
  respostas: Record<string, string>
  /** O que aconteceu, do mais antigo ao mais novo. */
  historico: { quando: Date, quem: number | null, oQue: string }[]
  comentarios: { quando: Date, quem: number, texto: string }[]
}

let numero = 1018
function requisicao(
  formulario: number, assunto: string, solicitante: number, etapa: EtapaDaRequisicao,
  diasAtras: number, extra: Partial<Requisicao> = {},
): Requisicao {
  numero++
  const aberta = emDias(-diasAtras, `${8 + (numero % 9)}:${10 + (numero % 5) * 10}`)
  const f = formularioPorId(formulario)
  const historico: Requisicao['historico'] = [{ quando: aberta, quem: solicitante, oQue: 'abriu' }]
  if (etapa !== 'em_triagem' && f.triagem) historico.push({ quando: emDias(-diasAtras + 1, '11:00'), quem: 3, oQue: etapa === 'reprovada' ? 'reprovou' : etapa === 'revisao_pedida' ? 'pediuRevisao' : 'aprovou' })
  if (etapa === 'concluida') historico.push({ quando: emDias(-Math.max(0, diasAtras - 3), '16:30'), quem: 5, oQue: 'concluiu' })
  if (etapa === 'cancelada') historico.push({ quando: emDias(-Math.max(0, diasAtras - 1), '09:10'), quem: solicitante, oQue: 'cancelou' })
  return {
    id: numero,
    numero: `REQ-${numero}`,
    formulario,
    assunto,
    solicitante,
    responsavel: etapa === 'em_triagem' ? null : [3, 5, 7, 4][numero % 4]!,
    etapa,
    abertaEm: aberta,
    atualizadaEm: historico[historico.length - 1]!.quando,
    origem: 'formulario',
    respostas: { assunto },
    historico,
    comentarios: [],
    ...extra,
  }
}

export const minhasRequisicoesIniciais: Requisicao[] = [
  requisicao(1, 'Aditivo de prazo com a Vértice Logística', EU.id, 'revisao_pedida', 2, {
    comentarios: [{ quando: emDias(-1, '14:05'), quem: 3, texto: 'Falta anexar a versão assinada do contrato original para compararmos as cláusulas.' }],
  }),
  requisicao(3, 'Acesso ao sistema Financeiro (perfil Consulta)', EU.id, 'em_atendimento', 1),
  requisicao(4, 'Monitor piscando na estação 14', EU.id, 'concluida', 12),
  requisicao(6, 'Cadeiras para a sala de reunião do 2º andar', EU.id, 'em_triagem', 0),
  requisicao(2, 'Procuração para o Banco Horizonte', EU.id, 'em_atendimento', 6),
  requisicao(8, 'Férias de 05/01 a 19/01', EU.id, 'concluida', 30),
  requisicao(5, 'Cadastro da Quintal Verde Paisagismo', EU.id, 'reprovada', 18),
  requisicao(1, 'Distrato com a Atalaia Segurança', EU.id, 'revisao_pedida', 4, {
    comentarios: [{ quando: emDias(-3, '10:40'), quem: 5, texto: 'Informe a data de encerramento combinada com o fornecedor.' }],
  }),
  requisicao(9, 'Conta bancária nova', EU.id, 'cancelada', 40),
  requisicao(4, 'Telefone sem linha', EU.id, 'concluida', 55),
  requisicao(3, 'Acesso ao Portal do cliente com permissão de administração para os 3 analistas novos da equipe de atendimento', EU.id, 'em_atendimento', 3),
]

/** A fila da Triagem: requisições de outras pessoas que esperam a decisão da equipe Jurídico e Compras. */
export const triagemInicial: Requisicao[] = [
  requisicao(1, 'Renovação do contrato de vigilância', 4, 'em_triagem', 0, { respostas: { assunto: 'Renovação do contrato de vigilância', contraparte: 'Atalaia Segurança', valor: 'R$ 186.000,00', detalhes: 'O contrato vence em 30 dias. Precisamos revisar a cláusula de reajuste antes de renovar por mais 12 meses.' } }),
  requisicao(1, 'Minuta com a Nimbus Data Center', 7, 'em_triagem', 1, { respostas: { assunto: 'Minuta com a Nimbus Data Center', contraparte: 'Nimbus Data Center', valor: 'R$ 420.000,00', detalhes: 'Contrato de hospedagem com redundância. O fornecedor mandou a minuta dele e pediu resposta até sexta.' } }),
  requisicao(2, 'Procuração para assinatura no cartório', 6, 'em_triagem', 1, { respostas: { assunto: 'Procuração para assinatura no cartório', outorgado: 'Fábio Castro', finalidade: 'Assinar a escritura do galpão de Cajamar.' } }),
  requisicao(1, 'Contrato de consultoria tributária', 2, 'em_triagem', 2, { origem: 'email', respostas: { assunto: 'Contrato de consultoria tributária', email: 'Bom dia. Segue anexa a proposta da Rumo Certo Consultoria. Podem analisar o contrato antes de fecharmos? Obrigado, Bruno.' } }),
  requisicao(5, 'Cadastro da Coral Saúde Ocupacional', 8, 'em_triagem', 2, { respostas: { assunto: 'Cadastro da Coral Saúde Ocupacional', segmento: 'Serviços', contato: 'contato@coral.example.com' } }),
  requisicao(6, 'Compra de 40 cadeiras ergonômicas', 4, 'em_triagem', 3, { respostas: { assunto: 'Compra de 40 cadeiras ergonômicas', valor: 'R$ 38.400,00', centro: 'Administrativo' } }),
  requisicao(1, 'Aditivo de reajuste com a Lumen Facilities', 9, 'em_triagem', 4, { respostas: { assunto: 'Aditivo de reajuste com a Lumen Facilities', contraparte: 'Lumen Facilities', valor: 'R$ 12.900,00', detalhes: 'Reajuste pelo IPCA conforme cláusula 8.' } }),
  requisicao(6, 'Licenças de design para o marketing', 2, 'em_triagem', 5, { origem: 'email', respostas: { assunto: 'Licenças de design para o marketing', email: 'Oi, pessoal. Precisamos de 6 licenças anuais para a equipe de marketing. O orçamento está em anexo.' } }),
  requisicao(1, 'Termo de confidencialidade com a Pátio Digital', 6, 'em_triagem', 6, { respostas: { assunto: 'Termo de confidencialidade com a Pátio Digital', contraparte: 'Pátio Digital', detalhes: 'Modelo padrão de NDA bilateral.' } }),
  requisicao(5, 'Cadastro da Ferrovia Sul Transportes', 3, 'revisao_pedida', 7, { respostas: { assunto: 'Cadastro da Ferrovia Sul Transportes', segmento: 'Logística', contato: 'comercial@ferroviasul.example.com' } }),
]
