<script setup lang="ts">
/**
 * A ação da tarefa, a mesma no painel da tarefa e no modal que abre na Agenda: só o responsável conclui; a tarefa de
 * aprovação tem Aprovar e Reprovar; a de formulário pede o campo antes do "Concluir Etapa"; a concluída reabre.
 */
import type { Textos } from './textos'
import { concluir, ehMinha, tarefa } from './estado'
import { pessoaPorId } from './mocks'

const props = defineProps<{ t: Textos, tarefaId: number }>()
const emit = defineEmits<{ feito: [] }>()
const toast = useToast()

const tf = computed(() => tarefa(props.tarefaId) ?? null)
const feita = computed(() => tf.value?.status === 'completed')
const protocolo = ref('')
watch(() => props.tarefaId, () => (protocolo.value = ''))

function alternar(aviso?: string) {
  if (!tf.value) return
  concluir(tf.value)
  toast.add({ title: aviso ?? (feita.value ? props.t.avisos.concluida : props.t.avisos.reaberta), icon: 'i-lucide-circle-check', color: 'success' })
  emit('feito')
}
</script>

<template>
  <div v-if="tf" class="flex flex-col gap-2">
    <p v-if="!ehMinha(tf)" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
      <UIcon name="i-lucide-user-round" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.regras.tarefaDeOutro(pessoaPorId(tf.assigned_to)?.nome ?? '--') }}
    </p>
    <span v-else-if="tf.acao === 'aprovar' && !feita" class="grid grid-cols-2 gap-2">
      <UButton :label="t.tarefa.aprovar" icon="i-lucide-check" color="success" block @click="alternar(t.tarefa.aprovada)" />
      <UButton :label="t.tarefa.reprovar" icon="i-lucide-x" color="error" variant="outline" block @click="alternar(t.tarefa.reprovada)" />
    </span>
    <form v-else-if="tf.acao === 'formulario' && !feita" class="flex flex-col gap-2" @submit.prevent="protocolo.trim() && alternar()">
      <UFormField :label="t.tarefa.protocolo" :help="t.tarefa.protocoloAjuda" required size="sm">
        <UInput v-model="protocolo" size="sm" class="w-full" autofocus />
      </UFormField>
      <UButton type="submit" :label="t.tarefa.concluirEtapa" block :disabled="!protocolo.trim()" />
    </form>
    <UButton v-else-if="feita" :label="t.detalhe.reabrir" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" block @click="alternar()" />
    <UButton v-else :label="t.tarefa.concluirEtapa" block @click="alternar()" />
  </div>
</template>
