<script setup lang="ts">
/**
 * Os widgets do grupo Comunicação. Rodada 11, a pedido da redatora ("uma das
 * seções possíveis de widget lá deve ser de comunicação"): E-mail e WhatsApp e
 * SMS.
 *
 * Rodada 12, pela pesquisa de mercado de 2026-11-26 e com o sim da redatora
 * ("whatsapp e sms nao podem ser widgets diferentes? ficou confuso em tela"):
 * - E-mail: só a informação. A lista mostra os e-mails que a pessoa enviou de
 *   um item (a lista da central Comunicações com "Enviado por" = a pessoa),
 *   e o clique abre a leitura. O botão Novo e-mail saiu: repetia o da barra do
 *   topo, que é o ponto único do compor sem contexto;
 * - WhatsApp e SMS: 2 widgets, cada um com o número, a mensagem e 1 ação. O
 *   número segue as regras das outras telas: menos de 10 dígitos é inválido.
 *   No SMS, o telefone fixo é erro do campo, porque a única ação do widget é o
 *   SMS. Sem número, o WhatsApp abre a escolha da conversa (`wa.me/?text=`) e
 *   o SMS abre o painel "Enviar SMS" sem destinatário.
 *
 * Rodada 13, a pedido da redatora ("o widget de emails deve permitir um botao
 * de enviar email tambem, como tem no de enviar sms e de abrir no whatsapp"):
 * o E-mail volta a ter 1 ação, "Enviar e-mail", embaixo da lista, no mesmo
 * lugar e com o mesmo estilo do botão do WhatsApp e do SMS, e com a mesma
 * linha de aviso embaixo. O clique abre o compositor sem item, o mesmo do
 * "Novo e-mail" da barra do topo; sem o Outlook integrado, abre o app de
 * e-mail do computador.
 *
 * A central Comunicações e o painel "Enviar SMS" são do protótipo
 * comunicacao-no-workspace. Aqui o clique mostra o aviso de maquete com o que
 * abre no produto e o link exato.
 *
 * Componentes: `UScrollArea`, `UIcon`, `UButton`, `UFormField`, `UInput`,
 * `UTextarea` (MCP nuxt-ui).
 */
import type { EmailEnviado } from './mocks'
import type { Textos } from './textos'
import { ehTelefoneFixo, linkDeSms, linkDeWhatsApp, numeroDoTelefone, telefoneLegivel } from './formatar'

const props = defineProps<{
  t: Textos
  tipo: 'email' | 'whatsapp' | 'sms'
  emails: EmailEnviado[]
}>()
const emit = defineEmits<{ abrir: [destino: string, link?: string] }>()

/* E-mail */
const recentes = computed(() => [...props.emails].sort((a, b) => a.ha - b.ha).slice(0, 5))

/* WhatsApp ou SMS */
const ehSms = computed(() => props.tipo === 'sms')
const numero = ref('')
const mensagem = ref('')
const temDigito = computed(() => /\d/.test(numero.value))
const valido = computed(() => !!numeroDoTelefone(numero.value))
const legivel = computed(() => valido.value ? telefoneLegivel(numero.value) : null)

/** O erro do campo, que também deixa o botão indisponível. */
const erro = computed(() => {
  if (temDigito.value && !valido.value) return props.t.comunicacaoW.numeroInvalido
  if (ehSms.value && valido.value && ehTelefoneFixo(numero.value)) return props.t.comunicacaoW.telefoneFixo
  return null
})
const ajuda = computed(() => temDigito.value ? undefined : ehSms.value ? props.t.comunicacaoW.semNumeroSms : props.t.comunicacaoW.semNumeroWhatsApp)
const rotulo = computed(() => ehSms.value ? props.t.comunicacaoW.sms : props.t.comunicacaoW.whatsapp)
const naoRegistra = computed(() => ehSms.value ? props.t.comunicacaoW.naoRegistraSms : props.t.comunicacaoW.naoRegistraWhatsApp)

function abrir() {
  if (erro.value) return
  const n = valido.value ? numero.value : null
  const texto = mensagem.value || undefined
  if (ehSms.value) emit('abrir', props.t.comunicacaoW.abreSms(legivel.value), linkDeSms(n, texto))
  else emit('abrir', props.t.comunicacaoW.abreWhatsApp(legivel.value), linkDeWhatsApp(n, texto))
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
    <div class="flex flex-col gap-3 px-4 pt-3">
      <UButton
        :label="t.comunicacaoW.enviarEmail"
        icon="i-lucide-mail-plus"
        color="neutral"
        variant="outline"
        size="sm"
        class="self-start transition-transform hover:-translate-y-0.5"
        @click="emit('abrir', t.comunicacaoW.abreCompositor)"
      />
      <p class="text-xs text-muted">
        {{ t.comunicacaoW.naoRegistraEmail }}
      </p>
    </div>
  </div>

  <!-- WhatsApp ou SMS -->
  <form v-else class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pb-3" @submit.prevent="abrir">
    <UFormField :label="t.comunicacaoW.numero" :error="erro ?? undefined" :help="ajuda">
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
    <UButton
      type="submit"
      :label="rotulo"
      :icon="ehSms ? 'i-lucide-message-square-text' : 'i-simple-icons-whatsapp'"
      color="neutral"
      variant="outline"
      size="sm"
      class="self-start"
      :aria-disabled="erro ? 'true' : undefined"
      :aria-label="erro ? `${rotulo}: ${erro}` : undefined"
      :class="erro ? 'cursor-not-allowed opacity-50' : 'transition-transform hover:-translate-y-0.5'"
    />
    <p class="text-xs text-muted">
      {{ naoRegistra }}
    </p>
  </form>
</template>
