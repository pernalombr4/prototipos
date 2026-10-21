<script setup lang="ts">
/**
 * O topo de toda tela: ícone, título (o nome do menu, U1 da auditoria:
 * hoje o Nome configurado só vira título em Painéis), descrição e as ações
 * à direita.
 *
 * Embaixo, a faixa tracejada é ANDAIME: diz ao dev quais tipos legados esta
 * tela substitui. Não vai para o produto.
 */
defineProps<{
  icone: string
  titulo: string
  descricao: string
  /** Andaime: os tipos de Interface > Telas que esta tela absorve. */
  substitui: string[]
  /** Andaime: onde a tela mora no menu. */
  onde: string
}>()
</script>

<template>
  <div class="border-b border-default px-6 pb-4 pt-5">
    <div class="flex flex-wrap items-start gap-4">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <UIcon :name="icone" class="size-5" />
      </span>
      <div class="min-w-0 flex-1">
        <h1 class="text-lg font-semibold text-highlighted">{{ titulo }}</h1>
        <p class="mt-0.5 max-w-3xl text-sm text-muted">{{ descricao }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <slot name="acoes" />
      </div>
    </div>

    <!-- ANDAIME, não faz parte da proposta -->
    <div class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-dashed border-accented px-3 py-1.5 text-xs text-muted">
      <span class="font-semibold uppercase tracking-wider">Protótipo</span>
      <span>{{ onde }}</span>
      <span class="text-dimmed" aria-hidden="true">·</span>
      <span>
        {{ substitui.length ? 'Substitui os tipos legados:' : 'Tipo novo, sem legado.' }}
        <span v-for="(s, i) in substitui" :key="s" class="font-medium text-toned">{{ s }}{{ i < substitui.length - 1 ? ', ' : '' }}</span>
      </span>
    </div>
  </div>
</template>
