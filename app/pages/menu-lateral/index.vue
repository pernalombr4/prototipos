<script setup lang="ts">
import { rotuloDoNo as rotuloComum } from './rotulos'
import PainelTrabalho from './_PainelTrabalho.vue'
import PainelConfiguracoes from './_PainelConfiguracoes.vue'
import ModeloTrilha from './_ModeloTrilha.vue'
import Conteudo from './_Conteudo.vue'
import BarraRecolhida from './_BarraRecolhida.vue'
import CentralDeCasos from './_CentralDeCasos.vue'
import UsarCaso from './_UsarCaso.vue'
import ImportarCaso from './_ImportarCaso.vue'
import CriarCaso from './_CriarCaso.vue'

/*
 * ============ O QUE ENTRA DEPOIS (rodada 13) ============
 *
 * "ta muito pesado quando entro. tudo travando" (Mikaela).
 *
 * As três CAMADAS abaixo (ver todas, menu de hoje, editor) continuam sendo
 * importadas com a página, mas só são MONTADAS depois da primeira vez que
 * alguém as abre. A entrada deixa de construir três árvores de componentes
 * que ninguém pediu, e nada fica esperando download no meio do clique.
 *
 * Já tentei trazê-las por `import()` sob demanda, e é pior AQUI: em
 * desenvolvimento o servidor compila o pedaço só na hora do clique, e o
 * primeiro clique fica pendurado. Em produção seria o contrário; como o
 * protótipo vive rodando em `pnpm dev`, mandou quem manda.
 */
import EditorDeMenus from './_EditorDeMenus.vue'
import CriarMenu from './_CriarMenu.vue'
import EscolherMenu from './_EscolherMenu.vue'
import CriarCategoria from './_CriarCategoria.vue'
import ConfirmarExclusao from './_ConfirmarExclusao.vue'
import CriarMaquete from './_CriarMaquete.vue'
import RodapeDaJanela from './_RodapeDaJanela.vue'
import { MOLDURA } from './moldura'
import TodasAsCategorias from './_TodasAsCategorias.vue'
import {
  categoriasNormais,
  categoriasVolume,
  gruposDeConfiguracao,
  workspace,
  usuaria,
  relatoriosEmitidos,
  type NoDoMenu,
  type Categoria,
} from './mocks'
import { useMenuDoWorkspace, useMenuRecolhido } from './estado'
import { useRenomeando } from './acoes'
import { useJanelasDaTrilha } from './trilha'
import { useLimites } from './limites'
import { useJanelasDeCasos } from './casos'
import { dashboardDoDestino, useDashboards } from './dashboards'
import { useMeusRelatorios } from './relatorios'
import { textos } from './textos'

// O contexto do protótipo vem dos próprios .md desta pasta, como texto.
// Ja tentei traze-los por import() depois da primeira pintura, para tirar
// quase 100 KB do modulo da pagina. Em `pnpm dev` fica PIOR: o servidor so
// compila o pedaco na hora em que alguem pede, e o pedido fica pendurado
// dezenas de segundos. Entao continuam entrando com a pagina. Rodada 13.
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Menu lateral em dois níveis',
  descricao: 'Tirar a administração do caminho do trabalho e dar teto à lista de categorias, sem mudar de endereço.',
  status: 'em-revisao',
  atualizado: '2026-11-24',
  tela: 'Menu lateral do workspace',
})

const t = useTextos(textos)
/* A barra do topo de hoje (rodada 35): a sigla do idioma e o tema funcionam de verdade. */
const idioma = useIdioma()
const siglaDoIdioma = computed(() => ({ 'pt-BR': 'BR', en: 'EN', es: 'ES' } as Record<string, string>)[idioma.value] ?? 'BR')
const modoDeCor = useColorMode()
function alternarTema() {
  modoDeCor.preference = modoDeCor.value === 'dark' ? 'light' : 'dark'
}
const toast = useToast()

/** A árvore do menu, a mesma que o editor edita e que as duas barras mostram. */
const menu = useMenuDoWorkspace()

/** Rótulo de um nó: nativo vem do dicionário, do workspace vem do próprio nó. */
function rotuloDoNo(no: NoDoMenu) {
  // Rodada 16: o mapa de nomes mora no rotulos.ts, um só para todas as peças.
  return rotuloComum(no, t.value)
}

/** Todos os itens de seção, achatados, para a busca e para o breadcrumb. */
const itensDeSecao = computed(() =>
  menu.secoes.value.flatMap(s => (s.filhos ?? []).map(f => ({ no: f, secao: s }))),
)

/* ------------------------------------------------------------------
   ANDAIME: o seletor de estados não faz parte da proposta. Existe para
   revisar os seis estados sem back-end.
------------------------------------------------------------------ */
/*
 * Rodada 35: os 3 primeiros são CENÁRIOS, e trocar de um para outro recomeça o
 * menu do zero, como se fosse outro workspace:
 *   Em uso              o workspace de demonstração, com seção pessoal,
 *                       seções do workspace e módulos;
 *   Sem personalização  categorias e módulos, e ninguém mexeu no menu;
 *   Workspace novo      recém-criado: só o nativo, sem categoria nem módulo.
 * O "Workspace novo" das rodadas 1 a 34 tinha a seção pessoal "Rotina do
 * jurídico", e isso estava errado: workspace novo começa vazio.
 * Os 4 últimos são estados da tela, por cima do cenário que estiver escolhido.
 */
type Estado = 'normal' | 'semPersonalizacao' | 'vazio' | 'volume' | 'carregando' | 'erro' | 'semPermissao'
const estado = ref<Estado>('normal')
const estados = computed<{ valor: Estado, rotulo: string }[]>(() => [
  { valor: 'normal', rotulo: t.value.cenarioEmUso },
  { valor: 'semPersonalizacao', rotulo: t.value.cenarioSemPersonalizacao },
  { valor: 'vazio', rotulo: t.value.cenarioNovo },
  { valor: 'volume', rotulo: '40 categorias' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'erro', rotulo: 'Erro' },
  { valor: 'semPermissao', rotulo: 'Sem permissão' },
])
const relatoriosDoCenario = useMeusRelatorios()
watch(estado, (e) => {
  if (e === 'normal') menu.aplicarCenario('emUso')
  else if (e === 'semPersonalizacao') menu.aplicarCenario('semPersonalizacao')
  else if (e === 'vazio') menu.aplicarCenario('novo')
  else return
  fixadasManualmente.value = []
  // Workspace novo não tem dashboard nem relatório emitido.
  dashboardsDeItens.recomecar(e === 'vazio' ? 'novo' : e === 'semPersonalizacao' ? 'semPersonalizacao' : 'emUso')
  relatoriosDoCenario.lista.value = e === 'vazio' ? [] : relatoriosEmitidos.map(r => ({ ...r }))
  irParaDestino(menu.destinos.value[0]?.id ?? 'n-inicio')
  painel.value = 'trabalho'
})

const podeConfigurar = computed(() => estado.value !== 'semPermissao')
const estadoDoPainel = computed(() => {
  if (estado.value === 'volume' || estado.value === 'semPermissao' || estado.value === 'semPersonalizacao') return 'normal' as const
  return estado.value as 'normal' | 'vazio' | 'carregando' | 'erro'
})

/* ------------------------------ o dado ------------------------------ */
/* As categorias criadas pelo "+" do Início (rodada 16) somam às do mock. */
const { categoriasCriadas } = useJanelasDaTrilha()
const janelasDeCasos = useJanelasDeCasos()

const base = computed<Categoria[]>(() => {
  if (estado.value === 'vazio') return [...categoriasCriadas.value]
  if (estado.value === 'volume') return [...categoriasVolume, ...categoriasCriadas.value]
  return [...categoriasNormais, ...categoriasCriadas.value]
})

/** Favoritar mexe no array em memória. Recarregar a página volta ao começo. */
const fixadasManualmente = ref<number[]>([])

/*
 * Sem personalização (rodada 35): ninguém marcou favorito nem abriu nada
 * ainda, então não há favorito nem histórico de uso.
 */
const semHistorico = computed(() => estado.value === 'semPersonalizacao')
const categorias = computed<Categoria[]>(() =>
  base.value.map((c) => {
    const favorita = semHistorico.value ? false : c.favorita
    return {
      ...c,
      aberturas: semHistorico.value ? 0 : c.aberturas,
      favorita: fixadasManualmente.value.includes(c.id) ? !favorita : favorita,
    }
  }),
)

const favoritas = computed(() => categorias.value.filter(c => c.favorita))

/**
 * Ordenação da seção, como no Attio: três critérios automáticos e um manual.
 *
 * `manual` é o `Custom` do Attio: desliga o cálculo e passa a respeitar a ordem
 * que a pessoa arrastou. Quem arrasta com um critério automático ligado cai
 * nele sozinho, senão o arraste seria desfeito no recálculo seguinte.
 */
const ordem = ref<'uso' | 'alfabetica' | 'recentes' | 'manual'>('uso')

const naoFavoritas = computed(() => {
  const lista = categorias.value.filter(c => !c.favorita)

  if (ordem.value === 'manual') {
    const posicao = new Map(menu.ordemCategoriasRascunho.value.map((id, i) => [id, i]))
    // Categoria que nunca foi arrastada vai para o fim, na ordem que já tinha.
    return [...lista].sort((a, b) =>
      (posicao.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (posicao.get(b.id) ?? Number.MAX_SAFE_INTEGER),
    )
  }
  if (ordem.value === 'alfabetica') return [...lista].sort((a, b) => a.name.localeCompare(b.name))
  if (ordem.value === 'recentes') return [...lista].sort((a, b) => b.id - a.id)
  // Rodada 35: sem histórico de uso o empate é geral, e a ordem vira alfabética.
  return [...lista].sort((a, b) => b.aberturas - a.aberturas || a.name.localeCompare(b.name))
})

/**
 * Arrastar uma categoria com critério automático ligado: o critério vira
 * `manual` e a ordem parte do que estava na tela, para nada embaralhar.
 */
function virarOrdemManual() {
  menu.semearOrdemDeCategorias(naoFavoritas.value.map(c => c.id))
  ordem.value = 'manual'
}

/** Trocar o critério pelo menu: escolher Personalizada parte do que está na tela. */
function trocarOrdem(v: 'uso' | 'alfabetica' | 'recentes' | 'manual') {
  if (v === 'manual') { virarOrdemManual(); return }
  ordem.value = v
}

/**
 * O TETO da seção (o padrão, desde a rodada 19). Cinco, para a seção inteira
 * mais os favoritos caberem sem rolagem num notebook. O Attio mostra seis listas por padrão; aqui cinco, porque
 * acima da seção ainda existem os favoritos, que o Attio põe em outro lugar.
 * O resto vive na camada "ver todas".
 */
/*
 * Rodada 19: o teto deixou de ser fixo. É o "Mostrar na seção" de
 * Categorias (5, 10, 15, 30 ou Todos), e 5 continua sendo o padrão.
 */
const limites = useLimites()
const recorte = computed(() => {
  const l = limites.limite('categorias')
  return l === 'todos' ? naoFavoritas.value : naoFavoritas.value.slice(0, l)
})

/* ------------------------------------------------------------------
   ANDAIME: o modelo de navegação. No produto só um dos dois existe; os
   dois convivem aqui para a comparação. A pesquisa que sustenta a escolha
   está no PESQUISA.md, secção "Trilha de icones".
------------------------------------------------------------------ */
// Rodada 27: o protótipo abre sempre na trilha. A barra única fica no código,
// sem apagar, mas o botão dela no andaime está travado: "nao precisa deletar,
// mas pode esconder do prototipo o 'barra unica'" (Mikaela, 20/10/2026).
const modelo = ref<'barra' | 'trilha'>('trilha')

/* ---------------------------- navegação ---------------------------- */
const painel = ref<'trabalho' | 'config'>('trabalho')
// O id vem da arvore do menu, e la os destinos nativos tem prefixo.
const destinoAtivo = ref('n-inicio')
const categoriaAtiva = ref<Categoria | null>(null)
/*
 * A regra dela vale tambem para Configuracoes, que e menu de primeiro nivel:
 * abrir cai no primeiro item da lista, e nao numa tela escolhida a dedo.
 */
const itemConfigAtivo = ref(gruposDeConfiguracao[0]?.itens[0]?.id ?? 'visao-geral')
const rotuloConfigAtivo = ref('')

const rotuloDoDestino = computed(() => {
  if (painel.value === 'config') return rotuloConfigAtivo.value || t.value.itens[itemConfigAtivo.value] || ''
  const nativo = menu.destinos.value.find(d => d.id === destinoAtivo.value)
  if (nativo) return rotuloDoNo(nativo)
  const emSecao = itensDeSecao.value.find(x => x.no.id === destinoAtivo.value)
  if (emSecao) return rotuloDoNo(emSecao.no)
  // Rodada 35: o dashboard aberto pelo submenu da categoria.
  const dash = dashboardAtivo.value
  if (dash) return dash.nome
  // Rodada 35: as telas que um nativo traz (Tarefas > Painel) e as telas de submenu.
  const qualquer = menu.acharNo(destinoAtivo.value)
  return qualquer ? rotuloDoNo(qualquer) : ''
})

/** O dashboard aberto no miolo, quando o destino é "dash:<id>" (rodada 35). */
const dashboardsDeItens = useDashboards()
const dashboardAtivo = computed(() => {
  const id = dashboardDoDestino(destinoAtivo.value)
  return id ? dashboardsDeItens.achar(id) : null
})

/** O nativo dono da tela ativa, quando ela é uma das telas dele (Tarefas > Painel). */
const nativoDono = computed(() => menu.destinos.value.find(d => d.filhos?.some(f => f.id === destinoAtivo.value)) ?? null)

const breadcrumb = computed(() => {
  if (painel.value === 'config') {
    const grupo = gruposDeConfiguracao.find(g => g.itens.some(i => i.id === itemConfigAtivo.value))
    return [workspace.nome, t.value.configuracoes, t.value.grupos[grupo?.id ?? ''] ?? '', rotuloDoDestino.value]
      .filter(Boolean)
  }
  if (categoriaAtiva.value) return [workspace.nome, t.value.categorias, categoriaAtiva.value.name]
  if (nativoDono.value) return [workspace.nome, rotuloDoNo(nativoDono.value), rotuloDoDestino.value]
  // O dashboard mora embaixo da categoria no menu, e a trilha diz isso.
  if (dashboardAtivo.value) {
    const c = categorias.value.find(x => x.id === dashboardAtivo.value!.categoriaId)
    return [workspace.nome, t.value.categorias, c?.name ?? '', dashboardAtivo.value.nome].filter(Boolean)
  }
  return [workspace.nome, rotuloDoDestino.value]
})

function irParaDestino(id: string) {
  // Rodada 36: abrir um destino sai de Configurações. Sem isto, abrir um
  // dashboard pela lista de Configurações deixava a trilha do topo em
  // Configurações e o miolo na tela de configuração.
  painel.value = 'trabalho'
  destinoAtivo.value = id
  categoriaAtiva.value = null
}

/** A casinha da barra do topo: volta ao Início, como hoje. */
const rotuloDoInicio = computed(() => {
  const inicio = menu.destinos.value[0]
  return inicio ? rotuloDoNo(inicio) : ''
})
function irParaInicio() {
  painel.value = 'trabalho'
  irParaDestino(menu.destinos.value[0]?.id ?? 'n-inicio')
}

function abrirCategoria(c: Categoria) {
  painel.value = 'trabalho'
  categoriaAtiva.value = c
  destinoAtivo.value = ''
}

function alternarFixar(id: number) {
  const c = categorias.value.find(x => x.id === id)
  if (!c) return
  const i = fixadasManualmente.value.indexOf(id)
  if (i >= 0) fixadasManualmente.value.splice(i, 1)
  else fixadasManualmente.value.push(id)

  toast.add({
    title: c.favorita ? t.value.desafixada(c.name) : t.value.fixada(c.name),
    icon: c.favorita ? 'i-lucide-star-off' : 'i-lucide-star',
    color: 'neutral',
  })
}

function abrirConfiguracoes() {
  if (!podeConfigurar.value) return
  levarFocoParaBarra(() => abrirConfiguracoesAgora())
}

function abrirConfiguracoesAgora() {
  const primeiro = gruposDeConfiguracao[0]?.itens[0]
  if (primeiro) {
    abrirItemDeConfiguracao(primeiro.id, t.value.itens[primeiro.id] ?? primeiro.id)
    return
  }
  painel.value = 'config'
  categoriaAtiva.value = null
}

function voltarParaTrabalho() {
  levarFocoParaBarra(() => { painel.value = 'trabalho' })
  // O id vem da arvore, onde o destino nativo tem prefixo: com 'inicio' a
  // volta deixava o menu inteiro sem linha ativa.
  destinoAtivo.value = menu.destinos.value[0]?.id ?? 'n-inicio'
}

function abrirItemDeConfiguracao(id: string, rotulo: string) {
  itemConfigAtivo.value = id
  rotuloConfigAtivo.value = rotulo
  // No modelo de trilha a configuracao vive dentro do painel da area, e sem
  // isto o clique num item de configuracao nao mudava o miolo: a barra
  // marcava o item e a direita continuava na tela anterior.
  painel.value = 'config'
  categoriaAtiva.value = null
  // Interface > Menus abre o editor do menu, que é onde o administrador
  // reordena, reagrupa e escolhe o tipo de cada tela.
  if (id === 'menus') abrirEditor(null)
  // Interface > Casos de uso abre a Central (rodada 18), a mesma do "+" do Início.
  if (id === 'casos-de-uso') janelasDeCasos.central.value = true
}

/** "Configurar categoria" leva para Estrutura > Categorias, já na área certa. */
function configurarCategoriaAtual() {
  painel.value = 'config'
  abrirItemDeConfiguracao('cfg-categorias', t.value.itens['cfg-categorias'] ?? '')
}

/**
 * O botão "+". Existe nos dois modelos e abre o mesmo menu: é o padrão do
 * Notion, do Asana, do monday e do Jira novo, onde "Create" fica na barra de
 * cima. Cada opção é maquete e diz isso no toast.
 */
/*
 * O "+" DO TOPO (rodada 20).
 *
 * Seção, menu e categoria abrem as MESMAS janelas do "+" do Início: o atalho
 * corta o caminho, e a janela que aparece é uma só em qualquer porta. Antes o
 * topo abria o editor com o formulário antigo, e item, tarefa e categoria só
 * davam um aviso.
 *
 * "Seção" segue o modelo: na trilha é a seção pessoal do Início (rodada
 * 15); na barra única, que não tem seção pessoal, é a seção de menu do
 * workspace, no editor.
 */
const janelasDaTrilha = useJanelasDaTrilha()

const itensDeCriar = computed(() => [[
  { label: t.value.criarItem, icon: 'i-lucide-file-plus', onSelect: () => abrirMaquete('item') },
  { label: t.value.criarTarefa, icon: 'i-lucide-square-check-big', onSelect: () => abrirMaquete('tarefa') },
], [
  {
    label: t.value.criarSecaoTitulo,
    icon: 'i-lucide-layers',
    onSelect: () => {
      if (modelo.value === 'trilha') janelasDaTrilha.criandoSecao.value = 'nova'
      else abrirEditor('secao')
    },
  },
  { label: t.value.criarMenuTitulo, icon: 'i-lucide-menu', onSelect: () => { janelasDaTrilha.criandoMenu.value = 'inicio' } },
  { label: t.value.criarCategoriaTitulo, icon: 'i-lucide-folder-plus', onSelect: () => { janelasDaTrilha.criandoCategoria.value = true } },
]])

/** "Nova tela" de uma seção: o formulário único de menu, já dentro dela. */
function criarMenuEm(secaoId?: string) {
  const daArvore = !!secaoId && menu.secoes.value.some(s => s.id === secaoId)
  janelasDaTrilha.criandoMenu.value = daArvore ? `secao:${secaoId}` : 'inicio'
}

function abrirEditor(form: 'secao' | 'item' | null) {
  formInicial.value = form
  editando.value = true
}

const maqueteAberta = ref(false)
const modoDaMaquete = ref<'item' | 'tarefa'>('item')
const usouMaquete = ref(false)

function abrirMaquete(modo: 'item' | 'tarefa') {
  modoDaMaquete.value = modo
  usouMaquete.value = true
  maqueteAberta.value = true
}

/* ------------------------------ camadas ------------------------------ */
const vendoTodas = ref(false)
const editando = ref(false)
const formInicial = ref<'secao' | 'item' | null>(null)
const buscando = ref(false)
/*
 * O termo da busca global (rodada 17). Ele chega preenchido quando a busca
 * nasce de um filtro do menu sem resultado: "Buscar X no workspace" leva o X.
 */
const termoDaBusca = ref('')
function abrirBusca(termo?: string) {
  termoDaBusca.value = termo ?? ''
  buscando.value = true
}
watch(buscando, (v) => { if (!v) termoDaBusca.value = '' })

/*
 * Cada camada só existe depois da primeira vez que foi aberta, e depois disso
 * fica montada: assim a entrada não paga por elas, e fechar continua com a
 * animação de saída, que um `v-if` no próprio `open` cortaria pela metade.
 */
const usouTodas = ref(false)
const usouEditor = ref(false)
watch(vendoTodas, v => { if (v) usouTodas.value = true })
watch(editando, v => { if (v) usouEditor.value = true })

/** A paleta busca em tudo: categoria, seção do workspace e configuração. */
const gruposDaBusca = computed(() => [
  {
    id: 'categorias',
    label: t.value.categorias,
    items: categorias.value.map(c => ({
      label: c.name,
      icon: c.icon ?? 'i-lucide-folder',
      suffix: c.description,
      onSelect: () => { abrirCategoria(c); painel.value = 'trabalho' },
    })),
  },
  {
    id: 'destinos',
    label: workspace.nome,
    items: [
      ...menu.destinos.value.flatMap(d => [d, ...(d.filhos ?? [])].map(n => ({
        label: rotuloDoNo(n),
        icon: n.icone,
        suffix: n === d ? undefined : rotuloDoNo(d),
        onSelect: () => { irParaDestino(n.id); painel.value = 'trabalho' },
      }))),
      ...itensDeSecao.value.map(({ no, secao }) => ({
        label: rotuloDoNo(no),
        icon: no.icone,
        suffix: rotuloDoNo(secao),
        onSelect: () => { irParaDestino(no.id); painel.value = 'trabalho' },
      })),
    ],
  },
  {
    // A busca tambem e porta do editor: quem procura "menu" quer mexer nele.
    id: 'acoes',
    label: t.value.editarMenu,
    items: podeConfigurar.value
      ? [{
          label: t.value.editarMenu,
          icon: 'i-lucide-list-tree',
          suffix: t.value.editarMenuDica,
          onSelect: () => abrirEditor(null),
        }]
      : [],
  },
  {
    id: 'config',
    label: t.value.configuracoes,
    items: gruposDeConfiguracao.flatMap(g => g.itens.map(i => ({
      label: t.value.itens[i.id] ?? i.id,
      icon: i.icone,
      suffix: t.value.grupos[g.id],
      onSelect: () => {
        if (!podeConfigurar.value) return
        painel.value = 'config'
        abrirItemDeConfiguracao(i.id, t.value.itens[i.id] ?? i.id)
      },
    }))),
  },
])

/* ============ RECOLHER E EXPANDIR (rodada 14) ============ */

const recolhido = useMenuRecolhido()
const aside = ref<HTMLElement | null>(null)

/*
 * O FOCO NÃO PODE CAIR NO VAZIO. Trocar de painel (trabalho e configurações)
 * ou recolher a barra desmonta o botão que tinha o foco, e o navegador o
 * devolve ao <body>: quem usa teclado ou leitor de tela perde o lugar e
 * recomeça do topo da página. Achado da revisão de acessibilidade desta
 * rodada (WCAG 2.4.3). Agora o foco vai para o primeiro botão do que entrou.
 */
async function levarFocoParaBarra(mudanca: () => void) {
  const ativo = import.meta.client ? document.activeElement : null
  const estavaNaBarra = !!ativo && !!aside.value?.contains(ativo)
  mudanca()
  if (!estavaNaBarra) return
  await nextTick()
  aside.value?.querySelector<HTMLElement>('button:not([disabled]), input')?.focus()
}

function alternarRecolhido() {
  levarFocoParaBarra(() => { recolhido.value = !recolhido.value })
}

/* ============ ARRASTAR A BORDA (rodada 19) ============
 *
 *   "com o menu aberto, eu devo poder arrastar a lateral, como no clickup,
 *    expandindo ainda mais ele (até um limite saudável) ou recolhendo. se eu
 *    recolher passando de um limite mínimo, ele minimiza o menu como se eu
 *    tivesse clicado já no botão de minimizar" (Mikaela)
 *
 * Os limites, em pixels:
 *   mínimo   o menor em que os rótulos ainda leem ("Solicitações de compra"
 *            corta, mas "Fornecedores" e os nomes das seções inteiros);
 *   máximo   pouco mais que o dobro do mínimo: daí em diante a barra rouba
 *            a tela sem mostrar nada a mais, porque os nomes já cabem;
 *   recolhe  abaixo disto, soltar recolhe. Entre ele e o mínimo a borda para
 *            no mínimo e o menu esmaece: é o aviso de "soltando aqui, fecha",
 *            com a chance de voltar antes de soltar.
 * A trilha soma os 72 px dela às medidas do painel.
 */
const MEDIDAS = {
  barra: { padrao: 280, min: 220, max: 440, recolhe: 170 },
  trilha: { padrao: 304, min: 264, max: 480, recolhe: 210 },
} as const
const larguras = useState<Record<'barra' | 'trilha', number>>('menu-larguras', () => ({ barra: 280, trilha: 304 }))
const medidas = computed(() => MEDIDAS[modelo.value])
const largura = computed(() => larguras.value[modelo.value])
const redimensionando = ref(false)
const vaiRecolher = ref(false)

function definirLargura(v: number) {
  const m = medidas.value
  larguras.value = { ...larguras.value, [modelo.value]: Math.round(Math.min(m.max, Math.max(m.min, v))) }
}

function comecarArraste(e: PointerEvent) {
  if (e.button !== 0) return
  e.preventDefault()
  const borda = e.currentTarget as HTMLElement
  const inicioX = e.clientX
  const inicioLargura = largura.value
  borda.setPointerCapture(e.pointerId)
  redimensionando.value = true
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'

  const mover = (ev: PointerEvent) => {
    const bruto = inicioLargura + ev.clientX - inicioX
    vaiRecolher.value = bruto < medidas.value.recolhe
    definirLargura(bruto)
  }
  const soltar = () => {
    borda.removeEventListener('pointermove', mover)
    borda.removeEventListener('pointerup', soltar)
    borda.removeEventListener('pointercancel', soltar)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    redimensionando.value = false
    if (vaiRecolher.value) {
      vaiRecolher.value = false
      // Reabre do tamanho que tinha antes do gesto, não do mínimo.
      definirLargura(inicioLargura)
      alternarRecolhido()
    }
  }
  borda.addEventListener('pointermove', mover)
  borda.addEventListener('pointerup', soltar)
  borda.addEventListener('pointercancel', soltar)
}

/** O mesmo pelo teclado: setas de 16 px; seta para a esquerda no mínimo recolhe. */
function teclarBorda(e: KeyboardEvent) {
  const m = medidas.value
  if (e.key === 'ArrowRight') definirLargura(largura.value + 16)
  else if (e.key === 'ArrowLeft') {
    if (largura.value <= m.min) alternarRecolhido()
    else definirLargura(largura.value - 16)
  }
  else if (e.key === 'Home') definirLargura(m.min)
  else if (e.key === 'End') definirLargura(m.max)
  else return
  e.preventDefault()
}

defineShortcuts({
  meta_k: () => { buscando.value = !buscando.value },
  // O atalho do ClickUp para mostrar e esconder a barra.
  'meta_\\': () => alternarRecolhido(),
})

/* ============ RENOMEAR, PELO BOTÃO DIREITO (rodada 14) ============ */

const renomeando = useRenomeando()
const nomeNovo = ref('')
const abrindoRenomear = computed({
  get: () => renomeando.value !== null,
  set: (v) => { if (!v) renomeando.value = null },
})
watch(renomeando, (id) => {
  if (id) nomeNovo.value = menu.acharNo(id)?.rotulo ?? ''
})

function aplicarNome() {
  if (renomeando.value) menu.renomear(renomeando.value, nomeNovo.value)
  renomeando.value = null
}

/** O menu de ajuda é maquete: os três caminhos saem do produto para fora dele. */
function avisarAjuda(rotulo: string) {
  toast.add({
    title: t.value.criarAberto(rotulo.toLowerCase()),
    icon: 'i-lucide-hammer',
    color: 'neutral',
  })
}

/*
 * O AVISO DA PRIMEIRA MEXIDA (rodada 12).
 *
 * "na hora que o user mover O PRIMEIRO, deve aparecer em algum lugar um toast
 * ou algo do tipo dizendo que tem alteracoes nao salvas" (Mikaela).
 *
 * Uma vez por sessao de edicao, e nao a cada arraste: o cartao flutuante fica
 * na tela o tempo todo depois disso, entao repetir o toast seria barulho.
 */
watch(() => menu.alterado.value, (agora, antes) => {
  if (!agora || antes) return
  toast.add({
    title: t.value.naoSalvoTitulo,
    description: t.value.naoSalvoDica,
    icon: 'i-lucide-circle-alert',
    color: 'warning',
  })
})

function emBreve() {
  toast.add({
    title: 'Maquete',
    description: 'Este caminho não faz parte do que está sendo proposto aqui.',
    icon: 'i-lucide-hammer',
    color: 'neutral',
  })
}
</script>

<template>
  <div class="flex h-dvh flex-col bg-elevated/30">
    <!-- ============================================================
         O QUADRO DO PRODUTO: barra lateral mais conteúdo.
         A barra tem dois painéis que se substituem, nunca se somam.
    ============================================================ -->
    <!--
      A barra de andaime tem 76px (duas fileiras), e a folga aqui era de 52px:
      os ultimos 24px da barra lateral ficavam ATRAS dela, e quem pagava era o
      rodape, onde moram Configuracoes e o icone de ajuda. Rodada 9.
    -->
    <div class="flex min-h-0 flex-1 gap-0 pb-20">
      <div class="flex min-h-0 w-full overflow-hidden bg-default">
        <!-- barra lateral -->
        <!--
          A largura anda junto com o recolher (rodada 14), em 200 ms. O
          prefers-reduced-motion do main.css zera a transição.
        -->
        <aside
          ref="aside"
          class="relative hidden shrink-0 overflow-hidden border-r border-default bg-elevated/40 ease-out md:block"
          :class="[
            modelo === 'trilha' ? (recolhido ? 'w-[4.5rem]' : '') : (recolhido ? 'w-14' : ''),
            redimensionando ? 'transition-none' : 'transition-[width] duration-200',
            // Soltar aqui recolhe: o menu esmaece como aviso.
            vaiRecolher ? 'opacity-50' : '',
          ]"
          :style="recolhido ? undefined : { width: `${largura}px` }"
          :aria-label="t.menuLateral"
        >
          <!--
            RODADA 35: "ou você deve prototipar idêntico, mudando só o menu
            lateral [...] recomendo prototipar idêntico por enquanto" (Mikaela).
            O topo do menu é o de hoje: o workspace com a referência e a seta de
            troca, e o "Buscar..." com Ctrl K. Nada aqui é proposta.
          -->
          <div class="flex h-full min-h-0 flex-col">
          <div class="shrink-0 space-y-0.5 border-b border-default p-2">
            <UTooltip :text="workspace.nome" :disabled="!recolhido" :content="{ side: 'right' }">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-elevated"
                :class="recolhido ? 'justify-center' : ''"
                :aria-label="t.trocarWorkspace"
              >
                <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {{ workspace.nome.slice(0, 2).toUpperCase() }}
                </span>
                <span v-if="!recolhido" class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace.nome }}</span>
                  <span class="block truncate text-xs text-muted">{{ workspace.referencia }}</span>
                </span>
                <UIcon v-if="!recolhido" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
              </button>
            </UTooltip>
            <UTooltip :text="t.cascaBuscar" :kbds="['ctrl', 'K']" :disabled="!recolhido" :content="{ side: 'right' }">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated"
                :class="recolhido ? 'justify-center' : ''"
                :aria-label="t.cascaBuscar"
                @click="abrirBusca()"
              >
                <UIcon name="i-lucide-search" class="size-4 shrink-0 text-highlighted" />
                <template v-if="!recolhido">
                  <span class="flex-1 text-sm font-medium text-highlighted">{{ t.cascaBuscar }}</span>
                  <UKbd value="ctrl" size="sm" />
                  <UKbd value="K" size="sm" />
                </template>
              </button>
            </UTooltip>
          </div>
          <div class="flex min-h-0 flex-1">
          <!-- MODELO ALTERNATIVO: trilha de icones mais painel da area. -->
          <ModeloTrilha
            v-if="modelo === 'trilha'"
            :t="t"
            :categorias="categorias"
            :favoritas="favoritas"
            :recorte="recorte"
            :total-de-categorias="categorias.length"
            :destino-ativo="destinoAtivo"
            :categoria-ativa-id="categoriaAtiva?.id ?? null"
            :item-config-ativo="itemConfigAtivo"
            :estado="estadoDoPainel"
            :pode-configurar="podeConfigurar"
            :itens-de-criar="itensDeCriar"
            :ordem="ordem"
            :recolhido="recolhido"
            @destino="irParaDestino"
            @categoria="abrirCategoria"
            @alternar-fixar="alternarFixar"
            @ver-todas="vendoTodas = true"
            @busca="abrirBusca"
            @item="abrirItemDeConfiguracao"
            @ajuda="avisarAjuda"
            @ordem="trocarOrdem"
            @virar-manual="virarOrdemManual"
            @nova-tela="criarMenuEm"
            @configurar-categoria="configurarCategoriaAtual"
            @recolher="alternarRecolhido"
          />
          <!-- RECOLHIDA (rodada 14): a coluna de ícones, nos dois painéis. -->
          <BarraRecolhida
            v-else-if="recolhido"
            class="animate-[entrada_0.2s_ease-out_both]"
            :t="t"
            :favoritas="favoritas"
            :recorte="recorte"
            :total-de-categorias="categorias.length"
            :destino-ativo="painel === 'trabalho' ? destinoAtivo : ''"
            :categoria-ativa-id="painel === 'trabalho' ? (categoriaAtiva?.id ?? null) : null"
            :pode-configurar="podeConfigurar"
            @destino="id => { painel = 'trabalho'; irParaDestino(id) }"
            @categoria="c => { painel = 'trabalho'; abrirCategoria(c) }"
            @alternar-fixar="alternarFixar"
            @ver-todas="vendoTodas = true"
            @configuracoes="abrirConfiguracoes"
            @ajuda="avisarAjuda"
            @expandir="alternarRecolhido"
            @nova-tela="criarMenuEm"
            @configurar-categoria="configurarCategoriaAtual"
          />
          <template v-else>
          <!--
            A troca de painel usa a animação `entrada` do main.css, a mesma do
            resto do repositório, em vez de um <Transition>. Keyframe não depende
            de transitionend para se limpar, então o painel nunca fica preso em
            opacity 0, e o prefers-reduced-motion do main.css continua valendo.
          -->
          <PainelTrabalho
              v-if="painel === 'trabalho'"
              key="trabalho"
              class="animate-[entrada_0.2s_ease-out_both]"
              :t="t"
              :favoritas="favoritas"
              :recorte="recorte"
              :todas="categorias"
              :total-de-categorias="categorias.length"
              :destino-ativo="destinoAtivo"
              :categoria-ativa-id="categoriaAtiva?.id ?? null"
              :estado="estadoDoPainel"
              :pode-configurar="podeConfigurar"
              :ordem="ordem"
              @destino="irParaDestino"
              @categoria="abrirCategoria"
              @alternar-fixar="alternarFixar"
              @ver-todas="vendoTodas = true"
              @configuracoes="abrirConfiguracoes"
              @busca="abrirBusca"
              @criar="emBreve"
              @ajuda="avisarAjuda"
              @ordem="trocarOrdem"
              @virar-manual="virarOrdemManual"
              @nova-tela="criarMenuEm"
              @configurar-categoria="configurarCategoriaAtual"
              @recolher="alternarRecolhido"
            />
          <PainelConfiguracoes
            v-else
            key="config"
            class="animate-[entrada_0.2s_ease-out_both]"
            :t="t"
            :item-ativo="itemConfigAtivo"
            @voltar="voltarParaTrabalho"
            @item="abrirItemDeConfiguracao"
            @recolher="alternarRecolhido"
          />
          </template>
          </div>
          </div>
          <!--
            A BORDA QUE SE ARRASTA (rodada 19). Invisível parada; acende no
            hover, no foco e durante o arraste, e fica amarela quando soltar ali
            vai recolher o menu.
          -->
          <div
            v-if="!recolhido"
            role="separator"
            aria-orientation="vertical"
            tabindex="0"
            :aria-label="t.redimensionarMenu"
            :aria-valuenow="largura"
            :aria-valuemin="medidas.min"
            :aria-valuemax="medidas.max"
            :title="t.redimensionarDica"
            class="group/borda absolute inset-y-0 right-0 z-40 w-2 cursor-col-resize touch-none outline-none"
            @pointerdown="comecarArraste"
            @dblclick="definirLargura(medidas.padrao)"
            @keydown="teclarBorda"
          >
            <span
              class="absolute inset-y-0 right-0 w-0.5 transition-colors duration-150"
              :class="redimensionando
                ? (vaiRecolher ? 'bg-warning' : 'bg-primary')
                : 'bg-transparent group-hover/borda:bg-primary/50 group-focus-visible/borda:bg-primary'"
            />
          </div>
        </aside>

        <!-- conteúdo, com a barra do topo de hoje em cima -->
        <div class="flex min-w-0 flex-1 flex-col">
          <!--
            A BARRA DO TOPO, copiada do develop em 2026-11-24 (rodada 35). Nada
            aqui é proposta: recolher o menu, voltar, avançar, recarregar,
            início, a trilha com Ctrl B e a estrela, idioma, tema, Suporte, sino
            e avatar. A trilha mora aqui, como hoje, e não dentro da tela.
          -->
          <header class="flex h-12 shrink-0 items-center gap-1 border-b border-default bg-default px-2">
            <UTooltip :text="t.cascaMenu">
              <UButton icon="i-lucide-panel-left" color="neutral" variant="ghost" size="xs" :aria-label="t.cascaMenu" @click="alternarRecolhido" />
            </UTooltip>
            <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.cascaVoltar" />
            <UButton icon="i-lucide-arrow-right" color="neutral" variant="ghost" size="xs" :aria-label="t.cascaAvancar" />
            <UButton icon="i-lucide-rotate-cw" color="neutral" variant="ghost" size="xs" :aria-label="t.cascaRecarregar" />
            <UButton icon="i-lucide-house" color="neutral" variant="ghost" size="xs" :aria-label="rotuloDoInicio" @click="irParaInicio" />

            <div class="mx-2 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-elevated/70 px-3 py-1.5">
              <nav class="flex min-w-0 items-center gap-1.5 text-xs" :aria-label="t.cascaTrilha">
                <template v-for="(parte, i) in breadcrumb" :key="i">
                  <UIcon v-if="i" name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
                  <span class="truncate" :class="i === breadcrumb.length - 1 ? 'text-highlighted' : 'text-toned'">{{ parte }}</span>
                </template>
              </nav>
              <span class="ml-auto hidden shrink-0 items-center gap-1 sm:flex">
                <UKbd value="ctrl" size="sm" />
                <UKbd value="B" size="sm" />
                <UIcon name="i-lucide-star" class="ml-1 size-3.5 text-muted" :aria-label="t.cascaFavoritar" />
              </span>
            </div>

            <div class="flex shrink-0 items-center gap-1.5">
              <span class="flex size-6 items-center justify-center rounded-full bg-success/15 text-[9px] font-bold text-success" :aria-label="t.cascaIdioma">{{ siglaDoIdioma }}</span>
              <UButton :icon="modoDeCor.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="ghost" size="xs" :aria-label="t.cascaTema" @click="alternarTema" />
              <UButton icon="i-lucide-headset" :label="t.cascaSuporte" color="neutral" variant="outline" size="xs" class="hidden sm:inline-flex" @click="avisarAjuda(t.cascaSuporte)" />
              <UChip text="99+" color="error" size="3xl">
                <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" :aria-label="t.cascaNotificacoes" />
              </UChip>
              <UChip color="success" size="sm" inset>
                <UAvatar size="sm" :text="usuaria.iniciais" :alt="t.cascaConta" />
              </UChip>
            </div>
          </header>

          <Conteudo
            :t="t"
            :destino="destinoAtivo"
            :rotulo-do-destino="rotuloDoDestino"
            :categoria="categoriaAtiva"
            :categorias="categorias"
            :item-config="painel === 'config' ? itemConfigAtivo : undefined"
            @configurar-categoria="configurarCategoriaAtual"
            @ir-para="irParaDestino"
          />
        </div>
      </div>
    </div>

    <!-- aviso de tela estreita: a barra some, como no produto -->
    <p class="px-4 pb-24 text-center text-sm text-muted md:hidden">
      {{ t.conteudoIlustrativo }}
    </p>

    <!-- ===================== camadas ===================== -->
    <TodasAsCategorias
      v-if="usouTodas"
      v-model:open="vendoTodas"
      :categorias="categorias"
      :t="t"
      @alternar-fixar="alternarFixar"
      @abrir="abrirCategoria"
    />

    <EditorDeMenus
      v-if="usouEditor"
      v-model:open="editando"
      :t="t"
      :modelo="modelo"
      :abrir-formulario="formInicial"
    />

    <UModal v-model:open="buscando" :ui="{ content: 'max-w-xl' }">
      <template #content>
        <UCommandPalette
          v-model:search-term="termoDaBusca"
          :groups="gruposDaBusca"
          :placeholder="t.buscarDica"
          :close="{ onClick: () => buscando = false }"
          class="h-80"
          @update:model-value="buscando = false"
        />
      </template>
    </UModal>

    <!--
      Casos de uso, importar e exportar (rodada 18). Moram aqui, e não no
      modelo de trilha, porque Configurações > Interface > Casos de uso também
      abre a Central, nos dois modelos.
    -->
    <CentralDeCasos :t="t" />
    <UsarCaso :t="t" />
    <ImportarCaso :t="t" />
    <CriarCaso :t="t" />

    <!-- Renomear, aberto pelo botão direito (rodada 14). -->
    <UModal v-model:open="abrindoRenomear" :title="t.renomearTitulo" :ui="{ content: MOLDURA.formulario, overlay: MOLDURA.sobreposicao }">
      <template #body>
        <form id="form-renomear" class="space-y-4" @submit.prevent="aplicarNome">
          <UFormField :label="t.renomearCampo">
            <UInput v-model="nomeNovo" class="w-full" autofocus />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <RodapeDaJanela
          :cancelar="t.cancelar"
          :acao="t.renomearAplicar"
          form="form-renomear"
          :desligado="!nomeNovo.trim()"
          @cancelar="renomeando = null"
        />
      </template>
    </UModal>

    <!--
      As janelas de criar menu e categoria moram aqui desde a rodada 20, e não
      dentro do modelo de trilha: o "+" do topo e o editor abrem as duas nos
      dois modelos.
    -->
    <CriarMenu :t="t" />
    <!-- Rodada 28: "Adicionar em", a janela de escolher um menu que já existe, nos 2 escopos. -->
    <EscolherMenu :t="t" :categorias="categorias" :pode-configurar="podeConfigurar" />
    <CriarCategoria :t="t" />
    <!-- Rodada 34: excluir painel, ou seção com painel, pergunta antes. -->
    <ConfirmarExclusao :t="t" />
    <CriarMaquete v-if="usouMaquete" v-model:open="maqueteAberta" :t="t" :modo="modoDaMaquete" />

    <!-- ============== ANDAIME, não faz parte da proposta ============== -->
    <!--
      Sem `backdrop-blur` desde a rodada 13: uma faixa desfocada da largura da
      tela obriga o navegador a recompor a página inteira a cada repintura, e
      isso é sentido como travada. O fundo já era 95% opaco.
    -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated">
      <div class="flex flex-wrap items-center gap-1.5 px-4 py-1.5">
        <span class="mr-0.5 text-xs font-semibold uppercase tracking-wider text-muted">
          {{ t.cenarioRotulo }}
        </span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado === e.valor ? 'primary' : 'neutral'"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="estado = e.valor"
        />

        <span class="ml-2 mr-0.5 text-xs font-semibold uppercase tracking-wider text-muted">
          {{ t.modeloRotulo }}
        </span>
        <UTooltip v-for="m in [{ v: 'barra', r: t.modeloBarra }, { v: 'trilha', r: t.modeloTrilha }]" :key="m.v" :text="m.v === 'barra' ? t.modeloBarraTravado : undefined" :disabled="m.v !== 'barra'">
          <!-- O span segura o tooltip: botão desligado não recebe o hover. -->
          <span>
            <UButton
              :label="m.r"
              size="xs"
              class="transition-transform enabled:hover:-translate-y-0.5"
              :color="modelo === m.v ? 'primary' : 'neutral'"
              :variant="modelo === m.v ? 'solid' : 'subtle'"
              :disabled="m.v === 'barra'"
              @click="modelo = m.v as 'barra' | 'trilha'"
            />
          </span>
        </UTooltip>

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-1.5">
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/menu-lateral"
          />
        </span>
      </div>
    </div>
  </div>
</template>
