<script setup lang="ts">
/**
 * A casca do docs.enspace.io.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Barra do topo, logo, links de seção, chave de tema,
 * seletor de idioma, botão de entrar, coluna "Nesta página" e a grade da página
 * são a reprodução do site. A proposta entra pelos slots `#menu` e pelo que o
 * corpo da página mostra.
 *
 * Referência: https://docs.enspace.io/pt/docs, visitada em 29/09/2026, e o código
 * do `en-docs` (somente leitura): `app/layouts/docs.vue`,
 * `app/components/space/SpaceNavigation.vue`. A barra do topo foi copiada do
 * protótipo `seletor-de-produto-na-doc` (22/09/2026), sem o seletor de produto,
 * que é proposta daquele protótipo e não existe no site.
 *
 * A grade foi medida no site a 1440 px: grade de 10 colunas com a barra em 2
 * (261 px, `lg:col-span-2 lg:w-[calc(100%+20px)]`) e o centro em 8; dentro do
 * centro, grade de 12 com o texto em 9 e o "Nesta página" em 3. O protótipo
 * vizinho usava 3/6/3; aqui vale a medida, porque o corte dos nomes da barra
 * depende da largura dela.
 *
 * `barras` é andaime: com 2 ou 3 barras lado a lado, abre espaço para elas e tira o
 * sumário.
 */
import logoEnspace from './enspace.svg'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Quantas barras aparecem juntas (andaime do lado a lado). */
  barras?: 1 | 2 | 3
}>()

const larguraDaBarra = { 1: 'lg:col-span-2 lg:w-[calc(100%+20px)] lg:pr-5', 2: 'lg:col-span-4', 3: 'lg:col-span-6' } as const
const larguraDoCentro = { 1: 'lg:col-span-8', 2: 'lg:col-span-6', 3: 'lg:col-span-4' } as const

const tema = useColorMode()
const idioma = useIdioma()
const menuAberto = ref(false)

function trocarTema() {
  tema.preference = tema.value === 'dark' ? 'light' : 'dark'
}

const opcoesDeIdioma = computed(() => idiomas.map(i => ({ label: i.nome, value: i.id })))

const links: { chave: 'docs' | 'dev' | 'blog' | 'releases', icone: string }[] = [
  { chave: 'docs', icone: 'i-lucide-file-text' },
  { chave: 'dev', icone: 'i-lucide-square-code' },
  { chave: 'blog', icone: 'i-lucide-files' },
  { chave: 'releases', icone: 'i-lucide-file-clock' },
]
</script>

<template>
  <div class="relative min-h-screen bg-default">
    <div
      aria-hidden="true"
      class="
        pointer-events-none absolute inset-x-0 top-0 h-96
        bg-[radial-gradient(60rem_24rem_at_78%_-6rem,var(--color-fuchsia-100),transparent)]
        dark:bg-[radial-gradient(60rem_24rem_at_78%_-6rem,var(--color-space-800),transparent)]
      "
    />

    <!-- BARRA DO TOPO -->
    <div class="sticky top-0 z-50 h-(--ui-header-height)">
      <nav
        class="
          absolute inset-x-0 top-0 flex h-[calc(var(--ui-header-height)+23px)] items-center
          border-b border-white/25 bg-white/15 shadow-[0_1px_3px_var(--color-shadow-card)]
          backdrop-blur-[10px] transition-colors duration-500
          dark:border-white/10 dark:bg-white/5 dark:shadow-none
        "
      >
        <div class="mx-auto flex w-full max-w-360 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <a href="#" :aria-label="t.casca.irParaInicio" class="shrink-0">
            <img :src="logoEnspace" alt="ENSPACE" class="h-5.25 w-auto transition-[filter] duration-500 invert dark:invert-0">
          </a>

          <div class="hidden items-center gap-8 lg:ml-28 lg:flex">
            <a
              v-for="link in links"
              :key="link.chave"
              href="#"
              class="
                flex items-center gap-2 text-center text-[0.875rem] font-medium uppercase leading-[100%]
                text-(--color-text-inverse-dark) transition-opacity hover:opacity-80 dark:text-(--color-text-inverse)
              "
              :class="link.chave === 'docs' ? 'opacity-100' : 'opacity-80'"
            >
              <UIcon :name="link.icone" class="size-4.5" />
              {{ t.casca[link.chave] }}
            </a>
          </div>

          <div class="flex shrink-0 items-center gap-2 sm:gap-4">
            <UButton
              :aria-label="t.casca.alternarTema"
              class="cursor-pointer bg-transparent p-2 hover:bg-white/25 active:bg-transparent dark:hover:bg-white/8"
              @click="trocarTema"
            >
              <UIcon name="i-lucide-sun" class="block size-6 text-(--color-text-inverse-dark) opacity-70 dark:hidden" />
              <UIcon name="i-lucide-moon" class="hidden size-6 opacity-70 dark:block dark:text-(--color-brand-pure-light)" />
            </UButton>

            <USelect
              v-model="idioma"
              :items="opcoesDeIdioma"
              :aria-label="t.casca.idioma"
              :ui="{
                trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200 text-cyan-500 dark:text-fuchsia-500 size-4',
                content: 'dark:bg-white/5 bg-white/15 backdrop-blur-md rounded-[0.313rem] ring-0 border border-white/25 dark:border-white/10',
                item: 'dark:data-highlighted:before:bg-white/8! data-highlighted:before:bg-white/25! rounded-[0.313rem] mb-1 cursor-pointer',
              }"
              class="
                hidden h-7.25 cursor-pointer rounded-[0.313rem] border border-(--color-text-inverse-dark)
                bg-transparent text-(--color-brand-dark) ring-0 hover:bg-white/25 focus:border-(--color-text-inverse-dark)
                focus:ring-0 sm:flex dark:border-(--color-text-inverse) dark:text-(--color-brand-light)
                dark:hover:bg-white/8 dark:focus:border-(--color-text-inverse)
              "
            />

            <UButton
              class="
                hidden h-7.25 w-auto cursor-pointer items-center justify-center rounded-[0.313rem] bg-(--color-text-dark)
                px-5 text-[13px] font-semibold uppercase leading-none text-(--color-text-inverse) transition-colors
                hover:bg-(--color-text-dark)/80 sm:flex dark:bg-(--color-bg-inverse)
                dark:text-(--color-text-inverse-dark) dark:hover:bg-(--color-bg-inverse)/90
              "
            >
              {{ t.casca.entrar }}
            </UButton>

            <UButton
              class="relative size-9 cursor-pointer bg-transparent p-2 hover:bg-white/25 lg:hidden dark:hover:bg-white/8"
              :aria-expanded="menuAberto"
              :aria-label="t.casca.abrirMenu"
              @click="menuAberto = !menuAberto"
            >
              <span
                class="absolute left-2 right-2 h-0.5 bg-(--color-text-dark) transition-all duration-200 dark:bg-(--color-text-light)"
                :class="menuAberto ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-2.5'"
              />
              <span
                class="absolute left-2 right-2 top-1/2 h-0.5 -translate-y-1/2 bg-(--color-text-dark) transition-all duration-200 dark:bg-(--color-text-light)"
                :class="menuAberto ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100'"
              />
              <span
                class="absolute left-2 right-2 h-0.5 bg-(--color-text-dark) transition-all duration-200 dark:bg-(--color-text-light)"
                :class="menuAberto ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-2.5'"
              />
            </UButton>
          </div>
        </div>

        <!--
          Menu do celular. No site ele só tem os links de seção; aqui ele também
          leva o menu da documentação, senão o protótipo não navega no celular.
          Divergência declarada no DECISOES.md.
        -->
        <div
          v-if="menuAberto"
          class="absolute left-0 right-0 top-full max-h-[75dvh] overflow-y-auto bg-cyan-50/95 p-4 lg:hidden dark:bg-space-950/95"
        >
          <div class="flex flex-col gap-4">
            <a
              v-for="link in links"
              :key="link.chave"
              href="#"
              class="flex items-center gap-2 rounded px-4 py-2 text-(--color-text-inverse-dark) hover:bg-(--color-text-dark)/5 dark:text-(--color-text-inverse) dark:hover:bg-white/10"
            >
              <UIcon :name="link.icone" class="size-4.5" />
              {{ t.casca[link.chave] }}
            </a>
            <div class="border-t border-(--color-text-dark)/10 pt-4 dark:border-white/10">
              <slot name="menu-celular" :fechar="() => (menuAberto = false)" />
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- A GRADE DA PÁGINA -->
    <UMain class="relative">
      <div class="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col pb-40 lg:grid lg:grid-cols-10 lg:gap-10">
          <aside
            class="hidden pt-14 lg:block"
            :class="larguraDaBarra[props.barras ?? 1]"
          >
            <div class="lg:sticky lg:top-(--ui-header-height) lg:-ms-4 lg:max-h-[calc(100dvh-var(--ui-header-height))] lg:overflow-y-auto lg:overflow-x-hidden lg:pb-24 lg:ps-4 lg:pe-1">
              <slot name="menu" />
            </div>
          </aside>

          <div :class="larguraDoCentro[props.barras ?? 1]">
            <div class="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8">
              <div :class="(props.barras ?? 1) > 1 ? 'lg:col-span-12' : 'lg:col-span-9'">
                <slot />
              </div>
              <div v-if="(props.barras ?? 1) === 1" class="hidden lg:col-span-3 lg:block">
                <div class="lg:sticky lg:top-[calc(var(--ui-header-height)+23px)] lg:pt-14">
                  <slot name="sumario" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UMain>

    <slot name="andaime" />
  </div>
</template>
