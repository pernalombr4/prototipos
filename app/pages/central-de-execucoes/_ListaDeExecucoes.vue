<script setup lang="ts">
/**
 * A lista de execuções.
 *
 * Hoje (cópia do develop, 24/10/2026): só existe dentro de um fluxo. Busca "Buscar execuções...",
 * colunas Ações, Referência, Status, Vers e Iniciado em, menu da linha com "Ver Detalhes" e
 * "Abrir Execução", paginação de 25.
 *
 * PROPOSTA (a lista global, aba Execuções do Spaceflow, e a mesma lista dentro do fluxo):
 * - colunas Execução (título legível), Fluxo, Item, Status com motivo, Disparada por, Iniciada em,
 *   Duração e Cadeia;
 * - filtros removíveis numa linha: status, fluxo, operação, origem do disparo, e "Só a origem de
 *   cada cadeia" ligado por padrão, para 38 fluxos não virarem 38 linhas por contrato;
 * - visões salvas;
 * - a busca acha o item (o contrato X) e filtra a lista pela jornada dele, com a frase
 *   "Passou por N fluxos" no topo;
 * - "Reprocessar" no menu da linha que falhou.
 */
import type { DropdownMenuItem, SelectItem } from '@nuxt/ui'
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Execucao, Fluxo } from './mocks'
import { categorias } from './mocks'
import { fluxosDaOperacao, operacoes, operacoesDoFluxo } from './operacoes'
import type { Dados, Fase, FiltroDaLista } from './consultas'
import { aplicarFiltro, buscarItens, descreverDisparo, filtroVazio, fluxoPorId, grupoDe, itemPorId, jornadaDoItem, ordemDosGrupos, passoDe, resumoDasCadeias, estiloDoGrupo } from './consultas'
import type { GrupoDeStatus, Textos, TipoDeDisparo } from './textos'
import StatusDaExecucao from './_StatusDaExecucao.vue'

const props = defineProps<{
  t: Textos
  dados: Dados
  fase: Fase
  hoje?: boolean
  /** A lista de dentro de um fluxo: sem as colunas e os filtros que só servem à lista global. */
  fluxo?: Fluxo
  carregando?: boolean
}>()

const filtro = defineModel<FiltroDaLista>('filtro', { required: true })
const emit = defineEmits<{ abrirExecucao: [number], abrirItem: [number], verJornada: [number] }>()

const idioma = useIdioma()
const toast = useToast()

const base = computed(() => props.fluxo ? props.dados.execucoes.filter(e => e.workflow === props.fluxo!.id) : props.dados.execucoes)
const global = computed(() => !props.fluxo && !props.hoje)

/* ---------- busca: texto livre e item ---------- */
const busca = ref('')
const itensAchados = computed(() => (global.value && !filtro.value.item ? buscarItens(busca.value, props.dados) : []))

function escolherItem(id: number) {
  filtro.value = { ...filtro.value, item: id }
  busca.value = ''
}

const filtradas = computed(() => aplicarFiltro(base.value, props.hoje ? filtroVazio() : filtroEfetivo.value, props.fase, busca.value))

/* ---------- o item filtrado ---------- */
const itemFiltrado = computed(() => (filtro.value.item ? itemPorId.get(filtro.value.item) : undefined))
const jornada = computed(() => itemFiltrado.value ? jornadaDoItem(itemFiltrado.value, base.value, props.fase, filtro.value.comCadeia) : [])
const partesDaJornada = computed(() => ordemDosGrupos
  .map(g => ({ g, n: jornada.value.filter(e => grupoDe(e) === g).length }))
  .filter(x => x.n > 0)
  .map(x => props.t.busca.contagem(x.n, x.g)))

/* ---------- filtros ---------- */
const filtroEfetivo = computed<FiltroDaLista>(() => ({ ...filtro.value, soOrigem: global.value && filtro.value.soOrigem }))
/** Quantas linhas cada chip de status deixaria na lista (com "Só a origem", quantas cadeias). */
const contagem = computed(() => {
  const c: Partial<Record<GrupoDeStatus, number>> = {}
  for (const g of ordemDosGrupos) c[g] = aplicarFiltro(base.value, { ...filtroEfetivo.value, grupos: [g] }, props.fase, busca.value).length
  return c
})

function alternarGrupo(g: GrupoDeStatus) {
  const gs = filtro.value.grupos
  filtro.value = { ...filtro.value, grupos: gs.includes(g) ? gs.filter(x => x !== g) : [...gs, g] }
}

const opcoesDeFluxo = computed(() => props.dados.fluxos.map(f => ({ label: f.name, value: f.id })))
const opcoesDeOperacao = computed<SelectItem[]>(() => [
  { label: props.t.execucoes.filtros.todasAsOperacoes, value: 'todas' },
  ...operacoes.value.filter(o => fluxosDaOperacao(o.id, props.dados.fluxos).length).map(o => ({ label: o.nome, value: o.id })),
])
const opcoesDeDisparo = computed<SelectItem[]>(() => [
  { label: props.t.disparo.qualquer, value: 'qualquer' },
  ...(['pessoa', 'fluxo', 'agendamento', 'webhook', 'email'] as TipoDeDisparo[])
    .filter(x => props.fase === 2 || x !== 'fluxo')
    .map(x => ({ label: props.t.disparo.tipos[x], value: x })),
])

const operacaoEscolhida = computed({
  get: () => filtro.value.operacao ?? 'todas',
  set: v => { filtro.value = { ...filtro.value, operacao: v === 'todas' ? undefined : v as FiltroDaLista['operacao'] } },
})
const disparoEscolhido = computed({
  get: () => filtro.value.disparo ?? 'qualquer',
  set: v => { filtro.value = { ...filtro.value, disparo: v === 'qualquer' ? undefined : v as TipoDeDisparo } },
})
const fluxosEscolhidos = computed({
  get: () => filtro.value.fluxos,
  set: v => { filtro.value = { ...filtro.value, fluxos: v } },
})

const temFiltro = computed(() => {
  const f = filtro.value
  return !!(f.grupos.length || f.fluxos.length || f.operacao || f.disparo || f.item || f.periodo || busca.value)
})
function limpar() {
  filtro.value = { ...filtroVazio(), soOrigem: filtro.value.soOrigem }
  busca.value = ''
  visao.value = 'todas'
}

/* ---------- visões salvas ---------- */
type Visao = 'todas' | 'falhasContratos' | 'esperandoPessoa'
const visao = ref<Visao>('todas')
const opcoesDeVisao = computed<SelectItem[]>(() => (['todas', 'falhasContratos', 'esperandoPessoa'] as Visao[]).map(v => ({ label: props.t.execucoes.visoes[v], value: v })))
watch(visao, (v) => {
  if (v === 'todas') return
  filtro.value = v === 'falhasContratos'
    ? { ...filtroVazio(), operacao: 'contratos', grupos: ['erro', 'parada'], soOrigem: false }
    : { ...filtroVazio(), grupos: ['esperando'], soOrigem: false }
})

/* ---------- tabela ---------- */
const POR_PAGINA = 25
const pagina = ref(1)
watch([filtro, busca, () => props.fase], () => { pagina.value = 1 }, { deep: true })
const visiveis = computed(() => filtradas.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA))
const cadeias = computed(() => resumoDasCadeias(props.dados.execucoes))

interface Linha extends Record<string, unknown> { id: number, e: Execucao }
const linhas = computed<Linha[]>(() => visiveis.value.map(e => ({ id: e.id, e })))

const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.execucoes.colunas
  if (props.hoje) {
    return [
      { key: 'referencia', label: c.execucao },
      { key: 'status', label: c.status },
      { key: 'versao', label: 'Vers' },
      { key: 'iniciada', label: c.iniciada },
    ]
  }
  return [
    { key: 'execucao', label: c.execucao },
    { key: 'item', label: c.item },
    { key: 'status', label: c.status },
    { key: 'disparo', label: c.disparo },
    { key: 'iniciada', label: c.iniciada },
    { key: 'duracao', label: c.duracao },
    ...(props.fase === 2 ? [{ key: 'cadeia', label: c.cadeia }] : []),
  ]
})

function reprocessar(e: Execucao) {
  toast.add({ title: props.t.detalhe.reprocessado, description: props.t.detalhe.reprocessadoDesc, icon: 'i-lucide-rotate-ccw', color: 'success' })
  emit('abrirExecucao', e.id)
}

function menuDaLinha(e: Execucao): DropdownMenuItem[][] {
  const base: DropdownMenuItem[] = [
    { label: props.t.execucoes.verDetalhes, icon: 'i-lucide-eye', onSelect: () => emit('abrirExecucao', e.id) },
    { label: props.t.execucoes.abrirExecucao, icon: 'i-lucide-arrow-up-right', onSelect: () => emit('abrirExecucao', e.id) },
  ]
  if (props.hoje) return [base]
  const extra: DropdownMenuItem[] = []
  if (e.item) extra.push({ label: props.t.execucoes.abrirItem, icon: 'i-lucide-file-text', onSelect: () => emit('abrirItem', e.item!) })
  if (e.status === 'error') extra.push({ label: props.t.execucoes.reprocessar, icon: 'i-lucide-rotate-ccw', onSelect: () => reprocessar(e) })
  return extra.length ? [base, extra] : [base]
}

const formatoData = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', year: 'numeric' }))
const formatoHora = computed(() => new Intl.DateTimeFormat(props.t.locale, { hour: '2-digit', minute: '2-digit' }))
const iconeDoItem = (id: number) => categorias[itemPorId.get(id)!.categoria].icone
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- Busca -->
    <div class="flex items-center gap-2 border-b border-default px-4 py-2">
      <UInput
        v-model="busca"
        icon="i-lucide-search"
        :placeholder="hoje ? t.execucoes.buscarHoje : t.execucoes.buscar"
        variant="none"
        class="flex-1"
        :aria-label="t.execucoes.buscar"
      />
      <USelect v-if="global" v-model="visao" :items="opcoesDeVisao" size="xs" icon="i-lucide-bookmark" class="w-56" :aria-label="t.execucoes.visoes.rotulo" />
    </div>

    <!-- PROPOSTA: itens que a busca achou. Escolher um filtra a lista pela jornada dele. -->
    <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-100" leave-to-class="opacity-0">
      <div v-if="itensAchados.length" class="flex flex-wrap items-center gap-1.5 border-b border-default bg-elevated/40 px-4 py-2">
        <span class="mr-1 text-xs font-medium text-muted">{{ t.execucoes.itensEncontrados }}</span>
        <UButton
          v-for="i in itensAchados"
          :key="i.id"
          size="xs"
          color="neutral"
          variant="outline"
          :icon="categorias[i.categoria].icone"
          class="max-w-80"
          @click="escolherItem(i.id)"
        >
          <span class="whitespace-nowrap font-medium">{{ i.reference }}</span>
          <span class="truncate text-muted">{{ i.titulo }}</span>
        </UButton>
      </div>
    </Transition>

    <!-- PROPOSTA: o item filtrado, com o resumo da jornada -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1">
      <div v-if="itemFiltrado && global" class="border-b border-default px-4 py-3">
        <div class="flex flex-wrap items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <UIcon :name="iconeDoItem(itemFiltrado.id)" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-highlighted">
              {{ itemFiltrado.reference }} <span class="font-normal text-toned">{{ itemFiltrado.titulo }}</span>
            </p>
            <p class="mt-0.5 text-sm text-toned">
              {{ t.busca.passou(new Set(jornada.map(e => e.workflow)).size, jornada.length) }}<template v-if="partesDaJornada.length">: {{ t.busca.partes(partesDaJornada) }}</template>.
            </p>
            <USwitch
              v-if="fase === 2"
              v-model="filtro.comCadeia"
              :label="t.busca.comCadeia"
              size="sm"
              class="mt-2"
            />
            <p v-else class="mt-1 flex items-center gap-1 text-xs text-muted">
              <UIcon name="i-lucide-info" class="size-3.5" />{{ t.busca.soDireto }}
            </p>
          </div>
          <div class="flex shrink-0 flex-wrap items-center gap-1.5">
            <UButton :label="t.busca.verJornada" icon="i-lucide-map" size="xs" color="primary" variant="outline" @click="emit('verJornada', itemFiltrado.id)" />
            <UButton :label="t.busca.abrirItem" icon="i-lucide-arrow-up-right" size="xs" color="neutral" variant="outline" @click="emit('abrirItem', itemFiltrado.id)" />
            <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" :aria-label="t.busca.limpar" @click="filtro = { ...filtro, item: undefined }" />
          </div>
        </div>
      </div>
    </Transition>

    <!-- PROPOSTA: filtros numa linha -->
    <div v-if="!hoje" class="flex flex-wrap items-center gap-1.5 border-b border-default px-4 py-2">
      <UButton
        v-for="g in ordemDosGrupos"
        :key="g"
        :label="t.grupos[g]"
        :icon="estiloDoGrupo[g].icone"
        size="xs"
        :color="filtro.grupos.includes(g) ? 'primary' : 'neutral'"
        :variant="filtro.grupos.includes(g) ? 'soft' : 'outline'"
        class="rounded-full"
        :aria-pressed="filtro.grupos.includes(g)"
        @click="alternarGrupo(g)"
      >
        <template #trailing>
          <span class="text-xs tabular-nums text-muted">{{ contagem[g] ?? 0 }}</span>
        </template>
      </UButton>
      <template v-if="global">
        <USeparator orientation="vertical" class="mx-1 h-5" />
        <USelectMenu
          v-model="fluxosEscolhidos"
          :items="opcoesDeFluxo"
          value-key="value"
          multiple
          size="xs"
          icon="i-lucide-workflow"
          :placeholder="t.execucoes.filtros.todosOsFluxos"
          :search-input="{ placeholder: t.execucoes.filtros.fluxoBuscar }"
          class="w-48"
          :aria-label="t.execucoes.filtros.fluxo"
        >
          <template v-if="fluxosEscolhidos.length" #default>
            <span class="truncate">{{ fluxosEscolhidos.length === 1 ? fluxoPorId.get(fluxosEscolhidos[0]!)?.name : t.execucoes.filtros.fluxosEscolhidos(fluxosEscolhidos.length) }}</span>
          </template>
        </USelectMenu>
        <USelect v-model="operacaoEscolhida" :items="opcoesDeOperacao" size="xs" icon="i-lucide-boxes" class="w-48" :aria-label="t.execucoes.filtros.operacao" />
        <USelect v-model="disparoEscolhido" :items="opcoesDeDisparo" size="xs" icon="i-lucide-zap" class="w-44" :aria-label="t.execucoes.filtros.disparo" />
        <USwitch
          v-if="fase === 2 && !filtro.item"
          v-model="filtro.soOrigem"
          :label="t.execucoes.filtros.soOrigem"
          size="sm"
          class="ml-1"
        />
      </template>
      <UButton
        v-if="temFiltro"
        :label="t.execucoes.filtros.limpar"
        icon="i-lucide-filter-x"
        size="xs"
        color="neutral"
        variant="ghost"
        class="ml-auto"
        @click="limpar"
      />
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-2">
      <EnTable
        :columns="colunas"
        :rows="linhas"
        :loading="carregando"
        :locale="idioma"
        :empty-state="{ icon: 'i-lucide-circle-play', title: temFiltro ? t.execucoes.vazioFiltro : t.execucoes.vazio }"
        class="[&_tbody_tr]:cursor-pointer"
        @row-click="(r: Linha) => emit('abrirExecucao', r.e.id)"
      >
        <template #cell-referencia="{ row }">
          <span class="font-mono text-xs text-toned">{{ (row as Linha).e.reference }}</span>
        </template>
        <template #cell-versao="{ row }">
          <span class="font-mono text-xs text-toned">v{{ (row as Linha).e.version }}</span>
        </template>
        <template #cell-execucao="{ row }">
          <span class="flex min-w-0 flex-col py-1">
            <span class="max-w-72 truncate text-sm font-medium text-highlighted">{{ fluxoPorId.get((row as Linha).e.workflow as number)?.name }}</span>
            <span class="flex items-center gap-1.5 text-xs text-muted">
              <span v-if="!fluxo" class="truncate">{{ operacoesDoFluxo(fluxoPorId.get((row as Linha).e.workflow as number)!).map(o => o.nome).join(', ') }}</span>
              <span class="font-mono text-[11px] text-dimmed">{{ (row as Linha).e.reference }}</span>
            </span>
          </span>
        </template>
        <template #cell-item="{ row }">
          <UButton
            v-if="(row as Linha).e.item"
            :label="itemPorId.get((row as Linha).e.item!)?.reference ?? ''"
            :icon="iconeDoItem((row as Linha).e.item!)"
            size="xs"
            color="neutral"
            variant="link"
            class="px-0"
            @click.stop="emit('abrirItem', (row as Linha).e.item!)"
          />
          <span v-else class="text-xs text-dimmed">{{ t.execucoes.semItem }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="py-1"><StatusDaExecucao :e="(row as Linha).e" :t="t" :hoje="hoje" /></span>
        </template>
        <template #cell-disparo="{ row }">
          <span class="flex min-w-0 items-start gap-1.5">
            <UIcon :name="descreverDisparo((row as Linha).e, t, fase).icone" class="mt-0.5 size-3.5 shrink-0 text-muted" />
            <span class="flex min-w-0 flex-col">
              <span class="max-w-56 truncate text-sm text-toned">{{ descreverDisparo((row as Linha).e, t, fase).texto }}</span>
              <span v-if="descreverDisparo((row as Linha).e, t, fase).detalhe" class="text-xs text-muted">{{ descreverDisparo((row as Linha).e, t, fase).detalhe }}</span>
            </span>
          </span>
        </template>
        <template #cell-iniciada="{ row }">
          <span class="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-toned">
            {{ formatoData.format((row as Linha).e.created_at) }}
            <span class="text-xs text-muted">{{ formatoHora.format((row as Linha).e.created_at) }}</span>
          </span>
        </template>
        <template #cell-duracao="{ row }">
          <span class="whitespace-nowrap text-sm tabular-nums text-toned">
            {{ ['rodando', 'esperando'].includes(grupoDe((row as Linha).e)) ? '' : t.duracao((row as Linha).e.duracao_ms) }}
          </span>
        </template>
        <template #cell-cadeia="{ row }">
          <span class="flex flex-col items-start gap-0.5 whitespace-nowrap text-xs text-muted">
            <span class="inline-flex items-center gap-1">
              <UIcon :name="passoDe((row as Linha).e) > 1 ? 'i-lucide-corner-down-right' : 'i-lucide-git-fork'" class="size-3.5" />
              {{ passoDe((row as Linha).e) > 1 ? t.execucoes.cadeiaPasso(passoDe((row as Linha).e)) : t.execucoes.cadeiaOrigem(cadeias.get((row as Linha).e.id)?.n ?? 1) }}
            </span>
            <span v-if="passoDe((row as Linha).e) === 1 && (cadeias.get((row as Linha).e.id)?.erros ?? 0) > 0 && grupoDe((row as Linha).e) !== 'erro'" class="inline-flex items-center gap-1 text-error">
              <UIcon name="i-lucide-circle-x" class="size-3.5" />{{ t.execucoes.cadeiaComErro(cadeias.get((row as Linha).e.id)!.erros) }}
            </span>
          </span>
        </template>
        <template #actions="{ row }">
          <UDropdownMenu :items="menuDaLinha((row as Linha).e)" :ui="{ content: 'w-48' }">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.execucoes.acoes" @click.stop />
          </UDropdownMenu>
        </template>
      </EnTable>
    </div>

    <div class="flex shrink-0 items-center justify-between gap-2 border-t border-default px-4 py-2 text-xs text-muted">
      <span>{{ filtradas.length ? t.execucoes.mostrando((pagina - 1) * POR_PAGINA + 1, Math.min(pagina * POR_PAGINA, filtradas.length), filtradas.length) : '' }}</span>
      <UPagination v-model:page="pagina" :total="filtradas.length" :items-per-page="POR_PAGINA" size="xs" :sibling-count="1" />
    </div>
  </div>
</template>
