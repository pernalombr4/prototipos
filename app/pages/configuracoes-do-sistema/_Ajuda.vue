<script setup lang="ts">
/**
 * O "?" que guarda a instrução de um campo.
 *
 * A instrução embaixo do campo é texto permanente para uma dúvida que a pessoa
 * tem uma vez: na terceira visita à tela, ela virou ruído. Atrás do "?", a
 * explicação continua a um clique e some do caminho de quem já sabe.
 *
 * Abre no clique e no foco, nunca só no hover: é a mesma regra do gráfico e do
 * calendário, informação que só existe no ponteiro não existe para o teclado.
 */
defineProps<{ titulo: string }>()
</script>

<template>
  <UPopover :content="{ side: 'top', align: 'start' }">
    <!--
      `.prevent` porque este botão vive dentro do <label> do campo: sem isso, o
      clique no "?" também abriria o select que o rótulo aponta.
    -->
    <UButton
      icon="i-lucide-circle-help"
      size="xs"
      color="neutral"
      variant="ghost"
      :aria-label="`O que é: ${titulo}`"
      class="shrink-0"
      @click.prevent.stop
    />

    <template #content>
      <div class="max-w-sm p-3">
        <p class="text-sm font-medium text-highlighted">
          {{ titulo }}
        </p>
        <p class="mt-1.5 text-sm text-muted">
          <slot />
        </p>
      </div>
    </template>
  </UPopover>
</template>
