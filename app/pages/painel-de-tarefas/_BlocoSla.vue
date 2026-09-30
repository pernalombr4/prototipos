<script setup lang="ts">
/**
 * SLA: 2 barras, porque aberta e concluída respondem perguntas diferentes.
 * Aberta: "o que está vencendo agora?". Concluída: "entregamos no prazo?".
 * Juntar as 2 numa pizza só misturaria foto com filme.
 *
 * Aberta tem 4 situações: vencida, a vencer (próximos 7 dias), no prazo e sem
 * prazo. O "a vencer" de 7 dias é o corte mais comum no mercado (pesquisa da
 * rodada 2: Linear, Jira, Todoist e Asana).
 */
import type { ProgressGroupItem } from '@nuxt/ui'
import type { BlocoSla, Situacao } from './metricas'
import type { Textos } from './textos'
import { numero, porcentagem } from './formatar'

const props = defineProps<{
  t: Textos
  sla: BlocoSla
  semDataDeConclusao: number
}>()

const emit = defineEmits<{ abrir: [situacao: Situacao, grupo: 'abertas' | 'concluidas'] }>()

type Item = ProgressGroupItem & { situacao: Situacao }

/**
 * "Sem prazo" em cinza de texto apagado, e não no neutral do tema: o neutral
 * do ProgressGroup é `bg-inverted` (quase preto no claro), e pintaria de peso
 * justamente o que não tem urgência nenhuma.
 */
const CINZA = 'var(--ui-text-dimmed)'
const cores: Record<Situacao, string> = {
  vencida: 'error',
  a_vencer: 'warning',
  no_prazo: 'success',
  sem_prazo: CINZA,
  concluida_no_prazo: 'success',
  atrasada: 'error',
  concluida_sem_prazo: CINZA,
}

function itens(valores: Partial<Record<Situacao, number>>, ordem: Situacao[]): Item[] {
  return ordem.map(situacao => ({
    situacao,
    value: valores[situacao] ?? 0,
    color: cores[situacao],
    label: props.t.situacao[situacao],
  }))
}

const grupos = computed(() => [
  { chave: 'abertas' as const, titulo: props.t.sla.abertasAgora, itens: itens(props.sla.abertas, ['vencida', 'a_vencer', 'no_prazo', 'sem_prazo']) },
  { chave: 'concluidas' as const, titulo: props.t.sla.concluidasNoPeriodo, itens: itens(props.sla.concluidas, ['atrasada', 'concluida_no_prazo', 'concluida_sem_prazo']) },
])

function total(lista: Item[]) {
  return lista.reduce((s, i) => s + (i.value ?? 0), 0)
}
</script>

<template>
  <UScrollArea data-rolagem class="min-h-0 flex-1 px-4 pb-4 pt-2" :ui="{ viewport: 'gap-5' }">
    <section v-for="g in grupos" :key="g.chave" class="space-y-3">
      <div class="flex items-baseline justify-between gap-2">
        <h3 class="text-sm font-medium text-toned">
          {{ g.titulo }}
        </h3>
        <span class="text-sm font-semibold tabular-nums text-highlighted">{{ numero(total(g.itens), t) }}</span>
      </div>

      <p v-if="!total(g.itens)" class="text-sm text-muted">
        {{ t.sla.semTarefas }}
      </p>
      <UProgressGroup
        v-else
        :items="g.itens.filter(i => i.value)"
        :max="total(g.itens)"
        size="lg"
        :ui="{ list: 'hidden' }"
      />
      <ul v-if="total(g.itens)" class="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-x-4 gap-y-0.5">
        <li v-for="item in g.itens" :key="item.situacao">
          <button
            type="button"
            class="-mx-1.5 flex w-[calc(100%+0.75rem)] min-w-0 items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default disabled:hover:bg-transparent"
            :disabled="!item.value"
            @click="emit('abrir', item.situacao, g.chave)"
          >
            <span
              class="size-2 shrink-0 rounded-full"
              :class="{
                'bg-success': item.color === 'success',
                'bg-warning': item.color === 'warning',
                'bg-error': item.color === 'error',
              }"
              :style="item.color === CINZA ? { backgroundColor: CINZA } : undefined"
            />
            <span class="truncate" :class="item.value ? 'text-toned' : 'text-muted'">{{ item.label }}</span>
            <span class="ml-auto shrink-0 font-medium tabular-nums" :class="item.value ? 'text-highlighted' : 'text-muted'">{{ numero(item.value ?? 0, t) }}</span>
            <span class="w-10 shrink-0 text-right text-xs tabular-nums text-muted">{{ porcentagem((item.value ?? 0) / total(g.itens), t) }}</span>
          </button>
        </li>
      </ul>
    </section>

    <ul v-if="sla.prazoIgualACriacao || semDataDeConclusao" class="space-y-1.5 border-t border-default pt-3 text-xs text-muted">
      <li v-if="sla.prazoIgualACriacao" class="flex gap-2">
        <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-3.5 shrink-0 text-warning-700 dark:text-warning-300" />
        <span>{{ t.sla.prazoIgualACriacao(sla.prazoIgualACriacao) }}</span>
      </li>
      <li v-if="semDataDeConclusao" class="flex gap-2">
        <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0 text-muted" />
        <span>{{ t.sla.semDataDeConclusao(semDataDeConclusao) }}</span>
      </li>
    </ul>
  </UScrollArea>
</template>
