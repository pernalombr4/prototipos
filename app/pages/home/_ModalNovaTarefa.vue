<script setup lang="ts">
/**
 * Nova tarefa rápida, sem sair da Home. Os 4 campos que importam na hora
 * (nome, data limite, responsável, prioridade) e "Mais campos" para o
 * formulário completo de Tarefas Rápidas (MAQUETE: no protótipo só avisa).
 *
 * Mesmos campos do modal "Nova tarefa" de develop, na mesma ordem.
 * Componentes: `UModal`, `UFormField`, `UInput`, `USelect` (MCP nuxt-ui).
 * Data e hora em `UInput type="datetime-local"`: o `UInputDate` pede
 * `@internationalized/date`, que este repositório não instala (mesma
 * decisão do prazo-final-nas-tarefas).
 */
import type { SelectItem } from '@nuxt/ui'
import type { TarefaDaHome } from './mocks'
import { EU, pessoas } from './mocks'
import { HOJE } from './formatar'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{
  criar: [dados: Pick<TarefaDaHome, 'name' | 'due_date' | 'assigned_to' | 'priority'>]
  maisCampos: []
}>()

/** Hoje às 18:00 de Brasília, no formato do datetime-local. */
function padrao() {
  return new Date(HOJE + 18 * 3_600_000 - 3 * 3_600_000).toISOString().slice(0, 16)
}

const nome = ref('')
const data = ref(padrao())
const responsavel = ref<number>(EU.id)
const prioridade = ref<TarefaDaHome['priority']>('normal')
const tentou = ref(false)

watch(aberto, (a) => {
  if (!a) return
  nome.value = ''
  data.value = padrao()
  responsavel.value = EU.id
  prioridade.value = 'normal'
  tentou.value = false
})

const opcoesDeResponsavel = computed<SelectItem[]>(() => pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais } })))
const opcoesDePrioridade = computed<SelectItem[]>(() => (['low', 'normal', 'high', 'urgent'] as const).map(p => ({ label: props.t.novaTarefa.prioridades[p], value: p })))

function criar() {
  tentou.value = true
  if (!nome.value.trim()) return
  // O valor do datetime-local é a hora local de Brasília: volta para UTC somando 3 h.
  const due = data.value ? new Date(`${data.value}:00.000Z`).getTime() + 3 * 3_600_000 : null
  emit('criar', { name: nome.value.trim(), due_date: due ? new Date(due) : null, assigned_to: responsavel.value, priority: prioridade.value })
  aberto.value = false
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.novaTarefa.titulo" :ui="{ footer: 'justify-between' }">
    <template #body>
      <form id="form-nova-tarefa" class="space-y-4" @submit.prevent="criar">
        <UFormField :label="t.novaTarefa.nome" required :error="tentou && !nome.trim() ? t.novaTarefa.nomePlaceholder : undefined">
          <UInput v-model="nome" :placeholder="t.novaTarefa.nomePlaceholder" autofocus class="w-full" />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t.novaTarefa.dataLimite">
            <UInput v-model="data" type="datetime-local" class="w-full" />
          </UFormField>
          <UFormField :label="t.novaTarefa.prioridade">
            <USelect v-model="prioridade" :items="opcoesDePrioridade" class="w-full" />
          </UFormField>
        </div>
        <UFormField :label="t.novaTarefa.responsavel">
          <USelect v-model="responsavel" :items="opcoesDeResponsavel" class="w-full" />
        </UFormField>
      </form>
    </template>
    <template #footer>
      <UTooltip :text="t.novaTarefa.maisCamposAviso">
        <UButton :label="t.novaTarefa.maisCampos" icon="i-lucide-square-arrow-out-up-right" color="neutral" variant="ghost" @click="emit('maisCampos')" />
      </UTooltip>
      <div class="flex gap-2">
        <UButton :label="t.novaTarefa.cancelar" color="neutral" variant="outline" @click="aberto = false" />
        <UButton type="submit" form="form-nova-tarefa" :label="t.novaTarefa.criar" icon="i-lucide-check" />
      </div>
    </template>
  </UModal>
</template>
