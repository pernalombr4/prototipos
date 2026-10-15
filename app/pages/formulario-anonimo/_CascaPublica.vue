<script setup lang="ts">
/**
 * A casca das páginas públicas, copiada da tela "Acesso Externo" do develop
 * (`/external?form=…`, ev-07, 15/10/2026): fundo com traços e manchas de cor,
 * logotipo do ENSPACE, tema e idioma no canto e o rodapé.
 *
 * ⚠️ NADA AQUI É PROPOSTA: o que muda é o cartão do meio (slot).
 * Tema e idioma aqui são os da própria página pública, como no develop; eles
 * mexem no mesmo estado do andaime.
 */
import type { Textos } from './textos'
import logoEnspace from './enspace.svg'

defineProps<{ t: Textos }>()

const tema = useColorMode()
const idioma = useIdioma()
const escuro = computed(() => tema.value === 'dark')

const idiomasDaPagina = computed(() => [[
  { label: 'Português', icon: 'i-lucide-languages', onSelect: () => (idioma.value = 'pt-BR') },
  { label: 'English', icon: 'i-lucide-languages', onSelect: () => (idioma.value = 'en') },
  { label: 'Español', icon: 'i-lucide-languages', onSelect: () => (idioma.value = 'es') },
]])
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-default pb-28">
    <!-- Fundo: traços e manchas (cópia) -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <svg class="absolute -left-10 -top-24 h-[26rem] w-[30rem] text-accented" viewBox="0 0 480 420" fill="none">
        <path d="M30 0 L190 330 Q220 380 280 380 Q360 380 360 300 L360 0" stroke="currentColor" stroke-width="1" />
        <path d="M230 0 L230 170 Q230 230 290 230 Q330 230 330 170 L330 0" stroke="currentColor" stroke-width="1" />
      </svg>
      <svg class="absolute -bottom-10 -right-10 h-80 w-[26rem] text-accented" viewBox="0 0 420 320" fill="none">
        <path d="M0 320 L80 110 Q110 40 190 40 L420 40" stroke="currentColor" stroke-width="1" />
        <path d="M230 320 Q230 220 300 220 Q360 220 380 270" stroke="currentColor" stroke-width="1" />
      </svg>
      <span class="absolute -right-24 -top-24 size-96 rounded-full bg-primary/20 blur-3xl" />
      <span class="absolute -bottom-32 -left-24 size-96 rounded-full bg-secondary/15 blur-3xl" />
    </div>

    <!-- Tema e idioma (cópia) -->
    <div class="relative flex justify-end gap-2 px-6 pt-5">
      <UButton
        :icon="escuro ? 'i-lucide-sun' : 'i-lucide-moon'"
        color="neutral"
        variant="ghost"
        :aria-label="t.casca.tema"
        @click="tema.preference = escuro ? 'light' : 'dark'"
      />
      <UDropdownMenu :items="idiomasDaPagina" :content="{ align: 'end' }">
        <UButton :label="t.publico.idiomaAtual" icon="i-lucide-globe" trailing-icon="i-lucide-chevron-down" color="neutral" variant="outline" :aria-label="t.casca.idioma" />
      </UDropdownMenu>
    </div>

    <!-- Logotipo e o cartão -->
    <main class="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 pt-6">
      <img :src="logoEnspace" alt="ENSPACE" class="mb-6 h-7 w-auto invert dark:invert-0">
      <slot />
      <p class="mt-10 text-center text-xs text-muted">{{ t.publico.rodape }}</p>
    </main>
  </div>
</template>
