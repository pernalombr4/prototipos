<script setup lang="ts">
/**
 * O campo "Editor de texto HTML" do formulário do item, com a BENI.
 *
 * O QUE É CÓPIA do develop (medido no protótipo padrao-dos-campos, BRIEFING
 * 6.2): a barra fixa, nesta ordem, com desfazer, refazer, título, negrito,
 * itálico, sublinhado, tachado, código, emoji, alinhamento e mais; o menu "/"
 * e o placeholder com "/".
 *
 * O QUE É PROPOSTA:
 * - o botão IA no começo da barra, que muda o menu conforme haja trecho
 *   selecionado ou não (Ctrl J abre a caixa direto);
 * - o grupo BENI (IA) no topo do menu "/" (digitar "/ia" filtra);
 * - a caixa da BENI (_CaixaDaBeni.vue) abaixo do trecho, com o trecho realçado
 *   enquanto ela está aberta, e o realce do texto que entrou ao aceitar;
 * - o placeholder cita a IA.
 *
 * Os comandos de IA são handlers do UEditor (`kind: 'beni'`): o mesmo item
 * serve à barra e ao "/", que é o contrato que o dev vai implementar.
 */
import type { EditorCustomHandlers, EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { AcaoInicial } from './_CaixaDaBeni.vue'
import type { Acao } from './simulador'
import CaixaDaBeni from './_CaixaDaBeni.vue'

const props = defineProps<{
  t: Textos
  rotulo: string
  iaLigada: boolean
  falhar: boolean
}>()

const valor = defineModel<string>({ required: true })
const toast = useToast()

/*
 * O editor, tipado só pelo que este arquivo usa (como em padrao-dos-campos:
 * o TipTap não é dependência direta do protótipo).
 */
interface Cadeia {
  focus: () => Cadeia
  insertContentAt: (onde: number | { from: number, to: number }, conteudo: string) => Cadeia
  setTextSelection: (s: number | { from: number, to: number }) => Cadeia
  insertContent: (c: string) => Cadeia
  undo: () => Cadeia
  run: () => boolean
}
interface Editor {
  isEmpty: boolean
  isEditable: boolean
  chain: () => Cadeia
  state: {
    selection: { from: number, to: number, empty: boolean }
    doc: {
      content: { size: number }
      textBetween: (a: number, b: number, sep: string) => string
      resolve: (pos: number) => { depth: number, after: (d: number) => number, before: (d: number) => number, parent: { content: { size: number } } }
    }
  }
  view: {
    coordsAtPos: (pos: number) => { top: number, bottom: number, left: number }
    domAtPos: (pos: number) => { node: Node, offset: number }
  }
}

const moldura = useTemplateRef<HTMLElement>('moldura')
const editorRef = useTemplateRef<{ editor: Editor | undefined }>('editorRef')

/* ------------------------------------------------------- a caixa ---- */

interface Caixa {
  chave: number
  inicial?: AcaoInicial
  comSelecao: boolean
  texto: string
  campoVazio: boolean
  from: number
  to: number
  abaixo: number
  /** O cursor está numa linha vazia: a resposta ocupa a linha em vez de entrar depois dela. */
  linhaVazia: { from: number, to: number } | null
  topo: number
}
const caixa = ref<Caixa | null>(null)
let chave = 0

interface Retangulo { left: number, top: number, width: number, height: number }
const realceDaSelecao = ref<Retangulo[]>([])
const realceDoInserido = ref<Retangulo[]>([])
const inseridoVisivel = ref(false)

function retangulosDe(editor: Editor, from: number, to: number): Retangulo[] {
  if (!moldura.value || from >= to) return []
  const a = editor.view.domAtPos(from)
  const b = editor.view.domAtPos(to)
  const range = document.createRange()
  try {
    range.setStart(a.node, a.offset)
    range.setEnd(b.node, b.offset)
  }
  catch {
    return []
  }
  const base = moldura.value.getBoundingClientRect()
  // Só os retângulos de linha: o do bloco inteiro (parágrafo) viria junto e escureceria o realce.
  return [...range.getClientRects()]
    .filter(r => r.width > 1 && r.height < 40)
    .map(r => ({ left: r.left - base.left, top: r.top - base.top, width: r.width, height: r.height }))
}

function abrirCaixa(editor: Editor, inicial?: AcaoInicial) {
  if (!props.iaLigada || !moldura.value) return
  const doc = editor.state.doc
  let { from, to } = editor.state.selection
  const { empty } = editor.state.selection
  // Sem cursor posto no campo (veio da barra sem clicar no texto): a BENI escreve no fim, não no começo.
  if (empty && from <= 1 && !editor.isEmpty) from = to = doc.content.size - 1
  const comSelecao = !empty
  const base = moldura.value.getBoundingClientRect()
  const fim = editor.view.coordsAtPos(to)
  const $to = doc.resolve(to)
  caixa.value = {
    chave: ++chave,
    inicial,
    comSelecao,
    texto: comSelecao ? doc.textBetween(from, to, '\n') : doc.textBetween(0, doc.content.size, '\n'),
    campoVazio: editor.isEmpty,
    from,
    to,
    abaixo: $to.depth ? $to.after(1) : doc.content.size,
    linhaVazia: empty && $to.depth > 0 &&!$to.parent.content.size ? { from: $to.before(1), to: $to.after(1) } : null,
    topo: fim.bottom - base.top + 8,
  }
  realceDaSelecao.value = comSelecao ? retangulosDe(editor, from, to) : []
}

function fecharCaixa(devolverFoco = true) {
  const c = caixa.value
  caixa.value = null
  realceDaSelecao.value = []
  const editor = editorRef.value?.editor
  if (devolverFoco && c && editor) editor.chain().focus().setTextSelection({ from: c.from, to: c.to }).run()
}

/** Um parágrafo só entra como texto corrido, para não quebrar o parágrafo onde cai. */
function comoConteudo(html: string) {
  const unico = html.match(/^<p>([\s\S]*?)<\/p>$/)
  return unico && !unico[1]!.includes('<p>') ? unico[1]! : html
}

function aplicar(html: string, onde: 'substituir' | 'abaixo' | 'cursor') {
  const editor = editorRef.value?.editor
  const c = caixa.value
  if (!editor || !c) return
  const antes = editor.state.doc.content.size
  let inicio: number
  let removido = 0

  if (c.campoVazio) {
    inicio = 0
    removido = antes
    editor.chain().focus().insertContentAt({ from: 0, to: antes }, html).run()
  }
  else if (onde === 'substituir') {
    inicio = c.from
    removido = c.to - c.from
    editor.chain().focus().insertContentAt({ from: c.from, to: c.to }, comoConteudo(html)).run()
  }
  else if (onde === 'abaixo') {
    inicio = c.abaixo
    editor.chain().focus().insertContentAt(c.abaixo, html).run()
  }
  else if (c.linhaVazia) {
    // Linha vazia (o caso do "/" numa linha nova): a resposta ocupa a linha.
    inicio = c.linhaVazia.from
    removido = c.linhaVazia.to - c.linhaVazia.from
    editor.chain().focus().insertContentAt(c.linhaVazia, html).run()
  }
  else {
    // Cursor no meio do texto: a resposta entra como bloco novo, logo depois do parágrafo do cursor.
    inicio = c.abaixo
    editor.chain().focus().insertContentAt(c.abaixo, html).run()
  }

  const fim = inicio + (editor.state.doc.content.size - antes) + removido
  caixa.value = null
  realceDaSelecao.value = []

  // O texto que entrou acende e apaga devagar: a pessoa vê onde a BENI mexeu.
  nextTick(() => {
    realceDoInserido.value = retangulosDe(editor, inicio, fim)
    inseridoVisivel.value = true
    setTimeout(() => { inseridoVisivel.value = false }, 900)
    setTimeout(() => { realceDoInserido.value = [] }, 2200)
  })

  toast.add({
    title: onde === 'substituir' ? props.t.beni.substituido : props.t.beni.inserido,
    icon: 'i-lucide-sparkles',
    color: 'success',
    duration: 5000,
    actions: [{
      label: props.t.beni.desfazer,
      color: 'neutral',
      variant: 'outline',
      onClick: () => { editor.chain().focus().undo().run() },
    }],
  })
}

/* Ctrl J: abre a caixa de qualquer ponto do campo. */
function aoTeclar(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
    e.preventDefault()
    const editor = editorRef.value?.editor
    if (editor && props.iaLigada) abrirCaixa(editor)
  }
}

/* ---------------------------------------------------- handlers ---- */

interface ItemBeni { acao?: Acao, parametro?: string, rotuloDaAcao?: string, precisaTexto?: boolean }

const handlers = {
  beni: {
    canExecute: () => props.iaLigada,
    execute: (editor: Editor, item?: ItemBeni) => {
      // O menu "/" ainda está fechando quando o handler roda: a caixa abre no tique seguinte.
      setTimeout(() => abrirCaixa(editor, item?.acao ? { acao: item.acao, parametro: item.parametro, rotulo: item.rotuloDaAcao! } : undefined))
      return editor.chain()
    },
    isActive: () => false,
    isDisabled: (editor: Editor, item?: ItemBeni) => !props.iaLigada || (!!item?.precisaTexto && editor.isEmpty),
  },
  /* MAQUETE: o alinhamento precisa da extensão TextAlign, que o protótipo não tem. */
  alinhar: {
    canExecute: () => true,
    execute: (editor: Editor) => editor.chain(),
    isActive: () => false,
  },
} satisfies EditorCustomHandlers

type ItemDaBarra = EditorToolbarItem<typeof handlers>

const tb = computed(() => props.t.beni)
const te = computed(() => props.t.editor)

/** O menu do botão IA. Com trecho selecionado, as ações são sobre o trecho; sem, sobre o campo. */
function menuDaIa(editor: Editor) {
  const comSelecao = !editor.state.selection.empty
  const b = (acao: Acao, rotuloDaAcao: string, icon: string, extra: Record<string, unknown> = {}) =>
    ({ kind: 'beni' as const, acao, rotuloDaAcao, label: rotuloDaAcao, icon, ...extra })
  const pedir = { kind: 'beni' as const, label: tb.value.pedir, icon: 'i-lucide-message-square-text', kbds: ['ctrl', 'j'] }

  if (comSelecao) {
    return [[
      { type: 'label' as const, label: tb.value.grupoSelecao },
      b('melhorar', tb.value.melhorar, 'i-lucide-wand-sparkles'),
      b('corrigir', tb.value.corrigir, 'i-lucide-spell-check'),
      b('encurtar', tb.value.encurtar, 'i-lucide-fold-vertical'),
      b('expandir', tb.value.expandir, 'i-lucide-unfold-vertical'),
      {
        label: tb.value.tom,
        icon: 'i-lucide-mic-vocal',
        children: (['formal', 'amigavel', 'direto'] as const).map(k =>
          b('tom', tb.value.paraTom(tb.value.tons[k]!), 'i-lucide-dot', { parametro: k, label: tb.value.tons[k], icon: undefined })),
      },
      {
        label: tb.value.traduzir,
        icon: 'i-lucide-languages',
        children: (['pt', 'en', 'es'] as const).map(k =>
          b('traduzir', tb.value.paraIdioma(tb.value.idiomas[k]!), 'i-lucide-dot', { parametro: k, label: tb.value.idiomas[k], icon: undefined })),
      },
      b('resumir', tb.value.resumirSelecao, 'i-lucide-list'),
    ], [pedir]]
  }
  return [[
    { type: 'label' as const, label: tb.value.grupoCampo },
    pedir,
    b('continuar', tb.value.continuar, 'i-lucide-pen-line', { precisaTexto: true }),
    b('resumir', tb.value.resumir, 'i-lucide-list', { precisaTexto: true }),
    b('rascunhar', tb.value.rascunhar, 'i-lucide-file-pen-line'),
  ]]
}

/** A barra fixa: a de hoje, com o botão IA na frente. */
function itensDaBarra(editor: Editor): ItemDaBarra[][] {
  const botaoIa: ItemDaBarra = props.iaLigada
    ? {
        icon: 'i-lucide-sparkles',
        label: tb.value.botao,
        color: 'primary',
        variant: 'soft',
        activeColor: 'primary',
        activeVariant: 'soft',
        tooltip: { text: tb.value.dica, kbds: ['ctrl', 'j'] },
        content: { align: 'start' },
        ui: { content: 'w-64' },
        items: menuDaIa(editor),
      } as ItemDaBarra
    : {
        // IA desligada: o botão continua no lugar, apagado, e a dica diz por quê e onde ligar.
        slot: 'iaDesligada' as const,
      }

  return [
    [botaoIa],
    [
      { kind: 'undo', icon: 'i-lucide-undo-2', tooltip: { text: te.value.desfazer, kbds: ['ctrl', 'z'] } },
      { kind: 'redo', icon: 'i-lucide-redo-2', tooltip: { text: te.value.refazer, kbds: ['ctrl', 'y'] } },
    ],
    [{
      icon: 'i-lucide-heading',
      tooltip: { text: te.value.titulo },
      content: { align: 'start' },
      items: [
        { kind: 'heading', level: 1, icon: 'i-lucide-heading-1', label: te.value.titulo1 },
        { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', label: te.value.titulo2 },
        { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', label: te.value.titulo3 },
      ],
    }],
    [
      { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: te.value.negrito, kbds: ['ctrl', 'b'] } },
      { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: te.value.italico, kbds: ['ctrl', 'i'] } },
      { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: te.value.sublinhado, kbds: ['ctrl', 'u'] } },
      { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: te.value.tachado } },
      { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: te.value.codigo } },
    ],
    [
      { slot: 'emoji' as const },
      {
        icon: 'i-lucide-align-left',
        tooltip: { text: te.value.alinhamento },
        content: { align: 'start' },
        items: [
          { kind: 'alinhar', icon: 'i-lucide-align-left', label: te.value.alinharEsquerda },
          { kind: 'alinhar', icon: 'i-lucide-align-center', label: te.value.centralizar },
          { kind: 'alinhar', icon: 'i-lucide-align-right', label: te.value.alinharDireita },
          { kind: 'alinhar', icon: 'i-lucide-align-justify', label: te.value.justificar },
        ],
      },
      {
        icon: 'i-lucide-ellipsis',
        tooltip: { text: te.value.mais },
        content: { align: 'end' },
        items: [
          { kind: 'bulletList', icon: 'i-lucide-list', label: te.value.lista },
          { kind: 'orderedList', icon: 'i-lucide-list-ordered', label: te.value.listaNumerada },
          { kind: 'blockquote', icon: 'i-lucide-text-quote', label: te.value.citacao },
          { kind: 'codeBlock', icon: 'i-lucide-square-code', label: te.value.blocoDeCodigo },
          { kind: 'horizontalRule', icon: 'i-lucide-minus', label: te.value.divisor },
          { kind: 'clearFormatting', icon: 'i-lucide-remove-formatting', label: te.value.limparFormatacao },
        ],
      },
    ],
  ] as ItemDaBarra[][]
}

/** O menu "/": o grupo da BENI no topo, os grupos de formatação embaixo. */
const itensDoMenu = computed(() => {
  const ia = (acao: Acao | undefined, label: string, description: string, icon: string, extra: Record<string, unknown> = {}) =>
    ({ kind: 'beni', acao, rotuloDaAcao: label, label, description, icon, palavras: 'ia ai beni', ...extra })
  const grupos: unknown[][] = []
  if (props.iaLigada) {
    grupos.push([
      { type: 'label', label: tb.value.grupoMenu },
      ia(undefined, tb.value.pedir, tb.value.pedirDescricao, 'i-lucide-sparkles'),
      ia('continuar', tb.value.continuar, tb.value.continuarDescricao, 'i-lucide-pen-line', { precisaTexto: true }),
      ia('resumir', tb.value.resumir, tb.value.resumirDescricao, 'i-lucide-list', { precisaTexto: true }),
      ia('rascunhar', tb.value.rascunhar, tb.value.rascunharDescricao, 'i-lucide-file-pen-line'),
    ])
  }
  grupos.push(
    [
      { type: 'label', label: te.value.grupoTexto },
      { kind: 'paragraph', label: te.value.paragrafo, icon: 'i-lucide-pilcrow' },
      { kind: 'heading', level: 1, label: te.value.titulo1, icon: 'i-lucide-heading-1' },
      { kind: 'heading', level: 2, label: te.value.titulo2, icon: 'i-lucide-heading-2' },
      { kind: 'heading', level: 3, label: te.value.titulo3, icon: 'i-lucide-heading-3' },
    ],
    [
      { type: 'label', label: te.value.grupoListas },
      { kind: 'bulletList', label: te.value.lista, icon: 'i-lucide-list' },
      { kind: 'orderedList', label: te.value.listaNumerada, icon: 'i-lucide-list-ordered' },
    ],
    [
      { type: 'label', label: te.value.grupoInserir },
      { kind: 'blockquote', label: te.value.citacao, icon: 'i-lucide-text-quote' },
      { kind: 'codeBlock', label: te.value.blocoDeCodigo, icon: 'i-lucide-square-code' },
      { kind: 'horizontalRule', label: te.value.divisor, icon: 'i-lucide-minus' },
    ],
  )
  return grupos as EditorSuggestionMenuItem<typeof handlers>[][]
})

const emojis = ['😀', '🙂', '😉', '🙏', '👍', '👏', '✅', '⚠️', '📌', '📎', '📅', '💡']
</script>

<template>
  <UFormField :label="rotulo" :ui="{ label: 'font-semibold text-highlighted' }">
    <div
      ref="moldura"
      class="relative rounded-md border border-default bg-default transition-[border-color,box-shadow] duration-150 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15"
      @keydown.capture="aoTeclar"
    >
      <UEditor
        ref="editorRef"
        v-slot="{ editor }"
        v-model="valor"
        content-type="html"
        :handlers="handlers"
        :placeholder="iaLigada ? te.placeholder : te.placeholderSemIa"
        :ui="{ base: 'min-h-28 px-3 sm:px-3 py-2.5 text-sm *:my-2 [&_p]:leading-6 focus:outline-none' }"
      >
        <UEditorToolbar
          :editor="editor"
          :items="itensDaBarra(editor)"
          size="sm"
          class="overflow-x-auto rounded-t-md border-b border-default bg-elevated/40 px-1.5 py-1"
        >
          <template #iaDesligada>
            <UTooltip :text="tb.desligada" :content="{ side: 'top' }" :ui="{ content: 'h-auto max-w-72 whitespace-normal py-1.5' }">
              <UButton
                icon="i-lucide-sparkles"
                :label="tb.botao"
                color="neutral"
                variant="ghost"
                size="sm"
                aria-disabled="true"
                class="cursor-not-allowed text-dimmed hover:bg-transparent"
              />
            </UTooltip>
          </template>
          <template #emoji>
            <UPopover :content="{ align: 'start' }">
              <UTooltip :text="te.emoji">
                <UButton icon="i-lucide-smile-plus" color="neutral" variant="ghost" size="sm" :aria-label="te.emoji" />
              </UTooltip>
              <template #content>
                <div class="grid grid-cols-6 gap-0.5 p-1.5">
                  <UButton
                    v-for="e in emojis"
                    :key="e"
                    :label="e"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    class="justify-center text-base"
                    @click="editor.chain().focus().insertContent(e).run()"
                  />
                </div>
              </template>
            </UPopover>
          </template>
        </UEditorToolbar>

        <UEditorSuggestionMenu
          :editor="editor"
          :items="itensDoMenu"
          :filter-fields="['label', 'palavras']"
          :ui="{ content: 'w-72 max-w-72', itemDescription: 'text-xs' }"
        />
      </UEditor>

      <!-- O trecho que a BENI vai mexer, realçado enquanto a caixa está aberta -->
      <div
        v-for="(r, i) in realceDaSelecao"
        :key="`s${i}`"
        class="pointer-events-none absolute rounded-sm bg-primary/15"
        :style="{ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` }"
      />
      <!-- O texto que acabou de entrar: acende e apaga -->
      <div
        v-for="(r, i) in realceDoInserido"
        :key="`i${i}`"
        class="pointer-events-none absolute rounded-sm bg-primary/20 transition-opacity duration-1000 ease-out"
        :class="inseridoVisivel ? 'opacity-100' : 'opacity-0'"
        :style="{ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` }"
      />

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1 scale-[0.99]"
        leave-active-class="transition duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div v-if="caixa" :key="caixa.chave" class="absolute inset-x-2 z-30 origin-top" :style="{ top: `${caixa.topo}px` }">
          <CaixaDaBeni
            :t="t"
            :com-selecao="caixa.comSelecao"
            :texto="caixa.texto"
            :campo-vazio="caixa.campoVazio"
            :rotulo-do-campo="rotulo"
            :inicial="caixa.inicial"
            :falhar="falhar"
            @aplicar="aplicar"
            @fechar="fecharCaixa()"
          />
        </div>
      </Transition>
    </div>
  </UFormField>
</template>
