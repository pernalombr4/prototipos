<script setup lang="ts">
/**
 * Um campo da Visão Geral: rótulo em cima, entrada na largura toda e o botão
 * de limpar à direita, como o develop desenha (25/11/2026).
 *
 * ⚠️ NADA AQUI É PROPOSTA. O que a proposta muda é QUAIS campos aparecem,
 * não como cada um se desenha. Campo calculado (virtual) aparece sem edição,
 * como o "Total virtual" do develop.
 */
import type { Campo } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, campo: Campo }>()
const valor = defineModel<string | number>({ default: '' })

const id = computed(() => `campo-${props.campo.refId}`)
const temValor = computed(() => valor.value !== '' && valor.value !== null && valor.value !== undefined)
</script>

<template>
  <UFormField :label="campo.rotulo" :name="campo.refId" :ui="{ label: 'font-semibold' }">
    <USelect
      v-if="campo.tipo === 'selecao'"
      :id="id"
      v-model="valor as string"
      :items="campo.opcoes"
      class="w-full"
    />
    <UTextarea
      v-else-if="campo.tipo === 'textoLongo'"
      :id="id"
      v-model="valor as string"
      :rows="2"
      autoresize
      class="w-full"
    />
    <UInput
      v-else
      :id="id"
      v-model="valor"
      :type="campo.tipo === 'data' ? 'date' : campo.tipo === 'numero' ? 'number' : 'text'"
      :disabled="campo.virtual"
      class="w-full"
    >
      <template v-if="temValor && !campo.virtual" #trailing>
        <UButton
          icon="i-lucide-circle-x"
          color="neutral"
          variant="link"
          size="sm"
          :aria-label="t.conteudo.limpar"
          @click="valor = ''"
        />
      </template>
    </UInput>
  </UFormField>
</template>
