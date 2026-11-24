<script setup lang="ts">
/**
 * Nada aqui é proposta: cópia do paginador das tabelas novas do develop
 * (`EntityRendererPaginator`): "Mostrando 1 a 10 de 10 resultados", itens por
 * página e as páginas.
 */
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, total: number }>()
const pagina = defineModel<number>('pagina', { required: true })
const porPagina = defineModel<number>('porPagina', { required: true })

const tp = computed(() => props.t.emails.pagina)
const opcoes = computed(() => [10, 25, 50, 100].map(n => ({ value: n, label: tp.value.porPagina(n) })))
const inicio = computed(() => props.total ? (pagina.value - 1) * porPagina.value + 1 : 0)
const fim = computed(() => Math.min(pagina.value * porPagina.value, props.total))
</script>

<template>
  <div class="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-default px-4 py-2.5">
    <p class="text-sm text-muted">
      {{ tp.mostrando(inicio, fim, total) }}
    </p>
    <div class="flex items-center gap-3">
      <USelectMenu v-model="porPagina" :items="opcoes" value-key="value" :search-input="false" size="sm" class="w-36" :aria-label="tp.rotulo" />
      <UPagination v-model:page="pagina" :total="total" :items-per-page="porPagina" size="sm" color="neutral" variant="outline" active-color="primary" active-variant="solid" />
    </div>
  </div>
</template>
