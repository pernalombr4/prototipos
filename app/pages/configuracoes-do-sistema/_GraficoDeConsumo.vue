<script setup lang="ts">
import { VisArea, VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from '@unovis/vue'
import { consumoDiario, feriadosImportados } from './mocks'

/**
 * A linha do consumo diário.
 *
 * Era um `<polyline>` desenhado à mão: bonito e mudo. Quem olhava via a
 * silhueta do gasto e não conseguia responder "quanto foi naquele pico" nem
 * "que dia é aquele vale".
 *
 * Agora é o gráfico do template de dashboard do Nuxt UI (Unovis): mesma linha,
 * mas com escala nos dois eixos e um valor por dia no ponteiro. O resto do
 * painel do Unovis fica de fora de propósito: legenda, zoom e seleção de
 * período são peso para uma série de 30 pontos.
 */

interface Dia { dia: string, credits: number }

const dados = consumoDiario as Dia[]

const x = (_: Dia, i: number) => i
const y = (d: Dia) => d.credits

const total = dados.reduce((s, d) => s + d.credits, 0)
const pico = Math.max(...dados.map(d => d.credits), 1)

/**
 * A escala do eixo Y sai do pico arredondado para cima, em quatro marcas.
 * Marca quebrada (0, 52, 105, 157) não ajuda ninguém a ler.
 */
const marcasY = (() => {
  const passo = Math.ceil(pico / 3 / 10) * 10
  return [0, passo, passo * 2, passo * 3]
})()

/** Cinco datas no eixo X: começo, três paradas e hoje. */
const marcasX = [0, 7, 14, 21, dados.length - 1]

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** Meio-dia para a data não escorregar de dia por causa do fuso. */
function comoData(iso: string) {
  return new Date(`${iso}T12:00:00`)
}

function rotuloDoDia(i: number) {
  const d = dados[i]
  if (!d) return ''
  if (i === dados.length - 1) return 'hoje'
  const data = comoData(d.dia)
  return `${data.getDate()} ${MESES[data.getMonth()]}`
}

const feriadoPorData = new Map(feriadosImportados.map(f => [f.data, f.nome]))

/** Por que um dia ficou em zero. Sem isso o vale vira suspeita de bug. */
function motivoDoZero(d: Dia) {
  const diaDaSemana = comoData(d.dia).getDay()
  if (diaDaSemana === 0 || diaDaSemana === 6) return 'Fim de semana, sem tarefa rodando.'
  const feriado = feriadoPorData.get(d.dia)
  if (feriado) return `Feriado: ${feriado}.`
  return 'Nenhuma execução neste dia.'
}

/**
 * O que aparece no ponteiro. Três linhas no máximo: que dia é, quanto foi e
 * o que aquilo representa no período.
 */
function legenda(d: Dia) {
  const data = comoData(d.dia)
  const semana = data.toLocaleDateString('pt-BR', { weekday: 'long' })
  // Só a primeira letra: 'Quinta-Feira, 27 De Agosto' é placa de loja.
  const diaDaSemana = semana.charAt(0).toUpperCase() + semana.slice(1)
  const dataPorExtenso = data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
  const parte = Math.round((d.credits / total) * 100)

  const valor = d.credits === 0
    ? 'Sem consumo'
    : `${d.credits.toLocaleString('pt-BR')} en-credits`

  const rodape = d.credits === 0
    ? motivoDoZero(d)
    : `${parte}% do consumo dos 30 dias`

  return `
    <div class="px-1 py-0.5">
      <p class="text-[11px] text-muted">${diaDaSemana}, ${dataPorExtenso}</p>
      <p class="text-sm font-semibold text-highlighted">${valor}</p>
      <p class="text-[11px] text-muted">${rodape}</p>
    </div>
  `
}
</script>

<template>
  <div
    role="img"
    :aria-label="`Consumo diário dos últimos 30 dias: ${total.toLocaleString('pt-BR')} en-credits no período, pico de ${pico} em um dia.`"
  >
    <VisXYContainer
      :data="dados"
      :margin="{ top: 12, right: 8, bottom: 0, left: 0 }"
      class="h-44 w-full"
    >
      <VisArea :x="x" :y="y" color="var(--ui-primary)" :opacity="0.12" />
      <VisLine :x="x" :y="y" color="var(--ui-primary)" :line-width="1.5" />

      <!-- Eixo Y: a escala que diz se o pico é grande ou pequeno. -->
      <VisAxis
        type="y"
        :tick-values="marcasY"
        :tick-format="(v: number) => v.toLocaleString('pt-BR')"
        :grid-line="true"
        :domain-line="false"
        :tick-line="false"
        label="en-credits"
        :label-margin="6"
        :label-font-size="11"
      />

      <!-- Eixo X: as datas, cinco paradas para não virar parede de texto. -->
      <VisAxis
        type="x"
        :tick-values="marcasX"
        :tick-format="rotuloDoDia"
        :grid-line="false"
        :domain-line="false"
        :tick-line="false"
      />

      <VisCrosshair color="var(--ui-primary)" :template="legenda" />
      <VisTooltip />
    </VisXYContainer>
  </div>
</template>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--ui-primary);
  --vis-crosshair-circle-stroke-color: var(--ui-bg);

  --vis-axis-grid-color: var(--ui-border);
  --vis-axis-tick-color: var(--ui-border);
  /* text-muted, e não text-dimmed: no escuro o dimmed não passa no contraste. */
  --vis-axis-tick-label-color: var(--ui-text-muted);
  --vis-axis-label-color: var(--ui-text-muted);
  --vis-axis-tick-label-font-size: 11px;

  --vis-tooltip-background-color: var(--ui-bg);
  --vis-tooltip-border-color: var(--ui-border);
  --vis-tooltip-text-color: var(--ui-text-highlighted);
}
</style>
