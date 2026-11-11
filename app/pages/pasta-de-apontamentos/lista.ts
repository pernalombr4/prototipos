/**
 * As regras da pasta de Apontamentos, sobre o array em memória.
 *
 * Tudo aqui é estado local: recarregar a página volta ao mock. Nada vai para a
 * rede. As funções recebem a lista reativa e mudam ela no lugar.
 */
import { toRaw } from 'vue'
import type { Apontamento, ConfigDaPasta, Estado, Pessoa, Rodada } from './mocks'

export interface Lista {
  apontamentos: Apontamento[]
  rodadas: Rodada[]
  config: ConfigDaPasta
  pessoas: Pessoa[]
}

export type Grupo = 'todos' | 'pendentes' | 'paraConferir' | 'fechados' | 'rascunhos'

export const pendente = (e: Estado) => e === 'aberto' || e === 'reaberto'

export function fechado(a: Apontamento, c: ConfigDaPasta) {
  return a.estado === 'conferido' || a.estado === 'descartado' || (a.estado === 'resolvido' && !c.exigeConferencia)
}

export function grupoDe(a: Apontamento, c: ConfigDaPasta): Exclude<Grupo, 'todos'> {
  if (a.estado === 'rascunho') return 'rascunhos'
  if (pendente(a.estado)) return 'pendentes'
  if (fechado(a, c)) return 'fechados'
  return 'paraConferir'
}

/** O que a pessoa vê: rascunho só de quem escreveu. */
export function visiveis(l: Lista, quem: number) {
  return l.apontamentos.filter(a => a.estado !== 'rascunho' || a.autor === quem)
}

export function contagem(l: Lista, quem: number) {
  const vis = visiveis(l, quem)
  const c = { todos: 0, pendentes: 0, paraConferir: 0, fechados: 0, rascunhos: 0, conferido: 0, resolvido: 0, aberto: 0, reaberto: 0, descartado: 0 }
  for (const a of vis) {
    const g = grupoDe(a, l.config)
    c[g]++
    if (a.estado !== 'rascunho') {
      c.todos++
      c[a.estado]++
    }
  }
  return c
}

/** Rodada que está sendo preparada por quem confere. */
export const proximaRodada = (l: Lista) => l.rodadas.length + 1
/** Rodada em correção. */
export const rodadaAtual = (l: Lista) => Math.max(l.rodadas.length, 1)

export type Situacao = 'semRetorno' | 'emCorrecao' | 'aguardandoReteste' | 'concluido'

export function situacao(l: Lista): Situacao {
  if (!l.rodadas.length) return 'semRetorno'
  const enviados = l.apontamentos.filter(a => a.estado !== 'rascunho')
  if (enviados.length && enviados.every(a => fechado(a, l.config))) return 'concluido'
  if (l.rodadas.at(-1)?.retestePedidoEm) return 'aguardandoReteste'
  return 'emCorrecao'
}

/** De quem é a vez no apontamento. */
export function vezDe(a: Apontamento, c: ConfigDaPasta): number | null {
  if (pendente(a.estado)) return a.responsavel
  if (a.estado === 'resolvido' && c.exigeConferencia) return a.autor
  return null
}

/* ---------- permissões por papel ---------- */

export const podeResolver = (a: Apontamento, quem: number) => pendente(a.estado) && a.responsavel === quem
export const podeDesmarcar = (a: Apontamento, quem: number, c: ConfigDaPasta) => a.estado === 'resolvido' && a.responsavel === quem && !!c
export const podeConferir = (a: Apontamento, quem: number, c: ConfigDaPasta) => a.estado === 'resolvido' && c.exigeConferencia && a.autor === quem
export const podeReabrir = (a: Apontamento, quem: number) => (a.estado === 'resolvido' || a.estado === 'conferido' || a.estado === 'descartado') && a.autor === quem
export const podeDescartar = (a: Apontamento, quem: number) => (pendente(a.estado) || a.estado === 'resolvido') && (a.autor === quem || a.responsavel === quem)

/* ---------- ações ---------- */

let seq = 1000
const id = (p: string) => `${p}-${++seq}`

function registrar(l: Lista, a: Apontamento, quem: number, para: Estado, nota?: string) {
  const conferente = a.autor === quem
  a.historico.push({
    id: id('ev'),
    quem,
    quando: new Date(),
    de: a.estado,
    para,
    rodada: conferente ? proximaRodada(l) : rodadaAtual(l),
    nota,
  })
  a.estado = para
}

/** Foto do apontamento, para o Desfazer do toast. */
export function foto(a: Apontamento): Apontamento {
  return structuredClone(toRaw(a))
}

export function restaurar(l: Lista, f: Apontamento) {
  const i = l.apontamentos.findIndex(x => x.id === f.id)
  if (i >= 0) l.apontamentos.splice(i, 1, f)
  else l.apontamentos.push(f)
  l.apontamentos.sort((x, y) => x.numero - y.numero)
}

export function resolver(l: Lista, a: Apontamento, quem: number, nota?: string) {
  if (nota) responder(a, quem, nota)
  registrar(l, a, quem, 'resolvido', nota)
}

export function desmarcar(l: Lista, a: Apontamento, quem: number) {
  registrar(l, a, quem, a.reaberturas ? 'reaberto' : 'aberto')
}

export function conferir(l: Lista, a: Apontamento, quem: number) {
  registrar(l, a, quem, 'conferido')
}

export function reabrir(l: Lista, a: Apontamento, quem: number, nota: string) {
  responder(a, quem, nota)
  a.reaberturas++
  a.motivo = undefined
  registrar(l, a, quem, 'reaberto', nota)
}

export function descartar(l: Lista, a: Apontamento, quem: number, motivo: string) {
  a.motivo = motivo
  registrar(l, a, quem, 'descartado', motivo)
}

export function responder(a: Apontamento, quem: number, texto: string) {
  a.respostas.push({ id: id('re'), autor: quem, quando: new Date(), texto })
}

export interface NovoApontamento {
  titulo: string
  corpo: string
  responsavel: number
  prioridade: Apontamento['prioridade']
  anexos: Apontamento['anexos']
}

export function criar(l: Lista, n: NovoApontamento, quem: number, rascunho: boolean): Apontamento {
  const numero = Math.max(0, ...l.apontamentos.map(a => a.numero)) + 1
  const estado: Estado = rascunho ? 'rascunho' : 'aberto'
  const rodada = rascunho ? proximaRodada(l) : rodadaAtual(l)
  const agora = new Date()
  const a: Apontamento = {
    id: id('ap'),
    numero,
    titulo: n.titulo,
    corpo: n.corpo,
    estado,
    prioridade: n.prioridade,
    responsavel: n.responsavel,
    autor: quem,
    rodada,
    reaberturas: 0,
    anexos: n.anexos,
    respostas: [],
    historico: [{ id: id('ev'), quem, quando: agora, para: estado, rodada }],
    criadoEm: agora,
  }
  l.apontamentos.push(a)
  return a
}

/** Envia os rascunhos de quem confere e fecha a rodada. */
export function enviarRetorno(l: Lista, quem: number, veredito: Rodada['veredito'], resumo: string) {
  const numero = proximaRodada(l)
  for (const a of l.apontamentos) {
    if (a.estado === 'rascunho' && a.autor === quem) {
      a.historico.push({ id: id('ev'), quem, quando: new Date(), de: 'rascunho', para: 'aberto', rodada: numero })
      a.estado = 'aberto'
      a.rodada = numero
    }
  }
  l.rodadas.push({ numero, quem, quando: new Date(), veredito, resumo })
  return numero
}

export function pedirReteste(l: Lista, quem: number) {
  const r = l.rodadas.at(-1)
  if (!r) return
  r.retestePedidoEm = new Date()
  r.retestePedidoPor = quem
}

/** Quantos rascunhos e reabertos entram na rodada que quem confere está preparando. */
export function resumoDaProxima(l: Lista, quem: number) {
  const n = proximaRodada(l)
  const novos = l.apontamentos.filter(a => a.estado === 'rascunho' && a.autor === quem).length
  const reabertos = l.apontamentos.filter(a => a.historico.some(e => e.para === 'reaberto' && e.rodada === n)).length
  const responsaveis = new Set(l.apontamentos.filter(a => (a.estado === 'rascunho' && a.autor === quem) || a.historico.some(e => e.para === 'reaberto' && e.rodada === n)).map(a => a.responsavel))
  return { novos, reabertos, responsaveis: [...responsaveis] }
}

export const pessoa = (l: Lista, idPessoa: number) => l.pessoas.find(p => p.id === idPessoa)

/** Rótulo do estado: o nome que o admin deu (só em português, como dado do workspace) ou o padrão do idioma. */
export function rotuloDoEstado(c: ConfigDaPasta, e: Estado, padrao: Record<string, string>, locale: string) {
  return (locale === 'pt-BR' && c.rotulos[e]) || padrao[e] || e
}

export const visualDoEstado: Record<Estado, { cor: 'neutral' | 'info' | 'success' | 'error' | 'warning', icone: string, variante: 'soft' | 'outline' | 'subtle' }> = {
  rascunho: { cor: 'neutral', icone: 'i-lucide-pencil-line', variante: 'outline' },
  aberto: { cor: 'neutral', icone: 'i-lucide-circle', variante: 'soft' },
  reaberto: { cor: 'error', icone: 'i-lucide-rotate-ccw', variante: 'soft' },
  resolvido: { cor: 'info', icone: 'i-lucide-circle-check', variante: 'soft' },
  conferido: { cor: 'success', icone: 'i-lucide-badge-check', variante: 'soft' },
  descartado: { cor: 'neutral', icone: 'i-lucide-circle-slash', variante: 'outline' },
}

export const iconeDaPrioridade: Record<string, string> = {
  low: 'i-lucide-signal-low',
  normal: 'i-lucide-signal-medium',
  high: 'i-lucide-signal-high',
  urgent: 'i-lucide-siren',
}
