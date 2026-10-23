<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): o filtro simples, um chip por campo na linha de filtros (Notion).
 *
 * O chip mostra o campo e o que está escolhido ("Status: Aprovado, Assinado"). Abre um painel curto:
 * a condição no topo, as opções em caixas (várias valem como "ou"), "Limpar seleção" e o "⋯" com
 * Excluir filtro e Levar para o filtro avançado. Sem nada escolhido, o chip não filtra e fica tracejado.
 */
import type { FiltroDeCampo } from './mocks'
import type { Textos } from './textos'
import { ICONE_DO_TIPO, campoPorPath } from './mocks'
import { comOperador, ehLista, operadoresDe, semValor, vazia } from './filtros'
import ValorDaRegra from './_ValorDaRegra.vue'

const props = defineProps<{ t: Textos, valorCurto: string }>()
const regra = defineModel<FiltroDeCampo>({ required: true })
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ excluir: [], levar: [] }>()

const campo = computed(() => campoPorPath(regra.value.field))
const acoes = computed(() => [[
  { label: props.t.filtro.levarParaAvancado, icon: 'i-lucide-list-filter', onSelect: () => { aberto.value = false; emit('levar') } },
], [
  { label: props.t.filtro.excluirFiltro, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => { aberto.value = false; emit('excluir') } },
]])
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', sideOffset: 6 }">
    <UButton
      color="neutral"
      :variant="vazia(regra) ? 'ghost' : 'soft'"
      size="xs"
      trailing-icon="i-lucide-chevron-down"
      class="max-w-72 rounded-full"
      :class="vazia(regra) ? 'border border-dashed border-accented' : 'border border-transparent'"
    >
      <UIcon :name="ICONE_DO_TIPO[campo?.tipo ?? 'texto']" class="size-3.5 shrink-0 text-muted" />
      <span class="truncate">
        <span class="font-medium text-highlighted">{{ campo?.label }}</span><span v-if="valorCurto" class="text-toned">: {{ valorCurto }}</span>
      </span>
    </UButton>

    <template #content>
      <div class="w-64">
        <div class="flex items-center gap-1 border-b border-default py-1 pl-3 pr-1">
          <span class="shrink-0 text-xs font-medium text-muted">{{ campo?.label }}</span>
          <USelect
            :model-value="regra.op"
            :items="operadoresDe(t, regra.field)"
            size="xs"
            variant="ghost"
            class="min-w-0"
            :aria-label="t.filtro.operador"
            @update:model-value="(v: string) => (regra = comOperador(regra, v))"
          />
          <UDropdownMenu :items="acoes" :content="{ align: 'end' }">
            <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" class="ml-auto" :aria-label="t.filtro.maisAcoes" />
          </UDropdownMenu>
        </div>
        <div v-if="!semValor(regra.op)" class="p-2">
          <ValorDaRegra v-model="regra" :t="t" modo="lista" />
        </div>
        <div v-if="ehLista(regra.op)" class="border-t border-default px-1 py-1">
          <UButton
            :label="t.filtro.limparSelecao"
            color="neutral"
            variant="ghost"
            size="xs"
            :disabled="vazia(regra)"
            @click="regra = { ...regra, value: [] }"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
