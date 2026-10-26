/**
 * O estado em memória do protótipo "Módulo Jurídico". Recarregar a página volta ao começo.
 *
 * Um objeto só, compartilhado pelas telas, porque a mesma intimação confirmada aparece na caixa de intimações, na
 * lista de prazos e na tela do processo.
 */
import { reactive } from 'vue'
import type { DataBase, Intimacao, Prazo, Processo, RegraId, Risco, Suspensao } from './mocks'
import {
  AGORA, DATA_BASE_ABERTA, EU, HOJE, datasBaseFechadas, motivosIniciais, pessoaPorId, prazosIniciais,
  processoPorCnj, processoPorId, processos, regraPorId, suspensoesIniciais,
} from './mocks'
import type { Calculo } from './prazos'
import { calcular, somarDias } from './prazos'
import type { Termo } from './capturas'
import { capturasIniciais, termosIniciais } from './capturas'

const copia = <T>(x: T): T => JSON.parse(JSON.stringify(x), (_k, v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v) ? new Date(v) : v))

function inicial() {
  return {
    moduloLigado: true,
    /** O submódulo Capturas (rodada 3). Sem ele ligado, o menu Jurídico some. */
    capturasLigado: true,
    antecedencia: 2,
    revisaoObrigatoria: true,
    leituraDoDomicilio: 'aviso' as 'aviso' | 'ciencia',
    // Rodada 3: as intimações viraram capturas (intimação, citação, distribuição e andamento).
    intimacoes: copia(capturasIniciais) as Intimacao[],
    termos: copia(termosIniciais) as Termo[],
    /** Captura ligada à mão a um processo (sem número CNJ igual no workspace). */
    vinculos: {} as Record<number, number>,
    /** Responsável escolhido na caixa. Sem escolha, vale o responsável do processo ou a fila. */
    responsaveis: {} as Record<number, number>,
    /** Processos cadastrados a partir de uma distribuição. */
    criados: [] as number[],
    duplicidade: 'oficial' as 'oficial' | 'maisCedo',
    andamentosDireto: true,
    atribuicao: { semProcesso: 15, trabalhista: 13, outras: 12 },
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
  // Os processos cadastrados a partir de uma distribuição saem da categoria.
  for (const id of estado.criados) {
    const p = processoPorId.get(id)
    if (!p) continue
    processos.splice(processos.indexOf(p), 1)
    processoPorId.delete(id)
    processoPorCnj.delete(p.data.numeroCnj)
  }
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
    citacao: p.entrada.citacao,
    regra: regraPorId.get(p.entrada.regra)!,
    tribunal: proc.data.tribunal,
    suspensoes: estado.suspensoes,
    antecedencia: estado.antecedencia,
  })
}

/** Data da entrada do cálculo de uma intimação: a disponibilização (DJEN) ou a ciência (Domicílio e portal). */
export function diaDeEntrada(i: Intimacao) {
  return i.meio === 'djen' ? i.dia : i.ciencia
}

/** A entrada do cálculo, com a regra de duplicidade: a data oficial, ou a mais cedo quando outro meio veio antes. */
export function entradaDa(i: Intimacao): { meio: 'djen' | 'domicilio' | 'portal', dia: string, citacao?: boolean } | undefined {
  if (i.meio !== 'djen' && i.meio !== 'domicilio' && i.meio !== 'portal') return undefined
  const dia = diaDeEntrada(i)
  if (!dia) return undefined
  const oficial = { meio: i.meio, dia, citacao: i.tipo === 'citacao' && i.meio === 'domicilio' }
  if (estado.duplicidade === 'maisCedo' && i.outroMeio && i.outroMeio.ciencia < dia) return { meio: 'portal', dia: i.outroMeio.ciencia }
  return oficial
}

/* ------------------------------------------------------------------ *
 * Capturas (rodada 3)                                                 *
 * ------------------------------------------------------------------ */

export function processoDaCaptura(i: Intimacao): Processo | undefined {
  const v = estado.vinculos[i.id]
  return v ? processoPorId.get(v) : processoPorCnj.get(i.numeroCnj)
}

export function responsavelDa(i: Intimacao): number {
  const escolhido = estado.responsaveis[i.id]
  if (escolhido) return escolhido
  const p = processoDaCaptura(i)
  if (p) return p.data.responsavel
  if (i.tipo === 'distribuicao') return i.tribunal.startsWith('trt') ? estado.atribuicao.trabalhista : estado.atribuicao.outras
  return estado.atribuicao.semProcesso
}

export function tratar(i: Intimacao) {
  i.status = 'confirmada'
  i.tratadaPor = EU
}

export function vincular(i: Intimacao, processo: number) {
  estado.vinculos[i.id] = processo
}

/** Cadastra o processo a partir da distribuição: o item nasce na categoria Processos, com os dados da captura. */
export function cadastrarProcesso(i: Intimacao): Processo | undefined {
  const d = i.distribuicao
  if (!d) return undefined
  const id = 4100 + processos.length
  const trabalhista = i.tribunal.startsWith('trt')
  const p: Processo = {
    id,
    reference: `PROC-${String(312 + processos.length).padStart(4, '0')}`,
    created_at: new Date(AGORA),
    status: 'active',
    titulo: `${d.autor} x ${d.reu.replace(/ (S\.A\.|Ltda\.)$/, '')}`,
    data: {
      numeroCnj: i.numeroCnj, tribunal: i.tribunal, orgao: i.orgao, rito: trabalhista ? 'clt' : 'cpc',
      area: trabalhista ? 'Trabalhista' : 'Cível', polo: 'Réu', parteContraria: d.autor, valorDaCausa: d.valor,
      responsavel: responsavelDa(i), escritorio: 'Interno', fase: 'Conhecimento', risco: 'possivel', estimado: 0,
    },
  }
  processos.push(p)
  processoPorId.set(p.id, p)
  processoPorCnj.set(p.data.numeroCnj, p)
  estado.riscos[p.id] = { risco: 'possivel', estimado: 0 }
  estado.criados.push(p.id)
  // O vínculo no estado reativo faz a caixa e o painel verem o processo novo (os mapas de `mocks.ts` não são reativos).
  estado.vinculos[i.id] = p.id
  tratar(i)
  return p
}

export function confirmar(i: Intimacao, regra: RegraId, responsavel: number) {
  const proc = processoDaCaptura(i)
  const entrada = entradaDa(i)
  if (!proc || !entrada) return
  const id = estado.proximoId++
  estado.prazos.unshift({
    id,
    reference: `TSK-${id}`,
    status: 'pending',
    assigned_to: responsavel,
    processo: proc.id,
    intimacao: i.id,
    entrada: { ...entrada, regra },
    confirmadoPor: EU,
    confirmadoEm: new Date(AGORA),
    historico: [],
  })
  i.status = 'confirmada'
  i.tratadaPor = EU
  i.regraSugerida = regra
}

export function descartar(i: Intimacao, motivo: string) {
  i.status = 'descartada'
  i.tratadaPor = EU
  i.motivoDoDescarte = motivo
}

export function voltarParaRevisao(i: Intimacao) {
  i.status = 'revisar'
  i.tratadaPor = undefined
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
