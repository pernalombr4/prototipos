<script setup lang="ts">
/**
 * A tabela da tela nova de itens: o formato CÉLULA.
 *
 * A tabela em si é o `EnTable` do `@be-enlighten/enspace-sdk-ui` (regra 21):
 * colunas, ordenação, seleção, paginação e os slots `#cell-{key}`. O que a
 * proposta acrescenta é o CONTEÚDO de cada célula, que sai do
 * `_ValorDoCampo.vue` com `formato="celula"`.
 *
 * Uma coluna por tipo de campo, porque a categoria desta tela tem um campo de
 * cada tipo. O cabeçalho usa o nome do tipo de propósito: quem revisa está
 * olhando o padrão do tipo, não o negócio do campo.
 *
 * A largura de cada coluna vem do catálogo (`campo.largura`), e é a mesma que
 * o dev vai usar. Não é chute do protótipo: é o valor que faz o conteúdo
 * típico daquele tipo caber sem cortar.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui'
import type { Item } from '@be-enlighten/enspace-sdk-schemas'
import type { Campo } from './campos'
import type { Textos } from './textos'
import ValorDoCampo from './_ValorDoCampo.vue'

const props = defineProps<{
  campos: Campo[]
  itens: Item[]
  t: Textos
  idioma: string
  total: number
  carregando?: boolean
  campoSelecionado?: string | null
}>()

const emit = defineEmits<{
  inspecionar: [tipo: string, item: Item]
  abrirItem: [item: Item]
  novoItem: []
}>()

const selecionados = ref<Item[]>([])

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.referencia, sortable: true },
  ...props.campos.map(c => ({
    key: c.refId,
    label: props.t.campos[c.tipo].rotulo,
    sortable: true,
    align: (c.alinhamento === 'fim' ? 'right' : 'left') as 'left' | 'right',
  })),
])

/** O sizing sai do catálogo, para as larguras serem as mesmas da proposta. */
const larguras = computed(() =>
  Object.fromEntries([
    ['reference', 260],
    ...props.campos.map(c => [c.refId, c.largura]),
  ]),
)

const paginacao = computed(() => ({
  page: 1,
  pageCount: Math.ceil(props.total / 100),
  total: props.total,
}))

const copiado = ref<string | null>(null)
async function copiarReferencia(ref: string) {
  try {
    await navigator.clipboard.writeText(ref)
    copiado.value = ref
    setTimeout(() => { copiado.value = null }, 1400)
  }
  catch { /* sem área de transferência: silêncio */ }
}

function menuDaLinha(item: Item) {
  return [
    [
      { label: props.t.verDetalhes, icon: 'i-lucide-eye', onSelect: () => emit('abrirItem', item) },
      { label: props.t.editar, icon: 'i-lucide-pencil', onSelect: () => emit('abrirItem', item) },
    ],
    [
      { label: props.t.enviarParaLixeira, icon: 'i-lucide-trash-2', color: 'error' as const },
      { label: props.t.copiarLink, icon: 'i-lucide-link', onSelect: () => copiarReferencia(item.reference) },
    ],
  ]
}
</script>

<template>
  <!--
    A barra de ferramentas é cópia do develop: busca, os dois filtros de data,
    os quatro ícones e o botão primário. Só o "Exportar" mudou de comportamento,
    e a mudança está declarada no DECISOES.md.
  -->
  <div class="flex shrink-0 flex-wrap items-center gap-1 border-b border-default px-3 py-2">
    <UInput
      icon="i-lucide-search"
      :placeholder="t.pesquisar"
      variant="none"
      size="sm"
      class="w-56"
    />
    <UButton icon="i-lucide-calendar" :label="t.criadoEm" color="neutral" variant="ghost" size="sm" />
    <UButton icon="i-lucide-filter" :label="t.todoPeriodo" color="neutral" variant="ghost" size="sm" />

    <div class="ml-auto flex items-center gap-0.5">
      <UTooltip :text="t.exportar">
        <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.exportar" />
      </UTooltip>
      <UTooltip :text="t.colunas">
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.colunas" />
      </UTooltip>
      <UTooltip :text="t.densidade">
        <UButton icon="i-lucide-settings-2" color="neutral" variant="ghost" size="sm" :aria-label="t.densidade" />
      </UTooltip>
      <UTooltip :text="t.maisOpcoes">
        <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" :aria-label="t.maisOpcoes" />
      </UTooltip>
      <UButton
        icon="i-lucide-plus"
        :label="t.novoRegistro"
        color="primary"
        variant="soft"
        size="sm"
        class="ml-1"
        @click="emit('novoItem')"
      />
    </div>
  </div>

  <!-- ─────────────────────────────── a tabela ─────────────────────────── -->
  <div class="min-h-0 flex-1 overflow-auto">
    <EnTable
      v-model:selected="selecionados"
      :columns="colunas"
      :rows="itens"
      :loading="carregando"
      selectable
      resizable
      :column-sizing="larguras"
      :pagination="paginacao"
      :locale="idioma === 'pt-BR' ? 'pt-BR' : idioma === 'es' ? 'es' : 'en'"
    >
      <!-- A referência é o identificador, e o produto a mostra como selo copiável -->
      <template #cell-reference="{ row }">
        <div class="flex items-center gap-1.5">
          <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">
            {{ (row as Item).reference }}
          </UBadge>
          <UButton
            :icon="copiado === (row as Item).reference ? 'i-lucide-check' : 'i-lucide-copy'"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t.copiar"
            @click.stop="copiarReferencia((row as Item).reference)"
          />
          <UBadge v-if="(row as Item).isDraft" color="warning" variant="subtle" size="sm">
            {{ t.rascunho }}
          </UBadge>
          <UBadge v-else-if="(row as Item).status === 'inactive'" color="neutral" variant="soft" size="sm">
            {{ t.inativo }}
          </UBadge>
        </div>
      </template>

      <!--
        Uma célula por tipo de campo, todas passando pelo mesmo componente.
        É isso que garante que o número esteja à direita na tabela inteira e
        que o selo tenha a mesma cor em qualquer coluna.
      -->
      <template
        v-for="campo in campos"
        :key="campo.refId"
        #[`cell-${campo.refId}`]="{ row }"
      >
        <div
          class="relative"
          :class="campoSelecionado === campo.tipo ? 'ring-1 ring-primary/40 rounded' : ''"
        >
          <ValorDoCampo
            :campo="campo"
            :valor="((row as Item).data as Record<string, unknown>)?.[campo.refId]"
            formato="celula"
            :t="t"
            :idioma="idioma"
            @inspecionar="emit('inspecionar', campo.tipo, row as Item)"
          />
        </div>
      </template>

      <template #actions="{ row }">
        <UDropdownMenu :items="menuDaLinha(row as Item)">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t.acoes"
          />
        </UDropdownMenu>
      </template>

      <template #empty>
        <UEmpty
          icon="i-lucide-table-2"
          :title="t.semItensTitulo"
          :description="t.semItensTexto"
        >
          <template #actions>
            <UButton
              icon="i-lucide-plus"
              :label="t.semItensAcao"
              color="primary"
              variant="soft"
              size="sm"
              @click="emit('novoItem')"
            />
          </template>
        </UEmpty>
      </template>
    </EnTable>
  </div>
</template>
