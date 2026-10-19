<script setup lang="ts">
/**
 * Cartão de configuração do admin, no formato que a tela Configurações Gerais já
 * usa (control.develop.enspace.io/a/settings, 2026-10-19): ícone e título na
 * linha de cima, separador, descrição e o controle embaixo. As telas novas
 * reaproveitam esse formato para o dev não criar um segundo padrão.
 * A chave técnica (`max_file_size_mb`) que a tela de hoje mostra fica de fora:
 * o admin do cliente não precisa dela.
 */
defineProps<{ titulo: string, icone?: string, descricao?: string, alterada?: boolean }>()
</script>

<template>
  <section class="rounded-lg border bg-default transition-[border-color,box-shadow] duration-200" :class="alterada ? 'border-primary/60 shadow-sm shadow-primary/10' : 'border-default'">
    <header class="flex items-center gap-2 border-b border-default px-4 py-3">
      <UIcon v-if="icone" :name="icone" class="size-4 shrink-0 text-highlighted" />
      <h3 class="text-sm font-semibold text-highlighted">{{ titulo }}</h3>
      <div class="ml-auto flex items-center gap-2">
        <slot name="selos" />
      </div>
    </header>
    <div class="space-y-3 px-4 py-3">
      <p v-if="descricao" class="text-sm text-muted">{{ descricao }}</p>
      <slot />
    </div>
  </section>
</template>
