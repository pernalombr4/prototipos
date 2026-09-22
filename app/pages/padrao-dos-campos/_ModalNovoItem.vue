<script setup lang="ts">
/**
 * O modal de criação da tela nova: o formato FORMULÁRIO.
 *
 * A casca do modal é cópia do develop (título "Novo registro", X no canto,
 * rodapé com Cancelar e Criar). O que a proposta muda é o miolo:
 *
 * - grade de duas colunas, e o tipo que precisa de linha inteira toma as duas.
 *   Hoje a tela empilha tudo em uma coluna só, e um formulário com trinta
 *   campos vira uma rolagem de três telas;
 * - cada campo tem rótulo clicável que abre a ficha, e texto de ajuda embaixo.
 *   O padrão veio do próprio produto: o formulário de criação de Campo, em
 *   Configurações, já faz isso (fricção N8 do enspace-ux-research);
 * - Esc fecha. Hoje não fecha, e está registrado como achado no BRIEFING.md.
 *
 * Interação de verdade: digitar, escolher e marcar mexem no objeto em memória,
 * e Criar acrescenta o item na tabela. Recarregar a página zera tudo.
 */
import type { Campo } from './campos'
import type { Textos } from './textos'
import EntradaDoCampo from './_EntradaDoCampo.vue'

const props = defineProps<{
  aberto: boolean
  campos: Campo[]
  t: Textos
  idioma: string
}>()

const emit = defineEmits<{
  'update:aberto': [boolean]
  'criar': [dados: Record<string, unknown>]
  'inspecionar': [tipo: string]
}>()

const aberto = computed({
  get: () => props.aberto,
  set: v => emit('update:aberto', v),
})

/** O rascunho do item, em memória. */
const rascunho = ref<Record<string, unknown>>({})
const salvando = ref(false)

watch(aberto, (v) => {
  if (v) rascunho.value = {}
})

async function criar() {
  salvando.value = true
  /* O tempo existe para o estado de carregamento do botão ser visível.
     Não há rede por trás: o item entra no array em memória. */
  await new Promise(r => setTimeout(r, 650))
  salvando.value = false
  emit('criar', { ...rascunho.value })
  aberto.value = false
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="t.tituloNovoItem"
    :description="t.formularioAjuda"
    :ui="{ content: 'max-w-4xl' }"
  >
    <template #body>
      <div class="max-h-[60vh] overflow-y-auto pr-1">
        <div class="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          <!--
            A animação em cascata existe para a ordem dos campos ser legível:
            o olho acompanha a sequência em vez de receber trinta caixas de uma
            vez. Respeita prefers-reduced-motion pelo main.css.
          -->
          <div
            v-for="(campo, i) in campos"
            :key="campo.tipo"
            class="animate-fade"
            :class="campo.larguraCheiaNoFormulario ? 'md:col-span-2' : ''"
            :style="{ animationDelay: `${Math.min(i * 18, 420)}ms` }"
          >
            <EntradaDoCampo
              v-model="rascunho[campo.refId]"
              :campo="campo"
              :t="t"
              :idioma="idioma"
              na-criacao
              @inspecionar="emit('inspecionar', campo.tipo)"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-end gap-2">
        <UButton :label="t.cancelar" color="neutral" variant="ghost" size="sm" @click="aberto = false" />
        <UButton
          :label="salvando ? t.salvando : t.criar"
          :loading="salvando"
          color="primary"
          size="sm"
          @click="criar"
        />
      </div>
    </template>
  </UModal>
</template>
