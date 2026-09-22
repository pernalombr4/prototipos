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
 *   4. peso médio, 12px;
 *   5. seta de 12px, da cor do texto;
 *   6. sem ícone na pílula: ela fica com o nome e a seta (rodada 3).
 *
 * Duas coisas da rodada 5 divergem das referências, e é escolha dela:
 *
 *   • **CAIXA ALTA** no rótulo da pílula e nos itens do menu. O Nuxt UI e o
 *     Tailwind usam caixa normal, mas esta barra não é a deles: `DOCS`,
 *     `DEV`, `BLOG`, `RELEASES` e `ENTRAR` já estão todos em caixa alta ali.
 *     Em caixa normal a pílula era a única coisa fora do compasso da barra.
 *     Vem com `tracking-wide`, que é o que torna caixa alta legível a 12px.
 *   • **ícone de volta no menu**, e só nele. No menu o ícone separa um
 *     produto do outro; na pílula ele não separava nada, porque só existe um.
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
import type { Produto, ChaveDeProduto, DestinoExterno } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  produtos: Produto[]
  /** Documentação que mora fora deste site. Vai no fim, depois do separador. */
  externos?: DestinoExterno[]
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

/**
 * Dois grupos, e o separador entre eles é o recado.
 *
 * Em cima, os produtos que **trocam** o conteúdo desta página. Embaixo, a
 * documentação que **leva embora**, num grupo próprio, com ícone de link
 * externo à direita. Misturar os dois faria a pessoa clicar em "SDK"
 * esperando a página mudar e perder a que estava lendo.
 */
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
  (props.externos ?? []).map(e => ({
    slot: 'externo' as const,
    icon: e.icone,
    label: props.t.externos[e.id].nome,
    emBreve: e.emBreve,
    /* Bloqueado enquanto não sai do forno: o item não navega e não fecha o menu. */
    disabled: e.emBreve,
    to: e.emBreve ? undefined : e.url,
    target: e.emBreve ? undefined : ('_blank' as const),
  })),
].filter(grupo => grupo.length > 0))
</script>

<template>
  <UDropdownMenu
    v-model:open="aberto"
    :items="itens"
    :content="{ align: 'start', sideOffset: 8 }"
    :external-icon="false"
    :ui="{
      content: 'w-auto min-w-52 max-w-[calc(100vw-2rem)] p-1',
      item: 'py-1.5 gap-2 text-sm',
      /* Caixa alta com um respiro entre as letras, que é o que a torna legível. */
      itemLabel: 'uppercase tracking-wide',
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
      :class="larguraCheia ? 'h-8 w-full rounded-lg px-3 text-sm' : 'min-w-0 max-w-44'"
    >
      <!--
        Sem ícone: o Nuxt UI e o Tailwind também não têm, e a pílula fica com
        uma coisa só para ler. Abaixo de `sm` sobram uns 100px entre o logo e
        a chave de tema, então o nome corta. O nome por extenso continua no
        `title`, no `aria-label` e nesta mesma peça dentro do menu do celular.
      -->
      <span class="truncate uppercase tracking-wide">
        {{ nomeAtual }}
      </span>
      <UIcon
        name="i-lucide-chevron-down"
        class="size-3 shrink-0 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180"
        :class="larguraCheia ? 'ml-auto size-4' : ''"
      />
    </button>

    <!--
      O produto em uso é marcado pela cor, como no Nuxt UI.
      O tique à direita repete o sinal para quem não distingue a cor.
    -->
    <template #produto-leading="{ item }">
      <UIcon
        :name="item.icon"
        class="size-4 shrink-0"
        :class="item.atual ? 'text-primary-700 dark:text-primary-300' : 'text-dimmed'"
      />
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

    <!--
      A documentação que sai daqui.

      À direita vai a seta de link externo, que é o aviso de que o clique
      leva embora. Enquanto o site não existe, o lugar da seta é do relógio:
      um só sinal por item, e o que ele diz é o que importa agora.
      O texto ao lado some da tela e fica para o leitor de tela, que não
      enxerga nem relógio nem seta.
    -->
    <template #externo-trailing="{ item }">
      <UIcon
        :name="item.emBreve ? 'i-lucide-clock' : 'i-lucide-arrow-up-right'"
        class="size-4 shrink-0 text-dimmed"
      />
      <span class="sr-only">
        {{ item.emBreve ? t.seletor.emBreve : t.seletor.abreFora }}
      </span>
    </template>
  </UDropdownMenu>
</template>
