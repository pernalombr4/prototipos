<script setup lang="ts">
/**
 * Os estados que toda tela tem, num lugar só (W3 da auditoria: um estado
 * vazio que diz o que falta, por que importa e leva até lá).
 *
 * - carregando: esqueleto no formato do conteúdo (`forma`);
 * - erro: o que aconteceu e "Tentar de novo";
 * - sem permissão: quem libera e o botão de pedir acesso;
 * - vazio: o slot `vazio` de cada tela, porque o texto muda de tela para tela;
 * - cheio: o slot padrão.
 */
import type { Cenario } from './estado'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  cenario: Cenario
  forma?: 'tabela' | 'cartoes' | 'painel' | 'divisao'
}>()

const emit = defineEmits<{ tentarDeNovo: [] }>()

const toast = useToast()
const pedindo = ref(false)
async function pedirAcesso() {
  pedindo.value = true
  await new Promise(r => setTimeout(r, 700))
  pedindo.value = false
  toast.add({ title: props.t.comum.acessoPedido, icon: 'i-lucide-send', color: 'success' })
}
</script>

<template>
  <Transition
    mode="out-in"
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-1"
    leave-active-class="transition duration-100 ease-in"
    leave-to-class="opacity-0"
  >
    <div v-if="cenario === 'carregando'" key="carregando" class="p-6" role="status" :aria-label="t.comum.carregando">
      <div v-if="forma === 'cartoes'" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <USkeleton v-for="i in 6" :key="i" class="h-32 rounded-lg" />
      </div>
      <div v-else-if="forma === 'painel'" class="grid gap-4 md:grid-cols-4">
        <USkeleton v-for="i in 4" :key="i" class="h-24 rounded-lg" />
        <USkeleton class="h-64 rounded-lg md:col-span-2" />
        <USkeleton class="h-64 rounded-lg md:col-span-2" />
      </div>
      <div v-else-if="forma === 'divisao'" class="grid gap-4 md:grid-cols-[22rem_1fr]">
        <div class="space-y-2">
          <USkeleton v-for="i in 7" :key="i" class="h-16 rounded-md" />
        </div>
        <USkeleton class="h-96 rounded-lg" />
      </div>
      <div v-else class="space-y-2">
        <USkeleton class="h-9 w-full rounded-md" />
        <USkeleton v-for="i in 9" :key="i" class="h-11 w-full rounded-md" />
      </div>
    </div>

    <div v-else-if="cenario === 'erro'" key="erro" class="flex flex-1 items-center justify-center p-10">
      <UEmpty
        icon="i-lucide-cloud-off"
        :title="t.comum.erroTitulo"
        :description="t.comum.erroTexto"
        :actions="[{ label: t.comum.tentarDeNovo, icon: 'i-lucide-rotate-cw', color: 'neutral', variant: 'outline', onClick: () => emit('tentarDeNovo') }]"
      />
    </div>

    <div v-else-if="cenario === 'sem-permissao'" key="sem-permissao" class="flex flex-1 items-center justify-center p-10">
      <UEmpty
        icon="i-lucide-lock"
        :title="t.comum.semPermissaoTitulo"
        :description="t.comum.semPermissaoTexto"
        :actions="[{ label: t.comum.pedirAcesso, icon: 'i-lucide-send', color: 'neutral', variant: 'outline', loading: pedindo, onClick: pedirAcesso }]"
      />
    </div>

    <div v-else-if="cenario === 'vazio'" key="vazio" class="flex flex-1 items-center justify-center p-10">
      <slot name="vazio" />
    </div>

    <div v-else key="cheio" class="flex min-h-0 flex-1 flex-col">
      <slot />
    </div>
  </Transition>
</template>
