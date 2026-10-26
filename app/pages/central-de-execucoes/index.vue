<script setup lang="ts">
/**
 * Central de execuções do Spaceflow: acompanhar todos os fluxos de uma operação numa tela.
 *
 * A demanda: os membros não veem números das execuções (quantas falharam, quantas estão rodando)
 * e não conseguem acompanhar uma operação de 38 fluxos encadeados, nem responder "o contrato X
 * está rodando por quais fluxos?".
 *
 * A jornada: menu do membro › Spaceflows. Hoje a tela tem só os cartões; cada fluxo tem a própria
 * lista de execuções. A proposta acrescenta, na mesma tela, as abas Visão geral, Execuções (a
 * lista global, com a busca por item) e Mapa da operação; no detalhe da execução, a faixa e a aba
 * Cadeia; no item, a aba Fluxos.
 *
 * Tudo em memória. Recarregar volta ao começo.
 */
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import type { OperacaoId } from './mocks'
import { categorias, exemplos, workspace } from './mocks'
import type { Cenario, Fase, FiltroDaLista, Periodo } from './consultas'
import { dadosDoCenario, execPorId, filtroVazio, fluxoPorId, itemPorId, operacaoDaCategoria, problemas } from './consultas'
import type { EstadoDoProblema } from './textos'
import { textos } from './textos'
import CascaDoSpaceflow from './_CascaDoSpaceflow.vue'
import CartoesDeFluxos from './_CartoesDeFluxos.vue'
import VisaoGeral from './_VisaoGeral.vue'
import ListaDeExecucoes from './_ListaDeExecucoes.vue'
import MapaDaOperacao from './_MapaDaOperacao.vue'
import TelaDoFluxo from './_TelaDoFluxo.vue'
import DetalheDaExecucao from './_DetalheDaExecucao.vue'
import TelaDoItem from './_TelaDoItem.vue'

definePageMeta({
  titulo: 'Central de execuções do Spaceflow',
  descricao: 'Uma visão de todos os fluxos juntos: números, o que precisa de atenção, a lista global, a busca por item, a cadeia de cada execução, a aba Fluxos no item e o mapa da operação.',
  status: 'em-revisao',
  atualizado: '2026-10-24',
  tela: 'Spaceflows › Visão geral, Execuções e Mapa',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME: versão, backend e cenário. Não é proposta.                 *
 * ------------------------------------------------------------------ */
type Versao = 'hoje' | 'proposta'
const versao = ref<Versao>('proposta')
const fase = ref<Fase>(2)
const cenario = ref<Cenario>('operacao')

const versoes: { valor: Versao, rotulo: string }[] = [
  { valor: 'hoje', rotulo: 'Como é hoje' },
  { valor: 'proposta', rotulo: 'Proposta' },
]
const fases: { valor: Fase, rotulo: string }[] = [
  { valor: 2, rotulo: 'Com a cadeia (fase 2)' },
  { valor: 1, rotulo: 'Só o que existe (fase 1)' },
]
const cenarios: { value: Cenario, label: string }[] = [
  { value: 'operacao', label: 'Operação com falhas' },
  { value: 'emDia', label: 'Tudo em dia' },
  { value: 'parcial', label: 'Acesso parcial' },
  { value: 'vazio', label: 'Sem execuções' },
  { value: 'carregando', label: 'Carregando' },
  { value: 'erro', label: 'Erro ao carregar' },
]
const hoje = computed(() => versao.value === 'hoje')

/* ------------------------------------------------------------------ *
 * Dados e navegação                                                   *
 * ------------------------------------------------------------------ */
const dados = computed(() => dadosDoCenario(cenario.value))
const carregando = computed(() => cenario.value === 'carregando')

type Aba = 'fluxos' | 'visao' | 'execucoes' | 'mapa'
type Tela =
  | { tipo: 'spaceflows' }
  | { tipo: 'fluxo', id: number }
  | { tipo: 'execucao', id: number }
  | { tipo: 'item', id: number }

const tela = ref<Tela>({ tipo: 'spaceflows' })
const historico = ref<Tela[]>([])
const aba = ref<Aba>('visao')
const abaDaExecucao = ref<'fluxo' | 'cadeia' | 'detalhes' | 'comentarios' | 'logs'>('fluxo')

const filtro = ref<FiltroDaLista>(filtroVazio())
const periodo = ref<Periodo>('d7')
const estados = ref<Record<number, EstadoDoProblema>>({})
const operacaoDoMapa = ref<OperacaoId>('contratos')
const itemDoMapa = ref<number | undefined>()

function ir(nova: Tela) {
  historico.value = [...historico.value, tela.value]
  tela.value = nova
}
function voltar() {
  tela.value = historico.value.at(-1) ?? { tipo: 'spaceflows' }
  historico.value = historico.value.slice(0, -1)
}
function irParaSpaceflows(a?: Aba) {
  ir({ tipo: 'spaceflows' })
  if (a) aba.value = a
}

const abrirExecucao = (id: number) => { abaDaExecucao.value = 'fluxo'; ir({ tipo: 'execucao', id }) }
const abrirItem = (id: number) => ir({ tipo: 'item', id })
const abrirFluxo = (id: number) => ir({ tipo: 'fluxo', id })
function filtrar(f: FiltroDaLista) {
  filtro.value = f
  irParaSpaceflows('execucoes')
}
function verMapa(op: OperacaoId) {
  operacaoDoMapa.value = op
  itemDoMapa.value = undefined
  irParaSpaceflows('mapa')
}
function verJornada(itemId: number | undefined) {
  if (itemId) {
    const i = itemPorId.get(itemId)
    if (i) operacaoDoMapa.value = operacaoDaCategoria(i.categoria).id
  }
  itemDoMapa.value = itemId
  irParaSpaceflows('mapa')
}
function executar(id: number) {
  toast.add({ title: t.value.fluxos.executar, description: `${fluxoPorId.get(id)?.name}. ${t.value.detalhe.foraDoEscopo}`, icon: 'i-lucide-construction', color: 'neutral' })
}

/* A versão de hoje não tem as abas novas: volta para os cartões. */
watch(hoje, (h) => {
  if (h) {
    aba.value = 'fluxos'
    if (tela.value.tipo === 'item') tela.value = { tipo: 'spaceflows' }
  }
  else if (aba.value === 'fluxos' && tela.value.tipo === 'spaceflows') aba.value = 'visao'
})

const execucaoAberta = computed(() => (tela.value.tipo === 'execucao' ? execPorId.get(tela.value.id) : undefined))
const itemAberto = computed(() => (tela.value.tipo === 'item' ? itemPorId.get(tela.value.id) : undefined))
const fluxoAberto = computed(() => (tela.value.tipo === 'fluxo' ? fluxoPorId.get(tela.value.id) : undefined))

const ativoNoMenu = computed(() => (itemAberto.value ? itemAberto.value.categoria : 'spaceflows'))
const trilha = computed(() => {
  const base = [workspace.nome]
  if (itemAberto.value) return [...base, t.value.trilha.categorias, categorias[itemAberto.value.categoria].nome, itemAberto.value.reference ?? '']
  if (execucaoAberta.value) return [...base, t.value.trilha.spaceflows, String(execucaoAberta.value.workflow), t.value.trilha.executions, String(execucaoAberta.value.id)]
  if (fluxoAberto.value) return [...base, t.value.trilha.spaceflows, String(fluxoAberto.value.id)]
  return [...base, t.value.trilha.spaceflows]
})

const problemasAbertos = computed(() => problemas(dados.value.execucoes, periodo.value).filter(p => (estados.value[p.fluxo.id] ?? 'revisar') === 'revisar').length)
const abas = computed(() => [
  { value: 'visao', label: t.value.abas.visao, icon: 'i-lucide-layout-dashboard', badge: problemasAbertos.value && !carregando.value ? { label: String(problemasAbertos.value), color: 'error' as const, variant: 'subtle' as const } : undefined },
  { value: 'execucoes', label: t.value.abas.execucoes, icon: 'i-lucide-list' },
  { value: 'mapa', label: t.value.abas.mapa, icon: 'i-lucide-map' },
  { value: 'fluxos', label: t.value.abas.fluxos, icon: 'i-lucide-workflow' },
])

/* ---------- erro ao carregar ---------- */
const tentando = ref(false)
async function tentarDeNovo() {
  tentando.value = true
  await new Promise(r => setTimeout(r, 800))
  tentando.value = false
  cenario.value = 'operacao'
}

/* ---------- a barra de andaime não cobre a tela ---------- */
const andaime = ref<HTMLElement | null>(null)
let observador: ResizeObserver | undefined
onMounted(() => {
  const medir = () => document.documentElement.style.setProperty('--altura-do-andaime', `${andaime.value?.offsetHeight ?? 0}px`)
  medir()
  observador = new ResizeObserver(medir)
  if (andaime.value) observador.observe(andaime.value)
})
onBeforeUnmount(() => {
  observador?.disconnect()
  document.documentElement.style.removeProperty('--altura-do-andaime')
})

function reiniciar() {
  versao.value = 'proposta'
  fase.value = 2
  cenario.value = 'operacao'
  tela.value = { tipo: 'spaceflows' }
  historico.value = []
  aba.value = 'visao'
  filtro.value = filtroVazio()
  periodo.value = 'd7'
  estados.value = {}
  operacaoDoMapa.value = 'contratos'
  itemDoMapa.value = undefined
}

const exemplosDoAndaime = [
  { rotulo: 'Contrato com falha', item: exemplos.falha },
  { rotulo: 'Contrato com repetição', item: exemplos.repeticao },
  { rotulo: 'Contrato esperando pessoa', item: exemplos.espera },
]
</script>

<template>
  <div>
    <CascaDoSpaceflow
      :t="t"
      :ativo="ativoNoMenu"
      :trilha="trilha"
      @spaceflows="irParaSpaceflows()"
      @categoria="() => toast.add({ title: t.detalhe.foraDoEscopo, icon: 'i-lucide-construction', color: 'neutral' })"
    >
      <div class="flex min-h-0 flex-1 flex-col pb-(--altura-do-andaime)">
        <Transition mode="out-in" enter-active-class="transition-[opacity,transform] duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
          <!-- Execução -->
          <DetalheDaExecucao
            v-if="execucaoAberta"
            :key="`execucao-${execucaoAberta.id}`"
            v-model:aba="abaDaExecucao"
            :t="t"
            :e="execucaoAberta"
            :dados="dados"
            :fase="fase"
            :hoje="hoje"
            @voltar="voltar"
            @abrir-execucao="abrirExecucao"
            @abrir-item="abrirItem"
            @ver-mapa="verJornada"
          />

          <!-- Item -->
          <TelaDoItem
            v-else-if="itemAberto"
            :key="`item-${itemAberto.id}`"
            :t="t"
            :item="itemAberto"
            :dados="dados"
            :fase="fase"
            :hoje="hoje"
            @abrir-execucao="abrirExecucao"
            @abrir-item="abrirItem"
            @ver-jornada="verJornada"
          />

          <!-- Um fluxo -->
          <TelaDoFluxo
            v-else-if="fluxoAberto"
            :key="`fluxo-${fluxoAberto.id}`"
            :t="t"
            :fluxo="fluxoAberto"
            :dados="dados"
            :fase="fase"
            :hoje="hoje"
            @voltar="voltar"
            @abrir-execucao="abrirExecucao"
            @abrir-item="abrirItem"
          />

          <!-- Spaceflows -->
          <div v-else key="spaceflows" class="flex min-h-0 flex-1 flex-col">
            <!-- PROPOSTA: as abas da central -->
            <UTabs v-if="!hoje" v-model="aba" :items="abas" :content="false" variant="link" class="border-b border-default px-4" />

            <UAlert
              v-if="cenario === 'parcial' && !hoje"
              class="mx-4 mt-3 w-auto"
              :title="t.estados.parcial(dados.fluxos.length, dados.totalDeFluxos)"
              icon="i-lucide-lock"
              color="neutral"
              variant="subtle"
            />

            <div v-if="cenario === 'erro'" class="flex flex-1 items-center justify-center p-8">
              <UEmpty
                icon="i-lucide-cloud-off"
                :title="t.estados.erroTitulo"
                :description="t.estados.erroDesc"
                :actions="[{ label: t.estados.tentar, icon: 'i-lucide-refresh-cw', loading: tentando, onClick: tentarDeNovo }]"
                variant="naked"
              />
            </div>
            <CartoesDeFluxos
              v-else-if="hoje || aba === 'fluxos'"
              :t="t"
              :dados="dados"
              :hoje="hoje"
              :carregando="carregando"
              @abrir="abrirFluxo"
              @executar="executar"
            />
            <div v-else-if="cenario === 'vazio' && aba !== 'mapa'" class="flex flex-1 items-center justify-center p-8">
              <UEmpty icon="i-lucide-circle-play" :title="t.estados.vazioTitulo" :description="t.estados.vazioDesc" variant="naked" />
            </div>
            <VisaoGeral
              v-else-if="aba === 'visao'"
              v-model:periodo="periodo"
              v-model:estados="estados"
              :t="t"
              :dados="dados"
              :fase="fase"
              :carregando="carregando"
              @filtrar="filtrar"
              @abrir-execucao="abrirExecucao"
              @abrir-item="abrirItem"
              @ver-mapa="verMapa"
            />
            <ListaDeExecucoes
              v-else-if="aba === 'execucoes'"
              v-model:filtro="filtro"
              :t="t"
              :dados="dados"
              :fase="fase"
              :carregando="carregando"
              @abrir-execucao="abrirExecucao"
              @abrir-item="abrirItem"
              @ver-jornada="verJornada"
            />
            <MapaDaOperacao
              v-else-if="aba === 'mapa'"
              v-model:operacao="operacaoDoMapa"
              v-model:item="itemDoMapa"
              :t="t"
              :dados="dados"
              :fase="fase"
              :periodo="periodo"
              @filtrar="filtrar"
              @abrir-execucao="abrirExecucao"
              @abrir-item="abrirItem"
            />
          </div>
        </Transition>
      </div>
    </CascaDoSpaceflow>

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div ref="andaime" class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Protótipo · versão</span>
        <UButton
          v-for="v in versoes"
          :key="v.valor"
          :label="v.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="versao === v.valor ? 'primary' : 'neutral'"
          :variant="versao === v.valor ? 'solid' : 'subtle'"
          @click="versao = v.valor"
        />
        <template v-if="!hoje">
          <USeparator orientation="vertical" class="mx-1 h-5" />
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Backend</span>
          <UButton
            v-for="f in fases"
            :key="f.valor"
            :label="f.rotulo"
            size="xs"
            class="transition-transform hover:-translate-y-0.5"
            :color="fase === f.valor ? 'primary' : 'neutral'"
            :variant="fase === f.valor ? 'solid' : 'subtle'"
            @click="fase = f.valor"
          />
        </template>
        <USeparator orientation="vertical" class="mx-1 h-5" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Cenário</span>
        <USelect v-model="cenario" :items="cenarios" size="xs" class="w-44" aria-label="Cenário" />
        <template v-if="!hoje">
          <USeparator orientation="vertical" class="mx-1 h-5" />
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Exemplos</span>
          <UButton
            v-for="x in exemplosDoAndaime"
            :key="x.item.id"
            :label="x.rotulo"
            size="xs"
            color="neutral"
            variant="subtle"
            class="transition-transform hover:-translate-y-0.5"
            @click="abrirItem(x.item.id)"
          />
        </template>
        <UButton label="Reiniciar" icon="i-lucide-rotate-ccw" size="xs" color="neutral" variant="ghost" @click="reiniciar" />
        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/central-de-execucoes"
          />
        </span>
      </div>
    </div>
  </div>
</template>
