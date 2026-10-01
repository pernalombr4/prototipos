<script setup lang="ts">
/**
 * O corpo de um painel de número: o valor, e mais nada (rodada 3: "Abertas 174
 * já era informação suficiente. Não precisa do subtexto", nem do selo de
 * variação). O detalhe (o que compõe o número, o período anterior) mora na
 * quickview da lista, que abre ao clicar.
 *
 * O corpo inteiro é um botão (regra 25: uma ação, um alvo). A cor do valor
 * sobe para o tom 700 (300 no escuro): o tom padrão não passa em contraste.
 */
type Cor = 'neutral' | 'error' | 'warning' | 'success'

const props = defineProps<{
  valor: string
  cor: Cor
  /** O nome do número, para o leitor de tela: "Vencidas: 113". */
  rotulo: string
}>()

const emit = defineEmits<{ abrir: [] }>()

const corDoValor = computed(() => ({
  neutral: 'text-highlighted',
  error: 'text-error-700 dark:text-error-300',
  warning: 'text-warning-700 dark:text-warning-300',
  success: 'text-success-700 dark:text-success-300',
}[props.cor]))
</script>

<template>
  <button
    type="button"
    class="flex min-h-0 w-full flex-1 items-end rounded-b-lg px-4 pb-3 text-left outline-none transition-colors hover:bg-elevated/40 focus-visible:bg-elevated/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    :aria-label="`${rotulo}: ${valor}`"
    @click="emit('abrir')"
  >
    <span class="text-3xl font-semibold tabular-nums leading-9" :class="corDoValor">{{ valor }}</span>
  </button>
</template>
