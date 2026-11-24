<script setup lang="ts" generic="T extends Record<string, any>">
/**
 * Nada aqui é proposta: é a cópia da tabela das telas novas do develop
 * (`EntityRendererManyTable`, usada em Logs de Auditoria e nas telas novas de
 * itens; lido no código em 24/11/2026), para toda tabela do protótipo ficar
 * igual:
 *  - a coluna Ações vem primeiro, com 117 px, o rótulo "Ações" e 1 botão ⋮
 *    (`i-lucide-ellipsis-vertical`, neutro, ghost, xs) que abre o menu da linha
 *    num `UDropdownMenu` alinhado ao fim;
 *  - o clique direito na linha abre o mesmo menu (`UContextMenu`);
 *  - as classes do `UTable` do develop e o cabeçalho fixo;
 *  - o estado vazio vai no slot `empty`.
 * Os outros slots do `UTable` (`<coluna>-header`, `<coluna>-cell`) passam direto.
 */
import type { ContextMenuItem, DropdownMenuItem, TableColumn } from '@nuxt/ui'

const props = defineProps<{
  columns: TableColumn<T>[]
  data: T[]
  /** O menu ⋮ de cada linha. Sem ele, a tabela não tem a coluna Ações. */
  acoes?: (linha: T) => DropdownMenuItem[][]
  rotuloAcoes: string
  getRowId?: (linha: T) => string
}>()
const emit = defineEmits<{ select: [linha: T] }>()
const visiveis = defineModel<Record<string, boolean>>('columnVisibility', { default: () => ({}) })

/** As classes da tabela do develop. */
const UI = {
  base: 'min-w-0 w-full border-separate border-spacing-0 table-fixed',
  thead: 'bg-elevated/50',
  th: 'relative border-b border-default px-4 py-2 text-left text-sm font-medium text-highlighted',
  td: 'border-b border-default py-1 px-4 h-12 max-h-12 overflow-hidden align-middle text-sm',
  tr: 'cursor-pointer transition-colors hover:bg-elevated/40',
  empty: 'p-0',
}

const LARGURA_DAS_ACOES = { style: { th: { width: '117px' }, td: { width: '117px' } } }
const colunas = computed<TableColumn<T>[]>(() => props.acoes
  ? [{ id: 'acoes', meta: LARGURA_DAS_ACOES }, ...props.columns]
  : props.columns)

const linhaDoMenu = ref<T | null>(null)
const menuDoClique = computed<ContextMenuItem[][]>(() => linhaDoMenu.value && props.acoes
  ? props.acoes(linhaDoMenu.value) as ContextMenuItem[][]
  : [])
function aoCliqueDireito(_e: Event, row: { original: T }) {
  linhaDoMenu.value = row.original
}

/**
 * O vazio fica no meio da parte visível, não no meio da tabela inteira: com
 * colunas largas, a tabela passa da tela e o texto sairia do centro.
 */
const raiz = ref<HTMLElement | null>(null)
const larguraVisivel = ref(0)
let observador: ResizeObserver | null = null
onMounted(() => {
  const rolagem = raiz.value?.closest('.overflow-auto') as HTMLElement | null ?? raiz.value
  if (!rolagem) return
  observador = new ResizeObserver(() => { larguraVisivel.value = rolagem.clientWidth })
  observador.observe(rolagem)
})
onBeforeUnmount(() => observador?.disconnect())
const slots = useSlots()
const slotsDeFora = computed(() => Object.keys(slots).filter(n => n !== 'empty'))
</script>

<template>
  <div ref="raiz">
  <UContextMenu :items="menuDoClique" :disabled="!linhaDoMenu">
    <UTable
      v-model:column-visibility="visiveis"
      :data="data"
      :columns="colunas"
      sticky
      :get-row-id="getRowId"
      :on-select="(_e: Event, row: any) => emit('select', row.original)"
      :on-contextmenu="aoCliqueDireito"
      :ui="UI"
    >
      <template #acoes-header>
        <span>{{ rotuloAcoes }}</span>
      </template>
      <template #acoes-cell="{ row }">
        <div class="flex items-center justify-center" @click.stop>
          <UDropdownMenu :items="acoes!(row.original)" :content="{ align: 'end' }">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="rotuloAcoes" />
          </UDropdownMenu>
        </div>
      </template>
      <template v-for="nome in slotsDeFora" #[nome]="escopo">
        <slot :name="nome" v-bind="escopo ?? {}" />
      </template>
      <template v-if="$slots.empty" #empty>
        <div class="sticky left-0" :style="larguraVisivel ? { width: larguraVisivel + 'px' } : undefined">
          <slot name="empty" />
        </div>
      </template>
    </UTable>
  </UContextMenu>
  </div>
</template>
