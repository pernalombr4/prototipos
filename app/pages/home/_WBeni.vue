<script setup lang="ts">
/**
 * Widget BENI (rodada 6). A redatora pediu que ele fique no padrão "pra
 * induzir o user a usar IA, mesmo no estado inicial", e depois corrigiu: "o
 * resumo do beni (widget) nao deve ter chat de conversa. é só o resumo dele
 * mesmo. [...] pode ter um botao que, ao ser clicado, abre o chat flutuante
 * do beni [...] mas o user deve digitar no chat, nao no widget".
 *
 * Então o widget tem:
 * - o resumo do dia, quando há tarefas e itens; no workspace que acabou de
 *   nascer, a apresentação do que o BENI faz;
 * - o botão "Conversar com o BENI", que abre a conversa flutuante
 *   (`_ChatDoBeni.vue`) vazia, com o cursor no campo dela.
 * Nenhum campo de texto no widget.
 *
 * MAQUETE: o resumo é texto fixo do mocks.ts.
 *
 * Componentes: `UButton`, `UIcon` (MCP nuxt-ui).
 */
import AvatarDoBeni from './_AvatarDoBeni.vue'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  beni: { linhas: { icone: string, texto: string }[] }
}>()
const emit = defineEmits<{ conversar: [] }>()

const temResumo = computed(() => props.beni.linhas.length > 0)
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col gap-3 px-4 pb-4">
    <ul v-if="temResumo" class="min-h-0 flex-1 space-y-2 overflow-y-auto">
      <li v-for="(l, i) in beni.linhas" :key="i" class="flex gap-2.5 animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none" :style="{ animationDelay: `${i * 80}ms` }">
        <UIcon :name="l.icone" class="mt-0.5 size-4 shrink-0 text-primary" />
        <span class="text-sm text-toned">{{ l.texto }}</span>
      </li>
    </ul>
    <div v-else class="flex min-h-0 flex-1 items-center gap-3">
      <AvatarDoBeni tamanho="lg" />
      <div class="min-w-0">
        <p class="text-sm text-toned">
          {{ t.beniW.boasVindas }}
        </p>
        <p class="mt-1 text-xs text-muted">
          {{ t.vazios.beni }}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2">
      <UButton
        :label="t.beniW.conversar"
        icon="i-lucide-message-circle"
        color="primary"
        variant="soft"
        size="sm"
        @click="emit('conversar')"
      />
      <span v-if="temResumo" class="flex items-center gap-1 text-xs text-dimmed">
        <UIcon name="i-lucide-sparkles" class="size-3" />{{ t.beni.aviso }}
      </span>
    </div>
  </div>
</template>
