<script setup lang="ts">
/**
 * A moldura de uma lâmina do Painel de tarefas, como no develop (11/11/2026):
 * cartão arredondado com fundo levemente tingido, ponto colorido antes do
 * título, subtítulo, ícone "i" de "Como calculamos" e ações à direita.
 *
 * A etiqueta "Lâmina nova" ou "Lâmina que muda" é ANDAIME, para o dev saber o
 * que é proposta; não vai para o produto.
 */
defineProps<{
  titulo: string
  apoio?: string
  calculo: string
  rotuloCalculo: string
  /** Classe do ponto e do tom do fundo. */
  cor: 'error' | 'warning' | 'primary' | 'success' | 'info'
  marca: 'nova' | 'muda'
  icone?: string
}>()

const fundo: Record<string, string> = {
  error: 'from-error/8',
  warning: 'from-warning/8',
  primary: 'from-primary/8',
  success: 'from-success/8',
  info: 'from-info/8',
}
const ponto: Record<string, string> = {
  error: 'bg-error',
  warning: 'bg-warning',
  primary: 'bg-primary',
  success: 'bg-success',
  info: 'bg-info',
}
</script>

<template>
  <section class="relative flex flex-col rounded-2xl border border-default bg-gradient-to-br to-default to-40% p-4 shadow-xs transition hover:shadow-md [animation:entrada_.3s_ease-out_both]" :class="fundo[cor]">
    <span
      class="absolute -top-2.5 left-4 rounded-full border border-dashed px-2 text-[10px] font-semibold uppercase tracking-wider"
      :class="marca === 'nova' ? 'border-primary bg-default text-primary' : 'border-warning bg-default text-warning'"
    >{{ marca === 'nova' ? 'Lâmina nova' : 'Lâmina que muda' }}</span>
    <header class="flex items-start gap-2">
      <div class="min-w-0">
        <h3 class="flex items-center gap-1.5 text-sm font-semibold text-highlighted">
          <span class="size-2 shrink-0 rounded-full" :class="ponto[cor]" aria-hidden="true" />
          {{ titulo }}
          <UTooltip :text="calculo" :content="{ side: 'top' }" :ui="{ content: 'max-w-72 h-auto whitespace-normal' }">
            <UButton icon="i-lucide-info" color="neutral" variant="link" size="xs" class="p-0" :aria-label="`${rotuloCalculo}: ${titulo}`" />
          </UTooltip>
        </h3>
        <p v-if="apoio" class="text-xs text-muted">{{ apoio }}</p>
      </div>
      <div class="ml-auto flex shrink-0 items-center gap-2">
        <slot name="acoes" />
        <UIcon v-if="icone" :name="icone" class="size-4 text-muted" aria-hidden="true" />
      </div>
    </header>
    <div class="mt-3 flex flex-1 flex-col">
      <slot />
    </div>
  </section>
</template>
