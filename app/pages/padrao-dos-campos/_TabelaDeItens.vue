<script setup lang="ts">
/**
 * A tabela da tela nova de itens: o formato CÉLULA, e ele edita.
 *
 * A tabela em si é o `EnTable` do `@be-enlighten/enspace-sdk-ui` (regra 21):
 * colunas, ordenação, seleção, paginação e os slots `#cell-{key}`. O que a
 * proposta acrescenta é o CONTEÚDO de cada célula e o comportamento dela.
 *
 * ## Os três gestos da tabela
 *
 * | Gesto | O que faz |
 * |---|---|
 * | clique no valor da célula | entra em **edição ali mesmo** |
 * | clique no nome da coluna | abre a **ficha do tipo** |
 * | duplo clique na linha | abre a **visão rápida** do item |
 *
 * O duplo clique é o gesto do develop (medido em 22/09/2026). O clique único
 * para editar é a proposta: hoje a célula não edita.
 *
 * ## Onde a edição acontece
 *
 * Dentro da linha, quando o controle cabe na altura de uma linha. Em camada
 * flutuante, quando não cabe: texto longo, bloco de subcampos, lista de
 * caixas, anexo, repetidor. O que vai para cada lado está no catálogo, em
 * `edicaoEmPopover`, e a razão é a do documento do time de produtos: conteúdo
 * extenso não pode esticar a altura da linha.
 *
 * Campo que o sistema preenche (`somenteLeitura`) não entra em edição e não
 * ganha hover, porque hover que promete clique tem que entregar clique.
 *
 * A largura de cada coluna vem do catálogo (`campo.largura`), e é a mesma que
 * o dev vai usar.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui'
import type { Item } from '@be-enlighten/enspace-sdk-schemas'
import type { Campo } from './campos'
import type { Textos } from './textos'
import EntradaDoCampo from './_EntradaDoCampo.vue'
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
  abrirTelaDoItem: [item: Item]
  editarValor: [item: Item, refId: string, valor: unknown]
  novoItem: []
}>()

const selecionados = ref<Item[]>([])

/** Qual célula está aberta para edição. Uma por vez. */
const emEdicao = ref<{ id: number, refId: string } | null>(null)

function editando(item: Item, refId: string) {
  return emEdicao.value?.id === item.id && emEdicao.value?.refId === refId
}

function abrirEdicao(campo: Campo, item: Item) {
  if (campo.somenteLeitura) return
  emEdicao.value = { id: item.id, refId: campo.refId }
}

function fecharEdicao() {
  emEdicao.value = null
}

/* Esc fecha a edição da célula sem desfazer, antes de qualquer outro Esc. */
onMounted(() => {
  const aoTeclar = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && emEdicao.value) {
      e.stopPropagation()
      fecharEdicao()
    }
  }
  window.addEventListener('keydown', aoTeclar, true)
  onUnmounted(() => window.removeEventListener('keydown', aoTeclar, true))
})

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.referencia, sortable: true },
  ...props.campos.map(c => ({
    key: c.refId,
    label: props.t.campos[c.tipo].rotulo,
    sortable: true,
    align: (c.alinhamento === 'fim' ? 'right' : 'left') as 'left' | 'right',
  })),
])

const larguras = computed(() =>
  Object.fromEntries([
    ['reference', 260],
    ...props.campos.map(c => [c.refId, c.largura]),
  ]),
)

const paginacao = computed(() => ({
  page: 1,
  pageCount: Math.max(1, Math.ceil(props.total / 100)),
  total: props.total,
}))

const copiado = ref<string | null>(null)
async function copiarReferencia(referencia: string) {
  try {
    await navigator.clipboard.writeText(referencia)
    copiado.value = referencia
    setTimeout(() => { copiado.value = null }, 1400)
  }
  catch { /* sem área de transferência: silêncio */ }
}

function menuDaLinha(item: Item) {
  return [
    [
      { label: props.t.verDetalhes, icon: 'i-lucide-eye', onSelect: () => emit('abrirItem', item) },
      { label: props.t.editar, icon: 'i-lucide-pencil', onSelect: () => emit('abrirTelaDoItem', item) },
    ],
    [
      { label: props.t.enviarParaLixeira, icon: 'i-lucide-trash-2', color: 'error' as const },
      { label: props.t.copiarLink, icon: 'i-lucide-link', onSelect: () => copiarReferencia(item.reference) },
    ],
  ]
}

/**
 * Dois gestos que são da LINHA e do CABEÇALHO, não da célula, e por isso são
 * ligados no DOM que o `EnTable` monta:
 *
 * - duplo clique na linha abre a visão rápida, como no develop;
 * - clique no rótulo da coluna abre a ficha daquele tipo.
 */
const raiz = ref<HTMLElement | null>(null)

onMounted(() => nextTick(() => {
  const tabela = raiz.value?.querySelector('table')
  if (!tabela) return

  tabela.addEventListener('dblclick', (e) => {
    const linha = (e.target as HTMLElement).closest('tbody tr')
    if (!linha) return
    const i = [...(linha.parentElement?.children ?? [])].indexOf(linha)
    const item = props.itens[i]
    if (item) emit('abrirItem', item)
  })

  tabela.addEventListener('click', (e) => {
    const th = (e.target as HTMLElement).closest('thead th')
    if (!th) return
    const i = [...(th.parentElement?.children ?? [])].indexOf(th)
    /* A coluna 0 é a seleção e a 1 é a referência: as duas não são campo. */
    const campo = props.campos[i - 2]
    if (campo) emit('inspecionar', campo.tipo, props.itens[0]!)
  })
}))
</script>

<template>
  <!--
    A barra de ferramentas é cópia do develop: busca, os dois filtros de data,
    os quatro ícones e o botão primário. O relatório de verdade está no
    andaime, para não se confundir com o Exportar que o produto já tem.
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
  <div ref="raiz" class="min-h-0 flex-1 overflow-auto">
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
        Uma célula por tipo, todas passando pelos mesmos dois componentes: o de
        leitura e o de escrita. É isso que garante que o número esteja à direita
        na tabela inteira e que editar na célula seja o MESMO controle do
        formulário, e não um primo parecido.
      -->
      <template
        v-for="campo in campos"
        :key="campo.refId"
        #[`cell-${campo.refId}`]="{ row }"
      >
        <!-- editando dentro da linha -->
        <div
          v-if="editando(row as Item, campo.refId) && !campo.edicaoEmPopover"
          class="-my-1 py-1"
        >
          <EntradaDoCampo
            :campo="campo"
            :model-value="((row as Item).data as Record<string, unknown>)?.[campo.refId]"
            :t="t"
            :idioma="idioma"
            sem-rotulo
            autofoco
            @update:model-value="(v: unknown) => emit('editarValor', row as Item, campo.refId, v)"
            @sair="fecharEdicao()"
          />
        </div>

        <!-- editando em camada flutuante, porque o controle não cabe na linha -->
        <UPopover
          v-else-if="editando(row as Item, campo.refId)"
          open
          :content="{ align: 'start', side: 'bottom' }"
          @update:open="(v: boolean) => !v && fecharEdicao()"
        >
          <ValorDoCampo
            :campo="campo"
            :valor="((row as Item).data as Record<string, unknown>)?.[campo.refId]"
            formato="celula"
            :t="t"
            :idioma="idioma"
          />
          <template #content>
            <div class="w-96 max-w-[90vw] p-3">
              <EntradaDoCampo
                :campo="campo"
                :model-value="((row as Item).data as Record<string, unknown>)?.[campo.refId]"
                :t="t"
                :idioma="idioma"
                @update:model-value="(v: unknown) => emit('editarValor', row as Item, campo.refId, v)"
              />
              <div class="mt-3 flex justify-end">
                <UButton :label="t.confirmar" color="primary" size="xs" @click="fecharEdicao()" />
              </div>
            </div>
          </template>
        </UPopover>

        <!-- em leitura -->
        <div
          v-else
          :class="campoSelecionado === campo.tipo ? 'rounded ring-1 ring-primary/40' : ''"
        >
          <ValorDoCampo
            :campo="campo"
            :valor="((row as Item).data as Record<string, unknown>)?.[campo.refId]"
            formato="celula"
            :t="t"
            :idioma="idioma"
            @editar="abrirEdicao(campo, row as Item)"
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
