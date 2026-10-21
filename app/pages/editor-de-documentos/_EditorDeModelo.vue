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
 *   para a área de transferência, e a pessoa cola com Ctrl+V;
 * - condição e repetição: o botão de chave copia um esqueleto
 *   (`{{}}{{IF variavel === 'valor'}} conteúdo {{END-IF}}`) que a pessoa
 *   reescreve à mão;
 * - não existe prévia com dados reais.
 *
 * O documento é o ONLYOFFICE: nada se monta DENTRO dele (rodada 8, decisão da
 * redatora). Tudo se monta na lateral, e o documento recebe o resultado:
 * - Campos: 1 clique insere no cursor; a pessoa continua digitando livre, e a
 *   marcação digitada à mão também vale (a verificação só aponta o que não
 *   existe);
 * - Condições: a lista do que o modelo já tem, com o selo "Aparece" ou "Não
 *   aparece" para o item da prévia, Localizar, Editar, Tirar a condição e
 *   Excluir; o montador lê como frase, tem "Todas" ou "Qualquer uma", grupo de
 *   1 nível, "é um destes", "está vazio", "Senão, se…" e "Nos demais casos";
 * - Repetições: a mesma lista; formato (tabela, lista numerada, lista com
 *   marcadores, texto corrido), colunas em ordem, numeração, total, filtro com
 *   o mesmo montador, ordem e o texto da lista vazia.
 *
 * Pesquisa: PESQUISA.md, "Condição e repetição no modelo (2026-10-21)".
 * A página é simulação do ONLYOFFICE (contenteditable). Etiquetas e blocos são
 * elementos não editáveis dentro dela, como os controles de conteúdo do
 * ONLYOFFICE. Nada é gravado: Concluir mostra o aviso e fecha.
 */
import type { DropdownMenuItem, SelectItem } from '@nuxt/ui'
import type { Textos } from './textos'
import {
  type CampoDoModelo, type ColunaDoModelo, type DadosDoContrato, type ItemDoContrato, type StatusDoContrato,
  type TipoNoModelo,
  camposDoModelo, modelos, parcelasDoContrato, pessoa, pessoas,
} from './mocks'
import {
  type CampoDeRegra, type Condicao, type Regra, type Repeticao, type Teste,
  avaliarTeste, codificar, copia, decodificar, marcarPartes, marcarTeste, novoTeste, parteQueAparece,
  SEM_VALOR, testeCompleto,
} from './regras'
import { useDocumentos } from './estado'
import EditorDeRegras from './_EditorDeRegras.vue'

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

/* ------------------------------ campos e valores ------------------------------ */

const CLASSE_ETIQUETA = 'mx-px inline-flex items-center rounded-sm bg-primary/10 px-1 font-sans text-[11.5px] font-medium text-primary ring-1 ring-primary/30 align-baseline select-all'
const CLASSE_COLUNA = 'mx-px inline-flex items-center rounded-sm bg-info/10 px-1 font-sans text-[11.5px] font-medium text-info ring-1 ring-info/30 align-baseline select-all'
const CLASSE_BLOCO_SE = 'my-3 rounded-md border border-dashed border-warning/60 bg-warning/5 px-3 py-2'
const CLASSE_PARTE = 'mb-2 border-l-2 border-warning/40 pl-2.5'
const CLASSE_BLOCO_REP = 'my-3 rounded-md border border-dashed border-info/60 bg-info/5 px-3 py-2'
const CLASSE_PARTE_VAZIA = 'mt-1 border-l-2 border-info/40 pl-2.5'
const CLASSE_CABECALHO = 'mb-1 select-none font-sans text-[11px] font-semibold'
const CLASSE_FIM = 'mt-1 select-none font-sans text-[10.5px] text-muted'
const CLASSE_TABELA = 'mb-2 w-full border-collapse text-[12.5px]'
const CLASSE_TH = 'border border-default/80 bg-elevated/60 px-2 py-1 text-left font-semibold'
const CLASSE_TD = 'border border-default/80 px-2 py-1'

const ICONE_DO_TIPO: Record<string, string> = {
  texto: 'i-lucide-type',
  opcao: 'i-lucide-list',
  numero: 'i-lucide-hash',
  moeda: 'i-lucide-circle-dollar-sign',
  pessoa: 'i-lucide-user',
  data: 'i-lucide-calendar',
  lista: 'i-lucide-rows-3',
}

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

function etiquetaDeNumero(lista: string) {
  return `<span contenteditable="false" data-col="__n" data-lista="${lista}" class="${CLASSE_COLUNA}">${esc(props.t.modelo.colunaNumero)}</span>`
}

function etiquetaDeTotal(lista: CampoDoModelo, col: ColunaDoModelo) {
  return `<span contenteditable="false" data-total="${col.ref}" data-lista="${lista.ref}" class="${CLASSE_COLUNA}">Σ ${esc(col.rotulo)}</span>`
}

/** Os campos que a condição pode testar: todos menos a lista. */
const camposDeCondicao = computed<CampoDeRegra[]>(() => camposDoModelo
  .filter(c => c.tipo !== 'lista')
  .map(c => ({ ref: c.ref, rotulo: c.rotulo, tipo: c.tipo as TipoNoModelo })))

function colunasDe(lista: string): CampoDeRegra[] {
  return (campoPorRef(lista)?.colunas ?? []).map(c => ({ ref: c.ref, rotulo: c.rotulo, tipo: c.tipo }))
}

function opcoesDe(ref: string): SelectItem[] | null {
  if (ref === 'status') return (Object.keys(props.t.statusDoContrato) as StatusDoContrato[]).map(s => ({ label: props.t.statusDoContrato[s], value: s }))
  if (ref === 'responsavel') return pessoas.map(p => ({ label: p.nome, value: p.id }))
  if (ref === 'situacao') return (Object.keys(props.t.modelo.situacaoDaParcela) as (keyof Textos['modelo']['situacaoDaParcela'])[]).map(s => ({ label: props.t.modelo.situacaoDaParcela[s], value: s }))
  return null
}

const moeda = (v: number) => new Intl.NumberFormat(props.idioma, { style: 'currency', currency: 'BRL' }).format(v)
const dataCurta = (v: Date) => new Intl.DateTimeFormat(props.idioma, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(v)

function rotuloDeUmValor(campo: CampoDeRegra | undefined, v: string | number | null): string {
  if (v === null || v === '') return '…'
  if (!campo) return String(v)
  const op = opcoesDe(campo.ref)
  if (op) return String(op.find(o => (o as { value: unknown }).value === v)?.label ?? v)
  if (campo.tipo === 'moeda') return moeda(Number(v))
  if (campo.tipo === 'numero') return new Intl.NumberFormat(props.idioma).format(Number(v))
  if (campo.tipo === 'data') {
    const [a, m, d] = String(v).split('-').map(Number)
    return a && m && d ? dataCurta(new Date(a, m - 1, d)) : String(v)
  }
  return `"${v}"`
}

function fraseDaRegra(r: Regra, campos: CampoDeRegra[]): string {
  const campo = campos.find(c => c.ref === r.campo)
  if (!campo || !r.op) return '…'
  const op = props.t.modelo.ops[r.op]
  if (SEM_VALOR.includes(r.op)) return `${campo.rotulo} ${op}`
  const valores = Array.isArray(r.valor) ? r.valor : [r.valor]
  const lista = new Intl.ListFormat(props.idioma, { type: 'disjunction' }).format(valores.map(v => rotuloDeUmValor(campo, v)))
  return `${campo.rotulo} ${op} ${valores.length ? lista : '…'}`
}

function fraseDoTeste(teste: Teste, campos: CampoDeRegra[]): string {
  const junta = (c: 'E' | 'OU') => ` ${c === 'E' ? props.t.modelo.juntaE : props.t.modelo.juntaOU} `
  return teste.itens
    .map(i => (i.tipo === 'regra' ? fraseDaRegra(i, campos) : `(${i.regras.map(r => fraseDaRegra(r, campos)).join(junta(i.conector))})`))
    .join(junta(teste.conector))
}

/* ------------------------------ os blocos no documento ------------------------------ */

let contador = 0
function novoId(prefixo: string) {
  contador += 1
  return `${prefixo}${contador}`
}

const p = (html: string) => `<p class="mb-3 text-justify">${html}</p>`

function cabecalhoDaParte(c: Condicao, parte: number | 'senao') {
  if (parte === 'senao') return props.t.modelo.cabecalhoSenao
  const frase = fraseDoTeste(c.variantes[parte]!, camposDeCondicao.value)
  return parte === 0 ? props.t.modelo.cabecalhoSe(frase) : props.t.modelo.cabecalhoSenaoSe(frase)
}

function htmlDaParte(c: Condicao, parte: number | 'senao', miolo: string) {
  return `<div data-parte="${parte}" class="${CLASSE_PARTE}">`
    + `<div contenteditable="false" data-ui="parte" class="${CLASSE_CABECALHO} text-warning">◆ ${esc(cabecalhoDaParte(c, parte))}</div>`
    + miolo
    + '</div>'
}

function blocoSe(c: Condicao, miolos: string[], mioloSenao: string | null, id = novoId('c')) {
  return `<div data-se="${codificar(c)}" data-id="${id}" class="${CLASSE_BLOCO_SE}">`
    + c.variantes.map((_, i) => htmlDaParte(c, i, miolos[i] ?? p(esc(props.t.modelo.textoPadraoSe)))).join('')
    + (c.senao ? htmlDaParte(c, 'senao', mioloSenao ?? p(esc(props.t.modelo.textoPadraoSenao))) : '')
    + `<div contenteditable="false" data-ui="fim" class="${CLASSE_FIM}">${esc(props.t.modelo.fimSe)}</div></div>`
}

function cabecalhoDaRepeticao(r: Repeticao) {
  const lista = campoPorRef(r.campo)
  const colunas = colunasDe(r.campo)
  const partes = [props.t.modelo.cabecalhoRepetir(lista?.rotulo ?? r.campo)]
  if (r.filtro) partes.push(props.t.modelo.cabecalhoFiltro(fraseDoTeste(r.filtro, colunas)))
  if (r.ordem) {
    const col = colunas.find(c => c.ref === r.ordem!.coluna)
    partes.push(props.t.modelo.cabecalhoOrdem(`${col?.rotulo ?? r.ordem.coluna} ${r.ordem.sentido === 'asc' ? '↑' : '↓'}`))
  }
  return partes.join(' · ')
}

/** O corpo do bloco (tabela, lista ou parágrafo), com a linha modelo marcada. */
function corpoDaRepeticao(r: Repeticao, titulos: Record<string, string> = {}) {
  const lista = campoPorRef(r.campo)!
  const cols = r.colunas.map(ref => lista.colunas!.find(c => c.ref === ref)!).filter(Boolean)
  if (r.formato === 'tabela') {
    const numerar = r.numerar
    const th = (ref: string, txt: string) => `<th data-coluna="${ref}" class="${CLASSE_TH}">${esc(titulos[ref] ?? txt)}</th>`
    const cabeca = (numerar ? th('__n', props.t.modelo.colunaNumero) : '') + cols.map(c => th(c.ref, c.rotulo)).join('')
    const linha = (numerar ? `<td class="${CLASSE_TD}">${etiquetaDeNumero(r.campo)}</td>` : '') + cols.map(c => `<td class="${CLASSE_TD}">${etiquetaDeColuna(lista, c)}</td>`).join('')
    let rodape = ''
    const colTotal = r.total ? cols.find(c => c.ref === r.total) : null
    if (colTotal) {
      const celulas = [...(numerar ? ['__n'] : []), ...cols.map(c => c.ref)].map((ref, i) => {
        if (ref === colTotal.ref) return `<td class="${CLASSE_TD} font-semibold">${etiquetaDeTotal(lista, colTotal)}</td>`
        return `<td class="${CLASSE_TD} font-semibold">${i === 0 ? esc(props.t.modelo.rotuloTotal) : ''}</td>`
      })
      rodape = `<tfoot><tr>${celulas.join('')}</tr></tfoot>`
    }
    return `<table class="${CLASSE_TABELA}"><thead><tr>${cabeca}</tr></thead><tbody><tr data-linha-modelo="1">${linha}</tr></tbody>${rodape}</table>`
  }
  const partes = cols.map(c => `${esc(c.rotulo)}: ${etiquetaDeColuna(lista, c)}`).join(', ')
  if (r.formato === 'numerada' || r.formato === 'marcadores') {
    const tag = r.formato === 'numerada' ? 'ol' : 'ul'
    return `<${tag} class="${r.formato === 'numerada' ? 'list-decimal' : 'list-disc'} mb-2 pl-6"><li data-linha-modelo="1">${partes}</li></${tag}>`
  }
  return `<p data-linha-modelo="1" class="mb-2">${r.numerar ? `${etiquetaDeNumero(r.campo)}. ` : ''}${partes}</p>`
}

/** A parte "Se a lista estiver vazia": o texto fica no documento, como nas partes da condição. */
function htmlDaParteVazia(miolo: string) {
  return `<div data-vazia="1" class="${CLASSE_PARTE_VAZIA}">`
    + `<div contenteditable="false" data-ui="vazia" class="${CLASSE_CABECALHO} text-info">◇ ${esc(props.t.modelo.parteVazia)}</div>`
    + miolo
    + '</div>'
}

function blocoRepetir(r: Repeticao, corpo: string, id = novoId('r'), mioloVazio: string | null = null) {
  const lista = campoPorRef(r.campo)
  return `<div data-repetir="${codificar(r)}" data-id="${id}" class="${CLASSE_BLOCO_REP}">`
    + `<div contenteditable="false" data-ui="repetir" class="${CLASSE_CABECALHO} text-info">↻ ${esc(cabecalhoDaRepeticao(r))}</div>`
    + corpo
    + (r.vazio ? htmlDaParteVazia(mioloVazio ?? p(esc(props.t.modelo.vazioPadrao(lista?.rotulo ?? r.campo)))) : '')
    + `<div contenteditable="false" data-ui="fim" class="${CLASSE_FIM}">${esc(props.t.modelo.fimRepetir)}</div></div>`
}

function repeticaoPadrao(): Repeticao {
  return {
    campo: 'parcelas',
    formato: 'tabela',
    colunas: ['vencimento', 'valor'],
    numerar: true,
    total: 'valor',
    filtro: null,
    ordem: null,
    vazio: true,
  }
}

const c = (ref: string, fmt = true) => etiqueta(campoPorRef(ref)!, fmt)

/** O conteúdo de partida de cada modelo (o mesmo contrato do mock). */
function conteudoInicial(id: number): string {
  const titulo = (txt: string) => `<p class="mb-5 text-center text-[15px] font-bold tracking-wide">${txt}</p>`
  if (id === 11) {
    const garantia: Condicao = {
      variantes: [
        { conector: 'E', itens: [{ tipo: 'regra', campo: 'valor', op: 'maior', valor: 150000 }] },
        { conector: 'E', itens: [{ tipo: 'regra', campo: 'valor', op: 'maior', valor: 50000 }] },
      ],
      senao: true,
    }
    return titulo('CONTRATO DE PRESTAÇÃO DE SERVIÇOS')
      + p(`CONTRATANTE: ${c('contratante')}, pessoa jurídica de direito privado, doravante denominada CONTRATANTE.`)
      + p(`CLÁUSULA 1. OBJETO. O presente contrato tem por objeto: ${c('objeto')}.`)
      + p(`CLÁUSULA 2. PREÇO. Pelos serviços, a CONTRATANTE pagará o valor total de ${c('valor')}, nas parcelas abaixo:`)
      + blocoRepetir(repeticaoPadrao(), corpoDaRepeticao(repeticaoPadrao()))
      + p(`CLÁUSULA 3. VIGÊNCIA. Este contrato vigora por ${c('vigencia_meses')} meses a partir da assinatura.`)
      + blocoSe(garantia, [
        p('CLÁUSULA 4. GARANTIA. Por se tratar de contrato acima de R$ 150.000,00, a CONTRATADA apresentará seguro-garantia de 5% do valor total.'),
        p('CLÁUSULA 4. GARANTIA. A CONTRATADA apresentará caução de 2% do valor total.'),
      ], p('CLÁUSULA 4. GARANTIA. Fica dispensada a apresentação de garantia.'))
      + p(`CLÁUSULA 5. FORO. Fica eleito o foro da comarca de Belo Horizonte. Referência interna: ${c('reference')}.`)
  }
  const nome = modelos.find(m => m.id === id)?.nome.toUpperCase() ?? ''
  return titulo(nome) + p(`CONTRATANTE: ${c('contratante')}.`) + p('Escreva aqui o texto do modelo.')
}

/* ------------------------------ o documento ------------------------------ */

const artigo = ref<HTMLElement | null>(null)
const modo = ref<'editar' | 'previa'>('editar')
const verMarcacao = ref(false)
/** Sobe a cada mudança no documento: as listas da lateral releem os blocos. */
const versao = ref(0)

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
  edicaoSe.value = null
  edicaoRep.value = null
  await nextTick()
  carregar()
})

watch(modeloId, async (novo, antigo) => {
  if (artigo.value && modo.value === 'editar') conteudos.set(antigo, artigo.value.innerHTML)
  modo.value = 'editar'
  edicaoSe.value = null
  edicaoRep.value = null
  await nextTick()
  carregar()
})

watch(modo, (_m, antes) => {
  if (antes === 'editar' && artigo.value) conteudos.set(modeloId.value, artigo.value.innerHTML)
})

/* ------------------------- cursor (onde inserir) ------------------------- */

let ultimoCursor: Range | null = null
const listaNoCursor = ref<string | null>(null)
const blocoNoCursor = ref<string | null>(null)
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
  blocoNoCursor.value = (el?.closest('[data-id]') as HTMLElement | null)?.dataset.id ?? null
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

function htmlDoNo(n: ChildNode) {
  return n.nodeType === 3 ? esc(n.textContent ?? '') : (n as HTMLElement).outerHTML ?? ''
}

function blocoPorId(id: string) {
  return artigo.value?.querySelector(`[data-id="${id}"]`) as HTMLElement | null
}

/** Põe um bloco novo no documento: depois do parágrafo do cursor, ou no lugar dele se ficou vazio. */
function colocarBloco(bloco: HTMLElement, r: Range) {
  const art = artigo.value!
  const topo = blocoDoTopo(r.startContainer)
  if (topo && topo !== art) {
    const vazio = topo.tagName === 'P' && !topo.textContent?.trim() && !topo.querySelector('[data-var],[data-col]')
    if (vazio) topo.replaceWith(bloco)
    else topo.after(bloco)
  }
  else {
    art.appendChild(bloco)
  }
  bloco.scrollIntoView({ block: 'center', behavior: 'smooth' })
  destacar(bloco)
}

function localizar(id: string) {
  const el = blocoPorId(id)
  if (!el) return
  el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  destacar(el)
}

/* ------------------------------ abas ------------------------------ */

const aba = ref('campos')
const abas = computed(() => [
  { label: props.t.modelo.abas.campos, value: 'campos', icon: 'i-lucide-braces' },
  { label: props.t.modelo.abas.condicao, value: 'condicao', icon: 'i-lucide-split', badge: condicoesDoModelo.value.length || undefined },
  { label: props.t.modelo.abas.repeticao, value: 'repeticao', icon: 'i-lucide-repeat', badge: repeticoesDoModelo.value.length || undefined },
])

/* ------------------------------ aba Campos ------------------------------ */

const busca = ref('')
const formatado = ref(true)

const itemDaPrevia = ref<number>(142)
const opcoesDeItem = computed<SelectItem[]>(() => itens.value.map(i => ({ label: `${i.reference} · ${i.data.contratante}`, value: i.id })))
const item = computed<ItemDoContrato>(() => itens.value.find(i => i.id === itemDaPrevia.value) ?? itens.value[0]!)

function valorDoCampo(ref: string, fmt: boolean, it: ItemDoContrato = item.value): string {
  const d = it.data as DadosDoContrato & Record<string, unknown>
  switch (ref) {
    case 'reference': return it.reference
    case 'created_at': return fmt ? dataCurta(new Date(it.created_at)) : new Date(it.created_at).toISOString()
    case 'request_email': return it.request_email ?? ''
    case 'status': return fmt ? props.t.statusDoContrato[d.status] : d.status
    case 'valor': return fmt ? moeda(d.valor) : String(d.valor)
    case 'responsavel': return fmt ? pessoa(d.responsavel).nome : String(d.responsavel)
    case 'vigencia_meses': return String(d.vigencia_meses)
    default: return String(d[ref] ?? '')
  }
}

/** O valor cru de um campo do item, para avaliar a condição. */
function lerDoItem(ref: string, it: ItemDoContrato = item.value): unknown {
  if (ref === 'reference') return it.reference
  if (ref === 'created_at') return it.created_at
  if (ref === 'request_email') return it.request_email
  return (it.data as unknown as Record<string, unknown>)[ref]
}

const tipoDoCampo = (ref: string) => campoPorRef(ref)?.tipo as TipoNoModelo | undefined

function valorDaColuna(col: string, linha: Record<string, unknown>): string {
  const v = linha[col]
  if (v instanceof Date) return dataCurta(v)
  if (col === 'valor') return moeda(Number(v))
  if (col === 'situacao') return props.t.modelo.situacaoDaParcela[v as 'aberta' | 'paga'] ?? String(v)
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
  const espaco = document.createTextNode(' ')
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

/* ------------------------------ o que o modelo já tem ------------------------------ */

const condicoesDoModelo = computed(() => {
  void versao.value
  if (!artigo.value) return []
  return [...artigo.value.querySelectorAll<HTMLElement>('[data-se]')]
    .map(el => ({ id: el.dataset.id!, cond: decodificar<Condicao>(el.dataset.se)! }))
    .filter(b => b.id && b.cond)
})

const repeticoesDoModelo = computed(() => {
  void versao.value
  if (!artigo.value) return []
  return [...artigo.value.querySelectorAll<HTMLElement>('[data-repetir]')]
    .map(el => ({ id: el.dataset.id!, rep: decodificar<Repeticao>(el.dataset.repetir)! }))
    .filter(b => b.id && b.rep)
})

function rotuloDaParte(parte: number | 'senao') {
  if (parte === 'senao') return props.t.modelo.parteSenao
  return parte === 0 ? props.t.modelo.parteSe : props.t.modelo.parteSenaoSe + (parte > 1 ? ` (${parte})` : '')
}

function parteDoItem(cond: Condicao) {
  return parteQueAparece(cond, ref => lerDoItem(ref), tipoDoCampo)
}

/* ------------------------------ aba Condições ------------------------------ */

interface EdicaoSe { id: string | null, cond: Condicao, origem: (number | null)[], comSelecao: boolean }
const edicaoSe = ref<EdicaoSe | null>(null)
let rangeDaNova: Range | null = null

function novaCondicao() {
  rangeDaNova = ultimoCursor?.cloneRange() ?? null
  edicaoSe.value = { id: null, cond: { variantes: [novoTeste()], senao: false }, origem: [null], comSelecao: !!rangeDaNova && !rangeDaNova.collapsed }
}

function editarCondicao(id: string) {
  const el = blocoPorId(id)
  const cond = decodificar<Condicao>(el?.dataset.se)
  if (!cond) return
  edicaoSe.value = { id, cond: copia(cond), origem: cond.variantes.map((_, i) => i), comSelecao: false }
  aba.value = 'condicao'
  localizar(id)
}

function adicionarSenaoSe() {
  edicaoSe.value?.cond.variantes.push(novoTeste())
  edicaoSe.value?.origem.push(null)
}

function removerParte(i: number) {
  edicaoSe.value?.cond.variantes.splice(i, 1)
  edicaoSe.value?.origem.splice(i, 1)
}

const condicaoCompleta = computed(() => !!edicaoSe.value && edicaoSe.value.cond.variantes.every(testeCompleto))

const resultadoDaEdicao = computed(() => {
  if (!edicaoSe.value || !condicaoCompleta.value) return null
  const parte = parteDoItem(edicaoSe.value.cond)
  return parte === null ? null : rotuloDaParte(parte)
})

/** O conteúdo de cada parte de um bloco, sem o cabeçalho. */
function mioloDasPartes(el: HTMLElement) {
  const mapa = new Map<string, string>()
  el.querySelectorAll<HTMLElement>(':scope > [data-parte]').forEach((parte) => {
    mapa.set(parte.dataset.parte!, [...parte.childNodes].filter(n => !(n as HTMLElement).dataset?.ui).map(htmlDoNo).join(''))
  })
  return mapa
}

function salvarCondicao() {
  const e = edicaoSe.value
  if (!e || !artigo.value || modo.value !== 'editar' || !condicaoCompleta.value) return
  const cond = copia(e.cond)
  if (e.id) {
    const el = blocoPorId(e.id)
    if (!el) return
    const antes = mioloDasPartes(el)
    const miolos = e.origem.map(o => (o === null ? p(esc(props.t.modelo.textoPadraoSe)) : antes.get(String(o)) ?? p(esc(props.t.modelo.textoPadraoSe))))
    const novo = htmlParaNo(blocoSe(cond, miolos, antes.get('senao') ?? null, e.id))
    el.replaceWith(novo)
    destacar(novo)
  }
  else {
    const r = rangeDaNova && artigo.value.contains(rangeDaNova.startContainer) ? rangeDaNova : cursorValido()
    const selecionados = r.collapsed ? [] : paragrafosDaSelecao(r)
    if (selecionados.length) {
      // A condição leva os parágrafos inteiros do trecho e fica no lugar deles.
      const bloco = htmlParaNo(blocoSe(cond, [selecionados.map(el => el.outerHTML).join('')], null))
      selecionados[0]!.before(bloco)
      selecionados.forEach(el => el.remove())
      bloco.scrollIntoView({ block: 'center', behavior: 'smooth' })
      destacar(bloco)
    }
    else {
      colocarBloco(htmlParaNo(blocoSe(cond, [p(esc(props.t.modelo.textoPadraoSe))], null)), r)
    }
  }
  edicaoSe.value = null
  rangeDaNova = null
  verificar()
}

/**
 * Os blocos de 1º nível que a seleção toca, inteiros. O clique triplo termina a
 * seleção no começo do bloco seguinte: esse bloco fica de fora.
 */
function paragrafosDaSelecao(r: Range): HTMLElement[] {
  const art = artigo.value!
  const ini = blocoDoTopo(r.startContainer)
  let fim = blocoDoTopo(r.endContainer)
  if (!ini || !fim || ini === art || fim === art) return []
  if (fim !== ini) {
    const resto = document.createRange()
    resto.setStart(fim, 0)
    resto.setEnd(r.endContainer, r.endOffset)
    const tmp = document.createElement('div')
    tmp.appendChild(resto.cloneContents())
    tmp.querySelectorAll('[data-ui]').forEach(e => e.remove())
    // Bloco de condição ou repetição só entra se a seleção o cobre inteiro.
    const blocoPelaMetade = !!(fim.dataset.se || fim.dataset.repetir) && r.comparePoint(fim, fim.childNodes.length) > 0
    if (blocoPelaMetade || !tmp.textContent?.trim()) fim = fim.previousElementSibling as HTMLElement
  }
  const lista: HTMLElement[] = []
  let atual: Element | null = ini
  while (atual) {
    lista.push(atual as HTMLElement)
    if (atual === fim) break
    atual = atual.nextElementSibling
  }
  return lista
}

function tirarCondicao(id: string) {
  const el = blocoPorId(id)
  if (!el) return
  const nos = [...el.querySelectorAll<HTMLElement>(':scope > [data-parte]')].flatMap(parte => [...parte.childNodes].filter(n => !(n as HTMLElement).dataset?.ui))
  el.replaceWith(...nos)
  if (edicaoSe.value?.id === id) edicaoSe.value = null
  toast.add({ title: props.t.modelo.condicaoTirada, icon: 'i-lucide-check', color: 'success' })
  verificar()
}

function excluirBloco(id: string, aviso: string) {
  blocoPorId(id)?.remove()
  if (edicaoSe.value?.id === id) edicaoSe.value = null
  if (edicaoRep.value?.id === id) edicaoRep.value = null
  toast.add({ title: aviso, icon: 'i-lucide-trash-2', color: 'neutral' })
  verificar()
}

function acoesDaCondicao(id: string): DropdownMenuItem[][] {
  return [[
    { label: props.t.modelo.tirarCondicao, icon: 'i-lucide-unlink', onSelect: () => tirarCondicao(id) },
    { label: props.t.modelo.excluirCondicao, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => excluirBloco(id, props.t.modelo.condicaoExcluida) },
  ]]
}

/* ------------------------------ aba Repetições ------------------------------ */

interface EdicaoRep { id: string | null, rep: Repeticao, antes: Repeticao | null }
const edicaoRep = ref<EdicaoRep | null>(null)

const listas = computed(() => camposDoModelo.filter(c => c.tipo === 'lista'))
const opcoesDeLista = computed<SelectItem[]>(() => listas.value.map(l => ({ label: l.rotulo, value: l.ref, icon: ICONE_DO_TIPO.lista })))
const opcoesDeFormato = computed<SelectItem[]>(() => [
  { label: props.t.modelo.formatos.tabela, value: 'tabela', icon: 'i-lucide-table' },
  { label: props.t.modelo.formatos.numerada, value: 'numerada', icon: 'i-lucide-list-ordered' },
  { label: props.t.modelo.formatos.marcadores, value: 'marcadores', icon: 'i-lucide-list' },
  { label: props.t.modelo.formatos.texto, value: 'texto', icon: 'i-lucide-pilcrow' },
])

function novaRepeticao() {
  edicaoRep.value = { id: null, rep: repeticaoPadrao(), antes: null }
}

function editarRepeticao(id: string) {
  const rep = decodificar<Repeticao>(blocoPorId(id)?.dataset.repetir)
  if (!rep) return
  edicaoRep.value = { id, rep: copia(rep), antes: copia(rep) }
  aba.value = 'repeticao'
  localizar(id)
}

const colunasDaEdicao = computed(() => (edicaoRep.value ? colunasDe(edicaoRep.value.rep.campo) : []))
/** As colunas na ordem de saída: as marcadas primeiro, depois as outras. */
const colunasEmOrdem = computed(() => {
  const r = edicaoRep.value?.rep
  if (!r) return []
  const todas = colunasDaEdicao.value
  return [...r.colunas.map(ref => todas.find(c => c.ref === ref)!).filter(Boolean), ...todas.filter(c => !r.colunas.includes(c.ref))]
})

function trocarLista(ref: string) {
  const r = edicaoRep.value?.rep
  if (!r) return
  r.campo = ref
  r.colunas = colunasDe(ref).slice(0, 2).map(c => c.ref)
  r.filtro = null
  r.ordem = null
  r.total = null
}

function marcarColuna(ref: string, sim: boolean) {
  const r = edicaoRep.value?.rep
  if (!r) return
  r.colunas = sim ? [...r.colunas, ref] : r.colunas.filter(c => c !== ref)
  if (r.total && !r.colunas.includes(r.total)) r.total = null
}

function moverColuna(ref: string, passo: -1 | 1) {
  const r = edicaoRep.value?.rep
  if (!r) return
  const i = r.colunas.indexOf(ref)
  const j = i + passo
  if (i < 0 || j < 0 || j >= r.colunas.length) return
  const lista = [...r.colunas]
  ;[lista[i], lista[j]] = [lista[j]!, lista[i]!]
  r.colunas = lista
}

/** A coluna de dinheiro que pode ser somada no fim da tabela. */
const colunaSomavel = computed(() => {
  const r = edicaoRep.value?.rep
  if (!r || r.formato !== 'tabela') return null
  return colunasDaEdicao.value.find(c => c.tipo === 'moeda' && r.colunas.includes(c.ref)) ?? null
})

const opcoesDeOrdem = computed<SelectItem[]>(() => [
  { label: props.t.modelo.semOrdem, value: '_' },
  ...colunasDaEdicao.value.map(c => ({ label: c.rotulo, value: c.ref })),
])

function trocarOrdem(v: string) {
  const r = edicaoRep.value?.rep
  if (!r) return
  r.ordem = v === '_' ? null : { coluna: v, sentido: r.ordem?.sentido ?? 'asc' }
}

const opcoesDeSentido = computed<SelectItem[]>(() => [
  { label: props.t.modelo.sentido.asc, value: 'asc', icon: 'i-lucide-arrow-up-narrow-wide' },
  { label: props.t.modelo.sentido.desc, value: 'desc', icon: 'i-lucide-arrow-down-wide-narrow' },
])

/** As linhas que saem para o item da prévia: filtradas e ordenadas. */
function linhasDe(r: Repeticao, it: ItemDoContrato = item.value) {
  let linhas = parcelasDoContrato(it.data, it.created_at) as unknown as Record<string, unknown>[]
  if (r.filtro && testeCompleto(r.filtro)) {
    const tipos = colunasDe(r.campo)
    linhas = linhas.filter(l => avaliarTeste(r.filtro!, ref => l[ref], ref => tipos.find(c => c.ref === ref)?.tipo))
  }
  if (r.ordem) {
    const { coluna, sentido } = r.ordem
    const chave = (l: Record<string, unknown>) => (l[coluna] instanceof Date ? (l[coluna] as Date).getTime() : (l[coluna] as number | string))
    linhas = [...linhas].sort((a, b) => (chave(a) > chave(b) ? 1 : chave(a) < chave(b) ? -1 : 0) * (sentido === 'asc' ? 1 : -1))
  }
  return linhas
}

const repeticaoCompleta = computed(() => {
  const r = edicaoRep.value?.rep
  return !!r && r.colunas.length > 0 && (!r.filtro || testeCompleto(r.filtro))
})

function salvarRepeticao() {
  const e = edicaoRep.value
  if (!e || !artigo.value || modo.value !== 'editar' || !repeticaoCompleta.value) return
  const rep = copia(e.rep)
  if (e.id) {
    const el = blocoPorId(e.id)
    if (!el) return
    const a = e.antes
    const mesmoCorpo = a && a.campo === rep.campo && a.formato === rep.formato && a.numerar === rep.numerar && a.total === rep.total && a.colunas.join() === rep.colunas.join()
    const parteVazia = el.querySelector<HTMLElement>(':scope > [data-vazia]')
    const mioloVazio = parteVazia ? [...parteVazia.childNodes].filter(n => !(n as HTMLElement).dataset?.ui).map(htmlDoNo).join('') : null
    let corpo: string
    if (mesmoCorpo) {
      corpo = [...el.childNodes].filter(n => !(n as HTMLElement).dataset?.ui && !(n as HTMLElement).dataset?.vazia).map(htmlDoNo).join('')
    }
    else {
      // Os títulos que a pessoa escreveu nas colunas da tabela ficam.
      const titulos: Record<string, string> = {}
      el.querySelectorAll<HTMLElement>('th[data-coluna]').forEach((th) => { titulos[th.dataset.coluna!] = th.textContent ?? '' })
      corpo = corpoDaRepeticao(rep, titulos)
    }
    const novo = htmlParaNo(blocoRepetir(rep, corpo, e.id, mioloVazio))
    el.replaceWith(novo)
    destacar(novo)
  }
  else {
    colocarBloco(htmlParaNo(blocoRepetir(rep, corpoDaRepeticao(rep))), cursorValido())
  }
  edicaoRep.value = null
  verificar()
}

function acoesDaRepeticao(id: string): DropdownMenuItem[][] {
  return [[
    { label: props.t.modelo.excluirRepeticao, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => excluirBloco(id, props.t.modelo.repeticaoExcluida) },
  ]]
}

/* ------------------------------ prévia ------------------------------ */

const MARCA = 'rounded-sm bg-primary/10 px-0.5 text-highlighted'

interface Contexto { linha: Record<string, unknown>, n: number, linhas: Record<string, unknown>[] }

/** Marcação digitada à mão que o editor reconhece: vira valor na prévia. */
const DIGITADA = /\{\{\s*(data\.([a-z_]+?)(_formatted)?|reference|created_at|request_email)\s*\}\}/g

function textoComValores(texto: string) {
  return esc(texto).replace(DIGITADA, (_m, _todo: string, ref?: string, fmt?: string) => {
    if (!ref) return `<mark class="${MARCA}">${esc(valorDoCampo(_todo, true))}</mark>`
    return campoPorRef(ref) ? `<mark class="${MARCA}">${esc(valorDoCampo(ref, !!fmt))}</mark>` : _m
  })
}

function renderizar(nos: ChildNode[], ctx?: Contexto): string {
  let html = ''
  for (const no of nos) {
    if (no.nodeType === 3) { html += textoComValores(no.textContent ?? ''); continue }
    if (no.nodeType !== 1) continue
    const el = no as HTMLElement
    if (el.dataset.ui) continue
    if (el.dataset.var) { html += `<mark class="${MARCA}">${esc(valorDoCampo(el.dataset.var, el.dataset.fmt === '1'))}</mark>`; continue }
    if (el.dataset.col) {
      if (ctx) html += `<mark class="${MARCA}">${esc(el.dataset.col === '__n' ? String(ctx.n) : valorDaColuna(el.dataset.col, ctx.linha))}</mark>`
      continue
    }
    if (el.dataset.total) {
      const col = el.dataset.total
      if (ctx) html += `<mark class="${MARCA}">${esc(moeda(ctx.linhas.reduce((s, l) => s + Number(l[col] ?? 0), 0)))}</mark>`
      continue
    }
    if (el.dataset.se) {
      const cond = decodificar<Condicao>(el.dataset.se)
      const parte = cond ? parteDoItem(cond) : null
      const alvo = parte === null ? null : el.querySelector(`:scope > [data-parte="${parte}"]`)
      if (alvo) html += renderizar([...alvo.childNodes], ctx)
      continue
    }
    if (el.dataset.repetir) {
      html += renderizarRepeticao(el)
      continue
    }
    const tag = el.tagName.toLowerCase()
    if (tag === 'br') { html += '<br>'; continue }
    html += `<${tag} class="${esc(el.className)}">${renderizar([...el.childNodes], ctx)}</${tag}>`
  }
  return html
}

function renderizarRepeticao(el: HTMLElement): string {
  const r = decodificar<Repeticao>(el.dataset.repetir)
  if (!r) return ''
  const linhas = linhasDe(r)
  if (!linhas.length) {
    const parteVazia = el.querySelector(':scope > [data-vazia]')
    return parteVazia ? renderizar([...parteVazia.childNodes]) : ''
  }
  const modeloDaLinha = el.querySelector<HTMLElement>('[data-linha-modelo]')
  if (!modeloDaLinha) return ''
  const ctxDe = (l: Record<string, unknown>, i: number): Contexto => ({ linha: l, n: i + 1, linhas })
  const linhaRenderizada = (l: Record<string, unknown>, i: number) => renderizar([...modeloDaLinha.childNodes], ctxDe(l, i))
  const tabela = modeloDaLinha.closest('table')
  if (tabela) {
    const cabeca = tabela.querySelector('thead')
    const pe = tabela.querySelector('tfoot')
    return `<table class="${esc(tabela.className)}">`
      + (cabeca ? renderizar([cabeca]) : '')
      + `<tbody>${linhas.map((l, i) => `<tr>${linhaRenderizada(l, i)}</tr>`).join('')}</tbody>`
      + (pe ? renderizar([pe], ctxDe(linhas[0]!, 0)) : '')
      + '</table>'
  }
  const listaHtml = modeloDaLinha.closest('ol,ul')
  if (listaHtml) {
    const tag = listaHtml.tagName.toLowerCase()
    return `<${tag} class="${esc(listaHtml.className)}">${linhas.map((l, i) => `<li>${linhaRenderizada(l, i)}</li>`).join('')}</${tag}>`
  }
  // Texto corrido: as linhas se separam por ";", e a última entra com "e".
  const partes = linhas.map((l, i) => linhaRenderizada(l, i))
  const frase = partes.length > 1 ? `${partes.slice(0, -1).join('; ')} ${props.t.modelo.juntaE} ${partes.at(-1)}` : partes[0]
  return `<p class="mb-3 text-justify">${frase}.</p>`
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

const caminhoDoCampo = (ref: string) => (campoPorRef(ref)?.doItem ? ref : `data.${ref}`)

function origemDaLista(r: Repeticao) {
  const ap = apelido(r.campo)
  const tipos = colunasDe(r.campo)
  let s = `data.${r.campo}`
  if (r.filtro && testeCompleto(r.filtro)) s += `.filter(${ap} => ${marcarTeste(r.filtro, ref => `${ap}.${ref}`, ref => tipos.find(c => c.ref === ref)?.tipo)})`
  if (r.ordem) {
    const col = r.ordem.coluna
    s += r.ordem.sentido === 'asc' ? `.sort((a, b) => a.${col} > b.${col} ? 1 : -1)` : `.sort((a, b) => a.${col} < b.${col} ? 1 : -1)`
  }
  return s
}

function marcar(nos: ChildNode[], rep?: Repeticao): string {
  let s = ''
  for (const no of nos) {
    if (no.nodeType === 3) { s += (no.textContent ?? '').replace(/ /g, ' '); continue }
    if (no.nodeType !== 1) continue
    const el = no as HTMLElement
    if (el.dataset.ui) continue
    if (el.dataset.var) {
      s += campoPorRef(el.dataset.var)?.doItem ? `{{${el.dataset.var}}}` : `{{data.${el.dataset.var}${el.dataset.fmt === '1' ? '_formatted' : ''}}}`
      continue
    }
    if (el.dataset.col) {
      s += el.dataset.col === '__n' ? '{{= $idx + 1}}' : `{{= $${apelido(rep?.campo ?? el.dataset.lista ?? 'item')}.${el.dataset.col}}}`
      continue
    }
    if (el.dataset.total) {
      const r = rep
      const ap = apelido(el.dataset.lista ?? 'item')
      s += `{{= ${r ? origemDaLista(r) : `data.${el.dataset.lista}`}.reduce((soma, ${ap}) => soma + ${ap}.${el.dataset.total}, 0)}}`
      continue
    }
    if (el.dataset.se) {
      const cond = decodificar<Condicao>(el.dataset.se)
      if (!cond) continue
      const exprs = marcarPartes(cond, caminhoDoCampo, tipoDoCampo)
      const partes = el.querySelectorAll<HTMLElement>(':scope > [data-parte]')
      partes.forEach((parte, i) => {
        s += `{{}}{{IF ${exprs[i] ?? ''}}}\n${marcar([...parte.childNodes], rep)}{{END-IF}}\n`
      })
      continue
    }
    if (el.dataset.repetir) {
      s += marcarRepeticao(el)
      continue
    }
    if (el.tagName === 'TR') {
      s += `| ${[...el.children].map(td => marcar([...td.childNodes], rep).trim()).join(' | ')} |\n`
      continue
    }
    s += marcar([...el.childNodes], rep)
    if (el.tagName === 'P' || el.tagName === 'LI') s += '\n'
  }
  return s
}

function marcarRepeticao(el: HTMLElement): string {
  const r = decodificar<Repeticao>(el.dataset.repetir)
  if (!r) return ''
  const ap = apelido(r.campo)
  const origem = origemDaLista(r)
  const modeloDaLinha = el.querySelector<HTMLElement>('[data-linha-modelo]')
  let s = ''
  const tabela = modeloDaLinha?.closest('table')
  if (tabela && modeloDaLinha) {
    const cabeca = tabela.querySelector('thead tr')
    const pe = tabela.querySelector('tfoot tr')
    // A tabela inteira (títulos e total) só sai quando ao menos 1 linha sai.
    s += `{{}}{{IF ${origem}.length}}\n`
    if (cabeca) s += marcar([cabeca], r)
    const celulas = [...modeloDaLinha.children].map(td => marcar([...td.childNodes], r).trim())
    // O motor repete a linha da tabela quando o FOR abre na 1ª célula e fecha na última.
    celulas[0] = `{{}}{{FOR ${ap} IN ${origem}}}${celulas[0]}`
    celulas[celulas.length - 1] = `${celulas[celulas.length - 1]}{{END-FOR ${ap}}}`
    s += `| ${celulas.join(' | ')} |\n`
    if (pe) s += marcar([pe], r)
    s += '{{END-IF}}\n'
  }
  else if (modeloDaLinha) {
    s += `{{}}{{FOR ${ap} IN ${origem}}}\n${marcar([...modeloDaLinha.childNodes], r).trim()}\n{{END-FOR ${ap}}}\n`
  }
  const parteVazia = el.querySelector<HTMLElement>(':scope > [data-vazia]')
  if (parteVazia) s += `{{}}{{IF !${origem}.length}}\n${marcar([...parteVazia.childNodes], r)}{{END-IF}}\n`
  return s
}

const marcacao = ref('')
function atualizarMarcacao() {
  if (!artigo.value) return
  marcacao.value = marcar([...artigo.value.childNodes])
}

/* ------------------------------ verificação ------------------------------ */

/** A marcação digitada à mão vale quando aponta para um campo que existe. */
function reconhecida(m: string) {
  const miolo = m.slice(2, -2).trim()
  if (!miolo) return true
  if (/^(IF\s|END-IF$|FOR\s|END-FOR\s|=\s*\$)/.test(miolo)) return true
  if (['reference', 'created_at', 'request_email'].includes(miolo)) return true
  const campo = /^data\.([a-z_]+?)(_formatted)?$/.exec(miolo)
  return !!campo && !!campoPorRef(campo[1]!) && !campoPorRef(campo[1]!)!.doItem
}

const naoReconhecidas = ref<string[]>([])
function verificar() {
  if (!artigo.value) return
  const achados: string[] = []
  const walker = document.createTreeWalker(artigo.value, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const m = walker.currentNode.textContent?.match(/\{\{[^}]*\}\}/g)
    if (m) achados.push(...m.filter(x => !reconhecida(x)))
  }
  naoReconhecidas.value = achados
  versao.value += 1
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
  if (edicaoSe.value) edicaoSe.value = null
  else if (edicaoRep.value) edicaoRep.value = null
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

          <!-- ─────────────── lateral: tudo se monta aqui, fora do documento ─────────────── -->
          <aside class="flex w-[28rem] shrink-0 flex-col border-l border-default">
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
                      <UIcon :name="ICONE_DO_TIPO[col.tipo]!" class="size-4 shrink-0 text-info" />
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
                    <UIcon :name="ICONE_DO_TIPO[campo.tipo]!" class="size-4 shrink-0 text-muted group-hover:text-primary" />
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

              <!-- Condições: a lista -->
              <div v-else-if="aba === 'condicao' && !edicaoSe" class="space-y-3">
                <p class="text-xs text-muted">
                  {{ t.modelo.dicaNovaCondicao }}
                </p>
                <UButton icon="i-lucide-plus" :label="t.modelo.novaCondicao" :disabled="modo !== 'editar'" @mousedown.prevent @click="novaCondicao" />

                <p class="pt-2 text-xs font-medium uppercase tracking-wide text-muted">
                  {{ t.modelo.condicoesNoModelo(condicoesDoModelo.length) }}
                </p>
                <p v-if="!condicoesDoModelo.length" class="text-sm text-muted">
                  {{ t.modelo.semCondicoes }}
                </p>
                <TransitionGroup
                  tag="div"
                  class="space-y-2"
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                >
                  <div
                    v-for="b in condicoesDoModelo"
                    :key="b.id"
                    class="rounded-md border p-2.5 transition-colors"
                    :class="b.id === blocoNoCursor ? 'border-primary/60 bg-primary/5' : 'border-default'"
                  >
                    <div class="flex items-start gap-2">
                      <UIcon name="i-lucide-split" class="mt-0.5 size-4 shrink-0 text-warning" />
                      <div class="min-w-0 flex-1 space-y-1.5">
                        <p class="line-clamp-2 text-sm text-highlighted">
                          {{ cabecalhoDaParte(b.cond, 0) }}
                        </p>
                        <div class="flex flex-wrap items-center gap-1">
                          <UBadge
                            v-for="(_v, i) in b.cond.variantes.slice(1)"
                            :key="i"
                            :label="rotuloDaParte(i + 1)"
                            color="neutral"
                            variant="outline"
                            size="sm"
                          />
                          <UBadge v-if="b.cond.senao" :label="t.modelo.parteSenao" color="neutral" variant="outline" size="sm" />
                          <UBadge
                            :label="parteDoItem(b.cond) === null ? t.modelo.seloNada : t.modelo.seloParte(rotuloDaParte(parteDoItem(b.cond)!))"
                            :color="parteDoItem(b.cond) === null ? 'neutral' : 'success'"
                            :icon="parteDoItem(b.cond) === null ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                            variant="subtle"
                            size="sm"
                          />
                        </div>
                        <p v-if="b.id === blocoNoCursor" class="text-xs text-primary">
                          {{ t.modelo.cursorAqui }}
                        </p>
                      </div>
                      <div class="flex shrink-0 items-center">
                        <UTooltip :text="t.modelo.localizar">
                          <UButton icon="i-lucide-locate" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.localizar" @click="localizar(b.id)" />
                        </UTooltip>
                        <UButton icon="i-lucide-pencil" :label="t.modelo.editarBloco" color="neutral" variant="outline" size="xs" @click="editarCondicao(b.id)" />
                        <UDropdownMenu :items="acoesDaCondicao(b.id)" :content="{ align: 'end' }">
                          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.maisAcoes" />
                        </UDropdownMenu>
                      </div>
                    </div>
                  </div>
                </TransitionGroup>
              </div>

              <!-- Condições: o montador -->
              <div v-else-if="aba === 'condicao' && edicaoSe" class="space-y-4">
                <div class="flex items-center gap-2">
                  <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.voltarALista" @click="edicaoSe = null" />
                  <p class="text-sm font-semibold text-highlighted">
                    {{ edicaoSe.id ? t.modelo.editarCondicao : t.modelo.novaCondicao }}
                  </p>
                </div>
                <p class="text-xs text-muted">
                  {{ t.modelo.textoNoDocumento }}
                  <template v-if="edicaoSe.comSelecao">
                    {{ t.modelo.selecaoVaiParaDentro }}
                  </template>
                </p>

                <TransitionGroup
                  tag="div"
                  class="space-y-3"
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                  leave-active-class="transition duration-100 ease-in"
                  leave-to-class="opacity-0"
                >
                  <section
                    v-for="(v, i) in edicaoSe.cond.variantes"
                    :key="`v${i}`"
                    class="space-y-2.5 rounded-md border border-default p-3"
                  >
                    <div class="flex items-center gap-2">
                      <UBadge :label="i === 0 ? t.modelo.parteSe : t.modelo.parteSenaoSe" color="warning" variant="subtle" size="md" class="font-semibold" />
                      <span class="flex-1" />
                      <UButton v-if="i > 0" icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.removerParte" @click="removerParte(i)" />
                    </div>
                    <EditorDeRegras :teste="v" :campos="camposDeCondicao" :opcoes-de="opcoesDe" :grupos="true" :t="t" :idioma="idioma" />
                  </section>
                </TransitionGroup>

                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                  leave-active-class="transition duration-100 ease-in"
                  leave-to-class="opacity-0"
                >
                  <section v-if="edicaoSe.cond.senao" class="space-y-2 rounded-md border border-default p-3">
                    <div class="flex items-center gap-2">
                      <UBadge :label="t.modelo.parteSenao" color="warning" variant="subtle" size="md" class="font-semibold" />
                      <span class="flex-1" />
                      <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.removerSenao" @click="edicaoSe.cond.senao = false" />
                    </div>
                    <p class="text-xs text-muted">
                      {{ t.modelo.senaoAjuda }}
                    </p>
                  </section>
                </Transition>

                <div class="flex flex-wrap gap-2">
                  <UButton icon="i-lucide-git-branch-plus" :label="t.modelo.adicionarSenaoSe" color="neutral" variant="outline" size="sm" @click="adicionarSenaoSe" />
                  <UButton v-if="!edicaoSe.cond.senao" icon="i-lucide-corner-down-right" :label="t.modelo.adicionarSenao" color="neutral" variant="outline" size="sm" @click="edicaoSe.cond.senao = true" />
                </div>

                <UAlert
                  v-if="condicaoCompleta"
                  :color="resultadoDaEdicao ? 'success' : 'neutral'"
                  variant="subtle"
                  :icon="resultadoDaEdicao ? 'i-lucide-eye' : 'i-lucide-eye-off'"
                  :description="resultadoDaEdicao ? t.modelo.resultadoParte(item.reference, resultadoDaEdicao) : t.modelo.resultadoNada(item.reference)"
                />
                <p v-else class="text-xs text-muted">
                  {{ t.modelo.incompleta }}
                </p>

                <div class="flex gap-2">
                  <UButton
                    :icon="edicaoSe.id ? 'i-lucide-check' : 'i-lucide-split'"
                    :label="edicaoSe.id ? t.modelo.salvarCondicao : t.modelo.inserirCondicao"
                    :disabled="!condicaoCompleta || modo !== 'editar'"
                    @mousedown.prevent
                    @click="salvarCondicao"
                  />
                  <UButton :label="t.modelo.cancelar" color="neutral" variant="outline" @click="edicaoSe = null" />
                </div>
              </div>

              <!-- Repetições: a lista -->
              <div v-else-if="aba === 'repeticao' && !edicaoRep" class="space-y-3">
                <p class="text-xs text-muted">
                  {{ t.modelo.dicaNovaRepeticao }}
                </p>
                <UButton icon="i-lucide-plus" :label="t.modelo.novaRepeticao" :disabled="modo !== 'editar'" @mousedown.prevent @click="novaRepeticao" />

                <p class="pt-2 text-xs font-medium uppercase tracking-wide text-muted">
                  {{ t.modelo.repeticoesNoModelo(repeticoesDoModelo.length) }}
                </p>
                <p v-if="!repeticoesDoModelo.length" class="text-sm text-muted">
                  {{ t.modelo.semRepeticoes }}
                </p>
                <div
                  v-for="b in repeticoesDoModelo"
                  :key="b.id"
                  class="rounded-md border p-2.5 transition-colors"
                  :class="b.id === blocoNoCursor ? 'border-primary/60 bg-primary/5' : 'border-default'"
                >
                  <div class="flex items-start gap-2">
                    <UIcon name="i-lucide-repeat" class="mt-0.5 size-4 shrink-0 text-info" />
                    <div class="min-w-0 flex-1 space-y-1.5">
                      <p class="line-clamp-2 text-sm text-highlighted">
                        {{ cabecalhoDaRepeticao(b.rep) }}
                      </p>
                      <div class="flex flex-wrap items-center gap-1">
                        <UBadge :label="t.modelo.formatos[b.rep.formato]" color="neutral" variant="outline" size="sm" />
                        <UBadge
                          :label="t.modelo.seloLinhas(linhasDe(b.rep).length)"
                          :color="linhasDe(b.rep).length ? 'info' : 'neutral'"
                          variant="subtle"
                          size="sm"
                        />
                      </div>
                      <p v-if="b.id === blocoNoCursor" class="text-xs text-primary">
                        {{ t.modelo.cursorAqui }}
                      </p>
                    </div>
                    <div class="flex shrink-0 items-center">
                      <UTooltip :text="t.modelo.localizar">
                        <UButton icon="i-lucide-locate" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.localizar" @click="localizar(b.id)" />
                      </UTooltip>
                      <UButton icon="i-lucide-pencil" :label="t.modelo.editarBloco" color="neutral" variant="outline" size="xs" @click="editarRepeticao(b.id)" />
                      <UDropdownMenu :items="acoesDaRepeticao(b.id)" :content="{ align: 'end' }">
                        <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.maisAcoes" />
                      </UDropdownMenu>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Repetições: o montador -->
              <div v-else-if="aba === 'repeticao' && edicaoRep" class="space-y-4">
                <div class="flex items-center gap-2">
                  <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.voltarALista" @click="edicaoRep = null" />
                  <p class="text-sm font-semibold text-highlighted">
                    {{ edicaoRep.id ? t.modelo.editarRepeticao : t.modelo.novaRepeticao }}
                  </p>
                </div>

                <p class="text-xs text-muted">
                  {{ t.modelo.textoNoDocumentoRep }}
                </p>

                <!-- O que repete -->
                <section class="space-y-3">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted">
                    {{ t.modelo.secaoOQueRepete }}
                  </p>
                  <UFormField :label="t.modelo.lista">
                    <USelect :model-value="edicaoRep.rep.campo" :items="opcoesDeLista" size="sm" class="w-full" @update:model-value="trocarLista($event as string)" />
                  </UFormField>
                </section>

                <USeparator />

                <!-- Como aparece -->
                <section class="space-y-3">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted">
                    {{ t.modelo.secaoComoAparece }}
                  </p>
                  <UFormField :label="t.modelo.formato">
                    <USelect v-model="edicaoRep.rep.formato" :items="opcoesDeFormato" size="sm" class="w-full" />
                  </UFormField>
                  <UFormField :label="t.modelo.colunas" :error="!edicaoRep.rep.colunas.length ? t.modelo.semColuna : undefined">
                    <TransitionGroup tag="ul" class="mt-1 space-y-0.5" move-class="transition-transform duration-200">
                      <li v-for="col in colunasEmOrdem" :key="col.ref" class="flex h-8 items-center gap-1 rounded-md pl-1.5 hover:bg-elevated/60">
                        <UCheckbox
                          :model-value="edicaoRep.rep.colunas.includes(col.ref)"
                          :label="col.rotulo"
                          size="sm"
                          class="flex-1"
                          @update:model-value="marcarColuna(col.ref, !!$event)"
                        />
                        <span class="flex" :class="edicaoRep.rep.colunas.includes(col.ref) ? '' : 'invisible'">
                          <UButton icon="i-lucide-chevron-up" color="neutral" variant="ghost" size="xs" :disabled="edicaoRep.rep.colunas.indexOf(col.ref) <= 0" :aria-label="t.modelo.moverAcima" @click="moverColuna(col.ref, -1)" />
                          <UButton icon="i-lucide-chevron-down" color="neutral" variant="ghost" size="xs" :disabled="edicaoRep.rep.colunas.indexOf(col.ref) === edicaoRep.rep.colunas.length - 1" :aria-label="t.modelo.moverAbaixo" @click="moverColuna(col.ref, 1)" />
                        </span>
                      </li>
                    </TransitionGroup>
                  </UFormField>
                  <div class="space-y-2.5">
                    <USwitch v-if="edicaoRep.rep.formato === 'tabela' || edicaoRep.rep.formato === 'texto'" v-model="edicaoRep.rep.numerar" :label="t.modelo.numerar" size="sm" />
                    <USwitch
                      v-if="colunaSomavel"
                      :model-value="edicaoRep.rep.total === colunaSomavel.ref"
                      :label="t.modelo.somarNoFim(colunaSomavel.rotulo)"
                      size="sm"
                      @update:model-value="edicaoRep.rep.total = $event ? colunaSomavel.ref : null"
                    />
                  </div>
                </section>

                <USeparator />

                <!-- Quais linhas saem -->
                <section class="space-y-3">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted">
                    {{ t.modelo.secaoQuaisLinhas }}
                  </p>
                  <div v-if="!edicaoRep.rep.filtro">
                    <UButton icon="i-lucide-filter" :label="t.modelo.filtrar" color="neutral" variant="outline" size="sm" @click="edicaoRep.rep.filtro = novoTeste()" />
                  </div>
                  <div v-else class="space-y-2.5 rounded-md border border-default p-3">
                    <div class="flex items-center gap-2">
                      <UIcon name="i-lucide-filter" class="size-4 text-info" />
                      <p class="flex-1 text-sm font-medium text-highlighted">
                        {{ t.modelo.filtroTitulo }}
                      </p>
                      <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.tirarFiltro" @click="edicaoRep.rep.filtro = null" />
                    </div>
                    <EditorDeRegras :teste="edicaoRep.rep.filtro" :campos="colunasDaEdicao" :opcoes-de="opcoesDe" :grupos="false" :t="t" :idioma="idioma" />
                  </div>
                  <UFormField :label="t.modelo.ordenarPor">
                    <div class="grid grid-cols-2 gap-2">
                      <USelect :model-value="edicaoRep.rep.ordem?.coluna ?? '_'" :items="opcoesDeOrdem" size="sm" class="w-full" :aria-label="t.modelo.ordenarPor" @update:model-value="trocarOrdem($event as string)" />
                      <USelect v-if="edicaoRep.rep.ordem" v-model="edicaoRep.rep.ordem.sentido" :items="opcoesDeSentido" size="sm" class="w-full" :aria-label="t.modelo.sentidoDaOrdem" />
                    </div>
                  </UFormField>
                </section>

                <USeparator />

                <!-- Se a lista estiver vazia: parte do bloco, como "Nos demais casos" na condição -->
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                  leave-active-class="transition duration-100 ease-in"
                  leave-to-class="opacity-0"
                >
                  <div v-if="edicaoRep.rep.vazio" class="space-y-2 rounded-md border border-default p-3">
                    <div class="flex items-center gap-2">
                      <UBadge :label="t.modelo.parteVazia" color="info" variant="subtle" size="md" class="font-semibold" />
                      <span class="flex-1" />
                      <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" :aria-label="t.modelo.removerVazia" @click="edicaoRep.rep.vazio = false" />
                    </div>
                    <p class="text-xs text-muted">
                      {{ t.modelo.vaziaAjuda }}
                    </p>
                  </div>
                </Transition>
                <UButton v-if="!edicaoRep.rep.vazio" icon="i-lucide-corner-down-right" :label="t.modelo.parteVazia" color="neutral" variant="outline" size="sm" @click="edicaoRep.rep.vazio = true" />

                <UAlert
                  color="info"
                  variant="subtle"
                  icon="i-lucide-repeat"
                  :description="t.modelo.resumoRepeticao(item.reference, linhasDe(edicaoRep.rep).length, edicaoRep.rep.vazio)"
                />

                <div class="flex gap-2">
                  <UButton
                    :icon="edicaoRep.id ? 'i-lucide-check' : 'i-lucide-repeat'"
                    :label="edicaoRep.id ? t.modelo.salvarRepeticao : t.modelo.inserirRepeticao"
                    :disabled="!repeticaoCompleta || modo !== 'editar'"
                    @mousedown.prevent
                    @click="salvarRepeticao"
                  />
                  <UButton :label="t.modelo.cancelar" color="neutral" variant="outline" @click="edicaoRep = null" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </template>
  </UModal>
</template>
