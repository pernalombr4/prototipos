/**
 * O atalho de e-mail, numa peça só para todas as telas.
 *
 * O WhatsApp voltou na rodada 10, em `useWhatsApp`: o contato do item, o
 * responsável da tarefa, o lembrete da Agenda e o link do formulário público.
 * O SMS continua fora do plano. O atalho de e-mail tem 2 caminhos:
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
import { type Contato, type Rascunho, MENSAGEM_PADRAO, linkDeEmail, linkDeWhatsApp, numeroDoWhatsApp, preencher, useComunicacao } from './estado'

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

/** O mínimo de quem recebe pelo WhatsApp: nome e telefone, qualquer um pode faltar. */
export type DestinoDoWhatsApp = Pick<Contato, 'nome' | 'telefone'>

/** Uma pessoa da fila do WhatsApp em lote (`_FilaDoWhatsApp.vue`). */
export interface PessoaDaFila {
  id: string | number
  nome: string
  telefone: string | null
  /** O texto pronto desta pessoa (com o nome dela). */
  texto: string
}

export interface OpcoesDoWhatsApp {
  item?: ItemDoProtótipo | null
  /** Texto pronto. Sem ele, o texto da categoria do item. */
  texto?: string
}

/**
 * O atalho de WhatsApp (rodada 10). O link é o da ajuda do WhatsApp ("conversa
 * em um clique"):
 *  - com número, `https://wa.me/<número>?text=<texto>` abre a conversa com ele;
 *  - sem número (o link do formulário), `https://wa.me/?text=<texto>` mostra a
 *    lista de contatos e a pessoa escolhe a conversa ou o grupo.
 * O texto chega no campo de mensagem e quem envia é a pessoa. Funciona no
 * WhatsApp Web e no app; o ENSPACE não fica sabendo do envio. No produto:
 * `window.open(link, '_blank')`. Aqui: a simulação.
 */
export function useWhatsApp() {
  const t = useTextos(textos)
  const { config, fase } = useComunicacao()
  const { abrirApp } = useAppExterno()

  /** Por que o WhatsApp não está disponível para este destino. Nulo = disponível. */
  function motivoDoWhatsApp(d: DestinoDoWhatsApp | null) {
    if (!d) return t.value.atalho.semContato
    if (!d.telefone) return t.value.whatsapp.semTelefone
    return numeroDoWhatsApp(d.telefone) ? null : t.value.whatsapp.telefoneInvalido
  }

  /** O texto pronto, com as variáveis trocadas. Fase 1: fixo. Fase 2: o da categoria do item. */
  function textoPadrao(item: ItemDoProtótipo | null | undefined, d: DestinoDoWhatsApp | null) {
    if (!item) return ''
    const modelo = fase.value >= 2 ? config.value.porCategoria[item.categoria].mensagem : MENSAGEM_PADRAO
    return preencher(modelo, item, d?.nome ?? null)
  }

  /** Abre a conversa com o destino (ou, sem destino, a escolha da conversa). */
  function abrirConversa(d: DestinoDoWhatsApp | null, o: OpcoesDoWhatsApp = {}) {
    const texto = o.texto ?? textoPadrao(o.item, d)
    abrirApp({
      tipo: 'whatsapp',
      url: linkDeWhatsApp(d?.telefone ?? null, texto || undefined),
      texto,
      nome: d?.nome ?? null,
      telefone: d?.telefone ?? null,
    })
  }

  /** O link do formulário público: sem número, a pessoa escolhe a conversa. */
  function abrirWhatsApp(texto: string) {
    abrirConversa(null, { texto })
  }

  /** A opção "WhatsApp" de um menu (linha da tabela, cartão, clique direito). */
  function itemDeMenu(d: DestinoDoWhatsApp | null, o: OpcoesDoWhatsApp = {}, rotulo?: string): DropdownMenuItem {
    const m = motivoDoWhatsApp(d)
    return {
      label: rotulo ?? t.value.whatsapp.rotulo,
      description: m ?? d?.telefone ?? undefined,
      icon: 'i-simple-icons-whatsapp',
      disabled: !!m,
      ui: { itemDescription: 'whitespace-normal' },
      onSelect: () => abrirConversa(d, o),
    }
  }

  return { motivoDoWhatsApp, textoPadrao, abrirConversa, abrirWhatsApp, itemDeMenu }
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
