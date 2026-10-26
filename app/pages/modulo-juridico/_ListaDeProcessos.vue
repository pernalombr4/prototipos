<script setup lang="ts">
/**
 * Categorias › Processos: a lista de itens da categoria. Fora do escopo: está aqui só como porta para a tela do
 * processo, num `EnTable` simplificado (sem busca, filtro, período e ações da tabela de itens do develop).
 *
 * A coluna "Próximo prazo" mostra o que muda com o módulo: sem ele, a data digitada; com ele, o prazo calculado.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Processo, Risco } from './mocks'
import { pessoaPorId, processos, tribunais } from './mocks'
import { calcularPrazo, estado } from './estado'
import type { Textos } from './textos'
import { dia } from './formato'

const props = defineProps<{ t: Textos, moduloLigado: boolean }>()
const emit = defineEmits<{ abrir: [number] }>()
const idioma = useIdioma()

const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.processo.campos
  return [
    { key: 'reference', label: 'ID' },
    { key: 'titulo', label: props.t.provisao.colunas.processo },
    { key: 'tribunal', label: c.tribunal },
    { key: 'responsavel', label: c.responsavel },
    { key: 'risco', label: c.risco },
    { key: 'prazo', label: c.proximoPrazo },
  ]
})

function proximo(p: Processo) {
  if (!props.moduloLigado) return p.data.proximoPrazoDigitado
  return estado.prazos
    .filter(x => x.processo === p.id && x.status !== 'completed')
    .map(x => calcularPrazo(x).fatal)
    .sort()[0]
}
const corDoRisco: Record<Risco, 'error' | 'warning' | 'neutral'> = { provavel: 'error', possivel: 'warning', remota: 'neutral' }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 p-5">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-gavel" class="size-5 text-primary" />
        <h1 class="text-lg font-semibold text-highlighted">Processos</h1>
      </div>
      <EnTable :columns="colunas" :rows="processos" :locale="idioma" class="[&_tbody_tr]:cursor-pointer" @row-click="(r: Processo) => emit('abrir', r.id)">
        <template #cell-reference="{ row }">
          <span class="font-mono text-xs text-toned">{{ (row as Processo).reference }}</span>
        </template>
        <template #cell-titulo="{ row }">
          <span class="block max-w-80 truncate text-sm text-highlighted">{{ (row as Processo).titulo }}</span>
        </template>
        <template #cell-tribunal="{ row }">
          <span class="text-sm text-toned">{{ tribunais[(row as Processo).data.tribunal].sigla }}</span>
        </template>
        <template #cell-responsavel="{ row }">
          <span class="text-sm text-toned">{{ pessoaPorId.get((row as Processo).data.responsavel)?.nome }}</span>
        </template>
        <template #cell-risco="{ row }">
          <UBadge :label="t.riscos[estado.riscos[(row as Processo).id]!.risco]" :color="corDoRisco[estado.riscos[(row as Processo).id]!.risco]" variant="subtle" size="sm" />
        </template>
        <template #cell-prazo="{ row }">
          <span v-if="proximo(row as Processo)" class="flex items-center gap-1.5 text-sm tabular-nums text-highlighted">
            <UIcon :name="moduloLigado ? 'i-lucide-calculator' : 'i-lucide-pencil'" class="size-3.5" :class="moduloLigado ? 'text-primary' : 'text-dimmed'" />
            {{ dia(proximo(row as Processo)!, t.locale) }}
          </span>
          <span v-else />
        </template>
      </EnTable>
    </div>
  </div>
</template>
