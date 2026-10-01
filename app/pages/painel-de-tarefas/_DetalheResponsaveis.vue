<script setup lang="ts">
/**
 * O detalhe do gráfico de responsáveis: a tabela completa (abertas, vencidas,
 * concluídas, % no prazo, tempo), com as 2 leituras ("Designada para" e "Quem
 * assumiu"). Abre pelo "Ver tabela" do painel. É a tabela que antes ocupava o
 * painel; agora o painel é o gráfico e a tabela é o detalhe.
 *
 * Lateral sem faixa de título, como a lista dos números (rodada 3).
 */
import type { LinhaDeResponsavel, ModoDoResponsavel } from './metricas'
import type { Textos } from './textos'
import TabelaResponsaveis from './_TabelaResponsaveis.vue'

defineProps<{
  t: Textos
  linhas: LinhaDeResponsavel[]
}>()

const aberto = defineModel<boolean>('open', { required: true })
const modo = defineModel<ModoDoResponsavel>('modo', { required: true })
const emit = defineEmits<{ abrir: [chave: string] }>()
</script>

<template>
  <USlideover v-model:open="aberto" :title="t.paineis.responsaveis.titulo" :description="t.resp.detalhe" :ui="{ content: 'max-w-4xl' }">
    <template #content="{ close }">
      <div class="flex min-h-0 flex-1 flex-col pt-3">
        <div class="flex items-center justify-between gap-2 px-4 pb-1">
          <p class="truncate text-sm font-semibold text-highlighted">
            {{ t.paineis.responsaveis.titulo }}
          </p>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" class="-mr-2" :aria-label="t.gaveta.fechar" @click="close()" />
        </div>
        <TabelaResponsaveis v-model:modo="modo" :t="t" :linhas="linhas" @abrir="emit('abrir', $event)" />
      </div>
    </template>
  </USlideover>
</template>
