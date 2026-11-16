<script setup lang="ts">
/**
 * Fora do escopo: a aba Playbooks existe no produto e continua como é. Aqui
 * só a lista, para a barra de abas ficar completa. Nada aqui é proposta.
 */
import type { Textos } from './textos'

defineProps<{ t: Textos }>()

const lista = [
  { nome: 'Contrato de prestação de serviços', regras: 18, agentes: 1, icone: 'i-lucide-file-check' },
  { nome: 'Acordo de confidencialidade', regras: 9, agentes: 1, icone: 'i-lucide-lock' },
]
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-highlighted">{{ t.playbooks.titulo }}</h1>
        <p class="mt-0.5 text-sm text-muted">{{ t.playbooks.subtitulo }}</p>
      </div>
      <UButton :label="t.playbooks.novo" icon="i-lucide-plus" />
    </div>
    <p class="flex items-center gap-2 text-xs text-dimmed"><UIcon name="i-lucide-info" class="size-3.5" />{{ t.playbooks.foraDoEscopo }}</p>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="p in lista" :key="p.nome" class="rounded-lg border border-default p-4">
        <span class="mb-2 flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary"><UIcon :name="p.icone" class="size-4" /></span>
        <p class="text-sm font-medium text-highlighted">{{ p.nome }}</p>
        <p class="mt-1 text-xs text-muted">{{ t.playbooks.regras(p.regras) }} · {{ t.playbooks.agentes(p.agentes) }}</p>
      </div>
    </div>
  </div>
</template>
