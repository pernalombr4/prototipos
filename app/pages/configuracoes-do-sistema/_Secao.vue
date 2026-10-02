<script setup lang="ts">
import { agrupamento, destaque } from './estado'

/**
 * O bloco de uma seção de configuração.
 *
 * Duas coisas que a tela de hoje não tem, e que moram aqui:
 *  - um título que diz o assunto e uma linha que diz o que ele decide;
 *  - âncora própria, para a busca conseguir trazer alguém até aqui e piscar.
 *
 * O link para a documentação **não** mora mais aqui. Ele era repetido em cada
 * seção, apontando sempre para o mesmo artigo da aba: cinco botões iguais numa
 * tela só. Ficou um, no alto da aba, que é onde a pessoa procura.
 *
 * Rodada 26: o mesmo conteúdo em três desenhos de agrupamento (A, B e C),
 * trocados pela barra de andaime. As abas não mudam: só este componente sabe
 * qual desenho está valendo.
 */
const props = defineProps<{
  id: string
  titulo: string
  resumo?: string
  perigo?: boolean
  /**
   * A seção é a aba inteira (Calendário). Em B ela não ganha bloco: uma
   * moldura que envolve tudo não separa nada de nada.
   */
  unica?: boolean
}>()

const aceso = computed(() => destaque.value === props.id)

/** B com seção única desenha como C, sem o fio sob o título. */
const desenho = computed(() =>
  agrupamento.value === 'suave' && props.unica ? 'solta' : agrupamento.value,
)
</script>

<template>
  <section
    v-if="desenho === 'cartao'"
    :id="id"
    class="scroll-mt-40 rounded-xl border transition-shadow duration-500"
    :class="[
      perigo ? 'border-error/50 bg-error/[0.02]' : 'border-default bg-default',
      aceso ? 'ring-2 ring-primary shadow-lg' : 'ring-0',
    ]"
  >
    <!-- A. Cartão com borda, título dentro. -->
    <!--
      A variante `perigo` não é o mesmo cartão com o título vermelho: é borda
      vermelha, cabeçalho com fundo tingido e ícone de aviso antes do nome. A
      tela de hoje grita nessa seção e faz certo; a rodada 1 tinha apagado o
      grito sem motivo.
    -->
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

      <!--
        O controle que manda na seção inteira fica aqui, no alto e à direita,
        e não solto no meio do conteúdo: é onde se procura o que troca a
        visão de um painel.
      -->
      <div v-if="$slots.acoes" class="flex shrink-0 flex-wrap items-center gap-2">
        <slot name="acoes" />
      </div>
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

  <section
    v-else-if="desenho === 'suave'"
    :id="id"
    class="scroll-mt-40 pt-3"
  >
    <!-- B. Fundo suave, título fora. -->
    <!--
      Título fora, conteúdo num bloco de fundo suave. É o desenho do template
      oficial de dashboard do Nuxt UI: cabeçalho solto (`UPageCard` naked) e
      os campos num `UCard` subtle (`bg-elevated/50`, anel `ring-default`).
      A moldura deixa de envolver o título: ela só segura o que se edita.
    -->
    <header class="mb-3 flex flex-wrap items-end gap-x-4 gap-y-2">
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
      <div v-if="$slots.acoes" class="flex shrink-0 flex-wrap items-center gap-2">
        <slot name="acoes" />
      </div>
    </header>

    <!--
      Zona de perigo: o tingido em gradiente é o do template do Nuxt UI. O
      anel fica vermelho, porque aqui ele é o aviso, e não moldura.
    -->
    <UCard
      variant="subtle"
      class="transition-shadow duration-500"
      :class="[
        perigo && 'bg-linear-to-tl from-error/10 from-5% to-default ring-error/40',
        aceso && 'ring-2 ring-primary shadow-lg',
      ]"
      :ui="{ root: 'rounded-xl overflow-visible', body: 'p-0 sm:p-0', footer: 'px-5 py-3 sm:px-5' }"
    >
      <div class="@container px-5 py-4">
        <slot />
      </div>
      <template v-if="$slots.rodape" #footer>
        <slot name="rodape" />
      </template>
    </UCard>
  </section>

  <section
    v-else
    :id="id"
    class="-mx-3 scroll-mt-40 rounded-lg px-3 pb-2 transition-colors duration-500"
    :class="[
      desenho === 'aberto' ? 'pt-5' : 'pt-3',
      aceso ? 'bg-primary/5 ring-1 ring-primary/40' : '',
    ]"
  >
    <!-- C. Aberto. -->
    <!--
      Sem caixa. O título com um fio embaixo é o que diz onde a seção começa,
      como o cabeçalho de seção do GitHub; o espaço maior entre as seções faz o
      resto. Só a zona de perigo guarda moldura, e vermelha: é a mesma exceção
      que o GitHub faz na tela de configurações dele. Nela o fio sob o título
      sai, porque a moldura logo abaixo já diz onde a seção começa.

      `solta` é a seção única em B: mesmo desenho aberto, sem o fio, porque não
      há outra seção para separar.
    -->
    <header
      class="flex flex-wrap items-end gap-x-4 gap-y-2"
      :class="desenho === 'aberto' && !perigo ? 'border-b border-default pb-3' : 'pb-1'"
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
      <div v-if="$slots.acoes" class="flex shrink-0 flex-wrap items-center gap-2">
        <slot name="acoes" />
      </div>
    </header>

    <div
      class="@container"
      :class="perigo ? 'mt-4 rounded-lg border border-error/50 px-5 py-4' : 'pt-4'"
    >
      <slot />
    </div>

    <footer v-if="$slots.rodape" class="mt-4 border-t border-default pt-3">
      <slot name="rodape" />
    </footer>
  </section>
</template>
