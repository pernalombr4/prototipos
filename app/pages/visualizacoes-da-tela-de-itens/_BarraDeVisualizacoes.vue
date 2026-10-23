<script setup lang="ts">
/**
 * PROPOSTA: a barra de visualizações da tela nova de itens.
 *
 * Mesmas peças das folders do item (protótipo pastas-do-item, modelo
 * Sublinhado, já na branch do PR 2936), outra forma:
 *
 *   folders         texto sobre linha de base; a aberta ganha um traço embaixo.
 *   visualizações   pílula clara; a ativa ganha fundo suave na cor de destaque.
 *                   Sem traço: o traço é a marca das folders.
 *
 * O que vem das folders, igual: arrastar (a vizinha troca na metade, sem cópia
 * translúcida, soltar no lugar não faz nada, aviso com Desfazer), seta ⌄ na
 * ativa com o menu, botão direito, "+N" com busca, "+" na ponta, teclado
 * (setas, Ctrl + Shift + seta) e anúncio ao leitor de tela.
 *
 * O que é só daqui: nome cortado pela largura com tooltip que mostra o nome
 * inteiro e o que a visualização filtra; ponto na ativa quando ela tem mudança
 * não salva; renomear na própria pílula (clique duplo ou F2); fixar no
 * começo; mover pelo menu (alternativa ao arrasto, WCAG 2.5.7).
 *
 * "Itens" (a padrão do sistema) fica sempre em primeiro e não se arrasta.
 */
import type { ContextMenuItem } from '@nuxt/ui'
import type { Visualizacao } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  podeEditar: boolean
  /** A visualização ativa tem filtro, ordenação ou coluna mexidos e não salvos. */
  modificada: boolean
  /** Todas as que têm mudança não salva: a ativa mostra o ponto na seta; as outras, depois do nome. */
  modificadas: string[]
  contagens: Record<string, number>
  resumoDe: (v: Visualizacao) => string
}>()

const visualizacoes = defineModel<Visualizacao[]>('visualizacoes', { required: true })
const ativa = defineModel<string>('ativa', { required: true })

const emit = defineEmits<{
  configurar: [ref: string]
  duplicar: [ref: string]
  copiarLink: [ref: string]
  definirPadrao: [ref: string]
  excluir: [ref: string]
  renomeada: [ref: string, anterior: string]
  fixada: [ref: string, fixou: boolean]
  nomeRepetido: [nome: string]
  /** A ordem mudou: quem usa avisa e oferece Desfazer com a ordem anterior. */
  reordenada: [anterior: Visualizacao[]]
}>()

const SISTEMA = 'default'
const nomeDe = (v: Visualizacao) => v.name ?? ''

/* ---------- quantas cabem ---------- */

const barra = ref<HTMLElement>()
const medidas = ref<HTMLElement>()
const larguraDisponivel = ref(0)
const larguras = ref<Record<string, number>>({})

/** Espaço da ponta direita ("+N" e "+") e o espaço entre pílulas. */
const RESERVA = 112
const VAO = 4
/** A ativa ganha a seta ⌄ (e o ponto, quando modificada). */
const EXTRA_DA_ATIVA = 26

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
watch(() => [props.t, visualizacoes.value.map(v => v.reference + nomeDe(v) + v.icon + v.fixada).join()], () => nextTick(medir))

/**
 * As que cabem, na ordem. A ativa sempre aparece: se ela estiver depois do
 * corte, entra no lugar da última que cabia (Notion, ClickUp e Chrome fazem igual).
 */
const visiveis = computed(() => {
  const limite = larguraDisponivel.value - RESERVA
  if (limite <= 0) return visualizacoes.value
  const larguraDe = (v: Visualizacao) => (larguras.value[v.reference] ?? 120) + VAO + (v.reference === ativa.value ? EXTRA_DA_ATIVA : 0)
  const cabem: Visualizacao[] = []
  let soma = 0
  for (const v of visualizacoes.value) {
    const w = larguraDe(v)
    if (soma + w > limite) break
    cabem.push(v)
    soma += w
  }
  const atual = visualizacoes.value.find(v => v.reference === ativa.value)
  if (atual && !cabem.includes(atual)) {
    const w = larguraDe(atual)
    while (cabem.length > 1 && soma + w > limite) {
      const saiu = cabem.pop()!
      soma -= larguraDe(saiu)
    }
    cabem.push(atual)
  }
  return cabem
})

const escondidas = computed(() => visualizacoes.value.filter(v => !visiveis.value.includes(v)))

const itensDasAbas = computed(() => visiveis.value.map(v => ({
  value: v.reference,
  label: nomeDe(v),
  icon: v.icon ?? 'i-lucide-table',
  vis: v,
})))

/* ---------- arrastar para reordenar (mesma mecânica das folders) ---------- */

const arrastando = ref<string | null>(null)
const anuncio = ref('')
let inicio: { id: string, x: number, de: number, rects: DOMRect[], els: HTMLElement[], alvo: number } | null = null
let engatou = false

function gatilhos(): HTMLElement[] {
  return barra.value ? [...barra.value.querySelectorAll<HTMLElement>('[data-slot=trigger]')] : []
}

function aoPressionar(e: PointerEvent) {
  if (e.button !== 0 || renomeando.value) return
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  if (!el) return
  const els = gatilhos()
  const de = els.indexOf(el)
  // "Itens" não se arrasta: é a âncora da barra.
  if (de < 0 || visiveis.value[de]!.reference === SISTEMA) return
  inicio = { id: visiveis.value[de]!.reference, x: e.clientX, de, rects: els.map(x => x.getBoundingClientRect()), els, alvo: de }
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
  // Não passa para antes de "Itens".
  const minimo = rects[1]!.left - rects[de]!.left
  const maximo = rects.at(-1)!.right - rects[de]!.right
  const desloc = Math.max(minimo, Math.min(maximo, dx))
  const centro = rects[de]!.left + rects[de]!.width / 2 + desloc
  let alvo = 0
  rects.forEach((r, i) => {
    if (i !== de && r.left + r.width / 2 < centro) alvo++
  })
  alvo = Math.max(1, alvo)
  inicio.alvo = alvo
  const passo = rects[de]!.width + VAO
  const iAtiva = visiveis.value.findIndex(v => v.reference === ativa.value)
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
  // O clique que fecha o arrasto não troca de visualização.
  window.addEventListener('click', ev => ev.stopPropagation(), { capture: true, once: true })
  els.forEach((el) => {
    el.style.transition = 'none'
    el.style.transform = ''
    delete el.dataset.arrastando
  })
  requestAnimationFrame(() => els.forEach((el) => { el.style.transition = '' }))
  menuSemTransicao.value = true
  arrastando.value = null
  if (alvo !== de) mover(id, visualizacoes.value.indexOf(visiveis.value[alvo]!))
  nextTick(posicionarMenu)
}

/** Move a visualização `id` para a posição `para` da lista inteira. Fixar e desafixar também passam aqui. */
function mover(id: string, para: number, silencioso = false) {
  const tinhaFoco = !!barra.value?.contains(document.activeElement)
  const anterior = visualizacoes.value
  const lista = [...anterior]
  const de = lista.findIndex(v => v.reference === id)
  para = Math.max(1, Math.min(lista.length - 1, para))
  if (de === para || de < 0) return
  const [v] = lista.splice(de, 1)
  lista.splice(para, 0, v!)
  visualizacoes.value = lista
  anuncio.value = props.t.barra.movida(nomeDe(v!), para + 1)
  if (!silencioso) emit('reordenada', anterior)
  if (tinhaFoco) {
    nextTick(() => gatilhos()[visiveis.value.findIndex(x => x.reference === id)]?.focus())
  }
}

const posicao = (id: string) => visualizacoes.value.findIndex(v => v.reference === id)

/** Teclado: Ctrl + Shift + seta move a ativa; F2 renomeia a ativa; Shift + F10 abre o menu dela (WAI-ARIA APG). */
function aoTeclar(e: KeyboardEvent) {
  if (renomeando.value) return
  if (e.key === 'F10' && e.shiftKey) {
    e.preventDefault()
    menuAberto.value = true
    return
  }
  if (e.key === 'F2' && props.podeEditar && ativa.value !== SISTEMA) {
    e.preventDefault()
    comecarARenomear(ativa.value)
    return
  }
  if (!(e.ctrlKey && e.shiftKey) || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return
  e.preventDefault()
  if (ativa.value === SISTEMA) return
  const i = posicao(ativa.value)
  mover(ativa.value, e.key === 'ArrowLeft' ? i - 1 : i + 1)
}

/** Abre no clique (soltar sem arrastar), não no mousedown, como nas folders. */
function segurarAtivacao(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('[data-slot=trigger]')) e.stopPropagation()
}

function aoClicar(e: MouseEvent) {
  if (e.button !== 0 || renomeando.value) return
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  const v = el ? visiveis.value[gatilhos().indexOf(el)] : undefined
  if (v) ativa.value = v.reference
}

function aoClicarDuasVezes(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  const v = el ? visiveis.value[gatilhos().indexOf(el)] : undefined
  if (v && props.podeEditar && v.reference !== SISTEMA) comecarARenomear(v.reference)
}

/* ---------- renomear na própria pílula ---------- */

const renomeando = ref<string | null>(null)
const nomeNovo = ref('')
const posRenomear = ref<{ left: number, top: number, width: number, height: number } | null>(null)
const campoRenomear = ref<{ inputRef: HTMLInputElement } | null>(null)

function comecarARenomear(id: string) {
  const v = visualizacoes.value.find(x => x.reference === id)
  if (!v) return
  if (!visiveis.value.includes(v)) ativa.value = id
  nextTick(() => {
    const el = gatilhos()[visiveis.value.findIndex(x => x.reference === id)]
    if (!el || !barra.value) return
    const base = barra.value.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    posRenomear.value = { left: r.left - base.left, top: r.top - base.top, width: Math.max(r.width, 176), height: r.height }
    nomeNovo.value = nomeDe(v)
    renomeando.value = id
    nextTick(() => campoRenomear.value?.inputRef?.select())
  })
}

function concluirRenomear(gravar: boolean) {
  const id = renomeando.value
  if (!id) return
  renomeando.value = null
  const nome = nomeNovo.value.trim()
  const v = visualizacoes.value.find(x => x.reference === id)!
  // Nome repetido não grava (Polaris recusa com mensagem; aqui o nome volta e o aviso explica).
  const repetido = visualizacoes.value.some(x => x.reference !== id && nomeDe(x).toLowerCase() === nome.toLowerCase())
  if (gravar && repetido) {
    anuncio.value = props.t.barra.nomeRepetido
    emit('nomeRepetido', nome)
  }
  else if (gravar && nome && nome !== nomeDe(v)) {
    const anterior = nomeDe(v)
    visualizacoes.value = visualizacoes.value.map(x => x.reference === id ? { ...x, name: nome } : x)
    emit('renomeada', id, anterior)
  }
  nextTick(() => gatilhos()[visiveis.value.findIndex(x => x.reference === id)]?.focus())
}

/* ---------- menus ---------- */

const doMenu = ref<Visualizacao | null>(null)

function aoBotaoDireito(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  doMenu.value = el ? visiveis.value[gatilhos().indexOf(el)] ?? null : null
}

function fixar(v: Visualizacao) {
  const fixou = !v.fixada
  const ultimaFixada = visualizacoes.value.reduce((n, x, i) => (x.fixada && x.reference !== v.reference ? i : n), 0)
  visualizacoes.value = visualizacoes.value.map(x => x.reference === v.reference ? { ...x, fixada: fixou } : x)
  // Fixar leva para logo depois das fixadas; desafixar leva para logo depois delas também, no começo das outras.
  mover(v.reference, fixou ? ultimaFixada + 1 : ultimaFixada, true)
  emit('fixada', v.reference, fixou)
}

function acoesDe(v: Visualizacao): ContextMenuItem[][] {
  const t = props.t.menu
  const sistema = v.reference === SISTEMA
  const i = posicao(v.reference)
  const grupos: ContextMenuItem[][] = []
  const gerais: ContextMenuItem[] = []
  if (props.podeEditar && !sistema) gerais.push({ label: t.renomear, icon: 'i-lucide-pencil', kbds: ['f2'], onSelect: () => comecarARenomear(v.reference) })
  if (props.podeEditar) gerais.push({ label: t.configurar, icon: 'i-lucide-sliders-horizontal', onSelect: () => emit('configurar', v.reference) })
  if (props.podeEditar) gerais.push({ label: t.duplicar, icon: 'i-lucide-copy', onSelect: () => emit('duplicar', v.reference) })
  gerais.push({ label: t.copiarLink, icon: 'i-lucide-link', onSelect: () => emit('copiarLink', v.reference) })
  grupos.push(gerais)
  if (!sistema) {
    grupos.push([
      { type: 'label', label: t.soParaMim },
      { label: v.fixada ? t.desafixar : t.fixar, icon: v.fixada ? 'i-lucide-pin-off' : 'i-lucide-pin', onSelect: () => fixar(v) },
      { label: t.moverEsquerda, icon: 'i-lucide-arrow-left', disabled: i <= 1, onSelect: () => mover(v.reference, i - 1) },
      { label: t.moverDireita, icon: 'i-lucide-arrow-right', disabled: i >= visualizacoes.value.length - 1, onSelect: () => mover(v.reference, i + 1) },
    ])
  }
  if (props.podeEditar) {
    grupos.push([
      { type: 'label', label: t.paraTodos },
      v.default
        ? { label: t.padrao, icon: 'i-lucide-house', disabled: true, description: t.jaEPadrao }
        : { label: t.definirPadrao, icon: 'i-lucide-house', onSelect: () => emit('definirPadrao', v.reference) },
      sistema || v.default
        ? { label: t.excluir, icon: 'i-lucide-trash-2', disabled: true, description: sistema ? t.naoExcluiSistema : t.naoExcluiPadrao }
        : { label: t.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => emit('excluir', v.reference) },
    ])
  }
  return grupos
}

const itensDoMenu = computed<ContextMenuItem[][]>(() => doMenu.value ? acoesDe(doMenu.value) : [])

/* ---------- "+N" ---------- */

const listaAberta = ref(false)
const busca = ref('')

const itensEscondidos = computed(() => escondidas.value.map(v => ({
  id: v.reference,
  label: nomeDe(v),
  icon: v.icon ?? 'i-lucide-table',
  vis: v,
})))

function abrirEscondida(v: Visualizacao) {
  ativa.value = v.reference
  listaAberta.value = false
  busca.value = ''
}

/* ---------- seta ⌄ na ativa ---------- */

const posMenu = ref<{ left: number, top: number, height: number } | null>(null)
const menuAberto = ref(false)
const deslocMenu = ref(0)
const menuSemTransicao = ref(false)

function posicionarMenu() {
  if (!barra.value) return
  const el = barra.value.querySelector<HTMLElement>('[data-slot=trigger][data-state=active]')
  if (!el) {
    posMenu.value = null
    return
  }
  const base = barra.value.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  posMenu.value = { left: r.right - base.left - 26, top: r.top - base.top, height: r.height }
  deslocMenu.value = 0
  requestAnimationFrame(() => { menuSemTransicao.value = false })
}

watch([ativa, visiveis, larguraDisponivel, () => props.modificada], () => nextTick(() => requestAnimationFrame(posicionarMenu)))

/**
 * O `UTabs` põe o aria-label na raiz, não no `tablist`: o leitor de tela anuncia a lista sem nome.
 * No produto, o rótulo vai direto no `TabsList`.
 */
function rotularLista() {
  barra.value?.querySelector('[role=tablist]')?.setAttribute('aria-label', props.t.barra.rotulo)
}
watch([visiveis, () => props.t], () => nextTick(rotularLista))
onMounted(() => nextTick(rotularLista))

const ativaObj = computed(() => visualizacoes.value.find(v => v.reference === ativa.value))

defineExpose({ comecarARenomear })

/* ---------- aparência: só prop `ui`, só token ---------- */

const ui = {
  root: 'gap-0',
  list: 'gap-1 bg-transparent p-0 overflow-x-clip',
  indicator: 'hidden',
  trigger: [
    'grow-0 h-8 rounded-md px-2.5 gap-1.5 text-sm cursor-pointer select-none isolate',
    'transition-[color,background-color,padding,transform] duration-200 ease-out',
    'data-[state=inactive]:text-muted hover:data-[state=inactive]:bg-elevated hover:data-[state=inactive]:text-highlighted',
    // Texto da ativa em text-highlighted: o rosa sobre o fundo rosa claro dá 2,88:1 e não passa (WCAG 1.4.3).
    // A cor de destaque fica no fundo e no ícone.
    'data-[state=active]:bg-primary/10 data-[state=active]:text-highlighted data-[state=active]:font-semibold data-[state=active]:pr-8',
    // Arrastando: a própria pílula segue o mouse, por cima das vizinhas, com o fundo dela; sem sombra nem cópia.
    'data-[arrastando=true]:z-10 data-[arrastando=true]:cursor-grabbing data-[arrastando=true]:ring data-[arrastando=true]:ring-default',
    'data-[arrastando=true]:data-[state=inactive]:bg-elevated data-[arrastando=true]:data-[state=inactive]:text-highlighted',
    'data-[arrastando=true]:data-[state=active]:bg-default',
  ].join(' '),
  leadingIcon: 'size-4 in-data-[state=active]:text-primary',
  label: 'max-w-40 truncate',
}
</script>

<template>
  <div class="relative min-w-0">
    <!-- Régua invisível: mede cada pílula (já com o corte de largura) para saber quantas cabem. -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-hidden" aria-hidden="true">
      <div ref="medidas" class="invisible flex w-max whitespace-nowrap">
        <span
          v-for="v in visualizacoes"
          :key="v.reference"
          :data-medida="v.reference"
          class="inline-flex items-center gap-1.5 px-2.5 text-sm font-semibold"
        >
          <UIcon :name="v.icon ?? 'i-lucide-table'" class="size-4" />
          <span class="max-w-40 truncate">{{ nomeDe(v) }}</span>
          <UIcon v-if="v.fixada" name="i-lucide-pin" class="size-3" />
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
      <UContextMenu :items="itensDoMenu" :ui="{ content: 'w-64', itemDescription: 'whitespace-normal' }">
        <div @contextmenu.capture="aoBotaoDireito">
          <!-- A chave remonta a barra quando a ordem muda: as setas do teclado seguem a ordem da tela. -->
          <UTabs
            :key="visiveis.map(v => v.reference).join()"
            v-model="ativa"
            :items="itensDasAbas"
            variant="pill"
            color="primary"
            size="sm"
            :content="false"
            activation-mode="manual"
            :ui="ui"
            :aria-label="t.barra.rotulo"
            :class="arrastando ? '[&_[data-slot=trigger]]:cursor-grabbing' : ''"
          >
            <template #default="{ item }">
              <UTooltip
                :delay-duration="500"
                :disabled="!!arrastando"
                :content="{ side: 'bottom', align: 'start' }"
                :ui="{ content: 'h-auto max-w-80 flex-col items-start gap-0.5 py-1.5' }"
              >
                <span class="max-w-40 truncate">{{ item.label }}</span>
                <template #content>
                  <span class="block whitespace-normal font-semibold text-highlighted">{{ item.label }}</span>
                  <span class="block whitespace-normal text-muted">{{ resumoDe(item.vis) }}</span>
                  <span class="block text-muted">{{ t.barra.itens(contagens[item.value] ?? 0) }}</span>
                  <span v-if="item.value !== 'default'" class="block text-dimmed">{{ t.barra.dicaArrastar }}</span>
                </template>
              </UTooltip>
            </template>
            <template #trailing="{ item }">
              <UIcon v-if="item.vis.fixada" name="i-lucide-pin" class="size-3 shrink-0 text-dimmed" :aria-label="t.barra.fixadaRotulo" />
              <span
                v-if="item.value !== ativa && modificadas.includes(item.value)"
                class="size-2 shrink-0 rounded-full bg-warning"
                role="img"
                :aria-label="t.barra.naoSalva"
              />
            </template>

            <template #list-trailing>
              <div class="ml-auto flex shrink-0 items-center gap-0.5 self-center pl-2" @pointerdown.stop>
                <UPopover v-if="escondidas.length" v-model:open="listaAberta" :content="{ align: 'end', sideOffset: 6 }">
                  <UButton
                    :label="`+${escondidas.length}`"
                    trailing-icon="i-lucide-chevron-down"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    :aria-label="t.barra.maisVisualizacoes(escondidas.length)"
                    class="text-muted"
                  />
                  <template #content>
                    <!-- Popover + CommandPalette: o padrão do Nuxt UI para lista com busca, o mesmo do "+N" das folders. -->
                    <UCommandPalette
                      v-model:search-term="busca"
                      :groups="[{ id: 'escondidas', items: itensEscondidos }]"
                      :placeholder="t.barra.pesquisar"
                      class="w-72"
                      :ui="{ input: '[&>input]:h-9 [&>input]:text-sm', item: 'group/linha', itemLabel: 'truncate' }"
                      @update:model-value="(i: any) => i && abrirEscondida(i.vis)"
                    >
                      <template #empty>
                        <p class="py-4 text-center text-sm text-muted">{{ t.barra.nenhumaEncontrada }}</p>
                      </template>
                      <template #item-trailing="{ item }">
                        <span class="text-xs tabular-nums text-muted">{{ contagens[item.id] ?? 0 }}</span>
                        <UDropdownMenu :items="acoesDe(item.vis)" :content="{ align: 'start', side: 'right' }" :ui="{ content: 'w-64', itemDescription: 'whitespace-normal' }">
                          <UButton
                            icon="i-lucide-ellipsis"
                            color="neutral"
                            variant="ghost"
                            size="xs"
                            class="-my-1 opacity-0 transition-opacity group-hover/linha:opacity-100 group-data-highlighted/linha:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                            :aria-label="t.barra.opcoes(item.label)"
                            @click.stop
                            @pointerdown.stop
                          />
                        </UDropdownMenu>
                      </template>
                    </UCommandPalette>
                  </template>
                </UPopover>

                <slot name="criar" />
              </div>
            </template>
          </UTabs>
        </div>
      </UContextMenu>

      <!-- Seta ⌄ e ponto de "mudança não salva" na ativa: botão à parte, sobre a ponta da pílula, como nas folders. -->
      <UDropdownMenu
        v-if="posMenu && ativaObj && !renomeando"
        v-model:open="menuAberto"
        :items="acoesDe(ativaObj)"
        :content="{ align: 'start', sideOffset: 4 }"
        :ui="{ content: 'w-64', itemDescription: 'whitespace-normal' }"
      >
        <UButton
          color="neutral"
          variant="link"
          size="xs"
          class="absolute size-6 justify-center p-0 text-muted hover:text-highlighted"
          :class="arrastando === ativa ? 'z-20' : 'z-[5]'"
          :style="{
            left: `${posMenu.left}px`,
            top: `${posMenu.top + posMenu.height / 2 - 12}px`,
            transform: `translateX(${deslocMenu}px)`,
            transition: menuSemTransicao ? 'none' : 'transform 200ms ease-out',
          }"
          :aria-label="t.barra.opcoes(nomeDe(ativaObj))"
          @pointerdown.stop
        >
          <span class="relative flex size-4 items-center justify-center">
            <UIcon name="i-lucide-chevron-down" class="size-4" />
            <span
              v-if="modificada"
              class="absolute -right-1 -top-1 size-2 rounded-full bg-warning ring-2 ring-(--ui-bg)"
              :title="t.barra.naoSalva"
            />
          </span>
        </UButton>
      </UDropdownMenu>

      <!-- Renomear: o campo aparece no lugar da pílula. Enter grava, Esc desiste, sair do campo grava. -->
      <div
        v-if="renomeando && posRenomear"
        class="absolute z-30"
        :style="{ left: `${posRenomear.left}px`, top: `${posRenomear.top}px`, width: `${posRenomear.width}px` }"
      >
        <UInput
          ref="campoRenomear"
          v-model="nomeNovo"
          size="sm"
          autofocus
          :aria-label="t.barra.novoNome"
          class="w-full"
          :ui="{ base: 'h-8 font-semibold' }"
          @keydown.enter.prevent="concluirRenomear(true)"
          @keydown.esc.prevent="concluirRenomear(false)"
          @blur="concluirRenomear(true)"
        />
      </div>
    </div>

    <span class="sr-only" aria-live="polite">{{ anuncio }}</span>
  </div>
</template>
