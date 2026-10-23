<script setup lang="ts">
/**
 * CÓPIA, não é proposta: a barra de visualizações como está na branch do PR
 * 2936 (tela nova de itens, workspace teste-ux, 23/10/2026).
 *
 * O que se copiou, olhando:
 * - pílula com ícone; a ativa com fundo claro na cor de destaque;
 * - o nome cortado no próprio texto: 15 letras e "..." (o DOM traz "Pedidos em aber...");
 * - na personalizada, um ícone depois do nome abre o menu Configurar visualização, Duplicar e Excluir;
 * - um separador e o "+ Visualizar" (tooltip "Nova visualização");
 * - sem arrastar, sem papel de aba (`role="tab"`) e sem "+N": quando não cabe,
 *   a barra rola para o lado com a barra de rolagem escondida e uma seta ">"
 *   na ponta; o "+ Visualizar" rola junto e sai da tela.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Visualizacao } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const visualizacoes = defineModel<Visualizacao[]>('visualizacoes', { required: true })
const ativa = defineModel<string>('ativa', { required: true })
const emit = defineEmits<{
  configurar: [ref: string]
  duplicar: [ref: string]
  excluir: [ref: string]
  nova: []
}>()

const cortado = (nome: string) => nome.length > 15 ? `${nome.slice(0, 15)}...` : nome

const rolagem = ref<HTMLElement>()
const sobra = ref(false)
const noFim = ref(false)

function medir() {
  const el = rolagem.value
  if (!el) return
  sobra.value = el.scrollWidth > el.clientWidth + 1
  noFim.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
}

let observador: ResizeObserver | undefined
onMounted(() => {
  observador = new ResizeObserver(medir)
  if (rolagem.value) observador.observe(rolagem.value)
  nextTick(medir)
})
onBeforeUnmount(() => observador?.disconnect())
watch(() => visualizacoes.value.length, () => nextTick(medir))

const menuDe = (v: Visualizacao): DropdownMenuItem[][] => [[
  { label: props.t.hoje.configurar, icon: 'i-lucide-settings', onSelect: () => emit('configurar', v.reference) },
  { label: props.t.hoje.duplicar, icon: 'i-lucide-copy', onSelect: () => emit('duplicar', v.reference) },
], [
  { label: props.t.hoje.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => emit('excluir', v.reference) },
]]
</script>

<template>
  <div class="relative flex min-w-0 items-center">
    <div
      ref="rolagem"
      class="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      @scroll="medir"
    >
      <div
        v-for="v in visualizacoes"
        :key="v.reference"
        class="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm transition-colors"
        :class="ativa === v.reference ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated'"
      >
        <UTooltip :text="v.name ?? ''" :content="{ side: 'bottom' }" :disabled="(v.name ?? '').length <= 15">
          <button type="button" class="flex items-center gap-1.5" @click="ativa = v.reference">
            <UIcon :name="v.model_type === 'kanban' ? 'i-lucide-square-kanban' : 'i-lucide-table'" class="size-4" />
            {{ cortado(v.name ?? '') }}
          </button>
        </UTooltip>
        <UDropdownMenu v-if="v.reference !== 'default'" :items="menuDe(v)" :content="{ align: 'start' }">
          <button type="button" class="flex items-center text-muted hover:text-highlighted" :aria-label="t.hoje.menu">
            <UIcon name="i-lucide-table-properties" class="size-3.5" />
          </button>
        </UDropdownMenu>
      </div>
      <USeparator orientation="vertical" class="mx-1 h-6 shrink-0" />
      <UTooltip :text="t.hoje.novaVisualizacao">
        <UButton :label="t.hoje.visualizar" icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" class="shrink-0" @click="emit('nova')" />
      </UTooltip>
    </div>
    <button
      v-if="sobra && !noFim"
      type="button"
      class="absolute inset-y-0 right-0 flex items-center bg-gradient-to-l from-(--ui-bg) from-60% pl-4 pr-1 text-muted"
      :aria-label="t.hoje.rolar"
      @click="rolagem?.scrollBy({ left: 200 })"
    >
      <UIcon name="i-lucide-chevron-right" class="size-4" />
    </button>
  </div>
</template>
