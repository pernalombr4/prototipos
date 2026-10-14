<script setup lang="ts">
import { useLimites } from './limites'
import type { TextosDaTela } from './textos'

/**
 * "Mais N" e "Mostrar menos" no fim de uma seção cortada (rodada 19). É a
 * linha "More" do Notion: abre o resto ali mesmo, sem camada, e volta.
 */
const props = defineProps<{
  t: TextosDaTela
  id: string
  /** Quantos ficaram de fora agora. */
  resto: number
  /** Quantos a seção tem, para saber se está aberta além do limite. */
  total: number
}>()

const limites = useLimites()
const aberta = computed(() => limites.alemDoLimite(props.id, props.total))
</script>

<template>
  <button
    v-if="props.resto > 0 || aberta"
    type="button"
    class="mt-0.5 flex w-full animate-[entrada_0.2s_ease-out_both] items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-sm text-muted transition-colors hover:bg-elevated hover:text-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
    :aria-expanded="aberta"
    @click="limites.alternarMais(props.id)"
  >
    <UIcon :name="aberta ? 'i-lucide-chevron-up' : 'i-lucide-ellipsis'" class="size-4 shrink-0" />
    <span class="min-w-0 flex-1 truncate text-left">{{ aberta ? props.t.mostrarMenos : props.t.maisN(props.resto) }}</span>
  </button>
</template>
