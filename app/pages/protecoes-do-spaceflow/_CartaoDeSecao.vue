<script setup lang="ts">
/**
 * Um cartão da aba Proteções: ícone, título, descrição de 1 frase e o selo do
 * que a seção fez hoje ("Agiu 12 vezes hoje"). As regras entram no corpo.
 */
defineProps<{
  id: string
  icone: string
  titulo: string
  descricao: string
  /** Texto do selo; vazio quando a seção não agiu. */
  agiu?: string
  indice: number
}>()
</script>

<template>
  <section
    :id="id"
    class="scroll-mt-4"
    :style="{ animation: `entrada .36s ease-out ${indice * 60}ms backwards` }"
    :aria-labelledby="`${id}-titulo`"
  >
    <UCard :ui="{ header: 'p-4 sm:px-5', body: 'p-4 sm:px-5 divide-y divide-(--ui-border)' }">
      <template #header>
        <div class="flex items-start gap-3">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UIcon :name="icone" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <h3 :id="`${id}-titulo`" class="text-base font-semibold text-highlighted">{{ titulo }}</h3>
            <p class="text-sm text-muted">{{ descricao }}</p>
          </div>
          <UBadge v-if="agiu" :label="agiu" icon="i-lucide-activity" color="primary" variant="soft" size="sm" class="shrink-0" />
        </div>
      </template>
      <slot />
    </UCard>
  </section>
</template>
