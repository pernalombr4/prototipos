<script setup lang="ts">
/**
 * PROPOSTA: a página do projeto (/workspaces/{ws}/projects/{referência}).
 *
 * Cabeçalho: ícone, nome, descrição, selo de visibilidade, status, o acesso de quem lê e as ações.
 *
 * Rodada 3: a página vira o lugar de trabalho do projeto, com 4 abas (o que o projeto guarda além
 * das categorias, pela pesquisa de 2026-11-26 e pela conferência no código):
 *   - Visão geral: o status do projeto e os painéis da rodada 1 (categorias, participantes,
 *     tarefas, atividade), 1 visualização por painel (memória "painel de dashboard enxuto");
 *   - Itens: os itens de todas as categorias numa visão só (peça nova no back-end);
 *   - Automações: os fluxos e os avisos de prazo que as categorias já têm;
 *   - Painel: widgets de 1 categoria cada, como os painéis de hoje.
 *
 * Rodada 5: 5 abas (Visão geral, Tarefas, Itens, Automações, Painéis), as mesmas que o menu abre.
 * Rodada 12: a ordem das abas é Visão geral, Itens, Tarefas, e depois o resto; a Visão geral mostra as metas.
 * A visão geral abre com os números do projeto (EnDashboardGrid do SDK), cada um levando à aba, e
 * a fila de prazos sai das tarefas dos itens das categorias do projeto.
 */
import type { TabsItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { EnDashboardStatItem } from '@be-enlighten/enspace-sdk-ui/base'
import { cargos, grupos, iniciais, pessoa, type Participante } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import TarefasDoProjeto from './_TarefasDoProjeto.vue'
import { COR_DA_SITUACAO, COR_DO_PROJETO, ICONE_DA_SITUACAO, ICONE_DA_VISIBILIDADE, useMarcaDeProposta, useProjetos } from './estado'
import StatusDoProjeto from './_StatusDoProjeto.vue'
import ItensDoProjeto from './_ItensDoProjeto.vue'
import AutomacoesDoProjeto from './_AutomacoesDoProjeto.vue'
import PainelDoProjeto from './_PainelDoProjeto.vue'
import DiscussoesDoProjeto from './_DiscussoesDoProjeto.vue'
import MarcosDoProjeto from './_MarcosDoProjeto.vue'
import MetasDoProjeto from './_MetasDoProjeto.vue'
import AbaMarcos from './_AbaMarcos.vue'
import TarefaAberta from './_TarefaAberta.vue'
import { textosDaTarefa } from './textosDaTarefa'
import { textosDeMarcosEMedicao } from './textosDeMarcosEMedicao'
import { useMetasEDiscussoes } from './metasEDiscussoes'
import { textosDeMetasEDiscussoes } from './textosDeMetasEDiscussoes'
import { useMenuDoProjeto } from './menuDoProjeto'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const p = computed(() => prj.projetos.value.find(x => x.id === props.id)!)
const papel = computed(() => prj.papel(p.value))
const admin = computed(() => prj.podeAdministrar(p.value))
const categorias = computed(() => prj.categoriasDe(props.id))
const r = useTextos(textosDoProjeto)
const md = useMetasEDiscussoes()
const tmd = useTextos(textosDeMetasEDiscussoes)
const tmm = useTextos(textosDeMarcosEMedicao)
const tt = useTextos(textosDaTarefa)
const marcosAbertos = computed(() => md.marcosDo(props.id).filter(m => m.status === 'aberto').length)
const discussoesAbertas = computed(() => md.discussoesDo(props.id).filter(d => d.status === 'aberta').length)
const HOJE = '2026-11-26'
const abertas = computed(() => prj.tarefasDoProjeto(props.id).filter(x => x.status !== 'concluida'))
const tarefas = computed(() => [...abertas.value].sort((a, b) => a.prazo.localeCompare(b.prazo)).slice(0, 5))
const total = computed(() => prj.quantosVeem(p.value))

const rotuloDoPapel = computed(() => papel.value ? props.t.papel[papel.value] : '')
const dicaDoPapel = computed(() => {
  const r = papel.value
  if (r === 'dono') return props.t.papel.donoDica
  if (r === 'admin') return props.t.papel.adminDica
  if (r === 'participante') return props.t.papel.participanteDica
  if (r === 'membro') return props.t.papel.membroDica
  return ''
})

function nomeDe(x: Participante) {
  if (x.tipo === 'pessoa') return pessoa(x.id as number)?.nome ?? ''
  if (x.tipo === 'grupo') return grupos.find(g => g.id === x.id)?.name ?? ''
  return cargos.find(c => c.id === x.id)?.name ?? ''
}
const iconeDoTipo = { pessoa: 'i-lucide-user-round', grupo: 'i-lucide-users-round', cargo: 'i-lucide-shield-check' } as const

/** Rodada 13: Adicionar ao menu e Ocultar do menu. Quem administra escolhe Salvar para mim ou Salvar para todos. */
const menuDoProjeto = useMenuDoProjeto()
const tmenu = menuDoProjeto.tm
const noMeuMenu = computed(() => prj.estaNoMenu(p.value.id))
function configurar(aba = 'geral') {
  prj.janelas.configurar.value = { id: p.value.id, aba }
}
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value)

/* ---------- rodada 3 ---------- */
const status = computed(() => prj.statusAtual(p.value))
const aba = prj.abaDoProjeto
const nFluxos = computed(() => prj.fluxosDoProjeto(props.id).length)
const nAtivos = computed(() => prj.fluxosDoProjeto(props.id).filter(f => f.ativo).length)
const numeros = computed<EnDashboardStatItem[]>(() => [
  { key: 'tarefas', label: r.value.geral.tarefasAbertas, value: abertas.value.length, icon: 'i-lucide-square-check' },
  { key: 'vencidas', label: r.value.geral.vencidas, value: abertas.value.filter(x => x.prazo < HOJE).length, icon: 'i-lucide-alarm-clock-off' },
  { key: 'itens', label: r.value.geral.itens, value: categorias.value.reduce((s, c) => s + c.itens, 0).toLocaleString(idioma.value), icon: 'i-lucide-list-checks' },
  { key: 'automacoes', label: r.value.geral.workflowsAtivos, value: `${nAtivos.value} / ${nFluxos.value}`, icon: 'i-lucide-workflow' },
])
const DESTINO: Record<string, 'tarefas' | 'itens' | 'automacoes' | null> = { tarefas: 'tarefas', vencidas: 'tarefas', itens: 'itens', automacoes: 'automacoes', pessoas: null }
function abrirNumero(s: EnDashboardStatItem) {
  const d = DESTINO[s.key]
  if (d) aba.value = d
  else configurar('participantes')
}
const raiz = useTemplateRef<HTMLElement>('raiz')
watch(aba, () => nextTick(() => raiz.value?.scrollIntoView({ block: 'start' })))
const abas = computed<TabsItem[]>(() => [
  { value: 'geral', label: props.t.abas.geral, icon: 'i-lucide-layout-dashboard' },
  { value: 'itens', label: props.t.abas.itens, icon: 'i-lucide-list-checks' },
  { value: 'tarefas', label: r.value.menu.tarefas, icon: 'i-lucide-square-check', badge: abertas.value.length ? { label: String(abertas.value.length), color: 'neutral', variant: 'soft', size: 'sm' } : undefined },
  { value: 'marcos', label: tmm.value.marcos.aba, icon: 'i-lucide-flag', badge: marcosAbertos.value ? { label: String(marcosAbertos.value), color: 'neutral', variant: 'soft', size: 'sm' } : undefined },
  { value: 'discussoes', label: tmd.value.discussoes.aba, icon: 'i-lucide-messages-square', badge: discussoesAbertas.value ? { label: String(discussoesAbertas.value), color: 'neutral', variant: 'soft', size: 'sm' } : undefined },
  { value: 'automacoes', label: props.t.abas.automacoes, icon: 'i-lucide-workflow', badge: nFluxos.value ? { label: String(nFluxos.value), color: 'neutral', variant: 'soft', size: 'sm' } : undefined },
  { value: 'painel', label: r.value.menu.paineis, icon: 'i-lucide-chart-column', badge: prj.dashboardsDe(props.id).length ? { label: String(prj.dashboardsDe(props.id).length), color: 'neutral', variant: 'soft', size: 'sm' } : undefined },
])
</script>

<template>
  <div ref="raiz" class="mx-auto w-full max-w-screen-2xl px-8 py-5" :class="marca">
    <!-- arquivado -->
    <UAlert
      v-if="p.status === 'arquivado'"
      :title="t.pagina.arquivadoTitulo"
      :description="t.pagina.arquivadoTexto"
      icon="i-lucide-archive"
      color="warning"
      variant="subtle"
      class="mb-4"
      :actions="prj.souDono.value ? [{ label: t.diretorio.restaurar, icon: 'i-lucide-archive-restore', color: 'neutral', variant: 'outline', onClick: () => prj.restaurar(p.id) }] : []"
    />

    <!-- cabeçalho -->
    <div class="flex flex-wrap items-start gap-4 animate-[entrada_0.2s_ease-out_both]">
      <span class="flex size-12 shrink-0 items-center justify-center rounded-xl" :class="COR_DO_PROJETO[p.cor]">
        <UIcon :name="p.icone" class="size-6" />
      </span>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="truncate text-xl font-semibold text-highlighted">{{ p.nome }}</h1>
          <UTooltip :text="t.visibilidade[`${p.visibilidade}Dica`]">
            <UBadge :label="t.visibilidade[p.visibilidade]" :icon="ICONE_DA_VISIBILIDADE[p.visibilidade]" color="neutral" variant="subtle" size="sm" />
          </UTooltip>
          <UTooltip v-if="status" :text="t.situacao[`${status.situacao}Dica`]">
            <UBadge :label="t.situacao[status.situacao]" :icon="ICONE_DA_SITUACAO[status.situacao]" :color="COR_DA_SITUACAO[status.situacao]" variant="subtle" size="sm" :class="marca" />
          </UTooltip>
        </div>
        <p class="mt-0.5 text-sm" :class="p.descricao ? 'text-muted' : 'text-muted italic'">{{ p.descricao || t.pagina.semDescricao }}</p>
        <p class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <UTooltip :text="dicaDoPapel">
            <span class="flex items-center gap-1"><UIcon name="i-lucide-badge-check" class="size-3.5" />{{ t.pagina.seuAcesso }}: <span class="font-medium text-toned">{{ rotuloDoPapel }}</span></span>
          </UTooltip>
          <span>{{ t.pagina.criadoEm(formatarData(p.criadoEm)) }}</span>
          <span v-if="status" class="flex items-center gap-1" :class="marca"><UIcon name="i-lucide-calendar-range" class="size-3.5" />{{ t.status.fimPrevisto(formatarData(status.fim)) }}</span>
        </p>
      </div>
      <div class="flex shrink-0 items-center gap-2">
        <template v-if="p.status === 'ativo'">
          <UDropdownMenu v-if="prj.souDono.value" :items="[menuDoProjeto.escolhas(p, !noMeuMenu)]" :content="{ align: 'end' }">
            <UButton :label="noMeuMenu ? tmenu.ocultar : tmenu.adicionar" :icon="noMeuMenu ? 'i-lucide-eye-off' : 'i-lucide-panel-left'" trailing-icon="i-lucide-chevron-down" color="neutral" :variant="noMeuMenu ? 'ghost' : 'outline'" size="sm" />
          </UDropdownMenu>
          <UButton v-else :label="noMeuMenu ? tmenu.ocultar : tmenu.adicionar" :icon="noMeuMenu ? 'i-lucide-eye-off' : 'i-lucide-panel-left'" color="neutral" :variant="noMeuMenu ? 'ghost' : 'outline'" size="sm" @click="menuDoProjeto.salvarParaMim(p, !noMeuMenu)" />
        </template>
        <UButton v-if="admin" :label="t.pagina.configurar" icon="i-lucide-settings" color="neutral" variant="outline" size="sm" @click="configurar()" />
      </div>
    </div>

    <!-- rodada 3: as seções do projeto -->
    <UTabs
      v-model="aba"
      :items="abas"
      variant="link"
      :content="false"
      class="mt-5 w-full"
      :class="marca"
      :aria-label="t.abas.rotulo"
    />

    <TarefasDoProjeto v-if="aba === 'tarefas'" :key="`t-${p.id}`" :t="t" :id="p.id" class="mt-4" />
    <ItensDoProjeto v-else-if="aba === 'itens'" :key="`i-${p.id}`" :t="t" :id="p.id" class="mt-4" />
    <AutomacoesDoProjeto v-else-if="aba === 'automacoes'" :key="`a-${p.id}`" :t="t" :id="p.id" class="mt-4" />
    <PainelDoProjeto v-else-if="aba === 'painel'" :key="`d-${p.id}`" :t="t" :id="p.id" class="mt-4" />
    <DiscussoesDoProjeto v-else-if="aba === 'discussoes'" :key="`x-${p.id}`" :t="t" :id="p.id" class="mt-4" />
    <AbaMarcos v-else-if="aba === 'marcos'" :key="`m-${p.id}`" :t="t" :id="p.id" class="mt-4" />

    <div v-else class="mt-4 grid gap-4 lg:grid-cols-3">
      <!-- rodada 5: o que o projeto reúne, em números que levam às abas -->
      <section class="lg:col-span-3 animate-[entrada_0.2s_ease-out_both]">
        <p class="mb-2 text-sm text-muted">{{ r.geral.reuneTexto(p.nome) }}</p>
        <EnDashboardGrid :stats="numeros" :columns="4" clickable @stat-click="abrirNumero" />
      </section>
      <StatusDoProjeto :t="t" :id="p.id" class="lg:col-span-3" />
      <MarcosDoProjeto :t="t" :id="p.id" class="lg:col-span-3" />
      <MetasDoProjeto :t="t" :id="p.id" class="lg:col-span-3" />
      <!-- categorias -->
      <section class="rounded-lg border border-default bg-default lg:col-span-2 animate-[entrada_0.25s_ease-out_both]" style="animation-delay: 40ms">
        <header class="flex items-center gap-2 border-b border-default px-4 py-3">
          <h2 class="flex-1 text-sm font-semibold text-highlighted">{{ t.pagina.categorias }}</h2>
          <UTooltip :text="t.pagina.categoriasDica">
            <UIcon name="i-lucide-info" class="size-4 text-muted" :aria-label="t.pagina.categoriasDica" />
          </UTooltip>
          <UButton v-if="admin && categorias.length" :label="t.painel.adicionarCategoria" icon="i-lucide-plus" size="xs" color="neutral" variant="outline" @click="configurar('categorias')" />
        </header>
        <div v-if="categorias.length" class="grid gap-2 p-3 sm:grid-cols-2 2xl:grid-cols-3">
          <button
            v-for="c in categorias"
            :key="c.id"
            type="button"
            class="group flex items-center gap-3 rounded-md border border-default px-3 py-2.5 text-left transition-[background-color,transform] duration-150 hover:-translate-y-0.5 hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
            @click="prj.abrirCategoria(c.id)"
          >
            <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-elevated text-toned group-hover:bg-accented">
              <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-highlighted">{{ c.name }}</span>
              <span class="block truncate text-xs text-muted">{{ t.pagina.itens(c.itens) }}</span>
            </span>
            <UIcon name="i-lucide-chevron-right" class="size-4 text-dimmed" />
          </button>
        </div>
        <div v-else class="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <UIcon name="i-lucide-database" class="size-7 text-muted" />
          <p class="text-sm font-semibold text-highlighted">{{ t.pagina.vazioCategoriasTitulo }}</p>
          <p class="max-w-sm text-sm text-muted">{{ t.pagina.vazioCategoriasTexto }}</p>
          <div v-if="admin" class="mt-1 flex flex-wrap justify-center gap-2">
            <UButton :label="t.config.adicionarCategoria" icon="i-lucide-folder-input" size="sm" color="neutral" variant="outline" @click="configurar('categorias')" />
            <UButton :label="t.pagina.criarCategoria" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" @click="prj.janelas.novaCategoria.value = p.id" />
          </div>
        </div>
      </section>

      <!-- participantes -->
      <section class="rounded-lg border border-default bg-default animate-[entrada_0.25s_ease-out_both]" style="animation-delay: 80ms">
        <header class="flex items-center gap-2 border-b border-default px-4 py-3">
          <h2 class="flex-1 text-sm font-semibold text-highlighted">{{ t.pagina.participantes }}</h2>
          <span class="text-xs text-muted">{{ t.pagina.quemTemAcesso(total) }}</span>
        </header>
        <ul class="divide-y divide-default">
          <li v-for="x in p.participantes" :key="`${x.tipo}-${x.id}`" class="flex items-center gap-2.5 px-4 py-2">
            <UAvatar v-if="x.tipo === 'pessoa'" size="xs" :text="iniciais(nomeDe(x))" :alt="nomeDe(x)" />
            <span v-else class="flex size-6 items-center justify-center rounded-full bg-elevated"><UIcon :name="iconeDoTipo[x.tipo]" class="size-3.5 text-muted" /></span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm text-highlighted">{{ nomeDe(x) }}</span>
              <span class="block truncate text-xs text-muted">{{ t.tipoDeParticipante[x.tipo] }}<template v-if="x.tipo !== 'pessoa'"> · {{ t.diretorio.pessoas(prj.alcance(x)) }}</template></span>
            </span>
            <UBadge v-if="x.papel === 'admin'" :label="t.papel.admin" size="sm" color="primary" variant="soft" />
          </li>
        </ul>
        <div v-if="admin" class="border-t border-default p-2">
          <UButton :label="t.pagina.gerenciar" icon="i-lucide-user-plus" size="xs" color="neutral" variant="outline" block @click="configurar('participantes')" />
        </div>
      </section>

      <!-- tarefas do projeto -->
      <section class="rounded-lg border border-default bg-default lg:col-span-2 animate-[entrada_0.25s_ease-out_both]" style="animation-delay: 120ms">
        <header class="flex items-center gap-2 border-b border-default px-4 py-3">
          <h2 class="flex-1 text-sm font-semibold text-highlighted">{{ r.geral.filaTitulo }}</h2>
          <UButton :label="r.geral.verTodas" trailing-icon="i-lucide-arrow-right" size="xs" color="neutral" variant="outline" @click="aba = 'tarefas'" />
        </header>
        <ul v-if="tarefas.length" class="divide-y divide-default">
          <li v-for="x in tarefas" :key="x.id">
            <button type="button" class="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-elevated/60 focus-visible:outline-2 focus-visible:outline-primary" @click="prj.tarefaAberta.value = x.id">
            <UIcon name="i-lucide-circle" class="size-4 shrink-0 text-muted" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm text-highlighted">{{ x.titulo }}</span>
              <span class="block truncate text-xs text-muted">{{ x.item ? `${prj.categorias.value.find(c => c.id === x.categoria)?.name} · ${x.item}` : tt.semItem }}</span>
            </span>
            <UBadge v-if="x.prazo < HOJE" :label="t.tarefas.atrasada" color="error" variant="subtle" size="sm" />
            <span class="shrink-0 text-xs text-muted">{{ formatarData(x.prazo) }}</span>
            </button>
          </li>
        </ul>
        <p v-else class="px-4 py-8 text-center text-sm text-muted">{{ t.pagina.semTarefas }}</p>
      </section>

      <!-- atividade -->
      <section class="rounded-lg border border-default bg-default animate-[entrada_0.25s_ease-out_both]" style="animation-delay: 160ms">
        <header class="border-b border-default px-4 py-3">
          <h2 class="text-sm font-semibold text-highlighted">{{ t.pagina.atividade }}</h2>
        </header>
        <ul v-if="p.atividade.length" class="space-y-3 px-4 py-3">
          <li v-for="(a, i) in p.atividade" :key="i" class="flex gap-2.5">
            <UAvatar size="2xs" :text="iniciais(pessoa(a.quem)?.nome ?? '')" :alt="pessoa(a.quem)?.nome" />
            <p class="min-w-0 text-sm text-default">
              <span class="font-medium text-highlighted">{{ pessoa(a.quem)?.nome }}</span> {{ a.oque }}
              <span class="block text-xs text-muted">{{ a.quando }}</span>
            </p>
          </li>
        </ul>
        <p v-else class="px-4 py-8 text-center text-sm text-muted">{{ t.pagina.semAtividade }}</p>
      </section>
    </div>
    <!-- rodada 10: a tarefa aberta, de qualquer lista do projeto -->
    <TarefaAberta :id="id" />
  </div>
</template>
