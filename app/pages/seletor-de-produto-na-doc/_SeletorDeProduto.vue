<script setup lang="ts">
/**
 * ✅ ESTA É A PROPOSTA. Todo o resto desta tela é casca copiada do docs.enspace.io.
 *
 * O seletor de produto da documentação, colado à marca, no mesmo lugar onde o
 * Nuxt, o Nuxt UI, o Tailwind e a nossa própria doc do SDK põem o seu.
 *
 * ─── A gramática visual, que é o que mudou na rodada 2 ────────────────────
 *
 * A rodada 1 desenhou isto como um controle de formulário: 29px de altura,
 * borda preta de 1px, rótulo em CAIXA ALTA e negrito, e a seta numa terceira
 * cor. Ficava mais pesado que o logo ao lado. Varrendo dez documentações de
 * software (`PESQUISA.md`), as limpas concordam em cinco coisas:
 *
 *   1. é PÍLULA, não caixa: cantos redondos de verdade, 22 a 24px de altura;
 *   2. uma família de cor só. Fundo em 10% da cor, texto e seta na mesma cor;
 *   3. sem borda dura. Anel de 1px na própria cor, ou nada;
 *   4. caixa normal, peso médio, 12px. Nunca caixa alta;
 *   5. seta de 12px, da cor do texto.
 *
 * O texto usa `text-primary-700 dark:text-primary-300` e não `text-primary`:
 * é a correção de contraste da casa (`app/tema-contraste.ts`), porque o
 * fúcsia 500 do ENSPACE sobre 10% dele mesmo dá 2,96:1 e reprova.
 *
 * O menu segue a mesma dieta: largura do conteúdo, uma linha por produto,
 * ícone monocromático, e o produto em uso na cor da marca com o tique à
 * direita. Sem descrição: nenhuma das dez referências descreve os itens, e a
 * descrição era o que fazia o painel parecer formulário.
 */
import type { Produto, ChaveDeProduto } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  produtos: Produto[]
  /**
   * Trigger de largura cheia, com o nome sempre visível. É a versão que vai
   * dentro do menu do celular, onde existe linha inteira para o nome.
   */
  larguraCheia?: boolean
}>()

const produtoAtual = defineModel<ChaveDeProduto>({ required: true })

const aberto = ref(false)

const atual = computed(() =>
  props.produtos.find(p => p.id === produtoAtual.value) ?? props.produtos[0]!)

const nomeAtual = computed(() => props.t.produtos[atual.value.id].nome)

const itens = computed(() => [
  props.produtos.map(p => ({
    type: 'checkbox' as const,
    slot: 'produto' as const,
    checked: p.id === produtoAtual.value,
    icon: p.icone,
    label: props.t.produtos[p.id].nome,
    selo: p.selo,
    atual: p.id === produtoAtual.value,
    onSelect: () => { produtoAtual.value = p.id },
  })),
])
</script>

<template>
  <UDropdownMenu
    v-model:open="aberto"
    :items="itens"
    :content="{ align: 'start', sideOffset: 8 }"
    :ui="{
      content: 'w-auto min-w-52 max-w-[calc(100vw-2rem)] p-1',
      item: 'py-1.5 gap-2 text-sm',
      itemLeadingIcon: 'size-4 text-dimmed',
      itemTrailingIcon: 'size-4 text-primary-700 dark:text-primary-300',
    }"
  >
    <button
      type="button"
      :aria-label="t.seletor.aria(nomeAtual)"
      :title="nomeAtual"
      class="
        group flex h-6 cursor-pointer items-center gap-1.5 rounded-full bg-primary/10 px-2
        text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary/20
        transition-colors hover:bg-primary/20
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
        dark:bg-primary/15 dark:text-primary-300 dark:ring-primary/25 dark:hover:bg-primary/25
      "
      :class="larguraCheia ? 'h-8 w-full rounded-lg px-3 text-sm' : ''"
    >
      <UIcon :name="atual.icone" class="size-3.5 shrink-0" :class="larguraCheia ? 'size-4' : ''" />
      <!--
        Abaixo de `sm` a barra não tem largura para o nome: sobram uns 100px
        entre o logo e a chave de tema. Aí a pílula fica só com o ícone, e o
        nome por extenso aparece nesta mesma peça dentro do menu do celular.
      -->
      <span
        class="truncate"
        :class="larguraCheia ? '' : 'hidden sm:inline'"
      >
        {{ nomeAtual }}
      </span>
      <UIcon
        name="i-lucide-chevron-down"
        class="size-3 shrink-0 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180"
        :class="larguraCheia ? 'ml-auto size-4' : ''"
      />
    </button>

    <!--
      O produto em uso é marcado pela cor, como no Nuxt UI e na doc do SDK.
      O tique à direita repete o sinal para quem não distingue a cor.
    -->
    <template #produto-leading="{ item }">
      <UIcon :name="item.icon" class="size-4 shrink-0" :class="item.atual ? 'text-primary-700 dark:text-primary-300' : 'text-dimmed'" />
    </template>

    <template #produto-label="{ item }">
      <span class="flex items-center gap-1.5" :class="item.atual ? 'font-medium text-primary-700 dark:text-primary-300' : ''">
        {{ item.label }}
        <!--
          O selo é anotação, não etiqueta: texto pequeno e apagado, como o
          "(EOL)" do Nuxt. Um selo com fundo e anel ao lado de um nome de
          três palavras vira o item mais pesado do menu.
        -->
        <span
          v-if="item.selo"
          class="text-[0.625rem] font-medium uppercase tracking-wider text-dimmed"
        >
          {{ t.seletor.selo[item.selo] }}
        </span>
      </span>
    </template>
  </UDropdownMenu>
</template>
