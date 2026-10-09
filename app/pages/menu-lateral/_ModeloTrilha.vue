<script setup lang="ts">
import MenuDeAjuda from './_MenuDeAjuda.vue'
import CartaoDeSalvar from './_CartaoDeSalvar.vue'
import PainelDaArea from './_PainelDaArea.vue'
import Personalizar from './_Personalizar.vue'
import CriarSecao from './_CriarSecao.vue'
import CriarMenu from './_CriarMenu.vue'
import CriarCategoria from './_CriarCategoria.vue'
import { LIMITE_DA_TRILHA, useMenuDoWorkspace } from './estado'
import { useTrilha } from './trilha'
import { rotuloDoNo } from './rotulos'
import { gruposDeConfiguracao, workspace, type NoDoMenu, type Categoria } from './mocks'
import type { Acoes } from './acoes'
import type { TextosDaTela } from './textos'

/**
 * MODELO ALTERNATIVO: trilha de ícones mais painel da área.
 *
 * É o desenho do Jira antigo, do Teams, do Slack, do monday e da Global
 * Navigation do ClickUp. Está aqui para ser COMPARADO com a barra única.
 *
 * RODADA 5: lê a árvore do `estado.ts`, e o campo `lugar` da seção decide se
 * ela vira ícone na trilha ou seção dentro de um painel.
 *
 * RODADA 15: o ClickUp, como a Mikaela mostrou nele mesmo, em 21 prints.
 * Isto DESFAZ parte da rodada 14:
 *
 *   "clickup nao permite reordenar os menus da trilha. nem minimizalos. o
 *    estado minimizado, ao passar o mouse no icone, abre um popover trazendo
 *    o menu. o mesmo acontece se estou com 'Inicio' selecionado e passo o
 *    mouse em outro grande icone." (Mikaela)
 *
 *  - a trilha não se arrasta nem se reordena. Escolhe-se o que fica nela, em
 *    Personalizar > Navegação ou pelo alfinete em "Mais". Fixar com a trilha
 *    cheia troca o último ícone, e ele vai para "Mais";
 *  - passar o mouse num ícone que não é o aberto mostra o menu dele num
 *    popover, e o painel encaixado fica onde estava. Recolhido, todo ícone
 *    faz isso, e o primeiro ícone vira "»", que abre de novo;
 *  - "Trabalho" virou INÍCIO. Clicar nele abre a página inicial e o menu
 *    Início, que é o único com "Personalizar a barra lateral";
 *  - o "+" do cabeçalho do Início cria, e termina em "Personalize sua barra
 *    lateral".
 *
 * O arraste continua DENTRO dos painéis (rodada 14), nas regras de sempre.
 *
 * RODADA 16, e aqui o ENSPACE sai do ClickUp de propósito: "diferente do
 * clickup, permitiremos reordenaçao na trilha". Os ícones fixados se
 * arrastam (e Alt com as setas faz o mesmo). Início fica no topo: é a
 * âncora. Arrastar vai para o rascunho e acende o Salvar, como todo arraste;
 * em Personalizar > Navegação, vale na hora.
 */
const props = defineProps<{
  t: TextosDaTela
  categorias: Categoria[]
  favoritas: Categoria[]
  recorte: Categoria[]
  totalDeCategorias: number
  destinoAtivo: string
  categoriaAtivaId: number | null
  itemConfigAtivo: string
  estado: 'normal' | 'vazio' | 'carregando' | 'erro'
  podeConfigurar: boolean
  itensDeCriar: { label: string, icon: string, onSelect: () => void }[][]
  ordem: 'uso' | 'alfabetica' | 'recentes' | 'manual'
  recolhido: boolean
}>()

const emit = defineEmits<{
  destino: [id: string]
  categoria: [c: Categoria]
  alternarFixar: [id: number]
  verTodas: []
  busca: []
  item: [id: string, rotulo: string]
  ajuda: [rotulo: string]
  ordem: [valor: 'uso' | 'alfabetica' | 'recentes' | 'manual']
  virarManual: []
  novaTela: [secaoId: string]
  configurarCategoria: [c: Categoria]
  recolher: []
}>()

const menu = useMenuDoWorkspace()
const trilha = useTrilha()
const toast = useToast()
const area = ref('inicio')

const rotuloDe = (no: NoDoMenu) => rotuloDoNo(no, props.t)

interface Area { id: string, icone: string, rotulo: string, bloqueada: boolean }

/**
 * Todas as áreas que existem agora, na ordem do produto: Início, Dados, uma
 * por seção que o administrador mandou para a trilha, e Configurações. Quais
 * aparecem é a pessoa quem escolhe; a ordem, não.
 */
const areas = computed<Area[]>(() => [
  { id: 'inicio', icone: 'i-lucide-house', rotulo: props.t.areaTrabalho, bloqueada: false },
  { id: 'dados', icone: 'i-lucide-database', rotulo: props.t.areaDados, bloqueada: false },
  ...menu.secoesNaTrilha.value.map(s => ({ id: `sec:${s.id}`, icone: s.icone, rotulo: rotuloDe(s), bloqueada: false })),
  { id: 'config', icone: 'i-lucide-settings', rotulo: props.t.configuracoes, bloqueada: !props.podeConfigurar },
])
const idsDasAreas = computed(() => areas.value.map(a => a.id))

/** O que está na trilha: Início, e o que foi fixado, na ordem em que foi fixado. */
const naTrilha = computed<Area[]>(() => {
  const fixadas = trilha.prefs.value.fixadas
    .map(id => areas.value.find(a => a.id === id))
    .filter((a): a is Area => !!a)
  return [areas.value[0]!, ...fixadas].slice(0, LIMITE_DA_TRILHA)
})
/** O resto mora em "Mais". */
const noMais = computed(() => areas.value.filter(a => !naTrilha.value.some(x => x.id === a.id)))

/*
 * Seção que o administrador acabou de mandar para a trilha entra fixada, com
 * a regra de sempre: trilha cheia troca o último.
 */
const conhecidas = new Set(idsDasAreas.value)
watch(idsDasAreas, (ids) => {
  for (const id of ids) {
    if (conhecidas.has(id)) continue
    conhecidas.add(id)
    trilha.fixar(id, ids)
  }
  if (!ids.includes(area.value)) area.value = 'inicio'
})

/** Fixar pelo alfinete, dizendo quem saiu quando a trilha estava cheia. */
function fixarNaTrilha(a: Area) {
  const ultimo = naTrilha.value.length >= LIMITE_DA_TRILHA ? naTrilha.value[naTrilha.value.length - 1] : null
  trilha.fixar(a.id, idsDasAreas.value)
  toast.add({
    title: ultimo ? props.t.trocouNaTrilha(a.rotulo, ultimo.rotulo) : props.t.fixadaNaTrilha(a.rotulo),
    icon: 'i-lucide-pin',
    color: 'neutral',
  })
}

/* ------------------------------ abrir uma área ------------------------------ */

const tituloDe = (id: string) => areas.value.find(a => a.id === id)?.rotulo ?? ''

/** A primeira tela da área. Início é sempre a página inicial. */
function abrirPrimeiraDaArea(id: string) {
  if (id === 'inicio') {
    emit('destino', 'n-inicio')
    return
  }
  if (id === 'dados') {
    const c = props.favoritas[0] ?? props.recorte[0]
    if (c) emit('categoria', c)
    return
  }
  if (id.startsWith('sec:')) {
    const secao = menu.secoes.value.find(x => x.id === id.slice(4))
    const primeiro = (secao?.filhos ?? [])[0]
    if (primeiro) emit('destino', primeiro.id)
    return
  }
  if (id === 'config') {
    const primeiro = gruposDeConfiguracao[0]?.itens[0]
    if (primeiro) emit('item', primeiro.id, props.t.itens[primeiro.id] ?? primeiro.id)
  }
}

/**
 * Clicar numa área encaixa o menu dela e abre a primeira tela. O Início
 * sempre volta para a página inicial, mesmo já aberto: é o "redireciona pra
 * home e também abre esse menu" dela.
 */
function irPara(a: Area) {
  if (a.bloqueada) return
  const jaEstava = area.value === a.id
  area.value = a.id
  if (!jaEstava || a.id === 'inicio') abrirPrimeiraDaArea(a.id)
}

/** O popover do hover: em todo ícone que não é o encaixado, e em todos quando recolhido. */
function comPopover(a: Area) {
  return !a.bloqueada && (props.recolhido || area.value !== a.id)
}

/* ------------------------------ arrastar na trilha (rodada 16) ------------------------------ */

const arrastandoArea = ref<string | null>(null)
const miraArea = ref<{ id: string, posicao: 'antes' | 'depois' } | null>(null)

function passarNaArea(e: DragEvent, a: Area) {
  if (!arrastandoArea.value || arrastandoArea.value === a.id) return
  e.preventDefault()
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  // Ninguém passa para cima do Início: soltar nele é soltar logo abaixo.
  const posicao = a.id === 'inicio' || e.clientY - r.top >= r.height / 2 ? 'depois' : 'antes'
  miraArea.value = { id: a.id, posicao }
}

function soltarNaArea(e: DragEvent) {
  e.preventDefault()
  if (arrastandoArea.value && miraArea.value) {
    trilha.moverNaTrilha(arrastandoArea.value, miraArea.value.id, miraArea.value.posicao)
  }
  arrastandoArea.value = null
  miraArea.value = null
}

/** Alt com as setas: o mesmo arraste, pelo teclado. */
function teclarNaArea(e: KeyboardEvent, a: Area) {
  if (!e.altKey || a.id === 'inicio' || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return
  e.preventDefault()
  const ids = naTrilha.value.map(x => x.id)
  const vizinho = ids[ids.indexOf(a.id) + (e.key === 'ArrowUp' ? -1 : 1)]
  if (vizinho) trilha.moverNaTrilha(a.id, vizinho, e.key === 'ArrowUp' ? 'antes' : 'depois')
}

function atributosDeArraste(a: Area) {
  const pode = a.id !== 'inicio'
  return {
    draggable: pode ? 'true' : undefined,
    'aria-keyshortcuts': pode ? 'Alt+ArrowUp Alt+ArrowDown' : undefined,
    onDragstart: () => { if (pode) arrastandoArea.value = a.id },
    onDragover: (e: DragEvent) => passarNaArea(e, a),
    onDrop: soltarNaArea,
    onDragend: () => { arrastandoArea.value = null; miraArea.value = null },
    onKeydown: (e: KeyboardEvent) => teclarNaArea(e, a),
  }
}

/* ------------------------------ o botão direito na trilha ------------------------------ */

const itemRecolher = computed(() => ({
  label: props.recolhido ? props.t.expandirMenu : props.t.recolherMenu,
  icon: props.recolhido ? 'i-lucide-chevrons-right' : 'i-lucide-chevrons-left',
  kbds: ['meta', '\\'],
  onSelect: () => emit('recolher'),
}))

/** Na trilha não há mover: só abrir, tirar da trilha e personalizar. */
function acoesDaArea(a: Area): Acoes {
  const abrir = { label: props.t.ctxAbrir, icon: 'i-lucide-arrow-up-right', disabled: a.bloqueada, onSelect: () => irPara(a) }
  const tirar = a.id === 'inicio'
    ? []
    : [{ label: props.t.desafixarDaTrilha, icon: 'i-lucide-pin-off', onSelect: () => trilha.desafixar(a.id) }]
  const ids = naTrilha.value.map(x => x.id)
  const i = ids.indexOf(a.id)
  const mover = a.id === 'inicio' || i < 0
    ? []
    : [
        { label: props.t.ctxSubir, icon: 'i-lucide-arrow-up', kbds: ['alt', 'arrowup'], disabled: i <= 1, onSelect: () => trilha.moverNaTrilha(a.id, ids[i - 1]!, 'antes') },
        { label: props.t.ctxDescer, icon: 'i-lucide-arrow-down', kbds: ['alt', 'arrowdown'], disabled: i >= ids.length - 1, onSelect: () => trilha.moverNaTrilha(a.id, ids[i + 1]!, 'depois') },
      ]
  return [
    [abrir],
    [...mover, ...tirar, { label: props.t.personalizarNavegacao, icon: 'i-lucide-sliders-horizontal', onSelect: () => trilha.abrirPersonalizar('navegacao') }],
    [itemRecolher.value],
  ]
}

/* ------------------------------ o "+" do Início ------------------------------ */

/*
 * RODADA 16: "nossas entidades possiveis de estarem no botao de customizar
 * é: criar seçao, criar menu [...]. criar categoria tambem é possibilidade."
 * Seção é pessoal e todo mundo cria; menu e categoria são do workspace, e só
 * quem configura cria.
 */
const itensDoMais = computed(() => {
  const travado = !props.podeConfigurar
  const dica = travado ? props.t.ctxSoQuemConfigura : undefined
  return [[
    { label: props.t.criarSecaoRotulo, icon: 'i-lucide-rows-3', onSelect: () => { trilha.criandoSecao.value = 'nova' } },
    { label: props.t.criarMenuRotulo, icon: 'i-lucide-list-tree', description: dica, disabled: travado, onSelect: () => { trilha.criandoMenu.value = 'inicio' } },
    { label: props.t.criarCategoriaRotulo, icon: 'i-lucide-folder-plus', description: dica, disabled: travado, onSelect: () => { trilha.criandoCategoria.value = true } },
  ], [
    { label: props.t.inicioPersonalizar, icon: 'i-lucide-sliders-horizontal', onSelect: () => trilha.abrirPersonalizar('navegacao') },
  ]]
})

/* ------------------------------ o que Personalizar mostra ------------------------------ */

const itensDoInicio = computed(() => [
  ...menu.destinosDaBarra.value.map(d => ({ id: d.id, rotulo: rotuloDe(d), icone: d.icone })),
  { id: 'todas-categorias', rotulo: props.t.todasTitulo, icone: 'i-lucide-layout-grid' },
])

const secoesDoInicio = computed(() => {
  const lista = [
    { id: 'favoritos', rotulo: props.t.favoritos, icone: 'i-lucide-star' },
    { id: 'categorias', rotulo: props.t.categorias, icone: 'i-lucide-database' },
    ...menu.secoesNoPainel.value
      .filter(s => (s.painel ?? 'trabalho') === 'trabalho')
      .map(s => ({ id: s.id, rotulo: rotuloDe(s), icone: s.icone })),
    ...trilha.prefs.value.pessoais.map(p => ({ id: p.id, rotulo: p.rotulo, icone: p.icone })),
  ]
  return trilha.ordemDasSecoes(lista.map(s => s.id)).map(id => lista.find(s => s.id === id)!)
})

/* As props que o painel encaixado e os popovers repetem. */
const doPainel = computed(() => ({
  t: props.t,
  categorias: props.categorias,
  favoritas: props.favoritas,
  recorte: props.recorte,
  totalDeCategorias: props.totalDeCategorias,
  destinoAtivo: props.destinoAtivo,
  categoriaAtivaId: props.categoriaAtivaId,
  itemConfigAtivo: props.itemConfigAtivo,
  estado: props.estado,
  podeConfigurar: props.podeConfigurar,
  ordem: props.ordem,
}))

const eventosDoPainel = {
  destino: (id: string) => emit('destino', id),
  categoria: (c: Categoria) => emit('categoria', c),
  alternarFixar: (id: number) => emit('alternarFixar', id),
  verTodas: () => emit('verTodas'),
  item: (id: string, r: string) => emit('item', id, r),
  ordem: (v: 'uso' | 'alfabetica' | 'recentes' | 'manual') => emit('ordem', v),
  virarManual: () => emit('virarManual'),
  novaTela: (id: string) => emit('novaTela', id),
  configurarCategoria: (c: Categoria) => emit('configurarCategoria', c),
}

/** O botão da trilha, com as mesmas três aparências de sempre. */
function classeDaArea(a: Area) {
  return [
    'relative flex w-full shrink-0 flex-col items-center gap-0.5 rounded-lg px-1 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary data-[state=open]:bg-elevated',
    trilha.prefs.value.rotulos ? 'py-2' : 'py-2.5',
    area.value === a.id && !props.recolhido
      ? 'bg-primary/15 text-highlighted'
      : a.bloqueada ? 'cursor-not-allowed text-muted' : 'text-default hover:bg-elevated',
    arrastandoArea.value === a.id ? 'opacity-40' : '',
    miraArea.value?.id === a.id && miraArea.value.posicao === 'antes' ? 'before:absolute before:inset-x-1 before:-top-0.5 before:h-0.5 before:rounded-full before:bg-primary' : '',
    miraArea.value?.id === a.id && miraArea.value.posicao === 'depois' ? 'after:absolute after:inset-x-1 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary' : '',
  ]
}
</script>

<template>
  <div class="flex h-full">
    <!-- ==================== A TRILHA ==================== -->
    <div class="flex w-[4.5rem] shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-default bg-accented/40 py-2">
      <!--
        RECOLHIDO: "»" é o primeiro ícone, como no ClickUp, e reabre o painel.
        Os popovers continuam valendo em todos os ícones.
      -->
      <UTooltip v-if="props.recolhido" :text="props.t.expandirMenu" :kbds="['meta', '\\']" :content="{ side: 'right' }">
        <UButton
          icon="i-lucide-chevrons-right"
          size="sm"
          color="neutral"
          variant="ghost"
          class="mb-1 animate-[entrada_0.2s_ease-out_both]"
          :aria-label="props.t.expandirMenu"
          aria-expanded="false"
          aria-keyshortcuts="Control+Backslash"
          @click="emit('recolher')"
        />
      </UTooltip>

      <UTooltip :text="workspace.nome" :content="{ side: 'right' }">
        <button
          type="button"
          class="mb-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-inverted transition-transform hover:scale-105"
          :aria-label="props.t.trocarWorkspace"
        >
          {{ workspace.inicial }}
        </button>
      </UTooltip>

      <!-- As áreas fixadas. Se arrastam desde a rodada 16, menos o Início. -->
      <UContextMenu v-for="a in naTrilha" :key="a.id" :items="acoesDaArea(a)">
        <!-- Com popover: o menu da área aparece no hover, sem sair do que está aberto. -->
        <UPopover
          v-if="comPopover(a)"
          mode="hover"
          :open-delay="180"
          :close-delay="120"
          :content="{ side: 'right', align: 'start', sideOffset: 10 }"
        >
          <button
            type="button"
            :class="classeDaArea(a)"
            :aria-label="trilha.prefs.value.rotulos ? undefined : a.rotulo"
            v-bind="atributosDeArraste(a)"
            @click="irPara(a)"
          >
            <UIcon :name="a.icone" class="size-5" />
            <span v-if="trilha.prefs.value.rotulos" class="w-full truncate text-center text-[10px] font-medium leading-tight">{{ a.rotulo }}</span>
          </button>
          <template #content>
            <div class="flex max-h-[70vh] w-72 flex-col">
              <p class="shrink-0 border-b border-default px-3 py-2.5 text-sm font-bold text-highlighted">{{ a.rotulo }}</p>
              <PainelDaArea v-bind="doPainel" :area="a.id" :titulo="a.rotulo" flutuante v-on="eventosDoPainel" />
            </div>
          </template>
        </UPopover>

        <!-- A área encaixada, ou a bloqueada: sem popover. -->
        <UTooltip v-else :text="a.bloqueada ? props.t.semPermissaoTitulo : a.rotulo" :content="{ side: 'right' }">
          <button
            type="button"
            :class="classeDaArea(a)"
            :aria-current="area === a.id ? 'page' : undefined"
            :aria-disabled="a.bloqueada || undefined"
            :aria-label="trilha.prefs.value.rotulos ? undefined : a.rotulo"
            v-bind="atributosDeArraste(a)"
            @click="irPara(a)"
          >
            <UIcon :name="a.bloqueada ? 'i-lucide-lock' : a.icone" class="size-5" :class="area === a.id && !props.recolhido ? 'text-primary' : ''" />
            <span v-if="trilha.prefs.value.rotulos" class="w-full truncate text-center text-[10px] font-medium leading-tight">{{ a.rotulo }}</span>
          </button>
        </UTooltip>
      </UContextMenu>

      <!--
        MAIS: o que não está na trilha. Alfinete no hover fixa; com a trilha
        cheia, o último ícone sai e vem para cá. No pé, o atalho para
        Personalizar navegação.
      -->
      <UPopover :content="{ side: 'right', align: 'start', sideOffset: 10 }">
        <button
          type="button"
          class="flex w-full shrink-0 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-default transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary data-[state=open]:bg-elevated"
          :aria-label="props.t.mais"
        >
          <UIcon name="i-lucide-grip" class="size-5" />
          <span v-if="trilha.prefs.value.rotulos" class="w-full truncate text-center text-[10px] font-medium leading-tight">{{ props.t.mais }}</span>
        </button>
        <template #content>
          <div class="w-72 p-2">
            <div v-if="noMais.length" class="grid grid-cols-3 gap-1.5">
              <div v-for="a in noMais" :key="a.id" class="group relative">
                <button
                  type="button"
                  class="flex w-full flex-col items-center gap-1 rounded-lg px-1 py-2.5 text-default transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-muted"
                  :disabled="a.bloqueada"
                  @click="irPara(a)"
                >
                  <span class="flex size-9 items-center justify-center rounded-lg border border-default bg-default">
                    <UIcon :name="a.icone" class="size-5" />
                  </span>
                  <span class="w-full truncate text-center text-xs">{{ a.rotulo }}</span>
                </button>
                <UTooltip :text="props.t.fixarNaTrilha">
                  <UButton
                    icon="i-lucide-pin"
                    size="xs"
                    color="neutral"
                    variant="solid"
                    class="absolute right-0.5 top-0.5 rounded-full opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    :aria-label="`${props.t.fixarNaTrilha}: ${a.rotulo}`"
                    @click="fixarNaTrilha(a)"
                  />
                </UTooltip>
              </div>
            </div>
            <UButton
              :label="props.t.personalizarNavegacao"
              icon="i-lucide-settings-2"
              size="sm"
              color="neutral"
              variant="outline"
              block
              :class="noMais.length ? 'mt-2' : ''"
              @click="trilha.abrirPersonalizar('navegacao')"
            />
          </div>
        </template>
      </UPopover>

      <div class="min-h-2 flex-1" />

      <!--
        Recolhido não esconde o que falta salvar (rodada 14): o cartão mora no
        painel, então aqui fica o sinal, e o clique abre o painel.
      -->
      <UTooltip v-if="props.recolhido && menu.alterado.value" :text="props.t.naoSalvoTitulo" :content="{ side: 'right' }">
        <button
          type="button"
          class="relative flex size-9 shrink-0 animate-[entrada_0.2s_ease-out_both] items-center justify-center rounded-lg text-highlighted ring-1 ring-warning/50 transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
          :aria-label="props.t.naoSalvoTitulo"
          @click="emit('recolher')"
        >
          <UIcon name="i-lucide-save" class="size-5" />
          <span class="absolute right-1 top-1 size-2 rounded-full bg-warning" aria-hidden="true" />
        </button>
      </UTooltip>

      <!-- RODADA 8: a lupa, a ajuda e o criar na base da trilha, a pedido dela. -->
      <UTooltip :text="props.t.buscarEmTudo" :content="{ side: 'right' }">
        <button
          type="button"
          class="flex size-9 shrink-0 items-center justify-center rounded-lg text-default transition-colors hover:bg-elevated"
          :aria-label="props.t.buscarEmTudo"
          @click="emit('busca')"
        >
          <UIcon name="i-lucide-search" class="size-5" />
        </button>
      </UTooltip>

      <MenuDeAjuda :t="props.t" formato="trilha" @escolher="r => emit('ajuda', r)" />

      <UDropdownMenu :items="props.itensDeCriar" :content="{ side: 'right', align: 'end' }">
        <UTooltip :text="props.t.criar" :content="{ side: 'right' }">
          <button
            type="button"
            class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-inverted transition-transform hover:scale-105"
            :aria-label="props.t.criar"
          >
            <UIcon name="i-lucide-plus" class="size-5" />
          </button>
        </UTooltip>
      </UDropdownMenu>
    </div>

    <!-- ==================== O PAINEL ENCAIXADO ==================== -->
    <div v-if="!props.recolhido" class="relative flex min-w-0 flex-1 animate-[entrada_0.2s_ease-out_both] flex-col">
      <div class="flex h-12 shrink-0 items-center gap-0.5 border-b border-default pl-3 pr-1.5">
        <h2 class="min-w-0 flex-1 truncate text-sm font-bold text-highlighted">{{ tituloDe(area) }}</h2>

        <!-- No Início: busca, Personalizar (depois do primeiro uso), recolher e "+". -->
        <template v-if="area === 'inicio'">
          <UTooltip :text="props.t.buscarEmTudo">
            <UButton icon="i-lucide-search" size="xs" color="neutral" variant="ghost" :aria-label="props.t.buscarEmTudo" @click="emit('busca')" />
          </UTooltip>
          <UTooltip v-if="trilha.prefs.value.personalizou" :text="props.t.inicioPersonalizar">
            <UButton
              icon="i-lucide-sliders-horizontal"
              size="xs"
              color="neutral"
              variant="ghost"
              class="animate-[entrada_0.2s_ease-out_both]"
              :aria-label="props.t.inicioPersonalizar"
              @click="trilha.abrirPersonalizar('navegacao')"
            />
          </UTooltip>
        </template>

        <UTooltip :text="props.t.recolherMenu" :kbds="['meta', '\\']">
          <UButton
            icon="i-lucide-chevrons-left"
            size="xs"
            color="neutral"
            variant="ghost"
            :aria-label="props.t.recolherMenu"
            aria-keyshortcuts="Control+Backslash"
            @click="emit('recolher')"
          />
        </UTooltip>

        <UDropdownMenu v-if="area === 'inicio'" :items="itensDoMais" :content="{ align: 'end' }" :ui="{ content: 'min-w-60' }">
          <UButton
            icon="i-lucide-plus"
            trailing-icon="i-lucide-chevron-down"
            size="xs"
            color="neutral"
            variant="outline"
            class="ml-0.5"
            :aria-label="props.t.criarAlgo"
          />
        </UDropdownMenu>
      </div>

      <PainelDaArea v-bind="doPainel" :area="area" :titulo="tituloDe(area)" v-on="eventosDoPainel" />

      <!-- O mesmo Salvar da barra única: o que se arrasta aqui grava igual. -->
      <CartaoDeSalvar :t="props.t" :pode-configurar="props.podeConfigurar" rente />
    </div>

    <Personalizar :t="props.t" :areas="areas" :itens-do-inicio="itensDoInicio" :secoes="secoesDoInicio" />
    <CriarSecao :t="props.t" />
    <CriarMenu :t="props.t" />
    <CriarCategoria :t="props.t" />
  </div>
</template>
