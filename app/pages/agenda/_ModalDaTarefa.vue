<script setup lang="ts">
/**
 * Cumprir a tarefa sem sair da Agenda (pedido da redatora em 29/10/2026): o modal abre sobre a grade com o item, o
 * prazo, o responsável e a ação da tarefa (`_CumprirTarefa.vue`, a mesma do painel). Concluiu, o modal fecha e a grade
 * risca a tarefa. "Ir para a tarefa" continua, para quem prefere a tarefa inteira, com todas as abas.
 */
import type { Textos } from './textos'
import { diaNumerico, hora } from './datas'
import { diaDe, item, minutoDe, tarefa, temSla } from './estado'
import { pessoaPorId } from './mocks'
import CumprirTarefa from './_CumprirTarefa.vue'

const props = defineProps<{ t: Textos, locale: string, tarefaId: number | null }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ irParaTarefa: [id: number] }>()

const tf = computed(() => tarefa(props.tarefaId ?? 0) ?? null)
const it = computed(() => item(tf.value?.item))
const prazo = computed(() => tf.value?.due_date ? `${diaNumerico(diaDe(tf.value.due_date), props.locale)}, ${hora(minutoDe(tf.value.due_date))}` : props.t.situacao['sem-prazo'])
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="tf ? `${tf.reference} - ${tf.name}` : ''"
    :description="it ? `${it.reference} · ${it.titulo}` : undefined"
    :ui="{ content: 'max-w-md', footer: 'justify-end' }"
  >
    <template #body>
      <div v-if="tf" class="flex flex-col gap-4">
        <dl class="flex flex-col gap-2 text-sm">
          <div class="flex items-center gap-2">
            <dt class="text-muted">{{ t.tarefa.vencimentoEm }}:</dt>
            <dd class="flex items-center gap-1.5 text-highlighted">{{ prazo }}<UIcon v-if="temSla(tf)" name="i-lucide-lock" class="size-3.5 text-muted" /></dd>
          </div>
          <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.responsavel }}:</dt><dd class="text-highlighted">{{ pessoaPorId(tf.assigned_to)?.nome }}</dd></div>
        </dl>
        <CumprirTarefa :t="t" :tarefa-id="tf.id" class="border-t border-default pt-4" @feito="aberto = false" />
      </div>
    </template>
    <template #footer>
      <UButton v-if="tf" :label="t.detalhe.abrirTarefa" icon="i-lucide-arrow-up-right" color="neutral" variant="outline" size="sm" @click="emit('irParaTarefa', tf.id)" />
    </template>
  </UModal>
</template>
