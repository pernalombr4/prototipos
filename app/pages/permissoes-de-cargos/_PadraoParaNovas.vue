<script setup lang="ts">
/**
 * Rodada 6: o padrão vale só para as categorias criadas a partir de agora.
 *
 * Antes ele era a primeira linha da tabela e as categorias "herdavam" dele.
 * Na tabela, isso parecia um seletor geral ao lado das caixas de coluna, e a
 * redatora apontou a confusão. Agora cada categoria guarda o próprio valor, e
 * o padrão mora fora da tabela, num bloco que diz para que serve
 * (o "default for new objects" do Salesforce e do HubSpot).
 */
import type { TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import CaixaDePermissao from './_CaixaDePermissao.vue'
import { type Acao, type AcaoDeAlcance, type RegraDeItens, acoes, acoesDeAlcance } from './mocks'
import { type EstadoDoCargo, comDependencia, definirRegra, verExigidoPor } from './estado'

const props = defineProps<{
  t: Textos
  estado: EstadoDoCargo
  salvo: EstadoDoCargo
  somenteLeitura: boolean
}>()

type Linha = { tipo: 'acoes' } | { tipo: 'criador' } | { tipo: 'responsavel' }

const linhas: Linha[] = [{ tipo: 'acoes' }, { tipo: 'criador' }, { tipo: 'responsavel' }]

const alterado = computed(() =>
  JSON.stringify(props.estado.padrao) !== JSON.stringify(props.salvo.padrao)
  || JSON.stringify(props.estado.padraoItens) !== JSON.stringify(props.salvo.padraoItens))

function definirAcao(acao: Acao, valor: boolean) {
  props.estado.padrao = comDependencia({ ...props.estado.padrao, [acao]: valor })
}

function travadaPor(acao: Acao) {
  const quem = acao === 'ver' ? verExigidoPor(props.estado.padrao) : null
  return quem ? props.t.exigidoPor(props.t.acoes[quem]) : null
}

const regraMarcada = (a: AcaoDeAlcance, tipo: keyof RegraDeItens) => !!props.estado.padraoItens[a]?.[tipo]

const colunas = computed<TableColumn<Linha>[]>(() => [
  { id: 'nome', header: '', meta: { class: { th: 'w-auto', td: 'w-auto' } } },
  ...acoes.map(a => ({ id: a, header: props.t.acoes[a], meta: { class: { th: 'text-center w-20 px-0', td: 'text-center w-20 px-0' } } })),
  // Mesma largura da coluna Restrições, para as 4 ações ficarem alinhadas com a tabela de baixo.
  { id: 'resto', header: '', meta: { class: { th: 'w-96', td: 'w-96' } } },
])
</script>

<template>
  <section class="rounded-lg border border-default bg-elevated/40 p-4 animate-[entrada_.3s_ease-out_both]">
    <header class="mb-3 flex items-start gap-3">
      <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <UIcon name="i-lucide-layers" class="size-4" />
      </span>
      <span class="min-w-0">
        <span class="flex items-center gap-2">
          <h4 class="text-sm font-semibold text-highlighted">{{ t.padraoLinha }}</h4>
          <span v-if="alterado" class="size-1.5 shrink-0 rounded-full bg-warning" :title="t.alterada" />
        </span>
        <p class="text-sm text-muted">{{ t.padraoLinhaDesc }}</p>
      </span>
    </header>

    <UTable
      :data="linhas"
      :columns="colunas"
      class="rounded-lg border border-default bg-default"
      :ui="{ base: 'w-full min-w-[66rem] table-fixed', th: 'py-2 text-xs align-top bg-elevated text-highlighted', td: 'py-2' }"
    >
      <template v-for="a in acoes" :key="a" #[`${a}-header`]>
        <UTooltip :text="t.dicas[a]">
          <span>{{ t.acoes[a] }}</span>
        </UTooltip>
      </template>

      <template #nome-cell="{ row }">
        <span v-if="row.original.tipo === 'acoes'" class="flex min-w-0 items-center gap-2">
          <UIcon name="i-lucide-layout-grid" class="size-4 shrink-0 text-muted" />
          <span class="truncate text-sm font-medium text-default">{{ t.padraoAcoes }}</span>
        </span>
        <span v-else class="flex min-w-0 items-center gap-2 pl-6">
          <UIcon :name="row.original.tipo === 'criador' ? 'i-lucide-user-round' : 'i-lucide-user-check'" class="size-4 shrink-0 text-info" />
          <span class="min-w-0">
            <span class="block truncate text-sm text-default">{{ row.original.tipo === 'criador' ? t.subAlcance : t.subResponsavel }}</span>
            <span class="block truncate text-xs text-muted">{{ row.original.tipo === 'criador' ? t.subAlcanceDesc : t.qualquerCampoPessoa }}</span>
          </span>
        </span>
      </template>

      <template v-for="a in acoes" :key="a" #[`${a}-cell`]="{ row }">
        <CaixaDePermissao
          v-if="row.original.tipo === 'acoes'"
          :valor="estado.padrao[a]"
          :rotulo="`${t.acoes[a]}: ${t.padraoLinha}`"
          :travada-por="travadaPor(a)"
          :desabilitada="somenteLeitura"
          @alterar="v => definirAcao(a, v)"
        />
        <template v-else>
          <!-- Criar não tem regra de itens: quem cria é sempre o criador. -->
          <CaixaDePermissao
            v-if="(acoesDeAlcance as Acao[]).includes(a)"
            :valor="regraMarcada(a as AcaoDeAlcance, row.original.tipo)"
            :rotulo="`${row.original.tipo === 'criador' ? t.subAlcance : t.subResponsavel}: ${t.acoes[a]} (${t.padraoLinha})`"
            :dica="estado.padrao[a] ? '' : t.acaoBloqueada(t.acoes[a])"
            :desabilitada="somenteLeitura || !estado.padrao[a]"
            @alterar="v => definirRegra(estado, null, a as AcaoDeAlcance, row.original.tipo as keyof RegraDeItens, v)"
          />
          <span v-else class="text-dimmed" aria-hidden="true">·</span>
        </template>
      </template>
    </UTable>
  </section>
</template>
