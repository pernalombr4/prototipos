<script setup lang="ts">
/**
 * A casca do ENSPACE, copiada da Home de develop.
 *
 * ⚠️ NADA AQUI É PROPOSTA, com UMA exceção marcada abaixo: o botão "Criar",
 * logo abaixo de "Buscar...". A demanda pediu o atalho de criar "na home ou no
 * menu lateral"; ele entra no menu porque o menu está em toda tela, e a Home
 * tem o widget "Criar rápido" com as mesmas opções.
 *
 * Referência: `https://develop.enspace.io/workspaces/<ws>`, visitada em
 * 11/11/2026. Base: a casca do `painel-de-tarefas`, conferida de novo no
 * develop. Item por item no BRIEFING.md. Defeitos do develop que ficam como
 * estão (são achado, não proposta): `menu.member.reports.label` sem tradução.
 *
 * Na implementação, isto é o `EnLayout` com os slots de sidebar e navbar.
 */
import type { Textos } from './textos'

defineProps<{
  t: Textos
  slug: string
}>()

defineSlots<{
  default(): unknown
  /** PROPOSTA: o botão Criar e o menu dele. */
  criar(props: { recolhido: boolean }): unknown
}>()

interface ItemDeMenu {
  chave: string
  icone: string
  expansivel?: boolean
  filhos?: { chave: string, icone: string }[]
  externo?: boolean
  ativo?: boolean
}

const membro: ItemDeMenu[] = [
  { chave: 'inicio', icone: 'i-lucide-house', ativo: true },
  { chave: 'spaceflows', icone: 'i-lucide-workflow' },
  { chave: 'categorias', icone: 'i-lucide-layout-grid', expansivel: true },
  {
    chave: 'tarefas',
    icone: 'i-lucide-file-text',
    expansivel: true,
    filhos: [
      { chave: 'agendadas', icone: 'i-lucide-calendar-check' },
      { chave: 'rapidas', icone: 'i-lucide-clipboard-list' },
      { chave: 'painel', icone: 'i-lucide-chart-column' },
    ],
  },
  { chave: 'agenda', icone: 'i-lucide-calendar-days' },
  { chave: 'relatorios', icone: 'i-lucide-file-down' },
  { chave: 'knowledge', icone: 'i-lucide-table-2', expansivel: true },
]

const configuracoes: ItemDeMenu[] = [
  { chave: 'visaoGeral', icone: 'i-lucide-circle-gauge' },
  { chave: 'sistema', icone: 'i-lucide-settings' },
  { chave: 'estrutura', icone: 'i-lucide-layers', expansivel: true },
  { chave: 'gestaoDeMembros', icone: 'i-lucide-contact' },
  { chave: 'interface', icone: 'i-lucide-panels-top-left', expansivel: true },
  { chave: 'emails', icone: 'i-lucide-mail', expansivel: true },
  { chave: 'integracoes', icone: 'i-lucide-plug', expansivel: true },
  { chave: 'agentesDeIa', icone: 'i-lucide-bot' },
  { chave: 'logs', icone: 'i-lucide-activity' },
]

const ajuda: ItemDeMenu[] = [
  { chave: 'releases', icone: 'i-lucide-package' },
  { chave: 'documentacao', icone: 'i-lucide-book-marked', externo: true },
]

const abertos = ref<string[]>([])

function alternar(chave: string) {
  abertos.value = abertos.value.includes(chave)
    ? abertos.value.filter(x => x !== chave)
    : [...abertos.value, chave]
}

const menuRecolhido = ref(false)
</script>

<template>
  <div class="flex h-dvh overflow-hidden bg-default">
    <!-- ───────────────── Menu lateral (cópia do develop) ───────────────── -->
    <aside
      class="relative hidden shrink-0 flex-col border-r border-default bg-elevated/40 transition-[width] duration-200 lg:flex"
      :class="menuRecolhido ? 'w-14' : 'w-52'"
      :aria-label="t.casca.menuLateral"
    >
      <button type="button" class="flex items-center gap-2 px-3 py-3 text-left transition-colors hover:bg-elevated">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {{ t.workspace.slice(0, 2).toUpperCase() }}
        </span>
        <span v-if="!menuRecolhido" class="min-w-0 flex-1">
          <span class="block truncate text-sm font-semibold text-highlighted">{{ t.workspace }}</span>
          <span class="block truncate text-xs text-muted">{{ slug }}</span>
        </span>
        <UIcon v-if="!menuRecolhido" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
      </button>

      <button type="button" class="mx-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated">
        <UIcon name="i-lucide-search" class="size-4 shrink-0 text-toned" />
        <template v-if="!menuRecolhido">
          <span class="flex-1 text-sm text-toned">{{ t.casca.buscar }}</span>
          <UKbd value="ctrl" size="sm" />
          <UKbd value="K" size="sm" />
        </template>
      </button>

      <!-- PROPOSTA: o botão Criar. É a única mudança na casca. -->
      <div class="mx-2 mb-1 mt-1">
        <slot name="criar" :recolhido="menuRecolhido" />
      </div>

      <nav class="min-h-0 flex-1 overflow-y-auto pb-4">
        <template v-for="(grupo, i) in [{ titulo: t.casca.membro, itens: membro }, { titulo: t.casca.configuracoes, itens: configuracoes }, { titulo: t.casca.ajuda, itens: ajuda }]" :key="i">
          <p v-if="!menuRecolhido" class="px-4 pb-1 pt-4 text-xs font-medium text-muted">
            {{ grupo.titulo }}
          </p>
          <div v-else class="mx-3 my-3 border-t border-default" />

          <template v-for="item in grupo.itens" :key="item.chave">
            <button
              type="button"
              class="flex w-full items-center gap-2.5 px-4 py-1.5 text-left transition-colors"
              :class="item.ativo ? 'font-medium text-primary' : 'text-toned hover:bg-elevated'"
              :aria-current="item.ativo ? 'page' : undefined"
              @click="item.expansivel && alternar(item.chave)"
            >
              <UIcon :name="item.icone" class="size-4 shrink-0" />
              <template v-if="!menuRecolhido">
                <span class="flex-1 truncate text-sm">{{ t.casca.itens[item.chave] }}</span>
                <UIcon v-if="item.externo" name="i-lucide-arrow-up-right" class="size-3 shrink-0 text-dimmed" />
                <UIcon
                  v-else-if="item.expansivel"
                  :name="abertos.includes(item.chave) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  class="size-4 shrink-0 text-muted"
                />
              </template>
            </button>

            <template v-if="!menuRecolhido && item.filhos && abertos.includes(item.chave)">
              <button
                v-for="filho in item.filhos"
                :key="filho.chave"
                type="button"
                class="flex w-full items-center gap-2.5 py-1.5 pl-10 pr-4 text-left text-toned transition-colors hover:bg-elevated"
              >
                <UIcon :name="filho.icone" class="size-4 shrink-0" />
                <span class="truncate text-sm">{{ t.casca.itens[filho.chave] }}</span>
              </button>
            </template>
          </template>
        </template>
      </nav>

      <button
        type="button"
        class="absolute -right-3 top-1/2 z-10 flex size-6 items-center justify-center rounded-full border border-default bg-default text-muted shadow-sm transition-colors hover:text-highlighted"
        :aria-label="menuRecolhido ? t.casca.abrirMenu : t.casca.recolherMenu"
        @click="menuRecolhido = !menuRecolhido"
      >
        <UIcon :name="menuRecolhido ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'" class="size-3.5" />
      </button>
    </aside>

    <!-- ───────────────── Coluna da direita ───────────────── -->
    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-11 shrink-0 items-center gap-1 border-b border-default px-2">
        <UButton icon="i-lucide-panel-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.recolherMenu" @click="menuRecolhido = !menuRecolhido" />
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.voltar" />
        <UButton icon="i-lucide-arrow-right" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.avancar" />
        <UButton icon="i-lucide-rotate-cw" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.recarregar" />
        <UButton icon="i-lucide-house" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.itens.inicio" />

        <div class="mx-2 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-elevated/60 px-3 py-1.5">
          <nav class="flex min-w-0 items-center gap-1.5 text-xs" :aria-label="t.casca.trilha">
            <span class="truncate text-toned">{{ t.casca.workspaces }}</span>
            <UIcon name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
            <span class="truncate font-medium text-highlighted">{{ slug }}</span>
          </nav>
          <span class="ml-auto flex shrink-0 items-center gap-1">
            <UKbd value="ctrl" size="sm" />
            <UKbd value="B" size="sm" />
            <UIcon name="i-lucide-star" class="ml-1 size-3.5 text-muted" />
          </span>
        </div>

        <div class="flex shrink-0 items-center gap-1">
          <UButton icon="i-circle-flags-br" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.idioma" />
          <UButton icon="i-lucide-sun" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.tema" />
          <UButton icon="i-lucide-life-buoy" :label="t.casca.suporte" color="neutral" variant="outline" size="xs" />
          <UChip text="99+" color="error" size="lg">
            <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.notificacoes" />
          </UChip>
          <UChip color="success" size="sm" inset>
            <UAvatar size="xs" text="RA" :alt="t.casca.conta" />
          </UChip>
        </div>
      </header>

      <div class="flex min-h-0 flex-1 flex-col">
        <slot />
      </div>
    </div>
  </div>
</template>
