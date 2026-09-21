<script setup lang="ts">
/**
 * A raia: cabeçalho, corpo e o totalizador preso no rodapé.
 *
 * O rodapé é a peça nova. No quadro de hoje o único número da tela é a
 * contagem no topo e o "500 por página" do rodapé da página inteira. Aqui cada
 * raia fecha a própria conta, e o cálculo se troca pelo próprio rodapé.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import CartaoDeTarefa from './_CartaoDeTarefa.vue'
import {
  calcular, calculosDisponiveis, type Calculo, type DefinicaoDeRaia,
} from './quadro'
import type { Textos } from './textos'

const props = defineProps<{
  raia: DefinicaoDeRaia
  tarefas: Task[]
  t: Textos
  campos: Record<string, boolean>
  densidade: 'compacto' | 'padrao' | 'completo'
  calculo: Calculo
  limite?: number | null
  recolhida?: boolean
  somenteLeitura?: boolean
  tarefaAtiva?: number | null
  carregando?: boolean
  /** Atraso da animação de entrada, para as raias aparecerem em cascata. */
  atraso?: number
}>()

const emit = defineEmits<{
  recolher: []
  ocultar: []
  novaTarefa: []
  calculo: [c: Calculo]
  limite: [n: number | null]
  soltar: [idDaTarefa: number]
  abrir: [tarefa: Task]
  mover: [tarefa: Task, status: Task['status']]
  arquivar: [tarefa: Task]
}>()

/** Quantos cartões a raia mostra antes de pedir mais. Substitui a paginação global. */
const PASSO = 8
const mostrando = ref(PASSO)
watch(() => props.tarefas.length, () => { mostrando.value = PASSO })

const visiveis = computed(() => props.tarefas.slice(0, mostrando.value))
const restantes = computed(() => Math.max(0, props.tarefas.length - mostrando.value))

const resultado = computed(() => calcular(props.tarefas, props.calculo, props.t))
const acimaDoLimite = computed(() => !!props.limite && props.tarefas.length > props.limite)

const recebendo = ref(false)

/**
 * Cor da raia em classe estática. Interpolar (`bg-${cor}`) não funciona:
 * o Tailwind varre o arquivo e não encontra a classe montada em tempo de execução.
 */
const fundoDaCor: Record<string, string> = {
  primary: 'bg-primary', success: 'bg-success', warning: 'bg-warning',
  error: 'bg-error', info: 'bg-info', neutral: 'bg-inverted',
}
const textoDaCor: Record<string, string> = {
  primary: 'text-primary', success: 'text-success', warning: 'text-warning',
  error: 'text-error', info: 'text-info', neutral: 'text-toned',
}

const itensDoCalculo = computed(() => [calculosDisponiveis.map(c => ({
  label: props.t.calculos[c],
  icon: props.calculo === c ? 'i-lucide-check' : 'i-lucide-minus',
  onSelect: () => emit('calculo', c),
}))])

const itensDaRaia = computed(() => [[
  { label: props.t.novaTarefaNaRaia, icon: 'i-lucide-plus', onSelect: () => emit('novaTarefa') },
  { label: props.t.recolher, icon: 'i-lucide-chevrons-right-left', onSelect: () => emit('recolher') },
], [
  { label: props.t.definirLimite, icon: 'i-lucide-gauge', onSelect: () => emit('limite', props.limite ? null : 6) },
  { label: props.t.ocultarRaia, icon: 'i-lucide-eye-off', onSelect: () => emit('ocultar') },
]])

function aoSoltar(evento: DragEvent) {
  recebendo.value = false
  const id = Number(evento.dataTransfer?.getData('text/plain'))
  if (id) emit('soltar', id)
}
</script>

<template>
  <!-- Raia recolhida: vira trilho estreito e continua contando -->
  <div
    v-if="recolhida"
    class="flex h-full w-11 shrink-0 cursor-pointer flex-col items-center gap-3 rounded-xl border border-default bg-elevated/40 py-3 transition-colors hover:bg-elevated"
    role="button"
    tabindex="0"
    :aria-label="`${raia.rotulo}, ${t.expandir}`"
    @click="emit('recolher')"
    @keydown.enter="emit('recolher')"
    @keydown.space.prevent="emit('recolher')"
  >
    <UIcon :name="raia.icone" class="size-4" :class="textoDaCor[raia.cor]" />
    <span class="text-xs font-semibold text-toned">{{ tarefas.length }}</span>
    <span class="flex-1 text-xs font-medium text-muted [writing-mode:vertical-rl]">{{ raia.rotulo }}</span>
    <UIcon name="i-lucide-chevrons-left-right" class="size-3.5 text-dimmed" />
  </div>

  <!-- Raia aberta -->
  <section
    v-else
    class="flex h-full w-[19rem] min-w-[17rem] max-w-[26rem] flex-1 shrink-0 flex-col rounded-xl border border-default bg-elevated/30 transition-colors"
    :class="recebendo ? 'border-primary bg-primary/5' : ''"
    :style="atraso ? `animation: entrada .35s ease-out ${atraso}ms both` : undefined"
    :aria-label="raia.rotulo"
    @dragover.prevent="recebendo = true"
    @dragleave="recebendo = false"
    @drop.prevent="aoSoltar"
  >
    <!-- Cabeçalho -->
    <header class="flex items-center gap-2 border-b border-default px-3 py-2.5">
      <span class="size-2 shrink-0 rounded-full" :class="fundoDaCor[raia.cor]" />
      <h2 class="truncate text-sm font-semibold text-highlighted">{{ raia.rotulo }}</h2>
      <span
        class="rounded-full px-1.5 py-0.5 text-xs font-medium"
        :class="acimaDoLimite ? 'bg-error/15 text-error' : 'bg-accented text-toned'"
      >
        {{ limite ? `${tarefas.length}/${limite}` : tarefas.length }}
      </span>

      <div class="ml-auto flex items-center gap-0.5">
        <UButton
          v-if="!somenteLeitura"
          icon="i-lucide-plus"
          color="neutral"
          variant="ghost"
          size="xs"
          :aria-label="t.novaTarefaNaRaia"
          @click="emit('novaTarefa')"
        />
        <UDropdownMenu :items="itensDaRaia" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t.acoesDaRaia"
          />
        </UDropdownMenu>
      </div>
    </header>

    <p v-if="acimaDoLimite" class="border-b border-default bg-error/10 px-3 py-1.5 text-xs text-error">
      {{ t.limiteExcedido(tarefas.length, limite!) }}
    </p>

    <!-- Corpo -->
    <div class="min-h-0 flex-1 space-y-2 overflow-y-auto p-2">
      <template v-if="carregando">
        <USkeleton v-for="n in 3" :key="n" class="h-24 w-full rounded-lg" />
      </template>

      <template v-else>
        <div
          v-for="(tarefa, i) in visiveis"
          :key="tarefa.id"
          :draggable="!somenteLeitura"
          :style="`animation: entrada .3s ease-out ${i * 35}ms both`"
          @dragstart="(e: DragEvent) => e.dataTransfer?.setData('text/plain', String(tarefa.id))"
        >
          <CartaoDeTarefa
            :tarefa="tarefa"
            :t="t"
            :campos="campos"
            :densidade="densidade"
            :somente-leitura="somenteLeitura"
            :ativo="tarefaAtiva === tarefa.id"
            @abrir="emit('abrir', tarefa)"
            @mover="(s) => emit('mover', tarefa, s)"
            @arquivar="emit('arquivar', tarefa)"
          />
        </div>

        <UButton
          v-if="restantes"
          :label="t.carregarMais(Math.min(PASSO, restantes))"
          color="neutral"
          variant="ghost"
          size="xs"
          block
          icon="i-lucide-chevron-down"
          @click="mostrando += PASSO"
        />

        <div
          v-if="!tarefas.length"
          class="flex flex-col items-center gap-1 rounded-lg border border-dashed border-default px-3 py-8 text-center"
        >
          <UIcon :name="raia.icone" class="size-5 text-dimmed" />
          <p class="text-xs font-medium text-muted">{{ t.raiaVazia }}</p>
          <p v-if="!somenteLeitura" class="text-xs text-muted">{{ t.raiaVaziaAjuda }}</p>
        </div>
      </template>
    </div>

    <!-- Totalizador. Fica sempre visível, mesmo com a raia rolada. -->
    <footer
      class="flex items-center gap-2 rounded-b-xl border-t border-default bg-elevated px-3 py-2"
    >
      <UDropdownMenu :items="itensDoCalculo" :content="{ align: 'start' }">
        <button
          type="button"
          class="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-toned transition-colors hover:text-highlighted"
          :aria-label="t.escolherCalculo"
        >
          <UIcon name="i-lucide-sigma" class="size-3.5" />
          {{ calculo === 'nenhum' ? t.calculadora : t.calculos[calculo] }}
          <UIcon name="i-lucide-chevron-down" class="size-3" />
        </button>
      </UDropdownMenu>

      <span
        class="ml-auto text-sm font-semibold tabular-nums transition-colors"
        :class="resultado.alerta ? 'text-error' : 'text-highlighted'"
        role="status"
        :aria-label="`${t.calculos[calculo]}: ${resultado.valor}`"
      >
        {{ resultado.valor }}
      </span>
    </footer>
  </section>
</template>
