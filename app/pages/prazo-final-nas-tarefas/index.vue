<script setup lang="ts">
/**
 * Prazo final nas Tarefas Rápidas.
 *
 * Cada tarefa rápida ganha uma segunda data: o prazo final. O prazo de hoje
 * continua marcando o atraso. A proposta aparece em 5 lugares, todos daqui:
 * criação, painel da tarefa, tabela, kanban e Spaceflow (andaime "Área").
 * Rodada 5: relatório nativo (ícone na barra), Agenda, pasta Tarefas do item e
 * Painel de tarefas.
 *
 * Só a proposta: sem versão "como é hoje", a pedido da redatora. A casca é a
 * do protótipo tarefas-rapidas, importada de lá.
 *
 * Tudo em memória. Recarregar volta ao começo.
 */
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import CascaDoEnspace from '../tarefas-rapidas/_CascaDoEnspace.vue'
import { textos as textosDaCasca } from '../tarefas-rapidas/textos'
import TabelaDeTarefas from './_TabelaDeTarefas.vue'
import QuadroDeTarefas from './_QuadroDeTarefas.vue'
import PainelDaTarefa from './_PainelDaTarefa.vue'
import ModalNovaTarefa from './_ModalNovaTarefa.vue'
import Spaceflow from './_Spaceflow.vue'
import RelatorioPadrao from './_RelatorioPadrao.vue'
import Agenda from './_Agenda.vue'
import TarefasDoItem from './_TarefasDoItem.vue'
import PainelDeTarefas from './_PainelDeTarefas.vue'
import { itens } from './mocks'
import { textosR5 } from './textos-r5'
import type { TarefaRapida } from './mocks'
import { tarefasIniciais } from './mocks'
import type { CampoDeData, Periodo } from './datas'
import { criadoEm, noPeriodo, prazoFinalVencido } from './datas'
import { textos } from './textos'

definePageMeta({
  titulo: 'Prazo final nas Tarefas Rápidas',
  descricao: 'A tarefa rápida ganha o prazo final ao lado do vencimento: na criação, no painel, na tabela, no kanban, no Spaceflow, no relatório, na Agenda, no item e no Painel de tarefas, com a regra de que o prazo final nunca fica antes do vencimento.',
  status: 'em-revisao',
  atualizado: '2026-11-11',
  tela: 'Tarefas › Rápidas, Painel, Agenda, item e Spaceflow',
})

const t = useTextos(textos)
const r = useTextos(textosR5)
const tc = useTextos(textosDaCasca)
const idioma = useIdioma()
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME. Não é proposta.                                            *
 * ------------------------------------------------------------------ */
type Area = 'tarefas' | 'painel' | 'agenda' | 'item' | 'spaceflow'
const areas: { valor: Area, rotulo: string }[] = [
  { valor: 'tarefas', rotulo: 'Tarefas Rápidas' },
  { valor: 'painel', rotulo: 'Painel de tarefas' },
  { valor: 'agenda', rotulo: 'Agenda' },
  { valor: 'item', rotulo: 'Item' },
  { valor: 'spaceflow', rotulo: 'Spaceflow' },
]
const referenciaDoItem = ref(itens[0]!.referencia)
type Estado = 'normal' | 'carregando' | 'erro' | 'vazio'
const area = ref<Area>('tarefas')
const podeEditar = ref(true)
const estado = ref<Estado>('normal')
const falharAoSalvar = ref(false)
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'normal', rotulo: 'Com tarefas' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'erro', rotulo: 'Erro ao carregar' },
  { valor: 'vazio', rotulo: 'Sem tarefas' },
]

/* ------------------------------------------------------------------ *
 * Tela                                                                *
 * ------------------------------------------------------------------ */
const tarefas = ref<TarefaRapida[]>(tarefasIniciais())
const visao = ref<'tabela' | 'kanban'>('tabela')
const busca = ref('')
const campoDeData = ref<CampoDeData>('criado')
const periodo = ref<Periodo>('todos')
const recarregando = ref(false)

const opcoesDeCampo = computed(() => (['criado', 'prazo', 'prazoFinal'] as const).map(c => ({ label: t.value.campoDeData[c], value: c })))
const opcoesDePeriodo = computed(() => (['todos', 'hoje', 'semana', 'mes'] as const).map(p => ({ label: t.value.periodos[p], value: p })))

const base = computed(() => estado.value === 'vazio' ? [] : tarefas.value)
/** RF007: o mesmo filtro vale para a tabela e para o kanban. */
/* RF020 (proposta): atalho para as tarefas com prazo final vencido. */
const soVencidos = ref(false)
const totalVencidos = computed(() => base.value.filter(prazoFinalVencido).length)
const filtradas = computed(() => base.value.filter((tr) => {
  if (soVencidos.value && !prazoFinalVencido(tr)) return false
  if (busca.value && !tr.name.toLowerCase().includes(busca.value.toLowerCase())) return false
  const data = campoDeData.value === 'criado' ? criadoEm(tr) : campoDeData.value === 'prazo' ? tr.due_date : tr.final_due_date
  return noPeriodo(data, periodo.value)
}))

const filtroLigado = computed(() => periodo.value !== 'todos')
function limparFiltros() {
  busca.value = ''
  soVencidos.value = false
  periodo.value = 'todos'
}

function tentarDeNovo() {
  recarregando.value = true
  setTimeout(() => {
    recarregando.value = false
    estado.value = 'normal'
  }, 700)
}

/* Painel e criação */
const idAberto = ref<number | null>(null)
const painelAberto = ref(false)
const tarefaAberta = computed(() => tarefas.value.find(x => x.id === idAberto.value) ?? null)
function abrir(tr: TarefaRapida) {
  idAberto.value = tr.id
  painelAberto.value = true
}
function gravar(id: number, campo: 'due_date' | 'final_due_date', valor: string | null) {
  tarefas.value = tarefas.value.map(x => x.id === id ? { ...x, [campo]: valor } : x)
}

const criacaoAberta = ref(false)
function criar(tr: TarefaRapida) {
  tarefas.value = [tr, ...tarefas.value]
  if (estado.value === 'vazio') estado.value = 'normal'
  toast.add({ title: t.value.tarefaCriada(tr.name), color: 'success', icon: 'i-lucide-check' })
}

function reiniciar() {
  tarefas.value = tarefasIniciais()
  limparFiltros()
  campoDeData.value = 'criado'
  estado.value = 'normal'
  podeEditar.value = true
  falharAoSalvar.value = false
  painelAberto.value = false
}
</script>

<template>
  <div class="min-h-dvh bg-default pb-28">
    <CascaDoEnspace v-if="area === 'tarefas'" :t="tc" :workspace="tc.workspace" slug="produtos">
      <div class="space-y-3 p-4">
        <!-- Barra: visualização, busca, filtro de data e Nova tarefa -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex rounded-lg bg-elevated p-0.5" role="group">
            <UButton
              v-for="v in (['tabela', 'kanban'] as const)"
              :key="v"
              :label="t.visoes[v]"
              :icon="v === 'tabela' ? 'i-lucide-table' : 'i-lucide-kanban'"
              size="sm"
              :color="visao === v ? 'primary' : 'neutral'"
              :variant="visao === v ? 'solid' : 'ghost'"
              :aria-pressed="visao === v"
              @click="visao = v"
            />
          </div>
          <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.buscar" class="w-56" :aria-label="t.buscar" />
          <USelect v-model="campoDeData" :items="opcoesDeCampo" icon="i-lucide-calendar" class="w-40" :aria-label="t.campoDoFiltro" />
          <USelect v-model="periodo" :items="opcoesDePeriodo" class="w-40" :aria-label="t.periodoDoFiltro" />
          <UButton
            v-if="totalVencidos"
            :label="t.filtroVencidos(totalVencidos)"
            icon="i-lucide-flag"
            size="sm"
            color="error"
            :variant="soVencidos ? 'solid' : 'outline'"
            :aria-pressed="soVencidos"
            class="transition-transform hover:-translate-y-0.5"
            @click="soVencidos = !soVencidos"
          />
          <span class="text-xs text-muted">{{ t.contagem(filtradas.length) }}</span>
          <div class="ml-auto"><RelatorioPadrao :t="t" :r="r" :idioma="idioma" :tarefas="filtradas" /></div>
          <UButton :label="t.novaTarefa" icon="i-lucide-plus" @click="criacaoAberta = true" />
        </div>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0"
        >
          <div v-if="filtroLigado" class="flex">
            <UBadge color="primary" variant="subtle" class="gap-1 pr-1">
              {{ t.chipPeriodo(t.campoDeData[campoDeData], t.periodos[periodo]) }}
              <UButton
                icon="i-lucide-x"
                color="primary"
                variant="link"
                size="xs"
                class="p-0.5"
                :aria-label="t.tirarFiltro(t.chipPeriodo(t.campoDeData[campoDeData], t.periodos[periodo]))"
                @click="periodo = 'todos'"
              />
            </UBadge>
          </div>
        </Transition>

        <!-- Estados -->
        <div v-if="estado === 'carregando'" class="space-y-2" aria-busy="true">
          <USkeleton v-for="i in 6" :key="i" class="h-11 w-full" />
        </div>
        <UAlert
          v-else-if="estado === 'erro'"
          icon="i-lucide-circle-alert"
          color="error"
          variant="subtle"
          :title="t.carregarErro"
          :actions="[{ label: t.tentarDeNovo, color: 'neutral', variant: 'outline', loading: recarregando, onClick: tentarDeNovo }]"
        />
        <UEmpty
          v-else-if="!base.length"
          icon="i-lucide-clipboard-list"
          :title="t.vazioTitulo"
          :description="t.vazioDescricao"
          :actions="[{ label: t.novaTarefa, icon: 'i-lucide-plus', onClick: () => { criacaoAberta = true } }]"
          class="mt-12"
        />
        <UEmpty
          v-else-if="!filtradas.length"
          icon="i-lucide-filter-x"
          :title="t.filtroVazioTitulo"
          :description="t.filtroVazioDescricao"
          :actions="[{ label: t.limparFiltros, color: 'neutral', variant: 'outline', onClick: limparFiltros }]"
          class="mt-12"
        />

        <Transition
          v-else
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0"
        >
          <TabelaDeTarefas v-if="visao === 'tabela'" key="tabela" :t="t" :idioma="idioma" :tarefas="filtradas" :carregando="false" @abrir="abrir" />
          <QuadroDeTarefas v-else key="kanban" :t="t" :idioma="idioma" :tarefas="filtradas" @abrir="abrir" />
        </Transition>
      </div>
    </CascaDoEnspace>

    <PainelDeTarefas v-else-if="area === 'painel'" :t="t" :r="r" :idioma="idioma" :tarefas="tarefas" @abrir="abrir" />
    <Agenda v-else-if="area === 'agenda'" :t="t" :r="r" :idioma="idioma" :tarefas="tarefas" @abrir="abrir" />
    <TarefasDoItem v-else-if="area === 'item'" :key="referenciaDoItem" :t="t" :r="r" :idioma="idioma" :tarefas="tarefas" :referencia="referenciaDoItem" @abrir="abrir" />
    <Spaceflow v-else :t="t" :idioma="idioma" />

    <PainelDaTarefa
      v-model:open="painelAberto"
      :t="t"
      :idioma="idioma"
      :tarefa="tarefaAberta"
      :pode-editar="podeEditar"
      :falhar-ao-salvar="falharAoSalvar"
      @gravar="gravar"
    />
    <ModalNovaTarefa v-model:open="criacaoAberta" :t="t" :idioma="idioma" @criar="criar" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Protótipo · área</span>
        <UButton
          v-for="a in areas"
          :key="a.valor"
          :label="a.rotulo"
          size="xs"
          :color="area === a.valor ? 'primary' : 'neutral'"
          :variant="area === a.valor ? 'solid' : 'subtle'"
          @click="area = a.valor"
        />
        <template v-if="area === 'item'">
          <USeparator orientation="vertical" class="mx-1 h-5" />
          <UButton
            v-for="i in itens"
            :key="i.referencia"
            :label="i.referencia"
            size="xs"
            :color="referenciaDoItem === i.referencia ? 'primary' : 'neutral'"
            :variant="referenciaDoItem === i.referencia ? 'solid' : 'subtle'"
            @click="referenciaDoItem = i.referencia"
          />
        </template>
        <template v-if="area === 'tarefas'">
          <USeparator orientation="vertical" class="mx-1 h-5" />
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Papel</span>
          <UButton label="Altera as datas" size="xs" :color="podeEditar ? 'primary' : 'neutral'" :variant="podeEditar ? 'solid' : 'subtle'" @click="podeEditar = true" />
          <UButton label="Só vê as datas" size="xs" :color="!podeEditar ? 'primary' : 'neutral'" :variant="!podeEditar ? 'solid' : 'subtle'" @click="podeEditar = false" />
          <USeparator orientation="vertical" class="mx-1 h-5" />
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Estado</span>
          <UButton
            v-for="e in estados"
            :key="e.valor"
            :label="e.rotulo"
            size="xs"
            :color="estado === e.valor ? 'primary' : 'neutral'"
            :variant="estado === e.valor ? 'solid' : 'subtle'"
            @click="estado = e.valor"
          />
          <UCheckbox v-model="falharAoSalvar" label="Salvar falha" class="ml-1" />
        </template>
        <USeparator orientation="vertical" class="mx-1 h-5" />
        <span class="text-xs text-muted">Hoje no protótipo: 22/11/2026</span>
        <UButton label="Reiniciar" icon="i-lucide-rotate-ccw" size="xs" color="neutral" variant="ghost" @click="reiniciar" />
        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/prazo-final-nas-tarefas"
          />
        </span>
      </div>
    </div>
  </div>
</template>
