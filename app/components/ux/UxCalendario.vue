<script setup lang="ts">
/**
 * Calendário de eventos: vistas Dia, Semana e Mês, com faixa de dia inteiro, linha da hora atual, criar arrastando
 * num horário vazio, mover e redimensionar evento e receber cartão arrastado de fora (HTML5 drag and drop).
 *
 * Por que é custom: o Nuxt UI não tem calendário de eventos (MCP `nuxt-ui`, `search-components "calendar event
 * scheduler"`: só `Calendar` e `InputDate`, que escolhem data) e o SDK do ENSPACE também não. A estrutura (coluna
 * por dia, bloco com barra de cor, faixa de dia inteiro, indicador da hora) e a mecânica de arrastar seguem o
 * template oficial "Calendar" do Nuxt UI (MCP `list-templates`), portado sem `date-fns` e sem `@vueuse`.
 *
 * É burro de propósito: recebe eventos prontos, devolve gestos por emit. Quem decide o que um arraste significa
 * (mudar o prazo, reservar tempo, mudar o campo do item) é a tela.
 */
import type { EventoDoCalendario, Lugar, Movimento } from './geometriaDoCalendario'
import { ALTURA_DA_HORA, LIMIAR_DE_ARRASTE, PASSO, PX_POR_MINUTO, anel, barra, borda, empacotarDia, encaixar, fundoCheio, limitar, minutoNaColuna, textoDaCor } from './geometriaDoCalendario'

type Referencia = { getBoundingClientRect: () => DOMRect }

const props = withDefaults(defineProps<{
  eventos: EventoDoCalendario[]
  vista: 'dia' | 'semana' | 'mes'
  /** Dia de referência do período, `AAAA-MM-DD`. */
  data: string
  hoje: string
  /** Minuto do dia da linha da hora atual. */
  agora: number
  locale: string
  horario: { inicio: number, fim: number }
  naoUtil: (dia: string) => boolean
  rotuloDoDia?: (dia: string) => string | null
  rotulos: { diaInteiro: string, mais: (n: number) => string, novo: string, intervalo: (a: string, b: string) => string }
  /** O que está sendo criado agora: a grade desenha o fantasma até a tela fechar a criação. */
  rascunho?: Lugar | null
  selecionado?: string | null
  carregando?: boolean
  horaInicial?: number
}>(), { horaInicial: 8, rascunho: null, selecionado: null, rotuloDoDia: () => null })

const emit = defineEmits<{
  abrir: [id: string, referencia: Referencia]
  criar: [lugar: Lugar, referencia: Referencia]
  mover: [movimento: Movimento]
  soltar: [chave: string, lugar: Lugar]
  irParaDia: [dia: string]
}>()

/* ---------------- datas (sem fuso: dia AAAA-MM-DD e minuto do dia) ---------------- */
const paraData = (d: string) => new Date(`${d}T00:00:00Z`)
const somar = (d: string, n: number) => {
  const x = paraData(d)
  x.setUTCDate(x.getUTCDate() + n)
  return x.toISOString().slice(0, 10)
}
const inicioDaSemana = (d: string) => somar(d, -paraData(d).getUTCDay())
const hora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
const nomeCurto = (d: string) => new Intl.DateTimeFormat(props.locale, { weekday: 'short', timeZone: 'UTC' }).format(paraData(d)).replace('.', '')

const dias = computed(() => props.vista === 'dia' ? [props.data] : Array.from({ length: 7 }, (_, i) => somar(inicioDaSemana(props.data), i)))
const diasDoMes = computed(() => {
  const inicio = inicioDaSemana(`${props.data.slice(0, 7)}-01`)
  return Array.from({ length: 42 }, (_, i) => somar(inicio, i))
})
const colunas = computed(() => ({ gridTemplateColumns: `3.5rem repeat(${dias.value.length}, minmax(0, 1fr))` }))

/* ---------------- arrastar um evento ---------------- */
interface Arrasto {
  id: string
  modo: 'mover' | 'redimensionar'
  x0: number
  y0: number
  ativo: boolean
  /** Minutos entre o início do evento e o ponto onde ele foi pego. */
  pega: number
  duracao: number
  original: EventoDoCalendario
  alvo: Lugar | null
}
const arrasto = ref<Arrasto | null>(null)
let suprimirClique = false
const raiz = ref<HTMLElement | null>(null)

function acertar(seletor: string, x: number, y: number) {
  for (const el of raiz.value?.querySelectorAll<HTMLElement>(seletor) ?? []) {
    const r = el.getBoundingClientRect()
    if (x >= r.left && x < r.right && y >= r.top && y < r.bottom) return { el, r }
  }
  return null
}

function lugarNoPonteiro(x: number, y: number, a: Arrasto): Lugar | null {
  const o = a.original
  if (props.vista === 'mes') {
    const c = acertar('[data-celula]', x, y)
    return c ? { dia: c.el.dataset.celula!, inicio: o.inicio, fim: o.fim } : a.alvo
  }
  const faixa = acertar('[data-faixa]', x, y)
  if (faixa) return o.inicio === undefined ? { dia: faixa.el.dataset.faixa! } : { dia: faixa.el.dataset.faixa!, inicio: o.inicio, fim: o.fim }
  const col = acertar('[data-coluna]', x, y)
  if (!col) return a.alvo
  const dia = col.el.dataset.coluna!
  if (a.modo === 'redimensionar') return { dia: o.dia, inicio: o.inicio, fim: Math.max(o.inicio! + PASSO, minutoNaColuna(y, col.r)) }
  if (o.inicio === undefined && !o.vaiParaAGrade) return { dia }
  const ini = Math.min(limitar(encaixar(minutoNaColuna(y, col.r) - a.pega)), 24 * 60 - a.duracao)
  return { dia, inicio: ini, fim: ini + a.duracao }
}

function aoMover(ev: PointerEvent) {
  const a = arrasto.value
  if (!a) return
  if (!a.ativo) {
    if (Math.hypot(ev.clientX - a.x0, ev.clientY - a.y0) < LIMIAR_DE_ARRASTE) return
    a.ativo = true
    suprimirClique = true
  }
  a.alvo = lugarNoPonteiro(ev.clientX, ev.clientY, a)
}

function aoSoltar() {
  const a = arrasto.value
  window.removeEventListener('pointermove', aoMover)
  window.removeEventListener('pointerup', aoSoltar)
  if (a?.ativo && a.alvo) {
    const o = a.original
    if (a.alvo.dia !== o.dia || a.alvo.inicio !== o.inicio || a.alvo.fim !== o.fim) emit('mover', { id: a.id, ...a.alvo })
  }
  arrasto.value = null
  setTimeout(() => { suprimirClique = false })
}

function pegarEvento(ev: PointerEvent, e: EventoDoCalendario) {
  ev.stopPropagation()
  if (ev.button !== 0 || !e.arrastavel) return
  const modo = (ev.target as HTMLElement).closest('[data-alca]') ? 'redimensionar' : 'mover'
  const col = e.inicio !== undefined ? acertar('[data-coluna]', ev.clientX, ev.clientY) : null
  arrasto.value = {
    id: e.id,
    modo,
    x0: ev.clientX,
    y0: ev.clientY,
    ativo: false,
    pega: col ? minutoNaColuna(ev.clientY, col.r) - e.inicio! : 0,
    duracao: e.inicio !== undefined ? (e.fim ?? e.inicio + 60) - e.inicio : 60,
    original: e,
    alvo: null,
  }
  window.addEventListener('pointermove', aoMover)
  window.addEventListener('pointerup', aoSoltar)
}

const referenciaDe = (seletor: string, x = 0, y = 0): Referencia => ({
  getBoundingClientRect: () => raiz.value?.querySelector<HTMLElement>(seletor)?.getBoundingClientRect() ?? new DOMRect(x, y, 0, 0),
})

function clicarEvento(e: EventoDoCalendario) {
  if (suprimirClique) return
  emit('abrir', e.id, referenciaDe(`[data-evento="${e.id}"]`))
}

/** Os eventos como devem aparecer agora: o arrastado já no lugar onde cairia. */
const efetivos = computed(() => {
  const a = arrasto.value
  if (!a?.ativo || !a.alvo) return props.eventos
  return props.eventos.map(e => e.id === a.id ? { ...e, dia: a.alvo!.dia, inicio: a.alvo!.inicio, fim: a.alvo!.fim } : e)
})
const doDia = (d: string) => efetivos.value.filter(e => e.dia === d)
const noHorario = (d: string) => empacotarDia(doDia(d).filter(e => e.inicio !== undefined))
const diaInteiro = (d: string) => doDia(d).filter(e => e.inicio === undefined)
const doMes = (d: string) => doDia(d).sort((a, b) => (a.inicio ?? -1) - (b.inicio ?? -1))
const arrastando = (id: string) => arrasto.value?.ativo && arrasto.value.id === id

/* ---------------- criar no horário vazio ---------------- */
const criando = ref<{ dia: string, a: number, b: number, movido: boolean } | null>(null)

function comecarCriacao(ev: PointerEvent, dia: string) {
  if (ev.button !== 0) return
  const r = (ev.currentTarget as HTMLElement).getBoundingClientRect()
  const a = minutoNaColuna(ev.clientY, r, 'piso')
  criando.value = { dia, a, b: a + 60, movido: false }
  const mover = (e: PointerEvent) => {
    if (!criando.value) return
    const m = minutoNaColuna(e.clientY, r)
    if (Math.abs(m - a) >= PASSO) criando.value = { ...criando.value, b: m, movido: true }
  }
  const soltar = (e: PointerEvent) => {
    window.removeEventListener('pointermove', mover)
    window.removeEventListener('pointerup', soltar)
    const c = criando.value
    criando.value = null
    if (!c) return
    const inicio = Math.min(c.a, c.b)
    const fim = c.movido ? Math.max(c.a, c.b) : Math.min(inicio + 60, 24 * 60)
    emit('criar', { dia, inicio, fim }, referenciaDe('[data-rascunho]', e.clientX, e.clientY))
  }
  window.addEventListener('pointermove', mover)
  window.addEventListener('pointerup', soltar)
}

function criarDiaInteiro(ev: PointerEvent, dia: string) {
  if (ev.button !== 0) return
  emit('criar', { dia }, referenciaDe('[data-rascunho]', ev.clientX, ev.clientY))
}

const fantasma = computed<Lugar | null>(() => criando.value
  ? { dia: criando.value.dia, inicio: Math.min(criando.value.a, criando.value.b), fim: Math.max(criando.value.a, criando.value.b) }
  : props.rascunho)

/* ---------------- receber cartão arrastado de fora ---------------- */
const soltura = ref<Lugar | null>(null)
function sobre(ev: DragEvent, dia: string, naGrade: boolean) {
  ev.preventDefault()
  if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move'
  const inicio = naGrade ? minutoNaColuna(ev.clientY, (ev.currentTarget as HTMLElement).getBoundingClientRect(), 'piso') : undefined
  soltura.value = { dia, inicio, fim: inicio === undefined ? undefined : inicio + 60 }
}
function receber(ev: DragEvent) {
  ev.preventDefault()
  const chave = ev.dataTransfer?.getData('text/plain')
  if (chave && soltura.value) emit('soltar', chave, soltura.value)
  soltura.value = null
}
function sairDaGrade(ev: DragEvent) {
  if (!raiz.value?.contains(ev.relatedTarget as Node)) soltura.value = null
}

/* ---------------- rolagem: a semana abre no começo do expediente ---------------- */
const rolagem = ref<HTMLElement | null>(null)
watch(() => props.vista, async () => {
  await nextTick()
  rolagem.value?.scrollTo({ top: props.horaInicial * ALTURA_DA_HORA - 8 })
}, { immediate: true })
onMounted(() => rolagem.value?.scrollTo({ top: props.horaInicial * ALTURA_DA_HORA - 8 }))

const HACHURA = 'bg-[repeating-linear-gradient(135deg,var(--ui-border)_0px,var(--ui-border)_1px,transparent_1px,transparent_8px)]'
const limiteDaFaixa = computed(() => props.vista === 'dia' ? 99 : 3)
</script>

<template>
  <div ref="raiz" class="flex min-h-0 flex-1 flex-col select-none" @dragleave="sairDaGrade" @dragend="soltura = null">
    <!-- ================= MÊS ================= -->
    <template v-if="vista === 'mes'">
      <div class="grid grid-cols-7 border-b border-default">
        <div v-for="d in diasDoMes.slice(0, 7)" :key="d" class="py-2 text-center text-xs font-medium uppercase text-muted">{{ nomeCurto(d) }}</div>
      </div>
      <div :key="data.slice(0, 7)" class="grid min-h-0 flex-1 animate-[entrada_.25s_ease-out_both] grid-cols-7 grid-rows-6">
        <div
          v-for="d in diasDoMes"
          :key="d"
          :data-celula="d"
          class="flex min-h-0 flex-col gap-0.5 overflow-hidden border-b border-r border-default p-1 transition-colors [&:nth-child(7n)]:border-r-0"
          :class="[
            d.slice(0, 7) !== data.slice(0, 7) ? 'bg-elevated/40' : naoUtil(d) ? 'bg-elevated/25' : '',
            soltura?.dia === d ? 'bg-primary/10' : '',
          ]"
          @pointerdown="criarDiaInteiro($event, d)"
          @dragover="sobre($event, d, false)"
          @drop="receber"
        >
          <div class="flex items-center justify-between px-1">
            <span class="truncate text-[10px] text-muted">{{ rotuloDoDia(d) }}</span>
            <button
              type="button"
              class="flex size-6 items-center justify-center rounded-full text-xs transition-colors hover:bg-accented"
              :class="d === hoje ? 'bg-primary font-semibold text-inverted hover:bg-primary' : d.slice(0, 7) !== data.slice(0, 7) ? 'text-dimmed' : 'text-highlighted'"
              @pointerdown.stop
              @click="emit('irParaDia', d)"
            >
              {{ Number(d.slice(8)) }}
            </button>
          </div>
          <div v-if="fantasma?.dia === d" data-rascunho class="h-5 rounded-md border border-dashed border-primary bg-primary/10 px-1.5 text-xs leading-5 text-primary">{{ rotulos.novo }}</div>
          <button
            v-for="e in doMes(d).slice(0, 3)"
            :key="e.id"
            type="button"
            :data-evento="e.id"
            class="flex h-5 w-full shrink-0 items-center gap-1 rounded-md px-1.5 text-left text-xs transition"
            :class="[
              e.inicio === undefined ? [fundoCheio[e.cor], e.estilo === 'marcador' ? `border bg-default ${borda[e.cor]}` : ''] : 'hover:bg-elevated',
              e.passado || e.riscado ? 'opacity-60' : '',
              selecionado === e.id ? anel[e.cor] : '',
              arrastando(e.id) ? 'z-20 shadow-lg' : '',
              e.arrastavel ? 'cursor-grab' : 'cursor-pointer',
            ]"
            @pointerdown="pegarEvento($event, e)"
            @click="clicarEvento(e)"
          >
            <span v-if="e.inicio !== undefined" class="size-2 shrink-0 rounded-full" :class="barra[e.cor]" />
            <UIcon v-else-if="e.icone" :name="e.icone" class="size-3 shrink-0" :class="textoDaCor[e.cor]" />
            <span v-if="e.inicio !== undefined" class="shrink-0 tabular-nums text-toned">{{ hora(e.inicio) }}</span>
            <span class="truncate text-highlighted" :class="e.riscado && 'line-through'">{{ e.titulo }}</span>
            <UIcon v-if="e.alerta" :name="e.alerta === 'atrasado' ? 'i-lucide-circle-alert' : 'i-lucide-clock-alert'" class="ml-auto size-3 shrink-0" :class="e.alerta === 'atrasado' ? 'text-error' : 'text-warning'" />
          </button>
          <button v-if="doMes(d).length > 3" type="button" class="px-1.5 text-left text-xs font-medium text-muted hover:text-highlighted" @pointerdown.stop @click="emit('irParaDia', d)">
            {{ rotulos.mais(doMes(d).length - 3) }}
          </button>
        </div>
      </div>
    </template>

    <!-- ================= DIA E SEMANA ================= -->
    <template v-else>
      <!-- Cabeçalho dos dias e faixa de dia inteiro (fora da rolagem, com a mesma calha da barra de rolagem) -->
      <div class="shrink-0 overflow-hidden border-b border-default [scrollbar-gutter:stable]">
        <div class="grid" :style="colunas">
          <div />
          <div v-for="d in dias" :key="d" class="flex flex-col items-center gap-0.5 border-l border-default py-1.5" :class="naoUtil(d) && 'bg-elevated/40'">
            <span class="text-xs uppercase" :class="d === hoje ? 'font-semibold text-primary' : 'text-muted'">{{ nomeCurto(d) }}</span>
            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-full text-lg transition-colors hover:bg-accented"
              :class="d === hoje ? 'bg-primary font-semibold text-inverted hover:bg-primary' : 'text-highlighted'"
              @click="emit('irParaDia', d)"
            >
              {{ Number(d.slice(8)) }}
            </button>
            <span v-if="rotuloDoDia(d)" class="text-[10px] leading-none text-muted">{{ rotuloDoDia(d) }}</span>
          </div>
        </div>
        <div class="grid border-t border-default" :style="colunas">
          <span class="self-center pr-2 text-right text-[10px] leading-tight text-muted">{{ rotulos.diaInteiro }}</span>
          <div
            v-for="d in dias"
            :key="d"
            :data-faixa="d"
            class="flex min-h-9 flex-col gap-1 border-l border-default p-1 transition-colors"
            :class="[naoUtil(d) && 'bg-elevated/40', soltura?.dia === d && soltura.inicio === undefined && 'bg-primary/10']"
            @pointerdown="criarDiaInteiro($event, d)"
            @dragover="sobre($event, d, false)"
            @drop="receber"
          >
            <div v-if="fantasma?.dia === d && fantasma.inicio === undefined" data-rascunho class="h-6 rounded-md border border-dashed border-primary bg-primary/10 px-1.5 text-xs leading-6 text-primary">{{ rotulos.novo }}</div>
            <button
              v-for="e in diaInteiro(d).slice(0, limiteDaFaixa)"
              :key="e.id"
              type="button"
              :data-evento="e.id"
              class="flex h-6 w-full animate-[entrada_.25s_ease-out_both] items-center gap-1 rounded-md border px-1.5 text-left text-xs transition"
              :class="[
                e.estilo === 'marcador' ? `bg-default hover:bg-elevated ${borda[e.cor]}` : `${fundoCheio[e.cor]} border-transparent`,
                e.passado || e.riscado ? 'opacity-60' : '',
                selecionado === e.id ? anel[e.cor] : '',
                arrastando(e.id) ? 'z-20 animate-none shadow-lg' : '',
                e.arrastavel ? 'cursor-grab' : 'cursor-pointer',
              ]"
              @pointerdown="pegarEvento($event, e)"
              @click="clicarEvento(e)"
            >
              <UIcon :name="e.icone ?? 'i-lucide-flag'" class="size-3.5 shrink-0" :class="textoDaCor[e.cor]" />
              <span class="truncate font-medium text-highlighted" :class="e.riscado && 'line-through'">{{ e.titulo }}</span>
              <span v-if="e.rotuloHora" class="ml-auto shrink-0 tabular-nums text-toned">{{ e.rotuloHora }}</span>
              <UIcon v-if="e.alerta" :name="e.alerta === 'atrasado' ? 'i-lucide-circle-alert' : 'i-lucide-clock-alert'" class="size-3.5 shrink-0" :class="[e.alerta === 'atrasado' ? 'text-error' : 'text-warning', !e.rotuloHora && 'ml-auto']" />
            </button>
            <button v-if="diaInteiro(d).length > limiteDaFaixa" type="button" class="px-1.5 text-left text-xs font-medium text-muted hover:text-highlighted" @pointerdown.stop @click="emit('irParaDia', d)">
              {{ rotulos.mais(diaInteiro(d).length - limiteDaFaixa) }}
            </button>
          </div>
        </div>
      </div>

      <!-- A grade de horas -->
      <div ref="rolagem" class="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable]">
        <div :key="`${vista}-${dias[0]}`" class="grid animate-[entrada_.25s_ease-out_both]" :style="colunas">
          <div class="relative" :style="{ height: `${24 * ALTURA_DA_HORA}px` }">
            <span v-for="h in 23" :key="h" class="absolute right-2 -translate-y-1/2 text-[11px] tabular-nums text-muted" :style="{ top: `${h * ALTURA_DA_HORA}px` }">{{ hora(h * 60) }}</span>
            <span v-if="dias.includes(hoje)" class="absolute right-1 z-10 -translate-y-1/2 rounded bg-error px-1 text-[10px] font-semibold tabular-nums text-white" :style="{ top: `${agora * PX_POR_MINUTO}px` }">{{ hora(agora) }}</span>
          </div>

          <div
            v-for="d in dias"
            :key="d"
            :data-coluna="d"
            class="relative border-l border-default"
            :class="naoUtil(d) && [HACHURA, 'bg-elevated/30']"
            :style="{ height: `${24 * ALTURA_DA_HORA}px` }"
            @pointerdown="comecarCriacao($event, d)"
            @dragover="sobre($event, d, true)"
            @drop="receber"
          >
            <!-- Fora do horário de trabalho do Calendário do sistema -->
            <template v-if="!naoUtil(d)">
              <div class="pointer-events-none absolute inset-x-0 top-0 bg-elevated/50" :style="{ height: `${horario.inicio * PX_POR_MINUTO}px` }" />
              <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-elevated/50" :style="{ top: `${horario.fim * PX_POR_MINUTO}px` }" />
            </template>
            <div v-for="h in 23" :key="h" class="pointer-events-none absolute inset-x-0 border-t border-default" :style="{ top: `${h * ALTURA_DA_HORA}px` }" />

            <template v-if="carregando">
              <USkeleton v-for="[h, n] in [[9, 1], [11, 1.5], [15, 1]]" :key="h" class="absolute inset-x-1 rounded-md" :style="{ top: `${h * ALTURA_DA_HORA}px`, height: `${n * ALTURA_DA_HORA}px` }" />
            </template>

            <template v-else>
              <button
                v-for="p in noHorario(d)"
                :key="p.evento.id"
                type="button"
                :data-evento="p.evento.id"
                class="absolute flex animate-[entrada_.25s_ease-out_both] flex-col items-start overflow-hidden rounded-md border py-1 pl-3 pr-1.5 text-left text-xs transition-[background-color,box-shadow] focus-visible:outline-2 focus-visible:outline-primary"
                :class="[
                  p.evento.estilo === 'contorno' ? `border-dashed bg-default hover:bg-elevated ${borda[p.evento.cor]}` : `${fundoCheio[p.evento.cor]} border-transparent`,
                  p.evento.passado || p.evento.riscado ? 'opacity-60' : '',
                  selecionado === p.evento.id ? anel[p.evento.cor] : '',
                  arrastando(p.evento.id) ? 'z-20 animate-none cursor-grabbing shadow-lg' : 'z-[5]',
                  p.evento.arrastavel ? 'cursor-grab' : 'cursor-pointer',
                ]"
                :style="{ top: `${p.topo + 1}px`, height: `${p.altura - 2}px`, left: `calc(${p.esquerda}% + 2px)`, width: `calc(${p.largura}% - 4px)` }"
                @pointerdown="pegarEvento($event, p.evento)"
                @click="clicarEvento(p.evento)"
              >
                <span class="absolute inset-y-1 left-1 w-1 rounded-full" :class="[barra[p.evento.cor], p.evento.estilo === 'contorno' && 'opacity-50']" />
                <span class="flex w-full min-w-0 items-center gap-1 font-medium text-highlighted">
                  <UIcon v-if="p.evento.icone" :name="p.evento.icone" class="size-3 shrink-0" :class="textoDaCor[p.evento.cor]" />
                  <span class="truncate" :class="p.evento.riscado && 'line-through'">{{ p.evento.titulo }}</span>
                  <UIcon v-if="p.evento.alerta" :name="p.evento.alerta === 'atrasado' ? 'i-lucide-circle-alert' : 'i-lucide-clock-alert'" class="ml-auto size-3 shrink-0" :class="p.evento.alerta === 'atrasado' ? 'text-error' : 'text-warning'" />
                </span>
                <span v-if="p.altura >= 36" class="w-full truncate tabular-nums text-toned">{{ rotulos.intervalo(hora(p.evento.inicio!), hora(p.evento.fim ?? p.evento.inicio! + 60)) }}</span>
                <span v-if="p.evento.redimensionavel" data-alca class="absolute inset-x-0 bottom-0 h-2 cursor-ns-resize" />
              </button>
            </template>

            <!-- Criação em curso ou aberta no popover -->
            <div
              v-if="fantasma?.dia === d && fantasma.inicio !== undefined"
              data-rascunho
              class="pointer-events-none absolute inset-x-1 z-10 rounded-md border border-dashed border-primary bg-primary/15 px-2 py-1 text-xs text-primary shadow-sm"
              :style="{ top: `${fantasma.inicio * PX_POR_MINUTO}px`, height: `${Math.max((fantasma.fim ?? fantasma.inicio + 60) - fantasma.inicio, 15) * PX_POR_MINUTO}px` }"
            >
              <span class="font-medium">{{ rotulos.novo }}</span>
              <span class="ml-1 tabular-nums">{{ rotulos.intervalo(hora(fantasma.inicio), hora(fantasma.fim ?? fantasma.inicio + 60)) }}</span>
            </div>

            <!-- Onde o cartão arrastado de fora vai cair -->
            <div
              v-if="soltura?.dia === d && soltura.inicio !== undefined"
              class="pointer-events-none absolute inset-x-1 z-10 rounded-md border-2 border-dashed border-primary bg-primary/10"
              :style="{ top: `${soltura.inicio * PX_POR_MINUTO}px`, height: `${60 * PX_POR_MINUTO}px` }"
            />

            <div v-if="d === hoje" class="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-error" :style="{ top: `${agora * PX_POR_MINUTO}px` }">
              <span class="absolute -left-1 -top-[5px] size-2 rounded-full bg-error" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
