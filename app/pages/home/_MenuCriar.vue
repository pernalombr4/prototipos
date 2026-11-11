<script setup lang="ts">
/**
 * O menu "Criar": uma busca em cima e o que se cria embaixo, em 3 grupos
 * (Tarefa, Item, Formulários). É o "+ Create" do ClickUp e do QuickBooks e o
 * "Quick Create" do HubSpot, com a diferença do ENSPACE: o item nasce pelo
 * formulário da categoria, então cada formulário é uma opção.
 *
 * O mesmo menu abre pelo botão do menu lateral, pela tecla C e pelo "Mais"
 * do widget Criar rápido. `UCommandPalette` dentro de `UPopover`: busca,
 * setas, Enter e Esc vêm prontos (MCP nuxt-ui, `get-component-metadata
 * CommandPalette`).
 */
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import type { Categoria } from './mocks'
import type { OpcaoDeCriar } from './widgets'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  opcoes: OpcaoDeCriar[]
  categorias: Categoria[]
  /** Para que lado abre: à direita no menu lateral, embaixo no widget. */
  lado?: 'right' | 'bottom'
}>()

const emit = defineEmits<{ escolher: [opcao: OpcaoDeCriar] }>()
const aberto = defineModel<boolean>('open', { default: false })

defineSlots<{ default(): unknown }>()

function rotulo(o: OpcaoDeCriar) {
  const c = props.categorias.find(x => x.slug === o.categoria)
  if (o.tipo === 'tarefa') return props.t.criar.tarefaRapida
  if (o.tipo === 'item') return props.t.criar.itemEm(c?.name ?? '')
  return c?.formularios.find(f => f.id === o.formulario)?.nome ?? ''
}

function descricao(o: OpcaoDeCriar) {
  const c = props.categorias.find(x => x.slug === o.categoria)
  if (o.tipo === 'tarefa') return props.t.criar.tarefaRapidaDescricao
  if (o.tipo === 'formulario') return props.t.criar.formularioDe(c?.name ?? '')
  return undefined
}

const grupos = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => {
  const item = (o: OpcaoDeCriar): CommandPaletteItem => ({
    label: rotulo(o),
    description: descricao(o),
    icon: o.icone,
    onSelect: () => { aberto.value = false; emit('escolher', o) },
  })
  return [
    { id: 'tarefa', label: props.t.criar.grupos.tarefa, items: props.opcoes.filter(o => o.tipo === 'tarefa').map(item) },
    { id: 'item', label: props.t.criar.grupos.item, items: props.opcoes.filter(o => o.tipo === 'item').map(item) },
    { id: 'formulario', label: props.t.criar.grupos.formulario, items: props.opcoes.filter(o => o.tipo === 'formulario').map(item) },
  ]
})
</script>

<template>
  <UPopover v-model:open="aberto" :content="lado === 'bottom' ? { side: 'bottom', align: 'end', sideOffset: 4 } : { side: 'right', align: 'start', sideOffset: 8 }">
    <slot />
    <template #content>
      <UCommandPalette
        :groups="grupos"
        :placeholder="t.criar.placeholder"
        :fuse="{ resultLimit: 30, fuseOptions: { keys: ['label', 'description'], threshold: 0.3, ignoreLocation: true } }"
        class="h-96 w-80"
        :ui="{ input: '[&>input]:h-11' }"
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
