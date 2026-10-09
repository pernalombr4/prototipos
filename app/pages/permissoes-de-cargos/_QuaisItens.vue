<script setup lang="ts">
/**
 * Célula da coluna "Quais itens": o resumo da regra (Todos, Criador,
 * Responsável, Criador ou responsável) e, no clique, o editor num popover.
 *
 * Está em toda linha, inclusive na do padrão, para a regra de criador ser
 * achada sem abrir nada (pedido da rodada 4: "ainda ta ruim pra achar").
 */
import type { Textos } from './textos'
import EditorDeItens from './_EditorDeItens.vue'
import { type CategoriaMock, acoesDeAlcance } from './mocks'
import { type EstadoDoCargo, acoesDaCategoria, itensDaCategoria, temRegra } from './estado'

const props = defineProps<{
  t: Textos
  estado: EstadoDoCargo
  categoria: CategoriaMock | null
  somenteLeitura: boolean
}>()

const regras = computed(() => props.categoria ? itensDaCategoria(props.estado, props.categoria.id) : props.estado.padraoItens)
const herdada = computed(() => !!props.categoria && !props.estado.categorias[props.categoria.id]?.itens)

/** Só contam as ações liberadas: regra em ação desligada não muda nada. */
const ativas = computed(() => acoesDeAlcance.filter(a =>
  temRegra(regras.value[a]) && (props.categoria ? acoesDaCategoria(props.estado, props.categoria.id)[a] : true)))

const resumo = computed(() => {
  const r = ativas.value.map(a => regras.value[a]!)
  if (!r.length)
    return null
  const criador = r.some(x => x.criador)
  const resp = r.some(x => x.responsavel)
  return {
    rotulo: criador && resp ? props.t.itensAmbos : criador ? props.t.itensCriador : props.t.itensResponsavel,
    icone: criador && resp ? 'i-lucide-users' : criador ? 'i-lucide-user-round' : 'i-lucide-user-check',
  }
})

const detalhe = computed(() => ativas.value.map((a) => {
  const r = regras.value[a]!
  const nome = props.t.acoes[a]
  return r.criador && r.responsavel ? props.t.soAmbos(nome) : r.criador ? props.t.soOsSeus(nome) : props.t.soResponsavel(nome)
}).join(' '))
</script>

<template>
  <UPopover :content="{ align: 'start' }">
    <UTooltip :text="detalhe" :disabled="!detalhe">
      <UButton
        size="xs"
        :color="resumo ? 'info' : 'neutral'"
        :variant="resumo ? (herdada ? 'soft' : 'subtle') : 'ghost'"
        :icon="resumo?.icone ?? 'i-lucide-list-filter'"
        trailing-icon="i-lucide-chevron-down"
        :aria-label="`${t.colunaItens}: ${categoria?.name ?? t.padraoLinha}`"
        class="max-w-full"
      >
        <span class="truncate">{{ resumo?.rotulo ?? t.itensTodos }}</span>
        <span v-if="resumo && herdada" class="shrink-0 text-dimmed">· {{ t.itensDoPadrao }}</span>
      </UButton>
    </UTooltip>
    <template #content>
      <div class="w-[26rem] max-w-[90vw] p-4">
        <p class="mb-2 text-sm font-semibold text-highlighted">{{ t.editorTitulo(categoria?.name ?? t.padraoLinha) }}</p>
        <EditorDeItens :t="t" :estado="estado" :categoria="categoria" :somente-leitura="somenteLeitura" />
      </div>
    </template>
  </UPopover>
</template>
