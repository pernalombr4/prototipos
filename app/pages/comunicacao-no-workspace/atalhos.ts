/**
 * Os atalhos de contato, numa peça só para todas as telas.
 *
 * Regra do documento: o ENSPACE só abre o app (deep link). Não envia, não
 * autentica e não se integra à conta de ninguém. No protótipo o atalho
 * também não abre o app de verdade: mostra o link que abriria, para o dev ver
 * o formato exato e para ninguém mandar mensagem para um número inventado.
 */
import { type ItemDoProtótipo, categoriaPorSlug, enderecoDoItem } from './mocks'
import { textos } from './textos'
import {
  type Canal,
  type Contato,
  type Lugar,
  type Rascunho,
  linkDeEmail,
  linkDeSms,
  linkDeWhatsapp,
  preencher,
  useComunicacao,
} from './estado'

/** O mínimo de um destinatário: nome, e-mail e telefone, qualquer um pode faltar. */
export type Destino = Pick<Contato, 'nome' | 'email' | 'telefone'>

export const ICONE_DO_CANAL: Record<Canal, string> = {
  email: 'i-lucide-mail',
  whatsapp: 'i-simple-icons-whatsapp',
  sms: 'i-lucide-message-square-text',
}

export function useAtalhos() {
  const toast = useToast()
  const t = useTextos(textos)
  const { config, abrirCompositor } = useComunicacao()

  /** Os canais que o administrador ligou para esta tela. Vazio = atalhos fora. */
  function canaisEm(lugar: Lugar): Canal[] {
    const c = config.value
    if (!c.atalhos || !c.lugares[lugar]) return []
    return (['email', 'whatsapp', 'sms'] as Canal[]).filter(k => c.canais[k])
  }

  /** Por que o canal não está disponível para esta pessoa. Nulo = disponível. */
  function motivo(canal: Canal, d: Destino | null): string | null {
    if (!d) return t.value.atalho.semContato
    if (canal === 'email') return d.email ? null : t.value.atalho.semEmail
    if (!d.telefone) return t.value.atalho.semTelefone
    // Número curto não abre conversa nenhuma (Twenty e Ploomes nem mostram o link).
    return d.telefone.replace(/\D/g, '').length < 10 ? t.value.atalho.telefoneInvalido : null
  }

  function textos_(item: ItemDoProtótipo | null | undefined, d: Destino | null) {
    if (!config.value.textoInicial || !item) return { assunto: undefined, mensagem: undefined }
    const cat = config.value.porCategoria[item.categoria]
    return {
      assunto: preencher(cat.assunto, item, d?.nome ?? null) || undefined,
      mensagem: preencher(cat.mensagem, item, d?.nome ?? null) || undefined,
    }
  }

  /** O link que o atalho abre. */
  function link(canal: Canal, d: Destino | null, opcoes: { item?: ItemDoProtótipo | null, assunto?: string, mensagem?: string, varios?: Destino[] } = {}) {
    const padrao = textos_(opcoes.item, d)
    const assunto = opcoes.assunto ?? padrao.assunto
    const mensagem = opcoes.mensagem ?? padrao.mensagem
    if (canal === 'email') {
      const para = (opcoes.varios ?? (d ? [d] : [])).map(x => x.email).filter(Boolean) as string[]
      const i = opcoes.item
      const cc = i && config.value.copiaParaOItem && categoriaPorSlug(i.categoria).temMailBox ? enderecoDoItem(i) : undefined
      return linkDeEmail(para, assunto, opcoes.mensagem, cc)
    }
    if (canal === 'whatsapp') return linkDeWhatsapp(d?.telefone ?? null, mensagem)
    return linkDeSms(d?.telefone ?? null, mensagem)
  }

  /** O clique no atalho. No produto: `window.open(link)`. Aqui: o aviso com o link. */
  function abrir(canal: Canal, d: Destino | null, opcoes: Parameters<typeof link>[2] = {}) {
    const url = link(canal, d, opcoes)
    toast.add({
      title: t.value.atalho.abrindo[canal],
      description: url,
      icon: ICONE_DO_CANAL[canal],
      color: 'neutral',
      duration: 6000,
      ui: { description: 'font-mono text-xs break-all' },
    })
  }

  /** E-mail pelo ENSPACE, com o item já vinculado quando há item. */
  function escreverNoEnspace(d: Destino | null, item: ItemDoProtótipo | null | undefined, origem: Rascunho['origem'], extra: Partial<Rascunho> = {}) {
    const padrao = textos_(item, d)
    abrirCompositor({
      itemId: item?.id ?? null,
      para: d?.email ? [d.email] : [],
      assunto: padrao.assunto ?? '',
      origem,
      ...extra,
    })
  }

  /** O e-mail aberto no app leva a caixa do item em cópia? */
  function vaiComCopia(item: ItemDoProtótipo | null | undefined) {
    return !!item && config.value.copiaParaOItem && categoriaPorSlug(item.categoria).temMailBox
  }

  return { canaisEm, motivo, link, abrir, escreverNoEnspace, vaiComCopia, config }
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
