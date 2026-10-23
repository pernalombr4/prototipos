<script setup lang="ts">
/**
 * PROPOSTA: a barra de visualizações da tela nova de itens.
 *
 * Mesmas peças das folders do item (protótipo pastas-do-item, modelo
 * Sublinhado, já na branch do PR 2936), outra forma:
 *
 *   folders         texto sobre linha de base; a aberta ganha um traço embaixo.
 *   visualizações   pílula clara; a ativa ganha fundo suave na cor de destaque.
 *                   Sem traço: o traço é a marca das folders.
 *
 * O que vem das folders, igual: arrastar (a vizinha troca na metade, sem cópia
 * translúcida, soltar no lugar não faz nada, aviso com Desfazer), seta ⌄ na
 * ativa com o menu, botão direito, "+N" com busca, "+" na ponta, teclado
 * (setas, Ctrl + Shift + seta) e anúncio ao leitor de tela.
 *
 * O que é só daqui: nome cortado pela largura com tooltip que mostra o nome
 * inteiro e o que a visualização filtra; ponto na ativa quando ela tem mudança
 * não salva; renomear na própria pílula (clique duplo ou F2); fixar no
 * começo; mover pelo menu (alternativa ao arrasto, WCAG 2.5.7).
 *
 * "Itens" (a padrão do sistema) fica sempre em primeiro e não se arrasta.
 */
import type { ContextMenuItem } from '@nuxt/ui'
import type { Visualizacao } from './mocks'
import type { ResumoDaVisualizacao } from './filtros'
import { EU } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Owner ou Full: renomeia, exclui, abre primeiro para todos e aplica a própria ordem para todos. */
  ehOwner: boolean
  /** As que têm versão desta pessoa ("Salvar só para mim"). */
  pessoais: string[]
  /** A ordem desta pessoa é a de todos: "Aplicar" e "Recuperar" ficam desligados. */
  ordemEhPadrao: boolean
  /** A visualização ativa tem filtro, ordenação ou coluna mexidos e não salvos. */
  modificada: boolean
  /** Todas as que têm mudança não salva: a ativa mostra o ponto na seta; as outras, depois do nome. */
  modificadas: string[]
  /** O que a dica da pílula mostra: tipo, quem vê, filtros e ordenação (ver `resumoDe` no index). */
  resumoDe: (v: Visualizacao) => ResumoDaVisualizacao
}>()

const visualizacoes = defineModel<Visualizacao[]>('visualizacoes', { required: true })
const ativa = defineModel<string>('ativa', { required: true })

const emit = defineEmits<{
  configurar: [ref: string]
  duplicar: [ref: string]
  copiarLink: [ref: string]
  definirPadrao: [ref: string]
  excluir: [ref: string]
  renomeada: [ref: string, anterior: string]
  fixada: [ref: string, fixou: boolean]
  /** Rodada 7: ocultar da barra e mostrar de novo; quem usa avisa e oferece Desfazer. */
  ocultada: [ref: string, oculta: boolean]
  nomeRepetido: [nome: string]
  descartarNova: [ref: string]
  restaurarVersao: [ref: string]
  aplicarOrdem: []
  recuperarOrdem: []
  /** "Nova visualização" no fim da lista do "+N" (Notion): abre o catálogo do "+ Visualização". */
  nova: []
  /** A ordem mudou: quem usa avisa e oferece Desfazer com a ordem anterior. */
  reordenada: [anterior: Visualizacao[]]
}>()

const SISTEMA = 'default'
/** A visualização em criação ainda sem nome aparece como "Nova visualização". */
const nomeDe = (v: Visualizacao) => v.name || (v.novo ? props.t.barra.nova : '')

/* ---------- quantas cabem ---------- */

const barra = ref<HTMLElement>()
const medidas = ref<HTMLElement>()
const larguraDisponivel = ref(0)
const larguras = ref<Record<string, number>>({})

/** Espaço da ponta direita ("+N" e "+") e o espaço entre pílulas. */
const RESERVA = 190
const VAO = 4
/** A ativa ganha a seta ⌄ (e o ponto, quando modificada). */
const EXTRA_DA_ATIVA = 26

function medir() {
  if (!barra.value || !medidas.value) return
  larguraDisponivel.value = barra.value.clientWidth
  const novas: Record<string, number> = {}
  medidas.value.querySelectorAll<HTMLElement>('[data-medida]').forEach((el) => {
    novas[el.dataset.medida!] = el.offsetWidth
  })
  larguras.value = novas
}

let observador: ResizeObserver | undefined
onMounted(() => {
  observador = new ResizeObserver(() => medir())
  if (barra.value) observador.observe(barra.value)
  nextTick(medir)
})
onBeforeUnmount(() => observador?.disconnect())
watch(() => [props.t, visualizacoes.value.map(v => v.reference + nomeDe(v) + v.icon + v.fixada + v.minimizada + v.oculta).join()], () => nextTick(medir))

/**
 * As que cabem, na ordem. A ativa sempre aparece: se ela estiver depois do
 * corte, entra no lugar da última que cabia (Notion, ClickUp e Chrome fazem igual).
 */
const visiveis = computed(() => {
  const limite = larguraDisponivel.value - RESERVA
  if (limite <= 0) return visualizacoes.value
  const larguraDe = (v: Visualizacao) => (larguras.value[v.reference] ?? 120) + VAO + (v.reference === ativa.value ? EXTRA_DA_ATIVA : 0)
  const cabem: Visualizacao[] = []
  let soma = 0
  // Rodada 7: a oculta não disputa lugar na barra; aberta, ela aparece até a pessoa trocar de visualização.
  for (const v of visualizacoes.value.filter(x => !x.oculta || x.reference === ativa.value)) {
    const w = larguraDe(v)
    if (soma + w > limite) break
    cabem.push(v)
    soma += w
  }
  const atual = visualizacoes.value.find(v => v.reference === ativa.value)
  if (atual && !cabem.includes(atual)) {
    const w = larguraDe(atual)
    while (cabem.length > 1 && soma + w > limite) {
      const saiu = cabem.pop()!
      soma -= larguraDe(saiu)
    }
    cabem.push(atual)
  }
  return cabem
})

const escondidas = computed(() => visualizacoes.value.filter(v => !visiveis.value.includes(v)))

const itensDasAbas = computed(() => visiveis.value.map(v => ({
  value: v.reference,
  label: nomeDe(v),
  icon: v.icon ?? 'i-lucide-table',
  vis: v,
})))

/* ---------- arrastar para reordenar (mesma mecânica das folders) ---------- */

const arrastando = ref<string | null>(null)
const anuncio = ref('')
let inicio: { id: string, x: number, de: number, rects: DOMRect[], els: HTMLElement[], alvo: number } | null = null
let engatou = false

function gatilhos(): HTMLElement[] {
  return barra.value ? [...barra.value.querySelectorAll<HTMLElement>('[data-slot=trigger]')] : []
}

function aoPressionar(e: PointerEvent) {
  if (e.button !== 0 || renomeando.value) return
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  if (!el) return
  const els = gatilhos()
  const de = els.indexOf(el)
  // "Itens" não se arrasta: é a âncora da barra.
  if (de < 0 || visiveis.value[de]!.reference === SISTEMA) return
  inicio = { id: visiveis.value[de]!.reference, x: e.clientX, de, rects: els.map(x => x.getBoundingClientRect()), els, alvo: de }
  engatou = false
  window.addEventListener('pointermove', aoMover)
  window.addEventListener('pointerup', aoSoltar, { once: true })
}

function aoMover(e: PointerEvent) {
  if (!inicio) return
  const dx = e.clientX - inicio.x
  if (!engatou && Math.abs(dx) < 5) return
  if (!engatou) {
    engatou = true
    arrastando.value = inicio.id
    document.body.style.cursor = 'grabbing'
  }
  const { rects, els, de } = inicio
  // Não passa para antes de "Itens".
  const minimo = rects[1]!.left - rects[de]!.left
  const maximo = rects.at(-1)!.right - rects[de]!.right
  const desloc = Math.max(minimo, Math.min(maximo, dx))
  const centro = rects[de]!.left + rects[de]!.width / 2 + desloc
  let alvo = 0
  rects.forEach((r, i) => {
    if (i !== de && r.left + r.width / 2 < centro) alvo++
  })
  alvo = Math.max(1, alvo)
  inicio.alvo = alvo
  const passo = rects[de]!.width + VAO
  const iAtiva = visiveis.value.findIndex(v => v.reference === ativa.value)
  els.forEach((el, i) => {
    if (i === de) {
      if (i === iAtiva) {
        menuSemTransicao.value = true
        deslocMenu.value = desloc
      }
      el.style.transition = 'none'
      el.style.transform = `translateX(${desloc}px)`
      el.dataset.arrastando = 'true'
      return
    }
    el.style.transition = ''
    let mover = 0
    if (de < alvo && i > de && i <= alvo) mover = -passo
    if (de > alvo && i < de && i >= alvo) mover = passo
    el.style.transform = mover ? `translateX(${mover}px)` : ''
    if (i === iAtiva) {
      menuSemTransicao.value = false
      deslocMenu.value = mover
    }
  })
}

function aoSoltar() {
  window.removeEventListener('pointermove', aoMover)
  document.body.style.cursor = ''
  if (!inicio) return
  const { els, de, alvo, id } = inicio
  inicio = null
  if (!engatou) return
  // O clique que fecha o arrasto não troca de visualização. O bloqueio dura só este instante:
  // sem o prazo, quando o soltar não gera clique, o próximo clique (no "+N", por exemplo) era engolido.
  const engolir = (ev: MouseEvent) => ev.stopPropagation()
  window.addEventListener('click', engolir, { capture: true, once: true })
  setTimeout(() => window.removeEventListener('click', engolir, { capture: true }), 0)
  els.forEach((el) => {
    el.style.transition = 'none'
    el.style.transform = ''
    delete el.dataset.arrastando
  })
  requestAnimationFrame(() => els.forEach((el) => { el.style.transition = '' }))
  menuSemTransicao.value = true
  arrastando.value = null
  if (alvo !== de) mover(id, visualizacoes.value.indexOf(visiveis.value[alvo]!))
  nextTick(posicionarMenu)
}

/** Move a visualização `id` para a posição `para` da lista inteira. Fixar e desafixar também passam aqui. */
function mover(id: string, para: number, silencioso = false) {
  const tinhaFoco = !!barra.value?.contains(document.activeElement)
  const anterior = visualizacoes.value
  const lista = [...anterior]
  const de = lista.findIndex(v => v.reference === id)
  para = Math.max(1, Math.min(lista.length - 1, para))
  if (de === para || de < 0) return
  const [v] = lista.splice(de, 1)
  lista.splice(para, 0, v!)
  visualizacoes.value = lista
  anuncio.value = props.t.barra.movida(nomeDe(v!), para + 1)
  if (!silencioso) emit('reordenada', anterior)
  if (tinhaFoco) {
    nextTick(() => gatilhos()[visiveis.value.findIndex(x => x.reference === id)]?.focus())
  }
}

const posicao = (id: string) => visualizacoes.value.findIndex(v => v.reference === id)

/** Teclado: Ctrl + Shift + seta move a ativa; F2 renomeia a ativa; Shift + F10 abre o menu dela (WAI-ARIA APG). */
function aoTeclar(e: KeyboardEvent) {
  if (renomeando.value) return
  if (e.key === 'F10' && e.shiftKey) {
    e.preventDefault()
    menuAberto.value = true
    return
  }
  if (e.key === 'F2' && podeRenomear(ativaObj.value) ) {
    e.preventDefault()
    comecarARenomear(ativa.value)
    return
  }
  if (!(e.ctrlKey && e.shiftKey) || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return
  e.preventDefault()
  if (ativa.value === SISTEMA) return
  const i = posicao(ativa.value)
  mover(ativa.value, e.key === 'ArrowLeft' ? i - 1 : i + 1)
}

/** Abre no clique (soltar sem arrastar), não no mousedown, como nas folders. */
function segurarAtivacao(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('[data-slot=trigger]')) e.stopPropagation()
}

function aoClicar(e: MouseEvent) {
  if (e.button !== 0 || renomeando.value) return
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  const v = el ? visiveis.value[gatilhos().indexOf(el)] : undefined
  if (v) ativa.value = v.reference
}

function aoClicarDuasVezes(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  const v = el ? visiveis.value[gatilhos().indexOf(el)] : undefined
  if (v && podeRenomear(v)) comecarARenomear(v.reference)
}

/* ---------- renomear na própria pílula ---------- */

const renomeando = ref<string | null>(null)
const nomeNovo = ref('')
const posRenomear = ref<{ left: number, top: number, width: number, height: number } | null>(null)
const campoRenomear = ref<{ inputRef: HTMLInputElement } | null>(null)

function comecarARenomear(id: string) {
  const v = visualizacoes.value.find(x => x.reference === id)
  if (!v) return
  if (!visiveis.value.includes(v)) ativa.value = id
  nextTick(() => {
    const el = gatilhos()[visiveis.value.findIndex(x => x.reference === id)]
    if (!el || !barra.value) return
    const base = barra.value.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    posRenomear.value = { left: r.left - base.left, top: r.top - base.top, width: Math.max(r.width, 176), height: r.height }
    nomeNovo.value = nomeDe(v)
    renomeando.value = id
    nextTick(() => campoRenomear.value?.inputRef?.select())
  })
}

function concluirRenomear(gravar: boolean) {
  const id = renomeando.value
  if (!id) return
  renomeando.value = null
  const nome = nomeNovo.value.trim()
  const v = visualizacoes.value.find(x => x.reference === id)!
  // Nome repetido não grava (Polaris recusa com mensagem; aqui o nome volta e o aviso explica).
  const repetido = visualizacoes.value.some(x => x.reference !== id && nomeDe(x).toLowerCase() === nome.toLowerCase())
  if (gravar && repetido) {
    anuncio.value = props.t.barra.nomeRepetido
    emit('nomeRepetido', nome)
  }
  else if (gravar && nome && nome !== nomeDe(v)) {
    const anterior = nomeDe(v)
    visualizacoes.value = visualizacoes.value.map(x => x.reference === id ? { ...x, name: nome } : x)
    emit('renomeada', id, anterior)
  }
  nextTick(() => gatilhos()[visiveis.value.findIndex(x => x.reference === id)]?.focus())
}

/* ---------- menus ---------- */

const doMenu = ref<Visualizacao | null>(null)

function aoBotaoDireito(e: MouseEvent) {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-slot=trigger]')
  doMenu.value = el ? visiveis.value[gatilhos().indexOf(el)] ?? null : null
}

/**
 * Regra do protótipo (rodada 3): as fixadas ficam juntas, logo depois de Itens, na ordem em que foram fixadas.
 * A 1ª fixada fica na posição 1; cada nova fixada entra à direita da última fixada.
 * Desafixar leva a visualização para logo depois das que continuam fixadas.
 * A lista nova sai numa gravação só: com o `defineModel`, a 2ª gravação seguida leria a lista antiga.
 */
function fixar(v: Visualizacao) {
  const fixou = !v.fixada
  const resto = visualizacoes.value.filter(x => x.reference !== v.reference)
  const atualizada = { ...v, fixada: fixou }
  const para = resto.filter(x => x.fixada).length + 1
  visualizacoes.value = [...resto.slice(0, para), atualizada, ...resto.slice(para)]
  anuncio.value = props.t.barra.movida(nomeDe(v), para + 1)
  if (!visiveis.value.some(x => x.reference === v.reference)) ativa.value = v.reference
  emit('fixada', v.reference, fixou)
}

/*
 * Rodada 7: ocultar e minimizar mudam só a barra de quem fez, como fixar.
 * Oculta: sai da barra e fica na lista do "+N". Minimizada: a pílula mostra só o ícone, e o nome fica no tooltip.
 */
function alternarOculta(v: Visualizacao) {
  const oculta = !v.oculta
  visualizacoes.value = visualizacoes.value.map(x => x.reference === v.reference ? { ...x, oculta } : x)
  emit('ocultada', v.reference, oculta)
}
function alternarMinimizada(v: Visualizacao) {
  visualizacoes.value = visualizacoes.value.map(x => x.reference === v.reference ? { ...x, minimizada: !x.minimizada } : x)
}

/** Renomeia quem é Owner ou Full, ou quem é dono da visualização só dele. Itens não se renomeia. */
function podeRenomear(v?: Visualizacao) {
  return !!v && v.reference !== SISTEMA && (props.ehOwner || v.user === EU.id || !!v.novo)
}

function acoesDe(v: Visualizacao, naLista = false): ContextMenuItem[][] {
  const t = props.t.menu
  const sistema = v.reference === SISTEMA
  // Em criação: ainda não existe para os outros; o único caminho além do painel é desistir.
  if (v.novo) return [[{ label: t.descartarNova, icon: 'i-lucide-x', onSelect: () => emit('descartarNova', v.reference) }]]
  const grupos: ContextMenuItem[][] = []
  const minha = v.user === EU.id
  const gerais: ContextMenuItem[] = []
  if (podeRenomear(v)) gerais.push({ label: t.renomear, icon: 'i-lucide-pencil', kbds: ['f2'], onSelect: () => naLista ? renomearNaLista(v.reference) : comecarARenomear(v.reference) })
  gerais.push({ label: t.configurar, icon: 'i-lucide-sliders-horizontal', onSelect: () => emit('configurar', v.reference) })
  gerais.push({ label: t.duplicar, icon: 'i-lucide-copy', onSelect: () => emit('duplicar', v.reference) })
  gerais.push({ label: t.copiarLink, icon: 'i-lucide-link', onSelect: () => emit('copiarLink', v.reference) })
  grupos.push(gerais)

  // Só para mim: o que muda só a barra e a versão desta pessoa.
  const soMinhas: ContextMenuItem[] = [{ type: 'label', label: t.soParaMim }]
  if (!sistema) soMinhas.push({ label: v.fixada ? t.desafixar : t.fixar, icon: v.fixada ? 'i-lucide-pin-off' : 'i-lucide-pin', onSelect: () => fixar(v) })
  soMinhas.push(v.minimizada
    ? { label: t.mostrarNome, icon: 'i-lucide-maximize-2', onSelect: () => alternarMinimizada(v) }
    : { label: t.minimizar, icon: 'i-lucide-minimize-2', description: t.minimizarAjuda, onSelect: () => alternarMinimizada(v) })
  if (!sistema) {
    soMinhas.push(v.oculta
      ? { label: t.mostrarNaBarra, icon: 'i-lucide-eye', onSelect: () => alternarOculta(v) }
      : { label: t.ocultar, icon: 'i-lucide-eye-off', description: t.ocultarAjuda, onSelect: () => alternarOculta(v) })
  }
  if (props.pessoais.includes(v.reference)) soMinhas.push({ label: t.versaoDeTodos, icon: 'i-lucide-users', description: t.versaoDeTodosAjuda, onSelect: () => emit('restaurarVersao', v.reference) })
  if (props.ehOwner) soMinhas.push({ label: t.recuperarOrdem, icon: 'i-lucide-rotate-ccw', disabled: props.ordemEhPadrao, onSelect: () => emit('recuperarOrdem') })
  if (minha && !props.ehOwner) soMinhas.push({ label: t.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => emit('excluir', v.reference) })
  if (soMinhas.length > 1) grupos.push(soMinhas)

  // Para todos: só Owner ou Full.
  if (props.ehOwner) {
    grupos.push([
      { type: 'label', label: t.paraTodos },
      v.default
        ? { label: t.padrao, icon: 'i-lucide-house', disabled: true, description: t.jaEPadrao }
        : { label: t.definirPadrao, icon: 'i-lucide-house', onSelect: () => emit('definirPadrao', v.reference) },
      { label: t.aplicarOrdem, icon: 'i-lucide-list-ordered', disabled: props.ordemEhPadrao, onSelect: () => emit('aplicarOrdem') },
      sistema || v.default
        ? { label: t.excluir, icon: 'i-lucide-trash-2', disabled: true, description: sistema ? t.naoExcluiSistema : t.naoExcluiPadrao }
        : { label: t.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => emit('excluir', v.reference) },
    ])
  }
  return grupos
}

const itensDoMenu = computed<ContextMenuItem[][]>(() => doMenu.value ? acoesDe(doMenu.value) : [])

/* ---------- "+N" ---------- */

const listaAberta = ref(false)
const busca = ref('')

/*
 * Rodada 5: o "+N" é o editor de todas as visualizações, não só o depósito das que não cabem.
 * A lista mostra todas, na ordem da barra; uma linha divide as que estão na barra das que não cabem.
 * Cada linha arrasta, abre, renomeia no lugar (clique duplo) e tem o "⋯" com as ações da pílula.
 */
const filtradas = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return q ? visualizacoes.value.filter(v => nomeDe(v).toLowerCase().includes(q)) : visualizacoes.value
})

/** A 1ª que não cabe na barra: a linha divisória aparece antes dela (sem busca). */
const primeiraFora = computed(() => busca.value ? null : visualizacoes.value.find(v => !visiveis.value.includes(v) && !v.oculta)?.reference ?? null)

function abrirDaLista(v: Visualizacao) {
  ativa.value = v.reference
  listaAberta.value = false
  busca.value = ''
}

/* O clique abre depois de 250 ms: se vier o 2º clique, é renomear, e a lista fica aberta. */
let cliqueNaLista: ReturnType<typeof setTimeout> | null = null
function aoClicarNaLinha(v: Visualizacao, e: MouseEvent) {
  if (cliqueNaLista) clearTimeout(cliqueNaLista)
  if (e.detail > 1) {
    cliqueNaLista = null
    renomearNaLista(v.reference)
    return
  }
  cliqueNaLista = setTimeout(() => { cliqueNaLista = null; abrirDaLista(v) }, 250)
}

/* "Nova visualização" no fim da lista: o foco não volta para o "+N", senão fecharia o catálogo que abre em seguida. */
let indoParaNova = false
function novaPelaLista() {
  indoParaNova = true
  listaAberta.value = false
  emit('nova')
}
function aoDevolverFoco(e: Event) {
  if (!indoParaNova) return
  indoParaNova = false
  e.preventDefault()
}

/* Renomear na lista: o campo aparece na própria linha e grava pelo mesmo caminho da pílula. */
function renomearNaLista(id: string) {
  const v = visualizacoes.value.find(x => x.reference === id)
  if (!v || !podeRenomear(v)) return
  posRenomear.value = null
  nomeNovo.value = nomeDe(v)
  renomeando.value = id
  nextTick(() => lista.value?.querySelector<HTMLInputElement>('[data-renomear] input')?.select())
}

/*
 * Arrastar dentro do "+N": drag and drop nativo, com a linha-guia onde a visualização vai cair.
 * Com busca preenchida não arrasta (a lista filtrada não mostra a ordem inteira).
 * Teclado: setas andam entre as linhas; Ctrl + Shift + seta para cima ou para baixo move a linha em foco.
 */
const lista = ref<HTMLElement>()
const arrastandoNaLista = ref<string | null>(null)
const alvoNaLista = ref<number | null>(null)

/** Põe `id` antes da escondida da posição `alvo` (ou depois da última), na lista inteira. */
function moverNaLista(id: string, alvo: number) {
  const anterior = visualizacoes.value
  const v = anterior.find(x => x.reference === id)!
  const destino = filtradas.value[alvo]?.reference
  const resto = anterior.filter(x => x.reference !== id)
  let para = destino && destino !== id
    ? resto.findIndex(x => x.reference === destino)
    : resto.findIndex(x => x.reference === filtradas.value.filter(e => e.reference !== id).at(-1)?.reference) + 1
  if (destino === id) return
  para = Math.max(1, para)
  const nova = [...resto.slice(0, para), v, ...resto.slice(para)]
  if (nova.every((x, i) => x.reference === anterior[i]!.reference)) return
  visualizacoes.value = nova
  anuncio.value = props.t.barra.movida(nomeDe(v), para + 1)
  emit('reordenada', anterior)
}

function soltarNaLista() {
  if (arrastandoNaLista.value && alvoNaLista.value !== null) moverNaLista(arrastandoNaLista.value, alvoNaLista.value)
  arrastandoNaLista.value = null
  alvoNaLista.value = null
}

/* Arrasto por ponteiro, como na barra: engata depois de um movimento pequeno; a linha-guia mostra onde cai. */
let inicioNaLista: { id: string, y: number, engatou: boolean } | null = null

function aoPressionarLinha(e: PointerEvent, v: Visualizacao) {
  if (e.button !== 0 || busca.value || v.reference === 'default' || renomeando.value) return
  inicioNaLista = { id: v.reference, y: e.clientY, engatou: false }
  window.addEventListener('pointermove', aoMoverLinha)
  window.addEventListener('pointerup', aoSoltarLinha, { once: true })
}

function aoMoverLinha(e: PointerEvent) {
  if (!inicioNaLista || !lista.value) return
  if (!inicioNaLista.engatou && Math.abs(e.clientY - inicioNaLista.y) < 4) return
  inicioNaLista.engatou = true
  arrastandoNaLista.value = inicioNaLista.id
  const linhasEl = [...lista.value.querySelectorAll<HTMLElement>('li')]
  const i = linhasEl.findIndex((li) => {
    const r = li.getBoundingClientRect()
    return e.clientY < r.top + r.height / 2
  })
  alvoNaLista.value = i < 0 ? linhasEl.length : i
}

function aoSoltarLinha() {
  window.removeEventListener('pointermove', aoMoverLinha)
  const engatou = inicioNaLista?.engatou
  inicioNaLista = null
  if (!engatou) return
  const engolir = (ev: MouseEvent) => ev.stopPropagation()
  window.addEventListener('click', engolir, { capture: true, once: true })
  setTimeout(() => window.removeEventListener('click', engolir, { capture: true }), 0)
  soltarNaLista()
}

function linhas(): HTMLElement[] {
  return lista.value ? [...lista.value.querySelectorAll<HTMLElement>('[data-linha]')] : []
}

function aoTeclarNaLista(e: KeyboardEvent) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
  if (renomeando.value) return
  const els = linhas()
  const i = els.indexOf(document.activeElement as HTMLElement)
  e.preventDefault()
  if (e.ctrlKey && e.shiftKey && i >= 0 && !busca.value) {
    const id = filtradas.value[i]!.reference
    if (id === 'default') return
    const alvo = e.key === 'ArrowUp' ? i - 1 : i + 2
    if (alvo < 0 || alvo > filtradas.value.length) return
    moverNaLista(id, alvo)
    nextTick(() => linhas()[filtradas.value.findIndex(x => x.reference === id)]?.focus())
    return
  }
  const j = i < 0 ? 0 : (e.key === 'ArrowDown' ? Math.min(els.length - 1, i + 1) : Math.max(0, i - 1))
  els[j]?.focus()
}

/* ---------- seta ⌄ na ativa ---------- */

const posMenu = ref<{ left: number, top: number, height: number } | null>(null)
const menuAberto = ref(false)
const deslocMenu = ref(0)
const menuSemTransicao = ref(false)

function posicionarMenu() {
  if (!barra.value) return
  const el = barra.value.querySelector<HTMLElement>('[data-slot=trigger][data-state=active]')
  if (!el) {
    posMenu.value = null
    return
  }
  const base = barra.value.getBoundingClientRect()
  const r = el.getBoundingClientRect()
  posMenu.value = { left: r.right - base.left - 26, top: r.top - base.top, height: r.height }
  deslocMenu.value = 0
  requestAnimationFrame(() => { menuSemTransicao.value = false })
}

watch([ativa, visiveis, larguraDisponivel, () => props.modificada], () => nextTick(() => requestAnimationFrame(posicionarMenu)))

/**
 * O `UTabs` põe o aria-label na raiz, não no `tablist`: o leitor de tela anuncia a lista sem nome.
 * No produto, o rótulo vai direto no `TabsList`.
 */
function rotularLista() {
  barra.value?.querySelector('[role=tablist]')?.setAttribute('aria-label', props.t.barra.rotulo)
}
watch([visiveis, () => props.t], () => nextTick(rotularLista))
onMounted(() => nextTick(rotularLista))

const ativaObj = computed(() => visualizacoes.value.find(v => v.reference === ativa.value))

defineExpose({ comecarARenomear })

/* ---------- aparência: só prop `ui`, só token ---------- */

const ui = {
  root: 'gap-0',
  list: 'gap-1 bg-transparent p-0 overflow-x-clip',
  indicator: 'hidden',
  trigger: [
    'grow-0 h-8 rounded-md px-2.5 gap-1.5 text-sm cursor-pointer select-none isolate',
    'transition-[color,background-color,padding,transform] duration-200 ease-out',
    'data-[state=inactive]:text-muted hover:data-[state=inactive]:bg-elevated hover:data-[state=inactive]:text-highlighted',
    // Texto da ativa em text-highlighted: o rosa sobre o fundo rosa claro dá 2,88:1 e não passa (WCAG 1.4.3).
    // A cor de destaque fica no fundo e no ícone.
    'data-[state=active]:bg-primary/10 data-[state=active]:text-highlighted data-[state=active]:font-semibold data-[state=active]:pr-8',
    // Arrastando: a própria pílula segue o mouse, por cima das vizinhas, com o fundo dela; sem sombra nem cópia.
    'data-[arrastando=true]:z-10 data-[arrastando=true]:cursor-grabbing data-[arrastando=true]:ring data-[arrastando=true]:ring-default',
    'data-[arrastando=true]:data-[state=inactive]:bg-elevated data-[arrastando=true]:data-[state=inactive]:text-highlighted',
    'data-[arrastando=true]:data-[state=active]:bg-default',
  ].join(' '),
  leadingIcon: 'size-4 in-data-[state=active]:text-primary',
  label: 'max-w-40 truncate',
}
</script>

<template>
  <div class="relative min-w-0">
    <!-- Régua invisível: mede cada pílula (já com o corte de largura) para saber quantas cabem. -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-hidden" aria-hidden="true">
      <div ref="medidas" class="invisible flex w-max whitespace-nowrap">
        <span
          v-for="v in visualizacoes"
          :key="v.reference"
          :data-medida="v.reference"
          class="inline-flex items-center gap-1.5 px-2.5 text-sm font-semibold"
        >
          <UIcon :name="v.icon ?? 'i-lucide-table'" class="size-4" />
          <span v-if="!v.minimizada" class="max-w-40 truncate">{{ nomeDe(v) }}</span>
          <UIcon v-if="v.fixada" name="i-lucide-pin" class="size-3" />
          <UIcon v-if="pessoais.includes(v.reference)" name="i-lucide-user-round" class="size-3" />
        </span>
      </div>
    </div>

    <div
      ref="barra"
      class="relative min-w-0"
      @pointerdown="aoPressionar"
      @mousedown.capture="segurarAtivacao"
      @click="aoClicar"
      @keydown="aoTeclar"
      @dblclick="aoClicarDuasVezes"
    >
      <UContextMenu :items="itensDoMenu" :ui="{ content: 'w-64', itemDescription: 'whitespace-normal' }">
        <div @contextmenu.capture="aoBotaoDireito">
          <!-- A chave remonta a barra quando a ordem muda: as setas do teclado seguem a ordem da tela. -->
          <UTabs
            :key="visiveis.map(v => v.reference).join()"
            v-model="ativa"
            :items="itensDasAbas"
            variant="pill"
            color="primary"
            size="sm"
            :content="false"
            activation-mode="manual"
            :ui="ui"
            :aria-label="t.barra.rotulo"
            :class="arrastando ? '[&_[data-slot=trigger]]:cursor-grabbing' : ''"
          >
            <template #default="{ item }">
              <!--
                Rodada 5: a dica organizada em partes. Nome e descrição; o tipo e quem vê em etiquetas;
                filtros e ordenação em 2 colunas, cada filtro numa etiqueta; o atalho no rodapé. Sem a contagem de itens.
              -->
              <UTooltip
                :delay-duration="500"
                :disabled="!!arrastando"
                :content="{ side: 'bottom', align: 'start', sideOffset: 6 }"
                :ui="{ content: 'h-auto w-80 max-w-80 flex-col items-stretch gap-0 p-0' }"
              >
                <span v-if="item.vis.minimizada" class="sr-only">{{ item.label }}</span>
                <span v-else class="max-w-40 truncate">{{ item.label }}</span>
                <template #content>
                  <div class="space-y-2.5 p-3 text-left">
                    <div class="space-y-1.5">
                      <p class="whitespace-normal text-sm font-semibold text-highlighted">{{ item.label }}</p>
                      <p v-if="resumoDe(item.vis).descricao" class="whitespace-normal text-xs text-muted">{{ resumoDe(item.vis).descricao }}</p>
                      <div class="flex flex-wrap gap-1">
                        <UBadge
                          :label="resumoDe(item.vis).tipo === 'kanban' ? t.catalogo.kanban : t.catalogo.tabela"
                          :icon="resumoDe(item.vis).tipo === 'kanban' ? 'i-lucide-square-kanban' : 'i-lucide-table'"
                          color="neutral"
                          variant="soft"
                          size="sm"
                        />
                        <UBadge
                          :label="resumoDe(item.vis).quemVe === 'eu' ? t.resumo.soVoce : resumoDe(item.vis).quemVe === 'grupos' ? t.resumo.grupos(resumoDe(item.vis).grupos ?? '') : t.resumo.todosVeem"
                          :icon="resumoDe(item.vis).quemVe === 'eu' ? 'i-lucide-lock' : resumoDe(item.vis).quemVe === 'grupos' ? 'i-lucide-users' : 'i-lucide-globe'"
                          color="neutral"
                          variant="soft"
                          size="sm"
                          :ui="{ label: 'whitespace-normal' }"
                        />
                        <UBadge v-if="pessoais.includes(item.value)" :label="t.barra.versaoSua" icon="i-lucide-user-round" color="info" variant="soft" size="sm" />
                        <UBadge v-if="resumoDe(item.vis).naoSalva" :label="t.resumo.naoSalva" color="warning" variant="soft" size="sm" />
                      </div>
                    </div>

                    <dl class="grid grid-cols-[5.5rem_1fr] items-start gap-x-2 gap-y-2 border-t border-default pt-2.5 text-xs">
                      <template v-if="resumoDe(item.vis).agrupadoPor">
                        <dt class="pt-0.5 text-muted">{{ t.dica.agrupado }}</dt>
                        <dd><UBadge :label="resumoDe(item.vis).agrupadoPor" color="neutral" variant="outline" size="sm" /></dd>
                      </template>
                      <dt class="pt-0.5 text-muted">{{ t.dica.filtros }}</dt>
                      <dd class="flex flex-wrap gap-1">
                        <template v-for="f in resumoDe(item.vis).filtros" :key="f.texto">
                          <span v-if="f.ou" class="pt-0.5 text-dimmed">{{ t.dica.ou }}</span>
                          <UBadge
                            :label="f.texto"
                            color="neutral"
                            variant="outline"
                            size="sm"
                            :ui="{ label: 'whitespace-normal text-left' }"
                          />
                        </template>
                        <span v-if="!resumoDe(item.vis).filtros.length" class="pt-0.5 text-dimmed">{{ t.dica.semFiltro }}</span>
                      </dd>
                      <template v-if="resumoDe(item.vis).ordenacao.length">
                        <dt class="pt-0.5 text-muted">{{ t.dica.ordenacao }}</dt>
                        <dd class="flex flex-wrap gap-1">
                          <UBadge
                            v-for="o in resumoDe(item.vis).ordenacao"
                            :key="o.campo"
                            :label="o.campo"
                            :icon="o.crescente ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'"
                            color="neutral"
                            variant="outline"
                            size="sm"
                          />
                        </dd>
                      </template>
                    </dl>
                  </div>
                  <div v-if="item.value !== 'default'" class="flex flex-wrap gap-x-3 gap-y-1 border-t border-default bg-elevated/50 px-3 py-2 text-xs text-dimmed">
                    <span class="flex items-center gap-1"><UIcon name="i-lucide-grip-vertical" class="size-3.5" />{{ t.dica.arrastar }}</span>
                    <span class="flex items-center gap-1"><UIcon name="i-lucide-mouse-pointer-click" class="size-3.5" />{{ t.dica.renomear }}</span>
                  </div>
                </template>
              </UTooltip>
            </template>
            <template #trailing="{ item }">
              <UIcon v-if="item.vis.fixada" name="i-lucide-pin" class="size-3 shrink-0 text-dimmed" :aria-label="t.barra.fixadaRotulo" />
              <UIcon v-if="pessoais.includes(item.value)" name="i-lucide-user-round" class="size-3 shrink-0 text-dimmed" :aria-label="t.barra.versaoSua" />
              <span
                v-if="item.value !== ativa && modificadas.includes(item.value)"
                class="size-2 shrink-0 rounded-full bg-warning"
                role="img"
                :aria-label="t.barra.naoSalva"
              />
            </template>

            <template #list-trailing>
              <!-- Rodada 5: o "+N" e o "+ Visualização" vêm logo depois da última pílula, como no Notion e no ClickUp. Presos na ponta direita, com poucas visualizações, ficavam longe de onde a pessoa olha. -->
              <div class="flex shrink-0 items-center gap-0.5 self-center pl-1" @pointerdown.stop>
                <!-- Rodada 7: o "+N" só existe quando alguma visualização fica fora da barra (não cabe ou foi ocultada). -->
                <UPopover v-if="escondidas.length" v-model:open="listaAberta" :content="{ align: 'end', sideOffset: 6, onCloseAutoFocus: aoDevolverFoco }">
                  <UButton
                    :label="`+${escondidas.length}`"
                    trailing-icon="i-lucide-chevron-down"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    :aria-label="t.barra.maisVisualizacoes(escondidas.length)"
                    class="text-muted"
                  />
                  <template #content>
                    <!--
                      Lista própria, não o UCommandPalette: o CommandPalette não reordena.
                      Busca em cima, linhas com alça de arrastar, menu "⋯" por linha.
                    -->
                    <div class="w-80" @keydown="aoTeclarNaLista">
                      <UInput
                        v-model="busca"
                        icon="i-lucide-search"
                        :placeholder="t.barra.pesquisar"
                        variant="none"
                        autofocus
                        class="w-full border-b border-default"
                        :ui="{ base: 'h-10 text-sm' }"
                      />
                      <p v-if="!filtradas.length" class="py-4 text-center text-sm text-muted">{{ t.barra.nenhumaEncontrada }}</p>
                      <ul
                        v-else
                        ref="lista"
                        class="max-h-[min(30rem,62vh)] overflow-y-auto p-1"
                        :aria-label="t.barra.todas"
                      >
                        <TransitionGroup move-class="transition-transform duration-200 ease-out">
                          <li
                            v-for="(v, i) in filtradas"
                            :key="v.reference"
                            class="relative"
                            @pointerdown="(e: PointerEvent) => aoPressionarLinha(e, v)"
                          >
                            <!-- Divisória: daqui para baixo, as que não cabem na barra -->
                            <p v-if="v.reference === primeiraFora" class="mx-1 mb-1 mt-1.5 border-t border-default px-1 pt-2 text-xs font-medium text-muted">
                              {{ t.barra.foraDaBarra }}
                            </p>
                            <div
                              class="group/linha relative flex select-none items-center gap-1.5 rounded-md py-0.5 pl-1 pr-0.5 text-sm hover:bg-elevated focus-within:bg-elevated"
                              :class="[
                                arrastandoNaLista === v.reference ? 'opacity-40' : (busca || v.reference === 'default' ? '' : 'cursor-grab'),
                                v.reference === ativa ? 'bg-elevated/60 font-medium text-highlighted' : 'text-default',
                              ]"
                            >
                              <span v-if="arrastandoNaLista && alvoNaLista === i" class="absolute inset-x-1 -top-px h-0.5 rounded-full bg-primary" />
                              <span v-if="arrastandoNaLista && alvoNaLista === i + 1 && i === filtradas.length - 1" class="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary" />
                              <UIcon
                                name="i-lucide-grip-vertical"
                                class="size-4 shrink-0 text-dimmed"
                                :class="busca || v.reference === 'default' ? 'invisible' : 'cursor-grab'"
                              />
                              <div v-if="renomeando === v.reference && !posRenomear" data-renomear class="min-w-0 flex-1 py-0.5" @pointerdown.stop>
                                <UInput
                                  v-model="nomeNovo"
                                  size="xs"
                                  autofocus
                                  :aria-label="t.barra.novoNome"
                                  class="w-full"
                                  @keydown.enter.prevent="concluirRenomear(true)"
                                  @keydown.esc.prevent.stop="concluirRenomear(false)"
                                  @blur="concluirRenomear(true)"
                                />
                              </div>
                              <button
                                v-else
                                type="button"
                                data-linha
                                class="flex min-w-0 flex-1 items-center gap-2 rounded py-1 text-left outline-none"
                                @click="(e: MouseEvent) => aoClicarNaLinha(v, e)"
                                @keydown.enter.prevent="abrirDaLista(v)"
                              >
                                <UIcon :name="v.icon ?? 'i-lucide-table'" class="size-4 shrink-0" :class="v.reference === ativa ? 'text-primary' : 'text-muted'" />
                                <span class="truncate" :class="v.oculta ? 'text-muted' : ''">{{ nomeDe(v) }}</span>
                                <UIcon v-if="v.fixada" name="i-lucide-pin" class="size-3 shrink-0 text-dimmed" :aria-label="t.barra.fixadaRotulo" />
                                <UIcon v-if="v.oculta" name="i-lucide-eye-off" class="size-3 shrink-0 text-dimmed" :aria-label="t.barra.ocultaRotulo" />
                                <UIcon v-if="v.minimizada" name="i-lucide-minimize-2" class="size-3 shrink-0 text-dimmed" :aria-label="t.barra.minimizadaRotulo" />
                                <UIcon v-if="pessoais.includes(v.reference)" name="i-lucide-user-round" class="size-3 shrink-0 text-dimmed" :aria-label="t.barra.versaoSua" />
                                <span v-if="modificadas.includes(v.reference)" class="size-2 shrink-0 rounded-full bg-warning" role="img" :aria-label="t.barra.naoSalva" />
                                <UIcon v-if="v.reference === ativa" name="i-lucide-check" class="ml-auto size-4 shrink-0 text-primary" :aria-label="t.barra.ativaRotulo" />
                              </button>
                              <UDropdownMenu :items="acoesDe(v, true)" :content="{ align: 'start', side: 'right' }" :ui="{ content: 'w-64', itemDescription: 'whitespace-normal' }">
                              <UButton
                                icon="i-lucide-ellipsis"
                                color="neutral"
                                variant="ghost"
                                size="xs"
                                class="opacity-0 transition-opacity group-hover/linha:opacity-100 group-focus-within/linha:opacity-100 data-[state=open]:opacity-100"
                                :aria-label="t.barra.opcoes(nomeDe(v))"
                                @pointerdown.stop
                              />
                            </UDropdownMenu>
                            </div>
                          </li>
                        </TransitionGroup>
                      </ul>
                      <p v-if="filtradas.length > 1 && !busca" class="px-3 pb-1.5 text-xs text-muted">{{ t.barra.dicaLista }}</p>
                      <div class="border-t border-default p-1">
                        <UButton
                          :label="t.catalogo.titulo"
                          icon="i-lucide-plus"
                          color="neutral"
                          variant="ghost"
                          size="sm"
                          block
                          class="justify-start"
                          @click="novaPelaLista"
                        />
                      </div>
                      <!-- Owner ou Full: a ordem da barra, a dele e a de todos (as mesmas 2 ações das folders). -->
                      <div v-if="ehOwner" class="border-t border-default p-1">
                        <UButton
                          :label="t.menu.aplicarOrdem"
                          icon="i-lucide-list-ordered"
                          color="neutral"
                          variant="ghost"
                          size="sm"
                          block
                          class="justify-start"
                          :disabled="ordemEhPadrao"
                          @click="emit('aplicarOrdem'); listaAberta = false"
                        />
                        <UButton
                          :label="t.menu.recuperarOrdem"
                          icon="i-lucide-rotate-ccw"
                          color="neutral"
                          variant="ghost"
                          size="sm"
                          block
                          class="justify-start"
                          :disabled="ordemEhPadrao"
                          @click="emit('recuperarOrdem'); listaAberta = false"
                        />
                      </div>
                    </div>
                  </template>
                </UPopover>

                <slot name="criar" />
              </div>
            </template>
          </UTabs>
        </div>
      </UContextMenu>

      <!-- Seta ⌄ e ponto de "mudança não salva" na ativa: botão à parte, sobre a ponta da pílula, como nas folders. -->
      <UDropdownMenu
        v-if="posMenu && ativaObj && !renomeando"
        v-model:open="menuAberto"
        :items="acoesDe(ativaObj)"
        :content="{ align: 'start', sideOffset: 4 }"
        :ui="{ content: 'w-64', itemDescription: 'whitespace-normal' }"
      >
        <UButton
          color="neutral"
          variant="link"
          size="xs"
          class="absolute size-6 justify-center p-0 text-muted hover:text-highlighted"
          :class="arrastando === ativa ? 'z-20' : 'z-[5]'"
          :style="{
            left: `${posMenu.left}px`,
            top: `${posMenu.top + posMenu.height / 2 - 12}px`,
            transform: `translateX(${deslocMenu}px)`,
            transition: menuSemTransicao ? 'none' : 'transform 200ms ease-out',
          }"
          :aria-label="t.barra.opcoes(nomeDe(ativaObj))"
          @pointerdown.stop
        >
          <span class="relative flex size-4 items-center justify-center">
            <UIcon name="i-lucide-chevron-down" class="size-4" />
            <span
              v-if="modificada"
              class="absolute -right-1 -top-1 size-2 rounded-full bg-warning ring-2 ring-(--ui-bg)"
              :title="t.barra.naoSalva"
            />
          </span>
        </UButton>
      </UDropdownMenu>

      <!-- Renomear: o campo aparece no lugar da pílula. Enter grava, Esc desiste, sair do campo grava. -->
      <div
        v-if="renomeando && posRenomear"
        class="absolute z-30"
        :style="{ left: `${posRenomear.left}px`, top: `${posRenomear.top}px`, width: `${posRenomear.width}px` }"
      >
        <UInput
          ref="campoRenomear"
          v-model="nomeNovo"
          size="sm"
          autofocus
          :aria-label="t.barra.novoNome"
          class="w-full"
          :ui="{ base: 'h-8 font-semibold' }"
          @keydown.enter.prevent="concluirRenomear(true)"
          @keydown.esc.prevent="concluirRenomear(false)"
          @blur="concluirRenomear(true)"
        />
      </div>
    </div>

    <span class="sr-only" aria-live="polite">{{ anuncio }}</span>
  </div>
</template>
