/**
 * Tira os prints dos requisitos do protótipo, para ir abaixo das caixas de marcar na tarefa do card no ENSPACE
 * (regra 42 da spec). 1 print por grupo de requisitos, não por requisito (decisão da redatora em 2026-10-30):
 * cada requisito do grupo ganha a sua caixa magenta no print, com o ID escrito junto.
 *
 * Uso:
 *   node ferramentas/prints-de-requisito.mjs app/pages/<slug>            # todos os requisitos do prints.json
 *   node ferramentas/prints-de-requisito.mjs app/pages/<slug> RF001 RF702 # só os grupos destes
 *
 * Lê `<pasta>/requisitos/prints.json` e grava `<pasta>/evidencias/requisitos/<ID>.jpg` (grupo de 1) ou
 * `<1º ID>-<último ID>.jpg` (grupo de 2 ou mais), mais o `grupos.json`, que diz o print de cada ID.
 * Abre o protótipo publicado num Chrome sem janela: o print sai sem o ponteiro do mouse e sem a barra do andaime.
 * Cada grupo começa da página recarregada, faz os passos e contorna em magenta o que cada requisito pede.
 *
 * Grupo: requisitos da mesma seção da parte (as seções vêm dos `.md` de `requisitos/`), até 8, com o mesmo estado
 * (antes, cena e passos iguais, fora o passo que só espera, só rola ou só marca data-print) ou com um estado que
 * outro continua (o cartão entra no print do menu do cartão aberto). "junto": "<ID>" põe o requisito no estado de
 * outro, para juntar o que aparece na mesma tela por caminhos diferentes. Requisito do grupo cujo contorno não
 * aparece, sai da tela ou fica coberto (menu, modal) volta à fila no próprio estado. Rodada completa apaga os prints
 * que nenhum grupo usa mais.
 *
 * prints.json:
 *   {
 *     "url": "https://pernalombr4.github.io/prototipos/<slug>",
 *     "andaime": "Protótipo · estado",          // texto da barra de revisão, escondida no print
 *     "cenas": { "<nome>": [passo, ...] },       // passos que vários requisitos repetem
 *     "requisitos": { "<ID>": { "antes": [passo, ...], "cena": "<nome>", "passos": [passo, ...], "junto": "<ID>",
 *                               "destacar": alvo | [alvo, ...] } }
 *   }
 * A ordem é antes, cena, passos: "antes" serve para trocar o estado do andaime antes de a cena abrir a caixa.
 * alvo: "texto" (rótulo, aria-label, placeholder ou texto visível; o mais interno que casa),
 *       { "texto": "...", "n": 1 } (a 2ª ocorrência), { "regex": "^\\d+ de \\d+$" } ou { "css": "seletor", "n": 0 };
 *       "ancestral": "article" sobe até o card; "exato": true contorna o próprio elemento, sem subir ao botão.
 * requisito sem tela no protótipo: { "sem": "<motivo>" }, e a tarefa diz o motivo no lugar do print.
 * passo: { "estado": "<rótulo do andaime>" } | { "clicar": alvo } | { "pairar": alvo } | { "focar": alvo }
 *      | { "digitar": "texto" } | { "tecla": "Enter" | "Escape" | "/" | "ctrl+k" | "ctrl+j" | "ctrl+z" } | { "rolar": alvo }
 *      | { "arquivo": "<caminho de imagem>" } (põe no input de arquivo visível ou não) | { "esperar": ms }
 *      | { "js": "código" } | { "largura": 390 }
 */
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'

const [pasta, ...so] = process.argv.slice(2)
if (!pasta) { console.error('uso: node ferramentas/prints-de-requisito.mjs app/pages/<slug> [ID ...]'); process.exit(2) }
const conf = JSON.parse(readFileSync(join(pasta, 'requisitos', 'prints.json'), 'utf8'))
const saida = join(pasta, 'evidencias', 'requisitos')
mkdirSync(saida, { recursive: true })
const LARGURA = conf.largura ?? 1280
const ALTURA = conf.altura ?? 800

const CHROMES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]
const chrome = CHROMES.find(existsSync)
const perfil = join(tmpdir(), `prints-de-requisito-${process.pid}`)
const PORTA = 9300 + (process.pid % 500)
const proc = spawn(chrome, [
  '--headless=new', `--remote-debugging-port=${PORTA}`, `--user-data-dir=${perfil}`,
  `--window-size=${LARGURA},${ALTURA}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
], { stdio: 'ignore' })

const dormir = ms => new Promise(r => setTimeout(r, ms))
async function alvoDaPagina() {
  for (let i = 0; i < 50; i++) {
    try {
      const lista = await (await fetch(`http://127.0.0.1:${PORTA}/json/list`)).json()
      const pagina = lista.find(t => t.type === 'page')
      if (pagina) return pagina.webSocketDebuggerUrl
    } catch {}
    await dormir(200)
  }
  throw new Error('o Chrome sem janela não abriu')
}

const ws = new WebSocket(await alvoDaPagina())
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let seq = 0
const pendentes = new Map()
const ouvintes = []
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pendentes.has(m.id)) {
    const { ok, erro } = pendentes.get(m.id)
    pendentes.delete(m.id)
    m.error ? erro(new Error(m.error.message)) : ok(m.result)
  }
  else if (m.method) ouvintes.forEach(f => f(m))
})
const cdp = (method, params = {}) => new Promise((ok, erro) => {
  const id = ++seq
  pendentes.set(id, { ok, erro })
  ws.send(JSON.stringify({ id, method, params }))
})
const carregou = () => new Promise((r) => {
  const f = (m) => { if (m.method === 'Page.loadEventFired') { ouvintes.splice(ouvintes.indexOf(f), 1); r() } }
  ouvintes.push(f)
})

/** Roda no navegador: acha o elemento do alvo, fora da barra do andaime (salvo no passo "estado"). */
const ACHAR = `
window.__achar = (alvo, noAndaime) => {
  // Sem caixa: o CSS põe rótulo em maiúsculas, e o innerText devolve o texto como a tela mostra.
  const norm = s => (s || '').replace(/\\s+/g, ' ').trim().toLowerCase()
  const visivel = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0' }
  const andaime = window.__andaime && window.__andaime()
  const dentro = el => andaime && andaime.contains(el)
  const o = typeof alvo === 'object' ? alvo : {}
  const n = o.n || 0
  const subir = el => (el && o.ancestral ? el.closest(o.ancestral) : el) || null
  if (o.css) return subir([...document.querySelectorAll(o.css)].filter(visivel)[n])
  const todos = [...document.querySelectorAll('body *')].filter(el => visivel(el) && (noAndaime ? dentro(el) : !dentro(el)))
  let c
  if (o.regex) {
    const re = new RegExp(o.regex, 'i')
    c = todos.filter(el => re.test(norm(el.getAttribute('aria-label'))))
    if (!c.length) c = todos.filter(el => re.test(norm(el.innerText)))
  }
  else {
    const t = norm(typeof alvo === 'string' ? alvo : o.texto)
    const atributo = el => ['aria-label', 'placeholder', 'title'].map(a => norm(el.getAttribute(a)))
    c = todos.filter(el => atributo(el).includes(t))
    if (!c.length) c = todos.filter(el => norm(el.innerText ?? el.value) === t)
    if (!c.length) c = todos.filter(el => norm(el.innerText).includes(t))
  }
  c = c.filter(el => !c.some(x => x !== el && el.contains(x)))
  return subir(c[n])
}
window.__interativo = el => el.closest('button, a, input, textarea, select, label, [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], [role=tab], [role=option], [role=checkbox], [role=button], [role=switch], tr') || el
`

async function avaliar(expr) {
  const r = await cdp('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text)
  return r.result.value
}

/** Põe o alvo no meio da tela e devolve o centro dele, ou erro com o alvo que não achou. */
async function centro(alvo, noAndaime = false, interativo = true) {
  const r = await avaliar(`(() => { let el = __achar(${JSON.stringify(alvo)}, ${noAndaime}); if (!el) return null
    if (${interativo}) el = __interativo(el)
    // Fora da faixa segura (a barra do andaime cobre o pé da tela), o alvo vem para o meio.
    const b0 = el.getBoundingClientRect()
    if (b0.top < 70 || b0.bottom > innerHeight - 110) el.scrollIntoView({ block: 'center' })
    const b = el.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } })()`)
  if (!r) throw new Error(`não achei ${JSON.stringify(alvo)}`)
  return r
}

async function mouse(x, y, clicar) {
  await cdp('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y })
  if (!clicar) return
  await cdp('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 })
  await cdp('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 })
}

const TECLAS = {
  Enter: { key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' },
  Escape: { key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 },
  '/': { key: '/', code: 'Slash', windowsVirtualKeyCode: 191, text: '/' },
  'ctrl+k': { key: 'k', code: 'KeyK', windowsVirtualKeyCode: 75, modifiers: 2 },
  'ctrl+j': { key: 'j', code: 'KeyJ', windowsVirtualKeyCode: 74, modifiers: 2 },
  'ctrl+z': { key: 'z', code: 'KeyZ', windowsVirtualKeyCode: 90, modifiers: 2 },
  ArrowDown: { key: 'ArrowDown', code: 'ArrowDown', windowsVirtualKeyCode: 40 },
  Tab: { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 },
}

async function passo(p) {
  if (p.estado) { const c = await centro(p.estado, true); await mouse(c.x, c.y, true) }
  else if (p.clicar) { const c = await centro(p.clicar); await mouse(c.x, c.y, true) }
  else if (p.pairar) { const c = await centro(p.pairar, false, false); await mouse(c.x, c.y, false) }
  else if (p.focar) { await centro(p.focar); await avaliar(`__interativo(__achar(${JSON.stringify(p.focar)})).focus()`) }
  else if (p.rolar) { await avaliar(`__achar(${JSON.stringify(p.rolar)}).scrollIntoView({ block: 'center' })`) }
  else if (p.digitar !== undefined) await cdp('Input.insertText', { text: p.digitar })
  else if (p.tecla) {
    const k = TECLAS[p.tecla]
    await cdp('Input.dispatchKeyEvent', { type: k.text ? 'keyDown' : 'rawKeyDown', ...k })
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', ...k, text: undefined })
  }
  else if (p.arquivo) {
    const { root } = await cdp('DOM.getDocument', { depth: -1 })
    const { nodeId } = await cdp('DOM.querySelector', { nodeId: root.nodeId, selector: 'input[type=file]' })
    await cdp('DOM.setFileInputFiles', { nodeId, files: [resolve(p.arquivo)] })
  }
  else if (p.js) await avaliar(p.js)
  else if (p.largura) await cdp('Emulation.setDeviceMetricsOverride', { width: p.largura, height: ALTURA, deviceScaleFactor: 1, mobile: p.largura < 768 })
  // Busca com atraso (debounce) só filtra depois de um tempo: digitar espera mais.
  if (p.esperar) await dormir(p.esperar)
  else await dormir(p.digitar !== undefined ? 1100 : 450)
}

async function preparar() {
  await cdp('Emulation.setDeviceMetricsOverride', { width: LARGURA, height: ALTURA, deviceScaleFactor: 1, mobile: false })
  const ok = carregou()
  await cdp('Page.navigate', { url: conf.url })
  await ok
  await avaliar(`localStorage.clear(); sessionStorage.clear()`)
  const ok2 = carregou()
  await cdp('Page.reload', { ignoreCache: false })
  await ok2
  await avaliar(ACHAR)
  await avaliar(`window.__andaime = () => { const t = ${JSON.stringify(conf.andaime ?? '')}; if (!t) return null
    const el = [...document.querySelectorAll('body *')].find(e => e.children.length === 0 && e.textContent.trim() === t)
    let a = el; while (a && a.parentElement && getComputedStyle(a).position !== 'fixed') a = a.parentElement
    return a && getComputedStyle(a).position === 'fixed' ? a : el && el.parentElement }`)
  await avaliar('document.fonts.ready.then(() => true)')
  await dormir(700)
}

/** Roda no navegador: guarda as caixas de cada requisito e depois desenha as caixas e os rótulos com o ID. */
const MARCAR = `
window.__caixas = []
window.__marcar = (id, alvos, rolar, estrito) => {
  const els = []
  for (const a of alvos) {
    let el = __achar(a); if (!el) return 'não achei para destacar ' + JSON.stringify(a)
    if (!(typeof a === 'object' && (a.exato || a.ancestral || a.css))) el = __interativo(el)
    els.push(el)
  }
  if (rolar) { const b0 = els[0].getBoundingClientRect(); if (b0.top < 0 || b0.bottom > innerHeight) els[0].scrollIntoView({ block: 'center' }) }
  const rs = els.map(e => e.getBoundingClientRect())
  if (estrito && rs.some(b => b.top < 0 || b.bottom > innerHeight || b.left < 0 || b.right > innerWidth)) return 'fora da tela'
  // Coberto: no centro e nos 4 cantos do alvo está outra coisa (menu, modal, gaveta, o fundo escurecido de um deles).
  // O teste liga o mouse em tudo (botão desabilitado e camada flutuante ignoram o mouse) e atravessa o que não pinta
  // nada: opacidade 0, invisível ou sem fundo (input de arquivo transparente, invólucro vazio).
  if (estrito) {
    const st = document.createElement('style'); st.textContent = '* { pointer-events: auto !important }'
    document.head.appendChild(st)
    const transparente = h => {
      for (let a = h; a && a !== document.body; a = a.parentElement) {
        const cs = getComputedStyle(a); if (cs.opacity === '0' || cs.visibility === 'hidden') return true }
      const cs = getComputedStyle(h)
      return (cs.backgroundColor === 'rgba(0, 0, 0, 0)' || cs.backgroundColor === 'transparent') && cs.backgroundImage === 'none'
    }
    // A camada é o filho do body de onde o elemento vem: o app é uma, cada menu, modal e gaveta (em portal) é outra.
    // Só cobre o que vem de outra camada; dentro da mesma, a sobreposição é do próprio layout (rodapé fixo da caixa).
    const camada = e => { let a = e; while (a && a.parentElement && a.parentElement !== document.body) a = a.parentElement; return a }
    let quem = ''
    const livre = (el, x, y) => {
      for (const h of document.elementsFromPoint(x, y)) {
        if (h === el || el.contains(h) || h.contains(el) || camada(h) === camada(el)) return true
        if (!transparente(h)) { quem = h.tagName.toLowerCase() + (typeof h.className === 'string' && h.className ? '.' + h.className.trim().split(' ').slice(0, 3).join('.') : ''); return false }
      }
      return true
    }
    const coberto = (el, b) => { const dx = Math.min(8, b.width / 4), dy = Math.min(8, b.height / 4)
      return ![[b.x + b.width / 2, b.y + b.height / 2], [b.x + dx, b.y + dy], [b.right - dx, b.y + dy], [b.x + dx, b.bottom - dy],
        [b.right - dx, b.bottom - dy]].some(([x, y]) => livre(el, x, y)) }
    const algum = els.some((e, i) => coberto(e, rs[i]))
    st.remove()
    if (algum) return 'coberto por ' + quem
  }
  for (const b of rs) {
    const igual = __caixas.find(c => Math.abs(c.x - b.x) < 3 && Math.abs(c.y - b.y) < 3 && Math.abs(c.w - b.width) < 3 && Math.abs(c.h - b.height) < 3)
    if (igual) { if (!igual.ids.includes(id)) igual.ids.push(id) }
    else __caixas.push({ x: b.x, y: b.y, w: b.width, h: b.height, ids: [id] })
  }
  return ''
}
window.__desenhar = () => {
  const m = 5, ocupado = []
  const cruza = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
  for (const c of __caixas) {
    const d = document.createElement('div')
    Object.assign(d.style, { position: 'fixed', left: (c.x - m) + 'px', top: (c.y - m) + 'px', width: (c.w + 2 * m) + 'px',
      height: (c.h + 2 * m) + 'px', border: '3px solid #FF04D1', borderRadius: '10px', boxShadow: '0 0 0 4px rgba(255,4,209,.22)',
      pointerEvents: 'none', zIndex: 2147483646 })
    document.body.appendChild(d)
  }
  // O rótulo fica fora da caixa, acima; se cruza outro rótulo ou sai da tela, tenta abaixo, à direita, à esquerda e dentro.
  for (const c of __caixas) {
    const r = document.createElement('div'); r.textContent = c.ids.join(' · ')
    Object.assign(r.style, { position: 'fixed', left: '0px', top: '0px', background: '#FF04D1', color: '#fff',
      font: '700 12px/16px system-ui, sans-serif', padding: '1px 6px', borderRadius: '4px', whiteSpace: 'nowrap',
      boxShadow: '0 1px 3px rgba(0,0,0,.35)', pointerEvents: 'none', zIndex: 2147483647 })
    document.body.appendChild(r)
    const w = r.offsetWidth, h = r.offsetHeight
    const opcoes = [[c.x - m, c.y - m - h - 3], [c.x - m, c.y + c.h + m + 3], [c.x + c.w + m + 3, c.y - m],
      [c.x - m - w - 3, c.y - m], [c.x - m + 4, c.y - m + 4]]
      .map(([x, y]) => ({ x: Math.min(Math.max(x, 2), innerWidth - w - 2), y: Math.min(Math.max(y, 2), innerHeight - h - 2), w, h }))
    const livre = opcoes.find(o => !ocupado.some(q => cruza(o, q))) || opcoes[0]
    ocupado.push(livre)
    r.style.left = livre.x + 'px'; r.style.top = livre.y + 'px'
  }
}
`

const lista = a => (a === undefined ? [] : Array.isArray(a) ? a : [a])
const passosDe = id => {
  const r = conf.requisitos[id]
  if (r.junto) return passosDe(r.junto)
  return [...(r.antes ?? []), ...(r.cena ? conf.cenas[r.cena] : []), ...(r.passos ?? [])]
}

/** A ordem dos requisitos nas tarefas: as seções "## " dos .md de requisitos/, parte por parte. */
function secoes() {
  const dir = join(pasta, 'requisitos')
  const num = f => Number(f.match(/\d+/)?.[0] ?? 0)
  let arqs = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'epico.md').sort((a, b) => num(a) - num(b)).map(f => join(dir, f)) : []
  if (!arqs.length && existsSync(join(pasta, 'REQUISITOS.md'))) arqs = [join(pasta, 'REQUISITOS.md')]
  const saida = []
  for (const arq of arqs) {
    let atual = null
    for (const linha of readFileSync(arq, 'utf8').split(/\r?\n/)) {
      if (linha.startsWith('## ')) { atual = []; saida.push(atual) }
      const m = linha.match(/^\|\s*([A-Z]{2,3}\d{3})\s*\|/)
      if (m && atual) atual.push(m[1])
    }
  }
  return saida
}

/**
 * Passo que não muda o estado da tela: só espera, só rola (o contorno fora da tela abre outro grupo) ou só marca um
 * elemento com data-print para o contorno achar.
 */
const neutro = p => (Object.keys(p).length === 1 && p.esperar !== undefined) || p.rolar !== undefined
  || (p.js !== undefined && /dataset\.print/.test(p.js) && !/click\(|focus\(|addRange|dispatchEvent|\.value|scrollIntoView/.test(p.js))
const vivos = id => passosDe(id).filter(p => !neutro(p)).map(p => JSON.stringify(p))
const prefixo = (a, t) => t.length > a.length && a.every((p, i) => p === t[i])

/**
 * Grupos: { passos, ids }, na ordem em que o 1º de cada grupo aparece; a tarefa lista juntos os requisitos de cada
 * grupo (ferramentas/tarefas_em_lista.py lê o grupos.json). Entram no mesmo grupo, até 8, os requisitos da mesma seção
 * com o mesmo estado e os de estado anterior: o requisito do cartão vai para o print com o menu do cartão aberto, se o
 * cartão continua à vista (o contorno fora da tela ou coberto tira o requisito do grupo na hora do print). Entre os
 * estados que continuam o do requisito, vale o de mais requisitos; no empate, o mais curto. O requisito só sai do
 * próprio estado para um que tem pelo menos tantos requisitos quanto o dele.
 */
function grupos() {
  const MAX = 8
  const visto = new Set()
  const saida = []
  for (const secao of secoes()) {
    const ids = secao.filter(id => conf.requisitos[id] && !conf.requisitos[id].sem && !visto.has(id))
    ids.forEach(id => visto.add(id))
    const v = new Map(ids.map(id => [id, vivos(id)]))
    const conta = new Map()
    for (const s of v.values()) conta.set(s.join('\n'), (conta.get(s.join('\n')) ?? 0) + 1)
    const abertos = new Map()
    for (const id of ids) {
      const a = v.get(id)
      let alvo = a
      for (const t of v.values()) {
        if (!prefixo(a, t)) continue
        const ct = conta.get(t.join('\n'))
        const ca = conta.get(alvo.join('\n'))
        if (ct > ca || (ct === ca && (alvo === a || t.length < alvo.length))) alvo = t
      }
      const k = alvo.join('\n')
      const g = abertos.get(k)
      if (g && g.ids.length < MAX) g.ids.push(id)
      else {
        const dono = ids.find(x => v.get(x).join('\n') === k)
        const novo = { passos: passosDe(dono), ids: [id] }
        abertos.set(k, novo)
        saida.push(novo)
      }
    }
  }
  for (const id of Object.keys(conf.requisitos)) {
    if (!visto.has(id) && !conf.requisitos[id].sem) saida.push({ passos: passosDe(id), ids: [id] })
  }
  return saida
}
const nome = g => (g.length === 1 ? `${g[0]}.jpg` : `${g[0]}-${g.at(-1)}.jpg`)

await cdp('Page.enable')
await cdp('Runtime.enable')
await cdp('Emulation.setEmulatedMedia', { features: [
  { name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: conf.tema ?? 'light' },
] })

for (const id of so) {
  if (!conf.requisitos[id]) console.log(`${id}: fora do prints.json`)
  else if (conf.requisitos[id].sem) console.log(`${id}: sem print (${conf.requisitos[id].sem})`)
}
const fila = grupos().filter(g => !so.length || g.ids.some(id => so.includes(id)))
const arqMapa = join(saida, 'grupos.json')
const mapa = so.length && existsSync(arqMapa) ? JSON.parse(readFileSync(arqMapa, 'utf8')) : {}
let falhas = 0
let prints = 0
while (fila.length) {
  const g = fila.shift()
  const unico = g.ids.length === 1
  try {
    await preparar()
    await avaliar(MARCAR)
    for (const p of g.passos) await passo(p)
    // O hover do último clique sai, salvo quando o requisito é o próprio hover (tooltip, "+N").
    if (!g.passos.some(p => p.pairar)) await mouse(LARGURA - 1, ALTURA - 1, false)
    // A barra do andaime sai antes do contorno: no pé da tela, ela cobriria o alvo.
    await avaliar(`(() => { const a = window.__andaime && window.__andaime(); if (a) a.style.visibility = 'hidden' })()`)
    const feito = []
    const fora = []
    for (const id of g.ids) {
      const alvos = lista(conf.requisitos[id].destacar)
      // O passo neutro de cada requisito (a marca data-print) roda antes do contorno dele.
      // A marca que já está nos passos do grupo não roda de novo (o menu que ela marca pode ter fechado).
      const feitos = new Set(g.passos.map(p => JSON.stringify(p)))
      if (!unico) for (const p of passosDe(id).filter(p => neutro(p) && p.js && !feitos.has(JSON.stringify(p)))) await passo(p)
      const erro = alvos.length ? await avaliar(`__marcar(${JSON.stringify(id)}, ${JSON.stringify(alvos)}, ${unico}, ${!unico})`) : ''
      if (!erro) feito.push(id)
      else if (unico) throw new Error(erro)
      else { fora.push(id); console.log(`  ${id} sai do grupo de ${g.ids[0]}: ${erro}`) }
    }
    // O requisito que não coube no print do grupo volta à fila no próprio estado, junto dos que têm o mesmo.
    const porEstado = new Map()
    for (const id of fora) {
      const k = vivos(id).join('\n')
      if (!porEstado.has(k)) porEstado.set(k, [])
      porEstado.get(k).push(id)
    }
    const novos = []
    for (const [k, ids] of porEstado) {
      if (k === g.passos.filter(p => !neutro(p)).map(p => JSON.stringify(p)).join('\n')) ids.forEach(id => novos.push({ passos: passosDe(id), ids: [id] }))
      else novos.push({ passos: passosDe(ids[0]), ids })
    }
    fila.unshift(...novos)
    if (!feito.length) continue
    await avaliar('__desenhar()')
    await dormir(250)
    const { data } = await cdp('Page.captureScreenshot', { format: 'jpeg', quality: 85 })
    writeFileSync(join(saida, nome(feito)), Buffer.from(data, 'base64'))
    for (const id of feito) mapa[id] = nome(feito)
    prints++
    console.log(`${nome(feito)}: ok (${feito.join(', ')})`)
  }
  catch (e) {
    console.log(`${g.ids.join(', ')}: FALHOU ${e.message}`); falhas++
    // Para ver onde parou: PRINTS_DEPURAR=<pasta fora do repositório> grava a tela da falha.
    if (process.env.PRINTS_DEPURAR) {
      const { data } = await cdp('Page.captureScreenshot', { format: 'jpeg', quality: 60 })
      writeFileSync(join(process.env.PRINTS_DEPURAR, nome(g.ids)), Buffer.from(data, 'base64'))
    }
  }
}
writeFileSync(arqMapa, JSON.stringify(Object.fromEntries(Object.entries(mapa).sort()), null, 2) + '\n')
// Rodada completa: o print que nenhum grupo usa mais sai da pasta.
if (!so.length && !falhas) {
  const usados = new Set(Object.values(mapa))
  for (const f of readdirSync(saida)) if (f.endsWith('.jpg') && !usados.has(f)) { rmSync(join(saida, f)); console.log(`${f}: apagado (sem uso)`) }
}

ws.close()
proc.kill()
await dormir(500)
try { rmSync(perfil, { recursive: true, force: true }) } catch {}
console.log(`${prints} prints para ${Object.keys(mapa).length} requisitos em ${saida}${falhas ? `, ${falhas} grupos falharam` : ''}`)
process.exit(falhas ? 1 : 0)
