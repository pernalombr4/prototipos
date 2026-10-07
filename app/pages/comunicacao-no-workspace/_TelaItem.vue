<script setup lang="ts">
/**
 * A tela do item, como o develop mostra o item aberto e expandido: o painel
 * da esquerda (Identificação, Origem, Histórico) e as pastas em abas.
 *
 * PROPOSTA:
 *  - o cartão "Contato rápido" no topo do painel da esquerda;
 *  - na aba Mail Box, o lápis abre o compositor novo, com o item já vinculado.
 * A Visão Geral edita e o Salvar grava (em memória): é o fim da jornada de
 * "Cadastrar telefone", e o Contato rápido muda junto.
 * As pastas criadas para a exploração foram as do develop: Tarefas, Anexos,
 * Emails Automáticos, Mail Box, Notas e Campos.
 */
import type { Textos } from './textos'
import { agora, categoriaPorSlug, enderecoDoItem, itemPorId, membroPorId, tarefas } from './mocks'
import { contatosDoItem, useComunicacao, useMarcaDeProposta } from './estado'
import { useAtalhos, useCopiar } from './atalhos'
import AcoesDeContato from './_AcoesDeContato.vue'

const props = defineProps<{ t: Textos }>()

const { itemAberto, abaDoItem, emails, config, ir, abrirCompositor } = useComunicacao()
const { canaisEm, motivo } = useAtalhos()
const { copiar, copiado } = useCopiar()
const marca = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const item = computed(() => itemPorId(itemAberto.value))
const categoria = computed(() => item.value ? categoriaPorSlug(item.value.categoria) : null)

/* ---------- contato rápido ---------- */

const contatos = computed(() => item.value ? contatosDoItem(item.value, config.value) : [])
const comDado = computed(() => contatos.value.filter(c => c.email || c.telefone))
const escolhido = ref<string | undefined>()
watch(item, () => (escolhido.value = comDado.value[0]?.id), { immediate: true })
const contato = computed(() => comDado.value.find(c => c.id === escolhido.value) ?? null)

const opcoesDeContato = computed(() => comDado.value.map(c => ({
  value: c.id,
  label: c.nome ?? c.email ?? c.rotulo,
  description: c.rotulo,
  avatar: { text: iniciais(c.nome ?? c.email ?? '?'), size: '2xs' as const },
})))

function iniciais(s: string) {
  return s.split(/[\s.@]/).filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join('')
}

const mostrarContato = computed(() => canaisEm('item').length > 0)

/** O que falta ou está errado no contato, dito na tela e não só no tooltip. */
const aviso = computed(() => {
  const c = contato.value
  if (!c) return null
  if (!c.telefone) return { texto: props.t.item.semTelefoneAviso, acao: props.t.item.cadastrarTelefone }
  if (motivo('whatsapp', c)) return { texto: props.t.item.telefoneInvalidoAviso, acao: props.t.item.corrigirTelefone }
  if (!c.email) return { texto: props.t.item.semEmailAviso, acao: props.t.item.cadastrarEmail }
  return null
})

/** O campo da categoria que guardaria o dado que falta neste contato. */
const campoQueFalta = computed(() => {
  const i = item.value
  if (!i || !contato.value) return null
  const regra = config.value.porCategoria[i.categoria].contatos.find(c => c.id === contato.value!.id)
  if (!regra) return null
  const telefoneComProblema = !contato.value.telefone || !!motivo('whatsapp', contato.value)
  return telefoneComProblema ? regra.campoTelefone : (regra.campoEmail !== 'request_email' ? regra.campoEmail : null)
})

async function irParaCampo(campo: string) {
  abaDoItem.value = 'visao'
  await nextTick()
  await new Promise(r => setTimeout(r, 250))
  const el = document.getElementById(`campo-${campo}`) as HTMLInputElement | null
  el?.focus()
  el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}

/* ---------- abas ---------- */

const abas = computed(() => [
  { value: 'visao', label: props.t.item.abas.visao, icon: 'i-lucide-layers' },
  { value: 'comentarios', label: props.t.item.abas.comentarios, icon: 'i-lucide-message-circle' },
  { value: 'logs', label: props.t.item.abas.logs, icon: 'i-lucide-shield-check' },
  { value: 'tarefas', label: props.t.item.abas.tarefas, icon: 'i-lucide-clipboard-check' },
  { value: 'anexos', label: props.t.item.abas.anexos, icon: 'i-lucide-paperclip' },
  { value: 'automaticos', label: props.t.item.abas.automaticos, icon: 'i-lucide-mail' },
  ...(categoria.value?.temMailBox ? [{ value: 'mailbox', label: props.t.item.abas.mailbox, icon: 'i-lucide-mailbox' }] : []),
  { value: 'notas', label: props.t.item.abas.notas, icon: 'i-lucide-notebook-pen' },
])

/* ---------- mail box ---------- */

const caixa = ref<'recebido' | 'enviado'>('recebido')
const doItem = computed(() => emails.value
  .filter(e => e.itemId === item.value?.id)
  .sort((a, b) => +b.data - +a.data))
const daCaixa = computed(() => doItem.value.filter(e => e.direcao === caixa.value))
const contagem = computed(() => ({
  recebido: doItem.value.filter(e => e.direcao === 'recebido').length,
  enviado: doItem.value.filter(e => e.direcao === 'enviado').length,
}))
const aberto = ref<number | null>(null)

const formatoData = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))

function escrever() {
  if (!item.value) return
  const c = contatos.value.find(x => x.email)
  abrirCompositor({ itemId: item.value.id, para: c?.email ? [c.email] : [], origem: 'item' })
}

function responder(id: number) {
  const e = emails.value.find(x => x.id === id)
  if (!e || !item.value) return
  abrirCompositor({
    itemId: item.value.id,
    para: [e.direcao === 'recebido' ? e.de : e.para[0]!],
    assunto: e.assunto.startsWith('Re:') ? e.assunto : `Re: ${e.assunto}`,
    origem: 'responder',
  })
}

/* ---------- visão geral ---------- */

const camposVisiveis = computed(() => {
  const i = item.value
  if (!i) return []
  const sub = { contact_name: props.t.categoria.subNome, contact_email: props.t.categoria.subEmail, contact_phone: props.t.categoria.subTelefone } as Record<string, string>
  return Object.entries(i.data as Record<string, unknown>)
    .filter(([k]) => k !== 'vencimento')
    .flatMap(([k, v]) => v && typeof v === 'object'
      // Pessoa/Empresa: um campo por subcampo de contato.
      ? Object.entries(v as Record<string, unknown>).map(([s2, v2]) => ({ chave: `${k}.${s2}`, rotulo: `${props.t.item.campos[k] ?? k} › ${sub[s2] ?? s2}`, valor: v2 == null ? '' : String(v2) }))
      : [{ chave: k, rotulo: props.t.item.campos[k] ?? k, valor: v == null ? '' : typeof v === 'number' ? v.toLocaleString(idioma.value, { style: 'currency', currency: 'BRL' }) : String(v) }])
})

/* ---------- edição da visão geral ---------- */

const edicao = ref<Record<string, string>>({})
watch(camposVisiveis, cs => (edicao.value = Object.fromEntries(cs.map(c => [c.chave, c.valor]))), { immediate: true })

function salvarItem() {
  const i = item.value
  if (!i) return
  const data = i.data as Record<string, unknown>
  for (const c of camposVisiveis.value) {
    const novo = (edicao.value[c.chave] ?? '').trim()
    if (novo === c.valor) continue
    const [raiz, sub] = c.chave.split('.') as [string, string | undefined]
    if (typeof data[raiz] === 'number') continue // valor em moeda: fora do protótipo
    if (sub) data[raiz] = { ...((data[raiz] as Record<string, unknown> | null) ?? {}), [sub]: novo || null }
    else data[raiz] = novo || null
    if (raiz === 'titulo') i.titulo = novo
  }
  i.updated_at = agora()
  toast.add({ title: props.t.item.salvo, icon: 'i-lucide-check', color: 'success' })
}

function descartarEdicao() {
  edicao.value = Object.fromEntries(camposVisiveis.value.map(c => [c.chave, c.valor]))
}

const tarefasDoItem = computed(() => tarefas.filter(x => x.item === item.value?.id))
</script>

<template>
  <div v-if="item && categoria" class="flex min-h-[calc(100dvh-4rem)] flex-col lg:flex-row">
    <!-- ───────────── Painel da esquerda ───────────── -->
    <aside class="w-full shrink-0 border-b border-default p-4 lg:w-80 lg:border-b-0 lg:border-r">
      <div class="flex items-start gap-3">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-full border border-default text-muted">
          <UIcon name="i-lucide-file" class="size-5" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="break-all text-sm font-semibold text-highlighted">
            {{ item.reference }}
          </p>
          <p class="text-xs text-muted">
            {{ categoria.name }}
          </p>
        </div>
        <UDropdownMenu :items="[[{ label: t.item.editarVisualizacao, icon: 'i-lucide-sliders-horizontal' }, { label: t.item.imprimirPdf, icon: 'i-lucide-printer' }]]">
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.itens.acoes" />
        </UDropdownMenu>
      </div>
      <UBadge :label="categoria.name" icon="i-lucide-briefcase" color="neutral" variant="outline" size="sm" class="mt-3" />
      <p class="mt-2 text-sm text-highlighted">
        {{ item.titulo }}
      </p>

      <!-- PROPOSTA: contato rápido -->
      <section v-if="mostrarContato" class="mt-5 animate-[entrada_.3s_ease-out]" :class="marca">
        <h2 class="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          <span class="size-1 rounded-full bg-muted" />{{ t.item.contatoRapido }}
        </h2>
        <div class="rounded-lg border border-default p-3">
          <template v-if="comDado.length">
            <USelectMenu
              v-model="escolhido"
              :items="opcoesDeContato"
              value-key="value"
              :search-input="false"
              class="w-full"
              :ui="{ base: 'py-1.5' }"
              :aria-label="t.item.paraQuem"
            />
            <p v-if="contato" class="mt-1.5 truncate px-1 text-xs text-muted">
              {{ [contato.email, contato.telefone].filter(Boolean).join(' · ') }}
            </p>
            <!-- O motivo à vista: botão desabilitado não recebe foco, e o tooltip não chega a quem usa teclado. -->
            <div v-if="aviso" class="mt-1 flex flex-wrap items-center gap-x-1 px-1 text-xs text-warning">
              <UIcon name="i-lucide-info" class="size-3.5 shrink-0" />
              {{ aviso.texto }}
              <!-- O próximo passo, como o "+ Add phone number" do HubSpot: leva ao campo. -->
              <UButton
                v-if="campoQueFalta"
                :label="aviso.acao"
                color="primary"
                variant="link"
                size="xs"
                class="p-0"
                @click="irParaCampo(campoQueFalta)"
              />
            </div>
            <AcoesDeContato
              :t="t"
              :destino="contato"
              :item="item"
              lugar="item"
              tamanho="sm"
              bloco
              class="mt-3"
            />
            <p class="mt-3 text-xs leading-relaxed text-muted">
              {{ config.emailDoEnspace ? t.item.ajudaComEnspace : t.item.ajudaSemEnspace }}
            </p>
          </template>
          <UEmpty
            variant="naked"
            v-else
            icon="i-lucide-user-x"
            :title="t.item.semContatoTitulo"
            :description="t.item.semContatoDica"
            size="sm"
            :actions="[{ label: t.item.escolherCampos, color: 'neutral', variant: 'outline', size: 'xs', onClick: () => ir('categoria', { vista: 'atalhos' }) }]"
          />
        </div>
      </section>

      <!-- Cópia do develop -->
      <section class="mt-5">
        <h2 class="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          <span class="size-1 rounded-full bg-muted" />{{ t.item.identificacao }}
        </h2>
        <div class="flex items-start gap-2 rounded-lg border border-default p-3">
          <UIcon name="i-lucide-hash" class="mt-0.5 size-4 text-muted" />
          <div>
            <p class="text-[11px] uppercase text-muted">
              ID
            </p>
            <p class="text-sm font-medium text-highlighted">
              {{ item.id }}
            </p>
          </div>
        </div>
      </section>
      <section class="mt-5">
        <h2 class="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          <span class="size-1 rounded-full bg-muted" />{{ t.item.origem }}
        </h2>
        <div class="flex flex-col gap-3 rounded-lg border border-default p-3">
          <div class="flex items-start gap-2">
            <UIcon name="i-lucide-activity" class="mt-0.5 size-4 text-muted" />
            <div>
              <p class="text-[11px] uppercase text-muted">
                {{ t.item.status }}
              </p>
              <p class="text-sm font-medium text-highlighted">
                {{ t.etapa[item.etapa] }}
              </p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <UIcon name="i-lucide-mail" class="mt-0.5 size-4 text-muted" />
            <div class="min-w-0">
              <p class="text-[11px] uppercase text-muted">
                {{ t.item.emailDaSolicitacao }}
              </p>
              <p class="break-all text-sm font-medium text-highlighted">
                {{ item.request_email ?? '-' }}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section class="mt-5">
        <h2 class="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          <span class="size-1 rounded-full bg-muted" />{{ t.item.historico }}
        </h2>
        <div class="flex flex-col gap-3 rounded-lg border border-default p-3 text-sm">
          <div>
            <p class="text-[11px] uppercase text-muted">
              {{ t.item.criadoEm }}
            </p>
            <p class="font-medium text-highlighted">
              {{ formatoData.format(item.created_at) }}
            </p>
          </div>
          <div>
            <p class="text-[11px] uppercase text-muted">
              {{ t.item.atualizadoEm }}
            </p>
            <p class="font-medium text-highlighted">
              {{ formatoData.format(item.updated_at) }}
            </p>
          </div>
        </div>
      </section>
    </aside>

    <!-- ───────────── Pastas ───────────── -->
    <section class="min-w-0 flex-1">
      <UTabs
        v-model="abaDoItem"
        :items="abas"
        :content="false"
        variant="link"
        size="sm"
        class="border-b border-default px-2"
        :ui="{ list: 'overflow-x-auto border-b-0', trigger: 'shrink-0' }"
      />

      <!-- Visão geral (cópia) -->
      <div v-if="abaDoItem === 'visao'" class="grid max-w-3xl gap-4 p-5 animate-[entrada_.25s_ease-out]">
        <UFormField v-for="c in camposVisiveis" :key="c.chave" :label="c.rotulo">
          <UInput :id="`campo-${c.chave}`" v-model="edicao[c.chave]" class="w-full" />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton :label="t.item.sairSemSalvar" icon="i-lucide-undo-2" color="neutral" variant="ghost" @click="descartarEdicao" />
          <UButton :label="t.item.salvar" icon="i-lucide-save" @click="salvarItem" />
        </div>
      </div>

      <!-- Mail Box -->
      <div v-else-if="abaDoItem === 'mailbox'" class="p-4 animate-[entrada_.25s_ease-out]">
        <div class="flex items-center gap-2">
          <UBadge color="info" variant="subtle" class="max-w-full font-mono text-xs">
            <span class="truncate">{{ enderecoDoItem(item) }}</span>
          </UBadge>
          <UButton
            :icon="copiado === 'caixa' ? 'i-lucide-check' : 'i-lucide-copy'"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t.item.copiarEndereco"
            @click="copiar('caixa', enderecoDoItem(item), enderecoDoItem(item))"
          />
          <UTooltip :text="t.item.escreverEmail">
            <UButton icon="i-lucide-pencil" color="neutral" variant="soft" size="sm" class="ml-auto" :aria-label="t.item.escreverEmail" @click="escrever" />
          </UTooltip>
        </div>

        <UTabs
          v-model="caixa"
          :items="[
            { value: 'recebido', label: t.item.recebidos, badge: contagem.recebido || undefined },
            { value: 'enviado', label: t.item.enviados, badge: contagem.enviado || undefined },
          ]"
          :content="false"
          variant="link"
          class="mt-4 w-full"
          :ui="{ list: 'w-full', trigger: 'flex-1 justify-center' }"
        />

        <ul v-if="daCaixa.length" class="mt-3 flex flex-col gap-2">
          <li
            v-for="(e, i) in daCaixa"
            :key="e.id"
            class="animate-[entrada_.25s_ease-out_both] rounded-lg border border-default transition hover:border-accented"
            :style="{ animationDelay: `${i * 40}ms` }"
          >
            <button type="button" class="flex w-full items-start gap-3 p-3 text-left" :aria-expanded="aberto === e.id" @click="aberto = aberto === e.id ? null : e.id">
              <UAvatar :text="iniciais(e.direcao === 'recebido' ? e.de : (membroPorId(e.autor)?.nome ?? e.de))" size="sm" />
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-2">
                  <span class="truncate text-sm" :class="e.lido ? 'text-toned' : 'font-semibold text-highlighted'">
                    {{ e.direcao === 'recebido' ? e.de : t.item.para(e.para.join(', ')) }}
                  </span>
                  <UIcon v-if="e.anexos.length" name="i-lucide-paperclip" class="size-3.5 shrink-0 text-muted" />
                  <span class="ml-auto shrink-0 text-xs text-muted">{{ formatoData.format(e.data) }}</span>
                </span>
                <span class="block truncate text-sm text-highlighted">{{ e.assunto }}</span>
                <span v-if="e.direcao === 'enviado' && e.autor" class="block text-xs text-muted">{{ t.item.enviadoPor(membroPorId(e.autor)?.nome ?? '') }}</span>
              </span>
            </button>
            <div v-if="aberto === e.id" class="border-t border-default px-4 py-3">
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div class="prose-sm text-sm text-default [&_p]:my-1.5" v-html="e.corpo" />
              <div v-if="e.anexos.length" class="mt-2 flex flex-wrap gap-1.5">
                <UBadge v-for="a in e.anexos" :key="a" :label="a" icon="i-lucide-paperclip" color="neutral" variant="outline" size="sm" />
              </div>
              <UButton :label="t.item.responder" icon="i-lucide-reply" color="neutral" variant="outline" size="xs" class="mt-3" @click="responder(e.id)" />
            </div>
          </li>
        </ul>
        <UEmpty
          variant="naked"
          v-else
          icon="i-lucide-inbox"
          :title="t.item.nenhumEmail"
          size="sm"
          class="mt-6"
          :actions="config.emailDoEnspace ? [{ label: t.item.escreverEmail, icon: 'i-lucide-pencil', color: 'neutral', variant: 'outline', onClick: escrever }] : []"
        />
      </div>

      <!-- Tarefas do item -->
      <div v-else-if="abaDoItem === 'tarefas'" class="p-4 animate-[entrada_.25s_ease-out]">
        <ul v-if="tarefasDoItem.length" class="flex flex-col gap-2">
          <li v-for="x in tarefasDoItem" :key="x.id" class="flex items-center gap-3 rounded-lg border border-default p-3">
            <UIcon name="i-lucide-clipboard-check" class="size-4 text-muted" />
            <span class="flex-1 truncate text-sm text-highlighted">{{ x.name }}</span>
            <UBadge :label="t.status[x.status]" color="neutral" variant="subtle" size="sm" />
          </li>
        </ul>
        <UEmpty v-else variant="naked" icon="i-lucide-clipboard-list" :title="t.item.semTarefas" size="sm" />
      </div>

      <UEmpty
        variant="naked"
        v-else
        icon="i-lucide-folder-open"
        :title="t.item.foraDoEscopo"
        :description="t.item.foraDoEscopoDica"
        size="sm"
        class="mt-16"
      />
    </section>
  </div>
</template>
