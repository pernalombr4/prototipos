<script setup lang="ts">
/**
 * Os 2 widgets NOVOS de agenda (rodada 6), a pedido da redatora ("trazendo
 * a própria agenda em miniatura pra home"):
 * - Agenda da semana: os 7 dias a partir de hoje, em colunas, como a visão
 *   Semana da tela Agenda;
 * - Agenda do mês: o calendário do mês, como a visão Mês (a que a Agenda abre
 *   por padrão), com 1 ponto por fonte em cada dia; clicar num dia lista o
 *   que há nele embaixo.
 *
 * As fontes e as cores são as da Agenda de hoje: compromisso do calendário
 * conectado, prazo de tarefa e data de item. O dado chega pronto em
 * `eventos` (index.vue, `agendaCompleta`).
 *
 * A grade do mês é própria: o `UCalendar` pede `@internationalized/date`, que
 * o repositório não instala (DECISOES.md, rodada 6).
 *
 * Componentes: `UButton`, `UTooltip`, `UIcon`, `UScrollArea` (MCP nuxt-ui).
 */
import type { Evento } from './mocks'
import { AGORA, DIA } from './mocks'
import { hora } from './formatar'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tipo: 'agendaSemana' | 'agendaMes'
  eventos: Evento[]
}>()
const emit = defineEmits<{ abrir: [destino: string] }>()

const HORA = 3_600_000
/** O dia em Brasília, como número de dias desde 1/1/1970. */
const diaDe = (d: Date | number) => Math.floor((new Date(d).getTime() - 3 * HORA) / DIA)
const HOJE_N = diaDe(AGORA)
/** Meia-noite do dia n em Brasília, para formatar. */
const dataDo = (n: number) => new Date(n * DIA + 3 * HORA)
const semanaDo = (n: number) => new Date(n * DIA).getUTCDay()

const COR = { tarefa: 'bg-warning', item: 'bg-info', calendario: 'bg-primary' } as const
const BORDA = { tarefa: 'border-warning', item: 'border-info', calendario: 'border-primary' } as const
const ICONE = { tarefa: 'i-lucide-list-checks', item: 'i-lucide-file-text', calendario: 'i-lucide-calendar' } as const

const porDia = computed(() => {
  const m = new Map<number, Evento[]>()
  for (const e of [...props.eventos].sort((a, b) => a.inicio.getTime() - b.inicio.getTime())) {
    const n = diaDe(e.inicio)
    m.set(n, [...(m.get(n) ?? []), e])
  }
  return m
})

const fmt = (o: Intl.DateTimeFormatOptions) => (d: Date) => new Intl.DateTimeFormat(props.t.locale, { ...o, timeZone: 'America/Sao_Paulo' }).format(d)

/* Semana */
const semana = computed(() => Array.from({ length: 7 }, (_, i) => HOJE_N + i))

/* Mês */
const mes = ref(0) // 0 = o mês de hoje
const inicioDoMes = computed(() => {
  const h = dataDo(HOJE_N)
  const y = h.getUTCFullYear()
  const m = h.getUTCMonth() + mes.value
  return diaDe(Date.UTC(y, m, 1, 3))
})
const nomeDoMes = computed(() => {
  const s = fmt({ month: 'long', year: 'numeric' })(dataDo(inicioDoMes.value))
  return s.charAt(0).toUpperCase() + s.slice(1)
})
/** As células do mês, de domingo a sábado; fora do mês, null. */
const celulas = computed(() => {
  const ini = inicioDoMes.value
  const d = dataDo(ini)
  const dias = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate()
  const vazias = semanaDo(ini)
  return [...Array.from({ length: vazias }, () => null), ...Array.from({ length: dias }, (_, i) => ini + i)]
})
const iniciais = computed(() => Array.from({ length: 7 }, (_, i) => fmt({ weekday: 'narrow' })(dataDo(HOJE_N - semanaDo(HOJE_N) + i))))
const escolhido = ref(HOJE_N)
watch(mes, () => { escolhido.value = mes.value === 0 ? HOJE_N : inicioDoMes.value })
const fontesDo = (n: number) => [...new Set((porDia.value.get(n) ?? []).map(e => e.fonte))]
</script>

<template>
  <!-- Agenda da semana -->
  <div v-if="tipo === 'agendaSemana'" class="grid min-h-0 flex-1 grid-cols-7 divide-x divide-default overflow-hidden border-t border-default">
    <section v-for="n in semana" :key="n" class="flex min-h-0 min-w-0 flex-col bg-default">
      <header class="px-1.5 py-1.5 text-center" :class="n === HOJE_N ? 'text-primary' : 'text-muted'">
        <span class="block text-[11px] font-medium uppercase tracking-wide">{{ fmt({ weekday: 'short' })(dataDo(n)).replace('.', '') }}</span>
        <span
          class="mx-auto mt-0.5 flex size-6 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
          :class="n === HOJE_N ? 'bg-primary text-inverted' : 'text-highlighted'"
        >{{ dataDo(n).getUTCDate() }}</span>
      </header>
      <UScrollArea class="min-h-0 flex-1">
        <ul class="space-y-1 px-1 pb-1.5">
          <li v-for="(e, i) in porDia.get(n) ?? []" :key="e.id" class="animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none" :style="{ animationDelay: `${i * 25}ms` }">
            <UTooltip :text="`${hora(e.inicio, t)} · ${e.titulo} · ${t.agenda.fontes[e.fonte]}`" :content="{ side: 'top' }">
              <button
                type="button"
                class="block w-full rounded-sm border-l-2 bg-elevated/60 px-1.5 py-1 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
                :class="BORDA[e.fonte]"
                @click="emit('abrir', e.titulo)"
              >
                <span class="block text-[11px] tabular-nums text-muted">{{ hora(e.inicio, t) }}</span>
                <span class="line-clamp-2 text-xs leading-snug text-highlighted">{{ e.titulo }}</span>
              </button>
            </UTooltip>
          </li>
        </ul>
      </UScrollArea>
    </section>
  </div>

  <!-- Agenda do mês -->
  <div v-else class="flex min-h-0 flex-1 flex-col">
    <div class="flex items-center gap-1 px-3 pb-1">
      <span class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted">{{ nomeDoMes }}</span>
      <UButton v-if="mes !== 0" :label="t.agendaW.hoje" color="neutral" variant="ghost" size="xs" @click="mes = 0" />
      <UTooltip :text="t.agendaW.mesAnterior">
        <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="xs" :aria-label="t.agendaW.mesAnterior" @click="mes--" />
      </UTooltip>
      <UTooltip :text="t.agendaW.proximoMes">
        <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" :aria-label="t.agendaW.proximoMes" @click="mes++" />
      </UTooltip>
    </div>
    <div class="grid grid-cols-7 px-2 text-center text-[11px] font-medium uppercase text-dimmed" aria-hidden="true">
      <span v-for="(x, i) in iniciais" :key="i" class="py-1">{{ x }}</span>
    </div>
    <div :key="inicioDoMes" class="grid animate-[entrada_0.2s_ease-out_both] grid-cols-7 gap-0.5 px-2 motion-reduce:animate-none">
      <template v-for="(n, i) in celulas" :key="i">
        <span v-if="n === null" />
        <button
          v-else
          type="button"
          class="flex h-9 flex-col items-center justify-center gap-0.5 rounded-md text-xs tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-primary"
          :class="[
            n === escolhido ? 'bg-primary/10 ring ring-inset ring-primary/40 text-highlighted' : 'hover:bg-elevated',
            n === HOJE_N ? 'font-semibold text-primary' : n < HOJE_N ? 'text-muted' : 'text-default',
          ]"
          :aria-pressed="n === escolhido"
          :aria-label="fmt({ weekday: 'long', day: 'numeric', month: 'long' })(dataDo(n))"
          @click="escolhido = n"
        >
          {{ dataDo(n).getUTCDate() }}
          <span class="flex h-1 gap-0.5">
            <span v-for="f in fontesDo(n)" :key="f" class="size-1 rounded-full" :class="COR[f]" />
          </span>
        </button>
      </template>
    </div>

    <div class="mt-2 flex min-h-0 flex-1 flex-col border-t border-default">
      <p class="px-4 pb-1 pt-2 text-xs font-medium text-muted">
        {{ fmt({ weekday: 'long', day: 'numeric', month: 'long' })(dataDo(escolhido)) }}
      </p>
      <UScrollArea class="min-h-0 flex-1">
        <ol :key="escolhido" class="px-4 pb-3">
          <li v-for="(e, i) in porDia.get(escolhido) ?? []" :key="e.id" class="flex animate-[entrada_0.25s_ease-out_both] gap-3 py-1 motion-reduce:animate-none" :style="{ animationDelay: `${i * 30}ms` }">
            <span class="w-11 shrink-0 pt-0.5 text-right text-xs font-medium tabular-nums text-muted">{{ hora(e.inicio, t) }}</span>
            <span class="mt-1.5 size-2 shrink-0 rounded-full" :class="COR[e.fonte]" />
            <button type="button" class="min-w-0 flex-1 text-left" @click="emit('abrir', e.titulo)">
              <span class="block truncate text-sm text-highlighted hover:text-primary">{{ e.titulo }}</span>
              <span class="flex items-center gap-1 text-xs text-muted"><UIcon :name="ICONE[e.fonte]" class="size-3" />{{ t.agenda.fontes[e.fonte] }}</span>
            </button>
          </li>
          <li v-if="!(porDia.get(escolhido) ?? []).length" class="py-4 text-center text-sm text-muted">
            {{ t.agendaW.nadaNoDia }}
          </li>
        </ol>
      </UScrollArea>
    </div>
  </div>
</template>
