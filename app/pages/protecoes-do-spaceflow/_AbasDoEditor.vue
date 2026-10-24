<script setup lang="ts">
/**
 * A barra de abas do editor do Spaceflow.
 *
 * Cópia do develop (24/10/2026): botão redondo de detalhes, Editor, Execuções,
 * Versões, Comentários e Logs, e as setas de versão à direita.
 *
 * PROPOSTA: a aba Proteções, depois de Execuções. Com o fluxo pausado pela
 * proteção, ela ganha um ponto de aviso, e o status "Pausado" aparece ao lado
 * das setas de versão.
 */
import type { Textos } from './textos'

export type Aba = 'editor' | 'execucoes' | 'protecoes' | 'versoes' | 'comentarios' | 'logs'

const props = defineProps<{
  t: Textos
  /** Na versão "Como é hoje" a aba Proteções não existe. */
  comProtecoes: boolean
  pausado: boolean
}>()

const aba = defineModel<Aba>({ required: true })

const abas = computed(() => {
  const todas: { valor: Aba, icone: string, nova?: boolean }[] = [
    { valor: 'editor', icone: 'i-lucide-git-fork' },
    { valor: 'execucoes', icone: 'i-lucide-play' },
    { valor: 'protecoes', icone: 'i-lucide-shield-check', nova: true },
    { valor: 'versoes', icone: 'i-lucide-history' },
    { valor: 'comentarios', icone: 'i-lucide-message-circle' },
    { valor: 'logs', icone: 'i-lucide-scroll-text' },
  ]
  return props.comProtecoes ? todas : todas.filter(a => !a.nova)
})
</script>

<template>
  <div class="flex h-11 shrink-0 items-center gap-1 border-b border-default px-3" role="tablist">
    <UButton icon="i-lucide-file" color="neutral" variant="outline" size="xs" class="mr-2 rounded-full" :aria-label="t.editor.detalhes" />
    <UButton
      v-for="a in abas"
      :key="a.valor"
      role="tab"
      :aria-selected="aba === a.valor"
      :icon="a.icone"
      :label="t.editor.abas[a.valor]"
      :color="aba === a.valor ? 'primary' : 'neutral'"
      variant="ghost"
      size="xs"
      class="relative"
      @click="aba = a.valor"
    >
      <template v-if="a.valor === 'protecoes' && pausado" #trailing>
        <span class="size-1.5 rounded-full bg-warning" aria-hidden="true" />
      </template>
    </UButton>

    <span class="ml-auto flex items-center gap-2">
      <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
        <UBadge v-if="pausado" :label="t.editor.protecoesPausado" icon="i-lucide-circle-pause" color="warning" variant="subtle" size="sm" />
      </Transition>
      <span class="flex items-center gap-1 border-l border-default pl-3 text-xs text-muted">
        <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="xs" :aria-label="t.editor.versoes" />
        2/5
        <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" :aria-label="t.editor.versoes" />
      </span>
    </span>
  </div>
</template>
