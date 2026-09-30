<script setup lang="ts">
/**
 * Tempo por etapa: do `start` ao `complete` do mesmo `stage_id` no
 * `stages_log` do flow item. Só o fluxo da categoria tem etapa; o Spaceflow
 * aparece no painel de fluxo, dividido pelas tarefas que cria.
 *
 * Uma linha por etapa, agrupada por fluxo, na ordem do fluxo. A etapa mais
 * lenta de cada fluxo ganha o destaque: é o gargalo.
 */
import type { TempoDaEtapa } from './metricas'
import type { Textos } from './textos'
import { duracao, numero } from './formatar'

const props = defineProps<{
  t: Textos
  etapas: TempoDaEtapa[]
  soManual: boolean
}>()

const porFluxo = computed(() => {
  const mapa = new Map<string, TempoDaEtapa[]>()
  for (const e of props.etapas) {
    if (!mapa.has(e.fluxo)) mapa.set(e.fluxo, [])
    mapa.get(e.fluxo)!.push(e)
  }
  return [...mapa.entries()].map(([fluxo, etapas]) => ({ fluxo, etapas: [...etapas].sort((a, b) => a.ordem - b.ordem) }))
})

const maior = computed(() => Math.max(1, ...props.etapas.map(e => e.estat?.mediana ?? 0)))

function ehGargalo(e: TempoDaEtapa, lista: TempoDaEtapa[]) {
  const medianas = lista.map(x => x.estat?.mediana ?? 0)
  return !!e.estat && e.estat.mediana === Math.max(...medianas) && lista.filter(x => x.estat).length > 1
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
  <UScrollArea v-else data-rolagem class="min-h-0 flex-1">
    <section v-for="g in porFluxo" :key="g.fluxo">
      <h3 class="sticky top-0 z-10 border-y border-default bg-elevated/90 px-4 py-1 text-xs font-semibold text-toned backdrop-blur">
        {{ g.fluxo }}
      </h3>
      <ol class="divide-y divide-default">
        <li
          v-for="e in g.etapas"
          :key="e.etapa"
          class="grid grid-cols-[1.25rem_minmax(0,1fr)_minmax(4rem,9rem)_auto] items-center gap-x-3 gap-y-0.5 px-4 py-2"
          :class="ehGargalo(e, g.etapas) ? 'bg-warning/5' : ''"
        >
          <span class="flex size-5 items-center justify-center rounded-full bg-elevated text-[11px] font-medium text-muted">{{ e.ordem }}</span>
          <span class="min-w-0">
            <span class="flex items-center gap-1.5 text-sm">
              <span class="truncate text-highlighted">{{ e.etapa }}</span>
              <UTooltip v-if="ehGargalo(e, g.etapas)" :text="t.tempos.gargalo">
                <UIcon name="i-lucide-hourglass" class="size-3.5 shrink-0 text-warning-700 dark:text-warning-300" :aria-label="t.tempos.gargalo" />
              </UTooltip>
            </span>
            <span class="block truncate text-xs text-muted">
              {{ t.tempos.media }} {{ duracao(e.estat?.media ?? null, t) }} · {{ t.tempos.passagens }} {{ numero(e.estat?.n ?? 0, t) }}<template v-if="e.agora"> · {{ t.tempos.agoraNaEtapa }} {{ e.idadeMediana !== null ? t.tempos.contagemComIdade(numero(e.agora, t), duracao(e.idadeMediana, t)) : numero(e.agora, t) }}</template>
            </span>
          </span>
          <UProgress :model-value="e.estat?.mediana ?? 0" :max="maior" size="sm" :color="ehGargalo(e, g.etapas) ? 'warning' : 'primary'" />
          <span class="whitespace-nowrap text-right text-sm font-semibold tabular-nums text-highlighted">{{ duracao(e.estat?.mediana ?? null, t) }}</span>
        </li>
      </ol>
    </section>
    <p class="flex gap-2 px-4 py-3 text-xs text-muted">
      <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
      {{ t.tempos.etapaSoCategoria }}
    </p>
  </UScrollArea>
</template>
