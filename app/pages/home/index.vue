<script setup lang="ts">
/**
 * Home do workspace, montada em widgets.
 *
 * A proposta, rodada 1:
 * - a Home é uma grade de widgets que a pessoa arruma: arrasta pelo título,
 *   puxa o canto, remove, adiciona do catálogo. A mesma grade do Painel de
 *   tarefas (`UxGradeDePaineis`), para o ENSPACE ter um gesto só;
 * - "Personalizar" abre o painel lateral com a lista do que está na Home
 *   (Subir, Descer, Remover: o caminho sem arraste) e o catálogo;
 * - o administrador monta a Home padrão do workspace; quem não personalizou
 *   recebe ela inteira, e quem personalizou recebe só o widget novo, com o
 *   selo "Novo" (HubSpot e Notion);
 * - criar em 1 clique: o botão "Criar" no menu lateral (tecla C), em toda
 *   tela, e o widget "Criar rápido" na Home, com o que a pessoa mais usa;
 * - cada widget carrega, falha e fica sem acesso sozinho.
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
import MenuCriar from './_MenuCriar.vue'
import ModalNovaTarefa from './_ModalNovaTarefa.vue'
import ModalNovoItem from './_ModalNovoItem.vue'
import type { DadosDoItem } from './_ModalNovoItem.vue'
import Personalizar from './_Personalizar.vue'
import WidgetMoldura from './_Widget.vue'
import type { EstadoDoWidget } from './_Widget.vue'
import WCriarRapido from './_WCriarRapido.vue'
import WListas from './_WListas.vue'
import WMinhasTarefas from './_WMinhasTarefas.vue'
import WNumero from './_WNumero.vue'
import WOutros from './_WOutros.vue'
import WVisualizacao from './_WVisualizacao.vue'
import type { Atalho, Item, TarefaDaHome } from './mocks'
import {
  AGORA, DIA, EU, HORA, atalhosIniciais, categoria, categorias, comunicadoInicial, eventosDeHoje, itensIniciais,
  notaInicial, recentes, resumoDoBeni, tarefasIniciais, visualizacao,
} from './mocks'
import type { AbaDeTarefa } from './formatar'
import { HOJE, abaDa, dataLonga, horaAtual } from './formatar'
import type { ConfigDoWidget, OpcaoDeCriar, TipoDeWidget, Widget } from './widgets'
import { PADRAO_LAYOUT, PADRAO_WIDGETS, definicao } from './widgets'
import { textos } from './textos'

definePageMeta({
  titulo: 'Home',
  descricao: 'Home do workspace em widgets que cada pessoa arruma (tarefas, itens de uma visualização, atalhos, recentes, comunicado), Home padrão montada pelo administrador e o botão Criar no menu lateral para tarefa, item e formulário.',
  status: 'em-revisao',
  atualizado: '2026-11-11',
  tela: 'Início',
})

const t = useTextos(textos)
const toast = useToast()
const SLUG = 'operacoes-lumina'

/* ------------------------------------------------------------------ *
 * ANDAIME: estado e papel. Não é proposta.                             *
 * ------------------------------------------------------------------ */

type EstadoDaHome = 'cheio' | 'carregando' | 'vazio' | 'erro' | 'semAcesso'
const estado = ref<EstadoDaHome>('cheio')
const papel = ref<'membro' | 'admin'>('admin')
const estados: { valor: EstadoDaHome, rotulo: string }[] = [
  { valor: 'cheio', rotulo: 'Home padrão' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'vazio', rotulo: 'Home vazia' },
  { valor: 'erro', rotulo: 'Erro num widget' },
  { valor: 'semAcesso', rotulo: 'Sem acesso num widget' },
]
const admin = computed(() => papel.value === 'admin')

/* ------------------------------------------------------------------ *
 * Dado em memória                                                      *
 * ------------------------------------------------------------------ */

const tarefas = ref<TarefaDaHome[]>(tarefasIniciais.map(x => ({ ...x })))
const itens = ref<Item[]>(itensIniciais.map(x => ({ ...x })))
const recemCriados = ref<number[]>([])
const atalhos = ref<Atalho[]>([...atalhosIniciais])
const nota = ref(notaInicial)
const comunicado = ref({ ...comunicadoInicial })

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

const USOS: Record<string, number> = {
  'o-tarefa': 42, 'o-form-f-compra': 31, 'o-form-f-chamado': 18, 'o-form-f-reembolso': 14, 'o-item-contratos': 9,
  'o-form-f-contrato': 7, 'o-item-solicitacoes-de-compra': 6, 'o-form-f-compra-urgente': 5, 'o-item-chamados-de-ti': 4,
}

const opcoesDeCriar = computed<OpcaoDeCriar[]>(() => [
  { id: 'o-tarefa', tipo: 'tarefa', icone: 'i-lucide-list-checks', usos: USOS['o-tarefa'] ?? 0 },
  ...categorias.filter(c => c.acesso).map(c => ({ id: `o-item-${c.slug}`, tipo: 'item' as const, icone: c.icon ?? 'i-lucide-file-plus', categoria: c.slug, usos: USOS[`o-item-${c.slug}`] ?? 0 })),
  ...categorias.filter(c => c.acesso).flatMap(c => c.formularios.map(f => ({
    id: `o-form-${f.id}`, tipo: 'formulario' as const, icone: 'i-lucide-clipboard-pen', categoria: c.slug, formulario: f.id, usos: USOS[`o-form-${f.id}`] ?? 0,
  }))),
])

function rotuloDaOpcao(o: OpcaoDeCriar) {
  const c = categoria(o.categoria ?? '')
  if (o.tipo === 'tarefa') return t.value.criar.tarefaRapida
  if (o.tipo === 'item') return t.value.novoItem.titulo(c?.name ?? '')
  return `${c?.formularios.find(f => f.id === o.formulario)?.nome ?? ''} (${c?.name ?? ''})`
}

const menuCriarAberto = ref(false)
const menuDoWidgetAberto = ref(false)
const novaTarefaAberta = ref(false)
const novoItemAberto = ref(false)
const itemEmCriacao = ref<{ categoria: string, formulario?: string }>({ categoria: '' })

function escolherCriar(o: OpcaoDeCriar) {
  if (o.tipo === 'tarefa') { novaTarefaAberta.value = true; return }
  itemEmCriacao.value = { categoria: o.categoria ?? '', formulario: o.formulario }
  novoItemAberto.value = true
}

const algumaCamadaAberta = computed(() => novaTarefaAberta.value || novoItemAberto.value || configAberto.value || personalizarAberto.value)

/* Tecla C: abre o menu Criar fora de campo de texto (o defineShortcuts ignora campo por padrão). */
defineShortcuts({
  c: () => {
    if (algumaCamadaAberta.value) return
    if (window.matchMedia('(min-width: 1024px)').matches) menuCriarAberto.value = true
    else menuDoWidgetAberto.value = true
  },
})

let proximaTarefa = 13300
function criarTarefa(dados: Pick<TarefaDaHome, 'name' | 'due_date' | 'assigned_to' | 'priority'>) {
  proximaTarefa += 3
  const nova: TarefaDaHome = { id: proximaTarefa, reference: `#${proximaTarefa}`, status: 'pending', creator: EU.id, origem: 'rapida', ...dados }
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
  criarTarefa({ name: nome, due_date: due, assigned_to: EU.id, priority: 'normal' })
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

function abrirMaquete(destino: string) {
  toast.add({ title: t.value.toasts.abrirMaquete(destino), icon: 'i-lucide-square-arrow-out-up-right', color: 'neutral' })
}

/* ------------------------------------------------------------------ *
 * Widgets                                                              *
 * ------------------------------------------------------------------ */

function tituloDo(w: Widget) {
  if (w.config.titulo) return w.config.titulo
  if ((w.tipo === 'visualizacao' || w.tipo === 'numero') && w.config.visualizacao) return visualizacao(w.config.visualizacao)?.nome ?? t.value.widgets[w.tipo].titulo
  return t.value.widgets[w.tipo].titulo
}

function itensDo(w: Widget) {
  const v = visualizacao(w.config.visualizacao ?? '')
  return v ? itens.value.filter(i => i.categoria === v.categoria && v.filtro(i)) : []
}

function categoriaDo(w: Widget) {
  return categoria(visualizacao(w.config.visualizacao ?? '')?.categoria ?? '')
}

function subtituloDo(w: Widget) {
  if (estadoDo(w) !== 'ok') return undefined
  if (w.tipo === 'visualizacao') return `${categoriaDo(w)?.name ?? ''} · ${t.value.visualizacao.contagem(itensDo(w).length)}`
  if (w.tipo === 'saudeDosPrazos') return t.value.saude.subtitulo
  if (w.tipo === 'agenda') return dataLonga(AGORA, t.value)
  if (w.tipo === 'graficoDePainel') return 'Compras por mês'
  return undefined
}

/** O primeiro widget de itens leva o estado do andaime (erro, sem acesso). */
const alvoDoAndaime = computed(() => layout.value.find(x => ['visualizacao', 'numero'].includes(widgetPorId(x.id)?.tipo ?? ''))?.id)
const recuperando = ref<string[]>([])
const recuperados = ref<string[]>([])
watch(estado, () => { recuperados.value = [] })

function estadoDo(w: Widget): EstadoDoWidget {
  if (estado.value === 'carregando' || recuperando.value.includes(w.id)) return 'carregando'
  if (w.id === alvoDoAndaime.value && !recuperados.value.includes(w.id)) {
    if (estado.value === 'erro') return 'erro'
    if (estado.value === 'semAcesso') return 'semAcesso'
  }
  const c = categoriaDo(w)
  if (c && !c.acesso) return 'semAcesso'
  return 'ok'
}

function categoriaSemAcessoDo(w: Widget) {
  return estado.value === 'semAcesso' && w.id === alvoDoAndaime.value ? 'Folha de pagamento' : categoriaDo(w)?.name
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

const naHome = computed(() => layout.value.map(x => widgetPorId(x.id)).filter((w): w is Widget => !!w).map(w => ({ widget: w, titulo: tituloDo(w) })))

/* Adicionar, remover, mover */

let contador = 0
function adicionar(tipo: TipoDeWidget) {
  const d = definicao(tipo)
  contador++
  const id = `w-${tipo}-${contador}`
  const config: ConfigDoWidget = tipo === 'visualizacao' ? { visualizacao: 'v-chamados-abertos' } : tipo === 'numero' ? { visualizacao: 'v-chamados-urgentes' } : tipo === 'criarRapido' ? { fixados: [] } : {}
  const novo: Widget = { id, tipo, config }
  // Entra no topo, depois do Criar rápido, para a pessoa ver onde caiu.
  const posicao = layout.value[0] && widgetPorId(layout.value[0].id)?.tipo === 'criarRapido' ? 1 : 0
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
  if (d.pedeConfig) abrirConfig(id)
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

function concluirPadrao() {
  escopo.value = 'minha'
  toast.add({ title: t.value.toasts.padraoSalvo, icon: 'i-lucide-circle-check', color: 'success' })
}

/* Personalizar e configurar */

const personalizarAberto = ref(false)
const configAberto = ref(false)
const configId = ref('')
const widgetEmConfig = computed(() => widgetPorId(configId.value))

function abrirConfig(id: string) {
  const w = widgetPorId(id)
  if (!w) return
  if (!['visualizacao', 'numero', 'criarRapido', 'atalhos'].includes(w.tipo)) return
  configId.value = id
  personalizarAberto.value = false
  configAberto.value = true
}

function salvarConfig(config: ConfigDoWidget, novosAtalhos?: Atalho[]) {
  const w = widgetEmConfig.value
  if (!w) return
  w.config = config
  if (novosAtalhos) atalhos.value = novosAtalhos
}

const configuravel = (w: Widget) => ['visualizacao', 'numero', 'criarRapido', 'atalhos'].includes(w.tipo)
</script>

<template>
  <CascaDaHome :t="t" :slug="SLUG">
    <!-- PROPOSTA: o botão Criar no menu lateral -->
    <template #criar="{ recolhido }">
      <MenuCriar v-model:open="menuCriarAberto" :t="t" :opcoes="opcoesDeCriar" :categorias="categorias" @escolher="escolherCriar">
        <UTooltip :text="t.criar.dica" :content="{ side: 'right' }">
          <UButton
            :label="recolhido ? undefined : t.criar.botao"
            icon="i-lucide-plus"
            color="primary"
            variant="soft"
            size="sm"
            :block="!recolhido"
            :square="recolhido"
            :aria-label="t.criar.dica"
            :ui="{ base: 'justify-start' }"
          >
            <template v-if="!recolhido" #trailing>
              <UKbd value="C" size="sm" class="ml-auto" />
            </template>
          </UButton>
        </UTooltip>
      </MenuCriar>
    </template>

    <div class="min-h-0 flex-1 overflow-y-auto pb-28">
      <div class="w-full px-4 py-5 sm:px-6 lg:px-8 2xl:px-10">
        <!-- Banner da Home padrão (administrador editando) -->
        <UAlert
          v-if="escopo === 'padrao'"
          :title="t.bannerPadrao.titulo"
          :description="t.bannerPadrao.texto"
          icon="i-lucide-users"
          color="primary"
          variant="subtle"
          class="mb-4 animate-[entrada_0.3s_ease-out_both]"
          :actions="[{ label: t.bannerPadrao.concluir, icon: 'i-lucide-check', color: 'primary', variant: 'solid', size: 'xs', onClick: concluirPadrao }]"
          orientation="horizontal"
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
          <UButton
            :label="t.personalizar"
            icon="i-lucide-layout-dashboard"
            color="neutral"
            variant="outline"
            size="sm"
            @click="personalizarAberto = true"
          />
        </div>

        <UEmpty
          v-if="estado === 'vazio' || !layout.length"
          icon="i-lucide-layout-dashboard"
          :title="t.estados.vazioTitulo"
          :description="t.estados.vazioTexto"
          :actions="[{ label: t.estados.adicionarWidget, icon: 'i-lucide-plus', color: 'neutral', variant: 'outline', onClick: () => { personalizarAberto = true } }]"
          variant="outline"
          class="py-16"
        />

        <UxGradeDePaineis
          v-else
          v-model="layout"
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
                :sem-cabecalho="w.tipo === 'criarRapido'"
                @configurar="abrirConfig(w.id)"
                @tamanho-padrao="tamanhoPadrao(w.id)"
                @remover="remover(w.id)"
                @tentar-de-novo="tentarDeNovo(w.id)"
              >
                <template v-if="w.tipo === 'visualizacao'" #acoes>
                  <UTooltip :text="t.visualizacao.abrir">
                    <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="xs" :aria-label="t.visualizacao.abrir" @click="abrirMaquete(tituloDo(w))" />
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

                <WCriarRapido
                  v-if="w.tipo === 'criarRapido'"
                  :t="t"
                  :opcoes="opcoesDeCriar"
                  :fixados="w.config.fixados ?? []"
                  :categorias="categorias"
                  @escolher="escolherCriar"
                  @configurar="abrirConfig(w.id)"
                >
                  <template #mais>
                    <MenuCriar v-model:open="menuDoWidgetAberto" :t="t" :opcoes="opcoesDeCriar" :categorias="categorias" lado="bottom" @escolher="escolherCriar">
                      <UButton :label="t.criarRapido.mais" icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" class="shrink-0" />
                    </MenuCriar>
                  </template>
                </WCriarRapido>

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

                <WVisualizacao
                  v-else-if="w.tipo === 'visualizacao'"
                  :t="t"
                  :itens="itensDo(w)"
                  :recem-criados="recemCriados"
                  @abrir-item="(i) => abrirMaquete(i.titulo)"
                />

                <WNumero
                  v-else-if="w.tipo === 'numero'"
                  :t="t"
                  :valor="itensDo(w).length"
                  :categoria="categoriaDo(w)?.name ?? ''"
                  @abrir="abrirMaquete(tituloDo(w))"
                />

                <WListas
                  v-else-if="['atalhos', 'recentes', 'agenda', 'tarefasDelegadas'].includes(w.tipo)"
                  :t="t"
                  :tipo="w.tipo as 'atalhos' | 'recentes' | 'agenda' | 'tarefasDelegadas'"
                  :atalhos="atalhos"
                  :recentes="recentes"
                  :eventos="eventosDeHoje"
                  :delegadas="tarefas.filter(x => x.creator === EU.id && x.assigned_to !== EU.id && x.status !== 'completed')"
                  :largura="item.w"
                  @abrir="abrirMaquete"
                  @configurar="abrirConfig(w.id)"
                />

                <WOutros
                  v-else
                  v-model:nota="nota"
                  :t="t"
                  :tipo="w.tipo as 'saudeDosPrazos' | 'graficoDePainel' | 'notas' | 'comunicado' | 'beni'"
                  :tarefas="tarefas"
                  :comunicado="comunicado"
                  :pode-editar-comunicado="admin"
                  :beni="resumoDoBeni"
                  @abrir="abrirMaquete"
                  @salvar-comunicado="(texto) => { comunicado = { ...comunicado, texto, autor: EU.nome, ha: 0 } }"
                />
              </WidgetMoldura>
            </template>
          </template>
        </UxGradeDePaineis>
      </div>
    </div>

    <Personalizar
      v-model:open="personalizarAberto"
      v-model:escopo="escopo"
      :t="t"
      :na-home="naHome"
      :admin="admin"
      @adicionar="adicionar"
      @subir="(id) => mover(id, -1)"
      @descer="(id) => mover(id, 1)"
      @remover="remover"
      @restaurar="restaurar"
    />

    <ConfigurarWidget
      v-model:open="configAberto"
      :t="t"
      :tipo="widgetEmConfig?.tipo"
      :config="widgetEmConfig?.config"
      :categorias="categorias"
      :opcoes="opcoesDeCriar"
      :rotulo-da-opcao="rotuloDaOpcao"
      :atalhos="atalhos"
      @salvar="salvarConfig"
    />

    <ModalNovaTarefa v-model:open="novaTarefaAberta" :t="t" @criar="criarTarefa" @mais-campos="abrirMaquete(t.casca.itens.rapidas ?? '')" />
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
          @click="estado = e.valor"
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
