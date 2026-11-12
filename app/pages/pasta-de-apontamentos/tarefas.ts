/**
 * As regras da tarefa rápida que a rodada 2 propõe: checklist, subtarefa (1
 * nível), dependência e conclusão com motivo. A rodada 5 acrescenta várias
 * checklists com nome, tarefa relacionada, item vinculado e anexos. Tudo sobre
 * o array em memória.
 */
import type { Checklist, Conclusao, LinhaDeChecklist, TarefaDoItem } from './mocks'
import { copia } from './lista'
import { secoesVazias } from './mocks'

export const porId = (ts: TarefaDoItem[], id: number | undefined) => ts.find(x => x.tarefa.id === id)
export const filhas = (ts: TarefaDoItem[], x: TarefaDoItem) => ts.filter(y => y.mae === x.tarefa.id)
export const concluida = (x: TarefaDoItem | undefined) => x?.tarefa.status === 'completed'

/** A linha ligada a uma subtarefa se marca sozinha quando ela é concluída. */
export const feitoDaLinha = (ts: TarefaDoItem[], l: LinhaDeChecklist) => l.subtarefa ? concluida(porId(ts, l.subtarefa)) : l.feito
/** Todas as linhas, de todas as checklists da tarefa. */
export const linhasDe = (x: TarefaDoItem) => x.checklists.flatMap(c => c.linhas)
export const feitosDaChecklist = (ts: TarefaDoItem[], x: TarefaDoItem) => linhasDe(x).filter(l => feitoDaLinha(ts, l)).length

/** Relacionada vale nos 2 sentidos: as que esta cita e as que citam esta. */
export const relacionadasDe = (ts: TarefaDoItem[], x: TarefaDoItem) => ts.filter(y => y !== x && (x.relacionadas.includes(y.tarefa.id) || y.relacionadas.includes(x.tarefa.id)))
export function desrelacionar(ts: TarefaDoItem[], x: TarefaDoItem, y: TarefaDoItem) {
  x.relacionadas = x.relacionadas.filter(id => id !== y.tarefa.id)
  y.relacionadas = y.relacionadas.filter(id => id !== x.tarefa.id)
}

/** A tarefa sem nada nas seções da proposta: o que conta para o estado vazio. */
export const semSecoes = (ts: TarefaDoItem[], x: TarefaDoItem) => !x.checklists.length && !filhas(ts, x).length && !x.bloqueadaPor.length && !bloqueia(ts, x).length && !relacionadasDe(ts, x).length && !x.itens.length && !x.anexos.length

/** O que esta tarefa bloqueia: as que a citam em "Bloqueada por". */
export const bloqueia = (ts: TarefaDoItem[], x: TarefaDoItem) => ts.filter(y => y.bloqueadaPor.includes(x.tarefa.id))

let seq = 5000
export function novaTarefa(ts: TarefaDoItem[], base: TarefaDoItem, nome: string, extra: Partial<TarefaDoItem> = {}, responsavel?: number): TarefaDoItem {
  const id = ++seq
  const t = copia(base.tarefa)
  const nova: TarefaDoItem = {
    tarefa: {
      ...t,
      id,
      reference: `5b3C${id}NovaTarefaDoPrototipo`,
      name: nome,
      description: null,
      status: 'pending',
      priority: 'normal',
      points: 0,
      assigned_to: responsavel ?? t.assigned_to,
      completed_at: null,
      completed_by: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    apontamentos: [],
    rodadas: [],
    ...secoesVazias(),
    ...extra,
  }
  ts.push(nova)
  return nova
}

export function concluir(x: TarefaDoItem, quem: number, c: Conclusao) {
  x.tarefa.status = 'completed'
  x.tarefa.completed_at = new Date()
  x.tarefa.completed_by = quem
  x.conclusao = c
}

export function reabrirTarefa(x: TarefaDoItem) {
  x.tarefa.status = 'pending'
  x.tarefa.completed_at = null
  x.tarefa.completed_by = null
  x.conclusao = undefined
}

let seqLinha = 9000
export const novaLinha = (texto: string, responsavel?: number): LinhaDeChecklist => ({ id: `ck-n${++seqLinha}`, texto, feito: false, responsavel })
export const novaChecklist = (nome: string): Checklist => ({ id: `cl-n${++seqLinha}`, nome, linhas: [] })
