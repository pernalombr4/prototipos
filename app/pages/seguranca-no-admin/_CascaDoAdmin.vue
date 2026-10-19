<script setup lang="ts">
/**
 * Casca do ENSPACE Admin. Nada aqui é proposta, salvo o que vai marcado com `novo`.
 *
 * Copiada olhando de https://control.develop.enspace.io/a/dashboard em 2026-10-19:
 * barra do topo com a marca, bandeira do idioma, chave de tema e a pessoa; menu
 * lateral com busca (CTRL K) e os grupos Geral, Financeiro, Infraestrutura,
 * Product, Logs, Plans e Configurações, com os rótulos como estão hoje (mistura
 * de inglês e português). O ícone de Cache (octicon) e o de Migrations (eos-icons)
 * não existem na coleção lucide instalada aqui: entram os mais próximos.
 *
 * O que é proposta: a tela Audit (selo "Modificada"), o item "Envio ao SIEM" em Logs, os grupos Identidade,
 * Integrações, IA e Proteção de dados, e o chip da organização no topo.
 */
import type { Textos } from './textos'

export type Tela =
  | 'auditoria' | 'siem'
  | 'dominios' | 'scim' | 'sessoes' | 'convites'
  | 'tokens' | 'contas' | 'webhooks' | 'destinos'
  | 'exportacao' | 'ia' | 'ia-limites' | 'continuidade'
  | 'fora'

const props = defineProps<{ t: Textos, tela: Tela, marcarNovo: boolean, foraAtivo: string, workspaces: number }>()
const emit = defineEmits<{ navegar: [tela: Tela, rotulo?: string] }>()

interface Item { rotulo: string, icone: string, tela?: Tela, novo?: boolean, modificado?: boolean }
interface Grupo { titulo: string, itens: Item[], novo?: boolean }

const grupos = computed<Grupo[]>(() => {
  const g = props.t.casca.grupos
  const i = props.t.casca.itens
  return [
    { titulo: g.geral, itens: [{ rotulo: 'Home', icone: 'i-lucide-house' }, { rotulo: 'Users', icone: 'i-lucide-users' }, { rotulo: 'Workspaces', icone: 'i-lucide-briefcase' }] },
    { titulo: g.financeiro, itens: [{ rotulo: 'Wallets', icone: 'i-lucide-wallet' }, { rotulo: 'Transactions', icone: 'i-lucide-arrow-left-right' }, { rotulo: 'Credit Requests', icone: 'i-lucide-credit-card' }] },
    { titulo: g.infraestrutura, itens: [{ rotulo: 'Dashboard', icone: 'i-lucide-layout-dashboard' }, { rotulo: 'Queues', icone: 'i-lucide-layers' }, { rotulo: 'Cache', icone: 'i-lucide-database' }, { rotulo: 'Migrations', icone: 'i-lucide-database-zap' }] },
    { titulo: g.product, itens: [{ rotulo: 'Features', icone: 'i-lucide-toggle-left' }, { rotulo: 'Feedbacks', icone: 'i-lucide-message-square' }, { rotulo: 'Preferences', icone: 'i-lucide-settings' }, { rotulo: 'Communications', icone: 'i-lucide-mail' }, { rotulo: 'Notifications', icone: 'i-lucide-bell' }, { rotulo: 'Notification Types', icone: 'i-lucide-tags' }] },
    {
      titulo: g.logs,
      itens: [
        { rotulo: 'Audit', icone: 'i-lucide-shield-check', tela: 'auditoria', modificado: true },
        { rotulo: i.siem, icone: 'i-lucide-radio-tower', tela: 'siem', novo: true },
        { rotulo: 'Request', icone: 'i-lucide-network' },
        { rotulo: 'AI Usage', icone: 'i-lucide-bot' },
        { rotulo: 'Workflows', icone: 'i-lucide-workflow' },
      ],
    },
    {
      titulo: g.identidade,
      novo: true,
      itens: [
        { rotulo: i.dominios, icone: 'i-lucide-globe', tela: 'dominios', novo: true },
        { rotulo: i.scim, icone: 'i-lucide-refresh-cw', tela: 'scim', novo: true },
        { rotulo: i.sessoes, icone: 'i-lucide-monitor-smartphone', tela: 'sessoes', novo: true },
        { rotulo: i.convites, icone: 'i-lucide-mail-plus', tela: 'convites', novo: true },
      ],
    },
    {
      titulo: g.integracoes,
      novo: true,
      itens: [
        { rotulo: i.tokens, icone: 'i-lucide-key-round', tela: 'tokens', novo: true },
        { rotulo: i.contas, icone: 'i-lucide-bot-message-square', tela: 'contas', novo: true },
        { rotulo: i.webhooks, icone: 'i-lucide-webhook', tela: 'webhooks', novo: true },
        { rotulo: i.destinos, icone: 'i-lucide-route', tela: 'destinos', novo: true },
      ],
    },
    {
      titulo: g.ia,
      novo: true,
      itens: [
        { rotulo: i.ia, icone: 'i-lucide-shield-half', tela: 'ia', novo: true },
        { rotulo: i.iaLimites, icone: 'i-lucide-gauge', tela: 'ia-limites', novo: true },
      ],
    },
    {
      titulo: g.protecao,
      novo: true,
      itens: [
        { rotulo: i.exportacao, icone: 'i-lucide-file-down', tela: 'exportacao', novo: true },
        { rotulo: i.continuidade, icone: 'i-lucide-life-buoy', tela: 'continuidade', novo: true },
      ],
    },
    { titulo: g.plans, itens: [{ rotulo: 'Planos', icone: 'i-lucide-package' }, { rotulo: 'Produtos', icone: 'i-lucide-boxes' }, { rotulo: 'Assinaturas', icone: 'i-lucide-credit-card' }] },
    { titulo: g.configuracoes, itens: [{ rotulo: 'Configurações Gerais', icone: 'i-lucide-settings' }] },
  ]
})

function ativo(item: Item) {
  return item.tela ? item.tela === props.tela : props.tela === 'fora' && props.foraAtivo === item.rotulo
}

/* O item ativo rola para a vista quando um atalho do andaime troca a tela. */
const menu = ref<HTMLElement>()
watch(() => props.tela, async () => {
  await nextTick()
  menu.value?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' })
})
</script>

<template>
  <div class="flex h-dvh flex-col bg-default">
    <!-- Barra do topo -->
    <header class="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-default/50 bg-default/80 px-4 shadow-sm backdrop-blur-md">
      <a href="#" class="flex items-center gap-2" @click.prevent>
        <span class="flex size-9 items-center justify-center rounded-lg bg-primary">
          <UIcon name="i-lucide-rocket" class="size-5 text-inverted" />
        </span>
        <span class="leading-none">
          <span class="text-base font-bold text-primary">ENSPACE</span>
          <sup class="ml-0.5 text-[10px] font-medium text-primary">Admin</sup>
          <span class="block text-[9px] font-medium uppercase tracking-wider text-muted">Control Panel</span>
        </span>
      </a>

      <!-- Proposta: o admin do cliente vê só a própria organização. -->
      <div
        class="ml-4 hidden items-center gap-2 rounded-full border border-default bg-elevated/60 px-3 py-1 text-xs md:flex"
        :class="marcarNovo ? 'ring-2 ring-primary/40 ring-offset-1 ring-offset-default' : ''"
      >
        <UIcon name="i-lucide-building-2" class="size-4 text-primary" />
        <span class="font-semibold text-highlighted">{{ t.casca.organizacao }}</span>
        <span class="text-muted">·</span>
        <span class="text-toned">{{ t.casca.ambiente }}</span>
        <span class="text-muted">·</span>
        <span class="text-toned">{{ t.casca.escopo(workspaces) }}</span>
        <UBadge v-if="marcarNovo" :label="t.casca.novo" size="sm" variant="soft" />
      </div>

      <div class="ml-auto flex items-center gap-3">
        <span class="rounded-sm bg-success px-1 text-[9px] font-bold leading-4 text-inverted" aria-label="Português (Brasil)">BR</span>
        <UIcon name="i-lucide-sun" class="size-4 text-toned" />
        <span class="flex items-center gap-2">
          <span class="flex size-7 items-center justify-center rounded-full bg-primary/10">
            <UIcon name="i-lucide-user-round" class="size-4 text-primary" />
          </span>
          <span class="hidden leading-tight sm:block">
            <span class="block text-xs font-semibold text-highlighted">{{ t.casca.usuaria }}</span>
            <span class="block text-[10px] text-muted">{{ t.casca.papel }}</span>
          </span>
          <UIcon name="i-lucide-chevron-down" class="size-4 text-muted" />
        </span>
      </div>
    </header>

    <div class="flex min-h-0 flex-1">
      <!-- Menu lateral -->
      <aside class="hidden w-60 shrink-0 flex-col border-r border-default bg-default/60 lg:flex">
        <div class="p-3">
          <div class="flex items-center gap-2 rounded-md border border-default px-2 py-1.5 text-sm text-muted">
            <UIcon name="i-lucide-search" class="size-4" />
            <span class="flex-1">{{ t.casca.pesquisar }}</span>
            <UKbd value="CTRL" size="sm" />
            <UKbd value="K" size="sm" />
          </div>
        </div>
        <nav ref="menu" class="flex-1 space-y-4 overflow-y-auto px-3 pb-24">
          <div
            v-for="g in grupos"
            :key="g.titulo"
            class="rounded-md transition-colors"
            :class="marcarNovo && g.novo ? 'bg-primary/5 ring-1 ring-primary/25 -mx-1 px-1 py-1' : ''"
          >
            <p class="mb-1 flex items-center gap-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {{ g.titulo }}
            </p>
            <a
              v-for="item in g.itens"
              :key="item.rotulo"
              href="#"
              class="group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
              :class="ativo(item) ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated hover:text-highlighted'"
              :aria-current="ativo(item) ? 'page' : undefined"
              @click.prevent="emit('navegar', item.tela ?? 'fora', item.rotulo)"
            >
              <UIcon :name="item.icone" class="size-4 shrink-0" />
              <span class="flex-1 truncate">{{ item.rotulo }}</span>
              <UBadge v-if="marcarNovo && item.novo" :label="t.casca.novo" size="sm" variant="soft" />
              <UBadge v-else-if="marcarNovo && item.modificado" :label="t.casca.modificada" color="info" size="sm" variant="soft" />
            </a>
          </div>
        </nav>
      </aside>

      <!-- Conteúdo -->
      <main class="min-w-0 flex-1 overflow-y-auto bg-linear-to-b from-primary/5 via-default to-default pb-28">
        <slot />
      </main>
    </div>
  </div>
</template>
