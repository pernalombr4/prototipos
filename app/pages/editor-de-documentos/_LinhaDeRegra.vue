<script setup lang="ts">
/**
 * PROPOSTA: 1 linha de condição que se lê como frase:
 * "e  [Valor ▾] [é maior que ▾]
 *     [R$ 100.000,00]"
 * Operador e valor ficam desabilitados até a escolha do campo; o operador muda
 * pelo tipo; "está vazio" e "está preenchido" não pedem valor.
 */
import type { SelectItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { type CampoDeRegra, type Op, type Regra, opsDoTipo, SEM_VALOR, valorInicial } from './regras'

const props = defineProps<{
  regra: Regra
  campos: CampoDeRegra[]
  opcoesDe: (ref: string) => SelectItem[] | null
  rotulo: string
  removivel: boolean
  t: Textos
  idioma: string
}>()
const emit = defineEmits<{ remover: [] }>()

const ICONE: Record<string, string> = {
  texto: 'i-lucide-type',
  opcao: 'i-lucide-list',
  numero: 'i-lucide-hash',
  moeda: 'i-lucide-circle-dollar-sign',
  pessoa: 'i-lucide-user',
  data: 'i-lucide-calendar',
}

const campo = computed(() => props.campos.find(c => c.ref === props.regra.campo))
const itensDeCampo = computed<SelectItem[]>(() => props.campos.map(c => ({ label: c.rotulo, value: c.ref, icon: ICONE[c.tipo] })))
const itensDeOp = computed<SelectItem[]>(() => opsDoTipo(campo.value?.tipo).map(o => ({ label: props.t.modelo.ops[o], value: o })))
const opcoes = computed(() => (props.regra.campo ? props.opcoesDe(props.regra.campo) : null))
const pedeValor = computed(() => !!props.regra.op && !SEM_VALOR.includes(props.regra.op))
const multiplo = computed(() => props.regra.op === 'umDe' || props.regra.op === 'nenhumDe')

function trocarCampo(ref: string) {
  const r = props.regra
  r.campo = ref
  const tipo = props.campos.find(c => c.ref === ref)?.tipo
  r.op = opsDoTipo(tipo)[0] ?? null
  r.valor = valorInicial(tipo, r.op)
}

function trocarOp(op: Op) {
  const r = props.regra
  const antes = r.op
  r.op = op
  const eraLista = antes === 'umDe' || antes === 'nenhumDe'
  const ehLista = op === 'umDe' || op === 'nenhumDe'
  if (SEM_VALOR.includes(op) || eraLista !== ehLista || (antes && SEM_VALOR.includes(antes))) r.valor = valorInicial(campo.value?.tipo, op)
}

function definir(v: unknown) {
  props.regra.valor = v as Regra['valor']
}
</script>

<template>
  <div class="flex items-start gap-1.5">
    <span class="w-6 shrink-0 pt-1.5 text-right text-xs font-medium text-muted">{{ rotulo }}</span>
    <div class="grid min-w-0 flex-1 grid-cols-2 gap-1.5">
      <USelect
        :model-value="regra.campo ?? undefined"
        :items="itensDeCampo"
        :placeholder="t.modelo.escolhaCampo"
        :icon="campo ? ICONE[campo.tipo] : undefined"
        size="sm"
        class="w-full"
        :aria-label="t.modelo.campo"
        @update:model-value="trocarCampo($event as string)"
      />
      <USelect
        :model-value="regra.op ?? undefined"
        :items="itensDeOp"
        :disabled="!regra.campo"
        size="sm"
        class="w-full"
        :aria-label="t.modelo.operador"
        @update:model-value="trocarOp($event as Op)"
      />
      <template v-if="pedeValor">
        <USelect
          v-if="opcoes"
          :model-value="(multiplo ? regra.valor ?? [] : regra.valor ?? undefined) as never"
          :items="opcoes"
          :multiple="multiplo"
          :placeholder="t.modelo.escolhaValor"
          size="sm"
          class="col-span-2 w-full"
          :aria-label="t.modelo.valor"
          @update:model-value="definir"
        />
        <UInputNumber
          v-else-if="campo?.tipo === 'moeda' || campo?.tipo === 'numero'"
          :model-value="(regra.valor as number | null) ?? undefined"
          :format-options="campo?.tipo === 'moeda' ? { style: 'currency', currency: 'BRL' } : undefined"
          :locale="idioma"
          size="sm"
          class="col-span-2 w-full"
          :aria-label="t.modelo.valor"
          @update:model-value="definir"
        />
        <UInput
          v-else-if="campo?.tipo === 'data'"
          type="date"
          :model-value="(regra.valor as string) ?? ''"
          size="sm"
          class="col-span-2 w-full"
          :aria-label="t.modelo.valor"
          @update:model-value="definir"
        />
        <UInput
          v-else
          :model-value="(regra.valor as string) ?? ''"
          size="sm"
          class="col-span-2 w-full"
          :aria-label="t.modelo.valor"
          @update:model-value="definir"
        />
      </template>
    </div>
    <UButton
      icon="i-lucide-x"
      color="neutral"
      variant="ghost"
      size="xs"
      class="mt-0.5"
      :disabled="!removivel"
      :aria-label="t.modelo.removerRegra"
      @click="emit('remover')"
    />
  </div>
</template>
