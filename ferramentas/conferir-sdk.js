/*
 * Conferir o contrato do SDK
 * ==========================
 *
 * Não faz parte do protótipo: é ferramenta, igual ao `medir-contraste.js`. Não
 * é importada por nada, não entra no bundle, e roda em Node puro.
 *
 * Responde a pergunta que toda atualização de dependência deixa no ar: "subi a
 * versão, o que quebrou?". Em vez de descobrir no site publicado, descobre
 * aqui, comparando o que os protótipos **importam** com o que o pacote
 * instalado **realmente exporta** — a mesma regra que a spec manda seguir à
 * mão ("componente e prop se conferem em disco", regra 5), só que de uma vez
 * para o repositório inteiro.
 *
 *   node ferramentas/conferir-sdk.js            confere o que está em disco
 *   node ferramentas/conferir-sdk.js --remoto   e pergunta ao npm se saiu versão nova
 *
 * Sai com código 1 se algo não bate, e é isso que deixa o check do PR
 * vermelho. O `--remoto` nunca reprova: versão nova é aviso, não erro — quem
 * decide subir é a Mikaela, e quem abre o PR é o Dependabot.
 *
 * Por que grep em `.d.ts` e não `vue-tsc`: o typecheck completo traria junto
 * todo erro de tipo que já existe no repositório, e o sinal se perderia no
 * ruído. Aqui a pergunta é estreita de propósito, e é por isso que ela é
 * confiável: quando fica vermelha, é porque o SDK mudou mesmo.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const remoto = process.argv.includes('--remoto')

const problemas = []
const avisos = []

const caminho = (...p) => join(raiz, ...p)
const ler = (...p) => readFileSync(caminho(...p), 'utf8')
const existe = (...p) => existsSync(caminho(...p))

/** Os módulos do SDK que os protótipos importam, e onde mora a verdade de cada um. */
const MODULOS = {
  '@be-enlighten/enspace-sdk-schemas': 'node_modules/@be-enlighten/enspace-sdk-schemas/dist/index.d.ts',
  '@be-enlighten/enspace-sdk-ui/base': 'node_modules/@be-enlighten/enspace-sdk-ui/dist/base.d.ts',
}

/** Os quatro componentes base. Se algum sumir, a spec inteira precisa de revisão. */
const BASE = ['EnApp', 'EnLayout', 'EnTable', 'EnKanbanBoard']

/**
 * Tudo que um `.d.ts` exporta.
 *
 * Os dois arquivos do SDK usam formas diferentes: o `base.d.ts` tem várias
 * linhas `export { default as X }` e `export type { A, B }`; o `index.d.ts` do
 * schemas tem um único `export { ... }` gigante no fim, com 13 mil linhas de
 * declaração antes. As duas formas caem nos mesmos dois padrões abaixo.
 */
function nomesExportados(conteudo) {
  const nomes = new Set()

  for (const bloco of conteudo.matchAll(/export\s+(?:type\s+)?\{([\s\S]*?)\}/g)) {
    for (const bruto of bloco[1].split(',')) {
      const entrada = bruto.trim().replace(/^type\s+/, '')
      if (!entrada) continue
      // Em `X as Y`, quem fica exportado é o Y.
      const nome = entrada.split(/\s+as\s+/).pop().trim()
      if (/^[A-Za-z_$][\w$]*$/.test(nome)) nomes.add(nome)
    }
  }

  for (const m of conteudo.matchAll(
    /export\s+(?:declare\s+)?(?:const|type|interface|class|function|enum)\s+([A-Za-z_$][\w$]*)/g,
  )) {
    nomes.add(m[1])
  }

  return nomes
}

/** Os arquivos de uma pasta, recursivo, com barra normal (o repositório roda no Windows). */
function arquivosDe(pasta, ...extensoes) {
  if (!existe(pasta)) return []
  return readdirSync(caminho(pasta), { recursive: true })
    .map(String)
    .map(a => a.replace(/\\/g, '/'))
    .filter(a => extensoes.some(e => a.endsWith(e)))
    .map(a => `${pasta}/${a}`)
}

const fontes = arquivosDe('app', '.vue', '.ts')

// ---------------------------------------------------------------- 1. versões

const pkg = JSON.parse(ler('package.json'))
const deps = Object.entries(pkg.dependencies ?? {})

console.log('Versões')
for (const [nome, faixa] of deps) {
  const manifesto = `node_modules/${nome}/package.json`
  if (!existe(manifesto)) {
    problemas.push(`${nome} está no package.json e não está instalado. Rode pnpm install.`)
    continue
  }
  const instalada = JSON.parse(ler(manifesto)).version
  console.log(`  ${nome.padEnd(38)} ${faixa.padEnd(10)} instalado ${instalada}`)
}

// --------------------------------------------- 2. os quatro componentes base

const arquivoBase = MODULOS['@be-enlighten/enspace-sdk-ui/base']
if (!existe(arquivoBase)) {
  problemas.push(`O entry /base do enspace-sdk-ui sumiu (${arquivoBase}).`)
}

const exportados = {}
for (const [modulo, arquivo] of Object.entries(MODULOS)) {
  exportados[modulo] = existe(arquivo) ? nomesExportados(ler(arquivo)) : new Set()
}

console.log('\nComponentes base do SDK')
for (const nome of BASE) {
  const ok = exportados['@be-enlighten/enspace-sdk-ui/base'].has(nome)
  console.log(`  ${ok ? 'ok   ' : 'FALTA'} ${nome}`)
  if (!ok) problemas.push(`${nome} não é mais exportado por @be-enlighten/enspace-sdk-ui/base.`)
}

// ------------------------------------- 3. os tipos que os protótipos importam

const IMPORTACAO = /import\s+(?:type\s+)?\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]/g

let conferidos = 0
console.log('\nTipos importados do SDK')
for (const arquivo of fontes) {
  const conteudo = ler(arquivo)
  for (const [, dentro, modulo] of conteudo.matchAll(IMPORTACAO)) {
    if (!(modulo in MODULOS)) continue
    for (const bruto of dentro.split(',')) {
      const entrada = bruto.trim().replace(/^type\s+/, '')
      if (!entrada) continue
      // Em `import { X as Y }`, quem precisa existir no pacote é o X.
      const nome = entrada.split(/\s+as\s+/)[0].trim()
      if (!/^[A-Za-z_$][\w$]*$/.test(nome)) continue
      conferidos++
      if (!exportados[modulo].has(nome)) {
        problemas.push(`${arquivo} importa ${nome} de ${modulo}, e o pacote não exporta mais isso.`)
      }
    }
  }
}
console.log(`  ${conferidos} importações conferidas em ${fontes.length} arquivos`)

// -------------------------------- 4. os componentes Nuxt UI usados nas telas

const pastaNuxtUi = 'node_modules/@nuxt/ui/dist/runtime/components'
const usados = new Set()

for (const arquivo of fontes.filter(a => a.endsWith('.vue'))) {
  // `<U` seguido de maiúscula. Os componentes próprios daqui são `Ux<Nome>`,
  // com x minúsculo, e por isso ficam de fora sem precisar de exceção.
  for (const m of ler(arquivo).matchAll(/<U([A-Z][A-Za-z0-9]*)/g)) usados.add(m[1])
}

console.log('\nComponentes do Nuxt UI usados nas telas')
if (!existe(pastaNuxtUi)) {
  problemas.push(`A pasta de componentes do Nuxt UI mudou de lugar (${pastaNuxtUi}).`)
} else {
  const naPasta = readdirSync(caminho(pastaNuxtUi)).filter(a => a.endsWith('.vue')).length
  const sumidos = [...usados].filter(n => !existe(pastaNuxtUi, `${n}.vue`)).sort()
  console.log(`  ${usados.size} usados, ${naPasta} disponíveis na versão instalada`)
  for (const nome of sumidos) {
    problemas.push(`U${nome} é usado nas telas e não existe no Nuxt UI instalado.`)
  }
}

// --------------------------------------------- 5. saiu versão nova? (--remoto)

/**
 * A última versão publicada, direto do registry.
 *
 * Por HTTPS e não por `npm view`: no Windows o binário é `npm.cmd`, e desde a
 * correção de CVE o Node se recusa a executar `.cmd` sem `shell: true` — que
 * por sua vez dispara o aviso DEP0190. Um GET resolve, roda igual nos dois
 * sistemas e ainda vai em paralelo.
 */
async function ultimaVersao(nome) {
  try {
    const r = await fetch(`https://registry.npmjs.org/${nome.replace('/', '%2F')}/latest`)
    if (!r.ok) return null
    return (await r.json()).version ?? null
  } catch {
    return null
  }
}

if (remoto) {
  console.log('\nO que o registry tem de mais novo')
  const ultimas = await Promise.all(deps.map(([nome]) => ultimaVersao(nome)))

  deps.forEach(([nome], i) => {
    const ultima = ultimas[i]
    if (!ultima) {
      console.log(`  ${nome.padEnd(38)} o registry não respondeu`)
      return
    }
    const manifesto = `node_modules/${nome}/package.json`
    const instalada = existe(manifesto) ? JSON.parse(ler(manifesto)).version : '?'
    const atrasado = ultima !== instalada
    console.log(`  ${nome.padEnd(38)} ${instalada.padEnd(10)} ${atrasado ? `novo: ${ultima}` : 'em dia'}`)
    if (atrasado) avisos.push(`${nome} está em ${instalada} e já existe ${ultima}.`)
  })
} else {
  console.log('\n(rode com --remoto para perguntar ao registry se saiu versão nova)')
}

// ------------------------------------------------------------------ resultado

if (avisos.length) {
  console.log('\nAvisos, que não reprovam:')
  for (const a of avisos) console.log(`  . ${a}`)
  console.log('  O Dependabot abre o PR dessas sozinho, toda segunda.')
}

if (problemas.length) {
  console.log(`\n${problemas.length} problema(s):`)
  for (const p of problemas) console.log(`  X ${p}`)
  console.log('\nO contrato do SDK mudou. Antes de subir a versão, conserte o que aponta acima.')
  process.exit(1)
}

console.log('\nTudo o que os protótipos importam continua existindo na versão instalada.')
