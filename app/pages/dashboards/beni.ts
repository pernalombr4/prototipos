/**
 * PROPOSTA (rodada 2): o que o BENI faz ao montar um dashboard. No protótipo é uma
 * regra fixa sobre o `mocks.ts`; no produto, é o agente lendo o schema da categoria.
 *
 * O que o BENI consegue ler sozinho, sem adivinhar:
 * - o tipo de cada campo (seleção, múltipla seleção, relação, número, moeda, data);
 * - quantas opções cada seleção tem e quantos itens a categoria tem.
 *
 * O que ele NÃO consegue saber pelo nome nem pelo tipo, e por isso pergunta:
 * - se um campo de número se soma (dinheiro, quantidade) ou se tira a média (nota,
 *   prazo, taxa). "Vigência em meses" é número, e somar vigência não faz sentido;
 * - qual data marca o fato da categoria, quando há mais de 1;
 * - se as opções de uma seleção são etapas em ordem (o que permite funil).
 * O que a pessoa responde muda os painéis propostos. Nada vira painel sem ela aceitar.
 */
import type { ConfigDoPainel, Visualizacao } from './agregacao'
import { TAMANHOS, campoDe, ehData, ehMedida, ehMultiplo, painelEmBranco } from './agregacao'
import type { CampoDoMock } from './mocks'
import { categoriaPorSlug, itensDa } from './mocks'

export type UsoDaMedida = 'soma' | 'media' | 'ignorar'

export interface Pergunta {
  id: string
  categoria: string
  campo: string
  tipo: 'medida' | 'data' | 'etapas'
  /** O palpite do BENI, que a pessoa confirma ou troca. */
  resposta: string
}

export interface Proposta {
  cfg: ConfigDoPainel
  /** Por que o BENI propôs: a chave do motivo e o campo em questão. */
  motivo: { tipo: 'contagem' | 'soma' | 'media' | 'tempo' | 'distribuicao' | 'etapas' | 'relacao' | 'multiplo', campo?: string, categoria: string }
  aceita: boolean
}

/** A leitura de 1 categoria, para a lista "Lendo...". */
export function lerCategoria(slug: string) {
  const cat = categoriaPorSlug.get(slug)!
  const proprios = cat.campos.filter(c => !c.sistema)
  return {
    slug,
    nome: cat.name,
    icone: cat.icon,
    itens: itensDa(slug).length,
    campos: proprios.length,
    selecoes: proprios.filter(c => c.options && !ehData(c)).length,
    numeros: proprios.filter(ehMedida).length,
    datas: cat.campos.filter(ehData).length,
  }
}

const proprios = (slug: string) => categoriaPorSlug.get(slug)!.campos.filter(c => !c.sistema)
/** A seleção simples com 4 opções ou mais: candidata a etapas. */
const candidataAEtapas = (slug: string) => proprios(slug).find(c => !!c.options && !ehMultiplo(c) && c.type !== 'inputSwitch' && (c.options?.length ?? 0) >= 4)

/** As perguntas que o BENI faz antes de propor, no máximo 4 por categoria. */
export function perguntasPara(slugs: string[]): Pergunta[] {
  const lista: Pergunta[] = []
  for (const slug of slugs) {
    const cat = categoriaPorSlug.get(slug)!
    const daCategoria: Pergunta[] = []
    for (const c of proprios(slug).filter(ehMedida)) {
      // Palpite: moeda se soma; o resto (nota, horas, meses, expressão) se tira a média.
      daCategoria.push({ id: `${slug}.${c.refId}`, categoria: slug, campo: c.refId, tipo: 'medida', resposta: c.type === 'EnCurrency' ? 'soma' : 'media' })
    }
    const datas = cat.campos.filter(ehData)
    if (datas.length > 2) {
      const propria = datas.find(d => !d.sistema)
      daCategoria.push({ id: `${slug}.data`, categoria: slug, campo: 'data', tipo: 'data', resposta: propria?.refId ?? 'created_at' })
    }
    const etapas = candidataAEtapas(slug)
    if (etapas) daCategoria.push({ id: `${slug}.etapas`, categoria: slug, campo: etapas.refId, tipo: 'etapas', resposta: /status|etapa|fase/i.test(etapas.name) ? 'sim' : 'nao' })
    lista.push(...daCategoria.slice(0, 4))
  }
  return lista
}

let seq = 0
const novoId = () => `beni-${Date.now()}-${seq++}`

function painel(slug: string, v: Visualizacao, cfg: Partial<ConfigDoPainel>): ConfigDoPainel {
  const [w, h] = TAMANHOS[v]
  return { ...painelEmBranco(novoId(), slug), visualizacao: v, w, h, ...cfg }
}

/** Os painéis propostos para as categorias, já com as respostas da pessoa. */
export function propor(slugs: string[], respostas: Pergunta[]): Proposta[] {
  const lista: Proposta[] = []
  const resposta = (id: string) => respostas.find(r => r.id === id)?.resposta
  for (const slug of slugs) {
    const campos = proprios(slug)
    const data = resposta(`${slug}.data`) ?? 'created_at'
    const somas = campos.filter(c => ehMedida(c) && resposta(`${slug}.${c.refId}`) === 'soma')
    const medias = campos.filter(c => ehMedida(c) && resposta(`${slug}.${c.refId}`) === 'media')

    lista.push({ cfg: painel(slug, 'numero', { campoDeData: data }), motivo: { tipo: 'contagem', categoria: slug }, aceita: true })
    for (const c of somas.slice(0, 1)) lista.push({ cfg: painel(slug, 'numero', { funcao: 'soma', medida: c.refId, campoDeData: data }), motivo: { tipo: 'soma', campo: c.refId, categoria: slug }, aceita: true })
    for (const c of medias.slice(0, 1)) lista.push({ cfg: painel(slug, 'numero', { funcao: 'media', medida: c.refId, campoDeData: data }), motivo: { tipo: 'media', campo: c.refId, categoria: slug }, aceita: true })

    const soma = somas[0]
    lista.push({
      cfg: painel(slug, 'linha', { agruparPor: data, campoDeData: data, granularidade: 'mes', ...(soma ? { funcao: 'soma' as const, medida: soma.refId } : {}) }),
      motivo: { tipo: 'tempo', campo: data, categoria: slug },
      aceita: true,
    })

    const etapas = candidataAEtapas(slug)
    if (etapas && resposta(`${slug}.etapas`) === 'sim') {
      lista.push({ cfg: painel(slug, 'funil', { agruparPor: etapas.refId }), motivo: { tipo: 'etapas', campo: etapas.refId, categoria: slug }, aceita: true })
    }
    const distribuicao = campos.find(c => !!c.options && !ehMultiplo(c) && c.type !== 'inputSwitch' && c.refId !== (resposta(`${slug}.etapas`) === 'sim' ? etapas?.refId : undefined))
    if (distribuicao) lista.push({ cfg: painel(slug, 'barras', { agruparPor: distribuicao.refId }), motivo: { tipo: 'distribuicao', campo: distribuicao.refId, categoria: slug }, aceita: true })
    const relacao = campos.find(c => !!c.relacao)
    if (relacao) lista.push({ cfg: painel(slug, 'barrasHorizontais', { agruparPor: relacao.refId, ordem: 'valorDesc', limite: 8, h: 6 }), motivo: { tipo: 'relacao', campo: relacao.refId, categoria: slug }, aceita: slugs.length === 1 })
    const multiplo = campos.find(ehMultiplo)
    if (multiplo) lista.push({ cfg: painel(slug, 'barrasHorizontais', { agruparPor: multiplo.refId, ordem: 'valorDesc' }), motivo: { tipo: 'multiplo', campo: multiplo.refId, categoria: slug }, aceita: false })
  }
  return lista
}

const normalizar = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/**
 * "Pedir ao BENI" no dashboard sem painéis: a pessoa escreve o que quer ver e o BENI
 * devolve até 3 painéis. Nome de campo citado no pedido vira o eixo.
 */
export function proporDoPedido(pedido: string, slug: string): Proposta[] {
  const texto = normalizar(pedido)
  const campos = categoriaPorSlug.get(slug)!.campos
  const citado = campos.find(c => !ehMedida(c) && !c.sistema && texto.includes(normalizar(c.name)) && (c.options || c.relacao || ehData(c)))
  const medidaCitada = campos.find(c => ehMedida(c) && texto.includes(normalizar(c.name)))
  const querSoma = /soma|total|valor|receita|quanto/.test(texto)
  const querMedia = /media|medio|nota|tempo/.test(texto)
  const querTempo = /mes|semana|dia|tempo|evolu|ao longo|tendencia/.test(texto)
  const medida = medidaCitada ?? (querSoma || querMedia ? campos.find(c => ehMedida(c) && (querSoma ? c.type === 'EnCurrency' : c.type !== 'EnCurrency')) : undefined)
  const funcao = medida ? (querMedia && !querSoma ? 'media' as const : 'soma' as const) : 'contagem' as const
  const valor = medida ? { funcao, medida: medida.refId } : {}
  const lista: Proposta[] = []

  if (citado && ehData(citado)) {
    lista.push({ cfg: painel(slug, 'linha', { agruparPor: citado.refId, campoDeData: citado.refId, ...valor }), motivo: { tipo: 'tempo', campo: citado.refId, categoria: slug }, aceita: true })
  }
  else if (citado) {
    const v: Visualizacao = citado.relacao || ehMultiplo(citado) ? 'barrasHorizontais' : 'barras'
    lista.push({ cfg: painel(slug, v, { agruparPor: citado.refId, ...valor, ...(v === 'barrasHorizontais' ? { ordem: 'valorDesc' as const, limite: 8 } : {}) }), motivo: { tipo: citado.relacao ? 'relacao' : 'distribuicao', campo: citado.refId, categoria: slug }, aceita: true })
  }
  if (medida || !citado) {
    lista.push({ cfg: painel(slug, 'numero', valor), motivo: { tipo: medida ? funcao as 'soma' | 'media' : 'contagem', campo: medida?.refId, categoria: slug }, aceita: true })
  }
  if (querTempo && !(citado && ehData(citado))) {
    const data = campos.find(c => ehData(c) && !c.sistema) ?? campoDe(slug, 'created_at')!
    lista.push({ cfg: painel(slug, 'linha', { agruparPor: data.refId, campoDeData: data.refId, ...valor }), motivo: { tipo: 'tempo', campo: data.refId, categoria: slug }, aceita: true })
  }
  if (lista.length < 2) {
    const dist = campos.find(c => !c.sistema && !!c.options && !ehMultiplo(c) && c.type !== 'inputSwitch' && c.refId !== citado?.refId) as CampoDoMock | undefined
    if (dist) lista.push({ cfg: painel(slug, 'barras', { agruparPor: dist.refId, ...valor }), motivo: { tipo: 'distribuicao', campo: dist.refId, categoria: slug }, aceita: false })
  }
  return lista.slice(0, 3)
}
