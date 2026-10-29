/**
 * Tira o print de cada requisito do protótipo, para ir abaixo da caixa de marcar do requisito na tarefa do card
 * no ENSPACE (regra 42 da spec, decisão da redatora em 2026-10-29).
 *
 * Uso:
 *   node ferramentas/prints-de-requisito.mjs app/pages/<slug>            # todos os requisitos do prints.json
 *   node ferramentas/prints-de-requisito.mjs app/pages/<slug> RF001 RF702 # só estes
 *
 * Lê `<pasta>/requisitos/prints.json` e grava `<pasta>/evidencias/requisitos/<ID>.jpg`.
 * Abre o protótipo publicado num Chrome sem janela: o print sai sem o ponteiro do mouse e sem a barra do andaime.
 * Cada requisito começa da página recarregada, faz os passos e contorna o que o requisito pede em magenta.
 *
 * prints.json:
 *   {
 *     "url": "https://pernalombr4.github.io/prototipos/<slug>",
 *     "andaime": "Protótipo · estado",          // texto da barra de revisão, escondida no print
 *     "cenas": { "<nome>": [passo, ...] },       // passos que vários requisitos repetem
 *     "requisitos": { "<ID>": { "cena": "<nome>", "passos": [passo, ...], "destacar": alvo | [alvo, ...] } }
 *   }
 * alvo: "texto" (rótulo, aria-label, placeholder ou texto visível; o mais interno que casa),
 *       { "texto": "...", "n": 1 } (a 2ª ocorrência), { "regex": "^\\d+ de \\d+$" } ou { "css": "seletor", "n": 0 };
 *       "ancestral": "article" sobe até o card; "exato": true contorna o próprio elemento, sem subir ao botão.
 * requisito sem tela no protótipo: { "sem": "<motivo>" }, e a tarefa diz o motivo no lugar do print.
 * passo: { "estado": "<rótulo do andaime>" } | { "clicar": alvo } | { "pairar": alvo } | { "focar": alvo }
 *      | { "digitar": "texto" } | { "tecla": "Enter" | "Escape" | "/" | "ctrl+k" } | { "rolar": alvo }
 *      | { "arquivo": "<caminho de imagem>" } (põe no input de arquivo visível ou não) | { "esperar": ms }
 *      | { "js": "código" } | { "largura": 390 }
 */
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
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

async function destacar(alvos) {
  const lista = Array.isArray(alvos) ? alvos : [alvos]
  for (const [i, a] of lista.entries()) {
    const ok = await avaliar(`(() => { let el = __achar(${JSON.stringify(a)}); if (!el) return false
      el = ${typeof a === 'object' && (a.exato || a.ancestral || a.css) ? 'el' : '__interativo(el)'}
      ${i === 0 ? `const b0 = el.getBoundingClientRect(); if (b0.top < 0 || b0.bottom > innerHeight) el.scrollIntoView({ block: 'center' })` : ''}
      const b = el.getBoundingClientRect(); const m = 5
      const d = document.createElement('div'); d.className = '__destaque'
      Object.assign(d.style, { position: 'fixed', left: (b.x - m) + 'px', top: (b.y - m) + 'px', width: (b.width + 2 * m) + 'px',
        height: (b.height + 2 * m) + 'px', border: '3px solid #FF04D1', borderRadius: '10px', boxShadow: '0 0 0 4px rgba(255,4,209,.22)',
        pointerEvents: 'none', zIndex: 2147483647 })
      document.body.appendChild(d); return true })()`)
    if (!ok) throw new Error(`não achei para destacar ${JSON.stringify(a)}`)
  }
}

await cdp('Page.enable')
await cdp('Runtime.enable')
await cdp('Emulation.setEmulatedMedia', { features: [
  { name: 'prefers-reduced-motion', value: 'reduce' }, { name: 'prefers-color-scheme', value: conf.tema ?? 'light' },
] })

const ids = so.length ? so : Object.keys(conf.requisitos)
let falhas = 0
for (const id of ids) {
  const r = conf.requisitos[id]
  if (!r) { console.log(`${id}: fora do prints.json`); falhas++; continue }
  if (r.sem) { console.log(`${id}: sem print (${r.sem})`); continue }
  try {
    await preparar()
    const passos = [...(r.cena ? conf.cenas[r.cena] : []), ...(r.passos ?? [])]
    for (const p of passos) await passo(p)
    // O hover do último clique sai, salvo quando o requisito é o próprio hover (tooltip, "+N").
    if (!passos.some(p => p.pairar)) await mouse(LARGURA - 1, ALTURA - 1, false)
    if (r.destacar) await destacar(r.destacar)
    await avaliar(`(() => { const a = window.__andaime && window.__andaime(); if (a) a.style.visibility = 'hidden' })()`)
    await dormir(250)
    const { data } = await cdp('Page.captureScreenshot', { format: 'jpeg', quality: 85 })
    writeFileSync(join(saida, `${id}.jpg`), Buffer.from(data, 'base64'))
    console.log(`${id}: ok`)
  }
  catch (e) {
    console.log(`${id}: FALHOU ${e.message}`); falhas++
    // Para ver onde parou: PRINTS_DEPURAR=<pasta fora do repositório> grava a tela da falha.
    if (process.env.PRINTS_DEPURAR) {
      const { data } = await cdp('Page.captureScreenshot', { format: 'jpeg', quality: 60 })
      writeFileSync(join(process.env.PRINTS_DEPURAR, `${id}.jpg`), Buffer.from(data, 'base64'))
    }
  }
}

ws.close()
proc.kill()
await dormir(500)
try { rmSync(perfil, { recursive: true, force: true }) } catch {}
console.log(`${ids.length - falhas} de ${ids.length} prints gravados em ${saida}`)
process.exit(falhas ? 1 : 0)
