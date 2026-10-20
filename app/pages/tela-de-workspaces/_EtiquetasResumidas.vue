<script setup lang="ts">
import type { Etiqueta } from './mocks'

/**
 * Etiquetas de um workspace, cortadas (rodada 28).
 *
 * A pessoa pode criar quantas etiquetas quiser e pôr todas num workspace só.
 * Para o card e a linha não crescerem sem limite, aparecem as primeiras e um
 * "+N"; passar o mouse no "+N" (ou focar nele pelo teclado) abre um popover
 * com todas.
 */
const props = withDefaults(defineProps<{
  etiquetas: Etiqueta[]
  /** Quantas aparecem antes do "+N". */
  max?: number
  /** Nome acessível do "+N", com a contagem. */
  rotuloMais: (n: number) => string
}>(), { max: 2 })

const visiveis = computed(() => props.etiquetas.slice(0, props.max))
const resto = computed(() => props.etiquetas.length - visiveis.value.length)
</script>

<template>
  <div v-if="props.etiquetas.length" class="flex min-w-0 items-center gap-1">
    <UBadge
      v-for="e in visiveis"
      :key="e.id"
      :label="e.nome"
      icon="i-lucide-tag"
      color="neutral"
      variant="outline"
      size="sm"
      class="max-w-32 shrink-0"
      :ui="{ label: 'truncate' }"
    />
    <UPopover v-if="resto > 0" mode="hover" :open-delay="150" :close-delay="100" :content="{ side: 'top', align: 'start' }">
      <button
        type="button"
        class="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary"
        :aria-label="props.rotuloMais(resto)"
        @click.stop.prevent
      >
        <UBadge :label="`+${resto}`" color="neutral" variant="soft" size="sm" />
      </button>
      <template #content>
        <div class="flex max-w-72 flex-wrap gap-1 p-2">
          <UBadge
            v-for="e in props.etiquetas"
            :key="e.id"
            :label="e.nome"
            icon="i-lucide-tag"
            color="neutral"
            variant="outline"
            size="sm"
          />
        </div>
      </template>
    </UPopover>
  </div>
</template>
