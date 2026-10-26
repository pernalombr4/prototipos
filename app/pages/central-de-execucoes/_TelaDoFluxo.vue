<script setup lang="ts">
/**
 * A tela de um fluxo (`/workspaces/<ws>/workflows/<id>`).
 *
 * Hoje (cópia do develop, 24/10/2026): título, versão, selo Ativo, "Abrir Editor", "Executar
 * Workflow" e as abas Execuções e Logs. A aba Execuções é a lista daqui; na proposta ela ganha as
 * mesmas colunas e filtros de status da lista global, sem os filtros de fluxo e de operação.
 */
import type { Fluxo } from './mocks'
import type { Dados, Fase, FiltroDaLista } from './consultas'
import { filtroVazio } from './consultas'
import type { Textos } from './textos'
import ListaDeExecucoes from './_ListaDeExecucoes.vue'

const props = defineProps<{ t: Textos, fluxo: Fluxo, dados: Dados, fase: Fase, hoje?: boolean }>()
const emit = defineEmits<{ voltar: [], abrirExecucao: [number], abrirItem: [number] }>()

const toast = useToast()
const aba = ref<'execucoes' | 'logs'>('execucoes')
const filtro = ref<FiltroDaLista>({ ...filtroVazio(), soOrigem: false })
const foraDoEscopo = (titulo: string) => toast.add({ title: titulo, description: props.t.detalhe.foraDoEscopo, icon: 'i-lucide-construction', color: 'neutral' })
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-3">
      <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" :aria-label="t.casca.voltar" @click="emit('voltar')" />
      <div class="min-w-0 flex-1">
        <h1 class="flex items-center gap-2 truncate text-base font-semibold text-highlighted">
          {{ fluxo.name }}
          <UBadge :label="t.fluxos.ativo" color="success" variant="subtle" size="sm" />
        </h1>
        <p class="text-xs text-muted">v{{ fluxo.version }}</p>
      </div>
      <UButton :label="t.fluxos.abrirEditor" icon="i-lucide-pencil" size="sm" color="neutral" variant="outline" @click="foraDoEscopo(t.fluxos.abrirEditor)" />
      <UButton :label="t.fluxos.executarWorkflow" icon="i-lucide-play" size="sm" @click="foraDoEscopo(t.fluxos.executarWorkflow)" />
    </div>
    <UTabs
      v-model="aba"
      :items="[{ value: 'execucoes', label: t.fluxos.abaExecucoes, icon: 'i-lucide-circle-play' }, { value: 'logs', label: t.fluxos.abaLogs, icon: 'i-lucide-scroll-text' }]"
      :content="false"
      variant="link"
      size="sm"
      class="border-b border-default px-4"
    />
    <ListaDeExecucoes
      v-if="aba === 'execucoes'"
      v-model:filtro="filtro"
      :t="t"
      :dados="dados"
      :fase="fase"
      :hoje="hoje"
      :fluxo="fluxo"
      @abrir-execucao="id => emit('abrirExecucao', id)"
      @abrir-item="id => emit('abrirItem', id)"
    />
    <div v-else class="flex flex-1 items-center justify-center p-12">
      <UEmpty icon="i-lucide-construction" :title="t.detalhe.foraDoEscopo" :description="t.fluxos.foraDoEscopo" variant="naked" />
    </div>
  </div>
</template>
