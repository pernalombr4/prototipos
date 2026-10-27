<script setup lang="ts">
/**
 * A casca do ENSPACE em volta do módulo Jurídico, copiada da tela de develop.
 *
 * ⚠️ NADA AQUI É PROPOSTA, com 1 exceção marcada abaixo. Menu lateral, barra do topo e trilha reproduzem o que o
 * produto já tem. Se algo estiver diferente do develop, é defeito de cópia, não sugestão.
 *
 * Referência: `https://develop.enspace.io/workspaces/<ws>/settings/system`, visitada em 26/10/2026. Partiu de
 * `central-de-execucoes/_CascaDoSpaceflow.vue` (cópia de 24/10/2026). As categorias do menu são as que os casos de
 * uso jurídicos criam no workspace fictício do mock.
 *
 * A EXCEÇÃO (PROPOSTA): com o módulo ligado, o menu do membro ganha "Jurídico", uma tela de módulo (menu nativo, como
 * no protótipo `menu-lateral`), com Intimações, Prazos e Provisão. Desligado, o menu é o de hoje.
 *
 * Rodada 6 (PROPOSTA): tudo o que o módulo usa fica dentro de "Jurídico", também o que é categoria (a categoria dos
 * processos, Assuntos e Audiências). O atalho é criado sozinho quando o módulo liga, abre a mesma rota da tela de
 * categoria e leva a badge de categoria (o ícone de Categorias, com o tooltip). Essas categorias saem da lista de "Categorias" enquanto o módulo está ligado.
 *
 * Na implementação isto é o `EnLayout` com os slots `sidebar-header`, `sidebar-default`, `navbar-leading`,
 * `navbar-title` e `navbar-trailing`.
 */
import type { CategoriaId } from './mocks'
import { categorias, workspace } from './mocks'
import type { Textos } from './textos'
import { LIBERADO } from './submodulos'
import { estado } from './estado'

export type Destino = 'intimacoes' | 'prazos' | 'provisao' | 'sistema' | 'agenda' | `categoria:${CategoriaId}`

const props = defineProps<{
  t: Textos
  ativo: Destino | 'modulo'
  trilha: string[]
  moduloLigado: boolean
  /** Intimações para revisar: o número ao lado de "Intimações". */
  pendentes: number
}>()

const emit = defineEmits<{ ir: [Destino] }>()

interface ItemDeMenu { chave: string, icone: string, expansivel?: boolean, externo?: boolean, destino?: Destino }

const membro = computed<ItemDeMenu[]>(() => [
  { chave: 'inicio', icone: 'i-lucide-house' },
  { chave: 'spaceflows', icone: 'i-lucide-workflow' },
  // PROPOSTA: a tela de módulo
  ...(props.moduloLigado ? [{ chave: 'juridico', icone: 'i-lucide-scale', expansivel: true }] : []),
  { chave: 'categorias', icone: 'i-lucide-layout-grid', expansivel: true },
  { chave: 'tarefas', icone: 'i-lucide-file-text', expansivel: true },
  { chave: 'agenda', icone: 'i-lucide-calendar-days', destino: 'agenda' },
  { chave: 'knowledge', icone: 'i-lucide-table-2', expansivel: true },
])

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

// Rodada 3: só o que o submódulo Capturas liga. A Provisão fica no código, fora do menu (`submodulos.ts`).
const doModulo: { chave: Destino, icone: string }[] = [
  { chave: 'intimacoes', icone: 'i-lucide-inbox' },
  { chave: 'prazos', icone: 'i-lucide-alarm-clock' },
  ...(LIBERADO.provisao ? [{ chave: 'provisao' as const, icone: 'i-lucide-landmark' }] : []),
]

// Rodada 6: as categorias que o módulo usa, na ordem do trabalho. Assuntos só existe com o campo Assunto principal ligado.
const categoriasDoModulo = computed(() => {
  if (!props.moduloLigado) return []
  const ids: CategoriaId[] = [estado.ligacao.categoria]
  if (estado.ligacao.campos.assuntoPrincipal) ids.push('assuntos')
  ids.push('audiencias')
  return [...new Set(ids)].map(id => categorias.find(c => c.id === id)!)
})
const categoriasDoWorkspace = computed(() => categorias.filter(c => !categoriasDoModulo.value.some(m => m.id === c.id)))

const abertos = ref<string[]>(['juridico', 'categorias'])

function clicar(item: ItemDeMenu) {
  if (item.destino) return emit('ir', item.destino)
  if (!item.expansivel) return
  abertos.value = abertos.value.includes(item.chave)
    ? abertos.value.filter(x => x !== item.chave)
    : [...abertos.value, item.chave]
}

const ativoNaConfig = computed(() => props.ativo === 'sistema' || props.ativo === 'modulo')
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
        <template v-for="(grupo, i) in [{ titulo: t.casca.membro, itens: membro }, { titulo: t.casca.configuracoes, itens: configuracoes }, { titulo: t.casca.ajuda, itens: ajuda }]" :key="i">
          <p v-if="!menuRecolhido" class="px-4 pb-1 pt-4 text-xs font-medium text-muted">{{ grupo.titulo }}</p>
          <div v-else class="mx-3 my-3 border-t border-default" />

          <template v-for="item in grupo.itens" :key="item.chave">
            <button
              type="button"
              class="flex w-full items-center gap-2.5 px-4 py-1.5 text-left transition-colors"
              :class="[
                (item.chave === 'sistema' && ativoNaConfig) || (item.chave === 'agenda' && ativo === 'agenda') ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated',
                item.chave === 'juridico' && 'animate-[entrada_.3s_ease-out_both]',
              ]"
              :aria-current="(item.chave === 'sistema' && ativoNaConfig) || (item.chave === 'agenda' && ativo === 'agenda') ? 'page' : undefined"
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

            <!-- PROPOSTA: as telas do módulo -->
            <template v-if="!menuRecolhido && item.chave === 'juridico' && abertos.includes('juridico')">
              <button
                v-for="m in doModulo"
                :key="m.chave"
                type="button"
                class="flex w-full items-center gap-2.5 py-1.5 pl-10 pr-4 text-left transition-colors"
                :class="ativo === m.chave ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated'"
                :aria-current="ativo === m.chave ? 'page' : undefined"
                @click="emit('ir', m.chave)"
              >
                <UIcon :name="m.icone" class="size-4 shrink-0" />
                <span class="flex-1 truncate text-sm">{{ t.casca.itens[m.chave] }}</span>
                <UBadge v-if="m.chave === 'intimacoes' && pendentes" :label="String(pendentes)" color="primary" variant="soft" size="sm" class="tabular-nums" />
              </button>
              <!-- Rodada 6: as categorias do módulo, com a rota da tela de categoria -->
              <button
                v-for="c in categoriasDoModulo"
                :key="c.id"
                type="button"
                class="flex w-full items-center gap-2.5 py-1.5 pl-10 pr-3 text-left transition-colors"
                :class="ativo === `categoria:${c.id}` ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated'"
                :aria-current="ativo === `categoria:${c.id}` ? 'page' : undefined"
                @click="emit('ir', `categoria:${c.id}`)"
              >
                <UIcon :name="c.icone" class="size-4 shrink-0" />
                <span class="min-w-0 flex-1 truncate text-sm">{{ c.nome }}</span>
                <!-- A badge leva o ícone de Categorias e não a palavra: no menu de 208 px, a palavra corta o nome -->
                <UTooltip :text="t.casca.categoriaAjuda">
                  <UBadge icon="i-lucide-layout-grid" color="neutral" variant="outline" size="sm" square class="shrink-0" :aria-label="t.casca.categoria" />
                </UTooltip>
              </button>
            </template>

            <!-- As categorias do workspace, quando "Categorias" está aberto -->
            <template v-if="!menuRecolhido && item.chave === 'categorias' && abertos.includes('categorias')">
              <button
                v-for="c in categoriasDoWorkspace"
                :key="c.id"
                type="button"
                class="flex w-full items-center gap-2.5 py-1.5 pl-10 pr-4 text-left transition-colors"
                :class="ativo === `categoria:${c.id}` ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated'"
                :aria-current="ativo === `categoria:${c.id}` ? 'page' : undefined"
                @click="emit('ir', `categoria:${c.id}`)"
              >
                <UIcon :name="c.icone" class="size-4 shrink-0" />
                <span class="truncate text-sm">{{ c.nome }}</span>
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
