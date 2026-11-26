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
  descricao: string
  /** Rodada 9: quem responde pelo marco. */
  responsavel: number
  dataAlvo: string
  /**
   * Rodada 9: o marco se conclui à mão. Ao concluir, as tarefas ainda abertas saem do marco e continuam no
   * projeto; o marco concluído fica com 100%.
   */
  status: 'aberto' | 'concluido'
  /** As tarefas do marco (cada tarefa fica em 1 marco só). O progresso é a parte concluída delas. */
  tarefas: number[]
}

export const marcosBase: Marco[] = [
  { id: 1, projeto: 1, nome: 'Fechamento de novembro', descricao: 'Contas, notas e reembolsos de novembro conferidos e pagos.', responsavel: 2, dataAlvo: '2026-12-05', status: 'aberto', tarefas: [101, 102, 104, 105, 112] },
  { id: 2, projeto: 1, nome: 'Notas de outubro conferidas', descricao: 'Todas as notas de entrada de outubro lançadas e conferidas.', responsavel: 4, dataAlvo: '2026-11-30', status: 'aberto', tarefas: [106, 107, 108] },
  { id: 3, projeto: 2, nome: 'Audiências de dezembro', descricao: 'Peças protocoladas e prepostos definidos.', responsavel: 5, dataAlvo: '2026-12-10', status: 'aberto', tarefas: [201, 203, 204] },
  { id: 4, projeto: 3, nome: 'Proposta do cliente Atlas', descricao: 'Proposta comercial enviada e negociada.', responsavel: 3, dataAlvo: '2026-12-01', status: 'aberto', tarefas: [301, 302] },
  { id: 5, projeto: 4, nome: 'Entrega do bloco B', descricao: 'Bloco B vistoriado e entregue ao cliente.', responsavel: 3, dataAlvo: '2026-12-20', status: 'aberto', tarefas: [401, 402, 403] },
]

/* ------------------------------------------------------------------ */
/* Metas                                                                */
/* ------------------------------------------------------------------ */

export interface AtualizacaoDaMeta {
  situacao: Situacao
  texto: string
  autor: number
  em: string
  /** Rodada 9: na meta medida por valor, o valor informado nesta atualização. */
  valor?: number
}

/**
 * Rodada 9: como a meta mede o progresso.
 *  - automatica: a média dos marcos que contam. Conta cada marco ligado e todos os marcos dos projetos ligados;
 *    o marco avança quando as tarefas dele são concluídas. Ninguém digita porcentagem;
 *  - valor: um número com início e alvo (receita, contratos, %). O dono informa o valor atual ao publicar a
 *    atualização. Projetos e marcos ficam ligados para acompanhar e não entram na conta.
 */
export type Medicao = 'automatica' | 'valor'
export type Unidade = 'percentual' | 'reais' | 'numero'

export interface Meta {
  id: number
  nome: string
  descricao: string
  dono: number
  dataAlvo: string
  medicao: Medicao
  /** Só na medição por valor. O valor atual é o da última atualização que trouxe valor. */
  valor?: { inicial: number, alvo: number, unidade: Unidade }
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
    medicao: 'automatica',
    projetos: [1],
    marcos: [3],
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
    medicao: 'valor',
    valor: { inicial: 0, alvo: 20, unidade: 'percentual' },
    projetos: [3, 4],
    marcos: [],
    atualizacoes: [
      { situacao: 'noPrazo', texto: '2 propostas em negociação e o bloco B dentro do cronograma.', autor: 3, em: '2026-11-20', valor: 6 },
      { situacao: 'noPrazo', texto: 'Primeiro contrato assinado.', autor: 3, em: '2026-10-15', valor: 2 },
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
  /** A discussão aberta na aba, a meta aberta na tela Metas e o marco aberto na aba Marcos. */
  const discussaoAberta = useState<number | null>('prj-discussao', () => null)
  const metaAberta = useState<number | null>('prj-meta', () => null)
  const marcoAberto = useState<number | null>('prj-marco', () => null)

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
  const tarefasDoMarco = (m: Marco) => prj.tarefas.value.filter(x => m.tarefas.includes(x.id))
  /** A parte concluída das tarefas do marco. Marco concluído fica com 100%; marco sem tarefa, com 0%. */
  function progressoDoMarco(m: Marco) {
    if (m.status === 'concluido') return 100
    const ts = tarefasDoMarco(m)
    if (!ts.length) return 0
    return Math.round(ts.filter(x => x.status === 'concluida').length / ts.length * 100)
  }
  const marcoDaTarefa = (tarefa: number) => marcos.value.find(m => m.tarefas.includes(tarefa)) ?? null
  /** Cria, edita, conclui e exclui marco quem administra o projeto. */
  function podeEditarMarcos(projeto: number) {
    const p = prj.projetos.value.find(x => x.id === projeto)
    return !!p && prj.podeAdministrar(p)
  }
  /** A tarefa fica em 1 marco só: ligar a um marco tira do outro. */
  function ligarTarefas(m: Marco, ids: number[]) {
    for (const outro of marcos.value) if (outro.id !== m.id) outro.tarefas = outro.tarefas.filter(id => !ids.includes(id))
    m.tarefas = [...new Set([...m.tarefas, ...ids])]
  }
  function tirarTarefa(m: Marco, id: number) {
    m.tarefas = m.tarefas.filter(x => x !== id)
  }
  function definirMarcoDaTarefa(tarefa: number, marco: number | null) {
    for (const m of marcos.value) m.tarefas = m.tarefas.filter(id => id !== tarefa)
    const m = marcos.value.find(x => x.id === marco)
    if (m) m.tarefas = [...m.tarefas, tarefa]
  }
  function salvarMarco(dados: Omit<Marco, 'id' | 'status'> & { id?: number }) {
    let m = marcos.value.find(x => x.id === dados.id)
    if (m) {
      Object.assign(m, { nome: dados.nome, descricao: dados.descricao, responsavel: dados.responsavel, dataAlvo: dados.dataAlvo })
      m.tarefas = m.tarefas.filter(id => dados.tarefas.includes(id))
    }
    else {
      marcos.value = [...marcos.value, { ...dados, id: ++proxima, status: 'aberto', tarefas: [] }]
      m = marcos.value.at(-1)!
    }
    ligarTarefas(m, dados.tarefas)
    return m
  }
  /** Concluir tira do marco as tarefas abertas; elas continuam no projeto. Devolve quantas saíram. */
  function concluirMarco(m: Marco) {
    const abertas = tarefasDoMarco(m).filter(x => x.status !== 'concluida').map(x => x.id)
    m.tarefas = m.tarefas.filter(id => !abertas.includes(id))
    m.status = 'concluido'
    return abertas.length
  }
  function reabrirMarco(m: Marco) {
    m.status = 'aberto'
  }
  /** Excluir o marco: as tarefas continuam no projeto, e as metas deixam de contar o marco. */
  function excluirMarco(m: Marco) {
    for (const g of metas.value) g.marcos = g.marcos.filter(id => id !== m.id)
    marcos.value = marcos.value.filter(x => x.id !== m.id)
    if (marcoAberto.value === m.id) marcoAberto.value = null
  }
  function abrirMarco(m: Marco) {
    marcoAberto.value = m.id
    prj.abrirAba(m.projeto, 'marcos')
  }

  /* ---------- metas ---------- */
  /** Os marcos que contam na meta automática: os ligados e todos os dos projetos ligados, sem repetir. */
  function marcosQueContam(meta: Meta) {
    const ids = new Set([...meta.marcos, ...marcos.value.filter(m => meta.projetos.includes(m.projeto)).map(m => m.id)])
    return marcos.value.filter(m => ids.has(m.id))
  }
  /** O projeto, na meta, vale a média dos marcos dele. Projeto sem marco não entra na conta (null). */
  function progressoDoProjeto(projeto: number) {
    const ms = marcosDo(projeto)
    if (!ms.length) return null
    return Math.round(ms.reduce((a, m) => a + progressoDoMarco(m), 0) / ms.length)
  }
  const valorAtual = (meta: Meta) => meta.atualizacoes.find(a => a.valor !== undefined)?.valor ?? meta.valor?.inicial ?? 0
  function progressoDaMeta(meta: Meta) {
    if (meta.medicao === 'valor' && meta.valor) {
      const { inicial, alvo } = meta.valor
      if (alvo === inicial) return 0
      return Math.max(0, Math.min(100, Math.round((valorAtual(meta) - inicial) / (alvo - inicial) * 100)))
    }
    const ms = marcosQueContam(meta)
    if (!ms.length) return 0
    return Math.round(ms.reduce((a, m) => a + progressoDoMarco(m), 0) / ms.length)
  }
  const situacaoDaMeta = (meta: Meta): Situacao | null => meta.atualizacoes[0]?.situacao ?? null
  const metasDoProjeto = (projeto: number) => metas.value.filter(m => m.projetos.includes(projeto) || m.marcos.some(id => marcos.value.find(x => x.id === id)?.projeto === projeto))
  /** As metas para as quais o marco conta: ligado direto ou pelo projeto, só nas metas automáticas. */
  const metasDoMarco = (marco: number) => {
    const m = marcos.value.find(x => x.id === marco)
    return metas.value.filter(g => g.medicao === 'automatica' && (g.marcos.includes(marco) || (!!m && g.projetos.includes(m.projeto))))
  }
  /** O projeto que a pessoa não vê aparece sem nome na meta. */
  const veProjeto = (projeto: number) => {
    const p = prj.projetos.value.find(x => x.id === projeto)
    return !!p && prj.enxerga(p)
  }
  const podeEditarMeta = (meta: Meta) => prj.souDono.value || meta.dono === prj.eu.value
  function salvarMeta(dados: Omit<Meta, 'id' | 'atualizacoes'> & { id?: number }) {
    const m = metas.value.find(x => x.id === dados.id)
    if (m) {
      Object.assign(m, { ...dados, id: m.id })
      return m
    }
    metas.value = [...metas.value, { ...dados, id: ++proxima, atualizacoes: [] }]
    return metas.value.at(-1)!
  }
  function excluirMeta(meta: Meta) {
    metas.value = metas.value.filter(m => m.id !== meta.id)
    if (metaAberta.value === meta.id) metaAberta.value = null
  }
  function publicarAtualizacao(meta: Meta, situacao: Situacao, texto: string, valor?: number) {
    meta.atualizacoes.unshift({ situacao, texto, autor: prj.eu.value, em: '2026-11-26', ...(valor !== undefined ? { valor } : {}) })
  }
  function abrirMeta(id: number | null) {
    metaAberta.value = id
    prj.tela.value = { tipo: 'metas' }
  }

  return {
    discussoes, discussaoAberta, discussoesDo, podeAbrir, podeModerar, criarDiscussao, responder, criarTarefaDaMensagem,
    marcos, marcoAberto, marcosDo, progressoDoMarco, tarefasDoMarco, marcoDaTarefa, podeEditarMarcos, ligarTarefas, tirarTarefa,
    definirMarcoDaTarefa, salvarMarco, concluirMarco, reabrirMarco, excluirMarco, abrirMarco,
    metas, metaAberta, marcosQueContam, progressoDoProjeto, valorAtual, progressoDaMeta, situacaoDaMeta, metasDoProjeto, metasDoMarco,
    veProjeto, podeEditarMeta, salvarMeta, excluirMeta, publicarAtualizacao, abrirMeta,
  }
}
