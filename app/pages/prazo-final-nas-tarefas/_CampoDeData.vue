<script setup lang="ts">
/**
 * Campo de data da tarefa: o prazo de hoje e o prazo final novo usam o mesmo.
 *
 * Guarda o que a pessoa digitou (rascunho) separado do valor salvo: quando a
 * RN004 recusa o valor, o campo continua mostrando o que foi digitado, com o
 * aviso embaixo, e a tarefa fica com o valor anterior (RF013, RF014).
 */
const props = defineProps<{
  id: string
  rotulo: string
  /** Instrução, entre o rótulo e o campo: o que a data significa. */
  instrucao?: string
  /** Ajuda, abaixo do campo: a regra. O aviso de erro toma o lugar dela. */
  ajuda?: string
  /** Limites do calendário nativo (RN004): o seletor já esconde a data que seria recusada. */
  min?: string | null
  max?: string | null
  /** Valor gravado na tarefa, `AAAA-MM-DD` ou null. */
  salvo: string | null
  /** Texto do aviso no próprio campo. */
  erro?: string
  /** RF004: sem permissão, mostra só o valor. */
  somenteLeitura?: boolean
  /** Valor formatado no idioma, para o modo leitura. */
  formatado?: string
  vazio: string
  salvando?: boolean
  /** Rótulo do botão de apagar; sem ele, o campo não oferece apagar. */
  rotuloApagar?: string
  icone?: string
}>()

const emit = defineEmits<{ mudar: [valor: string | null] }>()

const rascunho = ref(props.salvo ?? '')
watch(() => props.salvo, v => { rascunho.value = v ?? '' })

/**
 * Confirma ao sair do campo ou no Enter. O campo nativo de data emite a cada
 * segmento digitado (dia, mês, ano), e gravar ali salvaria datas pela metade.
 */
function confirmar() {
  if (rascunho.value && Number(rascunho.value.slice(0, 4)) < 1900) return
  emit('mudar', rascunho.value || null)
}

function apagar() {
  rascunho.value = ''
  emit('mudar', null)
}
</script>

<template>
  <UFormField :label="rotulo" :description="instrucao" :help="erro ? undefined : ajuda" :error="erro" :name="id">
    <div v-if="somenteLeitura" class="flex h-8 items-center gap-2 text-sm">
      <UIcon name="i-lucide-lock" class="size-3.5 text-muted" aria-hidden="true" />
      <span :class="salvo ? 'text-highlighted' : 'text-muted'">{{ salvo ? formatado : vazio }}</span>
    </div>
    <div v-else class="flex items-center gap-1.5">
      <UInput
        :id="id"
        type="date"
        v-model="rascunho"
        :min="min ?? undefined"
        :max="max ?? undefined"
        :icon="icone"
        :loading="salvando"
        class="w-full max-w-48"
        @blur="confirmar"
        @keydown.enter.prevent="confirmar"
      />
      <UButton
        v-if="rotuloApagar && salvo"
        icon="i-lucide-x"
        color="neutral"
        variant="outline"
        size="sm"
        :aria-label="rotuloApagar"
        class="transition-transform hover:-translate-y-0.5"
        @click="apagar"
      />
    </div>
  </UFormField>
</template>
