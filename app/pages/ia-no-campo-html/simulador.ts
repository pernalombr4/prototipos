/**
 * A BENI simulada: respostas de roteiro, sem modelo e sem rede (regra 4).
 *
 * Como responde:
 * - os 2 parágrafos do Parecer do jurídico têm resposta pronta para cada ação
 *   (corrigir, melhorar, encurtar, expandir, 3 tons, 3 idiomas);
 * - texto que a pessoa escreveu tem resposta de regra: corrigir troca palavras
 *   sem acento de um dicionário curto, encurtar fica com a 1ª frase, expandir
 *   acrescenta uma frase; tradução de texto livre não existe (o painel avisa);
 * - o pedido livre é roteado por palavra-chave (e-mail, lista, resumo, risco);
 * - "Rascunhar com os dados do item" monta o texto com os valores do mocks.ts.
 *
 * O texto gerado é dado do workspace (como o conteúdo do campo) e fica em
 * português; quem traduz é a ação Traduzir.
 */
import { item } from './mocks'

export type Acao =
  | 'pedir' | 'continuar' | 'resumir' | 'rascunhar'
  | 'melhorar' | 'corrigir' | 'encurtar' | 'expandir' | 'tom' | 'traduzir'
  | 'ajustar'

export interface Pedido {
  acao: Acao
  /** tom (formal, amigavel, direto) ou idioma (pt, en, es) */
  parametro?: string
  /** O trecho selecionado, ou o campo inteiro quando não há seleção. Blocos separados por \n. */
  texto: string
  /** Texto livre da pessoa (pedir) ou o ajuste pedido sobre a resposta anterior (ajustar). */
  prompt?: string
  /** A resposta anterior, para ajustar. */
  anterior?: string
  usarCampos: boolean
  tentativa: number
}

export interface Resposta {
  html: string
  /** A simulação não tem resposta pronta para isso (tradução de texto livre). */
  semRoteiro?: boolean
}

const d = item.data as Record<string, string>

/* ------------------------------------------------------------ roteiro ---- */

type Roteiro = Record<string, string>

const P1: Roteiro = {
  corrigir: 'O contrato com a Tecnoverde vence em 31/12/2026. O fornecedor mandou a proposta de renovação com reajuste pelo IPCA acumulado de 11,46%, o que leva o valor mensal de R$ 43.358,10 para R$ 48.327,14.',
  melhorar: 'O contrato com a Tecnoverde vence em 31/12/2026. Na proposta de renovação, o fornecedor aplica o IPCA acumulado de 11,46%, e o valor mensal passa de R$ 43.358,10 para R$ 48.327,14.',
  encurtar: 'O contrato vence em 31/12/2026. A renovação proposta aplica o IPCA de 11,46%: o valor mensal passa de R$ 43.358,10 para R$ 48.327,14.',
  expandir: 'O contrato com a Tecnoverde vence em 31/12/2026. Na proposta de renovação, o fornecedor aplica o IPCA acumulado de 11,46%, e o valor mensal passa de R$ 43.358,10 para R$ 48.327,14. O reajuste segue a cláusula de correção anual do contrato, que adota o IPCA como índice. Antes de aprovar, o jurídico compara o percentual com 2 propostas de mercado para o mesmo serviço.',
  formal: 'O contrato firmado com a Tecnoverde Soluções Ambientais tem vencimento em 31/12/2026. O fornecedor apresentou proposta de renovação com reajuste pelo IPCA acumulado de 11,46%, o que eleva o valor mensal de R$ 43.358,10 para R$ 48.327,14.',
  amigavel: 'Boa notícia: a Tecnoverde já mandou a proposta de renovação do contrato, que vence em 31/12/2026. O reajuste segue o IPCA (11,46%), e a mensalidade vai de R$ 43.358,10 para R$ 48.327,14.',
  direto: 'Vence em 31/12/2026. Renovação proposta: IPCA de 11,46%, de R$ 43.358,10 para R$ 48.327,14 por mês.',
  pt: 'O contrato com a Tecnoverde vence em 31/12/2026. O fornecedor mandou a proposta de renovação com reajuste pelo IPCA acumulado de 11,46%, o que leva o valor mensal de R$ 43.358,10 para R$ 48.327,14.',
  en: 'The contract with Tecnoverde expires on 12/31/2026. The supplier sent a renewal proposal with an adjustment based on the accumulated IPCA of 11.46%, which raises the monthly amount from R$ 43,358.10 to R$ 48,327.14.',
  es: 'El contrato con Tecnoverde vence el 31/12/2026. El proveedor envió la propuesta de renovación con reajuste por el IPCA acumulado de 11,46%, lo que lleva el valor mensual de R$ 43.358,10 a R$ 48.327,14.',
}

const P2: Roteiro = {
  corrigir: 'A unidade 2 ainda não devolveu o aditivo assinado e, sem ele, a renovação fica travada. O jurídico pediu o documento em 03/10/2026 e ainda não teve retorno.',
  melhorar: 'A renovação depende do aditivo assinado da unidade 2, que ainda não voltou. O jurídico pediu o documento em 03/10/2026 e segue sem retorno.',
  encurtar: 'Falta o aditivo assinado da unidade 2, pedido em 03/10/2026. Sem ele, a renovação não sai.',
  expandir: 'A renovação depende do aditivo assinado da unidade 2, que ainda não voltou. O jurídico pediu o documento em 03/10/2026 e segue sem retorno. Se o aditivo não chegar até 15/11/2026, o jurídico propõe renovar só as unidades 1 e 3 e tratar a unidade 2 num contrato à parte.',
  formal: 'A unidade 2 ainda não restituiu o aditivo devidamente assinado, condição indispensável para a renovação. O departamento jurídico solicitou o documento em 03/10/2026 e aguarda retorno.',
  amigavel: 'Só falta uma coisa: o aditivo assinado da unidade 2. O jurídico pediu em 03/10/2026 e ainda está esperando. Assim que chegar, a renovação anda.',
  direto: 'Pendente: aditivo assinado da unidade 2 (pedido em 03/10/2026). Sem ele, não renova.',
  pt: 'A unidade 2 ainda não devolveu o aditivo assinado e, sem ele, a renovação fica travada. O jurídico pediu o documento em 03/10/2026 e ainda não teve retorno.',
  en: 'Unit 2 has not yet returned the signed amendment, and without it the renewal is on hold. Legal requested the document on 10/03/2026 and has not heard back.',
  es: 'La unidad 2 todavía no devolvió el anexo firmado y, sin él, la renovación queda trabada. El área jurídica pidió el documento el 03/10/2026 y aún no tuvo respuesta.',
}

/** Acha o parágrafo do exemplo pela frase que só ele tem. */
function roteiroDe(bloco: string): Roteiro | null {
  const b = bloco.toLowerCase()
  if (b.includes('tecnoverde vence')) return P1
  if (b.includes('unidade 2') && b.includes('aditivo')) return P2
  return null
}

const continuacoes = [
  '<p>Recomendação do jurídico: aprovar a renovação por 12 meses, condicionada à entrega do aditivo da unidade 2 até 15/11/2026. Se o prazo não for cumprido, a renovação vale só para as unidades 1 e 3.</p>',
  '<p>Próximo passo: o jurídico cobra a unidade 2 nesta semana e, com o aditivo em mãos, envia a minuta de renovação para o fornecedor assinar.</p>',
]

function rascunho(usarCampos: boolean, tentativa: number) {
  if (!usarCampos) {
    return '<p>Observações internas do contrato: prazos, pendências e quem acompanha cada ponto até a renovação.</p>'
  }
  const versoes = [
    `<p>Contrato de ${d.objeto![0]!.toLowerCase()}${d.objeto!.slice(1)} com a ${d.fornecedor}, vigente até ${d.vigencia}. O valor atual é ${d.valor} por mês; com o ${d.indice}, o valor corrigido passa a ${d.valor_corrigido}.</p>`,
    `<ul><li><strong>Fornecedor:</strong> ${d.fornecedor}</li><li><strong>Objeto:</strong> ${d.objeto}</li><li><strong>Vigência:</strong> até ${d.vigencia}</li><li><strong>Valor:</strong> ${d.valor} por mês, ${d.valor_corrigido} com o ${d.indice}</li></ul>`,
  ]
  return versoes[tentativa % versoes.length]!
}

/* ------------------------------------------------------ regras gerais ---- */

const semAcento: [RegExp, string][] = [
  [/\bnao\b/gi, 'não'], [/\boque\b/gi, 'o que'], [/renova[cç]ao\b/gi, 'renovação'],
  [/\bjuridico\b/gi, 'jurídico'], [/\bvoce\b/gi, 'você'], [/\btambem\b/gi, 'também'],
  [/\bentao\b/gi, 'então'], [/\bja\b/gi, 'já'], [/\bate\b/gi, 'até'], [/\bsao\b/gi, 'são'],
  [/\bproximo\b/gi, 'próximo'], [/\bpendencia\b/gi, 'pendência'], [/\bunico\b/gi, 'único'],
]

function corrigirTexto(s: string) {
  let r = s.trim()
  for (const [de, para] of semAcento) r = r.replace(de, para)
  r = r.replace(/(^|[.!?]\s+)([a-zà-ú])/g, (_, a: string, b: string) => a + b.toUpperCase())
  if (r && !/[.!?:]$/.test(r)) r += '.'
  return r
}

function primeiraFrase(s: string) {
  const m = s.trim().match(/^.+?[.!?](\s|$)/)
  return (m ? m[0] : s).trim()
}

function emBlocos(texto: string) {
  return texto.split('\n').map(b => b.trim()).filter(Boolean)
}

const p = (s: string) => `<p>${s}</p>`

/** Aplica uma ação de trecho a cada bloco: roteiro quando há, regra quando não há. */
function porBloco(texto: string, chave: string, regra: (s: string) => string | null): Resposta {
  let semRoteiro = false
  const html = emBlocos(texto).map((b) => {
    const r = roteiroDe(b)
    if (r?.[chave]) return p(r[chave]!)
    const feito = regra(b)
    if (feito === null) {
      semRoteiro = true
      return p(b)
    }
    return p(feito)
  }).join('')
  return { html, semRoteiro }
}

function resumo(texto: string) {
  const blocos = emBlocos(texto)
  if (blocos.some(b => roteiroDe(b))) {
    return '<ul><li>O contrato vence em 31/12/2026.</li><li>A renovação proposta aplica o IPCA de 11,46%: de R$ 43.358,10 para R$ 48.327,14 por mês.</li><li>Pendente: aditivo assinado da unidade 2, pedido em 03/10/2026.</li></ul>'
  }
  return `<ul>${blocos.map(b => `<li>${corrigirTexto(primeiraFrase(b))}</li>`).join('')}</ul>`
}

function emLista(html: string) {
  const texto = html.replace(/<\/(p|li)>/g, '\n').replace(/<[^>]+>/g, '')
  const frases = texto.split(/(?<=[.!?])\s+|\n/).map(s => s.trim()).filter(Boolean)
  return `<ul>${frases.map(f => `<li>${f}</li>`).join('')}</ul>`
}

function encurtarHtml(html: string) {
  const blocos = html.match(/<(p|li)>(.*?)<\/\1>/g) ?? [html]
  return blocos.map(b => b.replace(/<(p|li)>(.*?)<\/\1>/, (_, tag: string, dentro: string) => `<${tag}>${primeiraFrase(dentro)}</${tag}>`)).join('')
    .replace(/^(<li>.*<\/li>)$/, '<ul>$1</ul>')
}

/* ------------------------------------------------------------- gerar ---- */

export function gerar(pedido: Pedido): Resposta {
  const { acao, parametro, texto, usarCampos, tentativa } = pedido

  switch (acao) {
    case 'continuar':
      return { html: continuacoes[tentativa % continuacoes.length]! }
    case 'resumir':
      return { html: resumo(texto) }
    case 'rascunhar':
      return { html: rascunho(usarCampos, tentativa) }
    case 'corrigir':
      return porBloco(texto, 'corrigir', corrigirTexto)
    case 'melhorar':
      return porBloco(texto, 'melhorar', corrigirTexto)
    case 'encurtar':
      return porBloco(texto, 'encurtar', s => corrigirTexto(primeiraFrase(s)))
    case 'expandir':
      return porBloco(texto, 'expandir', s => `${corrigirTexto(s)} O jurídico acompanha este ponto até a renovação do contrato.`)
    case 'tom':
      return porBloco(texto, parametro ?? 'formal', corrigirTexto)
    case 'traduzir':
      return porBloco(texto, parametro ?? 'en', s => (parametro === 'pt' ? corrigirTexto(s) : null))
    case 'ajustar': {
      const q = (pedido.prompt ?? '').toLowerCase()
      const anterior = pedido.anterior ?? ''
      if (/curt|short|cort/.test(q)) return { html: encurtarHtml(anterior) }
      if (/list|t[oó]pic/.test(q)) return { html: emLista(anterior) }
      return { html: anterior }
    }
    case 'pedir':
    default: {
      const q = (pedido.prompt ?? '').toLowerCase()
      if (/e-?mail|correo/.test(q)) {
        return { html: '<p>Olá, equipe da Tecnoverde,</p><p>Para seguir com a renovação do contrato, que vence em 31/12/2026, precisamos do aditivo assinado da unidade 2. Vocês conseguem enviar até 15/11/2026?</p><p>Obrigado,<br>Jurídico</p>' }
      }
      if (/pend|list|t[oó]pic/.test(q)) {
        return { html: '<ul><li>Aditivo assinado da unidade 2, pedido em 03/10/2026.</li><li>Aprovação do reajuste pelo IPCA de 11,46%.</li><li>Minuta de renovação para o fornecedor assinar.</li></ul>' }
      }
      if (/resum|summar/.test(q)) return { html: resumo(texto) }
      if (/risc|risk|riesg/.test(q)) {
        return { html: '<p>Risco principal: o contrato vence em 31/12/2026 sem o aditivo da unidade 2. Sem renovação, a coleta de resíduos das 3 unidades fica sem cobertura contratual a partir de 01/01/2027.</p>' }
      }
      return { html: rascunho(usarCampos, tentativa) }
    }
  }
}

/* --------------------------------------------------------- transmitir ---- */

/**
 * Entrega o HTML aos pedaços, palavra por palavra, como um modelo que
 * transmite a resposta. Tag aberta sem fechar não quebra: o navegador fecha
 * sozinho ao renderizar o pedaço.
 */
export async function transmitir(html: string, aoReceber: (parcial: string) => void, sinal: { parar: boolean }) {
  const pedacos = html.match(/<[^>]+>|\s+|[^\s<]+/g) ?? []
  let acumulado = ''
  await espera(550)
  for (const pedaco of pedacos) {
    if (sinal.parar) return false
    acumulado += pedaco
    if (!pedaco.startsWith('<') && pedaco.trim()) {
      aoReceber(acumulado)
      await espera(18 + Math.random() * 30)
    }
  }
  aoReceber(acumulado)
  return true
}

export const espera = (ms: number) => new Promise(r => setTimeout(r, ms))
