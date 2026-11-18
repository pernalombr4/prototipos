<script setup lang="ts">
/**
 * PROPOSTA (M28): a nova credencial pede o ambiente, sem valor pronto. Hoje o campo já vem em Sandbox, e a credencial de
 * produção nasce como teste quando a pessoa não repara.
 */
import type { Credencial, ProvedorId } from './mocks'
import { provedorPorId } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, provedor: ProvedorId }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ salvar: [Omit<Credencial, 'id' | 'criadaEm'>] }>()

const n = computed(() => props.t.provedor.nova)
const p = computed(() => provedorPorId.get(props.provedor)!)

const nome = ref('')
const ambiente = ref<Credencial['ambiente'] | undefined>()
const chave = ref('')
const tentou = ref(false)
const salvando = ref(false)

watch(aberto, (v) => { if (v) { nome.value = ''; ambiente.value = undefined; chave.value = ''; tentou.value = false } })

const ambientes = computed(() => p.value.ambientes.map(a => ({ value: a, label: props.t.ambientes[a] })))

async function salvar() {
  tentou.value = true
  if (!nome.value.trim() || !ambiente.value || !chave.value.trim()) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  emit('salvar', { provedor: props.provedor, nome: nome.value.trim(), ambiente: ambiente.value, cofre: props.provedor === 'd4sign' ? null : undefined })
  aberto.value = false
}
</script>

<template>
  <UModal v-model:open="aberto" :title="n.titulo(p.nome)">
    <template #body>
      <form id="form-nova-credencial" class="space-y-4" @submit.prevent="salvar">
        <UFormField :label="n.nome" required :error="tentou && !nome.trim() ? true : undefined">
          <UInput v-model="nome" :placeholder="n.nomePh" class="w-full" autofocus />
        </UFormField>
        <UFormField :label="n.ambiente" :help="n.ambienteAjuda" required :error="tentou && !ambiente ? true : undefined">
          <USelect v-model="ambiente" :items="ambientes" value-key="value" :placeholder="n.ambientePh" class="w-full" />
        </UFormField>
        <UFormField :label="t.provedor.tiposDeCredencial[p.tipoDeCredencial]" :help="n.chaveAjuda" required :error="tentou && !chave.trim() ? true : undefined">
          <UInput v-model="chave" type="password" class="w-full" autocomplete="off" />
        </UFormField>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.geral.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="n.salvar" type="submit" form="form-nova-credencial" :loading="salvando" />
      </div>
    </template>
  </UModal>
</template>
