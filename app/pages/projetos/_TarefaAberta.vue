<script setup lang="ts">
/**
 * PROPOSTA (rodada 10): a tarefa rápida aberta, no formato da issue aberta dentro de um project do
 * GitHub. À esquerda o conteúdo (título, descrição, subtarefas e relacionamentos); à direita a lateral
 * em que cada campo se edita no lugar, separada em "Da tarefa" (responsável, colaboradores, status,
 * prioridade, data limite, pontos, etiquetas e item) e "Neste projeto" (projeto e marco), como o GitHub
 * separa o campo da issue do campo do project. No menu "⋯": Copiar link e Excluir tarefa.
 *
 * A seção Subtarefas copia a do protótipo pasta-de-apontamentos (_SecoesDaTarefa.vue): mesmo campo
 * `parent` (aqui `mae`), 1 nível, a mesma linha de criação (título, responsável, data, prioridade,
 * pontos), "Vincular tarefa existente", a soma dos pontos e a oferta de concluir as abertas. Os 2
 * protótipos seguem a mesma lógica para o dev construir a subtarefa 1 vez (pedido da redatora na rodada 10).
 *
 * O que a tarefa rápida já tem no produto (lido no código em 2026-11-26): status, prioridade,
 * responsável, colaboradores, data limite, descrição, etiquetas, pontos e o item (opcional, no máximo 1).
 * O que é novo e pede back-end: a subtarefa (1 nível), o marco e o projeto da tarefa sem item.
 * O bloqueio entre tarefas fica no protótipo pasta-de-apontamentos, como a redatora pediu na rodada 8.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import { etiquetasBase, iniciais, pessoa, pessoas, type Prioridade, type StatusDaTarefa, type TarefaDoProjeto } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { textosDaTarefa } from './textosDaTarefa'
import { textosDeMarcosEMedicao } from './textosDeMarcosEMedicao'
import { useMarcaDeProposta, useProjetos } from './estado'
import { useMetasEDiscussoes } from './metasEDiscussoes'

const props = defineProps<{ id: number }>()
const prj = useProjetos()
const md = useMetasEDiscussoes()
const r = useTextos(textosDoProjeto)
const rt = computed(() => r.value.tarefas)
const tt = useTextos(textosDaTarefa)
const td = computed(() => tt.value.detalhe)
const tl = computed(() => tt.value.detalhe.lateral)
const tmm = useTextos(textosDeMarcosEMedicao)
const idioma = useIdioma()
const toast = useToast()
const { marca } = useMarcaDeProposta()

const tarefa = computed<TarefaDoProjeto | null>(() => prj.tarefas.value.find(x => x.id === prj.tarefaAberta.value) ?? null)
const aberta = computed({
  get: () => !!tarefa.value,
  set: (v: boolean) => { if (!v) prj.tarefaAberta.value = null },
})
const subtarefas = computed(() => tarefa.value ? prj.subtarefasDe(tarefa.value.id) : [])
const mae = computed(() => tarefa.value?.mae ? prj.tarefas.value.find(x => x.id === tarefa.value!.mae) ?? null : null)
const feitas = computed(() => subtarefas.value.filter(x => x.status === 'concluida').length)
const podeMarco = computed(() => md.podeEditarMarcos(props.id))

const COR_DO_STATUS: Record<StatusDaTarefa, 'neutral' | 'info' | 'warning' | 'success'> = { aberta: 'neutral', andamento: 'info', bloqueada: 'warning', concluida: 'success' }
const ICONE_DO_STATUS: Record<StatusDaTarefa, string> = { aberta: 'i-lucide-circle', andamento: 'i-lucide-circle-dot', bloqueada: 'i-lucide-circle-pause', concluida: 'i-lucide-circle-check' }
const COR_DA_PRIORIDADE: Record<Prioridade, 'error' | 'warning' | 'info' | 'neutral'> = { urgente: 'error', alta: 'warning', media: 'info', baixa: 'neutral' }

const opPessoas = computed(() => pessoas.filter(x => !x.convidado).map(x => ({ value: x.id, label: x.nome, avatar: { text: iniciais(x.nome) } })))
const opStatus = computed(() => (['aberta', 'andamento', 'bloqueada', 'concluida'] as StatusDaTarefa[]).map(v => ({ value: v, label: rt.value.status[v], icon: ICONE_DO_STATUS[v] })))
const opPrioridade = computed(() => (['urgente', 'alta', 'media', 'baixa'] as Prioridade[]).map(v => ({ value: v, label: rt.value.prioridade[v] })))
const opEtiquetas = computed(() => etiquetasBase.map(e => ({ value: e.id, label: e.nome })))
const etiqueta = (id: string) => etiquetasBase.find(e => e.id === id)
const opMarcos = computed(() => [
  { value: 0, label: tmm.value.marcos.semMarco },
  ...md.marcosDo(props.id).filter(m => m.status === 'aberto').map(m => ({ value: m.id, label: m.nome, icon: 'i-lucide-flag' })),
])
/** O item: "Sem item" ou um item de uma categoria do projeto (a tarefa liga a no máximo 1). */
const opItens = computed(() => [
  { value: '0', label: tt.value.semItem, icon: 'i-lucide-circle-dashed' },
  ...prj.categoriasDe(props.id).flatMap(c => prj.itensDaCategoria(c.id).map(ref => ({ value: `${c.id}:${ref}`, label: `${ref} · ${c.name}`, icon: c.icon ?? 'i-lucide-folder' }))),
])
const valorDoItem = computed(() => tarefa.value?.item ? `${tarefa.value.categoria}:${tarefa.value.item}` : '0')
const nomeDaCategoria = (id: number | null) => prj.categorias.value.find(c => c.id === id)?.name ?? ''
const iconeDaCategoria = (id: number | null) => prj.categorias.value.find(c => c.id === id)?.icon ?? 'i-lucide-folder'
const nomeDoProjeto = computed(() => prj.projetos.value.find(p => p.id === props.id)?.nome ?? '')
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value, { day: '2-digit', month: 'short', year: 'numeric' })

function salvar(dados: Partial<TarefaDoProjeto>) {
  if (!tarefa.value) return
  prj.atualizarTarefa(tarefa.value.id, dados)
}
function trocarItem(v: string) {
  if (v === '0') return salvar({ categoria: null, item: null, projeto: props.id })
  const [cat, ref] = v.split(':')
  salvar({ categoria: Number(cat), item: ref, projeto: undefined })
}

/* ---------- título e descrição: editam no lugar e salvam ao sair do campo ---------- */
const titulo = ref('')
const descricao = ref('')
watch(tarefa, (x) => {
  titulo.value = x?.titulo ?? ''
  descricao.value = x?.descricao ?? ''
}, { immediate: true })
function salvarTitulo() {
  if (!tarefa.value) return
  const v = titulo.value.trim()
  if (!v) { titulo.value = tarefa.value.titulo; return }
  if (v !== tarefa.value.titulo) salvar({ titulo: v })
}
function salvarDescricao() {
  if (tarefa.value && descricao.value !== (tarefa.value.descricao ?? '')) salvar({ descricao: descricao.value })
}

/* ---------- subtarefas: a mesma lógica do protótipo pasta-de-apontamentos (rodadas 2 e 5 de lá) ---------- */
const COR_DA_BANDEIRA: Record<Prioridade, string> = { urgente: 'text-error', alta: 'text-warning', media: 'text-muted', baixa: 'text-dimmed' }
const somaDePontos = computed(() => subtarefas.value.reduce((a, x) => a + (x.pontos ?? 0), 0))
const criandoSub = ref(false)
const rascunho = reactive({ nome: '', responsavel: undefined as number | undefined, data: '', prioridade: 'media' as Prioridade, pontos: 0 })
function limparRascunho() {
  Object.assign(rascunho, { nome: '', responsavel: undefined, data: '', prioridade: 'media', pontos: 0 })
}
const focar = () => nextTick(() => document.getElementById('nova-subtarefa')?.focus())
function abrirSubtarefa() {
  criandoSub.value = true
  focar()
}
function cancelarSub() {
  criandoSub.value = false
  limparRascunho()
}
/** Salvar deixa a linha aberta para a próxima, como no ClickUp; Esc cancela. */
function salvarSub() {
  const x = tarefa.value
  const nome = rascunho.nome.trim()
  if (!x || !nome) return focar()
  prj.criarTarefa({ titulo: nome, categoria: null, item: null, projeto: props.id, mae: x.id, responsavel: rascunho.responsavel ?? x.responsavel, prazo: rascunho.data || x.prazo, prioridade: rascunho.prioridade, pontos: rascunho.pontos || undefined })
  toast.add({ title: td.value.subCriada(nome), icon: 'i-lucide-git-branch', color: 'success', duration: 2500 })
  limparRascunho()
  focar()
}
const responsaveisDoRascunho = computed<DropdownMenuItem[]>(() => [
  { label: td.value.semResponsavel, icon: 'i-lucide-user-x', onSelect: () => { rascunho.responsavel = undefined } },
  ...pessoas.filter(x => !x.convidado).map(x => ({ label: x.nome, avatar: { text: iniciais(x.nome), alt: x.nome }, onSelect: () => { rascunho.responsavel = x.id } })),
])
const prioridadesDoRascunho = computed<DropdownMenuItem[]>(() => (['urgente', 'alta', 'media', 'baixa'] as Prioridade[]).map(v => ({
  label: rt.value.prioridade[v],
  icon: 'i-lucide-flag',
  ui: { itemLeadingIcon: COR_DA_BANDEIRA[v] },
  onSelect: () => { rascunho.prioridade = v },
})))
const pessoaDoRascunho = computed(() => rascunho.responsavel ? pessoa(rascunho.responsavel) : undefined)
/** Vincular: a tarefa solta do projeto vira parte desta. Fora: ela mesma, uma subtarefa e quem já tem subtarefas. */
const vinculaveis = computed(() => tarefa.value
  ? prj.tarefasDoProjeto(props.id).filter(y => y.id !== tarefa.value!.id && !y.mae && !prj.subtarefasDe(y.id).length).map(y => ({ label: y.titulo, value: y.id }))
  : [])
const limpar = ref(0)
function vincular(id: number | undefined) {
  const y = prj.tarefas.value.find(t => t.id === id)
  if (!y || !tarefa.value) return
  prj.atualizarTarefa(y.id, { mae: tarefa.value.id })
  limpar.value++
  toast.add({ title: td.value.vinculada(y.titulo), icon: 'i-lucide-link', color: 'success', duration: 2500 })
}
function desvincular(y: TarefaDoProjeto) {
  prj.atualizarTarefa(y.id, { mae: undefined })
  toast.add({ title: td.value.desvinculada(y.titulo), icon: 'i-lucide-unlink', duration: 2500 })
}
/** Concluir a tarefa-mãe com subtarefa aberta oferece concluir as abertas junto. */
function trocarStatus(v: StatusDaTarefa) {
  const x = tarefa.value
  if (!x) return
  salvar({ status: v })
  const n = prj.abertasDe(x.id).length
  if (v === 'concluida' && n) {
    toast.add({
      title: td.value.abertas(n),
      icon: 'i-lucide-git-branch',
      color: 'warning',
      duration: 10000,
      actions: [{ label: td.value.concluirAbertas(n), color: 'neutral', variant: 'outline', onClick: () => prj.concluirComSubtarefas(x.id) }],
    })
  }
}

/* ---------- menu ⋯ e exclusão ---------- */
const confirmarExclusao = ref(false)
const acoes = computed<DropdownMenuItem[][]>(() => [
  [{ label: td.value.copiarLink, icon: 'i-lucide-link', onSelect: () => toast.add({ title: td.value.linkCopiado, icon: 'i-lucide-check', color: 'success' }) }],
  [{ label: td.value.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => { confirmarExclusao.value = true } }],
])
function excluir() {
  const x = tarefa.value
  if (!x) return
  const m = md.marcoDaTarefa(x.id)
  if (m) md.tirarTarefa(m, x.id)
  prj.excluirTarefa(x.id)
  confirmarExclusao.value = false
  toast.add({ title: td.value.excluida(x.titulo), icon: 'i-lucide-trash-2', color: 'neutral' })
}
</script>

<template>
  <USlideover v-model:open="aberta" :ui="{ content: 'sm:max-w-4xl', body: 'p-0 sm:p-0' }">
    <template #title>
      <span v-if="tarefa" class="flex items-center gap-2">
        <UIcon :name="ICONE_DO_STATUS[tarefa.status]" class="size-5 shrink-0" :class="`text-${COR_DO_STATUS[tarefa.status]}`" />
        <span class="truncate">{{ tarefa.titulo }}</span>
      </span>
    </template>
    <template #description>
      <span v-if="tarefa" class="flex flex-wrap items-center gap-x-2 gap-y-1">
        <UBadge :label="rt.status[tarefa.status]" :icon="ICONE_DO_STATUS[tarefa.status]" :color="COR_DO_STATUS[tarefa.status]" variant="subtle" size="sm" />
        <span>{{ td.tipo }} · {{ nomeDoProjeto }}</span>
        <button v-if="mae" type="button" class="underline-offset-2 hover:underline" @click="prj.tarefaAberta.value = mae.id">{{ tt.parteDe(mae.titulo) }}</button>
      </span>
    </template>
    <template #actions>
      <UDropdownMenu :items="acoes" :content="{ align: 'end' }">
        <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" :aria-label="td.acoes" />
      </UDropdownMenu>
    </template>

    <template #body>
      <div v-if="tarefa" class="grid min-h-full lg:grid-cols-[minmax(0,1fr)_17rem]">
        <!-- conteúdo -->
        <div class="flex flex-col gap-6 p-5">
          <UFormField :label="td.titulo">
            <UInput v-model="titulo" class="w-full" size="lg" @blur="salvarTitulo" @keydown.enter="($event.target as HTMLInputElement).blur()" />
          </UFormField>
          <UFormField :label="td.descricao">
            <UTextarea v-model="descricao" :placeholder="td.descricaoPh" :rows="3" autoresize class="w-full" @blur="salvarDescricao" />
          </UFormField>

          <!-- subtarefas: só na tarefa-mãe (1 nível), como no pasta-de-apontamentos -->
          <section v-if="!mae" class="flex flex-col gap-2" :class="marca">
            <header class="flex flex-wrap items-center gap-2">
              <h3 class="text-sm font-semibold text-highlighted">{{ td.subtarefas }}</h3>
              <UTooltip :text="td.subtarefasDica">
                <UIcon name="i-lucide-info" class="size-4 text-muted" :aria-label="td.subtarefasDica" />
              </UTooltip>
              <span v-if="subtarefas.length" class="text-xs tabular-nums" :class="feitas === subtarefas.length ? 'text-success' : 'text-muted'">{{ td.contagem(feitas, subtarefas.length) }}</span>
              <UBadge v-if="somaDePontos" :label="td.somaDePontos(somaDePontos)" icon="i-lucide-hash" color="neutral" variant="soft" size="sm" class="ml-auto tabular-nums" />
            </header>
            <ul v-if="subtarefas.length" class="-mx-2 flex flex-col">
              <li v-for="x in subtarefas" :key="x.id" class="group/sub flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-elevated/60 animate-[entrada_.25s_ease-out_both]">
                <UTooltip :text="rt.status[x.status]">
                  <button type="button" class="flex shrink-0 rounded-full transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary" :aria-label="rt.status[x.status]" :aria-pressed="x.status === 'concluida'" @click="prj.concluirTarefa(x.id)">
                    <UIcon :name="ICONE_DO_STATUS[x.status]" class="size-4" :class="`text-${COR_DO_STATUS[x.status]}`" />
                  </button>
                </UTooltip>
                <button type="button" class="min-w-0 flex-1 truncate text-left text-sm hover:underline" :class="x.status === 'concluida' ? 'text-muted line-through' : 'text-highlighted'" @click="prj.tarefaAberta.value = x.id">{{ x.titulo }}</button>
                <UIcon v-if="x.prioridade === 'alta' || x.prioridade === 'urgente'" name="i-lucide-flag" class="size-3.5 shrink-0" :class="COR_DA_BANDEIRA[x.prioridade]" :aria-label="rt.prioridade[x.prioridade]" />
                <UBadge v-if="x.pontos" :label="String(x.pontos)" icon="i-lucide-hash" color="neutral" variant="soft" size="sm" class="shrink-0 tabular-nums" :aria-label="`${x.pontos} ${tt.pontos.rotulo}`" />
                <span class="shrink-0 text-xs text-muted">{{ formatarData(x.prazo) }}</span>
                <UAvatar size="2xs" class="shrink-0" :text="iniciais(pessoa(x.responsavel)?.nome ?? '')" :alt="pessoa(x.responsavel)?.nome" />
                <UTooltip :text="td.desvincular">
                  <UButton icon="i-lucide-unlink" color="neutral" variant="ghost" size="xs" class="shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/sub:opacity-100" :aria-label="td.desvincular" @click="desvincular(x)" />
                </UTooltip>
              </li>
            </ul>

            <!-- a linha de criação, como no pasta-de-apontamentos (e no ClickUp) -->
            <div v-if="criandoSub" class="flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-md border border-primary/60 px-2 py-1.5 ring-2 ring-primary/15 animate-[entrada_.2s_ease-out_both]" @keydown.esc.stop="cancelarSub">
              <UIcon name="i-lucide-circle-dashed" class="size-4 shrink-0 text-dimmed" />
              <input id="nova-subtarefa" v-model="rascunho.nome" type="text" class="min-w-40 flex-1 bg-transparent py-0.5 text-sm text-highlighted outline-none placeholder:text-dimmed" :placeholder="td.placeholder" :aria-label="td.placeholder" @keydown.enter.prevent="salvarSub">
              <div class="flex items-center gap-0.5">
                <UDropdownMenu :items="responsaveisDoRascunho" :content="{ align: 'end' }">
                  <UButton v-if="pessoaDoRascunho" color="neutral" variant="ghost" size="xs" class="rounded-full" :aria-label="`${tl.responsavel}: ${pessoaDoRascunho.nome}`">
                    <UAvatar :text="iniciais(pessoaDoRascunho.nome)" :alt="pessoaDoRascunho.nome" size="2xs" />
                  </UButton>
                  <UButton v-else icon="i-lucide-user-plus" color="neutral" variant="ghost" size="xs" :aria-label="tl.responsavel" />
                </UDropdownMenu>
                <UPopover :content="{ align: 'end' }">
                  <UButton :label="rascunho.data ? formatarData(rascunho.data) : undefined" icon="i-lucide-calendar" color="neutral" :variant="rascunho.data ? 'soft' : 'ghost'" size="xs" :aria-label="tl.prazo" />
                  <template #content>
                    <div class="flex flex-col gap-2 p-2">
                      <p class="text-xs font-medium text-muted">{{ tl.prazo }}</p>
                      <UInput v-model="rascunho.data" type="date" size="sm" :aria-label="tl.prazo" />
                      <UButton v-if="rascunho.data" :label="td.tirarData" icon="i-lucide-x" color="neutral" variant="outline" size="xs" @click="rascunho.data = ''" />
                    </div>
                  </template>
                </UPopover>
                <UDropdownMenu :items="prioridadesDoRascunho" :content="{ align: 'end' }">
                  <UButton :label="rascunho.prioridade !== 'media' ? rt.prioridade[rascunho.prioridade] : undefined" icon="i-lucide-flag" color="neutral" :variant="rascunho.prioridade !== 'media' ? 'soft' : 'ghost'" size="xs" :ui="{ leadingIcon: COR_DA_BANDEIRA[rascunho.prioridade] }" :aria-label="`${tl.prioridade}: ${rt.prioridade[rascunho.prioridade]}`" />
                </UDropdownMenu>
                <UPopover :content="{ align: 'end' }">
                  <UButton :label="rascunho.pontos ? String(rascunho.pontos) : undefined" icon="i-lucide-hash" color="neutral" :variant="rascunho.pontos ? 'soft' : 'ghost'" size="xs" class="tabular-nums" :aria-label="tt.pontos.rotulo" />
                  <template #content>
                    <div class="flex w-48 flex-col gap-1.5 p-2">
                      <p class="text-xs font-medium text-muted">{{ tt.pontos.rotulo }}</p>
                      <UInputNumber v-model="rascunho.pontos" :min="0" size="sm" :aria-label="tt.pontos.rotulo" />
                      <p class="text-xs text-dimmed">{{ tt.pontos.ajuda }}</p>
                    </div>
                  </template>
                </UPopover>
              </div>
              <div class="ml-auto flex items-center gap-1.5">
                <UButton :label="td.cancelar" color="neutral" variant="ghost" size="xs" @click="cancelarSub" />
                <UButton :label="td.salvar" color="neutral" variant="solid" size="xs" @click="salvarSub">
                  <template #trailing>
                    <UKbd value="enter" size="sm" color="neutral" variant="subtle" />
                  </template>
                </UButton>
              </div>
            </div>
            <div v-else class="-mx-1 flex flex-wrap items-center gap-2">
              <UButton :label="td.adicionar" icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" @click="abrirSubtarefa" />
              <USelectMenu
                :key="`vincular-${limpar}`"
                :model-value="undefined"
                :items="vinculaveis"
                value-key="value"
                :placeholder="td.vincular"
                :search-input="{ placeholder: td.vincularPlaceholder }"
                icon="i-lucide-link"
                size="sm"
                variant="ghost"
                class="w-56"
                :ui="{ content: 'min-w-72' }"
                @update:model-value="vincular"
              />
            </div>
          </section>

          <!-- relacionamentos -->
          <section class="flex flex-col gap-2">
            <h3 class="text-sm font-semibold text-highlighted">{{ td.relacionamentos }}</h3>
            <div class="rounded-lg border border-default p-3">
              <p class="text-xs text-muted">{{ td.itemVinculado }}</p>
              <div v-if="tarefa.item" class="mt-1.5 flex items-center gap-2">
                <UIcon :name="iconeDaCategoria(tarefa.categoria)" class="size-4 shrink-0 text-muted" />
                <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ tarefa.item }}</UBadge>
                <span class="min-w-0 flex-1 truncate text-sm text-default">{{ nomeDaCategoria(tarefa.categoria) }}</span>
                <UButton :label="td.abrirItem" trailing-icon="i-lucide-arrow-up-right" size="xs" color="neutral" variant="outline" @click="prj.abrirCategoria(tarefa.categoria!); prj.tarefaAberta.value = null" />
              </div>
              <p v-else class="mt-1 text-sm text-toned">{{ td.semItemTexto }}</p>
            </div>
            <div v-if="mae" class="rounded-lg border border-default p-3">
              <p class="text-xs text-muted">{{ td.tarefaMae }}</p>
              <button type="button" class="mt-1 flex w-full items-center gap-2 text-left text-sm text-highlighted hover:underline" @click="prj.tarefaAberta.value = mae.id">
                <UIcon :name="ICONE_DO_STATUS[mae.status]" class="size-4 shrink-0" :class="`text-${COR_DO_STATUS[mae.status]}`" />
                <span class="truncate">{{ mae.titulo }}</span>
              </button>
            </div>
          </section>
        </div>

        <!-- lateral: cada campo se edita no lugar -->
        <aside class="flex flex-col divide-y divide-default border-t border-default lg:border-t-0 lg:border-l">
          <p class="bg-elevated/50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{{ tl.daTarefa }}</p>
          <div class="flex flex-col gap-1 px-4 py-2">
            <span class="text-xs font-medium text-muted">{{ tl.responsavel }}</span>
            <USelectMenu :model-value="tarefa.responsavel" :items="opPessoas" value-key="value" size="sm" variant="ghost" class="w-full" :aria-label="tl.responsavel" @update:model-value="(v: number) => salvar({ responsavel: v })" />
          </div>
          <div class="flex flex-col gap-1 px-4 py-2">
            <span class="text-xs font-medium text-muted">{{ tl.colaboradores }}</span>
            <USelectMenu :model-value="tarefa.colaboradores ?? []" :items="opPessoas" value-key="value" multiple size="sm" variant="ghost" class="w-full" :placeholder="tl.nenhum" :aria-label="tl.colaboradores" @update:model-value="(v: number[]) => salvar({ colaboradores: v })" />
          </div>
          <div class="flex flex-col gap-1 px-4 py-2">
            <span class="text-xs font-medium text-muted">{{ tl.status }}</span>
            <USelect :model-value="tarefa.status" :items="opStatus" size="sm" variant="ghost" class="w-full" :aria-label="tl.status" @update:model-value="trocarStatus" />
          </div>
          <div class="flex flex-col gap-1 px-4 py-2">
            <span class="text-xs font-medium text-muted">{{ tl.prioridade }}</span>
            <USelect :model-value="tarefa.prioridade" :items="opPrioridade" size="sm" variant="ghost" class="w-full" :aria-label="tl.prioridade" @update:model-value="(v: Prioridade) => salvar({ prioridade: v })">
              <template #leading>
                <UIcon name="i-lucide-signal" class="size-4" :class="`text-${COR_DA_PRIORIDADE[tarefa.prioridade]}`" />
              </template>
            </USelect>
          </div>
          <div class="flex flex-col gap-1 px-4 py-2">
            <span class="text-xs font-medium text-muted">{{ tl.prazo }}</span>
            <UInput :model-value="tarefa.prazo" type="date" size="sm" variant="ghost" class="w-full" :aria-label="tl.prazo" @update:model-value="(v: string | number) => v && salvar({ prazo: String(v) })" />
          </div>
          <div class="flex flex-col gap-1 px-4 py-2">
            <span class="text-xs font-medium text-muted">{{ tl.pontos }}</span>
            <UInputNumber :model-value="tarefa.pontos ?? 0" :min="0" size="sm" variant="ghost" class="w-full" :aria-label="tl.pontos" @update:model-value="(v: number | null) => salvar({ pontos: v || undefined })" />
          </div>
          <div class="flex flex-col gap-1 px-4 py-2">
            <span class="text-xs font-medium text-muted">{{ tl.etiquetas }}</span>
            <USelectMenu :model-value="tarefa.etiquetas ?? []" :items="opEtiquetas" value-key="value" multiple size="sm" variant="ghost" class="w-full" :placeholder="tl.semEtiqueta" :aria-label="tl.etiquetas" @update:model-value="(v: string[]) => salvar({ etiquetas: v })">
              <template #default>
                <span v-if="tarefa.etiquetas?.length" class="flex flex-wrap gap-1">
                  <UBadge v-for="e in tarefa.etiquetas" :key="e" :label="etiqueta(e)?.nome" :color="etiqueta(e)?.cor" variant="subtle" size="sm" />
                </span>
                <span v-else class="text-dimmed">{{ tl.semEtiqueta }}</span>
              </template>
            </USelectMenu>
          </div>
          <div class="flex flex-col gap-1 px-4 py-2">
            <span class="text-xs font-medium text-muted">{{ tl.item }}</span>
            <USelectMenu :model-value="valorDoItem" :items="opItens" value-key="value" size="sm" variant="ghost" class="w-full" :ui="{ content: 'min-w-72' }" :aria-label="tl.item" @update:model-value="trocarItem" />
            <span class="text-[11px] leading-snug text-dimmed">{{ tl.itemDica }}</span>
          </div>
          <p class="bg-elevated/50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{{ tl.doProjeto }}</p>
          <div class="flex flex-col gap-0.5 px-4 py-2">
            <span class="text-xs font-medium text-muted">{{ tl.projeto }}</span>
            <span class="text-sm text-highlighted">{{ nomeDoProjeto }}</span>
            <span class="text-[11px] text-dimmed">{{ tarefa.item ? tl.peloItem : tl.semItem }}</span>
          </div>
          <div class="flex flex-col gap-1 px-4 py-2" :class="marca">
            <span class="text-xs font-medium text-muted">{{ tl.marco }}</span>
            <UTooltip :text="tl.marcoSoAdmin" :disabled="podeMarco">
              <USelect :model-value="md.marcoDaTarefa(tarefa.id)?.id ?? 0" :items="opMarcos" size="sm" variant="ghost" class="w-full" :disabled="!podeMarco" :ui="{ content: 'min-w-64' }" :aria-label="tl.marco" @update:model-value="(v: number) => md.definirMarcoDaTarefa(tarefa!.id, v || null)" />
            </UTooltip>
          </div>
          <div class="px-4 py-2 text-[11px] text-dimmed">
            {{ rt.colCriada }}: {{ formatarData(tarefa.criadaEm) }}
          </div>
        </aside>
      </div>
    </template>
  </USlideover>

  <UModal v-model:open="confirmarExclusao" :title="td.excluirTitulo" :description="td.excluirTexto(subtarefas.length)" :ui="{ content: 'max-w-md' }">
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="td.cancelar" color="neutral" variant="ghost" @click="confirmarExclusao = false" />
        <UButton :label="td.excluir" icon="i-lucide-trash-2" color="error" @click="excluir" />
      </div>
    </template>
  </UModal>
</template>
