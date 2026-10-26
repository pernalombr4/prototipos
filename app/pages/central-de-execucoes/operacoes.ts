/**
 * PROPOSTA: a operação, um grupo de fluxos com nome, dono e uma regra. Hoje não existe.
 *
 * A regra é lógica e lê só a configuração de cada fluxo, nada de execução e nada de IA:
 * - as categorias da operação;
 * - um fluxo entra quando o gatilho dele é um evento de uma dessas categorias, e/ou quando um nó
 *   dele cria, edita ou exclui item de uma dessas categorias;
 * - "Sempre incluir" e "Nunca incluir" resolvem o que a regra não alcança: o fluxo agendado que
 *   não grava item, o fluxo que grava numa categoria de outra área.
 *
 * O resultado é o mesmo toda vez que a configuração é a mesma. Um fluxo pode estar em 2 operações
 * ou em nenhuma. O backend precisa expor o gatilho e as categorias que os nós gravam (pergunta P9)
 * e guardar a operação (pergunta P12).
 *
 * Tudo em memória: criar, editar e excluir mexem nesta lista; "Reiniciar" e o reload voltam ao
 * começo.
 */
import { ref } from 'vue'
import type { CategoriaId, Evento, Fluxo } from './mocks'

export interface RegraDaOperacao {
  categorias: CategoriaId[]
  peloGatilho: boolean
  pelaGravacao: boolean
  /** Ids de fluxo que entram mesmo fora da regra. */
  incluir: number[]
  /** Ids de fluxo que ficam fora mesmo dentro da regra. Vence o "incluir". */
  excluir: number[]
}

export interface Operacao {
  id: string
  nome: string
  descricao: string
  dono: string
  regra: RegraDaOperacao
}

const iniciais: Operacao[] = [
  {
    id: 'contratos', nome: 'Gestão de contratos', dono: 'Ana Souza',
    descricao: 'Do contrato criado ao encerramento: andamentos, minuta, assinatura, aditivos e pagamentos.',
    regra: { categorias: ['contratos', 'andamentos', 'documentos', 'aditivos', 'pagamentos'], peloGatilho: true, pelaGravacao: true, incluir: [524], excluir: [] },
  },
  {
    id: 'compras', nome: 'Compras', dono: 'Diego Rocha',
    descricao: 'Pedido, cotação com fornecedores, aprovação e nota fiscal.',
    regra: { categorias: ['pedidos', 'cotacoes', 'notas'], peloGatilho: true, pelaGravacao: true, incluir: [538], excluir: [] },
  },
  {
    id: 'atendimento', nome: 'Atendimento ao cliente', dono: 'Carla Mendes',
    descricao: 'Chamados abertos por e-mail, triagem, resposta e pesquisa de satisfação.',
    regra: { categorias: ['chamados', 'interacoes'], peloGatilho: true, pelaGravacao: true, incluir: [], excluir: [] },
  },
  {
    id: 'admissao', nome: 'Admissão de pessoas', dono: 'Elisa Prado',
    descricao: 'Documentos, conferência e acessos de quem entra na empresa.',
    regra: { categorias: ['admissoes', 'docPessoais', 'acessos'], peloGatilho: true, pelaGravacao: true, incluir: [556], excluir: [] },
  },
]

const copiar = (ops: Operacao[]): Operacao[] => ops.map(o => ({ ...o, regra: { ...o.regra, categorias: [...o.regra.categorias], incluir: [...o.regra.incluir], excluir: [...o.regra.excluir] } }))

export const operacoes = ref<Operacao[]>(copiar(iniciais))
export const reiniciarOperacoes = () => { operacoes.value = copiar(iniciais) }

export const regraVazia = (): RegraDaOperacao => ({ categorias: [], peloGatilho: true, pelaGravacao: true, incluir: [], excluir: [] })
export const operacaoPorId = (id: string | undefined) => operacoes.value.find(o => o.id === id)

let proximo = 1
export const novoIdDeOperacao = () => `op-${proximo++}`

/* ------------------------------------------------------------------ *
 * A regra                                                             *
 * ------------------------------------------------------------------ */

export type MotivoNaOperacao =
  | { tipo: 'gatilho', evento: Evento }
  | { tipo: 'grava', evento: Evento }
  | { tipo: 'incluido' }

/** Por que o fluxo entra na operação. Lista vazia: fica fora. */
export function motivosDoFluxo(f: Fluxo, r: RegraDaOperacao): MotivoNaOperacao[] {
  if (r.excluir.includes(f.id)) return []
  const m: MotivoNaOperacao[] = []
  if (r.peloGatilho && f.gatilho.tipo === 'events' && r.categorias.includes(f.gatilho.categoria)) {
    m.push({ tipo: 'gatilho', evento: { categoria: f.gatilho.categoria, acao: f.gatilho.acao } })
  }
  if (r.pelaGravacao) for (const ev of f.grava) if (r.categorias.includes(ev.categoria)) m.push({ tipo: 'grava', evento: ev })
  if (!m.length && r.incluir.includes(f.id)) m.push({ tipo: 'incluido' })
  return m
}

export const fluxosPelaRegra = (r: RegraDaOperacao, fs: Fluxo[]) => fs.filter(f => motivosDoFluxo(f, r).length)
export const fluxosDaOperacao = (id: string | undefined, fs: Fluxo[]) => {
  const op = operacaoPorId(id)
  return op ? fluxosPelaRegra(op.regra, fs) : []
}
export const operacoesDoFluxo = (f: Fluxo) => operacoes.value.filter(o => motivosDoFluxo(f, o.regra).length)
export const fluxosSemOperacao = (fs: Fluxo[]) => fs.filter(f => !operacoesDoFluxo(f).length)

const mesmoEvento = (a: Evento, b: Evento) => a.categoria === b.categoria && a.acao === b.acao
const escuta = (f: Fluxo, ev: Evento) => f.gatilho.tipo === 'events' && mesmoEvento({ categoria: f.gatilho.categoria, acao: f.gatilho.acao }, ev)

export interface LigacaoDeFora {
  fluxo: Fluxo
  /** "dispara": o fluxo de fora grava o evento que dispara um fluxo da operação. "disparado": o contrário. */
  sentido: 'dispara' | 'disparado'
  evento: Evento
  vizinho: Fluxo
}

/**
 * Os fluxos fora da operação que se ligam a ela pela configuração: gravam um evento que um fluxo
 * de dentro escuta, ou escutam um evento que um fluxo de dentro grava. É o que a regra deixou de
 * fora e pode faltar no mapa.
 */
export function ligadosForaDaOperacao(r: RegraDaOperacao, fs: Fluxo[]): LigacaoDeFora[] {
  const dentro = fluxosPelaRegra(r, fs)
  const ids = new Set(dentro.map(f => f.id))
  const lista: LigacaoDeFora[] = []
  for (const f of fs) {
    if (ids.has(f.id)) continue
    const dispara = f.grava.map(ev => ({ ev, viz: dentro.find(d => escuta(d, ev)) })).find(x => x.viz)
    if (dispara) { lista.push({ fluxo: f, sentido: 'dispara', evento: dispara.ev, vizinho: dispara.viz! }); continue }
    if (f.gatilho.tipo === 'events') {
      const ev = { categoria: f.gatilho.categoria, acao: f.gatilho.acao }
      const viz = dentro.find(d => d.grava.some(g => mesmoEvento(g, ev)))
      if (viz) lista.push({ fluxo: f, sentido: 'disparado', evento: ev, vizinho: viz })
    }
  }
  return lista
}

/** Quantas ligações configuradas existem entre os fluxos de dentro (um grava, outro escuta). */
export function ligacoesInternas(dentro: Fluxo[]) {
  let n = 0
  for (const a of dentro) for (const ev of a.grava) n += dentro.filter(b => escuta(b, ev)).length
  return n
}

/** A categoria de um item leva à primeira operação que a acompanha. */
export const operacaoDaCategoria = (c: CategoriaId) => operacoes.value.find(o => o.regra.categorias.includes(c))
