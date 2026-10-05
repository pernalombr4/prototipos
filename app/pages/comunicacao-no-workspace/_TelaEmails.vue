<script setup lang="ts">
/**
 * PROPOSTA. A área de e-mail do workspace, na seção Membro do menu.
 *
 * Parte do que já existe escondido: a tela nativa "Emails Recebidos"
 * (`/itemEmails`, colunas Ticket, Data, de, Assunto, box, Tipo), que hoje só
 * se acha no editor de menus (pesquisa de UX, S2-F1). Ganha:
 *  - Enviados, ao lado de Recebidos;
 *  - a coluna "Item", com o vínculo clicável;
 *  - vincular depois um e-mail que chegou sem item;
 *  - Novo e-mail, Responder e Encaminhar pelo mesmo compositor.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { type Email, itemPorId, itens, membroPorId } from './mocks'
import { contatosDoItem, useComunicacao } from './estado'
import BuscaDeItem from './_BuscaDeItem.vue'

const props = defineProps<{ t: Textos }>()

const { emails, config, abrirCompositor, abrirItem } = useComunicacao()
const idioma = useIdioma()
const toast = useToast()

const caixa = ref<'recebido' | 'enviado'>('recebido')
const vinculo = ref<'todos' | 'com' | 'sem'>('todos')
const busca = ref('')

const contagem = computed(() => ({
  recebido: emails.value.filter(e => e.direcao === 'recebido').length,
  enviado: emails.value.filter(e => e.direcao === 'enviado').length,
  naoLidos: emails.value.filter(e => e.direcao === 'recebido' && !e.lido).length,
}))

const lista = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return emails.value
    .filter(e => e.direcao === caixa.value)
    .filter(e => vinculo.value === 'todos' || (vinculo.value === 'com' ? e.itemId : !e.itemId))
    .filter(e => !q || `${e.assunto} ${e.de} ${e.para.join(' ')} ${itemPorId(e.itemId)?.reference ?? ''}`.toLowerCase().includes(q))
    .sort((a, b) => +b.data - +a.data)
})

const formato = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }))

interface Linha extends Record<string, unknown> { id: number, email: Email }
const linhas = computed<Linha[]>(() => lista.value.map(e => ({ id: e.id, email: e })))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'pessoa', label: caixa.value === 'recebido' ? props.t.emails.de : props.t.emails.para },
  { key: 'assunto', label: props.t.emails.assunto },
  { key: 'item', label: props.t.emails.item },
  { key: 'caixa', label: caixa.value === 'recebido' ? props.t.emails.caixa : props.t.emails.enviadoPor },
  { key: 'data', label: props.t.emails.data },
])

/* ---------- leitura ---------- */

const aberto = ref<Email | null>(null)
const leitura = computed({ get: () => !!aberto.value, set: (v) => { if (!v) aberto.value = null } })
const vinculando = ref(false)

function abrir(e: Email, vincularAgora = false) {
  aberto.value = e
  vinculando.value = vincularAgora
  if (!e.lido) emails.value = emails.value.map(x => x.id === e.id ? { ...x, lido: true } : x)
}

/**
 * Sugestão pelo remetente (ou destinatário, nos enviados): itens em que esse
 * endereço é contato. Pipedrive, HubSpot e monday sugerem antes da busca.
 */
const sugestoes = computed(() => {
  const e = aberto.value
  if (!e || e.itemId) return []
  const enderecos = new Set((e.direcao === 'recebido' ? [e.de] : e.para).map(x => x.toLowerCase()))
  return itens
    .filter(i => !i.semAcesso && contatosDoItem(i, config.value).some(c => c.email && enderecos.has(c.email.toLowerCase())))
    .slice(0, 3)
})

function vincular(id: number) {
  const e = aberto.value
  if (!e) return
  emails.value = emails.value.map(x => x.id === e.id ? { ...x, itemId: id } : x)
  aberto.value = { ...e, itemId: id }
  vinculando.value = false
  toast.add({ title: props.t.emails.vinculadoTitulo, description: props.t.emails.vinculadoDescricao(itemPorId(id)!.reference), icon: 'i-lucide-link-2', color: 'success' })
}

function responder(e: Email, encaminhar = false) {
  aberto.value = null
  abrirCompositor({
    itemId: e.itemId,
    para: encaminhar ? [] : [e.direcao === 'recebido' ? e.de : e.para[0]!],
    assunto: `${encaminhar ? 'Enc:' : 'Re:'} ${e.assunto.replace(/^(Re|Enc):\s*/i, '')}`,
    corpo: encaminhar ? `<p></p><blockquote>${e.corpo}</blockquote>` : '',
    origem: 'responder',
  })
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-3">
      <span class="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        <UIcon name="i-lucide-mail" class="size-4" />
      </span>
      <h1 class="text-lg font-semibold text-highlighted">
        {{ t.emails.titulo }}
      </h1>
      <UButton :label="t.casca.novoEmail" icon="i-lucide-mail-plus" class="ml-auto" @click="abrirCompositor({ origem: 'emails' })" />
    </div>

    <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2">
      <UTabs
        v-model="caixa"
        :items="[
          { value: 'recebido', label: t.emails.recebidos, badge: contagem.naoLidos || undefined, icon: 'i-lucide-inbox' },
          { value: 'enviado', label: t.emails.enviados, icon: 'i-lucide-send' },
        ]"
        :content="false"
        variant="link"
        size="sm"
      />
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.emails.pesquisar" size="sm" variant="none" class="w-64" />
      <UFieldGroup size="sm" class="ml-auto">
        <UButton
          v-for="v in (['todos', 'com', 'sem'] as const)"
          :key="v"
          :label="t.emails.vinculo[v]"
          :color="vinculo === v ? 'primary' : 'neutral'"
          :variant="vinculo === v ? 'soft' : 'outline'"
          @click="vinculo = v"
        />
      </UFieldGroup>
    </div>

    <div class="animate-[entrada_.25s_ease-out]">
      <EnTable
        :key="caixa"
        :columns="colunas"
        :rows="linhas"
        :locale="idioma"
        :empty-state="{ icon: 'i-lucide-inbox', title: t.emails.vazioTitulo, description: t.emails.vazioDescricao }"
        @row-click="(r) => abrir((r as Linha).email)"
      >
        <template #cell-pessoa="{ row }">
          <span class="flex items-center gap-2">
            <span v-if="!(row as Linha).email.lido" role="img" class="size-2 shrink-0 rounded-full bg-primary" :aria-label="t.emails.naoLido" />
            <span class="block max-w-56 truncate text-sm" :class="(row as Linha).email.lido ? 'text-toned' : 'font-semibold text-highlighted'">
              {{ caixa === 'recebido' ? (row as Linha).email.de : (row as Linha).email.para.join(', ') }}
            </span>
          </span>
        </template>
        <template #cell-assunto="{ row }">
          <span class="flex max-w-96 items-center gap-1.5">
            <span class="truncate text-sm text-highlighted">{{ (row as Linha).email.assunto }}</span>
            <UIcon v-if="(row as Linha).email.anexos.length" name="i-lucide-paperclip" class="size-3.5 shrink-0 text-muted" />
          </span>
        </template>
        <template #cell-item="{ row }">
          <UButton
            v-if="itemPorId((row as Linha).email.itemId)"
            :label="itemPorId((row as Linha).email.itemId)!.reference"
            icon="i-lucide-link-2"
            color="info"
            variant="subtle"
            size="xs"
            class="font-mono"
            @click.stop="abrirItem((row as Linha).email.itemId!, 'mailbox')"
          />
          <!-- "Link item" no hover, como o Pipedrive: vincula sem abrir a leitura antes -->
          <span v-else class="group/vinculo flex items-center gap-1.5">
            <span class="text-sm text-dimmed">{{ t.emails.semItem }}</span>
            <UButton
              :label="t.emails.vincular"
              icon="i-lucide-link-2"
              color="primary"
              variant="ghost"
              size="xs"
              class="opacity-60 transition-opacity group-hover/vinculo:opacity-100 focus-visible:opacity-100"
              @click.stop="abrir((row as Linha).email, true)"
            />
          </span>
        </template>
        <template #cell-caixa="{ row }">
          <span class="block max-w-56 truncate text-xs text-muted">
            {{ caixa === 'recebido' ? (row as Linha).email.caixa : (membroPorId((row as Linha).email.autor)?.nome ?? '-') }}
          </span>
        </template>
        <template #cell-data="{ row }">
          <span class="text-sm text-muted">{{ formato.format((row as Linha).email.data) }}</span>
        </template>
      </EnTable>
    </div>

    <!-- Leitura -->
    <USlideover v-model:open="leitura" :title="aberto?.assunto" :ui="{ content: 'max-w-xl' }">
      <template #body>
        <div v-if="aberto" class="flex flex-col gap-4">
          <dl class="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-1.5 text-sm">
            <dt class="text-muted">
              {{ t.emails.de }}
            </dt>
            <dd class="break-all text-highlighted">
              {{ aberto.de }}
            </dd>
            <dt class="text-muted">
              {{ t.emails.para }}
            </dt>
            <dd class="break-all text-highlighted">
              {{ aberto.para.join(', ') }}
            </dd>
            <template v-if="aberto.cc.length">
              <dt class="text-muted">
                {{ t.compositor.cc }}
              </dt>
              <dd class="break-all text-highlighted">
                {{ aberto.cc.join(', ') }}
              </dd>
            </template>
            <dt class="text-muted">
              {{ t.emails.data }}
            </dt>
            <dd class="text-highlighted">
              {{ formato.format(aberto.data) }}
            </dd>
          </dl>

          <!-- O vínculo -->
          <div class="rounded-lg border border-primary/25 bg-primary/5 p-3">
            <p class="flex items-center gap-1.5 text-sm font-medium text-highlighted">
              <UIcon name="i-lucide-link-2" class="size-4 text-primary" />{{ t.compositor.vincularTitulo }}
            </p>
            <div v-if="itemPorId(aberto.itemId) && !vinculando" class="mt-2 flex items-center gap-2">
              <UButton
                :label="`${itemPorId(aberto.itemId)!.reference} · ${itemPorId(aberto.itemId)!.titulo}`"
                icon="i-lucide-file"
                color="neutral"
                variant="outline"
                size="sm"
                class="min-w-0"
                :ui="{ label: 'truncate' }"
                @click="abrirItem(aberto.itemId!, 'mailbox'); aberto = null"
              />
              <UButton :label="t.compositor.trocar" color="neutral" variant="ghost" size="xs" @click="vinculando = true" />
            </div>
            <div v-else class="mt-2">
              <div v-if="sugestoes.length" class="mb-2 flex flex-wrap items-center gap-1.5">
                <span class="text-xs text-muted">{{ t.emails.sugestoesPeloRemetente }}</span>
                <UButton
                  v-for="sug in sugestoes"
                  :key="sug.id"
                  :label="`${sug.reference} · ${sug.titulo}`"
                  icon="i-lucide-sparkles"
                  color="primary"
                  variant="soft"
                  size="xs"
                  class="max-w-64"
                  :ui="{ label: 'truncate' }"
                  @click="vincular(sug.id)"
                />
              </div>
              <BuscaDeItem :t="t" @escolher="vincular" />
              <p class="mt-1.5 text-xs text-muted">
                {{ t.emails.vincularDepois }}
              </p>
            </div>
          </div>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="rounded-lg border border-default p-4 text-sm text-default [&_blockquote]:border-l-2 [&_blockquote]:border-default [&_blockquote]:pl-3 [&_p]:my-1.5" v-html="aberto.corpo" />
          <div v-if="aberto.anexos.length" class="flex flex-wrap gap-1.5">
            <UBadge v-for="a in aberto.anexos" :key="a" :label="a" icon="i-lucide-paperclip" color="neutral" variant="outline" />
          </div>
        </div>
      </template>
      <template #footer>
        <div v-if="aberto" class="flex gap-2">
          <UButton :label="t.item.responder" icon="i-lucide-reply" @click="responder(aberto)" />
          <UButton :label="t.emails.encaminhar" icon="i-lucide-forward" color="neutral" variant="outline" @click="responder(aberto, true)" />
        </div>
      </template>
    </USlideover>
  </div>
</template>
