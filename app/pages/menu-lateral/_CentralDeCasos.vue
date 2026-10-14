<script setup lang="ts">
import PreviaDoCaso from './_PreviaDoCaso.vue'
import { AREAS, baixarArquivo, casosDoEnspace, useCasosDoWorkspace, useJanelasDeCasos, type CasoDeUso, type Complexidade, type TipoDeCaso } from './casos'
import { workspace } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * A CENTRAL DE CASOS DE USO (rodada 18): a "Central de modelos" do ClickUp,
 * como a Mikaela mostrou, com os casos de uso do ENSPACE dentro.
 *
 * LISTA
 *   à esquerda, de onde vem (Destaques, Do seu workspace, Do ENSPACE) e os
 *   filtros de Tipo e Complexidade, em caixas de marcar;
 *   em cima, a busca e "Áreas", que abre uma lista com busca própria,
 *   "Selecionar tudo" e várias marcadas ao mesmo tempo (o "Casos de uso" de
 *   lá: aqui "caso de uso" já é o nome da coisa, então o filtro é a área);
 *   a faixa "Criar caso de uso", porque a pessoa também cria o seu;
 *   os cartões, agrupados por área, com "Ver mais" quando passam de três.
 *
 * DETALHE
 *   "Usar caso de uso" APLICA (abre a janela de somar ou substituir);
 *   o "…" ao lado do nome tem "Adicionar ao workspace", que só GUARDA uma
 *   cópia e não mexe no menu, dito na própria opção; e "Exportar arquivo";
 *   a galeria passa e amplia; "O que vem junto" abre item a item; à direita,
 *   quem fez, quando e quantas vezes foi usado.
 */
const props = defineProps<{ t: TextosDaTela }>()

const janelas = useJanelasDeCasos()
const doWorkspace = useCasosDoWorkspace()
const toast = useToast()

type Fonte = 'destaques' | 'workspace' | 'enspace'
const fonte = ref<Fonte>('destaques')
const busca = ref('')
const tipos = ref<TipoDeCaso[]>([])
const complexidades = ref<Complexidade[]>([])
const areas = ref<string[]>([])
const buscaDeArea = ref('')
const expandidas = ref<string[]>([])
const aberto = ref<CasoDeUso | null>(null)

watch(() => janelas.central.value, (v) => {
  if (v) return
  aberto.value = null
})

function normaliza(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const todos = computed(() => [...doWorkspace.value, ...casosDoEnspace])
const daFonte = computed(() => {
  if (fonte.value === 'workspace') return doWorkspace.value
  if (fonte.value === 'enspace') return casosDoEnspace
  return todos.value
})

const filtrando = computed(() => !!busca.value.trim() || tipos.value.length > 0 || complexidades.value.length > 0 || areas.value.length > 0)

const filtrados = computed(() => daFonte.value.filter((c) => {
  const termo = normaliza(busca.value.trim())
  if (termo && !normaliza(`${c.nome} ${c.descricao} ${c.area}`).includes(termo)) return false
  if (tipos.value.length && !tipos.value.includes(c.tipo)) return false
  if (complexidades.value.length && !complexidades.value.includes(c.complexidade)) return false
  if (areas.value.length && !areas.value.includes(c.area)) return false
  return true
}))

/** "Em destaque" só na porta de Destaques e sem filtro, como no ClickUp. */
const emDestaque = computed(() => fonte.value === 'destaques' && !filtrando.value ? todos.value.filter(c => c.destaque) : [])

const porArea = computed(() => {
  const grupos = new Map<string, CasoDeUso[]>()
  for (const c of filtrados.value) grupos.set(c.area, [...(grupos.get(c.area) ?? []), c])
  return [...grupos.entries()].map(([area, casos]) => ({ area, casos }))
})

const contagem = computed(() => ({
  destaques: todos.value.filter(c => c.destaque).length,
  workspace: doWorkspace.value.length,
  enspace: casosDoEnspace.length,
}))

const areasNaBusca = computed(() => AREAS.filter(a => normaliza(a).includes(normaliza(buscaDeArea.value))))

function alternar<T>(lista: T[], v: T) {
  return lista.includes(v) ? lista.filter(x => x !== v) : [...lista, v]
}

function limpar() {
  busca.value = ''
  tipos.value = []
  complexidades.value = []
  areas.value = []
}

/* ------------------------------ o detalhe ------------------------------ */

/** Os quadros da galeria: só os que o caso tem. */
function quadrosDe(c: CasoDeUso) {
  const q: ('menu' | 'quadro' | 'ficha' | 'painel')[] = ['menu']
  if (c.status.length) q.push('quadro')
  if (c.categorias.length) q.push('ficha')
  if (c.menus.some(m => m.telas.some(x => x.tipoDeTela === 'paineis'))) q.push('painel')
  return q
}
const quadroAtual = ref(0)
const ampliado = ref(false)
watch(aberto, () => { quadroAtual.value = 0 })

function passar(passo: number) {
  if (!aberto.value) return
  const total = quadrosDe(aberto.value).length
  quadroAtual.value = (quadroAtual.value + passo + total) % total
}

const incluiAberto = ref<string[]>([])
watch(aberto, () => { incluiAberto.value = [] })

function totalDeTelas(c: CasoDeUso) {
  return c.menus.reduce((n, m) => n + m.telas.length, 0)
}
function totalDeCampos(c: CasoDeUso) {
  return c.categorias.reduce((n, x) => n + x.campos.length, 0)
}

function adicionarAoWorkspace(c: CasoDeUso) {
  doWorkspace.value = [{ ...JSON.parse(JSON.stringify(c)), id: `${c.id}-copia-${Date.now().toString(36)}`, origem: 'workspace', destaque: false, usos: 0, criadoEm: new Date().toISOString().slice(0, 10) }, ...doWorkspace.value]
  toast.add({ title: props.t.adicionadoAoWorkspace(c.nome), icon: 'i-lucide-circle-check', color: 'success' })
}

function exportar(c: CasoDeUso) {
  baixarArquivo({ formato: 'enspace-caso-de-uso', versao: 1, workspace: workspace.nome, exportadoEm: new Date().toISOString().slice(0, 10), caso: c })
  toast.add({ title: props.t.casoExportado(c.nome), icon: 'i-lucide-upload', color: 'neutral' })
}

const acoesDoCaso = computed(() => {
  const c = aberto.value
  if (!c) return []
  return [[
    { label: props.t.adicionarAoWorkspace, description: props.t.adicionarAoWorkspaceDica, icon: 'i-lucide-plus', onSelect: () => adicionarAoWorkspace(c) },
    { label: props.t.exportarArquivo, icon: 'i-lucide-upload', onSelect: () => exportar(c) },
  ]]
})

const corDaComplexidade: Record<Complexidade, 'success' | 'warning' | 'error'> = { iniciante: 'success', intermediario: 'warning', avancado: 'error' }

/** A data no idioma escolhido no andaime. */
const idioma = useIdioma()
function data(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(idioma.value, { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <UModal
    v-model:open="janelas.central.value"
    :ui="{ content: 'max-w-6xl h-[88vh] sm:max-w-6xl overflow-hidden', body: 'p-0 sm:p-0' }"
    :title="props.t.centralTitulo"
  >
    <template #content>
      <div class="flex h-full min-h-0">
        <!-- ==================== lateral: fonte e filtros ==================== -->
        <aside v-if="!aberto" class="hidden w-60 shrink-0 flex-col border-r border-default md:flex">
          <div class="flex items-center gap-2 px-4 py-4">
            <span class="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <UIcon name="i-lucide-package" class="size-5 text-primary" />
            </span>
            <h2 class="text-sm font-bold text-highlighted">{{ props.t.centralTitulo }}</h2>
          </div>
          <nav class="space-y-0.5 px-2" :aria-label="props.t.centralTitulo">
            <button
              v-for="f in ([['destaques', props.t.destaques, 'i-lucide-star'], ['workspace', props.t.doWorkspace, 'i-lucide-building-2'], ['enspace', props.t.doEnspace, 'i-lucide-badge-check']] as const)"
              :key="f[0]"
              type="button"
              class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
              :class="fonte === f[0] ? 'bg-primary/10 font-semibold text-highlighted' : 'text-default hover:bg-elevated'"
              :aria-current="fonte === f[0] ? 'page' : undefined"
              @click="fonte = f[0]"
            >
              <UIcon :name="f[2]" class="size-4 shrink-0" :class="fonte === f[0] ? 'text-primary' : 'text-toned'" />
              <span class="min-w-0 flex-1 truncate text-left">{{ f[1] }}</span>
              <span class="text-xs text-muted">{{ contagem[f[0]] }}</span>
            </button>
          </nav>

          <USeparator class="my-3" />

          <div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-4">
            <fieldset>
              <legend class="mb-2 text-xs font-semibold text-toned">{{ props.t.tiposDeCaso }}</legend>
              <div class="space-y-2">
                <UCheckbox
                  v-for="tp in (['workspace', 'menu', 'categoria', 'tela'] as const)"
                  :key="tp"
                  :label="props.t.tipoCaso[tp]"
                  :model-value="tipos.includes(tp)"
                  @update:model-value="tipos = alternar(tipos, tp)"
                />
              </div>
            </fieldset>
            <fieldset>
              <legend class="mb-2 text-xs font-semibold text-toned">{{ props.t.complexidadeRotulo }}</legend>
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

        <!-- ==================== a lista ==================== -->
        <section v-if="!aberto" class="flex min-w-0 flex-1 flex-col">
          <div class="flex shrink-0 flex-wrap items-center gap-2 border-b border-default px-5 py-3">
            <UInput v-model="busca" icon="i-lucide-search" :placeholder="props.t.buscarCasos" class="min-w-56 flex-1" :aria-label="props.t.buscarCasos" autofocus>
              <template v-if="busca" #trailing>
                <UButton icon="i-lucide-x" size="xs" color="neutral" variant="link" :aria-label="props.t.limparFiltros" @click="busca = ''" />
              </template>
            </UInput>

            <!-- Áreas: várias de uma vez, com busca e "Selecionar tudo". -->
            <UPopover :content="{ align: 'end', sideOffset: 6 }">
              <UChip :show="areas.length > 0" :text="areas.length" size="xl" color="neutral">
                <UButton :label="props.t.areasRotulo" icon="i-lucide-layers" color="neutral" variant="outline" />
              </UChip>
              <template #content>
                <div class="w-64 p-2">
                  <UInput v-model="buscaDeArea" :placeholder="props.t.buscarAreas" size="sm" class="mb-1 w-full" autofocus />
                  <div class="flex justify-end px-1 py-1">
                    <UButton
                      :label="props.t.selecionarTudo"
                      size="xs"
                      color="neutral"
                      variant="link"
                      @click="areas = areas.length === AREAS.length ? [] : [...AREAS]"
                    />
                  </div>
                  <ul class="max-h-64 overflow-y-auto">
                    <li v-for="a in areasNaBusca" :key="a">
                      <label class="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm text-default hover:bg-elevated">
                        {{ a }}
                        <UCheckbox :model-value="areas.includes(a)" :aria-label="a" @update:model-value="areas = alternar(areas, a)" />
                      </label>
                    </li>
                  </ul>
                </div>
              </template>
            </UPopover>

            <UButton icon="i-lucide-x" color="neutral" variant="ghost" :aria-label="props.t.voltarCentral" @click="janelas.central.value = false" />
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <!-- Criar o seu: a faixa do ClickUp. -->
            <div class="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <UIcon name="i-lucide-package-plus" class="size-5 shrink-0 text-primary" />
              <p class="min-w-0 flex-1 text-sm text-default">{{ props.t.bannerCriar }}</p>
              <UButton :label="props.t.criarCaso" size="sm" color="neutral" variant="outline" @click="janelas.criando.value = true" />
            </div>

            <!-- Em destaque -->
            <template v-if="emDestaque.length">
              <h3 class="mb-3 text-base font-semibold text-highlighted">{{ props.t.emDestaque }}</h3>
              <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  v-for="(c, i) in emDestaque"
                  :key="c.id"
                  type="button"
                  class="group/cartao overflow-hidden rounded-xl border border-default bg-default text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
                  :style="{ animation: `entrada 0.25s ease-out ${i * 30}ms both` }"
                  @click="aberto = c"
                >
                  <div class="h-32 bg-elevated/60 p-2.5"><PreviaDoCaso :caso="c" quadro="menu" /></div>
                  <div class="flex items-center gap-2 border-t border-default px-3 py-2.5">
                    <UIcon :name="c.icone" class="size-4 shrink-0 text-primary" />
                    <span class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted">{{ c.nome }}</span>
                    <UIcon name="i-lucide-star" class="size-3.5 shrink-0 fill-current text-warning-600 dark:text-warning-400" />
                  </div>
                </button>
              </div>
            </template>

            <!-- Por área -->
            <p v-if="fonte === 'workspace' && !doWorkspace.length" class="py-10 text-center text-sm text-muted">{{ props.t.nadaNoWorkspace }}</p>
            <div v-else-if="!filtrados.length" class="py-10 text-center">
              <p class="text-sm text-muted">{{ props.t.nenhumCaso }}</p>
              <UButton :label="props.t.limparFiltros" size="sm" color="neutral" variant="outline" class="mt-3" @click="limpar" />
            </div>
            <section v-for="g in porArea" :key="g.area" class="mb-8">
              <div class="mb-3 flex items-baseline justify-between">
                <h3 class="text-base font-semibold text-highlighted">{{ g.area }}</h3>
                <UButton
                  v-if="g.casos.length > 3"
                  :label="expandidas.includes(g.area) ? props.t.voltarCentral : props.t.verMaisN(g.casos.length - 3)"
                  size="xs"
                  color="neutral"
                  variant="link"
                  @click="expandidas = alternar(expandidas, g.area)"
                />
              </div>
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  v-for="(c, i) in (expandidas.includes(g.area) ? g.casos : g.casos.slice(0, 3))"
                  :key="c.id"
                  type="button"
                  class="overflow-hidden rounded-xl border border-default bg-default text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
                  :style="{ animation: `entrada 0.25s ease-out ${i * 30}ms both` }"
                  @click="aberto = c"
                >
                  <div class="h-32 bg-elevated/60 p-2.5"><PreviaDoCaso :caso="c" quadro="menu" /></div>
                  <div class="flex items-center gap-2 border-t border-default px-3 py-2.5">
                    <UIcon :name="c.icone" class="size-4 shrink-0 text-primary" />
                    <span class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted">{{ c.nome }}</span>
                    <UBadge :label="props.t.tipoCaso[c.tipo]" size="sm" color="neutral" variant="subtle" class="shrink-0" />
                  </div>
                </button>
              </div>
            </section>
          </div>
        </section>

        <!-- ==================== o detalhe ==================== -->
        <section v-else class="flex min-w-0 flex-1 animate-[entrada_0.2s_ease-out_both] flex-col">
          <div class="flex shrink-0 items-center border-b border-default px-4 py-2.5">
            <UButton :label="props.t.voltarCentral" icon="i-lucide-arrow-left" color="neutral" variant="ghost" @click="aberto = null" />
            <p class="flex-1 text-center text-sm font-semibold text-highlighted">{{ props.t.centralTitulo }}</p>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" :aria-label="props.t.voltarCentral" @click="janelas.central.value = false" />
          </div>

          <div class="flex min-h-0 flex-1">
            <div class="min-w-0 flex-1 overflow-y-auto px-8 py-6">
              <!-- cabeçalho do caso -->
              <div class="mb-6 flex flex-wrap items-start gap-4">
                <span class="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/5">
                  <UIcon :name="aberto.icone" class="size-8 text-primary" />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1">
                    <h3 class="truncate text-xl font-semibold text-highlighted">{{ aberto.nome }}</h3>
                    <UDropdownMenu :items="acoesDoCaso" :content="{ align: 'start' }" :ui="{ content: 'w-72' }">
                      <UButton icon="i-lucide-ellipsis" size="sm" color="neutral" variant="ghost" :aria-label="props.t.maisDoCaso" />
                    </UDropdownMenu>
                  </div>
                  <p class="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    {{ props.t.complexidadeRotulo }}:
                    <UBadge :label="props.t.complexidades[aberto.complexidade]" size="sm" :color="corDaComplexidade[aberto.complexidade]" variant="subtle" />
                    <span class="mx-1">·</span>{{ aberto.area }}
                  </p>
                </div>
                <UButton :label="props.t.usarCaso" color="primary" size="lg" @click="janelas.usando.value = aberto" />
              </div>

              <!-- galeria e descrição -->
              <div class="mb-6 grid overflow-hidden rounded-xl border border-default md:grid-cols-[1fr_1fr]">
                <div class="flex flex-col border-b border-default p-4 md:border-b-0 md:border-r">
                  <button
                    type="button"
                    class="group/img relative h-48 w-full cursor-zoom-in focus-visible:outline-2 focus-visible:outline-primary"
                    :aria-label="`${props.t.ampliar}. ${props.t.imagemDe(quadroAtual + 1, quadrosDe(aberto).length)}`"
                    @click="ampliado = true"
                  >
                    <PreviaDoCaso :key="quadroAtual" :caso="aberto" :quadro="quadrosDe(aberto)[quadroAtual]!" class="animate-[entrada_0.2s_ease-out_both]" />
                    <span class="absolute right-2 top-2 rounded-md bg-default/90 p-1 opacity-0 shadow transition-opacity group-hover/img:opacity-100">
                      <UIcon name="i-lucide-maximize-2" class="size-4 text-highlighted" />
                    </span>
                  </button>
                  <div class="mt-3 flex items-center justify-between">
                    <UButton icon="i-lucide-chevron-left" size="xs" color="neutral" variant="ghost" :aria-label="props.t.anterior" @click="passar(-1)" />
                    <div class="flex gap-1.5">
                      <button
                        v-for="(q, i) in quadrosDe(aberto)"
                        :key="q"
                        type="button"
                        class="size-2 rounded-full transition-colors"
                        :class="i === quadroAtual ? 'bg-highlighted' : 'bg-accented'"
                        :aria-label="props.t.imagemDe(i + 1, quadrosDe(aberto).length)"
                        :aria-current="i === quadroAtual ? 'true' : undefined"
                        @click="quadroAtual = i"
                      />
                    </div>
                    <UButton icon="i-lucide-chevron-right" size="xs" color="neutral" variant="ghost" :aria-label="props.t.proxima" @click="passar(1)" />
                  </div>
                </div>
                <div class="p-5">
                  <p class="mb-2 text-sm font-semibold text-highlighted">{{ props.t.descricaoDoCaso }}</p>
                  <p class="text-sm leading-relaxed text-muted">{{ aberto.descricao || '...' }}</p>
                </div>
              </div>

              <!-- o que vem junto -->
              <p class="mb-2 text-sm font-semibold text-highlighted">{{ props.t.oQueVemJunto }}</p>
              <div class="space-y-2">
                <div
                  v-for="bloco in [
                    { id: 'menus', icone: 'i-lucide-list-tree', titulo: props.t.incluiMenus, resumo: props.t.nMenusTelas(aberto.menus.length, totalDeTelas(aberto)), itens: aberto.menus.flatMap(m => [m.rotulo, ...m.telas.map(x => x.rotulo)]), mostrar: aberto.menus.length > 0 },
                    { id: 'categorias', icone: 'i-lucide-database', titulo: props.t.incluiCategorias, resumo: props.t.nCategoriasCampos(aberto.categorias.length, totalDeCampos(aberto)), itens: aberto.categorias.flatMap(c => [c.nome, ...c.campos]), mostrar: aberto.categorias.length > 0 },
                    { id: 'status', icone: 'i-lucide-circle-dot', titulo: props.t.incluiStatus, resumo: props.t.nStatus(aberto.status.length), itens: aberto.status, mostrar: aberto.status.length > 0 },
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

            <!-- quem fez, quando, quantas vezes -->
            <aside class="hidden w-64 shrink-0 space-y-5 border-l border-default px-5 py-6 lg:block">
              <div class="rounded-xl border border-default p-4 shadow-sm">
                <div class="mb-2 flex items-start justify-between">
                  <span class="flex size-9 items-center justify-center rounded-lg border border-default">
                    <UIcon :name="aberto.origem === 'enspace' ? 'i-lucide-badge-check' : 'i-lucide-building-2'" class="size-5 text-primary" />
                  </span>
                  <UBadge v-if="aberto.origem === 'enspace'" :label="props.t.verificado" size="sm" color="primary" variant="subtle" />
                </div>
                <p class="text-sm font-semibold text-highlighted">{{ aberto.origem === 'enspace' ? props.t.peloEnspace : props.t.doSeuWorkspace }}</p>
                <p class="mt-0.5 text-xs text-muted">{{ aberto.origem === 'enspace' ? props.t.peloEnspaceDica : props.t.doSeuWorkspaceDica }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.criadoEmRotulo }}</p>
                <p class="mt-1 text-sm text-default">{{ data(aberto.criadoEm) }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.usadoRotulo }}</p>
                <UBadge :label="props.t.vezes(aberto.usos)" color="neutral" variant="outline" class="mt-1" />
              </div>
            </aside>
          </div>
        </section>
      </div>

      <!-- A imagem ampliada: passa com as setas, fecha com Esc. -->
      <UModal v-model:open="ampliado" fullscreen :ui="{ content: 'bg-inverted/95' }" :title="aberto?.nome ?? ''">
        <template #content>
          <div v-if="aberto" class="flex h-full flex-col" @keydown.left="passar(-1)" @keydown.right="passar(1)">
            <div class="flex shrink-0 items-center justify-between px-6 py-3 text-inverted">
              <p class="text-sm">{{ props.t.imagemDe(quadroAtual + 1, quadrosDe(aberto).length) }}</p>
              <UButton icon="i-lucide-x" color="neutral" variant="ghost" class="text-inverted" :aria-label="props.t.todasFechar" @click="ampliado = false" />
            </div>
            <div class="flex min-h-0 flex-1 items-center gap-4 px-6 pb-8">
              <UButton icon="i-lucide-chevron-left" size="xl" color="neutral" variant="ghost" class="text-inverted" :aria-label="props.t.anterior" @click="passar(-1)" />
              <div class="mx-auto aspect-[16/10] h-full max-h-[75vh] min-w-0 flex-1 rounded-lg bg-default p-4">
                <PreviaDoCaso :key="quadroAtual" :caso="aberto" :quadro="quadrosDe(aberto)[quadroAtual]!" grande class="animate-[entrada_0.2s_ease-out_both]" />
              </div>
              <UButton icon="i-lucide-chevron-right" size="xl" color="neutral" variant="ghost" class="text-inverted" :aria-label="props.t.proxima" @click="passar(1)" />
            </div>
          </div>
        </template>
      </UModal>
    </template>
  </UModal>
</template>
