<script setup lang="ts">
/**
 * Os itens por trás de um número: o clique numa barra, fatia, linha da tabela ou
 * etapa do funil abre os itens daquele recorte, sem sair do dashboard.
 *
 * A lista é o `EnTable` da listagem da categoria, com as colunas que o painel usa.
 * O botão do rodapé leva à listagem de verdade com o recorte aplicado (maquete:
 * no protótipo, mostra um aviso).
 */
import type { EnTableColumn, EnTablePagination } from '@be-enlighten/enspace-sdk-ui/base'
import type { ConfigDoPainel } from './agregacao'
import { campoDe, ehData, ehMoeda, rotuloDaChave } from './agregacao'
import type { ItemDoMock } from './mocks'
import { categoriaPorSlug, itemPorId } from './mocks'
import type { Textos } from './textos'
import { formatarValor } from './formatar'

const props = defineProps<{
  t: Textos
  cfg?: ConfigDoPainel
  ids: number[]
  /** O recorte, em pedaços legíveis: "Status: Assinado", "Período: Este ano". */
  recorte: string[]
}>()

const aberto = defineModel<boolean>('open', { default: false })
const toast = useToast()

const categoria = computed(() => props.cfg && categoriaPorSlug.get(props.cfg.categoria))
const dim = computed(() => props.cfg && campoDe(props.cfg.categoria, props.cfg.agruparPor))
const medida = computed(() => props.cfg && campoDe(props.cfg.categoria, props.cfg.medida))

const POR_PAGINA = 25
const pagina = ref(1)
watch(() => props.ids, () => { pagina.value = 1 })

const rotulos = computed(() => ({ ...props.t.rotulos, locale: props.t.locale }))

function textoDo(item: ItemDoMock, refId: string) {
  const c = props.cfg && campoDe(props.cfg.categoria, refId)
  if (!c) return ''
  if (refId === 'created_at') return item.created_at.toLocaleDateString(props.t.locale)
  if (refId === 'user') return item.user
  const v = item.data[refId]
  if (ehData(c)) return typeof v === 'string' ? new Date(v).toLocaleDateString(props.t.locale) : rotulos.value.vazio
  if (Array.isArray(v)) return v.length ? v.map(k => rotuloDaChave(c, k, 'mes', rotulos.value)).join(', ') : rotulos.value.vazio
  if (v === null || v === undefined || v === '') return rotulos.value.vazio
  if (typeof v === 'number') return formatarValor(v, { locale: props.t.locale, moeda: ehMoeda(c), funcao: 'soma' })
  return rotuloDaChave(c, String(v), 'mes', rotulos.value)
}

const colunas = computed<EnTableColumn[]>(() => {
  if (!props.cfg || !categoria.value) return []
  const c: EnTableColumn[] = [
    { key: 'referencia', label: props.t.detalhe.referencia },
    { key: 'nome', label: categoria.value.campos.find(x => x.refId === categoria.value!.display)?.name ?? '' },
  ]
  if (dim.value && !ehData(dim.value)) c.push({ key: 'dim', label: dim.value.name })
  const quebra = campoDe(props.cfg.categoria, props.cfg.quebrarPor)
  if (quebra) c.push({ key: 'quebra', label: quebra.name })
  if (medida.value && props.cfg.funcao !== 'contagem') c.push({ key: 'medida', label: medida.value.name, align: 'right' })
  if (props.cfg.campoDeData !== 'created_at') c.push({ key: 'data', label: campoDe(props.cfg.categoria, props.cfg.campoDeData)?.name ?? '' })
  c.push({ key: 'criado', label: props.t.detalhe.criadoEm })
  return c
})

const linhas = computed(() => {
  if (!props.cfg) return []
  const inicio = (pagina.value - 1) * POR_PAGINA
  return props.ids.slice(inicio, inicio + POR_PAGINA).map((id) => {
    const item = itemPorId.get(id)!
    return {
      id,
      referencia: item.reference,
      nome: String(item.data[categoria.value!.display] ?? ''),
      dim: props.cfg!.agruparPor ? textoDo(item, props.cfg!.agruparPor) : '',
      quebra: props.cfg!.quebrarPor ? textoDo(item, props.cfg!.quebrarPor) : '',
      medida: props.cfg!.medida ? textoDo(item, props.cfg!.medida) : '',
      data: textoDo(item, props.cfg!.campoDeData),
      criado: item.created_at.toLocaleDateString(props.t.locale),
    }
  })
})

const paginacao = computed<EnTablePagination>(() => ({
  page: pagina.value,
  pageCount: Math.max(1, Math.ceil(props.ids.length / POR_PAGINA)),
  total: props.ids.length,
}))

function abrirNaListagem() {
  toast.add({ title: props.t.detalhe.abrirNaListagem(categoria.value?.name ?? ''), description: props.t.detalhe.abrirAviso, icon: 'i-lucide-external-link' })
}
</script>

<template>
  <USlideover
    v-model:open="aberto"
    :title="categoria?.name"
    :description="t.detalhe.itens(ids.length)"
    :close="{ 'aria-label': t.detalhe.fechar }"
    :ui="{ content: 'sm:max-w-3xl', body: 'flex flex-col gap-3' }"
  >
    <template #body>
      <ul class="flex flex-wrap gap-1.5">
        <li v-for="r in recorte" :key="r">
          <UBadge :label="r" color="neutral" variant="outline" size="md" />
        </li>
      </ul>

      <EnTable
        :columns="colunas"
        :rows="linhas"
        :pagination="paginacao"
        :locale="(t.locale as any)"
        :empty-state="{ icon: 'i-lucide-search-x', title: t.detalhe.vazio }"
        @page-change="(p: number) => { pagina = p }"
      >
        <template #cell-referencia="{ row }">
          <span class="font-mono text-xs text-toned">{{ (row as any).referencia }}</span>
        </template>
        <template #cell-nome="{ row }">
          <span class="block max-w-72 truncate font-medium text-highlighted">{{ (row as any).nome }}</span>
        </template>
        <template #cell-medida="{ row }">
          <span class="tabular-nums">{{ (row as any).medida }}</span>
        </template>
      </EnTable>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.detalhe.fechar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="t.detalhe.abrirNaListagem(categoria?.name ?? '')" icon="i-lucide-table-2" color="primary" variant="outline" @click="abrirNaListagem" />
      </div>
    </template>
  </USlideover>
</template>
