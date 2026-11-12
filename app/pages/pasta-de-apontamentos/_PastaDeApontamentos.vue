<script setup lang="ts">
/**
 * A pasta do tipo Apontamentos. Proposta: é a peça nova.
 *
 * Serve ao item (pasta que o admin cria na categoria) e à tarefa (aba
 * Apontamentos do painel). Mesmo componente; `compacto` troca o lado a lado
 * (lista à esquerda, detalhe à direita) por lista e detalhe em sequência,
 * para caber no painel da tarefa e em tela estreita.
 *
 * O ciclo: quem confere escreve em rascunho e envia o retorno da rodada (1
 * aviso só); quem resolve marca cada um como resolvido e pede o reteste; quem
 * confere confere ou reabre. Descartar pede motivo. Tudo em memória.
 *
 * Rodada 2: o topo fica sem gráfico (as contagens moram nos filtros, em
 * texto); a pasta ganha as vistas Lista e Rodadas; a lista filtra e agrupa por
 * rodada; o detalhe abre em tela cheia; descartar aceita "Duplicado de".
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Apontamento, Rodada } from './mocks'
import type { Grupo, Lista, NovoApontamento } from './lista'
import type { Textos } from './textos'
import LinhaDoApontamento from './_LinhaDoApontamento.vue'
import DetalheDoApontamento from './_DetalheDoApontamento.vue'
import NovoApontamentoForm from './_NovoApontamento.vue'
import VistaDeRodadas from './_VistaDeRodadas.vue'
import {
  conferir, contagem, criar, desmarcar, descartar, enviarRetorno, foto, grupoDe, pedirReteste, pessoa,
  podeConferir, podeResolver, proximaRodada, reabrir, resolver, restaurar, resumoDaProxima, situacao, visiveis,
} from './lista'

const props = defineProps<{
  t: Textos
  lista: Lista
  quem: number
  /** 'cheio' | 'vazio' | 'carregando' | 'semPermissao', do andaime. */
  estadoDaTela: string
  compacto?: boolean
  /** Para o endereço do link de cada apontamento. */
  chave: string
}>()

const emit = defineEmits<{ converter: [a: Apontamento] }>()

const toast = useToast()
const route = useRoute()
const router = useRouter()

const somenteLeitura = computed(() => props.estadoDaTela === 'semPermissao')
const nomeDe = (id: number) => pessoa(props.lista, id)?.nome ?? ''
const souConferente = computed(() => props.lista.apontamentos.some(a => a.autor === props.quem) || props.lista.rodadas.some(r => r.quem === props.quem))

/* ---------- contagem e situação, em texto (sem gráfico no topo) ---------- */
const c = computed(() => contagem(props.lista, props.quem))
const sit = computed(() => situacao(props.lista))
const corDaSituacao: Record<string, string> = { semRetorno: 'text-muted', emCorrecao: 'text-warning', aguardandoReteste: 'text-info', concluido: 'text-success' }
const iconeDaSituacao: Record<string, string> = { semRetorno: 'i-lucide-circle-dashed', emCorrecao: 'i-lucide-wrench', aguardandoReteste: 'i-lucide-repeat', concluido: 'i-lucide-circle-check-big' }
const linhaDaSituacao = computed(() => {
  const ultima = props.lista.rodadas.at(-1)
  const n = ultima?.numero ?? 1
  const quando = sit.value === 'aguardandoReteste' ? ultima?.retestePedidoEm : ultima?.quando
  return props.t.fluxo.cabecalho[sit.value]!(n, quando ? props.t.data(quando) : '')
})

/* ---------- vista: Lista ou Rodadas ---------- */
const vista = ref<'lista' | 'rodadas'>('lista')
const opcoesDeVista = computed(() => (['lista', 'rodadas'] as const).map(v => ({ value: v, label: props.t.fluxo.vistas[v], icon: v === 'lista' ? 'i-lucide-list' : 'i-lucide-history' })))

/* ---------- filtro ---------- */
const grupo = ref<Grupo>('todos')
const busca = ref('')
const soMeus = ref(false)
const rodadaFiltro = ref<number | 'todas'>('todas')
const agrupar = ref(false)
const rodadasExistentes = computed(() => [...new Set(visiveis(props.lista, props.quem).map(a => a.rodada))].sort((x, y) => x - y))
const opcoesDeRodada = computed(() => [
  { value: 'todas' as const, label: props.t.fluxo.todasAsRodadas },
  ...rodadasExistentes.value.map(n => ({ value: n, label: props.t.lista.rodada(n) })),
])
const grupos = computed(() => {
  const base: { value: Grupo, label: string, n: number }[] = [
    { value: 'todos', label: props.t.filtros.todos, n: c.value.todos },
    { value: 'pendentes', label: props.t.filtros.pendentes, n: c.value.pendentes },
  ]
  if (props.lista.config.exigeConferencia) base.push({ value: 'paraConferir', label: props.t.filtros.paraConferir, n: c.value.paraConferir })
  base.push({ value: 'fechados', label: props.t.filtros.fechados, n: c.value.fechados })
  if (c.value.rascunhos) base.push({ value: 'rascunhos', label: props.t.filtros.rascunhos, n: c.value.rascunhos })
  return base
})

const ordemDoGrupo: Record<string, number> = { rascunhos: 0, pendentes: 1, paraConferir: 2, fechados: 3 }
const filtrados = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  return visiveis(props.lista, props.quem)
    .filter(a => grupo.value === 'todos' || grupoDe(a, props.lista.config) === grupo.value)
    .filter(a => !soMeus.value || a.responsavel === props.quem || a.autor === props.quem)
    .filter(a => rodadaFiltro.value === 'todas' || a.rodada === rodadaFiltro.value)
    .filter(a => !termo || a.titulo.toLowerCase().includes(termo) || String(a.numero) === termo.replace('#', ''))
    .sort((x, y) => (ordemDoGrupo[grupoDe(x, props.lista.config)]! - ordemDoGrupo[grupoDe(y, props.lista.config)]!) || x.numero - y.numero)
})

function limparFiltro() {
  grupo.value = 'todos'
  busca.value = ''
  soMeus.value = false
  rodadaFiltro.value = 'todas'
}

/** Com "Agrupar por rodada", a lista se divide pela rodada em que cada apontamento nasceu. */
const blocosDaLista = computed(() => {
  if (!agrupar.value) return [{ rodada: 0, itens: filtrados.value }]
  const nums = [...new Set(filtrados.value.map(a => a.rodada))].sort((x, y) => y - x)
  return nums.map(n => ({ rodada: n, itens: filtrados.value.filter(a => a.rodada === n) }))
})

/* ---------- seleção, no endereço ---------- */
const parametro = computed(() => `${props.chave}-ap`)
/* O clique vai para o endereço; a abertura inicial fica só na tela. */
const local = ref<string | null>(null)
const selecionadoId = computed<string | null>({
  get: () => {
    const q = route.query[parametro.value]
    if (q === undefined) return local.value
    return props.lista.apontamentos.find(a => a.numero === Number(q))?.id ?? null
  },
  set: (id) => {
    local.value = id
    const a = props.lista.apontamentos.find(x => x.id === id)
    router.replace({ query: { ...route.query, [parametro.value]: a ? String(a.numero) : undefined } })
  },
})
const selecionado = computed(() => props.lista.apontamentos.find(a => a.id === selecionadoId.value) ?? null)

/* No lado a lado, o primeiro reaberto (ou o primeiro da lista) já vem aberto. */
onMounted(() => {
  if (!props.compacto && !selecionadoId.value && props.estadoDaTela === 'cheio') {
    const primeiro = filtrados.value.find(a => a.estado === 'reaberto') ?? filtrados.value[0]
    if (primeiro) local.value = primeiro.id
  }
})

/* ---------- ações com desfazer ---------- */
function comDesfazer(a: Apontamento, acao: () => void, titulo: string, icone: string, cor: 'success' | 'neutral' | 'info' = 'neutral') {
  const antes = foto(a)
  acao()
  toast.add({
    title: titulo,
    icon: icone,
    color: cor,
    duration: 4000,
    actions: [{ label: props.t.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => restaurar(props.lista, antes) }],
  })
}

const aoResolver = (a: Apontamento) => comDesfazer(a, () => resolver(props.lista, a, props.quem), props.t.toasts.resolvido(a.numero), 'i-lucide-check', 'success')
const aoDesmarcar = (a: Apontamento) => desmarcar(props.lista, a, props.quem)
const aoConferir = (a: Apontamento) => comDesfazer(a, () => conferir(props.lista, a, props.quem), props.t.toasts.conferido(a.numero), 'i-lucide-badge-check', 'success')

/* Reabrir e descartar pedem o motivo; descartar aceita "Duplicado de". */
const pedido = ref<{ tipo: 'reabrir' | 'descartar', a: Apontamento } | null>(null)
const motivo = ref('')
const tipoDeDescarte = ref<'naoSeraFeito' | 'duplicado'>('naoSeraFeito')
const duplicadoDe = ref<number | undefined>()
function pedirMotivo(tipo: 'reabrir' | 'descartar', a: Apontamento) {
  motivo.value = ''
  tipoDeDescarte.value = 'naoSeraFeito'
  duplicadoDe.value = undefined
  pedido.value = { tipo, a }
}
const opcoesDeDescarte = computed(() => (['naoSeraFeito', 'duplicado'] as const).map(v => ({ value: v, label: props.t.fluxo.motivos[v] })))
const opcoesDeDuplicado = computed(() => props.lista.apontamentos
  .filter(a => a.id !== pedido.value?.a.id && a.estado !== 'rascunho')
  .map(a => ({ value: a.numero, label: `#${a.numero} ${a.titulo}` })))
const duplicando = computed(() => pedido.value?.tipo === 'descartar' && tipoDeDescarte.value === 'duplicado')
const podeConfirmar = computed(() => duplicando.value ? !!duplicadoDe.value : !!motivo.value.trim())
function confirmarMotivo() {
  if (!pedido.value || !podeConfirmar.value) return
  const { tipo, a } = pedido.value
  if (tipo === 'reabrir') {
    comDesfazer(a, () => reabrir(props.lista, a, props.quem, motivo.value.trim()), props.t.toasts.reaberto(a.numero), 'i-lucide-rotate-ccw')
  }
  else if (duplicando.value) {
    const n = duplicadoDe.value!
    comDesfazer(a, () => descartar(props.lista, a, props.quem, props.t.fluxo.duplicadoTexto(n), n), props.t.toasts.descartado(a.numero), 'i-lucide-copy')
  }
  else {
    comDesfazer(a, () => descartar(props.lista, a, props.quem, motivo.value.trim()), props.t.toasts.descartado(a.numero), 'i-lucide-circle-slash')
  }
  pedido.value = null
}

/* ---------- tela cheia ---------- */
const telaCheia = ref(false)
function abrirDaRodada(a: Apontamento) {
  vista.value = 'lista'
  grupo.value = 'todos'
  rodadaFiltro.value = 'todas'
  selecionadoId.value = a.id
}

function aoExcluir(a: Apontamento) {
  const antes = foto(a)
  props.lista.apontamentos.splice(props.lista.apontamentos.indexOf(a), 1)
  selecionadoId.value = null
  toast.add({ title: props.t.toasts.excluido(a.numero), icon: 'i-lucide-trash-2', duration: 4000, actions: [{ label: props.t.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => restaurar(props.lista, antes) }] })
}

function copiarLink(a: Apontamento) {
  const url = new URL(window.location.href)
  url.searchParams.set(parametro.value, String(a.numero))
  navigator.clipboard?.writeText(url.toString())
  toast.add({ title: props.t.toasts.linkCopiado, icon: 'i-lucide-link', duration: 2000 })
}

/* ---------- criar ---------- */
const criando = ref(false)
function aoCriar(n: NovoApontamento, rascunho: boolean) {
  const a = criar(props.lista, n, props.quem, rascunho)
  criando.value = false
  grupo.value = 'todos'
  selecionadoId.value = a.id
  toast.add({ title: rascunho ? props.t.toasts.rascunho(a.numero) : props.t.toasts.criado(a.numero), icon: rascunho ? 'i-lucide-pencil-line' : 'i-lucide-plus', color: 'success', duration: 3000 })
}

const colando = ref(false)
const textoColado = ref('')
const linhasColadas = computed(() => textoColado.value.split('\n').map(s => s.trim()).filter(Boolean))
function criarDaLista() {
  for (const titulo of linhasColadas.value) {
    criar(props.lista, { titulo, corpo: props.lista.config.modelo, responsavel: props.lista.config.responsavelPadrao, prioridade: 'normal', anexos: [] }, props.quem, true)
  }
  toast.add({ title: props.t.toasts.criados(linhasColadas.value.length), icon: 'i-lucide-list-plus', color: 'success', duration: 3000 })
  textoColado.value = ''
  colando.value = false
  grupo.value = 'rascunhos'
}

const gerandoPdf = ref(false)
async function exportarPdf() {
  gerandoPdf.value = true
  await new Promise(r => setTimeout(r, 900))
  gerandoPdf.value = false
  toast.add({ title: props.t.toasts.pdf(c.value.todos, props.lista.rodadas.length), icon: 'i-lucide-file-down', color: 'success', duration: 3000 })
}

const menuDeCriar = computed<DropdownMenuItem[][]>(() => [[
  { label: props.t.lista.colarLista, icon: 'i-lucide-list-plus', onSelect: () => { colando.value = true } },
], [
  { label: props.t.lista.exportarPdf, icon: 'i-lucide-file-down', onSelect: exportarPdf },
  { label: props.t.lista.copiarLinkDaPasta, icon: 'i-lucide-link', onSelect: () => toast.add({ title: props.t.toasts.linkCopiado, icon: 'i-lucide-link', duration: 2000 }) },
]])

/* ---------- rodada: enviar retorno e pedir reteste ---------- */
const meusRascunhos = computed(() => props.lista.apontamentos.filter(a => a.estado === 'rascunho' && a.autor === props.quem).length)
const paraEuConferir = computed(() => props.lista.apontamentos.filter(a => podeConferir(a, props.quem, props.lista.config)).length)
const meusPendentes = computed(() => props.lista.apontamentos.filter(a => podeResolver(a, props.quem)).length)
const meusResolvidos = computed(() => props.lista.apontamentos.filter(a => a.estado === 'resolvido' && a.responsavel === props.quem).length)
const podePedirReteste = computed(() => props.lista.config.exigeConferencia && !souConferente.value && !meusPendentes.value && meusResolvidos.value > 0 && !!props.lista.rodadas.length && !props.lista.rodadas.at(-1)?.retestePedidoEm)

const enviando = ref(false)
const veredito = ref<Rodada['veredito']>('correcao')
const resumo = ref('')
const salvandoEnvio = ref(false)
const proxima = computed(() => resumoDaProxima(props.lista, props.quem))
const opcoesDeVeredito = computed(() => (['correcao', 'ressalvas', 'aprovado'] as const).map(v => ({ value: v, label: props.t.lista.vereditos[v] })))
async function confirmarEnvio() {
  salvandoEnvio.value = true
  await new Promise(r => setTimeout(r, 500))
  const n = enviarRetorno(props.lista, props.quem, veredito.value, resumo.value.trim())
  salvandoEnvio.value = false
  enviando.value = false
  resumo.value = ''
  if (grupo.value === 'rascunhos') grupo.value = 'todos'
  toast.add({ title: props.t.toasts.enviado(n), icon: 'i-lucide-send', color: 'success', duration: 3000 })
}

const pedindoReteste = ref(false)
const notaReteste = ref('')
const salvandoReteste = ref(false)
async function confirmarReteste() {
  salvandoReteste.value = true
  await new Promise(r => setTimeout(r, 450))
  pedirReteste(props.lista, props.quem)
  salvandoReteste.value = false
  pedindoReteste.value = false
  toast.add({ title: props.t.toasts.retestePedido, icon: 'i-lucide-repeat', color: 'success', duration: 3000 })
}
const conferenteDaLista = computed(() => props.lista.rodadas.at(-1)?.quem)

/* ---------- largura: lado a lado ou em sequência ---------- */
const raiz = ref<HTMLElement | null>(null)
const estreito = ref(!!props.compacto)
onMounted(() => {
  if (props.compacto || !raiz.value) return
  const ro = new ResizeObserver(([e]) => { estreito.value = (e?.contentRect.width ?? 1200) < 880 })
  ro.observe(raiz.value)
  onBeforeUnmount(() => ro.disconnect())
})
const emSequencia = computed(() => props.compacto || estreito.value)
</script>

<template>
  <div ref="raiz" class="flex h-full min-h-0 flex-col">
    <!-- CARREGANDO -->
    <div v-if="estadoDaTela === 'carregando'" class="flex flex-col gap-4 p-5" :aria-label="t.lista.carregando" aria-busy="true">
      <USkeleton class="h-6 w-64" />
      <USkeleton class="h-4 w-56" />
      <div class="flex gap-2">
        <USkeleton v-for="i in 4" :key="i" class="h-7 w-24" />
      </div>
      <div v-for="i in 6" :key="i" class="flex items-start gap-3 py-2">
        <USkeleton class="size-6 rounded-full" />
        <div class="flex flex-1 flex-col gap-2">
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-3 w-1/3" />
        </div>
      </div>
    </div>

    <template v-else>
      <!-- CABEÇALHO DA PASTA -->
      <header class="flex flex-col gap-3 border-b border-default px-5 pb-3 pt-4">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div class="flex min-w-0 items-center gap-2">
            <UIcon :name="lista.config.icone" class="size-5 shrink-0 text-primary" />
            <h2 class="truncate text-base font-semibold text-highlighted">{{ t.novaPasta.tipos.apontamentos }}</h2>
          </div>
          <!-- A vista da pasta -->
          <UTabs
            v-if="c.todos || lista.rodadas.length"
            v-model="vista"
            :items="opcoesDeVista"
            :content="false"
            variant="pill"
            size="xs"
            :aria-label="t.fluxo.vistaDaPasta"
            :ui="{ list: 'p-0.5', trigger: 'px-2.5' }"
          />

          <div class="ml-auto flex items-center gap-2">
            <UButton
              v-if="!compacto"
              :label="t.lista.exportarPdf"
              icon="i-lucide-file-down"
              color="neutral"
              variant="outline"
              size="sm"
              :loading="gerandoPdf"
              :disabled="!c.todos"
              class="hidden lg:inline-flex"
              @click="exportarPdf"
            />
            <UFieldGroup size="sm">
              <UButton :label="t.lista.novo" icon="i-lucide-plus" :disabled="somenteLeitura" @click="criando = true" />
              <UDropdownMenu :items="menuDeCriar" :content="{ align: 'end' }" :disabled="somenteLeitura">
                <UButton icon="i-lucide-chevron-down" :aria-label="t.lista.maisOpcoes" :disabled="somenteLeitura" />
              </UDropdownMenu>
            </UFieldGroup>
          </div>
        </div>

        <!-- A rodada em curso, em texto -->
        <p v-if="c.todos" class="flex flex-wrap items-center gap-1.5 text-xs" :class="corDaSituacao[sit]">
          <UIcon :name="iconeDaSituacao[sit]" class="size-3.5" />
          <span class="font-medium">{{ linhaDaSituacao }}</span>
          <template v-if="lista.rodadas.at(-1)">
            <span class="text-dimmed">·</span>
            <span class="text-muted">{{ t.lista.vereditos[lista.rodadas.at(-1)!.veredito] }}</span>
          </template>
        </p>
      </header>

      <!-- AVISOS DA RODADA, conforme o papel -->
      <div class="flex flex-col">
        <UAlert v-if="somenteLeitura" :description="t.lista.semPermissao" icon="i-lucide-lock" color="neutral" variant="subtle" orientation="horizontal"
            class="rounded-none border-b border-default py-2.5" />
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <UAlert
            v-if="!somenteLeitura && meusRascunhos"
            :description="t.lista.rascunhos(meusRascunhos)"
            icon="i-lucide-pencil-line"
            color="primary"
            variant="subtle"
            orientation="horizontal"
            class="rounded-none border-b border-default py-2.5"
            :actions="[{ label: t.lista.enviarRetorno, icon: 'i-lucide-send', color: 'primary', size: 'sm', onClick: () => { enviando = true } }]"
          />
          <UAlert
            v-else-if="!somenteLeitura && paraEuConferir"
            :description="t.lista.avisoConferir(paraEuConferir)"
            icon="i-lucide-badge-check"
            color="info"
            variant="subtle"
            orientation="horizontal"
            class="rounded-none border-b border-default py-2.5"
            :actions="[{ label: t.filtros.paraConferir, color: 'info', variant: 'outline', size: 'sm', onClick: () => { grupo = 'paraConferir' } }]"
          />
          <UAlert
            v-else-if="!somenteLeitura && podePedirReteste"
            :description="t.lista.avisoReteste"
            icon="i-lucide-repeat"
            color="success"
            variant="subtle"
            orientation="horizontal"
            class="rounded-none border-b border-default py-2.5"
            :actions="[{ label: t.lista.pedirReteste, icon: 'i-lucide-repeat', color: 'success', size: 'sm', onClick: () => { pedindoReteste = true } }]"
          />
        </Transition>
      </div>

      <!-- VAZIO -->
      <div v-if="!c.todos && !c.rascunhos && !criando" class="flex flex-1 items-center justify-center p-8">
        <UEmpty
          :icon="lista.config.icone"
          :title="t.lista.vazioTitulo"
          :description="t.lista.vazioTexto"
          variant="naked"
          :actions="somenteLeitura ? [] : [
            { label: t.lista.novo, icon: 'i-lucide-plus', onClick: () => { criando = true } },
            { label: t.lista.colarLista, icon: 'i-lucide-list-plus', color: 'neutral', variant: 'outline', onClick: () => { colando = true } },
          ]"
          class="max-w-md"
        />
      </div>

      <!-- RODADAS -->
      <VistaDeRodadas v-else-if="vista === 'rodadas'" :t="t" :lista="lista" :quem="quem" @abrir="abrirDaRodada" />

      <!-- LISTA E DETALHE -->
      <div v-else class="flex min-h-0 flex-1">
        <section
          v-show="!emSequencia || !selecionado"
          class="flex min-h-0 min-w-0 flex-col"
          :class="emSequencia ? 'flex-1' : 'w-[44%] min-w-80 max-w-[34rem] border-r border-default'"
        >
          <!-- Filtros -->
          <div class="flex flex-col gap-2 border-b border-default px-4 py-2.5">
            <div class="flex flex-wrap items-center gap-1">
              <UButton
                v-for="g in grupos"
                :key="g.value"
                :color="grupo === g.value ? 'primary' : 'neutral'"
                :variant="grupo === g.value ? 'soft' : 'ghost'"
                size="xs"
                :aria-pressed="grupo === g.value"
                @click="grupo = g.value"
              >
                {{ g.label }}
                <span class="tabular-nums" :class="grupo === g.value ? 'text-primary' : 'text-dimmed'">{{ g.n }}</span>
              </UButton>
            </div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
              <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.filtros.buscar" size="sm" class="min-w-40 flex-1" :aria-label="t.filtros.buscar" />
              <USelect v-model="rodadaFiltro" :items="opcoesDeRodada" size="sm" icon="i-lucide-history" class="w-40" :aria-label="t.fluxo.filtroRodada" />
            </div>
            <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
              <USwitch v-model="soMeus" :label="t.filtros.soMeus" size="sm" />
              <USwitch v-model="agrupar" :label="t.fluxo.agrupar" size="sm" />
            </div>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto">
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2" leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0 -translate-y-1">
              <NovoApontamentoForm v-if="criando" :t="t" :lista="lista" :conferente="souConferente" @criar="aoCriar" @cancelar="criando = false" />
            </Transition>

            <template v-for="bl in blocosDaLista" :key="bl.rodada">
              <p v-if="agrupar" class="sticky top-0 z-10 flex items-center gap-2 border-b border-default bg-default/95 px-4 py-1.5 text-xs font-semibold text-muted backdrop-blur">
                <span class="rounded bg-inverted px-1.5 py-0.5 font-mono text-[11px] text-inverted">R{{ bl.rodada }}</span>
                {{ t.fluxo.grupoRodada(bl.rodada) }}
                <span class="tabular-nums text-dimmed">{{ bl.itens.length }}</span>
              </p>
              <TransitionGroup tag="ul" move-class="transition-transform duration-300 ease-out" enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-2" leave-active-class="absolute opacity-0 transition duration-150" class="relative">
                <LinhaDoApontamento
                  v-for="(a, i) in bl.itens"
                  :key="a.id"
                  :t="t"
                  :lista="lista"
                  :a="a"
                  :quem="quem"
                  :selecionado="selecionadoId === a.id"
                  :somente-leitura="somenteLeitura"
                  :style="{ transitionDelay: `${Math.min(i, 10) * 25}ms` }"
                  @abrir="selecionadoId = a.id"
                  @resolver="aoResolver(a)"
                  @desmarcar="aoDesmarcar(a)"
                  @conferir="aoConferir(a)"
                  @reabrir="pedirMotivo('reabrir', a)"
                />
              </TransitionGroup>
            </template>

            <div v-if="!filtrados.length && !criando" class="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <UIcon name="i-lucide-filter-x" class="size-6 text-dimmed" />
              <p class="text-sm text-muted">{{ t.lista.vazioFiltro }}</p>
              <UButton :label="t.lista.limparFiltro" color="neutral" variant="outline" size="xs" @click="limparFiltro" />
            </div>
          </div>
        </section>

        <!-- Detalhe -->
        <section v-if="!emSequencia || selecionado" class="min-h-0 min-w-0 flex-1">
          <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" :enter-from-class="emSequencia ? 'opacity-0 translate-x-3' : 'opacity-0 translate-y-1'" leave-active-class="transition duration-100" leave-to-class="opacity-0">
            <DetalheDoApontamento
              v-if="selecionado"
              :key="selecionado.id"
              :t="t"
              :lista="lista"
              :a="selecionado"
              :quem="quem"
              :somente-leitura="somenteLeitura"
              :compacto="emSequencia"
              @fechar="selecionadoId = null"
              @resolver="aoResolver(selecionado)"
              @desmarcar="aoDesmarcar(selecionado)"
              @conferir="aoConferir(selecionado)"
              @reabrir="pedirMotivo('reabrir', selecionado)"
              @descartar="pedirMotivo('descartar', selecionado)"
              @excluir="aoExcluir(selecionado)"
              @copiar-link="copiarLink(selecionado)"
              @converter="emit('converter', selecionado)"
              @tela-cheia="telaCheia = true"
            />
            <div v-else class="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
              <UIcon name="i-lucide-mouse-pointer-click" class="size-7 text-dimmed" />
              <p class="text-sm text-muted">{{ t.lista.selecione }}</p>
            </div>
          </Transition>
        </section>
      </div>
    </template>

    <!-- Motivo: reabrir e descartar -->
    <UModal
      :open="!!pedido"
      :title="pedido ? `${pedido.tipo === 'reabrir' ? t.apontamento.reabrir : t.apontamento.descartar} #${pedido.a.numero}` : ''"
      :description="pedido?.a.titulo"
      :ui="{ content: 'max-w-md' }"
      @update:open="(v: boolean) => { if (!v) pedido = null }"
    >
      <template #body>
        <form id="form-motivo" class="flex flex-col gap-4" @submit.prevent="confirmarMotivo">
          <UFormField v-if="pedido?.tipo === 'descartar'" :label="t.fluxo.motivoDoDescarte">
            <URadioGroup v-model="tipoDeDescarte" :items="opcoesDeDescarte" variant="table" orientation="horizontal" size="sm" />
          </UFormField>
          <UFormField v-if="duplicando" :label="t.fluxo.duplicadoDe" required>
            <USelectMenu v-model="duplicadoDe" :items="opcoesDeDuplicado" value-key="value" :placeholder="t.fluxo.escolhaApontamento" class="w-full" />
          </UFormField>
          <UFormField v-else :label="pedido?.tipo === 'reabrir' ? t.apontamento.perguntaReabrir : t.apontamento.perguntaDescartar" required>
            <UTextarea v-model="motivo" :rows="3" autoresize autofocus class="w-full" />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.apontamento.cancelar" color="neutral" variant="ghost" @click="pedido = null" />
          <UButton
            type="submit"
            form="form-motivo"
            :label="pedido?.tipo === 'reabrir' ? t.apontamento.confirmarReabrir : t.apontamento.confirmarDescartar"
            :color="pedido?.tipo === 'reabrir' ? 'error' : 'neutral'"
            :disabled="!podeConfirmar"
          />
        </div>
      </template>
    </UModal>

    <!-- Apontamento em tela cheia -->
    <UModal v-model:open="telaCheia" fullscreen :title="selecionado ? `#${selecionado.numero} ${selecionado.titulo}` : ''" :ui="{ header: 'hidden', body: 'p-0 sm:p-0' }">
      <template #body>
        <div class="mx-auto h-full max-w-4xl border-x border-default">
          <DetalheDoApontamento
            v-if="selecionado"
            :t="t"
            :lista="lista"
            :a="selecionado"
            :quem="quem"
            :somente-leitura="somenteLeitura"
            em-tela-cheia
            @fechar="telaCheia = false"
            @resolver="aoResolver(selecionado)"
            @desmarcar="aoDesmarcar(selecionado)"
            @conferir="aoConferir(selecionado)"
            @reabrir="pedirMotivo('reabrir', selecionado)"
            @descartar="pedirMotivo('descartar', selecionado)"
            @excluir="() => { telaCheia = false; aoExcluir(selecionado!) }"
            @copiar-link="copiarLink(selecionado)"
            @converter="emit('converter', selecionado)"
          />
        </div>
      </template>
    </UModal>

    <!-- Enviar retorno -->
    <UModal v-model:open="enviando" :title="t.enviar.titulo(proximaRodada(lista))" :description="t.enviar.contagem(proxima.novos, proxima.reabertos)" :ui="{ content: 'max-w-lg' }">
      <template #body>
        <form id="form-envio" class="flex flex-col gap-4" @submit.prevent="confirmarEnvio">
          <UFormField :label="t.enviar.veredito">
            <URadioGroup v-model="veredito" :items="opcoesDeVeredito" variant="table" orientation="horizontal" size="sm" />
          </UFormField>
          <UFormField :label="t.enviar.resumo">
            <UTextarea v-model="resumo" :placeholder="t.enviar.resumoPlaceholder" :rows="3" autoresize class="w-full" />
          </UFormField>
          <p v-if="proxima.responsaveis.length" class="flex items-center gap-2 text-sm text-muted">
            <UAvatarGroup size="xs">
              <UAvatar v-for="id in proxima.responsaveis" :key="id" :text="pessoa(lista, id)?.iniciais" :alt="nomeDe(id)" />
            </UAvatarGroup>
            {{ t.enviar.avisa(proxima.responsaveis.map(nomeDe).join(', ')) }}
          </p>
        </form>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.enviar.cancelar" color="neutral" variant="ghost" @click="enviando = false" />
          <UButton type="submit" form="form-envio" :label="t.enviar.enviar" icon="i-lucide-send" :loading="salvandoEnvio" />
        </div>
      </template>
    </UModal>

    <!-- Pedir reteste -->
    <UModal v-model:open="pedindoReteste" :title="t.reteste.titulo" :description="conferenteDaLista ? t.reteste.texto(nomeDe(conferenteDaLista)) : ''" :ui="{ content: 'max-w-md' }">
      <template #body>
        <UFormField :label="t.reteste.nota">
          <UTextarea v-model="notaReteste" :rows="3" autoresize class="w-full" />
        </UFormField>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.reteste.cancelar" color="neutral" variant="ghost" @click="pedindoReteste = false" />
          <UButton :label="t.reteste.pedir" icon="i-lucide-repeat" color="success" :loading="salvandoReteste" @click="confirmarReteste" />
        </div>
      </template>
    </UModal>

    <!-- Colar uma lista -->
    <UModal v-model:open="colando" :title="t.colar.titulo" :description="t.colar.descricao" :ui="{ content: 'max-w-lg' }">
      <template #body>
        <UTextarea v-model="textoColado" :placeholder="t.colar.placeholder" :rows="6" autoresize autofocus class="w-full font-mono" />
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.colar.cancelar" color="neutral" variant="ghost" @click="colando = false" />
          <UButton :label="t.colar.criar(linhasColadas.length)" icon="i-lucide-list-plus" :disabled="!linhasColadas.length" @click="criarDaLista" />
        </div>
      </template>
    </UModal>
  </div>
</template>
