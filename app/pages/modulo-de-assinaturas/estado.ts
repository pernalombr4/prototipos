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
/**
 * A situação do workspace (andaime): o dia normal ou um dos começos do módulo (M16).
 * - vazio: nem provedor nem envelope;
 * - semEnvelope: 1 provedor conectado e nenhum envelope;
 * - soRascunhos: nenhum provedor, com rascunhos criados antes de conectar.
 */
export type Situacao = 'normal' | 'vazio' | 'semEnvelope' | 'soRascunhos'

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
    /** O workspace dos começos do módulo. O dia normal fica intacto, para os atalhos continuarem abrindo os envelopes dele. */
    novo: { envelopes: [] as Envelope[], credenciais: [] as Credencial[] },
  }
}

export const estado = reactive(inicial())

export function reiniciarEstado() {
  Object.assign(estado, inicial())
}

export const envelopePorId = (id: number) => estado.envelopes.find(e => e.id === id) ?? estado.novo.envelopes.find(e => e.id === id)

/** O que o workspace mostra conforme a situação do andaime. */
const lista = <K extends 'envelopes' | 'credenciais'>(k: K) => (estado.situacao === 'normal' ? estado[k] : estado.novo[k])
export const envelopesVisiveis = computed(() => lista('envelopes'))
export const credenciaisVisiveis = computed(() => lista('credenciais'))
export const todasAsCredenciais = computed(() => [...estado.credenciais, ...estado.novo.credenciais])

/** Andaime: carrega o workspace de cada situação. */
export function carregarSituacao(s: Situacao) {
  estado.situacao = s
  // O webhook da ClickSign só aparece confirmado quando ela já estava conectada.
  estado.webhookConfirmado = { ...inicial().webhookConfirmado, ...(s === 'vazio' || s === 'soRascunhos' ? { clicksign: null } : {}) }
  const rascunho = (id: number, title: string, doc: string, participantes: [string, string][], diasAtras: number): Envelope => ({
    id, reference: `Rs${id}Kq8Wd${id % 7}Tn`, title, status: 'draft', documento: { nome: doc, tamanhoMb: 0.8 }, origem: { tipo: 'standalone' }, solicitante: EU,
    created_at: new Date(new Date(HOJE).getTime() - diasAtras * 86400000).toISOString(),
    participantes: participantes.map(([nome, email], i) => ({ id: i + 1, nome, email, papel: 'signer', ordem: 1, status: 'pending' })),
    eventos: [{ tipo: 'created', em: HOJE, autor: { tipo: 'pessoa', id: EU } }],
  })
  estado.novo = {
    credenciais: s === 'semEnvelope' ? [copia(credenciaisIniciais[0]!)] : [],
    envelopes: s === 'soRascunhos'
      ? [
          rascunho(401, 'Contrato de locação galpão 9', 'locacao-galpao-9.pdf', [['Helena Prado', 'helena.prado@logprime.example']], 0),
          rascunho(402, 'Termo de confidencialidade Nova Rota', 'nda-nova-rota.docx', [['Caio Mendes', 'caio.mendes@novarota.example'], ['Lúcia Faria', 'lucia.faria@novarota.example']], 1),
        ]
      : [],
  }
}

/** A credencial está pronta para enviar: a D4Sign sem cofre não está. */
export const credencialPronta = (c: Credencial) => !(c.provedor === 'd4sign' && !c.cofre)

/* ------------------------------------------------------------------ *
 * Regras do envelope                                                  *
 * ------------------------------------------------------------------ */

export const tem = (e: Envelope, r: 'cancela' | 'consultaStatus' | 'reenvio' | 'links' | 'configurador') => !!e.provider && provedorPorId.get(e.provider)!.recursos.includes(r)
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

/** Sem credencial, o envelope fica como rascunho sem provedor: dá para criar antes de conectar e enviar depois. */
export function criarEnvelope(dados: { title: string, description?: string, credential?: number, documento: { nome: string, tamanhoMb: number }, participantes: Omit<Participante, 'id' | 'status'>[], expires_at?: string }, enviarAgora: boolean) {
  const cred = todasAsCredenciais.value.find(c => c.id === dados.credential)
  const id = estado.proximoId++
  const envelope: Envelope = {
    id, reference: `Nv${id}Qa7Lp${id % 13}Zx`, title: dados.title, description: dados.description, status: 'draft', provider: cred?.provedor, credential: cred?.id,
    documento: dados.documento, origem: { tipo: 'standalone' }, solicitante: EU, created_at: HOJE, expires_at: dados.expires_at,
    participantes: dados.participantes.map((p, i) => ({ ...p, id: i + 1, status: 'pending' })),
    eventos: [{ tipo: 'created', em: HOJE, autor: { tipo: 'pessoa', id: EU } }],
  }
  envelopesVisiveis.value.unshift(envelope)
  if (enviarAgora && cred) enviar(id)
  return id
}

export function excluirCredencial(id: number) {
  const l = credenciaisVisiveis.value
  const i = l.findIndex(c => c.id === id)
  if (i >= 0) l.splice(i, 1)
}

/** M16: a 1ª credencial liga o módulo sozinha. Devolve true quando ligou agora. */
export function criarCredencial(dados: Omit<Credencial, 'id' | 'criadaEm'>) {
  const eraAPrimeira = credenciaisVisiveis.value.length === 0
  credenciaisVisiveis.value.push({ ...dados, id: estado.proximoId++, criadaEm: HOJE })
  const ligou = eraAPrimeira && !estado.moduloLigado
  if (eraAPrimeira) estado.moduloLigado = true
  return ligou
}
