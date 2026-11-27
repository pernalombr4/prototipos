<script setup lang="ts">
/**
 * Um painel do dashboard. O mesmo componente desenha a prévia do construtor, então o
 * que a pessoa vê enquanto configura é o que vai para a grade.
 *
 * Rodada 2:
 * - o Cartão (o "Card" do Power BI) é o `EnStatCard` do SDK, o mesmo do painel de tarefas
 *   no develop: rótulo, número grande e a linha da tendência. O cartão inteiro é
 *   clicável e abre os itens; sem botão "Ver N itens";
 * - os outros painéis usam o `EnDashboardPanel`, com o subtítulo logo abaixo do título,
 *   como "Entrada e saída" no painel de tarefas. Sem selo de período no rodapé;
 * - o ícone de ajuda só existe quando a pessoa escreveu a descrição do painel;
 * - o ícone de filtro mostra os filtros que valem no painel e aceita filtros só da visão.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnChartBarListItem } from '@be-enlighten/enspace-sdk-ui/base'
import type { ConfigDoPainel, FiltroDeCampo, Grupo, Resultado } from './agregacao'
import { OUTROS, campoDe, ehMoeda } from './agregacao'
import { categoriaPorSlug } from './mocks'
import type { Textos } from './textos'
import { corDaSerie, formatarValor, porcentagem } from './formatar'
import GraficoBarras from './_GraficoBarras.vue'
import FiltroDoPainel from './_FiltroDoPainel.vue'

const props = defineProps<{
  t: Textos
  cfg: ConfigDoPainel
  resultado: Resultado
  /** A tendência do cartão, 1 valor por pedaço do período. */
  serie?: number[]
  estado: 'pronto' | 'carregando' | 'erro'
  /** Altura útil do painel na grade, em px. */
  altura?: number
  /** Na prévia do construtor: sem menu, sem filtro e sem clique. */
  previa?: boolean
  /** Rótulo do período do topo, já no idioma ("Este ano"). */
  rotuloDoPeriodo: string
  /** Quem só lê o dashboard não edita, não duplica nem exclui. */
  somenteLeitura?: boolean
  filtrosDoDashboard?: FiltroDeCampo[]
}>()

const filtrosDaVisao = defineModel<FiltroDeCampo[]>('filtrosDaVisao', { default: () => [] })

const emit = defineEmits<{
  editar: []
  duplicar: []
  excluir: []
  csv: []
  tentar: []
  detalhar: [grupo?: Grupo, parte?: string]
}>()

const categoria = computed(() => categoriaPorSlug.get(props.cfg.categoria))
const medida = computed(() => campoDe(props.cfg.categoria, props.cfg.medida))
const dim = computed(() => campoDe(props.cfg.categoria, props.cfg.agruparPor))
const quebra = computed(() => campoDe(props.cfg.categoria, props.cfg.quebrarPor))
const cartao = computed(() => props.cfg.visualizacao === 'numero')

const frase = computed(() => props.t.frase(
  props.cfg.funcao,
  categoria.value?.name ?? '',
  props.cfg.funcao === 'contagem' ? undefined : medida.value?.name,
  cartao.value ? undefined : dim.value?.name,
  cartao.value ? undefined : quebra.value?.name,
))
const titulo = computed(() => props.cfg.titulo.trim() || frase.value)

const fmt = (v: number, compacto = false) => formatarValor(v, {
  locale: props.t.locale,
  moeda: ehMoeda(medida.value),
  funcao: props.cfg.funcao,
  compacto,
})

/* ------------------------------- o subtítulo ------------------------------- */

/** "Contratos · Este ano, por Data de assinatura": a categoria e o período que o número usa. */
const subtitulo = computed(() => {
  const campoDeData = campoDe(props.cfg.categoria, props.cfg.campoDeData)
  const periodo = props.cfg.periodo === 'todo'
    ? props.t.painel.todoPeriodo
    : props.cfg.campoDeData === 'created_at' ? props.rotuloDoPeriodo : props.t.painel.periodoPor(props.rotuloDoPeriodo, campoDeData?.name ?? '')
  const partes = [categoria.value?.name, periodo]
  if (props.resultado.multiplo && !cartao.value) partes.push(props.t.painel.multiploCurto)
  return partes.filter(Boolean).join(' · ')
})

/* ---------------------------------- estados -------------------------------- */

const semDados = computed(() => props.estado === 'pronto' && props.resultado.itens === 0)
/** A altura do gráfico: a do painel menos o cabeçalho com título e subtítulo. */
/* Cabeçalho do EnDashboardPanel (41 px), subtítulo (32 px) e respiro de baixo: 140 px fora do gráfico. */
const alturaDoGrafico = computed(() => props.previa ? 220 : Math.max(100, (props.altura ?? 320) - 140))

/* ----------------------------------- menu ---------------------------------- */

const menu = computed<DropdownMenuItem[][] | undefined>(() => {
  if (props.previa) return undefined
  const ver = [{ label: props.t.painel.menu.verItens, icon: 'i-lucide-list', onSelect: () => emit('detalhar') }, { label: props.t.painel.menu.baixarCsv, icon: 'i-lucide-download', onSelect: () => emit('csv') }]
  if (props.somenteLeitura) return [ver]
  return [
    [{ label: props.t.painel.menu.editar, icon: 'i-lucide-pencil', onSelect: () => emit('editar') }, { label: props.t.painel.menu.duplicar, icon: 'i-lucide-copy', onSelect: () => emit('duplicar') }],
    ver,
    [{ label: props.t.painel.menu.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => emit('excluir') }],
  ]
})

/* ---------------------------- dados de cada gráfico ------------------------- */

const total = computed(() => props.resultado.grupos.reduce((s, g) => s + g.valor, 0))

const itensDoRanking = computed<EnChartBarListItem[]>(() => props.resultado.grupos.map((g, i) => ({
  key: g.chave,
  label: g.rotulo,
  value: props.resultado.quebras.length ? props.resultado.quebras.reduce((s, q) => s + (g.partes[q.chave] ?? 0), 0) : g.valor,
  color: corDaSerie(g.chave, 0),
  hint: g.chave === OUTROS ? props.t.painel.outros(props.resultado.emOutros) : undefined,
  segments: props.resultado.quebras.length
    ? props.resultado.quebras.map((q, k) => ({ key: q.chave, value: g.partes[q.chave] ?? 0, color: corDaSerie(q.chave, k), label: q.rotulo }))
    : undefined,
})))
const legendaDoRanking = computed(() => props.resultado.quebras.map((q, k) => ({ key: q.chave, label: q.rotulo, color: corDaSerie(q.chave, k) })))

/** Linha e área: 1 ponto por balde, 1 série por parte da divisão (ou só "valor"). */
const linhas = computed(() => props.resultado.grupos.map((g) => {
  const linha: Record<string, unknown> = { x: g.rotulo }
  if (props.resultado.quebras.length) for (const q of props.resultado.quebras) linha[q.chave] = g.partes[q.chave] ?? 0
  else linha.valor = g.valor
  return linha
}))
const seriesDaLinha = computed(() => props.resultado.quebras.length
  ? props.resultado.quebras.map((q, k) => ({ key: q.chave, label: q.rotulo, color: corDaSerie(q.chave, k) }))
  : [{ key: 'valor', label: medida.value?.name ?? props.t.funcoes.contagem, color: 'var(--ui-color-primary-500)', area: true }])

/** Remonta a linha quando as séries mudam: o unovis não tira a série que saiu. */
const chaveDasSeries = computed(() => seriesDaLinha.value.map(x => x.key).join('|'))

const escapar = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
function dicaDaLinha(d: Record<string, unknown>) {
  const partes = seriesDaLinha.value
    .map(s => `<p class="text-sm text-highlighted"><span style="color:${s.color}">●</span> ${escapar(s.label)}: <b>${escapar(fmt(Number(d[s.key] ?? 0)))}</b></p>`)
    .join('')
  return `<div class="px-1 py-0.5 space-y-0.5"><p class="text-[11px] text-muted">${escapar(String(d.x))}</p>${partes}</div>`
}

const fatias = computed(() => props.resultado.grupos.filter(g => g.valor > 0).map((g, i) => ({ grupo: g, rotulo: g.rotulo, valor: g.valor, cor: corDaSerie(g.chave, i) })))

/** Funil: a largura é a fração da 1ª etapa; a passagem, da etapa anterior. */
const etapas = computed(() => {
  const grupos = props.resultado.grupos
  const primeira = grupos[0]?.valor || 1
  return grupos.map((g, i) => ({
    grupo: g,
    largura: Math.max(2, (g.valor / primeira) * 100),
    passagem: i === 0 ? props.t.painel.primeiraEtapa : props.t.painel.daEtapaAnterior(porcentagem(grupos[i - 1]!.valor ? g.valor / grupos[i - 1]!.valor : 0, props.t.locale)),
  }))
})

function selecionarDoRanking(item: EnChartBarListItem) {
  const g = props.resultado.grupos.find(x => x.chave === item.key)
  if (g && g.ids.length) emit('detalhar', g)
}
</script>

<template>
  <!-- ─────────── Cartão: o EnStatCard do SDK, clicável inteiro ─────────── -->
  <div v-if="cartao && estado !== 'erro'" class="relative h-full [&>:first-child]:h-full [&>:first-child]:min-h-0">
    <EnStatCard
      :label="titulo"
      :value="semDados ? fmt(0, true) : fmt(resultado.total, true)"
      :hint="semDados ? t.painel.semDadosTitulo : subtitulo"
      :series="semDados ? undefined : serie"
      :loading="estado === 'carregando'"
      :interactive="!previa && !semDados"
      :locale="t.locale"
      @click="emit('detalhar')"
    />
    <div v-if="!previa" class="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-md bg-default/80 backdrop-blur-sm">
      <UPopover v-if="cfg.descricao.trim()" :content="{ align: 'end' }">
        <UButton icon="i-lucide-info" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.ajuda" />
        <template #content><p class="max-w-xs p-3 text-sm text-muted">{{ cfg.descricao }}</p></template>
      </UPopover>
      <FiltroDoPainel
        v-model="filtrosDaVisao"
        :t="t"
        :cfg="cfg"
        :do-dashboard="filtrosDoDashboard ?? []"
        :pode-editar="!somenteLeitura"
        @editar="emit('editar')"
      />
      <UDropdownMenu v-if="menu" :items="menu" :content="{ align: 'end' }">
        <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.acoes" />
      </UDropdownMenu>
    </div>
  </div>

  <!-- ─────────── Gráficos: o EnDashboardPanel do SDK ─────────── -->
  <EnDashboardPanel
    v-else
    :title="titulo"
    :info="cfg.descricao.trim() || undefined"
    :loading="estado === 'carregando'"
    :error="estado === 'erro' ? new Error(t.painel.erroTitulo) : undefined"
    :empty="semDados"
    :state-title="semDados ? t.painel.semDadosTitulo : estado === 'erro' ? t.painel.erroTitulo : undefined"
    :state-description="semDados ? t.painel.semDadosDescricao : estado === 'erro' ? t.painel.erroDescricao : undefined"
    :state-icon="semDados ? 'i-lucide-calendar-search' : undefined"
    :body-height="cartao ? 80 : alturaDoGrafico"
    :menu="menu"
    :locale="(t.locale as any)"
    class="h-full"
    @retry="emit('tentar')"
  >
    <template v-if="!previa" #actions>
      <FiltroDoPainel
        v-model="filtrosDaVisao"
        :t="t"
        :cfg="cfg"
        :do-dashboard="filtrosDoDashboard ?? []"
        :pode-editar="!somenteLeitura"
        @editar="emit('editar')"
      />
    </template>

    <div class="px-4 pb-4">
    <!-- O subtítulo, logo abaixo do título, como no painel de tarefas -->
    <p class="-mt-0.5 mb-3 truncate text-sm text-muted">{{ subtitulo }}</p>

    <GraficoBarras
      v-if="cfg.visualizacao === 'barras'"
      :resultado="resultado"
      :altura="resultado.quebras.length ? alturaDoGrafico - 32 : alturaDoGrafico"
      :mostrar-valores="cfg.mostrarValores"
      :formatar="(v: number) => fmt(v, true)"
      :rotulo-total="t.painel.total"
      :rotulo-acessivel="titulo"
      :locale="t.locale"
      @detalhar="(g: Grupo, p?: string) => emit('detalhar', g, p)"
    />

    <div v-else-if="cfg.visualizacao === 'barrasHorizontais'" class="overflow-y-auto pr-1" :style="{ maxHeight: `${alturaDoGrafico}px` }">
      <EnChartBarList
        :items="itensDoRanking"
        :segments-legend="legendaDoRanking.length ? legendaDoRanking : undefined"
        :format-value="(v: number) => fmt(v, true)"
        :locale="t.locale"
        interactive
        @select="selecionarDoRanking"
      />
    </div>

    <!--
      Linha de 1 série vai pelo EnChartArea: o EnChartLine do SDK 0.21 não aceita
      formatValue e o eixo sai "3000000". Com divisão, as linhas são do EnChartLine.
    -->
    <EnChartArea
      :key="chaveDasSeries"
      v-else-if="cfg.visualizacao === 'linha' && !resultado.quebras.length"
      :data="linhas"
      x="x"
      :series="seriesDaLinha"
      :height="alturaDoGrafico"
      :format-value="(v: number) => fmt(v, true)"
      :aria-label="titulo"
      :locale="(t.locale as any)"
    />
    <EnChartLine
      :key="chaveDasSeries"
      v-else-if="cfg.visualizacao === 'linha'"
      :data="linhas"
      x="x"
      :series="seriesDaLinha"
      :height="alturaDoGrafico"
      :tooltip="dicaDaLinha"
      :aria-label="titulo"
      :locale="(t.locale as any)"
    />

    <EnChartArea
      :key="chaveDasSeries"
      v-else-if="cfg.visualizacao === 'area'"
      :data="linhas"
      x="x"
      :series="seriesDaLinha"
      :stacked="resultado.quebras.length > 0"
      :height="alturaDoGrafico"
      :legend="resultado.quebras.length > 0"
      :format-value="(v: number) => fmt(v, true)"
      :aria-label="titulo"
      :locale="(t.locale as any)"
    />

    <div v-else-if="cfg.visualizacao === 'rosca'" class="flex h-full flex-col items-center gap-3 sm:flex-row">
      <div class="w-full min-w-0 sm:w-1/2">
        <EnChartDonut
          :data="fatias"
          label="rotulo"
          value="valor"
          :color="(d: any) => d.cor"
          :arc-width="22"
          :central-label="fmt(total, true)"
          :central-sub-label="t.funcoes[cfg.funcao]"
          :height="Math.min(alturaDoGrafico, 220)"
          :aria-label="titulo"
          :locale="(t.locale as any)"
        />
      </div>
      <ul class="w-full min-w-0 space-y-0.5 sm:w-1/2">
        <li v-for="f in fatias" :key="f.grupo.chave">
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
            :disabled="previa"
            @click="emit('detalhar', f.grupo)"
          >
            <span class="size-2.5 shrink-0 rounded-sm" :style="{ backgroundColor: f.cor }" />
            <span class="min-w-0 flex-1 truncate text-toned">{{ f.rotulo }}</span>
            <span class="shrink-0 font-medium tabular-nums text-highlighted">{{ fmt(f.valor, true) }}</span>
            <span class="w-9 shrink-0 text-right text-xs tabular-nums text-muted">{{ porcentagem(total ? f.valor / total : 0, t.locale) }}</span>
          </button>
        </li>
      </ul>
    </div>

    <ol v-else-if="cfg.visualizacao === 'funil'" class="space-y-1.5 overflow-y-auto" :style="{ maxHeight: `${alturaDoGrafico}px` }">
      <li v-for="(e, i) in etapas" :key="e.grupo.chave">
        <button
          type="button"
          class="group w-full rounded-md px-1 py-0.5 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
          :disabled="previa || !e.grupo.ids.length"
          @click="emit('detalhar', e.grupo)"
        >
          <span class="flex items-baseline justify-between gap-2 text-xs">
            <span class="truncate font-medium text-toned">{{ e.grupo.rotulo }}</span>
            <span class="shrink-0 tabular-nums text-highlighted">{{ fmt(e.grupo.valor, true) }}</span>
          </span>
          <span class="mt-1 flex justify-center">
            <span
              class="block h-5 rounded-sm transition-[width] duration-500 ease-out group-hover:brightness-110"
              :style="{ width: `${e.largura}%`, backgroundColor: corDaSerie(e.grupo.chave, i) }"
            />
          </span>
          <span class="mt-0.5 block text-center text-[11px] text-muted">{{ e.passagem }}</span>
        </button>
      </li>
    </ol>

    <div v-else-if="cfg.visualizacao === 'tabela'" class="overflow-auto" :style="{ maxHeight: `${alturaDoGrafico}px` }">
      <table class="w-full text-sm">
        <thead class="sticky top-0 bg-default">
          <tr class="border-b border-default text-left text-xs text-muted">
            <th class="py-1.5 pr-3 font-medium">{{ dim?.name }}</th>
            <th v-for="q in resultado.quebras" :key="q.chave" class="px-3 py-1.5 text-right font-medium">{{ q.rotulo }}</th>
            <th class="px-3 py-1.5 text-right font-medium">{{ resultado.quebras.length ? t.painel.total : t.funcoes[cfg.funcao] }}</th>
            <th v-if="cfg.funcao === 'contagem' || cfg.funcao === 'soma'" class="py-1.5 pl-3 text-right font-medium">{{ t.painel.colunaDoTotal }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="g in resultado.grupos"
            :key="g.chave"
            class="cursor-pointer border-b border-default/60 transition-colors last:border-0 hover:bg-elevated"
            tabindex="0"
            @click="!previa && g.ids.length && emit('detalhar', g)"
            @keydown.enter="!previa && g.ids.length && emit('detalhar', g)"
          >
            <td class="max-w-56 truncate py-1.5 pr-3 text-toned">{{ g.rotulo }}</td>
            <td v-for="q in resultado.quebras" :key="q.chave" class="px-3 py-1.5 text-right tabular-nums text-toned">{{ fmt(g.partes[q.chave] ?? 0) }}</td>
            <td class="px-3 py-1.5 text-right font-medium tabular-nums text-highlighted">{{ fmt(g.valor) }}</td>
            <td v-if="cfg.funcao === 'contagem' || cfg.funcao === 'soma'" class="py-1.5 pl-3 text-right tabular-nums text-muted">
              {{ porcentagem(total ? g.valor / total : 0, t.locale) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    </div>
  </EnDashboardPanel>
</template>
