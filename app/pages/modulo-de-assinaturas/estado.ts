/**
 * O estado do protótipo, em memória. Recarregar a página volta ao começo.
 *
 * As ações (cancelar, reenviar, enviar, criar credencial, ligar o módulo) mexem só neste objeto. Nada sai do navegador.
 */
import type { Credencial, Envelope, Participante, ProvedorId } from './mocks'
import { credenciaisIniciais, envelopesIniciais, EU, HOJE, provedorPorId } from './mocks'

/** O desfecho do nó Assinatura eletrônica na execução do Spaceflow (andaime). */
export type Desfecho = 'aguardando' | 'assinado' | 'recusado' | 'cancelado' | 'expirado' | 'erroProvedor' | 'erroConfig'
/** O estado da tarefa Integração do fluxo da categoria (andaime). */
export type EstadoDaTarefa = 'andamento' | 'cancelado' | 'falhaEnvio'
/** A situação do workspace (andaime): o dia normal ou os estados iniciais do M16. */
export type Situacao = 'normal' | 'semProvedor' | 'semEnvelope'

const copia = <T>(x: T): T => JSON.parse(JSON.stringify(x))

function inicial() {
  return {
    envelopes: copia(envelopesIniciais),
    credenciais: copia(credenciaisIniciais),
    moduloLigado: true,
    situacao: 'normal' as Situacao,
    desfecho: 'cancelado' as Desfecho,
    estadoDaTarefa: 'cancelado' as EstadoDaTarefa,
    /** O 1º retorno do webhook da conta, por provedor (null: nunca chegou). */
    webhookConfirmado: { clicksign: '2026-11-10T10:40:00-03:00', certisign: null } as Partial<Record<ProvedorId, string | null>>,
    proximoId: 300,
  }
}

export const estado = reactive(inicial())

export function reiniciarEstado() {
  Object.assign(estado, inicial())
}

export const envelopePorId = (id: number) => estado.envelopes.find(e => e.id === id)

/** O que o workspace mostra conforme a situação do andaime. */
export const envelopesVisiveis = computed(() => (estado.situacao === 'normal' ? estado.envelopes : []))
export const credenciaisVisiveis = computed(() => (estado.situacao === 'semProvedor' ? [] : estado.credenciais))

/** A credencial está pronta para enviar: a D4Sign sem cofre não está. */
export const credencialPronta = (c: Credencial) => !(c.provedor === 'd4sign' && !c.cofre)

/* ------------------------------------------------------------------ *
 * Regras do envelope                                                  *
 * ------------------------------------------------------------------ */

export const tem = (e: Envelope, r: 'cancela' | 'consultaStatus' | 'reenvio' | 'links' | 'configurador') => provedorPorId.get(e.provider)!.recursos.includes(r)
export const aberto = (e: Envelope) => e.status === 'pending' || e.status === 'sending' || e.status === 'configuring'
/** Quem está na vez: a menor ordem com alguém que ainda não assinou. */
export function quemEstaNaVez(e: Envelope): Participante[] {
  const faltam = e.participantes.filter(p => ['sent', 'opened', 'pending'].includes(p.status))
  if (!faltam.length) return []
  const ordem = Math.min(...faltam.map(p => p.ordem))
  return faltam.filter(p => p.ordem === ordem)
}
export const naFila = (e: Envelope) => e.participantes.filter(p => p.status === 'queued')
export const assinados = (e: Envelope) => e.participantes.filter(p => p.status === 'signed').length

/** M13: sem notícia do provedor há mais de 2 dias, com o envelope aberto. */
export function diasSemRetorno(e: Envelope) {
  if (!aberto(e) || !e.ultimoRetorno) return 0
  const dias = Math.floor((new Date(HOJE).getTime() - new Date(e.ultimoRetorno).getTime()) / 86400000)
  return dias >= 2 ? dias : 0
}

/* ------------------------------------------------------------------ *
 * Ações                                                               *
 * ------------------------------------------------------------------ */

export function cancelar(id: number, motivo: string) {
  const e = envelopePorId(id)
  if (!e) return
  e.status = 'canceled'
  e.canceled_at = HOJE
  e.participantes.forEach((p) => { if (p.status !== 'signed') p.status = 'notSigned' })
  e.eventos.push({ tipo: 'canceled', em: HOJE, autor: { tipo: 'pessoa', id: EU }, motivo: motivo || undefined, confirmadoPeloProvedor: tem(e, 'cancela') ? HOJE : undefined })
}

export function reenviar(id: number) {
  const e = envelopePorId(id)
  if (!e) return 0
  const vez = quemEstaNaVez(e)
  vez.forEach((p) => {
    p.ultimoReenvio = HOJE
    e.eventos.push({ tipo: 'resent', em: HOJE, autor: { tipo: 'pessoa', id: EU }, participante: p.id })
  })
  return vez.length
}

export function enviar(id: number) {
  const e = envelopePorId(id)
  if (!e) return
  e.status = 'pending'
  e.sent_at = HOJE
  e.ultimoRetorno = HOJE
  e.provider_envelope_id = e.provider_envelope_id ?? `PX-${e.id}`
  const ordem = Math.min(...e.participantes.map(p => p.ordem))
  e.participantes.forEach((p) => { p.status = p.ordem === ordem ? 'sent' : 'queued' })
  e.eventos.push({ tipo: 'sent', em: HOJE, autor: { tipo: 'pessoa', id: EU } })
}

export function criarEnvelope(dados: { title: string, description?: string, credential: number, documento: { nome: string, tamanhoMb: number }, participantes: Omit<Participante, 'id' | 'status'>[], expires_at?: string }, enviarAgora: boolean) {
  const cred = estado.credenciais.find(c => c.id === dados.credential)!
  const id = estado.proximoId++
  const envelope: Envelope = {
    id, reference: `Nv${id}Qa7Lp${id % 13}Zx`, title: dados.title, description: dados.description, status: 'draft', provider: cred.provider, credential: cred.id,
    documento: dados.documento, origem: { tipo: 'standalone' }, solicitante: EU, created_at: HOJE, expires_at: dados.expires_at,
    participantes: dados.participantes.map((p, i) => ({ ...p, id: i + 1, status: 'pending' })),
    eventos: [{ tipo: 'created', em: HOJE, autor: { tipo: 'pessoa', id: EU } }],
  }
  estado.envelopes.unshift(envelope)
  if (enviarAgora) enviar(id)
  if (estado.situacao === 'semEnvelope') estado.situacao = 'normal'
  return id
}

/** M16: a 1ª credencial liga o módulo sozinha. Devolve true quando ligou agora. */
export function criarCredencial(dados: Omit<Credencial, 'id' | 'criadaEm'>) {
  const eraAPrimeira = credenciaisVisiveis.value.length === 0
  if (estado.situacao === 'semProvedor') {
    estado.credenciais = []
    estado.envelopes = []
    estado.situacao = 'semEnvelope'
  }
  estado.credenciais.push({ ...dados, id: estado.proximoId++, criadaEm: HOJE })
  const ligou = eraAPrimeira && !estado.moduloLigado
  if (eraAPrimeira) estado.moduloLigado = true
  return ligou
}
