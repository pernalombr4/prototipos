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
  categoriasBase,
  grupos,
  MEMBROS_DO_WORKSPACE,
  pessoa,
  pessoas,
  projetosBase,
  projetosVolume,
  type Categoria,
  type Participante,
  type Projeto,
  type Visibilidade,
} from './mocks'

export type Cenario = 'semProjetos' | 'emUso' | 'volume'
export type EstadoDaTela = 'normal' | 'carregando' | 'erro'
export type Area = 'inicio' | 'dados' | 'projetos'

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
  | { tipo: 'semAcesso', id: number }

function copiarProjetos(lista: Projeto[]) {
  return lista.map(p => ({
    ...p,
    participantes: p.participantes.map(x => ({ ...x })),
    permissaoPadrao: { ...p.permissaoPadrao },
    telas: [...p.telas],
    atividade: [...p.atividade],
  }))
}

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
  const area = useState<Area>('prj-area', () => 'inicio')
  const tela = useState<Tela>('prj-tela', () => ({ tipo: 'inicio' }))
  /** Projetos abertos no painel (expandidos). Por pessoa, no produto. */
  const expandidos = useState<number[]>('prj-expandidos', () => [1])
  /** Pedidos de acesso enviados nesta sessão. */
  const pedidos = useState<number[]>('prj-pedidos', () => [])

  const janelas = {
    criar: useState<boolean>('prj-j-criar', () => false),
    configurar: useState<{ id: number, aba: string } | null>('prj-j-config', () => null),
    mover: useState<number | null>('prj-j-mover', () => null),
    item: useState<number | null>('prj-j-item', () => null),
  }

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

  function mostrarNoMenu(id: number) {
    const atual = meuMenu.value[eu.value] ?? []
    if (!atual.includes(id)) meuMenu.value = { ...meuMenu.value, [eu.value]: [...atual, id] }
  }
  function ocultarDoMenu(id: number) {
    meuMenu.value = { ...meuMenu.value, [eu.value]: (meuMenu.value[eu.value] ?? []).filter(x => x !== id) }
  }
  function reordenar(ids: number[]) {
    meuMenu.value = { ...meuMenu.value, [eu.value]: ids }
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
    tela.value = entra(p) ? { tipo: 'projeto', id } : { tipo: 'semAcesso', id }
    if (entra(p) && !expandidos.value.includes(id)) expandidos.value = [...expandidos.value, id]
  }
  function abrirCategoria(id: number) {
    tela.value = { tipo: 'categoria', id }
    const c = categorias.value.find(x => x.id === id)
    if (c?.projeto && !expandidos.value.includes(c.projeto)) expandidos.value = [...expandidos.value, c.projeto]
  }

  let proximoId = 500
  function criarProjeto(dados: {
    nome: string
    descricao: string
    icone: string
    cor: Projeto['cor']
    visibilidade: Visibilidade
    categorias: number[]
    participantes: Participante[]
    noMenuDeTodos: boolean
  }) {
    const id = ++proximoId
    const novo: Projeto = {
      id,
      referencia: `PRJ${id.toString(16).toUpperCase()}X`,
      nome: dados.nome,
      descricao: dados.descricao,
      icone: dados.icone,
      cor: dados.cor,
      visibilidade: dados.visibilidade,
      status: 'ativo',
      participantes: [{ tipo: 'pessoa', id: eu.value, papel: 'admin' }, ...dados.participantes.filter(x => !(x.tipo === 'pessoa' && x.id === eu.value))],
      permissaoPadrao: { ver: true, criar: true, editar: true, excluir: false },
      telas: [],
      noMenuDeTodos: dados.noMenuDeTodos,
      criadoEm: '2026-11-25',
      atividade: [{ quem: eu.value, oque: 'criou o projeto', quando: 'agora' }],
    }
    projetos.value = [...projetos.value, novo]
    categorias.value = categorias.value.map(c => dados.categorias.includes(c.id) ? { ...c, projeto: id } : c)
    mostrarNoMenu(id)
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
    ativos, visiveis, queEntro, noMenu, estaNoMenu, mostrarNoMenu, ocultarDoMenu, reordenar,
    categoriasDe, categoriasDoWorkspace, veCategoria, projetoDa,
    aplicarCenario, trocarPessoa, abrirProjeto, abrirCategoria,
    criarProjeto, moverCategoria, atualizarProjeto, arquivar, restaurar, excluir, pedirAcesso, alcance, quantosVeem,
  }
}

/**
 * Contorno tracejado no que é proposta (a chave fica no andaime), como nos outros protótipos.
 * A casca do menu novo vem do protótipo menu-lateral; o que este protótipo acrescenta é a proposta.
 */
export function useMarcaDeProposta() {
  const destacar = useState<boolean>('prj-destacar', () => false)
  return {
    destacar,
    marca: computed(() => destacar.value ? 'outline-2 outline-dashed outline-offset-2 outline-warning rounded-md' : ''),
  }
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
