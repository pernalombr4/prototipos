/**
 * O motor de prazos do módulo Jurídico. Roda de verdade, sobre o mock, no navegador.
 *
 * É a peça que justifica o módulo: o resultado tem efeito jurídico (prazo perdido) e nenhuma configuração de hoje
 * o produz. O motor é o mesmo em todo país; o que muda por país é dado (as regras e o calendário do pacote).
 *
 * Regras do pacote Brasil usadas aqui (pesquisa de 2026-10-24, nota VAL §1 e §2):
 * - DJEN: a publicação é o 1º dia útil seguinte à disponibilização (Lei 11.419/2006, art. 4º, § 3º); a contagem
 *   começa no 1º dia útil seguinte à publicação (CPC, art. 224, § 3º);
 * - Domicílio Judicial Eletrônico: a contagem começa no 1º dia útil seguinte à ciência (CPC, art. 231, IX); sem
 *   leitura, a ciência é tácita 10 dias corridos depois do envio (Res. CNJ 455/2022);
 * - dias úteis pulam fim de semana, feriado nacional, feriado do tribunal, suspensão do tribunal e, em CPC, CLT e
 *   Juizado, o período de 20/12 a 20/01 (CPC, art. 220; CLT, art. 775-A);
 * - dias corridos: o prazo que termina em dia sem expediente vai para o 1º dia útil seguinte (CPC, art. 224, § 1º).
 *
 * As datas são texto `AAAA-MM-DD`, sem hora e sem fuso: o dia é o do tribunal. O fuso só entra na hora do fim do
 * prazo ("23:59 no horário de Manaus"), que é o defeito de hoje (prazo de tarefa calculado em UTC).
 */
import type { Regra, Suspensao, Tribunal, TribunalId } from './mocks'
import { feriadosNacionais, tribunais } from './mocks'

export type Dia = string

const UM_DIA = 86_400_000

export function paraData(d: Dia) {
  const [a, m, dia] = d.split('-').map(Number)
  return new Date(Date.UTC(a!, m! - 1, dia!))
}
export function paraDia(d: Date): Dia {
  return d.toISOString().slice(0, 10)
}
export function somarDias(d: Dia, n: number): Dia {
  return paraDia(new Date(paraData(d).getTime() + n * UM_DIA))
}
export function diaDaSemana(d: Dia) {
  return paraData(d).getUTCDay()
}
export function diferencaEmDias(de: Dia, ate: Dia) {
  return Math.round((paraData(ate).getTime() - paraData(de).getTime()) / UM_DIA)
}

export type TipoDeDiaSemExpediente = 'fimDeSemana' | 'nacional' | 'tribunal' | 'suspensao' | 'recesso'

export interface DiaSemExpediente {
  dia: Dia
  tipo: TipoDeDiaSemExpediente
  /** O nome do feriado ou o motivo da suspensão. Vazio no fim de semana e no recesso. */
  motivo: string
  /** De onde veio: lei, provimento, portaria. */
  fonte: string
}

function noRecesso(d: Dia) {
  const md = d.slice(5)
  return md >= '12-20' || md <= '01-20'
}

/** Por que o dia não conta. `undefined` quando é dia útil. */
export function semExpediente(d: Dia, tribunal: Tribunal, suspensoes: Suspensao[], comRecesso: boolean): DiaSemExpediente | undefined {
  const s = suspensoes.find(x => x.dia === d && x.tribunal === tribunal.id)
  if (s) return { dia: d, tipo: 'suspensao', motivo: s.motivo, fonte: s.fonte }
  const l = tribunal.feriados.find(x => x.dia === d)
  if (l) return { dia: d, tipo: 'tribunal', motivo: l.nome, fonte: l.fonte }
  const n = feriadosNacionais.find(x => x.dia === d)
  if (n) return { dia: d, tipo: 'nacional', motivo: n.nome, fonte: n.fonte }
  const ds = diaDaSemana(d)
  if (ds === 0 || ds === 6) return { dia: d, tipo: 'fimDeSemana', motivo: '', fonte: '' }
  if (comRecesso && noRecesso(d)) return { dia: d, tipo: 'recesso', motivo: '', fonte: 'CPC, art. 220' }
  return undefined
}

function proximoUtil(d: Dia, tribunal: Tribunal, suspensoes: Suspensao[], comRecesso: boolean, pulados: DiaSemExpediente[]) {
  let x = somarDias(d, 1)
  for (let i = 0; i < 400; i++) {
    const motivo = semExpediente(x, tribunal, suspensoes, comRecesso)
    if (!motivo) return x
    pulados.push(motivo)
    x = somarDias(x, 1)
  }
  return x
}

/** Por onde o tribunal comunicou. `portal`: intimação no sistema do tribunal, que também se aperfeiçoa pela ciência. */
export type Meio = 'djen' | 'domicilio' | 'portal'

export interface Entrada {
  meio: Meio
  /** DJEN: a data da disponibilização. Domicílio e portal: a data da ciência (na citação, a da confirmação). */
  dia: Dia
  /** Citação pelo Domicílio: o prazo começa depois do 5º dia útil seguinte à confirmação (CPC, art. 231, IX). */
  citacao?: boolean
  regra: Regra
  tribunal: TribunalId
  suspensoes: Suspensao[]
  /** Dias úteis de folga entre o prazo interno e o fatal. */
  antecedencia: number
}

export type ChaveDoPasso = 'disponibilizacao' | 'publicacao' | 'ciencia' | 'confirmacao' | 'quintoDia' | 'inicio' | 'contagem' | 'prorrogacao' | 'fatal' | 'interno'

export interface Passo {
  chave: ChaveDoPasso
  dia: Dia
  fundamento: string
}

export interface Calculo {
  passos: Passo[]
  inicio: Dia
  fatal: Dia
  interno: Dia
  /** Dias sem expediente dentro da contagem, sem os fins de semana. É o que a pessoa confere. */
  pulados: DiaSemExpediente[]
  /** Quantos fins de semana caíram dentro da contagem (só para o resumo). */
  finsDeSemana: number
  /** O fim do prazo no relógio do tribunal. */
  fuso: string
  /** Assinatura do cálculo: muda quando qualquer entrada muda. Serve para o histórico de recálculo. */
  assinatura: string
}

export function calcular(e: Entrada): Calculo {
  const tribunal = tribunais[e.tribunal]
  const comRecesso = e.regra.rito !== 'cpp' && e.regra.rito !== 'adm'
  const pulados: DiaSemExpediente[] = []
  const passos: Passo[] = []

  let inicio: Dia
  if (e.meio === 'djen') {
    passos.push({ chave: 'disponibilizacao', dia: e.dia, fundamento: 'Res. CNJ 455/2022, art. 11' })
    const publicacao = proximoUtil(e.dia, tribunal, e.suspensoes, comRecesso, [])
    passos.push({ chave: 'publicacao', dia: publicacao, fundamento: 'Lei 11.419/2006, art. 4º, § 3º' })
    inicio = proximoUtil(publicacao, tribunal, e.suspensoes, comRecesso, [])
  }
  else if (e.citacao) {
    // O 5º dia útil depois da confirmação é o dia do começo e fica fora da contagem (Consulta CNJ 0008391-94.2025).
    passos.push({ chave: 'confirmacao', dia: e.dia, fundamento: 'CPC, art. 246, § 1º-A' })
    let quinto = e.dia
    for (let i = 0; i < 5; i++) quinto = proximoUtil(quinto, tribunal, e.suspensoes, comRecesso, [])
    passos.push({ chave: 'quintoDia', dia: quinto, fundamento: 'CPC, art. 231, IX' })
    inicio = proximoUtil(quinto, tribunal, e.suspensoes, comRecesso, [])
  }
  else {
    passos.push({ chave: 'ciencia', dia: e.dia, fundamento: e.meio === 'portal' ? 'Lei 11.419/2006, art. 5º' : 'Res. CNJ 455/2022, art. 20' })
    inicio = proximoUtil(e.dia, tribunal, e.suspensoes, comRecesso, [])
  }
  passos.push({ chave: 'inicio', dia: inicio, fundamento: 'CPC, art. 224, § 3º' })

  let fatal = inicio
  let finsDeSemana = 0
  if (e.regra.unidade === 'uteis') {
    let contados = 1
    while (contados < e.regra.dias) {
      fatal = somarDias(fatal, 1)
      const motivo = semExpediente(fatal, tribunal, e.suspensoes, comRecesso)
      if (motivo) {
        if (motivo.tipo === 'fimDeSemana') finsDeSemana++
        else pulados.push(motivo)
        continue
      }
      contados++
    }
    passos.push({ chave: 'contagem', dia: fatal, fundamento: e.regra.fundamento })
  }
  else {
    fatal = somarDias(inicio, e.regra.dias - 1)
    passos.push({ chave: 'contagem', dia: fatal, fundamento: e.regra.fundamento })
    const motivo = semExpediente(fatal, tribunal, e.suspensoes, false)
    if (motivo) {
      if (motivo.tipo !== 'fimDeSemana') pulados.push(motivo)
      fatal = proximoUtil(fatal, tribunal, e.suspensoes, false, pulados)
      passos.push({ chave: 'prorrogacao', dia: fatal, fundamento: 'CPC, art. 224, § 1º' })
    }
  }
  passos.push({ chave: 'fatal', dia: fatal, fundamento: '' })

  let interno = fatal
  for (let i = 0; i < e.antecedencia;) {
    interno = somarDias(interno, -1)
    if (!semExpediente(interno, tribunal, e.suspensoes, comRecesso)) i++
  }
  if (interno < inicio) interno = inicio
  passos.push({ chave: 'interno', dia: interno, fundamento: '' })

  return {
    passos,
    inicio,
    fatal,
    interno,
    pulados: pulados.filter(p => p.tipo !== 'fimDeSemana'),
    finsDeSemana,
    fuso: tribunal.fuso,
    assinatura: `${fatal}|${interno}`,
  }
}

/** A ciência tácita do Domicílio e do portal: 10 dias corridos depois do envio, sem leitura. */
export function cienciaTacita(envio: Dia) {
  return somarDias(envio, 10)
}

/** O limite para confirmar a citação no Domicílio: 3 dias úteis depois do envio (CPC, art. 246, § 1º-A). */
export function limiteDaCitacao(envio: Dia, tribunal: TribunalId) {
  let d = envio
  for (let i = 0; i < 3; i++) d = proximoUtil(d, tribunais[tribunal], [], true, [])
  return d
}
