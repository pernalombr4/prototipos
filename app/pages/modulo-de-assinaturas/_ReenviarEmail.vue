<script setup lang="ts">
/**
 * PROPOSTA (M23): Reenviar e-mail pede confirmação e diz quem recebe. Hoje o clique reenvia na hora, sem dizer a quem.
 * Recebe só quem está na vez; quem está na fila recebe quando chegar a vez (M31).
 */
import type { Envelope } from './mocks'
import { provedorPorId } from './mocks'
import { naFila, quemEstaNaVez, reenviar } from './estado'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, envelope: Envelope }>()
const aberto = defineModel<boolean>('open', { default: false })
const toast = useToast()

const r = computed(() => props.t.envelope.reenviar)
const p = computed(() => provedorPorId.get(props.envelope.provider)!)
const vez = computed(() => quemEstaNaVez(props.envelope))
const fila = computed(() => naFila(props.envelope).length)
const enviando = ref(false)

async function confirmar() {
  enviando.value = true
  await new Promise(res => setTimeout(res, 700))
  enviando.value = false
  const n = reenviar(props.envelope.id)
  aberto.value = false
  toast.add({ title: r.value.sucesso(n), icon: 'i-lucide-mail-check', color: 'success' })
}
</script>

<template>
  <UModal v-model:open="aberto" :title="r.titulo" :description="r.texto(p.nome)">
    <template #body>
      <ul class="divide-y divide-default rounded-md border border-default">
        <li v-for="pa in vez" :key="pa.id" class="flex items-center gap-3 px-3 py-2.5">
          <UAvatar :text="pa.nome.split(' ').map(x => x[0]).slice(0, 2).join('')" size="sm" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-highlighted">{{ pa.nome }}</p>
            <p class="truncate text-xs text-muted">{{ pa.email }}</p>
          </div>
          <UBadge :label="t.papeis[pa.papel]" color="neutral" variant="outline" size="sm" />
        </li>
      </ul>
      <p v-if="fila" class="mt-3 flex items-center gap-1.5 text-sm text-muted">
        <UIcon name="i-lucide-list-ordered" class="size-4 shrink-0" />{{ r.naFila(fila) }}
      </p>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.geral.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="r.confirmar" icon="i-lucide-send" :loading="enviando" @click="confirmar" />
      </div>
    </template>
  </UModal>
</template>
