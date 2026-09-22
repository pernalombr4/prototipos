/**
 * Dado do protótipo de Tarefas Rápidas.
 *
 * Estrutura: tirada do payload real de `GET /tasks` do develop e do schema
 * `Task` do @be-enlighten/enspace-sdk-schemas. Valores: todos inventados.
 * Nenhum dado de cliente real entra aqui (regra 9 e 13).
 *
 * O que o payload da tarefa NÃO traz, e por isso mora em mapa separado aqui:
 *  - o usuário resolvido: a tarefa carrega só `assigned_to`/`creator` (id numérico);
 *  - o item (chamado/demanda) a que ela está pendurada: a tarefa carrega só `item`
 *    (id) e `meta.itemReference`. Os dados custam uma segunda chamada em
 *    `GET /ws/types/{slug}/items/{reference}`;
 *  - as etiquetas: `tag_ids` é lista de id.
 * Isso está separado de propósito: é o que o time de front vai precisar decidir
 * (resolver no back ou pagar a segunda chamada) para o cartão ficar completo.
 */
import { reactive } from 'vue'
import type { Task } from '@be-enlighten/enspace-sdk-schemas'

/* ------------------------------------------------------------------ *
 * Pessoas (recorte do `User` do schema: id, fullname, username, meta) *
 * ------------------------------------------------------------------ */
export interface Pessoa {
  id: number
  fullname: string
  username: string
  /** Iniciais são derivadas, não vêm da API. */
  iniciais: string
  cargo: string
}

export const pessoas: Record<number, Pessoa> = {
  4057: { id: 4057, fullname: 'Mikaela Jardim', username: 'mikaela.jardim', iniciais: 'MJ', cargo: 'Produto' },
  4061: { id: 4061, fullname: 'Rafael Quintanilha', username: 'rafael.quintanilha', iniciais: 'RQ', cargo: 'Suporte' },
  4072: { id: 4072, fullname: 'Bruna Sato', username: 'bruna.sato', iniciais: 'BS', cargo: 'Liderança' },
  4088: { id: 4088, fullname: 'Ivo Vasconcelos Nogueira', username: 'ivo.nogueira', iniciais: 'IV', cargo: 'Desenvolvimento' },
  4090: { id: 4090, fullname: 'Alice Ferraz', username: 'alice.ferraz', iniciais: 'AF', cargo: 'Desenvolvimento' },
}

/* ----------------------------------------------------- *
 * Etiquetas (a tarefa carrega só os ids em `tag_ids`)    *
 * ----------------------------------------------------- */
export interface Etiqueta {
  id: number
  nome: string
  cor: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
}

export const etiquetas: Record<number, Etiqueta> = {
  1: { id: 1, nome: 'Cliente VIP', cor: 'warning' },
  2: { id: 2, nome: 'Regressão', cor: 'error' },
  3: { id: 3, nome: 'Onboarding', cor: 'info' },
  4: { id: 4, nome: 'Faturamento', cor: 'primary' },
}

/* ------------------------------------------------------------------ *
 * Item relacionado. NÃO vem no payload da tarefa: é a segunda chamada *
 * ------------------------------------------------------------------ */
export interface ItemRelacionado {
  id: number
  reference: string
  /** Rótulo da categoria no workspace, ex.: Chamado, Demanda. */
  categoria: string
  titulo: string
  /** Identificador curto que a pessoa lê, ex.: CHA-4812. */
  codigo: string
}

export const itensRelacionados: Record<number, ItemRelacionado> = {
  574378: { id: 574378, reference: 'CHAB61C700CD08947259EAB2D67BAFCD', categoria: 'Chamado', titulo: 'Acesso negado ao portal depois da troca de plano', codigo: 'CHA-4812' },
  574401: { id: 574401, reference: 'CHA10F15842341F4F159F6AB4E4A8922', categoria: 'Chamado', titulo: 'Boleto duplicado na virada do mês', codigo: 'CHA-4815' },
  574420: { id: 574420, reference: 'DEM5C0A1F2B77D94E2B8C1D0E6F3A9B44', categoria: 'Demanda', titulo: 'Exportar relatório de horas por equipe', codigo: 'DEM-1190' },
  574455: { id: 574455, reference: 'CHA77B2E9013C4D4A5C9F2E1B8D6A4C310', categoria: 'Chamado', titulo: 'Integração com o ERP parou de sincronizar', codigo: 'CHA-4822' },
}

/* --------------------------------------------- *
 * Definição de formulário desenhado no nó        *
 * (é o formato de `meta.form` quando type=form)  *
 * --------------------------------------------- */
export interface CampoDeFormulario {
  name: string
  refId: string
  path?: string
  label: string
  /** `EnlNumber`, `EnlDropdown`, `EnTextArea`, `EnlCalendar`, `EnlMask`… */
  type: string
  width?: string
  icon?: string
  colorScheme?: string
  validation?: string[]
  options?: { label: string, value: string }[]
  conditionals?: { or: { op: string, ref: string, value: string }[], and: unknown[] }
  /**
   * O formatador do campo, como o `Field.cFormat` do schema. É ele que diz se
   * um `EnlNumber` é número puro ou dinheiro: moeda é `n_style: 'currency'`,
   * não um tipo separado.
   */
  cFormat?: {
    type?: 'number' | 'currency' | 'date' | 'text'
    locale?: string
    n_style?: 'currency' | 'decimal' | 'percent'
    n_currencyDisplay?: 'symbol' | 'name' | 'code'
    n_minimumFractionDigits?: number
    /** Código ISO da moeda. O schema guarda no campo, aqui fica explícito. */
    moeda?: string
  }
}

const formDecisaoCancelada: CampoDeFormulario[] = [
  {
    name: 'decisao_cancelada',
    refId: 'decisao_cancelada',
    path: 'decisao_cancelada',
    label: 'O que fazer com este pedido?',
    type: 'EnlDropdown',
    width: '12',
    icon: 'mdi:form',
    colorScheme: 'primary',
    validation: ['required'],
    options: [
      { label: 'Abrir demanda nova, o cenário mudou', value: 'nova' },
      { label: 'Manter a recusa', value: 'recusar' },
    ],
    conditionals: { or: [], and: [] },
  },
  {
    name: 'valor_do_pedido',
    refId: 'valor_do_pedido',
    path: 'valor_do_pedido',
    label: 'Valor do pedido',
    type: 'EnlNumber',
    width: '6',
    cFormat: { type: 'currency', locale: 'pt-BR', n_style: 'currency', n_currencyDisplay: 'symbol', n_minimumFractionDigits: 2, moeda: 'BRL' },
    conditionals: { or: [], and: [] },
  },
  {
    name: 'observacoes',
    refId: 'observacoes',
    path: 'observacoes',
    label: 'Por que o cenário mudou?',
    type: 'EnTextArea',
    width: '12',
    validation: ['required'],
    conditionals: { or: [{ op: '==', ref: '%decisao_cancelada%', value: 'nova' }], and: [] },
  },
]

const formTriagem: CampoDeFormulario[] = [
  {
    name: 'tipo_validado',
    refId: 'tipo_validado',
    label: 'O pedido é bug ou melhoria?',
    type: 'EnlDropdown',
    width: '6',
    validation: ['required'],
    options: [
      { label: 'Bug', value: 'bug' },
      { label: 'Melhoria', value: 'melhoria' },
    ],
    conditionals: { or: [], and: [] },
  },
  {
    name: 'prioridade_validada',
    refId: 'prioridade_validada',
    label: 'Qual a gravidade?',
    type: 'EnlDropdown',
    width: '6',
    validation: ['required'],
    options: [
      { label: 'Crítica', value: 'critica' },
      { label: 'Alta', value: 'alta' },
      { label: 'Normal', value: 'normal' },
    ],
    conditionals: { or: [], and: [] },
  },
  {
    name: 'horas_estimadas',
    refId: 'horas_estimadas',
    label: 'Horas estimadas de correção',
    type: 'EnlNumber',
    width: '6',
    cFormat: { type: 'number', locale: 'pt-BR', n_style: 'decimal', n_minimumFractionDigits: 1 },
    conditionals: { or: [], and: [] },
  },
  {
    name: 'custo_estimado',
    refId: 'custo_estimado',
    label: 'Custo estimado do retrabalho',
    type: 'EnlNumber',
    width: '6',
    cFormat: { type: 'currency', locale: 'pt-BR', n_style: 'currency', n_currencyDisplay: 'symbol', n_minimumFractionDigits: 2, moeda: 'BRL' },
    conditionals: { or: [], and: [] },
  },
  {
    name: 'plano_de_contorno',
    refId: 'plano_de_contorno',
    label: 'Qual o contorno enquanto não sai a correção?',
    type: 'EnTextArea',
    width: '12',
    conditionals: { or: [{ op: '==', ref: '%prioridade_validada%', value: 'critica' }], and: [] },
  },
]

/* ------------------------------------------------------------------ *
 * TEMPO                                                               *
 *                                                                     *
 * ⚠️ NADA DISTO EXISTE NO PAYLOAD DA TAREFA HOJE. O schema `Task` não  *
 * tem estimativa nem tempo registrado, e não há rota de apontamento.   *
 * Para implementar, o back precisa de:                                 *
 *                                                                      *
 *  - um campo novo na tarefa, `time_estimate` em segundos (no ClickUp  *
 *    é o "Time Estimate", separado do tempo registrado);               *
 *  - um recurso novo de registros, algo como                           *
 *    `GET/POST /tasks/{id}/time-entries`, porque um apontamento tem    *
 *    dono, começo, fim, nota, etiqueta e a marca de faturável, e isso  *
 *    não cabe num campo da tarefa;                                     *
 *  - soma por tarefa (e, se um dia houver subtarefa, o rollup que o    *
 *    ClickUp faz somando as filhas).                                   *
 *                                                                      *
 * Está tudo declarado no DECISOES.md, rodada 12.                       *
 * ------------------------------------------------------------------ */

/** Um apontamento, no formato que o ClickUp usa. */
export interface RegistroDeTempo {
  id: number
  /** Id da tarefa a que pertence. */
  tarefa: number
  /** Quem apontou. */
  usuario: number
  segundos: number
  inicio: Date
  /** Nota livre do apontamento. No ClickUp é a descrição da entrada. */
  nota?: string
  /** Etiqueta do apontamento, que é diferente da etiqueta da tarefa. */
  etiqueta?: string
  faturavel: boolean
}

/** Estimativa por tarefa, em segundos. Campo novo, ver aviso acima. */
export const estimativaDeTempo: Record<number, number> = {
  22078: 4 * 3600,
  22089: 6 * 3600,
  22090: 8 * 3600,
  22100: 2 * 3600,
  22079: 90 * 60,
}

/** Reativa de propósito: o protótipo aponta tempo e a tela tem que acompanhar. */
export const registrosDeTempo: RegistroDeTempo[] = reactive([
  { id: 1, tarefa: 22078, usuario: 4057, segundos: 75 * 60, inicio: d('2026-09-21T12:10:00.000Z'), nota: 'Leitura do chamado e do histórico com o cliente', etiqueta: 'Análise', faturavel: true },
  { id: 2, tarefa: 22078, usuario: 4072, segundos: 40 * 60, inicio: d('2026-09-21T13:30:00.000Z'), nota: 'Revisão do texto antes de enviar', faturavel: true },
  { id: 3, tarefa: 22089, usuario: 4090, segundos: 2 * 3600 + 20 * 60, inicio: d('2026-09-21T09:00:00.000Z'), nota: 'Conferência do lote um', etiqueta: 'Migração', faturavel: true },
  { id: 4, tarefa: 22089, usuario: 4090, segundos: 35 * 60, inicio: d('2026-09-21T14:05:00.000Z'), nota: 'Contato com o financeiro sobre a diferença', faturavel: false },
  { id: 5, tarefa: 22090, usuario: 4088, segundos: 3 * 3600 + 10 * 60, inicio: d('2026-09-20T14:00:00.000Z'), nota: 'Investigação da fila travada', etiqueta: 'Correção', faturavel: true },
  { id: 6, tarefa: 22100, usuario: 4061, segundos: 55 * 60, inicio: d('2026-09-20T10:15:00.000Z'), faturavel: true },
  { id: 7, tarefa: 22079, usuario: 4072, segundos: 25 * 60, inicio: d('2026-09-21T11:00:00.000Z'), nota: 'Busca da demanda parecida', faturavel: false },
])

/* --------------------------------------------------------- *
 * As tarefas                                                 *
 * --------------------------------------------------------- */

/** Hoje do protótipo. Fixo, para o cartão de prazo não mudar de cor sozinho. */
export const hoje = new Date('2026-09-21T14:00:00.000Z')

function d(iso: string) {
  return new Date(iso)
}

/** Preenche o que toda tarefa tem, para o mock não virar parede de repetição. */
function tarefa(parcial: Partial<Task> & Pick<Task, 'id' | 'reference' | 'name' | 'status'>): Task {
  return {
    created_at: d('2026-09-21T11:00:00.000Z'),
    updated_at: d('2026-09-21T11:00:00.000Z'),
    deleted_at: null,
    description: null,
    workspace: 'produtos',
    type: 'generic',
    priority: 'normal',
    due_date: null,
    points: 0,
    meta: {},
    creator: 4057,
    assigned_to: 4057,
    completed_by: null,
    completed_at: null,
    node_execution: null,
    item: null,
    notification_task: false,
    archived: false,
    collaborators: null,
    // O payload real devolve `external_task` como objeto (link público) ou null.
    // O schema declara número. Divergência registrada no DECISOES.md.
    external_task: null,
    permissions: null,
    tag_ids: [],
    ...parcial,
  } as Task
}

export const tarefas: Task[] = [
  /* ------------------------------------------------------------------ *
   * A tarefa completa: todo campo possível preenchido. É o caso de      *
   * borda que o cartão precisa aguentar sem virar parede de informação. *
   * ------------------------------------------------------------------ */
  tarefa({
    id: 22078,
    reference: 'KKwRcYSR9tBzfddG8nsXHI8msyYNVhOE',
    name: 'Revisar a resposta ao cliente antes de enviar, o texto vai direto para quem abriu o chamado',
    description: '<p><strong>Atenção: este texto vai direto para o cliente.</strong></p><p>O que ficar no campo abaixo é enviado por e-mail ao solicitante exatamente como está. Confira o tom, os prazos citados e os dados do contrato.</p>',
    type: 'form',
    status: 'pending',
    priority: 'urgent',
    due_date: d('2026-09-21T22:56:55.290Z'),
    points: 13,
    created_at: d('2026-09-21T11:56:55.525Z'),
    updated_at: d('2026-09-21T13:10:02.000Z'),
    meta: { form: formTriagem, itemReference: 'CHAB61C700CD08947259EAB2D67BAFCD' },
    creator: 4061,
    assigned_to: 4057,
    node_execution: 615147,
    item: 574378,
    notification_task: true,
    collaborators: [4072, 4088],
    // Três etiquetas de propósito: esta é a tarefa do pior caso, e é preciso
    // que o contador "+1" do que não coube no cartão apareça em algum lugar.
    tag_ids: [1, 2, 4],
    permissions: [12, 18],
  }),

  /* ----------------------------- pendentes ----------------------------- */
  tarefa({
    id: 22079,
    reference: 'Lm4TpQ2xRfVbNc8Ks1WdZy7HgJ0EaU6I',
    name: 'Confirmar a duplicidade com a demanda já aberta pelo time de suporte',
    description: '<p>A IA procurou no workspace inteiro e encontrou uma demanda que parece tratar do mesmo assunto deste chamado.</p>',
    type: 'crud',
    status: 'pending',
    priority: 'high',
    due_date: d('2026-09-20T18:00:00.000Z'),
    points: 5,
    created_at: d('2026-09-21T10:32:00.000Z'),
    meta: { form: 'DUnVSD194euEu2XOc8y9GzIUaDXhnCEk', itemReference: 'DEM5C0A1F2B77D94E2B8C1D0E6F3A9B44' },
    assigned_to: 4072,
    item: 574420,
    node_execution: 615150,
    tag_ids: [3],
  }),
  tarefa({
    id: 22080,
    reference: 'Pq9ZxLn3KsWb2TvRc5Yd8Hf1Ga6JmE0U',
    name: 'Decidir o encaminhamento da demanda cancelada',
    description: '<p>A IA encontrou uma demanda <strong>cancelada</strong> que trata do mesmo assunto deste chamado. Cancelamento não é recusa definitiva.</p>',
    type: 'form',
    status: 'pending',
    priority: 'high',
    due_date: d('2026-09-22T12:00:00.000Z'),
    points: 8,
    created_at: d('2026-09-21T10:28:00.000Z'),
    meta: { form: formDecisaoCancelada, itemReference: 'CHA10F15842341F4F159F6AB4E4A8922' },
    assigned_to: 4061,
    item: 574401,
    node_execution: 615151,
    tag_ids: [4],
  }),
  tarefa({
    id: 22081,
    reference: 'Rt5YuIo8PaSd2FgHj4KlZx1Cv7Bn3Mq9',
    name: 'Novo chamado de acesso negado, cliente sem plano ativo',
    description: '<p>Cliente: Aurora Log, cliente comum de teste. Chamado aberto pelo portal às 9h12.</p>',
    type: 'crud',
    status: 'pending',
    points: 3,
    created_at: d('2026-09-21T09:49:00.000Z'),
    due_date: d('2026-09-24T18:00:00.000Z'),
    meta: { form: 'DUnVSD194euEu2XOc8y9GzIUaDXhnCEk', itemReference: 'CHA77B2E9013C4D4A5C9F2E1B8D6A4C310' },
    assigned_to: 4088,
    item: 574455,
  }),
  /* ------------------------------------------------------------------ *
   * O caso de borda da descrição: spaceflow que escreve um manual dentro *
   * da tarefa, com lista, aviso e um link gigante sem espaço. Existe para *
   * provar o corte no cartão e o "mostrar tudo" no painel.                *
   * ------------------------------------------------------------------ */
  tarefa({
    id: 22089,
    reference: 'Hg3JdKf9Lm2Pq8Rt5Yw1Zx4Cv7Bn0Ms',
    name: 'Conferir a migração de contratos antes de liberar o acesso do cliente',
    description: '<p><strong>Atenção: este roteiro foi gerado pelo fluxo de migração e precisa ser seguido na ordem.</strong></p>'
      + '<p>O cliente trocou de plano na virada do mês e os contratos vieram do sistema antigo em dois lotes. '
      + 'O primeiro lote entrou na madrugada de sexta e o segundo só na segunda de manhã, depois da fila destravar. '
      + 'Isso quer dizer que existem contratos duplicados, e é isso que esta tarefa pede para conferir antes de qualquer liberação de acesso.</p>'
      + '<p>Passo a passo combinado com o time de dados:</p>'
      + '<ol>'
      + '<li>Abrir a categoria Contratos e filtrar por data de criação nos dois dias citados.</li>'
      + '<li>Para cada contrato repetido, manter o que tem número de apólice preenchido e arquivar o outro.</li>'
      + '<li>Se os dois tiverem apólice, não arquive nada: marque a etiqueta Regressão e avise a liderança, porque aí o problema é do conversor e não do dado.</li>'
      + '<li>Conferir se o total de contratos ativos bate com o relatório que o time financeiro mandou por e-mail.</li>'
      + '<li>Só depois disso liberar o acesso, pela tela de Gestão de Membros.</li>'
      + '</ol>'
      + '<p>O relatório do financeiro está neste endereço, que precisa ser aberto com a conta do workspace: '
      + 'https://relatorios.exemplo-ficticio.com.br/financeiro/contratos/2026/09/conferencia-de-migracao-lote-um-e-lote-dois-consolidado.pdf</p>'
      + '<p>Se o total não bater por diferença de até três contratos, siga assim mesmo e anote a diferença no comentário. '
      + 'Acima disso, pare e escale: liberar acesso com contrato errado é cobrança errada no mês seguinte, e o cliente já abriu chamado por isso duas vezes neste trimestre.</p>'
      + '<p>Prazo combinado na reunião de quinta: antes do fechamento do dia, porque o time de implantação depende desta conferência para marcar o treinamento.</p>',
    type: 'crud',
    status: 'pending',
    priority: 'high',
    due_date: d('2026-09-22T21:00:00.000Z'),
    points: 8,
    created_at: d('2026-09-21T07:30:00.000Z'),
    meta: { form: 'DUnVSD194euEu2XOc8y9GzIUaDXhnCEk', itemReference: 'CHAB61C700CD08947259EAB2D67BAFCD' },
    assigned_to: 4090,
    item: 574378,
    collaborators: [4072],
    tag_ids: [1, 2],
  }),
  tarefa({
    id: 22082,
    reference: 'Wq2EdRf5TgYh8UjIk3OlPz6Xc9Vb1Nm4',
    name: 'Conferir o cadastro do fornecedor antes de liberar o pagamento',
    type: 'generic',
    status: 'pending',
    priority: 'normal',
    points: 0,
    created_at: d('2026-09-20T16:05:00.000Z'),
    assigned_to: null,
  }),
  tarefa({
    id: 22083,
    reference: 'Zx7Cv4Bn1Mq8Wr5Ty2Ui9Op6As3Df0Gh',
    name: 'Validar com a liderança o corte de escopo combinado na reunião de quinta',
    type: 'generic',
    status: 'pending',
    priority: 'low',
    due_date: d('2026-10-02T21:00:00.000Z'),
    points: 2,
    created_at: d('2026-09-19T14:20:00.000Z'),
    assigned_to: 4072,
    collaborators: [4057],
  }),
  tarefa({
    id: 22084,
    reference: 'Bn3Mq9Wr2Ty5Ui8Op1As4Df7Gh0Jk6Lz',
    name: 'Responder o pedido de reembolso com o cálculo do proporcional',
    description: '<p>O cliente pede o valor proporcional dos 11 dias em que ficou sem acesso.</p>',
    type: 'crud',
    status: 'pending',
    priority: 'high',
    due_date: d('2026-09-21T20:00:00.000Z'),
    points: 5,
    created_at: d('2026-09-21T08:14:00.000Z'),
    assigned_to: 4061,
    item: 574401,
    meta: { form: 'DUnVSD194euEu2XOc8y9GzIUaDXhnCEk', itemReference: 'CHA10F15842341F4F159F6AB4E4A8922' },
    tag_ids: [1, 4],
  }),
  tarefa({
    id: 22085,
    reference: 'Cv8Bn5Mq2Wr9Ty6Ui3Op0As7Df4Gh1Jk',
    name: 'Atualizar o texto do e-mail de boas-vindas com o novo endereço da central de ajuda',
    type: 'generic',
    status: 'pending',
    points: 1,
    created_at: d('2026-09-18T11:40:00.000Z'),
    assigned_to: 4090,
    tag_ids: [3],
  }),
  tarefa({
    id: 22086,
    reference: 'Df4Gh1Jk8Lz5Xc2Vb9Nm6Qw3Er0Ty7Ui',
    name: 'Aprovar a exceção de prazo pedida pelo time de implantação',
    type: 'approval',
    status: 'pending',
    priority: 'urgent',
    due_date: d('2026-09-19T21:00:00.000Z'),
    points: 8,
    created_at: d('2026-09-17T09:02:00.000Z'),
    assigned_to: 4072,
    collaborators: [4057, 4061],
    tag_ids: [1],
  }),
  tarefa({
    id: 22087,
    reference: 'Gh1Jk8Lz5Xc2Vb9Nm6Qw3Er0Ty7Ui4Op',
    name: 'Revisar a régua de cobrança do plano anual',
    type: 'generic',
    status: 'pending',
    points: 3,
    created_at: d('2026-09-16T15:30:00.000Z'),
    assigned_to: 4057,
    due_date: d('2026-09-30T21:00:00.000Z'),
    tag_ids: [4],
  }),
  tarefa({
    id: 22088,
    reference: 'Jk8Lz5Xc2Vb9Nm6Qw3Er0Ty7Ui4Op1As',
    name: 'Checar se o relatório de horas bate com o apontamento do mês',
    type: 'generic',
    status: 'pending',
    points: 0,
    created_at: d('2026-09-15T10:10:00.000Z'),
    assigned_to: null,
  }),

  /* --------------------------- em andamento --------------------------- */
  tarefa({
    id: 22090,
    reference: 'Lz5Xc2Vb9Nm6Qw3Er0Ty7Ui4Op1As8Df',
    name: 'Escrever a resposta técnica sobre a parada da integração com o ERP',
    description: '<p>O time de desenvolvimento confirmou que a fila travou na madrugada de sexta. Falta explicar isso em linguagem de cliente.</p>',
    type: 'form',
    status: 'working',
    priority: 'high',
    due_date: d('2026-09-22T18:00:00.000Z'),
    points: 8,
    created_at: d('2026-09-20T13:45:00.000Z'),
    updated_at: d('2026-09-21T09:30:00.000Z'),
    meta: { form: formTriagem, itemReference: 'CHA77B2E9013C4D4A5C9F2E1B8D6A4C310' },
    assigned_to: 4088,
    item: 574455,
    node_execution: 615160,
    tag_ids: [2],
  }),
  tarefa({
    id: 22091,
    reference: 'Xc2Vb9Nm6Qw3Er0Ty7Ui4Op1As8Df5Gh',
    name: 'Montar o cenário de teste do boleto duplicado',
    type: 'generic',
    status: 'working',
    points: 5,
    created_at: d('2026-09-21T08:00:00.000Z'),
    assigned_to: 4090,
    due_date: d('2026-09-23T21:00:00.000Z'),
  }),
  tarefa({
    id: 22092,
    reference: 'Vb9Nm6Qw3Er0Ty7Ui4Op1As8Df5Gh2Jk',
    name: 'Conferir os dados do contrato antes de encerrar o chamado do plano anual',
    type: 'crud',
    status: 'working',
    priority: 'low',
    points: 2,
    created_at: d('2026-09-19T17:20:00.000Z'),
    assigned_to: 4061,
    item: 574378,
    meta: { form: 'DUnVSD194euEu2XOc8y9GzIUaDXhnCEk', itemReference: 'CHAB61C700CD08947259EAB2D67BAFCD' },
  }),
  tarefa({
    id: 22093,
    reference: 'Nm6Qw3Er0Ty7Ui4Op1As8Df5Gh2Jk9Lz',
    name: 'Ajustar o filtro de período do painel de chamados',
    type: 'generic',
    status: 'working',
    points: 3,
    created_at: d('2026-09-18T09:15:00.000Z'),
    assigned_to: 4088,
    due_date: d('2026-09-21T21:00:00.000Z'),
    tag_ids: [2],
  }),

  /* ----------------------------- bloqueadas ----------------------------- */
  tarefa({
    id: 22095,
    reference: 'Qw3Er0Ty7Ui4Op1As8Df5Gh2Jk9Lz6Xc',
    name: 'Esperar o retorno do cliente sobre a janela de manutenção',
    description: '<p>Enviado em 18/09. Sem resposta até agora.</p>',
    type: 'generic',
    status: 'blocked',
    priority: 'high',
    due_date: d('2026-09-18T21:00:00.000Z'),
    points: 5,
    created_at: d('2026-09-16T11:00:00.000Z'),
    assigned_to: 4061,
    item: 574455,
    tag_ids: [1],
  }),
  tarefa({
    id: 22096,
    reference: 'Er0Ty7Ui4Op1As8Df5Gh2Jk9Lz6Xc3Vb',
    name: 'Liberar o acesso ao ambiente de homologação para o time do cliente',
    type: 'approval',
    status: 'blocked',
    points: 8,
    created_at: d('2026-09-14T16:40:00.000Z'),
    assigned_to: 4072,
    due_date: d('2026-09-17T21:00:00.000Z'),
  }),

  /* ----------------------------- concluídas ----------------------------- */
  tarefa({
    id: 22100,
    reference: 'Ty7Ui4Op1As8Df5Gh2Jk9Lz6Xc3Vb0Nm',
    name: 'Confirmar se o problema já tem correção liberada',
    description: '<p>A IA encontrou uma demanda de correção <strong>já concluída</strong> que parece ser exatamente este caso.</p>',
    type: 'form',
    status: 'completed',
    priority: 'normal',
    points: 5,
    created_at: d('2026-09-20T09:00:00.000Z'),
    completed_at: d('2026-09-20T15:22:00.000Z'),
    completed_by: 4061,
    assigned_to: 4061,
    item: 574378,
    node_execution: 615120,
    meta: {
      form: formTriagem,
      itemReference: 'CHAB61C700CD08947259EAB2D67BAFCD',
      form_result: {
        tipo_validado: 'bug',
        prioridade_validada: 'critica',
        horas_estimadas: 6.5,
        custo_estimado: 4200,
        plano_de_contorno: 'Reprocessar a fila manualmente às 7h enquanto a correção não sobe.',
        responsavel_acompanhamento_rel: { id: 413170, display: 'Bruna Sato', reference: 'TIMDAA656187C914F0695FA78C2F638A' },
      },
    },
    tag_ids: [2],
  }),
  tarefa({
    id: 22101,
    reference: 'Ui4Op1As8Df5Gh2Jk9Lz6Xc3Vb0Nm7Qw',
    name: 'Responder ao cliente sobre a cobrança em duplicidade',
    type: 'crud',
    status: 'completed',
    points: 3,
    created_at: d('2026-09-19T13:10:00.000Z'),
    completed_at: d('2026-09-19T14:05:00.000Z'),
    completed_by: 4057,
    assigned_to: 4057,
    item: 574401,
    meta: {
      form: formDecisaoCancelada,
      itemReference: 'CHA10F15842341F4F159F6AB4E4A8922',
      form_result: { decisao_cancelada: 'nova', valor_do_pedido: 1890.5 },
    },
    tag_ids: [4],
  }),
  tarefa({
    id: 22102,
    reference: 'Op1As8Df5Gh2Jk9Lz6Xc3Vb0Nm7Qw4Er',
    name: 'Publicar o artigo sobre a nova tela de tarefas na base de conhecimento',
    type: 'generic',
    status: 'completed',
    points: 8,
    created_at: d('2026-09-17T10:00:00.000Z'),
    completed_at: d('2026-09-18T18:40:00.000Z'),
    completed_by: 4090,
    assigned_to: 4090,
    tag_ids: [3],
    meta: {
      form: formTriagem,
      form_result: { tipo_validado: 'melhoria', prioridade_validada: 'normal', horas_estimadas: 12, custo_estimado: 7600 },
    },
  }),
  tarefa({
    id: 22103,
    reference: 'As8Df5Gh2Jk9Lz6Xc3Vb0Nm7Qw4Er1Ty',
    name: 'Fechar o chamado do acesso negado depois da confirmação do cliente',
    type: 'crud',
    status: 'completed',
    points: 2,
    created_at: d('2026-09-16T08:30:00.000Z'),
    completed_at: d('2026-09-16T17:12:00.000Z'),
    completed_by: 4061,
    assigned_to: 4061,
    item: 574378,
    priority: 'low',
    meta: {
      form: formDecisaoCancelada,
      itemReference: 'CHAB61C700CD08947259EAB2D67BAFCD',
      form_result: { decisao_cancelada: 'recusar', valor_do_pedido: 640 },
    },
  }),
  tarefa({
    id: 22104,
    reference: 'Df5Gh2Jk9Lz6Xc3Vb0Nm7Qw4Er1Ty8Ui',
    name: 'Revisar o texto do aviso de manutenção programada',
    type: 'generic',
    status: 'completed',
    points: 1,
    created_at: d('2026-09-15T09:45:00.000Z'),
    completed_at: d('2026-09-15T11:03:00.000Z'),
    completed_by: 4072,
    assigned_to: 4072,
  }),
  tarefa({
    id: 22105,
    reference: 'Gh2Jk9Lz6Xc3Vb0Nm7Qw4Er1Ty8Ui5Op',
    name: 'Conferir o apontamento de horas do mês de agosto',
    type: 'generic',
    status: 'completed',
    points: 0,
    created_at: d('2026-09-12T14:00:00.000Z'),
    completed_at: d('2026-09-12T16:30:00.000Z'),
    completed_by: 4088,
    assigned_to: 4088,
  }),
  tarefa({
    id: 22106,
    reference: 'Jk9Lz6Xc3Vb0Nm7Qw4Er1Ty8Ui5Op2As',
    name: 'Arquivar as tarefas do piloto que terminou em agosto',
    type: 'generic',
    status: 'completed',
    points: 3,
    created_at: d('2026-09-10T10:20:00.000Z'),
    completed_at: d('2026-09-11T09:15:00.000Z'),
    completed_by: 4057,
    assigned_to: 4057,
  }),
]

/* ------------------------------------------------------------------ *
 * Visualizações salvas. Vêm da rota de model-views, não de /tasks.    *
 * Aqui servem só para a barra de visualizações do topo ter conteúdo.  *
 * ------------------------------------------------------------------ */
export const visualizacoes = [
  { id: 'todas', nome: 'Tarefas Rápidas', icone: 'i-lucide-layout-dashboard', padrao: true },
  { id: 'minhas', nome: 'Minhas tarefas', icone: 'i-lucide-user' },
  { id: 'produto', nome: 'Tarefas produto', icone: 'i-lucide-package' },
  { id: 'lideranca', nome: 'Tarefas liderança', icone: 'i-lucide-users' },
  { id: 'dev', nome: 'Tarefas dev', icone: 'i-lucide-code' },
]

/** Quem está usando a tela. Define o que é "minha tarefa". */
export const usuarioAtual = pessoas[4057]!
