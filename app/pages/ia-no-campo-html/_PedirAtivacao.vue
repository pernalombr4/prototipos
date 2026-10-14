<script setup lang="ts">
/**
 * IA desligada, para quem não administra o workspace. PROPOSTA (rodadas 6 e 7).
 *
 * O botão IA, o Ctrl J e o "/" não bloqueiam: abrem esta caixa no lugar da
 * caixa do BENI. Quem não administra não conecta IA (Configurações ›
 * Integrações é de quem administra): vê quem administra e pede a ativação.
 * Quem administra não vê esta caixa: vai direto ao modal "Conectar uma IA"
 * (_ConectarIa).
 */
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ fechar: [] }>()

const ta = computed(() => props.t.ativar)
const toast = useToast()
const pedido = ref(false)

const administradores = 'Renata Albuquerque, Otávio Nunes'

function pedirAtivacao() {
  pedido.value = true
  toast.add({ title: ta.value.pedido, icon: 'i-lucide-bell-ring', color: 'success', duration: 4000 })
}
</script>

<template>
  <div
    role="dialog"
    :aria-label="ta.membroTitulo"
    class="overflow-hidden rounded-xl border border-default bg-default shadow-xl ring-1 ring-primary/15"
    @keydown.esc.stop.prevent="emit('fechar')"
  >
    <div class="flex flex-col gap-3 p-4">
      <div class="flex items-start gap-3">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-elevated ring-1 ring-default">
          <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
        </span>
        <div class="min-w-0">
          <p class="text-sm font-semibold text-highlighted">{{ ta.membroTitulo }}</p>
          <p class="text-sm text-muted">{{ ta.membroTexto }}</p>
          <p class="mt-1.5 flex items-center gap-1.5 text-xs text-dimmed"><UIcon name="i-lucide-shield-check" class="size-3.5" />{{ ta.quemAdministra(administradores) }}</p>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-end gap-2">
        <UButton :label="ta.fechar" color="neutral" variant="ghost" size="sm" @click="emit('fechar')" />
        <UButton
          :label="pedido ? ta.pedidoFeito : ta.pedir"
          :icon="pedido ? 'i-lucide-check' : 'i-lucide-bell-ring'"
          size="sm"
          :disabled="pedido"
          autofocus
          @click="pedirAtivacao"
        />
      </div>
    </div>

    <div class="flex items-center gap-1.5 border-t border-default bg-elevated/50 px-4 py-2 text-xs text-muted">
      <UIcon name="i-lucide-lock" class="size-3.5" />{{ ta.privacidade }}
    </div>
  </div>
</template>
