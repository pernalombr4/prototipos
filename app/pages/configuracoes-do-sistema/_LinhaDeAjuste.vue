<script setup lang="ts">
import type { Ajuste } from './mocks'

/**
 * Uma linha de configuração.
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
 * O controle padrão é um switch. Quem precisar de outro (um select, por
 * exemplo) passa pelo slot `controle` e herda o mesmo alinhamento, que é o
 * que mantém a coluna de controles reta.
 */
defineProps<{ ajuste: Ajuste }>()

const valor = defineModel<boolean | undefined>()
</script>

<template>
  <div
    class="flex items-start gap-4 border-b border-default py-3.5 last:border-0 sm:gap-6"
  >
    <div class="min-w-0 flex-1 @4xl:w-[40rem] @4xl:flex-none">
      <div class="flex items-center gap-1">
        <label
          :for="`ajuste-${ajuste.chave}`"
          class="text-sm font-medium text-highlighted"
        >
          {{ ajuste.rotulo }}
        </label>

        <UPopover v-if="ajuste.detalhe || $slots.detalhe" :content="{ side: 'top', align: 'start' }">
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
              <p v-if="ajuste.detalhe" class="mt-1.5 text-sm text-muted">
                {{ ajuste.detalhe }}
              </p>
              <slot name="detalhe" />
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
          class="mt-2 flex items-start gap-1.5 rounded-md bg-warning/10 px-2.5 py-1.5 text-xs text-warning"
        >
          <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-3.5 shrink-0" />
          <span>{{ ajuste.risco }}</span>
        </p>
      </Transition>
    </div>

    <div class="mt-0.5 shrink-0">
      <slot name="controle">
        <USwitch
          :id="`ajuste-${ajuste.chave}`"
          v-model="valor"
          :aria-label="ajuste.rotulo"
        />
      </slot>
    </div>
  </div>
</template>
