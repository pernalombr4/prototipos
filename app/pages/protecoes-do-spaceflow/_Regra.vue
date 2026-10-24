<script setup lang="ts">
/**
 * Uma regra da aba Proteções: chave liga e desliga com rótulo e ajuda, e os
 * campos da regra logo abaixo, que só aparecem com a chave ligada.
 *
 * Sem `v-model` a regra não tem chave (o valor é fixo, como no MVP) e os
 * campos ficam sempre à vista.
 */
const props = defineProps<{
  label: string
  descricao?: string
  disabled?: boolean
  /** Mensagem de erro do campo da regra, quando o número é inválido. */
  erro?: string
}>()

const ativo = defineModel<boolean | undefined>({ default: undefined })
const temChave = computed(() => ativo.value !== undefined)
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
    <USwitch
      v-if="temChave"
      :model-value="!!ativo"
      @update:model-value="ativo = $event"
      :label="label"
      :description="descricao"
      :disabled="disabled"
      :aria-describedby="props.erro ? `${id}-erro` : undefined"
      :ui="{ label: 'text-sm font-medium text-highlighted', description: 'text-sm text-muted' }"
    />
    <div v-else class="flex items-start gap-3">
      <UIcon name="i-lucide-info" class="mt-0.5 size-4 shrink-0 text-muted" />
      <div>
        <p class="text-sm font-medium text-highlighted">{{ label }}</p>
        <p v-if="descricao" class="text-sm text-muted">{{ descricao }}</p>
      </div>
    </div>

    <Transition
      enter-active-class="transition-[opacity,transform] duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition-[opacity,transform] duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="!temChave || ativo" class="flex flex-col gap-2" :class="temChave ? 'pl-11' : ''">
        <slot />
        <p v-if="erro" :id="`${id}-erro`" class="flex items-center gap-1 text-xs text-error" role="alert">
          <UIcon name="i-lucide-circle-alert" class="size-3.5" />
          {{ erro }}
        </p>
      </div>
    </Transition>
  </div>
</template>
