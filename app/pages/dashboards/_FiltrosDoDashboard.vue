<script setup lang="ts">
/**
 * A barra de filtros do dashboard inteiro, que hoje não existe.
 *
 * - Período: o `EnDashboardPeriodPicker` do SDK, o mesmo do painel de tarefas.
 *   Cada painel lê o período na data que escolheu (Criado em, Data de assinatura).
 * - Filtro por campo comum: só aparecem os campos que existem em mais de uma
 *   categoria do dashboard (mesmo nome e mesmo tipo). O painel cuja categoria não
 *   tem o campo continua sem o filtro e diz isso no rodapé.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { CampoComum, FiltroDoDashboard, Periodo } from './agregacao'
import { opcoesDoComum } from './agregacao'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  comuns: CampoComum[]
}>()

const periodo = defineModel<Periodo>('periodo', { required: true })
const filtros = defineModel<FiltroDoDashboard[]>('filtros', { required: true })

const ativos = computed(() => filtros.value.map(f => ({ f, comum: props.comuns.find(c => c.chave === f.chave) })).filter(x => x.comum))

const menu = computed<DropdownMenuItem[][]>(() => {
  const livres = props.comuns.filter(c => !filtros.value.some(f => f.chave === c.chave))
  if (!livres.length) return [[{ label: props.t.filtros.semCampoComum, disabled: true }]]
  return [
    [{ type: 'label', label: props.t.filtros.filtrarPor }],
    livres.map(c => ({
      label: c.nome,
      description: props.t.filtros.emCategorias(Object.keys(c.em).length),
      icon: c.campo.relacao ? 'i-lucide-link' : c.campo.refId === 'user' ? 'i-lucide-user-round' : 'i-lucide-circle-chevron-down',
      onSelect: () => { filtros.value = [...filtros.value, { chave: c.chave, valores: [] }] },
    })),
  ]
})

function remover(chave: string) {
  filtros.value = filtros.value.filter(f => f.chave !== chave)
}

function trocar(chave: string, valores: string[]) {
  filtros.value = filtros.value.map(f => f.chave === chave ? { ...f, valores } : f)
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <EnDashboardPeriodPicker
      v-model="(periodo as any)"
      :presets="['7d', '30d', '90d', 'month', 'quarter', 'year']"
      custom
      size="sm"
      :locale="(t.locale as any)"
    />

    <TransitionGroup name="filtro">
      <UFieldGroup v-for="{ f, comum } in ativos" :key="f.chave" size="sm">
        <UButton :label="comum!.nome" color="neutral" variant="subtle" class="pointer-events-none" tabindex="-1" />
        <USelectMenu
          :model-value="f.valores"
          :items="opcoesDoComum(comum!)"
          value-key="value"
          multiple
          :placeholder="t.filtros.escolherValores"
          :search-input="{ placeholder: t.filtros.buscarValor }"
          :default-open="!f.valores.length"
          class="w-56"
          @update:model-value="(v: string[]) => trocar(f.chave, v)"
        >
          <template v-if="f.valores.length > 1" #default>
            <span class="truncate">{{ t.filtros.selecionados(f.valores.length) }}</span>
          </template>
        </USelectMenu>
        <UButton icon="i-lucide-x" color="neutral" variant="subtle" :aria-label="t.filtros.remover(comum!.nome)" @click="remover(f.chave)" />
      </UFieldGroup>
    </TransitionGroup>

    <UDropdownMenu :items="menu" :content="{ align: 'start' }" :ui="{ content: 'min-w-64' }">
      <UButton :label="t.filtros.adicionar" icon="i-lucide-list-filter-plus" color="neutral" variant="outline" size="sm" />
    </UDropdownMenu>

    <UButton
      v-if="filtros.length"
      :label="t.filtros.limpar"
      color="neutral"
      variant="link"
      size="sm"
      @click="filtros = []"
    />
  </div>
</template>

<style scoped>
/* Entrada do filtro novo. Motivo no DECISOES.md: o TransitionGroup pede as classes. */
.filtro-enter-active,
.filtro-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.filtro-enter-from,
.filtro-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
@media (prefers-reduced-motion: reduce) {
  .filtro-enter-active,
  .filtro-leave-active {
    transition: none;
  }
}
</style>
