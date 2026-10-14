<script setup lang="ts">
/**
 * A tabela nova de itens de uma categoria (Contratos), copiada do develop:
 * `/workspaces/<ws>/types/<categoria>`, visitada em 14/10/2026.
 *
 * ⚠️ NADA AQUI É PROPOSTA. É o ponto de partida da jornada: o ícone
 * "Extrair Relatório", o menu "Relatório Padrão" e o modal "Formato de
 * extração" estão como o develop mostra, inclusive o rótulo em caixa alta.
 * A proposta começa no que acontece DEPOIS de escolher o formato, e isso
 * mora no index.vue (o aviso) e na casca (o menu e o sino).
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Formato } from './mocks'
import { contratos } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ extrair: [formato: Formato] }>()

const idioma = useIdioma()
const busca = ref('')
const escolhendoFormato = ref(false)

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'referencia', label: props.t.itens.cabecalho.referencia, sortable: true },
  { key: 'status', label: props.t.itens.cabecalho.status, sortable: true },
  { key: 'contratante', label: props.t.itens.cabecalho.contratante },
  { key: 'fornecedor', label: props.t.itens.cabecalho.fornecedor },
  { key: 'valor', label: props.t.itens.cabecalho.valor, align: 'right' },
  { key: 'fim', label: props.t.itens.cabecalho.fim },
])

const linhas = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return q ? contratos.filter(c => `${c.referencia} ${c.fornecedor} ${c.contratante}`.toLowerCase().includes(q)) : contratos
})

const corDoStatus = { 'Vigente': 'success', 'Em negociação': 'warning', 'Encerrado': 'neutral', 'Renovado': 'info' } as const

const menuDeExtrair = computed(() => [[
  { label: props.t.itens.padrao, icon: 'i-lucide-file-input', onSelect: () => { escolhendoFormato.value = true } },
]])

function escolher(f: Formato) {
  escolhendoFormato.value = false
  emit('extrair', f)
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- Abas de visualização (cópia) -->
    <div class="flex items-center gap-1 border-b border-default px-3 py-2">
      <UButton icon="i-lucide-table" :label="t.itens.aba" size="sm" color="primary" variant="soft" />
      <USeparator orientation="vertical" class="mx-1 h-5" />
      <UButton icon="i-lucide-plus" :label="t.itens.visualizar" size="sm" color="neutral" variant="ghost" />
    </div>

    <!-- Barra da lista (cópia) -->
    <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2.5">
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.itens.pesquisar" variant="none" size="sm" class="w-56" />
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-calendar" class="size-4" />{{ t.itens.criadoEm }}</span>
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-arrow-down-up" class="size-4" />{{ t.itens.todoPeriodo }}</span>

      <div class="ml-auto flex items-center gap-1">
        <UDropdownMenu :items="menuDeExtrair" :content="{ align: 'end' }">
          <UTooltip :text="t.itens.extrair">
            <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.extrair" />
          </UTooltip>
        </UDropdownMenu>
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.colunas" />
        <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.filtros" />
        <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.configurar" />
        <UButton icon="i-lucide-plus" :label="t.itens.novoRegistro" color="primary" variant="soft" size="sm" class="ml-1" />
      </div>
    </div>

    <div class="min-h-0 flex-1 animate-[entrada_.25s_ease-out] overflow-auto">
      <EnTable
        :columns="colunas"
        :rows="linhas"
        selectable
        :pagination="{ page: 1, pageCount: 1, total: linhas.length }"
        :locale="idioma"
      >
        <template #cell-referencia="{ row }">
          <span class="flex items-center gap-1.5">
            <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ row.referencia }}</UBadge>
            <UIcon name="i-lucide-copy" class="size-3.5 text-dimmed" />
          </span>
        </template>
        <template #cell-status="{ row }">
          <UBadge :label="String(row.status)" :color="corDoStatus[row.status as keyof typeof corDoStatus]" variant="subtle" size="sm" />
        </template>
        <template #actions>
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.itens.acoes" />
        </template>
      </EnTable>
    </div>

    <!-- O modal de formato, como o develop mostra (cópia) -->
    <UModal v-model:open="escolhendoFormato" :ui="{ content: 'max-w-sm' }">
      <template #content>
        <div class="p-5">
          <div class="flex items-start justify-between gap-3">
            <p class="flex items-center gap-2 text-base font-semibold text-highlighted">
              <UIcon name="i-lucide-info" class="size-5 text-info" />
              {{ t.itens.formatoTitulo }}
            </p>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.acoes.fechar" @click="escolhendoFormato = false" />
          </div>
          <p class="mt-2 text-sm text-toned">{{ t.itens.formatoDescricao }}</p>
          <div class="mt-4 flex justify-end gap-2">
            <UButton label="Excel" color="info" variant="soft" size="sm" @click="escolher('xlsx')" />
            <UButton label="CSV" color="info" variant="soft" size="sm" @click="escolher('csv')" />
            <UButton label="DBF" color="info" variant="soft" size="sm" @click="escolher('dbf')" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
