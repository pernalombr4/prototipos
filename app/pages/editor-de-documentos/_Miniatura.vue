<script setup lang="ts">
/**
 * PROPOSTA: a miniatura da primeira página no cartão do documento.
 *
 * No develop o campo mostra um ícone genérico de arquivo. A miniatura diz, de
 * relance, que ali existe um documento de verdade e de que tipo ele é. Na
 * implementação ela vem do ONLYOFFICE (conversão da 1ª página em imagem);
 * aqui é desenhada com linhas.
 */
const props = defineProps<{
  ext: string
  tamanho?: 'sm' | 'md'
}>()

const ehPdf = computed(() => props.ext === '.pdf')
</script>

<template>
  <span
    class="relative flex shrink-0 flex-col gap-[3px] overflow-hidden rounded-[3px] border border-default bg-default px-1.5 pt-2 shadow-xs ring-1 ring-default/40"
    :class="tamanho === 'sm' ? 'h-8 w-6 px-1 pt-1.5' : 'h-[4.25rem] w-[3.25rem]'"
    aria-hidden="true"
  >
    <span class="h-[3px] w-3/4 rounded-full bg-accented" />
    <template v-if="tamanho !== 'sm'">
      <span v-for="n in 6" :key="n" class="h-[2px] rounded-full bg-elevated" :class="n % 3 === 0 ? 'w-2/3' : 'w-full'" />
    </template>
    <span
      class="absolute inset-x-0 bottom-0 py-px text-center font-semibold tracking-wide text-inverted"
      :class="[ehPdf ? 'bg-error' : 'bg-info', tamanho === 'sm' ? 'text-[6px]' : 'text-[8px]']"
    >
      {{ ehPdf ? 'PDF' : 'DOCX' }}
    </span>
  </span>
</template>
