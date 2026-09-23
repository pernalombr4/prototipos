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
import Anotacoes from './_Anotacoes.vue'
import BarraDoQuadro, { type Filtros, type Periodo } from './_BarraDoQuadro.vue'
import BarraDeSelecao from './_BarraDeSelecao.vue'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import MapaDosSelos from './_MapaDosSelos.vue'
import ModalDeVisualizacao from './_ModalDeVisualizacao.vue'
import ModalNovaTarefa from './_ModalNovaTarefa.vue'
import PainelDaTarefa from './_PainelDaTarefa.vue'
import RaiaDoQuadro from './_RaiaDoQuadro.vue'
import { selosDoPainel } from './selos'
import { estimativaDeTempo, hoje, itensRelacionados, pessoas, registrosDeTempo, tarefas as tarefasMock, usuarioAtual, visualizacoes } from './mocks'
import type { ConfigDaVisualizacao } from './mocks'
import type { OrdemDaRaia } from './_RaiaDoQuadro.vue'
import {
  type Calculo, type ChaveAgrupamento, type ChaveOrdenacao,
  calculoPadrao, camposCalculaveis, compararTarefas, estaAtrasada, formatarCronometro,
  formatarDuracao,
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
  atualizado: '2026-09-22',
  tela: 'Quadro de tarefas rápidas',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME: o seletor de estados não faz parte da proposta. Existe     *
 * para percorrer os cinco estados e comparar com a tela de hoje.      *
 * ------------------------------------------------------------------ */
type Estado = 'cheio' | 'vazio' | 'carregando' | 'erro' | 'leitura' | 'hoje' | 'mapa'
const estado = ref<Estado>('cheio')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'cheio', rotulo: 'Quadro cheio' },
  { valor: 'vazio', rotulo: 'Sem tarefas' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'erro', rotulo: 'Erro' },
  { valor: 'leitura', rotulo: 'Sem permissão' },
  { valor: 'hoje', rotulo: 'Como é hoje' },
  { valor: 'mapa', rotulo: 'Mapa dos selos' },
]

/**
 * ANDAIME: no mapa dos selos o painel abre com uma faixa vazia à esquerda,
 * onde as setas correm. O painel em si é o mesmo, do mesmo tamanho.
 */
const anotando = computed(() => estado.value === 'mapa')

const somenteLeitura = computed(() => estado.value === 'leitura')
const carregando = computed(() => estado.value === 'carregando')

/* ----------------------------- estado da tela ----------------------------- */
const lista = ref<Task[]>([...tarefasMock])
const busca = ref('')
const agrupamento = ref<ChaveAgrupamento>('status')
const ordenacao = ref<ChaveOrdenacao>('due_date')
const ordenacaoDesc = ref(false)
const densidade = ref<'pequeno' | 'medio' | 'grande'>('medio')
const periodo = ref<Periodo>({ modo: 'tudo', de: '', ate: '' })
const campoDeData = ref<'created_at' | 'due_date'>('created_at')
const ocultarVazias = ref(false)
const raiasOcultas = ref<string[]>([])
/** Ordem escolhida à mão. Vazia quer dizer "a ordem natural do agrupamento". */
const ordemDasRaias = ref<string[]>([])
const raiasRecolhidas = ref<string[]>([])
const limites = ref<Record<string, number | null>>({})
const visualizacao = ref('todas')

/* ------------------------------------------------------------------ *
 * CRONÔMETRO                                                          *
 *                                                                     *
 * Como no ClickUp: **um cronômetro por vez** no workspace inteiro.     *
 * Começar noutra tarefa para o anterior e grava o apontamento, em vez  *
 * de deixar dois contando e a pessoa descobrir depois.                 *
 * ------------------------------------------------------------------ */
const cronometro = ref<{ tarefa: number, inicio: number } | null>(null)
const agora = ref(Date.now())
let relogio: ReturnType<typeof setInterval> | null = null

onMounted(() => { relogio = setInterval(() => { agora.value = Date.now() }, 1000) })
onBeforeUnmount(() => { if (relogio) clearInterval(relogio) })

const segundosCorrendo = computed(() =>
  cronometro.value ? Math.floor((agora.value - cronometro.value.inicio) / 1000) : 0)

const tarefaDoCronometro = computed(() =>
  cronometro.value ? lista.value.find(x => x.id === cronometro.value!.tarefa) ?? null : null)

function proximoIdDeRegistro() {
  return Math.max(0, ...registrosDeTempo.map(r => r.id)) + 1
}

function iniciarCronometro(tarefa: Task) {
  if (somenteLeitura.value) return
  if (cronometro.value?.tarefa === tarefa.id) { pararCronometro(); return }
  if (cronometro.value) pararCronometro()
  cronometro.value = { tarefa: tarefa.id, inicio: Date.now() }
}

function pararCronometro() {
  if (!cronometro.value) return
  const segundos = Math.max(60, segundosCorrendo.value)
  registrosDeTempo.push({
    id: proximoIdDeRegistro(),
    tarefa: cronometro.value.tarefa,
    usuario: usuarioAtual.id,
    segundos,
    inicio: new Date(cronometro.value.inicio),
    faturavel: true,
  })
  cronometro.value = null
  toast.add({
    title: t.value.tempo.cronometroParado(formatarDuracao(segundos)),
    icon: 'i-lucide-timer',
    color: 'success',
  })
}

function registrarTempo(dados: { segundos: number, nota: string, etiqueta: string, faturavel: boolean }) {
  if (!tarefaAberta.value) return
  registrosDeTempo.push({
    id: proximoIdDeRegistro(),
    tarefa: tarefaAberta.value.id,
    usuario: usuarioAtual.id,
    segundos: dados.segundos,
    inicio: new Date(),
    nota: dados.nota || undefined,
    etiqueta: dados.etiqueta || undefined,
    faturavel: dados.faturavel,
  })
  toast.add({
    title: t.value.tempo.tempoAdicionado(formatarDuracao(dados.segundos)),
    icon: 'i-lucide-timer',
    color: 'success',
  })
}

function atualizarRegistro(id: number, dados: { segundos: number, inicio: Date, nota: string, etiqueta: string, faturavel: boolean }) {
  const registro = registrosDeTempo.find(r => r.id === id)
  if (!registro) return
  registro.segundos = dados.segundos
  registro.inicio = dados.inicio
  registro.nota = dados.nota || undefined
  registro.etiqueta = dados.etiqueta || undefined
  registro.faturavel = dados.faturavel
  toast.add({ title: t.value.tempo.registroAtualizado, icon: 'i-lucide-timer', color: 'success' })
}

function apagarRegistro(id: number) {
  const i = registrosDeTempo.findIndex(r => r.id === id)
  if (i >= 0) registrosDeTempo.splice(i, 1)
  toast.add({ title: t.value.tempo.registroApagado, icon: 'i-lucide-trash-2', color: 'neutral' })
}

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
  tempo: true,
  // Quem criou não costuma decidir nada no quadro, então nasce desligado.
  criador: false,
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

/* ------------------------------------------------------------------ *
 * SELEÇÃO EM MASSA                                                    *
 *                                                                     *
 * Pesquisa da rodada 24, no PESQUISA.md. ClickUp e monday fazem igual: *
 * caixinha no cartão e uma barra flutuante no pé da tela dizendo       *
 * quantas estão selecionadas. O Jira acrescenta a peça que falta nos   *
 * outros: mudança em massa passa por uma CONFIRMAÇÃO antes de valer.   *
 * O Trello não tem seleção nenhuma, e resolve com "arquivar todos os   *
 * cartões desta lista", que virou aqui o "selecionar as N desta raia". *
 * ------------------------------------------------------------------ */
const selecionadas = ref<number[]>([])
/** A última marcada, que é de onde o Shift conta a faixa. */
const ancoraDaSelecao = ref<number | null>(null)

/** Mover em massa só faz sentido quando a raia é a situação da tarefa. */
const podeMoverEmMassa = computed(() => agrupamento.value === 'status')

function alternarSelecao(tarefa: Task, faixa: boolean) {
  const naRaia = raiasVisiveis.value.find(r => r.tarefas.some(x => x.id === tarefa.id))?.tarefas ?? []
  const ancora = ancoraDaSelecao.value

  // Shift pega daqui até a última marcada, mas só dentro da mesma raia: entre
  // raias não existe "entre", e o que sairia disso ninguém consegue prever.
  if (faixa && ancora !== null && naRaia.some(x => x.id === ancora)) {
    const de = naRaia.findIndex(x => x.id === ancora)
    const ate = naRaia.findIndex(x => x.id === tarefa.id)
    const fatia = naRaia.slice(Math.min(de, ate), Math.max(de, ate) + 1).map(x => x.id)
    selecionadas.value = [...new Set([...selecionadas.value, ...fatia])]
    return
  }

  selecionadas.value = selecionadas.value.includes(tarefa.id)
    ? selecionadas.value.filter(id => id !== tarefa.id)
    : [...selecionadas.value, tarefa.id]
  ancoraDaSelecao.value = tarefa.id
}

function selecionarRaia(valor: string) {
  const raia = raiasVisiveis.value.find(r => r.definicao.valor === valor)
  if (!raia) return
  const ids = raia.tarefas.map(x => x.id)
  const todasJa = ids.every(id => selecionadas.value.includes(id))
  selecionadas.value = todasJa
    ? selecionadas.value.filter(id => !ids.includes(id))
    : [...new Set([...selecionadas.value, ...ids])]
  ancoraDaSelecao.value = null
}

function limparSelecao() {
  selecionadas.value = []
  ancoraDaSelecao.value = null
}

/** Trocar de visualização ou de agrupamento desfaz a seleção: o quadro é outro. */
watch([visualizacao, agrupamento], limparSelecao)

/** As tarefas escolhidas, na ordem em que estão no array. */
const tarefasSelecionadas = computed(() =>
  lista.value.filter(x => selecionadas.value.includes(x.id)))

/**
 * Desfazer de verdade: guarda o estado anterior das tarefas mexidas e devolve.
 * Sem isso, "desfazer" num toast é promessa que a tela não cumpre.
 */
const desfazerEmMassa = ref<(() => void) | null>(null)

function guardarParaDesfazer(tarefas: Task[], mudar: (t: Task) => void) {
  const antes = tarefas.map(t => ({ ...t }))
  tarefas.forEach(mudar)
  desfazerEmMassa.value = () => {
    for (const copia of antes) {
      const alvo = lista.value.find(x => x.id === copia.id)
      if (alvo) Object.assign(alvo, copia)
    }
    desfazerEmMassa.value = null
    toast.add({ title: t.value.selecao.desfeito, icon: 'i-lucide-rotate-ccw', color: 'neutral' })
  }
}

function avisar(titulo: string, icone: string) {
  toast.add({
    title: titulo,
    icon: icone,
    color: 'success',
    actions: desfazerEmMassa.value
      ? [{ label: t.value.selecao.desfazer, color: 'neutral', variant: 'outline', onClick: () => desfazerEmMassa.value?.() }]
      : undefined,
  })
}

function moverSelecionadas(status: string) {
  const alvos = tarefasSelecionadas.value
  const raia = definicoesDeRaia.value.find(d => d.valor === status)
  guardarParaDesfazer(alvos, (x) => { x.status = status as Task['status'] })
  avisar(t.value.selecao.movidas(alvos.length, raia?.rotulo ?? ''), 'i-lucide-corner-down-right')
  limparSelecao()
}

function atribuirSelecionadas(id: number | null) {
  const alvos = tarefasSelecionadas.value
  guardarParaDesfazer(alvos, (x) => { x.assigned_to = id })
  avisar(
    t.value.selecao.atribuidas(alvos.length, id ? pessoas[id]?.fullname ?? '' : t.value.semResponsavel),
    'i-lucide-user',
  )
  limparSelecao()
}

function prioridadeSelecionadas(valor: Task['priority']) {
  const alvos = tarefasSelecionadas.value
  guardarParaDesfazer(alvos, (x) => { x.priority = valor })
  avisar(t.value.selecao.prioridadeMudada(alvos.length), 'i-lucide-flag')
  limparSelecao()
}

/** Prazo em massa, com os mesmos atalhos do formulário de criação. */
function prazoSelecionadas(dias: number | null) {
  const alvos = tarefasSelecionadas.value
  const data = dias === null ? null : new Date(hoje.getTime() + dias * 86_400_000)
  if (data) data.setUTCHours(18, 0, 0, 0)
  guardarParaDesfazer(alvos, (x) => { x.due_date = data })
  avisar(t.value.selecao.prazoMudado(alvos.length), 'i-lucide-calendar-clock')
  limparSelecao()
}

function arquivarSelecionadas() {
  const alvos = tarefasSelecionadas.value
  const quantas = alvos.length
  const copias = alvos.map(x => ({ ...x }))
  lista.value = lista.value.filter(x => !selecionadas.value.includes(x.id))
  desfazerEmMassa.value = () => {
    lista.value = [...lista.value, ...copias]
    desfazerEmMassa.value = null
    toast.add({ title: t.value.selecao.desfeito, icon: 'i-lucide-rotate-ccw', color: 'neutral' })
  }
  avisar(t.value.selecao.arquivadas(quantas), 'i-lucide-archive')
  limparSelecao()
}

function lixeiraSelecionadas() {
  const alvos = tarefasSelecionadas.value
  const quantas = alvos.length
  const copias = alvos.map(x => ({ ...x }))
  lista.value = lista.value.filter(x => !selecionadas.value.includes(x.id))
  desfazerEmMassa.value = () => {
    lista.value = [...lista.value, ...copias]
    desfazerEmMassa.value = null
    toast.add({ title: t.value.selecao.desfeito, icon: 'i-lucide-rotate-ccw', color: 'neutral' })
  }
  avisar(t.value.selecao.naLixeira(quantas), 'i-lucide-trash-2')
  limparSelecao()
}


/* ------------------------------------------------------------------ *
 * A VISUALIZAÇÃO ABERTA, E O QUE FOI MEXIDO DEPOIS                    *
 *                                                                     *
 * Pesquisa da rodada 23, no PESQUISA.md. Os dois modelos do mercado:   *
 *                                                                     *
 *   ClickUp  mexer marca a view como "unsaved changes", e salvar salva *
 *            PARA TODOS que têm acesso. A própria comunidade reclama   *
 *            de mudar a tela dos outros sem querer.                    *
 *   Linear   o que a pessoa mexe vale só para ela e fica; empurrar     *
 *            para o time é um ato separado ("set as default"), e       *
 *            existe o caminho de volta ("reset to default").           *
 *                                                                     *
 * Aqui vale o do Linear, porque no ENSPACE a visualização é            *
 * compartilhada por grupo e função: salvar por cima muda a tela de     *
 * quem mais a usa, e isso não pode ser efeito colateral de arrastar    *
 * uma raia. Quem não é dono da visualização só tem "salvar como nova". *
 * ------------------------------------------------------------------ */
const visualizacaoAberta = computed(() =>
  visualizacoes.find(v => v.id === visualizacao.value) ?? visualizacoes[0]!)

const podeSalvarNaVisualizacao = computed(() =>
  visualizacaoAberta.value.dono === usuarioAtual.id && !somenteLeitura.value)

/** O que é da visualização, e não do momento: a busca não entra. */
function configDoQuadro(): ConfigDaVisualizacao {
  const calculos: Record<string, string> = {}
  for (const [raia, c] of Object.entries(calculoPorRaia.value)) {
    if (c) calculos[raia] = `${c.campo}:${c.operacao}`
  }
  return {
    agrupamento: agrupamento.value,
    ordenacao: ordenacao.value,
    ordenacaoDesc: ordenacaoDesc.value,
    densidade: densidade.value,
    campos: { ...campos.value },
    limites: Object.fromEntries(Object.entries(limites.value).filter(([, n]) => n != null)),
    calculos,
    somenteMinhas: filtros.value.somenteMinhas,
  }
}

/** Duas configurações são iguais quando dizem a mesma coisa, na ordem que for. */
function assinatura(c: ConfigDaVisualizacao): string {
  const mapa = (m: Record<string, unknown>) =>
    Object.keys(m).sort().map(k => `${k}=${m[k]}`).join(',')
  return [
    c.agrupamento, c.ordenacao, c.ordenacaoDesc, c.densidade, c.somenteMinhas,
    mapa(c.campos), mapa(c.limites), mapa(c.calculos),
  ].join('|')
}

const visualizacaoAlterada = computed(() =>
  assinatura(configDoQuadro()) !== assinatura(visualizacaoAberta.value.config))

/** Abrir uma visualização é herdar a configuração dela. */
function aplicarVisualizacao(id: string) {
  const v = visualizacoes.find(x => x.id === id)
  if (!v) return
  const c = v.config
  agrupamento.value = c.agrupamento as ChaveAgrupamento
  ordenacao.value = c.ordenacao as ChaveOrdenacao
  ordenacaoDesc.value = c.ordenacaoDesc
  densidade.value = c.densidade
  campos.value = { ...c.campos }
  limites.value = { ...c.limites }
  filtros.value = { ...filtros.value, somenteMinhas: c.somenteMinhas }
  const calculos: Record<string, Calculo> = {}
  for (const [raia, texto] of Object.entries(c.calculos)) {
    const [campo, operacao] = texto.split(':')
    calculos[raia] = { campo: campo!, operacao: operacao as Calculo['operacao'] }
  }
  calculoPorRaia.value = calculos
  ordenacaoPorRaia.value = {}
  raiasOcultas.value = []
  raiasRecolhidas.value = []
  ordemDasRaias.value = []
}

watch(visualizacao, aplicarVisualizacao)

/** Salvar por cima: vale para todo mundo que abre esta visualização. */
function salvarNaVisualizacao() {
  const v = visualizacoes.find(x => x.id === visualizacao.value)
  if (!v || !podeSalvarNaVisualizacao.value) return
  Object.assign(v.config, configDoQuadro())
  toast.add({
    title: t.value.vis.salvaParaTodos(v.nome),
    icon: 'i-lucide-check',
    color: 'success',
  })
}

function descartarAlteracoes() {
  aplicarVisualizacao(visualizacao.value)
  toast.add({ title: t.value.vis.voltouAoSalvo, icon: 'i-lucide-rotate-ccw', color: 'neutral' })
}


/* ------------------------------------------------------------------ *
 * O formulário da visualização. Ele abre pelo "+ Visualizar" e pelo   *
 * lápis da visualização aberta, e parte do que está no quadro agora.  *
 * ------------------------------------------------------------------ */
const configurandoVisualizacao = ref(false)
const visualizacaoEmEdicao = ref<string | null>(null)

function abrirVisualizacao(id: string | null) {
  visualizacaoEmEdicao.value = id
  configurandoVisualizacao.value = true
}

function salvarVisualizacao() {
  configurandoVisualizacao.value = false
  toast.add({ title: t.value.tarefaSalva, icon: 'i-lucide-check', color: 'success' })
}

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

    // Período: dia único ou intervalo, sobre o campo de data escolhido.
    if (periodo.value.modo !== 'tudo') {
      const data = campoDeData.value === 'created_at' ? tarefa.created_at : tarefa.due_date
      if (!data) return false
      const dia = new Date(data).toISOString().slice(0, 10)
      const de = periodo.value.de
      const ate = periodo.value.modo === 'dia' ? periodo.value.de : periodo.value.ate
      if (de && dia < de) return false
      if (ate && dia > ate) return false
    }

    return true
  })
})

const definicoesBase = computed(() => raiasDoAgrupamento(agrupamento.value, t.value))

/** A ordem da tela: a escolhida à mão quando existe, senão a do agrupamento. */
const definicoesDeRaia = computed(() => {
  if (!ordemDasRaias.value.length) return definicoesBase.value
  const posicao = (valor: string) => {
    const i = ordemDasRaias.value.indexOf(valor)
    return i === -1 ? Number.MAX_SAFE_INTEGER : i
  }
  return [...definicoesBase.value].sort((a, b) => posicao(a.valor) - posicao(b.valor))
})

/**
 * Trocar o agrupamento troca as raias, então a ordem escolhida para as antigas
 * não vale para as novas.
 */
watch(agrupamento, () => { ordemDasRaias.value = [] })

/** Move a raia `valor` para a posição em que `destino` está agora. */
function reordenarRaias(valor: string, destino: string) {
  const lista = definicoesDeRaia.value.map(d => d.valor)
  const origem = lista.indexOf(valor)
  const alvo = lista.indexOf(destino)
  if (origem < 0 || alvo < 0 || origem === alvo) return
  lista.splice(alvo, 0, ...lista.splice(origem, 1))
  ordemDasRaias.value = lista
}

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
  periodo.value = { modo: 'tudo', de: '', ate: '' }
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
  estimativa: number
}) {
  const id = Math.max(...lista.value.map(x => x.id)) + 1
  // A estimativa mora fora da tarefa porque o payload não tem o campo ainda.
  if (dados.estimativa) estimativaDeTempo[id] = dados.estimativa
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
/**
 * ANDAIME: no mapa, clicar no cartão abre o painel já expandido, que é o
 * estado em que as peças apontadas estão todas na tela.
 */
function abrirNoMapa(tarefa: Task) {
  painelExpandido.value = true
  tarefaAberta.value = tarefa
}

function mostrarCartaoCompleto() {
  estado.value = 'cheio'
  densidade.value = 'grande'
  // Liga todos os campos: é o caso de borda pedido na demanda.
  campos.value = Object.fromEntries(Object.keys(campos.value).map(k => [k, true]))
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
      :alterada="visualizacaoAlterada"
      :pode-salvar="podeSalvarNaVisualizacao"
      @nova-tarefa="abrirCriacao()"
      @limpar="limparFiltros"
      @reordenar-raias="reordenarRaias"
      @ordem-padrao="ordemDasRaias = []"
      @configurar-visualizacao="abrirVisualizacao"
      @salvar-visualizacao="salvarNaVisualizacao"
      @descartar-visualizacao="descartarAlteracoes"
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

      <!-- ANDAIME: o mapa dos selos, com balão e seta em cada peça -->
      <MapaDosSelos
        v-else-if="estado === 'mapa'"
        :tarefas="lista"
        :t="t"
        @abrir="abrirNoMapa"
      />

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
          :selecionadas="selecionadas"
          :tarefa-do-cronometro="cronometro?.tarefa ?? null"
          :segundos-correndo="segundosCorrendo"
          :carregando="carregando"
          :atraso="i * 60"
          @recolher="alternarRecolhida(raia.definicao.valor)"
          @ocultar="raiasOcultas = [...raiasOcultas, raia.definicao.valor]"
          @nova-tarefa="abrirCriacao(raia.definicao.valor)"
          @calculo="(c) => calculoPorRaia = { ...calculoPorRaia, [raia.definicao.valor]: c }"
          @ordenacao="(o) => ordenacaoPorRaia = { ...ordenacaoPorRaia, [raia.definicao.valor]: o }"
          @limite="(n) => limites = { ...limites, [raia.definicao.valor]: n }"
          @soltar="(id) => soltarNaRaia(raia.definicao.valor, id)"
          @reordenar="(valor) => reordenarRaias(valor, raia.definicao.valor)"
          @abrir="abrir"
          @mover="mover"
          @arquivar="arquivar"
          @cronometrar="iniciarCronometro"
          @selecionar="alternarSelecao"
          @selecionar-raia="selecionarRaia(raia.definicao.valor)"
        />
      </div>
      </main>
    </CascaDoEnspace>

    <!-- O cartão aberto -->
    <USlideover
      v-model:open="painelAberto"
      :ui="{ content: anotando
        ? 'max-w-[80rem] transition-[max-width] duration-200'
        : painelExpandido ? 'max-w-[61rem] transition-[max-width] duration-200' : 'max-w-[43.75rem] transition-[max-width] duration-200' }"
    >
      <template #content>
        <!--
          ANDAIME: a faixa vazia à esquerda é só onde as setas correm. O painel
          continua do mesmo tamanho e com as mesmas peças.
        -->
        <Anotacoes
          v-if="anotando && tarefaAberta"
          :selos="selosDoPainel"
          apenas-esquerda
          :largura="230"
          :folga="40"
          :refazer="`${tarefaAberta.id}-${painelExpandido}`"
          class="h-full min-h-0 flex-1"
        >
          <PainelDaTarefa
            :tarefa="tarefaAberta"
            :t="t"
            :somente-leitura="somenteLeitura"
            :expandido="painelExpandido"
            :cronometro-ativo="cronometro?.tarefa === tarefaAberta.id"
            :segundos-correndo="segundosCorrendo"
            @fechar="tarefaAberta = null"
            @expandir="(v) => painelExpandido = v"
            @salvar="toast.add({ title: t.tarefaSalva, icon: 'i-lucide-check', color: 'success' })"
            @concluir="concluir"
            @reabrir="reabrir"
            @copiar-referencia="copiarReferencia"
            @atualizar="atualizarCampo"
            @iniciar-cronometro="iniciarCronometro(tarefaAberta)"
            @parar-cronometro="pararCronometro"
            @registrar-tempo="registrarTempo"
            @atualizar-registro="atualizarRegistro"
            @apagar-registro="apagarRegistro"
          />
        </Anotacoes>

        <PainelDaTarefa
          v-else-if="tarefaAberta"
          :tarefa="tarefaAberta"
          :t="t"
          :somente-leitura="somenteLeitura"
          :expandido="painelExpandido"
          :cronometro-ativo="cronometro?.tarefa === tarefaAberta.id"
          :segundos-correndo="segundosCorrendo"
          @fechar="tarefaAberta = null"
          @expandir="(v) => painelExpandido = v"
          @salvar="toast.add({ title: t.tarefaSalva, icon: 'i-lucide-check', color: 'success' })"
          @concluir="concluir"
          @reabrir="reabrir"
          @copiar-referencia="copiarReferencia"
          @atualizar="atualizarCampo"
          @iniciar-cronometro="iniciarCronometro(tarefaAberta)"
          @parar-cronometro="pararCronometro"
          @registrar-tempo="registrarTempo"
          @atualizar-registro="atualizarRegistro"
          @apagar-registro="apagarRegistro"
        />
      </template>
    </USlideover>

    <!-- O formulário da visualização, com o que a proposta criou -->
    <ModalDeVisualizacao
      v-model:open="configurandoVisualizacao"
      :t="t"
      :editando="visualizacaoEmEdicao"
      :campos-do-totalizador="camposDoTotalizador"
      :do-quadro="{
        agrupamento,
        ordenacao,
        ordenacaoDesc,
        densidade,
        campos,
        raias: definicoesDeRaia.map(d => ({ valor: d.valor, rotulo: d.rotulo })),
        limites,
        calculos: calculoPorRaia,
      }"
      @fechar="configurandoVisualizacao = false"
      @salvar="salvarVisualizacao"
    />

    <!-- Nova tarefa: os campos do produto, com o acabamento refeito -->
    <ModalNovaTarefa
      v-model:open="criando"
      :t="t"
      :raia="nomeDaRaiaDaCriacao"
      @criar="criar"
      @fechar="criando = false"
    />

    <!--
      O cronômetro rodando precisa de um lugar fixo, senão a pessoa esquece que
      está contando. No ClickUp é um widget no canto inferior direito, e é o
      que está aqui. No produto ele provavelmente moraria na barra do topo, e
      essa é uma decisão da Mikaela, não minha: está no DECISOES.md.
    -->
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="cronometro && tarefaDoCronometro"
        class="fixed bottom-28 right-6 z-40 flex max-w-sm items-center gap-3 rounded-xl border border-error/40 bg-default px-3 py-2 shadow-lg"
      >
        <span class="relative flex size-2.5 shrink-0">
          <span class="absolute inline-flex size-full animate-ping rounded-full bg-error opacity-60" />
          <span class="relative inline-flex size-2.5 rounded-full bg-error" />
        </span>
        <div class="min-w-0">
          <p class="text-xs text-muted">{{ t.tempo.rodando }}</p>
          <p class="truncate text-sm font-medium text-highlighted">{{ tarefaDoCronometro.name }}</p>
        </div>
        <span class="shrink-0 text-lg font-semibold tabular-nums text-error">
          {{ formatarCronometro(segundosCorrendo) }}
        </span>
        <UButton
          icon="i-lucide-square"
          color="error"
          variant="soft"
          size="sm"
          :aria-label="t.tempo.parar"
          @click="pararCronometro"
        />
      </div>
    </Transition>

    <!-- A barra da seleção em massa -->
    <BarraDeSelecao
      :t="t"
      :quantas="selecionadas.length"
      :raias="definicoesDeRaia.map(d => ({ valor: d.valor, rotulo: d.rotulo }))"
      :pode-mover="podeMoverEmMassa"
      @limpar="limparSelecao"
      @mover="moverSelecionadas"
      @atribuir="atribuirSelecionadas"
      @prioridade="prioridadeSelecionadas"
      @prazo="prazoSelecionadas"
      @arquivar="arquivarSelecionadas"
      @lixeira="lixeiraSelecionadas"
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
