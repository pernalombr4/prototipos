<script setup lang="ts">
/**
 * PROPOSTA. A Mail Box, repaginada, numa peça só para o item e para a tarefa.
 *
 * Hoje (código do develop, 17/11/2026) ela é uma pasta que alguém precisa
 * adicionar na categoria, mostra o endereço do item e o botão "Novo E-mail",
 * separa Recebidos e Enviados e abre o e-mail numa gaveta. Não tem responder:
 * a função está desligada no código.
 *
 * Fase 1 (só tela, sobre o que já existe):
 *  - a pasta vem em todo item, sem configuração;
 *  - "Novo e-mail" com rótulo, no lugar do lápis;
 *  - "Responder" ao passar o mouse e no e-mail aberto;
 *  - na tarefa, os e-mails do item da tarefa.
 * Fase 2: "Encaminhar" e a resposta na mesma conversa.
 * Fase 3: os e-mails da própria tarefa ("Desta tarefa" e "Do item").
 */
import type { Textos } from './textos'
import { type Email, type TarefaDoProtótipo, caixas, enderecoDoItem, itemPorId, membroPorId, tarefas } from './mocks'
import { contatosDoItem, useComunicacao, useMarcaDeProposta } from './estado'
import { useCopiar } from './atalhos'

const props = defineProps<{
  t: Textos
  /** O item dono da caixa. Nulo só na Fase 3, em tarefa sem item. */
  itemId: number | null
  /** Aberta de dentro de uma tarefa. */
  tarefa?: TarefaDoProtótipo | null
  /** Dentro do painel da tarefa: menos respiro. */
  compacta?: boolean
}>()

const { emails, config, fase, registrado, abrirCompositor } = useComunicacao()
const { copiar, copiado } = useCopiar()
const marca = useMarcaDeProposta()
const idioma = useIdioma()

const item = computed(() => itemPorId(props.itemId))

/** Fase 3 numa tarefa: "Desta tarefa" ou "Do item". */
const recorte = ref<'tarefa' | 'item'>('tarefa')
const porTarefa = computed(() => fase.value >= 3 && !!props.tarefa)
watch(() => props.tarefa?.id, () => (recorte.value = 'tarefa'))

const daCaixa = computed(() => emails.value
  .filter(registrado)
  // O e-mail enviado pelo sistema não entra na Mail Box do item, como hoje.
  .filter(e => !e.sistema)
  .filter((e) => {
    if (porTarefa.value && (recorte.value === 'tarefa' || !item.value)) return e.tarefaId === props.tarefa!.id
    return e.itemId === props.itemId
  })
  .sort((a, b) => +b.data - +a.data))

const pasta = ref<'recebido' | 'enviado'>('recebido')
const lista = computed(() => daCaixa.value.filter(e => e.direcao === pasta.value))
const contagem = computed(() => ({
  recebido: daCaixa.value.filter(e => e.direcao === 'recebido' && !e.lido).length,
  enviado: daCaixa.value.filter(e => e.direcao === 'enviado').length,
}))

const aberto = ref<number | null>(null)
const formato = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }))

function iniciais(s: string) {
  return s.split(/[\s.@]/).filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join('')
}
function trecho(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
function nomeDaCaixa(endereco: string) {
  return caixas.find(c => c.email === endereco)?.nome ?? null
}

function abrir(e: Email) {
  aberto.value = aberto.value === e.id ? null : e.id
  if (!e.lido) emails.value = emails.value.map(x => x.id === e.id ? { ...x, lido: true } : x)
}

function marcarNaoLido(e: Email) {
  emails.value = emails.value.map(x => x.id === e.id ? { ...x, lido: false } : x)
  aberto.value = null
}

const tarefaDoVinculo = computed(() => fase.value >= 3 ? props.tarefa?.id ?? null : null)

function novo() {
  const c = item.value ? contatosDoItem(item.value, config.value).find(x => x.email) : null
  abrirCompositor({
    itemId: props.itemId,
    tarefaId: tarefaDoVinculo.value,
    para: c?.email ? [c.email] : [],
    origem: props.tarefa ? 'tarefa' : 'item',
  })
}

/** Responder e encaminhar levam o texto original citado, como todo app de e-mail. */
function responder(e: Email, encaminhar = false) {
  const prefixo = encaminhar ? 'Enc:' : 'Re:'
  abrirCompositor({
    itemId: e.itemId,
    tarefaId: fase.value >= 3 ? e.tarefaId ?? tarefaDoVinculo.value : null,
    para: encaminhar ? [] : [e.direcao === 'recebido' ? e.de : e.para[0]!],
    assunto: `${prefixo} ${e.assunto.replace(/^(Re|Enc):\s*/i, '')}`,
    corpo: `<p></p><blockquote>${e.corpo}</blockquote>`,
    anexos: encaminhar ? [...e.anexos] : [],
    origem: encaminhar ? 'encaminhar' : 'responder',
  })
}

function tarefaRef(id: number | null | undefined) {
  return id ? tarefas.find(x => x.id === id)?.reference ?? null : null
}
</script>

<template>
  <div class="flex flex-col" :class="compacta ? 'gap-3' : 'gap-4'">
    <!-- Cabeçalho: o endereço da caixa e o Novo e-mail -->
    <div class="flex flex-wrap items-center gap-2">
      <template v-if="item">
        <UIcon name="i-lucide-at-sign" class="size-4 shrink-0 text-muted" />
        <span class="min-w-0 truncate font-mono text-xs text-toned" :title="enderecoDoItem(item)">{{ enderecoDoItem(item) }}</span>
        <UTooltip :text="t.item.copiarEndereco">
          <UButton
            :icon="copiado === `caixa-${item.id}` ? 'i-lucide-check' : 'i-lucide-copy'"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t.item.copiarEndereco"
            @click="copiar(`caixa-${item.id}`, enderecoDoItem(item), enderecoDoItem(item))"
          />
        </UTooltip>
      </template>
      <!-- PROPOSTA: botão com rótulo no lugar do lápis -->
      <UButton
        :label="t.item.novoEmail"
        icon="i-lucide-mail-plus"
        size="sm"
        class="ml-auto"
        :class="marca"
        @click="novo"
      />
    </div>

    <!-- Fase 3: e-mails da tarefa ou do item -->
    <UTabs
      v-if="porTarefa && item"
      v-model="recorte"
      :items="[
        { value: 'tarefa', label: t.item.dataTarefa, icon: 'i-lucide-clipboard-check' },
        { value: 'item', label: t.item.doItem(item.reference), icon: 'i-lucide-file' },
      ]"
      :content="false"
      size="xs"
      color="neutral"
      :class="marca"
    />

    <UTabs
      v-model="pasta"
      :items="[
        { value: 'recebido', label: t.item.recebidos, icon: 'i-lucide-inbox', badge: contagem.recebido || undefined },
        { value: 'enviado', label: t.item.enviados, icon: 'i-lucide-send' },
      ]"
      :content="false"
      variant="link"
      size="sm"
      class="w-full"
      :ui="{ list: 'w-full', trigger: 'flex-1 justify-center' }"
    />

    <ul v-if="lista.length" class="flex flex-col divide-y divide-default overflow-hidden rounded-lg border border-default">
      <li
        v-for="(e, i) in lista"
        :key="e.id"
        class="group/email animate-[entrada_.25s_ease-out_both]"
        :style="{ animationDelay: `${i * 35}ms` }"
      >
        <div class="relative flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-elevated/60" :class="aberto === e.id ? 'bg-elevated/40' : ''">
          <button
            type="button"
            class="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
            :aria-expanded="aberto === e.id"
            :aria-label="e.assunto"
            @click="abrir(e)"
          />
          <span v-if="!e.lido" class="mt-3.5 size-2 shrink-0 rounded-full bg-primary" role="img" :aria-label="t.emails.naoLido" />
          <UAvatar
            :text="iniciais(e.direcao === 'recebido' ? e.de : (membroPorId(e.autor)?.nome ?? e.de))"
            size="sm"
            :class="e.lido ? 'ms-4' : ''"
          />
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-2">
              <span class="truncate text-sm" :class="e.lido ? 'text-toned' : 'font-semibold text-highlighted'">
                {{ e.direcao === 'recebido' ? e.de : t.item.para(e.para.join(', ')) }}
              </span>
              <UIcon v-if="e.anexos.length" name="i-lucide-paperclip" class="size-3.5 shrink-0 text-muted" />
              <UBadge v-if="fase >= 3 && tarefaRef(e.tarefaId) && !(porTarefa && recorte === 'tarefa')" :label="tarefaRef(e.tarefaId)!" icon="i-lucide-clipboard-check" color="neutral" variant="subtle" size="xs" class="shrink-0" />
              <span class="ml-auto shrink-0 text-xs text-muted transition-opacity group-hover/email:opacity-0 group-focus-within/email:opacity-0">{{ formato.format(e.data) }}</span>
            </span>
            <span class="block truncate text-sm text-highlighted">{{ e.assunto }}</span>
            <span class="block truncate text-xs text-muted">
              <template v-if="e.direcao === 'enviado' && e.autor">{{ nomeDaCaixa(e.de) ? t.item.enviadoPelaCaixa(membroPorId(e.autor)?.nome ?? '', nomeDaCaixa(e.de)!) : t.item.enviadoPor(membroPorId(e.autor)?.nome ?? '') }} · </template>{{ trecho(e.corpo) }}
            </span>
          </span>
          <!-- PROPOSTA: as ações ao passar o mouse, sem abrir o e-mail -->
          <span class="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-md bg-default/95 p-0.5 opacity-0 shadow-sm ring ring-default transition-opacity group-hover/email:opacity-100 group-focus-within/email:opacity-100" :class="marca">
            <UTooltip :text="t.item.responder">
              <UButton icon="i-lucide-reply" color="neutral" variant="ghost" size="xs" :aria-label="`${t.item.responder}: ${e.assunto}`" @click.stop="responder(e)" />
            </UTooltip>
            <UTooltip v-if="fase >= 2" :text="t.emails.acoes.encaminhar">
              <UButton icon="i-lucide-forward" color="neutral" variant="ghost" size="xs" :aria-label="`${t.emails.acoes.encaminhar}: ${e.assunto}`" @click.stop="responder(e, true)" />
            </UTooltip>
          </span>
        </div>

        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="-translate-y-1 opacity-0">
          <div v-if="aberto === e.id" class="border-t border-default bg-default px-4 py-3">
            <dl class="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1 text-xs">
              <dt class="text-muted">{{ t.emails.col.de }}</dt>
              <dd class="break-all text-toned">{{ e.de }}</dd>
              <dt class="text-muted">{{ t.emails.col.para }}</dt>
              <dd class="break-all text-toned">{{ e.para.join(', ') }}</dd>
              <template v-if="e.cc.length">
                <dt class="text-muted">{{ t.compositor.cc }}</dt>
                <dd class="break-all text-toned">{{ e.cc.join(', ') }}</dd>
              </template>
            </dl>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="mt-3 text-sm text-default [&_blockquote]:border-l-2 [&_blockquote]:border-default [&_blockquote]:pl-3 [&_p]:my-1.5" v-html="e.corpo" />
            <div v-if="e.anexos.length" class="mt-2 flex flex-wrap gap-1.5">
              <UBadge v-for="a in e.anexos" :key="a" :label="a" icon="i-lucide-paperclip" color="neutral" variant="outline" size="sm" />
            </div>
            <div class="mt-3 flex flex-wrap gap-2">
              <UButton :label="t.item.responder" icon="i-lucide-reply" color="neutral" variant="outline" size="xs" @click="responder(e)" />
              <UButton v-if="fase >= 2" :label="t.emails.acoes.encaminhar" icon="i-lucide-forward" color="neutral" variant="outline" size="xs" @click="responder(e, true)" />
              <UButton v-if="e.direcao === 'recebido'" :label="t.emails.acoes.marcarNaoLido" icon="i-lucide-mail" color="neutral" variant="ghost" size="xs" @click="marcarNaoLido(e)" />
            </div>
          </div>
        </Transition>
      </li>
    </ul>

    <UEmpty
      v-else
      variant="naked"
      icon="i-lucide-inbox"
      :title="t.item.nenhumEmail"
      :description="porTarefa && item && recorte === 'tarefa' ? t.item.nenhumEmailDaTarefa : t.item.nenhumEmailDica"
      size="sm"
      class="py-6"
      :actions="[{ label: t.item.novoEmail, icon: 'i-lucide-mail-plus', color: 'neutral', variant: 'outline', onClick: novo }]"
    />
  </div>
</template>
