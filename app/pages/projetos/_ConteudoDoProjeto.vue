<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): o que o projeto aberto mostra no menu lateral, igual nos 2 menus.
 *
 *  - 3 linhas fixas, que abrem as abas da página do projeto: Visão geral, Tarefas (com o número das
 *    abertas) e Automações (com o número de workflows). Os itens de todas as categorias moram na aba
 *    Itens da página, para o menu não repetir a lista de categorias;
 *  - a seção Categorias: "+" no hover (nova ou do workspace), "•••" em cada uma (mover, tirar do
 *    projeto, configurações) e arrastar para ordenar;
 *  - a seção Painéis: os dashboards do projeto, que abrem na aba Painéis. "+" cria e já abre em
 *    edição; "•••" abre, edita, renomeia, duplica e exclui (com Desfazer); clique duplo renomeia.
 *
 * Referência: o espaço do ClickUp (evidencias/ref-clickup-barra-lateral-espaco.png), com o "+" e o
 * "•••" que aparecem no hover. Hoje o menu do ENSPACE não tem nenhum dos 2 (LayoutSidebar).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Projeto } from './mocks'
import type { Textos } from './textos'
import { textosDoProjeto } from './textosDoProjeto'
import { useMetasEDiscussoes } from './metasEDiscussoes'
import { textosDeMetasEDiscussoes } from './textosDeMetasEDiscussoes'
import { textosDeMarcosEMedicao } from './textosDeMarcosEMedicao'
import { type AbaDoProjeto, useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos, p: Projeto, variante: 'painel' | 'atual' }>()
const prj = useProjetos()
const r = useTextos(textosDoProjeto)
const md = useMetasEDiscussoes()
const tmd = useTextos(textosDeMetasEDiscussoes)
const tmm = useTextos(textosDeMarcosEMedicao)
const toast = useToast()
const { marca } = useMarcaDeProposta()

const admin = computed(() => prj.podeAdministrar(props.p))
const categorias = computed(() => prj.categoriasDe(props.p.id))
const paineis = computed(() => prj.dashboardsDe(props.p.id))
const abertas = computed(() => prj.tarefasDoProjeto(props.p.id).filter(x => x.status !== 'concluida').length)
const nFluxos = computed(() => prj.fluxosDoProjeto(props.p.id).length)

const fixas = computed(() => [
  { aba: 'geral' as AbaDoProjeto, rotulo: props.t.abas.geral, icone: 'i-lucide-layout-dashboard', n: 0 },
  { aba: 'tarefas' as AbaDoProjeto, rotulo: r.value.menu.tarefas, icone: 'i-lucide-square-check', n: abertas.value },
  { aba: 'marcos' as AbaDoProjeto, rotulo: tmm.value.marcos.aba, icone: 'i-lucide-flag', n: md.marcosDo(props.p.id).filter(m => m.status === 'aberto').length },
  { aba: 'discussoes' as AbaDoProjeto, rotulo: tmd.value.discussoes.aba, icone: 'i-lucide-messages-square', n: md.discussoesDo(props.p.id).filter(d => d.status === 'aberta').length },
  { aba: 'automacoes' as AbaDoProjeto, rotulo: r.value.menu.automacoes, icone: 'i-lucide-workflow', n: nFluxos.value },
])

const naPagina = computed(() => prj.tela.value.tipo === 'projeto' && prj.tela.value.id === props.p.id)
const abaAtiva = (aba: AbaDoProjeto) => naPagina.value && prj.abaDoProjeto.value === aba
const painelAtivo = (id: number) => abaAtiva('painel') && prj.dashboardAberto.value === id
const categoriaAtiva = (id: number) => prj.tela.value.tipo === 'categoria' && prj.tela.value.id === id

/* ---------- as classes de cada menu ---------- */
const v = computed(() => props.variante === 'painel'
  ? {
      lista: 'ml-5 mt-0.5 space-y-px border-l border-default pl-2',
      linha: 'rounded-md px-2 py-1.5',
      fundo: 'hover:bg-elevated',
      ativo: 'bg-primary/10 font-medium text-highlighted',
      secao: 'mt-2 px-2',
    }
  : {
      lista: '',
      linha: 'py-2 pl-[4.25rem] pr-2',
      fundo: 'text-toned hover:bg-elevated',
      ativo: 'bg-primary/10 font-medium text-primary',
      secao: 'mt-1 pl-[4.25rem] pr-2',
    })

/* ---------- categorias ---------- */
const maisCategoria = computed<DropdownMenuItem[]>(() => [
  { label: r.value.menu.novaCategoria, description: r.value.menu.novaCategoriaDica, icon: 'i-lucide-folder-plus', onSelect: () => { prj.janelas.novaCategoria.value = props.p.id } },
  { label: r.value.menu.categoriaExistente, description: r.value.menu.categoriaExistenteDica, icon: 'i-lucide-folder-input', onSelect: () => { prj.janelas.configurar.value = { id: props.p.id, aba: 'categorias' } } },
])
function acoesDaCategoria(id: number, nome: string): DropdownMenuItem[][] {
  return [
    [
      { label: r.value.menu.moverCategoria, icon: 'i-lucide-folder-input', onSelect: () => { prj.janelas.mover.value = id } },
      {
        label: r.value.menu.tirarDoProjeto,
        icon: 'i-lucide-folder-output',
        onSelect: () => {
          prj.moverCategoria(id, null)
          toast.add({
            title: r.value.menu.tirada(nome),
            icon: 'i-lucide-folder-output',
            color: 'neutral',
            actions: [{ label: r.value.menu.desfazer, color: 'neutral', variant: 'outline', onClick: () => prj.moverCategoria(id, props.p.id) }],
          })
        },
      },
    ],
    [{ label: r.value.menu.configCategoria, icon: 'i-lucide-settings', onSelect: () => toast.add({ title: r.value.menu.configCategoriaMaquete, icon: 'i-lucide-info', color: 'neutral' }) }],
  ]
}

/* ---------- painéis ---------- */
function novoPainel() {
  prj.criarDashboard(props.p.id, r.value.menu.nomeDoPainel)
}
function acoesDoPainel(id: number, nome: string): DropdownMenuItem[][] {
  const abrir = [{ label: r.value.menu.abrir, icon: 'i-lucide-panel-top', onSelect: () => prj.abrirDashboard(id) }]
  if (!admin.value) return [abrir]
  return [
    [...abrir, { label: r.value.menu.editar, icon: 'i-lucide-layout-grid', onSelect: () => prj.abrirDashboard(id, true) }],
    [
      { label: r.value.menu.renomear, icon: 'i-lucide-pencil', onSelect: () => comecarRenomear(id) },
      {
        label: r.value.menu.duplicar,
        icon: 'i-lucide-copy',
        onSelect: () => {
          prj.duplicarDashboard(id, r.value.menu.copia)
          toast.add({ title: r.value.menu.duplicado(nome), icon: 'i-lucide-copy', color: 'success' })
        },
      },
    ],
    [{
      label: r.value.menu.excluir,
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect: () => {
        const ordem = paineis.value.map(x => x.id)
        const tirado = prj.excluirDashboard(id)
        if (!tirado) return
        toast.add({
          title: r.value.menu.painelExcluido(nome),
          icon: 'i-lucide-trash-2',
          color: 'neutral',
          actions: [{
            label: r.value.menu.desfazer,
            color: 'neutral',
            variant: 'outline',
            onClick: () => {
              prj.restaurarDashboard(tirado)
              prj.reordenarNoProjeto('d', props.p.id, ordem)
            },
          }],
        })
      },
    }],
  ]
}

/* renomear no lugar: clique duplo ou "Renomear" */
const rascunho = ref('')
const editandoId = computed(() => {
  const x = prj.renomeando.value
  return x?.startsWith('d:') ? Number(x.slice(2)) : null
})
function comecarRenomear(id: number) {
  if (!admin.value) return
  rascunho.value = paineis.value.find(x => x.id === id)?.nome ?? ''
  prj.renomeando.value = 'd:' + id
}
watch(editandoId, (id) => {
  if (id === null) return
  const d = paineis.value.find(x => x.id === id)
  if (d) rascunho.value = d.nome
  nextTick(() => {
    const el = document.getElementById(`renomear-${props.variante}-${id}`) as HTMLInputElement | null
    el?.focus()
    el?.select()
  })
}, { immediate: true })
function salvarNome(id: number) {
  const nome = rascunho.value.trim()
  if (nome) prj.atualizarDashboard(id, { nome })
  prj.renomeando.value = null
}

/* ---------- arrastar dentro da seção ---------- */
const arrastando = ref<{ tipo: 'c' | 'd', id: number } | null>(null)
const mira = ref<{ tipo: 'c' | 'd', id: number, antes: boolean } | null>(null)
function sobre(ev: DragEvent, tipo: 'c' | 'd', id: number) {
  if (!arrastando.value || arrastando.value.tipo !== tipo) return
  ev.stopPropagation()
  const rect = (ev.currentTarget as HTMLElement).getBoundingClientRect()
  mira.value = { tipo, id, antes: ev.clientY < rect.top + rect.height / 2 }
}
function soltar(ev: DragEvent, tipo: 'c' | 'd', alvo: number) {
  const de = arrastando.value
  if (!de || de.tipo !== tipo || !mira.value) return limpar()
  ev.stopPropagation()
  if (de.id !== alvo) {
    const ids = (tipo === 'c' ? categorias.value : paineis.value).map(x => x.id).filter(x => x !== de.id)
    ids.splice(ids.indexOf(alvo) + (mira.value.antes ? 0 : 1), 0, de.id)
    prj.reordenarNoProjeto(tipo, props.p.id, ids)
  }
  limpar()
}
function iniciar(ev: DragEvent, tipo: 'c' | 'd', id: number) {
  ev.stopPropagation()
  arrastando.value = { tipo, id }
}
function limpar() {
  arrastando.value = null
  mira.value = null
}
function linhaDeMira(tipo: 'c' | 'd', id: number) {
  const m = mira.value
  if (!m || m.tipo !== tipo || m.id !== id) return ''
  return m.antes
    ? 'before:absolute before:inset-x-2 before:-top-px before:h-0.5 before:rounded-full before:bg-primary'
    : 'after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary'
}
</script>

<template>
  <ul class="animate-[entrada_0.15s_ease-out_both]" :class="[v.lista, marca]">
    <!-- as linhas fixas: as abas da página do projeto -->
    <li v-for="f in fixas" :key="f.aba">
      <button
        type="button"
        class="flex w-full items-center gap-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        :class="[v.linha, abaAtiva(f.aba) ? v.ativo : v.fundo]"
        :aria-current="abaAtiva(f.aba) ? 'page' : undefined"
        @click="prj.abrirAba(p.id, f.aba)"
      >
        <UIcon :name="f.icone" class="size-4 shrink-0" :class="abaAtiva(f.aba) ? 'text-primary' : 'text-muted'" />
        <span class="min-w-0 flex-1 truncate">{{ f.rotulo }}</span>
        <span v-if="f.n" class="shrink-0 text-xs tabular-nums text-muted">{{ f.n }}</span>
      </button>
    </li>

    <!-- Categorias -->
    <li class="group/sec flex items-center" :class="v.secao">
      <span class="min-w-0 flex-1 truncate text-xs font-medium text-muted">{{ r.menu.categorias }}</span>
      <UDropdownMenu v-if="admin" :items="maisCategoria" :content="{ align: 'start', side: 'right' }" :ui="{ content: 'w-64' }">
        <UButton
          icon="i-lucide-plus"
          size="xs"
          color="neutral"
          variant="ghost"
          class="opacity-0 transition-opacity group-hover/sec:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
          :aria-label="r.menu.adicionarCategoria"
        />
      </UDropdownMenu>
      <span v-else class="h-6" />
    </li>
    <li
      v-for="c in categorias"
      :key="`c-${c.id}`"
      class="group/cat relative flex items-center transition-colors"
      :class="[
        variante === 'painel' ? 'rounded-md' : 'pr-2',
        categoriaAtiva(c.id) ? v.ativo : v.fundo,
        arrastando?.tipo === 'c' && arrastando.id === c.id ? 'opacity-40' : '',
        linhaDeMira('c', c.id),
      ]"
      :draggable="admin"
      @dragstart="iniciar($event, 'c', c.id)"
      @dragend="limpar"
      @dragover.prevent="sobre($event, 'c', c.id)"
      @drop.prevent="soltar($event, 'c', c.id)"
    >
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-2 text-left text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        :class="variante === 'painel' ? 'px-2 py-1.5' : 'py-2 pl-[4.25rem]'"
        :aria-current="categoriaAtiva(c.id) ? 'page' : undefined"
        :title="admin ? r.menu.arrastarCategoria : undefined"
        @click="prj.abrirCategoria(c.id)"
      >
        <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4 shrink-0" :class="categoriaAtiva(c.id) ? 'text-primary' : 'text-muted'" />
        <span class="truncate">{{ c.name }}</span>
      </button>
      <UDropdownMenu v-if="admin" :items="acoesDaCategoria(c.id, c.name)" :content="{ align: 'start' }" :ui="{ content: 'w-60' }">
        <UButton
          icon="i-lucide-ellipsis"
          size="xs"
          color="neutral"
          variant="ghost"
          class="mr-1 opacity-0 transition-opacity group-hover/cat:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
          :aria-label="t.painel.acoesDaCategoria(c.name)"
        />
      </UDropdownMenu>
    </li>
    <li v-if="!categorias.length">
      <button
        v-if="admin"
        type="button"
        class="flex w-full items-center gap-2 text-left text-sm text-muted transition-colors hover:bg-elevated hover:text-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        :class="v.linha"
        @click="prj.janelas.novaCategoria.value = p.id"
      >
        <UIcon name="i-lucide-plus" class="size-4 shrink-0" />
        <span class="truncate">{{ r.menu.adicionarCategoria }}</span>
      </button>
      <p v-else class="text-xs text-dimmed" :class="v.linha">{{ r.menu.semCategoria }}</p>
    </li>

    <!-- Painéis -->
    <li class="group/sec flex items-center" :class="v.secao">
      <span class="min-w-0 flex-1 truncate text-xs font-medium text-muted">{{ r.menu.paineis }}</span>
      <UTooltip v-if="admin" :text="r.menu.adicionarPainel">
        <UButton
          icon="i-lucide-plus"
          size="xs"
          color="neutral"
          variant="ghost"
          class="opacity-0 transition-opacity group-hover/sec:opacity-100 focus-visible:opacity-100"
          :aria-label="r.menu.adicionarPainel"
          @click="novoPainel"
        />
      </UTooltip>
      <span v-else class="h-6" />
    </li>
    <li
      v-for="d in paineis"
      :key="`d-${d.id}`"
      class="group/dash relative flex items-center transition-colors"
      :class="[
        variante === 'painel' ? 'rounded-md' : 'pr-2',
        painelAtivo(d.id) ? v.ativo : v.fundo,
        arrastando?.tipo === 'd' && arrastando.id === d.id ? 'opacity-40' : '',
        linhaDeMira('d', d.id),
      ]"
      :draggable="admin && editandoId !== d.id"
      @dragstart="iniciar($event, 'd', d.id)"
      @dragend="limpar"
      @dragover.prevent="sobre($event, 'd', d.id)"
      @drop.prevent="soltar($event, 'd', d.id)"
    >
      <div v-if="editandoId === d.id" class="flex min-w-0 flex-1 items-center gap-2" :class="variante === 'painel' ? 'px-2 py-1' : 'py-1.5 pl-[4.25rem]'">
        <UIcon name="i-lucide-chart-column" class="size-4 shrink-0 text-primary" />
        <UInput
          :id="`renomear-${variante}-${d.id}`"
          v-model="rascunho"
          size="xs"
          class="min-w-0 flex-1"
          :aria-label="r.menu.renomearRotulo"
          @keydown.enter.prevent="salvarNome(d.id)"
          @keydown.esc.prevent="prj.renomeando.value = null"
          @blur="salvarNome(d.id)"
        />
      </div>
      <button
        v-else
        type="button"
        class="flex min-w-0 flex-1 items-center gap-2 text-left text-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        :class="variante === 'painel' ? 'px-2 py-1.5' : 'py-2 pl-[4.25rem]'"
        :aria-current="painelAtivo(d.id) ? 'page' : undefined"
        :title="admin ? r.menu.arrastar : undefined"
        @click="prj.abrirDashboard(d.id)"
        @dblclick="comecarRenomear(d.id)"
      >
        <UIcon name="i-lucide-chart-column" class="size-4 shrink-0" :class="painelAtivo(d.id) ? 'text-primary' : 'text-muted'" />
        <span class="truncate">{{ d.nome }}</span>
      </button>
      <UDropdownMenu v-if="editandoId !== d.id" :items="acoesDoPainel(d.id, d.nome)" :content="{ align: 'start' }" :ui="{ content: 'w-56' }">
        <UButton
          icon="i-lucide-ellipsis"
          size="xs"
          color="neutral"
          variant="ghost"
          class="mr-1 opacity-0 transition-opacity group-hover/dash:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
          :aria-label="r.menu.acoesDoPainel(d.nome)"
        />
      </UDropdownMenu>
    </li>
    <li v-if="!paineis.length">
      <button
        v-if="admin"
        type="button"
        class="flex w-full items-center gap-2 text-left text-sm text-muted transition-colors hover:bg-elevated hover:text-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        :class="v.linha"
        @click="novoPainel"
      >
        <UIcon name="i-lucide-plus" class="size-4 shrink-0" />
        <span class="truncate">{{ r.menu.adicionarPainel }}</span>
      </button>
      <p v-else class="text-xs text-dimmed" :class="v.linha">{{ r.menu.semPainel }}</p>
    </li>
  </ul>
</template>
