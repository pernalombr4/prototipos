<script setup lang="ts">
/**
 * Status e substatus, os 2 virtuais.
 *
 * Status: o vocabulário único para as 2 telas (Pendente e Aguardando viram
 * "Não iniciada", e assim por diante). Substatus: a situação do prazo daquele
 * status. É o par "categoria e status" que Notion, ClickUp, Linear e Jira usam,
 * com uma diferença: nenhum deles abre a categoria em substatus no painel.
 */
import type { LinhaDeStatus, Situacao, StatusVirtual } from './metricas'
import type { Textos } from './textos'
import { numero } from './formatar'

const props = defineProps<{
  t: Textos
  linhas: LinhaDeStatus[]
}>()

const emit = defineEmits<{ abrir: [status: StatusVirtual] }>()

const CINZA = 'var(--ui-text-dimmed)'
const cor: Record<Situacao | 'removida', string> = {
  vencida: 'error',
  a_vencer: 'warning',
  no_prazo: 'success',
  sem_prazo: CINZA,
  concluida_no_prazo: 'success',
  atrasada: 'error',
  concluida_sem_prazo: CINZA,
  removida: CINZA,
}

const icone: Record<StatusVirtual, string> = {
  nao_iniciada: 'i-lucide-circle-dashed',
  em_andamento: 'i-lucide-circle-dot',
  bloqueada: 'i-lucide-circle-slash',
  concluida: 'i-lucide-circle-check',
  removida: 'i-lucide-circle-x',
}

const abertas = computed(() => props.linhas.filter(l => ['nao_iniciada', 'em_andamento', 'bloqueada'].includes(l.status)))
const doPeriodo = computed(() => props.linhas.filter(l => l.status === 'concluida' || l.status === 'removida'))
const maior = computed(() => Math.max(1, ...props.linhas.map(l => l.total)))

/** A legenda de cores, uma vez só para o painel inteiro. */
const legenda = computed(() => ([
  ['vencida', props.t.situacao.vencida],
  ['a_vencer', props.t.situacao.a_vencer],
  ['no_prazo', props.t.situacao.no_prazo],
  ['atrasada', props.t.situacao.atrasada],
  ['sem_prazo', props.t.situacao.sem_prazo],
] as [Situacao, string][]))

/** Ordem dos segmentos: o que mais pede atenção primeiro. */
const ORDEM: (Situacao | 'removida')[] = ['vencida', 'atrasada', 'a_vencer', 'no_prazo', 'concluida_no_prazo', 'sem_prazo', 'concluida_sem_prazo', 'removida']

function segmentos(l: LinhaDeStatus) {
  return [...l.partes]
    .sort((a, b) => ORDEM.indexOf(a.situacao) - ORDEM.indexOf(b.situacao))
    .filter(p => p.n > 0)
    .map(p => ({
      value: p.n,
      color: cor[p.situacao],
      label: p.situacao === 'removida' ? props.t.situacao.removida : props.t.situacao[p.situacao],
    }))
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <UScrollArea data-rolagem class="min-h-0 flex-1 px-4 pb-3 pt-2" :ui="{ viewport: 'gap-4' }">
      <section v-for="(grupo, gi) in [{ titulo: t.statusBloco.abertasAgora, linhas: abertas }, { titulo: t.statusBloco.noPeriodo, linhas: doPeriodo }]" :key="gi" class="space-y-0.5">
        <h3 class="text-xs font-medium uppercase tracking-wide text-muted">
          {{ grupo.titulo }}
        </h3>
        <button
          v-for="l in grupo.linhas"
          :key="l.status"
          type="button"
          class="-mx-2 grid w-[calc(100%+1rem)] grid-cols-[minmax(0,9rem)_1fr_3rem] items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default disabled:hover:bg-transparent"
          :disabled="!l.total"
          :title="t.statusOrigem[l.status]"
          @click="emit('abrir', l.status)"
        >
          <span class="flex min-w-0 items-center gap-2 text-sm">
            <UIcon :name="icone[l.status]" class="size-4 shrink-0 text-muted" />
            <span class="truncate text-toned">{{ t.status[l.status] }}</span>
          </span>
          <!-- A largura da barra é o tamanho do status; os segmentos, o prazo. -->
          <span class="block min-w-0">
            <UProgressGroup
              v-if="l.total"
              :items="segmentos(l)"
              :max="l.total"
              size="md"
              :ui="{ list: 'hidden' }"
              class="transition-[width] duration-300"
              :style="{ width: `${Math.max(4, (l.total / maior) * 100)}%` }"
            />
            <span v-else class="block h-2 w-1 rounded-full bg-elevated" />
          </span>
          <span class="text-right text-sm font-semibold tabular-nums text-highlighted">{{ numero(l.total, t) }}</span>
        </button>
      </section>
    </UScrollArea>
    <ul class="flex flex-wrap gap-x-4 gap-y-1 border-t border-default px-4 py-2.5 text-xs text-muted">
      <li v-for="[s, rotulo] in legenda" :key="s" class="flex items-center gap-1.5">
        <span
          class="size-2 rounded-full"
          :class="{ 'bg-success': cor[s] === 'success', 'bg-warning': cor[s] === 'warning', 'bg-error': cor[s] === 'error' }"
          :style="cor[s] === CINZA ? { backgroundColor: CINZA } : undefined"
        />
        {{ rotulo }}
      </li>
    </ul>
  </div>
</template>
