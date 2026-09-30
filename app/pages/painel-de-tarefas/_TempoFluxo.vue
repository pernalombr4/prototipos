<script setup lang="ts">
/**
 * Tempo por fluxo, nos 2 motores de fluxo, lado a lado (rodada 2: "sem dividir
 * Spaceflow e c-flows"):
 * - fluxo da categoria: do 1º `start` ao último `complete` do `stages_log`, nos
 *   flow items com `run_status: complete`. A barra divide pela mediana de cada
 *   etapa;
 * - Spaceflow: de `created_at` a `stopped_at` da execução `completed`. A barra
 *   divide pela mediana de cada tarefa que o fluxo cria.
 *
 * O selo diz de que motor é o fluxo, porque a regra de cálculo muda. O viés de
 * quem só conta o que terminou fica à vista: ao lado, quantos ainda rodam e há
 * quanto tempo.
 */
import type { TempoDoFluxo } from './metricas'
import type { Textos } from './textos'
import { duracao, numero } from './formatar'

const props = defineProps<{
  t: Textos
  fluxos: TempoDoFluxo[]
  soManual: boolean
}>()

/**
 * Rampa da cor primária, da 1ª parte (clara) à última (escura): a cor diz a
 * ordem, e nenhum trecho sai cinza, que se lê como "vazio".
 */
const cores = ['var(--ui-color-primary-300)', 'var(--ui-color-primary-500)', 'var(--ui-color-primary-700)', 'var(--ui-color-primary-900)']

function composicao(f: TempoDoFluxo) {
  return f.composicao.map((c, i) => ({ label: c.rotulo, value: c.mediana, color: cores[i % cores.length] }))
}
</script>

<template>
  <UEmpty
    v-if="soManual"
    icon="i-lucide-workflow"
    :title="t.tempos.soFluxo"
    variant="naked"
    size="sm"
    class="flex-1"
  />
  <UScrollArea v-else data-rolagem class="@container min-h-0 flex-1">
    <UEmpty v-if="!fluxos.length" icon="i-lucide-timer-off" :title="t.tempos.semDados" variant="naked" size="sm" />
    <ul class="divide-y divide-default border-t border-default">
      <li v-for="f in fluxos" :key="f.fluxo" class="space-y-2 px-4 py-3">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-highlighted">
              {{ f.fluxo }}
            </p>
            <UBadge :label="t.tempos.tipoDeFluxo[f.tipo]" :icon="f.tipo === 'spaceflow' ? 'i-lucide-workflow' : 'i-lucide-layout-grid'" color="neutral" variant="soft" size="sm" class="mt-0.5" />
          </div>
          <div class="shrink-0 text-right">
            <p class="text-xl font-semibold tabular-nums text-highlighted">
              {{ duracao(f.estat?.mediana ?? null, t) }}
            </p>
            <p class="text-xs text-muted">
              {{ t.tempos.mediana }}
            </p>
          </div>
        </div>

        <dl class="grid gap-x-6 gap-y-0.5 text-xs @lg:grid-cols-2">
          <div class="flex justify-between gap-2">
            <dt class="text-muted">{{ t.tempos.media }}</dt>
            <dd class="whitespace-nowrap tabular-nums text-toned">{{ duracao(f.estat?.media ?? null, t) }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-muted">{{ t.tempos.p90 }}</dt>
            <dd class="whitespace-nowrap tabular-nums text-toned">{{ duracao(f.estat?.p90 ?? null, t) }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-muted">{{ t.tempos.concluidosNoPeriodo }}</dt>
            <dd class="whitespace-nowrap tabular-nums text-toned">{{ numero(f.estat?.n ?? 0, t) }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-muted">{{ t.tempos.emAndamento }}</dt>
            <dd class="whitespace-nowrap tabular-nums text-highlighted">
              {{ f.idadeMediana !== null ? t.tempos.contagemComIdade(numero(f.emAndamento, t), duracao(f.idadeMediana, t)) : numero(f.emAndamento, t) }}
            </dd>
          </div>
        </dl>

        <div v-if="f.composicao.length">
          <p class="mb-1 text-xs text-muted">
            {{ t.tempos.composicao }}
          </p>
          <UProgressGroup
            :items="composicao(f)"
            :max="f.composicao.reduce((s, x) => s + x.mediana, 0)"
            size="sm"
            :ui="{ list: 'grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-x-3 text-xs', itemLabel: 'text-toned truncate', itemTrailing: 'text-muted tabular-nums' }"
          >
            <template #item-trailing="{ item }">
              {{ duracao(item.value ?? 0, t) }}
            </template>
          </UProgressGroup>
        </div>
      </li>
    </ul>
    <p class="flex gap-2 px-4 py-3 text-xs text-muted">
      <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
      {{ t.tempos.vies }}
    </p>
  </UScrollArea>
</template>
