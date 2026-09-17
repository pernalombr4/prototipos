<script setup lang="ts">
import { menuNativoDeHoje } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * A reprodução do menu de hoje, para comparar.
 *
 * Abre pela DIREITA de propósito: o menu proposto continua visível na esquerda, e
 * a comparação acontece de verdade, lado a lado, em vez de um cobrir o outro.
 *
 * Os rótulos são os capturados no develop e não passam pelo textos.ts: isto é
 * registro de uma captura, como o GIF em evidencias/. A legenda avisa.
 */
const props = defineProps<{ t: TextosDaTela }>()
const aberto = defineModel<boolean>('open', { default: false })

/**
 * Medido no develop em 16/09/2026, viewport 1920 x 911.
 *
 * O que está desenhado abaixo é o menu NATIVO: 31 linhas que existem em
 * qualquer workspace, com zero categorias cadastradas.
 *
 * A medição em pixel foi feita no `teste-ux`, que tinha 36 linhas (as 31
 * nativas mais 5 daquele workspace): 1208 px de menu em 847 px de área.
 * A altura do menu nativo é DERIVADA dessa medição, não medida à parte:
 * 1208 / 36 = 33,5 px por linha, vezes 31 = cerca de 1040 px. Continua
 * acima dos 847 px disponíveis, sem nenhuma categoria cadastrada.
 */
const medicao = {
  linhasNativas: 31,
  itensNativos: 28,
  niveis: 3,
  alturaNativaDerivada: 1040,
  alturaMedida: 1208,
  linhasMedidas: 36,
  alturaDisponivel: 847,
  deConfiguracoes: 19,
}

const sobraNativa = medicao.alturaNativaDerivada - medicao.alturaDisponivel

/** Onde a tela corta: 847 px divididos pelos 33,5 px por linha da medição. */
const linhaDagua = Math.floor(medicao.alturaDisponivel / 33.5)

const recuo: Record<number, string> = {
  0: 'pl-0',
  1: 'pl-3',
  2: 'pl-8',
  3: 'pl-13',
}
</script>

<template>
  <USlideover
    v-model:open="aberto"
    side="right"
    :title="props.t.hojeTitulo"
    :description="props.t.hojeLegenda"
    :ui="{ content: 'max-w-sm' }"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <!-- A medição, antes da lista: é ela que sustenta o argumento. -->
        <div class="grid grid-cols-2 gap-2">
          <div class="rounded-lg border border-default p-3">
            <div class="text-2xl font-bold text-highlighted">{{ medicao.linhasNativas }}</div>
            <div class="text-xs text-muted">{{ props.t.linhas(medicao.linhasNativas) }}</div>
          </div>
          <div class="rounded-lg border border-default p-3">
            <div class="text-2xl font-bold text-highlighted">{{ medicao.niveis }}</div>
            <div class="text-xs text-muted">{{ props.t.niveis(medicao.niveis) }}</div>
          </div>
        </div>

        <UAlert
          icon="i-lucide-move-vertical"
          color="warning"
          variant="subtle"
          :title="props.t.naoCabeNaTela(sobraNativa)"
          :description="`~${medicao.alturaNativaDerivada} px / ${medicao.alturaDisponivel} px · ${medicao.deConfiguracoes}/${medicao.itensNativos}`"
        />

        <!-- A lista, do jeito que ela é. -->
        <div class="rounded-lg border border-default bg-elevated/40 p-2">
          <template v-for="(linha, i) in menuNativoDeHoje" :key="i">
            <div
              v-if="i === linhaDagua"
              class="my-2 flex items-center gap-2"
              aria-hidden="true"
            >
              <span class="h-px flex-1 border-t border-dashed border-warning" />
              <span class="text-[10px] font-semibold uppercase tracking-wider text-warning">
                {{ props.t.naoCabeNaTela(sobraNativa) }}
              </span>
            </div>

            <div
              class="flex items-center gap-2 py-1 text-sm"
              :class="[
                recuo[linha.nivel],
                linha.nivel === 0
                  ? 'mt-2 text-xs font-semibold uppercase tracking-wider text-toned first:mt-0'
                  : 'text-default',
                i >= linhaDagua ? 'opacity-45' : '',
              ]"
            >
              <span
                v-if="linha.nivel > 0"
                class="size-1.5 shrink-0 rounded-full"
                :class="linha.nivel === 1 ? 'bg-toned' : 'bg-muted'"
              />
              <span class="truncate">{{ linha.rotulo }}</span>
            </div>
          </template>
        </div>

        <!-- O que o menu nativo NÃO mostra, e que cresce por workspace. -->
        <p class="text-xs leading-relaxed text-muted">{{ props.t.hojeRodape }}</p>
      </div>
    </template>
  </USlideover>
</template>
