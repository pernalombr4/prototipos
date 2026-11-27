/**
 * Estado do protótipo de Projetos. Tudo em memória: recarregar volta ao começo.
 *
 * A regra de acesso abaixo é a proposta da pesquisa, em código:
 *   - o papel do workspace desce para todo projeto (Proprietário e Full veem tudo);
 *   - aberto: todo membro vê e usa o próprio cargo;
 *   - fechado: aparece no diretório; entra quem participa, ou pede acesso;
 *   - privado: só quem participa sabe que existe;
 *   - convidado: só os projetos em que foi incluído.
 */
import {
  avisosBase,
  etiquetasBase,
  type Etiqueta,
  dashboardsBase,
  detalhesDoFluxo,
  tarefasBase,
  type DashboardDoProjeto,
  type PainelDeItens,
  type TarefaDoProjeto,
  type Gatilho,
  categoriasBase,
  fluxosBase,
  mapaPadrao,
  referenciaDoNome,
  modelosBase,
  grupos,
  MEMBROS_DO_WORKSPACE,
  pessoa,
  pessoas,
  projetosBase,
  projetosVolume,
  type AtualizacaoDeStatus,
  type AvisoDePrazo,
  type Categoria,
  type Fluxo,
  type MapaDaCategoria,
  type ModeloDeProjeto,
  type Participante,
  type Projeto,
  type Situacao,
  type Visibilidade,
} from './mocks'

export type Cenario = 'semProjetos' | 'emUso' | 'volume'
export type EstadoDaTela = 'normal' | 'carregando' | 'erro'
export type Area = 'inicio' | 'dados' | 'projetos' | 'comercial'
/** Rodada 3: as abas da página do projeto. */
export type AbaDoProjeto = 'geral' | 'tarefas' | 'itens' | 'automacoes' | 'painel' | 'discussoes' | 'marcos'

/** "Ver como": as pessoas que mostram as 4 experiências da proposta. */
export const personas = [
  { id: 1, chave: 'proprietaria' },
  { id: 3, chave: 'administradora' },
  { id: 5, chave: 'participante' },
  { id: 10, chave: 'convidada' },
] as const
export type ChavePersona = typeof personas[number]['chave']

export type Tela =
  | { tipo: 'inicio' }
  | { tipo: 'tarefas' }
  | { tipo: 'categoria', id: number }
  | { tipo: 'projeto', id: number }
  | { tipo: 'diretorio' }
  /** Rodada 8: as metas do workspace. */
  | { tipo: 'metas' }
  | { tipo: 'semAcesso', id: number }

function copiarProjetos(lista: Projeto[]) {
  return lista.map(p => ({
    ...p,
    participantes: p.participantes.map(x => ({ ...x })),
    permissaoPadrao: { ...p.permissaoPadrao },
    telas: [...p.telas],
    atividade: [...p.atividade],
    atualizacoes: p.atualizacoes.map(a => ({ ...a })),
  }))
}

/** Os favoritos de exemplo de cada pessoa ("p:<id>" projeto, "c:<id>" categoria). Camada pessoal. */
const favoritosBase: Record<number, string[]> = {
  1: ['p:1', 'c:1', 'c:4'],
  3: ['p:1', 'c:4'],
  5: ['c:4', 'c:1'],
  10: ['p:4'],
}

/**
 * Rodada 11: os contadores de id moram fora do composable. Dentro dele, cada componente que chamava
 * useProjetos() recomeçava a contagem, e 2 telas criavam categorias (ou tarefas) com o mesmo id.
 */
let proximoId = 500
let proximoDash = 900
let proximaCat = 700
let proximaTarefa = 800
let proximoFluxo = 600

export function useProjetos() {
  const cenario = useState<Cenario>('prj-cenario', () => 'emUso')
  const estadoDaTela = useState<EstadoDaTela>('prj-estado', () => 'normal')
  /** Andaime: a proposta sobre o menu novo (protótipo menu-lateral) ou sobre o menu de hoje do develop. */
  const menu = useState<'novo' | 'atual'>('prj-casca', () => 'novo')
  const eu = useState<number>('prj-eu', () => 1)
  const projetos = useState<Projeto[]>('prj-projetos', () => copiarProjetos(projetosBase))
  const categorias = useState<Categoria[]>('prj-categorias', () => categoriasBase.map(c => ({ ...c })))
  /** O menu de cada pessoa: os projetos que ela mostra no painel, na ordem dela. */
  const meuMenu = useState<Record<number, number[]>>('prj-menu', () => ({}))
  /** Rodada 13: quem mexeu no próprio menu. O "Para todos" não muda o menu dessas pessoas, como no ENSPACE. */
  const personalizados = useState<number[]>('prj-menu-pessoal', () => [])
  const area = useState<Area>('prj-area', () => 'inicio')
  const tela = useState<Tela>('prj-tela', () => ({ tipo: 'inicio' }))
  /** Projetos abertos no painel (expandidos). Por pessoa, no produto. */
  const expandidos = useState<number[]>('prj-expandidos', () => [1])
  /** Pedidos de acesso enviados nesta sessão. */
  const pedidos = useState<number[]>('prj-pedidos', () => [])
  /** Rodada 3: a aba aberta na página do projeto. */
  const abaDoProjeto = useState<AbaDoProjeto>('prj-aba', () => 'geral')
  /** Rodada 3: o mapa Responsável, Prazo e Status de cada categoria de projeto. */
  const mapas = useState<Record<number, MapaDaCategoria>>('prj-mapas', () => Object.fromEntries(categoriasBase.map(c => [c.id, mapaPadrao(c.id)])))
  const fluxos = useState<Fluxo[]>('prj-fluxos', () => fluxosBase.map(f => ({ ...f })))
  const avisos = useState<AvisoDePrazo[]>('prj-avisos', () => avisosBase.map(a => ({ ...a })))
  const modelos = useState<ModeloDeProjeto[]>('prj-modelos', () => modelosBase.map(m => ({ ...m, categorias: [...m.categorias] })))
  /** Camada pessoal: os favoritos de cada pessoa. A estrela da barra do topo liga e desliga. */
  const favoritos = useState<Record<number, string[]>>('prj-favoritos', () => ({ ...favoritosBase }))

  const janelas = {
    criar: useState<boolean>('prj-j-criar', () => false),
    configurar: useState<{ id: number, aba: string } | null>('prj-j-config', () => null),
    mover: useState<number | null>('prj-j-mover', () => null),
    item: useState<number | null>('prj-j-item', () => null),
    status: useState<number | null>('prj-j-status', () => null),
    modelo: useState<number | null>('prj-j-modelo', () => null),
    /** Rodada 5: o projeto em que o Novo Workflow, a nova categoria e a nova tarefa entram. */
    novoFluxo: useState<number | null>('prj-j-fluxo', () => null),
    novaCategoria: useState<number | null>('prj-j-categoria', () => null),
    novaTarefa: useState<number | null>('prj-j-tarefa', () => null),
  }

  /* ---------- rodada 5: o que o projeto reúne ---------- */
  const tarefas = useState<TarefaDoProjeto[]>('prj-tarefas', () => tarefasBase.map(x => ({ ...x })))
  const dashboards = useState<DashboardDoProjeto[]>('prj-dashboards', () => dashboardsBase.map(d => ({ ...d, tarefas: [...d.tarefas], itens: d.itens.map(i => ({ ...i })) })))
  /** O dashboard aberto na aba Painéis e se ele está em edição (Personalizar). */
  const dashboardAberto = useState<number | null>('prj-dash', () => null)
  const editandoDashboard = useState<boolean>('prj-dash-edit', () => false)
  /** Painel em renomeação no menu (edição no lugar). */
  const renomeando = useState<string | null>('prj-renomeando', () => null)


  const euPessoa = computed(() => pessoa(eu.value)!)
  const souDono = computed(() => euPessoa.value.licenca === 'owner' || euPessoa.value.licenca === 'full')
  const souConvidado = computed(() => !!euPessoa.value.convidado)

  function participa(p: Projeto, quem = eu.value) {
    const alguem = pessoa(quem)
    if (!alguem) return null
    let melhor: Participante['papel'] | null = null
    for (const x of p.participantes) {
      const bate = (x.tipo === 'pessoa' && x.id === quem)
        || (x.tipo === 'grupo' && alguem.grupos.includes(String(x.id)))
        || (x.tipo === 'cargo' && x.id === alguem.cargo)
      if (bate && (melhor === null || x.papel === 'admin')) melhor = x.papel
    }
    return melhor
  }

  /** O papel efetivo: o do workspace desce (Proprietário e Full administram todo projeto). */
  function papel(p: Projeto, quem = eu.value): 'dono' | 'admin' | 'participante' | 'membro' | null {
    const alguem = pessoa(quem)
    if (!alguem) return null
    if (alguem.licenca === 'owner' || alguem.licenca === 'full') return 'dono'
    const direto = participa(p, quem)
    if (direto) return direto
    if (alguem.convidado) return null
    if (p.visibilidade === 'aberto') return 'membro'
    return null
  }

  /** Sabe que o projeto existe (aparece no diretório e na busca). */
  function enxerga(p: Projeto, quem = eu.value) {
    if (papel(p, quem)) return true
    const alguem = pessoa(quem)
    return !!alguem && !alguem.convidado && p.visibilidade === 'fechado'
  }

  /** Entra no projeto e vê as categorias dele. */
  function entra(p: Projeto, quem = eu.value) {
    return !!papel(p, quem)
  }

  function podeAdministrar(p: Projeto, quem = eu.value) {
    const r = papel(p, quem)
    return r === 'dono' || r === 'admin'
  }

  const ativos = computed(() => projetos.value.filter(p => p.status === 'ativo'))
  const visiveis = computed(() => ativos.value.filter(p => enxerga(p)))
  const queEntro = computed(() => ativos.value.filter(p => entra(p)))

  /** O menu da pessoa: o que o administrador pôs para todos, mais o que ela mesma acrescentou. */
  function menuInicial(quem: number) {
    return ativos.value
      .filter((p) => {
        // O dono do workspace administra tudo e começa com os projetos que vão para o menu de todos.
        const dele = participa(p, quem) || papel(p, quem) === 'dono'
        return (dele && p.noMenuDeTodos) || (cenario.value === 'volume' && dele)
      })
      .slice(0, 9)
      .map(p => p.id)
  }
  const noMenu = computed<Projeto[]>(() => {
    if (!(eu.value in meuMenu.value)) meuMenu.value = { ...meuMenu.value, [eu.value]: menuInicial(eu.value) }
    return (meuMenu.value[eu.value] ?? [])
      .map(id => projetos.value.find(p => p.id === id))
      .filter((p): p is Projeto => !!p && p.status === 'ativo' && entra(p))
  })
  const estaNoMenu = (id: number) => noMenu.value.some(p => p.id === id)

  function personalizar() {
    if (!personalizados.value.includes(eu.value)) personalizados.value = [...personalizados.value, eu.value]
  }
  function mostrarNoMenu(id: number) {
    const atual = meuMenu.value[eu.value] ?? []
    if (!atual.includes(id)) meuMenu.value = { ...meuMenu.value, [eu.value]: [...atual, id] }
    personalizar()
  }
  function ocultarDoMenu(id: number) {
    meuMenu.value = { ...meuMenu.value, [eu.value]: (meuMenu.value[eu.value] ?? []).filter(x => x !== id) }
    personalizar()
  }
  function reordenar(ids: number[]) {
    meuMenu.value = { ...meuMenu.value, [eu.value]: ids }
    personalizar()
  }
  /**
   * Rodada 13: "Salvar para todos". Muda o padrão do projeto (noMenuDeTodos) e o menu de quem não personalizou o
   * próprio menu, mais o de quem salvou, como o "Aplicar para todos" da barra de informações do item.
   */
  function salvarParaTodos(id: number, mostrar: boolean) {
    atualizarProjeto(id, { noMenuDeTodos: mostrar })
    const novo: Record<number, number[]> = {}
    for (const [k, ids] of Object.entries(meuMenu.value)) {
      const quem = Number(k)
      if (quem !== eu.value && personalizados.value.includes(quem)) { novo[quem] = ids; continue }
      novo[quem] = mostrar ? (ids.includes(id) ? ids : [...ids, id]) : ids.filter(x => x !== id)
    }
    meuMenu.value = novo
  }

  /** Categorias que a pessoa vê: as do workspace (pelo cargo) e as dos projetos em que entra. */
  function categoriasDe(projetoId: number | null) {
    return categorias.value.filter(c => c.projeto === projetoId)
  }
  const categoriasDoWorkspace = computed(() => souConvidado.value ? [] : categoriasDe(null))
  function veCategoria(c: Categoria) {
    if (c.projeto === null) return !souConvidado.value
    const p = projetos.value.find(x => x.id === c.projeto)
    return !!p && entra(p)
  }
  const projetoDa = (c: Categoria) => projetos.value.find(p => p.id === c.projeto) ?? null

  function aplicarCenario(c: Cenario) {
    cenario.value = c
    projetos.value = c === 'semProjetos' ? [] : copiarProjetos(c === 'volume' ? projetosVolume : projetosBase)
    categorias.value = categoriasBase.map(x => ({ ...x, projeto: c === 'semProjetos' ? null : x.projeto }))
    meuMenu.value = {}
    pedidos.value = []
    fluxos.value = fluxosBase.map(f => ({ ...f }))
    tarefas.value = tarefasBase.map(x => ({ ...x }))
    dashboards.value = c === 'semProjetos' ? [] : dashboardsBase.map(d => ({ ...d, tarefas: [...d.tarefas], itens: d.itens.map(i => ({ ...i })) }))
    dashboardAberto.value = null
    editandoDashboard.value = false
    avisos.value = avisosBase.map(a => ({ ...a }))
    modelos.value = c === 'semProjetos' ? [] : modelosBase.map(m => ({ ...m, categorias: [...m.categorias] }))
    mapas.value = Object.fromEntries(categoriasBase.map(x => [x.id, mapaPadrao(x.id)]))
    expandidos.value = c === 'semProjetos' ? [] : [1]
    area.value = 'inicio'
    tela.value = { tipo: 'inicio' }
  }

  function trocarPessoa(id: number) {
    eu.value = id
    area.value = 'inicio'
    tela.value = { tipo: 'inicio' }
    const primeiro = queEntro.value[0]
    expandidos.value = primeiro ? [primeiro.id] : []
  }

  function abrirProjeto(id: number) {
    const p = projetos.value.find(x => x.id === id)
    if (!p) return
    if (!(tela.value.tipo === 'projeto' && tela.value.id === id)) abaDoProjeto.value = 'geral'
    tela.value = entra(p) ? { tipo: 'projeto', id } : { tipo: 'semAcesso', id }
    if (entra(p) && !expandidos.value.includes(id)) expandidos.value = [...expandidos.value, id]
  }
  function abrirCategoria(id: number) {
    tela.value = { tipo: 'categoria', id }
    const c = categorias.value.find(x => x.id === id)
    if (c?.projeto && !expandidos.value.includes(c.projeto)) expandidos.value = [...expandidos.value, c.projeto]
  }

  function criarProjeto(dados: {
    nome: string
    descricao: string
    icone: string
    cor: Projeto['cor']
    visibilidade: Visibilidade
    categorias: number[]
    participantes: Participante[]
    noMenuDeTodos: boolean
    modelo?: number
    referencia?: string
    permissaoPadrao?: Projeto['permissaoPadrao']
  }) {
    const id = ++proximoId
    const modelo = dados.modelo ? modelos.value.find(m => m.id === dados.modelo) : undefined
    const novo: Projeto = {
      id,
      referencia: dados.referencia || `projeto-${id}`,
      nome: dados.nome,
      descricao: dados.descricao,
      icone: dados.icone,
      cor: dados.cor,
      visibilidade: dados.visibilidade,
      status: 'ativo',
      participantes: [{ tipo: 'pessoa', id: eu.value, papel: 'admin' }, ...dados.participantes.filter(x => !(x.tipo === 'pessoa' && x.id === eu.value))],
      permissaoPadrao: dados.permissaoPadrao ?? { ver: true, criar: true, editar: true, excluir: false },
      telas: [],
      noMenuDeTodos: dados.noMenuDeTodos,
      criadoEm: '2026-11-26',
      atividade: [{ quem: eu.value, oque: modelo ? `criou o projeto a partir do modelo ${modelo.nome}` : 'criou o projeto', quando: 'agora' }],
      atualizacoes: [],
    }
    projetos.value = [...projetos.value, novo]
    categorias.value = categorias.value.map(c => dados.categorias.includes(c.id) ? { ...c, projeto: id } : c)
    if (modelo) {
      // O modelo cria categorias novas, com a estrutura da de origem e sem itens.
      // Os fluxos chegam desligados e sem responsáveis: quem cria revisa antes de ligar.
      const novas: Categoria[] = modelo.categorias.map((m, i) => {
        const origem = categoriasBase.find(c => c.id === m.origem)
        return { id: id * 100 + i, name: m.nome, slug: `${origem?.slug ?? 'categoria'}-${id}`, description: origem?.description ?? '', icon: m.icone, color: origem?.color ?? 'neutral', projeto: id, itens: 0, copiaDe: m.origem }
      })
      categorias.value = [...categorias.value, ...novas]
      mapas.value = { ...mapas.value, ...Object.fromEntries(novas.map(c => [c.id, mapaPadrao(c.copiaDe!)])) }
      const deOrigem = (cat: number) => novas.find(n => n.copiaDe === cat)
      fluxos.value = [
        ...fluxos.value,
        ...fluxosBase.filter(f => deOrigem(f.categoria)).map((f, i) => ({ ...f, id: id * 100 + i, categoria: deOrigem(f.categoria)!.id, ativo: false, ultimaExecucao: null, execucoes30d: 0 })),
      ]
      avisos.value = [...avisos.value, ...avisosBase.filter(a => deOrigem(a.categoria)).map(a => ({ ...a, categoria: deOrigem(a.categoria)!.id }))]
    }
    // criar o projeto põe no menu de quem criou sem contar como menu personalizado
    meuMenu.value = { ...meuMenu.value, [eu.value]: [...(meuMenu.value[eu.value] ?? []), id] }
    expandidos.value = [...expandidos.value, id]
    area.value = 'projetos'
    tela.value = { tipo: 'projeto', id }
    return novo
  }

  function moverCategoria(categoriaId: number, destino: number | null) {
    categorias.value = categorias.value.map(c => c.id === categoriaId ? { ...c, projeto: destino } : c)
  }

  function atualizarProjeto(id: number, mudanca: Partial<Projeto>) {
    projetos.value = projetos.value.map(p => p.id === id ? { ...p, ...mudanca } : p)
  }

  function arquivar(id: number) {
    atualizarProjeto(id, { status: 'arquivado' })
    ocultarDoMenu(id)
    tela.value = { tipo: 'diretorio' }
  }
  function restaurar(id: number) {
    atualizarProjeto(id, { status: 'ativo' })
  }
  function excluir(id: number) {
    projetos.value = projetos.value.filter(p => p.id !== id)
    categorias.value = categorias.value.map(c => c.projeto === id ? { ...c, projeto: null } : c)
    tela.value = { tipo: 'diretorio' }
  }

  /* ---------- rodada 3 ---------- */
  const statusAtual = (p: Projeto) => p.atualizacoes[0] ?? null
  function publicarStatus(id: number, a: Omit<AtualizacaoDeStatus, 'autor' | 'em'>) {
    const p = projetos.value.find(x => x.id === id)
    if (!p) return
    atualizarProjeto(id, {
      atualizacoes: [{ ...a, autor: eu.value, em: '2026-11-26' }, ...p.atualizacoes],
      atividade: [{ quem: eu.value, oque: 'publicou uma atualização de status', quando: 'agora' }, ...p.atividade],
    })
  }
  /** Os campos da categoria (a criada por modelo usa os da de origem). */
  const camposDe = (c: Categoria) => c.copiaDe ?? c.id
  function salvarMapa(novos: Record<number, MapaDaCategoria>) {
    mapas.value = { ...mapas.value, ...novos }
  }
  const fluxosDoProjeto = (id: number) => {
    const cats = new Set(categoriasDe(id).map(c => c.id))
    return fluxos.value.filter(f => cats.has(f.categoria))
  }
  const avisosDoProjeto = (id: number) => {
    const cats = new Set(categoriasDe(id).map(c => c.id))
    return avisos.value.filter(a => cats.has(a.categoria))
  }
  function alternarFluxo(fluxoId: number) {
    fluxos.value = fluxos.value.map(f => f.id === fluxoId ? { ...f, ativo: !f.ativo } : f)
  }

  /* ---------- rodada 5: abrir, adicionar e arrumar pelo menu ---------- */
  function abrirAba(projetoId: number, aba: AbaDoProjeto) {
    abrirProjeto(projetoId)
    abaDoProjeto.value = aba
  }
  const dashboardsDe = (projetoId: number) => dashboards.value.filter(d => d.projeto === projetoId)
  function abrirDashboard(id: number, editar = false) {
    const d = dashboards.value.find(x => x.id === id)
    if (!d) return
    dashboardAberto.value = id
    editandoDashboard.value = editar
    abrirAba(d.projeto, 'painel')
  }
  function criarDashboard(projetoId: number, nome: string) {
    const id = ++proximoDash
    dashboards.value = [...dashboards.value, { id, projeto: projetoId, nome, descricao: '', tarefas: ['abertas', 'vencidas', 'porStatus', 'carga'], itens: [] }]
    abrirDashboard(id, true)
    renomeando.value = 'd:' + id
    return id
  }
  function atualizarDashboard(id: number, mudanca: Partial<DashboardDoProjeto>) {
    dashboards.value = dashboards.value.map(d => d.id === id ? { ...d, ...mudanca } : d)
  }
  function duplicarDashboard(id: number, sufixo: string) {
    const d = dashboards.value.find(x => x.id === id)
    if (!d) return
    const novo = ++proximoDash
    dashboards.value = [...dashboards.value, { ...d, id: novo, nome: d.nome + ' ' + sufixo, tarefas: [...d.tarefas], itens: d.itens.map(i => ({ ...i, id: i.id + '-' + novo })) }]
    return novo
  }
  function excluirDashboard(id: number) {
    const d = dashboards.value.find(x => x.id === id)
    dashboards.value = dashboards.value.filter(x => x.id !== id)
    if (dashboardAberto.value === id) dashboardAberto.value = null
    return d
  }
  function restaurarDashboard(d: DashboardDoProjeto) {
    dashboards.value = [...dashboards.value, d]
  }
  function adicionarPainelDeItens(dashId: number, painel: PainelDeItens) {
    dashboards.value = dashboards.value.map(d => d.id === dashId ? { ...d, itens: [...d.itens, painel] } : d)
  }
  /** Reordena categorias ou dashboards dentro do projeto (arrastar no menu). */
  function reordenarNoProjeto(tipo: 'c' | 'd', projetoId: number, ids: number[]) {
    if (tipo === 'c') {
      const dentro = ids.map(i => categorias.value.find(c => c.id === i)!).filter(Boolean)
      categorias.value = [...categorias.value.filter(c => c.projeto !== projetoId), ...dentro]
    }
    else {
      const dentro = ids.map(i => dashboards.value.find(d => d.id === i)!).filter(Boolean)
      dashboards.value = [...dashboards.value.filter(d => d.projeto !== projetoId), ...dentro]
    }
  }
  /** Rodada 11: projetoId null cria a categoria no workspace (o atalho do Criar projeto, antes de o projeto existir). */
  function criarCategoria(projetoId: number | null, nome: string, icone: string) {
    const id = ++proximaCat
    const slug = nome.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    categorias.value = [...categorias.value, { id, name: nome, slug, description: '', icon: icone, color: 'neutral', projeto: projetoId, itens: 0 }]
    if (projetoId && !expandidos.value.includes(projetoId)) expandidos.value = [...expandidos.value, projetoId]
    return id
  }
  /** Rodada 11: as etiquetas viram estado, para o atalho "Criar etiqueta" do seletor. */
  const etiquetas = useState<Etiqueta[]>('prj-etiquetas', () => [...etiquetasBase])
  function criarEtiqueta(nome: string) {
    const existe = etiquetas.value.find(e => e.nome.toLowerCase() === nome.toLowerCase())
    if (existe) return existe.id
    const id = `nova-${etiquetas.value.length + 1}`
    etiquetas.value = [...etiquetas.value, { id, nome, cor: 'neutral' }]
    return id
  }
  /** Rodada 11: o projeto criado pelo atalho de um seletor, só com o nome; o resto fica no padrão e se ajusta nas configurações. */
  /** Rodada 12: a referência que copia o nome, com -2, -3 quando já existe outra igual. */
  function referenciaLivre(nome: string) {
    const base = referenciaDoNome(nome) || 'projeto'
    let ref = base
    for (let n = 2; projetos.value.some(p => p.referencia === ref); n++) ref = `${base}-${n}`
    return ref
  }
  function criarProjetoRapido(nome: string) {
    const onde = { area: area.value, tela: tela.value }
    const novo = criarProjeto({ nome, referencia: referenciaLivre(nome), descricao: '', icone: 'i-lucide-folder-kanban', cor: 'primary', visibilidade: 'aberto', categorias: [], participantes: [], noMenuDeTodos: true })
    area.value = onde.area
    tela.value = onde.tela
    return novo
  }
  /** A tarefa ligada a item fica no projeto da categoria do item; a sem item, no projeto escolhido (rodada 10). */
  const projetoDaTarefa = (x: TarefaDoProjeto) => x.categoria ? (categorias.value.find(c => c.id === x.categoria)?.projeto ?? null) : (x.projeto ?? null)
  const tarefasDoProjeto = (projetoId: number) => tarefas.value.filter(x => projetoDaTarefa(x) === projetoId)
  /** Rodada 10: a subtarefa é uma tarefa rápida com tarefa-mãe (1 nível). */
  /** Rodada 10: a mesma lógica de subtarefa do protótipo pasta-de-apontamentos (1 nível, campo `mae`, na ordem de criação). */
  const subtarefasDe = (id: number) => tarefas.value.filter(x => x.mae === id).sort((a, b) => a.id - b.id)
  const abertasDe = (id: number) => subtarefasDe(id).filter(x => x.status !== 'concluida')
  /** Concluir a tarefa-mãe pode concluir junto as subtarefas abertas, como no pasta-de-apontamentos. */
  function concluirComSubtarefas(id: number) {
    const ids = [id, ...abertasDe(id).map(x => x.id)]
    tarefas.value = tarefas.value.map(x => ids.includes(x.id) ? { ...x, status: 'concluida' } : x)
  }
  /** Rodada 10: a tarefa aberta no detalhe (o painel com a lateral editável). */
  const tarefaAberta = useState<number | null>('prj-tarefa-aberta', () => null)
  /** As referências de item de uma categoria (as das tarefas mais 4 inventadas), para ligar a tarefa a um item. */
  function itensDaCategoria(catId: number) {
    const c = categorias.value.find(x => x.id === catId)
    if (!c) return [] as string[]
    const dasTarefas = tarefas.value.filter(x => x.categoria === catId && x.item).map(x => x.item!)
    const prefixo = dasTarefas[0]?.slice(0, 2) ?? c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    return [...new Set([...dasTarefas, ...[0, 1, 2, 3].map(n => `${prefixo}${4210 - n * 17}`)])]
  }
  function criarTarefa(dados: Omit<TarefaDoProjeto, 'id' | 'criadaEm' | 'status'> & { status?: TarefaDoProjeto['status'] }) {
    const id = ++proximaTarefa
    tarefas.value = [{ status: 'aberta', ...dados, id, criadaEm: '2026-11-26' }, ...tarefas.value]
    return id
  }
  function excluirTarefa(id: number) {
    tarefas.value = tarefas.value.filter(x => x.id !== id).map(x => x.mae === id ? { ...x, mae: undefined } : x)
    if (tarefaAberta.value === id) tarefaAberta.value = null
  }
  function concluirTarefa(id: number) {
    tarefas.value = tarefas.value.map(x => x.id === id ? { ...x, status: x.status === 'concluida' ? 'aberta' : 'concluida' } : x)
  }
  /** Rodada 10: o quadro e o detalhe da tarefa mudam o status e os outros campos da tarefa rápida. */
  function atualizarTarefa(id: number, dados: Partial<Omit<TarefaDoProjeto, 'id'>>) {
    tarefas.value = tarefas.value.map(x => x.id === id ? { ...x, ...dados } : x)
  }
  function criarFluxo(dados: { nome: string, descricao: string, icone: string, categoria: number, gatilho: Gatilho }) {
    const id = ++proximoFluxo
    detalhesDoFluxo[id] = { descricao: dados.descricao, versao: '0.0.1', icone: dados.icone, criadoEm: '2026-11-26' }
    fluxos.value = [...fluxos.value, { id, nome: dados.nome, categoria: dados.categoria, gatilho: dados.gatilho, ativo: false, ultimaExecucao: null, execucoes30d: 0 }]
    return id
  }
  function salvarComoModelo(projetoId: number, nome: string, descricao: string, inclui: { fluxos: boolean, avisos: boolean, painel: boolean }) {
    const p = projetos.value.find(x => x.id === projetoId)!
    const cats = categoriasDe(projetoId)
    const m: ModeloDeProjeto = {
      id: modelos.value.length + 100,
      nome,
      descricao,
      icone: p.icone,
      cor: p.cor,
      visibilidade: p.visibilidade,
      categorias: cats.map(c => ({ origem: camposDe(c), nome: c.name, icone: c.icon ?? 'i-lucide-folder' })),
      fluxos: inclui.fluxos ? fluxosDoProjeto(projetoId).length : 0,
      avisos: inclui.avisos ? avisosDoProjeto(projetoId).length : 0,
      paineis: inclui.painel ? 1 : 0,
      criadoPor: eu.value,
      criadoEm: '2026-11-26',
    }
    modelos.value = [...modelos.value, m]
    return m
  }
  const meusFavoritos = computed(() => favoritos.value[eu.value] ?? [])
  const ehFavorito = (chave: string) => meusFavoritos.value.includes(chave)
  function alternarFavorito(chave: string) {
    const atual = meusFavoritos.value
    favoritos.value = { ...favoritos.value, [eu.value]: atual.includes(chave) ? atual.filter(x => x !== chave) : [...atual, chave] }
  }
  /** A chave de favorito da tela aberta (projeto ou categoria); as outras telas não se favoritam aqui. */
  const chaveDaTela = computed(() => tela.value.tipo === 'projeto' ? `p:${tela.value.id}` : tela.value.tipo === 'categoria' ? `c:${tela.value.id}` : null)

  function pedirAcesso(id: number) {
    if (!pedidos.value.includes(id)) pedidos.value = [...pedidos.value, id]
  }

  /** Quantas pessoas cada participante representa, para o resumo de quem tem acesso. */
  function alcance(x: Participante) {
    if (x.tipo === 'pessoa') return 1
    if (x.tipo === 'grupo') return grupos.find(g => g.id === x.id)?.members_count ?? 0
    return pessoas.filter(p => p.cargo === x.id).length
  }

  /**
   * Quantas pessoas veem as categorias do projeto (null = workspace, todos os membros).
   * A pessoa que já entra por um grupo ou cargo participante não conta 2 vezes; Proprietário e
   * Full entram sempre. soParticipantes ignora o aberto (a coluna Participantes do diretório).
   */
  function quantosVeem(p: Projeto | null, soParticipantes = false) {
    if (!p || (p.visibilidade === 'aberto' && !soParticipantes)) return MEMBROS_DO_WORKSPACE
    const grs = new Set(p.participantes.filter(x => x.tipo === 'grupo').map(x => String(x.id)))
    const cgs = new Set(p.participantes.filter(x => x.tipo === 'cargo').map(x => Number(x.id)))
    const coberta = (id: number) => {
      const a = pessoa(id)
      return !!a && (a.grupos.some(g => grs.has(g)) || cgs.has(a.cargo))
    }
    let n = 0
    for (const x of p.participantes) {
      if (x.tipo === 'pessoa' && coberta(Number(x.id))) continue
      n += alcance(x)
    }
    const diretos = new Set(p.participantes.filter(x => x.tipo === 'pessoa').map(x => Number(x.id)))
    n += pessoas.filter(a => (a.licenca === 'owner' || a.licenca === 'full') && !diretos.has(a.id) && !coberta(a.id)).length
    return Math.min(n, MEMBROS_DO_WORKSPACE)
  }

  return {
    cenario, estadoDaTela, menu, eu, euPessoa, souDono, souConvidado,
    projetos, categorias, area, tela, expandidos, pedidos, janelas,
    participa, papel, enxerga, entra, podeAdministrar,
    ativos, visiveis, queEntro, noMenu, estaNoMenu, mostrarNoMenu, ocultarDoMenu, reordenar, salvarParaTodos,
    categoriasDe, categoriasDoWorkspace, veCategoria, projetoDa,
    aplicarCenario, trocarPessoa, abrirProjeto, abrirCategoria,
    criarProjeto, referenciaLivre, moverCategoria, atualizarProjeto, arquivar, restaurar, excluir, pedirAcesso, alcance, quantosVeem,
    abaDoProjeto, mapas, fluxos, avisos, modelos, statusAtual, publicarStatus, camposDe, salvarMapa,
    fluxosDoProjeto, avisosDoProjeto, alternarFluxo, salvarComoModelo,
    meusFavoritos, ehFavorito, alternarFavorito, chaveDaTela,
    tarefas, dashboards, dashboardAberto, editandoDashboard, renomeando,
    abrirAba, dashboardsDe, abrirDashboard, criarDashboard, atualizarDashboard, duplicarDashboard, excluirDashboard, restaurarDashboard,
    adicionarPainelDeItens, reordenarNoProjeto, criarCategoria, etiquetas, criarEtiqueta, criarProjetoRapido, tarefasDoProjeto, criarTarefa, concluirTarefa, atualizarTarefa, abertasDe, concluirComSubtarefas, criarFluxo,
    projetoDaTarefa, subtarefasDe, tarefaAberta, excluirTarefa, itensDaCategoria,
  }
}

/**
 * Contorno tracejado no que é proposta (a chave fica no andaime), como nos outros protótipos.
 * A casca do menu novo vem do protótipo menu-lateral; o que este protótipo acrescenta é a proposta.
 */
export function useMarcaDeProposta() {
  const destacar = useState<boolean>('prj-destacar', () => false)
  /** Rodada 3: a 2ª chave do andaime marca o que pede peça nova no back-end (contorno azul). */
  const destacarBack = useState<boolean>('prj-destacar-back', () => false)
  return {
    destacar,
    destacarBack,
    marca: computed(() => destacar.value ? 'outline-2 outline-dashed outline-offset-2 outline-warning rounded-md' : ''),
    marcaBack: computed(() => destacarBack.value ? 'outline-2 outline-dashed outline-offset-4 outline-info rounded-md' : ''),
  }
}

/** Rodada 3: a situação do projeto, igual no cabeçalho, no painel lateral e no diretório. */
export const COR_DA_SITUACAO: Record<Situacao, 'success' | 'warning' | 'error' | 'info'> = {
  noPrazo: 'success',
  emRisco: 'warning',
  atrasado: 'error',
  concluido: 'info',
}
export const ICONE_DA_SITUACAO: Record<Situacao, string> = {
  noPrazo: 'i-lucide-circle-check',
  emRisco: 'i-lucide-circle-alert',
  atrasado: 'i-lucide-circle-x',
  concluido: 'i-lucide-flag',
}
/** O ponto colorido do painel lateral (classe estática, o Tailwind não lê classe montada). */
export const PONTO_DA_SITUACAO: Record<Situacao, string> = {
  noPrazo: 'bg-success',
  emRisco: 'bg-warning',
  atrasado: 'bg-error',
  concluido: 'bg-info',
}

/** Proposta: o ícone de cada visibilidade, igual no painel, no diretório, na página e no seletor. */
export const ICONE_DA_VISIBILIDADE: Record<Visibilidade, string> = {
  aberto: 'i-lucide-globe',
  fechado: 'i-lucide-lock',
  privado: 'i-lucide-eye-off',
}

/** Classes estáticas da cor do projeto (o Tailwind não lê classe montada em tempo de execução). */
export const COR_DO_PROJETO: Record<Projeto['cor'], string> = {
  primary: 'bg-primary/15 text-primary',
  secondary: 'bg-secondary/15 text-secondary',
  success: 'bg-success/15 text-success',
  info: 'bg-info/15 text-info',
  warning: 'bg-warning/15 text-warning',
  error: 'bg-error/15 text-error',
  neutral: 'bg-accented text-toned',
}
