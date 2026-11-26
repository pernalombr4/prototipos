<script setup lang="ts">
/**
 * PROPOSTA (rodada 17). O painel "Enviar WhatsApp", aberto pelo atalho de WhatsApp de qualquer
 * tela quando o workspace tem a integração Twilio (Fase 4). Sem a Twilio, o atalho continua
 * abrindo direto a conversa no WhatsApp da pessoa (rodada 10), e este painel não aparece.
 *
 * Com a Twilio, a pessoa escolhe entre 2 opções, as 2 sempre disponíveis:
 *  - WhatsApp do workspace: sai do número de WhatsApp Business do workspace, com modelo aprovado
 *    pela Meta (fora de uma conversa aberta pelo contato, o WhatsApp só aceita modelo). Fica
 *    registrado no item e na central Comunicações, com o status de entrega;
 *  - Seu WhatsApp: texto livre, abre a conversa no WhatsApp Web ou no app da pessoa (wa.me), como
 *    sem a integração. O ENSPACE não registra.
 * A integração acrescenta uma opção; ela não tira o caminho que já existia.
 */
import type { Textos } from './textos'
import { numeroDoWhatsApp, telefoneLegivel, useComunicacao, useMarcaDeProposta } from './estado'
import { useWhatsApp } from './atalhos'
import { EU, NUMERO_WHATSAPP_DO_WORKSPACE, agora, enderecoDoItem, itemPorId, modelosDeWhatsApp, variaveisDoModelo } from './mocks'
import { textosDeCanais } from './textosDeCanais'

defineProps<{ t: Textos }>()

const { pedido, fecharPainel, abrirNoSeuWhatsApp } = useWhatsApp()
const { emails } = useComunicacao()
const tc = useTextos(textosDeCanais)
const tw = computed(() => tc.value.whatsappPainel)
const marca = useMarcaDeProposta()
const toast = useToast()

const aberto = computed({ get: () => !!pedido.value, set: (v) => { if (!v) fecharPainel() } })
const opcao = ref<'workspace' | 'pessoal'>('workspace')
const numeroDigitado = ref('')
const texto = ref('')
const modeloId = ref<string | undefined>()
const valores = ref<string[]>([])
const enviando = ref(false)

const destino = computed(() => pedido.value?.telefone ?? (numeroDigitado.value.trim() || null))
const numeroValido = computed(() => !!numeroDoWhatsApp(destino.value))
const item = computed(() => itemPorId(pedido.value?.itemId ?? null))

const abas = computed(() => [
  { label: tw.value.opcoes.workspace, value: 'workspace', icon: 'i-lucide-building-2' },
  { label: tw.value.opcoes.pessoal, value: 'pessoal', icon: 'i-simple-icons-whatsapp' },
])

/** Os modelos da Meta: só o aprovado se escolhe; os outros aparecem desabilitados, com o status. */
const opcoesDeModelo = computed(() => modelosDeWhatsApp.map(m => ({
  label: m.nome,
  value: m.id,
  description: m.status === 'aprovado' ? undefined : tc.value.statusMeta[m.status],
  disabled: m.status !== 'aprovado',
})))
const modelo = computed(() => modelosDeWhatsApp.find(m => m.id === modeloId.value) ?? null)
const qtdDeVariaveis = computed(() => modelo.value ? variaveisDoModelo(modelo.value) : 0)

/** Os valores sugeridos pelo item: {{1}} o primeiro nome, {{2}} a referência, {{3}} o vencimento. */
function sugestoes() {
  const i = item.value
  const vencimento = (i?.data as { vencimento?: string } | undefined)?.vencimento
  return [
    pedido.value?.nome?.split(' ')[0] ?? '',
    i?.reference ?? '',
    vencimento ? new Date(vencimento).toLocaleDateString('pt-BR') : '',
  ]
}

function sugerirValores() {
  const s = sugestoes()
  valores.value = Array.from({ length: qtdDeVariaveis.value }, (_, n) => s[n] ?? '')
}

watch(modeloId, sugerirValores)

watch(pedido, (p) => {
  if (!p) return
  texto.value = p.texto
  numeroDigitado.value = ''
  opcao.value = 'workspace'
  enviando.value = false
  modeloId.value = modelosDeWhatsApp.find(m => m.status === 'aprovado')?.id
  // O modelo pode ser o mesmo da vez anterior: os valores se refazem para o destino novo.
  sugerirValores()
}, { immediate: true })

const previa = computed(() => {
  if (!modelo.value) return ''
  return modelo.value.corpo.replace(/\{\{(\d+)\}\}/g, (marcador, n) => valores.value[Number(n) - 1]?.trim() || marcador)
})
const variaveisCompletas = computed(() => valores.value.every(v => v.trim()))
const podeEnviar = computed(() => numeroValido.value && !!modelo.value && variaveisCompletas.value)
const avisoDoEnvio = computed(() => {
  if (!numeroValido.value) return tw.value.informeNumero
  if (!variaveisCompletas.value) return tw.value.preenchaVariaveis
  return tw.value.enviarDica(NUMERO_WHATSAPP_DO_WORKSPACE)
})

function enviarPeloWorkspace() {
  const p = pedido.value
  const para = destino.value
  const m = modelo.value
  if (!p || !para || !m || !podeEnviar.value) return
  enviando.value = true
  const i = item.value
  const id = Math.max(0, ...emails.value.map(e => e.id)) + 1
  const corpo = previa.value
  setTimeout(() => {
    emails.value = [{
      id,
      direcao: 'enviado',
      canal: 'whatsapp',
      modeloWhatsApp: m.nome,
      de: NUMERO_WHATSAPP_DO_WORKSPACE,
      para: [telefoneLegivel(para)],
      cc: [],
      assunto: corpo,
      corpo: `<p>${corpo}</p>`,
      data: agora(),
      caixa: i ? enderecoDoItem(i) : EU.email!,
      itemId: i?.id ?? null,
      anexos: [],
      lido: true,
      autor: EU.id,
      desdeFase: 4,
      sistema: { status: 'naFila', tarefa: null, origem: 'pessoa', saiuPor: 'twilioWhatsApp' },
    }, ...emails.value]
    // ANDAIME: a fila e os avisos de status da Twilio, em 3 passos (enviado, entregue, lido).
    const muda = (f: (s: NonNullable<typeof emails.value[number]['sistema']>) => object, ms: number) => setTimeout(() => {
      emails.value = emails.value.map(e => e.id === id && e.sistema ? { ...e, sistema: { ...e.sistema, ...f(e.sistema) } } : e)
    }, ms)
    muda(() => ({ status: 'enviado' }), 1500)
    muda(() => ({ entrega: 'entregue' }), 4000)
    muda(() => ({ entrega: 'lido' }), 8000)
    enviando.value = false
    toast.add({ title: tw.value.enviadoTitulo, description: tw.value.enviadoDescricao(telefoneLegivel(para)), icon: 'i-simple-icons-whatsapp', color: 'success' })
    fecharPainel()
  }, 700)
}

function abrirNoMeu() {
  const p = pedido.value
  if (!p) return
  abrirNoSeuWhatsApp({ nome: p.nome, telefone: destino.value }, { texto: texto.value })
  fecharPainel()
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="tw.titulo(pedido?.nome ?? null)"
    :description="tw.descricao"
    :ui="{ content: 'max-w-lg' }"
  >
    <template #body>
      <div v-if="pedido" class="flex flex-col gap-4" :class="marca">
        <!-- Para -->
        <UFormField :label="tw.para">
          <div v-if="pedido.telefone" class="flex items-center gap-2 rounded-md border border-default px-3 py-2">
            <UIcon name="i-lucide-smartphone" class="size-4 shrink-0 text-muted" />
            <span class="min-w-0 flex-1">
              <span v-if="pedido.nome" class="block truncate text-sm font-medium text-highlighted">{{ pedido.nome }}</span>
              <span class="block truncate font-mono text-sm text-toned">{{ telefoneLegivel(pedido.telefone) }}</span>
            </span>
          </div>
          <UInput
            v-else
            v-model="numeroDigitado"
            icon="i-lucide-smartphone"
            :placeholder="tw.numeroPlaceholder"
            class="w-full"
            :aria-label="tw.para"
          />
        </UFormField>

        <!-- As 2 opções -->
        <UFormField :label="tw.comoEnviar">
          <UTabs v-model="opcao" :items="abas" :content="false" class="w-full" />
          <p class="mt-1.5 text-xs text-muted">
            {{ tw.opcoesDica[opcao] }}
          </p>
        </UFormField>

        <!-- WhatsApp do workspace: modelo aprovado, com registro -->
        <template v-if="opcao === 'workspace'">
          <UFormField :label="tw.modelo" :help="tw.modeloAjuda">
            <USelect v-model="modeloId" :items="opcoesDeModelo" class="w-full" :ui="{ itemDescription: 'text-xs' }" />
          </UFormField>

          <div v-if="qtdDeVariaveis" class="grid gap-3 sm:grid-cols-2">
            <UFormField v-for="(_, n) in valores" :key="n" :label="tw.variavel(n + 1)">
              <UInput v-model="valores[n]" class="w-full" />
            </UFormField>
          </div>

          <div>
            <p class="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">
              {{ tw.previa }}
            </p>
            <p class="rounded-md bg-elevated px-3 py-2.5 text-sm text-default">
              {{ previa }}
            </p>
          </div>

          <div class="flex flex-col gap-1.5">
            <UButton
              :label="tw.enviar"
              icon="i-lucide-send"
              block
              :loading="enviando"
              :disabled="!podeEnviar"
              @click="enviarPeloWorkspace"
            />
            <p class="text-xs text-muted">
              {{ avisoDoEnvio }}
            </p>
          </div>
        </template>

        <!-- Seu WhatsApp: texto livre, sem registro -->
        <template v-else>
          <UFormField :label="tw.mensagem">
            <UTextarea v-model="texto" autoresize :rows="3" :maxrows="8" class="w-full" />
          </UFormField>
          <div class="flex flex-col gap-1.5">
            <UButton
              :label="tw.abrir"
              icon="i-simple-icons-whatsapp"
              block
              :disabled="!texto.trim()"
              @click="abrirNoMeu"
            />
            <p class="text-xs text-muted">
              {{ destino ? tw.abrirDica : tw.semNumero }}
            </p>
          </div>
        </template>
      </div>
    </template>
  </UModal>
</template>
