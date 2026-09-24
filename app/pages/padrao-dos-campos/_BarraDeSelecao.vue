<script setup lang="ts">
/**
 * A BARRA DA SELEÇÃO EM MASSA, no formato da Bulk Action Toolbar do ClickUp.
 *
 * Ela pediu nesta rodada: marcar a caixa de um item tem que abrir um menu
 * flutuante, como no ClickUp. O desenho é o mesmo já decidido no protótipo
 * `tarefas-rapidas` (rodada 25 de lá), e repetir o desenho é de propósito: se
 * as duas telas do produto tiverem seleção em massa, ela é a MESMA barra.
 *
 * Três coisas explicam o formato, e por isso foram copiadas:
 *
 * - **flutua**, então não empurra a tabela nem tapa a linha que se está
 *   marcando;
 * - **começa pela contagem**, que é a informação que decide se dá para clicar
 *   em algo destrutivo com segurança;
 * - **inverte o fundo**, e com isso para de competir com a tabela: enquanto
 *   existe seleção, é a única coisa escura na tela.
 *
 * ⚠️ AS AÇÕES SÃO AS QUE A LINHA JÁ TEM, uma a uma, no menu de três pontos:
 * copiar link e enviar para a lixeira. Ação em massa que não existe sozinha
 * seria invenção, não escala, e é a mesma regra do protótipo vizinho. Ver
 * detalhes e editar não entram porque são de UM registro por natureza.
 *
 * A lixeira confirma antes, como no Jira.
 */
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Quantos itens estão marcados. Zero esconde a barra. */
  quantos: number
}>()

const emit = defineEmits<{
  limpar: []
  copiarLinks: []
  lixeira: []
}>()

const confirmando = ref(false)

/**
 * Fecha a confirmação ANTES de emitir: a ação zera a seleção e tira a barra da
 * tela, e fazer as duas coisas no mesmo instante deixa o modal a meio caminho.
 * Aprendido no protótipo vizinho.
 */
async function confirmar() {
  confirmando.value = false
  await nextTick()
  emit('lixeira')
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    enter-from-class="translate-y-3 opacity-0"
    leave-active-class="transition duration-150"
    leave-to-class="translate-y-3 opacity-0"
  >
    <div
      v-if="quantos"
      class="pointer-events-none fixed inset-x-0 bottom-8 flex justify-center px-4"
      role="region"
      :aria-label="t.selecao.selecionados(quantos)"
    >
      <div class="pointer-events-auto flex items-stretch overflow-hidden rounded-xl bg-inverted shadow-xl ring-1 ring-inverted/10">
        <!-- A contagem primeiro: número grande, e o que ele significa ao lado. -->
        <div class="flex items-center gap-2.5 bg-primary px-4 py-2 text-inverted">
          <span class="text-2xl font-semibold leading-none tabular-nums">{{ quantos }}</span>
          <span class="max-w-24 text-xs leading-tight">{{ t.selecao.selecionados(quantos) }}</span>
        </div>

        <div class="flex items-stretch gap-0.5 px-1.5 py-1.5">
          <button
            type="button"
            class="flex w-20 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-inverted transition-colors hover:bg-inverted/10"
            @click="emit('copiarLinks')"
          >
            <UIcon name="i-lucide-link" class="size-4" />
            <span class="text-[11px] leading-none">{{ t.copiarLink }}</span>
          </button>

          <button
            type="button"
            class="flex w-20 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-error transition-colors hover:bg-error/15"
            @click="confirmando = true"
          >
            <UIcon name="i-lucide-trash-2" class="size-4" />
            <span class="text-[11px] leading-none">{{ t.selecao.lixeira }}</span>
          </button>
        </div>

        <!-- Sair da seleção, na ponta, como no ClickUp. -->
        <button
          type="button"
          class="flex items-center border-l border-inverted/10 px-3 text-inverted transition-colors hover:bg-inverted/10"
          :aria-label="t.selecao.limpar"
          @click="emit('limpar')"
        >
          <UIcon name="i-lucide-x" class="size-4" />
        </button>
      </div>
    </div>
  </Transition>

  <UModal v-model:open="confirmando" :title="t.selecao.confirmarTitulo">
    <template #body>
      <p class="text-sm text-muted">{{ t.selecao.confirmarTexto(quantos) }}</p>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.cancelar" color="neutral" variant="ghost" size="sm" @click="confirmando = false" />
        <UButton :label="t.selecao.lixeira" color="error" size="sm" @click="confirmar()" />
      </div>
    </template>
  </UModal>
</template>
