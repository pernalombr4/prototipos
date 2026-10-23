<script setup lang="ts">
/**
 * PROPOSTA: criar visualização em 1 passo, num popover preso ao "+".
 *
 * Hoje criar abre um modal com nome, descrição, ícone obrigatório, tipo,
 * colunas, 2 tipos de filtro, visibilidade e ordenação. Aqui ficam só as 3
 * decisões que a pessoa toma na hora (nome, tipo e de onde começar); o resto
 * vem pronto e se ajusta depois no painel Configurar, com a tabela à vista.
 *
 * "Começar com os filtros e colunas desta visualização" vem ligado: é o
 * "criar a partir da atual" do Twenty e o "Save as new view" do Linear e do
 * Attio. O ícone sai do tipo e se troca depois.
 */
import type { Textos } from './textos'
import { CAMPOS } from './mocks'

const props = defineProps<{
  t: Textos
  /** Nome da visualização ativa, para o texto da opção de herdar. */
  nomeDaAtiva: string
  /** Nomes que já existem na categoria: nome repetido não cria (Polaris recusa com mensagem). */
  nomesExistentes: string[]
}>()

const emit = defineEmits<{
  criar: [dados: { nome: string, tipo: 'table' | 'kanban', agruparPor: string, herdar: boolean, soEu: boolean }]
  cancelar: []
}>()

const nome = ref('')
const tipo = ref<'table' | 'kanban'>('table')
const agruparPor = ref('status')
const herdar = ref(true)
const quemVe = ref<'todos' | 'eu'>('todos')
const criando = ref(false)
const tentou = ref(false)

const camposDeAgrupar = computed(() => CAMPOS.filter(c => c.tipo === 'selecao').map(c => ({ label: c.label, value: c.path })))

const tipos = computed(() => [
  { value: 'table' as const, label: props.t.criar.tabela, icone: 'i-lucide-table' },
  { value: 'kanban' as const, label: props.t.criar.kanban, icone: 'i-lucide-square-kanban' },
])

const repetido = computed(() => props.nomesExistentes.some(n => n.toLowerCase() === nome.value.trim().toLowerCase()))
const erro = computed(() => {
  if (!tentou.value) return undefined
  if (!nome.value.trim()) return props.t.criar.nomeObrigatorio
  return repetido.value ? props.t.criar.nomeRepetido : undefined
})

async function enviar() {
  tentou.value = true
  if (erro.value) return
  criando.value = true
  await new Promise(r => setTimeout(r, 350))
  emit('criar', { nome: nome.value.trim(), tipo: tipo.value, agruparPor: agruparPor.value, herdar: herdar.value, soEu: quemVe.value === 'eu' })
  criando.value = false
}
</script>

<template>
  <form class="flex w-80 flex-col gap-4 p-4" @submit.prevent="enviar">
    <p class="text-sm font-semibold text-highlighted">{{ t.criar.titulo }}</p>

    <UFormField :label="t.criar.nome" :error="erro">
      <UInput v-model="nome" :placeholder="t.criar.nomeExemplo" autofocus class="w-full" />
    </UFormField>

    <UFormField :label="t.criar.tipo">
      <UFieldGroup class="w-full">
        <UButton
          v-for="o in tipos"
          :key="o.value"
          :label="o.label"
          :icon="o.icone"
          :color="tipo === o.value ? 'primary' : 'neutral'"
          :variant="tipo === o.value ? 'soft' : 'outline'"
          :aria-pressed="tipo === o.value"
          class="flex-1 justify-center"
          @click="tipo = o.value"
        />
      </UFieldGroup>
    </UFormField>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="-translate-y-1 opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <UFormField v-if="tipo === 'kanban'" :label="t.criar.agruparPor" :help="t.criar.agruparAjuda">
        <USelect v-model="agruparPor" :items="camposDeAgrupar" class="w-full" />
      </UFormField>
    </Transition>

    <USwitch
      v-model="herdar"
      :label="t.criar.herdar"
      :description="t.criar.herdarAjuda(nomeDaAtiva)"
      :ui="{ description: 'text-xs' }"
    />

    <UFormField :label="t.criar.quemVe">
      <USelect
        v-model="quemVe"
        :items="[{ label: t.criar.todos, value: 'todos', icon: 'i-lucide-users' }, { label: t.criar.soEu, value: 'eu', icon: 'i-lucide-lock' }]"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end gap-2">
      <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="emit('cancelar')" />
      <UButton type="submit" :label="t.criar.criar" :loading="criando" />
    </div>
  </form>
</template>
