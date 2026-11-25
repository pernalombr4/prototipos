<script setup lang="ts">
/**
 * O modal "Nova pasta" com o tipo Formulário.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Copiado do develop (botão de pasta à direita das
 * abas do item, teste-ux, 25/11/2026): Nome da Pasta, Tipo de Pasta,
 * Formulário, Habilitar Edição, Ícone e Grupos Permitidos. A pasta do tipo
 * Formulário já existe hoje; as Opções 1 e 2 se apoiam nela para o recorte.
 * Ícone e Grupos aparecem como no develop e não fazem nada no protótipo.
 */
import type { Textos } from './textos'
import { formularios } from './mocks'

defineProps<{ t: Textos }>()
const aberto = defineModel<boolean>('aberto', { default: false })
const emit = defineEmits<{ criar: [pasta: { nome: string, formulario: number, edicao: boolean }] }>()

const nome = ref('')
const formulario = ref<number | undefined>()
const edicao = ref(false)
const tentou = ref(false)
const criando = ref(false)

watch(aberto, (v) => {
  if (v) { nome.value = ''; formulario.value = undefined; edicao.value = false; tentou.value = false }
})

const opcoes = computed(() => formularios.map(f => ({ label: f.nome, value: f.id })))

async function criar() {
  tentou.value = true
  if (!nome.value.trim() || !formulario.value) return
  criando.value = true
  await new Promise(r => setTimeout(r, 400))
  emit('criar', { nome: nome.value.trim(), formulario: formulario.value, edicao: edicao.value })
  criando.value = false
  aberto.value = false
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.modal.titulo" :ui="{ content: 'max-w-lg' }">
    <template #body>
      <form id="form-nova-pasta" class="grid grid-cols-2 gap-x-4 gap-y-5" @submit.prevent="criar">
        <UFormField :label="t.modal.nome" required :error="tentou && !nome.trim() ? t.modal.obrigatorio : undefined">
          <UInput v-model="nome" class="w-full" autofocus />
        </UFormField>
        <UFormField :label="t.modal.tipo">
          <USelect :model-value="'formulario'" :items="[{ label: t.modal.tipoFormulario, value: 'formulario' }]" class="w-full" />
        </UFormField>
        <UFormField :label="t.modal.formulario" required class="col-span-2" :error="tentou && !formulario ? t.modal.obrigatorio : undefined">
          <USelect v-model="formulario" :items="opcoes" :placeholder="t.modal.selecione" class="w-full" />
        </UFormField>
        <UFormField :label="t.modal.habilitarEdicao" class="col-span-2">
          <USwitch v-model="edicao" />
        </UFormField>
        <UFormField :label="t.modal.icone" required>
          <USelect :model-value="'nenhum'" :items="[{ label: t.modal.semIcone, value: 'nenhum' }]" class="w-full" />
        </UFormField>
        <UFormField :label="t.modal.grupos">
          <USelect :items="[]" :placeholder="t.modal.selecione" class="w-full" />
        </UFormField>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.modal.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="t.modal.criar" type="submit" form="form-nova-pasta" :loading="criando" />
      </div>
    </template>
  </UModal>
</template>
