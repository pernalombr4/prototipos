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

/** Para quem vale o que eu acabei de arrumar. */
export type Alcance = 'todos' | 'local'

export interface Recusa {
  id: string
  motivo: string
}

/* ==================================================================
   AS PREFERÊNCIAS DA TRILHA (rodada 15)

   O que a Mikaela mostrou do ClickUp, item por item, e que aqui vira
   preferência de quem usa:

     `fixadas`         o que aparece na trilha, NA ORDEM em que foi fixado.
                       A trilha não se arrasta. Fixar com a trilha cheia
                       troca o último, e o último vai para "Mais";
     `rotulos`         "Ícones e rótulos" ou "Somente ícones";
     `inicioOcultos`   os itens nativos do Início que foram para "⋯ Mais";
     `ordemDoInicio`   a ordem desses itens. Rodada 16: aqui se arrasta,
                       DIFERENTE do ClickUp, a pedido dela;
     `ordemDasSecoes`  a ordem das seções do Início, que se arrasta no
                       próprio menu ou em Personalizar > Seções;
     `secoesOcultas`   rodada 16: qualquer seção se oculta, nativa também;
     `pessoais`        as seções que a pessoa criou, com atalhos para telas,
                       menus e categorias que já existem;
     `personalizou`    abriu Personalizar uma vez: o botão sai do pé do menu
                       e vira ícone no cabeçalho.

   Duas cópias, como o menu: o que se ARRASTA no menu vai para o rascunho e
   espera o Salvar (a regra dela desde a rodada 5); o que se escolhe na
   janela Personalizar vale na hora, nas duas, como no ClickUp.
================================================================== */

/** Um atalho dentro de uma seção pessoal. Categoria guarda o id como texto. */
export interface Atalho {
  tipo: 'destino' | 'tela' | 'menu' | 'categoria'
  id: string
}

export interface SecaoPessoal {
  id: string
  rotulo: string
  icone: string
  itens: Atalho[]
  ordem: 'personalizada' | 'alfabetica' | 'recentes'
}

export interface PrefsDaTrilha {
  fixadas: string[]
  rotulos: boolean
  inicioOcultos: string[]
  ordemDoInicio: string[]
  ordemDasSecoes: string[]
  secoesOcultas: string[]
  pessoais: SecaoPessoal[]
  personalizou: boolean
}

/**
 * Quantos ícones cabem na trilha, Início incluído, a 900 px de altura. Eram
 * seis na rodada 15; Integrações (rodada 16) pediu mais espaço, e a base da
 * trilha ainda sobra.
 */
export const LIMITE_DA_TRILHA = 8

/*
 * Rodada 16: "deve ser possível o user ocultar nativos também, se quiser".
 * Nada no Início fica travado, e qualquer seção se oculta. A única âncora
 * que sobra é o ícone Início na trilha: sem ele não existe este menu.
 */

function prefsIniciais(): PrefsDaTrilha {
  return {
    // Conhecimento e Comparações começam em "Mais", para a trilha mostrar o mecanismo.
    fixadas: ['dados', 'sec:s-analise', 'sec:s-auditoria', 'sec:s-comercial', 'sec:s-integracoes', 'config'],
    rotulos: true,
    inicioOcultos: ['n-documentos', 'todas-categorias'],
    ordemDoInicio: [],
    ordemDasSecoes: ['p-rotina', 'favoritos', 'categorias'],
    secoesOcultas: [],
    /*
     * Uma seção pessoal de exemplo, para o protótipo mostrar o que ela
     * pediu: "uma seção pode ter menus com submenus dentro". Dado do
     * protótipo; numa conta nova esta lista nasce vazia.
     */
    pessoais: [{
      id: 'p-rotina',
      rotulo: 'Rotina do jurídico',
      icone: 'i-lucide-scale',
      ordem: 'personalizada',
      itens: [
        { tipo: 'menu', id: 's-auditoria' },
        { tipo: 'categoria', id: '1' },
        { tipo: 'destino', id: 'n-tarefas' },
      ],
    }],
    personalizou: false,
  }
}

function clonarPrefs(p: PrefsDaTrilha): PrefsDaTrilha {
  return JSON.parse(JSON.stringify(p))
}

export function useMenuDoWorkspace() {
  const prefsAoVivo = useState<PrefsDaTrilha>('trilha-prefs', prefsIniciais)
  const prefs = useState<PrefsDaTrilha>('trilha-prefs-rascunho', prefsIniciais)

  /** Vale na hora, nas duas cópias: é o que a janela Personalizar faz. */
  function aplicarPrefs(mudanca: (p: PrefsDaTrilha) => void) {
    mudanca(prefs.value)
    mudanca(prefsAoVivo.value)
  }

  /** Vai para o rascunho e acende o Salvar: é o que o arraste faz. */
  function arrastarPrefs(toque: string, mudanca: (p: PrefsDaTrilha) => void) {
    mudanca(prefs.value)
    marcarTocado(toque)
  }

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

  /*
   * ============ O ALCANCE DO SALVAR (rodada 12) ============
   *
   * "o botao flutuante de salvar pra todos os usuarios ou só alterar
   * localmente" (Mikaela).
   *
   * São duas camadas de verdade, não dois rótulos do mesmo botão:
   *
   *   `aoVivo`   o menu PUBLICADO, que todo mundo do workspace vê;
   *   `pessoal`  o meu menu, por cima daquele, quando eu arrumei só para mim.
   *
   * A barra sempre desenha o rascunho, e o rascunho nasce do meu menu se eu
   * tiver um, senão do menu do workspace. Publicar joga a cópia pessoal fora,
   * de propósito: o que eu publiquei virou o de todos, inclusive o meu.
   */
  const pessoal = useState<NoDoMenu[] | null>('menu-pessoal', () => null)
  const alcanceSalvo = useState<Alcance | null>('menu-alcance', () => null)

  /** O que o rascunho tem de bater para "nada mudou". */
  const base = computed(() => pessoal.value ?? aoVivo.value)

  /*
   * A BOLINHA AMARELA.
   *
   * Guardo os ids que a pessoa MEXEU, em vez de comparar as duas árvores e
   * deduzir. Comparação marcaria também todo mundo que andou de lugar por
   * tabela, e aí metade do menu ficaria amarela por causa de um arraste só.
   * A bolinha é "isto aqui foi você", não "isto aqui está diferente".
   */
  const tocados = useState<string[]>('menu-tocados', () => [])

  function marcarTocado(id: string) {
    if (!tocados.value.includes(id)) tocados.value.push(id)
  }

  /*
   * "Tem coisa para salvar?" e uma pergunta que a barra faz em toda
   * renderizacao. Antes ela era respondida serializando as duas arvores
   * inteiras e comparando os textos, o que custava a arvore toda, duas vezes,
   * a cada mexida.
   *
   * Agora e a lista de tocados que responde, e ela ja existia para a bolinha
   * amarela: TODO caminho que muda alguma coisa passa por marcarTocado, entao
   * ter alguem na lista e exatamente ter o que salvar. Rodada 13.
   *
   * De quebra conserta um exagero: escolher "Personalizada" no menu de
   * ordenacao mexia no rascunho da ordem e acendia a barra de salvar, e a
   * decisao da rodada 6 diz que a troca de criterio vale na hora e nao espera
   * Salvar. Agora so acende quando alguem arrasta de verdade.
   */
  const alterado = computed(() => tocados.value.length > 0)

  function salvar(alcance: Alcance = 'todos') {
    if (alcance === 'local') {
      pessoal.value = clonar(rascunho.value)
    }
    else {
      aoVivo.value = clonar(rascunho.value)
      pessoal.value = null
    }
    ordemCategorias.value = [...ordemCategoriasRascunho.value]
    prefsAoVivo.value = clonarPrefs(prefs.value)
    alcanceSalvo.value = alcance
    tocados.value = []
  }

  function descartar() {
    rascunho.value = clonar(base.value)
    ordemCategoriasRascunho.value = [...ordemCategorias.value]
    prefs.value = clonarPrefs(prefsAoVivo.value)
    tocados.value = []
  }

  /** Desfazer o "só para mim" e voltar ao menu que o workspace publicou. */
  function voltarAoDoWorkspace() {
    pessoal.value = null
    rascunho.value = clonar(aoVivo.value)
    tocados.value = []
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
    marcarTocado(`cat:${arrastadoId}`)
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
      marcarTocado(arrastadoId)
      return { ok: true }
    }

    const destino = localizar(arvore, alvoId)
    if (!destino) return { ok: true }
    destino.irmaos.splice(destino.indice + (posicao === 'depois' ? 1 : 0), 0, arrastado)
    marcarTocado(arrastadoId)
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
    marcarTocado(id)
  }

  /*
   * ============ O MENU DE CONTEXTO (rodada 14) ============
   *
   * Tudo o que o botão direito faz passa por aqui, e tudo mexe no RASCUNHO,
   * como o arraste: acende a bolinha, acende o cartão de salvar, e a pessoa
   * escolhe se vale para todos ou só para ela. Ocultar com "Salvar só para
   * mim" é o Hide do ClickUp; com "Salvar para todos", é o administrador
   * tirando o item do menu de todo mundo.
   */

  /** Sobe ou desce para a raiz do menu, ao lado da seção onde estava. */
  function moverParaPrimeiroNivel(id: string) {
    const onde = localizar(rascunho.value, id)
    if (!onde?.pai) return { ok: true as const }
    return soltar(id, onde.pai.id, 'depois')
  }

  function moverParaSecao(id: string, secaoId: string) {
    return soltar(id, secaoId, 'dentro')
  }

  function ocultar(id: string) {
    const no = acharNo(rascunho.value, id)
    if (!no) return
    no.oculto = true
    marcarTocado(id)
  }

  function mostrar(id: string) {
    const no = acharNo(rascunho.value, id)
    if (!no) return
    no.oculto = false
    marcarTocado(id)
  }

  function renomear(id: string, rotulo: string) {
    const no = acharNo(rascunho.value, id)
    const limpo = rotulo.trim()
    if (!no || !limpo || limpo === no.rotulo) return
    no.rotulo = limpo
    marcarTocado(id)
  }

  /** Trilha ou painel, no modelo de trilha. `painel` diz em qual painel entra. */
  function mudarLugar(id: string, lugar: 'trilha' | 'painel', painel = 'trabalho') {
    const no = acharNo(rascunho.value, id)
    if (!no || no.tipo !== 'secao') return
    if (no.lugar === lugar && (lugar === 'trilha' || (no.painel ?? 'trabalho') === painel)) return
    no.lugar = lugar
    if (lugar === 'painel') no.painel = painel
    marcarTocado(id)
  }

  function adicionarSecao(no: NoDoMenu) {
    rascunho.value.push(no)
    marcarTocado(no.id)
  }

  function adicionarItem(no: NoDoMenu, secaoId: string) {
    const secao = rascunho.value.find(n => n.id === secaoId)
    if (!secao) return
    secao.filhos = secao.filhos ?? []
    secao.filhos.push(no)
    marcarTocado(no.id)
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

  /*
   * O QUE AS BARRAS DESENHAM (rodada 14): o mesmo de cima, menos o que foi
   * ocultado. O editor e a busca continuam lendo as listas inteiras: oculto é
   * "fora do meu caminho", não "apagado".
   *
   * São cópias rasas, e os filhos filtrados moram nelas. Quem mexe na árvore
   * mexe pelo id, nunca pelo objeto desenhado.
   */
  function semOcultos(n: NoDoMenu): NoDoMenu {
    return n.filhos ? { ...n, filhos: n.filhos.filter(f => !f.oculto) } : n
  }
  const arvoreDaBarra = computed(() => arvoreVisivel.value.filter(n => !n.oculto).map(semOcultos))
  const destinosDaBarra = computed(() => destinos.value.filter(n => !n.oculto))
  const secoesDaBarra = computed(() => secoes.value.filter(n => !n.oculto).map(semOcultos))

  /** Tudo o que está oculto agora, para o "Itens ocultos" do pé da barra. */
  const ocultos = computed(() => {
    const lista: NoDoMenu[] = []
    for (const n of arvoreVisivel.value) {
      if (n.oculto) lista.push(n)
      for (const f of n.filhos ?? []) if (f.oculto) lista.push(f)
    }
    return lista
  })

  /** No modelo de trilha: as que o administrador mandou para a trilha. */
  const secoesNaTrilha = computed(() => secoesDaBarra.value.filter(s => s.lugar === 'trilha'))
  const secoesNoPainel = computed(() => secoesDaBarra.value.filter(s => s.lugar !== 'trilha'))

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
    pessoal,
    alcanceSalvo,
    voltarAoDoWorkspace,
    tocados,
    marcarTocado,
    naoLidas,
    lida,
    marcarLida,
    marcarTodasLidas,
    soNativo,
    comTudo,
    modoDoMenu,
    secoesNaTrilha,
    secoesNoPainel,
    arvoreDaBarra,
    destinosDaBarra,
    secoesDaBarra,
    ocultos,
    acharNo: (id: string) => acharNo(rascunho.value, id),
    prefs,
    aplicarPrefs,
    arrastarPrefs,
    moverParaPrimeiroNivel,
    moverParaSecao,
    ocultar,
    mostrar,
    renomear,
    mudarLugar,
  }
}

/**
 * Menu recolhido ou aberto (rodada 14). Um estado só para os dois modelos:
 * trocar de modelo no andaime não reabre o menu que a pessoa recolheu.
 * Não sobrevive ao recarregar, como o resto do protótipo.
 */
export function useMenuRecolhido() {
  return useState<boolean>('menu-recolhido', () => false)
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
