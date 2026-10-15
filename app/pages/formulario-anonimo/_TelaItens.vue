<script setup lang="ts">
/**
 * Categorias › Ouvidoria. Cópia da "Nova Visualização de Itens" do develop
 * (abas Itens/Visualizar, busca, período, ícones, Novo registro) sobre o `EnTable`.
 *
 * O que muda é o dado (as linhas vieram do formulário com respostas anônimas)
 * e, quando o formulário abre sem login, a faixa do link. A tabela não ganha
 * coluna de criador (o develop já não oferece). Clicar na linha abre o painel
 * do item (`_PainelDaDenuncia`).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { type Denuncia, HOJE, type Situacao, volume24h } from './mocks'
import { useFormularioAnonimo, useMarcaDeProposta } from './estado'
import PainelDaDenuncia from './_PainelDaDenuncia.vue'

const props = defineProps<{ t: Textos }>()

const idioma = useIdioma()
const { listaDaCategoria, itemAberto, abaDoItem, canalCriado, linkPausado: pausado, formularioDoCanal, inicioDoCanal, ir } = useFormularioAnonimo()
const marca = useMarcaDeProposta()

/* ---------- PROPOSTA: a faixa do link sem login ---------- */

const semLogin = computed(() => canalCriado.value && formularioDoCanal.value.visibilidade === 'publico' && formularioDoCanal.value.semLogin)
const aceitasHoje = computed(() => listaDaCategoria.value.filter(d => !d.teste && +d.created_at >= +new Date(HOJE.getFullYear(), HOJE.getMonth(), HOJE.getDate())).length)
// Formulário criado na jornada do configurador: ainda não houve envio barrado.
const barradas = computed(() => (inicioDoCanal.value ? 0 : volume24h.reduce((s, h) => s + h.barrados, 0)).toLocaleString(idioma.value))
function verProtecao() {
  ir('formularios', { formulario: formularioDoCanal.value.id, abaDoFormulario: 'avancado' })
}
const busca = ref('')
const pagina = ref(1)
const POR_PAGINA = 15

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  if (!q) return listaDaCategoria.value
  return listaDaCategoria.value.filter(d => d.reference.toLowerCase().includes(q) || d.data.protocolo.toLowerCase().includes(q) || d.data.relato.toLowerCase().includes(q))
})
watch(busca, () => (pagina.value = 1))
const daPagina = computed(() => filtrados.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA))

type CorDaSituacao = 'info' | 'primary' | 'warning' | 'success' | 'neutral'
const corDaSituacao: Record<Situacao, CorDaSituacao> = { nova: 'info', em_analise: 'primary', aguardando: 'warning', concluida: 'success', arquivada: 'neutral' }

const formatoDia = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' }))

interface Linha extends Record<string, unknown> {
  id: number
  reference: string
  protocolo: string
  situacao: Situacao
  tipo: string
  area: string
  recebida: string
  retorno: string
  atrasado: boolean
  mensagens: number
  teste: boolean
}

const linhas = computed<Linha[]>(() => daPagina.value.map((d: Denuncia) => {
  const retorno = new Date(`${d.data.retorno_ate}T12:00:00`)
  return {
    id: d.id,
    reference: d.reference,
    protocolo: d.data.protocolo,
    situacao: d.data.situacao,
    tipo: d.data.tipo,
    area: d.data.area,
    recebida: formatoDia.value.format(d.created_at),
    retorno: formatoDia.value.format(retorno),
    atrasado: !['concluida', 'arquivada'].includes(d.data.situacao) && (+retorno - +HOJE) / 86400000 < 15,
    mensagens: d.mensagensNovas,
    teste: !!d.teste,
  }
}))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.itens.col.reference },
  { key: 'protocolo', label: props.t.itens.col.protocolo },
  { key: 'situacao', label: props.t.itens.col.situacao },
  { key: 'tipo', label: props.t.itens.col.tipo },
  { key: 'area', label: props.t.itens.col.area },
  { key: 'recebida', label: props.t.itens.col.recebida },
  { key: 'retorno', label: props.t.itens.col.retorno },
  { key: 'mensagens', label: props.t.itens.col.mensagens },
])

function abrir(id: number, aba: 'visao' | 'conversa' = 'visao') {
  abaDoItem.value = aba
  itemAberto.value = id
}

function menuDaLinha(id: number): DropdownMenuItem[][] {
  return [[
    { label: props.t.itens.verDetalhes, icon: 'i-lucide-eye', onSelect: () => abrir(id) },
    { label: props.t.item.abas.conversa, icon: 'i-lucide-messages-square', onSelect: () => abrir(id, 'conversa') },
  ]]
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Abas de visualização (cópia) -->
    <div class="flex items-center gap-1 border-b border-default px-3 py-2">
      <UButton icon="i-lucide-table" :label="t.itens.vistaItens" size="sm" color="primary" variant="soft" />
      <UButton icon="i-lucide-plus" :label="t.itens.visualizar" size="sm" color="neutral" variant="ghost" />
    </div>

    <!-- Barra da lista (cópia) -->
    <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2.5">
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.itens.pesquisar" variant="none" size="sm" class="w-56" />
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-calendar" class="size-4" />{{ t.itens.criadoEm }}</span>
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-arrow-down-up" class="size-4" />{{ t.itens.todoPeriodo }}</span>
      <div class="ml-auto flex items-center gap-1">
        <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.exportar" />
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.colunas" />
        <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.filtros" />
        <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.configurar" />
        <UButton icon="i-lucide-plus" :label="t.itens.novoRegistro" color="primary" variant="soft" size="sm" class="ml-1" />
      </div>
    </div>

    <!-- PROPOSTA: a faixa do link sem login -->
    <div v-if="semLogin" class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2 text-sm" :class="[pausado ? 'bg-warning/10' : 'bg-elevated/50', marca]">
      <UIcon :name="pausado ? 'i-lucide-circle-pause' : 'i-lucide-link'" class="size-4" :class="pausado ? 'text-warning' : 'text-toned'" />
      <span class="font-medium text-highlighted">{{ pausado ? t.monitor.pausado : `${t.monitor.link}: ${formularioDoCanal.nome}` }}</span>
      <UBadge v-if="formularioDoCanal.respostasAnonimas" :label="t.categoria.seloAnonimas" icon="i-lucide-venetian-mask" color="info" variant="subtle" size="sm" />
      <span v-if="!pausado" class="text-toned">{{ t.monitor.hoje(aceitasHoje, barradas) }}</span>
      <span class="ml-auto flex flex-wrap gap-2">
        <UButton :icon="pausado ? 'i-lucide-play' : 'i-lucide-pause'" :label="pausado ? t.monitor.retomar : t.monitor.pausar" color="neutral" variant="outline" size="xs" @click="pausado = !pausado" />
        <UButton icon="i-lucide-shield-check" :label="t.monitor.protecao" color="neutral" variant="outline" size="xs" @click="verProtecao" />
      </span>
    </div>

    <!-- Vazio: ainda não chegou resposta -->
    <UEmpty
      v-if="!listaDaCategoria.length"
      icon="i-lucide-shield-alert"
      :title="t.itens.vazioTitulo"
      :description="t.itens.vazioTexto"
      :actions="[{ label: t.itens.vazioAcao, icon: 'i-lucide-external-link', color: 'neutral', variant: 'outline', onClick: () => ir('publico') }]"
      class="mx-auto my-16 max-w-md animate-[entrada_.3s_ease-out]"
    />

    <!-- Tabela -->
    <div v-else class="animate-[entrada_.25s_ease-out]">
      <EnTable
        :columns="colunas"
        :rows="linhas"
        selectable
        :pagination="{ page: pagina, pageCount: Math.max(1, Math.ceil(filtrados.length / POR_PAGINA)), total: filtrados.length }"
        :empty-state="{ icon: 'i-lucide-search-x', title: t.itens.nadaEncontrado, description: t.itens.nadaEncontradoDica }"
        :locale="idioma"
        @page-change="pagina = $event"
        @row-click="(r) => abrir((r as Linha).id)"
      >
        <template #cell-reference="{ row }">
          <span class="flex items-center gap-1.5">
            <UBadge color="info" variant="subtle" size="sm" class="max-w-40 truncate font-mono text-[11px]">{{ (row as Linha).reference }}</UBadge>
            <UIcon name="i-lucide-copy" class="size-3.5 text-dimmed" />
          </span>
        </template>
        <template #cell-protocolo="{ row }">
          <span class="flex items-center gap-1.5">
            <span class="font-mono text-xs text-highlighted">{{ (row as Linha).protocolo }}</span>
            <UBadge v-if="(row as Linha).teste" :label="t.teste.selo" icon="i-lucide-flask-conical" color="warning" variant="subtle" size="sm" :class="marca" />
          </span>
        </template>
        <template #cell-situacao="{ row }">
          <UBadge :label="t.situacoes[(row as Linha).situacao]" :color="corDaSituacao[(row as Linha).situacao]" variant="subtle" size="sm" />
        </template>
        <template #cell-retorno="{ row }">
          <span class="text-sm" :class="(row as Linha).atrasado ? 'font-medium text-warning' : 'text-toned'">{{ (row as Linha).retorno }}</span>
        </template>
        <template #cell-mensagens="{ row }">
          <UBadge v-if="(row as Linha).mensagens" :label="t.itens.novas((row as Linha).mensagens)" color="primary" variant="solid" size="sm" icon="i-lucide-message-circle" />
          <span v-else class="text-sm text-dimmed">-</span>
        </template>
        <template #actions="{ row }">
          <UDropdownMenu :items="menuDaLinha((row as Linha).id)" :content="{ align: 'start' }" :ui="{ content: 'w-56' }">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.itens.acoes" @click.stop />
          </UDropdownMenu>
        </template>
      </EnTable>
    </div>

    <PainelDaDenuncia :t="t" />
  </div>
</template>
