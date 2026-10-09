/**
 * O BENI simulado: respostas de roteiro, sem modelo e sem rede (regra 4).
 *
 * Como responde:
 * - os 2 parágrafos do Parecer do jurídico têm resposta pronta para cada ação
 *   de trecho (corrigir, melhorar, encurtar, expandir, simplificar, 8 tons,
 *   6 idiomas);
 * - texto que a pessoa escreveu tem resposta de regra: corrigir troca palavras
 *   sem acento de um dicionário curto, encurtar fica com a 1ª frase, expandir
 *   acrescenta uma frase; tradução de texto livre não existe (a barra avisa);
 * - o pedido livre é roteado por palavra-chave (e-mail, lista, resumo, risco);
 * - o agente escolhido muda o tom do rascunho e do pedido livre; o Revisor
 *   devolve a correção e a lista do que mudou;
 * - o modelo escolhido não muda o texto: muda só o tempo de resposta.
 *
 * O texto gerado é dado do workspace (como o conteúdo do campo) e fica em
 * português; quem traduz é a ação Traduzir.
 */
import { item } from './mocks'

export type Acao =
  | 'pedir' | 'continuar' | 'resumir' | 'rascunhar' | 'pendencias'
  | 'melhorar' | 'corrigir' | 'encurtar' | 'expandir' | 'simplificar' | 'explicar' | 'lista'
  | 'tom' | 'traduzir' | 'ajustar'

export const tons = ['formal', 'profissional', 'amigavel', 'direto', 'confiante', 'empatico', 'didatico', 'persuasivo'] as const
export const idiomas = ['pt', 'en', 'es', 'fr', 'de', 'it'] as const

export interface Pedido {
  acao: Acao
  /** tom ou idioma */
  parametro?: string
  /** O trecho selecionado, ou o campo inteiro quando não há seleção. Blocos separados por \n. */
  texto: string
  /** Texto livre da pessoa (pedir) ou o ajuste pedido sobre a resposta anterior (ajustar). */
  prompt?: string
  /** A resposta anterior, para ajustar. */
  anterior?: string
  usarCampos: boolean
  tentativa: number
  /** slug do agente; vazio = BENI */
  agente?: string
  agenteRevisor?: boolean
}

export interface Resposta {
  html: string
  /** A simulação não tem resposta pronta para isso (tradução de texto livre). */
  semRoteiro?: boolean
  /** O que o Revisor mudou, para mostrar na barra. */
  notas?: string[]
}

const d = item.data as Record<string, string>

/* ------------------------------------------------------------ roteiro ---- */

type Roteiro = Record<string, string>

const P1: Roteiro = {
  corrigir: 'O contrato com a Tecnoverde vence em 31/12/2026. O fornecedor mandou a proposta de renovação com reajuste pelo IPCA acumulado de 11,46%, o que leva o valor mensal de R$ 43.358,10 para R$ 48.327,14.',
  melhorar: 'O contrato com a Tecnoverde vence em 31/12/2026. Na proposta de renovação, o fornecedor aplica o IPCA acumulado de 11,46%, e o valor mensal passa de R$ 43.358,10 para R$ 48.327,14.',
  encurtar: 'O contrato vence em 31/12/2026. A renovação proposta aplica o IPCA de 11,46%: o valor mensal passa de R$ 43.358,10 para R$ 48.327,14.',
  expandir: 'O contrato com a Tecnoverde vence em 31/12/2026. Na proposta de renovação, o fornecedor aplica o IPCA acumulado de 11,46%, e o valor mensal passa de R$ 43.358,10 para R$ 48.327,14. O reajuste segue a cláusula de correção anual do contrato, que adota o IPCA como índice. Antes de aprovar, o jurídico compara o percentual com 2 propostas de mercado para o mesmo serviço.',
  simplificar: 'O contrato com a Tecnoverde acaba em 31/12/2026. Para renovar, o fornecedor quer subir o valor mensal de R$ 43.358,10 para R$ 48.327,14, pela inflação do período (11,46%).',
  explicar: 'IPCA é o índice oficial de inflação do Brasil. "Acumulado de 11,46%" quer dizer que os preços subiram 11,46% desde o último reajuste, e o contrato permite repassar esse aumento ao valor mensal.',
  formal: 'O contrato firmado com a Tecnoverde Soluções Ambientais tem vencimento em 31/12/2026. O fornecedor apresentou proposta de renovação com reajuste pelo IPCA acumulado de 11,46%, o que eleva o valor mensal de R$ 43.358,10 para R$ 48.327,14.',
  profissional: 'Contrato Tecnoverde: vencimento em 31/12/2026. A proposta de renovação aplica o IPCA acumulado (11,46%) e ajusta o valor mensal de R$ 43.358,10 para R$ 48.327,14.',
  amigavel: 'Boa notícia: a Tecnoverde já mandou a proposta de renovação do contrato, que vence em 31/12/2026. O reajuste segue o IPCA (11,46%), e a mensalidade vai de R$ 43.358,10 para R$ 48.327,14.',
  direto: 'Vence em 31/12/2026. Renovação proposta: IPCA de 11,46%, de R$ 43.358,10 para R$ 48.327,14 por mês.',
  confiante: 'O contrato com a Tecnoverde vence em 31/12/2026, e a renovação está bem encaminhada: o reajuste proposto segue o IPCA de 11,46%, levando o valor mensal a R$ 48.327,14.',
  empatico: 'Sabemos que reajuste pesa no orçamento. O contrato com a Tecnoverde vence em 31/12/2026, e a proposta aplica só o IPCA do período (11,46%): o valor mensal passa de R$ 43.358,10 para R$ 48.327,14.',
  didatico: 'Em resumo: o contrato vence em 31/12/2026. Para renovar, o valor mensal é corrigido pela inflação (IPCA de 11,46%). Na conta: R$ 43.358,10 × 1,1146 = R$ 48.327,14.',
  persuasivo: 'Renovar com a Tecnoverde mantém a coleta das 3 unidades sem interrupção. O reajuste proposto fica no IPCA (11,46%), sem ganho real para o fornecedor: R$ 48.327,14 por mês a partir de 2027.',
  pt: 'O contrato com a Tecnoverde vence em 31/12/2026. O fornecedor mandou a proposta de renovação com reajuste pelo IPCA acumulado de 11,46%, o que leva o valor mensal de R$ 43.358,10 para R$ 48.327,14.',
  en: 'The contract with Tecnoverde expires on 12/31/2026. The supplier sent a renewal proposal with an adjustment based on the accumulated IPCA of 11.46%, which raises the monthly amount from R$ 43,358.10 to R$ 48,327.14.',
  es: 'El contrato con Tecnoverde vence el 31/12/2026. El proveedor envió la propuesta de renovación con reajuste por el IPCA acumulado de 11,46%, lo que lleva el valor mensual de R$ 43.358,10 a R$ 48.327,14.',
  fr: 'Le contrat avec Tecnoverde expire le 31/12/2026. Le fournisseur a envoyé une proposition de renouvellement indexée sur l\'IPCA cumulé de 11,46 %, ce qui porte le montant mensuel de 43 358,10 R$ à 48 327,14 R$.',
  de: 'Der Vertrag mit Tecnoverde endet am 31.12.2026. Der Lieferant hat ein Verlängerungsangebot mit Anpassung an den kumulierten IPCA von 11,46 % geschickt; der Monatsbetrag steigt von 43.358,10 R$ auf 48.327,14 R$.',
  it: 'Il contratto con Tecnoverde scade il 31/12/2026. Il fornitore ha inviato la proposta di rinnovo con adeguamento all\'IPCA cumulato dell\'11,46%, che porta l\'importo mensile da R$ 43.358,10 a R$ 48.327,14.',
}

const P2: Roteiro = {
  corrigir: 'A unidade 2 ainda não devolveu o aditivo assinado e, sem ele, a renovação fica travada. O jurídico pediu o documento em 03/10/2026 e ainda não teve retorno.',
  melhorar: 'A renovação depende do aditivo assinado da unidade 2, que ainda não voltou. O jurídico pediu o documento em 03/10/2026 e segue sem retorno.',
  encurtar: 'Falta o aditivo assinado da unidade 2, pedido em 03/10/2026. Sem ele, a renovação não sai.',
  expandir: 'A renovação depende do aditivo assinado da unidade 2, que ainda não voltou. O jurídico pediu o documento em 03/10/2026 e segue sem retorno. Se o aditivo não chegar até 15/11/2026, o jurídico propõe renovar só as unidades 1 e 3 e tratar a unidade 2 num contrato à parte.',
  simplificar: 'A unidade 2 ainda não mandou o aditivo assinado. Sem esse papel, não dá para renovar. O jurídico pediu em 03/10/2026.',
  explicar: 'Aditivo é o documento que muda um contrato já assinado. Enquanto a unidade 2 não assina o dela, o contrato não pode ser renovado para as 3 unidades juntas.',
  formal: 'A unidade 2 ainda não restituiu o aditivo devidamente assinado, condição indispensável para a renovação. O departamento jurídico solicitou o documento em 03/10/2026 e aguarda retorno.',
  profissional: 'Pendência: aditivo assinado da unidade 2, solicitado pelo jurídico em 03/10/2026. A renovação depende dele.',
  amigavel: 'Só falta uma coisa: o aditivo assinado da unidade 2. O jurídico pediu em 03/10/2026 e ainda está esperando. Assim que chegar, a renovação anda.',
  direto: 'Pendente: aditivo assinado da unidade 2 (pedido em 03/10/2026). Sem ele, não renova.',
  confiante: 'Falta só o aditivo assinado da unidade 2, já cobrado pelo jurídico em 03/10/2026. Com ele em mãos, a renovação sai.',
  empatico: 'Entendemos que a unidade 2 está com muita demanda. Ainda precisamos do aditivo assinado, pedido em 03/10/2026, para seguir com a renovação.',
  didatico: 'O que falta: o aditivo assinado da unidade 2. Por que importa: sem ele, o contrato não renova. Quando foi pedido: 03/10/2026.',
  persuasivo: 'Assinar o aditivo agora garante que a unidade 2 não fique sem coleta em janeiro. O pedido saiu em 03/10/2026; o prazo confortável é 15/11/2026.',
  pt: 'A unidade 2 ainda não devolveu o aditivo assinado e, sem ele, a renovação fica travada. O jurídico pediu o documento em 03/10/2026 e ainda não teve retorno.',
  en: 'Unit 2 has not yet returned the signed amendment, and without it the renewal is on hold. Legal requested the document on 10/03/2026 and has not heard back.',
  es: 'La unidad 2 todavía no devolvió el anexo firmado y, sin él, la renovación queda trabada. El área jurídica pidió el documento el 03/10/2026 y aún no tuvo respuesta.',
  fr: 'L\'unité 2 n\'a pas encore renvoyé l\'avenant signé, et sans lui le renouvellement est bloqué. Le service juridique l\'a demandé le 03/10/2026, sans réponse.',
  de: 'Einheit 2 hat den unterschriebenen Nachtrag noch nicht zurückgeschickt; ohne ihn ist die Verlängerung blockiert. Die Rechtsabteilung hat ihn am 03.10.2026 angefordert.',
  it: 'L\'unità 2 non ha ancora restituito l\'addendum firmato e, senza di esso, il rinnovo è bloccato. L\'ufficio legale lo ha richiesto il 03/10/2026, senza risposta.',
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

const objeto = () => `${d.objeto![0]!.toLowerCase()}${d.objeto!.slice(1)}`

/** O rascunho com os dados do item, no estilo de cada agente. */
function rascunho(p: Pedido) {
  if (!p.usarCampos) {
    return '<p>Observações internas do contrato: prazos, pendências e quem acompanha cada ponto até a renovação.</p>'
  }
  switch (p.agente) {
    case 'assistente-juridico':
      return `<p><strong>Parecer.</strong> O contrato de ${objeto()} com a ${d.fornecedor} vige até ${d.vigencia}. A renovação proposta aplica o ${d.indice}, elevando o valor mensal de ${d.valor} para ${d.valor_corrigido}, em linha com a cláusula de correção anual.</p><p><strong>Conclusão.</strong> Favorável à renovação por 12 meses, condicionada à entrega do aditivo da unidade 2 até 15/11/2026.</p>`
    case 'redator-comercial':
      return `<p>Olá, equipe da ${d.fornecedor},</p><p>Recebemos a proposta de renovação do contrato de ${objeto()}, que vence em ${d.vigencia}. Para fecharmos, falta o aditivo assinado da unidade 2. Conseguem nos enviar até 15/11/2026?</p><p>Obrigado!</p>`
    case 'analista-financeiro':
      return `<p>Impacto do reajuste: ${d.valor} × 1,1146 = ${d.valor_corrigido} por mês. São R$ 4.969,04 a mais por mês e R$ 59.628,48 a mais em 12 meses.</p>`
    default: {
      const versoes = [
        `<p>Contrato de ${objeto()} com a ${d.fornecedor}, vigente até ${d.vigencia}. O valor atual é ${d.valor} por mês; com o ${d.indice}, o valor corrigido passa a ${d.valor_corrigido}.</p>`,
        `<ul><li><strong>Fornecedor:</strong> ${d.fornecedor}</li><li><strong>Objeto:</strong> ${d.objeto}</li><li><strong>Vigência:</strong> até ${d.vigencia}</li><li><strong>Valor:</strong> ${d.valor} por mês, ${d.valor_corrigido} com o ${d.indice}</li></ul>`,
      ]
      return versoes[p.tentativa % versoes.length]!
    }
  }
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

const pendencias = '<ul data-type="taskList"><li data-type="taskItem" data-checked="false"><p>Receber o aditivo assinado da unidade 2 (pedido em 03/10/2026).</p></li><li data-type="taskItem" data-checked="false"><p>Aprovar o reajuste pelo IPCA de 11,46%.</p></li><li data-type="taskItem" data-checked="false"><p>Enviar a minuta de renovação para o fornecedor assinar.</p></li></ul>'

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
  const { acao, parametro, texto } = pedido

  // O Revisor não reescreve por conta própria: corrige e diz o que mudou.
  if (pedido.agenteRevisor && ['melhorar', 'corrigir'].includes(acao)) {
    const r = porBloco(texto, 'corrigir', corrigirTexto)
    return {
      ...r,
      notas: ['"renovaçao" e "nao" sem acento', '"oque" separado em "o que"', 'Frase começava com minúscula', 'Prazo do aditivo não tem data limite: vale definir'],
    }
  }

  switch (acao) {
    case 'continuar':
      return { html: continuacoes[pedido.tentativa % continuacoes.length]! }
    case 'resumir':
      return { html: resumo(texto) }
    case 'pendencias':
      return { html: pendencias }
    case 'rascunhar':
      return { html: rascunho(pedido) }
    case 'corrigir':
      return porBloco(texto, 'corrigir', corrigirTexto)
    case 'melhorar':
      return porBloco(texto, 'melhorar', corrigirTexto)
    case 'encurtar':
      return porBloco(texto, 'encurtar', s => corrigirTexto(primeiraFrase(s)))
    case 'expandir':
      return porBloco(texto, 'expandir', s => `${corrigirTexto(s)} O jurídico acompanha este ponto até a renovação do contrato.`)
    case 'simplificar':
      return porBloco(texto, 'simplificar', s => corrigirTexto(primeiraFrase(s)))
    case 'explicar':
      return porBloco(texto, 'explicar', s => `Explicando: ${corrigirTexto(s).toLowerCase()}`)
    case 'lista':
      return { html: emLista(porBloco(texto, 'corrigir', corrigirTexto).html) }
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
        return { html: rascunho({ ...pedido, agente: 'redator-comercial', usarCampos: true }) }
      }
      if (/pend|tarefa|checklist|to-?do/.test(q)) return { html: pendencias }
      if (/list|t[oó]pic/.test(q)) return { html: emLista(porBloco(texto, 'corrigir', corrigirTexto).html) }
      if (/resum|summar/.test(q)) return { html: resumo(texto) }
      if (/risc|risk|riesg/.test(q)) {
        return { html: '<p>Risco principal: o contrato vence em 31/12/2026 sem o aditivo da unidade 2. Sem renovação, a coleta de resíduos das 3 unidades fica sem cobertura contratual a partir de 01/01/2027.</p>' }
      }
      if (/parecer/.test(q)) return { html: rascunho({ ...pedido, agente: 'assistente-juridico', usarCampos: true }) }
      return { html: rascunho(pedido) }
    }
  }
}

/** Ações cujo resultado entra abaixo do trecho, não no lugar dele. */
export const entraAbaixo: Acao[] = ['explicar', 'resumir', 'pendencias']

/* --------------------------------------------------------- transmitir ---- */

/**
 * Entrega o HTML aos pedaços, palavra por palavra, como um modelo que
 * transmite a resposta. Tag aberta sem fechar não quebra: o navegador fecha
 * sozinha ao renderizar o pedaço. `ritmo` vem do modelo escolhido.
 */
export async function transmitir(html: string, aoReceber: (parcial: string) => void, sinal: { parar: boolean }, ritmo = 1) {
  const pedacos = html.match(/<[^>]+>|\s+|[^\s<]+/g) ?? []
  let acumulado = ''
  await espera(450 * ritmo)
  for (const pedaco of pedacos) {
    if (sinal.parar) return false
    acumulado += pedaco
    if (!pedaco.startsWith('<') && pedaco.trim()) {
      aoReceber(acumulado)
      await espera((16 + Math.random() * 26) * ritmo)
    }
  }
  aoReceber(acumulado)
  return true
}

export const espera = (ms: number) => new Promise(r => setTimeout(r, ms))
