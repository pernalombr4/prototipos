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

const WS = 'https://docs.enspace.io/pt/docs/workspace'
const DOCS = `${WS}/sections/settings/system`

export const documentacao = {
  indice: DOCS,
  basicas: `${DOCS}/basic-information`,
  calendario: `${DOCS}/calendar`,
  notificacoes: `${DOCS}/notifications`,
  dicionarios: `${DOCS}/dictionaries`,
  cobranca: `${DOCS}/billing`,
  /* Fora de Sistema: o que gasta en-credits mora em outras seções. */
  agentes: `${WS}/sections/settings/ai-agents`,
  chatDeIa: `${WS}/resources/ai-chat`,
  nosDeIa: `${WS}/sections/settings/structure/spaceflow/nodes`,
}

/* ------------------------------------------------------------------ *
 * Identidade do workspace
 * ------------------------------------------------------------------ */

type CamposDoWorkspace = Pick<
  WorkspaceApi,
  'id' | 'name' | 'reference' | 'description' | 'icon' | 'status' | 'members_count'
>

export interface Identidade extends CamposDoWorkspace {
  /** O produto chama de "Tipo de Logo": escolhe entre um ícone e uma imagem. */
  tipoDeMarca: 'icone' | 'imagem'
  /**
   * Acrescentado pelo protótipo: no produto o logo enviado vira arquivo no
   * servidor e o workspace guarda a URL. Aqui é uma URL de objeto criada pelo
   * próprio navegador, que morre no reload. Nada sai da máquina.
   */
  logoImagem?: string | null
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
  logoImagem: null,
}

/* ------------------------------------------------------------------ *
 * Padrões do workspace
 *
 * O que vale quando ninguém escolheu nada. O HubSpot chama de "Account
 * Defaults" e separa isso da identidade da empresa (PESQUISA.md, rodada 4).
 * Aqui o objeto é o workspace, não a conta, e o nome segue o objeto.
 *
 * `idioma` existe hoje no produto (a tela mostra como "Linguagem Padrão").
 * `fuso` e `moeda` são PROPOSTA do protótipo: não existem na tela de hoje.
 * A moeda tem precedente na API, que já enumera BRL, USD, EUR e ENCOIN no
 * schema de carteira.
 * ------------------------------------------------------------------ */

export interface PadroesDoWorkspace {
  idioma: 'pt-BR' | 'en' | 'es'
  /** Acrescentado pelo protótipo. */
  fuso: string
  /** Acrescentado pelo protótipo, com os códigos que a API já usa em Wallet. */
  moeda: 'BRL' | 'USD' | 'EUR'
}

export const padroes: PadroesDoWorkspace = {
  idioma: 'pt-BR',
  fuso: 'America/Sao_Paulo',
  moeda: 'BRL',
}

export const fusos = [
  { label: 'Brasília (GMT-3)', value: 'America/Sao_Paulo' },
  { label: 'Manaus (GMT-4)', value: 'America/Manaus' },
  { label: 'Fernando de Noronha (GMT-2)', value: 'America/Noronha' },
  { label: 'Lisboa (GMT+1)', value: 'Europe/Lisbon' },
  { label: 'Nova York (GMT-4)', value: 'America/New_York' },
]

export const moedas = [
  { label: 'Real brasileiro (R$)', value: 'BRL' },
  { label: 'Dólar americano (US$)', value: 'USD' },
  { label: 'Euro (€)', value: 'EUR' },
]

/* ------------------------------------------------------------------ *
 * Comportamento e módulos
 *
 * Cada chave tem DOIS textos, e a divisão é o desenho:
 *
 *   `descricao` — uma linha, sempre visível. Curta de propósito (cabe em
 *     uma linha da coluna) porque é ela que deixa a lista escaneável: dá
 *     para decidir sem interagir com nada.
 *   `detalhe`  — o que a pessoa lê quando quer saber mais, atrás do "?"
 *     ao lado do rótulo. Aqui cabe o efeito, o exemplo e a ressalva.
 *
 * O "?" existe no produto de hoje e o texto dele é bom; o que estava
 * errado era o lugar (extremo direito da tela, a 1290 px do rótulo).
 * Aqui ele encosta no nome da coisa que explica.
 * ------------------------------------------------------------------ */

export interface Ajuste {
  chave: string
  rotulo: string
  /** Uma linha, sempre visível. Curta: é o que faz a lista ser escaneável. */
  descricao: string
  valor: boolean
  /** Atrás do "?" ao lado do rótulo: o efeito, o exemplo, a ressalva. */
  detalhe?: string
  /** Acrescentado pelo protótipo: aviso de risco. Aparece na tela quando está ligado. */
  risco?: string
  /** Acrescentado pelo protótipo: âncora do artigo que explica. */
  doc?: string
}

export const comportamento: Ajuste[] = [
  {
    chave: 'mostrar_categorias',
    rotulo: 'Mostrar categorias',
    descricao: 'Lista as categorias na tela de Início.',
    detalhe:
      'A tela de Início passa a mostrar os atalhos para cada categoria do workspace. Vale para todos os membros, não só para você.',
    valor: true,
  },
  {
    chave: 'ignorar_permissoes_full',
    rotulo: 'Ignorar permissões para membros full',
    descricao: 'Membros Full deixam de seguir as regras do cargo.',
    detalhe:
      'Quem tem licença Full passa a enxergar e editar tudo, como se fosse Proprietário, mesmo que o cargo diga o contrário. Serve para destravar uma operação pequena, em que manter regra de acesso custa mais do que ajuda.',
    risco: 'Equipara o membro Full ao Proprietário. Hoje isso afeta 6 membros.',
    valor: false,
  },
  {
    chave: 'ocultar_botao_criar',
    rotulo: 'Ocultar botão de criar na tela de categorias',
    descricao: 'Tira o botão de criar item das telas de categoria.',
    detalhe:
      'Útil quando a categoria só deve receber item por automação. Ninguém cria pela tela; a criação passa a ser só por Spaceflow ou API, e quem tentar não encontra o botão.',
    valor: false,
  },
  {
    chave: 'mostrar_url_integracao',
    rotulo: 'Mostrar URL de integração',
    descricao: 'Mostra no item o endereço usado por integrações.',
    detalhe:
      'Aparece um campo a mais no topo de cada item, com o endereço que sistemas externos usam para apontar para ele. Quem integra copia dali; quem não integra vê um campo a mais.',
    valor: false,
  },
  {
    chave: 'carimbo_personalizado',
    rotulo: 'Habilitar carimbo personalizado em documentos',
    descricao: 'Cada membro ganha a própria chancela.',
    detalhe:
      'Cada pessoa passa a ter a sua chancela para assinar documentos gerados por fluxos. É o pré-requisito da Chancela de Documentos: sem isso ligado, a chancela não aparece nos documentos.',
    valor: true,
  },
]

export const modulos: Ajuste[] = [
  {
    chave: 'correcao_monetaria',
    rotulo: 'Correção Monetária',
    descricao: 'Atualiza valores de moeda por índices oficiais.',
    detalhe:
      'Corrige campos de moeda por IPCA, INPC ou IGP-M, para contratos e cobranças que precisam acompanhar o índice. Desligar não desfaz o que já foi corrigido: só interrompe novas correções.',
    valor: true,
  },
  {
    chave: 'comparacoes',
    rotulo: 'Comparações',
    descricao: 'Permite comparar dois itens lado a lado.',
    detalhe:
      'Acrescenta a ação de comparar na tela de itens da mesma categoria, com os campos alinhados um ao lado do outro.',
    valor: false,
  },
  {
    chave: 'juridico',
    rotulo: 'Jurídico',
    descricao: 'Acompanhamento processual e prazos judiciais.',
    detalhe:
      'Acrescenta campos e telas para número de processo, andamento e prazo judicial, com o prazo contado pelo calendário do workspace.',
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
 * A HIERARQUIA AQUI É A REAL, conferida em 16/09/2026 no workspace de
 * produção interna (só leitura, com autorização pontual). O que se vê lá:
 *
 *   Categoria                                    "Clients" = 710 chaves
 *   ├── Geral ............ 3 ...... Nome · Nome Singular · Descrição
 *   ├── Campos ........... 349
 *   │   └── Campo ......... Nome · Descrição · Rótulo · Ajuda ·
 *   │       │               Instrução · Placeholder
 *   │       └── Opções .... uma chave por opção da lista
 *   └── Formulários ...... 358
 *       └── Formulário .... Nome · Descrição
 *           └── Campos .... O MESMO CAMPO OUTRA VEZ, com os seis textos
 *               └── Opções     e as opções dele
 *
 * O ponto que a rodada 5 não tinha: **o campo aparece duas vezes**, na
 * definição da categoria e dentro de cada formulário que o usa. É por isso
 * que Formulários costuma ter mais chaves que Campos (358 contra 349 em
 * Clients) e que uma categoria de formulários chega a 2.440 sozinha.
 *
 * O workspace real tem 7.524 chaves em 27 categorias, com 180 traduzidas.
 * Categoria sem campo mostra só o Geral (vi uma com 3 chaves no total).
 * ------------------------------------------------------------------ */

export type TipoDeChave =
  | 'Nome'
  | 'Nome Singular'
  | 'Descrição'
  | 'Rótulo'
  | 'Ajuda'
  | 'Instrução'
  | 'Placeholder'
  | 'Opção'

export interface ChaveDeTraducao {
  id: string
  categoria: string
  grupo: 'Geral' | 'Campos' | 'Formulários'
  /** Só em Formulários: a qual formulário a chave pertence. */
  formulario?: string
  /** O campo dono da chave. Vazio no Geral e no cabeçalho do formulário. */
  dono: string
  tipo: TipoDeChave
  original: string
  traducao: string
}

type Par = [pt: string, en: string]

/**
 * As categorias, com quantos campos cada uma tem e quais formulários.
 * Os números seguem a proporção do workspace real: Formulários pesa tanto
 * quanto Campos, e uma categoria de formulários sozinha vale um terço do
 * workspace.
 */
const CATEGORIAS: { par: Par, campos: number, formularios: { nome: Par, campos: number }[] }[] = [
  { par: ['Clientes', 'Clients'], campos: 66, formularios: [{ nome: ['Cliente', 'Client'], campos: 31 }, { nome: ['Eventos', 'Events'], campos: 8 }] },
  { par: ['Impostos', 'Tax'], campos: 50, formularios: [{ nome: ['Apuração', 'Assessment'], campos: 26 }] },
  { par: ['Contabilidade', 'Bookkeeping'], campos: 39, formularios: [{ nome: ['Lançamento', 'Entry'], campos: 21 }] },
  { par: ['Desenvolvimento comercial', 'Business Development'], campos: 18, formularios: [{ nome: ['Oportunidade', 'Opportunity'], campos: 10 }] },
  { par: ['Produtos e serviços', 'Products and Services'], campos: 21, formularios: [{ nome: ['Cadastro', 'Registration'], campos: 13 }] },
  { par: ['Leads', 'Leads'], campos: 24, formularios: [{ nome: ['Entrada de lead', 'Lead intake'], campos: 16 }] },
  { par: ['Contatos', 'Contacts'], campos: 16, formularios: [{ nome: ['Contato', 'Contact'], campos: 10 }] },
  { par: ['Pedidos de venda', 'Sales Orders'], campos: 52, formularios: [{ nome: ['Pedido', 'Order'], campos: 18 }] },
  { par: ['Administrativo', 'ADM'], campos: 7, formularios: [] },
  { par: ['Parceiros', 'Partners'], campos: 0, formularios: [] },
  { par: ['Consultores', 'Consultants'], campos: 24, formularios: [{ nome: ['Consultor', 'Consultant'], campos: 13 }] },
  { par: ['Faturas', 'Invoices'], campos: 34, formularios: [{ nome: ['Fatura', 'Invoice'], campos: 16 }] },
  { par: ['Membros do cliente', 'Client members'], campos: 3, formularios: [] },
  { par: ['Atendimento', 'Customer Service'], campos: 37, formularios: [{ nome: ['Chamado', 'Ticket'], campos: 21 }] },
  { par: ['Entrega de serviço', 'Service Delivery'], campos: 26, formularios: [{ nome: ['Entrega', 'Delivery'], campos: 16 }] },
  { par: ['Orçamentos', 'Estimates'], campos: 45, formularios: [{ nome: ['Orçamento', 'Estimate'], campos: 24 }] },
  { par: ['Satisfação do cliente', 'Customer Satisfaction'], campos: 1, formularios: [] },
  { par: ['Cartas', 'Letters'], campos: 18, formularios: [{ nome: ['Carta', 'Letter'], campos: 8 }] },
  {
    par: ['Formulários de serviço', 'Service forms'],
    campos: 52,
    formularios: [
      { nome: ['Abertura de serviço', 'Service intake'], campos: 52 },
      { nome: ['Execução', 'Execution'], campos: 52 },
      { nome: ['Encerramento', 'Closing'], campos: 47 },
      { nome: ['Conferência', 'Review'], campos: 39 },
      { nome: ['Aprovação do cliente', 'Client approval'], campos: 31 },
    ],
  },
  { par: ['Tutoriais', 'Tutorials'], campos: 29, formularios: [{ nome: ['Roteiro', 'Script'], campos: 13 }] },
]

const SUBSTANTIVOS: Par[] = [
  ['Número', 'Number'], ['Valor', 'Amount'], ['Data', 'Date'], ['Responsável', 'Owner'],
  ['Situação', 'Status'], ['Observação', 'Note'], ['Anexo', 'Attachment'], ['Prazo', 'Deadline'],
  ['Tipo', 'Type'], ['Origem', 'Source'], ['Destino', 'Destination'], ['Categoria', 'Category'],
  ['Documento', 'Document'], ['Título', 'Title'], ['Descrição', 'Description'],
  ['Quantidade', 'Quantity'], ['Início', 'Start'], ['Término', 'End'],
  ['Aprovador', 'Approver'], ['Área', 'Team'], ['Motivo', 'Reason'],
  ['Referência', 'Reference'], ['Contato', 'Contact'], ['Endereço', 'Address'],
]

const QUALIFICADORES: Par[] = [
  ['', ''], ['do contrato', 'of the contract'], ['do fornecedor', 'of the supplier'],
  ['principal', 'primary'], ['secundário', 'secondary'], ['interno', 'internal'],
  ['externo', 'external'], ['de entrega', 'of delivery'], ['de análise', 'of review'],
  ['do cliente', 'of the customer'], ['da proposta', 'of the proposal'], ['de origem', 'of origin'],
]

const INSTRUCOES: Par[] = [
  ['Preencha antes de enviar para aprovação.', 'Fill this in before sending for approval.'],
  ['Aparece somente quando a situação está em análise.', 'Only shown while the status is under review.'],
  ['Somente números, sem pontuação.', 'Digits only, no punctuation.'],
  ['Deixe em branco quando não se aplicar.', 'Leave blank when it does not apply.'],
]

const PLACEHOLDERS: Par[] = [
  ['Ex.: CT-2026-0148', 'E.g.: CT-2026-0148'],
  ['Ex.: R$ 250.000,00', 'E.g.: R$ 250,000.00'],
  ['Selecione uma opção', 'Select an option'],
  ['Digite para buscar', 'Type to search'],
]

const LISTAS_DE_OPCOES: Par[][] = [
  [['Em elaboração', 'Draft'], ['Vigente', 'Active'], ['Encerrado', 'Closed']],
  [['Baixo', 'Low'], ['Médio', 'Medium'], ['Alto', 'High']],
  [['Pendente', 'Pending'], ['Aprovado', 'Approved'], ['Recusado', 'Rejected']],
]

/**
 * Quanto de cada categoria já foi traduzido. Desigual de propósito: no
 * workspace real são 180 de 7.524, com algumas categorias começadas e a
 * maioria intocada.
 */
function fracaoTraduzida(indice: number) {
  const padrao = [0.3, 0.05, 0, 0, 0.02, 0, 0, 0.6, 0, 0, 0.01, 0, 0, 0, 0, 0.1, 0, 0, 0, 0]
  return padrao[indice % padrao.length]!
}

function semAcento(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

const traducaoDoOriginal: Record<string, string> = {}

function gerarChaves(): ChaveDeTraducao[] {
  const lista: ChaveDeTraducao[] = []

  CATEGORIAS.forEach((categoria, ic) => {
    const [catPt, catEn] = categoria.par
    const base = semAcento(catPt)
    const corte = Math.round(fracaoTraduzida(ic) * 100)
    let indice = 0

    const push = (
      grupo: ChaveDeTraducao['grupo'],
      formulario: string | undefined,
      dono: string,
      tipo: TipoDeChave,
      sufixo: string,
      pt: string,
      en: string,
    ) => {
      traducaoDoOriginal[pt] = en
      const traduzida = indice % 100 < corte
      indice++
      lista.push({
        id: `${base}.${sufixo}`,
        categoria: catPt,
        grupo,
        formulario,
        dono,
        tipo,
        original: pt,
        traducao: traduzida ? en : '',
      })
    }

    /* --- Geral: três chaves, sempre --- */
    push('Geral', undefined, '', 'Nome', 'geral.nome', catPt, catEn)
    push('Geral', undefined, '', 'Nome Singular', 'geral.singular',
      catPt.replace(/s$/, ''), catEn.replace(/s$/, ''))
    push('Geral', undefined, '', 'Descrição', 'geral.descricao',
      `Registros de ${catPt.toLowerCase()} do workspace.`, `${catEn} records in this workspace.`)

    /* --- um campo, com os seis textos e as opções --- */
    const empurrarCampo = (
      grupo: ChaveDeTraducao['grupo'],
      formulario: string | undefined,
      i: number,
      prefixo: string,
    ) => {
      const [subPt, subEn] = SUBSTANTIVOS[i % SUBSTANTIVOS.length]!
      const [qualPt, qualEn] = QUALIFICADORES[Math.floor(i / SUBSTANTIVOS.length) % QUALIFICADORES.length]!
      const rotuloPt = `${subPt} ${qualPt}`.trim()
      const rotuloEn = `${subEn} ${qualEn}`.trim()
      const chave = `${prefixo}.${i}`

      push(grupo, formulario, rotuloPt, 'Nome', `${chave}.nome`, rotuloPt, rotuloEn)
      push(grupo, formulario, rotuloPt, 'Descrição', `${chave}.descricao`,
        `Guarda ${rotuloPt.toLowerCase()} do registro.`, `Holds the ${rotuloEn.toLowerCase()} of the record.`)
      push(grupo, formulario, rotuloPt, 'Rótulo', `${chave}.rotulo`, rotuloPt, rotuloEn)
      push(grupo, formulario, rotuloPt, 'Ajuda', `${chave}.ajuda`,
        `Usado para localizar o registro por ${rotuloPt.toLowerCase()}.`,
        `Used to find the record by ${rotuloEn.toLowerCase()}.`)
      const [instPt, instEn] = INSTRUCOES[i % INSTRUCOES.length]!
      push(grupo, formulario, rotuloPt, 'Instrução', `${chave}.instrucao`, instPt, instEn)
      const [phPt, phEn] = PLACEHOLDERS[i % PLACEHOLDERS.length]!
      push(grupo, formulario, rotuloPt, 'Placeholder', `${chave}.placeholder`, phPt, phEn)

      // Campo de lista também traduz cada opção.
      if (i % 3 === 0) {
        LISTAS_DE_OPCOES[i % LISTAS_DE_OPCOES.length]!.forEach(([pt, en], io) => {
          push(grupo, formulario, rotuloPt, 'Opção', `${chave}.opcao.${io}`, pt, en)
        })
      }
    }

    /* --- Campos: a definição --- */
    for (let i = 0; i < categoria.campos; i++) {
      empurrarCampo('Campos', undefined, i, 'campo')
    }

    /* --- Formulários: nome, descrição e os campos OUTRA VEZ --- */
    categoria.formularios.forEach((formulario, iform) => {
      const [formPt, formEn] = formulario.nome
      // No produto o formulário se chama só "Client", dentro de "Clients": o
      // nome da categoria não entra no nome do formulário.
      const nomeDoForm = formPt

      push('Formulários', nomeDoForm, '', 'Nome', `form.${iform}.nome`,
        nomeDoForm, `${catEn} ${formEn.toLowerCase()}`)
      push('Formulários', nomeDoForm, '', 'Descrição', `form.${iform}.descricao`,
        `O que se preenche no formulário ${formPt}, em ${catPt}.`,
        `What to fill in during ${catEn.toLowerCase()} ${formEn.toLowerCase()}.`)

      for (let i = 0; i < formulario.campos; i++) {
        empurrarCampo('Formulários', nomeDoForm, i, `form.${iform}.campo`)
      }
    })
  })

  return lista
}

export const chavesDeTraducao: ChaveDeTraducao[] = gerarChaves()

/** O tamanho do problema, que é o que esta aba precisa aguentar. */
export const totalDeChaves = chavesDeTraducao.length

/**
 * Sugestão de tradução para o inglês. Existe para o botão de IA fazer
 * alguma coisa de verdade no protótipo, e cobre todo o vocabulário gerado.
 */
export const sugestoesDeIa: Record<string, string> = traducaoDoOriginal

export const idiomas = [
  { codigo: 'en', nome: 'Inglês', bandeira: '🇺🇸' },
  { codigo: 'es', nome: 'Espanhol', bandeira: '🇪🇸' },
  { codigo: 'pt-BR', nome: 'Português (Brasil)', bandeira: '🇧🇷' },
]

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
  { id: 7, type: 'debit', amount: 32, description: 'Execução de nó de IA', data: '2026-09-12T10:31:00', origem: { recurso: 'Triagem de entrada', workspace: 'Chamados Aurora', pessoa: 'Ana Ribeiro', detalhe: '85 mil tokens' } },
  { id: 8, type: 'debit', amount: 79, description: 'Uso de agente de IA', data: '2026-09-11T17:05:00', origem: { recurso: 'Analista de duplicidade', workspace: 'Contratos Aurora', pessoa: 'Ana Ribeiro', detalhe: '239 mil tokens' } },
  { id: 9, type: 'debit', amount: 84, description: 'Uso de agente de IA', data: '2026-09-11T09:48:00', origem: { recurso: 'Analista de duplicidade', workspace: 'Contratos Aurora', pessoa: 'Ana Ribeiro', detalhe: '258 mil tokens' } },
  { id: 10, type: 'debit', amount: 8, description: 'Interação com o BENI', data: '2026-09-10T14:22:00', origem: { recurso: 'BENI', workspace: 'Contratos Aurora', pessoa: 'Bruno Sales', detalhe: 'ajuda sobre importação de feriados' } },
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

/**
 * O que gasta en-credits, segundo a documentação do produto (conferida em
 * 16/09/2026). São só três famílias, e a lista de consumo se apoia nelas:
 * sem o tipo, "Triagem de entrada" e "Analista de duplicidade" são dois
 * nomes iguais que cobram de jeitos diferentes.
 */
export type TipoDeConsumo = 'agente' | 'fluxo' | 'traducao'

export const tiposDeConsumo: Record<TipoDeConsumo, {
  rotulo: string
  icone: string
  /** Como se conta o uso deste tipo. O agente tem interação; o nó tem execução. */
  unidade: string
  unidadeSingular: string
  oQueE: string
  comoCobra: string
  doc: string
}> = {
  agente: {
    rotulo: 'Agente de IA',
    icone: 'i-lucide-bot',
    unidade: 'interações',
    unidadeSingular: 'interação',
    oQueE: 'Um agente do workspace, seu ou nativo (BENI, BENI BUILDER, REVIEWER). Responde no Chat de IA e quando um fluxo o chama.',
    comoCobra: 'Cobra a cada interação. O custo varia com o modelo de linguagem do agente e a complexidade do pedido.',
    doc: `${WS}/sections/settings/ai-agents`,
  },
  fluxo: {
    rotulo: 'Nó de IA no fluxo',
    icone: 'i-lucide-workflow',
    unidade: 'execuções',
    unidadeSingular: 'execução',
    oQueE: 'Um nó de IA dentro de um Spaceflow. Criar fluxo e rodar fluxo não custam nada: só o nó de IA custa.',
    comoCobra: 'Cobra a cada execução do nó, conforme o volume de dados processados e o tipo de operação.',
    doc: `${WS}/sections/settings/structure/spaceflow/nodes`,
  },
  traducao: {
    rotulo: 'Tradução por IA',
    icone: 'i-lucide-languages',
    unidade: 'chaves',
    unidadeSingular: 'chave',
    oQueE: 'A tradução automática dos dicionários, na aba Dicionários desta mesma tela.',
    comoCobra: 'Cobra por chave traduzida. Termo técnico e nome próprio do negócio pedem revisão depois.',
    doc: `${DOCS}/dictionaries`,
  },
}

/**
 * No que os créditos foram, nos últimos 30 dias.
 *
 * A soma bate com o total dos 30 dias da carteira (2.747), de propósito: a
 * seção promete dizer "onde mexer para gastar menos", e número que não fecha
 * com o de cima derruba a promessa.
 */
export const consumoPorRecurso: {
  recurso: string
  tipo: TipoDeConsumo
  /** Onde aquilo rodou. É a pergunta que o nome do recurso não responde. */
  onde: string
  credits: number
  usos: number
}[] = [
  { recurso: 'Analista de duplicidade', tipo: 'agente', onde: 'Chat de IA e fluxo de contratos', credits: 1840, usos: 26 },
  { recurso: 'Triagem de entrada', tipo: 'fluxo', onde: 'Spaceflow "Entrada de chamados"', credits: 412, usos: 14 },
  { recurso: 'Dicionário de Clientes', tipo: 'traducao', onde: 'Aba Dicionários, para inglês', credits: 231, usos: 629 },
  { recurso: 'REVIEWER', tipo: 'agente', onde: 'Chat de IA, revisão de texto', credits: 160, usos: 9 },
  { recurso: 'BENI', tipo: 'agente', onde: 'Chat de IA, ajuda sobre o produto', credits: 104, usos: 13 },
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
    'Ações sem IA (criar item, rodar fluxo, enviar e-mail) não consomem en-credits.',
  ],
}
