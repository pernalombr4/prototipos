<script setup lang="ts">
import PreviaDoCaso from './_PreviaDoCaso.vue'
import { AREAS, ICONE_DO_TIPO, TIPOS_EXTRAS, localidades, type CasoDeUso, type Complexidade, type Localidade, type TipoExtra } from './mocks'
import type { Textos } from './textos'

/**
 * A GALERIA DE CASOS DE USO: a "lojinha" dos protótipos `menu-lateral`
 * (rodada 18) e `tela-de-workspaces` (rodada 24), padrão da Central de
 * modelos do ClickUp, dentro de Configurações > Interface > Casos de Uso.
 *
 * Ela substitui o bloco "General" do develop (cartões com nome, descrição e
 * "Saiba Mais") e fica onde ele fica: abaixo da Migração de Workspace e do
 * aviso de Atenção, que não mudam.
 *
 * LISTA
 *   à esquerda, de onde vem (Destaques, Todos do ENSPACE) e os filtros de
 *   Localidade e Complexidade, em caixas de marcar; a localidade começa
 *   marcada pelo idioma de quem abre, como o produto faz hoje;
 *   em cima, a busca e "Áreas", com busca própria e várias marcadas;
 *   os cartões com a prévia desenhada, agrupados por área, "Ver mais" depois de 3.
 *
 * DETALHE (era a janela do "Saiba Mais")
 *   abre no lugar da lista, na mesma página, com caminho de volta;
 *   galeria que passa e amplia, descrição, "O que vem junto" item a item e,
 *   à direita, quem fez, quando, quantas vezes foi usado e a localidade.
 *   "Usar caso de uso" é o "Migrar Caso de Uso" de hoje.
 */
const props = defineProps<{
  t: Textos
  casos: CasoDeUso[]
  estado: 'pronto' | 'carregando' | 'erro'
  podeUsar: boolean
  /** Rodada 5: o cabeçalho e a moldura no mesmo molde do cartão "Migração de Workspace". */
  secaoIgual?: boolean
  /** Rodada 6 (mudança total): a galeria é a página. Sem moldura e sem cabeçalho próprio; o título da página faz o papel. */
  solta?: boolean
}>()
const emit = defineEmits<{ usar: [caso: CasoDeUso], tentarDeNovo: [], criar: [] }>()

const idioma = useIdioma()
const raiz = useTemplateRef<HTMLElement>('raiz')

/**
 * As 3 vistas (rodada 3, pedido da Mikaela): "Deste workspace" fica entre
 * Destaques e Todos do ENSPACE, como no protótipo menu-lateral. Lá moram os
 * casos criados aqui, publicados ou não, e a porta para criar.
 */
type Fonte = 'destaques' | 'workspace' | 'enspace'
const fonte = defineModel<Fonte>('fonte', { default: 'destaques' })
const busca = ref('')
/** A localidade começa pelo idioma de quem abre (o develop faz isso: pt-BR é Brasil). */
const localDoIdioma: Record<string, Localidade['id']> = { 'pt-BR': 'pt-br', 'en': 'en-us', 'es': 'global' }
const locais = ref<Localidade['id'][]>([localDoIdioma[idioma.value] ?? 'pt-br'])
const complexidades = ref<Complexidade[]>([])
const areas = ref<string[]>([])
const expandidas = ref<string[]>([])
const aberto = ref<CasoDeUso | null>(null)

function normaliza(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function alternar<T>(lista: T[], v: T) {
  return lista.includes(v) ? lista.filter(x => x !== v) : [...lista, v]
}

const filtrando = computed(() => !!busca.value.trim() || complexidades.value.length > 0 || areas.value.length > 0)

/** A galeria do ENSPACE: os casos do ENSPACE e os publicados pelos workspaces. */
const daGaleria = computed(() => props.casos.filter(c => c.origem === 'enspace' || c.publicado))
const desteWorkspace = computed(() => props.casos.filter(c => c.origem === 'workspace'))
const daFonte = computed(() => (fonte.value === 'workspace' ? desteWorkspace.value : daGaleria.value))

/** Sem localidade marcada, valem todas. */
const filtrados = computed(() => daFonte.value.filter((c) => {
  const termo = normaliza(busca.value.trim())
  if (termo && !normaliza(`${c.nome} ${c.descricao} ${c.area}`).includes(termo)) return false
  if (locais.value.length && !c.localidades.some(l => locais.value.includes(l))) return false
  if (complexidades.value.length && !complexidades.value.includes(c.complexidade)) return false
  if (areas.value.length && !areas.value.includes(c.area)) return false
  return true
}))

/** "Em destaque" só em Destaques e sem filtro, como no ClickUp. */
const emDestaque = computed(() => fonte.value === 'destaques' && !filtrando.value ? filtrados.value.filter(c => c.destaque) : [])

const porArea = computed(() => {
  const grupos = new Map<string, CasoDeUso[]>()
  for (const c of filtrados.value) grupos.set(c.area, [...(grupos.get(c.area) ?? []), c])
  return [...grupos.entries()].map(([area, casos]) => ({ area, casos }))
})

const contagem = computed(() => ({
  destaques: daGaleria.value.filter(c => c.destaque).length,
  workspace: desteWorkspace.value.length,
  enspace: daGaleria.value.length,
}))

const vistas = computed(() => [
  { id: 'destaques' as const, rotulo: props.t.destaques, icone: 'i-lucide-star' },
  { id: 'workspace' as const, rotulo: props.t.doWorkspace, icone: 'i-lucide-building-2' },
  { id: 'enspace' as const, rotulo: props.t.todos, icone: 'i-lucide-badge-check' },
])

function limpar() {
  busca.value = ''
  locais.value = []
  complexidades.value = []
  areas.value = []
}

const corDaComplexidade: Record<Complexidade, 'success' | 'warning' | 'error'> = { iniciante: 'success', intermediario: 'warning', avancado: 'error' }

/* ------------------------------ o detalhe ------------------------------ */

function abrir(c: CasoDeUso | null) {
  aberto.value = c
  // O detalhe abre no lugar da lista: o topo da galeria volta para a vista.
  nextTick(() => raiz.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

/** Com imagens enviadas, a galeria mostra as imagens; sem elas, a prévia desenhada. */
function totalDeQuadros(c: CasoDeUso) {
  return c.imagens?.length || quadrosDe(c).length
}

function quadrosDe(c: CasoDeUso) {
  const q: ('menu' | 'quadro' | 'ficha' | 'painel')[] = ['menu']
  if (c.status.length) q.push('quadro')
  if (c.categorias.length) q.push('ficha')
  if (c.menus.some(m => m.telas.some(x => x.tipoDeTela === 'paineis'))) q.push('painel')
  return q
}
const quadroAtual = ref(0)
const ampliado = ref(false)
const incluiAberto = ref<string[]>([])
watch(aberto, () => {
  quadroAtual.value = 0
  incluiAberto.value = []
})

function passar(passo: number) {
  if (!aberto.value) return
  const total = totalDeQuadros(aberto.value)
  quadroAtual.value = (quadroAtual.value + passo + total) % total
}

function totalDeTelas(c: CasoDeUso) {
  return c.menus.reduce((n, m) => n + m.telas.length, 0)
}
function totalDeCampos(c: CasoDeUso) {
  return c.categorias.reduce((n, x) => n + x.campos.length, 0)
}

/** Rodada 4: o resumo de cada tipo de entidade, com o plural do dicionário. */
function nDoTipo(tp: TipoExtra, n: number) {
  const x = props.t.tipos[tp]
  return `${n} ${n === 1 ? x.um : x.varios}`
}

function data(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(idioma.value, { day: 'numeric', month: 'long', year: 'numeric' })
}

/** O cenário muda (cheio, como hoje): a galeria volta para a lista. */
watch(() => props.casos, () => { aberto.value = null })
</script>

<template>
  <section ref="raiz" class="scroll-mt-4 overflow-clip bg-default" :class="props.solta ? 'border-t border-default' : ['border border-default', props.secaoIgual ? 'rounded-lg' : 'rounded-xl']" :aria-label="props.t.galeriaTitulo">
    <!-- ==================== cabeçalho da galeria ==================== -->
    <!-- Na largura unificada, o mesmo molde do cabeçalho da Migração de Workspace (cópia do develop). -->
    <header v-if="!aberto && !props.solta" class="flex flex-wrap items-center gap-3 border-b border-default" :class="props.secaoIgual ? 'px-4 py-3 sm:px-6' : 'px-5 py-4'">
      <span class="flex size-9 shrink-0 items-center justify-center" :class="props.secaoIgual ? 'rounded-md bg-elevated text-toned' : 'rounded-lg bg-primary/10 text-primary'">
        <UIcon name="i-lucide-package" class="size-5" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 class="text-highlighted" :class="props.secaoIgual ? 'text-sm font-medium' : 'text-base font-semibold'">{{ props.t.galeriaTitulo }}</h2>
        <p class="text-sm text-muted">{{ props.t.galeriaDescricao }}</p>
      </div>
    </header>

    <!-- ==================== carregando ==================== -->
    <div v-if="props.estado === 'carregando'" class="flex">
      <div class="hidden w-56 shrink-0 space-y-3 border-r border-default p-4 md:block">
        <USkeleton v-for="n in 6" :key="n" class="h-6 w-full" />
      </div>
      <div class="grid flex-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="overflow-hidden rounded-xl border border-default">
          <USkeleton class="h-32 rounded-none" />
          <div class="flex items-center gap-2 px-3 py-3">
            <USkeleton class="size-4 rounded" />
            <USkeleton class="h-4 flex-1" />
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== erro ==================== -->
    <div v-else-if="props.estado === 'erro'" class="px-5 py-14 text-center">
      <UIcon name="i-lucide-cloud-off" class="mx-auto size-7 text-dimmed" />
      <p class="mt-2 text-sm font-medium text-highlighted">{{ props.t.erroTitulo }}</p>
      <p class="mt-1 text-sm text-muted">{{ props.t.erroAjuda }}</p>
      <UButton :label="props.t.tentarDeNovo" icon="i-lucide-rotate-cw" size="sm" color="neutral" variant="outline" class="mt-4" @click="emit('tentarDeNovo')" />
    </div>

    <!-- ==================== a lista ==================== -->
    <div v-else-if="!aberto" class="flex">
      <!-- lateral: fonte e filtros. Gruda no topo enquanto a lista rola. -->
      <aside class="sticky top-0 hidden w-56 shrink-0 self-start border-r border-default md:block">
        <nav class="space-y-0.5 px-2 pt-3" :aria-label="props.t.galeriaTitulo">
          <button
            v-for="f in vistas"
            :key="f.id"
            type="button"
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            :class="fonte === f.id ? 'bg-primary/10 font-semibold text-highlighted' : 'text-default hover:bg-elevated'"
            :aria-current="fonte === f.id ? 'page' : undefined"
            @click="fonte = f.id"
          >
            <UIcon :name="f.icone" class="size-4 shrink-0" :class="fonte === f.id ? 'text-primary' : 'text-toned'" />
            <span class="min-w-0 flex-1 truncate text-left">{{ f.rotulo }}</span>
            <span class="text-xs text-muted">{{ contagem[f.id] }}</span>
          </button>
        </nav>

        <USeparator class="my-3" />

        <div class="space-y-4 px-4 pb-4">
          <fieldset>
            <legend class="mb-2 text-xs font-semibold text-toned">{{ props.t.localidade }}</legend>
            <div class="space-y-2">
              <UCheckbox
                v-for="l in localidades"
                :key="l"
                :label="props.t.localidades[l]"
                :model-value="locais.includes(l)"
                @update:model-value="locais = alternar(locais, l)"
              />
            </div>
          </fieldset>
          <fieldset>
            <legend class="mb-2 text-xs font-semibold text-toned">{{ props.t.complexidade }}</legend>
            <div class="space-y-2">
              <UCheckbox
                v-for="cx in (['iniciante', 'intermediario', 'avancado'] as const)"
                :key="cx"
                :label="props.t.complexidades[cx]"
                :model-value="complexidades.includes(cx)"
                @update:model-value="complexidades = alternar(complexidades, cx)"
              />
            </div>
          </fieldset>
        </div>
      </aside>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2 border-b border-default px-5 py-3">
          <UInput v-model="busca" icon="i-lucide-search" :placeholder="props.t.buscarCasos" class="min-w-48 flex-1" :aria-label="props.t.buscarCasos">
            <template v-if="busca" #trailing>
              <UButton icon="i-lucide-x" size="xs" color="neutral" variant="link" :aria-label="props.t.limparBusca" @click="busca = ''" />
            </template>
          </UInput>

          <!--
            Áreas: o USelectMenu múltiplo (busca embutida, marca de seleção em
            cada linha). "Selecionar tudo" e "Limpar" ficam como links no pé da
            lista, com a contagem, e não como botão solto no meio dela.
          -->
          <USelectMenu
            v-model="areas"
            :items="[...AREAS]"
            multiple
            :search-input="{ placeholder: props.t.buscarAreas, icon: 'i-lucide-search' }"
            color="neutral"
            variant="outline"
            icon="i-lucide-layers"
            :content="{ align: 'end', sideOffset: 6 }"
            :ui="{ content: 'min-w-60' }"
            class="w-auto"
            :aria-label="props.t.areasRotulo"
          >
            <span class="flex items-center gap-1.5">
              {{ props.t.areasRotulo }}
              <UBadge v-if="areas.length" :label="String(areas.length)" size="sm" color="primary" variant="subtle" />
            </span>
            <template #content-bottom>
              <div class="flex items-center gap-1 border-t border-default px-2 py-1.5">
                <UButton
                  :label="props.t.selecionarTudo"
                  size="xs"
                  color="primary"
                  variant="link"
                  :disabled="areas.length === AREAS.length"
                  @click="areas = [...AREAS]"
                />
                <span class="text-dimmed" aria-hidden="true">·</span>
                <UButton
                  :label="props.t.limparSelecao"
                  size="xs"
                  color="neutral"
                  variant="link"
                  :disabled="!areas.length"
                  @click="areas = []"
                />
                <span class="ml-auto text-xs text-muted">{{ props.t.nDeM(areas.length, AREAS.length) }}</span>
              </div>
            </template>
          </USelectMenu>

          <!-- No celular a lateral some: os mesmos filtros num botão. -->
          <UPopover :content="{ align: 'end', sideOffset: 6 }" class="md:hidden">
            <UButton :label="props.t.filtros" icon="i-lucide-sliders-horizontal" color="neutral" variant="outline" class="md:hidden" />
            <template #content>
              <div class="w-64 space-y-4 p-3">
                <URadioGroup v-model="fonte" :items="vistas.map(v => ({ value: v.id, label: v.rotulo }))" />
                <fieldset>
                  <legend class="mb-2 text-xs font-semibold text-toned">{{ props.t.localidade }}</legend>
                  <div class="space-y-2">
                    <UCheckbox v-for="l in localidades" :key="l" :label="props.t.localidades[l]" :model-value="locais.includes(l)" @update:model-value="locais = alternar(locais, l)" />
                  </div>
                </fieldset>
                <fieldset>
                  <legend class="mb-2 text-xs font-semibold text-toned">{{ props.t.complexidade }}</legend>
                  <div class="space-y-2">
                    <UCheckbox v-for="cx in (['iniciante', 'intermediario', 'avancado'] as const)" :key="cx" :label="props.t.complexidades[cx]" :model-value="complexidades.includes(cx)" @update:model-value="complexidades = alternar(complexidades, cx)" />
                  </div>
                </fieldset>
              </div>
            </template>
          </UPopover>

          <span class="shrink-0 text-xs text-muted" aria-live="polite">{{ props.t.resultados(filtrados.length) }}</span>
        </div>

        <div class="px-5 py-5">
          <!-- Deste workspace: a porta para criar (rodada 3). -->
          <div v-if="fonte === 'workspace' && desteWorkspace.length" class="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <UIcon name="i-lucide-package-plus" class="size-5 shrink-0 text-primary" />
            <div class="min-w-48 flex-1">
              <p class="text-sm font-semibold text-highlighted">{{ props.t.faixaCriarTitulo }}</p>
              <p class="text-sm text-muted">{{ props.t.faixaCriarTexto }}</p>
              <p v-if="!props.podeUsar" class="mt-1 flex items-center gap-1.5 text-xs text-muted">
                <UIcon name="i-lucide-lock" class="size-3.5 shrink-0" />{{ props.t.semPermissaoCriar }}
              </p>
            </div>
            <UButton :label="props.t.criarCaso" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" :disabled="!props.podeUsar" @click="emit('criar')" />
          </div>

          <div v-if="fonte === 'workspace' && !desteWorkspace.length" class="mx-auto max-w-md py-12 text-center">
            <span class="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <UIcon name="i-lucide-package-plus" class="size-6 text-primary" />
            </span>
            <p class="mt-3 text-sm font-semibold text-highlighted">{{ props.t.nadaNoWorkspaceTitulo }}</p>
            <p class="mt-1 text-sm text-muted">{{ props.t.nadaNoWorkspaceAjuda }}</p>
            <UButton :label="props.t.criarCaso" icon="i-lucide-plus" color="primary" class="mt-4" :disabled="!props.podeUsar" @click="emit('criar')" />
            <p v-if="!props.podeUsar" class="mt-2 text-xs text-muted">{{ props.t.semPermissaoCriar }}</p>
          </div>

          <!-- Em destaque -->
          <template v-if="emDestaque.length">
            <h3 class="mb-3 text-base font-semibold text-highlighted">{{ props.t.emDestaque }}</h3>
            <div class="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <button
                v-for="(c, i) in emDestaque"
                :key="c.id"
                type="button"
                class="overflow-hidden rounded-xl border border-default bg-default text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-accented hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
                :style="{ animation: `entrada 0.25s ease-out ${i * 30}ms both` }"
                :aria-label="props.t.abrirCaso(c.nome)"
                @click="abrir(c)"
              >
                <div class="h-32 bg-elevated/60 p-2.5">
                  <img v-if="c.imagens?.length" :src="c.imagens[0]!.url" alt="" class="size-full rounded-md object-cover">
                  <PreviaDoCaso v-else :caso="c" quadro="menu" />
                </div>
                <div class="flex items-center gap-2 border-t border-default px-3 py-2.5">
                  <UIcon :name="c.icone" class="size-4 shrink-0 text-primary" />
                  <span class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted">{{ c.nome }}</span>
                  <UIcon name="i-lucide-star" class="size-3.5 shrink-0 fill-current text-warning-600 dark:text-warning-400" />
                </div>
              </button>
            </div>
          </template>

          <!-- Nada sobrou depois do filtro -->
          <div v-if="!filtrados.length && !(fonte === 'workspace' && !desteWorkspace.length)" class="py-10 text-center">
            <UIcon name="i-lucide-search-x" class="mx-auto size-6 text-dimmed" />
            <p class="mt-2 text-sm font-medium text-highlighted">{{ props.t.nenhumCaso }}</p>
            <p class="mt-1 text-sm text-muted">{{ props.t.nenhumCasoAjuda }}</p>
            <UButton :label="props.t.limparFiltros" size="sm" color="neutral" variant="outline" class="mt-3" @click="limpar" />
          </div>

          <!-- Por área -->
          <section v-for="g in porArea" :key="g.area" class="mb-8 last:mb-0">
            <div class="mb-3 flex items-baseline justify-between gap-3">
              <h3 class="text-base font-semibold text-highlighted">
                {{ g.area }}
                <span class="ml-1 text-sm font-normal text-muted">{{ g.casos.length }}</span>
              </h3>
              <UButton
                v-if="g.casos.length > 3"
                :label="expandidas.includes(g.area) ? props.t.verMenos : props.t.verMaisN(g.casos.length - 3)"
                size="xs"
                color="neutral"
                variant="outline"
                @click="expandidas = alternar(expandidas, g.area)"
              />
            </div>
            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <button
                v-for="(c, i) in (expandidas.includes(g.area) ? g.casos : g.casos.slice(0, 3))"
                :key="c.id"
                type="button"
                class="overflow-hidden rounded-xl border border-default bg-default text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-accented hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
                :style="{ animation: `entrada 0.25s ease-out ${i * 30}ms both` }"
                :aria-label="props.t.abrirCaso(c.nome)"
                @click="abrir(c)"
              >
                <div class="h-32 bg-elevated/60 p-2.5">
                  <img v-if="c.imagens?.length" :src="c.imagens[0]!.url" alt="" class="size-full rounded-md object-cover">
                  <PreviaDoCaso v-else :caso="c" quadro="menu" />
                </div>
                <div class="flex items-center gap-2 border-t border-default px-3 py-2.5">
                  <UIcon :name="c.icone" class="size-4 shrink-0 text-primary" />
                  <span class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted" :title="c.nome">{{ c.nome }}</span>
                  <UTooltip v-if="c.origem === 'workspace'" :text="c.publicado ? props.t.publicadoNaGaleria : props.t.soNoWorkspace">
                    <UIcon :name="c.publicado ? 'i-lucide-globe' : 'i-lucide-building-2'" class="size-4 shrink-0 text-muted" :aria-label="c.publicado ? props.t.publicadoNaGaleria : props.t.soNoWorkspace" />
                  </UTooltip>
                  <UBadge :label="props.t.complexidades[c.complexidade]" size="sm" :color="corDaComplexidade[c.complexidade]" variant="subtle" class="shrink-0" />
                </div>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>

    <!-- ==================== o detalhe (era o "Saiba Mais") ==================== -->
    <div v-else class="animate-[entrada_0.2s_ease-out_both]">
      <div class="flex items-center border-b border-default px-3 py-2.5">
        <UButton :label="props.t.voltarParaGaleria" icon="i-lucide-arrow-left" color="neutral" variant="ghost" @click="abrir(null)" />
      </div>

      <div class="flex">
        <div class="min-w-0 flex-1 px-6 py-6">
          <!-- cabeçalho do caso -->
          <div class="mb-6 flex flex-wrap items-start gap-4">
            <span class="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/5">
              <UIcon :name="aberto.icone" class="size-8 text-primary" />
            </span>
            <div class="min-w-0 flex-1">
              <h3 class="text-xl font-semibold text-highlighted">{{ aberto.nome }}</h3>
              <p class="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted">
                {{ props.t.complexidade }}:
                <UBadge :label="props.t.complexidades[aberto.complexidade]" size="sm" :color="corDaComplexidade[aberto.complexidade]" variant="subtle" />
                <span class="mx-1">·</span>{{ aberto.area }}
              </p>
              <p v-if="!props.podeUsar" id="motivo-sem-permissao" class="mt-2 flex items-start gap-1.5 text-xs text-muted">
                <UIcon name="i-lucide-lock" class="mt-0.5 size-3.5 shrink-0" />
                {{ props.t.semPermissao }}
              </p>
            </div>
            <UButton
              :label="props.t.usarCaso"
              icon="i-lucide-check"
              color="primary"
              size="lg"
              :disabled="!props.podeUsar"
              :aria-describedby="props.podeUsar ? undefined : 'motivo-sem-permissao'"
              @click="emit('usar', aberto)"
            />
          </div>

          <!-- galeria e descrição -->
          <!-- Sem descrição, a galeria de imagens ocupa a largura toda: nada de bloco vazio. -->
          <div class="mb-6 grid overflow-hidden rounded-xl border border-default" :class="aberto.descricao ? 'md:grid-cols-2' : ''">
            <div class="flex flex-col p-4" :class="aberto.descricao ? 'border-b border-default md:border-b-0 md:border-r' : ''">
              <button
                type="button"
                class="group/img relative h-48 w-full cursor-zoom-in rounded-md focus-visible:outline-2 focus-visible:outline-primary"
                :aria-label="`${props.t.ampliar}. ${props.t.imagemDe(quadroAtual + 1, totalDeQuadros(aberto))}`"
                @click="ampliado = true"
              >
                <img v-if="aberto.imagens?.length" :key="quadroAtual" :src="aberto.imagens[quadroAtual]!.url" alt="" class="size-full animate-[entrada_0.2s_ease-out_both] rounded-md object-contain">
                <PreviaDoCaso v-else :key="quadroAtual" :caso="aberto" :quadro="quadrosDe(aberto)[quadroAtual]!" grande class="animate-[entrada_0.2s_ease-out_both]" />
                <span class="absolute right-2 top-2 rounded-md bg-default/90 p-1 opacity-0 shadow transition-opacity group-hover/img:opacity-100">
                  <UIcon name="i-lucide-maximize-2" class="size-4 text-highlighted" />
                </span>
              </button>
              <div class="mt-3 flex items-center justify-between">
                <UButton icon="i-lucide-chevron-left" size="xs" color="neutral" variant="ghost" :aria-label="props.t.anterior" @click="passar(-1)" />
                <div class="flex gap-1.5">
                  <button
                    v-for="i in [...Array(totalDeQuadros(aberto)).keys()]"
                    :key="i"
                    type="button"
                    class="size-2 rounded-full transition-colors"
                    :class="i === quadroAtual ? 'bg-inverted' : 'bg-accented'"
                    :aria-label="props.t.imagemDe(i + 1, totalDeQuadros(aberto))"
                    :aria-current="i === quadroAtual ? 'true' : undefined"
                    @click="quadroAtual = i"
                  />
                </div>
                <UButton icon="i-lucide-chevron-right" size="xs" color="neutral" variant="ghost" :aria-label="props.t.proxima" @click="passar(1)" />
              </div>
            </div>
            <div v-if="aberto.descricao" class="p-5">
              <p class="mb-2 text-sm font-semibold text-highlighted">{{ props.t.descricaoDoCaso }}</p>
              <p class="text-sm leading-relaxed text-muted">{{ aberto.descricao }}</p>
            </div>
          </div>

          <!-- o que vem junto -->
          <p class="mb-2 text-sm font-semibold text-highlighted">{{ props.t.oQueVemJunto }}</p>
          <div class="space-y-2">
            <div
              v-for="bloco in [
                { id: 'categorias', icone: 'i-lucide-database', titulo: props.t.incluiCategorias, resumo: props.t.nCategoriasCampos(aberto.categorias.length, totalDeCampos(aberto)), itens: aberto.categorias.flatMap(c => [c.nome, ...c.campos]), mostrar: aberto.categorias.length > 0 },
                { id: 'menus', icone: 'i-lucide-list-tree', titulo: props.t.incluiMenus, resumo: props.t.nMenusTelas(aberto.menus.length, totalDeTelas(aberto)), itens: aberto.menus.flatMap(m => [m.rotulo, ...m.telas.map(x => x.rotulo)]), mostrar: aberto.menus.length > 0 },
                { id: 'status', icone: 'i-lucide-circle-dot', titulo: props.t.incluiStatus, resumo: props.t.nStatus(aberto.status.length), itens: aberto.status, mostrar: aberto.status.length > 0 },
                ...TIPOS_EXTRAS.filter(tp => aberto!.extras?.[tp]?.length).map(tp => ({ id: tp, icone: ICONE_DO_TIPO[tp], titulo: props.t.tipos[tp].rotulo, resumo: nDoTipo(tp, aberto!.extras![tp]!.length), itens: aberto!.extras![tp]!, mostrar: true })),
              ].filter(b => b.mostrar)"
              :key="bloco.id"
              class="overflow-hidden rounded-xl border border-default"
            >
              <button
                type="button"
                class="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-elevated/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                :aria-expanded="incluiAberto.includes(bloco.id)"
                @click="incluiAberto = alternar(incluiAberto, bloco.id)"
              >
                <span class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-default">
                  <UIcon :name="bloco.icone" class="size-4 text-highlighted" />
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium text-highlighted">{{ bloco.titulo }}</span>
                  <span class="block text-xs text-muted">{{ bloco.resumo }}</span>
                </span>
                <UIcon name="i-lucide-chevron-right" class="size-4 text-toned transition-transform duration-200" :class="incluiAberto.includes(bloco.id) ? 'rotate-90' : ''" />
              </button>
              <div v-if="incluiAberto.includes(bloco.id)" class="flex animate-[entrada_0.15s_ease-out_both] flex-wrap gap-1.5 border-t border-default px-4 py-3">
                <UBadge v-for="x in bloco.itens" :key="x" :label="x" size="sm" color="neutral" variant="subtle" />
              </div>
            </div>
          </div>
        </div>

        <!-- quem fez, quando, quantas vezes, onde vale -->
        <aside class="hidden w-60 shrink-0 space-y-5 border-l border-default px-5 py-6 lg:block">
          <div class="rounded-xl border border-default p-4 shadow-sm">
            <div class="mb-2 flex items-start justify-between">
              <span class="flex size-9 items-center justify-center rounded-lg border border-default">
                <UIcon :name="aberto.origem === 'enspace' ? 'i-lucide-badge-check' : 'i-lucide-building-2'" class="size-5 text-primary" />
              </span>
              <UBadge v-if="aberto.origem === 'enspace'" :label="props.t.verificado" size="sm" color="primary" variant="subtle" />
            </div>
            <p class="text-sm font-semibold text-highlighted">{{ aberto.origem === 'enspace' ? props.t.peloEnspace : props.t.porWorkspace(aberto.autor ?? '') }}</p>
            <p class="mt-0.5 text-xs text-muted">{{ aberto.origem === 'enspace' ? props.t.peloEnspaceDica : props.t.porWorkspaceDica }}</p>
          </div>
          <div v-if="aberto.origem === 'workspace'">
            <p class="text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.visibilidade }}</p>
            <UBadge
              :label="aberto.publicado ? props.t.publicadoNaGaleria : props.t.soNoWorkspace"
              :icon="aberto.publicado ? 'i-lucide-globe' : 'i-lucide-building-2'"
              color="neutral"
              variant="outline"
              class="mt-1"
            />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.criadoEmRotulo }}</p>
            <p class="mt-1 text-sm text-default">{{ data(aberto.criadoEm) }}</p>
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.usadoRotulo }}</p>
            <UBadge :label="props.t.vezes(aberto.usos.toLocaleString(idioma))" color="neutral" variant="outline" class="mt-1" />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.localidade }}</p>
            <div class="mt-1 flex flex-wrap gap-1">
              <UBadge v-for="l in aberto.localidades" :key="l" :label="props.t.localidades[l]" size="sm" color="neutral" variant="subtle" />
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- A imagem ampliada: passa com as setas, fecha com Esc. -->
    <UModal v-model:open="ampliado" fullscreen :ui="{ content: 'bg-inverted/95' }" :title="aberto?.nome ?? ''">
      <template #content>
        <div v-if="aberto" class="flex h-full flex-col" @keydown.left="passar(-1)" @keydown.right="passar(1)">
          <div class="flex shrink-0 items-center justify-between px-6 py-3 text-inverted">
            <p class="text-sm">{{ props.t.imagemDe(quadroAtual + 1, totalDeQuadros(aberto)) }}</p>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="text-inverted" :aria-label="props.t.fechar" @click="ampliado = false" />
          </div>
          <div class="flex min-h-0 flex-1 items-center gap-4 px-6 pb-8">
            <UButton icon="i-lucide-chevron-left" size="xl" color="neutral" variant="ghost" class="text-inverted" :aria-label="props.t.anterior" @click="passar(-1)" />
            <div class="mx-auto aspect-[16/10] h-full max-h-[75vh] min-w-0 flex-1 rounded-lg bg-default p-4">
              <img v-if="aberto.imagens?.length" :key="quadroAtual" :src="aberto.imagens[quadroAtual]!.url" alt="" class="size-full animate-[entrada_0.2s_ease-out_both] object-contain">
              <PreviaDoCaso v-else :key="quadroAtual" :caso="aberto" :quadro="quadrosDe(aberto)[quadroAtual]!" grande class="animate-[entrada_0.2s_ease-out_both]" />
            </div>
            <UButton icon="i-lucide-chevron-right" size="xl" color="neutral" variant="ghost" class="text-inverted" :aria-label="props.t.proxima" @click="passar(1)" />
          </div>
        </div>
      </template>
    </UModal>
  </section>
</template>
