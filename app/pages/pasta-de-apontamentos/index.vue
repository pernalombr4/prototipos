<script setup lang="ts">
/**
 * Pasta de apontamentos: um tipo novo de pasta do item e uma aba nova da tarefa.
 *
 * Uma porta: a tela do item. A pasta "Retorno de testes" (ou "Pendências do
 * contrato", no outro cenário) é do tipo Apontamentos; a pasta Tarefas abre o
 * painel da tarefa, que ganha a aba Apontamentos. O botão de nova pasta abre o
 * modal com o tipo novo.
 *
 * Andaime: cenário (produto ou jurídico, para provar que o tipo é universal),
 * quem você é (quem confere ou quem resolve) e o estado da tela.
 */
import type { Apontamento, Cenario, TarefaDoItem } from './mocks'
import type { Lista } from './lista'
import type { PastaDaBarra } from './_BarraDePastas.vue'
import { textos } from './textos'
import { cenarios, pastasDoSistema } from './mocks'
import { pendente, responder } from './lista'
import CascaDoWorkspace from './_CascaDoWorkspace.vue'
import PainelDoItem from './_PainelDoItem.vue'
import BarraDePastas from './_BarraDePastas.vue'
import PastaDeApontamentos from './_PastaDeApontamentos.vue'
import PastaTarefas from './_PastaTarefas.vue'
import PainelDaTarefa from './_PainelDaTarefa.vue'
import ModalNovaPasta from './_ModalNovaPasta.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Pasta de apontamentos',
  descricao: 'Um tipo novo de pasta do item e uma aba nova da tarefa: a lista de pontos a ajustar, com responsável, estado, anexos, rodadas de reteste e conferência.',
  status: 'em-revisao',
  atualizado: '2026-11-11',
  tela: 'Tela do item e painel da tarefa',
})

const t = useTextos(textos)
const toast = useToast()
const route = useRoute()
const router = useRouter()

/* ---------- andaime, no endereço ---------- */
type IdCenario = Cenario['id']
type Papel = 'conferente' | 'resolvedor'
type EstadoDaTela = 'cheio' | 'vazio' | 'carregando' | 'semPermissao'

function daQuery<T extends string>(chave: string, validos: readonly T[], padrao: T) {
  return computed<T>({
    get: () => (validos.includes(route.query[chave] as T) ? route.query[chave] : padrao) as T,
    set: v => router.replace({ query: { ...route.query, [chave]: v } }),
  })
}
const cenarioId = daQuery<IdCenario>('cenario', ['produto', 'juridico'], 'produto')
const papel = daQuery<Papel>('papel', ['conferente', 'resolvedor'], 'conferente')
const estadoDaTela = daQuery<EstadoDaTela>('estado', ['cheio', 'vazio', 'carregando', 'semPermissao'], 'cheio')

/* ---------- dado em memória, um por cenário ---------- */
interface PastaExtra { id: string, lista: Lista }
interface Dados { c: Cenario, vazia: Lista, extras: PastaExtra[] }

function montar(id: IdCenario): Dados {
  const c = structuredClone(toRaw(cenarios[id]))
  return { c, vazia: { apontamentos: [], rodadas: [], config: c.config, pessoas: c.pessoas }, extras: [] }
}
const dados = reactive<Record<IdCenario, Dados>>({ produto: montar('produto'), juridico: montar('juridico') })
const d = computed(() => dados[cenarioId.value])
const c = computed(() => d.value.c)
const quem = computed(() => papel.value === 'conferente' ? c.value.conferente : c.value.resolvedor)

const listaPrincipal = computed<Lista>(() => estadoDaTela.value === 'vazio'
  ? d.value.vazia
  : { apontamentos: c.value.apontamentos, rodadas: c.value.rodadas, config: c.value.config, pessoas: c.value.pessoas })

/* ---------- pastas ---------- */
const ID_PRINCIPAL = 'apontamentos'
const pendentesDe = (l: Lista) => l.apontamentos.filter(a => pendente(a.estado)).length
const pastas = computed<PastaDaBarra[]>(() => [
  ...pastasDoSistema.map(p => ({ id: p.id, nome: t.value.pastas.nomes[p.id]!, icone: p.icone })),
  { id: ID_PRINCIPAL, nome: c.value.config.nome, icone: c.value.config.icone, pendentes: pendentesDe(listaPrincipal.value) },
  ...d.value.extras.map(e => ({ id: e.id, nome: e.lista.config.nome, icone: e.lista.config.icone, pendentes: pendentesDe(e.lista) })),
])
const ativa = computed<string>({
  get: () => pastas.value.some(p => p.id === route.query.folder) ? String(route.query.folder) : ID_PRINCIPAL,
  set: id => router.replace({ query: { ...route.query, folder: id } }),
})
const listaDaPasta = computed<Lista | null>(() => ativa.value === ID_PRINCIPAL
  ? listaPrincipal.value
  : d.value.extras.find(e => e.id === ativa.value)?.lista ?? null)
const nomeDaAtiva = computed(() => pastas.value.find(p => p.id === ativa.value)?.nome ?? '')

const painelRecolhido = ref(true)
const modalNova = ref(false)
function criarPasta(config: Lista['config']) {
  const id = `pasta-${Date.now()}`
  d.value.extras.push({ id, lista: { apontamentos: [], rodadas: [], config, pessoas: c.value.pessoas } })
  ativa.value = id
  toast.add({ title: t.value.toasts.pastaCriada(config.nome), icon: 'i-lucide-folder-plus', color: 'success', duration: 3000 })
}

/* ---------- tarefas ---------- */
const tarefaAberta = ref<TarefaDoItem | null>(null)
const abaDaTarefa = ref('apontamentos')
const painelAberto = computed({
  get: () => !!tarefaAberta.value,
  set: (v) => { if (!v) tarefaAberta.value = null },
})
function abrirTarefa(x: TarefaDoItem) {
  abaDaTarefa.value = x.apontamentos.length ? 'apontamentos' : 'tarefa'
  tarefaAberta.value = x
}
/** A aba da tarefa não tem configuração de pasta: usa o padrão do tipo. */
const listaDaTarefa = computed<Lista | null>(() => {
  const x = tarefaAberta.value
  if (!x) return null
  return {
    apontamentos: estadoDaTela.value === 'vazio' ? [] : x.apontamentos,
    rodadas: estadoDaTela.value === 'vazio' ? [] : x.rodadas,
    pessoas: c.value.pessoas,
    config: {
      nome: t.value.painelTarefa.abas.apontamentos!,
      icone: 'i-lucide-list-checks',
      exigeConferencia: true,
      conferente: 'autor',
      modelo: c.value.config.modelo,
      responsavelPadrao: x.tarefa.assigned_to ?? c.value.resolvedor,
      travaConclusao: false,
      rotulos: {},
    },
  }
})

/** Converter em tarefa: uma saída, não o caminho padrão. O apontamento fica e aponta para a tarefa. */
function converter(a: Apontamento) {
  const base = c.value.tarefas[0]!.tarefa
  const nova: TarefaDoItem = {
    tarefa: { ...structuredClone(toRaw(base)), id: 990 + c.value.tarefas.length, name: a.titulo, description: null, status: 'pending', assigned_to: a.responsavel, priority: a.prioridade },
    apontamentos: [],
    rodadas: [],
  }
  c.value.tarefas.push(nova)
  responder(a, quem.value, `${t.value.apontamento.converterEmTarefa}: ${a.titulo}`)
  toast.add({
    title: t.value.toasts.convertido(a.numero),
    icon: 'i-lucide-clipboard-plus',
    color: 'success',
    duration: 5000,
    actions: [{ label: t.value.pastas.nomes.tarefas, color: 'neutral', variant: 'outline', onClick: () => { tarefaAberta.value = null; ativa.value = 'tarefas' } }],
  })
}

/* ---------- casca ---------- */
const trilha = computed(() => [c.value.workspace.name, t.value.casca.categorias, c.value.categoria.slug, c.value.item.reference])

const opcoesDePapel = computed(() => (['conferente', 'resolvedor'] as const).map(p => ({
  value: p,
  label: t.value.andaime.papeis[p],
  nome: c.value.pessoas.find(x => x.id === (p === 'conferente' ? c.value.conferente : c.value.resolvedor))?.nome,
})))

/* Ao trocar de cenário, a pasta e o detalhe abertos ficam para trás. */
watch(cenarioId, () => {
  tarefaAberta.value = null
  router.replace({ query: { cenario: cenarioId.value, papel: papel.value, estado: estadoDaTela.value } })
})
</script>

<template>
  <div>
    <CascaDoWorkspace :t="t" :trilha="trilha" :workspace="c.workspace" :categorias-do-menu="c.categoriasDoMenu">
      <div class="flex h-[calc(100dvh-4rem-3.25rem)] min-h-0">
        <PainelDoItem v-model:recolhido="painelRecolhido" :t="t" :item="c.item" :categoria="c.categoria" />
        <section class="flex min-w-0 flex-1 flex-col bg-default">
          <BarraDePastas v-model:ativa="ativa" :t="t" :pastas="pastas" @nova="modalNova = true" />

          <div class="min-h-0 flex-1">
            <Transition
              mode="out-in"
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-75 ease-in"
              leave-to-class="opacity-0"
            >
              <PastaDeApontamentos
                v-if="listaDaPasta"
                :key="`${cenarioId}-${ativa}-${estadoDaTela}`"
                :t="t"
                :lista="listaDaPasta"
                :quem="quem"
                :estado-da-tela="estadoDaTela"
                :chave="ativa"
                @converter="converter"
              />
              <PastaTarefas
                v-else-if="ativa === 'tarefas'"
                :key="`${cenarioId}-tarefas`"
                :t="t"
                :tarefas="c.tarefas"
                :lista="{ pessoas: c.pessoas }"
                @abrir="abrirTarefa"
              />
              <div v-else :key="ativa" class="flex h-full flex-col">
                <div class="flex flex-1 items-center justify-center p-8 text-center">
                  <p class="max-w-sm text-sm text-muted">{{ t.pastas.foraDoEscopo(nomeDaAtiva) }}</p>
                </div>
                <!-- Rodapé da Visão Geral, copiado: o aviso aparece sem nenhuma alteração (achado) -->
                <footer v-if="ativa === 'visao-geral'" class="flex items-center gap-3 border-t border-default px-5 py-2.5">
                  <span class="flex items-center gap-1.5 text-xs text-muted"><span class="size-1.5 rounded-full bg-warning" />{{ t.pastas.alteracoesNaoSalvas }}</span>
                  <UButton :label="t.pastas.sairSemSalvar" icon="i-lucide-undo-2" color="neutral" variant="ghost" size="sm" class="ml-auto" />
                  <UButton :label="t.pastas.salvar" icon="i-lucide-save" size="sm" />
                </footer>
              </div>
            </Transition>
          </div>
        </section>
      </div>
    </CascaDoWorkspace>

    <PainelDaTarefa
      v-if="tarefaAberta && listaDaTarefa"
      v-model:open="painelAberto"
      v-model:aba="abaDaTarefa"
      :t="t"
      :x="tarefaAberta"
      :lista="listaDaTarefa"
      :quem="quem"
      :estado-da-tela="estadoDaTela"
      @converter="converter"
    />

    <ModalNovaPasta v-model:open="modalNova" :t="t" :pessoas="c.pessoas" :responsavel-padrao="c.resolvedor" @criar="criarPasta" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.cenario }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="id in (['produto', 'juridico'] as const)"
            :key="id"
            :label="t.andaime.cenarios[id]"
            :color="cenarioId === id ? 'primary' : 'neutral'"
            :variant="cenarioId === id ? 'solid' : 'outline'"
            @click="cenarioId = id"
          />
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.voceE }}</span>
        <UFieldGroup size="xs">
          <UTooltip v-for="p in opcoesDePapel" :key="p.value" :text="p.nome">
            <UButton
              :label="p.label"
              :color="papel === p.value ? 'primary' : 'neutral'"
              :variant="papel === p.value ? 'solid' : 'outline'"
              @click="papel = p.value"
            />
          </UTooltip>
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.estado }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="e in (['cheio', 'vazio', 'carregando', 'semPermissao'] as const)"
            :key="e"
            :label="t.andaime.estados[e]"
            :color="estadoDaTela === e ? 'primary' : 'neutral'"
            :variant="estadoDaTela === e ? 'solid' : 'outline'"
            @click="estadoDaTela = e"
          />
        </UFieldGroup>

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/pasta-de-apontamentos"
          />
        </span>
      </div>
    </div>
  </div>
</template>
