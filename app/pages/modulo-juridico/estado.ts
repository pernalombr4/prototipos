/**
 * O estado em memória do protótipo "Módulo Jurídico". Recarregar a página volta ao começo.
 *
 * Um objeto só, compartilhado pelas telas, porque a mesma intimação confirmada aparece na caixa de intimações, na
 * lista de prazos e na tela do processo.
 */
import { reactive } from 'vue'
import type { DataBase, Intimacao, Prazo, RegraId, Risco, Suspensao } from './mocks'
import {
  AGORA, DATA_BASE_ABERTA, EU, HOJE, datasBaseFechadas, intimacoesIniciais, motivosIniciais, pessoaPorId, prazosIniciais,
  processoPorCnj, processoPorId, processos, regraPorId, suspensoesIniciais,
} from './mocks'
import type { Calculo } from './prazos'
import { calcular, somarDias } from './prazos'

const copia = <T>(x: T): T => JSON.parse(JSON.stringify(x), (_k, v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) ? new Date(v) : v))

function inicial() {
  return {
    moduloLigado: true,
    antecedencia: 2,
    revisaoObrigatoria: true,
    leituraDoDomicilio: 'aviso' as 'aviso' | 'ciencia',
    intimacoes: copia(intimacoesIniciais),
    prazos: copia(prazosIniciais),
    suspensoes: copia(suspensoesIniciais),
    datasBase: copia(datasBaseFechadas) as DataBase[],
    dataBaseAberta: DATA_BASE_ABERTA,
    /** Risco e estimado atuais de cada processo, editáveis na tela do processo. */
    riscos: Object.fromEntries(processos.map(p => [p.id, { risco: p.data.risco, estimado: p.data.estimado }])) as Record<number, { risco: Risco, estimado: number }>,
    motivos: { ...motivosIniciais } as Record<number, string>,
    proximoId: 7100,
  }
}

export const estado = reactive(inicial())

export function reiniciarEstado() {
  Object.assign(estado, inicial())
}

/* ------------------------------------------------------------------ *
 * Prazos                                                              *
 * ------------------------------------------------------------------ */

export function calcularPrazo(p: Pick<Prazo, 'processo' | 'entrada'>): Calculo {
  const proc = processoPorId.get(p.processo)!
  return calcular({
    meio: p.entrada.meio,
    dia: p.entrada.dia,
    regra: regraPorId.get(p.entrada.regra)!,
    tribunal: proc.data.tribunal,
    suspensoes: estado.suspensoes,
    antecedencia: estado.antecedencia,
  })
}

/** Data da entrada do cálculo de uma intimação: a disponibilização (DJEN) ou a ciência (Domicílio). */
export function diaDeEntrada(i: Intimacao) {
  return i.meio === 'djen' ? i.dia : i.ciencia
}

export function confirmar(i: Intimacao, regra: RegraId, responsavel: number) {
  const proc = processoPorCnj.get(i.numeroCnj)
  const dia = diaDeEntrada(i)
  if (!proc || !dia) return
  const id = estado.proximoId++
  estado.prazos.unshift({
    id,
    reference: `TSK-${id}`,
    status: 'pending',
    assigned_to: responsavel,
    processo: proc.id,
    intimacao: i.id,
    entrada: { meio: i.meio, dia, regra },
    confirmadoPor: EU,
    confirmadoEm: new Date(AGORA),
    historico: [],
  })
  i.status = 'confirmada'
  i.regraSugerida = regra
}

export function descartar(i: Intimacao, motivo: string) {
  i.status = 'descartada'
  i.motivoDoDescarte = motivo
}

export function voltarParaRevisao(i: Intimacao) {
  i.status = 'revisar'
  i.motivoDoDescarte = undefined
  estado.prazos = estado.prazos.filter(p => p.intimacao !== i.id)
}

/** Abrir o teor de uma intimação do Domicílio registra a ciência hoje. */
export function registrarCiencia(i: Intimacao) {
  i.ciencia = HOJE
}

export function cumprir(p: Prazo) {
  p.status = p.status === 'completed' ? 'pending' : 'completed'
}

/** Muda o calendário e guarda, em cada prazo em aberto que mudou, o antes e o depois. */
function mudarCalendario(mudar: () => void, motivo: string) {
  const antes = new Map(estado.prazos.map(p => [p.id, calcularPrazo(p).fatal]))
  mudar()
  let mudou = 0
  for (const p of estado.prazos) {
    if (p.status === 'completed') continue
    const depois = calcularPrazo(p).fatal
    const a = antes.get(p.id)!
    if (a !== depois) {
      mudou++
      p.historico.unshift({ quando: new Date(AGORA), por: pessoaPorId.get(EU)!.nome, motivo, fatalAntes: a, fatalDepois: depois })
    }
  }
  return mudou
}

export function adicionarSuspensao(s: Omit<Suspensao, 'id'>, motivoDoHistorico: string) {
  return mudarCalendario(() => {
    estado.suspensoes.push({ ...s, id: Math.max(0, ...estado.suspensoes.map(x => x.id)) + 1 })
  }, motivoDoHistorico)
}

export function removerSuspensao(id: number, motivoDoHistorico: string) {
  return mudarCalendario(() => {
    estado.suspensoes = estado.suspensoes.filter(s => s.id !== id)
  }, motivoDoHistorico)
}

/* ------------------------------------------------------------------ *
 * Provisão                                                            *
 * ------------------------------------------------------------------ */

export const provisionado = (risco: Risco, estimado: number) => (risco === 'provavel' ? estimado : 0)

export function ultimaFechada() {
  return estado.datasBase.at(-1)!
}

export function fotoAnterior(processo: number) {
  return ultimaFechada().fotos.find(f => f.processo === processo)
}

/** Processos cujo risco ou valor mudou desde a última data-base fechada. */
export function mudancasDesdeAUltima() {
  return processos.filter((p) => {
    const f = fotoAnterior(p.id)
    const r = estado.riscos[p.id]!
    return !f || f.risco !== r.risco || f.estimado !== r.estimado
  })
}

export function fecharDataBase() {
  estado.datasBase.push({
    dia: estado.dataBaseAberta,
    fechadaEm: new Date(AGORA),
    fechadaPor: EU,
    fotos: processos.map(p => ({ processo: p.id, ...estado.riscos[p.id]! })),
    motivos: { ...estado.motivos },
  })
  estado.motivos = {}
  // A próxima data-base é o último dia do mês seguinte.
  const d = new Date(`${somarDias(estado.dataBaseAberta, 1)}T00:00:00Z`)
  estado.dataBaseAberta = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).toISOString().slice(0, 10)
}
