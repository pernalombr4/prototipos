<script setup lang="ts">
/**
 * Número de uma visualização: quantos itens a visualização salva tem agora.
 * O corpo inteiro é um botão que abre a visualização (regra 25: uma ação, um
 * alvo). Mesmo desenho do número do Painel de tarefas.
 */
import type { Textos } from './textos'

defineProps<{
  t: Textos
  valor: number
  categoria: string
}>()

const emit = defineEmits<{ abrir: [] }>()
</script>

<template>
  <button
    type="button"
    class="flex min-h-0 w-full flex-1 flex-col items-start justify-end rounded-b-lg px-4 pb-3 text-left outline-none transition-colors hover:bg-elevated/40 focus-visible:bg-elevated/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    :aria-label="`${t.numero.abrir}: ${valor} ${t.numero.itens(valor)}`"
    @click="emit('abrir')"
  >
    <span class="text-3xl font-semibold tabular-nums leading-9 text-highlighted">{{ valor }}</span>
    <span class="truncate text-xs text-muted">{{ t.numero.itens(valor) }} · {{ categoria }}</span>
  </button>
</template>
