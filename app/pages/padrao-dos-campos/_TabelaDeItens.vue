<script setup lang="ts">
/**
 * A tabela da tela nova de itens: o formato CÉLULA, e ele edita.
 *
 * A tabela em si é o `EnTable` do `@be-enlighten/enspace-sdk-ui` (regra 21):
 * colunas, ordenação, seleção, paginação e os slots `#cell-{key}`. O que a
 * proposta acrescenta é o CONTEÚDO de cada célula e o comportamento dela.
 *
 * ## Os três gestos da tabela
 *
 * | Gesto | O que faz |
 * |---|---|
 * | clique no valor da célula | entra em **edição ali mesmo** |
 * | clique no nome da coluna | abre a **ficha do tipo** |
 * | duplo clique na linha | abre a **visão rápida** do item |
 *
 * O duplo clique é o gesto do develop (medido em 22/09/2026). O clique único
 * para editar é a proposta: hoje a célula não edita.
 *
 * ## Onde a edição acontece
 *
 * Dentro da linha, quando o controle cabe na altura de uma linha. Em camada
 * flutuante, quando não cabe: texto longo, bloco de subcampos, lista de
 * caixas, anexo, repetidor. O que vai para cada lado está no catálogo, em
 * `edicaoEmPopover`, e a razão é a do documento do time de produtos: conteúdo
 * extenso não pode esticar a altura da linha.
 *
 * Campo que o sistema preenche (`somenteLeitura`) não entra em edição e não
 * ganha hover, porque hover que promete clique tem que entregar clique.
 *
 * A largura de cada coluna vem do catálogo (`campo.largura`), e é a mesma que
 * o dev vai usar.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui'
import type { Item } from '@be-enlighten/enspace-sdk-schemas'
import type { Campo } from './campos'
import type { Textos } from './textos'
import BarraDeSelecao from './_BarraDeSelecao.vue'
import EntradaDoCampo from './_EntradaDoCampo.vue'
import ValorDoCampo from './_ValorDoCampo.vue'
import { estaVazio } from './formatacao'

const props = defineProps<{
  campos: Campo[]
  itens: Item[]
  t: Textos
  idioma: string
  total: number
  carregando?: boolean
  campoSelecionado?: string | null
  /** Quem pode configurar o campo vê as ações de opção dentro da célula. */
  podeConfigurar?: boolean
  /**
   * As larguras que a pessoa arrastou, por `key` de coluna.
   *
   * Só o que foi MUDADO mora aqui: o que a pessoa não tocou continua vindo do
   * catálogo. Mapa vazio quer dizer "está tudo no tamanho original", e é o que
   * o botão do andaime devolve.
   */
  larguras?: Record<string, number>
}>()

const emit = defineEmits<{
  inspecionar: [tipo: string, item: Item]
  abrirItem: [item: Item]
  abrirTelaDoItem: [item: Item]
  editarValor: [item: Item, refId: string, valor: unknown]
  novoItem: []
  /** A linha de criação fechou com valor: nasce um item com esses dados. */
  criarNaLinha: [dados: Record<string, unknown>, posicao: number]
  /** O cartão da relação pediu para abrir o registro do outro lado. */
  abrirRelacionado: [referencia: string]
  /** Uma coluna foi redimensionada. */
  'update:larguras': [larguras: Record<string, number>]
  /** A barra da seleção pediu para mandar estes itens para a lixeira. */
  enviarParaLixeira: [itens: Item[]]
  /** Um aviso curto para a tela mostrar. */
  avisar: [mensagem: string]
}>()

const selecionados = ref<Item[]>([])

/* -------------------------------------------------------------------------- *
 *                      O SALTO: a edição sai da tabela                       *
 * -------------------------------------------------------------------------- *
 *
 * Nenhum controle é montado DENTRO da linha. Clicar numa célula abre um quadro
 * que nasce ancorado nela e cresce para fora da tabela, por cima da grade.
 *
 * É o gesto do Notion, e é o que ela pediu com estas palavras: "a gente quer
 * fazer a area de ediçao pular pra fora da tabela quando clicado pra ediçao".
 * As três razões pelas quais ele ganha de editar dentro da célula:
 *
 * 1. a linha tem altura fixa. Dentro dela, tudo o que é maior que uma linha
 *    (lista de opções, conversa, lista de anexos) ou é cortado ou empurra a
 *    tabela inteira. Foi por isso que a dica de "o que salva" não apareceu na
 *    rodada anterior: a célula corta o que passa dela;
 * 2. o quadro tem cabeçalho e rodapé, então cabe o nome do campo e a frase de
 *    "o que salva" no lugar exato onde a pessoa está olhando;
 * 3. o quadro é UM só, com UM componente de entrada dentro. Campo simples e
 *    campo complexo passam pelo mesmo caminho, e é isso que o dev implementa
 *    uma vez.
 *
 * O canto superior esquerdo do quadro fica 8 px acima e à esquerda do canto da
 * célula, e por dentro o quadro tem 8 px de respiro: o valor continua desenhado
 * no MESMO ponto da tela em que estava, e o que muda é a moldura aparecendo em
 * volta. É esse detalhe que dá a sensação de zoom em vez de "abriu um popup".
 */

/** Qual célula está aberta para edição. Uma por vez. */
const emEdicao = ref<{ item: Item, refId: string } | null>(null)

/** A célula clicada, de onde sai a posição do quadro. */
const alvoDaEdicao = ref<HTMLElement | null>(null)
const retanguloDoAlvo = ref<DOMRect | null>(null)

function editando(item: Item, refId: string) {
  return emEdicao.value?.item.id === item.id && emEdicao.value?.refId === refId
}

/**
 * ──────────── ROLAR COM O QUADRO ABERTO, E O QUE ACONTECE ────────────
 *
 * O quadro de edição nasce ancorado na célula: é o gesto do Notion, e essa
 * âncora é a promessa de que se está editando AQUELA célula. Rolar a tabela
 * quebra a promessa de um jeito ou de outro, e só havia duas saídas honestas.
 *
 * Medido no Notion em 24/09/2026, com o editor de seleção múltipla aberto e a
 * tabela rolada na horizontal: **o editor fecha**. Não acompanha, não gruda na
 * borda, não segura a rolagem. Fecha.
 *
 * O que fazemos aqui é o meio termo que o Notion não precisa fazer, porque o
 * quadro dele é pequeno e o nosso tem cabeçalho e rodapé:
 *
 * 1. **enquanto a célula estiver visível, o quadro acompanha.** Rolar um
 *    pouco para ler a coluna do lado não deve custar a edição em andamento;
 * 2. **quando a célula sai da área visível da tabela, o quadro fecha**, com o
 *    mesmo significado de clicar fora: salva no campo que salva sozinho,
 *    descarta no campo que pede Confirmar.
 *
 * O que NÃO fazemos, e por quê:
 *
 * - **grudar o quadro na borda** é o que acontecia antes desta rodada, por
 *   causa do limite que impede o quadro de sair da janela. Ficava um quadro
 *   flutuando apontando para célula nenhuma, e a pessoa editando às cegas;
 * - **travar a rolagem** enquanto edita resolve o problema tirando da pessoa
 *   uma coisa que ela pediu (ver a coluna do lado);
 * - **puxar a rolagem de volta** para manter a célula em vista é o sistema
 *   discutindo com a mão de quem rola.
 *
 * `MINIMO_VISIVEL` existe para o quadro não sobreviver a uma tira de 2 px da
 * célula: com menos que isso na tela, a âncora já não ancora nada.
 */
const MINIMO_VISIVEL = 24

/**
 * QUEM ROLA DE VERDADE.
 *
 * Não é o `raiz` deste componente: é um invólucro que a `UTable` monta por
 * dentro, irmão da `<table>` (medido: `relative overflow-auto ...`). O `raiz`
 * existe e não rola na horizontal, então pendurar o ouvinte nele não
 * acompanhava nada. Achado nesta rodada, junto com o do `scroll` que não sobe
 * para a `window`.
 */
const roladorDaTabela = ref<HTMLElement | null>(null)

function medirAlvo() {
  const alvo = alvoDaEdicao.value
  if (!alvo) return
  const r = alvo.getBoundingClientRect()
  /*
   * A ÁREA VISÍVEL, com uma guarda que não é preciosismo.
   *
   * O invólucro que a `UTable` monta pode medir **zero** de largura: é o que
   * acontece com a janela do navegador oculta ou minimizada, quando o
   * contêiner de flex deixa de ter caixa e só as células, que têm largura
   * explícita, continuam medindo. Sem esta guarda, toda célula era julgada
   * "fora da área" e o quadro fechava no instante em que abria. Peguei
   * exatamente isso testando a rodada 22, e quem paga seria a pessoa com a
   * janela num segundo monitor desligado.
   *
   * Área sem tamanho não é resposta: quando ela vem zerada, ninguém fecha
   * nada, e o quadro segue ancorado onde estava.
   */
  const alvoDaArea = raiz.value ?? roladorDaTabela.value
  const area = alvoDaArea?.getBoundingClientRect()

  if (area && area.width > 0 && area.height > 0) {
    const foraNaHorizontal = r.right < area.left + MINIMO_VISIVEL || r.left > area.right - MINIMO_VISIVEL
    const foraNaVertical = r.bottom < area.top + MINIMO_VISIVEL || r.top > area.bottom - MINIMO_VISIVEL
    if (foraNaHorizontal || foraNaVertical) {
      fecharComoOCampoManda()
      return
    }
  }

  retanguloDoAlvo.value = r
}

/**
 * O valor de quando o quadro abriu, para o Esc poder desfazer.
 *
 * O protótipo grava a cada mudança (é o que faz a tabela reagir ao vivo), e
 * por isso "desfazer" precisa de um retrato do antes. Sem ele o rodapé mentia:
 * dizia "Esc descarta" e o Esc só fechava a janela com o valor já trocado.
 */
const valorAoAbrir = ref<unknown>(undefined)

function abrirEdicao(campo: Campo, item: Item, alvo?: HTMLElement) {
  if (campo.somenteLeitura) return
  emEdicao.value = { item, refId: campo.refId }
  alvoDaEdicao.value = alvo ?? null
  valorAoAbrir.value = ehLinhaNova(item)
    ? rascunhoDaLinha.value[campo.refId]
    : (item.data as Record<string, unknown>)?.[campo.refId]
  medirAlvo()
}

/**
 * O ITEM em edição, lido SEMPRE da lista, e não do retrato guardado.
 *
 * `emEdicao.item` é o objeto que existia no instante do clique. Quem manda na
 * lista troca o objeto do item a cada gravação (`{ ...item, data }`), então o
 * retrato envelhece na hora: o quadro continuava mostrando o valor de quando
 * abriu.
 *
 * Em campo de digitar isso não aparecia, porque o controle guarda o próprio
 * texto. Aparece em tudo que RECALCULA a partir do valor: a consulta do
 * documento em Pessoa/Empresa, o original riscado da moeda corrigida, a lista
 * de anexos, a conversa. Achado testando o bloco de Pessoa/Empresa.
 */
const itemEmEdicao = computed<Item | null>(() => {
  const estado = emEdicao.value
  if (!estado) return null
  if (ehLinhaNova(estado.item)) return linhaNova.value
  return props.itens.find(i => i.id === estado.item.id) ?? estado.item
})

/** O campo que está em edição agora. */
const campoEmEdicao = computed(
  () => props.campos.find(c => c.refId === emEdicao.value?.refId) ?? null,
)

/**
 * Onde o quadro se desenha. Ancorado na célula, com três limites: nunca sai da
 * janela, nunca fica mais estreito do que o campo pede e nunca nasce tão
 * embaixo que não sobre altura para o conteúdo.
 */
/*
 * Medido no Notion em 23/09/2026, com a célula de seleção múltipla: a célula
 * tinha 156x33 e o quadro nasceu em 300x104, ancorado a 2 px do canto da
 * célula. Ou seja: recuo quase nulo e largura mínima de 300. Uso 4 px, que é
 * o meio do caminho entre o recuo do Notion e o respiro que o nosso quadro
 * precisa por ter cabeçalho e rodapé.
 */
const RESPIRO = 4
const LARGURA_MINIMA = 300
const estiloDoSalto = computed(() => {
  const r = retanguloDoAlvo.value
  const campo = campoEmEdicao.value
  if (!r || !campo) return {}

  const larguraMinima = campo.saltoLargo ? 460 : Math.max(campo.largura, LARGURA_MINIMA)
  const largura = Math.min(
    Math.max(r.width + RESPIRO * 2, larguraMinima),
    window.innerWidth - RESPIRO * 4,
  )
  const esquerda = Math.min(
    Math.max(RESPIRO, r.left - RESPIRO),
    Math.max(RESPIRO, window.innerWidth - largura - RESPIRO * 2),
  )
  const topo = Math.min(
    Math.max(RESPIRO, r.top - RESPIRO),
    Math.max(RESPIRO, window.innerHeight - 220),
  )

  return {
    left: `${esquerda}px`,
    top: `${topo}px`,
    width: `${largura}px`,
    maxHeight: `${window.innerHeight - topo - RESPIRO * 2}px`,
  }
})

/**
 * O CLIQUE FORA, e por que ele não pode ser só um `mousedown`.
 *
 * A lista de opção de um seletor é teleportada para o `body`, fora do quadro.
 * Quando a pessoa escolhe uma opção, a sequência é esta: `pointerdown` na
 * opção, a lista se desmonta ali mesmo, e então o `mousedown` e o `click` que
 * faltavam caem em quem ficou embaixo do cursor, que é a camada de fundo do
 * quadro. Resultado: escolher a opção fechava o quadro inteiro.
 *
 * O conserto é exigir que o gesto COMECE e TERMINE no fundo. O `pointerdown`
 * é o primeiro evento da sequência, e é ele que sabe onde o clique nasceu.
 */
const gestoComecouNoFundo = ref(false)

function aoPressionarFundo(e: PointerEvent) {
  gestoComecouNoFundo.value = e.target === e.currentTarget
}

function aoClicarNoFundo(e: MouseEvent) {
  if (gestoComecouNoFundo.value && e.target === e.currentTarget) fecharComoOCampoManda()
}

/**
 * ───────────────── FECHAR O QUADRO, E O QUE ISSO SIGNIFICA ─────────────────
 *
 * Fechar não é um gesto só: fechar SALVANDO e fechar DESCARTANDO são coisas
 * diferentes, e o rodapé do quadro já anunciava as duas. Quem decide é o
 * `comoSalva` do campo:
 *
 * | Campo | Salva quando | Descarta quando |
 * |---|---|---|
 * | `imediato`, `enterOuSair`, `aoFechar` | escolher, Enter, sair, clicar fora | Esc |
 * | `confirmar` | **só** o botão Confirmar | Esc, clicar fora, rolar para fora |
 *
 * A linha do `confirmar` é o que dá sentido ao botão: se clicar fora também
 * salvasse, o Confirmar seria enfeite. É o mesmo contrato do formulário, onde
 * ninguém espera que fechar a janela grave.
 */
function fecharEdicao(descartando = false) {
  if (descartando && emEdicao.value) {
    const { item, refId } = emEdicao.value
    gravarValor(item, refId, valorAoAbrir.value)
  }
  gestoComecouNoFundo.value = false
  emEdicao.value = null
  alvoDaEdicao.value = null
  retanguloDoAlvo.value = null
  valorAoAbrir.value = undefined
}

/** Fechar sem confirmar: descarta no campo que pede Confirmar, salva no resto. */
function fecharComoOCampoManda() {
  fecharEdicao(campoEmEdicao.value?.comoSalva === 'confirmar')
}

/**
 * Rolar ou redimensionar reancora o quadro, em vez de deixá-lo órfão.
 *
 * O ouvinte de rolagem tem que estar NO CONTÊINER DA TABELA, e não só na
 * janela com captura. Medido nesta rodada: um `scroll` de elemento interno não
 * chega a um ouvinte em captura na `window`, e por isso o quadro nunca
 * acompanhou a rolagem horizontal da tabela, que é justamente a que existe
 * aqui (a tabela tem 35 colunas e a página não rola de lado). O comentário
 * antigo dizia que reancorava, e não reancorava.
 */
onMounted(() => {
  window.addEventListener('scroll', medirAlvo, true)
  window.addEventListener('resize', medirAlvo)
  onUnmounted(() => {
    window.removeEventListener('scroll', medirAlvo, true)
    window.removeEventListener('resize', medirAlvo)
  })
})

/* -------------------------------------------------------------------------- *
 *                        A LINHA DE CRIAÇÃO, na grade                        *
 * -------------------------------------------------------------------------- *
 *
 * Na rodada 6 eu botei a linha de criação FIXA no topo, porque ela pediu assim.
 * Ela mesma desconfiou depois ("ninguém faz isso, pode ser estranho"), e estava
 * certa. Fui medir, em 23/09/2026:
 *
 * | Produto | Onde se cria pela grade |
 * |---|---|
 * | Notion | "+ New page" no FIM, mais um "+" no vão da linha, no hover |
 * | Airtable | linha "+" no FIM, mais "Insert record below" no menu da linha |
 * | ClickUp | compositor no FIM do grupo |
 * | Monday | "+ Add item" no FIM do grupo |
 * | Twenty | `RecordTableNoRecordGroupAddNew` depois das linhas, e o registro
 *   nasce com `position: 'last'` (li o código no repositório) |
 *
 * Ou seja: **criar no fim é unânime, e criar no topo não existe**. O que existe
 * além do fim é o "+" que aparece no VÃO da linha, no hover, e insere logo
 * abaixo dela. É o "botão de adicionar em qualquer posição" que ela descreveu.
 *
 * Então agora são dois caminhos, os dois do mercado:
 *
 * 1. o botão "+ Criar registro" no rodapé da grade, que é o padrão unânime;
 * 2. o "+" no vão da linha, no hover, que insere o rascunho logo abaixo dela.
 *
 * Em qualquer um dos dois, a linha de rascunho é uma linha de verdade da
 * tabela, com as mesmas colunas e larguras, e as células dela abrem o MESMO
 * quadro de edição das outras. O valor vai para um rascunho, e o rascunho só
 * vira item no Enter ou no botão Criar.
 */
const ID_DA_LINHA_NOVA = -1
const rascunhoDaLinha = ref<Record<string, unknown>>({})

/** Em que posição a linha de rascunho está. `null` é não ter rascunho aberto. */
const posicaoDoRascunho = ref<number | null>(null)

const linhaNova = computed(() => ({
  id: ID_DA_LINHA_NOVA,
  reference: '',
  status: 'active',
  data: rascunhoDaLinha.value,
  created_at: '',
  updated_at: '',
} as unknown as Item))

const linhas = computed<Item[]>(() => {
  const i = posicaoDoRascunho.value
  if (i === null) return props.itens
  const lista = [...props.itens]
  lista.splice(Math.min(i, lista.length), 0, linhaNova.value)
  return lista
})

/** Abre o rascunho numa posição e põe o primeiro campo em edição. */
function abrirRascunho(posicao: number, alvo?: HTMLElement) {
  posicaoDoRascunho.value = posicao
  rascunhoDaLinha.value = {}
  const campo = props.campos.find(c => !c.somenteLeitura)
  if (!campo) return
  nextTick(() => {
    /* O alvo é a célula do campo na linha nova, se ela já existir; senão, a
       célula que a pessoa clicou, que é o botão do rodapé ou o "+" do vão. */
    const celula = raiz.value?.querySelectorAll('tbody tr')[posicao]?.children[2] as HTMLElement | undefined
    abrirEdicao(campo, linhaNova.value, celula ?? alvo)
  })
}

function ehLinhaNova(item: Item) {
  return item.id === ID_DA_LINHA_NOVA
}

const temRascunho = computed(
  () => Object.values(rascunhoDaLinha.value).some(v => !estaVazio(v)),
)

/**
 * Onde o valor editado é gravado. Na linha de criação ele fica no rascunho; na
 * linha de um item ele sobe para quem manda na lista. O quadro de edição não
 * sabe a diferença, e é isso que mantém um caminho só.
 */
function gravarValor(item: Item, refId: string, valor: unknown) {
  if (ehLinhaNova(item)) {
    rascunhoDaLinha.value = { ...rascunhoDaLinha.value, [refId]: valor }
    return
  }
  emit('editarValor', item, refId, valor)
}

/**
 * Criar e continuar. Medido no ClickUp em 23/09/2026: o Enter cria a tarefa e
 * o compositor FICA ABERTO, já pronto para a próxima. Quem está lançando cinco
 * registros não quer clicar de novo na linha a cada um. Aqui o quadro fica
 * aberto no mesmo campo, vazio, e só fecha no Esc ou no clique fora.
 */
function criarDaLinha() {
  if (!temRascunho.value) return
  const posicao = posicaoDoRascunho.value ?? props.itens.length
  emit('criarNaLinha', { ...rascunhoDaLinha.value }, posicao)
  rascunhoDaLinha.value = {}
  /* O item criado ocupa a posição do rascunho, e o rascunho anda uma casa. */
  posicaoDoRascunho.value = posicao + 1
  nextTick(medirAlvo)
}

/** Onde o item está na lista, para o "+" do vão saber em que posição inserir. */
function posicaoDoItem(item: Item) {
  return props.itens.findIndex(i => i.id === item.id)
}

function descartarRascunho() {
  rascunhoDaLinha.value = {}
  posicaoDoRascunho.value = null
  fecharEdicao()
}

/**
 * Limpar o campo, no cabeçalho do quadro. É o gesto que o ClickUp põe nos
 * popups dele, e faz falta: sem ele, tirar um valor de um seletor obriga a
 * desmarcar opção por opção.
 */
function limparCampo() {
  const item = itemEmEdicao.value
  const campo = campoEmEdicao.value
  if (!item || !campo) return
  /* Campo que guarda lista volta para lista vazia; os outros, para nulo. */
  const deLista = ['multiSelect', 'checkbox', 'EnlCheckbox', 'EnlChips', 'EnRelMulti', 'uploadFile', 'uploadImage', 'EnPDF', 'EnNotes']
  const vazio = deLista.includes(campo.tipo) ? [] : null
  gravarValor(item, campo.refId, vazio)
}

const temValorNoQuadro = computed(() => {
  const item = itemEmEdicao.value
  const campo = campoEmEdicao.value
  if (!item || !campo) return false
  return !estaVazio((item.data as Record<string, unknown>)?.[campo.refId])
})

/*
 * SEM COMENTÁRIO NO CAMPO.
 *
 * O quadro tinha um balão que abria uma caixa para comentar dali mesmo, vindo
 * do comentário por célula do Notion. Ela cortou com um argumento de
 * realidade: **o ENSPACE não tem comentário em campo nenhum.** Comentário aqui
 * é do ITEM, e vive na aba de comentários do registro (vista na tela nova de
 * itens do develop, ao lado de Visão Geral e Logs de Auditoria).
 *
 * Pôr um no campo era inventar recurso dentro de um protótipo que existe para
 * padronizar o que já existe. Saiu o botão, a caixa, o evento e os textos.
 */

/** Enter na linha de criação cria. Nas outras, salva e desce uma linha. */
function aoSairDoQuadro() {
  const item = emEdicao.value?.item
  if (item && ehLinhaNova(item)) criarDaLinha()
  else andarParaLinha(1)
}

/**
 * O TECLADO DENTRO DO QUADRO.
 *
 * É a metade boa do modelo de planilha do ClickUp, sem a metade ruim. Lá o
 * primeiro clique seleciona e o segundo edita, o que cobra dois cliques de
 * todo mundo para servir a quem navega pelo teclado. Aqui o clique continua
 * abrindo direto, e quem quer velocidade tem as teclas:
 *
 * | Tecla | O que faz |
 * |---|---|
 * | Esc | fecha o quadro |
 * | Tab | vai para o PRÓXIMO campo da mesma linha |
 * | Shift+Tab | volta para o campo anterior |
 * | Enter | salva e DESCE para a mesma coluna da linha de baixo |
 *
 * Enter dentro de um campo de texto já fechava o quadro (o `sair` da entrada);
 * aqui ele passa a fechar e reabrir embaixo, que é o que a planilha faz e o
 * que quem lança dado em série espera.
 */
function andarParaCampo(passo: number) {
  const estado = emEdicao.value
  if (!estado) return
  const i = props.campos.findIndex(c => c.refId === estado.refId)
  const seguintes = passo > 0 ? props.campos.slice(i + 1) : props.campos.slice(0, Math.max(0, i)).reverse()
  const campo = seguintes.find(c => !c.somenteLeitura)
  if (!campo) return
  const linha = linhas.value.findIndex(l => l.id === estado.item.id)
  const coluna = props.campos.findIndex(c => c.refId === campo.refId)
  const celula = raiz.value?.querySelectorAll('tbody tr')[linha]?.children[coluna + 2] as HTMLElement | undefined
  abrirEdicao(campo, estado.item, celula)
}

function andarParaLinha(passo: number) {
  const estado = emEdicao.value
  const campo = campoEmEdicao.value
  if (!estado || !campo) return
  const i = linhas.value.findIndex(l => l.id === estado.item.id)
  const destino = linhas.value[i + passo]
  if (!destino || ehLinhaNova(destino)) return fecharEdicao()
  const coluna = props.campos.findIndex(c => c.refId === campo.refId)
  const celula = raiz.value?.querySelectorAll('tbody tr')[i + passo]?.children[coluna + 2] as HTMLElement | undefined
  abrirEdicao(campo, destino, celula)
}

onMounted(() => {
  const aoTeclar = (e: KeyboardEvent) => {
    if (!emEdicao.value) return

    if (e.key === 'Escape') {
      e.stopPropagation()
      /* Esc é o gesto de desfazer, em todo campo. */
      fecharEdicao(true)
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      e.stopPropagation()
      andarParaCampo(e.shiftKey ? -1 : 1)
    }
  }
  window.addEventListener('keydown', aoTeclar, true)
  onUnmounted(() => window.removeEventListener('keydown', aoTeclar, true))
})

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.referencia, sortable: true },
  ...props.campos.map(c => ({
    key: c.refId,
    label: props.t.campos[c.tipo].rotulo,
    sortable: true,
    /*
     * O `EnTableColumn` aceita center, e é o que Anotações e Chat pedem: a
     * célula deles é um alvo, não um valor. Alinhar o cabeçalho junto é de
     * propósito, senão o rótulo aponta para um lugar onde não tem nada.
     */
    align: (c.alinhamento === 'fim'
      ? 'right'
      : c.alinhamento === 'centro' ? 'center' : 'left') as 'left' | 'center' | 'right',
  })),
])

/**
 * ───────────── AS LARGURAS DE COLUNA, E POR QUE ELAS ESTAVAM MORTAS ─────────
 *
 * O `EnTable` aceita `resizable` e desenha a alça na direita de cada cabeçalho,
 * com o cursor certo. Mas `columnSizing` é prop **controlada**: quem a passa
 * assume o estado. Eu passava um `computed` do catálogo, que não tem setter,
 * então o arraste emitia `update:columnSizing` para o vazio e a largura voltava
 * ao valor do catálogo no próximo desenho. A alça existia, arrastava, e não
 * acontecia nada.
 *
 * Agora a largura tem dono. O catálogo continua dizendo a largura INICIAL de
 * cada coluna, e o que a pessoa arrasta vive num mapa de sobreposições que
 * pertence à tela (o `index.vue`), porque é lá que fica o botão do andaime que
 * devolve as larguras originais.
 */
const LARGURA_DA_REFERENCIA = 260

/**
 * O PISO DA LARGURA DE COLUNA.
 *
 * O `EnTable` não expõe `minSize` por coluna, então o piso do TanStack vale
 * para todas: 24 px. Em 24 px nenhuma célula diz nada, e nem o contador `+N`
 * cabe. Como o estado da largura é meu, o piso também: 96 px, que é o que
 * sustenta um valor cortado com reticências mais o contador ao lado.
 *
 * É a mesma ordem de grandeza do Notion (100 px). Fica registrado como pedido
 * ao SDK: `minSize` por coluna, porque a largura mínima é característica do
 * CAMPO (o catálogo já a declara em `campo.largura`), não da tela.
 */
const PISO_DA_COLUNA = 96

const largurasIniciais = computed(() =>
  Object.fromEntries([
    ['reference', LARGURA_DA_REFERENCIA],
    ...props.campos.map(c => [c.refId, c.largura]),
  ]),
)

const larguras = computed<Record<string, number>>({
  get: () => ({ ...largurasIniciais.value, ...props.larguras }),
  set: (v) => {
    /*
     * O `EnTable` emite o mapa inteiro, inclusive na montagem. Sem esta
     * comparação, abrir a tela já marcaria as colunas como redimensionadas e
     * acenderia o botão de voltar ao original sem ninguém ter arrastado nada.
     */
    const atual = { ...largurasIniciais.value, ...props.larguras }
    const comPiso = Object.fromEntries(
      Object.entries(v).map(([k, px]) => [k, Math.max(px, PISO_DA_COLUNA)]),
    )
    const mudou = Object.keys(comPiso).some(k => comPiso[k] !== atual[k])
    if (mudou) emit('update:larguras', comPiso)
  },
})

const paginacao = computed(() => ({
  page: 1,
  pageCount: Math.max(1, Math.ceil(props.total / 100)),
  total: props.total,
}))

const copiado = ref<string | null>(null)
async function copiarReferencia(referencia: string) {
  try {
    await navigator.clipboard.writeText(referencia)
    copiado.value = referencia
    setTimeout(() => { copiado.value = null }, 1400)
  }
  catch { /* sem área de transferência: silêncio */ }
}

/* ------------------------- a seleção em massa ---------------------------- *
 *
 * A coluna da esquerda tem DOIS trabalhos, e um de cada vez: numerar quando
 * ninguém está selecionando, e selecionar quando alguém está. Com seleção em
 * curso o número sai e a caixa fica, sem depender de hover, que é o que ela
 * pediu nesta rodada. O `EnTable` não marca a linha selecionada no DOM (ele
 * gerencia a seleção por referência de objeto, e não pelo `rowSelection` do
 * TanStack), então quem sabe disso é esta tela: por isso a classe entra aqui.
 */
const temSelecao = computed(() => selecionados.value.length > 0)

function limparSelecao() {
  selecionados.value = []
}

/** Copiar o link dos marcados: é o "Copiar Link" da linha, em massa. */
async function copiarLinksDaSelecao() {
  const refs = selecionados.value.map(i => i.reference).join('\n')
  try {
    await navigator.clipboard.writeText(refs)
    emit('avisar', props.t.selecao.linksCopiados(selecionados.value.length))
  }
  catch { /* sem área de transferência: silêncio */ }
  limparSelecao()
}

/** Lixeira em massa: é o "Enviar para a lixeira" da linha, em massa. */
function lixeiraDaSelecao() {
  emit('enviarParaLixeira', [...selecionados.value])
  limparSelecao()
}

function menuDaLinha(item: Item) {
  return [
    [
      { label: props.t.verDetalhes, icon: 'i-lucide-eye', onSelect: () => emit('abrirItem', item) },
      { label: props.t.editar, icon: 'i-lucide-pencil', onSelect: () => emit('abrirTelaDoItem', item) },
      /* "Insert record below" do Airtable: o mesmo gesto do "+" do vão, pelo
         menu, que é o caminho de quem usa teclado. */
      { label: props.t.criarAbaixo, icon: 'i-lucide-plus', onSelect: () => abrirRascunho(props.itens.findIndex(i => i.id === item.id) + 1) },
    ],
    [
      { label: props.t.enviarParaLixeira, icon: 'i-lucide-trash-2', color: 'error' as const },
      { label: props.t.copiarLink, icon: 'i-lucide-link', onSelect: () => copiarReferencia(item.reference) },
    ],
  ]
}

/**
 * Dois gestos que são da LINHA e do CABEÇALHO, não da célula, e por isso são
 * ligados no DOM que o `EnTable` monta:
 *
 * - duplo clique na linha abre a visão rápida, como no develop;
 * - clique no rótulo da coluna abre a ficha daquele tipo.
 */
const raiz = ref<HTMLElement | null>(null)

/** O `<tbody>` que o `EnTable` monta, alvo da linha de criação. */
const corpoDaTabela = ref<HTMLElement | null>(null)

/**
 * ─────────── A ÂNCORA DO QUADRO, E POR QUE ELA EXISTE ───────────
 *
 * O quadro de edição precisa ficar **acima da tabela** e **abaixo de qualquer
 * camada do Nuxt UI** (lista de seletor, menu de três pontos, balão). As duas
 * coisas ao mesmo tempo, e nenhum z-index resolve isso:
 *
 * - com z-index, o quadro passa na frente das camadas do Nuxt UI, que não têm
 *   z nenhum. Foi o defeito que ela pegou na rodada 12;
 * - sem z-index, quem decide é a ordem no DOM. E aí veio a surpresa: o
 *   `<Teleport to="body">` põe o quadro como **primeiro** filho do `body`,
 *   ANTES da aplicação. Medi na página publicada: aplicação no índice 1,
 *   quadro no índice 0. Resultado: a tabela passava na frente do quadro e
 *   engolia todo clique. É o que ela relatou, "não consigo editar nenhum
 *   campo": o quadro abria atrás da tabela.
 *
 * O conserto é dar ao quadro um lugar no DOM **depois** da aplicação: esta
 * âncora é criada na montagem e vai para o fim do `body`. Assim:
 *
 * | Camada | Onde entra no `body` | Quem fica na frente |
 * |---|---|---|
 * | aplicação, com a tabela | primeiro | a tabela perde do quadro |
 * | **âncora do quadro** | na montagem, no fim | acima da tabela |
 * | camadas do Nuxt UI | ao abrir, no fim | acima do quadro |
 *
 * Sem z-index em nenhuma das três, que é a convenção da biblioteca.
 */
const ancoraDoQuadro = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = document.createElement('div')
  el.dataset.ancoraDoQuadro = ''
  document.body.appendChild(el)
  ancoraDoQuadro.value = el
  onUnmounted(() => el.remove())
})

onMounted(() => nextTick(() => {
  const tabela = raiz.value?.querySelector('table')
  if (!tabela) return
  corpoDaTabela.value = tabela.querySelector('tbody')

  /* O ouvinte de rolagem vive aqui, onde a tabela já existe para ser achada. */
  roladorDaTabela.value = tabela.parentElement
  roladorDaTabela.value?.addEventListener('scroll', medirAlvo, { passive: true })

  /*
   * ───────── O DUPLO CLIQUE QUE ABRE O REGISTRO, E ONDE ELE VALE ─────────
   *
   * A decisão da rodada 9 é que o registro abre de dois jeitos, e só dois: o
   * botão Abrir da célula de referência e o duplo clique. Testando a rodada 15
   * descobri que o duplo clique só funciona FORA das células de campo, e que
   * isso não é defeito de implementação: é consequência do gesto que ela
   * pediu.
   *
   * Numa célula de campo, o primeiro clique já abre o quadro de edição, e o
   * quadro nasce ANCORADO SOBRE A CÉLULA (é o "salto" do Notion, 4 px acima e
   * à esquerda, de propósito, para a edição acontecer onde os olhos já
   * estavam). Quando o segundo clique chega, quem está debaixo do ponteiro é o
   * quadro, não a célula. O navegador nem dispara `dblclick` na tabela: o
   * evento sai no ancestral comum dos dois alvos, que passa a ser o `body`.
   *
   * Não tem conserto que não custe mais do que resolve:
   *
   * - atrasar o primeiro clique em 200 ms para esperar o segundo põe atraso na
   *   ação PRINCIPAL da tela (editar) para servir a secundária (abrir);
   * - deixar o próprio quadro atender o duplo clique rouba o duplo clique de
   *   dentro dos campos de texto, onde ele seleciona palavra.
   *
   * Então a fronteira é esta, e é a mesma do mercado: **o gesto de abrir vive
   * onde não há campo para editar.** Sobram, e bastam:
   *
   * | Onde | Gesto |
   * |---|---|
   * | botão Abrir, na célula de referência | um clique |
   * | célula de referência | duplo clique |
   * | calha da linha (número e caixa de seleção) | duplo clique |
   * | célula de campo somente leitura | duplo clique |
   * | célula de campo editável | um clique já edita, e é o que ela faz |
   *
   * O ClickUp e o Notion chegam no mesmo lugar por outro caminho: lá a célula
   * não edita com um clique, então eles podem pendurar o abrir na linha. Aqui
   * a célula edita, e o abrir se concentra na coluna da identificação, que é
   * exatamente o botão que ela mandou copiar do print do ClickUp.
   */
  tabela.addEventListener('dblclick', (e) => {
    const linha = (e.target as HTMLElement).closest('tbody tr')
    if (!linha) return
    const i = [...(linha.parentElement?.children ?? [])].indexOf(linha)
    const item = linhas.value[i]
    if (!item || ehLinhaNova(item)) return
    /* O primeiro clique do duplo pode ter aberto uma célula somente leitura
       vizinha: fecha, para a quickview não nascer com um controle atrás. */
    fecharEdicao()
    emit('abrirItem', item)
  })

  tabela.addEventListener('click', (e) => {
    const th = (e.target as HTMLElement).closest('thead th')
    if (!th) return
    const i = [...(th.parentElement?.children ?? [])].indexOf(th)
    /* A coluna 0 é a seleção e a 1 é a referência: as duas não são campo. */
    const campo = props.campos[i - 2]
    if (campo) emit('inspecionar', campo.tipo, props.itens[0]!)
  })
}))
</script>

<template>
  <!--
    A barra de ferramentas é cópia do develop: busca, os dois filtros de data,
    os quatro ícones e o botão primário. O relatório de verdade está no
    andaime, para não se confundir com o Exportar que o produto já tem.
  -->
  <div class="flex shrink-0 flex-wrap items-center gap-1 border-b border-default px-3 py-2">
    <UInput
      icon="i-lucide-search"
      :placeholder="t.pesquisar"
      variant="none"
      size="sm"
      class="w-56"
    />
    <UButton icon="i-lucide-calendar" :label="t.criadoEm" color="neutral" variant="ghost" size="sm" />
    <UButton icon="i-lucide-filter" :label="t.todoPeriodo" color="neutral" variant="ghost" size="sm" />


    <div class="ml-auto flex items-center gap-0.5">
      <UTooltip :text="t.exportar">
        <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.exportar" />
      </UTooltip>
      <UTooltip :text="t.colunas">
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.colunas" />
      </UTooltip>
      <UTooltip :text="t.densidade">
        <UButton icon="i-lucide-settings-2" color="neutral" variant="ghost" size="sm" :aria-label="t.densidade" />
      </UTooltip>
      <UTooltip :text="t.maisOpcoes">
        <UButton icon="i-lucide-settings" color="neutral" variant="ghost" size="sm" :aria-label="t.maisOpcoes" />
      </UTooltip>
      <UButton
        icon="i-lucide-plus"
        :label="t.novoRegistro"
        color="primary"
        variant="soft"
        size="sm"
        class="ml-1"
        @click="emit('novoItem')"
      />
    </div>
  </div>

  <!-- ─────────────────────────────── a tabela ─────────────────────────── -->
  <!--
    As duas variáveis dizem em que MODO a coluna da esquerda está. Elas são
    herdadas até a célula, o que evita depender de qual ancestral casa com que
    seletor: ver o comentário do estilo, no fim do arquivo.
  -->
  <div
    ref="raiz"
    class="min-h-0 flex-1 overflow-auto"
    :style="{ '--caixa-da-linha': temSelecao ? 1 : 0, '--numero-da-linha': temSelecao ? 0 : 1 }"
  >
    <EnTable
      v-model:selected="selecionados"
      :columns="colunas"
      :rows="linhas"
      :loading="carregando"
      selectable
      resizable
      v-model:column-sizing="larguras"
      :pagination="paginacao"
      :locale="idioma === 'pt-BR' ? 'pt-BR' : idioma === 'es' ? 'es' : 'en'"
    >
      <!-- A referência é o identificador, e o produto a mostra como selo copiável -->
      <template #cell-reference="{ row }">
        <!--
          A linha de criação não tem referência: ela tem o convite. Enquanto o
          rascunho está vazio o texto explica o gesto; com valor, aparece o
          Criar e o descartar.
        -->
        <div v-if="ehLinhaNova(row as Item)" class="linha-rascunho flex items-center gap-1.5">
          <UIcon name="i-lucide-corner-down-right" class="size-4 shrink-0 text-primary" />
          <span v-if="!temRascunho" class="min-w-0 flex-1 truncate text-sm text-muted">
            {{ t.criarNaLinha }}
          </span>
          <template v-else>
            <UButton :label="t.criar" color="primary" size="xs" @click.stop="criarDaLinha()" />
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="t.descartar"
              @click.stop="descartarRascunho()"
            />
          </template>
        </div>

        <!--
          O botão de ABRIR no hover da célula da referência. É o "OPEN" que o
          Notion mostra ao passar o mouse na linha (visto no board dela em
          23/09/2026), e resolve um problema do nosso desenho: abrir o item
          dependia de duplo clique, que é gesto invisível. O duplo clique
          continua valendo para quem já sabe.
        -->
        <!--
          O "+" no VÃO da linha, que aparece no hover e insere um registro logo
          abaixo dela. É o gesto do Notion e do Airtable ("Insert record
          below"), posicionado sobre a coluna da caixa de seleção, que é o vão.
        -->
        <div v-else class="group/ref relative flex items-center gap-1.5">
          <UTooltip :text="t.criarAbaixo">
            <UButton
              icon="i-lucide-plus"
              color="primary"
              variant="ghost"
              size="xs"
              class="absolute -left-8 opacity-0 transition-opacity group-hover/ref:opacity-100"
              :aria-label="t.criarAbaixo"
              @click.stop="abrirRascunho(posicaoDoItem(row as Item) + 1, $event.currentTarget as HTMLElement)"
            />
          </UTooltip>
          <!--
            O selo da referência NÃO abre o item. Decisão dela: abrir fica no
            botão Abrir e no duplo clique, e mais nada. A razão é a mesma que
            vale para a linha: célula é área de campo, e um clique que abre
            rouba o clique que edita. Quem abre é uma ação explícita.
          -->
          <UBadge color="info" variant="subtle" size="sm" class="min-w-0 truncate font-mono text-[11px]">
            {{ (row as Item).reference }}
          </UBadge>

          <!--
            Copiar e abrir entram na MESMA BANDEJA FLUTUANTE das outras
            células, encostada na borda direita e por cima do fim do selo.

            Antes eles ficavam em linha, depois do selo, e não cabiam: a
            referência tem 32 caracteres em fonte mono, então o conteúdo somava
            266 px numa coluna de 260 e o botão de abrir saía cortado pela
            borda. Era o "botão escondido" do print dela.

            Com a bandeja o problema desaparece por construção, e de quebra a
            célula da referência passa a se comportar como todas as outras:
            hover mostra as ações, e elas não empurram nada.
          -->
          <span class="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded-md bg-default p-0.5 opacity-0 shadow-sm ring-1 ring-default transition-opacity group-hover/ref:opacity-100">
            <UTooltip :text="t.copiar">
              <UButton
                :icon="copiado === (row as Item).reference ? 'i-lucide-check' : 'i-lucide-copy'"
                color="neutral"
                variant="ghost"
                size="xs"
                :aria-label="t.copiar"
                @click.stop="copiarReferencia((row as Item).reference)"
              />
            </UTooltip>
            <UTooltip :text="t.abrir">
              <UButton
                icon="i-lucide-maximize-2"
                color="neutral"
                variant="ghost"
                size="xs"
                :aria-label="t.abrir"
                @click.stop="emit('abrirItem', row as Item)"
              />
            </UTooltip>
          </span>
          <!--
            SEM SELO DE ESTADO AQUI. Rascunho e Inativo saíram da célula da
            referência por decisão dela: estado do REGISTRO não é assunto da
            coluna de identificação, e numa coluna que já carrega selo, botão
            de copiar e botão de abrir, ele era o quarto elemento disputando o
            mesmo espaço. O estado continua onde pertence, no painel do item.
          -->
        </div>
      </template>

      <!--
        Uma célula por tipo, todas passando pelos mesmos dois componentes: o de
        leitura e o de escrita. É isso que garante que o número esteja à direita
        na tabela inteira e que editar na célula seja o MESMO controle do
        formulário, e não um primo parecido.
      -->
      <template
        v-for="campo in campos"
        :key="campo.refId"
        #[`cell-${campo.refId}`]="{ row }"
      >
        <!--
          A célula NUNCA monta controle. Ela mostra o valor e, no clique, abre
          o quadro que salta para fora da tabela. Vale igual para a linha de
          criação: lá o mesmo quadro escreve no rascunho.
        -->
        <div
          :class="[
            campoSelecionado === campo.tipo ? 'rounded ring-1 ring-primary/40' : '',
            editando(row as Item, campo.refId) ? 'rounded bg-primary/5' : '',
          ]"
        >
          <ValorDoCampo
            :campo="campo"
            :valor="((row as Item).data as Record<string, unknown>)?.[campo.refId]"
            :largura-da-coluna="larguras[campo.refId]"
            formato="celula"
            :t="t"
            :idioma="idioma"
            @editar="(alvo?: HTMLElement) => abrirEdicao(campo, row as Item, alvo)"
            @alternar="(v: unknown) => gravarValor(row as Item, campo.refId, v)"
            @abrir-relacionado="emit('abrirRelacionado', $event)"
          />
        </div>
      </template>

      <template #actions="{ row }">
        <UTooltip v-if="ehLinhaNova(row as Item)" :text="t.criarNaLinha">
          <UButton
            icon="i-lucide-corner-down-left"
            color="primary"
            variant="ghost"
            size="xs"
            :disabled="!temRascunho"
            :aria-label="t.criar"
            @click.stop="criarDaLinha()"
          />
        </UTooltip>

        <UDropdownMenu v-else :items="menuDaLinha(row as Item)">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            size="xs"
            :aria-label="t.acoes"
          />
        </UDropdownMenu>
      </template>

      <template #empty>
        <UEmpty
          icon="i-lucide-table-2"
          :title="t.semItensTitulo"
          :description="t.semItensTexto"
        >
          <template #actions>
            <UButton
              icon="i-lucide-plus"
              :label="t.semItensAcao"
              color="primary"
              variant="soft"
              size="sm"
              @click="emit('novoItem')"
            />
          </template>
        </UEmpty>
      </template>
    </EnTable>

    <!--
      A LINHA de criação no fim da grade, que é o padrão unânime: "+ New page"
      no Notion, linha "+" no Airtable, compositor no ClickUp, "+ Add item" no
      Monday e "Add New" no Twenty.

      Ela é teleportada para dentro do `<tbody>` que o `EnTable` monta, porque
      precisa ser uma linha de verdade (largura da tabela, borda da grade) e o
      `EnTable` não tem slot para isso. Se um dia o SDK ganhar um slot de
      rodapé do corpo, isto vira uma linha normal.
    -->
    <Teleport v-if="corpoDaTabela" :to="corpoDaTabela">
      <tr class="linha-de-criar">
        <td :colspan="campos.length + 3" class="border-b border-default p-0">
          <button
            type="button"
            class="flex w-full items-center gap-1.5 px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-elevated hover:text-highlighted"
            @click="abrirRascunho(itens.length, $event.currentTarget as HTMLElement)"
          >
            <UIcon name="i-lucide-plus" class="size-4 shrink-0 text-primary" />
            {{ t.criarRegistro }}
          </button>
        </td>
      </tr>
    </Teleport>
  </div>

  <BarraDeSelecao
    :t="t"
    :quantos="selecionados.length"
    @limpar="limparSelecao()"
    @copiar-links="copiarLinksDaSelecao()"
    @lixeira="lixeiraDaSelecao()"
  />

  <!--
    ══════════════════ O QUADRO QUE SALTA PARA FORA ══════════════════════
    Ele mora em `body` (Teleport) por um motivo prático: dentro da tabela ele
    seria cortado pelo `overflow` da célula e pelo da área de rolagem, que é
    o que aconteceu com a dica de "o que salva" na rodada passada.

    ## E ele NÃO tem z-index, de propósito

    Eu tinha posto `z-40` na camada de fundo, e era isso que quebrava. Medi as
    camadas do Nuxt UI em 23/09/2026 e **nenhuma delas tem z-index**: a lista de
    um seletor, o menu de três pontos, o balão de ajuda, o modal e a gaveta são
    todos `position: fixed` com `z-index: auto`, filhos diretos do `body`. Quem
    decide quem fica na frente é a ORDEM NO DOM.

    Com `z-40` aqui, o quadro passava na frente de tudo o que abrisse de dentro
    dele: a lista do relacionamento múltiplo e o menu do anexo ficavam por
    baixo, que é o que ela mandou o print.

    Sem z-index, a ordem resolve sozinha: o quadro entra no `body` quando abre,
    portanto depois da aplicação, e fica acima da tabela; e a lista que abrir de
    dentro dele entra depois do quadro, e fica acima dele. É a convenção da
    própria biblioteca, e vale para as camadas que ainda não existem.

    A camada de fundo é transparente e serve de alvo do clique fora. O quadro
    tem três faixas: o nome do campo em cima, o controle no meio e, embaixo, a
    frase de o que salva com o botão que fecha.
  -->
  <Teleport v-if="ancoraDoQuadro" :to="ancoraDoQuadro">
    <div
      v-if="emEdicao && campoEmEdicao && retanguloDoAlvo"
      class="fixed inset-0"
      @pointerdown="aoPressionarFundo"
      @click="aoClicarNoFundo"
    >
      <div
        class="salto absolute flex flex-col rounded-lg border border-default bg-default p-2 shadow-2xl"
        :style="estiloDoSalto"
        role="dialog"
        :aria-label="t.campos[campoEmEdicao.tipo].rotulo"
      >
        <p class="mb-1.5 flex items-center gap-1.5 px-0.5 text-[11px] font-semibold uppercase tracking-wide text-dimmed">
          <UIcon :name="campoEmEdicao.icone" class="size-3 shrink-0" />
          <span class="truncate">{{ t.campos[campoEmEdicao.tipo].rotulo }}</span>
          <UBadge v-if="ehLinhaNova(emEdicao.item)" color="primary" variant="subtle" size="sm">
            {{ t.novoRegistro }}
          </UBadge>
          <UTooltip v-if="temValorNoQuadro" :text="t.limparCampo" class="ml-auto">
            <UButton
              icon="i-lucide-eraser"
              color="neutral"
              variant="ghost"
              size="xs"
              :aria-label="t.limparCampo"
              @click="limparCampo()"
            />
          </UTooltip>
        </p>

        <div class="min-h-0 flex-1 overflow-y-auto px-0.5">
          <EntradaDoCampo
            :campo="campoEmEdicao"
            :model-value="(itemEmEdicao?.data as Record<string, unknown>)?.[campoEmEdicao.refId]"
            :t="t"
            :idioma="idioma"
            :pode-configurar="podeConfigurar"
            :itens="itens"
            sem-rotulo
            autofoco
            @update:model-value="(v: unknown) => gravarValor(itemEmEdicao!, campoEmEdicao!.refId, v)"
            @sair="aoSairDoQuadro()"
          />
        </div>

        <!--
          O rodapé do quadro, com três coisas: o que salva, o atalho para a
          ficha do campo e o botão que fecha.

          O atalho para a ficha é o "Edit property" que o Notion põe no pé do
          editor de célula (visto no board dela em 23/09/2026). Faz sentido:
          quem está preenchendo é quem descobre que a regra do campo está
          errada, e o caminho até a configuração não devia passar por outra
          tela.
        -->
        <div class="mt-1.5 flex items-center gap-2 border-t border-default px-0.5 pt-1.5">
          <!--
            ─────────────── O RODAPÉ DEIXOU DE DAR AULA ───────────────
            Aqui morava a frase de o que salva ("Escolher já salva. Não há o
            que confirmar."), e ela pediu para tirar: instrução escrita em toda
            abertura de célula é ruído para quem já sabe, e quem não sabe
            descobre fazendo. O texto não se perdeu: está na ficha do campo, na
            linha "Como salva", a um clique daqui.

            O que sobrou é o botão da ficha, e ele é **do andaime**, não do
            produto. Abre o catálogo deste protótipo, com o contrato de
            back-end, as três regras de renderização e as configurações do
            tipo. Por isso vem com a cor do andaime, e o balão diz isso na
            cara em vez de deixar a pessoa achar que configurou campo no
            ENSPACE.
          -->
          <UTooltip :text="`${t.fichaTitulo} (${t.andaimeTitulo})`">
            <UButton
              icon="i-lucide-settings-2"
              color="warning"
              variant="soft"
              size="xs"
              :aria-label="`${t.fichaTitulo} (${t.andaimeTitulo})`"
              @click="emit('inspecionar', campoEmEdicao.tipo, emEdicao.item); fecharEdicao()"
            />
          </UTooltip>
          <UButton
            v-if="ehLinhaNova(emEdicao.item)"
            class="ml-auto"
            :label="t.criar"
            color="primary"
            size="xs"
            :disabled="!temRascunho"
            @click="criarDaLinha()"
          />
          <UButton
            v-else-if="campoEmEdicao.comoSalva === 'confirmar'"
            class="ml-auto"
            :label="t.confirmar"
            color="primary"
            size="xs"
            @click="fecharEdicao()"
          />
          <UButton
            v-else
            class="ml-auto"
            :label="t.fechar"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="fecharEdicao()"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/*
 * ─────────────── A NUMERAÇÃO E A CAIXA DE SELEÇÃO DA LINHA ───────────────
 *
 * Ela marcou isso no print do ClickUp, e é padrão de mercado de tabela que
 * edita: Airtable, ClickUp e Notion todos põem o número da linha no vão da
 * esquerda e TROCAM o número pela caixa de seleção quando o mouse passa. A
 * caixa do cabeçalho, que marca todos, fica fixa.
 *
 * O `EnTable` desenha a coluna de seleção sozinho, então o número entra por
 * CSS, com contador, e a troca é opacidade. É o único jeito de fazer sem
 * reescrever a tabela do SDK, e está declarado no DECISOES.md.
 */
:deep(tbody) {
  counter-reset: linha;
}

:deep(tbody tr) {
  counter-increment: linha;
}

/*
 * Nem a linha de criação nem a de rascunho são registro: as duas ficam fora da
 * numeração, senão o número da linha mentiria sobre quantos itens existem.
 */
:deep(tbody tr.linha-de-criar),
:deep(tbody tr:has(.linha-rascunho)) {
  counter-increment: none;
}

:deep(tbody tr.linha-de-criar td:first-child)::before,
:deep(tbody tr:has(.linha-rascunho) td:first-child)::before {
  content: none;
}

:deep(tbody tr td:first-child) {
  position: relative;
}

:deep(tbody tr td:first-child)::before {
  content: counter(linha);
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-dimmed);
  pointer-events: none;
  transition: opacity 120ms;
  opacity: var(--numero-da-linha, 1);
}

/*
 * ─────────── A COLUNA TEM DOIS MODOS, E UM DE CADA VEZ ───────────
 *
 * QUEM DIZ O MODO SÃO DUAS VARIÁVEIS CSS, postas no contêiner desta tela e
 * herdadas até a célula. Não é capricho: seletor de ancestral não serve aqui.
 * `:not(.com-selecao) :deep(...)` casa com QUALQUER elemento do componente que
 * tenha o atributo de escopo e não tenha a classe, e a raiz do `EnTable` é um
 * deles: a regra do modo parado voltava a valer por dentro, e a caixa marcada
 * continuava invisível. Variável herdada não tem esse problema, porque não
 * depende de quem casa com o quê.
 *
 * **Parado**: o número aparece e a caixa só surge no hover da linha, que é o
 * que Airtable, ClickUp e Notion fazem.
 *
 * **Selecionando** (a classe `com-selecao`, que esta tela põe quando existe
 * algum marcado): a coluna inteira é de caixas, marcadas ou não, e o número
 * sai. Sem hover, porque quem está selecionando precisa ver de uma vez o que
 * já marcou. É o comportamento do ClickUp e do Gmail, e foi o que ela pediu.
 *
 * DOIS DEFEITOS QUE ISSO CONSERTOU:
 *
 * 1. havia uma regra para `tr[data-selected='true']`, e ela nunca valeu: o
 *    `EnTable` não escreve esse atributo, porque gerencia a seleção por
 *    referência de objeto em vez de usar o `rowSelection` do TanStack. A
 *    pessoa marcava a caixa, tirava o mouse e a caixa marcada desaparecia
 *    atrás do número;
 * 2. a primeira tentativa de conserto pôs as duas opacidades brigando no
 *    mesmo elemento, apostando na especificidade da classe. Aqui os dois
 *    modos são **mutuamente exclusivos** (`:not(.com-selecao)` de um lado,
 *    `.com-selecao` do outro), então não há cascata para desempatar.
 */
:deep(tbody tr td:first-child > *) {
  opacity: var(--caixa-da-linha, 0);
  transition: opacity 120ms;
}

:deep(tbody tr td:first-child)::before {
  opacity: var(--numero-da-linha, 1);
}

/* O hover revela a caixa e esconde o número, no modo parado. */
:deep(tbody tr:hover td:first-child > *) {
  opacity: 1;
}

:deep(tbody tr:hover td:first-child)::before {
  opacity: 0;
}

/*
 * O zoom. O quadro nasce quase do tamanho da célula e cresce a partir do canto
 * superior esquerdo, que é o canto que ficou ancorado. São 140 ms: o suficiente
 * para o olho ver de onde a moldura veio, e pouco para não atrasar a digitação.
 */
.salto {
  animation: salto 140ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top left;
}

/*
 * A animação mexe SÓ na escala, e não na opacidade.
 *
 * Com opacidade no `from`, uma janela que para de desenhar (minimizada, aba ao
 * fundo) congela o primeiro quadro da animação e o quadro de edição fica
 * eternamente a 50%. Já me atrapalhou duas vezes investigando. Escala travada
 * em 0,94 é um quadro 6% menor; opacidade travada em 0,5 é um quadro que
 * parece desligado.
 */
@keyframes salto {
  from {
    transform: scale(0.94);
  }
  to {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .salto {
    animation: none;
  }
}
</style>
