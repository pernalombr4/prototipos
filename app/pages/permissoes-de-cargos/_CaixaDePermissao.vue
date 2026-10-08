<script setup lang="ts">
/**
 * A caixa de uma permissão, com os estados que a pesquisa visual mostrou:
 *
 * - herdada do nível de cima: tom claro da cor primária (Twenty);
 * - diferente do nível de cima: cor cheia e seta de desfazer ao lado (Twenty);
 * - parcial, quando vale só para parte dos campos: traço (Directus, Strapi);
 * - travada, quando outra ação exige esta: marcada, desabilitada, com cadeado
 *   e o motivo na dica (Appsmith, ClickUp);
 * - "só os seus": ícone de pessoa à esquerda, quando a ação vale só para os
 *   itens que a pessoa criou (ClickUp, HubSpot).
 *
 * Layout em linha com 3 vagas de largura fixa (pessoa, caixa, desfazer ou
 * cadeado), para a caixa ficar sempre no mesmo lugar da coluna.
 */
const props = defineProps<{
  valor: boolean | 'indeterminate'
  rotulo: string
  herdada?: boolean
  difere?: boolean
  /** Texto do motivo quando outra ação exige esta. */
  travadaPor?: string | null
  dica?: string
  desabilitada?: boolean
  rotuloDesfazer?: string
  soOsSeus?: string | null
}>()

const emit = defineEmits<{ alterar: [valor: boolean], desfazer: [] }>()

const textoDaDica = computed(() => props.travadaPor ?? props.dica ?? '')
const clara = computed(() => props.herdada && !props.difere && props.valor !== 'indeterminate')
</script>

<template>
  <span class="inline-flex items-center gap-0.5 align-middle">
    <!-- Vaga 1: só os seus -->
    <span class="flex w-4 justify-center">
      <UTooltip v-if="soOsSeus" :text="soOsSeus">
        <UIcon name="i-lucide-user-round" class="size-3.5 text-info" :aria-label="soOsSeus" role="img" />
      </UTooltip>
    </span>

    <!-- Vaga 2: a caixa -->
    <UTooltip :text="textoDaDica" :disabled="!textoDaDica">
      <span class="inline-flex">
        <UCheckbox
          :model-value="valor"
          :ui="clara ? { indicator: 'bg-primary/40' } : undefined"
          :disabled="desabilitada || !!travadaPor"
          :aria-label="rotulo"
          class="inline-flex transition-transform active:scale-90"
          @update:model-value="v => emit('alterar', v === true)"
        />
      </span>
    </UTooltip>

    <!-- Vaga 3: cadeado (travada) ou desfazer (diferente do nível de cima) -->
    <span class="flex w-5 justify-center">
      <!-- A caixa travada fica desabilitada e não abre dica: o motivo mora no cadeado. -->
      <UTooltip v-if="travadaPor" :text="travadaPor">
        <button type="button" class="flex cursor-help items-center rounded-sm text-muted transition-colors hover:text-highlighted focus-visible:outline-2 focus-visible:outline-primary" :aria-label="travadaPor">
          <UIcon name="i-lucide-lock" class="size-3" />
        </button>
      </UTooltip>
      <UTooltip v-else-if="difere && rotuloDesfazer && !desabilitada" :text="rotuloDesfazer">
        <UButton
          icon="i-lucide-undo-2"
          size="xs"
          variant="link"
          color="warning"
          class="p-0.5"
          :aria-label="rotuloDesfazer"
          @click="emit('desfazer')"
        />
      </UTooltip>
    </span>
  </span>
</template>
