<script setup lang="ts">
/**
 * O editor do Spaceflow, copiado do develop.
 *
 * ⚠️ NADA AQUI É PROPOSTA, com UMA exceção: o texto do card do nó Atraso. Hoje
 * o card mostra a descrição genérica ("Atrasa o fluxo por um período de tempo
 * especificado."); na proposta ele mostra a espera configurada.
 *
 * O resto reproduz `<BASE_URL>/workspaces/<ws>/settings/data/workflows/524`
 * em 14/10/2026: abas Editor, Execuções, Versões, Comentários e Logs; as
 * setas de versão "1/5"; o disquete com o ponto de alteração; o trilho da
 * esquerda; a grade do canvas; os cards com ícone, título, descrição e
 * rodapé de estado; os controles de zoom; o minimapa e o botão redondo que
 * abre a paleta de nós. O canvas no produto é Vue Flow; aqui é desenho
 * estático com zoom, porque arrastar nó não está em discussão.
 */
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** O texto do card do Atraso: a descrição de hoje ou o resumo da proposta. */
  descricaoDoAtraso: string
  /** O resumo vem da proposta: o card ganha o contorno de "o que muda". */
  resumoProposto: boolean
  estadoDoAtraso: 'ok' | 'modificado' | 'erro'
}>()

const emit = defineEmits<{ abrirAtraso: [] }>()

interface No {
  id: string
  icone: string
  x: number
  /** Cor do selo do ícone: o Start é o único preenchido. */
  cheio?: boolean
}

const nos: No[] = [
  { id: 'start', icone: 'i-lucide-arrow-right-to-line', x: 40, cheio: true },
  { id: 'atraso', icone: 'i-lucide-clock', x: 380 },
  { id: 'email', icone: 'i-lucide-mail', x: 720 },
  { id: 'end', icone: 'i-lucide-circle-dot', x: 1060 },
]
const LARGURA = 280
const ALTO = 124
const Y = 120

const zoom = ref(0.92)
function mudarZoom(passo: number) {
  zoom.value = Math.min(1.2, Math.max(0.5, Math.round((zoom.value + passo) * 100) / 100))
}

const arestas = computed(() => nos.slice(0, -1).map((n, i) => {
  const proximo = nos[i + 1]!
  return { de: n.x + LARGURA, para: proximo.x, y: Y + 54 }
}))

function estadoDe(id: string) {
  if (id === 'atraso') return props.estadoDoAtraso
  if (id === 'end') return 'ok'
  return 'modificado'
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- Abas do editor (cópia do develop) -->
    <div class="flex h-11 shrink-0 items-center gap-1 border-b border-default px-3">
      <UButton icon="i-lucide-file" color="neutral" variant="outline" size="xs" class="mr-2 rounded-full" :aria-label="t.editor.detalhes" />
      <UButton icon="i-lucide-git-fork" :label="t.editor.abas.editor" color="primary" variant="ghost" size="xs" />
      <UButton icon="i-lucide-play" :label="t.editor.abas.execucoes" color="neutral" variant="ghost" size="xs" />
      <UButton icon="i-lucide-history" :label="t.editor.abas.versoes" color="neutral" variant="ghost" size="xs" />
      <UButton icon="i-lucide-message-circle" :label="t.editor.abas.comentarios" color="neutral" variant="ghost" size="xs" />
      <UButton icon="i-lucide-scroll-text" :label="t.editor.abas.logs" color="neutral" variant="ghost" size="xs" />
      <span class="ml-auto flex items-center gap-1 border-l border-default pl-3 text-xs text-muted">
        <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="xs" aria-label="1/5" />
        1/5
        <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" aria-label="1/5" />
      </span>
    </div>

    <div class="flex min-h-0 flex-1">
      <!-- Trilho da esquerda -->
      <div class="flex w-12 shrink-0 flex-col items-center gap-3 border-r border-default pt-3">
        <UIcon name="i-lucide-tag" class="size-4 text-muted" />
        <UIcon name="i-lucide-zap" class="size-4 text-muted" />
        <UIcon name="i-lucide-calendar-plus" class="size-4 text-muted" />
      </div>

      <!-- Canvas -->
      <div
        class="relative min-w-0 flex-1 overflow-hidden bg-default bg-[linear-gradient(to_right,var(--ui-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--ui-border)_1px,transparent_1px)] bg-size-[40px_40px]"
      >
        <UButton
          icon="i-lucide-save"
          color="neutral"
          variant="ghost"
          size="sm"
          class="absolute right-3 top-3 z-10"
          :aria-label="t.editor.salvar"
        >
          <template #trailing>
            <span class="absolute right-1 top-1 size-1.5 rounded-full bg-error" />
          </template>
        </UButton>

        <div
          class="absolute left-0 top-0 origin-top-left transition-transform duration-300 ease-out"
          :style="{ transform: `scale(${zoom})`, width: '1400px', height: '420px' }"
        >
          <svg class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
            <line
              v-for="(a, i) in arestas"
              :key="i"
              :x1="a.de"
              :x2="a.para"
              :y1="a.y"
              :y2="a.y"
              class="stroke-(--ui-border-accented)"
              stroke-width="2"
            />
          </svg>

          <component
            :is="no.id === 'atraso' ? 'button' : 'div'"
            v-for="(no, i) in nos"
            :key="no.id"
            :type="no.id === 'atraso' ? 'button' : undefined"
            class="absolute flex flex-col rounded-xl border bg-default px-4 pb-3 pt-4 text-left shadow-sm transition-[box-shadow,transform,border-color] duration-200"
            :class="[
              no.id === 'atraso' ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary' : '',
              no.id === 'atraso' && estadoDoAtraso === 'erro' ? 'border-error/50 border-dashed' : 'border-default',
              no.id === 'atraso' && resumoProposto ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-(--ui-bg)' : '',
            ]"
            :style="{ left: `${no.x}px`, top: `${Y}px`, width: `${LARGURA}px`, minHeight: `${ALTO}px`, animation: `entrada .36s ease-out ${i * 70}ms backwards` }"
            @dblclick="no.id === 'atraso' && emit('abrirAtraso')"
            @click="no.id === 'atraso' && emit('abrirAtraso')"
          >
            <!-- alças de entrada e saída -->
            <span v-if="no.id !== 'start'" class="absolute -left-2 top-[46px] size-4 rounded-full bg-primary/70" />
            <span v-if="no.id !== 'end'" class="absolute -right-2 top-[46px] size-4 rounded-full bg-primary/70" />

            <span class="flex items-start gap-3">
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-lg"
                :class="no.cheio ? 'bg-primary text-inverted' : 'bg-elevated text-primary'"
              >
                <UIcon :name="no.icone" class="size-5" />
              </span>
              <span class="min-w-0">
                <span class="block text-base font-semibold text-highlighted">{{ t.nos[no.id as 'start'].titulo }}</span>
                <span class="mt-0.5 block text-sm leading-snug text-muted">
                  <template v-if="no.id === 'start'">
                    {{ t.nos.start.quandoUmItemFor }} <strong class="text-highlighted underline">{{ t.nos.start.criado }}</strong>
                    {{ t.nos.start.naCategoria }} <strong class="text-highlighted underline">{{ t.categoria }}</strong>
                  </template>
                  <template v-else-if="no.id === 'atraso'">
                    <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-100" leave-to-class="opacity-0">
                      <span :key="descricaoDoAtraso" class="line-clamp-3" :class="resumoProposto ? 'text-default' : ''">{{ descricaoDoAtraso }}</span>
                    </Transition>
                  </template>
                  <template v-else>
                    <span class="line-clamp-2">{{ t.nos[no.id as 'email'].descricao }}</span>
                  </template>
                </span>
              </span>
            </span>

            <span class="mt-auto flex items-center gap-2 pt-3 text-xs font-medium tracking-wide">
              <template v-if="estadoDe(no.id) === 'erro'">
                <span class="size-2 rounded-full bg-error" />
                <span class="text-muted">{{ t.nos.erros(1) }}</span>
                <UTooltip :text="t.nos.semAlvo">
                  <UIcon name="i-lucide-circle-alert" class="ml-auto size-4 text-error" />
                </UTooltip>
              </template>
              <template v-else-if="estadoDe(no.id) === 'modificado'">
                <span class="size-2 rounded-full bg-warning" />
                <span class="text-muted">{{ t.nos.modificado }}</span>
              </template>
              <template v-else>
                <span class="size-2 rounded-full bg-success" />
                <span class="text-muted">{{ t.nos.ok }}</span>
              </template>
            </span>
          </component>
        </div>

        <!-- Zoom (cópia do develop: coluna à esquerda, embaixo) -->
        <div class="absolute bottom-4 left-3 flex flex-col overflow-hidden rounded-md border border-default bg-default shadow-sm">
          <UButton icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" :aria-label="t.editor.zoomMais" @click="mudarZoom(0.1)" />
          <UButton icon="i-lucide-minus" color="neutral" variant="ghost" size="xs" :aria-label="t.editor.zoomMenos" @click="mudarZoom(-0.1)" />
          <UButton icon="i-lucide-scan" color="neutral" variant="ghost" size="xs" :aria-label="t.editor.ajustar" @click="zoom = 0.92" />
          <UButton icon="i-lucide-network" color="neutral" variant="ghost" size="xs" :aria-label="t.editor.organizar" />
        </div>

        <!-- Minimapa -->
        <div class="absolute bottom-4 right-4 hidden h-24 w-40 rounded-md border border-default bg-elevated/70 p-3 md:block" aria-hidden="true">
          <div class="flex gap-1.5">
            <span v-for="n in 4" :key="n" class="h-3 flex-1 rounded-sm bg-accented" />
          </div>
        </div>

        <!-- Abre a paleta de nós -->
        <UTooltip :text="t.editor.adicionarNo">
          <UButton
            icon="i-lucide-blocks"
            color="primary"
            size="lg"
            class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
            :aria-label="t.editor.adicionarNo"
          />
        </UTooltip>
      </div>
    </div>
  </div>
</template>

