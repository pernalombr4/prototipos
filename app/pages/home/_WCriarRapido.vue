<script setup lang="ts">
/**
 * Criar rápido: uma faixa de botões que criam em 1 clique. É o "Create
 * actions" da Home do QuickBooks: sem escolha, mostra o que a pessoa mais usa;
 * com escolha, mostra os fixados (até 8). "Mais" abre o menu Criar inteiro.
 */
import type { Categoria } from './mocks'
import type { OpcaoDeCriar } from './widgets'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  opcoes: OpcaoDeCriar[]
  fixados: string[]
  categorias: Categoria[]
}>()

const emit = defineEmits<{ escolher: [opcao: OpcaoDeCriar], configurar: [] }>()

/** O "Mais" vem de fora: é o gatilho do menu Criar inteiro. */
defineSlots<{ mais(): unknown }>()

const mostradas = computed(() => props.fixados.length
  ? props.fixados.map(id => props.opcoes.find(o => o.id === id)).filter((o): o is OpcaoDeCriar => !!o)
  : [...props.opcoes].sort((a, b) => b.usos - a.usos).slice(0, 6))

function rotulo(o: OpcaoDeCriar) {
  const c = props.categorias.find(x => x.slug === o.categoria)
  if (o.tipo === 'tarefa') return props.t.novaTarefa.titulo
  if (o.tipo === 'item') return props.t.novoItem.titulo(c?.name ?? '')
  return c?.formularios.find(f => f.id === o.formulario)?.nome ?? ''
}
</script>

<template>
  <div class="flex h-full items-center gap-3 pl-5 pr-10">
    <div class="hidden shrink-0 flex-col xl:flex">
      <span class="text-sm font-semibold text-highlighted">{{ t.widgets.criarRapido.titulo }}</span>
      <button type="button" class="text-left text-xs text-muted underline-offset-2 hover:text-primary hover:underline" @click="emit('configurar')">
        {{ fixados.length ? t.criarRapido.fixados : t.criarRapido.maisUsados }}
      </button>
    </div>
    <div class="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto overflow-y-hidden py-1 [scrollbar-width:none]">
      <UButton
        v-for="(o, i) in mostradas"
        :key="o.id"
        :label="rotulo(o)"
        :icon="o.icone"
        :color="i === 0 ? 'primary' : 'neutral'"
        :variant="i === 0 ? 'soft' : 'outline'"
        size="sm"
        class="shrink-0 animate-[entrada_0.3s_ease-out_both] transition-transform hover:-translate-y-0.5"
        :style="{ animationDelay: `${i * 40}ms` }"
        @click="emit('escolher', o)"
      />
      <slot name="mais" />
    </div>
  </div>
</template>
