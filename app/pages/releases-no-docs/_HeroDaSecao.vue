<script setup lang="ts">
/**
 * Cópia do `EnPageHero.vue` do `en-docs` (lido em 2026-11-24): o topo das abas Blog e Releases.
 * Nada aqui é proposta; o que muda é o texto que a tela passa (título e descrição da aba Releases).
 * O fundo `LoginSpaceBackground` + `StarsBg` do site virou os 2 brilhos borrados que o próprio
 * componente já desenha no slot `#top`.
 */
defineProps<{ title: string, description: string }>()
</script>

<template>
  <UPageHero
    :title="title"
    :description="description"
    :ui="{
      root: 'relative isolate border-b border-default',
      container: 'py-16 sm:py-24 lg:py-28',
    }"
  >
    <template #top>
      <div class="pointer-events-none absolute -top-32 -left-32 size-96 rounded-full bg-primary/8 blur-3xl" />
      <div class="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-secondary/8 blur-3xl" />
    </template>

    <template #headline>
      <UBadge color="primary" variant="subtle" size="lg" icon="i-lucide-rocket">
        {{ title }}
      </UBadge>
    </template>
  </UPageHero>
</template>
