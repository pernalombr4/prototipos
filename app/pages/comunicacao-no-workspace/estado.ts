/**
 * O estado do protótipo: a configuração do workspace e o que a pessoa faz nele.
 *
 * Tudo em memória (`useState`), sem rede. Recarregar a página volta ao começo.
 */
import {
  CAMPO_REQUISITANTE,
  type Email,
  type Formulario,
  type ItemDoProtótipo,
  type SlugDaCategoria,
  EU,
  categoriaPorSlug,
  emails as emailsIniciais,
  enderecoDoItem,
  formularios as formulariosIniciais,
  itemPorId,
} from './mocks'

/* ------------------------------------------------------------------ *
 * Configuração
 * ------------------------------------------------------------------ */

export type Canal = 'email' | 'whatsapp' | 'sms'
export const CANAIS: Canal[] = ['email', 'whatsapp', 'sms']

/** As telas em que os atalhos podem aparecer. Cada uma liga e desliga. */
export type Lugar = 'inicio' | 'item' | 'itens' | 'tarefas' | 'agenda' | 'formularios'
export const LUGARES: Lugar[] = ['inicio', 'item', 'itens', 'tarefas', 'agenda', 'formularios']

/** Uma pessoa de contato do item: de quais campos vêm nome, e-mail e telefone. */
export interface ContatoDaCategoria {
  id: string
  rotulo: string
  campoNome: string | null
  campoEmail: string | null
  campoTelefone: string | null
}

export interface ConfigDaCategoria {
  contatos: ContatoDaCategoria[]
  /** Assunto sugerido do e-mail. Aceita {referencia}, {titulo}, {nome}, {categoria}. */
  assunto: string
  /** Texto inicial de WhatsApp e SMS. Mesmas variáveis. */
  mensagem: string
}

export interface ConfigDeComunicacao {
  /** Módulo "Atalhos de comunicação" (Sistema › Módulos). */
  atalhos: boolean
  canais: Record<Canal, boolean>
  lugares: Record<Lugar, boolean>
  /** Preenche assunto e texto inicial. Desligado, o app abre só com o destinatário. */
  textoInicial: boolean
  /**
   * Põe a caixa do item em cópia no e-mail aberto no app da pessoa. A resposta
   * volta para a aba Mail Box sem o ENSPACE enviar nada (o "CC to pulse" do
   * monday, ver PESQUISA.md).
   */
  copiaParaOItem: boolean
  /**
   * Módulo "E-mail do ENSPACE em todas as telas". O envio é o da pasta Mail Box
   * de hoje: sai da conta do Outlook que cada pessoa integrou (Perfil ›
   * Integrações › Correio do Outlook). Não há caixa do workspace a escolher.
   */
  emailDoEnspace: boolean
  porCategoria: Record<SlugDaCategoria, ConfigDaCategoria>
}

export function configInicial(): ConfigDeComunicacao {
  return {
    atalhos: true,
    canais: { email: true, whatsapp: true, sms: true },
    lugares: { inicio: true, item: true, itens: true, tarefas: true, agenda: true, formularios: true },
    textoInicial: true,
    copiaParaOItem: true,
    emailDoEnspace: true,
    porCategoria: {
      contratos: {
        contatos: [
          { id: 'contraparte', rotulo: 'Contato da contraparte', campoNome: 'contato_nome', campoEmail: 'contato_email', campoTelefone: 'contato_telefone' },
          { id: 'requisitante', rotulo: 'Requisitante', campoNome: null, campoEmail: CAMPO_REQUISITANTE, campoTelefone: null },
        ],
        assunto: '{referencia} · {titulo}',
        mensagem: 'Olá, {nome}. Aqui é do jurídico da Aurora, sobre {titulo} ({referencia}).',
      },
      solicitacoes: {
        contatos: [
          { id: 'solicitante', rotulo: 'Quem pediu', campoNome: 'solicitante_nome', campoEmail: 'solicitante_email', campoTelefone: 'solicitante_telefone' },
        ],
        assunto: '{referencia} · {titulo}',
        mensagem: 'Olá, {nome}. Sobre a sua solicitação {referencia}.',
      },
      fornecedores: {
        contatos: [
          { id: 'comercial', rotulo: 'Contato comercial', campoNome: 'contato_nome', campoEmail: 'contato_email', campoTelefone: 'contato_whatsapp' },
        ],
        assunto: '{titulo} · Cadastro de fornecedor',
        mensagem: 'Olá, {nome}. Aqui é de Compras da Aurora.',
      },
    },
  }
}

/* ------------------------------------------------------------------ *
 * O contato resolvido de um item
 * ------------------------------------------------------------------ */

export interface Contato {
  id: string
  rotulo: string
  nome: string | null
  email: string | null
  telefone: string | null
}

function valorDoCampo(i: ItemDoProtótipo, campo: string | null): string | null {
  if (!campo) return null
  if (campo === CAMPO_REQUISITANTE) return i.request_email ?? null
  // Subcampo de Pessoa/Empresa: "pessoa_empresa.contact_email".
  const [raiz, sub] = campo.split('.') as [string, string | undefined]
  const bruto = (i.data as Record<string, unknown>)[raiz]
  const v = sub ? (bruto as Record<string, unknown> | null | undefined)?.[sub] : bruto
  return typeof v === 'string' && v.trim() ? v : null
}

export function contatosDoItem(i: ItemDoProtótipo, config: ConfigDeComunicacao): Contato[] {
  return config.porCategoria[i.categoria].contatos.map(c => ({
    id: c.id,
    rotulo: c.rotulo,
    nome: valorDoCampo(i, c.campoNome),
    email: valorDoCampo(i, c.campoEmail),
    telefone: valorDoCampo(i, c.campoTelefone),
  }))
}

/** Preenche as variáveis do texto inicial. */
export function preencher(modelo: string, i: ItemDoProtótipo | null, nome: string | null) {
  return modelo
    .replaceAll('{referencia}', i?.reference ?? '')
    .replaceAll('{titulo}', i?.titulo ?? '')
    .replaceAll('{categoria}', i ? categoriaPorSlug(i.categoria).name : '')
    .replaceAll('{nome}', nome?.split(' ')[0] ?? '')
    .replace(/\s+([,.)])/g, '$1')
    .replace(/\(\)/g, '')
    .trim()
}

/* ------------------------------------------------------------------ *
 * Os links (deep links). O ENSPACE não envia: só abre o app.
 * ------------------------------------------------------------------ */

/** Só dígitos, com 55 na frente quando o número veio sem país. */
export function soDigitos(telefone: string) {
  const d = telefone.replace(/\D/g, '')
  return d.length <= 11 ? `55${d}` : d
}

export function linkDeEmail(para: string[], assunto?: string, corpo?: string, cc?: string) {
  const q = new URLSearchParams()
  if (cc) q.set('cc', cc)
  if (assunto) q.set('subject', assunto)
  if (corpo) q.set('body', corpo)
  const query = q.toString().replace(/\+/g, '%20')
  return `mailto:${para.join(',')}${query ? `?${query}` : ''}`
}

export function linkDeWhatsapp(telefone: string | null, texto?: string) {
  const base = telefone ? `https://wa.me/${soDigitos(telefone)}` : 'https://wa.me/'
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}

export function linkDeSms(telefone: string | null, texto?: string) {
  const base = telefone ? `sms:+${soDigitos(telefone)}` : 'sms:'
  return texto ? `${base}?body=${encodeURIComponent(texto)}` : base
}

/* ------------------------------------------------------------------ *
 * Navegação e compositor
 * ------------------------------------------------------------------ */

export type Tela =
  | 'inicio'
  | 'itens'
  | 'item'
  | 'tarefas'
  | 'agenda'
  | 'requisicoes'
  | 'emails'
  | 'sistema'
  | 'categoria'

export interface Rascunho {
  de: string | null
  para: string[]
  cc: string[]
  cco: string[]
  mostrarCopia: boolean
  modelo: string | null
  assunto: string
  corpo: string
  itemId: number | null
  anexos: string[]
  /** De onde o compositor foi aberto, para o texto de ajuda. */
  origem: 'barra' | 'item' | 'tarefa' | 'inicio' | 'emails' | 'responder'
}

export function rascunhoVazio(): Rascunho {
  return { de: null, para: [], cc: [], cco: [], mostrarCopia: false, modelo: null, assunto: '', corpo: '', itemId: null, anexos: [], origem: 'barra' }
}

export type Cenario = 'normal' | 'sem-outlook' | 'falha'

export function useComunicacao() {
  const config = useState<ConfigDeComunicacao>('cnw-config', configInicial)
  const emails = useState<Email[]>('cnw-emails', () => structuredClone(emailsIniciais))
  const formularios = useState<Formulario[]>('cnw-formularios', () => structuredClone(formulariosIniciais))
  const tela = useState<Tela>('cnw-tela', () => 'inicio')
  const categoriaAtual = useState<SlugDaCategoria>('cnw-categoria', () => 'contratos')
  const itemAberto = useState<number | null>('cnw-item', () => null)
  const abaDoItem = useState<string>('cnw-aba-item', () => 'visao')
  const compositorAberto = useState<boolean>('cnw-compositor', () => false)
  const rascunho = useState<Rascunho>('cnw-rascunho', rascunhoVazio)
  const cenario = useState<Cenario>('cnw-cenario', () => 'normal')
  const destacar = useState<boolean>('cnw-destacar', () => false)
  const vistaDaCategoria = useState<'lista' | 'painel' | 'atalhos' | 'formularios'>('cnw-vista-categoria', () => 'painel')

  /**
   * A pessoa integrou o Correio do Outlook? Sem isso, a gaveta "Nova Mensagem"
   * da Mail Box mostra "Nenhuma conta integrada disponível" (código do develop,
   * 05/10/2026). O cenário "Sem Outlook integrado" do andaime mostra esse caso.
   */
  const outlookIntegrado = computed(() => cenario.value !== 'sem-outlook')

  /**
   * Remetente: a conta do Outlook da pessoa, com ou sem item. O item não muda o
   * remetente; ele entra em "Responder para" (ver `responderPara`).
   */
  function remetentePadrao() {
    return outlookIntegrado.value ? EU.email ?? null : null
  }

  /** O endereço do item vai em "Responder para": a resposta volta para a Mail Box. */
  function responderPara(itemId: number | null) {
    const i = itemPorId(itemId)
    return i ? enderecoDoItem(i) : null
  }

  function ir(t: Tela, extra?: { categoria?: SlugDaCategoria, item?: number, aba?: string, vista?: 'lista' | 'painel' | 'atalhos' | 'formularios' }) {
    if (extra?.categoria) categoriaAtual.value = extra.categoria
    if (extra?.vista) vistaDaCategoria.value = extra.vista
    if (extra?.item !== undefined) itemAberto.value = extra.item
    if (extra?.aba) abaDoItem.value = extra.aba
    tela.value = t
    if (import.meta.client) {
      window.scrollTo({ top: 0 })
      document.querySelector('main')?.scrollTo({ top: 0 })
    }
  }

  function abrirItem(id: number, aba = 'visao') {
    const i = itemPorId(id)
    if (!i) return
    ir('item', { categoria: i.categoria, item: id, aba })
  }

  /**
   * Abre o compositor. Se já há rascunho com conteúdo e o pedido traz outro
   * item, o rascunho é substituído: o pedido é sempre o mais novo.
   */
  function abrirCompositor(parcial: Partial<Rascunho> = {}) {
    const atual = rascunho.value
    const temConteudo = !!(atual.para.length || atual.assunto || atual.corpo.replace(/<[^>]+>/g, '').trim())
    // Aberto pela barra do topo sem contexto: o rascunho em andamento continua.
    if (!temConteudo || Object.keys(parcial).length) {
      const base = rascunhoVazio()
      rascunho.value = { ...base, ...parcial, de: parcial.de ?? remetentePadrao() }
    }
    compositorAberto.value = true
  }

  function descartarRascunho() {
    rascunho.value = rascunhoVazio()
    compositorAberto.value = false
  }

  return {
    config,
    emails,
    formularios,
    tela,
    categoriaAtual,
    itemAberto,
    abaDoItem,
    compositorAberto,
    rascunho,
    cenario,
    destacar,
    outlookIntegrado,
    remetentePadrao,
    responderPara,
    ir,
    abrirItem,
    abrirCompositor,
    descartarRascunho,
  }
}

/**
 * Contorno tracejado no que é proposta. A chave fica no andaime: com ela
 * ligada, quem revisa vê de uma vez o que muda na tela de hoje.
 */
export function useMarcaDeProposta() {
  const destacar = useState<boolean>('cnw-destacar', () => false)
  return computed(() => destacar.value
    ? 'outline-2 outline-dashed outline-offset-2 outline-warning rounded-md'
    : '')
}
