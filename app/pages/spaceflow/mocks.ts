/**
 * O dado do protótipo "Spaceflow: configuração dos nós". Fictício, tipado pelo
 * SDK, sem API.
 *
 * Estrutura tirada do develop em 15/10/2026 (workspace de exploração, fluxo de
 * teste 524, com um nó de cada tipo arrastado da paleta) e do schema
 * `WorkflowNode` do `@be-enlighten/enspace-sdk-schemas`. Cada nó guarda só as
 * chaves que o schema já tem: nenhuma configuração nova.
 *
 * Exceção declarada: o nó Atraso usa a configuração aprovada no protótipo
 * `no-de-atraso` (modo Data específica), importada de lá.
 *
 * Empresa, pessoas, e-mails e valores são inventados.
 */
import type { WorkflowNode } from '@be-enlighten/enspace-sdk-schemas'
import { configuracaoDoCliente, variaveisDoGatilho } from '../no-de-atraso/mocks'
import type { ConfiguracaoDoAtraso } from '../no-de-atraso/mocks'

export const workspace = { nome: 'Jurídico Aurora', slug: 'juridico-aurora' }
export const fluxoInfo = {
  id: 524,
  nome: 'Entrada de contrato',
  status: 'active' as const,
  versao: 'v1.4.2',
  uuid: '7f3c9a10-5be2-4d21-9c6e-2b1f80a4e913',
  criadoEm: '02/09/2026 09:14',
  atualizadoEm: '15/10/2026 08:41',
}

/* ------------------------------------------------------------------ *
 * Catálogos que os selects dos nós listam                             *
 * ------------------------------------------------------------------ */

export interface CampoDaCategoria {
  chave: string
  rotulo: string
  /** Tipo do campo, como o ENSPACE chama. Decide o ícone na lista de variáveis. */
  tipo: 'text' | 'number' | 'money' | 'date' | 'select' | 'file' | 'email' | 'relation'
}

/** `descricao` é a descrição da categoria: o "?" de cada categoria na lista da branch mostra esse texto. Vazia em algumas, de propósito. */
export const categorias = [
  {
    id: 'contratos',
    nome: 'Contratos',
    descricao: 'Contratos com clientes e fornecedores, do rascunho à assinatura.',
    formularios: ['Novo contrato', 'Renovação'],
    campos: [
      { chave: 'contratante', rotulo: 'Contratante', tipo: 'text' },
      { chave: 'cnpj', rotulo: 'CNPJ', tipo: 'text' },
      { chave: 'valor_do_contrato', rotulo: 'Valor do contrato', tipo: 'money' },
      { chave: 'data_de_vencimento', rotulo: 'Data de vencimento', tipo: 'date' },
      { chave: 'area_responsavel', rotulo: 'Área responsável', tipo: 'select' },
      { chave: 'status', rotulo: 'Status', tipo: 'select' },
      { chave: 'arquivo_do_contrato', rotulo: 'Arquivo do contrato', tipo: 'file' },
      { chave: 'email_do_solicitante', rotulo: 'E-mail do solicitante', tipo: 'email' },
    ] as CampoDaCategoria[],
  },
  {
    id: 'fornecedores',
    nome: 'Fornecedores',
    descricao: 'Cadastro e homologação de fornecedores.',
    formularios: ['Cadastro de fornecedor'],
    campos: [
      { chave: 'razao_social', rotulo: 'Razão social', tipo: 'text' },
      { chave: 'cnpj', rotulo: 'CNPJ', tipo: 'text' },
      { chave: 'situacao', rotulo: 'Situação cadastral', tipo: 'select' },
      { chave: 'contato', rotulo: 'E-mail de contato', tipo: 'email' },
    ] as CampoDaCategoria[],
  },
  {
    id: 'requisicoes',
    nome: 'Requisições de compra com nome longo para testar a quebra',
    descricao: 'Pedidos internos de compra, com valor estimado e aprovação.',
    formularios: ['Requisição'],
    campos: [
      { chave: 'descricao', rotulo: 'Descrição', tipo: 'text' },
      { chave: 'valor', rotulo: 'Valor estimado', tipo: 'money' },
    ] as CampoDaCategoria[],
  },
  // Volume: o workspace de teste da branch tem 73 categorias na lista. Estas só existem para a busca e a rolagem.
  { id: 'aditivos', nome: 'Aditivos contratuais', descricao: 'Mudanças de prazo, valor ou escopo de um contrato.', formularios: [] as string[], campos: [] as CampoDaCategoria[] },
  { id: 'notas-fiscais', nome: 'Notas fiscais', descricao: 'Notas recebidas para conferência e pagamento.', formularios: [] as string[], campos: [] as CampoDaCategoria[] },
  { id: 'chamados-juridicos', nome: 'Chamados jurídicos', descricao: 'Consultas das áreas ao Jurídico.', formularios: [] as string[], campos: [] as CampoDaCategoria[] },
  { id: 'processos', nome: 'Processos judiciais', descricao: '', formularios: [] as string[], campos: [] as CampoDaCategoria[] },
  { id: 'procuracoes', nome: 'Procurações', descricao: 'Poderes concedidos e prazos de validade.', formularios: [] as string[], campos: [] as CampoDaCategoria[] },
  { id: 'reunioes', nome: 'Reuniões de diretoria', descricao: 'Pautas e atas das reuniões.', formularios: [] as string[], campos: [] as CampoDaCategoria[] },
  { id: 'ativos', nome: 'Ativos de TI', descricao: 'Equipamentos e licenças por pessoa.', formularios: [] as string[], campos: [] as CampoDaCategoria[] },
  { id: 'treinamentos', nome: 'Treinamentos obrigatórios', descricao: '', formularios: [] as string[], campos: [] as CampoDaCategoria[] },
  { id: 'ocorrencias', nome: 'Ocorrências de compliance', descricao: 'Relatos do canal de ética.', formularios: [] as string[], campos: [] as CampoDaCategoria[] },
  { id: 'viagens', nome: 'Solicitações de viagem', descricao: 'Pedidos de viagem e reembolso.', formularios: [] as string[], campos: [] as CampoDaCategoria[] },
]

export const membros = [
  { id: 'ana', nome: 'Ana Ribeiro', email: 'ana.ribeiro@aurora.example' },
  { id: 'bruno', nome: 'Bruno Tavares', email: 'bruno.tavares@aurora.example' },
  { id: 'carla', nome: 'Carla Nunes', email: 'carla.nunes@aurora.example' },
  { id: 'diego', nome: 'Diego Matos', email: 'diego.matos@aurora.example' },
  { id: 'elisa', nome: 'Elisa Prado', email: 'elisa.prado@aurora.example' },
  { id: 'fabio', nome: 'Fábio Lins', email: 'fabio.lins@aurora.example' },
  { id: 'gabriela', nome: 'Gabriela Rocha de Albuquerque Monteiro', email: 'gabriela.monteiro@aurora.example' },
]

export const grupos = ['Diretoria', 'Jurídico', 'Compras', 'Financeiro']
export const cargos = ['Advogado', 'Analista de compras', 'Diretor']

/** Credenciais de Configurações › Credenciais. O tipo é o que o develop esconde no ícone de informação. */
export const credenciais = [
  { id: 11, nome: 'Receita CNPJ (produção)', tipo: 'Bearer Token' },
  { id: 12, nome: 'ERP Aurora', tipo: 'API Key' },
  { id: 13, nome: 'Portal do fornecedor', tipo: 'Basic Auth' },
]

export const modelosDeIa = ['openai/gpt-6-luna', 'openai/gpt-5.2', 'anthropic/claude-sonnet-5-5', 'google/gemini-3-pro']
export const agentes = ['BENI', 'Revisor de cláusulas', 'Analista de compras']
export const ferramentasDoAgente = [
  { id: 'buscar_itens', nome: 'Buscar itens' },
  { id: 'ler_arquivo', nome: 'Ler arquivo' },
  { id: 'criar_tarefa', nome: 'Criar tarefa' },
  { id: 'atualizar_item', nome: 'Atualizar item' },
  { id: 'base_de_conhecimento', nome: 'Consultar a base de conhecimento' },
]
export const comparacoes = ['Propostas de fornecedores', 'Cotações de frete']
export const modelosDeEmail = ['Aviso de rejeição', 'Boas-vindas ao fornecedor', 'Contrato assinado']
export const caixasDeEmail = ['contratos@aurora.example', 'compras@aurora.example']
/**
 * Os Spaceflows do workspace, para o nó Iniciar outro fluxo. Só pode ser
 * destino o que está Ativo e com Início Manual (documentação do nó); o resto
 * aparece cinza, com o motivo. "ativo" vem do Workflow; "inicio", do tipo do
 * nó de início de cada um.
 */
export const fluxos = [
  { id: 'cadastro-de-fornecedor', nome: 'Cadastro de fornecedor', ativo: true, inicio: 'manual' },
  { id: 'tratamento-juridico', nome: 'Tratamento jurídico', ativo: true, inicio: 'manual' },
  { id: 'relatorio-mensal', nome: 'Gerar relatório mensal', ativo: true, inicio: 'manual' },
  { id: 'renovacao-de-contrato', nome: 'Renovação de contrato', ativo: false, inicio: 'manual' },
  { id: 'aviso-de-vencimento', nome: 'Aviso de vencimento', ativo: true, inicio: 'events' },
  { id: 'entrada-de-contrato', nome: 'Entrada de contrato', ativo: true, inicio: 'manual', proprio: true },
]

export const fusos = ['America/Sao_Paulo', 'America/Manaus', 'America/Noronha', 'UTC']

/* ------------------------------------------------------------------ *
 * O fluxo                                                             *
 * ------------------------------------------------------------------ */

/**
 * Um nó do protótipo. `data` é o do schema; o Atraso carrega a configuração
 * do protótipo `no-de-atraso`, que soma campos novos ao `delay` (marcado lá).
 */
export type No = WorkflowNode
export type TipoDeNo = No['type']

export interface Aresta {
  id: string
  source: string
  target: string
  /** A alça de saída: Aprovado/Rejeitado, Verdadeiro/Falso, rotas. Vazio = saída única. */
  sourceHandle?: string
}

const pos = (x: number, y: number) => ({ x, y })

/**
 * O fluxo de exemplo, configurado. Um nó de cada tipo que a paleta oferece,
 * em 2 faixas para caber inteiro na tela de quem testa (rodada 2): a de cima
 * vai do Início ao Mesclar, a de baixo do CRUD ao Fim.
 */
export function fluxoConfigurado(): No[] {
  return [
    {
      id: 'trig', type: 'trigger', position: pos(0, 170),
      data: {
        label: 'Contrato criado',
        type: 'events',
        scope: 'contratos',
        action: 'create',
        cForms: 'Novo contrato',
        link_item: true,
        conditionals: { and: [{ ref: 'data.status', op: '==', value: 'Em análise' }], or: [], separate_branches: false },
        title: 'Contrato {{nodes.trig.reference}} · {{nodes.trig.data.contratante}}',
      },
    },
    {
      id: 'extrair', type: 'ai_extract', position: pos(340, 170),
      data: {
        label: 'Ler o PDF do contrato',
        model: 'openai/gpt-5.2',
        fields: [
          { name: 'vigencia', label: 'Vigência', type: 'text', instruction: 'Período de vigência escrito na cláusula de prazo.' },
          { name: 'multa', label: 'Multa rescisória', type: 'number', instruction: 'Percentual da multa por rescisão antecipada.' },
          { name: 'foro', label: 'Foro', type: 'text', instruction: 'Cidade do foro eleito.' },
        ],
        file_urls: ['{{nodes.trig.data.arquivo_do_contrato}}'],
        context_data: '',
        prompt: 'Se houver aditivo, considere a versão mais recente.',
      },
    },
    {
      id: 'http', type: 'http', position: pos(680, 170),
      data: {
        label: 'Consultar CNPJ na Receita',
        method: 'GET',
        url: 'https://api.receita.example/v1/cnpj/{{nodes.trig.data.cnpj}}',
        authentication: 11,
        timeout: 30000,
        queryParams: [{ key: 'incluir', value: 'situacao' }],
        headers: [{ key: 'content-type', value: 'application/json' }, { key: 'accept', value: 'application/json' }],
        output_schema: [
          { name: 'situacao_cadastral', label: 'Situação cadastral', type: 'text', source_path: 'data.situacao' },
          { name: 'razao_social', label: 'Razão social', type: 'text', source_path: 'data.nome' },
        ],
      },
    },
    {
      id: 'cond', type: 'conditionals', position: pos(1020, 170),
      data: {
        label: 'Acima de R$ 100 mil?',
        conditionals: {
          and: [{ ref: '{{nodes.trig.data.valor_do_contrato}}', op: '>', value: '100000' }],
          or: [],
        },
      },
    },
    {
      id: 'aprov', type: 'approval', position: pos(1360, 0),
      data: {
        label: 'Aprovação da diretoria',
        task_name: 'Aprovar contrato {{nodes.trig.reference}}',
        task_content: '<p>Confira o valor, a vigência e a multa rescisória antes de aprovar.</p>',
        task_due_config: { due_type: 'static', calculation: 'days', value: 2, business: true },
        task_priority: 'high',
        task_points: 5,
        task_permissions: [],
        task_item: '{{nodes.trig.reference}}',
        assign_to: 'diego',
        collaborators: ['ana'],
        enable_notifications: true,
        external_task: false,
      },
    },
    {
      id: 'gerar', type: 'ai_generate', position: pos(1360, 340),
      data: {
        label: 'Resumir o contrato',
        model: 'openai/gpt-6-luna',
        temperature: 0.7,
        system: 'Responda em português, em até 5 tópicos.',
        prompt: 'Resuma o contrato de {{nodes.trig.data.contratante}} com vigência {{nodes.extrair.data.vigencia}}.',
      },
    },
    {
      id: 'tarefa', type: 'task', position: pos(1700, 0),
      data: {
        label: 'Assinar contrato',
        task_name: 'Assinar o contrato {{nodes.trig.reference}}',
        task_content: '<p>Assine pelo portal e anexe a via assinada no item.</p>',
        task_due_config: { due_type: 'dynamic', origin: '{{nodes.trig.data.data_de_vencimento}}', calculation: 'days', value: -15, business: false },
        task_priority: 'normal',
        assign_to: 'carla',
        collaborators: [],
        external_task: false,
      },
    },
    {
      id: 'email', type: 'email', position: pos(1700, 170),
      data: {
        label: 'Avisar o solicitante',
        provider: 'enspace',
        base_layout: 'enspace',
        to: ['{{nodes.trig.data.email_do_solicitante}}'],
        cc: [],
        bcc: [],
        replyTo: 'contratos@aurora.example',
        subject: 'Contrato {{nodes.trig.reference}} não aprovado',
        body: '<p>Olá,</p><p>O contrato com {{nodes.trig.data.contratante}} não foi aprovado.</p><p>Motivo: {{nodes.aprov.motivo_rejeicao}}</p>',
        attachments: [],
        default_attachments: [],
      },
    },
    {
      id: 'agente', type: 'ai_agent', position: pos(1700, 340),
      data: {
        label: 'Revisar cláusulas',
        agent: 'Revisor de cláusulas',
        prompt: 'Revise as cláusulas de multa e foro. Responda com os riscos encontrados.',
        max_steps: 10,
        tools: ['ler_arquivo', 'base_de_conhecimento'],
      },
    },
    {
      id: 'merge', type: 'merge', position: pos(2040, 170),
      data: {
        label: 'Juntar os caminhos',
        count_rows: [
          { id: 'm1', label: 'Contrato assinado', required: false },
          { id: 'm2', label: 'Revisão da IA', required: false },
        ],
      },
    },
    {
      id: 'crud', type: 'crud', position: pos(0, 720),
      data: {
        label: 'Marcar como vigente',
        type: 'contratos',
        action: 'update',
        execution_mode: 'automatic',
        params: '{{nodes.trig.reference}}',
        fields: [{ field: 'status', value: 'Vigente' }],
      },
    },
    {
      id: 'rotear', type: 'ai_router', position: pos(340, 720),
      data: {
        label: 'Classificar a área',
        model: 'openai/gpt-6-luna',
        temperature: 0.2,
        prompt: 'Leia o objeto do contrato {{nodes.trig.data.contratante}} e escolha a área que vai acompanhar.',
        routes: [
          { key: 'Jurídico', description: 'Contratos com cláusula de exclusividade ou multa acima de 20%.', outletId: 'r-juridico' },
          { key: 'Compras', description: 'Contratos de fornecimento de material ou serviço recorrente.', outletId: 'r-compras' },
        ],
      },
    },
    {
      id: 'form', type: 'form', position: pos(680, 560),
      data: {
        label: 'Dados do jurídico',
        task_name: 'Complementar o contrato {{nodes.trig.reference}}',
        task_content: '<p>Informe o número do processo e o advogado responsável.</p>',
        task_due_config: { due_type: 'static', calculation: 'days', value: 3, business: true },
        assign_to: 'elisa',
        form: [
          { refId: 'f1', type: 'text', label: 'Número do processo', name: 'numero_do_processo' },
          { refId: 'f2', type: 'select', label: 'Advogado responsável', name: 'advogado' },
        ],
      },
    },
    {
      id: 'rotas', type: 'route', position: pos(680, 880),
      data: {
        label: 'Por faixa de valor',
        routes: [
          { id: 'rt1', ref: '{{nodes.trig.data.valor_do_contrato}}', op: '<=', value: '50000', target: 'notif' },
          { id: 'rt2', ref: '{{nodes.trig.data.valor_do_contrato}}', op: '>', value: '50000' },
        ],
        fallback: 'end',
      },
    },
    {
      id: 'iniciar', type: 'start', position: pos(1360, 880),
      data: {
        label: 'Cadastrar o fornecedor',
        type: 'auto',
        workflow: 'cadastro-de-fornecedor',
      },
    },
    {
      id: 'atraso', type: 'delay', position: pos(1020, 560),
      data: configuracaoDoCliente() as unknown as Extract<No, { type: 'delay' }>['data'],
    },
    {
      id: 'notif', type: 'comparison_notification', position: pos(1020, 780),
      data: {
        label: 'Enviar comparativo',
        comparison: 'Propostas de fornecedores',
        provider: 'enspace',
        base_layout: 'enspace',
        subject: 'Comparativo de propostas do contrato {{nodes.trig.reference}}',
        body: '<p>Segue o comparativo das propostas recebidas.</p>',
      },
    },
    {
      id: 'end', type: 'end', position: pos(1700, 720),
      data: { label: 'Fim' },
    },
  ] as No[]
}

export const arestas: Aresta[] = [
  { id: 'e1', source: 'trig', target: 'extrair' },
  { id: 'e2', source: 'extrair', target: 'http' },
  { id: 'e3', source: 'http', target: 'cond' },
  { id: 'e4', source: 'cond', target: 'aprov', sourceHandle: 'true' },
  { id: 'e5', source: 'cond', target: 'gerar', sourceHandle: 'false' },
  { id: 'e6', source: 'aprov', target: 'tarefa', sourceHandle: 'approved' },
  { id: 'e7', source: 'aprov', target: 'email', sourceHandle: 'rejected' },
  { id: 'e8', source: 'gerar', target: 'agente' },
  { id: 'e9', source: 'tarefa', target: 'merge' },
  { id: 'e10', source: 'agente', target: 'merge' },
  { id: 'e11', source: 'merge', target: 'crud' },
  { id: 'e12', source: 'crud', target: 'rotear' },
  { id: 'e13', source: 'rotear', target: 'form', sourceHandle: 'r-juridico' },
  { id: 'e14', source: 'rotear', target: 'rotas', sourceHandle: 'r-compras' },
  { id: 'e15', source: 'form', target: 'atraso' },
  { id: 'e16', source: 'rotas', target: 'notif', sourceHandle: 'rt1' },
  { id: 'e17', source: 'atraso', target: 'end' },
  { id: 'e18', source: 'notif', target: 'end' },
  { id: 'e19', source: 'email', target: 'end' },
  { id: 'e20', source: 'rotas', target: 'end', sourceHandle: 'fallback' },
  { id: 'e21', source: 'rotas', target: 'iniciar', sourceHandle: 'rt2' },
  { id: 'e22', source: 'iniciar', target: 'end' },
]

/**
 * O mesmo fluxo com os nós como saem da paleta: só o nome preenchido, como no
 * develop. Serve para ver as pendências no card e no modal.
 */
export function fluxoNovo(): No[] {
  const vazio: Record<string, Record<string, unknown>> = {
    trigger: { label: 'Start', type: 'manual', form: [] },
    ai_extract: { label: 'I.A. Extrair', model: 'gpt-5.2', fields: [] },
    http: { label: 'Requisição HTTP', method: 'GET', url: '', timeout: 30000, headers: [{ key: 'content-type', value: 'application/json' }, { key: 'accept', value: 'application/json' }] },
    conditionals: { label: 'Condicionais', conditionals: { and: [], or: [] } },
    approval: { label: 'Aprovação', task_name: '', task_content: '' },
    ai_generate: { label: 'IA Geradora', model: 'openai/gpt-6-luna', temperature: 0.7, prompt: '' },
    task: { label: 'Tarefa', task_name: '', task_content: '' },
    email: { label: 'E-mail', provider: 'enspace', base_layout: 'enspace', to: [], subject: '', body: '' },
    ai_agent: { label: 'Agente de I.A.', agent: 'BENI', prompt: '', max_steps: 10 },
    merge: { label: 'Mesclar', count_rows: [] },
    crud: { label: 'Operações CRUD', type: '', action: '', execution_mode: 'automatic' },
    ai_router: { label: 'IA Roteadora', model: 'openai/gpt-6-luna', temperature: 0.2, prompt: '', routes: [] },
    form: { label: 'Formulário', task_name: '', task_content: '', form: [] },
    route: { label: 'Rotas', routes: [] },
    comparison_notification: { label: 'Notificação de Comparação', provider: 'enspace', base_layout: 'empty', comparison: '', subject: '', body: '' },
    end: { label: 'End' },
    start: { label: 'Iniciar outro fluxo', type: 'auto' },
  }
  return fluxoConfigurado().map((n) => {
    if (n.type === 'delay') return { ...n, data: { ...configuracaoDoCliente(), label: 'Atraso', mode: 'duration', delay: '', date_source: null } } as unknown as No
    return { ...n, data: structuredClone(vazio[n.type] ?? { label: n.data.label }) } as No
  })
}

/** A configuração do Atraso, no formato do protótipo `no-de-atraso`. */
export type { ConfiguracaoDoAtraso }
export { variaveisDoGatilho }
