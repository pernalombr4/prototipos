<script setup lang="ts">
/**
 * PROPOSTA (demanda 4): a aba Testar igual ao chat.
 *
 * - várias mensagens, anexo, os modelos permitidos e as ferramentas ligadas
 *   (respeita o filtro, ao contrário de hoje);
 * - cada ferramenta aparece na conversa como no chat;
 * - "Simular ferramentas que gravam" (ligado por padrão): o cartão aparece e,
 *   confirmado, mostra o resultado sem gravar (PESQUISA: Salesforce Simulate);
 * - "Comparar modelos": a mesma mensagem em até 3 modelos, lado a lado, com
 *   tempo e créditos, e "Usar como padrão" (nenhum concorrente faz: PESQUISA);
 * - casos de teste salvos, para rodar antes de salvar.
 *
 * MAQUETE: as respostas são fixas e os números de tempo e crédito, inventados.
 */
import type { Textos } from './textos'
import type { Agente } from './mocks'
import Conversa from './_Conversa.vue'
import SeletorDeModelo from './_SeletorDeModelo.vue'
import { modeloPorId, ferramentaPorSlug } from './catalogo'
import { idDaMensagem, respostaDeExemplo, roteiroDeConfirmacao, roteiroDeMinuta, type Mensagem } from './conversa'
import { conhecimentoDoAgente, espera, fixadosCabemNo, useArquivos } from './estado'

const props = defineProps<{ t: Textos, a: Agente }>()
const comparando = defineModel<boolean>('comparando', { default: false })
const arquivos = useArquivos()
const toast = useToast()
const tt = computed(() => props.t.testar)

const simular = ref(true)
const texto = ref('')
const pensando = ref(false)
const modelo = ref<string | null>(null)

interface Coluna { id: number, modelo: string, mensagens: Mensagem[], seg: string, cred: number }
let seq = 0
const colunas = ref<Coluna[]>([])
const unica = ref<Mensagem[]>([])

const metricas = (id: string) => {
  const m = modeloPorId(id)!
  return { seg: (2.1 + m.custo * 1.3).toFixed(1).replace('.', ','), cred: 4 + m.custo * 9 }
}

function comSimulacao(msgs: Mensagem[]) {
  msgs.forEach(m => m.partes.forEach((p) => { if (p.tipo === 'confirmacao') p.simulado = simular.value }))
  return msgs
}

function montarUnica() { unica.value = comSimulacao(roteiroDeConfirmacao('pendente', modelo.value ?? props.a.model)) }
function montarColunas() {
  const outros = props.a.modelosPermitidos.filter(x => x !== props.a.model)
  const ids = [props.a.model, ...outros].slice(0, 2)
  if (ids.length < 2) ids.push(props.a.modelosPermitidos[0] ?? props.a.model)
  colunas.value = ids.map(id => ({ id: ++seq, modelo: id, mensagens: roteiroDeMinuta(id), ...metricas(id) }))
}

montarUnica()
watch(comparando, (v) => { if (v && !colunas.value.length) montarColunas() }, { immediate: true })
watch(simular, () => { comSimulacao(unica.value) })

function limpar() {
  unica.value = []
  colunas.value.forEach((c) => { c.mensagens = [] })
}

function adicionarColuna() {
  const usados = colunas.value.map(c => c.modelo)
  const id = props.a.modelosPermitidos.find(x => !usados.includes(x)) ?? props.a.modelosPermitidos[0]!
  const base = colunas.value[0]?.mensagens.length ? roteiroDeMinuta(id) : []
  colunas.value.push({ id: ++seq, modelo: id, mensagens: base, ...metricas(id) })
}
function trocarModelo(c: Coluna, id: string | null) {
  if (!id) return
  c.modelo = id
  Object.assign(c, metricas(id))
  c.mensagens.forEach((m) => { if (m.papel === 'assistant') m.modelo = id })
}
function usarComoPadrao(id: string) {
  props.a.model = id
  if (!props.a.modelosPermitidos.includes(id)) props.a.modelosPermitidos.push(id)
  toast.add({ title: tt.value.virouPadrao(modeloPorId(id)!.name), icon: 'i-lucide-star', color: 'success' })
}

async function enviar() {
  const msg = texto.value.trim()
  if (!msg) return
  texto.value = ''
  const usuario = (): Mensagem => ({ id: idDaMensagem(), papel: 'user', partes: [{ tipo: 'texto', texto: msg }] })
  pensando.value = true
  if (comparando.value) colunas.value.forEach(c => c.mensagens.push(usuario()))
  else unica.value.push(usuario())
  await espera(1100)
  pensando.value = false
  if (comparando.value) colunas.value.forEach(c => c.mensagens.push(respostaDeExemplo(msg, c.modelo, false)))
  else unica.value.push(respostaDeExemplo(msg, modelo.value ?? props.a.model, false))
}

function salvarCaso() {
  props.a.casos.push({ id: `c${Date.now() % 1000}`, nome: tt.value.salvarCaso, mensagem: '"monta a resposta e manda pra vara"', esperado: 'Pede confirmação antes de enviar o e-mail.', ultimo: 'nunca' })
  toast.add({ title: tt.value.casoSalvo, icon: 'i-lucide-bookmark-check', color: 'success' })
}

/* Casos de teste */
const rodando = ref(false)
const rodandoId = ref<string | null>(null)
async function rodarTodos() {
  rodando.value = true
  for (const c of props.a.casos) {
    rodandoId.value = c.id
    await espera(700)
    c.ultimo = c.id === 'c3' ? 'falhou' : 'passou'
  }
  rodandoId.value = null
  rodando.value = false
}
const passaram = computed(() => props.a.casos.filter(c => c.ultimo === 'passou').length)
const corDoResultado = { passou: 'success', falhou: 'error', nunca: 'neutral' } as const

const saber = computed(() => conhecimentoDoAgente(props.a, arquivos.value))
const refs = computed(() => saber.value.todos)
/* Modelo que não comporta os documentos fixados. */
const naoCabe = computed(() => props.a.modelosPermitidos.filter(id => !fixadosCabemNo(modeloPorId(id)?.contexto ?? 0, saber.value.fixados)))
const ferramentasLigadas = computed(() => Object.keys(props.a.ferramentas).length)
const gravam = computed(() => Object.keys(props.a.ferramentas).filter(s => ferramentaPorSlug(s).efeito !== 'le').length)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 class="text-base font-semibold text-highlighted">{{ tt.titulo }}</h3>
        <p class="mt-0.5 max-w-2xl text-sm text-muted">{{ tt.texto }}</p>
        <p class="mt-1 flex flex-wrap gap-x-3 text-xs text-dimmed">
          <span>{{ t.essencial.ferramentasResumo(ferramentasLigadas, Object.values(a.ferramentas).filter(x => x === 'confirmar').length) }}</span>
          <span v-if="refs.length">{{ t.chat.referencia(refs.length) }}</span>
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <UButton :label="tt.limpar" icon="i-lucide-square-pen" color="neutral" variant="ghost" size="sm" @click="limpar" />
        <UButton :label="tt.salvarCaso" icon="i-lucide-bookmark-plus" color="neutral" variant="outline" size="sm" @click="salvarCaso" />
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg bg-elevated/50 px-4 py-3">
      <USwitch v-model="simular" :label="tt.simular" :description="gravam ? tt.simularAjuda : undefined" />
      <USwitch v-model="comparando" :label="tt.comparar" :description="tt.compararAjuda" :disabled="a.modelosPermitidos.length < 2" />
    </div>

    <!-- Uma conversa -->
    <div v-if="!comparando" class="flex h-[32rem] flex-col overflow-hidden rounded-lg ring ring-default">
      <div class="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <Conversa :t="t" :mensagens="unica" :cor="a.cor" :pensando="pensando" />
        <p v-if="!unica.length && !pensando" class="py-16 text-center text-sm text-muted">{{ t.chat.boasVindas }}</p>
      </div>
    </div>

    <!-- Comparar modelos -->
    <div v-else class="grid gap-3" :style="{ gridTemplateColumns: `repeat(${colunas.length + (colunas.length < 3 ? 1 : 0)}, minmax(0, 1fr))` }">
      <TransitionGroup enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-x-2" leave-active-class="transition duration-150" leave-to-class="opacity-0">
        <div v-for="c in colunas" :key="c.id" class="flex h-[34rem] min-w-0 flex-col overflow-hidden rounded-lg ring ring-default">
          <header class="flex items-center gap-1 border-b border-default px-2 py-1.5">
            <SeletorDeModelo :model-value="c.modelo" :t="t" :permitidos="a.modelosPermitidos" :padrao="a.model" :nao-cabe="naoCabe" sem-padrao size="sm" class="min-w-0 flex-1" @update:model-value="trocarModelo(c, $event)" />
            <UBadge v-if="c.modelo === a.model" :label="t.seletorDeModelo.padraoCurto" icon="i-lucide-star" color="primary" variant="soft" size="sm" />
            <UButton v-if="colunas.length > 2" icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="tt.removerColuna" @click="colunas = colunas.filter(x => x.id !== c.id)" />
          </header>
          <div class="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            <Conversa :t="t" :mensagens="c.mensagens" :cor="a.cor" :pensando="pensando" compact />
          </div>
          <footer class="flex flex-wrap items-center gap-2 border-t border-default px-2 py-1.5">
            <span class="text-xs tabular-nums text-muted">{{ tt.metricas(c.seg, c.cred) }}</span>
            <UButton v-if="c.modelo !== a.model" :label="tt.usarComoPadrao" icon="i-lucide-star" color="neutral" variant="outline" size="xs" class="ml-auto" @click="usarComoPadrao(c.modelo)" />
          </footer>
        </div>
      </TransitionGroup>
      <button
        v-if="colunas.length < 3"
        type="button"
        class="flex h-[34rem] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-accented text-sm text-muted transition hover:border-primary hover:bg-primary/5 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
        @click="adicionarColuna"
      >
        <UIcon name="i-lucide-plus" class="size-5" />{{ tt.adicionarColuna }}
      </button>
    </div>

    <!-- A entrada, como no chat -->
    <UChatPrompt v-model="texto" :placeholder="tt.placeholder" variant="subtle" :rows="1" autoresize :maxrows="6" @submit="enviar">
      <template #footer>
        <div class="flex min-w-0 flex-1 items-center gap-1">
          <UTooltip :text="t.chat.anexar"><UButton icon="i-lucide-paperclip" color="neutral" variant="ghost" size="xs" :aria-label="t.chat.anexar" /></UTooltip>
          <SeletorDeModelo v-if="!comparando" v-model="modelo" :t="t" :permitidos="a.modelosPermitidos" :padrao="a.model" :nao-cabe="naoCabe" />
          <span v-else class="text-xs text-muted">{{ tt.compararAjuda }}</span>
        </div>
        <UChatPromptSubmit :status="pensando ? 'submitted' : 'ready'" size="xs" :aria-label="t.chat.enviar" />
      </template>
    </UChatPrompt>

    <!-- Casos de teste -->
    <section class="space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 class="text-sm font-semibold text-highlighted">{{ tt.casosTitulo }}</h4>
          <p class="text-xs text-muted">{{ tt.casosTexto }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="a.casos.length" class="text-xs tabular-nums text-muted" aria-live="polite">{{ tt.resumoCasos(passaram, a.casos.length) }}</span>
          <UButton :label="rodando ? tt.rodando : tt.rodarTodos" icon="i-lucide-play" :loading="rodando" :disabled="!a.casos.length" size="sm" @click="rodarTodos" />
        </div>
      </div>
      <ul v-if="a.casos.length" class="divide-y divide-default rounded-lg border border-default">
        <li v-for="c in a.casos" :key="c.id" class="grid gap-2 px-3 py-2.5 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
          <div class="min-w-0">
            <p class="text-sm font-medium text-highlighted">{{ c.nome }}</p>
            <p class="truncate text-xs text-muted">{{ c.mensagem }}</p>
          </div>
          <p class="text-xs text-muted"><span class="font-medium text-default">{{ tt.casoEsperado }}:</span> {{ c.esperado }}</p>
          <UBadge
            :label="rodandoId === c.id ? tt.rodando : tt.resultados[c.ultimo]"
            :color="rodandoId === c.id ? 'neutral' : corDoResultado[c.ultimo]"
            :icon="rodandoId === c.id ? 'i-lucide-loader-circle' : c.ultimo === 'passou' ? 'i-lucide-check' : c.ultimo === 'falhou' ? 'i-lucide-x' : 'i-lucide-minus'"
            :ui="{ leadingIcon: rodandoId === c.id ? 'animate-spin' : '' }"
            variant="soft"
            class="justify-self-start sm:justify-self-end"
          />
        </li>
      </ul>
    </section>

  </div>
</template>
