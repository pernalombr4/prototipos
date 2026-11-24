<script setup lang="ts">
/**
 * As lâminas do Painel de tarefas, como widgets da Home (rodada 5).
 *
 * A Home de develop já monta estas lâminas a partir do catálogo de tarefas do
 * SDK (en-sdk@develop 58a81c6, `components/tasks/insights/catalog.ts`): os
 * cartões de número (`kpi-*`), a fila de prazos (`dueList`, aqui em 2 widgets:
 * Vencidas e Vencem em breve, como a Home mostra), `status`, `breakdown` por
 * prioridade, `workload`, `activity`, `dueHealth` e `throughput`. Os nomes, as
 * faixas e os subtítulos são os do `locale.ts` do SDK.
 *
 * O desenho aqui é do protótipo: o protótipo não usa os componentes do SDK,
 * que buscam o dado no servidor. O que vale para o dev é o que cada lâmina
 * mostra e a regra de cada número, que segue a do SDK.
 *
 * Todas seguem o "Minhas tarefas · Workspace" do topo da Home: quem chama
 * passa as tarefas e a série já recortadas.
 */
import type { DiaDeTarefas, TarefaDaHome } from './mocks'
import { AGORA, pessoa } from './mocks'
import type { LaminaDeTarefas } from './widgets'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tipo: LaminaDeTarefas
  /** As tarefas do escopo escolhido, abertas e concluídas. */
  tarefas: TarefaDaHome[]
  /** Criadas e concluídas por dia, das últimas 4 semanas, do escopo escolhido. */
  serie: DiaDeTarefas[]
}>()
const emit = defineEmits<{ abrir: [destino: string] }>()

const HORA = 3_600_000
const DIA = 24 * HORA
const agora = AGORA.getTime()

const abertas = computed(() => props.tarefas.filter(x => x.status !== 'completed'))
const vencidas = computed(() => abertas.value.filter(x => x.due_date && x.due_date.getTime() < agora))
const vencem7 = computed(() => abertas.value.filter(x => x.due_date && x.due_date.getTime() >= agora && x.due_date.getTime() < agora + 7 * DIA))
const pct = (n: number) => abertas.value.length ? Math.round((n / abertas.value.length) * 100) : 0

/* ------------------------------------------------------------------ *
 * Cartões de número                                                    *
 * ------------------------------------------------------------------ */

/** As abertas de cada dia, reconstruídas de hoje para trás pelo saldo do dia. */
const curvaDasAbertas = computed(() => {
  const r: number[] = []
  let n = abertas.value.length
  for (let i = props.serie.length - 1; i >= 0; i--) {
    r.unshift(n)
    n = Math.max(0, n - props.serie[i]!.criadas + props.serie[i]!.concluidas)
  }
  return r
})

const kpi = computed(() => {
  switch (props.tipo) {
    case 'kpiAbertas': return { valor: abertas.value.length, curva: curvaDasAbertas.value, cor: 'text-primary', ponto: 'bg-primary' }
    case 'kpiConcluidas': return { valor: props.serie.reduce((s, d) => s + d.concluidas, 0), curva: props.serie.map(d => d.concluidas), cor: 'text-success', ponto: 'bg-success' }
    case 'kpiCriadas': return { valor: props.serie.reduce((s, d) => s + d.criadas, 0), curva: props.serie.map(d => d.criadas), cor: 'text-info', ponto: 'bg-info' }
    case 'kpiVencidas': return { valor: vencidas.value.length, barra: pct(vencidas.value.length), cor: 'text-error', ponto: 'bg-error' }
    case 'kpiVencem7': return { valor: vencem7.value.length, barra: pct(vencem7.value.length), cor: 'text-warning', ponto: 'bg-warning' }
    default: return null
  }
})

/** Linha e área da curva, num quadro de 100 x 30. */
function curva(valores: number[]) {
  const max = Math.max(1, ...valores)
  const passo = valores.length > 1 ? 100 / (valores.length - 1) : 100
  const pontos = valores.map((v, i) => `${(i * passo).toFixed(2)},${(28 - (v / max) * 24).toFixed(2)}`)
  return { linha: pontos.join(' '), area: `0,30 ${pontos.join(' ')} 100,30` }
}

/* ------------------------------------------------------------------ *
 * Fila de prazos                                                       *
 * ------------------------------------------------------------------ */

function duracao(ms: number) {
  const d = Math.floor(ms / DIA)
  const h = Math.max(d ? 0 : 1, Math.floor((ms % DIA) / HORA))
  return props.t.laminas.duracao(d, h)
}

const fila = computed(() => {
  const t = props.t.laminas
  const linha = (x: TarefaDaHome) => ({
    x,
    meta: [pessoa(x.assigned_to)?.nome ?? t.semResponsavel, props.t.novaTarefa.prioridades[x.priority as 'low' | 'normal' | 'high' | 'urgent']].join(' · '),
    selo: props.tipo === 'vencidas' ? t.venceuHa(duracao(agora - x.due_date!.getTime())) : t.em(duracao(x.due_date!.getTime() - agora)),
  })
  const porPrazo = (a: TarefaDaHome, b: TarefaDaHome) => a.due_date!.getTime() - b.due_date!.getTime()
  if (props.tipo === 'vencidas') {
    const lista = [...vencidas.value].sort(porPrazo)
    return [
      { rotulo: t.faixas.haAte7, linhas: lista.filter(x => agora - x.due_date!.getTime() <= 7 * DIA).map(linha) },
      { rotulo: t.faixas.haMaisDe7, linhas: lista.filter(x => agora - x.due_date!.getTime() > 7 * DIA).map(linha) },
    ].filter(g => g.linhas.length)
  }
  const lista = [...vencem7.value].sort(porPrazo)
  return [
    { rotulo: t.faixas.em24h, linhas: lista.filter(x => x.due_date!.getTime() - agora <= DIA).map(linha) },
    { rotulo: t.faixas.em1a7, linhas: lista.filter(x => x.due_date!.getTime() - agora > DIA).map(linha) },
  ].filter(g => g.linhas.length)
})

/* ------------------------------------------------------------------ *
 * Gráficos                                                             *
 * ------------------------------------------------------------------ */

const porStatus = computed(() => {
  const cores = { pending: 'text-info', working: 'text-primary', blocked: 'text-warning' } as const
  const fundo = { pending: 'bg-info', working: 'bg-primary', blocked: 'bg-warning' } as const
  const total = abertas.value.length || 1
  let acumulado = 0
  return (['pending', 'working', 'blocked'] as const).map((s) => {
    const n = abertas.value.filter(x => x.status === s).length
    const fatia = { s, n, cor: cores[s], fundo: fundo[s], inicio: acumulado, tamanho: (n / total) * 100 }
    acumulado += fatia.tamanho
    return fatia
  })
})

const porPrioridade = computed(() => {
  const rapidas = abertas.value.filter(x => x.origem === 'rapida')
  const cores = { urgent: 'bg-error', high: 'bg-warning', normal: 'bg-primary', low: 'bg-accented' } as const
  const linhas = (['urgent', 'high', 'normal', 'low'] as const).map(p => ({ p, n: rapidas.filter(x => x.priority === p).length, cor: cores[p] }))
  const max = Math.max(1, ...linhas.map(l => l.n))
  return linhas.map(l => ({ ...l, largura: (l.n / max) * 100 }))
})

const porResponsavel = computed(() => {
  const mapa = new Map<number, { abertas: number, vencidas: number }>()
  for (const x of abertas.value) {
    const id = x.assigned_to ?? 0
    const r = mapa.get(id) ?? { abertas: 0, vencidas: 0 }
    r.abertas++
    if (x.due_date && x.due_date.getTime() < agora) r.vencidas++
    mapa.set(id, r)
  }
  const linhas = [...mapa.entries()].map(([id, r]) => ({ id, nome: pessoa(id)?.nome ?? props.t.laminas.semResponsavel, ...r })).sort((a, b) => b.abertas - a.abertas)
  const max = Math.max(1, ...linhas.map(l => l.abertas))
  return linhas.map(l => ({ ...l, emDia: ((l.abertas - l.vencidas) / max) * 100, atraso: (l.vencidas / max) * 100 }))
})

const fmtDia = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' }))

const atividade = computed(() => {
  const max = Math.max(1, ...props.serie.map(d => d.concluidas))
  const nivel = (n: number) => n === 0 ? 'bg-elevated' : n / max <= 0.25 ? 'bg-success/25' : n / max <= 0.5 ? 'bg-success/50' : n / max <= 0.75 ? 'bg-success/75' : 'bg-success'
  const dias = props.serie.map(d => ({ ...d, classe: nivel(d.concluidas), rotulo: props.t.laminas.atividade.celula(fmtDia.value.format(d.data), d.concluidas) }))
  const semanas = [0, 1, 2, 3].map(i => dias.slice(i * 7, i * 7 + 7))
  const ativos = dias.filter(d => d.concluidas > 0).length
  let sequencia = 0
  for (let i = dias.length - 1; i >= 0 && dias[i]!.concluidas > 0; i--) sequencia++
  return { semanas, ativos, sequencia }
})

const entrada = computed(() => {
  const semanas = [0, 1, 2, 3].map((i) => {
    const dias = props.serie.slice(i * 7, i * 7 + 7)
    return { inicio: dias[0]!.data, criadas: dias.reduce((s, d) => s + d.criadas, 0), concluidas: dias.reduce((s, d) => s + d.concluidas, 0) }
  })
  const max = Math.max(1, ...semanas.flatMap(s => [s.criadas, s.concluidas]))
  const saldo = semanas.reduce((s, x) => s + x.criadas - x.concluidas, 0)
  return { semanas: semanas.map(s => ({ ...s, hc: (s.criadas / max) * 100, hf: (s.concluidas / max) * 100, rotulo: fmtDia.value.format(s.inicio) })), saldo }
})

const vazio = computed(() => {
  if (['status', 'carga'].includes(props.tipo)) return !abertas.value.length
  if (props.tipo === 'prioridade') return !porPrioridade.value.some(l => l.n)
  if (['atividade', 'entradaESaida'].includes(props.tipo)) return !props.serie.some(d => d.criadas || d.concluidas)
  return false
})
</script>

<template>
  <!-- Cartões de número -->
  <button
    v-if="kpi"
    type="button"
    class="group/kpi flex min-h-0 flex-1 flex-col px-4 pb-3 text-left focus-visible:outline-2 focus-visible:outline-primary"
    :aria-label="`${t.widgets[tipo].titulo}: ${kpi.valor}. ${t.laminas.abrirPainel}`"
    @click="emit('abrir', t.laminas.abrirPainel)"
  >
    <span class="text-3xl font-semibold tabular-nums text-highlighted transition-colors group-hover/kpi:text-primary">{{ kpi.valor }}</span>
    <svg
      v-if="kpi.curva"
      viewBox="0 0 100 30"
      preserveAspectRatio="none"
      class="mt-auto h-10 w-full overflow-visible"
      :class="kpi.cor"
      aria-hidden="true"
    >
      <polygon :points="curva(kpi.curva).area" fill="currentColor" fill-opacity="0.12" />
      <polyline :points="curva(kpi.curva).linha" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" />
    </svg>
    <template v-else>
      <span class="mt-auto text-xs text-muted">{{ t.laminas.dasAbertas(kpi.barra ?? 0) }}</span>
      <span class="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-elevated">
        <span class="block h-full rounded-full transition-[width] duration-500" :class="kpi.ponto" :style="{ width: `${kpi.barra}%` }" />
      </span>
    </template>
  </button>

  <!-- Fila de prazos: Vencidas e Vencem em breve -->
  <div v-else-if="tipo === 'vencidas' || tipo === 'vencemEmBreve'" class="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
    <p v-if="!fila.length" class="flex h-full min-h-20 items-center justify-center text-sm text-muted">
      {{ t.laminas.nadaPorAqui }}
    </p>
    <section v-for="g in fila" :key="g.rotulo" class="mb-2">
      <h3 class="flex items-center justify-between px-2 py-1 text-xs font-medium text-muted">
        <span>{{ g.rotulo }}</span><span class="tabular-nums">{{ g.linhas.length }}</span>
      </h3>
      <ul>
        <li v-for="(l, i) in g.linhas" :key="l.x.id" class="animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none" :style="{ animationDelay: `${i * 30}ms` }">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
            @click="emit('abrir', l.x.name)"
          >
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm text-highlighted">{{ l.x.name }}</span>
              <span class="block truncate text-xs text-muted">{{ l.meta }}</span>
            </span>
            <UBadge :label="l.selo" :color="tipo === 'vencidas' ? 'error' : 'warning'" variant="subtle" size="sm" class="shrink-0" />
          </button>
        </li>
      </ul>
    </section>
  </div>

  <!-- Gráficos sem dado -->
  <p v-else-if="vazio" class="flex min-h-0 flex-1 items-center justify-center px-4 pb-4 text-sm text-muted">
    {{ t.laminas.semDados }}
  </p>

  <!-- Abertas por status: rosca -->
  <div v-else-if="tipo === 'status'" class="flex min-h-0 flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 pb-3">
    <div class="relative size-32 shrink-0">
      <svg viewBox="0 0 36 36" class="size-full -rotate-90" role="img" :aria-label="porStatus.map(f => `${t.laminas.status[f.s]}: ${f.n}`).join(', ')">
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke-width="3.5" class="stroke-[var(--ui-bg-elevated)]" />
        <circle
          v-for="f in porStatus.filter(x => x.n)"
          :key="f.s"
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="currentColor"
          stroke-width="3.5"
          :class="f.cor"
          :stroke-dasharray="`${f.tamanho} ${100 - f.tamanho}`"
          :stroke-dashoffset="-f.inicio"
          class="transition-[stroke-dasharray] duration-500"
        />
      </svg>
      <span class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-2xl font-semibold tabular-nums text-highlighted">{{ porStatus.reduce((s, f) => s + f.n, 0) }}</span>
        <span class="text-xs text-muted">{{ t.laminas.abertas }}</span>
      </span>
    </div>
    <ul class="space-y-1.5">
      <li v-for="f in porStatus" :key="f.s" class="flex items-center gap-2 text-sm">
        <span class="size-2.5 rounded-full" :class="f.fundo" />
        <span class="text-toned">{{ t.laminas.status[f.s] }}</span>
        <span class="ml-auto pl-3 font-medium tabular-nums text-highlighted">{{ f.n }}</span>
      </li>
    </ul>
  </div>

  <!-- Prioridade: barras -->
  <ul v-else-if="tipo === 'prioridade'" class="flex min-h-0 flex-1 flex-col justify-center gap-2.5 px-4 pb-3">
    <li v-for="l in porPrioridade" :key="l.p" class="grid grid-cols-[5.5rem_1fr_2rem] items-center gap-2 text-sm">
      <span class="truncate text-toned">{{ t.novaTarefa.prioridades[l.p] }}</span>
      <span class="h-2.5 overflow-hidden rounded-full bg-elevated">
        <span class="block h-full rounded-full transition-[width] duration-500" :class="l.cor" :style="{ width: `${l.largura}%` }" />
      </span>
      <span class="text-right font-medium tabular-nums text-highlighted">{{ l.n }}</span>
    </li>
  </ul>

  <!-- Carga por responsável: barras empilhadas -->
  <div v-else-if="tipo === 'carga'" class="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-3">
    <ul class="min-h-0 flex-1 space-y-2.5 overflow-y-auto">
      <li v-for="l in porResponsavel" :key="l.id" class="grid grid-cols-[minmax(0,8rem)_1fr_1.75rem] items-center gap-2 text-sm">
        <span class="truncate text-toned" :title="l.nome">{{ l.nome }}</span>
        <span class="flex h-2.5 overflow-hidden rounded-full bg-elevated" role="img" :aria-label="`${l.nome}: ${l.abertas}, ${t.laminas.carga.vencidas} ${l.vencidas}`">
          <span class="h-full bg-error transition-[width] duration-500" :style="{ width: `${l.atraso}%` }" />
          <span class="h-full bg-primary transition-[width] duration-500" :style="{ width: `${l.emDia}%` }" />
        </span>
        <span class="text-right font-medium tabular-nums text-highlighted">{{ l.abertas }}</span>
      </li>
    </ul>
    <p class="flex items-center gap-3 text-xs text-muted">
      <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-error" />{{ t.laminas.carga.vencidas }}</span>
      <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-primary" />{{ t.laminas.carga.emDia }}</span>
    </p>
  </div>

  <!-- Atividade: mapa de calor de 4 semanas -->
  <div v-else-if="tipo === 'atividade'" class="flex min-h-0 flex-1 flex-wrap items-center gap-x-6 gap-y-3 px-4 pb-3">
    <div class="min-w-0 flex-1 space-y-1">
      <div v-for="(s, i) in atividade.semanas" :key="i" class="grid grid-cols-7 gap-1">
        <UTooltip v-for="d in s" :key="d.data.getTime()" :text="d.rotulo">
          <span class="block h-5 rounded-sm transition-colors" :class="d.classe" :aria-label="d.rotulo" role="img" />
        </UTooltip>
      </div>
      <p class="flex items-center justify-end gap-1 pt-1 text-xs text-muted">
        {{ t.laminas.atividade.menos }}
        <span v-for="c in ['bg-elevated', 'bg-success/25', 'bg-success/50', 'bg-success/75', 'bg-success']" :key="c" class="size-2.5 rounded-sm" :class="c" />
        {{ t.laminas.atividade.mais }}
      </p>
    </div>
    <dl class="grid shrink-0 grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-1">
      <div>
        <dt class="text-xs text-muted">
          {{ t.laminas.atividade.diasAtivos }}
        </dt>
        <dd class="text-lg font-semibold tabular-nums text-highlighted">
          {{ atividade.ativos }} / 28
        </dd>
      </div>
      <div>
        <dt class="text-xs text-muted">
          {{ t.laminas.atividade.sequencia }}
        </dt>
        <dd class="text-lg font-semibold tabular-nums text-highlighted">
          {{ t.laminas.atividade.dias(atividade.sequencia) }}
        </dd>
      </div>
    </dl>
  </div>

  <!-- Entrada e saída: colunas por semana -->
  <div v-else class="flex min-h-0 flex-1 flex-col gap-2 px-4 pb-3">
    <div class="flex min-h-0 flex-1 items-end gap-4">
      <div v-for="(s, i) in entrada.semanas" :key="i" class="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
        <div class="flex min-h-0 w-full flex-1 items-end justify-center gap-1" role="img" :aria-label="`${t.laminas.entrada.semana(s.rotulo)}: ${t.laminas.entrada.criadas} ${s.criadas}, ${t.laminas.entrada.concluidas} ${s.concluidas}`">
          <span class="w-full max-w-6 rounded-t-sm bg-info transition-[height] duration-500" :style="{ height: `${s.hc}%` }" />
          <span class="w-full max-w-6 rounded-t-sm bg-success transition-[height] duration-500" :style="{ height: `${s.hf}%` }" />
        </div>
        <span class="text-xs tabular-nums text-muted">{{ s.rotulo }}</span>
      </div>
    </div>
    <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
      <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-info" />{{ t.laminas.entrada.criadas }}</span>
      <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-success" />{{ t.laminas.entrada.concluidas }}</span>
      <span class="ml-auto">{{ t.laminas.entrada.saldo }}: <b class="font-medium tabular-nums text-highlighted">{{ entrada.saldo > 0 ? `+${entrada.saldo}` : entrada.saldo }}</b></span>
    </p>
  </div>
</template>
