<script setup lang="ts">
import type { Ajuste } from './mocks'

/**
 * Uma linha de configuração de ligar/desligar.
 *
 * Três decisões, nesta ordem:
 *
 * 1. UMA linha de texto, sempre visível. É o que deixa a lista escaneável:
 *    cinco chaves se leem de uma vez, sem hover e sem clique. Três linhas
 *    por chave viram parede.
 * 2. O RESTO atrás do "?" ao lado do rótulo. O produto de hoje já tem esse
 *    "?" e o texto dele é bom; o que estava errado era o lugar, no extremo
 *    direito da tela, a 1290 px do rótulo que ele explica.
 * 3. O RISCO não entra no "?". Aviso que a pessoa precisa ver é aviso que
 *    fica na tela, e só quando o ajuste está ligado: alertar sobre risco
 *    que não está correndo é ruído.
 *
 * Campo que não é chave de ligar/desligar (idioma, fuso, moeda) não usa esta
 * linha: vira grade de campos na seção de padrões.
 */
defineProps<{ ajuste: Ajuste }>()

const valor = defineModel<boolean>({ required: true })
</script>

<template>
  <!--
    A chave vai para a borda direita da linha, e o texto para de crescer aos
    40rem. Com largura fixa no rótulo, a chave parava no meio do cartão largo e
    sobrava meio metro de nada à direita, que é justamente o que ela reclamou na
    rodada 2: quem estreita é o container, nunca a linha.
  -->
  <div
    class="flex items-start justify-between gap-4 border-b border-default py-3.5 last:border-0 sm:gap-6"
  >
    <div class="min-w-0 flex-1 @4xl:max-w-[40rem]">
      <div class="flex items-center gap-1">
        <label
          :for="`ajuste-${ajuste.chave}`"
          class="text-sm font-medium text-highlighted"
        >
          {{ ajuste.rotulo }}
        </label>

        <UPopover v-if="ajuste.detalhe" :content="{ side: 'top', align: 'start' }">
          <UButton
            icon="i-lucide-circle-help"
            size="xs"
            color="neutral"
            variant="ghost"
            :aria-label="`O que faz: ${ajuste.rotulo}`"
            class="shrink-0"
          />

          <template #content>
            <div class="max-w-sm p-3">
              <p class="text-sm font-medium text-highlighted">
                {{ ajuste.rotulo }}
              </p>
              <p class="mt-1.5 text-sm text-muted">
                {{ ajuste.detalhe }}
              </p>
            </div>
          </template>
        </UPopover>
      </div>

      <p class="mt-0.5 text-sm text-muted">
        {{ ajuste.descricao }}
      </p>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <p
          v-if="ajuste.risco && valor"
          class="mt-2 flex items-start gap-1.5 rounded-md bg-warning/10 px-2.5 py-1.5 text-xs text-warning-700 dark:text-warning-300"
        >
          <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-3.5 shrink-0" />
          <span>{{ ajuste.risco }}</span>
        </p>
      </Transition>
    </div>

    <USwitch
      :id="`ajuste-${ajuste.chave}`"
      v-model="valor"
      :aria-label="ajuste.rotulo"
      class="mt-0.5 shrink-0"
    />
  </div>
</template>
