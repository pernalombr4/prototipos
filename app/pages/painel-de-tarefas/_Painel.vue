<script setup lang="ts">
/**
 * A moldura de todo painel: cabeçalho, "Como calculamos" e menu "…".
 *
 * Segue o cartão do template de dashboard do Nuxt UI, que o admin do ENSPACE
 * usa: borda fina, título pequeno, número grande. No painel de número
 * (`compacto`), o ícone vem num círculo com a cor primária e o título em
 * caixa alta, como o `HomeStats` do template.
 *
 * Rodada 3: o painel se arrasta e se redimensiona direto, sem modo de edição.
 * - o painel inteiro é a alça de arraste (`data-alca-de-arraste`, cursor de
 *   mão). Clique continua sendo clique: o arraste só começa com 4 px de
 *   movimento, e a grade engole o clique do fim de um arraste;
 * - a alça de teclado (`data-grip`) aparece ao passar o mouse ou no foco, no
 *   recuo à esquerda do título, sem empurrar nada: setas movem o painel;
 * - o menu "…" tem "Ocultar painel" e "Tamanho padrão". A tela cheia saiu
 *   (pedido da rodada 3).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import ComoCalculamos from './_ComoCalculamos.vue'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  titulo: string
  descricao?: string
  regra: string
  /** Painel de número: ícone em círculo, título em caixa alta, sem descrição. */
  compacto?: boolean
  icone?: string
  /** Recorte do MVP (andaime): painel fixo, sem alça e sem menu. */
  fixo?: boolean
}>()

const emit = defineEmits<{ ocultar: [], tamanhoPadrao: [] }>()

defineSlots<{
  default(): unknown
  /** Ação própria do painel, antes do "Como calculamos" ("Ver tabela"). */
  acoes?(): unknown
}>()

const id = useId()

const menu = computed<DropdownMenuItem[][]>(() => [
  [{ label: props.t.grade.tamanhoPadrao, icon: 'i-lucide-scaling', onSelect: () => emit('tamanhoPadrao') }],
  [{ label: props.t.grade.ocultar, icon: 'i-lucide-eye-off', onSelect: () => emit('ocultar') }],
])
</script>

<template>
  <section
    class="group/painel flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-default bg-default transition-[border-color,box-shadow] duration-150 hover:border-accented"
    :class="fixo ? '' : 'cursor-grab active:cursor-grabbing'"
    :data-alca-de-arraste="fixo ? undefined : ''"
    :aria-labelledby="id"
  >
    <!-- touch-none só no cabeçalho: no toque, o corpo continua rolando a lista. -->
    <header
      class="relative flex items-start gap-1.5 px-4 pb-1.5 pt-3"
      :class="fixo ? '' : 'touch-none select-none'"
    >
      <!-- Alça de teclado e sinal visual de "arraste daqui". -->
      <UTooltip v-if="!fixo" :text="t.grade.arrasteParaMover" :content="{ side: 'top' }">
        <button
          type="button"
          data-grip
          class="absolute left-0 top-3 flex h-6 w-4 cursor-grab items-center justify-center rounded-sm text-dimmed opacity-0 transition-opacity focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary group-hover/painel:opacity-100"
          :aria-label="t.grade.mover(titulo)"
        >
          <UIcon name="i-lucide-grip-vertical" class="size-3.5" />
        </button>
      </UTooltip>

      <!-- Número: ícone e ações numa linha, título na de baixo com a largura toda (HomeStats). -->
      <div v-if="compacto" class="min-w-0 flex-1 space-y-1">
        <span v-if="icone" class="flex size-7 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
          <UIcon :name="icone" class="size-3.5 text-primary" />
        </span>
        <h2 :id="id" class="line-clamp-2 text-xs font-medium uppercase leading-tight tracking-wide text-muted" :title="titulo">
          {{ titulo }}
        </h2>
      </div>
      <div v-else class="min-w-0 flex-1">
        <h2 :id="id" class="truncate text-sm font-semibold text-highlighted">
          {{ titulo }}
        </h2>
        <p v-if="descricao" class="truncate text-xs text-muted" :title="descricao">
          {{ descricao }}
        </p>
      </div>

      <div class="flex shrink-0 items-center" :class="compacto ? 'absolute right-2 top-2.5' : '-mr-2'">
        <slot name="acoes" />
        <ComoCalculamos :titulo="t.comoCalculamos" :texto="regra" :sobre="titulo" />
        <UDropdownMenu v-if="!fixo" :items="menu" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t.grade.maisAcoes(titulo)"
          />
        </UDropdownMenu>
      </div>
    </header>

    <div class="relative flex min-h-0 flex-1 flex-col">
      <slot />
    </div>
  </section>
</template>
