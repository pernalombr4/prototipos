<script setup lang="ts">
/**
 * A moldura de todo widget da Home: cabeçalho, ações e os estados que cada
 * widget tem sozinho (carregando, erro, sem acesso).
 *
 * Mesmo desenho do `_Painel.vue` do painel-de-tarefas, para o ENSPACE ter um
 * padrão só de painel: borda fina, título pequeno, ícone em círculo.
 *
 * 2 modos (rodada 4):
 * - uso: a Home é lugar de trabalho. Nada se arrasta por acidente; o menu "…"
 *   tem Configurar, Tamanho padrão e Remover, como atalho;
 * - edição (Personalizar): borda tracejada, alça visível à esquerda do título
 *   (como no ClickUp), Subir e Descer (a alternativa ao arraste da WCAG 2.5.7,
 *   como o "Move up" e o "Move down" do Jira), Configurar e Remover à vista.
 *   O corpo fica inerte: na edição, o clique não abre item nem conclui tarefa.
 *
 * Só o CABEÇALHO é alça de arraste (`data-alca-de-arraste`): o corpo tem linha
 * clicável, caixa de concluir e campo de texto.
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
  /** A Home está em edição (Personalizar). */
  editando?: boolean
  primeiro?: boolean
  ultimo?: boolean
}>()

const emit = defineEmits<{ configurar: [], tamanhoPadrao: [], remover: [], tentarDeNovo: [], subir: [], descer: [] }>()

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
    class="group/widget relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border bg-default transition-[border-color,box-shadow] duration-150"
    :class="[
      editando ? 'border-dashed border-primary/50 shadow-sm' : 'hover:border-accented hover:shadow-sm',
      !editando && novo ? 'border-primary/50 ring-1 ring-primary/20' : '',
      !editando && !novo ? 'border-default' : '',
    ]"
    :aria-labelledby="id"
  >
    <header
      :data-alca-de-arraste="editando ? '' : undefined"
      class="relative flex shrink-0 select-none items-center gap-2.5 pb-2 pt-3 pr-4 transition-[padding] duration-150"
      :class="editando ? 'cursor-grab touch-none pl-6 active:cursor-grabbing' : 'pl-4'"
    >
      <UTooltip v-if="editando" :text="t.widget.arrasteParaMover" :content="{ side: 'top' }">
        <button
          type="button"
          data-grip
          class="absolute left-1 top-3.5 flex h-6 w-4 items-center justify-center rounded-sm text-muted focus-visible:outline-2 focus-visible:outline-primary"
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

      <!-- Edição: as ações à vista. -->
      <div v-if="editando" class="-mr-2 flex shrink-0 items-center gap-0.5" data-sem-arraste>
        <UTooltip :text="t.personalizacao.subir(titulo)">
          <UButton icon="i-lucide-arrow-up" color="neutral" variant="ghost" size="xs" :disabled="primeiro" :aria-label="t.personalizacao.subir(titulo)" @click="emit('subir')" />
        </UTooltip>
        <UTooltip :text="t.personalizacao.descer(titulo)">
          <UButton icon="i-lucide-arrow-down" color="neutral" variant="ghost" size="xs" :disabled="ultimo" :aria-label="t.personalizacao.descer(titulo)" @click="emit('descer')" />
        </UTooltip>
        <UTooltip v-if="configuravel" :text="t.widget.configurar">
          <UButton icon="i-lucide-settings-2" color="neutral" variant="ghost" size="xs" :aria-label="`${t.widget.configurar} ${titulo}`" @click="emit('configurar')" />
        </UTooltip>
        <UTooltip :text="t.personalizacao.remover(titulo)">
          <UButton icon="i-lucide-eye-off" color="neutral" variant="ghost" size="xs" :aria-label="t.personalizacao.remover(titulo)" @click="emit('remover')" />
        </UTooltip>
      </div>

      <!-- Uso: as ações do widget e o menu "…". -->
      <div v-else class="-mr-2 flex shrink-0 items-center gap-0.5">
        <slot name="acoes" />
        <UDropdownMenu :items="menu" :content="{ align: 'end' }">
          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" :aria-label="t.widget.maisAcoes(titulo)" />
        </UDropdownMenu>
      </div>
    </header>

    <div class="relative flex min-h-0 flex-1 flex-col transition-opacity duration-150" :class="editando ? 'opacity-70' : ''" :inert="editando">
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
