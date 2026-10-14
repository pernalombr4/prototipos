<script setup lang="ts">
/**
 * PROPOSTA: o painel de detalhes de um relatório, aberto pelo clique na linha.
 *
 * Mesma ideia da visualização rápida do item na tabela nova (painel à
 * direita, a lista continua atrás), em tamanho de leitura: o relatório não
 * se edita, então o painel é estreito e sem rodapé de Salvar.
 *
 * Ordem: o que a pessoa veio fazer (baixar) no topo; o que explica o arquivo
 * (resumo, filtros, colunas) no meio; o histórico no fim.
 */
import type { PedidoDeRelatorio } from './mocks'
import {
  COR_DO_FORMATO, COR_DO_STATUS, ICONE_DO_FORMATO, ICONE_DO_STATUS, dataCurta, dataLonga, iconeDaOrigem,
  nomeDaOrigem, nomeDoArquivo, segundosParaGerar, tamanho,
} from './relatorios'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  pedido: PedidoDeRelatorio
}>()

const emit = defineEmits<{
  fechar: []
  baixar: [id: number]
  extrairDeNovo: [id: number]
  tentarDeNovo: [id: number]
  abrirOrigem: [id: number]
  copiarLink: [id: number]
  excluir: [id: number]
}>()

const idioma = useIdioma()
const baixando = ref(false)
const todasAsColunas = ref(false)

watch(() => props.pedido.id, () => { todasAsColunas.value = false })

const p = computed(() => props.pedido)
const origem = computed(() => nomeDaOrigem(p.value, props.t))
const pronto = computed(() => p.value.status === 'complete')
const gerando = computed(() => p.value.status === 'processing' || p.value.status === 'pending')
const arquivo = computed(() => nomeDoArquivo(p.value, props.t))
const peso = computed(() => p.value.processed_report ? tamanho(p.value.processed_report.size, idioma.value) : '')

const colunasVisiveis = computed(() => todasAsColunas.value ? p.value.proto.colunas : p.value.proto.colunas.slice(0, 6))

interface Evento { icone: string, cor: string, texto: string, quando: string }

const historico = computed<Evento[]>(() => {
  const e: Evento[] = [{ icone: 'i-lucide-send', cor: 'text-muted', texto: props.t.painel.eventos.pedido, quando: dataLonga(p.value.created_at, idioma.value) }]
  if (p.value.status === 'pending') e.push({ icone: 'i-lucide-clock', cor: 'text-muted', texto: props.t.painel.eventos.naFila, quando: '' })
  if (p.value.status === 'processing') e.push({ icone: 'i-lucide-loader-circle', cor: 'text-info animate-spin', texto: props.t.painel.eventos.gerando, quando: '' })
  if (p.value.status === 'error') e.push({ icone: 'i-lucide-circle-alert', cor: 'text-error', texto: props.t.painel.eventos.falhou, quando: dataLonga(p.value.updated_at, idioma.value) })
  if (pronto.value) e.push({ icone: 'i-lucide-file-check', cor: 'text-success', texto: props.t.painel.eventos.gerado, quando: dataLonga(p.value.updated_at, idioma.value) })
  for (const b of p.value.proto.baixadoEm) e.push({ icone: 'i-lucide-download', cor: 'text-primary', texto: props.t.painel.eventos.baixado, quando: dataLonga(b, idioma.value) })
  return e.reverse()
})

async function baixar() {
  baixando.value = true
  await new Promise(r => setTimeout(r, 700))
  baixando.value = false
  emit('baixar', p.value.id)
}

const maisAcoes = computed(() => [
  [
    ...(pronto.value ? [{ label: props.t.acoes.copiarLink, icon: 'i-lucide-link', onSelect: () => emit('copiarLink', p.value.id) }] : []),
    { label: props.t.acoes.abrirNaOrigem, icon: 'i-lucide-square-arrow-out-up-right', onSelect: () => emit('abrirOrigem', p.value.id) },
  ],
  [{ label: props.t.acoes.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => emit('excluir', p.value.id) }],
])
</script>

<template>
  <div class="flex h-full min-h-0 flex-col">
    <!-- Cabeçalho -->
    <header class="flex items-start gap-3 border-b border-default p-4">
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-lg"
        :class="{
          'bg-success/10 text-success': COR_DO_FORMATO[p.extraction_format] === 'success',
          'bg-info/10 text-info': COR_DO_FORMATO[p.extraction_format] === 'info',
          'bg-elevated text-toned': COR_DO_FORMATO[p.extraction_format] === 'neutral',
        }"
      >
        <UIcon :name="ICONE_DO_FORMATO[p.extraction_format]" class="size-5" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-xs text-muted">{{ t.painel.titulo }}</p>
        <h2 class="truncate text-base font-semibold text-highlighted" :title="origem">{{ origem }}</h2>
        <p class="truncate text-sm text-toned">{{ p.proto.visualizacao }}</p>
      </div>
      <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.acoes.fechar" @click="emit('fechar')" />
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto pb-20">
      <!-- O que a pessoa veio fazer -->
      <section class="space-y-3 border-b border-default p-4">
        <div class="flex items-center gap-2">
          <UBadge
            :color="COR_DO_STATUS[p.status]"
            variant="subtle"
            :icon="ICONE_DO_STATUS[p.status]"
            :ui="{ leadingIcon: p.status === 'processing' ? 'animate-spin' : '' }"
            :label="p.status === 'processing' && p.proto.progresso != null ? t.gerandoPct(p.proto.progresso) : t.status[p.status]"
          />
          <span class="text-xs text-muted">{{ dataCurta(p.created_at, t, idioma) }}</span>
        </div>

        <template v-if="pronto">
          <div class="flex items-center gap-2 rounded-md border border-default bg-elevated/40 px-3 py-2">
            <UIcon name="i-lucide-paperclip" class="size-4 shrink-0 text-muted" />
            <span class="min-w-0 flex-1 truncate font-mono text-xs text-toned" :title="arquivo">{{ arquivo }}</span>
          </div>
          <div class="flex gap-2">
            <UButton
              icon="i-lucide-download"
              :label="t.acoes.baixarArquivo(p.extraction_format.toUpperCase(), peso)"
              color="primary"
              size="md"
              block
              :loading="baixando"
              class="flex-1"
              @click="baixar"
            />
            <UTooltip :text="t.acoes.extrairDeNovo">
              <UButton icon="i-lucide-refresh-cw" color="neutral" variant="outline" size="md" :aria-label="t.acoes.extrairDeNovo" @click="emit('extrairDeNovo', p.id)" />
            </UTooltip>
            <UDropdownMenu :items="maisAcoes" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="outline" size="md" :aria-label="t.acoes.maisAcoes" />
            </UDropdownMenu>
          </div>
        </template>

        <template v-else-if="gerando">
          <UProgress :model-value="p.status === 'processing' ? (p.proto.progresso ?? null) : null" color="info" size="sm" />
          <p class="text-sm text-toned">{{ p.status === 'pending' ? t.painel.naFilaAjuda : t.painel.gerandoAjuda }}</p>
        </template>

        <template v-else>
          <UAlert
            color="error"
            variant="subtle"
            icon="i-lucide-circle-alert"
            :title="t.painel.falhouTitulo"
            :description="p.proto.erro"
          />
          <div class="flex gap-2">
            <UButton icon="i-lucide-rotate-cw" :label="t.acoes.tentarDeNovo" color="primary" variant="soft" block class="flex-1" @click="emit('tentarDeNovo', p.id)" />
            <UDropdownMenu :items="maisAcoes" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="outline" :aria-label="t.acoes.maisAcoes" />
            </UDropdownMenu>
          </div>
        </template>
      </section>

      <!-- Resumo -->
      <section class="border-b border-default p-4">
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.painel.resumo }}</h3>
        <dl class="grid grid-cols-[8.5rem_1fr] gap-x-3 gap-y-2 text-sm">
          <dt class="text-muted">{{ t.painel.origem }}</dt>
          <dd class="flex min-w-0 items-center gap-1.5 text-highlighted">
            <UIcon :name="iconeDaOrigem(p)" class="size-4 shrink-0 text-muted" />
            <ULink class="truncate text-highlighted hover:text-primary" :title="origem" @click="emit('abrirOrigem', p.id)">{{ origem }}</ULink>
          </dd>

          <dt class="text-muted">{{ t.painel.visualizacao }}</dt>
          <dd class="truncate text-highlighted">{{ p.proto.visualizacao }}</dd>

          <dt class="text-muted">{{ t.painel.modelo }}</dt>
          <dd class="truncate" :class="p.report ? 'text-highlighted' : 'text-toned'">{{ p.report?.name ?? t.modeloPadrao }}</dd>

          <dt class="text-muted">{{ t.painel.formato }}</dt>
          <dd><UBadge :label="p.extraction_format.toUpperCase()" color="neutral" variant="outline" size="sm" class="font-mono" /></dd>

          <dt class="text-muted">{{ t.painel.registros }}</dt>
          <dd class="tabular-nums text-highlighted">
            {{ p.proto.registros == null ? '-' : p.proto.registros === 0 ? t.semRegistros : p.proto.registros.toLocaleString(idioma) }}
          </dd>

          <template v-if="pronto">
            <dt class="text-muted">{{ t.painel.tamanho }}</dt>
            <dd class="tabular-nums text-highlighted">{{ peso }}</dd>
          </template>

          <dt class="text-muted">{{ t.painel.pedidoEm }}</dt>
          <dd class="text-highlighted">{{ dataLonga(p.created_at, idioma) }}</dd>

          <template v-if="pronto">
            <dt class="text-muted">{{ t.painel.prontoEm }}</dt>
            <dd class="text-highlighted">
              {{ dataLonga(p.updated_at, idioma) }}
              <span class="block text-xs text-muted">{{ t.painel.emSegundos(segundosParaGerar(p)) }}</span>
            </dd>

            <dt class="text-muted">{{ t.painel.baixado }}</dt>
            <dd :class="p.proto.baixadoEm.length ? 'text-highlighted' : 'text-toned'">
              {{ p.proto.baixadoEm.length ? t.painel.vezes(p.proto.baixadoEm.length) : t.painel.nunca }}
            </dd>
          </template>
        </dl>
      </section>

      <!-- Filtros aplicados: o JSON de hoje, em frase -->
      <section class="border-b border-default p-4">
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.painel.filtrosAplicados }}</h3>
        <ul v-if="p.proto.filtros.length" class="space-y-1.5">
          <li v-for="(f, i) in p.proto.filtros" :key="i" class="flex flex-wrap items-center gap-1.5 text-sm">
            <UBadge :label="f.campo" color="neutral" variant="soft" size="sm" />
            <span class="text-muted">{{ t.operadores[f.operador] }}</span>
            <span v-if="f.valor" class="font-medium text-highlighted">{{ f.valor }}</span>
          </li>
        </ul>
        <p v-else class="text-sm text-toned">{{ t.painel.semFiltroAjuda }}</p>
        <p class="mt-3 flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-arrow-down-wide-narrow" class="size-3.5" />
          {{ t.painel.ordenacao }}: {{ p.proto.ordenacao }}
        </p>
      </section>

      <!-- Colunas exportadas -->
      <section class="border-b border-default p-4">
        <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.painel.colunasExportadas(p.proto.colunas.length) }}</h3>
        <div class="flex flex-wrap gap-1.5">
          <TransitionGroup
            enter-active-class="transition duration-200"
            enter-from-class="opacity-0 -translate-y-1"
          >
            <UBadge v-for="c in colunasVisiveis" :key="c" :label="c" color="neutral" variant="outline" size="sm" />
          </TransitionGroup>
          <UButton
            v-if="p.proto.colunas.length > 6"
            :label="todasAsColunas ? t.painel.verMenos : `${t.painel.verTodas} (+${p.proto.colunas.length - 6})`"
            color="neutral"
            variant="link"
            size="xs"
            @click="todasAsColunas = !todasAsColunas"
          />
        </div>
      </section>

      <!-- Histórico -->
      <section class="p-4">
        <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.painel.historico }}</h3>
        <ol class="relative space-y-3 border-l border-default pl-4">
          <li v-for="(e, i) in historico" :key="i" class="relative">
            <span class="absolute -left-[1.6rem] flex size-5 items-center justify-center rounded-full bg-default ring-1 ring-default">
              <UIcon :name="e.icone" class="size-3" :class="e.cor" />
            </span>
            <p class="text-sm text-highlighted">{{ e.texto }}</p>
            <p v-if="e.quando" class="text-xs text-muted">{{ e.quando }}</p>
          </li>
        </ol>
      </section>
    </div>
  </div>
</template>
