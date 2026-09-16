<script setup lang="ts">
import type { Ajuste } from './mocks'

/**
 * Uma linha de configuração de ligar/desligar.
 *
 * O que muda em relação à tela de hoje: a explicação sai de dentro de um "?"
 * no extremo direito da tela (a 1290 px do rótulo) e vira texto visível,
 * encostado no que ela explica. O controle fica a uma distância de leitura,
 * não a uma tela inteira.
 *
 * O aviso de risco só aparece quando o ajuste está LIGADO — avisar sobre um
 * risco que não está correndo é ruído.
 */
defineProps<{ ajuste: Ajuste }>()

const valor = defineModel<boolean>({ required: true })
</script>

<template>
  <!--
    A linha sempre ocupa a largura inteira do cartão — a régua embaixo dela vai
    de ponta a ponta, que é o que faz a lista parecer lista.

    O que muda com a largura do cartão (container query, não media query):
      • cartão estreito (uma coluna de ~590 px): o controle vai para a borda
        direita e fica a uma distância de leitura do rótulo;
      • cartão largo (≥ 56rem): o texto para em 40rem e o controle vem logo
        depois dele, em vez de viajar até o outro lado. Como a largura do texto
        é fixa, os controles continuam alinhados entre si.
  -->
  <div
    class="flex items-start gap-4 border-b border-default py-4 last:border-0 sm:gap-6"
  >
    <div class="min-w-0 flex-1 @4xl:w-[40rem] @4xl:flex-none">
      <label
        :for="`ajuste-${ajuste.chave}`"
        class="block text-sm font-medium text-highlighted"
      >
        {{ ajuste.rotulo }}
      </label>
      <p class="mt-1 text-sm text-muted">
        {{ ajuste.descricao }}
      </p>

      <p v-if="ajuste.efeito" class="mt-1.5 flex items-start gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-corner-down-right" class="mt-0.5 size-3.5 shrink-0" />
        <span>{{ ajuste.efeito }}</span>
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

    <USwitch
      :id="`ajuste-${ajuste.chave}`"
      v-model="valor"
      :aria-label="ajuste.rotulo"
      class="mt-0.5 shrink-0"
    />
  </div>
</template>
