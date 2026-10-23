<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): uma regra do filtro avançado: campo, condição e valor.
 * Na linha do filtro avançado fica tudo lado a lado; no painel, que é estreito, o campo vai em cima.
 */
import type { FiltroDeCampo } from './mocks'
import type { Textos } from './textos'
import { CAMPOS, ICONE_DO_TIPO } from './mocks'
import { comOperador, operadoresDe, regraNova, semValor } from './filtros'
import ValorDaRegra from './_ValorDaRegra.vue'

defineProps<{ t: Textos, empilhado?: boolean }>()
const regra = defineModel<FiltroDeCampo>({ required: true })

const campos = CAMPOS.map(c => ({ label: c.label, value: c.path, icon: ICONE_DO_TIPO[c.tipo] }))
const iconeDoCampo = computed(() => campos.find(c => c.value === regra.value.field)?.icon)
</script>

<template>
  <div class="min-w-0" :class="empilhado ? 'space-y-1.5' : 'flex items-center gap-1.5'">
    <USelectMenu
      :model-value="regra.field"
      :items="campos"
      value-key="value"
      :icon="iconeDoCampo"
      size="sm"
      :class="empilhado ? 'w-full' : 'w-44 shrink-0'"
      :search-input="{ placeholder: t.filtro.buscarCampo }"
      :aria-label="t.filtro.campo"
      @update:model-value="(v: string) => (regra = regraNova(v))"
    />
    <div class="min-w-0" :class="empilhado ? 'grid grid-cols-2 gap-1.5' : 'flex flex-1 items-center gap-1.5'">
      <USelect
        :model-value="regra.op"
        :items="operadoresDe(t, regra.field)"
        size="sm"
        :class="empilhado ? (semValor(regra.op) ? 'col-span-2' : 'min-w-0') : (semValor(regra.op) ? 'w-full' : 'w-36 shrink-0')"
        :aria-label="t.filtro.operador"
        @update:model-value="(v: string) => (regra = comOperador(regra, v))"
      />
      <div v-if="!semValor(regra.op)" class="min-w-0" :class="empilhado ? '' : 'flex-1'">
        <ValorDaRegra v-model="regra" :t="t" />
      </div>
    </div>
  </div>
</template>
