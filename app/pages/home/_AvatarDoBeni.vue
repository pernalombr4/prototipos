<script setup lang="ts">
/**
 * O BENI de `@be-enlighten/beni-avatar`, no tamanho do cabeçalho da conversa
 * e do widget. Mesmo arranjo do protótipo central-de-agentes-de-ia: o `Beni`
 * desenha em 160 px e não tem prop de tamanho, então o contêiner reduz.
 */
import { Beni } from '@be-enlighten/beni-avatar'
import '@be-enlighten/beni-avatar/style.css'

const props = withDefaults(defineProps<{
  estado?: 'idle' | 'working' | 'error' | 'celebrate'
  tamanho?: 'xs' | 'sm' | 'md' | 'lg'
}>(), { estado: 'idle', tamanho: 'sm' })

const classe = computed(() => ({ xs: 'size-5', sm: 'size-7', md: 'size-10', lg: 'size-16' })[props.tamanho])
</script>

<template>
  <span class="inline-flex shrink-0 items-center justify-center overflow-visible [&>*]:size-full" :class="classe" aria-hidden="true">
    <!-- O Beni quebra a hidratação quando renderiza no servidor: só no navegador. -->
    <ClientOnly>
      <Beni :state="estado" body-base-color="#60a5fa" :eye-base-blink-interval="3500" :body-follow-mouse="false" />
      <template #fallback>
        <span class="rounded-full bg-primary" />
      </template>
    </ClientOnly>
  </span>
</template>
