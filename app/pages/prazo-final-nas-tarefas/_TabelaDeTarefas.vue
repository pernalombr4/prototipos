<script setup lang="ts">
/**
 * Tabela de Tarefas Rápidas com a coluna "Prazo final" (RF005, RF008, RF012).
 *
 * É `UTable` e não `EnTable`: o `EnTable` recebe o rótulo do cabeçalho como
 * texto e não tem slot de cabeçalho, então não dá lugar ao filtro da coluna.
 * Registrado no DECISOES.md.
 */
import type { TableColumn } from '@nuxt/ui'
import type { Idioma } from '~/composables/useIdioma'
import type { Textos } from './textos'
import type { TarefaRapida } from './mocks'
import { membros } from './mocks'
import { atrasada, formatar, prazoFinalVencido } from './datas'
import CabecalhoDeData from './_CabecalhoDeData.vue'
import type { FiltroDeColuna } from './datas'

const props = defineProps<{
  t: Textos
  idioma: Idioma
  tarefas: TarefaRapida[]
  carregando: boolean
}>()
const emit = defineEmits<{ abrir: [tarefa: TarefaRapida] }>()

type ColunaDeData = 'due_date' | 'final_due_date'
const ordem = ref<{ campo: ColunaDeData, direcao: 'asc' | 'desc' } | null>(null)
const filtros = ref<Record<ColunaDeData, FiltroDeColuna>>({
  due_date: { de: null, ate: null },
  final_due_date: { de: null, ate: null },
})

const fmt = (d: string | null) => formatar(d, props.idioma)
const nomeDe = (id: number | null) => membros.find(m => m.id === id)?.nome

function rotuloDaColuna(c: ColunaDeData) {
  return c === 'due_date' ? props.t.colunas.prazo : props.t.colunas.prazoFinal
}

/** Filtro da coluna: tarefa sem a data fica de fora quando o filtro está ligado. */
const linhas = computed(() => {
  let lista = props.tarefas.filter(t => (['due_date', 'final_due_date'] as const).every((c) => {
    const f = filtros.value[c]
    if (!f.de && !f.ate) return true
    const v = t[c]
    if (!v) return false
    return (!f.de || v >= f.de) && (!f.ate || v <= f.ate)
  }))
  const o = ordem.value
  if (o) {
    lista = [...lista].sort((a, b) => {
      const va = a[o.campo]
      const vb = b[o.campo]
      if (!va && !vb) return 0
      if (!va) return 1 // RF008: sem data vai para o fim, nos dois sentidos
      if (!vb) return -1
      return o.direcao === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
  }
  return lista
})

const chips = computed(() => (['due_date', 'final_due_date'] as const).flatMap((c) => {
  const f = filtros.value[c]
  const r = rotuloDaColuna(c)
  if (f.de && f.ate) return [{ c, texto: props.t.chipEntre(r, fmt(f.de), fmt(f.ate)) }]
  if (f.ate) return [{ c, texto: props.t.chipAte(r, fmt(f.ate)) }]
  if (f.de) return [{ c, texto: props.t.chipAPartir(r, fmt(f.de)) }]
  return []
}))

function ordenar(campo: ColunaDeData, direcao: 'asc' | 'desc' | null) {
  ordem.value = direcao ? { campo, direcao } : null
}

const colunas = computed<TableColumn<TarefaRapida>[]>(() => [
  { accessorKey: 'name', header: props.t.colunas.nome },
  { accessorKey: 'status', header: props.t.colunas.status },
  { accessorKey: 'assigned_to', header: props.t.colunas.responsavel },
  { accessorKey: 'priority', header: props.t.colunas.prioridade },
  { accessorKey: 'due_date', header: props.t.colunas.prazo },
  { accessorKey: 'final_due_date', header: props.t.colunas.prazoFinal },
])

const corDaSituacao = { pending: 'neutral', working: 'info', blocked: 'warning', completed: 'success' } as const
</script>

<template>
  <div class="space-y-2">
    <TransitionGroup
      v-if="chips.length"
      tag="div"
      class="flex flex-wrap gap-2"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <UBadge
        v-for="chip in chips"
        :key="chip.c"
        color="primary"
        variant="subtle"
        class="gap-1 pr-1"
      >
        {{ chip.texto }}
        <UButton
          icon="i-lucide-x"
          color="primary"
          variant="link"
          size="xs"
          class="p-0.5"
          :aria-label="t.tirarFiltro(chip.texto)"
          @click="filtros[chip.c] = { de: null, ate: null }"
        />
      </UBadge>
    </TransitionGroup>

    <UTable
      :data="linhas"
      :columns="colunas"
      :loading="carregando"
      :empty="t.filtroVazioTitulo"
      sticky="header"
      class="rounded-lg border border-default"
      :ui="{ tr: 'cursor-pointer transition-colors hover:bg-elevated/60 [animation:entrada_.3s_ease-out_both]', td: 'py-2.5' }"
      @select="(_e: Event, row: { original: TarefaRapida }) => emit('abrir', row.original)"
    >
      <template #due_date-header>
        <CabecalhoDeData
          v-model:filtro="filtros.due_date"
          :t="t"
          :rotulo="t.colunas.prazo"
          :ordem="ordem?.campo === 'due_date' ? ordem.direcao : null"
          @ordenar="d => ordenar('due_date', d)"
        />
      </template>
      <template #final_due_date-header>
        <CabecalhoDeData
          v-model:filtro="filtros.final_due_date"
          :t="t"
          :rotulo="t.colunas.prazoFinal"
          :ordem="ordem?.campo === 'final_due_date' ? ordem.direcao : null"
          @ordenar="d => ordenar('final_due_date', d)"
        />
      </template>

      <template #name-cell="{ row }">
        <span class="font-medium text-highlighted">{{ row.original.name }}</span>
      </template>
      <template #status-cell="{ row }">
        <UBadge :label="t.situacoes[row.original.status]" :color="corDaSituacao[row.original.status]" variant="subtle" size="sm" />
      </template>
      <template #assigned_to-cell="{ row }">
        <span class="flex items-center gap-2 text-toned">
          <UAvatar :alt="nomeDe(row.original.assigned_to) ?? '?'" size="2xs" />
          {{ nomeDe(row.original.assigned_to) ?? t.semResponsavel }}
        </span>
      </template>
      <template #priority-cell="{ row }">
        <span class="text-toned">{{ t.prioridades[row.original.priority] }}</span>
      </template>
      <template #due_date-cell="{ row }">
        <span v-if="row.original.due_date" class="flex items-center gap-2" :class="atrasada(row.original) ? 'text-error' : 'text-toned'">
          {{ fmt(row.original.due_date) }}
          <UBadge v-if="atrasada(row.original) && !prazoFinalVencido(row.original)" :label="t.atrasada" color="error" variant="subtle" size="sm" />
        </span>
      </template>
      <template #final_due_date-cell="{ row }">
        <span v-if="prazoFinalVencido(row.original)" class="flex items-center gap-1.5 font-medium text-error">
          <UIcon name="i-lucide-flag" class="size-3.5" aria-hidden="true" />
          {{ fmt(row.original.final_due_date) }}
          <UBadge :label="t.vencido" color="error" variant="solid" size="sm" />
        </span>
        <span v-else-if="row.original.final_due_date" class="flex items-center gap-1.5 text-toned">
          <UIcon name="i-lucide-flag" class="size-3.5 text-muted" aria-hidden="true" />
          {{ fmt(row.original.final_due_date) }}
        </span>
        <span v-else class="sr-only">{{ t.semPrazoFinal }}</span>
      </template>
    </UTable>
  </div>
</template>
