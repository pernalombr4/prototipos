<script setup lang="ts">
/**
 * Agentes de IA, o widget do grupo IA ao lado do BENI.
 *
 * Rodada 7: hoje se abre a conversa e se troca o agente no seletor do topo.
 * Aqui, 1 clique abre a conversa já com o agente. Dado: `GET /ai/agents`
 * (enlighten-api@develop 8669875cf `plugins/en-ai/config/routes.json:274-287`),
 * que junta os agentes do sistema e os do workspace.
 *
 * Rodada 8, a pedido da redatora: Revisões por IA, Créditos de IA e Falhas
 * dos agentes saíram ("nao faz sentido").
 *
 * No MVP, o clique abre a conversa em tela cheia, que já aceita `?agent=`
 * (en-space@develop be2a5d850 `src/pages/workspaces/[workspace]/ai/chat/index.vue:23-26`).
 * A conversa flutuante guarda o agente só por dentro e não recebe um agente
 * de fora (en-sdk@develop 2dbd22c `packages/ui/src/components/ai/AiChatsSharedFloat.vue:62`).
 *
 * Componentes: `UScrollArea`, `UBadge`, `UButton`, `UIcon` (MCP nuxt-ui).
 */
import AvatarDoBeni from './_AvatarDoBeni.vue'
import type { AgenteDeIA } from './mocks'
import type { Textos } from './textos'

defineProps<{
  t: Textos
  agentes: AgenteDeIA[]
  admin: boolean
}>()
const emit = defineEmits<{
  conversar: [agente: AgenteDeIA]
  abrir: [destino: string]
}>()
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col pb-3">
    <UScrollArea class="min-h-0 flex-1">
      <ul class="px-2">
        <li v-for="(a, i) in agentes" :key="a.slug" class="animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none" :style="{ animationDelay: `${i * 40}ms` }">
          <button
            type="button"
            class="group/agente flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
            :aria-label="t.iaW.agentes.conversar(a.nome)"
            @click="emit('conversar', a)"
          >
            <AvatarDoBeni :cor="a.cor" tamanho="md" />
            <span class="min-w-0 flex-1">
              <span class="flex items-center gap-1.5">
                <span class="truncate text-sm font-medium text-highlighted">{{ a.nome }}</span>
                <UBadge v-if="a.sistema" :label="t.iaW.agentes.sistema" color="neutral" variant="subtle" size="sm" class="shrink-0" />
                <UBadge v-else-if="a.tipo === 'reviewer'" :label="t.iaW.agentes.revisor" color="info" variant="subtle" size="sm" class="shrink-0" />
              </span>
              <span class="line-clamp-2 text-xs leading-snug text-muted">{{ a.descricao }}</span>
            </span>
            <UIcon name="i-lucide-message-circle" class="size-4 shrink-0 text-dimmed transition-colors group-hover/agente:text-primary" />
          </button>
        </li>
      </ul>
    </UScrollArea>
    <UButton v-if="admin" :label="t.iaW.agentes.gerenciar" trailing-icon="i-lucide-arrow-right" color="neutral" variant="ghost" size="xs" class="mx-4 mt-1 self-start" @click="emit('abrir', t.iaW.agentes.gerenciar)" />
  </div>
</template>
