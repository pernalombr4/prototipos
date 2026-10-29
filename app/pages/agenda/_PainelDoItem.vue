<script setup lang="ts">
/**
 * Painel lateral do item, aberto sobre a própria Agenda (decisão 3 da redatora: uma porta). Abas Item e Tarefas são
 * o recorte da visualização rápida do item; a aba Agenda é a proposta (`_AgendaDoItem.vue`, a mesma da pasta Agenda
 * na tela do item). "Acessar Item" leva à tela do item, como o botão do painel da tarefa no develop.
 */
import type { Textos } from './textos'
import { diaCurto, diaNumerico, hora } from './datas'
import { diaDe, estado, item, minutoDe, reunioesDo, situacao } from './estado'
import { categoriaPorSlug, pessoaPorId } from './mocks'
import AgendaDoItem from './_AgendaDoItem.vue'

const props = defineProps<{ t: Textos, locale: string, itemId: number | null, conectando?: boolean }>()
const aba = defineModel<'item' | 'tarefas' | 'agenda'>('aba', { default: 'agenda' })
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ agendar: [id: number], abrirEvento: [chave: string], abrirTarefa: [id: number], acessar: [id: number], irParaDia: [dia: string], conectar: [] }>()

const it = computed(() => item(props.itemId))
const cat = computed(() => it.value ? categoriaPorSlug(it.value.categoria) : null)
const tarefas = computed(() => it.value ? estado.tarefas.filter(t => t.item === it.value!.id) : [])
const reunioes = computed(() => it.value ? reunioesDo(it.value.id) : [])

const abas = computed(() => [
  { label: props.t.painel.abas.item, value: 'item', icon: 'i-lucide-file-text' },
  { label: props.t.painel.abas.tarefas, value: 'tarefas', icon: 'i-lucide-list-checks', badge: tarefas.value.length || undefined },
  { label: props.t.painel.abas.agenda, value: 'agenda', icon: 'i-lucide-calendar-days', badge: reunioes.value.length || undefined },
])

const valor = (chave: string, tipo: string) => {
  const v = it.value!.data[chave]
  if (v === undefined || v === '') return '--'
  if (tipo === 'data') return diaNumerico(String(v), props.locale)
  if (tipo === 'hora') return hora(Number(v))
  return String(v)
}
const corDaSituacao = { 'concluida': 'success', 'atrasada': 'error', 'hoje': 'warning', 'no-prazo': 'neutral', 'sem-prazo': 'neutral' } as const
</script>

<template>
  <USlideover v-model:open="aberto" :title="it ? `${it.reference} · ${it.titulo}` : ''" :description="cat?.name" :ui="{ content: 'max-w-md' }">
    <template #body>
      <div v-if="it" class="flex flex-col gap-4">
        <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" class="w-full" />

        <!-- Item -->
        <template v-if="aba === 'item'">
          <dl class="grid grid-cols-[9rem_1fr] gap-x-3 gap-y-2.5 text-sm">
            <template v-for="c in cat!.campos" :key="c.chave">
              <dt class="text-muted">{{ c.rotulo }}</dt>
              <dd class="break-words text-highlighted">{{ valor(c.chave, c.tipo) }}</dd>
            </template>
            <dt class="text-muted">{{ t.painel.responsavel }}</dt>
            <dd class="flex items-center gap-1.5 text-highlighted"><UAvatar :text="pessoaPorId(it.responsavel)?.iniciais" size="3xs" />{{ pessoaPorId(it.responsavel)?.nome }}</dd>
          </dl>
          <UButton :label="t.tarefa.acessarItem" icon="i-lucide-arrow-up-right" color="neutral" variant="outline" size="sm" class="self-start" @click="emit('acessar', it.id)" />
        </template>

        <!-- Tarefas -->
        <ul v-else-if="aba === 'tarefas'" class="flex flex-col divide-y divide-default">
          <li v-for="x in tarefas" :key="x.id">
            <button type="button" class="flex w-full items-center gap-2 rounded-md px-1 py-2.5 text-left transition-colors hover:bg-elevated" @click="emit('abrirTarefa', x.id)">
              <UIcon :name="x.origem === 'fluxo' ? 'i-lucide-flag' : 'i-lucide-clipboard-check'" class="size-4 shrink-0" :class="x.origem === 'fluxo' ? 'text-primary' : 'text-muted'" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm text-highlighted" :class="x.status === 'completed' && 'line-through'">{{ x.name }}</span>
                <span v-if="x.due_date" class="block text-xs text-muted first-letter:uppercase">{{ t.quando(diaCurto(diaDe(x.due_date), locale), hora(minutoDe(x.due_date))) }}</span>
              </span>
              <UBadge :label="t.situacao[situacao(x)]" :color="corDaSituacao[situacao(x)]" variant="soft" size="sm" />
            </button>
          </li>
          <li v-if="!tarefas.length" class="py-6 text-center text-sm text-muted">{{ t.painel.semTarefas }}</li>
        </ul>

        <!-- Agenda (proposta) -->
        <AgendaDoItem
          v-else
          :t="t"
          :locale="locale"
          :item-id="it.id"
          :conectando="conectando"
          na-agenda
          @abrir-evento="emit('abrirEvento', $event)"
          @abrir-tarefa="emit('abrirTarefa', $event)"
          @ir-para-dia="emit('irParaDia', $event)"
          @conectar="emit('conectar')"
          @agendar-na-grade="emit('agendar', $event)"
        />
      </div>
    </template>
  </USlideover>
</template>
