<script setup lang="ts">
/**
 * Tempo médio de duração: um painel só, com o seletor "Por fluxo, Por etapa,
 * Por tarefa" (rodada 3: "separado tá bem ruim, não parece fazer parte da
 * mesma coisa").
 *
 * As 3 vistas são o mesmo gráfico de barras horizontais, do mais lento ao mais
 * rápido, com o tempo médio na ponta (ranking de uma grandeza; referência
 * ClickUp e monday.com). Nada de cartão com média, p90 e composição dentro do
 * painel ("muita informação no card"): o detalhe fica na quickview.
 *
 * Rodada 3, segunda passada ("a visualização atual tá pobre demais"): a barra
 * diz onde o tempo vai, como o "Time in Status" do ClickUp.
 * - por fluxo: a barra se divide nas etapas (fluxo da categoria) ou nas
 *   tarefas (Spaceflow), na ordem, com a mais lenta em amarelo, o mesmo
 *   amarelo do gargalo da vista por etapa; o resto, se há, é a espera entre
 *   uma e outra, em cinza;
 * - por etapa: a etapa mais lenta de cada fluxo em amarelo;
 * - por tarefa: espera (até alguém assumir) e execução, na tarefa de etapa
 *   com "Habilitar Atribuição".
 * Tudo pela média (rodada 3: "é a média que tem que ser entregue"). Os tons
 * são a cor primária misturada ao fundo, para o nome dentro da parte ter
 * contraste no claro e no escuro.
 *
 * A hierarquia aparece descendo de nível na própria tabela: a tarefa existe
 * dentro de uma etapa, que existe dentro de um fluxo da categoria; o
 * Spaceflow não tem etapa e divide direto em tarefas.
 * - clicar num fluxo da categoria mostra as etapas dele;
 * - clicar num fluxo do Spaceflow mostra as tarefas dele;
 * - clicar numa etapa mostra as tarefas dela;
 * - clicar numa tarefa abre a lista das tarefas que formam o tempo;
 * - o selo com "×" diz o recorte e volta para o nível todo.
 */
import type { TempoDaEtapa, TempoDaTarefa, TempoDoFluxo } from './metricas'
import type { Textos } from './textos'
import BarrasHorizontais from './_BarrasHorizontais.vue'
import type { BarraDoGrafico, ParteDaBarra } from './_BarrasHorizontais.vue'
import { duracao } from './formatar'

/** Uma linha de tempo, antes de virar barra. */
interface LinhaDeTempo {
  chave: string
  nome: string
  caminho: string | null
  selo: string | null
  n: number
  mediana: number | null
  media: number | null
  p90: number | null
  emAndamento: number
  idadeMediana: number | null
  gargalo?: boolean
  partes?: ParteDaBarra[]
}

/** A cor primária misturada ao fundo: o tom principal e o claro. */
const tom = (pct: number) => `color-mix(in oklab, var(--ui-primary) ${pct}%, var(--ui-bg))`
const PRINCIPAL = tom(55)
const CLARO = tom(30)
const AMARELO = 'warning'
const CINZA = 'var(--ui-text-dimmed)'

export type NivelDoTempo = 'fluxo' | 'etapa' | 'tarefa'

const props = defineProps<{
  t: Textos
  tarefas: TempoDaTarefa[]
  etapas: TempoDaEtapa[]
  fluxos: TempoDoFluxo[]
  soManual: boolean
}>()

const nivel = defineModel<NivelDoTempo>('nivel', { required: true })
const emit = defineEmits<{ abrir: [linha: TempoDaTarefa] }>()

/** O recorte da descida: um fluxo, ou um fluxo e uma etapa. */
const recorte = ref<{ fluxo: string, etapa?: string } | null>(null)

const niveis = computed(() => [
  { value: 'fluxo', label: props.t.tempos.niveis.fluxo, icon: 'i-lucide-workflow' },
  { value: 'etapa', label: props.t.tempos.niveis.etapa, icon: 'i-lucide-columns-3' },
  { value: 'tarefa', label: props.t.tempos.niveis.tarefa, icon: 'i-lucide-square-check' },
])

/** Trocar de aba à mão mostra o nível inteiro, sem recorte. */
function trocarNivel(v: string | number) {
  recorte.value = null
  nivel.value = v as NivelDoTempo
}

const textoDoRecorte = computed(() => recorte.value
  ? (recorte.value.etapa ? `${recorte.value.fluxo} › ${recorte.value.etapa}` : recorte.value.fluxo)
  : '')

/* ------------------------------ as linhas ------------------------------ */

/** Etapas (ou tarefas) em tons alternados, a mais lenta em amarelo e a espera entre elas em cinza. */
function partesDoFluxo(f: TempoDoFluxo): ParteDaBarra[] | undefined {
  if (!f.estat || f.composicao.length < 2) return undefined
  const maisLenta = Math.max(...f.composicao.map(c => c.media))
  const partes: ParteDaBarra[] = f.composicao.map((c, k) => ({
    valor: c.media,
    rotulo: c.rotulo,
    texto: duracao(c.media, props.t),
    cor: c.media === maisLenta ? AMARELO : k % 2 ? CLARO : PRINCIPAL,
    classeDoTexto: c.media === maisLenta ? 'text-black' : undefined,
    rotuloDentro: true,
  }))
  // Resto de menos de 1% é arredondamento do histórico, não espera.
  if (f.entre > f.estat.media * 0.01) partes.push({ valor: f.entre, rotulo: props.t.tempos.partes.entre, texto: duracao(f.entre, props.t), cor: CINZA })
  return partes
}

const linhasDeFluxo = computed<LinhaDeTempo[]>(() => props.fluxos.map(f => ({
  chave: `f:${f.fluxo}`,
  nome: f.fluxo,
  caminho: null,
  selo: props.t.tempos.tipoDeFluxo[f.tipo],
  n: f.estat?.n ?? 0,
  mediana: f.estat?.mediana ?? null,
  media: f.estat?.media ?? null,
  p90: f.estat?.p90 ?? null,
  emAndamento: f.emAndamento,
  idadeMediana: f.idadeMediana,
  partes: partesDoFluxo(f),
})))

const linhasDeEtapa = computed<LinhaDeTempo[]>(() => {
  const doRecorte = props.etapas.filter(e => !recorte.value || e.fluxo === recorte.value.fluxo)
  // A etapa mais lenta de cada fluxo é o gargalo dele.
  const maiorPorFluxo = new Map<string, number>()
  const comDado = new Map<string, number>()
  for (const e of props.etapas) {
    if (!e.estat) continue
    maiorPorFluxo.set(e.fluxo, Math.max(maiorPorFluxo.get(e.fluxo) ?? 0, e.estat.media))
    comDado.set(e.fluxo, (comDado.get(e.fluxo) ?? 0) + 1)
  }
  return doRecorte.map(e => ({
    chave: `e:${e.fluxo}|${e.etapa}`,
    nome: e.etapa,
    caminho: e.fluxo,
    selo: null,
    n: e.estat?.n ?? 0,
    mediana: e.estat?.mediana ?? null,
    media: e.estat?.media ?? null,
    p90: e.estat?.p90 ?? null,
    emAndamento: e.agora,
    idadeMediana: e.idadeMediana,
    gargalo: !!e.estat && (comDado.get(e.fluxo) ?? 0) > 1 && e.estat.media === maiorPorFluxo.get(e.fluxo),
  }))
})

const tarefasDoRecorte = computed(() => props.tarefas.filter(x =>
  !recorte.value || (x.fluxo === recorte.value.fluxo && (!recorte.value.etapa || x.etapa === recorte.value.etapa))))

const linhasDeTarefa = computed<LinhaDeTempo[]>(() => tarefasDoRecorte.value.map((x, i) => ({
  chave: `t:${i}`,
  nome: x.nome === '__avulsa' ? props.t.tempos.avulsa : x.nome,
  caminho: x.fluxo ? (x.etapa ? `${x.fluxo} › ${x.etapa}` : x.fluxo) : null,
  selo: props.t.origemCurta[x.origem],
  n: x.estat.n,
  mediana: x.estat.mediana,
  media: x.estat.media,
  p90: x.estat.p90,
  emAndamento: x.emAndamento,
  idadeMediana: x.idadeMediana,
  partes: x.espera !== null && x.execucao !== null
    ? [
        { valor: x.espera, rotulo: props.t.tempos.espera, texto: duracao(x.espera, props.t), cor: CLARO, rotuloDentro: true },
        { valor: x.execucao, rotulo: props.t.tempos.execucao, texto: duracao(x.execucao, props.t), cor: PRINCIPAL, rotuloDentro: true },
      ]
    : undefined,
})))

const vista = computed(() => {
  if (nivel.value === 'fluxo') return linhasDeFluxo.value
  if (nivel.value === 'etapa') return linhasDeEtapa.value
  return linhasDeTarefa.value
})

/** Do mais lento ao mais rápido, pela média; a etapa gargalo em amarelo. */
const barras = computed<BarraDoGrafico[]>(() => vista.value
  .filter(l => l.media !== null)
  .sort((a, b) => b.media! - a.media!)
  .map(l => ({
    chave: l.chave,
    rotulo: l.nome,
    apoio: [l.selo, l.caminho].filter(Boolean).join(' · ') || null,
    valor: l.media!,
    texto: duracao(l.media, props.t),
    partes: l.partes,
    cor: l.gargalo ? AMARELO : PRINCIPAL,
    destaque: l.gargalo,
  })))

/** A legenda diz o que cada cor quer dizer na vista; só com o que aparece. */
const legenda = computed(() => {
  const p = props.t.tempos.partes
  const usadas = barras.value.flatMap(b => b.partes ?? [])
  if (nivel.value === 'fluxo') {
    return [
      { rotulo: p.doFluxo, cor: PRINCIPAL },
      { rotulo: p.maisLenta, cor: AMARELO },
      ...(usadas.some(x => x.cor === CINZA) ? [{ rotulo: p.entre, cor: CINZA }] : []),
    ]
  }
  if (nivel.value === 'etapa') return barras.value.some(b => b.destaque) ? [{ rotulo: p.maisLenta, cor: AMARELO }] : []
  return usadas.length ? [{ rotulo: p.espera, cor: CLARO }, { rotulo: p.execucao, cor: PRINCIPAL }] : []
})

/* ---------------------------- descer de nível ---------------------------- */

function abrir(chave: string) {
  if (chave.startsWith('f:')) {
    const fluxo = props.fluxos.find(f => `f:${f.fluxo}` === chave)!
    recorte.value = { fluxo: fluxo.fluxo }
    nivel.value = fluxo.tipo === 'categoria' ? 'etapa' : 'tarefa'
  }
  else if (chave.startsWith('e:')) {
    const [fluxo, etapa] = chave.slice(2).split('|') as [string, string]
    recorte.value = { fluxo, etapa }
    nivel.value = 'tarefa'
  }
  else {
    emit('abrir', tarefasDoRecorte.value[Number(chave.slice(2))]!)
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex flex-wrap items-center gap-2 px-4 pb-2">
      <UTabs
        :model-value="nivel"
        :items="niveis"
        :content="false"
        size="xs"
        color="neutral"
        class="w-fit"
        :aria-label="t.tempos.nivel"
        @update:model-value="trocarNivel"
      />
      <Transition enter-active-class="transition duration-150" enter-from-class="opacity-0 -translate-x-1" leave-active-class="transition duration-100" leave-to-class="opacity-0">
        <UButton
          v-if="recorte"
          :label="textoDoRecorte"
          trailing-icon="i-lucide-x"
          color="primary"
          variant="soft"
          size="xs"
          class="max-w-full"
          :ui="{ label: 'truncate' }"
          :aria-label="t.tempos.tirarRecorte(textoDoRecorte)"
          @click="recorte = null"
        />
      </Transition>
    </div>

    <UEmpty
      v-if="soManual && nivel !== 'tarefa'"
      icon="i-lucide-workflow"
      :title="t.tempos.soFluxo"
      variant="naked"
      size="sm"
      class="flex-1"
    />
    <BarrasHorizontais
      v-else
      :key="`${nivel}-${textoDoRecorte}`"
      class="animate-[entrada_0.25s_ease-out_both]"
      :t="t"
      :barras="barras"
      :legenda="legenda"
      :vazio="t.tempos.semDados"
      largura-do-rotulo="16rem"
      @abrir="abrir"
    />

  </div>
</template>
