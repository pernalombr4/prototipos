<script setup lang="ts">
/**
 * O compositor de e-mail. É a gaveta "Nova Mensagem" da aba Mail Box do
 * develop (Para, Adicionar em Cópia, Template, Assunto, Mensagem, Anexar
 * Arquivo, Enviar), na mesma forma (gaveta à direita) e na mesma ordem.
 *
 * O envio é o da Mail Box de hoje, lido no código do develop em 05/10/2026:
 * `user-integrations/microsoft/send-email`, da conta do Outlook que a pessoa
 * integrou. Com item, vão também `replyTo` e `mailBox` (o endereço do item) e
 * `item_ref` (a referência do item). Sem conta integrada, a gaveta mostra
 * "Nenhuma conta integrada disponível" e o botão "Integrar contas".
 *
 * PROPOSTA:
 *  - abre de qualquer tela (barra do topo, tela inicial, item, tarefa, E-mails);
 *  - "De" visível (hoje a tela não mostra) e "Responder para" quando há item;
 *  - "Vincular a item (opcional)", separado dos campos do e-mail;
 *  - Descartar com Desfazer, e o rascunho sobrevive a fechar a gaveta.
 */
import type { EditorToolbarItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { type Email, EU, categoriaPorSlug, itemPorId, itens, membros, modelos } from './mocks'
import { contatosDoItem, preencher, useComunicacao, useMarcaDeProposta } from './estado'
import BuscaDeItem from './_BuscaDeItem.vue'
import LinkDoEditor from './_LinkDoEditor.vue'

const props = defineProps<{ t: Textos }>()

const { compositorAberto, rascunho, emails, config, cenario, outlookIntegrado, remetentePadrao, responderPara, abrirItem, ir, descartarRascunho } = useComunicacao()
const marca = useMarcaDeProposta()
const toast = useToast()

const item = computed(() => itemPorId(rascunho.value.itemId))
const categoria = computed(() => item.value ? categoriaPorSlug(item.value.categoria) : null)

/* ---------- De e Responder para ---------- */

/** O remetente é sempre a conta da pessoa; o item só define o "Responder para". */
const enderecoDeResposta = computed(() => responderPara(rascunho.value.itemId))
watch(outlookIntegrado, () => (rascunho.value.de = remetentePadrao()))

function integrar() {
  toast.add({ title: props.t.compositor.integrarContas, description: props.t.compositor.integrarMaquete, icon: 'i-lucide-plug', color: 'neutral' })
}

/** "Inserir assinatura": a assinatura da conta do Outlook, como na Mail Box de hoje. */
function inserirAssinatura() {
  const assinatura = `<p>--<br>${EU.nome}<br>${props.t.compositor.cargoDaAssinatura}</p>`
  if (!rascunho.value.corpo.includes(assinatura)) rascunho.value.corpo = `${rascunho.value.corpo}${assinatura}`
}

/* ---------- Para ---------- */

const sugestoes = computed(() => {
  type Sugestao = { value: string, label: string, description: string, avatar: { text: string } }
  const avatar = (s: string) => ({ text: s.split(/[\s.@]/).filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join('') })
  const lista: Sugestao[] = []
  if (item.value) {
    for (const c of contatosDoItem(item.value, config.value)) {
      if (c.email) lista.push({ value: c.email, label: c.nome ?? c.email, description: `${c.rotulo} · ${c.email}`, avatar: avatar(c.nome ?? c.email) })
    }
  }
  for (const m of membros) if (m.email && !lista.some(l => l.value === m.email)) lista.push({ value: m.email, label: m.nome, description: m.email, avatar: avatar(m.nome) })
  // Contatos dos itens que a pessoa vê, como o autocompletar do HubSpot e do Gmail.
  for (const i of itens) {
    if (i.semAcesso) continue
    for (const c of contatosDoItem(i, config.value)) {
      if (c.email && !lista.some(l => l.value === c.email)) lista.push({ value: c.email, label: c.nome ?? c.email, description: `${c.email} · ${i.reference}`, avatar: avatar(c.nome ?? c.email) })
    }
  }
  const extras = [...rascunho.value.para].filter(e => !lista.some(l => l.value === e)).map(e => ({ value: e, label: e, description: '', avatar: avatar(e) }))
  return [...lista, ...extras]
})

function adicionarPara(e: string) {
  const v = e.trim()
  if (v && !rascunho.value.para.includes(v)) rascunho.value.para = [...rascunho.value.para, v]
}

const valido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

/* ---------- Vincular a item ---------- */

/**
 * Itens em que algum destinatário é contato (HubSpot, Pipedrive e monday
 * sugerem o registro pelo endereço). Item sem permissão não entra.
 */
const sugestoesDeItem = computed(() => {
  if (item.value || !rascunho.value.para.length) return []
  const para = new Set(rascunho.value.para.map(e => e.toLowerCase()))
  const achados: { id: number, reference: string, titulo: string, nome: string }[] = []
  for (const i of itens) {
    if (i.semAcesso) continue
    const c = contatosDoItem(i, config.value).find(x => x.email && para.has(x.email.toLowerCase()))
    if (c) achados.push({ id: i.id, reference: i.reference, titulo: i.titulo, nome: c.nome ?? c.email! })
  }
  return achados.slice(0, 3)
})

const buscaRef = ref<InstanceType<typeof BuscaDeItem> | null>(null)
const trocando = ref(false)

/** Escolha manual: a frase "vinculado porque você começou no item" sai. */
function vincular(id: number) {
  rascunho.value.itemId = id
  rascunho.value.origem = 'barra'
  trocando.value = false
}

function desvincular() {
  rascunho.value.itemId = null
  rascunho.value.origem = 'barra'
  trocando.value = false
}

/* ---------- Template ---------- */

watch(() => rascunho.value.modelo, (id) => {
  const m = modelos.find(x => x.id === id)
  if (!m) return
  rascunho.value.assunto = preencher(m.assunto, item.value, null)
  rascunho.value.corpo = m.corpo
})

/* ---------- Editor ---------- */

const ferramentas: EditorToolbarItem[][] = [
  [{ kind: 'undo', icon: 'i-lucide-undo-2' }, { kind: 'redo', icon: 'i-lucide-redo-2' }],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline' },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough' },
  ],
  [{ kind: 'bulletList', icon: 'i-lucide-list' }, { kind: 'orderedList', icon: 'i-lucide-list-ordered' }],
  // O link usa o popover do exemplo oficial (`_LinkDoEditor.vue`), não o `prompt()` do `kind: 'link'`.
  [{ slot: 'link' as const, icon: 'i-lucide-link' }],
]

/* ---------- Enviar ---------- */

const erros = ref<{ para?: string, corpo?: string, de?: string }>({})
const enviando = ref(false)

function validar() {
  const r = rascunho.value
  const e: typeof erros.value = {}
  if (!r.para.length) e.para = props.t.compositor.erroPara
  else if (r.para.some(x => !valido(x))) e.para = props.t.compositor.erroEmailInvalido(r.para.find(x => !valido(x))!)
  if (!r.corpo.replace(/<[^>]+>/g, '').trim()) e.corpo = props.t.compositor.erroCorpo
  if (!r.de) e.de = props.t.compositor.erroDe
  erros.value = e
  return !Object.keys(e).length
}

async function enviar() {
  if (!outlookIntegrado.value || !validar()) return
  enviando.value = true
  await new Promise(r => setTimeout(r, 900))
  enviando.value = false

  if (cenario.value === 'falha') {
    toast.add({ title: props.t.compositor.falhaTitulo, description: props.t.compositor.falhaDescricao, icon: 'i-lucide-circle-x', color: 'error' })
    return
  }

  const r = rascunho.value
  const novo: Email = {
    id: Date.now(),
    direcao: 'enviado',
    de: r.de!,
    para: r.para,
    cc: [...r.cc, ...r.cco],
    assunto: r.assunto || props.t.compositor.semAssunto,
    corpo: r.corpo,
    data: new Date(),
    // A resposta volta para o endereço do item; sem item, só para o Outlook da pessoa.
    caixa: enderecoDeResposta.value ?? r.de!,
    itemId: r.itemId,
    anexos: r.anexos,
    lido: true,
    autor: EU.id,
  }
  emails.value = [novo, ...emails.value]

  const vinculado = item.value
  descartarRascunho()
  toast.add({
    title: props.t.compositor.enviadoTitulo,
    description: vinculado ? props.t.compositor.enviadoComItem(vinculado.reference) : props.t.compositor.enviadoSemItem(novo.de),
    icon: 'i-lucide-send',
    color: 'success',
    actions: [vinculado
      ? { label: props.t.compositor.verNoItem, color: 'neutral', variant: 'outline', onClick: () => abrirItem(vinculado.id, 'mailbox') }
      : { label: props.t.compositor.verEmEmails, color: 'neutral', variant: 'outline', onClick: () => ir('emails') }],
  })
}

function descartar() {
  const copia = structuredClone(toRaw(rascunho.value))
  descartarRascunho()
  toast.add({
    title: props.t.compositor.descartado,
    icon: 'i-lucide-trash-2',
    color: 'neutral',
    actions: [{ label: props.t.compositor.desfazer, color: 'neutral', variant: 'outline', onClick: () => { rascunho.value = copia; compositorAberto.value = true } }],
  })
}

function anexar() {
  const nomes = ['proposta-comercial.pdf', 'minuta-v4.docx', 'planilha-de-precos.xlsx']
  const proximo = nomes.find(n => !rascunho.value.anexos.includes(n))
  if (proximo) rascunho.value.anexos = [...rascunho.value.anexos, proximo]
}

watch(compositorAberto, (aberto) => {
  if (aberto) {
    erros.value = {}
    trocando.value = false
  }
})

const expandido = ref(false)

/**
 * Foco ao abrir: no "Para" quando está vazio; com destinatário pronto (aberto
 * do item), no texto. Como o Gmail. Sem isso o foco caía no Expandir, a dica
 * dele abria e o 1º Esc só fechava a dica.
 */
const campoPara = useTemplateRef<{ inputRef: HTMLInputElement | null }>('campoPara')
const campoTexto = useTemplateRef<{ editor?: { commands: { focus: (p?: string) => void } } }>('campoTexto')
function focarAoAbrir(e: Event) {
  e.preventDefault()
  nextTick(() => {
    if (rascunho.value.para.length && campoTexto.value?.editor) campoTexto.value.editor.commands.focus('end')
    else campoPara.value?.inputRef?.focus()
  })
}

const temConteudo = computed(() => !!(rascunho.value.para.length || rascunho.value.assunto || rascunho.value.corpo.replace(/<[^>]+>/g, '').trim()))

/** Ctrl+Enter envia, como Gmail, Outlook e Close. Vale dentro do editor. */
defineShortcuts({
  meta_enter: { usingInput: true, handler: () => { if (compositorAberto.value && !enviando.value) enviar() } },
})

const dicaDeOrigem = computed(() => {
  const o = rascunho.value.origem
  if (!item.value) return null
  if (o === 'item' || o === 'responder') return props.t.compositor.vinculadoPeloItem
  if (o === 'tarefa') return props.t.compositor.vinculadoPelaTarefa
  return null
})
</script>

<template>
  <!--
    Sem camada escura e sem travar a página (modal=false): o compositor fica
    aberto enquanto a pessoa consulta o item, como no Salesforce e no Gmail.
    Fechar não perde nada: o rascunho vira a barra do rodapé (_RascunhoMinimizado).
  -->
  <USlideover
    v-model:open="compositorAberto"
    :title="t.compositor.titulo"
    :overlay="false"
    :modal="false"
    :content="{ onOpenAutoFocus: focarAoAbrir }"
    :ui="{ content: expandido ? 'max-w-5xl' : 'max-w-2xl', body: 'flex flex-col gap-4', footer: 'justify-between' }"
  >
    <template #actions>
      <UTooltip :text="expandido ? t.compositor.reduzir : t.compositor.expandir">
        <UButton
          :icon="expandido ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
          color="neutral"
          variant="ghost"
          size="sm"
          :aria-label="expandido ? t.compositor.reduzir : t.compositor.expandir"
          :class="marca"
          @click="expandido = !expandido"
        />
      </UTooltip>
      <UTooltip :text="t.compositor.minimizar">
        <UButton icon="i-lucide-minus" color="neutral" variant="ghost" size="sm" :aria-label="t.compositor.minimizar" :class="marca" @click="compositorAberto = false" />
      </UTooltip>
    </template>
    <template #body>
      <!-- Sem conta integrada: o mesmo aviso da Mail Box de hoje -->
      <UEmpty
        v-if="!outlookIntegrado"
        icon="i-lucide-mail-x"
        :title="t.compositor.semContaTitulo"
        :description="t.compositor.semContaDescricao"
        :actions="[{ label: t.compositor.integrarContas, icon: 'i-lucide-plug', onClick: integrar }]"
        variant="naked"
        class="flex-1"
      />

      <template v-else>
      <!-- De (proposta: a conta existe, mas a tela de hoje não mostra) -->
      <UFormField :label="t.compositor.de" :error="erros.de" :class="marca">
        <div class="flex items-center gap-2 rounded-md border border-default px-2.5 py-1.5 text-sm">
          <UIcon name="i-lucide-mail" class="size-4 shrink-0 text-muted" />
          <span class="truncate text-highlighted">{{ rascunho.de }}</span>
          <span class="ml-auto shrink-0 text-xs text-muted">{{ t.compositor.suaConta }}</span>
        </div>
        <template #help>
          <span v-if="enderecoDeResposta" class="flex flex-col gap-0.5">
            <span>{{ t.compositor.responderParaItem }}</span>
            <span class="truncate font-mono text-xs">{{ enderecoDeResposta }}</span>
          </span>
          <span v-else>{{ t.compositor.respostasNoSeuOutlook }}</span>
        </template>
      </UFormField>

      <!-- Para -->
      <UFormField :label="t.compositor.para" required :error="erros.para">
        <UInputMenu
          ref="campoPara"
          v-model="rascunho.para"
          :items="sugestoes"
          value-key="value"
          multiple
          create-item="always"
          :placeholder="t.compositor.paraPlaceholder"
          class="w-full"
          :ui="{ tagsItem: 'max-w-64' }"
          @create="adicionarPara"
        >
          <template #create-item-label="{ item: e }">
            {{ t.compositor.usarEndereco(e) }}
          </template>
        </UInputMenu>
      </UFormField>

      <UButton
        v-if="!rascunho.mostrarCopia"
        :label="t.compositor.adicionarEmCopia"
        color="neutral"
        variant="link"
        size="sm"
        class="-mt-2 self-start px-0"
        @click="rascunho.mostrarCopia = true"
      />
      <div v-else class="grid gap-4 sm:grid-cols-2">
        <UFormField :label="t.compositor.cc">
          <UInputTags v-model="rascunho.cc" :placeholder="t.compositor.emailPlaceholder" class="w-full" />
        </UFormField>
        <UFormField :label="t.compositor.cco">
          <UInputTags v-model="rascunho.cco" :placeholder="t.compositor.emailPlaceholder" class="w-full" />
        </UFormField>
      </div>

      <UFormField :label="t.compositor.template">
        <USelect v-model="rascunho.modelo" :items="modelos.map(m => ({ value: m.id, label: m.nome }))" :placeholder="t.compositor.templatePlaceholder" class="w-full" />
      </UFormField>

      <UFormField :label="t.compositor.assunto">
        <UInput v-model="rascunho.assunto" :placeholder="t.compositor.assuntoPlaceholder" class="w-full" />
      </UFormField>

      <!-- PROPOSTA: vincular a item, separado dos campos do e-mail -->
      <section class="rounded-lg border border-primary/25 bg-primary/5 p-3" :class="marca" :aria-label="t.compositor.vincularTitulo">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-link-2" class="size-4 text-primary" />
          <span class="text-sm font-medium text-highlighted">{{ t.compositor.vincularTitulo }}</span>
          <span class="text-sm text-muted">{{ t.compositor.opcional }}</span>
          <UTooltip :text="t.compositor.vincularDica" :content="{ side: 'top' }">
            <UIcon name="i-lucide-info" class="size-4 text-muted" />
          </UTooltip>
        </div>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-[.98] opacity-0"
          mode="out-in"
        >
          <!-- Vinculado -->
          <div v-if="item && !trocando" :key="item.id" class="mt-2 flex items-center gap-3 rounded-md border border-default bg-default p-2.5">
            <UIcon name="i-lucide-circle-check" class="size-5 shrink-0 text-success" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-highlighted">{{ item.titulo }}</span>
              <span class="block truncate text-xs text-muted">{{ item.reference }} · {{ categoria?.name }}</span>
            </span>
            <UButton :label="t.compositor.trocar" color="neutral" variant="ghost" size="xs" @click="trocando = true; nextTick(() => buscaRef?.focar())" />
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.compositor.desvincular" @click="desvincular" />
          </div>

          <!-- Buscando -->
          <div v-else key="busca" class="mt-2">
            <div v-if="sugestoesDeItem.length && !trocando" class="mb-2 flex flex-wrap items-center gap-1.5">
              <span class="text-xs text-muted">{{ t.compositor.sugestoes }}</span>
              <UTooltip v-for="sug in sugestoesDeItem" :key="sug.id" :text="t.compositor.sugestaoMotivo(sug.nome)">
                <UButton
                  :label="`${sug.reference} · ${sug.titulo}`"
                  icon="i-lucide-sparkles"
                  color="primary"
                  variant="soft"
                  size="xs"
                  class="max-w-64"
                  :ui="{ label: 'truncate' }"
                  @click="vincular(sug.id)"
                />
              </UTooltip>
            </div>
            <BuscaDeItem ref="buscaRef" :t="t" @escolher="vincular" />
            <div class="mt-1.5 flex items-center justify-between gap-2">
              <p class="text-xs text-muted">
                {{ t.compositor.vincularAjuda }}
              </p>
              <UButton v-if="trocando" :label="t.compositor.cancelar" color="neutral" variant="link" size="xs" class="px-0" @click="trocando = false" />
            </div>
          </div>
        </Transition>

        <p v-if="dicaDeOrigem && !trocando" class="mt-1.5 text-xs text-muted">
          {{ dicaDeOrigem }}
        </p>
        <p v-if="item && categoria && !categoria.temMailBox" class="mt-1.5 flex items-center gap-1 text-xs text-warning">
          <UIcon name="i-lucide-triangle-alert" class="size-3.5" />{{ t.compositor.semMailBox(categoria.name) }}
        </p>
      </section>

      <!-- Mensagem -->
      <UFormField :label="t.compositor.mensagem" required :error="erros.corpo">
        <div class="overflow-hidden rounded-md border border-default focus-within:border-primary" :class="erros.corpo ? 'border-error' : ''">
          <ClientOnly>
            <UEditor
              ref="campoTexto"
              v-slot="{ editor }"
              v-model="rascunho.corpo"
              content-type="html"
              :placeholder="t.compositor.mensagemPlaceholder"
              class="min-h-48"
              :ui="{ base: 'min-h-40 px-4 py-3 text-sm' }"
            >
              <UEditorToolbar :editor="editor" :items="ferramentas" class="border-b border-default bg-elevated/40 px-2 py-1">
                <template #link>
                  <LinkDoEditor :editor="editor" :t="t" />
                </template>
              </UEditorToolbar>
            </UEditor>
          </ClientOnly>
        </div>
      </UFormField>

      <div v-if="rascunho.anexos.length" class="flex flex-wrap gap-1.5">
        <UBadge v-for="a in rascunho.anexos" :key="a" color="neutral" variant="outline" class="gap-1">
          <UIcon name="i-lucide-paperclip" class="size-3.5" />{{ a }}
          <UButton icon="i-lucide-x" color="neutral" variant="link" size="xs" class="-mr-1 p-0" :aria-label="t.compositor.removerAnexo(a)" @click="rascunho.anexos = rascunho.anexos.filter(x => x !== a)" />
        </UBadge>
      </div>
      </template>
    </template>

    <template v-if="outlookIntegrado" #footer>
      <div class="flex items-center gap-1">
        <UButton :label="t.compositor.anexarArquivo" icon="i-lucide-paperclip" color="neutral" variant="ghost" @click="anexar" />
        <UButton :label="t.compositor.inserirAssinatura" icon="i-lucide-signature" color="neutral" variant="ghost" @click="inserirAssinatura" />
        <span v-if="temConteudo" class="flex items-center gap-1 text-xs text-muted">
          <UIcon name="i-lucide-cloud-check" class="size-3.5" />{{ t.compositor.rascunhoSalvo }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <UButton :label="t.compositor.descartar" color="neutral" variant="outline" @click="descartar" />
        <UTooltip :text="t.compositor.enviar" :kbds="['meta', 'enter']">
          <UButton :label="t.compositor.enviar" icon="i-lucide-send" :loading="enviando" @click="enviar" />
        </UTooltip>
      </div>
    </template>
  </USlideover>
</template>
