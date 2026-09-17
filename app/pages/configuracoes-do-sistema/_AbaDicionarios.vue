<script setup lang="ts">
import Secao from './_Secao.vue'
import {
  chavesDeTraducao,
  documentacao,
  idiomas,
  sugestoesDeIa,
  totalDeChaves,
  type ChaveDeTraducao,
} from './mocks'
import {
  form,
  preenchidasNoTotal,
  preenchidasPorCategoria,
  traducoes,
  traduzir,
} from './estado'

const emit = defineEmits<{ irPara: [aba: string] }>()

const toast = useToast()

/* ------------------------------------------------------------------ *
 * 14 mil chaves.
 *
 * O desenho da rodada 1 listava tudo o que o filtro devolvesse, e isso
 * vira rolagem infinita num workspace de verdade. A pesquisa (PESQUISA.md,
 * rodada 5) mostra que ninguém no mercado renderiza o conjunto inteiro:
 *
 *   Crowdin  navega por arquivo, num painel lateral, e pagina de 50 em 50
 *   Weblate  abre o componente em fatias e transforma a busca em fila
 *   Lokalise pagina por cursor acima de 5 mil e age em massa sobre o filtro
 *
 * Daí os três níveis desta tela:
 *
 *   1. VISÃO GERAL   as categorias com progresso. Nenhuma chave na tela.
 *   2. RECORTE       as chaves de uma categoria ou de uma busca, 50 por página.
 *   3. FILA          uma chave por vez, teclado, para atravessar o volume.
 * ------------------------------------------------------------------ */

const POR_PAGINA = 50
const CUSTO_POR_CHAVE = 0.2

/** Índice por categoria, montado uma vez. Varrer 14 mil a cada tecla, não. */
const porCategoria = new Map<string, ChaveDeTraducao[]>()
for (const chave of chavesDeTraducao) {
  const lista = porCategoria.get(chave.categoria) ?? []
  lista.push(chave)
  porCategoria.set(chave.categoria, lista)
}

const categorias = [...porCategoria.entries()].map(([nome, chaves]) => ({ nome, total: chaves.length }))

const categoriaAberta = ref<string | null>(null)
const busca = ref('')
const filtro = ref<'faltam' | 'traduzidas' | 'todas'>('faltam')
const pagina = ref(1)
const ordem = ref<'faltantes' | 'nome'>('faltantes')
const gruposAtivos = ref<string[]>(['Geral', 'Campos', 'Formulários'])

/**
 * O nível que faltava. No ENSPACE, Formulários não é um grupo raso: dentro
 * dele cada formulário repete os campos da categoria, com textos próprios.
 * Em "Clients", Formulários tem mais chaves que Campos justamente por isso.
 * Aqui o formulário vira o segundo recorte, em vez de virar mais um nível de
 * sanfona.
 */
const formularioAberto = ref<string | null>(null)

const idiomaAtual = computed(() => idiomas.find(i => i.codigo === form.dicionarios.idioma))
const faltamNoTotal = computed(() => totalDeChaves - preenchidasNoTotal.value)

function porcento(parte: number, total: number) {
  return total ? Math.round((parte / total) * 100) : 0
}

/* ------------------------- nível 1: categorias ------------------------- */

const categoriasComProgresso = computed(() => {
  const lista = categorias.map(c => ({
    ...c,
    prontas: preenchidasPorCategoria[c.nome] ?? 0,
    faltam: c.total - (preenchidasPorCategoria[c.nome] ?? 0),
  }))
  return ordem.value === 'nome'
    ? lista.sort((a, b) => a.nome.localeCompare(b.nome))
    : lista.sort((a, b) => b.faltam - a.faltam)
})

/* --------------------- nível 2: o recorte de trabalho ------------------- */

/**
 * O universo é a categoria aberta ou, quando há busca sem categoria, o
 * workspace inteiro. Sem categoria e sem busca o universo é vazio de
 * propósito: a tela não lista 14 mil chaves por acidente.
 */
const universo = computed<ChaveDeTraducao[]>(() => {
  if (categoriaAberta.value) return porCategoria.get(categoriaAberta.value) ?? []
  return busca.value.trim() ? chavesDeTraducao : []
})

const recorte = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  return universo.value.filter((c) => {
    if (!gruposAtivos.value.includes(c.grupo)) return false
    if (formularioAberto.value && c.formulario !== formularioAberto.value) return false
    const preenchida = !!traducoes[c.id]
    if (filtro.value === 'faltam' && preenchida) return false
    if (filtro.value === 'traduzidas' && !preenchida) return false
    if (!termo) return true
    return (
      c.original.toLowerCase().includes(termo)
      || c.dono.toLowerCase().includes(termo)
      || (traducoes[c.id] ?? '').toLowerCase().includes(termo)
    )
  })
})

const visiveis = computed(() =>
  recorte.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA),
)

/** Quantas chaves cada grupo tem dentro do universo, para o filtro de grupo. */
const contagemPorGrupo = computed(() => {
  const contagem: Record<string, number> = { 'Geral': 0, 'Campos': 0, 'Formulários': 0 }
  for (const c of universo.value) contagem[c.grupo] = (contagem[c.grupo] ?? 0) + 1
  return contagem
})

/** Os formulários da categoria aberta, com quantas chaves cada um carrega. */
const formulariosDoUniverso = computed(() => {
  const contagem = new Map<string, number>()
  for (const c of universo.value) {
    if (!c.formulario) continue
    contagem.set(c.formulario, (contagem.get(c.formulario) ?? 0) + 1)
  }
  return [...contagem.entries()].map(([nome, total]) => ({ nome, total }))
})

/** O caminho da chave, como o produto mostra na árvore. */
function caminhoDaChave(c: ChaveDeTraducao) {
  return [c.grupo, c.formulario, c.dono].filter(Boolean).join(' › ')
}

watch([categoriaAberta, filtro, busca, gruposAtivos, formularioAberto], () => {
  pagina.value = 1
})

watch([categoriaAberta, gruposAtivos], () => {
  if (!gruposAtivos.value.includes('Formulários')) formularioAberto.value = null
})

function abrirCategoria(nome: string) {
  categoriaAberta.value = nome
  busca.value = ''
  formularioAberto.value = null
}

function voltarParaCategorias() {
  categoriaAberta.value = null
  busca.value = ''
  formularioAberto.value = null
}

function alternarGrupo(grupo: string) {
  const i = gruposAtivos.value.indexOf(grupo)
  if (i >= 0 && gruposAtivos.value.length > 1) gruposAtivos.value.splice(i, 1)
  else if (i < 0) gruposAtivos.value.push(grupo)
}

/* ---------------------------- nível 3: a fila --------------------------- */

const naFila = ref(false)
const posicao = ref(0)
const rascunho = ref('')

/** A fila é o que falta no recorte atual. A busca vira fila, como no Weblate. */
const fila = computed(() => {
  const base = universo.value.length ? recorte.value : chavesDeTraducao
  return base.filter(c => !traducoes[c.id])
})

const atual = computed(() => fila.value[posicao.value] ?? fila.value[0] ?? null)

function abrirFila() {
  posicao.value = 0
  rascunho.value = ''
  naFila.value = true
}

function avancar(guardando: boolean) {
  const chave = atual.value
  if (!chave) return
  if (guardando && rascunho.value.trim()) {
    // A chave sai da fila ao ser traduzida, então a posição não avança:
    // a próxima pendente já ocupa este lugar.
    traduzir(chave.id, rascunho.value.trim())
  }
  else {
    posicao.value = Math.min(posicao.value + 1, Math.max(fila.value.length - 1, 0))
  }
  rascunho.value = ''
}

function sugerirNaFila() {
  const chave = atual.value
  if (chave) rascunho.value = sugestoesDeIa[chave.original] ?? ''
}

watch(atual, () => {
  rascunho.value = ''
})

/* ------------------------------ tradução por IA ------------------------- */

const traduzindo = ref<string | null>(null)
const confirmandoIa = ref(false)
const rodandoIa = ref(false)

const alvoDaIa = computed(() => {
  const base = universo.value.length ? recorte.value : chavesDeTraducao
  return base.filter(c => !traducoes[c.id])
})

const custoDaIa = computed(() => Math.ceil(alvoDaIa.value.length * CUSTO_POR_CHAVE))

async function traduzirUma(chave: ChaveDeTraducao) {
  traduzindo.value = chave.id
  await new Promise(r => setTimeout(r, 400))
  traduzindo.value = null
  const sugestao = sugestoesDeIa[chave.original]
  if (sugestao) traduzir(chave.id, sugestao)
}

async function rodarIaEmMassa() {
  rodandoIa.value = true
  const alvo = [...alvoDaIa.value]
  await new Promise(r => setTimeout(r, 1200))
  let feitas = 0
  for (const chave of alvo) {
    const sugestao = sugestoesDeIa[chave.original]
    if (sugestao) {
      traduzir(chave.id, sugestao)
      feitas++
    }
  }
  rodandoIa.value = false
  confirmandoIa.value = false
  toast.add({
    title: `${feitas.toLocaleString('pt-BR')} chaves traduzidas`,
    description: 'Nada foi gravado ainda: use Salvar, na barra de baixo.',
    icon: 'i-lucide-sparkles',
    color: 'neutral',
  })
}
</script>

<template>
  <div class="space-y-5">
    <!-- 1. VISÃO GERAL ---------------------------------------------- -->
    <Secao
      id="traducoes"
      titulo="Dicionários de tradução"
      resumo="Os textos que você criou (categorias, campos, formulários) no idioma de quem lê."
      :doc="documentacao.dicionarios"
      style="animation: entrada .4s ease-out both"
    >
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted">Traduzir para</span>
          <div class="flex rounded-lg border border-default p-0.5">
            <button
              v-for="i in idiomas"
              :key="i.codigo"
              type="button"
              class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              :class="form.dicionarios.idioma === i.codigo
                ? 'bg-primary text-inverted'
                : 'text-muted hover:bg-elevated hover:text-highlighted'"
              :aria-pressed="form.dicionarios.idioma === i.codigo"
              @click="form.dicionarios.idioma = i.codigo"
            >
              <span aria-hidden="true">{{ i.bandeira }}</span>
              {{ i.nome }}
            </button>
          </div>
        </div>

        <div class="min-w-64 flex-1 sm:max-w-sm">
          <div class="mb-1 flex items-baseline justify-between text-sm">
            <span class="text-muted">
              <strong class="text-highlighted">{{ preenchidasNoTotal.toLocaleString('pt-BR') }}</strong>
              de {{ totalDeChaves.toLocaleString('pt-BR') }} traduzidas
            </span>
            <span class="text-muted">{{ porcento(preenchidasNoTotal, totalDeChaves) }}%</span>
          </div>
          <UProgress :model-value="preenchidasNoTotal" :max="totalDeChaves" size="sm" />
        </div>
      </div>

      <div class="mt-5 flex flex-wrap items-center gap-2 border-t border-default pt-4">
        <UInput
          v-model="busca"
          icon="i-lucide-search"
          :placeholder="categoriaAberta ? `Buscar em ${categoriaAberta}` : 'Buscar em todas as chaves'"
          class="w-full sm:w-80"
        />

        <UButton
          :label="`Traduzir o que falta (${faltamNoTotal.toLocaleString('pt-BR')})`"
          icon="i-lucide-list-checks"
          size="sm"
          :disabled="!faltamNoTotal"
          class="transition-transform hover:-translate-y-0.5"
          @click="abrirFila"
        />

        <UButton
          label="Traduzir com IA"
          icon="i-lucide-sparkles"
          size="sm"
          color="neutral"
          variant="subtle"
          :disabled="!alvoDaIa.length"
          class="transition-transform hover:-translate-y-0.5"
          @click="confirmandoIa = true"
        />

        <div class="ml-auto flex gap-2">
          <UButton
            label="Exportar planilha"
            icon="i-lucide-download"
            size="sm"
            color="neutral"
            variant="ghost"
          />
          <UButton
            label="Importar"
            icon="i-lucide-upload"
            size="sm"
            color="neutral"
            variant="ghost"
          />
        </div>
      </div>

      <template #rodape>
        <p class="text-xs text-muted">
          Este workspace tem {{ totalDeChaves.toLocaleString('pt-BR') }} chaves. Por isso a tela
          abre nas categorias e não numa lista: nenhuma ferramenta de tradução mostra o conjunto
          inteiro de uma vez.
        </p>
      </template>
    </Secao>

    <!-- 2a. AS CATEGORIAS -------------------------------------------- -->
    <Secao
      v-if="!categoriaAberta && !busca.trim()"
      id="categorias"
      :titulo="`Categorias em ${idiomaAtual?.nome}`"
      resumo="Escolha por onde começar. O que tem mais chaves faltando aparece primeiro."
      :doc="documentacao.dicionarios"
      style="animation: entrada .4s ease-out both; animation-delay: 60ms"
    >
      <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-muted">
          {{ categorias.length }} categorias
        </p>
        <div class="flex rounded-lg border border-default p-0.5">
          <button
            v-for="o in ([
              { v: 'faltantes', r: 'O que falta primeiro' },
              { v: 'nome', r: 'Por nome' },
            ] as const)"
            :key="o.v"
            type="button"
            class="rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="ordem === o.v ? 'bg-primary text-inverted' : 'text-muted hover:bg-elevated hover:text-highlighted'"
            :aria-pressed="ordem === o.v"
            @click="ordem = o.v"
          >
            {{ o.r }}
          </button>
        </div>
      </div>

      <ul class="grid gap-2 sm:grid-cols-2">
        <li
          v-for="(c, i) in categoriasComProgresso"
          :key="c.nome"
          :style="`animation: entrada .3s ease-out both; animation-delay: ${Math.min(i * 20, 220)}ms`"
        >
          <button
            type="button"
            class="w-full rounded-lg border border-default px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-accented hover:bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="abrirCategoria(c.nome)"
          >
            <div class="flex items-baseline justify-between gap-3">
              <span class="truncate text-sm font-medium text-highlighted">{{ c.nome }}</span>
              <span class="shrink-0 text-xs tabular-nums text-muted">
                <template v-if="c.faltam">faltam {{ c.faltam.toLocaleString('pt-BR') }}</template>
                <template v-else>completa</template>
              </span>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <UProgress
                :model-value="c.prontas"
                :max="c.total"
                size="xs"
                :color="c.faltam ? 'primary' : 'success'"
                class="flex-1"
              />
              <span class="shrink-0 text-xs tabular-nums text-muted">
                {{ c.prontas.toLocaleString('pt-BR') }}/{{ c.total.toLocaleString('pt-BR') }}
              </span>
            </div>
          </button>
        </li>
      </ul>
    </Secao>

    <!-- 2b. O RECORTE ------------------------------------------------ -->
    <Secao
      v-else
      id="chaves"
      :titulo="categoriaAberta ?? 'Busca em todas as categorias'"
      :resumo="categoriaAberta
        ? 'As chaves desta categoria, 50 por página.'
        : 'O que a busca encontrou. É também a fila de trabalho.'"
      :doc="documentacao.dicionarios"
      style="animation: entrada .4s ease-out both; animation-delay: 60ms"
    >
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <UButton
          label="Todas as categorias"
          icon="i-lucide-arrow-left"
          size="sm"
          color="neutral"
          variant="ghost"
          class="transition-transform hover:-translate-x-0.5"
          @click="voltarParaCategorias"
        />

        <div class="flex rounded-lg border border-default p-0.5">
          <button
            v-for="f in ([
              { v: 'faltam', r: 'Faltam' },
              { v: 'traduzidas', r: 'Traduzidas' },
              { v: 'todas', r: 'Todas' },
            ] as const)"
            :key="f.v"
            type="button"
            class="rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="filtro === f.v ? 'bg-primary text-inverted' : 'text-muted hover:bg-elevated hover:text-highlighted'"
            :aria-pressed="filtro === f.v"
            @click="filtro = f.v"
          >
            {{ f.r }}
          </button>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(quantas, grupo) in contagemPorGrupo"
            :key="grupo"
            type="button"
            class="rounded-full border px-2.5 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :class="gruposAtivos.includes(grupo)
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-default text-muted hover:bg-elevated'"
            :aria-pressed="gruposAtivos.includes(grupo)"
            @click="alternarGrupo(grupo)"
          >
            {{ grupo }} · {{ quantas.toLocaleString('pt-BR') }}
          </button>
        </div>

        <UButton
          :label="`Traduzir estas ${fila.length.toLocaleString('pt-BR')} na fila`"
          icon="i-lucide-list-checks"
          size="sm"
          color="neutral"
          variant="subtle"
          :disabled="!fila.length"
          class="ml-auto transition-transform hover:-translate-y-0.5"
          @click="abrirFila"
        />
      </div>

      <!--
        Os formulários da categoria. No produto, cada um deles repete os campos
        com textos próprios, então escolher o formulário é escolher o trabalho.
      -->
      <div
        v-if="formulariosDoUniverso.length && gruposAtivos.includes('Formulários')"
        class="mb-3 flex flex-wrap items-center gap-1.5"
      >
        <span class="mr-1 text-xs uppercase tracking-wider text-muted">Formulário</span>
        <button
          type="button"
          class="rounded-full border px-2.5 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="!formularioAberto
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-default text-muted hover:bg-elevated'"
          :aria-pressed="!formularioAberto"
          @click="formularioAberto = null"
        >
          Todos
        </button>
        <button
          v-for="f in formulariosDoUniverso"
          :key="f.nome"
          type="button"
          class="rounded-full border px-2.5 py-1 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="formularioAberto === f.nome
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-default text-muted hover:bg-elevated'"
          :aria-pressed="formularioAberto === f.nome"
          @click="formularioAberto = f.nome"
        >
          {{ f.nome }} · {{ f.total.toLocaleString('pt-BR') }}
        </button>
      </div>

      <p class="mb-3 text-sm text-muted">
        <template v-if="recorte.length">
          Mostrando
          <strong class="text-highlighted">
            {{ ((pagina - 1) * POR_PAGINA + 1).toLocaleString('pt-BR') }}
            a {{ Math.min(pagina * POR_PAGINA, recorte.length).toLocaleString('pt-BR') }}
          </strong>
          de {{ recorte.length.toLocaleString('pt-BR') }} chaves.
        </template>
        <template v-else>Nenhuma chave neste recorte.</template>
      </p>

      <ul v-if="visiveis.length" class="divide-y divide-default overflow-hidden rounded-lg border border-default">
        <li
          v-for="chave in visiveis"
          :key="chave.id"
          class="flex flex-col gap-2 px-3 py-2.5 transition-colors hover:bg-elevated/60 sm:flex-row sm:items-center sm:gap-4"
        >
          <div class="flex min-w-0 flex-1 items-center gap-2">
            <UBadge :label="chave.tipo" size="sm" color="neutral" variant="subtle" class="shrink-0" />
            <div class="min-w-0">
              <p class="truncate text-sm text-highlighted" :title="chave.original">
                {{ chave.original }}
              </p>
              <p class="truncate text-xs text-muted" :title="caminhoDaChave(chave)">
                {{ caminhoDaChave(chave) }}
              </p>
            </div>
          </div>

          <div class="flex min-w-0 flex-1 items-center gap-2">
            <UInput
              :model-value="traducoes[chave.id]"
              :placeholder="`Tradução em ${idiomaAtual?.nome}`"
              class="w-full"
              @update:model-value="(v: string | number) => traduzir(chave.id, String(v))"
            />
            <UTooltip text="Sugerir tradução com IA">
              <UButton
                icon="i-lucide-sparkles"
                size="xs"
                color="neutral"
                variant="ghost"
                :loading="traduzindo === chave.id"
                :aria-label="`Sugerir tradução para ${chave.original}`"
                @click="traduzirUma(chave)"
              />
            </UTooltip>
          </div>
        </li>
      </ul>

      <UEmpty
        v-else
        :icon="filtro === 'faltam' ? 'i-lucide-party-popper' : 'i-lucide-search-x'"
        :title="filtro === 'faltam' ? 'Nada falta traduzir aqui' : 'Nenhuma chave neste recorte'"
        :description="filtro === 'faltam'
          ? `Todas as chaves deste recorte já têm texto em ${idiomaAtual?.nome}.`
          : 'Tente outro termo, outro grupo ou outro status.'"
        class="py-10"
      />

      <div v-if="recorte.length > POR_PAGINA" class="mt-4 flex justify-center">
        <UPagination
          v-model:page="pagina"
          :total="recorte.length"
          :items-per-page="POR_PAGINA"
          :sibling-count="1"
        />
      </div>
    </Secao>

    <!-- 3. A FILA ---------------------------------------------------- -->
    <UModal
      v-model:open="naFila"
      :title="`Traduzir para ${idiomaAtual?.nome}`"
      :ui="{ content: 'sm:max-w-2xl' }"
    >
      <template #body>
        <div v-if="atual">
          <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm text-muted">
              Faltam <strong class="text-highlighted">{{ fila.length.toLocaleString('pt-BR') }}</strong>
              <template v-if="categoriaAberta || busca.trim()"> neste recorte</template>
            </p>
            <UBadge
              :label="atual.categoria"
              size="sm"
              color="neutral"
              variant="subtle"
            />
          </div>

          <UProgress :model-value="preenchidasNoTotal" :max="totalDeChaves" size="xs" class="mb-5" />

          <p class="text-xs text-muted">
            {{ caminhoDaChave(atual) }}
            <span class="uppercase tracking-wider"> · {{ atual.tipo }}</span>
          </p>
          <p class="mt-1 text-lg text-highlighted">
            {{ atual.original }}
          </p>

          <div class="mt-4 flex items-center gap-2">
            <UInput
              v-model="rascunho"
              :placeholder="`Escreva em ${idiomaAtual?.nome}`"
              autofocus
              size="lg"
              class="w-full"
              @keydown.enter.prevent="avancar(true)"
            />
            <UTooltip text="Sugerir com IA">
              <UButton
                icon="i-lucide-sparkles"
                size="sm"
                color="neutral"
                variant="subtle"
                aria-label="Sugerir tradução com IA"
                @click="sugerirNaFila"
              />
            </UTooltip>
          </div>

          <p class="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <UKbd value="enter" /> salva e vai para a próxima ·
            <UKbd value="esc" /> sai da fila
          </p>
        </div>

        <UEmpty
          v-else
          icon="i-lucide-party-popper"
          title="Fila vazia"
          :description="`Não falta nenhuma chave em ${idiomaAtual?.nome} neste recorte.`"
          class="py-8"
        />
      </template>

      <template #footer>
        <div class="flex w-full items-center justify-between gap-2">
          <UButton label="Sair da fila" color="neutral" variant="ghost" @click="naFila = false" />
          <span v-if="atual" class="flex gap-2">
            <UButton label="Pular" color="neutral" variant="subtle" @click="avancar(false)" />
            <UButton
              label="Salvar e próxima"
              trailing-icon="i-lucide-arrow-right"
              :disabled="!rascunho.trim()"
              @click="avancar(true)"
            />
          </span>
        </div>
      </template>
    </UModal>

    <!-- IA em massa: o custo antes do clique ------------------------- -->
    <UModal v-model:open="confirmandoIa" title="Traduzir com inteligência artificial">
      <template #body>
        <p class="text-sm text-muted">
          A IA vai traduzir
          <strong class="text-highlighted">{{ alvoDaIa.length.toLocaleString('pt-BR') }} chaves</strong>
          que faltam
          <template v-if="categoriaAberta || busca.trim()">neste recorte</template>
          <template v-else>no workspace inteiro</template>, para {{ idiomaAtual?.nome }}.
        </p>

        <div class="mt-4 rounded-lg border border-default bg-elevated/60 px-3 py-2.5">
          <p class="text-sm text-muted">
            Custo estimado:
            <strong class="text-highlighted">{{ custoDaIa.toLocaleString('pt-BR') }} en-credits</strong>.
            <button
              type="button"
              class="text-primary underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              @click="emit('irPara', 'cobranca')"
            >Ver o saldo</button>
          </p>
        </div>

        <UAlert
          class="mt-4"
          color="warning"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="Revise depois"
          description="Tradução automática erra em termo do seu negócio. Nada é gravado até você usar o Salvar da barra de baixo."
        />
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton label="Cancelar" color="neutral" variant="ghost" @click="confirmandoIa = false" />
          <UButton
            :label="`Traduzir ${alvoDaIa.length.toLocaleString('pt-BR')} chaves`"
            :loading="rodandoIa"
            @click="rodarIaEmMassa"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
