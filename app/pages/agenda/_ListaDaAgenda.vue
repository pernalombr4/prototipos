<script setup lang="ts">
/** Vista Lista: 14 dias a partir da data, agrupados por dia (a "Agenda" do Google e do Outlook). */
import type { EventoDoCalendario } from '~/components/ux/geometriaDoCalendario'
import { barra } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { HOJE, diaLongo, hora, somarDias } from './datas'
import { estado } from './estado'

const props = defineProps<{ t: Textos, locale: string, eventos: EventoDoCalendario[], selecionado: string | null }>()
const emit = defineEmits<{ abrir: [id: string, referencia: { getBoundingClientRect: () => DOMRect }] }>()

const dias = computed(() => Array.from({ length: 14 }, (_, i) => somarDias(estado.data, i))
  .map(d => ({ dia: d, eventos: props.eventos.filter(e => e.dia === d).sort((a, b) => (a.inicio ?? -1) - (b.inicio ?? -1)) }))
  .filter(g => g.eventos.length))

const horario = (e: EventoDoCalendario) => e.inicio === undefined
  ? (e.rotuloHora ?? props.t.grade.diaInteiro)
  : props.t.grade.intervalo(hora(e.inicio), hora(e.fim ?? e.inicio + 60))

function abrir(ev: MouseEvent, id: string) {
  const el = ev.currentTarget as HTMLElement
  emit('abrir', id, { getBoundingClientRect: () => el.getBoundingClientRect() })
}
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto px-4 py-3">
    <section v-for="(g, k) in dias" :key="g.dia" class="animate-[entrada_.3s_ease-out_both] border-b border-default py-2 last:border-b-0" :style="{ animationDelay: `${k * 30}ms` }">
      <p class="sticky top-0 z-[1] flex items-center gap-2 bg-default py-1.5 text-sm font-semibold first-letter:uppercase" :class="g.dia === HOJE ? 'text-primary' : 'text-highlighted'">
        {{ diaLongo(g.dia, locale) }}
        <UBadge v-if="g.dia === HOJE" :label="t.barra.hoje" size="sm" variant="soft" />
      </p>
      <button
        v-for="e in g.eventos"
        :key="e.id"
        type="button"
        class="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-elevated"
        :class="[(e.passado || e.riscado) && 'opacity-60', selecionado === e.id && 'bg-elevated']"
        @click="abrir($event, e.id)"
      >
        <span class="w-28 shrink-0 tabular-nums text-muted">{{ horario(e) }}</span>
        <span class="h-4 w-1 shrink-0 rounded-full" :class="barra[e.cor]" />
        <UIcon v-if="e.icone" :name="e.icone" class="size-4 shrink-0 text-muted" />
        <span class="min-w-0 flex-1 truncate text-highlighted" :class="e.riscado && 'line-through'">{{ e.titulo }}</span>
        <UIcon v-if="e.alerta" :name="e.alerta === 'atrasado' ? 'i-lucide-circle-alert' : 'i-lucide-clock-alert'" class="size-4 shrink-0" :class="e.alerta === 'atrasado' ? 'text-error' : 'text-warning'" />
      </button>
    </section>
    <UEmpty v-if="!dias.length" icon="i-lucide-calendar-check" :title="t.avisos.vazioTitulo" :description="t.avisos.vazioTexto" variant="naked" class="mt-16" />
  </div>
</template>
