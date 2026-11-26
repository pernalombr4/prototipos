<script setup lang="ts">
/**
 * Os 2 widgets do grupo Comunicação (rodada 11), a pedido da redatora ("uma
 * das seções possíveis de widget lá deve ser de comunicação, e deve ter 2
 * widgets: email, whatsapp e sms. pra ficar na tela inicial esses botoes, nao
 * só o enviar email").
 *
 * Na rodada 5 do protótipo comunicacao-no-workspace, a fileira de atalhos da
 * tela inicial saiu porque ali não havia destinatário nem item ("vai pegar
 * link do que ali? vai ter email vinculado a que?"). Aqui cada widget resolve
 * isso:
 * - E-mail: a lista mostra os e-mails que a pessoa enviou de um item (a aba
 *   Mensagens da central E-mails com "Enviado por" = a pessoa), e "Novo
 *   e-mail" abre o compositor sem item, como o botão do topo faz numa tela sem
 *   item: o Outlook da pessoa no De, e o e-mail fica só no Outlook;
 * - WhatsApp e SMS: a pessoa digita o número. Sem número, o WhatsApp abre a
 *   escolha da conversa (`wa.me/?text=`) e o SMS abre o painel "Enviar SMS"
 *   sem destinatário, como o link de formulário público já faz. O número segue
 *   as regras das outras telas: menos de 10 dígitos é inválido, e o telefone
 *   fixo não recebe SMS.
 *
 * O compositor, a central E-mails e o painel "Enviar SMS" são do protótipo
 * comunicacao-no-workspace. Aqui o clique mostra o aviso de maquete com o que
 * abre no produto e o link exato.
 *
 * Componentes: `UScrollArea`, `UIcon`, `UButton`, `UFormField`, `UInput`,
 * `UTextarea`, `UTooltip` (MCP nuxt-ui).
 */
import type { EmailEnviado } from './mocks'
import type { Textos } from './textos'
import { ehTelefoneFixo, linkDeSms, linkDeWhatsApp, numeroDoTelefone, telefoneLegivel } from './formatar'

const props = defineProps<{
  t: Textos
  tipo: 'email' | 'whatsappSms'
  emails: EmailEnviado[]
}>()
const emit = defineEmits<{ abrir: [destino: string, link?: string] }>()

/* E-mail */
const recentes = computed(() => [...props.emails].sort((a, b) => a.ha - b.ha).slice(0, 5))

/* WhatsApp e SMS */
const numero = ref('')
const mensagem = ref('')
const temDigito = computed(() => /\d/.test(numero.value))
const valido = computed(() => !!numeroDoTelefone(numero.value))
const invalido = computed(() => temDigito.value && !valido.value)
const fixo = computed(() => valido.value && ehTelefoneFixo(numero.value))
const legivel = computed(() => valido.value ? telefoneLegivel(numero.value) : null)

const motivoDoWhatsApp = computed(() => invalido.value ? props.t.comunicacaoW.numeroInvalido : null)
const motivoDoSms = computed(() => motivoDoWhatsApp.value ?? (fixo.value ? props.t.comunicacaoW.telefoneFixo : null))

const ajuda = computed(() => {
  if (invalido.value) return undefined
  if (fixo.value) return props.t.comunicacaoW.telefoneFixo
  return temDigito.value ? undefined : props.t.comunicacaoW.semNumero
})

function abrirWhatsApp() {
  if (motivoDoWhatsApp.value) return
  emit('abrir', props.t.comunicacaoW.abreWhatsApp(legivel.value), linkDeWhatsApp(valido.value ? numero.value : null, mensagem.value || undefined))
}

function abrirSms() {
  if (motivoDoSms.value) return
  emit('abrir', props.t.comunicacaoW.abreSms(legivel.value), linkDeSms(valido.value ? numero.value : null, mensagem.value || undefined))
}
</script>

<template>
  <!-- E-mail -->
  <div v-if="tipo === 'email'" class="flex min-h-0 flex-1 flex-col pb-3">
    <UScrollArea class="min-h-0 flex-1">
      <ul v-if="recentes.length" class="px-2">
        <li v-for="(e, n) in recentes" :key="e.id" class="animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none" :style="{ animationDelay: `${n * 30}ms` }">
          <button
            type="button"
            class="group/linha flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
            @click="emit('abrir', t.comunicacaoW.emailNaCentral(e.assunto))"
          >
            <UIcon name="i-lucide-mail-check" class="size-4 shrink-0 text-muted group-hover/linha:text-primary" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm text-highlighted" :title="e.assunto">{{ e.assunto }}</span>
              <span class="block truncate text-xs text-muted" :title="`${t.comunicacaoW.para(e.para)} · ${e.item} · ${e.itemTitulo}`">{{ t.comunicacaoW.para(e.para) }} · {{ e.item }} · {{ e.itemTitulo }}</span>
            </span>
            <span class="shrink-0 text-xs tabular-nums text-muted">{{ t.comunicacaoW.ha(e.ha) }}</span>
          </button>
        </li>
      </ul>
      <p v-else class="px-4 py-8 text-center text-sm text-muted">
        {{ t.comunicacaoW.vazioEmail }}
      </p>
    </UScrollArea>
    <div class="mt-2 flex flex-wrap items-center gap-2 px-4">
      <UButton
        :label="t.comunicacaoW.novoEmail"
        icon="i-lucide-mail-plus"
        size="sm"
        class="transition-transform hover:-translate-y-0.5"
        @click="emit('abrir', t.comunicacaoW.compositor)"
      />
    </div>
  </div>

  <!-- WhatsApp e SMS -->
  <form v-else class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-3" @submit.prevent="abrirWhatsApp">
    <UFormField :label="t.comunicacaoW.numero" :error="invalido ? t.comunicacaoW.numeroInvalido : undefined" :help="ajuda">
      <UInput
        v-model="numero"
        type="tel"
        inputmode="tel"
        autocomplete="off"
        icon="i-lucide-phone"
        :placeholder="t.comunicacaoW.numeroPlaceholder"
        class="w-full"
      />
    </UFormField>
    <UFormField :label="t.comunicacaoW.mensagem">
      <UTextarea
        v-model="mensagem"
        :rows="2"
        :maxrows="4"
        autoresize
        :placeholder="t.comunicacaoW.mensagemPlaceholder"
        class="w-full"
      />
    </UFormField>
    <div class="flex flex-wrap items-center gap-2">
      <UTooltip :text="motivoDoWhatsApp ?? t.comunicacaoW.naoRegistra">
        <UButton
          type="submit"
          :label="t.comunicacaoW.whatsapp"
          icon="i-simple-icons-whatsapp"
          color="neutral"
          variant="outline"
          size="sm"
          :aria-disabled="motivoDoWhatsApp ? 'true' : undefined"
          :aria-label="motivoDoWhatsApp ? `${t.comunicacaoW.whatsapp}: ${motivoDoWhatsApp}` : undefined"
          :class="motivoDoWhatsApp ? 'cursor-not-allowed opacity-50' : 'transition-transform hover:-translate-y-0.5'"
        />
      </UTooltip>
      <UTooltip :text="motivoDoSms ?? t.comunicacaoW.naoRegistra">
        <UButton
          :label="t.comunicacaoW.sms"
          icon="i-lucide-message-square-text"
          color="neutral"
          variant="outline"
          size="sm"
          :aria-disabled="motivoDoSms ? 'true' : undefined"
          :aria-label="motivoDoSms ? `${t.comunicacaoW.sms}: ${motivoDoSms}` : undefined"
          :class="motivoDoSms ? 'cursor-not-allowed opacity-50' : 'transition-transform hover:-translate-y-0.5'"
          @click="abrirSms"
        />
      </UTooltip>
    </div>
    <p class="text-xs text-muted">
      {{ t.comunicacaoW.naoRegistra }}
    </p>
  </form>
</template>
