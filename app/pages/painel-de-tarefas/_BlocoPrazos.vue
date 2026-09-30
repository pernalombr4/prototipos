<script setup lang="ts">
/**
 * Tempo que falta para vencer, em faixas, agrupadas como o gestor lê:
 * vencidas (vermelho), a vencer nos próximos 7 dias (amarelo) e depois disso
 * (azul). Sem prazo fica à parte, em cinza. As 2 faixas do meio somam o número
 * "A vencer" do topo; "Em até 24 h" é o destaque do dia do prazo.
 */
import { FAIXAS } from './metricas'
import type { Faixa } from './metricas'
import type { Textos } from './textos'
import { numero } from './formatar'

const props = defineProps<{
  t: Textos
  faixas: Record<Faixa, number>
}>()

const emit = defineEmits<{ abrir: [faixa: Faixa] }>()

const maior = computed(() => Math.max(1, ...FAIXAS.map(f => props.faixas[f])))

const grupos = computed(() => [
  { chave: 'vencidas', titulo: props.t.prazos.grupos.vencidas, cor: 'error', faixas: ['vencida_7d_mais', 'vencida_ate_7d'] as Faixa[] },
  { chave: 'aVencer', titulo: props.t.prazos.grupos.aVencer, cor: 'warning', faixas: ['ate_24h', 'de_1_a_7d'] as Faixa[] },
  { chave: 'depois', titulo: props.t.prazos.grupos.depois, cor: 'info', faixas: ['de_8_a_30d', 'mais_30d'] as Faixa[] },
  // Sem prazo em cinza apagado: o neutral do tema é quase preto.
  { chave: 'sem', titulo: '', cor: 'var(--ui-text-dimmed)', faixas: ['sem_prazo'] as Faixa[] },
])

function soma(lista: Faixa[]) {
  return lista.reduce((s, f) => s + props.faixas[f], 0)
}
</script>

<template>
  <UScrollArea data-rolagem class="min-h-0 flex-1 px-4 pb-3 pt-1" :ui="{ viewport: 'gap-2.5' }">
    <section v-for="g in grupos" :key="g.chave" :class="g.chave === 'sem' ? 'border-t border-default pt-2' : ''">
      <h3 v-if="g.titulo" class="mb-0.5 flex items-baseline justify-between text-xs font-medium uppercase tracking-wide text-muted">
        <span>{{ g.titulo }}</span>
        <span class="tabular-nums">{{ numero(soma(g.faixas), t) }}</span>
      </h3>
      <ul>
        <li v-for="f in g.faixas" :key="f">
          <button
            type="button"
            class="-mx-2 block w-[calc(100%+1rem)] rounded-md px-2 py-1 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default disabled:hover:bg-transparent"
            :disabled="!faixas[f]"
            @click="emit('abrir', f)"
          >
            <span class="mb-0.5 flex items-baseline justify-between gap-2 text-sm">
              <span class="flex min-w-0 items-center gap-1.5">
                <span class="truncate" :class="faixas[f] ? 'text-toned' : 'text-muted'">{{ t.prazos.faixas[f] }}</span>
              </span>
              <span class="shrink-0 font-medium tabular-nums" :class="faixas[f] ? 'text-highlighted' : 'text-muted'">{{ numero(faixas[f], t) }}</span>
            </span>
            <UProgress
              :model-value="faixas[f]"
              :max="maior"
              size="sm"
              :color="g.cor"
              :ui="{ base: 'bg-elevated' }"
              :get-value-label="() => `${t.prazos.faixas[f]}: ${faixas[f]}`"
            />
          </button>
        </li>
      </ul>
    </section>
  </UScrollArea>
</template>
