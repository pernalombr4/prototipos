<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): Categorias › Assuntos, a lista de itens da categoria, como toda categoria do develop (barra de
 * visualizações, barra de ferramentas e `EnTable`). A lista não é proposta; o que é proposta são as colunas calculadas
 * pela relação inversa: quantos processos apontam para o assunto e o estimado somado deles.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Assunto } from './mocks'
import { assuntos, pessoaPorId } from './mocks'
import { estado, processosDoAssunto } from './estado'
import type { Textos } from './textos'
import { dinheiro } from './formato'
import { textosAssuntos } from './textos-assuntos'
import BarraDaLista from './_BarraDaLista.vue'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ abrir: [number] }>()
const ta = useTextos(textosAssuntos)
const idioma = useIdioma()
const vista = ref('itens')
const busca = ref('')
const linhas = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return assuntos.filter(a => !q || [a.titulo, a.reference].some(x => x.toLowerCase().includes(q)))
})

const colunas = computed<EnTableColumn[]>(() => {
  const c = ta.value.lista.colunas
  return [
    { key: 'reference', label: 'ID' },
    { key: 'titulo', label: c.assunto },
    { key: 'tipo', label: c.tipo },
    { key: 'responsavel', label: c.responsavel },
    { key: 'processos', label: c.processos },
    { key: 'estimado', label: c.estimado },
  ]
})

const estimado = (a: Assunto) => processosDoAssunto(a.id).reduce((s, p) => s + estado.riscos[p.id]!.estimado, 0)
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
        @row-click="(r) => emit('abrir', (r as Assunto).id)"
      >
        <template #cell-reference="{ row }">
          <span class="flex items-center gap-1.5">
            <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as Assunto).reference }}</UBadge>
            <UIcon name="i-lucide-copy" class="size-3.5 text-dimmed" />
          </span>
        </template>
        <template #cell-titulo="{ row }">
          <span class="block max-w-80 truncate text-sm text-highlighted">{{ (row as Assunto).titulo }}</span>
        </template>
        <template #cell-tipo="{ row }">
          <span class="text-sm text-toned">{{ (row as Assunto).data.tipo }}</span>
        </template>
        <template #cell-responsavel="{ row }">
          <span class="text-sm text-toned">{{ pessoaPorId.get((row as Assunto).data.responsavel)?.nome }}</span>
        </template>
        <template #cell-processos="{ row }">
          <span class="text-sm tabular-nums text-toned">{{ processosDoAssunto((row as Assunto).id).length }}</span>
        </template>
        <template #cell-estimado="{ row }">
          <span class="text-sm tabular-nums text-toned">{{ dinheiro(estimado(row as Assunto), props.t.locale) }}</span>
        </template>
        <template #actions="{ row }">
          <UDropdownMenu :items="[[{ label: t.lista.verDetalhes, icon: 'i-lucide-eye', onSelect: () => emit('abrir', (row as Assunto).id) }]]" :content="{ align: 'start' }">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.lista.acoes" @click.stop />
          </UDropdownMenu>
        </template>
      </EnTable>
    </div>
  </div>
</template>
