/**
 * O estado do protótipo, todo em memória. Recarregar a página zera tudo.
 *
 * Nada de rede: criar, enviar, abrir no Word, salvar e restaurar mexem no
 * array de itens daqui e mostram o resultado na tela.
 */
import type { Textos } from './textos'
import {
  type DocumentoDoCampo,
  type Editor,
  EU,
  type ItemDoContrato,
  itens as itensDoMock,
  type ModeloDeDocumento,
  type OrigemDaVersao,
  pessoa,
} from './mocks'

export type EstadoDaTela = 'normal' | 'carregando' | 'erro' | 'somenteLeitura'

export interface ConfigDoCampo {
  onlyoffice: boolean
  word: boolean
  /** Word para a web: fase 2 (cópia no OneDrive pelo Microsoft Graph). */
  wordWeb: boolean
  /** `null` = perguntar na primeira vez. */
  padrao: 'onlyoffice' | 'word' | null
  modelos: boolean
  branco: boolean
  docx: boolean
  pdf: boolean
  editar: boolean
  comentar: boolean
  acompanhar: boolean
  revisao: boolean
  painelRevisao: boolean
  chat: boolean
}

export const CONFIG_INICIAL: ConfigDoCampo = {
  onlyoffice: true,
  word: true,
  wordWeb: true,
  padrao: null,
  modelos: true,
  branco: true,
  docx: true,
  pdf: true,
  editar: true,
  comentar: true,
  acompanhar: false,
  revisao: false,
  painelRevisao: false,
  chat: false,
}

function copiaFunda<T>(v: T): T {
  return JSON.parse(JSON.stringify(v), (_k, x) =>
    typeof x === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(x) ? new Date(x) : x,
  )
}

export function useDocumentos() {
  const itens = useState<ItemDoContrato[]>('ed-itens', () => copiaFunda(itensDoMock))
  const itemAbertoId = useState<number | null>('ed-item-aberto', () => null)
  /** ANDAIME: o estado global que o seletor do andaime força. */
  const estadoDaTela = useState<EstadoDaTela>('ed-estado', () => 'normal')
  /** ANDAIME: simula o suplemento do ENSPACE instalado ou não no Word. */
  const suplementoInstalado = useState<boolean>('ed-suplemento', () => true)
  /** ANDAIME: chama o Word do computador de verdade (ms-word:). */
  const wordDeVerdade = useState<boolean>('ed-word-real', () => true)
  /** A preferência da pessoa, por campo. `null` = ainda não escolheu. */
  const preferencia = useState<Editor | null>('ed-preferencia', () => null)

  /** O que está aberto por cima da tela. */
  const editorAberto = useState<number | null>('ed-editor', () => null)
  const janelaDoWord = useState<number | null>('ed-janela-word', () => null)
  const versoesAbertas = useState<number | null>('ed-versoes', () => null)

  /** A configuração do campo (proposta da tela de configuração). */
  const config = useState<ConfigDoCampo>('ed-config', () => ({ ...CONFIG_INICIAL }))

  const itemAberto = computed(() => itens.value.find(i => i.id === itemAbertoId.value) ?? null)

  /** Os editores que o configurador ligou, na ordem do menu. */
  const editoresLigados = computed<Editor[]>(() => [
    ...(config.value.onlyoffice ? ['onlyoffice' as const] : []),
    ...(config.value.word ? ['word-desktop' as const] : []),
    ...(config.value.word && config.value.wordWeb ? ['word-web' as const] : []),
  ])

  /** O editor que o botão Abrir usa: a escolha da pessoa, senão o padrão do campo. */
  const editorDoBotao = computed<Editor | null>(() => {
    const ligados = editoresLigados.value
    if (ligados.length === 1 || (config.value.onlyoffice && !config.value.word)) return ligados[0] ?? null
    if (preferencia.value && ligados.includes(preferencia.value)) return preferencia.value
    if (config.value.padrao === 'onlyoffice') return 'onlyoffice'
    if (config.value.padrao === 'word') return 'word-desktop'
    return null
  })

  function itemPorId(id: number) {
    return itens.value.find(i => i.id === id) ?? null
  }

  function mudarDocumento(id: number, fn: (d: DocumentoDoCampo | null) => DocumentoDoCampo | null) {
    itens.value = itens.value.map((i) => {
      if (i.id !== id) return i
      const novo = fn(i.data.minuta_do_contrato ? copiaFunda(i.data.minuta_do_contrato) : null)
      return { ...i, updated_at: new Date(), data: { ...i.data, minuta_do_contrato: novo } }
    })
  }

  let proximoId = 5000

  function criarDocumento(id: number, nome: string, ext: '.docx' | '.pdf', size: number, origem: OrigemDaVersao, url = '#') {
    proximoId += 1
    const em = new Date()
    mudarDocumento(id, () => ({
      id: proximoId,
      created_at: em,
      updated_at: em,
      name: nome,
      hash: `minuta_${proximoId}`,
      ext,
      mime: ext === '.pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size,
      url,
      provider: 'local',
      user: EU.id,
      versoes: [{ numero: 1, autor: EU.id, em, origem }],
    }))
  }

  function novaVersao(id: number, origem: OrigemDaVersao, deVersao?: number): number {
    let numero = 0
    mudarDocumento(id, (d) => {
      if (!d) return d
      numero = d.versoes.length + 1
      const em = new Date()
      d.versoes.push({ numero, autor: EU.id, em, origem, deVersao })
      d.updated_at = em
      d.size = Math.round(d.size * (1 + Math.random() * 0.04))
      return d
    })
    return numero
  }

  function abrirSessao(id: number, editor: Editor) {
    mudarDocumento(id, d => (d ? { ...d, sessao: { editor, pessoa: EU.id, desde: new Date() } } : d))
  }

  function fecharSessao(id: number) {
    mudarDocumento(id, (d) => {
      if (!d) return d
      const { sessao: _sessao, ...resto } = d
      return resto as DocumentoDoCampo
    })
  }

  function removerDocumento(id: number) {
    mudarDocumento(id, () => null)
  }

  function nomeDoModelo(m: ModeloDeDocumento, item: ItemDoContrato) {
    return `${m.nome} ${item.data.contratante.split(' ').slice(0, 2).join(' ')}.docx`
  }

  function reiniciar() {
    itens.value = copiaFunda(itensDoMock)
    preferencia.value = null
    editorAberto.value = null
    janelaDoWord.value = null
    versoesAbertas.value = null
    estadoDaTela.value = 'normal'
    suplementoInstalado.value = true
    config.value = { ...CONFIG_INICIAL }
  }

  return {
    config,
    editoresLigados,
    editorDoBotao,
    itens,
    itemAbertoId,
    itemAberto,
    itemPorId,
    estadoDaTela,
    suplementoInstalado,
    wordDeVerdade,
    preferencia,
    editorAberto,
    janelaDoWord,
    versoesAbertas,
    criarDocumento,
    novaVersao,
    abrirSessao,
    fecharSessao,
    removerDocumento,
    nomeDoModelo,
    reiniciar,
  }
}

/* ------------------------------- formatação ------------------------------- */

export function quandoFoi(t: Textos, data: Date): string {
  const ms = Date.now() - new Date(data).getTime()
  const min = Math.floor(ms / 60_000)
  if (min < 1) return t.tempo.agora
  if (min < 60) return t.tempo.minutos(min)
  const h = Math.floor(min / 60)
  if (h < 24) return t.tempo.horas(h)
  return t.tempo.dias(Math.floor(h / 24))
}

export function hora(data: Date, idioma: string): string {
  return new Intl.DateTimeFormat(idioma, { hour: '2-digit', minute: '2-digit' }).format(new Date(data))
}

export function dataHora(data: Date, idioma: string): string {
  return new Intl.DateTimeFormat(idioma, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(data))
}

export function tamanho(bytes: number, idioma: string): string {
  const kb = bytes / 1024
  if (kb < 1024) return `${new Intl.NumberFormat(idioma, { maximumFractionDigits: 0 }).format(kb)} KB`
  return `${new Intl.NumberFormat(idioma, { maximumFractionDigits: 1 }).format(kb / 1024)} MB`
}

export function nomeCurto(id: number): string {
  const p = pessoa(id)
  return p.id === EU.id ? p.nome : p.nome.split(' ').slice(0, 2).join(' ')
}

export const ICONE_DO_EDITOR: Record<Editor, string> = {
  'onlyoffice': 'i-lucide-file-pen-line',
  'word-desktop': 'i-lucide-monitor',
  'word-web': 'i-lucide-globe',
}
