<script setup lang="ts">
/**
 * Corpo do apontamento: texto rico em TipTap pelo `UEditor`, como o campo HTML
 * do produto (regra 39). Barra enxuta: desfazer, refazer, negrito, itálico,
 * código e listas. Print entra como anexo, não no corpo (ver DECISOES).
 */
import type { EditorToolbarItem } from '@nuxt/ui'

defineProps<{ placeholder?: string, autofocus?: boolean }>()
const valor = defineModel<string>({ required: true })

const itens: EditorToolbarItem[][] = [
  [
    { kind: 'undo', icon: 'i-lucide-undo-2' },
    { kind: 'redo', icon: 'i-lucide-redo-2' },
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code' },
  ],
  [
    { kind: 'bulletList', icon: 'i-lucide-list' },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
  ],
]
</script>

<template>
  <ClientOnly>
    <div class="rounded-md border border-accented bg-default transition-[border-color,box-shadow] duration-150 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15">
      <UEditor
        v-slot="{ editor }"
        v-model="valor"
        content-type="html"
        :placeholder="placeholder"
        :autofocus="autofocus ? 'end' : false"
        :ui="{ base: 'min-h-28 px-3 py-2 text-sm *:my-1.5 focus:outline-none' }"
      >
        <div class="flex items-center gap-1 border-b border-default px-1 py-0.5">
          <UEditorToolbar :editor="editor" :items="itens" size="xs" class="flex-1" />
        </div>
      </UEditor>
    </div>
    <template #fallback>
      <USkeleton class="h-36 w-full" />
    </template>
  </ClientOnly>
</template>
