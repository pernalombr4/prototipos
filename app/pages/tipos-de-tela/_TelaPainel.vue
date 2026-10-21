<script setup lang="ts">
/**
 * TIPO DE MENU "PAINEL".
 *
 * Continua o tipo Painéis, com front novo e 4 funções que hoje faltam:
 *   1. filtro do painel (período, categoria, responsável) que vale para todo
 *      widget compatível, e filtro de cada widget por cima dele;
 *   2. drill-down: clicar no número ou na barra abre os itens na tabela nova;
 *   3. o widget diz quando o filtro do painel não vale para ele;
 *   4. a edição num painel lateral de 1 nível, com prévia ao vivo (hoje são
 *      4 níveis: página, modal, aba e modal sobre modal, N5).
 *
 * Os gráficos são barras de Tailwind sobre botões: cada barra recebe foco e
 * abre a lista pelo teclado. Não há biblioteca de gráfico (regra 3).
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import { HOJE, categorias, categoriaPorSlug, diasAte, itens, membroPorId, membros, type ItemDoPrototipo, type SlugDaCategoria, type StatusDoItem } from './mocks'
import { dataCurta, mesCurto, moeda, numero } from './formatar'
import { esperar, useTiposDeTela } from './estado'
import CabecalhoDaTela from './_CabecalhoDaTela.vue'
import EstadoDaTela from './_EstadoDaTela.vue'
import VisaoRapida from './_VisaoRapida.vue'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ tentarDeNovo: [], abrirLista: [] }>()

const { cenario } = useTiposDeTela()
const idioma = useIdioma()
const toast = useToast()

type Periodo = 'ano' | 'trimestre' | 'd30' | 'tudo'
const periodo = ref<Periodo>('ano')
const categoria = ref<SlugDaCategoria | 'todas'>('todas')
const responsavel = ref<number | 'todos'>('todos')

/** Filtro de cada widget, por cima do filtro do painel. */
const filtroDoWidget = ref<Record<string, SlugDaCategoria | null>>({ porStatus: null })

const temFiltro = computed(() => periodo.value !== 'ano' || categoria.value !== 'todas' || responsavel.value !== 'todos')
function limpar() {
  periodo.value = 'ano'
  categoria.value = 'todas'
  responsavel.value = 'todos'
}

function noPeriodo(i: ItemDoPrototipo) {
  const dias = (HOJE.getTime() - i.created_at.getTime()) / 86_400_000
  if (periodo.value === 'ano') return i.created_at.getFullYear() === HOJE.getFullYear()
  if (periodo.value === 'trimestre') return dias <= 92
  if (periodo.value === 'd30') return dias <= 30
  return true
}

function doPainel(i: ItemDoPrototipo, ignorarCategoria = false) {
  return noPeriodo(i)
    && (ignorarCategoria || categoria.value === 'todas' || i.categoria === categoria.value)
    && (responsavel.value === 'todos' || i.responsavel === responsavel.value)
}

const noFiltro = computed(() => itens.filter(i => doPainel(i)))
const abertos = computed(() => noFiltro.value.filter(i => i.situacao !== 'concluido' && i.situacao !== 'cancelado'))
const concluidos = computed(() => noFiltro.value.filter(i => i.situacao === 'concluido'))
const vencidos = computed(() => noFiltro.value.filter(i => i.vencimento && diasAte(i.vencimento) < 0 && i.situacao !== 'concluido'))
const valorAberto = computed(() => abertos.value.filter(i => i.categoria === 'contratos').reduce((s, i) => s + (i.valor ?? 0), 0))

const status: StatusDoItem[] = ['novo', 'em_andamento', 'aguardando', 'concluido', 'cancelado']
const corDaBarra: Record<StatusDoItem, string> = { novo: 'bg-info', em_andamento: 'bg-primary', aguardando: 'bg-warning', concluido: 'bg-success', cancelado: 'bg-accented' }

const porStatus = computed(() => {
  const local = filtroDoWidget.value.porStatus
  const base = local ? noFiltro.value.filter(i => i.categoria === local) : noFiltro.value
  const linhas = status.map(s => ({ s, n: base.filter(i => i.situacao === s).length, itens: base.filter(i => i.situacao === s) }))
  const maior = Math.max(1, ...linhas.map(l => l.n))
  return linhas.map(l => ({ ...l, pct: (l.n / maior) * 100 }))
})

/** Chamados de TI por status: ignora o filtro de categoria do painel, e diz isso. */
const chamados = computed(() => {
  const base = itens.filter(i => i.categoria === 'chamados-ti' && doPainel(i, true))
  return status.map(s => ({ s, n: base.filter(i => i.situacao === s).length, itens: base.filter(i => i.situacao === s) })).filter(l => l.n)
})
const totalChamados = computed(() => chamados.value.reduce((s, l) => s + l.n, 0))

const porMes = computed(() => {
  const meses = Array.from({ length: 10 }, (_, m) => m)
  const base = noFiltro.value.filter(i => i.created_at.getFullYear() === HOJE.getFullYear())
  const linhas = meses.map(m => ({ m, itens: base.filter(i => i.created_at.getMonth() === m) }))
  const maior = Math.max(1, ...linhas.map(l => l.itens.length))
  return linhas.map(l => ({ ...l, n: l.itens.length, pct: (l.itens.length / maior) * 100 }))
})

const vencendo = computed(() => noFiltro.value
  .filter(i => i.vencimento && diasAte(i.vencimento) >= 0 && diasAte(i.vencimento) <= 30)
  .sort((a, b) => a.vencimento!.getTime() - b.vencimento!.getTime()))

const opcoesDePeriodo = computed(() => (Object.keys(props.t.painel.periodos) as Periodo[]).map(p => ({ label: props.t.painel.periodos[p], value: p })))
const opcoesDeCategoria = computed(() => [{ label: props.t.painel.todasCategorias, value: 'todas' }, ...categorias.map(c => ({ label: c.name, value: c.slug }))])
const opcoesDeResponsavel = computed(() => [{ label: props.t.painel.todos, value: 'todos' as const }, ...membros.map(m => ({ label: m.nome, value: m.id }))])

/* ---------------- drill-down ---------------- */

const drill = ref<{ rotulo: string, itens: ItemDoPrototipo[] } | null>(null)
const drillAberto = computed({ get: () => !!drill.value, set: (v) => { if (!v) drill.value = null } })
const itemAberto = ref<ItemDoPrototipo | null>(null)

function abrir(rotulo: string, lista: ItemDoPrototipo[]) {
  if (!lista.length) return
  drill.value = { rotulo, itens: lista }
}

interface LinhaDrill extends Record<string, unknown> {
  id: number
  reference: string
  titulo: string
  categoria: string
  status: StatusDoItem
  responsavel: string
  item: ItemDoPrototipo
}
const linhasDrill = computed<LinhaDrill[]>(() => (drill.value?.itens ?? []).slice(0, 50).map(i => ({
  id: i.id,
  reference: i.reference,
  titulo: i.titulo,
  categoria: categoriaPorSlug(i.categoria).name,
  status: i.situacao,
  responsavel: membroPorId(i.responsavel)?.nome ?? props.t.comum.ninguem,
  item: i,
})))
const colunasDrill = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.lista.colunas.referencia },
  { key: 'titulo', label: props.t.lista.colunas.titulo },
  { key: 'status', label: props.t.lista.colunas.status },
  { key: 'responsavel', label: props.t.lista.colunas.responsavel },
])
const corDoStatus = { novo: 'info', em_andamento: 'primary', aguardando: 'warning', concluido: 'success', cancelado: 'neutral' } as const

/* ---------------- edição em 1 nível ---------------- */

const editando = ref(false)
const visiveis = ref<Record<string, boolean>>({ numeros: true, porStatus: true, porMes: true, vencendo: true, chamados: true })
const aplicando = ref(false)
async function aplicar() {
  aplicando.value = true
  await esperar(600)
  aplicando.value = false
  editando.value = false
  toast.add({ title: props.t.painel.editarAplicado, icon: 'i-lucide-check', color: 'success' })
}

const numeros = computed(() => [
  { chave: 'abertos', rotulo: props.t.painel.widgets.abertos, valor: numero(abertos.value.length, idioma.value), itens: abertos.value, icone: 'i-lucide-circle-dot', cor: 'text-primary' },
  { chave: 'concluidos', rotulo: props.t.painel.widgets.concluidos, valor: numero(concluidos.value.length, idioma.value), itens: concluidos.value, icone: 'i-lucide-circle-check', cor: 'text-success' },
  { chave: 'atrasados', rotulo: props.t.painel.widgets.atrasados, valor: numero(vencidos.value.length, idioma.value), itens: vencidos.value, icone: 'i-lucide-alarm-clock-off', cor: 'text-error' },
  { chave: 'valor', rotulo: props.t.painel.widgets.valorVigente, valor: moeda(valorAberto.value, idioma.value), itens: abertos.value.filter(i => i.categoria === 'contratos'), icone: 'i-lucide-banknote', cor: 'text-warning' },
])
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <CabecalhoDaTela
      icone="i-lucide-chart-column"
      :titulo="t.painel.titulo"
      :descricao="t.painel.descricao"
      :substitui="['Painéis']"
      onde="Tipo de menu, criado em Interface > Menus. Excluir o menu pede confirmação (menu-lateral, rodada 34)."
    >
      <template #acoes>
        <UButton :label="t.painel.editar" icon="i-lucide-pencil" color="neutral" variant="outline" size="sm" @click="editando = true" />
      </template>
    </CabecalhoDaTela>

    <EstadoDaTela :t="t" :cenario="cenario" forma="painel" @tentar-de-novo="emit('tentarDeNovo')">
      <template #vazio>
        <UEmpty icon="i-lucide-chart-column" :title="t.painel.vazioTitulo" :description="t.painel.vazioTexto" :actions="[{ label: t.painel.vazioAcao, icon: 'i-lucide-layout-grid', color: 'neutral', variant: 'outline' }]" />
      </template>

      <!-- Filtro do painel -->
      <div class="flex flex-wrap items-center gap-3 border-b border-default px-6 py-3">
        <span class="flex items-center gap-1.5 text-xs font-medium text-muted"><UIcon name="i-lucide-sliders-horizontal" class="size-3.5" />{{ t.painel.filtroDoPainel }}</span>
        <USelect v-model="periodo" :items="opcoesDePeriodo" size="sm" icon="i-lucide-calendar" class="w-44" :aria-label="t.painel.periodo" />
        <USelect v-model="categoria" :items="opcoesDeCategoria" size="sm" icon="i-lucide-layout-grid" class="w-52" :aria-label="t.painel.categoria" />
        <USelectMenu v-model="responsavel" :items="opcoesDeResponsavel" value-key="value" size="sm" icon="i-lucide-user-round" class="w-52" :aria-label="t.painel.responsavel" />
        <UButton v-if="temFiltro" :label="t.painel.limparFiltros" icon="i-lucide-x" color="neutral" variant="ghost" size="sm" @click="limpar" />
      </div>

      <div class="min-h-0 flex-1 overflow-auto p-6 pb-24">
        <TransitionGroup tag="div" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4" appear enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-2">
          <!-- Números: clicar abre os itens -->
          <template v-if="visiveis.numeros">
            <button
              v-for="(n, i) in numeros"
              :key="n.chave"
              type="button"
              class="group rounded-lg border border-default bg-default p-4 text-left transition hover:-translate-y-0.5 hover:border-accented hover:shadow-sm focus-visible:outline-2 focus-visible:outline-primary"
              :style="{ transitionDelay: `${i * 40}ms` }"
              @click="abrir(n.rotulo, n.itens)"
            >
              <span class="flex items-center justify-between text-xs text-muted">
                {{ n.rotulo }}
                <UIcon :name="n.icone" class="size-4" :class="n.cor" />
              </span>
              <span class="mt-2 block text-2xl font-semibold tabular-nums text-highlighted">{{ n.valor }}</span>
              <span class="mt-1 flex items-center gap-1 text-xs text-muted opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                {{ t.painel.verItens }} <UIcon name="i-lucide-arrow-right" class="size-3" />
              </span>
            </button>
          </template>

          <!-- Itens por status, com filtro do widget -->
          <section v-if="visiveis.porStatus" key="porStatus" class="rounded-lg border border-default bg-default p-4 md:col-span-2">
            <header class="mb-3 flex items-center gap-2">
              <h2 class="flex-1 text-sm font-medium text-highlighted">{{ t.painel.widgets.porStatus }}</h2>
              <UDropdownMenu
                :items="[[...categorias.map(c => ({ label: c.name, icon: c.icon, onSelect: () => (filtroDoWidget.porStatus = c.slug as SlugDaCategoria) })), ...(filtroDoWidget.porStatus ? [{ label: t.painel.tirarFiltroWidget, icon: 'i-lucide-x', onSelect: () => (filtroDoWidget.porStatus = null) }] : [])]]"
                :content="{ align: 'end' }"
              >
                <UButton icon="i-lucide-filter" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.filtrarWidget" />
              </UDropdownMenu>
            </header>
            <UBadge v-if="filtroDoWidget.porStatus" :label="t.painel.filtroDoWidget(categoriaPorSlug(filtroDoWidget.porStatus).name)" color="primary" variant="soft" size="sm" class="mb-3" />
            <ul class="space-y-2">
              <li v-for="l in porStatus" :key="l.s">
                <button
                  type="button"
                  class="group flex w-full items-center gap-3 rounded-md px-1 py-1 text-left transition hover:bg-elevated disabled:cursor-default disabled:hover:bg-transparent"
                  :disabled="!l.n"
                  @click="abrir(t.status[l.s], l.itens)"
                >
                  <span class="w-28 shrink-0 truncate text-xs text-toned">{{ t.status[l.s] }}</span>
                  <span class="h-5 flex-1 overflow-hidden rounded bg-elevated">
                    <span class="block h-full rounded transition-[width] duration-500 ease-out" :class="corDaBarra[l.s]" :style="{ width: `${l.pct}%` }" />
                  </span>
                  <span class="w-8 shrink-0 text-right text-xs font-medium tabular-nums text-highlighted">{{ l.n }}</span>
                </button>
              </li>
            </ul>
          </section>

          <!-- Criados por mês -->
          <section v-if="visiveis.porMes" key="porMes" class="rounded-lg border border-default bg-default p-4 md:col-span-2">
            <h2 class="mb-3 text-sm font-medium text-highlighted">{{ t.painel.widgets.porMes }}</h2>
            <div class="flex h-44 items-end gap-2">
              <button
                v-for="m in porMes"
                :key="m.m"
                type="button"
                class="group flex h-full flex-1 flex-col items-center justify-end gap-1 disabled:cursor-default"
                :disabled="!m.n"
                :aria-label="`${mesCurto(m.m, idioma)}: ${m.n}`"
                @click="abrir(mesCurto(m.m, idioma), m.itens)"
              >
                <span class="text-[11px] font-medium tabular-nums text-toned">{{ m.n || '' }}</span>
                <span class="w-full rounded-t bg-primary/70 transition-[height] duration-500 ease-out group-hover:bg-primary group-focus-visible:bg-primary" :style="{ height: `${Math.max(m.pct, m.n ? 4 : 1)}%` }" />
                <span class="text-[11px] text-muted">{{ mesCurto(m.m, idioma) }}</span>
              </button>
            </div>
          </section>

          <!-- Contratos que vencem em 30 dias -->
          <section v-if="visiveis.vencendo" key="vencendo" class="rounded-lg border border-default bg-default p-4 md:col-span-2">
            <header class="mb-2 flex items-center gap-2">
              <h2 class="flex-1 text-sm font-medium text-highlighted">{{ t.painel.widgets.vencendo }}</h2>
              <UButton v-if="vencendo.length" :label="t.painel.verItens" color="neutral" variant="link" size="xs" @click="abrir(t.painel.widgets.vencendo, vencendo)" />
            </header>
            <p v-if="!vencendo.length" class="py-6 text-center text-sm text-muted">{{ t.painel.nenhumNoPeriodo }}</p>
            <ul v-else class="divide-y divide-default">
              <li v-for="i in vencendo.slice(0, 5)" :key="i.id">
                <button type="button" class="flex w-full items-center gap-3 py-2 text-left transition hover:bg-elevated/60" @click="itemAberto = i">
                  <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ i.reference }}</UBadge>
                  <span class="min-w-0 flex-1 truncate text-sm text-toned">{{ i.titulo }}</span>
                  <span class="text-xs tabular-nums text-muted">{{ dataCurta(i.vencimento, idioma) }}</span>
                </button>
              </li>
            </ul>
          </section>

          <!-- Chamados: o widget que não segue o filtro de categoria -->
          <section v-if="visiveis.chamados" key="chamados" class="rounded-lg border border-default bg-default p-4 md:col-span-2">
            <h2 class="text-sm font-medium text-highlighted">{{ t.painel.widgets.porCategoria }}</h2>
            <p v-if="categoria !== 'todas'" class="mt-1 flex items-start gap-1.5 text-xs text-muted">
              <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />{{ t.painel.ignoraCategoria }}
            </p>
            <div class="mt-4 flex h-6 overflow-hidden rounded-md bg-elevated">
              <button
                v-for="l in chamados"
                :key="l.s"
                type="button"
                class="h-full transition-[width,filter] duration-500 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-primary"
                :class="corDaBarra[l.s]"
                :style="{ width: `${(l.n / Math.max(1, totalChamados)) * 100}%` }"
                :aria-label="`${t.status[l.s]}: ${l.n}`"
                @click="abrir(`${t.painel.widgets.porCategoria} · ${t.status[l.s]}`, l.itens)"
              />
            </div>
            <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              <li v-for="l in chamados" :key="l.s" class="flex items-center gap-1.5 text-xs text-toned">
                <span class="size-2.5 rounded-sm" :class="corDaBarra[l.s]" />{{ t.status[l.s] }} <span class="tabular-nums text-muted">{{ l.n }}</span>
              </li>
            </ul>
          </section>
        </TransitionGroup>
      </div>
    </EstadoDaTela>

    <!-- Drill-down: os itens por trás do número -->
    <USlideover v-model:open="drillAberto" :title="drill ? t.painel.drillTitulo(drill.rotulo, drill.itens.length) : ''" :ui="{ content: 'max-w-3xl' }">
      <template #body>
        <EnTable
          :columns="colunasDrill"
          :rows="linhasDrill"
          :locale="idioma"
          @row-click="(r) => (itemAberto = (r as LinhaDrill).item)"
        >
          <template #cell-reference="{ row }">
            <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as LinhaDrill).reference }}</UBadge>
          </template>
          <template #cell-titulo="{ row }">
            <span class="block max-w-72 truncate text-sm text-highlighted">{{ (row as LinhaDrill).titulo }}</span>
          </template>
          <template #cell-status="{ row }">
            <UBadge :label="t.status[(row as LinhaDrill).status]" :color="corDoStatus[(row as LinhaDrill).status]" variant="subtle" size="sm" />
          </template>
        </EnTable>
      </template>
      <template #footer>
        <div class="flex w-full justify-end">
          <UButton :label="t.painel.abrirNaLista" icon="i-lucide-table" color="primary" variant="soft" @click="drill = null; emit('abrirLista')" />
        </div>
      </template>
    </USlideover>

    <!-- Editar em 1 nível: o painel continua à vista e muda junto -->
    <USlideover v-model:open="editando" :title="t.painel.editarTitulo" :description="t.painel.editarDescricao" :overlay="false">
      <template #body>
        <div class="space-y-6">
          <section>
            <h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{{ t.painel.editarWidgets }}</h3>
            <ul class="space-y-1">
              <li v-for="w in (['numeros', 'porStatus', 'porMes', 'vencendo', 'chamados'] as const)" :key="w" class="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-elevated">
                <span class="text-sm text-toned">{{ w === 'numeros' ? `${t.painel.widgets.abertos}, ${t.painel.widgets.concluidos}…` : w === 'chamados' ? t.painel.widgets.porCategoria : t.painel.widgets[w] }}</span>
                <USwitch v-model="visiveis[w]" size="sm" />
              </li>
            </ul>
          </section>
          <section>
            <h3 class="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{{ t.painel.editarFiltros }}</h3>
            <div class="space-y-2">
              <USelect v-model="periodo" :items="opcoesDePeriodo" size="sm" icon="i-lucide-calendar" class="w-full" />
              <USelect v-model="categoria" :items="opcoesDeCategoria" size="sm" icon="i-lucide-layout-grid" class="w-full" />
            </div>
          </section>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="editando = false" />
          <UButton :label="t.painel.editarAplicar" color="primary" :loading="aplicando" @click="aplicar" />
        </div>
      </template>
    </USlideover>

    <VisaoRapida :t="t" :item="itemAberto" @fechar="itemAberto = null" />
  </div>
</template>
