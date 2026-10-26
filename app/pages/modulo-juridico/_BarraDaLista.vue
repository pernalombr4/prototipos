<script setup lang="ts">
/**
 * A barra da "Nova Listagem de Registros", a mesma de toda categoria do ENSPACE.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Cópia do develop: a linha das visualizações ("Itens" e "+ Visualizar") e a barra de
 * ferramentas (Pesquisar registros, Criado em, Todo o período, os ícones Exportar, Colunas, Filtros e Configurações,
 * e Novo registro). Fontes: `comunicacao-no-workspace/_TelaItens.vue` e o print `15-lista-de-itens.jpg` (develop,
 * 05/10/2026). As telas do módulo usam esta barra para não ganhar um jeito próprio de filtrar e trocar de visão.
 *
 * O que muda por tela vem por prop: as visualizações (as que o módulo instala, como as de uma categoria) e o
 * rótulo do botão de criar. O slot `periodo` substitui "Criado em" e "Todo o período" quando a tela tem outro
 * recorte de data (a data-base da Provisão).
 */
import type { Textos } from './textos'

export interface Vista { chave: string, rotulo: string, icone: string, contagem?: number }

const props = defineProps<{
  t: Textos
  vistas: Vista[]
  pesquisar?: string
  /** Rótulo do botão de criar. Sem ele, a barra não mostra o botão. */
  novo?: string
}>()
const ativa = defineModel<string>('ativa', { required: true })
const busca = defineModel<string>('busca', { default: '' })
const emit = defineEmits<{ novo: [] }>()
const toast = useToast()

function foraDoEscopo() {
  toast.add({ title: props.t.geral.foraDoEscopo, description: props.t.geral.foraDoEscopoDesc, icon: 'i-lucide-construction', color: 'neutral' })
}
</script>

<template>
  <div class="shrink-0">
    <!-- Visualizações (cópia) -->
    <div class="flex items-center gap-1 overflow-x-auto border-b border-default px-3 py-2">
      <UButton
        v-for="v in vistas"
        :key="v.chave"
        :icon="v.icone"
        size="sm"
        :color="ativa === v.chave ? 'primary' : 'neutral'"
        :variant="ativa === v.chave ? 'soft' : 'ghost'"
        class="shrink-0"
        :aria-pressed="ativa === v.chave"
        @click="ativa = v.chave"
      >
        {{ v.rotulo }}
        <UBadge v-if="v.contagem" :label="String(v.contagem)" color="primary" variant="subtle" size="sm" class="tabular-nums" />
      </UButton>
      <USeparator orientation="vertical" class="mx-1 h-5" />
      <UButton icon="i-lucide-plus" :label="t.lista.visualizar" size="sm" color="neutral" variant="ghost" class="shrink-0" @click="foraDoEscopo" />
    </div>

    <!-- Barra de ferramentas (cópia) -->
    <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2.5">
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="pesquisar ?? t.lista.pesquisar" variant="none" size="sm" class="w-56" />
      <slot name="periodo">
        <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-calendar" class="size-4" />{{ t.lista.criadoEm }}</span>
        <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-arrow-down-up" class="size-4" />{{ t.lista.todoPeriodo }}</span>
      </slot>

      <div class="ml-auto flex items-center gap-1">
        <slot name="antes-dos-icones" />
        <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.exportar" @click="foraDoEscopo" />
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.colunas" @click="foraDoEscopo" />
        <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.filtros" @click="foraDoEscopo" />
        <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.configurar" @click="foraDoEscopo" />
        <UButton v-if="novo" icon="i-lucide-plus" :label="novo" color="primary" variant="soft" size="sm" class="ml-1" @click="emit('novo')" />
      </div>
    </div>
  </div>
</template>
