<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import SecaoDeMenu from './_SecaoDeMenu.vue'
import MenuDeAjuda from './_MenuDeAjuda.vue'
import CartaoDeSalvar from './_CartaoDeSalvar.vue'
import AvisosDoMenu from './_AvisosDoMenu.vue'
import { useMenuDoWorkspace, useArraste } from './estado'
import { useAcoesDoMenu, type Acoes } from './acoes'
import { gruposDeConfiguracao, workspace, type NoDoMenu, type Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * MODELO ALTERNATIVO: trilha de ícones mais painel da área.
 *
 * É o desenho do Jira antigo, do Teams, do Slack, do monday e da Global
 * Navigation do ClickUp. Está aqui para ser COMPARADO com a barra única: a
 * pesquisa mostra que o padrão serve produtos com vários modos de trabalho que
 * convivem, e que o próprio Jira saiu dele na navegação nova.
 *
 * RODADA 5: também lê a árvore do `estado.ts`, então seção criada aparece aqui
 * do mesmo jeito. E o campo `lugar` da seção decide onde ela cai:
 *
 *   `trilha`  vira um ícone próprio na barra estreita, com painel só dela;
 *   `painel`  vira uma seção recolhível dentro do painel que o campo apontar.
 *
 * É o "menu grandão e menu pequeno" da demanda, funcionando.
 *
 * RODADA 14: a trilha ganhou o que a barra única já tinha.
 *
 *   "no modelo de barra unica do menu do prototipo voce fez drag and drop nos
 *    elementos direto no menu. no de trilha e painel vc nao fez isso. tem que
 *    fazer, tanto na trilha quanto no painel." (Mikaela)
 *
 * Arrastar no PAINEL é o arraste da barra única, com as mesmas regras de
 * encaixe. Arrastar na TRILHA faz três coisas, conforme onde solta:
 *
 *   na borda de cima ou de baixo de um ícone de seção: reordena a trilha (e
 *   traz para a trilha a seção que estava num painel);
 *   no meio do ícone de uma seção: põe o item dentro dela;
 *   no meio de Trabalho ou de Dados: leva a seção para dentro daquele painel.
 *
 * Trabalho, Dados e Configurações não se arrastam. É a regra do ClickUp para
 * o Home ("the only item that can't be edited is Home"), estendida às três
 * áreas nativas: são a moldura, e as seções do workspace mudam dentro dela.
 *
 * E botão direito em tudo, e o painel recolhe, deixando só a trilha.
 */
const props = defineProps<{
  t: TextosDaTela
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
  /** Rodada 14: recolhido, só a trilha aparece. */
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
const arraste = useArraste()
const toast = useToast()
const area = ref('trabalho')

function rotuloDe(no: NoDoMenu) {
  if (no.rotulo) return no.rotulo
  const mapa: Record<string, string> = {
    inicio: props.t.inicio,
    inbox: props.t.inbox,
    chatIa: props.t.chatIa,
    tarefas: props.t.tarefas,
    agenda: props.t.agenda,
    spaceflows: props.t.spaceflows,
    documentos: props.t.documentos,
    categorias: props.t.categorias,
    // Auditoria reaproveita os rótulos que já existiam nas configurações.
    auditoria: props.t.grupos.auditoria,
    logsAuditoria: props.t.itens['logs-auditoria'],
    logsRequisicao: props.t.itens['logs-requisicao'],
  }
  return mapa[no.chave ?? ''] ?? (no.chave ?? '')
}

/**
 * As áreas da trilha: as duas nativas, depois UMA POR SEÇÃO que o administrador
 * mandou para a trilha, e por último administração e ajuda. Não existe balde
 * genérico de "seções": ele agrupava por mecanismo, e ela apontou isso.
 */
const areas = computed(() => [
  { id: 'trabalho', icone: 'i-lucide-house', rotulo: props.t.areaTrabalho, bloqueada: false },
  { id: 'dados', icone: 'i-lucide-database', rotulo: props.t.areaDados, bloqueada: false },
  ...menu.secoesNaTrilha.value.map(s => ({
    id: `sec:${s.id}`,
    icone: s.icone,
    rotulo: rotuloDe(s),
    bloqueada: false,
  })),
  { id: 'config', icone: 'i-lucide-settings', rotulo: props.t.configuracoes, bloqueada: !props.podeConfigurar },
  /*
   * RODADA 9: a Ajuda SAIU daqui. Ela era uma área da trilha, do mesmo tamanho
   * de Trabalho e de Dados, para três links que se usam quando algo trava.
   * Virou ícone na base, junto da lupa e do criar. O BENI, que era o primeiro
   * item dela, virou "Chat de IA" e está nos destinos nativos.
   */
])

/** Seção inteira por vir: o selo sobe para o cabeçalho e as linhas ficam limpas. */
function seloDaSecao(no: NoDoMenu) {
  const filhos = no.filhos ?? []
  if (!filhos.length || !filhos.every(f => f.emBreve)) return undefined
  return props.t.emBreve
}

/** O contador do Inbox vem do estado das notificações e some no zero. */
/* (rodada 14: os destinos agora vêm de `destinosDaBarra`, sem os ocultos) */
function contadorDe(no: NoDoMenu) {
  if (no.chave === 'inbox') return menu.naoLidas.value || undefined
  if (no.chave === 'tarefas') return 3
  return undefined
}

const tituloDaArea = computed(() => areas.value.find(a => a.id === area.value)?.rotulo ?? '')

/** Seção inteira por vir, na trilha: o selo vai para o título do painel. */
const seloDaArea = computed(() => (secaoAtual.value ? seloDaSecao(secaoAtual.value) : undefined))

const secaoAtual = computed(() => {
  if (!area.value.startsWith('sec:')) return null
  return menu.secoes.value.find(s => s.id === area.value.slice(4)) ?? null
})

/** As seções que o administrador mandou para dentro de um painel. */
function secoesDoPainel(painel: string) {
  return menu.secoesNoPainel.value.filter(s => (s.painel ?? 'trabalho') === painel)
}

/* O grupo aberto acompanha o item ativo, como na barra unica (rodada 10). */
const grupoDoItem = (id: string) => gruposDeConfiguracao.find(g => g.itens.some(i => i.id === id))?.id ?? 'workspace'
const grupoAberto = ref(grupoDoItem(props.itemConfigAtivo))
watch(() => props.itemConfigAtivo, (id) => { grupoAberto.value = grupoDoItem(id) })
const abertas = ref<Record<string, boolean>>({ favoritos: true, categorias: true })

function aberta(id: string) {
  return abertas.value[id] ?? false
}
function alternar(id: string) {
  abertas.value[id] = !aberta(id)
}

/*
 * AS DUAS REGRAS DE ABERTURA (rodada 10), as mesmas da barra única:
 * clicar num menu de primeiro nível abre a primeira tela dele, e seção com uma
 * tela só vira linha que abre direto. Aqui o "menu de primeiro nível" é o
 * ícone da trilha, então escolher a área já escolhe a primeira tela da área.
 */
function temUmaSo(no: NoDoMenu) {
  return (no.filhos?.length ?? 0) === 1
}

function unicoFilho(no: NoDoMenu) {
  return (no.filhos ?? [])[0]
}

function abrirSecao(no: NoDoMenu) {
  const estavaAberta = aberta(no.id)
  alternar(no.id)
  if (estavaAberta) return
  const primeiro = (no.filhos ?? [])[0]
  if (primeiro) emit('destino', primeiro.id)
}

function abrirFavoritos() {
  const estavaAberta = aberta('favoritos')
  alternar('favoritos')
  if (estavaAberta) return
  const primeira = props.favoritas[0]
  if (primeira) emit('categoria', primeira)
}

function abrirCategorias() {
  const estavaAberta = aberta('categorias')
  alternar('categorias')
  if (estavaAberta) return
  const primeira = props.recorte[0]
  if (primeira) emit('categoria', primeira)
}

/** A primeira tela da área, que é o que trocar de área passa a abrir. */
function abrirPrimeiraDaArea(id: string) {
  if (id === 'trabalho') {
    const d = menu.destinos.value[0]
    if (d) emit('destino', d.id)
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

function irPara(a: { id: string, bloqueada: boolean }) {
  if (a.bloqueada) return
  const jaEstava = area.value === a.id
  area.value = a.id
  if (!jaEstava) abrirPrimeiraDaArea(a.id)
}

/*
 * A área escolhida pode deixar de existir: apagar ou mover uma seção para o
 * painel tira o ícone da trilha. Sem isto o painel ficaria vazio e sem título.
 */
watch(areas, (lista) => {
  if (!lista.some(a => a.id === area.value)) area.value = 'trabalho'
})

/* ==================================================================
   O ARRASTE (rodada 14)
================================================================== */

/** Quem configura arrasta o menu. As categorias, todo mundo (rodada 6). */
const podeArrastar = computed(() => props.podeConfigurar)

function marcaDe(id: string) {
  return arraste.alvo.value?.id === id ? arraste.alvo.value.posicao : null
}

/** Que painel é o desta área, para a seção que cair nele. */
function painelDaArea(id: string) {
  return id === 'dados' ? 'dados' : 'trabalho'
}

/* ------------------------- no painel ------------------------- */

const recusandoNoPainel = computed(() => {
  const a = arraste.alvo.value
  if (!a || a.id.startsWith('area:') || a.id.startsWith('cat:')) return false
  return !menu.avaliar(arraste.arrastando.value, a.id, a.posicao).ok
})

/**
 * Soltar no painel é o soltar da barra única, com um passo a mais: a seção
 * que vem da trilha e cai no primeiro nível de um painel passa a morar nele.
 */
function largarNoPainel(alvoId: string, posicao: 'antes' | 'depois' | 'dentro') {
  const quem = arraste.arrastando.value
  arraste.terminar()
  if (!quem || quem.startsWith('cat:')) return
  const r = menu.soltar(quem, alvoId, posicao)
  if (!r.ok) {
    toast.add({ title: props.t.motivos[r.motivo] ?? '', icon: 'i-lucide-ban', color: 'error' })
    return
  }
  const no = menu.acharNo(quem)
  if (no?.tipo === 'secao' && no.lugar === 'trilha' && posicao !== 'dentro') {
    const painel = painelDaArea(area.value)
    menu.mudarLugar(quem, 'painel', painel)
    toast.add({ title: props.t.levadoParaPainel(rotuloDe(no), tituloDaArea.value), icon: 'i-lucide-panel-left', color: 'neutral' })
  }
}

/** As categorias de Dados: o mesmo gesto e a mesma regra da barra única. */
function largarCategoria(alvoId: number, posicao: 'antes' | 'depois') {
  const quem = arraste.arrastando.value
  arraste.terminar()
  if (!quem || !quem.startsWith('cat:')) return
  if (props.ordem !== 'manual') {
    emit('virarManual')
    toast.add({ title: props.t.viraPersonalizada, icon: 'i-lucide-grip-vertical', color: 'neutral' })
  }
  menu.reordenarCategoria(Number(quem.slice(4)), alvoId, posicao)
}

/* ------------------------- na trilha ------------------------- */

/**
 * O que a trilha aceita, sem mexer em nada: pinta a marca de recusa
 * enquanto o item ainda está no ar, como no painel.
 */
function vereditoNaTrilha(arrastadoId: string | null, areaId: string, posicao: 'antes' | 'depois' | 'dentro'): { ok: true } | { ok: false, motivo: string } {
  if (!arrastadoId) return { ok: true }
  if (arrastadoId.startsWith('cat:')) return { ok: false, motivo: 'categoriaSoEmCategorias' }
  const no = menu.acharNo(arrastadoId)
  if (!no) return { ok: true }
  if (areaId === 'config') return { ok: false, motivo: 'areaFixa' }

  if (!areaId.startsWith('sec:')) {
    // Trabalho e Dados: só recebem DENTRO, e só seção.
    if (posicao !== 'dentro') return { ok: false, motivo: 'areaFixa' }
    return no.tipo === 'secao' ? { ok: true } : { ok: false, motivo: 'soSecaoNaTrilha' }
  }

  const secaoId = areaId.slice(4)
  if (posicao === 'dentro') {
    if (no.tipo === 'secao') return { ok: false, motivo: 'secaoDentroDeSecao' }
    return menu.avaliar(arrastadoId, secaoId, 'dentro')
  }
  return no.tipo === 'secao' ? { ok: true } : { ok: false, motivo: 'soSecaoNaTrilha' }
}

const recusandoNaTrilha = computed(() => {
  const a = arraste.alvo.value
  if (!a || !a.id.startsWith('area:')) return false
  return !vereditoNaTrilha(arraste.arrastando.value, a.id.slice(5), a.posicao).ok
})

/** Terços: as bordas reordenam, o meio põe dentro. Área nativa é só meio. */
function ondeCaiNaTrilha(e: DragEvent, areaId: string): 'antes' | 'depois' | 'dentro' {
  if (!areaId.startsWith('sec:')) return 'dentro'
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const y = e.clientY - r.top
  if (y < r.height * 0.3) return 'antes'
  if (y > r.height * 0.7) return 'depois'
  return 'dentro'
}

function passarNaTrilha(e: DragEvent, areaId: string) {
  if (!arraste.arrastando.value) return
  e.preventDefault()
  arraste.mirar(`area:${areaId}`, ondeCaiNaTrilha(e, areaId))
}

function largarNaTrilha(e: DragEvent, areaId: string) {
  e.preventDefault()
  const quem = arraste.arrastando.value
  const posicao = ondeCaiNaTrilha(e, areaId)
  arraste.terminar()
  if (!quem || `sec:${quem}` === areaId) return

  const v = vereditoNaTrilha(quem, areaId, posicao)
  if (!v.ok) {
    toast.add({ title: props.t.motivos[v.motivo] ?? '', icon: 'i-lucide-ban', color: 'error' })
    return
  }
  const no = menu.acharNo(quem)
  if (!no) return

  if (!areaId.startsWith('sec:')) {
    // Seção solta em Trabalho ou Dados: passa a morar naquele painel.
    menu.mudarLugar(quem, 'painel', painelDaArea(areaId))
    const nomeDaArea = areas.value.find(a => a.id === areaId)?.rotulo ?? ''
    toast.add({ title: props.t.levadoParaPainel(rotuloDe(no), nomeDaArea), icon: 'i-lucide-panel-left', color: 'neutral' })
    return
  }

  const secaoId = areaId.slice(4)
  if (posicao === 'dentro') {
    menu.moverParaSecao(quem, secaoId)
    return
  }
  // Borda de cima ou de baixo: reordena, e quem vinha de um painel sobe para a trilha.
  const vinhaDoPainel = no.lugar !== 'trilha'
  menu.soltar(quem, secaoId, posicao)
  if (vinhaDoPainel) {
    menu.mudarLugar(quem, 'trilha')
    toast.add({ title: props.t.levadoParaTrilha(rotuloDe(no)), icon: 'i-lucide-panel-left', color: 'neutral' })
  }
}

/* ==================================================================
   O BOTÃO DIREITO (rodada 14)
================================================================== */

const acoes = useAcoesDoMenu({
  t: () => props.t,
  podeConfigurar: () => props.podeConfigurar,
  rotuloDe,
  abrirDestino: id => emit('destino', id),
  abrirCategoria: c => emit('categoria', c),
  alternarFixar: id => emit('alternarFixar', id),
  configurarCategoria: c => emit('configurarCategoria', c),
  novaTela: id => emit('novaTela', id),
  // Abrir pelo botão direito segue a regra do clique (rodada 10).
  secaoAberta: id => aberta(id),
  alternarSecao: (id) => {
    const no = menu.secoesDaBarra.value.find(n => n.id === id)
    if (no) abrirSecao(no)
    else alternar(id)
  },
})

const idsDosDestinos = computed(() => menu.destinosDaBarra.value.map(d => d.id))
const idsDaTrilha = computed(() => menu.secoesNaTrilha.value.map(s => s.id))
const idsDoPainel = (painel: string) => secoesDoPainel(painel).map(s => s.id)
const idsDasCategorias = computed(() => props.recorte.map(c => c.id))

/** "Levar para a trilha", na seção que está num painel. */
function paraTrilha(no: NoDoMenu) {
  const travado = !props.podeConfigurar
  return [{
    label: props.t.ctxParaTrilha,
    icon: 'i-lucide-panel-left',
    description: travado ? props.t.ctxSoQuemConfigura : undefined,
    disabled: travado,
    onSelect: () => {
      menu.mudarLugar(no.id, 'trilha')
      toast.add({ title: props.t.levadoParaTrilha(rotuloDe(no)), icon: 'i-lucide-panel-left', color: 'neutral' })
    },
  }]
}

/** "Levar para Trabalho" e "Levar para Dados", na seção que está na trilha. */
function paraPaineis(no: NoDoMenu) {
  const travado = !props.podeConfigurar
  return (['trabalho', 'dados'] as const).map(p => {
    const nome = p === 'dados' ? props.t.areaDados : props.t.areaTrabalho
    return {
      label: props.t.ctxParaPainel(nome),
      icon: p === 'dados' ? 'i-lucide-database' : 'i-lucide-house',
      description: travado ? props.t.ctxSoQuemConfigura : undefined,
      disabled: travado,
      onSelect: () => {
        menu.mudarLugar(no.id, 'painel', p)
        toast.add({ title: props.t.levadoParaPainel(rotuloDe(no), nome), icon: 'i-lucide-panel-left', color: 'neutral' })
      },
    }
  })
}

const itemRecolher = computed(() => ({
  label: props.recolhido ? props.t.expandirMenu : props.t.recolherMenu,
  icon: props.recolhido ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close',
  kbds: ['meta', '\\'],
  onSelect: () => emit('recolher'),
}))

/** O botão direito num ícone da trilha. */
function acoesDaArea(a: { id: string, rotulo: string, bloqueada: boolean }): Acoes {
  const abrir = { label: props.t.ctxAbrir, icon: 'i-lucide-arrow-up-right', disabled: a.bloqueada, onSelect: () => irPara(a) }
  if (!a.id.startsWith('sec:')) return [[abrir], [itemRecolher.value]]
  const no = menu.secoes.value.find(s => s.id === a.id.slice(4))
  if (!no) return [[abrir], [itemRecolher.value]]
  return [
    [abrir, { label: props.t.ctxCopiarLink, icon: 'i-lucide-link', onSelect: () => acoes.copiarLink(no.id) }],
    [...acoes.itensDeMover(no.id, idsDaTrilha.value), ...paraPaineis(no)],
    acoes.blocoMexer(no),
    [itemRecolher.value],
  ]
}

const opcoesDeOrdemPlanas = computed(() => [
  { label: props.t.ordemMaisUsadas, icon: 'i-lucide-flame', valor: 'uso' },
  { label: props.t.ordemAlfabetica, icon: 'i-lucide-arrow-down-a-z', valor: 'alfabetica' },
  { label: props.t.ordemRecentes, icon: 'i-lucide-clock', valor: 'recentes' },
  { label: props.t.ordemPersonalizada, icon: 'i-lucide-grip-vertical', valor: 'manual' },
])

/** O cabeçalho de Categorias em Dados: abrir, ordenar, ver todas. */
const acoesDeCategorias = computed<Acoes>(() => {
  const aberta_ = aberta('categorias')
  return [[
    {
      label: aberta_ ? props.t.ctxRecolher : props.t.ctxExpandir,
      icon: aberta_ ? 'i-lucide-chevrons-down-up' : 'i-lucide-chevrons-up-down',
      onSelect: () => abrirCategorias(),
    },
  ], [
    acoes.itemDeOrdem(props.ordem, opcoesDeOrdemPlanas.value, v => emit('ordem', v as typeof props.ordem)),
    { label: props.t.verTodas(props.totalDeCategorias), icon: 'i-lucide-layout-grid', onSelect: () => emit('verTodas') },
  ]]
})

function passoDaCategoria(c: Categoria, passo: -1 | 1) {
  const lista = idsDasCategorias.value
  const vizinho = lista[lista.indexOf(c.id) + passo]
  if (vizinho === undefined) return
  if (props.ordem !== 'manual') {
    emit('virarManual')
    toast.add({ title: props.t.viraPersonalizada, icon: 'i-lucide-grip-vertical', color: 'neutral' })
  }
  menu.reordenarCategoria(c.id, vizinho, passo < 0 ? 'antes' : 'depois')
}
</script>

<template>
  <div class="flex h-full">
    <!-- ==================== A TRILHA ==================== -->
    <div class="flex w-[4.5rem] shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-default bg-accented/40 py-2">
      <UTooltip :text="workspace.nome" :content="{ side: 'right' }">
        <button
          type="button"
          class="mb-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-inverted transition-transform hover:scale-105"
          :aria-label="props.t.trocarWorkspace"
        >
          {{ workspace.inicial }}
        </button>
      </UTooltip>

      <!--
        EXPANDIR (rodada 14). Recolhido, o painel some e este botão aparece no
        alto da trilha. É onde o ClickUp põe o dele: "click the expand icon at
        the top of your Global Navigation".
      -->
      <UTooltip v-if="props.recolhido" :text="props.t.expandirMenu" :kbds="['meta', '\\']" :content="{ side: 'right' }">
        <UButton
          icon="i-lucide-panel-left-open"
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

      <!--
        Cada área é alvo de soltar; só as seções se arrastam. A linha da marca
        e o anel de "dentro" são os mesmos do painel e da barra única.
      -->
      <UContextMenu v-for="a in areas" :key="a.id" :items="acoesDaArea(a)">
        <UTooltip :text="a.rotulo" :content="{ side: 'right' }" :disabled="!props.recolhido">
          <button
            type="button"
            class="relative flex w-full shrink-0 flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            :class="[
              area === a.id
                ? 'bg-primary/15 text-highlighted'
                : a.bloqueada
                  ? 'cursor-not-allowed text-muted'
                  : 'text-default hover:bg-elevated',
              arraste.arrastando.value === a.id.slice(4) ? 'opacity-40' : '',
              marcaDe(`area:${a.id}`) === 'dentro'
                ? (recusandoNaTrilha ? 'bg-error/10 ring-1 ring-error' : 'bg-primary/10 ring-1 ring-primary')
                : '',
              marcaDe(`area:${a.id}`) === 'antes' ? 'before:absolute before:inset-x-1 before:-top-0.5 before:h-0.5 before:rounded-full' : '',
              marcaDe(`area:${a.id}`) === 'depois' ? 'after:absolute after:inset-x-1 after:-bottom-0.5 after:h-0.5 after:rounded-full' : '',
              recusandoNaTrilha ? 'before:bg-error after:bg-error' : 'before:bg-primary after:bg-primary',
            ]"
            :aria-current="area === a.id ? 'page' : undefined"
            :aria-disabled="a.bloqueada || undefined"
            :draggable="podeArrastar && a.id.startsWith('sec:') ? 'true' : undefined"
            @click="irPara(a)"
            @dragstart="arraste.comecar(a.id.slice(4))"
            @dragover="e => passarNaTrilha(e, a.id)"
            @drop="e => largarNaTrilha(e, a.id)"
            @dragend="arraste.terminar()"
            @keydown.alt.up.prevent="a.id.startsWith('sec:') && podeArrastar && acoes.itensDeMover(a.id.slice(4), idsDaTrilha)[0]?.onSelect?.(new Event('select'))"
            @keydown.alt.down.prevent="a.id.startsWith('sec:') && podeArrastar && acoes.itensDeMover(a.id.slice(4), idsDaTrilha)[1]?.onSelect?.(new Event('select'))"
          >
            <UIcon
              :name="a.bloqueada ? 'i-lucide-lock' : a.icone"
              class="size-5"
              :class="area === a.id ? 'text-primary' : ''"
            />
            <span class="w-full truncate text-center text-[10px] font-medium leading-tight">{{ a.rotulo }}</span>
            <!-- Mexida e não salva: a mesma bolinha das linhas. -->
            <span
              v-if="a.id.startsWith('sec:') && menu.tocados.value.includes(a.id.slice(4))"
              class="absolute right-1.5 top-1.5 size-2 rounded-full bg-warning"
              role="img"
              :aria-label="props.t.pontoAlterado"
            />
          </button>
        </UTooltip>
      </UContextMenu>

      <div class="min-h-2 flex-1" />

      <!--
        Recolhido não esconde o que falta salvar (rodada 14): o cartão de salvar
        mora na barra aberta, então aqui fica o sinal, e o clique abre a barra.
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


      <!--
        RODADA 8: a lupa e o criar voltaram para a base da trilha, a pedido dela.
        Subiram na rodada 7 e desceram aqui: ela viu os dois arranjos e preferiu
        este. É também onde o Slack, o Teams e o monday os põem.
      -->
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

      <!-- RODADA 9: a Ajuda mora aqui agora, ícone com menu no hover. -->
      <MenuDeAjuda :t="props.t" @escolher="r => emit('ajuda', r)" />

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

    <!-- ==================== O PAINEL DA ÁREA ==================== -->
    <!-- Recolhido (rodada 14), o painel sai e fica só a trilha. -->
    <div v-if="!props.recolhido" class="relative flex min-w-0 flex-1 animate-[entrada_0.2s_ease-out_both] flex-col">
      <div class="flex h-12 shrink-0 items-center gap-2 border-b border-default pl-3 pr-1.5">
        <h2 class="min-w-0 truncate text-sm font-bold text-highlighted">{{ tituloDaArea }}</h2>
        <UBadge v-if="seloDaArea" :label="seloDaArea" size="sm" color="neutral" variant="subtle" class="shrink-0" />
        <span class="flex-1" />
        <UTooltip :text="props.t.recolherMenu" :kbds="['meta', '\\']">
          <UButton
            icon="i-lucide-panel-left-close"
            size="sm"
            color="neutral"
            variant="ghost"
            class="shrink-0"
            :aria-label="props.t.recolherMenu"
            aria-keyshortcuts="Control+Backslash"
            @click="emit('recolher')"
          />
        </UTooltip>
      </div>

      <nav class="min-h-0 flex-1 overflow-y-auto px-2 py-2" :aria-label="tituloDaArea">
        <!-- ---------- Trabalho ---------- -->
        <template v-if="area === 'trabalho'">
          <div class="space-y-0.5">
            <LinhaDeMenu
              v-for="(d, i) in menu.destinosDaBarra.value"
              :key="d.id"
              :icone="d.icone"
              :rotulo="rotuloDe(d)"
              :contador="contadorDe(d)"
              :selo="d.emBreve ? props.t.emBreve : undefined"
              :ativo="props.destinoAtivo === d.id"
              :atraso="i * 25"
              :alterado="menu.tocados.value.includes(d.id)"
              :dica-alterado="props.t.pontoAlterado"
              :acoes="acoes.daLinha(d, idsDosDestinos)"
              :arrastavel="podeArrastar"
              :saindo="arraste.arrastando.value === d.id"
              :marca="marcaDe(d.id) === 'dentro' ? null : marcaDe(d.id)"
              :recusando="recusandoNoPainel"
              @selecionar="emit('destino', d.id)"
              @arrastar-inicio="arraste.comecar(d.id)"
              @arrastar-sobre="p => arraste.mirar(d.id, p)"
              @soltar="p => largarNoPainel(d.id, p)"
              @arrastar-fim="arraste.terminar()"
              @mover="p => acoes.itensDeMover(d.id, idsDosDestinos)[p < 0 ? 0 : 1]?.onSelect?.(new Event('select'))"
            />
          </div>

          <template v-for="s in secoesDoPainel('trabalho')" :key="s.id">
            <LinhaDeMenu
              v-if="temUmaSo(s)"
              class="mt-2"
              :icone="s.icone"
              :rotulo="rotuloDe(s)"
              :selo="seloDaSecao(s)"
              :ativo="props.destinoAtivo === unicoFilho(s).id"
              :alterado="menu.tocados.value.includes(s.id)"
              :dica-alterado="props.t.pontoAlterado"
              :acoes="acoes.daLinha(s, idsDoPainel('trabalho'), { abrir: () => emit('destino', unicoFilho(s).id), lugar: paraTrilha(s) })"
              :arrastavel="podeArrastar"
              aceita-dentro
              :saindo="arraste.arrastando.value === s.id"
              :marca="marcaDe(s.id)"
              :recusando="recusandoNoPainel"
              @selecionar="emit('destino', unicoFilho(s).id)"
              @arrastar-inicio="arraste.comecar(s.id)"
              @arrastar-sobre="p => arraste.mirar(s.id, p)"
              @soltar="p => largarNoPainel(s.id, p)"
              @arrastar-fim="arraste.terminar()"
            />
            <SecaoDeMenu
              v-else
              :rotulo="rotuloDe(s)"
              :selo="seloDaSecao(s)"
              :aberta="aberta(s.id)"
              :texto-recolher="props.t.recolherSecao(rotuloDe(s))"
              :texto-expandir="props.t.expandirSecao(rotuloDe(s))"
              :alterado="menu.tocados.value.includes(s.id)"
              :dica-alterado="props.t.pontoAlterado"
              :acoes="acoes.daSecao(s, idsDoPainel('trabalho'), paraTrilha(s))"
              :arrastavel="podeArrastar"
              :saindo="arraste.arrastando.value === s.id"
              :marca="marcaDe(s.id)"
              :recusando="recusandoNoPainel"
              @alternar="abrirSecao(s)"
              @arrastar-inicio="arraste.comecar(s.id)"
              @arrastar-sobre="p => arraste.mirar(s.id, p)"
              @soltar="p => largarNoPainel(s.id, p)"
              @arrastar-fim="arraste.terminar()"
              @mover="p => acoes.itensDeMover(s.id, idsDoPainel('trabalho'))[p < 0 ? 0 : 1]?.onSelect?.(new Event('select'))"
            >
              <LinhaDeMenu
                v-for="(item, i) in (s.filhos ?? [])"
                :key="item.id"
                :icone="item.icone"
                :rotulo="rotuloDe(item)"
                :nivel="2"
                :selo="item.emBreve ? props.t.emBreve : undefined"
                :ativo="props.destinoAtivo === item.id"
                :atraso="i * 25"
                :alterado="menu.tocados.value.includes(item.id)"
                :dica-alterado="props.t.pontoAlterado"
                :acoes="acoes.daLinha(item, (s.filhos ?? []).map(f => f.id))"
                :arrastavel="podeArrastar"
                :saindo="arraste.arrastando.value === item.id"
                :marca="marcaDe(item.id) === 'dentro' ? null : marcaDe(item.id)"
                :recusando="recusandoNoPainel"
                @selecionar="emit('destino', item.id)"
                @arrastar-inicio="arraste.comecar(item.id)"
                @arrastar-sobre="p => arraste.mirar(item.id, p)"
                @soltar="p => largarNoPainel(item.id, p)"
                @arrastar-fim="arraste.terminar()"
                @mover="p => menu.mover(item.id, p)"
              />
            </SecaoDeMenu>
          </template>
        </template>

        <!-- ---------- Dados ---------- -->
        <template v-else-if="area === 'dados'">
          <div v-if="props.estado === 'carregando'" class="space-y-2">
            <USkeleton v-for="n in 6" :key="n" class="h-7" />
          </div>

          <div v-else-if="props.estado === 'vazio'" class="rounded-lg border border-dashed border-default p-3">
            <p class="text-sm font-medium text-highlighted">{{ props.t.vazioTitulo }}</p>
            <p class="mt-1 text-xs leading-relaxed text-muted">{{ props.t.vazioDescricao }}</p>
          </div>

          <template v-else>
            <SecaoDeMenu
              v-if="props.favoritas.length"
              :rotulo="props.t.favoritos"
              :aberta="aberta('favoritos')"
              :texto-recolher="props.t.recolherSecao(props.t.favoritos)"
              :texto-expandir="props.t.expandirSecao(props.t.favoritos)"
              @alternar="abrirFavoritos()"
            >
              <LinhaDeMenu
                v-for="(c, i) in props.favoritas"
                :key="c.id"
                :icone="c.icon ?? 'i-lucide-folder'"
                :rotulo="c.name"
                :nivel="2"
                com-estrela
                :fixada="true"
                :rotulo-fixar="props.t.fixar"
                :rotulo-desafixar="props.t.desafixar"
                :ativo="props.categoriaAtivaId === c.id"
                :atraso="i * 25"
                :acoes="acoes.daCategoria(c)"
                @selecionar="emit('categoria', c)"
                @alternar-estrela="emit('alternarFixar', c.id)"
              />
            </SecaoDeMenu>

            <SecaoDeMenu
              :rotulo="props.t.categorias"
              :aberta="aberta('categorias')"
              :contador="props.totalDeCategorias || undefined"
              :texto-recolher="props.t.recolherSecao(props.t.categorias)"
              :texto-expandir="props.t.expandirSecao(props.t.categorias)"
              :acoes="acoesDeCategorias"
              @alternar="abrirCategorias()"
            >
              <LinhaDeMenu
                v-for="(c, i) in props.recorte"
                :key="c.id"
                :icone="c.icon ?? 'i-lucide-folder'"
                :rotulo="c.name"
                :nivel="2"
                com-estrela
                :fixada="c.favorita"
                :rotulo-fixar="props.t.fixar"
                :rotulo-desafixar="props.t.desafixar"
                :ativo="props.categoriaAtivaId === c.id"
                :atraso="80 + i * 25"
                :alterado="menu.tocados.value.includes(`cat:${c.id}`)"
                :dica-alterado="props.t.pontoAlterado"
                :acoes="acoes.daCategoria(c, { visiveis: idsDasCategorias, passo: passoDaCategoria })"
                arrastavel
                :saindo="arraste.arrastando.value === `cat:${c.id}`"
                :marca="marcaDe(`cat:${c.id}`) === 'dentro' ? null : marcaDe(`cat:${c.id}`)"
                @selecionar="emit('categoria', c)"
                @alternar-estrela="emit('alternarFixar', c.id)"
                @arrastar-inicio="arraste.comecar(`cat:${c.id}`)"
                @arrastar-sobre="p => arraste.mirar(`cat:${c.id}`, p)"
                @soltar="p => largarCategoria(c.id, p === 'dentro' ? 'depois' : p)"
                @arrastar-fim="arraste.terminar()"
                @mover="p => passoDaCategoria(c, p)"
              />
              <button
                type="button"
                class="mt-0.5 flex w-full items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-sm font-medium text-highlighted transition-colors hover:bg-primary/10"
                @click="emit('verTodas')"
              >
                <UIcon name="i-lucide-layout-grid" class="size-4 shrink-0 text-primary" />
                <span class="min-w-0 flex-1 truncate text-left">{{ props.t.verTodas(props.totalDeCategorias) }}</span>
              </button>
            </SecaoDeMenu>

            <template v-for="s in secoesDoPainel('dados')" :key="s.id">
              <!-- Uma tela só: linha simples que abre direto, sem seta. -->
              <LinhaDeMenu
                v-if="temUmaSo(s)"
                class="mt-2"
                :icone="s.icone"
                :rotulo="rotuloDe(s)"
                :selo="seloDaSecao(s)"
                :ativo="props.destinoAtivo === unicoFilho(s).id"
                :alterado="menu.tocados.value.includes(s.id)"
                :dica-alterado="props.t.pontoAlterado"
                :acoes="acoes.daLinha(s, idsDoPainel('dados'), { abrir: () => emit('destino', unicoFilho(s).id), lugar: paraTrilha(s) })"
                :arrastavel="podeArrastar"
                aceita-dentro
                :saindo="arraste.arrastando.value === s.id"
                :marca="marcaDe(s.id)"
                :recusando="recusandoNoPainel"
                @selecionar="emit('destino', unicoFilho(s).id)"
                @arrastar-inicio="arraste.comecar(s.id)"
                @arrastar-sobre="p => arraste.mirar(s.id, p)"
                @soltar="p => largarNoPainel(s.id, p)"
                @arrastar-fim="arraste.terminar()"
              />
              <SecaoDeMenu
                v-else
                :rotulo="rotuloDe(s)"
                :selo="seloDaSecao(s)"
                :aberta="aberta(s.id)"
                :texto-recolher="props.t.recolherSecao(rotuloDe(s))"
                :texto-expandir="props.t.expandirSecao(rotuloDe(s))"
                :alterado="menu.tocados.value.includes(s.id)"
                :dica-alterado="props.t.pontoAlterado"
                :acoes="acoes.daSecao(s, idsDoPainel('dados'), paraTrilha(s))"
                :arrastavel="podeArrastar"
                :saindo="arraste.arrastando.value === s.id"
                :marca="marcaDe(s.id)"
                :recusando="recusandoNoPainel"
                @alternar="abrirSecao(s)"
                @arrastar-inicio="arraste.comecar(s.id)"
                @arrastar-sobre="p => arraste.mirar(s.id, p)"
                @soltar="p => largarNoPainel(s.id, p)"
                @arrastar-fim="arraste.terminar()"
              >
                <LinhaDeMenu
                  v-for="(item, i) in (s.filhos ?? [])"
                  :key="item.id"
                  :icone="item.icone"
                  :rotulo="rotuloDe(item)"
                  :nivel="2"
                  :selo="item.emBreve ? props.t.emBreve : undefined"
                  :ativo="props.destinoAtivo === item.id"
                  :atraso="i * 25"
                  :alterado="menu.tocados.value.includes(item.id)"
                  :dica-alterado="props.t.pontoAlterado"
                  :acoes="acoes.daLinha(item, (s.filhos ?? []).map(f => f.id))"
                  :arrastavel="podeArrastar"
                  :saindo="arraste.arrastando.value === item.id"
                  :marca="marcaDe(item.id) === 'dentro' ? null : marcaDe(item.id)"
                  :recusando="recusandoNoPainel"
                  @selecionar="emit('destino', item.id)"
                  @arrastar-inicio="arraste.comecar(item.id)"
                  @arrastar-sobre="p => arraste.mirar(item.id, p)"
                  @soltar="p => largarNoPainel(item.id, p)"
                  @arrastar-fim="arraste.terminar()"
                  @mover="p => menu.mover(item.id, p)"
                />
              </SecaoDeMenu>
            </template>
          </template>
        </template>

        <!-- ---------- Uma seção que foi para a trilha ---------- -->
        <div v-else-if="secaoAtual" class="space-y-0.5">
          <LinhaDeMenu
            v-for="(item, i) in (secaoAtual.filhos ?? [])"
            :key="item.id"
            :icone="item.icone"
            :rotulo="rotuloDe(item)"
            :selo="seloDaArea ? undefined : (item.emBreve ? props.t.emBreve : undefined)"
            :ativo="props.destinoAtivo === item.id"
            :atraso="i * 25"
            :alterado="menu.tocados.value.includes(item.id)"
            :dica-alterado="props.t.pontoAlterado"
            :acoes="acoes.daLinha(item, (secaoAtual.filhos ?? []).map(f => f.id))"
            :arrastavel="podeArrastar"
            :saindo="arraste.arrastando.value === item.id"
            :marca="marcaDe(item.id) === 'dentro' ? null : marcaDe(item.id)"
            :recusando="recusandoNoPainel"
            @selecionar="emit('destino', item.id)"
            @arrastar-inicio="arraste.comecar(item.id)"
            @arrastar-sobre="p => arraste.mirar(item.id, p)"
            @soltar="p => largarNoPainel(item.id, p)"
            @arrastar-fim="arraste.terminar()"
            @mover="p => menu.mover(item.id, p)"
          />
        </div>

        <!-- ---------- Configurações ---------- -->
        <template v-else-if="area === 'config'">
          <SecaoDeMenu
            v-for="g in gruposDeConfiguracao"
            :key="g.id"
            :rotulo="props.t.grupos[g.id] ?? g.id"
            :aberta="grupoAberto === g.id"
            :texto-recolher="props.t.recolherSecao(props.t.grupos[g.id] ?? g.id)"
            :texto-expandir="props.t.expandirSecao(props.t.grupos[g.id] ?? g.id)"
            @alternar="grupoAberto = grupoAberto === g.id ? '' : g.id"
          >
            <LinhaDeMenu
              v-for="(item, i) in g.itens"
              :key="item.id"
              :icone="item.icone"
              :rotulo="props.t.itens[item.id] ?? item.id"
              :nivel="2"
              :ativo="props.itemConfigAtivo === item.id"
              :atraso="i * 22"
              @selecionar="emit('item', item.id, props.t.itens[item.id] ?? item.id)"
            />
          </SecaoDeMenu>
        </template>

        <!-- Menu só meu e itens ocultos, como na barra única. -->
        <AvisosDoMenu v-if="area !== 'config'" :t="props.t" :rotulo-de="rotuloDe" />
      </nav>

      <!-- O mesmo Salvar da barra única: o que se arruma aqui grava igual. -->
      <CartaoDeSalvar :t="props.t" :pode-configurar="props.podeConfigurar" rente />
    </div>
  </div>
</template>
