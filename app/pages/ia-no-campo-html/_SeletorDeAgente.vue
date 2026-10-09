<script setup lang="ts">
/**
 * Seletor de agente da caixa do BENI. PROPOSTA.
 *
 * Lista o BENI (padrão) e os agentes do workspace que estão ativos e que a
 * pessoa pode usar (Configurações › Agentes de IA). Agente inativo ou sem
 * acesso não aparece, como no Confluence e no Word (PESQUISA-RODADA-2, A).
 * Cada item mostra o BENI do agente, o tipo e a descrição: nenhum concorrente
 * mostra o tipo na lista.
 */
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { AgenteDoCampo } from './mocks'
import { agentesVisiveis } from './mocks'
import AvatarDoAgente from './_AvatarDoAgente.vue'

const props = defineProps<{ t: Textos }>()
const agente = defineModel<AgenteDoCampo | null>({ default: null })
const aberto = ref(false)

const grupos = computed<CommandPaletteGroup[]>(() => [
  {
    id: 'beni',
    items: [{ label: props.t.agente.beni, description: props.t.agente.beniDescricao, suffix: props.t.agente.padrao, slug: '' }],
  },
  {
    id: 'agentes',
    label: props.t.beni.grupoAgentes,
    items: agentesVisiveis.map(a => ({ label: a.name, description: a.description, suffix: props.t.agente.tipos[a.type ?? 'chat'], slug: a.slug })),
  },
])

function escolher(item: CommandPaletteItem) {
  agente.value = agentesVisiveis.find(a => a.slug === item.slug) ?? null
  aberto.value = false
}
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', side: 'top', sideOffset: 6 }">
    <UButton color="neutral" variant="ghost" size="xs" class="gap-1.5 px-1.5" :aria-label="`${t.agente.rotulo}: ${agente?.name ?? t.agente.beni}`">
      <AvatarDoAgente :agente="agente" tamanho="xs" />
      <span class="max-w-36 truncate text-xs font-medium text-highlighted">{{ agente?.name ?? t.agente.beni }}</span>
      <UIcon name="i-lucide-chevron-down" class="size-3.5 text-muted" />
    </UButton>

    <template #content>
      <UCommandPalette
        :groups="grupos"
        :placeholder="t.agente.buscar"
        size="sm"
        class="w-80"
        :ui="{ content: 'max-h-80', itemDescription: 'line-clamp-1' }"
        @update:model-value="escolher"
      >
        <template #item-leading="{ item }">
          <AvatarDoAgente :agente="agentesVisiveis.find(a => a.slug === item.slug) ?? null" tamanho="sm" />
        </template>
        <template #item-trailing="{ item }">
          <UIcon v-if="(agente?.slug ?? '') === item.slug" name="i-lucide-check" class="size-4 text-primary" />
        </template>
        <template #empty>
          <span class="text-sm text-muted">{{ t.agente.nenhum }}</span>
        </template>
        <template #footer>
          <div class="flex items-center justify-between gap-2 text-xs text-muted">
            <span>{{ t.agente.nota }}</span>
            <UButton :label="t.agente.gerenciar" trailing-icon="i-lucide-arrow-up-right" color="neutral" variant="link" size="xs" class="px-0" />
          </div>
        </template>
      </UCommandPalette>
    </template>
  </UPopover>
</template>
