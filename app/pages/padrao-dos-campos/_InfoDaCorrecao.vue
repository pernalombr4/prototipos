<script setup lang="ts">
/**
 * O "i" DO VALOR MONETÁRIO, copiado do ENSPACE.
 *
 * Medido em tela no develop em 24/09/2026, na tela nova de itens:
 *
 * - o gatilho é um `i` pequeno, encostado à direita do valor, dentro da
 *   própria célula;
 * - ele abre **no passar do mouse**, não no clique;
 * - o conteúdo é informativo E interativo: três linhas de conta, com o total
 *   em negrito, mais um "Mostrar Legenda" que EXPANDE dentro do mesmo quadro.
 *   Por isso o popover é de hover mas o conteúdo recebe clique: o ponteiro
 *   entra nele sem que ele feche;
 * - a legenda tem dois grupos, Vigência do Período e Status da Correção, com
 *   os textos que estão no `textos.ts`, copiados palavra por palavra do
 *   produto.
 *
 * A LISTA DE PERÍODOS é a única parte que não pude ler: no develop não havia
 * item com correção aplicada (todos os valores estavam com correção zero), e
 * não dá para forjar um sem mexer em dado de configuração. A forma aqui vem do
 * vocabulário da própria legenda, que só existe para explicar esses dois
 * indicadores, e está marcada como proposta no `mocks.ts`.
 */
import type { Textos } from './textos'

interface Periodo {
  inicio: string
  fim: string | null
  indice: string
  vigencia: 'ativo' | 'inativo' | 'naoVinculado'
  status: 'bemSucedida' | 'erroFatal' | 'pendente' | 'falhaTemporaria'
  valor: number
}

const props = defineProps<{
  valor: { currency?: string, value?: number, originalValue?: number, periodos?: Periodo[] }
  t: Textos
  idioma: string
}>()

const legendaAberta = ref(false)

const moeda = computed(() => props.valor?.currency ?? 'BRL')
const atual = computed(() => props.valor?.value ?? 0)
const inicial = computed(() => props.valor?.originalValue ?? atual.value)
const acumulado = computed(() => atual.value - inicial.value)
const periodos = computed(() => props.valor?.periodos ?? [])

function emMoeda(n: number): string {
  return new Intl.NumberFormat(props.idioma, {
    style: 'currency',
    currency: moeda.value,
  }).format(n)
}

/** A cor do selo de vigência e a do selo de status, na ordem da legenda. */
const corDaVigencia: Record<Periodo['vigencia'], string> = {
  ativo: 'success',
  inativo: 'neutral',
  naoVinculado: 'warning',
}

const corDoStatus: Record<Periodo['status'], string> = {
  bemSucedida: 'success',
  erroFatal: 'error',
  pendente: 'info',
  falhaTemporaria: 'warning',
}

/**
 * Mês e ano de uma data em ISO.
 *
 * O meio-dia no fim não é enfeite: `new Date('2026-01-01')` é meia-noite em
 * UTC, e num fuso a oeste isso volta para 31/12/2025. Era o que fazia o
 * período começar em 12/2025 na tela.
 */
function mesEAno(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(props.idioma, {
    month: '2-digit',
    year: 'numeric',
  })
}

function periodoEmTexto(p: Periodo): string {
  if (!p.fim) return `${props.t.correcao.desde} ${mesEAno(p.inicio)}`
  return `${mesEAno(p.inicio)} ${props.t.correcao.ate} ${mesEAno(p.fim)}`
}
</script>

<template>
  <UPopover mode="hover" :open-delay="150" :content="{ align: 'start', side: 'bottom' }">
    <!--
      O gatilho é um `span`, e não um `UButton`, porque a célula inteira já é
      um `<button>` e botão dentro de botão é marcação inválida: o navegador
      engole o clique do de dentro. O `UPopover` usa `as-child`, então o que
      estiver aqui vira o gatilho de verdade.
    -->
    <span
      role="button"
      tabindex="0"
      class="flex size-4 shrink-0 cursor-help items-center justify-center rounded-sm bg-elevated text-dimmed transition-colors hover:bg-accented hover:text-toned"
      :aria-label="t.correcao.detalhes"
      @click.stop
    >
      <UIcon name="i-lucide-info" class="size-3" />
    </span>

    <template #content>
      <div class="w-80 p-3 text-sm">
        <dl class="space-y-1">
          <div class="flex items-baseline justify-between gap-3">
            <dt class="text-muted">{{ t.correcao.valorInicial }}</dt>
            <dd class="tabular-nums text-highlighted">{{ emMoeda(inicial) }}</dd>
          </div>
          <div class="flex items-baseline justify-between gap-3">
            <dt class="text-muted">{{ t.correcao.acumuladas }}</dt>
            <dd class="tabular-nums" :class="acumulado > 0 ? 'text-success' : 'text-highlighted'">
              {{ emMoeda(acumulado) }}
            </dd>
          </div>
          <div class="flex items-baseline justify-between gap-3 border-t border-default pt-1">
            <dt class="font-semibold text-highlighted">{{ t.correcao.valorAtual }}</dt>
            <dd class="font-semibold tabular-nums text-highlighted">{{ emMoeda(atual) }}</dd>
          </div>
        </dl>

        <!--
          Os períodos, quando existem. Cada um com os dois indicadores que a
          legenda explica: em que vigência ele está e como a correção dele
          terminou.
        -->
        <div v-if="periodos.length" class="mt-3 space-y-1.5 border-t border-default pt-2">
          <p class="text-xs font-medium uppercase tracking-wider text-dimmed">
            {{ t.correcao.periodos }}
          </p>
          <!-- Um bloco por período: os dois selos em cima, a conta embaixo. -->
          <div v-for="(p, i) in periodos" :key="i" class="space-y-0.5">
            <span class="flex items-center gap-1.5">
              <UBadge :color="corDaVigencia[p.vigencia] as never" variant="subtle" size="sm">
                {{ t.correcao.legenda.vigencia.entradas[p.vigencia].rotulo }}
              </UBadge>
              <UBadge :color="corDoStatus[p.status] as never" variant="soft" size="sm">
                {{ t.correcao.legenda.status.entradas[p.status].rotulo }}
              </UBadge>
              <span class="ml-auto shrink-0 text-xs text-muted">{{ p.indice }}</span>
            </span>
            <p class="flex items-baseline justify-between gap-2 text-xs text-dimmed">
              <span class="min-w-0 truncate">{{ periodoEmTexto(p) }}</span>
              <span class="shrink-0 tabular-nums">{{ emMoeda(p.valor) }}</span>
            </p>
          </div>
        </div>

        <!--
          A legenda EXPANDE aqui dentro, como no develop, em vez de abrir outra
          camada. É o pedaço interativo do quadro.
        -->
        <UCollapsible v-model:open="legendaAberta" class="mt-2 border-t border-default pt-2">
          <UButton
            :label="t.correcao.mostrarLegenda"
            color="neutral"
            variant="link"
            size="xs"
            class="p-0"
            :trailing-icon="legendaAberta ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          />
          <template #content>
            <div class="mt-2 space-y-2.5">
              <div v-for="grupo in (['vigencia', 'status'] as const)" :key="grupo">
                <p class="mb-1 text-xs font-semibold text-highlighted">
                  {{ t.correcao.legenda[grupo].titulo }}
                </p>
                <div
                  v-for="(entrada, chave) in t.correcao.legenda[grupo].entradas"
                  :key="chave"
                  class="mb-1 last:mb-0"
                >
                  <span class="text-xs font-medium text-toned">{{ entrada.rotulo }}</span>
                  <span class="block text-xs leading-snug text-muted">{{ entrada.texto }}</span>
                </div>
              </div>
            </div>
          </template>
        </UCollapsible>
      </div>
    </template>
  </UPopover>
</template>
