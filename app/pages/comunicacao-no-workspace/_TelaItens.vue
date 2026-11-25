<script setup lang="ts">
/**
 * Lista de itens de uma categoria. Cópia da "Nova Listagem de Registros" do
 * develop (barra de busca, período, ícones, Novo registro) sobre o `EnTable`,
 * e da visualização Kanban sobre o `EnKanbanBoard`.
 *
 * PROPOSTA:
 *  - "E-mail" no menu de cada linha e no clique direito do cartão, com os
 *    contatos do item (só e-mail: WhatsApp e SMS saíram do plano);
 *  - o botão do link público, ao lado de "Novo registro", quando a categoria
 *    tem formulário público.
 */
import type { DropdownMenuItem, ContextMenuItem } from '@nuxt/ui'
import type { EnKanbanCardConfig, EnKanbanColumn, EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { type ItemDoProtótipo, type StatusDoItem, categoriaPorSlug, itens, workspace } from './mocks'
import { type Contato, cliqueDireitoNoCartao, contatosDoItem, useComunicacao, useMarcaDeProposta } from './estado'
import { useAtalhos, useCopiar } from './atalhos'
import LinksPublicos from './_LinksPublicos.vue'

const props = defineProps<{ t: Textos }>()

const { categoriaAtual, abrirItem, formularios, config, fase } = useComunicacao()
const { ativos, itensDeMenu } = useAtalhos()
const { copiar } = useCopiar()
const marca = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const categoria = computed(() => categoriaPorSlug(categoriaAtual.value))
const vista = ref<'tabela' | 'quadro'>('tabela')
const busca = ref('')
const pagina = ref(1)
const POR_PAGINA = 15

watch(categoriaAtual, () => {
  busca.value = ''
  pagina.value = 1
})

const daCategoria = computed(() => itens.filter(i => i.categoria === categoriaAtual.value && !i.semAcesso))
const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  if (!q) return daCategoria.value
  return daCategoria.value.filter(i => i.reference.toLowerCase().includes(q) || i.titulo.toLowerCase().includes(q))
})
const daPagina = computed(() => filtrados.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA))

// O botão aparece em toda categoria com formulário; sem formulário público, o menu mostra o vazio (RF614).
const temLinkPublico = computed(() => formularios.value.some(f => f.categoria === categoriaAtual.value))

/* ---------- linhas ---------- */

const corDaEtapa: Record<StatusDoItem, 'neutral' | 'info' | 'success' | 'warning' | 'error'> = {
  em_minuta: 'neutral',
  em_assinatura: 'info',
  vigente: 'success',
  em_renovacao: 'warning',
  encerrado: 'neutral',
}

interface Linha extends Record<string, unknown> {
  id: number
  reference: string
  titulo: string
  etapa: StatusDoItem
  contato: Contato | null
  atualizado: string
  item: ItemDoProtótipo
}

const formatoData = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))

function principal(i: ItemDoProtótipo) {
  return contatosDoItem(i, config.value)[0] ?? null
}

const linhas = computed<Linha[]>(() => daPagina.value.map(i => ({
  id: i.id,
  reference: i.reference,
  titulo: i.titulo,
  etapa: i.etapa,
  contato: principal(i),
  atualizado: formatoData.value.format(i.updated_at),
  item: i,
})))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.itens.referencia },
  { key: 'titulo', label: props.t.itens.nome },
  { key: 'etapa', label: props.t.itens.etapa },
  { key: 'contato', label: (fase.value >= 2 ? config.value.porCategoria[categoriaAtual.value].contatos[0]?.rotulo : null) ?? props.t.itens.contato },
  { key: 'atualizado', label: props.t.itens.atualizadoEm },
])

/* ---------- contatar: o mesmo menu na linha e no cartão ---------- */

function opcoesDeContato(i: ItemDoProtótipo): DropdownMenuItem[] {
  if (!ativos.value) return []
  const grupos: DropdownMenuItem[][] = contatosDoItem(i, config.value).map(c => [
    { type: 'label', label: c.nome ? `${c.rotulo} · ${c.nome}` : c.rotulo },
    ...itensDeMenu(c, { item: i, origem: 'item' }),
  ])
  if (!grupos.length) grupos.push([{ label: props.t.atalho.semContato, disabled: true }])
  return [{ label: props.t.atalho.email, icon: 'i-lucide-mail', children: grupos, class: marca.value }]
}

function menuDaLinha(i: ItemDoProtótipo): DropdownMenuItem[][] {
  const existentes: DropdownMenuItem[] = [
    { label: props.t.itens.verDetalhes, icon: 'i-lucide-eye', onSelect: () => abrirItem(i.id) },
    { label: props.t.itens.editar, icon: 'i-lucide-pencil', onSelect: () => abrirItem(i.id) },
    { label: props.t.itens.enviarParaLixeira, icon: 'i-lucide-trash-2' },
    { label: props.t.itens.copiarLink, icon: 'i-lucide-link', onSelect: () => copiar(`item-${i.id}`, `https://app.enspace.io/workspaces/${workspace.reference}/types/${i.categoria}/${i.id}`, i.reference) },
  ]
  const contatar = opcoesDeContato(i)
  return contatar.length ? [existentes, contatar] : [existentes]
}

/* ---------- quadro ---------- */

const colunasDoQuadro = computed<EnKanbanColumn[]>(() =>
  (['em_minuta', 'em_assinatura', 'vigente', 'em_renovacao', 'encerrado'] as StatusDoItem[]).map(s => ({
    value: s,
    label: props.t.etapa[s],
    colorScheme: corDaEtapa[s] === 'neutral' ? 'neutral' : corDaEtapa[s],
  })))

const cartoes = computed(() => filtrados.value.map(i => ({
  id: i.id,
  titulo: i.titulo,
  descricao: `${i.reference} · ${principal(i)?.nome ?? principal(i)?.email ?? props.t.itens.semContato}`,
  etapa: i.etapa,
  created_at: i.created_at.toISOString(),
})))

const cartao: EnKanbanCardConfig = {
  header: 'titulo',
  content: 'descricao',
  createdAtField: { refId: 'created_at', name: 'Criado em' },
}

/** O cartão em que a pessoa clicou com o botão direito. */
const cartaoDoMenu = ref<ItemDoProtótipo | null>(null)
const menuDoCartao = computed<ContextMenuItem[][]>(() => {
  const i = cartaoDoMenu.value
  if (!i) return []
  // Cópia do menu que o cartão já tem no develop (código da develop lido em 25/11/2026): Ver
  // Detalhes, Editar, Mover para, Enviar para Lixeira e Copiar Link. A proposta soma o "E-mail".
  return [
    [{ type: 'label', label: `${i.reference} · ${i.titulo}` }],
    [
      { label: props.t.itens.verDetalhes, icon: 'i-lucide-eye', onSelect: () => abrirItem(i.id) },
      { label: props.t.itens.editar, icon: 'i-lucide-pencil', onSelect: () => abrirItem(i.id) },
      { label: props.t.itens.moverPara, icon: 'i-lucide-move-right', children: colunasDoQuadro.value.map(c => ({ label: c.label })) },
      { label: props.t.itens.enviarParaLixeira, icon: 'i-lucide-trash-2' },
      { label: props.t.itens.copiarLink, icon: 'i-lucide-link', onSelect: () => copiar(`item-${i.id}`, `https://app.enspace.io/workspaces/${workspace.reference}/types/${i.categoria}/${i.id}`, i.reference) },
    ],
    opcoesDeContato(i) as ContextMenuItem[],
  ].filter(g => g.length)
})
</script>

<template>
  <div class="flex flex-col">
    <!-- Abas de visualização (cópia) -->
    <div class="flex items-center gap-1 border-b border-default px-3 py-2">
      <UButton
        icon="i-lucide-table"
        :label="t.itens.vistaItens"
        size="sm"
        :color="vista === 'tabela' ? 'primary' : 'neutral'"
        :variant="vista === 'tabela' ? 'soft' : 'ghost'"
        @click="vista = 'tabela'"
      />
      <UButton
        icon="i-lucide-kanban"
        :label="t.itens.vistaQuadro"
        size="sm"
        :color="vista === 'quadro' ? 'primary' : 'neutral'"
        :variant="vista === 'quadro' ? 'soft' : 'ghost'"
        @click="vista = 'quadro'"
      />
      <USeparator orientation="vertical" class="mx-1 h-5" />
      <UButton icon="i-lucide-plus" :label="t.itens.visualizar" size="sm" color="neutral" variant="ghost" />
    </div>

    <!-- Barra da lista (cópia) + o link público (proposta) -->
    <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2.5">
      <UInput
        v-model="busca"
        icon="i-lucide-search"
        :placeholder="t.itens.pesquisar"
        variant="none"
        size="sm"
        class="w-56"
      />
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-calendar" class="size-4" />{{ t.itens.criadoEm }}</span>
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-arrow-down-up" class="size-4" />{{ t.itens.todoPeriodo }}</span>

      <div class="ml-auto flex items-center gap-1">
        <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.exportar" />
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.colunas" />
        <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.filtros" />
        <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.configurar" />
        <LinksPublicos v-if="temLinkPublico" :t="t" :categoria="categoriaAtual" class="ml-1" />
        <UButton icon="i-lucide-plus" :label="t.itens.novoRegistro" color="primary" variant="soft" size="sm" class="ml-1" />
      </div>
    </div>

    <!-- Tabela -->
    <div v-if="vista === 'tabela'" class="animate-[entrada_.25s_ease-out]">
      <EnTable
        :columns="colunas"
        :rows="linhas"
        selectable
        :pagination="{ page: pagina, pageCount: Math.max(1, Math.ceil(filtrados.length / POR_PAGINA)), total: filtrados.length }"
        :empty-state="{ icon: 'i-lucide-search-x', title: t.itens.nadaEncontrado, description: t.itens.nadaEncontradoDica }"
        :locale="idioma"
        @page-change="pagina = $event"
        @row-click="(r) => abrirItem((r as Linha).id)"
      >
        <template #cell-reference="{ row }">
          <span class="flex items-center gap-1.5">
            <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as Linha).reference }}</UBadge>
            <UIcon name="i-lucide-copy" class="size-3.5 text-dimmed" />
          </span>
        </template>
        <template #cell-titulo="{ row }">
          <span class="block max-w-80 truncate text-sm text-highlighted">{{ (row as Linha).titulo }}</span>
        </template>
        <template #cell-etapa="{ row }">
          <UBadge :label="t.etapa[(row as Linha).etapa]" :color="corDaEtapa[(row as Linha).etapa]" variant="subtle" size="sm" />
        </template>
        <template #cell-contato="{ row }">
          <span v-if="(row as Linha).contato?.nome || (row as Linha).contato?.email" class="block max-w-64 truncate text-sm">
            <span class="text-highlighted">{{ (row as Linha).contato?.nome ?? '' }}</span>
            <span class="ml-1.5 text-muted">{{ (row as Linha).contato?.email ?? '' }}</span>
          </span>
          <span v-else class="text-sm text-dimmed">{{ t.itens.semContato }}</span>
        </template>
        <template #actions="{ row }">
          <UDropdownMenu :items="menuDaLinha((row as Linha).item)" :content="{ align: 'end' }" :ui="{ content: 'w-64' }">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.itens.acoes" @click.stop />
          </UDropdownMenu>
        </template>
      </EnTable>
    </div>

    <!-- Quadro: o clique direito no cartão abre o menu com "Contatar" -->
    <div v-else class="animate-[entrada_.25s_ease-out] p-4">
      <p class="mb-3 flex items-center gap-1.5 text-xs text-muted" :class="marca">
        <UIcon name="i-lucide-mouse-pointer-click" class="size-3.5" />
        {{ t.itens.dicaDoQuadro }}
      </p>
      <ClientOnly>
        <UContextMenu :items="menuDoCartao" :ui="{ content: 'w-80' }">
          <div>
            <div @contextmenu.capture="(ev: MouseEvent) => cliqueDireitoNoCartao(ev, texto => itens.find(i => texto.includes(i.reference)) ?? undefined, i => (cartaoDoMenu = i))">
            <EnKanbanBoard
              :data="cartoes"
              :card-map="cartao"
              :columns="colunasDoQuadro"
              group-by="etapa"
              primary-key="id"
              :stagger-column-ms="60"
              :locale="idioma"
              @card-click="(c) => abrirItem(Number((c as { id: number }).id))"
            />
            </div>
          </div>
        </UContextMenu>
      </ClientOnly>
    </div>
  </div>
</template>
