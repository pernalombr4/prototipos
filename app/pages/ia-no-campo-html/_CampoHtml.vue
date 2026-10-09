<script setup lang="ts">
/**
 * O campo "Editor de texto HTML" do formulário do item, com o BENI.
 * TipTap, como no produto (confirmado pela redatora em 09/10/2026).
 *
 * O QUE É CÓPIA do develop (padrao-dos-campos, BRIEFING 6.2): a barra fixa
 * com desfazer, refazer, título, negrito, itálico, sublinhado, tachado,
 * código, emoji, alinhamento e mais, nesta ordem; o menu "/".
 *
 * O QUE É PROPOSTA (rodadas 1 e 2; ver DECISOES):
 * - IA no começo da barra fixa e da barra da seleção; Ctrl J de qualquer ponto;
 * - "Título" vira "Tipo do bloco" (texto, títulos, listas, checklist,
 *   citação, código), no mesmo lugar;
 * - cor do texto e de fundo num botão só, link com busca de item, limpar
 *   formatação; o "Mais" ganha menção, tabela, divisor, sobrescrito,
 *   subscrito e recuo;
 * - barra flutuante na seleção (a mesma barra, menor, com a IA primeiro);
 * - alça do bloco (+ e ⠿) com transformar, cor, duplicar, mover e excluir;
 * - "/" no padrão do Notion, com atalho markdown na descrição;
 * - a caixa do BENI (_CaixaDoBeni) e a proposta dentro do texto
 *   (proposta.ts + _BarraDaProposta), que só grava no Aceitar;
 * - contagem de palavras no pé do campo.
 */
import type { Editor } from '@tiptap/core'
import type { DropdownMenuItem, EditorCustomHandlers, EditorEmojiMenuItem, EditorMentionMenuItem, EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui'
import { mapEditorItems } from '@nuxt/ui/utils/editor'
import { BackgroundColor, Color, TextStyle } from '@tiptap/extension-text-style'
import { TextAlign } from '@tiptap/extension-text-align'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import type { Textos } from './textos'
import type { AgenteDoCampo, PedidoSalvo } from './mocks'
import type { PedidoDaCaixa } from './_CaixaDoBeni.vue'
import type { Acao, Pedido } from './simulador'
import type { CorUsada } from './paleta'
import type { Intervalo } from './proposta'
import { membros, modelos, pedidosSalvosIniciais } from './mocks'
import { entraAbaixo, gerar, transmitir } from './simulador'
import { aplicarPaleta, cores } from './paleta'
import { chaveDaProposta, PropostaDoBeni } from './proposta'
import CaixaDoBeni from './_CaixaDoBeni.vue'
import BarraDaProposta from './_BarraDaProposta.vue'
import SeletorDeCor from './_SeletorDeCor.vue'
import PopoverDeLink from './_PopoverDeLink.vue'

const props = defineProps<{
  t: Textos
  rotulo: string
  iaLigada: boolean
  falhar: boolean
}>()

const valor = defineModel<string>({ required: true })
const toast = useToast()

const moldura = useTemplateRef<HTMLElement>('moldura')
const editorRef = useTemplateRef<{ editor: Editor | undefined }>('editorRef')
const ed = () => editorRef.value?.editor

/* Escolhas da sessão, valem para os 2 campos (como o "Auto" do Notion). */
const agente = useState<AgenteDoCampo | null>('beni-agente', () => null)
const modelo = useState<string>('beni-modelo', () => 'auto')
const usarCampos = useState<boolean>('beni-usar-campos', () => true)
const pedidosSalvos = useState<PedidoSalvo[]>('beni-pedidos-salvos', () => [...pedidosSalvosIniciais])
const recentes = useState<CorUsada[]>('cores-recentes', () => [])
watch(agente, (a) => { modelo.value = a?.model ?? 'auto' })

/* O tom das 10 cores acompanha o tema (paleta.ts). */
const tema = useColorMode()
watchEffect(() => aplicarPaleta(tema.value === 'dark'))

const extensoes = [
  TextStyle,
  Color,
  BackgroundColor,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TaskList,
  TaskItem.configure({ nested: true }),
  TableKit.configure({ table: { resizable: false } }),
  Subscript,
  Superscript,
  Emoji.configure({ enableEmoticons: true }),
  PropostaDoBeni,
]

/* ------------------------------------------------- contexto do pedido ---- */

interface Contexto {
  comSelecao: boolean
  /** a seleção cabe num bloco só: a proposta entra no meio da linha */
  mesmoBloco: boolean
  texto: string
  campoVazio: boolean
  from: number
  to: number
  abaixo: number
  linhaVazia: Intervalo | null
}

function contextoDe(editor: Editor): Contexto {
  const doc = editor.state.doc
  let { from, to } = editor.state.selection
  const { empty } = editor.state.selection
  // Sem cursor posto no campo (veio da barra sem clicar no texto): a IA escreve no fim.
  if (empty && from <= 1 && !editor.isEmpty) from = to = doc.content.size - 1
  const $from = doc.resolve(from)
  const $to = doc.resolve(to)
  return {
    comSelecao: !empty,
    mesmoBloco: $from.sameParent($to) && $from.parent.isTextblock,
    texto: !empty ? doc.textBetween(from, to, '\n') : doc.textBetween(0, doc.content.size, '\n'),
    campoVazio: editor.isEmpty,
    from,
    to,
    abaixo: $to.depth ? $to.after(1) : doc.content.size,
    linhaVazia: empty && $to.depth > 0 && !$to.parent.content.size ? { from: $to.before(1), to: $to.after(1) } : null,
  }
}

const marcar = (editor: Editor, meta: Record<string, unknown>) => editor.view.dispatch(editor.state.tr.setMeta(chaveDaProposta, meta))

function topoAbaixoDe(editor: Editor, pos: number) {
  if (!moldura.value) return 0
  const base = moldura.value.getBoundingClientRect()
  return editor.view.coordsAtPos(pos).bottom - base.top + 8
}

/* ------------------------------------------------------- a caixa ---- */

const caixa = ref<(Contexto & { topo: number, chave: number }) | null>(null)
let chave = 0

function abrirCaixa(editor: Editor) {
  if (!props.iaLigada || sessao.value) return
  const ctx = contextoDe(editor)
  caixa.value = { ...ctx, topo: topoAbaixoDe(editor, ctx.to), chave: ++chave }
  marcar(editor, { foco: ctx.comSelecao ? { from: ctx.from, to: ctx.to } : null })
  rolarAteVer('[data-caixa-do-beni]')
}

/** A camada nova (caixa ou barra) entra inteira na tela: rola só o que falta. */
function rolarAteVer(seletor: string) {
  setTimeout(() => moldura.value?.querySelector(seletor)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 180)
}

function fecharCaixa(devolverFoco = true) {
  const c = caixa.value
  caixa.value = null
  const editor = ed()
  if (!editor) return
  marcar(editor, { foco: null })
  if (devolverFoco && c) editor.chain().focus().setTextSelection({ from: c.from, to: c.to }).run()
}

/* ------------------------------------------- a proposta e a barra dela ---- */

type Modo = 'substituir' | 'abaixo' | 'linhaVazia' | 'vazio'

interface Sessao {
  ctx: Contexto
  pedido: Pedido
  rotulo: string
  modo: Modo
  inline: boolean
  fase: 'gerando' | 'pronto' | 'erro'
  html: string
  notas?: string[]
  semRoteiro?: boolean
  interrompido?: boolean
  podeSalvar: boolean
  topo: number
}
const sessao = ref<Sessao | null>(null)
let sinal = { parar: false }

const tirarParagrafo = (html: string) => html.replace(/<\/p>\s*<p>/g, ' ').replace(/<\/?p>/g, '')

function propostaVisivel(s: Sessao) {
  const em = s.modo === 'substituir' ? (s.inline ? s.ctx.to : s.ctx.abaixo)
    : s.modo === 'abaixo' ? s.ctx.abaixo
      : s.modo === 'linhaVazia' ? s.ctx.linhaVazia!.from
        : 0
  return {
    riscar: s.modo === 'substituir' ? { from: s.ctx.from, to: s.ctx.to } : null,
    em,
    html: s.inline ? tirarParagrafo(s.html) : s.html,
    bloco: !s.inline,
  }
}

function posicionarBarra() {
  const s = sessao.value
  const editor = ed()
  if (!s || !editor || !moldura.value) return
  const base = moldura.value.getBoundingClientRect()
  const el = moldura.value.querySelector('[data-proposta-do-beni]')
  s.topo = el ? el.getBoundingClientRect().bottom - base.top + 8 : topoAbaixoDe(editor, s.ctx.to)
}

const ritmo = computed(() => 1.6 - (modelos.find(m => m.id === modelo.value)?.velocidade ?? 4) * 0.2)

async function rodar(editor: Editor) {
  const s = sessao.value!
  sinal.parar = true
  sinal = { parar: false }
  const meu = sinal
  Object.assign(s, { fase: 'gerando', html: '', notas: undefined, semRoteiro: false, interrompido: false })
  marcar(editor, { foco: null, proposta: propostaVisivel(s) })
  await nextTick()
  posicionarBarra()

  if (props.falhar) {
    await new Promise(r => setTimeout(r, 1100))
    if (meu.parar || sessao.value !== s) return
    s.fase = 'erro'
    marcar(editor, { proposta: null, foco: s.ctx.comSelecao ? { from: s.ctx.from, to: s.ctx.to } : null })
    await nextTick()
    posicionarBarra()
    return
  }

  const r = gerar(s.pedido)
  const completa = await transmitir(r.html, async (parcial) => {
    if (sessao.value !== s) return
    s.html = parcial
    marcar(editor, { proposta: propostaVisivel(s) })
    await nextTick()
    posicionarBarra()
  }, meu, ritmo.value)
  if (!completa || sessao.value !== s) return
  Object.assign(s, { fase: 'pronto', notas: r.notas, semRoteiro: r.semRoteiro })
  rolarAteVer('[data-barra-da-proposta]')
}

function executar(editor: Editor, p: PedidoDaCaixa, ctxDado?: Contexto) {
  if (!props.iaLigada) return
  const ctx = ctxDado ?? caixa.value ?? contextoDe(editor)
  caixa.value = null
  const modo: Modo = ctx.campoVazio ? 'vazio'
    : ctx.comSelecao ? (entraAbaixo.includes(p.acao) ? 'abaixo' : 'substituir')
      : ctx.linhaVazia ? 'linhaVazia' : 'abaixo'
  sessao.value = {
    ctx,
    pedido: {
      acao: p.acao,
      parametro: p.parametro,
      prompt: p.prompt,
      texto: ctx.texto,
      usarCampos: usarCampos.value,
      tentativa: 0,
      agente: agente.value?.slug,
      agenteRevisor: agente.value?.type === 'reviewer',
    },
    rotulo: p.rotulo,
    modo,
    inline: modo === 'substituir' && ctx.mesmoBloco,
    fase: 'gerando',
    html: '',
    podeSalvar: p.acao === 'pedir' && !!p.prompt && !pedidosSalvos.value.some(x => x.prompt === p.prompt),
    topo: 0,
  }
  editor.setEditable(false)
  rodar(editor)
}

function encerrar(editor: Editor) {
  sinal.parar = true
  sessao.value = null
  editor.setEditable(true)
  marcar(editor, { proposta: null, foco: null })
}

function aplicar(ondeAbaixo = false) {
  const editor = ed()
  const s = sessao.value
  if (!editor || !s || !s.html) return
  const { ctx } = s
  encerrar(editor)
  const antes = editor.state.doc.content.size
  let alvo: number | Intervalo
  let removido = 0
  let conteudo = s.html
  if (ondeAbaixo) alvo = ctx.abaixo
  else if (s.modo === 'substituir') {
    alvo = { from: ctx.from, to: ctx.to }
    removido = ctx.to - ctx.from
    if (s.inline) conteudo = tirarParagrafo(s.html)
  }
  else if (s.modo === 'linhaVazia') {
    alvo = ctx.linhaVazia!
    removido = ctx.linhaVazia!.to - ctx.linhaVazia!.from
  }
  else if (s.modo === 'vazio') {
    alvo = { from: 0, to: antes }
    removido = antes
  }
  else alvo = ctx.abaixo
  editor.chain().focus().insertContentAt(alvo, conteudo).run()

  // O texto que entrou fica realçado por um instante: a pessoa vê onde o BENI mexeu.
  const inicio = typeof alvo === 'number' ? alvo : alvo.from
  const fim = inicio + (editor.state.doc.content.size - antes) + removido
  marcar(editor, { foco: { from: inicio, to: fim } })
  setTimeout(() => { const e = ed(); if (e) marcar(e, { foco: null }) }, 1400)

  toast.add({
    title: props.t.beni.aceito,
    icon: 'i-lucide-sparkles',
    color: 'success',
    duration: 5000,
    actions: [{ label: props.t.beni.desfazer, color: 'neutral', variant: 'outline', onClick: () => { ed()?.chain().focus().undo().run() } }],
  })
}

function descartar() {
  const editor = ed()
  const s = sessao.value
  if (!editor || !s) return
  encerrar(editor)
  editor.chain().focus().setTextSelection({ from: s.ctx.from, to: s.ctx.to }).run()
}

function parar() {
  const editor = ed()
  const s = sessao.value
  if (!editor || !s) return
  sinal.parar = true
  if (!s.html) return descartar()
  Object.assign(s, { fase: 'pronto', interrompido: true })
}

function tentar() {
  const editor = ed()
  const s = sessao.value
  if (!editor || !s) return
  s.pedido = { ...s.pedido, tentativa: s.pedido.tentativa + 1, usarCampos: usarCampos.value }
  rodar(editor)
}

function ajustar(q: string) {
  const editor = ed()
  const s = sessao.value
  if (!editor || !s) return
  s.pedido = { ...s.pedido, acao: 'ajustar', prompt: q, anterior: s.html }
  s.rotulo = q
  s.podeSalvar = false
  rodar(editor)
}

function salvarPedido(nome: string) {
  const s = sessao.value
  if (!s?.pedido.prompt) return
  pedidosSalvos.value = [{ id: `ps${Date.now()}`, nome, prompt: s.pedido.prompt }, ...pedidosSalvos.value]
  s.podeSalvar = false
  toast.add({ title: props.t.beni.pedidoSalvo(nome), icon: 'i-lucide-bookmark-check', color: 'success', duration: 4000 })
}

function feedback() {
  toast.add({ title: props.t.beni.obrigado, icon: 'i-lucide-heart', duration: 2000 })
}

/* ------------------------------------------------------------ atalhos ---- */

const linkAberto = ref(false)

function aoTeclar(e: KeyboardEvent) {
  const editor = ed()
  if (!editor || !(e.ctrlKey || e.metaKey)) return
  const k = e.key.toLowerCase()
  if (k === 'j' && !e.shiftKey) {
    e.preventDefault()
    abrirCaixa(editor)
  }
  else if (k === 'k' && !e.shiftKey) {
    e.preventDefault()
    linkAberto.value = true
  }
  else if (k === 'h' && e.shiftKey && recentes.value[0]) {
    // Repete a última cor (Notion: Ctrl Shift H).
    e.preventDefault()
    const { uso, cor } = recentes.value[0]
    if (uso === 'texto' && cor.texto) editor.chain().focus().setColor(cor.texto).run()
    if (uso === 'fundo' && cor.fundo) editor.chain().focus().setBackgroundColor(cor.fundo).run()
  }
}

/* ------------------------------------------------------- handlers ---- */

interface ItemBeni { acao?: Acao, rotuloDaAcao?: string, prompt?: string, precisaTexto?: boolean }
interface ItemCor { uso?: 'texto' | 'fundo', nome?: string, pos?: number }

/** O intervalo de texto do bloco em `pos` (alça) ou do bloco do cursor ("/"). */
function textoDoBloco(editor: Editor, pos?: number): Intervalo {
  if (pos != null) {
    const node = editor.state.doc.nodeAt(pos)
    return { from: pos + 1, to: pos + (node?.nodeSize ?? 2) - 1 }
  }
  const $f = editor.state.selection.$from
  return { from: $f.start(), to: $f.end() }
}

const handlers = {
  beni: {
    canExecute: () => props.iaLigada,
    execute: (editor: Editor, item?: ItemBeni) => {
      // O menu "/" ainda está fechando quando o handler roda: a caixa abre no tique seguinte.
      setTimeout(() => {
        if (item?.acao) executar(editor, { acao: item.acao, prompt: item.prompt, rotulo: item.rotuloDaAcao ?? '' })
        else abrirCaixa(editor)
      })
      return editor.chain()
    },
    isActive: () => false,
    isDisabled: (editor: Editor, item?: ItemBeni) => !props.iaLigada || (!!item?.precisaTexto && editor.isEmpty),
  },
  beniBloco: {
    canExecute: () => props.iaLigada,
    execute: (editor: Editor, item?: { pos?: number }) => {
      const r = textoDoBloco(editor, item?.pos)
      setTimeout(() => { editor.chain().focus().setTextSelection(r).run(); abrirCaixa(editor) })
      return editor.chain()
    },
    isActive: () => false,
    isDisabled: () => !props.iaLigada,
  },
  corDoBloco: {
    canExecute: () => true,
    execute: (editor: Editor, item?: ItemCor) => {
      const cor = cores.find(c => c.nome === item?.nome) ?? cores[0]!
      const sel = editor.state.selection
      const r = textoDoBloco(editor, item?.pos)
      const cadeia = editor.chain().focus().setTextSelection(r)
      if (item?.uso === 'fundo') {
        if (cor.fundo) cadeia.setBackgroundColor(cor.fundo)
        else cadeia.unsetBackgroundColor()
      }
      else if (cor.texto) cadeia.setColor(cor.texto)
      else cadeia.unsetColor()
      return cadeia.setTextSelection({ from: sel.from, to: sel.to })
    },
    isActive: () => false,
  },
  tabela: {
    canExecute: (editor: Editor) => editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    execute: (editor: Editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    isActive: (editor: Editor) => editor.isActive('table'),
  },
  tabelaOp: {
    canExecute: (editor: Editor) => editor.isActive('table'),
    execute: (editor: Editor, item?: { op?: 'addRowAfter' | 'addColumnAfter' | 'deleteRow' | 'deleteColumn' | 'deleteTable' }) => {
      const c = editor.chain().focus()
      return item?.op ? c[item.op]() : c
    },
    isActive: () => false,
  },
  recuo: {
    canExecute: (editor: Editor, item?: { dir?: 'mais' | 'menos' }) => {
      const tipo = editor.isActive('taskItem') ? 'taskItem' : 'listItem'
      return item?.dir === 'menos' ? editor.can().liftListItem(tipo) : editor.can().sinkListItem(tipo)
    },
    execute: (editor: Editor, item?: { dir?: 'mais' | 'menos' }) => {
      const tipo = editor.isActive('taskItem') ? 'taskItem' : 'listItem'
      return item?.dir === 'menos' ? editor.chain().focus().liftListItem(tipo) : editor.chain().focus().sinkListItem(tipo)
    },
    isActive: () => false,
  },
  abrirLink: {
    canExecute: () => true,
    execute: (editor: Editor) => { setTimeout(() => { linkAberto.value = true }); return editor.chain() },
    isActive: () => false,
  },
} satisfies EditorCustomHandlers

type ItemDaBarra = EditorToolbarItem<typeof handlers>

const tb = computed(() => props.t.beni)
const te = computed(() => props.t.editor)

/* --------------------------------------------- tipos de bloco (comum) ---- */

const tiposDeBloco = computed(() => [
  { kind: 'paragraph' as const, icon: 'i-lucide-type', label: te.value.texto, ativo: (e: Editor) => e.isActive('paragraph') && !e.isActive('bulletList') && !e.isActive('orderedList') && !e.isActive('taskList') && !e.isActive('blockquote') },
  { kind: 'heading' as const, level: 1, icon: 'i-lucide-heading-1', label: te.value.titulo1, ativo: (e: Editor) => e.isActive('heading', { level: 1 }) },
  { kind: 'heading' as const, level: 2, icon: 'i-lucide-heading-2', label: te.value.titulo2, ativo: (e: Editor) => e.isActive('heading', { level: 2 }) },
  { kind: 'heading' as const, level: 3, icon: 'i-lucide-heading-3', label: te.value.titulo3, ativo: (e: Editor) => e.isActive('heading', { level: 3 }) },
  { kind: 'bulletList' as const, icon: 'i-lucide-list', label: te.value.lista, ativo: (e: Editor) => e.isActive('bulletList') },
  { kind: 'orderedList' as const, icon: 'i-lucide-list-ordered', label: te.value.listaNumerada, ativo: (e: Editor) => e.isActive('orderedList') },
  { kind: 'taskList' as const, icon: 'i-lucide-list-checks', label: te.value.checklist, ativo: (e: Editor) => e.isActive('taskList') },
  { kind: 'blockquote' as const, icon: 'i-lucide-text-quote', label: te.value.citacao, ativo: (e: Editor) => e.isActive('blockquote') },
  { kind: 'codeBlock' as const, icon: 'i-lucide-square-code', label: te.value.blocoDeCodigo, ativo: (e: Editor) => e.isActive('codeBlock') },
])

function tipoAtual(editor: Editor) {
  return [...tiposDeBloco.value].reverse().find(t => t.ativo(editor)) ?? tiposDeBloco.value[0]!
}

const itensDeTipo = () => tiposDeBloco.value.map(({ ativo: _, ...resto }) => resto)

const marcas = (): ItemDaBarra[] => [
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: te.value.negrito, kbds: ['ctrl', 'b'] } },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: te.value.italico, kbds: ['ctrl', 'i'] } },
  { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: te.value.sublinhado, kbds: ['ctrl', 'u'] } },
  { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: te.value.tachado, kbds: ['ctrl', 'shift', 's'] } },
  { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: te.value.codigo, kbds: ['ctrl', 'e'] } },
]

const alinhamentos = (): ItemDaBarra[] => [
  { kind: 'textAlign', align: 'left', icon: 'i-lucide-align-left', label: te.value.alinharEsquerda },
  { kind: 'textAlign', align: 'center', icon: 'i-lucide-align-center', label: te.value.centralizar },
  { kind: 'textAlign', align: 'right', icon: 'i-lucide-align-right', label: te.value.alinharDireita },
  { kind: 'textAlign', align: 'justify', icon: 'i-lucide-align-justify', label: te.value.justificar },
]

/* ---------------------------------------------------- a barra fixa ---- */

function itensDaBarra(editor: Editor): ItemDaBarra[][] {
  const botaoIa: ItemDaBarra = props.iaLigada
    ? {
        icon: 'i-lucide-sparkles',
        label: tb.value.botao,
        color: 'primary',
        variant: 'soft',
        tooltip: { text: tb.value.dica, kbds: ['ctrl', 'j'] },
        onClick: () => abrirCaixa(editor),
      } as ItemDaBarra
    : { slot: 'iaDesligada' as const }

  const tipo = tipoAtual(editor)
  const naTabela = editor.isActive('table')

  return [
    [botaoIa],
    [
      { kind: 'undo', icon: 'i-lucide-undo-2', tooltip: { text: te.value.desfazer, kbds: ['ctrl', 'z'] } },
      { kind: 'redo', icon: 'i-lucide-redo-2', tooltip: { text: te.value.refazer, kbds: ['ctrl', 'y'] } },
    ],
    [{
      icon: tipo.icon,
      trailingIcon: 'i-lucide-chevron-down',
      tooltip: { text: te.value.tipo },
      activeColor: 'neutral',
      activeVariant: 'ghost',
      content: { align: 'start' },
      ui: { trailingIcon: 'size-3 text-muted' },
      items: itensDeTipo(),
    } as ItemDaBarra],
    marcas(),
    [{ slot: 'cor' as const }, { slot: 'link' as const }, { kind: 'clearFormatting', icon: 'i-lucide-remove-formatting', tooltip: { text: te.value.limparFormatacao } }],
    [
      { kind: 'emoji', icon: 'i-lucide-smile-plus', tooltip: { text: te.value.emoji, kbds: [':'] } },
      { icon: 'i-lucide-align-left', tooltip: { text: te.value.alinhamento }, content: { align: 'start' }, items: alinhamentos() },
      {
        icon: 'i-lucide-ellipsis',
        tooltip: { text: te.value.mais },
        content: { align: 'end' },
        items: [
          [
            { kind: 'mention', icon: 'i-lucide-at-sign', label: te.value.mencao, kbds: ['@'] },
            { kind: 'tabela', icon: 'i-lucide-table', label: te.value.tabela },
            { kind: 'horizontalRule', icon: 'i-lucide-minus', label: te.value.divisor },
          ],
          [
            { kind: 'mark', mark: 'superscript', icon: 'i-lucide-superscript', label: te.value.sobrescrito },
            { kind: 'mark', mark: 'subscript', icon: 'i-lucide-subscript', label: te.value.subscrito },
            { kind: 'recuo', dir: 'menos', icon: 'i-lucide-indent-decrease', label: te.value.recuar, kbds: ['shift', 'tab'] },
            { kind: 'recuo', dir: 'mais', icon: 'i-lucide-indent-increase', label: te.value.avancar, kbds: ['tab'] },
          ],
          ...(naTabela
            ? [[
                { type: 'label', label: te.value.grupoTabela },
                { kind: 'tabelaOp', op: 'addRowAfter', icon: 'i-lucide-between-horizontal-end', label: te.value.adicionarLinha },
                { kind: 'tabelaOp', op: 'addColumnAfter', icon: 'i-lucide-between-vertical-end', label: te.value.adicionarColuna },
                { kind: 'tabelaOp', op: 'deleteRow', icon: 'i-lucide-rows-3', label: te.value.excluirLinha },
                { kind: 'tabelaOp', op: 'deleteColumn', icon: 'i-lucide-columns-3', label: te.value.excluirColuna },
                { kind: 'tabelaOp', op: 'deleteTable', icon: 'i-lucide-trash-2', label: te.value.excluirTabela, color: 'error' },
              ]]
            : []),
        ],
      },
    ],
  ] as ItemDaBarra[][]
}

/* ------------------------------------------------ a barra da seleção ---- */

function itensDaBolha(editor: Editor): ItemDaBarra[][] {
  const tipo = tipoAtual(editor)
  return [
    ...(props.iaLigada
      ? [[{ icon: 'i-lucide-sparkles', label: tb.value.botaoBolha, color: 'primary', variant: 'soft', tooltip: { text: tb.value.dica, kbds: ['ctrl', 'j'] }, onClick: () => abrirCaixa(editor) } as ItemDaBarra]]
      : []),
    [{
      label: tipo.label,
      trailingIcon: 'i-lucide-chevron-down',
      tooltip: { text: te.value.tipo },
      activeColor: 'neutral',
      activeVariant: 'ghost',
      content: { align: 'start' },
      portal: false,
      ui: { trailingIcon: 'size-3 text-muted', label: 'text-xs' },
      items: itensDeTipo(),
    } as ItemDaBarra],
    marcas(),
    [{ slot: 'link' as const }, { slot: 'cor' as const }],
    [{
      icon: 'i-lucide-ellipsis',
      tooltip: { text: te.value.mais },
      content: { align: 'end' },
      portal: false,
      items: [
        [
          { kind: 'mark', mark: 'superscript', icon: 'i-lucide-superscript', label: te.value.sobrescrito },
          { kind: 'mark', mark: 'subscript', icon: 'i-lucide-subscript', label: te.value.subscrito },
        ],
        alinhamentos(),
        [{ kind: 'clearFormatting', icon: 'i-lucide-remove-formatting', label: te.value.limparFormatacao }],
      ],
    } as ItemDaBarra],
  ] as ItemDaBarra[][]
}

function mostrarBolha({ editor, view, state }: { editor: Editor, view: { hasFocus: () => boolean }, state: { selection: { empty: boolean } } }) {
  if (caixa.value || sessao.value || !editor.isEditable) return false
  if (editor.isActive('codeBlock') || editor.isActive('image')) return false
  // O foco num menu da própria bolha (cor, link, tipo) não pode fechar a bolha.
  const focoNaBolha = !!document.activeElement?.closest('[data-bolha-do-campo]')
  return (view.hasFocus() || focoNaBolha) && !state.selection.empty
}

/* ------------------------------------------------------- o menu "/" ---- */

const itensDoMenu = computed(() => {
  const ia = (acao: Acao | undefined, label: string, description: string, icon: string, extra: Record<string, unknown> = {}) =>
    ({ kind: 'beni', acao, rotuloDaAcao: label, label, description, icon, palavras: 'ia ai beni', ...extra })
  const grupos: unknown[][] = []
  if (props.iaLigada) {
    grupos.push([
      { type: 'label', label: tb.value.grupoMenu },
      ia(undefined, tb.value.pedir, tb.value.pedirDescricao, 'i-lucide-sparkles'),
      ...pedidosSalvos.value.map(p => ia('pedir', p.nome, p.prompt, 'i-lucide-bookmark', { prompt: p.prompt })),
      ia('continuar', tb.value.continuar, tb.value.continuarDescricao, 'i-lucide-pen-line', { precisaTexto: true }),
      ia('resumir', tb.value.resumir, tb.value.resumirDescricao, 'i-lucide-text-quote', { precisaTexto: true }),
      ia('pendencias', tb.value.pendencias, tb.value.pendenciasDescricao, 'i-lucide-list-checks', { precisaTexto: true }),
      ia('rascunhar', tb.value.rascunhar, tb.value.rascunharDescricao, 'i-lucide-file-pen-line'),
    ])
  }
  const atalho = te.value.atalho
  grupos.push(
    [
      { type: 'label', label: te.value.grupoBasicos },
      { kind: 'paragraph', label: te.value.texto, icon: 'i-lucide-type' },
      { kind: 'heading', level: 1, label: te.value.titulo1, icon: 'i-lucide-heading-1', description: atalho('#') },
      { kind: 'heading', level: 2, label: te.value.titulo2, icon: 'i-lucide-heading-2', description: atalho('##') },
      { kind: 'heading', level: 3, label: te.value.titulo3, icon: 'i-lucide-heading-3', description: atalho('###') },
      { kind: 'bulletList', label: te.value.lista, icon: 'i-lucide-list', description: atalho('-') },
      { kind: 'orderedList', label: te.value.listaNumerada, icon: 'i-lucide-list-ordered', description: atalho('1.') },
      { kind: 'taskList', label: te.value.checklist, icon: 'i-lucide-list-checks', description: atalho('[ ]') },
      { kind: 'blockquote', label: te.value.citacao, icon: 'i-lucide-text-quote', description: atalho('>') },
      { kind: 'codeBlock', label: te.value.blocoDeCodigo, icon: 'i-lucide-square-code', description: atalho('```') },
      { kind: 'horizontalRule', label: te.value.divisor, icon: 'i-lucide-minus', description: atalho('---') },
    ],
    [
      { type: 'label', label: te.value.grupoInserir },
      { kind: 'tabela', label: te.value.tabela, icon: 'i-lucide-table' },
      { kind: 'abrirLink', label: te.value.link, icon: 'i-lucide-link', description: atalho('Ctrl K') },
      { kind: 'mention', label: te.value.mencao, icon: 'i-lucide-at-sign', description: atalho('@') },
      { kind: 'emoji', label: te.value.emoji, icon: 'i-lucide-smile-plus', description: atalho(':') },
    ],
    [
      { type: 'label', label: te.value.grupoCor },
      ...cores.map(c => ({
        kind: 'corDoBloco',
        uso: 'texto',
        nome: c.nome,
        label: c.nome === 'padrao' ? props.t.cores.nomes.padrao : props.t.cores.corDoTexto(props.t.cores.nomes[c.nome]!),
        icon: 'i-lucide-baseline',
        palavras: `cor color ${props.t.cores.nomes[c.nome]}`,
      })),
    ],
  )
  return grupos as EditorSuggestionMenuItem<typeof handlers>[][]
})

/* ------------------------------------------------------ a alça do bloco ---- */

const blocoDaAlca = ref<{ node: { type?: string }, pos: number } | null>(null)

function itensDaAlca(editor: Editor): DropdownMenuItem[][] {
  const b = blocoDaAlca.value
  if (!b?.node?.type) return []
  const pos = b.pos
  const tb2 = props.t.bloco
  return mapEditorItems(editor, [
    [
      {
        label: tb2.transformarEm,
        icon: 'i-lucide-repeat-2',
        children: itensDeTipo(),
      },
      {
        label: tb2.cor,
        icon: 'i-lucide-palette',
        children: [
          { type: 'label', label: props.t.cores.texto },
          ...cores.map(c => ({ kind: 'corDoBloco', uso: 'texto', nome: c.nome, pos, label: props.t.cores.nomes[c.nome], icon: 'i-lucide-baseline' })),
          { type: 'label', label: props.t.cores.fundo },
          ...cores.map(c => ({ kind: 'corDoBloco', uso: 'fundo', nome: c.nome, pos, label: props.t.cores.nomes[c.nome], icon: 'i-lucide-paint-bucket' })),
        ],
      },
    ],
    [
      { kind: 'duplicate', pos, label: tb2.duplicar, icon: 'i-lucide-copy', kbds: ['ctrl', 'd'] },
      {
        label: tb2.copiar,
        icon: 'i-lucide-clipboard',
        onSelect: async () => {
          const node = editor.state.doc.nodeAt(pos)
          try { if (node) await navigator.clipboard.writeText(node.textContent) }
          catch { /* sem permissão: o aviso sai igual */ }
          toast.add({ title: tb2.copiado, icon: 'i-lucide-check', color: 'success', duration: 2000 })
        },
      },
      { kind: 'moveUp', pos, label: tb2.moverAcima, icon: 'i-lucide-arrow-up' },
      { kind: 'moveDown', pos, label: tb2.moverAbaixo, icon: 'i-lucide-arrow-down' },
    ],
    ...(props.iaLigada ? [[{ kind: 'beniBloco', pos, label: tb2.perguntarAoBeni, icon: 'i-lucide-sparkles', kbds: ['ctrl', 'j'] }]] : []),
    [{ kind: 'delete', pos, label: tb2.excluir, icon: 'i-lucide-trash-2', color: 'error', kbds: ['del'] }],
  ] as never, handlers) as DropdownMenuItem[][]
}

/* ------------------------------------------ menções, emojis, contagem ---- */

const itensDeMencao: EditorMentionMenuItem[] = membros.map(m => ({ label: m.label, avatar: { text: m.iniciais, alt: m.label } }))
const itensDeEmoji: EditorEmojiMenuItem[] = gitHubEmojis.filter(e => !e.name.startsWith('regional_indicator_'))

const contagem = computed(() => {
  const texto = valor.value.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim()
  const palavras = texto ? texto.split(/\s+/).length : 0
  return te.value.palavras(palavras, texto.replace(/\s+/g, ' ').length)
})

const nomeDoModelo = computed(() => modelos.find(m => m.id === modelo.value)?.nome ?? 'Auto')
</script>

<template>
  <UFormField :label="rotulo" :ui="{ label: 'font-semibold text-highlighted' }">
    <div
      ref="moldura"
      class="relative rounded-lg border border-default bg-default transition-[border-color,box-shadow] duration-150 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15 [&_.max-w-60]:w-80 [&_.max-w-60]:max-w-80"
      @keydown.capture="aoTeclar"
    >
      <UEditor
        ref="editorRef"
        v-slot="{ editor, handlers: todos }"
        v-model="valor"
        content-type="html"
        :extensions="extensoes"
        :handlers="handlers"
        :placeholder="iaLigada ? te.placeholder : te.placeholderSemIa"
        :ui="{ base: [
          'min-h-28 ps-11 pe-4 sm:ps-11 sm:pe-4 py-3 text-sm *:my-2 [&_p]:leading-6 focus:outline-none',
          '[&_li_p]:my-0',
          '[&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:ps-0.5 [&_li[data-type=taskItem]]:flex [&_li[data-type=taskItem]]:items-start [&_li[data-type=taskItem]]:gap-2 [&_li[data-type=taskItem]>label]:mt-1 [&_li[data-type=taskItem]>div]:flex-1 [&_li[data-checked=true]>div]:text-muted [&_li[data-checked=true]>div]:line-through [&_input[type=checkbox]]:size-3.5 [&_input[type=checkbox]]:accent-(--ui-primary)',
          '[&_.tableWrapper]:overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-default [&_td]:px-2 [&_td]:py-1 [&_td]:align-top [&_th]:border [&_th]:border-default [&_th]:bg-elevated [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:font-semibold [&_.selectedCell]:bg-primary/10',
        ].join(' ') }"
      >
        <!-- BARRA FIXA -->
        <UEditorToolbar
          :editor="editor"
          :items="itensDaBarra(editor)"
          size="sm"
          class="sticky top-0 z-10 overflow-x-auto rounded-t-lg border-b border-default bg-default/95 px-1.5 py-1 backdrop-blur"
        >
          <template #iaDesligada>
            <UTooltip :text="tb.desligada" :content="{ side: 'top' }" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
              <UButton icon="i-lucide-sparkles" :label="tb.botao" color="neutral" variant="ghost" size="sm" aria-disabled="true" class="cursor-not-allowed text-dimmed hover:bg-transparent" />
            </UTooltip>
          </template>
          <template #cor>
            <SeletorDeCor :t="t" :editor="editor" />
          </template>
          <template #link>
            <PopoverDeLink v-model:open="linkAberto" :t="t" :editor="editor" />
          </template>
        </UEditorToolbar>

        <!-- BARRA DA SELEÇÃO: a mesma, menor, com a IA primeiro -->
        <UEditorToolbar
          v-show="!caixa && !sessao"
          :editor="editor"
          :items="itensDaBolha(editor)"
          layout="bubble"
          size="xs"
          :should-show="mostrarBolha"
          data-bolha-do-campo
          class="relative z-50 rounded-lg border border-default bg-default p-0.5 shadow-lg"
        >
          <template #link>
            <PopoverDeLink :t="t" :editor="editor" :portal="false" tamanho="xs" />
          </template>
          <template #cor>
            <SeletorDeCor :t="t" :editor="editor" :portal="false" />
          </template>
        </UEditorToolbar>

        <UEditorSuggestionMenu
          :editor="editor"
          :items="itensDoMenu"
          :filter-fields="['label', 'palavras']"
          :ui="{ itemDescription: 'text-xs' }"
        />
        <UEditorMentionMenu :editor="editor" :items="itensDeMencao" />
        <UEditorEmojiMenu :editor="editor" :items="itensDeEmoji" />

        <!-- ALÇA DO BLOCO: + abre o "/", ⠿ arrasta e abre o menu -->
        <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor" @node-change="blocoDaAlca = $event">
          <UTooltip :text="t.bloco.adicionar">
            <UButton
              icon="i-lucide-plus"
              color="neutral"
              variant="ghost"
              size="xs"
              :class="ui.handle()"
              :aria-label="t.bloco.adicionar"
              @click="(e: MouseEvent) => { e.stopPropagation(); const s = onClick(); todos.suggestion?.execute(editor, { pos: s?.pos }).run() }"
            />
          </UTooltip>
          <UDropdownMenu
            v-slot="{ open }"
            :modal="false"
            :items="itensDaAlca(editor)"
            :content="{ side: 'left', align: 'start' }"
            :ui="{ content: 'w-64', label: 'text-xs' }"
            @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
          >
            <UButton
              icon="i-lucide-grip-vertical"
              color="neutral"
              variant="ghost"
              active-variant="soft"
              size="xs"
              :active="open"
              :class="ui.handle()"
              :aria-label="t.bloco.arrastar"
              :title="t.bloco.arrastar"
            />
          </UDropdownMenu>
        </UEditorDragHandle>
      </UEditor>

      <!-- PÉ DO CAMPO: contagem -->
      <div class="flex items-center justify-end border-t border-default/60 px-3 py-1 text-[11px] text-dimmed" aria-live="off">
        {{ contagem }}
      </div>

      <!-- CAIXA DO BENI -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1 scale-[0.99]"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div v-if="caixa" :key="caixa.chave" data-caixa-do-beni class="absolute inset-x-2 z-30 origin-top scroll-mb-20" :style="{ top: `${caixa.topo}px` }">
          <CaixaDoBeni
            v-model:agente="agente"
            v-model:modelo="modelo"
            v-model:usar-campos="usarCampos"
            :t="t"
            :com-selecao="caixa.comSelecao"
            :campo-vazio="caixa.campoVazio"
            :rotulo-do-campo="rotulo"
            :pedidos-salvos="pedidosSalvos"
            @pedir="(p) => ed() && executar(ed()!, p)"
            @fechar="fecharCaixa()"
          />
        </div>
      </Transition>

      <!-- BARRA DA PROPOSTA -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div v-if="sessao" data-barra-da-proposta class="absolute inset-x-2 z-30 scroll-mb-20 transition-[top] duration-100" :style="{ top: `${sessao.topo}px` }">
          <BarraDaProposta
            :t="t"
            :fase="sessao.fase"
            :rotulo="sessao.rotulo"
            :agente="agente"
            :modelo="nomeDoModelo"
            :com-selecao="sessao.ctx.comSelecao && sessao.modo === 'substituir'"
            :notas="sessao.notas"
            :sem-roteiro="sessao.semRoteiro"
            :interrompido="sessao.interrompido"
            :pode-salvar="sessao.podeSalvar && sessao.fase === 'pronto'"
            @aceitar="aplicar()"
            @abaixo="aplicar(true)"
            @descartar="descartar"
            @tentar="tentar"
            @parar="parar"
            @ajustar="ajustar"
            @salvar="salvarPedido"
            @feedback="feedback"
          />
        </div>
      </Transition>
    </div>
  </UFormField>
</template>
