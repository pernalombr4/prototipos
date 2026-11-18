<script setup lang="ts">
/**
 * Links de assinatura, por participante.
 *
 * PROPOSTA:
 * - C52: na Certisign, os links que o pedido já guarda aparecem também no envelope que veio do fluxo da categoria;
 * - M31: quem está na fila não tem link e diz por quê ("Ainda não está na vez", texto que a branch já tem);
 * - o aviso de segurança aparece 1 vez, no topo.
 */
import type { Envelope } from './mocks'
import { provedorPorId } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, envelope: Envelope }>()
const aberto = defineModel<boolean>('open', { default: false })
const l = computed(() => props.t.envelope.links)
const p = computed(() => provedorPorId.get(props.envelope.provider)!)
const linkDe = (id: number) => props.envelope.participantes.find(x => x.id === id)?.link ?? `https://${p.value.portal}/assinar/${props.envelope.id}-${id}`
const copiado = ref<number | null>(null)
function copiar(id: number) {
  copiado.value = id
  setTimeout(() => (copiado.value = null), 1500)
}
</script>

<template>
  <UModal v-model:open="aberto" :title="l.titulo" :description="l.texto(p.nome)" :ui="{ content: 'max-w-xl' }">
    <template #body>
      <div class="space-y-3">
        <UAlert icon="i-lucide-shield-alert" color="warning" variant="subtle" :description="l.aviso" />
        <ul class="divide-y divide-default rounded-md border border-default">
          <li v-for="pa in envelope.participantes" :key="pa.id" class="flex items-center gap-3 px-3 py-2.5">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-highlighted">{{ pa.nome }} <span class="font-normal text-muted">· {{ t.papeis[pa.papel] }}</span></p>
              <p v-if="['sent', 'opened', 'pending'].includes(pa.status)" class="truncate font-mono text-xs text-muted">{{ linkDe(pa.id) }}</p>
              <p v-else class="text-xs text-muted">{{ l.semLink[pa.status] ?? t.statusParticipante[pa.status] }}</p>
            </div>
            <UButton
              v-if="['sent', 'opened', 'pending'].includes(pa.status)"
              :icon="copiado === pa.id ? 'i-lucide-check' : 'i-lucide-copy'"
              :label="copiado === pa.id ? t.geral.copiado : t.geral.copiar"
              color="neutral"
              variant="outline"
              size="xs"
              @click="copiar(pa.id)"
            />
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-between gap-2">
        <UButton :label="l.gerar" icon="i-lucide-refresh-cw" color="neutral" variant="ghost" />
        <UButton :label="t.geral.fechar" color="neutral" variant="outline" @click="aberto = false" />
      </div>
    </template>
  </UModal>
</template>
