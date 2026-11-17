<script setup lang="ts">
/**
 * A tela do item, como o develop mostra o item aberto e expandido: o painel
 * da esquerda (Identificação, Origem, Histórico) e as pastas em abas.
 *
 * PROPOSTA:
 *  - o cartão "Contato do item" no topo do painel da esquerda, com o contato
 *    que a categoria define (a avaliar com os devs: pede uma chave nova na
 *    configuração da categoria);
 *  - o ícone de e-mail ao lado de cada campo de e-mail da Visão Geral, sem
 *    configuração nenhuma;
 *  - a Mail Box em todo item (`_MailBox.vue`), sem a pasta precisar ser
 *    adicionada na categoria.
 * A Visão Geral edita e o Salvar grava (em memória): é o fim da jornada de
 * "Cadastrar e-mail", e o Contato do item muda junto.
 */
import type { Textos } from './textos'
import { agora, campos, categoriaPorSlug, itemPorId, tarefas } from './mocks'
import { contatosDoItem, useComunicacao, useMarcaDeProposta } from './estado'
import { useAtalhos } from './atalhos'
import AcoesDeContato from './_AcoesDeContato.vue'
import MailBox from './_MailBox.vue'

const props = defineProps<{ t: Textos }>()

const { itemAberto, abaDoItem, config, podeEnviar, ir } = useComunicacao()
const { ativos } = useAtalhos()
const marca = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const item = computed(() => itemPorId(itemAberto.value))
const categoria = computed(() => item.value ? categoriaPorSlug(item.value.categoria) : null)

/* ---------- contato do item ---------- */

const contatos = computed(() => item.value ? contatosDoItem(item.value, config.value) : [])
const comDado = computed(() => contatos.value.filter(c => c.email || c.nome))
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

/** O campo da categoria que guarda o e-mail deste contato, para o "Cadastrar e-mail". */
const campoDoEmail = computed(() => {
  const i = item.value
  if (!i || !contato.value || contato.value.email) return null
  const regra = config.value.porCategoria[i.categoria].contatos.find(c => c.id === contato.value!.id)
  return regra?.campoEmail && regra.campoEmail !== 'request_email' ? regra.campoEmail : null
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
  // PROPOSTA: a Mail Box vem em todo item (hoje só onde alguém adicionou a pasta).
  { value: 'mailbox', label: props.t.item.abas.mailbox, icon: 'i-lucide-mailbox' },
  { value: 'notas', label: props.t.item.abas.notas, icon: 'i-lucide-notebook-pen' },
])

/* ---------- visão geral ---------- */

/** O tipo de cada campo: o ícone de e-mail aparece nos campos E-mail e no e-mail de Pessoa/Empresa. */
function ehEmail(chave: string) {
  const i = item.value
  if (!i) return false
  const [raiz, sub] = chave.split('.') as [string, string | undefined]
  const campo = campos.find(c => c.categoria === i.categoria && c.refId === raiz)
  return sub ? sub === 'contact_email' : campo?.type === 'email'
}

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

const formatoData = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))

const valido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

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

      <!-- PROPOSTA: o contato do item (a avaliar com os devs) -->
      <section v-if="ativos" class="mt-5 animate-[entrada_.3s_ease-out]" :class="marca">
        <h2 class="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          <span class="size-1 rounded-full bg-muted" />{{ t.item.contato }}
        </h2>
        <div class="rounded-lg border border-default p-3">
          <template v-if="comDado.length">
            <USelectMenu
              v-if="comDado.length > 1"
              v-model="escolhido"
              :items="opcoesDeContato"
              value-key="value"
              :search-input="false"
              class="w-full"
              :ui="{ base: 'py-1.5' }"
              :aria-label="t.item.paraQuem"
            />
            <div v-else-if="contato" class="flex items-center gap-2">
              <UAvatar :text="iniciais(contato.nome ?? contato.email ?? '?')" size="xs" />
              <span class="min-w-0">
                <span class="block truncate text-sm font-medium text-highlighted">{{ contato.nome ?? contato.email }}</span>
                <span class="block truncate text-xs text-muted">{{ contato.rotulo }}</span>
              </span>
            </div>
            <p v-if="contato?.email" class="mt-1.5 truncate px-1 text-xs text-muted">
              {{ contato.email }}
            </p>
            <!-- O motivo à vista: botão indisponível não mostra tooltip a quem usa teclado. -->
            <div v-else-if="contato" class="mt-1.5 flex flex-wrap items-center gap-x-1 px-1 text-xs text-warning">
              <UIcon name="i-lucide-info" class="size-3.5 shrink-0" />
              {{ t.item.semEmailAviso }}
              <UButton
                v-if="campoDoEmail"
                :label="t.item.cadastrarEmail"
                color="primary"
                variant="link"
                size="xs"
                class="p-0"
                @click="irParaCampo(campoDoEmail)"
              />
            </div>
            <AcoesDeContato
              :t="t"
              :destino="contato"
              :item="item"
              tamanho="sm"
              bloco
              class="mt-3"
            />
            <p class="mt-2 text-xs leading-relaxed text-muted">
              {{ podeEnviar ? t.item.ajudaComEnspace(item.reference) : t.item.ajudaSemEnspace }}
            </p>
          </template>
          <UEmpty
            v-else
            variant="naked"
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
          <UInput :id="`campo-${c.chave}`" v-model="edicao[c.chave]" class="w-full" :ui="ehEmail(c.chave) && ativos ? { trailing: 'pe-1' } : undefined">
            <!-- PROPOSTA: o e-mail ao lado do próprio campo -->
            <template v-if="ehEmail(c.chave) && ativos" #trailing>
              <AcoesDeContato
                :t="t"
                :destino="{ nome: null, email: edicao[c.chave] && valido(edicao[c.chave]!) ? edicao[c.chave]! : null }"
                :item="item"
                variante="icone"
                tamanho="xs"
                :rotulo="t.item.emailPara(c.rotulo)"
                :class="marca"
              />
            </template>
          </UInput>
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton :label="t.item.sairSemSalvar" icon="i-lucide-undo-2" color="neutral" variant="ghost" @click="descartarEdicao" />
          <UButton :label="t.item.salvar" icon="i-lucide-save" @click="salvarItem" />
        </div>
      </div>

      <!-- Mail Box (PROPOSTA: em todo item, repaginada) -->
      <div v-else-if="abaDoItem === 'mailbox'" class="max-w-4xl p-4 animate-[entrada_.25s_ease-out]">
        <MailBox :t="t" :item-id="item.id" />
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
