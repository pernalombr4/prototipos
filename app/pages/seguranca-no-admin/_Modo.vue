<script setup lang="ts">
/**
 * Os 3 estados de todo controle de bloqueio: Desligado, Só registrar e Bloquear.
 * Segmentado de UButton dentro de UFieldGroup (composição do Nuxt UI), com a
 * explicação do estado escolhido embaixo.
 */
import type { Textos } from './textos'

export type Modo = 'desligado' | 'registrar' | 'bloquear'

defineProps<{ t: Textos, rotulo?: string }>()
const modo = defineModel<Modo>({ required: true })
const opcoes: { valor: Modo, icone: string }[] = [
  { valor: 'desligado', icone: 'i-lucide-circle-off' },
  { valor: 'registrar', icone: 'i-lucide-scroll-text' },
  { valor: 'bloquear', icone: 'i-lucide-shield-ban' },
]
</script>

<template>
  <div class="space-y-1.5">
    <p v-if="rotulo" class="text-xs font-medium text-toned">{{ rotulo }}</p>
    <UFieldGroup size="sm">
      <UButton
        v-for="o in opcoes"
        :key="o.valor"
        :label="t.comum.modos[o.valor]"
        :icon="o.icone"
        :color="modo === o.valor ? (o.valor === 'bloquear' ? 'error' : o.valor === 'registrar' ? 'warning' : 'neutral') : 'neutral'"
        :variant="modo === o.valor ? 'soft' : 'outline'"
        :aria-pressed="modo === o.valor"
        @click="modo = o.valor"
      />
    </UFieldGroup>
    <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
      <p :key="modo" class="text-xs text-muted">{{ t.comum.modosAjuda[modo] }}</p>
    </Transition>
  </div>
</template>
