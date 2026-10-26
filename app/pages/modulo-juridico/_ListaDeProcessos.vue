<script setup lang="ts">
/**
 * Categorias › Processos: a lista de itens da categoria, como no develop (barra de visualizações, barra de
 * ferramentas, `EnTable` com seleção, ações e paginação). Fora do escopo: está aqui como porta para a tela do processo.
 *
 * A coluna "Próximo prazo" mostra o que muda com o módulo: sem ele, a data digitada; com ele, o prazo calculado.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Processo, Risco } from './mocks'
import { pessoaPorId, processos, tribunais } from './mocks'
import { calcularPrazo, estado } from './estado'
import type { Textos } from './textos'
import { dia } from './formato'
import BarraDaLista from './_BarraDaLista.vue'

const props = defineProps<{ t: Textos, moduloLigado: boolean }>()
const emit = defineEmits<{ abrir: [number] }>()
const idioma = useIdioma()
const vista = ref('itens')
const busca = ref('')
const linhas = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return processos.filter(p => !q || [p.titulo, p.reference, p.data.numeroCnj].some(x => x.toLowerCase().includes(q)))
})

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
  <div class="flex min-h-0 flex-1 flex-col">
    <BarraDaLista v-model:ativa="vista" v-model:busca="busca" :t="t" :vistas="[{ chave: 'itens', rotulo: t.lista.itens, icone: 'i-lucide-table' }]" :novo="t.lista.novoRegistro" />
    <div class="min-h-0 flex-1 overflow-y-auto">
      <EnTable
        :columns="colunas"
        :rows="linhas"
        selectable
        :pagination="{ page: 1, pageCount: 1, total: linhas.length }"
        :locale="idioma"
        class="[&_tbody_tr]:cursor-pointer"
        @row-click="(r) => emit('abrir', (r as Processo).id)"
      >
        <template #cell-reference="{ row }">
          <span class="flex items-center gap-1.5">
            <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as Processo).reference }}</UBadge>
            <UIcon name="i-lucide-copy" class="size-3.5 text-dimmed" />
          </span>
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
          <span v-else class="text-sm text-dimmed">-</span>
        </template>
        <template #actions="{ row }">
          <UDropdownMenu :items="[[{ label: t.lista.verDetalhes, icon: 'i-lucide-eye', onSelect: () => emit('abrir', (row as Processo).id) }]]" :content="{ align: 'start' }">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.lista.acoes" @click.stop />
          </UDropdownMenu>
        </template>
      </EnTable>
    </div>
  </div>
</template>
