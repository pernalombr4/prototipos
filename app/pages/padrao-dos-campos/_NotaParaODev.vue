<script setup lang="ts">
/**
 * A NOTA PARA O DEV.
 *
 * Existe por um risco que ela apontou: texto escrito dentro da peça vira
 * requisito. O dev abre o protótipo, lê "Enter salva. Sair do campo salva.
 * Esc desfaz." embaixo de um campo e entende que precisa escrever isso na
 * tela, quando o que está ali é a descrição de um COMPORTAMENTO que ele
 * implementa, não uma frase que o usuário deve ler.
 *
 * Então a nota tem cara de anotação, e não de interface: cor de andaime,
 * borda tracejada e o rótulo "Para o dev" na frente. Quem olha sabe, antes de
 * ler o conteúdo, que aquilo não entra no produto.
 *
 * O mesmo tratamento que o botão de configuração recebeu na rodada 24, quando
 * ele saiu do quadro: o andaime não se disfarça de produto.
 */
import type { Textos } from './textos'

defineProps<{
  t: Textos
  /** Nota curta, de uma linha, para caber embaixo de um controle. */
  compacta?: boolean
}>()
</script>

<template>
  <p
    class="flex items-start gap-1.5 rounded border border-dashed border-warning/50 bg-warning/5 px-1.5 py-1 text-warning"
    :class="compacta ? 'text-[11px]' : 'text-xs'"
  >
    <UIcon name="i-lucide-code-2" class="mt-px size-3 shrink-0" />
    <span class="min-w-0">
      <span class="font-semibold uppercase tracking-wide">{{ t.notaParaODev }}</span>
      <span class="opacity-80">: <slot /></span>
    </span>
  </p>
</template>
