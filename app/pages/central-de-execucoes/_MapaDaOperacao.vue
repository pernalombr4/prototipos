<script setup lang="ts">
/**
 * PROPOSTA: o mapa da operação. Não existe hoje.
 *
 * Os fluxos de uma operação e os eventos de item que os ligam, da esquerda para a direita:
 * "Contrato criado" › Registrar andamento inicial › "Andamento criado" › ... O evento aparece como
 * nó próprio porque é ele que liga um fluxo ao outro (o fluxo A grava, o evento dispara o B).
 *
 * - tracejado: a ligação configurada (o que os nós de criar e editar gravam e o gatilho escuta);
 * - cheio, com número: as execuções que passaram pela ligação no período (fase 2);
 * - o ciclo (o fluxo grava o evento que o dispara) ganha o aviso e o atalho para as proteções;
 * - clicar num fluxo ou evento destaca os vizinhos e abre o painel ao lado;
 * - escolher um item mostra a jornada dele: os fluxos por onde passou, numerados, e o resto apagado.
 *
 * Os fluxos de cada operação vêm da regra dela (`operacoes.ts`). "Editar regra" abre o editor.
 */
import type { CategoriaId, Execucao } from './mocks'
import { categorias } from './mocks'
import { fluxosDaOperacao, operacaoDaCategoria, operacoes, operacoesDoFluxo } from './operacoes'
import type { Dados, Fase, FiltroDaLista, NoDoMapa, Periodo, Saude } from './consultas'
import { buscarItens, chaveDoFluxo, filtroVazio, grupoDe, itemPorId, jornadaDoItem, mapaDaOperacao, textoDoEvento, vizinhosDoEvento, fluxoPorId } from './consultas'
import type { Textos } from './textos'
import StatusDaExecucao from './_StatusDaExecucao.vue'

const props = defineProps<{
  t: Textos
  dados: Dados
  fase: Fase
  periodo: Periodo
}>()

const operacao = defineModel<string | undefined>('operacao', { required: true })
const itemDaJornada = defineModel<number | undefined>('item')
const emit = defineEmits<{ filtrar: [FiltroDaLista], abrirExecucao: [number], abrirItem: [number], editarOperacao: [string], novaOperacao: [] }>()

const toast = useToast()

const opcoesDeOperacao = computed(() => operacoes.value
  .filter(o => fluxosDaOperacao(o.id, props.dados.fluxos).length)
  .map(o => ({ label: o.nome, value: o.id })))
/* A operação aberta foi excluída ou ficou sem fluxos: abre a primeira que sobrou. */
watch(opcoesDeOperacao, (ops) => {
  if (!ops.some(o => o.value === operacao.value)) operacao.value = ops[0]?.value
}, { immediate: true })

const mapa = computed(() => mapaDaOperacao(operacao.value, props.dados, props.periodo, props.fase))
const noPorId = computed(() => new Map(mapa.value.nos.map(n => [n.id, n])))

/* ---------- seleção e foco ---------- */
const selecionado = ref<string | null>(null)
watch(operacao, () => { selecionado.value = null })
const vizinhos = computed(() => {
  if (!selecionado.value) return null
  const s = new Set([selecionado.value])
  for (const l of mapa.value.ligacoes) {
    if (l.de === selecionado.value) s.add(l.para)
    if (l.para === selecionado.value) s.add(l.de)
  }
  return s
})
const noSelecionado = computed(() => (selecionado.value ? noPorId.value.get(selecionado.value) : undefined))

/* ---------- jornada de um item ---------- */
const buscaDoItem = ref('')
const itensAchados = computed(() => buscarItens(buscaDoItem.value, props.dados, 5))
function escolherItem(id: number) {
  itemDaJornada.value = id
  buscaDoItem.value = ''
}
const item = computed(() => (itemDaJornada.value ? itemPorId.get(itemDaJornada.value) : undefined))
watch(item, (i) => {
  if (!i) return
  selecionado.value = null
  const op = operacaoDaCategoria(i.categoria)
  if (op && op.id !== operacao.value) operacao.value = op.id
}, { immediate: true })

const jornada = computed<Execucao[]>(() => (item.value ? jornadaDoItem(item.value, props.dados.execucoes, props.fase) : []))
const passosDoFluxo = computed(() => {
  const m = new Map<number, number[]>()
  jornada.value.forEach((e, k) => {
    const id = e.workflow as number
    m.set(id, [...(m.get(id) ?? []), k + 1])
  })
  return m
})
const nosDaJornada = computed(() => {
  if (!item.value) return null
  const s = new Set<string>()
  for (const e of jornada.value) {
    s.add(chaveDoFluxo(e.workflow as number))
    if (e.disparo.tipo === 'evento') s.add(`ev:${e.disparo.evento.categoria}:${e.disparo.evento.acao}`)
    if (props.fase === 2) {
      for (const g of e.gravou) {
        const cat = itemPorId.get(g.item)?.categoria
        if (cat) s.add(`ev:${cat}:${g.acao}`)
      }
    }
  }
  return s
})
const jornadaForaDaOperacao = computed(() => !!item.value && !mapa.value.nos.some(n => n.tipo === 'fluxo' && passosDoFluxo.value.has(n.fluxo!.id)))

/** O que fica aceso: a jornada, ou o nó escolhido e os vizinhos. */
const aceso = computed(() => nosDaJornada.value ?? vizinhos.value)
const apagado = (id: string) => !!aceso.value && !aceso.value.has(id)
const ligacaoAcesa = (de: string, para: string) => !!aceso.value && aceso.value.has(de) && aceso.value.has(para)

/* ---------- desenho ---------- */
const estiloDaSaude: Record<Saude, { faixa: string, icone: string, cor: string }> = {
  ok: { faixa: 'bg-success', icone: 'i-lucide-circle-check', cor: 'text-success' },
  falha: { faixa: 'bg-error', icone: 'i-lucide-circle-x', cor: 'text-error' },
  parada: { faixa: 'bg-error', icone: 'i-lucide-octagon-x', cor: 'text-error' },
  esperando: { faixa: 'bg-warning', icone: 'i-lucide-hourglass', cor: 'text-warning' },
  semExecucao: { faixa: 'bg-accented', icone: 'i-lucide-circle-dashed', cor: 'text-muted' },
}
const iconeDoGatilho = { cron: 'i-lucide-calendar-clock', webhook: 'i-lucide-webhook', mailbox: 'i-lucide-mail', manual: 'i-lucide-hand' } as const

function caminho(de: NoDoMapa, para: NoDoMapa, volta: boolean) {
  if (volta) {
    const sx = de.x + de.largura / 2
    const sy = de.y
    const tx = para.x + para.largura / 2
    const ty = para.y
    const topo = Math.min(sy, ty) - 46
    return `M ${sx} ${sy} C ${sx} ${topo}, ${tx} ${topo}, ${tx} ${ty - 4}`
  }
  const sx = de.x + de.largura
  const sy = de.y + de.altura / 2
  const tx = para.x - 4
  const ty = para.y + para.altura / 2
  const meio = (sx + tx) / 2
  return `M ${sx} ${sy} C ${meio} ${sy}, ${meio} ${ty}, ${tx} ${ty}`
}
function meioDaLigacao(de: NoDoMapa, para: NoDoMapa, volta: boolean) {
  if (volta) return { x: (de.x + de.largura / 2 + para.x + para.largura / 2) / 2, y: Math.min(de.y, para.y) - 36 }
  return { x: (de.x + de.largura + para.x) / 2, y: (de.y + de.altura / 2 + para.y + para.altura / 2) / 2 }
}

/* ---------- zoom e arrastar ---------- */
const area = ref<HTMLElement | null>(null)
const zoom = ref(0.9)
/** Cabe o desenho inteiro. Ao abrir, não passa de 70% para baixo: abaixo disso o nome do fluxo não se lê. */
function ajustar(minimo = 0.35) {
  const el = area.value
  if (!el) return
  zoom.value = Math.max(minimo, Math.min(1, (el.clientWidth - 16) / mapa.value.largura, (el.clientHeight - 16) / (mapa.value.altura + 40)))
}
watch(operacao, () => nextTick(() => ajustar(0.7)))
onMounted(() => nextTick(() => ajustar(0.7)))
const mudarZoom = (d: number) => { zoom.value = Math.max(0.35, Math.min(1.4, +(zoom.value + d).toFixed(2))) }

let arrasto: { x: number, y: number, l: number, t: number } | null = null
function comecarArrasto(ev: PointerEvent) {
  if ((ev.target as HTMLElement).closest('button')) return
  const el = area.value!
  arrasto = { x: ev.clientX, y: ev.clientY, l: el.scrollLeft, t: el.scrollTop }
  el.setPointerCapture(ev.pointerId)
}
function arrastar(ev: PointerEvent) {
  if (!arrasto || !area.value) return
  area.value.scrollLeft = arrasto.l - (ev.clientX - arrasto.x)
  area.value.scrollTop = arrasto.t - (ev.clientY - arrasto.y)
}
const soltar = () => { arrasto = null }
function clicarFundo(ev: MouseEvent) {
  if (!(ev.target as HTMLElement).closest('button')) selecionado.value = null
}

/* ---------- painel ---------- */
const fluxosDoMapa = computed(() => fluxosDaOperacao(operacao.value, props.dados.fluxos))
const saudeDoSelecionado = computed(() => noSelecionado.value?.fluxo ? mapa.value.saude.get(noSelecionado.value.fluxo.id) : undefined)
const cicloDoSelecionado = computed(() => {
  const f = noSelecionado.value?.fluxo
  if (!f) return undefined
  const l = mapa.value.ligacoes.find(x => x.ciclo && x.de === chaveDoFluxo(f.id))
  return l ? noPorId.value.get(l.para)?.evento : undefined
})
const ciclos = computed(() => mapa.value.ligacoes.filter(l => l.ciclo))
const formatoDia = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }))

function textoDoGatilho(n: NoDoMapa) {
  const g = n.fluxo!.gatilho
  if (g.tipo === 'events') return textoDoEvento({ categoria: g.categoria, acao: g.acao }, props.t)
  if (g.tipo === 'cron') return props.t.mapa.gatilhos.cron(g.rotulo)
  return props.t.mapa.gatilhos[g.tipo]
}

const foraDoEscopo = () => toast.add({ title: props.t.mapa.foraDoEscopo, icon: 'i-lucide-construction', color: 'neutral' })
const iconeDaCategoria = (c: CategoriaId) => categorias[c].icone
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- Barra do mapa -->
    <div class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-2">
      <USelect v-model="operacao" :items="opcoesDeOperacao" icon="i-lucide-boxes" size="sm" class="w-56" :aria-label="t.mapa.operacao" :disabled="!opcoesDeOperacao.length" />
      <UButton v-if="operacao" :label="t.gestao.editarRegra" icon="i-lucide-pencil" size="sm" color="neutral" variant="outline" @click="emit('editarOperacao', operacao)" />
      <div class="relative">
        <UInput
          v-if="!item"
          v-model="buscaDoItem"
          icon="i-lucide-route"
          :placeholder="t.mapa.buscarItemPlaceholder"
          size="sm"
          class="w-64"
          :aria-label="t.mapa.buscarItem"
        />
        <div v-else class="flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/5 py-1 pl-2 pr-1 text-sm">
          <UIcon name="i-lucide-route" class="size-4 text-primary" />
          <span class="font-medium text-highlighted">{{ t.mapa.jornada.titulo(item.reference ?? '') }}</span>
          <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" :aria-label="t.mapa.limparItem" @click="itemDaJornada = undefined" />
        </div>
        <div v-if="itensAchados.length && !item" class="absolute left-0 top-full z-20 mt-1 w-96 rounded-md border border-default bg-default p-1 shadow-lg">
          <button
            v-for="i in itensAchados"
            :key="i.id"
            type="button"
            class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-elevated"
            @click="escolherItem(i.id)"
          >
            <UIcon :name="iconeDaCategoria(i.categoria)" class="size-4 shrink-0 text-muted" />
            <span class="font-medium text-highlighted">{{ i.reference }}</span>
            <span class="truncate text-muted">{{ i.titulo }}</span>
          </button>
        </div>
      </div>

      <div class="ml-auto flex flex-wrap items-center gap-3 text-xs text-toned">
        <span class="flex items-center gap-1.5">
          <svg width="26" height="8" aria-hidden="true"><line x1="0" y1="4" x2="26" y2="4" class="stroke-(--ui-border-accented)" stroke-width="2" stroke-dasharray="4 3" /></svg>
          {{ t.mapa.legenda.configurada }}
        </span>
        <span v-if="fase === 2" class="flex items-center gap-1.5">
          <svg width="26" height="8" aria-hidden="true"><line x1="0" y1="4" x2="26" y2="4" class="stroke-(--ui-primary)" stroke-width="2" /></svg>
          {{ t.mapa.legenda.observada }}
        </span>
        <span class="flex items-center gap-1.5">
          <span class="h-3 w-6 rounded-full border border-default bg-elevated" />
          {{ t.mapa.legenda.evento }}
        </span>
        <span class="flex items-center gap-1.5">
          <UIcon name="i-lucide-repeat" class="size-3.5 text-warning" />{{ t.mapa.legenda.ciclo }}
        </span>
        <span class="flex items-center gap-0.5">
          <UButton icon="i-lucide-minus" size="xs" color="neutral" variant="ghost" :aria-label="t.mapa.zoom.menos" @click="mudarZoom(-0.1)" />
          <span class="w-9 text-center tabular-nums text-muted">{{ Math.round(zoom * 100) }}%</span>
          <UButton icon="i-lucide-plus" size="xs" color="neutral" variant="ghost" :aria-label="t.mapa.zoom.mais" @click="mudarZoom(0.1)" />
          <UButton icon="i-lucide-maximize" size="xs" color="neutral" variant="ghost" :aria-label="t.mapa.zoom.ajustar" @click="ajustar()" />
        </span>
      </div>
    </div>

    <!-- Avisos de ciclo e da jornada -->
    <div v-if="(ciclos.length && !item) || item" class="flex flex-col gap-2 border-b border-default px-4 py-2">
      <p v-if="item && fase === 1" class="flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-info" class="size-3.5" />{{ t.mapa.jornada.semCadeia }}
      </p>
      <p v-if="jornadaForaDaOperacao" class="text-sm text-muted">{{ t.mapa.jornada.foraDaOperacao }}</p>
      <template v-if="!item">
        <UAlert
          v-for="l in ciclos"
          :key="l.id"
          :title="t.mapa.ciclo.titulo"
          :description="t.mapa.ciclo.descricao(noPorId.get(l.de)?.fluxo?.name ?? '', textoDoEvento(noPorId.get(l.para)!.evento!, t))"
          icon="i-lucide-repeat"
          color="warning"
          variant="subtle"
          orientation="horizontal"
          :actions="[{ label: t.mapa.ciclo.verProtecoes, size: 'xs', color: 'neutral', variant: 'outline', onClick: () => toast.add({ title: t.mapa.protecoesFora, icon: 'i-lucide-shield', color: 'neutral' }) }]"
          :ui="{ description: 'text-xs' }"
        />
      </template>
    </div>

    <div v-if="!opcoesDeOperacao.length" class="flex flex-1 items-center justify-center p-8">
      <UEmpty
        icon="i-lucide-boxes"
        :title="t.gestao.vazioTitulo"
        :description="t.gestao.vazioDesc"
        :actions="[{ label: t.gestao.nova, icon: 'i-lucide-plus', onClick: () => emit('novaOperacao') }]"
        variant="naked"
      />
    </div>
    <div v-else class="flex min-h-0 flex-1">
      <!-- O desenho -->
      <div
        ref="area"
        class="relative min-h-0 min-w-0 flex-1 cursor-grab overflow-auto bg-[radial-gradient(var(--ui-border)_1px,transparent_1px)] [background-size:18px_18px] active:cursor-grabbing"
        @pointerdown="comecarArrasto"
        @pointermove="arrastar"
        @pointerup="soltar"
        @pointercancel="soltar"
        @click="clicarFundo"
      >
        <p class="pointer-events-none absolute left-3 top-2 z-10 text-xs text-muted">{{ t.mapa.dica }}</p>
        <div :style="{ width: `${mapa.largura * zoom}px`, height: `${(mapa.altura + 60) * zoom}px` }">
          <div
            :key="operacao"
            class="relative origin-top-left animate-[entrada_.35s_ease-out_both]"
            :style="{ width: `${mapa.largura}px`, height: `${mapa.altura + 60}px`, transform: `scale(${zoom})` }"
          >
            <svg class="absolute inset-0 overflow-visible" :width="mapa.largura" :height="mapa.altura + 60" aria-hidden="true">
              <defs>
                <marker id="seta" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" class="fill-(--ui-border-accented)" />
                </marker>
                <marker id="seta-cheia" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" class="fill-(--ui-primary)" />
                </marker>
                <marker id="seta-ciclo" viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" class="fill-(--ui-warning)" />
                </marker>
              </defs>
              <g transform="translate(0 40)">
                <g v-for="l in mapa.ligacoes" :key="l.id" class="transition-opacity duration-200" :class="aceso && !ligacaoAcesa(l.de, l.para) ? 'opacity-15' : 'opacity-100'">
                  <path
                    :d="caminho(noPorId.get(l.de)!, noPorId.get(l.para)!, l.volta)"
                    fill="none"
                    :stroke-width="l.observadas ? Math.min(4, 1.5 + Math.log10(l.observadas + 1)) : 1.5"
                    :stroke-dasharray="l.observadas ? undefined : '5 4'"
                    :class="l.ciclo ? 'stroke-(--ui-warning)' : l.observadas ? 'stroke-(--ui-primary)' : 'stroke-(--ui-border-accented)'"
                    :marker-end="`url(#${l.ciclo ? 'seta-ciclo' : l.observadas ? 'seta-cheia' : 'seta'})`"
                  />
                  <g v-if="l.observadas" :transform="`translate(${meioDaLigacao(noPorId.get(l.de)!, noPorId.get(l.para)!, l.volta).x} ${meioDaLigacao(noPorId.get(l.de)!, noPorId.get(l.para)!, l.volta).y})`">
                    <rect x="-16" y="-9" width="32" height="18" rx="9" class="fill-(--ui-bg) stroke-(--ui-border)" />
                    <text text-anchor="middle" dominant-baseline="central" class="fill-(--ui-text-toned) text-[10px] tabular-nums">{{ l.observadas }}</text>
                  </g>
                </g>
              </g>
            </svg>

            <div class="absolute inset-x-0 bottom-0 top-10">
              <template v-for="n in mapa.nos" :key="n.id">
                <!-- Evento de item -->
                <button
                  v-if="n.tipo === 'evento'"
                  type="button"
                  class="absolute flex items-center justify-center gap-1.5 rounded-full border px-2.5 text-xs transition duration-200 hover:border-accented focus-visible:outline-2 focus-visible:outline-primary"
                  :class="[
                    selecionado === n.id ? 'border-primary bg-primary/10 text-primary' : 'border-default bg-elevated text-toned',
                    apagado(n.id) ? 'opacity-25' : 'opacity-100',
                  ]"
                  :style="{ left: `${n.x}px`, top: `${n.y}px`, width: `${n.largura}px`, height: `${n.altura}px` }"
                  :aria-pressed="selecionado === n.id"
                  :title="textoDoEvento(n.evento!, t)"
                  @click.stop="selecionado = selecionado === n.id ? null : n.id"
                >
                  <UIcon :name="iconeDaCategoria(n.evento!.categoria)" class="size-3.5 shrink-0" />
                  <span class="truncate">{{ textoDoEvento(n.evento!, t) }}</span>
                </button>

                <!-- Fluxo -->
                <button
                  v-else
                  type="button"
                  class="absolute flex overflow-hidden rounded-lg border bg-default text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
                  :class="[
                    selecionado === n.id || passosDoFluxo.has(n.fluxo!.id) ? 'border-primary ring-2 ring-primary/25' : 'border-default',
                    apagado(n.id) ? 'opacity-25' : 'opacity-100',
                  ]"
                  :style="{ left: `${n.x}px`, top: `${n.y}px`, width: `${n.largura}px`, height: `${n.altura}px` }"
                  :aria-pressed="selecionado === n.id"
                  :aria-label="`${n.fluxo!.name}. ${t.mapa.saude[mapa.saude.get(n.fluxo!.id)!.saude]}. ${t.mapa.execs(mapa.saude.get(n.fluxo!.id)!.execs)}`"
                  @click.stop="selecionado = selecionado === n.id ? null : n.id"
                >
                  <span class="w-1 shrink-0" :class="estiloDaSaude[mapa.saude.get(n.fluxo!.id)!.saude].faixa" />
                  <span class="flex min-w-0 flex-1 flex-col justify-between px-2.5 py-1.5">
                    <span class="line-clamp-2 text-xs font-medium leading-tight text-highlighted">{{ n.fluxo!.name }}</span>
                    <span class="flex items-center gap-1.5 text-[11px] text-muted">
                      <UIcon :name="estiloDaSaude[mapa.saude.get(n.fluxo!.id)!.saude].icone" class="size-3 shrink-0" :class="estiloDaSaude[mapa.saude.get(n.fluxo!.id)!.saude].cor" />
                      <span class="tabular-nums">{{ mapa.saude.get(n.fluxo!.id)!.execs }}</span>
                      <span v-if="mapa.saude.get(n.fluxo!.id)!.erros" class="tabular-nums text-error">· {{ t.mapa.erros(mapa.saude.get(n.fluxo!.id)!.erros) }}</span>
                      <!-- O número do passo na jornada do item -->
                      <span v-if="passosDoFluxo.get(n.fluxo!.id)" class="ml-auto flex items-center gap-0.5">
                        <span
                          v-for="k in passosDoFluxo.get(n.fluxo!.id)!.slice(0, 3)"
                          :key="k"
                          class="flex size-4 animate-[entrada_.25s_ease-out_both] items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-inverted"
                        >{{ k }}</span>
                        <span v-if="passosDoFluxo.get(n.fluxo!.id)!.length > 3" class="text-[9px] font-semibold text-primary">+{{ passosDoFluxo.get(n.fluxo!.id)!.length - 3 }}</span>
                      </span>
                      <UIcon v-if="n.fluxo!.gatilho.tipo !== 'events'" :name="iconeDoGatilho[n.fluxo!.gatilho.tipo]" class="size-3 shrink-0" :class="passosDoFluxo.get(n.fluxo!.id) ? '' : 'ml-auto'" />
                    </span>
                  </span>
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Painel: o nó escolhido, ou a jornada do item -->
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-x-4" leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0 translate-x-4">
        <aside v-if="noSelecionado || item" class="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-default bg-default">
          <!-- Jornada -->
          <template v-if="item && !noSelecionado">
            <header class="border-b border-default p-4">
              <p class="text-xs text-muted">{{ categorias[item.categoria].singular }}</p>
              <p class="text-sm font-semibold text-highlighted">{{ item.reference }}</p>
              <p class="text-sm text-toned">{{ item.titulo }}</p>
              <p class="mt-2 text-xs text-muted">{{ t.mapa.jornada.passos(jornada.length) }}</p>
              <UButton :label="t.busca.abrirItem" icon="i-lucide-arrow-up-right" size="xs" color="neutral" variant="outline" class="mt-2" @click="emit('abrirItem', item.id)" />
            </header>
            <ol class="flex flex-col p-2">
              <li v-for="(e, k) in jornada" :key="e.id">
                <button type="button" class="flex w-full items-start gap-2 rounded-md p-2 text-left transition-colors hover:bg-elevated" @click="emit('abrirExecucao', e.id)">
                  <span class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold" :class="grupoDe(e) === 'erro' || grupoDe(e) === 'parada' ? 'bg-error text-inverted' : 'bg-primary/15 text-primary'">{{ k + 1 }}</span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm text-highlighted">{{ fluxoPorId.get(e.workflow as number)?.name }}</span>
                    <span class="block truncate text-xs text-muted">{{ e.item === item.id ? t.nesteItem : t.noItem(categorias[itemPorId.get(e.item!)!.categoria], itemPorId.get(e.item!)!.reference ?? '') }} · {{ formatoDia.format(e.created_at) }}</span>
                    <span class="mt-1 block"><StatusDaExecucao :e="e" :t="t" /></span>
                  </span>
                </button>
              </li>
            </ol>
          </template>

          <!-- Fluxo -->
          <template v-else-if="noSelecionado?.fluxo">
            <header class="flex items-start gap-2 border-b border-default p-4">
              <div class="min-w-0 flex-1">
                <p class="text-xs text-muted">{{ operacoesDoFluxo(noSelecionado.fluxo).map(o => o.nome).join(', ') }} · v{{ noSelecionado.fluxo.version }}</p>
                <h3 class="text-sm font-semibold text-highlighted">{{ noSelecionado.fluxo.name }}</h3>
                <p class="mt-1 text-xs text-toned">{{ noSelecionado.fluxo.description }}</p>
              </div>
              <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" :aria-label="t.mapa.painel.fechar" @click="selecionado = null" />
            </header>
            <dl class="flex flex-col gap-3 p-4 text-sm">
              <div>
                <dt class="text-xs text-muted">{{ t.mapa.painel.dono }}</dt>
                <dd class="text-toned">{{ noSelecionado.fluxo.dono }}</dd>
              </div>
              <div>
                <dt class="text-xs text-muted">{{ t.mapa.painel.comecaQuando }}</dt>
                <dd class="text-toned">{{ textoDoGatilho(noSelecionado) }}</dd>
              </div>
              <div>
                <dt class="text-xs text-muted">{{ t.mapa.painel.grava }}</dt>
                <dd v-if="noSelecionado.fluxo.grava.length" class="flex flex-wrap gap-1 pt-0.5">
                  <UBadge v-for="g in noSelecionado.fluxo.grava" :key="`${g.categoria}${g.acao}`" :label="textoDoEvento(g, t)" :icon="iconeDaCategoria(g.categoria)" color="neutral" variant="outline" size="sm" />
                </dd>
                <dd v-else class="text-muted">{{ t.mapa.painel.gravaNada }}</dd>
              </div>
              <div v-if="saudeDoSelecionado">
                <dt class="text-xs text-muted">{{ t.mapa.painel.noPeriodo }}</dt>
                <dd class="flex items-center gap-1.5 text-toned">
                  <UIcon :name="estiloDaSaude[saudeDoSelecionado.saude].icone" class="size-4" :class="estiloDaSaude[saudeDoSelecionado.saude].cor" />
                  {{ t.mapa.saude[saudeDoSelecionado.saude] }} · {{ t.mapa.execs(saudeDoSelecionado.execs) }}<template v-if="saudeDoSelecionado.erros"> · {{ t.mapa.erros(saudeDoSelecionado.erros) }}</template>
                </dd>
              </div>
              <div v-if="saudeDoSelecionado?.ultimaFalha">
                <dt class="text-xs text-muted">{{ t.mapa.painel.ultimaFalha }}</dt>
                <dd>
                  <button type="button" class="mt-0.5 w-full rounded-md border border-default p-2 text-left transition-colors hover:bg-elevated" @click="emit('abrirExecucao', saudeDoSelecionado.ultimaFalha.id)">
                    <StatusDaExecucao :e="saudeDoSelecionado.ultimaFalha" :t="t" />
                    <span class="mt-1 block text-xs text-muted">{{ formatoDia.format(saudeDoSelecionado.ultimaFalha.created_at) }}</span>
                  </button>
                </dd>
              </div>
            </dl>
            <UAlert
              v-if="cicloDoSelecionado"
              class="mx-4"
              :title="t.mapa.ciclo.titulo"
              :description="t.mapa.ciclo.descricao(noSelecionado.fluxo.name, textoDoEvento(cicloDoSelecionado, t))"
              icon="i-lucide-repeat"
              color="warning"
              variant="subtle"
              :ui="{ description: 'text-xs' }"
            />
            <div class="mt-auto flex flex-wrap gap-1.5 border-t border-default p-4">
              <UButton :label="t.mapa.painel.verExecucoes" icon="i-lucide-list" size="xs" color="primary" variant="outline" @click="emit('filtrar', { ...filtroVazio(), fluxos: [noSelecionado.fluxo.id], soOrigem: false, periodo })" />
              <UButton :label="t.mapa.painel.abrirEditor" icon="i-lucide-pencil" size="xs" color="neutral" variant="ghost" @click="foraDoEscopo" />
            </div>
          </template>

          <!-- Evento -->
          <template v-else-if="noSelecionado?.evento">
            <header class="flex items-start gap-2 border-b border-default p-4">
              <UIcon :name="iconeDaCategoria(noSelecionado.evento.categoria)" class="mt-0.5 size-5 text-muted" />
              <h3 class="min-w-0 flex-1 text-sm font-semibold text-highlighted">{{ textoDoEvento(noSelecionado.evento, t) }}</h3>
              <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" :aria-label="t.mapa.painel.fechar" @click="selecionado = null" />
            </header>
            <div v-for="lado in (['gravam', 'escutam'] as const)" :key="lado" class="p-4 pb-0">
              <p class="mb-1 text-xs text-muted">{{ lado === 'gravam' ? t.mapa.painel.quemGrava : t.mapa.painel.quemEscuta }}</p>
              <ul v-if="vizinhosDoEvento(noSelecionado.evento, fluxosDoMapa)[lado].length" class="flex flex-col gap-1">
                <li v-for="f in vizinhosDoEvento(noSelecionado.evento, fluxosDoMapa)[lado]" :key="f.id">
                  <button type="button" class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-toned transition-colors hover:bg-elevated" @click="selecionado = chaveDoFluxo(f.id)">
                    <UIcon name="i-lucide-workflow" class="size-4 shrink-0 text-muted" />
                    <span class="truncate">{{ f.name }}</span>
                  </button>
                </li>
              </ul>
              <p v-else class="text-sm text-muted">{{ t.mapa.painel.ninguem }}</p>
            </div>
          </template>
        </aside>
      </Transition>
    </div>
  </div>
</template>
