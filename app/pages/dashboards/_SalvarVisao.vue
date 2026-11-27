<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): salvar a visão do dashboard (período e filtros) com um nome.
 *
 * Nasce "Só para mim". "Todo o workspace" só aparece liberado para owner e full, e pede
 * confirmação antes de valer para todos (a mesma regra de salvar menu e barra para
 * todos). O resumo do que entra na visão fica no próprio modal.
 */
import type { Visao } from './dashboards'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** O que a visão vai guardar, já em frase: "Este ano", "Contratos · Status: Assinado". */
  resumo: string[]
  podeSalvarParaTodos: boolean
  nomesUsados: string[]
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ salvar: [nome: string, escopo: Visao['escopo']] }>()

const nome = ref('')
const escopo = ref<Visao['escopo']>('eu')
const confirmando = ref(false)
const tentou = ref(false)
const salvando = ref(false)

watch(aberto, (a) => {
  if (!a) return
  nome.value = ''
  escopo.value = 'eu'
  confirmando.value = false
  tentou.value = false
  salvando.value = false
})

const erro = computed(() => {
  if (!tentou.value) return undefined
  if (!nome.value.trim()) return props.t.visoes.nomeErro
  if (props.nomesUsados.includes(nome.value.trim())) return props.t.visoes.nomeRepetido
  return undefined
})

const opcoes = computed(() => [
  { label: props.t.visoes.soParaMim, value: 'eu', description: props.t.visoes.soParaMimAjuda },
  {
    label: props.t.visoes.paraTodos,
    value: 'workspace',
    description: props.podeSalvarParaTodos ? props.t.visoes.paraTodosAjuda : props.t.visoes.paraTodosBloqueado,
    disabled: !props.podeSalvarParaTodos,
  },
])

function salvar() {
  tentou.value = true
  if (erro.value) return
  if (escopo.value === 'workspace' && !confirmando.value) {
    confirmando.value = true
    return
  }
  salvando.value = true
  setTimeout(() => {
    emit('salvar', nome.value.trim(), escopo.value)
    aberto.value = false
  }, 350)
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="confirmando ? t.visoes.confirmarTitulo : t.visoes.salvarTitulo"
    :description="confirmando ? t.visoes.confirmarDescricao(nome.trim()) : t.visoes.salvarDescricao"
    :close="{ 'aria-label': t.visoes.cancelar }"
  >
    <template #body>
      <form v-if="!confirmando" class="space-y-4" @submit.prevent="salvar">
        <UFormField :label="t.visoes.nome" required :error="erro">
          <UInput v-model="nome" autofocus :placeholder="t.visoes.nomePlaceholder" class="w-full" />
        </UFormField>
        <UFormField :label="t.visoes.paraQuem">
          <URadioGroup v-model="escopo" :items="opcoes" value-key="value" />
        </UFormField>
        <div class="rounded-lg bg-elevated/60 p-3">
          <p class="mb-1.5 text-xs font-medium text-muted">{{ t.visoes.oQueEntra }}</p>
          <ul class="space-y-1 text-sm text-toned">
            <li v-for="(r, i) in resumo" :key="i" class="flex items-start gap-1.5">
              <UIcon :name="i === 0 ? 'i-lucide-calendar' : 'i-lucide-filter'" class="mt-0.5 size-3.5 shrink-0 text-muted" />
              <span>{{ r }}</span>
            </li>
          </ul>
        </div>
      </form>
      <UAlert
        v-else
        icon="i-lucide-users"
        color="warning"
        variant="subtle"
        :title="t.visoes.confirmarAviso"
      />
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          :label="confirmando ? t.visoes.voltar : t.visoes.cancelar"
          color="neutral"
          variant="ghost"
          @click="confirmando ? (confirmando = false) : (aberto = false)"
        />
        <UButton
          :label="confirmando ? t.visoes.confirmar : t.visoes.salvarBotao"
          :icon="escopo === 'workspace' ? 'i-lucide-users' : 'i-lucide-bookmark-plus'"
          :loading="salvando"
          @click="salvar"
        />
      </div>
    </template>
  </UModal>
</template>
