<script setup lang="ts">
/**
 * Filtros globais do painel: valem para todos os painéis (convenção de Jira,
 * ClickUp, Linear, monday.com e Notion).
 *
 * Desenho da barra: o `UDashboardToolbar` do template de dashboard do Nuxt UI,
 * que o admin do ENSPACE usa na Home. Botões fantasma, período à esquerda com
 * ícone de calendário e seta que gira ao abrir.
 *
 * Período: só os atalhos da coluna da esquerda do `HomeDateRangePicker`. O
 * calendário de intervalo (`UCalendar` com `range`) precisa do
 * `@internationalized/date`, que não está instalado aqui: fica para o produto
 * (registrado em "Não deu" no DECISOES.md).
 *
 * Origem: "Criadas manualmente" e "Criadas por fluxo" (rodada 2). Spaceflow e
 * fluxo da categoria ficam juntos em "por fluxo".
 */
import type { SelectMenuItem } from '@nuxt/ui'
import type { ChaveDoPeriodo, Filtros } from './metricas'
import { categoriasDisponiveis, intervaloDo, responsaveisDisponiveis } from './metricas'
import type { Textos } from './textos'
import { dataCurta } from './formatar'

const props = defineProps<{ t: Textos }>()
const filtros = defineModel<Filtros>({ required: true })

const PERIODOS: ChaveDoPeriodo[] = ['7d', '30d', '90d', 'mes', 'ano', '12m', 'tudo']

function intervaloLegivel(p: ChaveDoPeriodo) {
  if (p === 'tudo') return ''
  const i = intervaloDo(p)
  return props.t.filtros.intervalo(dataCurta(i.inicio, props.t), dataCurta(i.fim, props.t))
}

const abertoPeriodo = ref(false)
function escolher(p: ChaveDoPeriodo) {
  filtros.value.periodo = p
  abertoPeriodo.value = false
}

const origens = computed(() => (['todas', 'manual', 'fluxo'] as const).map(o => ({
  value: o,
  label: props.t.filtros.origens[o],
  icon: o === 'manual' ? 'i-lucide-hand' : o === 'fluxo' ? 'i-lucide-workflow' : 'i-lucide-layers',
})))

const opcoesDeResponsavel = computed<SelectMenuItem[]>(() => [
  { type: 'label', label: props.t.filtros.pessoas },
  ...responsaveisDisponiveis.pessoas.map(p => ({ label: p.nome, value: p.chave, avatar: { text: p.iniciais } })),
  { type: 'label', label: props.t.filtros.grupos },
  ...responsaveisDisponiveis.grupos.map(g => ({ label: g.nome, value: g.chave, icon: 'i-lucide-users' })),
  { type: 'label', label: props.t.filtros.outros },
  { label: props.t.rotulos.todos, value: 'todos', icon: 'i-lucide-globe' },
  { label: props.t.rotulos.externo, value: 'externo', icon: 'i-lucide-mail' },
  { label: props.t.rotulos.sem, value: 'sem', icon: 'i-lucide-user-x' },
])

const opcoesDeCategoria = computed(() => categoriasDisponiveis.map(c => ({ label: c, value: c })))

const algumFiltro = computed(() =>
  filtros.value.origem !== 'todas' || filtros.value.responsaveis.length > 0 || filtros.value.categorias.length > 0,
)

function limpar() {
  filtros.value = { ...filtros.value, origem: 'todas', responsaveis: [], categorias: [] }
}

const girar = 'group-data-[state=open]:rotate-180 transition-transform duration-200'
</script>

<template>
  <div class="flex flex-wrap items-center gap-1">
    <UPopover v-model:open="abertoPeriodo" :content="{ align: 'start' }">
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-lucide-calendar"
        class="group -ms-2.5 data-[state=open]:bg-elevated"
        :aria-label="`${t.filtros.periodo}: ${t.filtros.periodos[filtros.periodo]}`"
      >
        <span class="truncate">{{ t.filtros.periodos[filtros.periodo] }}</span>
        <span v-if="filtros.periodo !== 'tudo'" class="hidden text-xs text-muted xl:inline">{{ intervaloLegivel(filtros.periodo) }}</span>
        <template #trailing>
          <UIcon name="i-lucide-chevron-down" class="size-5 shrink-0 text-dimmed" :class="girar" />
        </template>
      </UButton>
      <template #content>
        <div class="flex flex-col py-1" role="listbox" :aria-label="t.filtros.periodo">
          <UButton
            v-for="p in PERIODOS"
            :key="p"
            color="neutral"
            variant="ghost"
            role="option"
            :aria-selected="filtros.periodo === p"
            class="justify-between gap-6 rounded-none px-4"
            :class="filtros.periodo === p ? 'bg-elevated' : 'hover:bg-elevated/50'"
            @click="escolher(p)"
          >
            <span>{{ t.filtros.periodos[p] }}</span>
            <span class="text-xs text-muted">{{ intervaloLegivel(p) }}</span>
          </UButton>
        </div>
      </template>
    </UPopover>

    <USelect
      v-model="filtros.origem"
      :items="origens"
      variant="ghost"
      :icon="origens.find(o => o.value === filtros.origem)?.icon"
      class="data-[state=open]:bg-elevated"
      :content="{ align: 'start' }"
      :ui="{ trailingIcon: girar, content: 'w-auto min-w-(--reka-select-trigger-width)' }"
      :aria-label="t.filtros.origem"
    />

    <USelectMenu
      v-model="filtros.responsaveis"
      :items="opcoesDeResponsavel"
      value-key="value"
      multiple
      variant="ghost"
      icon="i-lucide-user"
      :placeholder="t.filtros.responsavelVazio"
      :search-input="{ placeholder: t.filtros.buscar }"
      class="min-w-44 data-[state=open]:bg-elevated"
      :ui="{ trailingIcon: girar, placeholder: 'text-default' }"
      :aria-label="t.filtros.responsavel"
    >
      <template v-if="filtros.responsaveis.length > 1" #default>
        <span class="truncate">{{ t.filtros.responsavelSelecionados(filtros.responsaveis.length) }}</span>
      </template>
    </USelectMenu>

    <USelectMenu
      v-model="filtros.categorias"
      :items="opcoesDeCategoria"
      value-key="value"
      multiple
      variant="ghost"
      icon="i-lucide-layout-grid"
      :placeholder="t.filtros.categoriaVazio"
      :search-input="false"
      class="min-w-44 data-[state=open]:bg-elevated"
      :ui="{ trailingIcon: girar, placeholder: 'text-default' }"
      :aria-label="t.filtros.categoria"
    >
      <template v-if="filtros.categorias.length > 1" #default>
        <span class="truncate">{{ t.filtros.categoriaSelecionadas(filtros.categorias.length) }}</span>
      </template>
    </USelectMenu>

    <Transition enter-active-class="transition duration-150" enter-from-class="opacity-0 -translate-x-1" leave-active-class="transition duration-100" leave-to-class="opacity-0">
      <UButton
        v-if="algumFiltro"
        :label="t.filtros.limpar"
        icon="i-lucide-x"
        color="neutral"
        variant="link"
        size="sm"
        @click="limpar"
      />
    </Transition>
  </div>
</template>
