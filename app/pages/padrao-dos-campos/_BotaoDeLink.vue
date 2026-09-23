<script setup lang="ts">
/**
 * O BOTÃO DE LINK DO EDITOR DE TEXTO RICO.
 *
 * Por que ele existe: o `UEditorToolbar` do Nuxt UI tem o `kind: 'link'`, e o
 * handler dele chama um `prompt()` do navegador com o texto "Enter the URL:".
 * Em inglês, fora do nosso alternador de idioma e com a cara do sistema
 * operacional em vez da do produto. Num protótipo que existe para julgar
 * interface, isso não entra.
 *
 * O que ele faz, na ordem em que o Notion faz:
 *
 * 1. com texto selecionado, abre com o texto preenchido e o endereço vazio;
 * 2. com o cursor dentro de um link, abre com os dois preenchidos e oferece
 *    Abrir e Remover;
 * 3. sem seleção, os dois campos vêm vazios e o endereço vira o texto quando
 *    ninguém escreve um;
 * 4. Enter aplica, Esc fecha sem mexer em nada.
 *
 * O endereço é normalizado: quem digita `enspace.io` recebe
 * `https://enspace.io`, porque link sem esquema não navega.
 */
import type { Textos } from './textos'

/*
 * A CADEIA E O EDITOR, tipados pelo que este arquivo usa de verdade.
 *
 * O TipTap está instalado (é dependência do `UEditor`), mas importar o tipo
 * `Editor` dele aqui amarraria o protótipo a um pacote que não é nosso nem do
 * SDK. Esta interface mínima diz exatamente quais comandos o botão precisa, o
 * que também serve de especificação para quem for implementar.
 */
interface CadeiaDoEditor {
  focus: () => CadeiaDoEditor
  extendMarkRange: (marca: string) => CadeiaDoEditor
  setLink: (atributos: { href: string }) => CadeiaDoEditor
  unsetLink: () => CadeiaDoEditor
  insertContent: (conteudo: unknown) => CadeiaDoEditor
  run: () => boolean
}

interface EditorDoCampo {
  chain: () => CadeiaDoEditor
  isActive: (nome: string) => boolean
  getAttributes: (nome: string) => Record<string, unknown>
  state: {
    selection: { empty: boolean, from: number, to: number }
    doc: { textBetween: (de: number, ate: number, separador?: string) => string }
  }
}

const props = defineProps<{
  editor: EditorDoCampo
  t: Textos
}>()

const aberto = ref(false)
const endereco = ref('')
const texto = ref('')
const textoOriginal = ref('')

/**
 * Cursor dentro de um link? É FUNÇÃO, e não `computed`, de propósito.
 *
 * O `isActive` do TipTap lê o estado do editor, que não é fonte reativa do
 * Vue: um `computed` em cima dele calcula uma vez e nunca mais, e o popover
 * abria sempre no modo "link novo", mesmo com o cursor dentro de um link. O
 * `UEditorToolbar` do Nuxt UI resolve do mesmo jeito, chamando na renderização,
 * e funciona porque o `UEditor` redesenha a cada transação e leva o slot com
 * ele. Achado consertando este botão.
 */
function ehLink(): boolean {
  return props.editor?.isActive('link') ?? false
}

/** O que `aoAbrir` leu do editor, para o rodapé do popover não recalcular. */
const eraLink = ref(false)

/** Endereço vazio não aplica: link sem destino é só texto azul. */
const podeAplicar = computed(() => endereco.value.trim().length > 0)

/** Sem esquema o navegador trata o endereço como caminho relativo. */
function normalizar(valor: string): string {
  const limpo = valor.trim()
  if (!limpo) return ''
  if (/^(https?:|mailto:|tel:)/i.test(limpo)) return limpo
  if (limpo.includes('@') && !limpo.includes('/')) return `mailto:${limpo}`
  return `https://${limpo}`
}

/** Ao abrir, o popover lê o estado do editor em vez de começar em branco. */
function aoAbrir() {
  const ed = props.editor
  eraLink.value = ehLink()

  /*
   * Cursor DENTRO de um link: a seleção é esticada para o link inteiro antes
   * de qualquer leitura.
   *
   * Sem isso, quem clicava no meio da palavra via o campo de texto com uma
   * letra só ("u", de Laudo), e aplicar trocava o link inteiro por essa letra,
   * porque o `extendMarkRange` do aplicar age sobre a marca toda. Esticar
   * aqui também dá o retorno visual certo: o link fica realçado enquanto o
   * popover está aberto, como no Notion.
   */
  if (eraLink.value) {
    ed.chain().focus().extendMarkRange('link').run()
  }

  const { from, to, empty } = ed.state.selection
  textoOriginal.value = empty ? '' : ed.state.doc.textBetween(from, to, ' ')
  texto.value = textoOriginal.value
  endereco.value = eraLink.value ? String(ed.getAttributes('link').href ?? '') : ''
  aberto.value = true
}

function aplicar() {
  if (!podeAplicar.value) return
  const href = normalizar(endereco.value)
  const escrito = texto.value.trim()
  const cadeia = props.editor.chain().focus().extendMarkRange('link')

  /*
   * Texto mudou (ou nunca existiu): o conteúdo é substituído por um nó de
   * texto já com a marca de link. Texto igual ao que estava: só a marca entra,
   * para não perder a formatação que o trecho já tinha por dentro.
   */
  if (escrito && escrito !== textoOriginal.value) {
    cadeia.insertContent({
      type: 'text',
      text: escrito,
      marks: [{ type: 'link', attrs: { href } }],
    })
  }
  else if (!escrito && !textoOriginal.value) {
    /* Ninguém escreveu texto: o endereço vira o rótulo, como no Notion. */
    cadeia.insertContent({
      type: 'text',
      text: endereco.value.trim(),
      marks: [{ type: 'link', attrs: { href } }],
    })
  }
  else {
    cadeia.setLink({ href })
  }

  cadeia.run()
  aberto.value = false
}

function remover() {
  props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
  aberto.value = false
}

function abrir() {
  const href = normalizar(endereco.value)
  if (href) window.open(href, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', side: 'bottom' }">
    <UTooltip :text="t.linkInserir">
      <UButton
        icon="i-lucide-link"
        :color="ehLink() ? 'primary' : 'neutral'"
        :variant="ehLink() ? 'soft' : 'ghost'"
        size="sm"
        :aria-label="t.linkInserir"
        @click.prevent="aoAbrir()"
      />
    </UTooltip>

    <template #content>
      <div class="w-72 space-y-2 p-2.5">
        <div>
          <p class="mb-1 text-xs font-medium text-highlighted">{{ t.linkEndereco }}</p>
          <UInput
            v-model="endereco"
            size="sm"
            class="w-full"
            autofocus
            placeholder="enspace.io"
            @keydown.enter.prevent="aplicar()"
          />
        </div>

        <div>
          <p class="mb-1 text-xs font-medium text-highlighted">{{ t.linkTexto }}</p>
          <UInput
            v-model="texto"
            size="sm"
            class="w-full"
            :placeholder="endereco.trim() || t.linkTextoVazio"
            @keydown.enter.prevent="aplicar()"
          />
        </div>

        <div class="flex items-center justify-between gap-2 border-t border-default pt-2">
          <span class="flex items-center gap-0.5">
            <UTooltip v-if="eraLink" :text="t.linkAbrir">
              <UButton
                icon="i-lucide-external-link"
                color="neutral"
                variant="ghost"
                size="xs"
                :aria-label="t.linkAbrir"
                @click="abrir()"
              />
            </UTooltip>
            <UTooltip v-if="eraLink" :text="t.linkRemover">
              <UButton
                icon="i-lucide-unlink"
                color="error"
                variant="ghost"
                size="xs"
                :aria-label="t.linkRemover"
                @click="remover()"
              />
            </UTooltip>
          </span>
          <UButton
            :label="t.linkAplicar"
            color="primary"
            size="xs"
            :disabled="!podeAplicar"
            @click="aplicar()"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
