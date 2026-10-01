<script setup lang="ts">
/**
 * Tarefas por status: uma coluna por status (pendente, em andamento,
 * bloqueada, concluída), com o total em cima (rodada 3: "vale colocar um
 * painel de contagem de tarefas por status").
 *
 * Rodada 8: só o status, sem dividir pela situação do prazo ("não precisa
 * cruzar com fora do prazo, a vencer, no prazo e sem prazo... pra ser mais
 * simples por hora"). A divisão continua na quickview de cada coluna.
 *
 * Cada coluna tem a cor do status, a mesma de Tarefas por responsável:
 * pendente em cinza, em andamento na cor de informação, bloqueada em amarelo,
 * concluída em verde. O nome está no eixo, então não há legenda. As 3 abertas
 * são o retrato de agora; a concluída é do período ("Como calculamos").
 * Clicar numa coluna abre a lista.
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

const COR: Partial<Record<StatusVirtual, string>> = {
  nao_iniciada: 'var(--ui-text-muted)',
  em_andamento: 'var(--ui-info)',
  bloqueada: 'var(--ui-warning)',
  concluida: 'var(--ui-success)',
}

const total = (s: StatusVirtual) => props.linhas.find(l => l.status === s)?.total ?? 0

/** Uma pilha por status, e cada coluna preenche só a sua: a cor da coluna é o status. */
const pilhas = computed<Pilha[]>(() => ORDEM.map(s => ({ chave: s, rotulo: props.t.status[s], cor: COR[s]! })))
const colunas = computed<Coluna[]>(() => ORDEM.map((s, k) => ({
  chave: s,
  rotulo: props.t.status[s],
  valores: ORDEM.map((_, j) => (j === k ? total(s) : 0)),
})))

const rotulo = computed(() => ORDEM.map(s => `${props.t.status[s]}: ${numero(total(s), props.t)}`).join('; '))
</script>

<template>
  <GraficoColunas
    :t="t"
    :pilhas="pilhas"
    :colunas="colunas"
    :rotulo-acessivel="rotulo"
    :rotulo-do-valor="t.statusBloco.tarefas"
    @abrir="emit('abrir', $event as StatusVirtual)"
  />
</template>
