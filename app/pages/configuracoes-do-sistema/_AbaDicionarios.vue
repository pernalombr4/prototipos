<script setup lang="ts">
import Secao from './_Secao.vue'
import {
  chavesDeTraducao,
  chavesNoWorkspaceReal,
  documentacao,
  idiomas,
  sugestoesDeIa,
  type ChaveDeTraducao,
} from './mocks'
import { form } from './estado'

const emit = defineEmits<{ irPara: [aba: string] }>()

const toast = useToast()

/* ------------------------------------------------------------------ *
 * O problema desta aba não é beleza, é volume.
 *
 * Cada campo do workspace carrega até cinco textos traduzíveis (rótulo,
 * ajuda, instrução, exemplo, e um por opção). Três categorias com 17
 * campos já viram 96 chaves; um workspace de verdade passa de 3.000.
 *
 * A árvore de hoje é fiel à estrutura e péssima como plano de trabalho.
 * A proposta é tratar tradução como FILA: filtro por status, busca,
 * cabeçalho que diz onde você está, e Enter que pula para a próxima que
 * falta. O agrupamento continua existindo — como cabeçalho, não como
 * sanfona que some quando você rola.
 * ------------------------------------------------------------------ */

const CUSTO_POR_CHAVE = 0.2

const filtro = ref<'faltam' | 'traduzidas' | 'todas'>('faltam')
const busca = ref('')
const categoria = ref<string>('todas')
const traduzindo = ref<string | null>(null)
const traduzindoTudo = ref(false)

const categorias = computed(() => [
  { label: 'Todas as categorias', value: 'todas' },
  ...[...new Set(chavesDeTraducao.map(c => c.categoria))].map(c => ({ label: c, value: c })),
])

function valor(chave: ChaveDeTraducao) {
  return form.dicionarios.traducoes[chave.id] ?? ''
}

const total = chavesDeTraducao.length

const prontas = computed(() =>
  chavesDeTraducao.filter(c => valor(c).trim().length > 0).length,
)

const visiveis = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  return chavesDeTraducao.filter((c) => {
    if (categoria.value !== 'todas' && c.categoria !== categoria.value) return false
    const preenchida = valor(c).trim().length > 0
    if (filtro.value === 'faltam' && preenchida) return false
    if (filtro.value === 'traduzidas' && !preenchida) return false
    if (!termo) return true
    return (
      c.original.toLowerCase().includes(termo)
      || c.dono.toLowerCase().includes(termo)
      || c.categoria.toLowerCase().includes(termo)
      || valor(c).toLowerCase().includes(termo)
    )
  })
})

/** Agrupa o que está visível por categoria › grupo › dono. */
const grupos = computed(() => {
  const mapa = new Map<string, { categoria: string, grupo: string, dono: string, chaves: ChaveDeTraducao[] }>()
  for (const c of visiveis.value) {
    const id = `${c.categoria}|${c.grupo}|${c.dono}`
    const atual = mapa.get(id) ?? { categoria: c.categoria, grupo: c.grupo, dono: c.dono, chaves: [] }
    atual.chaves.push(c)
    mapa.set(id, atual)
  }
  return [...mapa.values()]
})

const progressoPorCategoria = computed(() =>
  [...new Set(chavesDeTraducao.map(c => c.categoria))].map((nome) => {
    const doGrupo = chavesDeTraducao.filter(c => c.categoria === nome)
    return {
      nome,
      total: doGrupo.length,
      prontas: doGrupo.filter(c => valor(c).trim().length > 0).length,
    }
  }),
)

const faltando = computed(() => total - prontas.value)

const idiomaAtual = computed(() => idiomas.find(i => i.codigo === form.dicionarios.idioma))

/* ------------------------ navegação pela fila ---------------------- */

function focar(id: string) {
  nextTick(() => {
    const campo = document.querySelector<HTMLInputElement>(`[data-chave="${CSS.escape(id)}"] input`)
    campo?.focus()
    campo?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  })
}

function proximaQueFalta(depoisDe?: string) {
  const lista = visiveis.value
  const inicio = depoisDe ? lista.findIndex(c => c.id === depoisDe) + 1 : 0
  const alvo = lista.slice(inicio).find(c => !valor(c).trim()) ?? lista.find(c => !valor(c).trim())
  if (alvo) focar(alvo.id)
}

/* ---------------------------- tradução por IA ----------------------- */

async function traduzirUma(chave: ChaveDeTraducao) {
  traduzindo.value = chave.id
  await new Promise(r => setTimeout(r, 550))
  const sugestao = sugestoesDeIa[chave.original]
  traduzindo.value = null
  if (!sugestao) {
    toast.add({
      title: 'Sem sugestão para esta chave',
      description: 'No protótipo só o vocabulário do exemplo tem tradução pronta.',
      icon: 'i-lucide-sparkles',
      color: 'neutral',
    })
    return
  }
  form.dicionarios.traducoes[chave.id] = sugestao
}

async function traduzirTudoQueFalta() {
  traduzindoTudo.value = true
  const alvo = chavesDeTraducao.filter(c => !valor(c).trim())
  await new Promise(r => setTimeout(r, 1200))
  let feitas = 0
  for (const c of alvo) {
    const sugestao = sugestoesDeIa[c.original]
    if (sugestao) {
      form.dicionarios.traducoes[c.id] = sugestao
      feitas++
    }
  }
  traduzindoTudo.value = false
  toast.add({
    title: `${feitas} chaves traduzidas`,
    description: `${alvo.length - feitas} ficaram sem sugestão e precisam de você. Nada foi gravado ainda.`,
    icon: 'i-lucide-sparkles',
    color: 'neutral',
  })
}

const custoEstimado = computed(() => Math.ceil(faltando.value * CUSTO_POR_CHAVE))
</script>

<template>
  <div class="space-y-5">
    <Secao
      id="traducoes"
      titulo="Dicionários de tradução"
      resumo="Os textos que você criou (categorias, campos, formulários) no idioma de quem lê."
      :doc="documentacao.dicionarios"
      style="animation: entrada .4s ease-out both"
    >
      <!-- idioma + progresso -->
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

        <div class="min-w-56 flex-1 sm:max-w-xs">
          <div class="mb-1 flex items-baseline justify-between text-sm">
            <span class="text-muted">
              <strong class="text-highlighted">{{ prontas }}</strong> de {{ total }} traduzidas
            </span>
            <span class="text-muted">{{ Math.round((prontas / total) * 100) }}%</span>
          </div>
          <UProgress :model-value="prontas" :max="total" size="sm" />
        </div>
      </div>

      <!-- progresso por categoria: o tamanho do trabalho, antes de começar -->
      <div class="mt-4 grid gap-2 sm:grid-cols-3">
        <button
          v-for="p in progressoPorCategoria"
          :key="p.nome"
          type="button"
          class="rounded-lg border px-3 py-2 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="categoria === p.nome ? 'border-primary bg-primary/5' : 'border-default hover:bg-elevated'"
          @click="categoria = categoria === p.nome ? 'todas' : p.nome"
        >
          <div class="flex items-baseline justify-between gap-2">
            <span class="truncate text-sm font-medium text-highlighted">{{ p.nome }}</span>
            <span class="shrink-0 text-xs tabular-nums text-muted">{{ p.prontas }}/{{ p.total }}</span>
          </div>
          <UProgress
            :model-value="p.prontas"
            :max="p.total"
            size="xs"
            class="mt-2"
            :color="p.prontas === p.total ? 'success' : 'primary'"
          />
        </button>
      </div>
    </Secao>

    <!-- a fila de trabalho -->
    <Secao
      id="fila"
      :titulo="`Chaves em ${idiomaAtual?.nome}`"
      resumo="Filtre pelo que falta, traduza, e o Enter leva para a próxima."
      :doc="documentacao.dicionarios"
      style="animation: entrada .4s ease-out both; animation-delay: 60ms"
    >
      <!-- barra de trabalho: fica grudada no topo enquanto se rola -->
      <div
        class="sticky top-2 z-10 -mx-5 mb-4 flex flex-wrap items-center gap-2 border-b border-default bg-default/95 px-5 pb-3 backdrop-blur"
      >
        <div class="flex rounded-lg border border-default p-0.5">
          <button
            v-for="f in ([
              { v: 'faltam', r: `Faltam ${faltando}` },
              { v: 'traduzidas', r: `Traduzidas ${prontas}` },
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

        <UInput
          v-model="busca"
          icon="i-lucide-search"
          placeholder="Buscar no texto original ou na tradução"
          class="w-full sm:w-72"
        />

        <USelect v-model="categoria" :items="categorias" class="w-full sm:w-52" />

        <div class="ml-auto flex items-center gap-2">
          <UButton
            label="Próxima que falta"
            icon="i-lucide-corner-down-right"
            size="sm"
            color="neutral"
            variant="ghost"
            :disabled="!faltando"
            class="transition-transform hover:-translate-y-0.5"
            @click="proximaQueFalta()"
          />
          <UButton
            :label="`Traduzir com IA (${faltando})`"
            icon="i-lucide-sparkles"
            size="sm"
            variant="subtle"
            :disabled="!faltando"
            :loading="traduzindoTudo"
            class="transition-transform hover:-translate-y-0.5"
            @click="traduzirTudoQueFalta"
          />
        </div>
      </div>

      <p v-if="faltando" class="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-wallet" class="size-3.5" />
        Traduzir as {{ faltando }} que faltam custa cerca de {{ custoEstimado }} en-credits.
        <button
          type="button"
          class="text-primary underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          @click="emit('irPara', 'cobranca')"
        >
          Ver o saldo
        </button>
      </p>

      <!-- a lista -->
      <div v-if="grupos.length" class="space-y-5">
        <div v-for="g in grupos" :key="`${g.categoria}|${g.grupo}|${g.dono}`">
          <div class="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <span class="font-semibold uppercase tracking-wider text-muted">{{ g.categoria }}</span>
            <UIcon name="i-lucide-chevron-right" class="size-3 text-muted" />
            <span class="text-muted">{{ g.grupo }}</span>
            <template v-if="g.dono">
              <UIcon name="i-lucide-chevron-right" class="size-3 text-muted" />
              <span class="font-medium text-highlighted">{{ g.dono }}</span>
            </template>
          </div>

          <ul class="divide-y divide-default overflow-hidden rounded-lg border border-default">
            <li
              v-for="(c, i) in g.chaves"
              :key="c.id"
              :data-chave="c.id"
              class="flex flex-col gap-2 px-3 py-2.5 transition-colors hover:bg-elevated/60 sm:flex-row sm:items-center sm:gap-4"
              :style="`animation: entrada .3s ease-out both; animation-delay: ${Math.min(i * 25, 200)}ms`"
            >
              <div class="flex min-w-0 flex-1 items-center gap-2">
                <UBadge :label="c.tipo" size="sm" color="neutral" variant="subtle" class="shrink-0" />
                <span class="truncate text-sm text-highlighted" :title="c.original">
                  {{ c.original }}
                </span>
              </div>

              <div class="flex min-w-0 flex-1 items-center gap-2">
                <UInput
                  :model-value="form.dicionarios.traducoes[c.id]"
                  :placeholder="`Tradução em ${idiomaAtual?.nome}`"
                  class="w-full"
                  :ui="{ base: valor(c).trim() ? '' : 'ring-warning/40' }"
                  @update:model-value="(v: string | number) => form.dicionarios.traducoes[c.id] = String(v)"
                  @keydown.enter.prevent="proximaQueFalta(c.id)"
                />
                <UTooltip text="Sugerir tradução com IA">
                  <UButton
                    icon="i-lucide-sparkles"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    :loading="traduzindo === c.id"
                    :aria-label="`Sugerir tradução para ${c.original}`"
                    @click="traduzirUma(c)"
                  />
                </UTooltip>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <UEmpty
        v-else
        :icon="filtro === 'faltam' ? 'i-lucide-party-popper' : 'i-lucide-search-x'"
        :title="filtro === 'faltam' ? 'Nada falta traduzir aqui' : 'Nenhuma chave com esse filtro'"
        :description="filtro === 'faltam'
          ? `Todas as chaves deste recorte já têm texto em ${idiomaAtual?.nome}.`
          : 'Tente outro termo, outra categoria, ou veja todas as chaves.'"
        class="py-10"
      />

      <template #rodape>
        <p class="text-xs text-muted">
          Este exemplo tem {{ total }} chaves. Um workspace configurado passa de
          {{ chavesNoWorkspaceReal.toLocaleString('pt-BR') }}. Por isso a tela é uma fila com
          filtro, e não uma árvore para abrir nó por nó.
        </p>
      </template>
    </Secao>
  </div>
</template>
