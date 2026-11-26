/**
 * O estado do protótipo: a configuração do workspace e o que a pessoa faz nele.
 *
 * Tudo em memória (`useState`), sem rede. Recarregar a página volta ao começo.
 *
 * As 3 fases (rodada 6) ficam no andaime. Cada fase soma à anterior:
 *  - Fase 1 (MVP): só o que o código de hoje já sustenta, sem back-end novo. O
 *    e-mail sai da conta do Outlook da pessoa e só fica no ENSPACE quando vai
 *    com item; o contato do item vem dos campos de e-mail que ele já tem.
 *  - Fase 2: escolher o "De" (Outlook pessoal ou caixa do workspace), responder
 *    na mesma conversa, encaminhar e guardar o e-mail sem item; mais o que pede
 *    back-end: o contato por categoria, a busca de item entre categorias e a
 *    área E-mails (a lista por pessoa e permissão).
 *  - Fase 3: vincular o e-mail a uma tarefa e a Mail Box da própria tarefa.
 *  - Fase 4 (rodada 14): o destino. A central vira "Comunicações" e guarda o
 *    e-mail, o SMS e o WhatsApp que o ENSPACE envia, com o status de entrega da
 *    SendGrid e da Twilio; o Spaceflow ganha os nós Enviar SMS e Enviar WhatsApp.
 */
import type { Ref } from 'vue'
import {
  CAMPO_REQUISITANTE,
  MASCARA_CEL,
  type CaixaDeEmail,
  type Email,
  type Formulario,
  type ItemDoProtótipo,
  type SlugDaCategoria,
  EU,
  caixas,
  campos,
  categoriaPorSlug,
  emails as emailsIniciais,
  enderecoDoItem,
  formularios as formulariosIniciais,
  itemPorId,
  modelos,
  tarefas,
} from './mocks'

/* ------------------------------------------------------------------ *
 * Fase
 * ------------------------------------------------------------------ */

export type Fase = 1 | 2 | 3 | 4
export const FASES: Fase[] = [1, 2, 3, 4]

/** Espelho da fase do andaime para as funções puras (contatosDoItem). Reativo: é o próprio `useState`. */
let faseAtual: Ref<Fase> | null = null

/* ------------------------------------------------------------------ *
 * Configuração
 * ------------------------------------------------------------------ */

/**
 * Uma pessoa de contato do item: de quais campos vêm o nome, o e-mail e o
 * telefone (o telefone abre o WhatsApp, de volta na rodada 10).
 * A avaliar com os devs: a configuração mora na categoria, numa chave nova do
 * JSON `modules` que o modelo da categoria já tem.
 */
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
  /** Texto pronto do WhatsApp. Aceita as mesmas variáveis do assunto. */
  mensagem: string
}

/** O texto pronto do WhatsApp de cada categoria até alguém salvar outro no cartão "Contato da categoria". */
export const MENSAGEM_PADRAO = 'Olá, {nome}. Escrevo sobre {referencia} · {titulo}.'

/**
 * Sem chave de módulo (rodada 7): o e-mail vem sempre ligado, como nos CRMs e
 * help desks pesquisados (PESQUISA-MODULOS-E-EMAIL.md). O atalho só aparece
 * onde há endereço de e-mail, e o envio pede a conta do Outlook integrada.
 */
export interface ConfigDeComunicacao {
  porCategoria: Record<SlugDaCategoria, ConfigDaCategoria>
}

export function configInicial(): ConfigDeComunicacao {
  return {
    porCategoria: {
      contratos: {
        contatos: [
          { id: 'contraparte', rotulo: 'Contato da contraparte', campoNome: 'contato_nome', campoEmail: 'contato_email', campoTelefone: 'contato_telefone' },
          { id: 'requisitante', rotulo: 'Requisitante', campoNome: null, campoEmail: CAMPO_REQUISITANTE, campoTelefone: null },
        ],
        assunto: '{referencia} · {titulo}',
        mensagem: MENSAGEM_PADRAO,
      },
      solicitacoes: {
        contatos: [
          { id: 'solicitante', rotulo: 'Quem pediu', campoNome: 'solicitante_nome', campoEmail: 'solicitante_email', campoTelefone: 'solicitante_telefone' },
        ],
        assunto: '{referencia} · {titulo}',
        mensagem: MENSAGEM_PADRAO,
      },
      fornecedores: {
        contatos: [
          { id: 'comercial', rotulo: 'Contato comercial', campoNome: 'pessoa_empresa.contact_name', campoEmail: 'pessoa_empresa.contact_email', campoTelefone: 'pessoa_empresa.contact_phone' },
        ],
        assunto: '{titulo} · Cadastro de fornecedor',
        mensagem: 'Olá, {nome}. Escrevo sobre o cadastro de {titulo} como fornecedor.',
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

export function valorDoCampo(i: ItemDoProtótipo, campo: string | null): string | null {
  if (!campo) return null
  if (campo === CAMPO_REQUISITANTE) return i.request_email ?? null
  // Subcampo de Pessoa/Empresa: "pessoa_empresa.contact_email".
  const [raiz, sub] = campo.split('.') as [string, string | undefined]
  const bruto = (i.data as Record<string, unknown>)[raiz]
  const v = sub ? (bruto as Record<string, unknown> | null | undefined)?.[sub] : bruto
  return typeof v === 'string' && v.trim() ? v : null
}

/** O nome que o develop dá ao e-mail de quem abriu a requisição. */
const ROTULO_REQUISITANTE = 'Requisitante'

export function contatosDoItem(i: ItemDoProtótipo, config: ConfigDeComunicacao): Contato[] {
  // Fase 1: sem configuração nova. O contato é cada campo de e-mail que o item
  // já tem, cada Texto com máscara CEL (telefone), o Pessoa/Empresa (nome,
  // e-mail e telefone de contato) e o e-mail de quem pediu.
  if ((faseAtual?.value ?? 1) < 2) {
    const lista: Contato[] = []
    for (const c of campos.filter(x => x.categoria === i.categoria)) {
      if (c.type === 'email') {
        const email = valorDoCampo(i, c.refId)
        if (email) lista.push({ id: c.refId, rotulo: c.name, nome: null, email, telefone: null })
      }
      if (c.type === 'EnlMask' && c.mascara === MASCARA_CEL) {
        const telefone = valorDoCampo(i, c.refId)
        if (telefone) lista.push({ id: c.refId, rotulo: c.name, nome: null, email: null, telefone })
      }
      if (c.type === 'EnPerson') {
        const email = valorDoCampo(i, `${c.refId}.contact_email`)
        const telefone = valorDoCampo(i, `${c.refId}.contact_phone`)
        if (email || telefone) lista.push({ id: c.refId, rotulo: c.name, nome: valorDoCampo(i, `${c.refId}.contact_name`), email, telefone })
      }
    }
    if (i.request_email) lista.push({ id: CAMPO_REQUISITANTE, rotulo: ROTULO_REQUISITANTE, nome: null, email: i.request_email, telefone: null })
    return lista
  }
  return config.porCategoria[i.categoria].contatos.map(c => ({
    id: c.id,
    rotulo: c.rotulo,
    nome: valorDoCampo(i, c.campoNome),
    email: valorDoCampo(i, c.campoEmail),
    telefone: valorDoCampo(i, c.campoTelefone),
  }))
}

/** Preenche as variáveis do assunto. */
export function preencher(modelo: string, i: ItemDoProtótipo | null, nome: string | null) {
  return modelo
    .replaceAll('{referencia}', i?.reference ?? '')
    .replaceAll('{titulo}', i?.titulo ?? '')
    .replaceAll('{categoria}', i ? categoriaPorSlug(i.categoria).name : '')
    .replaceAll('{nome}', nome?.split(' ')[0] ?? '')
    .replace(/\s+([,.)])/g, '$1')
    // Sem nome: "Olá, ." vira "Olá."
    .replace(/,\./g, '.')
    .replace(/\(\)/g, '')
    .trim()
    // Sem item: "{referencia} · Assunto" não começa nem termina no separador.
    .replace(/^·\s*|\s*·$/g, '')
}

/**
 * O número que vai no `wa.me`: só dígitos, sem os zeros da frente (a máscara
 * CEL grava o DDD com 3 dígitos, "(011)"), com 55 quando vier sem país (10 ou
 * 11 dígitos). Menos de 10 dígitos não abre conversa: nulo.
 */
export function numeroDoWhatsApp(telefone: string | null | undefined) {
  if (!telefone) return null
  const d = telefone.replace(/\D/g, '').replace(/^0+/, '')
  if (d.length < 10) return null
  return d.length <= 11 ? `55${d}` : d
}

/**
 * O link do WhatsApp (ajuda do WhatsApp, "conversa em um clique"): com número,
 * abre a conversa com ele; sem número, a pessoa escolhe a conversa. O texto
 * chega no campo de mensagem, e quem envia é a pessoa.
 */
export function linkDeWhatsApp(telefone: string | null, texto?: string) {
  const n = numeroDoWhatsApp(telefone)
  const base = n ? `https://wa.me/${n}` : 'https://wa.me/'
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}

/**
 * O link de SMS (RFC 5724): `sms:+<número>?body=<texto>`. Com número, abre a
 * conversa com ele; sem número (link do formulário), a pessoa escolhe para
 * quem. O número é o mesmo do WhatsApp, com o `+` do formato E.164. No celular
 * e no Mac abre o app de mensagens; no Windows, só se houver app registrado
 * para `sms:` (o Vincular ao Celular nem sempre assume). Daí os outros caminhos
 * do painel: QR code, copiar e o Google Messages Web.
 */
export function linkDeSms(telefone: string | null, texto?: string) {
  const n = numeroDoWhatsApp(telefone)
  const base = n ? `sms:+${n}` : 'sms:'
  return texto ? `${base}?body=${encodeURIComponent(texto)}` : base
}

/**
 * Telefone fixo do Brasil: DDD e 8 dígitos (o celular tem 9 e começa com 9).
 * Fixo não recebe SMS; o WhatsApp pode existir no fixo (WhatsApp Business), então
 * a regra vale só para o SMS. Número de fora do Brasil não é julgado.
 */
export function ehTelefoneFixo(telefone: string | null | undefined) {
  const n = numeroDoWhatsApp(telefone)
  return !!n && n.startsWith('55') && n.length === 12
}

/** O número para ler e copiar: +55 11 98765-4321. */
export function telefoneLegivel(telefone: string | null | undefined) {
  const n = numeroDoWhatsApp(telefone)
  if (!n) return telefone ?? ''
  if (!n.startsWith('55')) return `+${n}`
  const d = n.slice(2)
  const ddd = d.slice(0, 2)
  const resto = d.slice(2)
  const corte = resto.length - 4
  return `+55 ${ddd} ${resto.slice(0, corte)}-${resto.slice(corte)}`
}

/**
 * Quantos SMS o texto ocupa. Só com os caracteres do alfabeto GSM 7 bits, cabem
 * 160 por SMS (153 por parte quando divide). Com 1 acento fora dele (ã, õ, ç, á,
 * ê...), o SMS inteiro passa a UCS-2: 70 por SMS, 67 por parte.
 */
const GSM7 = '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà'
const GSM7_DUPLO = '^{}\\[~]|€'
export function partesDoSms(texto: string) {
  const chars = [...texto]
  const gsm = chars.every(c => GSM7.includes(c) || GSM7_DUPLO.includes(c))
  const tamanho = gsm ? chars.reduce((s, c) => s + (GSM7_DUPLO.includes(c) ? 2 : 1), 0) : chars.length
  const [um, parte] = gsm ? [160, 153] : [70, 67]
  const partes = tamanho === 0 ? 0 : tamanho <= um ? 1 : Math.ceil(tamanho / parte)
  return { tamanho, partes, limite: um, gsm }
}

/** O `mailto:` que o "Abrir no meu app de e-mail" abre. */
export function linkDeEmail(para: string[], assunto?: string, corpo?: string, cc?: string) {
  const q = new URLSearchParams()
  if (cc) q.set('cc', cc)
  if (assunto) q.set('subject', assunto)
  if (corpo) q.set('body', corpo)
  const query = q.toString().replace(/\+/g, '%20')
  return `mailto:${para.join(',')}${query ? `?${query}` : ''}`
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
  /** Fase 4: o editor do Spaceflow com os nós de mensagem. */
  | 'spaceflow'

export interface Rascunho {
  /** O endereço de onde o e-mail sai: a conta do Outlook ou, na Fase 2, uma caixa. */
  de: string | null
  para: string[]
  cc: string[]
  cco: string[]
  mostrarCopia: boolean
  modelo: string | null
  assunto: string
  corpo: string
  itemId: number | null
  /** Fase 3: a tarefa vinculada. */
  tarefaId: number | null
  anexos: string[]
  /** De onde o compositor foi aberto, para o texto de ajuda. */
  origem: 'barra' | 'item' | 'tarefa' | 'inicio' | 'emails' | 'responder' | 'encaminhar'
}

export function rascunhoVazio(): Rascunho {
  return { de: null, para: [], cc: [], cco: [], mostrarCopia: false, modelo: null, assunto: '', corpo: '', itemId: null, tarefaId: null, anexos: [], origem: 'barra' }
}

export type Cenario = 'normal' | 'sem-outlook' | 'falha'

/**
 * O estado dos dados de e-mail (andaime, rodada 8):
 *  - novo: o workspace acabou de nascer. Nada configurado (sem modelo, sem
 *    caixa, sem a conta do Outlook) e nada enviado;
 *  - primeiroUso: tudo configurado, nenhum e-mail ainda;
 *  - emUso: o protótipo de sempre, com dados.
 */
export type Dados = 'novo' | 'primeiroUso' | 'emUso'

/** Os filtros rápidos da aba Mensagens. Ficam no estado para o menu Configurações › E-mails › E-mails Enviados abrir já filtrado. */
export type Rapido = 'recebidos' | 'enviados' | 'sistema' | 'naoLidos' | 'comAnexo' | 'semItem'
  /* Fase 4: por canal e pela entrega. */
  | 'email' | 'whatsapp' | 'sms' | 'naoEntregues'

/**
 * Quem olha o protótipo (andaime). Cada aba da central segue a permissão que já
 * existe no develop: `settings::emails::templates` e `::boxes`, hoje de quem
 * administra. Mensagens é para todo membro; as linhas dos e-mails enviados pelo
 * sistema (`settings::emails::sent`) só aparecem para quem tem essa permissão.
 */
export type Perfil = 'admin' | 'membro'

/** As abas da central "E-mails". */
export type AbaDaCentral = 'mensagens' | 'modelos' | 'caixas' | 'configuracoes'
/** Rodada 16: as 3 formam a página de Configurações › E-mails (Comunicações, na Fase 4), só para quem administra. */
export const ABAS_DE_ADMIN: AbaDaCentral[] = ['modelos', 'caixas', 'configuracoes']

/** Uma opção do "De". */
export interface Remetente {
  email: string
  tipo: 'outlook' | 'caixa'
  caixa?: CaixaDeEmail
}

export function useComunicacao() {
  const config = useState<ConfigDeComunicacao>('cnw-config', configInicial)
  const fase = useState<Fase>('cnw-fase', () => 1)
  faseAtual = fase
  const emails = useState<Email[]>('cnw-emails', () => structuredClone(emailsIniciais))
  const formularios = useState<Formulario[]>('cnw-formularios', () => structuredClone(formulariosIniciais))
  const tela = useState<Tela>('cnw-tela', () => 'inicio')
  const categoriaAtual = useState<SlugDaCategoria>('cnw-categoria', () => 'contratos')
  const itemAberto = useState<number | null>('cnw-item', () => null)
  const abaDoItem = useState<string>('cnw-aba-item', () => 'visao')
  /** A tarefa aberta no painel de Tarefas: o "Novo e-mail" do topo vincula ao item dela. */
  const tarefaAberta = useState<number | null>('cnw-tarefa-aberta', () => null)
  const compositorAberto = useState<boolean>('cnw-compositor', () => false)
  const rascunho = useState<Rascunho>('cnw-rascunho', rascunhoVazio)
  const cenario = useState<Cenario>('cnw-cenario', () => 'normal')
  const destacar = useState<boolean>('cnw-destacar', () => false)
  const vistaDaCategoria = useState<'lista' | 'painel' | 'atalhos' | 'formularios'>('cnw-vista-categoria', () => 'painel')
  const perfil = useState<Perfil>('cnw-perfil', () => 'admin')
  const abaDaCentral = useState<AbaDaCentral>('cnw-aba-central', () => 'mensagens')
  const ehAdmin = computed(() => perfil.value === 'admin')
  const rapidosDaCentral = useState<Rapido[]>('cnw-rapidos', () => [])
  const dados = useState<Dados>('cnw-dados', () => 'emUso')
  /** Fase 4: o workspace tem a integração Twilio (andaime "Sem Twilio" desliga). */
  const twilioLigado = useState<boolean>('cnw-twilio', () => true)
  /** Workspace novo: sem modelo e sem caixa. */
  const modelosDoWorkspace = computed(() => dados.value === 'novo' ? [] : modelos)
  const caixasDoWorkspace = computed(() => dados.value === 'novo' ? [] : caixas)
  /** Fase 2: as caixas que aparecem no "De" (central › Configurações). */
  const caixasNoDe = useState<Record<string, boolean>>('cnw-caixas-no-de', () => Object.fromEntries(caixas.map(c => [c.id, true])))

  /**
   * A pessoa integrou o Correio do Outlook? Sem isso, a gaveta "Nova Mensagem"
   * da Mail Box mostra "Nenhuma conta integrada" (código do develop, lido em
   * 17/11/2026). O cenário "Sem Outlook integrado" do andaime mostra esse caso.
   */
  const outlookIntegrado = computed(() => cenario.value !== 'sem-outlook' && dados.value !== 'novo')

  /**
   * As opções do "De". Fase 1: só a conta do Outlook (o envio de hoje não
   * aceita remetente). Fase 2: também as caixas do workspace.
   */
  const remetentes = computed<Remetente[]>(() => [
    ...(outlookIntegrado.value && EU.email ? [{ email: EU.email, tipo: 'outlook' as const }] : []),
    ...(fase.value >= 2 ? caixasDoWorkspace.value.filter(c => caixasNoDe.value[c.id] !== false).map(c => ({ email: c.email, tipo: 'caixa' as const, caixa: c })) : []),
  ])

  /** Há por onde enviar pelo ENSPACE? Sem nada, o botão E-mail abre o app da pessoa. */
  const podeEnviar = computed(() => remetentes.value.length > 0)

  function remetentePadrao() {
    return remetentes.value[0]?.email ?? null
  }

  /** O endereço do item vai em "Responder para": a resposta volta para a Mail Box. */
  function responderPara(itemId: number | null) {
    const i = itemPorId(itemId)
    return i ? enderecoDoItem(i) : null
  }

  /** O e-mail existe no ENSPACE nesta fase? Fase 1: só com item. */
  function registrado(e: Email) {
    if ((e.desdeFase ?? 1) > fase.value) return false
    return fase.value >= 2 || e.itemId !== null
  }

  // Fase 1 sem o que pede back-end: quem estava no contato da categoria sai dali.
  // Membro não vê as abas de quem administra nem as Configurações do workspace.
  if (import.meta.client) {
    watch(fase, (f) => {
      if (f < 2 && vistaDaCategoria.value === 'atalhos') vistaDaCategoria.value = 'painel'
    })
    watch(perfil, (p) => {
      if (p === 'admin') return
      if (ABAS_DE_ADMIN.includes(abaDaCentral.value)) abaDaCentral.value = 'mensagens'
      if (tela.value === 'sistema' || tela.value === 'categoria') tela.value = 'inicio'
      rapidosDaCentral.value = rapidosDaCentral.value.filter(r => r !== 'sistema')
    })
    // Workspace novo e primeiro uso: nenhum e-mail. Em uso: os dados de exemplo.
    watch(dados, (d) => {
      emails.value = d === 'emUso' ? structuredClone(emailsIniciais) : []
      rapidosDaCentral.value = []
    })
    // Fora da Fase 4, os filtros por canal e a tela do Spaceflow não existem.
    watch(fase, (f) => {
      if (f >= 4) return
      rapidosDaCentral.value = rapidosDaCentral.value.filter(r => !['email', 'whatsapp', 'sms', 'naoEntregues'].includes(r))
      if (tela.value === 'spaceflow') tela.value = 'inicio'
    })
  }

  function ir(t: Tela, extra?: { categoria?: SlugDaCategoria, item?: number, aba?: string, vista?: 'lista' | 'painel' | 'atalhos' | 'formularios', central?: AbaDaCentral, rapido?: Rapido }) {
    if (extra?.central) abaDaCentral.value = extra.central
    if (extra?.central === 'mensagens') rapidosDaCentral.value = extra.rapido ? [extra.rapido] : []
    if (extra?.categoria) categoriaAtual.value = extra.categoria
    if (extra?.vista) vistaDaCategoria.value = extra.vista
    if (extra?.item !== undefined) itemAberto.value = extra.item
    if (extra?.aba) abaDoItem.value = extra.aba
    if (t !== 'tarefas') tarefaAberta.value = null
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
   * contexto, o rascunho é substituído: o pedido é sempre o mais novo.
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

  /**
   * O "Novo e-mail" do topo reconhece a tela: no item, vincula o item e põe o
   * primeiro contato em Para; com uma tarefa aberta, vincula o item da tarefa
   * (e a tarefa, na Fase 3). Nas outras telas, abre sem vínculo.
   */
  function contextoDaTela(): Partial<Rascunho> | null {
    if (tela.value === 'item' && itemAberto.value) {
      const i = itemPorId(itemAberto.value)
      if (!i) return null
      const c = contatosDoItem(i, config.value).find(x => x.email)
      return { itemId: i.id, para: c?.email ? [c.email] : [], origem: 'item' }
    }
    if (tela.value === 'tarefas' && tarefaAberta.value) {
      const x = tarefas.find(t => t.id === tarefaAberta.value)
      if (!x) return null
      const id = x.item ?? null
      const deFase3 = fase.value >= 3 ? { tarefaId: x.id } : {}
      if (id === null && !Object.keys(deFase3).length) return null
      return { itemId: id, origem: 'tarefa', ...deFase3 }
    }
    return null
  }

  function novoEmailNoContexto() {
    const ctx = contextoDaTela()
    abrirCompositor(ctx ?? {})
  }

  function descartarRascunho() {
    compositorAberto.value = false
    // Limpa depois que o painel termina de fechar, para o formulário não piscar vazio na saída.
    setTimeout(() => { if (!compositorAberto.value) rascunho.value = rascunhoVazio() }, 300)
  }

  return {
    config,
    fase,
    emails,
    formularios,
    tela,
    categoriaAtual,
    itemAberto,
    abaDoItem,
    tarefaAberta,
    compositorAberto,
    rascunho,
    cenario,
    destacar,
    perfil,
    ehAdmin,
    abaDaCentral,
    rapidosDaCentral,
    dados,
    twilioLigado,
    modelosDoWorkspace,
    caixasDoWorkspace,
    caixasNoDe,
    outlookIntegrado,
    remetentes,
    podeEnviar,
    remetentePadrao,
    responderPara,
    registrado,
    ir,
    abrirItem,
    abrirCompositor,
    contextoDaTela,
    novoEmailNoContexto,
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

/**
 * O EnKanbanBoard 0.21 pôs no cartão um menu de clique direito próprio, que segura o evento: o
 * `context-mouse` não chega mais ao protótipo. Este clique direito roda antes do cartão (na fase
 * de captura), acha o dado pelo texto do cartão e reabre o evento no contêiner de fora, que é o
 * gatilho do menu do protótipo. Cartão que `achar` não reconhece segue para o menu do SDK.
 */
export function cliqueDireitoNoCartao<T>(ev: MouseEvent, achar: (textoDoCartao: string) => T | undefined, abrir: (dado: T) => void) {
  const cartao = (ev.target as HTMLElement | null)?.closest('[draggable="true"]')
  const dado = cartao ? achar(cartao.textContent ?? '') : undefined
  if (dado === undefined) return
  ev.stopPropagation()
  ev.preventDefault()
  abrir(dado)
  const gatilho = (ev.currentTarget as HTMLElement).parentElement
  gatilho?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: ev.clientX, clientY: ev.clientY }))
}
