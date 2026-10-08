/**
 * Os arquivos de verdade do protótipo, e o Word de verdade.
 *
 * Cada contrato tem um .docx em `./arquivos/` (gerado por `gerar-arquivos.py`).
 * O Vite serve esses arquivos como estáticos, no endereço do próprio protótipo
 * (local ou GitHub Pages): fazem o papel do armazenamento do ENSPACE. O
 * arquivo NÃO está no computador de quem abre.
 *
 * "Abrir no Word" chama o esquema de URI do Office, `ms-word:ofe|u|<url>`
 * (learn.microsoft.com/office/client-developer/office-uri-schemes). O Word do
 * computador busca o arquivo na URL e abre, sem passar por Downloads. É o
 * mesmo gesto que o ENSPACE faria.
 *
 * O limite, que é o achado técnico: aqui não há servidor WebDAV (o protótipo
 * é 100% front-end), então o Word abre o arquivo em LEITURA e o Salvar não
 * volta para o item. No ENSPACE, o endpoint WebDAV com bloqueio é o que faz o
 * Ctrl+S gravar no campo.
 *
 * Arquivo enviado pela pessoa no protótipo vira um endereço `blob:` do
 * navegador, que o Word não consegue buscar. Nesse caso o protótipo baixa o
 * arquivo (a saída de emergência).
 */
import type { ItemDoContrato } from './mocks'

const urls = import.meta.glob('./arquivos/*.docx', { query: '?url', import: 'default', eager: true }) as Record<string, string>

function urlDaPasta(nome: string): string | null {
  return urls[`./arquivos/${nome}`] ?? null
}

export interface ArquivoDoItem {
  url: string
  nome: string
  /** `blob:` = enviado pela pessoa nesta sessão; o Word não alcança. */
  local: boolean
}

export function arquivoDoItem(item: ItemDoContrato): ArquivoDoItem | null {
  const d = item.data.minuta_do_contrato
  if (!d) return null
  if (d.url.startsWith('blob:')) return { url: d.url, nome: d.name, local: true }
  const nasceuEmBranco = d.versoes[0]?.origem === 'branco'
  const url = (!nasceuEmBranco && urlDaPasta(`${item.reference}.docx`)) || urlDaPasta('em-branco.docx')
  return url ? { url, nome: d.name.endsWith('.pdf') ? d.name : d.name.replace(/\.docx?$/i, '') + '.docx', local: false } : null
}

function absoluta(url: string) {
  return new URL(url, window.location.href).href
}

/** Baixa o arquivo ligado ao item (a saída de emergência). */
export function baixarArquivo(a: ArquivoDoItem) {
  const link = document.createElement('a')
  link.href = a.local ? a.url : absoluta(a.url)
  link.download = a.nome
  document.body.appendChild(link)
  link.click()
  link.remove()
}

/**
 * Abre no Word do computador. Precisa ser chamado dentro do clique (o
 * navegador só aceita abrir outro aplicativo a partir de um gesto da pessoa).
 * Devolve o que aconteceu.
 */
export function abrirNoWordDoComputador(item: ItemDoContrato, modo: 'ofe' | 'ofv' = 'ofe'): 'word' | 'download' | 'nada' {
  const a = arquivoDoItem(item)
  if (!a) return 'nada'
  if (a.local) {
    baixarArquivo(a)
    return 'download'
  }
  window.location.href = `ms-word:${modo}|u|${absoluta(a.url)}`
  return 'word'
}
