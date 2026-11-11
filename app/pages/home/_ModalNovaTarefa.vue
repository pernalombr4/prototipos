<script setup lang="ts">
/**
 * Nova tarefa, sem sair da Home. Um modal para os 2 tipos, aberto pelo
 * "Criar ▸ Tarefa ▸ rápida | agendada".
 *
 * Rápida: os campos do modal "Nova tarefa" de develop, com os rótulos de lá
 * (`models.tasks.attributes.*`): Nome, Data limite, Prioridade, Responsável,
 * Colaboradores e Descrição (`taskFormFromModel.ts`). O status nasce
 * "pendente", como no produto.
 *
 * Agendada (NOVO): hoje a tarefa agendada só nasce do fluxo da categoria; a
 * leitura do código não achou criação manual (DECISOES.md, rodada 2). Aqui ela
 * pede, além dos mesmos campos, o "Item relacionado", obrigatório: a tarefa
 * agendada mora num item. Hipótese para o dev confirmar.
 *
 * Componentes: `UModal`, `UFormField`, `UInput`, `UTextarea`, `USelect`,
 * `USelectMenu` (MCP nuxt-ui). Data e hora em `UInput type="datetime-local"`:
 * o `UInputDate` pede `@internationalized/date`, que o repositório não instala.
 */
import type { SelectItem, SelectMenuItem } from '@nuxt/ui'
import type { Item, TarefaDaHome } from './mocks'
import { EU, categoria, pessoas } from './mocks'
import { HOJE } from './formatar'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tipo: 'rapida' | 'agendada'
  /** Itens em aberto, para o "Item relacionado". */
  itens: Item[]
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{
  criar: [dados: Pick<TarefaDaHome, 'name' | 'due_date' | 'assigned_to' | 'priority' | 'origem' | 'item'>]
}>()

/** Hoje às 18:00 de Brasília, no formato do datetime-local. */
function padrao() {
  return new Date(HOJE + 18 * 3_600_000 - 3 * 3_600_000).toISOString().slice(0, 16)
}

const nome = ref('')
const item = ref<number | undefined>()
const data = ref(padrao())
const prioridade = ref<TarefaDaHome['priority']>('normal')
const responsavel = ref<number>(EU.id)
const colaboradores = ref<number[]>([])
const descricao = ref('')
const tentou = ref(false)

watch(aberto, (a) => {
  if (!a) return
  nome.value = ''
  item.value = undefined
  data.value = padrao()
  prioridade.value = 'normal'
  responsavel.value = EU.id
  colaboradores.value = []
  descricao.value = ''
  tentou.value = false
})

const agendada = computed(() => props.tipo === 'agendada')
const erroNome = computed(() => tentou.value && !nome.value.trim() ? props.t.novaTarefa.nomeObrigatorio : undefined)
const erroItem = computed(() => tentou.value && agendada.value && !item.value ? props.t.novaTarefa.itemObrigatorio : undefined)

const opcoesDePessoa = computed<SelectItem[]>(() => pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais } })))
const opcoesDeColaborador = computed<SelectMenuItem[]>(() => pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais } })))
const opcoesDePrioridade = computed<SelectItem[]>(() => (['low', 'normal', 'high', 'urgent'] as const).map(p => ({ label: props.t.novaTarefa.prioridades[p], value: p })))
const opcoesDeItem = computed<SelectMenuItem[]>(() => props.itens.map(i => ({
  label: i.titulo,
  description: `${i.reference} · ${categoria(i.categoria)?.name ?? ''}`,
  value: i.id,
  icon: categoria(i.categoria)?.icon,
})))

function criar() {
  tentou.value = true
  if (erroNome.value || erroItem.value) return
  // O valor do datetime-local é a hora de Brasília: volta para UTC somando 3 h.
  const due = data.value ? new Date(`${data.value}:00.000Z`).getTime() + 3 * 3_600_000 : null
  const i = props.itens.find(x => x.id === item.value)
  emit('criar', {
    name: nome.value.trim(),
    due_date: due ? new Date(due) : null,
    assigned_to: responsavel.value,
    priority: prioridade.value,
    origem: props.tipo,
    item: i ? { reference: i.reference, categoria: i.categoria } : undefined,
  })
  aberto.value = false
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="agendada ? t.novaTarefa.tituloAgendada : t.novaTarefa.tituloRapida"
    :description="agendada ? t.novaTarefa.descricaoAgendada : t.novaTarefa.descricaoRapida"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <form id="form-nova-tarefa" class="space-y-4" @submit.prevent="criar">
        <UFormField :label="t.novaTarefa.nome" required :error="erroNome">
          <UInput v-model="nome" :placeholder="t.novaTarefa.nomePlaceholder" autofocus class="w-full" />
        </UFormField>
        <UFormField v-if="agendada" :label="t.novaTarefa.item" required :error="erroItem">
          <USelectMenu
            v-model="item"
            :items="opcoesDeItem"
            value-key="value"
            :filter-fields="['label', 'description']"
            :placeholder="t.novaTarefa.itemPlaceholder"
            :search-input="{ placeholder: t.novaTarefa.itemPlaceholder }"
            class="w-full"
          />
        </UFormField>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t.novaTarefa.dataLimite">
            <UInput v-model="data" type="datetime-local" class="w-full" />
          </UFormField>
          <UFormField :label="t.novaTarefa.prioridade">
            <USelect v-model="prioridade" :items="opcoesDePrioridade" class="w-full" />
          </UFormField>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t.novaTarefa.responsavel">
            <USelect v-model="responsavel" :items="opcoesDePessoa" class="w-full" />
          </UFormField>
          <UFormField :label="t.novaTarefa.colaboradores">
            <USelectMenu
              v-model="colaboradores"
              :items="opcoesDeColaborador"
              value-key="value"
              multiple
              :placeholder="t.novaTarefa.colaboradoresPlaceholder"
              class="w-full"
            />
          </UFormField>
        </div>
        <UFormField :label="t.novaTarefa.descricao">
          <UTextarea v-model="descricao" :rows="2" autoresize class="w-full" />
        </UFormField>
      </form>
    </template>
    <template #footer>
      <UButton :label="t.novaTarefa.cancelar" color="neutral" variant="outline" @click="aberto = false" />
      <UButton type="submit" form="form-nova-tarefa" :label="t.novaTarefa.criar" icon="i-lucide-check" />
    </template>
  </UModal>
</template>
