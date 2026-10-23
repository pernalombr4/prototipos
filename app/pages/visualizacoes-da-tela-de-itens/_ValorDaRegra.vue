<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): o valor de uma regra de filtro, no controle do tipo do campo.
 *
 * - `lista`: as opções em caixas, com busca a partir de 7 opções (o chip da linha de filtros, como no Notion);
 * - `linha`: um seletor compacto (a linha do filtro avançado e do painel).
 */
import type { FiltroDeCampo } from './mocks'
import type { Textos } from './textos'
import { campoPorPath } from './mocks'
import { ehLista, opcoesDe, semValor } from './filtros'

const props = withDefaults(defineProps<{ t: Textos, modo?: 'lista' | 'linha' }>(), { modo: 'linha' })
const regra = defineModel<FiltroDeCampo>({ required: true })

const tipo = computed(() => campoPorPath(regra.value.field)?.tipo ?? 'texto')
const opcoes = computed(() => opcoesDe(regra.value.field))
const marcadas = computed<(string | number)[]>(() => Array.isArray(regra.value.value) ? regra.value.value as (string | number)[] : [])

const busca = ref('')
const visiveis = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return q ? opcoes.value.filter(o => o.label.toLowerCase().includes(q)) : opcoes.value
})

function alternar(v: string | number, ligado: boolean) {
  const lista = marcadas.value.filter(x => x !== v)
  regra.value = { ...regra.value, value: ligado ? [...lista, v] : lista }
}
const mudar = (value: unknown) => { regra.value = { ...regra.value, value } }
</script>

<template>
  <template v-if="!semValor(regra.op)">
    <!-- Seleção e pessoa: várias opções -->
    <template v-if="ehLista(regra.op)">
      <div v-if="props.modo === 'lista'" class="space-y-1">
        <UInput v-if="opcoes.length > 6" v-model="busca" :placeholder="t.filtro.buscarOpcao" icon="i-lucide-search" size="xs" class="w-full" />
        <div class="max-h-60 space-y-0.5 overflow-y-auto">
          <UCheckbox
            v-for="o in visiveis"
            :key="String(o.value)"
            :model-value="marcadas.includes(o.value)"
            :label="o.label"
            size="sm"
            class="rounded-md px-1.5 py-1 hover:bg-elevated"
            @update:model-value="(v: boolean | 'indeterminate') => alternar(o.value, v === true)"
          />
        </div>
      </div>
      <USelectMenu
        v-else
        :model-value="marcadas"
        :items="opcoes"
        value-key="value"
        multiple
        :placeholder="t.filtro.escolher"
        size="sm"
        class="w-full min-w-0"
        :aria-label="t.filtro.valor"
        @update:model-value="(v: (string | number)[]) => mudar(v)"
      />
    </template>

    <UInput
      v-else-if="tipo === 'data' && regra.op === 'next_days'"
      :model-value="Number(regra.value)"
      type="number"
      size="sm"
      class="w-full min-w-0"
      :aria-label="t.filtro.valor"
      :ui="{ trailing: 'pointer-events-none' }"
      @update:model-value="(v: string | number) => mudar(Number(v))"
    >
      <template #trailing><span class="text-xs text-muted">{{ t.painel.dias }}</span></template>
    </UInput>
    <UInput
      v-else-if="tipo === 'data'"
      :model-value="String(regra.value)"
      type="date"
      size="sm"
      class="w-full min-w-0"
      :aria-label="t.filtro.valor"
      @update:model-value="(v: string) => mudar(v)"
    />
    <UInput
      v-else
      :model-value="String(regra.value ?? '')"
      :type="tipo === 'moeda' ? 'number' : 'text'"
      :placeholder="t.filtro.valor"
      size="sm"
      class="w-full min-w-0"
      :aria-label="t.filtro.valor"
      @update:model-value="(v: string | number) => mudar(tipo === 'moeda' ? Number(v) : v)"
    />
  </template>
</template>
