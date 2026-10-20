<script setup lang="ts">
import { chaveDoAtalho, useTrilha, type AbaDePersonalizar } from './trilha'
import { useMenuDoWorkspace, type Atalho } from './estado'
import { rotuloDoNo } from './rotulos'
import type { Categoria, NoDoMenu } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * PERSONALIZAR (rodada 15). A janela do ClickUp, aba por aba, como a
 * Mikaela mostrou:
 *
 *   Navegação  o que aparece na trilha (Início travado) e a aparência dela,
 *              "Somente ícones" ou "Ícones e rótulos";
 *   Início     quais itens nativos aparecem no menu Início. O que sai daqui
 *              vai para "⋯ Mais";
 *   Seções     a ordem das seções, arrastando, e "Criar seção";
 *
 * Rodada 16, onde sai do ClickUp a pedido dela: Navegação e Início também se
 * ARRASTAM, e tudo se oculta (seção nativa e item nativo do Início também).
 *
 * Rodada 28: a aba Seções virou "Seções e menus", o lugar de montar os 3
 * níveis, seção > menu > submenu, numa árvore só: as seções do Início e as
 * seções das áreas. "Tirar" nunca apaga. Nada vale na hora: toda mudança, em
 * qualquer aba, vai para o rascunho, e o "Salvar" do pé da janela pergunta
 * se vale para todos ou só para a pessoa ("isso deve ser diferenciado só na
 * hora de salvar", Mikaela).
 *
 * Rodada 25: a aba Temas saiu. "do menu de personalizaçao, tire a aba de
 * temas" (Mikaela, 20/10/2026).
 *
 * Tudo vale na hora, como lá: não há botão de salvar nesta janela.
 */
interface Opcao { id: string, rotulo: string, icone: string }

const props = defineProps<{
  t: TextosDaTela
  /** Todas as áreas que existem agora, Início incluído, na ordem do produto. */
  areas: Opcao[]
  /** Os itens nativos do Início, na ordem fixa. */
  itensDoInicio: Opcao[]
  /** As seções do Início, já na ordem guardada. */
  secoes: Opcao[]
  categorias: Categoria[]
  podeConfigurar: boolean
}>()

const trilha = useTrilha()

const aba = computed({
  get: () => trilha.personalizar.value ?? 'navegacao',
  set: (v: AbaDePersonalizar) => { trilha.personalizar.value = v },
})
const aberta = computed({
  get: () => trilha.personalizar.value !== null,
  set: (v) => { if (!v) trilha.personalizar.value = null },
})

const abas = computed(() => [
  { label: props.t.abaNavegacao, value: 'navegacao' },
  { label: props.t.abaInicio, value: 'inicio' },
  { label: props.t.abaSecoes, value: 'secoes' },
])

/* ------------------------------ Navegação ------------------------------ */

const idsDasAreas = computed(() => props.areas.map(a => a.id))

function naTrilha(id: string) {
  return id === 'inicio' || trilha.prefs.value.fixadas.includes(id)
}

function alternarNaTrilha(id: string, v: boolean | 'indeterminate') {
  if (v === true) trilha.fixar(id, idsDasAreas.value)
  else trilha.desafixar(id)
}

/* ------------------------------ Início ------------------------------ */

function noInicio(id: string) {
  return !trilha.prefs.value.inicioOcultos.includes(id)
}

/* ------------------------------ Seções ------------------------------ */

const ocultas = computed(() => props.secoes.filter(s => trilha.prefs.value.secoesOcultas.includes(s.id)))
const visiveis = computed(() => props.secoes.filter(s => !trilha.prefs.value.secoesOcultas.includes(s.id)))

/*
 * UM ARRASTE PARA AS TRÊS LISTAS. Cada aba diz como reordena; o gesto, a
 * marca e o atalho de teclado (Alt com as setas) são os mesmos.
 */
type Lista = 'navegacao' | 'inicio' | 'secoes'
const arrastando = ref<string | null>(null)
const mira = ref<{ id: string, posicao: 'antes' | 'depois' } | null>(null)

function reordenarEm(lista: Lista, quem: string, alvo: string, posicao: 'antes' | 'depois') {
  if (lista === 'navegacao') trilha.moverNaTrilha(quem, alvo, posicao, true)
  else if (lista === 'inicio') trilha.moverNoInicio(quem, alvo, posicao, props.itensDoInicio.map(i => i.id), true)
  else trilha.reordenarSecoesJa(quem, alvo, posicao, props.secoes.map(s => s.id))
}

function passar(e: DragEvent, id: string) {
  if (!arrastando.value || arrastando.value === id) return
  e.preventDefault()
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  mira.value = { id, posicao: e.clientY - r.top < r.height / 2 ? 'antes' : 'depois' }
}

function soltar(e: DragEvent, lista: Lista) {
  e.preventDefault()
  if (arrastando.value && mira.value) reordenarEm(lista, arrastando.value, mira.value.id, mira.value.posicao)
  arrastando.value = null
  mira.value = null
}

function teclar(e: KeyboardEvent, id: string, lista: Lista, ids: string[]) {
  if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return
  e.preventDefault()
  const vizinho = ids[ids.indexOf(id) + (e.key === 'ArrowUp' ? -1 : 1)]
  if (vizinho) reordenarEm(lista, id, vizinho, e.key === 'ArrowUp' ? 'antes' : 'depois')
}

function classeDaMira(id: string) {
  return [
    arrastando.value === id ? 'opacity-40' : '',
    mira.value?.id === id && mira.value.posicao === 'antes' ? 'before:absolute before:inset-x-1 before:-top-1 before:h-0.5 before:rounded-full before:bg-primary' : '',
    mira.value?.id === id && mira.value.posicao === 'depois' ? 'after:absolute after:inset-x-1 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-primary' : '',
  ]
}

/** Navegação na ordem da trilha: as fixadas primeiro, depois as que estão em "Mais". */
const areasNaOrdem = computed(() => {
  const fixadas = trilha.prefs.value.fixadas.filter(id => idsDasAreas.value.includes(id))
  const resto = idsDasAreas.value.filter(id => id !== 'inicio' && !fixadas.includes(id))
  return ['inicio', ...fixadas, ...resto].map(id => props.areas.find(a => a.id === id)!)
})

const inicioNaOrdem = computed(() => {
  const ordem = trilha.ordemDoInicio(props.itensDoInicio.map(i => i.id))
  return ordem.map(id => props.itensDoInicio.find(i => i.id === id)!)
})

/* ======================= Seções e menus (rodada 28) ======================= */

const menu = useMenuDoWorkspace()
const toast = useToast()

/* Com a janela aberta, o que muda vai para o rascunho (estado.ts, `prefsNoRascunho`). */
watch(aberta, (v) => { menu.prefsNoRascunho.value = v }, { immediate: true })

function salvar(alcance: 'todos' | 'local') {
  menu.salvar(alcance)
  toast.add({ title: alcance === 'todos' ? props.t.salvoParaTodos : props.t.salvoSoParaMim, icon: 'i-lucide-check', color: 'success' })
}

const opcoesDeSalvar = computed(() => [[
  { label: props.t.salvarTodos, icon: 'i-lucide-users-round', onSelect: () => salvar('todos') },
  { label: props.t.salvarLocal, icon: 'i-lucide-user-round', onSelect: () => salvar('local') },
]])

/* As seções abertas na árvore: as pessoais e as do workspace, cada uma com o seu id. */
const abertas = ref<string[]>(['p-rotina'])
const estaAberta = (id: string) => abertas.value.includes(id)
function alternarAberta(id: string) {
  abertas.value = estaAberta(id) ? abertas.value.filter(x => x !== id) : [...abertas.value, id]
}

/* ---------- Meu menu ---------- */

const ehPessoal = (id: string) => !!trilha.pessoal(id)
const itensDe = (id: string) => trilha.pessoal(id)?.itens ?? []

function rotuloDoAtalho(a: Atalho) {
  if (a.tipo === 'categoria') return props.categorias.find(c => String(c.id) === a.id)?.name ?? a.id
  const no = menu.acharNo(a.id)
  return no ? rotuloDoNo(no, props.t) : a.id
}
function iconeDoAtalho(a: Atalho) {
  if (a.tipo === 'categoria') return props.categorias.find(c => String(c.id) === a.id)?.icon ?? 'i-lucide-folder'
  return menu.acharNo(a.id)?.icone ?? 'i-lucide-file'
}

function escolherNoMeu(secaoId: string, rotulo: string, menuChave?: string) {
  trilha.escolhendoMenu.value = { escopo: 'meu', secaoId, rotulo, menuChave }
}

function tirarMenuMeu(secaoId: string, a: Atalho) {
  const saiu = trilha.removerAtalho(secaoId, chaveDoAtalho(a))
  if (!saiu) return
  toast.add({
    title: props.t.saiuDaSecao(rotuloDoAtalho(a)),
    icon: 'i-lucide-circle-minus',
    color: 'neutral',
    actions: [{ label: props.t.desfazer, color: 'neutral', variant: 'outline', onClick: () => trilha.restaurarAtalho(secaoId, saiu.atalho, saiu.indice) }],
  })
}

function tirarSubMeu(secaoId: string, menuChave: string, sub: Atalho) {
  const saiu = trilha.tirarSubmenu(secaoId, menuChave, chaveDoAtalho(sub))
  if (!saiu) return
  toast.add({
    title: props.t.saiuDoMenu(rotuloDoAtalho(sub)),
    icon: 'i-lucide-circle-minus',
    color: 'neutral',
    actions: [{ label: props.t.desfazer, color: 'neutral', variant: 'outline', onClick: () => trilha.restaurarSubmenu(secaoId, menuChave, saiu.atalho, saiu.indice) }],
  })
}

/*
 * Rodada 30: o que não é nativo se exclui também daqui. A seção pessoal é da
 * pessoa; a do workspace pede quem configura. Excluir um menu pela seção
 * pessoal exclui o menu do workspace, no rascunho, como na árvore de baixo.
 */
function podeExcluirSecao(id: string) {
  if (ehPessoal(id)) return true
  const no = menu.acharNo(id)
  return !!no && props.podeConfigurar && menu.excluivel(no)
}

function excluirSecao(id: string, rotulo: string) {
  if (ehPessoal(id)) trilha.excluirSecao(id)
  else menu.excluir(id)
  toast.add({ title: props.t.secaoExcluida(rotulo), icon: 'i-lucide-trash-2', color: 'neutral' })
}

function menuExcluivel(a: Atalho) {
  if (a.tipo !== 'tela' || !props.podeConfigurar) return null
  const no = menu.acharNo(a.id)
  return no && menu.excluivel(no) ? no : null
}

function excluirMenuMeu(secaoId: string, a: Atalho, no: NoDoMenu, menuChave?: string) {
  if (menuChave) trilha.tirarSubmenu(secaoId, menuChave, chaveDoAtalho(a))
  else trilha.removerAtalho(secaoId, chaveDoAtalho(a))
  excluirNoWorkspace(no)
}

function acoesDoMenuMeu(s: Opcao, a: Atalho, i: number) {
  const t = props.t
  const total = itensDe(s.id).length
  const chave = chaveDoAtalho(a)
  const excluivel = menuExcluivel(a)
  return [
    [
      { label: t.ctxSubir, icon: 'i-lucide-arrow-up', kbds: ['alt', 'arrowup'], disabled: i <= 0, onSelect: () => trilha.moverAtalhoJa(s.id, chave, -1) },
      { label: t.ctxDescer, icon: 'i-lucide-arrow-down', kbds: ['alt', 'arrowdown'], disabled: i >= total - 1, onSelect: () => trilha.moverAtalhoJa(s.id, chave, 1) },
    ],
    !trilha.atalhoRecebeSubmenu(a) ? [] : [{ label: t.adicionarSubmenu, icon: 'i-lucide-list-plus', onSelect: () => escolherNoMeu(s.id, rotuloDoAtalho(a), chave) }],
    [{ label: t.removerDaSecao, icon: 'i-lucide-circle-minus', onSelect: () => tirarMenuMeu(s.id, a) }],
    excluivel ? [{ label: t.excluirMenu, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => excluirMenuMeu(s.id, a, excluivel) }] : [],
  ].filter(b => b.length)
}

function acoesDoSubMeu(s: Opcao, a: Atalho, sub: Atalho, j: number) {
  const t = props.t
  const total = a.filhos?.length ?? 0
  const menuChave = chaveDoAtalho(a)
  const chave = chaveDoAtalho(sub)
  const excluivel = menuExcluivel(sub)
  return [
    [
      { label: t.ctxSubir, icon: 'i-lucide-arrow-up', kbds: ['alt', 'arrowup'], disabled: j <= 0, onSelect: () => trilha.moverSubmenu(s.id, menuChave, chave, -1) },
      { label: t.ctxDescer, icon: 'i-lucide-arrow-down', kbds: ['alt', 'arrowdown'], disabled: j >= total - 1, onSelect: () => trilha.moverSubmenu(s.id, menuChave, chave, 1) },
    ],
    [{ label: t.tirarDoMenu, icon: 'i-lucide-circle-minus', onSelect: () => tirarSubMeu(s.id, menuChave, sub) }],
    excluivel ? [{ label: t.excluirMenu, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => excluirMenuMeu(s.id, sub, excluivel, menuChave) }] : [],
  ].filter(b => b.length)
}

/** Alt com as setas, numa linha da árvore com foco. */
function teclarMenuMeu(e: KeyboardEvent, secaoId: string, chave: string, menuChave?: string) {
  if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return
  e.preventDefault()
  const passo = e.key === 'ArrowUp' ? -1 : 1
  if (menuChave) trilha.moverSubmenu(secaoId, menuChave, chave, passo)
  else trilha.moverAtalhoJa(secaoId, chave, passo)
}

/* ---------- Menu do workspace ---------- */

const secoesDoWorkspace = computed(() => menu.secoes.value)
const rotuloNo = (n: NoDoMenu) => rotuloDoNo(n, props.t)

function escolherNoWorkspace(rotulo: string, alvo: { secaoId?: string, menuId?: string }) {
  trilha.escolhendoMenu.value = { escopo: 'workspace', rotulo, ...alvo }
}

function avisarRecusa(r: { ok: boolean, motivo?: string }) {
  if (!r.ok) toast.add({ title: props.t.motivos[r.motivo ?? ''] ?? '', icon: 'i-lucide-ban', color: 'error' })
}

function excluirNoWorkspace(n: NoDoMenu) {
  menu.excluir(n.id)
  toast.add({ title: props.t.menuExcluido(rotuloNo(n)), icon: 'i-lucide-trash-2', color: 'neutral' })
}

function acoesDoMenuWs(secao: NoDoMenu, n: NoDoMenu, i: number) {
  const t = props.t
  const total = secao.filhos?.length ?? 0
  const sozinho = total <= 1
  return [
    [
      { label: t.ctxSubir, icon: 'i-lucide-arrow-up', kbds: ['alt', 'arrowup'], disabled: i <= 0, onSelect: () => menu.mover(n.id, -1) },
      { label: t.ctxDescer, icon: 'i-lucide-arrow-down', kbds: ['alt', 'arrowdown'], disabled: i >= total - 1, onSelect: () => menu.mover(n.id, 1) },
    ],
    [
      ...(menu.recebeSubmenu(n.id) ? [{ label: t.adicionarSubmenu, icon: 'i-lucide-list-plus', onSelect: () => escolherNoWorkspace(rotuloNo(n), { menuId: n.id }) }] : []),
      ...(sozinho ? [] : [{ label: t.removerDaSecao, icon: 'i-lucide-circle-minus', onSelect: () => avisarRecusa(menu.tirar(n.id)) }]),
    ],
    menu.excluivel(n) ? [{ label: t.excluirMenu, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => excluirNoWorkspace(n) }] : [],
  ].filter(b => b.length)
}

function acoesDoSubWs(pai: NoDoMenu, sub: NoDoMenu, j: number) {
  const t = props.t
  const total = pai.filhos?.length ?? 0
  return [
    [
      { label: t.ctxSubir, icon: 'i-lucide-arrow-up', kbds: ['alt', 'arrowup'], disabled: j <= 0, onSelect: () => menu.mover(sub.id, -1) },
      { label: t.ctxDescer, icon: 'i-lucide-arrow-down', kbds: ['alt', 'arrowdown'], disabled: j >= total - 1, onSelect: () => menu.mover(sub.id, 1) },
    ],
    [{ label: t.tirarDoMenu, icon: 'i-lucide-circle-minus', onSelect: () => avisarRecusa(menu.tirar(sub.id)) }],
    menu.excluivel(sub) ? [{ label: t.excluirMenu, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => excluirNoWorkspace(sub) }] : [],
  ].filter(b => b.length)
}

function teclarWs(e: KeyboardEvent, id: string) {
  if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return
  e.preventDefault()
  menu.mover(id, e.key === 'ArrowUp' ? -1 : 1)
}

</script>

<template>
  <UModal
    v-model:open="aberta"
    :title="props.t.personalizarTitulo"
    :description="props.t.personalizarDica"
    :ui="{ content: 'max-w-lg', body: 'min-h-[26rem]' }"
  >
    <template #body>
      <UTabs v-model="aba" :items="abas" :content="false" size="sm" class="mb-4" />

      <!-- ==================== Navegação ==================== -->
      <div v-if="aba === 'navegacao'" class="animate-[entrada_0.2s_ease-out_both] space-y-4">
        <ul class="space-y-1" @dragover.prevent @drop="e => soltar(e, 'navegacao')">
          <li
            v-for="a in areasNaOrdem"
            :key="a.id"
            class="group relative flex items-start gap-1.5 rounded-md px-1 py-1 focus-visible:outline-2 focus-visible:outline-primary"
            :class="classeDaMira(a.id)"
            :draggable="a.id !== 'inicio' && naTrilha(a.id) ? 'true' : undefined"
            :tabindex="a.id !== 'inicio' && naTrilha(a.id) ? 0 : undefined"
            @dragstart="arrastando = a.id"
            @dragover="e => passar(e, a.id)"
            @dragend="arrastando = null; mira = null"
            @keydown="e => teclar(e, a.id, 'navegacao', areasNaOrdem.filter(x => naTrilha(x.id)).map(x => x.id))"
          >
            <UIcon
              name="i-lucide-grip-vertical"
              class="mt-0.5 size-4 shrink-0 text-toned"
              :class="a.id !== 'inicio' && naTrilha(a.id) ? 'cursor-grab' : 'opacity-0'"
              aria-hidden="true"
            />
            <UCheckbox
              :model-value="naTrilha(a.id)"
              :disabled="a.id === 'inicio'"
              :description="a.id === 'inicio' ? props.t.navInicioDica : undefined"
              @update:model-value="v => alternarNaTrilha(a.id, v)"
            >
              <template #label>
                <span class="inline-flex items-center gap-2">
                  <UIcon :name="a.icone" class="size-4 text-toned" />
                  {{ a.rotulo }}
                </span>
              </template>
            </UCheckbox>
          </li>
        </ul>

        <USeparator />

        <div>
          <p class="mb-2 text-sm font-semibold text-highlighted">{{ props.t.aparencia }}</p>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="op in [{ v: false, r: props.t.soIcones }, { v: true, r: props.t.iconesERotulos }]"
              :key="String(op.v)"
              type="button"
              class="rounded-lg border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              :class="trilha.prefs.value.rotulos === op.v ? 'border-primary ring-1 ring-primary' : 'border-default hover:bg-elevated'"
              :aria-pressed="trilha.prefs.value.rotulos === op.v"
              @click="trilha.alternarRotulos(op.v)"
            >
              <!-- A miniatura: a trilha com ou sem o tracinho do rótulo. -->
              <span class="mb-2 flex h-16 gap-1.5 rounded-md bg-elevated p-1.5" aria-hidden="true">
                <span class="flex w-6 flex-col items-center gap-1 rounded bg-accented py-1">
                  <template v-for="n in 3" :key="n">
                    <span class="size-2.5 rounded-sm bg-inverted/25" />
                    <span v-if="op.v" class="h-0.5 w-3 rounded bg-inverted/25" />
                  </template>
                </span>
                <span class="flex-1 rounded bg-default" />
              </span>
              <span class="text-sm text-default">{{ op.r }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== Início ==================== -->
      <ul
        v-else-if="aba === 'inicio'"
        class="animate-[entrada_0.2s_ease-out_both] space-y-1"
        @dragover.prevent
        @drop="e => soltar(e, 'inicio')"
      >
        <li
          v-for="i in inicioNaOrdem"
          :key="i.id"
          class="group relative flex items-center gap-1.5 rounded-md px-1 py-1 focus-visible:outline-2 focus-visible:outline-primary"
          :class="classeDaMira(i.id)"
          draggable="true"
          tabindex="0"
          @dragstart="arrastando = i.id"
          @dragover="e => passar(e, i.id)"
          @dragend="arrastando = null; mira = null"
          @keydown="e => teclar(e, i.id, 'inicio', inicioNaOrdem.map(x => x.id))"
        >
          <UIcon name="i-lucide-grip-vertical" class="size-4 shrink-0 cursor-grab text-toned" aria-hidden="true" />
          <UCheckbox
            :model-value="noInicio(i.id)"
            @update:model-value="v => trilha.mostrarNoInicio(i.id, v === true)"
          >
            <template #label>
              <span class="inline-flex items-center gap-2">
                <UIcon :name="i.icone" class="size-4 text-toned" />
                {{ i.rotulo }}
              </span>
            </template>
          </UCheckbox>
        </li>
      </ul>

      <!-- ==================== Seções e menus (rodada 28) ==================== -->
      <div v-else class="animate-[entrada_0.2s_ease-out_both] space-y-4">
        <!-- ---------------- As seções do Início ---------------- -->
        <section :aria-label="props.t.noInicio">
          <p class="mb-1.5 text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.noInicio }}</p>
          <ul class="space-y-1.5" @dragover.prevent @drop="e => soltar(e, 'secoes')">
            <li
              v-for="s in visiveis"
              :key="s.id"
              class="group relative rounded-lg border border-default bg-default text-sm text-default transition-opacity focus-visible:outline-2 focus-visible:outline-primary"
              :class="classeDaMira(s.id)"
              draggable="true"
              tabindex="0"
              @dragstart="arrastando = s.id"
              @dragover="e => passar(e, s.id)"
              @dragend="arrastando = null; mira = null"
              @keydown.self="e => teclar(e, s.id, 'secoes', visiveis.map(x => x.id))"
            >
              <div class="flex items-center gap-2 px-2.5 py-2">
                <UIcon name="i-lucide-grip-vertical" class="size-4 shrink-0 cursor-grab text-toned" aria-hidden="true" />
                <button
                  v-if="ehPessoal(s.id)"
                  type="button"
                  class="flex size-5 shrink-0 items-center justify-center rounded text-toned hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
                  :aria-expanded="estaAberta(s.id)"
                  :aria-label="estaAberta(s.id) ? props.t.recolherSecao(s.rotulo) : props.t.expandirSecao(s.rotulo)"
                  @click="alternarAberta(s.id)"
                >
                  <UIcon name="i-lucide-chevron-right" class="size-3.5 transition-transform duration-200" :class="estaAberta(s.id) ? 'rotate-90' : ''" />
                </button>
                <UIcon :name="s.icone" class="size-4 shrink-0 text-toned" />
                <span class="min-w-0 flex-1 truncate font-medium">{{ s.rotulo }}</span>
                <!-- Rodada 30: Excluir e Ocultar aparecem no hover, à esquerda do "+", que fica sempre à vista. -->
                <UTooltip v-if="podeExcluirSecao(s.id)" :text="props.t.excluirSecao">
                  <UButton
                    icon="i-lucide-trash-2"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    class="opacity-0 transition-opacity hover:text-error group-hover:opacity-100 focus-visible:opacity-100"
                    :aria-label="`${props.t.excluirSecao}: ${s.rotulo}`"
                    @click="excluirSecao(s.id, s.rotulo)"
                  />
                </UTooltip>
                <UTooltip :text="props.t.ocultarSecao">
                  <UButton
                    icon="i-lucide-eye-off"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    class="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    :aria-label="`${props.t.ocultarSecao}: ${s.rotulo}`"
                    @click="trilha.ocultarSecao(s.id, true)"
                  />
                </UTooltip>
                <UTooltip v-if="ehPessoal(s.id)" :text="props.t.adicionarMenu">
                  <UButton
                    icon="i-lucide-plus"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    :aria-label="props.t.adicionarEm(s.rotulo)"
                    @click="escolherNoMeu(s.id, s.rotulo)"
                  />
                </UTooltip>
              </div>

              <!-- Os menus da seção pessoal e, embaixo de cada um, os submenus. -->
              <div v-if="ehPessoal(s.id) && estaAberta(s.id)" class="border-t border-default px-2 py-1.5">
                <p v-if="!itensDe(s.id).length" class="px-2 py-1 text-xs text-muted">{{ props.t.nadaNaSecao }}</p>
                <ul v-else class="space-y-0.5">
                  <li v-for="(a, i) in itensDe(s.id)" :key="chaveDoAtalho(a)">
                    <div
                      class="flex items-center gap-2 rounded-md py-1 pl-6 pr-1 hover:bg-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                      tabindex="0"
                      @keydown="e => teclarMenuMeu(e, s.id, chaveDoAtalho(a))"
                    >
                      <UIcon :name="iconeDoAtalho(a)" class="size-4 shrink-0 text-toned" />
                      <span class="min-w-0 flex-1 truncate">{{ rotuloDoAtalho(a) }}</span>
                      <UDropdownMenu :items="acoesDoMenuMeu(s, a, i)" :content="{ align: 'end' }">
                        <UButton icon="i-lucide-ellipsis" size="xs" color="neutral" variant="ghost" :aria-label="props.t.maisAcoes(rotuloDoAtalho(a))" />
                      </UDropdownMenu>
                    </div>
                    <ul v-if="a.filhos?.length" class="space-y-0.5">
                      <li
                        v-for="(sub, j) in a.filhos"
                        :key="chaveDoAtalho(sub)"
                        class="flex items-center gap-2 rounded-md py-1 pl-12 pr-1 hover:bg-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                        tabindex="0"
                        @keydown="e => teclarMenuMeu(e, s.id, chaveDoAtalho(sub), chaveDoAtalho(a))"
                      >
                        <UIcon :name="iconeDoAtalho(sub)" class="size-4 shrink-0 text-toned" />
                        <span class="min-w-0 flex-1 truncate">{{ rotuloDoAtalho(sub) }}</span>
                        <UDropdownMenu :items="acoesDoSubMeu(s, a, sub, j)" :content="{ align: 'end' }">
                          <UButton icon="i-lucide-ellipsis" size="xs" color="neutral" variant="ghost" :aria-label="props.t.maisAcoes(rotuloDoAtalho(sub))" />
                        </UDropdownMenu>
                      </li>
                    </ul>
                  </li>
                </ul>
                <UButton :label="props.t.adicionarMenu" icon="i-lucide-plus" size="xs" color="neutral" variant="ghost" class="ml-4 mt-1" @click="escolherNoMeu(s.id, s.rotulo)" />
              </div>
              <p v-else-if="s.id === 'favoritos'" class="border-t border-default px-3 py-1.5 text-xs text-muted">{{ props.t.vemDaEstrela }}</p>
              <p v-else-if="s.id === 'categorias'" class="border-t border-default px-3 py-1.5 text-xs text-muted">{{ props.t.vemDoWorkspace }}</p>
            </li>
            <li>
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-lg border border-default px-2.5 py-2 text-sm text-default transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
                @click="trilha.criandoSecao.value = 'nova'"
              >
                <UIcon name="i-lucide-plus" class="size-4 text-toned" />
                {{ props.t.criarSecaoRotulo }}
              </button>
            </li>
          </ul>

          <div class="mt-3">
            <p class="mb-1 text-xs font-semibold text-toned">{{ props.t.secoesOcultasTitulo }}</p>
            <p v-if="!ocultas.length" class="text-xs text-muted">{{ props.t.todasSecoesMostradas }}</p>
            <ul v-else class="space-y-1">
              <li v-for="s in ocultas" :key="s.id" class="flex items-center gap-2 px-1 py-1 text-sm text-muted">
                <UIcon :name="s.icone" class="size-4 shrink-0" />
                <span class="min-w-0 flex-1 truncate">{{ s.rotulo }}</span>
                <UButton
                  icon="i-lucide-eye"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  :aria-label="`${props.t.mostrarNoMenu}: ${s.rotulo}`"
                  @click="trilha.ocultarSecao(s.id, false)"
                />
              </li>
            </ul>
          </div>
        </section>

        <!-- ---------------- As seções das áreas (trilha e painéis) ---------------- -->
        <section :aria-label="props.t.secoesDasAreas">
          <p class="mb-1.5 text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.secoesDasAreas }}</p>
          <ul class="space-y-1.5">
            <li v-for="s in secoesDoWorkspace" :key="s.id" class="group rounded-lg border border-default bg-default text-sm text-default">
              <div class="flex items-center gap-2 px-2.5 py-2">
                <button
                  type="button"
                  class="flex size-5 shrink-0 items-center justify-center rounded text-toned hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
                  :aria-expanded="estaAberta(s.id)"
                  :aria-label="estaAberta(s.id) ? props.t.recolherSecao(rotuloNo(s)) : props.t.expandirSecao(rotuloNo(s))"
                  @click="alternarAberta(s.id)"
                >
                  <UIcon name="i-lucide-chevron-right" class="size-3.5 transition-transform duration-200" :class="estaAberta(s.id) ? 'rotate-90' : ''" />
                </button>
                <UIcon :name="s.icone" class="size-4 shrink-0 text-toned" />
                <span class="min-w-0 flex-1 truncate font-medium">{{ rotuloNo(s) }}</span>
                <UTooltip v-if="props.podeConfigurar && menu.excluivel(s)" :text="props.t.excluirSecao">
                  <UButton
                    icon="i-lucide-trash-2"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    class="opacity-0 transition-opacity hover:text-error group-hover:opacity-100 focus-visible:opacity-100"
                    :aria-label="`${props.t.excluirSecao}: ${rotuloNo(s)}`"
                    @click="excluirSecao(s.id, rotuloNo(s))"
                  />
                </UTooltip>
                <UTooltip v-if="s.ordemFixa" :text="props.t.motivos.ordemFixa">
                  <UIcon name="i-lucide-lock" class="size-3.5 shrink-0 text-toned" :aria-label="props.t.motivos.ordemFixa" />
                </UTooltip>
                <UTooltip v-else-if="props.podeConfigurar" :text="props.t.adicionarMenu">
                  <UButton
                    icon="i-lucide-plus"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    :aria-label="props.t.adicionarEm(rotuloNo(s))"
                    @click="escolherNoWorkspace(rotuloNo(s), { secaoId: s.id })"
                  />
                </UTooltip>
              </div>

              <div v-if="estaAberta(s.id)" class="border-t border-default px-2 py-1.5">
                <p v-if="!(s.filhos ?? []).length" class="px-2 py-1 text-xs text-muted">{{ props.t.nadaNaSecao }}</p>
                <ul v-else class="space-y-0.5">
                  <li v-for="(m, i) in (s.filhos ?? [])" :key="m.id">
                    <div
                      class="flex items-center gap-2 rounded-md py-1 pl-6 pr-1 hover:bg-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                      tabindex="0"
                      @keydown="e => s.ordemFixa || !props.podeConfigurar || teclarWs(e, m.id)"
                    >
                      <UIcon :name="m.icone" class="size-4 shrink-0 text-toned" />
                      <span class="min-w-0 flex-1 truncate">{{ rotuloNo(m) }}</span>
                      <span v-if="menu.tocados.value.includes(m.id)" class="size-2 shrink-0 rounded-full bg-warning" role="img" :aria-label="props.t.pontoAlterado" />
                      <UDropdownMenu v-if="!s.ordemFixa && props.podeConfigurar" :items="acoesDoMenuWs(s, m, i)" :content="{ align: 'end' }">
                        <UButton icon="i-lucide-ellipsis" size="xs" color="neutral" variant="ghost" :aria-label="props.t.maisAcoes(rotuloNo(m))" />
                      </UDropdownMenu>
                    </div>
                    <ul v-if="m.filhos?.length" class="space-y-0.5">
                      <li
                        v-for="(sub, j) in m.filhos"
                        :key="sub.id"
                        class="flex items-center gap-2 rounded-md py-1 pl-12 pr-1 hover:bg-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                        tabindex="0"
                        @keydown="e => !props.podeConfigurar || teclarWs(e, sub.id)"
                      >
                        <UIcon :name="sub.icone" class="size-4 shrink-0 text-toned" />
                        <span class="min-w-0 flex-1 truncate">{{ rotuloNo(sub) }}</span>
                        <span v-if="menu.tocados.value.includes(sub.id)" class="size-2 shrink-0 rounded-full bg-warning" role="img" :aria-label="props.t.pontoAlterado" />
                        <UDropdownMenu v-if="props.podeConfigurar" :items="acoesDoSubWs(m, sub, j)" :content="{ align: 'end' }">
                          <UButton icon="i-lucide-ellipsis" size="xs" color="neutral" variant="ghost" :aria-label="props.t.maisAcoes(rotuloNo(sub))" />
                        </UDropdownMenu>
                      </li>
                    </ul>
                  </li>
                </ul>
                <UButton
                  v-if="!s.ordemFixa && props.podeConfigurar"
                  :label="props.t.adicionarMenu"
                  icon="i-lucide-plus"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  class="ml-4 mt-1"
                  @click="escolherNoWorkspace(rotuloNo(s), { secaoId: s.id })"
                />
              </div>
            </li>
          </ul>
        </section>
      </div>
    </template>

    <!-- Rodada 28: um Salvar só, para o que mudou em qualquer aba. O alcance se escolhe aqui. -->
    <template #footer>
      <div class="flex w-full items-center gap-2">
        <p class="min-w-0 flex-1 text-xs" :class="menu.alterado.value ? 'font-medium text-highlighted' : 'text-muted'">
          {{ menu.alterado.value ? props.t.naoSalvoTitulo : props.t.nadaParaSalvar }}
        </p>
        <UButton :label="props.t.descartar" size="sm" color="neutral" variant="ghost" :disabled="!menu.alterado.value" @click="menu.descartar()" />
        <UDropdownMenu v-if="props.podeConfigurar" :items="opcoesDeSalvar" :content="{ align: 'end', side: 'top' }" :disabled="!menu.alterado.value">
          <UButton :label="props.t.salvar" trailing-icon="i-lucide-chevron-up" size="sm" color="primary" :disabled="!menu.alterado.value" />
        </UDropdownMenu>
        <UButton v-else :label="props.t.salvarLocal" size="sm" color="primary" :disabled="!menu.alterado.value" @click="salvar('local')" />
      </div>
    </template>
  </UModal>
</template>
