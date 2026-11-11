<script setup lang="ts">
/**
 * A moldura de todo widget da Home: cabeçalho, menu "…" e os estados que
 * cada widget tem sozinho (carregando, erro, sem acesso).
 *
 * Mesmo desenho do `_Painel.vue` do painel-de-tarefas, para o ENSPACE ter um
 * padrão só de painel: borda fina, título pequeno, ícone em círculo.
 * Diferença: aqui só o CABEÇALHO é alça de arraste (`data-alca-de-arraste`).
 * Widget de Home tem linha clicável, caixa de concluir e campo de texto no
 * corpo; com o corpo inteiro como alça, o arraste disputaria com eles. É o
 * que o ClickUp faz (alça à esquerda do título).
 *
 * Cada widget carrega, falha e fica sem acesso por conta própria: um widget
 * quebrado não derruba a Home (o oposto do develop, que mostra o erro cru da
 * API na contagem).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'

export type EstadoDoWidget = 'ok' | 'carregando' | 'erro' | 'semAcesso'

const props = defineProps<{
  t: Textos
  titulo: string
  subtitulo?: string
  icone: string
  estado?: EstadoDoWidget
  /** Nome da categoria, para o texto de "sem acesso". */
  categoriaSemAcesso?: string
  configuravel?: boolean
  novo?: boolean
  /** Sem cabeçalho (o "Criar rápido" é uma faixa). A alça vira a borda esquerda. */
  semCabecalho?: boolean
}>()

const emit = defineEmits<{ configurar: [], tamanhoPadrao: [], remover: [], tentarDeNovo: [] }>()

defineSlots<{
  default(): unknown
  acoes?(): unknown
}>()

const id = useId()

const menu = computed<DropdownMenuItem[][]>(() => [
  [
    ...(props.configuravel ? [{ label: props.t.widget.configurar, icon: 'i-lucide-settings-2', onSelect: () => emit('configurar') }] : []),
    { label: props.t.widget.tamanhoPadrao, icon: 'i-lucide-scaling', onSelect: () => emit('tamanhoPadrao') },
  ],
  [{ label: props.t.widget.remover, icon: 'i-lucide-eye-off', color: 'error' as const, onSelect: () => emit('remover') }],
])
</script>

<template>
  <section
    class="group/widget relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-default transition-[border-color,box-shadow] duration-150 hover:border-accented hover:shadow-sm"
    :class="novo ? 'border-primary/50 ring-1 ring-primary/20' : 'border-default'"
    :aria-labelledby="id"
  >
    <!-- Faixa sem cabeçalho: alça à esquerda, menu à direita. -->
    <template v-if="semCabecalho">
      <h2 :id="id" class="sr-only">
        {{ titulo }}
      </h2>
      <div
        data-alca-de-arraste
        class="absolute inset-y-0 left-0 z-10 flex w-4 cursor-grab touch-none select-none items-center justify-center text-dimmed opacity-0 transition-opacity active:cursor-grabbing group-hover/widget:opacity-100"
      >
        <UTooltip :text="t.widget.arrasteParaMover" :content="{ side: 'top' }">
          <button type="button" data-grip class="flex h-6 w-4 items-center justify-center rounded-sm focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary" :aria-label="t.widget.mover(titulo)">
            <UIcon name="i-lucide-grip-vertical" class="size-3.5" />
          </button>
        </UTooltip>
      </div>
      <div class="absolute right-1.5 top-1/2 z-10 -translate-y-1/2">
        <UDropdownMenu :items="menu" :content="{ align: 'end' }">
          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" :aria-label="t.widget.maisAcoes(titulo)" />
        </UDropdownMenu>
      </div>
    </template>

    <header
      v-else
      data-alca-de-arraste
      class="relative flex shrink-0 cursor-grab touch-none select-none items-center gap-2.5 px-4 pb-2 pt-3 active:cursor-grabbing"
    >
      <UTooltip :text="t.widget.arrasteParaMover" :content="{ side: 'top' }">
        <button
          type="button"
          data-grip
          class="absolute left-0 top-3.5 flex h-6 w-4 items-center justify-center rounded-sm text-dimmed opacity-0 transition-opacity focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-primary group-hover/widget:opacity-100"
          :aria-label="t.widget.mover(titulo)"
        >
          <UIcon name="i-lucide-grip-vertical" class="size-3.5" />
        </button>
      </UTooltip>

      <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
        <UIcon :name="icone" class="size-3.5 text-primary" />
      </span>
      <div class="min-w-0 flex-1">
        <h2 :id="id" class="flex items-center gap-1.5 truncate text-sm font-semibold text-highlighted">
          <span class="truncate">{{ titulo }}</span>
          <UTooltip v-if="novo" :text="t.widget.novoDica">
            <UBadge :label="t.widget.novo" color="primary" variant="subtle" size="sm" class="shrink-0" />
          </UTooltip>
        </h2>
        <p v-if="subtitulo" class="truncate text-xs text-muted" :title="subtitulo">
          {{ subtitulo }}
        </p>
      </div>

      <div class="-mr-2 flex shrink-0 items-center gap-0.5" data-sem-arraste>
        <slot name="acoes" />
        <UDropdownMenu :items="menu" :content="{ align: 'end' }">
          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" :aria-label="t.widget.maisAcoes(titulo)" />
        </UDropdownMenu>
      </div>
    </header>

    <div class="relative flex min-h-0 flex-1 flex-col">
      <!-- Carregando: esqueleto do próprio widget, nunca o texto de vazio. -->
      <div v-if="estado === 'carregando'" class="space-y-2.5 px-4 pb-4 pt-1" aria-busy="true">
        <USkeleton class="h-4 w-3/4" />
        <USkeleton class="h-4 w-1/2" />
        <USkeleton class="h-4 w-2/3" />
        <USkeleton class="h-4 w-1/3" />
      </div>

      <div v-else-if="estado === 'erro'" class="flex flex-1 flex-col items-center justify-center gap-2 px-4 pb-4 text-center">
        <UIcon name="i-lucide-cloud-off" class="size-5 text-muted" />
        <p class="text-sm font-medium text-highlighted">
          {{ t.widget.erroTitulo }}
        </p>
        <p class="text-xs text-muted">
          {{ t.widget.erroTexto }}
        </p>
        <UButton :label="t.widget.tentarDeNovo" icon="i-lucide-rotate-cw" color="neutral" variant="outline" size="xs" @click="emit('tentarDeNovo')" />
      </div>

      <div v-else-if="estado === 'semAcesso'" class="flex flex-1 flex-col items-center justify-center gap-2 px-6 pb-4 text-center">
        <UIcon name="i-lucide-lock" class="size-5 text-muted" />
        <p class="text-sm font-medium text-highlighted">
          {{ t.widget.semAcessoTitulo }}
        </p>
        <p class="text-xs text-muted">
          {{ t.widget.semAcessoTexto(categoriaSemAcesso ?? '') }}
        </p>
        <UButton :label="t.widget.remover" icon="i-lucide-eye-off" color="neutral" variant="outline" size="xs" @click="emit('remover')" />
      </div>

      <slot v-else />
    </div>
  </section>
</template>
