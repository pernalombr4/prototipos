// Dado do protótipo — 100% fictício, com a ESTRUTURA do produto.
//
// Os tipos abaixo são ancorados nos schemas reais da API, do
// `@be-enlighten/enspace-sdk-schemas`:
//
//   Workspace            → name, reference, description, icon, status, members_count
//   Wallet               → reference, name, status, currency ('ENCOIN'), balance
//   Transaction          → type ('credit' | 'debit'), amount, description, created_at
//   CreditRequest        → amount, status ('pending'|'approved'|'rejected'|'cancelled'), reason
//   DictionaryKeysTree   → types → { name, singularName, description, attributes → { label,
//                          description, help, instruction, placeholder, options }, forms }
//
// Campo que o schema não tem e o protótipo precisou inventar está marcado com
// comentário dizendo de onde veio.
//
// Os VALORES são inventados: nenhuma empresa, pessoa, categoria ou transação aqui
// é real. Nada veio de cliente.

import type {
  Workspace as WorkspaceApi,
  Wallet as WalletApi,
  Transaction as TransactionApi,
  CreditRequest as CreditRequestApi,
} from '@be-enlighten/enspace-sdk-schemas'

/* ------------------------------------------------------------------ *
 * Documentação — URLs reais, conferidas em 16/09/2026.
 * É o que responde à sexta queixa da demanda: cada seção leva ao artigo
 * que a explica.
 * ------------------------------------------------------------------ */

const DOCS = 'https://docs.enspace.io/pt/docs/workspace/sections/settings/system'

export const documentacao = {
  indice: DOCS,
  basicas: `${DOCS}/basic-information`,
  calendario: `${DOCS}/calendar`,
  notificacoes: `${DOCS}/notifications`,
  dicionarios: `${DOCS}/dictionaries`,
  cobranca: `${DOCS}/billing`,
}

/* ------------------------------------------------------------------ *
 * Identidade do workspace
 * ------------------------------------------------------------------ */

type CamposDoWorkspace = Pick<
  WorkspaceApi,
  'id' | 'name' | 'reference' | 'description' | 'icon' | 'status' | 'members_count'
>

export interface Identidade extends CamposDoWorkspace {
  /** Acrescentado pelo protótipo: a tela de hoje chama de "Tipo de Logo". */
  tipoDeMarca: 'icone' | 'imagem'
  /** `config.default_language` no produto; a tela mostra como "Linguagem Padrão". */
  idiomaPadrao: 'pt-BR' | 'en' | 'es'
}

export const identidade: Identidade = {
  id: 412,
  name: 'Contratos Aurora',
  reference: 'contratos-aurora',
  description: 'Contratos, fornecedores e chamados jurídicos do Grupo Aurora.',
  // O produto guarda o nome iconify da marca (no develop havia `carbon:tree`).
  // Aqui usamos uma coleção que este repositório empacota, para o ícone renderizar.
  icon: 'lucide:file-signature',
  status: 'active',
  members_count: 34,
  tipoDeMarca: 'icone',
  idiomaPadrao: 'pt-BR',
}

/* ------------------------------------------------------------------ *
 * Comportamento e módulos
 *
 * Os textos de ajuda dos cinco primeiros existem hoje no produto, no "?"
 * de cada linha — e são bons. O que muda no protótipo é o lugar: sai do
 * extremo direito da tela e encosta no rótulo que explica.
 * ------------------------------------------------------------------ */

export interface Ajuste {
  chave: string
  rotulo: string
  /** Uma linha, visível sem hover. Hoje mora dentro de um "?" a 1290 px do rótulo. */
  descricao: string
  valor: boolean
  /** Acrescentado pelo protótipo: o que muda na tela quando isso liga. */
  efeito?: string
  /** Acrescentado pelo protótipo: aviso de risco, quando existe. */
  risco?: string
  /** Acrescentado pelo protótipo: âncora do artigo que explica. */
  doc?: string
}

export const comportamento: Ajuste[] = [
  {
    chave: 'mostrar_categorias',
    rotulo: 'Mostrar categorias',
    descricao: 'Exibe as categorias do workspace na tela de Início.',
    efeito: 'Muda a tela de Início de todos os membros.',
    valor: true,
  },
  {
    chave: 'ignorar_permissoes_full',
    rotulo: 'Ignorar permissões para membros full',
    descricao:
      'Membros com licença Full passam a ter acesso irrestrito, ignorando as regras do cargo.',
    risco: 'Na prática, equipara o membro Full ao Proprietário. Hoje isso afeta 6 membros.',
    valor: false,
  },
  {
    chave: 'ocultar_botao_criar',
    rotulo: 'Ocultar botão de criar na tela de categorias',
    descricao:
      'Remove o botão de criar item. Útil para categorias que só recebem item por Spaceflow.',
    efeito: 'Ninguém cria item pela tela; a criação passa a ser só por automação ou API.',
    valor: false,
  },
  {
    chave: 'mostrar_url_integracao',
    rotulo: 'Mostrar URL de integração',
    descricao: 'Exibe, no item, o endereço usado por integrações externas para referenciá-lo.',
    efeito: 'Aparece um campo a mais no topo de cada item.',
    valor: false,
  },
  {
    chave: 'carimbo_personalizado',
    rotulo: 'Habilitar carimbo personalizado em documentos',
    descricao: 'Cada membro passa a ter a própria chancela para documentos gerados por fluxos.',
    efeito: 'É o pré-requisito da Chancela de Documentos.',
    valor: true,
  },
]

export const modulos: Ajuste[] = [
  {
    chave: 'correcao_monetaria',
    rotulo: 'Correção Monetária',
    descricao: 'Atualiza valores por índices oficiais (IPCA, INPC, IGP-M) nos campos de moeda.',
    efeito: 'Desligar não desfaz o que já foi corrigido — só interrompe novas correções.',
    valor: true,
  },
  {
    chave: 'comparacoes',
    rotulo: 'Comparações',
    descricao: 'Permite comparar dois itens da mesma categoria lado a lado.',
    valor: false,
  },
  {
    chave: 'juridico',
    rotulo: 'Jurídico',
    descricao: 'Recursos de acompanhamento processual e prazos judiciais.',
    // Na tela de hoje está escrito "Juridico", sem acento. A divergência está no DECISOES.md.
    valor: true,
  },
]

/* ------------------------------------------------------------------ *
 * Calendário
 * ------------------------------------------------------------------ */

export const diasDaSemana = [
  { chave: 0, curto: 'D', nome: 'Domingo' },
  { chave: 1, curto: 'S', nome: 'Segunda-feira' },
  { chave: 2, curto: 'T', nome: 'Terça-feira' },
  { chave: 3, curto: 'Q', nome: 'Quarta-feira' },
  { chave: 4, curto: 'Q', nome: 'Quinta-feira' },
  { chave: 5, curto: 'S', nome: 'Sexta-feira' },
  { chave: 6, curto: 'S', nome: 'Sábado' },
]

export const diasUteisPadrao = [1, 2, 3, 4, 5]

export interface Feriado {
  id: number
  /** ISO, como a API grava. */
  data: string
  nome: string
  /** Acrescentado pelo protótipo: hoje o feriado importado não guarda país. */
  pais: 'BR' | 'US'
  abrangencia: 'Nacional' | 'Estadual' | 'Municipal'
}

/** O estado real do workspace de exploração: Brasil e EUA misturados (S3-F3). */
export const feriadosImportados: Feriado[] = [
  { id: 1, data: '2026-09-07', nome: 'Independência do Brasil', pais: 'BR', abrangencia: 'Nacional' },
  { id: 2, data: '2026-10-12', nome: 'Nossa Senhora Aparecida', pais: 'BR', abrangencia: 'Nacional' },
  { id: 3, data: '2026-11-02', nome: 'Finados', pais: 'BR', abrangencia: 'Nacional' },
  { id: 4, data: '2026-11-11', nome: 'Veterans Day', pais: 'US', abrangencia: 'Nacional' },
  { id: 5, data: '2026-11-15', nome: 'Proclamação da República', pais: 'BR', abrangencia: 'Nacional' },
  { id: 6, data: '2026-11-20', nome: 'Consciência Negra', pais: 'BR', abrangencia: 'Nacional' },
  { id: 7, data: '2026-12-25', nome: 'Natal', pais: 'BR', abrangencia: 'Nacional' },
]

/** O que a prévia mostraria antes de gravar, se a pessoa escolhesse o Brasil. */
export const feriadosDisponiveisBR: Feriado[] = [
  { id: 101, data: '2027-01-01', nome: 'Confraternização Universal', pais: 'BR', abrangencia: 'Nacional' },
  { id: 102, data: '2027-02-09', nome: 'Carnaval', pais: 'BR', abrangencia: 'Nacional' },
  { id: 103, data: '2027-04-02', nome: 'Sexta-feira Santa', pais: 'BR', abrangencia: 'Nacional' },
  { id: 104, data: '2027-04-21', nome: 'Tiradentes', pais: 'BR', abrangencia: 'Nacional' },
  { id: 105, data: '2027-05-01', nome: 'Dia do Trabalho', pais: 'BR', abrangencia: 'Nacional' },
  { id: 106, data: '2027-09-07', nome: 'Independência do Brasil', pais: 'BR', abrangencia: 'Nacional' },
]

export interface Ocorrencia {
  id: number
  data: string
  nome: string
  tipo: 'Recesso' | 'Evento interno' | 'Ponto facultativo'
  /** Acrescentado pelo protótipo: ocorrência pode ou não suspender o expediente. */
  contaComoUtil: boolean
}

export const ocorrencias: Ocorrencia[] = [
  { id: 1, data: '2026-09-25', nome: 'Reunião geral do jurídico', tipo: 'Evento interno', contaComoUtil: true },
  { id: 2, data: '2026-12-28', nome: 'Recesso de fim de ano', tipo: 'Recesso', contaComoUtil: false },
  { id: 3, data: '2026-12-29', nome: 'Recesso de fim de ano', tipo: 'Recesso', contaComoUtil: false },
]

/* ------------------------------------------------------------------ *
 * Notificações
 * ------------------------------------------------------------------ */

export type Unidade = 'minuto' | 'hora' | 'dia' | 'semana'
export type Direcao = 'antes' | 'depois'

export interface RegraDeAviso {
  id: number
  direcao: Direcao
  quantidade: number
  unidade: Unidade
  /** id do modelo de e-mail */
  modelo: number | null
  ativa: boolean
}

export interface ModeloDeEmail {
  id: number
  nome: string
  assunto: string
}

export const modelosDeEmail: ModeloDeEmail[] = [
  { id: 1, nome: 'Prazo se aproximando', assunto: 'Sua tarefa {{tarefa}} vence em {{prazo}}' },
  { id: 2, nome: 'Tarefa vencida', assunto: '{{tarefa}} venceu em {{prazo}}' },
  { id: 3, nome: 'Aviso ao gestor', assunto: 'Pendência de {{responsavel}} em {{categoria}}' },
]

/** O que o ENSPACE envia hoje, sozinho, quando a tarefa tem prazo. */
export const avisosNativos: { rotulo: string, detalhe: string }[] = [
  { rotulo: '1 dia antes do vencimento', detalhe: 'Para o responsável pela tarefa' },
  { rotulo: 'No dia do vencimento', detalhe: 'Para o responsável pela tarefa' },
  { rotulo: '1 dia depois do vencimento', detalhe: 'Para o responsável pela tarefa' },
]

export const regrasSpaceflow: RegraDeAviso[] = [
  { id: 1, direcao: 'antes', quantidade: 2, unidade: 'hora', modelo: 1, ativa: true },
  { id: 2, direcao: 'depois', quantidade: 1, unidade: 'dia', modelo: 2, ativa: true },
]

export const regrasAgendadas: RegraDeAviso[] = [
  { id: 3, direcao: 'antes', quantidade: 3, unidade: 'dia', modelo: 1, ativa: true },
  { id: 4, direcao: 'antes', quantidade: 1, unidade: 'dia', modelo: 1, ativa: true },
  { id: 5, direcao: 'depois', quantidade: 2, unidade: 'dia', modelo: 3, ativa: false },
]

/* ------------------------------------------------------------------ *
 * Dicionários
 *
 * A estrutura é a do `DictionaryKeysTree`: cada categoria tem Geral
 * (name, singularName, description), Campos (label, description, help,
 * instruction, placeholder, e um por opção de lista) e Formulários.
 *
 * É essa multiplicação que faz a aba "ficar extensa": 3 categorias com
 * 17 campos viram 96 chaves. Um workspace de verdade passa de 3.000.
 * ------------------------------------------------------------------ */

export type TipoDeChave =
  | 'Nome'
  | 'Nome no singular'
  | 'Descrição'
  | 'Rótulo'
  | 'Texto de ajuda'
  | 'Instrução'
  | 'Texto de exemplo'
  | 'Opção'

export interface ChaveDeTraducao {
  id: string
  categoria: string
  grupo: 'Geral' | 'Campos' | 'Formulários'
  /** O campo ou formulário a que a chave pertence. Vazio no grupo Geral. */
  dono: string
  tipo: TipoDeChave
  original: string
  traducao: string
}

interface CampoFonte {
  nome: string
  label: string
  ajuda?: string
  instrucao?: string
  exemplo?: string
  opcoes?: string[]
}

interface CategoriaFonte {
  nome: string
  singular: string
  descricao: string
  campos: CampoFonte[]
  formularios: { nome: string, descricao: string }[]
}

const categoriasFonte: CategoriaFonte[] = [
  {
    nome: 'Contratos',
    singular: 'Contrato',
    descricao: 'Contratos assinados com fornecedores e prestadores.',
    campos: [
      {
        nome: 'numero',
        label: 'Número do contrato',
        ajuda: 'Use o número do sistema de origem, sem pontos.',
        exemplo: 'CT-2026-0148',
      },
      {
        nome: 'vigencia_inicio',
        label: 'Início da vigência',
        ajuda: 'Data em que o contrato passa a valer.',
        instrucao: 'A data não pode ser posterior ao fim da vigência.',
      },
      {
        nome: 'vigencia_fim',
        label: 'Fim da vigência',
        instrucao: 'Deixe em branco para contrato por prazo indeterminado.',
      },
      {
        nome: 'valor_total',
        label: 'Valor total',
        ajuda: 'Valor cheio do contrato, sem descontar aditivos.',
        exemplo: 'R$ 250.000,00',
      },
      {
        nome: 'modalidade',
        label: 'Modalidade',
        opcoes: ['Prestação de serviço', 'Fornecimento', 'Comodato', 'Parceria'],
      },
      {
        nome: 'situacao',
        label: 'Situação',
        ajuda: 'Muda sozinha quando a vigência termina.',
        opcoes: ['Em elaboração', 'Vigente', 'Encerrado', 'Rescindido'],
      },
      {
        nome: 'responsavel_juridico',
        label: 'Responsável jurídico',
        instrucao: 'Só aparecem membros com o cargo Jurídico.',
      },
      {
        nome: 'clausula_rescisao',
        label: 'Cláusula de rescisão',
        ajuda: 'Cole o texto exatamente como está no contrato assinado.',
        exemplo: 'Rescisão mediante aviso prévio de 30 dias.',
      },
    ],
    formularios: [
      { nome: 'Abertura de contrato', descricao: 'O que o time comercial preenche ao enviar para o jurídico.' },
      { nome: 'Aditivo', descricao: 'Alteração de valor ou de prazo em contrato vigente.' },
    ],
  },
  {
    nome: 'Fornecedores',
    singular: 'Fornecedor',
    descricao: 'Empresas homologadas para prestar serviço ao grupo.',
    campos: [
      {
        nome: 'razao_social',
        label: 'Razão social',
        ajuda: 'Como consta no cartão CNPJ.',
        exemplo: 'Aurora Serviços Integrados Ltda.',
      },
      {
        nome: 'documento',
        label: 'CNPJ',
        instrucao: 'Somente números.',
        exemplo: '00.000.000/0001-00',
      },
      {
        nome: 'porte',
        label: 'Porte',
        opcoes: ['MEI', 'Pequeno', 'Médio', 'Grande'],
      },
      {
        nome: 'homologado_em',
        label: 'Homologado em',
        ajuda: 'Data do parecer favorável do compliance.',
      },
      {
        nome: 'risco',
        label: 'Grau de risco',
        ajuda: 'Calculado pelo questionário de compliance.',
        opcoes: ['Baixo', 'Médio', 'Alto'],
      },
      {
        nome: 'contato_comercial',
        label: 'Contato comercial',
        exemplo: 'nome@fornecedor.com.br',
      },
    ],
    formularios: [
      { nome: 'Cadastro de fornecedor', descricao: 'Primeira entrada, antes da homologação.' },
    ],
  },
  {
    nome: 'Chamados jurídicos',
    singular: 'Chamado jurídico',
    descricao: 'Pedidos de análise e parecer feitos pelas áreas.',
    campos: [
      {
        nome: 'assunto',
        label: 'Assunto',
        instrucao: 'Uma frase. O detalhe vai na descrição.',
        exemplo: 'Revisão de cláusula de confidencialidade',
      },
      {
        nome: 'urgencia',
        label: 'Urgência',
        ajuda: 'Urgência alta encurta o prazo de resposta para 1 dia útil.',
        opcoes: ['Baixa', 'Normal', 'Alta'],
      },
      {
        nome: 'area_solicitante',
        label: 'Área solicitante',
      },
    ],
    formularios: [
      { nome: 'Abertura de chamado', descricao: 'O que a área preenche para pedir análise.' },
      { nome: 'Devolutiva', descricao: 'O parecer que o jurídico devolve.' },
    ],
  },
]

/** Traduções que já existem — de propósito, distribuídas de forma desigual. */
const traducoesProntas: Record<string, string> = {
  'contratos.geral.nome': 'Contracts',
  'contratos.geral.singular': 'Contract',
  'contratos.geral.descricao': 'Contracts signed with suppliers and service providers.',
  'contratos.numero.label': 'Contract number',
  'contratos.numero.ajuda': 'Use the number from the source system, without dots.',
  'contratos.vigencia_inicio.label': 'Start of term',
  'contratos.vigencia_fim.label': 'End of term',
  'contratos.valor_total.label': 'Total value',
  'contratos.modalidade.label': 'Type',
  'contratos.modalidade.opcao.0': 'Service agreement',
  'contratos.modalidade.opcao.1': 'Supply',
  'contratos.situacao.label': 'Status',
  'fornecedores.geral.nome': 'Suppliers',
  'fornecedores.geral.singular': 'Supplier',
  'fornecedores.razao_social.label': 'Legal name',
  'fornecedores.documento.label': 'Tax ID',
  'fornecedores.porte.label': 'Size',
}

function chavesDaCategoria(cat: CategoriaFonte): ChaveDeTraducao[] {
  const base = cat.nome.toLowerCase().split(' ')[0]
  const lista: ChaveDeTraducao[] = []

  const push = (
    grupo: ChaveDeTraducao['grupo'],
    dono: string,
    tipo: TipoDeChave,
    sufixo: string,
    original: string,
  ) => {
    const id = `${base}.${sufixo}`
    lista.push({
      id,
      categoria: cat.nome,
      grupo,
      dono,
      tipo,
      original,
      traducao: traducoesProntas[id] ?? '',
    })
  }

  push('Geral', '', 'Nome', 'geral.nome', cat.nome)
  push('Geral', '', 'Nome no singular', 'geral.singular', cat.singular)
  push('Geral', '', 'Descrição', 'geral.descricao', cat.descricao)

  for (const campo of cat.campos) {
    push('Campos', campo.label, 'Rótulo', `${campo.nome}.label`, campo.label)
    if (campo.ajuda) push('Campos', campo.label, 'Texto de ajuda', `${campo.nome}.ajuda`, campo.ajuda)
    if (campo.instrucao) push('Campos', campo.label, 'Instrução', `${campo.nome}.instrucao`, campo.instrucao)
    if (campo.exemplo) push('Campos', campo.label, 'Texto de exemplo', `${campo.nome}.exemplo`, campo.exemplo)
    campo.opcoes?.forEach((opcao, i) => {
      push('Campos', campo.label, 'Opção', `${campo.nome}.opcao.${i}`, opcao)
    })
  }

  cat.formularios.forEach((form, i) => {
    push('Formulários', form.nome, 'Nome', `formulario.${i}.nome`, form.nome)
    push('Formulários', form.nome, 'Descrição', `formulario.${i}.descricao`, form.descricao)
  })

  return lista
}

export const chavesDeTraducao: ChaveDeTraducao[] = categoriasFonte.flatMap(chavesDaCategoria)

/**
 * Sugestões de tradução para o inglês.
 *
 * Existe para o botão de IA fazer alguma coisa de verdade no protótipo. É
 * **de propósito incompleto**: algumas chaves ficam sem sugestão, porque é
 * assim que a tela se comporta quando a IA não dá conta — e a tela precisa
 * dizer isso em vez de fingir que traduziu tudo.
 */
export const sugestoesDeIa: Record<string, string> = {
  'Contratos': 'Contracts',
  'Contrato': 'Contract',
  'Contratos assinados com fornecedores e prestadores.': 'Contracts signed with suppliers and service providers.',
  'Número do contrato': 'Contract number',
  'Use o número do sistema de origem, sem pontos.': 'Use the number from the source system, without dots.',
  'Início da vigência': 'Start of term',
  'Data em que o contrato passa a valer.': 'The date the contract takes effect.',
  'Fim da vigência': 'End of term',
  'Deixe em branco para contrato por prazo indeterminado.': 'Leave blank for open-ended contracts.',
  'Valor total': 'Total value',
  'Valor cheio do contrato, sem descontar aditivos.': 'Full contract value, before amendments.',
  'Modalidade': 'Type',
  'Prestação de serviço': 'Service agreement',
  'Fornecimento': 'Supply',
  'Comodato': 'Loan for use',
  'Parceria': 'Partnership',
  'Situação': 'Status',
  'Muda sozinha quando a vigência termina.': 'Changes on its own when the term ends.',
  'Em elaboração': 'Draft',
  'Vigente': 'Active',
  'Encerrado': 'Closed',
  'Rescindido': 'Terminated',
  'Responsável jurídico': 'Legal owner',
  'Cláusula de rescisão': 'Termination clause',
  'Abertura de contrato': 'New contract request',
  'Aditivo': 'Amendment',
  'Fornecedores': 'Suppliers',
  'Fornecedor': 'Supplier',
  'Empresas homologadas para prestar serviço ao grupo.': 'Companies approved to provide services to the group.',
  'Razão social': 'Legal name',
  'Como consta no cartão CNPJ.': 'As registered with the tax authority.',
  'CNPJ': 'Tax ID',
  'Somente números.': 'Digits only.',
  'Porte': 'Size',
  'MEI': 'Sole proprietor',
  'Pequeno': 'Small',
  'Médio': 'Medium',
  'Grande': 'Large',
  'Homologado em': 'Approved on',
  'Grau de risco': 'Risk level',
  'Baixo': 'Low',
  'Alto': 'High',
  'Contato comercial': 'Sales contact',
  'Cadastro de fornecedor': 'Supplier registration',
  'Chamados jurídicos': 'Legal requests',
  'Chamado jurídico': 'Legal request',
  'Assunto': 'Subject',
  'Urgência': 'Urgency',
  'Baixa': 'Low',
  'Normal': 'Normal',
  'Alta': 'High',
  'Área solicitante': 'Requesting team',
  'Abertura de chamado': 'New request',
  'Devolutiva': 'Legal response',
}

export const idiomas = [
  { codigo: 'en', nome: 'Inglês', bandeira: '🇺🇸' },
  { codigo: 'es', nome: 'Espanhol', bandeira: '🇪🇸' },
  { codigo: 'pt-BR', nome: 'Português (Brasil)', bandeira: '🇧🇷' },
]

/**
 * Quantas chaves um workspace de verdade tem. O número está na documentação
 * do produto ("0 de 3651 traduzidas") e é o que o desenho precisa aguentar.
 */
export const chavesNoWorkspaceReal = 3651

/* ------------------------------------------------------------------ *
 * Cobrança
 * ------------------------------------------------------------------ */

type CamposDaCarteira = Pick<WalletApi, 'reference' | 'name' | 'status' | 'currency' | 'balance'>

export interface Carteira extends CamposDaCarteira {
  /** Acrescentado pelo protótipo: a carteira é da pessoa e atravessa workspaces. */
  dono: string
  /** Acrescentado pelo protótipo: teto combinado no contrato, para o "x / y". */
  limiteDoPeriodo: number
}

export const carteira: Carteira = {
  reference: 'wal-ana-ribeiro',
  name: 'Carteira de Ana Ribeiro',
  status: 'active',
  currency: 'ENCOIN',
  balance: 2801,
  dono: 'Ana Ribeiro',
  limiteDoPeriodo: 6000,
}

type CamposDaTransacao = Pick<TransactionApi, 'id' | 'type' | 'amount' | 'description'>

export interface Transacao extends CamposDaTransacao {
  /** `created_at` do schema, já como ISO. */
  data: string
  /** Acrescentado pelo protótipo: hoje isso vive dentro da descrição, em texto corrido. */
  origem: { recurso: string, workspace: string, pessoa: string, detalhe?: string }
}

export const transacoes: Transacao[] = [
  { id: 1, type: 'debit', amount: 70, description: 'Uso de agente de IA', data: '2026-09-15T16:40:00', origem: { recurso: 'Analista de duplicidade', workspace: 'Contratos Aurora', pessoa: 'Ana Ribeiro', detalhe: '217 mil tokens' } },
  { id: 2, type: 'debit', amount: 95, description: 'Uso de agente de IA', data: '2026-09-15T11:02:00', origem: { recurso: 'Analista de duplicidade', workspace: 'Contratos Aurora', pessoa: 'Ana Ribeiro', detalhe: '298 mil tokens' } },
  { id: 3, type: 'credit', amount: 1500, description: 'Recarga aprovada', data: '2026-09-14T09:12:00', origem: { recurso: 'Solicitação #2291', workspace: 'Contratos Aurora', pessoa: 'Financeiro Aurora' } },
  { id: 4, type: 'debit', amount: 70, description: 'Uso de agente de IA', data: '2026-09-14T08:55:00', origem: { recurso: 'Analista de duplicidade', workspace: 'Contratos Aurora', pessoa: 'Ana Ribeiro', detalhe: '213 mil tokens' } },
  { id: 5, type: 'debit', amount: 111, description: 'Uso de agente de IA', data: '2026-09-13T18:20:00', origem: { recurso: 'Analista de duplicidade', workspace: 'Contratos Aurora', pessoa: 'Ana Ribeiro', detalhe: '343 mil tokens' } },
  { id: 6, type: 'debit', amount: 17, description: 'Tradução automática do dicionário', data: '2026-09-13T15:44:00', origem: { recurso: 'Dicionários', workspace: 'Chamados Aurora', pessoa: 'Ana Ribeiro', detalhe: '48 chaves' } },
  { id: 7, type: 'debit', amount: 32, description: 'Uso de agente de IA', data: '2026-09-12T10:31:00', origem: { recurso: 'Triagem de entrada', workspace: 'Chamados Aurora', pessoa: 'Ana Ribeiro', detalhe: '85 mil tokens' } },
  { id: 8, type: 'debit', amount: 79, description: 'Uso de agente de IA', data: '2026-09-11T17:05:00', origem: { recurso: 'Analista de duplicidade', workspace: 'Contratos Aurora', pessoa: 'Ana Ribeiro', detalhe: '239 mil tokens' } },
  { id: 9, type: 'debit', amount: 84, description: 'Uso de agente de IA', data: '2026-09-11T09:48:00', origem: { recurso: 'Analista de duplicidade', workspace: 'Contratos Aurora', pessoa: 'Ana Ribeiro', detalhe: '258 mil tokens' } },
  { id: 10, type: 'debit', amount: 8, description: 'Extração de documento', data: '2026-09-10T14:22:00', origem: { recurso: 'Leitor de PDF', workspace: 'Contratos Aurora', pessoa: 'Bruno Sales', detalhe: '12 páginas' } },
  { id: 11, type: 'debit', amount: 51, description: 'Uso de agente de IA', data: '2026-09-09T16:10:00', origem: { recurso: 'Analista de duplicidade', workspace: 'Contratos Aurora', pessoa: 'Ana Ribeiro', detalhe: '152 mil tokens' } },
  { id: 12, type: 'credit', amount: 400, description: 'Estorno de execução interrompida', data: '2026-09-08T12:00:00', origem: { recurso: 'Suporte ENSPACE', workspace: 'Contratos Aurora', pessoa: 'Suporte' } },
]

/** Consumo diário dos últimos 30 dias — é o que vira a linha do tempo da carteira. */
export const consumoDiario: { dia: string, credits: number }[] = [
  { dia: '2026-08-18', credits: 120 }, { dia: '2026-08-19', credits: 86 },
  { dia: '2026-08-20', credits: 143 }, { dia: '2026-08-21', credits: 52 },
  { dia: '2026-08-22', credits: 0 }, { dia: '2026-08-23', credits: 0 },
  { dia: '2026-08-24', credits: 176 }, { dia: '2026-08-25', credits: 98 },
  { dia: '2026-08-26', credits: 210 }, { dia: '2026-08-27', credits: 164 },
  { dia: '2026-08-28', credits: 132 }, { dia: '2026-08-29', credits: 0 },
  { dia: '2026-08-30', credits: 0 }, { dia: '2026-08-31', credits: 188 },
  { dia: '2026-09-01', credits: 205 }, { dia: '2026-09-02', credits: 151 },
  { dia: '2026-09-03', credits: 96 }, { dia: '2026-09-04', credits: 122 },
  { dia: '2026-09-05', credits: 0 }, { dia: '2026-09-06', credits: 0 },
  { dia: '2026-09-07', credits: 0 }, { dia: '2026-09-08', credits: 143 },
  { dia: '2026-09-09', credits: 51 }, { dia: '2026-09-10', credits: 8 },
  { dia: '2026-09-11', credits: 163 }, { dia: '2026-09-12', credits: 32 },
  { dia: '2026-09-13', credits: 128 }, { dia: '2026-09-14', credits: 70 },
  { dia: '2026-09-15', credits: 165 }, { dia: '2026-09-16', credits: 44 },
]

/** No que os créditos foram, nos últimos 30 dias. */
export const consumoPorRecurso: { recurso: string, credits: number, execucoes: number }[] = [
  { recurso: 'Analista de duplicidade', credits: 1840, execucoes: 26 },
  { recurso: 'Triagem de entrada', credits: 412, execucoes: 14 },
  { recurso: 'Tradução automática do dicionário', credits: 231, execucoes: 5 },
  { recurso: 'Leitor de PDF', credits: 104, execucoes: 13 },
  { recurso: 'Resumo de chamado', credits: 62, execucoes: 9 },
]

type CamposDaSolicitacao = Pick<CreditRequestApi, 'id' | 'amount' | 'status' | 'reason'>

export interface Solicitacao extends CamposDaSolicitacao {
  /** `created_at` do schema, já como ISO. */
  data: string
  /** Acrescentado pelo protótipo: quem pediu, para a lista fazer sentido a várias mãos. */
  solicitante: string
  /** `reviewer_note` do schema. */
  respostaDoAnalista?: string
}

export const solicitacoes: Solicitacao[] = [
  { id: 2318, amount: 2000, status: 'pending', reason: 'Fechamento trimestral de contratos', data: '2026-09-16T08:30:00', solicitante: 'Ana Ribeiro' },
  { id: 2291, amount: 1500, status: 'approved', reason: 'Recarga mensal', data: '2026-09-13T14:05:00', solicitante: 'Ana Ribeiro', respostaDoAnalista: 'Aprovada dentro do limite do contrato.' },
  { id: 2260, amount: 5000, status: 'rejected', reason: 'Piloto de agente novo', data: '2026-09-02T10:41:00', solicitante: 'Bruno Sales', respostaDoAnalista: 'Acima do limite mensal. Abra um pedido de até 2.000.' },
]

/* ------------------------------------------------------------------ *
 * O que é um en-credit — a definição que falta na tela de hoje.
 * ------------------------------------------------------------------ */

export const definicaoDoCredito = {
  termo: 'en-credit',
  frase: 'A unidade que o ENSPACE consome quando usa inteligência artificial em nome do workspace.',
  exemplos: [
    'Uma execução de agente custa entre 8 e 120 en-credits, conforme o tamanho do documento.',
    'Traduzir o dicionário inteiro para um idioma custa cerca de 230 en-credits.',
    'Ações sem IA — criar item, rodar fluxo, enviar e-mail — não consomem en-credits.',
  ],
}
