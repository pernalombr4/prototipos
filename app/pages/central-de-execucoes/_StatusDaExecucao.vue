<script setup lang="ts">
/**
 * O status de uma execução. Hoje: o status cru do schema (Completo, Em andamento, Erro).
 * PROPOSTA: o grupo que a pessoa entende (Rodando, Esperando, Com erro, Parada pela plataforma,
 * Concluída), com ícone próprio e o motivo escrito embaixo, porque a cor sozinha não basta.
 */
import type { Execucao } from './mocks'
import type { Textos } from './textos'
import { estiloDoGrupo, grupoDe, motivoDoStatus } from './consultas'

const props = defineProps<{ e: Execucao, t: Textos, hoje?: boolean, semMotivo?: boolean }>()

const estiloDeHoje = { completed: 'success', working: 'info', error: 'error' } as const
const grupo = computed(() => grupoDe(props.e))
const motivo = computed(() => (props.semMotivo ? undefined : motivoDoStatus(props.e, props.t)))
</script>

<template>
  <span v-if="hoje" class="inline-flex">
    <UBadge
      :label="t.status[e.status === 'queued' || e.status === 'stopped' ? 'working' : e.status]"
      :color="estiloDeHoje[e.status as keyof typeof estiloDeHoje] ?? 'neutral'"
      variant="subtle"
      size="sm"
    />
  </span>
  <span v-else class="flex min-w-0 flex-col items-start gap-0.5">
    <UBadge
      :label="t.grupos[grupo]"
      :icon="estiloDoGrupo[grupo].icone"
      :color="estiloDoGrupo[grupo].cor"
      :variant="grupo === 'parada' ? 'outline' : 'subtle'"
      size="sm"
      :ui="{ leadingIcon: grupo === 'rodando' ? 'animate-spin [animation-duration:2.4s] motion-reduce:animate-none' : undefined }"
    />
    <span v-if="motivo" class="max-w-64 truncate text-xs text-muted" :title="motivo">{{ motivo }}</span>
  </span>
</template>
