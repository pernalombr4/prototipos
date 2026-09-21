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
  reordenar: [valorDaRaiaArrastada: string]
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

/**
 * O menu do totalizador, numa coluna só.
 *
 * A primeira versão tinha dois painéis com rolagem, campo de um lado e
 * operação do outro. Nenhum dos produtos que fazem isso trabalha assim:
 * no Notion e no ClickUp o campo é a própria coluna e o menu só escolhe a
 * operação; o Twenty, que é kanban como aqui, resolve com **um menu e
 * submenu por operação**.
 *
 * Aqui a lista é uma só, na vertical, com cabeçalho de grupo:
 *
 *   Contagens        escolha direta, porque contar não tem operação
 *   Números          cada campo abre o submenu com soma, média, mínimo…
 *   Nenhum           desliga o rodapé
 *
 * O ícone do campo diz se ele é número ou dinheiro, e a linha escolhida fica
 * destacada. O selo "R$" que ficava solto na lista saiu: virou o ícone.
 */
const SEM_CALCULO = 'nenhum'

function iconeDoCampo(campo: CampoCalculavel) {
  return campo.tipo === 'moeda' ? 'i-lucide-circle-dollar-sign' : 'i-lucide-hash'
}

const itensDoCalculo = computed(() => {
  const t = props.t
  const derivados = props.camposDoTotalizador.filter(c => c.origem === 'derivado')
  const numericos = props.camposDoTotalizador.filter(c => c.origem !== 'derivado')

  const contagens = [
    { label: t.contagens, type: 'label' as const },
    ...derivados.map(c => ({
      label: c.rotulo,
      type: 'checkbox' as const,
      checked: props.calculo.campo === c.chave,
      onSelect: () => emit('calculo', { campo: c.chave, operacao: props.calculo.operacao }),
    })),
  ]

  const numeros = [
    { label: t.numeros, type: 'label' as const },
    ...numericos.map(c => ({
      label: c.rotulo,
      icon: iconeDoCampo(c),
      class: props.calculo.campo === c.chave ? 'bg-elevated font-medium' : undefined,
      children: [
        { label: t.comoCalcular, type: 'label' as const },
        ...operacoesNumericas.map(op => ({
          label: t.operacoes[op],
          type: 'checkbox' as const,
          checked: props.calculo.campo === c.chave && props.calculo.operacao === op,
          onSelect: () => emit('calculo', { campo: c.chave, operacao: op }),
        })),
      ],
    })),
  ]

  const desligar = [{
    label: t.calculos.nenhum,
    icon: 'i-lucide-circle-slash',
    onSelect: () => emit('calculo', { campo: SEM_CALCULO, operacao: props.calculo.operacao }),
  }]

  return [contagens, numeros, desligar]
})

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

/**
 * A raia recebe dois tipos de arraste: cartão e a própria raia. O tipo do
 * `dataTransfer` separa os dois, porque durante o `dragover` o navegador não
 * deixa ler o valor, só os tipos.
 */
const TIPO_RAIA = 'application/x-raia'

const recebendoRaia = ref(false)

function aoArrastarSobre(evento: DragEvent) {
  if (evento.dataTransfer?.types.includes(TIPO_RAIA)) recebendoRaia.value = true
  else recebendo.value = true
}

function aoSair() {
  recebendo.value = false
  recebendoRaia.value = false
}

function aoSoltar(evento: DragEvent) {
  recebendo.value = false
  recebendoRaia.value = false

  const raiaArrastada = evento.dataTransfer?.getData(TIPO_RAIA)
  if (raiaArrastada) {
    if (raiaArrastada !== props.raia.valor) emit('reordenar', raiaArrastada)
    return
  }

  const id = Number(evento.dataTransfer?.getData('text/plain'))
  if (id) emit('soltar', id)
}

function aoComecarArrasteDaRaia(evento: DragEvent) {
  evento.dataTransfer?.setData(TIPO_RAIA, props.raia.valor)
  if (evento.dataTransfer) evento.dataTransfer.effectAllowed = 'move'
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
    :class="[
      recebendo ? 'border-primary bg-primary/5' : '',
      recebendoRaia ? 'border-primary border-dashed ring-2 ring-primary/30' : '',
    ]"
    :style="atraso ? `animation: entrada .35s ease-out ${atraso}ms both` : undefined"
    :aria-label="raia.rotulo"
    @dragover.prevent="aoArrastarSobre"
    @dragleave="aoSair"
    @drop.prevent="aoSoltar"
  >
    <!-- Cabeçalho -->
    <header
      class="group/raia flex items-center gap-2 border-b border-default px-3 py-2.5"
      :draggable="!somenteLeitura"
      @dragstart="aoComecarArrasteDaRaia"
    >
      <UTooltip v-if="!somenteLeitura" :text="t.arrastarRaia">
        <span
          class="-ml-1 cursor-grab text-muted opacity-0 transition-opacity active:cursor-grabbing group-hover/raia:opacity-100"
          :aria-label="t.arrastarRaia"
        >
          <UIcon name="i-lucide-grip-vertical" class="size-3.5" />
        </span>
      </UTooltip>
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
      <UDropdownMenu :items="itensDoCalculo" :content="{ align: 'start', side: 'top' }">
        <button
          type="button"
          class="flex min-w-0 items-center gap-1 text-xs font-medium uppercase tracking-wide text-toned transition-colors hover:text-highlighted"
          :aria-label="t.escolherCalculo"
        >
          <UIcon name="i-lucide-sigma" class="size-3.5 shrink-0" />
          <span class="truncate">{{ rotuloDoCalculo }}</span>
          <UIcon name="i-lucide-chevron-down" class="size-3 shrink-0" />
        </button>
      </UDropdownMenu>

      <UTooltip
        v-if="resultado.cobertura && resultado.cobertura.com < resultado.cobertura.total"
        :text="t.cobertura(resultado.cobertura.com, resultado.cobertura.total)"
      >
        <span
          class="ml-auto flex items-center gap-1 text-sm font-semibold tabular-nums transition-colors"
          :class="resultado.alerta ? 'text-error' : 'text-highlighted'"
          role="status"
        >
          <span v-if="!resultado.valor" class="whitespace-nowrap text-xs font-normal text-muted">
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
