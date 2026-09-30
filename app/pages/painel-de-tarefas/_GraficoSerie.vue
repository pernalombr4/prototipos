<script setup lang="ts">
/**
 * Criadas e concluídas por semana, mês ou ano.
 *
 * Barras agrupadas do Unovis, o mesmo motor do gráfico do template de
 * dashboard do Nuxt UI (`HomeChart`) e do admin do ENSPACE. As cores saem dos
 * tokens, então o gráfico troca de tema junto com a tela. O gráfico ocupa a
 * altura que o painel tiver: redimensionar o painel redimensiona o gráfico.
 *
 * A pergunta que ele responde é a do "Created vs Resolved" do Jira: a fila
 * cresce ou encolhe? Por isso o saldo aparece no ponteiro de cada barra.
 */
import { VisAxis, VisCrosshair, VisGroupedBar, VisTooltip, VisXYContainer } from '@unovis/vue'
import type { Balde, Granularidade } from './metricas'
import type { Textos } from './textos'
import { ano, dataCurta, mesCurto, numero } from './formatar'

const props = defineProps<{
  t: Textos
  baldes: Balde[]
}>()

const granularidade = defineModel<Granularidade>('granularidade', { required: true })

const COR_CRIADAS = 'var(--ui-color-neutral-400)'
const COR_CONCLUIDAS = 'var(--ui-primary)'

const x = (_: Balde, i: number) => i
const y = [(d: Balde) => d.criadas, (d: Balde) => d.concluidas]
const cores = [COR_CRIADAS, COR_CONCLUIDAS]

const totalCriadas = computed(() => props.baldes.reduce((s, b) => s + b.criadas, 0))
const totalConcluidas = computed(() => props.baldes.reduce((s, b) => s + b.concluidas, 0))

function rotulo(b: Balde | undefined) {
  if (!b) return ''
  if (granularidade.value === 'ano') return ano(b.inicio, props.t)
  if (granularidade.value === 'mes') return mesCurto(b.inicio, props.t)
  return dataCurta(b.inicio, props.t)
}

/** A largura manda no número de marcas do eixo X: parede de datas não se lê. */
const area = ref<HTMLElement | null>(null)
const largura = ref(600)
let observador: ResizeObserver | null = null
onMounted(() => {
  if (!area.value) return
  observador = new ResizeObserver(([e]) => { largura.value = e!.contentRect.width })
  observador.observe(area.value)
})
onBeforeUnmount(() => observador?.disconnect())

const marcasX = computed(() => {
  const n = props.baldes.length
  const cabem = Math.max(2, Math.floor(largura.value / 72))
  if (n <= cabem) return props.baldes.map((_, i) => i)
  const passo = Math.ceil(n / cabem)
  return props.baldes.map((_, i) => i).filter(i => i % passo === 0)
})

function sinal(n: number) {
  return n > 0 ? `+${numero(n, props.t)}` : numero(n, props.t)
}

function legenda(d: Balde) {
  const titulo = granularidade.value === 'semana' ? props.t.serie.semanaDe(rotulo(d)) : rotulo(d)
  const saldo = d.criadas - d.concluidas
  return `
    <div class="px-1 py-0.5 space-y-0.5">
      <p class="text-[11px] text-muted">${titulo}</p>
      <p class="text-sm text-highlighted"><span style="color:${COR_CRIADAS}">●</span> ${props.t.serie.criadas}: <b>${numero(d.criadas, props.t)}</b></p>
      <p class="text-sm text-highlighted"><span style="color:${COR_CONCLUIDAS}">●</span> ${props.t.serie.concluidas}: <b>${numero(d.concluidas, props.t)}</b></p>
      <p class="text-[11px] ${saldo > 0 ? 'text-warning-700 dark:text-warning-300' : 'text-muted'}">${props.t.serie.saldo(sinal(saldo))}</p>
      ${d.parcial ? `<p class="text-[11px] text-muted">${props.t.serie.parcial}</p>` : ''}
    </div>
  `
}

const opcoes = computed(() => [
  { value: 'semana' as const, label: props.t.serie.semana },
  { value: 'mes' as const, label: props.t.serie.mes },
  { value: 'ano' as const, label: props.t.serie.ano },
])
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col px-4 pb-3">
    <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
      <div class="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm">
        <span class="flex items-center gap-2">
          <span class="size-2.5 rounded-sm" :style="{ backgroundColor: COR_CRIADAS }" />
          <span class="text-toned">{{ t.serie.criadas }}</span>
          <span class="text-lg font-semibold tabular-nums text-highlighted">{{ numero(totalCriadas, t) }}</span>
        </span>
        <span class="flex items-center gap-2">
          <span class="size-2.5 rounded-sm" :style="{ backgroundColor: COR_CONCLUIDAS }" />
          <span class="text-toned">{{ t.serie.concluidas }}</span>
          <span class="text-lg font-semibold tabular-nums text-highlighted">{{ numero(totalConcluidas, t) }}</span>
        </span>
        <span class="text-xs" :class="totalCriadas - totalConcluidas > 0 ? 'text-warning-700 dark:text-warning-300' : 'text-muted'">
          {{ t.serie.saldo(sinal(totalCriadas - totalConcluidas)) }}
        </span>
      </div>
      <USelect
        v-model="granularidade"
        :items="opcoes"
        variant="ghost"
        size="sm"
        :aria-label="t.serie.agrupar"
        class="-mr-2 data-[state=open]:bg-elevated"
        :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      />
    </div>

    <div
      ref="area"
      class="mt-2 min-h-24 flex-1"
      role="img"
      :aria-label="t.serie.rotuloAcessivel(numero(totalCriadas, t), numero(totalConcluidas, t))"
    >
      <VisXYContainer
        :key="`${granularidade}-${baldes.length}`"
        :data="baldes"
        :margin="{ top: 8, right: 8, bottom: 0, left: 0 }"
        :y-domain-min-constraint="[0, 0]"
        class="h-full w-full"
      >
        <VisGroupedBar
          :x="x"
          :y="y"
          :color="cores"
          :rounded-corners="3"
          :group-padding="0.25"
          :bar-padding="0.08"
          :group-max-width="48"
        />
        <VisAxis
          type="y"
          :num-ticks="4"
          :tick-format="(v: number) => numero(v, t)"
          :grid-line="true"
          :domain-line="false"
          :tick-line="false"
        />
        <VisAxis
          type="x"
          :tick-values="marcasX"
          :tick-format="(i: number) => rotulo(baldes[i])"
          :grid-line="false"
          :domain-line="false"
          :tick-line="false"
        />
        <VisCrosshair color="var(--ui-border-accented)" :template="legenda" />
        <VisTooltip />
      </VisXYContainer>
    </div>
    <p v-if="baldes.some(b => b.parcial)" class="mt-1.5 flex gap-2 text-xs text-muted">
      <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
      <span class="line-clamp-2">{{ t.serie.notaParcial }}</span>
    </p>
  </div>
</template>

<style scoped>
/*
 * CSS próprio: variáveis do Unovis. O Nuxt UI não tem gráfico, e o Unovis não
 * lê token do tema sozinho. Mesmo bloco do `HomeChart` do template e do
 * `_GraficoDeConsumo.vue`, pelo mesmo motivo (registrado no DECISOES.md).
 * Consulta: skill `nuxt-ui` e MCP (`search-components "chart"`): nenhum
 * componente de gráfico no Nuxt UI.
 */
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-border-accented);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);
  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  --vis-axis-tick-label-color: var(--ui-text-muted);
  --vis-axis-tick-label-font-size: 11px;
  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
