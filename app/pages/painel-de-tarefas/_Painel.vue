<script setup lang="ts">
/**
 * A moldura de todo painel: cabeçalho, "Como calculamos", menu e tela cheia.
 *
 * Segue o cartão do template de dashboard do Nuxt UI, que o admin do ENSPACE
 * usa: borda fina, título pequeno, número grande. No painel de número
 * (`compacto`), o ícone vem num círculo com a cor primária e o título em
 * caixa alta, como o `HomeStats` do template.
 *
 * Modo de edição (botão "Personalizar"), como o ClickUp:
 * - o painel inteiro vira alça de arraste (`data-alca-de-arraste`) e ganha a
 *   borda tracejada; o conteúdo para de receber clique, para ninguém abrir
 *   uma lista sem querer ao arrumar;
 * - o botão de alça (`data-grip`) é o caminho pelo teclado: setas movem;
 * - o menu ganha "Tamanho padrão".
 * Fora do modo, o painel não se move: foi o motivo que o ClickUp deu para
 * criar o modo de edição (as pessoas moviam cartões sem querer).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import ComoCalculamos from './_ComoCalculamos.vue'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  titulo: string
  descricao?: string
  regra: string
  editando: boolean
  /** Painel de número: ícone em círculo, título em caixa alta, sem descrição. */
  compacto?: boolean
  icone?: string
  /** Selo ao lado do ícone, no painel de número: "Agora" ou "No período". */
  selo?: string
}>()

const emit = defineEmits<{ ocultar: [], tamanhoPadrao: [] }>()

defineSlots<{
  default(props: { telaCheia: boolean }): unknown
}>()

const telaCheia = ref(false)
const id = useId()

const menu = computed<DropdownMenuItem[][]>(() => [
  [
    { label: props.t.grade.telaCheia, icon: 'i-lucide-maximize-2', onSelect: () => { telaCheia.value = true } },
    ...(props.editando ? [{ label: props.t.grade.tamanhoPadrao, icon: 'i-lucide-scaling', onSelect: () => emit('tamanhoPadrao') }] : []),
  ],
  [
    { label: props.t.grade.ocultar, icon: 'i-lucide-eye-off', onSelect: () => emit('ocultar') },
  ],
])
</script>

<template>
  <section
    class="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-default transition-[border-color,box-shadow] duration-150"
    :class="editando
      ? 'cursor-grab touch-none select-none border-dashed border-accented hover:border-primary/60 hover:shadow-md active:cursor-grabbing'
      : 'border-default'"
    :aria-labelledby="id"
    :data-alca-de-arraste="editando ? '' : undefined"
  >
    <header class="relative flex items-start gap-1.5 px-4 pb-1.5 pt-3">
      <button
        v-if="editando"
        type="button"
        data-grip
        class="-ml-2 flex size-6 shrink-0 cursor-grab items-center justify-center rounded-md text-dimmed transition-colors hover:bg-elevated hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary"
        :aria-label="t.grade.mover(titulo)"
      >
        <UIcon name="i-lucide-grip-vertical" class="size-4" />
      </button>

      <!-- Número: ícone e ações numa linha, título na de baixo com a largura toda (HomeStats). -->
      <div v-if="compacto" class="min-w-0 flex-1 space-y-1">
        <span class="flex items-center gap-2">
          <span v-if="icone" class="flex size-7 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
            <UIcon :name="icone" class="size-3.5 text-primary" />
          </span>
          <UBadge v-if="selo" :label="selo" color="neutral" variant="soft" size="sm" />
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
        <ComoCalculamos :titulo="t.comoCalculamos" :texto="regra" :sobre="titulo" />
        <UDropdownMenu :items="menu" :content="{ align: 'end' }">
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

    <div class="relative flex min-h-0 flex-1 flex-col" :class="editando ? 'pointer-events-none' : ''">
      <slot v-if="!telaCheia" :tela-cheia="false" />
    </div>

    <UModal
      v-model:open="telaCheia"
      fullscreen
      :title="titulo"
      :description="descricao"
      :close="{ 'aria-label': t.grade.fecharTelaCheia }"
      :ui="{ body: 'flex min-h-0 flex-1 flex-col sm:p-6' }"
    >
      <template #body>
        <div class="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
          <slot :tela-cheia="true" />
        </div>
      </template>
    </UModal>
  </section>
</template>
