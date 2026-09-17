<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import SecaoDeMenu from './_SecaoDeMenu.vue'
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
  ajuda: []
}>()

const menu = useMenuDoWorkspace()
const arraste = useArraste()
const toast = useToast()

/** Rótulo de um nó: nativo vem do dicionário, do workspace vem do próprio nó. */
function rotuloDe(no: NoDoMenu) {
  if (no.rotulo) return no.rotulo
  const mapa: Record<string, string> = {
    inicio: props.t.inicio,
    tarefas: props.t.tarefas,
    agenda: props.t.agenda,
    spaceflows: props.t.spaceflows,
    documentos: props.t.documentos,
    categorias: props.t.categorias,
  }
  return mapa[no.chave ?? ''] ?? (no.chave ?? '')
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

function casa(texto: string) {
  return texto.toLowerCase().includes(filtro.value.trim().toLowerCase())
}

const destinosVisiveis = computed(() =>
  filtrando.value ? menu.destinos.value.filter(d => casa(rotuloDe(d))) : menu.destinos.value,
)
const favoritasVisiveis = computed(() => filtrando.value ? props.favoritas.filter(c => casa(c.name)) : props.favoritas)
const categoriasVisiveis = computed(() => {
  if (!filtrando.value) return props.recorte
  return props.todas.filter(c => !c.favorita && casa(c.name))
})
const secoesVisiveis = computed(() => {
  if (!filtrando.value) return menu.secoes.value
  return menu.secoes.value
    .map(s => ({ ...s, filhos: (s.filhos ?? []).filter(f => casa(rotuloDe(f))) }))
    .filter(s => (s.filhos?.length ?? 0) > 0 || casa(rotuloDe(s)))
})

const nadaNoFiltro = computed(() =>
  filtrando.value
  && !destinosVisiveis.value.length
  && !favoritasVisiveis.value.length
  && !categoriasVisiveis.value.length
  && !secoesVisiveis.value.length,
)
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

        <!-- destinos nativos, arrastáveis entre si -->
        <div v-if="destinosVisiveis.length" class="space-y-0.5">
          <LinhaDeMenu
            v-for="(d, i) in destinosVisiveis"
            :key="d.id"
            :icone="d.icone"
            :rotulo="rotuloDe(d)"
            :contador="d.chave === 'tarefas' ? 3 : undefined"
            :selo="d.emBreve ? props.t.emBreve : undefined"
            :ativo="props.destinoAtivo === d.id"
            :atraso="i * 25"
            :arrastavel="!filtrando"
            :saindo="arraste.arrastando.value === d.id"
            :marca="marcaDe(d.id) === 'dentro' ? null : marcaDe(d.id)"
            :recusando="recusandoAgora"
            @selecionar="emit('destino', d.id)"
            @arrastar-inicio="arraste.comecar(d.id)"
            @arrastar-sobre="p => mirar(d.id, p)"
            @soltar="p => largar(d.id, p)"
            @arrastar-fim="arraste.terminar()"
            @mover="p => menu.mover(d.id, p)"
          />
        </div>

        <!-- Favoritos: pessoal, nasce do uso, não entra no arraste do menu -->
        <SecaoDeMenu
          v-if="favoritasVisiveis.length"
          :rotulo="props.t.favoritos"
          :aberta="filtrando || aberta('favoritos')"
          :texto-recolher="props.t.recolherSecao(props.t.favoritos)"
          :texto-expandir="props.t.expandirSecao(props.t.favoritos)"
          @alternar="alternar('favoritos')"
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
          @alternar="alternar('categorias')"
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

            <!--
              A dica de arrastar saiu da lista na rodada 7: ela ocupava duas
              linhas permanentes para ensinar uma coisa que se aprende uma vez.
              Quem arrasta com criterio automatico ligado recebe o aviso no
              toast, no momento em que importa.
            -->

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

        <!-- As seções do workspace, vindas da MESMA árvore que o editor edita. -->
        <SecaoDeMenu
          v-for="s in secoesVisiveis"
          :key="s.id"
          :rotulo="rotuloDe(s)"
          :aberta="filtrando || aberta(s.id)"
          :texto-recolher="props.t.recolherSecao(rotuloDe(s))"
          :texto-expandir="props.t.expandirSecao(rotuloDe(s))"
          :arrastavel="!filtrando"
          :saindo="arraste.arrastando.value === s.id"
          :marca="marcaDe(s.id)"
          :recusando="recusandoAgora"
          @alternar="alternar(s.id)"
          @arrastar-inicio="arraste.comecar(s.id)"
          @arrastar-sobre="p => mirar(s.id, p)"
          @soltar="p => largar(s.id, p)"
          @arrastar-fim="arraste.terminar()"
          @mover="p => menu.mover(s.id, p)"
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
            :arrastavel="!filtrando"
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

    <!-- ============ rodapé: configurações e ajuda ============ -->
    <div class="shrink-0 border-t border-default p-2">
      <div class="space-y-0.5">
        <UTooltip :text="props.podeConfigurar ? props.t.configuracoesDica : props.t.semPermissaoTitulo">
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

        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-default transition-colors hover:bg-elevated"
          @click="emit('ajuda')"
        >
          <UIcon name="i-lucide-circle-question-mark" class="size-4 shrink-0 text-toned" />
          <span class="min-w-0 flex-1 truncate text-left">{{ props.t.ajuda }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
