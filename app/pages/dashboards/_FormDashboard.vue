<script setup lang="ts">
/**
 * Criar e editar o dashboard: nome, descrição (opcional), quem vê e recarga.
 *
 * Hoje o "Editar Dashboard" pede descrição obrigatória e não edita o layout (o
 * layout se mexe em Personalizar). Os nomes dos grupos são fictícios.
 */
import type { Dashboard } from './dashboards'
import { GRUPOS_DO_WORKSPACE } from './dashboards'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** O dashboard em edição; sem ele, é dashboard novo. */
  dashboard?: Dashboard
}>()

const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ salvar: [dados: Pick<Dashboard, 'nome' | 'descricao' | 'grupos' | 'recarga'>] }>()

const nome = ref('')
const descricao = ref('')
const grupos = ref<string[]>([])
const recarga = ref(5)
const tentou = ref(false)
const salvando = ref(false)

watch(aberto, (a) => {
  if (!a) return
  nome.value = props.dashboard?.nome ?? ''
  descricao.value = props.dashboard?.descricao ?? ''
  grupos.value = [...(props.dashboard?.grupos ?? [])]
  recarga.value = props.dashboard?.recarga ?? 5
  tentou.value = false
  salvando.value = false
})

const recargas = computed(() => [1, 5, 15, 30, 60].map(n => ({ label: props.t.formDashboard.recargas(n), value: n })).concat([{ label: props.t.formDashboard.semRecarga, value: 0 }]))

function salvar() {
  tentou.value = true
  if (!nome.value.trim()) return
  salvando.value = true
  setTimeout(() => {
    emit('salvar', { nome: nome.value.trim(), descricao: descricao.value.trim() || undefined, grupos: grupos.value, recarga: recarga.value })
    aberto.value = false
  }, 400)
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="dashboard ? t.formDashboard.tituloEditar : t.formDashboard.tituloNovo"
    :close="{ 'aria-label': t.formDashboard.cancelar }"
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="salvar">
        <UFormField :label="t.formDashboard.nome" required :error="tentou && !nome.trim() ? t.formDashboard.nomeErro : undefined">
          <UInput v-model="nome" autofocus class="w-full" />
        </UFormField>
        <UFormField :label="t.formDashboard.descricao">
          <UTextarea v-model="descricao" :rows="2" autoresize class="w-full" />
        </UFormField>
        <UFormField :label="t.formDashboard.quemVe" :help="t.formDashboard.quemVeAjuda">
          <USelectMenu
            v-model="grupos"
            :items="GRUPOS_DO_WORKSPACE"
            multiple
            :placeholder="t.formDashboard.todosMembros"
            icon="i-lucide-users"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="t.formDashboard.recarga">
          <USelect v-model="recarga" :items="recargas" value-key="value" icon="i-lucide-refresh-cw" class="w-full sm:w-60" />
        </UFormField>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.formDashboard.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="dashboard ? t.formDashboard.salvar : t.formDashboard.criar" :loading="salvando" @click="salvar" />
      </div>
    </template>
  </UModal>
</template>
