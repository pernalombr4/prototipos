<script setup lang="ts">
/**
 * O BENI de `@be-enlighten/beni-avatar`, copiado do protótipo `home`. O `Beni`
 * desenha em 160 px e não tem prop de tamanho, então o contêiner reduz.
 */
import { Beni } from '@be-enlighten/beni-avatar'
import '@be-enlighten/beni-avatar/style.css'

const props = withDefaults(defineProps<{
  estado?: 'idle' | 'working' | 'error' | 'celebrate'
  tamanho?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Cor do corpo (`beniTheme.colors.body` do agente). Sem ela, o BENI padrão. */
  cor?: string
}>(), { estado: 'idle', tamanho: 'sm', cor: '#60a5fa' })

const classe = computed(() => ({ xs: 'size-5', sm: 'size-7', md: 'size-10', lg: 'size-16', xl: 'size-24' })[props.tamanho])
</script>

<template>
  <span class="inline-flex shrink-0 items-center justify-center overflow-visible [&>*]:size-full" :class="classe" aria-hidden="true">
    <!-- O Beni quebra a hidratação quando renderiza no servidor: só no navegador. -->
    <ClientOnly>
      <Beni :state="estado" :body-base-color="cor" :eye-base-blink-interval="3500" :body-follow-mouse="false" />
      <template #fallback>
        <span class="rounded-full" :style="{ backgroundColor: cor }" />
      </template>
    </ClientOnly>
  </span>
</template>
