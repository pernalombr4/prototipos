<script setup lang="ts">
/**
 * O logo de cada IA conectável, em uma cor só, como os logos da tela de
 * Integrações de hoje. Os nomes dos ícones ficam escritos aqui, no .vue, para
 * o Nuxt Icon colocá-los no pacote do navegador (a busca dele não lê .ts).
 */
import type { IdDaIa } from './ias'

defineProps<{ ia: IdDaIa }>()

const icones: Record<IdDaIa, string> = {
  openai: 'i-simple-icons-openai',
  anthropic: 'i-simple-icons-claude',
  google: 'i-simple-icons-googlegemini',
  kimi: 'i-simple-icons-kimi',
  deepseek: 'i-simple-icons-deepseek',
}
</script>

<template>
  <UIcon :name="icones[ia]" />
</template>
