<script setup lang="ts">
/**
 * PROPOSTA (rodada 3, refeita na rodada 7): a aba Itens do projeto. Os itens de todas as categorias
 * do projeto numa visão só, como o GitHub Projects junta issues de vários repositórios.
 *
 * A tela é a lista de itens do produto (memória "tela nova usa a listagem da categoria"), com os
 * filtros como funcionam hoje (lido no código em 2026-11-26, tabela de itens da develop):
 *  - abas Tabela e Quadro, sobre o `EnTable` e o `EnKanbanBoard` do SDK;
 *  - barra (TablesPartsDataToolbar): busca, período com o campo de data, "Limpar filtros"; à direita
 *    Relatórios, Colunas, Filtros por campo (painel à esquerda, um acordeão por campo), Campos comuns e
 *    Novo registro;
 *  - linha de filtros rápidos, sempre aberta, com botões que ligam e desligam;
 *  - o paginador do produto.
 *
 * O que o projeto acrescenta (marca laranja): o filtro de Categoria, na linha de filtros rápidos.
 *
 * Colunas: só o que vale para todas as categorias. As do item no produto (Referência, Título,
 * Criado em, Atualizado em, Criado por), a Categoria e as 3 que o mapa de campos comuns traz
 * (Status, Responsável, Prazo). Campo que só uma categoria tem fica na tela do item.
 *
 * Responsável, Prazo e Status não são do item no produto: são campos de cada categoria. A visão lê
 * o mapa de cada categoria (Configurações do projeto, aba Campos comuns), como a Agenda lê o campo
 * de data de cada uma. Categoria sem o campo mostra "Sem campo", com a dica de onde escolher.
 *
 * Peça nova no back-end: a leitura de itens de várias categorias numa chamada só, com a
 * permissão checada por categoria (contorno azul na chave do andaime).
 */
import type { EnKanbanCardConfig, EnKanbanColumn, EnTableColumn, EnTableColumnSizing, EnTableColumnVisibility, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import { textosDeAcoes } from './textosDeAcoes'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { iniciais, itensDoProjeto, pessoa, type GrupoDeStatus, type ItemDoProjeto } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { useMarcaDeProposta, useProjetos } from './estado'
import Paginador from './_Paginador.vue'
import { textosDasRelacoes } from './textosDasRelacoes'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const { marca, marcaBack } = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()
const r = useTextos(textosDoProjeto)
const ri = computed(() => r.value.itens)
const ti = computed(() => props.t.itensDoProjeto)
/** Rodada 12: a coluna Ações. Visualizar abre o painel do item; editar e excluir o item acontecem na categoria. */
const tac = useTextos(textosDeAcoes)
const acoesDaLinha = (l: Linha): DropdownMenuItem[][] => [
  [
    { label: tac.value.visualizar, icon: 'i-lucide-eye', onSelect: () => { aberto.value = l } },
    { label: tac.value.abrirNaCategoria, icon: 'i-lucide-arrow-up-right', onSelect: () => prj.abrirCategoria(l.categoria) },
    { label: tac.value.copiarLink, icon: 'i-lucide-link', onSelect: () => toast.add({ title: tac.value.linkCopiado, icon: 'i-lucide-check', color: 'success' }) },
  ],
]

const HOJE = '2026-11-26'
const p = computed(() => prj.projetos.value.find(x => x.id === props.id)!)
const admin = computed(() => prj.podeAdministrar(p.value))
const categorias = computed(() => prj.categoriasDe(props.id).filter(c => prj.veCategoria(c)))
const nomeDaCategoria = (id: number) => prj.categorias.value.find(c => c.id === id)?.name ?? ''
const iconeDaCategoria = (id: number) => prj.categorias.value.find(c => c.id === id)?.icon ?? 'i-lucide-folder'

type Periodo = 'todos' | 'd30' | 'd90' | 'ano'
type CampoDeData = 'criadoEm' | 'atualizadoEm' | 'prazo'
const vista = ref<'tabela' | 'quadro'>('tabela')
const busca = ref('')
const periodo = ref<Periodo>('todos')
const campoDeData = ref<CampoDeData>('criadoEm')
const filtroCategorias = ref<number[]>([])
const soMeus = ref(false)
const soVencidos = ref(false)
/* filtros por campo (o painel) */
const fGrupo = ref<GrupoDeStatus[]>([])
const fResp = ref<number[]>([])
const fCriador = ref<number[]>([])
const prazoDe = ref('')
const prazoAte = ref('')
const painelAberto = ref(false)
const aberto = ref<Linha | null>(null)
const pagina = ref(1)
const porPagina = ref(25)
const ordem = ref<EnTableSort | null>({ key: 'prazo', direction: 'asc' })
/** Rodada 14 (B3): as tarefas ligadas ao item aberto. */
const tr = useTextos(textosDasRelacoes)
const tarefasDoItem = computed(() => aberto.value ? prj.tarefas.value.filter(x => x.categoria === aberto.value!.categoria && x.item === aberto.value!.reference) : [])

interface Linha {
  id: number
  item: ItemDoProjeto
  categoria: number
  reference: string
  titulo: string
  responsavel: number | null
  prazo: string | null
  status: string | null
  grupo: GrupoDeStatus
  vencido: boolean
  criadoEm: string
  atualizadoEm: string
  criadoPor: number
  /** As colunas que a categoria não preenche, para a dica. */
  semResponsavel: boolean
  semPrazo: boolean
}

/** Fictício: datas e autor do item, tirados do id para o reload dar o mesmo valor. */
const diasAtras = (dias: number) => new Date(new Date(`${HOJE}T12:00:00`).getTime() - dias * 864e5).toISOString().slice(0, 10)

const todas = computed<Linha[]>(() => {
  const ids = new Set(categorias.value.map(c => c.id))
  return itensDoProjeto
    .filter(i => ids.has(i.categoria))
    .map((i) => {
      const m = prj.mapas.value[i.categoria]
      const resp = m?.responsavel ? Number(i.campos[m.responsavel]) || null : null
      const prazo = m?.prazo ? String(i.campos[m.prazo] ?? '') || null : null
      const status = m?.status ? String(i.campos[m.status] ?? '') || null : null
      const grupo: GrupoDeStatus = (status && m?.grupos[status]) || 'aberto'
      const pessoasDoItem = Object.values(i.campos).filter((v): v is number => typeof v === 'number')
      const criado = 8 + (i.id * 13) % 110
      return {
        id: i.id,
        item: i,
        categoria: i.categoria,
        reference: i.reference,
        titulo: i.titulo,
        responsavel: resp,
        prazo,
        status,
        grupo,
        vencido: !!prazo && prazo < HOJE && grupo !== 'concluido',
        criadoEm: diasAtras(criado),
        atualizadoEm: diasAtras(Math.max(0, criado - 3 - (i.id * 7) % 20)),
        criadoPor: pessoasDoItem[pessoasDoItem.length - 1] ?? 1,
        semResponsavel: !m?.responsavel,
        semPrazo: !m?.prazo,
      }
    })
})

const DIAS: Record<Periodo, number> = { todos: 0, d30: 30, d90: 90, ano: 365 }
const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const filtradas = computed(() => todas.value.filter((l) => {
  if (filtroCategorias.value.length && !filtroCategorias.value.includes(l.categoria)) return false
  if (soMeus.value && l.responsavel !== prj.eu.value) return false
  if (soVencidos.value && !l.vencido) return false
  if (fGrupo.value.length && !fGrupo.value.includes(l.grupo)) return false
  if (fResp.value.length && (!l.responsavel || !fResp.value.includes(l.responsavel))) return false
  if (fCriador.value.length && !fCriador.value.includes(l.criadoPor)) return false
  if (prazoDe.value && (!l.prazo || l.prazo < prazoDe.value)) return false
  if (prazoAte.value && (!l.prazo || l.prazo > prazoAte.value)) return false
  if (DIAS[periodo.value]) {
    const data = l[campoDeData.value]
    if (!data || data < diasAtras(DIAS[periodo.value])) return false
  }
  const q = normalizar(busca.value.trim())
  return !q || normalizar(`${l.titulo} ${l.reference}`).includes(q)
}))
const valorDaOrdem = (l: Linha, k: string): string => {
  if (k === 'responsavel') return l.responsavel ? pessoa(l.responsavel)?.nome ?? '' : '~'
  if (k === 'criadoPor') return pessoa(l.criadoPor)?.nome ?? ''
  if (k === 'categoria') return nomeDaCategoria(l.categoria)
  if (k === 'prazo') return l.prazo ?? '9999'
  return String((l as unknown as Record<string, unknown>)[k] ?? '')
}
const ordenadas = computed(() => {
  const o = ordem.value
  if (!o) return filtradas.value
  return [...filtradas.value].sort((a, b) => {
    const c = valorDaOrdem(a, o.key).localeCompare(valorDaOrdem(b, o.key))
    return o.direction === 'asc' ? c : -c
  })
})
watch([busca, periodo, campoDeData, filtroCategorias, soMeus, soVencidos, fGrupo, fResp, fCriador, prazoDe, prazoAte], () => { pagina.value = 1 })
const linhas = computed(() => ordenadas.value.slice((pagina.value - 1) * porPagina.value, pagina.value * porPagina.value))

const camposAtivos = computed(() => [fGrupo.value.length, fResp.value.length, fCriador.value.length, prazoDe.value || prazoAte.value].filter(Boolean).length)
const temFiltro = computed(() => !!busca.value.trim() || periodo.value !== 'todos' || filtroCategorias.value.length > 0 || soMeus.value || soVencidos.value || camposAtivos.value > 0)
function limparFiltros() {
  busca.value = ''
  periodo.value = 'todos'
  filtroCategorias.value = []
  soMeus.value = false
  soVencidos.value = false
  fGrupo.value = []
  fResp.value = []
  fCriador.value = []
  prazoDe.value = ''
  prazoAte.value = ''
}

const opcoesDeCategoria = computed(() => categorias.value.map(c => ({ value: c.id, label: c.name, icon: c.icon ?? 'i-lucide-folder' })))
const opPeriodo = computed(() => (['todos', 'd30', 'd90', 'ano'] as const).map(v => ({ value: v, label: props.t.diretorio.periodos[v] })))
const opCampoDeData = computed(() => (['criadoEm', 'atualizadoEm', 'prazo'] as const).map(v => ({ value: v, label: ri.value.campoDeData[v] })))
const opGrupo = computed(() => (['aberto', 'andamento', 'concluido'] as const).map(v => ({ value: v, label: ti.value.grupo[v] })))
const pessoasDe = (lista: (number | null)[]) => [...new Set(lista.filter((x): x is number => !!x))].map(id => ({ value: id, label: pessoa(id)?.nome ?? '' })).sort((a, b) => a.label.localeCompare(b.label))
const opResp = computed(() => pessoasDe(todas.value.map(l => l.responsavel)))
const opCriador = computed(() => pessoasDe(todas.value.map(l => l.criadoPor)))
const rotuloDoFiltro = (nome: string, n: number) => n ? `${nome} (${n})` : nome
const acordeao = computed(() => [
  { value: 'status', label: rotuloDoFiltro(ri.value.statusGrupo, fGrupo.value.length) },
  { value: 'responsavel', label: rotuloDoFiltro(ti.value.responsavel, fResp.value.length) },
  { value: 'prazo', label: rotuloDoFiltro(ti.value.prazo, Number(!!prazoDe.value) + Number(!!prazoAte.value)) },
  { value: 'criadoPor', label: rotuloDoFiltro(ri.value.criadoPor, fCriador.value.length) },
])

const corDoGrupo: Record<GrupoDeStatus, 'neutral' | 'info' | 'success'> = { aberto: 'neutral', andamento: 'info', concluido: 'success' }
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value)

/* ---------- colunas ---------- */
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'acoes', label: tac.value.coluna },
  { key: 'reference', label: ti.value.referencia, sortable: true },
  { key: 'titulo', label: ti.value.titulo, sortable: true },
  { key: 'categoria', label: ti.value.categoria, sortable: true },
  { key: 'status', label: ti.value.status, sortable: true },
  { key: 'responsavel', label: ti.value.responsavel, sortable: true },
  { key: 'prazo', label: ti.value.prazo, sortable: true },
  { key: 'criadoEm', label: ri.value.criadoEm, sortable: true },
  { key: 'atualizadoEm', label: ri.value.atualizadoEm, sortable: true },
  { key: 'criadoPor', label: ri.value.criadoPor, sortable: true },
])
const colunasVisiveis = ref<EnTableColumnVisibility>({ atualizadoEm: false, criadoPor: false })
const larguras = ref<EnTableColumnSizing>({ acoes: 64, reference: 120, titulo: 250, categoria: 170, status: 170, responsavel: 190, prazo: 160, criadoEm: 120, atualizadoEm: 130, criadoPor: 180 })
function verColuna(key: string, ver: boolean | 'indeterminate') {
  colunasVisiveis.value = { ...colunasVisiveis.value, [key]: ver === true }
}

/* ---------- quadro ---------- */
const colunasDoQuadro = computed<EnKanbanColumn[]>(() => (['aberto', 'andamento', 'concluido'] as const).map(g => ({
  value: g,
  label: ti.value.grupo[g],
  colorScheme: corDoGrupo[g],
})))
const cartoes = computed(() => filtradas.value.map(l => ({
  id: l.id,
  titulo: l.titulo,
  descricao: `${l.reference} · ${nomeDaCategoria(l.categoria)}${l.status ? ` · ${l.status}` : ''}${l.responsavel ? ` · ${pessoa(l.responsavel)?.nome}` : ''}`,
  grupo: l.grupo,
  prazo: l.prazo ?? undefined,
})))
const cartao: EnKanbanCardConfig = {
  header: 'titulo',
  content: 'descricao',
  dueDateField: { refId: 'prazo', name: 'Prazo' },
}

/* ---------- barra ---------- */
const novoEm = computed<DropdownMenuItem[][]>(() => [
  [{ type: 'label', label: ti.value.escolhaCategoria }],
  categorias.value.map(c => ({ label: c.name, icon: c.icon ?? 'i-lucide-folder', onSelect: () => prj.abrirCategoria(c.id) })),
])
function configurarCampos() {
  prj.janelas.configurar.value = { id: props.id, aba: 'campos' }
}
</script>

<template>
  <div :class="marcaBack">
    <p class="flex items-center gap-1.5 pb-3 text-sm text-muted">
      <UIcon name="i-lucide-layers" class="size-4 shrink-0" />{{ ti.resumo(categorias.length) }}
    </p>

    <div class="overflow-hidden rounded-lg border border-default bg-default">
      <!-- abas de visualização (cópia da lista da categoria) -->
      <div class="flex items-center gap-1 border-b border-default px-3 py-2">
        <UButton icon="i-lucide-table" :label="ti.tabela" size="sm" :color="vista === 'tabela' ? 'primary' : 'neutral'" :variant="vista === 'tabela' ? 'soft' : 'ghost'" :aria-pressed="vista === 'tabela'" @click="vista = 'tabela'" />
        <UButton icon="i-lucide-kanban" :label="ti.quadro" size="sm" :color="vista === 'quadro' ? 'primary' : 'neutral'" :variant="vista === 'quadro' ? 'soft' : 'ghost'" :aria-pressed="vista === 'quadro'" @click="vista = 'quadro'" />
      </div>

      <!-- barra: TablesPartsDataToolbar da tabela de itens (cópia) -->
      <div class="flex flex-wrap items-center gap-1.5 border-b border-default px-3 py-2 sm:px-4">
        <UChip :show="!!busca.trim()" color="error" size="sm">
          <UInput v-model="busca" icon="i-lucide-search" :placeholder="ti.pesquisar" :aria-label="ti.pesquisar" size="sm" variant="soft" class="w-64">
            <template v-if="busca" #trailing>
              <UButton icon="i-lucide-circle-x" color="neutral" variant="link" size="xs" :aria-label="t.diretorio.limparBusca" @click="busca = ''" />
            </template>
          </UInput>
        </UChip>
        <div class="flex items-center">
          <USelectMenu v-model="campoDeData" :items="opCampoDeData" value-key="value" :search-input="false" size="sm" variant="soft" class="w-36 rounded-r-none" :aria-label="ri.campoDeDataRotulo" />
          <USelectMenu v-model="periodo" :items="opPeriodo" value-key="value" :search-input="false" icon="i-lucide-calendar" size="sm" variant="soft" class="w-44 rounded-l-none border-l border-default" :aria-label="ri.periodo" />
        </div>
        <UTooltip v-if="temFiltro" :text="t.diretorio.limparFiltros">
          <UButton icon="i-lucide-filter-x" color="neutral" variant="ghost" size="sm" class="text-error" :aria-label="t.diretorio.limparFiltros" @click="limparFiltros" />
        </UTooltip>
        <div class="ml-auto flex items-center gap-1">
          <UTooltip :text="ri.relatorios">
            <UButton icon="i-lucide-file-chart-column" color="neutral" variant="ghost" size="sm" class="text-dimmed" :aria-label="ri.relatorios" @click="toast.add({ title: ri.relatorioMaquete, icon: 'i-lucide-info', color: 'neutral' })" />
          </UTooltip>
          <UPopover :content="{ align: 'end' }">
            <UTooltip :text="t.diretorio.colunas">
              <UButton icon="i-lucide-columns-3" color="neutral" variant="ghost" size="sm" class="text-dimmed" :aria-label="t.diretorio.colunas" />
            </UTooltip>
            <template #content>
              <div class="w-56 space-y-3 p-3">
                <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ t.diretorio.colunasVisiveis }}</p>
                <div class="space-y-1">
                  <UCheckbox
                    v-for="c in colunas.filter(k => k.key !== 'acoes')"
                    :key="c.key"
                    :label="c.label"
                    :model-value="colunasVisiveis[c.key] !== false"
                    :disabled="c.key === 'titulo'"
                    class="rounded-md px-1.5 py-1 hover:bg-elevated/80"
                    @update:model-value="verColuna(c.key, $event)"
                  />
                </div>
              </div>
            </template>
          </UPopover>
          <UTooltip :text="ri.filtrosPorCampo">
            <UChip :show="camposAtivos > 0" :text="camposAtivos" color="primary" size="xl">
              <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="sm" :class="camposAtivos ? 'text-primary' : 'text-dimmed'" :aria-label="ri.filtrosPorCampo" @click="painelAberto = true" />
            </UChip>
          </UTooltip>
          <UTooltip v-if="admin" :text="ti.camposComuns">
            <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" class="text-dimmed" :aria-label="ti.camposComuns" @click="configurarCampos" />
          </UTooltip>
          <UDropdownMenu v-if="categorias.length" :items="novoEm" :content="{ align: 'end' }">
            <UButton icon="i-lucide-plus" :label="ti.novoRegistro" trailing-icon="i-lucide-chevron-down" color="primary" variant="subtle" size="sm" class="ml-1" />
          </UDropdownMenu>
        </div>
      </div>

      <!-- filtros rápidos: Categoria (proposta do projeto) e os botões que ligam e desligam -->
      <div class="flex items-center gap-2 overflow-x-auto border-b border-default px-3 py-1.5 sm:px-4">
        <UTooltip :text="ri.filtroCategoriaDica">
          <USelectMenu
            v-model="filtroCategorias"
            :items="opcoesDeCategoria"
            value-key="value"
            multiple
            size="sm"
            variant="soft"
            :icon="filtroCategorias.length ? 'i-lucide-filter' : 'i-lucide-folder'"
            class="w-48 shrink-0"
            :class="marca"
            :ui="{ base: filtroCategorias.length ? 'text-primary' : '' }"
            :aria-label="ti.categoria"
            :search-input="false"
          >
            <template #default>{{ filtroCategorias.length ? rotuloDoFiltro(ti.categoria, filtroCategorias.length) : ti.todasCategorias }}</template>
          </USelectMenu>
        </UTooltip>
        <USeparator orientation="vertical" class="h-5 shrink-0" />
        <UButton :label="ti.soMeus" icon="i-lucide-user-round-check" size="sm" class="shrink-0" :color="soMeus ? 'primary' : 'neutral'" :variant="soMeus ? 'subtle' : 'soft'" :aria-pressed="soMeus" @click="soMeus = !soMeus" />
        <UButton :label="ri.vencidos" icon="i-lucide-alarm-clock" size="sm" class="shrink-0" :color="soVencidos ? 'error' : 'neutral'" :variant="soVencidos ? 'subtle' : 'soft'" :aria-pressed="soVencidos" @click="soVencidos = !soVencidos" />
        <span class="ml-auto shrink-0 pl-2 text-xs text-muted">{{ ri.contagem(filtradas.length) }}</span>
      </div>

      <div v-if="!categorias.length || (!todas.length)" class="flex flex-col items-center gap-2 px-6 py-12 text-center">
        <UIcon name="i-lucide-inbox" class="size-7 text-muted" />
        <p class="text-sm font-semibold text-highlighted">{{ ti.semItensTitulo }}</p>
        <p class="max-w-sm text-sm text-muted">{{ ti.semItensTexto }}</p>
      </div>

      <div v-else-if="vista === 'tabela'" class="animate-[entrada_.25s_ease-out]">
        <div class="pt-2">
          <EnTable
            v-model:column-visibility="colunasVisiveis"
            v-model:column-sizing="larguras"
            :columns="colunas"
            :rows="linhas"
            :sort="ordem"
            selectable
            resizable
            :empty-state="{ icon: 'i-lucide-search-x', title: ti.vazio, description: '' }"
            :locale="idioma"
            @sort-change="ordem = $event"
            @row-click="(row) => (aberto = row as Linha)"
          >
            <template #cell-reference="{ row }">
              <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as Linha).reference }}</UBadge>
            </template>
            <template #cell-titulo="{ row }">
              <span class="block truncate text-sm text-highlighted">{{ (row as Linha).titulo }}</span>
            </template>
            <template #cell-categoria="{ row }">
              <span class="flex min-w-0 items-center gap-1.5 text-sm text-toned">
                <UIcon :name="iconeDaCategoria((row as Linha).categoria)" class="size-3.5 shrink-0 text-muted" />
                <span class="truncate">{{ nomeDaCategoria((row as Linha).categoria) }}</span>
              </span>
            </template>
            <template #cell-status="{ row }">
              <UBadge v-if="(row as Linha).status" :label="(row as Linha).status!" :color="corDoGrupo[(row as Linha).grupo]" variant="subtle" size="sm" />
              <span v-else />
            </template>
            <template #cell-responsavel="{ row }">
              <span v-if="(row as Linha).responsavel" class="flex min-w-0 items-center gap-1.5 text-sm">
                <UAvatar size="2xs" :text="iniciais(pessoa((row as Linha).responsavel!)?.nome ?? '')" :alt="pessoa((row as Linha).responsavel!)?.nome" />
                <span class="truncate">{{ pessoa((row as Linha).responsavel!)?.nome }}</span>
              </span>
              <UTooltip v-else-if="(row as Linha).semResponsavel" :text="ti.semCampoDica(nomeDaCategoria((row as Linha).categoria), ti.responsavel)">
                <span class="text-sm text-dimmed">{{ ti.semCampo }}</span>
              </UTooltip>
              <span v-else />
            </template>
            <template #cell-prazo="{ row }">
              <span v-if="(row as Linha).prazo" class="flex items-center gap-1.5 whitespace-nowrap text-sm" :class="(row as Linha).vencido ? 'text-error' : 'text-muted'">
                {{ formatarData((row as Linha).prazo!) }}
                <UBadge v-if="(row as Linha).vencido" :label="ti.vencido" color="error" variant="subtle" size="sm" />
              </span>
              <UTooltip v-else-if="(row as Linha).semPrazo" :text="ti.semCampoDica(nomeDaCategoria((row as Linha).categoria), ti.prazo)">
                <span class="text-sm text-dimmed">{{ ti.semCampo }}</span>
              </UTooltip>
              <span v-else />
            </template>
            <template #cell-criadoEm="{ row }">
              <span class="whitespace-nowrap text-sm text-muted">{{ formatarData((row as Linha).criadoEm) }}</span>
            </template>
            <template #cell-atualizadoEm="{ row }">
              <span class="whitespace-nowrap text-sm text-muted">{{ formatarData((row as Linha).atualizadoEm) }}</span>
            </template>
            <template #cell-criadoPor="{ row }">
              <span class="flex min-w-0 items-center gap-1.5 text-sm">
                <UAvatar size="2xs" :text="iniciais(pessoa((row as Linha).criadoPor)?.nome ?? '')" :alt="pessoa((row as Linha).criadoPor)?.nome" />
                <span class="truncate">{{ pessoa((row as Linha).criadoPor)?.nome }}</span>
              </span>
            </template>
            <template #cell-acoes="{ row }">
              <span class="flex" @click.stop>
                <UDropdownMenu :items="acoesDaLinha(row as Linha)" :content="{ align: 'start' }">
                  <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="tac.de((row as Linha).titulo)" />
                </UDropdownMenu>
              </span>
            </template>
          </EnTable>
        </div>
        <Paginador v-model:pagina="pagina" v-model:por-pagina="porPagina" :t="t" :total="filtradas.length" />
      </div>

      <ClientOnly v-else>
        <div class="p-3 animate-[entrada_.25s_ease-out]">
          <EnKanbanBoard
            :data="cartoes"
            :card-map="cartao"
            :columns="colunasDoQuadro"
            group-by="grupo"
            primary-key="id"
            :stagger-column-ms="60"
            :locale="idioma"
            @card-click="(c) => (aberto = todas.find(l => l.id === Number((c as { id: number }).id)) ?? null)"
          />
        </div>
      </ClientOnly>
    </div>

    <!-- Filtros por campo: o painel à esquerda da tabela de itens (cópia), um acordeão por campo -->
    <USlideover
      v-model:open="painelAberto"
      side="left"
      :title="ri.filtrosPorCampo"
      :description="ri.filtrosPorCampoDica"
      :ui="{ content: 'max-w-[min(100vw,24rem)] sm:max-w-lg flex flex-col', body: 'flex-1 min-h-0 p-0' }"
    >
      <template #body>
        <UAccordion
          type="multiple"
          :unmount-on-hide="false"
          :items="acordeao"
          :ui="{ item: 'border-b border-default last:border-b-0', trigger: 'px-4 sm:px-5', body: 'px-4 sm:px-5' }"
        >
          <template #body="{ item }">
            <USelectMenu v-if="item.value === 'status'" v-model="fGrupo" :items="opGrupo" value-key="value" multiple :search-input="false" :placeholder="ri.todos" class="w-full" :aria-label="ri.statusGrupo" />
            <USelectMenu v-else-if="item.value === 'responsavel'" v-model="fResp" :items="opResp" value-key="value" multiple :placeholder="ri.todos" class="w-full" :aria-label="ti.responsavel" />
            <USelectMenu v-else-if="item.value === 'criadoPor'" v-model="fCriador" :items="opCriador" value-key="value" multiple :placeholder="ri.todos" class="w-full" :aria-label="ri.criadoPor" />
            <div v-else class="grid grid-cols-2 gap-2">
              <UFormField :label="ri.deData"><UInput v-model="prazoDe" type="date" class="w-full" /></UFormField>
              <UFormField :label="ri.ateData"><UInput v-model="prazoAte" type="date" class="w-full" /></UFormField>
            </div>
          </template>
        </UAccordion>
      </template>
      <template #footer>
        <div class="flex w-full justify-between gap-2">
          <UButton :label="t.diretorio.limparFiltros" icon="i-lucide-filter-x" color="neutral" variant="ghost" :disabled="!camposAtivos" @click="fGrupo = []; fResp = []; fCriador = []; prazoDe = ''; prazoAte = ''" />
          <UButton :label="r.painel.concluir" color="primary" @click="painelAberto = false" />
        </div>
      </template>
    </USlideover>

    <!-- o item aberto: os campos da categoria e o caminho de volta para ela -->
    <USlideover
      :open="!!aberto"
      :title="aberto ? `${aberto.reference} · ${aberto.titulo}` : ''"
      :description="aberto ? nomeDaCategoria(aberto.categoria) : ''"
      @update:open="(v: boolean) => { if (!v) aberto = null }"
    >
      <template #body>
        <dl v-if="aberto" class="space-y-4">
          <div v-for="(valor, campo) in aberto.item.campos" :key="campo">
            <dt class="text-xs font-medium text-muted">{{ campo }}</dt>
            <dd class="mt-1 text-sm text-highlighted">
              <template v-if="typeof valor === 'number'">
                <span class="flex items-center gap-1.5"><UAvatar size="2xs" :text="iniciais(pessoa(valor)?.nome ?? '')" :alt="pessoa(valor)?.nome" />{{ pessoa(valor)?.nome }}</span>
              </template>
              <template v-else-if="/^\d{4}-\d{2}-\d{2}$/.test(valor)">{{ formatarData(valor) }}</template>
              <template v-else>{{ valor }}</template>
            </dd>
          </div>
        </dl>
        <!-- rodada 14 (B3): as tarefas do item, vistas e criadas daqui -->
        <section v-if="aberto" class="mt-6 flex flex-col gap-2 border-t border-default pt-4" :class="marca">
          <header class="flex items-center gap-2">
            <h3 class="flex-1 text-sm font-semibold text-highlighted">{{ tr.item.tarefas }}</h3>
            <UButton :label="tr.item.criarTarefa" icon="i-lucide-plus" size="xs" color="neutral" variant="outline" @click="prj.novaTarefaCom(id, { categoria: aberto.categoria, item: aberto.reference })" />
          </header>
          <p v-if="!tarefasDoItem.length" class="text-xs text-muted">{{ tr.item.semTarefas }}</p>
          <ul v-else class="flex flex-col divide-y divide-default rounded-lg border border-default">
            <li v-for="x in tarefasDoItem" :key="x.id">
              <button type="button" class="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-elevated/60" @click="aberto = null; prj.tarefaAberta.value = x.id">
                <UIcon :name="x.status === 'concluida' ? 'i-lucide-circle-check' : 'i-lucide-circle'" class="size-4 shrink-0" :class="x.status === 'concluida' ? 'text-success' : 'text-muted'" />
                <span class="min-w-0 flex-1 truncate text-sm" :class="x.status === 'concluida' ? 'text-muted line-through' : 'text-highlighted'">{{ x.titulo }}</span>
                <span class="shrink-0 text-xs text-muted">{{ pessoa(x.responsavel)?.nome }}</span>
              </button>
            </li>
          </ul>
        </section>
      </template>
      <template #footer>
        <UButton v-if="aberto" :label="ti.abrirNaCategoria" icon="i-lucide-arrow-up-right" color="neutral" variant="outline" @click="prj.abrirCategoria(aberto.categoria); aberto = null" />
      </template>
    </USlideover>
  </div>
</template>
