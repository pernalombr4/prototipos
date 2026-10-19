<script setup lang="ts">
/**
 * PROPOSTA: a tela de exportações na tabela nova do ENSPACE.
 *
 * Mesma anatomia da tabela nova de itens (aba, barra de busca e período,
 * tabela com filtro no cabeçalho de cada coluna, rodapé de paginação), para a
 * tela parecer da mesma família das telas novas e não da tela antiga de hoje.
 *
 * O que muda em relação a `/myReports` de hoje:
 * - cada linha diz o que é: nome e descrição do relatório, origem, formato, registros,
 *   filtros, tamanho e data com hora (hoje: "-" em 5 de 8 colunas);
 * - status com 4 estados e o progresso de quem está gerando;
 * - menu da linha logo depois do checkbox, com Baixar dentro (rodada 5);
 * - clique na linha abre o painel de detalhes (`_PainelDoRelatorio.vue`);
 * - busca, período e colunas na barra; filtro em toda coluna de dado e
 *   ordenação nas de texto, número e data, no cabeçalho (rodada 7).
 *
 * A tabela é o `UTable` do Nuxt UI com as classes do `EnTable` (copiadas do
 * `Table2.vue.js` do enspace-sdk-ui 0.17.0). O `EnTable` não tem slot de
 * cabeçalho, e o filtro da coluna mora no cabeçalho. Pedido ao SDK no
 * DECISOES.md, rodada 7.
 */
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import CabecalhoDaColuna from './_CabecalhoDaColuna.vue'
import type { Formato, PedidoDeRelatorio, StatusDoPedido } from './mocks'
import type { FiltrosDaTela, Periodo } from './relatorios'
import {
  COR_DO_FORMATO, COR_DO_STATUS, ICONE_DO_FORMATO, ICONE_DO_STATUS, dataCurta, filtrar,
  iconeDaOrigem, nomeDaOrigem, nomeDoRelatorio, origensDaLista, tamanho,
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
  recarregar: []
}>()

const idioma = useIdioma()

/* ---------- filtros: barra (busca, período) e cabeçalho de cada coluna ---------- */

const filtros = reactive<FiltrosDaTela>({
  busca: '',
  periodo: 'todo',
  status: [],
  origem: [],
  formato: [],
})

type Faixa = 'ate100k' | 'ate1m' | 'acima1m'
type ComOuSem = 'com' | 'sem'

/** Os filtros que só existem no cabeçalho (os outros dividem estado com a barra). */
const doCabecalho = reactive({
  relatorio: '',
  registrosMin: null as number | null,
  registrosMax: null as number | null,
  comFiltro: [] as ComOuSem[],
  tamanho: [] as Faixa[],
})

const ativo = computed(() => ({
  relatorio: !!doCabecalho.relatorio.trim(),
  status: !!filtros.status.length,
  origem: !!filtros.origem.length,
  formato: !!filtros.formato.length,
  registros: doCabecalho.registrosMin != null || doCabecalho.registrosMax != null,
  filtros: !!doCabecalho.comFiltro.length,
  tamanho: !!doCabecalho.tamanho.length,
  criadoEm: filtros.periodo !== 'todo',
}))

const temFiltro = computed(() => !!filtros.busca || Object.values(ativo.value).some(Boolean))

function limparColuna(chave: keyof typeof ativo.value) {
  switch (chave) {
    case 'relatorio': doCabecalho.relatorio = ''; break
    case 'status': filtros.status = []; break
    case 'origem': filtros.origem = []; break
    case 'formato': filtros.formato = []; break
    case 'registros': doCabecalho.registrosMin = null; doCabecalho.registrosMax = null; break
    case 'filtros': doCabecalho.comFiltro = []; break
    case 'tamanho': doCabecalho.tamanho = []; break
    case 'criadoEm': filtros.periodo = 'todo'; break
  }
}

function limpar() {
  Object.assign(filtros, { busca: '', periodo: 'todo', status: [], origem: [], formato: [] })
  Object.assign(doCabecalho, { relatorio: '', registrosMin: null, registrosMax: null, comFiltro: [], tamanho: [] })
}

function faixaDe(kb: number): Faixa {
  return kb <= 100 ? 'ate100k' : kb <= 1024 ? 'ate1m' : 'acima1m'
}

function sem(acento: string) {
  return acento.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

const filtrados = computed(() => filtrar(props.pedidos, filtros, props.t).filter((p) => {
  const termo = sem(doCabecalho.relatorio.trim())
  if (termo && !sem(`${nomeDoRelatorio(p, props.t)} ${p.report?.description ?? ''}`).includes(termo)) return false
  const r = p.proto.registros
  if (doCabecalho.registrosMin != null && (r == null || r < doCabecalho.registrosMin)) return false
  if (doCabecalho.registrosMax != null && (r == null || r > doCabecalho.registrosMax)) return false
  if (doCabecalho.comFiltro.length && !doCabecalho.comFiltro.includes(p.proto.filtros.length ? 'com' : 'sem')) return false
  if (doCabecalho.tamanho.length && (!p.processed_report || !doCabecalho.tamanho.includes(faixaDe(p.processed_report.size)))) return false
  return true
}))

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

const opcoesDeStatus = computed(() => (['pending', 'processing', 'complete', 'error'] as StatusDoPedido[])
  .map(s => ({ valor: s, rotulo: props.t.status[s], icone: ICONE_DO_STATUS[s] })))
const opcoesDeOrigem = computed(() => origensDaLista(props.pedidos, props.t)
  .map(o => ({ valor: o.value, rotulo: o.label, icone: o.icon })))
const opcoesDeFormato = (['xlsx', 'csv', 'dbf'] as Formato[]).map(f => ({ valor: f, rotulo: f.toUpperCase(), icone: ICONE_DO_FORMATO[f] }))
const opcoesDeFiltro = computed(() => [
  { valor: 'com' as ComOuSem, rotulo: props.t.coluna.comFiltro, icone: 'i-lucide-filter' },
  { valor: 'sem' as ComOuSem, rotulo: props.t.semFiltro, icone: 'i-lucide-filter-x' },
])
const opcoesDeTamanho = computed(() => (['ate100k', 'ate1m', 'acima1m'] as Faixa[])
  .map(f => ({ valor: f, rotulo: props.t.coluna.faixas[f], icone: 'i-lucide-hard-drive' })))

/* ---------- colunas ---------- */

type ChaveDaColuna = 'selecao' | 'acoes' | 'relatorio' | 'status' | 'origem' | 'formato' | 'registros' | 'filtros' | 'tamanho' | 'criadoEm'

/** Larguras de partida, aplicadas como o EnTable aplica (estilo no th e no td). */
const LARGURAS: Record<ChaveDaColuna, number> = {
  selecao: 44, acoes: 48, relatorio: 320, status: 160, origem: 210, formato: 110, registros: 128, filtros: 140, tamanho: 120, criadoEm: 180,
}

const colunas = computed<TableColumn<Linha>[]>(() => (Object.keys(LARGURAS) as ChaveDaColuna[]).map(id => ({
  id,
  ...(id === 'selecao' || id === 'acoes' ? {} : { accessorKey: id }),
  meta: { style: { th: { width: `${LARGURAS[id]}px` }, td: { width: `${LARGURAS[id]}px` } } },
})))

const visiveis = ref<Record<string, boolean>>({ origem: true, tamanho: true })

/** Seleção, menu, Relatório, Status e Criado em não se escondem: sem elas a linha não se explica. */
const OCULTAVEIS: ChaveDaColuna[] = ['origem', 'formato', 'registros', 'filtros', 'tamanho']

const menuDeColunas = computed<DropdownMenuItem[]>(() => OCULTAVEIS.map(c => ({
  label: props.t.colunas[c as keyof Textos['colunas']],
  type: 'checkbox' as const,
  checked: visiveis.value[c] !== false,
  onUpdateChecked: (v: boolean) => { visiveis.value = { ...visiveis.value, [c]: v } },
  onSelect: (e: Event) => e.preventDefault(),
})))

/* ---------- ordenação (texto, número e data) e página ---------- */

type Ordenavel = 'relatorio' | 'origem' | 'registros' | 'filtros' | 'tamanho' | 'criadoEm'
const PADRAO = { key: 'criadoEm' as Ordenavel, direction: 'desc' as 'asc' | 'desc' }
const ordem = ref({ ...PADRAO })

/** Texto e número: crescente, decrescente, volta ao padrão. Data: começa pelo mais novo. */
function ordenar(key: Ordenavel) {
  const primeira = key === 'criadoEm' ? 'desc' : 'asc'
  const segunda = primeira === 'asc' ? 'desc' : 'asc'
  if (ordem.value.key !== key) ordem.value = { key, direction: primeira }
  else if (ordem.value.direction === primeira) ordem.value = { key, direction: segunda }
  else ordem.value = { ...PADRAO }
}

function direcaoDe(key: Ordenavel) {
  return ordem.value.key === key ? ordem.value.direction : null
}

const pagina = ref(1)
const POR_PAGINA = 15
watch(filtrados, () => { pagina.value = 1 })

const ordenados = computed(() => {
  const dir = ordem.value.direction === 'asc' ? 1 : -1
  const valor = (p: PedidoDeRelatorio): number | string => {
    switch (ordem.value.key) {
      case 'relatorio': return sem(nomeDoRelatorio(p, props.t))
      case 'origem': return sem(nomeDaOrigem(p, props.t))
      case 'registros': return p.proto.registros ?? -1
      case 'filtros': return p.proto.filtros.length
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
  relatorio: nomeDoRelatorio(p, props.t),
  origem: nomeDaOrigem(p, props.t),
  status: p.status,
  formato: p.extraction_format,
  registros: p.proto.registros,
  filtros: p.proto.filtros.length,
  tamanho: p.processed_report?.size ?? null,
  criadoEm: p.created_at,
})))

/** As classes que o EnTable passa ao UTable (enspace-sdk-ui 0.17.0), para a tabela ser a mesma. */
const UI_DO_ENTABLE = {
  base: 'w-full table-fixed border-separate border-spacing-0',
  thead: 'bg-elevated/50',
  th: 'relative py-2 px-3 border-y border-default first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg text-sm font-medium text-muted',
  td: 'py-2 px-3 border-b border-default text-sm text-default whitespace-normal',
  tr: 'cursor-pointer',
  separator: 'h-0',
  empty: 'p-0',
  loading: 'p-0',
}

/* ---------- seleção ---------- */

const selecao = ref<Record<string, boolean>>({})
const selecionadas = computed(() => props.pedidos.filter(p => selecao.value[String(p.id)]))
const prontasSelecionadas = computed(() => selecionadas.value.filter(p => p.status === 'complete'))
watch(() => props.pedidos.length, () => {
  selecao.value = Object.fromEntries(Object.entries(selecao.value).filter(([id]) => props.pedidos.some(p => String(p.id) === id)))
})

const todasDaPagina = computed(() => !!linhas.value.length && linhas.value.every(l => selecao.value[String(l.id)]))
const algumaDaPagina = computed(() => linhas.value.some(l => selecao.value[String(l.id)]))

function marcarPagina(v: boolean | 'indeterminate') {
  const novo = { ...selecao.value }
  for (const l of linhas.value) {
    if (v === true) novo[String(l.id)] = true
    else delete novo[String(l.id)]
  }
  selecao.value = novo
}

function marcarLinha(id: number, v: boolean | 'indeterminate') {
  const novo = { ...selecao.value }
  if (v === true) novo[String(id)] = true
  else delete novo[String(id)]
  selecao.value = novo
}

/* ---------- ações da linha ---------- */

function menuDaLinha(p: PedidoDeRelatorio): DropdownMenuItem[][] {
  const pronto = p.status === 'complete'
  const comErro = p.status === 'error'
  // A ação principal da linha abre o menu: Baixar quando está pronto, Tentar de novo quando deu erro.
  const principal: DropdownMenuItem[] = pronto
    ? [{ label: props.t.acoes.baixar, icon: 'i-lucide-download', onSelect: () => emit('baixar', [p.id]) }]
    : comErro
      ? [{ label: props.t.acoes.tentarDeNovo, icon: 'i-lucide-rotate-cw', onSelect: () => emit('tentarDeNovo', p.id) }]
      : []
  return [
    ...(principal.length ? [principal] : []),
    [
      // O clique na linha abre o painel; este item é o caminho de quem usa o teclado.
      { label: props.t.acoes.verDetalhes, icon: 'i-lucide-panel-right-open', onSelect: () => emit('abrir', p.id) },
      ...(comErro ? [] : [{ label: props.t.acoes.extrairDeNovo, icon: 'i-lucide-refresh-cw', disabled: p.status === 'pending' || p.status === 'processing', onSelect: () => emit('extrairDeNovo', p.id) }]),
      { label: props.t.acoes.abrirNaOrigem, icon: 'i-lucide-square-arrow-out-up-right', onSelect: () => emit('abrirOrigem', p.id) },
      ...(pronto ? [{ label: props.t.acoes.copiarLink, icon: 'i-lucide-link', onSelect: () => emit('copiarLink', p.id) }] : []),
    ],
    [{ label: props.t.acoes.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => emit('excluir', [p.id]) }],
  ]
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- A aba, como nas telas novas -->
    <div class="flex items-center gap-1 border-b border-default px-3 py-2">
      <UButton icon="i-lucide-file-down" :label="nomeDaTela" size="sm" color="primary" variant="soft" />
    </div>

    <!-- Barra: busca e período à esquerda; colunas à direita. O resto do filtro mora no cabeçalho. -->
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

    <!-- ESTADOS -->
    <UEmpty
      v-if="estado === 'erro'"
      icon="i-lucide-cloud-alert"
      :title="t.vazio.erroTitulo"
      :description="t.vazio.erroDescricao"
      :actions="[{ label: t.acoes.tentarDeNovo, icon: 'i-lucide-rotate-cw', color: 'primary', onClick: () => emit('recarregar') }]"
      class="mx-auto mt-16 max-w-md"
    />
    <UEmpty
      v-else-if="estado === 'vazio' || (!pedidos.length && estado !== 'carregando')"
      icon="i-lucide-file-down"
      :title="t.vazio.titulo"
      :description="t.vazio.descricao"
      class="mx-auto mt-16 max-w-md"
    />

    <!-- A tabela nova: UTable com as classes do EnTable e o filtro no cabeçalho -->
    <div v-else class="min-h-0 flex-1 animate-[entrada_.25s_ease-out] overflow-auto pb-24">
      <UTable
        v-model:column-visibility="visiveis"
        :data="linhas"
        :columns="colunas"
        :loading="estado === 'carregando'"
        :get-row-id="(r: Linha) => String(r.id)"
        :on-select="(_e: Event, row: any) => emit('abrir', row.original.id)"
        :ui="UI_DO_ENTABLE"
      >
        <!-- ===== cabeçalhos ===== -->
        <template #selecao-header>
          <span class="flex" @click.stop>
            <UCheckbox
              :model-value="todasDaPagina ? true : algumaDaPagina ? 'indeterminate' : false"
              :aria-label="t.selecao.contagem(selecionadas.length, filtrados.length)"
              @update:model-value="marcarPagina"
            />
          </span>
        </template>

        <template #acoes-header>
          <span class="sr-only">{{ t.acoes.maisAcoes }}</span>
        </template>

        <template #relatorio-header>
          <CabecalhoDaColuna
            :rotulo="t.colunas.relatorio" ordenavel :direcao="direcaoDe('relatorio')" :filtro-ativo="ativo.relatorio"
            :rotulo-ordenar="t.coluna.ordenar(t.colunas.relatorio)" :rotulo-filtrar="t.coluna.filtrar(t.colunas.relatorio)" :rotulo-limpar="t.coluna.limpar"
            @ordenar="ordenar('relatorio')" @limpar="limparColuna('relatorio')"
          >
            <UFormField :label="t.coluna.contem">
              <UInput v-model="doCabecalho.relatorio" icon="i-lucide-search" size="sm" class="w-full" autofocus />
            </UFormField>
          </CabecalhoDaColuna>
        </template>

        <template #status-header>
          <CabecalhoDaColuna
            :rotulo="t.colunas.status" :filtro-ativo="ativo.status"
            :rotulo-ordenar="t.coluna.ordenar(t.colunas.status)" :rotulo-filtrar="t.coluna.filtrar(t.colunas.status)" :rotulo-limpar="t.coluna.limpar"
            @limpar="limparColuna('status')"
          >
            <ul class="space-y-1.5">
              <li v-for="o in opcoesDeStatus" :key="o.valor">
                <UCheckbox :model-value="filtros.status.includes(o.valor)" @update:model-value="alternarNa(filtros.status, o.valor)">
                  <template #label><span class="flex items-center gap-1.5"><UIcon :name="o.icone" class="size-4 text-muted" />{{ o.rotulo }}</span></template>
                </UCheckbox>
              </li>
            </ul>
          </CabecalhoDaColuna>
        </template>

        <template #origem-header>
          <CabecalhoDaColuna
            :rotulo="t.colunas.origem" ordenavel :direcao="direcaoDe('origem')" :filtro-ativo="ativo.origem"
            :rotulo-ordenar="t.coluna.ordenar(t.colunas.origem)" :rotulo-filtrar="t.coluna.filtrar(t.colunas.origem)" :rotulo-limpar="t.coluna.limpar"
            @ordenar="ordenar('origem')" @limpar="limparColuna('origem')"
          >
            <ul class="max-h-64 space-y-1.5 overflow-y-auto">
              <li v-for="o in opcoesDeOrigem" :key="o.valor">
                <UCheckbox :model-value="filtros.origem.includes(o.valor)" @update:model-value="alternarNa(filtros.origem, o.valor)">
                  <template #label><span class="flex min-w-0 items-center gap-1.5"><UIcon :name="o.icone" class="size-4 shrink-0 text-muted" /><span class="truncate" :title="o.rotulo">{{ o.rotulo }}</span></span></template>
                </UCheckbox>
              </li>
            </ul>
          </CabecalhoDaColuna>
        </template>

        <template #formato-header>
          <CabecalhoDaColuna
            :rotulo="t.colunas.formato" :filtro-ativo="ativo.formato"
            :rotulo-ordenar="t.coluna.ordenar(t.colunas.formato)" :rotulo-filtrar="t.coluna.filtrar(t.colunas.formato)" :rotulo-limpar="t.coluna.limpar"
            @limpar="limparColuna('formato')"
          >
            <ul class="space-y-1.5">
              <li v-for="o in opcoesDeFormato" :key="o.valor">
                <UCheckbox :model-value="filtros.formato.includes(o.valor)" @update:model-value="alternarNa(filtros.formato, o.valor)">
                  <template #label><span class="flex items-center gap-1.5"><UIcon :name="o.icone" class="size-4 text-muted" />{{ o.rotulo }}</span></template>
                </UCheckbox>
              </li>
            </ul>
          </CabecalhoDaColuna>
        </template>

        <template #registros-header>
          <CabecalhoDaColuna
            :rotulo="t.colunas.registros" ordenavel alinhamento="right" :direcao="direcaoDe('registros')" :filtro-ativo="ativo.registros"
            :rotulo-ordenar="t.coluna.ordenar(t.colunas.registros)" :rotulo-filtrar="t.coluna.filtrar(t.colunas.registros)" :rotulo-limpar="t.coluna.limpar"
            @ordenar="ordenar('registros')" @limpar="limparColuna('registros')"
          >
            <div class="grid grid-cols-2 gap-2">
              <UFormField :label="t.coluna.minimo">
                <UInputNumber v-model="doCabecalho.registrosMin" :min="0" size="sm" class="w-full" :increment="false" :decrement="false" />
              </UFormField>
              <UFormField :label="t.coluna.maximo">
                <UInputNumber v-model="doCabecalho.registrosMax" :min="0" size="sm" class="w-full" :increment="false" :decrement="false" />
              </UFormField>
            </div>
          </CabecalhoDaColuna>
        </template>

        <template #filtros-header>
          <CabecalhoDaColuna
            :rotulo="t.colunas.filtros" ordenavel :direcao="direcaoDe('filtros')" :filtro-ativo="ativo.filtros"
            :rotulo-ordenar="t.coluna.ordenar(t.colunas.filtros)" :rotulo-filtrar="t.coluna.filtrar(t.colunas.filtros)" :rotulo-limpar="t.coluna.limpar"
            @ordenar="ordenar('filtros')" @limpar="limparColuna('filtros')"
          >
            <ul class="space-y-1.5">
              <li v-for="o in opcoesDeFiltro" :key="o.valor">
                <UCheckbox :model-value="doCabecalho.comFiltro.includes(o.valor)" @update:model-value="alternarNa(doCabecalho.comFiltro, o.valor)">
                  <template #label><span class="flex items-center gap-1.5"><UIcon :name="o.icone" class="size-4 text-muted" />{{ o.rotulo }}</span></template>
                </UCheckbox>
              </li>
            </ul>
          </CabecalhoDaColuna>
        </template>

        <template #tamanho-header>
          <CabecalhoDaColuna
            :rotulo="t.colunas.tamanho" ordenavel alinhamento="right" :direcao="direcaoDe('tamanho')" :filtro-ativo="ativo.tamanho"
            :rotulo-ordenar="t.coluna.ordenar(t.colunas.tamanho)" :rotulo-filtrar="t.coluna.filtrar(t.colunas.tamanho)" :rotulo-limpar="t.coluna.limpar"
            @ordenar="ordenar('tamanho')" @limpar="limparColuna('tamanho')"
          >
            <ul class="space-y-1.5">
              <li v-for="o in opcoesDeTamanho" :key="o.valor">
                <UCheckbox :model-value="doCabecalho.tamanho.includes(o.valor)" @update:model-value="alternarNa(doCabecalho.tamanho, o.valor)">
                  <template #label>{{ o.rotulo }}</template>
                </UCheckbox>
              </li>
            </ul>
          </CabecalhoDaColuna>
        </template>

        <template #criadoEm-header>
          <!-- O mesmo período da barra: mudar aqui muda lá -->
          <CabecalhoDaColuna
            :rotulo="t.colunas.criadoEm" ordenavel :direcao="direcaoDe('criadoEm')" :filtro-ativo="ativo.criadoEm"
            :rotulo-ordenar="t.coluna.ordenar(t.colunas.criadoEm)" :rotulo-filtrar="t.coluna.filtrar(t.colunas.criadoEm)" :rotulo-limpar="t.coluna.limpar"
            @ordenar="ordenar('criadoEm')" @limpar="limparColuna('criadoEm')"
          >
            <URadioGroup
              v-model="filtros.periodo"
              :items="(Object.keys(t.barra.periodos) as Periodo[]).map(p => ({ value: p, label: t.barra.periodos[p] }))"
              size="sm"
            />
          </CabecalhoDaColuna>
        </template>

        <!-- ===== células ===== -->
        <template #selecao-cell="{ row }">
          <span class="flex" @click.stop>
            <UCheckbox
              :model-value="!!selecao[String(row.original.id)]"
              :aria-label="row.original.relatorio as string"
              @update:model-value="marcarLinha(row.original.id, $event)"
            />
          </span>
        </template>

        <template #acoes-cell="{ row }">
          <span class="flex" @click.stop>
            <UDropdownMenu :items="menuDaLinha(row.original.pedido)" :content="{ align: 'start' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.acoes.maisAcoes" />
            </UDropdownMenu>
          </span>
        </template>

        <template #relatorio-cell="{ row }">
          <span class="flex min-w-0 items-center gap-2.5 py-0.5">
            <span
              class="flex size-8 shrink-0 items-center justify-center rounded-md"
              :class="{
                'bg-success/10 text-success': COR_DO_FORMATO[row.original.pedido.extraction_format] === 'success',
                'bg-info/10 text-info': COR_DO_FORMATO[row.original.pedido.extraction_format] === 'info',
                'bg-elevated text-toned': COR_DO_FORMATO[row.original.pedido.extraction_format] === 'neutral',
              }"
            >
              <UIcon :name="ICONE_DO_FORMATO[row.original.pedido.extraction_format]" class="size-4" />
            </span>
            <span class="min-w-0">
              <span class="block truncate text-sm font-medium" :class="row.original.pedido.report ? 'text-highlighted' : 'text-toned'" :title="String(row.original.relatorio)">{{ row.original.relatorio }}</span>
              <span
                v-if="row.original.pedido.report?.description"
                class="block truncate text-xs text-muted"
                :title="row.original.pedido.report?.description"
              >{{ row.original.pedido.report?.description }}</span>
            </span>
          </span>
        </template>

        <template #status-cell="{ row }">
          <span class="flex flex-col gap-1">
            <UBadge
              :color="COR_DO_STATUS[row.original.pedido.status]"
              variant="subtle"
              size="sm"
              class="w-fit"
              :ui="{ leadingIcon: row.original.pedido.status === 'processing' ? 'animate-spin' : '' }"
              :icon="ICONE_DO_STATUS[row.original.pedido.status]"
              :label="row.original.pedido.status === 'processing' && row.original.pedido.proto.progresso != null
                ? t.gerandoPct(row.original.pedido.proto.progresso!)
                : t.status[row.original.pedido.status]"
            />
            <UProgress
              v-if="row.original.pedido.status === 'processing'"
              :model-value="row.original.pedido.proto.progresso ?? null"
              size="2xs"
              color="info"
              class="w-24"
            />
          </span>
        </template>

        <template #origem-cell="{ row }">
          <span class="flex min-w-0 items-center gap-1.5 text-sm text-toned">
            <UIcon :name="iconeDaOrigem(row.original.pedido)" class="size-4 shrink-0 text-muted" />
            <span class="truncate" :title="String(row.original.origem)">{{ row.original.origem }}</span>
          </span>
        </template>

        <template #formato-cell="{ row }">
          <UBadge :label="String(row.original.formato).toUpperCase()" color="neutral" variant="outline" size="sm" class="font-mono" />
        </template>

        <template #registros-cell="{ row }">
          <span class="block text-right text-sm tabular-nums" :class="row.original.registros == null ? 'text-dimmed' : 'text-toned'">
            {{ row.original.registros == null ? '-' : Number(row.original.registros).toLocaleString(idioma) }}
          </span>
        </template>

        <template #filtros-cell="{ row }">
          <!-- Popover no hover, não tooltip: dá para ler e detalhar sem abrir o painel -->
          <UPopover
            v-if="Number(row.original.filtros)"
            mode="hover"
            :open-delay="150"
            :close-delay="120"
            :content="{ side: 'bottom', align: 'start', sideOffset: 6, collisionPadding: 12 }"
          >
            <UBadge :label="t.nFiltros(Number(row.original.filtros))" icon="i-lucide-filter" color="neutral" variant="soft" size="sm" class="cursor-default" @click.stop />
            <template #content>
              <!--
                Sustenta 20 filtros ou mais: a lista tem altura máxima e rola por dentro,
                cada filtro ocupa 1 linha com o valor truncado e o texto inteiro no title,
                e a ordenação e o atalho para o painel ficam fixos embaixo (rodada 6).
              -->
              <div class="flex max-h-[min(24rem,70vh)] w-96 flex-col" @click.stop>
                <p class="flex items-center justify-between gap-2 px-3 pb-2 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">
                  {{ t.painel.filtrosAplicados }}
                  <span class="tabular-nums">{{ row.original.pedido.proto.filtros.length }}</span>
                </p>
                <ul class="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-2">
                  <li
                    v-for="(f, i) in row.original.pedido.proto.filtros"
                    :key="i"
                    class="flex min-w-0 items-center gap-1.5 text-sm"
                    :title="`${f.campo} ${t.operadores[f.operador]} ${f.valor}`.trim()"
                  >
                    <UBadge :label="f.campo" color="neutral" variant="soft" size="sm" class="max-w-40 shrink-0" :ui="{ label: 'truncate' }" />
                    <span class="shrink-0 text-muted">{{ t.operadores[f.operador] }}</span>
                    <span v-if="f.valor" class="min-w-0 truncate font-medium text-highlighted">{{ f.valor }}</span>
                  </li>
                </ul>
                <div class="shrink-0 border-t border-default px-3 py-2.5">
                  <p class="flex items-start gap-1.5 text-xs text-muted">
                    <UIcon name="i-lucide-arrow-down-wide-narrow" class="mt-px size-3.5 shrink-0" />
                    <span class="line-clamp-2">{{ t.painel.ordenacao }}: {{ row.original.pedido.proto.ordenacao }}</span>
                  </p>
                  <UButton
                    :label="t.painel.verNoPainel"
                    icon="i-lucide-panel-right-open"
                    color="neutral"
                    variant="link"
                    size="xs"
                    class="mt-1.5 px-0"
                    @click="emit('abrir', row.original.id)"
                  />
                </div>
              </div>
            </template>
          </UPopover>
          <span v-else class="text-sm text-dimmed">{{ t.semFiltro }}</span>
        </template>

        <template #tamanho-cell="{ row }">
          <span class="block text-right text-sm tabular-nums" :class="row.original.tamanho == null ? 'text-dimmed' : 'text-toned'">
            {{ row.original.tamanho == null ? '-' : tamanho(Number(row.original.tamanho), idioma) }}
          </span>
        </template>

        <template #criadoEm-cell="{ row }">
          <span class="whitespace-nowrap text-sm text-toned">{{ dataCurta(String(row.original.criadoEm), t, idioma) }}</span>
        </template>

        <template #loading>
          <div class="flex items-center justify-center py-8 text-muted">
            <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
          </div>
        </template>

        <!-- Filtro de coluna sem resultado: a tabela fica, com os cabeçalhos, para a pessoa desfazer o filtro -->
        <template #empty>
          <UEmpty
            icon="i-lucide-search-x"
            :title="filtros.busca ? t.vazio.buscaTitulo(filtros.busca) : t.vazio.buscaTitulo('')"
            :description="t.vazio.buscaDescricao"
            :actions="[{ label: t.barra.limparFiltros, color: 'neutral', variant: 'outline', onClick: limpar }]"
            variant="naked"
            class="py-10"
          />
        </template>
      </UTable>

      <!-- Rodapé, como o do EnTable: seleção à esquerda, paginação à direita -->
      <div v-if="filtrados.length" class="flex items-center justify-between gap-3 border-t border-default px-3 pt-4">
        <span class="text-sm text-muted">{{ t.selecao.contagem(selecionadas.length, filtrados.length) }}</span>
        <UPagination
          v-model:page="pagina"
          :total="filtrados.length"
          :items-per-page="POR_PAGINA"
          show-edges
          size="sm"
        />
      </div>
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
          @click="emit('baixar', prontasSelecionadas.map(p => p.id))"
        />
        <UButton icon="i-lucide-trash-2" :label="t.selecao.excluir" size="sm" color="error" variant="ghost" @click="emit('excluir', selecionadas.map(p => p.id)); selecao = {}" />
        <UButton icon="i-lucide-x" size="sm" color="neutral" variant="ghost" :aria-label="t.selecao.limpar" @click="selecao = {}" />
      </div>
    </Transition>
  </div>
</template>
