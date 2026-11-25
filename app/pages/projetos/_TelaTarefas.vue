<script setup lang="ts">
/**
 * Minhas tarefas. CASCA: a lista de tarefas de hoje, resumida sobre o EnTable.
 * PROPOSTA: a coluna Projeto e o filtro por projeto. A tarefa de categoria do workspace mostra
 * "Sem projeto". O projeto sai da categoria do item; a tarefa não ganha campo novo.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { minhasTarefas, type Tarefa } from './mocks'
import { COR_DO_PROJETO, useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()
const idioma = useIdioma()

/** 'todos', 'workspace' ou o id do projeto. */
const filtro = ref<string>('todos')

const visiveis = computed(() => minhasTarefas.filter((x) => {
  const c = prj.categorias.value.find(k => k.id === x.categoria)
  return !!c && prj.veCategoria(c)
}))
const linhas = computed(() => visiveis.value
  .filter((x) => {
    if (filtro.value === 'todos') return true
    const c = prj.categorias.value.find(k => k.id === x.categoria)!
    return filtro.value === 'workspace' ? c.projeto === null : String(c.projeto) === filtro.value
  })
  .map(x => ({ ...x, projeto: '' })))

const opcoes = computed(() => [
  { value: 'todos', label: props.t.tarefas.todosOsProjetos },
  { value: 'workspace', label: props.t.tarefas.doWorkspace, icon: 'i-lucide-building' },
  ...prj.queEntro.value.map(p => ({ value: String(p.id), label: p.nome, icon: p.icone })),
])

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'titulo', label: props.t.tarefas.tarefa },
  { key: 'item', label: props.t.tarefas.item },
  { key: 'categoria', label: props.t.tarefas.categoria },
  { key: 'projeto', label: props.t.tarefas.projeto },
  { key: 'prazo', label: props.t.tarefas.prazo },
])

function projetoDe(x: Tarefa) {
  const c = prj.categorias.value.find(k => k.id === x.categoria)
  return c ? prj.projetoDa(c) : null
}
</script>

<template>
  <div class="flex flex-col">
    <div class="px-6 pb-3 pt-5">
      <h1 class="text-xl font-semibold text-highlighted">{{ t.tarefas.titulo }}</h1>
      <p class="mt-0.5 text-sm text-muted">{{ t.tarefas.subtitulo }}</p>
    </div>
    <div class="flex flex-wrap items-center gap-3 border-y border-default px-4 py-2.5">
      <USelect v-model="filtro" :items="opcoes" size="sm" icon="i-lucide-folder-kanban" class="w-60" :class="marca" :aria-label="t.tarefas.filtroProjeto" />
    </div>
    <div class="animate-[entrada_.25s_ease-out]">
      <EnTable
        :columns="colunas"
        :rows="linhas"
        :pagination="{ page: 1, pageCount: 1, total: linhas.length }"
        :empty-state="{ icon: 'i-lucide-list-checks', title: t.tarefas.vazio, description: '' }"
        :locale="idioma"
      >
        <template #cell-titulo="{ row }">
          <span class="flex items-center gap-2 text-sm text-highlighted">
            <UIcon name="i-lucide-circle" class="size-4 text-muted" />{{ (row as Tarefa).titulo }}
          </span>
        </template>
        <template #cell-item="{ row }">
          <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as Tarefa).item }}</UBadge>
        </template>
        <template #cell-categoria="{ row }">
          <span class="text-sm text-default">{{ prj.categorias.value.find(c => c.id === (row as Tarefa).categoria)?.name }}</span>
        </template>
        <template #cell-projeto="{ row }">
          <span :class="marca">
            <button
              v-if="projetoDe(row as Tarefa)"
              type="button"
              class="flex items-center gap-1.5 rounded text-sm text-default hover:underline focus-visible:outline-2 focus-visible:outline-primary"
              @click.stop="prj.abrirProjeto(projetoDe(row as Tarefa)!.id)"
            >
              <span class="flex size-5 items-center justify-center rounded" :class="COR_DO_PROJETO[projetoDe(row as Tarefa)!.cor]"><UIcon :name="projetoDe(row as Tarefa)!.icone" class="size-3" /></span>
              {{ projetoDe(row as Tarefa)!.nome }}
            </button>
            <span v-else class="text-sm text-muted">{{ t.tarefas.doWorkspace }}</span>
          </span>
        </template>
        <template #cell-prazo="{ row }">
          <span class="flex items-center gap-2">
            <span class="text-sm" :class="(row as Tarefa).atrasada ? 'text-error' : 'text-muted'">{{ new Date(`${(row as Tarefa).prazo}T12:00:00`).toLocaleDateString(idioma) }}</span>
            <UBadge v-if="(row as Tarefa).atrasada" :label="t.tarefas.atrasada" color="error" variant="subtle" size="sm" />
          </span>
        </template>
      </EnTable>
    </div>
  </div>
</template>
