<script setup lang="ts">
/**
 * PROPOSTA: o editor de modelos (Configurações › Categorias › <categoria> ›
 * Templates de Documentos), com variáveis e expressões sem digitar marcação.
 *
 * Como é hoje (develop, 21/10/2026, prints develop-13 a develop-20):
 * - o modal do editor se chama "The Enlighten Co.", e o documento em branco
 *   abre pedindo "Choose TXT options" (codificação) e nasce em Courier New 10;
 * - variável: o botão "#" abre um select estreito, com o nome cortado e cada
 *   campo 2 vezes ("Formatado" e "Não formatado"); escolher COPIA a marcação
 *   para a área de transferência, e a pessoa cola com Ctrl+V; no documento
 *   fica o código cru (`{{data.vitrine_arquivo_formatted}}`);
 * - condição e repetição: o botão de chave copia um esqueleto
 *   (`{{}}{{IF variavel === 'valor'}} conteúdo {{END-IF}}`) que a pessoa
 *   reescreve à mão: trocar "variavel" pela referência técnica, o operador, o
 *   valor entre aspas simples, sem errar o END-IF;
 * - não existe prévia com dados reais (a própria documentação avisa).
 *
 * O que muda aqui:
 * - o campo entra ONDE ESTÁ O CURSOR, com 1 clique, como uma etiqueta com o
 *   nome do campo (não o código); "Inserir com formatação" é 1 chave, no lugar
 *   da lista duplicada; cada campo mostra o tipo e um exemplo de valor;
 * - "Mostrar somente se": formulário (campo, condição, valor) com a frase em
 *   português; o valor de campo de opção é escolhido na lista de opções; o
 *   texto selecionado vai para dentro da condição; o bloco fica emoldurado no
 *   documento e se edita com 1 clique no cabeçalho;
 * - "Repetir para cada linha": escolhe a lista e as informações de cada linha;
 *   as colunas da lista aparecem na aba Campos quando o cursor está dentro do
 *   bloco;
 * - Prévia com os dados de um contrato escolhido: condição avaliada,
 *   repetição feita, valores destacados;
 * - "Ver a marcação": o mesmo formato que o ENSPACE grava hoje, gerado pelo
 *   editor. Nada muda no formato;
 * - verificação: marcação digitada à mão que o ENSPACE não reconhece aparece
 *   no rodapé, antes de gerar documento com o código à mostra.
 *
 * A página é simulação do ONLYOFFICE (contenteditable). Etiquetas e blocos são
 * elementos não editáveis dentro dela, como os controles de conteúdo do
 * ONLYOFFICE. Nada é gravado: Concluir mostra o aviso e fecha.
 */
import type { SelectItem } from '@nuxt/ui'
import type { Textos } from './textos'
import {
  type CampoDoModelo, type ColunaDoModelo, type DadosDoContrato, type ItemDoContrato, type StatusDoContrato,
  camposDoModelo, modelos, parcelasDoContrato, pessoa, pessoas,
} from './mocks'
import { useDocumentos } from './estado'

const props = defineProps<{ t: Textos, idioma: string, categoria: string }>()

const toast = useToast()
const { editorDeModeloAberto, itens } = useDocumentos()

const aberto = computed({
  get: () => editorDeModeloAberto.value,
  set: (v) => { editorDeModeloAberto.value = v },
})

/* ------------------------------ modelos ------------------------------ */

const modeloId = ref(modelos[0]!.id)
const modelo = computed(() => modelos.find(m => m.id === modeloId.value) ?? modelos[0]!)
const opcoesDeModelo = computed<SelectItem[]>(() => modelos.map(m => ({ label: m.nome, value: m.id })))

/** O conteúdo de cada modelo, guardado enquanto a camada está aberta. */
const conteudos = new Map<number, string>()

/* ------------------------------ marcação ------------------------------ */

type Op = 'igual' | 'diferente' | 'maior' | 'menor' | 'maiorIgual' | 'menorIgual'
interface LinhaDeCondicao { campo: string, op: Op, valor: string | number | null }
interface Condicao { conector: 'E' | 'OU', linhas: LinhaDeCondicao[] }
interface Repeticao { campo: string, colunas: string[] }

const SIMBOLO: Record<Op, string> = { igual: '===', diferente: '!==', maior: '>', menor: '<', maiorIgual: '>=', menorIgual: '<=' }

const CLASSE_ETIQUETA = 'mx-px inline-flex items-center rounded-sm bg-primary/10 px-1 font-sans text-[11.5px] font-medium text-primary ring-1 ring-primary/30 align-baseline select-all'
const CLASSE_COLUNA = 'mx-px inline-flex items-center rounded-sm bg-info/10 px-1 font-sans text-[11.5px] font-medium text-info ring-1 ring-info/30 align-baseline select-all'
const CLASSE_BLOCO_SE = 'my-3 rounded-md border border-dashed border-warning/60 bg-warning/5 px-3 py-2'
const CLASSE_BLOCO_REP = 'my-3 rounded-md border border-dashed border-info/60 bg-info/5 px-3 py-2'
const CLASSE_CABECALHO = 'mb-1 cursor-pointer select-none font-sans text-[11px] font-semibold'
const CLASSE_FIM = 'mt-1 select-none font-sans text-[10.5px] text-muted'

function campoPorRef(ref: string) {
  return camposDoModelo.find(c => c.ref === ref)
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function etiqueta(c: CampoDoModelo, formatado: boolean) {
  return `<span contenteditable="false" data-var="${c.ref}" data-fmt="${formatado ? 1 : 0}" class="${CLASSE_ETIQUETA}">${esc(c.rotulo)}${formatado ? '' : ' (valor original)'}</span>`
}

function etiquetaDeColuna(lista: CampoDoModelo, col: ColunaDoModelo) {
  return `<span contenteditable="false" data-col="${col.ref}" data-lista="${lista.ref}" class="${CLASSE_COLUNA}">${esc(col.rotulo)}</span>`
}

function rotuloDoValor(campo: CampoDoModelo | undefined, v: string | number | null) {
  if (v === null || v === '') return '…'
  if (!campo) return String(v)
  if (campo.ref === 'status') return props.t.statusDoContrato[v as StatusDoContrato] ?? String(v)
  if (campo.tipo === 'pessoa') return pessoa(Number(v)).nome
  if (campo.tipo === 'moeda') return new Intl.NumberFormat(props.idioma, { style: 'currency', currency: 'BRL' }).format(Number(v))
  if (campo.tipo === 'numero') return new Intl.NumberFormat(props.idioma).format(Number(v))
  return `"${v}"`
}

function frase(c: Condicao) {
  const junta = c.conector === 'E' ? props.t.modelo.juntaE : props.t.modelo.juntaOU
  return c.linhas
    .map((l) => {
      const campo = campoPorRef(l.campo)
      return `${campo?.rotulo ?? l.campo} ${props.t.modelo.ops[l.op]} ${rotuloDoValor(campo, l.valor)}`
    })
    .join(` ${junta} `)
}

function codificar(o: unknown) {
  return encodeURIComponent(JSON.stringify(o))
}
function decodificar<T>(s: string | undefined): T | null {
  if (!s) return null
  try { return JSON.parse(decodeURIComponent(s)) as T }
  catch { return null }
}

function blocoSe(c: Condicao, miolo: string) {
  return `<div data-se="${codificar(c)}" class="${CLASSE_BLOCO_SE}">`
    + `<div contenteditable="false" data-ui="se" title="${esc(props.t.modelo.clicarParaEditar)}" class="${CLASSE_CABECALHO} text-warning">◆ ${esc(props.t.modelo.cabecalhoSe(frase(c)))}</div>`
    + miolo
    + `<div contenteditable="false" data-ui="fim" class="${CLASSE_FIM}">${esc(props.t.modelo.fimSe)}</div></div>`
}

function blocoRepetir(r: Repeticao, miolo: string) {
  const lista = campoPorRef(r.campo)
  return `<div data-repetir="${codificar(r)}" class="${CLASSE_BLOCO_REP}">`
    + `<div contenteditable="false" data-ui="repetir" class="${CLASSE_CABECALHO} text-info">↻ ${esc(props.t.modelo.cabecalhoRepetir(lista?.rotulo ?? r.campo))}</div>`
    + miolo
    + `<div contenteditable="false" data-ui="fim" class="${CLASSE_FIM}">${esc(props.t.modelo.fimRepetir)}</div></div>`
}

const c = (ref: string, fmt = true) => etiqueta(campoPorRef(ref)!, fmt)

/** O conteúdo de partida de cada modelo (o mesmo contrato do mock). */
function conteudoInicial(id: number): string {
  const titulo = (txt: string) => `<p class="mb-5 text-center text-[15px] font-bold tracking-wide">${txt}</p>`
  const p = (html: string) => `<p class="mb-3 text-justify">${html}</p>`
  if (id === 11) {
    const parcelas = campoPorRef('parcelas')!
    const [num, venc, val] = parcelas.colunas!
    return titulo('CONTRATO DE PRESTAÇÃO DE SERVIÇOS')
      + p(`CONTRATANTE: ${c('contratante')}, pessoa jurídica de direito privado, doravante denominada CONTRATANTE.`)
      + p(`CLÁUSULA 1. OBJETO. O presente contrato tem por objeto: ${c('objeto')}.`)
      + p(`CLÁUSULA 2. PREÇO. Pelos serviços, a CONTRATANTE pagará o valor total de ${c('valor')}, nas parcelas abaixo:`)
      + blocoRepetir({ campo: 'parcelas', colunas: ['numero', 'vencimento', 'valor'] },
        p(`Parcela ${etiquetaDeColuna(parcelas, num!)}: vencimento em ${etiquetaDeColuna(parcelas, venc!)}, no valor de ${etiquetaDeColuna(parcelas, val!)}.`))
      + p(`CLÁUSULA 3. VIGÊNCIA. Este contrato vigora por ${c('vigencia_meses')} meses a partir da assinatura.`)
      + blocoSe({ conector: 'E', linhas: [{ campo: 'valor', op: 'maior', valor: 100000 }] },
        p('CLÁUSULA 4. GARANTIA. Por se tratar de contrato acima de R$ 100.000,00, a CONTRATADA apresentará seguro-garantia de 5% do valor total.'))
      + p(`CLÁUSULA 5. FORO. Fica eleito o foro da comarca de Belo Horizonte. Referência interna: ${c('reference')}.`)
  }
  const nome = modelos.find(m => m.id === id)?.nome.toUpperCase() ?? ''
  return titulo(nome) + p(`CONTRATANTE: ${c('contratante')}.`) + p('Escreva aqui o texto do modelo.')
}

/* ------------------------------ o documento ------------------------------ */

const artigo = ref<HTMLElement | null>(null)
const modo = ref<'editar' | 'previa'>('editar')
const verMarcacao = ref(false)

function carregar() {
  if (!artigo.value) return
  artigo.value.innerHTML = conteudos.get(modeloId.value) ?? conteudoInicial(modeloId.value)
  verificar()
}

function guardar() {
  if (artigo.value && modo.value === 'editar') conteudos.set(modeloId.value, artigo.value.innerHTML)
}

watch(aberto, async (v) => {
  if (!v) return
  modo.value = 'editar'
  editando.value = null
  await nextTick()
  carregar()
})

watch(modeloId, async (novo, antigo) => {
  if (artigo.value && modo.value === 'editar') conteudos.set(antigo, artigo.value.innerHTML)
  modo.value = 'editar'
  await nextTick()
  carregar()
})

watch(modo, (_m, antes) => {
  if (antes === 'editar' && artigo.value) conteudos.set(modeloId.value, artigo.value.innerHTML)
})

/* ------------------------- cursor (onde inserir) ------------------------- */

let ultimoCursor: Range | null = null
const listaNoCursor = ref<string | null>(null)
const temSelecao = ref(false)

function aoMudarSelecao() {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount || !artigo.value) return
  const r = sel.getRangeAt(0)
  if (!artigo.value.contains(r.startContainer)) return
  ultimoCursor = r.cloneRange()
  temSelecao.value = !r.collapsed
  const el = (r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement) as HTMLElement | null
  const rep = el?.closest('[data-repetir]') as HTMLElement | null
  listaNoCursor.value = rep ? decodificar<Repeticao>(rep.dataset.repetir)?.campo ?? null : null
}

onMounted(() => document.addEventListener('selectionchange', aoMudarSelecao))
onBeforeUnmount(() => document.removeEventListener('selectionchange', aoMudarSelecao))

/** O bloco de 1º nível onde o cursor está (parágrafo ou bloco). */
function blocoDoTopo(n: Node | null): HTMLElement | null {
  let atual = n
  while (atual && atual.parentNode !== artigo.value) atual = atual.parentNode
  return (atual as HTMLElement) ?? null
}

function cursorValido(): Range {
  const art = artigo.value!
  let r = ultimoCursor
  const dentroDeUi = r && ((r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement) as HTMLElement)?.closest('[data-ui]')
  if (!r || !art.contains(r.startContainer) || dentroDeUi) {
    const paragrafos = art.querySelectorAll(':scope > p')
    const ultimo = paragrafos[paragrafos.length - 1] ?? art
    r = document.createRange()
    r.selectNodeContents(ultimo)
    r.collapse(false)
  }
  return r
}

function destacar(el: Element) {
  el.classList.add('animate-pulse')
  setTimeout(() => el.classList.remove('animate-pulse'), 1200)
}

function colocarCursorDepois(no: Node) {
  const sel = window.getSelection()
  const r = document.createRange()
  r.setStartAfter(no)
  r.collapse(true)
  sel?.removeAllRanges()
  sel?.addRange(r)
  ultimoCursor = r.cloneRange()
}

function htmlParaNo(html: string): HTMLElement {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.firstElementChild as HTMLElement
}

/* ------------------------------ aba Campos ------------------------------ */

const aba = ref('campos')
const abas = computed(() => [
  { label: props.t.modelo.abas.campos, value: 'campos', icon: 'i-lucide-braces' },
  { label: props.t.modelo.abas.condicao, value: 'condicao', icon: 'i-lucide-split' },
  { label: props.t.modelo.abas.repeticao, value: 'repeticao', icon: 'i-lucide-repeat' },
])

const busca = ref('')
const formatado = ref(true)

const ICONE_DO_TIPO: Record<string, string> = {
  texto: 'i-lucide-type',
  opcao: 'i-lucide-list',
  numero: 'i-lucide-hash',
  moeda: 'i-lucide-circle-dollar-sign',
  pessoa: 'i-lucide-user',
  data: 'i-lucide-calendar',
  lista: 'i-lucide-rows-3',
}

const itemDaPrevia = ref<number>(142)
const opcoesDeItem = computed<SelectItem[]>(() => itens.value.map(i => ({ label: `${i.reference} · ${i.data.contratante}`, value: i.id })))
const item = computed<ItemDoContrato>(() => itens.value.find(i => i.id === itemDaPrevia.value) ?? itens.value[0]!)

function valorDoCampo(ref: string, fmt: boolean, it: ItemDoContrato = item.value): string {
  const d = it.data as DadosDoContrato & Record<string, unknown>
  const df = new Intl.DateTimeFormat(props.idioma, { day: '2-digit', month: '2-digit', year: 'numeric' })
  switch (ref) {
    case 'reference': return it.reference
    case 'created_at': return fmt ? df.format(new Date(it.created_at)) : new Date(it.created_at).toISOString()
    case 'request_email': return it.request_email ?? ''
    case 'status': return fmt ? props.t.statusDoContrato[d.status] : d.status
    case 'valor': return fmt ? new Intl.NumberFormat(props.idioma, { style: 'currency', currency: 'BRL' }).format(d.valor) : String(d.valor)
    case 'responsavel': return fmt ? pessoa(d.responsavel).nome : String(d.responsavel)
    case 'vigencia_meses': return String(d.vigencia_meses)
    default: return String(d[ref] ?? '')
  }
}

function valorDaColuna(col: string, linha: Record<string, unknown>): string {
  const v = linha[col]
  if (v instanceof Date) return new Intl.DateTimeFormat(props.idioma, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(v)
  if (col === 'valor') return new Intl.NumberFormat(props.idioma, { style: 'currency', currency: 'BRL' }).format(Number(v))
  return String(v ?? '')
}

const camposFiltrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return camposDoModelo.filter(c => c.tipo !== 'lista' && (!q || c.rotulo.toLowerCase().includes(q)))
})
const daCategoria = computed(() => camposFiltrados.value.filter(c => !c.doItem))
const doItem = computed(() => camposFiltrados.value.filter(c => c.doItem))
const colunasNoCursor = computed(() => {
  const lista = listaNoCursor.value ? campoPorRef(listaNoCursor.value) : null
  return lista ? { lista, colunas: lista.colunas ?? [] } : null
})

function inserirHtml(html: string) {
  if (!artigo.value || modo.value !== 'editar') return
  const r = cursorValido()
  r.deleteContents()
  const no = htmlParaNo(html)
  r.insertNode(no)
  const espaco = document.createTextNode(' ')
  no.after(espaco)
  colocarCursorDepois(espaco)
  destacar(no)
  verificar()
}

function inserirCampo(campo: CampoDoModelo) {
  inserirHtml(etiqueta(campo, formatado.value || !!campo.doItem))
}

function inserirColuna(lista: CampoDoModelo, col: ColunaDoModelo) {
  inserirHtml(etiquetaDeColuna(lista, col))
}

/* ------------------------------ aba Condição ------------------------------ */

const camposDeCondicao = computed<SelectItem[]>(() => camposDoModelo
  .filter(c => !c.doItem && c.tipo !== 'lista')
  .map(c => ({ label: c.rotulo, value: c.ref, icon: ICONE_DO_TIPO[c.tipo] })))

function opsDoCampo(ref: string): Op[] {
  const tipo = campoPorRef(ref)?.tipo
  return tipo === 'numero' || tipo === 'moeda' ? ['igual', 'diferente', 'maior', 'menor', 'maiorIgual', 'menorIgual'] : ['igual', 'diferente']
}

function novaLinha(): LinhaDeCondicao {
  return { campo: 'status', op: 'igual', valor: 'assinado' }
}

const condicao = ref<Condicao>({ conector: 'E', linhas: [novaLinha()] })
const editando = ref<HTMLElement | null>(null)

function aoTrocarCampo(l: LinhaDeCondicao) {
  if (!opsDoCampo(l.campo).includes(l.op)) l.op = 'igual'
  const tipo = campoPorRef(l.campo)?.tipo
  l.valor = l.campo === 'status' ? 'assinado' : tipo === 'pessoa' ? pessoas[0]!.id : tipo === 'numero' || tipo === 'moeda' ? 0 : ''
}

const opcoesDeStatus = computed<SelectItem[]>(() => (Object.keys(props.t.statusDoContrato) as StatusDoContrato[]).map(s => ({ label: props.t.statusDoContrato[s], value: s })))
const opcoesDePessoa = computed<SelectItem[]>(() => pessoas.map(p => ({ label: p.nome, value: p.id })))

const condicaoValida = computed(() => condicao.value.linhas.every(l => l.valor !== '' && l.valor !== null))

function inserirCondicao() {
  if (!artigo.value || modo.value !== 'editar') return
  const c = JSON.parse(JSON.stringify(condicao.value)) as Condicao
  if (editando.value) {
    const miolo = [...editando.value.children].filter(e => !(e as HTMLElement).dataset.ui).map(e => e.outerHTML).join('')
    const novo = htmlParaNo(blocoSe(c, miolo))
    editando.value.replaceWith(novo)
    destacar(novo)
    editando.value = null
    verificar()
    return
  }
  const r = cursorValido()
  const topo = blocoDoTopo(r.startContainer)
  let miolo = `<p class="mb-3 text-justify">${esc(props.t.modelo.textoPadraoSe)}</p>`
  if (!r.collapsed) {
    const tmp = document.createElement('div')
    tmp.appendChild(r.extractContents())
    if (tmp.textContent?.trim()) miolo = `<p class="mb-3 text-justify">${tmp.innerHTML}</p>`
  }
  const bloco = htmlParaNo(blocoSe(c, miolo))
  if (topo && topo !== artigo.value) topo.after(bloco)
  else artigo.value.appendChild(bloco)
  destacar(bloco)
  verificar()
}

function aoClicarNoDocumento(e: MouseEvent) {
  const alvo = (e.target as HTMLElement).closest('[data-ui="se"]') as HTMLElement | null
  if (!alvo) return
  const bloco = alvo.parentElement as HTMLElement
  const c = decodificar<Condicao>(bloco.dataset.se)
  if (!c) return
  condicao.value = c
  editando.value = bloco
  aba.value = 'condicao'
}

function cancelarEdicao() {
  editando.value = null
  condicao.value = { conector: 'E', linhas: [novaLinha()] }
}

/* ------------------------------ aba Repetição ------------------------------ */

const listas = computed(() => camposDoModelo.filter(c => c.tipo === 'lista'))
const repeticao = ref<Repeticao>({ campo: 'parcelas', colunas: ['numero', 'valor'] })
const listaEscolhida = computed(() => campoPorRef(repeticao.value.campo))
const opcoesDeLista = computed<SelectItem[]>(() => listas.value.map(l => ({ label: l.rotulo, value: l.ref, icon: ICONE_DO_TIPO.lista })))
const opcoesDeColuna = computed(() => (listaEscolhida.value?.colunas ?? []).map(c => ({ label: c.rotulo, value: c.ref })))
const linhasDaPrevia = computed(() => parcelasDoContrato(item.value.data, item.value.created_at))

function inserirRepeticao() {
  if (!artigo.value || modo.value !== 'editar' || !listaEscolhida.value || !repeticao.value.colunas.length) return
  const lista = listaEscolhida.value
  const partes = repeticao.value.colunas
    .map(ref => lista.colunas!.find(c => c.ref === ref)!)
    .map(col => `${esc(col.rotulo)}: ${etiquetaDeColuna(lista, col)}`)
  const bloco = htmlParaNo(blocoRepetir({ ...repeticao.value }, `<p class="mb-3">${partes.join(' · ')}</p>`))
  const topo = blocoDoTopo(cursorValido().startContainer)
  if (topo && topo !== artigo.value) topo.after(bloco)
  else artigo.value.appendChild(bloco)
  destacar(bloco)
  verificar()
}

/* ------------------------------ prévia ------------------------------ */

function avaliar(c: Condicao, it: ItemDoContrato) {
  const d = it.data as unknown as Record<string, unknown>
  const resultados = c.linhas.map((l) => {
    const atual = d[l.campo]
    const tipo = campoPorRef(l.campo)?.tipo
    const a = tipo === 'numero' || tipo === 'moeda' || tipo === 'pessoa' ? Number(atual) : String(atual)
    const b = tipo === 'numero' || tipo === 'moeda' || tipo === 'pessoa' ? Number(l.valor) : String(l.valor)
    switch (l.op) {
      case 'igual': return a === b
      case 'diferente': return a !== b
      case 'maior': return a > b
      case 'menor': return a < b
      case 'maiorIgual': return a >= b
      case 'menorIgual': return a <= b
    }
    return false
  })
  return c.conector === 'E' ? resultados.every(Boolean) : resultados.some(Boolean)
}

const MARCA = 'rounded-sm bg-primary/10 px-0.5 text-highlighted'

function renderizar(nos: NodeListOf<ChildNode> | ChildNode[], linha?: Record<string, unknown>): string {
  let html = ''
  for (const no of nos) {
    if (no.nodeType === 3) { html += esc(no.textContent ?? ''); continue }
    if (no.nodeType !== 1) continue
    const el = no as HTMLElement
    if (el.dataset.ui) continue
    if (el.dataset.var) { html += `<mark class="${MARCA}">${esc(valorDoCampo(el.dataset.var, el.dataset.fmt === '1'))}</mark>`; continue }
    if (el.dataset.col) { html += linha ? `<mark class="${MARCA}">${esc(valorDaColuna(el.dataset.col, linha))}</mark>` : ''; continue }
    if (el.dataset.se) {
      const c = decodificar<Condicao>(el.dataset.se)
      if (c && avaliar(c, item.value)) html += renderizar([...el.childNodes], linha)
      continue
    }
    if (el.dataset.repetir) {
      for (const l of linhasDaPrevia.value) html += renderizar([...el.childNodes], l as unknown as Record<string, unknown>)
      continue
    }
    const tag = el.tagName.toLowerCase()
    if (tag === 'br') { html += '<br>'; continue }
    html += `<${tag} class="${esc(el.className)}">${renderizar([...el.childNodes], linha)}</${tag}>`
  }
  return html
}

const htmlDaPrevia = computed(() => {
  void item.value
  void modo.value
  const fonte = conteudos.get(modeloId.value) ?? ''
  const tmp = document.createElement('div')
  tmp.innerHTML = fonte
  return renderizar([...tmp.childNodes])
})

/* ------------------------------ marcação gravada ------------------------------ */

function apelido(lista: string) {
  return lista.replace(/s$/, '')
}

function literal(l: LinhaDeCondicao) {
  const tipo = campoPorRef(l.campo)?.tipo
  return tipo === 'numero' || tipo === 'moeda' || tipo === 'pessoa' ? String(l.valor) : `'${l.valor}'`
}

function marcar(nos: ChildNode[], lista?: string): string {
  let s = ''
  for (const no of nos) {
    if (no.nodeType === 3) { s += (no.textContent ?? '').replace(/ /g, ' '); continue }
    if (no.nodeType !== 1) continue
    const el = no as HTMLElement
    if (el.dataset.ui) continue
    if (el.dataset.var) {
      const campo = campoPorRef(el.dataset.var)
      s += campo?.doItem ? `{{${el.dataset.var}}}` : `{{data.${el.dataset.var}${el.dataset.fmt === '1' ? '_formatted' : ''}}}`
      continue
    }
    if (el.dataset.col) { s += `{{= $${apelido(lista ?? el.dataset.lista ?? 'item')}.${el.dataset.col}}}`; continue }
    if (el.dataset.se) {
      const c = decodificar<Condicao>(el.dataset.se)
      const expr = (c?.linhas ?? []).map(l => `data.${l.campo} ${SIMBOLO[l.op]} ${literal(l)}`).join(c?.conector === 'OU' ? ' OR ' : ' AND ')
      s += `{{}}{{IF ${expr}}}\n${marcar([...el.childNodes], lista)}{{END-IF}}\n`
      continue
    }
    if (el.dataset.repetir) {
      const r = decodificar<Repeticao>(el.dataset.repetir)
      const ap = apelido(r?.campo ?? 'item')
      s += `{{}}{{FOR ${ap} IN data.${r?.campo}}}\n${marcar([...el.childNodes], r?.campo)}{{END-FOR ${ap}}}\n`
      continue
    }
    s += marcar([...el.childNodes], lista)
    if (el.tagName === 'P') s += '\n'
  }
  return s
}

const marcacao = ref('')
function atualizarMarcacao() {
  if (!artigo.value) return
  marcacao.value = marcar([...artigo.value.childNodes])
}

/* ------------------------------ verificação ------------------------------ */

const naoReconhecidas = ref<string[]>([])
function verificar() {
  if (!artigo.value) return
  const achados: string[] = []
  const walker = document.createTreeWalker(artigo.value, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const m = walker.currentNode.textContent?.match(/\{\{[^}]*\}\}/g)
    if (m) achados.push(...m)
  }
  naoReconhecidas.value = achados
  atualizarMarcacao()
}

function aoDigitar() {
  verificar()
}

/* ------------------------------ concluir ------------------------------ */

function concluir() {
  guardar()
  aberto.value = false
  toast.add({ title: props.t.modelo.salvo, description: modelo.value.nome, icon: 'i-lucide-check', color: 'success' })
}

function aoTentarFechar() {
  if (editando.value) cancelarEdicao()
  else if (verMarcacao.value) verMarcacao.value = false
}

const ferramentas = [
  ['i-lucide-undo-2', 'i-lucide-redo-2'],
  ['i-lucide-bold', 'i-lucide-italic', 'i-lucide-underline'],
  ['i-lucide-list', 'i-lucide-list-ordered'],
  ['i-lucide-align-left', 'i-lucide-align-center', 'i-lucide-align-justify'],
  ['i-lucide-table', 'i-lucide-image'],
]
</script>

<template>
  <UModal
    v-model:open="aberto"
    fullscreen
    :dismissible="false"
    :close="false"
    :title="t.modelo.titulo"
    :ui="{ content: 'flex flex-col bg-default' }"
    @close:prevent="aoTentarFechar"
  >
    <template #content>
      <div class="flex h-full min-h-0 flex-col">
        <!-- ─────────────── cabeçalho do ENSPACE ─────────────── -->
        <header class="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-default px-3 py-2">
          <UButton icon="i-lucide-arrow-left" :label="t.modelo.voltar" color="neutral" variant="ghost" size="sm" @click="concluir" />
          <USeparator orientation="vertical" class="h-6" />
          <div class="flex min-w-0 flex-1 items-center gap-2.5">
            <UIcon name="i-lucide-layout-template" class="size-5 shrink-0 text-primary" />
            <div class="min-w-0">
              <USelect v-model="modeloId" :items="opcoesDeModelo" variant="ghost" size="sm" class="min-w-72 font-semibold" :aria-label="t.modelo.modelo" />
              <p class="truncate px-2.5 text-xs text-muted">
                {{ t.modelo.contexto(categoria) }}
              </p>
            </div>
          </div>

          <UFieldGroup size="sm">
            <UButton icon="i-lucide-pencil" :label="t.modelo.editar" :color="modo === 'editar' ? 'primary' : 'neutral'" :variant="modo === 'editar' ? 'soft' : 'outline'" @click="modo = 'editar'" />
            <UButton icon="i-lucide-eye" :label="t.modelo.previa" :color="modo === 'previa' ? 'primary' : 'neutral'" :variant="modo === 'previa' ? 'soft' : 'outline'" @click="modo = 'previa'" />
          </UFieldGroup>

          <span class="flex items-center gap-2">
            <span class="text-xs text-muted">{{ t.modelo.previaCom }}</span>
            <USelect v-model="itemDaPrevia" :items="opcoesDeItem" size="sm" class="w-64" :aria-label="t.modelo.previaCom" />
          </span>

          <UButton
            icon="i-lucide-code-xml"
            :label="t.modelo.verMarcacao"
            color="neutral"
            :variant="verMarcacao ? 'soft' : 'outline'"
            size="sm"
            :aria-pressed="verMarcacao"
            @click="verMarcacao = !verMarcacao; atualizarMarcacao()"
          />
          <UButton icon="i-lucide-check" :label="t.modelo.concluir" size="sm" @click="concluir" />
        </header>

        <div class="flex min-h-0 flex-1">
          <!-- ─────────────── a página (simulação do ONLYOFFICE) ─────────────── -->
          <div class="flex min-w-0 flex-1 flex-col">
            <div class="flex shrink-0 flex-wrap items-center gap-3 border-b border-default bg-elevated/50 px-3 py-1.5" aria-hidden="true">
              <span class="w-24 rounded-sm border border-default bg-default px-1.5 py-0.5 text-xs text-muted">Calibri</span>
              <span class="w-10 rounded-sm border border-default bg-default px-1.5 py-0.5 text-xs text-muted">11</span>
              <span v-for="(g, i) in ferramentas" :key="i" class="flex items-center gap-2 border-l border-default pl-3">
                <UIcon v-for="ic in g" :key="ic" :name="ic" class="size-4 text-toned" />
              </span>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto bg-accented/40 px-4 py-6">
              <p class="mx-auto mb-3 flex max-w-[48rem] items-center gap-1.5 text-xs text-muted">
                <UIcon name="i-lucide-construction" class="size-3.5" />
                {{ t.modelo.simulacao }}
              </p>
              <!-- A página de edição fica montada; na prévia ela só se esconde. -->
              <article
                v-show="modo === 'editar'"
                ref="artigo"
                class="mx-auto min-h-[60rem] max-w-[48rem] bg-default px-16 py-14 font-serif text-[13px] leading-relaxed text-default shadow-md ring-1 ring-default/50 focus:outline-none"
                contenteditable="true"
                spellcheck="true"
                :lang="idioma"
                @input="aoDigitar"
                @click="aoClicarNoDocumento"
              />
              <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-1"
              >
                <article
                  v-if="modo === 'previa'"
                  class="mx-auto min-h-[60rem] max-w-[48rem] bg-default px-16 py-14 font-serif text-[13px] leading-relaxed text-default shadow-md ring-1 ring-primary/40"
                  v-html="htmlDaPrevia"
                />
              </Transition>
            </div>

            <!-- a marcação gravada -->
            <Transition
              enter-active-class="transition-[max-height,opacity] duration-200 ease-out"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="max-h-72 opacity-100"
              leave-active-class="transition-[max-height,opacity] duration-150 ease-in"
              leave-from-class="max-h-72 opacity-100"
              leave-to-class="max-h-0 opacity-0"
            >
              <section v-if="verMarcacao" class="max-h-72 shrink-0 overflow-hidden border-t border-default">
                <div class="flex items-center justify-between px-4 py-2">
                  <p class="text-sm font-semibold text-highlighted">
                    {{ t.modelo.marcacaoTitulo }}
                    <span class="ml-2 text-xs font-normal text-muted">{{ t.modelo.marcacaoAjuda }}</span>
                  </p>
                  <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.item.fechar" @click="verMarcacao = false" />
                </div>
                <pre class="max-h-56 overflow-auto whitespace-pre-wrap bg-elevated/60 px-4 py-3 font-mono text-xs text-toned">{{ marcacao }}</pre>
              </section>
            </Transition>

            <footer class="flex shrink-0 items-center gap-2 border-t border-default px-3 py-1.5 text-xs" role="status" aria-live="polite">
              <template v-if="!naoReconhecidas.length">
                <UIcon name="i-lucide-circle-check" class="size-4 text-success" />
                <span class="text-success">{{ t.modelo.verificacaoOk }}</span>
              </template>
              <template v-else>
                <UIcon name="i-lucide-triangle-alert" class="size-4 text-warning" />
                <span class="text-warning">{{ t.modelo.verificacaoErro(naoReconhecidas.length) }}</span>
                <span class="truncate text-muted">{{ t.modelo.naoReconhecida(naoReconhecidas[0]!) }}</span>
              </template>
            </footer>
          </div>

          <!-- ─────────────── lateral: campos, condição, repetição ─────────────── -->
          <aside class="flex w-[23rem] shrink-0 flex-col border-l border-default">
            <div class="border-b border-default px-3 pt-2">
              <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" class="w-full" />
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto p-4">
              <!-- Campos -->
              <div v-if="aba === 'campos'" class="space-y-4">
                <p class="text-xs text-muted">
                  {{ t.modelo.inserirDica }}
                </p>
                <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.modelo.buscarCampo" size="sm" class="w-full" />
                <div class="flex items-center justify-between gap-2">
                  <USwitch v-model="formatado" :label="t.modelo.formatado" size="sm" />
                  <UTooltip :text="t.modelo.formatadoAjuda">
                    <UButton icon="i-lucide-circle-help" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.formatadoAjuda" />
                  </UTooltip>
                </div>

                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                >
                  <div v-if="colunasNoCursor" class="rounded-md border border-info/40 bg-info/5 p-2">
                    <p class="mb-1.5 px-1 text-xs font-medium text-info">
                      {{ t.modelo.cabecalhoRepetir(colunasNoCursor.lista.rotulo) }}
                    </p>
                    <button
                      v-for="col in colunasNoCursor.colunas"
                      :key="col.ref"
                      type="button"
                      class="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-none"
                      :disabled="modo !== 'editar'"
                      @mousedown.prevent
                      @click="inserirColuna(colunasNoCursor.lista, col)"
                    >
                      <UIcon :name="ICONE_DO_TIPO[col.tipo]" class="size-4 shrink-0 text-info" />
                      <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ col.rotulo }}</span>
                    </button>
                  </div>
                </Transition>

                <div v-for="grupo in [{ titulo: t.modelo.camposDaCategoria, lista: daCategoria }, { titulo: t.modelo.dadosDoItem, lista: doItem }]" :key="grupo.titulo">
                  <p v-if="grupo.lista.length" class="mb-1 px-1 text-xs font-medium uppercase tracking-wide text-muted">
                    {{ grupo.titulo }}
                  </p>
                  <button
                    v-for="campo in grupo.lista"
                    :key="campo.ref"
                    type="button"
                    class="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-none disabled:opacity-50"
                    :disabled="modo !== 'editar'"
                    @mousedown.prevent
                    @click="inserirCampo(campo)"
                  >
                    <UIcon :name="ICONE_DO_TIPO[campo.tipo]" class="size-4 shrink-0 text-muted group-hover:text-primary" />
                    <span class="min-w-0 flex-1">
                      <span class="block truncate text-sm text-highlighted">{{ campo.rotulo }}</span>
                      <span class="block truncate text-xs text-muted">{{ valorDoCampo(campo.ref, formatado || !!campo.doItem) || '-' }}</span>
                    </span>
                    <UIcon name="i-lucide-plus" class="size-4 shrink-0 text-dimmed opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                </div>
                <p v-if="!daCategoria.length && !doItem.length" class="px-1 text-sm text-muted">
                  {{ t.modelo.nenhumCampo }}
                </p>
              </div>

              <!-- Condição -->
              <div v-else-if="aba === 'condicao'" class="space-y-4">
                <p class="text-sm font-medium text-highlighted">
                  {{ t.modelo.cabecalhoSe('…').replace(' …', '') }}
                </p>

                <TransitionGroup
                  tag="div"
                  class="space-y-3"
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                  leave-active-class="transition duration-100 ease-in"
                  leave-to-class="opacity-0"
                >
                  <div v-for="(l, i) in condicao.linhas" :key="i" class="space-y-2 rounded-md border border-default p-3">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-medium text-muted">{{ i === 0 ? t.modelo.campo : (condicao.conector === 'E' ? t.modelo.juntaE : t.modelo.juntaOU) }}</span>
                      <UButton v-if="condicao.linhas.length > 1" icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.removerCondicao" @click="condicao.linhas.splice(i, 1)" />
                    </div>
                    <USelect v-model="l.campo" :items="camposDeCondicao" size="sm" class="w-full" :aria-label="t.modelo.campo" @update:model-value="aoTrocarCampo(l)" />
                    <USelect v-model="l.op" :items="opsDoCampo(l.campo).map(o => ({ label: t.modelo.ops[o], value: o }))" size="sm" class="w-full" :aria-label="t.modelo.operador" />
                    <USelect v-if="l.campo === 'status'" v-model="l.valor" :items="opcoesDeStatus" size="sm" class="w-full" :aria-label="t.modelo.valor" />
                    <USelect v-else-if="campoPorRef(l.campo)?.tipo === 'pessoa'" v-model="l.valor" :items="opcoesDePessoa" size="sm" class="w-full" :aria-label="t.modelo.valor" />
                    <UInputNumber
                      v-else-if="campoPorRef(l.campo)?.tipo === 'moeda' || campoPorRef(l.campo)?.tipo === 'numero'"
                      v-model="l.valor"
                      :format-options="campoPorRef(l.campo)?.tipo === 'moeda' ? { style: 'currency', currency: 'BRL' } : undefined"
                      :locale="idioma"
                      size="sm"
                      class="w-full"
                      :aria-label="t.modelo.valor"
                    />
                    <UInput v-else v-model="l.valor" size="sm" class="w-full" :aria-label="t.modelo.valor" />
                  </div>
                </TransitionGroup>

                <div class="flex flex-wrap items-center gap-2">
                  <UButton icon="i-lucide-plus" :label="t.modelo.adicionarCondicao" color="neutral" variant="outline" size="sm" @click="condicao.linhas.push(novaLinha())" />
                  <USelect
                    v-if="condicao.linhas.length > 1"
                    v-model="condicao.conector"
                    :items="[{ label: t.modelo.conector.E, value: 'E' }, { label: t.modelo.conector.OU, value: 'OU' }]"
                    size="sm"
                    class="min-w-48"
                    :aria-label="t.modelo.precisaValer"
                  />
                </div>

                <UAlert color="neutral" variant="subtle" icon="i-lucide-message-square-text" :description="t.modelo.resumoCondicao(frase(condicao))" />
                <p v-if="temSelecao && !editando" class="text-xs text-muted">
                  {{ t.modelo.selecaoVaiParaDentro }}
                </p>

                <div class="flex gap-2">
                  <UButton
                    :icon="editando ? 'i-lucide-check' : 'i-lucide-split'"
                    :label="editando ? t.modelo.atualizarCondicao : t.modelo.inserirCondicao"
                    :disabled="!condicaoValida || modo !== 'editar'"
                    @mousedown.prevent
                    @click="inserirCondicao"
                  />
                  <UButton v-if="editando" :label="t.campo.cancelar" color="neutral" variant="outline" @click="cancelarEdicao" />
                </div>
              </div>

              <!-- Repetição -->
              <div v-else class="space-y-4">
                <UFormField :label="t.modelo.lista">
                  <USelect v-model="repeticao.campo" :items="opcoesDeLista" size="sm" class="w-full" />
                </UFormField>
                <UFormField :label="t.modelo.colunas" :error="!repeticao.colunas.length ? t.modelo.semColuna : undefined">
                  <UCheckboxGroup v-model="repeticao.colunas" :items="opcoesDeColuna" size="sm" class="mt-1" />
                </UFormField>
                <UAlert color="neutral" variant="subtle" icon="i-lucide-repeat" :description="t.modelo.resumoRepeticao(linhasDaPrevia.length, listaEscolhida?.rotulo ?? '')" />
                <UButton
                  icon="i-lucide-repeat"
                  :label="t.modelo.inserirRepeticao"
                  :disabled="!repeticao.colunas.length || modo !== 'editar'"
                  @mousedown.prevent
                  @click="inserirRepeticao"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </template>
  </UModal>
</template>
