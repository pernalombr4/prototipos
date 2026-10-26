<script setup lang="ts">
/**
 * PROPOSTA: Jurídico › Prazos. Todos os prazos confirmados, com o fatal e o interno calculados pelo motor.
 *
 * A tela é a lista de registros do ENSPACE, sem jeito próprio: a mesma barra de visualizações, a mesma barra de
 * ferramentas, o `EnTable` com seleção, ações e paginação. O módulo instala 3 visualizações, como as de uma
 * categoria: Em aberto (tabela), Calendário (a grade da Agenda) e Cumpridos (tabela). A pessoa escolhe entre lista
 * e calendário pela barra, e cria outras pelo "+ Visualizar".
 *
 * O prazo é a tarefa que já existe (`Task`, vencimento no prazo interno), então ele também aparece na Agenda.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Prazo } from './mocks'
import { HOJE, pessoaPorId, processoPorId, regraPorId, tribunais } from './mocks'
import { diferencaEmDias } from './prazos'
import { calcularPrazo, cumprir, estado } from './estado'
import type { Faixa } from './agenda'
import { eventosDosPrazos, faixaDoPrazo, prazoDoEvento } from './agenda'
import type { Textos } from './textos'
import { dia, semana } from './formato'
import BarraDaLista from './_BarraDaLista.vue'
import Calendario from './_Calendario.vue'
import PainelDoPrazo from './_PainelDoPrazo.vue'

const props = defineProps<{ t: Textos, carregando?: boolean, vazio?: boolean }>()
const emit = defineEmits<{ abrirProcesso: [number] }>()
const toast = useToast()
const idioma = useIdioma()

type Vista = 'abertos' | 'calendario' | 'cumpridos'
const vista = ref<Vista>('abertos')
const busca = ref('')

interface Linha extends Record<string, unknown> { id: number, p: Prazo, fatal: string, interno: string, faixa: Faixa }

const base = computed(() => (props.vazio ? [] : estado.prazos))
const todas = computed<Linha[]>(() => base.value.map((p) => {
  const c = calcularPrazo(p)
  return { id: p.id, p, fatal: c.fatal, interno: c.interno, faixa: faixaDoPrazo(p) }
}).filter((l) => {
  const q = busca.value.trim().toLowerCase()
  if (!q) return true
  const proc = processoPorId.get(l.p.processo)
  return [proc?.titulo, proc?.reference, regraPorId.get(l.p.entrada.regra)?.ato].some(x => x?.toLowerCase().includes(q))
}))

const linhas = computed(() => todas.value
  .filter(l => (vista.value === 'cumpridos' ? l.faixa === 'cumpridos' : l.faixa !== 'cumpridos'))
  .sort((a, b) => (a.fatal < b.fatal ? -1 : 1)))

const vistas = computed(() => [
  { chave: 'abertos', rotulo: props.t.prazos.vistas.abertos, icone: 'i-lucide-table' },
  { chave: 'calendario', rotulo: props.t.prazos.vistas.calendario, icone: 'i-lucide-calendar-days' },
  { chave: 'cumpridos', rotulo: props.t.prazos.vistas.cumpridos, icone: 'i-lucide-table' },
])

const corDaFaixa: Record<Faixa, 'error' | 'warning' | 'primary' | 'neutral' | 'success'> = { atrasado: 'error', hoje: 'warning', semana: 'primary', proximos: 'neutral', cumpridos: 'success' }

const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.prazos.colunas
  return [
    { key: 'fatal', label: c.fatal },
    { key: 'interno', label: c.interno },
    { key: 'situacao', label: c.situacao },
    { key: 'processo', label: c.processo },
    { key: 'ato', label: c.ato },
    { key: 'responsavel', label: c.responsavel },
  ]
})

/* ---------- detalhe e ações ---------- */
const abertoId = ref<number | undefined>()

function alternar(p: Prazo) {
  cumprir(p)
  if (p.status === 'completed') toast.add({ title: props.t.prazos.cumpridoToast, icon: 'i-lucide-circle-check', color: 'success' })
}

function menuDaLinha(l: Linha): DropdownMenuItem[][] {
  return [[
    { label: props.t.lista.verDetalhes, icon: 'i-lucide-eye', onSelect: () => { abertoId.value = l.id } },
    { label: l.p.status === 'completed' ? props.t.prazos.reabrir : props.t.prazos.cumprir, icon: l.p.status === 'completed' ? 'i-lucide-rotate-ccw' : 'i-lucide-check', onSelect: () => alternar(l.p) },
    { label: props.t.prazos.abrirProcesso, icon: 'i-lucide-arrow-up-right', onSelect: () => emit('abrirProcesso', l.p.processo) },
  ]]
}

/* ---------- calendário ---------- */
const eventos = computed(() => eventosDosPrazos(props.t, base.value))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <BarraDaLista v-model:ativa="vista" v-model:busca="busca" :t="t" :vistas="vistas" :pesquisar="t.prazos.pesquisar" />

    <div class="min-h-0 flex-1 overflow-y-auto">
      <!-- Calendário: a grade da Agenda -->
      <div v-if="vista === 'calendario'" class="animate-[entrada_.25s_ease-out] p-4">
        <p class="mb-3 flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-info" class="size-3.5" />
          {{ t.agenda.legenda }}
        </p>
        <Calendario :t="t" :eventos="eventos" @abrir="(e) => { abertoId = prazoDoEvento(e) }" />
      </div>

      <!-- Lista -->
      <div v-else :key="vista" class="animate-[entrada_.25s_ease-out]">
        <EnTable
          :columns="colunas"
          :rows="linhas"
          :loading="carregando"
          selectable
          :pagination="{ page: 1, pageCount: 1, total: linhas.length }"
          :locale="idioma"
          :empty-state="{ icon: 'i-lucide-alarm-clock-check', title: t.prazos.vazio.titulo, description: t.prazos.vazio.desc }"
          class="[&_tbody_tr]:cursor-pointer"
          @row-click="(r) => { abertoId = (r as Linha).id }"
        >
          <template #cell-fatal="{ row }">
            <span class="flex flex-col py-1">
              <span class="text-sm font-semibold tabular-nums" :class="(row as Linha).fatal === HOJE && (row as Linha).faixa !== 'cumpridos' ? 'text-error' : 'text-highlighted'">
                {{ dia((row as Linha).fatal, t.locale) }}
              </span>
              <span class="text-xs text-muted">{{ semana((row as Linha).fatal, t.locale) }} · {{ t.geral.emDias(diferencaEmDias(HOJE, (row as Linha).fatal)) }}</span>
            </span>
          </template>
          <template #cell-interno="{ row }">
            <span class="flex items-center gap-1.5">
              <span class="text-sm tabular-nums text-toned">{{ dia((row as Linha).interno, t.locale) }}</span>
              <UBadge v-if="(row as Linha).p.historico.length" :label="t.prazos.recalculado" icon="i-lucide-history" color="warning" variant="outline" size="sm" />
            </span>
          </template>
          <template #cell-situacao="{ row }">
            <UBadge :label="t.prazos.grupos[(row as Linha).faixa]" :color="corDaFaixa[(row as Linha).faixa]" variant="subtle" size="sm" />
          </template>
          <template #cell-processo="{ row }">
            <span class="flex min-w-0 flex-col py-1">
              <span class="max-w-72 truncate text-sm text-highlighted">{{ processoPorId.get((row as Linha).p.processo)?.titulo }}</span>
              <span class="text-xs text-muted">
                {{ processoPorId.get((row as Linha).p.processo)?.reference }} · {{ tribunais[processoPorId.get((row as Linha).p.processo)!.data.tribunal].sigla }}
              </span>
            </span>
          </template>
          <template #cell-ato="{ row }">
            <span class="flex flex-col">
              <span class="text-sm text-highlighted">{{ regraPorId.get((row as Linha).p.entrada.regra)?.ato }}</span>
              <span class="text-xs text-muted">{{ t.prazoDaRegra(regraPorId.get((row as Linha).p.entrada.regra)!) }}</span>
            </span>
          </template>
          <template #cell-responsavel="{ row }">
            <span class="flex items-center gap-2">
              <UAvatar :text="pessoaPorId.get((row as Linha).p.assigned_to as number)?.iniciais" size="2xs" />
              <span class="truncate text-sm text-toned">{{ pessoaPorId.get((row as Linha).p.assigned_to as number)?.nome }}</span>
            </span>
          </template>
          <template #actions="{ row }">
            <UDropdownMenu :items="menuDaLinha(row as Linha)" :content="{ align: 'start' }" :ui="{ content: 'w-60' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.lista.acoes" @click.stop />
            </UDropdownMenu>
          </template>
        </EnTable>
      </div>
    </div>

    <PainelDoPrazo v-model:prazo="abertoId" :t="t" @abrir-processo="(id) => emit('abrirProcesso', id)" />
  </div>
</template>
