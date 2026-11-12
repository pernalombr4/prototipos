<script setup lang="ts">
/**
 * Um painel do dashboard: a moldura do SDK (`EnDashboardPanel`) e o gráfico que a
 * configuração pede. O mesmo componente desenha a prévia do construtor, então o
 * que a pessoa vê enquanto configura é o que vai para a grade.
 *
 * O rodapé diz o que muda a leitura do número: o período que o painel usa, o filtro
 * do topo que não vale nele, a múltipla seleção e quantos grupos foram para "Outros".
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnChartBarListItem } from '@be-enlighten/enspace-sdk-ui/base'
import type { ConfigDoPainel, Grupo, Resultado } from './agregacao'
import { OUTROS, campoDe, ehMoeda } from './agregacao'
import { categoriaPorSlug } from './mocks'
import type { Textos } from './textos'
import { corDaSerie, formatarValor, porcentagem } from './formatar'
import GraficoBarras from './_GraficoBarras.vue'

const props = defineProps<{
  t: Textos
  cfg: ConfigDoPainel
  resultado: Resultado
  estado: 'pronto' | 'carregando' | 'erro'
  /** Na grade em modo Personalizar: o menu do painel some (o da grade assume). */
  editavel?: boolean
  /** Na prévia do construtor: sem menu e com altura fixa. */
  previa?: boolean
  /** Rótulo do período do topo, já no idioma ("Este ano"). */
  rotuloDoPeriodo: string
  /** Quem só lê o dashboard não edita, não duplica nem exclui. */
  somenteLeitura?: boolean
}>()

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

const frase = computed(() => props.t.frase(
  props.cfg.funcao,
  categoria.value?.name ?? '',
  props.cfg.funcao === 'contagem' ? undefined : medida.value?.name,
  props.cfg.visualizacao === 'numero' ? undefined : dim.value?.name,
  props.cfg.visualizacao === 'numero' ? undefined : quebra.value?.name,
))
const titulo = computed(() => props.cfg.titulo.trim() || frase.value)

const fmt = (v: number, compacto = false) => formatarValor(v, {
  locale: props.t.locale,
  moeda: ehMoeda(medida.value),
  funcao: props.cfg.funcao,
  compacto,
})

/* -------------------------------- o período -------------------------------- */

const campoDeData = computed(() => campoDe(props.cfg.categoria, props.cfg.campoDeData))
const textoDoPeriodo = computed(() => {
  if (props.cfg.periodo === 'todo') return props.t.painel.todoPeriodo
  const base = props.rotuloDoPeriodo
  return props.cfg.campoDeData === 'created_at' ? base : `${base}. ${props.t.painel.periodoPor(campoDeData.value?.name ?? '')}`
})

const info = computed(() => [
  props.t.painel.comoCalculamos(frase.value, textoDoPeriodo.value, props.cfg.condicoes.length),
  props.resultado.multiplo ? props.t.painel.multiplo : '',
  props.t.painel.permissao,
].filter(Boolean).join(' '))

/* ---------------------------------- estados -------------------------------- */

const semDados = computed(() => props.estado === 'pronto' && props.resultado.itens === 0)
const altura = computed(() => props.previa ? 200 : Math.max(150, props.cfg.h * 80 + (props.cfg.h - 1) * 16 - 150))

/* ----------------------------------- menu ---------------------------------- */

const menu = computed<DropdownMenuItem[][] | undefined>(() => {
  if (props.previa || props.editavel) return undefined
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
  <EnDashboardPanel
    :label="categoria?.name"
    :title="titulo"
    :value="cfg.visualizacao === 'numero' && estado === 'pronto' && !semDados ? fmt(resultado.total, true) : undefined"
    :info="info"
    :loading="estado === 'carregando'"
    :error="estado === 'erro' ? new Error(t.painel.erroTitulo) : undefined"
    :empty="semDados"
    :state-title="semDados ? t.painel.semDadosTitulo : estado === 'erro' ? t.painel.erroTitulo : undefined"
    :state-description="semDados ? t.painel.semDadosDescricao : estado === 'erro' ? t.painel.erroDescricao : undefined"
    :state-icon="semDados ? 'i-lucide-calendar-search' : undefined"
    :body-height="cfg.visualizacao === 'numero' ? 0 : altura"
    :menu="menu"
    :draggable="editavel"
    :locale="(t.locale as any)"
    class="h-full"
    @retry="emit('tentar')"
  >
    <!-- Número: o valor sai do cabeçalho do painel; aqui, o atalho para os itens. -->
    <div v-if="cfg.visualizacao === 'numero'" class="pt-1">
      <UButton
        v-if="!previa"
        :label="t.painel.verItens(resultado.itens)"
        color="neutral"
        variant="link"
        size="xs"
        trailing-icon="i-lucide-arrow-right"
        class="-ml-2"
        @click="emit('detalhar')"
      />
      <p v-else class="text-xs text-muted">{{ t.painel.itens(resultado.itens) }}</p>
    </div>

    <GraficoBarras
      v-else-if="cfg.visualizacao === 'barras'"
      :resultado="resultado"
      :altura="resultado.quebras.length ? altura - 32 : altura"
      :mostrar-valores="cfg.mostrarValores"
      :formatar="(v: number) => fmt(v, true)"
      :rotulo-total="t.painel.total"
      :rotulo-acessivel="titulo"
      :locale="t.locale"
      @detalhar="(g: Grupo, p?: string) => emit('detalhar', g, p)"
    />

    <div v-else-if="cfg.visualizacao === 'barrasHorizontais'" class="overflow-y-auto pr-1" :style="{ maxHeight: `${altura}px` }">
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
      v-else-if="cfg.visualizacao === 'linha' && !resultado.quebras.length"
      :data="linhas"
      x="x"
      :series="seriesDaLinha"
      :height="altura"
      :format-value="(v: number) => fmt(v, true)"
      :aria-label="titulo"
      :locale="(t.locale as any)"
    />
    <EnChartLine
      v-else-if="cfg.visualizacao === 'linha'"
      :data="linhas"
      x="x"
      :series="seriesDaLinha"
      :height="altura"
      :tooltip="dicaDaLinha"
      :aria-label="titulo"
      :locale="(t.locale as any)"
    />

    <EnChartArea
      v-else-if="cfg.visualizacao === 'area'"
      :data="linhas"
      x="x"
      :series="seriesDaLinha"
      :stacked="resultado.quebras.length > 0"
      :height="altura"
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
          :height="Math.min(altura, 220)"
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

    <ol v-else-if="cfg.visualizacao === 'funil'" class="space-y-1.5 overflow-y-auto" :style="{ maxHeight: `${altura}px` }">
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

    <div v-else-if="cfg.visualizacao === 'tabela'" class="overflow-auto" :style="{ maxHeight: `${altura}px` }">
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

    <template #footer>
      <div v-if="estado === 'pronto'" class="flex flex-wrap items-center gap-1.5">
        <UTooltip :text="textoDoPeriodo">
          <UBadge
            :label="cfg.periodo === 'todo' ? t.painel.todoPeriodo : (cfg.campoDeData === 'created_at' ? rotuloDoPeriodo : t.painel.periodoPor(campoDeData?.name ?? ''))"
            :icon="cfg.periodo === 'todo' ? 'i-lucide-infinity' : 'i-lucide-calendar'"
            color="neutral"
            variant="soft"
            size="sm"
          />
        </UTooltip>
        <UTooltip v-for="f in resultado.filtrosIgnorados" :key="f" :text="t.painel.filtroNaoSeAplica(f)">
          <UBadge :label="t.painel.filtroNaoSeAplicaCurto(f)" icon="i-lucide-filter-x" color="warning" variant="soft" size="sm" />
        </UTooltip>
        <UTooltip v-if="resultado.multiplo && cfg.visualizacao !== 'numero'" :text="t.painel.multiplo">
          <UBadge :label="t.painel.multiploCurto" icon="i-lucide-list-checks" color="info" variant="soft" size="sm" />
        </UTooltip>
        <UBadge v-if="resultado.emOutros" :label="t.painel.outros(resultado.emOutros)" icon="i-lucide-layers" color="neutral" variant="soft" size="sm" />
      </div>
    </template>
  </EnDashboardPanel>
</template>
