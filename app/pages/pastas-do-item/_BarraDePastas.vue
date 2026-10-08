<script setup lang="ts">
/**
 * A barra de folders do item. É o objeto da demanda: tudo aqui é proposta,
 * menos o estilo "hoje", que copia a preview de 08/10/2026 para comparar.
 *
 * Os 2 estilos usam o MESMO `UTabs` (Nuxt UI) e mudam só a prop `ui`, com
 * token semântico. O comportamento é igual nos 2: clicar, arrastar para
 * reordenar, botão direito (Editar, Ocultar, Excluir), "+N" com as que não
 * cabem e "Nova folder".
 *
 *   hoje        cada folder é um chip com contorno e sombra; a ativa ganha
 *               fundo azul e contorno azul. Nada liga a barra ao conteúdo.
 *   sublinhado  texto sobre uma linha de base contínua; a ativa ganha um
 *               traço de 2 px que desliza até ela. A linha de base é a
 *               borda de cima do conteúdo.
 *
 * Arrastar é por ponteiro (não drag-and-drop do HTML): a folder segue o mouse
 * e as vizinhas abrem espaço, como as abas do navegador. O `UTabs` não expõe
 * atributo por item, então o arrasto lê o DOM dos gatilhos (`data-slot=trigger`).
 */
import type { ContextMenuItem } from '@nuxt/ui'
import type { Pasta } from './mocks'
import type { Textos } from './textos'

export type Estilo = 'hoje' | 'sublinhado'

const props = defineProps<{
  t: Textos
  estilo: Estilo
}>()

const pastas = defineModel<Pasta[]>('pastas', { required: true })
const ativa = defineModel<string>('ativa', { required: true })

const emit = defineEmits<{
  editar: [id: string]
  ocultar: [id: string]
  excluir: [id: string]
  nova: []
  /** A ordem mudou: quem usa salva e oferece Desfazer com a ordem anterior. */
  reordenada: [anterior: Pasta[]]
}>()

const nomeDe = (p: Pasta) => p.nome ?? props.t.pastas[p.id] ?? p.id

/* ---------- quantas cabem ---------- */

const barra = ref<HTMLElement>()
const medidas = ref<HTMLElement>()
const larguraDisponivel = ref(0)
const larguras = ref<Record<string, number>>({})

/** Espaço da ponta direita ("+N", "+"), e o espaço entre folders em cada estilo. */
const reservaDireita = computed(() => props.estilo === 'hoje' ? 64 : 96)
const vao = computed(() => props.estilo === 'hoje' ? 4 : props.estilo === 'sublinhado' ? 4 : 2)

function medir() {
  if (!barra.value || !medidas.value) return
  larguraDisponivel.value = barra.value.clientWidth
  const novas: Record<string, number> = {}
  medidas.value.querySelectorAll<HTMLElement>('[data-medida]').forEach((el) => {
    novas[el.dataset.medida!] = el.offsetWidth
  })
  larguras.value = novas
}

let observador: ResizeObserver | undefined
onMounted(() => {
  observador = new ResizeObserver(() => medir())
  if (barra.value) observador.observe(barra.value)
  nextTick(medir)
})
onBeforeUnmount(() => observador?.disconnect())
watch(() => [props.estilo, props.t, pastas.value.map(p => p.id + nomeDe(p)).join()], () => nextTick(medir))

/**
 * As que cabem, na ordem. A ativa sempre aparece: se ela estiver depois do
 * corte, entra no lugar da última que cabia (Notion e Chrome fazem igual).
 */
const visiveis = computed(() => {
  const limite = larguraDisponivel.value - reservaDireita.value
  if (limite <= 0) return pastas.value
  const cabem: Pasta[] = []
  let soma = 0
  for (const p of pastas.value) {
    const w = (larguras.value[p.id] ?? 110) + vao.value + (p.id === ativa.value && props.estilo !== 'hoje' ? 24 : 0)
    if (soma + w > limite) break
    cabem.push(p)
    soma += w
  }
  const atual = pastas.value.find(p => p.id === ativa.value)
  if (atual && !cabem.includes(atual)) {
    const w = (larguras.value[atual.id] ?? 110) + vao.value
    while (cabem.length && soma + w > limite) {
      const saiu = cabem.pop()!
      soma -= (larguras.value[saiu.id] ?? 110) + vao.value
    }
    cabem.push(atual)
  }
  return cabem
})

const escondidas = computed(() => pastas.value.filter(p => !visiveis.value.includes(p)))

const itensDasAbas = computed(() => visiveis.value.map(p => ({
  value: p.id,
  label: nomeDe(p),
  icon: p.icone,
  badge: props.estilo !== 'hoje' && p.contagem ? p.contagem : undefined,
})))

/* ---------- arrastar para reordenar ---------- */

const arrastando = ref<string | null>(null)
const anuncio = ref('')
let inicio: { id: string, x: number, de: number, rects: DOMRect[], els: HTMLElement[], alvo: number } | null = null
let engatou = false

function gatilhos(): HTMLElement[] {
  return barra.value ? [...barra.value.querySelectorAll<HTMLElement>('[data-slot=trigger]')] : []
}

function aoPressionar(e: PointerEvent) {
  if (e.button !== 0) return
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  if (!el) return
  const els = gatilhos()
  const de = els.indexOf(el)
  if (de < 0) return
  inicio = { id: visiveis.value[de]!.id, x: e.clientX, de, rects: els.map(x => x.getBoundingClientRect()), els, alvo: de }
  engatou = false
  window.addEventListener('pointermove', aoMover)
  window.addEventListener('pointerup', aoSoltar, { once: true })
}

function aoMover(e: PointerEvent) {
  if (!inicio) return
  const dx = e.clientX - inicio.x
  if (!engatou && Math.abs(dx) < 5) return
  if (!engatou) {
    engatou = true
    arrastando.value = inicio.id
    document.body.style.cursor = 'grabbing'
  }
  const { rects, els, de } = inicio
  const minimo = rects[0]!.left - rects[de]!.left
  const maximo = rects.at(-1)!.right - rects[de]!.right
  const desloc = Math.max(minimo, Math.min(maximo, dx))
  const centro = rects[de]!.left + rects[de]!.width / 2 + desloc
  let alvo = 0
  rects.forEach((r, i) => {
    if (i !== de && r.left + r.width / 2 < centro) alvo++
  })
  inicio.alvo = alvo
  const passo = rects[de]!.width + vao.value
  const iAtiva = visiveis.value.findIndex(p => p.id === ativa.value)
  els.forEach((el, i) => {
    if (i === de) {
      if (i === iAtiva) {
        menuSemTransicao.value = true
        deslocMenu.value = desloc
      }
      el.style.transition = 'none'
      el.style.transform = `translateX(${desloc}px)`
      el.dataset.arrastando = 'true'
      return
    }
    el.style.transition = ''
    let mover = 0
    if (de < alvo && i > de && i <= alvo) mover = -passo
    if (de > alvo && i < de && i >= alvo) mover = passo
    el.style.transform = mover ? `translateX(${mover}px)` : ''
    if (i === iAtiva) {
      menuSemTransicao.value = false
      deslocMenu.value = mover
    }
  })
}

function aoSoltar() {
  window.removeEventListener('pointermove', aoMover)
  document.body.style.cursor = ''
  if (!inicio) return
  const { els, de, alvo, id } = inicio
  inicio = null
  if (!engatou) return
  // O clique que fecha o arrasto não vira troca de folder.
  window.addEventListener('click', ev => ev.stopPropagation(), { capture: true, once: true })
  els.forEach((el) => {
    el.style.transition = 'none'
    el.style.transform = ''
    delete el.dataset.arrastando
  })
  requestAnimationFrame(() => els.forEach((el) => { el.style.transition = '' }))
  menuSemTransicao.value = true
  arrastando.value = null
  if (alvo !== de) mover(id, visiveis.value[alvo]!.id)
  nextTick(posicionarMenu)
}

/** Move a folder `id` para o lugar onde está `destino`, na lista inteira. */
function mover(id: string, destino: string) {
  const anterior = pastas.value
  const lista = [...anterior]
  const de = lista.findIndex(p => p.id === id)
  const para = lista.findIndex(p => p.id === destino)
  if (de === para) return
  const [p] = lista.splice(de, 1)
  lista.splice(para, 0, p!)
  pastas.value = lista
  anuncio.value = props.t.barra.movida(nomeDe(p!), para + 1)
  emit('reordenada', anterior)
}

/** Teclado: Ctrl + Shift + seta move a folder ativa. */
function aoTeclar(e: KeyboardEvent) {
  if (!(e.ctrlKey && e.shiftKey) || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return
  e.preventDefault()
  const i = pastas.value.findIndex(p => p.id === ativa.value)
  const j = e.key === 'ArrowLeft' ? i - 1 : i + 1
  if (j < 0 || j >= pastas.value.length) return
  mover(ativa.value, pastas.value[j]!.id)
}

/**
 * A folder abre no CLIQUE (soltar sem arrastar), não no mousedown.
 * O `TabsTrigger` ativa no mousedown; aqui o mousedown para na barra, para que
 * arrastar uma folder fechada não a abra e o botão direito nunca troque de
 * folder. Enter e Espaço continuam abrindo (ativação manual do UTabs).
 */
function segurarAtivacao(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('[data-slot=trigger]')) e.stopPropagation()
}

function aoClicar(e: MouseEvent) {
  if (e.button !== 0) return
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  const p = el ? visiveis.value[gatilhos().indexOf(el)] : undefined
  if (p) ativa.value = p.id
}

/** Clique duplo na folder abre Editar (Notion, Airtable, abas de planilha). Só nos estilos propostos. */
function aoClicarDuasVezes(e: MouseEvent) {
  if (props.estilo === 'hoje') return
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  const p = el ? visiveis.value[gatilhos().indexOf(el)] : undefined
  if (p) emit('editar', p.id)
}

/* ---------- menus ---------- */

const doMenu = ref<Pasta | null>(null)

function aoBotaoDireito(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  doMenu.value = el ? visiveis.value[gatilhos().indexOf(el)] ?? null : null
}

function acoesDe(p: Pasta): ContextMenuItem[][] {
  return [
    [
      { label: props.t.barra.editar, icon: 'i-lucide-pencil', onSelect: () => emit('editar', p.id) },
      { label: props.t.barra.ocultar, icon: 'i-lucide-eye-off', onSelect: () => emit('ocultar', p.id) },
    ],
    // Proposta: folder do sistema não se exclui; o menu diz isso em vez de abrir um modal que recusa.
    [props.estilo !== 'hoje' && p.sistema
      ? { label: props.t.barra.excluir, icon: 'i-lucide-trash-2', disabled: true, description: props.t.barra.soOcultar }
      : { label: props.t.barra.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => emit('excluir', p.id) }],
  ]
}

const itensDoMenu = computed<ContextMenuItem[][]>(() => doMenu.value
  ? acoesDe(doMenu.value)
  : [[{ label: props.t.barra.novaFolder, icon: 'i-lucide-plus', onSelect: () => emit('nova') }]])

const busca = ref('')
const listaAberta = ref(false)
const filtradas = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return q ? escondidas.value.filter(p => nomeDe(p).toLowerCase().includes(q)) : escondidas.value
})

/** Itens do CommandPalette do "+N" (a busca é a do próprio componente). */
const itensEscondidos = computed(() => escondidas.value.map(p => ({
  id: p.id,
  label: nomeDe(p),
  icon: p.icone,
  pasta: p,
})))

function abrirEscondida(p: Pasta) {
  ativa.value = p.id
  listaAberta.value = false
  busca.value = ''
}

/* ---------- botão de opções na folder ativa ---------- */

/**
 * O menu da folder fica à vista na ativa (Notion, monday, Attio), além do
 * botão direito. Não pode morar DENTRO da aba, que já é um botão; então é um
 * botão à parte, posicionado sobre a ponta direita da aba ativa, que reserva
 * esse espaço (`pr-8`).
 */
const posMenu = ref<{ left: number, top: number, height: number } | null>(null)
/** Durante o arrasto, a seta anda junto com a aba aberta (arrastada ou vizinha que desliza). */
const deslocMenu = ref(0)
const menuSemTransicao = ref(false)

function posicionarMenu() {
  if (props.estilo === 'hoje' || !barra.value) {
    posMenu.value = null
    return
  }
  const el = barra.value.querySelector<HTMLElement>('[data-slot=trigger][data-state=active]')
  if (!el) {
    posMenu.value = null
    return
  }
  const base = barra.value.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  posMenu.value = { left: r.right - base.left - 30, top: r.top - base.top, height: r.height }
  deslocMenu.value = 0
  requestAnimationFrame(() => { menuSemTransicao.value = false })
}

watch([ativa, visiveis, () => props.estilo, larguraDisponivel], () => nextTick(() => requestAnimationFrame(posicionarMenu)))

const pastaAtivaObj = computed(() => pastas.value.find(p => p.id === ativa.value))

/* ---------- aparência ---------- */

/** O que cada estilo muda no `UTabs`. Só prop `ui`, só token. */
const aparencia = computed(() => {
  switch (props.estilo) {
    case 'sublinhado':
      return {
        variant: 'link' as const,
        ui: {
          root: 'gap-0',
          list: 'gap-1 px-3 pb-0 pt-1 border-default overflow-x-clip',
          // O traço não é o indicador do UTabs: é da própria aba (after), para ir junto quando ela é arrastada.
          indicator: 'hidden',
          trigger: [
            'px-2.5 py-2.5 my-0 gap-2 text-sm cursor-pointer select-none isolate',
            'transition-[color,padding,transform] duration-200 ease-out',
            'data-[state=inactive]:text-muted hover:data-[state=inactive]:text-highlighted',
            // Hover sem fundo: o texto fica mais forte e um traço rosa fraco cresce sobre a linha de base,
            // no lugar do traço da ativa (prévia da seleção, na cor de destaque).
            'after:absolute after:inset-x-1 after:-bottom-px after:h-0.5 after:rounded-full after:scale-x-0 after:transition-all after:duration-200 after:ease-out',
            'data-[state=inactive]:after:bg-primary/35 hover:data-[state=inactive]:after:scale-x-100',
            'data-[state=active]:after:bg-primary data-[state=active]:after:scale-x-100',
            'data-[state=active]:font-semibold data-[state=active]:pr-8',
            // Arrastando: sem ficha, sem sombra, sem subir. Desliza o espaço da aba (fundo da página, que cobre
            // as vizinhas ao passar por cima) com a barra embaixo: rosa forte na aberta, rosa fraco na fechada.
            'before:absolute before:inset-0 before:-z-10',
            'data-[arrastando=true]:z-10 data-[arrastando=true]:cursor-grabbing data-[arrastando=true]:text-highlighted',
            'data-[arrastando=true]:before:bg-default data-[arrastando=true]:after:scale-x-100',
          ].join(' '),
          leadingIcon: 'size-4',
          trailingBadge: 'rounded-full px-1.5 min-w-5 justify-center bg-elevated ring-0 text-muted group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary',
        },
      }
    default:
      // Cópia da preview: chip com contorno e sombra, ativo em azul.
      return {
        variant: 'pill' as const,
        ui: {
          root: 'gap-0',
          list: 'gap-1 rounded-none bg-muted px-1 py-1 overflow-x-clip',
          indicator: 'hidden',
          trigger: [
            'grow-0 h-7 rounded-md px-2 py-0 gap-1.5 text-xs shadow-xs ring ring-inset cursor-grab select-none',
            'transition-[color,background-color,box-shadow,transform]',
            // o arrasto é do protótipo (a preview usa o arrasto nativo do HTML); aqui a ficha passa por cima
            'data-[arrastando=true]:z-10 data-[arrastando=true]:shadow-md data-[arrastando=true]:cursor-grabbing',
            'data-[state=inactive]:bg-default data-[state=inactive]:text-muted data-[state=inactive]:ring-0 hover:data-[state=inactive]:bg-accented',
            'data-[state=active]:bg-primary/10 data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:ring-primary/25',
          ].join(' '),
          leadingIcon: 'size-4',
        },
      }
  }
})
</script>

<template>
  <div class="relative">
    <!-- Régua invisível: mede cada folder no estilo atual para saber quantas cabem. -->
    <!-- A caixa recorta a régua: sem ela, a régua mais larga que o painel faz a página rolar para o lado. -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-hidden" aria-hidden="true">
    <div ref="medidas" class="invisible flex w-max whitespace-nowrap">
      <span
        v-for="p in pastas"
        :key="p.id"
        :data-medida="p.id"
        class="inline-flex items-center border border-transparent"
        :class="estilo === 'hoje' ? 'gap-1.5 px-2 text-xs font-semibold' : 'gap-2 px-3 text-sm font-semibold'"
      ><!-- a folder ativa ganha 24 px do botão de opções, somados no cálculo -->
        <UIcon :name="p.icone" class="size-4" />
        {{ nomeDe(p) }}
        <span v-if="estilo !== 'hoje' && p.contagem" class="min-w-5 px-1.5 text-xs">{{ p.contagem }}</span>
      </span>
    </div>
    </div>

    <div
      ref="barra"
      class="relative min-w-0"
      @pointerdown="aoPressionar"
      @mousedown.capture="segurarAtivacao"
      @click="aoClicar"
      @keydown="aoTeclar"
      @dblclick="aoClicarDuasVezes"
    >
      <UContextMenu :items="itensDoMenu" :ui="{ content: 'w-60', itemDescription: 'whitespace-normal' }">
        <div @contextmenu.capture="aoBotaoDireito">
          <UTabs
            v-model="ativa"
            :items="itensDasAbas"
            :variant="aparencia.variant"
            color="primary"
            size="md"
            :content="false"
            activation-mode="manual"
            :ui="aparencia.ui"
            :aria-label="t.barra.rotulo"
            :title="t.barra.arrastarDica"
            :class="arrastando ? '[&_[data-slot=trigger]]:cursor-grabbing' : ''"
          >
            <template #list-trailing>
              <div
                class="ml-auto flex shrink-0 items-center gap-1 self-center pl-2"
                @pointerdown.stop
              >
                <!-- HOJE: um botão só. "+N" quando sobra folder, "+" quando não; os dois abrem o mesmo menu. -->
                <UPopover
                  v-if="estilo === 'hoje'"
                  v-model:open="listaAberta"
                  :content="{ align: 'end', sideOffset: 6 }"
                >
                  <UButton
                    :label="escondidas.length ? `+${escondidas.length}` : undefined"
                    :icon="escondidas.length ? undefined : 'i-lucide-plus'"
                    trailing-icon="i-lucide-chevron-down"
                    color="neutral"
                    variant="outline"
                    size="xs"
                    class="h-7 shadow-xs ring-default"
                  />
                  <template #content>
                    <div class="w-56 p-1.5">
                      <UInput v-if="escondidas.length" v-model="busca" icon="i-lucide-search" :placeholder="t.barra.pesquisar" size="sm" class="mb-1 w-full" autofocus />
                      <button
                        v-for="p in filtradas"
                        :key="p.id"
                        type="button"
                        class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-default transition-colors hover:bg-elevated"
                        @click="abrirEscondida(p)"
                      >
                        <UIcon :name="p.icone" class="size-4 text-muted" />
                        <span class="flex-1 truncate">{{ nomeDe(p) }}</span>
                      </button>
                      <USeparator v-if="escondidas.length" class="my-1" />
                      <button
                        type="button"
                        class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium text-default transition-colors hover:bg-elevated"
                        @click="listaAberta = false; emit('nova')"
                      >
                        <UIcon name="i-lucide-plus" class="size-4" />
                        {{ t.barra.novaFolder }}
                      </button>
                    </div>
                  </template>
                </UPopover>

                <!-- PROPOSTA: "+N" só aparece quando sobra folder; "+" cria direto, sem menu de um item só. -->
                <template v-else>
                  <UPopover
                    v-if="escondidas.length"
                    v-model:open="listaAberta"
                    :content="{ align: 'end', sideOffset: 6 }"
                  >
                    <UButton
                      :label="`+${escondidas.length}`"
                      trailing-icon="i-lucide-chevron-down"
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      :aria-label="t.barra.maisFolders(escondidas.length)"
                      class="text-muted"
                    />
                    <template #content>
                      <!-- Popover + CommandPalette: o padrão do Nuxt UI para lista com busca (exemplo PopoverCommandPalette). -->
                      <UCommandPalette
                        v-model:search-term="busca"
                        :groups="[{ id: 'escondidas', items: itensEscondidos }]"
                        :placeholder="t.barra.pesquisar"
                        class="w-64"
                        :ui="{ input: '[&>input]:h-9 [&>input]:text-sm', item: 'group/linha' }"
                        @update:model-value="(i: any) => i && abrirEscondida(i.pasta)"
                      >
                        <template #empty>
                          <p class="py-4 text-center text-sm text-muted">{{ t.barra.nenhumaEncontrada }}</p>
                        </template>
                        <template #item-trailing="{ item }">
                          <span v-if="item.pasta.contagem" class="text-xs text-muted">{{ item.pasta.contagem }}</span>
                          <UDropdownMenu :items="acoesDe(item.pasta)" :content="{ align: 'start', side: 'right' }" :ui="{ content: 'w-60', itemDescription: 'whitespace-normal' }">
                            <UButton
                              icon="i-lucide-ellipsis"
                              color="neutral"
                              variant="ghost"
                              size="xs"
                              class="-my-1 opacity-0 transition-opacity group-hover/linha:opacity-100 group-data-highlighted/linha:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                              :aria-label="t.barra.opcoes(nomeDe(item.pasta))"
                              @click.stop
                              @pointerdown.stop
                            />
                          </UDropdownMenu>
                        </template>
                      </UCommandPalette>
                    </template>
                  </UPopover>

                  <UTooltip :text="t.barra.novaFolder">
                    <UButton
                      icon="i-lucide-plus"
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      class="text-muted"
                      :aria-label="t.barra.novaFolder"
                      @click="emit('nova')"
                    />
                  </UTooltip>
                </template>
              </div>
            </template>
          </UTabs>
        </div>
      </UContextMenu>

      <UDropdownMenu
        v-if="posMenu && pastaAtivaObj"
        :items="acoesDe(pastaAtivaObj)"
        :content="{ align: 'start', sideOffset: 4 }"
        :ui="{ content: 'w-60', itemDescription: 'whitespace-normal' }"
      >
        <UButton
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="ghost"
          size="xs"
          class="absolute z-[5] size-6 justify-center p-0 text-muted hover:text-highlighted"
          :style="{
            left: `${posMenu.left}px`,
            top: `${posMenu.top + posMenu.height / 2 - 12}px`,
            transform: `translateX(${deslocMenu}px)`,
            transition: menuSemTransicao ? 'none' : 'transform 200ms ease-out',
          }"
          :aria-label="t.barra.opcoes(nomeDe(pastaAtivaObj))"
          @pointerdown.stop
        />
      </UDropdownMenu>
    </div>

    <span class="sr-only" aria-live="polite">{{ anuncio }}</span>
  </div>
</template>
