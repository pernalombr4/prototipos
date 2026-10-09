<script setup lang="ts">
import { useMenuDoWorkspace, type Atalho } from './estado'
import { chaveDoAtalho, useTrilha } from './trilha'
import { rotuloDoNo } from './rotulos'
import type { Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O "+" DA SEÇÃO (rodada 15). No ClickUp, o "+" de uma seção abre uma busca
 * com o que já existe no workspace, e um "+" no pé para criar algo novo.
 *
 * Aqui são três grupos, e o do meio é o que ela pediu: um MENU inteiro (uma
 * seção do workspace com as telas dela) entra como um item que se abre, com
 * as telas como submenus.
 */
const props = defineProps<{
  t: TextosDaTela
  secaoId: string
  categorias: Categoria[]
  podeConfigurar: boolean
}>()

const emit = defineEmits<{
  escolhido: []
  novaTela: []
}>()

const menu = useMenuDoWorkspace()
const trilha = useTrilha()

const presentes = computed(() => new Set((trilha.pessoal(props.secaoId)?.itens ?? []).map(chaveDoAtalho)))

function item(a: Atalho, label: string, icon: string, suffix?: string) {
  return {
    label,
    icon,
    suffix,
    onSelect: () => {
      trilha.adicionarAtalho(props.secaoId, a)
      emit('escolhido')
    },
  }
}

const grupos = computed(() => {
  const livre = (a: Atalho) => !presentes.value.has(chaveDoAtalho(a))
  const t = props.t

  const telas = [
    ...menu.destinos.value.map(d => ({ a: { tipo: 'destino' as const, id: d.id }, no: d, em: undefined as string | undefined })),
    ...menu.secoes.value.flatMap(s => (s.filhos ?? []).map(f => ({ a: { tipo: 'tela' as const, id: f.id }, no: f, em: rotuloDoNo(s, t) }))),
  ].filter(x => livre(x.a))

  const menus = menu.secoes.value
    .filter(s => (s.filhos?.length ?? 0) > 1)
    .map(s => ({ a: { tipo: 'menu' as const, id: s.id }, no: s }))
    .filter(x => livre(x.a))

  const cats = props.categorias
    .map(c => ({ a: { tipo: 'categoria' as const, id: String(c.id) }, c }))
    .filter(x => livre(x.a))

  return [
    { id: 'menus', label: t.grupoMenus, items: menus.map(x => item(x.a, rotuloDoNo(x.no, t), x.no.icone, `${x.no.filhos?.length ?? 0}`)) },
    { id: 'telas', label: t.grupoTelas, items: telas.map(x => item(x.a, rotuloDoNo(x.no, t), x.no.icone, x.em)) },
    { id: 'categorias', label: t.grupoCategorias, items: cats.map(x => item(x.a, x.c.name, x.c.icon ?? 'i-lucide-folder')) },
  ].filter(g => g.items.length)
})
</script>

<template>
  <UCommandPalette
    :groups="grupos"
    :placeholder="props.t.buscarTelas"
    class="h-80 w-80"
  >
    <template #empty>
      <p class="px-3 py-6 text-center text-sm text-muted">{{ props.t.nadaParaAdicionar }}</p>
    </template>
    <template #footer>
      <UButton
        :label="props.t.novaTelaAqui"
        icon="i-lucide-plus"
        size="sm"
        color="neutral"
        variant="ghost"
        block
        class="justify-start"
        :disabled="!props.podeConfigurar"
        @click="emit('novaTela')"
      />
    </template>
  </UCommandPalette>
</template>
