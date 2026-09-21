<script setup lang="ts">
/**
 * Tarefas Rápidas: o quadro.
 *
 * A proposta mexe em quatro lugares, que são os quatro pedidos da demanda:
 * cabeçalho, cartão (fechado e aberto), raia e o totalizador no pé da raia.
 * O dado é o `mocks.ts` desta pasta, tipado pelo schema real. Nada de rede.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import type { EnKanbanCardConfig, EnKanbanColumn } from '@be-enlighten/enspace-sdk-ui/base'
import BarraDoQuadro, { type Filtros } from './_BarraDoQuadro.vue'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import ModalNovaTarefa from './_ModalNovaTarefa.vue'
import PainelDaTarefa from './_PainelDaTarefa.vue'
import RaiaDoQuadro from './_RaiaDoQuadro.vue'
import { hoje, itensRelacionados, tarefas as tarefasMock, usuarioAtual } from './mocks'
import type { OrdemDaRaia } from './_RaiaDoQuadro.vue'
import {
  type Calculo, type ChaveAgrupamento, type ChaveOrdenacao,
  calculoPadrao, camposCalculaveis, compararTarefas, diasAteOPrazo, estaAtrasada,
  raiaDaTarefa, raiasDoAgrupamento,
} from './quadro'
import { textos } from './textos'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Tarefas rápidas',
  descricao: 'Agrupar, ordenar e somar no próprio quadro, com o cartão dizendo o que a pessoa precisa para decidir.',
  status: 'em-revisao',
  atualizado: '2026-09-21',
  tela: 'Quadro de tarefas rápidas',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME: o seletor de estados não faz parte da proposta. Existe     *
 * para percorrer os cinco estados e comparar com a tela de hoje.      *
 * ------------------------------------------------------------------ */
type Estado = 'cheio' | 'vazio' | 'carregando' | 'erro' | 'leitura' | 'hoje'
const estado = ref<Estado>('cheio')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'cheio', rotulo: 'Quadro cheio' },
  { valor: 'vazio', rotulo: 'Sem tarefas' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'erro', rotulo: 'Erro' },
  { valor: 'leitura', rotulo: 'Sem permissão' },
  { valor: 'hoje', rotulo: 'Como é hoje' },
]

const somenteLeitura = computed(() => estado.value === 'leitura')
const carregando = computed(() => estado.value === 'carregando')

/* ----------------------------- estado da tela ----------------------------- */
const lista = ref<Task[]>([...tarefasMock])
const busca = ref('')
const agrupamento = ref<ChaveAgrupamento>('status')
const ordenacao = ref<ChaveOrdenacao>('due_date')
const ordenacaoDesc = ref(false)
const densidade = ref<'compacto' | 'padrao' | 'completo'>('padrao')
const periodo = ref('tudo')
const campoDeData = ref<'created_at' | 'due_date'>('created_at')
const ocultarVazias = ref(false)
const raiasOcultas = ref<string[]>([])
const raiasRecolhidas = ref<string[]>([])
const limites = ref<Record<string, number | null>>({})
const visualizacao = ref('todas')

const campos = ref<Record<string, boolean>>({
  referencia: true,
  tipo: true,
  descricao: true,
  prioridade: true,
  prazo: true,
  pontos: true,
  etiquetas: true,
  responsavel: true,
  item: true,
  colaboradores: true,
})

const filtros = ref<Filtros>({
  status: [],
  prioridade: [],
  responsavel: [],
  tipo: [],
  somenteMinhas: false,
  somenteAtrasadas: false,
  semResponsavel: false,
})

/** Cada raia guarda o próprio cálculo. Soma de pontos é o padrão. */
const calculoPorRaia = ref<Record<string, Calculo>>({})
function calculoDaRaia(valor: string): Calculo {
  return calculoPorRaia.value[valor] ?? calculoPadrao
}

/**
 * E a própria ordem. O `EnKanbanBoard` já aceita ordem por coluna
 * (`sortByField` e `sortDesc`); o que faltava era a tela deixar escolher.
 */
const ordenacaoPorRaia = ref<Record<string, OrdemDaRaia | null>>({})

/** O que o totalizador pode somar, descoberto do dado que está carregado. */
const camposDoTotalizador = computed(() => camposCalculaveis(lista.value, t.value))

/* --------------------------- filtro e agrupamento --------------------------- */

const base = computed<Task[]>(() => estado.value === 'vazio' ? [] : lista.value)

const filtradas = computed<Task[]>(() => {
  const termo = busca.value.trim().toLowerCase()
  const f = filtros.value
  return base.value.filter((tarefa) => {
    if (tarefa.archived) return false

    if (termo) {
      const item = tarefa.item ? itensRelacionados[tarefa.item] : null
      const alvo = [tarefa.name, tarefa.reference, item?.codigo, item?.titulo]
        .filter(Boolean).join(' ').toLowerCase()
      if (!alvo.includes(termo)) return false
    }

    if (f.status.length && !f.status.includes(tarefa.status)) return false
    if (f.prioridade.length && !f.prioridade.includes(tarefa.priority)) return false
    if (f.tipo.length && !f.tipo.includes(tarefa.type)) return false
    if (f.responsavel.length && !f.responsavel.includes(tarefa.assigned_to ?? -1)) return false
    if (f.somenteMinhas && tarefa.assigned_to !== usuarioAtual.id) return false
    if (f.somenteAtrasadas && !estaAtrasada(tarefa)) return false
    if (f.semResponsavel && tarefa.assigned_to) return false

    if (periodo.value !== 'tudo') {
      const data = campoDeData.value === 'created_at' ? tarefa.created_at : tarefa.due_date
      if (!data) return false
      const dias = Math.round(
        (Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate())
          - Date.UTC(new Date(data).getUTCFullYear(), new Date(data).getUTCMonth(), new Date(data).getUTCDate()))
        / 86_400_000)
      const limite = periodo.value === 'hoje' ? 0 : Number(periodo.value)
      if (campoDeData.value === 'created_at' && (dias < 0 || dias > limite)) return false
      if (campoDeData.value === 'due_date') {
        const ate = diasAteOPrazo(tarefa)
        if (ate === null || ate < 0 || ate > limite) return false
      }
    }

    return true
  })
})

const definicoesDeRaia = computed(() => raiasDoAgrupamento(agrupamento.value, t.value))

interface RaiaMontada {
  definicao: ReturnType<typeof raiasDoAgrupamento>[number]
  tarefas: Task[]
}

const raias = computed<RaiaMontada[]>(() =>
  definicoesDeRaia.value.map((definicao) => {
    // A raia com ordem própria manda; sem ela, vale a ordem do quadro.
    const propria = ordenacaoPorRaia.value[definicao.valor]
    const chave = propria?.chave ?? ordenacao.value
    const desc = propria ? propria.desc : ordenacaoDesc.value
    return {
      definicao,
      tarefas: filtradas.value
        .filter(tarefa => raiaDaTarefa(tarefa, agrupamento.value) === definicao.valor)
        .sort((a, b) => compararTarefas(a, b, chave, desc)),
    }
  }))

const raiasVisiveis = computed(() => raias.value.filter((r) => {
  if (raiasOcultas.value.includes(r.definicao.valor)) return false
  if (ocultarVazias.value && !r.tarefas.length) return false
  return true
}))

const totalVisivel = computed(() => raiasVisiveis.value.reduce((s, r) => s + r.tarefas.length, 0))

/* ------------------------------- interação ------------------------------- */

const tarefaAberta = ref<Task | null>(null)
/**
 * Trilho de campos da quickview expandido. Mora aqui porque, na melhoria, é ele
 * que muda a largura do painel: hoje expandir rouba espaço do conteúdo.
 */
const painelExpandido = ref(false)
const painelAberto = computed({
  get: () => !!tarefaAberta.value,
  set: (v: boolean) => { if (!v) tarefaAberta.value = null },
})

function abrir(tarefa: Task) {
  tarefaAberta.value = tarefa
}

/** Mover só faz sentido quando a raia é a situação. Nos outros agrupamentos o
 *  arraste muda o campo do agrupamento, e isso fica declarado no DECISOES. */
function mover(tarefa: Task, destino: string) {
  if (somenteLeitura.value) return
  const alvo = lista.value.find(x => x.id === tarefa.id)
  if (!alvo) return

  if (agrupamento.value === 'status') alvo.status = destino as Task['status']
  else if (agrupamento.value === 'priority') alvo.priority = destino as Task['priority']
  else if (agrupamento.value === 'assigned_to') alvo.assigned_to = destino === 'sem' ? null : Number(destino)
  else return

  const rotulo = definicoesDeRaia.value.find(d => d.valor === destino)?.rotulo ?? ''
  toast.add({
    title: t.value.tarefaMovida(alvo.name.slice(0, 40), rotulo),
    icon: 'i-lucide-check',
    color: 'success',
  })
}

function soltarNaRaia(valorDaRaia: string, idDaTarefa: number) {
  const tarefa = lista.value.find(x => x.id === idDaTarefa)
  if (tarefa) mover(tarefa, valorDaRaia)
}

function concluir(respostas: Record<string, unknown>) {
  const alvo = tarefaAberta.value && lista.value.find(x => x.id === tarefaAberta.value!.id)
  if (!alvo) return
  alvo.status = 'completed'
  alvo.completed_at = new Date()
  alvo.completed_by = usuarioAtual.id
  const meta = (alvo.meta ?? {}) as Record<string, unknown>
  alvo.meta = { ...meta, form_result: respostas }
  toast.add({ title: t.value.tarefaConcluidaToast, icon: 'i-lucide-check', color: 'success' })
  tarefaAberta.value = null
}

function reabrir() {
  const alvo = tarefaAberta.value && lista.value.find(x => x.id === tarefaAberta.value!.id)
  if (!alvo) return
  alvo.status = 'pending'
  alvo.completed_at = null
  alvo.completed_by = null
}

/** Maquete: mostra o toast sem escrever na área de transferência. */
function copiarReferencia() {
  toast.add({ title: t.value.referenciaCopiada, icon: 'i-lucide-copy', color: 'neutral' })
}

function arquivar(tarefa: Task) {
  const alvo = lista.value.find(x => x.id === tarefa.id)
  if (alvo) alvo.archived = true
}

function limparFiltros() {
  busca.value = ''
  periodo.value = 'tudo'
  filtros.value = {
    status: [], prioridade: [], responsavel: [], tipo: [],
    somenteMinhas: false, somenteAtrasadas: false, semResponsavel: false,
  }
}

function alternarRecolhida(valor: string) {
  raiasRecolhidas.value = raiasRecolhidas.value.includes(valor)
    ? raiasRecolhidas.value.filter(x => x !== valor)
    : [...raiasRecolhidas.value, valor]
}

/* ------------------------------ nova tarefa ------------------------------ */
const criando = ref(false)
const raiaDaCriacao = ref<string>('pending')

/** O nome da raia onde a tarefa vai nascer, para o rodapé do formulário dizer. */
const nomeDaRaiaDaCriacao = computed(() =>
  definicoesDeRaia.value.find(d => d.valor === raiaDaCriacao.value)?.rotulo
  ?? t.value.status.pending)

function abrirCriacao(valorDaRaia?: string) {
  if (somenteLeitura.value) return
  raiaDaCriacao.value = valorDaRaia ?? 'pending'
  criando.value = true
}

/** Os cinco campos são os do formulário do produto. Nada a mais. */
function criar(dados: {
  name: string
  due_date: Date | null
  description: string | null
  assigned_to: number | null
  priority: Task['priority']
}) {
  const id = Math.max(...lista.value.map(x => x.id)) + 1
  lista.value.unshift({
    ...tarefasMock[4]!,
    id,
    reference: `NOV${id}${'x'.repeat(26)}`.slice(0, 32),
    name: dados.name,
    description: dados.description,
    type: 'generic',
    status: agrupamento.value === 'status' ? (raiaDaCriacao.value as Task['status']) : 'pending',
    priority: dados.priority,
    points: 0,
    due_date: dados.due_date,
    item: null,
    meta: {},
    tag_ids: [],
    collaborators: null,
    created_at: new Date(),
    updated_at: new Date(),
    creator: usuarioAtual.id,
    assigned_to: dados.assigned_to,
  })
  criando.value = false
  toast.add({ title: t.value.tarefaSalva, icon: 'i-lucide-check', color: 'success' })
}

/** Edição vinda da quickview: mexe no mock em memória. */
function atualizarCampo(campo: keyof Task, valor: unknown) {
  const alvo = tarefaAberta.value && lista.value.find(x => x.id === tarefaAberta.value!.id)
  if (!alvo) return
  // @ts-expect-error atribuição dinâmica sobre o mock em memória
  alvo[campo] = valor
  alvo.updated_at = new Date()
}

/**
 * Andaime: leva direto ao cartão que tem todos os campos preenchidos, que é o
 * caso de borda pedido na demanda. Não faz parte da proposta.
 */
function mostrarCartaoCompleto() {
  estado.value = 'cheio'
  densidade.value = 'completo'
  limparFiltros()
  const completa = lista.value.find(x => x.id === 22078)
  if (completa) tarefaAberta.value = completa
}

/* ------------------------------------------------------------------ *
 * "Como é hoje": o mesmo dado no EnKanbanBoard do SDK, com o cartão   *
 * configurado como o quadro de develop configura hoje. Serve para     *
 * comparar lado a lado, não faz parte da proposta.                    *
 * ------------------------------------------------------------------ */
const colunasDeHoje = computed<EnKanbanColumn[]>(() =>
  (['pending', 'working', 'blocked', 'completed'] as const).map(s => ({
    value: s,
    label: t.value.status[s],
    colorScheme: s === 'completed' ? 'success' : s === 'blocked' ? 'error' : s === 'working' ? 'warning' : 'info',
  })))

const cartaoDeHoje: EnKanbanCardConfig = {
  header: 'name',
  content: 'description',
  tags: [{ refId: 'priority', name: 'Prioridade' }],
  createdAtField: { refId: 'created_at', name: 'Criado em' },
  userField: { refId: 'assigned_to', name: 'Responsável' },
}
</script>

<template>
  <div>
    <!--
      A casca (menu lateral, barra do topo, trilha) é cópia do develop e NÃO é
      proposta. Está aqui para o quadro ser julgado no lugar onde ele vive, e
      para ficar evidente que a mudança para no conteúdo.
    -->
    <CascaDoEnspace :t="t" :workspace="t.workspace" slug="produtos">
      <BarraDoQuadro
      v-model:busca="busca"
      v-model:agrupamento="agrupamento"
      v-model:ordenacao="ordenacao"
      v-model:ordenacao-desc="ordenacaoDesc"
      v-model:densidade="densidade"
      v-model:campos="campos"
      v-model:filtros="filtros"
      v-model:periodo="periodo"
      v-model:campo-de-data="campoDeData"
      v-model:ocultar-vazias="ocultarVazias"
      v-model:raias-ocultas="raiasOcultas"
      v-model:visualizacao="visualizacao"
      :t="t"
      :total="base.length"
      :visiveis="totalVisivel"
      :raias="definicoesDeRaia.map(d => ({ valor: d.valor, rotulo: d.rotulo }))"
      :somente-leitura="somenteLeitura"
      @nova-tarefa="abrirCriacao()"
      @limpar="limparFiltros"
    />

    <UAlert
      v-if="somenteLeitura"
      icon="i-lucide-eye"
      :title="t.somenteLeitura"
      :description="t.somenteLeituraAjuda"
      color="neutral"
      variant="subtle"
      class="mx-4 mt-3"
    />

    <main class="flex min-h-0 flex-1 flex-col overflow-x-auto px-4 pb-28 pt-4">
      <!-- Erro -->
      <UEmpty
        v-if="estado === 'erro'"
        icon="i-lucide-cloud-alert"
        :title="t.erroTitulo"
        :description="t.erroDescricao"
        :actions="[{ label: t.tentarDeNovo, color: 'primary', onClick: () => (estado = 'cheio') }]"
        class="mt-16"
      />

      <!-- Quadro de hoje, para comparar -->
      <ClientOnly v-else-if="estado === 'hoje'">
        <div class="rounded-xl border border-dashed border-default p-3">
          <p class="mb-3 text-xs text-muted">
            Abaixo, o mesmo dado no componente que o produto usa hoje (EnKanbanBoard),
            com o cartão configurado como o quadro de develop configura.
          </p>
          <EnKanbanBoard
            :data="filtradas"
            :card-map="cartaoDeHoje"
            :columns="colunasDeHoje"
            group-by="status"
            primary-key="id"
          />
        </div>
      </ClientOnly>

      <!-- Sem nenhuma tarefa no workspace -->
      <UEmpty
        v-else-if="!base.length && !carregando"
        icon="i-lucide-clipboard-list"
        :title="t.vazioTitulo"
        :description="t.vazioDescricao"
        :actions="[{ label: t.novaTarefa, color: 'primary', onClick: () => abrirCriacao() }]"
        class="mt-16"
      />

      <!-- Busca sem resultado -->
      <UEmpty
        v-else-if="!totalVisivel && !carregando && busca"
        icon="i-lucide-search-x"
        :title="t.buscaVaziaTitulo(busca)"
        :description="t.buscaVaziaDescricao"
        :actions="[{ label: t.limparFiltros, color: 'neutral', onClick: limparFiltros }]"
        class="mt-16"
      />

      <!-- O quadro -->
      <div v-else class="flex min-h-0 flex-1 items-stretch gap-3">
        <RaiaDoQuadro
          v-for="(raia, i) in raiasVisiveis"
          :key="raia.definicao.valor"
          :raia="raia.definicao"
          :tarefas="raia.tarefas"
          :t="t"
          :campos="campos"
          :densidade="densidade"
          :calculo="calculoDaRaia(raia.definicao.valor)"
          :campos-do-totalizador="camposDoTotalizador"
          :ordenacao-da-raia="ordenacaoPorRaia[raia.definicao.valor] ?? null"
          :limite="limites[raia.definicao.valor] ?? null"
          :recolhida="raiasRecolhidas.includes(raia.definicao.valor)"
          :somente-leitura="somenteLeitura"
          :tarefa-ativa="tarefaAberta?.id ?? null"
          :carregando="carregando"
          :atraso="i * 60"
          @recolher="alternarRecolhida(raia.definicao.valor)"
          @ocultar="raiasOcultas = [...raiasOcultas, raia.definicao.valor]"
          @nova-tarefa="abrirCriacao(raia.definicao.valor)"
          @calculo="(c) => calculoPorRaia = { ...calculoPorRaia, [raia.definicao.valor]: c }"
          @ordenacao="(o) => ordenacaoPorRaia = { ...ordenacaoPorRaia, [raia.definicao.valor]: o }"
          @limite="(n) => limites = { ...limites, [raia.definicao.valor]: n }"
          @soltar="(id) => soltarNaRaia(raia.definicao.valor, id)"
          @abrir="abrir"
          @mover="mover"
          @arquivar="arquivar"
        />
      </div>
      </main>
    </CascaDoEnspace>

    <!-- O cartão aberto -->
    <USlideover
      v-model:open="painelAberto"
      :ui="{ content: painelExpandido ? 'max-w-[61rem] transition-[max-width] duration-200' : 'max-w-[43.75rem] transition-[max-width] duration-200' }"
    >
      <template #content>
        <PainelDaTarefa
          v-if="tarefaAberta"
          :tarefa="tarefaAberta"
          :t="t"
          :somente-leitura="somenteLeitura"
          :expandido="painelExpandido"
          @fechar="tarefaAberta = null"
          @expandir="(v) => painelExpandido = v"
          @salvar="toast.add({ title: t.tarefaSalva, icon: 'i-lucide-check', color: 'success' })"
          @concluir="concluir"
          @reabrir="reabrir"
          @copiar-referencia="copiarReferencia"
          @atualizar="atualizarCampo"
        />
      </template>
    </USlideover>

    <!-- Nova tarefa: os campos do produto, com o acabamento refeito -->
    <ModalNovaTarefa
      v-model:open="criando"
      :t="t"
      :raia="nomeDaRaiaDaCriacao"
      @criar="criar"
      @fechar="criando = false"
    />

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

        <UButton
          label="Cartão completo"
          icon="i-lucide-layers"
          size="xs"
          color="neutral"
          variant="outline"
          class="transition-transform hover:-translate-y-0.5"
          @click="mostrarCartaoCompleto"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/tarefas-rapidas"
          />
        </span>
      </div>
    </div>
  </div>
</template>
