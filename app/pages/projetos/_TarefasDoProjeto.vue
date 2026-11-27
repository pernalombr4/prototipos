<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): a aba Tarefas do projeto. Responde "onde vejo as tarefas do projeto".
 *
 * Rodada 10: só as tarefas rápidas. A redatora tirou as agendadas (as do workflow) do protótipo: o
 * projeto não dá suporte a elas de propósito. A tarefa rápida liga a 1 item de uma categoria do
 * projeto ou fica sem item, direto no projeto (o "draft" do GitHub Projects).
 *
 * O esquema é o das listagens do produto, igual ao diretório (rodada 4): a barra com busca, período,
 * Colunas e Nova tarefa; a linha de filtros rápidos com Status, Responsável, Categoria, Atrasadas e
 * Minhas tarefas; o `EnTable` do SDK e o paginador.
 *
 * Rodada 10: Tabela e Quadro, como as Tarefas rápidas do produto (lista e quadro por status, com
 * arrastar). O quadro é o `EnKanbanBoard` do SDK com as 4 colunas de status. A subtarefa segue a lógica
 * do protótipo pasta-de-apontamentos: não vira linha nem cartão, salvo com a chave "Mostrar subtarefas
 * como cartões"; a tarefa-mãe mostra "Subtarefas: 1 de 3". No pé da tabela, a criação
 * rápida: título e Enter criam a tarefa sem item. A linha e o cartão abrem a tarefa (`_TarefaAberta`).
 */
import type { EnKanbanCardConfig, EnKanbanColumn, EnTableColumn, EnTableColumnSizing, EnTableColumnVisibility, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { iniciais, pessoa, type Prioridade, type StatusDaTarefa, type TarefaDoProjeto } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { textosDaTarefa } from './textosDaTarefa'
import { useMarcaDeProposta, useProjetos } from './estado'
import Paginador from './_Paginador.vue'
import { useMetasEDiscussoes } from './metasEDiscussoes'
import { textosDeMarcosEMedicao } from './textosDeMarcosEMedicao'
import { textosDeAtalhos } from './textosDeAtalhos'
import AtalhoDeCriar from './_AtalhoDeCriar.vue'
import { textosDeAcoes } from './textosDeAcoes'
import type { DropdownMenuItem } from '@nuxt/ui'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const r = useTextos(textosDoProjeto)
const rt = computed(() => r.value.tarefas)
const tt = useTextos(textosDaTarefa)
const idioma = useIdioma()
const toast = useToast()
const { marca } = useMarcaDeProposta()
/** Rodada 9: a coluna Marco. */
const md = useMetasEDiscussoes()
const tmm = useTextos(textosDeMarcosEMedicao)
const podeEditarMarcos = computed(() => md.podeEditarMarcos(props.id))
const opMarcos = computed(() => [
  { value: 0, label: tmm.value.marcos.semMarco },
  ...md.marcosDo(props.id).filter(m => m.status === 'aberto').map(m => ({ value: m.id, label: m.nome, icon: 'i-lucide-flag' })),
])

/** Rodada 11: o seletor de Marco da linha tem o atalho "Criar marco" no pé (`_AtalhoDeCriar.vue`). */
const ta = useTextos(textosDeAtalhos)
const buscaMarco = ref('')
function criarMarcoNaLinha(x: TarefaDoProjeto, nome: string) {
  const m = md.criarMarcoRapido(props.id, nome, x.prazo)
  md.definirMarcoDaTarefa(x.id, m.id)
  toast.add({ title: ta.value.marco.criado(nome), icon: 'i-lucide-flag', color: 'success' })
  buscaMarco.value = ''
}

const HOJE = '2026-11-26'
type Periodo = 'todos' | 'd30' | 'd90' | 'ano'
/** Rodada 10: a mesma lista em Tabela ou Quadro, como a lista de itens e as Tarefas rápidas do produto. */
const vista = ref<'tabela' | 'quadro'>('tabela')
const busca = ref('')
const periodo = ref<Periodo>('todos')
const fStatus = ref<StatusDaTarefa[]>(['aberta', 'andamento', 'bloqueada'])
const fResp = ref<number[]>([])
const fCat = ref<number[]>([])
const soAtrasadas = ref(false)
const soMinhas = ref(false)
const mostrarRapidos = ref(true)
/** Como no pasta-de-apontamentos: a subtarefa não vira linha nem cartão, salvo com "Mostrar subtarefas como cartões". */
const mostrarSubtarefas = ref(false)
const pagina = ref(1)
const porPagina = ref(25)
const ordem = ref<EnTableSort | null>({ key: 'prazo', direction: 'asc' })

const todas = computed(() => prj.tarefasDoProjeto(props.id))
const categorias = computed(() => prj.categoriasDe(props.id))
const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const DIAS: Record<Periodo, number> = { todos: 0, d30: 30, d90: 90, ano: 365 }
const desde = (dias: number) => new Date(new Date(`${HOJE}T12:00:00`).getTime() - dias * 864e5).toISOString().slice(0, 10)

const STATUS: StatusDaTarefa[] = ['aberta', 'andamento', 'bloqueada', 'concluida']
const COR_DO_STATUS: Record<StatusDaTarefa, 'neutral' | 'info' | 'warning' | 'success'> = { aberta: 'neutral', andamento: 'info', bloqueada: 'warning', concluida: 'success' }
const COR_DA_PRIORIDADE: Record<Prioridade, 'error' | 'warning' | 'info' | 'neutral'> = { urgente: 'error', alta: 'warning', media: 'info', baixa: 'neutral' }
const nomeDaCategoria = (id: number | null) => prj.categorias.value.find(c => c.id === id)?.name ?? ''
const iconeDaCategoria = (id: number | null) => prj.categorias.value.find(c => c.id === id)?.icon ?? 'i-lucide-folder'
const tituloDe = (id?: number) => prj.tarefas.value.find(x => x.id === id)?.titulo ?? ''
const subsDe = (x: TarefaDoProjeto) => prj.subtarefasDe(x.id)
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value, { day: '2-digit', month: 'short' })
const vencida = (x: TarefaDoProjeto) => x.status !== 'concluida' && x.prazo < HOJE
const venceHoje = (x: TarefaDoProjeto) => x.status !== 'concluida' && x.prazo === HOJE

const filtradas = computed(() => todas.value.filter(x => !fStatus.value.length || fStatus.value.includes(x.status)).filter(passaFiltros))
/** Os filtros menos o de Status: o quadro mostra as 4 colunas, como as Tarefas rápidas do produto. */
const doQuadro = computed(() => todas.value.filter(passaFiltros))
function passaFiltros(x: TarefaDoProjeto) {
  if (!mostrarSubtarefas.value && x.mae) return false
  if (fResp.value.length && !fResp.value.includes(x.responsavel)) return false
  if (fCat.value.length && (x.categoria === null || !fCat.value.includes(x.categoria))) return false
  if (soAtrasadas.value && !vencida(x)) return false
  if (soMinhas.value && x.responsavel !== prj.eu.value) return false
  if (DIAS[periodo.value] && x.criadaEm < desde(DIAS[periodo.value])) return false
  const q = normalizar(busca.value.trim())
  return !q || normalizar(`${x.titulo} ${x.item ?? ''}`).includes(q)
}
const PESO: Record<Prioridade, number> = { urgente: 0, alta: 1, media: 2, baixa: 3 }
const valorDaOrdem = (x: TarefaDoProjeto, k: string): string | number => {
  if (k === 'prioridade') return PESO[x.prioridade]
  if (k === 'responsavel') return pessoa(x.responsavel)?.nome ?? ''
  if (k === 'categoria') return nomeDaCategoria(x.categoria)
  if (k === 'status') return STATUS.indexOf(x.status)
  return String((x as unknown as Record<string, unknown>)[k] ?? '')
}
const ordenadas = computed(() => {
  const o = ordem.value
  if (!o) return filtradas.value
  return [...filtradas.value].sort((a, b) => {
    const A = valorDaOrdem(a, o.key), B = valorDaOrdem(b, o.key)
    const c = typeof A === 'number' ? A - (B as number) : (A as string).localeCompare(B as string)
    return o.direction === 'asc' ? c : -c
  })
})
watch([busca, periodo, fStatus, fResp, fCat, soAtrasadas, soMinhas, mostrarSubtarefas], () => { pagina.value = 1 })
const linhas = computed(() => ordenadas.value.slice((pagina.value - 1) * porPagina.value, pagina.value * porPagina.value))

/* ---------- colunas: os nomes das listas de tarefas do produto ---------- */
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'titulo', label: rt.value.colTarefa, sortable: true },
  { key: 'item', label: rt.value.colItem, sortable: true },
  { key: 'categoria', label: rt.value.colCategoria, sortable: true },
  { key: 'responsavel', label: rt.value.colResponsavel, sortable: true },
  { key: 'prazo', label: rt.value.colPrazo, sortable: true },
  { key: 'status', label: rt.value.colStatus, sortable: true },
  { key: 'marco', label: tmm.value.marcos.colMarco },
  { key: 'prioridade', label: rt.value.colPrioridade, sortable: true },
  { key: 'criadaEm', label: rt.value.colCriada, sortable: true },
  { key: 'acoes', label: tac.value.coluna, align: 'right' },
])
const colunasVisiveis = ref<EnTableColumnVisibility>({ criadaEm: false })
const larguras = ref<EnTableColumnSizing>({ titulo: 290, item: 150, categoria: 160, responsavel: 170, prazo: 170, status: 140, marco: 200, prioridade: 110, criadaEm: 120, acoes: 70 })
function verColuna(key: string, ver: boolean | 'indeterminate') {
  colunasVisiveis.value = { ...colunasVisiveis.value, [key]: ver === true }
}

const opStatus = computed(() => STATUS.map(v => ({ value: v, label: rt.value.status[v] })))
const opResp = computed(() => [...new Set(todas.value.map(x => x.responsavel))].map(id => ({ value: id, label: pessoa(id)?.nome ?? '' })))
const opCat = computed(() => categorias.value.map(c => ({ value: c.id, label: c.name, icon: c.icon })))
const opPeriodo = computed(() => (['todos', 'd30', 'd90', 'ano'] as const).map(v => ({ value: v, label: props.t.diretorio.periodos[v] })))
const rotuloDoFiltro = (nome: string, n: number) => n ? `${nome} (${n})` : nome
const rapidosAtivos = computed(() => [fStatus.value, fResp.value, fCat.value].filter(x => x.length).length + Number(soAtrasadas.value) + Number(soMinhas.value))
const temFiltro = computed(() => !!busca.value.trim() || periodo.value !== 'todos' || rapidosAtivos.value > 0)
function limparFiltros() {
  busca.value = ''
  periodo.value = 'todos'
  fStatus.value = []
  fResp.value = []
  fCat.value = []
  soAtrasadas.value = false
  soMinhas.value = false
}

function alternar(x: TarefaDoProjeto) {
  const ia = x.status !== 'concluida'
  prj.concluirTarefa(x.id)
  if (ia && ofertarSubtarefas(x)) return
  toast.add({ title: ia ? rt.value.concluida(x.titulo) : rt.value.reaberta(x.titulo), icon: ia ? 'i-lucide-circle-check' : 'i-lucide-rotate-ccw', color: ia ? 'success' : 'neutral' })
}
/** Concluir a tarefa-mãe com subtarefa aberta oferece concluir as abertas junto, como no pasta-de-apontamentos. */
function ofertarSubtarefas(x: TarefaDoProjeto) {
  const n = prj.abertasDe(x.id).length
  if (!n) return false
  toast.add({
    title: rt.value.concluida(x.titulo),
    description: tt.value.detalhe.abertas(n),
    icon: 'i-lucide-git-branch',
    color: 'warning',
    duration: 10000,
    actions: [{ label: tt.value.detalhe.concluirAbertas(n), color: 'neutral', variant: 'outline', onClick: () => prj.concluirComSubtarefas(x.id) }],
  })
  return true
}
const abrir = (id: number) => { prj.tarefaAberta.value = id }
/** Rodada 12: a coluna Ações, como em toda tabela do ENSPACE. Excluir pede confirmação, como no painel da tarefa. */
const tac = useTextos(textosDeAcoes)
const aExcluir = ref<TarefaDoProjeto | null>(null)
const acoesDaLinha = (x: TarefaDoProjeto): DropdownMenuItem[][] => [
  [
    { label: tac.value.abrir, icon: 'i-lucide-panel-right-open', onSelect: () => abrir(x.id) },
    x.status === 'concluida'
      ? { label: rt.value.reabrir, icon: 'i-lucide-rotate-ccw', onSelect: () => alternar(x) }
      : { label: rt.value.concluir, icon: 'i-lucide-circle-check', onSelect: () => alternar(x) },
    { label: tac.value.copiarLink, icon: 'i-lucide-link', onSelect: () => toast.add({ title: tac.value.linkCopiado, icon: 'i-lucide-check', color: 'success' }) },
  ],
  [{ label: tt.value.detalhe.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => { aExcluir.value = x } }],
]
function excluir() {
  const x = aExcluir.value
  if (!x) return
  const m = md.marcoDaTarefa(x.id)
  if (m) md.tirarTarefa(m, x.id)
  prj.excluirTarefa(x.id)
  aExcluir.value = null
  toast.add({ title: tt.value.detalhe.excluida(x.titulo), icon: 'i-lucide-trash-2', color: 'neutral' })
}

/* ---------- quadro: o EnKanbanBoard do SDK, 1 coluna por status, arrastar troca o status ---------- */
const colunasDoQuadro = computed<EnKanbanColumn[]>(() => STATUS.map(s => ({ value: s, label: rt.value.status[s], colorScheme: COR_DO_STATUS[s] })))
/**
 * O cartão do EnKanbanBoard tem altura fixa: com o avatar, o texto de apoio fica sem espaço. Por isso o vínculo
 * (item ou Sem item) e a divisão (Subtarefas: 1 de 3, ou Subtarefa, com a mãe na dica) vão como etiquetas do cartão. A etiqueta longa "Parte de" estourava a largura do cartão.
 */
const divisaoDe = (x: TarefaDoProjeto) => {
  if (x.mae) return `mae:${x.mae}`
  const subs = subsDe(x)
  return subs.length ? `sub:${subs.filter(y => y.status === 'concluida').length}:${subs.length}` : undefined
}
const cartoes = computed(() => doQuadro.value.map(x => ({
  id: x.id,
  titulo: x.titulo,
  status: x.status,
  prazo: x.prazo,
  vinculo: x.item ?? 'sem-item',
  divisao: divisaoDe(x),
  responsavel: { id: x.responsavel, fullname: pessoa(x.responsavel)?.nome ?? '' },
})))
const cartao = computed<EnKanbanCardConfig>(() => ({
  header: 'titulo',
  content: 'semTexto',
  dueDateField: { refId: 'prazo', name: rt.value.colPrazo },
  userField: { refId: 'responsavel', name: rt.value.colResponsavel },
  tags: [
    {
      refId: 'vinculo',
      name: rt.value.colItem,
      options: [
        { value: 'sem-item', label: tt.value.semItem, icon: 'i-lucide-circle-dashed', colorScheme: 'neutral' },
        ...todas.value.filter(x => x.item).map(x => ({ value: x.item!, label: x.item!, icon: iconeDaCategoria(x.categoria), colorScheme: 'info' })),
      ],
    },
    {
      refId: 'divisao',
      name: tt.value.detalhe.subtarefas,
      options: [...new Set(todas.value.map(divisaoDe).filter((v): v is string => !!v))].map((v) => {
        const [tipo, a, b] = v.split(':')
        return tipo === 'mae'
          ? { value: v, label: tt.value.ehSubtarefa, icon: 'i-lucide-corner-left-up', colorScheme: 'neutral', description: tt.value.parteDe(tituloDe(Number(a))) }
          : { value: v, label: `${a}/${b}`, icon: 'i-lucide-list-checks', colorScheme: a === b ? 'success' : 'neutral', description: tt.value.contagemSub(Number(a), Number(b)) }
      }),
    },
  ],
}))
function mover(c: unknown, _campo: string, valor: string) {
  const id = Number((c as { id: number }).id)
  const x = prj.tarefas.value.find(t => t.id === id)
  const s = valor as StatusDaTarefa
  if (!x || x.status === s) return
  prj.atualizarTarefa(id, { status: s })
  if (s === 'concluida' && ofertarSubtarefas(x)) return
  toast.add({ title: tt.value.quadro.movida(x.titulo, rt.value.status[s]), icon: 'i-lucide-move', color: 'neutral' })
}

/* ---------- criação rápida no pé da tabela: título e Enter criam a tarefa sem item ---------- */
const rapida = ref('')
function criarRapida(status: StatusDaTarefa = 'aberta') {
  const v = rapida.value.trim()
  if (!v) return
  prj.criarTarefa({ titulo: v, categoria: null, item: null, projeto: props.id, responsavel: prj.eu.value, prazo: HOJE, prioridade: 'media', status })
  rapida.value = ''
  toast.add({ title: tt.value.rapida.criada(v), icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <section class="overflow-hidden rounded-lg border border-default bg-default animate-[entrada_0.2s_ease-out_both]" :class="marca">
    <!-- rodada 10: as visualizações Tabela e Quadro, como a lista da categoria e as Tarefas rápidas do produto -->
    <div class="flex items-center gap-1 border-b border-default px-3 py-2">
      <UButton icon="i-lucide-table" :label="tt.vistas.tabela" size="sm" :color="vista === 'tabela' ? 'primary' : 'neutral'" :variant="vista === 'tabela' ? 'soft' : 'ghost'" :aria-pressed="vista === 'tabela'" @click="vista = 'tabela'" />
      <UButton icon="i-lucide-kanban" :label="tt.vistas.quadro" size="sm" :color="vista === 'quadro' ? 'primary' : 'neutral'" :variant="vista === 'quadro' ? 'soft' : 'ghost'" :aria-pressed="vista === 'quadro'" @click="vista = 'quadro'" />
    </div>

    <!-- barra: TablesPartsDataToolbar (busca, período, limpar; à direita Colunas, Nova tarefa e a linha de filtros) -->
    <div class="flex flex-wrap items-center gap-1.5 border-b border-default px-3 py-2 sm:px-4">
      <UChip :show="!!busca.trim()" color="error" size="sm">
        <UInput v-model="busca" :placeholder="rt.buscar" icon="i-lucide-search" size="sm" variant="soft" class="w-56" :aria-label="rt.buscar">
          <template v-if="busca" #trailing>
            <UButton icon="i-lucide-circle-x" color="neutral" variant="link" size="xs" :aria-label="t.diretorio.limparBusca" @click="busca = ''" />
          </template>
        </UInput>
      </UChip>
      <USelectMenu v-model="periodo" :items="opPeriodo" value-key="value" :search-input="false" icon="i-lucide-calendar" size="sm" variant="soft" class="w-44" :aria-label="t.diretorio.periodo" />
      <UTooltip v-if="temFiltro" :text="rt.limparFiltros">
        <UButton icon="i-lucide-filter-x" color="neutral" variant="ghost" size="sm" class="text-error" :aria-label="rt.limparFiltros" @click="limparFiltros" />
      </UTooltip>
      <p class="ml-3 hidden truncate text-xs text-muted xl:block">{{ rt.dica }}</p>
      <div class="ml-auto flex items-center gap-1.5">
        <UPopover v-if="vista === 'tabela'" :content="{ align: 'end' }">
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
        <UButton :label="r.menu.novaTarefa" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" @click="prj.janelas.novaTarefa.value = id" />
        <UTooltip :text="mostrarRapidos ? t.diretorio.recolherFiltros : t.diretorio.expandirFiltros">
          <UChip :show="rapidosAtivos > 0 && !mostrarRapidos" :text="rapidosAtivos" color="primary" size="xl">
            <UButton
              :icon="mostrarRapidos ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="mostrarRapidos ? t.diretorio.recolherFiltros : t.diretorio.expandirFiltros"
              :aria-expanded="mostrarRapidos"
              @click="mostrarRapidos = !mostrarRapidos"
            />
          </UChip>
        </UTooltip>
      </div>
    </div>

    <!-- filtros rápidos, todos numa linha: Status (só na tabela), Responsável, Categoria, Atrasadas, Minhas tarefas -->
    <div v-if="mostrarRapidos" class="flex items-center gap-2 overflow-x-auto border-b border-default px-3 py-1.5 sm:px-4">
      <USelectMenu v-if="vista === 'tabela'" v-model="fStatus" :items="opStatus" value-key="value" multiple :search-input="false" size="sm" variant="soft" :icon="fStatus.length ? 'i-lucide-filter' : 'i-lucide-circle-dot'" class="w-36 shrink-0" :ui="{ base: fStatus.length ? 'text-primary' : '' }" :aria-label="rt.filtroStatus">
        <template #default>{{ rotuloDoFiltro(rt.filtroStatus, fStatus.length) }}</template>
      </USelectMenu>
      <USelectMenu v-model="fResp" :items="opResp" value-key="value" multiple size="sm" variant="soft" :icon="fResp.length ? 'i-lucide-filter' : 'i-lucide-user-round'" class="w-40 shrink-0" :ui="{ base: fResp.length ? 'text-primary' : '' }" :aria-label="rt.filtroResponsavel">
        <template #default>{{ rotuloDoFiltro(rt.filtroResponsavel, fResp.length) }}</template>
      </USelectMenu>
      <USelectMenu v-model="fCat" :items="opCat" value-key="value" multiple :search-input="false" size="sm" variant="soft" :icon="fCat.length ? 'i-lucide-filter' : 'i-lucide-folder'" class="w-40 shrink-0" :ui="{ base: fCat.length ? 'text-primary' : '' }" :aria-label="rt.filtroCategoria">
        <template #default>{{ rotuloDoFiltro(rt.filtroCategoria, fCat.length) }}</template>
      </USelectMenu>
      <UButton :label="rt.atrasadas" icon="i-lucide-alarm-clock" size="sm" class="shrink-0" :color="soAtrasadas ? 'error' : 'neutral'" :variant="soAtrasadas ? 'subtle' : 'soft'" :aria-pressed="soAtrasadas" @click="soAtrasadas = !soAtrasadas" />
      <UButton :label="rt.minhas" icon="i-lucide-user-round-check" size="sm" class="shrink-0" :color="soMinhas ? 'primary' : 'neutral'" :variant="soMinhas ? 'subtle' : 'soft'" :aria-pressed="soMinhas" @click="soMinhas = !soMinhas" />
      <USwitch v-model="mostrarSubtarefas" :label="tt.mostrarSubtarefas" size="sm" class="ml-auto shrink-0 whitespace-nowrap" />
      <span class="shrink-0 pl-2 text-xs text-muted">{{ rt.contagem(vista === 'tabela' ? filtradas.length : doQuadro.length) }}</span>
    </div>

    <!-- tabela: EnTable do SDK, uma informação por coluna -->
    <div v-if="vista === 'tabela'" class="pt-2">
      <EnTable
        v-model:column-visibility="colunasVisiveis"
        v-model:column-sizing="larguras"
        :columns="colunas"
        :rows="linhas"
        :sort="ordem"
        resizable
        :empty-state="{ icon: 'i-lucide-square-check', title: rt.vazio, description: '' }"
        :locale="idioma"
        @sort-change="ordem = $event"
        @row-click="(row: unknown) => abrir((row as TarefaDoProjeto).id)"
      >
        <template #cell-titulo="{ row }">
          <span class="flex min-w-0 items-center gap-1.5">
            <span class="shrink-0" @click.stop>
              <UTooltip :text="(row as TarefaDoProjeto).status === 'concluida' ? rt.reabrir : rt.concluir">
                <UButton
                  :icon="(row as TarefaDoProjeto).status === 'concluida' ? 'i-lucide-circle-check' : 'i-lucide-circle'"
                  size="xs"
                  :color="(row as TarefaDoProjeto).status === 'concluida' ? 'success' : 'neutral'"
                  variant="ghost"
                  :aria-label="(row as TarefaDoProjeto).status === 'concluida' ? rt.reabrir : rt.concluir"
                  @click="alternar(row as TarefaDoProjeto)"
                />
              </UTooltip>
            </span>
            <span class="flex min-w-0 flex-col">
              <span class="truncate text-sm font-medium" :class="(row as TarefaDoProjeto).status === 'concluida' ? 'text-muted line-through' : 'text-highlighted'">{{ (row as TarefaDoProjeto).titulo }}</span>
              <!-- rodada 10: a subtarefa diz de quem é; a tarefa-mãe diz quantas subtarefas estão concluídas -->
              <span v-if="(row as TarefaDoProjeto).mae" class="flex items-center gap-1 truncate text-[11px] text-muted">
                <UIcon name="i-lucide-corner-left-up" class="size-3 shrink-0" />{{ tt.parteDe(tituloDe((row as TarefaDoProjeto).mae)) }}
              </span>
              <span v-else-if="subsDe(row as TarefaDoProjeto).length" class="flex items-center gap-1 truncate text-[11px] text-muted">
                <UIcon name="i-lucide-list-checks" class="size-3 shrink-0" />{{ tt.contagemSub(subsDe(row as TarefaDoProjeto).filter(s => s.status === 'concluida').length, subsDe(row as TarefaDoProjeto).length) }}
              </span>
            </span>
          </span>
        </template>
        <template #cell-item="{ row }">
          <UBadge v-if="(row as TarefaDoProjeto).item" color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as TarefaDoProjeto).item }}</UBadge>
          <span v-else class="flex items-center gap-1 text-sm text-muted"><UIcon name="i-lucide-circle-dashed" class="size-3.5" />{{ tt.semItem }}</span>
        </template>
        <template #cell-categoria="{ row }">
          <span v-if="(row as TarefaDoProjeto).categoria === null" class="text-sm text-dimmed">{{ tt.semItem }}</span>
          <span v-else class="flex min-w-0 items-center gap-1.5 text-sm text-toned">
            <UIcon :name="iconeDaCategoria((row as TarefaDoProjeto).categoria)" class="size-3.5 shrink-0 text-muted" />
            <span class="truncate">{{ nomeDaCategoria((row as TarefaDoProjeto).categoria) }}</span>
          </span>
        </template>
        <template #cell-responsavel="{ row }">
          <span class="flex min-w-0 items-center gap-2">
            <UAvatar size="2xs" :text="iniciais(pessoa((row as TarefaDoProjeto).responsavel)?.nome ?? '')" :alt="pessoa((row as TarefaDoProjeto).responsavel)?.nome" />
            <span class="truncate text-sm text-default">{{ pessoa((row as TarefaDoProjeto).responsavel)?.nome }}</span>
          </span>
        </template>
        <template #cell-prazo="{ row }">
          <span class="flex items-center gap-1.5 whitespace-nowrap text-sm" :class="vencida(row as TarefaDoProjeto) ? 'text-error' : 'text-default'">
            {{ formatarData((row as TarefaDoProjeto).prazo) }}
            <UBadge v-if="vencida(row as TarefaDoProjeto)" :label="rt.vencida" color="error" variant="subtle" size="sm" />
            <UBadge v-else-if="venceHoje(row as TarefaDoProjeto)" :label="rt.venceHoje" color="warning" variant="subtle" size="sm" />
          </span>
        </template>
        <template #cell-status="{ row }">
          <UBadge :label="rt.status[(row as TarefaDoProjeto).status]" :color="COR_DO_STATUS[(row as TarefaDoProjeto).status]" variant="subtle" size="sm" />
        </template>
        <!-- rodada 9: o marco da tarefa, trocado na própria linha por quem administra o projeto -->
        <template #cell-marco="{ row }">
          <span v-if="podeEditarMarcos" class="block w-full" @click.stop>
            <USelectMenu
              v-model:search-term="buscaMarco"
              :model-value="md.marcoDaTarefa((row as TarefaDoProjeto).id)?.id ?? 0"
              :items="opMarcos"
              value-key="value"
              size="xs"
              variant="ghost"
              class="w-full"
              :ui="{ content: 'min-w-64' }"
              :aria-label="tmm.marcos.colMarco"
              @update:model-value="(v: number) => md.definirMarcoDaTarefa((row as TarefaDoProjeto).id, v || null)"
            >
              <template #content-bottom>
                <AtalhoDeCriar :termo="buscaMarco" :rotulo="ta.marco.rotulo" :com="ta.marco.com" :dica="ta.marco.dica" @criar="(t: string) => criarMarcoNaLinha(row as TarefaDoProjeto, t)" />
              </template>
            </USelectMenu>
          </span>
          <span v-else class="truncate text-sm" :class="md.marcoDaTarefa((row as TarefaDoProjeto).id) ? 'text-default' : 'text-muted'">
            {{ md.marcoDaTarefa((row as TarefaDoProjeto).id)?.nome ?? tmm.marcos.semMarco }}
          </span>
        </template>
        <template #cell-prioridade="{ row }">
          <UBadge :label="rt.prioridade[(row as TarefaDoProjeto).prioridade]" :color="COR_DA_PRIORIDADE[(row as TarefaDoProjeto).prioridade]" variant="soft" size="sm" />
        </template>
        <template #cell-criadaEm="{ row }">
          <span class="whitespace-nowrap text-sm text-muted">{{ formatarData((row as TarefaDoProjeto).criadaEm) }}</span>
        </template>
        <template #cell-acoes="{ row }">
          <span class="flex justify-end" @click.stop>
            <UDropdownMenu :items="acoesDaLinha(row as TarefaDoProjeto)" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" :aria-label="tac.de((row as TarefaDoProjeto).titulo)" />
            </UDropdownMenu>
          </span>
        </template>
      </EnTable>
      <!-- rodada 10: criação rápida no pé da tabela, como o "Add item" do GitHub Projects -->
      <div class="flex flex-wrap items-center gap-2 border-t border-default px-3 py-2 sm:px-4">
        <UInput v-model="rapida" :placeholder="tt.rapida.placeholder" icon="i-lucide-plus" size="sm" variant="ghost" class="min-w-64 flex-1" :aria-label="tt.rapida.placeholder" @keydown.enter.prevent="criarRapida()">
          <template #trailing>
            <UKbd v-if="rapida.trim()" :value="tt.rapida.atalho" size="sm" />
          </template>
        </UInput>
        <UTooltip :text="tt.rapida.formularioDica">
          <UButton :label="tt.rapida.formulario" icon="i-lucide-link-2" size="sm" color="neutral" variant="outline" @click="prj.janelas.novaTarefa.value = id" />
        </UTooltip>
      </div>
      <Paginador v-model:pagina="pagina" v-model:por-pagina="porPagina" :t="t" :total="filtradas.length" />
    </div>

    <!-- quadro: EnKanbanBoard do SDK, 1 coluna por status; arrastar troca o status, o cartão abre a tarefa -->
    <ClientOnly v-else>
      <div class="p-3 animate-[entrada_.25s_ease-out]">
        <EnKanbanBoard
          :data="cartoes"
          :card-map="cartao"
          :columns="colunasDoQuadro"
          group-by="status"
          primary-key="id"
          :stagger-column-ms="60"
          :locale="idioma"
          @drop="mover"
          :on-move-to="(c: unknown, valor: string) => mover(c, 'status', valor)"
          :on-open-page="(c: unknown) => abrir(Number((c as { id: number }).id))"
          :handle-copy-external-link="() => toast.add({ title: tt.detalhe.linkCopiado, icon: 'i-lucide-check', color: 'success' })"
          :on-archive-card="() => toast.add({ title: tt.quadro.arquivar, icon: 'i-lucide-archive', color: 'neutral' })"
          @card-click="(c: unknown) => abrir(Number((c as { id: number }).id))"
        />
      </div>
    </ClientOnly>

    <!-- rodada 12: excluir pela coluna Ações pede a mesma confirmação do painel da tarefa -->
    <UModal :open="!!aExcluir" :title="tt.detalhe.excluirTitulo" :description="aExcluir ? tt.detalhe.excluirTexto(subsDe(aExcluir).length) : ''" :ui="{ content: 'max-w-md', footer: 'justify-end gap-2' }" @update:open="(v: boolean) => { if (!v) aExcluir = null }">
      <template #footer>
        <UButton :label="tt.detalhe.cancelar" color="neutral" variant="outline" @click="aExcluir = null" />
        <UButton :label="tt.detalhe.excluir" icon="i-lucide-trash-2" color="error" @click="excluir" />
      </template>
    </UModal>
  </section>
</template>
