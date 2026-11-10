<script setup lang="ts">
/**
 * Cabeçalho de coluna de data: rótulo, ordenar (RF008) e filtrar (RF012).
 * O prazo de hoje usa o mesmo cabeçalho, porque o prazo final filtra "como as
 * colunas de data que já filtram".
 */
import type { Textos } from './textos'
import type { FiltroDeColuna } from './datas'

const props = defineProps<{
  t: Textos
  rotulo: string
  ordem: 'asc' | 'desc' | null
}>()

const filtro = defineModel<FiltroDeColuna>('filtro', { required: true })
const emit = defineEmits<{ ordenar: [direcao: 'asc' | 'desc' | null] }>()

const aberto = ref(false)
const de = ref(filtro.value.de ?? '')
const ate = ref(filtro.value.ate ?? '')
watch(aberto, v => {
  if (v) {
    de.value = filtro.value.de ?? ''
    ate.value = filtro.value.ate ?? ''
  }
})

const ativo = computed(() => !!(filtro.value.de || filtro.value.ate))
const iconeDaOrdem = computed(() => props.ordem === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : props.ordem === 'desc' ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-down')

const itensDeOrdem = computed(() => [[
  { label: props.t.crescente, icon: 'i-lucide-arrow-up-narrow-wide', onSelect: () => emit('ordenar', 'asc') },
  { label: props.t.decrescente, icon: 'i-lucide-arrow-down-wide-narrow', onSelect: () => emit('ordenar', 'desc') },
], [
  { label: props.t.tirarOrdem, icon: 'i-lucide-x', disabled: !props.ordem, onSelect: () => emit('ordenar', null) },
]])

function aplicar() {
  filtro.value = { de: de.value || null, ate: ate.value || null }
  aberto.value = false
}
function limpar() {
  filtro.value = { de: null, ate: null }
  aberto.value = false
}
</script>

<template>
  <div class="flex items-center gap-1">
    <span>{{ rotulo }}</span>
    <UDropdownMenu :items="itensDeOrdem" :content="{ align: 'start' }">
      <UButton
        :icon="iconeDaOrdem"
        :color="ordem ? 'primary' : 'neutral'"
        variant="ghost"
        size="xs"
        :aria-label="t.ordenar(rotulo)"
      />
    </UDropdownMenu>
    <UPopover v-model:open="aberto" :content="{ align: 'start' }">
      <UButton
        icon="i-lucide-filter"
        :color="ativo ? 'primary' : 'neutral'"
        :variant="ativo ? 'soft' : 'ghost'"
        size="xs"
        :aria-label="t.filtrarColuna(rotulo)"
      />
      <template #content>
        <div class="w-64 space-y-3 p-3">
          <p class="text-sm font-medium text-highlighted">{{ t.filtrarColuna(rotulo) }}</p>
          <UFormField :label="t.aPartirDe">
            <UInput v-model="de" type="date" class="w-full" />
          </UFormField>
          <UFormField :label="t.ate">
            <UInput v-model="ate" type="date" class="w-full" />
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton :label="t.limpar" color="neutral" variant="outline" size="sm" @click="limpar" />
            <UButton :label="t.aplicar" size="sm" @click="aplicar" />
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>
