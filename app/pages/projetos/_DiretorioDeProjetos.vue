<script setup lang="ts">
/**
 * PROPOSTA: o diretório de projetos (/workspaces/{ws}/projects), no lugar da página órfã de hoje.
 * É a tela que abre quando a pessoa clica em Projetos (rodada 4).
 *
 * A tela segue o esquema das listagens do develop (Logs de auditoria, Relatórios, Itens, Tarefas,
 * Execuções), lido no código em 2026-11-26:
 *  - barra `TablesPartsDataToolbar`: busca com o ponto vermelho quando há termo, período, "Limpar
 *    filtros", Colunas e o botão que mostra a linha de filtros rápidos;
 *  - tabela: o `EnTable` do SDK (o porte do `EntityRendererManyTable` do produto), com ordenação e
 *    colunas que se escondem;
 *  - paginador `EntityRendererPaginator` (_Paginador.vue).
 * Visualizações em botão, como nas categorias: Todos, De que participo, Arquivados.
 * A ação da linha depende do acesso: Mostrar no meu menu, Pedir acesso ou Restaurar.
 * "Criar projeto" fica no topo, à direita (regra 16: ação do topo continua no topo).
 */
import type { EnTableColumn, EnTableColumnVisibility, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { iniciais, pessoa, type Projeto, type Situacao, type Visibilidade } from './mocks'
import { COR_DA_SITUACAO, COR_DO_PROJETO, ICONE_DA_SITUACAO, ICONE_DA_VISIBILIDADE, useMarcaDeProposta, useProjetos } from './estado'
import Paginador from './_Paginador.vue'

const props = defineProps<{ t: Textos }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()
const td = computed(() => props.t.diretorio)

type Vista = 'todos' | 'meus' | 'arquivados'
type Periodo = 'todos' | 'd30' | 'd90' | 'ano'
const vista = ref<Vista>('todos')
const busca = ref('')
const periodo = ref<Periodo>('todos')
const fVisibilidade = ref<Visibilidade[]>([])
const fSituacao = ref<(Situacao | 'sem')[]>([])
const fAdmin = ref<number[]>([])
const mostrarRapidos = ref(true)
const pagina = ref(1)
const porPagina = ref(25)
const ordem = ref<EnTableSort | null>({ key: 'nome', direction: 'asc' })
const colunasVisiveis = ref<EnTableColumnVisibility>({})

watch([vista, busca, periodo, fVisibilidade, fSituacao, fAdmin, porPagina], () => { pagina.value = 1 }, { deep: true })

const HOJE = new Date('2026-11-26T12:00:00')
const DIAS: Record<Periodo, number> = { todos: 0, d30: 30, d90: 90, ano: 365 }
const rapidosAtivos = computed(() => fVisibilidade.value.length + fSituacao.value.length + fAdmin.value.length)
const temFiltro = computed(() => !!busca.value.trim() || periodo.value !== 'todos' || rapidosAtivos.value > 0)
function limparFiltros() {
  busca.value = ''
  periodo.value = 'todos'
  fVisibilidade.value = []
  fSituacao.value = []
  fAdmin.value = []
}

const base = computed(() => {
  if (vista.value === 'arquivados') {
    return prj.projetos.value.filter(p => p.status === 'arquivado' && prj.podeAdministrar(p))
  }
  const ativos = prj.visiveis.value
  return vista.value === 'meus' ? ativos.filter(p => prj.participa(p) || prj.papel(p) === 'dono') : ativos
})

function adminsDe(p: Projeto) {
  return p.participantes.filter(x => x.tipo === 'pessoa' && x.papel === 'admin').map(x => pessoa(x.id as number)!).filter(Boolean)
}
const situacaoDe = (p: Projeto): Situacao | 'sem' => prj.statusAtual(p)?.situacao ?? 'sem'

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  const dias = DIAS[periodo.value]
  return base.value.filter((p) => {
    if (q && !p.nome.toLowerCase().includes(q)) return false
    if (dias && (HOJE.getTime() - new Date(`${p.criadoEm}T12:00:00`).getTime()) / 864e5 > dias) return false
    if (fVisibilidade.value.length && !fVisibilidade.value.includes(p.visibilidade)) return false
    if (fSituacao.value.length && !fSituacao.value.includes(situacaoDe(p))) return false
    if (fAdmin.value.length && !adminsDe(p).some(a => fAdmin.value.includes(a.id))) return false
    return true
  })
})

interface Linha { id: number, projeto: Projeto, nome: string, visibilidade: string, admins: string, participantes: number, categorias: number, criado: string, acao: string }

const todas = computed<Linha[]>(() => filtrados.value.map(p => ({
  id: p.id,
  projeto: p,
  nome: p.nome,
  visibilidade: p.visibilidade,
  admins: '',
  participantes: prj.quantosVeem(p, true),
  categorias: prj.categoriasDe(p.id).length,
  criado: p.criadoEm,
  acao: '',
})))
const ordenadas = computed(() => {
  const o = ordem.value
  if (!o) return todas.value
  const k = o.key as keyof Linha
  const sinal = o.direction === 'asc' ? 1 : -1
  return [...todas.value].sort((a, b) => {
    const x = a[k] as string | number
    const y = b[k] as string | number
    return (typeof x === 'number' ? x - (y as number) : String(x).localeCompare(String(y), idioma.value)) * sinal
  })
})
const linhas = computed(() => ordenadas.value.slice((pagina.value - 1) * porPagina.value, pagina.value * porPagina.value))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'nome', label: td.value.colunaNome, sortable: true },
  { key: 'visibilidade', label: td.value.colunaVisibilidade },
  { key: 'situacao', label: props.t.situacao.coluna },
  { key: 'admins', label: td.value.colunaAdmins },
  { key: 'participantes', label: td.value.colunaParticipantes, sortable: true },
  { key: 'categorias', label: td.value.colunaCategorias, sortable: true },
  { key: 'criado', label: td.value.colunaCriado, sortable: true },
  { key: 'acao', label: td.value.colunaAcao, align: 'right' },
])
function alternarColuna(key: string, ver: boolean | 'indeterminate') {
  colunasVisiveis.value = { ...colunasVisiveis.value, [key]: ver === true }
}

const vistas = computed(() => [
  { v: 'todos' as const, r: td.value.filtroTodos, i: 'i-lucide-folder-kanban' },
  { v: 'meus' as const, r: td.value.filtroMeus, i: 'i-lucide-user-round-check' },
  ...(prj.projetos.value.some(p => p.status === 'arquivado' && prj.podeAdministrar(p)) || prj.souDono.value
    ? [{ v: 'arquivados' as const, r: td.value.filtroArquivados, i: 'i-lucide-archive' }]
    : []),
])

const opcoesDePeriodo = computed(() => (['todos', 'd30', 'd90', 'ano'] as const).map(v => ({ value: v, label: td.value.periodos[v] })))
const opcoesDeVisibilidade = computed(() => (['aberto', 'fechado', 'privado'] as const).map(v => ({ value: v, label: props.t.visibilidade[v], icon: ICONE_DA_VISIBILIDADE[v] })))
const opcoesDeSituacao = computed(() => [
  ...(['noPrazo', 'emRisco', 'atrasado', 'concluido'] as const).map(v => ({ value: v, label: props.t.situacao[v], icon: ICONE_DA_SITUACAO[v] })),
  { value: 'sem' as const, label: props.t.situacao.semStatus, icon: 'i-lucide-circle-dashed' },
])
const opcoesDeAdmin = computed(() => {
  const vistos = new Map<number, string>()
  base.value.forEach(p => adminsDe(p).forEach(a => vistos.set(a.id, a.nome)))
  return [...vistos].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label))
})
const rotuloDoFiltro = (nome: string, n: number) => n ? `${nome} (${n})` : nome

function mostrar(p: Projeto) {
  prj.mostrarNoMenu(p.id)
  toast.add({ title: td.value.mostrado(p.nome), icon: 'i-lucide-check', color: 'success' })
}
function pedir(p: Projeto) {
  prj.pedirAcesso(p.id)
  toast.add({ title: td.value.pedidoEnviado(p.nome), icon: 'i-lucide-send', color: 'success' })
}
function restaurar(p: Projeto) {
  prj.restaurar(p.id)
  toast.add({ title: td.value.restaurado(p.nome), icon: 'i-lucide-archive-restore', color: 'success' })
}

const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value)
</script>

<template>
  <div class="flex flex-col" :class="marca">
    <!-- cabeçalho da tela, como o das categorias -->
    <div class="flex flex-wrap items-start gap-3 px-6 pb-3 pt-5">
      <div class="min-w-0 flex-1">
        <h1 class="text-xl font-semibold text-highlighted">{{ td.titulo }}</h1>
        <p class="mt-0.5 text-sm text-muted">{{ td.subtitulo }}</p>
      </div>
      <UButton v-if="prj.souDono.value" :label="t.criar.titulo" icon="i-lucide-plus" color="primary" size="sm" @click="prj.janelas.criar.value = true" />
    </div>

    <!-- workspace sem projetos -->
    <div v-if="!prj.projetos.value.length" class="flex flex-col items-center gap-3 border-t border-default px-6 py-16 text-center animate-[entrada_0.2s_ease-out_both]">
      <span class="flex size-12 items-center justify-center rounded-xl bg-elevated"><UIcon name="i-lucide-folder-kanban" class="size-6 text-muted" /></span>
      <p class="text-base font-semibold text-highlighted">{{ td.vazioTitulo }}</p>
      <p class="max-w-md text-sm text-muted">{{ td.vazioTexto }}</p>
      <UButton v-if="prj.souDono.value" :label="t.criar.titulo" icon="i-lucide-plus" color="neutral" variant="outline" @click="prj.janelas.criar.value = true" />
    </div>

    <template v-else>
      <!-- visualizações em botão -->
      <div class="flex items-center gap-1 border-b border-default px-4 py-2">
        <UButton
          v-for="o in vistas"
          :key="o.v"
          :icon="o.i"
          :label="o.r"
          size="sm"
          :color="vista === o.v ? 'primary' : 'neutral'"
          :variant="vista === o.v ? 'soft' : 'ghost'"
          :aria-pressed="vista === o.v"
          @click="vista = o.v"
        />
      </div>

      <!-- barra: TablesPartsDataToolbar -->
      <div class="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-default px-3 py-2 sm:px-4">
        <UChip :show="!!busca.trim()" color="error" size="sm">
          <UInput v-model="busca" :placeholder="td.buscar" icon="i-lucide-search" size="sm" variant="soft" class="w-48" :aria-label="td.buscar" :ui="{ trailing: 'pe-1' }">
            <template v-if="busca" #trailing>
              <UButton icon="i-lucide-circle-x" color="neutral" variant="link" size="xs" :aria-label="td.limparBusca" @click="busca = ''" />
            </template>
          </UInput>
        </UChip>
        <USelectMenu
          v-model="periodo"
          :items="opcoesDePeriodo"
          value-key="value"
          :search-input="false"
          icon="i-lucide-calendar"
          size="sm"
          variant="soft"
          class="w-44"
          :aria-label="td.periodo"
        />
        <UTooltip v-if="temFiltro" :text="td.limparFiltros">
          <UButton icon="i-lucide-filter-x" color="neutral" variant="ghost" size="sm" class="text-error" :aria-label="td.limparFiltros" @click="limparFiltros" />
        </UTooltip>

        <div class="ml-auto flex items-center gap-1.5">
          <UPopover :content="{ align: 'end' }">
            <UTooltip :text="td.colunas">
              <UButton icon="i-lucide-columns-3" color="neutral" variant="ghost" size="sm" class="text-dimmed" :aria-label="td.colunas" />
            </UTooltip>
            <template #content>
              <div class="w-56 space-y-3 p-3">
                <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ td.colunasVisiveis }}</p>
                <div class="space-y-1">
                  <UCheckbox
                    v-for="c in colunas"
                    :key="c.key"
                    :label="c.label"
                    :model-value="colunasVisiveis[c.key] !== false"
                    :disabled="c.key === 'nome'"
                    class="rounded-md px-1.5 py-1 hover:bg-elevated/80"
                    @update:model-value="alternarColuna(c.key, $event)"
                  />
                </div>
              </div>
            </template>
          </UPopover>
          <UTooltip :text="mostrarRapidos ? td.recolherFiltros : td.expandirFiltros">
            <UChip :show="rapidosAtivos > 0 && !mostrarRapidos" :text="rapidosAtivos" color="primary" size="xl">
              <UButton
                :icon="mostrarRapidos ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                :color="rapidosAtivos > 0 && !mostrarRapidos ? 'primary' : 'neutral'"
                :variant="rapidosAtivos > 0 && !mostrarRapidos ? 'subtle' : 'ghost'"
                size="sm"
                :aria-label="mostrarRapidos ? td.recolherFiltros : td.expandirFiltros"
                :aria-expanded="mostrarRapidos"
                @click="mostrarRapidos = !mostrarRapidos"
              />
            </UChip>
          </UTooltip>
        </div>
      </div>

      <!-- linha de filtros rápidos (slot filter-bar da mesma barra) -->
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-20 opacity-100"
        leave-from-class="max-h-20 opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div v-if="mostrarRapidos" class="flex shrink-0 flex-wrap items-center gap-2 overflow-hidden border-b border-default px-3 py-1.5 sm:px-4">
          <USelectMenu
            v-model="fVisibilidade"
            :items="opcoesDeVisibilidade"
            value-key="value"
            multiple
            :search-input="false"
            size="sm"
            variant="soft"
            :icon="fVisibilidade.length ? 'i-lucide-filter' : 'i-lucide-globe'"
            :placeholder="td.filtroVisibilidade"
            class="w-44"
            :ui="{ base: fVisibilidade.length ? 'text-primary' : '' }"
            :aria-label="td.filtroVisibilidade"
          >
            <template #default>{{ rotuloDoFiltro(td.filtroVisibilidade, fVisibilidade.length) }}</template>
          </USelectMenu>
          <USelectMenu
            v-model="fSituacao"
            :items="opcoesDeSituacao"
            value-key="value"
            multiple
            :search-input="false"
            size="sm"
            variant="soft"
            :icon="fSituacao.length ? 'i-lucide-filter' : 'i-lucide-activity'"
            :placeholder="td.filtroSituacao"
            class="w-44"
            :ui="{ base: fSituacao.length ? 'text-primary' : '' }"
            :aria-label="td.filtroSituacao"
          >
            <template #default>{{ rotuloDoFiltro(td.filtroSituacao, fSituacao.length) }}</template>
          </USelectMenu>
          <USelectMenu
            v-model="fAdmin"
            :items="opcoesDeAdmin"
            value-key="value"
            multiple
            size="sm"
            variant="soft"
            :icon="fAdmin.length ? 'i-lucide-filter' : 'i-lucide-shield-user'"
            :placeholder="td.filtroAdmin"
            class="w-48"
            :ui="{ base: fAdmin.length ? 'text-primary' : '' }"
            :aria-label="td.filtroAdmin"
          >
            <template #default>{{ rotuloDoFiltro(td.filtroAdmin, fAdmin.length) }}</template>
          </USelectMenu>
          <span class="ml-auto text-xs text-muted">{{ td.contagem(filtrados.length) }}</span>
        </div>
      </Transition>

      <!-- tabela: EnTable do SDK -->
      <div class="relative w-full pt-2 animate-[entrada_.25s_ease-out]">
        <EnTable
          v-model:column-visibility="colunasVisiveis"
          :columns="colunas"
          :rows="linhas"
          :sort="ordem"
          :empty-state="{ icon: 'i-lucide-search-x', title: td.vazioBusca, description: '' }"
          :locale="idioma"
          @sort-change="ordem = $event"
          @row-click="(r) => prj.abrirProjeto((r as Linha).id)"
        >
          <template #cell-nome="{ row }">
            <span class="flex min-w-0 items-center gap-2">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-md" :class="COR_DO_PROJETO[(row as Linha).projeto.cor]">
                <UIcon :name="(row as Linha).projeto.icone" class="size-4" />
              </span>
              <span class="min-w-0">
                <span class="block max-w-72 truncate text-sm font-medium text-highlighted">{{ (row as Linha).nome }}</span>
                <span v-if="(row as Linha).projeto.descricao" class="block max-w-72 truncate text-xs text-muted">{{ (row as Linha).projeto.descricao }}</span>
              </span>
            </span>
          </template>
          <template #cell-situacao="{ row }">
            <UBadge
              v-if="prj.statusAtual((row as Linha).projeto)"
              :label="t.situacao[prj.statusAtual((row as Linha).projeto)!.situacao]"
              :icon="ICONE_DA_SITUACAO[prj.statusAtual((row as Linha).projeto)!.situacao]"
              :color="COR_DA_SITUACAO[prj.statusAtual((row as Linha).projeto)!.situacao]"
              variant="subtle"
              size="sm"
            />
            <span v-else class="text-sm text-dimmed">{{ t.situacao.semStatus }}</span>
          </template>
          <template #cell-visibilidade="{ row }">
            <UBadge
              :label="t.visibilidade[(row as Linha).projeto.visibilidade]"
              :icon="ICONE_DA_VISIBILIDADE[(row as Linha).projeto.visibilidade]"
              color="neutral"
              variant="subtle"
              size="sm"
            />
          </template>
          <template #cell-admins="{ row }">
            <UAvatarGroup size="2xs" :max="3">
              <UTooltip v-for="a in adminsDe((row as Linha).projeto)" :key="a.id" :text="a.nome">
                <UAvatar :text="iniciais(a.nome)" :alt="a.nome" />
              </UTooltip>
            </UAvatarGroup>
          </template>
          <template #cell-participantes="{ row }">
            <span class="text-sm text-default">{{ td.pessoas((row as Linha).participantes) }}</span>
          </template>
          <template #cell-categorias="{ row }">
            <span class="text-sm text-default">{{ (row as Linha).categorias }}</span>
          </template>
          <template #cell-criado="{ row }">
            <span class="text-sm text-muted">{{ formatarData((row as Linha).criado) }}</span>
          </template>
          <template #cell-acao="{ row }">
            <span class="flex justify-end" @click.stop>
              <template v-if="(row as Linha).projeto.status === 'arquivado'">
                <UButton :label="td.restaurar" icon="i-lucide-archive-restore" size="xs" color="neutral" variant="outline" @click="restaurar((row as Linha).projeto)" />
              </template>
              <template v-else-if="!prj.entra((row as Linha).projeto)">
                <UBadge v-if="prj.pedidos.value.includes((row as Linha).id)" :label="td.pedido" icon="i-lucide-clock" color="neutral" variant="soft" size="sm" />
                <UButton v-else :label="td.pedir" icon="i-lucide-key-round" size="xs" color="neutral" variant="outline" @click="pedir((row as Linha).projeto)" />
              </template>
              <template v-else>
                <UBadge v-if="prj.estaNoMenu((row as Linha).id)" :label="td.noMenu" icon="i-lucide-check" color="success" variant="soft" size="sm" />
                <UButton v-else :label="td.mostrar" icon="i-lucide-panel-left" size="xs" color="neutral" variant="outline" @click="mostrar((row as Linha).projeto)" />
              </template>
            </span>
          </template>
        </EnTable>
      </div>

      <!-- paginador: EntityRendererPaginator -->
      <Paginador v-model:pagina="pagina" v-model:por-pagina="porPagina" :t="t" :total="filtrados.length" />
    </template>
  </div>
</template>
