<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): a grade sempre livre. Quem edita o dashboard arrasta e
 * redimensiona os painéis a qualquer hora, sem entrar em "Personalizar".
 *
 * Por que não o `EnDashboardCanvas` do SDK 0.21: no modo de edição ele deixa o
 * conteúdo `inert` e cobre o painel com uma camada de arraste, então o gráfico para de
 * responder a clique e a dica. É um modo, e o pedido é não ter modo. A grade aqui usa
 * o gridstack 14.1.0, a mesma biblioteca e versão que o SDK usa por baixo:
 * - arrastar pela alça que aparece no topo do painel ao passar o mouse;
 * - redimensionar pelo canto inferior direito;
 * - o conteúdo continua clicável o tempo todo;
 * - abaixo de 768 px, 1 coluna, sem arraste.
 * Para o dev: o caminho é o SDK ganhar esse modo no `EnDashboardCanvas` (alça no
 * cabeçalho, sem `inert`), e não cada tela montar a própria grade.
 *
 * O arranjo grava na configuração do painel (x, y, w, h). No protótipo fica na memória.
 */
import 'gridstack/dist/gridstack.min.css'
import type { GridStack, GridStackNode } from 'gridstack'
import type { ConfigDoPainel, FiltroDeCampo, Grupo, Resultado } from './agregacao'
import type { Dashboard } from './dashboards'
import type { Textos } from './textos'
import PainelDoDashboard from './_PainelDoDashboard.vue'

const props = defineProps<{
  t: Textos
  dashboard: Dashboard
  resultados: Record<string, Resultado>
  series: Record<string, number[] | undefined>
  estadoDe: (id: string) => 'pronto' | 'carregando' | 'erro'
  somenteLeitura: boolean
  rotuloDoPeriodo: string
  filtrosDoDashboard: FiltroDeCampo[]
  filtrosDaVisao: Record<string, FiltroDeCampo[]>
}>()

const emit = defineEmits<{
  editar: [cfg: ConfigDoPainel]
  duplicar: [cfg: ConfigDoPainel]
  excluir: [cfg: ConfigDoPainel]
  csv: [cfg: ConfigDoPainel]
  tentar: [cfg: ConfigDoPainel]
  detalhar: [cfg: ConfigDoPainel, grupo?: Grupo, parte?: string]
  filtrosDaVisao: [id: string, filtros: FiltroDeCampo[]]
}>()

const ALTURA_DA_LINHA = 80
const VAO = 16

const host = ref<HTMLElement>()
let grade: GridStack | undefined

/** Grava a posição de volta na configuração, depois de arrastar ou redimensionar. */
function gravar(nos: GridStackNode[]) {
  for (const n of nos) {
    const p = props.dashboard.paineis.find(x => x.id === n.id)
    if (!p) continue
    p.x = n.x
    p.y = n.y
    if (n.w) p.w = n.w
    if (n.h) p.h = n.h
  }
}

onMounted(async () => {
  const { GridStack } = await import('gridstack')
  if (!host.value) return
  grade = GridStack.init({
    column: 12,
    cellHeight: ALTURA_DA_LINHA,
    margin: VAO / 2,
    float: false,
    animate: true,
    handle: '.alca-do-painel',
    resizable: { handles: 'se' },
    disableDrag: props.somenteLeitura,
    disableResize: props.somenteLeitura,
    columnOpts: { breakpoints: [{ w: 768, c: 1 }] },
  }, host.value)
  grade.on('change', (_e, nos) => gravar(nos as GridStackNode[]))
  gravar(grade.engine.nodes)
})

onBeforeUnmount(() => {
  grade?.destroy(false)
  grade = undefined
})

watch(() => props.somenteLeitura, (s) => {
  grade?.enableMove(!s)
  grade?.enableResize(!s)
})

/* Painel novo entra na grade; painel excluído sai, sem mexer nos outros. */
watch(() => props.dashboard.paineis.map(p => p.id), async (agora, antes) => {
  if (!grade || !host.value) return
  const saiu = antes.filter(id => !agora.includes(id))
  for (const id of saiu) {
    const el = grade.engine.nodes.find(n => n.id === id)?.el
    if (el) grade.removeWidget(el, false)
  }
  await nextTick()
  const entrou = agora.filter(id => !antes.includes(id))
  for (const id of entrou) {
    const el = host.value.querySelector<HTMLElement>(`[gs-id="${id}"]`)
    if (el) grade.makeWidget(el)
  }
  gravar(grade.engine.nodes)
})

/** Altura útil do painel em px, para o gráfico acompanhar o redimensionamento. */
const alturaDe = (p: ConfigDoPainel) => p.h * ALTURA_DA_LINHA - VAO
</script>

<template>
  <div ref="host" class="grid-stack -mx-2 max-md:[&_.ui-resizable-handle]:hidden">
    <div
      v-for="p in dashboard.paineis"
      :key="p.id"
      class="grid-stack-item"
      :gs-id="p.id"
      :gs-x="p.x"
      :gs-y="p.y"
      :gs-w="p.w"
      :gs-h="p.h"
      :gs-min-w="2"
      :gs-min-h="2"
      :gs-auto-position="p.x === undefined ? 'true' : undefined"
    >
      <div class="grid-stack-item-content group/painel">
        <!-- A alça de arraste: aparece ao passar o mouse ou com o foco no painel -->
        <button
          v-if="!somenteLeitura"
          type="button"
          class="alca-do-painel absolute left-1/2 top-0.5 z-10 flex h-4 w-10 -translate-x-1/2 cursor-grab items-center justify-center rounded-md text-dimmed opacity-0 transition-opacity hover:bg-elevated hover:text-toned focus-visible:opacity-100 active:cursor-grabbing group-hover/painel:opacity-100 group-focus-within/painel:opacity-100 max-md:hidden"
          :aria-label="t.painel.arrastar"
          :title="t.painel.arrastar"
        >
          <UIcon name="i-lucide-grip-horizontal" class="size-4" />
        </button>
        <PainelDoDashboard
          :t="t"
          :cfg="p"
          :resultado="resultados[p.id]!"
          :serie="series[p.id]"
          :estado="estadoDe(p.id)"
          :altura="alturaDe(p)"
          :somente-leitura="somenteLeitura"
          :rotulo-do-periodo="rotuloDoPeriodo"
          :filtros-do-dashboard="filtrosDoDashboard"
          :filtros-da-visao="filtrosDaVisao[p.id] ?? []"
          @update:filtros-da-visao="(f: FiltroDeCampo[]) => emit('filtrosDaVisao', p.id, f)"
          @editar="emit('editar', p)"
          @duplicar="emit('duplicar', p)"
          @excluir="emit('excluir', p)"
          @csv="emit('csv', p)"
          @tentar="emit('tentar', p)"
          @detalhar="(g?: Grupo, parte?: string) => emit('detalhar', p, g, parte)"
        />
      </div>
    </div>
  </div>
</template>
