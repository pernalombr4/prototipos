<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import SecaoDeMenu from './_SecaoDeMenu.vue'
import MenuDeAjuda from './_MenuDeAjuda.vue'
import { useMenuDoWorkspace, useArraste } from './estado'
import type { NoDoMenu, Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O painel de trabalho: o menu do dia a dia.
 *
 * Dois níveis e nada mais. Nível 1 é destino solto ou nome de seção; nível 2 é
 * item dentro de seção. O terceiro nível de hoje (formulário dentro de
 * categoria) virou aba na tela da categoria.
 *
 * RODADA 5, e é a mudança estrutural:
 *
 * O menu agora vem do `estado.ts`, a MESMA árvore que o editor manipula. Antes a
 * barra lia o `mocks.ts` direto, e por isso criar uma seção mudava o editor e
 * não mudava o menu. Agora muda.
 *
 * E a reordenação é ARRASTANDO, aqui dentro também, não só no editor. Arrastar
 * mexe no rascunho e acende a barra de salvar no rodapé: a gravação só acontece
 * no clique em Salvar. É a regra dela, "salvar depois de arrastar tudo".
 *
 * RODADA 6: a lista de categorias também se arrasta.
 *
 * Ela tem quatro ordenações, como no Attio: três automáticas (mais usadas,
 * alfabética, criadas recentemente) e `Personalizada`, que é o `Custom` de lá.
 * Arrastar com uma automática ligada LIGA a personalizada antes de mover, e
 * avisa: senão o gesto seria desfeito no recálculo seguinte, e a pessoa acharia
 * que o arraste não funciona.
 *
 * A ordem das categorias é preferência de quem usa, não configuração do
 * workspace, mas viaja no mesmo rascunho e grava no mesmo Salvar: arrastar é
 * arrastar, e ter duas regras de gravação na mesma barra confundiria.
 */
const props = defineProps<{
  t: TextosDaTela
  favoritas: Categoria[]
  recorte: Categoria[]
  /** Todas, para o filtro procurar além do recorte de cinco. */
  todas: Categoria[]
  totalDeCategorias: number
  destinoAtivo: string
  categoriaAtivaId: number | null
  estado: 'normal' | 'vazio' | 'carregando' | 'erro'
  podeConfigurar: boolean
  ordem: 'uso' | 'alfabetica' | 'recentes' | 'manual'
}>()

const emit = defineEmits<{
  destino: [id: string]
  categoria: [c: Categoria]
  alternarFixar: [id: number]
  verTodas: []
  configuracoes: []
  criar: []
  ordem: [valor: 'uso' | 'alfabetica' | 'recentes' | 'manual']
  virarManual: []
  ajuda: [rotulo: string]
  editar: []
}>()

const menu = useMenuDoWorkspace()
const arraste = useArraste()
const toast = useToast()

/** Rótulo de um nó: nativo vem do dicionário, do workspace vem do próprio nó. */
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
 * O contador de um destino.
 *
 * Rodada 9. O do Inbox vem do estado das notificações, o mesmo que a tela lê:
 * abrir uma notificação baixa o número aqui. E ele SOME no zero, de propósito:
 * número que nunca zera vira decoração e para de ser lido.
 */
function contadorDe(no: NoDoMenu) {
  if (no.chave === 'inbox') return menu.naoLidas.value || undefined
  if (no.chave === 'tarefas') return 3
  return undefined
}

/**
 * Seção em que TODAS as telas ainda vão existir carrega o selo no cabeçalho, e
 * as linhas de dentro ficam limpas. Seção em que só uma é futura não: ali o
 * selo precisa dizer qual.
 */
function seloDaSecao(no: NoDoMenu) {
  const filhos = no.filhos ?? []
  if (!filhos.length || !filhos.every(f => f.emBreve)) return undefined
  return props.t.emBreve
}

/* ------------------------------ o arraste ------------------------------ */

function marcaDe(id: string) {
  return arraste.alvo.value?.id === id ? arraste.alvo.value.posicao : null
}

const recusandoAgora = computed(() => {
  const a = arraste.alvo.value
  if (!a) return false
  return !menu.avaliar(arraste.arrastando.value, a.id, a.posicao).ok
})

function mirar(id: string, posicao: 'antes' | 'depois' | 'dentro') {
  arraste.mirar(id, posicao)
}

function largar(id: string, posicao: 'antes' | 'depois' | 'dentro') {
  const quem = arraste.arrastando.value
  arraste.terminar()
  if (!quem) return
  const r = menu.soltar(quem, id, posicao)
  if (!r.ok) {
    toast.add({ title: props.t.motivos[r.motivo] ?? '', icon: 'i-lucide-ban', color: 'error' })
  }
}

/*
 * O arraste das categorias anda no mesmo estado do arraste do menu, com um
 * prefixo para os dois nao se confundirem: um mexe na arvore, o outro na ordem
 * pessoal da lista.
 */
function arrastarCategoria(id: number) {
  arraste.comecar(`cat:${id}`)
}

function largarCategoria(alvoId: number, posicao: 'antes' | 'depois') {
  const quem = arraste.arrastando.value
  arraste.terminar()
  if (!quem || !quem.startsWith('cat:')) return

  // Arrastar com criterio automatico ligado liga o manual antes, senao o
  // proximo recalculo desfaz o gesto.
  if (props.ordem !== 'manual') {
    emit('virarManual')
    toast.add({ title: props.t.viraPersonalizada, icon: 'i-lucide-grip-vertical', color: 'neutral' })
  }
  menu.reordenarCategoria(Number(quem.slice(4)), alvoId, posicao)
}

function salvarMenu() {
  menu.salvar()
  toast.add({ title: props.t.menuSalvo, icon: 'i-lucide-check', color: 'neutral' })
}

/* ------------------------------ seções abertas ------------------------------ */

const abertas = ref<Record<string, boolean>>({ favoritos: true, categorias: true })

function aberta(id: string) {
  return abertas.value[id] ?? false
}
function alternar(id: string) {
  abertas.value[id] = !aberta(id)
}

/*
 * ============ AS DUAS REGRAS DE ABERTURA (rodada 10) ============
 *
 * Ela ditou as duas:
 *
 *   "se algo tem so um menu interno, ja deve abrir automaticamente nele"
 *   "todo menu de primeiro nivel quando clicado deve abrir o primeiro menu
 *    da lista"
 *
 * Juntas elas dizem uma coisa só: **menu de primeiro nível não é beco sem
 * saída.** Clicar sempre leva a algum lugar; nunca só revela uma lista e deixa
 * a pessoa escolher de novo. É o que o Linear e o Notion fazem com seção.
 *
 * Duas fronteiras, que são decisão minha:
 *
 * 1. **Fechar é só fechar.** Abrir leva para a primeira tela; fechar não leva
 *    a lugar nenhum. Senão recolher a lista de categorias para ganhar espaço
 *    arrastaria a pessoa para dentro de uma categoria toda vez.
 * 2. **A regra vale também para Favoritos e Categorias**, que são menus de
 *    primeiro nível como os outros. Abrir Categorias abre a primeira da lista.
 */

/** Seção com uma tela só: vira linha simples, e clicar abre a tela. */
function temUmaSo(no: NoDoMenu) {
  return (no.filhos?.length ?? 0) === 1
}

function unicoFilho(no: NoDoMenu) {
  return (no.filhos ?? [])[0]
}

/** Abrir a seção abre a primeira tela dela. Fechar só fecha. */
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
  const primeira = favoritasVisiveis.value[0]
  if (primeira) emit('categoria', primeira)
}

function abrirCategorias() {
  const estavaAberta = aberta('categorias')
  alternar('categorias')
  if (estavaAberta) return
  const primeira = categoriasVisiveis.value[0]
  if (primeira) emit('categoria', primeira)
}

const opcoesDeOrdem = computed(() => [[
  { label: props.t.ordemMaisUsadas, icon: 'i-lucide-flame', onSelect: () => emit('ordem', 'uso') },
  { label: props.t.ordemAlfabetica, icon: 'i-lucide-arrow-down-a-z', onSelect: () => emit('ordem', 'alfabetica') },
  { label: props.t.ordemRecentes, icon: 'i-lucide-clock', onSelect: () => emit('ordem', 'recentes') },
], [
  { label: props.t.ordemPersonalizada, icon: 'i-lucide-grip-vertical', onSelect: () => emit('ordem', 'manual') },
]])

/* ------------------------------ o filtro ------------------------------ */

const filtro = ref('')
const filtrando = computed(() => filtro.value.trim().length > 0)

/*
 * Quem nao pode configurar nao arrasta o MENU, que e do workspace inteiro.
 * Mas continua arrastando as CATEGORIAS, porque aquela ordem e preferencia de
 * quem usa, e nao configuracao (decisao da rodada 6).
 */
const podeArrastarMenu = computed(() => !filtrando.value && props.podeConfigurar)

function casa(texto: string) {
  return texto.toLowerCase().includes(filtro.value.trim().toLowerCase())
}

const favoritasVisiveis = computed(() => filtrando.value ? props.favoritas.filter(c => casa(c.name)) : props.favoritas)
const categoriasVisiveis = computed(() => {
  if (!filtrando.value) return props.recorte
  return props.todas.filter(c => !c.favorita && casa(c.name))
})

/**
 * A BARRA PASSA A SER DESENHADA NA ORDEM DA ÁRVORE (rodada 9).
 *
 * Antes o gabarito tinha blocos fixos: destinos, favoritos, categorias e, por
 * último, as seções. Ordem de gabarito, não ordem da árvore. Enquanto a árvore
 * combinava com o gabarito ninguém via a diferença, mas arrastar uma seção para
 * cima dos destinos, ou pôr Análise antes das categorias, era um gesto que o
 * editor aceitava e a barra ignorava.
 *
 * Agora a barra percorre a árvore e desenha cada nó conforme o tipo. É o que
 * faz Análise aparecer onde ela pediu, logo abaixo dos destinos nativos, e é o
 * que faz o que se arrasta ficar onde foi solto.
 *
 * Os favoritos são o único bloco que não está na árvore: eles são preferência
 * de quem usa, não configuração do workspace. Entram grudados na seção de
 * categorias, logo acima dela, porque é dela que eles saem.
 */
const nosVisiveis = computed(() => {
  const arvore = menu.arvoreVisivel.value
  if (!filtrando.value) return arvore

  return arvore
    .map(n => (n.tipo === 'secao'
      ? { ...n, filhos: (n.filhos ?? []).filter(f => casa(rotuloDe(f))) }
      : n))
    .filter((n) => {
      if (n.tipo === 'destino') return casa(rotuloDe(n))
      if (n.tipo === 'secao') return (n.filhos?.length ?? 0) > 0 || casa(rotuloDe(n))
      // A seção nativa de categorias carrega junto os favoritos.
      return favoritasVisiveis.value.length > 0
        || categoriasVisiveis.value.length > 0
        || casa(rotuloDe(n))
    })
})

const nadaNoFiltro = computed(() => filtrando.value && !nosVisiveis.value.length)
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- ============ topo: o FILTRO do menu, não a busca global ============ -->
    <div class="shrink-0 px-2 pb-1 pt-1.5">
      <UInput
        v-model="filtro"
        icon="i-lucide-filter"
        size="sm"
        class="w-full"
        :placeholder="props.t.filtroDoMenu"
        :aria-label="props.t.filtroDoMenu"
      >
        <template v-if="filtro" #trailing>
          <UButton
            icon="i-lucide-x"
            size="xs"
            color="neutral"
            variant="link"
            :aria-label="props.t.todasFechar"
            @click="filtro = ''"
          />
        </template>
      </UInput>
    </div>

    <!-- ============ navegação ============ -->
    <nav class="min-h-0 flex-1 overflow-y-auto px-2" :aria-label="props.t.inicio">
      <div v-if="props.estado === 'carregando'" class="space-y-2 pt-1">
        <USkeleton v-for="n in 7" :key="n" class="h-7" :class="n % 3 === 0 ? 'w-3/4' : 'w-full'" />
      </div>

      <div v-else-if="props.estado === 'erro'" class="pt-2">
        <UAlert
          icon="i-lucide-unplug"
          color="error"
          variant="subtle"
          :title="props.t.erroTitulo"
          :description="props.t.erroDescricao"
          :actions="[{ label: props.t.erroAcao, color: 'neutral', variant: 'outline' }]"
          :ui="{ title: 'text-sm', description: 'text-xs' }"
        />
      </div>

      <template v-else>
        <UEmpty
          v-if="nadaNoFiltro"
          icon="i-lucide-search-x"
          :title="props.t.filtroSemResultado"
          :description="props.t.todasNenhumaDica"
          class="animate-[entrada_0.25s_ease-out_both]"
        />

        <template v-for="no in nosVisiveis" :key="no.id">
          <!-- ---------- destino nativo: folha, uma linha ---------- -->
          <LinhaDeMenu
            v-if="no.tipo === 'destino'"
            class="mt-0.5 first:mt-0"
            :icone="no.icone"
            :rotulo="rotuloDe(no)"
            :contador="contadorDe(no)"
            :selo="no.emBreve ? props.t.emBreve : undefined"
            :ativo="props.destinoAtivo === no.id"
            :arrastavel="podeArrastarMenu"
            :saindo="arraste.arrastando.value === no.id"
            :marca="marcaDe(no.id) === 'dentro' ? null : marcaDe(no.id)"
            :recusando="recusandoAgora"
            @selecionar="emit('destino', no.id)"
            @arrastar-inicio="arraste.comecar(no.id)"
            @arrastar-sobre="p => mirar(no.id, p)"
            @soltar="p => largar(no.id, p)"
            @arrastar-fim="arraste.terminar()"
            @mover="p => menu.mover(no.id, p)"
          />

          <!-- ---------- a seção nativa: favoritos mais categorias ---------- -->
          <template v-else-if="no.tipo === 'secao-nativa'">
            <!-- Favoritos: pessoal, nasce do uso, não entra no arraste do menu -->
            <SecaoDeMenu
              v-if="favoritasVisiveis.length"
              :rotulo="props.t.favoritos"
              :aberta="filtrando || aberta('favoritos')"
              :texto-recolher="props.t.recolherSecao(props.t.favoritos)"
              :texto-expandir="props.t.expandirSecao(props.t.favoritos)"
              @alternar="abrirFavoritos()"
            >
              <LinhaDeMenu
                v-for="(c, i) in favoritasVisiveis"
                :key="c.id"
                :icone="c.icon ?? 'i-lucide-folder'"
                :rotulo="c.name"
                :nivel="2"
                com-estrela
                :fixada="true"
                :rotulo-fixar="props.t.fixar"
                :rotulo-desafixar="props.t.desafixar"
                :ativo="props.categoriaAtivaId === c.id"
                :atraso="100 + i * 25"
                @selecionar="emit('categoria', c)"
                @alternar-estrela="emit('alternarFixar', c.id)"
              />
            </SecaoDeMenu>

            <!-- Categorias: a seção que cresce. Ordenada por critério, não por arraste. -->
            <SecaoDeMenu
              v-if="!filtrando || categoriasVisiveis.length"
              :rotulo="props.t.categorias"
              :aberta="filtrando || aberta('categorias')"
              :contador="props.totalDeCategorias || undefined"
              :texto-recolher="props.t.recolherSecao(props.t.categorias)"
              :texto-expandir="props.t.expandirSecao(props.t.categorias)"
              @alternar="abrirCategorias()"
            >
              <template #acoes>
                <UDropdownMenu :items="opcoesDeOrdem">
                  <UButton
                    icon="i-lucide-settings-2"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    :aria-label="props.t.ordenarPor"
                  />
                </UDropdownMenu>
              </template>

              <template v-if="props.estado === 'vazio' && !filtrando">
                <div class="mx-1 mt-1 rounded-lg border border-dashed border-default p-3">
                  <p class="text-sm font-medium text-highlighted">{{ props.t.vazioTitulo }}</p>
                  <p class="mt-1 text-xs leading-relaxed text-muted">{{ props.t.vazioDescricao }}</p>
                  <UButton
                    :label="props.t.vazioAcao"
                    icon="i-lucide-plus"
                    size="xs"
                    color="primary"
                    variant="soft"
                    class="mt-2"
                    @click="emit('criar')"
                  />
                </div>
              </template>

              <template v-else>
                <LinhaDeMenu
                  v-for="(c, i) in categoriasVisiveis"
                  :key="c.id"
                  :icone="c.icon ?? 'i-lucide-folder'"
                  :rotulo="c.name"
                  :nivel="2"
                  com-estrela
                  :fixada="c.favorita"
                  :rotulo-fixar="props.t.fixar"
                  :rotulo-desafixar="props.t.desafixar"
                  :ativo="props.categoriaAtivaId === c.id"
                  :atraso="180 + i * 25"
                  :arrastavel="!filtrando"
                  :saindo="arraste.arrastando.value === `cat:${c.id}`"
                  :marca="marcaDe(`cat:${c.id}`) === 'dentro' ? null : marcaDe(`cat:${c.id}`)"
                  @selecionar="emit('categoria', c)"
                  @alternar-estrela="emit('alternarFixar', c.id)"
                  @arrastar-inicio="arrastarCategoria(c.id)"
                  @arrastar-sobre="p => arraste.mirar(`cat:${c.id}`, p)"
                  @soltar="p => largarCategoria(c.id, p)"
                  @arrastar-fim="arraste.terminar()"
                />

                <button
                  v-if="!filtrando"
                  type="button"
                  class="mt-0.5 flex w-full items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-sm font-medium text-highlighted transition-colors hover:bg-primary/10"
                  @click="emit('verTodas')"
                >
                  <UIcon name="i-lucide-layout-grid" class="size-4 shrink-0 text-primary" />
                  <span class="min-w-0 flex-1 truncate text-left">
                    {{ props.t.verTodas(props.totalDeCategorias) }}
                  </span>
                </button>
              </template>
            </SecaoDeMenu>
          </template>

          <!--
            ---------- seção com uma tela só ----------
            Vira linha simples, com o nome da seção, e clicar abre a tela. Uma
            seta para revelar um item único é um clique cobrado sem nada em
            troca. O editor continua tratando a seção como seção: é lá que se
            põe a segunda tela dentro dela.
          -->
          <LinhaDeMenu
            v-else-if="temUmaSo(no)"
            class="mt-0.5"
            :icone="no.icone"
            :rotulo="rotuloDe(no)"
            :selo="seloDaSecao(no)"
            :ativo="props.destinoAtivo === unicoFilho(no).id"
            :arrastavel="podeArrastarMenu"
            :saindo="arraste.arrastando.value === no.id"
            :marca="marcaDe(no.id) === 'dentro' ? null : marcaDe(no.id)"
            :recusando="recusandoAgora"
            @selecionar="emit('destino', unicoFilho(no).id)"
            @arrastar-inicio="arraste.comecar(no.id)"
            @arrastar-sobre="p => mirar(no.id, p)"
            @soltar="p => largar(no.id, p)"
            @arrastar-fim="arraste.terminar()"
            @mover="p => menu.mover(no.id, p)"
          />

          <!-- ---------- seção: nativa, de módulo ou do workspace ---------- -->
          <SecaoDeMenu
            v-else
            :rotulo="rotuloDe(no)"
            :selo="seloDaSecao(no)"
            :aberta="filtrando || aberta(no.id)"
            :texto-recolher="props.t.recolherSecao(rotuloDe(no))"
            :texto-expandir="props.t.expandirSecao(rotuloDe(no))"
            :arrastavel="podeArrastarMenu"
            :saindo="arraste.arrastando.value === no.id"
            :marca="marcaDe(no.id)"
            :recusando="recusandoAgora"
            @alternar="abrirSecao(no)"
            @arrastar-inicio="arraste.comecar(no.id)"
            @arrastar-sobre="p => mirar(no.id, p)"
            @soltar="p => largar(no.id, p)"
            @arrastar-fim="arraste.terminar()"
            @mover="p => menu.mover(no.id, p)"
          >
            <LinhaDeMenu
              v-for="(item, i) in (no.filhos ?? [])"
              :key="item.id"
              :icone="item.icone"
              :rotulo="rotuloDe(item)"
              :nivel="2"
              :selo="seloDaSecao(no) ? undefined : (item.emBreve ? props.t.emBreve : undefined)"
              :ativo="props.destinoAtivo === item.id"
              :atraso="i * 25"
              :arrastavel="podeArrastarMenu"
              :saindo="arraste.arrastando.value === item.id"
              :marca="marcaDe(item.id) === 'dentro' ? null : marcaDe(item.id)"
              :recusando="recusandoAgora"
              @selecionar="emit('destino', item.id)"
              @arrastar-inicio="arraste.comecar(item.id)"
              @arrastar-sobre="p => mirar(item.id, p)"
              @soltar="p => largar(item.id, p)"
              @arrastar-fim="arraste.terminar()"
              @mover="p => menu.mover(item.id, p)"
            />
          </SecaoDeMenu>
        </template>

        <!--
          ============ A PORTA DO EDITOR (rodada 11) ============

          "nao ta claro pro user ainda onde ele vai pra EDITAR os menus" (Mikaela).

          Estava certo: o editor só aparecia por dentro de
          `Configurações > Interface > Menus`, ou por acidente, no "+" quando a
          pessoa ia CRIAR alguma coisa. Editar o que já existe não tinha porta.

          Agora tem uma linha no fim da própria lista, que é onde o ClickUp, o
          monday e o Slack põem o "customizar barra". Ela some para quem não pode
          configurar, porque o menu é do workspace inteiro.

          E a dica dela diz a outra metade: dá para arrastar aqui mesmo, sem
          abrir nada.
        -->
        <UTooltip
          v-if="props.podeConfigurar && !filtrando"
          :text="props.t.editarMenuDica"
          :content="{ side: 'right' }"
        >
          <button
            type="button"
            class="mt-2 flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-elevated hover:text-default"
            @click="emit('editar')"
          >
            <UIcon name="i-lucide-list-tree" class="size-4 shrink-0" />
            <span class="min-w-0 flex-1 truncate text-left">{{ props.t.editarMenu }}</span>
          </button>
        </UTooltip>
      </template>
    </nav>

    <!-- ============ a barra de salvar, só quando há o que salvar ============ -->
    <div
      v-if="menu.alterado.value"
      class="shrink-0 animate-[entrada_0.2s_ease-out_both] border-t border-default bg-primary/5 p-2"
    >
      <p class="mb-1.5 flex items-center gap-1.5 px-1 text-xs font-medium text-highlighted">
        <UIcon name="i-lucide-grip-vertical" class="size-3.5 shrink-0 text-primary" />
        {{ props.t.menuAlterado }}
      </p>
      <div class="flex gap-1.5">
        <UButton :label="props.t.salvar" size="xs" color="primary" class="flex-1 justify-center" @click="salvarMenu" />
        <UButton :label="props.t.descartar" size="xs" color="neutral" variant="subtle" @click="menu.descartar()" />
      </div>
    </div>

    <!--
      ============ rodapé ============
      RODADA 9. Uma linha só: Configurações ocupa a linha e a Ajuda virou ícone
      na ponta, com o menu abrindo no hover. Pedido dela, e o rodapé desceu de
      duas linhas para uma: é o trecho da barra que não rola, e cada linha
      gasta ali é uma linha a menos para a navegação.
    -->
    <div class="shrink-0 border-t border-default p-2">
      <div class="flex items-center gap-1">
        <UTooltip :text="props.podeConfigurar ? props.t.configuracoesDica : props.t.semPermissaoTitulo" class="min-w-0 flex-1">
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors"
            :class="props.podeConfigurar
              ? 'text-default hover:bg-elevated'
              : 'cursor-not-allowed text-muted'"
            :disabled="!props.podeConfigurar"
            @click="emit('configuracoes')"
          >
            <UIcon name="i-lucide-settings" class="size-4 shrink-0 text-toned" />
            <span class="min-w-0 flex-1 truncate text-left">{{ props.t.configuracoes }}</span>
            <UIcon
              :name="props.podeConfigurar ? 'i-lucide-chevron-right' : 'i-lucide-lock'"
              class="size-3.5 shrink-0 text-muted"
            />
          </button>
        </UTooltip>

        <MenuDeAjuda :t="props.t" @escolher="r => emit('ajuda', r)" />
      </div>
    </div>
  </div>
</template>
