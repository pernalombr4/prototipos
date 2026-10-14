<script setup lang="ts">
/**
 * O RODAPÉ DE TODA JANELA DE FORMULÁRIO (rodada 20).
 *
 * Antes cada janela tinha o seu: botão largo sozinho, dois botões à direita,
 * botões espalhados. Agora é um só, com a mesma geometria em todas:
 *
 *   à esquerda, uma linha de contexto (o que acontece quando confirmar);
 *   à direita, a saída e depois a ação.
 *
 * Quem precisa de um botão a mais à esquerda (o Exportar do Importar) usa o
 * slot `esquerda`, e a linha de contexto dá lugar a ele.
 *
 * Com `form`, a ação é o submit daquele formulário (Enter também confirma);
 * sem `form`, ela emite `acao`.
 */
const props = defineProps<{
  cancelar: string
  acao: string
  contexto?: string
  form?: string
  desligado?: boolean
  perigo?: boolean
  iconeDaAcao?: string
}>()

const emit = defineEmits<{ cancelar: [], acao: [] }>()

function aoAgir() {
  if (!props.form) emit('acao')
}
</script>

<template>
  <div class="flex w-full flex-wrap items-center gap-2">
    <div class="min-w-0 flex-1">
      <slot name="esquerda">
        <p v-if="props.contexto" class="text-xs leading-snug text-muted">{{ props.contexto }}</p>
      </slot>
    </div>
    <UButton :label="props.cancelar" color="neutral" variant="ghost" @click="emit('cancelar')" />
    <UButton
      :type="props.form ? 'submit' : 'button'"
      :form="props.form"
      :label="props.acao"
      :icon="props.iconeDaAcao"
      :color="props.perigo ? 'error' : 'primary'"
      :disabled="props.desligado"
      @click="aoAgir"
    />
  </div>
</template>
