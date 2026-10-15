<script setup lang="ts">
/**
 * Campo de texto rico do nó (Instruções, Corpo, Prompt). TipTap pelo `UEditor`,
 * como no produto (regra 39), com a barra enxuta: desfazer, refazer, negrito,
 * itálico, sublinhado, listas e o botão de inserir variável.
 *
 * Proposta: o botão {x} na barra abre Variáveis de entrada com este campo
 * marcado; soltar uma variável no texto também insere. Hoje o develop tem a
 * barra completa e a variável entra só por "{{" ou arraste.
 */
import type { Editor } from '@tiptap/core'
import type { EditorToolbarItem } from '@nuxt/ui'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  placeholder?: string
  erro?: boolean
  marcado?: boolean
  aceitaVariavel?: boolean
}>()
const valor = defineModel<string | undefined>({ required: true })
const emit = defineEmits<{ marcar: [] }>()

const editorRef = ref<{ editor?: Editor } | null>(null)

const itens = computed<EditorToolbarItem[][]>(() => [
  [
    { kind: 'undo', icon: 'i-lucide-undo-2', tooltip: { text: 'Ctrl Z' } },
    { kind: 'redo', icon: 'i-lucide-redo-2', tooltip: { text: 'Ctrl Y' } },
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline' },
  ],
  [
    { kind: 'bulletList', icon: 'i-lucide-list' },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
  ],
])

/** Chamado pelo painel de variáveis quando este campo está marcado. */
function inserir(chave: string) {
  const ed = editorRef.value?.editor
  if (ed) ed.chain().focus().insertContent(chave).run()
  else valor.value = `${valor.value ?? ''}${chave}`
}
defineExpose({ inserir })

function soltar(e: DragEvent) {
  const chave = e.dataTransfer?.getData('text/plain')
  if (!chave) return
  e.preventDefault()
  e.stopPropagation()
  inserir(chave)
}
</script>

<template>
  <ClientOnly>
    <div
      class="rounded-md border bg-default transition-[border-color,box-shadow] duration-150 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15"
      :class="[erro ? 'border-error' : 'border-accented', marcado ? 'ring-2 ring-primary ring-offset-2 ring-offset-(--ui-bg)' : '']"
      @drop.capture="soltar"
      @dragover.prevent
    >
      <UEditor
        ref="editorRef"
        v-slot="{ editor }"
        v-model="valor"
        content-type="html"
        :placeholder="placeholder"
        :ui="{ base: 'min-h-24 px-3 py-2 text-sm *:my-1.5 focus:outline-none' }"
      >
        <div class="flex items-center gap-1 border-b border-default px-1 py-0.5">
          <UEditorToolbar :editor="editor" :items="itens" size="xs" class="flex-1" />
          <UTooltip v-if="aceitaVariavel" :text="t.modal.inserirVariavel">
            <UButton
              icon="i-lucide-braces"
              :label="t.modal.inserirVariavel"
              size="xs"
              color="primary"
              variant="soft"
              class="shrink-0"
              @click="emit('marcar')"
            />
          </UTooltip>
        </div>
      </UEditor>
    </div>
    <template #fallback>
      <USkeleton class="h-32 w-full" />
    </template>
  </ClientOnly>
</template>
