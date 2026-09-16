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
  /** O produto chama de "Tipo de Logo": escolhe entre um ícone e uma imagem. */
  tipoDeMarca: 'icone' | 'imagem'
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
 * A estrutura é a do `DictionaryKeysTree`: cada categoria tem Geral
 * (name, singularName, description), Campos (label, description, help,
 * instruction, placeholder, e um por opção de lista) e Formulários.
 *
 * ESTE MOCK GERA O TAMANHO REAL DO PROBLEMA: um workspace configurado
 * chega a 14 mil chaves, e foi esse número que derrubou o desenho da
 * rodada 1. Por isso as chaves são compostas por fórmula a partir de um
 * vocabulário controlado, e não escritas uma a uma: o que importa aqui é
 * o volume e a distribuição, não a variedade de cada frase.
 *
 * Como o vocabulário tem o par português/inglês, toda chave tem uma
 * tradução correta disponível, e o botão de IA do protótipo funciona de
 * verdade em cima do mock.
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
  /** O que já está traduzido. Vazio quer dizer que falta. */
  traducao: string
}

type Par = [pt: string, en: string]

/** As categorias do workspace, com quantos campos cada uma tem. */
const CATEGORIAS: { par: Par, campos: number }[] = [
  { par: ['Contratos', 'Contracts'], campos: 470 },
  { par: ['Fornecedores', 'Suppliers'], campos: 290 },
  { par: ['Chamados jurídicos', 'Legal requests'], campos: 200 },
  { par: ['Processos', 'Lawsuits'], campos: 420 },
  { par: ['Notas fiscais', 'Invoices'], campos: 270 },
  { par: ['Pagamentos', 'Payments'], campos: 335 },
  { par: ['Colaboradores', 'Employees'], campos: 380 },
  { par: ['Treinamentos', 'Trainings'], campos: 165 },
  { par: ['Ativos', 'Assets'], campos: 310 },
  { par: ['Imóveis', 'Properties'], campos: 210 },
  { par: ['Frota', 'Fleet'], campos: 235 },
  { par: ['Auditorias', 'Audits'], campos: 255 },
  { par: ['Políticas internas', 'Internal policies'], campos: 135 },
  { par: ['Incidentes', 'Incidents'], campos: 290 },
  { par: ['Clientes', 'Customers'], campos: 445 },
  { par: ['Propostas', 'Proposals'], campos: 355 },
  { par: ['Licenças', 'Licenses'], campos: 155 },
  { par: ['Obras', 'Construction'], campos: 220 },
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

const EXEMPLOS: Par[] = [
  ['Ex.: CT-2026-0148', 'E.g.: CT-2026-0148'],
  ['Ex.: R$ 250.000,00', 'E.g.: R$ 250,000.00'],
  ['Ex.: 30/09/2026', 'E.g.: 09/30/2026'],
  ['Ex.: Aurora Serviços Integrados Ltda.', 'E.g.: Aurora Integrated Services Ltd.'],
]

const LISTAS_DE_OPCOES: Par[][] = [
  [['Em elaboração', 'Draft'], ['Vigente', 'Active'], ['Encerrado', 'Closed']],
  [['Baixo', 'Low'], ['Médio', 'Medium'], ['Alto', 'High']],
  [['Pendente', 'Pending'], ['Aprovado', 'Approved'], ['Recusado', 'Rejected']],
]

const FORMULARIOS: Par[] = [
  ['Abertura', 'Intake'], ['Revisão', 'Review'], ['Encerramento', 'Closing'],
]

/**
 * Quanto de cada categoria já foi traduzido. Distribuição desigual de
 * propósito: é assim que um workspace real fica, e é o que faz a visão
 * geral valer a pena (algumas prontas, uma começada, muitas intocadas).
 */
function fracaoTraduzida(indice: number) {
  const padrao = [1, 0.7, 0.25, 0, 0, 0.4, 0, 0.1, 1, 0]
  return padrao[indice % padrao.length]!
}

function semAcento(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

/** Par português/inglês de toda chave gerada, para a sugestão de IA. */
const traducaoDoOriginal: Record<string, string> = {}

function gerarChaves(): ChaveDeTraducao[] {
  const lista: ChaveDeTraducao[] = []

  CATEGORIAS.forEach((categoria, ic) => {
    const [catPt, catEn] = categoria.par
    const base = semAcento(catPt)
    const corte = Math.round(fracaoTraduzida(ic) * 100)
    let indiceNaCategoria = 0

    const push = (
      grupo: ChaveDeTraducao['grupo'],
      dono: string,
      tipo: TipoDeChave,
      sufixo: string,
      pt: string,
      en: string,
    ) => {
      traducaoDoOriginal[pt] = en
      // A fração vira um corte determinístico: dentro de cada bloco de cem
      // chaves da categoria, as primeiras N já estão traduzidas.
      const traduzida = indiceNaCategoria % 100 < corte
      indiceNaCategoria++
      lista.push({
        id: `${base}.${sufixo}`,
        categoria: catPt,
        grupo,
        dono,
        tipo,
        original: pt,
        traducao: traduzida ? en : '',
      })
    }

    push('Geral', '', 'Nome', 'geral.nome', catPt, catEn)
    push('Geral', '', 'Nome no singular', 'geral.singular', catPt.replace(/s$/, ''), catEn.replace(/s$/, ''))
    push('Geral', '', 'Descrição', 'geral.descricao',
      `Registros de ${catPt.toLowerCase()} do workspace.`, `${catEn} records in this workspace.`)

    for (let i = 0; i < categoria.campos; i++) {
      const [subPt, subEn] = SUBSTANTIVOS[i % SUBSTANTIVOS.length]!
      const [qualPt, qualEn] = QUALIFICADORES[Math.floor(i / SUBSTANTIVOS.length) % QUALIFICADORES.length]!
      const rotuloPt = `${subPt} ${qualPt}`.trim()
      const rotuloEn = `${subEn} ${qualEn}`.trim()
      const campo = `campo.${i}`

      push('Campos', rotuloPt, 'Rótulo', `${campo}.label`, rotuloPt, rotuloEn)

      if (i % 2 === 0) {
        push('Campos', rotuloPt, 'Texto de ajuda', `${campo}.ajuda`,
          `Usado para localizar o registro por ${rotuloPt.toLowerCase()}.`,
          `Used to find the record by ${rotuloEn.toLowerCase()}.`)
      }
      if (i % 3 === 0) {
        const [pt, en] = INSTRUCOES[i % INSTRUCOES.length]!
        push('Campos', rotuloPt, 'Instrução', `${campo}.instrucao`, pt, en)
      }
      if (i % 4 === 0) {
        const [pt, en] = EXEMPLOS[i % EXEMPLOS.length]!
        push('Campos', rotuloPt, 'Texto de exemplo', `${campo}.exemplo`, pt, en)
      }
      if (i % 5 === 0) {
        LISTAS_DE_OPCOES[i % LISTAS_DE_OPCOES.length]!.forEach(([pt, en], io) => {
          push('Campos', rotuloPt, 'Opção', `${campo}.opcao.${io}`, pt, en)
        })
      }
    }

    FORMULARIOS.forEach(([formPt, formEn], i) => {
      const nome = `${formPt} de ${catPt.toLowerCase()}`
      push('Formulários', nome, 'Nome', `formulario.${i}.nome`, nome, `${catEn} ${formEn.toLowerCase()}`)
      push('Formulários', nome, 'Descrição', `formulario.${i}.descricao`,
        `O que se preenche na ${formPt.toLowerCase()} de ${catPt.toLowerCase()}.`,
        `What to fill in during ${catEn.toLowerCase()} ${formEn.toLowerCase()}.`)
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
    'Ações sem IA (criar item, rodar fluxo, enviar e-mail) não consomem en-credits.',
  ],
}
