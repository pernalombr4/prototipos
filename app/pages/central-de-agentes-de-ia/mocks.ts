/**
 * O dado do protótipo. Tudo fictício: empresa, pessoas, processos, valores.
 *
 * A estrutura do agente vem do `Agent` do enspace-sdk-schemas (nome, slug,
 * descrição, papel, abordagem, instruções, regras, estilo, modelo, tipo,
 * ferramentas, base de conhecimento, status, ícone, origem). Os campos que a
 * proposta acrescenta vêm marcados com PROPOSTA.
 *
 * O caso que guia o mock é um agente que monta respostas a ofícios judiciais a
 * partir de modelos aprovados. Nenhum texto, nome ou número de cliente real
 * entra aqui (regra 13): "Aurora Pagamentos" e os processos são inventados.
 */
import type { Agent } from '@be-enlighten/enspace-sdk-schemas'
import { ferramentas, pedeConfirmacaoPorPadrao } from './catalogo'

/* ────────────────────────────── Pessoas ────────────────────────────── */

export interface Pessoa { id: number, nome: string, iniciais: string, cargo: string }

export const pessoas: Pessoa[] = [
  { id: 1, nome: 'Renata Lopes', iniciais: 'RL', cargo: 'Coordenadora jurídica' },
  { id: 2, nome: 'Thiago Moreira', iniciais: 'TM', cargo: 'Analista de BPO' },
  { id: 3, nome: 'Juliana Prado', iniciais: 'JP', cargo: 'Analista de BPO' },
  { id: 4, nome: 'Carlos Eduardo Albuquerque de Vasconcellos', iniciais: 'CV', cargo: 'Gerente de operações' },
  { id: 5, nome: 'Marina Tavares', iniciais: 'MT', cargo: 'Administradora do workspace' },
]

export const pessoaPorId = (id: number) => pessoas.find(p => p.id === id)!

/** Quem está usando o protótipo. */
export const EU = 5

export const cargos = ['Administrador', 'Coordenação jurídica', 'Analistas de BPO', 'Atendimento', 'Financeiro']
export const gruposDeMembros = ['Time de ofícios', 'Plantão de bloqueios', 'Diretoria']

/* ─────────────────────── Arquivos de referência ─────────────────────── */

/** PROPOSTA (demanda 3): arquivo que o agente lê inteiro em toda conversa. */
export interface ArquivoDeReferencia {
  id: string
  nome: string
  tipo: 'pdf' | 'docx'
  /** em KB */
  tamanho: number
  paginas: number
  /** quanto do contexto o arquivo ocupa, em milhares de tokens */
  tokens: number
  enviadoEm: string
  enviadoPor: number
  versao: number
}

export const arquivos: ArquivoDeReferencia[] = [
  { id: 'a1', nome: 'Respostas prontas a ofícios v7.pdf', tipo: 'pdf', tamanho: 412, paginas: 38, tokens: 52, enviadoEm: '2026-11-10', enviadoPor: 1, versao: 7 },
  { id: 'a2', nome: 'Manual de cumprimento de ordens judiciais.docx', tipo: 'docx', tamanho: 186, paginas: 21, tokens: 31, enviadoEm: '2026-10-28', enviadoPor: 4, versao: 2 },
  { id: 'a3', nome: 'Tabela de prazos por tribunal.pdf', tipo: 'pdf', tamanho: 64, paginas: 4, tokens: 6, enviadoEm: '2026-09-15', enviadoPor: 1, versao: 1 },
]

/** O arquivo grande que o protótipo usa para mostrar o aviso de tamanho. */
export const arquivoGrande: ArquivoDeReferencia = {
  id: 'a9', nome: 'Jurisprudência consolidada 2020 a 2026.pdf', tipo: 'pdf', tamanho: 9840, paginas: 1260, tokens: 640, enviadoEm: '2026-11-16', enviadoPor: EU, versao: 1,
}

/* ───────────────────────── Modelos de resposta ───────────────────────── */

export type TipoDeCampo = 'texto' | 'numero' | 'moeda' | 'data' | 'documento' | 'processo'

/** PROPOSTA (demanda 5): campo que o agente preenche dentro do bloco. */
export interface CampoDoBloco {
  chave: string
  tipo: TipoDeCampo
  obrigatorio: boolean
  /** de onde o agente tira o valor */
  origem: 'oficio' | 'analista' | 'sistema'
  exemplo: string
}

export interface BlocoDeResposta {
  id: string
  codigo: string
  nome: string
  /** quando usar, em 1 frase: é o que o agente lê para escolher */
  quandoUsar: string
  texto: string
  campos: CampoDoBloco[]
  atualizadoEm: string
  atualizadoPor: number
  usos30d: number
  agentes: string[]
  status: 'aprovado' | 'rascunho'
}

const cabecalho = 'EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{vara}} DA COMARCA DE {{comarca}}\n\nProcesso nº {{processo}}\nExequente: {{exequente}}\nExecutado: {{executado}}\n\n'
const rodape = '\n\n{{cidade}}, {{data}}.\n\nAURORA PAGAMENTOS S.A.\n{{responsavel}}'

const c = (chave: string, tipo: TipoDeCampo, origem: CampoDoBloco['origem'], exemplo: string, obrigatorio = true): CampoDoBloco =>
  ({ chave, tipo, origem, exemplo, obrigatorio })

const camposComuns: CampoDoBloco[] = [
  c('vara', 'texto', 'oficio', '3ª Vara Cível'),
  c('comarca', 'texto', 'oficio', 'Campinas'),
  c('processo', 'processo', 'oficio', '0012345-67.2025.8.26.0114'),
  c('exequente', 'texto', 'oficio', 'Construtora Horizonte Azul Ltda.'),
  c('executado', 'texto', 'oficio', 'Café Serra Alta Comércio de Alimentos Ltda.'),
  c('cidade', 'texto', 'sistema', 'São Paulo'),
  c('data', 'data', 'sistema', '16 de novembro de 2026'),
  c('responsavel', 'texto', 'sistema', 'Departamento Jurídico'),
]

export const blocos: BlocoDeResposta[] = [
  {
    id: 'b1', codigo: 'S1', nome: 'Bloqueio de saldo efetivado',
    quandoUsar: 'O executado tem conta e o saldo foi bloqueado, total ou em parte.',
    texto: `${cabecalho}AURORA PAGAMENTOS S.A., em atenção ao ofício expedido nos autos em epígrafe, informa que localizou a conta de titularidade de {{executado}}, inscrita sob o documento {{documento}}, identificada pelo código {{id_cliente}}.\n\nEm cumprimento à ordem, foi bloqueado o valor de {{valor_bloqueado}}, correspondente ao saldo disponível de {{saldo}} na data do recebimento, observado o limite de {{limite}} determinado por Vossa Excelência.\n\nO valor permanece bloqueado à disposição deste Juízo até nova determinação.${rodape}`,
    campos: [...camposComuns, c('documento', 'documento', 'oficio', '12.345.678/0001-90'), c('id_cliente', 'numero', 'analista', '884201377'), c('saldo', 'moeda', 'analista', 'R$ 1.250,00'), c('valor_bloqueado', 'moeda', 'analista', 'R$ 375,00'), c('limite', 'moeda', 'oficio', 'R$ 50.000,00')],
    atualizadoEm: '2026-11-10', atualizadoPor: 1, usos30d: 184, agentes: ['respostas-a-oficios'], status: 'aprovado',
  },
  {
    id: 'b2', codigo: 'S2', nome: 'Retenção de recebíveis configurada',
    quandoUsar: 'O ofício pede retenção de percentual do faturamento e a retenção foi configurada.',
    texto: `${cabecalho}AURORA PAGAMENTOS S.A. informa que configurou a retenção de {{percentual}} dos valores a receber de {{executado}}, documento {{documento}}, código {{id_cliente}}, a partir de {{data_inicio}}, até o limite de {{limite}}.\n\nOs valores retidos serão transferidos mensalmente para conta judicial vinculada a estes autos.${rodape}`,
    campos: [...camposComuns, c('documento', 'documento', 'oficio', '12.345.678/0001-90'), c('id_cliente', 'numero', 'analista', '884201377'), c('percentual', 'numero', 'oficio', '30%'), c('data_inicio', 'data', 'analista', '18 de novembro de 2026'), c('limite', 'moeda', 'oficio', 'R$ 50.000,00')],
    atualizadoEm: '2026-11-10', atualizadoPor: 1, usos30d: 97, agentes: ['respostas-a-oficios'], status: 'aprovado',
  },
  {
    id: 'b3', codigo: 'S3', nome: 'Cadastro não localizado',
    quandoUsar: 'Nenhuma conta foi encontrada para o documento do ofício.',
    texto: `${cabecalho}AURORA PAGAMENTOS S.A., em atenção ao ofício expedido nos autos em epígrafe, informa que, após pesquisa em seus sistemas, não localizou cadastro vinculado ao documento {{documento}}, de {{executado}}.\n\nPor essa razão, não há valores a bloquear.${rodape}`,
    campos: [...camposComuns, c('documento', 'documento', 'oficio', '98.765.432/0001-10')],
    atualizadoEm: '2026-11-10', atualizadoPor: 1, usos30d: 312, agentes: ['respostas-a-oficios'], status: 'aprovado',
  },
  {
    id: 'b4', codigo: 'S4', nome: 'Conta sem saldo',
    quandoUsar: 'A conta existe, mas não havia saldo na data do recebimento.',
    texto: `${cabecalho}AURORA PAGAMENTOS S.A. informa que localizou a conta de {{executado}}, código {{id_cliente}}, sem saldo disponível na data do recebimento do ofício. A ordem de bloqueio foi registrada e alcançará valores que ingressarem até {{data_limite}}.${rodape}`,
    campos: [...camposComuns, c('id_cliente', 'numero', 'analista', '884201377'), c('data_limite', 'data', 'oficio', '16 de dezembro de 2026')],
    atualizadoEm: '2026-10-30', atualizadoPor: 4, usos30d: 58, agentes: ['respostas-a-oficios'], status: 'aprovado',
  },
  {
    id: 'b5', codigo: 'S5', nome: 'Conta encerrada',
    quandoUsar: 'A conta do documento foi encerrada antes do recebimento do ofício.',
    texto: `${cabecalho}AURORA PAGAMENTOS S.A. informa que a conta de {{executado}}, código {{id_cliente}}, foi encerrada em {{data_encerramento}}, antes do recebimento do ofício. Não há valores a bloquear.${rodape}`,
    campos: [...camposComuns, c('id_cliente', 'numero', 'analista', '884201377'), c('data_encerramento', 'data', 'analista', '2 de março de 2026')],
    atualizadoEm: '2026-10-30', atualizadoPor: 4, usos30d: 21, agentes: ['respostas-a-oficios'], status: 'aprovado',
  },
  {
    id: 'b6', codigo: 'S6', nome: 'Desbloqueio cumprido',
    quandoUsar: 'O ofício determina o desbloqueio e o valor foi liberado.',
    texto: `${cabecalho}AURORA PAGAMENTOS S.A. informa que cumpriu a ordem de desbloqueio do valor de {{valor_desbloqueado}} na conta de {{executado}}, código {{id_cliente}}, em {{data_desbloqueio}}.${rodape}`,
    campos: [...camposComuns, c('id_cliente', 'numero', 'analista', '884201377'), c('valor_desbloqueado', 'moeda', 'oficio', 'R$ 375,00'), c('data_desbloqueio', 'data', 'analista', '17 de novembro de 2026')],
    atualizadoEm: '2026-09-22', atualizadoPor: 1, usos30d: 33, agentes: ['respostas-a-oficios'], status: 'aprovado',
  },
  {
    id: 'b7', codigo: 'S7', nome: 'Pedido de informações cadastrais',
    quandoUsar: 'O ofício pede só dados cadastrais, sem bloqueio.',
    texto: `${cabecalho}AURORA PAGAMENTOS S.A. encaminha as informações cadastrais de {{executado}}, documento {{documento}}: endereço {{endereco}}, conta aberta em {{data_abertura}}.${rodape}`,
    campos: [...camposComuns, c('documento', 'documento', 'oficio', '12.345.678/0001-90'), c('endereco', 'texto', 'analista', 'Rua das Acácias, 120, Campinas, SP'), c('data_abertura', 'data', 'analista', '9 de abril de 2023')],
    atualizadoEm: '2026-11-14', atualizadoPor: EU, usos30d: 0, agentes: [], status: 'rascunho',
  },
]

/* ─────────────────────────────── Agentes ─────────────────────────────── */

/** PROPOSTA: o modo de cada ferramenta ligada (demanda 1). */
export type ModoDaFerramenta = 'confirmar' | 'executar'

/** PROPOSTA: uma versão publicada ou o rascunho em edição. */
export interface Versao {
  numero: number
  publicadaEm: string | null
  por: number
  resumo: string
}

/** PROPOSTA: um caso de teste salvo na aba Testar. */
export interface CasoDeTeste {
  id: string
  nome: string
  mensagem: string
  esperado: string
  ultimo: 'passou' | 'falhou' | 'nunca'
}

export type Acesso = 'todos' | 'cargos' | 'grupos' | 'pessoas'

export interface Agente extends Pick<Agent, 'slug' | 'name' | 'description' | 'role' | 'approach' | 'instructions' | 'writing_style' | 'model' | 'source' | 'icon'> {
  type: 'chat' | 'reviewer' | 'multi_task'
  status: 'active' | 'inactive'
  rules: string[]
  /** `tools` do schema, aqui com o modo de cada uma. Vazio no schema = todas; a proposta acaba com isso. */
  ferramentas: Record<string, ModoDaFerramenta>
  /** PROPOSTA (demanda 2) */
  modelosPermitidos: string[]
  /** PROPOSTA (demanda 3) */
  arquivos: string[]
  /** `knowledge_base_ids` existe no servidor e não tem tela */
  basesDeConhecimento: string[]
  /** PROPOSTA (demanda 5) */
  blocos: string[]
  /** PROPOSTA: quem usa e quem edita */
  acesso: Acesso
  acessoAlvos: string[]
  editores: number[]
  dono: number
  /** PROPOSTA: sugestões que aparecem na conversa nova */
  sugestoes: string[]
  /** PROPOSTA: versões; a 1ª é o rascunho quando há mudança não publicada */
  versoes: Versao[]
  rascunhoPendente: boolean
  casos: CasoDeTeste[]
  /** PROPOSTA: uso nos últimos 30 dias */
  uso: { conversas: number, pessoas: number, creditos: number, positivas: number, negativas: number, confirmacoes: number, canceladas: number }
  atualizadoEm: string
  cor: string
}

/** As ferramentas do agente, com o modo padrão de cada uma. */
function comModoPadrao(slugs: string[]): Record<string, ModoDaFerramenta> {
  return Object.fromEntries(slugs.map((s) => {
    const fer = ferramentas.find(x => x.slug === s)!
    return [s, pedeConfirmacaoPorPadrao(fer) ? 'confirmar' : 'executar']
  }))
}

export const agentes: Agente[] = [
  {
    slug: 'respostas-a-oficios',
    name: 'Respostas a ofícios',
    description: 'Lê o ofício judicial, diz o que pesquisar e monta a minuta com o modelo de resposta aprovado.',
    role: 'Analista jurídico',
    approach: 'Primeiro lista o que pesquisar e as respostas possíveis. Só monta a minuta depois que o analista escolhe.',
    instructions: 'Você ajuda o time de BPO a responder ofícios judiciais.\n\n# Etapas\n1. Leia o ofício anexado inteiro.\n2. Liste, por alvo, o que pesquisar e as respostas possíveis, com o código do modelo.\n3. Peça só os dados que faltam.\n4. Monte a minuta com o modelo de resposta escolhido, sem reescrever o texto.\n\n# Cuidados\n- Vara, partes e processo saem só do ofício.\n- Nunca invente valor, conta ou data.',
    rules: [
      'Nunca complete vara, comarca, partes ou processo de memória: releia o ofício.',
      'Use só os modelos de resposta aprovados; sem modelo para o caso, diga isso e peça o texto.',
      'Não envie e-mail sem o analista pedir.',
    ],
    writing_style: 'formal',
    model: 'anthropic/claude-sonnet-5.5',
    modelosPermitidos: ['anthropic/claude-sonnet-5.5', 'anthropic/claude-opus-5.5'],
    type: 'chat',
    status: 'active',
    source: 'workspace',
    icon: 'i-lucide-scale',
    ferramentas: { ...comModoPadrao(['readFile', 'getCurrentDateTime', 'getWorkspaceSchema', 'sendEmail', 'smartCreateItem', 'smartBatchCreateItems', 'legalLookupCase']), legalLookupCase: 'confirmar' },
    arquivos: ['a1', 'a2'],
    basesDeConhecimento: [],
    blocos: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6'],
    acesso: 'grupos',
    acessoAlvos: ['Time de ofícios', 'Plantão de bloqueios'],
    editores: [1, 4],
    dono: 1,
    sugestoes: ['Novo ofício para responder', 'Qual modelo uso para conta encerrada?'],
    versoes: [
      { numero: 5, publicadaEm: null, por: EU, resumo: 'Modelos permitidos: só Claude Sonnet 5.5 e Claude Opus 5.5.' },
      { numero: 4, publicadaEm: '2026-11-12', por: 1, resumo: 'Arquivo de referência atualizado para a versão 7.' },
      { numero: 3, publicadaEm: '2026-11-03', por: 1, resumo: 'Envio de e-mail passa a pedir confirmação.' },
      { numero: 2, publicadaEm: '2026-10-21', por: 4, resumo: 'Regras reescritas e modelos de resposta S4 a S6.' },
      { numero: 1, publicadaEm: '2026-10-14', por: 1, resumo: 'Primeira versão.' },
    ],
    rascunhoPendente: true,
    casos: [
      { id: 'c1', nome: 'Ofício com 2 alvos, um sem cadastro', mensagem: 'ofício anexado + "ve ai"', esperado: 'Lista os 2 alvos e oferece S3 para o alvo sem cadastro.', ultimo: 'passou' },
      { id: 'c2', nome: 'Resposta solta depois da lista', mensagem: '"a nao achei nada. o b tem conta 884201377 saldo 1250"', esperado: 'Monta S3 para A e S1 para B, com as partes do ofício.', ultimo: 'passou' },
      { id: 'c3', nome: 'Pedido sem anexo', mensagem: '"faz a minuta do processo 0012345"', esperado: 'Pede o PDF do ofício e não inventa partes.', ultimo: 'falhou' },
    ],
    uso: { conversas: 412, pessoas: 9, creditos: 18640, positivas: 131, negativas: 7, confirmacoes: 38, canceladas: 11 },
    atualizadoEm: '2026-11-16',
    cor: '#7c3aed',
  },
  {
    slug: 'triagem-de-chamados',
    name: 'Triagem de chamados',
    description: 'Classifica o chamado novo, sugere a prioridade e o responsável e cria a tarefa.',
    role: 'Assistente de atendimento',
    approach: 'Classifica, explica em 1 frase e só cria a tarefa com a confirmação de quem atende.',
    instructions: 'Leia o chamado, classifique pela tabela de assuntos e sugira prioridade e responsável.',
    rules: ['Prioridade urgente só para cliente sem acesso ao sistema.'],
    writing_style: 'concise',
    model: 'google/gemini-3.8-flash',
    modelosPermitidos: ['google/gemini-3.8-flash', 'deepseek/deepseek-v4.1-flash', 'anthropic/claude-haiku-5.5'],
    type: 'chat',
    status: 'active',
    source: 'workspace',
    icon: 'i-lucide-inbox',
    ferramentas: comModoPadrao(['smartQueryItems', 'getItemByReference', 'getWorkspaceMembers', 'createTask', 'updateItem']),
    arquivos: [],
    basesDeConhecimento: ['Base de atendimento'],
    blocos: [],
    acesso: 'cargos',
    acessoAlvos: ['Atendimento'],
    editores: [2],
    dono: 2,
    sugestoes: ['Triar os chamados de hoje', 'Quem está com menos chamados?'],
    versoes: [{ numero: 2, publicadaEm: '2026-11-08', por: 2, resumo: 'Base de atendimento ligada.' }, { numero: 1, publicadaEm: '2026-10-30', por: 2, resumo: 'Primeira versão.' }],
    rascunhoPendente: false,
    casos: [],
    uso: { conversas: 1290, pessoas: 14, creditos: 6120, positivas: 210, negativas: 31, confirmacoes: 402, canceladas: 26 },
    atualizadoEm: '2026-11-08',
    cor: '#0ea5e9',
  },
  {
    slug: 'revisor-de-contratos',
    name: 'Revisor de contratos de prestação de serviços',
    description: 'Confere cláusulas obrigatórias, prazos e multas no contrato anexado e aponta o que falta.',
    role: 'Revisor',
    approach: 'Aponta cada problema com a cláusula e a sugestão de texto.',
    instructions: 'Revise o contrato com o playbook de prestação de serviços.',
    rules: [],
    writing_style: 'professional',
    model: 'anthropic/claude-opus-5.5',
    modelosPermitidos: ['anthropic/claude-opus-5.5'],
    type: 'reviewer',
    status: 'active',
    source: 'workspace',
    icon: 'i-lucide-file-search',
    ferramentas: comModoPadrao(['readFile']),
    arquivos: ['a3'],
    basesDeConhecimento: [],
    blocos: [],
    acesso: 'todos',
    acessoAlvos: [],
    editores: [1],
    dono: 1,
    sugestoes: [],
    versoes: [{ numero: 1, publicadaEm: '2026-10-02', por: 1, resumo: 'Primeira versão.' }],
    rascunhoPendente: false,
    casos: [],
    uso: { conversas: 77, pessoas: 5, creditos: 9310, positivas: 40, negativas: 2, confirmacoes: 0, canceladas: 0 },
    atualizadoEm: '2026-10-02',
    cor: '#f59e0b',
  },
  {
    slug: 'consulta-de-processos',
    name: 'Consulta de processos',
    description: 'Busca o andamento do processo no provedor jurídico e resume as últimas movimentações.',
    role: 'Pesquisador',
    approach: 'Confirma o número do processo antes de consultar, porque a consulta é cobrada.',
    instructions: 'Use as ferramentas jurídicas só quando a pessoa pedir a consulta.',
    rules: [],
    writing_style: 'concise',
    model: 'openai/gpt-6.1-terra',
    modelosPermitidos: ['openai/gpt-6.1-terra', 'anthropic/claude-sonnet-5.5'],
    type: 'chat',
    status: 'inactive',
    source: 'workspace',
    icon: 'i-lucide-landmark',
    ferramentas: comModoPadrao(['legalLookupCase', 'legalGetCaseMovements', 'legalGetCaseSummary', 'getCurrentDateTime']),
    arquivos: [],
    basesDeConhecimento: [],
    blocos: [],
    acesso: 'pessoas',
    acessoAlvos: ['Renata Lopes', 'Carlos Eduardo Albuquerque de Vasconcellos'],
    editores: [4],
    dono: 4,
    sugestoes: [],
    versoes: [{ numero: 1, publicadaEm: '2026-09-18', por: 4, resumo: 'Primeira versão.' }],
    rascunhoPendente: false,
    casos: [],
    uso: { conversas: 0, pessoas: 0, creditos: 0, positivas: 0, negativas: 0, confirmacoes: 0, canceladas: 0 },
    atualizadoEm: '2026-09-18',
    cor: '#10b981',
  },
  {
    slug: 'cobranca-amigavel',
    name: 'Cobrança amigável',
    description: 'Escreve a mensagem de cobrança com o histórico do cliente.',
    role: 'Assistente financeiro',
    approach: 'Tom cordial; nunca ameaça.',
    instructions: '',
    rules: [],
    writing_style: 'friendly',
    model: 'alibaba/qwen3.8-max',
    modelosPermitidos: ['alibaba/qwen3.8-max'],
    type: 'chat',
    status: 'inactive',
    source: 'workspace',
    icon: 'i-lucide-hand-coins',
    ferramentas: {},
    arquivos: [],
    basesDeConhecimento: [],
    blocos: [],
    acesso: 'todos',
    acessoAlvos: [],
    editores: [EU],
    dono: EU,
    sugestoes: [],
    versoes: [{ numero: 1, publicadaEm: null, por: EU, resumo: 'Rascunho.' }],
    rascunhoPendente: true,
    casos: [],
    uso: { conversas: 0, pessoas: 0, creditos: 0, positivas: 0, negativas: 0, confirmacoes: 0, canceladas: 0 },
    atualizadoEm: '2026-11-15',
    cor: '#ec4899',
  },
]

/** Os 3 agentes do sistema, como o develop mostra. Não se editam. */
export const agentesDoSistema = [
  { slug: 'beni', name: 'BENI', description: 'Agente generalista para usos diversos, incluindo revisão de documentos e textos.', cor: '#60a5fa' },
  { slug: 'beni-builder', name: 'BENI BUILDER', description: 'Agente especialista em estrutura e configuração de workspaces do ENSPACE.', cor: '#60a5fa' },
  { slug: 'reviewer', name: 'REVIEWER', description: 'Agente especialista em revisão de documentos e textos.', cor: '#8b5cf6' },
]

/** PROPOSTA: pontos de partida para o agente novo. */
export const modelosDeAgente = [
  { id: 'oficios', icone: 'i-lucide-scale', ferramentas: ['readFile', 'getCurrentDateTime'] },
  { id: 'triagem', icone: 'i-lucide-inbox', ferramentas: ['smartQueryItems', 'createTask'] },
  { id: 'contratos', icone: 'i-lucide-file-search', ferramentas: ['readFile'] },
  { id: 'resumo', icone: 'i-lucide-list-collapse', ferramentas: ['getItemByReference', 'getTaskSummary'] },
  { id: 'onboarding', icone: 'i-lucide-user-plus', ferramentas: ['smartQueryItems', 'sendEmail'] },
  { id: 'faq', icone: 'i-lucide-message-circle-question', ferramentas: ['searchKnowledgeBase'] },
] as const

export const basesDisponiveis = ['Base de atendimento', 'Normas internas', 'Jurisprudência selecionada']
