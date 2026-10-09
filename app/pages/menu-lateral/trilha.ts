/**
 * O QUE A TRILHA E O INÍCIO SABEM FAZER (rodada 15).
 *
 * As regras vêm do ClickUp, mostradas pela Mikaela em 21 prints:
 *
 *  - a trilha NÃO se reordena nem se arrasta: escolhe-se o que aparece nela
 *    (Personalizar > Navegação, ou o alfinete em "Mais"). Fixar com a trilha
 *    cheia troca o último ícone, e ele vai para dentro de "Mais";
 *  - os itens nativos do Início têm ordem fixa: escolhe-se quais aparecem, e
 *    o resto fica em "⋯ Mais", com alfinete e atalho para Personalizar;
 *  - as SEÇÕES do Início se reordenam arrastando no próprio menu, sem abrir
 *    Personalizar, e só Favoritos se oculta;
 *  - seção criada entra no topo.
 *
 * O arraste passa pelo rascunho e acende o Salvar (regra dela desde a rodada
 * 5); a janela Personalizar e o alfinete valem na hora, como no ClickUp.
 *
 * RODADA 16, onde o ENSPACE sai do ClickUp de propósito:
 *
 *   "diferente do clickup, permitiremos reordenaçao na trilha e reordenação
 *    nos menus nativos, nao so nos personalizados!" (Mikaela)
 *
 * A trilha e os itens nativos do Início passam a se arrastar, com as mesmas
 * duas portas das seções: no próprio menu (rascunho e Salvar) e em
 * Personalizar (vale na hora). E tudo se oculta, nativo também.
 */

import { LIMITE_DA_TRILHA, useMenuDoWorkspace, type Atalho, type PrefsDaTrilha, type SecaoPessoal } from './estado'
import type { Categoria } from './mocks'

export type AbaDePersonalizar = 'navegacao' | 'inicio' | 'secoes' | 'temas'

/** As janelas e os popovers que mais de um lugar abre. */
export function useJanelasDaTrilha() {
  return {
    /** Personalizar aberta, e em qual aba. `null` é fechada. */
    personalizar: useState<AbaDePersonalizar | null>('trilha-personalizar', () => null),
    /** Criar seção (`'nova'`) ou renomear uma (o id dela). `null` é fechada. */
    criandoSecao: useState<string | null>('trilha-criar-secao', () => null),
    /** A seção cujo "+" está aberto, para o "Adicionar a" do "…" abrir o mesmo. */
    adicionandoEm: useState<string | null>('trilha-adicionar-em', () => null),
    /** Seções do Início recolhidas: o painel e o popover mostram igual. */
    recolhidas: useState<string[]>('trilha-secoes-recolhidas', () => []),
    /** Criar menu (rodada 16): `null` fechada, senão onde ele vai morar. */
    criandoMenu: useState<'inicio' | 'trilha' | null>('trilha-criar-menu', () => null),
    criandoCategoria: useState<boolean>('trilha-criar-categoria', () => false),
    /**
     * As categorias criadas pelo "+" (rodada 16). Moram aqui, e não no
     * mocks.ts, porque nascem na tela: o index.vue as soma às do mock.
     */
    categoriasCriadas: useState<Categoria[]>('trilha-categorias-criadas', () => []),
  }
}

export function chaveDoAtalho(a: Atalho) {
  return `${a.tipo}:${a.id}`
}

export function useTrilha() {
  const menu = useMenuDoWorkspace()
  const janelas = useJanelasDaTrilha()

  const prefs = computed(() => menu.prefs.value)

  /* ------------------------------ a trilha ------------------------------ */

  /**
   * Fixar na trilha. Cheia, troca o ÚLTIMO, que volta para "Mais". `existentes`
   * são as áreas que existem agora (módulo desligado não ocupa vaga).
   */
  function fixar(id: string, existentes: string[]) {
    menu.aplicarPrefs((p) => {
      if (p.fixadas.includes(id)) return
      const ocupadas = p.fixadas.filter(f => existentes.includes(f))
      // Início ocupa uma vaga e não sai.
      if (ocupadas.length + 1 >= LIMITE_DA_TRILHA) {
        const ultima = ocupadas[ocupadas.length - 1]
        p.fixadas = p.fixadas.filter(f => f !== ultima)
      }
      p.fixadas.push(id)
    })
  }

  function desafixar(id: string) {
    menu.aplicarPrefs((p) => { p.fixadas = p.fixadas.filter(f => f !== id) })
  }

  /**
   * A ordem da trilha (rodada 16). Início não sai do topo: ele é a âncora, e
   * cair no meio da trilha seria perder a porta de casa.
   */
  function reordenar(lista: string[], quem: string, alvo: string, posicao: 'antes' | 'depois') {
    const sem = lista.filter(x => x !== quem)
    const i = sem.indexOf(alvo)
    if (i < 0) return lista
    sem.splice(i + (posicao === 'depois' ? 1 : 0), 0, quem)
    return sem
  }

  function moverNaTrilha(quem: string, alvo: string, posicao: 'antes' | 'depois', ja = false) {
    if (quem === 'inicio') return
    const mudanca = (p: PrefsDaTrilha) => {
      if (alvo === 'inicio') {
        p.fixadas = [quem, ...p.fixadas.filter(x => x !== quem)]
        return
      }
      p.fixadas = reordenar(p.fixadas, quem, alvo, posicao)
    }
    if (ja) menu.aplicarPrefs(mudanca)
    else menu.arrastarPrefs(`trilha:${quem}`, mudanca)
  }

  function alternarRotulos(v: boolean) {
    menu.aplicarPrefs((p) => { p.rotulos = v })
  }

  /* ------------------------- os nativos do Início ------------------------- */

  function mostrarNoInicio(id: string, mostrar: boolean) {
    menu.aplicarPrefs((p) => {
      p.inicioOcultos = mostrar
        ? p.inicioOcultos.filter(x => x !== id)
        : [...new Set([...p.inicioOcultos, id])]
    })
  }

  /** A ordem dos nativos do Início: a guardada, mais os que nasceram depois. */
  function ordemDoInicio(existentes: string[]) {
    const guardada = prefs.value.ordemDoInicio.filter(id => existentes.includes(id))
    return [...guardada, ...existentes.filter(id => !guardada.includes(id))]
  }

  function moverNoInicio(quem: string, alvo: string, posicao: 'antes' | 'depois', existentes: string[], ja = false) {
    const atual = ordemDoInicio(existentes)
    const mudanca = (p: PrefsDaTrilha) => { p.ordemDoInicio = reordenar(atual, quem, alvo, posicao) }
    if (ja) menu.aplicarPrefs(mudanca)
    else menu.arrastarPrefs(`inicio:${quem}`, mudanca)
  }

  /* ------------------------------ as seções ------------------------------ */

  /** A ordem das seções do Início: a guardada, mais as que nasceram depois. */
  function ordemDasSecoes(existentes: string[]) {
    const guardada = prefs.value.ordemDasSecoes.filter(id => existentes.includes(id))
    return [...guardada, ...existentes.filter(id => !guardada.includes(id))]
  }

  /** Arrastar seção no menu: rascunho e Salvar. */
  function arrastarSecao(quem: string, alvo: string, posicao: 'antes' | 'depois', existentes: string[]) {
    const atual = ordemDasSecoes(existentes)
    menu.arrastarPrefs(`secao-inicio:${quem}`, (p) => { p.ordemDasSecoes = reordenar(atual, quem, alvo, posicao) })
  }

  /** Arrastar seção em Personalizar > Seções: vale na hora. */
  function reordenarSecoesJa(quem: string, alvo: string, posicao: 'antes' | 'depois', existentes: string[]) {
    const atual = ordemDasSecoes(existentes)
    menu.aplicarPrefs((p) => { p.ordemDasSecoes = reordenar(atual, quem, alvo, posicao) })
  }

  function ocultarSecao(id: string, ocultar: boolean) {
    menu.aplicarPrefs((p) => {
      p.secoesOcultas = ocultar
        ? [...new Set([...p.secoesOcultas, id])]
        : p.secoesOcultas.filter(x => x !== id)
    })
  }

  /** Seção nova entra NO TOPO, como no ClickUp. Devolve o id. */
  function criarSecao(rotulo: string, icone: string) {
    const id = `p-${Date.now().toString(36)}`
    menu.aplicarPrefs((p) => {
      p.pessoais.push({ id, rotulo: rotulo.trim(), icone, itens: [], ordem: 'personalizada' })
      p.ordemDasSecoes = [id, ...p.ordemDasSecoes.filter(x => x !== id)]
    })
    return id
  }

  function renomearSecao(id: string, rotulo: string, icone: string) {
    menu.aplicarPrefs((p) => {
      const s = p.pessoais.find(x => x.id === id)
      if (!s) return
      s.rotulo = rotulo.trim()
      s.icone = icone
    })
  }

  function excluirSecao(id: string) {
    menu.aplicarPrefs((p) => {
      p.pessoais = p.pessoais.filter(x => x.id !== id)
      p.ordemDasSecoes = p.ordemDasSecoes.filter(x => x !== id)
    })
  }

  function pessoal(id: string): SecaoPessoal | undefined {
    return prefs.value.pessoais.find(x => x.id === id)
  }

  function ordenarSecao(id: string, ordem: SecaoPessoal['ordem']) {
    menu.aplicarPrefs((p) => {
      const s = p.pessoais.find(x => x.id === id)
      if (s) s.ordem = ordem
    })
  }

  /* ------------------------ os atalhos de uma seção ------------------------ */

  /** Pelo "+" da seção: vale na hora, como escolher na lista do ClickUp. */
  function adicionarAtalho(secaoId: string, a: Atalho) {
    menu.aplicarPrefs((p) => {
      const s = p.pessoais.find(x => x.id === secaoId)
      if (!s || s.itens.some(i => chaveDoAtalho(i) === chaveDoAtalho(a))) return
      s.itens.push(a)
    })
  }

  function removerAtalho(secaoId: string, chave: string) {
    menu.aplicarPrefs((p) => {
      const s = p.pessoais.find(x => x.id === secaoId)
      if (s) s.itens = s.itens.filter(i => chaveDoAtalho(i) !== chave)
    })
  }

  /**
   * Arrastar um atalho: dentro da seção reordena (e a seção passa para
   * Personalizada, senão o próximo recálculo desfaz o gesto); para outra
   * seção, muda de seção. Rascunho e Salvar.
   */
  function arrastarAtalho(deSecao: string, chave: string, paraSecao: string, alvoChave: string | null, posicao: 'antes' | 'depois') {
    menu.arrastarPrefs(`atalho:${paraSecao}:${chave}`, (p) => {
      const origem = p.pessoais.find(x => x.id === deSecao)
      const destino = p.pessoais.find(x => x.id === paraSecao)
      if (!origem || !destino) return
      const item = origem.itens.find(i => chaveDoAtalho(i) === chave)
      if (!item) return
      origem.itens = origem.itens.filter(i => chaveDoAtalho(i) !== chave)
      if (destino.itens.some(i => chaveDoAtalho(i) === chave)) return
      const i = alvoChave ? destino.itens.findIndex(x => chaveDoAtalho(x) === alvoChave) : -1
      if (i < 0) destino.itens.push(item)
      else destino.itens.splice(i + (posicao === 'depois' ? 1 : 0), 0, item)
      destino.ordem = 'personalizada'
    })
  }

  /** Soltar uma tela, um menu ou uma categoria em cima de uma seção pessoal. */
  function soltarNaSecao(secaoId: string, a: Atalho) {
    menu.arrastarPrefs(`atalho:${secaoId}:${chaveDoAtalho(a)}`, (p: PrefsDaTrilha) => {
      const s = p.pessoais.find(x => x.id === secaoId)
      if (!s || s.itens.some(i => chaveDoAtalho(i) === chaveDoAtalho(a))) return
      s.itens.push(a)
    })
  }

  /* ------------------------------ Personalizar ------------------------------ */

  /** Abrir Personalizar uma vez tira o botão do pé do menu e o põe no topo. */
  function abrirPersonalizar(aba: AbaDePersonalizar = 'navegacao') {
    janelas.personalizar.value = aba
    if (!prefs.value.personalizou) menu.aplicarPrefs((p) => { p.personalizou = true })
  }

  function alternarRecolhida(id: string) {
    const r = janelas.recolhidas.value
    janelas.recolhidas.value = r.includes(id) ? r.filter(x => x !== id) : [...r, id]
  }

  return {
    prefs,
    fixar,
    desafixar,
    moverNaTrilha,
    ordemDoInicio,
    moverNoInicio,
    alternarRotulos,
    mostrarNoInicio,
    ordemDasSecoes,
    arrastarSecao,
    reordenarSecoesJa,
    ocultarSecao,
    criarSecao,
    renomearSecao,
    excluirSecao,
    pessoal,
    ordenarSecao,
    adicionarAtalho,
    removerAtalho,
    arrastarAtalho,
    soltarNaSecao,
    abrirPersonalizar,
    alternarRecolhida,
    ...janelas,
  }
}
