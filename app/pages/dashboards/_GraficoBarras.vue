<script setup lang="ts">
/**
 * Barras verticais, simples ou empilhadas, com clique até os itens.
 *
 * É a "prova curta" do relatório (seção da biblioteca): o `EnChart` do SDK dá a
 * moldura (largura, estados, locale) e, dentro dele, as peças do Unovis que o SDK
 * já usa. O `EnChartBar` e o `EnChartGroupedBar` do SDK 0.21 não empilham nem
 * emitem clique no dado; empilhar e clicar é o que este componente acrescenta, e é
 * o que o SDK precisaria ganhar (registrado no COMPONENTES-CUSTOM.md).
 */
import { StackedBar } from '@unovis/ts'
import { VisAxis, VisStackedBar, VisTooltip, VisXYLabels } from '@unovis/vue'
import type { Grupo, Resultado } from './agregacao'
import { corDaSerie } from './formatar'

const props = defineProps<{
  resultado: Resultado
  altura: number
  mostrarValores: boolean
  formatar: (v: number) => string
  rotuloTotal: string
  rotuloAcessivel: string
  locale: string
}>()

const emit = defineEmits<{ detalhar: [grupo: Grupo, parte?: string] }>()

type Dado = { i: number, grupo: Grupo, valores: number[], total: number }

const series = computed(() => props.resultado.quebras.length
  ? props.resultado.quebras.map((q, k) => ({ chave: q.chave, rotulo: q.rotulo, cor: corDaSerie(q.chave, k) }))
  : [{ chave: '', rotulo: '', cor: 'var(--ui-color-primary-500)' }])

const dados = computed<Dado[]>(() => props.resultado.grupos.map((g, i) => {
  const valores = props.resultado.quebras.length
    ? props.resultado.quebras.map(q => g.partes[q.chave] ?? 0)
    : [g.valor]
  return { i, grupo: g, valores, total: props.resultado.quebras.length ? valores.reduce((a, b) => a + b, 0) : g.valor }
}))

const x = (d: Dado) => d.i
const y = computed(() => series.value.map((_, k) => (d: Dado) => d.valores[k] ?? 0))
const cor = (d: Dado, k: number) => props.resultado.quebras.length ? series.value[k]?.cor : corDaSerie(d.grupo.chave, 0)

/** Muitas barras: o rótulo do eixo encurta e pula, para não encavalar. */
const passo = computed(() => Math.max(1, Math.ceil(dados.value.length / 12)))
const curto = (s: string) => s.length > 14 ? `${s.slice(0, 13)}…` : s

type Pedaco = { datum: Dado, stackIndex: number }

const eventos = {
  [StackedBar.selectors.bar]: {
    click: (p: Pedaco) => {
      if (!p.datum?.total) return
      const parte = props.resultado.quebras.length ? series.value[p.stackIndex]?.chave : undefined
      emit('detalhar', p.datum.grupo, parte)
    },
  },
}

const escapar = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

function dica(p: Pedaco) {
  const d = p.datum
  if (!d) return ''
  const linha = (c: string, rotulo: string, v: number, forte: boolean) =>
    `<p class="text-sm ${forte ? 'text-highlighted' : 'text-toned'}"><span style="color:${c}">●</span> ${escapar(rotulo)}: <b>${escapar(props.formatar(v))}</b></p>`
  let corpo = ''
  if (props.resultado.quebras.length) {
    corpo = series.value
      .map((s, k) => ({ s, v: d.valores[k] ?? 0, k }))
      .filter(l => l.v > 0)
      .map(l => linha(l.s.cor, l.s.rotulo, l.v, l.k === p.stackIndex))
      .join('')
    corpo += `<p class="text-[11px] text-muted">${escapar(props.rotuloTotal)}: <b>${escapar(props.formatar(d.total))}</b></p>`
  }
  else {
    corpo = `<p class="text-sm text-highlighted"><b>${escapar(props.formatar(d.total))}</b></p>`
  }
  return `<div class="px-1 py-0.5 space-y-0.5"><p class="text-[11px] text-muted">${escapar(d.grupo.rotulo)}</p>${corpo}</div>`
}
/**
 * Os gatilhos da dica ficam fixos. Escrito no template, o objeto nasce de novo a
 * cada render, o Unovis se reconfigura, o gráfico redesenha e a página trava em
 * laço (medido em 12/11/2026 no SDK 0.21 com @unovis 1.8.1).
 */
const gatilhos = { [StackedBar.selectors.bar]: dica }
</script>

<template>
  <div class="flex flex-col">
    <EnChart
      :data="dados"
      :height="altura"
      :aria-label="rotuloAcessivel"
      :locale="(locale as any)"
      :padding="{ top: mostrarValores ? 22 : 8, right: 4, bottom: 4, left: 4 }"
    >
      <VisStackedBar
        :x="x"
        :y="y"
        :color="cor"
        :rounded-corners="3"
        :bar-padding="0.25"
        :bar-max-width="56"
        cursor="pointer"
        :events="eventos"
      />
      <VisXYLabels
        v-if="mostrarValores"
        :x="x"
        :y="(d: Dado) => d.total"
        :label="(d: Dado) => d.total ? formatar(d.total) : ''"
        :background-color="() => 'transparent'"
        :color="() => 'var(--ui-text-highlighted)'"
        :label-font-size="11"
        :clustering="false"
        :y-offset="-10"
      />
      <VisAxis
        type="x"
        :tick-values="dados.filter(d => d.i % passo === 0).map(d => d.i)"
        :tick-format="(i: number) => curto(dados[i]?.grupo.rotulo ?? '')"
        :grid-line="false"
        :domain-line="false"
        :tick-line="false"
      />
      <VisAxis type="y" :tick-format="(v: number) => formatar(v)" :domain-line="false" :tick-line="false" :num-ticks="4" />
      <VisTooltip :triggers="gatilhos" />
    </EnChart>

    <ul v-if="resultado.quebras.length" class="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs text-muted">
      <li v-for="s in series" :key="s.chave" class="flex items-center gap-1.5">
        <span class="size-2 rounded-sm" :style="{ backgroundColor: s.cor }" />
        {{ s.rotulo }}
      </li>
    </ul>

    <!-- O caminho de teclado e de leitor de tela para cada barra. -->
    <ul class="sr-only">
      <li v-for="d in dados" :key="d.grupo.chave">
        <button type="button" class="focus:not-sr-only" :disabled="!d.total" @click="emit('detalhar', d.grupo)">
          {{ d.grupo.rotulo }}: {{ formatar(d.total) }}
        </button>
      </li>
    </ul>
  </div>
</template>
