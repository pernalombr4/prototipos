<script setup lang="ts">
/**
 * O detalhe de uma execução.
 *
 * Hoje (cópia do develop, 24/10/2026): abas Fluxo de Execução (canvas com o caminho executado, a
 * duração e "N/M nós executados"), Detalhes (Referência, Versão, Criado em, Atualizado em, Status,
 * Entrada e Saída em JSON cru), Comentários e Logs.
 *
 * PROPOSTA:
 * - a faixa da cadeia no topo: em que passo da cadeia esta execução está, qual execução a causou,
 *   e os atalhos para a anterior e para a origem;
 * - a falha em palavras: em qual nó, por quê e o que fazer, com "Reprocessar a partir deste nó";
 * - a aba Cadeia: todas as execuções que a mesma origem causou, em cascata no tempo;
 * - Detalhes com os campos nomeados e o JSON atrás de "Ver dados técnicos".
 */
import type { Execucao } from './mocks'
import { categorias } from './mocks'
import { operacoesDoFluxo } from './operacoes'
import type { Dados, Fase } from './consultas'
import { cadeiaDe, descreverDisparo, execPorId, fluxoPorId, grupoDe, itemPorId, textoDoEvento } from './consultas'
import type { Textos } from './textos'
import StatusDaExecucao from './_StatusDaExecucao.vue'

const props = defineProps<{
  t: Textos
  e: Execucao
  dados: Dados
  fase: Fase
  hoje?: boolean
}>()

const emit = defineEmits<{ voltar: [], abrirExecucao: [number], abrirItem: [number], verMapa: [number | undefined] }>()

type Aba = 'fluxo' | 'cadeia' | 'detalhes' | 'comentarios' | 'logs'
const aba = defineModel<Aba>('aba', { default: 'fluxo' })
watch(() => props.hoje, (h) => { if (h && aba.value === 'cadeia') aba.value = 'fluxo' })

const toast = useToast()
const fluxo = computed(() => fluxoPorId.get(props.e.workflow as number)!)
const item = computed(() => (props.e.item ? itemPorId.get(props.e.item) : undefined))
const raiz = computed(() => (props.e.raiz ? itemPorId.get(props.e.raiz) : undefined))
const comCadeia = computed(() => !props.hoje && props.fase === 2)
const cadeia = computed(() => cadeiaDe(props.e, props.dados.execucoes))
const anterior = computed(() => {
  const l = props.e.input.workflow_timeline.lineage
  return l.length ? execPorId.get(l[l.length - 1]!) : undefined
})
const passo = computed(() => props.e.input.workflow_timeline.lineage.length + 1)

const abas = computed(() => {
  const a = props.t.detalhe.abas
  return [
    { value: 'fluxo', label: a.fluxo, icon: 'i-lucide-workflow' },
    ...(props.hoje ? [] : [{ value: 'cadeia', label: a.cadeia, icon: 'i-lucide-git-fork', badge: comCadeia.value && cadeia.value.passos.length > 1 ? String(cadeia.value.passos.length) : undefined }]),
    { value: 'detalhes', label: a.detalhes, icon: 'i-lucide-file-text' },
    { value: 'comentarios', label: a.comentarios, icon: 'i-lucide-message-square' },
    { value: 'logs', label: a.logs, icon: 'i-lucide-scroll-text' },
  ]
})

/* ---------- o canvas simplificado ---------- */
const nos = computed(() => [
  { rotulo: 'Início', tipo: 'start' },
  ...fluxo.value.nos.map(n => ({ rotulo: n.rotulo, tipo: n.tipo as string })),
  { rotulo: 'Fim', tipo: 'end' },
])
function estadoDoNo(k: number): 'ok' | 'erro' | 'rodando' | 'fora' {
  const e = props.e
  if (e.status === 'error' && e.no_com_erro !== undefined && k === e.no_com_erro + 1) return 'erro'
  if (k < e.nos_executados) return 'ok'
  if (k === e.nos_executados && (e.status === 'working' || e.status === 'queued')) return 'rodando'
  return 'fora'
}
const noComErro = computed(() => (props.e.no_com_erro !== undefined ? fluxo.value.nos[props.e.no_com_erro]?.rotulo : undefined))

const reprocessando = ref(false)
async function reprocessar() {
  reprocessando.value = true
  await new Promise(r => setTimeout(r, 700))
  reprocessando.value = false
  toast.add({ title: props.t.detalhe.reprocessado, description: props.t.detalhe.reprocessadoDesc, icon: 'i-lucide-rotate-ccw', color: 'success' })
}

/* ---------- cadeia em cascata ---------- */
/** O fluxo que mais aparece na linhagem da execução parada: é ele que se repetiu. */
const fluxoQueRepetiu = computed(() => {
  const parada = cadeia.value.parada
  if (!parada) return undefined
  const conta = new Map<number, number>()
  for (const id of parada.e.input.workflow_timeline.lineage) {
    const w = execPorId.get(id)?.workflow as number
    conta.set(w, (conta.get(w) ?? 0) + 1)
  }
  const [id] = [...conta.entries()].sort((a, b) => b[1] - a[1])[0] ?? []
  return id ? fluxoPorId.get(id) : undefined
})
const escalaDaCadeia = computed(() => {
  const c = cadeia.value
  const total = Math.max(1, c.fim - c.inicio)
  return (ms: number) => ((ms - c.inicio) / total) * 100
})

/* ---------- detalhes ---------- */
const verJson = ref(false)

const formatoCompleto = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }))
const formatoDia = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }))
const formatoHora = computed(() => new Intl.DateTimeFormat(props.t.locale, { hour: '2-digit', minute: '2-digit' }))
const rotuloDoItem = (id: number) => { const i = itemPorId.get(id)!; return `${i.reference} ${i.titulo}` }
const iconeDoNo = (tipo: string) => tipo === 'start' ? 'i-lucide-play' : tipo === 'end' ? 'i-lucide-flag' : tipo.startsWith('ai_') ? 'i-lucide-sparkles' : tipo === 'http' ? 'i-lucide-globe' : tipo === 'email' ? 'i-lucide-mail' : tipo === 'task' || tipo === 'approval' ? 'i-lucide-user-round-check' : tipo === 'conditionals' ? 'i-lucide-split' : tipo === 'form' ? 'i-lucide-clipboard-list' : 'i-lucide-database'
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- Cabeçalho (cópia do develop, com o título legível da proposta) -->
    <div class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-3">
      <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" :aria-label="t.detalhe.voltarParaLista" @click="emit('voltar')" />
      <div class="min-w-0 flex-1">
        <h1 class="truncate text-base font-semibold text-highlighted">{{ hoje ? e.reference : fluxo.name }}</h1>
        <p class="truncate text-xs text-muted">
          <template v-if="!hoje && operacoesDoFluxo(fluxo).length">{{ operacoesDoFluxo(fluxo).map(o => o.nome).join(', ') }} · </template>{{ hoje ? fluxo.name : e.reference }} · v{{ e.version }}
        </p>
      </div>
      <StatusDaExecucao :e="e" :t="t" :hoje="hoje" sem-motivo />
    </div>

    <!-- PROPOSTA: a faixa da cadeia -->
    <div v-if="!hoje" class="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-default bg-elevated/40 px-4 py-2 text-sm">
      <template v-if="comCadeia && anterior">
        <UIcon name="i-lucide-git-fork" class="size-4 text-primary" />
        <span class="text-toned">{{ t.detalhe.parteDaCadeia(passo, cadeia.passos.length, raiz?.reference ?? '') }}</span>
        <span class="text-muted">·</span>
        <span class="text-muted">{{ t.detalhe.causadaPor }}</span>
        <UButton :label="fluxoPorId.get(anterior.workflow as number)?.name" icon="i-lucide-corner-left-up" size="xs" color="neutral" variant="link" class="px-0" @click="emit('abrirExecucao', anterior.id)" />
        <span class="ml-auto flex gap-1.5">
          <UButton v-if="cadeia.origem.id !== anterior.id" :label="t.detalhe.irParaOrigem" icon="i-lucide-arrow-up-to-line" size="xs" color="neutral" variant="outline" @click="emit('abrirExecucao', cadeia.origem.id)" />
          <UButton :label="t.detalhe.verCadeia" icon="i-lucide-git-fork" size="xs" color="primary" variant="outline" @click="aba = 'cadeia'" />
        </span>
      </template>
      <template v-else-if="comCadeia && cadeia.passos.length > 1">
        <UIcon name="i-lucide-git-fork" class="size-4 text-primary" />
        <span class="text-toned">{{ t.detalhe.origemDaCadeia(cadeia.passos.length) }}</span>
        <UButton :label="t.detalhe.verCadeia" icon="i-lucide-git-fork" size="xs" color="primary" variant="outline" class="ml-auto" @click="aba = 'cadeia'" />
      </template>
      <span class="flex min-w-0 items-center gap-1.5 text-toned" :class="comCadeia && (anterior || cadeia.passos.length > 1) ? 'w-full' : ''">
        <UIcon :name="descreverDisparo(e, t, fase).icone" class="size-4 shrink-0 text-muted" />
        <span class="text-muted">{{ t.detalhe.campos.disparo }}:</span>
        <span class="truncate">{{ descreverDisparo(e, t, fase).texto }}<template v-if="descreverDisparo(e, t, fase).detalhe"> ({{ descreverDisparo(e, t, fase).detalhe }})</template></span>
        <template v-if="item">
          <span class="text-muted">·</span>
          <UButton :label="item.reference ?? ''" :icon="categorias[item.categoria].icone" size="xs" color="neutral" variant="link" class="px-0" @click="emit('abrirItem', item.id)" />
        </template>
      </span>
    </div>

    <!-- PROPOSTA: a falha em palavras -->
    <div v-if="!hoje && (e.status === 'error' || e.status === 'stopped')" class="border-b border-default px-4 py-3">
      <UAlert
        :title="e.status === 'error' ? `${t.detalhe.falhouNo(noComErro ?? '')}: ${t.causas[e.causa ?? 'tempo'].titulo}` : t.causas.cadeia.titulo"
        :description="e.status === 'error' ? `${t.causas[e.causa ?? 'tempo'].detalhe} ${t.detalhe.oQueFazer}: ${t.causas[e.causa ?? 'tempo'].acao}` : fase === 2 ? t.detalhe.cadeia.interrompida(fluxoQueRepetiu?.name ?? '', itemPorId.get(cadeia.parada?.e.item ?? 0)?.reference ?? '') : t.causas.cadeia.detalhe"
        :icon="e.status === 'error' ? 'i-lucide-circle-x' : 'i-lucide-octagon-x'"
        color="error"
        variant="subtle"
        orientation="horizontal"
        :actions="e.status === 'error'
          ? [{ label: t.detalhe.reprocessarNo, icon: 'i-lucide-rotate-ccw', size: 'sm', color: 'error', variant: 'solid', loading: reprocessando, onClick: reprocessar }]
          : fase === 2 ? [{ label: t.detalhe.verCadeia, icon: 'i-lucide-git-fork', size: 'sm', color: 'neutral', variant: 'outline', onClick: () => { aba = 'cadeia' } }] : undefined"
      />
    </div>

    <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" class="border-b border-default px-4" />

    <div class="min-h-0 flex-1 overflow-y-auto">
      <Transition mode="out-in" enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
        <!-- Fluxo de Execução -->
        <div v-if="aba === 'fluxo'" key="fluxo" class="flex flex-col gap-4 p-4">
          <div class="flex flex-wrap items-center gap-3 text-sm text-toned">
            <StatusDaExecucao :e="e" :t="t" :hoje="hoje" sem-motivo />
            <span class="flex items-center gap-1"><UIcon name="i-lucide-timer" class="size-4 text-muted" />{{ ['rodando', 'esperando'].includes(grupoDe(e)) ? '' : t.duracao(e.duracao_ms) }}</span>
            <span>{{ t.detalhe.nos(Math.min(e.nos_executados, nos.length), nos.length) }}</span>
            <span class="text-muted">{{ formatoCompleto.format(e.created_at) }}</span>
            <span class="ml-auto flex items-center gap-3 text-xs text-muted">
              <span class="flex items-center gap-1.5"><span class="h-0.5 w-5 rounded bg-primary" />{{ t.detalhe.caminho }}</span>
              <span class="flex items-center gap-1.5"><span class="h-0.5 w-5 rounded border-t border-dashed border-accented" />{{ t.detalhe.naoExecutado }}</span>
            </span>
          </div>
          <div class="flex min-h-64 items-center overflow-x-auto rounded-lg border border-default bg-[radial-gradient(var(--ui-border)_1px,transparent_1px)] [background-size:18px_18px] p-8">
            <template v-for="(n, k) in nos" :key="k">
              <div
                class="flex w-44 shrink-0 animate-[entrada_.3s_ease-out_both] items-center gap-2 rounded-lg border bg-default px-3 py-2.5 shadow-sm"
                :class="{
                  'border-primary': estadoDoNo(k) === 'ok',
                  'border-error ring-2 ring-error/25': estadoDoNo(k) === 'erro',
                  'border-info ring-2 ring-info/25': estadoDoNo(k) === 'rodando',
                  'border-default opacity-60': estadoDoNo(k) === 'fora',
                }"
                :style="{ animationDelay: `${k * 60}ms` }"
              >
                <span class="flex size-7 shrink-0 items-center justify-center rounded-md" :class="estadoDoNo(k) === 'erro' ? 'bg-error/10 text-error' : estadoDoNo(k) === 'fora' ? 'bg-elevated text-muted' : 'bg-primary/10 text-primary'">
                  <UIcon :name="iconeDoNo(n.tipo)" class="size-4" :class="estadoDoNo(k) === 'rodando' && 'animate-pulse'" />
                </span>
                <span class="min-w-0">
                  <span class="block truncate text-xs font-medium text-highlighted">{{ n.rotulo }}</span>
                  <span v-if="estadoDoNo(k) === 'erro'" class="block text-[11px] text-error">{{ t.status.error }}</span>
                  <span v-else-if="estadoDoNo(k) === 'rodando' && e.esperando" class="block text-[11px] text-warning">{{ t.grupos.esperando }}</span>
                </span>
              </div>
              <span v-if="k < nos.length - 1" class="h-0.5 w-10 shrink-0" :class="estadoDoNo(k + 1) === 'fora' ? 'border-t-2 border-dashed border-accented' : estadoDoNo(k + 1) === 'erro' ? 'bg-error' : 'bg-primary'" />
            </template>
          </div>
        </div>

        <!-- PROPOSTA: Cadeia -->
        <div v-else-if="aba === 'cadeia'" key="cadeia" class="p-4">
          <UEmpty
            v-if="fase === 1"
            icon="i-lucide-unlink"
            :title="t.detalhe.cadeia.semCadeia.titulo"
            :description="`${t.detalhe.cadeia.semCadeia.descricao} ${t.detalhe.cadeia.semCadeia.hoje}`"
            variant="naked"
            class="mx-auto max-w-xl py-10"
          />
          <template v-else>
            <div class="mb-4 flex flex-wrap items-start gap-3">
              <div class="min-w-0 flex-1">
                <h2 class="text-sm font-semibold text-highlighted">{{ t.detalhe.cadeia.titulo(cadeia.passos.length, cadeia.fluxos) }}</h2>
                <p class="text-sm text-toned">
                  {{ t.detalhe.cadeia.comecou(cadeia.origem.disparo.tipo === 'evento' ? textoDoEvento(cadeia.origem.disparo.evento, t) : descreverDisparo(cadeia.origem, t, fase).texto, formatoDia.format(cadeia.inicio)) }}.
                  {{ t.detalhe.cadeia.duracao(t.duracao(cadeia.fim - cadeia.inicio)) }}.
                </p>
              </div>
              <UButton :label="t.detalhe.cadeia.verNoMapa" icon="i-lucide-map" size="xs" color="neutral" variant="outline" @click="emit('verMapa', e.raiz ?? e.item ?? undefined)" />
            </div>

            <UAlert
              v-if="cadeia.parada && cadeia.parada.e.id !== e.id"
              class="mb-3"
              :title="t.causas.cadeia.titulo"
              :description="t.detalhe.cadeia.interrompida(fluxoQueRepetiu?.name ?? '', itemPorId.get(cadeia.parada.e.item!)?.reference ?? '')"
              icon="i-lucide-octagon-x"
              color="error"
              variant="subtle"
            />
            <p v-if="cadeia.emAndamento" class="mb-3 flex items-center gap-1.5 text-xs text-muted">
              <UIcon name="i-lucide-loader" class="size-3.5 animate-spin [animation-duration:2.4s] motion-reduce:animate-none" />{{ t.detalhe.cadeia.incompleta }}
            </p>

            <ol class="flex flex-col overflow-hidden rounded-lg border border-default">
              <li
                v-for="(p, k) in cadeia.passos"
                :key="p.e.id"
                class="grid animate-[entrada_.25s_ease-out_both] grid-cols-[minmax(0,22rem)_minmax(0,1fr)] items-center gap-3 border-b border-default px-3 py-2 last:border-b-0"
                :class="p.e.id === e.id ? 'bg-primary/5' : 'hover:bg-elevated/40'"
                :style="{ animationDelay: `${Math.min(k, 20) * 25}ms` }"
              >
                <button type="button" class="flex min-w-0 items-start gap-2 text-left" :style="{ paddingLeft: `${Math.min(p.nivel, 8) * 14}px` }" @click="p.e.id !== e.id && emit('abrirExecucao', p.e.id)">
                  <UIcon :name="p.nivel ? 'i-lucide-corner-down-right' : 'i-lucide-circle-dot'" class="mt-0.5 size-3.5 shrink-0 text-dimmed" />
                  <span class="min-w-0">
                    <span class="flex items-center gap-1.5">
                      <span class="truncate text-sm" :class="p.e.id === e.id ? 'font-semibold text-highlighted' : 'text-toned hover:text-highlighted'">{{ p.fluxo.name }}</span>
                      <UBadge v-if="p.e.id === e.id" :label="t.detalhe.cadeia.estaExecucao" color="primary" variant="subtle" size="sm" class="shrink-0" />
                    </span>
                    <span class="block truncate text-xs text-muted">
                      {{ p.e.item ? itemPorId.get(p.e.item)?.reference : t.execucoes.semItem }} · {{ formatoHora.format(p.inicio) }}
                      <template v-if="p.e.gravou.length"> · {{ t.detalhe.cadeia.gravou(p.e.gravou.map(g => itemPorId.get(g.item)?.reference).join(', ')) }}</template>
                    </span>
                  </span>
                </button>
                <div class="flex min-w-0 items-center gap-2">
                  <div class="relative h-5 min-w-0 flex-1 rounded bg-elevated/50">
                    <span
                      class="absolute top-1 h-3 min-w-1.5 rounded-sm"
                      :class="{
                        'bg-success/70': grupoDe(p.e) === 'concluida',
                        'bg-error': grupoDe(p.e) === 'erro' || grupoDe(p.e) === 'parada',
                        'bg-info/70': grupoDe(p.e) === 'rodando',
                        'bg-warning/70 bg-[repeating-linear-gradient(45deg,transparent_0_4px,rgb(255_255_255/0.35)_4px_8px)]': grupoDe(p.e) === 'esperando',
                      }"
                      :style="{ left: `${escalaDaCadeia(p.inicio)}%`, width: `${['rodando', 'esperando'].includes(grupoDe(p.e)) ? 100 - escalaDaCadeia(p.inicio) : Math.max(0.6, escalaDaCadeia(p.fim) - escalaDaCadeia(p.inicio))}%` }"
                    />
                  </div>
                  <span class="w-40 shrink-0"><StatusDaExecucao :e="p.e" :t="t" sem-motivo /></span>
                </div>
              </li>
            </ol>
          </template>
        </div>

        <!-- Detalhes -->
        <div v-else-if="aba === 'detalhes'" key="detalhes" class="grid max-w-4xl gap-4 p-4">
          <dl class="grid gap-x-6 gap-y-3 rounded-lg border border-default p-4 sm:grid-cols-2">
            <template v-if="!hoje">
              <div><dt class="text-xs text-muted">{{ t.detalhe.campos.fluxo }}</dt><dd class="text-sm text-toned">{{ fluxo.name }}</dd></div>
              <div>
                <dt class="text-xs text-muted">{{ t.detalhe.campos.item }}</dt>
                <dd class="text-sm text-toned">
                  <UButton v-if="item" :label="`${item.reference} ${item.titulo}`" size="xs" color="neutral" variant="link" class="px-0" @click="emit('abrirItem', item.id)" />
                  <span v-else class="text-muted">{{ t.execucoes.semItem }}</span>
                </dd>
              </div>
              <div class="sm:col-span-2"><dt class="text-xs text-muted">{{ t.detalhe.campos.disparo }}</dt><dd class="text-sm text-toned">{{ descreverDisparo(e, t, fase).texto }}</dd></div>
            </template>
            <div><dt class="text-xs text-muted">{{ t.detalhe.campos.referencia }}</dt><dd class="font-mono text-sm text-toned">{{ e.reference }}</dd></div>
            <div><dt class="text-xs text-muted">{{ t.detalhe.campos.versao }}</dt><dd class="text-sm text-toned">v{{ e.version }}</dd></div>
            <div><dt class="text-xs text-muted">{{ t.detalhe.campos.criado }}</dt><dd class="text-sm text-toned">{{ formatoCompleto.format(e.created_at) }}</dd></div>
            <div><dt class="text-xs text-muted">{{ t.detalhe.campos.atualizado }}</dt><dd class="text-sm text-toned">{{ formatoCompleto.format(e.updated_at!) }}</dd></div>
            <div><dt class="text-xs text-muted">{{ t.detalhe.campos.status }}</dt><dd><StatusDaExecucao :e="e" :t="t" :hoje="hoje" /></dd></div>
          </dl>

          <section v-if="!hoje && fase === 2" class="rounded-lg border border-default p-4">
            <h3 class="mb-2 text-xs font-medium text-muted">{{ t.detalhe.campos.gravou }}</h3>
            <ul v-if="e.gravou.length" class="flex flex-col gap-1">
              <li v-for="g in e.gravou" :key="`${g.item}${g.acao}`">
                <UButton :label="`${textoDoEvento({ categoria: itemPorId.get(g.item)!.categoria, acao: g.acao }, t)}: ${rotuloDoItem(g.item)}`" :icon="categorias[itemPorId.get(g.item)!.categoria].icone" size="xs" color="neutral" variant="link" class="px-0" @click="emit('abrirItem', g.item)" />
              </li>
            </ul>
            <p v-else class="text-sm text-muted">{{ t.detalhe.campos.nada }}</p>
          </section>

          <section v-if="hoje || verJson" class="grid gap-3 sm:grid-cols-2">
            <div>
              <h3 class="mb-1 text-xs font-medium text-muted">{{ t.detalhe.campos.entrada }}</h3>
              <pre class="max-h-80 overflow-auto rounded-lg bg-elevated p-3 text-xs text-toned">{{ JSON.stringify(e.input, null, 2) }}</pre>
            </div>
            <div>
              <h3 class="mb-1 text-xs font-medium text-muted">{{ t.detalhe.campos.saida }}</h3>
              <pre class="max-h-80 overflow-auto rounded-lg bg-elevated p-3 text-xs text-toned">{{ JSON.stringify(e.output, null, 2) }}</pre>
            </div>
          </section>
          <div v-if="!hoje">
            <UButton :label="verJson ? t.detalhe.esconderDadosTecnicos : t.detalhe.verDadosTecnicos" :icon="verJson ? 'i-lucide-eye-off' : 'i-lucide-code'" size="xs" color="neutral" variant="outline" @click="verJson = !verJson" />
          </div>
        </div>

        <div v-else key="fora" class="flex flex-1 items-center justify-center p-12">
          <UEmpty icon="i-lucide-construction" :title="t.detalhe.foraDoEscopo" :description="t.detalhe.foraDoEscopoDesc" variant="naked" />
        </div>
      </Transition>
    </div>
  </div>
</template>
