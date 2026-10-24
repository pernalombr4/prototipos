<script setup lang="ts">
/**
 * A aba Execuções do editor.
 *
 * Cópia do develop (24/10/2026): busca "Buscar execuções...", colunas Ações,
 * Referência, Status, Vers e Iniciado em, menu da linha com "Ver Detalhes" e
 * "Abrir Execução", paginação de 25.
 *
 * PROPOSTA:
 * - 4 status novos (Na fila, Ignorada, Retida, Interrompida), cada um com
 *   ícone próprio e o motivo escrito embaixo, porque a cor sozinha não basta;
 * - "Esperando tarefa" embaixo do Em andamento, com a dica de que não ocupa vaga;
 * - os filtros por status em chips, acima da tabela, com a contagem;
 * - no filtro Retida: seleção, "Liberar" e "Descartar" em lote.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Execucao, StatusDaExecucao } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  versao: 'hoje' | 'completa' | 'mvp'
}>()

const execucoes = defineModel<Execucao[]>('execucoes', { required: true })
const filtro = defineModel<StatusDaExecucao | 'todas'>('filtro', { required: true })

const idioma = useIdioma()
const toast = useToast()

const estiloDoStatus: Record<StatusDaExecucao, { cor: 'success' | 'info' | 'error' | 'neutral' | 'warning', icone: string, variante: 'subtle' | 'outline' }> = {
  completed: { cor: 'success', icone: 'i-lucide-circle-check', variante: 'subtle' },
  working: { cor: 'info', icone: 'i-lucide-loader', variante: 'subtle' },
  error: { cor: 'error', icone: 'i-lucide-circle-x', variante: 'subtle' },
  deleted: { cor: 'neutral', icone: 'i-lucide-trash-2', variante: 'subtle' },
  queued: { cor: 'neutral', icone: 'i-lucide-clock', variante: 'outline' },
  skipped: { cor: 'neutral', icone: 'i-lucide-skip-forward', variante: 'subtle' },
  held: { cor: 'warning', icone: 'i-lucide-hand', variante: 'subtle' },
  stopped: { cor: 'error', icone: 'i-lucide-octagon-x', variante: 'outline' },
}

/** O MVP não tem Ignorada nem Retida: o excesso só espera na fila. */
const statusNovos = computed<StatusDaExecucao[]>(() => props.versao === 'mvp' ? ['queued', 'stopped'] : ['queued', 'held', 'skipped', 'stopped'])
const ordemDosFiltros = computed<StatusDaExecucao[]>(() => [...statusNovos.value, 'working', 'error', 'completed'])

const contagem = computed(() => {
  const c: Partial<Record<StatusDaExecucao, number>> = {}
  for (const e of execucoes.value) c[e.status] = (c[e.status] ?? 0) + 1
  return c
})

const chips = computed(() => ordemDosFiltros.value.filter(s => (contagem.value[s] ?? 0) > 0 || s === filtro.value))

const busca = ref('')
const filtradas = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  return execucoes.value.filter(e =>
    (filtro.value === 'todas' || e.status === filtro.value)
    && (!termo || e.reference?.toLowerCase().includes(termo) || e.title?.toLowerCase().includes(termo)),
  )
})

const POR_PAGINA = 25
const pagina = ref(1)
watch([filtro, busca], () => { pagina.value = 1 })
const visiveis = computed(() => filtradas.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA))

interface Linha extends Record<string, unknown> { id: number, e: Execucao }
const linhas = computed<Linha[]>(() => visiveis.value.map(e => ({ id: e.id, e })))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'referencia', label: props.t.execucoes.colunas.referencia },
  { key: 'status', label: props.t.execucoes.colunas.status, sortable: true },
  { key: 'versao', label: props.t.execucoes.colunas.versao },
  { key: 'iniciado', label: props.t.execucoes.colunas.iniciadoEm, sortable: true },
])

/* ---------- retidas: liberar e descartar ---------- */

const selecionadas = ref<Linha[]>([])
watch(filtro, () => { selecionadas.value = [] })
const emLote = computed(() => props.versao === 'completa' && filtro.value === 'held')

function decidir(ids: number[], acao: 'liberar' | 'descartar') {
  const alvo = new Set(ids)
  execucoes.value = execucoes.value.map(e => alvo.has(e.id)
    ? { ...e, status: acao === 'liberar' ? 'queued' : 'skipped', protection_reason: acao === 'liberar' ? 'semVaga' : e.protection_reason }
    : e)
  selecionadas.value = []
  toast.add({
    title: acao === 'liberar' ? props.t.execucoes.liberadas(ids.length) : props.t.execucoes.descartadas(ids.length),
    icon: acao === 'liberar' ? 'i-lucide-play' : 'i-lucide-skip-forward',
    color: acao === 'liberar' ? 'success' : 'neutral',
  })
}

function menuDaLinha(e: Execucao): DropdownMenuItem[][] {
  const base: DropdownMenuItem[] = [
    { label: props.t.execucoes.verDetalhes, icon: 'i-lucide-eye' },
    { label: props.t.execucoes.abrirExecucao, icon: 'i-lucide-arrow-up-right' },
  ]
  if (e.status !== 'held' || props.versao !== 'completa') return [base]
  return [base, [
    { label: props.t.execucoes.liberar, icon: 'i-lucide-play', onSelect: () => decidir([e.id], 'liberar') },
    { label: props.t.execucoes.descartar, icon: 'i-lucide-skip-forward', onSelect: () => decidir([e.id], 'descartar') },
  ]]
}

const formatoData = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', year: 'numeric' }))
const formatoHora = computed(() => new Intl.DateTimeFormat(props.t.locale, { hour: '2-digit', minute: '2-digit' }))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- Busca (cópia do develop) -->
    <div class="flex items-center gap-2 border-b border-default px-4 py-2">
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.execucoes.buscar" variant="none" class="flex-1" />
      <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="xs" :aria-label="t.execucoes.colunas.status" />
      <UButton icon="i-lucide-chevron-up" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.recolherMenu" />
    </div>

    <!-- PROPOSTA: filtro por status -->
    <div v-if="versao !== 'hoje' && execucoes.length" class="flex flex-wrap items-center gap-1.5 border-b border-default px-4 py-2">
      <UButton
        :label="t.execucoes.filtros.todas"
        size="xs"
        :color="filtro === 'todas' ? 'primary' : 'neutral'"
        :variant="filtro === 'todas' ? 'soft' : 'outline'"
        class="rounded-full"
        @click="filtro = 'todas'"
      >
        <template #trailing>
          <span class="text-xs tabular-nums text-muted">{{ execucoes.length }}</span>
        </template>
      </UButton>
      <TransitionGroup enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-95" leave-active-class="transition duration-150" leave-to-class="opacity-0 scale-95">
        <UButton
          v-for="s in chips"
          :key="s"
          :label="t.execucoes.status[s]"
          :icon="estiloDoStatus[s].icone"
          size="xs"
          :color="filtro === s ? 'primary' : 'neutral'"
          :variant="filtro === s ? 'soft' : 'outline'"
          class="rounded-full"
          @click="filtro = s"
        >
          <template #trailing>
            <span class="text-xs tabular-nums text-muted">{{ contagem[s] ?? 0 }}</span>
          </template>
        </UButton>
      </TransitionGroup>
    </div>

    <!-- PROPOSTA: decisão em lote das retidas -->
    <div v-if="emLote && (contagem.held ?? 0) > 0" class="flex flex-wrap items-center gap-2 border-b border-default bg-warning/5 px-4 py-2">
      <UIcon name="i-lucide-hand" class="size-4 shrink-0 text-warning" />
      <p class="min-w-0 flex-1 text-sm text-toned">{{ t.execucoes.retidasAjuda }}</p>
      <UButton
        :label="selecionadas.length ? t.execucoes.liberarSelecionadas(selecionadas.length) : t.execucoes.liberar"
        icon="i-lucide-play"
        size="xs"
        :disabled="!selecionadas.length"
        @click="decidir(selecionadas.map(l => l.id), 'liberar')"
      />
      <UButton
        :label="selecionadas.length ? t.execucoes.descartarSelecionadas(selecionadas.length) : t.execucoes.descartar"
        icon="i-lucide-skip-forward"
        size="xs"
        color="neutral"
        variant="outline"
        :disabled="!selecionadas.length"
        @click="decidir(selecionadas.map(l => l.id), 'descartar')"
      />
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-2">
      <EnTable
        v-model:selected="selecionadas"
        :columns="colunas"
        :rows="linhas"
        :selectable="emLote"
        :locale="idioma"
        :empty-state="{ icon: 'i-lucide-circle-play', title: filtro === 'todas' ? t.execucoes.vazio : t.execucoes.vazioFiltro }"
      >
        <template #cell-referencia="{ row }">
          <span class="flex flex-col">
            <span class="font-mono text-xs text-toned">{{ (row as Linha).e.reference }}</span>
            <span v-if="versao !== 'hoje'" class="max-w-72 truncate text-xs text-muted">{{ (row as Linha).e.title }}</span>
          </span>
        </template>
        <template #cell-status="{ row }">
          <span class="flex flex-col items-start gap-0.5 py-1">
            <UBadge
              :label="t.execucoes.status[(row as Linha).e.status]"
              :icon="estiloDoStatus[(row as Linha).e.status].icone"
              :color="estiloDoStatus[(row as Linha).e.status].cor"
              :variant="estiloDoStatus[(row as Linha).e.status].variante"
              size="sm"
            />
            <template v-if="versao !== 'hoje'">
              <span v-if="(row as Linha).e.protection_reason" class="text-xs text-muted">{{ t.execucoes.motivos[(row as Linha).e.protection_reason!] }}</span>
              <UTooltip v-else-if="(row as Linha).e.esperando" :text="t.execucoes.naoOcupaVaga">
                <span class="inline-flex items-center gap-1 text-xs text-muted">
                  <UIcon :name="(row as Linha).e.esperando === 'tarefa' ? 'i-lucide-user-round-check' : 'i-lucide-hourglass'" class="size-3" />
                  {{ t.execucoes.esperando[(row as Linha).e.esperando!] }}
                </span>
              </UTooltip>
            </template>
          </span>
        </template>
        <template #cell-versao="{ row }">
          <span class="font-mono text-xs text-toned">v{{ (row as Linha).e.version }}</span>
        </template>
        <template #cell-iniciado="{ row }">
          <span class="inline-flex items-center gap-1.5 text-sm text-toned">
            {{ formatoData.format((row as Linha).e.created_at) }}
            <span class="text-xs text-muted">{{ formatoHora.format((row as Linha).e.created_at) }}</span>
          </span>
        </template>
        <template #actions="{ row }">
          <UDropdownMenu :items="menuDaLinha((row as Linha).e)" :ui="{ content: 'w-48' }">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.execucoes.acoes" />
          </UDropdownMenu>
        </template>
      </EnTable>
    </div>

    <!-- Rodapé (cópia do develop) -->
    <div class="flex shrink-0 items-center justify-between gap-2 border-t border-default px-4 py-2 text-xs text-muted">
      <span>{{ filtradas.length ? t.execucoes.mostrando((pagina - 1) * POR_PAGINA + 1, Math.min(pagina * POR_PAGINA, filtradas.length), filtradas.length) : '' }}</span>
      <UPagination v-model:page="pagina" :total="filtradas.length" :items-per-page="POR_PAGINA" size="xs" :sibling-count="1" />
    </div>
  </div>
</template>
