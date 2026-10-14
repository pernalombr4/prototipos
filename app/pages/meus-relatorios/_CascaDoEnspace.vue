<script setup lang="ts">
/**
 * A casca do ENSPACE, copiada da tela de develop.
 *
 * ⚠️ NADA AQUI É PROPOSTA, com DUAS exceções marcadas abaixo:
 * 1. o item da tela de exportações no menu lateral (com o "gerando" e o
 *    contador de prontos);
 * 2. as notificações de relatório dentro do sino.
 * Menu lateral, barra do topo, trilha e atalhos são a reprodução do que o
 * produto já tem. Se algo mais estiver diferente do develop, é defeito de
 * cópia, não sugestão.
 *
 * Referência: `https://develop.enspace.io/workspaces/<ws>/myReports`,
 * `/types/<categoria>` e `/tasks/quick`, visitadas em 14/10/2026. Mesma casca
 * do protótipo `painel-de-tarefas`, conferida de novo nesta data: Integrações
 * ganhou chevron. Item por item no BRIEFING.md.
 *
 * Na implementação isto é o `EnLayout` com os slots `sidebar-header`,
 * `sidebar-default`, `navbar-leading`, `navbar-title` e `navbar-trailing`.
 */
import type { Textos } from './textos'

export interface NotificacaoDoSino {
  id: number
  tipo: 'pronto' | 'falhou'
  origem: string
  quando: string
  lida: boolean
}

const props = defineProps<{
  t: Textos
  workspace: string
  slug: string
  /** Nome da tela de exportações, como o andaime escolheu. */
  nomeDaTela: string
  /** Qual tela está aberta. */
  ativo: 'exportacoes' | 'contratos'
  /** Trilha depois do workspace. */
  trilha: string[]
  /** Há relatório na fila ou gerando. */
  gerando: boolean
  /** Prontos que a pessoa ainda não abriu. */
  prontosNaoVistos: number
  notificacoes: NotificacaoDoSino[]
}>()

const emit = defineEmits<{
  navegar: [destino: 'exportacoes' | 'contratos']
  abrirNotificacao: [id: number]
  marcarLidas: []
}>()

interface ItemDeMenu {
  chave: string
  icone: string
  expansivel?: boolean
  externo?: boolean
  /** PROPOSTA: o item novo. */
  proposta?: boolean
}

const membro: ItemDeMenu[] = [
  { chave: 'inicio', icone: 'i-lucide-house' },
  { chave: 'spaceflows', icone: 'i-lucide-workflow' },
  { chave: 'categorias', icone: 'i-lucide-layout-grid', expansivel: true },
  { chave: 'tarefas', icone: 'i-lucide-file-text', expansivel: true },
  { chave: 'agenda', icone: 'i-lucide-calendar-days' },
  // PROPOSTA: a tela vira destino nativo, ao lado das outras telas pessoais.
  { chave: 'exportacoes', icone: 'i-lucide-file-down', proposta: true },
  { chave: 'knowledge', icone: 'i-lucide-table-2', expansivel: true },
]

const configuracoes: ItemDeMenu[] = [
  { chave: 'visaoGeral', icone: 'i-lucide-circle-gauge' },
  { chave: 'sistema', icone: 'i-lucide-settings' },
  { chave: 'estrutura', icone: 'i-lucide-layers', expansivel: true },
  { chave: 'gestaoDeMembros', icone: 'i-lucide-contact' },
  { chave: 'interface', icone: 'i-lucide-panels-top-left', expansivel: true },
  { chave: 'emails', icone: 'i-lucide-mail', expansivel: true },
  { chave: 'integracoes', icone: 'i-lucide-blocks', expansivel: true },
  { chave: 'agentesDeIa', icone: 'i-lucide-bot' },
  { chave: 'logs', icone: 'i-lucide-activity' },
]

const ajuda: ItemDeMenu[] = [
  { chave: 'releases', icone: 'i-lucide-package' },
  { chave: 'documentacao', icone: 'i-lucide-book-marked', externo: true },
]

/** As categorias do workspace, como aparecem abertas no menu. */
const categoriasDoMenu = [
  { chave: 'contratos', rotulo: 'Contratos', icone: 'i-lucide-file-signature' },
  { chave: 'fornecedores', rotulo: 'Fornecedores', icone: 'i-lucide-truck' },
  { chave: 'chamados', rotulo: 'Chamados de suporte', icone: 'i-lucide-life-buoy' },
]

const abertos = ref<string[]>(['categorias'])

function alternar(chave: string) {
  abertos.value = abertos.value.includes(chave)
    ? abertos.value.filter(x => x !== chave)
    : [...abertos.value, chave]
}

function rotulo(chave: string) {
  return chave === 'exportacoes' ? props.nomeDaTela : props.t.casca.itens[chave]
}

function clicar(item: ItemDeMenu) {
  if (item.expansivel) alternar(item.chave)
  else if (item.chave === 'exportacoes') emit('navegar', 'exportacoes')
}

const menuRecolhido = ref(false)
const naoLidas = computed(() => props.notificacoes.filter(n => !n.lida).length)
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
          {{ workspace.slice(0, 2).toUpperCase() }}
        </span>
        <span v-if="!menuRecolhido" class="min-w-0 flex-1">
          <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace }}</span>
          <span class="block truncate text-xs text-muted">{{ slug }}</span>
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
        <template v-for="(grupo, i) in [{ titulo: t.casca.membro, itens: membro }, { titulo: t.casca.configuracoes, itens: configuracoes }, { titulo: t.casca.ajuda, itens: ajuda }]" :key="i">
          <p v-if="!menuRecolhido" class="px-4 pb-1 pt-4 text-xs font-medium text-muted">
            {{ grupo.titulo }}
          </p>
          <div v-else class="mx-3 my-3 border-t border-default" />

          <template v-for="item in grupo.itens" :key="item.chave">
            <UTooltip :text="rotulo(item.chave)" :disabled="!menuRecolhido" :content="{ side: 'right' }">
              <button
                type="button"
                class="flex w-full items-center gap-2.5 px-4 py-1.5 text-left transition-colors"
                :class="item.chave === ativo
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-toned hover:bg-elevated'"
                :aria-current="item.chave === ativo ? 'page' : undefined"
                @click="clicar(item)"
              >
                <span class="relative flex shrink-0">
                  <UIcon :name="item.icone" class="size-4" />
                  <!-- PROPOSTA: o ponto que avisa, mesmo com o menu recolhido -->
                  <span
                    v-if="item.proposta && menuRecolhido && (gerando || prontosNaoVistos)"
                    class="absolute -right-1 -top-1 size-2 rounded-full"
                    :class="gerando ? 'animate-pulse bg-info' : 'bg-primary'"
                  />
                </span>
                <template v-if="!menuRecolhido">
                  <span class="flex-1 truncate text-sm">{{ rotulo(item.chave) }}</span>

                  <!-- PROPOSTA: o estado vive no próprio item do menu -->
                  <template v-if="item.proposta">
                    <UIcon
                      v-if="gerando"
                      name="i-lucide-loader-circle"
                      class="size-3.5 shrink-0 animate-spin text-info"
                      :aria-label="t.casca.gerandoNoMenu"
                    />
                    <Transition
                      enter-active-class="transition duration-300 ease-out"
                      enter-from-class="scale-50 opacity-0"
                      leave-active-class="transition duration-150"
                      leave-to-class="scale-50 opacity-0"
                    >
                      <UBadge
                        v-if="prontosNaoVistos"
                        :label="String(prontosNaoVistos)"
                        color="primary"
                        variant="solid"
                        size="sm"
                        class="shrink-0 rounded-full tabular-nums"
                        :aria-label="t.casca.prontosNaoVistos(prontosNaoVistos)"
                      />
                    </Transition>
                  </template>

                  <UIcon v-else-if="item.externo" name="i-lucide-arrow-up-right" class="size-3 shrink-0 text-dimmed" />
                  <UIcon
                    v-else-if="item.expansivel"
                    :name="abertos.includes(item.chave) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                    class="size-4 shrink-0 text-muted"
                  />
                </template>
              </button>
            </UTooltip>

            <!-- Categorias aberta, como no develop -->
            <template v-if="!menuRecolhido && item.chave === 'categorias' && abertos.includes('categorias')">
              <button
                v-for="c in categoriasDoMenu"
                :key="c.chave"
                type="button"
                class="flex w-full items-center gap-2.5 py-1.5 pl-10 pr-4 text-left transition-colors"
                :class="c.chave === ativo ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated'"
                :aria-current="c.chave === ativo ? 'page' : undefined"
                @click="c.chave === 'contratos' && emit('navegar', 'contratos')"
              >
                <UIcon :name="c.icone" class="size-4 shrink-0" />
                <span class="truncate text-sm">{{ c.rotulo }}</span>
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
            <span class="truncate text-toned">{{ workspace }}</span>
            <template v-for="(parte, i) in trilha" :key="i">
              <UIcon name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
              <span class="truncate" :class="i === trilha.length - 1 ? 'font-medium text-highlighted' : 'text-toned'">{{ parte }}</span>
            </template>
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

          <!-- O sino é do produto. PROPOSTA: a notificação de relatório dentro dele. -->
          <UPopover :content="{ align: 'end', sideOffset: 8 }">
            <UChip :text="naoLidas ? String(naoLidas) : '99+'" color="error" size="3xl" :ui="{ base: 'px-1' }">
              <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.notificacoes" />
            </UChip>
            <template #content>
              <div class="w-80">
                <div class="flex items-center justify-between border-b border-default px-3 py-2">
                  <p class="text-sm font-semibold text-highlighted">{{ t.sino.titulo }}</p>
                  <UButton :label="t.sino.marcarLidas" color="neutral" variant="link" size="xs" @click="emit('marcarLidas')" />
                </div>
                <ul v-if="notificacoes.length" class="max-h-80 overflow-y-auto py-1">
                  <li v-for="n in notificacoes" :key="n.id">
                    <button
                      type="button"
                      class="flex w-full items-start gap-2.5 px-3 py-2 text-left transition-colors hover:bg-elevated"
                      @click="emit('abrirNotificacao', n.id)"
                    >
                      <UIcon
                        :name="n.tipo === 'pronto' ? 'i-lucide-file-down' : 'i-lucide-circle-alert'"
                        class="mt-0.5 size-4 shrink-0"
                        :class="n.tipo === 'pronto' ? 'text-primary' : 'text-error'"
                      />
                      <span class="min-w-0 flex-1">
                        <span class="block text-sm" :class="n.lida ? 'text-toned' : 'font-medium text-highlighted'">
                          {{ n.tipo === 'pronto' ? t.sino.pronto(n.origem) : t.sino.falhou(n.origem) }}
                        </span>
                        <span class="block text-xs text-muted">{{ n.quando }}</span>
                      </span>
                      <span v-if="!n.lida" class="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                    </button>
                  </li>
                </ul>
                <p v-else class="px-3 py-6 text-center text-sm text-muted">{{ t.sino.semNotificacao }}</p>
              </div>
            </template>
          </UPopover>

          <UChip color="success" size="sm" inset>
            <UAvatar size="xs" text="MJ" :alt="t.casca.conta" />
          </UChip>
        </div>
      </header>

      <div class="flex min-h-0 flex-1 flex-col">
        <slot />
      </div>
    </div>
  </div>
</template>
