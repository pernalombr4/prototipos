<script setup lang="ts">
/**
 * PROPOSTA (rodada 3): a aba Painel do projeto.
 *
 * Primeiro o que cabe hoje: 1 widget por categoria do projeto (no código, o widget guarda a
 * própria categoria e o painel aceita widgets de categorias diferentes). Cada widget tem 1
 * visualização (memória "painel de dashboard enxuto").
 * Depois, marcado como peça nova de back-end: o widget que soma as categorias do projeto
 * (Itens em aberto por responsável). Hoje a soma roda no navegador sobre os itens baixados.
 */
import type { Textos } from './textos'
import { camposDaCategoria, iniciais, itensDoProjeto, pessoa, type GrupoDeStatus } from './mocks'
import { useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const { marca, marcaBack } = useMarcaDeProposta()
const toast = useToast()

const p = computed(() => prj.projetos.value.find(x => x.id === props.id)!)
const admin = computed(() => prj.podeAdministrar(p.value))
const categorias = computed(() => prj.categoriasDe(props.id).filter(c => prj.veCategoria(c)))

/** Barra de cada grupo: classe estática, o Tailwind não lê classe montada. */
const BARRA: Record<GrupoDeStatus, string> = { aberto: 'bg-accented', andamento: 'bg-info', concluido: 'bg-success' }
/** Fictício: a parte de cada valor do status no total de itens da categoria. */
const PESOS = [0.14, 0.22, 0.17, 0.47]

const widgets = computed(() => categorias.value.map((c) => {
  const campos = camposDaCategoria[prj.camposDe(c)]
  const valores = campos?.valores ?? []
  const soma = PESOS.slice(0, valores.length).reduce((a, b) => a + b, 0) || 1
  const barras = valores.map((v, i) => ({ ...v, n: Math.round(c.itens * (PESOS[i] ?? 0) / soma) }))
  const maior = Math.max(1, ...barras.map(b => b.n))
  return { c, barras, maior }
}))

/** O widget que soma as categorias (peça nova): itens em aberto por responsável. */
const porResponsavel = computed(() => {
  const ids = new Set(categorias.value.map(c => c.id))
  const conta = new Map<number, number>()
  for (const i of itensDoProjeto.filter(x => ids.has(x.categoria))) {
    const m = prj.mapas.value[i.categoria]
    if (!m?.responsavel) continue
    const status = m.status ? String(i.campos[m.status] ?? '') : ''
    if (m.grupos[status] === 'concluido') continue
    const quem = Number(i.campos[m.responsavel])
    if (quem) conta.set(quem, (conta.get(quem) ?? 0) + 1)
  }
  const lista = [...conta.entries()].map(([id, n]) => ({ id, n })).sort((a, b) => b.n - a.n)
  return { lista, maior: Math.max(1, ...lista.map(x => x.n)) }
})

const editar = () => toast.add({ title: props.t.casca.maquete, icon: 'i-lucide-info', color: 'neutral' })
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-2 pb-3">
      <p class="flex flex-1 items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-chart-column" class="size-4 shrink-0" />{{ t.painelProjeto.texto }}</p>
      <UButton v-if="admin && categorias.length" :label="t.painelProjeto.editar" icon="i-lucide-pencil" size="sm" color="neutral" variant="outline" @click="editar" />
    </div>

    <div v-if="!categorias.length" class="flex flex-col items-center gap-2 rounded-lg border border-dashed border-default px-6 py-12 text-center">
      <UIcon name="i-lucide-chart-column" class="size-7 text-muted" />
      <p class="max-w-sm text-sm text-muted">{{ t.painelProjeto.semCategorias }}</p>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <section
        v-for="(w, i) in widgets"
        :key="w.c.id"
        class="rounded-lg border border-default bg-default animate-[entrada_0.25s_ease-out_both]"
        :class="marca"
        :style="{ animationDelay: `${i * 50}ms` }"
      >
        <header class="flex items-start gap-2 border-b border-default px-4 py-3">
          <UIcon :name="w.c.icon ?? 'i-lucide-folder'" class="mt-0.5 size-4 shrink-0 text-muted" />
          <div class="min-w-0 flex-1">
            <h3 class="truncate text-sm font-semibold text-highlighted">{{ t.painelProjeto.porStatus }}</h3>
            <p class="truncate text-xs text-muted">{{ w.c.name }} · {{ t.painelProjeto.itens(w.c.itens) }}</p>
          </div>
        </header>
        <ul v-if="w.c.itens" class="space-y-2.5 px-4 py-3">
          <li v-for="b in w.barras" :key="b.valor">
            <div class="flex items-baseline justify-between gap-2 text-xs">
              <span class="truncate text-toned">{{ b.valor }}</span>
              <span class="tabular-nums text-muted">{{ b.n.toLocaleString() }}</span>
            </div>
            <div class="mt-1 h-2 overflow-hidden rounded-full bg-elevated">
              <div class="h-full rounded-full transition-[width] duration-500 ease-out" :class="BARRA[b.grupo]" :style="{ width: `${(b.n / w.maior) * 100}%` }" />
            </div>
          </li>
        </ul>
        <p v-else class="px-4 py-8 text-center text-sm text-muted">{{ t.painelProjeto.semItens }}</p>
      </section>

      <!-- peça nova: o widget que soma as categorias -->
      <section class="rounded-lg border border-default bg-default animate-[entrada_0.25s_ease-out_both]" :class="[marca, marcaBack]" :style="{ animationDelay: `${widgets.length * 50}ms` }">
        <header class="flex items-start gap-2 border-b border-default px-4 py-3">
          <UIcon name="i-lucide-layers" class="mt-0.5 size-4 shrink-0 text-muted" />
          <div class="min-w-0 flex-1">
            <h3 class="truncate text-sm font-semibold text-highlighted">{{ t.painelProjeto.abertosPorResponsavel }}</h3>
            <p class="truncate text-xs text-muted">{{ t.painelProjeto.todasAsCategorias }}</p>
          </div>
          <UTooltip :text="t.painelProjeto.somaDica">
            <UIcon name="i-lucide-info" class="size-4 shrink-0 text-muted" :aria-label="t.painelProjeto.somaDica" />
          </UTooltip>
        </header>
        <ul v-if="porResponsavel.lista.length" class="space-y-2.5 px-4 py-3">
          <li v-for="x in porResponsavel.lista" :key="x.id" class="flex items-center gap-2">
            <UAvatar size="2xs" :text="iniciais(pessoa(x.id)?.nome ?? '')" :alt="pessoa(x.id)?.nome" />
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline justify-between gap-2 text-xs">
                <span class="truncate text-toned">{{ pessoa(x.id)?.nome }}</span>
                <span class="tabular-nums text-muted">{{ x.n }}</span>
              </div>
              <div class="mt-1 h-2 overflow-hidden rounded-full bg-elevated">
                <div class="h-full rounded-full bg-primary transition-[width] duration-500 ease-out" :style="{ width: `${(x.n / porResponsavel.maior) * 100}%` }" />
              </div>
            </div>
          </li>
        </ul>
        <p v-else class="px-4 py-8 text-center text-sm text-muted">{{ t.painelProjeto.semItens }}</p>
      </section>
    </div>
  </div>
</template>
