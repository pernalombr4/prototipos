<script setup lang="ts">
/**
 * O BENI com a cor do agente, como o card e o cabeçalho do produto mostram.
 * O `Beni` desenha em 160 px e não tem prop de tamanho: o contêiner reduz
 * (`[&>*]:size-full`, o mesmo arranjo do protótipo ia-no-campo-html).
 */
import { Beni } from '@be-enlighten/beni-avatar'
import '@be-enlighten/beni-avatar/style.css'

const props = withDefaults(defineProps<{
  cor?: string
  estado?: 'idle' | 'working' | 'error' | 'celebrate'
  tamanho?: 'xs' | 'sm' | 'md' | 'lg'
}>(), { cor: '#60a5fa', estado: 'idle', tamanho: 'md' })

const classe = computed(() => ({ xs: 'size-5', sm: 'size-7', md: 'size-10', lg: 'size-12' })[props.tamanho])
</script>

<template>
  <span class="inline-flex shrink-0 items-center justify-center overflow-visible [&>*]:size-full" :class="classe" aria-hidden="true">
    <!-- O Beni quebra a hidratação quando renderiza no servidor: só no navegador. -->
    <ClientOnly>
      <Beni
        :state="estado"
        :body-base-color="cor"
        :eye-base-blink-interval="3500"
        :body-follow-mouse="false"
      />
      <template #fallback>
        <span class="rounded-full" :style="{ backgroundColor: cor }" />
      </template>
    </ClientOnly>
  </span>
</template>
