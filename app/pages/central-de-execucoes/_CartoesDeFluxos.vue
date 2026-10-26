<script setup lang="ts">
/**
 * Os cartões de fluxos da tela Spaceflows.
 *
 * Hoje (cópia do develop, 24/10/2026): busca "Buscar workflows...", "N workflow encontrado",
 * cartões com ícone, nome, versão, o selo "active" em inglês cru, a descrição (ou "Nenhuma
 * descrição informada"), o gatilho em texto técnico (`manual::wf-...::create`), a data e os botões
 * Abrir e Executar.
 *
 * PROPOSTA: os cartões agrupados por operação (pela regra de cada uma, `operacoes.ts`; o fluxo que
 * nenhuma regra alcança fica em "Sem operação"), o gatilho em palavras, o selo traduzido e, embaixo,
 * as execuções dos últimos 7 dias e as que falharam. A forma continua cartão.
 */
import type { Fluxo } from './mocks'
import { fluxosPelaRegra, fluxosSemOperacao, operacoes } from './operacoes'
import type { Dados } from './consultas'
import { noPeriodo, textoDoEvento } from './consultas'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, dados: Dados, hoje?: boolean, carregando?: boolean }>()
const emit = defineEmits<{ abrir: [number], executar: [number] }>()

const busca = ref('')
const visiveis = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return props.dados.fluxos.filter(f => !q || f.name.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q))
})
const grupos = computed(() => props.hoje
  ? [{ id: 'todos', nome: '', fluxos: visiveis.value }]
  : [
      ...operacoes.value.map(o => ({ id: o.id, nome: o.nome, fluxos: fluxosPelaRegra(o.regra, visiveis.value) })),
      { id: 'sem', nome: props.t.operacoes.semOperacao, fluxos: fluxosSemOperacao(visiveis.value) },
    ].filter(g => g.fluxos.length))

const ultimos7 = computed(() => noPeriodo(props.dados.execucoes, 'd7'))
const uso = (f: Fluxo) => {
  const lista = ultimos7.value.filter(e => e.workflow === f.id)
  return { n: lista.length, erros: lista.filter(e => e.status === 'error' || e.status === 'stopped').length }
}

function gatilhoTecnico(f: Fluxo) {
  const g = f.gatilho
  return g.tipo === 'events' ? `events::${g.categoria}::${g.acao}` : `${g.tipo}::wf-${f.id}::create`
}
function gatilhoEmPalavras(f: Fluxo) {
  const g = f.gatilho
  if (g.tipo === 'events') return textoDoEvento({ categoria: g.categoria, acao: g.acao }, props.t)
  if (g.tipo === 'cron') return props.t.mapa.gatilhos.cron(g.rotulo)
  return props.t.mapa.gatilhos[g.tipo]
}
const iconeDoGatilho = (f: Fluxo) => ({ events: 'i-lucide-zap', cron: 'i-lucide-calendar-clock', webhook: 'i-lucide-webhook', mailbox: 'i-lucide-mail', manual: 'i-lucide-hand' })[f.gatilho.tipo]
const formatoData = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', year: 'numeric' }))
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto flex max-w-7xl flex-col gap-4 p-5">
      <div class="flex flex-wrap items-center gap-3">
        <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.fluxos.buscar" class="w-full max-w-md" :aria-label="t.fluxos.buscar" />
        <span class="text-sm text-muted">{{ t.fluxos.encontrados(visiveis.length) }}</span>
      </div>

      <div v-if="carregando" class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <USkeleton v-for="k in 6" :key="k" class="h-44 rounded-lg" />
      </div>

      <section v-for="g in grupos" v-else :key="g.id" class="flex flex-col gap-3">
        <h2 v-if="g.nome" class="flex items-center gap-2 text-sm font-semibold text-highlighted">
          <UIcon name="i-lucide-boxes" class="size-4 text-muted" />{{ g.nome }}
          <span class="font-normal text-muted">· {{ t.operacoes.fluxos(g.fluxos.length) }}</span>
        </h2>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="(f, i) in g.fluxos"
            :key="f.id"
            class="flex animate-[entrada_.3s_ease-out_both] flex-col gap-2 rounded-lg border border-default bg-default p-4 transition hover:-translate-y-0.5 hover:border-accented hover:shadow-md"
            :style="{ animationDelay: `${Math.min(i, 12) * 30}ms` }"
          >
            <div class="flex items-start gap-3">
              <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <UIcon name="i-lucide-workflow" class="size-5" />
              </span>
              <div class="min-w-0 flex-1">
                <h3 class="truncate text-sm font-semibold text-highlighted">{{ f.name }}</h3>
                <p class="text-xs text-muted">v{{ f.version }}</p>
              </div>
              <UBadge :label="hoje ? f.status : t.fluxos.ativo" :color="hoje ? 'neutral' : 'success'" variant="subtle" size="sm" />
            </div>
            <p class="line-clamp-2 min-h-8 text-xs" :class="f.description ? 'text-toned' : 'text-muted'">{{ f.description || t.fluxos.semDescricao }}</p>
            <p v-if="hoje" class="truncate font-mono text-[11px] text-muted">{{ gatilhoTecnico(f) }}</p>
            <p v-else class="flex items-center gap-1.5 truncate text-xs text-toned">
              <UIcon :name="iconeDoGatilho(f)" class="size-3.5 shrink-0 text-muted" />{{ gatilhoEmPalavras(f) }}
            </p>
            <p v-if="!hoje" class="flex items-center gap-2 text-xs">
              <span class="tabular-nums text-muted">{{ t.fluxos.uso(uso(f).n) }}</span>
              <span v-if="uso(f).erros" class="flex items-center gap-1 tabular-nums text-error">
                <UIcon name="i-lucide-circle-x" class="size-3.5" />{{ t.fluxos.erros(uso(f).erros) }}
              </span>
            </p>
            <div class="mt-auto flex items-center gap-2 border-t border-default pt-3">
              <span class="mr-auto text-xs text-muted">{{ formatoData.format(f.created_at!) }}</span>
              <UButton :label="t.fluxos.abrir" icon="i-lucide-arrow-up-right" size="xs" color="neutral" variant="outline" @click="emit('abrir', f.id)" />
              <UButton :label="t.fluxos.executar" icon="i-lucide-play" size="xs" @click="emit('executar', f.id)" />
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
