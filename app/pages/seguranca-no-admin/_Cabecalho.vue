<script setup lang="ts">
/**
 * Cabeçalho de página do admin: seta de voltar e título, como em Audit Logs e
 * Configurações Gerais hoje. A linha de introdução e as ações à direita são
 * proposta das telas novas.
 */
withDefaults(defineProps<{ titulo: string, intro?: string, novo?: boolean, rotuloNovo?: string, corSelo?: 'primary' | 'info' }>(), { corSelo: 'primary' })
</script>

<template>
  <div class="border-b border-default/60">
    <div class="flex flex-wrap items-center gap-3 px-6 py-3">
      <UIcon name="i-lucide-arrow-left" class="size-4 text-toned" />
      <h1 class="text-base font-semibold text-highlighted">{{ titulo }}</h1>
      <UBadge v-if="novo && rotuloNovo" :label="rotuloNovo" :color="corSelo" size="sm" variant="soft" />
      <div class="ml-auto flex flex-wrap items-center gap-2">
        <slot name="acoes" />
      </div>
    </div>
    <p v-if="intro" class="max-w-3xl px-6 pb-3 text-sm text-muted">{{ intro }}</p>
  </div>
</template>
