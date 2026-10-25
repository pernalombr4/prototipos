<script setup lang="ts">
/**
 * Número e unidade de tempo lado a lado (`UFieldGroup`), para todo tempo da aba
 * Proteções: a pessoa escolhe segundos, minutos, horas ou dias.
 */
import type { Duracao, UnidadeDeTempo } from './protecoes'
import { FAIXAS } from './protecoes'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Nome do campo para o leitor de tela. */
  rotulo: string
  disabled?: boolean
  invalido?: boolean
  /** Unidades oferecidas; por padrão, as 4. */
  unidades?: UnidadeDeTempo[]
}>()

const duracao = defineModel<Duracao>({ required: true })
const id = useId()

const itens = computed(() => (props.unidades ?? ['segundos', 'minutos', 'horas', 'dias'] as UnidadeDeTempo[])
  .map(u => ({ value: u, label: props.t.protecoes.unidades[u] })))
</script>

<template>
  <UFieldGroup size="sm">
    <UInputNumber
      :id="`${id}-valor`"
      v-model="duracao.valor"
      :min="FAIXAS.duracao[0]"
      :max="FAIXAS.duracao[1]"
      :increment="false"
      :decrement="false"
      :disabled="disabled"
      :color="invalido ? 'error' : undefined"
      :highlight="invalido"
      :aria-label="rotulo"
      class="w-20"
    />
    <USelect
      :id="`${id}-unidade`"
      v-model="duracao.unidade"
      :items="itens"
      :disabled="disabled"
      :aria-label="`${rotulo}: ${t.protecoes.unidade}`"
      class="w-28"
    />
  </UFieldGroup>
</template>
