<script setup lang="ts">
/**
 * A casca do ENSPACE em volta do item, montada no `EnLayout` do SDK.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Cópia de `pastas-do-item/_CascaDoItem.vue`
 * (08/10/2026), que por sua vez foi copiada olhando a preview da branch de pastas
 * reordenáveis (`en-space-v2-cdqfljvcg-enlighters.vercel.app`, workspace
 * enspace-releases) em 08/10/2026: menu lateral com Categorias aberto e
 * Contratos ativo, barra do topo com voltar, avançar, recarregar, início,
 * trilha, Ctrl B, estrela, idioma, tema, Suporte, sino 99+ e avatar.
 * A estrutura do menu repete a do protótipo comunicacao-no-workspace, com as
 * entradas deste workspace. O que estiver diferente é defeito de cópia.
 */
import type { Textos } from './textos'
import { workspace } from './mocks'

defineProps<{
  t: Textos
  trilha: string[]
}>()

interface Entrada { chave: string, icone: string, filhos?: boolean, externo?: boolean }

const membro: Entrada[] = [
  { chave: 'inicio', icone: 'i-lucide-house' },
  { chave: 'spaceflows', icone: 'i-lucide-workflow' },
  { chave: 'categorias', icone: 'i-lucide-layout-grid', filhos: true },
  { chave: 'tarefas', icone: 'i-lucide-file-text', filhos: true },
  { chave: 'agenda', icone: 'i-lucide-calendar-days' },
  { chave: 'novoMenu', icone: 'i-lucide-keyboard', filhos: true },
  { chave: 'qaTi', icone: 'i-lucide-keyboard', filhos: true },
]

const configuracoes: Entrada[] = [
  { chave: 'visaoGeral', icone: 'i-lucide-circle-gauge' },
  { chave: 'sistema', icone: 'i-lucide-settings' },
  { chave: 'estrutura', icone: 'i-lucide-database', filhos: true },
  { chave: 'gestaoDeMembros', icone: 'i-lucide-contact' },
  { chave: 'interface', icone: 'i-lucide-compass', filhos: true },
  { chave: 'emails', icone: 'i-lucide-mails', filhos: true },
  { chave: 'integracoes', icone: 'i-lucide-blocks' },
  { chave: 'agentesDeIa', icone: 'i-lucide-cpu' },
  { chave: 'logs', icone: 'i-lucide-activity' },
  { chave: 'credenciais', icone: 'i-lucide-key-round' },
]

const ajuda: Entrada[] = [
  { chave: 'releases', icone: 'i-lucide-package' },
  { chave: 'documentacao', icone: 'i-lucide-book-open', externo: true },
]

/** As categorias do workspace, na ordem do menu. Dado do workspace, não se traduz. */
const categoriasDoMenu = [
  { nome: 'Clicksign', icone: 'i-lucide-file' },
  { nome: 'Meses do Ano (PT)', icone: 'i-lucide-calendar' },
  { nome: 'Docusign', icone: 'i-lucide-file' },
  { nome: 'Enspace Releases', icone: 'i-lucide-file', filhos: true },
  { nome: 'Certisign', icone: 'i-lucide-file' },
  { nome: 'Contratos', icone: 'i-lucide-file', ativo: true },
  { nome: 'QA Estrutura de Testes', icone: 'i-lucide-file', filhos: true },
  { nome: 'D4Sign', icone: 'i-lucide-file' },
  { nome: 'Fornecedores', icone: 'i-lucide-file', filhos: true },
  { nome: 'Adobe Sign', icone: 'i-lucide-file' },
]
</script>

<template>
  <EnLayout variant="default" collapsible="icon" class="[&>.peer]:[--sidebar-width:12.5rem]">
    <template #sidebar-header="{ state }">
      <button type="button" class="-mx-2 flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated">
        <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <UIcon name="i-lucide-circle" class="size-4" />
        </span>
        <span v-if="state === 'expanded'" class="min-w-0 flex-1">
          <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace.name }}</span>
          <span class="block truncate text-xs text-muted">{{ workspace.reference }}</span>
        </span>
        <UIcon v-if="state === 'expanded'" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
      </button>
    </template>

    <template #sidebar-default="{ state }">
      <div class="-mx-2 -mt-2 flex flex-col">
        <button type="button" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated">
          <UIcon name="i-lucide-search" class="size-4 shrink-0 text-highlighted" />
          <template v-if="state === 'expanded'">
            <span class="flex-1 text-sm font-medium text-highlighted">{{ t.casca.buscar }}</span>
            <UKbd value="ctrl" size="sm" />
            <UKbd value="K" size="sm" />
          </template>
        </button>

        <nav :aria-label="t.casca.menuLateral">
          <template v-for="grupo in [{ titulo: t.casca.membro, itens: membro }, { titulo: t.casca.configuracoes, itens: configuracoes }, { titulo: t.casca.ajuda, itens: ajuda }]" :key="grupo.titulo">
            <p v-if="state === 'expanded'" class="px-2 pb-1 pt-5 text-xs text-muted">{{ grupo.titulo }}</p>
            <USeparator v-else class="my-3" />
            <template v-for="e in grupo.itens" :key="e.chave">
              <UTooltip :text="t.casca.itens[e.chave]" :disabled="state === 'expanded'" :content="{ side: 'right' }">
                <button
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated"
                  :class="e.chave === 'categorias' ? 'font-medium text-highlighted' : 'text-toned'"
                >
                  <UIcon :name="e.icone" class="size-4 shrink-0" :class="e.chave === 'categorias' ? 'text-highlighted' : 'text-muted'" />
                  <template v-if="state === 'expanded'">
                    <span class="flex-1 truncate text-sm">{{ t.casca.itens[e.chave] }}</span>
                    <UIcon v-if="e.externo" name="i-lucide-arrow-up-right" class="size-3 shrink-0 text-dimmed" />
                    <UIcon v-else-if="e.filhos" :name="e.chave === 'categorias' ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-4 shrink-0 text-muted" />
                  </template>
                </button>
              </UTooltip>
              <div v-if="state === 'expanded' && e.chave === 'categorias'" class="flex flex-col">
                <button
                  v-for="c in categoriasDoMenu"
                  :key="c.nome"
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded-md py-1.5 pl-7 pr-2 text-left transition-colors"
                  :class="c.ativo ? 'font-medium text-highlighted' : 'text-toned hover:bg-elevated'"
                  :aria-current="c.ativo ? 'page' : undefined"
                >
                  <UIcon :name="c.icone" class="size-4 shrink-0 text-muted" />
                  <span class="flex-1 truncate text-sm">{{ c.nome }}</span>
                  <UIcon v-if="c.filhos" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
                </button>
              </div>
            </template>
          </template>
        </nav>
      </div>
    </template>

    <template #navbar-title>
      <div class="flex w-[min(50rem,calc(100vw-30rem))] min-w-0 items-center gap-1 font-normal">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.voltar" />
        <UButton icon="i-lucide-arrow-right" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.avancar" />
        <UButton icon="i-lucide-rotate-cw" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.recarregar" />
        <UButton icon="i-lucide-house" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.itens.inicio" />
        <div class="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-elevated/70 px-3 py-1.5">
          <nav class="flex min-w-0 items-center gap-1.5 text-xs" :aria-label="t.casca.trilha">
            <template v-for="(parte, i) in trilha" :key="i">
              <UIcon v-if="i" name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
              <span class="truncate" :class="i === trilha.length - 1 ? 'text-highlighted' : 'text-toned'">{{ parte }}</span>
            </template>
          </nav>
          <span class="ml-auto flex shrink-0 items-center gap-1">
            <UKbd value="ctrl" size="sm" />
            <UKbd value="B" size="sm" />
            <UIcon name="i-lucide-star" class="ml-1 size-3.5 text-muted" />
          </span>
        </div>
      </div>
    </template>

    <template #navbar-trailing>
      <span class="flex size-6 items-center justify-center rounded-full bg-success/15 text-[9px] font-bold text-success" :aria-label="t.casca.idioma">BR</span>
      <UButton icon="i-lucide-sun" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.tema" />
      <UButton icon="i-lucide-headset" :label="t.casca.suporte" color="neutral" variant="outline" size="xs" />
      <UChip text="99+" color="error" size="3xl">
        <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.notificacoes" />
      </UChip>
      <UChip color="success" size="sm" inset>
        <UAvatar size="sm" text="MJ" alt="Mikaela Jardim" />
      </UChip>
    </template>

    <slot />
  </EnLayout>
</template>
