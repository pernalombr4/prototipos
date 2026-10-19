<script setup lang="ts">
/**
 * Pedido 1: Logs › Audit.
 *
 * Hoje (develop, 2026-10-19) a tela lista só Create e Update sobre modelos, com
 * as colunas ID, Action, Model, Reference, User, Workspace, IP Address e Date,
 * busca, período e gaveta de detalhe. Não há login, visualização, download nem
 * exportação, e a retenção (720 dias, lida no "Expira em" da gaveta) não aparece.
 *
 * Proposta: os eventos que o cliente pediu, filtro por categoria e por tipo de
 * ator (pessoa, conta de serviço, BENI, fluxo), workspace no topo, exportação
 * CSV e a retenção visível e ajustável. A forma da tela (tabela + gaveta) fica.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import type { Tela } from './_CascaDoAdmin.vue'
import Cabecalho from './_Cabecalho.vue'
import { DIA, categoriaDoEvento, eventos, nomeDoWorkspace, workspaces } from './mocks'
import type { Categoria, Evento, TipoDeAtor } from './mocks'
import { data, dataHora, numero, relativo } from './apoio'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const emit = defineEmits<{ navegar: [tela: Tela] }>()
const idioma = useIdioma()
const toast = useToast()
const ta = computed(() => props.t.auditoria)

const busca = ref('')
const workspace = ref<string>('todos')
const categoria = ref<Categoria | 'todas'>('todas')
const ator = ref<TipoDeAtor | 'todos'>('todos')
const pagina = ref(1)
const POR_PAGINA = 12
const retencao = useState('sa-retencao', () => 720)

const itensWorkspace = computed(() => [{ label: props.t.comum.todosWorkspaces, value: 'todos' }, ...workspaces.map(w => ({ label: w.name, value: w.reference }))])
const itensAtor = computed(() => [{ label: ta.value.todosAtores, value: 'todos' }, ...(['pessoa', 'conta', 'beni', 'fluxo'] as const).map(a => ({ label: ta.value.atores[a], value: a }))])
const categorias: Categoria[] = ['acesso', 'leitura', 'alteracao', 'saida', 'admin', 'protecao']
const corDaCategoria: Record<Categoria, 'info' | 'neutral' | 'warning' | 'primary' | 'error' | 'success'> = {
  acesso: 'info', leitura: 'neutral', alteracao: 'success', saida: 'warning', admin: 'primary', protecao: 'error',
}

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return eventos.filter((e) => {
    if (workspace.value !== 'todos' && e.workspace !== workspace.value) return false
    if (categoria.value !== 'todas' && categoriaDoEvento[e.codigo] !== categoria.value) return false
    if (ator.value !== 'todos' && e.ator.tipo !== ator.value) return false
    if (q && !`${e.ator.nome} ${e.ator.email ?? ''} ${e.alvo} ${e.codigo} ${ta.value.eventos[e.codigo]}`.toLowerCase().includes(q)) return false
    return true
  })
})
watch([busca, workspace, categoria, ator], () => { pagina.value = 1 })

const contagem = computed(() => {
  const c: Record<string, number> = {}
  for (const e of eventos) c[categoriaDoEvento[e.codigo]] = (c[categoriaDoEvento[e.codigo]] ?? 0) + 1
  return c
})

const paginaAtual = computed(() => filtrados.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA))
const linhas = computed(() => paginaAtual.value.map(e => ({ ...e, _e: e }) as Record<string, unknown> & { _e: Evento }))
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'id', label: ta.value.col.id },
  { key: 'codigo', label: ta.value.col.evento },
  { key: 'alvo', label: ta.value.col.alvo },
  { key: 'ator', label: ta.value.col.ator },
  { key: 'workspace', label: ta.value.col.workspace },
  { key: 'ip', label: ta.value.col.ip },
  { key: 'quando', label: ta.value.col.data },
])

/* ---------- gaveta ---------- */
const aberto = ref(false)
const escolhido = ref<Evento | null>(null)
function abrir(row: Record<string, unknown>) {
  escolhido.value = (row as { _e: Evento })._e
  aberto.value = true
}

/* ---------- exportar ---------- */
const exportando = ref(false)
function exportar() {
  exportando.value = true
  setTimeout(() => {
    exportando.value = false
    toast.add({ title: ta.value.exportado(filtrados.value.length), icon: 'i-lucide-file-check-2', color: 'success' })
  }, 1200)
}

/* ---------- retenção ---------- */
const modalRetencao = ref(false)
const retencaoNova = ref(retencao.value)
const opcoesRetencao = computed(() => ([365, 720, 1825] as const).map(v => ({ label: ta.value.retencaoOpcoes[v], value: v })))
function salvarRetencao() {
  retencao.value = retencaoNova.value
  modalRetencao.value = false
  toast.add({ title: ta.value.retencaoMudou(ta.value.retencaoOpcoes[retencaoNova.value as 365 | 720 | 1825]), icon: 'i-lucide-check', color: 'success' })
}

const iconeDoAtor: Record<TipoDeAtor, string> = { pessoa: 'i-lucide-user-round', conta: 'i-lucide-bot-message-square', beni: 'i-lucide-sparkles', fluxo: 'i-lucide-workflow', sistema: 'i-lucide-cpu' }
</script>

<template>
  <div>
    <Cabecalho :titulo="ta.titulo" :novo="marcarNovo" :rotulo-novo="t.casca.modificada" cor-selo="info">
      <template #acoes>
        <div class="flex items-center gap-2 rounded-md border border-default bg-default px-3 py-1.5 text-xs" :class="marcarNovo ? 'ring-2 ring-primary/30' : ''">
          <UIcon name="i-lucide-archive" class="size-4 text-primary" />
          <span class="text-muted">{{ ta.retencao }}</span>
          <span class="font-semibold text-highlighted">{{ ta.retencaoValor(retencao) }}</span>
          <UButton :label="ta.mudarRetencao" size="xs" variant="link" class="px-1" @click="retencaoNova = retencao; modalRetencao = true" />
        </div>
        <UButton :label="exportando ? ta.exportando : ta.exportar" icon="i-lucide-download" size="sm" color="neutral" variant="outline" :loading="exportando" @click="exportar" />
      </template>
    </Cabecalho>

    <!-- Barra de filtros: busca e período como hoje; workspace, categoria e ator são proposta -->
    <div class="flex flex-wrap items-center gap-2 border-b border-default/60 px-6 py-3">
      <UInput v-model="busca" :placeholder="ta.buscar" icon="i-lucide-search" size="sm" class="w-56" />
      <UButton :label="ta.periodo" icon="i-lucide-arrow-down-up" size="sm" color="neutral" variant="ghost" />
      <USelect v-model="workspace" :items="itensWorkspace" size="sm" class="w-56" :class="marcarNovo ? 'ring-2 ring-primary/30 rounded-md' : ''" />
      <USelect v-model="ator" :items="itensAtor" size="sm" class="w-52" :class="marcarNovo ? 'ring-2 ring-primary/30 rounded-md' : ''" />
      <UButton :label="ta.colunas" icon="i-lucide-columns-3" size="sm" color="neutral" variant="ghost" class="ml-auto" />
    </div>

    <div class="flex flex-wrap items-center gap-1.5 px-6 pt-3" :class="marcarNovo ? 'animate-[entrada_.3s_ease-out_both]' : ''">
      <UButton
        :label="ta.todasCategorias"
        size="xs"
        :color="categoria === 'todas' ? 'primary' : 'neutral'"
        :variant="categoria === 'todas' ? 'soft' : 'ghost'"
        @click="categoria = 'todas'"
      />
      <UButton
        v-for="c in categorias"
        :key="c"
        size="xs"
        :color="categoria === c ? corDaCategoria[c] : 'neutral'"
        :variant="categoria === c ? 'soft' : 'ghost'"
        @click="categoria = c"
      >
        {{ ta.categorias[c] }}
        <span class="font-mono text-[11px] text-muted">{{ contagem[c] ?? 0 }}</span>
      </UButton>
      <UBadge v-if="marcarNovo" :label="t.casca.novo" size="sm" variant="soft" class="ml-1" />
    </div>

    <div class="px-6 py-3">
      <EnTable
        :columns="colunas"
        :rows="linhas"
        :locale="idioma"
        :pagination="{ page: pagina, pageCount: Math.max(1, Math.ceil(filtrados.length / POR_PAGINA)), total: filtrados.length }"
        :empty-state="{ icon: 'i-lucide-search-x', title: ta.vazioTitulo, description: ta.vazio }"
        @page-change="pagina = $event"
        @row-click="abrir"
      >
        <template #cell-id="{ row }">
          <span class="font-mono text-xs text-muted">#{{ (row as any)._e.id }}</span>
        </template>
        <template #cell-codigo="{ row }">
          <span class="flex flex-col gap-0.5">
            <UBadge :label="ta.eventos[(row as any)._e.codigo as keyof typeof ta.eventos]" :color="corDaCategoria[categoriaDoEvento[(row as any)._e.codigo as Evento['codigo']]]" variant="soft" size="sm" class="w-fit" />
            <code class="text-[10px] text-muted">{{ (row as any)._e.codigo }}</code>
          </span>
        </template>
        <template #cell-alvo="{ row }">
          <span class="line-clamp-1 max-w-64 text-sm text-highlighted">{{ (row as any)._e.alvo }}</span>
        </template>
        <template #cell-ator="{ row }">
          <span class="flex items-center gap-2">
            <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-elevated">
              <UIcon :name="iconeDoAtor[(row as any)._e.ator.tipo as TipoDeAtor]" class="size-3.5 text-toned" />
            </span>
            <span class="min-w-0 leading-tight">
              <span class="block truncate text-sm text-highlighted">{{ (row as any)._e.ator.nome }}</span>
              <span v-if="(row as any)._e.ator.email !== (row as any)._e.ator.nome" class="block truncate text-xs text-muted">{{ (row as any)._e.ator.tipo === 'pessoa' ? (row as any)._e.ator.email : ta.atores[(row as any)._e.ator.tipo as TipoDeAtor] }}</span>
            </span>
          </span>
        </template>
        <template #cell-workspace="{ row }">
          <span class="text-sm text-toned">{{ (row as any)._e.workspace ? nomeDoWorkspace((row as any)._e.workspace) : ta.semWorkspace }}</span>
        </template>
        <template #cell-ip="{ row }">
          <span class="font-mono text-xs text-muted">{{ (row as any)._e.ip ?? '-' }}</span>
        </template>
        <template #cell-quando="{ row }">
          <UTooltip :text="dataHora((row as any)._e.quando, idioma)">
            <span class="whitespace-nowrap text-sm text-toned">{{ relativo((row as any)._e.quando, idioma) }}</span>
          </UTooltip>
        </template>
      </EnTable>
      <p class="mt-2 text-xs text-muted">
        {{ ta.mostrando(filtrados.length ? (pagina - 1) * POR_PAGINA + 1 : 0, Math.min(pagina * POR_PAGINA, filtrados.length), numero(filtrados.length, idioma)) }}
      </p>
    </div>

    <!-- A retenção e o SIEM andam juntos: o que sai do registro pode ficar no SIEM -->
    <div class="px-6">
      <UAlert
        icon="i-lucide-radio-tower"
        color="neutral"
        variant="subtle"
        :description="ta.retencaoAjuda"
        :actions="[{ label: ta.irSiem, color: 'primary', variant: 'outline', size: 'xs', trailingIcon: 'i-lucide-arrow-right', onClick: () => emit('navegar', 'siem') }]"
      />
    </div>

    <!-- Gaveta do evento -->
    <USlideover v-model:open="aberto" :title="escolhido ? ta.gaveta.fez(escolhido.ator.nome, ta.eventos[escolhido.codigo], escolhido.alvo) : ''">
      <template #body>
        <div v-if="escolhido" class="space-y-4 text-sm">
          <section class="rounded-lg border border-default p-3">
            <h4 class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><UIcon name="i-lucide-user-round" class="size-3.5" />{{ ta.gaveta.ator }}</h4>
            <dl class="grid grid-cols-[8rem_1fr] gap-y-1.5">
              <dt class="text-muted">{{ ta.gaveta.tipo }}</dt><dd class="text-highlighted">{{ ta.atores[escolhido.ator.tipo] }}</dd>
              <template v-if="escolhido.ator.email"><dt class="text-muted">{{ ta.gaveta.email }}</dt><dd class="break-all text-highlighted">{{ escolhido.ator.email }}</dd></template>
            </dl>
          </section>
          <section class="rounded-lg border border-default p-3">
            <h4 class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><UIcon name="i-lucide-globe" class="size-3.5" />{{ ta.gaveta.origem }}</h4>
            <dl class="grid grid-cols-[8rem_1fr] gap-y-1.5">
              <dt class="text-muted">{{ ta.gaveta.ip }}</dt><dd class="font-mono text-highlighted">{{ escolhido.ip ?? '-' }}</dd>
              <template v-if="escolhido.dispositivo"><dt class="text-muted">{{ ta.gaveta.dispositivo }}</dt><dd class="text-highlighted">{{ escolhido.dispositivo }}</dd></template>
              <dt class="text-muted">{{ ta.gaveta.viaToken }}</dt><dd class="text-highlighted">{{ escolhido.viaToken ? ta.gaveta.sim : ta.gaveta.nao }}</dd>
              <dt class="text-muted">{{ ta.col.workspace }}</dt><dd class="text-highlighted">{{ escolhido.workspace ? nomeDoWorkspace(escolhido.workspace) : ta.semWorkspace }}</dd>
            </dl>
          </section>
          <section class="rounded-lg border border-default p-3">
            <h4 class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><UIcon name="i-lucide-tag" class="size-3.5" />{{ ta.gaveta.evento }}</h4>
            <dl class="grid grid-cols-[8rem_1fr] gap-y-1.5">
              <dt class="text-muted">{{ ta.gaveta.codigo }}</dt><dd><code class="text-xs text-highlighted">{{ escolhido.codigo }}</code></dd>
              <dt class="text-muted">{{ ta.gaveta.categoria }}</dt><dd><UBadge :label="ta.categorias[categoriaDoEvento[escolhido.codigo]]" :color="corDaCategoria[categoriaDoEvento[escolhido.codigo]]" variant="soft" size="sm" /></dd>
              <dt class="text-muted">{{ ta.col.alvo }}</dt><dd class="text-highlighted">{{ escolhido.alvo }}</dd>
              <template v-if="escolhido.motivo"><dt class="text-muted">{{ ta.gaveta.motivo }}</dt><dd class="text-error">{{ ta.gaveta.motivos[escolhido.motivo] }}</dd></template>
            </dl>
          </section>
          <section class="rounded-lg border border-default p-3">
            <h4 class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted"><UIcon name="i-lucide-calendar" class="size-3.5" />{{ ta.gaveta.datas }}</h4>
            <dl class="grid grid-cols-[8rem_1fr] gap-y-1.5">
              <dt class="text-muted">{{ ta.gaveta.quando }}</dt><dd class="text-highlighted">{{ dataHora(escolhido.quando, idioma) }}</dd>
              <dt class="text-muted">{{ ta.gaveta.expira }}</dt><dd class="text-highlighted">{{ data(new Date(escolhido.quando.getTime() + retencao * DIA), idioma) }}</dd>
            </dl>
          </section>
        </div>
      </template>
    </USlideover>

    <!-- Retenção -->
    <UModal v-model:open="modalRetencao" :title="ta.retencaoTitulo">
      <template #body>
        <div class="space-y-3">
          <URadioGroup v-model="retencaoNova" :items="opcoesRetencao" />
          <p class="text-xs text-muted">{{ ta.retencaoNota }}</p>
        </div>
      </template>
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="modalRetencao = false" />
          <UButton :label="t.comum.salvar" :disabled="retencaoNova === retencao" @click="salvarRetencao" />
        </div>
      </template>
    </UModal>
  </div>
</template>
