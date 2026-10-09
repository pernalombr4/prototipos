<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import SecaoDeMenu from './_SecaoDeMenu.vue'
import MenuInicio from './_MenuInicio.vue'
import AvisosDoMenu from './_AvisosDoMenu.vue'
import { useMenuDoWorkspace, useArraste } from './estado'
import { useAcoesDoMenu, type Acoes } from './acoes'
import { rotuloDoNo } from './rotulos'
import { gruposDeConfiguracao, type NoDoMenu, type Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O CONTEÚDO DE UMA ÁREA DA TRILHA (rodada 15).
 *
 * Saiu de dentro do _ModeloTrilha.vue porque agora ele aparece em dois
 * lugares: ENCAIXADO ao lado da trilha (a área escolhida) e FLUTUANDO num
 * popover, quando o mouse passa no ícone de outra área. É o que o ClickUp faz:
 * "o Início continua aberto no fundo e o outro menu abre em popover".
 *
 * Início é o _MenuInicio.vue. Dados, as seções que foram para a trilha e
 * Configurações continuam como estavam na rodada 14.
 *
 * Flutuando, não se arrasta nem abre menu de ações: um popover dentro de
 * outro fecharia o de fora assim que o mouse fosse para o de dentro.
 */
const props = defineProps<{
  t: TextosDaTela
  area: string
  titulo: string
  categorias: Categoria[]
  favoritas: Categoria[]
  recorte: Categoria[]
  totalDeCategorias: number
  destinoAtivo: string
  categoriaAtivaId: number | null
  itemConfigAtivo: string
  estado: 'normal' | 'vazio' | 'carregando' | 'erro'
  podeConfigurar: boolean
  ordem: 'uso' | 'alfabetica' | 'recentes' | 'manual'
  flutuante?: boolean
}>()

const emit = defineEmits<{
  destino: [id: string]
  categoria: [c: Categoria]
  alternarFixar: [id: number]
  verTodas: []
  item: [id: string, rotulo: string]
  ordem: [valor: 'uso' | 'alfabetica' | 'recentes' | 'manual']
  virarManual: []
  novaTela: [secaoId: string]
  configurarCategoria: [c: Categoria]
}>()

const menu = useMenuDoWorkspace()
const arraste = useArraste()
const toast = useToast()

const rotuloDe = (no: NoDoMenu) => rotuloDoNo(no, props.t)

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


/** Seção inteira por vir, na trilha: o selo vai para o título do painel. */
const seloDaArea = computed(() => (secaoAtual.value ? seloDaSecao(secaoAtual.value) : undefined))

const secaoAtual = computed(() => {
  if (!props.area.startsWith('sec:')) return null
  return menu.secoes.value.find(s => s.id === props.area.slice(4)) ?? null
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
    const painel = painelDaArea(props.area)
    menu.mudarLugar(quem, 'painel', painel)
    toast.add({ title: props.t.levadoParaPainel(rotuloDe(no), props.titulo), icon: 'i-lucide-panel-left', color: 'neutral' })
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
  <!--
    Com algo para salvar, o cartão flutua sobre o fim da lista. O respiro
    embaixo deixa rolar o último item para fora dele (rodada 16: ele cobria o
    "Personalizar a barra lateral").
  -->
  <nav
    class="min-h-0 flex-1 overflow-y-auto px-2 pt-2 transition-[padding] duration-200"
    :class="menu.alterado.value && !props.flutuante ? 'pb-40' : 'pb-2'"
    :aria-label="props.titulo"
  >
    <!-- ---------- Início: o menu do ClickUp (rodada 15) ---------- -->
    <MenuInicio
      v-if="props.area === 'inicio'"
      :t="props.t"
      :categorias="props.categorias"
      :favoritas="props.favoritas"
      :recorte="props.recorte"
      :total-de-categorias="props.totalDeCategorias"
      :destino-ativo="props.destinoAtivo"
      :categoria-ativa-id="props.categoriaAtivaId"
      :pode-configurar="props.podeConfigurar"
      :ordem="props.ordem"
      :flutuante="props.flutuante"
      @destino="id => emit('destino', id)"
      @categoria="c => emit('categoria', c)"
      @alternar-fixar="id => emit('alternarFixar', id)"
      @ver-todas="emit('verTodas')"
      @nova-tela="id => emit('novaTela', id)"
      @configurar-categoria="c => emit('configurarCategoria', c)"
      @ordem="v => emit('ordem', v)"
      @virar-manual="emit('virarManual')"
    />

        <!-- ---------- Dados ---------- -->
        <template v-else-if="props.area === 'dados'">
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
                :acoes="props.flutuante ? undefined : acoes.daCategoria(c)"
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
              :acoes="props.flutuante ? undefined : acoesDeCategorias"
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
                :acoes="props.flutuante ? undefined : acoes.daCategoria(c, { visiveis: idsDasCategorias, passo: passoDaCategoria })"
                :arrastavel="!props.flutuante"
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
                :acoes="props.flutuante ? undefined : acoes.daLinha(s, idsDoPainel('dados'), { abrir: () => emit('destino', unicoFilho(s).id), lugar: paraTrilha(s) })"
                :arrastavel="podeArrastar && !props.flutuante"
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
                :acoes="props.flutuante ? undefined : acoes.daSecao(s, idsDoPainel('dados'), paraTrilha(s))"
                :arrastavel="podeArrastar && !props.flutuante"
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
                  :acoes="props.flutuante ? undefined : acoes.daLinha(item, (s.filhos ?? []).map(f => f.id))"
                  :arrastavel="podeArrastar && !props.flutuante"
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
            :acoes="props.flutuante ? undefined : acoes.daLinha(item, (secaoAtual.filhos ?? []).map(f => f.id))"
            :arrastavel="podeArrastar && !props.flutuante"
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
        <template v-else-if="props.area === 'config'">
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
    <AvisosDoMenu v-if="props.area !== 'config' && props.area !== 'inicio' && !props.flutuante" :t="props.t" :rotulo-de="rotuloDe" />
  </nav>
</template>
