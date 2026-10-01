<script setup lang="ts">
/**
 * Tempo até o prazo: as abertas distribuídas em faixas em ordem, da mais
 * vencida à mais folgada. Categorias em ordem pedem colunas, como um
 * histograma (rodada 3: as barras finas pareciam "linhas marcadas", não
 * gráfico). A cor diz o grupo: vencidas, a vencer (os 7 dias), depois de 7
 * dias e sem prazo. O eixo usa o nome curto; o ponteiro, o nome inteiro.
 * Clicar numa coluna abre a lista daquela faixa.
 */
import { FAIXAS } from './metricas'
import type { Faixa } from './metricas'
import type { Textos } from './textos'
import GraficoColunas from './_GraficoColunas.vue'
import type { Coluna, Pilha } from './_GraficoColunas.vue'
import { numero } from './formatar'

const props = defineProps<{
  t: Textos
  faixas: Record<Faixa, number>
}>()

const emit = defineEmits<{ abrir: [faixa: Faixa] }>()

const GRUPO: Record<Faixa, number> = {
  vencida_7d_mais: 0, vencida_ate_7d: 0, ate_24h: 1, de_1_a_7d: 1, de_8_a_30d: 2, mais_30d: 2, sem_prazo: 3,
}

const pilhas = computed<Pilha[]>(() => [
  { chave: 'vencidas', rotulo: props.t.prazos.grupos.vencidas, cor: 'var(--ui-error)' },
  { chave: 'aVencer', rotulo: props.t.prazos.grupos.aVencer, cor: 'var(--ui-warning)' },
  { chave: 'depois', rotulo: props.t.prazos.grupos.depois, cor: 'var(--ui-info)' },
  { chave: 'sem', rotulo: props.t.prazos.faixas.sem_prazo, cor: 'var(--ui-text-dimmed)' },
])

/** Cada faixa preenche só a pilha do grupo dela: a cor da coluna é o grupo. */
const colunas = computed<Coluna[]>(() => FAIXAS.map((f) => {
  const valores = [0, 0, 0, 0]
  valores[GRUPO[f]] = props.faixas[f]
  return { chave: f, rotulo: props.t.prazos.faixas[f], curto: props.t.prazos.curtas[f], valores }
}))

const rotulo = computed(() => FAIXAS.map(f => `${props.t.prazos.faixas[f]}: ${numero(props.faixas[f], props.t)}`).join('; '))
</script>

<template>
  <GraficoColunas
    :t="t"
    :pilhas="pilhas"
    :colunas="colunas"
    :rotulo-acessivel="rotulo"
    com-legenda
    @abrir="emit('abrir', $event as Faixa)"
  />
</template>
