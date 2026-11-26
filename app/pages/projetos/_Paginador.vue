<script setup lang="ts">
/**
 * Nada aqui é proposta: cópia do paginador das tabelas novas do develop (`EntityRendererPaginator`,
 * lido no código em 2026-11-26): "Mostrando 1 a 25 de 57 resultados", itens por página (25, 50, 100,
 * 500) e as páginas, numa faixa com fundo elevado.
 */
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, total: number }>()
const pagina = defineModel<number>('pagina', { required: true })
const porPagina = defineModel<number>('porPagina', { required: true })

const td = computed(() => props.t.diretorio)
const opcoes = computed(() => [25, 50, 100, 500].map(n => ({ value: n, label: td.value.porPagina(n) })))
const inicio = computed(() => (pagina.value - 1) * porPagina.value + 1)
const fim = computed(() => Math.min(pagina.value * porPagina.value, props.total))
</script>

<template>
  <div class="mt-2 flex shrink-0 flex-wrap items-center justify-between gap-3 border-y border-default bg-elevated px-3 py-3 sm:px-6">
    <p class="text-sm text-muted">
      {{ total ? td.mostrando(inicio, fim, total) : td.semResultados }}
    </p>
    <div class="flex items-center gap-3">
      <USelectMenu v-model="porPagina" :items="opcoes" value-key="value" :search-input="false" class="w-36" :aria-label="td.paginaRotulo" />
      <UPagination v-model:page="pagina" :total="total" :items-per-page="porPagina" color="neutral" variant="outline" active-color="primary" active-variant="solid" />
    </div>
  </div>
</template>
