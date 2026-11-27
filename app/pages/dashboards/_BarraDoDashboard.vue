<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): a barra do dashboard. Substitui a de "campo comum" da rodada 1.
 *
 * - Período: o `EnDashboardPeriodPicker` do SDK, o mesmo do painel de tarefas.
 * - Filtro de campo: o chip do protótipo de visualizações da tela de itens. O "+ Filtro"
 *   lista os campos agrupados pela categoria. Todo campo é de 1 categoria, então o
 *   filtro vale só nos painéis dela; os outros painéis seguem sem ele.
 * - Visões salvas, como o segmento do Clarity: período e filtros num nome, para voltar
 *   depois. "Só para mim" sempre; "Todo o workspace" só para owner e full.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { FiltroDeCampo, Periodo } from './agregacao'
import type { Visao } from './dashboards'
import type { Textos } from './textos'
import ListaDeFiltros from './_ListaDeFiltros.vue'

const props = defineProps<{
  t: Textos
  categorias: string[]
  visoes: Visao[]
  visaoAtual: Visao | null
  /** O recorte de agora difere da visão aplicada. */
  alterada: boolean
  /** Owner e full salvam para o workspace e mudam a visão do workspace. */
  podeSalvarParaTodos: boolean
  /** Há filtro posto pelo ícone de filtro de algum painel. */
  temFiltroDePainel?: boolean
}>()

const periodo = defineModel<Periodo>('periodo', { required: true })
const filtros = defineModel<FiltroDeCampo[]>('filtros', { required: true })
const emit = defineEmits<{
  aplicar: [visao: Visao | null]
  salvarNova: []
  atualizar: []
  excluir: [visao: Visao]
  limpar: []
}>()

const minhas = computed(() => props.visoes.filter(v => v.escopo === 'eu'))
const doWorkspace = computed(() => props.visoes.filter(v => v.escopo === 'workspace'))
const podeMudarAtual = computed(() => !!props.visaoAtual && (props.visaoAtual.escopo === 'eu' || props.podeSalvarParaTodos))

const menu = computed<DropdownMenuItem[][]>(() => {
  const item = (v: Visao): DropdownMenuItem => ({
    label: v.nome,
    icon: v.id === props.visaoAtual?.id ? 'i-lucide-check' : (v.escopo === 'eu' ? 'i-lucide-user-round' : 'i-lucide-users'),
    onSelect: () => emit('aplicar', v),
  })
  const grupos: DropdownMenuItem[][] = [[{ label: props.t.visoes.semVisao, icon: !props.visaoAtual ? 'i-lucide-check' : 'i-lucide-circle-dashed', onSelect: () => emit('aplicar', null) }]]
  if (minhas.value.length) grupos.push([{ type: 'label', label: props.t.visoes.minhas }, ...minhas.value.map(item)])
  if (doWorkspace.value.length) grupos.push([{ type: 'label', label: props.t.visoes.doWorkspace }, ...doWorkspace.value.map(item)])
  const acoes: DropdownMenuItem[] = [{ label: props.t.visoes.salvarNova, icon: 'i-lucide-bookmark-plus', onSelect: () => emit('salvarNova') }]
  if (props.visaoAtual && podeMudarAtual.value) {
    acoes.push({ label: props.t.visoes.excluir(props.visaoAtual.nome), icon: 'i-lucide-trash-2', color: 'error', onSelect: () => emit('excluir', props.visaoAtual!) })
  }
  grupos.push(acoes)
  return grupos
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-2 gap-y-1.5">
    <EnDashboardPeriodPicker
      v-model="(periodo as any)"
      :presets="['7d', '30d', '90d', 'month', 'quarter', 'year']"
      custom
      size="sm"
      :locale="(t.locale as any)"
    />

    <span class="mx-0.5 hidden h-4 w-px bg-accented sm:block" aria-hidden="true" />

    <ListaDeFiltros v-model="filtros" :t="t" :categorias="categorias" :ajuda="t.filtro.ajudaDoDashboard" />

    <UButton v-if="filtros.length" :label="t.filtro.limpar" color="neutral" variant="link" size="xs" @click="emit('limpar')" />

    <!-- Visões salvas: à direita da barra -->
    <div class="ml-auto flex items-center gap-1.5">
      <Transition
        enter-active-class="transition duration-150 ease-out motion-reduce:transition-none"
        enter-from-class="opacity-0 translate-x-1"
        leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
        leave-to-class="opacity-0"
      >
        <UButton
          v-if="visaoAtual && alterada && podeMudarAtual"
          :label="t.visoes.salvarAlteracoes"
          icon="i-lucide-save"
          color="primary"
          variant="soft"
          size="xs"
          @click="emit('atualizar')"
        />
        <UButton
          v-else-if="!visaoAtual && (filtros.length || temFiltroDePainel)"
          :label="t.visoes.salvar"
          icon="i-lucide-bookmark-plus"
          color="neutral"
          variant="outline"
          size="xs"
          @click="emit('salvarNova')"
        />
      </Transition>
      <UDropdownMenu :items="menu" :content="{ align: 'end' }" :ui="{ content: 'min-w-64' }">
        <UButton
          color="neutral"
          variant="outline"
          size="xs"
          :icon="visaoAtual?.escopo === 'workspace' ? 'i-lucide-users' : 'i-lucide-bookmark'"
          trailing-icon="i-lucide-chevron-down"
          :aria-label="t.visoes.rotulo"
        >
          <span class="max-w-44 truncate">{{ visaoAtual?.nome ?? t.visoes.rotulo }}</span>
          <span v-if="visaoAtual && alterada" class="text-xs text-muted">{{ t.visoes.alterada }}</span>
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>
