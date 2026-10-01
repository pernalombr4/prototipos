<script setup lang="ts">
/**
 * Painel de tarefas: a visão de conjunto das tarefas do workspace.
 *
 * Nativo, com conteúdo fixo. Não é o construtor de painéis da Interface (que
 * só lê itens e exige "Categoria"): o catálogo de painéis é fechado e cada um
 * mostra sempre o mesmo número. O gestor recorta por período, origem,
 * responsável e categoria.
 *
 * Rodada 2:
 * - origem em 2: criadas manualmente e criadas por fluxo (Spaceflow e fluxo
 *   da categoria juntos). O motor por baixo (`/ws/tasks` ou
 *   `/c-flow-item-tasks`) só decide para qual lista o "Abrir em" leva;
 * - "a vencer" = prazo nos próximos 7 dias, o corte mais comum no mercado;
 * - painéis de lista com rolagem infinita;
 * - desenho do template de dashboard do Nuxt UI, o mesmo do admin.
 *
 * Rodada 3:
 * - todo painel se arrasta (pelo cabeçalho) e se redimensiona (pelo canto) direto,
 *   sem modo de edição;
 * - o botão "Painéis" é o editor de visibilidade, como o "Colunas" das tabelas;
 * - a lista lateral tem a quickview do admin, com o resumo do painel clicado.
 *
 * O dado é o `mocks.ts` desta pasta. As regras estão em `metricas.ts`; o
 * catálogo e o arranjo padrão, em `paineis.ts`.
 */
import type { ItemDaGrade } from '~/components/ux/UxGradeDePaineis.vue'
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import BarraDeFiltros from './_BarraDeFiltros.vue'
import BlocoPrazos from './_BlocoPrazos.vue'
import BlocoSla from './_BlocoSla.vue'
import CartaoNumero from './_CartaoNumero.vue'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import GavetaDeTarefas from './_GavetaDeTarefas.vue'
import GraficoSerie from './_GraficoSerie.vue'
import ListaProximas from './_ListaProximas.vue'
import Painel from './_Painel.vue'
import RecorteMvp from './_RecorteMvp.vue'
import DetalheResponsaveis from './_DetalheResponsaveis.vue'
import GraficoResponsaveis from './_GraficoResponsaveis.vue'
import GraficoStatus from './_GraficoStatus.vue'
import GraficoPrioridade from './_GraficoPrioridade.vue'
import BlocoTempos from './_BlocoTempos.vue'
import type { NivelDoTempo } from './_BlocoTempos.vue'
import { AGORA } from './mocks'
import type { DropdownMenuItem } from '@nuxt/ui'
import {
  FAIXAS, PRIORIDADES, aplicarFiltros, blocoSla, dentro, estaAberta, execucoesDoFiltro, faixaDe, faixasDePrazo, flowItemsDoFiltro,
  granularidadePadrao, intervaloDo, nomeDoResponsavel, numerosDoTopo, parteDoResponsavel, porPrioridade, porResponsavel, porStatus,
  proximasAVencer, serie, situacao, tempoDeConclusao, temposPorEtapa, temposPorFluxo, temposPorTarefa,
  todasAsTarefas,
} from './metricas'
import type {
  Faixa, Filtros, FiltroDoResponsavel, Granularidade, ModoDoResponsavel, Prioridade, Situacao, StatusVirtual, TarefaDoPainel, TempoDaTarefa,
} from './metricas'
import type { IdDoPainel, LinhaDoResumo, ResumoDoRecorte } from './paineis'
import { DEFINICAO, GRUPOS, LIMITES, PAINEIS, gravarLayout, layoutPadrao, lerLayout } from './paineis'
import { duracao, hora, numero, porcentagem } from './formatar'
import { textos } from './textos'
import { LAYOUT_MVP } from './mvp'

definePageMeta({
  titulo: 'Painel de tarefas',
  descricao: 'Painel nativo das tarefas criadas manualmente e por fluxo: SLA, a vencer, responsáveis, status e tempo de tarefa, etapa e fluxo. Os painéis se arrastam e se redimensionam direto; a lista de cada número tem o resumo ao lado.',
  status: 'em-revisao',
  atualizado: '2026-09-30',
  tela: 'Tarefas › Painel',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME: o seletor de estados não é proposta. Existe para percorrer *
 * os estados que a tela precisa ter.                                  *
 * ------------------------------------------------------------------ */
type Estado = 'cheio' | 'carregando' | 'semResultado' | 'vazio' | 'erro' | 'semPermissao'
const estado = ref<Estado>('cheio')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'cheio', rotulo: 'Cheio' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'semResultado', rotulo: 'Filtro sem resultado' },
  { valor: 'vazio', rotulo: 'Workspace sem tarefas' },
  { valor: 'erro', rotulo: 'Erro' },
  { valor: 'semPermissao', rotulo: 'Sem permissão' },
]

/**
 * ANDAIME: o botão "MVP" da barra de baixo mostra o recorte da primeira
 * entrega (`mvp.ts`): 7 painéis fixos, 2 filtros, lista sem quickview.
 */
const mvp = ref(false)

/* --------------------------------- filtros -------------------------------- */

const FILTROS_PADRAO: Filtros = { periodo: '30d', origem: 'todas', responsaveis: [], categorias: [] }
const filtros = ref<Filtros>({ ...FILTROS_PADRAO })
const granularidade = ref<Granularidade>(granularidadePadrao('30d'))
const modoResponsavel = ref<ModoDoResponsavel>('designada')
/** O nível do painel de tempos: começa no topo da hierarquia, o fluxo. */
const nivelDoTempo = ref<NivelDoTempo>('fluxo')

watch(() => filtros.value.periodo, p => { granularidade.value = granularidadePadrao(p) })

/** O estado "Filtro sem resultado" usa um recorte que não tem nada: tarefa manual não vai para e-mail externo. */
watch(estado, (e) => {
  if (e === 'semResultado') filtros.value = { periodo: '7d', origem: 'manual', responsaveis: ['externo'], categorias: [] }
  else if (filtros.value.origem === 'manual' && filtros.value.responsaveis[0] === 'externo') filtros.value = { ...FILTROS_PADRAO }
})

/** No MVP, os filtros e as opções que saíram voltam ao padrão: nada escondido pode recortar o número. */
watch(mvp, (ligado) => {
  if (!ligado) return
  filtros.value = { ...filtros.value, origem: 'todas', categorias: [] }
  modoResponsavel.value = 'designada'
  granularidade.value = granularidadePadrao(filtros.value.periodo)
})

/** Chave que muda a cada filtro: remonta os painéis com a entrada em cascata. */
const chaveDosFiltros = computed(() => JSON.stringify(filtros.value))

/* ---------------------------------- dado ---------------------------------- */

const base = computed<TarefaDoPainel[]>(() => estado.value === 'vazio' ? [] : todasAsTarefas)
const lista = computed(() => aplicarFiltros(base.value, filtros.value))
const intervalo = computed(() => intervaloDo(filtros.value.periodo))

const numeros = computed(() => numerosDoTopo(lista.value, intervalo.value))
const sla = computed(() => blocoSla(lista.value, intervalo.value))
const faixas = computed(() => faixasDePrazo(lista.value))
const proximas = computed(() => proximasAVencer(lista.value))
const baldes = computed(() => serie(lista.value, intervalo.value, granularidade.value))
const linhasDeStatus = computed(() => porStatus(lista.value, intervalo.value))
const prioridades = computed(() => porPrioridade(lista.value))
const linhasDeResponsavel = computed(() => porResponsavel(lista.value, intervalo.value, modoResponsavel.value, t.value.rotulos))
/** O gráfico de responsáveis lê sempre "Designada para": a fila de cada um. */
const linhasPorDesignada = computed(() => porResponsavel(lista.value, intervalo.value, 'designada', t.value.rotulos))
const detalheResponsaveis = ref(false)
const temposTarefa = computed(() => temposPorTarefa(lista.value, intervalo.value))
const itensDoFluxo = computed(() => estado.value === 'vazio' ? [] : flowItemsDoFiltro(filtros.value))
const execucoes = computed(() => estado.value === 'vazio' ? [] : execucoesDoFiltro(filtros.value))
const temposEtapa = computed(() => temposPorEtapa(itensDoFluxo.value, intervalo.value))
const temposFluxo = computed(() => temposPorFluxo(itensDoFluxo.value, execucoes.value, lista.value, intervalo.value))
const soManual = computed(() => filtros.value.origem === 'manual')

/** Nada no recorte: nem aberta, nem movimento no período. */
const semNada = computed(() => numeros.value.abertas === 0 && numeros.value.concluidas === 0 && numeros.value.criadas === 0)

/* ------------------------------ os números -------------------------------- */

type Tom = 'bom' | 'ruim' | 'neutro'

function variacaoRelativa(agora: number, antes: number | null, subirEhBom: boolean) {
  if (antes === null) return null
  const d = agora - antes
  const pct = antes ? d / antes : null
  const texto = `${d > 0 ? '+' : ''}${pct === null ? numero(d, t.value) : porcentagem(pct, t.value)}`
  const tom: Tom = d === 0 ? 'neutro' : (d > 0) === subirEhBom ? 'bom' : 'ruim'
  return { texto, ajuda: t.value.comparacao, tom, leitor: t.value.vsAnterior }
}

/** O "Como calculamos" de cada painel; o de tempos acompanha o nível escolhido. */
function regraDoPainel(id: IdDoPainel) {
  const r = t.value.regras
  if (id !== 'tempos') return r[id]
  // A dica de clique (descer de nível) mora aqui, e não num rodapé dentro do painel.
  const d = t.value.tempos.dica
  return { fluxo: `${r.tempoFluxo} ${d.fluxo}`, etapa: `${r.tempoEtapa} ${d.etapa}`, tarefa: `${r.tempoTarefa} ${d.tarefa}` }[nivelDoTempo.value]
}

const NUMEROS: IdDoPainel[] = ['abertas', 'vencidas', 'aVencer', 'concluidas', 'noPrazo', 'tempo']
const ehNumero = (id: string) => NUMEROS.includes(id as IdDoPainel)

const cartoes = computed(() => {
  const n = numeros.value
  const tt = t.value
  const pontos = n.noPrazoPct !== null && n.noPrazoPctAntes !== null ? Math.round((n.noPrazoPct - n.noPrazoPctAntes) * 100) : null
  const tempoAntes = n.tempoAntes?.media ?? null
  type Cartao = { valor: string, detalhe: string, cor: 'neutral' | 'error' | 'warning' | 'success', quando: string, variacao: ReturnType<typeof variacaoRelativa> }
  const c: Record<string, Cartao> = {
    abertas: {
      valor: numero(n.abertas, tt), cor: 'neutral', quando: tt.agora, variacao: null,
      detalhe: tt.kpi.abertasDetalhe(numero(n.porStatus.nao_iniciada, tt), numero(n.porStatus.em_andamento, tt), numero(n.porStatus.bloqueada, tt)),
    },
    vencidas: {
      valor: numero(n.vencidas, tt), cor: n.vencidas ? 'error' : 'neutral', quando: tt.agora, variacao: null,
      detalhe: tt.kpi.vencidasDetalhe(porcentagem(n.abertas ? n.vencidas / n.abertas : 0, tt)),
    },
    aVencer: {
      valor: numero(n.aVencer, tt), cor: n.aVencer ? 'warning' : 'neutral', quando: tt.agora, variacao: null,
      detalhe: tt.kpi.aVencerDetalhe(numero(n.aVencer24h, tt)),
    },
    concluidas: {
      valor: numero(n.concluidas, tt), cor: 'neutral', quando: tt.noPeriodo,
      detalhe: tt.kpi.concluidasDetalhe(numero(n.criadas, tt)),
      variacao: variacaoRelativa(n.concluidas, n.concluidasAntes, true),
    },
    noPrazo: {
      valor: porcentagem(n.noPrazoPct, tt),
      cor: n.noPrazoPct === null ? 'neutral' : n.noPrazoPct >= 0.85 ? 'success' : n.noPrazoPct >= 0.7 ? 'warning' : 'error',
      quando: tt.noPeriodo,
      detalhe: tt.kpi.noPrazoDetalhe(numero(n.noPrazo, tt), numero(n.comPrazo, tt)),
      variacao: pontos === null ? null : { texto: `${pontos > 0 ? '+' : ''}${tt.pontos(numero(pontos, tt))}`, ajuda: tt.comparacao, tom: pontos === 0 ? 'neutro' : pontos > 0 ? 'bom' : 'ruim', leitor: tt.vsAnterior },
    },
    tempo: {
      valor: duracao(n.tempo?.media ?? null, tt), cor: 'neutral', quando: tt.noPeriodo,
      detalhe: tt.kpi.tempoDetalhe(duracao(n.tempo?.mediana ?? null, tt)),
      variacao: n.tempo && tempoAntes !== null ? variacaoRelativa(Math.round(n.tempo.media / 60000), Math.round(tempoAntes / 60000), false) : null,
    },
  }
  return c
})

/* ------------------------------- a gaveta --------------------------------- */

const gaveta = ref({ aberta: false, titulo: '', tarefas: [] as TarefaDoPainel[], resumo: null as ResumoDoRecorte | null })

function abrir(
  titulo: string,
  filtro: (x: TarefaDoPainel) => boolean,
  ordenar: ((a: TarefaDoPainel, b: TarefaDoPainel) => number) | undefined,
  resumo: (achadas: TarefaDoPainel[]) => ResumoDoRecorte,
) {
  const achadas = lista.value.filter(filtro)
  if (ordenar) achadas.sort(ordenar)
  gaveta.value = { aberta: true, titulo, tarefas: achadas, resumo: resumo(achadas) }
}

const porPrazo = (a: TarefaDoPainel, b: TarefaDoPainel) => (a.prazo ?? Infinity) - (b.prazo ?? Infinity)
const maisLentas = (a: TarefaDoPainel, b: TarefaDoPainel) => (tempoDeConclusao(b) ?? 0) - (tempoDeConclusao(a) ?? 0)
const maisRecentes = (a: TarefaDoPainel, b: TarefaDoPainel) => b.concluidaEm! - a.concluidaEm!
const noPeriodo = (x: TarefaDoPainel) => x.status === 'concluida' && dentro(x.concluidaEm, intervalo.value)

/* ------------------- o resumo da quickview, por painel -------------------- */

/** Os filtros ligados, em texto, para o rodapé da quickview. */
const filtrosAtivos = computed(() => {
  const f = filtros.value
  const tt = t.value
  const l = [tt.filtros.periodos[f.periodo]]
  if (f.origem !== 'todas') l.push(tt.filtros.origens[f.origem])
  if (f.responsaveis.length) l.push(f.responsaveis.length === 1 ? nomeDoResponsavel(f.responsaveis[0]!, tt.rotulos) : tt.filtros.responsavelSelecionados(f.responsaveis.length))
  if (f.categorias.length) l.push(f.categorias.length === 1 ? f.categorias[0]! : tt.filtros.categoriaSelecionadas(f.categorias.length))
  return l
})

const ICONE_DA_SITUACAO: Record<Situacao, string> = {
  vencida: 'i-lucide-alarm-clock-off',
  a_vencer: 'i-lucide-alarm-clock',
  no_prazo: 'i-lucide-calendar-check',
  sem_prazo: 'i-lucide-calendar-off',
  concluida_no_prazo: 'i-lucide-circle-check',
  atrasada: 'i-lucide-clock-alert',
  concluida_sem_prazo: 'i-lucide-calendar-off',
}
const TOM_DA_SITUACAO: Partial<Record<Situacao, LinhaDoResumo['tom']>> = {
  vencida: 'error', atrasada: 'error', a_vencer: 'warning',
}
const ICONE_DA_FAIXA: Record<Faixa, string> = {
  vencida_7d_mais: 'i-lucide-alarm-clock-off',
  vencida_ate_7d: 'i-lucide-alarm-clock-off',
  ate_24h: 'i-lucide-alarm-clock',
  de_1_a_7d: 'i-lucide-alarm-clock',
  de_8_a_30d: 'i-lucide-calendar',
  mais_30d: 'i-lucide-calendar-range',
  sem_prazo: 'i-lucide-calendar-off',
}
const ICONE_DO_STATUS: Record<StatusVirtual, string> = {
  nao_iniciada: 'i-lucide-circle-dashed',
  em_andamento: 'i-lucide-circle-dot',
  bloqueada: 'i-lucide-circle-slash',
  concluida: 'i-lucide-circle-check',
  removida: 'i-lucide-circle-x',
}

function n(v: number) { return numero(v, t.value) }
function pct(parte: number, total: number) { return porcentagem(total ? parte / total : null, t.value) }

function porOrigem(achadas: TarefaDoPainel[]): LinhaDoResumo[] {
  const manuais = achadas.filter(x => x.origem === 'manual').length
  return [
    { icone: 'i-lucide-hand', rotulo: t.value.filtros.origens.manual, valor: n(manuais) },
    { icone: 'i-lucide-workflow', rotulo: t.value.filtros.origens.fluxo, valor: n(achadas.length - manuais) },
  ]
}

function selosDe(painel: IdDoPainel) {
  const agora = ['abertas', 'vencidas', 'aVencer', 'prazos', 'proximas', 'prioridade'].includes(painel)
  return agora ? [t.value.agora] : [t.value.noPeriodo, t.value.filtros.periodos[filtros.value.periodo]]
}

function resumoDoCartao(id: string, achadas: TarefaDoPainel[]): ResumoDoRecorte {
  const nn = numeros.value
  const tt = t.value
  const painel = id as IdDoPainel
  const base = { painel, titulo: tt.paineis[painel].titulo, selos: selosDe(painel) }
  const situ = (s: Situacao, valor: number, destaque = false): LinhaDoResumo =>
    ({ icone: ICONE_DA_SITUACAO[s], rotulo: tt.situacao[s], valor: n(valor), tom: valor ? TOM_DA_SITUACAO[s] : undefined, destaque })
  const faixa = (f: Faixa): LinhaDoResumo =>
    ({ icone: ICONE_DA_FAIXA[f], rotulo: tt.prazos.faixas[f], valor: n(faixas.value[f]) })
  switch (id) {
    case 'abertas': return { ...base, valor: n(nn.abertas), linhas: [
      { icone: ICONE_DO_STATUS.nao_iniciada, rotulo: tt.status.nao_iniciada, valor: n(nn.porStatus.nao_iniciada) },
      { icone: ICONE_DO_STATUS.em_andamento, rotulo: tt.status.em_andamento, valor: n(nn.porStatus.em_andamento) },
      { icone: ICONE_DO_STATUS.bloqueada, rotulo: tt.status.bloqueada, valor: n(nn.porStatus.bloqueada) },
      situ('vencida', sla.value.abertas.vencida), situ('a_vencer', sla.value.abertas.a_vencer),
      situ('no_prazo', sla.value.abertas.no_prazo), situ('sem_prazo', sla.value.abertas.sem_prazo),
      ...porOrigem(achadas),
    ] }
    case 'vencidas': return { ...base, valor: n(nn.vencidas), linhas: [
      { icone: 'i-lucide-percent', rotulo: tt.gaveta.linhas.dasAbertas, valor: pct(nn.vencidas, nn.abertas), tom: nn.vencidas ? 'error' : undefined },
      faixa('vencida_7d_mais'), faixa('vencida_ate_7d'), ...porOrigem(achadas),
    ] }
    case 'aVencer': return { ...base, valor: n(nn.aVencer), linhas: [
      { ...faixa('ate_24h'), tom: faixas.value.ate_24h ? 'warning' : undefined }, faixa('de_1_a_7d'), ...porOrigem(achadas),
    ] }
    case 'concluidas': return { ...base, valor: n(nn.concluidas), linhas: [
      { icone: 'i-lucide-history', rotulo: tt.gaveta.linhas.periodoAnterior, valor: nn.concluidasAntes === null ? '-' : n(nn.concluidasAntes) },
      { icone: 'i-lucide-circle-plus', rotulo: tt.gaveta.linhas.criadasNoPeriodo, valor: n(nn.criadas) },
      situ('concluida_no_prazo', sla.value.concluidas.concluida_no_prazo), situ('atrasada', sla.value.concluidas.atrasada),
      situ('concluida_sem_prazo', sla.value.concluidas.concluida_sem_prazo), ...porOrigem(achadas),
    ] }
    case 'noPrazo': return { ...base, valor: porcentagem(nn.noPrazoPct, tt), linhas: [
      situ('concluida_no_prazo', nn.noPrazo), situ('atrasada', sla.value.concluidas.atrasada, true),
      { icone: 'i-lucide-calendar-check', rotulo: tt.gaveta.linhas.comPrazo, valor: n(nn.comPrazo) },
      { icone: 'i-lucide-history', rotulo: tt.gaveta.linhas.periodoAnterior, valor: porcentagem(nn.noPrazoPctAntes, tt) },
    ] }
    default: return { ...base, valor: duracao(nn.tempo?.media ?? null, tt), linhas: [
      { icone: 'i-lucide-timer', rotulo: tt.tempos.mediana, valor: duracao(nn.tempo?.mediana ?? null, tt) },
      { icone: 'i-lucide-gauge', rotulo: tt.tempos.p90, valor: duracao(nn.tempo?.p90 ?? null, tt) },
      { icone: 'i-lucide-arrow-up-to-line', rotulo: tt.gaveta.linhas.maior, valor: duracao(nn.tempo?.maior ?? null, tt) },
      { icone: 'i-lucide-ruler', rotulo: tt.gaveta.linhas.medidas, valor: n(nn.tempo?.n ?? 0) },
      ...porOrigem(achadas),
    ] }
  }
}

function abrirCartao(id: string) {
  const r = t.value.recortes
  const resumo = (achadas: TarefaDoPainel[]) => resumoDoCartao(id, achadas)
  switch (id) {
    case 'abertas': return abrir(r.abertas, estaAberta, porPrazo, resumo)
    case 'vencidas': return abrir(r.vencidas, x => estaAberta(x) && situacao(x) === 'vencida', porPrazo, resumo)
    case 'aVencer': return abrir(r.aVencer, x => estaAberta(x) && situacao(x) === 'a_vencer', porPrazo, resumo)
    case 'concluidas': return abrir(r.concluidas, noPeriodo, maisRecentes, resumo)
    case 'noPrazo': return abrir(r.atrasadas, x => noPeriodo(x) && situacao(x) === 'atrasada', maisRecentes, resumo)
    case 'tempo': return abrir(r.tempo, noPeriodo, maisLentas, resumo)
  }
}

function abrirSituacao(s: Situacao, grupo: 'abertas' | 'concluidas') {
  const tt = t.value
  const nomeDoGrupo = grupo === 'abertas' ? tt.sla.abertasAgora : tt.sla.concluidasNoPeriodo
  const valores = grupo === 'abertas' ? sla.value.abertas : sla.value.concluidas
  const total = Object.values(valores).reduce((a, b) => a + b, 0)
  const resumo = (): ResumoDoRecorte => ({
    painel: 'sla',
    titulo: `${nomeDoGrupo} · ${tt.situacao[s]}`,
    valor: n((valores as Record<string, number>)[s] ?? 0),
    selos: grupo === 'abertas' ? [tt.agora] : [tt.noPeriodo, tt.filtros.periodos[filtros.value.periodo]],
    linhas: [
      { icone: 'i-lucide-list', rotulo: nomeDoGrupo, valor: n(total) },
      ...(Object.entries(valores) as [Situacao, number][]).map(([k, v]) => ({
        icone: ICONE_DA_SITUACAO[k], rotulo: tt.situacao[k], valor: `${n(v)} · ${pct(v, total)}`,
        tom: v ? TOM_DA_SITUACAO[k] : undefined, destaque: k === s,
      })),
    ],
  })
  if (grupo === 'abertas') abrir(`${nomeDoGrupo} · ${tt.situacao[s]}`, x => estaAberta(x) && situacao(x) === s, porPrazo, resumo)
  else abrir(`${nomeDoGrupo} · ${tt.situacao[s]}`, x => noPeriodo(x) && situacao(x) === s, maisRecentes, resumo)
}

function abrirFaixa(f: Faixa) {
  const tt = t.value
  abrir(tt.prazos.faixas[f], x => estaAberta(x) && faixaDe(x) === f, porPrazo, () => ({
    painel: 'prazos',
    titulo: tt.prazos.faixas[f],
    valor: n(faixas.value[f]),
    selos: [tt.agora],
    linhas: FAIXAS.map(k => ({
      icone: ICONE_DA_FAIXA[k], rotulo: tt.prazos.faixas[k], valor: n(faixas.value[k]), destaque: k === f,
      tom: (k === 'vencida_7d_mais' || k === 'vencida_ate_7d') && faixas.value[k] ? 'error' as const : undefined,
    })),
  }))
}

function abrirStatus(s: StatusVirtual) {
  const tt = t.value
  const linha = linhasDeStatus.value.find(l => l.status === s)!
  const resumo = (): ResumoDoRecorte => ({
    painel: 'contagemStatus',
    titulo: tt.status[s],
    valor: n(linha.total),
    selos: ['nao_iniciada', 'em_andamento', 'bloqueada'].includes(s) ? [tt.agora] : [tt.noPeriodo, tt.filtros.periodos[filtros.value.periodo]],
    linhas: [
      { icone: ICONE_DO_STATUS[s], rotulo: tt.statusOrigem[s], valor: n(linha.total), destaque: true },
      ...linha.partes.filter(p => p.situacao !== 'removida').map(p => ({
        icone: ICONE_DA_SITUACAO[p.situacao as Situacao], rotulo: tt.situacao[p.situacao], valor: `${n(p.n)} · ${pct(p.n, linha.total)}`,
        tom: p.n ? TOM_DA_SITUACAO[p.situacao as Situacao] : undefined,
      })),
    ],
  })
  if (s === 'concluida') abrir(tt.status[s], noPeriodo, maisRecentes, resumo)
  else if (s === 'removida') abrir(tt.status[s], x => x.status === 'removida' && dentro(x.criadaEm, intervalo.value), undefined, resumo)
  else abrir(tt.status[s], x => x.status === s, porPrazo, resumo)
}

/** O gráfico lê sempre "Designada para" e abre a fila no status do seletor. */
function abrirResponsavelDoGrafico(chave: string, filtro: FiltroDoResponsavel) {
  modoResponsavel.value = 'designada'
  abrirResponsavel(chave, filtro)
}

/** Da tabela, sem filtro, ou em "Todos": abertas e concluídas no período. Nos outros filtros, só aquela parte da barra. */
function abrirResponsavel(chave: string, filtro: FiltroDoResponsavel = 'todos') {
  const tt = t.value
  const linha = linhasDeResponsavel.value.find(l => l.chave === chave)
  const nome = linha?.nome ?? chave
  const nomeDoFiltro: Record<Exclude<FiltroDoResponsavel, 'todos'>, string> = {
    pendentes: tt.status.nao_iniciada, emAndamento: tt.status.em_andamento, vencidas: tt.situacao.vencida, concluidas: tt.status.concluida,
  }
  const titulo = filtro === 'todos' ? nome : `${nome} · ${nomeDoFiltro[filtro]}`
  const bate = (x: TarefaDoPainel) => modoResponsavel.value === 'designada'
    ? x.designados.some(d => d.chave === chave)
    : (x.executadaPor ? `p:${x.executadaPor}` : 'sem') === chave
  const noRecorte = (x: TarefaDoPainel) => {
    const parte = parteDoResponsavel(x, intervalo.value)
    return filtro === 'todos' ? parte !== null : parte === filtro
  }
  const doPeriodo = filtro === 'todos' || filtro === 'concluidas'
  const modo = modoResponsavel.value === 'designada' ? tt.resp.designada : tt.resp.executada
  const linhaDa = (parte: Exclude<FiltroDoResponsavel, 'todos'> | 'bloqueadas', icone: string, rotulo: string): LinhaDoResumo => ({
    icone, rotulo, valor: n(linha![parte]), destaque: filtro === parte,
    tom: parte === 'vencidas' && linha!.vencidas ? 'error' : undefined,
  })
  abrir(titulo, x => bate(x) && noRecorte(x), filtro === 'concluidas' ? maisRecentes : porPrazo, achadas => ({
    painel: 'responsaveis',
    titulo,
    valor: linha ? n(filtro === 'todos' ? achadas.length : linha[filtro]) : undefined,
    selos: doPeriodo ? [modo, tt.filtros.periodos[filtros.value.periodo]] : [modo, tt.agora],
    linhas: linha
      ? [
          { icone: linha.tipo === 'grupo' ? 'i-lucide-users' : 'i-lucide-user', rotulo: tt.gaveta.linhas.tipo, valor: tt.resp.tipo[linha.tipo] },
          linhaDa('vencidas', 'i-lucide-alarm-clock-off', tt.situacao.vencida),
          linhaDa('pendentes', ICONE_DO_STATUS.nao_iniciada, tt.status.nao_iniciada),
          linhaDa('emAndamento', ICONE_DO_STATUS.em_andamento, tt.status.em_andamento),
          linhaDa('bloqueadas', ICONE_DO_STATUS.bloqueada, tt.status.bloqueada),
          linhaDa('concluidas', ICONE_DO_STATUS.concluida, tt.status.concluida),
          { icone: 'i-lucide-target', rotulo: tt.resp.noPrazo, valor: porcentagem(linha.noPrazoPct, tt) },
          { icone: 'i-lucide-timer', rotulo: tt.resp.tempo, valor: duracao(linha.tempoMedio, tt) },
        ]
      : [],
  }))
}

const ICONE_DA_PRIORIDADE: Record<Prioridade, string> = {
  urgent: 'i-lucide-chevrons-up',
  high: 'i-lucide-chevron-up',
  normal: 'i-lucide-equal',
  low: 'i-lucide-chevron-down',
}

function abrirPrioridade(p: Prioridade) {
  const tt = t.value
  const b = prioridades.value
  const total = PRIORIDADES.reduce((s, k) => s + b.abertas[k], 0)
  abrir(tt.prioridades[p], x => estaAberta(x) && x.prioridade === p, porPrazo, (achadas) => {
    const situ = (s: Situacao): LinhaDoResumo => {
      const v = achadas.filter(x => situacao(x) === s).length
      return { icone: ICONE_DA_SITUACAO[s], rotulo: tt.situacao[s], valor: n(v), tom: v ? TOM_DA_SITUACAO[s] : undefined }
    }
    return {
      painel: 'prioridade',
      titulo: tt.prioridades[p],
      valor: n(b.abertas[p]),
      selos: [tt.agora],
      linhas: [
        ...PRIORIDADES.map(k => ({
          icone: ICONE_DA_PRIORIDADE[k], rotulo: tt.prioridades[k], valor: `${n(b.abertas[k])} · ${pct(b.abertas[k], total)}`, destaque: k === p,
        })),
        situ('vencida'), situ('a_vencer'), situ('no_prazo'), situ('sem_prazo'),
        { icone: 'i-lucide-circle-off', rotulo: tt.gaveta.linhas.semPrioridade, valor: n(b.semPrioridade) },
      ],
    }
  })
}

function abrirTempoDaTarefa(l: TempoDaTarefa) {
  const tt = t.value
  const manual = l.nome === '__avulsa'
  const nome = manual ? tt.tempos.avulsa : l.nome
  abrir(nome,
    x => noPeriodo(x) && (manual ? x.origem === 'manual' : x.origem === 'fluxo' && x.nome === l.nome && x.fluxo === l.fluxo),
    maisLentas,
    () => ({
      painel: 'tempos',
      titulo: nome,
      valor: duracao(l.estat.media, tt),
      selos: [tt.origemCurta[l.origem], tt.noPeriodo, tt.filtros.periodos[filtros.value.periodo]],
      linhas: [
        ...(l.fluxo ? [{ icone: 'i-lucide-workflow', rotulo: tt.gaveta.linhas.fluxo, valor: l.fluxo }] : []),
        { icone: 'i-lucide-ruler', rotulo: tt.tempos.n, valor: n(l.estat.n) },
        { icone: 'i-lucide-timer', rotulo: tt.tempos.media, valor: duracao(l.estat.media, tt), destaque: true },
        { icone: 'i-lucide-timer-reset', rotulo: tt.tempos.mediana, valor: duracao(l.estat.mediana, tt) },
        { icone: 'i-lucide-gauge', rotulo: tt.tempos.p90, valor: duracao(l.estat.p90, tt) },
        ...(l.espera !== null
          ? [{ icone: 'i-lucide-hourglass', rotulo: `${tt.tempos.espera} · ${tt.tempos.execucao}`, valor: `${duracao(l.espera, tt)} · ${duracao(l.execucao, tt)}` }]
          : []),
      ],
    }))
}

function abrirTarefa() {
  toast.add({ title: t.value.gaveta.maquete, icon: 'i-lucide-construction', color: 'neutral' })
}

/* --------------------------- o arranjo da pessoa --------------------------- */

const layout = ref<ItemDaGrade[]>(layoutPadrao())
const historico = ref<ItemDaGrade[][]>([])

onMounted(() => {
  const salvo = lerLayout()
  if (salvo) layout.value = salvo
})
watch(layout, l => gravarLayout(l), { deep: true })

const copia = (l: ItemDaGrade[]) => l.map(x => ({ ...x }))
const rotulos = computed(() => Object.fromEntries(PAINEIS.map(p => [p.id, t.value.paineis[p.id].titulo])))
const naTela = computed(() => layout.value.map(x => x.id as IdDoPainel))

function registrar(anterior: ItemDaGrade[]) {
  historico.value = [...historico.value.slice(-19), anterior]
}

function desfazer() {
  const ultimo = historico.value.pop()
  if (ultimo) layout.value = ultimo
}

/** Pelo "…" do painel avisa, com "Desfazer"; pelo botão Painéis, a caixa desmarcada já diz. */
function ocultar(id: IdDoPainel, avisar = true) {
  registrar(copia(layout.value))
  layout.value = layout.value.filter(x => x.id !== id)
  if (!avisar) return
  toast.add({
    title: t.value.grade.ocultado(t.value.paineis[id].titulo),
    icon: 'i-lucide-eye-off',
    color: 'neutral',
    actions: [{ label: t.value.grade.desfazer, icon: 'i-lucide-undo-2', color: 'neutral', variant: 'outline', onClick: desfazer }],
  })
}

const ORDEM_PADRAO = PAINEIS.map(p => p.id)

/** O painel volta para o lugar dele no arranjo padrão, entre os que estão na tela. */
function inserirNoLugar(lista: ItemDaGrade[], id: IdDoPainel) {
  const alvo = ORDEM_PADRAO.indexOf(id)
  const depois = lista.findIndex(x => ORDEM_PADRAO.indexOf(x.id as IdDoPainel) > alvo)
  lista.splice(depois < 0 ? lista.length : depois, 0, { id, ...DEFINICAO[id].padrao })
}

function mostrar(id: IdDoPainel) {
  registrar(copia(layout.value))
  const lista = copia(layout.value)
  inserirNoLugar(lista, id)
  layout.value = lista
}

function tamanhoPadrao(id: IdDoPainel) {
  registrar(copia(layout.value))
  layout.value = layout.value.map(x => x.id === id ? { ...x, ...DEFINICAO[id].padrao } : x)
}

function mostrarTodos() {
  const faltam = PAINEIS.filter(p => !naTela.value.includes(p.id))
  if (!faltam.length) return
  registrar(copia(layout.value))
  const lista = copia(layout.value)
  for (const p of faltam) inserirNoLugar(lista, p.id)
  layout.value = lista
}

function restaurarPadrao() {
  registrar(copia(layout.value))
  layout.value = layoutPadrao()
  toast.add({ title: t.value.grade.restaurado, icon: 'i-lucide-rotate-ccw', color: 'neutral' })
}

/**
 * O botão "Painéis": o editor de visibilidade, no desenho do "Colunas" das
 * tabelas (do admin e do `customers.vue` do template). Uma caixa por painel,
 * agrupada; a caixa não fecha o menu, para marcar vários de uma vez.
 */
const menuDePaineis = computed<DropdownMenuItem[][]>(() => {
  const tt = t.value
  return [
    [{ type: 'label', label: `${tt.grade.soParaVoce} · ${tt.grade.naTela(naTela.value.length, PAINEIS.length)}` }],
    ...GRUPOS.map(g => [
      { type: 'label' as const, label: tt.grade.grupos[g] },
      ...PAINEIS.filter(p => p.grupo === g).map(p => ({
        label: tt.paineis[p.id].titulo,
        icon: p.icone,
        type: 'checkbox' as const,
        checked: naTela.value.includes(p.id),
        onUpdateChecked(marcado: boolean) {
          if (marcado) mostrar(p.id)
          else ocultar(p.id, false)
        },
        onSelect(e?: Event) {
          e?.preventDefault()
        },
      })),
    ]),
    [
      { label: tt.grade.mostrarTodos, icon: 'i-lucide-eye', disabled: naTela.value.length === PAINEIS.length, onSelect: mostrarTodos },
      { label: tt.grade.restaurarPadrao, icon: 'i-lucide-rotate-ccw', onSelect: restaurarPadrao },
    ],
  ]
})

defineShortcuts({
  meta_z: {
    usingInput: false,
    handler: () => desfazer(),
  },
})

const textosDaGrade = computed(() => ({
  redimensionar: t.value.grade.redimensionar,
  movido: t.value.grade.movido,
  tamanho: t.value.grade.tamanho,
}))

/* ------------------------------- atualizar -------------------------------- */

const atualizando = ref(false)
function atualizar() {
  atualizando.value = true
  setTimeout(() => { atualizando.value = false }, 900)
}

const carregando = computed(() => estado.value === 'carregando' || atualizando.value)
</script>

<template>
  <CascaDoEnspace :t="t" :workspace="t.workspace" slug="operacoes">
    <div class="relative min-h-0 flex-1 overflow-y-auto pb-28">
      <!-- Cabeçalho da tela -->
      <header class="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-3 px-6 pb-3 pt-5">
        <div class="space-y-0.5">
          <h1 class="text-xl font-semibold text-highlighted">
            {{ t.titulo }}
          </h1>
          <p class="text-sm text-muted">
            {{ t.subtitulo }}
          </p>
        </div>
        <div v-if="estado !== 'erro' && estado !== 'semPermissao'" class="flex items-center gap-2">
          <span class="text-xs text-muted">{{ t.atualizadoAs(hora(AGORA, t)) }}</span>
          <UButton
            :label="t.atualizar"
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="ghost"
            size="sm"
            :loading="atualizando"
            @click="atualizar"
          />
        </div>
      </header>

      <div class="mx-auto max-w-[1440px] px-6">
        <!-- Sem permissão e erro tomam a tela inteira -->
        <UEmpty
          v-if="estado === 'semPermissao'"
          icon="i-lucide-lock"
          :title="t.estados.semPermissaoTitulo"
          :description="t.estados.semPermissaoTexto"
          variant="outline"
          class="animate-[entrada_0.3s_ease-out_both] py-16"
        />
        <UEmpty
          v-else-if="estado === 'erro'"
          icon="i-lucide-cloud-off"
          :title="t.estados.erroTitulo"
          :description="t.estados.erroTexto"
          variant="outline"
          :actions="[{ label: t.estados.tentarDeNovo, icon: 'i-lucide-refresh-cw', color: 'primary', onClick: () => (estado = 'cheio') }]"
          class="animate-[entrada_0.3s_ease-out_both] py-16"
        />
      </div>

      <template v-if="estado !== 'semPermissao' && estado !== 'erro'">
        <!-- A barra de filtros e de arranjo, como o UDashboardToolbar do template -->
        <div class="sticky top-0 z-30 border-y border-default bg-default/90 backdrop-blur">
          <div class="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 px-6 py-1.5">
            <BarraDeFiltros v-model="filtros" :t="t" :simples="mvp" />

            <!-- O editor de visibilidade, como o "Colunas" das tabelas do admin -->
            <UDropdownMenu v-if="!mvp" :items="menuDePaineis" :content="{ align: 'end' }">
              <UButton
                :label="t.grade.paineis"
                icon="i-lucide-layout-dashboard"
                color="neutral"
                variant="ghost"
                trailing-icon="i-lucide-chevron-down"
                class="data-[state=open]:bg-elevated"
                :disabled="estado === 'vazio'"
              />
            </UDropdownMenu>
          </div>
        </div>

        <div class="mx-auto max-w-[1440px] space-y-4 px-6 py-5">
          <RecorteMvp v-if="mvp" />

          <!-- Carregando: o esqueleto tem o desenho do arranjo da pessoa -->
          <UxGradeDePaineis
            v-if="carregando"
            :model-value="mvp ? LAYOUT_MVP : layout"
            :editavel="false"
            :limites="LIMITES"
            :rotulos="rotulos"
            :textos="textosDaGrade"
          >
            <template #default>
              <USkeleton class="h-full rounded-lg" />
            </template>
          </UxGradeDePaineis>

          <UEmpty
            v-else-if="estado === 'vazio'"
            icon="i-lucide-list-checks"
            :title="t.estados.vazioTitulo"
            :description="t.estados.vazioTexto"
            variant="outline"
            class="animate-[entrada_0.3s_ease-out_both] py-16"
          />

          <UEmpty
            v-else-if="semNada"
            icon="i-lucide-filter-x"
            :title="t.estados.semResultadoTitulo"
            :description="t.estados.semResultadoTexto"
            variant="outline"
            :actions="[{ label: t.filtros.limpar, icon: 'i-lucide-x', color: 'neutral', variant: 'outline', onClick: () => { filtros = { ...FILTROS_PADRAO }; estado = 'cheio' } }]"
            class="animate-[entrada_0.3s_ease-out_both] py-16"
          />

          <UEmpty
            v-else-if="!mvp && !layout.length"
            icon="i-lucide-panels-top-left"
            :title="t.grade.vazioTitulo"
            :description="t.grade.vazioTexto"
            variant="outline"
            :actions="[{ label: t.grade.mostrarTodos, icon: 'i-lucide-eye', color: 'primary', onClick: mostrarTodos }]"
            class="animate-[entrada_0.3s_ease-out_both] py-16"
          />

          <UxGradeDePaineis
            v-else
            :key="`${chaveDosFiltros}-${mvp}`"
            :model-value="mvp ? LAYOUT_MVP : layout"
            :editavel="!mvp"
            :limites="LIMITES"
            :rotulos="rotulos"
            :textos="textosDaGrade"
            @update:model-value="(v: ItemDaGrade[]) => { if (!mvp) layout = v }"
            @alterado="registrar"
          >
            <template #default="{ item }">
              <Painel
                class="animate-[entrada_0.4s_ease-out_both]"
                :style="{ animationDelay: `${Math.min(layout.findIndex(x => x.id === item.id), 10) * 35}ms` }"
                :t="t"
                :titulo="t.paineis[item.id as IdDoPainel].titulo"
                :regra="regraDoPainel(item.id as IdDoPainel)"
                :compacto="ehNumero(item.id)"
                :icone="DEFINICAO[item.id as IdDoPainel].icone"
                :fixo="mvp"
                @ocultar="ocultar(item.id as IdDoPainel)"
                @tamanho-padrao="tamanhoPadrao(item.id as IdDoPainel)"
              >
                <template v-if="item.id === 'responsaveis'" #acoes>
                  <UButton
                    :label="t.resp.verTabela"
                    icon="i-lucide-table"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    @click="detalheResponsaveis = true"
                  />
                </template>
                <CartaoNumero
                  v-if="ehNumero(item.id)"
                  :valor="cartoes[item.id]!.valor"
                  :cor="cartoes[item.id]!.cor"
                  :rotulo="t.paineis[item.id as IdDoPainel].titulo"
                  @abrir="abrirCartao(item.id)"
                />
                <BlocoSla v-else-if="item.id === 'sla'" :t="t" :sla="sla" @abrir="abrirSituacao" />
                <BlocoPrazos v-else-if="item.id === 'prazos'" :t="t" :faixas="faixas" @abrir="abrirFaixa" />
                <ListaProximas v-else-if="item.id === 'proximas'" :t="t" :tarefas="proximas" @abrir="abrirTarefa" />
                <GraficoSerie v-else-if="item.id === 'serie'" v-model:granularidade="granularidade" :t="t" :baldes="baldes" :sem-granularidade="mvp" />
                <GraficoResponsaveis v-else-if="item.id === 'responsaveis'" :t="t" :linhas="linhasPorDesignada" @abrir="abrirResponsavelDoGrafico" />
                <GraficoStatus v-else-if="item.id === 'contagemStatus'" :t="t" :linhas="linhasDeStatus" @abrir="abrirStatus" />
                <GraficoPrioridade v-else-if="item.id === 'prioridade'" :t="t" :bloco="prioridades" @abrir="abrirPrioridade" />
                <BlocoTempos
                  v-else-if="item.id === 'tempos'"
                  v-model:nivel="nivelDoTempo"
                  :t="t"
                  :tarefas="temposTarefa"
                  :etapas="temposEtapa"
                  :fluxos="temposFluxo"
                  :so-manual="soManual"
                  @abrir="abrirTempoDaTarefa"
                />
              </Painel>
            </template>
          </UxGradeDePaineis>
        </div>
      </template>
    </div>

    <DetalheResponsaveis
      v-model:open="detalheResponsaveis"
      v-model:modo="modoResponsavel"
      :t="t"
      :linhas="linhasDeResponsavel"
      @abrir="(chave: string) => { detalheResponsaveis = false; abrirResponsavel(chave) }"
    />
    <GavetaDeTarefas
      v-model:open="gaveta.aberta"
      :t="t"
      :titulo="gaveta.titulo"
      :tarefas="gaveta.tarefas"
      :resumo="gaveta.resumo"
      :filtros="filtrosAtivos"
      :simples="mvp"
    />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
          Protótipo · estado
        </span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado === e.valor ? 'primary' : 'neutral'"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="estado = e.valor"
        />

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <UButton
          label="MVP"
          icon="i-lucide-scissors"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="mvp ? 'primary' : 'neutral'"
          :variant="mvp ? 'solid' : 'subtle'"
          :aria-pressed="mvp"
          @click="mvp = !mvp"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/painel-de-tarefas"
          />
        </span>
      </div>
    </div>
  </CascaDoEnspace>
</template>
