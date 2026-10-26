<script setup lang="ts">
/**
 * A grade da Agenda do ENSPACE, na visualização Mês.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Cópia do develop: cabeçalho com Hoje, Período anterior, Período seguinte, o mês,
 * Visualização, Data, Dia Útil, Dia Não Útil e o ícone de configurações; grade de 7 colunas com o dia de hoje em
 * círculo e o dia não útil em vermelho claro. Fontes: `comunicacao-no-workspace/_TelaAgenda.vue` (develop,
 * 05/10/2026) e a Agenda do develop lida em 26/10/2026 (hoje ela abre em "Dia"; a grade do mês é a mesma da cópia).
 * O Nuxt UI e o SDK não têm calendário de eventos: a grade é a da tela de hoje, montada à mão.
 *
 * A mesma grade serve à Agenda (Membro › Agenda) e à visualização Calendário de Prazos. O prazo entra como
 * qualquer evento; a cor diz se é o dia fatal ou o interno.
 */
import { HOJE, feriadosNacionais } from './mocks'
import { diaDaSemana, paraData, paraDia, somarDias } from './prazos'
import type { Textos } from './textos'
import { dia as formatarDia } from './formato'

export type Tom = 'fatal' | 'interno' | 'cumprido' | 'neutro'
export interface Evento { id: string, dia: string, titulo: string, tom: Tom, hora?: string }

const props = defineProps<{ t: Textos, eventos: Evento[] }>()
const emit = defineEmits<{ abrir: [Evento] }>()

/** O mês na tela, como o 1º dia (`AAAA-MM-01`). */
const mes = ref(`${HOJE.slice(0, 7)}-01`)
function mudarMes(n: number) {
  const d = paraData(mes.value)
  d.setUTCMonth(d.getUTCMonth() + n)
  mes.value = paraDia(d)
}

/** A grade começa no domingo antes do dia 1 e tem 5 ou 6 semanas. */
const dias = computed(() => {
  const inicio = somarDias(mes.value, -diaDaSemana(mes.value))
  const ultimo = paraData(mes.value)
  ultimo.setUTCMonth(ultimo.getUTCMonth() + 1, 0)
  const total = Math.ceil((diaDaSemana(mes.value) + ultimo.getUTCDate()) / 7) * 7
  return Array.from({ length: total }, (_, i) => somarDias(inicio, i))
})

const feriados = new Set(feriadosNacionais.map(f => f.dia))
const naoUtil = (d: string) => diaDaSemana(d) === 0 || diaDaSemana(d) === 6 || feriados.has(d)
const doMes = (d: string) => d.slice(0, 7) === mes.value.slice(0, 7)
const doDia = (d: string) => props.eventos.filter(e => e.dia === d).sort((a, b) => (a.hora ?? '') < (b.hora ?? '') ? -1 : 1)

/** "outubro 2026", como o develop escreve (sem o "de"). */
const nomeDoMes = computed(() => {
  const d = paraData(mes.value)
  return `${new Intl.DateTimeFormat(props.t.locale, { month: 'long', timeZone: 'UTC' }).format(d)} ${d.getUTCFullYear()}`
})
const diasDaSemana = computed(() => Array.from({ length: 7 }, (_, i) =>
  new Intl.DateTimeFormat(props.t.locale, { weekday: 'short', timeZone: 'UTC' }).format(paraData(somarDias('2026-10-04', i))).toUpperCase()))

const classeDoTom: Record<Tom, string> = {
  fatal: 'border-l-2 border-error bg-error/10 text-highlighted',
  interno: 'border-l-2 border-primary bg-primary/10 text-highlighted',
  cumprido: 'bg-elevated text-muted line-through',
  neutro: 'bg-info/10 text-highlighted',
}
</script>

<template>
  <div class="rounded-lg border border-default">
    <!-- Cabeçalho (cópia) -->
    <div class="flex flex-wrap items-center gap-3 border-b border-default p-3">
      <UButton :label="t.agenda.hoje" color="neutral" variant="outline" @click="mes = `${HOJE.slice(0, 7)}-01`" />
      <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" :aria-label="t.agenda.anterior" @click="mudarMes(-1)" />
      <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" :aria-label="t.agenda.proximo" @click="mudarMes(1)" />
      <h2 class="text-xl font-semibold text-highlighted">{{ nomeDoMes }}</h2>
      <div class="ml-auto flex flex-wrap items-center gap-2">
        <UFormField :label="t.agenda.visualizacao" size="xs">
          <USelect model-value="mes" :items="[{ value: 'mes', label: t.agenda.mes }]" size="sm" class="w-24" />
        </UFormField>
        <UFormField :label="t.agenda.data" size="xs">
          <UInput :model-value="formatarDia(HOJE, t.locale)" size="sm" class="w-36" trailing-icon="i-lucide-chevron-down" readonly />
        </UFormField>
        <UBadge :label="t.agenda.diaUtil" color="success" variant="soft" />
        <UBadge :label="t.agenda.diaNaoUtil" color="error" variant="soft" />
        <UButton icon="i-lucide-settings" color="primary" variant="ghost" size="sm" :aria-label="t.agenda.configurar" />
      </div>
    </div>

    <!-- Grade do mês (cópia) -->
    <div class="grid grid-cols-7 text-center text-xs font-semibold text-toned">
      <div v-for="d in diasDaSemana" :key="d" class="border-b border-r border-default py-2 last:border-r-0">{{ d }}</div>
    </div>
    <Transition mode="out-in" enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
      <div :key="mes" class="grid grid-cols-7">
        <div
          v-for="d in dias"
          :key="d"
          class="min-h-28 border-b border-r border-default p-1.5 [&:nth-child(7n)]:border-r-0"
          :class="[naoUtil(d) ? 'bg-error/5' : '', doMes(d) ? 'text-toned' : 'text-dimmed']"
        >
          <p class="mb-1 text-center text-sm">
            <span class="inline-flex size-6 items-center justify-center rounded-full" :class="d === HOJE ? 'bg-primary font-semibold text-white' : ''">
              {{ Number(d.slice(8)) }}
            </span>
          </p>
          <button
            v-for="e in doDia(d).slice(0, 3)"
            :key="e.id"
            type="button"
            class="mb-1 block w-full truncate rounded px-1.5 py-0.5 text-left text-xs transition hover:-translate-y-px hover:shadow-sm"
            :class="classeDoTom[e.tom]"
            :title="e.titulo"
            @click="emit('abrir', e)"
          >
            <span v-if="e.hora" class="mr-1 tabular-nums">{{ e.hora }}</span>{{ e.titulo }}
          </button>
          <p v-if="doDia(d).length > 3" class="text-center text-xs text-muted">{{ t.agenda.mais(doDia(d).length - 3) }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
