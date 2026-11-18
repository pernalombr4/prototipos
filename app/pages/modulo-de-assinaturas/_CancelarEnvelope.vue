<script setup lang="ts">
/**
 * A janela de cancelar o envelope.
 *
 * PROPOSTA:
 * - M35: o envelope que veio de um fluxo diz o efeito no fluxo ("A etapa X do fluxo Y vai para erro") e pede o motivo,
 *   que vai para o painel da execução e para a tarefa;
 * - M34: na Certisign, que não cancela pela API, a janela diz que o documento continua no portal e leva a ele. O
 *   envelope avulso da Certisign nem abre esta janela: o botão fica desligado, com a explicação;
 * - o texto diz a consequência 1 vez. Hoje o "cancela só no ENSPACE" aparece aqui e em mais 4 lugares.
 */
import type { Envelope } from './mocks'
import { fluxoPorId, provedorPorId } from './mocks'
import { cancelar, tem } from './estado'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, envelope: Envelope }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ cancelado: [] }>()
const toast = useToast()

const c = computed(() => props.t.envelope.cancelar)
const p = computed(() => provedorPorId.get(props.envelope.provider)!)
const doFluxo = computed(() => props.envelope.origem.tipo !== 'standalone')
const efeito = computed(() => {
  const o = props.envelope.origem
  if (o.tipo === 'workflow') { const f = fluxoPorId.get(o.fluxo)!; return c.value.efeitoFluxo(f.etapa, f.nome) }
  if (o.tipo === 'c-flow') return c.value.efeitoTarefa(o.tarefa, o.item)
  return ''
})
const soNoEnspace = computed(() => !tem(props.envelope, 'cancela'))

const motivo = ref('')
const tentou = ref(false)
const cancelando = ref(false)
watch(aberto, (v) => { if (v) { motivo.value = ''; tentou.value = false } })

async function confirmar() {
  tentou.value = true
  if (doFluxo.value && !motivo.value.trim()) return
  cancelando.value = true
  await new Promise(r => setTimeout(r, 700))
  cancelando.value = false
  cancelar(props.envelope.id, motivo.value.trim())
  aberto.value = false
  toast.add({ title: c.value.sucesso, icon: 'i-lucide-ban', color: 'neutral' })
  emit('cancelado')
}
</script>

<template>
  <UModal v-model:open="aberto" :title="c.titulo" :description="c.texto">
    <template #body>
      <div class="space-y-4">
        <UAlert v-if="doFluxo" icon="i-lucide-workflow" color="warning" variant="subtle" :title="efeito" />
        <UAlert v-if="soNoEnspace" icon="i-lucide-triangle-alert" color="neutral" variant="outline" :description="c.certisign(p.nome)">
          <template #actions>
            <UButton :label="t.envelope.acoes.abrirPortal(p.nome)" trailing-icon="i-lucide-external-link" color="neutral" variant="outline" size="xs" />
          </template>
        </UAlert>
        <UFormField :label="c.motivo" :required="doFluxo" :error="tentou && doFluxo && !motivo.trim() ? c.motivoObrigatorio : undefined">
          <UTextarea v-model="motivo" :placeholder="doFluxo ? c.motivoPhFluxo : c.motivoPh" :rows="3" autoresize class="w-full" />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="c.voltar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="c.confirmar" color="error" :loading="cancelando" @click="confirmar" />
      </div>
    </template>
  </UModal>
</template>
