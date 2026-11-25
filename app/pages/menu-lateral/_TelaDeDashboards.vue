<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { dashboardDoDestino, destinoDoDashboard, useDashboards } from './dashboards'
import type { DashboardDeItens } from './dashboards'
import type { Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * DASHBOARDS DE ITENS (rodada 35), no modelo do ClickUp.
 *
 * Duas telas no mesmo componente, porque leem o mesmo estado:
 *   - a central (Análise > Dashboards): todos os dashboards do workspace, com
 *     a chave "No menu da categoria" em cada linha;
 *   - a de um dashboard (destino "dash:<id>"), aberta pelo submenu da
 *     categoria, como tela separada.
 * Os gráficos são ilustrativos: a demanda é a porta no menu, não o dashboard.
 */
const props = defineProps<{
  t: TextosDaTela
  destino: string
  categorias: Categoria[]
}>()

const emit = defineEmits<{ irPara: [destino: string] }>()

const dashboards = useDashboards()
const toast = useToast()

const aberto = computed(() => {
  const id = dashboardDoDestino(props.destino)
  return id ? dashboards.achar(id) : null
})

const nomeDaCategoria = (id: number) => props.categorias.find(c => c.id === id)?.name ?? ''

const colunas = computed<TableColumn<DashboardDeItens>[]>(() => [
  { accessorKey: 'nome', header: props.t.dashColNome },
  { id: 'categoria', header: props.t.dashColCategoria },
  { accessorKey: 'dono', header: props.t.dashColDono },
  { accessorKey: 'atualizadoEm', header: props.t.dashColAtualizado },
  { id: 'menu', header: props.t.dashColNoMenu },
])

function alternarMenu(d: DashboardDeItens, mostrar: boolean) {
  dashboards.mostrarNaCategoria(d.id, mostrar)
  toast.add({
    title: mostrar ? props.t.dashEntrouNoMenu(d.nome, nomeDaCategoria(d.categoriaId)) : props.t.dashSaiuDoMenu(d.nome),
    icon: 'i-lucide-layout-dashboard',
    color: 'neutral',
  })
}

function novo() {
  const c = props.categorias[0]
  if (!c) return
  const d = dashboards.criar(props.t.dashNomeNovo(c.name), c.id, '')
  d.noMenuDaCategoria = false
  emit('irPara', destinoDoDashboard(d.id))
}

const formatarData = (iso: string) => iso.split('-').reverse().join('/')
</script>

<template>
  <!-- ---------------- um dashboard, aberto pelo menu da categoria ---------------- -->
  <div v-if="aberto" :key="aberto.id" class="animate-[entrada_0.25s_ease-out_both]">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl font-bold text-highlighted">{{ aberto.nome }}</h1>
        <p class="mt-0.5 text-sm text-muted">{{ props.t.dashItensDe(nomeDaCategoria(aberto.categoriaId)) }}</p>
      </div>
      <div class="flex shrink-0 items-center gap-1.5">
        <USwitch
          :model-value="aberto.noMenuDaCategoria"
          :label="props.t.dashColNoMenu"
          size="sm"
          @update:model-value="v => alternarMenu(aberto!, v)"
        />
        <UButton :label="props.t.dashTodos" icon="i-lucide-layout-grid" size="sm" color="neutral" variant="outline" @click="emit('irPara', 't-dashboards')" />
      </div>
    </div>

    <div class="grid gap-3 sm:grid-cols-3">
      <div v-for="n in 3" :key="n" class="rounded-xl border border-default p-4">
        <USkeleton class="h-3 w-20" />
        <USkeleton class="mt-3 h-7 w-12" />
      </div>
    </div>
    <div class="mt-3 grid gap-3 sm:grid-cols-2">
      <div v-for="n in 2" :key="n" class="flex h-44 items-end gap-2 rounded-xl border border-default p-4">
        <div v-for="b in 7" :key="b" class="flex-1 rounded-t bg-primary/20" :style="{ height: `${20 + ((b * 37 + n * 13) % 70)}%` }" />
      </div>
    </div>
  </div>

  <!-- ---------------- a tela central ---------------- -->
  <div v-else class="animate-[entrada_0.25s_ease-out_both]">
    <div class="mb-4 flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h1 class="text-xl font-bold text-highlighted">{{ props.t.dashboards }}</h1>
        <p class="mt-0.5 max-w-2xl text-sm leading-relaxed text-muted">{{ props.t.dashDescricao }}</p>
      </div>
      <UButton
        v-if="props.categorias.length"
        :label="props.t.dashNovo"
        icon="i-lucide-plus"
        size="sm"
        color="primary"
        variant="soft"
        class="shrink-0"
        @click="novo"
      />
    </div>

    <div v-if="!dashboards.lista.value.length" class="flex flex-col items-center rounded-xl border border-dashed border-default px-6 py-12 text-center">
      <UIcon name="i-lucide-layout-dashboard" class="size-8 text-muted" />
      <p class="mt-3 text-sm font-semibold text-highlighted">{{ props.t.dashVazioTitulo }}</p>
      <p class="mt-1 max-w-md text-sm text-muted">
        {{ props.categorias.length ? props.t.dashVazioDescricao : props.t.dashVazioSemCategoria }}
      </p>
    </div>

    <div v-else class="overflow-hidden rounded-xl border border-default">
      <UTable :data="dashboards.lista.value" :columns="colunas" class="w-full">
        <template #nome-cell="{ row }">
          <UButton
            :label="row.original.nome"
            icon="i-lucide-layout-dashboard"
            size="sm"
            color="neutral"
            variant="link"
            class="px-0 font-medium"
            @click="emit('irPara', destinoDoDashboard(row.original.id))"
          />
        </template>
        <template #categoria-cell="{ row }">
          {{ nomeDaCategoria(row.original.categoriaId) }}
        </template>
        <template #dono-cell="{ row }">
          {{ row.original.dono || props.t.dashVoce }}
        </template>
        <template #atualizadoEm-cell="{ row }">
          {{ formatarData(row.original.atualizadoEm) }}
        </template>
        <template #menu-cell="{ row }">
          <USwitch
            :model-value="row.original.noMenuDaCategoria"
            size="sm"
            :aria-label="props.t.dashColNoMenu"
            @update:model-value="v => alternarMenu(row.original, v)"
          />
        </template>
      </UTable>
    </div>
    <p v-if="dashboards.lista.value.length" class="mt-3 text-xs text-muted">{{ props.t.dashRodape }}</p>
  </div>
</template>
