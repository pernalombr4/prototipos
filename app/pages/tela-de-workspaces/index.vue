<script setup lang="ts">
import {
  workspaces,
  workspaceUnico,
  usuario,
  corDoPapel,
  etiquetasIniciais,
  type Workspace,
  type Etiqueta,
} from './mocks'
import { textos } from './textos'
import { type EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { DropdownMenuItem } from '@nuxt/ui'
import ModalCriarWorkspace from './_ModalCriarWorkspace.vue'

// O contexto do protótipo vem dos próprios .md desta pasta, como texto.
// Fonte única: editar o .md muda o painel, sem duplicar conteúdo.
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Tela de entrada (Workspaces)',
  descricao: 'Fazer a pessoa entender que é uma tela de escolha, e não o lugar onde se abre chamado.',
  status: 'em-revisao',
  atualizado: '2026-10-14',
  tela: 'Proposta',
})

const toast = useToast()
const t = useTextos(textos)

/** Tempo relativo no idioma corrente. */
function tempoRelativo(minutos: number | null): string {
  if (minutos === null) return t.value.nuncaEntrou
  if (minutos < 60) return t.value.haMinutos(minutos)
  const horas = Math.round(minutos / 60)
  if (horas < 24) return t.value.haHoras(horas)
  const dias = Math.round(horas / 24)
  if (dias < 30) return t.value.haDias(dias)
  return t.value.haMeses(Math.round(dias / 30))
}

/* ------------------------------------------------------------------
   Andaime de protótipo: o seletor de estados do rodapé NÃO é parte da
   proposta. Existe para revisar os cinco estados sem back-end.
------------------------------------------------------------------ */
type Estado = 'normal' | 'unico' | 'carregando' | 'vazio' | 'erro'
const estado = ref<Estado>('normal')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'normal', rotulo: 'Vários workspaces' },
  { valor: 'unico', rotulo: 'Só um (caso do chamado)' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'vazio', rotulo: 'Nenhum' },
  { valor: 'erro', rotulo: 'Erro' },
]

const base = computed<Workspace[]>(() => {
  if (estado.value === 'unico') return workspaceUnico
  if (estado.value === 'vazio') return []
  return workspaces
})

/* ---------------------------- estado da tela ---------------------------- */
const busca = ref('')
const aba = ref('todos')
/** Card é o padrão do produto hoje. Lista é alternativa, nunca substituição. */
const visual = ref<'cards' | 'lista'>('cards')
const convitesRecusados = ref<number[]>([])
const convitesAceitos = ref<number[]>([])
const favoritados = ref<number[]>([])

/* Rodada 17: o que a pessoa decide sobre a própria lista. Tudo em memória. */
/** Workspace que abre direto no login. null = a pessoa escolhe nesta tela. */
const padrao = ref<number | null>(null)
/** Tirados da lista pela pessoa. Continuam acessíveis, e a busca acha. */
const ocultos = ref<number[]>(workspaces.filter(w => w.oculto).map(w => w.id))
/** Rodada 19: o editor de "Ocultos", aberto pela barra ou pelo aviso do fim da lista. */
const editorDeOcultosAberto = ref(false)
const buscaNoEditor = ref('')
/** Workspaces de que a pessoa saiu: deixam de existir para ela. */
const saidos = ref<number[]>([])
/** Etiquetas pessoais: a lista dela e quais cada workspace leva. */
const etiquetas = ref<Etiqueta[]>(etiquetasIniciais.map(e => ({ ...e })))
const etiquetasPorWorkspace = ref<Record<number, string[]>>(
  Object.fromEntries(workspaces.map(w => [w.id, [...w.etiquetas]])),
)

/* Rodada 18: agrupar e ordenar como nas visualizações do ClickUp. */
type Agrupamento = 'nenhum' | 'etiqueta' | 'licenca'
type Ordem = 'acessoRecente' | 'acessoAntigo' | 'criacaoRecente' | 'criacaoAntiga' | 'nome'
const agruparPor = ref<Agrupamento>('nenhum')
const ordenarPor = ref<Ordem>('acessoRecente')
/** Grupos que a pessoa recolheu, pelo id do grupo. */
const recolhidos = ref<string[]>([])

const visiveis = computed(() => base.value.filter(w =>
  !convitesRecusados.value.includes(w.id) && !saidos.value.includes(w.id)))

const pendentes = computed(() =>
  visiveis.value.filter(w => w.convitePendente && !convitesAceitos.value.includes(w.id)))

const disponiveis = computed(() =>
  visiveis.value.filter(w => !w.convitePendente || convitesAceitos.value.includes(w.id)))

function ehFavorito(w: Workspace) {
  return favoritados.value.includes(w.id) ? !w.favorito : w.favorito
}

function estaOculto(w: Workspace) {
  return ocultos.value.includes(w.id)
}

/** Os que aparecem na lista sem busca: tudo o que a pessoa não ocultou. */
const naLista = computed(() => visiveis.value.filter(w => !estaOculto(w)))

const ultimo = computed(() =>
  [...disponiveis.value]
    .filter(w => w.ultimoAcessoMin !== null && !estaOculto(w))
    .sort((a, b) => (a.ultimoAcessoMin ?? 0) - (b.ultimoAcessoMin ?? 0))[0])

/** O bloco do topo: o padrão, se a pessoa escolheu um; senão, o último usado. */
const destaque = computed(() =>
  disponiveis.value.find(w => w.id === padrao.value) ?? ultimo.value)

/** Convite ainda não respondido: o card entra na lista com outro corpo. */
function estaPendente(w: Workspace) {
  return !!w.convitePendente && !convitesAceitos.value.includes(w.id)
}

function etiquetasDe(w: Workspace): Etiqueta[] {
  const ids = etiquetasPorWorkspace.value[w.id] ?? []
  return etiquetas.value.filter(e => ids.includes(e.id))
}

/** Busca sem acento e sem caixa: "juridico" acha "Jurídico". */
function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}

function textoDeBusca(w: Workspace) {
  return normalizar([w.name, w.reference, w.description ?? '', ...etiquetasDe(w).map(e => e.nome)].join(' '))
}

const listados = computed(() => {
  const termo = normalizar(busca.value.trim())
  // O destaque do topo é atalho: o workspace continua na lista (regra 20).
  // Os pendentes também aparecem aqui, como o produto mostra hoje.
  // Oculto sai da lista, mas a busca ainda acha, e "Mostrar" traz de volta.
  let lista = visiveis.value.filter(w => termo || !estaOculto(w))

  if (aba.value === 'favoritos') lista = lista.filter(w => ehFavorito(w))
  if (aba.value === 'recentes') lista = lista.filter(w => w.ultimoAcessoMin !== null)
  if (termo) lista = lista.filter(w => textoDeBusca(w).includes(termo))
  return lista.sort(comparar)
})

/** "Nunca acessado" vai para o fim nas duas ordens de acesso: não é um tempo. */
function comparar(a: Workspace, b: Workspace) {
  const criado = (w: Workspace) => new Date(w.created_at).getTime()
  switch (ordenarPor.value) {
    case 'acessoAntigo':
      return (b.ultimoAcessoMin ?? -1) - (a.ultimoAcessoMin ?? -1)
    case 'criacaoRecente':
      return criado(b) - criado(a)
    case 'criacaoAntiga':
      return criado(a) - criado(b)
    case 'nome':
      return a.name.localeCompare(b.name, 'pt-BR')
    default:
      return (a.ultimoAcessoMin ?? 9e9) - (b.ultimoAcessoMin ?? 9e9)
  }
}

/** Agrupado por etiqueta, o workspace com duas etiquetas aparece nos dois grupos. */
interface Grupo { id: string, nome: string | null, icone?: string, itens: Workspace[] }
// Rodada 19: o selo do card é a licença do membro (Member.type: owner, full, standard,
// viewer), não o papel (Member.role, outro campo). O grupo leva o nome certo.
const ordemDasLicencas: Workspace['papel'][] = ['Proprietário', 'Full', 'Membro', 'Leitor']
const grupos = computed<Grupo[]>(() => {
  if (agruparPor.value === 'nenhum') return [{ id: 'todos', nome: null, itens: listados.value }]
  if (agruparPor.value === 'licenca') {
    const convites: Grupo = {
      id: 'convites',
      nome: t.value.convitesPendentes,
      icone: 'i-lucide-mail-open',
      itens: listados.value.filter(w => estaPendente(w)),
    }
    const porLicenca = ordemDasLicencas.map(papel => ({
      id: `licenca-${papel}`,
      nome: t.value.papeis[papel],
      icone: 'i-lucide-id-card',
      itens: listados.value.filter(w => !estaPendente(w) && w.papel === papel),
    }))
    return [convites, ...porLicenca].filter(g => g.itens.length)
  }
  const porEtiqueta = etiquetas.value.map(e => ({
    id: e.id,
    nome: e.nome,
    icone: 'i-lucide-tag',
    itens: listados.value.filter(w => (etiquetasPorWorkspace.value[w.id] ?? []).includes(e.id)),
  }))
  porEtiqueta.push({
    id: 'sem-etiqueta',
    nome: t.value.semEtiqueta,
    icone: 'i-lucide-tag',
    itens: listados.value.filter(w => !etiquetasDe(w).length),
  })
  return porEtiqueta.filter(g => g.itens.length)
})

// Os contadores contam o que a aba mostra sem busca: a lista sem os ocultos.
const abas = computed(() => [
  { label: t.value.todos(naLista.value.length), value: 'todos' },
  { label: t.value.favoritos(naLista.value.filter(w => !estaPendente(w) && ehFavorito(w)).length), value: 'favoritos' },
  { label: t.value.recentes(naLista.value.filter(w => !estaPendente(w) && w.ultimoAcessoMin !== null).length), value: 'recentes' },
])

const totalOcultos = computed(() => visiveis.value.filter(w => estaOculto(w)).length)

/* Editor de ocultos, como o painel de propriedades do Notion: cada workspace com
   uma marcação; marcado aparece na lista, desmarcado fica oculto. Convite pendente
   não entra: ele se resolve aceitando ou recusando. */
function definirVisivel(w: Workspace, visivel: boolean) {
  if (visivel) {
    ocultos.value = ocultos.value.filter(id => id !== w.id)
    return
  }
  if (!ocultos.value.includes(w.id)) ocultos.value.push(w.id)
  // Ocultar o padrão desfaz o padrão, como no menu "⋯".
  if (padrao.value === w.id) padrao.value = null
}

function mostrarTodos() {
  ocultos.value = []
}

const secoesDoEditor = computed(() => {
  const termo = normalizar(buscaNoEditor.value.trim())
  const todos = disponiveis.value
    .filter(w => !termo || normalizar(w.name).includes(termo))
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  // Os ocultos vêm primeiro: quem abre "Ocultos" procura por eles.
  return [
    { id: 'ocultos', titulo: t.value.secaoOcultos, itens: todos.filter(w => estaOculto(w)) },
    { id: 'na-lista', titulo: t.value.secaoNaLista, itens: todos.filter(w => !estaOculto(w)) },
  ].filter(s => s.itens.length)
})

function abrirEditorDeOcultos() {
  document.getElementById('barra-da-lista')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  editorDeOcultosAberto.value = true
}

function alternarGrupo(id: string) {
  recolhidos.value = recolhidos.value.includes(id)
    ? recolhidos.value.filter(g => g !== id)
    : [...recolhidos.value, id]
}

/* Os menus "Agrupar" e "Ordenar" da barra da lista, como no ClickUp: o botão diz o
   que está valendo, e o menu marca a opção escolhida. */
const menuDeAgrupar = computed<DropdownMenuItem[][]>(() => [
  [{ type: 'label', label: t.value.agruparPor }],
  (['nenhum', 'etiqueta', 'licenca'] as Agrupamento[]).map(opcao => ({
    type: 'checkbox' as const,
    label: t.value.agruparOpcoes[opcao],
    icon: { nenhum: 'i-lucide-ban', etiqueta: 'i-lucide-tag', licenca: 'i-lucide-id-card' }[opcao],
    checked: agruparPor.value === opcao,
    onUpdateChecked: () => {
      agruparPor.value = opcao
      recolhidos.value = []
    },
  })),
])

const menuDeOrdenar = computed<DropdownMenuItem[][]>(() => [
  [{ type: 'label', label: t.value.ordenarPor }],
  (['acessoRecente', 'acessoAntigo'] as Ordem[]).map(itemDeOrdem),
  (['criacaoRecente', 'criacaoAntiga'] as Ordem[]).map(itemDeOrdem),
  (['nome'] as Ordem[]).map(itemDeOrdem),
])

function itemDeOrdem(opcao: Ordem): DropdownMenuItem {
  return {
    type: 'checkbox',
    label: t.value.ordenarOpcoes[opcao],
    icon: opcao.startsWith('acesso') ? 'i-lucide-clock' : opcao === 'nome' ? 'i-lucide-arrow-down-a-z' : 'i-lucide-calendar-plus',
    checked: ordenarPor.value === opcao,
    onUpdateChecked: () => (ordenarPor.value = opcao),
  }
}

/* ------------------------------- busca ------------------------------- */
const campoDeBusca = useTemplateRef<{ inputRef: HTMLInputElement | null }>('campoDeBusca')
/** Busca só faz sentido com mais de um workspace. */
const podeBuscar = computed(() => estado.value === 'normal' && visiveis.value.length > 1)
/** Com um workspace só, o bloco do topo é a única porta: a lista repetiria o mesmo card. */
const mostrarLista = computed(() => visiveis.value.length > 1)

function focarBusca() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  campoDeBusca.value?.inputRef?.focus()
}

// "/" é o atalho do exemplo do Nuxt UI; Ctrl+K (⌘K no Mac) é o de Slack e Linear.
defineShortcuts({
  '/': focarBusca,
  'meta_k': { handler: focarBusca, usingInput: true },
})

// Quem busca procura em tudo, não só na aba aberta.
watch(busca, (agora, antes) => {
  if (agora && !antes) aba.value = 'todos'
})

/** Enter entra no primeiro resultado, como o produto faz hoje. */
function entrarNoPrimeiro() {
  const primeiro = listados.value.find(w => !estaPendente(w))
  if (busca.value && primeiro) entrar(primeiro)
}

/* -------- identidade visual por workspace --------
   Cor derivada do nome, dentro da paleta da marca (main.css). Não é
   decoração: é o que faz reconhecer o espaço de relance, sem gastar
   uma linha de texto. Fora das cores semânticas de propósito — nenhuma
   delas significa erro, sucesso ou alerta. */
const paletaDeIdentidade = [
  'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
  'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  'bg-space-500/10 text-space-600 dark:text-space-300',
]

function corDoWorkspace(w: Workspace) {
  const soma = [...w.reference].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return paletaDeIdentidade[soma % paletaDeIdentidade.length]!
}

/* -------- visualização em lista: EnTable, o componente do produto -------- */
const colunasDaLista = computed<EnTableColumn[]>(() => [
  { key: 'name', label: t.value.colunaWorkspace },
  { key: 'description', label: t.value.colunaDescricao },
  { key: 'papel', label: t.value.colunaPapel },
  { key: 'ultimoAcessoMin', label: t.value.colunaUltimoAcesso, sortable: true },
  { key: 'acoes', label: '', align: 'right' },
])

/** A linha de baixo do card: uma informação só, com ícone (rodada 18). */
function metaDe(w: Workspace): { icone: string, texto: string } {
  if (padrao.value === w.id) return { icone: 'i-lucide-house', texto: t.value.metaPadrao }
  if (estaOculto(w)) return { icone: 'i-lucide-eye-off', texto: t.value.oculto }
  return { icone: 'i-lucide-clock', texto: tempoRelativo(w.ultimoAcessoMin) }
}

/* ---------------------------- ações (maquete) ---------------------------- */
const entrando = ref<number | null>(null)

function entrar(w: Workspace) {
  entrando.value = w.id
  setTimeout(() => {
    entrando.value = null
    toast.add({
      title: t.value.entrandoEm(w.name),
      description: t.value.entrandoDescricao,
      icon: 'i-lucide-log-in',
      color: 'primary',
    })
  }, 650)
}

function alternarFavorito(w: Workspace) {
  const i = favoritados.value.indexOf(w.id)
  if (i === -1) favoritados.value.push(w.id)
  else favoritados.value.splice(i, 1)
}

function aceitar(w: Workspace) {
  convitesAceitos.value.push(w.id)
  toast.add({ title: t.value.conviteAceito(w.name), icon: 'i-lucide-check', color: 'success' })
}

function recusar(w: Workspace) {
  convitesRecusados.value.push(w.id)
  toast.add({ title: t.value.conviteRecusado(w.name), icon: 'i-lucide-x', color: 'neutral' })
}

/* ------------- rodada 17: padrão, ocultar, sair e etiquetas ------------- */
function alternarPadrao(w: Workspace) {
  if (padrao.value === w.id) {
    padrao.value = null
    toast.add({ title: t.value.padraoRemovido, icon: 'i-lucide-house', color: 'neutral' })
    return
  }
  padrao.value = w.id
  toast.add({
    title: t.value.padraoDefinido(w.name),
    description: t.value.padraoDefinidoDescricao,
    icon: 'i-lucide-house',
    color: 'primary',
  })
}

function alternarOculto(w: Workspace) {
  const i = ocultos.value.indexOf(w.id)
  if (i !== -1) {
    ocultos.value.splice(i, 1)
    return
  }
  ocultos.value.push(w.id)
  // Ocultar o padrão desfaz o padrão: não se abre direto o que se tirou da lista.
  const eraPadrao = padrao.value === w.id
  if (eraPadrao) padrao.value = null
  toast.add({
    title: t.value.ocultadoToast(w.name),
    description: t.value.ocultadoDescricao,
    icon: 'i-lucide-eye-off',
    color: 'neutral',
    actions: [{
      label: t.value.desfazer,
      color: 'neutral',
      variant: 'outline',
      onClick: () => {
        ocultos.value = ocultos.value.filter(id => id !== w.id)
        if (eraPadrao) padrao.value = w.id
      },
    }],
  })
}

/** Sair pede confirmação: é a única ação desta tela que não se desfaz. */
const saindoDe = ref<Workspace | null>(null)
const sairAberto = ref(false)
const saindo = ref(false)

function pedirSaida(w: Workspace) {
  saindoDe.value = w
  sairAberto.value = true
}

function confirmarSaida() {
  const w = saindoDe.value
  if (!w) return
  saindo.value = true
  setTimeout(() => {
    saidos.value.push(w.id)
    if (padrao.value === w.id) padrao.value = null
    saindo.value = false
    sairAberto.value = false
    toast.add({ title: t.value.saiuDe(w.name), icon: 'i-lucide-log-out', color: 'neutral' })
  }, 600)
}

const editandoEtiquetasDe = ref<Workspace | null>(null)
const novaEtiqueta = ref('')
const etiquetasAberto = ref(false)

function editarEtiquetas(w: Workspace) {
  editandoEtiquetasDe.value = w
  novaEtiqueta.value = ''
  etiquetasAberto.value = true
}

function temEtiqueta(w: Workspace, id: string) {
  return (etiquetasPorWorkspace.value[w.id] ?? []).includes(id)
}

function alternarEtiqueta(w: Workspace, id: string) {
  const atuais = etiquetasPorWorkspace.value[w.id] ?? []
  etiquetasPorWorkspace.value[w.id] = atuais.includes(id)
    ? atuais.filter(e => e !== id)
    : [...atuais, id]
}

function criarEtiqueta() {
  const w = editandoEtiquetasDe.value
  const nome = novaEtiqueta.value.trim()
  if (!w || !nome) return
  const existente = etiquetas.value.find(e => normalizar(e.nome) === normalizar(nome))
  const id = existente?.id ?? `etiqueta-${Date.now()}`
  if (!existente) etiquetas.value.push({ id, nome })
  if (!temEtiqueta(w, id)) alternarEtiqueta(w, id)
  novaEtiqueta.value = ''
}

/** O menu "⋯" do card e da linha. Sempre visível, não só no hover (rodada 11). */
function acoesDe(w: Workspace): DropdownMenuItem[][] {
  const ehProprietario = w.papel === 'Proprietário'
  return [
    [
      {
        label: padrao.value === w.id ? t.value.voltarAEscolher : t.value.abrirSempreAoEntrar,
        icon: 'i-lucide-house',
        onSelect: () => alternarPadrao(w),
      },
      {
        label: t.value.etiquetas,
        icon: 'i-lucide-tags',
        onSelect: () => editarEtiquetas(w),
      },
    ],
    [
      {
        label: estaOculto(w) ? t.value.mostrarNaLista : t.value.ocultarDaLista,
        icon: estaOculto(w) ? 'i-lucide-eye' : 'i-lucide-eye-off',
        onSelect: () => alternarOculto(w),
      },
      {
        label: t.value.sairDoWorkspace,
        icon: 'i-lucide-log-out',
        color: 'error',
        disabled: ehProprietario,
        description: ehProprietario ? t.value.proprietarioNaoSai : undefined,
        onSelect: () => pedirSaida(w),
      },
    ],
  ]
}

function tentarDeNovo() {
  estado.value = 'carregando'
  setTimeout(() => (estado.value = 'normal'), 900)
}

/* ------------------- criação: mesma tela, em camada ------------------- */
const criando = ref(false)

function abrirCriacao() {
  criando.value = true
}

function workspaceCriado(nome: string) {
  toast.add({
    title: t.value.criadoTitulo(nome),
    description: t.value.criadoDescricao,
    icon: 'i-lucide-check',
    color: 'success',
  })
}
</script>

<template>
  <div class="min-h-screen bg-default pb-28">
    <header class="border-b border-default bg-elevated/50 backdrop-blur">
      <UContainer class="flex h-14 items-center justify-between">
        <span class="text-sm font-medium text-toned">ENSPACE</span>
        <div class="flex items-center gap-3">
          <UButton icon="i-lucide-life-buoy" :label="t.suporte" color="neutral" variant="ghost" size="sm" />
          <UAvatar :text="usuario.iniciais" size="sm" :ui="{ fallback: 'text-toned' }" />
        </div>
      </UContainer>
    </header>

    <UContainer class="max-w-5xl py-10 sm:py-14">
      <!-- 1. A tela diz o que é, a busca fica à mão, e o atalho de criar continua no topo -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="min-w-0 flex-1 animate-[entrada_0.4s_ease-out_both]">
          <p class="text-sm text-muted">
            {{ t.saudacao(usuario.nome.split(' ')[0]!) }}
          </p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
            {{ t.titulo }}
          </h1>
          <p class="mt-2 max-w-2xl text-muted">
            {{ t.explicacaoAntes
            }}<strong class="text-highlighted">{{ t.explicacaoDestaque }}</strong>{{
              t.explicacaoDepois }}
          </p>

          <!-- Rodada 17: a busca volta para o topo, onde o produto já a tem.
               "/" e Ctrl+K trazem o foco de qualquer ponto da página. -->
          <div v-if="podeBuscar" class="mt-5 max-w-md">
            <UInput
              ref="campoDeBusca"
              v-model="busca"
              icon="i-lucide-search"
              :placeholder="t.buscarEntre(naLista.length)"
              size="lg"
              class="w-full"
              :ui="{ trailing: 'pe-1.5' }"
              @keydown.enter="entrarNoPrimeiro"
              @keydown.esc="busca = ''"
            >
              <template #trailing>
                <UButton
                  v-if="busca"
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-circle-x"
                  :aria-label="t.limparBusca"
                  @click="busca = ''"
                />
                <UKbd v-else value="/" />
              </template>
            </UInput>
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
            >
              <p v-if="busca" class="mt-1.5 text-xs text-muted">
                {{ t.dicaBusca }}
              </p>
            </Transition>
          </div>
        </div>

        <!-- Atalho no topo, como sempre esteve. Secundário no peso, não no
             endereço: quem precisa, encontra onde já procurava. -->
        <UTooltip :text="t.criarTooltip">
          <UButton
            :label="t.criarWorkspace"
            icon="i-lucide-plus"
            color="neutral"
            variant="outline"
            class="shrink-0 animate-[entrada_0.4s_ease-out_both] transition-transform hover:-translate-y-0.5"
            @click="abrirCriacao"
          />
        </UTooltip>
      </div>

      <!-- Erro -->
      <UAlert
        v-if="estado === 'erro'"
        class="animate-[entrada_0.3s_ease-out_both]"
        icon="i-lucide-triangle-alert"
        color="error"
        variant="subtle"
        :title="t.erroTitulo"
        :description="t.erroDescricao"
        :ui="{ title: 'font-bold' }"
        :actions="[{ label: t.tentarDeNovo, color: 'error', variant: 'solid', onClick: tentarDeNovo }]"
      />

      <!-- Carregando -->
      <div v-else-if="estado === 'carregando'" class="space-y-4">
        <USkeleton class="h-28 w-full rounded-xl" />
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <USkeleton v-for="i in 6" :key="i" class="h-36 rounded-xl" />
        </div>
      </div>

      <template v-else>
        <!-- 2. Convite pendente vira ação. Sai de cena enquanto se busca:
             os resultados sobem para logo abaixo do campo. -->
        <TransitionGroup
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-200 ease-in absolute"
          leave-to-class="opacity-0 scale-95"
        >
          <UAlert
            v-for="convite in (busca ? [] : pendentes)"
            :key="convite.id"
            class="mb-4"
            icon="i-lucide-mail-open"
            color="secondary"
            variant="subtle"
            :title="t.conviteTitulo(convite.convidadoPor!, convite.name)"
            :description="t.conviteDescricao"
            :ui="{ title: 'font-bold' }"
            :actions="[
              { label: t.aceitarConvite, color: 'secondary', variant: 'solid', onClick: () => aceitar(convite) },
              { label: t.recusar, color: 'neutral', variant: 'ghost', onClick: () => recusar(convite) },
            ]"
          />
        </TransitionGroup>

        <!-- 3. Continue de onde parou, ou o padrão que a pessoa escolheu -->
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <section
            v-if="destaque && !busca"
            class="mb-8 animate-[entrada_0.45s_ease-out_both] rounded-xl border bg-elevated/40 p-5 transition-[box-shadow,border-color] duration-300 hover:shadow-md sm:p-6"
            :class="padrao === destaque.id ? 'border-primary/40' : 'border-default'"
            style="animation-delay: 80ms"
          >
            <p class="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              <UIcon v-if="padrao === destaque.id" name="i-lucide-house" class="size-3.5" />
              {{ padrao === destaque.id
                ? t.abreAoEntrar
                : estado === 'unico' ? t.seuWorkspace : t.continueDeOndeParou }}
            </p>
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex min-w-0 items-center gap-4">
                <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-105">
                  <UIcon :name="destaque.icon!" class="size-6 text-primary" />
                </div>
                <div class="min-w-0">
                  <h2 class="truncate text-lg font-semibold text-highlighted">
                    {{ destaque.name }}
                  </h2>
                  <p class="truncate text-sm text-muted">
                    {{ destaque.description || tempoRelativo(destaque.ultimoAcessoMin) }}
                  </p>
                </div>
              </div>
              <UButton
                :label="t.entrarEm(destaque.name)"
                icon="i-lucide-log-in"
                size="lg"
                :loading="entrando === destaque.id"
                class="shrink-0 justify-center transition-transform hover:scale-[1.02]"
                @click="entrar(destaque)"
              />
            </div>

            <!-- Rodada 17: o padrão se escolhe onde ele importa, a um clique.
                 É o que deixa quem só abre chamado nunca mais ver esta tela.
                 Rodada 18: vira botão com borda; como link, não parecia clicável. -->
            <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-default pt-4 text-sm">
              <template v-if="padrao === destaque.id">
                <span class="text-muted">{{ t.proximaVezDireto(destaque.name) }}</span>
                <UButton
                  :label="t.voltarAEscolher"
                  icon="i-lucide-undo-2"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  @click="alternarPadrao(destaque)"
                />
              </template>
              <UButton
                v-else
                :label="t.abrirSempreEste"
                icon="i-lucide-house"
                color="neutral"
                variant="outline"
                size="sm"
                @click="alternarPadrao(destaque)"
              />
            </div>
          </section>
        </Transition>

        <!-- 4. Abas e a barra da lista: Agrupar, Ordenar, Ocultos e card / lista.
             Rodada 18: a barra copia o padrão das visualizações do ClickUp. -->
        <section v-if="mostrarLista">
          <div id="barra-da-lista" class="mb-4 flex scroll-mt-4 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <UTabs v-model="aba" :items="abas" :content="false" color="primary" variant="link" size="sm" />

            <div class="flex flex-wrap items-center gap-2">
              <UDropdownMenu :items="menuDeAgrupar" :content="{ align: 'end' }">
                <UButton
                  icon="i-lucide-layers"
                  trailing-icon="i-lucide-chevron-down"
                  :label="agruparPor === 'nenhum' ? t.agrupar : `${t.agrupar}: ${t.agruparOpcoes[agruparPor]}`"
                  size="xs"
                  color="neutral"
                  :variant="agruparPor === 'nenhum' ? 'outline' : 'soft'"
                />
              </UDropdownMenu>
              <UDropdownMenu :items="menuDeOrdenar" :content="{ align: 'end' }">
                <UButton
                  icon="i-lucide-arrow-up-down"
                  trailing-icon="i-lucide-chevron-down"
                  :label="`${t.ordenar}: ${t.ordenarCurto[ordenarPor]}`"
                  size="xs"
                  color="neutral"
                  :variant="ordenarPor === 'acessoRecente' ? 'outline' : 'soft'"
                />
              </UDropdownMenu>
              <!-- Rodada 19: "Ocultos" abre um editor, como o painel de propriedades
                   do Notion. Marcado aparece na lista; desmarcado fica oculto. -->
              <UPopover
                v-model:open="editorDeOcultosAberto"
                :content="{ align: 'end' }"
                @update:open="(aberto: boolean) => { if (!aberto) buscaNoEditor = '' }"
              >
                <UButton
                  icon="i-lucide-eye-off"
                  trailing-icon="i-lucide-chevron-down"
                  :label="totalOcultos ? t.ocultosBotao(totalOcultos) : t.secaoOcultos"
                  size="xs"
                  color="neutral"
                  :variant="totalOcultos ? 'soft' : 'outline'"
                />

                <template #content>
                  <div class="w-80 p-3">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-sm font-semibold text-highlighted">
                        {{ t.editorTitulo }}
                      </p>
                      <UButton
                        v-if="totalOcultos"
                        :label="t.mostrarTodos"
                        color="neutral"
                        variant="link"
                        size="xs"
                        class="px-0"
                        @click="mostrarTodos"
                      />
                    </div>
                    <p class="mt-0.5 mb-3 text-xs text-muted">
                      {{ t.editorDescricao }}
                    </p>
                    <UInput
                      v-model="buscaNoEditor"
                      icon="i-lucide-search"
                      :placeholder="t.buscarWorkspace"
                      size="sm"
                      class="mb-3 w-full"
                    />
                    <div class="max-h-72 space-y-3 overflow-y-auto">
                      <div v-for="secao in secoesDoEditor" :key="secao.id">
                        <p class="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted">
                          {{ secao.titulo }} ({{ secao.itens.length }})
                        </p>
                        <TransitionGroup
                          tag="ul"
                          move-class="transition-transform duration-200"
                          enter-active-class="transition duration-200 ease-out"
                          enter-from-class="opacity-0"
                        >
                          <li v-for="w in secao.itens" :key="w.id">
                            <UCheckbox
                              :model-value="!estaOculto(w)"
                              :label="w.name"
                              :ui="{
                                root: 'items-center rounded-md px-2 py-1.5 transition-colors hover:bg-elevated',
                                wrapper: 'min-w-0',
                                label: estaOculto(w) ? 'truncate font-normal text-muted' : 'truncate font-normal',
                              }"
                              @update:model-value="(valor: boolean | 'indeterminate') => definirVisivel(w, valor === true)"
                            />
                          </li>
                        </TransitionGroup>
                      </div>
                      <p v-if="!secoesDoEditor.length" class="px-2 py-4 text-center text-sm text-muted">
                        {{ t.buscaVaziaTitulo(buscaNoEditor) }}
                      </p>
                    </div>
                  </div>
                </template>
              </UPopover>
              <!-- Card é o padrão. Lista é opção, e a troca é visível. -->
              <div class="flex shrink-0 rounded-md border border-default p-0.5">
                <UButton
                  icon="i-lucide-layout-grid"
                  size="xs"
                  square
                  :color="visual === 'cards' ? 'primary' : 'neutral'"
                  :variant="visual === 'cards' ? 'soft' : 'ghost'"
                  :aria-label="t.verEmCards"
                  @click="visual = 'cards'"
                />
                <UButton
                  icon="i-lucide-list"
                  size="xs"
                  square
                  :color="visual === 'lista' ? 'primary' : 'neutral'"
                  :variant="visual === 'lista' ? 'soft' : 'ghost'"
                  :aria-label="t.verEmLista"
                  @click="visual = 'lista'"
                />
              </div>
            </div>
          </div>

          <template v-if="listados.length">
            <div v-for="grupo in grupos" :key="grupo.id" class="mb-8 last:mb-0">
              <!-- Grupo recolhível, como no ClickUp -->
              <button
                v-if="grupo.nome"
                type="button"
                class="mb-3 flex animate-[entrada_0.3s_ease-out_both] items-center gap-2 rounded-md text-sm font-semibold text-highlighted outline-none focus-visible:ring-2 focus-visible:ring-primary"
                :aria-expanded="!recolhidos.includes(grupo.id)"
                :aria-label="t.recolherGrupo(grupo.nome)"
                @click="alternarGrupo(grupo.id)"
              >
                <UIcon
                  name="i-lucide-chevron-down"
                  class="size-4 text-muted transition-transform duration-200"
                  :class="recolhidos.includes(grupo.id) && '-rotate-90'"
                />
                <UIcon :name="grupo.icone ?? 'i-lucide-tag'" class="size-4 text-muted" />
                {{ grupo.nome }}
                <span class="font-normal text-muted">{{ grupo.itens.length }}</span>
              </button>

              <!-- CARDS (padrão) -->
              <TransitionGroup
                v-if="visual === 'cards' && !recolhidos.includes(grupo.id)"
                tag="div"
                class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 translate-y-3"
                leave-active-class="transition duration-150 ease-in absolute"
                leave-to-class="opacity-0 scale-95"
                move-class="transition-transform duration-300"
              >
                <article
                  v-for="(w, i) in grupo.itens"
                  :key="w.id"
                  class="group relative flex animate-[entrada_0.4s_ease-out_both] flex-col rounded-xl border bg-elevated/20 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg"
                  :class="[
                    estaPendente(w)
                      ? 'border-secondary/50 border-dashed hover:border-secondary hover:shadow-secondary/5'
                      : 'border-default hover:border-primary/60 hover:shadow-primary/5 focus-within:border-primary',
                    estaOculto(w) && 'opacity-70 hover:opacity-100',
                  ]"
                  :style="{ animationDelay: `${i * 55}ms` }"
                >
                  <!-- topo: identidade à esquerda, metadado, favorito e menu à direita -->
                  <div class="relative z-10 flex items-start justify-between gap-2">
                    <div
                      class="flex size-10 items-center justify-center rounded-lg transition-colors"
                      :class="estaPendente(w) ? 'bg-secondary/10' : corDoWorkspace(w)"
                    >
                      <UIcon
                        :name="estaPendente(w) ? 'i-lucide-mail-open' : w.icon!"
                        class="size-5"
                      />
                    </div>

                    <div class="flex items-center gap-1">
                      <UBadge
                        v-if="estaPendente(w)"
                        :label="t.convitePendente"
                        color="secondary"
                        variant="subtle"
                        size="sm"
                      />
                      <UBadge
                        v-else
                        :label="t.papeis[w.papel]"
                        :color="corDoPapel[w.papel]"
                        variant="subtle"
                        size="sm"
                        class="mr-0.5"
                      />
                      <UButton
                        v-if="!estaPendente(w)"
                        icon="i-lucide-star"
                        size="xs"
                        square
                        variant="ghost"
                        :color="ehFavorito(w) ? 'warning' : 'neutral'"
                        :class="ehFavorito(w)
                          ? 'text-warning'
                          : 'text-muted transition-colors hover:text-warning'"
                        :aria-label="ehFavorito(w) ? t.removerDosFavoritos : t.adicionarAosFavoritos"
                        @click="alternarFavorito(w)"
                      />
                      <UDropdownMenu
                        v-if="!estaPendente(w)"
                        :items="acoesDe(w)"
                        :content="{ align: 'end' }"
                      >
                        <UButton
                          icon="i-lucide-ellipsis"
                          size="xs"
                          square
                          color="neutral"
                          variant="ghost"
                          class="text-muted"
                          :aria-label="t.maisAcoes(w.name)"
                        />
                      </UDropdownMenu>
                    </div>
                  </div>

                  <!-- corpo: altura mínima para os cards da grade se alinharem -->
                  <div class="mt-3 min-h-16">
                    <h3 class="line-clamp-2 font-semibold text-highlighted">
                      <!-- O card inteiro é o alvo: este link se estica por cima dele
                           (after:inset-0). Estrela e menu ficam acima, com z-10. No
                           produto o href leva ao workspace; aqui o clique é interceptado. -->
                      <a
                        v-if="!estaPendente(w)"
                        :href="`/w/${w.reference}`"
                        class="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-primary"
                        @click.prevent="entrar(w)"
                      >{{ w.name }}</a>
                      <template v-else>{{ w.name }}</template>
                    </h3>
                    <!-- Sem descrição não vira linha dizendo "sem descrição": o
                         espaço vazio já conta isso, e a altura mínima segura a grade. -->
                    <p
                      v-if="estaPendente(w) || w.description"
                      class="mt-1 line-clamp-2 text-sm text-muted"
                    >
                      {{ estaPendente(w) ? t.conviteCurto(w.convidadoPor!) : w.description }}
                    </p>
                    <!-- Etiquetas pessoais: só quem criou vê -->
                    <div v-if="etiquetasDe(w).length" class="mt-2 flex flex-wrap gap-1">
                      <UBadge
                        v-for="e in etiquetasDe(w)"
                        :key="e.id"
                        :label="e.nome"
                        icon="i-lucide-tag"
                        color="neutral"
                        variant="outline"
                        size="sm"
                      />
                    </div>
                  </div>

                  <!-- rodapé ancorado: meta à esquerda, a ação à direita -->
                  <div class="mt-auto flex items-end justify-between gap-2 pt-4">
                    <!-- Rodada 18: uma informação só, com ícone. O número de pessoas
                         saiu: não ajuda a escolher onde entrar. -->
                    <p v-if="estaPendente(w)" class="text-xs text-muted">
                      {{ t.aceiteParaEntrar }}
                    </p>
                    <p v-else class="flex min-w-0 items-center gap-1.5 text-xs text-muted">
                      <UIcon :name="metaDe(w).icone" class="size-3.5 shrink-0" />
                      <span class="truncate">{{ metaDe(w).texto }}</span>
                    </p>

                    <!-- Convite tem duas ações de peso igual: aqui botão é o certo -->
                    <div v-if="estaPendente(w)" class="relative z-10 flex items-center gap-2">
                      <UButton :label="t.aceitar" size="sm" color="secondary" @click="aceitar(w)" />
                      <UButton :label="t.recusar" size="sm" color="neutral" variant="ghost" @click="recusar(w)" />
                    </div>

                    <!-- Uma ação principal: vira afordância dentro do próprio alvo -->
                    <span
                      v-else
                      class="pointer-events-none flex shrink-0 items-center gap-1 text-sm font-medium transition-colors"
                      :class="entrando === w.id ? 'text-primary' : 'text-muted group-hover:text-primary'"
                    >
                      {{ entrando === w.id ? t.entrandoEm('').trim() + '…' : t.entrar }}
                      <UIcon
                        :name="entrando === w.id ? 'i-lucide-loader-circle' : 'i-lucide-arrow-right'"
                        class="size-4 transition-transform duration-200"
                        :class="entrando === w.id ? 'animate-spin' : 'group-hover:translate-x-1'"
                      />
                    </span>
                  </div>
                </article>
              </TransitionGroup>

              <!-- LISTA (alternativa): EnTable, a listagem padrão do ENSPACE.
                   Componente do próprio produto (@be-enlighten/enspace-sdk-ui),
                   em modo dumb: recebe linhas e colunas, navega por emit. -->
              <EnTable
                v-else-if="visual === 'lista' && !recolhidos.includes(grupo.id)"
                :columns="colunasDaLista"
                :rows="grupo.itens"
                class="animate-[entrada_0.3s_ease-out_both]"
                @row-click="(row: Workspace) => !estaPendente(row) && entrar(row)"
              >
                <template #cell-name="{ row }">
                  <div class="flex min-w-0 items-center gap-3" :class="estaOculto(row) && 'opacity-70'">
                    <div
                      class="flex size-8 shrink-0 items-center justify-center rounded-md"
                      :class="estaPendente(row) ? 'bg-secondary/10' : 'bg-elevated'"
                    >
                      <UIcon
                        :name="estaPendente(row) ? 'i-lucide-mail-open' : row.icon!"
                        class="size-4"
                        :class="estaPendente(row) ? 'text-secondary' : 'text-muted'"
                      />
                    </div>
                    <!-- Nome numa linha, selos e etiquetas na de baixo: na mesma
                         linha eles espremiam o nome até "L…". -->
                    <div class="min-w-0 sm:min-w-44">
                      <div class="flex min-w-0 items-center gap-1.5">
                        <span class="truncate font-medium text-highlighted">{{ row.name }}</span>
                        <UIcon
                          v-if="ehFavorito(row) && !estaPendente(row)"
                          name="i-lucide-star"
                          class="size-3.5 shrink-0 text-warning"
                        />
                        <UIcon
                          v-if="padrao === row.id"
                          name="i-lucide-house"
                          class="size-3.5 shrink-0 text-muted"
                        />
                      </div>
                      <div
                        v-if="estaPendente(row) || estaOculto(row) || etiquetasDe(row).length"
                        class="mt-1 flex flex-wrap gap-1"
                      >
                        <UBadge
                          v-if="estaPendente(row)"
                          :label="t.convitePendente"
                          color="secondary"
                          variant="subtle"
                          size="sm"
                        />
                        <UBadge
                          v-if="estaOculto(row)"
                          :label="t.oculto"
                          icon="i-lucide-eye-off"
                          color="neutral"
                          variant="outline"
                          size="sm"
                        />
                        <UBadge
                          v-for="e in etiquetasDe(row)"
                          :key="e.id"
                          :label="e.nome"
                          icon="i-lucide-tag"
                          color="neutral"
                          variant="outline"
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </template>

                <template #cell-description="{ row }">
                  <span class="text-muted">
                    {{ estaPendente(row)
                      ? t.conviteCurto(row.convidadoPor!)
                      : (row.description || t.pessoas(row.members_count ?? 0)) }}
                  </span>
                </template>

                <template #cell-papel="{ row }">
                  <UBadge
                    v-if="!estaPendente(row)"
                    :label="t.papeis[row.papel]"
                    :color="corDoPapel[row.papel]"
                    variant="subtle"
                    size="sm"
                  />
                </template>

                <template #cell-ultimoAcessoMin="{ row }">
                  <span class="text-muted">
                    {{ estaPendente(row) ? t.aceiteParaEntrar : tempoRelativo(row.ultimoAcessoMin) }}
                  </span>
                </template>

                <template #cell-acoes="{ row }">
                  <div class="flex items-center justify-end gap-1" @click.stop>
                    <template v-if="estaPendente(row)">
                      <UButton :label="t.aceitar" size="sm" color="secondary" @click="aceitar(row)" />
                      <UButton :label="t.recusar" size="sm" color="neutral" variant="ghost" @click="recusar(row)" />
                    </template>
                    <template v-else>
                      <UButton
                        :label="t.entrar"
                        size="sm"
                        color="neutral"
                        variant="subtle"
                        :loading="entrando === row.id"
                        @click="entrar(row)"
                      />
                      <UDropdownMenu :items="acoesDe(row)" :content="{ align: 'end' }">
                        <UButton
                          icon="i-lucide-ellipsis"
                          size="sm"
                          square
                          color="neutral"
                          variant="ghost"
                          class="text-muted"
                          :aria-label="t.maisAcoes(row.name)"
                        />
                      </UDropdownMenu>
                    </template>
                  </div>
                </template>
              </EnTable>
            </div>
          </template>

          <UEmpty
            v-else-if="busca"
            class="animate-[entrada_0.3s_ease-out_both]"
            icon="i-lucide-search-x"
            :title="t.buscaVaziaTitulo(busca)"
            :description="t.buscaVaziaDescricao"
          />

          <!-- Rodada 17: os ocultos saem da lista, mas não somem da tela -->
          <div
            v-if="totalOcultos && !busca"
            class="mt-8 flex items-center justify-center gap-2 text-sm text-muted"
          >
            <UIcon name="i-lucide-eye-off" class="size-4" />
            {{ t.ocultos(totalOcultos) }}
            <UButton
              :label="t.gerenciarOcultos"
              color="neutral"
              variant="link"
              size="sm"
              class="px-0 font-medium text-highlighted"
              @click="abrirEditorDeOcultos"
            />
          </div>
        </section>

        <!-- Nenhum workspace -->
        <UEmpty
          v-if="estado === 'vazio' && !pendentes.length"
          class="animate-[entrada_0.3s_ease-out_both]"
          icon="i-lucide-door-closed"
          :title="t.semWorkspaceTitulo"
          :description="t.semWorkspaceDescricao"
          :actions="[{ label: t.criarUmWorkspace, color: 'primary', onClick: abrirCriacao }]"
        />
      </template>
    </UContainer>

    <!-- 5. Criação: mesma tela, em camada. -->
    <ModalCriarWorkspace v-model:open="criando" @criado="workspaceCriado" />

    <!-- Rodada 17: sair pede confirmação, porque não se desfaz -->
    <UModal
      v-model:open="sairAberto"
      :title="saindoDe ? t.sairTitulo(saindoDe.name) : ''"
      :description="t.sairDescricao"
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.cancelar" color="neutral" variant="ghost" @click="sairAberto = false" />
          <UButton
            :label="t.sairDoWorkspace"
            icon="i-lucide-log-out"
            color="error"
            :loading="saindo"
            @click="confirmarSaida"
          />
        </div>
      </template>
    </UModal>

    <!-- Rodada 17: etiquetas pessoais. Marcar e desmarcar vale na hora. -->
    <UModal
      v-model:open="etiquetasAberto"
      :title="editandoEtiquetasDe ? t.etiquetasDe(editandoEtiquetasDe.name) : ''"
      :description="t.etiquetasDescricao"
    >
      <template #body>
        <div v-if="editandoEtiquetasDe" class="space-y-5">
          <p v-if="!etiquetas.length" class="text-sm text-muted">
            {{ t.nenhumaEtiqueta }}
          </p>
          <div v-else class="space-y-3">
            <UCheckbox
              v-for="e in etiquetas"
              :key="e.id"
              :label="e.nome"
              :model-value="temEtiqueta(editandoEtiquetasDe, e.id)"
              @update:model-value="alternarEtiqueta(editandoEtiquetasDe!, e.id)"
            />
          </div>
          <form class="flex gap-2" @submit.prevent="criarEtiqueta">
            <UInput
              v-model="novaEtiqueta"
              icon="i-lucide-tag"
              :placeholder="t.novaEtiqueta"
              :maxlength="30"
              class="flex-1"
            />
            <UButton
              type="submit"
              :label="t.criarEtiqueta"
              color="neutral"
              variant="subtle"
              :disabled="!novaEtiqueta.trim()"
            />
          </form>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end">
          <UButton :label="t.pronto" @click="etiquetasAberto = false" />
        </div>
      </template>
    </UModal>

    <!-- ANDAIME DE PROTÓTIPO — não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <UContainer class="flex flex-wrap items-center gap-2 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-toned">
          Protótipo · estado
        </span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          color="neutral"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="estado = e.valor"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-toned">
            Por trás
          </span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/tela-de-workspaces"
          />
        </span>
      </UContainer>
    </div>
  </div>
</template>
