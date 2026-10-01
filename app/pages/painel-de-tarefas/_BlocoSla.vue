<script setup lang="ts">
/**
 * SLA: colunas pela situação do prazo, com um seletor entre "Abertas agora" e
 * "Concluídas no período" (rodada 3: "em vez de mostrar as 2 linhas juntas é
 * mais fácil botar barras verticais e colocar um filtro"). Aberta e concluída
 * respondem perguntas diferentes, por isso uma de cada vez:
 * - aberta: "o que está vencendo agora?" (vencida, a vencer, no prazo, sem prazo);
 * - concluída: "entregamos no prazo?" (atrasada, no prazo, sem prazo).
 *
 * A parte que pede ação vem primeiro, à esquerda. Cada coluna tem a cor da
 * situação, a mesma do resto do painel; o nome está no eixo, então não há
 * legenda. Clicar numa coluna abre a lista. As regras ficam no "Como
 * calculamos".
 */
import type { BlocoSla, Situacao } from './metricas'
import type { Textos } from './textos'
import GraficoColunas from './_GraficoColunas.vue'
import type { Coluna, Pilha } from './_GraficoColunas.vue'
import { numero } from './formatar'

type Grupo = 'abertas' | 'concluidas'

const props = defineProps<{
  t: Textos
  sla: BlocoSla
}>()

const emit = defineEmits<{ abrir: [situacao: Situacao, grupo: Grupo] }>()

const grupo = ref<Grupo>('abertas')

const grupos = computed(() => [
  { label: props.t.sla.abertasAgora, value: 'abertas' },
  { label: props.t.sla.concluidasNoPeriodo, value: 'concluidas' },
])

const COR: Record<Situacao, string> = {
  vencida: 'var(--ui-error)',
  a_vencer: 'var(--ui-warning)',
  no_prazo: 'var(--ui-success)',
  sem_prazo: 'var(--ui-text-dimmed)',
  atrasada: 'var(--ui-error)',
  concluida_no_prazo: 'var(--ui-success)',
  concluida_sem_prazo: 'var(--ui-text-dimmed)',
}

const ORDEM: Record<Grupo, Situacao[]> = {
  abertas: ['vencida', 'a_vencer', 'no_prazo', 'sem_prazo'],
  concluidas: ['atrasada', 'concluida_no_prazo', 'concluida_sem_prazo'],
}

const valores = computed(() => props.sla[grupo.value] as Partial<Record<Situacao, number>>)

/** Uma pilha por situação, e cada coluna preenche só a sua: a cor da coluna é a situação. */
const pilhas = computed<Pilha[]>(() => ORDEM[grupo.value].map(s => ({ chave: s, rotulo: props.t.situacao[s], cor: COR[s] })))
const colunas = computed<Coluna[]>(() => ORDEM[grupo.value].map((s, k, todas) => {
  const v = todas.map(() => 0)
  v[k] = valores.value[s] ?? 0
  return { chave: s, rotulo: props.t.situacao[s], valores: v }
}))

const rotulo = computed(() => {
  const nome = grupos.value.find(g => g.value === grupo.value)!.label
  return `${nome}. ${ORDEM[grupo.value].map(s => `${props.t.situacao[s]}: ${numero(valores.value[s] ?? 0, props.t)}`).join('; ')}`
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="px-4 pb-2">
      <UTabs
        v-model="grupo"
        :items="grupos"
        :content="false"
        size="xs"
        color="neutral"
        class="w-fit"
        :aria-label="t.sla.filtro"
      />
    </div>
    <GraficoColunas
      :key="grupo"
      :t="t"
      :pilhas="pilhas"
      :colunas="colunas"
      :rotulo-acessivel="rotulo"
      :rotulo-do-valor="grupos.find(g => g.value === grupo)!.label"
      @abrir="emit('abrir', $event as Situacao, grupo)"
    />
  </div>
</template>
