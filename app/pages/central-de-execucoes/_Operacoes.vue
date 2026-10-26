<script setup lang="ts">
/**
 * PROPOSTA: a aba Operações, a lista das operações do workspace com criar, editar e excluir. Não
 * existe hoje.
 *
 * Cada linha diz a regra em palavras, quantos fluxos ela alcança e a saúde da operação no período.
 * O aviso do topo lista os fluxos que nenhuma regra alcança: é a conferência de que a regra cobre
 * o workspace inteiro.
 */
import { categorias } from './mocks'
import type { Dados, Periodo } from './consultas'
import { saudeDasOperacoes } from './consultas'
import type { Operacao } from './operacoes'
import { fluxosDaOperacao, fluxosSemOperacao, operacoes } from './operacoes'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, dados: Dados, periodo: Periodo, carregando: boolean }>()
const emit = defineEmits<{ nova: [], editar: [string], verMapa: [string] }>()

const toast = useToast()

const saude = computed(() => new Map(saudeDasOperacoes(props.dados, props.periodo).map(s => [s.op.id, s])))
const semOperacao = computed(() => fluxosSemOperacao(props.dados.fluxos))
const linhas = computed(() => operacoes.value.map(op => ({
  op,
  fluxos: fluxosDaOperacao(op.id, props.dados.fluxos).length,
  regra: [
    props.t.gestao.regra(op.regra.categorias.map(c => categorias[c].nome), op.regra.peloGatilho, op.regra.pelaGravacao),
    op.regra.incluir.length ? props.t.gestao.incluidos(op.regra.incluir.length) : '',
    op.regra.excluir.length ? props.t.gestao.excluidos(op.regra.excluir.length) : '',
  ].filter(Boolean).join('. '),
  saude: saude.value.get(op.id),
})))

const corDoSelo = { ok: 'success', atencao: 'warning', falha: 'error' } as const

/* ---------- excluir ---------- */
const aExcluir = ref<Operacao | null>(null)
const confirmando = computed({ get: () => !!aExcluir.value, set: (v) => { if (!v) aExcluir.value = null } })
const excluindo = ref(false)
async function excluir() {
  const op = aExcluir.value
  if (!op) return
  excluindo.value = true
  await new Promise(r => setTimeout(r, 500))
  operacoes.value = operacoes.value.filter(o => o.id !== op.id)
  excluindo.value = false
  aExcluir.value = null
  toast.add({ title: props.t.gestao.exclusao.feita, description: op.nome, icon: 'i-lucide-trash-2', color: 'neutral' })
}
const maisAcoes = (op: Operacao) => [[{ label: props.t.gestao.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => { aExcluir.value = op } }]]
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0 max-w-3xl">
        <h2 class="text-lg font-semibold text-highlighted">{{ t.gestao.titulo }}</h2>
        <p class="text-sm text-muted">{{ t.gestao.descricao }}</p>
      </div>
      <UButton :label="t.gestao.nova" icon="i-lucide-plus" @click="emit('nova')" />
    </div>

    <UAlert
      v-if="!carregando && semOperacao.length && operacoes.length"
      :title="t.gestao.semOperacao.titulo(semOperacao.length)"
      :description="`${t.gestao.semOperacao.descricao} ${semOperacao.map(f => f.name).join(', ')}.`"
      icon="i-lucide-circle-dashed"
      color="warning"
      variant="subtle"
      :actions="[{ label: t.gestao.nova, icon: 'i-lucide-plus', color: 'neutral', variant: 'outline', onClick: () => emit('nova') }]"
    />

    <div v-if="carregando" class="flex flex-col gap-2">
      <USkeleton v-for="n in 4" :key="n" class="h-24 w-full" />
    </div>

    <div v-else-if="!operacoes.length" class="flex flex-1 items-center justify-center rounded-lg border border-dashed border-accented p-8">
      <UEmpty
        icon="i-lucide-boxes"
        :title="t.gestao.vazioTitulo"
        :description="t.gestao.vazioDesc"
        :actions="[{ label: t.gestao.nova, icon: 'i-lucide-plus', onClick: () => emit('nova') }]"
        variant="naked"
      />
    </div>

    <ul v-else class="flex flex-col divide-y divide-default overflow-hidden rounded-lg border border-default bg-default">
      <li
        v-for="(l, i) in linhas"
        :key="l.op.id"
        class="flex flex-wrap items-start gap-x-6 gap-y-3 px-4 py-4 transition-colors hover:bg-elevated/50 animate-[entrada_.3s_ease-out_both]"
        :style="{ animationDelay: `${i * 40}ms` }"
      >
        <div class="min-w-0 flex-1 basis-80">
          <div class="flex flex-wrap items-center gap-2">
            <p class="font-medium text-highlighted">{{ l.op.nome }}</p>
            <UBadge v-if="l.saude" :label="t.operacoes.selo[l.saude.selo]" :color="corDoSelo[l.saude.selo]" variant="subtle" size="sm" />
          </div>
          <p v-if="l.op.descricao" class="mt-0.5 text-sm text-muted">{{ l.op.descricao }}</p>
          <p class="mt-2 flex items-start gap-1.5 text-sm text-toned">
            <UIcon name="i-lucide-filter" class="mt-0.5 size-4 shrink-0 text-muted" />
            <span>{{ l.regra }}</span>
          </p>
        </div>
        <div class="flex w-60 shrink-0 flex-col gap-1 text-sm">
          <span class="flex items-center gap-1.5 text-toned"><UIcon name="i-lucide-workflow" class="size-4 text-muted" />{{ t.operacoes.fluxos(l.fluxos) }}</span>
          <span class="flex items-center gap-1.5 text-toned"><UIcon name="i-lucide-user-round" class="size-4 text-muted" />{{ t.operacoes.dono(l.op.dono) }}</span>
          <span v-if="l.saude" class="flex items-center gap-1.5 text-toned"><UIcon name="i-lucide-circle-play" class="size-4 text-muted" />{{ t.operacoes.execucoes(l.saude.execucoes) }}</span>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <UButton :label="t.gestao.verMapa" icon="i-lucide-map" size="sm" color="neutral" variant="outline" :disabled="!l.fluxos" @click="emit('verMapa', l.op.id)" />
          <UButton :label="t.gestao.editar" icon="i-lucide-pencil" size="sm" color="neutral" variant="outline" @click="emit('editar', l.op.id)" />
          <UDropdownMenu :items="maisAcoes(l.op)" :content="{ align: 'end' }">
            <UButton icon="i-lucide-ellipsis" size="sm" color="neutral" variant="ghost" :aria-label="t.gestao.maisAcoes" />
          </UDropdownMenu>
        </div>
      </li>
    </ul>

    <UModal v-model:open="confirmando" :title="aExcluir ? t.gestao.exclusao.titulo(aExcluir.nome) : ''" :description="aExcluir ? t.gestao.exclusao.descricao(fluxosDaOperacao(aExcluir.id, dados.fluxos).length) : ''">
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.gestao.exclusao.cancelar" color="neutral" variant="ghost" @click="aExcluir = null" />
          <UButton :label="t.gestao.exclusao.confirmar" icon="i-lucide-trash-2" color="error" :loading="excluindo" @click="excluir" />
        </div>
      </template>
    </UModal>
  </div>
</template>
