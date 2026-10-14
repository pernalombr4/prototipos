<script setup lang="ts">
/**
 * PROPOSTA: a tela de exportações na tabela nova do ENSPACE.
 *
 * Mesma anatomia da tabela nova de itens (aba, barra de busca e período,
 * "Filtros Rápidos", `EnTable`, rodapé de paginação), para a tela parecer
 * da mesma família das telas novas e não da tela antiga de hoje.
 *
 * O que muda em relação a `/myReports` de hoje:
 * - cada linha diz o que é: origem, visualização, modelo, formato, registros,
 *   filtros, tamanho e data com hora (hoje: "-" em 5 de 8 colunas);
 * - status com 4 estados e o progresso de quem está gerando;
 * - Baixar na própria linha, sem abrir menu;
 * - clique na linha abre o painel de detalhes (`_PainelDoRelatorio.vue`);
 * - busca, período, filtros por status, origem e formato, e colunas.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnTableColumn, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import type { Formato, PedidoDeRelatorio, StatusDoPedido } from './mocks'
import type { FiltrosDaTela, Periodo, Rapido } from './relatorios'
import {
  COR_DO_FORMATO, COR_DO_STATUS, ICONE_DO_FORMATO, ICONE_DO_STATUS, casaRapido, dataCurta, filtrar,
  nomeDaOrigem, origensDaLista, tamanho,
} from './relatorios'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  nomeDaTela: string
  pedidos: PedidoDeRelatorio[]
  estado: 'cheio' | 'carregando' | 'vazio' | 'erro'
  /** O relatório aberto no painel, para marcar a linha. */
  aberto: number | null
}>()

const emit = defineEmits<{
  abrir: [id: number]
  baixar: [ids: number[]]
  excluir: [ids: number[]]
  extrairDeNovo: [id: number]
  tentarDeNovo: [id: number]
  abrirOrigem: [id: number]
  copiarLink: [id: number]
  irParaContratos: []
  recarregar: []
}>()

const idioma = useIdioma()

/* ---------- filtros ---------- */

const filtros = reactive<FiltrosDaTela>({
  busca: '',
  periodo: 'todo',
  rapido: 'todos',
  status: [],
  origem: [],
  formato: [],
})

const temFiltro = computed(() =>
  !!filtros.busca || filtros.periodo !== 'todo' || filtros.rapido !== 'todos'
  || !!filtros.status.length || !!filtros.origem.length || !!filtros.formato.length)

function limpar() {
  Object.assign(filtros, { busca: '', periodo: 'todo', rapido: 'todos', status: [], origem: [], formato: [] })
}

const semRapido = computed(() => filtrar(props.pedidos, filtros, props.t, true))
const filtrados = computed(() => semRapido.value.filter(p => casaRapido(p, filtros.rapido)))

const rapidos = computed(() => (['todos', 'gerando', 'prontos', 'falharam', 'naoBaixados'] as Rapido[]).map(r => ({
  valor: r,
  rotulo: props.t.rapidos[r],
  total: semRapido.value.filter(p => casaRapido(p, r)).length,
})))

const periodos = computed<DropdownMenuItem[]>(() => (Object.keys(props.t.barra.periodos) as Periodo[]).map(p => ({
  label: props.t.barra.periodos[p],
  type: 'checkbox' as const,
  checked: filtros.periodo === p,
  onSelect: () => { filtros.periodo = p },
})))

function alternarNa<T>(lista: T[], v: T) {
  const i = lista.indexOf(v)
  if (i >= 0) lista.splice(i, 1)
  else lista.push(v)
}

const opcoesDeStatus = computed<DropdownMenuItem[]>(() => (['pending', 'processing', 'complete', 'error'] as StatusDoPedido[]).map(s => ({
  label: props.t.status[s],
  icon: ICONE_DO_STATUS[s],
  type: 'checkbox' as const,
  checked: filtros.status.includes(s),
  onUpdateChecked: () => alternarNa(filtros.status, s),
  onSelect: (e: Event) => e.preventDefault(),
})))

const opcoesDeOrigem = computed<DropdownMenuItem[]>(() => origensDaLista(props.pedidos, props.t).map(o => ({
  label: o.label,
  icon: o.icon,
  type: 'checkbox' as const,
  checked: filtros.origem.includes(o.value),
  onUpdateChecked: () => alternarNa(filtros.origem, o.value),
  onSelect: (e: Event) => e.preventDefault(),
})))

const opcoesDeFormato = computed<DropdownMenuItem[]>(() => (['xlsx', 'csv', 'dbf'] as Formato[]).map(f => ({
  label: f.toUpperCase(),
  icon: ICONE_DO_FORMATO[f],
  type: 'checkbox' as const,
  checked: filtros.formato.includes(f),
  onUpdateChecked: () => alternarNa(filtros.formato, f),
  onSelect: (e: Event) => e.preventDefault(),
})))

/* ---------- colunas ---------- */

const visiveis = ref<Record<string, boolean>>({ modelo: true, tamanho: true })

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'relatorio', label: props.t.colunas.relatorio, sortable: true },
  { key: 'status', label: props.t.colunas.status, sortable: true },
  { key: 'modelo', label: props.t.colunas.modelo },
  { key: 'formato', label: props.t.colunas.formato },
  { key: 'registros', label: props.t.colunas.registros, sortable: true, align: 'right' },
  { key: 'filtros', label: props.t.colunas.filtros },
  { key: 'tamanho', label: props.t.colunas.tamanho, sortable: true, align: 'right' },
  { key: 'criadoEm', label: props.t.colunas.criadoEm, sortable: true },
  // A coluna de ações do EnTable tem 40 px fixos: só cabe o menu. Baixar ganha coluna própria, sem rótulo.
  { key: 'baixar', label: '', align: 'right' },
])

/** Larguras de partida. O EnTable divide igual sem isso, e o nome da origem corta. */
const larguras = { relatorio: 300, status: 150, modelo: 190, formato: 96, registros: 112, filtros: 130, tamanho: 104, criadoEm: 168, baixar: 64 }

/** Relatório, Status e Criado em não se escondem: sem elas a linha não se explica. */
const FIXAS: string[] = ['relatorio', 'status', 'criadoEm', 'baixar']

const menuDeColunas = computed<DropdownMenuItem[]>(() => colunas.value
  .filter(c => !FIXAS.includes(c.key))
  .map(c => ({
    label: c.label,
    type: 'checkbox' as const,
    checked: visiveis.value[c.key] !== false,
    onUpdateChecked: (v: boolean) => { visiveis.value = { ...visiveis.value, [c.key]: v } },
    onSelect: (e: Event) => e.preventDefault(),
  })))

/* ---------- ordenação e página ---------- */

const ordem = ref<EnTableSort>({ key: 'criadoEm', direction: 'desc' })
const pagina = ref(1)
const POR_PAGINA = 15
watch(() => [filtros.busca, filtros.periodo, filtros.rapido, filtros.status.length, filtros.origem.length, filtros.formato.length], () => { pagina.value = 1 })

const STATUS_ORDEM: Record<StatusDoPedido, number> = { processing: 0, pending: 1, error: 2, complete: 3 }

const ordenados = computed(() => {
  const dir = ordem.value.direction === 'asc' ? 1 : -1
  const valor = (p: PedidoDeRelatorio): number | string => {
    switch (ordem.value.key) {
      case 'relatorio': return nomeDaOrigem(p, props.t).toLowerCase()
      case 'status': return STATUS_ORDEM[p.status]
      case 'registros': return p.proto.registros ?? -1
      case 'tamanho': return p.processed_report?.size ?? -1
      default: return new Date(p.created_at).getTime()
    }
  }
  return [...filtrados.value].sort((a, b) => {
    const va = valor(a)
    const vb = valor(b)
    return (va < vb ? -1 : va > vb ? 1 : 0) * dir
  })
})

const paginaAtual = computed(() => ordenados.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA))

interface Linha extends Record<string, unknown> {
  id: number
  pedido: PedidoDeRelatorio
}

const linhas = computed<Linha[]>(() => paginaAtual.value.map(p => ({
  id: p.id,
  pedido: p,
  relatorio: nomeDaOrigem(p, props.t),
  status: p.status,
  modelo: p.report?.name ?? '',
  formato: p.extraction_format,
  registros: p.proto.registros,
  filtros: p.proto.filtros.length,
  tamanho: p.processed_report?.size ?? null,
  criadoEm: p.created_at,
  baixar: null,
})))

/* ---------- seleção ---------- */

const selecionadas = ref<Linha[]>([])
watch(() => props.pedidos.length, () => {
  selecionadas.value = selecionadas.value.filter(l => props.pedidos.some(p => p.id === l.id))
})
const prontasSelecionadas = computed(() => selecionadas.value.filter(l => l.pedido.status === 'complete'))

/* ---------- ações da linha ---------- */

function menuDaLinha(p: PedidoDeRelatorio): DropdownMenuItem[][] {
  const pronto = p.status === 'complete'
  return [
    // O clique na linha abre o painel; este item é o caminho de quem usa o teclado.
    [{ label: props.t.acoes.verDetalhes, icon: 'i-lucide-panel-right-open', onSelect: () => emit('abrir', p.id) }],
    [
      ...(pronto ? [{ label: props.t.acoes.baixar, icon: 'i-lucide-download', onSelect: () => emit('baixar', [p.id]) }] : []),
      { label: props.t.acoes.extrairDeNovo, icon: 'i-lucide-refresh-cw', disabled: p.status === 'pending' || p.status === 'processing', onSelect: () => emit('extrairDeNovo', p.id) },
      { label: props.t.acoes.abrirNaOrigem, icon: 'i-lucide-square-arrow-out-up-right', onSelect: () => emit('abrirOrigem', p.id) },
      ...(pronto ? [{ label: props.t.acoes.copiarLink, icon: 'i-lucide-link', onSelect: () => emit('copiarLink', p.id) }] : []),
    ],
    [{ label: props.t.acoes.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => emit('excluir', [p.id]) }],
  ]
}

function textoDoFiltro(p: PedidoDeRelatorio) {
  return p.proto.filtros.map(f => `${f.campo} ${props.t.operadores[f.operador]}${f.valor ? ` ${f.valor}` : ''}`).join('\n')
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- A aba, como nas telas novas -->
    <div class="flex items-center gap-1 border-b border-default px-3 py-2">
      <UButton icon="i-lucide-file-down" :label="nomeDaTela" size="sm" color="primary" variant="soft" />
    </div>

    <!-- Barra: busca, período e filtros à esquerda; colunas à direita -->
    <div class="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-default px-4 py-2.5">
      <UInput
        v-model="filtros.busca"
        icon="i-lucide-search"
        :placeholder="t.barra.pesquisar"
        variant="none"
        size="sm"
        class="w-56"
        :ui="{ trailing: 'pe-1' }"
      >
        <template v-if="filtros.busca" #trailing>
          <UButton icon="i-lucide-x" color="neutral" variant="link" size="xs" :aria-label="t.barra.limparFiltros" @click="filtros.busca = ''" />
        </template>
      </UInput>

      <span class="flex items-center gap-1.5 text-sm text-muted">
        <UIcon name="i-lucide-calendar" class="size-4" />{{ t.barra.criadoEm }}
      </span>
      <UDropdownMenu :items="periodos">
        <UButton
          :label="t.barra.periodos[filtros.periodo]"
          icon="i-lucide-arrow-down-up"
          color="neutral"
          :variant="filtros.periodo === 'todo' ? 'ghost' : 'soft'"
          size="sm"
          class="-ml-2"
        />
      </UDropdownMenu>

      <USeparator orientation="vertical" class="h-5" />

      <UDropdownMenu :items="opcoesDeStatus">
        <UButton :label="t.barra.status" icon="i-lucide-circle-dot" color="neutral" :variant="filtros.status.length ? 'soft' : 'ghost'" size="sm" trailing-icon="i-lucide-chevron-down">
          <template v-if="filtros.status.length" #trailing>
            <UBadge :label="String(filtros.status.length)" size="sm" color="primary" variant="solid" class="rounded-full" />
          </template>
        </UButton>
      </UDropdownMenu>
      <UDropdownMenu :items="opcoesDeOrigem" :ui="{ content: 'max-w-80' }">
        <UButton :label="t.barra.origem" icon="i-lucide-layout-grid" color="neutral" :variant="filtros.origem.length ? 'soft' : 'ghost'" size="sm" trailing-icon="i-lucide-chevron-down">
          <template v-if="filtros.origem.length" #trailing>
            <UBadge :label="String(filtros.origem.length)" size="sm" color="primary" variant="solid" class="rounded-full" />
          </template>
        </UButton>
      </UDropdownMenu>
      <UDropdownMenu :items="opcoesDeFormato">
        <UButton :label="t.barra.formato" icon="i-lucide-file-type" color="neutral" :variant="filtros.formato.length ? 'soft' : 'ghost'" size="sm" trailing-icon="i-lucide-chevron-down">
          <template v-if="filtros.formato.length" #trailing>
            <UBadge :label="String(filtros.formato.length)" size="sm" color="primary" variant="solid" class="rounded-full" />
          </template>
        </UButton>
      </UDropdownMenu>

      <Transition enter-active-class="transition duration-150" enter-from-class="opacity-0" leave-active-class="transition duration-100" leave-to-class="opacity-0">
        <UButton v-if="temFiltro" :label="t.barra.limparFiltros" icon="i-lucide-filter-x" color="neutral" variant="link" size="sm" @click="limpar" />
      </Transition>

      <div class="ml-auto flex items-center gap-1">
        <UDropdownMenu :items="menuDeColunas" :content="{ align: 'end' }">
          <UTooltip :text="t.barra.colunas">
            <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.barra.colunas" />
          </UTooltip>
        </UDropdownMenu>
      </div>
    </div>

    <!-- Filtros Rápidos: a mesma faixa das tarefas rápidas do develop -->
    <div v-if="pedidos.length && estado !== 'erro'" class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-2">
      <span class="mr-1 text-sm text-toned">{{ t.rapidos.titulo }}</span>
      <UButton
        v-for="r in rapidos"
        :key="r.valor"
        size="xs"
        :color="filtros.rapido === r.valor ? 'primary' : 'neutral'"
        :variant="filtros.rapido === r.valor ? 'soft' : 'outline'"
        class="rounded-full transition-colors"
        :aria-pressed="filtros.rapido === r.valor"
        @click="filtros.rapido = r.valor"
      >
        <UIcon v-if="r.valor === 'gerando' && r.total" name="i-lucide-loader-circle" class="size-3.5 animate-spin text-info" />
        {{ r.rotulo }}
        <span class="tabular-nums text-muted">{{ r.total }}</span>
      </UButton>
    </div>

    <!-- ESTADOS -->
    <UEmpty
      v-if="estado === 'erro'"
      icon="i-lucide-cloud-alert"
      :title="t.vazio.erroTitulo"
      :description="t.vazio.erroDescricao"
      :actions="[{ label: t.acoes.tentarDeNovo, icon: 'i-lucide-rotate-cw', color: 'primary', onClick: () => emit('recarregar') }]"
      class="mt-16"
    />
    <UEmpty
      v-else-if="estado === 'vazio' || (!pedidos.length && estado !== 'carregando')"
      icon="i-lucide-file-down"
      :title="t.vazio.titulo"
      :description="t.vazio.descricao"
      :actions="[{ label: t.vazio.acao, icon: 'i-lucide-arrow-right', color: 'primary', variant: 'soft', onClick: () => emit('irParaContratos') }]"
      class="mx-auto mt-16 max-w-md"
    />
    <UEmpty
      v-else-if="!filtrados.length && estado !== 'carregando'"
      icon="i-lucide-search-x"
      :title="filtros.busca ? t.vazio.buscaTitulo(filtros.busca) : t.vazio.buscaTitulo('')"
      :description="t.vazio.buscaDescricao"
      :actions="[{ label: t.barra.limparFiltros, color: 'neutral', variant: 'outline', onClick: limpar }]"
      class="mt-16"
    />

    <!-- A tabela nova -->
    <div v-else class="min-h-0 flex-1 animate-[entrada_.25s_ease-out] overflow-auto pb-24">
      <EnTable
        v-model:selected="selecionadas"
        :columns="colunas"
        :rows="linhas"
        :loading="estado === 'carregando'"
        selectable
        :sort="ordem"
        :column-visibility="visiveis"
        :column-sizing="larguras"
        :pagination="{ page: pagina, pageCount: Math.max(1, Math.ceil(filtrados.length / POR_PAGINA)), total: filtrados.length }"
        :locale="idioma"
        @sort-change="ordem = $event"
        @page-change="pagina = $event"
        @row-click="(r) => emit('abrir', (r as Linha).id)"
      >
        <template #cell-relatorio="{ row }">
          <span class="flex min-w-0 items-center gap-2.5 py-0.5" :class="(row as Linha).id === aberto ? 'text-primary' : ''">
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-md transition-transform"
              :class="{
                'bg-success/10 text-success': COR_DO_FORMATO[(row as Linha).pedido.extraction_format] === 'success',
                'bg-info/10 text-info': COR_DO_FORMATO[(row as Linha).pedido.extraction_format] === 'info',
                'bg-elevated text-toned': COR_DO_FORMATO[(row as Linha).pedido.extraction_format] === 'neutral',
              }"
            >
              <UIcon :name="ICONE_DO_FORMATO[(row as Linha).pedido.extraction_format]" class="size-4" />
            </span>
            <span class="min-w-0">
              <span class="flex items-center gap-1.5">
                <span class="truncate text-sm font-medium text-highlighted" :title="String(row.relatorio)">{{ row.relatorio }}</span>
                <span
                  v-if="(row as Linha).pedido.status === 'complete' && !(row as Linha).pedido.proto.baixadoEm.length"
                  class="size-1.5 shrink-0 rounded-full bg-primary"
                  :aria-label="t.naoBaixado"
                  :title="t.naoBaixado"
                />
              </span>
              <span class="block truncate text-xs text-muted">{{ (row as Linha).pedido.proto.visualizacao }}</span>
            </span>
          </span>
        </template>

        <template #cell-status="{ row }">
          <span class="flex flex-col gap-1">
            <UBadge
              :color="COR_DO_STATUS[(row as Linha).pedido.status]"
              variant="subtle"
              size="sm"
              class="w-fit"
              :ui="{ leadingIcon: (row as Linha).pedido.status === 'processing' ? 'animate-spin' : '' }"
              :icon="ICONE_DO_STATUS[(row as Linha).pedido.status]"
              :label="(row as Linha).pedido.status === 'processing' && (row as Linha).pedido.proto.progresso != null
                ? t.gerandoPct((row as Linha).pedido.proto.progresso!)
                : t.status[(row as Linha).pedido.status]"
            />
            <UProgress
              v-if="(row as Linha).pedido.status === 'processing'"
              :model-value="(row as Linha).pedido.proto.progresso ?? null"
              size="2xs"
              color="info"
              class="w-24"
            />
          </span>
        </template>

        <template #cell-modelo="{ row }">
          <span v-if="row.modelo" class="block max-w-48 truncate text-sm text-toned">{{ row.modelo }}</span>
          <span v-else class="text-sm text-dimmed">{{ t.modeloPadrao }}</span>
        </template>

        <template #cell-formato="{ row }">
          <UBadge :label="String(row.formato).toUpperCase()" color="neutral" variant="outline" size="sm" class="font-mono" />
        </template>

        <template #cell-registros="{ row }">
          <span class="text-sm tabular-nums" :class="row.registros == null ? 'text-dimmed' : 'text-toned'">
            {{ row.registros == null ? '-' : Number(row.registros).toLocaleString(idioma) }}
          </span>
        </template>

        <template #cell-filtros="{ row }">
          <UTooltip v-if="Number(row.filtros)" :ui="{ content: 'h-auto max-w-xs whitespace-pre-line py-1.5' }" :text="textoDoFiltro((row as Linha).pedido)">
            <UBadge :label="t.nFiltros(Number(row.filtros))" icon="i-lucide-filter" color="neutral" variant="soft" size="sm" />
          </UTooltip>
          <span v-else class="text-sm text-dimmed">{{ t.semFiltro }}</span>
        </template>

        <template #cell-tamanho="{ row }">
          <span class="text-sm tabular-nums" :class="row.tamanho == null ? 'text-dimmed' : 'text-toned'">
            {{ row.tamanho == null ? '-' : tamanho(Number(row.tamanho), idioma) }}
          </span>
        </template>

        <template #cell-criadoEm="{ row }">
          <span class="whitespace-nowrap text-sm text-toned">{{ dataCurta(String(row.criadoEm), t, idioma) }}</span>
        </template>

        <template #cell-baixar="{ row }">
          <span class="flex justify-end" @click.stop>
            <UTooltip v-if="(row as Linha).pedido.status === 'complete'" :text="t.acoes.baixar">
              <UButton icon="i-lucide-download" color="primary" variant="soft" size="xs" :aria-label="t.acoes.baixar" @click="emit('baixar', [(row as Linha).id])" />
            </UTooltip>
            <UTooltip v-else-if="(row as Linha).pedido.status === 'error'" :text="t.acoes.tentarDeNovo">
              <UButton icon="i-lucide-rotate-cw" color="error" variant="soft" size="xs" :aria-label="t.acoes.tentarDeNovo" @click="emit('tentarDeNovo', (row as Linha).id)" />
            </UTooltip>
          </span>
        </template>

        <template #actions="{ row }">
          <UDropdownMenu :items="menuDaLinha((row as Linha).pedido)" :content="{ align: 'end' }">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.acoes.maisAcoes" @click.stop />
          </UDropdownMenu>
        </template>
      </EnTable>
    </div>

    <!-- Barra da seleção em massa -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-4 opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div
        v-if="selecionadas.length"
        class="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-default bg-default px-3 py-2 shadow-lg"
        role="toolbar"
      >
        <span class="px-1 text-sm font-medium text-highlighted">{{ t.selecao.selecionados(selecionadas.length) }}</span>
        <USeparator orientation="vertical" class="h-5" />
        <UButton
          icon="i-lucide-download"
          :label="t.selecao.baixar"
          size="sm"
          color="primary"
          variant="soft"
          :disabled="!prontasSelecionadas.length"
          @click="emit('baixar', prontasSelecionadas.map(l => l.id))"
        />
        <UButton icon="i-lucide-trash-2" :label="t.selecao.excluir" size="sm" color="error" variant="ghost" @click="emit('excluir', selecionadas.map(l => l.id)); selecionadas = []" />
        <UButton icon="i-lucide-x" size="sm" color="neutral" variant="ghost" :aria-label="t.selecao.limpar" @click="selecionadas = []" />
      </div>
    </Transition>
  </div>
</template>
