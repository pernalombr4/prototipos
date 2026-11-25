<script setup lang="ts">
/**
 * O catálogo de widgets, em árvore de 2 níveis (rodada 5).
 *
 * A redatora pediu: "um menu que vai de um nível pro outro, em árvore.
 * Selecionei que quero puxar ali dados de tarefas > aparecem as opções pra mim
 * de cada lâmina. Selecionei que quero botar categorias > seleciono quais
 * quero mostrar."
 *
 * - 1º nível: de onde vem o dado (Tarefas, Categorias, Navegação e agenda,
 *   Equipe e notas), com quantas opções há dentro;
 * - 2º nível de Tarefas: as lâminas do Painel de tarefas, em Números, Listas
 *   e Gráficos, cada uma com Adicionar ou o selo "Na Home";
 * - 2º nível de Categorias: quais aparecem e em que ordem; o botão adiciona o
 *   widget ou salva a escolha no que já está na Home;
 * - a busca do 1º nível procura em todas as folhas de uma vez.
 *
 * Rodada 6: 5 grupos (Tarefas, Agenda, Itens e categorias, Telas e atalhos,
 * BENI e equipe). Categorias passa a ser uma linha de "Itens e categorias", e
 * a escolha de quais e em que ordem vira o 3º nível; "Voltar" leva de volta a
 * Itens e categorias.
 *
 * Abre só pelo "Adicionar widget" da barra de edição (rodada 4). Sem sombra e
 * sem travar a Home (`:overlay="false"`, `:modal="false"`): a pessoa vê o
 * widget entrar no topo.
 *
 * Componentes: `USlideover`, `UInput`, `UButton`, `UBadge`, `UIcon`,
 * `UEmpty` (MCP nuxt-ui).
 */
import LinhaDoCatalogo from './_LinhaDoCatalogo.vue'
import OrdemDeCategorias from './_OrdemDeCategorias.vue'
import type { Categoria } from './mocks'
import type { GrupoDoCatalogo, TipoDeWidget } from './widgets'
import { CATALOGO, GRUPOS, SECOES } from './widgets'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Tipos que já estão na Home que se edita. */
  naHome: TipoDeWidget[]
  admin: boolean
  escopo: 'minha' | 'padrao'
  /** Categorias que a pessoa acessa, na ordem do workspace. */
  categorias: Categoria[]
  /** A escolha atual do widget Categorias, quando ele já está na Home. */
  categoriasEscolhidas?: string[]
  /** Rodada 8: só os widgets do MVP (`mvp` no widgets.ts). */
  mvp?: boolean
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{
  adicionar: [tipo: TipoDeWidget]
  categorias: [escolhidas: string[]]
}>()

type Nivel = GrupoDoCatalogo | 'escolherCategorias'
const nivel = ref<Nivel | null>(null)
const busca = ref('')
const escolha = ref<string[]>([])

watch(aberto, (a) => {
  if (!a) return
  busca.value = ''
  nivel.value = null
})

/* Rodada 9: o widget que pede permissão (Spaceflow) não aparece para o membro do protótipo, que não a tem. */
const visiveis = computed(() => CATALOGO.filter(d => (props.admin || (!d.soAdmin && !d.permissao)) && (!props.mvp || d.mvp)))
/** O grupo sem widget nenhum (Equipe e notas, no MVP) não aparece. */
const grupos = computed(() => GRUPOS.filter(g => quantas(g.grupo) > 0))
const tiposNaHome = computed(() => new Set(props.naHome))
const categoriasNaHome = computed(() => tiposNaHome.value.has('categorias'))

function abrirGrupo(g: Nivel) {
  if (g === 'escolherCategorias') escolha.value = [...(props.categoriasEscolhidas ?? [])]
  busca.value = ''
  nivel.value = g
}

function quantas(g: GrupoDoCatalogo) {
  return visiveis.value.filter(d => d.grupo === g).length
}

function voltar() {
  nivel.value = nivel.value === 'escolherCategorias' ? 'itens' : null
}

const nomeDoNivel = (n: Nivel) => n === 'escolherCategorias' ? props.t.widgets.categorias.titulo : props.t.grupos[n]

const doGrupo = (g: GrupoDoCatalogo) => visiveis.value.filter(d => d.grupo === g)

/** Busca do 1º nível: todas as folhas, mais o grupo Categorias pelo nome. */
const resultados = computed(() => {
  const termo = busca.value.trim().toLocaleLowerCase(props.t.locale)
  if (!termo) return []
  return visiveis.value.filter((d) => {
    const txt = props.t.widgets[d.tipo]
    return `${txt.titulo} ${txt.descricao} ${props.t.grupos[d.grupo]}`.toLocaleLowerCase(props.t.locale).includes(termo)
  })
})

function aplicarCategorias() {
  emit('categorias', escolha.value)
}

const titulo = computed(() => nivel.value ? nomeDoNivel(nivel.value) : props.t.personalizacao.catalogoTitulo)
</script>

<template>
  <USlideover
    v-model:open="aberto"
    :title="t.personalizacao.catalogoTitulo"
    :description="escopo === 'padrao' ? t.personalizacao.catalogoPadrao : t.personalizacao.catalogoMinha"
    :overlay="false"
    :modal="false"
    :ui="{ content: 'max-w-md', body: 'p-0 sm:p-0' }"
  >
    <template #body>
      <div :key="nivel ?? 'raiz'" class="flex h-full animate-[entrada_0.2s_ease-out_both] flex-col motion-reduce:animate-none">
        <!-- 1º nível -->
        <template v-if="!nivel">
          <div class="px-4 pt-4 sm:px-6">
            <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.personalizacao.buscar" class="w-full" autofocus />
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
            <ul v-if="!busca.trim()" class="space-y-2" :aria-label="titulo">
              <li v-for="g in grupos" :key="g.grupo">
                <button
                  type="button"
                  class="group/no flex w-full items-center gap-3 rounded-lg border border-default p-3 text-left transition-colors duration-150 hover:border-accented hover:bg-elevated/40 focus-visible:outline-2 focus-visible:outline-primary"
                  @click="abrirGrupo(g.grupo)"
                >
                  <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
                    <UIcon :name="g.icone" class="size-4 text-primary" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block text-sm font-medium text-highlighted">{{ t.grupos[g.grupo] }}</span>
                    <span class="block text-xs text-muted">{{ (mvp && t.descricaoDosGruposMvp[g.grupo]) || t.descricaoDosGrupos[g.grupo] }}</span>
                  </span>
                  <UBadge :label="t.catalogo.opcoes(quantas(g.grupo))" color="neutral" variant="subtle" size="sm" class="shrink-0" />
                  <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-dimmed transition-transform duration-150 group-hover/no:translate-x-0.5" />
                </button>
              </li>
            </ul>

            <template v-else>
              <h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                {{ t.catalogo.resultados }}
              </h3>
              <ul v-if="resultados.length" class="space-y-2">
                <li v-for="d in resultados" :key="d.tipo">
                  <!-- Categorias pede a escolha: a linha leva ao nível da escolha. -->
                  <button
                    v-if="d.tipo === 'categorias'"
                    type="button"
                    class="flex w-full items-center gap-3 rounded-lg border border-default p-3 text-left transition-colors hover:border-accented hover:bg-elevated/40"
                    @click="abrirGrupo('escolherCategorias')"
                  >
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
                      <UIcon :name="d.icone" class="size-4 text-primary" />
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="block text-sm font-medium text-highlighted">{{ t.widgets[d.tipo].titulo }}</span>
                      <span class="block text-xs text-muted">{{ t.widgets[d.tipo].descricao }}</span>
                    </span>
                    <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-dimmed" />
                  </button>
                  <LinhaDoCatalogo v-else :t="t" :d="d" :na-home="tiposNaHome.has(d.tipo)" @adicionar="emit('adicionar', d.tipo)" />
                </li>
              </ul>
              <p v-else class="py-10 text-center text-sm text-muted">
                {{ t.personalizacao.semResultado }}
              </p>
            </template>
          </div>
        </template>

        <!-- 2º nível -->
        <template v-else>
          <div class="flex items-center gap-2 border-b border-default px-2 py-2 sm:px-4">
            <UButton :label="t.catalogo.voltar" icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" @click="voltar" />
            <span class="h-4 w-px bg-accented" aria-hidden="true" />
            <h3 class="truncate text-sm font-semibold text-highlighted">
              <span v-if="nivel === 'escolherCategorias'" class="font-normal text-muted">{{ t.grupos.itens }} / </span>{{ nomeDoNivel(nivel) }}
            </h3>
          </div>

          <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4 sm:px-6">
            <!-- Tarefas: as lâminas em 3 seções -->
            <template v-if="nivel === 'tarefas'">
              <p class="flex gap-2 text-xs text-muted">
                <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />{{ t.catalogo.escopoDica }}
              </p>
              <section v-for="s in SECOES" :key="s">
                <h4 class="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
                  {{ t.secoes[s] }}
                </h4>
                <ul class="space-y-2">
                  <li v-for="d in doGrupo('tarefas').filter(x => x.secao === s)" :key="d.tipo">
                    <LinhaDoCatalogo :t="t" :d="d" :na-home="tiposNaHome.has(d.tipo)" @adicionar="emit('adicionar', d.tipo)" />
                  </li>
                </ul>
              </section>
            </template>

            <!-- Categorias: quais e em que ordem -->
            <template v-else-if="nivel === 'escolherCategorias'">
              <UEmpty v-if="!categorias.length" icon="i-lucide-layout-grid" :description="t.catalogo.semCategorias" variant="naked" size="sm" />
              <template v-else>
                <p class="text-sm text-muted">
                  {{ t.catalogo.categoriasDica }}
                </p>
                <OrdemDeCategorias v-model="escolha" :t="t" :categorias="categorias" />
              </template>
            </template>

            <!-- Os outros grupos: uma linha por widget. Categorias leva à escolha. -->
            <ul v-else class="space-y-2">
              <li v-for="d in doGrupo(nivel)" :key="d.tipo">
                <button
                  v-if="d.tipo === 'categorias'"
                  type="button"
                  class="flex w-full items-center gap-3 rounded-lg border border-default p-3 text-left transition-colors hover:border-accented hover:bg-elevated/40 focus-visible:outline-2 focus-visible:outline-primary"
                  @click="abrirGrupo('escolherCategorias')"
                >
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
                    <UIcon :name="d.icone" class="size-4 text-primary" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block text-sm font-medium text-highlighted">{{ t.widgets[d.tipo].titulo }}</span>
                    <span class="block text-xs text-muted">{{ t.widgets[d.tipo].descricao }}</span>
                  </span>
                  <UBadge v-if="categoriasNaHome" :label="t.personalizacao.jaNaHome" color="neutral" variant="subtle" size="sm" class="shrink-0" />
                  <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-dimmed" />
                </button>
                <LinhaDoCatalogo v-else :t="t" :d="d" :na-home="tiposNaHome.has(d.tipo)" @adicionar="emit('adicionar', d.tipo)" />
              </li>
            </ul>
          </div>

          <div v-if="nivel === 'escolherCategorias' && categorias.length" class="border-t border-default px-4 py-3 sm:px-6">
            <UButton
              :label="categoriasNaHome ? t.catalogo.salvarCategorias : t.catalogo.adicionarCategorias"
              :icon="categoriasNaHome ? 'i-lucide-check' : 'i-lucide-plus'"
              block
              @click="aplicarCategorias"
            />
          </div>
        </template>
      </div>
    </template>
  </USlideover>
</template>

