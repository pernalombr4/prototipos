<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): o chip do filtro de campo, o mesmo desenho do protótipo
 * `visualizacoes-da-tela-de-itens` (`_ChipDeFiltro.vue`, rodada 5).
 *
 * O chip mostra o campo e o que está escolhido ("Status: Assinado, Encerrado"). Abre um
 * painel curto: a condição no topo, as opções em caixas (várias valem como "ou") ou o
 * número, "Limpar seleção" e o "⋯" com Excluir filtro. Sem nada escolhido, o chip não
 * filtra e fica tracejado.
 *
 * No dashboard com mais de 1 categoria, o chip leva o nome da categoria antes do campo
 * ("Contratos · Status"): o filtro vale só nos painéis dela.
 */
import type { FiltroDeCampo, Operador } from './agregacao'
import { campoDe, filtroVazio, iconeDoTipo, opcoesDoCampo } from './agregacao'
import { comOperador, ehLista, operadoresDoCampo, semValor } from './filtros'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  valorCurto: string
  /** Nome da categoria, quando o dashboard tem mais de 1. */
  prefixo?: string
  /** O filtro salvo no painel aparece na lista sem poder mudar: só o construtor muda. */
  somenteLeitura?: boolean
}>()
const filtro = defineModel<FiltroDeCampo>({ required: true })
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ excluir: [] }>()

const campo = computed(() => campoDe(filtro.value.categoria, filtro.value.campo))
const opcoes = computed(() => opcoesDoCampo(filtro.value.categoria, filtro.value.campo, props.t.rotulos))
const operadores = computed(() => operadoresDoCampo(filtro.value.categoria, filtro.value.campo)
  .map(op => ({ label: props.t.filtro.operadores[op], value: op })))

const busca = ref('')
const visiveis = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return q ? opcoes.value.filter(o => o.label.toLowerCase().includes(q)) : opcoes.value
})
watch(aberto, (v) => { if (!v) busca.value = '' })

function alternar(v: string, ligado: boolean) {
  const lista = filtro.value.valores.filter(x => x !== v)
  filtro.value = { ...filtro.value, valores: ligado ? [...lista, v] : lista }
}

const acoes = computed(() => [[
  { label: props.t.filtro.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => { aberto.value = false; emit('excluir') } },
]])
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', sideOffset: 6 }" :disabled="somenteLeitura">
    <UButton
      color="neutral"
      :variant="filtroVazio(filtro) ? 'ghost' : 'soft'"
      size="xs"
      :trailing-icon="somenteLeitura ? undefined : 'i-lucide-chevron-down'"
      class="max-w-80 rounded-full"
      :class="filtroVazio(filtro) ? 'border border-dashed border-accented' : 'border border-transparent'"
    >
      <UIcon :name="campo ? iconeDoTipo(campo) : 'i-lucide-filter'" class="size-3.5 shrink-0 text-muted" />
      <span class="truncate">
        <span v-if="prefixo" class="text-muted">{{ prefixo }} · </span>
        <span class="font-medium text-highlighted">{{ campo?.name }}</span><span v-if="valorCurto" class="text-toned">: {{ valorCurto }}</span>
      </span>
    </UButton>

    <template #content>
      <div class="w-64">
        <div class="flex items-center gap-1 border-b border-default py-1 pl-3 pr-1">
          <span class="shrink-0 text-xs font-medium text-muted">{{ campo?.name }}</span>
          <USelect
            :model-value="filtro.operador"
            :items="operadores"
            size="xs"
            variant="ghost"
            class="min-w-0"
            :aria-label="t.filtro.condicao"
            @update:model-value="(v: Operador) => (filtro = comOperador(filtro, v))"
          />
          <UDropdownMenu :items="acoes" :content="{ align: 'end' }">
            <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" class="ml-auto" :aria-label="t.filtro.maisAcoes" />
          </UDropdownMenu>
        </div>

        <div v-if="!semValor(filtro.operador)" class="p-2">
          <div v-if="ehLista(filtro.operador)" class="space-y-1">
            <UInput v-if="opcoes.length > 6" v-model="busca" :placeholder="t.filtro.buscarOpcao" icon="i-lucide-search" size="xs" class="w-full" />
            <div class="max-h-60 space-y-0.5 overflow-y-auto">
              <UCheckbox
                v-for="o in visiveis"
                :key="o.value"
                :model-value="filtro.valores.includes(o.value)"
                :label="o.label"
                size="sm"
                class="rounded-md px-1.5 py-1 hover:bg-elevated"
                @update:model-value="(v: boolean | 'indeterminate') => alternar(o.value, v === true)"
              />
              <p v-if="!visiveis.length" class="px-1.5 py-1 text-sm text-muted">{{ t.filtro.semOpcao }}</p>
            </div>
          </div>
          <UInput
            v-else
            :model-value="filtro.valores[0] ?? ''"
            type="number"
            size="sm"
            :placeholder="t.filtro.numero"
            class="w-full"
            :aria-label="t.filtro.numero"
            @update:model-value="(v: string | number) => (filtro = { ...filtro, valores: v === '' ? [] : [String(v)] })"
          />
        </div>

        <div v-if="ehLista(filtro.operador)" class="border-t border-default px-1 py-1">
          <UButton
            :label="t.filtro.limparSelecao"
            color="neutral"
            variant="ghost"
            size="xs"
            :disabled="filtroVazio(filtro)"
            @click="filtro = { ...filtro, valores: [] }"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
