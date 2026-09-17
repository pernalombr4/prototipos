<script setup lang="ts">
import { destaque } from './estado'

/**
 * O bloco de uma seção de configuração.
 *
 * Três coisas que a tela de hoje não tem, e que moram aqui:
 *  - um título que diz o assunto e uma linha que diz o que ele decide;
 *  - o link para o artigo que explica a seção (a sexta queixa da demanda);
 *  - âncora própria, para a busca conseguir trazer alguém até aqui e piscar.
 */
const props = defineProps<{
  id: string
  titulo: string
  resumo?: string
  doc?: string
  perigo?: boolean
}>()

const aceso = computed(() => destaque.value === props.id)
</script>

<template>
  <!--
    A variante `perigo` não é o mesmo cartão com o título vermelho: é borda
    vermelha, cabeçalho com fundo tingido e ícone de aviso antes do nome. A
    tela de hoje grita nessa seção e faz certo; a rodada 1 tinha apagado o
    grito sem motivo.
  -->
  <section
    :id="id"
    class="scroll-mt-40 rounded-xl border transition-shadow duration-500"
    :class="[
      perigo ? 'border-error/50 bg-error/[0.02]' : 'border-default bg-default',
      aceso ? 'ring-2 ring-primary shadow-lg' : 'ring-0',
    ]"
  >
    <!--
      Sem linha sob o título.
      A hierarquia já está na tipografia (16px semibold sobre 14px cinza) e a
      moldura já disse onde a seção começa. A linha era a terceira vez que o
      mesmo agrupamento era desenhado, e é o que o Material chama de divisor
      que não se paga. Na zona de perigo o fundo tingido continua: ali a faixa
      trabalha, separa o aviso do que é irreversível.
    -->
    <header
      class="flex flex-wrap items-start gap-x-4 gap-y-2 px-5 pt-4"
      :class="perigo ? 'rounded-t-xl bg-error/5 pb-4' : 'pb-2'"
    >
      <div class="min-w-0 flex-1">
        <h2
          class="flex items-center gap-2 text-base font-semibold"
          :class="perigo ? 'text-error' : 'text-highlighted'"
        >
          <UIcon v-if="perigo" name="i-lucide-triangle-alert" class="size-5 shrink-0" />
          {{ titulo }}
        </h2>
        <p v-if="resumo" class="mt-0.5 text-sm text-muted">
          {{ resumo }}
        </p>
      </div>

      <UButton
        v-if="doc"
        :to="doc"
        target="_blank"
        icon="i-lucide-book-open"
        label="Documentação"
        trailing-icon="i-lucide-arrow-up-right"
        size="xs"
        color="neutral"
        variant="ghost"
        class="shrink-0 transition-transform hover:-translate-y-0.5"
      />
    </header>

    <!--
      `@container` para o conteúdo saber a largura do CARTÃO, e não a da janela.
      É o que deixa a mesma linha de ajuste se comportar certo tanto numa coluna
      de 590 px quanto num cartão de 1.200 px.
    -->
    <div class="@container px-5 pb-4 pt-3">
      <slot />
    </div>

    <footer v-if="$slots.rodape" class="border-t border-default px-5 py-3">
      <slot name="rodape" />
    </footer>
  </section>
</template>
