<script setup lang="ts">
/**
 * Um grupo da aba Proteções: título e 1 frase acima, e as regras numa
 * `UPageCard` com uma linha por regra, separadas por divisória (padrão de
 * página de configurações do Nuxt UI).
 *
 * O slot `aviso` fica entre o título e o cartão: ciclo encontrado, fluxo
 * pausado. O slot padrão recebe as linhas (`_Regra.vue`).
 */
defineProps<{
  id: string
  icone: string
  titulo: string
  descricao: string
  indice: number
}>()
</script>

<template>
  <section
    :id="id"
    class="flex scroll-mt-24 flex-col gap-3"
    :style="{ animation: `entrada .36s ease-out ${indice * 50}ms backwards` }"
    :aria-labelledby="`${id}-titulo`"
  >
    <div class="flex items-start gap-2.5">
      <UIcon :name="icone" class="mt-0.5 size-5 shrink-0 text-primary" />
      <div class="min-w-0">
        <h3 :id="`${id}-titulo`" class="text-base font-semibold text-highlighted">{{ titulo }}</h3>
        <p class="text-sm text-muted">{{ descricao }}</p>
      </div>
    </div>
    <slot name="aviso" />
    <UPageCard
      variant="subtle"
      :ui="{ container: 'px-4 py-0 sm:px-5 sm:py-0 gap-y-0 lg:flex divide-y divide-default' }"
    >
      <slot />
    </UPageCard>
  </section>
</template>
