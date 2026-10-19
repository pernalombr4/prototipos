<script setup lang="ts">
/**
 * Modal do segredo mostrado uma vez (token do SCIM, credencial da conta de
 * serviço, segredo do webhook). Padrão de mercado: o valor aparece só aqui.
 */
import type { Textos } from './textos'

defineProps<{ t: Textos, titulo: string, valores: { rotulo: string, valor: string }[] }>()
const aberto = defineModel<boolean>('open', { required: true })
const copiado = ref<string | null>(null)

async function copiar(v: string) {
  try {
    await navigator.clipboard.writeText(v)
  }
  catch { /* sem permissão de área de transferência: o estado visual basta no protótipo */ }
  copiado.value = v
  setTimeout(() => { if (copiado.value === v) copiado.value = null }, 1800)
}
</script>

<template>
  <UModal v-model:open="aberto" :title="titulo" :dismissible="false">
    <template #body>
      <div class="space-y-4">
        <UAlert icon="i-lucide-eye" color="warning" variant="soft" :description="t.comum.umaVez" />
        <div v-for="v in valores" :key="v.rotulo" class="space-y-1">
          <p class="text-xs font-medium text-toned">{{ v.rotulo }}</p>
          <div class="flex items-center gap-2">
            <code class="min-w-0 flex-1 truncate rounded-md border border-default bg-elevated px-2 py-1.5 font-mono text-xs text-highlighted">{{ v.valor }}</code>
            <UButton
              :icon="copiado === v.valor ? 'i-lucide-check' : 'i-lucide-copy'"
              :label="copiado === v.valor ? t.comum.copiado : t.comum.copiar"
              size="sm"
              color="neutral"
              variant="outline"
              @click="copiar(v.valor)"
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <UButton :label="t.comum.copieiFechar" class="ml-auto" @click="aberto = false" />
    </template>
  </UModal>
</template>
