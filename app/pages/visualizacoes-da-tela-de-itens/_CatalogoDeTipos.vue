<script setup lang="ts">
/**
 * PROPOSTA (rodada 4): o catálogo do "+ Visualização", no fluxo do ClickUp.
 *
 * O ClickUp abre uma lista de tipos com ícone, nome e 1 linha de descrição, mais as caixas
 * "Visualização privada" e "Fixar visualização" no rodapé; escolher o tipo já cria a visualização
 * e abre o painel de personalizar. Aqui são 2 tipos (Tabela e Kanban) e as caixas viram
 * "Só para mim" e "Fixar no início". Nenhum nome é pedido neste passo: a visualização nasce com o
 * nome do tipo, e o nome se troca no painel, que abre com ele selecionado.
 */
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Standard ou Viewer cria só para si: "Só para mim" vem marcado e travado. */
  ehOwner: boolean
}>()

const emit = defineEmits<{
  escolher: [d: { tipo: 'table' | 'kanban', soEu: boolean, fixar: boolean }]
}>()

const soEu = ref(!props.ehOwner)
const fixar = ref(false)

const tipos = computed(() => [
  { tipo: 'table' as const, icone: 'i-lucide-table', nome: props.t.catalogo.tabela, descricao: props.t.catalogo.tabelaAjuda },
  { tipo: 'kanban' as const, icone: 'i-lucide-square-kanban', nome: props.t.catalogo.kanban, descricao: props.t.catalogo.kanbanAjuda },
])
</script>

<template>
  <div class="w-80">
    <p class="px-3 pb-1 pt-3 text-xs font-medium text-muted">{{ t.catalogo.titulo }}</p>
    <div class="space-y-0.5 p-1.5">
      <button
        v-for="o in tipos"
        :key="o.tipo"
        type="button"
        class="group/tipo flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-none"
        @click="emit('escolher', { tipo: o.tipo, soEu: soEu || !ehOwner, fixar })"
      >
        <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-transform group-hover/tipo:scale-105">
          <UIcon :name="o.icone" class="size-5" />
        </span>
        <span class="min-w-0">
          <span class="block text-sm font-medium text-highlighted">{{ o.nome }}</span>
          <span class="block text-xs text-muted">{{ o.descricao }}</span>
        </span>
      </button>
    </div>
    <div class="flex items-center gap-4 border-t border-default px-3 py-2.5">
      <UTooltip :text="t.catalogo.soEuTravado" :disabled="ehOwner">
        <UCheckbox v-model="soEu" :label="t.catalogo.soEu" :disabled="!ehOwner" size="sm" />
      </UTooltip>
      <UCheckbox v-model="fixar" :label="t.catalogo.fixar" size="sm" />
    </div>
  </div>
</template>
