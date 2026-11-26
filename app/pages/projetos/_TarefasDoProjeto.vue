<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): a aba Tarefas do projeto. Responde "onde vejo as tarefas do projeto".
 *
 * Nenhuma tarefa nova: são as tarefas rápidas e as agendadas (criadas por workflow) dos itens das
 * categorias do projeto. O Painel de tarefas do produto já filtra por categoria (filtro `category`,
 * lido no código em 2026-11-26), então a lista cabe hoje: é esse filtro com as categorias do projeto.
 *
 * O esquema é o das listagens do produto, igual ao diretório (rodada 4): a barra com busca, período,
 * Colunas e Nova tarefa; a linha de filtros rápidos, numa linha só, com o tipo de tarefa (Todas,
 * Rápidas, Agendadas), Status, Responsável, Categoria, Atrasadas e Minhas tarefas (os 2 botões são
 * filtros rápidos das listas de tarefas do produto); o `EnTable` do SDK e o paginador.
 *
 * Rodada 7: as colunas seguem os nomes das listas de tarefas do produto (Tarefa, Referência do item,
 * Responsável, Data limite, Status, Prioridade, Criada em) mais o Tipo de tarefa, que o filtro pede, a
 * Categoria e o Workflow que criou a agendada. Cada coisa na sua coluna, com largura própria
 * (`columnSizing` do `EnTable`). Prioridade só na rápida: a agendada não tem o campo no produto.
 */
import type { EnTableColumn, EnTableColumnSizing, EnTableColumnVisibility, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { iniciais, pessoa, type Prioridade, type StatusDaTarefa, type TarefaDoProjeto } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { useMarcaDeProposta, useProjetos } from './estado'
import Paginador from './_Paginador.vue'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const r = useTextos(textosDoProjeto)
const rt = computed(() => r.value.tarefas)
const idioma = useIdioma()
const toast = useToast()
const { marca } = useMarcaDeProposta()

const HOJE = '2026-11-26'
type Fonte = 'todas' | 'rapida' | 'agendada'
type Periodo = 'todos' | 'd30' | 'd90' | 'ano'
const fonte = ref<Fonte>('todas')
const busca = ref('')
const periodo = ref<Periodo>('todos')
const fStatus = ref<StatusDaTarefa[]>(['aberta', 'andamento'])
const fResp = ref<number[]>([])
const fCat = ref<number[]>([])
const soAtrasadas = ref(false)
const soMinhas = ref(false)
const mostrarRapidos = ref(true)
const pagina = ref(1)
const porPagina = ref(25)
const ordem = ref<EnTableSort | null>({ key: 'prazo', direction: 'asc' })

const todas = computed(() => prj.tarefasDoProjeto(props.id))
const categorias = computed(() => prj.categoriasDe(props.id))
const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const DIAS: Record<Periodo, number> = { todos: 0, d30: 30, d90: 90, ano: 365 }
const desde = (dias: number) => new Date(new Date(`${HOJE}T12:00:00`).getTime() - dias * 864e5).toISOString().slice(0, 10)

const COR_DO_STATUS: Record<StatusDaTarefa, 'neutral' | 'info' | 'success'> = { aberta: 'neutral', andamento: 'info', concluida: 'success' }
const COR_DA_PRIORIDADE: Record<Prioridade, 'error' | 'warning' | 'neutral'> = { alta: 'error', media: 'warning', baixa: 'neutral' }
const nomeDaCategoria = (id: number) => prj.categorias.value.find(c => c.id === id)?.name ?? ''
const iconeDaCategoria = (id: number) => prj.categorias.value.find(c => c.id === id)?.icon ?? 'i-lucide-folder'
const nomeDoFluxo = (id?: number) => prj.fluxos.value.find(f => f.id === id)?.nome ?? ''
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value, { day: '2-digit', month: 'short' })
const vencida = (x: TarefaDoProjeto) => x.status !== 'concluida' && x.prazo < HOJE
const venceHoje = (x: TarefaDoProjeto) => x.status !== 'concluida' && x.prazo === HOJE

const filtradas = computed(() => todas.value.filter((x) => {
  if (fonte.value !== 'todas' && x.origem !== fonte.value) return false
  if (fStatus.value.length && !fStatus.value.includes(x.status)) return false
  if (fResp.value.length && !fResp.value.includes(x.responsavel)) return false
  if (fCat.value.length && !fCat.value.includes(x.categoria)) return false
  if (soAtrasadas.value && !vencida(x)) return false
  if (soMinhas.value && x.responsavel !== prj.eu.value) return false
  if (DIAS[periodo.value] && x.criadaEm < desde(DIAS[periodo.value])) return false
  const q = normalizar(busca.value.trim())
  return !q || normalizar(`${x.titulo} ${x.item}`).includes(q)
}))
const PESO: Record<Prioridade, number> = { alta: 0, media: 1, baixa: 2 }
/** Só a tarefa rápida tem prioridade no produto; a agendada (de workflow) não tem o campo. */
const temPrioridade = (x: TarefaDoProjeto) => x.origem === 'rapida'
const valorDaOrdem = (x: TarefaDoProjeto, k: string): string | number => {
  if (k === 'prioridade') return temPrioridade(x) ? PESO[x.prioridade] : 9
  if (k === 'responsavel') return pessoa(x.responsavel)?.nome ?? ''
  if (k === 'categoria') return nomeDaCategoria(x.categoria)
  if (k === 'tipo') return x.origem
  if (k === 'fluxo') return nomeDoFluxo(x.fluxo)
  return String((x as unknown as Record<string, unknown>)[k] ?? '')
}
const ordenadas = computed(() => {
  const o = ordem.value
  if (!o) return filtradas.value
  return [...filtradas.value].sort((a, b) => {
    const A = valorDaOrdem(a, o.key), B = valorDaOrdem(b, o.key)
    const c = typeof A === 'number' ? A - (B as number) : (A as string).localeCompare(B as string)
    return o.direction === 'asc' ? c : -c
  })
})
watch([fonte, busca, periodo, fStatus, fResp, fCat, soAtrasadas, soMinhas], () => { pagina.value = 1 })
const linhas = computed(() => ordenadas.value.slice((pagina.value - 1) * porPagina.value, pagina.value * porPagina.value))

/* ---------- colunas: os nomes das listas de tarefas do produto ---------- */
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'titulo', label: rt.value.colTarefa, sortable: true },
  { key: 'tipo', label: rt.value.colTipo, sortable: true },
  { key: 'item', label: rt.value.colItem, sortable: true },
  { key: 'categoria', label: rt.value.colCategoria, sortable: true },
  { key: 'responsavel', label: rt.value.colResponsavel, sortable: true },
  { key: 'prazo', label: rt.value.colPrazo, sortable: true },
  { key: 'status', label: rt.value.colStatus, sortable: true },
  { key: 'prioridade', label: rt.value.colPrioridade, sortable: true },
  { key: 'fluxo', label: rt.value.colOrigem, sortable: true },
  { key: 'criadaEm', label: rt.value.colCriada, sortable: true },
])
const colunasVisiveis = ref<EnTableColumnVisibility>({ fluxo: false, criadaEm: false })
const larguras = ref<EnTableColumnSizing>({ titulo: 270, tipo: 140, item: 150, categoria: 160, responsavel: 170, prazo: 170, status: 140, prioridade: 110, fluxo: 240, criadaEm: 120 })
function verColuna(key: string, ver: boolean | 'indeterminate') {
  colunasVisiveis.value = { ...colunasVisiveis.value, [key]: ver === true }
}

const fontes = computed(() => (['todas', 'rapida', 'agendada'] as Fonte[]).map(v => ({ v, r: rt.value.fonte[v], n: v === 'todas' ? todas.value.length : todas.value.filter(x => x.origem === v).length })))
const opStatus = computed(() => (['aberta', 'andamento', 'concluida'] as StatusDaTarefa[]).map(v => ({ value: v, label: rt.value.status[v] })))
const opResp = computed(() => [...new Set(todas.value.map(x => x.responsavel))].map(id => ({ value: id, label: pessoa(id)?.nome ?? '' })))
const opCat = computed(() => categorias.value.map(c => ({ value: c.id, label: c.name, icon: c.icon })))
const opPeriodo = computed(() => (['todos', 'd30', 'd90', 'ano'] as const).map(v => ({ value: v, label: props.t.diretorio.periodos[v] })))
const rotuloDoFiltro = (nome: string, n: number) => n ? `${nome} (${n})` : nome
const rapidosAtivos = computed(() => [fStatus.value, fResp.value, fCat.value].filter(x => x.length).length + Number(soAtrasadas.value) + Number(soMinhas.value) + Number(fonte.value !== 'todas'))
const temFiltro = computed(() => !!busca.value.trim() || periodo.value !== 'todos' || rapidosAtivos.value > 0)
function limparFiltros() {
  busca.value = ''
  periodo.value = 'todos'
  fStatus.value = []
  fResp.value = []
  fCat.value = []
  soAtrasadas.value = false
  soMinhas.value = false
  fonte.value = 'todas'
}

function alternar(x: TarefaDoProjeto) {
  const ia = x.status !== 'concluida'
  prj.concluirTarefa(x.id)
  toast.add({ title: ia ? rt.value.concluida(x.titulo) : rt.value.reaberta(x.titulo), icon: ia ? 'i-lucide-circle-check' : 'i-lucide-rotate-ccw', color: ia ? 'success' : 'neutral' })
}
</script>

<template>
  <section class="overflow-hidden rounded-lg border border-default bg-default animate-[entrada_0.2s_ease-out_both]" :class="marca">
    <!-- barra: TablesPartsDataToolbar (busca, período, limpar; à direita Colunas, Nova tarefa e a linha de filtros) -->
    <div class="flex flex-wrap items-center gap-1.5 border-b border-default px-3 py-2 sm:px-4">
      <UChip :show="!!busca.trim()" color="error" size="sm">
        <UInput v-model="busca" :placeholder="rt.buscar" icon="i-lucide-search" size="sm" variant="soft" class="w-56" :aria-label="rt.buscar">
          <template v-if="busca" #trailing>
            <UButton icon="i-lucide-circle-x" color="neutral" variant="link" size="xs" :aria-label="t.diretorio.limparBusca" @click="busca = ''" />
          </template>
        </UInput>
      </UChip>
      <USelectMenu v-model="periodo" :items="opPeriodo" value-key="value" :search-input="false" icon="i-lucide-calendar" size="sm" variant="soft" class="w-44" :aria-label="t.diretorio.periodo" />
      <UTooltip v-if="temFiltro" :text="rt.limparFiltros">
        <UButton icon="i-lucide-filter-x" color="neutral" variant="ghost" size="sm" class="text-error" :aria-label="rt.limparFiltros" @click="limparFiltros" />
      </UTooltip>
      <p class="ml-3 hidden truncate text-xs text-muted xl:block">{{ rt.dica }}</p>
      <div class="ml-auto flex items-center gap-1.5">
        <UPopover :content="{ align: 'end' }">
          <UTooltip :text="t.diretorio.colunas">
            <UButton icon="i-lucide-columns-3" color="neutral" variant="ghost" size="sm" class="text-dimmed" :aria-label="t.diretorio.colunas" />
          </UTooltip>
          <template #content>
            <div class="w-56 space-y-3 p-3">
              <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ t.diretorio.colunasVisiveis }}</p>
              <div class="space-y-1">
                <UCheckbox
                  v-for="c in colunas"
                  :key="c.key"
                  :label="c.label"
                  :model-value="colunasVisiveis[c.key] !== false"
                  :disabled="c.key === 'titulo'"
                  class="rounded-md px-1.5 py-1 hover:bg-elevated/80"
                  @update:model-value="verColuna(c.key, $event)"
                />
              </div>
            </div>
          </template>
        </UPopover>
        <UButton :label="r.menu.novaTarefa" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" @click="prj.janelas.novaTarefa.value = id" />
        <UTooltip :text="mostrarRapidos ? t.diretorio.recolherFiltros : t.diretorio.expandirFiltros">
          <UChip :show="rapidosAtivos > 0 && !mostrarRapidos" :text="rapidosAtivos" color="primary" size="xl">
            <UButton
              :icon="mostrarRapidos ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="mostrarRapidos ? t.diretorio.recolherFiltros : t.diretorio.expandirFiltros"
              :aria-expanded="mostrarRapidos"
              @click="mostrarRapidos = !mostrarRapidos"
            />
          </UChip>
        </UTooltip>
      </div>
    </div>

    <!-- filtros rápidos, todos numa linha: tipo de tarefa, Status, Responsável, Categoria, Atrasadas, Minhas tarefas -->
    <div v-if="mostrarRapidos" class="flex items-center gap-2 overflow-x-auto border-b border-default px-3 py-1.5 sm:px-4">
      <div role="radiogroup" :aria-label="rt.tipoDeTarefa" class="flex shrink-0 items-center rounded-md bg-elevated/60 p-0.5">
        <UButton
          v-for="o in fontes"
          :key="o.v"
          :label="o.r"
          size="xs"
          role="radio"
          :aria-checked="fonte === o.v"
          :color="fonte === o.v ? 'primary' : 'neutral'"
          :variant="fonte === o.v ? 'soft' : 'ghost'"
          @click="fonte = o.v"
        >
          <template #trailing><span class="text-[11px] tabular-nums opacity-70">{{ o.n }}</span></template>
        </UButton>
      </div>
      <USeparator orientation="vertical" class="h-5 shrink-0" />
      <USelectMenu v-model="fStatus" :items="opStatus" value-key="value" multiple :search-input="false" size="sm" variant="soft" :icon="fStatus.length ? 'i-lucide-filter' : 'i-lucide-circle-dot'" class="w-36 shrink-0" :ui="{ base: fStatus.length ? 'text-primary' : '' }" :aria-label="rt.filtroStatus">
        <template #default>{{ rotuloDoFiltro(rt.filtroStatus, fStatus.length) }}</template>
      </USelectMenu>
      <USelectMenu v-model="fResp" :items="opResp" value-key="value" multiple size="sm" variant="soft" :icon="fResp.length ? 'i-lucide-filter' : 'i-lucide-user-round'" class="w-40 shrink-0" :ui="{ base: fResp.length ? 'text-primary' : '' }" :aria-label="rt.filtroResponsavel">
        <template #default>{{ rotuloDoFiltro(rt.filtroResponsavel, fResp.length) }}</template>
      </USelectMenu>
      <USelectMenu v-model="fCat" :items="opCat" value-key="value" multiple :search-input="false" size="sm" variant="soft" :icon="fCat.length ? 'i-lucide-filter' : 'i-lucide-folder'" class="w-40 shrink-0" :ui="{ base: fCat.length ? 'text-primary' : '' }" :aria-label="rt.filtroCategoria">
        <template #default>{{ rotuloDoFiltro(rt.filtroCategoria, fCat.length) }}</template>
      </USelectMenu>
      <UButton :label="rt.atrasadas" icon="i-lucide-alarm-clock" size="sm" class="shrink-0" :color="soAtrasadas ? 'error' : 'neutral'" :variant="soAtrasadas ? 'subtle' : 'soft'" :aria-pressed="soAtrasadas" @click="soAtrasadas = !soAtrasadas" />
      <UButton :label="rt.minhas" icon="i-lucide-user-round-check" size="sm" class="shrink-0" :color="soMinhas ? 'primary' : 'neutral'" :variant="soMinhas ? 'subtle' : 'soft'" :aria-pressed="soMinhas" @click="soMinhas = !soMinhas" />
      <span class="ml-auto shrink-0 pl-2 text-xs text-muted">{{ rt.contagem(filtradas.length) }}</span>
    </div>

    <!-- tabela: EnTable do SDK, uma informação por coluna -->
    <div class="pt-2">
      <EnTable
        v-model:column-visibility="colunasVisiveis"
        v-model:column-sizing="larguras"
        :columns="colunas"
        :rows="linhas"
        :sort="ordem"
        resizable
        :empty-state="{ icon: 'i-lucide-square-check', title: rt.vazio, description: '' }"
        :locale="idioma"
        @sort-change="ordem = $event"
        @row-click="() => toast.add({ title: rt.abreTarefa, icon: 'i-lucide-info', color: 'neutral' })"
      >
        <template #cell-titulo="{ row }">
          <span class="flex min-w-0 items-center gap-1.5">
            <span class="shrink-0" @click.stop>
              <UTooltip :text="(row as TarefaDoProjeto).status === 'concluida' ? rt.reabrir : rt.concluir">
                <UButton
                  :icon="(row as TarefaDoProjeto).status === 'concluida' ? 'i-lucide-circle-check' : 'i-lucide-circle'"
                  size="xs"
                  :color="(row as TarefaDoProjeto).status === 'concluida' ? 'success' : 'neutral'"
                  variant="ghost"
                  :aria-label="(row as TarefaDoProjeto).status === 'concluida' ? rt.reabrir : rt.concluir"
                  @click="alternar(row as TarefaDoProjeto)"
                />
              </UTooltip>
            </span>
            <span class="truncate text-sm font-medium" :class="(row as TarefaDoProjeto).status === 'concluida' ? 'text-muted line-through' : 'text-highlighted'">{{ (row as TarefaDoProjeto).titulo }}</span>
          </span>
        </template>
        <template #cell-tipo="{ row }">
          <UBadge
            :label="rt.tipo[(row as TarefaDoProjeto).origem]"
            :icon="(row as TarefaDoProjeto).origem === 'agendada' ? 'i-lucide-workflow' : 'i-lucide-zap'"
            :color="(row as TarefaDoProjeto).origem === 'agendada' ? 'info' : 'neutral'"
            variant="subtle"
            size="sm"
          />
        </template>
        <template #cell-item="{ row }">
          <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as TarefaDoProjeto).item }}</UBadge>
        </template>
        <template #cell-categoria="{ row }">
          <span class="flex min-w-0 items-center gap-1.5 text-sm text-toned">
            <UIcon :name="iconeDaCategoria((row as TarefaDoProjeto).categoria)" class="size-3.5 shrink-0 text-muted" />
            <span class="truncate">{{ nomeDaCategoria((row as TarefaDoProjeto).categoria) }}</span>
          </span>
        </template>
        <template #cell-responsavel="{ row }">
          <span class="flex min-w-0 items-center gap-2">
            <UAvatar size="2xs" :text="iniciais(pessoa((row as TarefaDoProjeto).responsavel)?.nome ?? '')" :alt="pessoa((row as TarefaDoProjeto).responsavel)?.nome" />
            <span class="truncate text-sm text-default">{{ pessoa((row as TarefaDoProjeto).responsavel)?.nome }}</span>
          </span>
        </template>
        <template #cell-prazo="{ row }">
          <span class="flex items-center gap-1.5 whitespace-nowrap text-sm" :class="vencida(row as TarefaDoProjeto) ? 'text-error' : 'text-default'">
            {{ formatarData((row as TarefaDoProjeto).prazo) }}
            <UBadge v-if="vencida(row as TarefaDoProjeto)" :label="rt.vencida" color="error" variant="subtle" size="sm" />
            <UBadge v-else-if="venceHoje(row as TarefaDoProjeto)" :label="rt.venceHoje" color="warning" variant="subtle" size="sm" />
          </span>
        </template>
        <template #cell-status="{ row }">
          <UBadge :label="rt.status[(row as TarefaDoProjeto).status]" :color="COR_DO_STATUS[(row as TarefaDoProjeto).status]" variant="subtle" size="sm" />
        </template>
        <template #cell-prioridade="{ row }">
          <UBadge v-if="temPrioridade(row as TarefaDoProjeto)" :label="rt.prioridade[(row as TarefaDoProjeto).prioridade]" :color="COR_DA_PRIORIDADE[(row as TarefaDoProjeto).prioridade]" variant="soft" size="sm" />
          <span v-else />
        </template>
        <template #cell-fluxo="{ row }">
          <span v-if="(row as TarefaDoProjeto).origem === 'agendada'" class="flex min-w-0 items-center gap-1.5 text-sm text-default">
            <UIcon name="i-lucide-workflow" class="size-3.5 shrink-0 text-muted" />
            <span class="truncate">{{ nomeDoFluxo((row as TarefaDoProjeto).fluxo) }}</span>
          </span>
          <span v-else />
        </template>
        <template #cell-criadaEm="{ row }">
          <span class="whitespace-nowrap text-sm text-muted">{{ formatarData((row as TarefaDoProjeto).criadaEm) }}</span>
        </template>
      </EnTable>
    </div>
    <Paginador v-model:pagina="pagina" v-model:por-pagina="porPagina" :t="t" :total="filtradas.length" />
  </section>
</template>
