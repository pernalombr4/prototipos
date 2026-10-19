<script setup lang="ts">
/**
 * PROPOSTA: o cabeçalho de uma coluna da tabela de exportações.
 *
 * Rótulo, ordenação (só nas colunas de texto, número e data) e o funil que
 * abre o filtro da própria coluna num popover, como a tabela nova de itens do
 * develop mostra o funil ao lado do nome da coluna.
 *
 * O `EnTable` do SDK monta o cabeçalho por dentro e não tem slot para ele;
 * por isso a tabela desta tela é o `UTable` (o mesmo que o `EnTable` usa por
 * baixo, com as mesmas classes). Pedido ao SDK: slot `#header-{key}`.
 */
const props = defineProps<{
  rotulo: string
  /** Rótulos para o leitor de tela e o tooltip. */
  rotuloOrdenar: string
  rotuloFiltrar: string
  rotuloLimpar: string
  ordenavel?: boolean
  direcao?: 'asc' | 'desc' | null
  filtroAtivo?: boolean
  alinhamento?: 'left' | 'right'
}>()

const emit = defineEmits<{ ordenar: [], limpar: [] }>()

const iconeDaOrdem = computed(() => props.direcao === 'asc'
  ? 'i-lucide-arrow-up-narrow-wide'
  : props.direcao === 'desc' ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-down')
</script>

<template>
  <div class="flex min-w-0 items-center gap-0.5" :class="alinhamento === 'right' ? 'justify-end' : ''">
    <button
      v-if="ordenavel"
      type="button"
      class="inline-flex min-w-0 items-center gap-1 rounded-xs transition-colors hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
      :class="direcao ? 'text-highlighted' : ''"
      :aria-label="rotuloOrdenar"
      @click="emit('ordenar')"
    >
      <span class="truncate">{{ rotulo }}</span>
      <UIcon :name="iconeDaOrdem" class="size-4 shrink-0" :class="direcao ? 'text-primary' : ''" />
    </button>
    <span v-else class="truncate">{{ rotulo }}</span>

    <UPopover :content="{ align: alinhamento === 'right' ? 'end' : 'start', sideOffset: 6, collisionPadding: 12 }">
      <UTooltip :text="rotuloFiltrar">
        <UButton
          icon="i-lucide-funnel"
          :color="filtroAtivo ? 'primary' : 'neutral'"
          :variant="filtroAtivo ? 'soft' : 'ghost'"
          size="xs"
          square
          class="shrink-0"
          :aria-label="rotuloFiltrar"
          :aria-pressed="filtroAtivo"
        />
      </UTooltip>
      <template #content>
        <div class="w-64 p-3 text-sm font-normal text-default">
          <div class="mb-2 flex items-center justify-between gap-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-muted">{{ rotulo }}</p>
            <UButton
              v-if="filtroAtivo"
              :label="rotuloLimpar"
              color="neutral"
              variant="link"
              size="xs"
              class="px-0"
              @click="emit('limpar')"
            />
          </div>
          <slot />
        </div>
      </template>
    </UPopover>
  </div>
</template>
