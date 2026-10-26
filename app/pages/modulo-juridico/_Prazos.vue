<script setup lang="ts">
/**
 * PROPOSTA: Jurídico › Prazos. Todos os prazos confirmados, com o fatal e o interno calculados pelo motor.
 *
 * O prazo é a tarefa que já existe (`Task`, vencimento no prazo interno). O que o módulo acrescenta: o prazo fatal,
 * a regra, a memória do cálculo e o histórico de recálculo quando o calendário do tribunal muda.
 * A lista é o `EnTable` do SDK; a situação vira chips de filtro no topo, que dizem quantos prazos há em cada faixa.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Prazo } from './mocks'
import { EU, HOJE, pessoaPorId, processoPorId, regraPorId, tribunais } from './mocks'
import { diferencaEmDias } from './prazos'
import { calcularPrazo, cumprir, estado } from './estado'
import type { Textos } from './textos'
import { dataHora, dia, semana } from './formato'
import MemoriaDoCalculo from './_MemoriaDoCalculo.vue'

const props = defineProps<{ t: Textos, carregando?: boolean, vazio?: boolean }>()
const emit = defineEmits<{ abrirProcesso: [number] }>()
const toast = useToast()
const idioma = useIdioma()

type Faixa = 'atrasado' | 'hoje' | 'semana' | 'proximos' | 'cumpridos'
const SEXTA = '2026-10-30'

const quem = ref<'meus' | 'todos'>('todos')
const faixa = ref<Faixa | 'abertos'>('abertos')

interface Linha { p: Prazo, fatal: string, interno: string, faixa: Faixa }

const todas = computed<Linha[]>(() => (props.vazio ? [] : estado.prazos).map((p) => {
  const c = calcularPrazo(p)
  let f: Faixa = 'proximos'
  if (p.status === 'completed') f = 'cumpridos'
  else if (c.fatal === HOJE || c.interno === HOJE) f = 'hoje'
  else if (c.interno < HOJE) f = 'atrasado'
  else if (c.interno <= SEXTA) f = 'semana'
  return { p, fatal: c.fatal, interno: c.interno, faixa: f }
}).filter(l => quem.value === 'todos' || l.p.assigned_to === EU))

const linhas = computed(() => todas.value
  .filter(l => (faixa.value === 'abertos' ? l.faixa !== 'cumpridos' : l.faixa === faixa.value))
  .sort((a, b) => (a.fatal < b.fatal ? -1 : 1)))

const chips = computed(() => (['atrasado', 'hoje', 'semana', 'proximos', 'cumpridos'] as Faixa[]).map(f => ({ f, n: todas.value.filter(l => l.faixa === f).length })))
const corDaFaixa: Record<Faixa, 'error' | 'warning' | 'primary' | 'neutral' | 'success'> = { atrasado: 'error', hoje: 'warning', semana: 'primary', proximos: 'neutral', cumpridos: 'success' }

const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.prazos.colunas
  return [
    { key: 'fatal', label: c.fatal },
    { key: 'interno', label: c.interno },
    { key: 'processo', label: c.processo },
    { key: 'ato', label: c.ato },
    { key: 'responsavel', label: c.responsavel },
    { key: 'acoes', label: '' },
  ]
})

/* ---------- detalhe ---------- */
const abertoId = ref<number | undefined>()
const aberto = computed(() => estado.prazos.find(p => p.id === abertoId.value))
const calculoAberto = computed(() => (aberto.value ? calcularPrazo(aberto.value) : undefined))
const detalheAberto = computed({ get: () => abertoId.value !== undefined, set: (v) => { if (!v) abertoId.value = undefined } })

function alternar(p: Prazo) {
  cumprir(p)
  if (p.status === 'completed') toast.add({ title: props.t.prazos.cumpridoToast, icon: 'i-lucide-circle-check', color: 'success' })
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 p-5">
      <div class="flex flex-wrap items-end gap-3">
        <div class="min-w-0 flex-1">
          <h1 class="text-lg font-semibold text-highlighted">{{ t.prazos.titulo }}</h1>
          <p class="text-sm text-muted">{{ t.prazos.descricao }}</p>
        </div>
        <div class="inline-flex rounded-md border border-default p-0.5" role="radiogroup">
          <UButton
            v-for="q in (['todos', 'meus'] as const)"
            :key="q"
            :label="t.prazos.filtros[q]"
            size="xs"
            :color="quem === q ? 'primary' : 'neutral'"
            :variant="quem === q ? 'soft' : 'ghost'"
            role="radio"
            :aria-checked="quem === q"
            @click="quem = q"
          />
        </div>
      </div>

      <!-- As faixas, como filtro -->
      <div class="flex flex-wrap gap-2">
        <UButton
          :label="t.prazos.situacoes.aberto"
          size="sm"
          :color="faixa === 'abertos' ? 'primary' : 'neutral'"
          :variant="faixa === 'abertos' ? 'soft' : 'outline'"
          @click="faixa = 'abertos'"
        />
        <UButton
          v-for="(c, i) in chips"
          :key="c.f"
          size="sm"
          class="animate-[entrada_.25s_ease-out_both] transition-transform hover:-translate-y-0.5"
          :style="{ animationDelay: `${i * 40}ms` }"
          :color="faixa === c.f ? corDaFaixa[c.f] : 'neutral'"
          :variant="faixa === c.f ? 'soft' : 'outline'"
          @click="faixa = c.f"
        >
          {{ t.prazos.grupos[c.f] }}
          <UBadge :label="String(c.n)" :color="c.n && c.f !== 'proximos' && c.f !== 'cumpridos' ? corDaFaixa[c.f] : 'neutral'" variant="subtle" size="sm" class="tabular-nums" />
        </UButton>
      </div>

      <EnTable
        :columns="colunas"
        :rows="linhas"
        :loading="carregando"
        :locale="idioma"
        :empty-state="{ icon: 'i-lucide-alarm-clock-check', title: t.prazos.vazio.titulo, description: t.prazos.vazio.desc }"
        class="[&_tbody_tr]:cursor-pointer"
        @row-click="(r: Linha) => { abertoId = r.p.id }"
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
            <UBadge v-if="(row as Linha).interno < HOJE && (row as Linha).faixa !== 'cumpridos'" :label="t.prazos.internoVencido" color="error" variant="subtle" size="sm" />
            <UBadge v-if="(row as Linha).p.historico.length" :label="t.prazos.recalculado" icon="i-lucide-history" color="warning" variant="outline" size="sm" />
          </span>
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
        <template #cell-acoes="{ row }">
          <UTooltip :text="(row as Linha).p.status === 'completed' ? t.prazos.reabrir : t.prazos.cumprir">
            <UButton
              :icon="(row as Linha).p.status === 'completed' ? 'i-lucide-rotate-ccw' : 'i-lucide-check'"
              size="xs"
              color="neutral"
              variant="outline"
              :aria-label="(row as Linha).p.status === 'completed' ? t.prazos.reabrir : t.prazos.cumprir"
              @click.stop="alternar((row as Linha).p)"
            />
          </UTooltip>
        </template>
      </EnTable>
    </div>

    <!-- Detalhe do prazo -->
    <USlideover v-model:open="detalheAberto" :title="aberto ? `${regraPorId.get(aberto.entrada.regra)?.ato} · ${processoPorId.get(aberto.processo)?.reference}` : ''" :description="aberto ? processoPorId.get(aberto.processo)?.titulo : ''">
      <template #body>
        <div v-if="aberto && calculoAberto" class="flex flex-col gap-5">
          <MemoriaDoCalculo
            :t="t"
            :calculo="calculoAberto"
            :regra="regraPorId.get(aberto.entrada.regra)!"
            :tribunal="tribunais[processoPorId.get(aberto.processo)!.data.tribunal]"
          />

          <div>
            <p class="mb-2 text-xs font-medium text-muted">{{ t.prazos.historico }}</p>
            <ol class="flex flex-col gap-2 text-sm">
              <li v-for="(h, i) in aberto.historico" :key="i" class="animate-[entrada_.3s_ease-out_both] rounded-md border border-warning/40 bg-warning/5 p-3">
                <p class="font-medium text-highlighted">{{ t.prazos.mudou(dia(h.fatalAntes, t.locale), dia(h.fatalDepois, t.locale)) }}</p>
                <p class="text-xs text-toned">{{ h.motivo }}</p>
                <p class="text-xs text-muted">{{ h.por }} · {{ dataHora(h.quando, t.locale) }}</p>
              </li>
              <li class="rounded-md border border-default p-3 text-xs text-toned">
                {{ t.prazos.confirmado(pessoaPorId.get(aberto.confirmadoPor)?.nome ?? '', dataHora(aberto.confirmadoEm, t.locale)) }}
                <span v-if="!aberto.intimacao" class="block text-muted">{{ t.prazos.origem }}: {{ t.prazos.semIntimacao }}</span>
              </li>
            </ol>
          </div>
        </div>
      </template>
      <template #footer>
        <div v-if="aberto" class="flex w-full justify-end gap-2">
          <UButton :label="t.intimacoes.abrirProcesso" icon="i-lucide-arrow-up-right" color="neutral" variant="outline" @click="() => { const id = aberto!.processo; abertoId = undefined; emit('abrirProcesso', id) }" />
          <UButton :label="aberto.status === 'completed' ? t.prazos.reabrir : t.prazos.cumprir" :icon="aberto.status === 'completed' ? 'i-lucide-rotate-ccw' : 'i-lucide-check'" @click="alternar(aberto)" />
        </div>
      </template>
    </USlideover>
  </div>
</template>
