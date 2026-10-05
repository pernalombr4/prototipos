<script setup lang="ts">
/**
 * Requisições (tela nativa `/request`). Cópia do develop: o seletor
 * "Formulários" no topo e o formulário com Salvar embaixo.
 *
 * PROPOSTA: com formulário público, o cartão "Compartilhar este formulário"
 * entre o seletor e o formulário (imagem 1 do documento).
 */
import type { Textos } from './textos'
import { TIPOS_COM_LINK, categoriaPorSlug } from './mocks'
import { useComunicacao, useMarcaDeProposta } from './estado'
import CompartilharFormulario from './_CompartilharFormulario.vue'

defineProps<{ t: Textos }>()

const { formularios, config } = useComunicacao()
const marca = useMarcaDeProposta()

const escolhido = useState<string | undefined>('cnw-form-escolhido', () => 'f-solicitacao-juridica')
const formulario = computed(() => formularios.value.find(f => f.id === escolhido.value) ?? null)
const opcoes = computed(() => formularios.value.map(f => ({
  value: f.id,
  label: f.nome,
  description: categoriaPorSlug(f.categoria).name,
  icon: f.visibilidade === 'publico' ? 'i-lucide-globe' : 'i-lucide-lock',
})))

const mostrarLink = computed(() => !!formulario.value && formulario.value.visibilidade === 'publico' && TIPOS_COM_LINK.includes(formulario.value.tipo) && config.value.atalhos && config.value.lugares.formularios)
const enviando = ref(false)
async function salvar() {
  enviando.value = true
  await new Promise(r => setTimeout(r, 700))
  enviando.value = false
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
    <UCard :ui="{ body: 'sm:p-4' }">
      <UFormField :label="t.form.formularios">
        <USelectMenu
          v-model="escolhido"
          :items="opcoes"
          value-key="value"
          :placeholder="t.form.selecioneUm"
          class="w-full"
        />
      </UFormField>
    </UCard>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-1 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <CompartilharFormulario v-if="mostrarLink && formulario" :key="formulario.id" :t="t" :formulario="formulario" />
      <p v-else-if="formulario?.visibilidade === 'privado'" :key="`p-${formulario.id}`" class="flex items-center gap-1.5 px-1 text-xs text-muted" :class="marca">
        <UIcon name="i-lucide-lock" class="size-3.5" />{{ t.form.privadoDica }}
      </p>
    </Transition>

    <UCard v-if="formulario" :key="formulario.id" class="animate-[entrada_.25s_ease-out]">
      <div class="flex flex-col gap-4">
        <UFormField v-for="c in formulario.campos" :key="c.rotulo" :label="c.rotulo">
          <UTextarea v-if="c.tipo === 'longo'" :placeholder="t.form.porFavorDigite" class="w-full" :rows="3" />
          <UInput v-else :type="c.tipo === 'email' ? 'email' : c.tipo === 'telefone' ? 'tel' : 'text'" :placeholder="t.form.porFavorDigite" class="w-full" />
        </UFormField>
        <UButton :label="t.form.salvar" color="success" block :loading="enviando" @click="salvar" />
      </div>
    </UCard>
  </div>
</template>
