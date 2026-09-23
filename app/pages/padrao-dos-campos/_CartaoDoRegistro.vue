<script setup lang="ts">
/**
 * O CARTÃO DO REGISTRO RELACIONADO.
 *
 * Ela trouxe do nosso admin: na lista de workspaces, passar o mouse na carteira
 * abre um cartão com saldo, referência, id e datas, e um botão "Ver detalhes da
 * carteira". A ideia é boa e resolve um buraco real: numa relação, o `display`
 * sozinho ("Nortelux Elétrica") não responde **que registro é esse**, e hoje a
 * única forma de saber é abrir o item e perder o lugar.
 *
 * ## Como isso entra sem virar frankenstein
 *
 * A regra que mantém tudo combinando é de três gestos, e ela vale para a tabela
 * inteira, não só para a relação:
 *
 * | Gesto | O que acontece | Onde já valia |
 * |---|---|---|
 * | **passar o mouse** | MOSTRA | a bandeja de copiar, e agora o cartão |
 * | **clicar** | EDITA | o quadro que salta para fora da tabela |
 * | **ação explícita** | ABRE | o botão Abrir da Referência, e o daqui |
 *
 * O cartão é só leitura. Se ele tivesse controle de edição dentro, brigaria com
 * o quadro, que é quem edita, e aí sim seria frankenstein.
 *
 * ## E a linha não alarga
 *
 * Ela foi explícita: a linha tem que continuar com a altura da tabela do
 * ENSPACE. O cartão é camada flutuante, como o quadro de edição: ele não ocupa
 * espaço no fluxo, não empurra célula e não muda altura de linha. A célula
 * continua mostrando o selo e mais nada.
 *
 * ## Nos três formatos
 *
 * | Formato | Como o cartão aparece |
 * |---|---|
 * | **célula** | flutuante, no hover do selo, com atraso, porque na tabela o mouse passa por cima sem querer |
 * | **cru** (sidebar) | igual à célula: a coluna é estreita e o cartão flutua |
 * | **formulário** | **fixo embaixo do seletor**, sem hover: no formulário existe espaço vertical, e quem está escolhendo o registro quer conferir a escolha sem fazer mira com o mouse |
 *
 * É o mesmo componente e o mesmo conteúdo nos três. O que muda é o gatilho, e
 * muda por um motivo de espaço, não de gosto.
 */
import type { Textos } from './textos'
import { formatarDataHora } from './formatacao'

const props = defineProps<{
  registro: {
    display?: string
    reference: string
    categoria?: string
    resumo?: { rotulo: string, valor: string }[]
    criadoEm?: string
    atualizadoEm?: string
  }
  t: Textos
  idioma: string
}>()

const emit = defineEmits<{ abrir: [] }>()

/** Display vazio cai para a referência. É a mesma regra da célula. */
const titulo = computed(
  () => (props.registro.display?.trim() ? props.registro.display : props.registro.reference),
)

/** Linha de resumo sem valor não entra: cartão com campo vazio é ruído. */
const resumo = computed(() => (props.registro.resumo ?? []).filter(l => l.valor?.trim()))
</script>

<template>
  <div class="w-72 max-w-[90vw] p-3">
    <p class="flex items-center gap-1.5">
      <UIcon name="i-lucide-link-2" class="size-3.5 shrink-0 text-dimmed" />
      <span class="min-w-0 truncate text-sm font-semibold text-highlighted">{{ titulo }}</span>
    </p>
    <p v-if="registro.categoria" class="mt-0.5 text-xs text-muted">{{ registro.categoria }}</p>

    <div v-if="resumo.length" class="mt-2.5 space-y-1.5 border-t border-default pt-2.5">
      <p v-for="linha in resumo" :key="linha.rotulo" class="flex items-baseline gap-2">
        <span class="w-20 shrink-0 text-[10px] uppercase tracking-wide text-dimmed">
          {{ linha.rotulo }}
        </span>
        <span class="min-w-0 flex-1 break-words text-sm text-toned">{{ linha.valor }}</span>
      </p>
    </div>

    <div class="mt-2.5 space-y-1.5 border-t border-default pt-2.5">
      <p class="flex items-baseline gap-2">
        <span class="w-20 shrink-0 text-[10px] uppercase tracking-wide text-dimmed">
          {{ t.referencia }}
        </span>
        <span class="min-w-0 flex-1 break-all font-mono text-xs text-toned">
          {{ registro.reference }}
        </span>
      </p>
      <p v-if="registro.criadoEm" class="flex items-baseline gap-2">
        <span class="w-20 shrink-0 text-[10px] uppercase tracking-wide text-dimmed">
          {{ t.criadoEmRotulo }}
        </span>
        <span class="min-w-0 flex-1 text-xs text-toned">
          {{ formatarDataHora(registro.criadoEm, idioma) }}
        </span>
      </p>
      <p v-if="registro.atualizadoEm" class="flex items-baseline gap-2">
        <span class="w-20 shrink-0 text-[10px] uppercase tracking-wide text-dimmed">
          {{ t.atualizadoEm }}
        </span>
        <span class="min-w-0 flex-1 text-xs text-toned">
          {{ formatarDataHora(registro.atualizadoEm, idioma) }}
        </span>
      </p>
    </div>

    <!--
      A única ação do cartão, e ela ABRE. Editar é do quadro, e por isso não
      tem controle de edição aqui dentro.
    -->
    <UButton
      icon="i-lucide-maximize-2"
      :label="t.abrirRegistro"
      color="primary"
      variant="soft"
      size="xs"
      block
      class="mt-3"
      @click="emit('abrir')"
    />
  </div>
</template>
