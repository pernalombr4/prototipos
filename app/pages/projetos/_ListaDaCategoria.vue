<script setup lang="ts">
/**
 * A lista da categoria. CASCA: a barra de hoje (abas de visualização, busca, período, ícones,
 * Novo registro) sobre o EnTable, como em comunicacao-no-workspace/_TelaItens.vue.
 *
 * PROPOSTA:
 *  - o selo do projeto no cabeçalho, que abre a página do projeto, e a linha de quem vê a categoria;
 *  - o campo de vínculo com item de projeto em que a pessoa não entra mostra "Item sem acesso",
 *    com cadeado, sem o nome do item e sem link. Hoje o campo mostra o nome guardado (`display`).
 *    Projeto fechado: a dica nomeia o projeto. Privado: a dica não nomeia nada.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { contasAPagar, type ItemDeConta, type Vinculo } from './mocks'
import { COR_DO_PROJETO, ICONE_DA_VISIBILIDADE, useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()
const idioma = useIdioma()

const c = computed(() => prj.categorias.value.find(x => x.id === props.id)!)
const projeto = computed(() => prj.projetoDa(c.value))
const ehContas = computed(() => props.id === 4)
const busca = ref('')
const pagina = ref(1)
const aberto = ref<ItemDeConta | null>(null)

/** Quem lê o vínculo vê o item ou o estado sem acesso. */
function acessoAoVinculo(v: Vinculo) {
  const destino = prj.categorias.value.find(x => x.id === v.categoria)
  if (!destino || prj.veCategoria(destino)) return { ve: true as const }
  const dono = prj.projetoDa(destino)
  const fechado = !!dono && prj.enxerga(dono)
  return { ve: false as const, dica: fechado ? props.t.lista.semAcessoFechado(dono!.nome) : props.t.lista.semAcessoPrivado }
}

const corDoStatus: Record<ItemDeConta['status'], 'neutral' | 'success' | 'info' | 'error'> = {
  'Em aprovação': 'neutral',
  'Aprovada': 'info',
  'Paga': 'success',
  'Vencida': 'error',
}

const colunasContas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.lista.referencia },
  { key: 'descricao', label: props.t.lista.descricao },
  { key: 'valor', label: props.t.lista.valor },
  { key: 'vencimento', label: props.t.lista.vencimento },
  { key: 'status', label: props.t.lista.status },
  { key: 'fornecedor', label: props.t.lista.fornecedor },
  { key: 'processo', label: props.t.lista.processo },
])
const linhasContas = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return contasAPagar
    .filter(i => !q || i.descricao.toLowerCase().includes(q) || i.reference.toLowerCase().includes(q))
    .map(i => ({ ...i, fornecedorTxt: i.fornecedor.display }))
})

/** As outras categorias: 6 linhas ilustrativas, só para a tela não ficar vazia. */
const prefixo = computed(() => c.value.slug.replace(/-/g, '').slice(0, 2).toUpperCase())
const colunasGenericas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.lista.referencia },
  { key: 'descricao', label: props.t.lista.descricao },
  { key: 'criado', label: props.t.lista.criadoEm },
])
const linhasGenericas = computed(() => Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  reference: `${prefixo.value}${String(c.value.itens - i).padStart(4, '0')}`,
  descricao: `${c.value.name} ${c.value.itens - i}`,
  criado: props.t.lista.data(`2026-11-${String(24 - i * 3).padStart(2, '0')}`),
})))
</script>

<template>
  <div class="flex flex-col">
    <!-- cabeçalho da categoria, com o selo do projeto (proposta) -->
    <div class="flex flex-wrap items-center gap-3 px-6 pb-2 pt-5">
      <span class="flex size-9 items-center justify-center rounded-lg bg-elevated"><UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-5 text-toned" /></span>
      <div class="min-w-0 flex-1">
        <h1 class="truncate text-xl font-semibold text-highlighted">{{ c.name }}</h1>
        <p v-if="c.description" class="truncate text-sm text-muted">{{ c.description }}</p>
      </div>
      <div v-if="projeto" class="flex flex-col items-end gap-1" :class="marca">
        <UButton color="neutral" variant="outline" size="sm" class="gap-2" :aria-label="t.lista.abrirProjeto(projeto.nome)" @click="prj.abrirProjeto(projeto.id)">
          <span class="flex size-5 items-center justify-center rounded" :class="COR_DO_PROJETO[projeto.cor]"><UIcon :name="projeto.icone" class="size-3" /></span>
          {{ projeto.nome }}
          <UIcon :name="ICONE_DA_VISIBILIDADE[projeto.visibilidade]" class="size-3.5 text-muted" />
        </UButton>
        <span v-if="projeto.visibilidade !== 'aberto'" class="text-xs text-muted">{{ t.lista.soParticipantes(projeto.nome) }}</span>
      </div>
    </div>

    <!-- abas de visualização (cópia) -->
    <div class="flex items-center gap-1 border-b border-default px-3 py-2">
      <UButton icon="i-lucide-table" :label="t.lista.itens" size="sm" color="primary" variant="soft" />
      <USeparator orientation="vertical" class="mx-1 h-5" />
      <UButton icon="i-lucide-plus" :label="t.lista.visualizar" size="sm" color="neutral" variant="ghost" />
    </div>

    <!-- barra da lista (cópia) -->
    <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2.5">
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.lista.pesquisar" :aria-label="t.lista.pesquisar" variant="none" size="sm" class="w-56" />
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-calendar" class="size-4" />{{ t.lista.criadoEm }}</span>
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-arrow-down-up" class="size-4" />{{ t.lista.todoPeriodo }}</span>
      <div class="ml-auto flex items-center gap-1">
        <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.exportar" />
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.colunas" />
        <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.filtros" />
        <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.configurar" />
        <UButton icon="i-lucide-plus" :label="t.lista.novoRegistro" color="primary" variant="soft" size="sm" class="ml-1" />
      </div>
    </div>

    <div class="animate-[entrada_.25s_ease-out]">
      <EnTable
        v-if="ehContas"
        :columns="colunasContas"
        :rows="linhasContas"
        selectable
        :pagination="{ page: pagina, pageCount: 1, total: linhasContas.length }"
        :empty-state="{ icon: 'i-lucide-search-x', title: t.lista.vazio, description: '' }"
        :locale="idioma"
        @page-change="pagina = $event"
        @row-click="(r) => (aberto = r as ItemDeConta)"
      >
        <template #cell-reference="{ row }">
          <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as ItemDeConta).reference }}</UBadge>
        </template>
        <template #cell-descricao="{ row }">
          <span class="block max-w-64 truncate text-sm text-highlighted">{{ (row as ItemDeConta).descricao }}</span>
        </template>
        <template #cell-valor="{ row }">
          <span class="text-sm tabular-nums">{{ t.lista.moeda((row as ItemDeConta).valor) }}</span>
        </template>
        <template #cell-vencimento="{ row }">
          <span class="text-sm text-muted">{{ t.lista.data((row as ItemDeConta).vencimento) }}</span>
        </template>
        <template #cell-status="{ row }">
          <UBadge :label="t.lista.statusDe[(row as ItemDeConta).status]" :color="corDoStatus[(row as ItemDeConta).status]" variant="subtle" size="sm" />
        </template>
        <template #cell-fornecedor="{ row }">
          <UBadge :label="(row as ItemDeConta).fornecedor.display" icon="i-lucide-link-2" color="neutral" variant="outline" size="sm" class="max-w-56 truncate" />
        </template>
        <template #cell-processo="{ row }">
          <template v-if="(row as ItemDeConta).processo">
            <UBadge
              v-if="acessoAoVinculo((row as ItemDeConta).processo!).ve"
              :label="(row as ItemDeConta).processo!.display"
              icon="i-lucide-link-2"
              color="neutral"
              variant="outline"
              size="sm"
              class="max-w-56 truncate"
            />
            <UTooltip v-else :text="(acessoAoVinculo((row as ItemDeConta).processo!) as { dica: string }).dica">
              <UBadge :label="t.lista.itemSemAcesso" icon="i-lucide-lock" color="neutral" variant="soft" size="sm" :class="marca" />
            </UTooltip>
          </template>
        </template>
      </EnTable>

      <template v-else>
        <p class="flex items-center gap-1.5 px-4 pt-3 text-xs text-muted"><UIcon name="i-lucide-info" class="size-3.5" />{{ t.lista.ilustrativa }}</p>
        <EnTable
          :columns="colunasGenericas"
          :rows="linhasGenericas"
          selectable
          :pagination="{ page: 1, pageCount: 1, total: linhasGenericas.length }"
          :empty-state="{ icon: 'i-lucide-inbox', title: t.lista.vazio, description: '' }"
          :locale="idioma"
        >
          <template #cell-reference="{ row }">
            <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as { reference: string }).reference }}</UBadge>
          </template>
        </EnTable>
      </template>
    </div>

    <!-- o item aberto: o campo de vínculo no formulário -->
    <USlideover :open="!!aberto" :title="aberto ? `${aberto.reference} · ${aberto.descricao}` : ''" :description="t.lista.detalhes" @update:open="(v: boolean) => { if (!v) aberto = null }">
      <template #body>
        <dl v-if="aberto" class="space-y-4">
          <div>
            <dt class="text-xs font-medium text-muted">{{ t.lista.valor }}</dt>
            <dd class="mt-1 text-sm text-highlighted tabular-nums">{{ t.lista.moeda(aberto.valor) }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-muted">{{ t.lista.vencimento }}</dt>
            <dd class="mt-1 text-sm text-highlighted">{{ t.lista.data(aberto.vencimento) }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-muted">{{ t.lista.fornecedor }}</dt>
            <dd class="mt-1"><UBadge :label="aberto.fornecedor.display" icon="i-lucide-link-2" color="neutral" variant="outline" /></dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-muted">{{ t.lista.processo }}</dt>
            <dd class="mt-1">
              <template v-if="aberto.processo">
                <UBadge v-if="acessoAoVinculo(aberto.processo).ve" :label="aberto.processo.display" icon="i-lucide-link-2" color="neutral" variant="outline" />
                <div v-else class="flex items-start gap-2 rounded-md border border-default bg-elevated/50 px-3 py-2" :class="marca">
                  <UIcon name="i-lucide-lock" class="mt-0.5 size-4 shrink-0 text-muted" />
                  <span>
                    <span class="block text-sm text-highlighted">{{ t.lista.itemSemAcesso }}</span>
                    <span class="block text-xs text-muted">{{ (acessoAoVinculo(aberto.processo) as { dica: string }).dica }}</span>
                  </span>
                </div>
              </template>
              <span v-else class="text-sm text-muted">{{ t.lista.semVinculo }}</span>
            </dd>
          </div>
        </dl>
      </template>
    </USlideover>
  </div>
</template>
