/**
 * O atalho de e-mail, numa peça só para todas as telas.
 *
 * Só e-mail: WhatsApp e SMS saíram do plano (rodada 6). O atalho tem 2
 * caminhos:
 *  - escrever pelo ENSPACE: o compositor, com o item já vinculado. Sai da conta
 *    do Outlook da pessoa (Fase 1) ou também de uma caixa do workspace (Fase 2);
 *  - abrir o app de e-mail da pessoa (`mailto:`), com o endereço do item em
 *    cópia, para a resposta voltar à Mail Box.
 * No protótipo, o `mailto:` abre a simulação do app (`_AppExterno.vue`), com o
 * link exato no topo.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import { type ItemDoProtótipo, enderecoDoItem } from './mocks'
import { useAppExterno } from './simulador'
import { textos } from './textos'
import { type Contato, type Rascunho, linkDeEmail, preencher, useComunicacao } from './estado'

/** O mínimo de um destinatário: nome e e-mail, qualquer um pode faltar. */
export type Destino = Pick<Contato, 'nome' | 'email'>

export interface OpcoesDoEmail {
  item?: ItemDoProtótipo | null
  assunto?: string
  /** Texto do corpo, sem HTML. */
  corpo?: string
  /** Vários destinatários (lote de tarefas, lembrete da Agenda). */
  varios?: Destino[]
  /** Sem destinatário: a pessoa escolhe para quem no compositor ou no app (link de formulário). */
  semDestinatario?: boolean
}

export function useAtalhos() {
  const t = useTextos(textos)
  const { config, podeEnviar, abrirCompositor } = useComunicacao()
  const { abrirApp } = useAppExterno()

  /** Sempre ligados (rodada 7): sem chave de módulo; o atalho só aparece onde há e-mail. */
  const ativos = computed(() => true)

  /** Por que o e-mail não está disponível para este destino. Nulo = disponível. */
  function motivo(d: Destino | null) {
    if (!d) return t.value.atalho.semContato
    return d.email ? null : t.value.atalho.semEmail
  }

  function assuntoPadrao(item: ItemDoProtótipo | null | undefined, d: Destino | null) {
    if (!item) return undefined
    return preencher(config.value.porCategoria[item.categoria].assunto, item, d?.nome ?? null) || undefined
  }

  function para(d: Destino | null, o: OpcoesDoEmail) {
    return (o.varios ?? (d ? [d] : [])).map(x => x.email).filter(Boolean) as string[]
  }

  /** O `mailto:` do atalho. Com item, o endereço dele vai em cópia. */
  function link(d: Destino | null, o: OpcoesDoEmail = {}) {
    return linkDeEmail(para(d, o), o.assunto ?? assuntoPadrao(o.item, d), o.corpo, o.item ? enderecoDoItem(o.item) : undefined)
  }

  /** "Abrir no meu app de e-mail". No produto: `window.open(link)`. Aqui: a simulação. */
  function abrirNoApp(d: Destino | null, o: OpcoesDoEmail = {}) {
    abrirApp({
      tipo: 'email',
      url: link(d, o),
      para: para(d, o),
      cc: o.item ? [enderecoDoItem(o.item)] : [],
      assunto: o.assunto ?? assuntoPadrao(o.item, d) ?? '',
      corpo: o.corpo ?? '',
    })
  }

  /** "Escrever pelo ENSPACE": o compositor, com o item já vinculado quando há item. */
  function escreverNoEnspace(d: Destino | null, o: OpcoesDoEmail & { origem: Rascunho['origem'], tarefaId?: number | null } = { origem: 'barra' }) {
    abrirCompositor({
      itemId: o.item?.id ?? null,
      tarefaId: o.tarefaId ?? null,
      para: para(d, o),
      assunto: o.assunto ?? assuntoPadrao(o.item, d) ?? '',
      corpo: o.corpo ? `<p>${o.corpo}</p>` : '',
      origem: o.origem,
    })
  }

  /**
   * As 2 opções num menu (linha da tabela, cartão do quadro, tarefa). Sem por
   * onde enviar pelo ENSPACE (Fase 1 sem Outlook integrado), sobra o app.
   */
  function itensDeMenu(d: Destino | null, o: OpcoesDoEmail & { origem: Rascunho['origem'], tarefaId?: number | null }): DropdownMenuItem[] {
    const m = o.semDestinatario ? null : o.varios ? (para(d, o).length ? null : t.value.atalho.semEmail) : motivo(d)
    const lista: DropdownMenuItem[] = []
    if (podeEnviar.value) {
      lista.push({
        label: t.value.atalho.escreverNoEnspace,
        description: m ?? (o.item ? t.value.atalho.escreverNoEnspaceComItem(o.item.reference) : undefined),
        icon: 'i-lucide-send',
        disabled: !!m,
        ui: { itemDescription: 'whitespace-normal' },
        onSelect: () => escreverNoEnspace(d, o),
      })
    }
    lista.push({
      label: t.value.atalho.abrirNoApp,
      description: m ?? (o.item ? t.value.atalho.abrirNoAppComCopia : t.value.atalho.abrirNoAppDica),
      icon: 'i-lucide-external-link',
      disabled: !!m,
      ui: { itemDescription: 'whitespace-normal' },
      onSelect: () => abrirNoApp(d, o),
    })
    return lista
  }

  return { ativos, motivo, link, abrirNoApp, escreverNoEnspace, itensDeMenu, assuntoPadrao, config }
}

/**
 * Copiar um link. Uma confirmação só, igual em toda tela: o botão vira
 * "Copiado" por 2 s e o aviso diz o quê. Hoje o develop tem 2 textos para a
 * mesma coisa ("Copiado!" e "Link copiado para a sua área de transferência.").
 */
export function useCopiar() {
  const toast = useToast()
  const t = useTextos(textos)
  const copiado = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copiar(id: string, texto: string, oQue?: string) {
    try {
      await navigator.clipboard.writeText(texto)
    }
    catch {
      // Sem permissão de área de transferência: o aviso continua valendo no protótipo.
    }
    copiado.value = id
    clearTimeout(timer)
    timer = setTimeout(() => (copiado.value = null), 2000)
    toast.add({ title: t.value.form.linkCopiado, description: oQue, icon: 'i-lucide-check', color: 'success', duration: 2500 })
  }

  return { copiar, copiado }
}
