<script setup lang="ts">
/**
 * O editor do Spaceflow na proposta. A estrutura é a do develop (abas no topo,
 * trilho à esquerda, canvas com grade, zoom embaixo à esquerda, minimapa
 * embaixo à direita, disquete no canto de cima, botão de adicionar nó à
 * direita). Nada mudou de lugar (regra 16). Muda o peso e o texto:
 *
 * - card do nó: resumo de 1 linha montado da configuração (hoje é a descrição
 *   genérica do tipo) e pendência com palavra ("Falta: Título da tarefa");
 * - saídas com rótulo no card: Aprovado/Rejeitado, Verdadeiro/Falso, rotas;
 * - abrir o nó: o duplo clique continua; no hover aparece "Configurar";
 * - "Adicionar nó" e "Salvar versão" ganham texto; o status do fluxo (hoje
 *   escondido no trilho) aparece na barra das abas;
 * - zoom com botões de 32 px e tooltip; trilho com rótulo no tooltip.
 *
 * O canvas no produto é Vue Flow; aqui é desenho com zoom e rolagem.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Aresta, No } from './mocks'
import type { Textos } from './textos'
import { fluxoInfo } from './mocks'
import { definicoes, grupos, ordemDaPaleta } from './nos'

const props = defineProps<{
  t: Textos
  i: Idioma
  nos: No[]
  arestas: Aresta[]
  resumos: Record<string, string>
  pendencias: Record<string, string[]>
  modificados: string[]
  alteracoes: number
}>()
const emit = defineEmits<{ abrir: [id: string, comPendencia: boolean], adicionar: [tipo: string, x: number, y: number], salvarVersao: [] }>()

const W = 268
const H = 136

/* ---------- zoom e rolagem ---------- */

const canvas = ref<HTMLElement | null>(null)
const zoom = ref(0.8)
const minimapa = ref(true)
const largura = computed(() => Math.max(...props.nos.map(n => (n.position?.x ?? 0) + W)) + 160)
const altura = computed(() => Math.max(...props.nos.map(n => (n.position?.y ?? 0) + H)) + 140)
function mudarZoom(passo: number) {
  zoom.value = Math.min(1.3, Math.max(0.35, Math.round((zoom.value + passo) * 100) / 100))
}
function ajustar() {
  const w = canvas.value?.clientWidth ?? 1200
  zoom.value = Math.max(0.35, Math.min(1, Math.floor(((w - 40) / largura.value) * 100) / 100))
  canvas.value?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
}

/* ---------- saídas e arestas ---------- */

function saidasDe(no: No) {
  return definicoes[no.type]?.saidas?.(no.data as any) ?? []
}
function ySaida(no: No, handle?: string) {
  const s = saidasDe(no)
  const y0 = no.position?.y ?? 0
  if (!s.length || !handle) return y0 + 52
  const idx = Math.max(0, s.findIndex(x => x.id === handle))
  return y0 + 34 + idx * 26
}
const linhas = computed(() => props.arestas.map((a) => {
  const de = props.nos.find(n => n.id === a.source)
  const para = props.nos.find(n => n.id === a.target)
  if (!de || !para) return null
  const x1 = (de.position?.x ?? 0) + W
  const y1 = ySaida(de, a.sourceHandle)
  const x2 = para.position?.x ?? 0
  const y2 = (para.position?.y ?? 0) + 52
  const dx = Math.max(60, (x2 - x1) / 2)
  return { id: a.id, d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}` }
}).filter(Boolean) as { id: string, d: string }[])

/* ---------- estado do card ---------- */

function estado(id: string): 'pendencia' | 'modificado' | 'ok' {
  if (props.pendencias[id]?.length) return 'pendencia'
  return props.modificados.includes(id) ? 'modificado' : 'ok'
}
function textoDaFalta(id: string) {
  const p = props.pendencias[id] ?? []
  return `${props.t.card.falta}: ${p[0]}${p.length > 1 ? ` ${props.t.card.eMais(p.length - 1)}` : ''}`
}
const nosComPendencia = computed(() => props.nos.filter(n => props.pendencias[n.id]?.length))

/* ---------- paleta ---------- */

const paletaAberta = ref(false)
const busca = ref('')
const itensDaPaleta = computed(() => grupos.map((g) => {
  const tipos = ordemDaPaleta.map(tp => definicoes[tp]!).filter(d => d.grupo === g.id)
  const f = busca.value.trim().toLowerCase()
  const filtrados = tipos.filter(d => !f || d.nome[props.i].toLowerCase().includes(f) || d.descricao[props.i].toLowerCase().includes(f))
  return { value: g.id, label: g.nome[props.i], icon: g.icone, tipos: filtrados, total: tipos.length }
}).filter(g => g.tipos.length))
const gruposAbertos = ref<string[]>(['acoes'])
watch(busca, (b) => {
  if (b.trim()) gruposAbertos.value = itensDaPaleta.value.map(g => g.value)
})

function arrastarDaPaleta(e: DragEvent, tipo: string) {
  e.dataTransfer?.setData('application/x-spaceflow-no', tipo)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy'
}
function soltarNoCanvas(e: DragEvent) {
  const tipo = e.dataTransfer?.getData('application/x-spaceflow-no')
  if (!tipo || !canvas.value) return
  const r = canvas.value.getBoundingClientRect()
  const x = (e.clientX - r.left + canvas.value.scrollLeft) / zoom.value - W / 2
  const y = (e.clientY - r.top + canvas.value.scrollTop) / zoom.value - 40
  emit('adicionar', tipo, Math.round(x), Math.round(y))
  paletaAberta.value = false
}

const e = computed(() => props.t.editor)
const rail = computed(() => [
  { id: 'detalhes', icone: 'i-lucide-file', rotulo: e.value.detalhes, linhas: [fluxoInfo.nome, `${e.value.status[fluxoInfo.status]} · ${fluxoInfo.versao}`] },
  { id: 'id', icone: 'i-lucide-tag', rotulo: e.value.identificacao, linhas: [fluxoInfo.uuid] },
  { id: 'gatilho', icone: 'i-lucide-zap', rotulo: e.value.gatilho, linhas: [props.resumos.trig ?? ''] },
  { id: 'historico', icone: 'i-lucide-calendar-clock', rotulo: e.value.historico, linhas: [`${e.value.criadoEm} ${fluxoInfo.criadoEm}`, `${e.value.atualizadoEm} ${fluxoInfo.atualizadoEm}`] },
])
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- Abas do editor (do develop) + status e versão, que hoje ficam escondidos no trilho -->
    <div class="flex h-11 shrink-0 items-center gap-1 border-b border-default px-3">
      <UButton icon="i-lucide-git-fork" :label="e.abas.editor" color="primary" variant="soft" size="xs" />
      <UButton icon="i-lucide-play" :label="e.abas.execucoes" color="neutral" variant="ghost" size="xs" />
      <UButton icon="i-lucide-history" :label="e.abas.versoes" color="neutral" variant="ghost" size="xs" />
      <UButton icon="i-lucide-message-circle" :label="e.abas.comentarios" color="neutral" variant="ghost" size="xs" />
      <UButton icon="i-lucide-scroll-text" :label="e.abas.logs" color="neutral" variant="ghost" size="xs" />
      <span class="ml-auto flex items-center gap-2 text-xs text-muted">
        <UTooltip :text="e.statusDica">
          <UBadge :label="e.status[fluxoInfo.status]" color="success" variant="subtle" icon="i-lucide-circle-check" size="sm" />
        </UTooltip>
        <span class="font-mono text-default">{{ fluxoInfo.versao }}</span>
        <span class="flex items-center border-l border-default pl-2">
          <UTooltip :text="e.versaoAnterior"><UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="xs" :aria-label="e.versaoAnterior" /></UTooltip>
          1/5
          <UTooltip :text="e.versaoSeguinte"><UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" :aria-label="e.versaoSeguinte" /></UTooltip>
        </span>
      </span>
    </div>

    <div class="flex min-h-0 flex-1">
      <!-- Trilho da esquerda (do develop), agora com rótulo no tooltip -->
      <div class="flex w-12 shrink-0 flex-col items-center gap-1.5 border-r border-default pt-2">
        <UPopover v-for="r in rail" :key="r.id" :content="{ side: 'right', align: 'start' }">
          <UTooltip :text="r.rotulo" :content="{ side: 'right' }">
            <UButton :icon="r.icone" color="neutral" variant="ghost" size="sm" :aria-label="r.rotulo" />
          </UTooltip>
          <template #content>
            <div class="max-w-72 space-y-1 p-3 text-sm">
              <p class="text-xs font-semibold uppercase tracking-wide text-muted">{{ r.rotulo }}</p>
              <p v-for="(ln, k) in r.linhas" :key="k" class="break-words text-default" :class="r.id === 'id' ? 'font-mono text-xs' : ''">{{ ln }}</p>
            </div>
          </template>
        </UPopover>
      </div>

      <!-- Canvas -->
      <div class="relative min-w-0 flex-1">
        <div
          ref="canvas"
          class="absolute inset-0 overflow-auto bg-default bg-[linear-gradient(to_right,var(--ui-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--ui-border)_1px,transparent_1px)] bg-size-[40px_40px]"
          @dragover.prevent
          @drop.prevent="soltarNoCanvas"
        >
          <div :style="{ width: `${largura * zoom}px`, height: `${altura * zoom}px` }">
            <div class="relative origin-top-left transition-transform duration-300 ease-out" :style="{ transform: `scale(${zoom})`, width: `${largura}px`, height: `${altura}px` }">
              <svg class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
                <path v-for="l in linhas" :key="l.id" :d="l.d" fill="none" class="stroke-(--ui-border-accented)" stroke-width="2" />
              </svg>

              <div
                v-for="(no, idx) in nos"
                :key="no.id"
                class="group absolute"
                :style="{ left: `${no.position?.x ?? 0}px`, top: `${no.position?.y ?? 0}px`, width: `${W}px`, animation: `entrada .36s ease-out ${idx * 35}ms backwards` }"
              >
                <!-- Barra do hover: torna visível o que hoje só o duplo clique faz -->
                <div class="pointer-events-none absolute -top-9 right-0 flex translate-y-1 gap-1 opacity-0 transition duration-150 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <UButton :label="e.configurar" icon="i-lucide-settings-2" size="xs" color="neutral" variant="outline" class="bg-default shadow-sm" @click="emit('abrir', no.id, estado(no.id) === 'pendencia')" />
                </div>

                <button
                  type="button"
                  class="relative flex w-full flex-col rounded-xl border bg-default px-4 pb-3 pt-3.5 text-left shadow-sm transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
                  :class="estado(no.id) === 'pendencia' ? 'border-error/60' : 'border-default hover:border-accented'"
                  :style="{ minHeight: `${H}px` }"
                  :aria-label="t.card.abrir(no.data.label)"
                  @dblclick="emit('abrir', no.id, estado(no.id) === 'pendencia')"
                  @keydown.enter="emit('abrir', no.id, estado(no.id) === 'pendencia')"
                >
                  <!-- alças -->
                  <span v-if="!definicoes[no.type]?.semEntrada" class="absolute -left-2 size-4 rounded-full border-2 border-default bg-primary" style="top: 44px" />
                  <template v-if="!definicoes[no.type]?.semSaida">
                    <template v-if="saidasDe(no).length">
                      <span
                        v-for="(s, k) in saidasDe(no)"
                        :key="s.id"
                        class="absolute -right-2 flex items-center"
                        :style="{ top: `${26 + k * 26}px` }"
                      >
                        <span class="size-4 rounded-full border-2 border-default bg-primary" />
                        <span class="absolute left-5 whitespace-nowrap rounded-md bg-elevated px-1.5 py-0.5 text-xs font-medium text-default ring ring-default">{{ s.rotulo[i] }}</span>
                      </span>
                    </template>
                    <UTooltip v-else :text="e.arrasteDaSaida">
                      <span class="absolute -right-2 size-4 rounded-full border-2 border-default bg-primary" style="top: 44px" />
                    </UTooltip>
                  </template>

                  <span class="flex items-start gap-3">
                    <span class="flex size-10 shrink-0 items-center justify-center rounded-lg" :class="no.type === 'trigger' ? 'bg-primary text-inverted' : 'bg-primary/10 text-primary'">
                      <UIcon :name="definicoes[no.type]?.icone ?? 'i-lucide-box'" class="size-5" />
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="block text-[11px] font-semibold uppercase tracking-wide text-muted">{{ definicoes[no.type]?.nome[i] }}</span>
                      <span class="block truncate text-base font-semibold text-highlighted">{{ no.data.label }}</span>
                      <span v-if="resumos[no.id]" class="mt-0.5 line-clamp-2 text-sm leading-snug text-default">{{ resumos[no.id] }}</span>
                      <span v-else class="mt-0.5 line-clamp-2 text-sm leading-snug text-muted">{{ definicoes[no.type]?.descricao[i] }}</span>
                    </span>
                  </span>

                  <!-- rodapé com palavra, não só cor -->
                  <span class="mt-auto flex items-center gap-2 pt-2.5 text-xs font-medium">
                    <template v-if="estado(no.id) === 'pendencia'">
                      <span class="size-2 shrink-0 rounded-full bg-error" />
                      <UTooltip :text="pendencias[no.id]!.join(' · ')" :ui="{ content: 'h-auto max-w-72', text: 'whitespace-normal' }">
                        <span class="truncate text-error">{{ textoDaFalta(no.id) }}</span>
                      </UTooltip>
                    </template>
                    <template v-else-if="estado(no.id) === 'modificado'">
                      <span class="size-2 rounded-full bg-warning" /><span class="text-muted">{{ t.card.modificado }}</span>
                    </template>
                    <template v-else>
                      <span class="size-2 rounded-full bg-success" /><span class="text-muted">{{ t.card.configurado }}</span>
                    </template>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pendências do fluxo: atalho para o primeiro nó (o card continua sendo o lugar) -->
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <UButton
            v-if="nosComPendencia.length"
            :label="e.pendenciasNoFluxo(nosComPendencia.length)"
            icon="i-lucide-circle-alert"
            color="error"
            variant="soft"
            size="sm"
            class="absolute left-3 top-3 z-10 shadow-sm"
            :aria-label="e.verPendencia"
            @click="emit('abrir', nosComPendencia[0]!.id, true)"
          />
        </Transition>

        <!-- Salvar versão: o mesmo canto do disquete, agora com texto e contagem -->
        <UTooltip :text="alteracoes ? e.alteracoes(alteracoes) : e.tudoSalvo" :content="{ side: 'left' }">
          <UButton
            icon="i-lucide-save"
            :label="e.salvarVersao"
            :color="alteracoes ? 'primary' : 'neutral'"
            :variant="alteracoes ? 'solid' : 'outline'"
            size="sm"
            class="absolute right-3 top-3 z-10 shadow-sm"
            @click="emit('salvarVersao')"
          >
            <template v-if="alteracoes" #trailing>
              <UBadge :label="String(alteracoes)" color="neutral" variant="solid" size="sm" class="bg-default text-highlighted" />
            </template>
          </UButton>
        </UTooltip>

        <!-- Zoom (lugar do develop), maior e com tooltip -->
        <div class="absolute bottom-4 left-3 z-10 flex flex-col overflow-hidden rounded-lg border border-default bg-default shadow-sm">
          <UTooltip v-for="b in [
            { icon: 'i-lucide-plus', rotulo: e.zoomMais, f: () => mudarZoom(0.1) },
            { icon: 'i-lucide-minus', rotulo: e.zoomMenos, f: () => mudarZoom(-0.1) },
            { icon: 'i-lucide-scan', rotulo: e.ajustar, f: ajustar },
            { icon: 'i-lucide-arrow-down-to-line', rotulo: e.organizarV, f: () => {} },
            { icon: 'i-lucide-arrow-right-to-line', rotulo: e.organizarH, f: () => {} },
            { icon: 'i-lucide-map', rotulo: e.minimapa, f: () => (minimapa = !minimapa) },
          ]" :key="b.icon" :text="b.rotulo" :content="{ side: 'right' }">
            <UButton :icon="b.icon" color="neutral" variant="ghost" size="md" class="rounded-none" :aria-label="b.rotulo" @click="b.f()" />
          </UTooltip>
        </div>

        <!-- Minimapa -->
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-95" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <div v-if="minimapa" class="absolute bottom-4 right-4 z-10 hidden h-28 w-48 overflow-hidden rounded-lg border border-default bg-elevated/80 shadow-sm md:block" aria-hidden="true">
            <div class="relative size-full">
              <span
                v-for="no in nos"
                :key="no.id"
                class="absolute h-2 rounded-sm"
                :class="pendencias[no.id]?.length ? 'bg-error/70' : 'bg-accented'"
                :style="{ left: `${((no.position?.x ?? 0) / largura) * 100}%`, top: `${((no.position?.y ?? 0) / altura) * 100}%`, width: `${(W / largura) * 100}%` }"
              />
            </div>
          </div>
        </Transition>

        <!-- Adicionar nó: o mesmo lugar do develop, com texto -->
        <UButton
          icon="i-lucide-blocks"
          :label="e.adicionarNo"
          color="primary"
          size="lg"
          class="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full shadow-lg transition-transform hover:-translate-y-[calc(50%+2px)]"
          @click="paletaAberta = true"
        />
      </div>
    </div>

    <!-- Paleta: Nós disponíveis (do develop), com grupos em português e descrição de efeito -->
    <USlideover v-model:open="paletaAberta" :title="t.paleta.titulo" :description="t.paleta.descricao" :overlay="false" :modal="false" :ui="{ content: 'max-w-sm', body: 'p-0 sm:p-0' }">
      <template #body>
        <div class="flex h-full flex-col">
          <div class="px-4 pb-2 pt-3">
            <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.paleta.buscar" class="w-full" autofocus />
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            <p v-if="!itensDaPaleta.length" class="px-3 py-6 text-center text-sm text-muted">{{ t.paleta.nenhum }}</p>
            <UAccordion v-model="gruposAbertos" type="multiple" :items="itensDaPaleta" :ui="{ trigger: 'px-2 text-sm', body: 'pb-2' }">
              <template #trailing="{ item }">
                <UBadge :label="String(item.total)" color="neutral" variant="subtle" size="sm" class="ms-auto me-2" />
                <UIcon name="i-lucide-chevron-down" class="size-4 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </template>
              <template #body="{ item }">
                <div class="space-y-1">
                  <div
                    v-for="d in item.tipos"
                    :key="d.tipo"
                    :draggable="!d.emBreve"
                    class="flex items-start gap-3 rounded-lg p-2.5 transition-colors"
                    :class="d.emBreve ? 'opacity-60' : 'cursor-grab hover:bg-elevated active:cursor-grabbing'"
                    @dragstart="arrastarDaPaleta($event, d.tipo)"
                  >
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><UIcon :name="d.icone" class="size-4" /></span>
                    <span class="min-w-0 flex-1">
                      <span class="flex items-center gap-2 text-sm font-medium text-highlighted">
                        {{ d.nome[i] }}
                        <UBadge v-if="d.emBreve" :label="t.paleta.emBreve" color="neutral" variant="outline" size="sm" />
                      </span>
                      <span class="block text-xs leading-snug text-muted">{{ d.descricao[i] }}</span>
                    </span>
                    <UIcon v-if="!d.emBreve" name="i-lucide-grip-vertical" class="mt-1 size-4 shrink-0 text-dimmed" />
                  </div>
                </div>
              </template>
            </UAccordion>
          </div>
          <div class="flex items-start gap-2 border-t border-default px-4 py-3 text-xs text-muted">
            <UIcon name="i-lucide-lightbulb" class="mt-0.5 size-4 shrink-0 text-warning" />
            {{ t.paleta.dica }}
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>
