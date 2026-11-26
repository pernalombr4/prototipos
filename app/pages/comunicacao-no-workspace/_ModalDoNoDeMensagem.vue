<script setup lang="ts">
/**
 * PROPOSTA (Fase 4, rodada 14). O modal de configuração dos nós Enviar SMS e Enviar WhatsApp.
 *
 * A moldura é a do develop, copiada de `no-de-atraso/_ModalDoAtraso.vue`: ENTRADA à esquerda
 * (abre Variáveis de Entrada), SAÍDA à direita, cabeçalho com ícone e X, rodapé com
 * "Modificado", Cancelar e Salvar e fechar.
 *
 * O conteúdo é proposta, com o que a Twilio pede (pesquisa de 2026-11-26):
 *  - SMS: Para, por onde sai (o número do workspace), Mensagem com variáveis e a contagem de
 *    SMS (160 caracteres sem acento, 70 com acento; cada parte tem custo);
 *  - WhatsApp: Para, por onde sai, o modelo aprovado pela Meta (fora de uma conversa aberta pelo
 *    contato nas últimas 24 horas, só modelo), o valor de cada {{n}} e a prévia;
 *  - os 2: o que fazer se o envio falhar, esperar a confirmação de entrega e as variáveis de
 *    saída. Sem a integração Twilio, o modal avisa e aponta para Integrações.
 */
import type { Textos } from './textos'
import { textosDeCanais } from './textosDeCanais'
import { NUMERO_SMS_DO_WORKSPACE, NUMERO_WHATSAPP_DO_WORKSPACE, modelosDeWhatsApp, variaveisDoModelo } from './mocks'
import { partesDoSms, useComunicacao } from './estado'
import { type AoFalhar, type ConfigDoSms, type ConfigDoWhatsApp, VARIAVEIS, type Variavel, comExemplos, useSpaceflow } from './spaceflow'

defineProps<{ t: Textos }>()

const tc = useTextos(textosDeCanais)
const tm = computed(() => tc.value.spaceflow.modal)
const { twilioLigado } = useComunicacao()
const { sms, whatsapp, editando, salvos } = useSpaceflow()
const toast = useToast()

const aberto = computed({ get: () => !!editando.value, set: (v) => { if (!v) editando.value = null } })
const tipo = computed(() => editando.value ?? 'sms')

/* ---------- o rascunho, que só vira config no Salvar ---------- */

const rascunhoSms = ref<ConfigDoSms>(structuredClone(toRaw(sms.value)))
const rascunhoWa = ref<ConfigDoWhatsApp>(structuredClone(toRaw(whatsapp.value)))
const tentouSalvar = ref(false)
const salvando = ref(false)
const painelAberto = ref(false)

watch(editando, (v) => {
  if (!v) return
  rascunhoSms.value = structuredClone(toRaw(sms.value))
  rascunhoWa.value = structuredClone(toRaw(whatsapp.value))
  tentouSalvar.value = false
  painelAberto.value = false
  ultimoCampo.value = 'para'
})

const modificado = computed(() => tipo.value === 'sms'
  ? JSON.stringify(rascunhoSms.value) !== JSON.stringify(sms.value)
  : JSON.stringify(rascunhoWa.value) !== JSON.stringify(whatsapp.value))

/* ---------- campos ---------- */

const para = computed({
  get: () => tipo.value === 'sms' ? rascunhoSms.value.para : rascunhoWa.value.para,
  set: (v: string) => { if (tipo.value === 'sms') rascunhoSms.value.para = v; else rascunhoWa.value.para = v },
})
const nome = computed({
  get: () => tipo.value === 'sms' ? rascunhoSms.value.nome : rascunhoWa.value.nome,
  set: (v: string) => { if (tipo.value === 'sms') rascunhoSms.value.nome = v; else rascunhoWa.value.nome = v },
})
const aoFalhar = computed({
  get: () => tipo.value === 'sms' ? rascunhoSms.value.aoFalhar : rascunhoWa.value.aoFalhar,
  set: (v: AoFalhar) => { if (tipo.value === 'sms') rascunhoSms.value.aoFalhar = v; else rascunhoWa.value.aoFalhar = v },
})
const esperarEntrega = computed({
  get: () => tipo.value === 'sms' ? rascunhoSms.value.esperarEntrega : rascunhoWa.value.esperarEntrega,
  set: (v: boolean) => { if (tipo.value === 'sms') rascunhoSms.value.esperarEntrega = v; else rascunhoWa.value.esperarEntrega = v },
})

const opcoesAoFalhar = computed(() => (['seguir', 'parar'] as const).map(v => ({ value: v, label: tm.value.aoFalharOpcoes[v] })))

/** SMS: a contagem conta o texto com os valores de exemplo, porque a variável muda o tamanho. */
const contagem = computed(() => partesDoSms(comExemplos(rascunhoSms.value.mensagem)))

/** WhatsApp: o modelo e as variáveis dele. */
const opcoesDeModelo = computed(() => modelosDeWhatsApp.map(m => ({
  value: m.id,
  label: m.nome,
  disabled: m.status !== 'aprovado',
  description: m.status === 'aprovado' ? tc.value.categoriaMeta[m.categoria] : tm.value.indisponivel(tc.value.statusMeta[m.status]),
})))
const modelo = computed(() => modelosDeWhatsApp.find(m => m.id === rascunhoWa.value.modelo) ?? null)
const qtdDeVariaveis = computed(() => modelo.value ? variaveisDoModelo(modelo.value) : 0)
watch(qtdDeVariaveis, (n) => {
  const v = rascunhoWa.value.variaveis
  rascunhoWa.value.variaveis = Array.from({ length: n }, (_, i) => v[i] ?? '')
})
const previaWa = computed(() => modelo.value
  ? modelo.value.corpo.replace(/\{\{(\d+)\}\}/g, (_, n) => comExemplos(rascunhoWa.value.variaveis[Number(n) - 1] ?? '') || `{{${n}}}`)
  : '')
const previaSms = computed(() => comExemplos(rascunhoSms.value.mensagem))

/* ---------- validação ---------- */

const erroPara = computed(() => tentouSalvar.value && !para.value.trim() ? tm.value.paraErro : undefined)
const erroMensagem = computed(() => tentouSalvar.value && tipo.value === 'sms' && !rascunhoSms.value.mensagem.trim() ? tm.value.mensagemErro : undefined)
const erroModelo = computed(() => tentouSalvar.value && tipo.value === 'whatsapp' && !modelo.value ? tm.value.modeloErro : undefined)

function salvar() {
  tentouSalvar.value = true
  if (erroPara.value || erroMensagem.value || erroModelo.value) return
  salvando.value = true
  setTimeout(() => {
    const id = tipo.value
    if (id === 'sms') sms.value = structuredClone(toRaw(rascunhoSms.value))
    else whatsapp.value = structuredClone(toRaw(rascunhoWa.value))
    if (!salvos.value.includes(id)) salvos.value = [...salvos.value, id]
    salvando.value = false
    editando.value = null
    toast.add({ title: tm.value.salvo, icon: 'i-lucide-check', color: 'success' })
  }, 500)
}

/* ---------- Variáveis de Entrada ---------- */

/** O último campo que recebeu foco: o clique numa variável põe nele. */
const ultimoCampo = ref<'para' | 'mensagem' | number>('para')
function por(v: Variavel) {
  const c = ultimoCampo.value
  if (c === 'para') para.value = v.chave
  else if (c === 'mensagem') rascunhoSms.value.mensagem = `${rascunhoSms.value.mensagem.trimEnd()} ${v.chave}`.trim()
  else rascunhoWa.value.variaveis[c] = v.chave
}
function arrastar(ev: DragEvent, v: Variavel) {
  ev.dataTransfer?.setData('text/plain', v.chave)
}
const filtro = ref('')
const variaveisFiltradas = computed(() => VARIAVEIS.filter(v => !filtro.value.trim() || v.rotulo.toLowerCase().includes(filtro.value.trim().toLowerCase())))

function abrirIntegracoes() {
  toast.add({ title: tc.value.abrirIntegracoes, description: tm.value.maquete, icon: 'i-lucide-info', color: 'neutral' })
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :dismissible="!modificado"
    :title="tipo === 'sms' ? tm.tituloSms : tm.tituloWhatsApp"
    :description="tipo === 'sms' ? tc.spaceflow.nos.sms.descricao : tc.spaceflow.nos.whatsapp.descricao"
    :ui="{ content: 'max-w-none w-auto bg-transparent shadow-none ring-0 divide-y-0 overflow-visible' }"
  >
    <template #content>
      <div class="flex items-center">
        <div class="relative z-10 flex max-h-[min(88dvh,820px)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-default bg-default shadow-xl sm:w-[640px]">
          <!-- Cabeçalho -->
          <div class="flex items-center gap-2 border-b border-default px-5 py-4">
            <UIcon :name="tipo === 'sms' ? 'i-lucide-message-square-text' : 'i-simple-icons-whatsapp'" class="size-4 text-muted" />
            <h2 class="flex-1 text-base font-semibold text-highlighted">
              {{ tipo === 'sms' ? tm.tituloSms : tm.tituloWhatsApp }}
            </h2>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="tm.fechar" @click="aberto = false" />
          </div>

          <!-- Corpo -->
          <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <UAlert
              v-if="!twilioLigado"
              color="error"
              variant="subtle"
              icon="i-lucide-plug-zap"
              :title="tm.semIntegracaoTitulo"
              :description="tm.semIntegracaoDescricao"
              :actions="[{ label: tc.abrirIntegracoes, icon: 'i-lucide-blocks', color: 'neutral', variant: 'outline', onClick: abrirIntegracoes }]"
            />

            <UFormField :label="tm.nomeDoNo">
              <UInput v-model="nome" :placeholder="tipo === 'sms' ? tc.spaceflow.nos.sms.titulo : tc.spaceflow.nos.whatsapp.titulo" class="w-full" />
            </UFormField>

            <UFormField :label="tm.para" :help="erroPara ? undefined : tm.paraAjuda" :error="erroPara" required>
              <UInput v-model="para" :placeholder="tm.paraPlaceholder" icon="i-lucide-phone" class="w-full font-mono" @focus="ultimoCampo = 'para'" />
            </UFormField>

            <UFormField :label="tm.remetente">
              <div class="flex items-center gap-2 rounded-md border border-default bg-elevated/50 px-3 py-2 text-sm text-default">
                <UIcon :name="tipo === 'sms' ? 'i-lucide-smartphone' : 'i-simple-icons-whatsapp'" class="size-4 shrink-0 text-muted" />
                {{ tipo === 'sms' ? tm.remetenteSms(NUMERO_SMS_DO_WORKSPACE) : tm.remetenteWhatsApp(NUMERO_WHATSAPP_DO_WORKSPACE) }}
              </div>
            </UFormField>

            <!-- ===== SMS ===== -->
            <template v-if="tipo === 'sms'">
              <UFormField :label="tm.mensagem" :help="erroMensagem ? undefined : tm.limite(contagem.limite)" :error="erroMensagem" required>
                <template #hint>
                  <span class="tabular-nums" :class="contagem.partes > 1 ? 'text-warning' : ''">{{ tm.contagem(contagem.tamanho, contagem.partes) }}</span>
                </template>
                <UTextarea v-model="rascunhoSms.mensagem" autoresize :rows="3" :maxrows="8" class="w-full" @focus="ultimoCampo = 'mensagem'" />
              </UFormField>
              <div>
                <p class="mb-1.5 text-sm font-medium text-highlighted">
                  {{ tm.previa }}
                </p>
                <div class="flex justify-end rounded-lg bg-elevated p-3">
                  <p class="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-inverted">
                    {{ previaSms }}
                  </p>
                </div>
              </div>
            </template>

            <!-- ===== WhatsApp ===== -->
            <template v-else>
              <UFormField :label="tm.modelo" :help="erroModelo ? undefined : tm.modeloAjuda" :error="erroModelo" required>
                <USelect
                  :model-value="rascunhoWa.modelo ?? undefined"
                  :items="opcoesDeModelo"
                  :placeholder="tm.modeloPlaceholder"
                  class="w-full font-mono"
                  :ui="{ itemDescription: 'font-sans whitespace-normal' }"
                  @update:model-value="(v: string) => { rascunhoWa.modelo = v }"
                />
              </UFormField>
              <div v-if="qtdDeVariaveis" class="rounded-lg border border-default p-3">
                <p class="mb-3 text-sm font-medium text-highlighted">
                  {{ tm.variaveisDoModelo }}
                </p>
                <div class="flex flex-col gap-3">
                  <UFormField v-for="n in qtdDeVariaveis" :key="n" :label="`{{${n}}}`" :help="tm.variavelAjuda(n)" :ui="{ label: 'font-mono' }">
                    <UInput v-model="rascunhoWa.variaveis[n - 1]" class="w-full font-mono" size="sm" @focus="ultimoCampo = n - 1" />
                  </UFormField>
                </div>
              </div>
              <div v-if="modelo">
                <p class="mb-1.5 text-sm font-medium text-highlighted">
                  {{ tm.previa }}
                </p>
                <div class="flex justify-end rounded-lg bg-elevated p-3">
                  <p class="max-w-[85%] rounded-2xl rounded-br-sm bg-success/15 px-3 py-2 text-sm text-highlighted">
                    {{ previaWa }}
                  </p>
                </div>
              </div>
            </template>

            <!-- ===== Os 2 ===== -->
            <UFormField :label="tm.aoFalhar" :help="tm.aoFalharAjuda">
              <USelect v-model="aoFalhar" :items="opcoesAoFalhar" class="w-full" />
            </UFormField>

            <USwitch v-model="esperarEntrega" :label="tm.esperarEntrega" :description="tm.esperarEntregaAjuda" />

            <UFormField :label="tm.variaveisDeSaida">
              <div class="flex flex-wrap gap-1.5">
                <UBadge v-for="v in tm.variaveisDeSaidaLista.split(', ')" :key="v" :label="v" color="neutral" variant="outline" class="font-mono" />
              </div>
            </UFormField>
          </div>

          <!-- Rodapé (como no develop) -->
          <div class="flex items-center gap-2 border-t border-default px-5 py-3">
            <span v-if="modificado" class="flex items-center gap-1.5 text-xs text-warning">
              <span class="size-2 rounded-full bg-warning" />{{ tm.modificadoRodape }}
            </span>
            <span class="ml-auto" />
            <UButton :label="tm.cancelar" color="neutral" variant="outline" @click="aberto = false" />
            <UButton :label="tm.salvarEFechar" icon="i-lucide-check" :loading="salvando" @click="salvar" />
          </div>
        </div>

        <!-- ENTRADA, à esquerda, como no develop -->
        <button
          v-if="!painelAberto"
          type="button"
          class="order-first -mr-2 hidden h-64 w-12 items-center justify-center rounded-l-xl border border-r-0 border-default bg-default/80 transition-colors hover:bg-elevated sm:flex"
          :aria-label="tm.abrirVariaveis"
          @click="painelAberto = true"
        >
          <span class="flex rotate-180 items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary [writing-mode:vertical-rl]">
            {{ tm.entrada }}
          </span>
        </button>
        <section
          v-else
          class="order-first -mr-1 hidden max-h-[min(70dvh,560px)] w-72 flex-col overflow-hidden rounded-l-xl border border-r-0 border-default bg-default shadow-lg sm:flex"
          :aria-label="tm.variaveisDeEntrada"
        >
          <div class="flex items-center gap-2 border-b border-default px-3 py-3">
            <span class="flex size-7 items-center justify-center rounded-md bg-elevated text-primary">
              <UIcon name="i-lucide-arrow-right-to-line" class="size-4" />
            </span>
            <h3 class="flex-1 text-sm font-semibold text-highlighted">
              {{ tm.variaveisDeEntrada }}
            </h3>
            <UButton icon="i-lucide-panel-left-close" color="neutral" variant="ghost" size="xs" :aria-label="tm.recolher" @click="painelAberto = false" />
          </div>
          <div class="space-y-2 px-3 pt-3">
            <p class="text-xs text-muted">
              {{ tm.arrasteAsVariaveis }}
            </p>
            <UInput v-model="filtro" icon="i-lucide-search" size="sm" class="w-full" :aria-label="tm.variaveisDeEntrada" />
          </div>
          <div class="min-h-0 flex-1 overflow-y-auto px-2 pb-3 pt-2 text-sm">
            <p class="flex items-center gap-1 px-1 py-1 text-default">
              <UIcon name="i-lucide-chevron-down" class="size-3.5 text-muted" />
              {{ tc.spaceflow.nos.start.titulo }} - {{ tm.gatilho }}
            </p>
            <button
              v-for="v in variaveisFiltradas"
              :key="v.chave"
              type="button"
              draggable="true"
              class="flex w-full cursor-grab items-center gap-1.5 rounded py-1 pl-6 pr-2 text-left text-default transition-colors hover:bg-elevated active:cursor-grabbing"
              :title="v.chave"
              @dragstart="arrastar($event, v)"
              @click="por(v)"
            >
              <UIcon :name="v.icone" class="size-3.5 shrink-0 text-muted" />
              <span class="truncate">{{ v.rotulo }}</span>
            </button>
          </div>
        </section>

        <!-- SAÍDA, à direita -->
        <div class="-ml-2 hidden h-64 w-12 items-center justify-center rounded-r-xl border border-l-0 border-default bg-default/80 sm:flex">
          <span class="flex rotate-180 items-center gap-2 text-xs font-semibold tracking-[0.2em] text-success [writing-mode:vertical-rl]">
            {{ tm.saida }}
          </span>
        </div>
      </div>
    </template>
  </UModal>
</template>
