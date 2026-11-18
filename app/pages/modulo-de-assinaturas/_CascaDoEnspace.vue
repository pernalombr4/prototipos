<script setup lang="ts">
/**
 * A casca do ENSPACE em volta do módulo de assinaturas, copiada da prévia da branch `feat/en-signature`.
 *
 * ⚠️ NADA AQUI É PROPOSTA, com 2 exceções marcadas abaixo. Menu lateral, barra do topo e trilha reproduzem o que o
 * produto já tem. Se algo estiver diferente da prévia, é defeito de cópia, não sugestão.
 *
 * Referência: `https://137-184-138-162-pr3124-feat-en-signature.sslip.io/workspaces/<ws>/signatures`, visitada em
 * 18/11/2026, com o menu em português pelo print do QA da mesma data. Partiu de `modulo-juridico/_CascaDoJuridico.vue`.
 *
 * EXCEÇÕES (PROPOSTA):
 * - Integrações perde o item "Assinatura Eletrônica": os provedores ficam em Apps, com os outros apps (B1). O andaime
 *   mostra o item de hoje, para comparar;
 * - a trilha mostra o nome da tela, não o caminho da URL (C44, registrado no BRIEFING como achado da casca).
 *
 * Na implementação isto é o `EnLayout` com os slots `sidebar-header`, `sidebar-default`, `navbar-leading`,
 * `navbar-title` e `navbar-trailing`.
 */
import { workspace } from './mocks'
import type { Textos } from './textos'

export type Destino = 'assinaturas' | 'apps' | 'sistema' | 'spaceflows' | 'tarefas' | 'assinaturaEletronica'

const props = defineProps<{
  t: Textos
  ativo: Destino
  trilha: string[]
  moduloLigado: boolean
  /** Andaime: mostra o item "Assinatura Eletrônica" que a branch tem hoje. */
  menuDeHoje: boolean
}>()

const emit = defineEmits<{ ir: [Destino] }>()

interface ItemDeMenu { chave: string, icone: string, expansivel?: boolean, externo?: boolean, destino?: Destino }

const membro: ItemDeMenu[] = [
  { chave: 'inicio', icone: 'i-lucide-house' },
  { chave: 'spaceflows', icone: 'i-lucide-workflow', destino: 'spaceflows' },
  { chave: 'categorias', icone: 'i-lucide-layout-grid', expansivel: true },
  { chave: 'tarefas', icone: 'i-lucide-file-text', destino: 'tarefas' },
  { chave: 'agenda', icone: 'i-lucide-calendar-days' },
  { chave: 'relatorios', icone: 'i-lucide-chart-column' },
]

const modulos = computed<ItemDeMenu[]>(() => (props.moduloLigado ? [{ chave: 'assinaturas', icone: 'i-lucide-signature', destino: 'assinaturas' }] : []))

const configuracoes: ItemDeMenu[] = [
  { chave: 'visaoGeral', icone: 'i-lucide-circle-gauge' },
  { chave: 'sistema', icone: 'i-lucide-settings', destino: 'sistema' },
  { chave: 'estrutura', icone: 'i-lucide-database', expansivel: true },
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

const grupos = computed(() => [
  { titulo: props.t.casca.membro, itens: membro },
  ...(modulos.value.length ? [{ titulo: props.t.casca.modulos, itens: modulos.value }] : []),
  { titulo: props.t.casca.configuracoes, itens: configuracoes },
  { titulo: props.t.casca.ajuda, itens: ajuda },
])

const deIntegracoes = computed<{ chave: string, icone: string, destino?: Destino, hoje?: boolean }[]>(() => [
  { chave: 'apps', icone: 'i-lucide-layout-grid', destino: 'apps' },
  { chave: 'credenciais', icone: 'i-lucide-key-round' },
  { chave: 'webhooks', icone: 'i-lucide-webhook' },
  ...(props.menuDeHoje ? [{ chave: 'assinaturaEletronica', icone: 'i-lucide-signature', destino: 'assinaturaEletronica' as const, hoje: true }] : []),
])

const abertos = ref<string[]>(['integracoes'])

function clicar(item: ItemDeMenu) {
  if (item.destino) return emit('ir', item.destino)
  if (!item.expansivel) return
  abertos.value = abertos.value.includes(item.chave)
    ? abertos.value.filter(x => x !== item.chave)
    : [...abertos.value, item.chave]
}

const ehAtivo = (chave: string) => chave === props.ativo
const menuRecolhido = ref(false)
</script>

<template>
  <div class="flex h-dvh overflow-hidden bg-default">
    <!-- ───────────────── Menu lateral (cópia da prévia) ───────────────── -->
    <aside
      class="relative hidden shrink-0 flex-col border-r border-default bg-elevated/40 transition-[width] duration-200 lg:flex"
      :class="menuRecolhido ? 'w-14' : 'w-52'"
      :aria-label="t.casca.menuLateral"
    >
      <button type="button" class="flex items-center gap-2 px-3 py-3 text-left transition-colors hover:bg-elevated">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
          {{ workspace.nome.slice(0, 2).toUpperCase() }}
        </span>
        <span v-if="!menuRecolhido" class="min-w-0 flex-1">
          <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace.nome }}</span>
          <span class="block truncate text-xs text-muted">{{ workspace.slug }}</span>
        </span>
        <UIcon v-if="!menuRecolhido" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
      </button>

      <button type="button" class="mx-2 mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated">
        <UIcon name="i-lucide-search" class="size-4 shrink-0 text-toned" />
        <template v-if="!menuRecolhido">
          <span class="flex-1 text-sm text-toned">{{ t.casca.buscar }}</span>
          <UKbd value="ctrl" size="sm" />
          <UKbd value="K" size="sm" />
        </template>
      </button>

      <nav class="min-h-0 flex-1 overflow-y-auto pb-4">
        <template v-for="(grupo, i) in grupos" :key="i">
          <p v-if="!menuRecolhido" class="px-4 pb-1 pt-4 text-xs font-medium text-muted">{{ grupo.titulo }}</p>
          <div v-else class="mx-3 my-3 border-t border-default" />

          <template v-for="item in grupo.itens" :key="item.chave">
            <button
              type="button"
              class="flex w-full items-center gap-2.5 px-4 py-1.5 text-left transition-colors"
              :class="[
                ehAtivo(item.chave) ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated',
                item.chave === 'assinaturas' && 'animate-[entrada_.3s_ease-out_both]',
              ]"
              :aria-current="ehAtivo(item.chave) ? 'page' : undefined"
              :aria-expanded="item.expansivel ? abertos.includes(item.chave) : undefined"
              @click="clicar(item)"
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

            <template v-if="!menuRecolhido && item.chave === 'integracoes' && abertos.includes('integracoes')">
              <button
                v-for="m in deIntegracoes"
                :key="m.chave"
                type="button"
                class="flex w-full items-center gap-2.5 py-1.5 pl-10 pr-3 text-left transition-colors"
                :class="[
                  ehAtivo(m.chave) ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated',
                  m.hoje && 'line-through decoration-error/70',
                ]"
                :aria-current="ehAtivo(m.chave) ? 'page' : undefined"
                @click="m.destino && emit('ir', m.destino)"
              >
                <UIcon :name="m.icone" class="size-4 shrink-0" />
                <span class="min-w-0 flex-1 truncate text-sm">{{ t.casca.itens[m.chave] }}</span>
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
          <UIcon name="i-lucide-git-branch" class="size-3.5 shrink-0 text-muted" />
          <nav class="flex min-w-0 items-center gap-1.5 text-xs" :aria-label="t.casca.trilha">
            <template v-for="(parte, i) in trilha" :key="i">
              <UIcon v-if="i > 0" name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
              <span class="truncate" :class="i === trilha.length - 1 ? 'font-medium text-highlighted' : 'text-toned'">{{ parte }}</span>
            </template>
          </nav>
          <span class="ml-auto hidden shrink-0 items-center gap-1 sm:flex">
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

      <!-- Aqui entra a tela. É a única parte que a proposta mexe. -->
      <div class="flex min-h-0 flex-1 flex-col">
        <slot />
      </div>
    </div>
  </div>
</template>
