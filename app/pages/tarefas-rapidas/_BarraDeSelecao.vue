<script setup lang="ts">
/**
 * A barra da seleção em massa, no formato do ClickUp.
 *
 * **O desenho é o da Bulk Action Toolbar dele**, pedido na rodada 25: barra
 * escura flutuando no pé da tela, centralizada; à esquerda um bloco com o
 * número grande e o que ele significa; depois as ações, cada uma com o ícone
 * em cima e o rótulo embaixo; e o X de sair na ponta.
 *
 * Três coisas explicam por que esse formato funciona, e por isso foram
 * copiadas:
 *
 *   - **flutua**, então não empurra o quadro nem tapa a raia onde se está
 *     selecionando;
 *   - **começa pela contagem**, que é a informação que decide se dá para
 *     clicar em algo destrutivo com segurança;
 *   - **inverte o fundo**, e com isso ela para de competir com os cartões:
 *     enquanto existe seleção, é a única coisa escura na tela.
 *
 * ⚠️ O que NÃO foi copiado é a identidade: cor, tipografia e ícones são os do
 * ENSPACE (regra 8). E as ações são as nossas, as que o produto já faz uma a
 * uma no menu do cartão e no painel. Ação em massa que não existe sozinha
 * seria invenção, não escala.
 *
 * A lixeira é a única que confirma, como no Jira. Está no PESQUISA.md.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import { pessoas } from './mocks'
import { iconeDaPrioridade } from './quadro'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Quantas estão selecionadas. Zero esconde a barra. */
  quantas: number
  /** As raias do agrupamento atual, para o "mover para". */
  raias: { valor: string, rotulo: string }[]
  /** Mover só faz sentido quando a raia é a situação da tarefa. */
  podeMover: boolean
}>()

const emit = defineEmits<{
  limpar: []
  mover: [valor: string]
  atribuir: [id: number | null]
  prioridade: [valor: Task['priority']]
  prazo: [dias: number | null]
  arquivar: []
  lixeira: []
}>()

const confirmando = ref(false)

/**
 * Fecha a confirmação ANTES de emitir. A ação zera a seleção e tira a barra da
 * tela, e fazer as duas coisas no mesmo instante deixava o modal a meio caminho.
 */
async function confirmar() {
  confirmando.value = false
  await nextTick()
  emit('lixeira')
}

/** Esc larga a seleção, que é o caminho de fuga de todo modo de seleção. */
function aoTeclar(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.quantas && !confirmando.value) emit('limpar')
}

onMounted(() => window.addEventListener('keydown', aoTeclar))
onBeforeUnmount(() => window.removeEventListener('keydown', aoTeclar))

const itensDeRaia = computed(() =>
  props.raias.map(r => ({ label: r.rotulo, onSelect: () => emit('mover', r.valor) })))

const itensDePessoa = computed(() => [
  { label: props.t.semResponsavel, icon: 'i-lucide-user-x', onSelect: () => emit('atribuir', null) },
  ...Object.values(pessoas).map(p => ({
    label: p.fullname,
    avatar: { text: p.iniciais, alt: p.fullname },
    onSelect: () => emit('atribuir', p.id),
  })),
])

const itensDePrioridade = computed(() =>
  (['urgent', 'high', 'normal', 'low'] as const).map(p => ({
    label: props.t.prioridade[p],
    icon: iconeDaPrioridade[p],
    onSelect: () => emit('prioridade', p),
  })))

/** Os mesmos atalhos do formulário de criação, mais o "tirar prazo". */
const itensDePrazo = computed(() => [[
  { label: props.t.prazoHoje, icon: 'i-lucide-calendar-clock', onSelect: () => emit('prazo', 0) },
  { label: props.t.prazoAmanha, icon: 'i-lucide-calendar-arrow-up', onSelect: () => emit('prazo', 1) },
  { label: props.t.prazoProximaSemana, icon: 'i-lucide-calendar-days', onSelect: () => emit('prazo', 7) },
], [
  { label: props.t.tirarPrazo, icon: 'i-lucide-calendar-off', onSelect: () => emit('prazo', null) },
]])
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="translate-y-3 opacity-0"
    leave-active-class="transition duration-150"
    leave-to-class="translate-y-3 opacity-0"
  >
    <div
      v-if="quantas"
      class="fixed inset-x-0 bottom-24 z-40 flex justify-center px-4"
      role="region"
      :aria-label="t.selecao.selecionadas(quantas)"
    >
      <div class="flex items-stretch overflow-hidden rounded-xl bg-inverted shadow-xl ring-1 ring-inverted/10">
        <!-- O bloco da contagem: número grande, e o que ele significa embaixo -->
        <div class="flex items-center gap-2.5 bg-primary px-4 py-2 text-inverted">
          <span class="text-2xl font-semibold leading-none tabular-nums">{{ quantas }}</span>
          <span class="max-w-24 text-xs leading-tight">{{ t.selecao.selecionadas(quantas) }}</span>
        </div>

        <!-- As ações, ícone em cima e rótulo embaixo -->
        <div class="flex items-stretch gap-0.5 px-1.5 py-1.5">
          <UDropdownMenu v-if="podeMover" :items="itensDeRaia" :content="{ side: 'top' }">
            <button type="button" class="flex w-20 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-inverted transition-colors hover:bg-inverted/10">
              <UIcon name="i-lucide-corner-down-right" class="size-4" />
              <span class="text-[11px] leading-none">{{ t.selecao.mover }}</span>
            </button>
          </UDropdownMenu>

          <UDropdownMenu :items="itensDePessoa" :content="{ side: 'top' }">
            <button type="button" class="flex w-20 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-inverted transition-colors hover:bg-inverted/10">
              <UIcon name="i-lucide-user" class="size-4" />
              <span class="text-[11px] leading-none">{{ t.selecao.atribuir }}</span>
            </button>
          </UDropdownMenu>

          <UDropdownMenu :items="itensDePrioridade" :content="{ side: 'top' }">
            <button type="button" class="flex w-20 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-inverted transition-colors hover:bg-inverted/10">
              <UIcon name="i-lucide-flag" class="size-4" />
              <span class="text-[11px] leading-none">{{ t.selecao.prioridade }}</span>
            </button>
          </UDropdownMenu>

          <UDropdownMenu :items="itensDePrazo" :content="{ side: 'top' }">
            <button type="button" class="flex w-20 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-inverted transition-colors hover:bg-inverted/10">
              <UIcon name="i-lucide-calendar-clock" class="size-4" />
              <span class="text-[11px] leading-none">{{ t.campos.prazo }}</span>
            </button>
          </UDropdownMenu>

          <button
            type="button"
            class="flex w-20 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-inverted transition-colors hover:bg-inverted/10"
            @click="emit('arquivar')"
          >
            <UIcon name="i-lucide-archive" class="size-4" />
            <span class="text-[11px] leading-none">{{ t.selecao.arquivar }}</span>
          </button>

          <!-- A única destrutiva: cor de erro mesmo no fundo escuro, e confirma -->
          <UTooltip :text="t.selecao.lixeira">
            <button
              type="button"
              class="flex w-20 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-error transition-colors hover:bg-error/15"
              @click="confirmando = true"
            >
              <UIcon name="i-lucide-trash-2" class="size-4" />
              <span class="text-[11px] leading-none">{{ t.selecao.lixeiraCurto }}</span>
            </button>
          </UTooltip>
        </div>

        <!-- Sair da seleção, separado do resto por uma linha -->
        <div class="flex items-center border-s border-inverted/15 px-1.5">
          <UTooltip :text="`${t.selecao.limpar} (Esc)`">
            <button
              type="button"
              class="flex size-8 items-center justify-center rounded-lg text-inverted transition-colors hover:bg-inverted/10"
              :aria-label="t.selecao.limpar"
              @click="emit('limpar')"
            >
              <UIcon name="i-lucide-x" class="size-4" />
            </button>
          </UTooltip>
        </div>
      </div>
    </div>
  </Transition>

  <!--
    O modal fica FORA do `v-if` da barra, e isso não é estilo: dentro dele, a
    confirmação some junto com a barra no mesmo instante em que a ação zera a
    seleção, e o nó da barra fica preso no DOM com a contagem velha.
  -->
  <UModal v-model:open="confirmando" :title="t.selecao.confirmarTitulo(quantas)">
    <template #body>
      <p class="text-sm text-muted">{{ t.selecao.confirmarTexto }}</p>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.cancelar" color="neutral" variant="ghost" @click="confirmando = false" />
        <UButton
          :label="t.selecao.confirmarLixeira"
          icon="i-lucide-trash-2"
          color="error"
          @click="confirmar"
        />
      </div>
    </template>
  </UModal>
</template>
