<script setup lang="ts">
/**
 * Uma folha do catálogo de widgets: ícone, nome, descrição e Adicionar, ou o
 * selo "Na Home" quando o widget já está nela (cada widget entra uma vez).
 *
 * Componentes: `UButton`, `UBadge`, `UIcon` (MCP nuxt-ui).
 */
import type { DefinicaoDoWidget } from './widgets'
import type { Textos } from './textos'

defineProps<{
  t: Textos
  d: DefinicaoDoWidget
  naHome: boolean
}>()
const emit = defineEmits<{ adicionar: [] }>()
</script>

<template>
  <div class="flex items-start gap-3 rounded-lg border border-default p-3 transition-colors duration-150 hover:border-accented hover:bg-elevated/40">
    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
      <UIcon :name="d.icone" class="size-4 text-primary" />
    </span>
    <span class="min-w-0 flex-1">
      <span class="flex items-center gap-1.5 text-sm font-medium text-highlighted">
        {{ t.widgets[d.tipo].titulo }}
        <UBadge v-if="d.soAdmin" :label="t.comunicado.soAdmin" color="neutral" variant="subtle" size="sm" />
      </span>
      <span class="block text-xs text-muted">{{ t.widgets[d.tipo].descricao }}</span>
    </span>
    <UBadge
      v-if="naHome"
      :label="t.personalizacao.jaNaHome"
      icon="i-lucide-check"
      color="success"
      variant="subtle"
      size="sm"
      class="mt-1 shrink-0"
    />
    <UButton
      v-else
      :label="t.personalizacao.adicionar"
      icon="i-lucide-plus"
      color="neutral"
      variant="outline"
      size="xs"
      class="shrink-0"
      @click="emit('adicionar')"
    />
  </div>
</template>
