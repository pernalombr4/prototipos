<script setup lang="ts">
import RodapeDaJanela from './_RodapeDaJanela.vue'
import { MOLDURA } from './moldura'
import { useConfirmarExclusao } from './confirmacao'
import type { TextosDaTela } from './textos'

/**
 * A JANELA "EXCLUIR O PAINEL?" (rodada 34). Abre só quando a exclusão leva um
 * painel junto; o estado e a regra moram em confirmacao.ts.
 */
const props = defineProps<{ t: TextosDaTela }>()

const { pedido, confirmar } = useConfirmarExclusao()

const aberta = computed({
  get: () => !!pedido.value,
  set: (v) => { if (!v) pedido.value = null },
})

/* Guarda o último pedido para o texto não sumir durante a animação de fechar. */
const ultimo = ref(pedido.value)
watch(pedido, (p) => { if (p) ultimo.value = p })

const titulo = computed(() => {
  const p = ultimo.value
  if (!p) return ''
  return p.no.tipo === 'secao' ? props.t.confirmarExclusaoSecao(p.nome) : props.t.confirmarExclusaoMenu(p.nome)
})
</script>

<template>
  <UModal
    v-model:open="aberta"
    :title="titulo"
    :ui="{ content: MOLDURA.formulario, overlay: MOLDURA.sobreposicao }"
  >
    <template #body>
      <div class="flex items-start gap-3">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
          <UIcon name="i-lucide-chart-column" class="size-4.5" />
        </span>
        <p class="pt-1.5 text-sm text-default">{{ props.t.confirmarExclusaoPainel(ultimo?.paineis ?? 1) }}</p>
      </div>
    </template>
    <template #footer>
      <RodapeDaJanela
        :cancelar="props.t.cancelar"
        :acao="props.t.confirmarExclusaoBotao"
        :contexto="props.t.confirmarExclusaoContexto"
        icone-da-acao="i-lucide-trash-2"
        perigo
        @cancelar="aberta = false"
        @acao="confirmar"
      />
    </template>
  </UModal>
</template>
