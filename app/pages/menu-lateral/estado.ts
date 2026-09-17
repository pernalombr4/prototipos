/**
 * O estado do menu, compartilhado pelo editor e pela barra.
 *
 * Rodada 5. Antes o editor tinha uma cópia sua da árvore e a barra lia direto do
 * `mocks.ts`: criar uma seção mudava o editor e não mudava o menu. Agora existe
 * UMA árvore, e o editor é o lugar onde ela se edita.
 *
 * Duas árvores, de propósito:
 *
 *   `aoVivo`   o que a barra mostra;
 *   `rascunho` o que o editor manipula.
 *
 * Arrastar mexe no rascunho. `salvar()` copia o rascunho por cima do ao vivo;
 * `descartar()` faz o contrário. É a regra dela: "salvar depois de arrastar
 * tudo. nao salva em tempo real".
 *
 * Nada persiste: recarregar a página volta ao começo, como todo o protótipo.
 */

import { menuDoEditor, secoesDeModulo, modulos, notificacoes, podeMover, type NoDoMenu, type TipoDeNo } from './mocks'

function clonar(a: NoDoMenu[]): NoDoMenu[] {
  return JSON.parse(JSON.stringify(a))
}

/**
 * A árvore completa: o nativo mais o que os módulos trazem mais o que o
 * workspace criou. Ela nasce inteira e o que decide o que aparece é o filtro
 * de origem, não a montagem: assim o administrador pode reordenar a seção de
 * um módulo como reordena qualquer outra, e ligar o módulo de volta devolve a
 * seção no lugar em que ele a tinha deixado.
 */
function arvoreCompleta(): NoDoMenu[] {
  return clonar([...menuDoEditor, ...secoesDeModulo])
}

export interface Recusa {
  id: string
  motivo: string
}

export function useMenuDoWorkspace() {
  const aoVivo = useState<NoDoMenu[]>('menu-ao-vivo', () => arvoreCompleta())
  const rascunho = useState<NoDoMenu[]>('menu-rascunho', () => arvoreCompleta())

  /*
   * OS DOIS MODOS DA DEMONSTRAÇÃO.
   *
   * `modulosAtivos`        quais módulos estão ligados em Configurações > Módulos;
   * `mostrarPersonalizados` se as seções que o workspace criou aparecem.
   *
   * Com os dois vazios/desligados, o menu fica 100% nativo: é o que existe em
   * qualquer workspace recém-criado, e é o estado que a demanda pediu para
   * poder ver separado.
   */
  const modulosAtivos = useState<string[]>('menu-modulos-ativos', () =>
    modulos.filter(m => m.ativoPorPadrao).map(m => m.id),
  )
  const mostrarPersonalizados = useState<boolean>('menu-personalizados', () => true)

  /*
   * AS NOTIFICAÇÕES DO INBOX (rodada 9).
   *
   * Moram aqui, e não dentro da tela, porque quem mostra o contador é o MENU e
   * quem zera é a tela: se cada um tivesse a sua lista, abrir o Inbox não
   * apagaria o número da barra, que é justamente o que ela pediu para ver.
   */
  const lidas = useState<string[]>('menu-notificacoes-lidas', () => [])

  const naoLidas = computed(() => notificacoes.filter(n => !lidas.value.includes(n.id)).length)

  function lida(id: string) {
    return lidas.value.includes(id)
  }

  function marcarLida(id: string) {
    if (!lidas.value.includes(id)) lidas.value.push(id)
  }

  function marcarTodasLidas() {
    lidas.value = notificacoes.map(n => n.id)
  }

  /** Um nó sem origem declarada é nativo: nativo é o padrão do produto. */
  function origemDe(n: NoDoMenu) {
    return n.origem ?? 'nativo'
  }

  function visivel(n: NoDoMenu) {
    const o = origemDe(n)
    if (o === 'modulo') return modulosAtivos.value.includes(n.moduloId ?? '')
    if (o === 'workspace') return mostrarPersonalizados.value
    return true
  }

  function alternarModulo(id: string) {
    const i = modulosAtivos.value.indexOf(id)
    if (i >= 0) modulosAtivos.value.splice(i, 1)
    else modulosAtivos.value.push(id)
  }

  /** Os dois modos que a demanda pediu, num controle só. */
  function soNativo() {
    modulosAtivos.value = []
    mostrarPersonalizados.value = false
  }

  function comTudo() {
    modulosAtivos.value = modulos.filter(m => m.ativoPorPadrao).map(m => m.id)
    mostrarPersonalizados.value = true
  }

  const modoDoMenu = computed<'nativo' | 'completo'>(() =>
    modulosAtivos.value.length === 0 && !mostrarPersonalizados.value ? 'nativo' : 'completo',
  )

  /*
   * A ordem manual das categorias.
   *
   * Fica fora da árvore de propósito: a árvore é a configuração do workspace, e
   * a ordem das categorias é preferência de quem usa, como o favorito. Mas
   * viaja no mesmo rascunho, porque arrastar é arrastar: acende a mesma barra e
   * grava no mesmo Salvar.
   *
   * Vazia significa "nunca foi ordenada à mão".
   */
  const ordemCategorias = useState<number[]>('menu-ordem-cat', () => [])
  const ordemCategoriasRascunho = useState<number[]>('menu-ordem-cat-rascunho', () => [])

  const alterado = computed(() =>
    JSON.stringify(aoVivo.value) !== JSON.stringify(rascunho.value)
    || JSON.stringify(ordemCategorias.value) !== JSON.stringify(ordemCategoriasRascunho.value),
  )

  function salvar() {
    aoVivo.value = clonar(rascunho.value)
    ordemCategorias.value = [...ordemCategoriasRascunho.value]
  }

  function descartar() {
    rascunho.value = clonar(aoVivo.value)
    ordemCategoriasRascunho.value = [...ordemCategorias.value]
  }

  /**
   * Semeia a ordem manual com o que está na tela AGORA, sempre.
   *
   * Sempre, e não só na primeira vez: quem estava vendo a lista em ordem
   * alfabética e arrasta espera que ela continue alfabética e só o item movido
   * mude de lugar. Reaproveitar uma ordem manual antiga embaralharia tudo no
   * primeiro gesto, que é o contrário do que o gesto pediu.
   */
  function semearOrdemDeCategorias(ids: number[]) {
    ordemCategoriasRascunho.value = [...ids]
  }

  /** Move uma categoria na ordem manual, em relação a outra. */
  function reordenarCategoria(arrastadoId: number, alvoId: number, posicao: 'antes' | 'depois') {
    const lista = [...ordemCategoriasRascunho.value]
    const de = lista.indexOf(arrastadoId)
    if (de < 0) return
    lista.splice(de, 1)
    const para = lista.indexOf(alvoId)
    if (para < 0) return
    lista.splice(para + (posicao === 'depois' ? 1 : 0), 0, arrastadoId)
    ordemCategoriasRascunho.value = lista
  }

  /** Onde um nó está dentro de uma árvore: os irmãos, o índice e o pai. */
  function localizar(arvore: NoDoMenu[], id: string) {
    const i = arvore.findIndex(n => n.id === id)
    if (i >= 0) return { irmaos: arvore, indice: i, pai: null as NoDoMenu | null }
    for (const pai of arvore) {
      if (!pai.filhos) continue
      const j = pai.filhos.findIndex(n => n.id === id)
      if (j >= 0) return { irmaos: pai.filhos, indice: j, pai }
    }
    return null
  }

  function acharNo(arvore: NoDoMenu[], id: string): NoDoMenu | null {
    for (const n of arvore) {
      if (n.id === id) return n
      const f = n.filhos?.find(x => x.id === id)
      if (f) return f
    }
    return null
  }

  /**
   * Solta `arrastadoId` em relação a `alvoId`.
   *
   * `posicao` diz o que fazer: `antes` e `depois` inserem entre os irmãos do
   * alvo; `dentro` põe como último filho do alvo, e só vale quando o alvo é
   * uma seção.
   *
   * Devolve a recusa quando a regra do ENSPACE não deixa, com o motivo.
   */
  /**
   * O veredito sem mexer em nada, para a tela poder pintar a marca de recusa
   * enquanto o item ainda está no ar.
   */
  function avaliar(
    arrastadoId: string | null,
    alvoId: string,
    posicao: 'antes' | 'depois' | 'dentro',
  ): { ok: true } | { ok: false, motivo: string } {
    if (!arrastadoId || arrastadoId === alvoId) return { ok: true }
    const arvore = rascunho.value
    const arrastado = acharNo(arvore, arrastadoId)
    const alvo = acharNo(arvore, alvoId)
    if (!arrastado || !alvo) return { ok: true }
    if (arrastado.filhos?.some(f => f.id === alvoId)) return { ok: true }

    const ondeAlvo = localizar(arvore, alvoId)
    const tipoDoPaiFuturo: TipoDeNo = posicao === 'dentro'
      ? alvo.tipo
      : (ondeAlvo?.pai?.tipo ?? 'raiz')

    const veredito = podeMover(arrastado.tipo, tipoDoPaiFuturo)
    return veredito.pode ? { ok: true } : { ok: false, motivo: veredito.motivo ?? '' }
  }

  function soltar(
    arrastadoId: string,
    alvoId: string,
    posicao: 'antes' | 'depois' | 'dentro',
  ): { ok: true } | { ok: false, motivo: string } {
    const arvore = rascunho.value
    if (arrastadoId === alvoId) return { ok: true }

    const arrastado = acharNo(arvore, arrastadoId)
    const alvo = acharNo(arvore, alvoId)
    if (!arrastado || !alvo) return { ok: true }
    if (arrastado.filhos?.some(f => f.id === alvoId)) return { ok: true }

    const veredito = avaliar(arrastadoId, alvoId, posicao)
    if (!veredito.ok) return veredito

    // Tira de onde estava.
    const ondeArrastado = localizar(arvore, arrastadoId)
    if (!ondeArrastado) return { ok: true }
    ondeArrastado.irmaos.splice(ondeArrastado.indice, 1)

    // Põe onde foi solto. Releitura do alvo porque o splice mexeu nos índices.
    if (posicao === 'dentro') {
      alvo.filhos = alvo.filhos ?? []
      alvo.filhos.push(arrastado)
      return { ok: true }
    }

    const destino = localizar(arvore, alvoId)
    if (!destino) return { ok: true }
    destino.irmaos.splice(destino.indice + (posicao === 'depois' ? 1 : 0), 0, arrastado)
    return { ok: true }
  }

  /** O caminho de teclado: move um passo entre os irmãos, sem sair do pai. */
  function mover(id: string, passo: -1 | 1) {
    const onde = localizar(rascunho.value, id)
    if (!onde) return
    const alvo = onde.indice + passo
    if (alvo < 0 || alvo >= onde.irmaos.length) return
    const [no] = onde.irmaos.splice(onde.indice, 1)
    onde.irmaos.splice(alvo, 0, no!)
  }

  function adicionarSecao(no: NoDoMenu) {
    rascunho.value.push(no)
  }

  function adicionarItem(no: NoDoMenu, secaoId: string) {
    const secao = rascunho.value.find(n => n.id === secaoId)
    if (!secao) return
    secao.filhos = secao.filhos ?? []
    secao.filhos.push(no)
  }

  /* --------------- o que a barra lê --------------- */

  /*
   * A barra lê o RASCUNHO, não o ao vivo. Parece contraditório com "não salva em
   * tempo real", e não é: arrastar sem ver o resultado é arrastar no escuro. O
   * que a regra dela protege é a GRAVAÇÃO, e essa só acontece no `salvar()`.
   * O `aoVivo` é a linha de base: é com ele que o `alterado` compara, e é para
   * ele que o `descartar()` volta.
   */
  const destinos = computed(() => rascunho.value.filter(n => n.tipo === 'destino' && visivel(n)))
  const secaoDeCategorias = computed(() => rascunho.value.find(n => n.tipo === 'secao-nativa') ?? null)

  /** As seções que aparecem agora: nativas sempre, módulo e workspace conforme o modo. */
  const secoes = computed(() => rascunho.value.filter(n => n.tipo === 'secao' && visivel(n)))

  /** A árvore inteira filtrada, que é o que o editor mostra. */
  const arvoreVisivel = computed(() => rascunho.value.filter(visivel))

  /** No modelo de trilha: as que o administrador mandou para a trilha. */
  const secoesNaTrilha = computed(() => secoes.value.filter(s => s.lugar === 'trilha'))
  const secoesNoPainel = computed(() => secoes.value.filter(s => s.lugar !== 'trilha'))

  return {
    aoVivo,
    rascunho,
    alterado,
    salvar,
    descartar,
    soltar,
    avaliar,
    mover,
    ordemCategoriasRascunho,
    semearOrdemDeCategorias,
    reordenarCategoria,
    adicionarSecao,
    adicionarItem,
    localizar,
    destinos,
    secaoDeCategorias,
    secoes,
    arvoreVisivel,
    origemDe,
    modulosAtivos,
    mostrarPersonalizados,
    alternarModulo,
    naoLidas,
    lida,
    marcarLida,
    marcarTodasLidas,
    soNativo,
    comTudo,
    modoDoMenu,
    secoesNaTrilha,
    secoesNoPainel,
  }
}

/* ==================================================================
   O ARRASTE
   HTML5 nativo, sem biblioteca: a regra 3 diz Nuxt UI e mais nada, e
   arrastar já vem no navegador.
================================================================== */

export interface AlvoDeSolta {
  id: string
  posicao: 'antes' | 'depois' | 'dentro'
}

export function useArraste() {
  const arrastando = useState<string | null>('menu-arrastando', () => null)
  const alvo = useState<AlvoDeSolta | null>('menu-alvo', () => null)
  const recusado = useState<boolean>('menu-recusado', () => false)

  function comecar(id: string) {
    arrastando.value = id
    alvo.value = null
    recusado.value = false
  }

  function mirar(id: string, posicao: 'antes' | 'depois' | 'dentro') {
    if (!arrastando.value || arrastando.value === id) return
    alvo.value = { id, posicao }
  }

  function terminar() {
    arrastando.value = null
    alvo.value = null
    recusado.value = false
  }

  return { arrastando, alvo, recusado, comecar, mirar, terminar }
}
