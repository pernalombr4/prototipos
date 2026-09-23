<script setup lang="ts">
/**
 * A barra da seleção em massa.
 *
 * **Fica flutuando no pé da tela**, e não é escolha de gosto: é onde ClickUp e
 * monday põem a delas, e o motivo é que a barra precisa aparecer sem empurrar
 * o quadro para baixo nem tapar a raia onde a pessoa está selecionando. Ela
 * começa dizendo quantas estão selecionadas, que é a informação que decide se
 * a pessoa pode clicar em algo destrutivo com segurança.
 *
 * As ações são as que o produto já tem no menu do cartão (mover de raia,
 * responsável, prioridade, arquivar, enviar para a lixeira), porque ação em
 * massa que não existe uma a uma seria invenção, não escala.
 *
 * A lixeira é a única com confirmação, e o texto dela diz para onde as tarefas
 * vão. É o que o Jira faz: mudança em massa passa por uma tela de confirmação
 * antes de acontecer. Está no PESQUISA.md, consulta da rodada 24.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import { pessoas } from './mocks'
import { corDaPrioridade, iconeDaPrioridade } from './quadro'
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
  arquivar: []
  lixeira: []
}>()

const confirmando = ref(false)

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
      <div class="flex flex-wrap items-center gap-1.5 rounded-xl border border-default bg-default px-3 py-2 shadow-lg">
        <span class="flex items-center gap-2 pe-1.5 text-sm font-medium text-highlighted">
          <UBadge :label="String(quantas)" color="primary" variant="solid" size="sm" class="tabular-nums" />
          {{ t.selecao.selecionadas(quantas) }}
        </span>

        <span class="h-5 w-px bg-accented" />

        <UDropdownMenu v-if="podeMover" :items="itensDeRaia">
          <UButton :label="t.selecao.mover" icon="i-lucide-corner-down-right" size="xs" color="neutral" variant="ghost" />
        </UDropdownMenu>

        <UDropdownMenu :items="itensDePessoa">
          <UButton :label="t.selecao.atribuir" icon="i-lucide-user" size="xs" color="neutral" variant="ghost" />
        </UDropdownMenu>

        <UDropdownMenu :items="itensDePrioridade">
          <UButton :label="t.selecao.prioridade" icon="i-lucide-flag" size="xs" color="neutral" variant="ghost" />
        </UDropdownMenu>

        <UButton
          :label="t.selecao.arquivar"
          icon="i-lucide-archive"
          size="xs"
          color="neutral"
          variant="ghost"
          @click="emit('arquivar')"
        />

        <!-- A única que confirma: depois da lixeira, o caminho de volta é outro -->
        <UButton
          :label="t.selecao.lixeira"
          icon="i-lucide-trash-2"
          size="xs"
          color="error"
          variant="ghost"
          @click="confirmando = true"
        />

        <span class="h-5 w-px bg-accented" />

        <UButton
          icon="i-lucide-x"
          size="xs"
          color="neutral"
          variant="ghost"
          :aria-label="t.selecao.limpar"
          @click="emit('limpar')"
        />
      </div>

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
              @click="confirmando = false; emit('lixeira')"
            />
          </div>
        </template>
      </UModal>
    </div>
  </Transition>
</template>
