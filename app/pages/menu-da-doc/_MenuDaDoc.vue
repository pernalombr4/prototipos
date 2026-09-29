<script setup lang="ts">
/**
 * A barra da documentação, nos 3 desenhos.
 *
 * HOJE (casca): a reprodução do `UContentNavigation` do en-docs, com as
 * classes do tema do Nuxt UI 4.5.1 que o site usa. Pasta só abre e fecha, e a
 * página índice aparece como 1º filho, com o mesmo nome da pasta. Abre 1 ramo
 * por nível (`type="single"`), não abre sozinha no ramo da página atual e corta
 * o nome que não cabe.
 *
 * A e B (proposta), o que muda nas 2:
 *   1. a barra abre sozinha no ramo da página atual;
 *   2. a pasta abre a própria página índice ao ser clicada, e a seta ao lado
 *      só abre e fecha. O índice deixa de repetir o nome da pasta como filho;
 *   3. a pasta que só tem o índice aparece como link, sem seta;
 *   4. o nome longo quebra linha em vez de ser cortado.
 *
 * Só na B: os títulos de seção são fixos (não recolhem), como "Membro",
 * "Configurações" e "Ajuda" no menu do ENSPACE, e os itens do menu do produto
 * têm o ícone e a ordem de lá.
 *
 * Cada clique na barra sai pelo emit `clique`, para o contador da tarefa.
 */
import type { Lingua, Menu, No } from './mocks'
import { caminhoAte } from './mocks'
import type { Textos } from './textos'
import NoDoMenu from './_NoDoMenu.vue'

const props = defineProps<{
  menu: Menu
  arvore: No[]
  paginaAtiva: string
  t: Textos
  l: Lingua
  /** Abre sozinha no ramo da página atual. Nas propostas é sim; hoje, não. */
  seguirPagina: boolean
  carregando?: boolean
  erro?: boolean
}>()

const emit = defineEmits<{
  abrir: [paginaId: string]
  clique: []
  recarregar: []
}>()

/** Qual filho está aberto em cada pai. 1 por nível, como o `type="single"` do site. */
const abertoPorPai = reactive<Record<string, string | undefined>>({})

function revelar(paginaId: string) {
  const caminho = caminhoAte(props.arvore, paginaId)
  caminho.forEach((no, i) => {
    const pai = i === 0 ? 'raiz' : caminho[i - 1]!.id
    const ultimo = i === caminho.length - 1
    if (no.tipo === 'pasta' && (!ultimo || no.filhos?.length)) abertoPorPai[pai] = no.id
  })
}

const elementoDaBarra = useTemplateRef<HTMLElement>('barra')

/**
 * Proposta: além de abrir o ramo, a barra rola até o item ativo. Sem isso, na
 * barra longa da B a página aberta fica abaixo da dobra e a pessoa não vê onde
 * está. Espera a pasta terminar de abrir (200 ms) antes de medir.
 */
function mostrarAtivo() {
  if (!import.meta.client) return
  setTimeout(() => {
    const ativo = elementoDaBarra.value?.querySelector<HTMLElement>('[aria-current="page"]')
    if (!ativo) return
    let caixa = ativo.parentElement
    while (caixa && !/(auto|scroll)/.test(getComputedStyle(caixa).overflowY)) caixa = caixa.parentElement
    if (!caixa) return
    const a = ativo.getBoundingClientRect()
    const c = caixa.getBoundingClientRect()
    if (a.top < c.top + 8 || a.bottom > c.bottom - 8) {
      caixa.scrollTop += (a.top - c.top) - c.height / 3
    }
  }, 240)
}

watch(
  () => [props.paginaAtiva, props.seguirPagina] as const,
  ([pagina, seguir]) => {
    if (!seguir) return
    revelar(pagina)
    mostrarAtivo()
  },
  { immediate: true },
)

function estaAberto(no: No, pai: string) {
  return no.tipo === 'titulo' || abertoPorPai[pai] === no.id
}

function alternar(no: No, pai: string) {
  emit('clique')
  abertoPorPai[pai] = abertoPorPai[pai] === no.id ? undefined : no.id
}

/** Proposta: a linha da pasta abre o índice e mostra os filhos. */
function abrirPasta(no: No, pai: string) {
  emit('clique')
  if (no.filhos?.length) abertoPorPai[pai] = no.id
  if (no.pagina) emit('abrir', no.pagina)
}

function abrirPagina(no: No) {
  emit('clique')
  if (no.pagina) emit('abrir', no.pagina)
}

provide('menuDaDoc', {
  menu: toRef(props, 'menu'),
  l: toRef(props, 'l'),
  t: toRef(props, 't'),
  paginaAtiva: toRef(props, 'paginaAtiva'),
  estaAberto,
  alternar,
  abrirPasta,
  abrirPagina,
})
</script>

<template>
  <nav ref="barra" :aria-label="t.casca.menuDaDoc" class="flex flex-col gap-6">
    <!-- Busca: casca. O site diz "Search…" nos 3 idiomas. -->
    <UButton
      color="neutral"
      variant="outline"
      class="w-full cursor-pointer justify-start gap-2 rounded-md px-2.5 py-1.5 text-sm"
    >
      <UIcon name="i-lucide-search" class="size-4 shrink-0 text-dimmed" />
      <span class="truncate text-muted">{{ t.casca.busca }}</span>
      <span class="ml-auto flex shrink-0 gap-0.5">
        <UKbd value="ctrl" size="sm" />
        <UKbd value="K" size="sm" />
      </span>
    </UButton>

    <!-- Carregando -->
    <div v-if="carregando" class="flex flex-col gap-2" role="status" :aria-label="t.estados.carregando">
      <div
        v-for="n in 10"
        :key="n"
        class="h-7 rounded bg-elevated"
        :style="{ animation: 'pulso-suave 1.4s ease-in-out infinite', animationDelay: `${n * 70}ms`, width: `${50 + ((n * 17) % 45)}%` }"
      />
    </div>

    <!-- Erro -->
    <div v-else-if="erro" class="flex flex-col items-start gap-2 rounded-lg border border-error/30 bg-error/5 p-3">
      <p class="flex items-center gap-1.5 text-sm font-semibold text-highlighted">
        <UIcon name="i-lucide-triangle-alert" class="size-4 text-error" />
        {{ t.estados.erroTitulo }}
      </p>
      <p class="text-sm text-muted">{{ t.estados.erroTexto }}</p>
      <UButton
        :label="t.estados.erroAcao"
        size="xs"
        color="neutral"
        variant="outline"
        icon="i-lucide-rotate-ccw"
        class="cursor-pointer"
        @click="emit('recarregar')"
      />
    </div>

    <!-- A árvore -->
    <ul
      v-else
      :key="menu"
      class="flex flex-col"
      :class="menu === 'b' ? 'gap-0.5' : 'isolate -mx-2.5 -mt-1.5'"
    >
      <NoDoMenu
        v-for="(no, i) in arvore"
        :key="no.id"
        :no="no"
        pai="raiz"
        :nivel="0"
        :atraso="Math.min(i, 12) * 30"
      />
    </ul>
  </nav>
</template>
