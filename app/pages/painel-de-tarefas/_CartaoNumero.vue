<script setup lang="ts">
/**
 * O corpo de um painel de número: valor, variação e detalhe. O corpo inteiro é
 * um botão e abre a lista das tarefas que formam o número (regra 25: uma ação,
 * um alvo). O cabeçalho, com ícone, selo "Agora" ou "No período" e título em
 * caixa alta, é da moldura (`_Painel.vue`, modo `compacto`).
 *
 * Variação num `UBadge` suave, como o `HomeStats` do template do Nuxt UI e a
 * Home do admin. A cor do texto sobe para o tom 700 (300 no escuro): o tom
 * padrão do badge não passa em contraste (regra do `tema-contraste.ts`).
 */
type Cor = 'neutral' | 'error' | 'warning' | 'success'

const props = defineProps<{
  valor: string
  detalhe: string
  cor: Cor
  /** Comparação com o período anterior, quando existe. */
  variacao?: { texto: string, ajuda: string, tom: 'bom' | 'ruim' | 'neutro', leitor: string } | null
}>()

const emit = defineEmits<{ abrir: [] }>()

const corDoValor = computed(() => ({
  neutral: 'text-highlighted',
  error: 'text-error-700 dark:text-error-300',
  warning: 'text-warning-700 dark:text-warning-300',
  success: 'text-success-700 dark:text-success-300',
}[props.cor]))

const badge = computed(() => {
  if (!props.variacao) return null
  return {
    bom: { color: 'success' as const, classe: 'text-success-700 dark:text-success-300' },
    ruim: { color: 'error' as const, classe: 'text-error-700 dark:text-error-300' },
    neutro: { color: 'neutral' as const, classe: '' },
  }[props.variacao.tom]
})
</script>

<template>
  <button
    type="button"
    class="group flex min-h-0 w-full flex-1 flex-col items-start gap-1 rounded-b-lg px-4 pb-3 text-left outline-none transition-colors hover:bg-elevated/40 focus-visible:bg-elevated/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    @click="emit('abrir')"
  >
    <span class="flex w-full flex-wrap items-center gap-x-2 gap-y-0.5">
      <span class="text-2xl font-semibold tabular-nums leading-8" :class="corDoValor">{{ valor }}</span>
      <UTooltip v-if="variacao && badge" :text="variacao.ajuda">
        <UBadge :color="badge.color" variant="subtle" size="sm" class="tabular-nums" :class="badge.classe">
          {{ variacao.texto }}<span class="sr-only"> {{ variacao.leitor }}</span>
        </UBadge>
      </UTooltip>
    </span>
    <span class="line-clamp-2 text-xs leading-snug text-muted">{{ detalhe }}</span>
  </button>
</template>
