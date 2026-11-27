<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): os chips de filtro de campo e o "+ Filtro", juntos.
 *
 * O mesmo bloco aparece em 3 lugares, com o mesmo comportamento:
 * - na barra do dashboard (filtros que valem para quem abre o dashboard agora);
 * - no ícone de filtro do painel (filtros só desta visão do painel);
 * - no construtor (filtros salvos no painel).
 *
 * Escolher um campo que já tem chip abre o chip, em vez de criar outro.
 */
import type { FiltroDeCampo } from './agregacao'
import { useDescricaoDeFiltro, filtroNovo } from './filtros'
import { categoriaPorSlug } from './mocks'
import type { Textos } from './textos'
import ChipDeFiltro from './_ChipDeFiltro.vue'
import AdicionarFiltro from './_AdicionarFiltro.vue'

const props = defineProps<{
  t: Textos
  categorias: string[]
  ajuda?: string
  rotulo?: string
  variante?: 'ghost' | 'outline'
}>()
const filtros = defineModel<FiltroDeCampo[]>({ required: true })

const { valorCurto } = useDescricaoDeFiltro(toRef(props, 't'))
const prefixo = (slug: string) => props.categorias.length > 1 ? categoriaPorSlug.get(slug)?.name : undefined

const chipAberto = ref<number | null>(null)

async function escolher(categoria: string, campo: string) {
  const i = filtros.value.findIndex(f => f.categoria === categoria && f.campo === campo)
  if (i < 0) filtros.value = [...filtros.value, filtroNovo(categoria, campo)]
  await nextTick()
  // Espera o "+ Filtro" fechar: ele devolve o foco ao botão, e isso fecharia o chip recém-aberto.
  const alvo = i < 0 ? filtros.value.length - 1 : i
  setTimeout(() => { chipAberto.value = alvo }, 200)
}
function trocar(i: number, f: FiltroDeCampo) {
  filtros.value = filtros.value.map((x, j) => j === i ? f : x)
}
function excluir(i: number) {
  filtros.value = filtros.value.filter((_, j) => j !== i)
}
</script>

<template>
  <ChipDeFiltro
    v-for="(f, i) in filtros"
    :key="`${f.categoria}-${f.campo}-${i}`"
    :model-value="f"
    :open="chipAberto === i"
    :t="t"
    :valor-curto="valorCurto(f)"
    :prefixo="prefixo(f.categoria)"
    @update:model-value="(x: FiltroDeCampo) => trocar(i, x)"
    @update:open="(v: boolean) => (chipAberto = v ? i : null)"
    @excluir="excluir(i)"
  />
  <AdicionarFiltro
    :t="t"
    :categorias="categorias"
    :usados="filtros"
    :ajuda="ajuda"
    :rotulo="rotulo"
    :variante="variante"
    @escolher="escolher"
  />
</template>
