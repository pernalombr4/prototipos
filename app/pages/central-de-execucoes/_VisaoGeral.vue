<script setup lang="ts">
/**
 * PROPOSTA: a Visão geral do Spaceflow. Não existe hoje.
 *
 * - 5 números: Rodando agora e Esperando (o momento) e Com erro, Concluídas e Paradas pela
 *   plataforma (o período, comparado ao anterior). Cada número abre a lista com o filtro;
 * - "Precisa de atenção": uma linha por fluxo, com a causa em palavras, o que fazer, o dono, o
 *   último item e a situação (Precisa de revisão, Resolvido, Ignorado, Adiado). Reprocessar as
 *   falhas mostra antes os itens afetados;
 * - execuções por dia (ou por hora) e os fluxos com mais falhas, em barras;
 * - a saúde de cada operação, com o atalho para o mapa.
 */
import { categorias } from './mocks'
import type { Dados, Fase, FiltroDaLista, Periodo, Problema } from './consultas'
import { AGORA_MS, filtroVazio, fluxosComMaisFalhas, itemPorId, numeros, problemas, saudeDasOperacoes, serie } from './consultas'
import type { EstadoDoProblema, Textos } from './textos'

const props = defineProps<{
  t: Textos
  dados: Dados
  fase: Fase
  carregando?: boolean
}>()

const periodo = defineModel<Periodo>('periodo', { required: true })
const estados = defineModel<Record<number, EstadoDoProblema>>('estados', { required: true })
const emit = defineEmits<{
  filtrar: [FiltroDaLista]
  abrirExecucao: [number]
  abrirItem: [number]
  verMapa: [string]
  /** PROPOSTA: abre a aba Operações, onde se cria e edita a regra de cada uma. */
  gerenciarOperacoes: []
}>()

const toast = useToast()

const n = computed(() => numeros(props.dados.execucoes, periodo.value))
const lista = computed(() => problemas(props.dados.execucoes, periodo.value))
const estadoDe = (p: Problema) => estados.value[p.fluxo.id] ?? 'revisar'
const abertos = computed(() => lista.value.filter(p => estadoDe(p) === 'revisar'))
const tratados = computed(() => lista.value.filter(p => estadoDe(p) !== 'revisar'))
const mostrarTratados = ref(false)
const barras = computed(() => serie(props.dados.execucoes, periodo.value, props.t.locale))
const maxBarra = computed(() => Math.max(1, ...barras.value.map(b => b.concluidas + b.erro + b.outras)))
const falhas = computed(() => fluxosComMaisFalhas(props.dados.execucoes, periodo.value))
const maxFalha = computed(() => Math.max(1, ...falhas.value.map(f => f.n)))
const operacoesComSaude = computed(() => saudeDasOperacoes(props.dados, periodo.value))

const periodos = computed(() => (['h24', 'd7'] as Periodo[]).map(p => ({ label: props.t.periodo.opcoes[p], value: p })))

/* ---------- números ---------- */
interface Numero { chave: string, rotulo: string, valor: number, legenda: string, icone: string, cor: string, filtro: FiltroDaLista, delta?: number, ruimSeSobe?: boolean }
const tiles = computed<Numero[]>(() => [
  { chave: 'rodando', rotulo: props.t.kpi.rodando, valor: n.value.rodando, legenda: props.t.kpi.agora, icone: 'i-lucide-loader', cor: 'text-info', filtro: { ...filtroVazio(), grupos: ['rodando'], soOrigem: false } },
  { chave: 'esperando', rotulo: props.t.kpi.esperando, valor: n.value.esperando, legenda: props.t.kpi.esperandoPartes(n.value.esperandoPessoa, n.value.naFila), icone: 'i-lucide-hourglass', cor: 'text-warning', filtro: { ...filtroVazio(), grupos: ['esperando'], soOrigem: false } },
  { chave: 'erro', rotulo: props.t.kpi.erro, valor: n.value.erro.n, delta: n.value.erro.delta, ruimSeSobe: true, legenda: '', icone: 'i-lucide-circle-x', cor: 'text-error', filtro: { ...filtroVazio(), grupos: ['erro'], soOrigem: false, periodo: periodo.value } },
  { chave: 'paradas', rotulo: props.t.kpi.paradas, valor: n.value.paradas.n, delta: n.value.paradas.delta, ruimSeSobe: true, legenda: '', icone: 'i-lucide-octagon-x', cor: 'text-error', filtro: { ...filtroVazio(), grupos: ['parada'], soOrigem: false, periodo: periodo.value } },
  { chave: 'concluidas', rotulo: props.t.kpi.concluidas, valor: n.value.concluidas.n, delta: n.value.concluidas.delta, legenda: '', icone: 'i-lucide-circle-check', cor: 'text-success', filtro: { ...filtroVazio(), grupos: ['concluida'], soOrigem: false, periodo: periodo.value } },
])

/* ---------- atualizar ---------- */
const atualizando = ref(false)
const horaDaAtualizacao = ref(AGORA_MS)
async function atualizar() {
  atualizando.value = true
  await new Promise(r => setTimeout(r, 600))
  atualizando.value = false
  horaDaAtualizacao.value = AGORA_MS + 60_000
}

/* ---------- reprocessar falhas ---------- */
const reprocessando = ref<Problema | null>(null)
const confirmando = ref(false)
const modalAberto = computed({ get: () => !!reprocessando.value, set: (v) => { if (!v) reprocessando.value = null } })
const itensAfetados = computed(() => {
  const vistos = new Map<number, string>()
  for (const e of reprocessando.value?.falhas ?? []) {
    if (!e.item) continue
    const i = itemPorId.get(e.item)
    if (i) vistos.set(i.id, `${i.reference} ${i.titulo}`)
  }
  return [...vistos.entries()]
})

async function confirmarReprocesso() {
  if (!reprocessando.value) return
  confirmando.value = true
  await new Promise(r => setTimeout(r, 800))
  const p = reprocessando.value
  confirmando.value = false
  estados.value = { ...estados.value, [p.fluxo.id]: 'resolvido' }
  reprocessando.value = null
  toast.add({ title: props.t.atencao.modal.feito(p.falhas.length), description: props.t.atencao.modal.feitoDesc, icon: 'i-lucide-rotate-ccw', color: 'success' })
}

function mudarEstado(p: Problema, e: EstadoDoProblema) {
  estados.value = { ...estados.value, [p.fluxo.id]: e }
}
const opcoesDeEstado = (p: Problema) => (['revisar', 'resolvido', 'ignorado', 'adiado'] as EstadoDoProblema[])
  .map(e => ({ label: props.t.atencao.estados[e], icon: e === estadoDe(p) ? 'i-lucide-check' : undefined, onSelect: () => mudarEstado(p, e) }))
const corDoEstado: Record<EstadoDoProblema, 'error' | 'success' | 'neutral' | 'warning'> = { revisar: 'error', resolvido: 'success', ignorado: 'neutral', adiado: 'warning' }

const formatoHora = computed(() => new Intl.DateTimeFormat(props.t.locale, { hour: '2-digit', minute: '2-digit' }))
const formatoDia = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }))
const seloDaOperacao = { ok: { cor: 'success', icone: 'i-lucide-circle-check' }, atencao: { cor: 'warning', icone: 'i-lucide-triangle-alert' }, falha: { cor: 'error', icone: 'i-lucide-circle-x' } } as const
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto flex max-w-7xl flex-col gap-6 p-5">
      <!-- Período e atualização -->
      <div class="flex flex-wrap items-center gap-2">
        <USelect v-model="periodo" :items="periodos" icon="i-lucide-calendar-range" size="sm" class="w-48" :aria-label="t.periodo.rotulo" />
        <span class="text-xs text-muted">{{ t.periodo.comparado[periodo] }}</span>
        <span class="ml-auto text-xs text-muted">{{ t.periodo.atualizado(formatoHora.format(horaDaAtualizacao)) }}</span>
        <UButton :label="t.periodo.atualizar" icon="i-lucide-refresh-cw" size="xs" color="neutral" variant="outline" :loading="atualizando" @click="atualizar" />
      </div>

      <!-- Números -->
      <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <template v-if="carregando">
          <USkeleton v-for="k in 5" :key="k" class="h-28 rounded-lg" />
        </template>
        <button
          v-for="(k, i) in tiles"
          v-else
          :key="k.chave"
          type="button"
          class="group flex animate-[entrada_.3s_ease-out_both] flex-col gap-1 rounded-lg border border-default bg-default p-4 text-left transition hover:-translate-y-0.5 hover:border-accented hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
          :style="{ animationDelay: `${i * 50}ms` }"
          :aria-label="`${k.rotulo}: ${k.valor}. ${t.kpi.abrirLista}`"
          @click="emit('filtrar', k.filtro)"
        >
          <span class="flex items-center gap-1.5 text-sm text-toned">
            <UIcon :name="k.icone" class="size-4" :class="k.cor" />
            {{ k.rotulo }}
          </span>
          <span class="text-3xl font-semibold tabular-nums text-highlighted">{{ k.valor.toLocaleString(t.locale) }}</span>
          <span v-if="k.delta === undefined" class="text-xs text-muted">{{ k.legenda }}</span>
          <span
            v-else
            class="flex items-center gap-1 text-xs"
            :class="k.delta === 0 ? 'text-muted' : (k.delta > 0) === !!k.ruimSeSobe ? 'text-error' : 'text-success'"
          >
            <UIcon :name="k.delta === 0 ? 'i-lucide-minus' : k.delta > 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down'" class="size-3.5" />
            {{ t.kpi.delta(k.delta) }}
          </span>
          <span class="mt-1 flex items-center gap-1 text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {{ t.kpi.abrirLista }} <UIcon name="i-lucide-arrow-right" class="size-3" />
          </span>
        </button>
      </div>

      <!-- Precisa de atenção -->
      <section class="rounded-lg border border-default" aria-labelledby="titulo-atencao">
        <header class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-3">
          <UIcon name="i-lucide-siren" class="size-4 text-error" />
          <h2 id="titulo-atencao" class="text-sm font-semibold text-highlighted">{{ t.atencao.titulo }}</h2>
          <UBadge v-if="abertos.length" :label="String(abertos.length)" color="error" variant="subtle" size="sm" />
          <p class="w-full text-xs text-muted sm:ml-2 sm:w-auto">{{ t.atencao.descricao }}</p>
        </header>

        <div v-if="carregando" class="flex flex-col gap-2 p-4">
          <USkeleton v-for="k in 3" :key="k" class="h-16" />
        </div>
        <UEmpty
          v-else-if="!abertos.length"
          icon="i-lucide-shield-check"
          :title="t.atencao.vazio"
          :description="t.atencao.vazioDesc"
          variant="naked"
          class="py-8"
        />
        <ul v-else class="divide-y divide-default">
          <li
            v-for="(p, i) in abertos"
            :key="p.fluxo.id"
            class="grid animate-[entrada_.3s_ease-out_both] gap-3 px-4 py-3 transition-colors hover:bg-elevated/40 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_8.5rem_24rem]"
            :style="{ animationDelay: `${i * 40}ms` }"
          >
            <!-- Fluxo -->
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-highlighted">{{ p.fluxo.name }}</p>
              <p class="text-xs text-muted">{{ t.operacoes.dono(p.fluxo.dono) }}</p>
            </div>
            <!-- Problema e o que fazer -->
            <div class="min-w-0">
              <p class="flex items-center gap-1.5 text-sm text-highlighted">
                <UIcon :name="p.causa === 'cadeia' ? 'i-lucide-octagon-x' : 'i-lucide-circle-x'" class="size-4 shrink-0 text-error" />
                <span class="truncate">{{ t.causas[p.causa].titulo }}</span>
              </p>
              <p class="mt-0.5 text-xs text-muted">
                {{ t.atencao.ocorrencias(p.falhas.length, formatoDia.format(p.desde)) }}. {{ t.causas[p.causa].acao }}
              </p>
            </div>
            <!-- Último item -->
            <div class="min-w-0">
              <p class="text-xs text-muted">{{ t.atencao.colunas.ultimoItem }}</p>
              <UButton
                v-if="p.ultimoItem"
                :label="p.ultimoItem.reference ?? ''"
                :icon="categorias[p.ultimoItem.categoria].icone"
                size="xs"
                color="neutral"
                variant="link"
                class="px-0"
                @click="emit('abrirItem', p.ultimoItem.id)"
              />
            </div>
            <!-- Ações -->
            <div class="flex flex-wrap items-center gap-1.5 lg:justify-end">
              <UDropdownMenu :items="opcoesDeEstado(p)" :ui="{ content: 'w-48' }">
                <UButton :label="t.atencao.estados[estadoDe(p)]" trailing-icon="i-lucide-chevron-down" size="xs" :color="corDoEstado[estadoDe(p)]" variant="subtle" :aria-label="`${t.atencao.colunas.estado}: ${t.atencao.estados[estadoDe(p)]}`" />
              </UDropdownMenu>
              <UButton
                v-if="p.causa === 'cadeia'"
                :label="t.atencao.verCadeia"
                icon="i-lucide-git-fork"
                size="xs"
                color="neutral"
                variant="outline"
                @click="emit('abrirExecucao', p.ultima.id)"
              />
              <UButton
                v-else
                :label="t.atencao.reprocessar"
                icon="i-lucide-rotate-ccw"
                size="xs"
                color="primary"
                variant="outline"
                @click="reprocessando = p"
              />
              <UButton
                :label="t.atencao.verFalhas"
                icon="i-lucide-list"
                size="xs"
                color="neutral"
                variant="ghost"
                @click="emit('filtrar', { ...filtroVazio(), fluxos: [p.fluxo.id], grupos: ['erro', 'parada'], soOrigem: false, periodo })"
              />
            </div>
          </li>
        </ul>

        <!-- Os tratados ficam escondidos e voltam se o fluxo falhar de novo -->
        <div v-if="tratados.length && !carregando" class="border-t border-default px-4 py-2">
          <UButton
            :label="mostrarTratados ? t.atencao.esconderTratados : t.atencao.mostrarTratados(tratados.length)"
            :trailing-icon="mostrarTratados ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="mostrarTratados = !mostrarTratados"
          />
          <ul v-if="mostrarTratados" class="mt-1 flex flex-col gap-1 pb-1">
            <li v-for="p in tratados" :key="p.fluxo.id" class="flex flex-wrap items-center gap-2 rounded-md px-2 py-1.5 text-sm text-toned">
              <UBadge :label="t.atencao.estados[estadoDe(p)]" :color="corDoEstado[estadoDe(p)]" variant="subtle" size="sm" />
              <span class="font-medium">{{ p.fluxo.name }}</span>
              <span class="text-muted">{{ t.causas[p.causa].titulo }}</span>
              <span class="text-xs text-dimmed">{{ t.atencao.reabre }}</span>
              <UButton :label="t.atencao.estados.revisar" size="xs" color="neutral" variant="link" class="ml-auto" @click="mudarEstado(p, 'revisar')" />
            </li>
          </ul>
        </div>
      </section>

      <!-- Gráficos -->
      <div class="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section class="rounded-lg border border-default p-4" aria-labelledby="titulo-por-dia">
          <header class="mb-3 flex flex-wrap items-center gap-3">
            <h2 id="titulo-por-dia" class="text-sm font-semibold text-highlighted">{{ periodo === 'h24' ? t.graficos.porHora : t.graficos.porDia }}</h2>
            <span class="ml-auto flex items-center gap-3 text-xs text-toned">
              <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-sm bg-success" />{{ t.graficos.concluidas }}</span>
              <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-sm bg-error" />{{ t.graficos.erro }}</span>
              <span class="flex items-center gap-1.5"><span class="size-2.5 rounded-sm bg-accented" />{{ t.graficos.outras }}</span>
            </span>
          </header>
          <USkeleton v-if="carregando" class="h-44" />
          <div v-else class="flex h-44 items-end gap-1 border-b border-default" role="list">
            <UTooltip
              v-for="(b, i) in barras"
              :key="b.inicio"
              :text="`${b.rotulo}: ${t.graficos.valor(t.graficos.concluidas, b.concluidas)}, ${t.graficos.valor(t.graficos.erro, b.erro)}, ${t.graficos.valor(t.graficos.outras, b.outras)}`"
            >
              <button
                type="button"
                role="listitem"
                class="group flex h-full min-w-0 flex-1 flex-col items-stretch justify-end gap-0.5 rounded-t-sm transition hover:bg-elevated/60 focus-visible:outline-2 focus-visible:outline-primary"
                :aria-label="`${b.rotulo}: ${b.concluidas} ${t.graficos.concluidas}, ${b.erro} ${t.graficos.erro}`"
                @click="periodo === 'd7' && emit('filtrar', { ...filtroVazio(), soOrigem: false, periodo })"
              >
                <span v-if="b.outras" class="origin-bottom animate-[entrada_.4s_ease-out_both] rounded-t-[4px] bg-accented" :style="{ height: `${(b.outras / maxBarra) * 100}%`, animationDelay: `${i * 20}ms` }" />
                <span v-if="b.erro" class="min-h-0.5 animate-[entrada_.4s_ease-out_both] bg-error" :class="!b.outras && 'rounded-t-[4px]'" :style="{ height: `${(b.erro / maxBarra) * 100}%`, animationDelay: `${i * 20}ms` }" />
                <span v-if="b.concluidas" class="animate-[entrada_.4s_ease-out_both] bg-success/80" :class="!b.outras && !b.erro && 'rounded-t-[4px]'" :style="{ height: `${(b.concluidas / maxBarra) * 100}%`, animationDelay: `${i * 20}ms` }" />
              </button>
            </UTooltip>
          </div>
          <div class="mt-1 flex gap-1">
            <span v-for="(b, i) in barras" :key="b.inicio" class="min-w-0 flex-1 truncate text-center text-[11px] text-muted">
              {{ periodo === 'h24' && i % 3 ? '' : b.rotulo }}
            </span>
          </div>
        </section>

        <section class="rounded-lg border border-default p-4" aria-labelledby="titulo-mais-falhas">
          <h2 id="titulo-mais-falhas" class="mb-3 text-sm font-semibold text-highlighted">{{ t.graficos.maisFalhas }}</h2>
          <USkeleton v-if="carregando" class="h-44" />
          <p v-else-if="!falhas.length" class="py-10 text-center text-sm text-muted">{{ t.graficos.nenhumaFalha }}</p>
          <ul v-else class="flex flex-col gap-2.5">
            <li v-for="(f, i) in falhas" :key="f.fluxo.id">
              <button
                type="button"
                class="group w-full text-left"
                @click="emit('filtrar', { ...filtroVazio(), fluxos: [f.fluxo.id], grupos: ['erro', 'parada'], soOrigem: false, periodo })"
              >
                <span class="flex items-baseline justify-between gap-2 text-sm">
                  <span class="truncate text-toned group-hover:text-highlighted">{{ f.fluxo.name }}</span>
                  <span class="shrink-0 tabular-nums text-highlighted">{{ f.n }}</span>
                </span>
                <span class="mt-1 block h-2 rounded-full bg-elevated">
                  <span class="block h-2 origin-left animate-[entrada_.4s_ease-out_both] rounded-full bg-error/80 transition-[width]" :style="{ width: `${(f.n / maxFalha) * 100}%`, animationDelay: `${i * 40}ms` }" />
                </span>
              </button>
            </li>
          </ul>
        </section>
      </div>

      <!-- Saúde das operações -->
      <section aria-labelledby="titulo-operacoes">
        <header class="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="titulo-operacoes" class="text-sm font-semibold text-highlighted">{{ t.operacoes.titulo }}</h2>
            <p class="text-xs text-muted">{{ t.operacoes.descricao }}</p>
          </div>
          <UButton :label="t.gestao.gerenciar" icon="i-lucide-settings-2" size="xs" color="neutral" variant="outline" @click="emit('gerenciarOperacoes')" />
        </header>
        <UEmpty
          v-if="!carregando && !operacoesComSaude.length"
          icon="i-lucide-boxes"
          :title="t.gestao.vazioTitulo"
          :description="t.gestao.vazioDesc"
          :actions="[{ label: t.gestao.nova, icon: 'i-lucide-plus', onClick: () => emit('gerenciarOperacoes') }]"
          variant="outline"
          size="sm"
        />
        <div v-else class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <template v-if="carregando">
            <USkeleton v-for="k in 4" :key="k" class="h-32 rounded-lg" />
          </template>
          <article
            v-for="(o, i) in operacoesComSaude"
            v-else
            :key="o.op.id"
            class="flex animate-[entrada_.3s_ease-out_both] flex-col gap-2 rounded-lg border border-default p-4 transition hover:-translate-y-0.5 hover:border-accented hover:shadow-md"
            :style="{ animationDelay: `${i * 50}ms` }"
          >
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-sm font-semibold text-highlighted">{{ o.op.nome }}</h3>
              <UBadge :label="t.operacoes.selo[o.selo]" :icon="seloDaOperacao[o.selo].icone" :color="seloDaOperacao[o.selo].cor" variant="subtle" size="sm" />
            </div>
            <p class="text-xs text-muted">{{ t.operacoes.dono(o.op.dono) }} · {{ t.operacoes.fluxos(o.fluxos) }} · {{ t.operacoes.execucoes(o.execucoes) }}</p>
            <p class="text-sm" :class="o.comProblema ? 'text-highlighted' : 'text-muted'">
              {{ o.comProblema ? t.operacoes.problemas(o.comProblema) : t.operacoes.semProblemas }}
            </p>
            <div class="mt-auto flex flex-wrap gap-1.5 pt-1">
              <UButton :label="t.operacoes.verMapa" icon="i-lucide-map" size="xs" color="neutral" variant="outline" @click="emit('verMapa', o.op.id)" />
              <UButton :label="t.kpi.abrirLista" icon="i-lucide-list" size="xs" color="neutral" variant="ghost" @click="emit('filtrar', { ...filtroVazio(), operacao: o.op.id, soOrigem: true })" />
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- Reprocessar as falhas de um fluxo: mostra antes o que vai rodar de novo -->
    <UModal v-model:open="modalAberto" :title="reprocessando ? t.atencao.modal.titulo(reprocessando.falhas.length) : ''" :description="reprocessando ? t.atencao.modal.descricao(reprocessando.fluxo.name) : ''">
      <template #body>
        <UAlert :title="t.atencao.modal.aviso" icon="i-lucide-triangle-alert" color="warning" variant="subtle" />
        <p class="mb-2 mt-4 text-xs font-medium text-muted">{{ t.atencao.modal.itens }}</p>
        <ul class="flex max-h-56 flex-col gap-1 overflow-y-auto">
          <li v-for="[id, rotulo] in itensAfetados" :key="id" class="flex items-center gap-2 rounded-md bg-elevated/50 px-2 py-1.5 text-sm text-toned">
            <UIcon name="i-lucide-file-text" class="size-4 shrink-0 text-muted" />{{ rotulo }}
          </li>
        </ul>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.atencao.modal.cancelar" color="neutral" variant="outline" @click="reprocessando = null" />
          <UButton :label="t.atencao.modal.confirmar" icon="i-lucide-rotate-ccw" :loading="confirmando" @click="confirmarReprocesso" />
        </div>
      </template>
    </UModal>
  </div>
</template>
