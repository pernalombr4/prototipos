<script setup lang="ts">
/**
 * Criar item, aberto do botão Criar ou do "+" do widget Categorias. No
 * produto é o modal de criação da categoria (`EntityItemsFormsUpsert.vue`),
 * com os campos do formulário escolhido; aqui são 4 campos comuns, o bastante
 * para o item nascer e aparecer no widget da visualização.
 *
 * Título "Criar <singular>" pelo `singular_name` da categoria ("Criar
 * chamado"); sem singular, "Criar item em <categoria>". A descrição diz de
 * qual formulário vêm os campos, ou "Todos os campos da categoria" quando ela
 * não tem formulário. Hoje o modal de develop diz "Novo registro" e o seletor
 * diz "Formulario", sem acento (DECISOES.md, rodada 2).
 *
 * `inicial` (rodada 6): o rascunho que o BENI montou, quando a pessoa escolhe
 * "Revisar no formulário" na conversa.
 *
 * Rodada 8: sai o campo Responsável. O item não tem responsável; quem cria é
 * o autor (`Item.user`). A data é um campo do formulário da categoria.
 *
 * Componentes: `UModal`, `UFormField`, `UInput`, `UInputNumber`, `USwitch` (MCP nuxt-ui).
 */
import type { Categoria } from './mocks'
import type { Textos } from './textos'

export interface DadosDoItem {
  titulo: string
  valor?: number
  /** Um campo de data do formulário da categoria. */
  data?: number
  urgente: boolean
}

const props = defineProps<{
  t: Textos
  categoria?: Categoria
  /** Formulário escolhido; sem ele, todos os campos da categoria. */
  formulario?: string
  /** Rascunho do BENI, quando vem da conversa. */
  inicial?: Partial<DadosDoItem>
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ criar: [dados: DadosDoItem] }>()

const titulo = ref('')
const valor = ref<number | undefined>()
const data = ref('')
const urgente = ref(false)
const tentou = ref(false)

watch(aberto, (a) => {
  if (!a) return
  const i = props.inicial
  titulo.value = i?.titulo ?? ''
  valor.value = i?.valor
  // A data é gravada às 21:00 UTC (18:00 de Brasília): o campo de data mostra o dia.
  data.value = i?.data ? new Date(i.data).toISOString().slice(0, 10) : ''
  urgente.value = i?.urgente ?? false
  tentou.value = false
})

const nomeDoFormulario = computed(() => props.categoria?.formularios.find(x => x.id === props.formulario)?.nome)

function criar() {
  tentou.value = true
  if (!titulo.value.trim()) return
  emit('criar', {
    titulo: titulo.value.trim(),
    valor: valor.value,
    data: data.value ? new Date(`${data.value}T21:00:00.000Z`).getTime() : undefined,
    urgente: urgente.value,
  })
  aberto.value = false
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="t.criar.criarNa(categoria?.singular, categoria?.name ?? '')"
    :description="t.novoItem.descricao(categoria?.name ?? '', nomeDoFormulario)"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <form id="form-novo-item" class="space-y-4" @submit.prevent="criar">
        <UFormField :label="t.novoItem.tituloCampo" required :error="tentou && !titulo.trim() ? t.novoItem.tituloObrigatorio : undefined">
          <UInput v-model="titulo" autofocus class="w-full" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t.novoItem.valor">
            <UInputNumber
              v-model="valor"
              :min="0"
              :step="0.01"
              :locale="t.locale"
              :format-options="{ style: 'currency', currency: 'BRL' }"
              :increment="false"
              :decrement="false"
              class="w-full"
            />
          </UFormField>
          <UFormField :label="t.novoItem.prazo">
            <UInput v-model="data" type="date" class="w-full" />
          </UFormField>
        </div>
        <USwitch v-model="urgente" :label="t.novoItem.urgente" />
      </form>
    </template>
    <template #footer>
      <UButton :label="t.novaTarefa.cancelar" color="neutral" variant="outline" @click="aberto = false" />
      <UButton type="submit" form="form-novo-item" :label="t.novoItem.criar" icon="i-lucide-check" />
    </template>
  </UModal>
</template>
