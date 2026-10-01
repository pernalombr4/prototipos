<script setup lang="ts">
import { diasDaSemana } from './mocks'
import { form } from './estado'

/**
 * A regra da semana, nos dois modos da tela.
 *
 * `coluna` é o cabeçalho da grade do mês: a regra mora onde o efeito aparece,
 * e clicar na coluna muda todas as terças, que é o alcance dela. `linha` é a
 * mesma regra no modo lista, para quem não está dando conta do calendário.
 *
 * O estado é um selo, não uma letrinha: "útil" e "folga" é o que a pessoa
 * procura aqui, e era o que não se via. O contorno tracejado diz que dá para
 * mexer antes de qualquer hover.
 */
defineProps<{ formato: 'coluna' | 'linha' }>()

function alternar(chave: number) {
  const i = form.calendario.diasUteis.indexOf(chave)
  if (i >= 0) form.calendario.diasUteis.splice(i, 1)
  else form.calendario.diasUteis.push(chave)
}

function util(chave: number) {
  return form.calendario.diasUteis.includes(chave)
}
</script>

<template>
  <UTooltip
    v-for="d in diasDaSemana"
    :key="d.chave"
    :text="util(d.chave)
      ? `Clique para tirar ${d.nome} do expediente`
      : `Clique para pôr ${d.nome} no expediente`"
  >
    <button
      type="button"
      :data-coluna="d.chave"
      class="group flex cursor-pointer items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
      :class="[
        formato === 'coluna'
          ? 'w-full flex-col gap-1 px-2 py-2.5'
          : 'rounded-lg border border-default px-3 py-2 hover:-translate-y-0.5 hover:border-accented',
        formato === 'coluna' && !util(d.chave) ? 'bg-accented/40 hover:bg-accented/60' : '',
        formato === 'coluna' && util(d.chave) ? 'hover:bg-accented/50' : '',
      ]"
      :aria-pressed="util(d.chave)"
      :aria-label="`${d.nome}: ${util(d.chave) ? 'dia útil' : 'folga'}. Vale para todas as semanas.`"
      @click="alternar(d.chave)"
    >
      <span
        class="text-[11px] font-medium uppercase tracking-wider"
        :class="util(d.chave) ? 'text-highlighted' : 'text-muted'"
      >
        {{ formato === 'coluna' ? d.nome.slice(0, 3) : d.nome }}
      </span>

      <span
        class="flex shrink-0 items-center gap-1 rounded-full border border-dashed px-2 py-0.5 text-[11px] font-medium transition-colors"
        :class="util(d.chave)
          ? 'border-primary/40 bg-primary/10 text-primary-700 group-hover:border-primary dark:text-primary-300'
          : 'border-default bg-default text-muted group-hover:border-accented group-hover:text-toned'"
      >
        <UIcon
          :name="util(d.chave) ? 'i-lucide-check' : 'i-lucide-x'"
          class="size-3 shrink-0"
        />
        {{ util(d.chave) ? 'útil' : 'folga' }}
      </span>
    </button>
  </UTooltip>
</template>
