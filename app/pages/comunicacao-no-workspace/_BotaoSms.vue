<script setup lang="ts">
/**
 * PROPOSTA. O botão de SMS, igual em toda tela e ao lado do WhatsApp (rodada
 * 11). Abre o painel "Enviar SMS" (`_PainelDoSms.vue`) com o telefone do
 * destino e o texto pronto, o mesmo do WhatsApp. Sem telefone, ou com telefone
 * curto, fica indisponível e diz por quê, como o do WhatsApp.
 */
import type { ItemDoProtótipo } from './mocks'
import type { Textos } from './textos'
import { type DestinoDoWhatsApp, useSms } from './atalhos'

const props = withDefaults(defineProps<{
  t: Textos
  destino: DestinoDoWhatsApp | null
  item?: ItemDoProtótipo | null
  /** Texto pronto. Sem ele, o texto da categoria do item. */
  texto?: string
  /** `botao`: ícone e rótulo. `icone`: só o ícone. */
  variante?: 'botao' | 'icone'
  tamanho?: 'xs' | 'sm' | 'md'
  /** O botão ocupa a largura toda (cartão estreito). */
  bloco?: boolean
  rotulo?: string
}>(), {
  item: null,
  variante: 'botao',
  tamanho: 'sm',
})

const { motivoDoSms, abrirPainel } = useSms()

const motivo = computed(() => motivoDoSms(props.destino))
const nome = computed(() => props.rotulo ?? props.t.sms.rotulo)
const dica = computed(() => motivo.value ?? props.t.sms.dica)

function abrir() {
  if (motivo.value) return
  abrirPainel(props.destino, { item: props.item, texto: props.texto })
}
</script>

<template>
  <!-- Raiz real: o UTooltip não gera elemento, e a classe de quem usa (a marca da proposta) precisa de onde cair. -->
  <span :class="bloco ? 'flex w-full' : 'inline-flex'">
    <UTooltip :text="variante === 'icone' ? (motivo ?? nome) : dica">
      <UButton
        icon="i-lucide-message-square-text"
        :label="variante === 'icone' ? undefined : nome"
        color="neutral"
        :variant="variante === 'icone' ? 'ghost' : 'outline'"
        :size="tamanho"
        :block="bloco"
        :aria-disabled="motivo ? 'true' : undefined"
        :aria-label="motivo ? `${nome}: ${motivo}` : (variante === 'icone' ? nome : undefined)"
        :class="motivo ? 'cursor-not-allowed opacity-50' : 'transition-transform hover:-translate-y-0.5'"
        @click.stop="abrir"
      />
    </UTooltip>
  </span>
</template>
