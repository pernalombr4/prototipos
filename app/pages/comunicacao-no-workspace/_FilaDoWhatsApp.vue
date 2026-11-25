<script setup lang="ts">
/**
 * PROPOSTA. O WhatsApp para várias pessoas de uma vez (responsáveis das
 * tarefas selecionadas, lembrete da Agenda para todos). O `wa.me` abre 1 número
 * por vez e o navegador bloqueia várias abas abertas de uma vez, então vira
 * uma fila, como o "Call next lead" do Close e o discador do Apollo:
 *  - antes de começar, quem fica de fora por falta de telefone válido;
 *  - "Conversa 1 de N", com a barra de progresso, "Abrir conversa" e "Próxima";
 *  - no fim, "Todas as conversas foram abertas."
 * Volta da rodada 5 (saiu na 6, voltou na 10).
 */
import type { Textos } from './textos'
import { type PessoaDaFila, useWhatsApp } from './atalhos'

const props = defineProps<{
  t: Textos
  pessoas: PessoaDaFila[]
}>()

const aberto = defineModel<boolean>('open', { default: false })

const { motivoDoWhatsApp, abrirConversa } = useWhatsApp()

const naFila = computed(() => props.pessoas.filter(p => !motivoDoWhatsApp(p)))
const fora = computed(() => props.pessoas.filter(p => motivoDoWhatsApp(p)))
const indice = ref(0)
const abertaAtual = ref(false)
const atual = computed(() => naFila.value[indice.value] ?? null)

watch(aberto, (v) => {
  if (!v) return
  indice.value = 0
  abertaAtual.value = false
})

function abrirAtual() {
  const p = atual.value
  if (!p) return
  abrirConversa(p, { texto: p.texto })
  abertaAtual.value = true
}

function proxima() {
  indice.value++
  abertaAtual.value = false
}

function iniciais(s: string) {
  return s.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join('')
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.whatsapp.filaTitulo" :description="t.whatsapp.filaDescricao">
    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          v-if="fora.length"
          icon="i-lucide-user-x"
          color="warning"
          variant="subtle"
          :description="t.whatsapp.foraSemTelefone(fora.map(p => p.nome).join(', '))"
        />

        <template v-if="atual">
          <p class="text-sm font-medium text-highlighted">
            {{ t.whatsapp.progresso(indice + 1, naFila.length) }}
          </p>
          <UProgress :model-value="indice + (abertaAtual ? 1 : 0)" :max="naFila.length" size="sm" />
          <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="translate-x-2 opacity-0">
            <div :key="atual.id" class="flex items-center gap-3 rounded-lg border border-default p-3">
              <UAvatar :text="iniciais(atual.nome)" size="md" />
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-highlighted">{{ atual.nome }}</span>
                <span class="block truncate text-xs text-muted">{{ atual.telefone }}</span>
              </span>
              <UButton
                :icon="abertaAtual ? 'i-lucide-check' : 'i-simple-icons-whatsapp'"
                :label="abertaAtual ? t.whatsapp.aberta : t.whatsapp.abrirConversa"
                :color="abertaAtual ? 'success' : 'primary'"
                :variant="abertaAtual ? 'soft' : 'solid'"
                size="sm"
                @click="abrirAtual"
              />
            </div>
          </Transition>
          <div class="flex justify-end">
            <UButton
              v-if="indice < naFila.length - 1"
              :label="t.whatsapp.proxima"
              trailing-icon="i-lucide-arrow-right"
              color="neutral"
              :variant="abertaAtual ? 'solid' : 'outline'"
              @click="proxima"
            />
            <span v-else class="flex items-center gap-3">
              <span v-if="abertaAtual" class="text-sm text-success">{{ t.whatsapp.concluido }}</span>
              <UButton :label="t.whatsapp.fechar" color="neutral" :variant="abertaAtual ? 'solid' : 'outline'" @click="aberto = false" />
            </span>
          </div>
        </template>
        <UEmpty v-else variant="naked" icon="i-lucide-phone-off" :title="t.whatsapp.ninguem" size="sm" />
      </div>
    </template>
  </UModal>
</template>
