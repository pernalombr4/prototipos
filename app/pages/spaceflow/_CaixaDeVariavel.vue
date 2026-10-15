<script setup lang="ts">
/**
 * O lugar de uma variável só (Data de partida, Item, Item vinculado, um arquivo).
 *
 * Proposta: a variável aparece como etiqueta com o nome legível e o nó de
 * origem ("Contratante · Contrato criado"), e a chave técnica fica no tooltip
 * e num clique (para quem configura escrevendo). Hoje o develop mostra a
 * chave crua ou um select "Por favor, selecione". É o padrão aprovado no
 * protótipo `no-de-atraso` (rodada 6), estendido aos outros nós.
 */
import type { No } from './mocks'
import type { Textos } from './textos'
import { indiceDeVariaveis } from './apoio'

const props = defineProps<{
  t: Textos
  nos: No[]
  placeholder?: string
  /** Pinta de vermelho (obrigatório vazio, depois de pedir para ver). */
  erro?: boolean
  /** É o campo que recebe o clique em Variáveis de entrada. */
  marcado?: boolean
}>()
const valor = defineModel<string | null | undefined>({ required: true })
const emit = defineEmits<{ marcar: [] }>()

const lida = computed(() => {
  const m = valor.value?.match(/^\{\{\s*([^}]+?)\s*\}\}$/)
  return m ? indiceDeVariaveis(props.nos).get(m[1]!) : undefined
})

const editando = ref(false)
const sobre = ref(false)
const entrada = ref<{ inputRef?: HTMLInputElement } | null>(null)
const mostrarTexto = computed(() => editando.value || (!!valor.value?.trim() && !lida.value))

function editar() {
  editando.value = true
  nextTick(() => entrada.value?.inputRef?.focus())
}
function soltar(e: DragEvent) {
  sobre.value = false
  const chave = e.dataTransfer?.getData('text/plain')
  if (chave) valor.value = chave
  editando.value = false
}
</script>

<template>
  <div
    class="rounded-md transition-shadow"
    :class="sobre || marcado ? 'ring-2 ring-primary ring-offset-2 ring-offset-(--ui-bg)' : ''"
    @dragenter.prevent="sobre = true"
    @dragover.prevent
    @dragleave="sobre = false"
    @drop.prevent="soltar"
  >
    <UInput
      v-if="mostrarTexto"
      ref="entrada"
      v-model="valor as string"
      icon="i-lucide-braces"
      class="w-full"
      :color="erro ? 'error' : 'primary'"
      :highlight="erro"
      :ui="{ base: 'font-mono text-xs' }"
      @blur="editando = false"
      @keydown.enter="editando = false"
    />
    <UTooltip v-else-if="lida" :text="valor ?? ''" :ui="{ content: 'h-auto', text: 'font-mono whitespace-normal' }">
      <span class="flex h-8 w-full items-center gap-1.5 rounded-md bg-primary/10 px-2 text-sm text-highlighted ring ring-inset ring-primary/30">
        <UIcon name="i-lucide-variable" class="size-4 shrink-0 text-primary" />
        <button type="button" class="min-w-0 flex-1 truncate text-left" :aria-label="lida.chave" @click="editar">
          <span class="font-medium">{{ lida.rotulo }}</span>
          <span class="text-muted"> · {{ lida.no }}</span>
        </button>
        <UButton icon="i-lucide-x" color="neutral" variant="link" size="xs" :aria-label="t.modal.removerVariavel" @click="valor = null" />
      </span>
    </UTooltip>
    <button
      v-else
      type="button"
      class="flex h-8 w-full items-center gap-1.5 rounded-md border border-dashed px-2 text-left text-sm transition-colors hover:bg-elevated"
      :class="sobre ? 'border-primary bg-primary/5 text-primary' : erro ? 'border-error text-error' : 'border-accented text-muted'"
      @click="emit('marcar')"
    >
      <UIcon name="i-lucide-variable" class="size-4 shrink-0" />
      <span class="truncate">{{ sobre ? t.modal.soltarAqui : (placeholder ?? t.modal.inserirVariavel) }}</span>
    </button>
  </div>
</template>
