<script setup lang="ts">
/**
 * PROPOSTA (rodada 16). "Sua conta de envio" no topo da central: a conta do Outlook de quem está
 * vendo, num popover. Até a rodada 15, era o 1º bloco da aba Configurações da central; com a
 * configuração do workspace em Configurações › E-mails, a conta da pessoa fica junto da lista,
 * para todo perfil. No produto, "Integrar contas" abre Perfil › Integrações.
 */
import type { Textos } from './textos'
import { EU } from './mocks'
import { useComunicacao } from './estado'
import { useAppExterno } from './simulador'
import { textosDeCanais } from './textosDeCanais'

const props = defineProps<{ t: Textos }>()

const { outlookIntegrado } = useComunicacao()
const { abrirApp } = useAppExterno()
const tk = useTextos(textosDeCanais)
const c = computed(() => props.t.central.config)

function integrar() {
  abrirApp({ tipo: 'outlook', url: 'https://app.enspace.io/profile?tab=integrations' })
}
</script>

<template>
  <UPopover :content="{ align: 'end', sideOffset: 6 }">
    <UButton
      :label="tk.separacao.suaConta"
      icon="i-lucide-user-round"
      color="neutral"
      variant="ghost"
      :aria-label="`${tk.separacao.suaConta}: ${outlookIntegrado ? tk.separacao.suaContaConectada : tk.separacao.suaContaSem}`"
    >
      <template #trailing>
        <UIcon
          :name="outlookIntegrado ? 'i-lucide-circle-check' : 'i-lucide-circle-alert'"
          class="size-4"
          :class="outlookIntegrado ? 'text-success' : 'text-warning'"
        />
      </template>
    </UButton>

    <template #content>
      <div class="w-80 space-y-3 p-4">
        <div>
          <p class="text-sm font-semibold text-highlighted">
            {{ c.contaTitulo }}
          </p>
          <p class="mt-1 text-xs text-muted">
            {{ c.contaDescricao }}
          </p>
        </div>
        <USeparator />
        <div class="flex items-start gap-2 text-sm">
          <UIcon name="i-lucide-mail" class="mt-0.5 size-4 shrink-0 text-muted" />
          <div class="min-w-0">
            <p class="font-medium text-highlighted">
              {{ c.outlookTitulo }}
            </p>
            <p class="mt-0.5 flex items-start gap-1.5 text-xs" :class="outlookIntegrado ? 'text-default' : 'text-muted'">
              <UIcon
                :name="outlookIntegrado ? 'i-lucide-circle-check' : 'i-lucide-circle-alert'"
                class="mt-px size-3.5 shrink-0"
                :class="outlookIntegrado ? 'text-success' : 'text-warning'"
              />
              <span class="break-words">{{ outlookIntegrado ? c.contaConectada(EU.email ?? '') : c.contaSem }}</span>
            </p>
          </div>
        </div>
        <UButton
          :label="outlookIntegrado ? c.gerenciar : c.integrar"
          icon="i-lucide-plug"
          color="neutral"
          variant="outline"
          size="sm"
          block
          @click="integrar"
        />
      </div>
    </template>
  </UPopover>
</template>
