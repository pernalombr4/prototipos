<script setup lang="ts">
/**
 * A regra do número, no próprio cartão.
 *
 * Nenhum dos 11 produtos pesquisados diz no cartão como calcula (se conta fim
 * de semana, qual data o período recorta). Aqui toda caixa tem essa porta.
 */
const props = defineProps<{
  titulo: string
  texto: string
  /** O assunto, para o leitor de tela: "Como calculamos: Vencidas". */
  sobre?: string
}>()
</script>

<template>
  <UPopover :content="{ side: 'top', align: 'end' }">
    <UButton
      icon="i-lucide-info"
      color="neutral"
      variant="ghost"
      size="xs"
      :aria-label="props.sobre ? `${titulo}: ${props.sobre}` : titulo"
      class="relative z-10 shrink-0"
    />
    <template #content>
      <div class="max-w-xs space-y-1.5 p-3">
        <p class="text-xs font-semibold text-highlighted">
          {{ titulo }}
        </p>
        <p class="text-xs leading-relaxed text-muted">
          {{ texto }}
        </p>
      </div>
    </template>
  </UPopover>
</template>
