/*
 * Medir contraste na tela que está rodando
 * ========================================
 *
 * Não faz parte do protótipo: é ferramenta de auditoria. Não é importado por
 * nada, não entra no bundle, e serve para responder com número a perguntas que
 * a gente costuma responder com opinião ("esse amarelo está legível?").
 *
 * Como usar: cole o arquivo inteiro no console do navegador, com a tela aberta,
 * e chame uma das funções abaixo. Funciona igual pelo javascript_tool.
 *
 *   auditar()                 → tudo que reprova na tela, do pior para o melhor
 *   auditar('main')           → só dentro de um seletor
 *   medir($0)                 → o elemento selecionado no inspetor
 *   medirCor('#FF04D1', '#fff')
 *
 * Por que não basta ler `color` e `background-color`:
 *
 *  1. O tema usa `oklch()`, e conta de contraste pede RGB. A conversão sai de
 *     graça pintando a cor num canvas de 1 px e lendo o pixel.
 *  2. Selo e faixa usam fundo translúcido (`bg-warning/10`). O fundo que o olho
 *     enxerga é a composição daquilo com o que está atrás, às vezes três níveis
 *     acima. Medir contra o fundo do cartão dá um número otimista; medir contra
 *     o fundo da página dá outro. `fundoEfetivo` sobe a árvore compondo até
 *     achar opacidade cheia.
 *  3. O mínimo do WCAG 2.1 AA depende do tamanho: 3:1 para texto grande
 *     (24 px, ou 18,66 px em negrito) e 4,5:1 para o resto. Selo de 10 px com
 *     rótulo de estado é "o resto".
 */

/** Resolve qualquer cor CSS (oklch, rgba, var já computada) para [r,g,b] sobre um fundo. */
export function paraRGB(cor, fundo = 'rgb(255,255,255)') {
  const c = document.createElement('canvas')
  c.width = c.height = 1
  const x = c.getContext('2d')
  x.fillStyle = fundo
  x.fillRect(0, 0, 1, 1)
  x.fillStyle = cor
  x.fillRect(0, 0, 1, 1)
  const d = x.getImageData(0, 0, 1, 1).data
  return [d[0], d[1], d[2]]
}

function luminancia([r, g, b]) {
  const f = (v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

/** Razão de contraste entre duas cores já em [r,g,b]. */
export function razao(a, b) {
  const L1 = luminancia(a)
  const L2 = luminancia(b)
  return +(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2))
}

/** Contraste entre duas cores CSS quaisquer, sem elemento no meio. */
export function medirCor(frente, fundo) {
  const f = paraRGB(fundo)
  return razao(paraRGB(frente, fundo), f)
}

/**
 * A opacidade real de uma cor CSS, em qualquer notação.
 *
 * Ler `rgba(...)` com split não serve. Com o tema em oklch, o navegador devolve
 * a camada translúcida como `oklab(0.31 0.02 -0.05 / 0.2)`: não começa com
 * `rgba`, então passava por opaca, a subida parava no primeiro cartão e o fundo
 * saía composto sobre papel branco. No tema claro o engano se escondia; no
 * escuro ele media texto branco contra cinza claro e reprovava a tela inteira.
 *
 * Pintar num canvas limpo e ler o quarto canal funciona para toda notação que o
 * navegador entende, inclusive as que ainda não existem.
 */
function alfaDe(cor) {
  const c = document.createElement('canvas')
  c.width = c.height = 1
  const x = c.getContext('2d')
  x.clearRect(0, 0, 1, 1)
  x.fillStyle = cor
  x.fillRect(0, 0, 1, 1)
  return x.getImageData(0, 0, 1, 1).data[3] / 255
}

/**
 * O fundo que o olho realmente vê atrás do elemento: sobe a árvore compondo
 * cada camada translúcida até encontrar uma opaca.
 *
 * A subida vai até o `<html>` inclusive, e a base só entra se nada na página
 * pintar de verdade. Qual base usar vem do `color-scheme`: no tema escuro o
 * papel do navegador é preto, não branco.
 */
export function fundoEfetivo(el) {
  const camadas = []
  for (let n = el; n; n = n.parentElement) {
    const bg = getComputedStyle(n).backgroundColor
    const alfa = alfaDe(bg)
    if (alfa === 0) continue
    camadas.push(bg)
    if (alfa >= 1) break
  }

  const esquema = getComputedStyle(document.documentElement).colorScheme || ''
  let base = esquema.includes('dark') ? 'rgb(0,0,0)' : 'rgb(255,255,255)'

  // De trás para a frente: a mais funda é a base, cada uma pinta por cima.
  for (const camada of camadas.reverse()) {
    const [r, g, b] = paraRGB(camada, base)
    base = `rgb(${r},${g},${b})`
  }
  return paraRGB(base)
}

/** 3:1 para texto grande (24 px, ou 18,66 px em negrito); 4,5:1 para o resto. */
export function minimoWCAG(el) {
  const s = getComputedStyle(el)
  const px = Number.parseFloat(s.fontSize)
  const peso = Number.parseInt(s.fontWeight, 10) || 400
  const grande = px >= 24 || (px >= 18.66 && peso >= 700)
  return grande ? 3 : 4.5
}

/** Mede um elemento de texto. */
export function medir(el) {
  const s = getComputedStyle(el)
  const fundo = fundoEfetivo(el)
  const cor = paraRGB(s.color, `rgb(${fundo.join(',')})`)
  const contraste = razao(cor, fundo)
  const minimo = minimoWCAG(el)
  return {
    texto: (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48),
    fonte: `${s.fontSize} / ${s.fontWeight}`,
    contraste,
    minimo,
    passa: contraste >= minimo,
    el,
  }
}

/**
 * Tudo que reprova dentro do seletor, do pior para o melhor.
 *
 * Só olha elemento que tem texto próprio e está visível: sem isso, cada div de
 * layout aparece herdando a cor do filho e o relatório vira ruído.
 */
export function auditar(seletor = 'body') {
  const raiz = document.querySelector(seletor) || document.body
  const alvos = [...raiz.querySelectorAll('*')].filter((el) => {
    if (!el.checkVisibility?.()) return false
    const proprio = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
    return proprio && el.getBoundingClientRect().width > 0
  })

  return alvos
    .map(medir)
    .filter(m => !m.passa)
    .sort((a, b) => a.contraste - b.contraste)
}
