/**
 * Dado do protótipo de permissões de cargos. Tudo fictício.
 *
 * A estrutura vem do develop (tela `settings/access/roles/<id>/permissions`,
 * visitada em 08/10/2026) e dos tipos do `@be-enlighten/enspace-sdk-schemas`:
 *
 * - `ItemType` (a categoria): `id`, `name`, `slug`, `icon`;
 * - `Field` (o campo): `name`, `label`, `type`;
 * - `Role` (o cargo): `id`, `name`, `icon`, `status`.
 *
 * Os valores são inventados. Nenhum nome de cliente real.
 */
import type { Field, ItemType, Member, Role } from '@be-enlighten/enspace-sdk-schemas'

/* ------------------------------------------------------------------ *
 * As 4 ações do modelo CRUD, como a árvore do develop chama.
 * ------------------------------------------------------------------ */

export type Acao = 'criar' | 'ver' | 'atualizar' | 'excluir'
export const acoes: Acao[] = ['criar', 'ver', 'atualizar', 'excluir']


/**
 * "Quais itens": ações que podem valer só para parte dos itens.
 *
 * - criador (`is_owner`): a pessoa criou o item;
 * - responsável: a pessoa está num campo Pessoa do item (o "atribuído a mim"
 *   de Pipefy e monday). Na categoria, escolhe-se quais campos Pessoa contam;
 *   no padrão, vale qualquer campo Pessoa.
 *
 * As 2 marcadas valem com OU: criador ou responsável. Nada marcado = todos.
 * Criar fica de fora: quem cria é sempre o criador.
 * Proposta: no develop o campo `rules` existe, mas a tela não grava nada nele.
 */
export type AcaoDeAlcance = 'ver' | 'atualizar' | 'excluir'
export const acoesDeAlcance: AcaoDeAlcance[] = ['ver', 'atualizar', 'excluir']
export interface RegraDeItens {
  criador: boolean
  responsavel: boolean
}

/** As ações que carregam lista de campos no develop. Excluir não carrega. */
export type AcaoDeCampo = 'criar' | 'ver' | 'atualizar'
export const acoesDeCampo: AcaoDeCampo[] = ['criar', 'ver', 'atualizar']

/**
 * O formato que o develop grava, medido no POST `/ws/roles/129/permissions`
 * em 08/10/2026: `{ reference: "types::leve::delete", fields: [], rules: [] }`.
 *
 * Diverge do `RolePermission` do SDK (`action`, `subject`, `conditions`,
 * `fields`). Por isso o tipo é declarado aqui e não importado. Achado no BRIEFING.
 */
export interface PermissaoGravada {
  reference: string
  fields: string[]
  rules: string[]
}

/* ------------------------------------------------------------------ *
 * Categoria, campo e formulário.
 * ------------------------------------------------------------------ */

export type CampoMock = Pick<Field, 'name' | 'label' | 'type'>

/** O SDK não publica schema de formulário. Os 2 campos são do protótipo. */
export interface FormularioMock {
  id: number
  nome: string
}

export interface CategoriaMock extends Pick<ItemType, 'id' | 'name' | 'slug' | 'icon'> {
  campos: CampoMock[]
  formularios: FormularioMock[]
}

/** O cargo aberto na tela. */
export const cargo: Pick<Role, 'id' | 'name' | 'icon' | 'status'> & {
  /** Vem de `/ws/members`, não do Role. Invenção do protótipo para a confirmação. */
  pessoas: number
} = {
  id: 129,
  name: 'Analista de Contratos',
  icon: 'i-lucide-clipboard-list',
  status: 'active',
  pessoas: 14,
}

export const workspace = { nome: 'Aurora Serviços', slug: 'aurora-servicos' }

/**
 * As 14 pessoas com o cargo, tipadas pelo `Member` do SDK (`/ws/members`).
 * Nomes e e-mails inventados, no domínio reservado `.example`.
 */
export type MembroDoCargo = Pick<Member, 'id' | 'status' | 'type' | 'email' | 'role'> & {
  meta: { fname: string, lname: string }
}

const nomes: [string, string, Member['type'], Member['status']][] = [
  ['Beatriz', 'Andrade', 'full', 'active'],
  ['Caio', 'Moreira', 'standard', 'active'],
  ['Daniela', 'Fontes', 'standard', 'active'],
  ['Eduardo', 'Rezende', 'standard', 'active'],
  ['Fernanda', 'Lacerda', 'standard', 'active'],
  ['Gustavo', 'Paiva', 'full', 'active'],
  ['Helena', 'Queiroz', 'standard', 'active'],
  ['Igor', 'Tavares', 'standard', 'active'],
  ['Juliana', 'Barreto', 'standard', 'active'],
  ['Leonardo', 'Siqueira', 'standard', 'inactive'],
  ['Marina', 'Coutinho', 'standard', 'active'],
  ['Natália', 'Vasconcelos de Albuquerque Prado', 'standard', 'active'],
  ['Otávio', 'Brandão', 'viewer', 'active'],
  ['Patrícia', 'Nogueira', 'standard', 'pending'],
]

export const membrosDoCargo: MembroDoCargo[] = nomes.map(([fname, lname, type, status], i) => ({
  id: 500 + i,
  status,
  type,
  role: 129,
  email: `${fname.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()}.${lname.split(' ')[0]!.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()}@aurora.example`,
  meta: { fname, lname },
}))

/** Os campos Pessoa de uma categoria: são os que podem definir o responsável. */
export function camposPessoa(c: { campos: CampoMock[] }) {
  return c.campos.filter(f => f.type === 'EnPerson')
}

/**
 * Os outros cargos do workspace, para "Quem acessa esta categoria".
 * `pessoas` vem de `/ws/members`, não do Role (invenção do protótipo).
 */
export const outrosCargos: (Pick<Role, 'id' | 'name' | 'icon'> & { pessoas: number })[] = [
  { id: 130, name: 'Gestor Jurídico', icon: 'i-lucide-scale', pessoas: 3 },
  { id: 131, name: 'Assistente Financeiro', icon: 'i-lucide-wallet', pessoas: 9 },
  { id: 132, name: 'Analista de RH', icon: 'i-lucide-users', pessoas: 6 },
  { id: 133, name: 'Comprador', icon: 'i-lucide-shopping-cart', pessoas: 5 },
  { id: 134, name: 'Diretoria', icon: 'i-lucide-briefcase', pessoas: 4 },
  { id: 135, name: 'Visitante', icon: 'i-lucide-user-round', pessoas: 22 },
]

/** O que cada outro cargo faz numa categoria. Regra fixa, para o dado ser verossímil. */
export function acessoDeOutroCargo(idCargo: number, nomeDaCategoria: string): Record<Acao, boolean> {
  const tudo = { criar: true, ver: true, atualizar: true, excluir: true }
  const ver = { criar: false, ver: true, atualizar: false, excluir: false }
  const nada = { criar: false, ver: false, atualizar: false, excluir: false }
  const n = nomeDaCategoria
  switch (idCargo) {
    case 130: return /Contrat|Aditivo|Procura|Processo|Notifica|Parecer|Marca|Termo/.test(n) ? tudo : ver
    case 131: return /Nota|Contas|Reembolso|Adiantamento|Orçamento|Centro/.test(n) ? tudo : nada
    case 132: return /Admiss|Deslig|Férias|Avalia|Treina|Vaga/.test(n) ? tudo : nada
    case 133: return /Pedido|Cota|Cadastro de Forn|Homologa/.test(n) ? tudo : /Contratos de Forn/.test(n) ? ver : nada
    case 134: return { criar: false, ver: true, atualizar: true, excluir: false }
    default: return ver
  }
}

/* ------------------------------------------------------------------ *
 * Gerador determinístico. Mesmo cenário, mesmo dado em todo reload.
 * ------------------------------------------------------------------ */

function sorteador(semente: number) {
  let a = semente
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const processos: { nome: string, icone: string }[] = [
  { nome: 'Contratos de Fornecedores', icone: 'i-lucide-file-signature' },
  { nome: 'Contratos de Clientes', icone: 'i-lucide-file-check' },
  { nome: 'Aditivos Contratuais', icone: 'i-lucide-file-plus' },
  { nome: 'Procurações', icone: 'i-lucide-stamp' },
  { nome: 'Processos Judiciais', icone: 'i-lucide-scale' },
  { nome: 'Notificações Extrajudiciais', icone: 'i-lucide-mail-warning' },
  { nome: 'Pareceres Jurídicos', icone: 'i-lucide-gavel' },
  { nome: 'Marcas e Patentes', icone: 'i-lucide-badge-check' },
  { nome: 'Notas Fiscais de Entrada', icone: 'i-lucide-receipt' },
  { nome: 'Contas a Pagar', icone: 'i-lucide-wallet' },
  { nome: 'Contas a Receber', icone: 'i-lucide-hand-coins' },
  { nome: 'Reembolsos', icone: 'i-lucide-receipt-text' },
  { nome: 'Adiantamentos de Viagem', icone: 'i-lucide-plane' },
  { nome: 'Orçamento Anual', icone: 'i-lucide-chart-pie' },
  { nome: 'Centros de Custo', icone: 'i-lucide-landmark' },
  { nome: 'Admissões', icone: 'i-lucide-user-plus' },
  { nome: 'Desligamentos', icone: 'i-lucide-user-minus' },
  { nome: 'Férias', icone: 'i-lucide-palmtree' },
  { nome: 'Avaliações de Desempenho', icone: 'i-lucide-star' },
  { nome: 'Treinamentos', icone: 'i-lucide-graduation-cap' },
  { nome: 'Vagas Abertas', icone: 'i-lucide-briefcase' },
  { nome: 'Chamados de TI', icone: 'i-lucide-monitor-cog' },
  { nome: 'Acessos a Sistemas', icone: 'i-lucide-key-round' },
  { nome: 'Inventário de Equipamentos', icone: 'i-lucide-laptop' },
  { nome: 'Licenças de Software', icone: 'i-lucide-app-window' },
  { nome: 'Incidentes de Segurança', icone: 'i-lucide-shield-alert' },
  { nome: 'Pedidos de Compra', icone: 'i-lucide-shopping-cart' },
  { nome: 'Cotações', icone: 'i-lucide-list-checks' },
  { nome: 'Cadastro de Fornecedores', icone: 'i-lucide-truck' },
  { nome: 'Homologação de Fornecedores', icone: 'i-lucide-clipboard-check' },
  { nome: 'Ordens de Serviço', icone: 'i-lucide-wrench' },
  { nome: 'Manutenção Predial', icone: 'i-lucide-building-2' },
  { nome: 'Reservas de Sala', icone: 'i-lucide-door-open' },
  { nome: 'Solicitações de Marketing', icone: 'i-lucide-megaphone' },
  { nome: 'Eventos Corporativos', icone: 'i-lucide-party-popper' },
  { nome: 'Reclamações de Clientes', icone: 'i-lucide-message-square-warning' },
  { nome: 'Oportunidades Comerciais', icone: 'i-lucide-target' },
  { nome: 'Propostas Comerciais', icone: 'i-lucide-handshake' },
  { nome: 'Auditorias Internas', icone: 'i-lucide-search-check' },
  // Caso de canto: nome longo que estoura a coluna.
  { nome: 'Termos de Confidencialidade com Parceiros Estratégicos Internacionais', icone: 'i-lucide-lock' },
]

const unidades = ['', ' (Filial Sul)', ' (Filial Norte)']

const poolDeCampos: { label: string, type: Field['type'] }[] = [
  { label: 'Status', type: 'EnlDropdown' },
  { label: 'Título', type: 'inputText' },
  { label: 'Descrição', type: 'EnTextArea' },
  { label: 'Responsável', type: 'EnPerson' },
  { label: 'Solicitante', type: 'EnPerson' },
  { label: 'Data de abertura', type: 'EnlCalendar' },
  { label: 'Prazo', type: 'EnlCalendar' },
  { label: 'Valor', type: 'EnlNumber' },
  { label: 'Valor do contrato', type: 'EnlNumber' },
  { label: 'Centro de custo', type: 'EnlDropdown' },
  { label: 'Fornecedor', type: 'EnRel' },
  { label: 'Cliente', type: 'EnRel' },
  { label: 'CNPJ', type: 'EnlMask' },
  { label: 'E-mail de contato', type: 'email' },
  { label: 'Endereço', type: 'EnAddress' },
  { label: 'Anexos', type: 'uploadFile' },
  { label: 'Contrato assinado', type: 'EnPDF' },
  { label: 'Minuta', type: 'EnOnlyoffice' },
  { label: 'Prioridade', type: 'radioButton' },
  { label: 'Tags', type: 'EnlChips' },
  { label: 'Aprovado pela diretoria', type: 'inputSwitch' },
  { label: 'Observações internas', type: 'EnHtml' },
  { label: 'Itens do pedido', type: 'EnRepeater' },
  { label: 'Áreas envolvidas', type: 'multiSelect' },
  { label: 'Vigência', type: 'EnlTimeRange' },
  { label: 'Índice de reajuste', type: 'EnlDropdown' },
  { label: 'Multa por rescisão', type: 'EnlNumber' },
  { label: 'Forma de pagamento', type: 'EnlDropdown' },
  { label: 'Banco', type: 'inputText' },
  { label: 'Agência e conta', type: 'EnlMask' },
  { label: 'Salário', type: 'EnlNumber' },
  { label: 'CPF', type: 'EnlMask' },
  { label: 'Cargo pretendido', type: 'inputText' },
  { label: 'Gestor imediato', type: 'EnPerson' },
  { label: 'Unidade', type: 'EnTreeSelect' },
  { label: 'Classificação de risco', type: 'radioButton' },
  { label: 'Parecer', type: 'EnHtml' },
  { label: 'Número do processo', type: 'EnlMask' },
  { label: 'Vara', type: 'inputText' },
  { label: 'Comarca', type: 'inputText' },
  { label: 'Valor da causa', type: 'EnlNumber' },
  { label: 'Probabilidade de perda', type: 'EnlDropdown' },
  { label: 'Documentos pessoais', type: 'uploadImage' },
  { label: 'Checklist de entrega', type: 'EnlCheckbox' },
  { label: 'Itens relacionados', type: 'EnRelMulti' },
  { label: 'Nota da avaliação', type: 'EnlNumber' },
  { label: 'Data de conclusão', type: 'EnlCalendar' },
  { label: 'Motivo da recusa', type: 'EnTextArea' },
  { label: 'Código interno', type: 'EnlMask' },
  { label: 'Versão', type: 'EnlNumber' },
]

const nomesDeFormulario = [
  'Abertura', 'Triagem', 'Análise jurídica', 'Aprovação financeira', 'Aprovação da diretoria',
  'Assinatura', 'Encerramento', 'Revisão', 'Cadastro rápido', 'Portal do fornecedor',
  'Complemento de dados', 'Auditoria',
]

function gerarCategoria(i: number, unidade: string, sortear: () => number): CategoriaMock {
  const p = processos[i % processos.length]!
  const base = p.nome
  const slug = (base + unidade).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

  // Volume de campos: a maioria entre 12 e 40; algumas passam de 70, como no develop.
  const qtdCampos = i === 0 ? 80 : Math.round(12 + sortear() * (sortear() > 0.85 ? 60 : 28))
  const campos: CampoMock[] = []
  for (let c = 0; c < qtdCampos; c++) {
    const modelo = poolDeCampos[c % poolDeCampos.length]!
    const repeticao = Math.floor(c / poolDeCampos.length)
    const label = repeticao ? `${modelo.label} ${repeticao + 1}` : modelo.label
    campos.push({
      name: `data.${slug}_${label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_')}`,
      label,
      type: modelo.type,
    })
  }

  const qtdForms = i === 0 ? 12 : 1 + Math.floor(sortear() * 8)
  const formularios: FormularioMock[] = nomesDeFormulario.slice(0, qtdForms).map((nome, f) => ({
    id: (i + 1) * 100 + f,
    nome,
  }))

  return { id: 1000 + i, name: base + unidade, slug, icon: p.icone, campos, formularios }
}

export type Cenario = 'develop' | 'medio' | 'grande' | 'vazio'

/** As categorias do workspace em cada volume. */
export function categoriasDoCenario(cenario: Cenario): CategoriaMock[] {
  const sortear = sorteador(7)
  if (cenario === 'vazio')
    return []
  if (cenario === 'develop')
    return [0, 1].map(i => gerarCategoria(i, '', sortear))
  const lista: CategoriaMock[] = []
  const vezes = cenario === 'medio' ? 1 : unidades.length
  for (let u = 0; u < vezes; u++) {
    processos.forEach((_, i) => lista.push(gerarCategoria(i + u * processos.length, unidades[u]!, sortear)))
  }
  return lista
}

/* ------------------------------------------------------------------ *
 * As permissões fixas: não crescem com o workspace.
 * Rótulos e ações copiados da árvore do develop em 08/10/2026.
 * ------------------------------------------------------------------ */

export interface LinhaFixa {
  chave: string
  icone: string
  /** As ações CRUD que existem nesta linha. */
  acoes: Acao[]
  /** Ações fora do CRUD ("Iniciar Spaceflow", "Usar Chat da IA", "Reenviar"). */
  outras?: string[]
}

export interface GrupoFixo {
  chave: string
  linhas: LinhaFixa[]
}

const CRUD: Acao[] = ['criar', 'ver', 'atualizar', 'excluir']

/** Aba Dados, seção "Padrão": 15 permissões. */
export const padrao: GrupoFixo[] = [{
  chave: 'padrao',
  linhas: [
    { chave: 'agenda', icone: 'i-lucide-calendar-days', acoes: CRUD },
    { chave: 'ia', icone: 'i-lucide-bot', acoes: [], outras: ['usarChat'] },
    { chave: 'spaceflows', icone: 'i-lucide-workflow', acoes: ['ver', 'atualizar'], outras: ['iniciarSpaceflow'] },
    { chave: 'tarefasRapidas', icone: 'i-lucide-zap', acoes: CRUD },
    { chave: 'tarefasProgramadas', icone: 'i-lucide-calendar-clock', acoes: ['ver', 'atualizar', 'excluir'] },
  ],
}]

/** Aba Configurações: 67 permissões em 8 seções. */
export const configuracoes: GrupoFixo[] = [
  {
    chave: 'sistemas',
    linhas: [
      { chave: 'calendario', icone: 'i-lucide-calendar', acoes: CRUD },
      { chave: 'configuracao', icone: 'i-lucide-settings', acoes: ['ver', 'atualizar'] },
      { chave: 'dicionario', icone: 'i-lucide-book-a', acoes: CRUD },
      { chave: 'espacoDeTrabalho', icone: 'i-lucide-house', acoes: ['ver', 'atualizar'] },
      { chave: 'modulos', icone: 'i-lucide-boxes', acoes: ['ver', 'atualizar'] },
    ],
  },
  {
    chave: 'dados',
    linhas: [
      { chave: 'listas', icone: 'i-lucide-list', acoes: CRUD },
      { chave: 'spaceflowsConfig', icone: 'i-lucide-workflow', acoes: CRUD },
      { chave: 'tipos', icone: 'i-lucide-layout-grid', acoes: CRUD },
    ],
  },
  {
    chave: 'acesso',
    linhas: [
      { chave: 'cargos', icone: 'i-lucide-id-card', acoes: CRUD },
      { chave: 'grupos', icone: 'i-lucide-users', acoes: CRUD },
      { chave: 'membros', icone: 'i-lucide-contact', acoes: CRUD },
    ],
  },
  {
    chave: 'interface',
    linhas: [
      { chave: 'casosDeUso', icone: 'i-lucide-database', acoes: ['criar', 'ver'] },
      { chave: 'menu', icone: 'i-lucide-menu', acoes: CRUD },
      { chave: 'telas', icone: 'i-lucide-monitor', acoes: CRUD },
    ],
  },
  {
    chave: 'emails',
    linhas: [
      { chave: 'caixas', icone: 'i-lucide-inbox', acoes: CRUD },
      { chave: 'enviados', icone: 'i-lucide-send', acoes: ['ver'], outras: ['reenviar'] },
      { chave: 'modelos', icone: 'i-lucide-file-text', acoes: CRUD },
    ],
  },
  {
    chave: 'integracoes',
    linhas: [{ chave: 'integracoes', icone: 'i-lucide-blocks', acoes: CRUD }],
  },
  {
    chave: 'logs',
    linhas: [{ chave: 'logs', icone: 'i-lucide-activity', acoes: ['ver'] }],
  },
  {
    chave: 'credenciais',
    linhas: [{ chave: 'credenciais', icone: 'i-lucide-key-round', acoes: CRUD }],
  },
]

/**
 * Simulação do andaime: uma área com 5 ações fora do CRUD, para ver como a
 * coluna "Outras ações" se comporta quando há mais de uma na mesma linha.
 * Hoje o develop tem no máximo 1 por área (Usar Chat da IA, Iniciar Spaceflow,
 * Reenviar). Estas 5 são inventadas.
 */
export const outrasSimuladas = ['exportar', 'importar', 'arquivar', 'comentar', 'duplicar']

export function padraoComOutrasSimuladas(): GrupoFixo[] {
  return padrao.map(g => ({
    ...g,
    linhas: g.linhas.map(l => l.chave === 'tarefasRapidas' ? { ...l, outras: [...outrasSimuladas] } : l),
  }))
}

/** O que o cargo já tem nas permissões fixas, ao abrir a tela. Chave `linha:acao`. */
export const fixasIniciais: string[] = [
  'agenda:ver', 'agenda:criar', 'ia:usarChat', 'spaceflows:ver', 'spaceflows:iniciarSpaceflow',
  'tarefasRapidas:criar', 'tarefasRapidas:ver', 'tarefasRapidas:atualizar',
  'tarefasProgramadas:ver', 'tarefasProgramadas:atualizar',
  'calendario:ver', 'dicionario:ver', 'listas:ver', 'membros:ver', 'enviados:ver',
]
