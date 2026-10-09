/**
 * O estado da tela do cargo, em memória. Recarregar volta ao começo.
 *
 * A proposta tem 3 níveis, e cada um pode seguir o de cima:
 *
 *   padrão das categorias  →  categoria  →  formulário
 *                                        →  campo
 *
 * - `padrao`: as 4 ações que valem para toda categoria sem regra própria,
 *   inclusive as criadas depois;
 * - `categorias[id].proprio`: `null` segue o padrão; um objeto é a regra própria;
 * - `categorias[id].campos`: `null` = todos os campos que a ação libera;
 *   um objeto = a lista escolhida campo a campo, por ação;
 * - `categorias[id].formularios[id]`: `null` segue a categoria;
 * - `padraoItens` e `categorias[id].itens`: "Quais itens". Por ação (Ver,
 *   Atualizar, Excluir), só se a pessoa for a criadora e/ou a responsável.
 *   Na categoria, `null` segue o padrão; `campos` diz quais campos Pessoa
 *   contam como responsável. No padrão vale qualquer campo Pessoa.
 *
 * Dependência: Atualizar e Excluir exigem Ver. Quem marca uma delas marca Ver,
 * e Ver fica travado enquanto elas estiverem marcadas.
 */
import {
  type Acao,
  type AcaoDeAlcance,
  type AcaoDeCampo,
  type CategoriaMock,
  type Cenario,
  type GrupoFixo,
  type RegraDeItens,
  acoes,
  acoesDeAlcance,
  camposPessoa,
  acoesDeCampo,
  categoriasDoCenario,
  configuracoes,
  fixasIniciais,
  padrao,
} from './mocks'

export type MapaDeAcoes = Record<Acao, boolean>

export interface EstadoDaCategoria {
  proprio: MapaDeAcoes | null
  campos: Record<AcaoDeCampo, string[]> | null
  formularios: Record<number, MapaDeAcoes | null>
  itens: ItensDaCategoria | null
}

export type RegrasDeItens = Partial<Record<AcaoDeAlcance, RegraDeItens>>

export interface ItensDaCategoria {
  regras: RegrasDeItens
  /** Os campos Pessoa que contam como responsável nesta categoria. */
  campos: string[]
}

export interface EstadoDoCargo {
  padrao: MapaDeAcoes
  /** "Quais itens" do padrão: vale para toda categoria que não tem a sua. */
  padraoItens: RegrasDeItens
  categorias: Record<number, EstadoDaCategoria>
  /** Permissões fixas marcadas, chave `linha:acao`. */
  fixas: string[]
}

export const vazio = (): MapaDeAcoes => ({ criar: false, ver: false, atualizar: false, excluir: false })

/** A ação que exige Ver neste mapa, ou `null`. Atualizar vem antes de Excluir. */
export function verExigidoPor(m: MapaDeAcoes): Acao | null {
  if (m.atualizar)
    return 'atualizar'
  if (m.excluir)
    return 'excluir'
  return null
}

/** Aplica a dependência: Atualizar ou Excluir marcados ligam Ver. */
export function comDependencia(m: MapaDeAcoes): MapaDeAcoes {
  return verExigidoPor(m) ? { ...m, ver: true } : m
}

/** O cargo como está gravado ao abrir a tela. */
export function estadoInicial(lista: CategoriaMock[]): EstadoDoCargo {
  const categorias: Record<number, EstadoDaCategoria> = {}
  lista.forEach((c, i) => {
    const e: EstadoDaCategoria = { proprio: null, campos: null, formularios: {}, itens: null }
    const responsavel = camposPessoa(c).find(f => f.label === 'Responsável') ?? camposPessoa(c)[0]
    c.formularios.forEach(f => (e.formularios[f.id] = null))

    // Analista de Contratos: cria e atualiza onde o assunto é contrato.
    if (/Contrato|Aditivo|Procura/.test(c.name))
      e.proprio = { criar: true, ver: true, atualizar: true, excluir: false }
    // Reembolsos: cria e acompanha só os que ele mesmo abriu.
    if (/Reembolso/.test(c.name)) {
      e.proprio = { criar: true, ver: true, atualizar: true, excluir: false }
      e.itens = { regras: { ver: { criador: true, responsavel: false }, atualizar: { criador: true, responsavel: false } }, campos: responsavel ? [responsavel.name] : [] }
    }
    // Chamados de TI: vê os que abriu e os que estão com ele.
    if (/Chamados de TI/.test(c.name)) {
      e.proprio = { criar: true, ver: true, atualizar: false, excluir: false }
      e.itens = { regras: { ver: { criador: true, responsavel: true } }, campos: responsavel ? [responsavel.name] : [] }
    }
    // Folha de pagamento e desligamento: não vê.
    if (/Admiss|Desligamento|Avalia/.test(c.name))
      e.proprio = vazio()
    // Contratos de Fornecedores: o valor e a multa não aparecem.
    if (i === 0) {
      const ocultos = ['Valor do contrato', 'Multa por rescisão', 'Agência e conta', 'Banco']
      const visiveis = c.campos.filter(f => !ocultos.includes(f.label ?? '')).map(f => f.name)
      e.campos = { criar: [...visiveis], ver: ['created_at', 'updated_at', ...visiveis], atualizar: [...visiveis] }
      // O formulário de assinatura só se vê.
      const assinatura = c.formularios.find(f => f.nome === 'Assinatura')
      if (assinatura)
        e.formularios[assinatura.id] = { criar: false, ver: true, atualizar: false, excluir: false }
    }
    categorias[c.id] = e
  })
  return {
    padrao: { criar: false, ver: true, atualizar: false, excluir: false },
    padraoItens: {},
    categorias,
    fixas: [...fixasIniciais],
  }
}

export function clonar<T>(x: T): T {
  return JSON.parse(JSON.stringify(x))
}

/* ------------------------------------------------------------------ *
 * Quais itens
 * ------------------------------------------------------------------ */

/** As regras que valem na categoria: as dela ou, se não tiver, as do padrão. */
export function itensDaCategoria(e: EstadoDoCargo, id: number): RegrasDeItens {
  return e.categorias[id]?.itens?.regras ?? e.padraoItens
}

export function temRegra(r?: RegraDeItens) {
  return !!r && (r.criador || r.responsavel)
}

/** O campo Pessoa que conta como responsável quando a categoria cria a regra dela. */
export function camposPadraoDeResponsavel(c: CategoriaMock) {
  const p = camposPessoa(c)
  const r = p.find(f => f.label === 'Responsável') ?? p[0]
  return r ? [r.name] : []
}

/**
 * Marca ou desmarca uma regra (criador ou responsável) numa ação.
 * `c` nulo = o padrão. Na categoria que segue o padrão, a primeira mudança
 * copia o padrão e cria a regra dela.
 */
export function definirRegra(e: EstadoDoCargo, c: CategoriaMock | null, acao: AcaoDeAlcance, tipo: keyof RegraDeItens, valor: boolean) {
  const limpar = (r: RegrasDeItens) => {
    const saida: RegrasDeItens = {}
    for (const a of acoesDeAlcance) {
      if (temRegra(r[a]))
        saida[a] = r[a]
    }
    return saida
  }
  if (!c) {
    const atual = e.padraoItens[acao] ?? { criador: false, responsavel: false }
    e.padraoItens = limpar({ ...e.padraoItens, [acao]: { ...atual, [tipo]: valor } })
    return
  }
  const ec = e.categorias[c.id]!
  const base = ec.itens ?? { regras: clonar(e.padraoItens), campos: camposPadraoDeResponsavel(c) }
  const atual = base.regras[acao] ?? { criador: false, responsavel: false }
  ec.itens = { ...base, regras: limpar({ ...base.regras, [acao]: { ...atual, [tipo]: valor } }) }
}

/** Alguma ação liberada nesta categoria vale só para parte dos itens? */
export function temRegraDeItens(e: EstadoDoCargo, c: CategoriaMock) {
  const a = acoesDaCategoria(e, c.id)
  const r = itensDaCategoria(e, c.id)
  return acoesDeAlcance.some(x => a[x] && temRegra(r[x]))
}

/* ------------------------------------------------------------------ *
 * Leitura: o que vale de verdade em cada nível.
 * ------------------------------------------------------------------ */

export function acoesDaCategoria(e: EstadoDoCargo, id: number): MapaDeAcoes {
  return e.categorias[id]?.proprio ?? e.padrao
}

export function acoesDoFormulario(e: EstadoDoCargo, idCategoria: number, idForm: number): MapaDeAcoes {
  return e.categorias[idCategoria]?.formularios[idForm] ?? acoesDaCategoria(e, idCategoria)
}

export function campoLiberado(e: EstadoDoCargo, c: CategoriaMock, acao: AcaoDeCampo, campo: string): boolean {
  if (!acoesDaCategoria(e, c.id)[acao])
    return false
  const lista = e.categorias[c.id]?.campos
  return lista ? lista[acao].includes(campo) : true
}

/** Quantos campos a categoria libera, somando as 3 ações. `null` = todos. */
export function resumoDeCampos(e: EstadoDoCargo, c: CategoriaMock): { liberados: number, total: number } | null {
  const lista = e.categorias[c.id]?.campos
  if (!lista)
    return null
  const a = acoesDaCategoria(e, c.id)
  const ativos = acoesDeCampo.filter(x => a[x])
  if (!ativos.length)
    return null
  // "Criado em" e "Atualizado em" são do sistema e ficam fora da conta.
  const doCategoria = new Set(c.campos.map(f => f.name))
  const visiveis = new Set(ativos.flatMap(x => lista[x]).filter(n => doCategoria.has(n)))
  return { liberados: visiveis.size, total: c.campos.length }
}

export function formulariosProprios(e: EstadoDoCargo, c: CategoriaMock): number {
  return c.formularios.filter(f => e.categorias[c.id]?.formularios[f.id]).length
}

export function temAcesso(e: EstadoDoCargo, id: number): boolean {
  return acoes.some(a => acoesDaCategoria(e, id)[a])
}

/* ------------------------------------------------------------------ *
 * Contagem que a tela já mostra hoje: "Permissões Ativas N / total".
 * No develop o total soma ações de categoria, de formulário e as fixas
 * (2 categorias + 1 formulário = 12, mais 15 + 67 = 94). Campos não contam.
 * ------------------------------------------------------------------ */

export function totalDePermissoes(lista: CategoriaMock[]): number {
  const fixas = [...padrao, ...configuracoes].flatMap(g => g.linhas).reduce((s, l) => s + l.acoes.length + (l.outras?.length ?? 0), 0)
  return fixas + lista.reduce((s, c) => s + 4 + c.formularios.length * 4, 0)
}

export function permissoesAtivas(e: EstadoDoCargo, lista: CategoriaMock[]): number {
  let n = e.fixas.length
  for (const c of lista) {
    n += acoes.filter(a => acoesDaCategoria(e, c.id)[a]).length
    for (const f of c.formularios)
      n += acoes.filter(a => acoesDoFormulario(e, c.id, f.id)[a]).length
  }
  return n
}

/* ------------------------------------------------------------------ *
 * O tamanho da árvore de hoje, para o andaime comparar.
 * Medido no develop: por categoria, 1 nó + 4 ações + 3 listas de campos
 * (Criar, Ver e Atualizar) + "Criado em" e "Atualizado em" + 5 por formulário.
 * A seção Padrão tem 21 nós. Bate com os 145 nós de "teste ux 2".
 * ------------------------------------------------------------------ */

export function caixasNaArvoreDeHoje(lista: CategoriaMock[]): number {
  return 21 + lista.reduce((s, c) => s + 5 + 3 * c.campos.length + 2 + 5 * c.formularios.length, 0)
}

/** Altura medida no develop: 4.803 px para 145 nós, cerca de 33 px por linha. */
export const pixelsPorLinhaHoje = 33

/* ------------------------------------------------------------------ *
 * Mudanças pendentes, em palavras, para a confirmação.
 * ------------------------------------------------------------------ */

export interface Mudanca {
  onde: string
  /** Chaves de texto e parâmetros, resolvidos na tela com o idioma. */
  partes: { chave: string, valor?: string | number }[]
}

function diffAcoes(antes: MapaDeAcoes, depois: MapaDeAcoes) {
  const liberou = acoes.filter(a => depois[a] && !antes[a])
  const tirou = acoes.filter(a => !depois[a] && antes[a])
  return { liberou, tirou }
}

export function mudancas(
  salvo: EstadoDoCargo,
  atual: EstadoDoCargo,
  lista: CategoriaMock[],
  grupos: GrupoFixo[],
  rotuloFixo: (chave: string) => string,
): Mudanca[] {
  const saida: Mudanca[] = []

  const p = diffAcoes(salvo.padrao, atual.padrao)
  if (p.liberou.length || p.tirou.length) {
    const partes: Mudanca['partes'] = []
    if (p.liberou.length)
      partes.push({ chave: 'liberou', valor: p.liberou.join(',') })
    if (p.tirou.length)
      partes.push({ chave: 'tirou', valor: p.tirou.join(',') })
    partes.push({ chave: 'segueOPadrao', valor: lista.filter(c => !atual.categorias[c.id]?.proprio).length })
    saida.push({ onde: '__padrao__', partes })
  }
  if (JSON.stringify(salvo.padraoItens) !== JSON.stringify(atual.padraoItens)) {
    const ja = saida.find(m => m.onde === '__padrao__')
    if (ja)
      ja.partes.push({ chave: 'alcance' })
    else
      saida.push({ onde: '__padrao__', partes: [{ chave: 'alcance' }] })
  }

  for (const c of lista) {
    const a = salvo.categorias[c.id]
    const b = atual.categorias[c.id]
    if (!a || !b || JSON.stringify(a) === JSON.stringify(b))
      continue
    const partes: Mudanca['partes'] = []
    if (!a.proprio && b.proprio)
      partes.push({ chave: 'ganhouRegra' })
    if (a.proprio && !b.proprio)
      partes.push({ chave: 'voltouAoPadrao' })
    const d = diffAcoes(a.proprio ?? salvo.padrao, b.proprio ?? atual.padrao)
    if (d.liberou.length)
      partes.push({ chave: 'liberou', valor: d.liberou.join(',') })
    if (d.tirou.length)
      partes.push({ chave: 'tirou', valor: d.tirou.join(',') })
    if (JSON.stringify(a.campos) !== JSON.stringify(b.campos))
      partes.push(b.campos ? { chave: 'camposEscolhidos', valor: resumoDeCampos(atual, c)?.liberados ?? 0 } : { chave: 'todosOsCampos' })
    if (JSON.stringify(a.itens) !== JSON.stringify(b.itens))
      partes.push({ chave: 'alcance' })
    const fa = c.formularios.filter(f => JSON.stringify(a.formularios[f.id]) !== JSON.stringify(b.formularios[f.id])).length
    if (fa)
      partes.push({ chave: 'formularios', valor: fa })
    if (partes.length)
      saida.push({ onde: c.name, partes })
  }

  const ganhou = atual.fixas.filter(x => !salvo.fixas.includes(x))
  const perdeu = salvo.fixas.filter(x => !atual.fixas.includes(x))
  const porLinha = new Map<string, { l: string[], t: string[] }>()
  for (const x of ganhou) {
    const [l, ac] = x.split(':') as [string, string]
    porLinha.set(l, { l: [...(porLinha.get(l)?.l ?? []), ac], t: porLinha.get(l)?.t ?? [] })
  }
  for (const x of perdeu) {
    const [l, ac] = x.split(':') as [string, string]
    porLinha.set(l, { l: porLinha.get(l)?.l ?? [], t: [...(porLinha.get(l)?.t ?? []), ac] })
  }
  const ordem = grupos.flatMap(g => g.linhas.map(l => l.chave))
  for (const l of ordem) {
    const m = porLinha.get(l)
    if (!m)
      continue
    const partes: Mudanca['partes'] = []
    if (m.l.length)
      partes.push({ chave: 'liberou', valor: m.l.join(',') })
    if (m.t.length)
      partes.push({ chave: 'tirou', valor: m.t.join(',') })
    saida.push({ onde: rotuloFixo(l), partes })
  }
  return saida
}

export { categoriasDoCenario }
export type { Cenario }
