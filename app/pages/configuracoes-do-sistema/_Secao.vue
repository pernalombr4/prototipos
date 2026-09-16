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
  <section
    :id="id"
    class="scroll-mt-40 rounded-xl border bg-default transition-shadow duration-500"
    :class="[
      perigo ? 'border-error/40' : 'border-default',
      aceso ? 'ring-2 ring-primary shadow-lg' : 'ring-0',
    ]"
  >
    <header class="flex flex-wrap items-start gap-x-4 gap-y-2 border-b border-default px-5 py-4">
      <div class="min-w-0 flex-1">
        <h2
          class="text-base font-semibold"
          :class="perigo ? 'text-error' : 'text-highlighted'"
        >
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
    <div class="@container px-5 py-4">
      <slot />
    </div>

    <footer v-if="$slots.rodape" class="border-t border-default px-5 py-3">
      <slot name="rodape" />
    </footer>
  </section>
</template>
