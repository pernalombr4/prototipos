<script setup lang="ts">
/**
 * "Quais itens": as regras de criador e de responsável de uma categoria ou do
 * padrão, por ação. Usado no popover da coluna "Quais itens" e na aba do Ajustar.
 *
 * Caixas, como o resto da tela: linhas = regras, colunas = Ver, Atualizar e
 * Excluir. A ideia vem do "Only if created" do ClickUp e do "atribuído a mim"
 * de Pipefy e monday.
 */
import type { Textos } from './textos'
import CaixaDePermissao from './_CaixaDePermissao.vue'
import { type AcaoDeAlcance, type CategoriaMock, type RegraDeItens, acoesDeAlcance, camposPessoa } from './mocks'
import { type EstadoDoCargo, acoesDaCategoria, definirRegra, itensDaCategoria } from './estado'

const props = defineProps<{
  t: Textos
  estado: EstadoDoCargo
  /** Nulo = o padrão das categorias. */
  categoria: CategoriaMock | null
  somenteLeitura: boolean
}>()

const ec = computed(() => props.categoria ? props.estado.categorias[props.categoria.id] : null)
const regras = computed(() => props.categoria ? itensDaCategoria(props.estado, props.categoria.id) : props.estado.padraoItens)
const segue = computed(() => !!props.categoria && !ec.value?.itens)
const pessoas = computed(() => props.categoria ? camposPessoa(props.categoria) : [])

function ligada(a: AcaoDeAlcance) {
  return props.categoria ? acoesDaCategoria(props.estado, props.categoria.id)[a] : true
}

function marcada(a: AcaoDeAlcance, tipo: keyof RegraDeItens) {
  return !!regras.value[a]?.[tipo]
}

function alterar(a: AcaoDeAlcance, tipo: keyof RegraDeItens, v: boolean) {
  definirRegra(props.estado, props.categoria, a, tipo, v)
}

const camposEscolhidos = computed({
  get: () => ec.value?.itens?.campos ?? [],
  set: (v: string[]) => {
    if (ec.value?.itens)
      ec.value.itens = { ...ec.value.itens, campos: v }
  },
})

const linhas = computed(() => [
  { tipo: 'criador' as const, rotulo: props.t.subAlcance, desc: props.t.subAlcanceDesc, icone: 'i-lucide-user-round' },
  { tipo: 'responsavel' as const, rotulo: props.t.subResponsavel, desc: '', icone: 'i-lucide-user-check' },
])
</script>

<template>
  <div class="space-y-3">
    <p class="text-sm text-muted">{{ t.editorDesc }}</p>

    <div class="overflow-hidden rounded-lg border border-default">
      <div class="grid grid-cols-[1fr_repeat(3,4.5rem)] items-center gap-y-1 border-b border-default bg-elevated/50 px-3 py-2 text-xs font-semibold text-highlighted">
        <span />
        <span v-for="a in acoesDeAlcance" :key="a" class="text-center">{{ t.acoes[a] }}</span>
      </div>
      <div
        v-for="l in linhas"
        :key="l.tipo"
        class="grid grid-cols-[1fr_repeat(3,4.5rem)] items-center border-b border-default px-3 py-2 last:border-b-0"
      >
        <span class="flex min-w-0 items-start gap-2">
          <UIcon :name="l.icone" class="mt-0.5 size-4 shrink-0 text-info" />
          <span class="min-w-0">
            <span class="block text-sm text-default">{{ l.rotulo }}</span>
            <span v-if="l.desc" class="block text-xs text-muted">{{ l.desc }}</span>
          </span>
        </span>
        <span v-for="a in acoesDeAlcance" :key="a" class="flex justify-center">
          <CaixaDePermissao
            :valor="marcada(a, l.tipo)"
            :rotulo="`${l.rotulo}: ${t.acoes[a]}`"
            :dica="!ligada(a) ? t.acaoDesligada(t.acoes[a]) : ''"
            :desabilitada="somenteLeitura || !ligada(a) || (l.tipo === 'responsavel' && !!categoria && !pessoas.length)"
            @alterar="v => alterar(a, l.tipo, v)"
          />
        </span>
      </div>
    </div>

    <!-- Quais campos Pessoa contam como responsável -->
    <template v-if="categoria">
      <p v-if="!pessoas.length" class="text-xs text-muted">{{ t.semCampoPessoa }}</p>
      <UFormField v-else :label="t.campoPessoa" size="sm">
        <USelectMenu
          v-model="camposEscolhidos"
          :items="pessoas.map(f => ({ label: f.label ?? f.name, value: f.name }))"
          value-key="value"
          multiple
          :placeholder="t.campoPessoaPlaceholder"
          :disabled="somenteLeitura || segue"
          class="w-full"
        />
      </UFormField>
    </template>
    <p v-else class="text-xs text-muted">{{ t.qualquerCampoPessoa }}</p>

    <!-- Herança: a categoria segue o padrão até alguém mudar aqui. -->
    <div v-if="categoria" class="flex items-center justify-between gap-3 border-t border-default pt-3">
      <span class="text-xs text-muted">{{ segue ? t.seguindoPadraoItens : '' }}</span>
      <UButton
        v-if="!segue && !somenteLeitura"
        :label="t.voltarPadraoItens"
        icon="i-lucide-undo-2"
        size="xs"
        variant="ghost"
        color="warning"
        @click="ec!.itens = null"
      />
    </div>
  </div>
</template>
