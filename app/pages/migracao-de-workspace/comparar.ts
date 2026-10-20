/**
 * A comparação entre o workspace atual e o arquivo, no navegador, sobre o mock.
 *
 * Os três modos formam uma escada. Cada um faz tudo o que o anterior faz e mais
 * uma coisa:
 *
 *   adicionar  → entra o que falta
 *   somar      → entra o que falta  + o que existe recebe as mudanças do arquivo
 *   substituir → entra o que falta  + recebe as mudanças + sai o que o arquivo não tem
 *
 * Nenhum modo duplica. Hoje o produto duplica tudo o que já existe (aviso
 * "Atenção" da tela atual).
 *
 * Identidade: categoria por `slug`, campo por `refId`, formulário e pasta por
 * nome, componente por `ref`. É a proposta; a chave final é decisão do back-end
 * (o arquivo também traz `migration_hash`).
 */
import type {
  CampoDaEstrutura,
  CategoriaDaEstrutura,
  ComponenteDaEstrutura,
  ConfiguracaoDaEtapa,
  EtapaDaEstrutura,
  Estrutura,
  TarefaDaEstrutura,
  TipoDeAcao,
  TipoDeCampo,
  TipoDeComponente,
  TipoDeConfiguracao,
} from './mocks'

export type Modo = 'adicionar' | 'somar' | 'substituir'

/**
 * - nova: só no arquivo, entra.
 * - alterada: nos dois, com diferença, e o modo aplica a diferença.
 * - removida: só no workspace, e o modo apaga.
 * - igual: nos dois, sem diferença.
 * - mantida: só no workspace, e o modo deixa como está.
 * - ignorada: nos dois, com diferença, mas o modo não aplica (só em "adicionar").
 */
export type Situacao = 'nova' | 'alterada' | 'removida' | 'igual' | 'mantida' | 'ignorada'

export type Mudanca =
  | { tipo: 'nome', antes: string, depois: string }
  | { tipo: 'tipoDeCampo', antes: TipoDeCampo, depois: TipoDeCampo }
  | { tipo: 'opcoesNovas', opcoes: string[] }
  | { tipo: 'opcoesRemovidas', opcoes: string[] }
  /** Propriedade da etapa ou da tarefa: posição, responsável, ação. */
  | { tipo: 'propriedade', rotulo: 'posicao' | 'responsavel' | 'acao', antes: string, depois: string }

export interface NoFolha {
  chave: string
  nome: string
  situacao: Situacao
  mudancas: Mudanca[]
  /** Só para campo: o tipo, para a pessoa reconhecer o campo. */
  tipoDeCampo?: TipoDeCampo
  /** Só para tarefa da etapa. */
  acao?: TipoDeAcao
  /** Só para configuração da etapa. */
  tipoDeConfiguracao?: TipoDeConfiguracao
  /** Configuração que cita algo que não existe no destino (RV-19). */
  quebrada?: string
}

/** Etapa do fluxo da categoria, com as tarefas e as configurações dela. */
export interface NoEtapa {
  chave: string
  nome: string
  situacao: Situacao
  mudancas: Mudanca[]
  tarefas: NoFolha[]
  configuracoes: NoFolha[]
  itens?: number
  tarefasAbertas?: number
}

export interface NoCategoria {
  slug: string
  nome: string
  icone: string
  situacao: Situacao
  /** Quando o nome da categoria muda. */
  mudancas: Mudanca[]
  campos: NoFolha[]
  formularios: NoFolha[]
  pastas: NoFolha[]
  fluxo: NoEtapa[]
  itens?: number
}

export interface Comparacao {
  categorias: NoCategoria[]
  componentes: Record<TipoDeComponente, NoFolha[]>
  /** Contagem por situação, somando categorias, campos, formulários, pastas e componentes. */
  total: Record<Situacao, number>
  /** Contagem só das categorias, que é o que a pessoa reconhece primeiro. */
  totalDeCategorias: Record<Situacao, number>
  /** Itens cadastrados que saem junto com as categorias removidas. */
  itensQueSaem: number
}

export const tiposDeComponente: TipoDeComponente[] = ['listas', 'telas', 'grupos', 'emails', 'relatorios', 'documentos', 'menus']

function zerado(): Record<Situacao, number> {
  return { nova: 0, alterada: 0, removida: 0, igual: 0, mantida: 0, ignorada: 0 }
}

/** O que acontece com um elemento que está nos dois lados. */
function situacaoDeQuemEstaNosDois(temDiferenca: boolean, modo: Modo): Situacao {
  if (!temDiferenca) return 'igual'
  return modo === 'adicionar' ? 'ignorada' : 'alterada'
}

/** O que acontece com um elemento que só existe no workspace. */
function situacaoDeQuemSoEstaNoWorkspace(modo: Modo): Situacao {
  return modo === 'substituir' ? 'removida' : 'mantida'
}

function diferencaDeOpcoes(antes: string[] = [], depois: string[] = [], modo: Modo): Mudanca[] {
  const novas = depois.filter(o => !antes.includes(o))
  const removidas = antes.filter(o => !depois.includes(o))
  const lista: Mudanca[] = []
  if (novas.length) lista.push({ tipo: 'opcoesNovas', opcoes: novas })
  // Somar não apaga nada, nem opção de lista.
  if (removidas.length && modo === 'substituir') lista.push({ tipo: 'opcoesRemovidas', opcoes: removidas })
  return lista
}

function compararCampo(a: CampoDaEstrutura, b: CampoDaEstrutura, modo: Modo): Mudanca[] {
  const lista: Mudanca[] = []
  if (a.label !== b.label) lista.push({ tipo: 'nome', antes: a.label, depois: b.label })
  if (a.type !== b.type) lista.push({ tipo: 'tipoDeCampo', antes: a.type, depois: b.type })
  lista.push(...diferencaDeOpcoes(a.options, b.options, modo))
  return lista
}

/** Compara 2 listas de elementos pela chave e devolve as folhas. */
function compararLista<T>(
  atual: T[],
  arquivo: T[],
  modo: Modo,
  chave: (x: T) => string,
  nome: (x: T) => string,
  mudancas: (a: T, b: T) => Mudanca[] = () => [],
  tipo?: (x: T) => TipoDeCampo,
): NoFolha[] {
  const folhas: NoFolha[] = []
  for (const b of arquivo) {
    const a = atual.find(x => chave(x) === chave(b))
    if (!a) {
      folhas.push({ chave: chave(b), nome: nome(b), situacao: 'nova', mudancas: [], tipoDeCampo: tipo?.(b) })
      continue
    }
    const m = mudancas(a, b)
    const situacao = situacaoDeQuemEstaNosDois(m.length > 0, modo)
    folhas.push({ chave: chave(b), nome: nome(a), situacao, mudancas: m, tipoDeCampo: tipo?.(a) })
  }
  for (const a of atual) {
    if (arquivo.some(b => chave(b) === chave(a))) continue
    folhas.push({ chave: chave(a), nome: nome(a), situacao: situacaoDeQuemSoEstaNoWorkspace(modo), mudancas: [], tipoDeCampo: tipo?.(a) })
  }
  return folhas
}

/** A categoria herda a situação mais forte dos filhos. */
function situacaoDaCategoria(filhos: { situacao: Situacao }[], mudancasProprias: Mudanca[], modo: Modo): Situacao {
  const mexe = filhos.some(f => f.situacao === 'nova' || f.situacao === 'alterada' || f.situacao === 'removida')
  if (mexe) return 'alterada'
  if (mudancasProprias.length) return situacaoDeQuemEstaNosDois(true, modo)
  if (filhos.some(f => f.situacao === 'ignorada')) return 'ignorada'
  return 'igual'
}

function folhaDeTarefa(t: TarefaDaEstrutura, situacao: Situacao, mudancas: Mudanca[] = []): NoFolha {
  return { chave: t.ref, nome: t.nome, situacao, mudancas, acao: t.acao }
}

function folhaDeConfiguracao(c: ConfiguracaoDaEtapa, situacao: Situacao, mudancas: Mudanca[] = []): NoFolha {
  // A referência quebrada só pesa no que o arquivo leva para o workspace.
  const leva = situacao === 'nova' || situacao === 'alterada'
  return { chave: c.ref, nome: c.nome, situacao, mudancas, tipoDeConfiguracao: c.tipo, quebrada: leva ? c.quebrada : undefined }
}

function etapaSozinha(e: EtapaDaEstrutura, situacao: Situacao): NoEtapa {
  return {
    chave: e.ref,
    nome: e.nome,
    situacao,
    mudancas: [],
    tarefas: e.tarefas.map(t => folhaDeTarefa(t, situacao)),
    configuracoes: e.configuracoes.map(c => folhaDeConfiguracao(c, situacao)),
    itens: e.itens,
    tarefasAbertas: e.tarefasAbertas,
  }
}

/** Compara 2 listas pela chave e devolve a situação de cada par, como `compararLista`, mas com o objeto inteiro. */
function parear<T extends { ref: string }>(atual: T[], arquivo: T[]) {
  const pares: { a?: T, b?: T }[] = arquivo.map(b => ({ a: atual.find(x => x.ref === b.ref), b }))
  for (const a of atual) if (!arquivo.some(b => b.ref === a.ref)) pares.push({ a })
  return pares
}

function compararFluxo(atual: EtapaDaEstrutura[] = [], arquivo: EtapaDaEstrutura[] = [], modo: Modo): NoEtapa[] {
  const resultado: NoEtapa[] = []
  for (const { a, b } of parear(atual, arquivo)) {
    if (!a) { resultado.push(etapaSozinha(b!, 'nova')); continue }
    if (!b) { resultado.push(etapaSozinha(a, situacaoDeQuemSoEstaNoWorkspace(modo))); continue }

    const proprias: Mudanca[] = []
    if (a.nome !== b.nome) proprias.push({ tipo: 'nome', antes: a.nome, depois: b.nome })
    if (a.posicao !== b.posicao) proprias.push({ tipo: 'propriedade', rotulo: 'posicao', antes: String(a.posicao), depois: String(b.posicao) })

    const tarefas = parear(a.tarefas, b.tarefas).map(({ a: ta, b: tb }) => {
      if (!ta) return folhaDeTarefa(tb!, 'nova')
      if (!tb) return folhaDeTarefa(ta, situacaoDeQuemSoEstaNoWorkspace(modo))
      const m: Mudanca[] = []
      if (ta.nome !== tb.nome) m.push({ tipo: 'nome', antes: ta.nome, depois: tb.nome })
      if (ta.acao !== tb.acao) m.push({ tipo: 'propriedade', rotulo: 'acao', antes: ta.acao, depois: tb.acao })
      if (ta.responsavel !== tb.responsavel) m.push({ tipo: 'propriedade', rotulo: 'responsavel', antes: ta.responsavel, depois: tb.responsavel })
      return folhaDeTarefa(ta, situacaoDeQuemEstaNosDois(m.length > 0, modo), m)
    })

    const configuracoes = parear(a.configuracoes, b.configuracoes).map(({ a: ca, b: cb }) => {
      if (!ca) return folhaDeConfiguracao(cb!, 'nova')
      if (!cb) return folhaDeConfiguracao(ca, situacaoDeQuemSoEstaNoWorkspace(modo))
      const m: Mudanca[] = ca.nome !== cb.nome ? [{ tipo: 'nome', antes: ca.nome, depois: cb.nome }] : []
      return folhaDeConfiguracao(cb, situacaoDeQuemEstaNosDois(m.length > 0, modo), m)
    })

    resultado.push({
      chave: a.ref,
      nome: a.nome,
      situacao: situacaoDaCategoria([...tarefas, ...configuracoes], proprias, modo),
      mudancas: proprias,
      tarefas,
      configuracoes,
      itens: a.itens,
      tarefasAbertas: a.tarefasAbertas,
    })
  }
  return resultado
}

function folhasDaCategoriaSozinha(c: CategoriaDaEstrutura, situacao: Situacao) {
  return {
    campos: c.campos.map(f => ({ chave: f.refId, nome: f.label, situacao, mudancas: [], tipoDeCampo: f.type })),
    formularios: c.formularios.map(n => ({ chave: n, nome: n, situacao, mudancas: [] })),
    pastas: c.pastas.map(n => ({ chave: n, nome: n, situacao, mudancas: [] })),
    fluxo: (c.fluxo ?? []).map(e => etapaSozinha(e, situacao)),
  }
}

export function comparar(atual: Estrutura, arquivo: Estrutura, modo: Modo): Comparacao {
  const categorias: NoCategoria[] = []

  for (const b of arquivo.categorias) {
    const a = atual.categorias.find(x => x.slug === b.slug)
    if (!a) {
      categorias.push({ slug: b.slug, nome: b.name, icone: b.icon, situacao: 'nova', mudancas: [], ...folhasDaCategoriaSozinha(b, 'nova') })
      continue
    }
    const campos = compararLista(a.campos, b.campos, modo, f => f.refId, f => f.label, (x, y) => compararCampo(x, y, modo), f => f.type)
    const formularios = compararLista(a.formularios, b.formularios, modo, n => n, n => n)
    const pastas = compararLista(a.pastas, b.pastas, modo, n => n, n => n)
    const fluxo = compararFluxo(a.fluxo, b.fluxo, modo)
    const proprias: Mudanca[] = a.name !== b.name ? [{ tipo: 'nome', antes: a.name, depois: b.name }] : []
    categorias.push({
      slug: a.slug,
      nome: a.name,
      icone: a.icon,
      situacao: situacaoDaCategoria([...campos, ...formularios, ...pastas, ...fluxo], proprias, modo),
      mudancas: proprias,
      campos,
      formularios,
      pastas,
      fluxo,
      itens: a.itens,
    })
  }

  for (const a of atual.categorias) {
    if (arquivo.categorias.some(b => b.slug === a.slug)) continue
    const situacao = situacaoDeQuemSoEstaNoWorkspace(modo)
    categorias.push({ slug: a.slug, nome: a.name, icone: a.icon, situacao, mudancas: [], ...folhasDaCategoriaSozinha(a, situacao), itens: a.itens })
  }

  const componentes = Object.fromEntries(
    tiposDeComponente.map(tipo => [
      tipo,
      compararLista<ComponenteDaEstrutura>(
        atual.componentes[tipo],
        arquivo.componentes[tipo],
        modo,
        x => x.ref,
        x => x.nome,
        (x, y) => [
          ...(x.nome !== y.nome ? [{ tipo: 'nome', antes: x.nome, depois: y.nome } as Mudanca] : []),
          ...diferencaDeOpcoes(x.opcoes, y.opcoes, modo),
        ],
      ),
    ]),
  ) as Record<TipoDeComponente, NoFolha[]>

  const total = zerado()
  const totalDeCategorias = zerado()
  let itensQueSaem = 0
  for (const c of categorias) {
    totalDeCategorias[c.situacao]++
    total[c.situacao]++
    if (c.situacao === 'removida') itensQueSaem += c.itens ?? 0
    // Categoria nova ou removida conta como 1 coisa: os filhos vão junto.
    if (c.situacao === 'nova' || c.situacao === 'removida') continue
    for (const f of [...c.campos, ...c.formularios, ...c.pastas, ...c.fluxo]) total[f.situacao]++
  }
  for (const tipo of tiposDeComponente) {
    for (const f of componentes[tipo]) total[f.situacao]++
  }

  return { categorias, componentes, total, totalDeCategorias, itensQueSaem }
}

/** Quantas coisas cada arquivo traz, para o resumo do arquivo lido. */
export function contarEstrutura(e: Estrutura) {
  return {
    categorias: e.categorias.length,
    campos: e.categorias.reduce((s, c) => s + c.campos.length, 0),
    formularios: e.categorias.reduce((s, c) => s + c.formularios.length, 0),
    etapas: e.categorias.reduce((s, c) => s + (c.fluxo?.length ?? 0), 0),
    outros: tiposDeComponente.reduce((s, t) => s + e.componentes[t].length, 0),
  }
}

/** Há alguma coisa em comum entre os dois lados? Sem nada em comum, não há o que comparar. */
export function temAlgoEmComum(atual: Estrutura, arquivo: Estrutura) {
  if (arquivo.categorias.some(b => atual.categorias.some(a => a.slug === b.slug))) return true
  return tiposDeComponente.some(t => arquivo.componentes[t].some(b => atual.componentes[t].some(a => a.ref === b.ref)))
}
