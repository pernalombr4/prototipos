<script setup lang="ts">
/**
 * Um nó da barra, recursivo. O desenho muda com o menu (hoje, A ou B); a
 * explicação de cada um está no `_MenuDaDoc.vue`.
 *
 * As classes do "hoje" são as do tema do `UContentNavigation` (Nuxt UI 4.5.1,
 * o que o en-docs usa): `list`, `listWithChildren`, `link`, `trigger`, o traço
 * de destaque do item ativo (`after:bg-primary`) e o corte do nome (`truncate`).
 */
import type { ComputedRef, Ref } from 'vue'
import type { Lingua, Menu, No } from './mocks'
import { nomeDoNo } from './mocks'
import type { Textos } from './textos'

defineOptions({ name: 'NoDoMenu' })

const props = defineProps<{ no: No, pai: string, nivel: number, /** Atraso da entrada em cascata, em ms. */ atraso?: number }>()

const entrada = computed(() => props.atraso === undefined
  ? undefined
  : { animation: 'entrada 320ms ease-out both', animationDelay: `${props.atraso}ms` })

const ctx = inject('menuDaDoc') as {
  menu: Ref<Menu>
  l: Ref<Lingua>
  t: Ref<Textos> | ComputedRef<Textos>
  paginaAtiva: Ref<string>
  estaAberto: (no: No, pai: string) => boolean
  alternar: (no: No, pai: string) => void
  abrirPasta: (no: No, pai: string) => void
  abrirPagina: (no: No) => void
}

const menu = computed(() => ctx.menu.value)
const nome = computed(() => nomeDoNo(props.no, ctx.l.value))
const aberto = computed(() => ctx.estaAberto(props.no, props.pai))
const temFilhos = computed(() => !!props.no.filhos?.length)
const ativo = computed(() => props.no.tipo !== 'titulo' && !!props.no.pagina && props.no.pagina === ctx.paginaAtiva.value)
/** Nas propostas, a pasta que só tem o índice aparece como link. */
const comoLink = computed(() => props.no.tipo === 'pagina' || !temFilhos.value)

/* Classes do tema do UContentNavigation (casca). */
const link = 'group relative flex w-full cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-left text-sm before:absolute before:inset-x-0 before:inset-y-px before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-2 focus-visible:before:ring-inset focus-visible:before:ring-primary'
const inativo = 'text-muted transition-colors before:transition-colors hover:text-highlighted hover:before:bg-elevated/50'
const traco = 'after:absolute after:-left-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full after:transition-colors'

/* Classes da B, no desenho do menu do ENSPACE. */
const itemB = 'flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
const itemBInativo = 'text-toned hover:bg-elevated hover:text-highlighted'
const itemBAtivo = 'bg-primary/10 font-medium text-primary'
</script>

<template>
  <!-- ============================================================ -->
  <!-- HOJE: casca do UContentNavigation                             -->
  <!-- ============================================================ -->
  <li
    v-if="menu === 'hoje'"
    class="flex flex-col"
    :style="entrada"
    :class="[nivel > 0 ? '-ms-px ps-1.5' : '', temFilhos && aberto ? 'mb-1.5' : '']"
  >
    <button
      v-if="no.tipo === 'pasta'"
      type="button"
      :class="[link, nivel > 0 ? traco : '', 'font-semibold', aberto ? 'text-highlighted' : inativo]"
      :aria-expanded="aberto"
      @click="ctx.alternar(no, pai)"
    >
      <UIcon v-if="no.icone" :name="no.icone" class="size-5 shrink-0" :class="aberto ? 'text-default' : 'text-dimmed group-hover:text-default'" />
      <span class="truncate">{{ nome }}</span>
      <span class="ms-auto inline-flex items-center">
        <UIcon name="i-lucide-chevron-down" class="size-5 shrink-0 transition-transform duration-200" :class="aberto ? 'rotate-180' : ''" />
      </span>
    </button>

    <button
      v-else
      type="button"
      :class="[link, nivel > 0 ? traco : '', ativo ? 'font-medium text-primary after:bg-primary' : inativo]"
      :aria-current="ativo ? 'page' : undefined"
      @click="ctx.abrirPagina(no)"
    >
      <UIcon v-if="no.icone" :name="no.icone" class="size-5 shrink-0" :class="ativo ? 'text-primary' : 'text-dimmed group-hover:text-default'" />
      <span class="truncate">{{ nome }}</span>
    </button>

    <div
      v-if="temFilhos"
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      :class="aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <ul class="ms-5 min-h-0 overflow-hidden border-s border-default" :inert="!aberto">
        <NoDoMenu v-for="filho in no.filhos" :key="filho.id" :no="filho" :pai="no.id" :nivel="nivel + 1" />
      </ul>
    </div>
  </li>

  <!-- ============================================================ -->
  <!-- A, C e D: o mesmo componente do site, com as 4 mudanças       -->
  <!-- ============================================================ -->
  <li
    v-else-if="menu === 'a' || menu === 'c' || menu === 'd'"
    class="flex flex-col"
    :style="entrada"
    :class="[nivel > 0 ? '-ms-px ps-1.5' : '', temFilhos && aberto ? 'mb-1.5' : '']"
  >
    <button
      v-if="comoLink"
      type="button"
      :class="[link, nivel > 0 ? traco : '', ativo ? 'font-medium text-primary after:bg-primary' : inativo]"
      :aria-current="ativo ? 'page' : undefined"
      @click="ctx.abrirPagina(no)"
    >
      <UIcon v-if="no.icone && nivel === 0" :name="no.icone" class="size-5 shrink-0" :class="ativo ? 'text-primary' : 'text-dimmed group-hover:text-default'" />
      <span class="min-w-0 flex-1 text-pretty break-words leading-snug">{{ nome }}</span>
    </button>

    <div v-else class="relative flex items-start">
      <button
        type="button"
        :class="[link, nivel > 0 ? traco : '', 'pe-9 font-semibold', ativo ? 'text-primary after:bg-primary' : aberto ? 'text-highlighted' : inativo]"
        :aria-current="ativo ? 'page' : undefined"
        @click="ctx.abrirPasta(no, pai)"
      >
        <UIcon v-if="no.icone && nivel === 0" :name="no.icone" class="size-5 shrink-0" :class="ativo ? 'text-primary' : aberto ? 'text-default' : 'text-dimmed group-hover:text-default'" />
        <span class="min-w-0 flex-1 text-pretty break-words leading-snug">{{ nome }}</span>
      </button>
      <button
        type="button"
        class="absolute end-1 top-1 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-dimmed transition-colors hover:bg-elevated hover:text-highlighted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        :aria-expanded="aberto"
        :aria-label="aberto ? ctx.t.value.proposta.fechar(nome) : ctx.t.value.proposta.abrir(nome)"
        @click="ctx.alternar(no, pai)"
      >
        <UIcon name="i-lucide-chevron-down" class="size-5 transition-transform duration-200" :class="aberto ? 'rotate-180' : ''" />
      </button>
    </div>

    <div
      v-if="temFilhos"
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      :class="aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <ul class="ms-5 min-h-0 overflow-hidden border-s border-default" :inert="!aberto">
        <NoDoMenu v-for="filho in no.filhos" :key="filho.id" :no="filho" :pai="no.id" :nivel="nivel + 1" />
      </ul>
    </div>
  </li>

  <!-- ============================================================ -->
  <!-- B: o desenho do menu do ENSPACE                               -->
  <!-- ============================================================ -->
  <li v-else class="flex flex-col" :style="entrada">
    <!-- Título de seção fixo: não recolhe. Abre o índice da seção, quando existe. -->
    <template v-if="no.tipo === 'titulo'">
      <button
        v-if="no.pagina"
        type="button"
        class="cursor-pointer self-start rounded px-2.5 pb-1 pt-4 text-left text-xs font-medium transition-colors hover:text-highlighted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        :class="ativo || no.pagina === ctx.paginaAtiva.value ? 'text-primary' : 'text-muted'"
        @click="ctx.abrirPagina(no)"
      >
        {{ nome }}
      </button>
      <p v-else class="px-2.5 pb-1 pt-4 text-xs font-medium text-muted">
        {{ nome }}
      </p>
      <ul class="flex flex-col gap-0.5">
        <NoDoMenu v-for="filho in no.filhos" :key="filho.id" :no="filho" :pai="no.id" :nivel="nivel + 1" />
      </ul>
    </template>

    <template v-else>
      <button
        v-if="comoLink"
        type="button"
        :class="[itemB, nivel > 1 ? 'py-1 text-muted' : '', ativo ? itemBAtivo : itemBInativo]"
        :aria-current="ativo ? 'page' : undefined"
        @click="ctx.abrirPagina(no)"
      >
        <UIcon v-if="no.icone && nivel === 1" :name="no.icone" class="size-4.5 shrink-0" :class="ativo ? 'text-primary' : 'text-muted'" />
        <span class="min-w-0 flex-1 text-pretty break-words leading-snug">{{ nome }}</span>
      </button>

      <div v-else class="relative flex items-start">
        <button
          type="button"
          :class="[itemB, 'pe-9', nivel > 1 ? 'py-1' : '', ativo ? itemBAtivo : aberto ? 'text-highlighted hover:bg-elevated' : itemBInativo]"
          :aria-current="ativo ? 'page' : undefined"
          @click="ctx.abrirPasta(no, pai)"
        >
          <UIcon v-if="no.icone && nivel === 1" :name="no.icone" class="size-4.5 shrink-0" :class="ativo ? 'text-primary' : 'text-muted'" />
          <span class="min-w-0 flex-1 text-pretty break-words leading-snug">{{ nome }}</span>
        </button>
        <button
          type="button"
          class="absolute end-1 top-0.5 inline-flex size-7 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:bg-accented hover:text-highlighted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :aria-expanded="aberto"
          :aria-label="aberto ? ctx.t.value.proposta.fechar(nome) : ctx.t.value.proposta.abrir(nome)"
          @click="ctx.alternar(no, pai)"
        >
          <UIcon name="i-lucide-chevron-down" class="size-4 transition-transform duration-200" :class="aberto ? 'rotate-180' : ''" />
        </button>
      </div>

      <div
        v-if="temFilhos"
        class="grid transition-[grid-template-rows] duration-200 ease-out"
        :class="aberto ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <ul class="ms-4.5 mt-0.5 flex min-h-0 flex-col gap-0.5 overflow-hidden border-s border-default ps-2" :inert="!aberto">
          <NoDoMenu v-for="filho in no.filhos" :key="filho.id" :no="filho" :pai="no.id" :nivel="nivel + 1" />
        </ul>
      </div>
    </template>
  </li>
</template>
