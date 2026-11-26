/**
 * Rodada 8: Discussões no projeto, Marco no projeto e Meta no workspace.
 *
 * Base: a pesquisa "Marcos, Stacks e Discussions nos Projetos" (pesquisa-de-mercado, 2026-11-26).
 * - Discussão: o GitHub Discussions dentro do projeto, sobre a tabela `threads` que o back já tem
 *   (`en-communications`, `type: discussion`). Formatos Discussão, Pergunta e Anúncio. Por ora só no
 *   projeto (pedido da redatora).
 * - Marco: entrega com data-alvo dentro do projeto; o progresso sai das tarefas do marco. Entra como
 *   base da Meta, sem tela própria.
 * - Meta (ou iniciativa): mora no workspace, acima dos projetos, e liga projetos e marcos de vários
 *   projetos. O progresso soma marcos e projetos, nunca item a item.
 *
 * Tudo inventado: nenhuma dessas entidades existe no código lido em 2026-11-26. Valores fictícios.
 */
import type { Situacao } from './mocks'
import { useProjetos } from './estado'

/* ------------------------------------------------------------------ */
/* Discussões                                                           */
/* ------------------------------------------------------------------ */

/** O `type` da thread é `discussion`; o formato é campo novo. */
export type FormatoDaDiscussao = 'discussao' | 'pergunta' | 'anuncio'
export type AvisoDoAnuncio = 'todos' | 'admins' | 'ninguem'

export interface Mensagem {
  id: number
  autor: number
  /** ISO, com hora. */
  em: string
  texto: string
  /** A tarefa criada a partir da mensagem (a ponte discussão → trabalho). */
  tarefa?: number
}

export interface Discussao {
  id: number
  projeto: number
  formato: FormatoDaDiscussao
  titulo: string
  /** Do `threads`: `status` (open, closed). */
  status: 'aberta' | 'fechada'
  fixada: boolean
  /** Pergunta: a mensagem marcada como resposta. */
  resposta?: number
  /** A 1ª mensagem é o corpo da discussão. */
  mensagens: Mensagem[]
}

export const discussoesBase: Discussao[] = [
  {
    id: 1,
    projeto: 1,
    formato: 'anuncio',
    titulo: 'Fechamento de dezembro começa no dia 26',
    status: 'aberta',
    fixada: true,
    mensagens: [
      { id: 11, autor: 3, em: '2026-11-25T09:10', texto: 'A partir de 26/12, as contas a pagar de dezembro só entram com aprovação da coordenação. Notas da filial Joinville até 22/12.' },
      { id: 12, autor: 5, em: '2026-11-25T10:02', texto: 'Os reembolsos seguem a mesma data?' },
      { id: 13, autor: 3, em: '2026-11-25T10:20', texto: 'Seguem. Reembolso depois de 26/12 entra no fechamento de janeiro.' },
    ],
  },
  {
    id: 2,
    projeto: 1,
    formato: 'pergunta',
    titulo: 'Reembolso de quilometragem entra em Reembolsos ou em Contas a pagar?',
    status: 'aberta',
    fixada: false,
    resposta: 22,
    mensagens: [
      { id: 21, autor: 5, em: '2026-11-21T14:30', texto: 'Recebi 3 pedidos de quilometragem da equipe comercial. Em qual categoria devo registrar?' },
      { id: 22, autor: 3, em: '2026-11-21T15:05', texto: 'Em Reembolsos, com o tipo Quilometragem. Contas a pagar fica só para fornecedor.' },
      { id: 23, autor: 2, em: '2026-11-21T15:40', texto: 'Vale também para pedágio.' },
    ],
  },
  {
    id: 3,
    projeto: 1,
    formato: 'discussao',
    titulo: 'Aprovar pagamentos até R$ 500 sem a segunda assinatura',
    status: 'aberta',
    fixada: false,
    mensagens: [
      { id: 31, autor: 2, em: '2026-11-24T11:00', texto: 'Proposta: pagamento até R$ 500 passa só pela aprovação da coordenação. Hoje 40% das aprovações são abaixo desse valor.' },
      { id: 32, autor: 3, em: '2026-11-24T11:45', texto: 'Concordo, com relatório mensal dos pagamentos que pularam a segunda assinatura.' },
      { id: 33, autor: 5, em: '2026-11-24T13:10', texto: 'Preciso ajustar o fluxo de aprovação de pagamento para essa regra.', tarefa: 112 },
    ],
  },
  {
    id: 4,
    projeto: 1,
    formato: 'pergunta',
    titulo: 'Nota fiscal com CFOP errado volta para o fornecedor?',
    status: 'fechada',
    fixada: false,
    mensagens: [
      { id: 41, autor: 5, em: '2026-11-12T09:00', texto: 'A nota NF4188 chegou com CFOP de venda. Devolvo ou corrijo com carta de correção?' },
    ],
  },
  {
    id: 5,
    projeto: 4,
    formato: 'discussao',
    titulo: 'Plano para a infiltração do bloco B',
    status: 'aberta',
    fixada: false,
    mensagens: [
      { id: 51, autor: 9, em: '2026-11-20T08:30', texto: 'A impermeabilização do bloco B falhou no teste. Proponho refazer a manta antes da medição de novembro.' },
      { id: 52, autor: 2, em: '2026-11-20T09:15', texto: 'Refazer antes atrasa a medição em 5 dias. Dá para medir o bloco A primeiro.' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Marcos                                                               */
/* ------------------------------------------------------------------ */

export interface Marco {
  id: number
  projeto: number
  nome: string
  dataAlvo: string
  /** As tarefas do marco. O progresso é a parte concluída delas. */
  tarefas: number[]
}

export const marcosBase: Marco[] = [
  { id: 1, projeto: 1, nome: 'Fechamento de novembro', dataAlvo: '2026-12-05', tarefas: [101, 102, 104, 105, 112] },
  { id: 2, projeto: 1, nome: 'Notas de outubro conferidas', dataAlvo: '2026-11-30', tarefas: [106, 107, 108] },
  { id: 3, projeto: 2, nome: 'Audiências de dezembro', dataAlvo: '2026-12-10', tarefas: [201, 203, 204] },
  { id: 4, projeto: 3, nome: 'Proposta do cliente Atlas', dataAlvo: '2026-12-01', tarefas: [301, 302] },
  { id: 5, projeto: 4, nome: 'Entrega do bloco B', dataAlvo: '2026-12-20', tarefas: [401, 402, 403] },
]

/* ------------------------------------------------------------------ */
/* Metas                                                                */
/* ------------------------------------------------------------------ */

export interface AtualizacaoDaMeta {
  situacao: Situacao
  texto: string
  autor: number
  em: string
}

export interface Meta {
  id: number
  nome: string
  descricao: string
  dono: number
  dataAlvo: string
  projetos: number[]
  marcos: number[]
  /** Da mais nova para a mais antiga. A situação da meta é a da última. */
  atualizacoes: AtualizacaoDaMeta[]
}

export const metasBase: Meta[] = [
  {
    id: 1,
    nome: 'Fechar 2026 sem pendência fiscal',
    descricao: 'Notas, contas e processos fiscais em dia até o balanço anual.',
    dono: 1,
    dataAlvo: '2026-12-31',
    projetos: [1, 2],
    marcos: [1, 2, 3],
    atualizacoes: [
      { situacao: 'emRisco', texto: 'As notas de outubro atrasaram. O fechamento de novembro segue no prazo.', autor: 1, em: '2026-11-24' },
      { situacao: 'noPrazo', texto: 'Plano aprovado com o Financeiro e o Jurídico.', autor: 1, em: '2026-11-03' },
    ],
  },
  {
    id: 2,
    nome: 'Crescer 20% a carteira de obras',
    descricao: 'Novos contratos de obra no Sul, com entrega das obras em andamento sem atraso.',
    dono: 3,
    dataAlvo: '2027-03-31',
    projetos: [3, 4],
    marcos: [4, 5],
    atualizacoes: [
      { situacao: 'noPrazo', texto: '2 propostas em negociação e o bloco B dentro do cronograma.', autor: 3, em: '2026-11-20' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Estado                                                               */
/* ------------------------------------------------------------------ */

let proxima = 1000
const agora = () => '2026-11-26T' + new Date().toTimeString().slice(0, 5)

export function useMetasEDiscussoes() {
  const prj = useProjetos()
  const discussoes = useState<Discussao[]>('prj-discussoes', () => structuredClone(discussoesBase))
  const marcos = useState<Marco[]>('prj-marcos', () => structuredClone(marcosBase))
  const metas = useState<Meta[]>('prj-metas', () => structuredClone(metasBase))
  /** A discussão aberta na aba e a meta aberta na tela Metas. */
  const discussaoAberta = useState<number | null>('prj-discussao', () => null)
  const metaAberta = useState<number | null>('prj-meta', () => null)

  /* ---------- discussões ---------- */
  const discussoesDo = (projeto: number) => discussoes.value.filter(d => d.projeto === projeto)
  /** Anúncio só o administrador do projeto abre; todos comentam. */
  function podeAbrir(projeto: number, formato: FormatoDaDiscussao) {
    const p = prj.projetos.value.find(x => x.id === projeto)
    if (!p || !prj.entra(p)) return false
    return formato !== 'anuncio' || prj.podeAdministrar(p)
  }
  function podeModerar(d: Discussao) {
    const p = prj.projetos.value.find(x => x.id === d.projeto)
    return !!p && (prj.podeAdministrar(p) || d.mensagens[0]?.autor === prj.eu.value)
  }
  function criarDiscussao(dados: { projeto: number, formato: FormatoDaDiscussao, titulo: string, texto: string }) {
    const d: Discussao = {
      id: ++proxima,
      projeto: dados.projeto,
      formato: dados.formato,
      titulo: dados.titulo,
      status: 'aberta',
      fixada: dados.formato === 'anuncio',
      mensagens: [{ id: ++proxima, autor: prj.eu.value, em: agora(), texto: dados.texto }],
    }
    discussoes.value = [d, ...discussoes.value]
    return d
  }
  function responder(d: Discussao, texto: string) {
    d.mensagens.push({ id: ++proxima, autor: prj.eu.value, em: agora(), texto })
  }
  function criarTarefaDaMensagem(m: Mensagem, dados: { titulo: string, categoria: number, responsavel: number, prazo: string }) {
    prj.criarTarefa({ ...dados, item: '', prioridade: 'media' })
    m.tarefa = prj.tarefas.value[0]!.id
  }

  /* ---------- marcos ---------- */
  const marcosDo = (projeto: number) => marcos.value.filter(m => m.projeto === projeto).sort((a, b) => a.dataAlvo.localeCompare(b.dataAlvo))
  function progressoDoMarco(m: Marco) {
    const ts = prj.tarefas.value.filter(x => m.tarefas.includes(x.id))
    if (!ts.length) return 0
    return Math.round(ts.filter(x => x.status === 'concluida').length / ts.length * 100)
  }
  const tarefasDoMarco = (m: Marco) => prj.tarefas.value.filter(x => m.tarefas.includes(x.id))

  /* ---------- metas ---------- */
  function progressoDoProjeto(projeto: number) {
    const ts = prj.tarefasDoProjeto(projeto)
    if (!ts.length) return 0
    return Math.round(ts.filter(x => x.status === 'concluida').length / ts.length * 100)
  }
  /** A média dos marcos e dos projetos ligados: a meta nunca conta item a item. */
  function progressoDaMeta(meta: Meta) {
    const partes = [...meta.marcos.map(id => marcos.value.find(m => m.id === id)).filter(m => !!m).map(m => progressoDoMarco(m!)), ...meta.projetos.map(progressoDoProjeto)]
    if (!partes.length) return 0
    return Math.round(partes.reduce((a, b) => a + b, 0) / partes.length)
  }
  const situacaoDaMeta = (meta: Meta): Situacao | null => meta.atualizacoes[0]?.situacao ?? null
  const metasDoProjeto = (projeto: number) => metas.value.filter(m => m.projetos.includes(projeto) || m.marcos.some(id => marcos.value.find(x => x.id === id)?.projeto === projeto))
  const metasDoMarco = (marco: number) => metas.value.filter(m => m.marcos.includes(marco))
  /** O projeto que a pessoa não vê aparece sem nome na meta. */
  const veProjeto = (projeto: number) => {
    const p = prj.projetos.value.find(x => x.id === projeto)
    return !!p && prj.enxerga(p)
  }
  function criarMeta(dados: Omit<Meta, 'id' | 'atualizacoes'>) {
    const m: Meta = { ...dados, id: ++proxima, atualizacoes: [] }
    metas.value = [...metas.value, m]
    return m
  }
  function publicarAtualizacao(meta: Meta, situacao: Situacao, texto: string) {
    meta.atualizacoes.unshift({ situacao, texto, autor: prj.eu.value, em: '2026-11-26' })
  }
  function abrirMeta(id: number | null) {
    metaAberta.value = id
    prj.tela.value = { tipo: 'metas' }
  }

  return {
    discussoes, discussaoAberta, discussoesDo, podeAbrir, podeModerar, criarDiscussao, responder, criarTarefaDaMensagem,
    marcos, marcosDo, progressoDoMarco, tarefasDoMarco,
    metas, metaAberta, progressoDoProjeto, progressoDaMeta, situacaoDaMeta, metasDoProjeto, metasDoMarco, veProjeto, criarMeta, publicarAtualizacao, abrirMeta,
  }
}
