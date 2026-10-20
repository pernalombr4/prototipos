<script setup lang="ts">
/**
 * Aviso de en-credits esgotados, no topo da caixa do BENI. PROPOSTA (rodada 11).
 *
 * Pedido da redatora em 2026-10-20: "quando acabar os en-credits, mostre o
 * aviso com a chave própria". A caixa abre normalmente (nada bloqueia o
 * clique em IA); o aviso aparece quando o modelo escolhido depende de
 * en-credits, e diz as 2 saídas:
 * - conectar a chave de uma conta própria (o botão abre o modal das chaves,
 *   direto na conta do modelo quando ele é de uma empresa só);
 * - escolher um modelo de uma conta que já tem chave, quando existe uma.
 * Se a pessoa já tinha pedido uma ação, ela fica guardada e roda ao conectar.
 */
import type { Textos } from './textos'
import type { IdDaIa } from './ias'
import { iaDoModelo, iaPorId, useIasConectadas } from './ias'
import { modelos } from './mocks'

const props = defineProps<{
  t: Textos
  /** o modelo escolhido na caixa */
  modelo: string
  /** a ação que a pessoa pediu e ficou esperando, se houve */
  pendente?: string
}>()
const emit = defineEmits<{ conectar: [ia: IdDaIa | null] }>()

const tc = computed(() => props.t.creditos)
const conectadas = useIasConectadas()

/* Modelo de uma empresa só: o botão leva direto à chave dela. Com "Auto", à lista. */
const iaDoEscolhido = computed(() => iaDoModelo(props.modelo))
const nomeDoModelo = computed(() => modelos.find(m => m.id === props.modelo)?.nome ?? '')
const comChave = computed(() => conectadas.value.map(id => iaPorId(id).nome))
</script>

<template>
  <div role="alert" class="flex animate-[entrada_.25s_ease-out_both] items-start gap-3 border-b border-warning/30 bg-warning/10 px-3 py-2.5">
    <UIcon name="i-lucide-coins" class="mt-0.5 size-4 shrink-0 text-warning" />
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-highlighted">{{ tc.titulo }}</p>
      <p class="text-xs text-toned">
        {{ iaDoEscolhido ? tc.textoModelo(nomeDoModelo, iaDoEscolhido.empresa) : tc.textoAuto }}
      </p>
      <p v-if="iaDoEscolhido && comChave.length" class="mt-1 text-xs text-muted">{{ tc.outraConta(comChave.join(', ')) }}</p>
      <p v-if="pendente" class="mt-1 flex items-center gap-1.5 text-xs text-primary">
        <UIcon name="i-lucide-corner-down-right" class="size-3.5 shrink-0" />{{ tc.emSeguida(pendente) }}
      </p>
    </div>
    <UButton
      :label="iaDoEscolhido ? tc.conectarA(iaDoEscolhido.empresa) : tc.usarChave"
      icon="i-lucide-key-round"
      color="neutral"
      variant="outline"
      size="xs"
      class="shrink-0"
      @click="emit('conectar', iaDoEscolhido?.id ?? null)"
    />
  </div>
</template>
