<script setup lang="ts">
/**
 * PROPOSTA (demanda 1): o cartão que para o agente antes da ferramenta que
 * grava, envia, cobra, sai do ENSPACE ou muda acessos.
 *
 * Base: o UChatTool do Nuxt UI, variante card, cujas ações a doc indica para
 * "fluxos de aprovação de ferramenta". Mostra o que vai acontecer com os
 * valores que o agente montou; a pessoa confirma, edita ou cancela.
 *
 * "Confirmar e não perguntar de novo nesta conversa" só aparece para o que
 * grava no workspace. O que envia, cobra ou muda acessos pergunta sempre
 * (PESQUISA: Dust some o "não perguntar de novo" no risco alto).
 */
import type { Textos } from './textos'
import type { Parte } from './conversa'
import { ferramentaPorSlug, iconeDoEfeito, corDoEfeito } from './catalogo'
import { pessoaPorId, EU } from './mocks'
import { espera } from './estado'

type Cartao = Extract<Parte, { tipo: 'confirmacao' }>

const props = defineProps<{ t: Textos, parte: Cartao }>()
const emit = defineEmits<{ resolvido: [estado: 'confirmado' | 'cancelado', sempre: boolean] }>()

const c = computed(() => props.t.confirmacao)
const fer = computed(() => ferramentaPorSlug(props.parte.ferramenta))
const efeito = computed(() => fer.value.efeito)
const titulo = computed(() => c.value.acoes[props.parte.ferramenta] ?? props.t.ferramentas.nomes[props.parte.ferramenta] ?? props.parte.ferramenta)

const editando = ref(false)
const rascunho = ref<Record<string, string>>({})
const verTodos = ref(false)

function editar() {
  rascunho.value = Object.fromEntries(props.parte.campos.map(x => [x.chave, x.valor]))
  editando.value = true
}

async function confirmar(sempre = false) {
  const p = props.parte
  if (editando.value) {
    p.campos.forEach((x) => { x.valor = rascunho.value[x.chave] ?? x.valor })
    editando.value = false
  }
  p.estado = 'executando'
  await espera(1100)
  p.estado = 'confirmado'
  p.sempre = sempre
  p.hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  emit('resolvido', 'confirmado', sempre)
}

function cancelar() {
  editando.value = false
  props.parte.estado = 'cancelado'
  emit('resolvido', 'cancelado', false)
}

const aberto = ref(true)
watch(() => [props.parte.estado, editando.value] as const, ([e, ed]) => {
  aberto.value = ['pendente', 'erro', 'executando'].includes(e) || ed
}, { immediate: true })

const icone = computed(() => ({
  pendente: iconeDoEfeito[efeito.value],
  executando: iconeDoEfeito[efeito.value],
  confirmado: 'i-lucide-circle-check',
  cancelado: 'i-lucide-circle-slash',
  erro: 'i-lucide-circle-alert',
}[props.parte.estado]))

const corDaBorda = computed(() => ({
  pendente: 'ring-warning/50 bg-warning/5',
  executando: 'ring-default',
  confirmado: 'ring-success/40',
  cancelado: 'ring-default opacity-80',
  erro: 'ring-error/50 bg-error/5',
}[props.parte.estado]))

const corDoIcone = computed(() => ({
  pendente: 'text-warning',
  executando: 'text-muted',
  confirmado: 'text-success',
  cancelado: 'text-dimmed',
  erro: 'text-error',
}[props.parte.estado]))

const sufixo = computed(() => {
  const e = props.parte.estado
  if (e === 'confirmado') return props.parte.simulado ? props.t.testar.simulado : c.value.confirmadoPor(pessoaPorId(EU).nome, props.parte.hora ?? '')
  return c.value.estados[e]
})

const lote = computed(() => props.parte.lote ?? [])
const loteVisivel = computed(() => verTodos.value ? lote.value : lote.value.slice(0, 3))
const rotulo = (k: string) => (c.value.rotulos as Record<string, string>)[k] ?? k
const custo = computed(() => efeito.value === 'cobra' ? c.value.custo('12 créditos') : null)
</script>

<template>
  <UChatTool
    v-model:open="aberto"
    variant="card"
    :text="titulo"
    :suffix="sufixo"
    :icon="icone"
    :loading="parte.estado === 'executando'"
    :streaming="parte.estado === 'executando'"
    chevron="trailing"
    :ui="{
      root: ['my-2 rounded-lg ring transition-colors duration-300', corDaBorda].join(' '),
      leadingIcon: corDoIcone,
      label: 'font-medium text-highlighted',
      suffix: 'font-normal text-muted',
    }"
    role="group"
    :aria-label="`${titulo}: ${sufixo}`"
  >
    <div class="space-y-3 text-sm">
      <div class="flex flex-wrap items-center gap-1.5">
        <UBadge :label="t.ferramentas.efeitos[efeito]" :icon="iconeDoEfeito[efeito]" :color="corDoEfeito[efeito]" variant="soft" size="sm" />
        <UBadge v-if="parte.simulado" :label="t.testar.simulado" icon="i-lucide-flask-conical" color="info" variant="soft" size="sm" />
        <span v-if="custo" class="text-xs text-muted">{{ custo }}</span>
      </div>

      <p v-if="parte.estado === 'erro'" class="rounded-md bg-error/10 px-3 py-2 text-error" role="alert">{{ c.erroTexto }}</p>

      <dl class="space-y-2">
        <div v-for="campo in parte.campos" :key="campo.chave" class="grid grid-cols-[6.5rem_1fr] items-start gap-2">
          <dt class="pt-0.5 text-xs font-medium uppercase tracking-wide text-muted">{{ rotulo(campo.chave) }}</dt>
          <dd class="min-w-0">
            <template v-if="editando">
              <UTextarea v-if="campo.longo" v-model="rascunho[campo.chave]" :rows="4" autoresize class="w-full" size="sm" :aria-label="rotulo(campo.chave)" />
              <UInput v-else v-model="rascunho[campo.chave]" class="w-full" size="sm" :aria-label="rotulo(campo.chave)" />
            </template>
            <p v-else class="whitespace-pre-line break-words text-default" :class="campo.longo && 'rounded-md bg-elevated/70 px-2.5 py-2 text-xs'">{{ campo.valor }}</p>
          </dd>
        </div>
      </dl>

      <div v-if="lote.length">
        <p class="mb-1.5 text-xs font-medium text-muted">{{ c.lote(lote.length, parte.campos[0]?.valor ?? '') }}</p>
        <TransitionGroup tag="ul" class="space-y-1" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
          <li v-for="(l, i) in loteVisivel" :key="l" class="flex items-center gap-2 rounded-md bg-elevated/60 px-2.5 py-1.5 text-xs">
            <span class="w-5 text-right tabular-nums text-dimmed">{{ i + 1 }}</span>
            <span class="truncate">{{ l }}</span>
          </li>
        </TransitionGroup>
        <UButton
          v-if="lote.length > 3"
          :label="verTodos ? c.verMenos : c.verTodos(lote.length)"
          :icon="verTodos ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          color="neutral"
          variant="link"
          size="xs"
          class="mt-1 px-0"
          @click="verTodos = !verTodos"
        />
      </div>

      <p v-if="parte.estado === 'confirmado' && !parte.simulado" class="flex items-center gap-1.5 text-success">
        <UIcon name="i-lucide-check" class="size-4" />{{ c.resultado[parte.ferramenta] ?? c.estados.confirmado }}
      </p>
      <p v-if="parte.estado === 'cancelado'" class="text-muted">{{ c.canceladoTexto }}</p>
    </div>

    <template v-if="['pendente', 'erro'].includes(parte.estado)" #actions>
      <div class="flex w-full flex-wrap items-center justify-end gap-2 border-t border-default px-3 pb-3 pt-3">
        <UButton :label="c.cancelar" color="neutral" variant="ghost" size="sm" @click="cancelar" />
        <UButton v-if="!editando" :label="c.editar" icon="i-lucide-pencil" color="neutral" variant="outline" size="sm" @click="editar" />
        <UFieldGroup v-if="!editando && parte.estado === 'pendente' && efeito === 'grava'" size="sm">
          <UButton :label="c.confirmar" icon="i-lucide-check" @click="confirmar(false)" />
          <UDropdownMenu :items="[{ label: c.sempreNestaConversa, icon: 'i-lucide-check-check', onSelect: () => confirmar(true) }]" :content="{ align: 'end' }">
            <UButton icon="i-lucide-chevron-down" :aria-label="c.sempreNestaConversa" />
          </UDropdownMenu>
        </UFieldGroup>
        <UButton
          v-else
          :label="editando ? c.salvarEdicao : (parte.estado === 'erro' ? c.tentarDeNovo : c.confirmar)"
          :icon="parte.estado === 'erro' && !editando ? 'i-lucide-rotate-ccw' : 'i-lucide-check'"
          size="sm"
          @click="confirmar(false)"
        />
      </div>
    </template>
  </UChatTool>
</template>
