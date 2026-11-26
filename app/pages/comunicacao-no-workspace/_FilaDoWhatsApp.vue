<script setup lang="ts">
/**
 * PROPOSTA. O WhatsApp para várias pessoas de uma vez (responsáveis das
 * tarefas selecionadas, lembrete da Agenda para todos). O `wa.me` abre 1 número
 * por vez e o navegador bloqueia várias abas abertas de uma vez, então vira
 * uma fila, como o "Call next lead" do Close e o discador do Apollo:
 *  - antes de começar, quem fica de fora por falta de telefone válido;
 *  - "Conversa 1 de N", com a barra de progresso, "Abrir conversa" e "Próxima";
 *  - no fim, "Todas as conversas foram abertas."
 * Volta da rodada 5 (saiu na 6, voltou na 10). Na rodada 11 serve também ao
 * SMS (`canal="sms"`): o link `sms:` também abre 1 número por vez; "Abrir SMS"
 * abre o app de SMS, e os 2 botões de copiar atendem quem envia pelo Vincular
 * ao Celular do Windows.
 */
import type { Textos } from './textos'
import { type PessoaDaFila, useSms, useWhatsApp } from './atalhos'
import { telefoneLegivel } from './estado'

const props = withDefaults(defineProps<{
  t: Textos
  pessoas: PessoaDaFila[]
  canal?: 'whatsapp' | 'sms'
}>(), { canal: 'whatsapp' })

const aberto = defineModel<boolean>('open', { default: false })

const { motivoDoWhatsApp, abrirNoSeuWhatsApp } = useWhatsApp()
const { abrirNoApp, motivoDoSms } = useSms()
const toast = useToast()
const sms = computed(() => props.canal === 'sms')

// O SMS também deixa de fora o telefone fixo, que não recebe SMS.
const motivo = (p: PessoaDaFila) => sms.value ? motivoDoSms(p) : motivoDoWhatsApp(p)
const naFila = computed(() => props.pessoas.filter(p => !motivo(p)))
const fora = computed(() => props.pessoas.filter(p => motivo(p)))
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
  if (sms.value) abrirNoApp({ nome: p.nome, telefone: p.telefone, texto: p.texto, itemId: null })
  // Rodada 17: a fila abre o WhatsApp da pessoa mesmo com a Twilio; o lote pelo workspace é o nó Enviar WhatsApp.
  else abrirNoSeuWhatsApp(p, { texto: p.texto })
  abertaAtual.value = true
}

async function copiar(valor: string, titulo: string) {
  try {
    await navigator.clipboard.writeText(valor)
  }
  catch {
    // Sem permissão de área de transferência: o aviso continua valendo no protótipo.
  }
  toast.add({ title: titulo, icon: 'i-lucide-check', color: 'success', duration: 2500 })
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
  <UModal v-model:open="aberto" :title="sms ? t.sms.filaTitulo : t.whatsapp.filaTitulo" :description="sms ? t.sms.filaDescricao : t.whatsapp.filaDescricao">
    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          v-if="fora.length"
          icon="i-lucide-user-x"
          color="warning"
          variant="subtle"
          :description="(sms ? t.sms.foraSemCelular : t.whatsapp.foraSemTelefone)(fora.map(p => p.nome).join(', '))"
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
                <span class="block truncate text-xs text-muted">{{ sms ? telefoneLegivel(atual.telefone) : atual.telefone }}</span>
              </span>
              <template v-if="sms">
                <UTooltip :text="t.sms.copiarNumero">
                  <UButton icon="i-lucide-phone" color="neutral" variant="ghost" size="sm" :aria-label="t.sms.copiarNumero" @click="copiar(telefoneLegivel(atual.telefone), t.sms.numeroCopiado)" />
                </UTooltip>
                <UTooltip :text="t.sms.copiarTexto">
                  <UButton icon="i-lucide-copy" color="neutral" variant="ghost" size="sm" :aria-label="t.sms.copiarTexto" @click="copiar(atual.texto, t.sms.textoCopiado)" />
                </UTooltip>
              </template>
              <UButton
                :icon="abertaAtual ? 'i-lucide-check' : (sms ? 'i-lucide-message-square-text' : 'i-simple-icons-whatsapp')"
                :label="abertaAtual ? t.whatsapp.aberta : (sms ? t.sms.abrirSms : t.whatsapp.abrirConversa)"
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
