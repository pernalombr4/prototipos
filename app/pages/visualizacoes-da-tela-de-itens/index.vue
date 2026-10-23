<script setup lang="ts">
/**
 * Visualizações da tela de itens: a barra de visualizações personalizadas e
 * o construtor, na tela nova de itens.
 *
 * Uma porta: a lista de Contratos. No andaime, o estilo (Hoje, cópia da
 * branch do PR 2936; Proposta), quantas visualizações a categoria tem, se a
 * pessoa pode editar e a largura da tela.
 *
 * Fronteira: muda a barra de visualizações, o criar, o configurar e a linha de
 * filtros da visualização. Não muda a casca, a barra de ferramentas (busca,
 * período, ícones, Novo registro), a tabela nem o quadro.
 */
import type { EnKanbanCardConfig, EnKanbanColumn, EnTableColumn, EnTableSort } from '@be-enlighten/enspace-sdk-ui/base'
import type { FiltroDeCampo, Item, Visualizacao, Volume } from './mocks'
import { textos } from './textos'
import { CAMPOS, EU, GRUPOS, ITENS, aplicar, campoPorPath, categoria, nomeDaPessoa, visualizacoesIniciais, workspace } from './mocks'
import CascaDaLista from './_CascaDaLista.vue'
import BarraDeVisualizacoes from './_BarraDeVisualizacoes.vue'
import BarraDeHoje from './_BarraDeHoje.vue'
import CriarVisualizacao from './_CriarVisualizacao.vue'
import PainelDeConfiguracao from './_PainelDeConfiguracao.vue'
import ModalDeHoje from './_ModalDeHoje.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Visualizações da tela de itens',
  descricao: 'Barra de visualizações com arrastar, "+N" e nome cortado com tooltip; criar em 1 passo e configurar num painel com a tabela à vista.',
  status: 'em-revisao',
  atualizado: '2026-10-23',
  tela: 'Tela nova de itens (lista da categoria)',
})

const t = useTextos(textos)
const idioma = useIdioma()
const toast = useToast()
const route = useRoute()
const router = useRouter()

/* ---------- andaime (vai para o endereço, para mandar o link de cada estado) ---------- */

function daQuery<T extends string>(chave: string, valores: readonly T[], padrao: T) {
  return computed<T>({
    get: () => (valores.includes(route.query[chave] as T) ? route.query[chave] : padrao) as T,
    set: v => router.replace({ query: { ...route.query, [chave]: v } }),
  })
}

const estilo = daQuery('estilo', ['hoje', 'proposta'] as const, 'proposta')
const volume = daQuery<Volume>('volume', ['nenhuma', 'poucas', 'muitas'] as const, 'muitas')
const permissao = daQuery('permissao', ['editar', 'leitura'] as const, 'editar')
const largura = daQuery('largura', ['cheia', 'estreita'] as const, 'cheia')
const podeEditar = computed(() => permissao.value === 'editar')

/* ---------- visualizações: as salvas e os rascunhos ---------- */

const salvas = ref<Visualizacao[]>(visualizacoesIniciais(volume.value))
/** Mudança ainda não salva, por visualização. Fica até Salvar ou Descartar (GitHub Projects faz igual). */
const rascunhos = ref<Record<string, Visualizacao>>({})

watch(volume, (v) => {
  salvas.value = visualizacoesIniciais(v)
  rascunhos.value = {}
  painelAberto.value = false
  ativaLocal.value = 'default'
})

/* Hoje não existe rascunho nem painel: trocar de estilo começa limpo. */
watch(estilo, () => {
  rascunhos.value = {}
  painelAberto.value = false
})

/** A ativa vai para o endereço na proposta (`?view=`); na cópia de hoje, não (lá fica sempre `view=default`). */
const ativaLocal = ref('default')
const ativa = computed({
  get: () => estilo.value === 'proposta' && salvas.value.some(v => v.reference === route.query.view)
    ? String(route.query.view)
    : (salvas.value.some(v => v.reference === ativaLocal.value) ? ativaLocal.value : 'default'),
  set: (id: string) => {
    ativaLocal.value = id
    if (estilo.value === 'proposta') router.replace({ query: { ...route.query, view: id } })
  },
})

const salvaAtiva = computed(() => salvas.value.find(v => v.reference === ativa.value) ?? salvas.value[0]!)
const efetiva = computed(() => rascunhos.value[ativa.value] ?? salvaAtiva.value)

const mesmo = (a: Visualizacao, b: Visualizacao) => JSON.stringify(a) === JSON.stringify(b)
const modificadas = computed(() => Object.keys(rascunhos.value).filter((r) => {
  const s = salvas.value.find(v => v.reference === r)
  return s && !mesmo(s, rascunhos.value[r]!)
}))
const modificada = computed(() => modificadas.value.includes(ativa.value))

/** O painel mexe no rascunho da ativa; o primeiro ajuste cria o rascunho. */
const rascunhoDaAtiva = computed<Visualizacao>({
  get: () => efetiva.value,
  set: (v) => {
    if (mesmo(v, salvaAtiva.value)) {
      const { [ativa.value]: _, ...resto } = rascunhos.value
      rascunhos.value = resto
    }
    else {
      rascunhos.value = { ...rascunhos.value, [ativa.value]: v }
    }
  },
})

function mexer(fn: (v: Visualizacao) => void) {
  const copia = structuredClone(toRaw(efetiva.value))
  fn(copia)
  rascunhoDaAtiva.value = copia
}

/* ---------- itens da visualização ---------- */

const busca = ref('')
const trocando = ref(false)
watch(ativa, () => {
  trocando.value = true
  setTimeout(() => { trocando.value = false }, 260)
})

const itensDaVisualizacao = computed(() => {
  const lista = aplicar(efetiva.value)
  const q = busca.value.trim().toLowerCase()
  return q ? lista.filter(i => `${i.reference} ${i.fornecedor}`.toLowerCase().includes(q)) : lista
})

const contagens = computed(() => Object.fromEntries(salvas.value.map(v => [v.reference, aplicar(rascunhos.value[v.reference] ?? v).length])))

/* ---------- descrever filtro e visualização (tooltip, linha de filtros) ---------- */

const moeda = (n: number) => new Intl.NumberFormat(idioma.value, { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const data = (s: string) => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${s}T12:00:00`))

function valorLegivel(f: FiltroDeCampo) {
  const tipo = campoPorPath(f.field)?.tipo
  if (tipo === 'moeda') return moeda(Number(f.value))
  if (tipo === 'usuario') return nomeDaPessoa(Number(f.value)) ?? ''
  if (tipo === 'data' && f.op === 'next_days') return t.value.painel.diasN(Number(f.value))
  if (tipo === 'data') return data(String(f.value))
  return String(f.value ?? '')
}

function descreverFiltro(f: FiltroDeCampo) {
  const campo = campoPorPath(f.field)
  const op = t.value.operadores[campo?.tipo === 'data' ? `data_${f.op}` : f.op] ?? f.op
  const semValor = f.op === 'empty' || f.op === 'not_empty'
  return `${campo?.label ?? f.field} ${op.toLowerCase()}${semValor ? '' : ` ${valorLegivel(f)}`}`
}

function resumoDe(v: Visualizacao) {
  const r = t.value.resumo
  const partes: string[] = [v.model_type === 'kanban' ? r.kanban(campoPorPath(v.config.groupBy ?? 'status')?.label ?? '') : r.tabela]
  const filtros = [
    ...(v.filters.quick_filters ?? []).map(q => q.filter === 'isOwner' ? r.meus : r.meusGrupos),
    ...(v.filters.field_filters ?? []).map(descreverFiltro),
  ]
  partes.push(filtros.length ? filtros.join(r.e) : r.semFiltro)
  const s = v.config.sorts?.[0]
  if (s) partes.push(r.ordenadoPor(campoPorPath(s.field)?.label ?? s.field, s.direction === 'asc' ? r.crescente : r.decrescente))
  partes.push(v.user ? r.soVoce : v.module_groups?.length ? r.grupos(v.module_groups.map(g => GRUPOS.find(x => x.id === g)?.nome).join(', ')) : r.todosVeem)
  if (rascunhos.value[v.reference] && modificadas.value.includes(v.reference)) partes.push(r.naoSalva)
  return partes.join(' · ')
}

/* ---------- linha de filtros da visualização (proposta) ---------- */

const filtrosAtivos = computed(() => efetiva.value.filters.field_filters ?? [])
const rapidosAtivos = computed(() => efetiva.value.filters.quick_filters ?? [])

function tirarFiltro(i: number) {
  mexer((v) => { v.filters.field_filters = (v.filters.field_filters ?? []).filter((_, j) => j !== i) })
}
function tirarRapido(filtro: string) {
  mexer((v) => { v.filters.quick_filters = (v.filters.quick_filters ?? []).filter(q => q.filter !== filtro) })
}

/* Filtro rápido pela linha: escolher campo e valor de seleção, sem abrir o painel. */
const filtroRapidoAberto = ref(false)
const camposDeSelecao = CAMPOS.filter(c => c.tipo === 'selecao')
function filtrarPor(field: string, value: string) {
  mexer((v) => { v.filters.field_filters = [...(v.filters.field_filters ?? []), { field, op: 'eq', value }] })
  filtroRapidoAberto.value = false
}

/* Ordenar pelo cabeçalho da tabela também mexe na visualização. */
const ordenacaoDaTabela = computed<EnTableSort | null>(() => {
  const s = efetiva.value.config.sorts?.[0]
  return s ? { key: s.field, direction: s.direction } : null
})
function aoOrdenar(s: EnTableSort) {
  mexer((v) => { v.config.sorts = s.direction ? [{ field: s.key, direction: s.direction as 'asc' | 'desc' }] : [] })
}

/* ---------- salvar, salvar como nova, descartar ---------- */

const salvando = ref(false)
const ePadraoDoSistema = computed(() => ativa.value === 'default')
/** Só leitura, ou a "Itens" do sistema: o caminho é salvar como nova. */
const soSalvarComoNova = computed(() => !podeEditar.value || ePadraoDoSistema.value)

async function salvar() {
  if (soSalvarComoNova.value) {
    abrirSalvarComo()
    return
  }
  salvando.value = true
  await new Promise(r => setTimeout(r, 400))
  const v = rascunhos.value[ativa.value]
  if (v) {
    salvas.value = salvas.value.map(x => x.reference === ativa.value ? v : x)
    const { [ativa.value]: _, ...resto } = rascunhos.value
    rascunhos.value = resto
    toast.add({ title: v.user ? t.value.avisos.salvaSoEu(v.name ?? '') : t.value.avisos.salvaTodos(v.name ?? ''), icon: 'i-lucide-check', color: 'success', duration: 3000 })
  }
  salvando.value = false
}

function descartar() {
  const { [ativa.value]: _, ...resto } = rascunhos.value
  rascunhos.value = resto
  toast.add({ title: t.value.avisos.descartada, icon: 'i-lucide-undo-2', duration: 2500 })
}

const salvarComo = ref({ aberto: false, nome: '' })
function abrirSalvarComo() {
  salvarComo.value = { aberto: true, nome: t.value.avisos.nomeDaCopia(efetiva.value.name ?? '') }
}
function confirmarSalvarComo() {
  const nome = salvarComo.value.nome.trim()
  if (!nome) return
  const base = structuredClone(toRaw(efetiva.value))
  const nova: Visualizacao = { ...base, reference: `vis-${Date.now()}`, name: nome, default: false, fixada: false, user: podeEditar.value ? base.user : EU.id }
  const { [ativa.value]: _, ...resto } = rascunhos.value
  rascunhos.value = resto
  salvas.value = [...salvas.value, nova]
  ativa.value = nova.reference
  salvarComo.value.aberto = false
  toast.add({ title: t.value.avisos.criada(nome), icon: 'i-lucide-check', color: 'success', duration: 3000 })
}

/* ---------- criar ---------- */

const criarAberto = ref(false)
const barraRef = ref<InstanceType<typeof BarraDeVisualizacoes> | null>(null)
const painelAberto = ref(false)

function criar(d: { nome: string, tipo: 'table' | 'kanban', agruparPor: string, herdar: boolean, soEu: boolean }) {
  const base = d.herdar ? structuredClone(toRaw(efetiva.value)) : visualizacoesIniciais('nenhuma')[0]!
  const nova: Visualizacao = {
    ...base,
    reference: `vis-${Date.now()}`,
    name: d.nome,
    icon: d.tipo === 'kanban' ? 'i-lucide-square-kanban' : 'i-lucide-table',
    model_type: d.tipo,
    default: false,
    fixada: false,
    user: d.soEu ? EU.id : null,
    module_groups: null,
    roles: null,
    config: { ...base.config, groupBy: d.tipo === 'kanban' ? d.agruparPor : undefined },
  }
  salvas.value = [...salvas.value, nova]
  ativa.value = nova.reference
  criarAberto.value = false
  toast.add({
    title: t.value.avisos.criada(d.nome),
    icon: 'i-lucide-check',
    color: 'success',
    duration: 5000,
    actions: podeEditar.value ? [{ label: t.value.avisos.configurar, color: 'neutral', variant: 'outline', onClick: () => { painelAberto.value = true } }] : undefined,
  })
}

/* ---------- ações do menu ---------- */

const nomeDe = (id: string) => salvas.value.find(v => v.reference === id)?.name ?? ''

function configurar(id: string) {
  ativa.value = id
  painelAberto.value = true
}

function duplicar(id: string) {
  const original = salvas.value.find(v => v.reference === id)!
  const copia: Visualizacao = { ...structuredClone(toRaw(rascunhos.value[id] ?? original)), reference: `vis-${Date.now()}`, name: t.value.avisos.nomeDaCopia(original.name ?? ''), default: false, fixada: false }
  const i = salvas.value.findIndex(v => v.reference === id)
  const lista = [...salvas.value]
  lista.splice(i + 1, 0, copia)
  salvas.value = lista
  ativa.value = copia.reference
  toast.add({
    title: t.value.avisos.duplicada(original.name ?? ''),
    icon: 'i-lucide-copy',
    duration: 5000,
    actions: [{ label: t.value.avisos.renomear, color: 'neutral', variant: 'outline', onClick: () => barraRef.value?.comecarARenomear(copia.reference) }],
  })
}

async function copiarLink(id: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('view', id)
  try {
    await navigator.clipboard.writeText(url.toString())
  }
  catch {}
  toast.add({ title: t.value.avisos.linkCopiado(nomeDe(id)), icon: 'i-lucide-link', duration: 2500 })
}

function definirPadrao(id: string) {
  salvas.value = salvas.value.map(v => ({ ...v, default: v.reference === id }))
  toast.add({ title: t.value.avisos.padrao(nomeDe(id)), icon: 'i-lucide-house', color: 'success', duration: 3500 })
}

function aoRenomear(id: string, anterior: string) {
  rascunhos.value = rascunhos.value[id] ? { ...rascunhos.value, [id]: { ...rascunhos.value[id]!, name: nomeDe(id) } } : rascunhos.value
  toast.add({
    title: t.value.avisos.renomeada(nomeDe(id)),
    icon: 'i-lucide-pencil',
    duration: 4000,
    actions: [{ label: t.value.avisos.desfazer, color: 'neutral', variant: 'outline', onClick: () => { salvas.value = salvas.value.map(v => v.reference === id ? { ...v, name: anterior } : v) } }],
  })
}

function aoReordenar(anterior: Visualizacao[]) {
  toast.add({
    title: t.value.avisos.ordemSalva,
    description: t.value.avisos.ordemSoParaVoce,
    icon: 'i-lucide-check',
    color: 'success',
    duration: 4000,
    actions: [{ label: t.value.avisos.desfazer, color: 'neutral', variant: 'outline', onClick: () => { salvas.value = anterior } }],
  })
}

function aoFixar(id: string, fixou: boolean) {
  toast.add({ title: fixou ? t.value.avisos.fixada(nomeDe(id)) : t.value.avisos.desafixada(nomeDe(id)), icon: fixou ? 'i-lucide-pin' : 'i-lucide-pin-off', duration: 2500 })
}

/* Excluir: confirmação, porque some para todos (é o que as folders fazem). */
const aExcluir = ref<string | null>(null)
const excluindo = ref(false)
async function excluir() {
  if (!aExcluir.value) return
  excluindo.value = true
  await new Promise(r => setTimeout(r, 450))
  const id = aExcluir.value
  const nome = nomeDe(id)
  if (ativa.value === id) ativa.value = 'default'
  salvas.value = salvas.value.filter(v => v.reference !== id)
  const { [id]: _, ...resto } = rascunhos.value
  rascunhos.value = resto
  excluindo.value = false
  aExcluir.value = null
  toast.add({ title: t.value.avisos.excluida(nome), icon: 'i-lucide-trash-2', duration: 3000 })
}

/* ---------- cópia de hoje: o modal grande ---------- */

const modalHoje = ref<{ aberto: boolean, modo: 'nova' | 'duplicar' | 'configurar', ref: string | null }>({ aberto: false, modo: 'nova', ref: null })
const inicialDoModal = computed(() => modalHoje.value.ref ? salvas.value.find(v => v.reference === modalHoje.value.ref) ?? null : null)

function salvarNoModalDeHoje(parte: Partial<Visualizacao>) {
  if (modalHoje.value.modo === 'configurar' && modalHoje.value.ref) {
    salvas.value = salvas.value.map(v => v.reference === modalHoje.value.ref ? { ...v, ...parte, config: { ...v.config, ...parte.config } } as Visualizacao : v)
    toast.add({ title: t.value.hoje.editada, icon: 'i-lucide-circle-check', color: 'success' })
    return
  }
  const nova: Visualizacao = { ...visualizacoesIniciais('nenhuma')[0]!, ...parte, reference: `vis-${Date.now()}`, default: false } as Visualizacao
  salvas.value = [...salvas.value, nova]
  // Cópia de hoje: criar não abre a nova; duplicar avisa "editada".
  toast.add({ title: modalHoje.value.modo === 'duplicar' ? t.value.hoje.editada : t.value.hoje.criada, icon: 'i-lucide-circle-check', color: 'success' })
}

/* ---------- tabela e quadro ---------- */

const colunasDaTabela = computed<EnTableColumn[]>(() => (efetiva.value.config.columns ?? []).map(c => ({
  key: c.path,
  label: campoPorPath(c.path)?.label ?? c.label ?? c.path,
  sortable: true,
  align: campoPorPath(c.path)?.tipo === 'moeda' ? 'right' : 'left',
})))

type Linha = Item & { id: string }
const linhas = computed<Linha[]>(() => itensDaVisualizacao.value.map(i => ({ ...i, id: i.reference })))

const COR: Record<string, 'neutral' | 'info' | 'success' | 'warning' | 'error' | 'primary'> = {
  'Rascunho': 'neutral', 'Em análise': 'info', 'Aprovado': 'success', 'Assinado': 'primary', 'Vencido': 'error',
  'Alta': 'error', 'Média': 'warning', 'Baixa': 'neutral',
}

const colunasDoQuadro = computed<EnKanbanColumn[]>(() => (campoPorPath(efetiva.value.config.groupBy ?? 'status')?.opcoes ?? []).map(o => ({
  value: o,
  label: o,
  colorScheme: COR[o] === 'primary' ? 'info' : (COR[o] ?? 'neutral'),
})))

const cartoes = computed(() => itensDaVisualizacao.value.map(i => ({
  ...i,
  id: i.reference,
  descricao: `${i.reference} · ${nomeDaPessoa(i.responsavel) ?? t.value.itens.semResponsavel}`,
})))

const cartao: EnKanbanCardConfig = { header: 'fornecedor', content: 'descricao' }

/* ---------- casca ---------- */

const trilha = computed(() => [workspace.name, t.value.casca.itens.categorias, categoria.name])

const opcoesDoAndaime = computed(() => [
  { chave: 'estilo', titulo: t.value.andaime.estilo, modelo: estilo, opcoes: (['hoje', 'proposta'] as const).map(v => ({ v, l: t.value.andaime.estilos[v], recomendada: v === 'proposta' })) },
  { chave: 'volume', titulo: t.value.andaime.volume, modelo: volume, opcoes: (['nenhuma', 'poucas', 'muitas'] as const).map(v => ({ v, l: t.value.andaime.volumes[v] })) },
  { chave: 'permissao', titulo: t.value.andaime.permissao, modelo: permissao, opcoes: (['editar', 'leitura'] as const).map(v => ({ v, l: t.value.andaime.permissoes[v] })) },
  { chave: 'largura', titulo: t.value.andaime.largura, modelo: largura, opcoes: (['cheia', 'estreita'] as const).map(v => ({ v, l: t.value.andaime.larguras[v] })) },
])
</script>

<template>
  <div>
    <CascaDaLista :t="t" :trilha="trilha">
      <div class="flex h-[calc(100dvh-4rem)] min-h-0 pb-12">
        <section
          class="flex min-w-0 flex-1 flex-col bg-default transition-[max-width] duration-300"
          :class="largura === 'estreita' ? 'max-w-[44rem] border-r border-dashed border-accented' : 'max-w-full'"
        >
          <!-- Barra de visualizações: o objeto da demanda -->
          <div class="border-b border-default px-3 py-1.5">
            <BarraDeVisualizacoes
              v-if="estilo === 'proposta'"
              ref="barraRef"
              v-model:visualizacoes="salvas"
              v-model:ativa="ativa"
              :t="t"
              :pode-editar="podeEditar"
              :modificada="modificada"
              :modificadas="modificadas"
              :contagens="contagens"
              :resumo-de="resumoDe"
              @configurar="configurar"
              @duplicar="duplicar"
              @copiar-link="copiarLink"
              @definir-padrao="definirPadrao"
              @excluir="(id: string) => (aExcluir = id)"
              @renomeada="aoRenomear"
              @fixada="aoFixar"
              @reordenada="aoReordenar"
              @nome-repetido="(n: string) => toast.add({ title: t.avisos.nomeRepetido(n), icon: 'i-lucide-circle-alert', color: 'warning', duration: 3500 })"
            >
              <template #criar>
                <UPopover v-if="podeEditar" v-model:open="criarAberto" :content="{ align: 'end', sideOffset: 6 }">
                  <UTooltip :text="t.barra.nova" :disabled="salvas.length === 1">
                    <UButton
                      icon="i-lucide-plus"
                      :label="salvas.length === 1 ? t.barra.nova : undefined"
                      color="neutral"
                      :variant="salvas.length === 1 ? 'outline' : 'ghost'"
                      size="sm"
                      :class="salvas.length === 1 ? '' : 'text-muted'"
                      :aria-label="t.barra.nova"
                    />
                  </UTooltip>
                  <template #content>
                    <CriarVisualizacao
                      :t="t"
                      :nome-da-ativa="efetiva.name ?? ''"
                      :nomes-existentes="salvas.map(v => v.name ?? '')"
                      @criar="criar"
                      @cancelar="criarAberto = false"
                    />
                  </template>
                </UPopover>
              </template>
            </BarraDeVisualizacoes>
            <BarraDeHoje
              v-else
              v-model:visualizacoes="salvas"
              v-model:ativa="ativa"
              :t="t"
              @configurar="(id: string) => (modalHoje = { aberto: true, modo: 'configurar', ref: id })"
              @duplicar="(id: string) => (modalHoje = { aberto: true, modo: 'duplicar', ref: id })"
              @excluir="(id: string) => (aExcluir = id)"
              @nova="modalHoje = { aberto: true, modo: 'nova', ref: null }"
            />
          </div>

          <!-- Barra de ferramentas: CÓPIA da tela nova de itens, não muda -->
          <div class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-2">
            <UInput v-model="busca" :placeholder="t.itens.buscar" icon="i-lucide-search" size="sm" variant="none" class="w-56" />
            <UButton :label="t.itens.criadoEm" icon="i-lucide-calendar" size="xs" color="neutral" variant="ghost" />
            <UButton :label="t.itens.todoPeriodo" icon="i-lucide-arrow-up-down" size="xs" color="neutral" variant="ghost" />
            <span class="ml-auto flex items-center gap-1">
              <UButton icon="i-lucide-file-down" size="xs" color="neutral" variant="ghost" :aria-label="t.itens.exportar" />
              <UButton icon="i-lucide-columns-2" size="xs" color="neutral" variant="ghost" :aria-label="t.itens.colunas" />
              <UButton icon="i-lucide-sliders-horizontal" size="xs" color="neutral" variant="ghost" :aria-label="t.itens.filtros" />
              <UButton icon="i-lucide-settings" size="xs" color="neutral" variant="ghost" :aria-label="t.itens.configurar" />
              <UButton :label="t.itens.novoRegistro" icon="i-lucide-plus" size="xs" color="primary" variant="outline" />
            </span>
          </div>

          <!-- PROPOSTA: a linha do que a visualização filtra, e salvar ou descartar quando ela foi mexida -->
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            leave-active-class="transition-all duration-150 ease-in"
            leave-to-class="opacity-0"
          >
            <div
              v-if="estilo === 'proposta' && (filtrosAtivos.length || rapidosAtivos.length || modificada)"
              class="flex flex-wrap items-center gap-1.5 border-b border-default bg-elevated/40 px-4 py-1.5"
            >
              <UIcon name="i-lucide-filter" class="size-3.5 text-muted" />
              <TransitionGroup
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 scale-95"
                leave-active-class="transition duration-100 ease-in"
                leave-to-class="opacity-0 scale-95"
              >
                <UBadge
                  v-for="q in rapidosAtivos"
                  :key="q.filter"
                  :label="q.filter === 'isOwner' ? t.resumo.meus : t.resumo.meusGrupos"
                  color="neutral"
                  variant="outline"
                  size="md"
                  class="gap-1 pr-1"
                >
                  <template #trailing>
                    <UButton icon="i-lucide-x" color="neutral" variant="link" size="xs" class="p-0" :aria-label="t.linha.tirar(q.filter === 'isOwner' ? t.resumo.meus : t.resumo.meusGrupos)" @click="tirarRapido(q.filter)" />
                  </template>
                </UBadge>
                <UBadge
                  v-for="(f, i) in filtrosAtivos"
                  :key="`${f.field}-${i}`"
                  :label="descreverFiltro(f)"
                  color="neutral"
                  variant="outline"
                  size="md"
                  class="max-w-72 gap-1 pr-1"
                  :ui="{ label: 'truncate' }"
                >
                  <template #trailing>
                    <UButton icon="i-lucide-x" color="neutral" variant="link" size="xs" class="p-0" :aria-label="t.linha.tirar(descreverFiltro(f))" @click="tirarFiltro(i)" />
                  </template>
                </UBadge>
              </TransitionGroup>
              <UPopover v-model:open="filtroRapidoAberto" :content="{ align: 'start' }">
                <UButton :label="t.linha.filtro" icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" />
                <template #content>
                  <div class="w-60 p-1">
                    <div v-for="c in camposDeSelecao" :key="c.path" class="p-1">
                      <p class="px-1 pb-1 text-xs font-medium text-muted">{{ c.label }}</p>
                      <div class="flex flex-wrap gap-1">
                        <UButton v-for="o in c.opcoes" :key="o" :label="o" size="xs" color="neutral" variant="soft" @click="filtrarPor(c.path, o)" />
                      </div>
                    </div>
                    <USeparator class="my-1" />
                    <UButton v-if="podeEditar" :label="t.linha.maisOpcoes" icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="xs" block class="justify-start" @click="filtroRapidoAberto = false; painelAberto = true" />
                  </div>
                </template>
              </UPopover>

              <span v-if="modificada" class="ml-auto flex items-center gap-2">
                <span class="flex items-center gap-1.5 text-xs text-muted"><span class="size-2 rounded-full bg-warning" />{{ t.linha.naoSalva }}</span>
                <UButton :label="t.linha.descartar" color="neutral" variant="ghost" size="xs" @click="descartar" />
                <UFieldGroup v-if="!soSalvarComoNova" size="xs">
                  <UButton :label="t.linha.salvar" :loading="salvando" @click="salvar" />
                  <UDropdownMenu :items="[[{ label: t.linha.salvarComoNova, icon: 'i-lucide-copy-plus', onSelect: abrirSalvarComo }]]" :content="{ align: 'end' }">
                    <UButton icon="i-lucide-chevron-down" :aria-label="t.linha.maisSalvar" />
                  </UDropdownMenu>
                </UFieldGroup>
                <UButton v-else :label="t.linha.salvarComoNova" size="xs" @click="abrirSalvarComo" />
              </span>
            </div>
          </Transition>

          <!-- Tabela ou quadro: CÓPIA da tela nova, com o dado da visualização -->
          <div class="flex min-h-0 flex-1">
            <div class="min-w-0 flex-1 overflow-auto p-4">
              <Transition
                mode="out-in"
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                leave-active-class="transition duration-100 ease-in"
                leave-to-class="opacity-0"
              >
                <div v-if="efetiva.model_type === 'kanban'" :key="`k-${ativa}-${efetiva.config.groupBy}`" class="h-full min-h-96">
                  <ClientOnly>
                    <EnKanbanBoard
                      :data="cartoes"
                      :card-map="cartao"
                      :columns="colunasDoQuadro"
                      :group-by="efetiva.config.groupBy ?? 'status'"
                      primary-key="id"
                      :stagger-column-ms="50"
                      :locale="idioma"
                    />
                  </ClientOnly>
                </div>
                <div v-else :key="`t-${ativa}`">
                  <EnTable
                    :columns="colunasDaTabela"
                    :rows="linhas"
                    :loading="trocando"
                    :sort="ordenacaoDaTabela"
                    selectable
                    :locale="idioma"
                    :empty-state="{ icon: 'i-lucide-filter-x', title: t.itens.vazioTitulo, description: t.itens.vazioTexto }"
                    @sort-change="aoOrdenar"
                  >
                    <template #cell-reference="{ row }">
                      <span class="font-mono text-xs text-info">{{ (row as Linha).reference }}</span>
                    </template>
                    <template #cell-fornecedor="{ row }">
                      <span class="block max-w-64 truncate text-sm text-toned">{{ (row as Linha).fornecedor }}</span>
                    </template>
                    <template #cell-status="{ row }">
                      <UBadge :label="(row as Linha).status" :color="COR[(row as Linha).status]" variant="soft" size="sm" />
                    </template>
                    <template #cell-prioridade="{ row }">
                      <UBadge :label="(row as Linha).prioridade" :color="COR[(row as Linha).prioridade]" variant="subtle" size="sm" />
                    </template>
                    <template #cell-area="{ row }">
                      <span class="text-sm text-toned">{{ (row as Linha).area }}</span>
                    </template>
                    <template #cell-responsavel="{ row }">
                      <span v-if="(row as Linha).responsavel" class="text-sm text-toned">{{ nomeDaPessoa((row as Linha).responsavel) }}</span>
                      <span v-else class="text-sm text-dimmed">{{ t.itens.semResponsavel }}</span>
                    </template>
                    <template #cell-valor="{ row }">
                      <span class="text-sm tabular-nums text-toned">{{ moeda((row as Linha).valor) }}</span>
                    </template>
                    <template #cell-vencimento="{ row }">
                      <span class="text-sm tabular-nums text-toned">{{ data((row as Linha).vencimento) }}</span>
                    </template>
                    <template #cell-criado_em="{ row }">
                      <span class="text-sm tabular-nums text-toned">{{ data((row as Linha).criado_em) }}</span>
                    </template>
                    <template #actions>
                      <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.itens.acoes" />
                    </template>
                  </EnTable>
                  <p class="mt-3 text-xs text-muted">{{ t.itens.mostrando(linhas.length, ITENS.length) }}</p>
                </div>
              </Transition>
            </div>

            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 translate-x-4"
              leave-active-class="transition-all duration-150 ease-in"
              leave-to-class="opacity-0 translate-x-4"
            >
              <PainelDeConfiguracao
                v-if="estilo === 'proposta' && painelAberto && podeEditar"
                v-model="rascunhoDaAtiva"
                :t="t"
                :modificada="modificada"
                :salvando="salvando"
                :so-como-nova="soSalvarComoNova"
                @salvar="salvar"
                @descartar="descartar"
                @fechar="painelAberto = false"
              />
            </Transition>
          </div>
        </section>
      </div>
    </CascaDaLista>

    <!-- Salvar como nova -->
    <UModal v-model:open="salvarComo.aberto" :title="t.salvarComo.titulo" :description="t.salvarComo.texto" :ui="{ content: 'max-w-sm' }">
      <template #body>
        <form id="form-salvar-como" @submit.prevent="confirmarSalvarComo">
          <UFormField :label="t.criar.nome">
            <UInput v-model="salvarComo.nome" class="w-full" autofocus />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="salvarComo.aberto = false" />
          <UButton :label="t.salvarComo.criar" type="submit" form="form-salvar-como" />
        </div>
      </template>
    </UModal>

    <!-- Excluir -->
    <UModal
      :open="!!aExcluir"
      :title="aExcluir ? t.excluir.titulo(nomeDe(aExcluir)) : ''"
      :description="t.excluir.texto"
      :ui="{ content: 'max-w-md' }"
      @update:open="(v: boolean) => { if (!v) aExcluir = null }"
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="aExcluir = null" />
          <UButton :label="t.excluir.botao" color="error" :loading="excluindo" @click="excluir" />
        </div>
      </template>
    </UModal>

    <!-- Cópia de hoje -->
    <ModalDeHoje v-model:open="modalHoje.aberto" :t="t" :inicial="inicialDoModal" :modo="modalHoje.modo" @salvar="salvarNoModalDeHoje" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5">
        <template v-for="(g, i) in opcoesDoAndaime" :key="g.chave">
          <span v-if="i" class="h-5 w-px bg-accented" aria-hidden="true" />
          <span class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ g.titulo }}</span>
            <UFieldGroup size="xs">
              <UButton
                v-for="o in g.opcoes"
                :key="o.v"
                :color="g.modelo.value === o.v ? 'primary' : 'neutral'"
                :variant="g.modelo.value === o.v ? 'solid' : 'outline'"
                @click="(g.modelo as any).value = o.v"
              >
                {{ o.l }}
                <UBadge v-if="'recomendada' in o && o.recomendada" :label="t.andaime.recomendada" size="sm" :color="g.modelo.value === o.v ? 'neutral' : 'primary'" variant="soft" />
              </UButton>
            </UFieldGroup>
          </span>
        </template>

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/visualizacoes-da-tela-de-itens"
          />
        </span>
      </div>
    </div>
  </div>
</template>
