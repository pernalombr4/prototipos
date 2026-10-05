<script setup lang="ts">
/**
 * PROPOSTA. O rascunho minimizado: fechar ou minimizar o compositor não perde
 * o texto, e ele fica numa barra no rodapé enquanto a pessoa troca de tela.
 * Gmail (janela minimizada) e Salesforce (compositor acoplado) fazem assim.
 */
import type { Textos } from './textos'
import { itemPorId } from './mocks'
import { useComunicacao, useMarcaDeProposta } from './estado'

const props = defineProps<{ t: Textos }>()

const { compositorAberto, rascunho, descartarRascunho } = useComunicacao()
const marca = useMarcaDeProposta()
const toast = useToast()

const visivel = computed(() => !compositorAberto.value && !!(rascunho.value.para.length || rascunho.value.assunto || rascunho.value.corpo.replace(/<[^>]+>/g, '').trim()))
const item = computed(() => itemPorId(rascunho.value.itemId))

function descartar() {
  const copia = structuredClone(toRaw(rascunho.value))
  descartarRascunho()
  toast.add({
    title: props.t.compositor.descartado,
    icon: 'i-lucide-trash-2',
    color: 'neutral',
    actions: [{ label: props.t.compositor.desfazer, color: 'neutral', variant: 'outline', onClick: () => { rascunho.value = copia } }],
  })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="translate-y-3 opacity-0"
    leave-active-class="transition duration-150 ease-in"
    leave-to-class="translate-y-3 opacity-0"
  >
    <!-- bottom-28: acima da barra de andaime, que quebra em 2 linhas abaixo de ~1500 px. No produto, bottom-4. -->
    <div
      v-if="visivel"
      class="fixed bottom-28 right-4 z-30 flex w-[min(26rem,calc(100vw-2rem))] items-center gap-3 rounded-lg border border-default bg-default px-3 py-2 shadow-lg"
      :class="marca"
      role="region"
      :aria-label="t.compositor.rascunho"
    >
      <UIcon name="i-lucide-mail" class="size-4 shrink-0 text-primary" />
      <button type="button" class="min-w-0 flex-1 text-left" @click="compositorAberto = true">
        <span class="block truncate text-sm font-medium text-highlighted">{{ rascunho.assunto || t.compositor.semAssunto }}</span>
        <span class="block truncate text-xs text-muted">
          {{ t.compositor.rascunho }}<template v-if="rascunho.para.length"> · {{ rascunho.para.join(', ') }}</template><template v-if="item"> · {{ item.reference }}</template>
        </span>
      </button>
      <UButton :label="t.compositor.abrirRascunho" color="primary" variant="soft" size="xs" @click="compositorAberto = true" />
      <UTooltip :text="t.compositor.descartar">
        <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" :aria-label="t.compositor.descartar" @click="descartar" />
      </UTooltip>
    </div>
  </Transition>
</template>
