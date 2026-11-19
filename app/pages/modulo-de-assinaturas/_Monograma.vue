<script setup lang="ts">
/**
 * O monograma do provedor no lugar do logo, que o protótipo não reproduz. No produto, é o logo de cada provedor.
 * As classes ficam escritas por inteiro para o Tailwind gerar cada uma.
 */
import type { ProvedorId } from './mocks'
import { provedorPorId } from './mocks'

const props = withDefaults(defineProps<{ provedor: ProvedorId, tamanho?: 'sm' | 'md' | 'lg' }>(), { tamanho: 'md' })
const p = computed(() => provedorPorId.get(props.provedor)!)
const cores = {
  primary: 'bg-primary/15 text-primary', info: 'bg-info/15 text-info', success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning', error: 'bg-error/15 text-error', neutral: 'bg-inverted/10 text-highlighted',
} as const
const tamanhos = { sm: 'size-6 text-[10px] rounded-md', md: 'size-10 text-xs rounded-md', lg: 'size-11 text-sm rounded-lg' } as const
</script>

<template>
  <span class="flex shrink-0 items-center justify-center font-semibold ring-1 ring-inset ring-current/10" :class="[cores[p.cor], tamanhos[tamanho]]" aria-hidden="true">
    {{ p.nome.slice(0, 2).toUpperCase() }}
  </span>
</template>
