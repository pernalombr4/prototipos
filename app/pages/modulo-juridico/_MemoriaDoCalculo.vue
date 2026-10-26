<script setup lang="ts">
/**
 * PROPOSTA: a memória do cálculo. Mostra cada passo da contagem com a data e o fundamento, e os dias que não
 * contaram com o motivo e a fonte. É o que deixa a pessoa conferir o prazo em vez de confiar nele.
 *
 * Nenhum produto de referência mostra o dia a dia da contagem (PESQUISA.md, "O que nenhum deles faz", item 2).
 */
import type { Regra, Tribunal } from './mocks'
import type { Calculo } from './prazos'
import type { Textos } from './textos'
import { dia, diaComSemana } from './formato'

const props = defineProps<{
  t: Textos
  calculo: Calculo
  regra: Regra
  tribunal: Tribunal
  compacto?: boolean
}>()

const destaque = (chave: string) => chave === 'fatal' || chave === 'interno'
const icone: Record<string, string> = {
  disponibilizacao: 'i-lucide-newspaper', publicacao: 'i-lucide-book-open', ciencia: 'i-lucide-mail-open',
  inicio: 'i-lucide-play', contagem: 'i-lucide-calculator', prorrogacao: 'i-lucide-calendar-plus',
  fatal: 'i-lucide-flag', interno: 'i-lucide-alarm-clock',
}
const passos = computed(() => props.calculo.passos.filter(p => p.chave !== 'contagem' || props.calculo.passos.some(x => x.chave === 'prorrogacao')))
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-1.5 text-xs">
      <UBadge :label="`${t.ritos[regra.rito]} · ${regra.ato} · ${t.prazoDaRegra(regra)}`" icon="i-lucide-book-marked" color="neutral" variant="subtle" size="sm" />
      <UBadge :label="t.memoria.calendario(tribunal.sigla)" icon="i-lucide-calendar-days" color="neutral" variant="subtle" size="sm" />
    </div>

    <ol class="relative flex flex-col">
      <li
        v-for="(p, i) in passos"
        :key="p.chave"
        class="relative grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-start gap-2 pb-2.5 last:pb-0"
      >
        <span v-if="i < passos.length - 1" class="absolute left-[0.8125rem] top-6 h-[calc(100%-1.25rem)] w-px bg-(--ui-border)" aria-hidden="true" />
        <span
          class="relative z-10 flex size-6.5 items-center justify-center rounded-full border"
          :class="destaque(p.chave) ? (p.chave === 'fatal' ? 'border-error/40 bg-error/10 text-error' : 'border-primary/40 bg-primary/10 text-primary') : 'border-default bg-default text-muted'"
        >
          <UIcon :name="icone[p.chave] ?? 'i-lucide-dot'" class="size-3.5" />
        </span>
        <span class="min-w-0 pt-0.5">
          <span class="block text-sm" :class="destaque(p.chave) ? 'font-semibold text-highlighted' : 'text-toned'">{{ t.memoria.passos[p.chave] }}</span>
          <span v-if="p.fundamento && !compacto" class="block text-xs text-muted">{{ p.fundamento }}</span>
          <span v-if="p.chave === 'fatal'" class="block text-xs text-muted">{{ t.memoria.ate(t.geral.fuso(calculo.fuso)) }}</span>
        </span>
        <span class="pt-0.5 text-right text-sm tabular-nums" :class="destaque(p.chave) ? 'font-semibold text-highlighted' : 'text-toned'">
          {{ compacto ? dia(p.dia, t.locale) : diaComSemana(p.dia, t.locale) }}
        </span>
      </li>
    </ol>

    <div class="rounded-md border border-default bg-elevated/40 px-3 py-2">
      <p class="text-xs font-medium text-muted">{{ t.memoria.pulados }}</p>
      <ul v-if="calculo.pulados.length" class="mt-1 flex flex-col gap-1">
        <li v-for="d in calculo.pulados" :key="d.dia + d.tipo" class="flex flex-wrap items-baseline gap-x-2 text-xs">
          <span class="tabular-nums text-highlighted">{{ dia(d.dia, t.locale) }}</span>
          <span class="text-toned">{{ d.motivo || t.memoria.tipos[d.tipo] }}</span>
          <UBadge :label="t.memoria.tipos[d.tipo]" :color="d.tipo === 'suspensao' ? 'warning' : 'neutral'" variant="outline" size="sm" />
          <span v-if="!compacto && d.fonte" class="text-dimmed">{{ d.fonte }}</span>
        </li>
        <li v-if="calculo.finsDeSemana" class="text-xs text-muted">{{ t.memoria.finsDeSemana(calculo.finsDeSemana) }}</li>
      </ul>
      <p v-else class="mt-1 text-xs text-toned">{{ t.memoria.soFimDeSemana }}</p>
    </div>
  </div>
</template>
