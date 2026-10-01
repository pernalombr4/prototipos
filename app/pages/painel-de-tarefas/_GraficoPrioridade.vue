<script setup lang="ts">
/**
 * Tarefas por prioridade: as abertas agora, uma coluna por prioridade, da
 * urgente à baixa (rodada 3: "coloque também um board de tarefas por
 * prioridade"). É o "Priority breakdown" do Jira e do ClickUp.
 *
 * Categorias em ordem pedem coluna; uma série só pede uma cor só (pesquisa de
 * formatos, `PESQUISA.md`). A cor é a primária e não o vermelho: aqui o
 * vermelho já quer dizer "vencida", e urgente não é a mesma coisa.
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

const pilhas = computed<Pilha[]>(() => [{ chave: 'abertas', rotulo: props.t.paineis.abertas.titulo, cor: 'var(--ui-primary)' }])
const colunas = computed<Coluna[]>(() => PRIORIDADES.map(p => ({ chave: p, rotulo: props.t.prioridades[p], valores: [props.bloco.abertas[p]] })))

const rotulo = computed(() => PRIORIDADES.map(p => `${props.t.prioridades[p]}: ${numero(props.bloco.abertas[p], props.t)}`).join('; '))
</script>

<template>
  <GraficoColunas
    :t="t"
    :pilhas="pilhas"
    :colunas="colunas"
    :rotulo-acessivel="rotulo"
    @abrir="emit('abrir', $event as Prioridade)"
  />
</template>
