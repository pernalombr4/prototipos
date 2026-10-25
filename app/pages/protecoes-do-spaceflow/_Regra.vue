<script setup lang="ts">
/**
 * Uma linha da aba Proteções, no padrão de página de configurações do Nuxt UI
 * (`UFormField` horizontal): rótulo e 1 frase à esquerda, controle à direita.
 *
 * - Com `v-model`, a linha tem chave; os campos da regra (número, unidade)
 *   aparecem à esquerda da chave só com ela ligada;
 * - Sem `v-model`, os campos ficam sempre à vista (regra que é só uma escolha);
 * - Com `fixo`, a linha mostra o valor que o MVP não deixa mudar.
 *
 * O `for` do rótulo aponta para a chave. Número e unidade recebem `id` e
 * `aria-label` próprios, para não repetir o id do campo.
 */
const props = defineProps<{
  label: string
  descricao?: string
  disabled?: boolean
  /** Mensagem de erro do número da regra. */
  erro?: string
  /** Valor fixo (MVP): aparece como selo no lugar do controle. */
  fixo?: string
}>()

const ativo = defineModel<boolean | undefined>({ default: undefined })
const temChave = computed(() => ativo.value !== undefined)
</script>

<template>
  <UFormField
    :label="label"
    :description="descricao"
    :error="erro"
    orientation="horizontal"
    :ui="{
      root: 'flex max-sm:flex-col sm:items-center justify-between gap-x-8 gap-y-3 py-4',
      wrapper: 'min-w-0 flex-1',
      label: 'text-sm font-medium text-highlighted',
      description: 'text-sm text-muted',
      container: 'flex shrink-0 flex-col items-end gap-1 max-sm:items-start',
      error: 'text-xs',
    }"
  >
    <div class="flex flex-wrap items-center justify-end gap-3">
      <Transition
        enter-active-class="transition-[opacity,transform] duration-200 ease-out"
        enter-from-class="opacity-0 translate-x-1"
        leave-active-class="transition-opacity duration-100"
        leave-to-class="opacity-0"
      >
        <div v-if="$slots.default && (!temChave || ativo)" class="flex items-center gap-2 text-sm text-toned">
          <slot />
        </div>
      </Transition>
      <UBadge v-if="fixo" :label="fixo" color="neutral" variant="soft" size="md" />
      <USwitch
        v-if="temChave"
        :model-value="!!ativo"
        :disabled="disabled"
        @update:model-value="ativo = $event"
      />
    </div>
    <template #error="{ error }">
      <span v-if="props.erro" role="alert" class="flex items-center gap-1">
        <UIcon name="i-lucide-circle-alert" class="size-3.5" />
        {{ error }}
      </span>
    </template>
  </UFormField>
</template>
