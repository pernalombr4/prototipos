<script setup lang="ts">
/**
 * Tarefas por status: uma coluna por status (pendente, em andamento,
 * bloqueada, concluída), com o total em cima, empilhada pela situação do prazo
 * (rodada 3: "vale colocar um painel de contagem de tarefas por status").
 *
 * É o status e o substatus virtuais da demanda num gráfico só: poucas
 * categorias com composição pedem coluna empilhada. Por isso o antigo
 * "Status e situação do prazo" (barras finas) saiu: dizia a mesma coisa.
 *
 * As 3 abertas são o retrato de agora; a concluída é do período ("Como
 * calculamos"). Na concluída, o vermelho é "atrasada"; nas abertas, "vencida":
 * a legenda chama os 2 de "Fora do prazo". Clicar numa coluna abre a lista.
 */
import type { LinhaDeStatus, StatusVirtual } from './metricas'
import type { Textos } from './textos'
import GraficoColunas from './_GraficoColunas.vue'
import type { Coluna, Pilha } from './_GraficoColunas.vue'
import { numero } from './formatar'

const props = defineProps<{
  t: Textos
  linhas: LinhaDeStatus[]
}>()

const emit = defineEmits<{ abrir: [status: StatusVirtual] }>()

const ORDEM: StatusVirtual[] = ['nao_iniciada', 'em_andamento', 'bloqueada', 'concluida']

const pilhas = computed<Pilha[]>(() => [
  { chave: 'fora', rotulo: props.t.statusBloco.foraDoPrazo, cor: 'var(--ui-error)' },
  { chave: 'aVencer', rotulo: props.t.situacao.a_vencer, cor: 'var(--ui-warning)' },
  { chave: 'noPrazo', rotulo: props.t.situacao.no_prazo, cor: 'var(--ui-success)' },
  { chave: 'semPrazo', rotulo: props.t.situacao.sem_prazo, cor: 'var(--ui-text-dimmed)' },
])

/** Situação do prazo de cada status, na ordem das pilhas. */
const colunas = computed<Coluna[]>(() => ORDEM.map((s) => {
  const linha = props.linhas.find(l => l.status === s)
  const n = (k: string) => linha?.partes.find(p => p.situacao === k)?.n ?? 0
  const valores = s === 'concluida'
    ? [n('atrasada'), 0, n('concluida_no_prazo'), n('concluida_sem_prazo')]
    : [n('vencida'), n('a_vencer'), n('no_prazo'), n('sem_prazo')]
  return { chave: s, rotulo: props.t.status[s], valores }
}))

const rotulo = computed(() => colunas.value
  .map(c => `${c.rotulo}: ${numero(c.valores.reduce((a, b) => a + b, 0), props.t)}`)
  .join('; '))
</script>

<template>
  <GraficoColunas
    :t="t"
    :pilhas="pilhas"
    :colunas="colunas"
    :rotulo-acessivel="rotulo"
    com-legenda
    @abrir="emit('abrir', $event as StatusVirtual)"
  />
</template>
