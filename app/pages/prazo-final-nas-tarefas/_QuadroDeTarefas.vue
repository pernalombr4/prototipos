<script setup lang="ts">
/**
 * Kanban de Tarefas Rápidas com o prazo final no cartão (RF006).
 *
 * As 4 raias por status e o cartão (título, responsável, data) seguem o quadro
 * do develop. A proposta é a linha de datas do cartão: o prazo, como hoje, e o
 * prazo final ao lado, com a bandeira. Cartão sem prazo final mostra só o prazo.
 *
 * Não é o `EnKanbanBoard`: o `EnKanbanCardConfig` tem um campo de data só
 * (`dueDateField`). Mostrar as 2 datas pede um segundo campo no componente.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Textos } from './textos'
import type { Situacao, TarefaRapida } from './mocks'
import { membros } from './mocks'
import { atrasada, formatar, prazoFinalVencido } from './datas'

const props = defineProps<{
  t: Textos
  idioma: Idioma
  tarefas: TarefaRapida[]
}>()
const emit = defineEmits<{ abrir: [tarefa: TarefaRapida] }>()

const raias: { valor: Situacao, cor: string }[] = [
  { valor: 'pending', cor: 'bg-neutral-400' },
  { valor: 'working', cor: 'bg-info' },
  { valor: 'blocked', cor: 'bg-warning' },
  { valor: 'completed', cor: 'bg-success' },
]

const porRaia = computed(() => Object.fromEntries(raias.map(r => [r.valor, props.tarefas.filter(t => t.status === r.valor)])) as Record<Situacao, TarefaRapida[]>)
const fmt = (d: string | null) => formatar(d, props.idioma)
const nomeDe = (id: number | null) => membros.find(m => m.id === id)?.nome
</script>

<template>
  <div class="grid gap-3 overflow-x-auto pb-2 md:grid-cols-4">
    <section
      v-for="raia in raias"
      :key="raia.valor"
      class="flex min-w-64 flex-col rounded-xl border border-default bg-elevated/40"
      :aria-label="t.situacoes[raia.valor]"
    >
      <header class="flex items-center gap-2 px-3 py-2.5">
        <span class="size-2 rounded-full" :class="raia.cor" aria-hidden="true" />
        <span class="text-sm font-semibold text-highlighted">{{ t.situacoes[raia.valor] }}</span>
        <span class="ml-auto text-xs text-muted">{{ porRaia[raia.valor].length }}</span>
      </header>

      <div class="flex flex-1 flex-col gap-2 px-2 pb-2">
        <p v-if="!porRaia[raia.valor].length" class="py-6 text-center text-xs text-muted">{{ t.colunaVazia }}</p>
        <article
          v-for="(tarefa, i) in porRaia[raia.valor]"
          :key="tarefa.id"
          class="group relative rounded-lg border border-default bg-default p-3 shadow-xs transition hover:-translate-y-0.5 hover:border-accented hover:shadow-md [animation:entrada_.3s_ease-out_both]"
          :class="prazoFinalVencido(tarefa) ? 'border-l-4 border-l-error bg-error/5' : atrasada(tarefa) ? 'border-l-2 border-l-error' : ''"
          :style="{ animationDelay: `${i * 40}ms` }"
        >
          <h4 class="line-clamp-2 text-sm font-medium text-highlighted">
            <button
              type="button"
              class="text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
              :aria-label="t.abrirTarefa(tarefa.name)"
              @click="emit('abrir', tarefa)"
            >
              {{ tarefa.name }}
            </button>
          </h4>

          <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span
              v-if="tarefa.due_date"
              class="flex items-center gap-1"
              :class="atrasada(tarefa) ? 'font-medium text-error' : 'text-toned'"
            >
              <UIcon name="i-lucide-calendar" class="size-3.5" aria-hidden="true" />
              <span class="sr-only">{{ t.colunas.prazo }}:</span>
              {{ fmt(tarefa.due_date) }}
            </span>
            <span v-if="tarefa.final_due_date" class="flex items-center gap-1" :class="prazoFinalVencido(tarefa) ? 'font-medium text-error' : 'text-toned'">
              <UIcon name="i-lucide-flag" class="size-3.5" aria-hidden="true" />
              <span class="sr-only">{{ t.colunas.prazoFinal }}:</span>
              {{ fmt(tarefa.final_due_date) }}
            </span>
            <UBadge v-if="prazoFinalVencido(tarefa)" :label="t.prazoFinalVencido" color="error" variant="solid" size="sm" icon="i-lucide-flag" />
            <UBadge v-else-if="atrasada(tarefa)" :label="t.atrasada" color="error" variant="subtle" size="sm" />
            <UAvatar :alt="nomeDe(tarefa.assigned_to) ?? '?'" size="2xs" class="ml-auto" />
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
