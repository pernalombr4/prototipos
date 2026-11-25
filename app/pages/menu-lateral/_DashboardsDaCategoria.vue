<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import { destinoDoDashboard, useDashboards } from './dashboards'
import type { TextosDaTela } from './textos'

/**
 * Os dashboards que uma categoria leva no menu (rodada 35): o submenu dela, no
 * 3º nível, como a tela de um menu. Cada um abre como tela separada, e "Tirar
 * do menu" não exclui: o dashboard continua em Análise > Dashboards.
 */
const props = defineProps<{
  t: TextosDaTela
  categoriaId: number
  destinoAtivo: string
  /** No menu flutuante da trilha não há ações. */
  flutuante?: boolean
}>()

const emit = defineEmits<{ destino: [id: string] }>()

const dashboards = useDashboards()
const toast = useToast()
const lista = computed(() => dashboards.daCategoria(props.categoriaId))

function acoesDe(id: string, nome: string) {
  return [[
    { label: props.t.ctxAbrir, icon: 'i-lucide-arrow-up-right', onSelect: () => emit('destino', destinoDoDashboard(id)) },
  ], [
    {
      label: props.t.dashTirarDoMenu,
      icon: 'i-lucide-list-minus',
      onSelect: () => {
        dashboards.mostrarNaCategoria(id, false)
        toast.add({ title: props.t.dashSaiuDoMenu(nome), icon: 'i-lucide-layout-dashboard', color: 'neutral' })
      },
    },
  ]]
}
</script>

<template>
  <LinhaDeMenu
    v-for="(d, j) in lista"
    :key="d.id"
    icone="i-lucide-layout-dashboard"
    :rotulo="d.nome"
    :nivel="3"
    :ativo="props.destinoAtivo === destinoDoDashboard(d.id)"
    :atraso="j * 20"
    :acoes="props.flutuante ? undefined : acoesDe(d.id, d.nome)"
    :com-reticencias="!props.flutuante"
    :rotulo-reticencias="props.t.maisAcoes(d.nome)"
    @selecionar="emit('destino', destinoDoDashboard(d.id))"
  />
</template>
