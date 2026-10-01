<script setup lang="ts">
/**
 * Tarefas por prioridade: as abertas agora, uma coluna por prioridade, da
 * urgente à baixa (rodada 3: "coloque também um board de tarefas por
 * prioridade"). É o "Priority breakdown" do Jira e do ClickUp.
 *
 * Categorias em ordem pedem coluna. Cada coluna tem a cor da prioridade
 * (rodada 7: "tarefas por prioridade tem que ter cor diferente por coluna"),
 * a mesma do protótipo de Tarefas Rápidas (`tarefas-rapidas/quadro.ts`):
 * urgente em vermelho, alta em amarelo, normal neutra e baixa na cor de
 * informação. A normal fica em cinza, e não no neutro do tema (quase preto),
 * para não pesar mais que a urgente.
 *
 * Só a tarefa rápida e a do Spaceflow têm prioridade. A tarefa de etapa grava
 * "0" (medido em develop) e fica de fora; o "Como calculamos" diz isso, e a
 * quickview mostra quantas ficaram. Clicar numa coluna abre a lista.
 */
import type { BlocoPrioridade, Prioridade } from './metricas'
import { PRIORIDADES } from './metricas'
import type { Textos } from './textos'
import GraficoColunas from './_GraficoColunas.vue'
import type { Coluna, Pilha } from './_GraficoColunas.vue'
import { numero } from './formatar'

const props = defineProps<{
  t: Textos
  bloco: BlocoPrioridade
}>()

const emit = defineEmits<{ abrir: [prioridade: Prioridade] }>()

const COR: Record<Prioridade, string> = {
  urgent: 'var(--ui-error)',
  high: 'var(--ui-warning)',
  normal: 'var(--ui-text-dimmed)',
  low: 'var(--ui-info)',
}

/** Uma pilha por prioridade, e cada coluna preenche só a sua: a cor da coluna é a prioridade. */
const pilhas = computed<Pilha[]>(() => PRIORIDADES.map(p => ({ chave: p, rotulo: props.t.prioridades[p], cor: COR[p] })))
const colunas = computed<Coluna[]>(() => PRIORIDADES.map((p, k) => ({
  chave: p,
  rotulo: props.t.prioridades[p],
  valores: PRIORIDADES.map((_, j) => (j === k ? props.bloco.abertas[p] : 0)),
})))

const rotulo = computed(() => PRIORIDADES.map(p => `${props.t.prioridades[p]}: ${numero(props.bloco.abertas[p], props.t)}`).join('; '))
</script>

<template>
  <GraficoColunas
    :t="t"
    :pilhas="pilhas"
    :colunas="colunas"
    :rotulo-acessivel="rotulo"
    :rotulo-do-valor="t.paineis.abertas.titulo"
    @abrir="emit('abrir', $event as Prioridade)"
  />
</template>
