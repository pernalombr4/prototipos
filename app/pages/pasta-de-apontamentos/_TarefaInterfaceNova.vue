<script setup lang="ts">
/**
 * Rodada 6: a aba Tarefa na interface nova, no modo da tarefa do ClickUp
 * (prints da redatora e exploração de 12/11/2026). Mesma estrutura do
 * formulário atual, com outra aparência:
 * - nome grande, editável ali mesmo, sem caixa;
 * - a grade de propriedades em 2 colunas, ícone e rótulo à esquerda, o valor
 *   solto à direita, "Vazio" em cinza, e cada valor abre o seletor dele;
 * - Status (selo, avançar e concluir), Datas (Data limite → Prazo final),
 *   Estimativa de tempo, Etiquetas (`tag_ids`), Pontos, Responsável (1 só,
 *   como no ENSPACE), Colaboradores, Prioridade e Registrar tempo;
 * - "Ocultar campos vazios", a descrição sem caixa e as seções abaixo;
 * - ao rolar, uma barra fina com o nome, a data e o responsável, como no ClickUp.
 */
import type { Etiqueta, ItemVinculavel, Mencao, Pessoa, TarefaDoItem } from './mocks'
import type { Textos } from './textos'
import RegistroDeTempo from './_RegistroDeTempo.vue'
import SecoesDaTarefa from './_SecoesDaTarefa.vue'
import SeletorDePrazos from './_SeletorDePrazos.vue'
import { concluida, filhas, porId, relacionadasDe, bloqueia } from './tarefas'
import { duracao, lerDuracao, minutosDe } from './tempo'

const props = defineProps<{
  t: Textos
  x: TarefaDoItem
  tarefas: TarefaDoItem[]
  pessoas: Pessoa[]
  mencoes: Mencao[]
  itens: ItemVinculavel[]
  etiquetas: Etiqueta[]
  quem: number
  estadoDaTela: string
  somenteLeitura?: boolean
}>()
const emit = defineEmits<{ abrir: [x: TarefaDoItem], concluir: [], reabrir: [] }>()

const toast = useToast()
const tn = computed(() => props.t.tarefaNova)
const tr = computed(() => props.t.tarefaRapida)
const pessoa = (id?: number | null) => props.pessoas.find(p => p.id === id)
const mae = computed(() => porId(props.tarefas, props.x.mae))

/* ---------- status ---------- */
const iconeDoStatus: Record<string, string> = { pending: 'i-lucide-circle-dashed', working: 'i-lucide-circle-dot', blocked: 'i-lucide-circle-pause', completed: 'i-lucide-circle-check' }
const corDoStatus = { pending: 'neutral', working: 'info', blocked: 'error', completed: 'success' } as const
const corDoIcone: Record<string, string> = { pending: 'text-muted', working: 'text-info', blocked: 'text-error', completed: 'text-success' }
const status = computed(() => props.x.tarefa.status)
const proximo = computed(() => ({ pending: 'working', working: 'completed', blocked: 'working', completed: null } as const)[status.value])
const itensDeStatus = computed(() => [
  [{ type: 'label' as const, label: tn.value.status.grupos.naoIniciado }, { label: props.t.tarefas.colunas.pending, value: 'pending', icon: iconeDoStatus.pending }],
  [{ type: 'label' as const, label: tn.value.status.grupos.ativo }, { label: props.t.tarefas.colunas.working, value: 'working', icon: iconeDoStatus.working }, { label: props.t.tarefas.colunas.blocked, value: 'blocked', icon: iconeDoStatus.blocked }],
  [{ type: 'label' as const, label: tn.value.status.grupos.fechado }, { label: props.t.tarefas.colunas.completed, value: 'completed', icon: iconeDoStatus.completed }],
])
function mudarStatus(s: unknown) {
  if (typeof s !== 'string' || s === status.value) return
  if (s === 'completed') return emit('concluir')
  if (status.value === 'completed') emit('reabrir')
  props.x.tarefa.status = s as typeof status.value
}
const avancar = () => proximo.value && mudarStatus(proximo.value)

/* ---------- datas ---------- */
const focoDasDatas = ref<'limite' | 'final'>('limite')
const datasAbertas = ref(false)
const limite = computed(() => props.x.tarefa.due_date ? new Date(props.x.tarefa.due_date) : null)
const final = computed(() => props.x.prazoFinal ? new Date(props.x.prazoFinal) : null)
const atrasada = computed(() => !!limite.value && limite.value < new Date() && !concluida(props.x))

/* ---------- estimativa ---------- */
const estimativaAberta = ref(false)
const textoDaEstimativa = ref('')
watch(estimativaAberta, (a) => { if (a) textoDaEstimativa.value = props.x.estimativa ? duracao(props.x.estimativa) : '' })
const estimativaInvalida = computed(() => !!textoDaEstimativa.value.trim() && !lerDuracao(textoDaEstimativa.value))
function salvarEstimativa() {
  if (estimativaInvalida.value) return
  props.x.estimativa = lerDuracao(textoDaEstimativa.value)
  estimativaAberta.value = false
}

/* ---------- pessoas ---------- */
const opcoesDePessoa = computed(() => props.pessoas.map(p => ({
  label: p.id === props.quem ? `${p.nome} (${tn.value.pessoas.eu})` : p.nome,
  value: p.id,
  avatar: { text: p.iniciais, alt: p.nome },
})))
const opcoesDeColaborador = computed(() => opcoesDePessoa.value.filter(o => o.value !== props.x.tarefa.assigned_to))
const responsavel = computed({
  get: () => props.x.tarefa.assigned_to ?? undefined,
  set: (v) => {
    props.x.tarefa.assigned_to = v ?? null
    props.x.tarefa.collaborators = (props.x.tarefa.collaborators ?? []).filter(id => id !== v)
  },
})
const colaboradores = computed({
  get: () => props.x.tarefa.collaborators ?? [],
  set: v => { props.x.tarefa.collaborators = v },
})
const listaDeColaboradores = computed(() => colaboradores.value.map(id => pessoa(id)).filter((p): p is Pessoa => !!p))

/* ---------- etiquetas ---------- */
const idsDeEtiqueta = computed({
  get: () => (props.x.tarefa.tag_ids ?? []) as number[],
  set: v => { props.x.tarefa.tag_ids = v },
})
const opcoesDeEtiqueta = computed(() => props.etiquetas.map(e => ({ label: e.nome, value: e.id, chip: { color: e.cor } })))
const etiquetasDaTarefa = computed(() => idsDeEtiqueta.value.map(id => props.etiquetas.find(e => e.id === id)).filter((e): e is Etiqueta => !!e))
const cores = ['primary', 'info', 'success', 'warning', 'error', 'neutral'] as const
function criarEtiqueta(nome: string) {
  const id = Math.max(0, ...props.etiquetas.map(e => e.id)) + 1
  props.etiquetas.push({ id, nome, cor: cores[id % cores.length]! })
  idsDeEtiqueta.value = [...idsDeEtiqueta.value, id]
  toast.add({ title: tn.value.etiquetas.criada(nome), icon: 'i-lucide-tag', color: 'success', duration: 2000 })
}
const tirarEtiqueta = (id: number) => { idsDeEtiqueta.value = idsDeEtiqueta.value.filter(i => i !== id) }

/* ---------- prioridade ---------- */
const corDaBandeira: Record<string, string> = { low: 'text-dimmed', normal: 'text-info', high: 'text-warning', urgent: 'text-error' }
const opcoesDePrioridade = computed(() => (['urgent', 'high', 'normal', 'low'] as const).map(p => ({ label: props.t.prioridades[p], value: p, icon: 'i-lucide-flag', cor: corDaBandeira[p] })))
const prioridade = computed({
  get: () => props.x.tarefa.priority,
  set: (v) => { if (v) props.x.tarefa.priority = v },
})

/* ---------- campos vazios ---------- */
const ocultarVazios = ref(false)
const vazios = computed(() => ({
  datas: !limite.value && !final.value,
  estimativa: !props.x.estimativa,
  etiquetas: !etiquetasDaTarefa.value.length,
  pontos: !Number(props.x.tarefa.points),
  responsavel: !pessoa(props.x.tarefa.assigned_to),
  colaboradores: !listaDeColaboradores.value.length,
  tempo: !minutosDe(props.x) && !props.x.cronometro,
}))
const quantosVazios = computed(() => Object.values(vazios.value).filter(Boolean).length)
const mostra = (campo: keyof typeof vazios.value) => !ocultarVazios.value || !vazios.value[campo]

/* ---------- contagens do topo ---------- */
const subs = computed(() => filhas(props.tarefas, props.x))
const relacoes = computed(() => relacionadasDe(props.tarefas, props.x).length + props.x.itens.length + props.x.bloqueadaPor.length + bloqueia(props.tarefas, props.x).length)

/* ---------- a barra fina ao rolar ---------- */
const rolagem = ref<HTMLElement | null>(null)
const titulo = ref<HTMLElement | null>(null)
const tituloFora = ref(false)
let observador: IntersectionObserver | undefined
onMounted(() => {
  if (!titulo.value || !rolagem.value) return
  observador = new IntersectionObserver(([e]) => { tituloFora.value = !e!.isIntersecting }, { root: rolagem.value, threshold: 0 })
  observador.observe(titulo.value)
})
onBeforeUnmount(() => observador?.disconnect())

const valorBase = 'flex min-h-8 w-full min-w-0 items-center gap-1.5 rounded-md px-1.5 text-left text-sm transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default disabled:hover:bg-transparent'
</script>

<template>
  <div ref="rolagem" class="relative h-full overflow-y-auto">
    <!-- A barra fina, quando o nome sai da tela -->
    <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-100" leave-to-class="opacity-0">
      <div v-if="tituloFora" class="sticky top-0 z-10 flex items-center gap-2 border-b border-default bg-default/95 py-2 pl-6 pr-14 backdrop-blur">
        <UIcon :name="iconeDoStatus[status]" class="size-4 shrink-0" :class="corDoIcone[status]" />
        <span class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted">{{ x.tarefa.name }}</span>
        <span v-if="limite" class="text-xs" :class="atrasada ? 'text-error' : 'text-muted'">{{ t.data(limite) }}</span>
        <UIcon v-if="x.tarefa.priority !== 'normal'" name="i-lucide-flag" class="size-3.5" :class="corDaBandeira[x.tarefa.priority]" />
        <UAvatar v-if="pessoa(x.tarefa.assigned_to)" :text="pessoa(x.tarefa.assigned_to)!.iniciais" :alt="pessoa(x.tarefa.assigned_to)!.nome" size="2xs" />
      </div>
    </Transition>

    <div class="flex flex-col gap-5 px-6 pb-8 pt-4">
      <!-- Topo: trilha, referência e contagens -->
      <div class="flex flex-wrap items-center gap-1.5 pr-10 text-xs text-muted">
        <template v-if="mae">
          <UIcon name="i-lucide-git-branch" class="size-3.5" />
          <span>{{ tr.subtarefas.parteDe }}</span>
          <UButton :label="mae.tarefa.name" color="neutral" variant="link" size="xs" class="max-w-56 truncate p-0 font-medium" :aria-label="tr.subtarefas.abrirMae(mae.tarefa.name)" @click="emit('abrir', mae)" />
          <span class="mx-1 text-dimmed">·</span>
        </template>
        <UBadge :label="x.tarefa.reference.slice(0, 10)" icon="i-lucide-hash" color="neutral" variant="outline" size="sm" class="font-mono" :title="x.tarefa.reference" />
        <UTooltip v-if="subs.length" :text="tr.subtarefas.titulo">
          <UBadge :label="String(subs.length)" icon="i-lucide-git-branch" color="neutral" variant="ghost" size="sm" />
        </UTooltip>
        <UTooltip v-if="relacoes" :text="tn.relacoes.titulo">
          <UBadge :label="String(relacoes)" icon="i-lucide-link-2" color="neutral" variant="ghost" size="sm" />
        </UTooltip>
      </div>

      <!-- Nome -->
      <div ref="titulo" class="-mt-2">
        <UTextarea
          v-model="x.tarefa.name"
          :rows="1"
          autoresize
          variant="none"
          :disabled="somenteLeitura"
          :placeholder="tn.titulo"
          :aria-label="tn.titulo"
          class="w-full"
          :ui="{ base: 'p-0 text-2xl md:text-2xl font-semibold leading-tight text-highlighted resize-none disabled:cursor-default disabled:opacity-100' }"
        />
      </div>

      <!-- A grade de propriedades -->
      <section :aria-label="t.painelTarefa.detalhes" class="flex flex-col gap-1">
        <dl class="grid gap-x-8 gap-y-0.5 sm:grid-cols-2">
          <!-- Status -->
          <div class="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2">
            <dt class="flex items-center gap-2 text-sm text-muted"><UIcon name="i-lucide-circle-dot" class="size-4 shrink-0" />{{ tn.campos.status }}</dt>
            <dd class="flex min-h-8 items-center gap-1 px-1.5">
              <UFieldGroup size="xs">
                <USelectMenu
                  :model-value="status"
                  :items="itensDeStatus"
                  value-key="value"
                  :search-input="{ placeholder: tn.status.buscar }"
                  :disabled="somenteLeitura"
                  :color="corDoStatus[status]"
                  variant="soft"
                  size="xs"
                  trailing-icon=""
                  :ui="{ base: 'uppercase font-semibold tracking-wide ps-2 pe-2 whitespace-nowrap', content: 'min-w-52' }"
                  @update:model-value="mudarStatus"
                >
                  <template #default>
                    <span class="flex items-center gap-1.5"><UIcon :name="iconeDoStatus[status]" class="size-3.5" />{{ t.tarefas.colunas[status] }}</span>
                  </template>
                </USelectMenu>
                <UTooltip v-if="proximo" :text="tn.status.avancar(t.tarefas.colunas[proximo])">
                  <UButton icon="i-lucide-chevron-right" :color="corDoStatus[status]" variant="soft" size="xs" :disabled="somenteLeitura" :aria-label="tn.status.avancar(t.tarefas.colunas[proximo])" @click="avancar" />
                </UTooltip>
              </UFieldGroup>
              <UTooltip v-if="!concluida(x)" :text="tn.status.concluir">
                <UButton icon="i-lucide-check" color="neutral" variant="outline" size="xs" :disabled="somenteLeitura" :aria-label="tn.status.concluir" @click="emit('concluir')" />
              </UTooltip>
            </dd>
          </div>

          <!-- Responsável: 1 só, como no ENSPACE -->
          <div v-if="mostra('responsavel')" class="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2">
            <dt class="flex items-center gap-2 text-sm text-muted"><UIcon name="i-lucide-user" class="size-4 shrink-0" />{{ tn.campos.responsavel }}</dt>
            <dd class="group/resp relative">
              <USelectMenu v-model="responsavel" :items="opcoesDePessoa" value-key="value" :search-input="{ placeholder: tn.pessoas.buscar }" :disabled="somenteLeitura" variant="none" trailing-icon="" class="w-full" :ui="{ base: valorBase, content: 'min-w-64' }">
                <template #default>
                  <template v-if="pessoa(x.tarefa.assigned_to)">
                    <UAvatar :text="pessoa(x.tarefa.assigned_to)!.iniciais" :alt="pessoa(x.tarefa.assigned_to)!.nome" size="2xs" />
                    <span class="truncate text-highlighted">{{ pessoa(x.tarefa.assigned_to)!.nome }}</span>
                  </template>
                  <span v-else class="text-dimmed">{{ tn.vazio }}</span>
                </template>
                <template #empty>{{ tn.pessoas.nenhuma }}</template>
              </USelectMenu>
              <UButton
                v-if="pessoa(x.tarefa.assigned_to) && !somenteLeitura"
                icon="i-lucide-x"
                color="neutral"
                variant="ghost"
                size="xs"
                class="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/resp:opacity-100"
                :aria-label="tn.pessoas.tirarResponsavel"
                @click="responsavel = undefined"
              />
            </dd>
          </div>

          <!-- Datas: Data limite → Prazo final -->
          <div v-if="mostra('datas')" class="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2">
            <dt class="flex items-center gap-2 text-sm text-muted"><UIcon name="i-lucide-calendar" class="size-4 shrink-0" />{{ tn.campos.datas }}</dt>
            <dd>
              <UPopover v-model:open="datasAbertas" :content="{ align: 'start', side: 'bottom', sideOffset: 6, collisionPadding: 12 }">
                <div :class="valorBase" class="cursor-pointer" role="group" :aria-label="tn.campos.datas">
                  <button type="button" class="flex items-center gap-1 rounded hover:underline" :aria-label="tn.campos.dataLimite" @click="focoDasDatas = 'limite'">
                    <UIcon name="i-lucide-calendar" class="size-3.5" :class="limite ? (atrasada ? 'text-error' : 'text-muted') : 'text-dimmed'" />
                    <span :class="limite ? (atrasada ? 'text-error' : 'text-highlighted') : 'text-dimmed'">{{ limite ? t.data(limite) : tn.campos.dataLimite }}</span>
                  </button>
                  <UIcon name="i-lucide-arrow-right" class="size-3 shrink-0 text-dimmed" />
                  <button type="button" class="flex items-center gap-1 rounded hover:underline" :aria-label="tn.campos.prazoFinal" @click="focoDasDatas = 'final'">
                    <UIcon name="i-lucide-flag" class="size-3.5" :class="final ? 'text-muted' : 'text-dimmed'" />
                    <span :class="final ? 'text-highlighted' : 'text-dimmed'">{{ final ? t.data(final) : tn.campos.prazoFinal }}</span>
                  </button>
                </div>
                <template #content>
                  <SeletorDePrazos v-model:foco="focoDasDatas" :t="t" :x="x" :somente-leitura="somenteLeitura" />
                </template>
              </UPopover>
            </dd>
          </div>

          <!-- Colaboradores -->
          <div v-if="mostra('colaboradores')" class="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2">
            <dt class="flex items-center gap-2 text-sm text-muted">
              <UIcon name="i-lucide-users" class="size-4 shrink-0" />
              <span class="leading-tight">{{ tn.campos.colaboradores }}</span>
            </dt>
            <dd>
              <USelectMenu v-model="colaboradores" :items="opcoesDeColaborador" value-key="value" multiple :search-input="{ placeholder: tn.pessoas.buscar }" :disabled="somenteLeitura" variant="none" trailing-icon="" class="w-full" :ui="{ base: valorBase, content: 'min-w-64' }">
                <template #default>
                  <template v-if="listaDeColaboradores.length === 1">
                    <UAvatar :text="listaDeColaboradores[0]!.iniciais" :alt="listaDeColaboradores[0]!.nome" size="2xs" />
                    <span class="truncate text-highlighted">{{ listaDeColaboradores[0]!.nome }}</span>
                  </template>
                  <UAvatarGroup v-else-if="listaDeColaboradores.length" size="2xs" :max="4">
                    <UAvatar v-for="p in listaDeColaboradores" :key="p.id" :text="p.iniciais" :alt="p.nome" />
                  </UAvatarGroup>
                  <span v-else class="text-dimmed">{{ tn.vazio }}</span>
                </template>
                <template #content-top>
                  <p class="border-b border-default px-2.5 py-2 text-xs text-muted">{{ tn.pessoas.ajudaColaboradores }}</p>
                </template>
                <template #empty>{{ tn.pessoas.nenhuma }}</template>
              </USelectMenu>
            </dd>
          </div>

          <!-- Estimativa -->
          <div v-if="mostra('estimativa')" class="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2">
            <dt class="flex items-center gap-2 text-sm text-muted"><UIcon name="i-lucide-hourglass" class="size-4 shrink-0" /><span class="leading-tight">{{ tn.campos.estimativa }}</span></dt>
            <dd>
              <UPopover v-model:open="estimativaAberta" :content="{ align: 'start', side: 'bottom', sideOffset: 6 }">
                <button type="button" :class="valorBase" :disabled="somenteLeitura">
                  <span :class="x.estimativa ? 'text-highlighted' : 'text-dimmed'">{{ x.estimativa ? duracao(x.estimativa) : tn.vazio }}</span>
                </button>
                <template #content>
                  <div class="flex w-72 flex-col gap-2 p-3">
                    <div class="flex items-center justify-between gap-3">
                      <p class="text-sm font-medium text-highlighted">{{ tn.estimativa.titulo }}</p>
                      <UInput v-model="textoDaEstimativa" :placeholder="tn.estimativa.placeholder" size="sm" class="w-32" autofocus :color="estimativaInvalida ? 'error' : 'primary'" :highlight="estimativaInvalida" :aria-label="tn.estimativa.titulo" @keydown.enter.prevent="salvarEstimativa" />
                    </div>
                    <p class="text-xs" :class="estimativaInvalida ? 'text-error' : 'text-muted'">{{ estimativaInvalida ? tn.estimativa.invalido : tn.estimativa.ajuda }}</p>
                    <UButton v-if="x.estimativa" :label="tn.estimativa.tirar" icon="i-lucide-x" color="neutral" variant="ghost" size="xs" class="self-start" @click="x.estimativa = null; estimativaAberta = false" />
                  </div>
                </template>
              </UPopover>
            </dd>
          </div>

          <!-- Prioridade -->
          <div class="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2">
            <dt class="flex items-center gap-2 text-sm text-muted"><UIcon name="i-lucide-flag" class="size-4 shrink-0" />{{ tn.campos.prioridade }}</dt>
            <dd>
              <USelectMenu v-model="prioridade" :items="opcoesDePrioridade" value-key="value" :search-input="false" :disabled="somenteLeitura" variant="none" trailing-icon="" class="w-full" :ui="{ base: valorBase, content: 'min-w-44' }">
                <template #default>
                  <UIcon name="i-lucide-flag" class="size-4" :class="corDaBandeira[x.tarefa.priority]" />
                  <span class="text-highlighted">{{ t.prioridades[x.tarefa.priority] }}</span>
                </template>
                <template #item-leading="{ item }">
                  <UIcon name="i-lucide-flag" class="size-4" :class="item.cor" />
                </template>
              </USelectMenu>
            </dd>
          </div>

          <!-- Etiquetas -->
          <div v-if="mostra('etiquetas')" class="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2">
            <dt class="flex items-center gap-2 text-sm text-muted"><UIcon name="i-lucide-tag" class="size-4 shrink-0" />{{ tn.campos.etiquetas }}</dt>
            <dd>
              <USelectMenu v-model="idsDeEtiqueta" :items="opcoesDeEtiqueta" value-key="value" multiple create-item :search-input="{ placeholder: tn.etiquetas.buscar }" :disabled="somenteLeitura" variant="none" trailing-icon="" class="w-full" :ui="{ base: `${valorBase} flex-wrap py-1`, content: 'min-w-56' }" @create="criarEtiqueta">
                <template #default>
                  <span v-if="!etiquetasDaTarefa.length" class="text-dimmed">{{ tn.vazio }}</span>
                  <UBadge v-for="e in etiquetasDaTarefa" :key="e.id" :label="e.nome" :color="e.cor" variant="soft" size="sm" class="group/etq">
                    <template v-if="!somenteLeitura" #trailing>
                      <span role="button" tabindex="-1" class="-me-0.5 hidden rounded-sm hover:bg-accented/60 group-hover/etq:inline-flex" :aria-label="tn.etiquetas.tirar(e.nome)" @click.stop="tirarEtiqueta(e.id)" @pointerdown.stop>
                        <UIcon name="i-lucide-x" class="size-3" />
                      </span>
                    </template>
                  </UBadge>
                </template>
              </USelectMenu>
            </dd>
          </div>

          <!-- Registrar tempo -->
          <div v-if="mostra('tempo')" class="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2">
            <dt class="flex items-center gap-2 text-sm text-muted"><UIcon name="i-lucide-timer" class="size-4 shrink-0" /><span class="leading-tight">{{ tn.campos.tempo }}</span></dt>
            <dd>
              <RegistroDeTempo :t="t" :x="x" :tarefas="tarefas" :pessoas="pessoas" :quem="quem" :somente-leitura="somenteLeitura" modo="nova" />
            </dd>
          </div>

          <!-- Pontos -->
          <div v-if="mostra('pontos')" class="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-2">
            <dt class="flex items-center gap-1.5 text-sm text-muted">
              <UIcon name="i-lucide-hash" class="size-4 shrink-0" />{{ tn.campos.pontos }}
              <UTooltip :text="tr.pontos.ajuda"><UIcon name="i-lucide-circle-help" class="size-3.5 text-dimmed" :aria-label="tr.pontos.ajuda" /></UTooltip>
            </dt>
            <dd>
              <UInputNumber
                v-model="x.tarefa.points"
                :min="0"
                :disabled="somenteLeitura"
                variant="none"
                size="sm"
                :increment="false"
                :decrement="false"
                :placeholder="tn.vazio"
                class="w-full"
                :ui="{ base: 'min-h-8 rounded-md px-1.5 text-start tabular-nums transition-colors hover:bg-elevated focus:bg-elevated placeholder:text-dimmed' }"
                :aria-label="tn.campos.pontos"
              />
            </dd>
          </div>
        </dl>

        <button
          v-if="quantosVazios"
          type="button"
          class="mt-1 flex items-center gap-1.5 self-start rounded px-1 text-xs text-muted transition-colors hover:text-highlighted"
          @click="ocultarVazios = !ocultarVazios"
        >
          <UIcon :name="ocultarVazios ? 'i-lucide-chevrons-up-down' : 'i-lucide-chevrons-down-up'" class="size-3.5" />
          {{ ocultarVazios ? tn.mostrarVazios(quantosVazios) : tn.ocultarVazios }}
        </button>
      </section>

      <!-- Descrição, sem caixa -->
      <ClientOnly>
        <UEditor
          :model-value="x.tarefa.description ?? ''"
          content-type="html"
          :editable="!somenteLeitura"
          :placeholder="tn.descricao"
          @update:model-value="(v: unknown) => { x.tarefa.description = String(v ?? '') }"
          class="-mx-1.5 rounded-md transition-colors hover:bg-elevated/50 focus-within:bg-transparent"
          :ui="{ base: 'min-h-20 px-1.5 sm:px-1.5 py-1 text-sm text-default *:my-1 focus:outline-none' }"
        />
        <template #fallback>
          <USkeleton class="h-20 w-full" />
        </template>
      </ClientOnly>

      <!-- As seções -->
      <SecoesDaTarefa
        :key="`${x.tarefa.id}-${estadoDaTela}`"
        :t="t"
        :x="x"
        :itens="itens"
        :tarefas="tarefas"
        :pessoas="pessoas"
        :mencoes="mencoes"
        :quem="quem"
        :somente-leitura="somenteLeitura"
        nova
        @abrir="(y: TarefaDoItem) => emit('abrir', y)"
      />
    </div>
  </div>
</template>
