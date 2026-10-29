<script setup lang="ts">
/**
 * Painel "Para agendar": o que ainda não tem lugar na grade (atrasadas, sem data e as de SLA que vencem na semana sem
 * tempo reservado). O cartão se arrasta para a grade (HTML5 drag and drop) ou abre o detalhe com o clique, que é a
 * alternativa de teclado ao arraste. Padrão do ClickUp, do Jira e do Airtable (PESQUISA.md).
 */
import type { Textos } from './textos'
import { HOJE, diaCurto, diasEntre, hora } from './datas'
import { diaDe, ehMinha, item, minutoDe, paraAgendar } from './estado'
import type { TarefaDaAgenda } from './mocks'

const props = defineProps<{ t: Textos, locale: string }>()
const emit = defineEmits<{ abrir: [chave: string, el: HTMLElement], fechar: [] }>()

const chave = (t: TarefaDaAgenda) => `${t.origem === 'fluxo' ? 't' : 'q'}:${t.id}`
const grupos = computed(() => [
  { id: 'atrasadas', titulo: props.t.paraAgendar.atrasadas, tarefas: paraAgendar.value.atrasadas },
  { id: 'semTempo', titulo: props.t.paraAgendar.semTempo, tarefas: paraAgendar.value.semTempo },
  { id: 'semData', titulo: props.t.paraAgendar.semData, tarefas: paraAgendar.value.semData },
].filter(g => g.tarefas.length))

function linha(t: TarefaDaAgenda) {
  if (!t.due_date) return props.t.paraAgendar.semPrazo
  const d = diaDe(t.due_date)
  if (d < HOJE) return props.t.paraAgendar.atrasadaHa(diasEntre(d, HOJE))
  return props.t.paraAgendar.vence(props.t.quando(diaCurto(d, props.locale), hora(minutoDe(t.due_date))))
}

function pegar(ev: DragEvent, t: TarefaDaAgenda) {
  ev.dataTransfer?.setData('text/plain', chave(t))
  if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move'
}
</script>

<template>
  <aside class="flex w-72 shrink-0 flex-col border-l border-default" :aria-label="t.paraAgendar.titulo">
    <div class="flex items-center justify-between border-b border-default px-3 py-2">
      <p class="text-sm font-semibold text-highlighted">{{ t.paraAgendar.titulo }}</p>
      <UButton icon="i-lucide-panel-right-close" color="neutral" variant="ghost" size="xs" :aria-label="t.paraAgendar.fechar" @click="emit('fechar')" />
    </div>
    <p class="px-3 pt-2 text-xs text-muted">{{ t.paraAgendar.dica }}</p>

    <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
      <section v-for="g in grupos" :key="g.id" class="flex flex-col gap-1.5">
        <p class="flex items-center gap-1.5 text-xs font-medium text-toned">
          {{ g.titulo }}
          <UBadge :label="String(g.tarefas.length)" :color="g.id === 'atrasadas' ? 'error' : 'neutral'" variant="soft" size="sm" />
        </p>
        <button
          v-for="(tarefa, k) in g.tarefas"
          :key="tarefa.id"
          type="button"
          :draggable="ehMinha(tarefa)"
          class="group flex animate-[entrada_.3s_ease-out_both] cursor-grab items-start gap-2 rounded-md border border-default bg-default p-2 text-left transition hover:-translate-y-0.5 hover:border-accented hover:shadow-sm active:cursor-grabbing"
          :style="{ animationDelay: `${k * 40}ms` }"
          @dragstart="pegar($event, tarefa)"
          @click="emit('abrir', chave(tarefa), $event.currentTarget as HTMLElement)"
        >
          <UIcon name="i-lucide-grip-vertical" class="mt-0.5 size-3.5 shrink-0 text-dimmed group-hover:text-muted" />
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-1.5">
              <UIcon :name="tarefa.origem === 'fluxo' ? 'i-lucide-flag' : 'i-lucide-clipboard-check'" class="size-3.5 shrink-0" :class="tarefa.origem === 'fluxo' ? 'text-primary' : 'text-muted'" />
              <span class="line-clamp-2 text-sm text-highlighted">{{ tarefa.name }}</span>
            </span>
            <span class="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs" :class="g.id === 'atrasadas' ? 'text-error' : 'text-muted'">
              <span>{{ linha(tarefa) }}</span>
              <span v-if="item(tarefa.item)" class="text-muted">{{ item(tarefa.item)!.reference }}</span>
            </span>
          </span>
        </button>
      </section>

      <div v-if="!grupos.length" class="flex flex-col items-center gap-2 py-10 text-center">
        <UIcon name="i-lucide-circle-check" class="size-6 text-success" />
        <p class="text-sm text-muted">{{ t.paraAgendar.vazio }}</p>
      </div>
    </div>
  </aside>
</template>
