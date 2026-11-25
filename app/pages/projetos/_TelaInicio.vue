<script setup lang="ts">
/**
 * Início. CASCA ilustrativa: a saudação e os atalhos de hoje.
 * PROPOSTA: o painel "Seus projetos", com os projetos do menu da pessoa, e o convite para criar o
 * primeiro projeto para quem pode criar e ainda não tem nenhum.
 */
import type { Textos } from './textos'
import { COR_DO_PROJETO, useMarcaDeProposta, useProjetos } from './estado'

defineProps<{ t: Textos }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()
const primeiroNome = computed(() => prj.euPessoa.value.nome.split(' ')[0])
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-6 py-6">
    <h1 class="text-2xl font-semibold text-highlighted animate-[entrada_0.2s_ease-out_both]">{{ t.inicio.ola(primeiroNome!) }}</h1>
    <p class="mt-1 text-sm text-muted">{{ t.casca.conteudoIlustrativo }}</p>

    <section class="mt-6 rounded-lg border border-default bg-default animate-[entrada_0.25s_ease-out_both]" :class="marca" style="animation-delay: 60ms">
      <header class="flex items-center gap-2 border-b border-default px-4 py-3">
        <h2 class="flex-1 text-sm font-semibold text-highlighted">{{ t.inicio.seusProjetos }}</h2>
        <UButton v-if="prj.visiveis.value.length" :label="t.painel.vazioAcao" icon="i-lucide-list" size="xs" color="neutral" variant="outline" @click="prj.tela.value = { tipo: 'diretorio' }" />
      </header>

      <div v-if="prj.noMenu.value.length" class="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3">
        <button
          v-for="(p, i) in prj.noMenu.value"
          :key="p.id"
          type="button"
          class="flex items-center gap-3 rounded-md border border-default px-3 py-2.5 text-left transition-[background-color,transform] duration-150 animate-[entrada_0.2s_ease-out_both] hover:-translate-y-0.5 hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
          :style="{ animationDelay: `${80 + i * 30}ms` }"
          @click="prj.abrirProjeto(p.id)"
        >
          <span class="flex size-8 shrink-0 items-center justify-center rounded-md" :class="COR_DO_PROJETO[p.cor]"><UIcon :name="p.icone" class="size-4" /></span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium text-highlighted">{{ p.nome }}</span>
            <span class="block truncate text-xs text-muted">{{ t.inicio.categorias(prj.categoriasDe(p.id).length) }}</span>
          </span>
        </button>
      </div>

      <div v-else-if="prj.souDono.value && !prj.projetos.value.length" class="flex flex-col items-center gap-2 px-6 py-10 text-center">
        <UIcon name="i-lucide-folder-kanban" class="size-7 text-muted" />
        <p class="text-sm font-semibold text-highlighted">{{ t.diretorio.vazioTitulo }}</p>
        <p class="max-w-md text-sm text-muted">{{ t.diretorio.vazioTexto }}</p>
        <UButton :label="t.criar.titulo" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" class="mt-1" @click="prj.janelas.criar.value = true" />
      </div>

      <p v-else class="px-4 py-8 text-center text-sm text-muted">{{ t.painel.vazioTexto }}</p>
    </section>
  </div>
</template>
