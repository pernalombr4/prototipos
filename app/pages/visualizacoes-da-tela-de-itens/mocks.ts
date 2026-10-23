/**
 * Dado do protótipo: uma categoria Contratos com 48 itens e as visualizações
 * personalizadas dela. Tudo inventado; a ESTRUTURA vem do develop (branch do
 * PR 2936, tela nova de itens, 23/10/2026) e do schema `ModelView` do
 * `@be-enlighten/enspace-sdk-schemas`.
 *
 * Do `ModelView` vêm: `reference`, `name`, `description`, `icon`,
 * `model_type` (table | kanban), `default`, `config.columns`, `config.groupBy`,
 * `config.defaultColumnSortField`, `config.sortOrder`, `config.hide`,
 * `filters.field_filters`, `filters.quick_filters` (isOwner, inGroups),
 * `user`, `module_groups` e `roles`.
 *
 * Inventado pelo protótipo (marcado em cada lugar):
 * - `config.sorts`: ordenação em vários níveis. Hoje o schema guarda 1 campo só;
 * - `fixada` e a ordem da barra: são da pessoa, não da visualização;
 * - `contagem`: calculada no navegador, a API não manda.
 */
import type { ModelView } from '@be-enlighten/enspace-sdk-schemas'

export const workspace = { name: 'Aurora Serviços', reference: 'aurora-servicos' }
export const categoria = { name: 'Contratos', slug: 'contratos' }

/** Hoje fixo do protótipo: as datas relativas ("nos próximos 30 dias") contam a partir dele. */
export const HOJE = new Date('2026-10-23T12:00:00')

/* ---------- campos da categoria ---------- */

export type TipoDeCampo = 'texto' | 'selecao' | 'usuario' | 'moeda' | 'data'

export interface Campo {
  path: string
  /** Rótulo do campo. Dado do workspace: não se traduz. */
  label: string
  tipo: TipoDeCampo
  opcoes?: string[]
}

export const CAMPOS: Campo[] = [
  { path: 'reference', label: 'Referência', tipo: 'texto' },
  { path: 'fornecedor', label: 'Fornecedor', tipo: 'texto' },
  { path: 'status', label: 'Status', tipo: 'selecao', opcoes: ['Rascunho', 'Em análise', 'Aprovado', 'Assinado', 'Vencido'] },
  { path: 'area', label: 'Área', tipo: 'selecao', opcoes: ['Financeiro', 'Jurídico', 'Compras', 'Tecnologia', 'Pessoas'] },
  { path: 'responsavel', label: 'Responsável', tipo: 'usuario' },
  { path: 'valor', label: 'Valor do contrato', tipo: 'moeda' },
  { path: 'vencimento', label: 'Vencimento', tipo: 'data' },
  { path: 'prioridade', label: 'Prioridade', tipo: 'selecao', opcoes: ['Alta', 'Média', 'Baixa'] },
  { path: 'criado_em', label: 'Criado em', tipo: 'data' },
]

export const campoPorPath = (path: string) => CAMPOS.find(c => c.path === path)

/** Ícone do tipo de campo, no lugar do nome técnico que a tela mostra hoje ("inputText", "EnlCalendar"). */
export const ICONE_DO_TIPO: Record<TipoDeCampo, string> = {
  texto: 'i-lucide-type',
  selecao: 'i-lucide-circle-chevron-down',
  usuario: 'i-lucide-user',
  moeda: 'i-lucide-banknote',
  data: 'i-lucide-calendar',
}

/** Nome técnico que a tela de hoje mostra ao lado de cada campo (cópia, para o estilo Hoje). */
export const TIPO_TECNICO: Record<TipoDeCampo, string> = {
  texto: 'inputText',
  selecao: 'inputText',
  usuario: 'EnUser',
  moeda: 'EnCurrency',
  data: 'EnlCalendar',
}

/* ---------- pessoas ---------- */

export interface Pessoa { id: number, nome: string, grupos: number[] }

/** Quem está usando o protótipo. */
export const EU: Pessoa = { id: 7, nome: 'Marina Duarte', grupos: [2] }

export const PESSOAS: Pessoa[] = [
  EU,
  { id: 11, nome: 'Rafael Nogueira', grupos: [1] },
  { id: 12, nome: 'Beatriz Lacerda', grupos: [2] },
  { id: 13, nome: 'Tomás Valadares', grupos: [3] },
  { id: 14, nome: 'Helena Castilho', grupos: [1, 2] },
]

export const GRUPOS = [
  { id: 1, nome: 'Jurídico' },
  { id: 2, nome: 'Financeiro' },
  { id: 3, nome: 'Compras' },
]

export const FUNCOES = [
  { id: 1, nome: 'Gestor' },
  { id: 2, nome: 'Analista' },
  { id: 3, nome: 'Leitor' },
]

/* ---------- itens ---------- */

export interface Item {
  reference: string
  fornecedor: string
  status: string
  area: string
  responsavel: number | null
  valor: number
  vencimento: string
  prioridade: string
  criado_em: string
  /** Grupo do item, para o filtro automático "dos meus grupos" (inGroups). */
  grupo: number
}

const FORNECEDORES = [
  'Lumen Serviços Gráficos',
  'Grupo Atalaia Logística',
  'Verdemar Alimentos',
  'Nexo Tecnologia e Sistemas Integrados do Centro-Oeste Ltda',
  'Casa Aurora Eventos',
  'Pinhal Seguros',
  'Brisa Telecom',
  'Monte Claro Engenharia',
  'Oficina Kairós',
  'Tecelagem Santa Rita',
  'Rede Farol de Saúde',
  'Ipê Consultoria Tributária',
  'Cerrado Energia Solar',
  'Vila Nova Locação de Veículos',
  'Estúdio Maré',
  'Quintal Paisagismo',
]

const STATUS = ['Rascunho', 'Em análise', 'Aprovado', 'Assinado', 'Vencido']
const AREAS = ['Financeiro', 'Jurídico', 'Compras', 'Tecnologia', 'Pessoas']
const PRIORIDADES = ['Alta', 'Média', 'Baixa']

function dia(deslocamento: number) {
  const d = new Date(HOJE)
  d.setDate(d.getDate() + deslocamento)
  return d.toISOString().slice(0, 10)
}

/** 48 itens determinísticos, com casos de canto: nome longo, sem responsável, valor alto, vencido. */
export const ITENS: Item[] = Array.from({ length: 48 }, (_, i) => {
  const status = STATUS[(i * 7 + 3) % 5]!
  return {
    reference: `CTR-2026-${String(301 + i).padStart(4, '0')}`,
    fornecedor: FORNECEDORES[(i * 5) % FORNECEDORES.length]!,
    status,
    // O "+ Math.floor(i / 5)" descorrelaciona área e status: sem ele, todo "Em análise" caía em Compras.
    area: AREAS[(i * 3 + Math.floor(i / 5)) % 5]!,
    responsavel: i % 9 === 4 ? null : PESSOAS[(i * 2) % PESSOAS.length]!.id,
    valor: Math.round(((i * 37) % 23 + 1) * 8350 + (i % 4) * 1290),
    vencimento: dia(status === 'Vencido' ? -((i % 6) * 9 + 3) : (i * 11) % 160 - 10),
    prioridade: PRIORIDADES[(i * 2 + 1) % 3]!,
    criado_em: dia(-((i * 13) % 200) - 5),
    grupo: GRUPOS[i % 3]!.id,
  }
})

/* ---------- visualizações ---------- */

export type Operador = 'eq' | 'neq' | 'contains' | 'gte' | 'lte' | 'empty' | 'not_empty' | 'next_days'

export interface FiltroDeCampo { field: string, op: Operador | string, value: unknown }
export interface Ordenacao { field: string, direction: 'asc' | 'desc' }

/**
 * A visualização do protótipo: o `ModelView` do schema, mais o que o protótipo inventou.
 */
export type Visualizacao = Omit<ModelView, 'id' | 'created_at' | 'updated_at' | 'config' | 'filters'> & {
  config: NonNullable<ModelView['config']> & {
    /** INVENTADO: ordenação em vários níveis. O schema tem só `defaultColumnSortField` + `sortOrder`. */
    sorts?: Ordenacao[]
  }
  filters: {
    field_filters?: FiltroDeCampo[]
    quick_filters?: { filter: 'isOwner' | 'inGroups' | string, required?: boolean }[]
  }
  /** INVENTADO: fixada no começo da barra, só para quem fixou. */
  fixada?: boolean
  /** SÓ DO PROTÓTIPO: visualização em criação, com o painel aberto, ainda não gravada. */
  novo?: boolean
}

const cols = (...paths: string[]) => paths.map(path => ({ path, label: campoPorPath(path)!.label }))

const TODAS = cols('reference', 'fornecedor', 'status', 'area', 'responsavel', 'valor', 'vencimento', 'prioridade')

function vis(v: Partial<Visualizacao> & Pick<Visualizacao, 'reference' | 'name'>): Visualizacao {
  return {
    model: 'contratos',
    description: null,
    icon: v.model_type === 'kanban' ? 'i-lucide-square-kanban' : 'i-lucide-table',
    model_type: 'table',
    default: false,
    version: '1',
    user: null,
    module_groups: null,
    roles: null,
    filters: {},
    ...v,
    config: { hide: false, columns: TODAS, ...v.config },
  }
}

/** "Itens": a visualização padrão de toda categoria. Não se exclui (Twenty, Baserow fazem igual). */
export const ITENS_PADRAO = vis({
  reference: 'default',
  name: 'Itens',
  default: true,
  config: { hide: false, columns: TODAS, sorts: [{ field: 'criado_em', direction: 'desc' }] },
})

const POUCAS: Visualizacao[] = [
  vis({
    reference: 'em-analise',
    name: 'Em análise',
    icon: 'i-lucide-search-check',
    config: { hide: false, columns: cols('reference', 'fornecedor', 'responsavel', 'valor', 'vencimento'), sorts: [{ field: 'vencimento', direction: 'asc' }] },
    filters: { field_filters: [{ field: 'status', op: 'eq', value: 'Em análise' }] },
  }),
  vis({
    reference: 'quadro-por-status',
    name: 'Quadro por status',
    model_type: 'kanban',
    icon: 'i-lucide-square-kanban',
    config: { hide: false, groupBy: 'status', columns: TODAS, cardConfig: { header: 'fornecedor', content: 'valor', tags: [{ field: 'prioridade' }], userField: 'responsavel', dueDateField: 'vencimento' } },
  }),
  vis({
    reference: 'vencendo-30-dias',
    name: 'Vencendo em 30 dias',
    icon: 'i-lucide-alarm-clock',
    config: { hide: false, columns: cols('reference', 'fornecedor', 'status', 'responsavel', 'vencimento'), sorts: [{ field: 'vencimento', direction: 'asc' }] },
    filters: { field_filters: [{ field: 'vencimento', op: 'next_days', value: 30 }, { field: 'status', op: 'neq', value: 'Vencido' }] },
  }),
]

const MAIS: Visualizacao[] = [
  vis({ reference: 'meus-contratos', name: 'Meus contratos', icon: 'i-lucide-user-round', user: EU.id, fixada: true, filters: { quick_filters: [{ filter: 'isOwner', required: true }] } }),
  vis({ reference: 'alta-prioridade', name: 'Alta prioridade', icon: 'i-lucide-flame', filters: { field_filters: [{ field: 'prioridade', op: 'eq', value: 'Alta' }] }, config: { hide: false, columns: TODAS, sorts: [{ field: 'vencimento', direction: 'asc' }, { field: 'valor', direction: 'desc' }] } }),
  vis({ reference: 'aprovados-financeiro', name: 'Aprovados do financeiro', icon: 'i-lucide-badge-check', module_groups: [2], filters: { field_filters: [{ field: 'status', op: 'eq', value: 'Aprovado' }, { field: 'area', op: 'eq', value: 'Financeiro' }] } }),
  vis({ reference: 'acima-100-mil', name: 'Acima de R$ 100 mil', icon: 'i-lucide-banknote', filters: { field_filters: [{ field: 'valor', op: 'gte', value: 100000 }] }, config: { hide: false, columns: TODAS, sorts: [{ field: 'valor', direction: 'desc' }] } }),
  vis({ reference: 'kanban-por-area', name: 'Quadro por área', model_type: 'kanban', icon: 'i-lucide-square-kanban', config: { hide: false, groupBy: 'area', columns: TODAS, cardConfig: { header: 'fornecedor', content: 'valor', tags: [{ field: 'prioridade' }], userField: 'responsavel', dueDateField: 'vencimento' } } }),
  vis({ reference: 'vencidos', name: 'Vencidos', icon: 'i-lucide-calendar-x', filters: { field_filters: [{ field: 'status', op: 'eq', value: 'Vencido' }] } }),
  vis({ reference: 'sem-responsavel', name: 'Sem responsável', icon: 'i-lucide-user-x', filters: { field_filters: [{ field: 'responsavel', op: 'empty', value: null }] } }),
  vis({ reference: 'juridico', name: 'Jurídico', icon: 'i-lucide-scale', filters: { field_filters: [{ field: 'area', op: 'eq', value: 'Jurídico' }] } }),
  vis({ reference: 'compras', name: 'Compras', icon: 'i-lucide-shopping-cart', filters: { field_filters: [{ field: 'area', op: 'eq', value: 'Compras' }] } }),
  vis({ reference: 'tecnologia', name: 'Tecnologia', icon: 'i-lucide-cpu', filters: { field_filters: [{ field: 'area', op: 'eq', value: 'Tecnologia' }] } }),
  vis({ reference: 'rascunhos', name: 'Rascunhos parados', icon: 'i-lucide-file-pen-line', user: EU.id, filters: { field_filters: [{ field: 'status', op: 'eq', value: 'Rascunho' }] } }),
  vis({ reference: 'revisao-trimestral', name: 'Revisão trimestral dos contratos de fornecedores estratégicos', icon: 'i-lucide-clipboard-list', description: 'Contratos que o comitê revisa a cada trimestre.', filters: { field_filters: [{ field: 'valor', op: 'gte', value: 60000 }, { field: 'status', op: 'neq', value: 'Rascunho' }] } }),
  vis({ reference: 'meus-grupos', name: 'Dos meus grupos', icon: 'i-lucide-users', filters: { quick_filters: [{ filter: 'inGroups', required: true }] } }),
  vis({ reference: 'pessoas', name: 'Pessoas', icon: 'i-lucide-heart-handshake', filters: { field_filters: [{ field: 'area', op: 'eq', value: 'Pessoas' }] } }),
]

export type Volume = 'nenhuma' | 'poucas' | 'muitas'

export function visualizacoesIniciais(volume: Volume): Visualizacao[] {
  const lista = volume === 'nenhuma' ? [] : volume === 'poucas' ? POUCAS : [...POUCAS, ...MAIS]
  // As fixadas vêm logo depois de Itens (ClickUp e monday fazem igual).
  return structuredClone([ITENS_PADRAO, ...lista.filter(v => v.fixada), ...lista.filter(v => !v.fixada)])
}

/* ---------- aplicar uma visualização sobre os itens ---------- */

function passa(item: Item, f: FiltroDeCampo): boolean {
  const v = (item as unknown as Record<string, unknown>)[f.field]
  switch (f.op) {
    case 'eq': return v === f.value
    case 'neq': return v !== f.value
    case 'contains': return String(v ?? '').toLowerCase().includes(String(f.value ?? '').toLowerCase())
    case 'gte': return typeof v === 'number' ? v >= Number(f.value) : String(v) >= String(f.value)
    case 'lte': return typeof v === 'number' ? v <= Number(f.value) : String(v) <= String(f.value)
    case 'empty': return v === null || v === undefined || v === ''
    case 'not_empty': return !(v === null || v === undefined || v === '')
    case 'next_days': {
      const limite = new Date(HOJE)
      limite.setDate(limite.getDate() + Number(f.value || 0))
      const d = new Date(`${String(v)}T12:00:00`)
      return d >= new Date(HOJE.toDateString()) && d <= limite
    }
    default: return true
  }
}

export function aplicar(v: Visualizacao, itens: Item[] = ITENS): Item[] {
  const filtros = v.filters.field_filters ?? []
  const rapidos = v.filters.quick_filters ?? []
  let lista = itens.filter(i => filtros.every(f => passa(i, f)))
  if (rapidos.some(r => r.filter === 'isOwner')) lista = lista.filter(i => i.responsavel === EU.id)
  if (rapidos.some(r => r.filter === 'inGroups')) lista = lista.filter(i => EU.grupos.includes(i.grupo))
  const sorts = v.config.sorts ?? []
  if (sorts.length) {
    lista = [...lista].sort((a, b) => {
      for (const s of sorts) {
        const x = (a as unknown as Record<string, unknown>)[s.field]
        const y = (b as unknown as Record<string, unknown>)[s.field]
        if (x === y) continue
        if (x === null || x === undefined) return 1
        if (y === null || y === undefined) return -1
        const r = (x as number | string) < (y as number | string) ? -1 : 1
        return s.direction === 'asc' ? r : -r
      }
      return 0
    })
  }
  return lista
}

export const nomeDaPessoa = (id: number | null) => PESSOAS.find(p => p.id === id)?.nome ?? null

/**
 * Cópia funda do dado do protótipo. Não é `structuredClone`: ele falha quando a visualização
 * traz objetos reativos do Vue aninhados (o `toRaw` só desembrulha o 1º nível). O dado é todo JSON.
 */
export const clonar = <T>(v: T): T => JSON.parse(JSON.stringify(v))
