<script setup lang="ts">
/**
 * Dashboards configuráveis, rodada 2.
 *
 * O que a tela prova (detalhe no DECISOES.md, "Rodada 2"):
 * 1. o ENSPACE começa sem dashboard: o estado inicial tem 2 opções para o dev,
 *    A com o BENI lendo as categorias e B sem IA;
 * 2. o dashboard recém-criado começa vazio, com "Novo painel" e "Pedir ao BENI";
 * 3. o construtor é um modal: formulário à esquerda, prévia à direita, na ordem
 *    fonte > visualização > campos > filtros > período > ordem > título;
 * 4. o painel de número é o Cartão do painel de tarefas: o número é o clique;
 * 5. os painéis se arrastam e se redimensionam sem modo de edição;
 * 6. filtro de campo na barra (vale nos painéis da categoria do campo), filtro em
 *    cada painel e visões salvas, pessoais ou do workspace.
 *
 * O dado é o `mocks.ts`; nada sai do navegador.
 */
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { ConfigDoPainel, Contexto, FiltroDeCampo, Grupo, Periodo } from './agregacao'
import { agregar, campoDe, filtroVazio, intervalo, painelEmBranco, serieDoCartao } from './agregacao'
import type { Dashboard, Visao } from './dashboards'
import { DASHBOARDS } from './dashboards'
import { useDescricaoDeFiltro } from './filtros'
import { categoriaPorSlug } from './mocks'
import { textos } from './textos'
import BarraDoDashboard from './_BarraDoDashboard.vue'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import ConstruirComBeni from './_ConstruirComBeni.vue'
import Construtor from './_Construtor.vue'
import Detalhamento from './_Detalhamento.vue'
import EstadoInicial from './_EstadoInicial.vue'
import FormDashboard from './_FormDashboard.vue'
import GradeDoDashboard from './_GradeDoDashboard.vue'
import PedirAoBeni from './_PedirAoBeni.vue'
import SalvarVisao from './_SalvarVisao.vue'

definePageMeta({
  titulo: 'Dashboards configuráveis',
  descricao: 'Dashboards dentro de Relatórios: estado inicial com o BENI ou sem IA, construtor de painel em modal com prévia, cartões clicáveis, painéis que se arrastam sem modo de edição, filtro de campo, filtro por painel e visões salvas.',
  status: 'em-revisao',
  atualizado: '2026-11-27',
  tela: 'Dashboards',
})

const t = useTextos(textos)
const toast = useToast()
const { descrever } = useDescricaoDeFiltro(t)

/* ------------------------------------------------------------------ *
 * ANDAIME: os seletores de cenário, estado, opção e papel não são     *
 * proposta. Existem para percorrer o que a tela precisa ter.          *
 * ------------------------------------------------------------------ */
type Cenario = 'primeiroAcesso' | 'semCategorias' | 'montado'
const cenario = ref<Cenario>('primeiroAcesso')
const cenarios: { valor: Cenario, rotulo: string }[] = [
  { valor: 'primeiroAcesso', rotulo: 'Primeiro acesso' },
  { valor: 'semCategorias', rotulo: 'Workspace sem categorias' },
  { valor: 'montado', rotulo: 'Dashboard montado' },
]
type Estado = 'pronto' | 'carregando' | 'semDados' | 'erro' | 'semAcesso'
const estado = ref<Estado>('pronto')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'pronto', rotulo: 'Pronto' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'semDados', rotulo: 'Período sem itens' },
  { valor: 'erro', rotulo: 'Erro num painel' },
  { valor: 'semAcesso', rotulo: 'Sem acesso' },
]
const opcao = ref<'A' | 'B'>('A')
type Papel = 'admin' | 'membro' | 'leitor'
const papel = ref<Papel>('admin')
const papeis: { valor: Papel, rotulo: string }[] = [
  { valor: 'admin', rotulo: 'Owner ou full' },
  { valor: 'membro', rotulo: 'Membro' },
  { valor: 'leitor', rotulo: 'Só lê' },
]

/* ------------------------------- dashboards -------------------------------- */

/** O ENSPACE começa sem dashboard: nenhum vem pronto (feedback da rodada 1). */
const dashboards = ref<Dashboard[]>([])
const atualId = ref('')
const atual = computed<Dashboard | undefined>(() => dashboards.value.find(d => d.id === atualId.value) ?? dashboards.value[0])
const somenteLeitura = computed(() => papel.value === 'leitor')
const podeSalvarParaTodos = computed(() => papel.value === 'admin')
const comBeni = computed(() => opcao.value === 'A')
/** Muda a cada troca de cenário, para a grade montar de novo. */
const versao = ref(0)

watch(cenario, (c) => {
  dashboards.value = c === 'montado' ? structuredClone(DASHBOARDS) : []
  atualId.value = dashboards.value[0]?.id ?? ''
  versao.value++
}, { immediate: true })

/* ------------------------- período, filtros e visões ----------------------- */

const periodo = ref<Periodo>('year')
const filtros = ref<FiltroDeCampo[]>([])
/** Filtros só da visão, por painel: o que se põe pelo ícone de filtro do painel. */
const filtrosDaVisao = ref<Record<string, FiltroDeCampo[]>>({})
const visaoAtualId = ref<string | null>(null)
const visaoAtual = computed(() => atual.value?.visoes.find(v => v.id === visaoAtualId.value) ?? null)

function zerarRecorte() {
  periodo.value = 'year'
  filtros.value = []
  filtrosDaVisao.value = {}
  visaoAtualId.value = null
}
watch(atualId, zerarRecorte)
watch(cenario, zerarRecorte)

const cheios = (l: FiltroDeCampo[]) => l.filter(f => !filtroVazio(f))
const cheiosPorPainel = (r: Record<string, FiltroDeCampo[]>) =>
  Object.fromEntries(Object.entries(r).map(([id, l]) => [id, cheios(l)]).filter(([, l]) => (l as FiltroDeCampo[]).length))
const assinatura = (p: Periodo, f: FiltroDeCampo[], fp: Record<string, FiltroDeCampo[]>) =>
  JSON.stringify([p, cheios(f), cheiosPorPainel(fp)])

const alterada = computed(() => !!visaoAtual.value
  && assinatura(periodo.value, filtros.value, filtrosDaVisao.value)
  !== assinatura(visaoAtual.value.periodo, visaoAtual.value.filtros, visaoAtual.value.filtrosDosPaineis))

function aplicarVisao(v: Visao | null) {
  if (!v) { zerarRecorte(); return }
  periodo.value = structuredClone(toRaw(v.periodo))
  filtros.value = structuredClone(toRaw(v.filtros))
  filtrosDaVisao.value = structuredClone(toRaw(v.filtrosDosPaineis))
  visaoAtualId.value = v.id
}

const salvarVisaoAberto = ref(false)
function salvarNovaVisao(nome: string, escopo: Visao['escopo']) {
  const v: Visao = {
    id: `v${Date.now()}`,
    nome,
    escopo,
    periodo: structuredClone(toRaw(periodo.value)),
    filtros: structuredClone(cheios(toRaw(filtros.value))),
    filtrosDosPaineis: structuredClone(cheiosPorPainel(toRaw(filtrosDaVisao.value))),
  }
  atual.value!.visoes.push(v)
  visaoAtualId.value = v.id
  toast.add({ title: t.value.visoes.salva(nome), icon: escopo === 'workspace' ? 'i-lucide-users' : 'i-lucide-bookmark', color: 'success' })
}
function atualizarVisao() {
  const v = visaoAtual.value
  if (!v) return
  v.periodo = structuredClone(toRaw(periodo.value))
  v.filtros = structuredClone(cheios(toRaw(filtros.value)))
  v.filtrosDosPaineis = structuredClone(cheiosPorPainel(toRaw(filtrosDaVisao.value)))
  toast.add({ title: t.value.visoes.atualizada(v.nome), icon: 'i-lucide-save', color: 'success' })
}
function excluirVisao(v: Visao) {
  const d = atual.value!
  d.visoes = d.visoes.filter(x => x.id !== v.id)
  if (visaoAtualId.value === v.id) visaoAtualId.value = null
  toast.add({ title: t.value.visoes.excluida(v.nome), icon: 'i-lucide-trash-2' })
}
function limparFiltros() {
  filtros.value = []
  filtrosDaVisao.value = {}
}

/** O estado "Período sem itens" usa uma janela antiga: só os painéis de todo o período mostram número. */
const periodoEfetivo = computed<Periodo>(() => estado.value === 'semDados'
  ? { from: new Date(2021, 0, 1), to: new Date(2021, 0, 31) }
  : periodo.value)

const categoriasDoDashboard = computed(() => [...new Set(atual.value?.paineis.map(p => p.categoria) ?? [])])

const contexto = computed<Contexto>(() => ({
  periodo: periodoEfetivo.value,
  filtros: filtros.value,
  rotulos: { ...t.value.rotulos, locale: t.value.locale },
}))
/** Cada painel soma os filtros da visão que são só dele. */
const contextoDe = (p: ConfigDoPainel): Contexto => ({ ...contexto.value, filtros: [...filtros.value, ...(filtrosDaVisao.value[p.id] ?? [])] })

const dataCurta = (d: Date) => d.toLocaleDateString(t.value.locale, { day: '2-digit', month: 'short', year: 'numeric' })
const rotuloDoPeriodo = computed(() => {
  const p = periodoEfetivo.value
  if (typeof p === 'string') return t.value.periodos[p]
  const { from, to } = intervalo(p)
  return t.value.periodoPersonalizado(dataCurta(from), dataCurta(to))
})

/* ---------------------------------- dado ----------------------------------- */

/** Mudar período ou filtro recalcula: um instante de carregamento em cada painel. */
const recalculando = ref(false)
let espera: ReturnType<typeof setTimeout> | undefined
watch(() => JSON.stringify([periodoEfetivo.value, filtros.value, filtrosDaVisao.value, atualId.value]), () => {
  recalculando.value = true
  clearTimeout(espera)
  espera = setTimeout(() => { recalculando.value = false }, 350)
})

const paineis = computed(() => atual.value?.paineis ?? [])
const resultados = computed(() => Object.fromEntries(paineis.value.map(p => [p.id, agregar(p, contextoDe(p))])))
const series = computed(() => Object.fromEntries(paineis.value.map(p => [p.id, p.visualizacao === 'numero' ? serieDoCartao(p, contextoDe(p)) : undefined])))

/** O estado "Erro num painel": 1 painel falha, os outros seguem. */
const painelComErro = ref<string | null>(null)
watch([estado, atualId], ([e]) => {
  const lista = paineis.value
  painelComErro.value = e === 'erro' ? (lista[4]?.id ?? lista[0]?.id ?? null) : null
})

function estadoDe(id: string): 'pronto' | 'carregando' | 'erro' {
  if (estado.value === 'carregando' || recalculando.value) return 'carregando'
  if (painelComErro.value === id) return 'erro'
  return 'pronto'
}

function tituloDe(p: ConfigDoPainel) {
  if (p.titulo.trim()) return p.titulo.trim()
  const cat = categoriaPorSlug.get(p.categoria)?.name ?? ''
  return t.value.frase(
    p.funcao,
    cat,
    p.funcao === 'contagem' ? undefined : campoDe(p.categoria, p.medida)?.name,
    p.visualizacao === 'numero' ? undefined : campoDe(p.categoria, p.agruparPor)?.name,
    p.visualizacao === 'numero' ? undefined : campoDe(p.categoria, p.quebrarPor)?.name,
  )
}

const horaDaCarga = ref(new Date(2026, 10, 27, 12, 0))
const textoDeAtualizacao = computed(() => {
  if (!atual.value) return ''
  const h = horaDaCarga.value.toLocaleTimeString(t.value.locale, { hour: '2-digit', minute: '2-digit' })
  return atual.value.recarga ? t.value.pagina.atualizado(h, atual.value.recarga) : t.value.pagina.atualizadoSemRecarga(h)
})

/** O que a visão vai guardar, em frases, para o modal de salvar. */
const resumoDaVisao = computed(() => {
  const varias = categoriasDoDashboard.value.length > 1
  const prefixo = (f: FiltroDeCampo) => varias ? `${categoriaPorSlug.get(f.categoria)?.name} · ` : ''
  const linhas = [rotuloDoPeriodo.value, ...cheios(filtros.value).map(f => `${prefixo(f)}${descrever(f)}`)]
  for (const p of paineis.value) {
    const l = cheios(filtrosDaVisao.value[p.id] ?? [])
    if (l.length) linhas.push(t.value.visoes.filtrosDoPainel(tituloDe(p), l.map(descrever).join('; ')))
  }
  return linhas
})

/* --------------------------------- menus ----------------------------------- */

const menuDosDashboards = computed<DropdownMenuItem[][]>(() => {
  const criar: DropdownMenuItem[] = [{ label: t.value.pagina.novoDashboard, icon: 'i-lucide-plus', onSelect: () => abrirForm(false) }]
  if (comBeni.value) criar.push({ label: t.value.inicial.comBeni, icon: 'i-lucide-sparkles', onSelect: () => { beniAberto.value = true } })
  return [
    dashboards.value.map(d => ({
      label: d.nome,
      description: t.value.pagina.paineis(d.paineis.length),
      icon: d.id === atual.value?.id ? 'i-lucide-check' : 'i-lucide-chart-column',
      onSelect: () => { atualId.value = d.id },
    })),
    ...(somenteLeitura.value ? [] : [criar]),
  ]
})

const atualizando = ref(false)
function atualizarDados() {
  atualizando.value = true
  recalculando.value = true
  setTimeout(() => {
    atualizando.value = false
    recalculando.value = false
    horaDaCarga.value = new Date(horaDaCarga.value.getTime() + 60_000 * 3)
    toast.add({ title: t.value.pagina.dadosAtualizados, icon: 'i-lucide-refresh-cw', color: 'success' })
  }, 700)
}

const maisAcoes = computed<DropdownMenuItem[][]>(() => [
  [
    ...(comBeni.value ? [{ label: t.value.pagina.pedirAoBeni, icon: 'i-lucide-sparkles', onSelect: () => { pedirAberto.value = true } }] : []),
    { label: t.value.pagina.editarDashboard, icon: 'i-lucide-pencil', onSelect: () => abrirForm(true) },
    { label: t.value.pagina.atualizarDados, icon: 'i-lucide-refresh-cw', onSelect: atualizarDados },
    { label: t.value.pagina.duplicarDashboard, icon: 'i-lucide-copy', onSelect: duplicarDashboard },
  ],
  [{ label: t.value.pagina.excluirDashboard, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: excluirDashboard }],
])

/* ------------------------------ dashboard: form ---------------------------- */

const formAberto = ref(false)
const formEditando = ref(false)
function abrirForm(editar: boolean) {
  formEditando.value = editar
  formAberto.value = true
}
function salvarDashboard(dados: Pick<Dashboard, 'nome' | 'descricao' | 'grupos' | 'recarga'>) {
  if (formEditando.value && atual.value) {
    Object.assign(atual.value, dados)
    toast.add({ title: t.value.formDashboard.salvo, icon: 'i-lucide-check', color: 'success' })
    return
  }
  const id = `d${Date.now()}`
  dashboards.value.push({ id, paineis: [], visoes: [], ...dados })
  atualId.value = id
  toast.add({ title: t.value.formDashboard.criado, icon: 'i-lucide-check', color: 'success' })
}
function duplicarDashboard() {
  const id = `d${Date.now()}`
  const copia = structuredClone(toRaw(atual.value!))
  dashboards.value.push({ ...copia, id, nome: `${copia.nome} 2` })
  atualId.value = id
  toast.add({ title: t.value.pagina.duplicado, icon: 'i-lucide-copy', color: 'success' })
}
function excluirDashboard() {
  const d = atual.value!
  dashboards.value = dashboards.value.filter(x => x.id !== d.id)
  atualId.value = dashboards.value[0]?.id ?? ''
  toast.add({ title: t.value.pagina.excluido, description: d.nome, icon: 'i-lucide-trash-2' })
}

/* ------------------------------- o BENI ------------------------------------ */

const beniAberto = ref(false)
const pedirAberto = ref(false)

function criarComBeni(nome: string, novos: ConfigDoPainel[]) {
  const id = `d${Date.now()}`
  dashboards.value.push({ id, nome, grupos: [], recarga: 5, paineis: novos, visoes: [] })
  atualId.value = id
  toast.add({ title: t.value.beni.criado, description: t.value.beni.criadoDescricao, icon: 'i-lucide-sparkles', color: 'success' })
}
function adicionarDoBeni(novos: ConfigDoPainel[]) {
  atual.value!.paineis.push(...novos)
  toast.add({ title: t.value.pedir.adicionados(novos.length), icon: 'i-lucide-sparkles', color: 'success' })
}
function criarCategoria() {
  toast.add({ title: t.value.inicial.criarCategoria, description: t.value.inicial.criarCategoriaAviso, icon: 'i-lucide-info' })
}

/* -------------------------------- painéis ---------------------------------- */

const construtorAberto = ref(false)
const painelEmEdicao = ref<ConfigDoPainel | undefined>()
const baseDoNovo = ref<ConfigDoPainel>(painelEmBranco('novo'))
const ultimaCategoria = computed(() => paineis.value[paineis.value.length - 1]?.categoria)

function novoPainel() {
  painelEmEdicao.value = undefined
  baseDoNovo.value = painelEmBranco(`p${Date.now()}`, ultimaCategoria.value)
  construtorAberto.value = true
}
function editarPainel(cfg: ConfigDoPainel) {
  painelEmEdicao.value = cfg
  construtorAberto.value = true
}
function salvarPainel(cfg: ConfigDoPainel, novo: boolean) {
  const lista = atual.value!.paineis
  if (novo) lista.push(cfg)
  else lista.splice(lista.findIndex(p => p.id === cfg.id), 1, cfg)
  toast.add({ title: novo ? t.value.construtor.adicionado : t.value.construtor.salvo, icon: 'i-lucide-check', color: 'success' })
}
function duplicarPainel(cfg: ConfigDoPainel) {
  const lista = atual.value!.paineis
  const { x: _x, y: _y, ...resto } = structuredClone(toRaw(cfg))
  lista.splice(lista.findIndex(p => p.id === cfg.id) + 1, 0, { ...resto, id: `p${Date.now()}` })
  toast.add({ title: t.value.painel.duplicado, icon: 'i-lucide-copy', color: 'success' })
}
function excluirPainel(cfg: ConfigDoPainel) {
  const lista = atual.value!.paineis
  const i = lista.findIndex(p => p.id === cfg.id)
  lista.splice(i, 1)
  toast.add({
    title: t.value.painel.excluido,
    description: tituloDe(cfg),
    icon: 'i-lucide-trash-2',
    actions: [{
      label: t.value.painel.desfazer,
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        lista.splice(i, 0, cfg)
        toast.add({ title: t.value.painel.restaurado, icon: 'i-lucide-rotate-ccw', color: 'success' })
      },
    }],
  })
}
function baixarCsv() {
  toast.add({ title: t.value.painel.csvBaixado, icon: 'i-lucide-download', color: 'success' })
}
function tentarDeNovo() {
  painelComErro.value = null
}
function mudarFiltrosDaVisao(id: string, f: FiltroDeCampo[]) {
  filtrosDaVisao.value = { ...filtrosDaVisao.value, [id]: f }
}

/** A dica de arrastar aparece até a pessoa fechar. */
const dicaFechada = ref(false)

/* ------------------------------ detalhamento ------------------------------- */

const detalhe = ref<{ aberto: boolean, cfg?: ConfigDoPainel, ids: number[], recorte: string[] }>({ aberto: false, ids: [], recorte: [] })

function detalhar(cfg: ConfigDoPainel, grupo?: Grupo, parte?: string) {
  const r = resultados.value[cfg.id]
  if (!r) return
  const recorte: string[] = []
  const dim = campoDe(cfg.categoria, cfg.agruparPor)
  const quebra = campoDe(cfg.categoria, cfg.quebrarPor)
  if (grupo && dim) recorte.push(`${dim.name}: ${grupo.rotulo}`)
  if (parte !== undefined && quebra) recorte.push(`${quebra.name}: ${r.quebras.find(q => q.chave === parte)?.rotulo ?? parte}`)
  recorte.push(cfg.periodo === 'todo' ? t.value.painel.todoPeriodo : t.value.detalhe.periodo(rotuloDoPeriodo.value))
  const daCategoria = (l: FiltroDeCampo[]) => cheios(l).filter(f => f.categoria === cfg.categoria)
  for (const f of [...daCategoria(cfg.condicoes), ...daCategoria(filtros.value), ...daCategoria(filtrosDaVisao.value[cfg.id] ?? [])]) {
    recorte.push(descrever(f))
  }
  const ids = grupo ? (parte !== undefined ? grupo.idsDaParte[parte] ?? [] : grupo.ids) : r.ids
  detalhe.value = { aberto: true, cfg, ids, recorte }
}
</script>

<template>
  <CascaDoEnspace
    :t="t"
    :workspace="t.workspace"
    slug="teste-ux"
    :trilha="atual ? [t.trilhaRelatorios, t.trilhaDashboards, atual.nome] : [t.trilhaRelatorios, t.trilhaDashboards]"
  >
    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <!-- ─────────────── Sem acesso ─────────────── -->
      <UEmpty
        v-if="estado === 'semAcesso'"
        icon="i-lucide-lock"
        :title="t.estados.semAcessoTitulo"
        :description="t.estados.semAcessoDescricao"
        class="m-auto"
      />

      <!-- ─────────────── Nenhum dashboard: estado inicial ─────────────── -->
      <div v-else-if="!atual" class="flex flex-1 pb-28">
        <EstadoInicial
          :t="t"
          :opcao="opcao"
          :sem-categorias="cenario === 'semCategorias'"
          :pode-criar="!somenteLeitura"
          @com-beni="beniAberto = true"
          @do-zero="abrirForm(false)"
          @criar-categoria="criarCategoria"
        />
      </div>

      <template v-else>
        <!-- ─────────────── Cabeçalho ─────────────── -->
        <header class="flex flex-wrap items-start justify-between gap-3 px-4 pb-2 pt-4 sm:px-6">
          <div class="min-w-0">
            <UDropdownMenu :items="menuDosDashboards" :content="{ align: 'start' }" :ui="{ content: 'min-w-64' }">
              <UButton
                :label="atual.nome"
                trailing-icon="i-lucide-chevron-down"
                color="neutral"
                variant="ghost"
                :aria-label="t.pagina.trocarDashboard"
                class="-ml-2.5 text-xl font-semibold text-highlighted"
              />
            </UDropdownMenu>
            <p class="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-muted">
              <span v-if="atual.descricao">{{ atual.descricao }}</span>
              <span class="inline-flex items-center gap-1">
                <UIcon :name="atual.grupos.length ? 'i-lucide-users' : 'i-lucide-globe'" class="size-3.5" />
                {{ t.pagina.visivelPara(atual.grupos) }}
              </span>
              <span v-if="atual.paineis.length" class="text-xs">· {{ textoDeAtualizacao }}</span>
            </p>
          </div>

          <!-- As ações ficam no topo, à direita, onde estão hoje (regra 16). -->
          <div v-if="!somenteLeitura" class="flex shrink-0 items-center gap-2">
            <UButton :label="t.pagina.novoPainel" icon="i-lucide-plus" @click="novoPainel" />
            <UDropdownMenu :items="maisAcoes" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" :loading="atualizando" :aria-label="t.pagina.maisAcoes" />
            </UDropdownMenu>
          </div>
        </header>

        <!-- ─────────────── Dashboard sem painéis ─────────────── -->
        <div v-if="!atual.paineis.length" class="flex-1 px-4 pb-28 sm:px-6">
          <UEmpty
            icon="i-lucide-layout-dashboard"
            :title="t.estados.vazioTitulo"
            :description="somenteLeitura ? t.estados.vazioLeitor : (comBeni ? t.estados.vazioDescricaoComBeni : t.estados.vazioDescricao)"
            :actions="somenteLeitura ? [] : [
              { label: t.pagina.novoPainel, icon: 'i-lucide-plus', onClick: novoPainel },
              ...(comBeni ? [{ label: t.pagina.pedirAoBeni, icon: 'i-lucide-sparkles', color: 'neutral' as const, variant: 'outline' as const, onClick: () => { pedirAberto = true } }] : []),
            ]"
            variant="naked"
            class="mx-auto mt-10 max-w-lg rounded-xl border border-dashed border-default py-12"
          />
        </div>

        <template v-else>
          <!-- ─────────────── Barra: período, filtros de campo e visões ─────────────── -->
          <div class="px-4 pb-3 sm:px-6">
            <BarraDoDashboard
              v-model:periodo="periodo"
              v-model:filtros="filtros"
              :t="t"
              :categorias="categoriasDoDashboard"
              :visoes="atual.visoes"
              :visao-atual="visaoAtual"
              :alterada="alterada"
              :pode-salvar-para-todos="podeSalvarParaTodos"
              :tem-filtro-de-painel="Object.keys(cheiosPorPainel(filtrosDaVisao)).length > 0"
              @aplicar="aplicarVisao"
              @salvar-nova="salvarVisaoAberto = true"
              @atualizar="atualizarVisao"
              @excluir="excluirVisao"
              @limpar="limparFiltros"
            />
          </div>

          <!-- ─────────────── Painéis ─────────────── -->
          <div class="flex-1 px-4 pb-28 sm:px-6">
            <Transition
              leave-active-class="transition duration-150 ease-in motion-reduce:transition-none"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <UAlert
                v-if="!somenteLeitura && !dicaFechada"
                :description="t.pagina.arrasteDica"
                icon="i-lucide-move"
                color="neutral"
                variant="subtle"
                :close="{ 'aria-label': t.pagina.fecharDica }"
                class="mb-3 max-md:hidden"
                @update:open="dicaFechada = true"
              />
            </Transition>
            <GradeDoDashboard
              :key="`${atual.id}-${versao}`"
              :t="t"
              :dashboard="atual"
              :resultados="resultados"
              :series="series"
              :estado-de="estadoDe"
              :somente-leitura="somenteLeitura"
              :rotulo-do-periodo="rotuloDoPeriodo"
              :filtros-do-dashboard="filtros"
              :filtros-da-visao="filtrosDaVisao"
              @editar="editarPainel"
              @duplicar="duplicarPainel"
              @excluir="excluirPainel"
              @csv="baixarCsv"
              @tentar="tentarDeNovo"
              @detalhar="detalhar"
              @filtros-da-visao="mudarFiltrosDaVisao"
            />
          </div>
        </template>
      </template>
    </div>

    <Construtor
      v-model:open="construtorAberto"
      :t="t"
      :painel="painelEmEdicao"
      :novo="baseDoNovo"
      :contexto="contexto"
      :rotulo-do-periodo="rotuloDoPeriodo"
      @salvar="salvarPainel"
    />
    <Detalhamento v-model:open="detalhe.aberto" :t="t" :cfg="detalhe.cfg" :ids="detalhe.ids" :recorte="detalhe.recorte" />
    <FormDashboard v-model:open="formAberto" :t="t" :dashboard="formEditando ? atual : undefined" @salvar="salvarDashboard" />
    <ConstruirComBeni v-model:open="beniAberto" :t="t" @criar="criarComBeni" />
    <PedirAoBeni v-model:open="pedirAberto" :t="t" :categoria-inicial="ultimaCategoria" @adicionar="adicionarDoBeni" />
    <SalvarVisao
      v-model:open="salvarVisaoAberto"
      :t="t"
      :resumo="resumoDaVisao"
      :pode-salvar-para-todos="podeSalvarParaTodos"
      :nomes-usados="atual?.visoes.map(v => v.nome) ?? []"
      @salvar="salvarNovaVisao"
    />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5">
        <span class="flex flex-wrap items-center gap-1.5">
          <span class="mr-0.5 text-xs font-semibold uppercase tracking-wider text-muted">Cenário</span>
          <UButton
            v-for="c in cenarios"
            :key="c.valor"
            :label="c.rotulo"
            size="xs"
            class="transition-transform hover:-translate-y-0.5"
            :color="cenario === c.valor ? 'primary' : 'neutral'"
            :variant="cenario === c.valor ? 'solid' : 'subtle'"
            @click="cenario = c.valor"
          />
        </span>
        <span class="flex flex-wrap items-center gap-1.5">
          <span class="mr-0.5 text-xs font-semibold uppercase tracking-wider text-muted">Opção</span>
          <UFieldGroup size="xs">
            <UButton label="A · com o BENI" :color="opcao === 'A' ? 'primary' : 'neutral'" :variant="opcao === 'A' ? 'solid' : 'subtle'" @click="opcao = 'A'" />
            <UButton label="B · sem IA" :color="opcao === 'B' ? 'primary' : 'neutral'" :variant="opcao === 'B' ? 'solid' : 'subtle'" @click="opcao = 'B'" />
          </UFieldGroup>
        </span>
        <span class="flex flex-wrap items-center gap-1.5">
          <span class="mr-0.5 text-xs font-semibold uppercase tracking-wider text-muted">Papel</span>
          <USelect v-model="papel" :items="papeis" value-key="valor" label-key="rotulo" size="xs" class="w-36" />
        </span>
        <span class="flex flex-wrap items-center gap-1.5">
          <span class="mr-0.5 text-xs font-semibold uppercase tracking-wider text-muted">Estado</span>
          <USelect v-model="estado" :items="estados" value-key="valor" label-key="rotulo" size="xs" class="w-40" />
        </span>
        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/dashboards"
          />
        </span>
      </div>
    </div>
  </CascaDoEnspace>
</template>
