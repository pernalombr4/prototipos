<script setup lang="ts">
import RodapeDaJanela from './_RodapeDaJanela.vue'
import { MOLDURA } from './moldura'
import type { TextosDaTela } from './textos'

/**
 * AS DUAS PORTAS DO "+" DO TOPO QUE MORAM EM OUTRAS TELAS (rodada 20).
 *
 * Vieram da rodada 15P: "quando eu clicar deve aparecer o modal representando
 * o que deve ocorrer ali" (Mikaela). Item e tarefa não são telas desta
 * proposta, mas o "+" promete que alguma coisa acontece, e toast não é promessa
 * cumprida. Então cada uma abre uma janela com a MESMA moldura das outras,
 * mostrando o que o produto pede ali.
 *
 * Categoria saiu daqui: desde a rodada 16 ela tem formulário de verdade
 * (`_CriarCategoria`), e o "+" do topo abre esse.
 *
 * O que é maquete está dito na janela e no botão, que não salva nada.
 */
const props = defineProps<{
  t: TextosDaTela
  modo: 'item' | 'tarefa'
}>()

const aberto = defineModel<boolean>('open', { default: false })

const campos = computed(() => props.modo === 'item'
  ? [
      { rotulo: props.t.maqueteCategoria, tipo: 'select' as const },
      { rotulo: props.t.maqueteTitulo, tipo: 'texto' as const },
      { rotulo: props.t.maqueteResponsavel, tipo: 'select' as const },
      { rotulo: props.t.maqueteStatus, tipo: 'select' as const },
    ]
  : [
      { rotulo: props.t.maqueteTitulo, tipo: 'texto' as const },
      { rotulo: props.t.maqueteResponsavel, tipo: 'select' as const },
      { rotulo: props.t.maquetePrazo, tipo: 'texto' as const },
      { rotulo: props.t.maqueteDescricao, tipo: 'area' as const },
    ])
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="props.modo === 'item' ? props.t.criarItem : props.t.criarTarefa"
    :description="props.modo === 'item' ? props.t.maqueteItemDescricao : props.t.maqueteTarefaDescricao"
    :ui="{ content: MOLDURA.formulario, overlay: MOLDURA.sobreposicao }"
  >
    <template #body>
      <UAlert
        icon="i-lucide-hammer"
        color="neutral"
        variant="subtle"
        :description="props.t.maqueteAviso"
        class="mb-4"
      />

      <div class="space-y-3">
        <UFormField v-for="campo in campos" :key="campo.rotulo" :label="campo.rotulo">
          <UTextarea v-if="campo.tipo === 'area'" disabled :rows="3" class="w-full" />
          <USelect v-else-if="campo.tipo === 'select'" disabled :items="[]" class="w-full" />
          <UInput v-else disabled class="w-full" />
        </UFormField>
      </div>
    </template>

    <template #footer>
      <RodapeDaJanela
        :cancelar="props.t.cancelar"
        :acao="props.t.criarAcao"
        :contexto="props.t.maqueteRodape"
        desligado
        @cancelar="aberto = false"
      />
    </template>
  </UModal>
</template>
