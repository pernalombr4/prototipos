<script setup lang="ts">
/**
 * PROPOSTA. Os 3 atalhos de contato (E-mail, WhatsApp, SMS), iguais em toda
 * tela. Canal sem dado fica desabilitado e diz por quê; canal que o
 * administrador desligou não aparece.
 *
 * Com o "E-mail do ENSPACE" ligado, o E-mail vira 2 caminhos: escrever pelo
 * ENSPACE (fica no histórico do item) ou abrir o app de e-mail da pessoa.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { ItemDoProtótipo } from './mocks'
import type { Textos } from './textos'
import type { Lugar, Rascunho } from './estado'
import { type Destino, ICONE_DO_CANAL, useAtalhos } from './atalhos'

const props = withDefaults(defineProps<{
  t: Textos
  destino: Destino | null
  lugar: Lugar
  item?: ItemDoProtótipo | null
  /** Sobrescreve o texto inicial (ex.: o link de um formulário). */
  assunto?: string
  mensagem?: string
  variante?: 'botoes' | 'icones'
  tamanho?: 'xs' | 'sm' | 'md'
  /** Mostra a escolha ENSPACE ou app no E-mail. Desligado em atalho sem item. */
  permitirEnspace?: boolean
  origem?: Rascunho['origem']
  /** Atalho sem destinatário: o app abre e a pessoa escolhe para quem (link de formulário). */
  semDestinatario?: boolean
  /** Corpo que o compositor do ENSPACE já abre preenchido. */
  corpoEnspace?: string
  /** Os botões dividem a largura em partes iguais (cartão estreito). */
  bloco?: boolean
}>(), {
  item: null,
  variante: 'botoes',
  tamanho: 'sm',
  permitirEnspace: true,
  origem: 'item',
})

const { canaisEm, motivo: motivoDoCanal, abrir, escreverNoEnspace, vaiComCopia, config } = useAtalhos()

function motivo(c: 'email' | 'whatsapp' | 'sms', d: Destino | null) {
  return props.semDestinatario ? null : motivoDoCanal(c, d)
}

const canais = computed(() => canaisEm(props.lugar))
const comEnspace = computed(() => props.permitirEnspace && config.value.emailDoEnspace)

const opcoes = computed(() => ({ item: props.item, assunto: props.assunto, mensagem: props.mensagem }))

function escreverAqui() {
  escreverNoEnspace(props.destino, props.item, props.origem, {
    ...(props.assunto ? { assunto: props.assunto } : {}),
    ...(props.corpoEnspace ? { corpo: props.corpoEnspace } : {}),
  })
}

const opcaoDoApp = computed<DropdownMenuItem>(() => ({
  label: props.t.atalho.abrirNoApp,
  // Com Cc, a resposta só volta ao item se a pessoa responder a todos: o aviso diz isso.
  description: vaiComCopia(props.item) ? props.t.atalho.abrirNoAppComCopia : props.t.atalho.abrirNoAppDica,
  icon: 'i-lucide-external-link',
  // O tema corta a descrição numa linha; o aviso do Cc precisa ser lido inteiro.
  ui: { itemDescription: 'whitespace-normal' },
  onSelect: () => abrir('email', props.destino, opcoes.value),
}))

/** Na coluna de ícones não cabe o botão dividido: os 2 caminhos vão num menu só. */
const menuDeEmail = computed<DropdownMenuItem[]>(() => [
  {
    label: props.t.atalho.escreverNoEnspace,
    description: props.item ? props.t.atalho.escreverNoEnspaceComItem(props.item.reference) : props.t.atalho.escreverNoEnspaceSemItem,
    icon: 'i-lucide-send',
    ui: { itemDescription: 'whitespace-normal' },
    onSelect: escreverAqui,
  },
  opcaoDoApp.value,
])

function rotulo(c: 'email' | 'whatsapp' | 'sms') {
  return props.t.atalho.canal[c]
}
</script>

<template>
  <div
    v-if="canais.length"
    :class="bloco ? 'flex gap-1.5' : ['flex flex-wrap items-center', variante === 'icones' ? 'gap-1' : 'gap-2']"
  >
    <template v-for="c in canais" :key="c">
      <!--
        E-mail com 2 caminhos, em botão dividido (FieldGroupDropdownExample do
        Nuxt UI): o clique no corpo escreve pelo ENSPACE, a seta abre o app.
      -->
      <UFieldGroup
        v-if="c === 'email' && comEnspace && !motivo(c, destino) && variante === 'botoes'"
        :size="tamanho"
        :class="bloco ? 'flex flex-auto' : ''"
      >
        <UTooltip :text="item ? t.atalho.escreverNoEnspaceComItem(item.reference) : t.atalho.escreverNoEnspaceSemItem">
          <UButton
            :icon="ICONE_DO_CANAL[c]"
            :label="rotulo(c)"
            color="neutral"
            variant="outline"
            :class="bloco ? 'flex-auto justify-center' : ''"
            @click="escreverAqui"
          />
        </UTooltip>
        <UDropdownMenu :items="[opcaoDoApp]" :content="{ align: 'end' }" :ui="{ content: 'w-64' }">
          <UButton
            icon="i-lucide-chevron-down"
            color="neutral"
            variant="outline"
            :aria-label="t.atalho.outrasFormasDeEmail"
          />
        </UDropdownMenu>
      </UFieldGroup>

      <UTooltip
        v-else-if="c === 'email' && comEnspace && !motivo(c, destino)"
        :text="rotulo(c)"
      >
        <UDropdownMenu :items="menuDeEmail" :content="{ align: 'start' }" :ui="{ content: 'w-72' }">
          <UButton
            :icon="ICONE_DO_CANAL[c]"
            color="neutral"
            variant="outline"
            :size="tamanho"
            :aria-label="rotulo(c)"
            class="transition-transform hover:-translate-y-0.5"
          />
        </UDropdownMenu>
      </UTooltip>

      <!--
        Canal sem dado: aria-disabled, não disabled. O botão continua no Tab e o
        motivo aparece no foco e no hover (achado da revisão de acessibilidade).
      -->
      <UTooltip v-else :text="motivo(c, destino) ?? (variante === 'icones' ? rotulo(c) : '')" :disabled="!motivo(c, destino) && variante !== 'icones'">
        <UButton
          :icon="ICONE_DO_CANAL[c]"
          :label="variante === 'botoes' ? rotulo(c) : undefined"
          color="neutral"
          variant="outline"
          :size="tamanho"
          :block="bloco"
          :aria-disabled="motivo(c, destino) ? 'true' : undefined"
          :aria-label="motivo(c, destino) ? `${rotulo(c)}: ${motivo(c, destino)}` : rotulo(c)"
          class="transition-transform"
          :class="[
            motivo(c, destino) ? 'cursor-not-allowed opacity-50' : 'hover:-translate-y-0.5',
            bloco ? 'flex-auto' : '',
          ]"
          :ui="c === 'whatsapp' && !motivo(c, destino) ? { leadingIcon: 'text-success' } : undefined"
          @click="!motivo(c, destino) && abrir(c, destino, opcoes)"
        />
      </UTooltip>
    </template>
  </div>
</template>
