<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): a aba Tarefas do projeto. Responde "onde vejo as tarefas do projeto".
 *
 * Nenhuma tarefa nova: são as tarefas rápidas e as agendadas (criadas por workflow) dos itens das
 * categorias do projeto. O Painel de tarefas do produto já filtra por categoria (filtro `category`,
 * lido no código em 2026-11-26), então a lista cabe hoje: é esse filtro com as categorias do projeto.
 *
 * O esquema é o das listagens do produto, igual ao diretório (rodada 4): a fonte em botão (Todas,
 * Rápidas, Agendadas, como no Painel de tarefas), a barra com busca e filtros, o `EnTable` do SDK e
 * o paginador. Concluir e reabrir na própria linha, como na lista de Tarefas rápidas.
 */
import type { EnTableColumn, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
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
const fonte = ref<Fonte>('todas')
const busca = ref('')
const fStatus = ref<StatusDaTarefa[]>(['aberta', 'andamento'])
const fResp = ref<number[]>([])
const fCat = ref<number[]>([])
const mostrarRapidos = ref(true)
const pagina = ref(1)
const porPagina = ref(25)
const ordem = ref<EnTableSort | null>({ key: 'prazo', direction: 'asc' })

const todas = computed(() => prj.tarefasDoProjeto(props.id))
const categorias = computed(() => prj.categoriasDe(props.id))
const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const filtradas = computed(() => todas.value.filter((x) => {
  if (fonte.value !== 'todas' && x.origem !== fonte.value) return false
  if (fStatus.value.length && !fStatus.value.includes(x.status)) return false
  if (fResp.value.length && !fResp.value.includes(x.responsavel)) return false
  if (fCat.value.length && !fCat.value.includes(x.categoria)) return false
  const q = normalizar(busca.value.trim())
  return !q || normalizar(`${x.titulo} ${x.item}`).includes(q)
}))
const PESO: Record<Prioridade, number> = { alta: 0, media: 1, baixa: 2 }
const ordenadas = computed(() => {
  const o = ordem.value
  if (!o) return filtradas.value
  const k = o.key as keyof TarefaDoProjeto
  const v = (x: TarefaDoProjeto) => k === 'prioridade' ? PESO[x.prioridade] : k === 'responsavel' ? pessoa(x.responsavel)?.nome ?? '' : String(x[k] ?? '')
  return [...filtradas.value].sort((a, b) => {
    const A = v(a), B = v(b)
    const c = typeof A === 'number' ? A - (B as number) : (A as string).localeCompare(B as string)
    return o.direction === 'asc' ? c : -c
  })
})
watch([fonte, busca, fStatus, fResp, fCat], () => { pagina.value = 1 })
const linhas = computed(() => ordenadas.value.slice((pagina.value - 1) * porPagina.value, pagina.value * porPagina.value))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'titulo', label: rt.value.colTarefa, sortable: true },
  { key: 'responsavel', label: rt.value.colResponsavel, sortable: true },
  { key: 'prazo', label: rt.value.colPrazo, sortable: true },
  { key: 'status', label: rt.value.colStatus, sortable: true },
  { key: 'prioridade', label: rt.value.colPrioridade, sortable: true },
  { key: 'origem', label: rt.value.colOrigem },
])

const fontes = computed(() => (['todas', 'rapida', 'agendada'] as Fonte[]).map(v => ({ v, r: rt.value.fonte[v], n: v === 'todas' ? todas.value.length : todas.value.filter(x => x.origem === v).length })))
const opStatus = computed(() => (['aberta', 'andamento', 'concluida'] as StatusDaTarefa[]).map(v => ({ value: v, label: rt.value.status[v] })))
const opResp = computed(() => [...new Set(todas.value.map(x => x.responsavel))].map(id => ({ value: id, label: pessoa(id)?.nome ?? '' })))
const opCat = computed(() => categorias.value.map(c => ({ value: c.id, label: c.name, icon: c.icon })))
const rotuloDoFiltro = (nome: string, n: number) => n ? `${nome} (${n})` : nome
const rapidosAtivos = computed(() => [fStatus.value, fResp.value, fCat.value].filter(x => x.length).length)
const temFiltro = computed(() => !!busca.value.trim() || rapidosAtivos.value > 0 || fonte.value !== 'todas')
function limparFiltros() {
  busca.value = ''
  fStatus.value = []
  fResp.value = []
  fCat.value = []
  fonte.value = 'todas'
}

const COR_DO_STATUS: Record<StatusDaTarefa, 'neutral' | 'info' | 'success'> = { aberta: 'neutral', andamento: 'info', concluida: 'success' }
const COR_DA_PRIORIDADE: Record<Prioridade, 'error' | 'warning' | 'neutral'> = { alta: 'error', media: 'warning', baixa: 'neutral' }
const nomeDaCategoria = (id: number) => prj.categorias.value.find(c => c.id === id)?.name ?? ''
const nomeDoFluxo = (id?: number) => prj.fluxos.value.find(f => f.id === id)?.nome ?? ''
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value, { day: '2-digit', month: 'short' })
const vencida = (x: TarefaDoProjeto) => x.status !== 'concluida' && x.prazo < HOJE
const venceHoje = (x: TarefaDoProjeto) => x.status !== 'concluida' && x.prazo === HOJE

function alternar(x: TarefaDoProjeto) {
  const ia = x.status !== 'concluida'
  prj.concluirTarefa(x.id)
  toast.add({ title: ia ? rt.value.concluida(x.titulo) : rt.value.reaberta(x.titulo), icon: ia ? 'i-lucide-circle-check' : 'i-lucide-rotate-ccw', color: ia ? 'success' : 'neutral' })
}
</script>

<template>
  <section class="overflow-hidden rounded-lg border border-default bg-default animate-[entrada_0.2s_ease-out_both]" :class="marca">
    <!-- a fonte, como no Painel de tarefas -->
    <div class="flex flex-wrap items-center gap-1 border-b border-default px-4 py-2">
      <UButton
        v-for="o in fontes"
        :key="o.v"
        :label="o.r"
        size="sm"
        :color="fonte === o.v ? 'primary' : 'neutral'"
        :variant="fonte === o.v ? 'soft' : 'ghost'"
        :aria-pressed="fonte === o.v"
        @click="fonte = o.v"
      >
        <template #trailing><span class="text-xs tabular-nums opacity-70">{{ o.n }}</span></template>
      </UButton>
      <p class="ml-auto hidden text-xs text-muted lg:block">{{ rt.dica }}</p>
    </div>

    <!-- barra: TablesPartsDataToolbar -->
    <div class="flex flex-wrap items-center gap-1.5 border-b border-default px-3 py-2 sm:px-4">
      <UChip :show="!!busca.trim()" color="error" size="sm">
        <UInput v-model="busca" :placeholder="rt.buscar" icon="i-lucide-search" size="sm" variant="soft" class="w-52" :aria-label="rt.buscar">
          <template v-if="busca" #trailing>
            <UButton icon="i-lucide-circle-x" color="neutral" variant="link" size="xs" :aria-label="t.diretorio.limparBusca" @click="busca = ''" />
          </template>
        </UInput>
      </UChip>
      <UTooltip v-if="temFiltro" :text="rt.limparFiltros">
        <UButton icon="i-lucide-filter-x" color="neutral" variant="ghost" size="sm" class="text-error" :aria-label="rt.limparFiltros" @click="limparFiltros" />
      </UTooltip>
      <div class="ml-auto flex items-center gap-1.5">
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
    <div v-if="mostrarRapidos" class="flex flex-wrap items-center gap-2 border-b border-default px-3 py-1.5 sm:px-4">
      <USelectMenu v-model="fStatus" :items="opStatus" value-key="value" multiple :search-input="false" size="sm" variant="soft" :icon="fStatus.length ? 'i-lucide-filter' : 'i-lucide-circle-dot'" class="w-40" :ui="{ base: fStatus.length ? 'text-primary' : '' }" :aria-label="rt.filtroStatus">
        <template #default>{{ rotuloDoFiltro(rt.filtroStatus, fStatus.length) }}</template>
      </USelectMenu>
      <USelectMenu v-model="fResp" :items="opResp" value-key="value" multiple size="sm" variant="soft" :icon="fResp.length ? 'i-lucide-filter' : 'i-lucide-user-round'" class="w-44" :ui="{ base: fResp.length ? 'text-primary' : '' }" :aria-label="rt.filtroResponsavel">
        <template #default>{{ rotuloDoFiltro(rt.filtroResponsavel, fResp.length) }}</template>
      </USelectMenu>
      <USelectMenu v-model="fCat" :items="opCat" value-key="value" multiple :search-input="false" size="sm" variant="soft" :icon="fCat.length ? 'i-lucide-filter' : 'i-lucide-folder'" class="w-44" :ui="{ base: fCat.length ? 'text-primary' : '' }" :aria-label="rt.filtroCategoria">
        <template #default>{{ rotuloDoFiltro(rt.filtroCategoria, fCat.length) }}</template>
      </USelectMenu>
      <span class="ml-auto text-xs text-muted">{{ rt.contagem(filtradas.length) }}</span>
    </div>

    <!-- tabela: EnTable do SDK -->
    <div class="pt-2">
      <EnTable
        :columns="colunas"
        :rows="linhas"
        :sort="ordem"
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
            <span class="min-w-0">
              <span class="block truncate text-sm font-medium" :class="(row as TarefaDoProjeto).status === 'concluida' ? 'text-muted line-through' : 'text-highlighted'">{{ (row as TarefaDoProjeto).titulo }}</span>
              <span class="block truncate text-xs text-muted">{{ (row as TarefaDoProjeto).item }} · {{ nomeDaCategoria((row as TarefaDoProjeto).categoria) }}</span>
            </span>
          </span>
        </template>
        <template #cell-responsavel="{ row }">
          <span class="flex items-center gap-2">
            <UAvatar size="2xs" :text="iniciais(pessoa((row as TarefaDoProjeto).responsavel)?.nome ?? '')" :alt="pessoa((row as TarefaDoProjeto).responsavel)?.nome" />
            <span class="whitespace-nowrap text-sm text-default">{{ pessoa((row as TarefaDoProjeto).responsavel)?.nome }}</span>
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
          <UBadge :label="rt.prioridade[(row as TarefaDoProjeto).prioridade]" :color="COR_DA_PRIORIDADE[(row as TarefaDoProjeto).prioridade]" variant="soft" size="sm" />
        </template>
        <template #cell-origem="{ row }">
          <span v-if="(row as TarefaDoProjeto).origem === 'agendada'" class="flex max-w-56 items-center gap-1.5 text-sm text-default">
            <UIcon name="i-lucide-workflow" class="size-3.5 shrink-0 text-muted" />
            <span class="truncate">{{ nomeDoFluxo((row as TarefaDoProjeto).fluxo) }}</span>
          </span>
          <span v-else class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-zap" class="size-3.5 shrink-0" />{{ rt.rapida }}</span>
        </template>
      </EnTable>
    </div>
    <Paginador v-model:pagina="pagina" v-model:por-pagina="porPagina" :t="t" :total="filtradas.length" />
  </section>
</template>
