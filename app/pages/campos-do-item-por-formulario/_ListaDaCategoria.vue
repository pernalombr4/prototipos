<script setup lang="ts">
/**
 * A lista da categoria na tela nova de itens, sobre o `EnTable`.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Copiado do develop (teste-ux, 25/11/2026):
 * a aba "Itens", "+ Visualizar", a busca, "Criado em", "Todo o período", os
 * ícones da direita, "Novo registro" e o rodapé "Mostrando 1 a N de N
 * resultados". Em "Todos", as colunas são as da categoria; na página do
 * formulário, só as do formulário, e a lista traz só os itens criados por ele.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import type { ItemDoPrototipo } from './mocks'
import { campoPorRef } from './mocks'

const props = defineProps<{
  t: Textos
  itens: ItemDoPrototipo[]
  /** `refId` das colunas, na ordem. */
  colunas: string[]
  selecionado?: number | null
}>()

const emit = defineEmits<{ abrir: [id: number] }>()
const idioma = useIdioma()

const colunasDaTabela = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.lista.referencia },
  ...props.colunas.map(refId => ({ key: refId, label: campoPorRef(refId).rotulo })),
])

const linhas = computed(() => props.itens.map(i => ({ id: i.id, reference: i.reference, ...i.data })))
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="flex items-center gap-1 border-b border-default px-3 py-2">
      <UButton icon="i-lucide-table" :label="t.lista.itens" size="sm" color="primary" variant="soft" />
      <UButton icon="i-lucide-plus" :label="t.lista.visualizar" size="sm" color="neutral" variant="ghost" />
    </div>

    <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2.5">
      <UInput icon="i-lucide-search" :placeholder="t.lista.pesquisar" variant="none" size="sm" class="w-56" />
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-calendar" class="size-4" />{{ t.lista.criadoEm }}</span>
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-arrow-down-up" class="size-4" />{{ t.lista.todoPeriodo }}</span>
      <div class="ml-auto flex items-center gap-1">
        <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.exportar" />
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.colunas" />
        <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.filtros" />
        <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.configurar" />
        <UButton icon="i-lucide-plus" :label="t.lista.novoRegistro" color="primary" variant="soft" size="sm" class="ml-1" />
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-auto animate-[entrada_.25s_ease-out]">
      <EnTable
        :columns="colunasDaTabela"
        :rows="linhas"
        selectable
        :locale="idioma"
        @row-click="(r) => emit('abrir', (r as { id: number }).id)"
      >
        <template #cell-reference="{ row }">
          <span class="flex items-center gap-1.5">
            <UBadge
              :color="(row as { id: number }).id === selecionado ? 'primary' : 'info'"
              :variant="(row as { id: number }).id === selecionado ? 'solid' : 'subtle'"
              size="sm"
              class="font-mono text-[11px] transition-colors"
            >
              {{ (row as { reference: string }).reference }}
            </UBadge>
            <UIcon name="i-lucide-copy" class="size-3.5 text-dimmed" />
          </span>
        </template>
      </EnTable>
    </div>

    <p class="border-t border-default px-4 py-2 text-xs text-muted">{{ t.lista.mostrando(itens.length) }}</p>
  </div>
</template>
