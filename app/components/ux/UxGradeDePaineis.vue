<script setup lang="ts">
/**
 * Grade de painéis que a pessoa arruma: arrastar para reordenar, puxar o canto
 * para redimensionar. Referência de interação: o dashboard do ClickUp (modo de
 * edição, cartões que se reacomodam, tamanho mínimo e máximo por cartão).
 *
 * Por que é componente próprio: o Nuxt UI não tem grade de dashboard, e o
 * arrastar dos exemplos dele (`TableDragAndDropExample`) usa `useSortable` do
 * `@vueuse/integrations` com `sortablejs`, que não estão instalados aqui.
 * Consulta: MCP `nuxt-ui`, `search-components "grid"` e `"drag"`, e
 * `get-example TableDragAndDropExample`. Registrado em COMPONENTES-CUSTOM.md.
 *
 * Como funciona:
 * - a ordem do array é a ordem da grade (12 colunas; linhas de altura fixa);
 *   `grid-flow-row-dense` sobe o painel que cabe num buraco (o "auto layout"
 *   do ClickUp);
 * - `w` é a largura em colunas e `h` a altura em linhas;
 * - só com `editavel`: arrastar pelo elemento marcado com
 *   `data-alca-de-arraste` (a partir de 4 px de movimento, para o clique
 *   continuar sendo clique), e redimensionar pelo canto inferior direito;
 * - teclado: no botão marcado com `data-grip`, as setas movem o painel; no
 *   canto, as setas mudam o tamanho. Esc durante o arraste desfaz o arraste;
 * - fim de cada gesto que mudou algo: evento `alterado` com o layout de antes,
 *   para quem usa a grade montar o "Desfazer".
 *
 * O conteúdo de cada painel vem pelo slot. A grade não sabe o que há dentro.
 */
export interface ItemDaGrade {
  id: string
  /** Largura em colunas, de 1 a `colunas`. */
  w: number
  /** Altura em linhas de `alturaDaLinha`. */
  h: number
}

export interface LimitesDoPainel {
  minW: number
  maxW: number
  minH: number
  maxH: number
  /** Colunas na tela estreita, onde a grade vira 2 colunas. */
  wCelular?: 1 | 2
}

const props = withDefaults(defineProps<{
  limites: Record<string, LimitesDoPainel>
  rotulos: Record<string, string>
  textos: {
    redimensionar: (nome: string) => string
    movido: (nome: string, posicao: number, total: number) => string
    tamanho: (nome: string, w: number, h: number) => string
  }
  editavel?: boolean
  colunas?: number
  alturaDaLinha?: number
  espaco?: number
}>(), { editavel: false, colunas: 12, alturaDaLinha: 44, espaco: 16 })

const layout = defineModel<ItemDaGrade[]>({ required: true })
const emit = defineEmits<{ alterado: [anterior: ItemDaGrade[]] }>()

defineSlots<{
  default(props: { item: ItemDaGrade, arrastando: boolean, redimensionando: boolean }): unknown
}>()

const grade = ref<HTMLElement | null>(null)
const aviso = ref('')

const copia = (l: ItemDaGrade[]) => l.map(x => ({ ...x }))
const igual = (a: ItemDaGrade[], b: ItemDaGrade[]) => JSON.stringify(a) === JSON.stringify(b)

/* ------------------------------- arrastar -------------------------------- */

const arrastandoId = ref<string | null>(null)
const fantasma = ref<{ x: number, y: number } | null>(null)
let pendente: { id: string, x: number, y: number } | null = null
let antesDoGesto: ItemDaGrade[] | null = null
let ultimoAlvo: string | null = null
let travadoAte = 0

/** O que dentro da alça continua clicável e não começa arraste. */
const INTERATIVOS = 'a, input, select, textarea, [role="tab"], [role="menuitem"], [role="combobox"], button:not([data-grip])'

function aoPressionar(e: PointerEvent) {
  if (!props.editavel || e.button !== 0) return
  const alvo = e.target as HTMLElement
  const alca = alvo.closest('[data-alca-de-arraste]') as HTMLElement | null
  if (!alca || !grade.value?.contains(alca)) return
  if (alvo.closest(INTERATIVOS)) return
  const item = alca.closest('[data-painel]') as HTMLElement | null
  if (!item) return
  e.preventDefault()
  pendente = { id: item.dataset.painel!, x: e.clientX, y: e.clientY }
  window.addEventListener('pointermove', aoMover)
  window.addEventListener('pointerup', aoSoltar, { once: true })
  window.addEventListener('pointercancel', aoSoltar, { once: true })
}

function aoMover(e: PointerEvent) {
  if (pendente && !arrastandoId.value) {
    if (Math.hypot(e.clientX - pendente.x, e.clientY - pendente.y) < 4) return
    arrastandoId.value = pendente.id
    antesDoGesto = copia(layout.value)
    ultimoAlvo = pendente.id
    window.addEventListener('keydown', aoTeclarNoArraste)
  }
  if (!arrastandoId.value) return
  fantasma.value = { x: e.clientX, y: e.clientY }
  if (Date.now() < travadoAte) return
  const sob = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-painel]') as HTMLElement | null
  const alvoId = sob?.dataset.painel
  if (!alvoId || alvoId === arrastandoId.value || alvoId === ultimoAlvo) return
  const lista = [...layout.value]
  const de = lista.findIndex(x => x.id === arrastandoId.value)
  const para = lista.findIndex(x => x.id === alvoId)
  if (de < 0 || para < 0) return
  const [movido] = lista.splice(de, 1)
  lista.splice(para, 0, movido!)
  layout.value = lista
  ultimoAlvo = alvoId
  // Espera os painéis terminarem de andar antes de trocar de novo: sem isso,
  // o painel que acabou de passar por baixo do ponteiro troca de volta.
  travadoAte = Date.now() + 220
}

function encerrarArraste() {
  pendente = null
  arrastandoId.value = null
  fantasma.value = null
  ultimoAlvo = null
  window.removeEventListener('pointermove', aoMover)
  window.removeEventListener('keydown', aoTeclarNoArraste)
}

function aoSoltar() {
  const id = arrastandoId.value
  const antes = antesDoGesto
  encerrarArraste()
  antesDoGesto = null
  if (id && antes && !igual(antes, layout.value)) {
    emit('alterado', antes)
    anunciarPosicao(id)
  }
}

/** Esc no meio do arraste devolve a grade como estava. */
function aoTeclarNoArraste(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !antesDoGesto) return
  e.preventDefault()
  layout.value = antesDoGesto
  antesDoGesto = null
  encerrarArraste()
}

function anunciarPosicao(id: string, lista = layout.value) {
  const i = lista.findIndex(x => x.id === id)
  aviso.value = props.textos.movido(props.rotulos[id] ?? id, i + 1, lista.length)
}

/** Teclado no botão da alça: setas movem o painel uma posição. */
function moverPorTeclado(id: string, passo: number) {
  const lista = [...layout.value]
  const de = lista.findIndex(x => x.id === id)
  const para = Math.max(0, Math.min(lista.length - 1, de + passo))
  if (de === para) return
  const antes = copia(layout.value)
  const [movido] = lista.splice(de, 1)
  lista.splice(para, 0, movido!)
  layout.value = lista
  emit('alterado', antes)
  // `layout.value` só devolve o array novo depois que o pai re-renderiza: anuncia pela lista local.
  anunciarPosicao(id, lista)
  nextTick(() => (grade.value?.querySelector(`[data-painel="${id}"] [data-grip]`) as HTMLElement | null)?.focus())
}

function aoTeclarNaAlca(e: KeyboardEvent) {
  if (!props.editavel) return
  const grip = (e.target as HTMLElement).closest('[data-grip]')
  if (!grip) return
  const id = (grip.closest('[data-painel]') as HTMLElement | null)?.dataset.painel
  if (!id) return
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); moverPorTeclado(id, -1) }
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); moverPorTeclado(id, 1) }
}

/* ----------------------------- redimensionar ----------------------------- */

const redimensionandoId = ref<string | null>(null)
let inicio: { x: number, y: number, w: number, h: number } | null = null

function limitar(id: string, w: number, h: number) {
  const l = props.limites[id] ?? { minW: 1, maxW: props.colunas, minH: 1, maxH: 24 }
  return {
    w: Math.max(l.minW, Math.min(l.maxW, props.colunas, w)),
    h: Math.max(l.minH, Math.min(l.maxH, h)),
  }
}

/** Devolve o tamanho aplicado, ou `null` quando nada mudou. */
function definirTamanho(id: string, w: number, h: number) {
  const t = limitar(id, w, h)
  const atual = layout.value.find(x => x.id === id)
  if (!atual || (atual.w === t.w && atual.h === t.h)) return null
  layout.value = layout.value.map(x => x.id === id ? { ...x, ...t } : x)
  return t
}

function aoPuxarCanto(e: PointerEvent, item: ItemDaGrade) {
  if (!props.editavel || e.button !== 0) return
  e.preventDefault()
  e.stopPropagation()
  redimensionandoId.value = item.id
  antesDoGesto = copia(layout.value)
  inicio = { x: e.clientX, y: e.clientY, w: item.w, h: item.h }
  window.addEventListener('pointermove', aoRedimensionar)
  window.addEventListener('pointerup', aoSoltarCanto, { once: true })
  window.addEventListener('pointercancel', aoSoltarCanto, { once: true })
}

function aoRedimensionar(e: PointerEvent) {
  if (!redimensionandoId.value || !inicio || !grade.value) return
  const largura = grade.value.clientWidth
  const coluna = (largura - props.espaco * (props.colunas - 1)) / props.colunas
  const dw = Math.round((e.clientX - inicio.x) / (coluna + props.espaco))
  const dh = Math.round((e.clientY - inicio.y) / (props.alturaDaLinha + props.espaco))
  definirTamanho(redimensionandoId.value, inicio.w + dw, inicio.h + dh)
}

function aoSoltarCanto() {
  const id = redimensionandoId.value
  const antes = antesDoGesto
  redimensionandoId.value = null
  antesDoGesto = null
  inicio = null
  window.removeEventListener('pointermove', aoRedimensionar)
  if (id && antes && !igual(antes, layout.value)) {
    emit('alterado', antes)
    const item = layout.value.find(x => x.id === id)!
    aviso.value = props.textos.tamanho(props.rotulos[id] ?? id, item.w, item.h)
  }
}

function aoTeclarNoCanto(e: KeyboardEvent, item: ItemDaGrade) {
  const passos: Record<string, [number, number]> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }
  const p = passos[e.key]
  if (!p) return
  e.preventDefault()
  const antes = copia(layout.value)
  const novo = definirTamanho(item.id, item.w + p[0], item.h + p[1])
  if (!novo) return
  emit('alterado', antes)
  aviso.value = props.textos.tamanho(props.rotulos[item.id] ?? item.id, novo.w, novo.h)
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', aoMover)
  window.removeEventListener('pointermove', aoRedimensionar)
  window.removeEventListener('keydown', aoTeclarNoArraste)
})

function variaveis(item: ItemDaGrade) {
  return {
    '--w': String(item.w),
    '--h': String(item.h),
    '--wm': String(props.limites[item.id]?.wCelular ?? 2),
  }
}
</script>

<template>
  <div class="relative">
    <!-- Abaixo de lg a grade vira 2 colunas e o canto de redimensionar some. -->
    <div
      ref="grade"
      class="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-12"
      :style="{ gridAutoRows: `${alturaDaLinha}px`, gap: `${espaco}px` }"
      @pointerdown="aoPressionar"
      @keydown="aoTeclarNaAlca"
    >
      <TransitionGroup move-class="transition-transform duration-200 ease-out motion-reduce:transition-none">
        <div
          v-for="item in layout"
          :key="item.id"
          :data-painel="item.id"
          class="group/grade relative col-span-(--wm) row-span-(--h) min-w-0 scroll-mt-28 lg:col-span-(--w)"
          :style="variaveis(item)"
        >
          <div
            class="h-full rounded-lg transition-[opacity,box-shadow] duration-150"
            :class="[
              arrastandoId === item.id ? 'opacity-40' : '',
              redimensionandoId === item.id ? 'ring-2 ring-primary' : '',
            ]"
          >
            <slot :item="item" :arrastando="arrastandoId === item.id" :redimensionando="redimensionandoId === item.id" />
          </div>

          <!-- O canto de redimensionar: só no modo de edição. -->
          <button
            v-if="editavel"
            type="button"
            class="absolute bottom-0.5 right-0.5 z-20 hidden size-6 cursor-se-resize items-end justify-end rounded-br-lg p-1 text-dimmed transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary lg:flex"
            :class="redimensionandoId === item.id ? 'text-primary' : ''"
            :aria-label="textos.redimensionar(rotulos[item.id] ?? item.id)"
            @pointerdown="aoPuxarCanto($event, item)"
            @keydown="aoTeclarNoCanto($event, item)"
          >
            <svg viewBox="0 0 10 10" class="size-3" aria-hidden="true"><path d="M9 1 1 9M9 5 5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" /></svg>
          </button>

          <!-- Durante o redimensionar, o tamanho em colunas e linhas. -->
          <span
            v-if="redimensionandoId === item.id"
            class="pointer-events-none absolute bottom-2 right-8 z-20 rounded-md bg-inverted px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-inverted"
          >{{ item.w }} × {{ item.h }}</span>
        </div>
      </TransitionGroup>
    </div>

    <!-- O que segue o ponteiro durante o arraste. -->
    <Teleport to="body">
      <div
        v-if="fantasma && arrastandoId"
        class="pointer-events-none fixed z-[100] flex -translate-x-4 -translate-y-4 items-center gap-2 rounded-lg border border-primary/40 bg-default px-3 py-2 text-sm font-medium text-highlighted shadow-xl"
        :style="{ left: `${fantasma.x}px`, top: `${fantasma.y}px` }"
      >
        <UIcon name="i-lucide-grip-vertical" class="size-4 text-primary" />
        {{ rotulos[arrastandoId] }}
      </div>
    </Teleport>

    <p class="sr-only" aria-live="polite">
      {{ aviso }}
    </p>
  </div>
</template>
