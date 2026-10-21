<script setup lang="ts">
/**
 * A casca do ENSPACE, copiada da tela de develop.
 *
 * ⚠️ NADA AQUI É PROPOSTA, salvo 3 pontos marcados com "PROPOSTA:". Menu
 * lateral, barra do topo e trilha reproduzem o que o produto já tem, para os
 * tipos de tela serem avaliados no lugar onde vivem.
 *
 * Origem: a casca do protótipo `galeria-de-casos-de-uso`, copiada do develop
 * em 20/10/2026 (`/workspaces/<ws>/settings/interface/usecases`). Item por
 * item no BRIEFING.md.
 *
 * As 3 mudanças, que são o objeto desta demanda:
 *   1. o módulo Requisições entra fixo na seção Membro, com 3 telas;
 *   2. a seção "Tipos de menu" mostra 1 menu de cada tipo que sobra;
 *   3. Interface perde a tela Telas (decisão do protótipo menu-lateral:
 *      "o menu é a tela").
 *
 * Na implementação isto é o `EnLayout` com os slots `sidebar-header`,
 * `sidebar-default`, `navbar-leading`, `navbar-title` e `navbar-trailing`.
 */
import type { Textos } from './textos'
import type { Tela } from './estado'

const props = defineProps<{
  t: Textos
  workspace: string
  slug: string
  ativo: Tela
  contadores: Partial<Record<Tela, number>>
}>()

const emit = defineEmits<{ abrir: [tela: Tela] }>()

interface ItemDeMenu {
  chave: string
  icone: string
  expansivel?: boolean
  filhos?: { chave: Tela, icone: string }[]
  externo?: boolean
  /** PROTÓTIPO: item que a proposta acrescenta. */
  proposta?: boolean
}

const membro: ItemDeMenu[] = [
  { chave: 'inicio', icone: 'i-lucide-house' },
  { chave: 'spaceflows', icone: 'i-lucide-workflow' },
  { chave: 'categorias', icone: 'i-lucide-layout-grid', expansivel: true },
  { chave: 'tarefas', icone: 'i-lucide-file-text', expansivel: true },
  { chave: 'agenda', icone: 'i-lucide-calendar-days' },
  { chave: 'knowledge', icone: 'i-lucide-table-2', expansivel: true },
  // PROPOSTA: o módulo Requisições, fixo para todo membro, sem cadastro do admin.
  {
    chave: 'requisicoes',
    icone: 'i-lucide-inbox',
    expansivel: true,
    proposta: true,
    filhos: [
      { chave: 'abrir', icone: 'i-lucide-circle-plus' },
      { chave: 'minhas', icone: 'i-lucide-user-round' },
      { chave: 'triagem', icone: 'i-lucide-list-filter' },
    ],
  },
]

/** PROPOSTA: 1 menu de cada tipo, como o admin criaria em Interface > Menus. */
const tiposDeMenu: { chave: Tela, icone: string }[] = [
  { chave: 'lista', icone: 'i-lucide-table' },
  { chave: 'fila', icone: 'i-lucide-list-checks' },
  { chave: 'painel', icone: 'i-lucide-chart-column' },
  { chave: 'documentos', icone: 'i-lucide-files' },
  { chave: 'externa', icone: 'i-lucide-globe' },
]

const configuracoes: ItemDeMenu[] = [
  { chave: 'visaoGeral', icone: 'i-lucide-circle-gauge' },
  { chave: 'sistema', icone: 'i-lucide-settings' },
  { chave: 'estrutura', icone: 'i-lucide-layers', expansivel: true },
  { chave: 'gestaoDeMembros', icone: 'i-lucide-contact' },
  // PROPOSTA: sem a tela Telas. Ficam Menus e Casos de Uso.
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

const abertos = ref<string[]>(['requisicoes'])

function alternar(chave: string) {
  abertos.value = abertos.value.includes(chave)
    ? abertos.value.filter(x => x !== chave)
    : [...abertos.value, chave]
}

const menuRecolhido = ref(false)

const ehRequisicao = computed(() => ['abrir', 'minhas', 'triagem'].includes(props.ativo))
const secaoDaTrilha = computed(() => (ehRequisicao.value ? props.t.casca.itens.requisicoes : props.t.casca.tiposDeMenu))

function classeDoItem(chave: Tela) {
  return props.ativo === chave
    ? 'bg-primary/10 font-medium text-primary'
    : 'text-toned hover:bg-elevated'
}
</script>

<template>
  <div class="flex h-dvh overflow-hidden bg-default">
    <!-- ───────────────── Menu lateral (cópia do develop) ───────────────── -->
    <aside
      class="relative hidden shrink-0 flex-col border-r border-default bg-elevated/40 transition-[width] duration-200 lg:flex"
      :class="menuRecolhido ? 'w-14' : 'w-56'"
      :aria-label="t.casca.menuLateral"
    >
      <!-- Workspace -->
      <button
        type="button"
        class="flex items-center gap-2 px-3 py-3 text-left transition-colors hover:bg-elevated"
      >
        <span
          class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
        >
          {{ workspace.slice(0, 2).toUpperCase() }}
        </span>
        <span v-if="!menuRecolhido" class="min-w-0 flex-1">
          <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace }}</span>
          <span class="block truncate text-xs text-muted">{{ slug }}</span>
        </span>
        <UIcon v-if="!menuRecolhido" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
      </button>

      <!-- Busca -->
      <button
        type="button"
        class="mx-2 mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated"
      >
        <UIcon name="i-lucide-search" class="size-4 shrink-0 text-toned" />
        <template v-if="!menuRecolhido">
          <span class="flex-1 text-sm text-toned">{{ t.casca.buscar }}</span>
          <UKbd value="ctrl" size="sm" />
          <UKbd value="K" size="sm" />
        </template>
      </button>

      <nav class="min-h-0 flex-1 overflow-y-auto pb-4">
        <!-- Membro -->
        <p v-if="!menuRecolhido" class="px-4 pb-1 pt-4 text-xs font-medium text-muted">{{ t.casca.membro }}</p>
        <div v-else class="mx-3 my-3 border-t border-default" />
        <template v-for="item in membro" :key="item.chave">
          <button
            type="button"
            class="flex w-full items-center gap-2.5 px-4 py-1.5 text-left transition-colors hover:bg-elevated"
            :aria-expanded="item.filhos ? abertos.includes(item.chave) : undefined"
            @click="item.expansivel && alternar(item.chave)"
          >
            <UIcon :name="item.icone" class="size-4 shrink-0" :class="item.proposta && ehRequisicao ? 'text-primary' : 'text-toned'" />
            <template v-if="!menuRecolhido">
              <span class="flex-1 truncate text-sm" :class="item.proposta && ehRequisicao ? 'font-medium text-highlighted' : 'text-toned'">{{ t.casca.itens[item.chave] }}</span>
              <UIcon
                v-if="item.expansivel"
                :name="abertos.includes(item.chave) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="size-4 shrink-0 text-muted"
              />
            </template>
          </button>
          <!-- Os filhos do módulo, com o número do que aguarda a pessoa. -->
          <template v-if="!menuRecolhido && item.filhos && abertos.includes(item.chave)">
            <button
              v-for="filho in item.filhos"
              :key="filho.chave"
              type="button"
              class="flex w-full items-center gap-2.5 py-1.5 pl-10 pr-4 text-left transition-colors"
              :class="classeDoItem(filho.chave)"
              :aria-current="ativo === filho.chave ? 'page' : undefined"
              @click="emit('abrir', filho.chave)"
            >
              <UIcon :name="filho.icone" class="size-4 shrink-0" />
              <span class="flex-1 truncate text-sm">{{ t.casca.itens[filho.chave] }}</span>
              <UBadge v-if="contadores[filho.chave]" :label="String(contadores[filho.chave])" color="primary" variant="soft" size="sm" class="tabular-nums" />
            </button>
          </template>
        </template>

        <!-- PROPOSTA: a seção com 1 menu de cada tipo -->
        <p v-if="!menuRecolhido" class="px-4 pb-1 pt-4 text-xs font-medium text-muted">{{ t.casca.tiposDeMenu }}</p>
        <div v-else class="mx-3 my-3 border-t border-default" />
        <button
          v-for="item in tiposDeMenu"
          :key="item.chave"
          type="button"
          class="flex w-full items-center gap-2.5 px-4 py-1.5 text-left transition-colors"
          :class="classeDoItem(item.chave)"
          :aria-current="ativo === item.chave ? 'page' : undefined"
          @click="emit('abrir', item.chave)"
        >
          <UIcon :name="item.icone" class="size-4 shrink-0" />
          <span v-if="!menuRecolhido" class="flex-1 truncate text-sm">{{ t.casca.itens[item.chave] }}</span>
          <UBadge v-if="!menuRecolhido && contadores[item.chave]" :label="String(contadores[item.chave])" color="primary" variant="soft" size="sm" class="tabular-nums" />
        </button>

        <!-- Configurações e Ajuda -->
        <template v-for="(grupo, i) in [{ titulo: t.casca.configuracoes, itens: configuracoes }, { titulo: t.casca.ajuda, itens: ajuda }]" :key="i">
          <p v-if="!menuRecolhido" class="px-4 pb-1 pt-4 text-xs font-medium text-muted">{{ grupo.titulo }}</p>
          <div v-else class="mx-3 my-3 border-t border-default" />
          <button
            v-for="item in grupo.itens"
            :key="item.chave"
            type="button"
            class="flex w-full items-center gap-2.5 px-4 py-1.5 text-left transition-colors hover:bg-elevated"
          >
            <UIcon :name="item.icone" class="size-4 shrink-0 text-toned" />
            <template v-if="!menuRecolhido">
              <span class="flex-1 truncate text-sm text-toned">{{ t.casca.itens[item.chave] }}</span>
              <UIcon v-if="item.externo" name="i-lucide-arrow-up-right" class="size-3 shrink-0 text-dimmed" />
              <UIcon v-else-if="item.expansivel" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
            </template>
          </button>
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
          <UIcon name="i-lucide-git-branch" class="size-3.5 shrink-0 text-muted" />
          <nav class="flex min-w-0 items-center gap-1.5 text-xs" :aria-label="t.casca.trilha">
            <span class="truncate text-toned">{{ workspace }}</span>
            <UIcon name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
            <span class="truncate text-toned">{{ secaoDaTrilha }}</span>
            <UIcon name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
            <span class="truncate font-medium text-highlighted">{{ t.casca.itens[ativo] }}</span>
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
          <UButton icon="i-lucide-life-buoy" :label="t.casca.suporte" color="neutral" variant="ghost" size="xs" class="hidden sm:inline-flex" />
          <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.notificacoes" />
          <UChip color="success" size="sm" inset>
            <UAvatar size="xs" text="AR" :alt="t.casca.conta" />
          </UChip>
        </div>
      </header>

      <!-- No celular o menu lateral some (lg:flex), como no produto. O andaime troca de tela. -->
      <div class="flex min-h-0 flex-1 flex-col">
        <slot />
      </div>
    </div>
  </div>
</template>
