<script setup lang="ts">
/**
 * Painel "Sem data": as tarefas da pessoa que não têm prazo e por isso não aparecem na grade. Fica fechado e abre pelo
 * botão da barra, que mostra quantas são. O cartão se arrasta para a grade (HTML5 drag and drop), o que dá o prazo, ou
 * abre o detalhe com o clique, que é a alternativa de teclado ao arraste.
 *
 * Ajuste da rodada 2: saíram os grupos Atrasadas (a grade já mostra a tarefa atrasada no dia do prazo) e "Vencem nesta
 * semana, sem tempo reservado" (reservar tempo é opção da tarefa, não pendência).
 */
import type { Textos } from './textos'
import { ehMinha, item, semData } from './estado'
import type { TarefaDaAgenda } from './mocks'

defineProps<{ t: Textos, locale: string }>()
const emit = defineEmits<{ abrir: [chave: string, el: HTMLElement], fechar: [] }>()

const chave = (t: TarefaDaAgenda) => `${t.origem === 'fluxo' ? 't' : 'q'}:${t.id}`

function pegar(ev: DragEvent, t: TarefaDaAgenda) {
  ev.dataTransfer?.setData('text/plain', chave(t))
  if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move'
}
</script>

<template>
  <aside class="flex w-72 shrink-0 flex-col border-l border-default" :aria-label="t.paraAgendar.titulo">
    <div class="flex items-center justify-between border-b border-default px-3 py-2">
      <p class="flex items-center gap-1.5 text-sm font-semibold text-highlighted">
        {{ t.paraAgendar.titulo }}
        <UBadge v-if="semData.length" :label="String(semData.length)" color="neutral" variant="soft" size="sm" />
      </p>
      <UButton icon="i-lucide-panel-right-close" color="neutral" variant="ghost" size="xs" :aria-label="t.paraAgendar.fechar" @click="emit('fechar')" />
    </div>
    <p class="px-3 pt-2 text-xs text-muted">{{ t.paraAgendar.dica }}</p>

    <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
      <section v-if="semData.length" class="flex flex-col gap-1.5">
        <button
          v-for="(tarefa, k) in semData"
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
            <span v-if="item(tarefa.item)" class="mt-0.5 block text-xs text-muted">{{ item(tarefa.item)!.reference }}</span>
          </span>
        </button>
      </section>

      <div v-else class="flex flex-col items-center gap-2 py-10 text-center">
        <UIcon name="i-lucide-circle-check" class="size-6 text-success" />
        <p class="text-sm text-muted">{{ t.paraAgendar.vazio }}</p>
      </div>
    </div>
  </aside>
</template>
