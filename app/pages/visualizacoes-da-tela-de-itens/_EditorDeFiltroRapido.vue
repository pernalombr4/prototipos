<script setup lang="ts">
/**
 * PROPOSTA (rodada 8): criar e editar o filtro rápido, o botão que a pessoa liga e desliga na linha de filtros.
 *
 * O nome é o texto do botão. O que o botão filtra usa o mesmo construtor do filtro avançado (E, Ou e grupos),
 * então 1 botão pode juntar mais de uma regra. Excluir fica no modo de edição, à esquerda do rodapé.
 */
import type { FiltroRapido, GrupoDeRegras } from './mocks'
import type { Textos } from './textos'
import { clonar } from './mocks'
import { grupoComEfeito } from './filtros'
import ConstrutorDeRegras from './_ConstrutorDeRegras.vue'

const props = defineProps<{ t: Textos, inicial: FiltroRapido | null, editando: boolean, nomesUsados: string[] }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ salvar: [FiltroRapido], excluir: [] }>()

const nome = ref('')
const regras = ref<GrupoDeRegras>({ conector: 'and', regras: [] })
const tentou = ref(false)

watch(aberto, (v) => {
  if (!v || !props.inicial) return
  nome.value = props.inicial.nome
  regras.value = clonar(props.inicial.regras)
  tentou.value = false
})

const erroNome = computed(() => {
  if (!tentou.value) return undefined
  const n = nome.value.trim()
  if (!n) return props.t.rapido.nomeVazio
  if (props.nomesUsados.some(x => x.toLowerCase() === n.toLowerCase())) return props.t.rapido.nomeRepetido
  return undefined
})
const erroRegras = computed(() => tentou.value && !grupoComEfeito(regras.value) ? props.t.rapido.semValor : undefined)

function confirmar() {
  tentou.value = true
  if (erroNome.value || erroRegras.value) return
  emit('salvar', { id: props.inicial?.id || `rapido-${Date.now()}`, nome: nome.value.trim(), regras: clonar(regras.value) })
  aberto.value = false
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="editando ? t.rapido.editar : t.rapido.novo"
    :description="t.rapido.ajuda"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <form id="form-filtro-rapido" class="space-y-4" @submit.prevent="confirmar">
        <UFormField :label="t.rapido.nome" :error="erroNome" required>
          <UInput v-model="nome" :placeholder="t.rapido.nomeExemplo" :maxlength="40" class="w-72 max-w-full" autofocus />
        </UFormField>
        <UFormField :label="t.rapido.condicao" :error="erroRegras">
          <div class="rounded-md border border-default p-2">
            <ConstrutorDeRegras v-model="regras" :t="t" />
          </div>
        </UFormField>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full items-center gap-2">
        <UButton v-if="editando" :label="t.rapido.excluir" icon="i-lucide-trash-2" color="error" variant="ghost" @click="aberto = false; emit('excluir')" />
        <span class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
          <UButton :label="editando ? t.rapido.salvar : t.rapido.criar" type="submit" form="form-filtro-rapido" />
        </span>
      </div>
    </template>
  </UModal>
</template>
