<script setup lang="ts">
/**
 * A pasta Tarefas do item, em quadro.
 *
 * ⚠️ NADA AQUI É PROPOSTA, salvo a linha de apontamentos do cartão. Copiado do
 * develop em 11/11/2026 (`?folder=tarefas` no item do workspace de exploração):
 * chip Tarefas Rápidas, Visualizar, busca, Criado em, Todo o período, Filtros
 * por campo, as 4 colunas com ícone e contagem, o cartão (nome, menu, descrição,
 * prioridade, data) e o rodapé "Mostrando". A proposta acrescenta ao cartão a
 * linha "1 de 2 pendentes" quando a tarefa tem apontamentos.
 *
 * Não é o `EnKanbanBoard`: o `EnKanbanCardConfig` só monta selos a partir de
 * campos de seleção; um contador que muda com a lista pede um slot no cartão.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import type { TarefaDoItem } from './mocks'
import type { Lista } from './lista'
import type { Textos } from './textos'
import { pendente } from './lista'

const props = defineProps<{ t: Textos, tarefas: TarefaDoItem[], lista: Pick<Lista, 'pessoas'> }>()
const emit = defineEmits<{ abrir: [t: TarefaDoItem] }>()

const colunas: { valor: Task['status'], icone: string, ponto: string }[] = [
  { valor: 'pending', icone: 'i-lucide-circle-ellipsis', ponto: 'bg-info' },
  { valor: 'working', icone: 'i-lucide-circle-dashed', ponto: 'bg-warning' },
  { valor: 'blocked', icone: 'i-lucide-circle-pause', ponto: 'bg-error' },
  { valor: 'completed', icone: 'i-lucide-circle-check', ponto: 'bg-success' },
]
const corDaPrioridade: Record<string, 'neutral' | 'info' | 'warning' | 'error'> = { low: 'neutral', normal: 'info', high: 'warning', urgent: 'error' }

const porColuna = computed(() => Object.fromEntries(colunas.map(c => [c.valor, props.tarefas.filter(x => x.tarefa.status === c.valor)])) as Record<string, TarefaDoItem[]>)
const pendentes = (x: TarefaDoItem) => x.apontamentos.filter(a => pendente(a.estado)).length
const nomeDe = (id: number | null | undefined) => props.lista.pessoas.find(p => p.id === id)
</script>

<template>
  <div class="flex h-full min-h-0 flex-col gap-3 p-4">
    <div class="flex items-center gap-2">
      <UButton :label="t.tarefas.tarefasRapidas" icon="i-lucide-clipboard-list" color="primary" variant="soft" size="sm" />
      <UButton :label="t.tarefas.visualizar" icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" />
      <UButton :label="t.tarefas.novaTarefa" icon="i-lucide-plus" size="sm" class="ml-auto" />
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <UInput icon="i-lucide-search" :placeholder="t.tarefas.pesquisar" size="sm" variant="ghost" class="w-56" />
      <UButton :label="t.tarefas.criadoEm" icon="i-lucide-calendar" color="neutral" variant="ghost" size="sm" />
      <UButton :label="t.tarefas.todoPeriodo" icon="i-lucide-arrow-left-right" color="neutral" variant="ghost" size="sm" />
    </div>
    <div>
      <UButton :label="t.tarefas.filtrosPorCampo" icon="i-lucide-sliders-horizontal" color="neutral" variant="outline" size="sm" />
    </div>

    <div class="grid min-h-0 flex-1 grid-cols-[repeat(4,minmax(15rem,1fr))] gap-3 overflow-x-auto">
      <section v-for="c in colunas" :key="c.valor" class="flex min-h-0 flex-col rounded-lg border border-default bg-elevated/30">
        <header class="flex items-center gap-2 px-3 py-2.5 text-sm text-muted">
          <UIcon :name="c.icone" class="size-4" />
          <span>{{ porColuna[c.valor]!.length }} {{ t.tarefas.colunas[c.valor] }}</span>
          <span class="ml-auto size-2 rounded-full" :class="c.ponto" aria-hidden="true" />
        </header>
        <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2">
          <p v-if="!porColuna[c.valor]!.length" class="m-auto py-8 text-xs text-dimmed">{{ t.tarefas.nenhumResultado }}</p>
          <article
            v-for="(x, i) in porColuna[c.valor]"
            :key="x.tarefa.id"
            class="group relative flex flex-col gap-2 rounded-lg border border-default bg-default p-3 shadow-xs transition duration-150 hover:-translate-y-0.5 hover:border-accented hover:shadow-md [animation:entrada_.3s_ease-out_both]"
            :style="{ animationDelay: `${i * 40}ms` }"
          >
            <div class="flex items-start gap-2">
              <h4 class="flex-1 text-sm font-medium text-highlighted">
                <button type="button" class="text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary" @click="emit('abrir', x)">
                  {{ x.tarefa.name }}
                </button>
              </h4>
              <UIcon name="i-lucide-ellipsis-vertical" class="size-4 text-dimmed" />
            </div>
            <p class="line-clamp-2 text-xs text-muted">{{ x.tarefa.description || t.tarefas.semDescricao }}</p>

            <!-- Proposta: a linha de apontamentos -->
            <div v-if="x.apontamentos.length" class="flex items-center gap-2 rounded-md bg-elevated px-2 py-1.5 text-xs">
              <UIcon name="i-lucide-list-checks" class="size-3.5 text-primary" />
              <span class="text-highlighted">{{ t.tarefas.apontamentos(pendentes(x), x.apontamentos.length) }}</span>
              <span class="ml-auto flex h-1.5 w-12 overflow-hidden rounded-full bg-accented" aria-hidden="true">
                <span class="bg-success transition-[width] duration-500" :style="{ width: `${((x.apontamentos.length - pendentes(x)) / x.apontamentos.length) * 100}%` }" />
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <UBadge :label="t.tarefas.prioridades[x.tarefa.priority]" icon="i-lucide-gauge" :color="corDaPrioridade[x.tarefa.priority]" variant="soft" size="sm" />
              <UBadge v-if="x.tarefa.due_date" :label="t.dataHora(x.tarefa.due_date)" icon="i-lucide-calendar" color="neutral" variant="outline" size="sm" />
              <UAvatar v-if="nomeDe(x.tarefa.assigned_to)" :text="nomeDe(x.tarefa.assigned_to)!.iniciais" :alt="nomeDe(x.tarefa.assigned_to)!.nome" size="2xs" class="ml-auto" />
            </div>
          </article>
        </div>
      </section>
    </div>
    <p class="text-xs text-muted">{{ t.tarefas.mostrando(tarefas.length) }}</p>
  </div>
</template>
