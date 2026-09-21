/**
 * As regras do quadro, fora do componente: agrupar, ordenar, calcular e ler prazo.
 *
 * Tudo roda em memória, sobre o array do `mocks.ts`. Nenhuma chamada de rede
 * (regra 4). O que muda aqui é o que o back precisaria passar a aceitar em
 * `GET /tasks`: `_sort`, `status`, `priority`, `assigned_to`, `points_gte`.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import type { EnKanbanColorScheme } from '@be-enlighten/enspace-sdk-ui/base'
import type { CampoDeFormulario } from './mocks'
import { estimativaDeTempo, etiquetas, hoje, pessoas, registrosDeTempo } from './mocks'
import type { Textos } from './textos'

/* ----------------------------- agrupamento ----------------------------- */

/** Campos que o quadro aceita como raia. O produto hoje só aceita os três primeiros. */
export type ChaveAgrupamento = 'status' | 'priority' | 'assigned_to' | 'type' | 'due_date'

export interface DefinicaoDeRaia {
  valor: string
  rotulo: string
  cor: EnKanbanColorScheme
  icone: string
}

export const ordemStatus: Task['status'][] = ['pending', 'working', 'blocked', 'completed']
export const ordemPrioridade: Task['priority'][] = ['urgent', 'high', 'normal', 'low']

const corDoStatus: Record<Task['status'], EnKanbanColorScheme> = {
  pending: 'info',
  working: 'warning',
  blocked: 'error',
  completed: 'success',
}

const iconeDoStatus: Record<Task['status'], string> = {
  pending: 'i-lucide-circle-dashed',
  working: 'i-lucide-circle-dot-dashed',
  blocked: 'i-lucide-circle-pause',
  completed: 'i-lucide-circle-check',
}

export const corDaPrioridade: Record<Task['priority'], EnKanbanColorScheme> = {
  urgent: 'error',
  high: 'warning',
  normal: 'neutral',
  low: 'info',
}

export const iconeDaPrioridade: Record<Task['priority'], string> = {
  urgent: 'i-lucide-chevrons-up',
  high: 'i-lucide-chevron-up',
  normal: 'i-lucide-minus',
  low: 'i-lucide-chevron-down',
}

export const iconeDoTipo: Record<Task['type'], string> = {
  crud: 'i-lucide-square-pen',
  form: 'i-lucide-clipboard-list',
  generic: 'i-lucide-circle-small',
  approval: 'i-lucide-gavel',
  start: 'i-lucide-play',
}

/** Monta as raias do agrupamento escolhido, na ordem em que aparecem. */
export function raiasDoAgrupamento(chave: ChaveAgrupamento, t: Textos): DefinicaoDeRaia[] {
  if (chave === 'status') {
    return ordemStatus.map(s => ({
      valor: s,
      rotulo: t.status[s],
      cor: corDoStatus[s],
      icone: iconeDoStatus[s],
    }))
  }
  if (chave === 'priority') {
    return ordemPrioridade.map(p => ({
      valor: p,
      rotulo: t.prioridade[p],
      cor: corDaPrioridade[p],
      icone: iconeDaPrioridade[p],
    }))
  }
  if (chave === 'type') {
    return (['crud', 'form', 'generic', 'approval'] as Task['type'][]).map(tp => ({
      valor: tp,
      rotulo: t.tipo[tp],
      cor: 'neutral' as EnKanbanColorScheme,
      icone: iconeDoTipo[tp],
    }))
  }
  if (chave === 'assigned_to') {
    const lista: DefinicaoDeRaia[] = Object.values(pessoas).map(p => ({
      valor: String(p.id),
      rotulo: p.fullname,
      cor: 'primary' as EnKanbanColorScheme,
      icone: 'i-lucide-user',
    }))
    lista.push({ valor: 'sem', rotulo: t.semResponsavel, cor: 'neutral', icone: 'i-lucide-user-x' })
    return lista
  }
  // due_date: faixas de prazo, que é o agrupamento que o produto não tem hoje.
  return [
    { valor: 'atrasada', rotulo: t.calculos.atrasadas, cor: 'error', icone: 'i-lucide-alarm-clock' },
    { valor: 'hoje', rotulo: t.venceHoje, cor: 'warning', icone: 'i-lucide-calendar-clock' },
    { valor: 'semana', rotulo: t.venceEmDias(7), cor: 'info', icone: 'i-lucide-calendar-days' },
    { valor: 'depois', rotulo: t.venceEmDias(30), cor: 'neutral', icone: 'i-lucide-calendar' },
    { valor: 'sem', rotulo: t.semPrazo, cor: 'neutral', icone: 'i-lucide-calendar-off' },
  ]
}

/** Em que raia a tarefa cai, dado o agrupamento. */
export function raiaDaTarefa(tarefa: Task, chave: ChaveAgrupamento): string {
  if (chave === 'status') return tarefa.status
  if (chave === 'priority') return tarefa.priority
  if (chave === 'type') return tarefa.type
  if (chave === 'assigned_to') return tarefa.assigned_to ? String(tarefa.assigned_to) : 'sem'
  const dias = diasAteOPrazo(tarefa)
  if (dias === null) return 'sem'
  if (dias < 0) return 'atrasada'
  if (dias === 0) return 'hoje'
  if (dias <= 7) return 'semana'
  return 'depois'
}

/* ------------------------------ ordenação ------------------------------ */

export type ChaveOrdenacao =
  | 'due_date' | 'priority' | 'points' | 'created_at' | 'updated_at' | 'name'

export const ordenacoes: { valor: ChaveOrdenacao, rotulo: keyof Textos['campos'] }[] = [
  { valor: 'due_date', rotulo: 'prazo' },
  { valor: 'priority', rotulo: 'prioridade' },
  { valor: 'points', rotulo: 'pontos' },
  { valor: 'created_at', rotulo: 'criadoEm' },
  { valor: 'updated_at', rotulo: 'atualizadoEm' },
  { valor: 'name', rotulo: 'nome' },
]

const pesoDaPrioridade: Record<Task['priority'], number> = { urgent: 0, high: 1, normal: 2, low: 3 }

export function compararTarefas(a: Task, b: Task, chave: ChaveOrdenacao, desc: boolean): number {
  let r = 0
  switch (chave) {
    case 'due_date': {
      const da = a.due_date ? new Date(a.due_date).getTime() : Number.POSITIVE_INFINITY
      const db = b.due_date ? new Date(b.due_date).getTime() : Number.POSITIVE_INFINITY
      r = da - db
      break
    }
    case 'priority':
      r = pesoDaPrioridade[a.priority] - pesoDaPrioridade[b.priority]
      break
    case 'points':
      r = (b.points ?? 0) - (a.points ?? 0)
      break
    case 'created_at':
      r = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      break
    case 'updated_at':
      r = new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      break
    case 'name':
      r = a.name.localeCompare(b.name, 'pt-BR')
      break
  }
  return desc ? -r : r
}

/* -------------------------------- prazo -------------------------------- */

/** Dias inteiros até o prazo. Negativo quer dizer atrasada. `null` é sem prazo. */
export function diasAteOPrazo(tarefa: Task, referencia: Date = hoje): number | null {
  if (!tarefa.due_date) return null
  const prazo = new Date(tarefa.due_date)
  const a = Date.UTC(prazo.getUTCFullYear(), prazo.getUTCMonth(), prazo.getUTCDate())
  const b = Date.UTC(referencia.getUTCFullYear(), referencia.getUTCMonth(), referencia.getUTCDate())
  return Math.round((a - b) / 86_400_000)
}

export function estaAtrasada(tarefa: Task, referencia: Date = hoje): boolean {
  if (tarefa.status === 'completed') return false
  const dias = diasAteOPrazo(tarefa, referencia)
  return dias !== null && dias < 0
}

export interface PrazoLegivel {
  texto: string
  cor: 'error' | 'warning' | 'neutral'
  urgente: boolean
}

export function prazoLegivel(tarefa: Task, t: Textos): PrazoLegivel {
  const dias = diasAteOPrazo(tarefa)
  if (dias === null) return { texto: t.semPrazo, cor: 'neutral', urgente: false }
  if (tarefa.status === 'completed') {
    return { texto: formatarData(tarefa.due_date as Date), cor: 'neutral', urgente: false }
  }
  if (dias < 0) return { texto: t.atrasadaDias(Math.abs(dias)), cor: 'error', urgente: true }
  if (dias === 0) return { texto: t.venceHoje, cor: 'warning', urgente: true }
  if (dias === 1) return { texto: t.venceAmanha, cor: 'warning', urgente: false }
  if (dias <= 7) return { texto: t.venceEmDias(dias), cor: 'neutral', urgente: false }
  return { texto: formatarData(tarefa.due_date as Date), cor: 'neutral', urgente: false }
}

export function formatarData(data: Date | string | null | undefined): string {
  if (!data) return ''
  const d = new Date(data)
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`
}

export function formatarDataHora(data: Date | string | null | undefined): string {
  if (!data) return ''
  const d = new Date(data)
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  return `${formatarData(d)}, ${hh}:${mm}`
}

/* ----------------------------- calculadora ----------------------------- */

/**
 * O totalizador soma CAMPO por OPERAÇÃO, não um cálculo fechado.
 *
 * Que campo pode entrar, e de onde ele vem:
 *
 *  - **`points`**, o único número que a própria tarefa carrega (`EnlNumber`);
 *  - **as respostas numéricas do formulário da tarefa**, em `meta.form_result`.
 *    A definição vem junto, em `meta.form`, então dá para saber quais respostas
 *    são numéricas sem chamada nenhuma: são os campos `type: 'EnlNumber'`.
 *    **Dinheiro não é um tipo à parte no ENSPACE**: é um `EnlNumber` com
 *    `cFormat.n_style: 'currency'`, e é isso que decide se o total sai como
 *    `R$ 12.340,50` ou como `12.340,5`;
 *  - **contagens derivadas** (tarefas, atrasadas, sem responsável) e **datas**
 *    (prazo mais próximo), que não são campo mas respondem à mesma pergunta.
 *
 * O que NÃO dá para somar só com o payload da tarefa: qualquer campo numérico
 * do **item** (o chamado ou a demanda). A tarefa carrega só `item` e
 * `meta.itemReference`; o valor mora em `GET /ws/types/{slug}/items/{reference}`.
 * Está declarado no DECISOES.md.
 */
export type Operacao = 'soma' | 'media' | 'minimo' | 'maximo' | 'preenchidos'

export const operacoesNumericas: Operacao[] = ['soma', 'media', 'minimo', 'maximo', 'preenchidos']

export interface CampoCalculavel {
  /** `points`, `form:<refId>`, ou uma das chaves derivadas. */
  chave: string
  rotulo: string
  tipo: 'numero' | 'moeda' | 'contagem' | 'data' | 'duracao'
  origem: 'tarefa' | 'formulario' | 'derivado'
  cFormat?: CampoDeFormulario['cFormat']
}

export interface Calculo {
  campo: string
  operacao: Operacao
}

export const calculoPadrao: Calculo = { campo: 'points', operacao: 'soma' }

/** Os campos derivados, que não são campo do payload mas todo quadro quer. */
function camposDerivados(t: Textos): CampoCalculavel[] {
  return [
    { chave: 'contagem', rotulo: t.calculos.contagem, tipo: 'contagem', origem: 'derivado' },
    { chave: 'atrasadas', rotulo: t.calculos.atrasadas, tipo: 'contagem', origem: 'derivado' },
    { chave: 'semResponsavel', rotulo: t.calculos.semResponsavel, tipo: 'contagem', origem: 'derivado' },
    { chave: 'prazoMaisProximo', rotulo: t.calculos.prazoMaisProximo, tipo: 'data', origem: 'derivado' },
  ]
}

/**
 * Varre as tarefas carregadas e descobre que campos numéricos existem.
 * É o mesmo que o produto faria: a definição do formulário vem no payload.
 */
export function camposCalculaveis(tarefas: Task[], t: Textos): CampoCalculavel[] {
  const lista: CampoCalculavel[] = [
    { chave: 'points', rotulo: t.campos.pontos, tipo: 'numero', origem: 'tarefa' },
    { chave: 'tempo', rotulo: t.campos.tempoRegistrado, tipo: 'duracao', origem: 'tarefa' },
    { chave: 'estimativa', rotulo: t.campos.estimativa, tipo: 'duracao', origem: 'tarefa' },
  ]

  const vistos = new Set<string>()
  for (const tarefa of tarefas) {
    const meta = (tarefa.meta ?? {}) as Record<string, unknown>
    const definicao = Array.isArray(meta.form) ? meta.form as CampoDeFormulario[] : []
    for (const campo of definicao) {
      if (campo.type !== 'EnlNumber' || vistos.has(campo.refId)) continue
      vistos.add(campo.refId)
      lista.push({
        chave: `form:${campo.refId}`,
        rotulo: campo.label,
        tipo: campo.cFormat?.n_style === 'currency' || campo.cFormat?.type === 'currency' ? 'moeda' : 'numero',
        origem: 'formulario',
        cFormat: campo.cFormat,
      })
    }
  }

  return [...lista, ...camposDerivados(t)]
}

/** O valor numérico de uma tarefa para o campo escolhido, ou `null` se não tem. */
export function valorDoCampo(tarefa: Task, chave: string): number | null {
  if (chave === 'points') return tarefa.points ?? 0
  // Tempo vem de fora da tarefa: dos apontamentos e do campo novo de estimativa.
  if (chave === 'tempo') {
    const total = tempoRegistrado(tarefa.id)
    return total || null
  }
  if (chave === 'estimativa') {
    const total = estimativaDaTarefa(tarefa.id)
    return total || null
  }
  if (!chave.startsWith('form:')) return null
  const meta = (tarefa.meta ?? {}) as Record<string, unknown>
  const resultado = (meta.form_result ?? null) as Record<string, unknown> | null
  if (!resultado) return null
  const bruto = resultado[chave.slice(5)]
  const numero = typeof bruto === 'number' ? bruto : Number(bruto)
  return Number.isFinite(numero) ? numero : null
}

function formatarValor(numero: number, campo: CampoCalculavel): string {
  if (campo.tipo === 'duracao') return formatarDuracao(numero)
  const locale = campo.cFormat?.locale ?? 'pt-BR'
  if (campo.tipo === 'moeda') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: campo.cFormat?.moeda ?? 'BRL',
      currencyDisplay: campo.cFormat?.n_currencyDisplay ?? 'symbol',
      minimumFractionDigits: campo.cFormat?.n_minimumFractionDigits ?? 2,
    }).format(numero)
  }
  const casas = campo.cFormat?.n_minimumFractionDigits ?? 0
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: Number.isInteger(numero) && !casas ? 0 : casas,
    maximumFractionDigits: Math.max(casas, 1),
  }).format(numero)
}

export interface ResultadoDoCalculo {
  valor: string
  /** Quando o número pede atenção, o rodapé acende. */
  alerta: boolean
  /** Quantas tarefas da raia têm esse campo preenchido, e quantas são. */
  cobertura?: { com: number, total: number }
}

export function calcular(
  tarefas: Task[],
  calculo: Calculo,
  campo: CampoCalculavel | undefined,
  t: Textos,
): ResultadoDoCalculo {
  if (!campo) return { valor: '', alerta: false }

  if (campo.origem === 'derivado') {
    if (!tarefas.length) return { valor: '0', alerta: false }
    if (campo.chave === 'contagem') return { valor: String(tarefas.length), alerta: false }
    if (campo.chave === 'atrasadas') {
      const n = tarefas.filter(x => estaAtrasada(x)).length
      return { valor: String(n), alerta: n > 0 }
    }
    if (campo.chave === 'semResponsavel') {
      const n = tarefas.filter(x => !x.assigned_to).length
      return { valor: String(n), alerta: n > 0 }
    }
    const comPrazo = tarefas
      .filter(x => x.due_date && x.status !== 'completed')
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    const primeira = comPrazo[0]
    if (!primeira) return { valor: t.semPrazo, alerta: false }
    return { valor: formatarData(primeira.due_date as Date), alerta: estaAtrasada(primeira) }
  }

  const valores = tarefas
    .map(x => valorDoCampo(x, campo.chave))
    .filter((v): v is number => v !== null)

  const cobertura = { com: valores.length, total: tarefas.length }

  if (calculo.operacao === 'preenchidos') {
    return { valor: String(valores.length), alerta: false, cobertura }
  }
  if (!valores.length) return { valor: '', alerta: false, cobertura }

  let numero: number
  switch (calculo.operacao) {
    case 'media': numero = valores.reduce((a, b) => a + b, 0) / valores.length; break
    case 'minimo': numero = Math.min(...valores); break
    case 'maximo': numero = Math.max(...valores); break
    default: numero = valores.reduce((a, b) => a + b, 0)
  }
  return { valor: formatarValor(numero, campo), alerta: false, cobertura }
}

/* --------------------------------- tempo --------------------------------- */

/**
 * O tempo, no formato do ClickUp: `2h 15m`, `45m`, `3h`. Sem segundos, porque
 * segundo em cartão não ajuda ninguém, e sem zero à esquerda.
 */
export function formatarDuracao(segundos: number): string {
  if (!segundos) return '0m'
  const horas = Math.floor(segundos / 3600)
  const minutos = Math.round((segundos % 3600) / 60)
  if (horas && minutos) return `${horas}h ${minutos}m`
  if (horas) return `${horas}h`
  return `${minutos}m`
}

/** Com segundos, para o cronômetro em andamento. */
export function formatarCronometro(segundos: number): string {
  const h = Math.floor(segundos / 3600)
  const m = Math.floor((segundos % 3600) / 60)
  const s = Math.floor(segundos % 60)
  const dois = (n: number) => String(n).padStart(2, '0')
  return h ? `${h}:${dois(m)}:${dois(s)}` : `${m}:${dois(s)}`
}

/**
 * Lê o que a pessoa digitou. O ClickUp aceita as três formas, e as três
 * entram aqui: `1h 30m`, `90m`, `1:30`, `2h`, e número solto vira minuto.
 */
export function interpretarDuracao(texto: string): number {
  const limpo = texto.trim().toLowerCase()
  if (!limpo) return 0

  const relogio = limpo.match(/^(\d{1,3}):(\d{1,2})$/)
  if (relogio) return Number(relogio[1]) * 3600 + Number(relogio[2]) * 60

  let total = 0
  let achou = false
  for (const parte of limpo.matchAll(/(\d+(?:[.,]\d+)?)\s*(h|m)/g)) {
    const valor = Number(String(parte[1]).replace(',', '.'))
    total += parte[2] === 'h' ? valor * 3600 : valor * 60
    achou = true
  }
  if (achou) return Math.round(total)

  const numero = Number(limpo.replace(',', '.'))
  return Number.isFinite(numero) ? Math.round(numero * 60) : 0
}

/** Soma dos apontamentos de uma tarefa. */
export function tempoRegistrado(idDaTarefa: number, extras: typeof registrosDeTempo = []): number {
  return [...registrosDeTempo, ...extras]
    .filter(r => r.tarefa === idDaTarefa)
    .reduce((soma, r) => soma + r.segundos, 0)
}

export function estimativaDaTarefa(idDaTarefa: number): number {
  return estimativaDeTempo[idDaTarefa] ?? 0
}

/* ------------------------------- auxiliares ------------------------------- */

/** A descrição chega em HTML. No cartão ela vira texto puro, de uma linha. */
export function descricaoEmTexto(html: string | null | undefined): string {
  if (!html) return ''
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

/** A referência tem 32 caracteres. Ninguém lê 32 caracteres num cartão. */
export function referenciaCurta(reference: string): string {
  return reference.slice(0, 6).toUpperCase()
}

export function etiquetasDaTarefa(tarefa: Task) {
  const ids = Array.isArray(tarefa.tag_ids) ? tarefa.tag_ids as number[] : []
  return ids.map(id => etiquetas[id]).filter(Boolean)
}
