<script setup lang="ts">
/**
 * ANDAIME DE PROTÓTIPO, não é proposta de tela.
 *
 * A janela do app de fora: WhatsApp, Mensagens (SMS), o app de e-mail da
 * pessoa, a página pública do formulário e o login da Microsoft. No produto,
 * o navegador abre o link da barra de cima e o resto acontece fora do ENSPACE.
 * A simulação segue a mesma regra:
 *  - WhatsApp e SMS: o ENSPACE não fica sabendo da conversa;
 *  - e-mail pelo app: só chega à Mail Box se o endereço do item foi em cópia;
 *  - formulário público: a resposta cria um item na categoria do formulário;
 *  - Microsoft: aceitar integra o Correio do Outlook e o compositor libera.
 */
import type { Textos } from './textos'
import { type Email, EU, agora, categoriaPorSlug, enderecoDoItem, itens, workspace } from './mocks'
import { useComunicacao } from './estado'
import { type AppExterno, useAppExterno } from './simulador'

const props = defineProps<{ t: Textos }>()

const { app, fechar } = useAppExterno()
const { emails, formularios, cenario, abrirItem } = useComunicacao()
const toast = useToast()
const idioma = useIdioma()

const aberto = computed({ get: () => !!app.value, set: (v) => { if (!v) fechar() } })
const titulo = computed(() => app.value ? props.t.simulador.titulo[app.value.tipo] : '')
const largura = computed(() => app.value?.tipo === 'sms' ? 'max-w-sm' : app.value?.tipo === 'email' || app.value?.tipo === 'formulario' ? 'max-w-2xl' : 'max-w-lg')

/* ---------- WhatsApp e SMS ---------- */

const numero = ref('')
const texto = ref('')
const enviadas = ref<{ texto: string, hora: string }[]>([])
const horaCurta = computed(() => new Intl.DateTimeFormat(idioma.value, { hour: '2-digit', minute: '2-digit' }))

const conversa = computed(() => app.value?.tipo === 'whatsapp' || app.value?.tipo === 'sms' ? app.value as Extract<AppExterno, { tipo: 'whatsapp' | 'sms' }> : null)
const destinoDaConversa = computed(() => conversa.value?.telefone ?? numero.value.trim())
const podeEnviarMensagem = computed(() => !!texto.value.trim() && destinoDaConversa.value.replace(/\D/g, '').length >= 10)

function enviarMensagem() {
  if (!podeEnviarMensagem.value) return
  enviadas.value.push({ texto: texto.value.trim(), hora: horaCurta.value.format(agora()) })
  texto.value = ''
}

/* ---------- App de e-mail ---------- */

const email = reactive({ para: [] as string[], cc: [] as string[], assunto: '', corpo: '' })
const enderecoValido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const podeEnviarEmail = computed(() => email.para.length > 0 && email.para.every(enderecoValido) && !!email.corpo.trim())

function enviarEmail() {
  if (!podeEnviarEmail.value) return
  // A cópia para o endereço do item é o único caminho de o e-mail do app chegar ao ENSPACE.
  const item = itens.find(i => email.cc.some(c => c.toLowerCase() === enderecoDoItem(i)))
  if (item) {
    const copia: Email = {
      id: Date.now(),
      direcao: 'recebido',
      de: EU.email!,
      para: [...email.para],
      cc: [...email.cc],
      assunto: email.assunto || props.t.compositor.semAssunto,
      corpo: email.corpo.split('\n').filter(Boolean).map(l => `<p>${l.replace(/</g, '&lt;')}</p>`).join(''),
      data: agora(),
      caixa: enderecoDoItem(item),
      itemId: item.id,
      anexos: [],
      lido: false,
    }
    emails.value = [copia, ...emails.value]
  }
  fechar()
  toast.add({
    title: props.t.simulador.emailEnviado,
    description: item ? props.t.simulador.copiaNaMailBox(item.reference) : props.t.simulador.semCopia,
    icon: 'i-lucide-send',
    color: item ? 'success' : 'neutral',
    actions: item ? [{ label: props.t.simulador.verNaMailBox, color: 'neutral', variant: 'outline', onClick: () => abrirItem(item.id, 'mailbox') }] : undefined,
  })
}

/* ---------- Página pública do formulário ---------- */

const formulario = computed(() => app.value?.tipo === 'formulario' ? formularios.value.find(f => f.id === app.value!.formularioId) ?? null : null)
const respostas = ref<Record<string, string>>({})
const respondido = ref(false)
const podeResponder = computed(() => !!formulario.value && formulario.value.campos.slice(0, 1).every(c => !!respostas.value[c.rotulo]?.trim()))

/** A resposta pública cria um item na categoria do formulário, com o próximo ID. */
function responder() {
  const f = formulario.value
  if (!f || !podeResponder.value) return
  const cat = categoriaPorSlug(f.categoria)
  const daCategoria = itens.filter(i => i.categoria === f.categoria)
  const proximo = Math.max(0, ...daCategoria.map(i => Number(i.reference.split('-')[1]) || 0)) + 1
  const data: Record<string, string> = {}
  for (const c of f.campos) if (c.chave && respostas.value[c.rotulo]?.trim()) data[c.chave] = respostas.value[c.rotulo]!.trim()
  const titulo = data.titulo ?? `${f.nome} · ${horaCurta.value.format(agora())}`
  data.titulo = titulo
  const quando = agora()
  const novo = {
    id: Math.max(...itens.map(i => i.id)) + 1,
    reference: `${cat.prefixo}-${String(proximo).padStart(5, '0')}`,
    categoria: f.categoria,
    titulo,
    etapa: 'em_minuta' as const,
    request_email: f.campos.filter(c => c.tipo === 'email').map(c => respostas.value[c.rotulo]?.trim()).find(Boolean),
    data,
    created_at: quando,
    updated_at: quando,
    deleted_at: null,
    stage_status: null,
    status: 'active' as const,
  }
  itens.push(novo)
  respondido.value = true
  toast.add({
    title: props.t.simulador.itemCriado(cat.name, novo.reference),
    description: props.t.simulador.itemCriadoDescricao,
    icon: 'i-lucide-file-plus',
    color: 'success',
    duration: 8000,
    actions: [{ label: props.t.simulador.abrirItem, color: 'neutral', variant: 'outline', onClick: () => { fechar(); abrirItem(novo.id) } }],
  })
}

/* ---------- Microsoft ---------- */

const passo = ref<'integracoes' | 'consentimento' | 'integrado'>('integracoes')

function aceitar() {
  cenario.value = 'normal'
  passo.value = 'integrado'
}

/* ---------- abrir e fechar ---------- */

watch(app, (a) => {
  if (!a) return
  numero.value = ''
  enviadas.value = []
  respostas.value = {}
  respondido.value = false
  passo.value = 'integracoes'
  if (a.tipo === 'whatsapp' || a.tipo === 'sms') texto.value = a.texto
  if (a.tipo === 'email') Object.assign(email, { para: [...a.para], cc: [...a.cc], assunto: a.assunto, corpo: a.corpo })
}, { immediate: true })

function iniciais(s: string | null) {
  return (s ?? '?').split(/[\s.@]/).filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join('')
}
</script>

<template>
  <UModal v-model:open="aberto" :title="titulo" :description="t.simulador.selo" :ui="{ content: largura }">
    <template #content>
      <div v-if="app" class="flex max-h-[90dvh] flex-col overflow-hidden">
        <!-- Barra da simulação: o link que o produto abriria -->
        <div class="flex items-center gap-2 border-b border-dashed border-warning bg-warning/10 px-3 py-2">
          <UBadge :label="t.simulador.selo" icon="i-lucide-flask-conical" color="warning" variant="solid" size="sm" class="shrink-0" />
          <span class="min-w-0 flex-1 truncate font-mono text-xs text-toned" :title="app.url">{{ app.url }}</span>
          <UButton :label="t.simulador.voltar" icon="i-lucide-arrow-left" color="neutral" variant="outline" size="xs" class="shrink-0" @click="fechar" />
        </div>
        <p class="border-b border-default bg-warning/5 px-3 py-1.5 text-xs text-muted">
          {{ t.simulador.noProduto[app.tipo] }}
        </p>

        <!-- WhatsApp -->
        <div v-if="app.tipo === 'whatsapp'" class="flex h-112 flex-col">
          <header class="flex items-center gap-3 bg-success px-4 py-2.5 text-inverted">
            <UAvatar :text="iniciais(conversa?.nome ?? null)" size="sm" />
            <span class="min-w-0">
              <span class="block truncate text-sm font-semibold">{{ conversa?.nome ?? conversa?.telefone ?? t.simulador.novaConversa }}</span>
              <span v-if="conversa?.telefone" class="block truncate text-xs opacity-80">{{ conversa.telefone }}</span>
            </span>
          </header>
          <div v-if="!conversa?.telefone" class="border-b border-default px-3 py-2">
            <UInput v-model="numero" :placeholder="t.simulador.paraNumero" icon="i-lucide-phone" class="w-full" />
          </div>
          <div class="flex flex-1 flex-col gap-2 overflow-y-auto bg-elevated p-4">
            <p v-if="!enviadas.length" class="mx-auto rounded-md bg-default px-3 py-1 text-xs text-muted shadow-sm">
              {{ t.simulador.textoPronto }}
            </p>
            <div v-for="(m, i) in enviadas" :key="i" class="ml-auto max-w-xs rounded-lg bg-success/15 px-3 py-2 text-sm text-highlighted shadow-sm">
              <p class="whitespace-pre-wrap">
                {{ m.texto }}
              </p>
              <p class="mt-1 flex items-center justify-end gap-1 text-xs text-muted">
                {{ m.hora }}<UIcon name="i-lucide-check-check" class="size-3.5 text-info" />
              </p>
            </div>
          </div>
          <footer class="flex items-end gap-2 border-t border-default p-2">
            <UTextarea v-model="texto" autoresize :rows="1" :maxrows="5" :placeholder="t.simulador.digiteMensagem" class="flex-1" />
            <UButton icon="i-lucide-send-horizontal" color="success" :disabled="!podeEnviarMensagem" :aria-label="t.simulador.enviar" @click="enviarMensagem" />
          </footer>
          <p class="px-3 pb-2 text-xs text-muted">
            {{ t.simulador.naoRegistra.whatsapp }}
          </p>
        </div>

        <!-- Mensagens (SMS) -->
        <div v-else-if="app.tipo === 'sms'" class="p-4">
          <div class="mx-auto flex h-112 flex-col overflow-hidden rounded-3xl border-4 border-accented bg-default">
            <header class="border-b border-default px-4 py-3 text-center">
              <p class="text-xs text-muted">
                {{ t.simulador.mensagens }}
              </p>
              <p class="truncate text-sm font-semibold text-highlighted">
                {{ conversa?.nome ?? conversa?.telefone ?? t.simulador.novaConversa }}
              </p>
              <p v-if="conversa?.nome && conversa?.telefone" class="text-xs text-muted">
                {{ conversa.telefone }}
              </p>
            </header>
            <div v-if="!conversa?.telefone" class="border-b border-default px-3 py-2">
              <UInput v-model="numero" :placeholder="t.simulador.paraNumero" icon="i-lucide-phone" size="sm" class="w-full" />
            </div>
            <div class="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
              <div v-for="(m, i) in enviadas" :key="i" class="ml-auto max-w-56 rounded-2xl bg-info px-3 py-2 text-sm text-inverted">
                <p class="whitespace-pre-wrap">
                  {{ m.texto }}
                </p>
              </div>
              <p v-if="enviadas.length" class="ml-auto text-xs text-muted">
                {{ t.simulador.enviada }} · {{ enviadas[enviadas.length - 1]!.hora }}
              </p>
            </div>
            <footer class="flex items-end gap-2 border-t border-default p-2">
              <UTextarea v-model="texto" autoresize :rows="1" :maxrows="4" size="sm" :placeholder="t.simulador.digiteMensagem" class="flex-1" />
              <UButton icon="i-lucide-arrow-up" color="info" size="sm" :disabled="!podeEnviarMensagem" :aria-label="t.simulador.enviar" @click="enviarMensagem" />
            </footer>
          </div>
          <p class="mt-2 text-center text-xs text-muted">
            {{ t.simulador.naoRegistra.sms }}
          </p>
        </div>

        <!-- App de e-mail da pessoa (genérico, sem marca) -->
        <div v-else-if="app.tipo === 'email'" class="flex flex-col">
          <div class="flex items-center gap-2 bg-elevated px-4 py-2 text-sm font-medium text-highlighted">
            <UIcon name="i-lucide-mail" class="size-4" />{{ t.simulador.novaMensagem }}
          </div>
          <div class="flex flex-col gap-3 overflow-y-auto p-4">
            <UFormField :label="t.compositor.de" orientation="horizontal" :ui="{ container: 'flex-1' }">
              <span class="text-sm text-toned">{{ EU.email }}</span>
            </UFormField>
            <UFormField :label="t.compositor.para" orientation="horizontal" :ui="{ container: 'flex-1' }">
              <UInputTags v-model="email.para" :placeholder="t.compositor.emailPlaceholder" class="w-full" />
            </UFormField>
            <UFormField :label="t.compositor.cc" orientation="horizontal" :ui="{ container: 'flex-1' }">
              <UInputTags v-model="email.cc" :placeholder="t.compositor.emailPlaceholder" class="w-full" />
            </UFormField>
            <UFormField :label="t.compositor.assunto" orientation="horizontal" :ui="{ container: 'flex-1' }">
              <UInput v-model="email.assunto" class="w-full" />
            </UFormField>
            <UTextarea v-model="email.corpo" :rows="8" :placeholder="t.simulador.escrevaAqui" class="w-full" />
            <p class="text-xs text-muted">
              {{ email.cc.some(c => itens.some(i => enderecoDoItem(i) === c.toLowerCase())) ? t.simulador.comCopiaAviso : t.simulador.semCopiaAviso }}
            </p>
          </div>
          <footer class="flex justify-end gap-2 border-t border-default px-4 py-3">
            <UButton :label="t.simulador.descartar" color="neutral" variant="ghost" @click="fechar" />
            <UButton :label="t.simulador.enviar" icon="i-lucide-send" :disabled="!podeEnviarEmail" @click="enviarEmail" />
          </footer>
        </div>

        <!-- Página pública do formulário -->
        <div v-else-if="app.tipo === 'formulario'" class="overflow-y-auto bg-muted p-6">
          <div v-if="formulario" class="mx-auto max-w-lg rounded-lg border border-default bg-default p-5">
            <p class="text-xs font-medium uppercase tracking-wide text-muted">
              {{ workspace.name }}
            </p>
            <template v-if="!respondido">
              <h2 class="mt-1 text-lg font-semibold text-highlighted">
                {{ formulario.nome }}
              </h2>
              <p class="text-xs text-muted">
                {{ t.simulador.formPublico }}
              </p>
              <div class="mt-4 flex flex-col gap-3">
                <UFormField v-for="(c, i) in formulario.campos" :key="c.rotulo" :label="c.rotulo" :required="i === 0">
                  <UTextarea v-if="c.tipo === 'longo'" v-model="respostas[c.rotulo]" :rows="3" class="w-full" />
                  <UInput v-else v-model="respostas[c.rotulo]" :type="c.tipo === 'email' ? 'email' : c.tipo === 'telefone' ? 'tel' : 'text'" class="w-full" />
                </UFormField>
              </div>
              <UButton :label="t.simulador.enviarResposta" block class="mt-5" :disabled="!podeResponder" @click="responder" />
            </template>
            <UEmpty
              v-else
              icon="i-lucide-circle-check"
              :title="t.simulador.respostaEnviada"
              :description="t.simulador.obrigado"
              variant="naked"
            />
          </div>
        </div>

        <!-- Configurações do Usuário › Integrações e o consentimento da Microsoft -->
        <div v-else-if="app.tipo === 'outlook'" class="p-5">
          <p class="text-xs text-muted">
            {{ t.simulador.integracoes }}
          </p>
          <div v-if="passo === 'integracoes'" class="mt-3 flex items-center gap-3 rounded-lg border border-default p-4">
            <UIcon name="i-lucide-mail" class="size-8 text-info" />
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-highlighted">{{ t.simulador.correioOutlook }}</span>
              <span class="block text-sm text-muted">{{ t.simulador.correioOutlookDescricao }}</span>
            </span>
            <UButton :label="t.simulador.sincronizar" @click="passo = 'consentimento'" />
          </div>
          <div v-else-if="passo === 'consentimento'" class="mt-3 rounded-lg border border-default p-4">
            <p class="text-sm font-semibold text-highlighted">
              {{ t.simulador.contaMicrosoft }}
            </p>
            <p class="mt-1 text-sm text-toned">
              {{ EU.email }}
            </p>
            <p class="mt-3 text-sm text-muted">
              {{ t.simulador.pedidoDePermissao }}
            </p>
            <div class="mt-4 flex justify-end gap-2">
              <UButton :label="t.simulador.cancelar" color="neutral" variant="outline" @click="passo = 'integracoes'" />
              <UButton :label="t.simulador.aceitar" @click="aceitar" />
            </div>
          </div>
          <div v-else class="mt-3 flex items-center gap-3 rounded-lg border border-default p-4">
            <UIcon name="i-lucide-mail" class="size-8 text-info" />
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold text-highlighted">{{ t.simulador.correioOutlook }}</span>
              <span class="block text-sm text-muted">{{ t.simulador.integradoDescricao }}</span>
            </span>
            <UBadge :label="t.simulador.integrado" color="success" variant="subtle" />
          </div>
          <div v-if="passo === 'integrado'" class="mt-4 flex justify-end">
            <UButton :label="t.simulador.voltar" @click="fechar" />
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
