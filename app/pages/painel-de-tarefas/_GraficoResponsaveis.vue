<script setup lang="ts">
/**
 * Tarefas por responsável, em gráfico de barras horizontais (rodada 3: "não
 * deveria ser um gráfico em vez de uma tabela? essa tabela pode abrir como
 * detalhe do gráfico").
 *
 * O seletor começa em "Todos": a barra agrupada, uma parte por status
 * (rodada 3: "deve ser agrupado como estava antes... deve ter uma visão
 * 'todos' como mais um filtro com agrupamentos"). As partes não se sobrepõem:
 * vencida (em qualquer status) na base, depois pendente, em andamento,
 * bloqueada e concluída no período. Os outros filtros mostram uma parte só
 * (rodada 3: "pendente, em andamento, atrasada ou completa... o termo que
 * estiver usando"), com o mesmo número da parte.
 *
 * Uma barra por pessoa, grupo, "Todo mundo", e-mail externo e sem
 * responsável, da maior para a menor, e só as 10 primeiras: o resto está no
 * "Ver tabela" (pesquisa de formatos, `PESQUISA.md`: ranking com top N). Em
 * "Todos", a ordem é pelas vencidas: quem está mais atrasado primeiro (o
 * "Who's Behind" do ClickUp).
 *
 * Clicar numa barra abre a lista daquela fila, no filtro escolhido. A tabela
 * com tudo abre pelo "Ver tabela" do cabeçalho (`_DetalheResponsaveis.vue`).
 */
import type { FiltroDoResponsavel, LinhaDeResponsavel } from './metricas'
import { FILTROS_DO_RESPONSAVEL, responsaveisDisponiveis } from './metricas'
import type { Textos } from './textos'
import BarrasHorizontais from './_BarrasHorizontais.vue'
import type { BarraDoGrafico, ParteDaBarra } from './_BarrasHorizontais.vue'
import { numero } from './formatar'

type Parte = 'vencidas' | 'pendentes' | 'emAndamento' | 'bloqueadas' | 'concluidas'

const props = defineProps<{
  t: Textos
  linhas: LinhaDeResponsavel[]
}>()

const emit = defineEmits<{ abrir: [chave: string, filtro: FiltroDoResponsavel] }>()

const filtro = ref<FiltroDoResponsavel>('todos')

/** Os nomes que o painel já usa: o status virtual e a situação "Vencida". */
const nome = computed<Record<Parte, string>>(() => ({
  vencidas: props.t.situacao.vencida,
  pendentes: props.t.status.nao_iniciada,
  emAndamento: props.t.status.em_andamento,
  bloqueadas: props.t.status.bloqueada,
  concluidas: props.t.status.concluida,
}))
const filtros = computed(() => FILTROS_DO_RESPONSAVEL.map(f => ({ label: f === 'todos' ? props.t.resp.todos : nome.value[f], value: f })))

/**
 * A convenção de status das ferramentas de tarefa (Jira, Linear): pendente em
 * cinza, em andamento na cor de informação, bloqueada em amarelo, concluída
 * em verde. Vencida em vermelho, como no resto do painel.
 */
const COR: Record<Parte, string> = {
  vencidas: 'error',
  pendentes: 'var(--ui-text-muted)',
  emAndamento: 'info',
  bloqueadas: 'warning',
  concluidas: 'success',
}
const PARTES: Parte[] = ['vencidas', 'pendentes', 'emAndamento', 'bloqueadas', 'concluidas']

const iniciais = new Map(responsaveisDisponiveis.pessoas.map(p => [p.chave, p.iniciais]))
const iconeDoTipo: Record<LinhaDeResponsavel['tipo'], string> = {
  pessoa: 'i-lucide-user',
  grupo: 'i-lucide-users',
  todos: 'i-lucide-globe',
  externo: 'i-lucide-mail',
  sem: 'i-lucide-user-x',
}

const TOP = 10

const total = (l: LinhaDeResponsavel) => PARTES.reduce((s, p) => s + l[p], 0)

const barras = computed<BarraDoGrafico[]>(() => {
  const f = filtro.value
  const valor = (l: LinhaDeResponsavel) => f === 'todos' ? total(l) : l[f]
  return [...props.linhas]
    .filter(l => valor(l) > 0)
    .sort((a, b) => (f === 'todos' ? b.vencidas - a.vencidas : 0) || valor(b) - valor(a) || a.nome.localeCompare(b.nome))
    .slice(0, TOP)
    .map(l => ({
      chave: l.chave,
      rotulo: l.nome,
      avatar: l.tipo === 'pessoa' ? iniciais.get(l.chave) : undefined,
      icone: l.tipo === 'pessoa' ? undefined : iconeDoTipo[l.tipo],
      valor: valor(l),
      texto: numero(valor(l), props.t),
      ...(f === 'todos'
        ? { partes: PARTES.map((p): ParteDaBarra => ({ valor: l[p], cor: COR[p], rotulo: nome.value[p], texto: numero(l[p], props.t) })) }
        : { cor: COR[f] }),
    }))
})

/** A legenda só em "Todos", e só com as partes que aparecem. */
const legenda = computed(() => filtro.value === 'todos'
  ? PARTES.filter(p => props.linhas.some(l => l[p] > 0)).map(p => ({ rotulo: nome.value[p], cor: COR[p] }))
  : [])
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="px-4 pb-2">
      <UTabs
        v-model="filtro"
        :items="filtros"
        :content="false"
        size="xs"
        color="neutral"
        class="w-fit max-w-full"
        :ui="{ list: 'overflow-x-auto' }"
        :aria-label="t.resp.filtro"
      />
    </div>
    <BarrasHorizontais
      :key="filtro"
      :t="t"
      :barras="barras"
      :legenda="legenda"
      :vazio="t.resp.vazio"
      :lote="TOP"
      @abrir="emit('abrir', $event, filtro)"
    />
  </div>
</template>
