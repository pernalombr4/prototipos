<script setup lang="ts">
/**
 * PROPOSTA (rodada 12). Os 2 widgets de comunicação na tela inicial: E-mail e
 * WhatsApp e SMS. Os requisitos estão na Home nova (protótipo `home`, épico
 * "Widgets de itens, agenda, atalhos e comunicação na Home", parte 5), onde os
 * 2 são widgets do grupo Comunicação. Aqui eles aparecem na tela inicial de
 * hoje para quem revisa ver o compositor e o painel "Enviar SMS" abrindo de
 * verdade.
 *
 * A rodada 5 tirou a fileira de atalhos da tela inicial porque ali não havia
 * destinatário nem item. Agora cada cartão tem o próprio destino:
 * - E-mail: os e-mails que a pessoa enviou de um item (a aba Mensagens com
 *   "Enviado por" igual à pessoa) e "Novo e-mail", que abre o compositor sem
 *   item, como o botão do topo numa tela sem item;
 * - WhatsApp e SMS: a pessoa digita o número. Sem número, o WhatsApp abre a
 *   escolha da conversa e o SMS abre o painel sem destinatário, como o link de
 *   formulário público já faz.
 *
 * Componentes: `UCard`, `UFormField`, `UInput`, `UTextarea`, `UButton`,
 * `UTooltip`, `UIcon` (MCP nuxt-ui).
 */
import type { Textos } from './textos'
import { EU, itemPorId } from './mocks'
import { ehTelefoneFixo, numeroDoWhatsApp, useComunicacao, useMarcaDeProposta } from './estado'
import { useSms, useWhatsApp } from './atalhos'

const props = defineProps<{ t: Textos }>()

const { emails, ir, abrirCompositor } = useComunicacao()
const { abrirConversa } = useWhatsApp()
const { abrirPainel } = useSms()
const marca = useMarcaDeProposta()
const idioma = useIdioma()

/* E-mail */
const enviados = computed(() => emails.value
  .filter(e => e.direcao === 'enviado' && e.autor === EU.id && e.itemId && !e.sistema)
  .sort((a, b) => +b.data - +a.data)
  .slice(0, 5))

const formato = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: 'short' }))
const quando = (d: Date) => formato.value.format(d)

/* WhatsApp e SMS */
const numero = ref('')
const mensagem = ref('')
const temDigito = computed(() => /\d/.test(numero.value))
const valido = computed(() => !!numeroDoWhatsApp(numero.value))
const invalido = computed(() => temDigito.value && !valido.value)
const fixo = computed(() => valido.value && ehTelefoneFixo(numero.value))
const motivoDoWhatsApp = computed(() => invalido.value ? props.t.inicioW.numeroInvalido : null)
const motivoDoSms = computed(() => motivoDoWhatsApp.value ?? (fixo.value ? props.t.inicioW.telefoneFixo : null))
const ajuda = computed(() => {
  if (invalido.value) return undefined
  if (fixo.value) return props.t.inicioW.telefoneFixo
  return temDigito.value ? undefined : props.t.inicioW.semNumero
})
const destino = computed(() => valido.value ? { nome: null, telefone: numero.value } : null)

function whatsapp() {
  if (motivoDoWhatsApp.value) return
  abrirConversa(destino.value, { texto: mensagem.value })
}

function sms() {
  if (motivoDoSms.value) return
  abrirPainel(destino.value, { texto: mensagem.value })
}
</script>

<template>
  <div class="mt-6 grid gap-5 lg:grid-cols-2" :class="marca">
    <!-- E-mail -->
    <UCard class="animate-[entrada_.35s_ease-out_both]" :ui="{ body: 'flex flex-col gap-3' }">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-mail" class="size-4 text-highlighted" />
          <h2 class="text-lg font-semibold text-highlighted">
            {{ t.inicioW.tituloEmail }}
          </h2>
          <UTooltip :text="t.inicioW.abrirEmails">
            <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="xs" class="ml-auto" :aria-label="t.inicioW.abrirEmails" @click="ir('emails', { central: 'mensagens' })" />
          </UTooltip>
        </div>
      </template>

      <ul v-if="enviados.length" class="flex flex-col gap-2">
        <li v-for="e in enviados" :key="e.id">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-lg border border-default px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-accented hover:shadow-sm focus-visible:outline-2 focus-visible:outline-primary motion-reduce:transition-none"
            @click="ir('emails', { central: 'mensagens' })"
          >
            <UIcon name="i-lucide-mail-check" class="size-4 shrink-0 text-muted" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-highlighted">{{ e.assunto }}</span>
              <span class="block truncate text-xs text-muted">{{ t.inicioW.para(e.para[0] ?? '') }} · {{ itemPorId(e.itemId)?.reference }}</span>
            </span>
            <span class="shrink-0 text-xs text-muted">{{ quando(e.data) }}</span>
          </button>
        </li>
      </ul>
      <p v-else class="py-4 text-center text-sm text-muted">
        {{ t.inicioW.vazioEmail }}
      </p>
      <UButton
        :label="t.inicioW.novoEmail"
        icon="i-lucide-mail-plus"
        class="self-start transition-transform hover:-translate-y-0.5"
        @click="abrirCompositor({ origem: 'inicio' })"
      />
    </UCard>

    <!-- WhatsApp e SMS -->
    <UCard class="animate-[entrada_.35s_ease-out_both] [animation-delay:60ms]">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-message-circle" class="size-4 text-highlighted" />
          <h2 class="text-lg font-semibold text-highlighted">
            {{ t.inicioW.tituloWhatsApp }}
          </h2>
        </div>
      </template>

      <form class="flex flex-col gap-3" @submit.prevent="whatsapp">
        <UFormField :label="t.inicioW.numero" :error="invalido ? t.inicioW.numeroInvalido : undefined" :help="ajuda">
          <UInput v-model="numero" type="tel" inputmode="tel" autocomplete="off" icon="i-lucide-phone" :placeholder="t.inicioW.numeroPlaceholder" class="w-full" />
        </UFormField>
        <UFormField :label="t.inicioW.mensagem">
          <UTextarea v-model="mensagem" :rows="2" :maxrows="4" autoresize :placeholder="t.inicioW.mensagemPlaceholder" class="w-full" />
        </UFormField>
        <div class="flex flex-wrap items-center gap-2">
          <UTooltip :text="motivoDoWhatsApp ?? t.inicioW.naoRegistra">
            <UButton
              type="submit"
              :label="t.whatsapp.rotulo"
              icon="i-simple-icons-whatsapp"
              color="neutral"
              variant="outline"
              :aria-disabled="motivoDoWhatsApp ? 'true' : undefined"
              :aria-label="motivoDoWhatsApp ? `${t.whatsapp.rotulo}: ${motivoDoWhatsApp}` : undefined"
              :class="motivoDoWhatsApp ? 'cursor-not-allowed opacity-50' : 'transition-transform hover:-translate-y-0.5'"
            />
          </UTooltip>
          <UTooltip :text="motivoDoSms ?? t.inicioW.naoRegistra">
            <UButton
              :label="t.sms.rotulo"
              icon="i-lucide-message-square-text"
              color="neutral"
              variant="outline"
              :aria-disabled="motivoDoSms ? 'true' : undefined"
              :aria-label="motivoDoSms ? `${t.sms.rotulo}: ${motivoDoSms}` : undefined"
              :class="motivoDoSms ? 'cursor-not-allowed opacity-50' : 'transition-transform hover:-translate-y-0.5'"
              @click="sms"
            />
          </UTooltip>
        </div>
        <p class="text-xs text-muted">
          {{ t.inicioW.naoRegistra }}
        </p>
      </form>
    </UCard>

    <p class="text-xs text-dimmed lg:col-span-2">
      {{ t.inicioW.daHomeNova }}
    </p>
  </div>
</template>
