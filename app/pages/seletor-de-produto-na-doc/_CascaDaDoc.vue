<script setup lang="ts">
/**
 * A casca do docs.enspace.io, copiada da documentação no ar.
 *
 * ⚠️ NADA AQUI É PROPOSTA, com uma exceção declarada: o slot `#produto`, onde
 * entra o seletor. Barra do topo, logo, links de seção, chave de tema, seletor
 * de idioma, botão de entrar, menu lateral, coluna "Nesta página" e a grade da
 * página são a reprodução do que o site já tem. Se algo aqui estiver diferente
 * do site, é defeito de cópia, não sugestão de mudança.
 *
 * Referência: `https://docs.enspace.io/en/docs`, visitada em 22/09/2026, e o
 * código do `en-docs` (somente leitura): `app/components/space/SpaceNavigation.vue`,
 * `app/layouts/docs.vue`, `app/pages/docs/[...slug].vue` e `i18n/lang/*.yaml`.
 * O que foi copiado, item por item, está no BRIEFING.md.
 *
 * A única medida que muda por causa da proposta é o afastamento do grupo de
 * links de seção: hoje ele tem `ml-28` para compensar a largura do logo, e com
 * o seletor ao lado do logo esse empurrão sobra. Está escrito no DECISOES.md.
 */
import logoEnspace from './enspace.svg'
import type { Textos } from './textos'

defineProps<{
  t: Textos
  /** Com o seletor fora, a casca volta a ser exatamente a de hoje. */
  comSeletor: boolean
  /** Qual link de seção está ativo. Sempre "docs" nesta tela. */
  secaoAtiva?: 'docs' | 'dev' | 'blog' | 'releases'
}>()

const tema = useColorMode()
const idioma = useIdioma()
const menuAberto = ref(false)

function trocarTema() {
  tema.preference = tema.value === 'dark' ? 'light' : 'dark'
}

/** O seletor de idioma do próprio site, ligado ao idioma do protótipo. */
const opcoesDeIdioma = computed(() =>
  idiomas.map(i => ({ label: i.nome, value: i.id })))

/** Os quatro links de seção, na ordem em que o site mostra. */
const links: { chave: 'docs' | 'dev' | 'blog' | 'releases', icone: string }[] = [
  { chave: 'docs', icone: 'i-lucide-file-text' },
  { chave: 'dev', icone: 'i-lucide-square-code' },
  { chave: 'blog', icone: 'i-lucide-files' },
  { chave: 'releases', icone: 'i-lucide-file-clock' },
]
</script>

<template>
  <div class="relative min-h-screen bg-default">
    <!-- O fundo do site: claro quase branco, escuro quase preto, com o brilho da marca no topo. -->
    <div
      aria-hidden="true"
      class="
        pointer-events-none absolute inset-x-0 top-0 h-96
        bg-[radial-gradient(60rem_24rem_at_78%_-6rem,var(--color-fuchsia-100),transparent)]
        dark:bg-[radial-gradient(60rem_24rem_at_78%_-6rem,var(--color-space-800),transparent)]
      "
    />

    <!-- ---------------------------------------------------------------- -->
    <!-- BARRA DO TOPO                                                     -->
    <!-- ---------------------------------------------------------------- -->
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
          <!-- Logo + o seletor de produto (a proposta) -->
          <div class="flex min-w-0 items-center gap-2 sm:gap-3">
            <a href="#" :aria-label="t.casca.irParaInicio" class="shrink-0">
              <img
                :src="logoEnspace"
                alt="ENSPACE"
                class="h-5.25 w-auto transition-[filter] duration-500 invert dark:invert-0"
              >
            </a>

            <slot v-if="comSeletor" name="produto" />
          </div>

          <!-- Links de seção -->
          <div
            class="hidden items-center gap-8 lg:flex"
            :class="comSeletor ? 'lg:ml-4' : 'lg:ml-28'"
          >
            <a
              v-for="link in links"
              :key="link.chave"
              href="#"
              class="
                flex items-center gap-2 text-center text-[0.875rem] font-medium uppercase leading-[100%]
                tracking-[0] text-(--color-text-inverse-dark) transition-opacity hover:opacity-80
                dark:text-(--color-text-inverse)
              "
              :class="secaoAtiva === link.chave ? 'opacity-100' : 'opacity-80'"
            >
              <UIcon :name="link.icone" class="size-4.5" />
              {{ t.casca[link.chave] }}
            </a>
          </div>

          <!-- Ações -->
          <div class="flex shrink-0 items-center gap-2 sm:gap-4">
            <!--
              O rótulo é fixo de propósito. Um rótulo que muda com o tema
              ("Tema escuro" / "Tema claro") não existe no servidor, onde o
              tema ainda não é conhecido, e a página remonta com aviso de
              hidratação. Divergência da casca declarada no DECISOES.md.
            -->
            <UButton
              :aria-label="t.casca.alternarTema"
              class="cursor-pointer bg-transparent p-2 hover:bg-white/25 active:bg-transparent dark:hover:bg-white/8"
              @click="trocarTema"
            >
              <UIcon
                name="i-lucide-sun"
                class="block size-6 text-(--color-text-inverse-dark) opacity-70 dark:hidden dark:text-(--color-brand-pure-light)"
              />
              <UIcon
                name="i-lucide-moon"
                class="hidden size-6 text-(--color-text-inverse-dark) opacity-70 dark:block dark:text-(--color-brand-pure-light)"
              />
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
                hover:bg-(--color-text-dark)/80 active:bg-(--color-text-dark) sm:flex dark:bg-(--color-bg-inverse)
                dark:text-(--color-text-inverse-dark) dark:hover:bg-(--color-bg-inverse)/90
              "
            >
              {{ t.casca.entrar }}
            </UButton>

            <UButton
              class="relative size-9 cursor-pointer bg-transparent p-2 hover:bg-white/25 active:bg-transparent lg:hidden dark:hover:bg-white/8"
              :aria-expanded="menuAberto"
              :aria-label="t.casca.abrirMenu"
              @click="menuAberto = !menuAberto"
            >
              <span
                class="absolute left-2 right-2 h-0.5 bg-(--color-text-dark) transition-all duration-200 dark:bg-(--color-text-light)"
                :class="menuAberto ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-2.5'"
              />
              <span
                class="absolute left-2 right-2 h-0.5 bg-(--color-text-dark) transition-all duration-200 dark:bg-(--color-text-light)"
                :class="menuAberto ? 'top-1/2 -translate-y-1/2 scale-x-0 opacity-0' : 'top-1/2 -translate-y-1/2 scale-x-100 opacity-100'"
              />
              <span
                class="absolute left-2 right-2 h-0.5 bg-(--color-text-dark) transition-all duration-200 dark:bg-(--color-text-light)"
                :class="menuAberto ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-2.5'"
              />
            </UButton>
          </div>
        </div>

        <!-- Menu do celular -->
        <div
          v-if="menuAberto"
          class="absolute left-0 right-0 top-full bg-cyan-50/95 p-4 lg:hidden dark:bg-space-950/95"
        >
          <div class="flex flex-col gap-4">
            <!--
              No celular o botão da barra fica só com o ícone, por falta de
              largura. O nome por extenso aparece aqui, em linha cheia.
            -->
            <div v-if="comSeletor" class="border-b border-(--color-text-dark)/10 pb-4 sm:hidden dark:border-white/10">
              <slot name="produto-celular" />
            </div>

            <a
              v-for="link in links"
              :key="link.chave"
              href="#"
              class="
                flex items-center gap-2 rounded px-4 py-2 text-(--color-text-inverse-dark) transition-colors
                hover:bg-(--color-text-dark)/5 dark:text-(--color-text-inverse) dark:hover:bg-white/10
              "
              @click="menuAberto = false"
            >
              <UIcon :name="link.icone" class="size-4.5" />
              {{ t.casca[link.chave] }}
            </a>

            <div class="flex items-center gap-4 border-t border-(--color-text-dark)/10 pt-4 dark:border-white/10">
              <USelect
                v-model="idioma"
                :items="opcoesDeIdioma"
                :aria-label="t.casca.idioma"
                class="h-7.25 rounded-[0.313rem] border border-(--color-text-inverse-dark) bg-transparent dark:border-(--color-text-inverse)"
              />
              <UButton
                class="
                  flex h-7.25 items-center justify-center rounded-[0.313rem] bg-(--color-text-dark) px-4
                  text-[13px] font-semibold uppercase leading-none text-(--color-text-inverse)
                  dark:bg-(--color-bg-inverse) dark:text-(--color-text-inverse-dark)
                "
              >
                {{ t.casca.entrar }}
              </UButton>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- ---------------------------------------------------------------- -->
    <!-- A GRADE DA PÁGINA: menu à esquerda, conteúdo, sumário à direita   -->
    <!-- ---------------------------------------------------------------- -->
    <UMain class="relative">
      <UContainer class="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col pb-40 lg:grid lg:grid-cols-12 lg:gap-8">
          <aside class="pt-6 lg:col-span-3 lg:pt-14">
            <div class="lg:sticky lg:top-[calc(var(--ui-header-height)+2.5rem)]">
              <slot name="menu" />
            </div>
          </aside>

          <div class="lg:col-span-6">
            <slot />
          </div>

          <div class="order-first lg:order-last lg:col-span-3">
            <div class="lg:sticky lg:top-[calc(var(--ui-header-height)+2.5rem)] lg:pt-14">
              <slot name="sumario" />
            </div>
          </div>
        </div>
      </UContainer>
    </UMain>

    <!-- A barra de andaime do protótipo entra por aqui. Não é casca nem proposta. -->
    <slot name="andaime" />
  </div>
</template>
