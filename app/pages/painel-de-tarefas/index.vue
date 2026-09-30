<script setup lang="ts">
/**
 * Painel de tarefas: a visão de conjunto das tarefas do workspace.
 *
 * Nativo, com conteúdo fixo. Não é o construtor de painéis da Interface (que
 * só lê itens e exige "Categoria"): o catálogo de painéis é fechado e cada um
 * mostra sempre o mesmo número. O gestor recorta por período, origem,
 * responsável e categoria.
 *
 * Rodada 2:
 * - origem em 2: criadas manualmente e criadas por fluxo (Spaceflow e fluxo
 *   da categoria juntos). O motor por baixo (`/ws/tasks` ou
 *   `/c-flow-item-tasks`) só decide para qual lista o "Abrir em" leva;
 * - "a vencer" = prazo nos próximos 7 dias, o corte mais comum no mercado;
 * - cada pessoa arruma o painel como no ClickUp: "Personalizar" liga o modo
 *   de edição (mover, redimensionar, ocultar, adicionar, desfazer, restaurar);
 * - painéis de lista com rolagem infinita;
 * - desenho do template de dashboard do Nuxt UI, o mesmo do admin.
 *
 * O dado é o `mocks.ts` desta pasta. As regras estão em `metricas.ts`; o
 * catálogo e o arranjo padrão, em `paineis.ts`.
 */
import type { ItemDaGrade } from '~/components/ux/UxGradeDePaineis.vue'
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import BarraDeFiltros from './_BarraDeFiltros.vue'
import BlocoPrazos from './_BlocoPrazos.vue'
import BlocoSla from './_BlocoSla.vue'
import BlocoStatus from './_BlocoStatus.vue'
import CartaoNumero from './_CartaoNumero.vue'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import CatalogoDePaineis from './_CatalogoDePaineis.vue'
import GavetaDeTarefas from './_GavetaDeTarefas.vue'
import GraficoSerie from './_GraficoSerie.vue'
import ListaProximas from './_ListaProximas.vue'
import Painel from './_Painel.vue'
import TabelaResponsaveis from './_TabelaResponsaveis.vue'
import TempoEtapa from './_TempoEtapa.vue'
import TempoFluxo from './_TempoFluxo.vue'
import TempoTarefa from './_TempoTarefa.vue'
import { AGORA } from './mocks'
import {
  aplicarFiltros, blocoSla, dentro, estaAberta, execucoesDoFiltro, faixaDe, faixasDePrazo, flowItemsDoFiltro,
  granularidadePadrao, intervaloDo, numerosDoTopo, porResponsavel, porStatus,
  proximasAVencer, serie, situacao, tempoDeConclusao, temposPorEtapa, temposPorFluxo, temposPorTarefa,
  todasAsTarefas,
} from './metricas'
import type {
  Faixa, Filtros, Granularidade, ModoDoResponsavel, Situacao, StatusVirtual, TarefaDoPainel, TempoDaTarefa,
} from './metricas'
import type { IdDoPainel } from './paineis'
import { DEFINICAO, LIMITES, PAINEIS, gravarLayout, layoutPadrao, lerLayout } from './paineis'
import { duracao, hora, numero, porcentagem } from './formatar'
import { textos } from './textos'

definePageMeta({
  titulo: 'Painel de tarefas',
  descricao: 'Painel nativo das tarefas criadas manualmente e por fluxo: SLA, a vencer, responsáveis, status e tempo de tarefa, etapa e fluxo. Cada pessoa move, redimensiona e oculta os painéis.',
  status: 'em-revisao',
  atualizado: '2026-09-30',
  tela: 'Tarefas › Painel',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME: o seletor de estados não é proposta. Existe para percorrer *
 * os estados que a tela precisa ter.                                  *
 * ------------------------------------------------------------------ */
type Estado = 'cheio' | 'carregando' | 'semResultado' | 'vazio' | 'erro' | 'semPermissao'
const estado = ref<Estado>('cheio')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'cheio', rotulo: 'Cheio' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'semResultado', rotulo: 'Filtro sem resultado' },
  { valor: 'vazio', rotulo: 'Workspace sem tarefas' },
  { valor: 'erro', rotulo: 'Erro' },
  { valor: 'semPermissao', rotulo: 'Sem permissão' },
]

/* --------------------------------- filtros -------------------------------- */

const FILTROS_PADRAO: Filtros = { periodo: '30d', origem: 'todas', responsaveis: [], categorias: [] }
const filtros = ref<Filtros>({ ...FILTROS_PADRAO })
const granularidade = ref<Granularidade>(granularidadePadrao('30d'))
const modoResponsavel = ref<ModoDoResponsavel>('designada')

watch(() => filtros.value.periodo, p => { granularidade.value = granularidadePadrao(p) })

/** O estado "Filtro sem resultado" usa um recorte que não tem nada: tarefa manual não vai para e-mail externo. */
watch(estado, (e) => {
  if (e === 'semResultado') filtros.value = { periodo: '7d', origem: 'manual', responsaveis: ['externo'], categorias: [] }
  else if (filtros.value.origem === 'manual' && filtros.value.responsaveis[0] === 'externo') filtros.value = { ...FILTROS_PADRAO }
})

/** Chave que muda a cada filtro: remonta os painéis com a entrada em cascata. */
const chaveDosFiltros = computed(() => JSON.stringify(filtros.value))

/* ---------------------------------- dado ---------------------------------- */

const base = computed<TarefaDoPainel[]>(() => estado.value === 'vazio' ? [] : todasAsTarefas)
const lista = computed(() => aplicarFiltros(base.value, filtros.value))
const intervalo = computed(() => intervaloDo(filtros.value.periodo))

const numeros = computed(() => numerosDoTopo(lista.value, intervalo.value))
const sla = computed(() => blocoSla(lista.value, intervalo.value))
const faixas = computed(() => faixasDePrazo(lista.value))
const proximas = computed(() => proximasAVencer(lista.value))
const baldes = computed(() => serie(lista.value, intervalo.value, granularidade.value))
const linhasDeStatus = computed(() => porStatus(lista.value, intervalo.value))
const linhasDeResponsavel = computed(() => porResponsavel(lista.value, intervalo.value, modoResponsavel.value, t.value.rotulos))
const temposTarefa = computed(() => temposPorTarefa(lista.value, intervalo.value))
const itensDoFluxo = computed(() => estado.value === 'vazio' ? [] : flowItemsDoFiltro(filtros.value))
const execucoes = computed(() => estado.value === 'vazio' ? [] : execucoesDoFiltro(filtros.value))
const temposEtapa = computed(() => temposPorEtapa(itensDoFluxo.value, intervalo.value))
const temposFluxo = computed(() => temposPorFluxo(itensDoFluxo.value, execucoes.value, lista.value, intervalo.value))
const soManual = computed(() => filtros.value.origem === 'manual')

/** Nada no recorte: nem aberta, nem movimento no período. */
const semNada = computed(() => numeros.value.abertas === 0 && numeros.value.concluidas === 0 && numeros.value.criadas === 0)

/* ------------------------------ os números -------------------------------- */

type Tom = 'bom' | 'ruim' | 'neutro'

function variacaoRelativa(agora: number, antes: number | null, subirEhBom: boolean) {
  if (antes === null) return null
  const d = agora - antes
  const pct = antes ? d / antes : null
  const texto = `${d > 0 ? '+' : ''}${pct === null ? numero(d, t.value) : porcentagem(pct, t.value)}`
  const tom: Tom = d === 0 ? 'neutro' : (d > 0) === subirEhBom ? 'bom' : 'ruim'
  return { texto, ajuda: t.value.comparacao, tom, leitor: t.value.vsAnterior }
}

const NUMEROS: IdDoPainel[] = ['abertas', 'vencidas', 'aVencer', 'concluidas', 'noPrazo', 'tempo']
const ehNumero = (id: string) => NUMEROS.includes(id as IdDoPainel)

const cartoes = computed(() => {
  const n = numeros.value
  const tt = t.value
  const pontos = n.noPrazoPct !== null && n.noPrazoPctAntes !== null ? Math.round((n.noPrazoPct - n.noPrazoPctAntes) * 100) : null
  const tempoAntes = n.tempoAntes?.media ?? null
  type Cartao = { valor: string, detalhe: string, cor: 'neutral' | 'error' | 'warning' | 'success', quando: string, variacao: ReturnType<typeof variacaoRelativa> }
  const c: Record<string, Cartao> = {
    abertas: {
      valor: numero(n.abertas, tt), cor: 'neutral', quando: tt.agora, variacao: null,
      detalhe: tt.kpi.abertasDetalhe(numero(n.porStatus.nao_iniciada, tt), numero(n.porStatus.em_andamento, tt), numero(n.porStatus.bloqueada, tt)),
    },
    vencidas: {
      valor: numero(n.vencidas, tt), cor: n.vencidas ? 'error' : 'neutral', quando: tt.agora, variacao: null,
      detalhe: tt.kpi.vencidasDetalhe(porcentagem(n.abertas ? n.vencidas / n.abertas : 0, tt)),
    },
    aVencer: {
      valor: numero(n.aVencer, tt), cor: n.aVencer ? 'warning' : 'neutral', quando: tt.agora, variacao: null,
      detalhe: tt.kpi.aVencerDetalhe(numero(n.aVencer24h, tt)),
    },
    concluidas: {
      valor: numero(n.concluidas, tt), cor: 'neutral', quando: tt.noPeriodo,
      detalhe: tt.kpi.concluidasDetalhe(numero(n.criadas, tt)),
      variacao: variacaoRelativa(n.concluidas, n.concluidasAntes, true),
    },
    noPrazo: {
      valor: porcentagem(n.noPrazoPct, tt),
      cor: n.noPrazoPct === null ? 'neutral' : n.noPrazoPct >= 0.85 ? 'success' : n.noPrazoPct >= 0.7 ? 'warning' : 'error',
      quando: tt.noPeriodo,
      detalhe: tt.kpi.noPrazoDetalhe(numero(n.noPrazo, tt), numero(n.comPrazo, tt)),
      variacao: pontos === null ? null : { texto: `${pontos > 0 ? '+' : ''}${tt.pontos(numero(pontos, tt))}`, ajuda: tt.comparacao, tom: pontos === 0 ? 'neutro' : pontos > 0 ? 'bom' : 'ruim', leitor: tt.vsAnterior },
    },
    tempo: {
      valor: duracao(n.tempo?.media ?? null, tt), cor: 'neutral', quando: tt.noPeriodo,
      detalhe: tt.kpi.tempoDetalhe(duracao(n.tempo?.mediana ?? null, tt)),
      variacao: n.tempo && tempoAntes !== null ? variacaoRelativa(Math.round(n.tempo.media / 60000), Math.round(tempoAntes / 60000), false) : null,
    },
  }
  return c
})

/* ------------------------------- a gaveta --------------------------------- */

const gaveta = ref({ aberta: false, titulo: '', tarefas: [] as TarefaDoPainel[] })

function abrir(titulo: string, filtro: (x: TarefaDoPainel) => boolean, ordenar?: (a: TarefaDoPainel, b: TarefaDoPainel) => number) {
  const achadas = lista.value.filter(filtro)
  gaveta.value = { aberta: true, titulo, tarefas: ordenar ? achadas.sort(ordenar) : achadas }
}

const porPrazo = (a: TarefaDoPainel, b: TarefaDoPainel) => (a.prazo ?? Infinity) - (b.prazo ?? Infinity)
const maisLentas = (a: TarefaDoPainel, b: TarefaDoPainel) => (tempoDeConclusao(b) ?? 0) - (tempoDeConclusao(a) ?? 0)
const noPeriodo = (x: TarefaDoPainel) => x.status === 'concluida' && dentro(x.concluidaEm, intervalo.value)

function abrirCartao(id: string) {
  const r = t.value.recortes
  switch (id) {
    case 'abertas': return abrir(r.abertas, estaAberta, porPrazo)
    case 'vencidas': return abrir(r.vencidas, x => estaAberta(x) && situacao(x) === 'vencida', porPrazo)
    case 'aVencer': return abrir(r.aVencer, x => estaAberta(x) && situacao(x) === 'a_vencer', porPrazo)
    case 'concluidas': return abrir(r.concluidas, noPeriodo, (a, b) => b.concluidaEm! - a.concluidaEm!)
    case 'noPrazo': return abrir(r.atrasadas, x => noPeriodo(x) && situacao(x) === 'atrasada', (a, b) => b.concluidaEm! - a.concluidaEm!)
    case 'tempo': return abrir(r.tempo, noPeriodo, maisLentas)
  }
}

function abrirSituacao(s: Situacao, grupo: 'abertas' | 'concluidas') {
  const titulo = `${grupo === 'abertas' ? t.value.sla.abertasAgora : t.value.sla.concluidasNoPeriodo} · ${t.value.situacao[s]}`
  if (grupo === 'abertas') abrir(titulo, x => estaAberta(x) && situacao(x) === s, porPrazo)
  else abrir(titulo, x => noPeriodo(x) && situacao(x) === s)
}

function abrirFaixa(f: Faixa) {
  abrir(t.value.prazos.faixas[f], x => estaAberta(x) && faixaDe(x) === f, porPrazo)
}

function abrirStatus(s: StatusVirtual) {
  const titulo = t.value.status[s]
  if (s === 'concluida') abrir(titulo, noPeriodo)
  else if (s === 'removida') abrir(titulo, x => x.status === 'removida' && dentro(x.criadaEm, intervalo.value))
  else abrir(titulo, x => x.status === s, porPrazo)
}

function abrirResponsavel(chave: string) {
  const linha = linhasDeResponsavel.value.find(l => l.chave === chave)
  const bate = (x: TarefaDoPainel) => modoResponsavel.value === 'designada'
    ? x.designados.some(d => d.chave === chave)
    : (x.executadaPor ? `p:${x.executadaPor}` : 'sem') === chave
  abrir(linha?.nome ?? chave, x => bate(x) && (estaAberta(x) || noPeriodo(x)), porPrazo)
}

function abrirTempoDaTarefa(l: TempoDaTarefa) {
  const manual = l.nome === '__avulsa'
  abrir(manual ? t.value.tempos.avulsa : l.nome,
    x => noPeriodo(x) && (manual ? x.origem === 'manual' : x.origem === 'fluxo' && x.nome === l.nome && x.fluxo === l.fluxo),
    maisLentas)
}

function abrirTarefa() {
  toast.add({ title: t.value.gaveta.maquete, icon: 'i-lucide-construction', color: 'neutral' })
}

/* --------------------------- o arranjo da pessoa --------------------------- */

const editando = ref(false)
const layout = ref<ItemDaGrade[]>(layoutPadrao())
const historico = ref<ItemDaGrade[][]>([])
const catalogoAberto = ref(false)

onMounted(() => {
  const salvo = lerLayout()
  if (salvo) layout.value = salvo
})
watch(layout, l => gravarLayout(l), { deep: true })

const copia = (l: ItemDaGrade[]) => l.map(x => ({ ...x }))
const rotulos = computed(() => Object.fromEntries(PAINEIS.map(p => [p.id, t.value.paineis[p.id].titulo])))
const naTela = computed(() => layout.value.map(x => x.id as IdDoPainel))

function registrar(anterior: ItemDaGrade[]) {
  historico.value = [...historico.value.slice(-19), anterior]
}

function desfazer() {
  const ultimo = historico.value.pop()
  if (ultimo) layout.value = ultimo
  else toast.add({ title: t.value.grade.semHistorico, icon: 'i-lucide-undo-2', color: 'neutral' })
}

function ocultar(id: IdDoPainel) {
  registrar(copia(layout.value))
  layout.value = layout.value.filter(x => x.id !== id)
  toast.add({
    title: t.value.grade.ocultado(t.value.paineis[id].titulo),
    icon: 'i-lucide-eye-off',
    color: 'neutral',
    actions: [{ label: t.value.grade.desfazer, icon: 'i-lucide-undo-2', color: 'neutral', variant: 'outline', onClick: desfazer }],
  })
}

function tamanhoPadrao(id: IdDoPainel) {
  registrar(copia(layout.value))
  layout.value = layout.value.map(x => x.id === id ? { ...x, ...DEFINICAO[id].padrao } : x)
}

function alternar(id: IdDoPainel) {
  if (naTela.value.includes(id)) return ocultar(id)
  registrar(copia(layout.value))
  layout.value = [...layout.value, { id, ...DEFINICAO[id].padrao }]
  nextTick(() => document.querySelector(`[data-painel="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }))
}

function restaurarPadrao() {
  registrar(copia(layout.value))
  layout.value = layoutPadrao()
  toast.add({ title: t.value.grade.restaurado, icon: 'i-lucide-rotate-ccw', color: 'neutral' })
}

defineShortcuts({
  meta_z: {
    usingInput: false,
    handler: () => { if (editando.value) desfazer() },
  },
  escape: {
    usingInput: false,
    handler: () => { if (editando.value && !catalogoAberto.value) editando.value = false },
  },
})

const textosDaGrade = computed(() => ({
  redimensionar: t.value.grade.redimensionar,
  movido: t.value.grade.movido,
  tamanho: t.value.grade.tamanho,
}))

/* ------------------------------- atualizar -------------------------------- */

const atualizando = ref(false)
function atualizar() {
  atualizando.value = true
  setTimeout(() => { atualizando.value = false }, 900)
}

const carregando = computed(() => estado.value === 'carregando' || atualizando.value)
</script>

<template>
  <CascaDoEnspace :t="t" :workspace="t.workspace" slug="operacoes">
    <div class="relative min-h-0 flex-1 overflow-y-auto pb-28">
      <!-- Cabeçalho da tela -->
      <header class="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-3 px-6 pb-3 pt-5">
        <div class="space-y-0.5">
          <h1 class="text-xl font-semibold text-highlighted">
            {{ t.titulo }}
          </h1>
          <p class="text-sm text-muted">
            {{ t.subtitulo }}
          </p>
        </div>
        <div v-if="estado !== 'erro' && estado !== 'semPermissao'" class="flex items-center gap-2">
          <span class="text-xs text-muted">{{ t.atualizadoAs(hora(AGORA, t)) }}</span>
          <UButton
            :label="t.atualizar"
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="ghost"
            size="sm"
            :loading="atualizando"
            @click="atualizar"
          />
        </div>
      </header>

      <div class="mx-auto max-w-[1440px] px-6">
        <!-- Sem permissão e erro tomam a tela inteira -->
        <UEmpty
          v-if="estado === 'semPermissao'"
          icon="i-lucide-lock"
          :title="t.estados.semPermissaoTitulo"
          :description="t.estados.semPermissaoTexto"
          variant="outline"
          class="animate-[entrada_0.3s_ease-out_both] py-16"
        />
        <UEmpty
          v-else-if="estado === 'erro'"
          icon="i-lucide-cloud-off"
          :title="t.estados.erroTitulo"
          :description="t.estados.erroTexto"
          variant="outline"
          :actions="[{ label: t.estados.tentarDeNovo, icon: 'i-lucide-refresh-cw', color: 'primary', onClick: () => (estado = 'cheio') }]"
          class="animate-[entrada_0.3s_ease-out_both] py-16"
        />
      </div>

      <template v-if="estado !== 'semPermissao' && estado !== 'erro'">
        <!-- A barra de filtros e de arranjo, como o UDashboardToolbar do template -->
        <div class="sticky top-0 z-30 border-y border-default bg-default/90 backdrop-blur">
          <div class="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-6 py-1.5">
            <BarraDeFiltros v-model="filtros" :t="t" />

            <div class="flex flex-wrap items-center gap-1.5">
              <UButton
                v-if="!editando"
                :label="t.grade.personalizar"
                icon="i-lucide-layout-dashboard"
                color="neutral"
                variant="outline"
                size="sm"
                :disabled="estado === 'vazio'"
                @click="editando = true"
              />
              <template v-else>
                <UTooltip :text="t.grade.desfazer" :kbds="['meta', 'z']">
                  <UButton
                    :label="t.grade.desfazer"
                    icon="i-lucide-undo-2"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    :disabled="!historico.length"
                    @click="desfazer"
                  />
                </UTooltip>
                <UButton :label="t.grade.restaurarPadrao" icon="i-lucide-rotate-ccw" color="neutral" variant="ghost" size="sm" @click="restaurarPadrao" />
                <UButton :label="t.grade.adicionar" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="catalogoAberto = true" />
                <UButton :label="t.grade.concluir" icon="i-lucide-check" color="primary" size="sm" @click="editando = false" />
              </template>
            </div>
          </div>
        </div>

        <div class="mx-auto max-w-[1440px] space-y-4 px-6 py-5">
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
            <UAlert
              v-if="editando"
              icon="i-lucide-pencil-ruler"
              color="primary"
              variant="subtle"
              :title="t.grade.dica"
              :description="t.grade.soParaVoce"
            />
          </Transition>

          <!-- Carregando: o esqueleto tem o desenho do arranjo da pessoa -->
          <UxGradeDePaineis
            v-if="carregando"
            :model-value="layout"
            :limites="LIMITES"
            :rotulos="rotulos"
            :textos="textosDaGrade"
          >
            <template #default>
              <USkeleton class="h-full rounded-lg" />
            </template>
          </UxGradeDePaineis>

          <UEmpty
            v-else-if="estado === 'vazio'"
            icon="i-lucide-list-checks"
            :title="t.estados.vazioTitulo"
            :description="t.estados.vazioTexto"
            variant="outline"
            class="animate-[entrada_0.3s_ease-out_both] py-16"
          />

          <UEmpty
            v-else-if="semNada"
            icon="i-lucide-filter-x"
            :title="t.estados.semResultadoTitulo"
            :description="t.estados.semResultadoTexto"
            variant="outline"
            :actions="[{ label: t.filtros.limpar, icon: 'i-lucide-x', color: 'neutral', variant: 'outline', onClick: () => { filtros = { ...FILTROS_PADRAO }; estado = 'cheio' } }]"
            class="animate-[entrada_0.3s_ease-out_both] py-16"
          />

          <UEmpty
            v-else-if="!layout.length"
            icon="i-lucide-panels-top-left"
            :title="t.grade.vazioTitulo"
            :description="t.grade.vazioTexto"
            variant="outline"
            :actions="[{ label: t.grade.adicionar, icon: 'i-lucide-plus', color: 'primary', onClick: () => { catalogoAberto = true } }]"
            class="animate-[entrada_0.3s_ease-out_both] py-16"
          />

          <UxGradeDePaineis
            v-else
            :key="chaveDosFiltros"
            v-model="layout"
            :editavel="editando"
            :limites="LIMITES"
            :rotulos="rotulos"
            :textos="textosDaGrade"
            @alterado="registrar"
          >
            <template #default="{ item }">
              <Painel
                class="animate-[entrada_0.4s_ease-out_both]"
                :style="{ animationDelay: `${Math.min(layout.findIndex(x => x.id === item.id), 10) * 35}ms` }"
                :t="t"
                :titulo="t.paineis[item.id as IdDoPainel].titulo"
                :descricao="ehNumero(item.id) ? undefined : t.paineis[item.id as IdDoPainel].descricao"
                :regra="t.regras[item.id as IdDoPainel]"
                :editando="editando"
                :compacto="ehNumero(item.id)"
                :icone="DEFINICAO[item.id as IdDoPainel].icone"
                :selo="ehNumero(item.id) ? cartoes[item.id]!.quando : undefined"
                @ocultar="ocultar(item.id as IdDoPainel)"
                @tamanho-padrao="tamanhoPadrao(item.id as IdDoPainel)"
              >
                <CartaoNumero
                  v-if="ehNumero(item.id)"
                  :valor="cartoes[item.id]!.valor"
                  :detalhe="cartoes[item.id]!.detalhe"
                  :cor="cartoes[item.id]!.cor"
                  :variacao="cartoes[item.id]!.variacao"
                  @abrir="abrirCartao(item.id)"
                />
                <BlocoSla v-else-if="item.id === 'sla'" :t="t" :sla="sla" :sem-data-de-conclusao="numeros.semDataDeConclusao" @abrir="abrirSituacao" />
                <BlocoPrazos v-else-if="item.id === 'prazos'" :t="t" :faixas="faixas" @abrir="abrirFaixa" />
                <ListaProximas v-else-if="item.id === 'proximas'" :t="t" :tarefas="proximas" @abrir="abrirTarefa" />
                <GraficoSerie v-else-if="item.id === 'serie'" v-model:granularidade="granularidade" :t="t" :baldes="baldes" />
                <BlocoStatus v-else-if="item.id === 'status'" :t="t" :linhas="linhasDeStatus" @abrir="abrirStatus" />
                <TabelaResponsaveis v-else-if="item.id === 'responsaveis'" v-model:modo="modoResponsavel" :t="t" :linhas="linhasDeResponsavel" @abrir="abrirResponsavel" />
                <TempoTarefa v-else-if="item.id === 'tempoTarefa'" :t="t" :tarefas="temposTarefa" @abrir="abrirTempoDaTarefa" />
                <TempoEtapa v-else-if="item.id === 'tempoEtapa'" :t="t" :etapas="temposEtapa" :so-manual="soManual" />
                <TempoFluxo v-else-if="item.id === 'tempoFluxo'" :t="t" :fluxos="temposFluxo" :so-manual="soManual" />
              </Painel>
            </template>
          </UxGradeDePaineis>
        </div>
      </template>
    </div>

    <GavetaDeTarefas v-model:open="gaveta.aberta" :t="t" :titulo="gaveta.titulo" :tarefas="gaveta.tarefas" />
    <CatalogoDePaineis v-model:open="catalogoAberto" :t="t" :na-tela="naTela" @alternar="alternar" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
          Protótipo · estado
        </span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado === e.valor ? 'primary' : 'neutral'"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="estado = e.valor"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/painel-de-tarefas"
          />
        </span>
      </div>
    </div>
  </CascaDoEnspace>
</template>
