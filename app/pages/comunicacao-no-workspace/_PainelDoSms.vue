<script setup lang="ts">
/**
 * PROPOSTA. O painel "Enviar SMS" (rodada 11), aberto pelo botão SMS de
 * qualquer tela. No computador não há um caminho único que funcione para todos
 * (PESQUISA.md, "SMS no computador"):
 *  - o Teams corporativo não envia SMS no Brasil (só EUA e Canadá);
 *  - o Vincular ao Celular do Windows nem sempre assume o link `sms:`;
 *  - o Google Messages Web não aceita número nem texto no link.
 * Então o painel junta os caminhos, na ordem do que mais funciona: o app de SMS
 * (link `sms:`), o QR code para o celular, copiar o número e a mensagem, e o
 * Google Messages Web. Quem envia é a pessoa, pelo celular dela; o ENSPACE não
 * registra o SMS.
 */
import type { Textos } from './textos'
import { linkDeSms, partesDoSms, telefoneLegivel } from './estado'
import { useSms } from './atalhos'

const props = defineProps<{ t: Textos }>()

const { pedido, fecharPainel, abrirNoApp, abrirNoMessagesWeb } = useSms()
const toast = useToast()

const aberto = computed({ get: () => !!pedido.value, set: (v) => { if (!v) fecharPainel() } })
const texto = ref('')
const qrAberto = ref(false)
const copiado = ref<'numero' | 'texto' | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined

watch(pedido, (p) => {
  if (!p) return
  texto.value = p.texto
  qrAberto.value = false
  copiado.value = null
}, { immediate: true })

const atual = computed(() => pedido.value ? { ...pedido.value, texto: texto.value } : null)
const numero = computed(() => pedido.value?.telefone ? telefoneLegivel(pedido.value.telefone) : '')
const contagem = computed(() => partesDoSms(texto.value))
const link = computed(() => atual.value ? linkDeSms(atual.value.telefone, atual.value.texto || undefined) : '')

async function copiar(oQue: 'numero' | 'texto') {
  const valor = oQue === 'numero' ? numero.value : texto.value
  try {
    await navigator.clipboard.writeText(valor)
  }
  catch {
    // Sem permissão de área de transferência: o aviso continua valendo no protótipo.
  }
  copiado.value = oQue
  clearTimeout(timer)
  timer = setTimeout(() => (copiado.value = null), 2000)
  toast.add({ title: oQue === 'numero' ? props.t.sms.numeroCopiado : props.t.sms.textoCopiado, icon: 'i-lucide-check', color: 'success', duration: 2500 })
}

function abrirApp() {
  if (atual.value) abrirNoApp(atual.value)
}

function abrirWeb() {
  if (atual.value) abrirNoMessagesWeb(atual.value)
}

/**
 * ANDAIME: um QR code de mentira, com os 3 quadrados de posição e o miolo tirado
 * do link. No produto, o código é gerado do link `sms:` (biblioteca a escolher
 * com os devs).
 */
const N = 25
const modulos = computed(() => {
  let h = 2166136261
  for (const c of link.value) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const cel: { x: number, y: number }[] = []
  const finder = (x: number, y: number) => {
    for (const [ox, oy] of [[0, 0], [N - 7, 0], [0, N - 7]] as const) {
      const dx = x - ox
      const dy = y - oy
      if (dx >= -1 && dx <= 7 && dy >= -1 && dy <= 7) {
        const borda = dx === 0 || dx === 6 || dy === 0 || dy === 6
        const miolo = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4
        return dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 ? (borda || miolo ? 1 : 0) : 0
      }
    }
    return -1
  }
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const f = finder(x, y)
      if (f === 1) cel.push({ x, y })
      else if (f === -1) {
        h = Math.imul(h ^ (x * 31 + y), 2246822507) >>> 0
        if (h % 2) cel.push({ x, y })
      }
    }
  }
  return cel
})
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="t.sms.painelTitulo(pedido?.nome ?? null)"
    :description="t.sms.painelDescricao"
    :ui="{ content: 'max-w-lg', footer: 'justify-end' }"
  >
    <template #body>
      <div v-if="pedido" class="flex flex-col gap-4">
        <!-- Para -->
        <UFormField :label="t.sms.destinatario">
          <div v-if="pedido.telefone" class="flex items-center gap-2 rounded-md border border-default px-3 py-2">
            <UIcon name="i-lucide-smartphone" class="size-4 shrink-0 text-muted" />
            <span class="min-w-0 flex-1">
              <span v-if="pedido.nome" class="block truncate text-sm font-medium text-highlighted">{{ pedido.nome }}</span>
              <span class="block truncate font-mono text-sm text-toned">{{ numero }}</span>
            </span>
            <UButton
              :label="copiado === 'numero' ? t.form.copiado : t.sms.copiarNumero"
              :icon="copiado === 'numero' ? 'i-lucide-check' : 'i-lucide-copy'"
              color="neutral"
              variant="outline"
              size="xs"
              class="shrink-0"
              @click="copiar('numero')"
            />
          </div>
          <p v-else class="text-sm text-muted">
            {{ t.sms.semDestinatario }}
          </p>
        </UFormField>

        <!-- Mensagem -->
        <UFormField :label="t.sms.mensagem" :help="t.sms.dicaDoTamanho(contagem.limite)">
          <UTextarea v-model="texto" autoresize :rows="3" :maxrows="8" class="w-full" />
          <template #hint>
            <span class="tabular-nums">{{ t.sms.contagem(contagem.tamanho, contagem.partes) }}</span>
          </template>
        </UFormField>

        <!-- O caminho principal -->
        <div class="flex flex-col gap-1.5">
          <UButton
            :label="t.sms.abrirNoApp"
            icon="i-lucide-message-square-text"
            block
            :disabled="!texto.trim()"
            @click="abrirApp"
          />
          <p class="text-xs text-muted">
            {{ t.sms.abrirNoAppDica }}
          </p>
        </div>

        <!-- Os outros caminhos -->
        <div>
          <p class="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
            {{ t.sms.outrosCaminhos }}
          </p>
          <ul class="divide-y divide-default rounded-md border border-default">
            <li class="px-3 py-2.5">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-qr-code" class="size-5 shrink-0 text-muted" />
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium text-highlighted">{{ t.sms.abrirNoCelular }}</span>
                  <span class="block text-xs text-muted">{{ t.sms.abrirNoCelularDica }}</span>
                </span>
                <UButton
                  :icon="qrAberto ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                  color="neutral"
                  variant="outline"
                  size="xs"
                  :label="qrAberto ? t.sms.ocultarQr : t.sms.mostrarQr"
                  class="shrink-0"
                  :aria-expanded="qrAberto"
                  @click="qrAberto = !qrAberto"
                />
              </div>
              <Transition name="qr">
                <figure v-if="qrAberto" class="mt-3 flex flex-col items-center gap-2">
                  <svg :viewBox="`-2 -2 ${N + 4} ${N + 4}`" class="size-40 rounded-md bg-white" role="img" :aria-label="t.sms.qrAlt">
                    <rect v-for="m in modulos" :key="`${m.x}-${m.y}`" :x="m.x" :y="m.y" width="1" height="1" fill="#000" />
                  </svg>
                  <figcaption class="text-center text-xs text-warning">
                    {{ t.sms.qrAndaime }}
                  </figcaption>
                </figure>
              </Transition>
            </li>
            <li class="flex items-center gap-3 px-3 py-2.5">
              <UIcon name="i-lucide-clipboard-copy" class="size-5 shrink-0 text-muted" />
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-medium text-highlighted">{{ t.sms.copiarTexto }}</span>
                <span class="block text-xs text-muted">{{ t.sms.vincular }}</span>
              </span>
              <UButton
                :label="copiado === 'texto' ? t.form.copiado : t.sms.copiar"
                :icon="copiado === 'texto' ? 'i-lucide-check' : 'i-lucide-copy'"
                color="neutral"
                variant="outline"
                size="xs"
                class="shrink-0"
                :disabled="!texto.trim()"
                @click="copiar('texto')"
              />
            </li>
            <li class="flex items-center gap-3 px-3 py-2.5">
              <UIcon name="i-simple-icons-googlemessages" class="size-5 shrink-0 text-muted" />
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-medium text-highlighted">{{ t.sms.messagesWeb }}</span>
                <span class="block text-xs text-muted">{{ t.sms.messagesWebDica }}</span>
              </span>
              <UButton
                :label="t.sms.abrir"
                icon="i-lucide-external-link"
                color="neutral"
                variant="outline"
                size="xs"
                class="shrink-0"
                :disabled="!texto.trim()"
                @click="abrirWeb"
              />
            </li>
          </ul>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.qr-enter-active,
.qr-leave-active {
  transition: opacity var(--duracao-rapida, 150ms) ease, transform var(--duracao-rapida, 150ms) ease;
}
.qr-enter-from,
.qr-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
@media (prefers-reduced-motion: reduce) {
  .qr-enter-active,
  .qr-leave-active {
    transition: none;
  }
}
</style>
