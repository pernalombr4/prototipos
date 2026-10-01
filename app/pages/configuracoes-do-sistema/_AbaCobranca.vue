<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { h, resolveComponent } from 'vue'
import GraficoDeConsumo from './_GraficoDeConsumo.vue'
import Secao from './_Secao.vue'
import {
  carteira,
  consumoDiario,
  consumoPorRecurso,
  definicaoDoCredito,
  identidade,
  solicitacoes as solicitacoesBase,
  tiposDeConsumo,
  transacoes,
  type Transacao,
  type Solicitacao,
} from './mocks'

const toast = useToast()

/* ------------------------------------------------------------------ *
 * A aba que a demanda chamou de "melhor, mas pobre".
 *
 * O que ela tem hoje: saldo, extrato e pedidos. O que falta é o que
 * transforma número em decisão — ritmo, projeção e destino do gasto.
 * A referência é o painel de uso do Stripe (PESQUISA.md §7): saldo sem
 * ritmo não responde a única pergunta que a pessoa tem, que é "isso
 * dura até quando".
 * ------------------------------------------------------------------ */

const HOJE = new Date(2026, 8, 16)

const consumo30 = computed(() => consumoDiario.reduce((s, d) => s + d.credits, 0))

const diasComConsumo = computed(() => consumoDiario.filter(d => d.credits > 0).length)

const mediaPorDiaAtivo = computed(() =>
  Math.round(consumo30.value / Math.max(diasComConsumo.value, 1)),
)

const diasDeFolego = computed(() =>
  Math.floor((carteira.balance ?? 0) / Math.max(mediaPorDiaAtivo.value, 1)),
)

const dataDoFim = computed(() => {
  const d = new Date(HOJE)
  // Só dias com consumo contam — o fim de semana não gasta crédito.
  d.setDate(d.getDate() + Math.round(diasDeFolego.value * 1.4))
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
})

const saldoBaixo = computed(() => diasDeFolego.value <= 20)

/* ----------------------------- por recurso ------------------------- */

const maiorRecurso = computed(() => Math.max(...consumoPorRecurso.map(r => r.credits), 1))

/**
 * O número que a barra não dá: quanto custa cada uso.
 * O agente caro não é o que mais aparece, é o que cobra mais por interação.
 */
function mediaPorUso(r: typeof consumoPorRecurso[number]) {
  const m = r.credits / Math.max(r.usos, 1)
  return m.toLocaleString('pt-BR', { maximumFractionDigits: m < 10 ? 1 : 0 })
}

/* ---------------------------- solicitações ------------------------- */

const solicitacoes = ref<Solicitacao[]>([...solicitacoesBase])
const pedindo = ref(false)
const enviando = ref(false)
const pedido = reactive({ valor: 2000, motivo: '' })

const rotuloDoStatus: Record<string, { texto: string, cor: 'warning' | 'success' | 'error' | 'neutral' }> = {
  pending: { texto: 'Aguardando análise', cor: 'warning' },
  approved: { texto: 'Aprovada', cor: 'success' },
  rejected: { texto: 'Recusada', cor: 'error' },
  cancelled: { texto: 'Cancelada', cor: 'neutral' },
}

async function enviarPedido() {
  enviando.value = true
  await new Promise(r => setTimeout(r, 800))
  solicitacoes.value.unshift({
    id: Math.floor(Math.random() * 900) + 2400,
    amount: pedido.valor,
    status: 'pending',
    reason: pedido.motivo || 'Sem motivo informado',
    data: new Date().toISOString(),
    solicitante: carteira.dono,
  })
  enviando.value = false
  pedindo.value = false
  pedido.motivo = ''
  toast.add({
    title: 'Pedido enviado',
    description: 'Você recebe um e-mail quando o financeiro responder.',
    icon: 'i-lucide-send',
    color: 'neutral',
  })
}

/* ------------------------------- extrato --------------------------- */

/**
 * As cinco barras viraram uma.
 *
 * A pergunta da seção é proporção ("onde mexer para gastar menos"), e
 * proporção se lê numa barra só. Cinco barras paralelas obrigam a comparar
 * comprimentos que começam no mesmo lugar e terminam em lugares diferentes.
 * A legenda do próprio componente vira a lista, então nada se perde: o selo
 * da família e o detalhe continuam em cada linha.
 */
// O quinto segmento não usa `neutral`: no claro ele sai quase preto e parece
// um buraco na barra. Um tom mais claro da marca mantém a barra na família.
const CORES_DO_CONSUMO = [
  'primary',
  'secondary',
  'success',
  'warning',
  'var(--ui-color-primary-300)',
] as const

const segmentosDoConsumo = computed(() =>
  consumoPorRecurso.map((recurso, i) => ({
    label: recurso.recurso,
    value: recurso.credits,
    color: CORES_DO_CONSUMO[i % CORES_DO_CONSUMO.length],
    recurso,
  })),
)

const filtroExtrato = ref<'tudo' | 'debit' | 'credit'>('tudo')

const extrato = computed(() =>
  transacoes.filter(t => filtroExtrato.value === 'tudo' || t.type === filtroExtrato.value),
)

/**
 * O extrato virou tabela.
 *
 * Eram 12 linhas desenhadas à mão, com 874 px de altura e nenhuma ordenação.
 * Tabela é o que esse dado é: cinco colunas, uma linha por lançamento, e a
 * ordenação por data e por valor sai de graça.
 */
const colunasDoExtrato: TableColumn<Transacao>[] = [
  {
    accessorKey: 'data',
    header: ({ column }) => cabecalhoOrdenavel(column, 'Data'),
  },
  { accessorKey: 'description', header: 'Lançamento' },
  { id: 'origem', header: 'Origem' },
  { id: 'workspace', header: 'Workspace' },
  {
    accessorKey: 'amount',
    header: ({ column }) => cabecalhoOrdenavel(column, 'Valor', true),
    meta: { class: { th: 'text-right', td: 'text-right' } },
  },
]

function cabecalhoOrdenavel(coluna: any, rotulo: string, aDireita = false) {
  const ordem = coluna.getIsSorted()
  return h(resolveComponent('UButton'), {
    color: 'neutral',
    variant: 'ghost',
    size: 'xs',
    label: rotulo,
    icon: ordem
      ? (ordem === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
      : 'i-lucide-arrow-up-down',
    class: aDireita ? '-me-2.5' : '-ms-2.5',
    onClick: () => coluna.toggleSorting(coluna.getIsSorted() === 'asc'),
  })
}

function dataLonga(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="space-y-5">
    <!-- 1. CARTEIRA --------------------------------------------------- -->
    <Secao
      id="carteira"
      titulo="Sua carteira"
      resumo="O saldo é seu e vale em todos os workspaces de que você participa. Não é do workspace."
      style="animation: entrada .4s ease-out both"
    >
      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <!-- saldo -->
        <div>
          <div class="flex items-baseline gap-2">
            <span class="text-4xl font-semibold tabular-nums text-highlighted">
              {{ (carteira.balance ?? 0).toLocaleString('pt-BR') }}
            </span>
            <UPopover mode="hover">
              <button
                type="button"
                class="border-b border-dashed border-accented text-sm text-muted transition-colors hover:text-highlighted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                en-credits
              </button>
              <template #content>
                <div class="max-w-xs p-3">
                  <p class="text-sm text-highlighted">{{ definicaoDoCredito.frase }}</p>
                  <ul class="mt-2 space-y-1">
                    <li
                      v-for="ex in definicaoDoCredito.exemplos"
                      :key="ex"
                      class="flex gap-1.5 text-xs text-muted"
                    >
                      <span class="text-muted">·</span>{{ ex }}
                    </li>
                  </ul>
                </div>
              </template>
            </UPopover>
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-2">
            <UBadge
              :label="carteira.status === 'active' ? 'Carteira ativa' : 'Carteira inativa'"
              size="sm"
              :color="carteira.status === 'active' ? 'success' : 'neutral'"
              variant="subtle"
            />
            <span class="text-sm text-muted">{{ carteira.dono }}</span>
          </div>

          <dl class="mt-5 grid grid-cols-2 gap-4">
            <div>
              <dt class="text-xs uppercase tracking-wider text-muted">Consumo em 30 dias</dt>
              <dd class="mt-0.5 text-lg font-medium tabular-nums text-highlighted">
                {{ consumo30.toLocaleString('pt-BR') }}
              </dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-wider text-muted">Média por dia de uso</dt>
              <dd class="mt-0.5 text-lg font-medium tabular-nums text-highlighted">
                {{ mediaPorDiaAtivo }}
              </dd>
            </div>
          </dl>

          <UAlert
            class="mt-5"
            :color="saldoBaixo ? 'warning' : 'neutral'"
            variant="subtle"
            :icon="saldoBaixo ? 'i-lucide-battery-low' : 'i-lucide-hourglass'"
            :title="`No ritmo atual, dura até ${dataDoFim}`"
            :description="`São cerca de ${diasDeFolego} dias de uso. Quando o saldo zera, as funções com IA param de responder.`"
          />
        </div>

        <!-- a linha do consumo -->
        <div class="rounded-lg bg-elevated/40 p-4">
          <div class="mb-2 flex items-baseline justify-between">
            <p class="text-sm font-medium text-highlighted">Consumo diário</p>
            <p class="text-xs text-muted">últimos 30 dias</p>
          </div>

          <!--
            Só no cliente: o Unovis mede o container para desenhar, e no
            prerender não existe container para medir. O esqueleto tem a
            altura do gráfico para a seção não pular quando ele entra.
          -->
          <ClientOnly>
            <GraficoDeConsumo />
            <template #fallback>
              <div class="h-44 w-full animate-pulse rounded-md bg-elevated" />
            </template>
          </ClientOnly>

          <p class="mt-3 text-xs text-muted">
            Os vales são fim de semana: sem tarefa rodando, não há consumo.
          </p>
        </div>
      </div>

      <template #rodape>
        <p class="text-xs text-muted">
          Este é o recorte de <strong class="text-muted">{{ identidade.name }}</strong>. Para ver a
          carteira somada de todos os workspaces, abra Cobranças no seu Painel do Usuário.
        </p>
      </template>
    </Secao>

    <!-- 2. NO QUE FOI --------------------------------------------------- -->
    <Secao
      id="consumo"
      titulo="No que os créditos foram"
      resumo="Últimos 30 dias, por recurso. É o que diz onde mexer para gastar menos."
      style="animation: entrada .4s ease-out both; animation-delay: 60ms"
    >
      <!--
        Uma barra, cinco segmentos, e a legenda do componente é a lista. O selo
        da família e o detalhe de cada recurso continuam onde estavam, dentro
        da linha da legenda.
      -->
      <UProgressGroup
        :items="segmentosDoConsumo"
        :max="consumo30"
        size="lg"
      >
        <template #item-label="{ item }">
          <span class="flex min-w-0 items-center gap-2">
            <UIcon :name="tiposDeConsumo[item.recurso.tipo].icone" class="size-4 shrink-0 text-muted" />
            <span class="truncate text-highlighted">{{ item.recurso.recurso }}</span>

            <UPopover mode="hover" :ui="{ content: 'max-w-xs' }">
              <button
                type="button"
                class="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                :aria-label="`O que é ${tiposDeConsumo[item.recurso.tipo].rotulo}`"
              >
                <UBadge
                  :label="tiposDeConsumo[item.recurso.tipo].rotulo"
                  size="sm"
                  color="neutral"
                  variant="subtle"
                  class="cursor-help"
                />
              </button>

              <template #content>
                <div class="space-y-2 p-3">
                  <p class="flex items-center gap-1.5 text-sm font-medium text-highlighted">
                    <UIcon :name="tiposDeConsumo[item.recurso.tipo].icone" class="size-4" />
                    {{ tiposDeConsumo[item.recurso.tipo].rotulo }}
                  </p>
                  <p class="text-sm text-muted">
                    {{ tiposDeConsumo[item.recurso.tipo].oQueE }}
                  </p>

                  <dl class="space-y-2 border-t border-default pt-2 text-xs">
                    <div>
                      <dt class="uppercase tracking-wider text-muted">Onde foi usado</dt>
                      <dd class="text-toned">{{ item.recurso.onde }}</dd>
                    </div>
                    <div>
                      <dt class="uppercase tracking-wider text-muted">Como cobra</dt>
                      <dd class="text-toned">{{ tiposDeConsumo[item.recurso.tipo].comoCobra }}</dd>
                    </div>
                    <div>
                      <dt class="uppercase tracking-wider text-muted">Média no período</dt>
                      <dd class="text-toned">
                        {{ mediaPorUso(item.recurso) }} en-credits por
                        {{ tiposDeConsumo[item.recurso.tipo].unidadeSingular }}
                      </dd>
                    </div>
                  </dl>

                  <UButton
                    :to="tiposDeConsumo[item.recurso.tipo].doc"
                    target="_blank"
                    label="Documentação"
                    icon="i-lucide-book-open"
                    trailing-icon="i-lucide-arrow-up-right"
                    variant="link"
                    size="xs"
                    class="px-0"
                  />
                </div>
              </template>
            </UPopover>
          </span>
        </template>

        <template #item-trailing="{ item }">
          <span class="shrink-0 tabular-nums text-muted">
            {{ item.recurso.credits.toLocaleString('pt-BR') }}
            · {{ item.recurso.usos.toLocaleString('pt-BR') }}
            {{ tiposDeConsumo[item.recurso.tipo].unidade }}
          </span>
        </template>
      </UProgressGroup>
    </Secao>

    <!-- 3. SOLICITAÇÕES ------------------------------------------------- -->
    <Secao
      id="solicitacoes"
      titulo="Pedidos de recarga"
      resumo="Quem aprova é o financeiro do ENSPACE. O pedido some da fila quando é respondido."
      style="animation: entrada .4s ease-out both; animation-delay: 120ms"
    >
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-muted">
          {{ solicitacoes.filter(s => s.status === 'pending').length }} aguardando análise ·
          {{ solicitacoes.length }} nos últimos 30 dias
        </p>
        <UButton
          label="Pedir recarga"
          icon="i-lucide-plus"
          size="sm"
          class="transition-transform hover:-translate-y-0.5"
          @click="pedindo = true"
        />
      </div>

      <ul v-if="solicitacoes.length" class="divide-y divide-default">
        <li
          v-for="s in solicitacoes"
          :key="s.id"
          class="py-2.5 transition-colors hover:bg-elevated"
        >
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span class="text-sm font-medium tabular-nums text-highlighted">
              +{{ s.amount.toLocaleString('pt-BR') }} en-credits
            </span>
            <UBadge
              :label="rotuloDoStatus[s.status]?.texto"
              size="sm"
              :color="rotuloDoStatus[s.status]?.cor"
              variant="subtle"
            />
            <span class="text-sm text-muted">{{ s.reason }}</span>
            <span class="ml-auto text-xs text-muted">
              #{{ s.id }} · {{ s.solicitante }} · {{ dataLonga(s.data) }}
            </span>
          </div>
          <p v-if="s.respostaDoAnalista" class="mt-1 flex items-start gap-1.5 text-xs text-muted">
            <UIcon name="i-lucide-corner-down-right" class="mt-0.5 size-3.5 shrink-0" />
            {{ s.respostaDoAnalista }}
          </p>
        </li>
      </ul>

      <UEmpty
        v-else
        icon="i-lucide-inbox"
        title="Nenhum pedido de recarga"
        description="Quando o saldo estiver acabando, peça aqui. O financeiro responde por e-mail."
        class="py-8"
      />
    </Secao>

    <!-- 4. EXTRATO ------------------------------------------------------ -->
    <Secao
      id="extrato"
      titulo="Extrato"
      resumo="Toda entrada e toda saída, com o recurso que consumiu e o workspace onde aconteceu."
      style="animation: entrada .4s ease-out both; animation-delay: 180ms"
    >
      <UFieldGroup size="sm" class="mb-3">
        <UButton
          v-for="f in ([
            { v: 'tudo', r: 'Tudo' },
            { v: 'debit', r: 'Consumo' },
            { v: 'credit', r: 'Recargas' },
          ] as const)"
          :key="f.v"
          :label="f.r"
          :color="filtroExtrato === f.v ? 'primary' : 'neutral'"
          :variant="filtroExtrato === f.v ? 'soft' : 'outline'"
          :aria-pressed="filtroExtrato === f.v"
          @click="filtroExtrato = f.v"
        />
      </UFieldGroup>

      <UTable
        :data="extrato"
        :columns="colunasDoExtrato"
        :ui="{ td: 'py-2', th: 'py-2' }"
      >
        <template #data-cell="{ row }">
          <span class="whitespace-nowrap text-xs tabular-nums text-muted">
            {{ dataLonga(row.original.data) }}
          </span>
        </template>

        <template #description-cell="{ row }">
          <span class="flex items-center gap-2">
            <UIcon
              :name="row.original.type === 'credit' ? 'i-lucide-arrow-down-left' : 'i-lucide-arrow-up-right'"
              class="size-4 shrink-0"
              :class="row.original.type === 'credit' ? 'text-success-700 dark:text-success-300' : 'text-muted'"
            />
            <span class="text-sm text-highlighted">{{ row.original.description }}</span>
          </span>
        </template>

        <template #origem-cell="{ row }">
          <span class="text-sm text-muted">
            {{ row.original.origem.recurso }}
            <template v-if="row.original.origem.detalhe"> · {{ row.original.origem.detalhe }}</template>
            <span class="text-muted"> · {{ row.original.origem.pessoa }}</span>
          </span>
        </template>

        <template #workspace-cell="{ row }">
          <UBadge
            :label="row.original.origem.workspace"
            size="sm"
            variant="subtle"
            :color="row.original.origem.workspace === identidade.name ? 'neutral' : 'warning'"
            :title="row.original.origem.workspace === identidade.name
              ? 'Aconteceu neste workspace'
              : 'Aconteceu em outro workspace seu. A carteira é a mesma'"
          />
        </template>

        <template #amount-cell="{ row }">
          <span
            class="text-sm font-medium tabular-nums"
            :class="row.original.type === 'credit' ? 'text-success-700 dark:text-success-300' : 'text-highlighted'"
          >
            {{ row.original.type === 'credit' ? '+' : '−' }}{{ row.original.amount.toLocaleString('pt-BR') }}
          </span>
        </template>
      </UTable>

      <template #rodape>
        <p class="text-xs text-muted">
          Mostrando {{ extrato.length }} de {{ transacoes.length }} lançamentos dos últimos 30 dias.
        </p>
      </template>
    </Secao>

    <!-- PEDIDO DE RECARGA ------------------------------------------------ -->
    <UModal v-model:open="pedindo" title="Pedir recarga de en-credits">
      <template #body>
        <div class="space-y-4">
          <UFormField label="Quantos en-credits" help="O pedido é em en-credits, não em reais.">
            <UInputNumber v-model="pedido.valor" :min="100" :step="100" class="w-full sm:max-w-xs" />
          </UFormField>

          <UFormField
            label="Para quê"
            help="Quem analisa lê isto. Pedido sem contexto costuma voltar com pergunta."
          >
            <UTextarea
              v-model="pedido.motivo"
              :rows="3"
              placeholder="Fechamento trimestral: 400 contratos para analisar até 30/09."
              class="w-full"
            />
          </UFormField>

          <div class="rounded-lg bg-elevated/60 px-3 py-2.5 text-sm">
            <p class="text-muted">
              Com <strong class="text-highlighted">{{ pedido.valor.toLocaleString('pt-BR') }}</strong>
              en-credits a mais, no ritmo atual, o saldo passa a durar cerca de
              <strong class="text-highlighted">
                {{ Math.floor(((carteira.balance ?? 0) + pedido.valor) / Math.max(mediaPorDiaAtivo, 1)) }}
                dias de uso</strong>.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton label="Cancelar" color="neutral" variant="ghost" @click="pedindo = false" />
          <UButton label="Enviar pedido" :loading="enviando" @click="enviarPedido" />
        </div>
      </template>
    </UModal>
  </div>
</template>
