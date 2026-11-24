<script setup lang="ts">
/**
 * Home do workspace, montada em widgets.
 *
 * A proposta (rodadas 1 e 2):
 * - a Home é uma grade de widgets que a pessoa arruma: arrasta pelo título,
 *   puxa o canto, remove, adiciona do catálogo. A mesma grade do Painel de
 *   tarefas (`UxGradeDePaineis`), para o ENSPACE ter um gesto só;
 * - "Personalizar" põe a própria Home em edição (rodada 4): barra no alto,
 *   alça, Subir, Descer e Remover em cada widget (o caminho sem arraste), e o
 *   painel lateral só com o catálogo;
 * - o administrador monta a Home padrão do workspace; quem não personalizou
 *   recebe ela inteira, e quem personalizou recebe só o widget novo, com o
 *   selo "Novo" (HubSpot e Notion);
 * - criar: um botão "Criar" no topo da Home (tecla C), que ramifica em Item
 *   (categoria, depois formulário) e Tarefa (rápida ou agendada), e "Pedir ao
 *   BENI". O menu lateral fica como o develop (rodada 2);
 * - widget "Categorias": acessar a categoria ou criar nela pelo "+";
 * - cada widget carrega, falha e fica sem acesso sozinho.
 *
 * Rodada 5, a partir da Home de develop (en-space@develop be2a5d850,
 * `src/utils/workspaceHome.ts`), que já traz as lâminas do Painel de tarefas:
 * - cada lâmina é um widget (números, Vencidas, Vencem em breve, status,
 *   prioridade, carga, atividade, saúde dos prazos, entrada e saída), e todas
 *   seguem o "Minhas tarefas · Workspace" do topo, como em develop;
 * - o catálogo vira árvore: Tarefas > a lâmina; Categorias > quais e em que
 *   ordem;
 * - saem os widgets de visualização salva (itens e número);
 * - 2 estados de partida: o workspace que acabou de nascer (os widgets da
 *   Home padrão no lugar, sem dado) e o workspace configurado.
 *
 * O dado é o `mocks.ts`; o catálogo e a Home padrão, o `widgets.ts`. Tudo em
 * memória: o reload volta ao começo.
 */
import type { ItemDaGrade, LimitesDoPainel } from '~/components/ux/UxGradeDePaineis.vue'
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import CascaDaHome from './_CascaDaHome.vue'
import ConfigurarWidget from './_ConfigurarWidget.vue'
import BotaoCriar from './_BotaoCriar.vue'
import ModalNovaTarefa from './_ModalNovaTarefa.vue'
import ModalNovoItem from './_ModalNovoItem.vue'
import type { DadosDoItem } from './_ModalNovoItem.vue'
import Catalogo from './_Catalogo.vue'
import WidgetMoldura from './_Widget.vue'
import type { EstadoDoWidget } from './_Widget.vue'
import WCategorias from './_WCategorias.vue'
import WListas from './_WListas.vue'
import WMinhasTarefas from './_WMinhasTarefas.vue'
import WLamina from './_WLamina.vue'
import WOutros from './_WOutros.vue'
import type { Atalho, Categoria, DiaDeTarefas, Evento, Item, Recente, TarefaDaHome } from './mocks'
import {
  AGORA, DIA, EU, HORA, atalhosIniciais, categoria, categorias as categoriasIniciais, comunicadoInicial, eventosDeHoje,
  itensIniciais, notaInicial, painelDeCompras, recentes as recentesIniciais, resumoDoBeni, serieDasTarefas, tarefasIniciais,
} from './mocks'
import type { AbaDeTarefa } from './formatar'
import { HOJE, abaDa, dataLonga, horaAtual } from './formatar'
import type { ConfigDoWidget, LaminaDeTarefas, TipoDeWidget, Widget } from './widgets'
import { LAMINAS, PADRAO_LAYOUT, PADRAO_WIDGETS, definicao } from './widgets'
import { textos } from './textos'

definePageMeta({
  titulo: 'Home',
  descricao: 'Home do workspace em widgets que cada pessoa arruma (as lâminas do Painel de tarefas, categorias na ordem escolhida, atalhos, recentes, comunicado), catálogo em árvore, Home padrão montada pelo administrador e um botão Criar que ramifica em item e tarefa.',
  status: 'em-revisao',
  atualizado: '2026-11-24',
  tela: 'Início',
})

const t = useTextos(textos)
const toast = useToast()
const SLUG = 'operacoes-lumina'

/* ------------------------------------------------------------------ *
 * ANDAIME: estado e papel. Não é proposta.                             *
 * ------------------------------------------------------------------ */

type EstadoDaHome = 'workspaceVazio' | 'configurado' | 'carregando' | 'vazio' | 'erro' | 'semAcesso'
const estado = ref<EstadoDaHome>('configurado')
const papel = ref<'membro' | 'admin'>('admin')
const estados: { valor: EstadoDaHome, rotulo: string }[] = [
  { valor: 'workspaceVazio', rotulo: 'Workspace vazio (primeiro acesso)' },
  { valor: 'configurado', rotulo: 'Workspace configurado' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'vazio', rotulo: 'Sem widgets' },
  { valor: 'erro', rotulo: 'Erro num widget' },
  { valor: 'semAcesso', rotulo: 'Sem acesso num widget' },
]
const admin = computed(() => papel.value === 'admin')

/* ------------------------------------------------------------------ *
 * Dado em memória                                                      *
 * ------------------------------------------------------------------ */

const tarefas = ref<TarefaDaHome[]>([])
const itens = ref<Item[]>([])
const categorias = ref<Categoria[]>([])
const recentes = ref<Recente[]>([])
const eventos = ref<Evento[]>([])
const series = ref<{ minhas: DiaDeTarefas[], workspace: DiaDeTarefas[] }>({ minhas: [], workspace: [] })
const atalhos = ref<Atalho[]>([])
const nota = ref('')
const comunicado = ref<typeof comunicadoInicial | null>(null)
const beni = ref<{ linhas: { icone: string, texto: string }[] }>({ linhas: [] })
const recemCriados = ref<number[]>([])

/**
 * Andaime. O workspace que acabou de nascer não tem tarefa, item, categoria,
 * atalho nem comunicado, e a série das 4 semanas é toda zero; o configurado
 * é o mocks.ts inteiro.
 */
function carregarDados(vazio: boolean) {
  const zerar = (d: DiaDeTarefas[]) => d.map(x => ({ ...x, criadas: 0, concluidas: 0 }))
  tarefas.value = vazio ? [] : tarefasIniciais.map(x => ({ ...x }))
  itens.value = vazio ? [] : itensIniciais.map(x => ({ ...x }))
  categorias.value = vazio ? [] : [...categoriasIniciais]
  recentes.value = vazio ? [] : [...recentesIniciais]
  eventos.value = vazio ? [] : [...eventosDeHoje]
  series.value = vazio ? { minhas: zerar(serieDasTarefas.minhas), workspace: zerar(serieDasTarefas.workspace) } : { ...serieDasTarefas }
  atalhos.value = vazio ? [] : [...atalhosIniciais]
  nota.value = vazio ? '' : notaInicial
  comunicado.value = vazio ? null : { ...comunicadoInicial }
  beni.value = vazio ? { linhas: [] } : resumoDoBeni
  recemCriados.value = []
}
carregarDados(false)

/**
 * PROPOSTA: de quem são as tarefas das lâminas. A Home de develop já tem o
 * alternador (`workspaceHome.ts`, guardado no navegador); aqui ele vale para
 * todas as lâminas de uma vez. Minhas tarefas = as atribuídas a mim.
 */
const escopoDasTarefas = ref<'minhas' | 'workspace'>('minhas')
const opcoesDoEscopoDasTarefas = computed(() => [
  { label: t.value.escopoDeTarefas.minhas, value: 'minhas', icon: 'i-lucide-user' },
  { label: t.value.escopoDeTarefas.workspace, value: 'workspace', icon: 'i-lucide-users' },
])
const tarefasDoEscopo = computed(() => escopoDasTarefas.value === 'minhas' ? tarefas.value.filter(x => x.assigned_to === EU.id) : tarefas.value)
const serieDoEscopo = computed(() => series.value[escopoDasTarefas.value])

interface Home { widgets: Widget[], layout: ItemDaGrade[] }
const copiaDaHome = (h: Home): Home => ({ widgets: h.widgets.map(w => ({ ...w, config: { ...w.config } })), layout: h.layout.map(x => ({ ...x })) })

const padrao = ref<Home>(copiaDaHome({ widgets: PADRAO_WIDGETS, layout: PADRAO_LAYOUT }))
const minha = ref<Home>(copiaDaHome(padrao.value))

/** O administrador escolhe no Personalizar qual Home está editando. */
const escopo = ref<'minha' | 'padrao'>('minha')
watch(papel, (p) => { if (p === 'membro') escopo.value = 'minha' })
const home = computed(() => escopo.value === 'padrao' ? padrao.value : minha.value)

const layout = computed({
  get: () => home.value.layout,
  set: (l) => { home.value.layout = l },
})

function widgetPorId(id: string) {
  return home.value.widgets.find(w => w.id === id)
}

/* ------------------------------------------------------------------ *
 * Topo                                                                 *
 * ------------------------------------------------------------------ */

const minhasAbertas = computed(() => tarefas.value.filter(x => x.assigned_to === EU.id && x.status !== 'completed'))
const resumo = computed(() => {
  const abas = minhasAbertas.value.map(abaDa)
  return t.value.resumoDoDia(abas.filter(a => a === 'atraso').length, abas.filter(a => a === 'hoje').length)
})

/* ------------------------------------------------------------------ *
 * O que se cria                                                        *
 * ------------------------------------------------------------------ */

const categoriasComAcesso = computed(() => categorias.value.filter(c => c.acesso))

/** Itens em aberto por categoria, para o widget Categorias. */
const abertosPorCategoria = computed(() => {
  const r: Record<string, number> = {}
  for (const i of itens.value) if (i.status !== 'concluido') r[i.categoria] = (r[i.categoria] ?? 0) + 1
  return r
})

/** Itens em aberto que a pessoa acessa: o "Item relacionado" da tarefa agendada. */
const itensAbertos = computed(() => itens.value.filter(i => i.status !== 'concluido' && categoria(i.categoria)?.acesso))

const menuCriarAberto = ref(false)
const tarefaAberta = ref(false)
const tipoDeTarefa = ref<'rapida' | 'agendada'>('rapida')
const novoItemAberto = ref(false)
const itemEmCriacao = ref<{ categoria: string, formulario?: string }>({ categoria: '' })

function abrirItem(slug: string, formulario?: string) {
  itemEmCriacao.value = { categoria: slug, formulario }
  novoItemAberto.value = true
}

function abrirTarefa(tipo: 'rapida' | 'agendada') {
  tipoDeTarefa.value = tipo
  tarefaAberta.value = true
}

/** MAQUETE: no produto, abre o chat do BENI AI com o texto. */
function pedirAoBeni(texto: string) {
  toast.add({ title: t.value.criar.beniToast(texto), description: t.value.criar.beniDica, icon: 'i-lucide-sparkles', color: 'neutral' })
}

const algumaCamadaAberta = computed(() => tarefaAberta.value || novoItemAberto.value || configAberto.value || editando.value)

/* Tecla C: abre o Criar fora de campo de texto (o defineShortcuts ignora campo por padrão). */
defineShortcuts({
  c: () => {
    if (!algumaCamadaAberta.value) menuCriarAberto.value = true
  },
})

let proximaTarefa = 13300
function criarTarefa(dados: Pick<TarefaDaHome, 'name' | 'due_date' | 'assigned_to' | 'priority' | 'origem' | 'item'>) {
  proximaTarefa += 3
  const nova: TarefaDaHome = { id: proximaTarefa, reference: `#${proximaTarefa}`, status: 'pending', creator: EU.id, ...dados }
  tarefas.value = [...tarefas.value, nova]
  toast.add({
    title: t.value.novaTarefa.criada(nova.reference),
    icon: 'i-lucide-circle-check',
    color: 'success',
    actions: [{ label: t.value.novaTarefa.abrir, color: 'neutral', variant: 'outline', onClick: () => abrirMaquete(nova.name) }],
  })
}

/** "Adicionar tarefa" no pé de Minhas tarefas: o prazo vem da aba. */
function criarTarefaNaAba(nome: string, aba: AbaDeTarefa) {
  const due = aba === 'semPrazo' ? null : new Date(HOJE + (aba === 'proximas' ? DIA : 0) + 18 * HORA)
  criarTarefa({ name: nome, due_date: due, assigned_to: EU.id, priority: 'normal', origem: 'rapida' })
}

let proximoItem = 23400
function criarItem(dados: DadosDoItem) {
  proximoItem += 7
  const c = categoria(itemEmCriacao.value.categoria)
  const novo: Item = {
    id: proximoItem, reference: `#${proximoItem}`, categoria: itemEmCriacao.value.categoria, titulo: dados.titulo,
    status: 'aberto', etapa: 'Triagem', responsavel: dados.responsavel, valor: dados.valor, prazo: dados.prazo,
    urgente: dados.urgente, criadoEm: AGORA.getTime() + (proximoItem - 23400) * 1000,
  }
  itens.value = [...itens.value, novo]
  recemCriados.value = [...recemCriados.value, novo.id]
  toast.add({
    title: t.value.novoItem.criado(novo.reference, c?.name ?? ''),
    icon: 'i-lucide-circle-check',
    color: 'success',
    actions: [{ label: t.value.novaTarefa.abrir, color: 'neutral', variant: 'outline', onClick: () => abrirMaquete(novo.titulo) }],
  })
}

function concluirTarefa(id: number) {
  const x = tarefas.value.find(y => y.id === id)
  if (!x) return
  const antes = x.status
  x.status = 'completed'
  toast.add({
    title: t.value.tarefas.concluida,
    description: x.name,
    icon: 'i-lucide-circle-check',
    actions: [{ label: t.value.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { x.status = antes } }],
  })
}

/** Comunicado: editar o que existe ou escrever o primeiro (workspace novo). */
function salvarComunicado(texto: string) {
  comunicado.value = { titulo: comunicado.value?.titulo ?? t.value.widgets.comunicado.titulo, texto, autor: EU.nome, ha: 0 }
}

function abrirMaquete(destino: string) {
  toast.add({ title: t.value.toasts.abrirMaquete(destino), icon: 'i-lucide-square-arrow-out-up-right', color: 'neutral' })
}

/* ------------------------------------------------------------------ *
 * Widgets                                                              *
 * ------------------------------------------------------------------ */

function tituloDo(w: Widget) {
  return t.value.widgets[w.tipo].titulo
}

/** As categorias do widget, na ordem escolhida. Sem escolha, todas as que a pessoa acessa. */
function categoriasDo(w: Widget) {
  const escolhidas = w.config.categorias ?? []
  if (!escolhidas.length) return categoriasComAcesso.value
  return escolhidas.map(s => categoriasComAcesso.value.find(c => c.slug === s)).filter((c): c is Categoria => !!c)
}

function subtituloDo(w: Widget) {
  if (estadoDo(w) !== 'ok') return undefined
  const daLamina = t.value.laminas.subtitulos[w.tipo]
  if (daLamina) return daLamina
  if (w.tipo === 'agenda') return dataLonga(AGORA, t.value)
  if (w.tipo === 'graficoDePainel') return painelDeCompras.tela
  return undefined
}

const ehLamina = (w: Widget) => (LAMINAS as readonly TipoDeWidget[]).includes(w.tipo)

/**
 * Andaime: quem leva o estado. Erro: a primeira lista ou gráfico de tarefas.
 * Sem acesso: o gráfico de um painel, cuja tela a pessoa pode não acessar.
 */
const alvoDoErro = computed(() => layout.value.find((x) => {
  const w = widgetPorId(x.id)
  return !!w && ['listas', 'graficos'].includes(definicao(w.tipo).secao ?? '')
})?.id)
const alvoDoSemAcesso = computed(() => home.value.widgets.find(w => w.tipo === 'graficoDePainel')?.id)
const recuperando = ref<string[]>([])
const recuperados = ref<string[]>([])
watch(estado, () => { recuperados.value = [] })

/**
 * Andaime. Os 2 de partida mostram a Home padrão do workspace, sem nada
 * personalizado: "Workspace vazio" sem dado nenhum, "Workspace configurado"
 * com o mocks.ts inteiro. Os outros partem do configurado.
 */
function escolherEstado(e: EstadoDaHome) {
  sairDaEdicao()
  carregarDados(e === 'workspaceVazio')
  if (e === 'workspaceVazio' || e === 'configurado') minha.value = copiaDaHome(padrao.value)
  estado.value = e
}

function estadoDo(w: Widget): EstadoDoWidget {
  if (estado.value === 'carregando' || recuperando.value.includes(w.id)) return 'carregando'
  if (recuperados.value.includes(w.id)) return 'ok'
  if (estado.value === 'erro' && w.id === alvoDoErro.value) return 'erro'
  if (estado.value === 'semAcesso' && w.id === alvoDoSemAcesso.value) return 'semAcesso'
  return 'ok'
}

function categoriaSemAcessoDo(w: Widget) {
  return w.id === alvoDoSemAcesso.value ? painelDeCompras.tela : undefined
}

function tentarDeNovo(id: string) {
  recuperando.value = [...recuperando.value, id]
  setTimeout(() => {
    recuperando.value = recuperando.value.filter(x => x !== id)
    recuperados.value = [...recuperados.value, id]
  }, 900)
}

const limites = computed<Record<string, LimitesDoPainel>>(() => Object.fromEntries(home.value.widgets.map(w => [w.id, definicao(w.tipo).limites])))
const rotulos = computed(() => Object.fromEntries(home.value.widgets.map(w => [w.id, tituloDo(w)])))
const textosDaGrade = computed(() => ({ redimensionar: t.value.widget.redimensionar, movido: t.value.widget.movido, tamanho: t.value.widget.tamanho }))

const tiposNaHome = computed(() => home.value.widgets.map(w => w.tipo))

/* Adicionar, remover, mover */

let contador = 0
function adicionar(tipo: TipoDeWidget, config: ConfigDoWidget = tipo === 'categorias' ? { categorias: [] } : {}) {
  const d = definicao(tipo)
  contador++
  const id = `w-${tipo}-${contador}`
  const novo: Widget = { id, tipo, config }
  // Entra no topo, depois de Categorias, para a pessoa ver onde caiu.
  const posicao = layout.value[0] && widgetPorId(layout.value[0].id)?.tipo === 'categorias' ? 1 : 0
  home.value.widgets = [...home.value.widgets, novo]
  const l = [...layout.value]
  l.splice(posicao, 0, { id, w: d.tamanho.w, h: d.tamanho.h })
  layout.value = l

  // Na Home padrão: chega também a quem já personalizou, com o selo "Novo".
  if (escopo.value === 'padrao') {
    minha.value.widgets = [...minha.value.widgets, { ...novo, config: { ...config }, novo: true }]
    const m = [...minha.value.layout]
    m.splice(posicao, 0, { id, w: d.tamanho.w, h: d.tamanho.h })
    minha.value.layout = m
  }

  toast.add({ title: t.value.toasts.adicionado(tituloDo(novo)), icon: 'i-lucide-plus' })
}

/** O botão do 2º nível de Categorias no catálogo: adiciona o widget ou salva a escolha no que já está na Home. */
const widgetDeCategorias = computed(() => home.value.widgets.find(w => w.tipo === 'categorias'))
function aplicarCategorias(escolhidas: string[]) {
  const w = widgetDeCategorias.value
  if (!w) return adicionar('categorias', { categorias: escolhidas })
  w.config = { ...w.config, categorias: escolhidas }
  toast.add({ title: t.value.personalizacao.salva, description: tituloDo(w), icon: 'i-lucide-circle-check', color: 'success' })
}

function remover(id: string) {
  const w = widgetPorId(id)
  if (!w) return
  const anterior = copiaDaHome(home.value)
  const alvo = home.value
  alvo.widgets = alvo.widgets.filter(x => x.id !== id)
  alvo.layout = alvo.layout.filter(x => x.id !== id)
  toast.add({
    title: t.value.toasts.removido(tituloDo(w)),
    icon: 'i-lucide-eye-off',
    actions: [{ label: t.value.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { alvo.widgets = anterior.widgets; alvo.layout = anterior.layout } }],
  })
}

function mover(id: string, passo: -1 | 1) {
  const l = [...layout.value]
  const i = l.findIndex(x => x.id === id)
  const j = i + passo
  if (i < 0 || j < 0 || j >= l.length) return
  ;[l[i], l[j]] = [l[j]!, l[i]!]
  layout.value = l
}

function tamanhoPadrao(id: string) {
  const w = widgetPorId(id)
  if (!w) return
  const d = definicao(w.tipo)
  layout.value = layout.value.map(x => x.id === id ? { ...x, w: d.tamanho.w, h: d.tamanho.h } : x)
}

function restaurar() {
  const anterior = copiaDaHome(minha.value)
  minha.value = copiaDaHome(padrao.value)
  toast.add({
    title: t.value.toasts.restaurada,
    icon: 'i-lucide-rotate-ccw',
    actions: [{ label: t.value.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { minha.value = anterior } }],
  })
}

/* Personalizar: edição na própria Home (rodada 4) */

const editando = ref(false)
const catalogoAberto = ref(false)
let antesDaEdicao: { minha: Home, padrao: Home } | null = null

function entrarNaEdicao(abrirCatalogo = false) {
  if (!editando.value) {
    antesDaEdicao = { minha: copiaDaHome(minha.value), padrao: copiaDaHome(padrao.value) }
    editando.value = true
  }
  catalogoAberto.value = abrirCatalogo
}

function sairDaEdicao() {
  editando.value = false
  catalogoAberto.value = false
  escopo.value = 'minha'
  antesDaEdicao = null
}

/** Cancelar volta as 2 Homes ao que eram ao clicar em Personalizar. */
function cancelarEdicao() {
  if (antesDaEdicao) {
    minha.value = antesDaEdicao.minha
    padrao.value = antesDaEdicao.padrao
  }
  sairDaEdicao()
}

function concluirEdicao() {
  const padraoEditado = escopo.value === 'padrao'
  sairDaEdicao()
  toast.add({ title: padraoEditado ? t.value.toasts.padraoSalvo : t.value.personalizacao.salva, icon: 'i-lucide-circle-check', color: 'success' })
}

const opcoesDeEscopo = computed(() => [
  { label: t.value.personalizacao.minha, value: 'minha', icon: 'i-lucide-user' },
  { label: t.value.personalizacao.padrao, value: 'padrao', icon: 'i-lucide-users' },
])

const posicao = (id: string) => layout.value.findIndex(x => x.id === id)

/* Configurar */

const configAberto = ref(false)
const configId = ref('')
const widgetEmConfig = computed(() => widgetPorId(configId.value))

function abrirConfig(id: string) {
  const w = widgetPorId(id)
  if (!w) return
  if (!configuravel(w)) return
  configId.value = id
  catalogoAberto.value = false
  configAberto.value = true
}

function salvarConfig(config: ConfigDoWidget, novosAtalhos?: Atalho[]) {
  const w = widgetEmConfig.value
  if (!w) return
  w.config = config
  if (novosAtalhos) atalhos.value = novosAtalhos
}

function configuravel(w: Widget) {
  return ['categorias', 'atalhos'].includes(w.tipo)
}
</script>

<template>
  <CascaDaHome :t="t" :slug="SLUG">
    <div class="min-h-0 flex-1 overflow-y-auto pb-28">
      <!-- PROPOSTA: a barra de edição (rodada 4). Fica no topo enquanto a pessoa rola. -->
      <div
        v-if="editando"
        class="sticky top-0 z-30 flex animate-[entrada_0.2s_ease-out_both] flex-wrap items-center gap-x-4 gap-y-2 border-b border-default bg-default/95 px-4 py-2.5 backdrop-blur sm:px-6 lg:px-8 2xl:px-10"
      >
        <div class="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
            <UIcon name="i-lucide-layout-dashboard" class="size-4 text-primary" />
          </span>
          <div class="min-w-0 flex-1 sm:flex-none">
            <p class="text-sm font-semibold text-highlighted">
              {{ t.personalizacao.titulo }}
            </p>
            <p class="truncate text-xs text-muted">
              {{ t.personalizacao.descricao }}
            </p>
          </div>
          <USelect
            v-if="admin"
            v-model="escopo"
            :items="opcoesDeEscopo"
            :icon="escopo === 'padrao' ? 'i-lucide-users' : 'i-lucide-user'"
            size="sm"
            class="w-full shrink-0 sm:w-60"
            :aria-label="t.personalizacao.editando"
          />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <UButton :label="t.estados.adicionarWidget" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="catalogoAberto = true" />
          <UButton v-if="escopo === 'minha'" :label="t.personalizacao.restaurar" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" size="sm" @click="restaurar" />
          <UButton :label="t.personalizacao.cancelar" color="neutral" variant="outline" size="sm" @click="cancelarEdicao" />
          <UButton :label="t.personalizacao.concluir" icon="i-lucide-check" size="sm" @click="concluirEdicao" />
        </div>
      </div>

      <div class="w-full px-4 py-5 sm:px-6 lg:px-8 2xl:px-10">
        <!-- Aviso da Home padrão (administrador editando) -->
        <UAlert
          v-if="editando && escopo === 'padrao'"
          :title="t.bannerPadrao.titulo"
          :description="t.bannerPadrao.texto"
          icon="i-lucide-users"
          color="primary"
          variant="subtle"
          class="mb-4 animate-[entrada_0.3s_ease-out_both]"
        />

        <!-- Topo: saudação, dia, resumo e Personalizar -->
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-medium text-muted">
              {{ dataLonga(AGORA, t) }}
            </p>
            <h1 class="text-2xl font-semibold text-highlighted">
              {{ t.saudacao(horaAtual(), EU.nome.split(' ')[0] ?? '') }}
            </h1>
            <p class="mt-0.5 text-sm text-toned">
              {{ resumo }}
            </p>
          </div>
          <div v-if="!editando" class="flex flex-wrap items-center gap-2">
            <!-- PROPOSTA: o escopo das lâminas de tarefas, como em develop (rodada 5) -->
            <UTabs
              v-model="escopoDasTarefas"
              :items="opcoesDoEscopoDasTarefas"
              :content="false"
              size="xs"
              :aria-label="t.escopoDeTarefas.rotulo"
            />
            <UButton
              :label="t.personalizar"
              icon="i-lucide-layout-dashboard"
              color="neutral"
              variant="outline"
              size="sm"
              @click="entrarNaEdicao()"
            />
            <!-- PROPOSTA: o botão Criar (rodada 2) -->
            <BotaoCriar
              v-model:open="menuCriarAberto"
              :t="t"
              :categorias="categoriasComAcesso"
              @item="abrirItem"
              @tarefa="abrirTarefa"
              @beni="pedirAoBeni"
            />
          </div>
        </div>

        <UEmpty
          v-if="estado === 'vazio' || !layout.length"
          icon="i-lucide-layout-dashboard"
          :title="t.estados.vazioTitulo"
          :description="t.estados.vazioTexto"
          :actions="[{ label: t.estados.adicionarWidget, icon: 'i-lucide-plus', color: 'neutral', variant: 'outline', onClick: () => entrarNaEdicao(true) }]"
          variant="outline"
          class="py-16"
        />

        <UxGradeDePaineis
          v-else
          v-model="layout"
          :editavel="editando"
          :limites="limites"
          :rotulos="rotulos"
          :textos="textosDaGrade"
        >
          <template #default="{ item }">
            <template v-for="w in [widgetPorId(item.id)]" :key="item.id">
              <WidgetMoldura
                v-if="w"
                :t="t"
                :titulo="tituloDo(w)"
                :subtitulo="subtituloDo(w)"
                :icone="definicao(w.tipo).icone"
                :estado="estadoDo(w)"
                :categoria-sem-acesso="categoriaSemAcessoDo(w)"
                :configuravel="configuravel(w)"
                :novo="w.novo && escopo === 'minha'"
                :editando="editando"
                :primeiro="posicao(w.id) === 0"
                :ultimo="posicao(w.id) === layout.length - 1"
                @subir="mover(w.id, -1)"
                @descer="mover(w.id, 1)"
                @configurar="abrirConfig(w.id)"
                @tamanho-padrao="tamanhoPadrao(w.id)"
                @remover="remover(w.id)"
                @tentar-de-novo="tentarDeNovo(w.id)"
              >
                <template v-if="w.tipo === 'categorias'" #acoes>
                  <UTooltip :text="t.categoriasW.verTodas">
                    <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="xs" :aria-label="t.categoriasW.verTodas" @click="abrirMaquete(t.categoriasW.verTodas)" />
                  </UTooltip>
                </template>
                <template v-else-if="definicao(w.tipo).segueEscopo" #acoes>
                  <UTooltip :text="t.laminas.abrirPainel">
                    <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="xs" :aria-label="t.laminas.abrirPainel" @click="abrirMaquete(t.laminas.abrirPainel)" />
                  </UTooltip>
                </template>
                <template v-else-if="w.tipo === 'agenda'" #acoes>
                  <UTooltip :text="t.agenda.abrir">
                    <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="xs" :aria-label="t.agenda.abrir" @click="abrirMaquete(t.agenda.abrir)" />
                  </UTooltip>
                </template>
                <template v-else-if="w.tipo === 'beni'" #acoes>
                  <UBadge :label="t.ehMaquete" color="warning" variant="subtle" size="sm" />
                </template>

                <WCategorias
                  v-if="w.tipo === 'categorias'"
                  :t="t"
                  :categorias="categoriasDo(w)"
                  :abertos="abertosPorCategoria"
                  :admin="admin"
                  @acessar="(c) => abrirMaquete(c.name)"
                  @criar="abrirItem"
                  @criar-categoria="abrirMaquete(t.vazios.criarCategoria)"
                />

                <WMinhasTarefas
                  v-else-if="w.tipo === 'minhasTarefas'"
                  :t="t"
                  :tarefas="tarefas"
                  :eu="EU.id"
                  @concluir="concluirTarefa"
                  @criar="criarTarefaNaAba"
                  @abrir="(x) => abrirMaquete(x.name)"
                  @ver-todas="abrirMaquete(t.casca.itens.rapidas ?? '')"
                />

                <WLamina
                  v-else-if="ehLamina(w)"
                  :t="t"
                  :tipo="w.tipo as LaminaDeTarefas"
                  :tarefas="tarefasDoEscopo"
                  :serie="serieDoEscopo"
                  @abrir="abrirMaquete"
                />

                <WListas
                  v-else-if="['atalhos', 'recentes', 'agenda', 'tarefasDelegadas'].includes(w.tipo)"
                  :t="t"
                  :tipo="w.tipo as 'atalhos' | 'recentes' | 'agenda' | 'tarefasDelegadas'"
                  :atalhos="atalhos"
                  :recentes="recentes"
                  :eventos="eventos"
                  :delegadas="tarefas.filter(x => x.origem === 'rapida' && x.creator === EU.id && x.assigned_to !== EU.id && x.status !== 'completed')"
                  :largura="item.w"
                  @abrir="abrirMaquete"
                  @configurar="abrirConfig(w.id)"
                />

                <WOutros
                  v-else
                  v-model:nota="nota"
                  :t="t"
                  :tipo="w.tipo as 'saudeDosPrazos' | 'graficoDePainel' | 'notas' | 'comunicado' | 'beni'"
                  :tarefas="tarefasDoEscopo"
                  :comunicado="comunicado ?? undefined"
                  :pode-editar-comunicado="admin"
                  :beni="beni"
                  :sem-dados="estado === 'workspaceVazio'"
                  @abrir="abrirMaquete"
                  @salvar-comunicado="salvarComunicado"
                />
              </WidgetMoldura>
            </template>
          </template>
        </UxGradeDePaineis>
      </div>
    </div>

    <Catalogo
      v-model:open="catalogoAberto"
      :t="t"
      :na-home="tiposNaHome"
      :admin="admin"
      :escopo="escopo"
      :categorias="categoriasComAcesso"
      :categorias-escolhidas="widgetDeCategorias?.config.categorias"
      @adicionar="(tipo) => adicionar(tipo)"
      @categorias="aplicarCategorias"
    />

    <ConfigurarWidget
      v-model:open="configAberto"
      :t="t"
      :tipo="widgetEmConfig?.tipo"
      :config="widgetEmConfig?.config"
      :categorias="categoriasComAcesso"
      :atalhos="atalhos"
      @salvar="salvarConfig"
    />

    <ModalNovaTarefa v-model:open="tarefaAberta" :t="t" :tipo="tipoDeTarefa" :itens="itensAbertos" @criar="criarTarefa" />
    <ModalNovoItem
      v-model:open="novoItemAberto"
      :t="t"
      :categoria="categoria(itemEmCriacao.categoria)"
      :formulario="itemEmCriacao.formulario"
      @criar="criarItem"
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
          @click="escolherEstado(e.valor)"
        />

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Ver como</span>
        <UButton
          v-for="p in [{ v: 'membro', r: 'Membro' }, { v: 'admin', r: 'Administrador' }] as const"
          :key="p.v"
          :label="p.r"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="papel === p.v ? 'primary' : 'neutral'"
          :variant="papel === p.v ? 'solid' : 'subtle'"
          @click="papel = p.v"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/home"
          />
        </span>
      </div>
    </div>
  </CascaDaHome>
</template>
