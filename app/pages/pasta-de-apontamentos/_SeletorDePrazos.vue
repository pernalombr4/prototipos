<script setup lang="ts">
/**
 * Rodada 6: o seletor das 2 datas da tarefa, no modo do campo "Dates" do
 * ClickUp (explorado em 12/11/2026): os 2 campos no topo, os atalhos à
 * esquerda e o calendário à direita. No ClickUp é Início → Vencimento; no
 * ENSPACE é Data limite → Prazo final (protótipo prazo-final-nas-tarefas):
 * - a data limite marca o atraso; o prazo final não muda o atraso;
 * - RN004: o prazo final é igual ou posterior à data limite. No calendário do
 *   prazo final, os dias antes da data limite ficam desabilitados; a escolha
 *   que quebra a regra mostra o aviso e não grava (RF013 e RF014).
 *
 * O `UCalendar` trabalha com `DateValue` do `@internationalized/date`, que
 * este repositório não instala (ver DECISOES). O protótipo pega a primeira
 * data que o próprio calendário entrega em `isDateDisabled` e cria as outras
 * com `.set()`. No produto, importa-se o `CalendarDate`.
 */
import type { TarefaDoItem } from './mocks'
import type { Textos } from './textos'
import { atalhosDeData, comHora, mesmoDia } from './tempo'

type Foco = 'limite' | 'final'
const props = defineProps<{ t: Textos, x: TarefaDoItem, somenteLeitura?: boolean }>()
const foco = defineModel<Foco>('foco', { default: 'limite' })

const tn = computed(() => props.t.tarefaNova)
const limite = computed(() => props.x.tarefa.due_date ? new Date(props.x.tarefa.due_date) : null)
const final = computed(() => props.x.prazoFinal ? new Date(props.x.prazoFinal) : null)
const valor = computed(() => foco.value === 'limite' ? limite.value : final.value)
const aviso = ref('')
watch(foco, () => { aviso.value = '' })

const campos = computed(() => [
  { id: 'limite' as const, rotulo: tn.value.campos.dataLimite, icone: 'i-lucide-calendar', valor: limite.value },
  { id: 'final' as const, rotulo: tn.value.campos.prazoFinal, icone: 'i-lucide-flag', valor: final.value },
])

/* ---------- a ponte com o DateValue do calendário ---------- */
interface DiaDoCalendario { year: number, month: number, day: number, set?: (c: object) => DiaDoCalendario }
let semente: DiaDoCalendario | null = null
const pronta = ref(false)
const versao = ref(0)
onMounted(() => { pronta.value = !!semente })
const paraDia = (d: Date) => semente?.set?.({ year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() })
const deDia = (d: DiaDoCalendario) => new Date(d.year, d.month - 1, d.day)
const selecionado = computed(() => pronta.value && valor.value ? paraDia(valor.value) : undefined)
const inicioDaVista = computed(() => pronta.value && valor.value ? paraDia(valor.value) : undefined)

const antesDoLimite = (d: Date) => !!limite.value && d < new Date(limite.value.getFullYear(), limite.value.getMonth(), limite.value.getDate())
function desabilitado(d: DiaDoCalendario) {
  semente ??= d
  return foco.value === 'final' && antesDoLimite(deDia(d))
}

/* ---------- gravar ---------- */
function gravar(nova: Date | null) {
  aviso.value = ''
  if (props.somenteLeitura) return
  if (nova && foco.value === 'final' && limite.value && nova < limite.value) {
    aviso.value = tn.value.prazos.avisoFinal(props.t.dataHora(limite.value))
    return
  }
  if (nova && foco.value === 'limite' && final.value && nova > final.value) {
    aviso.value = tn.value.prazos.avisoLimite(props.t.dataHora(final.value))
    return
  }
  if (foco.value === 'limite') props.x.tarefa.due_date = nova
  else props.x.prazoFinal = nova
}
function escolherDia(d: unknown) {
  if (!d || typeof d !== 'object' || !('day' in d)) return
  gravar(comHora(deDia(d as DiaDoCalendario), valor.value))
}
function escolherAtalho(d: Date) {
  gravar(comHora(d, valor.value))
  versao.value++
}
function tirar(id: Foco) {
  foco.value = id
  gravar(null)
}
const hora = computed(() => valor.value ? `${String(valor.value.getHours()).padStart(2, '0')}:${String(valor.value.getMinutes()).padStart(2, '0')}` : '')
function mudarHora(v: string | number) {
  const [h, m] = String(v).split(':').map(Number)
  if (!valor.value || Number.isNaN(h)) return
  const d = new Date(valor.value)
  d.setHours(h!, m ?? 0, 0, 0)
  gravar(d)
}

/* ---------- atalhos ---------- */
const hoje = new Date()
const atalhos = computed(() => atalhosDeData(hoje).map(a => ({
  ...a,
  rotulo: tn.value.prazos.atalhos[a.id]!,
  sufixo: a.dia ? a.data.toLocaleDateString(props.t.locale, { weekday: 'short' }).replace('.', '') : a.data.toLocaleDateString(props.t.locale, { day: 'numeric', month: 'short' }).replace('.', ''),
  desabilitado: foco.value === 'final' && antesDoLimite(a.data),
  ativo: !!valor.value && mesmoDia(valor.value, a.data),
})))
</script>

<template>
  <div class="flex w-[34rem] max-w-[calc(100vw-2rem)] flex-col">
    <!-- As 2 datas: a que está em foco recebe o calendário -->
    <div class="grid grid-cols-2 gap-2 border-b border-default p-2">
      <div
        v-for="c in campos"
        :key="c.id"
        role="button"
        tabindex="0"
        class="group/campo flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-left transition-[border-color,box-shadow] duration-150 focus-visible:outline-2 focus-visible:outline-primary"
        :class="foco === c.id ? 'border-primary/70 ring-2 ring-primary/15' : 'border-default hover:border-accented'"
        :aria-pressed="foco === c.id"
        @click="foco = c.id"
        @keydown.enter.prevent="foco = c.id"
      >
        <UIcon :name="c.icone" class="size-4 shrink-0" :class="c.valor ? 'text-highlighted' : 'text-dimmed'" />
        <span class="min-w-0 flex-1">
          <span class="block text-[11px] leading-4 text-muted">{{ c.rotulo }}</span>
          <span class="block truncate text-sm" :class="c.valor ? 'text-highlighted' : 'text-dimmed'">{{ c.valor ? t.dataHora(c.valor) : tn.prazos.semData }}</span>
        </span>
        <UButton
          v-if="c.valor && !somenteLeitura"
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          class="shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/campo:opacity-100"
          :aria-label="tn.prazos.tirar(c.rotulo.toLowerCase())"
          @click.stop="tirar(c.id)"
        />
      </div>
    </div>

    <div class="flex min-h-0">
      <!-- Atalhos -->
      <ul class="hidden w-52 shrink-0 flex-col border-r border-default p-1 sm:flex" :aria-label="tn.campos.datas">
        <li v-for="a in atalhos" :key="a.id">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            :class="a.ativo ? 'bg-primary/10 text-primary' : 'text-default hover:bg-elevated'"
            :disabled="a.desabilitado || somenteLeitura"
            @click="escolherAtalho(a.data)"
          >
            <span>{{ a.rotulo }}</span>
            <span class="text-xs text-muted">{{ a.sufixo }}</span>
          </button>
        </li>
      </ul>

      <!-- Calendário -->
      <div class="flex min-w-0 flex-1 flex-col gap-2 p-2">
        <UCalendar
          :key="`${foco}-${pronta}-${versao}`"
          :model-value="selecionado as any"
          :default-placeholder="inicioDaVista as any"
          :is-date-disabled="desabilitado as any"
          :disabled="somenteLeitura"
          :week-starts-on="0"
          size="sm"
          :year-controls="false"
          class="w-full"
          @update:model-value="escolherDia"
        />
        <div class="flex items-center gap-2 border-t border-default px-1 pt-2">
          <UIcon name="i-lucide-clock" class="size-4 text-muted" />
          <label :for="`hora-${foco}`" class="text-xs text-muted">{{ tn.prazos.hora }}</label>
          <UInput
            :id="`hora-${foco}`"
            :model-value="hora"
            type="time"
            size="xs"
            class="w-28"
            :disabled="!valor || somenteLeitura"
            @update:model-value="mudarHora"
          />
        </div>
      </div>
    </div>

    <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-100" leave-to-class="opacity-0">
      <p v-if="aviso" class="mx-2 mb-2 flex items-start gap-1.5 rounded-md bg-error/10 px-2.5 py-1.5 text-xs text-error" role="alert">
        <UIcon name="i-lucide-circle-alert" class="mt-px size-3.5 shrink-0" />
        {{ aviso }}
      </p>
    </Transition>
    <p class="flex items-center gap-1.5 border-t border-default px-3 py-2 text-xs text-muted">
      <UIcon :name="foco === 'limite' ? 'i-lucide-calendar' : 'i-lucide-flag'" class="size-3.5 shrink-0" />
      {{ foco === 'limite' ? tn.prazos.ajudaLimite : tn.prazos.ajudaFinal }}
    </p>
  </div>
</template>
