<script setup lang="ts">
import PreviaDoCaso from './_PreviaDoCaso.vue'
import { AREAS, casosDeUso, localidades, type CasoDeUso, type Complexidade } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O PASSO 2 DA CRIAÇÃO (rodada 24): a Central de casos de uso, com a cara da
 * central do protótipo menu-lateral (a "lojinha", padrão da Central de modelos
 * do ClickUp), como a Mikaela pediu.
 *
 * LISTA
 *   à esquerda, de onde vem (Destaques, Do ENSPACE) e os filtros de
 *   Localidade e Complexidade, em caixas de marcar;
 *   em cima, a busca e "Áreas", com busca própria e várias marcadas;
 *   a faixa "Prefere começar do zero?", porque o zero é o caminho mais comum;
 *   os cartões com a prévia desenhada, agrupados por área, "Ver mais" depois de 3.
 *
 * DETALHE
 *   galeria que passa, descrição, "O que vem junto" item a item e, à direita,
 *   quem fez, quando e quantas vezes foi usado. "Criar com {caso}" cria o
 *   workspace já com o caso aplicado.
 */
const props = defineProps<{ t: TextosDaTela['criar'], criando: boolean }>()
const emit = defineEmits<{ voltar: [], criar: [caso: CasoDeUso | null] }>()

type Fonte = 'destaques' | 'enspace'
const fonte = ref<Fonte>('destaques')
const busca = ref('')
/** Brasil marcado de início, como o produto faz. */
const locais = ref<string[]>(['pt-br'])
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

/** Sem localidade marcada, valem todas. */
const filtrados = computed(() => casosDeUso.filter((c) => {
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
  destaques: casosDeUso.filter(c => c.destaque).length,
  enspace: casosDeUso.length,
}))

function limpar() {
  busca.value = ''
  locais.value = []
  complexidades.value = []
  areas.value = []
}

const corDaComplexidade: Record<Complexidade, 'success' | 'warning' | 'error'> = { iniciante: 'success', intermediario: 'warning', avancado: 'error' }

/* ------------------------------ o detalhe ------------------------------ */

function quadrosDe(c: CasoDeUso) {
  const q: ('menu' | 'quadro' | 'ficha' | 'painel')[] = ['menu']
  if (c.status.length) q.push('quadro')
  if (c.categorias.length) q.push('ficha')
  if (c.menus.some(m => m.telas.some(x => x.tipoDeTela === 'paineis'))) q.push('painel')
  return q
}
const quadroAtual = ref(0)
const incluiAberto = ref<string[]>([])
watch(aberto, () => {
  quadroAtual.value = 0
  incluiAberto.value = []
})

function passar(passo: number) {
  if (!aberto.value) return
  const total = quadrosDe(aberto.value).length
  quadroAtual.value = (quadroAtual.value + passo + total) % total
}

function totalDeTelas(c: CasoDeUso) {
  return c.menus.reduce((n, m) => n + m.telas.length, 0)
}
function totalDeCampos(c: CasoDeUso) {
  return c.categorias.reduce((n, x) => n + x.campos.length, 0)
}

const idioma = useIdioma()
function data(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(idioma.value, { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <!-- ==================== cabeçalho do passo ==================== -->
    <div class="shrink-0 border-b border-default px-6 pb-4 pt-6">
      <div class="mb-4 flex items-center gap-3">
        <div v-for="n in 2" :key="n" class="h-1 flex-1 rounded-full bg-primary" />
        <span class="shrink-0 text-xs font-medium text-muted">{{ props.t.passoDe(2, 2) }}</span>
      </div>
      <h2 class="text-xl font-bold tracking-tight text-highlighted">{{ props.t.querModelo }}</h2>
      <p class="mt-1 text-sm text-muted">{{ props.t.modeloAjuda }}</p>
    </div>

    <div class="flex min-h-0 flex-1">
      <!-- ==================== lateral: fonte e filtros ==================== -->
      <aside v-if="!aberto" class="hidden w-56 shrink-0 flex-col border-r border-default md:flex">
        <div class="flex items-center gap-2 px-4 py-4">
          <span class="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <UIcon name="i-lucide-package" class="size-5 text-primary" />
          </span>
          <h3 class="text-sm font-bold text-highlighted">{{ props.t.centralTitulo }}</h3>
        </div>
        <nav class="space-y-0.5 px-2" :aria-label="props.t.centralTitulo">
          <button
            v-for="f in ([['destaques', props.t.destaques, 'i-lucide-star'], ['enspace', props.t.doEnspace, 'i-lucide-badge-check']] as const)"
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
            <legend class="mb-2 text-xs font-semibold text-toned">{{ props.t.localidade }}</legend>
            <div class="space-y-2">
              <UCheckbox
                v-for="l in localidades"
                :key="l.id"
                :label="props.t.localidades[l.id as 'pt-br' | 'en-us' | 'global']"
                :model-value="locais.includes(l.id)"
                @update:model-value="locais = alternar(locais, l.id)"
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

      <!-- ==================== a lista ==================== -->
      <section v-if="!aberto" class="flex min-w-0 flex-1 flex-col">
        <div class="flex shrink-0 flex-wrap items-center gap-2 border-b border-default px-5 py-3">
          <UInput v-model="busca" icon="i-lucide-search" :placeholder="props.t.buscarCasos" class="min-w-48 flex-1" :aria-label="props.t.buscarCasos">
            <template v-if="busca" #trailing>
              <UButton icon="i-lucide-x" size="xs" color="neutral" variant="link" :aria-label="props.t.limparBusca" @click="busca = ''" />
            </template>
          </UInput>

          <!--
            Áreas: o USelectMenu múltiplo, como na galeria-de-casos-de-uso (rodada 2 de lá,
            pedido da Mikaela: "esse botao selecionar tudo ta super estranho ai dentro").
            Busca embutida, marca de seleção na linha, e "Selecionar tudo" e "Limpar" como
            links no pé da lista, com a contagem.
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
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <!-- Começar do zero: a faixa do ClickUp, aqui para o caminho mais comum. -->
          <div class="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <UIcon name="i-lucide-sparkles" class="size-5 shrink-0 text-primary" />
            <div class="min-w-48 flex-1">
              <p class="text-sm font-semibold text-highlighted">{{ props.t.bannerZeroTitulo }}</p>
              <p class="text-sm text-muted">{{ props.t.bannerZero }}</p>
            </div>
            <UButton
              :label="props.t.criarDoZero"
              icon="i-lucide-check"
              size="sm"
              color="neutral"
              variant="outline"
              :loading="props.criando"
              @click="emit('criar', null)"
            />
          </div>

          <!-- Em destaque -->
          <template v-if="emDestaque.length">
            <h3 class="mb-3 text-base font-semibold text-highlighted">{{ props.t.emDestaque }}</h3>
            <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button
                v-for="(c, i) in emDestaque"
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
                  <UIcon name="i-lucide-star" class="size-3.5 shrink-0 fill-current text-warning-600 dark:text-warning-400" />
                </div>
              </button>
            </div>
          </template>

          <!-- Por área -->
          <div v-if="!filtrados.length" class="py-10 text-center">
            <UIcon name="i-lucide-layout-template" class="mx-auto size-6 text-dimmed" />
            <p class="mt-2 text-sm font-medium text-highlighted">{{ props.t.nenhumCaso }}</p>
            <p class="mt-1 text-sm text-muted">{{ props.t.nenhumCasoAjuda }}</p>
            <UButton :label="props.t.limparFiltros" size="sm" color="neutral" variant="outline" class="mt-3" @click="limpar" />
          </div>
          <section v-for="g in porArea" :key="g.area" class="mb-8">
            <div class="mb-3 flex items-baseline justify-between">
              <h3 class="text-base font-semibold text-highlighted">{{ g.area }}</h3>
              <UButton
                v-if="g.casos.length > 3"
                :label="expandidas.includes(g.area) ? props.t.verMenos : props.t.verMaisN(g.casos.length - 3)"
                size="xs"
                color="neutral"
                variant="outline"
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
                  <UBadge :label="props.t.complexidades[c.complexidade]" size="sm" :color="corDaComplexidade[c.complexidade]" variant="subtle" class="shrink-0" />
                </div>
              </button>
            </div>
          </section>
        </div>
      </section>

      <!-- ==================== o detalhe ==================== -->
      <section v-else class="flex min-w-0 flex-1 animate-[entrada_0.2s_ease-out_both] flex-col">
        <div class="flex shrink-0 items-center border-b border-default px-4 py-2.5">
          <UButton :label="props.t.centralTitulo" icon="i-lucide-arrow-left" color="neutral" variant="ghost" @click="aberto = null" />
        </div>

        <div class="flex min-h-0 flex-1">
          <div class="min-w-0 flex-1 overflow-y-auto px-6 py-6">
            <!-- cabeçalho do caso -->
            <div class="mb-6 flex flex-wrap items-start gap-4">
              <span class="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/5">
                <UIcon :name="aberto.icone" class="size-8 text-primary" />
              </span>
              <div class="min-w-0 flex-1">
                <h3 class="truncate text-xl font-semibold text-highlighted">{{ aberto.nome }}</h3>
                <p class="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted">
                  {{ props.t.complexidade }}:
                  <UBadge :label="props.t.complexidades[aberto.complexidade]" size="sm" :color="corDaComplexidade[aberto.complexidade]" variant="subtle" />
                  <span class="mx-1">·</span>{{ aberto.area }}
                </p>
              </div>
              <UButton
                :label="props.t.criarCom(aberto.nome)"
                icon="i-lucide-check"
                color="primary"
                size="lg"
                :loading="props.criando"
                @click="emit('criar', aberto)"
              />
            </div>

            <!-- galeria e descrição -->
            <div class="mb-6 grid overflow-hidden rounded-xl border border-default md:grid-cols-2">
              <div class="flex flex-col border-b border-default p-4 md:border-b-0 md:border-r">
                <div class="h-48 w-full">
                  <PreviaDoCaso :key="quadroAtual" :caso="aberto" :quadro="quadrosDe(aberto)[quadroAtual]!" grande class="animate-[entrada_0.2s_ease-out_both]" />
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <UButton icon="i-lucide-chevron-left" size="xs" color="neutral" variant="ghost" :aria-label="props.t.anterior" @click="passar(-1)" />
                  <div class="flex gap-1.5">
                    <button
                      v-for="(q, i) in quadrosDe(aberto)"
                      :key="q"
                      type="button"
                      class="size-2 rounded-full transition-colors"
                      :class="i === quadroAtual ? 'bg-inverted' : 'bg-accented'"
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
                <p class="text-sm leading-relaxed text-muted">{{ aberto.descricao }}</p>
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
          <aside class="hidden w-60 shrink-0 space-y-5 border-l border-default px-5 py-6 lg:block">
            <div class="rounded-xl border border-default p-4 shadow-sm">
              <div class="mb-2 flex items-start justify-between">
                <span class="flex size-9 items-center justify-center rounded-lg border border-default">
                  <UIcon name="i-lucide-badge-check" class="size-5 text-primary" />
                </span>
                <UBadge :label="props.t.verificado" size="sm" color="primary" variant="subtle" />
              </div>
              <p class="text-sm font-semibold text-highlighted">{{ props.t.peloEnspace }}</p>
              <p class="mt-0.5 text-xs text-muted">{{ props.t.peloEnspaceDica }}</p>
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
                <UBadge
                  v-for="l in aberto.localidades"
                  :key="l"
                  :label="props.t.localidades[l as 'pt-br' | 'en-us' | 'global']"
                  size="sm"
                  color="neutral"
                  variant="subtle"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>

    <!-- ==================== rodapé ==================== -->
    <div class="flex shrink-0 items-center justify-between gap-3 border-t border-default px-6 py-3">
      <UButton :label="props.t.voltar" icon="i-lucide-arrow-left" color="neutral" variant="ghost" @click="emit('voltar')" />
      <p class="text-xs text-muted">{{ props.t.rodapeCentral }}</p>
    </div>
  </div>
</template>
