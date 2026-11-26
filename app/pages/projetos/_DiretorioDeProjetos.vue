<script setup lang="ts">
/**
 * PROPOSTA: o diretório de projetos (/workspaces/{ws}/projects), no lugar da página órfã de hoje.
 *
 * A mesma listagem das categorias (memória "tela nova usa a listagem da categoria"): a barra de
 * busca, as visualizações em botão e o EnTable. Visualizações: Todos, De que participo, Arquivados.
 * A ação da linha depende do acesso: Mostrar no meu menu, Pedir acesso ou Restaurar.
 * "Criar projeto" fica no topo, à direita (regra 16: ação do topo continua no topo).
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { iniciais, pessoa, type Projeto } from './mocks'
import { COR_DA_SITUACAO, COR_DO_PROJETO, ICONE_DA_SITUACAO, ICONE_DA_VISIBILIDADE, useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

type Vista = 'todos' | 'meus' | 'arquivados'
const vista = ref<Vista>('todos')
const busca = ref('')
const pagina = ref(1)
const POR_PAGINA = 15

watch([vista, busca], () => { pagina.value = 1 })

const base = computed(() => {
  if (vista.value === 'arquivados') {
    return prj.projetos.value.filter(p => p.status === 'arquivado' && prj.podeAdministrar(p))
  }
  const ativos = prj.visiveis.value
  return vista.value === 'meus' ? ativos.filter(p => prj.participa(p) || prj.papel(p) === 'dono') : ativos
})
const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return q ? base.value.filter(p => p.nome.toLowerCase().includes(q)) : base.value
})

interface Linha { id: number, projeto: Projeto, nome: string, visibilidade: string, admins: string, participantes: number, categorias: number, criado: string, acao: string }

function pessoasDe(p: Projeto) {
  return prj.quantosVeem(p, true)
}

const linhas = computed<Linha[]>(() => filtrados.value
  .slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA)
  .map(p => ({
    id: p.id,
    projeto: p,
    nome: p.nome,
    visibilidade: p.visibilidade,
    admins: '',
    participantes: pessoasDe(p),
    categorias: prj.categoriasDe(p.id).length,
    criado: p.criadoEm,
    acao: '',
  })))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'nome', label: props.t.diretorio.colunaNome },
  { key: 'visibilidade', label: props.t.diretorio.colunaVisibilidade },
  { key: 'situacao', label: props.t.situacao.coluna },
  { key: 'admins', label: props.t.diretorio.colunaAdmins },
  { key: 'participantes', label: props.t.diretorio.colunaParticipantes },
  { key: 'categorias', label: props.t.diretorio.colunaCategorias },
  { key: 'criado', label: props.t.diretorio.colunaCriado },
  { key: 'acao', label: props.t.diretorio.colunaAcao },
])

const vistas = computed(() => [
  { v: 'todos' as const, r: props.t.diretorio.filtroTodos, i: 'i-lucide-folder-kanban' },
  { v: 'meus' as const, r: props.t.diretorio.filtroMeus, i: 'i-lucide-user-round-check' },
  ...(prj.projetos.value.some(p => p.status === 'arquivado' && prj.podeAdministrar(p)) || prj.souDono.value
    ? [{ v: 'arquivados' as const, r: props.t.diretorio.filtroArquivados, i: 'i-lucide-archive' }]
    : []),
])

function adminsDe(p: Projeto) {
  return p.participantes.filter(x => x.tipo === 'pessoa' && x.papel === 'admin').map(x => pessoa(x.id as number)!).filter(Boolean)
}

function mostrar(p: Projeto) {
  prj.mostrarNoMenu(p.id)
  toast.add({ title: props.t.diretorio.mostrado(p.nome), icon: 'i-lucide-check', color: 'success' })
}
function pedir(p: Projeto) {
  prj.pedirAcesso(p.id)
  toast.add({ title: props.t.diretorio.pedidoEnviado(p.nome), icon: 'i-lucide-send', color: 'success' })
}
function restaurar(p: Projeto) {
  prj.restaurar(p.id)
  toast.add({ title: props.t.diretorio.restaurado(p.nome), icon: 'i-lucide-archive-restore', color: 'success' })
}

const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value)
</script>

<template>
  <div class="flex flex-col" :class="marca">
    <!-- cabeçalho da tela, como o das categorias -->
    <div class="flex flex-wrap items-start gap-3 px-6 pb-3 pt-5">
      <div class="min-w-0 flex-1">
        <h1 class="text-xl font-semibold text-highlighted">{{ t.diretorio.titulo }}</h1>
        <p class="mt-0.5 text-sm text-muted">{{ t.diretorio.subtitulo }}</p>
      </div>
      <UButton v-if="prj.souDono.value" :label="t.criar.titulo" icon="i-lucide-plus" color="primary" size="sm" @click="prj.janelas.criar.value = true" />
    </div>

    <!-- visualizações em botão -->
    <div class="flex items-center gap-1 border-b border-default px-4 py-2">
      <UButton
        v-for="o in vistas"
        :key="o.v"
        :icon="o.i"
        :label="o.r"
        size="sm"
        :color="vista === o.v ? 'primary' : 'neutral'"
        :variant="vista === o.v ? 'soft' : 'ghost'"
        :aria-pressed="vista === o.v"
        @click="vista = o.v"
      />
    </div>

    <!-- barra da lista -->
    <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2.5">
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.diretorio.buscar" :aria-label="t.diretorio.buscar" variant="none" size="sm" class="w-64" />
      <span class="ml-auto text-xs text-muted">{{ t.diretorio.contagem(filtrados.length) }}</span>
    </div>

    <!-- workspace sem projetos -->
    <div v-if="!prj.projetos.value.length" class="flex flex-col items-center gap-3 px-6 py-16 text-center animate-[entrada_0.2s_ease-out_both]">
      <span class="flex size-12 items-center justify-center rounded-xl bg-elevated"><UIcon name="i-lucide-folder-kanban" class="size-6 text-muted" /></span>
      <p class="text-base font-semibold text-highlighted">{{ t.diretorio.vazioTitulo }}</p>
      <p class="max-w-md text-sm text-muted">{{ t.diretorio.vazioTexto }}</p>
      <UButton v-if="prj.souDono.value" :label="t.criar.titulo" icon="i-lucide-plus" color="neutral" variant="outline" @click="prj.janelas.criar.value = true" />
    </div>

    <div v-else class="animate-[entrada_.25s_ease-out]">
      <EnTable
        :columns="colunas"
        :rows="linhas"
        :pagination="{ page: pagina, pageCount: Math.max(1, Math.ceil(filtrados.length / POR_PAGINA)), total: filtrados.length }"
        :empty-state="{ icon: 'i-lucide-search-x', title: t.diretorio.vazioBusca, description: '' }"
        :locale="idioma"
        @page-change="pagina = $event"
        @row-click="(r) => prj.abrirProjeto((r as Linha).id)"
      >
        <template #cell-nome="{ row }">
          <span class="flex min-w-0 items-center gap-2">
            <span class="flex size-7 shrink-0 items-center justify-center rounded-md" :class="COR_DO_PROJETO[(row as Linha).projeto.cor]">
              <UIcon :name="(row as Linha).projeto.icone" class="size-4" />
            </span>
            <span class="min-w-0">
              <span class="block max-w-72 truncate text-sm font-medium text-highlighted">{{ (row as Linha).nome }}</span>
              <span v-if="(row as Linha).projeto.descricao" class="block max-w-72 truncate text-xs text-muted">{{ (row as Linha).projeto.descricao }}</span>
            </span>
          </span>
        </template>
        <template #cell-situacao="{ row }">
          <UBadge
            v-if="prj.statusAtual((row as Linha).projeto)"
            :label="t.situacao[prj.statusAtual((row as Linha).projeto)!.situacao]"
            :icon="ICONE_DA_SITUACAO[prj.statusAtual((row as Linha).projeto)!.situacao]"
            :color="COR_DA_SITUACAO[prj.statusAtual((row as Linha).projeto)!.situacao]"
            variant="subtle"
            size="sm"
            :class="marca"
          />
          <span v-else class="text-sm text-dimmed">{{ t.situacao.semStatus }}</span>
        </template>
        <template #cell-visibilidade="{ row }">
          <UBadge
            :label="t.visibilidade[(row as Linha).projeto.visibilidade]"
            :icon="ICONE_DA_VISIBILIDADE[(row as Linha).projeto.visibilidade]"
            color="neutral"
            variant="subtle"
            size="sm"
          />
        </template>
        <template #cell-admins="{ row }">
          <UAvatarGroup size="2xs" :max="3">
            <UTooltip v-for="a in adminsDe((row as Linha).projeto)" :key="a.id" :text="a.nome">
              <UAvatar :text="iniciais(a.nome)" :alt="a.nome" />
            </UTooltip>
          </UAvatarGroup>
        </template>
        <template #cell-participantes="{ row }">
          <span class="text-sm text-default">{{ t.diretorio.pessoas((row as Linha).participantes) }}</span>
        </template>
        <template #cell-categorias="{ row }">
          <span class="text-sm text-default">{{ (row as Linha).categorias }}</span>
        </template>
        <template #cell-criado="{ row }">
          <span class="text-sm text-muted">{{ formatarData((row as Linha).criado) }}</span>
        </template>
        <template #cell-acao="{ row }">
          <span class="flex justify-end" @click.stop>
            <template v-if="(row as Linha).projeto.status === 'arquivado'">
              <UButton :label="t.diretorio.restaurar" icon="i-lucide-archive-restore" size="xs" color="neutral" variant="outline" @click="restaurar((row as Linha).projeto)" />
            </template>
            <template v-else-if="!prj.entra((row as Linha).projeto)">
              <UBadge v-if="prj.pedidos.value.includes((row as Linha).id)" :label="t.diretorio.pedido" icon="i-lucide-clock" color="neutral" variant="soft" size="sm" />
              <UButton v-else :label="t.diretorio.pedir" icon="i-lucide-key-round" size="xs" color="neutral" variant="outline" @click="pedir((row as Linha).projeto)" />
            </template>
            <template v-else>
              <UBadge v-if="prj.estaNoMenu((row as Linha).id)" :label="t.diretorio.noMenu" icon="i-lucide-check" color="success" variant="soft" size="sm" />
              <UButton v-else :label="t.diretorio.mostrar" icon="i-lucide-panel-left" size="xs" color="neutral" variant="outline" @click="mostrar((row as Linha).projeto)" />
            </template>
          </span>
        </template>
      </EnTable>
    </div>
  </div>
</template>
