<script setup lang="ts">
/**
 * Próximas a vencer: painel próprio desde a rodada 2 (antes era o rodapé do
 * "Tempo até o prazo"), com rolagem infinita no lugar do corte em 5.
 *
 * A lista vem inteira de `proximasAVencer` e aparece em lotes. Os subtítulos
 * fixos ("Em até 24 h", "Em 1 a 7 dias"...) repetem as faixas do painel de
 * prazos, e o dia do prazo ganha a cor de alerta, como no Linear e no ClickUp.
 */
import { AGORA } from './mocks'
import { DIA, faixaDe, nomeDoResponsavel } from './metricas'
import type { Faixa, TarefaDoPainel } from './metricas'
import type { Textos } from './textos'
import Sentinela from './_Sentinela.vue'
import { duracao, numero } from './formatar'

const props = defineProps<{
  t: Textos
  tarefas: TarefaDoPainel[]
}>()

const emit = defineEmits<{ abrir: [tarefa: TarefaDoPainel] }>()

const LOTE = 15
const visiveis = ref(LOTE)
watch(() => props.tarefas, () => { visiveis.value = LOTE })

const contagem = computed(() => {
  const c: Partial<Record<Faixa, number>> = {}
  for (const x of props.tarefas) { const f = faixaDe(x); c[f] = (c[f] ?? 0) + 1 }
  return c
})

const grupos = computed(() => {
  const lista: { faixa: Faixa, tarefas: TarefaDoPainel[] }[] = []
  for (const x of props.tarefas.slice(0, visiveis.value)) {
    const f = faixaDe(x)
    const ultimo = lista[lista.length - 1]
    if (ultimo?.faixa === f) ultimo.tarefas.push(x)
    else lista.push({ faixa: f, tarefas: [x] })
  }
  return lista
})

function responsavel(x: TarefaDoPainel) {
  return x.designados.map(d => nomeDoResponsavel(d.chave, props.t.rotulos)).join(', ')
}

function tom(x: TarefaDoPainel) {
  const falta = x.prazo! - AGORA
  if (falta <= DIA) return { icone: 'text-warning-700 dark:text-warning-300', texto: 'font-medium text-warning-700 dark:text-warning-300' }
  if (falta <= 7 * DIA) return { icone: 'text-warning-700 dark:text-warning-300', texto: 'text-toned' }
  return { icone: 'text-dimmed', texto: 'text-muted' }
}
</script>

<template>
  <UScrollArea data-rolagem class="min-h-0 flex-1">
    <UEmpty
      v-if="!tarefas.length"
      icon="i-lucide-calendar-check"
      :title="t.proximas.vazio"
      variant="naked"
      size="sm"
    />
    <template v-else>
      <section v-for="g in grupos" :key="g.faixa">
        <h3 class="sticky top-0 z-10 flex items-baseline justify-between border-y border-default bg-elevated/90 px-4 py-1 text-xs font-medium text-muted backdrop-blur first:border-t-0">
          <span>{{ t.prazos.faixas[g.faixa] }}</span>
          <span class="tabular-nums">{{ numero(contagem[g.faixa] ?? 0, t) }}</span>
        </h3>
        <ul class="divide-y divide-default">
          <li v-for="x in g.tarefas" :key="x.chave">
            <button
              type="button"
              class="flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-elevated/60 focus-visible:bg-elevated focus-visible:outline-none"
              @click="emit('abrir', x)"
            >
              <UIcon name="i-lucide-alarm-clock" class="size-4 shrink-0" :class="tom(x).icone" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-highlighted">{{ x.nome }}</span>
                <span class="block truncate text-xs text-muted">{{ responsavel(x) }}<template v-if="x.etapa"> · {{ x.etapa }}</template><template v-else-if="x.fluxo"> · {{ x.fluxo }}</template></span>
              </span>
              <span class="shrink-0 text-xs tabular-nums" :class="tom(x).texto">
                {{ t.proximas.venceEm(duracao(x.prazo! - AGORA, t)) }}
              </span>
            </button>
          </li>
        </ul>
      </section>
      <Sentinela :t="t" :tem-mais="visiveis < tarefas.length" :total="tarefas.length" @mais="visiveis += LOTE" />
    </template>
  </UScrollArea>
</template>
