/**
 * A situação de cada prazo e os prazos como eventos da Agenda.
 *
 * PROPOSTA: o prazo é tarefa, então ele aparece na Agenda como toda tarefa com data. O módulo põe 2 eventos por
 * prazo: o interno (quando a tarefa vence) e o fatal (o último dia do tribunal).
 */
import type { Prazo } from './mocks'
import { HOJE, processoPorId, regraPorId } from './mocks'
import { calcularPrazo, estado } from './estado'
import type { Evento } from './_Calendario.vue'
import type { Textos } from './textos'
import type { Audiencia } from './tratamento'

export type Faixa = 'atrasado' | 'hoje' | 'semana' | 'proximos' | 'cumpridos'
/** A sexta-feira da semana de HOJE. */
export const SEXTA = '2026-10-30'

export function faixaDoPrazo(p: Prazo): Faixa {
  const c = calcularPrazo(p)
  if (p.status === 'completed') return 'cumpridos'
  if (c.fatal === HOJE || c.interno === HOJE) return 'hoje'
  if (c.interno < HOJE) return 'atrasado'
  if (c.interno <= SEXTA) return 'semana'
  return 'proximos'
}

export function eventosDosPrazos(t: Textos, prazos: Prazo[] = estado.prazos): Evento[] {
  return prazos.flatMap((p) => {
    const c = calcularPrazo(p)
    const nome = `${processoPorId.get(p.processo)?.reference} · ${regraPorId.get(p.entrada.regra)?.ato}`
    const feito = p.status === 'completed'
    return [
      { id: `${p.id}:interno`, dia: c.interno, titulo: `${t.agenda.interno} · ${nome}`, tom: feito ? 'cumprido' : 'interno' },
      { id: `${p.id}:fatal`, dia: c.fatal, titulo: `${t.agenda.fatal} · ${nome}`, tom: feito ? 'cumprido' : 'fatal' },
    ] as Evento[]
  })
}

/** Rodada 4: as audiências que nasceram de uma captura, como item da categoria Audiências. Sem cálculo. */
export function eventosDasAudiencias(nomeDoTipo: (a: Audiencia) => string): Evento[] {
  return estado.audiencias.map(a => ({
    id: `aud:${a.id}`,
    dia: a.dia,
    hora: a.hora,
    titulo: `${nomeDoTipo(a)} · ${processoPorId.get(a.processo)?.reference}`,
    tom: 'neutro' as const,
  }))
}
/** O processo de um evento de audiência da Agenda. */
export const audienciaDoEvento = (e: Evento) => (e.id.startsWith('aud:') ? estado.audiencias.find(a => `aud:${a.id}` === e.id) : undefined)

/** O id do prazo de um evento da Agenda, quando o evento é de prazo. */
export const prazoDoEvento = (e: Evento) => (/^\d+:/.test(e.id) ? Number(e.id.split(':')[0]) : undefined)
