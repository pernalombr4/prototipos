<script setup lang="ts">
import { useMenuDoWorkspace } from './estado'
import type { NoDoMenu } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * Os dois avisos do fim da lista, nos dois modelos.
 *
 * "Menu só meu" é da rodada 12: o que está na tela não é mais o que o
 * workspace publicou, com a saída ao lado.
 *
 * "Itens ocultos" é da rodada 14. É o "Show all Spaces" do ClickUp: o que saiu
 * do menu pelo botão direito precisa de um caminho de volta que não dependa
 * de lembrar que ele existia. Só aparece quando há algo oculto.
 */
const props = defineProps<{
  t: TextosDaTela
  rotuloDe: (no: NoDoMenu) => string
}>()

const menu = useMenuDoWorkspace()

const itensDosOcultos = computed(() => [
  menu.ocultos.value.map(no => ({
    label: props.rotuloDe(no),
    icon: no.icone,
    // O ícone do olho no fim diz o que o clique faz, sem um rótulo a mais por linha.
    trailingIcon: 'i-lucide-eye',
    onSelect: () => menu.mostrar(no.id),
  })),
])
</script>

<template>
  <div class="mt-3 space-y-1">
    <UDropdownMenu
      v-if="menu.ocultos.value.length"
      :items="itensDosOcultos"
      :content="{ side: 'right', align: 'end' }"
      :ui="{ content: 'min-w-56' }"
    >
      <button
        type="button"
        class="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-muted transition-colors hover:bg-elevated hover:text-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
      >
        <UIcon name="i-lucide-eye-off" class="size-3.5 shrink-0" />
        <span class="min-w-0 flex-1 truncate text-left">{{ props.t.itensOcultos(menu.ocultos.value.length) }}</span>
        <UIcon name="i-lucide-chevron-right" class="size-3.5 shrink-0" />
      </button>
    </UDropdownMenu>

    <div
      v-if="menu.pessoal.value"
      class="flex items-center gap-1.5 rounded-lg bg-elevated/60 px-2.5 py-1.5 text-xs text-muted"
    >
      <UIcon name="i-lucide-user" class="size-3.5 shrink-0" />
      <span class="min-w-0 flex-1 truncate">{{ props.t.menuSoMeu }}</span>
      <UTooltip :text="props.t.voltarAoDoWorkspace">
        <UButton
          icon="i-lucide-rotate-ccw"
          size="xs"
          color="neutral"
          variant="ghost"
          :aria-label="props.t.voltarAoDoWorkspace"
          @click="menu.voltarAoDoWorkspace()"
        />
      </UTooltip>
    </div>
  </div>
</template>
