<script setup lang="ts">
/**
 * A raia: cabeçalho, corpo e o totalizador preso no rodapé.
 *
 * Duas coisas que o quadro de hoje não tem e que moram aqui:
 *
 *  - **o totalizador**, que soma CAMPO por OPERAÇÃO. O campo pode ser os
 *    pontos da tarefa ou qualquer resposta numérica do formulário dela
 *    (`EnlNumber`), inclusive monetária, que no ENSPACE é o mesmo campo com
 *    `cFormat.n_style: 'currency'`. A lista sai do próprio dado carregado;
 *  - **a ordem por raia**, que o `EnKanbanBoard` do SDK já aceita por coluna
 *    (`sortByField` e `sortDesc`) e a tela nunca expôs.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import CartaoDeTarefa from './_CartaoDeTarefa.vue'
import {
  calcular, ordenacoes, operacoesNumericas,
  type Calculo, type CampoCalculavel, type ChaveOrdenacao, type DefinicaoDeRaia, type Operacao,
} from './quadro'
import type { Textos } from './textos'

export interface OrdemDaRaia {
  chave: ChaveOrdenacao
  desc: boolean
}

const props = defineProps<{
  raia: DefinicaoDeRaia
  tarefas: Task[]
  t: Textos
  /** Quais campos aparecem no cartão. */
  campos: Record<string, boolean>
  /** O que o totalizador pode somar, descoberto do dado carregado. */
  camposDoTotalizador: CampoCalculavel[]
  densidade: 'compacto' | 'padrao' | 'completo'
  calculo: Calculo
  /** Ordem só desta raia. `null` quer dizer "a mesma do quadro". */
  ordenacaoDaRaia?: OrdemDaRaia | null
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
  ordenacao: [o: OrdemDaRaia | null]
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

const campoEscolhido = computed(() =>
  props.camposDoTotalizador.find(c => c.chave === props.calculo.campo))

const resultado = computed(() =>
  calcular(props.tarefas, props.calculo, campoEscolhido.value, props.t))

const acimaDoLimite = computed(() => !!props.limite && props.tarefas.length > props.limite)

const recebendo = ref(false)

/* ------------------------------ o limite ------------------------------ */

/**
 * Antes isto era um item de menu que ligava um `6` que ninguém escolheu.
 * Agora abre um diálogo: a pessoa diz o número, vê quantos cartões tem hoje
 * e lê o que o limite faz (avisa, não impede).
 */
const definindoLimite = ref(false)
const limiteEmEdicao = ref(6)

function abrirLimite() {
  // Sem limite ainda? Parte do que a raia tem hoje, que é um número com sentido.
  limiteEmEdicao.value = props.limite ?? Math.max(1, props.tarefas.length)
  definindoLimite.value = true
}

function salvarLimite() {
  emit('limite', Math.max(1, Math.round(limiteEmEdicao.value)))
  definindoLimite.value = false
}

function removerLimite() {
  emit('limite', null)
  definindoLimite.value = false
}

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

/* ----------------------------- o totalizador ----------------------------- */

/** Campo derivado não tem operação: contar é o que ele faz. */
const temOperacao = computed(() => campoEscolhido.value?.origem !== 'derivado')

const rotuloDoCalculo = computed(() => {
  const campo = campoEscolhido.value
  if (!campo) return props.t.calculadora
  if (!temOperacao.value) return campo.rotulo
  return `${props.t.operacoes[props.calculo.operacao]} · ${campo.rotulo}`
})

const gruposDeCampos = computed(() => [
  { titulo: props.t.camposDaTarefa, itens: props.camposDoTotalizador.filter(c => c.origem === 'tarefa') },
  { titulo: props.t.camposDoFormulario, itens: props.camposDoTotalizador.filter(c => c.origem === 'formulario') },
  { titulo: props.t.contagens, itens: props.camposDoTotalizador.filter(c => c.origem === 'derivado') },
].filter(g => g.itens.length))

function escolherCampo(campo: CampoCalculavel) {
  emit('calculo', { campo: campo.chave, operacao: props.calculo.operacao })
}

function escolherOperacao(operacao: Operacao) {
  emit('calculo', { campo: props.calculo.campo, operacao })
}

/* ------------------------------ a ordenação ------------------------------ */

const rotuloDaOrdem = computed(() => {
  if (!props.ordenacaoDaRaia) return ''
  const o = ordenacoes.find(x => x.valor === props.ordenacaoDaRaia!.chave)
  return o ? props.t.campos[o.rotulo] : ''
})

const itensDeOrdenacao = computed(() => [
  ordenacoes.map(o => ({
    label: props.t.campos[o.rotulo],
    icon: props.ordenacaoDaRaia?.chave === o.valor ? 'i-lucide-check' : 'i-lucide-minus',
    onSelect: () => emit('ordenacao', { chave: o.valor, desc: props.ordenacaoDaRaia?.desc ?? false }),
  })),
  [{
    label: props.ordenacaoDaRaia?.desc ? props.t.decrescente : props.t.crescente,
    icon: props.ordenacaoDaRaia?.desc ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-narrow-wide',
    onSelect: () => emit('ordenacao', {
      chave: props.ordenacaoDaRaia?.chave ?? 'due_date',
      desc: !props.ordenacaoDaRaia?.desc,
    }),
  }, {
    label: props.t.usarOrdemDoQuadro,
    icon: 'i-lucide-rotate-ccw',
    onSelect: () => emit('ordenacao', null),
  }],
])

const itensDaRaia = computed(() => [[
  { label: props.t.novaTarefaNaRaia, icon: 'i-lucide-plus', onSelect: () => emit('novaTarefa') },
  { label: props.t.ordemDaRaia, icon: 'i-lucide-arrow-up-down', children: itensDeOrdenacao.value },
], [
  { label: props.t.recolher, icon: 'i-lucide-chevrons-right-left', onSelect: () => emit('recolher') },
  { label: props.t.definirLimite, icon: 'i-lucide-gauge', onSelect: abrirLimite },
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
      <UTooltip
        :text="limite
          ? `${t.limiteTitulo}: ${t.limiteAtual(tarefas.length, limite)}`
          : `${t.calculos.contagem}: ${tarefas.length}`"
      >
        <span
          class="cursor-default rounded-full px-1.5 py-0.5 text-xs font-medium"
          :class="acimaDoLimite ? 'bg-error/15 text-error' : 'bg-accented text-toned'"
        >
          {{ limite ? `${tarefas.length}/${limite}` : tarefas.length }}
        </span>
      </UTooltip>

      <!-- Ordem própria: sem isto, a raia fora da ordem do quadro parece defeito -->
      <UTooltip v-if="ordenacaoDaRaia" :text="t.ordemPropria(rotuloDaOrdem)">
        <UIcon
          :name="ordenacaoDaRaia.desc ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-narrow-wide'"
          class="size-3.5 shrink-0 text-primary"
        />
      </UTooltip>

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

    <div
      v-if="acimaDoLimite"
      class="flex items-center gap-1.5 border-b border-default bg-error/10 px-3 py-1.5 text-xs text-error"
    >
      <UIcon name="i-lucide-triangle-alert" class="size-3.5 shrink-0" />
      <span class="flex-1">{{ t.limiteExcedido(tarefas.length, limite!) }}</span>
      <UButton
        :label="t.editarCampo"
        size="xs"
        color="error"
        variant="link"
        class="p-0"
        @click="abrirLimite"
      />
    </div>

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
    <footer class="flex items-center gap-2 rounded-b-xl border-t border-default bg-elevated px-3 py-2">
      <UPopover :content="{ align: 'start', side: 'top' }">
        <button
          type="button"
          class="flex min-w-0 items-center gap-1 text-xs font-medium uppercase tracking-wide text-toned transition-colors hover:text-highlighted"
          :aria-label="t.escolherCalculo"
        >
          <UIcon name="i-lucide-sigma" class="size-3.5 shrink-0" />
          <span class="truncate">{{ rotuloDoCalculo }}</span>
          <UIcon name="i-lucide-chevron-down" class="size-3 shrink-0" />
        </button>

        <template #content>
          <div class="flex w-[28rem] divide-x divide-default">
            <!-- Campo -->
            <div class="max-h-80 w-1/2 overflow-y-auto p-1.5">
              <p class="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
                {{ t.campoDoCalculo }}
              </p>
              <template v-for="grupo in gruposDeCampos" :key="grupo.titulo">
                <p class="px-2 pb-0.5 pt-2 text-xs text-muted">{{ grupo.titulo }}</p>
                <UButton
                  v-for="campo in grupo.itens"
                  :key="campo.chave"
                  :label="campo.rotulo"
                  :icon="calculo.campo === campo.chave ? 'i-lucide-check' : 'i-lucide-minus'"
                  block
                  size="sm"
                  color="neutral"
                  :variant="calculo.campo === campo.chave ? 'soft' : 'ghost'"
                  class="justify-start"
                  @click="escolherCampo(campo)"
                >
                  <span class="truncate">{{ campo.rotulo }}</span>
                  <UBadge
                    v-if="campo.tipo === 'moeda'"
                    label="R$"
                    color="neutral"
                    variant="subtle"
                    size="sm"
                    class="ml-auto"
                  />
                </UButton>
              </template>
            </div>

            <!-- Operação -->
            <div class="w-1/2 p-1.5">
              <p class="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
                {{ t.operacaoDoCalculo }}
              </p>
              <UButton
                v-for="op in operacoesNumericas"
                :key="op"
                :label="t.operacoes[op]"
                :icon="calculo.operacao === op ? 'i-lucide-check' : 'i-lucide-minus'"
                block
                size="sm"
                color="neutral"
                :variant="calculo.operacao === op ? 'soft' : 'ghost'"
                class="justify-start"
                :disabled="!temOperacao"
                @click="escolherOperacao(op)"
              />
              <p v-if="!temOperacao" class="px-2 pt-2 text-xs text-muted">
                {{ t.contagens }}
              </p>
            </div>
          </div>
        </template>
      </UPopover>

      <UTooltip
        v-if="resultado.cobertura && resultado.cobertura.com < resultado.cobertura.total"
        :text="t.cobertura(resultado.cobertura.com, resultado.cobertura.total)"
      >
        <span
          class="ml-auto flex items-center gap-1 text-sm font-semibold tabular-nums transition-colors"
          :class="resultado.alerta ? 'text-error' : 'text-highlighted'"
          role="status"
        >
          <span v-if="!resultado.valor" class="text-xs font-normal text-muted">
            {{ t.semValorNaRaia }}
          </span>
          <template v-else>{{ resultado.valor }}</template>
          <UIcon name="i-lucide-info" class="size-3 text-muted" />
        </span>
      </UTooltip>

      <span
        v-else
        class="ml-auto text-sm font-semibold tabular-nums transition-colors"
        :class="resultado.alerta ? 'text-error' : 'text-highlighted'"
        role="status"
        :aria-label="`${rotuloDoCalculo}: ${resultado.valor}`"
      >
        {{ resultado.valor }}
      </span>
    </footer>

    <!-- Definir o limite: o número passa a ser escolha, não mágica -->
    <UModal v-model:open="definindoLimite" :title="t.limiteTitulo" :ui="{ content: 'max-w-md' }">
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-muted">
            <span class="font-medium text-highlighted">{{ raia.rotulo }}</span>.
            {{ t.limiteHoje(tarefas.length) }}.
          </p>

          <div>
            <label for="limite-da-raia" class="mb-1.5 block text-sm font-medium text-highlighted">
              {{ t.limitePergunta }}
            </label>
            <UInputNumber
              id="limite-da-raia"
              v-model="limiteEmEdicao"
              :min="1"
              :max="99"
              size="lg"
              class="w-40"
            />
          </div>

          <div>
            <p class="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
              {{ t.limiteSugestoes }}
            </p>
            <div class="flex flex-wrap gap-1">
              <UButton
                v-for="n in [3, 5, 8, 10, 15]"
                :key="n"
                :label="String(n)"
                size="xs"
                class="w-10 justify-center"
                :color="limiteEmEdicao === n ? 'primary' : 'neutral'"
                :variant="limiteEmEdicao === n ? 'soft' : 'outline'"
                @click="limiteEmEdicao = n"
              />
            </div>
          </div>

          <p class="flex items-start gap-1.5 rounded-lg bg-elevated p-3 text-xs text-toned">
            <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0 text-muted" />
            {{ t.limiteAjuda }}
          </p>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full items-center gap-2">
          <UButton
            v-if="limite"
            :label="t.limiteRemover"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="removerLimite"
          />
          <div class="ml-auto flex gap-2">
            <UButton :label="t.cancelar" color="neutral" variant="ghost" size="sm" @click="definindoLimite = false" />
            <UButton :label="t.limiteSalvar" color="primary" size="sm" @click="salvarLimite" />
          </div>
        </div>
      </template>
    </UModal>
  </section>
</template>
