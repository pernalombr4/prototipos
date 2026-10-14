/**
 * As regras da tela "Meus relatórios": nome legível de cada pedido, status
 * da tela, filtros, formatação de data e tamanho.
 *
 * Tudo puro, sobre o mock em memória. Nenhuma chamada de rede.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Formato, PedidoDeRelatorio, StatusDoPedido } from './mocks'
import { AGORA, categorias } from './mocks'
import type { Textos } from './textos'

export type Periodo = 'todo' | 'hoje' | 'd7' | 'd30' | 'd90'

export interface FiltrosDaTela {
  busca: string
  periodo: Periodo
  status: StatusDoPedido[]
  origem: string[]
  formato: Formato[]
}

/** Id estável da origem, para filtrar: `c_items:108`, `tasks`. */
export function idDaOrigem(p: PedidoDeRelatorio): string {
  return p.data.unique_key === 'c_items' ? `c_items:${p.data.type}` : p.data.unique_key
}

/** Nome da origem como a pessoa conhece: a categoria ou a lista de tarefas. */
export function nomeDaOrigem(p: PedidoDeRelatorio, t: Textos): string {
  if (p.data.unique_key === 'c_items') return categorias.find(c => c.id === p.data.type)?.name ?? '?'
  return t.origens[p.data.unique_key]
}

export function iconeDaOrigem(p: PedidoDeRelatorio): string {
  if (p.data.unique_key === 'tasks') return 'i-lucide-clipboard-list'
  if (p.data.unique_key === 'c_flow_item_tasks') return 'i-lucide-calendar-check'
  return categorias.find(c => c.id === p.data.type)?.icon ?? 'i-lucide-file-text'
}

/** Opções do filtro "Origem", só com o que existe na lista. */
export function origensDaLista(lista: PedidoDeRelatorio[], t: Textos) {
  const vistos = new Map<string, { value: string, label: string, icon: string }>()
  for (const p of lista) {
    const id = idDaOrigem(p)
    if (!vistos.has(id)) vistos.set(id, { value: id, label: nomeDaOrigem(p, t), icon: iconeDaOrigem(p) })
  }
  return [...vistos.values()].sort((a, b) => a.label.localeCompare(b.label))
}

export const ICONE_DO_FORMATO: Record<Formato, string> = {
  xlsx: 'i-lucide-file-spreadsheet',
  csv: 'i-lucide-file-text',
  dbf: 'i-lucide-database',
}

/** Cor semântica do formato. Só token, nunca hex. */
export const COR_DO_FORMATO: Record<Formato, 'success' | 'info' | 'neutral'> = {
  xlsx: 'success',
  csv: 'info',
  dbf: 'neutral',
}

export const ICONE_DO_STATUS: Record<StatusDoPedido, string> = {
  pending: 'i-lucide-clock',
  processing: 'i-lucide-loader-circle',
  complete: 'i-lucide-circle-check',
  error: 'i-lucide-circle-alert',
}

export const COR_DO_STATUS: Record<StatusDoPedido, 'neutral' | 'info' | 'success' | 'error'> = {
  pending: 'neutral',
  processing: 'info',
  complete: 'success',
  error: 'error',
}

/** Nome do relatório: o do modelo do construtor, ou Relatório Padrão. */
export function nomeDoRelatorio(p: PedidoDeRelatorio, t: Textos): string {
  return p.report?.name ?? t.modeloPadrao
}

/**
 * Nome do arquivo proposto: origem, nome do modelo (quando não é o padrão), data e hora.
 * Hoje o arquivo baixa como `default_1vo8sbnlud.xlsx`.
 */
export function nomeDoArquivo(p: PedidoDeRelatorio, t: Textos): string {
  const limpar = (s: string) => s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 40).replace(/-$/, '')
  const d = new Date(p.created_at)
  const dois = (n: number) => String(n).padStart(2, '0')
  const carimbo = `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}-${dois(d.getHours())}${dois(d.getMinutes())}`
  const origem = limpar(nomeDaOrigem(p, t))
  const modelo = p.report ? limpar(p.report.name) : ''
  const partes = modelo ? [origem, modelo, carimbo] : [origem, carimbo]
  return `${partes.join('_')}.${p.extraction_format}`
}

/** Tamanho em KB (como a API devolve) para texto. */
export function tamanho(kb: number, idioma: Idioma): string {
  const fmt = (n: number, casas: number) => n.toLocaleString(idioma, { maximumFractionDigits: casas, minimumFractionDigits: casas })
  if (kb < 1) return `${Math.max(1, Math.round(kb * 1024))} B`
  if (kb < 1024) return `${fmt(kb, kb < 10 ? 1 : 0)} KB`
  return `${fmt(kb / 1024, 1)} MB`
}

function hora(d: Date, idioma: Idioma) {
  return d.toLocaleTimeString(idioma, { hour: '2-digit', minute: '2-digit' })
}

/** "Hoje, 15:20", "Ontem, 17:31" ou "09/10/2026, 14:12". */
export function dataCurta(iso: string, t: Textos, idioma: Idioma): string {
  const d = new Date(iso)
  const dia = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const diff = Math.round((dia(AGORA) - dia(d)) / 86400000)
  if (diff === 0) return t.data.hoje(hora(d, idioma))
  if (diff === 1) return t.data.ontem(hora(d, idioma))
  return `${d.toLocaleDateString(idioma, { day: '2-digit', month: '2-digit', year: 'numeric' })}, ${hora(d, idioma)}`
}

/** Data com segundos, para o histórico. */
export function dataLonga(iso: string, idioma: Idioma): string {
  const d = new Date(iso)
  return `${d.toLocaleDateString(idioma, { day: '2-digit', month: '2-digit', year: 'numeric' })}, ${d.toLocaleTimeString(idioma, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
}

export function relativo(iso: string, t: Textos, agora: Date): string {
  const min = Math.floor((agora.getTime() - new Date(iso).getTime()) / 60000)
  if (min < 1) return t.data.agora
  if (min < 60) return t.data.haMin(min)
  return t.data.haH(Math.floor(min / 60))
}

export function segundosParaGerar(p: PedidoDeRelatorio): number {
  return Math.max(1, Math.round((new Date(p.updated_at).getTime() - new Date(p.created_at).getTime()) / 1000))
}

const DIAS: Record<Periodo, number> = { todo: Infinity, hoje: 0, d7: 7, d30: 30, d90: 90 }

function dentroDoPeriodo(p: PedidoDeRelatorio, periodo: Periodo): boolean {
  if (periodo === 'todo') return true
  const d = new Date(p.created_at)
  const inicio = new Date(AGORA.getFullYear(), AGORA.getMonth(), AGORA.getDate())
  inicio.setDate(inicio.getDate() - DIAS[periodo])
  return d >= inicio
}

/** Texto que a busca procura: nome e descrição do relatório, origem, visualização, arquivo e filtros. */
function textoDeBusca(p: PedidoDeRelatorio, t: Textos): string {
  return [
    nomeDaOrigem(p, t),
    p.proto.visualizacao,
    p.report?.name ?? t.modeloPadrao,
    p.report?.description ?? '',
    nomeDoArquivo(p, t),
    ...p.proto.filtros.map(f => `${f.campo} ${f.valor}`),
  ].join(' ').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export function filtrar(lista: PedidoDeRelatorio[], f: FiltrosDaTela, t: Textos): PedidoDeRelatorio[] {
  const termo = f.busca.trim().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  return lista.filter(p =>
    (!termo || textoDeBusca(p, t).includes(termo))
    && dentroDoPeriodo(p, f.periodo)
    && (!f.status.length || f.status.includes(p.status))
    && (!f.origem.length || f.origem.includes(idDaOrigem(p)))
    && (!f.formato.length || f.formato.includes(p.extraction_format)),
  )
}
