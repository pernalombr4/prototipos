<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { useMeusRelatorios } from './relatorios'
import type { RelatorioEmitido } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * MEUS RELATÓRIOS (rodada 22).
 *
 * "deve haver no menu uma opçao nativa para 'meus relatorios'. todos os
 *  relatorios extraidos no workspace vao pra lá" (Mikaela, 14/10/2026).
 *
 * A tela JÁ EXISTE no develop, em /myReports, e não é o que está em discussão:
 * o que falta lá é a porta no menu. Então o miolo é cópia, medida em
 * 14/10/2026 no workspace de exploração, e nada aqui é melhoria de passagem:
 * colunas, ordem das ações ("Deletar" primeiro), rótulos, o olho dos filtros
 * com IDs e o texto do vazio são os de lá. O que está torto virou achado no
 * DECISOES.md.
 *
 * Duas coisas são proposta, e estão marcadas:
 * 1. O título é o nome do menu. No develop o cabeçalho diz "Relatórios", a
 *    trilha diz "Meus Relatórios" e o aviso de extração diz "Meus Relatórios
 *    Emitidos": três nomes para uma tela.
 * 2. O relatório pronto e ainda não baixado tem fundo e conta no número do
 *    menu, como a notificação não lida do Inbox. Baixar apaga o número.
 */
const props = defineProps<{ t: TextosDaTela }>()
const emit = defineEmits<{ verModelo: [] }>()

const relatorios = useMeusRelatorios()
const toast = useToast()

const colunas = computed<TableColumn<RelatorioEmitido>[]>(() => [
  { id: 'acoes', header: props.t.colAcoes },
  { accessorKey: 'status', header: props.t.colStatus },
  { accessorKey: 'modelo', header: props.t.colModelo },
  { accessorKey: 'tabela', header: props.t.colTabela },
  { accessorKey: 'entidade', header: props.t.colEntidade },
  { accessorKey: 'criadoEm', header: props.t.colCriadoEm },
  { accessorKey: 'registros', header: props.t.colRegistros },
  { id: 'filtros', header: props.t.colFiltros },
])

/** Proposta 2: o pronto e não baixado se destaca, como o não lido do Inbox. */
const meta = {
  class: {
    tr: (row: { original: RelatorioEmitido }) => (row.original.novo && row.original.status === 'completa' ? 'bg-primary/5' : ''),
  },
}

/* A ordem do develop: Deletar, Download, Ver modelo. */
function acoesDe(r: RelatorioEmitido) {
  return [[
    {
      label: props.t.acaoDeletar,
      icon: 'i-lucide-trash-2',
      onSelect: () => {
        relatorios.deletar(r.id)
        toast.add({ title: props.t.relatorioDeletado, icon: 'i-lucide-trash-2', color: 'neutral' })
      },
    },
    {
      label: props.t.acaoDownload,
      icon: 'i-lucide-download',
      disabled: r.status !== 'completa',
      onSelect: () => {
        relatorios.baixar(r.id)
        toast.add({
          title: props.t.relatorioBaixado(relatorios.nomeDoArquivo(r)),
          description: props.t.relatorioBaixadoDescricao,
          icon: 'i-lucide-download',
          color: 'neutral',
        })
      },
    },
    // O Relatório padrão não tem modelo: no develop o item aparece apagado.
    { label: props.t.acaoVerModelo, icon: 'i-lucide-file-search', disabled: !r.modelo, onSelect: () => emit('verModelo') },
  ]]
}

/* ---------------- o olho da coluna Filtros ---------------- */

const vendoFiltros = ref<RelatorioEmitido | null>(null)
const filtrosAbertos = computed({
  get: () => !!vendoFiltros.value,
  set: (v) => { if (!v) vendoFiltros.value = null },
})
const abasDosFiltros = computed(() => [
  { label: props.t.visPersonalizada, value: 'personalizada', slot: 'personalizada' as const },
  { label: props.t.visPadrao, value: 'padrao', slot: 'padrao' as const },
])
/** A aba padrão do develop mostra a estrutura técnica, em JSON. */
const filtrosEmJson = computed(() => JSON.stringify(
  Object.fromEntries((vendoFiltros.value?.filtros ?? []).map(f => [f.campo.toLowerCase(), f.valor])),
  null,
  2,
))
</script>

<template>
  <div class="animate-[entrada_0.25s_ease-out_both]">
    <div class="mb-4 min-w-0">
      <h1 class="flex items-center gap-2 text-xl font-bold text-highlighted">
        {{ props.t.meusRelatorios }}
        <UBadge
          v-if="relatorios.novos.value"
          :label="props.t.relatoriosNovos(relatorios.novos.value)"
          size="sm"
          color="warning"
          variant="subtle"
        />
      </h1>
      <p class="mt-0.5 max-w-2xl text-sm leading-relaxed text-muted">{{ props.t.relatoriosDescricao }}</p>
    </div>

    <!-- A barra do develop: busca e filtro à esquerda; atualizar e a ordem por ID à direita. -->
    <div class="mb-3 flex items-center gap-1.5 rounded-xl border border-default p-2">
      <UButton icon="i-lucide-search" size="sm" color="neutral" variant="soft" :aria-label="props.t.relatoriosBuscar" />
      <UButton icon="i-lucide-filter" size="sm" color="neutral" variant="soft" :aria-label="props.t.relatoriosFiltrar" />
      <span class="flex-1" />
      <UButton icon="i-lucide-refresh-cw" size="sm" color="neutral" variant="soft" :aria-label="props.t.relatoriosAtualizar" />
      <UButton label="ID" trailing-icon="i-lucide-arrow-down" size="sm" color="neutral" variant="soft" :aria-label="props.t.relatoriosOrdenar" />
    </div>

    <div class="overflow-hidden rounded-xl border border-default">
      <UTable :data="relatorios.lista.value" :columns="colunas" :meta="meta" class="w-full">
        <template #acoes-cell="{ row }">
          <UDropdownMenu :items="acoesDe(row.original)" :content="{ align: 'start' }">
            <UButton
              icon="i-lucide-chevron-down"
              size="xs"
              color="neutral"
              variant="soft"
              :aria-label="`${props.t.colAcoes}: ${row.original.id}`"
            />
          </UDropdownMenu>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            v-if="row.original.status === 'completa'"
            :label="props.t.statusCompleta"
            size="sm"
            color="success"
            variant="subtle"
          />
          <UBadge
            v-else
            :label="props.t.statusProcessando"
            icon="i-lucide-loader-circle"
            size="sm"
            color="neutral"
            variant="subtle"
            :ui="{ leadingIcon: 'animate-spin motion-reduce:animate-none' }"
          />
        </template>

        <template #modelo-cell="{ row }">{{ row.original.modelo ?? '-' }}</template>
        <template #tabela-cell="{ row }">{{ row.original.tabela ?? '-' }}</template>
        <template #entidade-cell="{ row }">{{ row.original.entidade ?? '-' }}</template>
        <template #registros-cell="{ row }">{{ row.original.registros ?? '-' }}</template>

        <template #filtros-cell="{ row }">
          <UButton
            icon="i-lucide-eye"
            size="xs"
            color="neutral"
            variant="soft"
            :aria-label="`${props.t.colFiltros}: ${row.original.id}`"
            @click="vendoFiltros = row.original"
          />
        </template>

        <template #empty>
          <div class="flex flex-col items-center gap-2 py-8 text-sm text-muted">
            <UIcon name="i-lucide-inbox" class="size-7 text-toned" />
            {{ props.t.relatoriosVazio }}
          </div>
        </template>
      </UTable>
    </div>

    <!-- O rodapé do develop: página, 50 por página e a contagem. -->
    <div class="mt-3 flex flex-col items-center gap-1.5 rounded-xl border border-default p-3">
      <div class="flex items-center gap-1.5">
        <UButton icon="i-lucide-chevron-left" size="xs" color="neutral" variant="outline" disabled />
        <UButton label="1" size="xs" color="primary" variant="outline" />
        <UButton icon="i-lucide-chevron-right" size="xs" color="neutral" variant="outline" disabled />
        <USelect :model-value="50" :items="[25, 50, 100]" size="xs" class="w-18" />
      </div>
      <p class="text-xs text-muted">{{ props.t.relatoriosMostrando(relatorios.lista.value.length) }}</p>
    </div>

    <!-- O olho dos filtros: as duas abas do develop, com os IDs que ele mostra. -->
    <UModal v-model:open="filtrosAbertos" :title="props.t.colFiltros" :ui="{ content: 'max-w-md' }">
      <template #body>
        <UTabs :items="abasDosFiltros" default-value="personalizada" variant="link" class="w-full">
          <template #personalizada>
            <dl class="mt-2 divide-y divide-default overflow-hidden rounded-lg border border-default">
              <div v-for="f in vendoFiltros?.filtros ?? []" :key="f.campo">
                <dt class="bg-elevated/50 px-3 py-2 text-sm font-semibold text-highlighted">{{ f.campo }}</dt>
                <dd class="px-3 py-2 font-mono text-sm text-default">{{ f.valor }}</dd>
              </div>
            </dl>
          </template>
          <template #padrao>
            <pre class="mt-2 overflow-x-auto rounded-lg bg-elevated/50 p-3 text-xs text-default">{{ filtrosEmJson }}</pre>
          </template>
        </UTabs>
      </template>
    </UModal>
  </div>
</template>
