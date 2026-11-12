<script setup lang="ts">
/**
 * As seções que a aba Tarefa ganha, abaixo de "Detalhes da tarefa".
 *
 * Rodada 2, tirada do GitHub: checklist com responsável, arrastar e "Converter
 * em subtarefa"; subtarefas de 1 nível; dependências; "Mencionada em".
 *
 * Rodada 5, no modo do ClickUp (prints da redatora de 12/11/2026):
 * - a seção só aparece quando tem conteúdo. A tarefa vazia mostra só a lista
 *   "Adicionar à tarefa": Adicionar subtarefa, Relacionar ou adicionar
 *   dependência, Criar checklist e Anexar arquivos. Com conteúdo, a mesma
 *   lista vira uma fileira de botões no topo;
 * - Subtarefas: a linha de criação com nome, responsável, data limite,
 *   prioridade e pontos, Cancelar e Salvar (Enter). A linha fica aberta para
 *   a próxima, como no ClickUp;
 * - Checklists: várias, cada uma com nome, "Adicionar item" com o responsável
 *   na mesma linha e "Adicionar checklist";
 * - Relacionar: no ENSPACE, vincular a um item, vincular a outra tarefa, "Esta
 *   tarefa bloqueia..." e "Esta tarefa está bloqueada por...". Tudo cai na
 *   seção Relacionamentos;
 * - Anexos: nome e tamanho; o arquivo não sai do navegador.
 */
import type { CommandPaletteGroup, DropdownMenuItem } from '@nuxt/ui'
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import type { Checklist, ItemVinculavel, LinhaDeChecklist, Mencao, Pessoa, TarefaDoItem } from './mocks'
import type { Textos } from './textos'
import { bloqueia, concluida, desrelacionar, feitoDaLinha, filhas, linhasDe, novaChecklist, novaLinha, novaTarefa, porId, reabrirTarefa, relacionadasDe, semSecoes } from './tarefas'

const props = defineProps<{
  t: Textos
  x: TarefaDoItem
  tarefas: TarefaDoItem[]
  pessoas: Pessoa[]
  mencoes: Mencao[]
  /** Os outros itens do workspace, para "Vincular a um item". */
  itens: ItemVinculavel[]
  quem: number
  somenteLeitura?: boolean
}>()
const emit = defineEmits<{ abrir: [x: TarefaDoItem] }>()

const toast = useToast()
const tr = computed(() => props.t.tarefaRapida)
const pessoa = (id?: number | null) => props.pessoas.find(p => p.id === id)
const iconeDoStatus: Record<string, string> = { pending: 'i-lucide-circle', working: 'i-lucide-circle-dashed', blocked: 'i-lucide-circle-pause', completed: 'i-lucide-circle-check' }
const corDoStatus: Record<string, string> = { pending: 'text-info', working: 'text-warning', blocked: 'text-error', completed: 'text-success' }
const prioridades = ['low', 'normal', 'high', 'urgent'] as const
const corDaBandeira: Record<string, string> = { low: 'text-dimmed', normal: 'text-info', high: 'text-warning', urgent: 'text-error' }

/* ---------- seções que recolhem, como no ClickUp ---------- */
const recolhidas = ref(new Set<string>())
const aberta = (id: string) => !recolhidas.value.has(id)
function alternarSecao(id: string) {
  const s = new Set(recolhidas.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  recolhidas.value = s
}
function expandir(id: string) {
  if (!recolhidas.value.has(id)) return
  alternarSecao(id)
}
function focar(id: string) {
  nextTick(() => {
    const el = document.getElementById(id)
    ;(el?.tagName === 'INPUT' ? el : el?.querySelector('input'))?.focus()
  })
}

/* ---------- subtarefas ---------- */
const subs = computed(() => filhas(props.tarefas, props.x))
const concluidas = computed(() => subs.value.filter(s => concluida(s)).length)
const somaDePontos = computed(() => subs.value.reduce((a, s) => a + (Number(s.tarefa.points) || 0), 0))
const criandoSub = ref(false)
const rascunho = reactive({ nome: '', responsavel: undefined as number | undefined, data: '', prioridade: 'normal' as Task['priority'], pontos: 0 })
function limparRascunho() {
  Object.assign(rascunho, { nome: '', responsavel: undefined, data: '', prioridade: 'normal', pontos: 0 })
}
function abrirSubtarefa() {
  criandoSub.value = true
  expandir('subtarefas')
  focar('nova-subtarefa')
}
function cancelarSub() {
  criandoSub.value = false
  limparRascunho()
}
function salvarSub() {
  const nome = rascunho.nome.trim()
  if (!nome) return focar('nova-subtarefa')
  const s = novaTarefa(props.tarefas, props.x, nome, { mae: props.x.tarefa.id })
  s.tarefa.assigned_to = rascunho.responsavel ?? null
  s.tarefa.priority = rascunho.prioridade
  s.tarefa.points = rascunho.pontos || 0
  s.tarefa.due_date = rascunho.data ? new Date(`${rascunho.data}T18:00:00`) : null
  toast.add({ title: tr.value.toasts.subtarefaCriada(nome), icon: 'i-lucide-git-branch', color: 'success', duration: 2500 })
  limparRascunho()
  focar('nova-subtarefa')
}
const responsaveisDoRascunho = computed<DropdownMenuItem[]>(() => [
  { label: tr.value.subtarefas.semResponsavel, icon: 'i-lucide-user-x', onSelect: () => { rascunho.responsavel = undefined } },
  ...props.pessoas.map(p => ({ label: p.nome, avatar: { text: p.iniciais, alt: p.nome }, onSelect: () => { rascunho.responsavel = p.id } })),
])
const prioridadesDoRascunho = computed<DropdownMenuItem[]>(() => prioridades.map(p => ({
  label: props.t.prioridades[p],
  icon: 'i-lucide-flag',
  ui: { itemLeadingIcon: corDaBandeira[p] },
  onSelect: () => { rascunho.prioridade = p },
})))
function alternarSub(s: TarefaDoItem) {
  if (props.somenteLeitura) return
  if (concluida(s)) reabrirTarefa(s)
  else {
    s.tarefa.status = 'completed'
    s.conclusao = { motivo: 'concluida' }
  }
}
const vinculaveis = computed(() => props.tarefas
  .filter(y => y !== props.x && !y.mae && !filhas(props.tarefas, y).length)
  .map(y => ({ label: y.tarefa.name, value: y.tarefa.id })))
/* O seletor volta ao placeholder: a chave nova remonta o campo depois de cada escolha. */
const limpar = ref(0)
function vincular(id: number | undefined) {
  const y = porId(props.tarefas, id)
  if (!y) return
  y.mae = props.x.tarefa.id
  limpar.value++
  toast.add({ title: tr.value.toasts.vinculada(y.tarefa.name), icon: 'i-lucide-link', color: 'success', duration: 2500 })
}
function desvincular(s: TarefaDoItem) {
  s.mae = undefined
  for (const l of linhasDe(props.x)) if (l.subtarefa === s.tarefa.id) l.subtarefa = undefined
  toast.add({ title: tr.value.toasts.desvinculada(s.tarefa.name), icon: 'i-lucide-unlink', duration: 2500 })
}

/* ---------- checklists ---------- */
const totalDeLinhas = computed(() => linhasDe(props.x).length)
const feitosDe = (c: Checklist) => c.linhas.filter(l => feitoDaLinha(props.tarefas, l)).length
const feitosNoTotal = computed(() => props.x.checklists.reduce((a, c) => a + feitosDe(c), 0))
/** O que se digita na linha "Adicionar item" de cada checklist, com o responsável escolhido antes. */
const linhasNovas = reactive<Record<string, { texto: string, responsavel?: number }>>({})
watchEffect(() => {
  for (const c of props.x.checklists) linhasNovas[c.id] ??= { texto: '' }
})
function criarChecklist() {
  const c = novaChecklist(tr.value.checklist.nomePadrao(props.x.checklists.length + 1))
  linhasNovas[c.id] = { texto: '' }
  props.x.checklists.push(c)
  expandir('checklists')
  focar(`nova-linha-${c.id}`)
}
function adicionarLinha(c: Checklist) {
  const n = linhasNovas[c.id]
  const texto = n?.texto.trim()
  if (!n || !texto) return
  c.linhas.push(novaLinha(texto, n.responsavel))
  n.texto = ''
}
const responsaveisDoNovo = (c: Checklist): DropdownMenuItem[] => [
  { label: tr.value.checklist.semResponsavel, icon: 'i-lucide-user-x', onSelect: () => { linhasNovas[c.id]!.responsavel = undefined } },
  ...props.pessoas.map(p => ({ label: p.nome, avatar: { text: p.iniciais, alt: p.nome }, onSelect: () => { linhasNovas[c.id]!.responsavel = p.id } })),
]

/* Nome da checklist: clicar renomeia. */
const editandoNome = ref<string | null>(null)
const nomeEmEdicao = ref('')
function renomear(c: Checklist) {
  editandoNome.value = c.id
  nomeEmEdicao.value = c.nome
  focar(`nome-${c.id}`)
}
function salvarNome(c: Checklist) {
  if (nomeEmEdicao.value.trim()) c.nome = nomeEmEdicao.value.trim()
  editandoNome.value = null
}
function excluirChecklist(c: Checklist) {
  const i = props.x.checklists.indexOf(c)
  props.x.checklists.splice(i, 1)
  toast.add({ title: tr.value.toasts.checklistExcluida(c.nome), icon: 'i-lucide-trash-2', duration: 4000, actions: [{ label: tr.value.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { props.x.checklists.splice(i, 0, c) } }] })
}
const menuDaChecklist = (c: Checklist): DropdownMenuItem[][] => [
  [{ label: tr.value.checklist.renomear, icon: 'i-lucide-pencil', onSelect: () => renomear(c) }],
  [{ label: tr.value.checklist.excluirChecklist, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => excluirChecklist(c) }],
]

/* Linhas */
function alternarLinha(l: LinhaDeChecklist, v: boolean | 'indeterminate') {
  if (l.subtarefa) return
  l.feito = v === true
}
const editandoLinha = ref<string | null>(null)
const textoEmEdicao = ref('')
function editarLinha(l: LinhaDeChecklist) {
  if (props.somenteLeitura || l.subtarefa) return
  editandoLinha.value = l.id
  textoEmEdicao.value = l.texto
}
function salvarLinha(l: LinhaDeChecklist) {
  if (textoEmEdicao.value.trim()) l.texto = textoEmEdicao.value.trim()
  editandoLinha.value = null
}
function excluirLinha(c: Checklist, l: LinhaDeChecklist) {
  const i = c.linhas.indexOf(l)
  c.linhas.splice(i, 1)
  toast.add({ title: tr.value.toasts.itemExcluido, icon: 'i-lucide-trash-2', duration: 4000, actions: [{ label: tr.value.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { c.linhas.splice(i, 0, l) } }] })
}
function converterLinha(l: LinhaDeChecklist) {
  const sub = novaTarefa(props.tarefas, props.x, l.texto, { mae: props.x.tarefa.id }, l.responsavel)
  if (l.feito) sub.tarefa.status = 'completed'
  l.subtarefa = sub.tarefa.id
  toast.add({ title: tr.value.toasts.convertida(l.texto), icon: 'i-lucide-git-branch', color: 'success', duration: 3000 })
}
const menuDaLinha = (c: Checklist, l: LinhaDeChecklist): DropdownMenuItem[][] => [
  [{ label: tr.value.checklist.converter, icon: 'i-lucide-git-branch', disabled: !!l.subtarefa || !!props.x.mae, onSelect: () => converterLinha(l) }],
  [{ label: tr.value.checklist.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => excluirLinha(c, l) }],
]
const opcoesDeResponsavel = (l: LinhaDeChecklist): DropdownMenuItem[] => [
  { label: tr.value.checklist.semResponsavel, icon: 'i-lucide-user-x', onSelect: () => { l.responsavel = undefined } },
  ...props.pessoas.map(p => ({ label: p.nome, avatar: { text: p.iniciais, alt: p.nome }, onSelect: () => { l.responsavel = p.id } })),
]

/* Arrastar para reordenar dentro da checklist, com a API nativa do navegador. */
const arrastando = ref<{ c: string, i: number } | null>(null)
const sobre = ref<{ c: string, i: number } | null>(null)
function soltar(c: Checklist, i: number) {
  const de = arrastando.value
  if (!de || de.c !== c.id || de.i === i) return limparArraste()
  const [l] = c.linhas.splice(de.i, 1)
  c.linhas.splice(i, 0, l!)
  limparArraste()
}
function limparArraste() {
  arrastando.value = null
  sobre.value = null
}
function moverComTeclado(c: Checklist, i: number, d: -1 | 1) {
  const j = i + d
  if (j < 0 || j >= c.linhas.length) return
  const [l] = c.linhas.splice(i, 1)
  c.linhas.splice(j, 0, l!)
}
const ehSobre = (c: Checklist, i: number) => sobre.value?.c === c.id && sobre.value.i === i && !(arrastando.value?.c === c.id && arrastando.value.i === i)
const ehArrastada = (c: Checklist, i: number) => arrastando.value?.c === c.id && arrastando.value.i === i

/* ---------- relacionar: item, tarefa e dependência ---------- */
const bloqueadaPor = computed(() => props.x.bloqueadaPor.map(id => porId(props.tarefas, id)).filter((y): y is TarefaDoItem => !!y))
const bloqueadas = computed(() => bloqueia(props.tarefas, props.x))
const relacionadas = computed(() => relacionadasDe(props.tarefas, props.x))
const itensVinculados = computed(() => props.x.itens.map(r => props.itens.find(i => i.reference === r)).filter((i): i is ItemVinculavel => !!i))
const temRelacoes = computed(() => !!(bloqueadaPor.value.length || bloqueadas.value.length || relacionadas.value.length || itensVinculados.value.length))

const relacionarAberto = ref(false)
type Modo = 'tarefa' | 'bloqueia' | 'bloqueadaPor'
/** Fora da lista: ela mesma, e o que já está ligado daquele jeito. */
function candidatas(modo: Modo) {
  const x = props.x
  return props.tarefas.filter((y) => {
    if (y === x) return false
    if (modo === 'tarefa') return !relacionadas.value.includes(y)
    if (modo === 'bloqueia') return !y.bloqueadaPor.includes(x.tarefa.id) && !x.bloqueadaPor.includes(y.tarefa.id)
    return !x.bloqueadaPor.includes(y.tarefa.id) && !y.bloqueadaPor.includes(x.tarefa.id) && y.mae !== x.tarefa.id
  })
}
function ligar(modo: Modo, y: TarefaDoItem) {
  const x = props.x
  if (modo === 'tarefa') x.relacionadas.push(y.tarefa.id)
  else if (modo === 'bloqueia') y.bloqueadaPor.push(x.tarefa.id)
  else x.bloqueadaPor.push(y.tarefa.id)
  relacionarAberto.value = false
  expandir('relacoes')
  toast.add({ title: modo === 'tarefa' ? tr.value.toasts.relacionada(y.tarefa.name) : tr.value.toasts.bloqueio(y.tarefa.name), icon: modo === 'tarefa' ? 'i-lucide-link-2' : 'i-lucide-lock', color: 'success', duration: 2500 })
}
function vincularItem(i: ItemVinculavel) {
  props.x.itens.push(i.reference)
  relacionarAberto.value = false
  expandir('relacoes')
  toast.add({ title: tr.value.toasts.itemVinculado(i.nome), icon: 'i-lucide-file-text', color: 'success', duration: 2500 })
}
const opcoesDeTarefa = (modo: Modo) => candidatas(modo).map(y => ({
  label: y.tarefa.name,
  suffix: props.t.tarefas.colunas[y.tarefa.status],
  icon: iconeDoStatus[y.tarefa.status],
  cor: corDoStatus[y.tarefa.status],
  onSelect: () => ligar(modo, y),
}))
const gruposDeRelacao = computed<CommandPaletteGroup[]>(() => [
  {
    id: 'vincular',
    items: [
      {
        label: tr.value.relacionar.item,
        icon: 'i-lucide-file-text',
        cor: 'text-primary',
        placeholder: tr.value.relacionar.buscarItem,
        children: props.itens.filter(i => !props.x.itens.includes(i.reference)).map(i => ({
          label: i.nome,
          suffix: i.categoria,
          description: i.reference,
          icon: 'i-lucide-file-text',
          cor: 'text-muted',
          onSelect: () => vincularItem(i),
        })),
      },
      { label: tr.value.relacionar.tarefa, icon: 'i-lucide-clipboard-check', cor: 'text-primary', placeholder: tr.value.relacionar.buscarTarefa, children: opcoesDeTarefa('tarefa') },
    ],
  },
  {
    id: 'dependencia',
    label: tr.value.relacionar.dependencia,
    items: [
      { label: tr.value.relacionar.bloqueia, icon: 'i-lucide-circle-minus', cor: 'text-error', placeholder: tr.value.relacionar.buscarTarefa, children: opcoesDeTarefa('bloqueia') },
      { label: tr.value.relacionar.bloqueadaPor, icon: 'i-lucide-triangle-alert', cor: 'text-warning', placeholder: tr.value.relacionar.buscarTarefa, children: opcoesDeTarefa('bloqueadaPor') },
    ],
  },
])
const removerBloqueio = (id: number) => props.x.bloqueadaPor.splice(props.x.bloqueadaPor.indexOf(id), 1)
const removerBloqueada = (y: TarefaDoItem) => y.bloqueadaPor.splice(y.bloqueadaPor.indexOf(props.x.tarefa.id), 1)
const removerItem = (r: string) => props.x.itens.splice(props.x.itens.indexOf(r), 1)
function abrirItem(i: ItemVinculavel) {
  toast.add({ title: tr.value.relacoes.itemFora(i.reference), icon: 'i-lucide-info', duration: 3000 })
}

/* ---------- anexos ---------- */
const arquivo = ref<HTMLInputElement | null>(null)
let seqAnexo = 0
function anexar(e: Event) {
  const campo = e.target as HTMLInputElement
  const arquivos = [...(campo.files ?? [])]
  for (const f of arquivos) props.x.anexos.push({ id: `ta-n${++seqAnexo}`, nome: f.name, tamanho: f.size, imagem: f.type.startsWith('image/') })
  campo.value = ''
  if (!arquivos.length) return
  expandir('anexos')
  toast.add({ title: tr.value.toasts.anexados(arquivos.length), icon: 'i-lucide-paperclip', color: 'success', duration: 2500 })
}
const numero = (n: number) => new Intl.NumberFormat(props.t.locale, { maximumFractionDigits: 1 }).format(n)
const tamanho = (b: number) => b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${numero(b / 1048576)} MB`
const removerAnexo = (id: string) => props.x.anexos.splice(props.x.anexos.findIndex(a => a.id === id), 1)

/* ---------- as ações, do jeito do ClickUp ---------- */
const vazia = computed(() => semSecoes(props.tarefas, props.x) && !criandoSub.value)
const acoes = computed(() => [
  ...(props.x.mae ? [] : [{ id: 'subtarefa', label: tr.value.acoes.subtarefa, icon: 'i-lucide-git-branch', agir: abrirSubtarefa }]),
  { id: 'relacionar', label: tr.value.acoes.relacionar, icon: 'i-lucide-link-2', agir: () => { relacionarAberto.value = true } },
  { id: 'checklist', label: tr.value.acoes.checklist, icon: 'i-lucide-list-checks', agir: criarChecklist },
  { id: 'anexar', label: tr.value.acoes.anexar, icon: 'i-lucide-paperclip', agir: () => arquivo.value?.click() },
])
const botaoDaAcao = (a: { label: string, icon: string }) => ({
  label: a.label,
  icon: a.icon,
  color: 'neutral' as const,
  variant: vazia.value ? 'ghost' as const : 'outline' as const,
  size: 'sm' as const,
  block: vazia.value,
  class: vazia.value ? 'justify-start' : '',
})

/* ---------- mencionada em ---------- */
const minhasMencoes = computed(() => props.mencoes.filter(m => m.alvo === `tarefa-${props.x.tarefa.id}`))
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- AÇÕES: a lista do estado vazio, ou a fileira de botões -->
    <section
      v-if="!somenteLeitura"
      :aria-label="tr.acoes.rotulo"
      :class="vazia ? 'rounded-lg border border-dashed border-accented p-2' : ''"
    >
      <p v-if="vazia" class="px-2.5 pb-1.5 pt-1 text-sm text-muted">{{ tr.acoes.vazia }}</p>
      <div :class="vazia ? 'flex flex-col' : 'flex flex-wrap gap-2'">
        <template v-for="a in acoes" :key="a.id">
          <UPopover
            v-if="a.id === 'relacionar'"
            v-model:open="relacionarAberto"
            :content="{ align: 'start', side: 'bottom', sideOffset: 6, collisionPadding: 12 }"
            :ui="{ content: 'w-96 max-w-[calc(100vw-2rem)]' }"
          >
            <UButton v-bind="botaoDaAcao(a)" />
            <template #content>
              <UCommandPalette :groups="gruposDeRelacao" :placeholder="tr.relacionar.titulo" :ui="{ content: 'max-h-72' }" class="h-auto">
                <template #item-leading="{ item }">
                  <UIcon :name="item.icon" class="size-4 shrink-0" :class="item.cor" />
                </template>
                <template #empty>
                  <p class="px-3 py-4 text-center text-sm text-muted">{{ tr.relacionar.nenhum }}</p>
                </template>
              </UCommandPalette>
            </template>
          </UPopover>
          <UButton v-else v-bind="botaoDaAcao(a)" @click="a.agir" />
        </template>
      </div>
      <input ref="arquivo" type="file" multiple class="hidden" tabindex="-1" aria-hidden="true" @change="anexar">
    </section>

    <!-- SUBTAREFAS (só na tarefa-mãe: 1 nível) -->
    <section v-if="!x.mae && (subs.length || criandoSub)" class="flex flex-col gap-2 rounded-lg border border-default p-4 [animation:entrada_.25s_ease-out_both]" :aria-label="tr.subtarefas.titulo">
      <header class="flex flex-wrap items-center gap-2">
        <button type="button" class="flex items-center gap-1.5 rounded text-left focus-visible:outline-2 focus-visible:outline-primary" :aria-expanded="aberta('subtarefas')" :aria-label="aberta('subtarefas') ? tr.subtarefas.recolher : tr.subtarefas.expandir" @click="alternarSecao('subtarefas')">
          <UIcon name="i-lucide-chevron-down" class="size-4 text-muted transition-transform duration-200" :class="aberta('subtarefas') ? '' : '-rotate-90'" />
          <h3 class="text-sm font-medium text-highlighted">{{ tr.subtarefas.titulo }}</h3>
        </button>
        <span v-if="subs.length" class="text-xs tabular-nums" :class="concluidas === subs.length ? 'text-success' : 'text-muted'">{{ tr.subtarefas.contagem(concluidas, subs.length) }}</span>
        <UBadge v-if="somaDePontos" :label="tr.subtarefas.somaDePontos(somaDePontos)" icon="i-lucide-hash" color="neutral" variant="soft" size="sm" class="ml-auto tabular-nums" />
      </header>

      <div v-show="aberta('subtarefas')" class="flex flex-col gap-2">
        <ul v-if="subs.length" class="-mx-2 flex flex-col">
          <li v-for="s in subs" :key="s.tarefa.id" class="group/sub flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-elevated/60 [animation:entrada_.25s_ease-out_both]">
            <UTooltip :text="t.tarefas.colunas[s.tarefa.status]">
              <button
                type="button"
                class="flex shrink-0 rounded-full transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
                :aria-label="t.tarefas.colunas[s.tarefa.status]"
                :aria-pressed="concluida(s)"
                @click="alternarSub(s)"
              >
                <UIcon :name="iconeDoStatus[s.tarefa.status]" class="size-4" :class="corDoStatus[s.tarefa.status]" />
              </button>
            </UTooltip>
            <button type="button" class="min-w-0 flex-1 truncate text-left text-sm hover:underline" :class="concluida(s) ? 'text-muted line-through' : 'text-highlighted'" @click="emit('abrir', s)">
              {{ s.tarefa.name }}
            </button>
            <UIcon v-if="s.tarefa.priority === 'high' || s.tarefa.priority === 'urgent'" name="i-lucide-flag" class="size-3.5 shrink-0" :class="corDaBandeira[s.tarefa.priority]" :aria-label="t.prioridades[s.tarefa.priority]" />
            <UBadge v-if="s.tarefa.points" :label="String(s.tarefa.points)" icon="i-lucide-hash" color="neutral" variant="soft" size="sm" class="shrink-0 tabular-nums" :aria-label="tr.pontos.n(Number(s.tarefa.points))" />
            <span v-if="s.tarefa.due_date" class="shrink-0 text-xs text-muted">{{ t.data(s.tarefa.due_date) }}</span>
            <UAvatar v-if="pessoa(s.tarefa.assigned_to)" :text="pessoa(s.tarefa.assigned_to)!.iniciais" :alt="pessoa(s.tarefa.assigned_to)!.nome" size="2xs" class="shrink-0" />
            <UTooltip v-if="!somenteLeitura" :text="tr.subtarefas.desvincular">
              <UButton icon="i-lucide-unlink" color="neutral" variant="ghost" size="xs" class="shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/sub:opacity-100" :aria-label="tr.subtarefas.desvincular" @click="desvincular(s)" />
            </UTooltip>
          </li>
        </ul>

        <!-- A linha de criação, como no ClickUp -->
        <div
          v-if="criandoSub"
          class="flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-md border border-primary/60 px-2 py-1.5 ring-2 ring-primary/15 [animation:entrada_.2s_ease-out_both]"
          @keydown.esc.stop="cancelarSub"
        >
          <UIcon name="i-lucide-circle-dashed" class="size-4 shrink-0 text-dimmed" />
          <input
            id="nova-subtarefa"
            v-model="rascunho.nome"
            type="text"
            class="min-w-40 flex-1 bg-transparent py-0.5 text-sm text-highlighted outline-none placeholder:text-dimmed"
            :placeholder="tr.subtarefas.placeholder"
            :aria-label="tr.subtarefas.placeholder"
            @keydown.enter.prevent="salvarSub"
          >
          <div class="flex items-center gap-0.5">
            <UDropdownMenu :items="responsaveisDoRascunho" :content="{ align: 'end' }">
              <UButton
                v-if="pessoa(rascunho.responsavel)"
                color="neutral"
                variant="ghost"
                size="xs"
                class="rounded-full"
                :aria-label="`${tr.subtarefas.responsavel}: ${pessoa(rascunho.responsavel)!.nome}`"
              >
                <UAvatar :text="pessoa(rascunho.responsavel)!.iniciais" :alt="pessoa(rascunho.responsavel)!.nome" size="2xs" />
              </UButton>
              <UButton v-else icon="i-lucide-user-plus" color="neutral" variant="ghost" size="xs" :aria-label="tr.subtarefas.responsavel" />
            </UDropdownMenu>
            <UPopover :content="{ align: 'end' }">
              <UButton
                :label="rascunho.data ? t.data(new Date(`${rascunho.data}T18:00:00`)) : undefined"
                icon="i-lucide-calendar"
                color="neutral"
                :variant="rascunho.data ? 'soft' : 'ghost'"
                size="xs"
                :aria-label="tr.subtarefas.dataLimite"
              />
              <template #content>
                <div class="flex flex-col gap-2 p-2">
                  <p class="text-xs font-medium text-muted">{{ tr.subtarefas.dataLimite }}</p>
                  <UInput v-model="rascunho.data" type="date" size="sm" :aria-label="tr.subtarefas.dataLimite" />
                  <UButton v-if="rascunho.data" :label="tr.subtarefas.tirarData" icon="i-lucide-x" color="neutral" variant="outline" size="xs" @click="rascunho.data = ''" />
                </div>
              </template>
            </UPopover>
            <UDropdownMenu :items="prioridadesDoRascunho" :content="{ align: 'end' }">
              <UButton
                :label="rascunho.prioridade !== 'normal' ? t.prioridades[rascunho.prioridade] : undefined"
                icon="i-lucide-flag"
                color="neutral"
                :variant="rascunho.prioridade !== 'normal' ? 'soft' : 'ghost'"
                size="xs"
                :ui="{ leadingIcon: corDaBandeira[rascunho.prioridade] }"
                :aria-label="`${tr.subtarefas.prioridade}: ${t.prioridades[rascunho.prioridade]}`"
              />
            </UDropdownMenu>
            <UPopover :content="{ align: 'end' }">
              <UButton
                :label="rascunho.pontos ? String(rascunho.pontos) : undefined"
                icon="i-lucide-hash"
                color="neutral"
                :variant="rascunho.pontos ? 'soft' : 'ghost'"
                size="xs"
                class="tabular-nums"
                :aria-label="tr.subtarefas.pontos"
              />
              <template #content>
                <div class="flex w-48 flex-col gap-1.5 p-2">
                  <p class="text-xs font-medium text-muted">{{ tr.pontos.rotulo }}</p>
                  <UInputNumber v-model="rascunho.pontos" :min="0" size="sm" :aria-label="tr.pontos.rotulo" />
                  <p class="text-xs text-dimmed">{{ tr.pontos.ajuda }}</p>
                </div>
              </template>
            </UPopover>
          </div>
          <div class="ml-auto flex items-center gap-1.5">
            <UButton :label="tr.subtarefas.cancelar" color="neutral" variant="ghost" size="xs" @click="cancelarSub" />
            <UButton :label="tr.subtarefas.salvar" color="neutral" variant="solid" size="xs" @click="salvarSub">
              <template #trailing>
                <UKbd value="enter" size="sm" color="neutral" variant="subtle" />
              </template>
            </UButton>
          </div>
        </div>

        <div v-else-if="!somenteLeitura" class="-mx-1 flex flex-wrap items-center gap-2">
          <UButton :label="tr.subtarefas.adicionar" icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" @click="abrirSubtarefa" />
          <!-- Sem v-model: a escolha age e o campo volta ao placeholder -->
          <USelectMenu
            :key="`vincular-${limpar}`"
            :model-value="undefined"
            :items="vinculaveis"
            value-key="value"
            :placeholder="tr.subtarefas.vincular"
            :search-input="{ placeholder: tr.subtarefas.vincularPlaceholder }"
            icon="i-lucide-link"
            size="sm"
            variant="ghost"
            class="w-56"
            :ui="{ content: 'min-w-72' }"
            @update:model-value="vincular"
          />
        </div>
      </div>
    </section>

    <!-- CHECKLISTS -->
    <section v-if="x.checklists.length" class="flex flex-col gap-3 rounded-lg border border-default p-4 [animation:entrada_.25s_ease-out_both]" :aria-label="tr.checklist.titulo">
      <header class="flex items-center gap-2">
        <button type="button" class="flex items-center gap-1.5 rounded text-left focus-visible:outline-2 focus-visible:outline-primary" :aria-expanded="aberta('checklists')" :aria-label="aberta('checklists') ? tr.subtarefas.recolher : tr.subtarefas.expandir" @click="alternarSecao('checklists')">
          <UIcon name="i-lucide-chevron-down" class="size-4 text-muted transition-transform duration-200" :class="aberta('checklists') ? '' : '-rotate-90'" />
          <h3 class="text-sm font-medium text-highlighted">{{ tr.checklist.titulo }}</h3>
        </button>
        <span v-if="totalDeLinhas" class="text-xs tabular-nums" :class="feitosNoTotal === totalDeLinhas ? 'text-success' : 'text-muted'">{{ tr.checklist.contagem(feitosNoTotal, totalDeLinhas) }}</span>
        <UTooltip :text="tr.checklist.diferenca">
          <UIcon name="i-lucide-circle-help" class="ml-auto size-4 text-dimmed" />
        </UTooltip>
      </header>

      <div v-show="aberta('checklists')" class="flex flex-col gap-4">
        <div v-for="c in x.checklists" :key="c.id" class="flex flex-col gap-1">
          <!-- Nome da checklist -->
          <div class="group/nome flex items-center gap-2">
            <UInput
              v-if="editandoNome === c.id"
              :id="`nome-${c.id}`"
              v-model="nomeEmEdicao"
              size="xs"
              class="w-56"
              :aria-label="tr.checklist.nome"
              @keydown.enter.prevent="salvarNome(c)"
              @keydown.esc.stop="editandoNome = null"
              @blur="salvarNome(c)"
            />
            <button
              v-else
              type="button"
              class="rounded-md bg-elevated px-2 py-0.5 text-xs font-medium text-highlighted transition-colors hover:bg-accented"
              :aria-label="`${tr.checklist.renomear}: ${c.nome}`"
              :disabled="somenteLeitura"
              @click="renomear(c)"
            >{{ c.nome }}</button>
            <span v-if="c.linhas.length" class="text-xs tabular-nums" :class="feitosDe(c) === c.linhas.length ? 'text-success' : 'text-muted'">{{ tr.checklist.contagem(feitosDe(c), c.linhas.length) }}</span>
            <UDropdownMenu v-if="!somenteLeitura" :items="menuDaChecklist(c)" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" class="ml-auto opacity-0 transition-opacity focus-visible:opacity-100 group-hover/nome:opacity-100" :aria-label="tr.checklist.opcoes" />
            </UDropdownMenu>
          </div>

          <TransitionGroup tag="ul" class="-mx-2 flex flex-col" move-class="transition-transform duration-200 ease-out">
            <li
              v-for="(l, i) in c.linhas"
              :key="l.id"
              class="group/linha flex items-center gap-2 rounded-md px-2 py-1 transition-colors"
              :class="[ehSobre(c, i) ? 'bg-primary/10' : 'hover:bg-elevated/60', ehArrastada(c, i) ? 'opacity-50' : '']"
              :draggable="!somenteLeitura && editandoLinha !== l.id"
              @dragstart="arrastando = { c: c.id, i }"
              @dragover.prevent="sobre = { c: c.id, i }"
              @drop.prevent="soltar(c, i)"
              @dragend="limparArraste"
            >
              <button
                v-if="!somenteLeitura"
                type="button"
                class="flex cursor-grab text-dimmed opacity-0 transition-opacity focus-visible:opacity-100 group-hover/linha:opacity-100"
                :aria-label="tr.checklist.arrastar"
                @keydown.up.prevent="moverComTeclado(c, i, -1)"
                @keydown.down.prevent="moverComTeclado(c, i, 1)"
              >
                <UIcon name="i-lucide-grip-vertical" class="size-4" />
              </button>

              <UTooltip :text="l.subtarefa ? tr.checklist.ligada(porId(tarefas, l.subtarefa)?.tarefa.name ?? '') : undefined" :disabled="!l.subtarefa">
                <UCheckbox
                  :model-value="feitoDaLinha(tarefas, l)"
                  :disabled="somenteLeitura || !!l.subtarefa"
                  :aria-label="l.texto"
                  @update:model-value="(v: boolean | 'indeterminate') => alternarLinha(l, v)"
                />
              </UTooltip>

              <UInput
                v-if="editandoLinha === l.id"
                v-model="textoEmEdicao"
                size="xs"
                class="flex-1"
                autofocus
                :aria-label="tr.checklist.editar"
                @keydown.enter.prevent="salvarLinha(l)"
                @keydown.esc.stop="editandoLinha = null"
                @blur="salvarLinha(l)"
              />
              <button
                v-else
                type="button"
                class="min-w-0 flex-1 truncate text-left text-sm"
                :class="feitoDaLinha(tarefas, l) ? 'text-muted line-through decoration-dimmed' : 'text-default'"
                :aria-label="tr.checklist.editar"
                @click="editarLinha(l)"
              >{{ l.texto }}</button>

              <!-- A linha que virou subtarefa -->
              <UButton
                v-if="l.subtarefa && porId(tarefas, l.subtarefa)"
                :label="tr.subtarefas.titulo.slice(0, -1)"
                icon="i-lucide-git-branch"
                color="neutral"
                variant="soft"
                size="xs"
                class="shrink-0"
                :aria-label="porId(tarefas, l.subtarefa)!.tarefa.name"
                @click="emit('abrir', porId(tarefas, l.subtarefa)!)"
              />

              <UDropdownMenu :items="opcoesDeResponsavel(l)" :disabled="somenteLeitura" :content="{ align: 'end' }">
                <UButton
                  v-if="pessoa(l.responsavel)"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="shrink-0 rounded-full p-0"
                  :aria-label="`${tr.checklist.responsavel}: ${pessoa(l.responsavel)!.nome}`"
                >
                  <UAvatar :text="pessoa(l.responsavel)!.iniciais" :alt="pessoa(l.responsavel)!.nome" size="2xs" />
                </UButton>
                <UButton
                  v-else
                  icon="i-lucide-user-plus"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/linha:opacity-100"
                  :aria-label="tr.checklist.responsavel"
                />
              </UDropdownMenu>
              <UDropdownMenu v-if="!somenteLeitura" :items="menuDaLinha(c, l)" :content="{ align: 'end' }">
                <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" class="shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/linha:opacity-100" :aria-label="tr.checklist.maisAcoes" />
              </UDropdownMenu>
            </li>
          </TransitionGroup>

          <!-- Adicionar item, com o responsável na mesma linha -->
          <div v-if="!somenteLeitura && linhasNovas[c.id]" class="flex items-center gap-1">
            <UInput
              :id="`nova-linha-${c.id}`"
              v-model="linhasNovas[c.id].texto"
              icon="i-lucide-plus"
              :placeholder="tr.checklist.adicionar"
              size="sm"
              variant="ghost"
              class="flex-1"
              :aria-label="tr.checklist.adicionar"
              @keydown.enter.prevent="adicionarLinha(c)"
            />
            <UDropdownMenu :items="responsaveisDoNovo(c)" :content="{ align: 'end' }">
              <UButton
                v-if="pessoa(linhasNovas[c.id].responsavel)"
                color="neutral"
                variant="ghost"
                size="xs"
                class="shrink-0 rounded-full"
                :aria-label="`${tr.checklist.responsavelDoNovo}: ${pessoa(linhasNovas[c.id].responsavel)!.nome}`"
              >
                <UAvatar :text="pessoa(linhasNovas[c.id].responsavel)!.iniciais" :alt="pessoa(linhasNovas[c.id].responsavel)!.nome" size="2xs" />
              </UButton>
              <UButton v-else icon="i-lucide-user-plus" color="neutral" variant="ghost" size="xs" class="shrink-0" :aria-label="tr.checklist.responsavelDoNovo" />
            </UDropdownMenu>
          </div>
        </div>

        <UButton v-if="!somenteLeitura" :label="tr.checklist.adicionarChecklist" icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" class="-mx-1 self-start" @click="criarChecklist" />
      </div>
    </section>

    <!-- RELACIONAMENTOS: itens, tarefas e dependências -->
    <section v-if="temRelacoes" class="flex flex-col gap-3 rounded-lg border border-default p-4 [animation:entrada_.25s_ease-out_both]" :aria-label="tr.relacoes.titulo">
      <header class="flex items-center gap-2">
        <button type="button" class="flex items-center gap-1.5 rounded text-left focus-visible:outline-2 focus-visible:outline-primary" :aria-expanded="aberta('relacoes')" :aria-label="aberta('relacoes') ? tr.subtarefas.recolher : tr.subtarefas.expandir" @click="alternarSecao('relacoes')">
          <UIcon name="i-lucide-chevron-down" class="size-4 text-muted transition-transform duration-200" :class="aberta('relacoes') ? '' : '-rotate-90'" />
          <h3 class="text-sm font-medium text-highlighted">{{ tr.relacoes.titulo }}</h3>
        </button>
      </header>
      <div v-show="aberta('relacoes')" class="flex flex-col gap-3">
        <UAlert
          v-if="bloqueadaPor.some(y => !concluida(y))"
          :description="tr.relacoes.aviso(bloqueadaPor.find(y => !concluida(y))!.tarefa.name)"
          icon="i-lucide-lock"
          color="error"
          variant="subtle"
          orientation="horizontal"
          class="py-2"
        />
        <dl class="grid gap-3 text-sm sm:grid-cols-[9rem_1fr]">
          <template v-if="bloqueadaPor.length">
            <dt class="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-muted"><UIcon name="i-lucide-triangle-alert" class="size-3.5 text-warning" />{{ tr.relacoes.bloqueadaPor }}</dt>
            <dd class="flex flex-wrap items-center gap-1.5">
              <span v-for="y in bloqueadaPor" :key="y.tarefa.id" class="inline-flex items-center gap-1 rounded-md border border-default py-0.5 pl-1.5 pr-0.5 text-xs">
                <UIcon :name="iconeDoStatus[y.tarefa.status]" class="size-3.5" :class="corDoStatus[y.tarefa.status]" />
                <button type="button" class="max-w-56 truncate hover:underline" :class="concluida(y) ? 'text-muted line-through' : 'text-highlighted'" @click="emit('abrir', y)">{{ y.tarefa.name }}</button>
                <UButton v-if="!somenteLeitura" icon="i-lucide-x" color="neutral" variant="ghost" size="xs" class="p-0.5" :aria-label="tr.relacoes.remover(y.tarefa.name)" @click="removerBloqueio(y.tarefa.id)" />
              </span>
            </dd>
          </template>
          <template v-if="bloqueadas.length">
            <dt class="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-muted"><UIcon name="i-lucide-circle-minus" class="size-3.5 text-error" />{{ tr.relacoes.bloqueia }}</dt>
            <dd class="flex flex-wrap items-center gap-1.5">
              <span v-for="y in bloqueadas" :key="y.tarefa.id" class="inline-flex items-center gap-1 rounded-md border border-default py-0.5 pl-1.5 pr-0.5 text-xs">
                <UIcon :name="iconeDoStatus[y.tarefa.status]" class="size-3.5" :class="corDoStatus[y.tarefa.status]" />
                <button type="button" class="max-w-56 truncate text-highlighted hover:underline" @click="emit('abrir', y)">{{ y.tarefa.name }}</button>
                <UButton v-if="!somenteLeitura" icon="i-lucide-x" color="neutral" variant="ghost" size="xs" class="p-0.5" :aria-label="tr.relacoes.remover(y.tarefa.name)" @click="removerBloqueada(y)" />
              </span>
            </dd>
          </template>
          <template v-if="relacionadas.length">
            <dt class="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-muted"><UIcon name="i-lucide-clipboard-check" class="size-3.5" />{{ tr.relacoes.tarefas }}</dt>
            <dd class="flex flex-wrap items-center gap-1.5">
              <span v-for="y in relacionadas" :key="y.tarefa.id" class="inline-flex items-center gap-1 rounded-md border border-default py-0.5 pl-1.5 pr-0.5 text-xs">
                <UIcon :name="iconeDoStatus[y.tarefa.status]" class="size-3.5" :class="corDoStatus[y.tarefa.status]" />
                <button type="button" class="max-w-56 truncate hover:underline" :class="concluida(y) ? 'text-muted line-through' : 'text-highlighted'" @click="emit('abrir', y)">{{ y.tarefa.name }}</button>
                <UButton v-if="!somenteLeitura" icon="i-lucide-x" color="neutral" variant="ghost" size="xs" class="p-0.5" :aria-label="tr.relacoes.remover(y.tarefa.name)" @click="desrelacionar(tarefas, x, y)" />
              </span>
            </dd>
          </template>
          <template v-if="itensVinculados.length">
            <dt class="flex items-center gap-1.5 pt-0.5 text-xs font-medium text-muted"><UIcon name="i-lucide-file-text" class="size-3.5" />{{ tr.relacoes.itens }}</dt>
            <dd class="flex flex-wrap items-center gap-1.5">
              <span v-for="i in itensVinculados" :key="i.reference" class="inline-flex items-center gap-1.5 rounded-md border border-default py-0.5 pl-1.5 pr-0.5 text-xs">
                <span class="rounded bg-primary/10 px-1 font-mono text-[10px] text-primary">{{ i.categoria }}</span>
                <button type="button" class="max-w-56 truncate text-highlighted hover:underline" @click="abrirItem(i)">{{ i.nome }}</button>
                <UButton v-if="!somenteLeitura" icon="i-lucide-x" color="neutral" variant="ghost" size="xs" class="p-0.5" :aria-label="tr.relacoes.remover(i.nome)" @click="removerItem(i.reference)" />
              </span>
            </dd>
          </template>
        </dl>
      </div>
    </section>

    <!-- ANEXOS -->
    <section v-if="x.anexos.length" class="flex flex-col gap-2 rounded-lg border border-default p-4 [animation:entrada_.25s_ease-out_both]" :aria-label="tr.anexos.titulo">
      <header class="flex items-center gap-2">
        <button type="button" class="flex items-center gap-1.5 rounded text-left focus-visible:outline-2 focus-visible:outline-primary" :aria-expanded="aberta('anexos')" :aria-label="aberta('anexos') ? tr.subtarefas.recolher : tr.subtarefas.expandir" @click="alternarSecao('anexos')">
          <UIcon name="i-lucide-chevron-down" class="size-4 text-muted transition-transform duration-200" :class="aberta('anexos') ? '' : '-rotate-90'" />
          <h3 class="text-sm font-medium text-highlighted">{{ tr.anexos.titulo }}</h3>
        </button>
        <span class="text-xs tabular-nums text-muted">{{ x.anexos.length }}</span>
      </header>
      <ul v-show="aberta('anexos')" class="grid gap-2 sm:grid-cols-2">
        <li v-for="a in x.anexos" :key="a.id" class="group/anexo flex items-center gap-2 rounded-md border border-default px-2.5 py-2 [animation:entrada_.25s_ease-out_both]">
          <span class="flex size-8 shrink-0 items-center justify-center rounded bg-elevated">
            <UIcon :name="a.imagem ? 'i-lucide-image' : 'i-lucide-file'" class="size-4 text-muted" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm text-highlighted">{{ a.nome }}</span>
            <span class="block text-xs text-muted">{{ tamanho(a.tamanho) }}</span>
          </span>
          <UButton v-if="!somenteLeitura" icon="i-lucide-x" color="neutral" variant="ghost" size="xs" class="shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/anexo:opacity-100" :aria-label="tr.anexos.remover(a.nome)" @click="removerAnexo(a.id)" />
        </li>
      </ul>
    </section>

    <!-- MENCIONADA EM -->
    <section v-if="minhasMencoes.length" class="flex flex-col gap-2 rounded-lg border border-default p-4" :aria-label="tr.mencionadaEm.titulo">
      <header class="flex items-center gap-2">
        <span class="flex size-6 items-center justify-center rounded bg-elevated"><UIcon name="i-lucide-hash" class="size-3.5" /></span>
        <h3 class="text-sm font-medium text-highlighted">{{ tr.mencionadaEm.titulo }}</h3>
      </header>
      <ul class="flex flex-col gap-1.5">
        <li v-for="(m, i) in minhasMencoes" :key="i" class="flex items-center gap-2 text-sm">
          <UIcon name="i-lucide-list-checks" class="size-4 shrink-0 text-primary" />
          <span class="font-medium text-highlighted">{{ t.novaPasta.tipos.apontamentos }} {{ m.onde }}</span>
          <span class="text-xs text-muted">{{ tr.mencionadaEm.linha(pessoa(m.quem)?.nome ?? '', t.dataHora(m.quando)) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
