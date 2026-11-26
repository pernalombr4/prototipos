<script setup lang="ts">
/**
 * PROPOSTA (rodada 3): a aba Itens do projeto. Os itens de todas as categorias do projeto numa
 * visão só, como o GitHub Projects junta issues de vários repositórios.
 *
 * A barra e o corpo são os da lista da categoria (memória "tela nova usa a listagem da
 * categoria"): abas Tabela e Quadro, busca, filtros, Configurar e Novo registro, sobre o
 * `EnTable` e o `EnKanbanBoard`.
 *
 * Responsável, Prazo e Status não são do item no produto: são campos de cada categoria. A visão lê
 * o mapa de cada categoria (Configurações do projeto, aba Campos comuns), como a Agenda lê o campo
 * de data de cada uma. Categoria sem o campo mostra "Sem campo", com a dica de onde escolher.
 *
 * Peça nova no back-end: a leitura de itens de várias categorias numa chamada só, com a
 * permissão checada por categoria (contorno azul na chave do andaime).
 */
import type { EnKanbanCardConfig, EnKanbanColumn, EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { iniciais, itensDoProjeto, pessoa, type GrupoDeStatus, type ItemDoProjeto } from './mocks'
import { useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const { marca, marcaBack } = useMarcaDeProposta()
const idioma = useIdioma()

const HOJE = '2026-11-26'
const p = computed(() => prj.projetos.value.find(x => x.id === props.id)!)
const admin = computed(() => prj.podeAdministrar(p.value))
const categorias = computed(() => prj.categoriasDe(props.id).filter(c => prj.veCategoria(c)))
const nomeDaCategoria = (id: number) => prj.categorias.value.find(c => c.id === id)?.name ?? ''

const vista = ref<'tabela' | 'quadro'>('tabela')
const busca = ref('')
const filtroCategorias = ref<number[]>([])
const soMeus = ref(false)
const aberto = ref<Linha | null>(null)

interface Linha {
  id: number
  item: ItemDoProjeto
  categoria: number
  reference: string
  titulo: string
  responsavel: number | null
  prazo: string | null
  status: string | null
  grupo: GrupoDeStatus
  vencido: boolean
  /** As colunas que a categoria não preenche, para a dica. */
  semResponsavel: boolean
  semPrazo: boolean
}

const linhas = computed<Linha[]>(() => {
  const ids = new Set(categorias.value.map(c => c.id))
  const q = busca.value.trim().toLowerCase()
  return itensDoProjeto
    .filter(i => ids.has(i.categoria))
    .map((i) => {
      const m = prj.mapas.value[i.categoria]
      const resp = m?.responsavel ? Number(i.campos[m.responsavel]) || null : null
      const prazo = m?.prazo ? String(i.campos[m.prazo] ?? '') || null : null
      const status = m?.status ? String(i.campos[m.status] ?? '') || null : null
      const grupo: GrupoDeStatus = (status && m?.grupos[status]) || 'aberto'
      return {
        id: i.id,
        item: i,
        categoria: i.categoria,
        reference: i.reference,
        titulo: i.titulo,
        responsavel: resp,
        prazo,
        status,
        grupo,
        vencido: !!prazo && prazo < HOJE && grupo !== 'concluido',
        semResponsavel: !m?.responsavel,
        semPrazo: !m?.prazo,
      }
    })
    .filter(l => !filtroCategorias.value.length || filtroCategorias.value.includes(l.categoria))
    .filter(l => !soMeus.value || l.responsavel === prj.eu.value)
    .filter(l => !q || l.titulo.toLowerCase().includes(q) || l.reference.toLowerCase().includes(q))
    .sort((a, b) => (a.prazo ?? '9999').localeCompare(b.prazo ?? '9999'))
})

const opcoesDeCategoria = computed(() => categorias.value.map(c => ({ value: c.id, label: c.name, icon: c.icon ?? 'i-lucide-folder' })))
const corDoGrupo: Record<GrupoDeStatus, 'neutral' | 'info' | 'success'> = { aberto: 'neutral', andamento: 'info', concluido: 'success' }
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value)

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.itensDoProjeto.referencia },
  { key: 'titulo', label: props.t.itensDoProjeto.titulo },
  { key: 'categoria', label: props.t.itensDoProjeto.categoria },
  { key: 'responsavel', label: props.t.itensDoProjeto.responsavel },
  { key: 'prazo', label: props.t.itensDoProjeto.prazo },
  { key: 'status', label: props.t.itensDoProjeto.status },
])

/* ---------- quadro ---------- */
const colunasDoQuadro = computed<EnKanbanColumn[]>(() => (['aberto', 'andamento', 'concluido'] as const).map(g => ({
  value: g,
  label: props.t.itensDoProjeto.grupo[g],
  colorScheme: corDoGrupo[g],
})))
const cartoes = computed(() => linhas.value.map(l => ({
  id: l.id,
  titulo: l.titulo,
  descricao: `${l.reference} · ${nomeDaCategoria(l.categoria)}${l.status ? ` · ${l.status}` : ''}${l.responsavel ? ` · ${pessoa(l.responsavel)?.nome}` : ''}`,
  grupo: l.grupo,
  prazo: l.prazo ?? undefined,
})))
const cartao: EnKanbanCardConfig = {
  header: 'titulo',
  content: 'descricao',
  dueDateField: { refId: 'prazo', name: 'Prazo' },
}

/* ---------- barra ---------- */
const novoEm = computed<DropdownMenuItem[][]>(() => [
  [{ type: 'label', label: props.t.itensDoProjeto.escolhaCategoria }],
  categorias.value.map(c => ({ label: c.name, icon: c.icon ?? 'i-lucide-folder', onSelect: () => prj.abrirCategoria(c.id) })),
])
function configurarCampos() {
  prj.janelas.configurar.value = { id: props.id, aba: 'campos' }
}
</script>

<template>
  <div :class="marcaBack">
    <p class="flex items-center gap-1.5 pb-3 text-sm text-muted">
      <UIcon name="i-lucide-layers" class="size-4 shrink-0" />{{ t.itensDoProjeto.resumo(categorias.length) }}
    </p>

    <div class="overflow-hidden rounded-lg border border-default bg-default">
      <!-- abas de visualização (cópia da lista da categoria) -->
      <div class="flex items-center gap-1 border-b border-default px-3 py-2">
        <UButton icon="i-lucide-table" :label="t.itensDoProjeto.tabela" size="sm" :color="vista === 'tabela' ? 'primary' : 'neutral'" :variant="vista === 'tabela' ? 'soft' : 'ghost'" :aria-pressed="vista === 'tabela'" @click="vista = 'tabela'" />
        <UButton icon="i-lucide-kanban" :label="t.itensDoProjeto.quadro" size="sm" :color="vista === 'quadro' ? 'primary' : 'neutral'" :variant="vista === 'quadro' ? 'soft' : 'ghost'" :aria-pressed="vista === 'quadro'" @click="vista = 'quadro'" />
      </div>

      <!-- barra da lista (cópia), com o filtro de categoria (proposta) -->
      <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2.5">
        <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.itensDoProjeto.pesquisar" :aria-label="t.itensDoProjeto.pesquisar" variant="none" size="sm" class="w-64" />
        <USelectMenu
          v-model="filtroCategorias"
          :items="opcoesDeCategoria"
          value-key="value"
          multiple
          size="sm"
          icon="i-lucide-database"
          class="w-56"
          :class="marca"
          :placeholder="t.itensDoProjeto.todasCategorias"
          :aria-label="t.itensDoProjeto.categoria"
          :search-input="false"
        />
        <USwitch v-model="soMeus" :label="t.itensDoProjeto.soMeus" size="sm" :ui="{ label: 'text-sm text-muted' }" />
        <div class="ml-auto flex items-center gap-1">
          <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.exportar" />
          <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.lista.colunas" />
          <UTooltip v-if="admin" :text="t.itensDoProjeto.camposComuns">
            <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" :aria-label="t.itensDoProjeto.camposComuns" @click="configurarCampos" />
          </UTooltip>
          <UDropdownMenu v-if="categorias.length" :items="novoEm" :content="{ align: 'end' }">
            <UButton icon="i-lucide-plus" :label="t.itensDoProjeto.novoRegistro" trailing-icon="i-lucide-chevron-down" color="primary" variant="soft" size="sm" class="ml-1" />
          </UDropdownMenu>
        </div>
      </div>

      <div v-if="!categorias.length || (!linhas.length && !busca && !filtroCategorias.length && !soMeus)" class="flex flex-col items-center gap-2 px-6 py-12 text-center">
        <UIcon name="i-lucide-inbox" class="size-7 text-muted" />
        <p class="text-sm font-semibold text-highlighted">{{ t.itensDoProjeto.semItensTitulo }}</p>
        <p class="max-w-sm text-sm text-muted">{{ t.itensDoProjeto.semItensTexto }}</p>
      </div>

      <div v-else-if="vista === 'tabela'" class="animate-[entrada_.25s_ease-out]">
        <EnTable
          :columns="colunas"
          :rows="linhas"
          selectable
          :pagination="{ page: 1, pageCount: 1, total: linhas.length }"
          :empty-state="{ icon: 'i-lucide-search-x', title: t.itensDoProjeto.vazio, description: '' }"
          :locale="idioma"
          @row-click="(r) => (aberto = r as Linha)"
        >
          <template #cell-reference="{ row }">
            <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as Linha).reference }}</UBadge>
          </template>
          <template #cell-titulo="{ row }">
            <span class="block max-w-64 truncate text-sm text-highlighted">{{ (row as Linha).titulo }}</span>
          </template>
          <template #cell-categoria="{ row }">
            <span class="flex items-center gap-1.5 text-sm text-toned">
              <UIcon :name="prj.categorias.value.find(c => c.id === (row as Linha).categoria)?.icon ?? 'i-lucide-folder'" class="size-3.5 shrink-0 text-muted" />
              <span class="max-w-44 truncate">{{ nomeDaCategoria((row as Linha).categoria) }}</span>
            </span>
          </template>
          <template #cell-responsavel="{ row }">
            <span v-if="(row as Linha).responsavel" class="flex items-center gap-1.5 text-sm">
              <UAvatar size="2xs" :text="iniciais(pessoa((row as Linha).responsavel!)?.nome ?? '')" :alt="pessoa((row as Linha).responsavel!)?.nome" />
              <span class="max-w-36 truncate">{{ pessoa((row as Linha).responsavel!)?.nome }}</span>
            </span>
            <UTooltip v-else-if="(row as Linha).semResponsavel" :text="t.itensDoProjeto.semCampoDica(nomeDaCategoria((row as Linha).categoria), t.itensDoProjeto.responsavel)">
              <span class="text-sm text-dimmed">{{ t.itensDoProjeto.semCampo }}</span>
            </UTooltip>
          </template>
          <template #cell-prazo="{ row }">
            <span v-if="(row as Linha).prazo" class="flex items-center gap-1.5 text-sm" :class="(row as Linha).vencido ? 'text-error' : 'text-muted'">
              {{ formatarData((row as Linha).prazo!) }}
              <UBadge v-if="(row as Linha).vencido" :label="t.itensDoProjeto.vencido" color="error" variant="subtle" size="sm" />
            </span>
            <UTooltip v-else-if="(row as Linha).semPrazo" :text="t.itensDoProjeto.semCampoDica(nomeDaCategoria((row as Linha).categoria), t.itensDoProjeto.prazo)">
              <span class="text-sm text-dimmed">{{ t.itensDoProjeto.semCampo }}</span>
            </UTooltip>
          </template>
          <template #cell-status="{ row }">
            <UBadge v-if="(row as Linha).status" :label="(row as Linha).status!" :color="corDoGrupo[(row as Linha).grupo]" variant="subtle" size="sm" />
          </template>
        </EnTable>
      </div>

      <ClientOnly v-else>
        <div class="p-3 animate-[entrada_.25s_ease-out]">
          <EnKanbanBoard
            :data="cartoes"
            :card-map="cartao"
            :columns="colunasDoQuadro"
            group-by="grupo"
            primary-key="id"
            :stagger-column-ms="60"
            :locale="idioma"
            @card-click="(c) => (aberto = linhas.find(l => l.id === Number((c as { id: number }).id)) ?? null)"
          />
        </div>
      </ClientOnly>
    </div>

    <!-- o item aberto: os campos da categoria e o caminho de volta para ela -->
    <USlideover
      :open="!!aberto"
      :title="aberto ? `${aberto.reference} · ${aberto.titulo}` : ''"
      :description="aberto ? nomeDaCategoria(aberto.categoria) : ''"
      @update:open="(v: boolean) => { if (!v) aberto = null }"
    >
      <template #body>
        <dl v-if="aberto" class="space-y-4">
          <div v-for="(valor, campo) in aberto.item.campos" :key="campo">
            <dt class="text-xs font-medium text-muted">{{ campo }}</dt>
            <dd class="mt-1 text-sm text-highlighted">
              <template v-if="typeof valor === 'number'">
                <span class="flex items-center gap-1.5"><UAvatar size="2xs" :text="iniciais(pessoa(valor)?.nome ?? '')" :alt="pessoa(valor)?.nome" />{{ pessoa(valor)?.nome }}</span>
              </template>
              <template v-else-if="/^\d{4}-\d{2}-\d{2}$/.test(valor)">{{ formatarData(valor) }}</template>
              <template v-else>{{ valor }}</template>
            </dd>
          </div>
        </dl>
      </template>
      <template #footer>
        <UButton v-if="aberto" :label="t.itensDoProjeto.abrirNaCategoria" icon="i-lucide-arrow-up-right" color="neutral" variant="outline" @click="prj.abrirCategoria(aberto.categoria); aberto = null" />
      </template>
    </USlideover>
  </div>
</template>
