<script setup lang="ts">
/**
 * ✅ ESTA É A PROPOSTA. Todo o resto desta tela é casca copiada do docs.enspace.io.
 *
 * O seletor de produto da documentação, grudado na marca no alto da página,
 * no mesmo lugar onde o Nuxt põe a versão e o GitHub Docs põe o plano.
 * O produto escolhido é o contexto de tudo que vem abaixo: o menu lateral, a
 * página aberta e o escopo da busca.
 *
 * Três decisões que valem explicação (o porquê está no DECISOES.md):
 *
 * 1. O nome do produto aparece SEMPRE, inclusive quando é o ENSPACE. Sem isso
 *    o controle só existe para quem já sabe que ele existe. A exceção é a
 *    barra do celular, que não tem largura: lá fica só o ícone, e o nome por
 *    extenso aparece nesta mesma peça dentro do menu do hambúrguer.
 * 2. Cada item leva uma linha de descrição. Versão ("v4", "v3") se entende
 *    sozinha; "Beni App" não. É a divergência consciente em relação ao Nuxt e
 *    ao GitHub Docs, que não descrevem os itens.
 * 3. Os itens são `checkbox` de propósito: o leitor de tela anuncia qual está
 *    marcado, que é a pergunta que o controle responde.
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
  [{ type: 'label' as const, label: props.t.seletor.titulo }],
  props.produtos.map(p => ({
    type: 'checkbox' as const,
    slot: 'produto' as const,
    checked: p.id === produtoAtual.value,
    icon: p.icone,
    label: props.t.produtos[p.id].nome,
    description: props.t.produtos[p.id].descricao,
    selo: p.selo,
    onSelect: () => { produtoAtual.value = p.id },
  })),
])
</script>

<template>
  <UDropdownMenu
    v-model:open="aberto"
    :items="itens"
    :content="{ align: 'start', sideOffset: 10 }"
    :ui="{
      content: 'w-84 max-w-[calc(100vw-2rem)]',
      item: 'items-start py-2',
      itemLeadingIcon: 'size-4 mt-0.5',
      itemWrapper: 'min-w-0',
      itemLabel: 'font-semibold',
      /* A descrição quebra em duas linhas: cortar a explicação é não explicar. */
      itemDescription: 'text-xs leading-snug whitespace-normal',
      itemTrailing: 'mt-0.5',
    }"
  >
    <button
      type="button"
      :aria-label="t.seletor.aria(nomeAtual)"
      :title="nomeAtual"
      class="
        group flex h-7.25 cursor-pointer items-center gap-1.5 rounded-[0.313rem]
        border border-(--color-text-inverse-dark) bg-white/25 px-2
        text-(--color-brand-dark) transition-colors hover:bg-white/45
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
        dark:border-(--color-text-inverse) dark:bg-white/8 dark:text-(--color-brand-light)
        dark:hover:bg-white/15
      "
      :class="larguraCheia ? 'w-full' : 'max-w-[11.5rem]'"
    >
      <UIcon :name="atual.icone" class="size-3.5 shrink-0" />
      <!--
        Abaixo de `sm` a barra não tem largura para o nome: sobram uns 100px
        entre o logo e a chave de tema, e o nome sairia cortado em duas letras.
        Aí o botão fica só com o ícone, e o nome por extenso vai para a mesma
        peça dentro do menu do celular, onde existe linha inteira.
      -->
      <span
        class="truncate text-[0.8125rem] font-semibold uppercase leading-none tracking-wide"
        :class="larguraCheia ? '' : 'hidden sm:inline'"
      >
        {{ nomeAtual }}
      </span>
      <UIcon
        name="i-lucide-chevron-down"
        class="
          size-4 shrink-0 text-cyan-500 transition-transform duration-200
          group-data-[state=open]:rotate-180 dark:text-fuchsia-500
        "
        :class="larguraCheia ? 'ml-auto' : ''"
      />
    </button>

    <!--
      O selo vive colado ao nome, e não na coluna da direita, porque ali já
      mora a marca do item em uso. Dois sinais na mesma coluna competem.
    -->
    <template #produto-label="{ item }">
      <span class="flex items-center gap-1.5">
        {{ item.label }}
        <UBadge
          v-if="item.selo"
          :label="t.seletor.selo[item.selo]"
          color="primary"
          variant="subtle"
          size="sm"
          class="font-semibold uppercase"
        />
      </span>
    </template>
  </UDropdownMenu>
</template>
