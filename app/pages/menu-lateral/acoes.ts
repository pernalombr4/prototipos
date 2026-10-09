/**
 * O MENU DE CONTEXTO DO MENU LATERAL (rodada 14).
 *
 * "ao clicar com botao direito em cada menu/trilha tem que ter funcionalidades
 * aparecendo ali. pesquise como o clickup trabalha com iso" (Mikaela).
 *
 * A gramática é a do ClickUp, que no botão direito de Space, Folder e List põe
 * sempre os mesmos três blocos, nesta ordem:
 *
 *   1. ir:        abrir, abrir em nova aba, copiar link;
 *   2. arrumar:   favoritar, mover, mover para outro lugar;
 *   3. mexer:     renomear, ocultar, configurar.
 *
 * O que muda de um tipo de linha para o outro é QUAL item entra em cada bloco,
 * nunca a ordem dos blocos: quem aprendeu num lugar acha no outro. É por isso
 * que tudo mora aqui, num arquivo só, e os dois modelos (barra e trilha)
 * montam o menu pelas mesmas funções.
 *
 * Tudo o que mexe no menu mexe no RASCUNHO (estado.ts), como o arraste: acende
 * a bolinha amarela e o cartão de salvar. O botão direito é um segundo caminho
 * para o mesmo gesto, não uma regra nova de gravação.
 *
 * Também é o caminho de teclado que faltava: Shift+F10 ou a tecla de menu
 * abrem este mesmo menu na linha com foco, e "Mover para" leva um item para
 * dentro de outra seção, coisa que Alt com as setas não fazia.
 */

import type { ContextMenuItem } from '@nuxt/ui'
import type { Categoria, NoDoMenu } from './mocks'
import type { TextosDaTela } from './textos'
import { useMenuDoWorkspace } from './estado'

export type Acoes = ContextMenuItem[][]

export interface Ganchos {
  t: () => TextosDaTela
  podeConfigurar: () => boolean
  rotuloDe: (no: NoDoMenu) => string
  abrirDestino: (id: string) => void
  abrirCategoria: (c: Categoria) => void
  alternarFixar: (id: number) => void
  configurarCategoria: (c: Categoria) => void
  /** Abre o editor com o formulário de tela nova já apontando para a seção. */
  novaTela: (secaoId: string) => void
  /** Seção aberta ou fechada, que cada barra guarda do seu jeito. */
  secaoAberta: (id: string) => boolean
  alternarSecao: (id: string) => void
}

export function useAcoesDoMenu(g: Ganchos) {
  const menu = useMenuDoWorkspace()
  const toast = useToast()

  /* ------------------------------ o bloco "ir" ------------------------------ */

  function copiarLink(ancora: string) {
    // Só o endereço da própria página com uma âncora: nada sai do navegador.
    const url = `${window.location.origin}${window.location.pathname}#${ancora}`
    navigator.clipboard?.writeText(url).catch(() => {})
    toast.add({ title: g.t().linkCopiado, icon: 'i-lucide-link', color: 'neutral' })
  }

  function blocoIr(abrir: () => void, ancora: string): ContextMenuItem[] {
    const t = g.t()
    return [
      { label: t.ctxAbrir, icon: 'i-lucide-arrow-up-right', onSelect: abrir },
      {
        label: t.ctxNovaAba,
        icon: 'i-lucide-external-link',
        onSelect: () => toast.add({ title: t.novaAbaMaquete, icon: 'i-lucide-hammer', color: 'neutral' }),
      },
      { label: t.ctxCopiarLink, icon: 'i-lucide-link', onSelect: () => copiarLink(ancora) },
    ]
  }

  /* ---------------------------- o bloco "arrumar" ---------------------------- */

  /**
   * Sobe ou desce um passo ENTRE OS QUE APARECEM. Mover na árvore inteira
   * trocaria de lugar com uma seção de módulo desligado, invisível, e o
   * clique pareceria não ter feito nada.
   */
  function moverEntre(id: string, passo: -1 | 1, visiveis: string[]) {
    const i = visiveis.indexOf(id)
    const vizinho = visiveis[i + passo]
    if (i < 0 || !vizinho) return
    menu.soltar(id, vizinho, passo < 0 ? 'antes' : 'depois')
  }

  function itensDeMover(id: string, visiveis: string[], estrutural = true): ContextMenuItem[] {
    const t = g.t()
    const i = visiveis.indexOf(id)
    const travado = estrutural && !g.podeConfigurar()
    const dica = travado ? t.ctxSoQuemConfigura : undefined
    return [
      {
        label: t.ctxSubir,
        icon: 'i-lucide-arrow-up',
        kbds: ['alt', 'arrowup'],
        description: dica,
        disabled: travado || i <= 0,
        onSelect: () => moverEntre(id, -1, visiveis),
      },
      {
        label: t.ctxDescer,
        icon: 'i-lucide-arrow-down',
        kbds: ['alt', 'arrowdown'],
        description: dica,
        disabled: travado || i < 0 || i >= visiveis.length - 1,
        onSelect: () => moverEntre(id, 1, visiveis),
      },
    ]
  }

  /**
   * "Mover para": o Move do ClickUp. Lista as seções que a regra do ENSPACE
   * aceita (dois níveis, categoria só em Categorias) e, para quem está dentro
   * de uma seção, a volta ao primeiro nível.
   */
  function itemMoverPara(no: NoDoMenu): ContextMenuItem | null {
    const t = g.t()
    const onde = menu.localizar(menu.rascunho.value, no.id)
    const destinos: ContextMenuItem[] = menu.secoesDaBarra.value
      .filter(s => s.id !== onde?.pai?.id && menu.avaliar(no.id, s.id, 'dentro').ok)
      .map(s => ({
        label: g.rotuloDe(s),
        icon: s.icone,
        onSelect: () => {
          const r = menu.moverParaSecao(no.id, s.id)
          if (!r.ok) toast.add({ title: t.motivos[r.motivo] ?? '', icon: 'i-lucide-ban', color: 'error' })
        },
      }))

    if (onde?.pai && menu.avaliar(no.id, onde.pai.id, 'depois').ok) {
      destinos.unshift({
        label: t.ctxPrimeiroNivel,
        icon: 'i-lucide-arrow-left-to-line',
        onSelect: () => { menu.moverParaPrimeiroNivel(no.id) },
      })
    }
    if (!destinos.length) return null

    const travado = !g.podeConfigurar()
    return {
      label: t.ctxMoverPara,
      icon: 'i-lucide-folder-input',
      description: travado ? t.ctxSoQuemConfigura : undefined,
      disabled: travado,
      children: destinos,
    }
  }

  /* ----------------------------- o bloco "mexer" ----------------------------- */

  /** Só o que alguém escreveu se renomeia. Nome nativo vem do produto. */
  function renomeavel(no: NoDoMenu) {
    return !!no.rotulo && !no.chave && menu.origemDe(no) === 'workspace'
  }

  const renomeando = useRenomeando()

  function blocoMexer(no: NoDoMenu, extra: ContextMenuItem[] = []): ContextMenuItem[] {
    const t = g.t()
    const itens: ContextMenuItem[] = [...extra]
    if (renomeavel(no)) {
      itens.push({
        label: t.ctxRenomear,
        icon: 'i-lucide-pencil',
        description: g.podeConfigurar() ? undefined : t.ctxSoQuemConfigura,
        disabled: !g.podeConfigurar(),
        onSelect: () => { renomeando.value = no.id },
      })
    }
    /*
     * Ocultar vale para todo mundo, como o Hide do ClickUp: é arrumação
     * pessoal. Quem não configura só tem "Salvar só para mim" no cartão, então
     * o efeito para ele é sempre pessoal.
     */
    /*
     * Início e Categorias não se ocultam, como o Home do ClickUp ("the only
     * item that can't be edited is Home") e as seções padrão de lá, que se
     * reordenam mas não se escondem. Sem Início não há para onde voltar; sem
     * Categorias, o dado do workspace some do menu.
     */
    if (no.id === 'n-inicio' || no.tipo === 'secao-nativa') return itens
    itens.push({
      label: t.ctxOcultar,
      icon: 'i-lucide-eye-off',
      onSelect: () => {
        menu.ocultar(no.id)
        toast.add({ title: t.ocultado(g.rotuloDe(no)), description: t.ocultadoDica, icon: 'i-lucide-eye-off', color: 'neutral' })
      },
    })
    return itens
  }

  /* ------------------------------ por tipo de linha ------------------------------ */

  /**
   * Uma linha que abre uma tela: destino nativo, tela dentro de seção ou seção
   * de uma tela só. `visiveis` são os irmãos que aparecem na barra agora.
   */
  function daLinha(no: NoDoMenu, visiveis: string[], opcoes: { abrir?: () => void, lugar?: ContextMenuItem[] } = {}): Acoes {
    const abrir = opcoes.abrir ?? (() => g.abrirDestino(no.id))
    const moverPara = itemMoverPara(no)
    return [
      blocoIr(abrir, no.id),
      [...itensDeMover(no.id, visiveis), ...(moverPara ? [moverPara] : []), ...(opcoes.lugar ?? [])],
      blocoMexer(no),
    ].filter(b => b.length)
  }

  /** O cabeçalho de uma seção recolhível. */
  function daSecao(no: NoDoMenu, visiveis: string[], lugar: ContextMenuItem[] = []): Acoes {
    const t = g.t()
    const aberta = g.secaoAberta(no.id)
    const travado = !g.podeConfigurar()
    return [
      [
        {
          label: aberta ? t.ctxRecolher : t.ctxExpandir,
          icon: aberta ? 'i-lucide-chevrons-down-up' : 'i-lucide-chevrons-up-down',
          onSelect: () => g.alternarSecao(no.id),
        },
        { label: t.ctxCopiarLink, icon: 'i-lucide-link', onSelect: () => copiarLink(no.id) },
      ],
      [
        {
          label: t.ctxNovaTela,
          icon: 'i-lucide-file-plus',
          description: travado ? t.ctxSoQuemConfigura : undefined,
          disabled: travado,
          onSelect: () => g.novaTela(no.id),
        },
        ...itensDeMover(no.id, visiveis),
        ...lugar,
      ],
      blocoMexer(no),
    ]
  }

  /**
   * Uma categoria. Favoritar é o primeiro do bloco do meio porque é o que o
   * ClickUp põe primeiro, e é o gesto que esta barra mais pede. Mover só faz
   * sentido na lista de baixo: os favoritos não têm ordem própria.
   */
  function daCategoria(c: Categoria, mover?: { visiveis: number[], passo: (c: Categoria, p: -1 | 1) => void }): Acoes {
    const t = g.t()
    const meio: ContextMenuItem[] = [
      {
        label: c.favorita ? t.desafixar : t.fixar,
        icon: c.favorita ? 'i-lucide-star-off' : 'i-lucide-star',
        onSelect: () => g.alternarFixar(c.id),
      },
    ]
    if (mover) {
      const i = mover.visiveis.indexOf(c.id)
      meio.push(
        { label: t.ctxSubir, icon: 'i-lucide-arrow-up', disabled: i <= 0, onSelect: () => mover.passo(c, -1) },
        { label: t.ctxDescer, icon: 'i-lucide-arrow-down', disabled: i < 0 || i >= mover.visiveis.length - 1, onSelect: () => mover.passo(c, 1) },
      )
    }
    const travado = !g.podeConfigurar()
    return [
      blocoIr(() => g.abrirCategoria(c), `categoria-${c.id}`),
      meio,
      [{
        label: t.ctxConfigurarCategoria,
        icon: 'i-lucide-settings-2',
        description: travado ? t.ctxSoQuemConfigura : undefined,
        disabled: travado,
        onSelect: () => g.configurarCategoria(c),
      }],
    ]
  }

  /** Os itens de ordenação, que no cabeçalho de Categorias viram um submenu. */
  function itemDeOrdem(atual: string, opcoes: { label: string, icon: string, valor: string }[], escolher: (v: string) => void): ContextMenuItem {
    return {
      label: g.t().ordenarPor,
      icon: 'i-lucide-arrow-down-up',
      children: opcoes.map(o => ({
        label: o.label,
        icon: o.icon,
        type: 'checkbox' as const,
        checked: atual === o.valor,
        onSelect: (e: Event) => { e.preventDefault(); escolher(o.valor) },
      })),
    }
  }

  return { daLinha, daSecao, daCategoria, itemDeOrdem, itensDeMover, blocoMexer, copiarLink }
}

/** Qual nó está sendo renomeado agora. A janela mora no index.vue. */
export function useRenomeando() {
  return useState<string | null>('menu-renomeando', () => null)
}
