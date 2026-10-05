<script setup lang="ts">
/**
 * O link do editor de e-mail. É o `EditorLinkPopover` dos exemplos oficiais do
 * Nuxt UI (MCP `get-example`), com os textos traduzidos. Sem ele, o
 * `kind: 'link'` do `UEditorToolbar` abre um `prompt()` do navegador, em
 * inglês e com a cara do sistema operacional.
 */
import type { Editor } from '@tiptap/vue-3'
import type { Textos } from './textos'

const props = defineProps<{ editor: Editor, t: Textos }>()

const open = ref(false)
const url = ref('')

const active = computed(() => props.editor.isActive('link'))
const disabled = computed(() => {
  if (!props.editor.isEditable) return true
  const { selection } = props.editor.state
  return selection.empty && !props.editor.isActive('link')
})

watch(() => props.editor, (editor, _, onCleanup) => {
  if (!editor) return
  const atualizar = () => {
    url.value = editor.getAttributes('link').href || ''
  }
  atualizar()
  editor.on('selectionUpdate', atualizar)
  onCleanup(() => editor.off('selectionUpdate', atualizar))
}, { immediate: true })

function aplicar() {
  if (!url.value) return
  const vazio = props.editor.state.selection.empty
  let chain = props.editor.chain().focus().extendMarkRange('link').setLink({ href: url.value })
  if (vazio) chain = chain.insertContent({ type: 'text', text: url.value })
  chain.run()
  open.value = false
}

function remover() {
  props.editor.chain().focus().extendMarkRange('link').unsetLink().setMeta('preventAutolink', true).run()
  url.value = ''
  open.value = false
}

function abrir() {
  if (url.value) window.open(url.value, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <UPopover v-model:open="open" :ui="{ content: 'p-0.5' }">
    <UTooltip :text="t.compositor.link.botao">
      <UButton
        icon="i-lucide-link"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="active"
        :disabled="disabled"
        :aria-label="t.compositor.link.botao"
      />
    </UTooltip>

    <template #content>
      <UInput
        v-model="url"
        autofocus
        name="url"
        type="url"
        variant="none"
        :placeholder="t.compositor.link.colar"
        @keydown.enter.prevent="aplicar"
      >
        <div class="mr-0.5 flex items-center">
          <UButton icon="i-lucide-corner-down-left" variant="ghost" size="sm" :disabled="!url && !active" :aria-label="t.compositor.link.aplicar" @click="aplicar" />
          <USeparator orientation="vertical" class="mx-1 h-6" />
          <UButton icon="i-lucide-external-link" color="neutral" variant="ghost" size="sm" :disabled="!url && !active" :aria-label="t.compositor.link.abrir" @click="abrir" />
          <UButton icon="i-lucide-trash" color="neutral" variant="ghost" size="sm" :disabled="!url && !active" :aria-label="t.compositor.link.remover" @click="remover" />
        </div>
      </UInput>
    </template>
  </UPopover>
</template>
