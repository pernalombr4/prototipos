<script setup lang="ts">
/**
 * Os 3 widgets do grupo Spaceflow (rodada 9). A redatora: "adicione tambem
 * widgets de spaceflow: erros em fluxos é um deles. em vez de ser só erro nos
 * agentes, faça algo similar pra mostrar falhas dos fluxos em geral. e outros
 * status que voce achar interessantes de trazer aí."
 *
 * - Execuções dos fluxos: as execuções dos últimos 7 dias por status (em
 *   andamento, concluídas, com erro, canceladas) e quantas das terminadas
 *   foram concluídas. Dado: `GET /workflows/metrics?startDate&endDate`, que
 *   conta `workflow_executions` por status (enlighten-api@develop b693d8d2b
 *   `plugins/en-workflows/services/workflows/metrics.ts:12-34`);
 * - Falhas nos fluxos: a execução com `status` error, o passo que falhou, a
 *   mensagem e Repetir (`PUT /workflows/nodes/:id/retry`). Vale para qualquer
 *   passo, não só o de agente: o tipo do nó fica dentro do JSON `node`, sem
 *   coluna para filtrar (`plugins/en-workflows/models/node-executions.settings.json:40-42`);
 * - Fluxos em andamento: a execução com `status` working, a mais antiga
 *   primeiro, com o passo em que espera (aprovação, assinatura, tarefa,
 *   formulário, espera). Parada há mais de 2 dias leva o aviso.
 *
 * O clique na linha abre a execução no Spaceflow, a tela que develop já tem
 * (en-space@develop be2a5d850
 * `src/pages/workspaces/[workspace]/workflows/[workflow]/executions/[execution].vue`).
 *
 * Componentes: `UScrollArea`, `UButton`, `UTooltip`, `UIcon`, `UBadge` (MCP nuxt-ui).
 */
import type { ExecucaoDeFluxo, TipoDeNo } from './mocks'
import { AGORA } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tipo: 'execucoesFluxos' | 'falhasFluxos' | 'fluxosAndamento'
  execucoes: ExecucaoDeFluxo[]
  metricas: Record<'working' | 'completed' | 'error' | 'canceled', number>
}>()
const emit = defineEmits<{
  abrir: [destino: string]
  repetir: [execucao: ExecucaoDeFluxo]
}>()

const ICONE: Record<TipoDeNo, string> = {
  approval: 'i-lucide-stamp',
  signature: 'i-lucide-signature',
  task: 'i-lucide-list-checks',
  form: 'i-lucide-clipboard-pen',
  delay: 'i-lucide-timer',
  http: 'i-lucide-globe',
  email: 'i-lucide-mail',
  ai_agent: 'i-lucide-bot',
  crud: 'i-lucide-file-text',
}

const tempo = computed(() => new Intl.RelativeTimeFormat(props.t.locale, { numeric: 'auto', style: 'short' }))
function ha(em: number) {
  const min = Math.round((em - AGORA.getTime()) / 60_000)
  if (Math.abs(min) < 60) return tempo.value.format(min, 'minute')
  const h = Math.round(min / 60)
  if (Math.abs(h) < 24) return tempo.value.format(h, 'hour')
  return tempo.value.format(Math.round(h / 24), 'day')
}

const falhas = computed(() => props.execucoes.filter(e => e.status === 'error').sort((a, b) => (b.em ?? b.inicio) - (a.em ?? a.inicio)))
const emAndamento = computed(() => props.execucoes.filter(e => e.status === 'working').sort((a, b) => a.inicio - b.inicio))
const parado = (e: ExecucaoDeFluxo) => AGORA.getTime() - e.inicio > 2 * 24 * 60 * 60_000

/* Números */
const ORDEM = ['working', 'completed', 'error', 'canceled'] as const
const COR = { working: 'text-info', completed: 'text-success', error: 'text-error', canceled: 'text-muted' } as const
const BARRA = { working: 'bg-info', completed: 'bg-success', error: 'bg-error', canceled: 'bg-inverted/30' } as const
const total = computed(() => ORDEM.reduce((s, k) => s + props.metricas[k], 0))
const terminadas = computed(() => props.metricas.completed + props.metricas.error + props.metricas.canceled)
const sucesso = computed(() => terminadas.value ? Math.round(props.metricas.completed / terminadas.value * 100) : 0)
const fmt = computed(() => new Intl.NumberFormat(props.t.locale))
</script>

<template>
  <!-- Execuções dos fluxos -->
  <div v-if="tipo === 'execucoesFluxos'" class="flex min-h-0 flex-1 flex-col justify-center gap-3 px-4 pb-4">
    <p v-if="!total" class="text-center text-sm text-muted">
      {{ t.spaceflowW.vazioExecucoes }}
    </p>
    <template v-else>
      <dl class="grid grid-cols-4 gap-2">
        <div v-for="(k, i) in ORDEM" :key="k" class="min-w-0 animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none" :style="{ animationDelay: `${i * 40}ms` }">
          <dt class="truncate text-xs text-muted" :title="t.spaceflowW.status[k]">
            {{ t.spaceflowW.status[k] }}
          </dt>
          <dd class="text-xl font-semibold tabular-nums" :class="metricas[k] ? COR[k] : 'text-highlighted'">
            {{ fmt.format(metricas[k]) }}
          </dd>
        </div>
      </dl>
      <div>
        <!-- A barra empilhada: a proporção de cada status no período. -->
        <div class="flex h-2 overflow-hidden rounded-full bg-elevated" role="img" :aria-label="t.spaceflowW.sucesso(sucesso)">
          <span
            v-for="k in ORDEM"
            :key="k"
            class="h-full origin-left animate-[home-crescer-x_0.5s_ease-out_both] motion-reduce:animate-none"
            :class="BARRA[k]"
            :style="{ width: `${metricas[k] / total * 100}%` }"
          />
        </div>
        <p class="mt-1.5 text-xs text-muted">
          {{ t.spaceflowW.sucesso(sucesso) }}
        </p>
      </div>
    </template>
  </div>

  <!-- Falhas nos fluxos e Fluxos em andamento -->
  <UScrollArea v-else class="min-h-0 flex-1">
    <ul v-if="(tipo === 'falhasFluxos' ? falhas : emAndamento).length" class="px-2 pb-2">
      <li
        v-for="(e, i) in (tipo === 'falhasFluxos' ? falhas : emAndamento)"
        :key="e.id"
        class="group/linha flex animate-[entrada_0.3s_ease-out_both] items-start gap-1 rounded-md transition-colors hover:bg-elevated motion-reduce:animate-none"
        :style="{ animationDelay: `${i * 30}ms` }"
      >
        <button
          type="button"
          class="flex min-w-0 flex-1 items-start gap-3 rounded-md px-2 py-2 text-left focus-visible:outline-2 focus-visible:outline-primary"
          :aria-label="`${t.spaceflowW.abrirExecucao}: ${e.fluxo}`"
          @click="emit('abrir', `${t.spaceflowW.abrirExecucao}: ${e.fluxo}`)"
        >
          <UTooltip :text="t.spaceflowW.tipos[e.passo.tipo]">
            <span
              class="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md ring ring-inset"
              :class="tipo === 'falhasFluxos' ? 'bg-error/10 text-error ring-error/25' : parado(e) ? 'bg-warning/10 text-warning ring-warning/25' : 'bg-info/10 text-info ring-info/25'"
            >
              <UIcon :name="ICONE[e.passo.tipo]" class="size-3.5" />
            </span>
          </UTooltip>
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-1.5">
              <span class="truncate text-sm font-medium text-highlighted">{{ e.fluxo }}</span>
              <span v-if="e.item" class="shrink-0 text-xs text-muted">{{ e.item }}</span>
            </span>
            <span class="block truncate text-xs text-toned">
              {{ tipo === 'falhasFluxos' ? t.spaceflowW.falhouEm(e.passo.nome) : t.spaceflowW.aguarda(e.passo.nome) }}
            </span>
            <span v-if="tipo === 'falhasFluxos' && e.erro" class="line-clamp-1 text-xs text-error-700 dark:text-error-300" :title="e.erro">{{ e.erro }}</span>
            <span class="flex items-center gap-1.5 text-xs text-muted">
              {{ tipo === 'falhasFluxos' ? ha(e.em ?? e.inicio) : t.spaceflowW.ha(ha(e.inicio)) }}
              <UBadge v-if="tipo === 'fluxosAndamento' && parado(e)" :label="t.spaceflowW.parado" color="warning" variant="subtle" size="sm" />
            </span>
          </span>
        </button>
        <UButton
          v-if="tipo === 'falhasFluxos'"
          :label="t.spaceflowW.repetir"
          icon="i-lucide-rotate-cw"
          color="neutral"
          variant="outline"
          size="xs"
          class="mr-2 mt-2.5 shrink-0"
          @click="emit('repetir', e)"
        />
      </li>
    </ul>
    <p v-else class="px-4 py-8 text-center text-sm text-muted">
      {{ tipo === 'falhasFluxos' ? t.spaceflowW.vazioFalhas : t.spaceflowW.vazioAndamento }}
    </p>
  </UScrollArea>
</template>
