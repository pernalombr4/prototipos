<script setup lang="ts">
/**
 * Itens de uma visualização: a tabela de uma visualização salva da categoria,
 * com o filtro dela. É o widget que nenhuma das referências tem pronto (o
 * ClickUp deixou "card com filtro próprio" fora do roadmap): no ENSPACE a
 * visualização já existe, com filtro, colunas e ordem, e a Home só a mostra.
 *
 * Tabela é `EnTable` (regra 21). O widget mostra 4 colunas; a visualização
 * inteira abre pelo "Abrir visualização".
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Item } from './mocks'
import { pessoa } from './mocks'
import { dinheiro } from './formatar'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  itens: Item[]
  /** Itens criados nesta sessão, para o destaque de entrada. */
  recemCriados: number[]
}>()

const emit = defineEmits<{ abrirItem: [item: Item] }>()

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'titulo', label: props.t.visualizacao.colunas.item },
  { key: 'etapa', label: props.t.visualizacao.colunas.etapa },
  { key: 'responsavel', label: props.t.visualizacao.colunas.responsavel },
  { key: 'valor', label: props.t.visualizacao.colunas.valor, align: 'right' },
])

const linhas = computed(() => [...props.itens].sort((a, b) => b.criadoEm - a.criadoEm))
</script>

<template>
  <div class="min-h-0 flex-1 overflow-auto px-2 pb-2">
    <EnTable
      :columns="colunas"
      :rows="linhas"
      :empty-state="{ icon: 'i-lucide-inbox', title: t.visualizacao.vazio }"
      @row-click="(r: unknown) => emit('abrirItem', r as Item)"
    >
      <template #cell-titulo="{ row }">
        <span class="flex min-w-0 items-center gap-2">
          <UBadge
            v-if="recemCriados.includes((row as Item).id)"
            :label="t.widget.novo"
            color="success"
            variant="subtle"
            size="sm"
            class="shrink-0"
          />
          <!-- A coluna Item ganha largura própria: o EnTable divide por igual e cortava o título cedo. -->
          <span class="block w-48 min-w-0 sm:w-64 xl:w-80 2xl:w-96">
            <span class="block truncate text-sm font-medium text-highlighted" :title="(row as Item).titulo">{{ (row as Item).titulo }}</span>
            <span class="font-mono text-xs text-muted">{{ (row as Item).reference }}</span>
          </span>
        </span>
      </template>
      <template #cell-etapa="{ row }">
        <UBadge :label="(row as Item).etapa" color="neutral" variant="subtle" size="sm" />
      </template>
      <template #cell-responsavel="{ row }">
        <span class="flex items-center gap-1.5">
          <UAvatar size="2xs" :text="pessoa((row as Item).responsavel)?.iniciais" />
          <span class="max-w-36 truncate text-sm text-toned">{{ pessoa((row as Item).responsavel)?.nome }}</span>
        </span>
      </template>
      <template #cell-valor="{ row }">
        <span class="text-sm tabular-nums text-toned">{{ (row as Item).valor != null ? dinheiro((row as Item).valor!, t) : '-' }}</span>
      </template>
    </EnTable>
  </div>
</template>
