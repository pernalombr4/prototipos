<script setup lang="ts">
/**
 * TIPO DE MENU "LISTA DE ITENS".
 *
 * Absorve 4 tipos legados: Consultas, Consultas (Grupo de Membros), Meus
 * Itens e Telas Personalizadas. Os 3 primeiros mostravam a mesma tela (U2);
 * agora a diferença entre eles é o recorte, escrito na tela:
 *   Todos · Só os meus · Do meu grupo.
 *
 * O que muda em relação ao legado:
 *   - a tabela é a nova (EnTable), não a rota antiga `/c-items`, que responde 404;
 *   - mais de 1 categoria na mesma lista (o nativo lista 1 por vez);
 *   - a visualização salva da categoria é o ponto de partida;
 *   - a coluna de expressão (o único recurso de Telas Personalizadas sem par
 *     nativo) entra como coluna da tabela: "Dias para vencer";
 *   - sem grupo, a tela avisa, em vez de cair calada em "só meus itens";
 *   - o título é o nome do menu (U1).
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import { EU, categorias, categoriaPorSlug, diasAte, itens, membroPorId, type ItemDoPrototipo, type SlugDaCategoria, type VisualizacaoSalva } from './mocks'
import { dataCurta, moeda } from './formatar'
import { useTiposDeTela } from './estado'
import CabecalhoDaTela from './_CabecalhoDaTela.vue'
import EstadoDaTela from './_EstadoDaTela.vue'
import VisaoRapida from './_VisaoRapida.vue'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ tentarDeNovo: [] }>()

const { cenario, meusGrupos } = useTiposDeTela()
const idioma = useIdioma()
const toast = useToast()

type Escopo = 'todos' | 'meus' | 'grupo'
const escopo = ref<Escopo>('todos')
const selecionadas = ref<SlugDaCategoria[]>(['contratos', 'fornecedores', 'chamados-ti'])
const visualizacao = ref<VisualizacaoSalva>('padrao')
const busca = ref('')
const pagina = ref(1)
const POR_PAGINA = 15
const aberto = ref<ItemDoPrototipo | null>(null)

watch([escopo, selecionadas, visualizacao, busca], () => { pagina.value = 1 })

const idsDosMeusGrupos = computed(() => meusGrupos.value.map(g => g.id))

function noEscopo(i: ItemDoPrototipo, e: Escopo) {
  if (e === 'meus') return i.user === EU.id
  if (e === 'grupo') return (i.mgroups ?? []).some(g => idsDosMeusGrupos.value.includes(g))
  return true
}

function naVisualizacao(i: ItemDoPrototipo) {
  if (visualizacao.value === 'vencendo') return !!i.vencimento && diasAte(i.vencimento) >= 0 && diasAte(i.vencimento) <= 30
  if (visualizacao.value === 'alto-valor') return (i.valor ?? 0) > 100_000
  if (visualizacao.value === 'sem-responsavel') return i.responsavel === null
  return true
}

const base = computed(() => itens.filter(i => selecionadas.value.includes(i.categoria) && naVisualizacao(i)))

const contagem = computed(() => ({
  todos: base.value.length,
  meus: base.value.filter(i => noEscopo(i, 'meus')).length,
  grupo: idsDosMeusGrupos.value.length ? base.value.filter(i => noEscopo(i, 'grupo')).length : 0,
}))

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return base.value
    .filter(i => noEscopo(i, escopo.value))
    .filter(i => !q || i.reference.toLowerCase().includes(q) || i.titulo.toLowerCase().includes(q))
    .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())
})

const semGrupo = computed(() => escopo.value === 'grupo' && !idsDosMeusGrupos.value.length)

const abas = computed(() => (['todos', 'meus', 'grupo'] as Escopo[]).map(e => ({
  value: e,
  label: props.t.lista.escopos[e],
  badge: { label: String(contagem.value[e]), color: 'neutral' as const, variant: 'soft' as const },
})))

const opcoesDeCategoria = computed(() => categorias.map(c => ({ label: c.name, value: c.slug as SlugDaCategoria, icon: c.icon })))
const opcoesDeVisualizacao = computed(() => (Object.keys(props.t.lista.visualizacoes) as VisualizacaoSalva[]).map(v => ({ label: props.t.lista.visualizacoes[v], value: v })))

const mostrando = computed(() => props.t.lista.mostrando(escopo.value, filtrados.value.length, selecionadas.value.length, meusGrupos.value.map(g => g.nome).join(', ')))

/* ---------------- tabela ---------------- */

interface Linha extends Record<string, unknown> {
  id: number
  reference: string
  titulo: string
  categoria: string
  status: ItemDoPrototipo['situacao']
  responsavel: string
  valor: number | null
  dias: number | null
  atualizado: string
  item: ItemDoPrototipo
}

// reactive(): ver o comentário em _TelaFilaDeTarefas.vue (seleção do EnTable).
const linhas = computed<Linha[]>(() => reactive(filtrados.value
  .slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA)
  .map(i => ({
    id: i.id,
    reference: i.reference,
    titulo: i.titulo,
    categoria: categoriaPorSlug(i.categoria).name,
    status: i.situacao,
    responsavel: membroPorId(i.responsavel)?.nome ?? '',
    valor: i.valor,
    dias: i.vencimento ? diasAte(i.vencimento) : null,
    atualizado: dataCurta(i.updated_at, idioma.value),
    item: i,
  }))) as Linha[])

const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.lista.colunas
  const comContratos = selecionadas.value.includes('contratos')
  return [
    { key: 'reference', label: c.referencia },
    { key: 'titulo', label: c.titulo },
    { key: 'categoria', label: c.categoria },
    { key: 'status', label: c.status },
    { key: 'responsavel', label: c.responsavel },
    { key: 'valor', label: c.valor, align: 'right' },
    ...(comContratos ? [{ key: 'dias', label: c.dias, align: 'right' as const }] : []),
    { key: 'atualizado', label: c.atualizado },
  ]
})

const corDoStatus = { novo: 'info', em_andamento: 'primary', aguardando: 'warning', concluido: 'success', cancelado: 'neutral' } as const

function rotuloDosDias(d: number) {
  if (d === 0) return props.t.lista.venceHoje
  if (d < 0) return props.t.lista.venceu(-d)
  return props.t.lista.vence(d)
}

const novoItem = computed(() => [categorias.map(c => ({
  label: props.t.lista.novoEm(c.name),
  icon: c.icon,
  onSelect: () => toast.add({ title: props.t.lista.novoItem, description: `${c.name}. Maquete: o formulário de criação não faz parte deste protótipo.`, icon: 'i-lucide-info', color: 'neutral' }),
}))])

const exportando = ref(false)
async function exportar() {
  exportando.value = true
  await new Promise(r => setTimeout(r, 800))
  exportando.value = false
  toast.add({ title: props.t.comum.exportar, description: props.t.comum.exportado, icon: 'i-lucide-file-down', color: 'success' })
}

</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <CabecalhoDaTela
      icone="i-lucide-table"
      :titulo="t.lista.titulo"
      :descricao="t.lista.descricao"
      :substitui="['Consultas', 'Consultas (Grupo de Membros)', 'Meus Itens', 'Telas Personalizadas']"
      onde="Tipo de menu, criado em Interface > Menus."
    >
      <template #acoes>
        <UButton :label="t.comum.exportar" icon="i-lucide-file-down" color="neutral" variant="outline" size="sm" :loading="exportando" @click="exportar" />
        <UDropdownMenu :items="novoItem" :content="{ align: 'end' }">
          <UButton :label="t.lista.novoItem" icon="i-lucide-plus" trailing-icon="i-lucide-chevron-down" color="primary" size="sm" />
        </UDropdownMenu>
      </template>
    </CabecalhoDaTela>

    <EstadoDaTela :t="t" :cenario="cenario" forma="tabela" @tentar-de-novo="emit('tentarDeNovo')">
      <template #vazio>
        <UEmpty
          icon="i-lucide-table"
          :title="t.lista.vazioTitulo"
          :description="t.lista.vazioTexto"
          :actions="[{ label: t.lista.vazioAcao, icon: 'i-lucide-plus', color: 'primary', variant: 'soft' }]"
        />
      </template>

      <!-- Barra: recorte, categorias, visualização e busca -->
      <div class="flex flex-wrap items-center gap-3 border-b border-default px-6 py-3">
        <UTabs v-model="escopo" :items="abas" :content="false" size="sm" variant="pill" color="neutral" />
        <USelectMenu
          v-model="selecionadas"
          :items="opcoesDeCategoria"
          value-key="value"
          multiple
          :search-input="false"
          size="sm"
          icon="i-lucide-layout-grid"
          class="w-52"
          :aria-label="t.lista.categorias"
        >
          <template #default>
            <span class="truncate">{{ t.lista.categoriasSelecionadas(selecionadas.length) }}</span>
          </template>
        </USelectMenu>
        <USelect
          v-model="visualizacao"
          :items="opcoesDeVisualizacao"
          size="sm"
          icon="i-lucide-bookmark"
          class="w-52"
          :aria-label="t.lista.visualizacao"
        />
        <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.comum.buscar" size="sm" class="ml-auto w-56" :aria-label="t.comum.buscar" />
      </div>

      <!-- O recorte escrito, para ninguém confundir "vazio" com "filtrado" -->
      <div class="flex flex-wrap items-center gap-2 px-6 py-2 text-xs text-muted">
        <UIcon name="i-lucide-filter" class="size-3.5" />
        <span>{{ mostrando }}</span>
        <UTooltip :text="t.lista.dicaRecorte">
          <UButton icon="i-lucide-info" color="neutral" variant="link" size="xs" :aria-label="t.lista.dicaRecorte" />
        </UTooltip>
      </div>

      <div v-if="semGrupo" class="px-6 py-4">
        <UAlert
          icon="i-lucide-users"
          color="warning"
          variant="subtle"
          :title="t.lista.semGrupoTitulo"
          :description="t.lista.semGrupoTexto"
        />
      </div>

      <div v-else :key="`${escopo}-${visualizacao}-${selecionadas.join()}`" class="min-h-0 flex-1 overflow-auto animate-[entrada_.25s_ease-out]">
        <EnTable
          :columns="colunas"
          :rows="linhas"
          selectable
          :pagination="{ page: pagina, pageCount: Math.max(1, Math.ceil(filtrados.length / POR_PAGINA)), total: filtrados.length }"
          :empty-state="{ icon: 'i-lucide-search-x', title: t.lista.nadaEncontrado, description: t.lista.nadaEncontradoDica }"
          :locale="idioma"
          @page-change="pagina = $event"
          @row-click="(r) => (aberto = (r as Linha).item)"
        >
          <template #cell-reference="{ row }">
            <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as Linha).reference }}</UBadge>
          </template>
          <template #cell-titulo="{ row }">
            <span class="block max-w-80 truncate text-sm text-highlighted" :title="(row as Linha).titulo">{{ (row as Linha).titulo }}</span>
          </template>
          <template #cell-status="{ row }">
            <UBadge :label="t.status[(row as Linha).status]" :color="corDoStatus[(row as Linha).status]" variant="subtle" size="sm" />
          </template>
          <template #cell-responsavel="{ row }">
            <span v-if="(row as Linha).responsavel" class="flex items-center gap-2 text-sm">
              <UAvatar :text="(row as Linha).responsavel.split(' ').map(p => p[0]).slice(0, 2).join('')" size="2xs" />
              <span class="max-w-40 truncate">{{ (row as Linha).responsavel }}</span>
            </span>
            <span v-else class="text-sm text-dimmed">{{ t.comum.ninguem }}</span>
          </template>
          <template #cell-valor="{ row }">
            <span class="text-sm tabular-nums" :class="(row as Linha).valor === null ? 'text-dimmed' : 'text-default'">
              {{ (row as Linha).valor === null ? '-' : moeda((row as Linha).valor, idioma) }}
            </span>
          </template>
          <template #cell-dias="{ row }">
            <UTooltip v-if="(row as Linha).dias !== null" :text="t.lista.dicaExpressao">
              <UBadge
                :label="rotuloDosDias((row as Linha).dias!)"
                :color="(row as Linha).dias! < 0 ? 'error' : (row as Linha).dias! <= 30 ? 'warning' : 'neutral'"
                variant="soft"
                size="sm"
                class="tabular-nums"
              />
            </UTooltip>
            <span v-else class="text-sm text-dimmed">-</span>
          </template>
        </EnTable>
      </div>
    </EstadoDaTela>

    <VisaoRapida :t="t" :item="aberto" @fechar="aberto = null" />
  </div>
</template>
