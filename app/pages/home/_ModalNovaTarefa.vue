<script setup lang="ts">
/**
 * Nova tarefa rápida, sem sair da Home, aberta pelo "Criar ▸ Tarefa".
 *
 * Os campos são os do modal "Nova tarefa" de develop, com os rótulos de lá
 * (`models.tasks.attributes.*`): Nome, Data limite, Prioridade, Responsável,
 * Colaboradores e Descrição (`taskFormFromModel.ts`). O status nasce
 * "pendente", como no produto.
 *
 * Rodada 6, a pedido da redatora ("criar tarefa só pode ser tarefa rápida"):
 * sai a tarefa agendada, e com ela o "Item relacionado". A tarefa agendada
 * continua nascendo só do fluxo da categoria.
 *
 * `inicial` (rodada 6): o rascunho que o BENI montou, quando a pessoa escolhe
 * "Revisar no formulário" na conversa.
 *
 * Componentes: `UModal`, `UFormField`, `UInput`, `UTextarea`, `USelect`,
 * `USelectMenu` (MCP nuxt-ui). Data e hora em `UInput type="datetime-local"`:
 * o `UInputDate` pede `@internationalized/date`, que o repositório não instala.
 */
import type { SelectItem, SelectMenuItem } from '@nuxt/ui'
import type { TarefaDaHome } from './mocks'
import { EU, pessoas } from './mocks'
import { HOJE } from './formatar'
import type { Textos } from './textos'

export type DadosDaTarefa = Pick<TarefaDaHome, 'name' | 'due_date' | 'assigned_to' | 'priority' | 'origem' | 'item'>

const props = defineProps<{
  t: Textos
  /** Rascunho do BENI, quando vem da conversa. */
  inicial?: Partial<DadosDaTarefa>
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ criar: [dados: DadosDaTarefa] }>()

/** Data em UTC para o formato do datetime-local, na hora de Brasília. */
function paraCampo(d: Date) {
  return new Date(d.getTime() - 3 * 3_600_000).toISOString().slice(0, 16)
}
/** Hoje às 18:00 de Brasília. */
const padrao = () => paraCampo(new Date(HOJE + 18 * 3_600_000))

const nome = ref('')
const data = ref(padrao())
const prioridade = ref<TarefaDaHome['priority']>('normal')
const responsavel = ref<number>(EU.id)
const colaboradores = ref<number[]>([])
const descricao = ref('')
const tentou = ref(false)

watch(aberto, (a) => {
  if (!a) return
  const i = props.inicial
  nome.value = i?.name ?? ''
  data.value = i?.due_date ? paraCampo(i.due_date) : i?.due_date === null ? '' : padrao()
  prioridade.value = i?.priority ?? 'normal'
  responsavel.value = i?.assigned_to ?? EU.id
  colaboradores.value = []
  descricao.value = ''
  tentou.value = false
})

const erroNome = computed(() => tentou.value && !nome.value.trim() ? props.t.novaTarefa.nomeObrigatorio : undefined)

const opcoesDePessoa = computed<SelectItem[]>(() => pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais } })))
const opcoesDeColaborador = computed<SelectMenuItem[]>(() => pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais } })))
const opcoesDePrioridade = computed<SelectItem[]>(() => (['low', 'normal', 'high', 'urgent'] as const).map(p => ({ label: props.t.novaTarefa.prioridades[p], value: p })))

function criar() {
  tentou.value = true
  if (erroNome.value) return
  // O valor do datetime-local é a hora de Brasília: volta para UTC somando 3 h.
  const due = data.value ? new Date(`${data.value}:00.000Z`).getTime() + 3 * 3_600_000 : null
  emit('criar', {
    name: nome.value.trim(),
    due_date: due ? new Date(due) : null,
    assigned_to: responsavel.value,
    priority: prioridade.value,
    origem: 'rapida',
  })
  aberto.value = false
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="t.novaTarefa.tituloRapida"
    :description="t.novaTarefa.descricaoRapida"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <form id="form-nova-tarefa" class="space-y-4" @submit.prevent="criar">
        <UFormField :label="t.novaTarefa.nome" required :error="erroNome">
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
