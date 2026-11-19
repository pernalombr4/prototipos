<script setup lang="ts">
/**
 * O logo do app, o mesmo arquivo que o produto usa (`/images/integrations/<app>.png` e a versão `_dark`), com a margem
 * transparente cortada e a altura reduzida para 96 px (o original de alguns vem com margem grande e o logo fica pequeno
 * no card). Claro e escuro trocam por CSS, sem esperar o color mode hidratar.
 *
 * Substitui o monograma das rodadas 1 e 2 (pedido da redatora em 2026-11-19: o logo é mais ilustrativo).
 */
export type AppComLogo = 'adobesign' | 'certisign' | 'clicksign' | 'd4sign' | 'docusign' | 'openai' | 'sendgrid' | 'twilio' | 'word'

const props = withDefaults(defineProps<{ app: AppComLogo, nome: string, tamanho?: 'sm' | 'md' | 'lg' }>(), { tamanho: 'md' })

const arquivos = import.meta.glob<string>('./logos/*.png', { eager: true, import: 'default' })
const claro = computed(() => arquivos[`./logos/${props.app}.png`])
// ClickSign, Twilio e Word usam o mesmo arquivo nos 2 temas.
const escuro = computed(() => arquivos[`./logos/${props.app}-escuro.png`])

// Altura fixa e largura até um teto: os logos são quase todos horizontais, com o nome escrito.
const tamanhos = { sm: 'h-4 max-w-24', md: 'h-6 max-w-32', lg: 'h-8 max-w-40' } as const
</script>

<template>
  <span class="inline-flex shrink-0 items-center" :title="nome">
    <img :src="claro" :alt="nome" class="w-auto object-contain object-left" :class="[tamanhos[tamanho], escuro && 'dark:hidden']" draggable="false">
    <img v-if="escuro" :src="escuro" :alt="nome" class="hidden w-auto object-contain object-left dark:block" :class="tamanhos[tamanho]" draggable="false">
  </span>
</template>
