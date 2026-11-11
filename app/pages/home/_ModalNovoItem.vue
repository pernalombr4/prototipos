<script setup lang="ts">
/**
 * Criar item, aberto do botão Criar ou do "+" do widget Categorias. No
 * produto é o modal de criação da categoria (`EntityItemsFormsUpsert.vue`),
 * com os campos do formulário escolhido; aqui são 5 campos comuns, o bastante
 * para o item nascer e aparecer no widget da visualização.
 *
 * Título "Criar <singular>" pelo `singular_name` da categoria ("Criar
 * chamado"); sem singular, "Criar item em <categoria>". A descrição diz de
 * qual formulário vêm os campos, ou "Todos os campos da categoria" quando ela
 * não tem formulário. Hoje o modal de develop diz "Novo registro" e o seletor
 * diz "Formulario", sem acento (DECISOES.md, rodada 2).
 *
 * Componentes: `UModal`, `UFormField`, `UInput`, `UInputNumber`, `USelect`,
 * `USwitch` (MCP nuxt-ui).
 */
import type { SelectItem } from '@nuxt/ui'
import type { Categoria } from './mocks'
import { EU, pessoas } from './mocks'
import type { Textos } from './textos'

export interface DadosDoItem {
  titulo: string
  valor?: number
  prazo?: number
  urgente: boolean
  responsavel: number
}

const props = defineProps<{
  t: Textos
  categoria?: Categoria
  /** Formulário escolhido; sem ele, todos os campos da categoria. */
  formulario?: string
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ criar: [dados: DadosDoItem] }>()

const titulo = ref('')
const valor = ref<number | undefined>()
const prazo = ref('')
const urgente = ref(false)
const responsavel = ref<number>(EU.id)
const tentou = ref(false)

watch(aberto, (a) => {
  if (!a) return
  titulo.value = ''
  valor.value = undefined
  prazo.value = ''
  urgente.value = false
  responsavel.value = EU.id
  tentou.value = false
})

const nomeDoFormulario = computed(() => props.categoria?.formularios.find(x => x.id === props.formulario)?.nome)

const opcoesDeResponsavel = computed<SelectItem[]>(() => pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais } })))

function criar() {
  tentou.value = true
  if (!titulo.value.trim()) return
  emit('criar', {
    titulo: titulo.value.trim(),
    valor: valor.value,
    prazo: prazo.value ? new Date(`${prazo.value}T21:00:00.000Z`).getTime() : undefined,
    urgente: urgente.value,
    responsavel: responsavel.value,
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
            <UInput v-model="prazo" type="date" class="w-full" />
          </UFormField>
        </div>
        <UFormField :label="t.novoItem.responsavel">
          <USelect v-model="responsavel" :items="opcoesDeResponsavel" class="w-full" />
        </UFormField>
        <USwitch v-model="urgente" :label="t.novoItem.urgente" />
      </form>
    </template>
    <template #footer>
      <UButton :label="t.novaTarefa.cancelar" color="neutral" variant="outline" @click="aberto = false" />
      <UButton type="submit" form="form-novo-item" :label="t.novoItem.criar" icon="i-lucide-check" />
    </template>
  </UModal>
</template>
