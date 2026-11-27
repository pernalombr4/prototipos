<script setup lang="ts">
/**
 * PROPOSTA (rodada 2, opção A do estado inicial): o BENI monta o primeiro dashboard.
 *
 * 4 passos num modal:
 * 1. Escolher: as categorias que entram e, se quiser, o que a pessoa quer acompanhar;
 * 2. Lendo: o BENI lê os campos e os itens de cada categoria (aparece o que ele leu);
 * 3. Confirmar: o que ele não sabe pelo nome do campo, ele pergunta, com um palpite;
 * 4. Painéis sugeridos: cada um com o motivo, para aceitar ou tirar. O dashboard só
 *    nasce quando a pessoa clica em "Criar dashboard".
 *
 * Nada aqui chama IA de verdade: as regras ficam em `beni.ts`.
 */
import type { ConfigDoPainel } from './agregacao'
import { campoDe, iconeDoTipo } from './agregacao'
import type { Pergunta, Proposta } from './beni'
import { lerCategoria, perguntasPara, propor, proporDoPedido } from './beni'
import { CATEGORIAS, categoriaPorSlug } from './mocks'
import type { Textos } from './textos'
import AvatarDoBeni from './_AvatarDoBeni.vue'

const props = defineProps<{ t: Textos }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ criar: [nome: string, paineis: ConfigDoPainel[]] }>()

type Passo = 'escolher' | 'lendo' | 'confirmar' | 'propostas'
const passo = ref<Passo>('escolher')
const escolhidas = ref<string[]>([])
const pedido = ref('')
const lidas = ref<ReturnType<typeof lerCategoria>[]>([])
const perguntas = ref<Pergunta[]>([])
const propostas = ref<Proposta[]>([])
const nome = ref('')
const criando = ref(false)
let timers: ReturnType<typeof setTimeout>[] = []

watch(aberto, (a) => {
  timers.forEach(clearTimeout)
  timers = []
  if (!a) return
  passo.value = 'escolher'
  escolhidas.value = CATEGORIAS.slice(0, 1).map(c => c.slug)
  pedido.value = ''
  lidas.value = []
  criando.value = false
})

const leituras = computed(() => CATEGORIAS.map(c => lerCategoria(c.slug)))

function ler() {
  passo.value = 'lendo'
  lidas.value = []
  escolhidas.value.forEach((slug, i) => {
    timers.push(setTimeout(() => { lidas.value = [...lidas.value, lerCategoria(slug)] }, 600 * (i + 1)))
  })
  timers.push(setTimeout(() => {
    perguntas.value = perguntasPara(escolhidas.value)
    passo.value = perguntas.value.length ? 'confirmar' : 'propostas'
    if (!perguntas.value.length) montarPropostas()
  }, 600 * (escolhidas.value.length + 1) + 500))
}

/** O pedido escrito vem primeiro; o painel repetido (mesmo tipo, cálculo e campos) sai. */
function montarPropostas() {
  const doPedido = pedido.value.trim() ? escolhidas.value.flatMap(s => proporDoPedido(pedido.value, s)).map(p => ({ ...p, aceita: true })) : []
  const chave = (p: Proposta) => [p.cfg.categoria, p.cfg.visualizacao, p.cfg.funcao, p.cfg.medida, p.cfg.agruparPor].join('|')
  const vistas = new Set<string>()
  propostas.value = [...doPedido, ...propor(escolhidas.value, perguntas.value)].filter((p) => {
    if (vistas.has(chave(p))) return false
    vistas.add(chave(p))
    return true
  })
  nome.value = escolhidas.value.map(s => categoriaPorSlug.get(s)!.name).join(props.t.beni.e)
  passo.value = 'propostas'
}

/* ------------------------------- as perguntas ------------------------------ */

function textoDaPergunta(p: Pergunta) {
  const cat = categoriaPorSlug.get(p.categoria)!.name
  if (p.tipo === 'data') return props.t.beni.perguntaData(cat)
  const c = campoDe(p.categoria, p.campo)!
  return p.tipo === 'medida' ? props.t.beni.perguntaMedida(c.name) : props.t.beni.perguntaEtapas(c.name, (c.options ?? []).map(o => o.label).slice(0, 4).join(', '))
}
function opcoesDa(p: Pergunta) {
  if (p.tipo === 'medida') return (['soma', 'media', 'ignorar'] as const).map(v => ({ label: props.t.beni.usos[v], value: v }))
  if (p.tipo === 'etapas') return [{ label: props.t.beni.etapasSim, value: 'sim' }, { label: props.t.beni.etapasNao, value: 'nao' }]
  return categoriaPorSlug.get(p.categoria)!.campos.filter(c => ['date', 'datetime-local', 'EnlCalendar'].includes(c.type)).map(c => ({ label: c.name, value: c.refId }))
}
function iconeDa(p: Pergunta) {
  if (p.tipo === 'data') return 'i-lucide-calendar'
  const c = campoDe(p.categoria, p.campo)
  return c ? iconeDoTipo(c) : 'i-lucide-circle-help'
}

/* ------------------------------- as propostas ------------------------------ */

const ICONES: Record<string, string> = {
  numero: 'i-lucide-square-asterisk', barras: 'i-lucide-chart-column', barrasHorizontais: 'i-lucide-chart-bar',
  linha: 'i-lucide-chart-line', area: 'i-lucide-chart-area', rosca: 'i-lucide-chart-pie', funil: 'i-lucide-filter', tabela: 'i-lucide-table',
}
function tituloDa(p: Proposta) {
  const cfg = p.cfg
  const cat = categoriaPorSlug.get(cfg.categoria)!.name
  return props.t.frase(cfg.funcao, cat, campoDe(cfg.categoria, cfg.medida)?.name, cfg.visualizacao === 'numero' ? undefined : campoDe(cfg.categoria, cfg.agruparPor)?.name)
}
function motivoDa(p: Proposta) {
  const nomeDoCampo = p.motivo.campo ? campoDe(p.motivo.categoria, p.motivo.campo)?.name ?? '' : ''
  return props.t.beni.motivos[p.motivo.tipo](nomeDoCampo, categoriaPorSlug.get(p.motivo.categoria)!.name)
}
const aceitas = computed(() => propostas.value.filter(p => p.aceita))

function criar() {
  if (!aceitas.value.length || !nome.value.trim()) return
  criando.value = true
  timers.push(setTimeout(() => {
    // Cartões primeiro, como no painel de tarefas: a grade põe os números no topo.
    const ordem = [...aceitas.value].sort((a, b) => Number(b.cfg.visualizacao === 'numero') - Number(a.cfg.visualizacao === 'numero'))
    emit('criar', nome.value.trim(), ordem.map(p => p.cfg))
    aberto.value = false
  }, 600))
}

const indice = computed(() => ({ escolher: 1, lendo: 2, confirmar: 3, propostas: 4 })[passo.value])
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="t.beni.titulo"
    :description="t.beni.passo(indice, 4)"
    :close="{ 'aria-label': t.beni.cancelar }"
    :ui="{ content: 'sm:max-w-2xl' }"
  >
    <template #body>
      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
        enter-from-class="opacity-0 translate-y-1"
        leave-active-class="transition duration-100 ease-in motion-reduce:transition-none"
        leave-to-class="opacity-0"
      >
        <!-- 1. Escolher -->
        <div v-if="passo === 'escolher'" key="escolher" class="space-y-4">
          <div class="flex items-start gap-3">
            <AvatarDoBeni tamanho="md" />
            <div class="rounded-lg rounded-tl-none bg-elevated px-3 py-2 text-sm text-toned">
              <p>{{ t.beni.ola }}</p>
              <p class="mt-1 text-muted">{{ t.beni.limite }}</p>
            </div>
          </div>
          <UFormField :label="t.beni.categorias" required :error="!escolhidas.length ? t.beni.categoriasErro : undefined">
            <div class="divide-y divide-default rounded-lg border border-default">
              <label v-for="c in leituras" :key="c.slug" class="flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:bg-elevated/60">
                <UCheckbox
                  :model-value="escolhidas.includes(c.slug)"
                  @update:model-value="(v: boolean | 'indeterminate') => (escolhidas = v === true ? [...escolhidas, c.slug] : escolhidas.filter(x => x !== c.slug))"
                />
                <UIcon :name="c.icone" class="size-4 shrink-0 text-muted" />
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium text-highlighted">{{ c.nome }}</span>
                  <span class="block text-xs text-muted">{{ t.beni.resumoDaCategoria(c.campos, c.itens) }}</span>
                </span>
              </label>
            </div>
          </UFormField>
          <UFormField :label="t.beni.pedido" :help="t.beni.pedidoAjuda">
            <UTextarea v-model="pedido" :rows="2" autoresize :placeholder="t.beni.pedidoPlaceholder" class="w-full" />
          </UFormField>
        </div>

        <!-- 2. Lendo -->
        <div v-else-if="passo === 'lendo'" key="lendo" class="space-y-4 py-2">
          <div class="flex items-center gap-3">
            <AvatarDoBeni tamanho="md" estado="working" />
            <p class="text-sm text-toned">{{ t.beni.lendo }}</p>
          </div>
          <UProgress animation="carousel" size="sm" />
          <ul class="space-y-2" aria-live="polite">
            <TransitionGroup
              enter-active-class="transition duration-200 ease-out motion-reduce:transition-none"
              enter-from-class="opacity-0 -translate-x-1"
            >
              <li v-for="l in lidas" :key="l.slug" class="flex items-start gap-2 text-sm">
                <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-success" />
                <span>
                  <span class="font-medium text-highlighted">{{ l.nome }}</span>
                  <span class="text-toned">: {{ t.beni.leitura(l.campos, l.itens, l.selecoes, l.numeros, l.datas) }}</span>
                </span>
              </li>
            </TransitionGroup>
          </ul>
        </div>

        <!-- 3. Confirmar o que o BENI não sabe -->
        <div v-else-if="passo === 'confirmar'" key="confirmar" class="space-y-4">
          <div class="flex items-start gap-3">
            <AvatarDoBeni tamanho="md" />
            <div class="rounded-lg rounded-tl-none bg-elevated px-3 py-2 text-sm text-toned">
              <p>{{ t.beni.confirmar }}</p>
            </div>
          </div>
          <ul class="space-y-3">
            <li v-for="p in perguntas" :key="p.id" class="rounded-lg border border-default p-3">
              <p class="flex items-start gap-2 text-sm text-highlighted">
                <UIcon :name="iconeDa(p)" class="mt-0.5 size-4 shrink-0 text-muted" />
                <span>{{ textoDaPergunta(p) }}</span>
              </p>
              <div class="mt-2 flex flex-wrap items-center gap-2 pl-6">
                <USelect v-model="p.resposta" :items="opcoesDa(p)" value-key="value" size="sm" class="w-full sm:w-80" :aria-label="textoDaPergunta(p)" />
                <span class="text-xs text-muted">{{ t.beni.palpite }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- 4. Painéis sugeridos -->
        <div v-else key="propostas" class="space-y-4">
          <div class="flex items-start gap-3">
            <AvatarDoBeni tamanho="md" estado="celebrate" />
            <div class="rounded-lg rounded-tl-none bg-elevated px-3 py-2 text-sm text-toned">
              <p>{{ t.beni.propostas(propostas.length) }}</p>
            </div>
          </div>
          <UFormField :label="t.beni.nomeDoDashboard" required>
            <UInput v-model="nome" class="w-full" />
          </UFormField>
          <ul class="max-h-[44vh] divide-y divide-default overflow-y-auto rounded-lg border border-default">
            <li v-for="(p, i) in propostas" :key="i">
              <label class="flex cursor-pointer items-start gap-3 px-3 py-2.5 transition-colors hover:bg-elevated/60">
                <UCheckbox v-model="p.aceita" class="mt-0.5" />
                <UIcon :name="ICONES[p.cfg.visualizacao]" class="mt-0.5 size-4 shrink-0 text-primary" />
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium text-highlighted">{{ tituloDa(p) }}</span>
                  <span class="block text-xs text-muted">{{ t.construtor.visualizacoes[p.cfg.visualizacao] }} · {{ motivoDa(p) }}</span>
                </span>
              </label>
            </li>
          </ul>
          <p class="text-xs text-muted">{{ t.beni.depois }}</p>
        </div>
      </Transition>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-end gap-2">
        <UButton
          v-if="passo === 'confirmar' || passo === 'propostas'"
          :label="t.beni.voltar"
          color="neutral"
          variant="ghost"
          class="mr-auto"
          @click="passo = passo === 'propostas' && perguntas.length ? 'confirmar' : 'escolher'"
        />
        <UButton :label="t.beni.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton v-if="passo === 'escolher'" :label="t.beni.ler" icon="i-lucide-sparkles" :disabled="!escolhidas.length" @click="ler" />
        <UButton v-else-if="passo === 'lendo'" :label="t.beni.ler" icon="i-lucide-sparkles" loading />
        <UButton v-else-if="passo === 'confirmar'" :label="t.beni.verPropostas" icon="i-lucide-arrow-right" @click="montarPropostas" />
        <UButton
          v-else
          :label="t.beni.criar(aceitas.length)"
          icon="i-lucide-check"
          :loading="criando"
          :disabled="!aceitas.length || !nome.trim()"
          @click="criar"
        />
      </div>
    </template>
  </UModal>
</template>
