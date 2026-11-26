<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): a grade do painel do projeto, com `EnDashboardCanvas`, `EnDashboardCustomize`
 * e `useDashboardLayout` do SDK 0.21, a mesma peça do Painel de tarefas e do protótipo dashboards.
 *
 * Um painel só junta as 2 fontes que o produto tem hoje:
 *  - Tarefas: os blocos do catálogo do Painel de tarefas (Abertas agora, Concluídas, Vencidas,
 *    Vencem em 7 dias, Abertas por status, Carga por responsável, Fila de prazos), com o filtro de
 *    categoria preso às categorias do projeto. No "Adicionar painel" do Personalizar, os blocos
 *    escondidos voltam, no grupo Tarefas;
 *  - Itens: os painéis da tela Paineis de hoje, 1 categoria por painel, com Tipo de gráfico,
 *    Agrupar por e Função. O que é novo (contorno azul): a fonte de dados de itens no SDK, o
 *    período e o filtro de categoria do painel valendo para eles.
 * O selo em cima do título diz a fonte: "Tarefas" ou "Itens · <categoria>".
 * Funil e pizza: o SDK não tem; o funil sai em barras na ordem das etapas e a pizza em rosca.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { DashboardLayoutStorage, DashboardPanelDef, EnChartBarListItem } from '@be-enlighten/enspace-sdk-ui/base'
import { useDashboardLayout } from '@be-enlighten/enspace-sdk-ui/base'
import type { BlocoDeTarefas, DashboardDoProjeto, PainelDeItens, TarefaDoProjeto } from './mocks'
import { iniciais, pessoa } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { textosDaTarefa } from './textosDaTarefa'
import { useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{
  dash: DashboardDoProjeto
  tarefas: TarefaDoProjeto[]
  /** Categoria escolhida no filtro do painel; null é todas as do projeto. */
  categoria: number | null
  responsavel: number | null
  /** Fator do período sobre o volume de itens (fictício). */
  fator: number
  editavel: boolean
}>()
const emit = defineEmits<{ concluir: [], limpar: [] }>()

const prj = useProjetos()
const r = useTextos(textosDoProjeto)
const tt = useTextos(textosDaTarefa)
const rp = computed(() => r.value.painel)
const idioma = useIdioma()
const { marcaBack } = useMarcaDeProposta()
const admin = computed(() => {
  const p = prj.projetos.value.find(x => x.id === props.dash.projeto)
  return p ? prj.podeAdministrar(p) : false
})

const HOJE = '2026-11-26'
const EM7 = '2026-12-03'
const BLOCOS: BlocoDeTarefas[] = ['abertas', 'concluidas', 'vencidas', 'vencem7', 'porStatus', 'carga', 'filaDePrazos']
const KPI = new Set<BlocoDeTarefas>(['abertas', 'concluidas', 'vencidas', 'vencem7'])
const ICONE: Record<BlocoDeTarefas, string> = {
  abertas: 'i-lucide-circle-dot',
  concluidas: 'i-lucide-circle-check',
  vencidas: 'i-lucide-alarm-clock-off',
  vencem7: 'i-lucide-calendar-clock',
  porStatus: 'i-lucide-chart-bar',
  carga: 'i-lucide-users-round',
  filaDePrazos: 'i-lucide-list-ordered',
}

/* ---------- o layout: blocos de tarefas + painéis de itens ---------- */
const memoria = useState<Record<string, unknown>>('prj-dash-layout', () => ({}))
const storage: DashboardLayoutStorage = {
  load: k => memoria.value[k] ?? null,
  save: (k, layout) => { memoria.value = { ...memoria.value, [k]: layout } },
}
const definicoes = computed<DashboardPanelDef[]>(() => [
  ...BLOCOS.map(b => ({
    id: `t-${b}`,
    titleKey: `projeto.painel.${b}`,
    title: rp.value.blocos[b],
    groupKey: rp.value.escopoTarefas,
    defaultSize: KPI.has(b) ? { w: 3, h: 2 } : { w: 4, h: 4 },
    minSize: KPI.has(b) ? { w: 2, h: 2 } : { w: 3, h: 3 },
    defaultVisible: props.dash.tarefas.includes(b),
  })),
  ...props.dash.itens.map(i => ({
    id: i.id,
    titleKey: `projeto.painel.${i.id}`,
    title: i.titulo,
    groupKey: rp.value.painelDeItens,
    defaultSize: { w: props.dash.itens.length === 1 ? 12 : 4, h: 4 },
    minSize: { w: 3, h: 3 },
  })),
])
const layout = useDashboardLayout({
  dashboardId: `projeto-${props.dash.id}`,
  panels: definicoes,
  scope: { workspaceId: 'teste-ux', userId: 'prototipo' },
  storage,
  saveDelay: 200,
})
const painelDeItens = (id: string) => props.dash.itens.find(i => i.id === id)

/* ---------- números das tarefas ---------- */
const abertas = computed(() => props.tarefas.filter(x => x.status !== 'concluida'))
const kpi = computed<Record<string, number>>(() => ({
  abertas: abertas.value.length,
  concluidas: props.tarefas.filter(x => x.status === 'concluida').length,
  vencidas: abertas.value.filter(x => x.prazo < HOJE).length,
  vencem7: abertas.value.filter(x => x.prazo >= HOJE && x.prazo <= EM7).length,
}))
const porStatus = computed<EnChartBarListItem[]>(() => [
  { key: 'aberta', label: r.value.tarefas.status.aberta, value: abertas.value.filter(x => x.status === 'aberta').length, color: 'var(--ui-color-neutral-400)' },
  { key: 'andamento', label: r.value.tarefas.status.andamento, value: abertas.value.filter(x => x.status === 'andamento').length, color: 'var(--ui-color-info-500)' },
  { key: 'bloqueada', label: r.value.tarefas.status.bloqueada, value: abertas.value.filter(x => x.status === 'bloqueada').length, color: 'var(--ui-color-warning-500)' },
])
const carga = computed<EnChartBarListItem[]>(() => {
  const conta = new Map<number, number>()
  abertas.value.forEach(x => conta.set(x.responsavel, (conta.get(x.responsavel) ?? 0) + 1))
  return [...conta.entries()].sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ key: String(id), label: pessoa(id)?.nome ?? '', value: n, color: 'var(--ui-color-primary-500)' }))
})
const fila = computed(() => [...abertas.value].sort((a, b) => a.prazo.localeCompare(b.prazo)).slice(0, 5))
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value, { day: '2-digit', month: 'short' })

/* ---------- dados dos painéis de itens (fictícios, pelo volume da categoria) ---------- */
const ETAPAS: Record<number, string[]> = {
  4: ['Lançada', 'Em aprovação', 'Aprovada', 'Paga'],
  6: ['Solicitado', 'Em análise', 'Aprovado', 'Reembolsado'],
  10: ['Prospecção', 'Qualificação', 'Proposta', 'Negociação', 'Ganha'],
}
const PESOS = [0.34, 0.26, 0.18, 0.13, 0.09]
const CORES = ['var(--ui-color-primary-500)', 'var(--ui-color-secondary-500)', 'var(--ui-color-warning-500)', 'var(--ui-color-success-600)', 'var(--ui-color-error-400)']
const MESES = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11']
function volume(i: PainelDeItens) {
  const c = prj.categorias.value.find(x => x.id === i.categoria)
  return Math.max(4, Math.round((c?.itens ?? 100) * 0.08 * props.fator))
}
function grupos(i: PainelDeItens) {
  const etapas = ETAPAS[i.categoria] ?? ['Aberto', 'Em andamento', 'Concluído']
  const total = volume(i)
  return etapas.map((e, k) => ({ key: e, label: e, value: Math.round(total * (PESOS[k] ?? 0.05)), color: CORES[k % CORES.length]! }))
}
function serie(i: PainelDeItens) {
  const total = volume(i)
  return MESES.map((m, k) => ({ x: new Date(`${m}-15T12:00:00`).toLocaleDateString(idioma.value, { month: 'short' }), valor: Math.round(total / 6 * (0.7 + ((k * 37) % 9) / 15)) }))
}
const foraDoFiltro = (i: PainelDeItens) => props.categoria !== null && props.categoria !== i.categoria
const nomeDaCategoria = (id: number | null) => prj.categorias.value.find(c => c.id === id)?.name ?? ''

/* ---------- menus dos painéis ---------- */
function menuDeTarefas(): DropdownMenuItem[][] | undefined {
  if (props.editavel) return undefined
  return [[{ label: rp.value.abrirTarefas, icon: 'i-lucide-square-check', onSelect: () => prj.abrirAba(props.dash.projeto, 'tarefas') }]]
}
function menuDeItens(i: PainelDeItens): DropdownMenuItem[][] | undefined {
  if (props.editavel) return undefined
  const ver = [{ label: r.value.menu.abrir + ' ' + nomeDaCategoria(i.categoria), icon: 'i-lucide-list', onSelect: () => prj.abrirCategoria(i.categoria) }]
  if (!admin.value) return [ver]
  return [ver, [{
    label: r.value.menu.excluir,
    icon: 'i-lucide-trash-2',
    color: 'error' as const,
    onSelect: () => prj.atualizarDashboard(props.dash.id, { itens: props.dash.itens.filter(x => x.id !== i.id) }),
  }]]
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <EnDashboardCustomize v-if="editavel" :dashboard="layout" :locale="(idioma as any)" @done="emit('concluir')" />

    <EnDashboardCanvas :dashboard="layout" :editable="editavel" :row-height="80" :gap="16" bare :locale="(idioma as any)">
      <template #panel="{ panel }">
        <!-- blocos de tarefas -->
        <template v-if="panel.id.startsWith('t-')">
          <EnDashboardPanel
            v-if="KPI.has(panel.id.slice(2) as BlocoDeTarefas)"
            :label="rp.escopoTarefas"
            :title="rp.blocos[panel.id.slice(2) as BlocoDeTarefas]"
            :value="kpi[panel.id.slice(2)]"
            :info="rp.comoTarefas"
            :body-height="0"
            :menu="menuDeTarefas()"
            :draggable="editavel"
            :locale="(idioma as any)"
            class="h-full"
          >
            <p class="flex items-center gap-1.5 pt-1 text-xs text-muted">
              <UIcon :name="ICONE[panel.id.slice(2) as BlocoDeTarefas]" class="size-3.5" />
              {{ r.tarefas.contagem(kpi[panel.id.slice(2)] ?? 0) }}
            </p>
          </EnDashboardPanel>
          <EnDashboardPanel
            v-else
            :label="rp.escopoTarefas"
            :title="rp.blocos[panel.id.slice(2) as BlocoDeTarefas]"
            :info="rp.comoTarefas"
            :empty="!abertas.length"
            :state-title="!abertas.length ? rp.nenhumaTarefa : undefined"
            :body-height="220"
            :menu="menuDeTarefas()"
            :draggable="editavel"
            :locale="(idioma as any)"
            class="h-full"
          >
            <EnChartBarList v-if="panel.id === 't-porStatus'" :items="porStatus" :locale="(idioma as any)" />
            <div v-else-if="panel.id === 't-carga'" class="max-h-56 overflow-y-auto pr-1">
              <EnChartBarList :items="carga" :locale="(idioma as any)" />
            </div>
            <ul v-else class="divide-y divide-default">
              <li v-for="x in fila" :key="x.id" class="flex items-center gap-2.5 py-2">
                <UAvatar size="2xs" :text="iniciais(pessoa(x.responsavel)?.nome ?? '')" :alt="pessoa(x.responsavel)?.nome" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm text-highlighted">{{ x.titulo }}</span>
                  <span class="block truncate text-xs text-muted">{{ x.item ? `${x.item} · ${nomeDaCategoria(x.categoria)}` : tt.semItem }}</span>
                </span>
                <span class="shrink-0 text-xs" :class="x.prazo < HOJE ? 'font-medium text-error' : 'text-muted'">{{ formatarData(x.prazo) }}</span>
              </li>
            </ul>
          </EnDashboardPanel>
        </template>

        <!-- painéis de itens -->
        <div v-else-if="painelDeItens(panel.id)" class="h-full" :class="marcaBack">
          <EnDashboardPanel
            :label="rp.escopoItens(nomeDaCategoria(painelDeItens(panel.id)!.categoria))"
            :title="painelDeItens(panel.id)!.titulo"
            :info="rp.comoItens(nomeDaCategoria(painelDeItens(panel.id)!.categoria), painelDeItens(panel.id)!.campoDeData)"
            :empty="foraDoFiltro(painelDeItens(panel.id)!)"
            :filtered="foraDoFiltro(painelDeItens(panel.id)!)"
            :state-title="foraDoFiltro(painelDeItens(panel.id)!) ? rp.nenhumItem : undefined"
            :body-height="220"
            :menu="menuDeItens(painelDeItens(panel.id)!)"
            :draggable="editavel"
            :locale="(idioma as any)"
            class="h-full"
            @clear="emit('limpar')"
          >
            <template v-if="painelDeItens(panel.id)!.tipo === 'area_chart' || painelDeItens(panel.id)!.tipo === 'line_chart'">
              <EnChartArea
                v-if="painelDeItens(panel.id)!.tipo === 'area_chart'"
                :data="serie(painelDeItens(panel.id)!)"
                x="x"
                :series="[{ key: 'valor', label: rp.funcoes.count, color: 'var(--ui-color-primary-500)' }]"
                :height="210"
                :aria-label="painelDeItens(panel.id)!.titulo"
                :locale="(idioma as any)"
              />
              <EnChartLine
                v-else
                :data="serie(painelDeItens(panel.id)!)"
                x="x"
                :series="[{ key: 'valor', label: rp.funcoes.count, color: 'var(--ui-color-primary-500)' }]"
                :height="210"
                :aria-label="painelDeItens(panel.id)!.titulo"
                :locale="(idioma as any)"
              />
            </template>
            <div v-else-if="painelDeItens(panel.id)!.tipo === 'donut_chart' || painelDeItens(panel.id)!.tipo === 'pie_chart'" class="flex items-center gap-4">
              <div class="w-1/2 shrink-0">
              <EnChartDonut
                :data="grupos(painelDeItens(panel.id)!)"
                label="label"
                value="value"
                :color="(d: any) => d.color"
                :arc-width="painelDeItens(panel.id)!.tipo === 'pie_chart' ? 80 : 22"
                :central-label="painelDeItens(panel.id)!.tipo === 'pie_chart' ? undefined : String(grupos(painelDeItens(panel.id)!).reduce((s, g) => s + g.value, 0))"
                :central-sub-label="painelDeItens(panel.id)!.tipo === 'pie_chart' ? undefined : rp.funcoes[painelDeItens(panel.id)!.funcao]"
                :height="190"
              />
              </div>
              <ul class="min-w-0 flex-1 space-y-1.5 text-sm">
                <li v-for="g in grupos(painelDeItens(panel.id)!)" :key="g.key" class="flex items-center gap-2">
                  <span class="size-2.5 shrink-0 rounded-full" :style="{ background: g.color }" />
                  <span class="min-w-0 flex-1 truncate text-default">{{ g.label }}</span>
                  <span class="tabular-nums text-muted">{{ g.value }}</span>
                </li>
              </ul>
            </div>
            <EnChartBarList v-else :items="grupos(painelDeItens(panel.id)!)" :locale="(idioma as any)" />
          </EnDashboardPanel>
        </div>
      </template>
    </EnDashboardCanvas>
  </div>
</template>
