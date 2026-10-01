<script setup lang="ts">
/**
 * ANDAIME DE PROTÓTIPO: a faixa que aparece no topo quando o botão "MVP" da
 * barra de baixo está ligado. Diz o recorte numa linha e abre o detalhe (o que
 * fica, o que sai e por quê). Borda tracejada, como todo andaime: não é tela
 * do produto. Texto só em português, como os botões de estado.
 */
import { RECORTE } from './mvp'

const aberto = ref(false)
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-accented bg-elevated/50 px-4 py-3">
    <UIcon name="i-lucide-scissors" class="size-4 shrink-0 text-muted" />
    <p class="min-w-0 flex-1 text-sm text-toned">
      <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Protótipo · recorte do MVP</span>
      {{ RECORTE.resumo }}
    </p>
    <UButton label="O que fica, o que sai e por quê" icon="i-lucide-list-checks" color="neutral" variant="outline" size="sm" @click="aberto = true" />

    <UModal
      v-model:open="aberto"
      title="Recorte do MVP"
      description="Como o painel sairia na primeira entrega, pelo viés de produto."
      :ui="{ content: 'max-w-3xl', body: 'space-y-5' }"
    >
      <template #body>
        <section class="space-y-1">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-muted">
            O trabalho que o MVP resolve
          </h3>
          <p class="text-sm text-highlighted">
            {{ RECORTE.trabalho }}
          </p>
        </section>

        <section class="space-y-2">
          <h3 class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-success-700 dark:text-success-300">
            <UIcon name="i-lucide-check" class="size-3.5" /> Fica
          </h3>
          <ul class="divide-y divide-default rounded-lg border border-default">
            <li v-for="item in RECORTE.fica" :key="item.oQue" class="grid gap-x-4 gap-y-0.5 px-3 py-2 text-sm sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <span class="font-medium text-highlighted">{{ item.oQue }}</span>
              <span class="text-muted">{{ item.porque }}</span>
            </li>
          </ul>
        </section>

        <section class="space-y-2">
          <h3 class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-error-700 dark:text-error-300">
            <UIcon name="i-lucide-minus" class="size-3.5" /> Sai
          </h3>
          <ul class="divide-y divide-default rounded-lg border border-default">
            <li v-for="item in RECORTE.sai" :key="item.oQue" class="grid gap-x-4 gap-y-0.5 px-3 py-2 text-sm sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
              <span class="font-medium text-highlighted">{{ item.oQue }}</span>
              <span class="text-muted">{{ item.porque }}</span>
            </li>
          </ul>
        </section>

        <section class="space-y-1">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-muted">
            O que o back precisa
          </h3>
          <p class="text-sm text-toned">
            {{ RECORTE.back }}
          </p>
        </section>

        <section class="space-y-1">
          <h3 class="text-xs font-semibold uppercase tracking-wide text-muted">
            Risco e teste
          </h3>
          <p class="text-sm text-toned">
            {{ RECORTE.risco }}
          </p>
          <p class="text-sm text-toned">
            {{ RECORTE.fase2 }}
          </p>
        </section>
      </template>
    </UModal>
  </div>
</template>
