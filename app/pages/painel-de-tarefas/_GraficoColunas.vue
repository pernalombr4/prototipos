<script setup lang="ts">
/**
 * Gráfico de colunas (empilhadas ou não), no Unovis: o motor de gráfico do
 * template de dashboard do Nuxt UI e do admin. Serve a 2 mensagens:
 * - categorias em ordem (as faixas de prazo, da mais vencida à mais folgada):
 *   uma coluna por faixa, a cor diz o grupo;
 * - poucas categorias com composição (status dividido pela situação do prazo):
 *   colunas empilhadas.
 *
 * O total vai em cima de cada coluna (rótulo direto) e o eixo Y some: com
 * rótulo direto, o eixo só ocupa lugar. Clicar numa coluna abre a lista.
 *
 * Acessibilidade: o Unovis não recebe foco. Por isso cada coluna tem também um
 * botão para leitor de tela e teclado (`sr-only`, aparece no foco).
 */
import { StackedBar } from '@unovis/ts'
import { VisAxis, VisStackedBar, VisTooltip, VisXYContainer, VisXYLabels } from '@unovis/vue'
import type { Textos } from './textos'
import { numero } from './formatar'

export interface Pilha {
  chave: string
  rotulo: string
  /** Cor CSS: var(--ui-error), var(--ui-text-dimmed)... */
  cor: string
}

export interface Coluna {
  chave: string
  rotulo: string
  /** Rótulo curto para o eixo, quando o nome inteiro não cabe embaixo da coluna. */
  curto?: string
  /** Valor de cada pilha, na ordem de `pilhas`. */
  valores: number[]
}

const props = defineProps<{
  t: Textos
  pilhas: Pilha[]
  colunas: Coluna[]
  rotuloAcessivel: string
  /** Mostra a legenda das pilhas embaixo (desligue quando a cor só repete o eixo). */
  comLegenda?: boolean
  /** O nome do valor na dica quando a coluna tem uma parte só ("Abertas agora"). */
  rotuloDoValor?: string
}>()

const emit = defineEmits<{ abrir: [chave: string] }>()

type Dado = Coluna & { total: number, i: number }
const dados = computed<Dado[]>(() => props.colunas.map((c, i) => ({ ...c, i, total: c.valores.reduce((a, b) => a + b, 0) })))

const x = (d: Dado) => d.i
const y = computed(() => props.pilhas.map((_, k) => (d: Dado) => d.valores[k] ?? 0))
const cor = (_: Dado, k: number) => props.pilhas[k]?.cor
const maior = computed(() => Math.max(1, ...dados.value.map(d => d.total)))

/** O Unovis entrega cada pedaço da pilha como `{ datum, stackIndex, ... }`. */
type Pedaco = { datum: Dado }

const eventos = {
  [StackedBar.selectors.bar]: {
    click: (p: Pedaco) => { if (p.datum?.total) emit('abrir', p.datum.chave) },
  },
}

/**
 * A dica no desenho da do gráfico de linhas: o nome da coluna em cima, cada
 * parte com a cor e o valor, e o total quando a coluna se divide. Coluna de
 * uma parte só não repete o nome: diz o que o número conta.
 */
function dica(p: Pedaco) {
  const d = p.datum
  if (!d) return ''
  const linha = (cor: string, rotulo: string, v: number) =>
    `<p class="text-sm text-highlighted"><span style="color:${cor}">●</span> ${rotulo}: <b>${numero(v, props.t)}</b></p>`
  const partes = props.pilhas.map((x, k) => ({ x, v: d.valores[k] ?? 0 })).filter(l => l.v > 0)
  let corpo: string
  if (partes.length <= 1) {
    const unica = partes[0] ?? { x: props.pilhas[0]!, v: 0 }
    corpo = linha(unica.x.cor, props.rotuloDoValor ?? unica.x.rotulo, unica.v)
  }
  else {
    corpo = partes.map(l => linha(l.x.cor, l.x.rotulo, l.v)).join('')
      + `<p class="text-[11px] text-muted">${props.t.total}: <b>${numero(d.total, props.t)}</b></p>`
  }
  return `<div class="px-1 py-0.5 space-y-0.5"><p class="text-[11px] text-muted">${d.rotulo}</p>${corpo}</div>`
}

const legendaUsada = computed(() => props.pilhas.filter((_, k) => dados.value.some(d => (d.valores[k] ?? 0) > 0)))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col px-4 pb-3">
    <div class="min-h-24 flex-1" role="img" :aria-label="rotuloAcessivel">
      <VisXYContainer
        :data="dados"
        :margin="{ top: 20, right: 4, bottom: 0, left: 4 }"
        :y-domain="[0, maior * 1.12]"
        class="h-full w-full"
      >
        <VisStackedBar
          :x="x"
          :y="y"
          :color="cor"
          :rounded-corners="3"
          :bar-padding="0.28"
          :bar-max-width="64"
          cursor="pointer"
          :events="eventos"
        />
        <!-- O total logo acima da coluna: o rótulo fica em unidade de dado, um pouco acima do topo. -->
        <VisXYLabels
          :x="x"
          :y="(d: Dado) => d.total + maior * 0.06"
          :label="(d: Dado) => numero(d.total, t)"
          :background-color="() => 'transparent'"
          :color="() => 'var(--ui-text-highlighted)'"
          :clustering="false"
        />
        <VisAxis
          type="x"
          :tick-values="dados.map(d => d.i)"
          :tick-format="(i: number) => dados[i]?.curto ?? dados[i]?.rotulo ?? ''"
          :grid-line="false"
          :domain-line="false"
          :tick-line="false"
        />
        <VisTooltip :triggers="{ [StackedBar.selectors.bar]: dica }" />
      </VisXYContainer>
    </div>

    <ul v-if="comLegenda && legendaUsada.length" class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      <li v-for="p in legendaUsada" :key="p.chave" class="flex items-center gap-1.5">
        <span class="size-2 rounded-sm" :style="{ backgroundColor: p.cor }" />
        {{ p.rotulo }}
      </li>
    </ul>

    <!-- O caminho de teclado e de leitor de tela para cada coluna. -->
    <ul class="sr-only">
      <li v-for="d in dados" :key="d.chave">
        <button type="button" class="focus:not-sr-only" :disabled="!d.total" @click="emit('abrir', d.chave)">
          {{ d.rotulo }}: {{ numero(d.total, t) }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/*
 * CSS próprio: variáveis do Unovis apontando para os tokens do tema, como no
 * `_GraficoSerie.vue` e no `HomeChart` do template. O Nuxt UI não tem gráfico
 * (MCP `search-components "chart"`: 0 resultados).
 */
.unovis-xy-container {
  --vis-axis-tick-label-color: var(--ui-text-muted);
  --vis-axis-tick-label-font-size: 11px;
  --vis-axis-grid-color: var(--ui-border);
  --vis-xy-label-font-size: 12px;
  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
