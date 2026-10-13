<script setup lang="ts">
import type { TextosDaTela } from './textos'

/**
 * AS OUTRAS TRÊS PORTAS DO "+".
 *
 * Rodada 15. Ela pediu: "voce deve explorar todos os comportamentos do botao
 * '+' na trilha. quando eu clicar deve aparecer o modal representando o que
 * deve ocorrer ali".
 *
 * Criar item, tarefa e categoria não são telas desta proposta: moram em outros
 * lugares do produto. Mas o "+" promete que alguma coisa acontece, e toast não
 * é promessa cumprida. Então cada opção abre uma camada com a MESMA moldura das
 * outras, mostrando o que o produto pede naquele formulário.
 *
 * O que é maquete está dito na própria camada e no botão, que não salva nada.
 * Regra 19: não resolver na tela B um problema da tela A.
 */
const props = defineProps<{
  t: TextosDaTela
  modo: 'item' | 'tarefa' | 'categoria'
}>()

const aberto = defineModel<boolean>('open', { default: false })

/** Os campos que o produto pede em cada um dos três. */
const campos = computed(() => {
  if (props.modo === 'item') {
    return [
      { rotulo: props.t.maqueteCategoria, tipo: 'select' as const },
      { rotulo: props.t.maqueteTitulo, tipo: 'texto' as const },
      { rotulo: props.t.maqueteResponsavel, tipo: 'select' as const },
      { rotulo: props.t.maqueteStatus, tipo: 'select' as const },
    ]
  }
  if (props.modo === 'tarefa') {
    return [
      { rotulo: props.t.maqueteTitulo, tipo: 'texto' as const },
      { rotulo: props.t.maqueteResponsavel, tipo: 'select' as const },
      { rotulo: props.t.maquetePrazo, tipo: 'texto' as const },
      { rotulo: props.t.maqueteDescricao, tipo: 'area' as const },
    ]
  }
  return [
    { rotulo: props.t.campoNome, tipo: 'texto' as const },
    { rotulo: props.t.campoIcone, tipo: 'texto' as const },
    { rotulo: props.t.maqueteDescricao, tipo: 'area' as const },
    { rotulo: props.t.maqueteFormularios, tipo: 'select' as const },
  ]
})

const titulo = computed(() => ({
  item: props.t.criarItem,
  tarefa: props.t.criarTarefa,
  categoria: props.t.criarCategoria,
}[props.modo]))

const descricao = computed(() => ({
  item: props.t.maqueteItemDescricao,
  tarefa: props.t.maqueteTarefaDescricao,
  categoria: props.t.maqueteCategoriaDescricao,
}[props.modo]))
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="titulo"
    :description="descricao"
    :ui="{ content: 'max-w-3xl' }"
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
      <div class="flex w-full flex-wrap items-center gap-2">
        <p class="min-w-0 flex-1 text-xs text-muted">{{ props.t.maqueteRodape }}</p>
        <UButton :label="props.t.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UTooltip :text="props.t.maqueteAviso">
          <UButton :label="props.t.criarAcao" color="primary" disabled />
        </UTooltip>
      </div>
    </template>
  </UModal>
</template>
