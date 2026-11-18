/** A cor de cada status, a mesma na lista, no detalhe, no fluxo e na tarefa. */
import type { StatusDoEnvelope, StatusDoParticipante } from './mocks'

type Cor = 'primary' | 'info' | 'success' | 'warning' | 'error' | 'neutral'

export const corDoStatus: Record<StatusDoEnvelope, Cor> = {
  draft: 'neutral', sending: 'info', configuring: 'info', pending: 'info', completed: 'success', rejected: 'error', canceled: 'neutral', expired: 'warning', error: 'error',
}

export const corDoParticipante: Record<StatusDoParticipante, Cor> = {
  pending: 'neutral', queued: 'neutral', sent: 'info', opened: 'info', signed: 'success', rejected: 'error', expired: 'warning', notSigned: 'neutral',
}
