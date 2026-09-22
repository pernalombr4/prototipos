<script setup lang="ts">
/**
 * A sidebar do item na tela nova, com as duas colunas.
 *
 * A casca é cópia do develop: o painel abre pela direita, a coluna 1 traz o
 * cabeçalho com a referência e os metadados em seções (IDENTIFICAÇÃO, ORIGEM,
 * HISTÓRICO), a coluna 2 traz as abas (Visão Geral, Comentários, Logs de
 * Auditoria) e os campos, o rodapé tem o Salvar e o topo tem o navegador
 * "1/3" com as setas.
 *
 * O QUE A PROPOSTA MUDA, e é o ponto desta tela:
 *
 * - a coluna 1 passa a ser o lugar do formato CRU. Hoje ela só tem metadado de
 *   sistema; a proposta é que ela também carregue os campos da categoria em
 *   leitura, com o mesmo desenho da célula e mais respiro. É o que o Twenty
 *   faz no painel do registro e o Notion no side peek: a mesma informação da
 *   tabela, em coluna, sem virar formulário;
 * - o formato cru tem a linha "ícone, rótulo, valor", com o rótulo em caixa
 *   alta pequena, do jeito que o develop já desenha os metadados. A proposta é
 *   só estender essa mesma linha para os campos da categoria;
 * - o tipo que não cabe em coluna estreita (repetidor, chat, editor, anotações)
 *   fica de fora do resumo e só aparece na coluna 2. Está no catálogo, em
 *   `foraDaColunaDeResumo`.
 *
 * Nada de rede: Salvar mexe no item em memória e mostra o toast.
 */
import type { Item } from '@be-enlighten/enspace-sdk-schemas'
import type { Campo } from './campos'
import type { Textos } from './textos'
import EntradaDoCampo from './_EntradaDoCampo.vue'
import ValorDoCampo from './_ValorDoCampo.vue'
import { formatarDataHora } from './formatacao'

const props = defineProps<{
  item: Item | null
  campos: Campo[]
  categoria: string
  t: Textos
  idioma: string
  indice: number
  total: number
  campoSelecionado?: string | null
  /** A tela dedicada do item usa a mesma peça, em página inteira. */
  emPaginaInteira?: boolean
}>()

const emit = defineEmits<{
  fechar: []
  navegar: [passo: number]
  inspecionar: [tipo: string]
  /** Editar no formato cru grava direto, sem passar pelo Salvar. */
  editarValor: [refId: string, valor: unknown]
  salvar: [dados: Record<string, unknown>]
}>()

/**
 * Qual linha do resumo está em edição. No formato cru o valor vira controle no
 * lugar, sem sair da coluna: é a "edição fluida" que o documento do time de
 * produtos descreve, e é o que o Twenty faz no painel do registro.
 */
const cruEmEdicao = ref<string | null>(null)

const resumoAberto = ref(true)
const aba = ref('visaoGeral')
const salvando = ref(false)

const abas = computed(() => [
  { value: 'visaoGeral', label: props.t.visaoGeral, icon: 'i-lucide-layers' },
  { value: 'comentarios', label: props.t.comentarios, icon: 'i-lucide-message-circle' },
  { value: 'logs', label: props.t.logsDeAuditoria, icon: 'i-lucide-shield-check' },
])

/** Os campos que cabem no resumo, na ordem do catálogo. */
const camposDoResumo = computed(() => props.campos.filter(c => !c.foraDaColunaDeResumo))

/** Cópia local do item, porque editar não pode mexer na lista antes de salvar. */
const rascunho = ref<Record<string, unknown>>({})
watch(
  () => props.item,
  (i) => { rascunho.value = { ...((i?.data as Record<string, unknown>) ?? {}) } },
  { immediate: true },
)

async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  emit('salvar', { ...rascunho.value })
}

const metadados = computed(() => {
  if (!props.item) return []
  return [
    {
      secao: props.t.identificacao,
      linhas: [{ icone: 'i-lucide-hash', rotulo: props.t.id, valor: String(props.item.id) }],
    },
    {
      secao: props.t.origem,
      linhas: [
        {
          icone: 'i-lucide-activity',
          rotulo: props.t.status,
          valor: props.item.status === 'active' ? props.t.ativo : props.t.inativo,
        },
        ...(props.item.request_email
          ? [{ icone: 'i-lucide-mail', rotulo: props.t.emailDaSolicitacao, valor: props.item.request_email }]
          : []),
      ],
    },
    {
      secao: props.t.historico,
      linhas: [
        {
          icone: 'i-lucide-calendar-plus',
          rotulo: props.t.criadoEmRotulo,
          valor: formatarDataHora(props.item.created_at, props.idioma),
        },
        {
          icone: 'i-lucide-calendar-clock',
          rotulo: props.t.atualizadoEm,
          valor: formatarDataHora(props.item.updated_at, props.idioma),
        },
      ],
    },
  ]
})
</script>

<template>
  <aside
    v-if="item"
    class="relative flex h-full flex-col bg-default"
    :class="[
      emPaginaInteira ? 'w-full' : 'shrink-0 border-l border-default',
      emPaginaInteira ? '' : (resumoAberto ? 'w-[46rem]' : 'w-[30rem]'),
    ]"
    :aria-label="t.visaoGeral"
  >
    <div class="flex min-h-0 flex-1">
      <!-- ══════════════════ COLUNA 1: o formato CRU ══════════════════ -->
      <div
        v-if="resumoAberto"
        class="flex shrink-0 flex-col overflow-y-auto border-r border-default"
        :class="emPaginaInteira ? 'w-72' : 'w-64'"
      >
        <div class="flex items-start gap-2 p-3">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-md border border-default text-muted">
            <UIcon name="i-lucide-file-text" class="size-4" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="break-all text-sm font-semibold leading-tight text-highlighted">
              {{ item.reference }}
            </p>
            <p class="mt-0.5 truncate text-xs text-muted">{{ categoria }}</p>
          </div>
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.acoes" />
        </div>

        <div class="px-3 pb-2">
          <UBadge color="neutral" variant="subtle" size="sm" icon="i-lucide-layout-grid">
            {{ categoria }}
          </UBadge>
        </div>

        <!-- Os metadados de sistema, como o develop já mostra hoje -->
        <div v-for="bloco in metadados" :key="bloco.secao" class="px-3 pb-3">
          <p class="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-dimmed">
            <span class="size-1 rounded-full bg-primary" />
            {{ bloco.secao }}
          </p>
          <div
            v-for="linha in bloco.linhas"
            :key="linha.rotulo"
            class="mb-1 rounded-md border border-default px-2 py-1.5"
          >
            <p class="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-dimmed">
              <UIcon :name="linha.icone" class="size-3 shrink-0" />
              {{ linha.rotulo }}
            </p>
            <p class="mt-0.5 break-words text-sm font-medium text-highlighted">{{ linha.valor }}</p>
          </div>
        </div>

        <!-- PROPOSTA: os campos da categoria, em leitura, no mesmo formato -->
        <div class="px-3 pb-6">
          <p class="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-dimmed">
            <span class="size-1 rounded-full bg-primary" />
            {{ t.osCampos }}
          </p>
          <div
            v-for="campo in camposDoResumo"
            :key="campo.tipo"
            class="group/linha flex gap-2 rounded-md px-1 py-1 transition-colors hover:bg-elevated/60"
            :class="campoSelecionado === campo.tipo ? 'bg-primary/5 ring-1 ring-primary/30' : ''"
          >
            <UTooltip :text="t.fichaTitulo" :delay-duration="400">
              <button
                type="button"
                class="mt-1 shrink-0 rounded focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                :aria-label="t.campos[campo.tipo].rotulo"
                @click="emit('inspecionar', campo.tipo)"
              >
                <UIcon :name="campo.icone" class="size-3.5 text-dimmed transition-colors hover:text-primary" />
              </button>
            </UTooltip>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[10px] uppercase tracking-wide text-dimmed">
                {{ t.campos[campo.tipo].rotulo }}
              </p>
              <!-- em edição: o mesmo controle do formulário, sem rótulo -->
              <EntradaDoCampo
                v-if="cruEmEdicao === campo.refId"
                :campo="campo"
                :model-value="rascunho[campo.refId]"
                :t="t"
                :idioma="idioma"
                sem-rotulo
                autofoco
                @update:model-value="(v: unknown) => { rascunho[campo.refId] = v; emit('editarValor', campo.refId, v) }"
                @sair="cruEmEdicao = null"
              />
              <ValorDoCampo
                v-else
                :campo="campo"
                :valor="rascunho[campo.refId]"
                formato="cru"
                :t="t"
                :idioma="idioma"
                @editar="cruEmEdicao = campo.somenteLeitura ? null : campo.refId"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════ COLUNA 2: o formato FORMULÁRIO ══════════════ -->
      <div class="flex min-w-0 flex-1 flex-col">
        <div class="flex shrink-0 items-center gap-2 border-b border-default px-3 py-2">
          <UTabs
            v-model="aba"
            :items="abas"
            size="xs"
            variant="link"
            :ui="{ list: 'border-none' }"
            class="min-w-0 flex-1"
          />
          <div class="flex shrink-0 items-center gap-0.5">
            <UButton
              icon="i-lucide-chevron-left"
              color="neutral"
              variant="ghost"
              size="xs"
              :disabled="indice <= 1"
              :aria-label="t.anterior"
              @click="emit('navegar', -1)"
            />
            <span class="text-xs tabular-nums text-muted">{{ t.itemDe(indice, total) }}</span>
            <UButton
              icon="i-lucide-chevron-right"
              color="neutral"
              variant="ghost"
              size="xs"
              :disabled="indice >= total"
              :aria-label="t.proximo"
              @click="emit('navegar', 1)"
            />
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="t.fecharPainel"
              @click="emit('fechar')"
            />
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto p-4">
          <div v-if="aba === 'visaoGeral'" class="grid grid-cols-1 gap-x-5 gap-y-4 xl:grid-cols-2">
            <div
              v-for="campo in campos"
              :key="campo.tipo"
              :class="[
                campo.larguraCheiaNoFormulario ? 'xl:col-span-2' : '',
                campoSelecionado === campo.tipo ? 'rounded-md ring-1 ring-primary/30' : '',
              ]"
            >
              <EntradaDoCampo
                v-model="rascunho[campo.refId]"
                :campo="campo"
                :t="t"
                :idioma="idioma"
                @inspecionar="emit('inspecionar', campo.tipo)"
              />
            </div>
          </div>

          <UEmpty
            v-else-if="aba === 'comentarios'"
            icon="i-lucide-message-circle"
            :title="t.comentarios"
            :description="t.dicaDeUso"
          />

          <UEmpty
            v-else
            icon="i-lucide-shield-check"
            :title="t.logsDeAuditoria"
            :description="t.dicaDeUso"
          />
        </div>

        <div class="flex shrink-0 items-center justify-end gap-2 border-t border-default px-3 py-2">
          <UButton
            :icon="salvando ? undefined : 'i-lucide-save'"
            :label="salvando ? t.salvando : t.salvar"
            :loading="salvando"
            color="primary"
            size="sm"
            @click="salvar"
          />
        </div>
      </div>
    </div>

    <!-- O botão de recolher o resumo, que o develop põe na borda -->
    <button
      type="button"
      class="absolute bottom-24 left-0 z-10 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border border-default bg-primary text-inverted shadow-sm"
      :aria-label="resumoAberto ? t.recolherResumo : t.abrirResumo"
      @click="resumoAberto = !resumoAberto"
    >
      <UIcon :name="resumoAberto ? 'i-lucide-chevrons-left' : 'i-lucide-chevrons-right'" class="size-3.5" />
    </button>
  </aside>
</template>
