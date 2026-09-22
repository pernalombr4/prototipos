<script setup lang="ts">
/**
 * O menu lateral da documentação e o botão de busca acima dele.
 *
 * ⚠️ A FORMA é casca: no site isto é o `UContentSearchButton` mais o
 * `UContentNavigation` do Nuxt UI, com seção expansível, item ativo em
 * primária e filhos indentados. Foi remontado à mão porque aqui não existe
 * `@nuxt/content` nem rota por página, e o menu precisa responder ao produto
 * escolhido sem sair da tela. Na implementação continua sendo o
 * `UContentNavigation`, alimentado pela árvore do produto em uso.
 *
 * ✅ O QUE É PROPOSTA aqui são duas coisas, e só elas:
 *   1. a árvore trocar junto com o produto, em cascata, para ficar evidente
 *      que o menu inteiro mudou de assunto;
 *   2. o botão de busca dizer em qual produto ele busca.
 */
import type { ItemDeNavegacao } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  itens: ItemDeNavegacao[]
  paginaAtiva: string
  nomeDoProduto: string
  /** Muda a chave da lista para a entrada em cascata rodar de novo. */
  produto: string
  carregando?: boolean
}>()

const emit = defineEmits<{ abrir: [chave: string] }>()

/** Seções abertas. A do item ativo começa aberta, como no site. */
const abertas = ref<string[]>([])

watch(
  () => props.produto,
  () => {
    abertas.value = props.itens.filter(i => i.aberto).map(i => i.chave)
  },
  { immediate: true },
)

function alternar(chave: string) {
  abertas.value = abertas.value.includes(chave)
    ? abertas.value.filter(c => c !== chave)
    : [...abertas.value, chave]
}

function titulo(chave: string) {
  return props.t.titulos[chave] ?? chave
}
</script>

<template>
  <nav :aria-label="nomeDoProduto" class="flex flex-col gap-4">
    <!-- Busca: o escopo é o produto em uso. -->
    <UButton
      color="neutral"
      variant="outline"
      class="w-full justify-start gap-2 rounded-md px-3 py-2 text-sm"
      :ui="{ label: 'truncate' }"
    >
      <UIcon name="i-lucide-search" class="size-4 shrink-0 text-dimmed" />
      <span class="truncate text-muted">{{ t.busca.em(nomeDoProduto) }}</span>
      <span class="ml-auto flex shrink-0 gap-0.5">
        <UKbd value="ctrl" size="sm" />
        <UKbd value="K" size="sm" />
      </span>
    </UButton>

    <!-- A árvore do produto -->
    <div v-if="carregando" class="flex flex-col gap-2 px-1" aria-hidden="true">
      <div
        v-for="n in 8"
        :key="n"
        class="h-7 rounded bg-elevated"
        :style="{ animation: 'pulso-suave 1.4s ease-in-out infinite', animationDelay: `${n * 80}ms`, width: `${55 + ((n * 13) % 40)}%` }"
      />
    </div>

    <ul v-else :key="produto" class="flex flex-col gap-0.5">
      <li
        v-for="(item, i) in itens"
        :key="item.chave"
        :style="{ animation: 'entrada 320ms ease-out both', animationDelay: `${i * 35}ms` }"
      >
        <!-- Seção com filhos -->
        <UCollapsible
          v-if="item.filhos?.length"
          :open="abertas.includes(item.chave)"
          @update:open="alternar(item.chave)"
        >
          <button
            type="button"
            class="
              group flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm
              font-medium text-toned transition-colors hover:bg-elevated hover:text-highlighted
            "
          >
            <UIcon v-if="item.icone" :name="item.icone" class="size-4 shrink-0 text-dimmed" />
            <span class="truncate">{{ titulo(item.chave) }}</span>
            <UIcon
              name="i-lucide-chevron-down"
              class="ml-auto size-4 shrink-0 text-dimmed transition-transform duration-200"
              :class="abertas.includes(item.chave) ? 'rotate-180' : ''"
            />
          </button>

          <template #content>
            <ul class="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-default pl-2">
              <li v-for="filho in item.filhos" :key="filho.chave">
                <button
                  type="button"
                  class="w-full cursor-pointer truncate rounded-md px-2.5 py-1.5 text-left text-sm transition-colors"
                  :class="paginaAtiva === filho.chave
                    ? 'bg-primary/10 font-medium text-primary'
                    : 'text-muted hover:bg-elevated hover:text-highlighted'"
                  :aria-current="paginaAtiva === filho.chave ? 'page' : undefined"
                  @click="emit('abrir', filho.chave)"
                >
                  {{ titulo(filho.chave) }}
                </button>
              </li>
            </ul>
          </template>
        </UCollapsible>

        <!-- Página solta -->
        <button
          v-else
          type="button"
          class="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors"
          :class="paginaAtiva === item.chave
            ? 'bg-primary/10 font-medium text-primary'
            : 'text-toned hover:bg-elevated hover:text-highlighted'"
          :aria-current="paginaAtiva === item.chave ? 'page' : undefined"
          @click="emit('abrir', item.chave)"
        >
          <UIcon
            v-if="item.icone"
            :name="item.icone"
            class="size-4 shrink-0"
            :class="paginaAtiva === item.chave ? 'text-primary' : 'text-dimmed'"
          />
          <span class="truncate">{{ titulo(item.chave) }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
