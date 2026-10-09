<script setup lang="ts">
/**
 * O BENI pequeno, com o tema do agente (`beniTheme` do cadastro: cor do
 * corpo, dos olhos e acessório). Sem agente, é o BENI padrão.
 *
 * O `Beni` desenha em 160 px e não tem prop de tamanho: o contêiner reduz
 * (`[&>*]:size-full`, registrado no DECISOES).
 */
import { Beni } from '@be-enlighten/beni-avatar'
import '@be-enlighten/beni-avatar/style.css'
import type { AgenteDoCampo } from './mocks'

const props = withDefaults(defineProps<{
  agente?: AgenteDoCampo | null
  estado?: 'idle' | 'working' | 'error' | 'celebrate'
  tamanho?: 'xs' | 'sm' | 'md'
}>(), { agente: null, estado: 'idle', tamanho: 'sm' })

const tema = computed(() => props.agente?.beniTheme)
const classe = computed(() => ({ xs: 'size-5', sm: 'size-6', md: 'size-8' })[props.tamanho])
</script>

<template>
  <span class="inline-flex shrink-0 items-center justify-center overflow-visible [&>*]:size-full" :class="classe" aria-hidden="true">
    <Beni
      :state="estado"
      :head-item="tema?.headItem ?? null"
      :body-base-color="tema?.colors?.body"
      :body-base-color-to="tema?.colors?.bodyTo"
      :eye-base-color="tema?.colors?.eyes"
      :eye-base-blink-interval="3500"
      :body-follow-mouse="false"
    />
  </span>
</template>
