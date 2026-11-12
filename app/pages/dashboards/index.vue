<script setup lang="ts">
/**
 * Dashboards configuráveis: a tela de Painéis refeita como entrada nativa do menu.
 *
 * O que a tela prova, na ordem das recomendações do relatório
 * (`pesquisa/reports/Dashboards configuráveis para o ENSPACE.md`):
 * 1. a agregação no back (`agregacao.ts` é o contrato: grupos prontos, múltipla
 *    seleção contada em cada opção, relação pelo item ligado, "Outros");
 * 2. "Dashboards" no menu, sem passar por Telas e Menus, com troca de dashboard
 *    no título;
 * 3. o construtor em painel lateral, com prévia ao vivo e a frase da configuração;
 * 4. o dado antes do gráfico, e só os gráficos que servem para o dado;
 * 5. regras por tipo de campo, inclusive campo virtual como medida;
 * 6. período e filtro do dashboard inteiro, e clique até os itens.
 *
 * A grade, o painel, o seletor de período e os gráficos são do SDK 0.21
 * (`EnDashboardCanvas`, `EnDashboardPanel`, `EnDashboardPeriodPicker`, `EnChart*`).
 * O dado é o `mocks.ts`; nada sai do navegador.
 */
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { ConfigDoPainel, Contexto, FiltroDoDashboard, Grupo, Periodo } from './agregacao'
import { agregar, campoDe, camposComuns, intervalo, opcoesDoComum, painelEmBranco } from './agregacao'
import type { Dashboard } from './dashboards'
import { DASHBOARDS } from './dashboards'
import { categoriaPorSlug } from './mocks'
import { textos } from './textos'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import Construtor from './_Construtor.vue'
import Detalhamento from './_Detalhamento.vue'
import FiltrosDoDashboard from './_FiltrosDoDashboard.vue'
import FormDashboard from './_FormDashboard.vue'
import GradeDoDashboard from './_GradeDoDashboard.vue'

definePageMeta({
  titulo: 'Dashboards configuráveis',
  descricao: 'Dashboards como entrada do menu, com construtor de painel em painel lateral e prévia ao vivo, período e filtro do dashboard inteiro, barra empilhada e clique até os itens. Grade e gráficos do SDK 0.21.',
  status: 'em-revisao',
  atualizado: '2026-11-12',
  tela: 'Dashboards',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME: o seletor de estados não é proposta. Existe para percorrer *
 * os estados que a tela precisa ter.                                  *
 * ------------------------------------------------------------------ */
type Estado = 'cheio' | 'carregando' | 'semDados' | 'erro' | 'vazio' | 'somenteLeitura' | 'semAcesso'
const estado = ref<Estado>('cheio')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'cheio', rotulo: 'Cheio' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'semDados', rotulo: 'Período sem itens' },
  { valor: 'erro', rotulo: 'Erro num painel' },
  { valor: 'vazio', rotulo: 'Dashboard sem painéis' },
  { valor: 'somenteLeitura', rotulo: 'Quem só lê' },
  { valor: 'semAcesso', rotulo: 'Sem acesso' },
]

/* ------------------------------- dashboards -------------------------------- */

const dashboards = ref<Dashboard[]>(structuredClone(DASHBOARDS))
const atualId = ref(DASHBOARDS[0]!.id)
const atual = computed(() => dashboards.value.find(d => d.id === atualId.value) ?? dashboards.value[0]!)
const somenteLeitura = computed(() => estado.value === 'somenteLeitura')
const editavel = ref(false)

watch(atualId, () => {
  filtros.value = []
  editavel.value = false
})
watch(somenteLeitura, (s) => { if (s) editavel.value = false })

/* --------------------------------- filtros --------------------------------- */

const periodo = ref<Periodo>('year')
const filtros = ref<FiltroDoDashboard[]>([])

/** O estado "Período sem itens" usa uma janela antiga: só os painéis de todo o período mostram número. */
const periodoEfetivo = computed<Periodo>(() => estado.value === 'semDados'
  ? { from: new Date(2021, 0, 1), to: new Date(2021, 0, 31) }
  : periodo.value)

const comuns = computed(() => camposComuns([...new Set(atual.value.paineis.map(p => p.categoria))]))
const contexto = computed<Contexto>(() => ({
  periodo: periodoEfetivo.value,
  filtros: filtros.value,
  comuns: comuns.value,
  rotulos: { ...t.value.rotulos, locale: t.value.locale },
}))

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
watch(() => JSON.stringify([periodoEfetivo.value, filtros.value, atualId.value]), () => {
  recalculando.value = true
  clearTimeout(espera)
  espera = setTimeout(() => { recalculando.value = false }, 350)
})

const resultados = computed(() => Object.fromEntries(atual.value.paineis.map(p => [p.id, agregar(p, contexto.value)])))

/** O estado "Erro num painel": 1 painel falha, os outros seguem. */
const painelComErro = ref<string | null>(null)
watch(estado, (e) => { painelComErro.value = e === 'erro' ? (atual.value.paineis[4]?.id ?? atual.value.paineis[0]?.id ?? null) : null })

function estadoDe(id: string): 'pronto' | 'carregando' | 'erro' {
  if (estado.value === 'carregando' || recalculando.value) return 'carregando'
  if (painelComErro.value === id) return 'erro'
  return 'pronto'
}

function fraseDe(p: ConfigDoPainel) {
  const cat = categoriaPorSlug.get(p.categoria)?.name ?? ''
  return t.value.frase(
    p.funcao,
    cat,
    p.funcao === 'contagem' ? undefined : campoDe(p.categoria, p.medida)?.name,
    p.visualizacao === 'numero' ? undefined : campoDe(p.categoria, p.agruparPor)?.name,
    p.visualizacao === 'numero' ? undefined : campoDe(p.categoria, p.quebrarPor)?.name,
  )
}
const titulos = computed(() => Object.fromEntries(atual.value.paineis.map(p => [p.id, p.titulo.trim() || fraseDe(p)])))

const horaDaCarga = ref(new Date(2026, 10, 12, 12, 0))
const textoDeAtualizacao = computed(() => {
  const h = horaDaCarga.value.toLocaleTimeString(t.value.locale, { hour: '2-digit', minute: '2-digit' })
  return atual.value.recarga ? t.value.pagina.atualizado(h, atual.value.recarga) : t.value.pagina.atualizadoSemRecarga(h)
})

/* --------------------------------- menus ----------------------------------- */

const menuDosDashboards = computed<DropdownMenuItem[][]>(() => [
  dashboards.value.map(d => ({
    label: d.nome,
    description: t.value.pagina.paineis(d.paineis.length),
    icon: d.id === atual.value.id ? 'i-lucide-check' : 'i-lucide-chart-column',
    onSelect: () => { atualId.value = d.id },
  })),
  [{ label: t.value.pagina.novoDashboard, icon: 'i-lucide-plus', onSelect: () => abrirForm(false) }],
])

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
  if (formEditando.value) {
    Object.assign(atual.value, dados)
    toast.add({ title: t.value.formDashboard.salvo, icon: 'i-lucide-check', color: 'success' })
    return
  }
  const id = `d${Date.now()}`
  dashboards.value.push({ id, paineis: [], ...dados })
  atualId.value = id
  toast.add({ title: t.value.formDashboard.criado, icon: 'i-lucide-check', color: 'success' })
}
function duplicarDashboard() {
  const id = `d${Date.now()}`
  const copia = structuredClone(toRaw(atual.value))
  dashboards.value.push({ ...copia, id, nome: `${copia.nome} 2` })
  atualId.value = id
  toast.add({ title: t.value.pagina.duplicado, icon: 'i-lucide-copy', color: 'success' })
}
function excluirDashboard() {
  if (dashboards.value.length <= 1) return
  const nome = atual.value.nome
  dashboards.value = dashboards.value.filter(d => d.id !== atual.value.id)
  atualId.value = dashboards.value[0]!.id
  toast.add({ title: t.value.pagina.excluido, description: nome, icon: 'i-lucide-trash-2' })
}

/* -------------------------------- painéis ---------------------------------- */

const construtorAberto = ref(false)
const painelEmEdicao = ref<ConfigDoPainel | undefined>()
const baseDoNovo = ref<ConfigDoPainel>(painelEmBranco('novo'))

function novoPainel() {
  painelEmEdicao.value = undefined
  const ultima = atual.value.paineis[atual.value.paineis.length - 1]?.categoria
  baseDoNovo.value = painelEmBranco(`p${Date.now()}`, ultima)
  construtorAberto.value = true
}
function editarPainel(cfg: ConfigDoPainel) {
  painelEmEdicao.value = cfg
  construtorAberto.value = true
}
function salvarPainel(cfg: ConfigDoPainel, novo: boolean) {
  const lista = atual.value.paineis
  if (novo) lista.push(cfg)
  else lista.splice(lista.findIndex(p => p.id === cfg.id), 1, cfg)
  toast.add({ title: novo ? t.value.construtor.adicionado : t.value.construtor.salvo, icon: 'i-lucide-check', color: 'success' })
}
function duplicarPainel(cfg: ConfigDoPainel) {
  const lista = atual.value.paineis
  lista.splice(lista.findIndex(p => p.id === cfg.id) + 1, 0, { ...structuredClone(toRaw(cfg)), id: `p${Date.now()}` })
  toast.add({ title: t.value.painel.duplicado, icon: 'i-lucide-copy', color: 'success' })
}
function excluirPainel(cfg: ConfigDoPainel) {
  const lista = atual.value.paineis
  const i = lista.findIndex(p => p.id === cfg.id)
  lista.splice(i, 1)
  toast.add({
    title: t.value.painel.excluido,
    description: titulos.value[cfg.id],
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
  if (cfg.condicoes.length) recorte.push(t.value.painel.condicoes(cfg.condicoes.length))
  for (const f of filtros.value) {
    const comum = comuns.value.find(c => c.chave === f.chave)
    if (!comum || !f.valores.length || !comum.em[cfg.categoria]) continue
    const nomes = opcoesDoComum(comum).filter(o => f.valores.includes(o.value)).map(o => o.label)
    recorte.push(`${comum.nome}: ${nomes.join(', ')}`)
  }
  const ids = grupo ? (parte !== undefined ? grupo.idsDaParte[parte] ?? [] : grupo.ids) : r.ids
  detalhe.value = { aberto: true, cfg, ids, recorte }
}
</script>

<template>
  <CascaDoEnspace :t="t" :workspace="t.workspace" slug="teste-ux" :trilha="[t.trilhaDashboards, atual.nome]">
    <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <!-- ─────────────── Sem acesso ─────────────── -->
      <UEmpty
        v-if="estado === 'semAcesso'"
        icon="i-lucide-lock"
        :title="t.estados.semAcessoTitulo"
        :description="t.estados.semAcessoDescricao"
        class="m-auto"
      />

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
            </p>
          </div>

          <!-- As ações ficam no topo, à direita, onde estão hoje (regra 16). -->
          <div v-if="!somenteLeitura" class="flex shrink-0 items-center gap-2">
            <Transition name="fade" mode="out-in">
              <UButton v-if="!editavel" key="novo" :label="t.pagina.novoPainel" icon="i-lucide-plus" @click="novoPainel" />
            </Transition>
            <UButton
              :label="editavel ? t.pagina.concluir : t.pagina.personalizar"
              :icon="editavel ? 'i-lucide-check' : 'i-lucide-layout-dashboard'"
              :color="editavel ? 'primary' : 'neutral'"
              :variant="editavel ? 'solid' : 'outline'"
              :disabled="!atual.paineis.length || estado === 'vazio'"
              @click="editavel = !editavel"
            />
            <UDropdownMenu :items="maisAcoes" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" :loading="atualizando" :aria-label="t.pagina.maisAcoes" />
            </UDropdownMenu>
          </div>
        </header>

        <!-- ─────────────── Filtros do dashboard ─────────────── -->
        <div class="flex flex-wrap items-center justify-between gap-2 px-4 pb-4 sm:px-6">
          <FiltrosDoDashboard v-model:periodo="periodo" v-model:filtros="filtros" :t="t" :comuns="comuns" />
          <p class="text-xs text-muted">{{ textoDeAtualizacao }}</p>
        </div>

        <!-- ─────────────── Painéis ─────────────── -->
        <div class="flex-1 px-4 pb-28 sm:px-6">
          <UEmpty
            v-if="estado === 'vazio' || !atual.paineis.length"
            icon="i-lucide-chart-column"
            :title="t.estados.vazioTitulo"
            :description="t.estados.vazioDescricao"
            :actions="somenteLeitura ? [] : [{ label: t.pagina.novoPainel, icon: 'i-lucide-plus', onClick: novoPainel }]"
            variant="naked"
            class="mx-auto mt-10 max-w-md rounded-xl border border-dashed border-default py-12"
          />
          <GradeDoDashboard
            v-else
            :key="atual.id"
            :t="t"
            :dashboard="atual"
            :resultados="resultados"
            :estado-de="estadoDe"
            :titulos="titulos"
            :editavel="editavel"
            :somente-leitura="somenteLeitura"
            :rotulo-do-periodo="rotuloDoPeriodo"
            @editar="editarPainel"
            @duplicar="duplicarPainel"
            @excluir="excluirPainel"
            @csv="baixarCsv"
            @tentar="tentarDeNovo"
            @detalhar="detalhar"
            @concluir="editavel = false"
          />
        </div>
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

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Protótipo · estado</span>
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

<style scoped>
/* Troca do botão "Novo painel" ao entrar e sair de Personalizar. Motivo no DECISOES.md. */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
