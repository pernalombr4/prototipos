<script setup lang="ts">
/**
 * O canvas do editor do Spaceflow, simplificado.
 *
 * ⚠️ NADA AQUI É PROPOSTA, com UMA exceção: o aviso de ciclo no card do nó que
 * pode disparar o próprio fluxo ("Pode disparar este fluxo de novo"), ligado à
 * seção Repetição sem fim da aba Proteções.
 *
 * O resto reproduz o editor do develop em 24/10/2026: trilho da esquerda,
 * grade, cards com ícone, título, descrição e rodapé de estado, zoom, minimapa,
 * disquete e o botão redondo que abre a paleta. O canvas no produto é Vue Flow;
 * aqui é desenho estático, porque arrastar nó não está em discussão.
 */
import type { Textos } from './textos'
import type { Gatilho } from './protecoes'

const props = defineProps<{
  t: Textos
  gatilho: Gatilho
  /** O ciclo que a análise do fluxo encontrou e se a proteção já resolve. */
  ciclo: 'nenhum' | 'aberto' | 'resolvido'
  /** Pisca o nó do ciclo: a pessoa chegou por "Ver no editor". */
  destacar: boolean
}>()

interface No { id: 'start' | 'ia' | 'crud' | 'email' | 'end', icone: string, cheio?: boolean }

const nos: No[] = [
  { id: 'start', icone: 'i-lucide-arrow-right-to-line', cheio: true },
  { id: 'ia', icone: 'i-lucide-sparkles' },
  { id: 'crud', icone: 'i-lucide-database' },
  { id: 'email', icone: 'i-lucide-mail' },
  { id: 'end', icone: 'i-lucide-circle-dot' },
]
const LARGURA = 260
const PASSO = 320
const Y = 120

/** Qual nó fecha o ciclo: a gravação no item ou a resposta para a caixa observada. */
const noDoCiclo = computed(() => props.gatilho === 'email' ? 'email' : props.gatilho === 'itens' ? 'crud' : null)

function titulo(no: No) {
  if (no.id === 'start') return props.t.canvas.start
  if (no.id === 'email' && props.gatilho === 'email') return props.t.canvas.emailResposta.titulo
  return props.t.canvas[no.id].titulo
}
function descricao(no: No) {
  if (no.id === 'start') return props.t.canvas.inicio[props.gatilho]
  if (no.id === 'email' && props.gatilho === 'email') return props.t.canvas.emailResposta.descricao
  return props.t.canvas[no.id].descricao
}

const zoom = ref(0.72)
function mudarZoom(passo: number) {
  zoom.value = Math.min(1.2, Math.max(0.5, Math.round((zoom.value + passo) * 100) / 100))
}
</script>

<template>
  <div class="flex min-h-0 flex-1">
    <!-- Trilho da esquerda -->
    <div class="flex w-12 shrink-0 flex-col items-center gap-3 border-r border-default pt-3">
      <UIcon name="i-lucide-tag" class="size-4 text-muted" />
      <UIcon name="i-lucide-zap" class="size-4 text-muted" />
      <UIcon name="i-lucide-calendar-plus" class="size-4 text-muted" />
    </div>

    <div
      class="relative min-w-0 flex-1 overflow-hidden bg-default bg-[linear-gradient(to_right,var(--ui-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--ui-border)_1px,transparent_1px)] bg-size-[40px_40px]"
    >
      <UButton icon="i-lucide-save" color="neutral" variant="ghost" size="sm" class="absolute right-3 top-3 z-10" :aria-label="t.editor.salvar" />

      <div
        class="absolute left-6 top-0 origin-top-left transition-transform duration-300 ease-out"
        :style="{ transform: `scale(${zoom})`, width: `${nos.length * PASSO}px`, height: '420px' }"
      >
        <svg class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
          <line
            v-for="i in nos.length - 1"
            :key="i"
            :x1="(i - 1) * PASSO + LARGURA"
            :x2="i * PASSO"
            :y1="Y + 54"
            :y2="Y + 54"
            class="stroke-(--ui-border-accented)"
            stroke-width="2"
          />
        </svg>

        <div
          v-for="(no, i) in nos"
          :key="no.id"
          class="absolute flex flex-col rounded-xl border bg-default px-4 pb-3 pt-4 text-left shadow-sm transition-[box-shadow,border-color] duration-300"
          :class="[
            no.id === noDoCiclo && ciclo === 'aberto' ? 'border-warning' : 'border-default',
            no.id === noDoCiclo && destacar ? 'ring-4 ring-warning/40 ring-offset-2 ring-offset-(--ui-bg) animate-pulse' : '',
          ]"
          :style="{ left: `${i * PASSO}px`, top: `${Y}px`, width: `${LARGURA}px`, minHeight: '124px', animation: destacar && no.id === noDoCiclo ? undefined : `entrada .36s ease-out ${i * 70}ms backwards` }"
        >
          <span v-if="no.id !== 'start'" class="absolute -left-2 top-[46px] size-4 rounded-full bg-primary/70" />
          <span v-if="no.id !== 'end'" class="absolute -right-2 top-[46px] size-4 rounded-full bg-primary/70" />

          <span class="flex items-start gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg" :class="no.cheio ? 'bg-primary text-inverted' : 'bg-elevated text-primary'">
              <UIcon :name="no.icone" class="size-5" />
            </span>
            <span class="min-w-0">
              <span class="block text-base font-semibold text-highlighted">{{ titulo(no) }}</span>
              <span class="mt-0.5 line-clamp-3 block text-sm leading-snug text-muted">{{ descricao(no) }}</span>
            </span>
          </span>

          <span class="mt-auto flex items-center gap-2 pt-3 text-xs font-medium tracking-wide">
            <template v-if="no.id === noDoCiclo && ciclo === 'aberto'">
              <UIcon name="i-lucide-repeat" class="size-4 text-warning" />
              <span class="text-highlighted">{{ t.canvas.podeRepetir }}</span>
            </template>
            <template v-else-if="no.id === noDoCiclo && ciclo === 'resolvido'">
              <UIcon name="i-lucide-shield-check" class="size-4 text-success" />
              <span class="text-muted">{{ t.canvas.protegido }}</span>
            </template>
            <template v-else>
              <span class="size-2 rounded-full bg-success" />
              <span class="text-muted">{{ t.canvas.ok }}</span>
            </template>
          </span>
        </div>
      </div>

      <div class="absolute bottom-4 left-3 flex flex-col overflow-hidden rounded-md border border-default bg-default shadow-sm">
        <UButton icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" :aria-label="t.editor.zoomMais" @click="mudarZoom(0.1)" />
        <UButton icon="i-lucide-minus" color="neutral" variant="ghost" size="xs" :aria-label="t.editor.zoomMenos" @click="mudarZoom(-0.1)" />
        <UButton icon="i-lucide-scan" color="neutral" variant="ghost" size="xs" :aria-label="t.editor.ajustar" @click="zoom = 0.72" />
      </div>

      <div class="absolute bottom-4 right-4 hidden h-24 w-40 rounded-md border border-default bg-elevated/70 p-3 md:block" aria-hidden="true">
        <div class="flex gap-1.5">
          <span v-for="n in 5" :key="n" class="h-3 flex-1 rounded-sm bg-accented" />
        </div>
      </div>

      <UTooltip :text="t.editor.adicionarNo">
        <UButton icon="i-lucide-blocks" color="primary" size="lg" class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full" :aria-label="t.editor.adicionarNo" />
      </UTooltip>
    </div>
  </div>
</template>
