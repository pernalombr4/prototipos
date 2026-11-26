<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): a aba Painéis do projeto, com o painel que junta tarefas e itens.
 *
 * Por que juntar (lido no código em 2026-11-26):
 *  - o Painel de tarefas (/tasks/dashboard, SDK) tem catálogo fixo, período global (30 dias),
 *    filtros de categoria, responsável e status, e o Personalizar por pessoa;
 *  - a tela Paineis (dashboard de itens, legado) monta cada painel por formulário: 1 categoria,
 *    Tipo de gráfico, Agrupar por, Função e um campo de data com período próprio. Não tem filtro
 *    nem período do dashboard inteiro;
 *  - no projeto as 2 olham as mesmas categorias. O painel do projeto usa a barra e a grade do
 *    Painel de tarefas e aceita os painéis de itens da tela Paineis dentro da mesma grade.
 *
 * Barra: o painel escolhido, o período (EnDashboardPeriodPicker), Categoria e Responsável, Atualizar
 * dados, Personalizar e Novo painel. Em Personalizar, "Painel de itens" abre o formulário da tela
 * Paineis (Título, Categoria, Tipo de gráfico, Agrupar por, Função, Campo de data).
 */
import type { Textos } from './textos'
import type { FuncaoDoPainel, TipoDeGrafico } from './mocks'
import { pessoa } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { useMarcaDeProposta, useProjetos } from './estado'
import GradeDoProjeto from './_GradeDoProjeto.vue'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const r = useTextos(textosDoProjeto)
const rp = computed(() => r.value.painel)
const idioma = useIdioma()
const toast = useToast()
const { marca, marcaBack } = useMarcaDeProposta()

const p = computed(() => prj.projetos.value.find(x => x.id === props.id)!)
const admin = computed(() => prj.podeAdministrar(p.value))
const lista = computed(() => prj.dashboardsDe(props.id))
const categorias = computed(() => prj.categoriasDe(props.id))

/* o painel aberto: o do menu, ou o primeiro do projeto */
const atual = computed(() => lista.value.find(d => d.id === prj.dashboardAberto.value) ?? lista.value[0] ?? null)
watch(atual, (d) => { if (d && prj.dashboardAberto.value !== d.id) prj.dashboardAberto.value = d.id }, { immediate: true })
const escolhido = computed({
  get: () => atual.value?.id,
  set: (v) => { if (v) prj.abrirDashboard(v) },
})
const opDash = computed(() => lista.value.map(d => ({ value: d.id, label: d.nome, icon: 'i-lucide-chart-column' })))

/* filtros do painel */
const periodo = ref<any>('30d')
const FATOR: Record<string, number> = { '7d': 0.3, '30d': 1, '90d': 2.6, month: 0.9, quarter: 2.8, year: 9 }
const fator = computed(() => typeof periodo.value === 'string' ? (FATOR[periodo.value] ?? 1) : 1.4)
const fCat = ref<number | 'todas'>('todas')
const fResp = ref<number | 'todos'>('todos')
watch(() => props.id, () => { fCat.value = 'todas'; fResp.value = 'todos' })
const opCat = computed(() => [{ value: 'todas' as const, label: rp.value.todasCategorias }, ...categorias.value.map(c => ({ value: c.id, label: c.name, icon: c.icon }))])
const tarefasDoProjeto = computed(() => prj.tarefasDoProjeto(props.id))
const opResp = computed(() => [{ value: 'todos' as const, label: rp.value.todos }, ...[...new Set(tarefasDoProjeto.value.map(x => x.responsavel))].map(id => ({ value: id, label: pessoa(id)?.nome ?? '' }))])
const recorte = computed(() => tarefasDoProjeto.value.filter(x =>
  (fCat.value === 'todas' || x.categoria === fCat.value) && (fResp.value === 'todos' || x.responsavel === fResp.value)))

const atualizando = ref(false)
function atualizar() {
  atualizando.value = true
  setTimeout(() => {
    atualizando.value = false
    toast.add({ title: rp.value.atualizado, icon: 'i-lucide-check', color: 'success' })
  }, 600)
}
function novoPainel() {
  prj.criarDashboard(props.id, r.value.menu.nomeDoPainel)
}

/* ---------- Novo painel de itens: o formulário da tela Paineis ---------- */
const janela = ref(false)
const TIPOS: TipoDeGrafico[] = ['bar_chart', 'line_chart', 'pie_chart', 'donut_chart', 'area_chart', 'funnel_chart']
const FUNCOES: FuncaoDoPainel[] = ['count', 'countDistinct', 'mean', 'sum', 'median', 'variance']
const ICONE_DO_TIPO: Record<TipoDeGrafico, string> = {
  bar_chart: 'i-lucide-chart-column',
  line_chart: 'i-lucide-chart-line',
  pie_chart: 'i-lucide-chart-pie',
  donut_chart: 'i-lucide-circle-dashed',
  area_chart: 'i-lucide-chart-area',
  funnel_chart: 'i-lucide-filter',
}
const form = reactive({ titulo: '', categoria: 0, tipo: 'bar_chart' as TipoDeGrafico, agruparPor: 'Etapa do fluxo', funcao: 'count' as FuncaoDoPainel, campoDeData: 'Criado em' })
const opTipos = computed(() => TIPOS.map(x => ({ value: x, label: rp.value.tipos[x], icon: ICONE_DO_TIPO[x] })))
const opFuncoes = computed(() => FUNCOES.map(x => ({ value: x, label: rp.value.funcoes[x] })))
const opAgrupar = computed(() => [{ value: 'Etapa do fluxo', label: 'Etapa do fluxo' }, { value: 'Criado em', label: rp.value.porMes }, { value: 'Responsável', label: 'Responsável' }])
const opData = computed(() => [{ value: 'Criado em', label: rp.value.criadoEm }, { value: 'Vencimento', label: 'Vencimento' }, { value: 'Atualizado em', label: 'Atualizado em' }])
function abrirJanela() {
  Object.assign(form, { titulo: '', categoria: categorias.value[0]?.id ?? 0, tipo: 'bar_chart', agruparPor: 'Etapa do fluxo', funcao: 'count', campoDeData: 'Criado em' })
  janela.value = true
}
watch(() => form.agruparPor, (a) => { if (a === 'Criado em' && !['line_chart', 'area_chart'].includes(form.tipo)) form.tipo = 'area_chart' })
function adicionar() {
  if (!atual.value) return
  const titulo = form.titulo.trim()
  prj.adicionarPainelDeItens(atual.value.id, { id: `i-${Date.now()}`, ...form, titulo })
  janela.value = false
  toast.add({ title: rp.value.adicionado(titulo), icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <div :class="marca">
    <!-- nenhum painel no projeto -->
    <div v-if="!atual" class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-default px-6 py-14 text-center animate-[entrada_0.2s_ease-out_both]">
      <span class="flex size-11 items-center justify-center rounded-xl bg-elevated"><UIcon name="i-lucide-chart-column" class="size-5 text-muted" /></span>
      <p class="text-sm font-semibold text-highlighted">{{ rp.semTitulo }}</p>
      <p class="max-w-md text-sm text-muted">{{ rp.semTexto }}</p>
      <UButton v-if="admin" :label="rp.criar" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" class="mt-1" @click="novoPainel" />
    </div>

    <template v-else>
      <!-- barra do painel: a do Painel de tarefas -->
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <USelectMenu v-model="escolhido" :items="opDash" value-key="value" :search-input="false" size="sm" icon="i-lucide-chart-column" class="w-60" :aria-label="rp.escolher" />
        <EnDashboardPeriodPicker v-model="periodo" :presets="['7d', '30d', '90d', 'month', 'quarter', 'year']" custom size="sm" :locale="(idioma as any)" />
        <USelectMenu v-model="fCat" :items="opCat" value-key="value" :search-input="false" size="sm" :icon="fCat === 'todas' ? 'i-lucide-folder' : 'i-lucide-filter'" class="w-48" :ui="{ base: fCat === 'todas' ? '' : 'text-primary' }" :aria-label="rp.filtroCategoria" />
        <USelectMenu v-model="fResp" :items="opResp" value-key="value" size="sm" :icon="fResp === 'todos' ? 'i-lucide-user-round' : 'i-lucide-filter'" class="w-48" :ui="{ base: fResp === 'todos' ? '' : 'text-primary' }" :aria-label="rp.filtroResponsavel" />
        <div class="ml-auto flex items-center gap-2">
          <UTooltip :text="rp.atualizar">
            <UButton icon="i-lucide-refresh-cw" size="sm" color="neutral" variant="ghost" :loading="atualizando" :aria-label="rp.atualizar" @click="atualizar" />
          </UTooltip>
          <template v-if="admin">
            <UButton
              v-if="!prj.editandoDashboard.value"
              :label="rp.personalizar"
              icon="i-lucide-layout-grid"
              size="sm"
              color="neutral"
              variant="outline"
              @click="prj.editandoDashboard.value = true"
            />
            <template v-else>
              <UButton :label="rp.painelDeItens" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" :class="marcaBack" @click="abrirJanela" />
            </template>
            <UButton v-if="!prj.editandoDashboard.value" :label="rp.criar" icon="i-lucide-plus" size="sm" color="neutral" variant="ghost" @click="novoPainel" />
          </template>
        </div>
      </div>
      <p v-if="fResp !== 'todos' && atual.itens.length" class="-mt-2 mb-3 flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-info" class="size-3.5" />{{ rp.filtroNaoSeAplica }}
      </p>

      <GradeDoProjeto
        :key="atual.id"
        :dash="atual"
        :tarefas="recorte"
        :categoria="fCat === 'todas' ? null : fCat"
        :responsavel="fResp === 'todos' ? null : fResp"
        :fator="fator"
        :editavel="prj.editandoDashboard.value"
        @concluir="prj.editandoDashboard.value = false"
        @limpar="fCat = 'todas'"
      />
    </template>

    <!-- Novo painel de itens -->
    <UModal v-model:open="janela" :title="rp.janelaTitulo" :description="rp.janelaDescricao" :ui="{ content: 'max-w-lg' }">
      <template #body>
        <form id="form-painel-itens" class="grid gap-4 sm:grid-cols-2" @submit.prevent="form.titulo.trim() && form.categoria && adicionar()">
          <UFormField :label="rp.titulo" required class="sm:col-span-2">
            <UInput v-model="form.titulo" :placeholder="rp.tituloPh" class="w-full" autofocus />
          </UFormField>
          <UFormField :label="rp.categoria" required>
            <USelect v-model="form.categoria" :items="categorias.map(c => ({ value: c.id, label: c.name, icon: c.icon }))" class="w-full" />
          </UFormField>
          <UFormField :label="rp.tipo">
            <USelect v-model="form.tipo" :items="opTipos" class="w-full" />
          </UFormField>
          <UFormField :label="rp.agrupar">
            <USelect v-model="form.agruparPor" :items="opAgrupar" class="w-full" />
          </UFormField>
          <UFormField :label="rp.funcao">
            <USelect v-model="form.funcao" :items="opFuncoes" class="w-full" />
          </UFormField>
          <UFormField :label="rp.campoData" class="sm:col-span-2">
            <USelect v-model="form.campoDeData" :items="opData" class="w-full" />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="rp.cancelar" color="neutral" variant="ghost" @click="janela = false" />
          <UButton type="submit" form="form-painel-itens" :label="rp.adicionar" icon="i-lucide-plus" :disabled="!form.titulo.trim() || !form.categoria" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<style>
/* Andaime: a barra flutuante do Personalizar (SDK) sobe acima da barra do protótipo. */
.en-dashboard-toolbar { bottom: 6.5rem !important; z-index: 45 !important; }
</style>
