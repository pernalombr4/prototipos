<script setup lang="ts">
/**
 * A casca do docs.enspace.io: a barra do topo das abas Blog e Releases.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Logo, pílula de produto, links de seção na ordem do site (Docs, Blog,
 * Releases, Dev), chave de tema, seletor de idioma e botão Entrar são a reprodução do que o site
 * já tem. Se algo aqui estiver diferente do site, é defeito de cópia, não sugestão de mudança.
 *
 * Referência: `https://docs.enspace.io/pt/releases/docs` e `https://docs.enspace.io/pt/blog/docs`
 * (prints da pesquisa de mercado de 2026-11-24) e o código do `en-docs` (somente leitura),
 * `app/components/space/SpaceNavigation.vue`, lido em 2026-11-24. Item por item no BRIEFING.md.
 *
 * Partiu do `_CascaDaDoc.vue` do `seletor-de-produto-na-doc`, com 2 diferenças que vêm do site de
 * hoje: a ordem dos links (Dev passou para o fim) e a pílula de produto, que já está no ar.
 * Blog e Releases não têm menu lateral nem "Nesta página": a página ocupa a largura toda.
 */
import logoEnspace from './enspace.svg'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Rodada 7: Docs acende quando o guia de migração está aberto. */
  secaoAtiva: 'blog' | 'releases' | 'docs'
}>()

const emit = defineEmits<{ secao: [s: 'blog' | 'releases'] }>()

const tema = useColorMode()
const idioma = useIdioma()
const toast = useToast()
const menuAberto = ref(false)

function trocarTema() {
  tema.preference = tema.value === 'dark' ? 'light' : 'dark'
}

const opcoesDeIdioma = computed(() => idiomas.map(i => ({ label: i.nome, value: i.id })))

/** A pílula de produto do site (SpaceNavigation.vue). Aqui ela só mostra o ENSPACE escolhido. */
const produto = ref('docs')
const produtos = [
  { label: 'ENSPACE', value: 'docs', icon: 'i-lucide-layout-grid' },
  { label: 'WORD PLUGIN', value: 'word', icon: 'i-lucide-file-type' },
  { label: 'BENI APP', value: 'beni', icon: 'i-lucide-bot' },
  { label: 'SDK', value: 'sdk', icon: 'i-lucide-code', disabled: true },
]
const iconeDoProduto = computed(() => produtos.find(p => p.value === produto.value)?.icon)

/** Os 4 links de seção, na ordem do site. Docs e Dev ficam fora do protótipo. */
const links: { chave: 'docs' | 'blog' | 'releases' | 'dev', icone: string }[] = [
  { chave: 'docs', icone: 'i-lucide-file-text' },
  { chave: 'blog', icone: 'i-lucide-files' },
  { chave: 'releases', icone: 'i-lucide-file-clock' },
  { chave: 'dev', icone: 'i-lucide-square-code' },
]

function abrir(chave: typeof links[number]['chave']) {
  menuAberto.value = false
  if (chave === 'blog' || chave === 'releases') emit('secao', chave)
  else toast.add({ title: props.t.casca.foraDoPrototipo, icon: 'i-lucide-info', color: 'neutral', duration: 2500 })
}
</script>

<template>
  <div class="relative min-h-screen bg-default">
    <!-- O brilho do site no topo: rosa no claro, roxo no escuro. -->
    <div
      aria-hidden="true"
      class="
        pointer-events-none absolute inset-x-0 top-0 h-[34rem]
        bg-[radial-gradient(60rem_26rem_at_20%_-4rem,var(--color-fuchsia-100),transparent)]
        dark:bg-[radial-gradient(60rem_26rem_at_20%_-4rem,var(--color-space-800),transparent)]
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
          <div class="flex min-w-0 items-center gap-5">
            <a href="#" :aria-label="t.casca.irParaInicio" class="shrink-0">
              <img :src="logoEnspace" alt="ENSPACE" class="h-5.25 w-auto transition-[filter] duration-500 invert dark:invert-0">
            </a>
            <USelect
              v-model="produto"
              :items="produtos"
              value-key="value"
              :icon="iconeDoProduto"
              size="sm"
              arrow
              color="primary"
              variant="subtle"
              :aria-label="t.casca.produto"
              class="hidden w-max rounded-3xl bg-primary/10 font-semibold text-primary-400 ring-1 ring-primary/10 hover:bg-primary/20 sm:flex"
              :ui="{
                trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200 text-primary-400 size-4',
                leadingIcon: 'text-primary-400',
                itemLeadingIcon: 'text-primary-400',
                item: 'data-[state=checked]:text-primary-400 text-muted font-semibold',
                content: 'min-w-40',
              }"
            />
          </div>

          <div class="hidden items-center gap-8 lg:flex">
            <a
              v-for="link in links"
              :key="link.chave"
              href="#"
              class="
                flex items-center gap-2 text-center text-[0.875rem] font-medium uppercase leading-[100%]
                text-(--color-text-inverse-dark) transition-opacity hover:opacity-80 dark:text-(--color-text-inverse)
              "
              :aria-current="secaoAtiva === link.chave ? 'page' : undefined"
              @click.prevent="abrir(link.chave)"
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
              :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200 text-cyan-500 dark:text-fuchsia-500 size-4' }"
              class="
                hidden h-7.25 cursor-pointer rounded-[0.313rem] border border-(--color-text-inverse-dark)
                bg-transparent text-(--color-brand-dark) ring-0 hover:bg-white/25 sm:flex
                dark:border-(--color-text-inverse) dark:text-(--color-brand-light) dark:hover:bg-white/8
              "
            />

            <UButton
              class="
                hidden h-7.25 cursor-pointer items-center rounded-[0.313rem] bg-(--color-text-dark) px-5 text-[13px]
                font-semibold uppercase leading-none text-(--color-text-inverse) hover:bg-(--color-text-dark)/80
                sm:flex dark:bg-(--color-bg-inverse) dark:text-(--color-text-inverse-dark) dark:hover:bg-(--color-bg-inverse)/90
              "
            >
              {{ t.casca.entrar }}
            </UButton>

            <UButton
              icon="i-lucide-menu"
              color="neutral"
              variant="ghost"
              class="lg:hidden"
              :aria-expanded="menuAberto"
              :aria-label="t.casca.abrirMenu"
              @click="menuAberto = !menuAberto"
            />
          </div>
        </div>

        <!-- Menu do celular -->
        <div v-if="menuAberto" class="absolute inset-x-0 top-full animate-[entrada_.2s_ease-out_both] bg-cyan-50/95 p-4 lg:hidden dark:bg-space-950/95">
          <a
            v-for="link in links"
            :key="link.chave"
            href="#"
            class="flex items-center gap-2 rounded px-4 py-2 text-(--color-text-inverse-dark) hover:bg-(--color-text-dark)/5 dark:text-(--color-text-inverse) dark:hover:bg-white/10"
            @click.prevent="abrir(link.chave)"
          >
            <UIcon :name="link.icone" class="size-4.5" />
            {{ t.casca[link.chave] }}
          </a>
        </div>
      </nav>
    </div>

    <UMain class="relative">
      <slot />
    </UMain>

    <slot name="andaime" />
  </div>
</template>
