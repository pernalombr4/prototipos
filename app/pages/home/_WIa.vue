<script setup lang="ts">
/**
 * Os widgets NOVOS do grupo IA (rodada 7). A redatora pediu "uma seçao
 * somente pra IA [...] o beni + funcionalidades de agentes de IA puxadas pra
 * widget, se fizer sentido. nao crie só porque to pedindo. tem que realmente
 * apresentar algum ganho". Entraram os 4 que têm dado no back de develop e
 * poupam um caminho que hoje é longo:
 * - Agentes de IA: hoje se abre a conversa e se troca o agente no seletor do
 *   topo. Aqui, 1 clique abre a conversa já com o agente (`?agent=` da página
 *   de chat). Dado: `GET /ai/agents`;
 * - Revisões por IA: a revisão de contrato roda em fila (pendente, revisando,
 *   concluída, falhou). Aqui se vê o que terminou, a nota e o achado grave.
 *   Dado: `GET /ai/review/sessions` e `/ai/review/stats`;
 * - Créditos de IA (administrador): sem saldo, a IA para no workspace
 *   inteiro (`useAiWalletGate`). Aqui o saldo e quantos dias ele dura no
 *   ritmo atual, calculado do extrato. Dado: `GET /ws/financial/wallet` e o
 *   extrato da carteira;
 * - Falhas de agentes nos fluxos (administrador): o nó de agente do Spaceflow
 *   falha sem ninguém ver. Aqui a falha e "Repetir". Dado: `GET
 *   /workflows/nodes` com status error e `POST /workflows/nodes/:id/retry`.
 *   Falta confirmar no back se a execução de nó filtra pelo tipo do nó.
 *
 * Componentes: `UScrollArea`, `UBadge`, `UButton`, `UTooltip`, `UIcon`
 * (MCP nuxt-ui).
 */
import AvatarDoBeni from './_AvatarDoBeni.vue'
import type { AgenteDeIA, FalhaDeAgente, RevisaoDeIA } from './mocks'
import { AGORA, carteiraDeIA } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tipo: 'agentesIa' | 'revisoesIa' | 'creditosIa' | 'falhasIa'
  agentes: AgenteDeIA[]
  revisoes: RevisaoDeIA[]
  falhas: FalhaDeAgente[]
  admin: boolean
}>()
const emit = defineEmits<{
  conversar: [agente: AgenteDeIA]
  abrir: [destino: string]
  repetir: [falha: FalhaDeAgente]
}>()

const tempo = computed(() => new Intl.RelativeTimeFormat(props.t.locale, { numeric: 'auto', style: 'short' }))
function ha(em: number) {
  const min = Math.round((em - AGORA.getTime()) / 60_000)
  if (Math.abs(min) < 60) return tempo.value.format(min, 'minute')
  const h = Math.round(min / 60)
  if (Math.abs(h) < 24) return tempo.value.format(h, 'hour')
  return tempo.value.format(Math.round(h / 24), 'day')
}

/* Revisões */
const COR_DO_STATUS = { pending: 'neutral', in_progress: 'info', completed: 'success', failed: 'error' } as const
const revisoesOrdenadas = computed(() => [...props.revisoes].sort((a, b) => b.em - a.em))
const numeros = computed(() => {
  const concluidas = props.revisoes.filter(r => r.status === 'completed')
  const media = concluidas.length ? Math.round(concluidas.reduce((s, r) => s + (r.nota ?? 0), 0) / concluidas.length) : 0
  return [
    { rotulo: props.t.iaW.revisoes.concluidas, valor: String(concluidas.length) },
    { rotulo: props.t.iaW.revisoes.emAndamento, valor: String(props.revisoes.filter(r => r.status === 'pending' || r.status === 'in_progress').length) },
    { rotulo: props.t.iaW.revisoes.notaMedia, valor: concluidas.length ? String(media) : '-' },
  ]
})

/* Créditos */
const fmt = computed(() => new Intl.NumberFormat(props.t.locale))
const maxConsumo = Math.max(...carteiraDeIA.consumoPorDia)
const ritmo = carteiraDeIA.consumoPorDia.slice(-7).reduce((s, v) => s + v, 0) / 7
const dias = Math.floor(carteiraDeIA.saldo / ritmo)
</script>

<template>
  <!-- Agentes de IA -->
  <div v-if="tipo === 'agentesIa'" class="flex min-h-0 flex-1 flex-col pb-3">
    <UScrollArea class="min-h-0 flex-1">
      <ul class="px-2">
        <li v-for="(a, i) in agentes" :key="a.slug" class="animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none" :style="{ animationDelay: `${i * 40}ms` }">
          <button
            type="button"
            class="group/agente flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
            :aria-label="t.iaW.agentes.conversar(a.nome)"
            @click="emit('conversar', a)"
          >
            <AvatarDoBeni :cor="a.cor" tamanho="md" />
            <span class="min-w-0 flex-1">
              <span class="flex items-center gap-1.5">
                <span class="truncate text-sm font-medium text-highlighted">{{ a.nome }}</span>
                <UBadge v-if="a.sistema" :label="t.iaW.agentes.sistema" color="neutral" variant="subtle" size="sm" class="shrink-0" />
                <UBadge v-else-if="a.tipo === 'reviewer'" :label="t.iaW.agentes.revisor" color="info" variant="subtle" size="sm" class="shrink-0" />
              </span>
              <span class="line-clamp-2 text-xs leading-snug text-muted">{{ a.descricao }}</span>
            </span>
            <UIcon name="i-lucide-message-circle" class="size-4 shrink-0 text-dimmed transition-colors group-hover/agente:text-primary" />
          </button>
        </li>
      </ul>
    </UScrollArea>
    <UButton v-if="admin" :label="t.iaW.agentes.gerenciar" trailing-icon="i-lucide-arrow-right" color="neutral" variant="ghost" size="xs" class="mx-4 mt-1 self-start" @click="emit('abrir', t.iaW.agentes.gerenciar)" />
  </div>

  <!-- Revisões por IA -->
  <div v-else-if="tipo === 'revisoesIa'" class="flex min-h-0 flex-1 flex-col gap-2 pb-2">
    <p v-if="!revisoes.length" class="flex flex-1 items-center justify-center px-4 text-center text-sm text-muted">
      {{ t.iaW.revisoes.vazio }}
    </p>
    <template v-else>
      <dl class="grid grid-cols-3 gap-2 px-4">
        <div v-for="n in numeros" :key="n.rotulo" class="min-w-0">
          <dd class="text-xl font-semibold tabular-nums text-highlighted">{{ n.valor }}</dd>
          <dt class="truncate text-xs text-muted" :title="n.rotulo">{{ n.rotulo }}</dt>
        </div>
      </dl>
      <UScrollArea class="min-h-0 flex-1">
        <ul class="px-2">
          <li v-for="(r, i) in revisoesOrdenadas" :key="r.id" class="animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none" :style="{ animationDelay: `${i * 30}ms` }">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
              @click="emit('abrir', r.documento)"
            >
              <UIcon
                :name="r.status === 'in_progress' ? 'i-lucide-loader-circle' : r.status === 'failed' ? 'i-lucide-circle-alert' : r.status === 'completed' ? 'i-lucide-file-check' : 'i-lucide-clock'"
                class="size-4 shrink-0"
                :class="[r.status === 'in_progress' ? 'animate-spin text-info motion-reduce:animate-none' : r.status === 'failed' ? 'text-error' : r.status === 'completed' ? 'text-success' : 'text-muted']"
              />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm text-highlighted" :title="r.documento">{{ r.documento }}</span>
                <span class="block truncate text-xs text-muted">
                  {{ r.manual }} · {{ r.item }}<template v-if="r.status === 'completed'"> · {{ t.iaW.revisoes.achados(r.achadosAltos ?? 0) }}</template>
                </span>
              </span>
              <span class="flex shrink-0 flex-col items-end gap-0.5">
                <UBadge
                  :label="r.status === 'completed' ? t.iaW.revisoes.nota(r.nota ?? 0) : t.iaW.revisoes.status[r.status]"
                  :color="r.status === 'completed' && (r.nota ?? 0) < 70 ? 'warning' : COR_DO_STATUS[r.status]"
                  variant="subtle"
                  size="sm"
                />
                <span class="text-[11px] text-dimmed">{{ ha(r.em) }}</span>
              </span>
            </button>
          </li>
        </ul>
      </UScrollArea>
    </template>
  </div>

  <!-- Créditos de IA -->
  <div v-else-if="tipo === 'creditosIa'" class="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-3">
    <div class="flex items-baseline gap-2">
      <span class="text-2xl font-semibold tabular-nums text-highlighted">{{ fmt.format(carteiraDeIA.saldo) }}</span>
      <span class="text-sm text-muted">{{ t.iaW.creditos.unidade }}</span>
      <!-- Saldo baixo: menos de 14 dias no ritmo atual (critério do protótipo, a decidir com produto). -->
      <UBadge v-if="dias < 14" :label="t.iaW.creditos.baixo" color="warning" variant="subtle" size="sm" class="ml-auto" />
    </div>
    <p class="text-xs text-toned">
      {{ t.iaW.creditos.duram(dias) }}
    </p>
    <div class="flex min-h-0 flex-1 flex-col justify-end">
      <p class="mb-1 text-[11px] text-dimmed">
        {{ t.iaW.creditos.consumo }}
      </p>
      <div class="flex h-10 max-h-28 min-h-10 grow items-end gap-px" role="img" :aria-label="t.iaW.creditos.consumo">
        <span
          v-for="(v, i) in carteiraDeIA.consumoPorDia"
          :key="i"
          class="min-w-0 flex-1 origin-bottom animate-[home-crescer-y_0.4s_ease-out_both] rounded-t-[2px] motion-reduce:animate-none"
          :class="i >= carteiraDeIA.consumoPorDia.length - 7 ? 'bg-primary' : 'bg-primary/35'"
          :style="{ height: `${Math.max(4, (v / maxConsumo) * 100)}%`, animationDelay: `${i * 12}ms` }"
        />
      </div>
    </div>
    <div class="flex flex-wrap gap-1.5">
      <UButton :label="t.iaW.creditos.comprar" icon="i-lucide-plus" color="primary" variant="soft" size="xs" @click="emit('abrir', t.iaW.creditos.comprar)" />
      <UButton :label="t.iaW.creditos.extrato" color="neutral" variant="ghost" size="xs" @click="emit('abrir', t.iaW.creditos.extrato)" />
    </div>
  </div>

  <!-- Falhas de agentes nos fluxos -->
  <div v-else class="flex min-h-0 flex-1 flex-col pb-2">
    <p v-if="!falhas.length" class="flex flex-1 items-center justify-center gap-2 px-4 text-center text-sm text-muted">
      <UIcon name="i-lucide-circle-check" class="size-4 shrink-0 text-success" />{{ t.iaW.falhas.vazio }}
    </p>
    <UScrollArea v-else class="min-h-0 flex-1">
      <TransitionGroup tag="ul" class="px-2" leave-active-class="transition duration-200 ease-in motion-reduce:transition-none" leave-to-class="opacity-0 -translate-x-2">
        <li v-for="f in falhas" :key="f.id" class="flex items-start gap-3 rounded-md px-2 py-2">
          <AvatarDoBeni :cor="agentes.find(a => a.slug === f.agente)?.cor" estado="error" tamanho="sm" class="mt-0.5" />
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm text-highlighted">{{ agentes.find(a => a.slug === f.agente)?.nome ?? f.agente }}</span>
            <span class="block text-xs text-error-700 dark:text-error-300">{{ f.erro }}</span>
            <button type="button" class="mt-0.5 block max-w-full truncate text-xs text-muted underline-offset-2 hover:text-primary hover:underline" :title="t.iaW.falhas.abrirFluxo" @click="emit('abrir', f.fluxo)">
              {{ f.fluxo }} · {{ f.item }} · {{ ha(f.em) }}
            </button>
          </span>
          <UButton :label="t.iaW.falhas.repetir" icon="i-lucide-rotate-cw" color="neutral" variant="outline" size="xs" class="shrink-0" @click="emit('repetir', f)" />
        </li>
      </TransitionGroup>
    </UScrollArea>
  </div>
</template>

<style>
/* As barras do consumo crescem de baixo. Global e com nome único: o keyframe com escopo muda de nome e o animate-[...] não o acha. */
@keyframes home-crescer-y { from { transform: scaleY(0); } to { transform: scaleY(1); } }
</style>
