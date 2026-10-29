<script setup lang="ts">
/**
 * A casca da tela de perfil do ENSPACE, em volta das integrações.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Copiada olhando `https://develop.enspace.io/profile?tab=integrations` em 29/10/2026: a
 * página fica fora do workspace, sem menu lateral; a barra do topo tem o botão do menu, Voltar, Avançar, Recarregar e
 * a trilha "Perfil" com CTRL B e a estrela; à direita, idioma, tema, Suporte, sino e avatar. Abaixo, as abas Perfil,
 * Cobrança, Integrações, Dev, Lab e Segurança (desligada, com cadeado) e o conteúdo num quadro centralizado.
 */
import type { Textos } from './textos'
import { EU } from './mocks'

defineProps<{ t: Textos }>()
const emit = defineEmits<{ voltar: [] }>()

const abas = [
  { chave: 'perfil', icone: 'i-lucide-user-cog' },
  { chave: 'cobranca', icone: 'i-lucide-briefcase' },
  { chave: 'integracoes', icone: 'i-lucide-hexagon', ativa: true },
  { chave: 'dev', icone: 'i-lucide-code' },
  { chave: 'lab', icone: 'i-lucide-flask-conical' },
  { chave: 'seguranca', icone: 'i-lucide-lock', desligada: true },
] as const
</script>

<template>
  <div class="flex h-dvh flex-col bg-default">
    <header class="flex h-12 shrink-0 items-center gap-1 border-b border-default px-3">
      <UButton icon="i-lucide-panel-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.menuLateral" />
      <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.voltar" @click="emit('voltar')" />
      <UButton icon="i-lucide-arrow-right" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.avancar" />
      <UButton icon="i-lucide-rotate-cw" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.recarregar" />
      <div class="ml-2 flex w-[min(50rem,calc(100vw-24rem))] min-w-0 items-center gap-2 rounded-md bg-elevated/70 px-3 py-1.5">
        <span class="truncate text-xs text-toned">{{ t.integracoes.trilha }}</span>
        <span class="ml-auto flex shrink-0 items-center gap-1">
          <UKbd value="ctrl" size="sm" />
          <UKbd value="B" size="sm" />
          <UIcon name="i-lucide-star" class="ml-1 size-3.5 text-muted" />
        </span>
      </div>
      <span class="ml-auto flex items-center gap-1.5">
        <span class="flex size-6 items-center justify-center rounded-full bg-success/15 text-[9px] font-bold text-success" :aria-label="t.casca.idioma">BR</span>
        <UButton icon="i-lucide-sun" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.tema" />
        <UButton icon="i-lucide-headset" :label="t.casca.suporte" color="neutral" variant="outline" size="xs" />
        <UChip text="99+" color="error" size="3xl">
          <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.notificacoes" />
        </UChip>
        <UChip color="success" size="sm" inset>
          <UAvatar size="sm" :text="EU.iniciais" :alt="EU.nome" />
        </UChip>
      </span>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-(--altura-do-andaime)">
      <nav class="mx-auto flex w-fit gap-6 pt-12" :aria-label="t.integracoes.trilha">
        <span
          v-for="a in abas"
          :key="a.chave"
          class="flex items-center gap-1.5 border-b-2 pb-1.5 text-sm"
          :class="'ativa' in a ? 'border-primary text-primary' : 'desligada' in a ? 'border-transparent text-dimmed' : 'border-transparent text-toned'"
          :aria-current="'ativa' in a ? 'page' : undefined"
        >
          <UIcon :name="a.icone" class="size-3.5" />{{ t.integracoes.abas[a.chave] }}
        </span>
      </nav>
      <div class="mx-auto mt-2 max-w-4xl rounded-lg border border-default p-12">
        <slot />
      </div>
    </div>
  </div>
</template>
