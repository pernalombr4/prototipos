<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import SecaoDeMenu from './_SecaoDeMenu.vue'
import AvisosDoMenu from './_AvisosDoMenu.vue'
import AdicionarASecao from './_AdicionarASecao.vue'
import { useArraste, useMenuDoWorkspace, type Atalho } from './estado'
import { chaveDoAtalho, useTrilha } from './trilha'
import { useAcoesDoMenu, type Acoes } from './acoes'
import { rotuloDoNo } from './rotulos'
import type { Categoria, NoDoMenu } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O MENU INÍCIO (rodada 15). É o "Início" do ClickUp, que a Mikaela pediu
 * para o ENSPACE ter igual, no lugar do antigo "Trabalho":
 *
 *   EM CIMA, os itens nativos. Escolhe-se quais aparecem; o que sai fica em
 *   "⋯ Mais", com alfinete para voltar e atalho para Personalizar. No
 *   ClickUp eles têm ordem fixa; aqui, desde a rodada 16, SE ARRASTAM e todos
 *   se ocultam, a pedido dela.
 *
 *   EMBAIXO, as SEÇÕES. Elas se reordenam arrastando aqui mesmo, sem abrir
 *   Personalizar. Clicar no nome recolhe e expande (e só isso: no ClickUp
 *   abrir uma seção não navega). No hover aparecem "…" e "+". Uma seção
 *   pessoal pode ter um MENU inteiro dentro, com as telas dele como
 *   submenus: "uma seção pode ter menus com submenus dentro".
 *
 *   NO PÉ, "Personalizar a barra lateral", até a primeira vez que for usado.
 *   Depois o botão sobe para o cabeçalho e some daqui.
 *
 * `flutuante` é o mesmo menu aberto em popover, pelo hover na trilha: sem
 * arraste e sem "…" e "+", que abririam um popover dentro de outro e o de
 * fora fecharia quando o mouse fosse para o de dentro.
 */
const props = defineProps<{
  t: TextosDaTela
  categorias: Categoria[]
  favoritas: Categoria[]
  recorte: Categoria[]
  totalDeCategorias: number
  destinoAtivo: string
  categoriaAtivaId: number | null
  podeConfigurar: boolean
  ordem: 'uso' | 'alfabetica' | 'recentes' | 'manual'
  flutuante?: boolean
  /** Rodada 17: o texto da lupa do cabeçalho. */
  termo?: string
  /** Rodada 17: os tipos marcados no filtro do cabeçalho. */
  tipos?: string[]
}>()

const emit = defineEmits<{
  destino: [id: string]
  categoria: [c: Categoria]
  alternarFixar: [id: number]
  verTodas: []
  novaTela: [secaoId: string]
  configurarCategoria: [c: Categoria]
  ordem: [valor: 'uso' | 'alfabetica' | 'recentes' | 'manual']
  virarManual: []
  buscaGlobal: [termo: string]
}>()

const menu = useMenuDoWorkspace()
const trilha = useTrilha()
const arraste = useArraste()
const toast = useToast()

const rotuloDe = (no: NoDoMenu) => rotuloDoNo(no, props.t)

/* ============ FILTRAR O MENU (rodada 17) ============
 *
 * Duas coisas filtram, e as duas vêm do cabeçalho, como no ClickUp:
 *
 *   a LUPA, que procura pelo nome. Ela procura também no que não está à
 *   vista: nos itens de "⋯ Mais", nas seções recolhidas e em todas as
 *   categorias, não só nas cinco do recorte. Quem filtra está procurando
 *   justamente o que não achou olhando;
 *   o FILTRO por tipo (o "Espaço, Não lida, DMs" de lá): Categorias, Telas
 *   e Com pendências, marcados juntos valem como "ou".
 *
 * Filtrando, toda seção com resultado abre, as vazias somem e nada se
 * arrasta. Sem resultado, o aviso leva para a busca do workspace inteiro.
 */
function normaliza(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
const termoLimpo = computed(() => normaliza(props.termo?.trim() ?? ''))
const tiposAtivos = computed(() => props.tipos ?? [])
const filtrando = computed(() => termoLimpo.value.length > 0 || tiposAtivos.value.length > 0)

function casa(texto: string) {
  return !termoLimpo.value || normaliza(texto).includes(termoLimpo.value)
}
function passaTipo(tipo: 'categorias' | 'telas', pendente = false) {
  const t = tiposAtivos.value
  return !t.length || t.includes(tipo) || (pendente && t.includes('pendencias'))
}

const podeArrastar = computed(() => !props.flutuante && !filtrando.value)

/* ======================= os itens nativos, em ordem fixa ======================= */

interface Nativo { id: string, rotulo: string, icone: string, no?: NoDoMenu }

const nativos = computed<Nativo[]>(() => [
  ...menu.destinosDaBarra.value.map(d => ({ id: d.id, rotulo: rotuloDe(d), icone: d.icone, no: d })),
  // A camada "ver todas" vira item nativo opcional, como o "Todos os Espaços" de lá.
  { id: 'todas-categorias', rotulo: props.t.todasTitulo, icone: 'i-lucide-layout-grid' },
])
const idsDosNativos = computed(() => nativos.value.map(n => n.id))
const nativosVisiveis = computed(() => trilha.ordemDoInicio(idsDosNativos.value)
  .map(id => nativos.value.find(n => n.id === id)!)
  .filter((n) => {
    if (!n) return false
    // Filtrando, os de "⋯ Mais" entram também.
    if (!filtrando.value) return !trilha.prefs.value.inicioOcultos.includes(n.id)
    const tipo = n.id === 'todas-categorias' ? 'categorias' : 'telas'
    return casa(n.rotulo) && passaTipo(tipo, (contadorDe(n) ?? 0) > 0)
  }))
const nativosNoMais = computed(() => nativos.value.filter(n => trilha.prefs.value.inicioOcultos.includes(n.id)))

function abrirNativo(n: Nativo) {
  if (n.id === 'todas-categorias') emit('verTodas')
  else emit('destino', n.id)
}

function contadorDe(n: Nativo) {
  if (n.no?.chave === 'inbox') return menu.naoLidas.value || undefined
  if (n.no?.chave === 'tarefas') return 3
  return undefined
}

const acoes = useAcoesDoMenu({
  t: () => props.t,
  podeConfigurar: () => props.podeConfigurar,
  rotuloDe,
  abrirDestino: id => emit('destino', id),
  abrirCategoria: c => emit('categoria', c),
  alternarFixar: id => emit('alternarFixar', id),
  configurarCategoria: c => emit('configurarCategoria', c),
  novaTela: id => emit('novaTela', id),
  secaoAberta: id => !trilha.recolhidas.value.includes(id),
  alternarSecao: id => trilha.alternarRecolhida(id),
})

/** Sobe ou desce um nativo entre os que aparecem: o arraste sem mouse. */
function passoDoNativo(n: Nativo, passo: -1 | 1) {
  const lista = nativosVisiveis.value.map(x => x.id)
  const vizinho = lista[lista.indexOf(n.id) + passo]
  if (vizinho) trilha.moverNoInicio(n.id, vizinho, passo < 0 ? 'antes' : 'depois', idsDosNativos.value)
}

function largarNoNativo(alvo: string, p: 'antes' | 'depois' | 'dentro') {
  const quem = arraste.arrastando.value
  arraste.terminar()
  if (!quem?.startsWith('nativo:')) return
  const id = quem.slice('nativo:'.length)
  if (id !== alvo) trilha.moverNoInicio(id, alvo, p === 'antes' ? 'antes' : 'depois', idsDosNativos.value)
}

/** O "…" de um nativo: ir, mover e tirar do Início. Nenhum é travado (rodada 16). */
function acoesDoNativo(n: Nativo): Acoes {
  const ir = [
    { label: props.t.ctxAbrir, icon: 'i-lucide-arrow-up-right', onSelect: () => abrirNativo(n) },
    { label: props.t.ctxNovaAba, icon: 'i-lucide-external-link', onSelect: () => toast.add({ title: props.t.novaAbaMaquete, icon: 'i-lucide-hammer', color: 'neutral' as const }) },
    { label: props.t.ctxCopiarLink, icon: 'i-lucide-link', onSelect: () => acoes.copiarLink(n.id) },
  ]
  const lista = nativosVisiveis.value.map(x => x.id)
  const i = lista.indexOf(n.id)
  return [
    ir,
    [
      { label: props.t.ctxSubir, icon: 'i-lucide-arrow-up', kbds: ['alt', 'arrowup'], disabled: i <= 0, onSelect: () => passoDoNativo(n, -1) },
      { label: props.t.ctxDescer, icon: 'i-lucide-arrow-down', kbds: ['alt', 'arrowdown'], disabled: i >= lista.length - 1, onSelect: () => passoDoNativo(n, 1) },
    ],
    [{ label: props.t.ocultarDoInicio, icon: 'i-lucide-eye-off', onSelect: () => trilha.mostrarNoInicio(n.id, false) }],
  ]
}

/* =============================== as seções =============================== */

const secoesDoAdmin = computed(() => menu.secoesNoPainel.value.filter(s => (s.painel ?? 'trabalho') === 'trabalho'))

interface SecaoDoInicio {
  id: string
  tipo: 'favoritos' | 'categorias' | 'admin' | 'pessoal'
  rotulo: string
  icone: string
  no?: NoDoMenu
}

const todasAsSecoes = computed<SecaoDoInicio[]>(() => {
  const lista: SecaoDoInicio[] = [
    { id: 'favoritos', tipo: 'favoritos', rotulo: props.t.favoritos, icone: 'i-lucide-star' },
    { id: 'categorias', tipo: 'categorias', rotulo: props.t.categorias, icone: 'i-lucide-database' },
    ...secoesDoAdmin.value.map(s => ({ id: s.id, tipo: 'admin' as const, rotulo: rotuloDe(s), icone: s.icone, no: s })),
    ...trilha.prefs.value.pessoais.map(p => ({ id: p.id, tipo: 'pessoal' as const, rotulo: p.rotulo, icone: p.icone })),
  ]
  const ordem = trilha.ordemDasSecoes(lista.map(s => s.id))
  return ordem.map(id => lista.find(s => s.id === id)!).filter(Boolean)
})

/* O conteúdo de cada seção, já filtrado. Sem filtro, é o de sempre. */
const favoritasF = computed(() => props.favoritas.filter(c => !filtrando.value || (casa(c.name) && passaTipo('categorias'))))
const categoriasF = computed(() => filtrando.value
  ? props.categorias.filter(c => !c.favorita && casa(c.name) && passaTipo('categorias'))
  : props.recorte)
function filhosDoAdmin(s: SecaoDoInicio) {
  const filhos = s.no?.filhos ?? []
  if (!filtrando.value) return filhos
  return passaTipo('telas') ? filhos.filter(f => casa(rotuloDe(f))) : []
}

function quantosEm(s: SecaoDoInicio) {
  if (s.tipo === 'favoritos') return favoritasF.value.length
  if (s.tipo === 'categorias') return categoriasF.value.length
  if (s.tipo === 'admin') return filhosDoAdmin(s).length
  return atalhosVisiveis(s.id).length
}

/**
 * As que aparecem: menos as ocultas, e Favoritos só depois do primeiro
 * favorito. Filtrando, só as que têm resultado, mesmo as ocultas: quem
 * procura não sabe em que seção a coisa mora.
 */
const secoes = computed(() => todasAsSecoes.value.filter((s) => {
  if (filtrando.value) return quantosEm(s) > 0
  if (trilha.prefs.value.secoesOcultas.includes(s.id)) return false
  if (s.tipo === 'favoritos') return props.favoritas.length > 0
  return true
}))

const nadaNoFiltro = computed(() => filtrando.value && !nativosVisiveis.value.length && !secoes.value.length)
const idsDasSecoes = computed(() => todasAsSecoes.value.map(s => s.id))

const aberta = (id: string) => filtrando.value || !trilha.recolhidas.value.includes(id)

/* ------------------------- os atalhos de uma seção pessoal ------------------------- */

interface Resolvido {
  chave: string
  atalho: Atalho
  rotulo: string
  icone: string
  abrir: () => void
  ativo: boolean
  categoria?: Categoria
  /** Quando o atalho é um menu: as telas dele, que viram submenus. */
  filhos?: NoDoMenu[]
}

function resolver(a: Atalho): Resolvido | null {
  const chave = chaveDoAtalho(a)
  if (a.tipo === 'categoria') {
    const c = props.categorias.find(x => String(x.id) === a.id)
    if (!c) return null
    return { chave, atalho: a, rotulo: c.name, icone: c.icon ?? 'i-lucide-folder', abrir: () => emit('categoria', c), ativo: props.categoriaAtivaId === c.id, categoria: c }
  }
  const no = menu.acharNo(a.id)
  // Módulo desligado ou item oculto: o atalho fica guardado, mas não aparece.
  if (!no || no.oculto || !menu.arvoreVisivel.value.some(n => n.id === no.id || n.filhos?.some(f => f.id === no.id))) return null
  if (a.tipo === 'menu') {
    const filhos = (no.filhos ?? []).filter(f => !f.oculto)
    return {
      chave, atalho: a, rotulo: rotuloDe(no), icone: no.icone, filhos,
      abrir: () => { const f = filhos[0]; if (f) emit('destino', f.id) },
      ativo: filhos.some(f => f.id === props.destinoAtivo),
    }
  }
  return { chave, atalho: a, rotulo: rotuloDe(no), icone: no.icone, abrir: () => emit('destino', no.id), ativo: props.destinoAtivo === no.id }
}

/** Os atalhos que aparecem: filtrando, só os que casam, e o menu só com as telas que casam. */
function atalhosVisiveis(secaoId: string): Resolvido[] {
  const todos = atalhosDe(secaoId)
  if (!filtrando.value) return todos
  return todos.flatMap((r) => {
    if (r.categoria) return casa(r.rotulo) && passaTipo('categorias') ? [r] : []
    if (!passaTipo('telas')) return []
    if (r.filhos) {
      if (casa(r.rotulo)) return [r]
      const filhos = r.filhos.filter(f => casa(rotuloDe(f)))
      return filhos.length ? [{ ...r, filhos }] : []
    }
    return casa(r.rotulo) ? [r] : []
  })
}

function atalhosDe(secaoId: string): Resolvido[] {
  const s = trilha.pessoal(secaoId)
  if (!s) return []
  const lista = s.itens.map(resolver).filter((x): x is Resolvido => !!x)
  if (s.ordem === 'alfabetica') return [...lista].sort((a, b) => a.rotulo.localeCompare(b.rotulo))
  if (s.ordem === 'recentes') return [...lista].reverse()
  return lista
}

/** Menu dentro de seção: abre e fecha como o resto, e abrir leva à primeira tela. */
function chaveDoMenu(secaoId: string, chave: string) {
  return `menu:${secaoId}:${chave}`
}
function alternarMenu(secaoId: string, r: Resolvido) {
  const k = chaveDoMenu(secaoId, r.chave)
  const estavaAberto = aberta(k)
  trilha.alternarRecolhida(k)
  if (!estavaAberto) r.abrir()
}

function acoesDoAtalho(secaoId: string, r: Resolvido): Acoes {
  const t = props.t
  const lista = atalhosDe(secaoId).map(x => x.chave)
  const i = lista.indexOf(r.chave)
  const mover = (passo: -1 | 1) => {
    const vizinho = lista[i + passo]
    if (vizinho) trilha.arrastarAtalho(secaoId, r.chave, secaoId, vizinho, passo < 0 ? 'antes' : 'depois')
  }
  const meio = [
    ...(r.categoria
      ? [{ label: r.categoria.favorita ? t.desafixar : t.fixar, icon: r.categoria.favorita ? 'i-lucide-star-off' : 'i-lucide-star', onSelect: () => emit('alternarFixar', r.categoria!.id) }]
      : []),
    { label: t.ctxSubir, icon: 'i-lucide-arrow-up', kbds: ['alt', 'arrowup'], disabled: i <= 0, onSelect: () => mover(-1) },
    { label: t.ctxDescer, icon: 'i-lucide-arrow-down', kbds: ['alt', 'arrowdown'], disabled: i >= lista.length - 1, onSelect: () => mover(1) },
  ]
  return [
    [
      { label: t.ctxAbrir, icon: 'i-lucide-arrow-up-right', onSelect: r.abrir },
      { label: t.ctxNovaAba, icon: 'i-lucide-external-link', onSelect: () => toast.add({ title: t.novaAbaMaquete, icon: 'i-lucide-hammer', color: 'neutral' as const }) },
      { label: t.ctxCopiarLink, icon: 'i-lucide-link', onSelect: () => acoes.copiarLink(r.atalho.id) },
    ],
    meio,
    [{ label: t.removerDaSecao, icon: 'i-lucide-circle-minus', color: 'error' as const, onSelect: () => trilha.removerAtalho(secaoId, r.chave) }],
  ]
}

/* ------------------------------ o "…" de cada seção ------------------------------ */

/** Rodada 16: toda seção se oculta, nativa também. Volta por Personalizar > Seções. */
function itemOcultar(s: SecaoDoInicio) {
  return { label: props.t.ocultarSecao, icon: 'i-lucide-eye-off', onSelect: () => trilha.ocultarSecao(s.id, true) }
}

function blocoDeSecoes() {
  return [
    { label: props.t.criarSecaoRotulo, icon: 'i-lucide-plus', onSelect: () => { trilha.criandoSecao.value = 'nova' } },
    { label: props.t.reordenarSecoes, icon: 'i-lucide-arrow-down-up', onSelect: () => trilha.abrirPersonalizar('secoes') },
  ]
}

const opcoesDeOrdemDaCategoria = computed(() => [
  { label: props.t.ordemMaisUsadas, icon: 'i-lucide-flame', valor: 'uso' },
  { label: props.t.ordemAlfabetica, icon: 'i-lucide-arrow-down-a-z', valor: 'alfabetica' },
  { label: props.t.ordemRecentes, icon: 'i-lucide-clock', valor: 'recentes' },
  { label: props.t.ordemPersonalizada, icon: 'i-lucide-grip-vertical', valor: 'manual' },
])

function acoesDaSecao(s: SecaoDoInicio): Acoes {
  const t = props.t
  const recolher = {
    label: aberta(s.id) ? t.ctxRecolher : t.ctxExpandir,
    icon: aberta(s.id) ? 'i-lucide-chevrons-down-up' : 'i-lucide-chevrons-up-down',
    onSelect: () => trilha.alternarRecolhida(s.id),
  }

  if (s.tipo === 'pessoal') {
    const p = trilha.pessoal(s.id)!
    return [
      [
        { label: t.ctxRenomear, icon: 'i-lucide-pencil', onSelect: () => { trilha.criandoSecao.value = s.id } },
        { label: t.adicionarA(s.rotulo), icon: 'i-lucide-list-plus', onSelect: () => { trilha.adicionandoEm.value = s.id } },
      ],
      [{
        label: t.ordenarSecao,
        icon: 'i-lucide-arrow-down-up',
        children: ([
          ['personalizada', t.ordemPersonalizada, 'i-lucide-grip-vertical'],
          ['alfabetica', t.ordemAlfabetica, 'i-lucide-arrow-down-a-z'],
          ['recentes', t.ordemAdicionadas, 'i-lucide-clock'],
        ] as const).map(([valor, label, icon]) => ({
          label, icon, type: 'checkbox' as const, checked: p.ordem === valor,
          onSelect: () => trilha.ordenarSecao(s.id, valor),
        })),
      }],
      blocoDeSecoes(),
      [itemOcultar(s), {
        label: t.excluirSecao,
        icon: 'i-lucide-trash-2',
        color: 'error' as const,
        onSelect: () => {
          trilha.excluirSecao(s.id)
          toast.add({ title: t.secaoExcluida(s.rotulo), icon: 'i-lucide-trash-2', color: 'neutral' })
        },
      }],
    ]
  }
  if (s.tipo === 'favoritos') {
    return [[recolher], blocoDeSecoes(), [itemOcultar(s)]]
  }
  if (s.tipo === 'categorias') {
    return [
      [recolher],
      [
        acoes.itemDeOrdem(props.ordem, opcoesDeOrdemDaCategoria.value, v => emit('ordem', v as typeof props.ordem)),
        { label: t.verTodas(props.totalDeCategorias), icon: 'i-lucide-layout-grid', onSelect: () => emit('verTodas') },
      ],
      blocoDeSecoes(),
      [itemOcultar(s)],
    ]
  }
  // Seção que o administrador montou: as ações da rodada 14, mais as de seção.
  return [...acoes.daSecao(s.no!, secoesDoAdmin.value.map(x => x.id)).slice(0, 2), blocoDeSecoes(), [itemOcultar(s)]]
}

/* ================================== o arraste ================================== */

function marcaDe(id: string) {
  return arraste.alvo.value?.id === id ? arraste.alvo.value.posicao : null
}

/** Seção sobre seção é antes ou depois; o meio só vale para pôr coisa dentro. */
function mirarSecao(s: SecaoDoInicio, p: 'antes' | 'depois' | 'dentro') {
  const quem = arraste.arrastando.value ?? ''
  const ehSecao = quem.startsWith('sec-inicio:')
  arraste.mirar(`sec-inicio:${s.id}`, ehSecao && p === 'dentro' ? 'depois' : (!ehSecao && s.tipo === 'pessoal' ? 'dentro' : p))
}

/** O que está sendo arrastado, como atalho, para soltar numa seção pessoal. */
function comoAtalho(quem: string): Atalho | null {
  if (quem.startsWith('cat:')) return { tipo: 'categoria', id: quem.slice(4) }
  if (quem.startsWith('nativo:')) {
    const id = quem.slice('nativo:'.length)
    return id === 'todas-categorias' ? null : { tipo: 'destino', id }
  }
  const no = menu.acharNo(quem)
  if (!no) return null
  if (no.tipo === 'destino') return { tipo: 'destino', id: no.id }
  if (no.tipo === 'tela') return { tipo: 'tela', id: no.id }
  if (no.tipo === 'secao') return { tipo: 'menu', id: no.id }
  return null
}

function largarNaSecao(s: SecaoDoInicio, p: 'antes' | 'depois' | 'dentro') {
  const quem = arraste.arrastando.value
  arraste.terminar()
  if (!quem) return
  if (quem.startsWith('sec-inicio:')) {
    const id = quem.slice('sec-inicio:'.length)
    if (id !== s.id) trilha.arrastarSecao(id, s.id, p === 'antes' ? 'antes' : 'depois', idsDasSecoes.value)
    return
  }
  if (s.tipo === 'pessoal') {
    if (quem.startsWith('atalho:')) {
      const [, de, ...resto] = quem.split(':')
      trilha.arrastarAtalho(de!, resto.join(':'), s.id, null, 'depois')
      return
    }
    const a = comoAtalho(quem)
    if (a) trilha.soltarNaSecao(s.id, a)
    return
  }
  if (s.tipo === 'admin') largarNaArvore(s.id, 'dentro', quem)
}

function largarNoAtalho(secaoId: string, alvo: string, p: 'antes' | 'depois' | 'dentro') {
  const quem = arraste.arrastando.value
  arraste.terminar()
  if (!quem) return
  const posicao = p === 'antes' ? 'antes' : 'depois'
  if (quem.startsWith('atalho:')) {
    const [, de, ...resto] = quem.split(':')
    trilha.arrastarAtalho(de!, resto.join(':'), secaoId, alvo, posicao)
    return
  }
  const a = comoAtalho(quem)
  if (a) trilha.soltarNaSecao(secaoId, a)
}

/** As telas de uma seção do administrador: o soltar de sempre, na árvore. */
function largarNaArvore(alvoId: string, p: 'antes' | 'depois' | 'dentro', quemJa?: string) {
  const quem = quemJa ?? arraste.arrastando.value
  if (!quemJa) arraste.terminar()
  if (!quem || quem.includes(':')) return
  const r = menu.soltar(quem, alvoId, p)
  if (!r.ok) toast.add({ title: props.t.motivos[r.motivo] ?? '', icon: 'i-lucide-ban', color: 'error' })
}

function largarCategoria(alvoId: number, p: 'antes' | 'depois' | 'dentro') {
  const quem = arraste.arrastando.value
  arraste.terminar()
  if (!quem?.startsWith('cat:')) return
  if (props.ordem !== 'manual') {
    emit('virarManual')
    toast.add({ title: props.t.viraPersonalizada, icon: 'i-lucide-grip-vertical', color: 'neutral' })
  }
  menu.reordenarCategoria(Number(quem.slice(4)), alvoId, p === 'antes' ? 'antes' : 'depois')
}

const idsDasCategorias = computed(() => props.recorte.map(c => c.id))
function passoDaCategoria(c: Categoria, passo: -1 | 1) {
  const lista = idsDasCategorias.value
  const vizinho = lista[lista.indexOf(c.id) + passo]
  if (vizinho === undefined) return
  if (props.ordem !== 'manual') emit('virarManual')
  menu.reordenarCategoria(c.id, vizinho, passo < 0 ? 'antes' : 'depois')
}

/** Alt com as setas move a seção, como o arraste: o caminho de teclado. */
function moverSecao(s: SecaoDoInicio, passo: -1 | 1) {
  const lista = secoes.value.map(x => x.id)
  const vizinho = lista[lista.indexOf(s.id) + passo]
  if (vizinho) trilha.arrastarSecao(s.id, vizinho, passo < 0 ? 'antes' : 'depois', idsDasSecoes.value)
}

/* "+" de uma seção: um popover por seção, aberto também pelo "…". */
function popoverAberto(id: string) {
  return computed({
    get: () => trilha.adicionandoEm.value === id,
    set: (v: boolean) => { trilha.adicionandoEm.value = v ? id : null },
  })
}
const abertos = new Map<string, ReturnType<typeof popoverAberto>>()
function adicionando(id: string) {
  if (!abertos.has(id)) abertos.set(id, popoverAberto(id))
  return abertos.get(id)!
}
</script>

<template>
  <div>
    <!-- ==================== os nativos, em ordem fixa ==================== -->
    <div class="space-y-0.5">
      <LinhaDeMenu
        v-for="(n, i) in nativosVisiveis"
        :key="n.id"
        :icone="n.icone"
        :rotulo="n.rotulo"
        :contador="contadorDe(n)"
        :selo="n.no?.emBreve ? props.t.emBreve : undefined"
        :ativo="props.destinoAtivo === n.id"
        :atraso="i * 20"
        :acoes="props.flutuante ? undefined : acoesDoNativo(n)"
        :com-reticencias="!props.flutuante"
        :rotulo-reticencias="props.t.maisAcoes(n.rotulo)"
        :alterado="menu.tocados.value.includes(`inicio:${n.id}`)"
        :dica-alterado="props.t.pontoAlterado"
        :arrastavel="podeArrastar"
        :saindo="arraste.arrastando.value === `nativo:${n.id}`"
        :marca="marcaDe(`nativo:${n.id}`) === 'dentro' ? null : marcaDe(`nativo:${n.id}`)"
        @selecionar="abrirNativo(n)"
        @arrastar-inicio="arraste.comecar(`nativo:${n.id}`)"
        @arrastar-sobre="p => arraste.mirar(`nativo:${n.id}`, p)"
        @soltar="p => largarNoNativo(n.id, p)"
        @arrastar-fim="arraste.terminar()"
        @mover="p => passoDoNativo(n, p)"
      />

      <!-- "⋯ Mais": os nativos que saíram, com alfinete e atalho para Personalizar. -->
      <UPopover
        v-if="nativosNoMais.length && !props.flutuante && !filtrando"
        :content="{ side: 'right', align: 'start', sideOffset: 8 }"
      >
        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-md py-1.5 pl-2.5 pr-2.5 text-sm text-default transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary data-[state=open]:bg-elevated"
        >
          <UIcon name="i-lucide-ellipsis" class="size-4 shrink-0 text-toned" />
          <span class="min-w-0 flex-1 truncate text-left">{{ props.t.mais }}</span>
        </button>
        <template #content>
          <div class="w-64 p-1.5">
            <div v-for="n in nativosNoMais" :key="n.id" class="group flex items-center rounded-md hover:bg-elevated">
              <button
                type="button"
                class="flex min-w-0 flex-1 items-center gap-2.5 px-2 py-1.5 text-sm text-default focus-visible:outline-2 focus-visible:outline-primary"
                @click="abrirNativo(n)"
              >
                <UIcon :name="n.icone" class="size-4 shrink-0 text-toned" />
                <span class="truncate">{{ n.rotulo }}</span>
              </button>
              <UTooltip :text="props.t.fixarNoInicio">
                <UButton
                  icon="i-lucide-pin"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  class="mr-1"
                  :aria-label="`${props.t.fixarNoInicio}: ${n.rotulo}`"
                  @click="trilha.mostrarNoInicio(n.id, true)"
                />
              </UTooltip>
            </div>
            <USeparator class="my-1.5" />
            <UButton
              :label="props.t.personalizarTitulo"
              icon="i-lucide-sliders-horizontal"
              size="sm"
              color="neutral"
              variant="ghost"
              block
              class="justify-start"
              @click="trilha.abrirPersonalizar('inicio')"
            />
          </div>
        </template>
      </UPopover>
    </div>

    <USeparator v-if="!filtrando || (nativosVisiveis.length && secoes.length)" class="my-2.5" />

    <!-- ==================== as seções, que se arrastam aqui ==================== -->
    <SecaoDeMenu
      v-for="s in secoes"
      :key="s.id"
      :rotulo="s.rotulo"
      :aberta="aberta(s.id)"
      :contador="s.tipo === 'categorias' ? (props.totalDeCategorias || undefined) : undefined"
      :texto-recolher="props.t.recolherSecao(s.rotulo)"
      :texto-expandir="props.t.expandirSecao(s.rotulo)"
      :alterado="menu.tocados.value.includes(`secao-inicio:${s.id}`)"
      :dica-alterado="props.t.pontoAlterado"
      :acoes="props.flutuante ? undefined : acoesDaSecao(s)"
      :arrastavel="podeArrastar"
      :saindo="arraste.arrastando.value === `sec-inicio:${s.id}`"
      :marca="marcaDe(`sec-inicio:${s.id}`)"
      @alternar="trilha.alternarRecolhida(s.id)"
      @arrastar-inicio="arraste.comecar(`sec-inicio:${s.id}`)"
      @arrastar-sobre="p => mirarSecao(s, p)"
      @soltar="p => largarNaSecao(s, p)"
      @arrastar-fim="arraste.terminar()"
      @mover="p => moverSecao(s, p)"
    >
      <!-- "…" e "+" no hover, como no ClickUp. -->
      <template v-if="!props.flutuante" #acoes>
        <UDropdownMenu :items="acoesDaSecao(s)" :content="{ side: 'right', align: 'start' }" :ui="{ content: 'min-w-56' }">
          <UButton icon="i-lucide-ellipsis" size="xs" color="neutral" variant="ghost" :aria-label="props.t.maisAcoes(s.rotulo)" />
        </UDropdownMenu>
        <UPopover
          v-if="s.tipo === 'pessoal'"
          v-model:open="adicionando(s.id).value"
          :content="{ side: 'right', align: 'start', sideOffset: 8 }"
        >
          <UButton icon="i-lucide-plus" size="xs" color="neutral" variant="ghost" :aria-label="props.t.adicionarEm(s.rotulo)" />
          <template #content>
            <AdicionarASecao
              :t="props.t"
              :secao-id="s.id"
              :categorias="props.categorias"
              :pode-configurar="props.podeConfigurar"
              @escolhido="trilha.adicionandoEm.value = null"
              @nova-tela="trilha.adicionandoEm.value = null; emit('novaTela', s.id)"
            />
          </template>
        </UPopover>
      </template>

      <!-- ---------- Favoritos ---------- -->
      <template v-if="s.tipo === 'favoritos'">
        <LinhaDeMenu
          v-for="(c, i) in favoritasF"
          :key="c.id"
          :icone="c.icon ?? 'i-lucide-folder'"
          :rotulo="c.name"
          :nivel="2"
          :ativo="props.categoriaAtivaId === c.id"
          :atraso="i * 20"
          :acoes="props.flutuante ? undefined : acoes.daCategoria(c)"
          :com-reticencias="!props.flutuante"
          :rotulo-reticencias="props.t.maisAcoes(c.name)"
          :arrastavel="podeArrastar"
          :saindo="arraste.arrastando.value === `cat:${c.id}`"
          @selecionar="emit('categoria', c)"
          @arrastar-inicio="arraste.comecar(`cat:${c.id}`)"
          @arrastar-fim="arraste.terminar()"
        />
      </template>

      <!-- ---------- Categorias ---------- -->
      <template v-else-if="s.tipo === 'categorias'">
        <LinhaDeMenu
          v-for="(c, i) in categoriasF"
          :key="c.id"
          :icone="c.icon ?? 'i-lucide-folder'"
          :rotulo="c.name"
          :nivel="2"
          :ativo="props.categoriaAtivaId === c.id"
          :atraso="i * 20"
          :alterado="menu.tocados.value.includes(`cat:${c.id}`)"
          :dica-alterado="props.t.pontoAlterado"
          :acoes="props.flutuante ? undefined : acoes.daCategoria(c, { visiveis: idsDasCategorias, passo: passoDaCategoria })"
          :com-reticencias="!props.flutuante"
          :rotulo-reticencias="props.t.maisAcoes(c.name)"
          :arrastavel="podeArrastar"
          :saindo="arraste.arrastando.value === `cat:${c.id}`"
          :marca="marcaDe(`cat:${c.id}`) === 'dentro' ? null : marcaDe(`cat:${c.id}`)"
          @selecionar="emit('categoria', c)"
          @arrastar-inicio="arraste.comecar(`cat:${c.id}`)"
          @arrastar-sobre="p => arraste.mirar(`cat:${c.id}`, p)"
          @soltar="p => largarCategoria(c.id, p)"
          @arrastar-fim="arraste.terminar()"
          @mover="p => passoDaCategoria(c, p)"
        />
        <button
          v-if="!filtrando"
          type="button"
          class="mt-0.5 flex w-full items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-sm font-medium text-highlighted transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
          @click="emit('verTodas')"
        >
          <UIcon name="i-lucide-layout-grid" class="size-4 shrink-0 text-primary" />
          <span class="min-w-0 flex-1 truncate text-left">{{ props.t.verTodas(props.totalDeCategorias) }}</span>
        </button>
      </template>

      <!-- ---------- Seção do administrador ---------- -->
      <template v-else-if="s.tipo === 'admin'">
        <LinhaDeMenu
          v-for="(item, i) in filhosDoAdmin(s)"
          :key="item.id"
          :icone="item.icone"
          :rotulo="rotuloDe(item)"
          :nivel="2"
          :selo="item.emBreve ? props.t.emBreve : undefined"
          :ativo="props.destinoAtivo === item.id"
          :atraso="i * 20"
          :alterado="menu.tocados.value.includes(item.id)"
          :dica-alterado="props.t.pontoAlterado"
          :acoes="props.flutuante ? undefined : acoes.daLinha(item, (s.no?.filhos ?? []).map(f => f.id))"
          :com-reticencias="!props.flutuante"
          :rotulo-reticencias="props.t.maisAcoes(rotuloDe(item))"
          :arrastavel="podeArrastar && props.podeConfigurar"
          :saindo="arraste.arrastando.value === item.id"
          :marca="marcaDe(item.id) === 'dentro' ? null : marcaDe(item.id)"
          @selecionar="emit('destino', item.id)"
          @arrastar-inicio="arraste.comecar(item.id)"
          @arrastar-sobre="p => arraste.mirar(item.id, p)"
          @soltar="p => largarNaArvore(item.id, p)"
          @arrastar-fim="arraste.terminar()"
          @mover="p => menu.mover(item.id, p)"
        />
      </template>

      <!-- ---------- Seção pessoal: atalhos, e menus com submenus ---------- -->
      <template v-else>
        <template v-for="(r, i) in atalhosVisiveis(s.id)" :key="r.chave">
          <LinhaDeMenu
            :icone="r.icone"
            :rotulo="r.rotulo"
            :nivel="2"
            :ativo="r.ativo && !r.filhos"
            :atraso="i * 20"
            :expandido="r.filhos ? aberta(chaveDoMenu(s.id, r.chave)) : undefined"
            :alterado="menu.tocados.value.includes(`atalho:${s.id}:${r.chave}`)"
            :dica-alterado="props.t.pontoAlterado"
            :acoes="props.flutuante ? undefined : acoesDoAtalho(s.id, r)"
            :com-reticencias="!props.flutuante"
            :rotulo-reticencias="props.t.maisAcoes(r.rotulo)"
            :arrastavel="podeArrastar"
            :saindo="arraste.arrastando.value === `atalho:${s.id}:${r.chave}`"
            :marca="marcaDe(`atalho:${s.id}:${r.chave}`) === 'dentro' ? null : marcaDe(`atalho:${s.id}:${r.chave}`)"
            @selecionar="r.filhos ? alternarMenu(s.id, r) : r.abrir()"
            @arrastar-inicio="arraste.comecar(`atalho:${s.id}:${r.chave}`)"
            @arrastar-sobre="p => arraste.mirar(`atalho:${s.id}:${r.chave}`, p)"
            @soltar="p => largarNoAtalho(s.id, r.chave, p)"
            @arrastar-fim="arraste.terminar()"
            @mover="p => acoesDoAtalho(s.id, r)[1]?.find(x => x.icon === (p < 0 ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down'))?.onSelect?.(new Event('select'))"
          />
          <!-- O menu aberto: as telas dele, no terceiro recuo. -->
          <template v-if="r.filhos && aberta(chaveDoMenu(s.id, r.chave))">
            <LinhaDeMenu
              v-for="(f, j) in r.filhos"
              :key="f.id"
              :icone="f.icone"
              :rotulo="rotuloDe(f)"
              :nivel="3"
              :selo="f.emBreve ? props.t.emBreve : undefined"
              :ativo="props.destinoAtivo === f.id"
              :atraso="j * 20"
              @selecionar="emit('destino', f.id)"
            />
          </template>
        </template>

        <!-- Seção vazia: o convite do ClickUp, que abre o mesmo "+". -->
        <button
          v-if="!atalhosDe(s.id).length && !props.flutuante && !filtrando"
          type="button"
          class="flex w-full items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-sm text-muted transition-colors hover:bg-elevated hover:text-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
          @click="trilha.adicionandoEm.value = s.id"
        >
          <UIcon name="i-lucide-plus" class="size-4 shrink-0" />
          <span class="min-w-0 flex-1 truncate text-left">{{ props.t.adicionarASecao }}</span>
        </button>
      </template>
    </SecaoDeMenu>

    <!-- Filtro sem resultado: a ponte para a busca do workspace inteiro (rodada 17). -->
    <div v-if="nadaNoFiltro" class="animate-[entrada_0.25s_ease-out_both] px-2 py-6 text-center">
      <UIcon name="i-lucide-search-x" class="mx-auto mb-2 size-6 text-toned" />
      <p class="text-sm text-default">{{ props.termo?.trim() ? props.t.filtroSemResultadoEm(props.termo) : props.t.filtroSemTipo }}</p>
      <UButton
        v-if="props.termo?.trim()"
        :label="props.t.buscarNoWorkspace(props.termo)"
        icon="i-lucide-search"
        size="xs"
        color="neutral"
        variant="outline"
        class="mt-3"
        @click="emit('buscaGlobal', props.termo ?? '')"
      />
    </div>

    <!-- Menu só meu e itens ocultos (rodadas 12 e 14). -->
    <AvisosDoMenu v-if="!props.flutuante" :t="props.t" :rotulo-de="rotuloDe" />

    <!--
      PERSONALIZAR, no pé, até a primeira vez. Depois sobe para o cabeçalho do
      painel e some daqui, como no ClickUp.
    -->
    <UButton
      v-if="!props.flutuante && !trilha.prefs.value.personalizou && !filtrando"
      :label="props.t.inicioPersonalizar"
      icon="i-lucide-sliders-horizontal"
      size="sm"
      color="neutral"
      variant="outline"
      block
      class="mt-4 animate-[entrada_0.25s_ease-out_both]"
      @click="trilha.abrirPersonalizar('navegacao')"
    />
  </div>
</template>
