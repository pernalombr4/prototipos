<script setup lang="ts">
/**
 * O botão "Criar" da Home (rodada 2). Um botão só, e o caminho ramifica:
 *
 *   Criar ▸ Item   ▸ categoria ▸ formulário (só com 2 ou mais) ▸ modal
 *   Criar ▸ Tarefa ▸ rápida ou agendada ▸ modal
 *   Criar ▸ Pedir ao BENI (com o que foi digitado)
 *
 * Pedido da redatora: "deveria ser só um botão bem objetivo mesmo. quando
 * botar pra criar, abre as opçoes 'item' e 'tarefa', aí ramifica na hora de
 * criar". Categoria com 1 formulário ou nenhum vai direto ao modal, como o
 * produto faz hoje: o seletor de formulário do modal só aparece com 2 ou mais
 * (`EntityItemsFormsUpsert.vue`), e sem formulário o modal mostra todos os
 * campos da categoria.
 *
 * Os níveis são os `children` do `UCommandPalette`: "Voltar" no topo,
 * Backspace volta, a busca filtra o nível em que a pessoa está. Na raiz, ao
 * digitar, as categorias aparecem também, para quem já sabe onde vai.
 * "Pedir ao BENI" fica sempre no pé da raiz e leva o texto digitado: é a
 * mesma ideia do "Criar com IA" do protótipo `menu-lateral` (rodada 17).
 *
 * Componentes: `UPopover`, `UCommandPalette`, `UButton`, `UTooltip` (MCP nuxt-ui).
 */
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import type { Categoria } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** As categorias que a pessoa acessa. */
  categorias: Categoria[]
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{
  item: [categoria: string, formulario?: string]
  tarefa: [tipo: 'rapida' | 'agendada']
  beni: [texto: string]
}>()

const termo = ref('')
watch(aberto, (a) => { if (!a) termo.value = '' })

function fechar(acao: () => void) {
  aberto.value = false
  acao()
}

/** A categoria vira um nível de formulários só quando tem 2 ou mais. */
function noDaCategoria(c: Categoria): CommandPaletteItem {
  if (c.formularios.length > 1) {
    return {
      label: c.name,
      icon: c.icon,
      description: props.t.criar.formularios(c.formularios.length),
      placeholder: props.t.criar.qualFormulario(c.name),
      children: c.formularios.map(f => ({
        label: f.nome,
        icon: 'i-lucide-clipboard-pen',
        onSelect: () => fechar(() => emit('item', c.slug, f.id)),
      })),
    }
  }
  return {
    label: c.name,
    icon: c.icon,
    onSelect: () => fechar(() => emit('item', c.slug, c.formularios[0]?.id)),
  }
}

const grupos = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => {
  const t = props.t.criar
  const lista: CommandPaletteGroup<CommandPaletteItem>[] = [{
    id: 'criar',
    items: [
      {
        label: t.item,
        description: t.itemDescricao,
        icon: 'i-lucide-file-plus',
        placeholder: t.qualCategoria,
        children: props.categorias.map(noDaCategoria),
      },
      {
        label: t.tarefa,
        description: t.tarefaDescricao,
        icon: 'i-lucide-list-checks',
        placeholder: t.qualTarefa,
        children: [
          { label: t.rapida, description: t.rapidaDescricao, icon: 'i-lucide-zap', onSelect: () => fechar(() => emit('tarefa', 'rapida')) },
          { label: t.agendada, description: t.agendadaDescricao, icon: 'i-lucide-calendar-clock', onSelect: () => fechar(() => emit('tarefa', 'agendada')) },
        ],
      },
    ],
  }]
  // Na raiz, com texto digitado, as categorias aparecem direto.
  if (termo.value.trim()) {
    lista.push({ id: 'categorias', label: t.item, items: props.categorias.map(noDaCategoria) })
  }
  lista.push({
    id: 'beni',
    // O BENI não passa pelo filtro: é o que sobra quando nada casou.
    ignoreFilter: true,
    items: [{
      label: t.beni,
      description: termo.value.trim() ? `"${termo.value.trim()}"` : t.beniDescricao,
      icon: 'i-lucide-sparkles',
      onSelect: () => {
        const texto = termo.value.trim()
        fechar(() => emit('beni', texto))
      },
    }],
  })
  return lista
})
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'end', sideOffset: 6 }">
    <UTooltip :text="t.criar.dica" :kbds="['C']" :content="{ side: 'bottom' }">
      <UButton
        :label="t.criar.botao"
        icon="i-lucide-plus"
        trailing-icon="i-lucide-chevron-down"
        color="primary"
        size="sm"
        :aria-label="t.criar.dica"
      />
    </UTooltip>

    <template #content>
      <UCommandPalette
        v-model:search-term="termo"
        :groups="grupos"
        :placeholder="t.criar.placeholder"
        class="h-auto max-h-[26rem] w-[min(24rem,calc(100vw-2rem))]"
      >
        <template #empty="{ searchTerm }">
          <p class="px-3 py-6 text-center text-sm text-muted">
            {{ t.criar.vazio(searchTerm) }}
          </p>
        </template>
        <template #footer>
          <p class="text-xs text-muted">
            {{ t.criar.rodape }}
          </p>
        </template>
      </UCommandPalette>
    </template>
  </UPopover>
</template>
