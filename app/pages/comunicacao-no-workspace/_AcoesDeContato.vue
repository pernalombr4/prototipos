<script setup lang="ts">
/**
 * PROPOSTA. O botão de e-mail, igual em toda tela. Sem e-mail no destino, fica
 * indisponível e diz por quê. Com o módulo "Atalhos de comunicação" desligado,
 * não aparece.
 *
 * 2 caminhos: escrever pelo ENSPACE (fica na Mail Box do item) ou abrir o app
 * de e-mail da pessoa. Sem por onde enviar pelo ENSPACE (Fase 1 sem Outlook
 * integrado), o botão abre o app direto.
 */
import type { ItemDoProtótipo } from './mocks'
import type { Textos } from './textos'
import { type Rascunho, useComunicacao } from './estado'
import { type Destino, useAtalhos } from './atalhos'

const props = withDefaults(defineProps<{
  t: Textos
  destino: Destino | null
  item?: ItemDoProtótipo | null
  /** Sobrescreve o assunto da categoria (ex.: o link de um formulário). */
  assunto?: string
  /** Texto do corpo, sem HTML. */
  corpo?: string
  /** Vários destinatários de uma vez. */
  varios?: Destino[]
  /** `botao`: E-mail com a seta das outras formas. `icone`: só o ícone, com menu. */
  variante?: 'botao' | 'icone'
  tamanho?: 'xs' | 'sm' | 'md'
  origem?: Rascunho['origem']
  tarefaId?: number | null
  /** Sem destinatário: o compositor abre e a pessoa escolhe para quem (link de formulário). */
  semDestinatario?: boolean
  /** O botão ocupa a largura toda (cartão estreito). */
  bloco?: boolean
  rotulo?: string
}>(), {
  item: null,
  variante: 'botao',
  tamanho: 'sm',
  origem: 'item',
  tarefaId: null,
})

const { ativos, motivo: motivoDoDestino, itensDeMenu, escreverNoEnspace, abrirNoApp } = useAtalhos()
const { podeEnviar } = useComunicacao()

const motivo = computed(() => {
  if (props.semDestinatario) return null
  if (props.varios) return props.varios.some(v => v.email) ? null : props.t.atalho.semEmail
  return motivoDoDestino(props.destino)
})

const opcoes = computed(() => ({
  item: props.item,
  assunto: props.assunto,
  corpo: props.corpo,
  varios: props.varios,
  semDestinatario: props.semDestinatario,
  origem: props.origem,
  tarefaId: props.tarefaId,
}))

const menu = computed(() => [itensDeMenu(props.destino, opcoes.value)])
const soOApp = computed(() => [itensDeMenu(props.destino, opcoes.value).filter(i => i.icon === 'i-lucide-external-link')])

function principal() {
  if (motivo.value) return
  if (podeEnviar.value) escreverNoEnspace(props.destino, opcoes.value)
  else abrirNoApp(props.destino, opcoes.value)
}

const dica = computed(() => motivo.value
  ?? (podeEnviar.value
    ? (props.item ? props.t.atalho.escreverNoEnspaceComItem(props.item.reference) : props.t.atalho.escreverNoEnspace)
    : props.t.atalho.abrirNoAppDica))
</script>

<template>
  <!-- Raiz real: o UTooltip não gera elemento, e a classe de quem usa (a marca da proposta) precisa de onde cair. -->
  <span v-if="ativos" :class="bloco ? 'flex w-full' : 'inline-flex'">
    <!-- Ícone: o menu com os 2 caminhos (coluna de tabela, campo, participante) -->
    <UTooltip v-if="variante === 'icone'" :text="motivo ?? (rotulo ?? t.atalho.email)">
      <UDropdownMenu v-if="!motivo" :items="menu" :content="{ align: 'end' }" :ui="{ content: 'w-72' }">
        <UButton
          icon="i-lucide-mail"
          color="neutral"
          variant="ghost"
          :size="tamanho"
          :aria-label="rotulo ?? t.atalho.email"
          class="transition-transform hover:-translate-y-0.5"
          @click.stop
        />
      </UDropdownMenu>
      <!-- Sem e-mail: aria-disabled, não disabled. O botão continua no Tab e o motivo aparece no foco. -->
      <UButton
        v-else
        icon="i-lucide-mail"
        color="neutral"
        variant="ghost"
        :size="tamanho"
        aria-disabled="true"
        :aria-label="`${rotulo ?? t.atalho.email}: ${motivo}`"
        class="cursor-not-allowed opacity-50"
        @click.stop
      />
    </UTooltip>

    <!--
      Botão dividido (FieldGroupDropdownExample do Nuxt UI): o corpo escreve pelo
      ENSPACE; a seta abre o app de e-mail.
    -->
    <UFieldGroup v-else-if="!motivo && podeEnviar" :size="tamanho" :class="bloco ? 'flex w-full' : ''">
      <UTooltip :text="dica">
        <UButton
          icon="i-lucide-mail"
          :label="rotulo ?? t.atalho.email"
          color="neutral"
          variant="outline"
          :class="bloco ? 'flex-auto justify-center' : ''"
          @click="principal"
        />
      </UTooltip>
      <UDropdownMenu :items="soOApp" :content="{ align: 'end' }" :ui="{ content: 'w-72' }">
        <UButton icon="i-lucide-chevron-down" color="neutral" variant="outline" :aria-label="t.atalho.outrasFormasDeEmail" />
      </UDropdownMenu>
    </UFieldGroup>

    <UTooltip v-else :text="dica">
      <UButton
        icon="i-lucide-mail"
        :label="rotulo ?? t.atalho.email"
        color="neutral"
        variant="outline"
        :size="tamanho"
        :block="bloco"
        :aria-disabled="motivo ? 'true' : undefined"
        :aria-label="motivo ? `${rotulo ?? t.atalho.email}: ${motivo}` : undefined"
        :class="motivo ? 'cursor-not-allowed opacity-50' : 'transition-transform hover:-translate-y-0.5'"
        @click="principal"
      />
    </UTooltip>
  </span>
</template>
