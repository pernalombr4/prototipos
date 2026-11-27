<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): a tela de Dashboards sem nenhum dashboard. 2 opções para o dev:
 *
 * - Opção A (a preferida): o BENI lê as categorias e propõe os primeiros painéis.
 *   Botões "Construir com o BENI" e "Começar do zero".
 * - Opção B: sem IA. Só "Criar dashboard", com os 3 passos do que vem depois.
 *
 * O workspace sem categoria tem estado próprio: sem categoria não há campo, e sem campo
 * não há painel. O ENSPACE começa assim, então nenhum dashboard vem pronto.
 */
import type { Textos } from './textos'
import AvatarDoBeni from './_AvatarDoBeni.vue'

defineProps<{
  t: Textos
  opcao: 'A' | 'B'
  semCategorias: boolean
  /** Quem só lê não cria dashboard. */
  podeCriar: boolean
}>()
const emit = defineEmits<{ comBeni: [], doZero: [], criarCategoria: [] }>()
</script>

<template>
  <div class="m-auto w-full max-w-xl px-4 py-12 text-center">
    <!-- Sem categoria: não há o que medir -->
    <template v-if="semCategorias">
      <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-elevated">
        <UIcon name="i-lucide-database" class="size-7 text-muted" />
      </div>
      <h2 class="mt-4 text-lg font-semibold text-highlighted">{{ t.inicial.semCategoriasTitulo }}</h2>
      <p class="mt-1.5 text-sm text-muted">{{ t.inicial.semCategoriasDescricao }}</p>
      <UButton v-if="podeCriar" :label="t.inicial.criarCategoria" icon="i-lucide-plus" color="neutral" variant="outline" class="mt-5" @click="emit('criarCategoria')" />
    </template>

    <!-- Quem só lê -->
    <template v-else-if="!podeCriar">
      <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-elevated">
        <UIcon name="i-lucide-chart-column" class="size-7 text-muted" />
      </div>
      <h2 class="mt-4 text-lg font-semibold text-highlighted">{{ t.inicial.leitorTitulo }}</h2>
      <p class="mt-1.5 text-sm text-muted">{{ t.inicial.leitorDescricao }}</p>
    </template>

    <!-- Opção A: com o BENI -->
    <template v-else-if="opcao === 'A'">
      <div class="flex justify-center">
        <AvatarDoBeni tamanho="xl" />
      </div>
      <h2 class="mt-3 text-lg font-semibold text-highlighted">{{ t.inicial.titulo }}</h2>
      <p class="mt-1.5 text-sm text-muted">{{ t.inicial.descricaoA }}</p>
      <div class="mt-5 flex flex-wrap justify-center gap-2">
        <UButton :label="t.inicial.comBeni" icon="i-lucide-sparkles" @click="emit('comBeni')" />
        <UButton :label="t.inicial.doZero" icon="i-lucide-plus" color="neutral" variant="outline" @click="emit('doZero')" />
      </div>
      <ul class="mx-auto mt-8 grid max-w-lg gap-3 text-left sm:grid-cols-2">
        <li class="rounded-lg border border-default p-3">
          <p class="flex items-center gap-1.5 text-sm font-medium text-highlighted">
            <UIcon name="i-lucide-scan-eye" class="size-4 text-primary" />{{ t.inicial.leTitulo }}
          </p>
          <p class="mt-1 text-xs text-muted">{{ t.inicial.leTexto }}</p>
        </li>
        <li class="rounded-lg border border-default p-3">
          <p class="flex items-center gap-1.5 text-sm font-medium text-highlighted">
            <UIcon name="i-lucide-message-circle-question" class="size-4 text-primary" />{{ t.inicial.perguntaTitulo }}
          </p>
          <p class="mt-1 text-xs text-muted">{{ t.inicial.perguntaTexto }}</p>
        </li>
      </ul>
    </template>

    <!-- Opção B: sem IA -->
    <template v-else>
      <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
        <UIcon name="i-lucide-chart-column" class="size-7 text-primary" />
      </div>
      <h2 class="mt-4 text-lg font-semibold text-highlighted">{{ t.inicial.titulo }}</h2>
      <p class="mt-1.5 text-sm text-muted">{{ t.inicial.descricaoB }}</p>
      <UButton :label="t.inicial.criar" icon="i-lucide-plus" class="mt-5" @click="emit('doZero')" />
      <ol class="mx-auto mt-8 max-w-sm space-y-2.5 text-left">
        <li v-for="(passo, i) in t.inicial.passos" :key="i" class="flex items-start gap-2.5 text-sm text-toned">
          <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-elevated text-xs font-medium text-highlighted">{{ i + 1 }}</span>
          <span>{{ passo }}</span>
        </li>
      </ol>
    </template>
  </div>
</template>
