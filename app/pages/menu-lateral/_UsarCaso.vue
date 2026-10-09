<script setup lang="ts">
import EscolhaDeAplicar from './_EscolhaDeAplicar.vue'
import { useAplicarCaso, useJanelasDeCasos, type ModoDeAplicar } from './casos'
import type { TextosDaTela } from './textos'

/**
 * USAR UM CASO DE USO (rodada 18): o "Usar modelo" do ClickUp, que APLICA.
 * Antes do clique, a pessoa vê o que entra, escolhe somar ou substituir e
 * onde os menus ficam. Depois, os menus estão no menu (no rascunho, com o
 * Salvar aceso) e as categorias, na lista.
 */
const props = defineProps<{ t: TextosDaTela }>()

const janelas = useJanelasDeCasos()
const { aplicar } = useAplicarCaso()
const toast = useToast()

const aberta = computed({
  get: () => janelas.usando.value !== null,
  set: (v) => { if (!v) janelas.usando.value = null },
})
const modo = ref<ModoDeAplicar>('somar')
const lugar = ref<'inicio' | 'trilha'>('inicio')
watch(aberta, (v) => { if (v) { modo.value = 'somar'; lugar.value = 'inicio' } })

function usar() {
  const caso = janelas.usando.value
  if (!caso) return
  aplicar(caso, modo.value, lugar.value)
  toast.add({ title: props.t.casoAplicado(caso.nome), icon: caso.icone, color: 'success' })
  janelas.usando.value = null
  janelas.central.value = false
}
</script>

<template>
  <UModal
    v-model:open="aberta"
    :title="janelas.usando.value ? props.t.usarTitulo(janelas.usando.value.nome) : ''"
    :ui="{ content: 'max-w-xl' }"
  >
    <template #body>
      <EscolhaDeAplicar v-if="janelas.usando.value" v-model:modo="modo" v-model:lugar="lugar" :t="props.t" :caso="janelas.usando.value" />
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="props.t.cancelar" color="neutral" variant="ghost" @click="janelas.usando.value = null" />
        <UButton
          :label="props.t.aplicarCaso"
          :color="modo === 'substituir' ? 'error' : 'primary'"
          :icon="modo === 'substituir' ? 'i-lucide-replace' : 'i-lucide-list-plus'"
          @click="usar"
        />
      </div>
    </template>
  </UModal>
</template>
