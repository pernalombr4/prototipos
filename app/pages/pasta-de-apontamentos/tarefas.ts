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

/* ---------- rodada 7: bloqueio de fim para início ---------- */
/**
 * "Bloqueada por" vale de fim para início: a tarefa espera a outra terminar.
 * Enquanto espera, ela fica Bloqueada sozinha; quando a última bloqueadora
 * termina, ela volta ao status que tinha e o responsável recebe o aviso. Por
 * padrão o bloqueio só avisa; com a trava ligada, a tarefa não começa nem
 * termina antes das bloqueadoras. Inventado: o modelo `tasks` tem o status
 * `blocked`, mas nenhum campo diz o que bloqueia.
 */
export const bloqueiosAbertos = (ts: TarefaDoItem[], x: TarefaDoItem) =>
  x.bloqueadaPor.map(id => porId(ts, id)).filter((y): y is TarefaDoItem => !!y && !concluida(y))
/** Quantas tarefas esta ainda espera, contando as que a pessoa não vê. */
export const esperando = (ts: TarefaDoItem[], x: TarefaDoItem) => bloqueiosAbertos(ts, x).length + (x.bloqueiosSemAcesso ?? 0)
/** A trava só impede quando ainda há o que esperar. */
export const travada = (ts: TarefaDoItem[], x: TarefaDoItem) => !!x.travaDoBloqueio && esperando(ts, x) > 0

/**
 * Ajusta o status de 1 tarefa ao estado das bloqueadoras. Devolve 'liberada'
 * quando ela sai de Bloqueada sozinha, para o aviso.
 */
export function ajustarAoBloqueio(ts: TarefaDoItem[], x: TarefaDoItem): 'bloqueada' | 'liberada' | null {
  if (concluida(x)) return null
  const espera = esperando(ts, x) > 0
  if (espera && x.tarefa.status !== 'blocked') {
    x.statusAntesDoBloqueio = x.tarefa.status === 'working' ? 'working' : 'pending'
    x.tarefa.status = 'blocked'
    return 'bloqueada'
  }
  if (!espera && x.tarefa.status === 'blocked' && x.statusAntesDoBloqueio) {
    x.tarefa.status = x.statusAntesDoBloqueio
    x.statusAntesDoBloqueio = undefined
    return 'liberada'
  }
  return null
}

/**
 * Chave do que a tarefa espera: muda quando entra ou sai uma bloqueadora, ou
 * quando uma delas termina ou reabre. O status da própria tarefa fica de fora,
 * para quem a move à mão (sem trava) não ser desfeito.
 */
export const chaveDoBloqueio = (ts: TarefaDoItem[], x: TarefaDoItem) =>
  `${x.bloqueadaPor.map(id => `${id}:${concluida(porId(ts, id)) ? 1 : 0}`).join(',')}|${x.bloqueiosSemAcesso ?? 0}`
