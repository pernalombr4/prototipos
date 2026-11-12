/**
 * As regras da pasta de Apontamentos, sobre o array em memória.
 *
 * Tudo aqui é estado local: recarregar a página volta ao mock. Nada vai para a
 * rede. As funções recebem a lista reativa e mudam ela no lugar.
 */
import { toRaw } from 'vue'
import type { Apontamento, ConfigDaPasta, Estado, Pessoa, Rodada } from './mocks'
import { avisar } from './avisos'

export interface Lista {
  apontamentos: Apontamento[]
  rodadas: Rodada[]
  config: ConfigDaPasta
  pessoas: Pessoa[]
}

export type Grupo = 'todos' | 'pendentes' | 'paraConferir' | 'fechados'

export const pendente = (e: Estado) => e === 'aberto' || e === 'reaberto'

export function fechado(a: Apontamento, c: ConfigDaPasta) {
  return a.estado === 'conferido' || a.estado === 'descartado' || (a.estado === 'resolvido' && !c.exigeConferencia)
}

export function grupoDe(a: Apontamento, c: ConfigDaPasta): Exclude<Grupo, 'todos'> {
  if (pendente(a.estado)) return 'pendentes'
  if (fechado(a, c)) return 'fechados'
  return 'paraConferir'
}

/** O que a pessoa vê: todos (rodada 4, sem rascunho). */
export function visiveis(l: Lista, _quem: number) {
  return l.apontamentos
}

export function contagem(l: Lista, quem: number) {
  const vis = visiveis(l, quem)
  const c = { todos: 0, pendentes: 0, paraConferir: 0, fechados: 0, conferido: 0, resolvido: 0, aberto: 0, reaberto: 0, descartado: 0 }
  for (const a of vis) {
    c[grupoDe(a, l.config)]++
    c.todos++
    c[a.estado]++
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
  const enviados = l.apontamentos
  if (enviados.length && enviados.every(a => fechado(a, l.config))) return 'concluido'
  if (l.rodadas.at(-1)?.retestePedidoEm) return 'aguardandoReteste'
  return 'emCorrecao'
}

/** De quem é a vez no apontamento: os responsáveis enquanto pendente, quem confere depois. */
export function vezDe(a: Apontamento, c: ConfigDaPasta): number[] {
  if (pendente(a.estado)) return a.responsaveis
  if (a.estado === 'resolvido' && c.exigeConferencia) return [a.autor]
  return []
}

export const ehResponsavel = (a: Apontamento, quem: number) => a.responsaveis.includes(quem)

/* ---------- permissões por papel ---------- */

export const podeResolver = (a: Apontamento, quem: number) => pendente(a.estado) && ehResponsavel(a, quem)
export const podeDesmarcar = (a: Apontamento, quem: number, c: ConfigDaPasta) => a.estado === 'resolvido' && ehResponsavel(a, quem) && !!c
export const podeConferir = (a: Apontamento, quem: number, c: ConfigDaPasta) => a.estado === 'resolvido' && c.exigeConferencia && a.autor === quem
export const podeReabrir = (a: Apontamento, quem: number) => (a.estado === 'resolvido' || a.estado === 'conferido' || a.estado === 'descartado') && a.autor === quem
export const podeDescartar = (a: Apontamento, quem: number) => (pendente(a.estado) || a.estado === 'resolvido') && (a.autor === quem || ehResponsavel(a, quem))

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

/**
 * Cópia funda sem os proxies do Vue. O toRaw só tira o de fora: um array
 * reativo guardado dentro (a citação de uma resposta, a versão de uma edição)
 * faz o structuredClone falhar.
 */
export function copia<T>(v: T): T {
  const cru = toRaw(v) as unknown
  if (Array.isArray(cru)) return cru.map(copia) as T
  if (cru instanceof Date) return new Date(cru) as T
  if (cru && typeof cru === 'object') return Object.fromEntries(Object.entries(cru).map(([k, x]) => [k, copia(x)])) as T
  return cru as T
}

/** Foto do apontamento, para o Desfazer do toast. */
export function foto(a: Apontamento): Apontamento {
  return copia(a)
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
  avisar(a.responsaveis, quem, { tipo: 'reaberto', apontamento: a.id, numero: a.numero, titulo: a.titulo })
}

export function descartar(l: Lista, a: Apontamento, quem: number, motivo: string, duplicadoDe?: number) {
  a.motivo = motivo
  a.duplicadoDe = duplicadoDe
  registrar(l, a, quem, 'descartado', motivo)
}

/** Edita título e corpo e guarda a versão anterior, para o "editado". */
export function editar(a: Apontamento, quem: number, titulo: string, corpo: string) {
  if (titulo === a.titulo && corpo === a.corpo) return
  a.versoes = [...(a.versoes ?? []), { quem, quando: new Date(), titulo: a.titulo, corpo: a.corpo }]
  a.titulo = titulo
  a.corpo = corpo
}

/** A rodada em vigor numa data: quantos retornos já tinham saído, no mínimo 1. */
export function rodadaDaData(l: Lista, quando: Date) {
  return Math.max(1, l.rodadas.filter(r => r.quando <= quando).length)
}

export type Secao = 'novos' | 'reabertos' | 'resolvidos' | 'conferidos' | 'descartados'

/** O que cada rodada fez: quem nasceu, voltou, foi resolvido, conferido ou descartado nela. */
export function secoesDaRodada(l: Lista, n: number, quem: number): Record<Secao, Apontamento[]> {
  const r: Record<Secao, Apontamento[]> = { novos: [], reabertos: [], resolvidos: [], conferidos: [], descartados: [] }
  for (const a of visiveis(l, quem)) {
    const ev = a.historico.filter(e => e.rodada === n)
    if (ev.some(e => e.para === 'aberto' && !e.de)) r.novos.push(a)
    if (ev.some(e => e.para === 'reaberto')) r.reabertos.push(a)
    if (ev.some(e => e.para === 'resolvido')) r.resolvidos.push(a)
    if (ev.some(e => e.para === 'conferido')) r.conferidos.push(a)
    if (ev.some(e => e.para === 'descartado')) r.descartados.push(a)
  }
  return r
}

/** A rodada que quem confere está preparando tem algo? Apontamento novo ou conferência já feita. */
export function temPreparo(l: Lista, quem: number) {
  const n = proximaRodada(l)
  const s = secoesDaRodada(l, n, quem)
  return Object.values(s).some(x => x.length)
}

export function responder(a: Apontamento, quem: number, texto: string) {
  a.respostas.push({ id: id('re'), autor: quem, quando: new Date(), texto })
}

export interface NovoApontamento {
  titulo: string
  corpo: string
  responsaveis: number[]
  prioridade: Apontamento['prioridade']
  anexos: Apontamento['anexos']
}

/**
 * Cria o apontamento já aberto e notifica os responsáveis (rodada 4: sem rascunho).
 * Quem confere escreve na rodada que está preparando; quem resolve, na rodada em correção.
 */
export function criar(l: Lista, n: NovoApontamento, quem: number): Apontamento {
  const numero = Math.max(0, ...l.apontamentos.map(a => a.numero)) + 1
  const estado: Estado = 'aberto'
  const conferente = l.rodadas.some(r => r.quem === quem) || l.apontamentos.some(a => a.autor === quem)
  const rodada = conferente ? proximaRodada(l) : rodadaAtual(l)
  const agora = new Date()
  const a: Apontamento = {
    id: id('ap'),
    numero,
    titulo: n.titulo,
    corpo: n.corpo,
    estado,
    prioridade: n.prioridade,
    responsaveis: [...n.responsaveis],
    autor: quem,
    rodada,
    reaberturas: 0,
    anexos: n.anexos,
    respostas: [],
    historico: [{ id: id('ev'), quem, quando: agora, para: estado, rodada }],
    criadoEm: agora,
  }
  l.apontamentos.push(a)
  avisar(a.responsaveis, quem, { tipo: 'atribuido', apontamento: a.id, numero, titulo: a.titulo })
  return a
}

/** Fecha a rodada com o veredito e notifica quem tem apontamento novo ou reaberto nela. */
export function enviarRetorno(l: Lista, quem: number, veredito: Rodada['veredito'], resumo: string) {
  const numero = proximaRodada(l)
  const porPessoa = new Map<number, number>()
  for (const a of daRodada(l, numero)) {
    for (const r of a.responsaveis) porPessoa.set(r, (porPessoa.get(r) ?? 0) + 1)
  }
  l.rodadas.push({ numero, quem, quando: new Date(), veredito, resumo })
  for (const [r, qtd] of porPessoa) avisar([r], quem, { tipo: 'retorno', rodada: numero, qtd })
  return numero
}

/** Responsáveis que entraram depois de criado o apontamento: recebem o aviso de atribuição. */
export function atribuir(a: Apontamento, quem: number, antes: number[]) {
  const novos = a.responsaveis.filter(r => !antes.includes(r))
  avisar(novos, quem, { tipo: 'atribuido', apontamento: a.id, numero: a.numero, titulo: a.titulo })
}

export function pedirReteste(l: Lista, quem: number) {
  const r = l.rodadas.at(-1)
  if (!r) return
  r.retestePedidoEm = new Date()
  r.retestePedidoPor = quem
}

/** Apontamentos que nasceram ou voltaram na rodada. */
const daRodada = (l: Lista, n: number) => l.apontamentos.filter(a => a.historico.some(e => e.rodada === n && ((e.para === 'aberto' && !e.de) || e.para === 'reaberto')))

/** Quantos novos e reabertos entram na rodada que quem confere está preparando. */
export function resumoDaProxima(l: Lista, quem: number) {
  const n = proximaRodada(l)
  const novos = l.apontamentos.filter(a => a.autor === quem && a.historico.some(e => e.rodada === n && e.para === 'aberto' && !e.de)).length
  const reabertos = l.apontamentos.filter(a => a.historico.some(e => e.para === 'reaberto' && e.rodada === n)).length
  const responsaveis = new Set(daRodada(l, n).flatMap(a => a.responsaveis))
  return { novos, reabertos, responsaveis: [...responsaveis] }
}

export const pessoa = (l: Lista, idPessoa: number) => l.pessoas.find(p => p.id === idPessoa)

/** Rótulo do estado: o nome que o admin deu (só em português, como dado do workspace) ou o padrão do idioma. */
export function rotuloDoEstado(c: ConfigDaPasta, e: Estado, padrao: Record<string, string>, locale: string) {
  return (locale === 'pt-BR' && c.rotulos[e]) || padrao[e] || e
}

export const visualDoEstado: Record<Estado, { cor: 'neutral' | 'info' | 'success' | 'error' | 'warning', icone: string, variante: 'soft' | 'outline' | 'subtle' }> = {
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
