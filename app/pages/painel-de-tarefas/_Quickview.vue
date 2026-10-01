<script setup lang="ts">
/**
 * A quickview da lista lateral: o resumo do painel de onde a lista saiu.
 *
 * Copiada da lateral do admin do ENSPACE (tela Usuários), visto em 30/09/2026:
 * - expandida: cabeçalho com o tipo, o "avatar" e o nome no centro, os selos
 *   de estado e uma lista de "Details" com ícone, rótulo e valor;
 * - recolhida: um trilho estreito com o ícone, o número e os ícones de cada
 *   linha, que mostram rótulo e valor ao passar o mouse.
 * Quem expande e recolhe é o `USplitter` da lista (`_GavetaDeTarefas.vue`).
 */
import { DEFINICAO } from './paineis'
import type { ResumoDoRecorte } from './paineis'
import type { Textos } from './textos'
import ComoCalculamos from './_ComoCalculamos.vue'

const props = defineProps<{
  t: Textos
  resumo: ResumoDoRecorte
  recolhido: boolean
  /** Os filtros ligados no painel quando a lista abriu. */
  filtros: string[]
}>()

const icone = computed(() => DEFINICAO[props.resumo.painel].icone)
const nomeDoPainel = computed(() => props.t.paineis[props.resumo.painel].titulo)

/**
 * O "tipo" no cabeçalho, como o "Usuário" do admin: o nome do painel, ou o
 * grupo dele quando o recorte já tem o mesmo nome (número clicado).
 */
const tipo = computed(() => nomeDoPainel.value === props.resumo.titulo
  ? props.t.grade.grupos[DEFINICAO[props.resumo.painel].grupo]
  : nomeDoPainel.value)

const corDoTom = {
  error: 'text-error-700 dark:text-error-300',
  warning: 'text-warning-700 dark:text-warning-300',
  success: 'text-success-700 dark:text-success-300',
} as const
</script>

<template>
  <!-- Recolhida: o trilho -->
  <div v-if="recolhido" class="flex h-full w-full flex-col items-center gap-2 overflow-y-auto py-3">
    <UTooltip :text="resumo.valor ? `${resumo.titulo}: ${resumo.valor}` : resumo.titulo" :content="{ side: 'right' }">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
        <UIcon :name="icone" class="size-4 text-primary" />
      </span>
    </UTooltip>
    <span v-if="resumo.valor" class="max-w-full truncate px-1 text-xs font-semibold tabular-nums text-highlighted">{{ resumo.valor }}</span>
    <USeparator class="w-6" />
    <UTooltip
      v-for="linha in resumo.linhas"
      :key="linha.rotulo"
      :text="`${linha.rotulo}: ${linha.valor}`"
      :content="{ side: 'right' }"
    >
      <span
        tabindex="0"
        class="flex size-8 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
        :class="linha.destaque ? 'bg-primary/10 text-primary' : 'text-muted'"
        :aria-label="`${linha.rotulo}: ${linha.valor}`"
      >
        <UIcon :name="linha.icone" class="size-4" />
      </span>
    </UTooltip>
  </div>

  <!-- Expandida: o resumo inteiro -->
  <div v-else class="flex h-full w-full min-w-0 flex-col">
    <header class="flex items-center justify-between gap-2 border-b border-default py-2.5 pl-4 pr-2">
      <span class="truncate text-sm font-medium text-highlighted">{{ tipo }}</span>
      <ComoCalculamos :titulo="t.comoCalculamos" :texto="t.regras[resumo.painel]" :sobre="nomeDoPainel" />
    </header>

    <UScrollArea class="min-h-0 flex-1" :ui="{ viewport: 'gap-4 p-4' }">
      <div class="flex flex-col items-center gap-1 text-center">
        <span class="mb-1 flex size-12 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
          <UIcon :name="icone" class="size-5 text-primary" />
        </span>
        <p class="font-semibold text-highlighted">
          {{ resumo.titulo }}
        </p>
        <p v-if="resumo.valor" class="text-3xl font-semibold tabular-nums text-highlighted">
          {{ resumo.valor }}
        </p>
        <span class="mt-1 flex flex-wrap justify-center gap-1">
          <UBadge v-for="s in resumo.selos" :key="s" :label="s" color="neutral" variant="soft" size="sm" />
        </span>
      </div>

      <USeparator />

      <section>
        <h3 class="mb-2 text-xs font-semibold text-highlighted">
          {{ t.gaveta.resumo }}
        </h3>
        <dl class="space-y-2.5">
          <div
            v-for="linha in resumo.linhas"
            :key="linha.rotulo"
            class="flex gap-2.5 rounded-md"
            :class="linha.destaque ? '-mx-2 bg-primary/5 px-2 py-1.5 ring-1 ring-inset ring-primary/20' : ''"
          >
            <UIcon :name="linha.icone" class="mt-0.5 size-4 shrink-0" :class="linha.destaque ? 'text-primary' : 'text-muted'" />
            <div class="min-w-0">
              <dt class="text-xs text-muted">
                {{ linha.rotulo }}
              </dt>
              <dd class="text-sm tabular-nums" :class="linha.tom ? corDoTom[linha.tom] : 'text-highlighted'">
                {{ linha.valor }}
              </dd>
            </div>
          </div>
        </dl>
      </section>

      <section v-if="filtros.length">
        <h3 class="mb-2 text-xs font-semibold text-highlighted">
          {{ t.gaveta.filtrosDoRecorte }}
        </h3>
        <span class="flex flex-wrap gap-1">
          <UBadge v-for="f in filtros" :key="f" :label="f" color="neutral" variant="outline" size="sm" />
        </span>
      </section>
    </UScrollArea>
  </div>
</template>
