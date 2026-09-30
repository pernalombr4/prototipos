<script setup lang="ts">
/**
 * Tempo por tarefa: da criação à conclusão, agrupado pelo "tipo" da tarefa.
 *
 * Tarefa criada por fluxo tem tipo: o nome da tarefa de etapa (agendadas) ou do
 * nó do Spaceflow. Tarefa criada manualmente tem nome livre, que não agrupa
 * nada: vira uma linha só. Nas agendadas com "Habilitar Atribuição", o tempo se
 * divide em espera e execução pelo `task_log`.
 *
 * Rolagem infinita dentro do painel (rodada 2), no lugar do "Mostrar os N".
 */
import type { EnTableColumn, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import type { TempoDaTarefa } from './metricas'
import type { Textos } from './textos'
import Sentinela from './_Sentinela.vue'
import { duracao, numero } from './formatar'

const props = defineProps<{
  t: Textos
  tarefas: TempoDaTarefa[]
}>()

const emit = defineEmits<{ abrir: [linha: TempoDaTarefa] }>()

const ordem = ref<EnTableSort>({ key: 'mediana', direction: 'desc' })
const larguras = ref<Record<string, number>>({ nome: 300, mediana: 210 })

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'nome', label: props.t.tempos.tarefa, sortable: true },
  { key: 'n', label: props.t.tempos.n, sortable: true, align: 'right' },
  { key: 'mediana', label: props.t.tempos.mediana, sortable: true },
  { key: 'media', label: props.t.tempos.media, sortable: true, align: 'right' },
  { key: 'p90', label: props.t.tempos.p90, sortable: true, align: 'right' },
  { key: 'divisao', label: `${props.t.tempos.espera} · ${props.t.tempos.execucao}`, align: 'right' },
])

const LOTE = 8
const visiveis = ref(LOTE)
watch([() => props.tarefas, ordem], () => { visiveis.value = LOTE })

const maiorMediana = computed(() => Math.max(1, ...props.tarefas.map(x => x.estat.mediana)))

type Linha = Record<string, unknown> & TempoDaTarefa & { nomeExibido: string, n: number, media: number, mediana: number, p90: number }

const linhas = computed(() => {
  const { key, direction } = ordem.value
  const sinal = direction === 'asc' ? 1 : -1
  return props.tarefas
    .map(x => ({
      ...x,
      nomeExibido: x.nome === '__avulsa' ? props.t.tempos.avulsa : x.nome,
      n: x.estat.n,
      media: x.estat.media,
      mediana: x.estat.mediana,
      p90: x.estat.p90,
    }))
    .sort((a, b) => {
      if (key === 'nome') return a.nomeExibido.localeCompare(b.nomeExibido) * sinal
      return ((a[key as 'n'] as number) - (b[key as 'n'] as number)) * sinal
    }) as Linha[]
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <UScrollArea data-rolagem class="min-h-0 flex-1 border-t border-default">
      <EnTable
        :columns="colunas"
        :rows="linhas.slice(0, visiveis)"
        :sort="ordem"
        resizable
        v-model:column-sizing="larguras"
        :empty-state="{ icon: 'i-lucide-timer-off', title: t.tempos.semDados }"
        @sort-change="ordem = $event"
        @row-click="emit('abrir', $event as unknown as TempoDaTarefa)"
      >
        <template #cell-nome="{ row }">
          <span class="block min-w-0">
            <span class="block max-w-72 truncate text-highlighted">{{ (row as Linha).nomeExibido }}</span>
            <span class="flex items-center gap-1.5 text-xs text-muted">
              <UBadge :label="t.origemCurta[(row as Linha).origem]" color="neutral" variant="soft" size="sm" />
              <span v-if="(row as Linha).fluxo" class="truncate">{{ (row as Linha).fluxo }}</span>
            </span>
          </span>
        </template>
        <template #cell-n="{ value }">
          <span class="tabular-nums">{{ numero(value as number, t) }}</span>
        </template>
        <template #cell-mediana="{ value }">
          <span class="flex min-w-36 items-center gap-2">
            <UProgress :model-value="value as number" :max="maiorMediana" size="sm" color="primary" class="w-20" />
            <span class="tabular-nums font-medium text-highlighted">{{ duracao(value as number, t) }}</span>
          </span>
        </template>
        <template #cell-media="{ value }">
          <span class="tabular-nums text-toned">{{ duracao(value as number, t) }}</span>
        </template>
        <template #cell-p90="{ value }">
          <span class="tabular-nums text-toned">{{ duracao(value as number, t) }}</span>
        </template>
        <template #cell-divisao="{ row }">
          <span v-if="(row as Linha).espera !== null" class="tabular-nums text-toned">
            {{ duracao((row as Linha).espera, t) }} · {{ duracao((row as Linha).execucao, t) }}
          </span>
          <span v-else class="text-dimmed">-</span>
        </template>
      </EnTable>
      <Sentinela v-if="linhas.length" :t="t" :tem-mais="visiveis < linhas.length" :total="linhas.length" @mais="visiveis += LOTE" />
    </UScrollArea>
    <p class="flex gap-2 border-t border-default px-4 py-2 text-xs text-muted">
      <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
      <span class="line-clamp-2">{{ t.tempos.esperaExecucaoAjuda }}</span>
    </p>
  </div>
</template>
