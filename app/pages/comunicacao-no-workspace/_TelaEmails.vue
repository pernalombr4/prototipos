<script setup lang="ts">
/**
 * PROPOSTA. A central "E-mails", na seção Membro do menu (rodada 7: hipótese A
 * da pesquisa de mercado, aprovada pela redatora em 24/11/2026). O e-mail vem
 * sempre ligado e tudo fica aqui, em abas que seguem a permissão de hoje:
 * Mensagens (todo perfil), Modelos e Caixas de E-mail (quem administra) e
 * Configurações (a conta de cada um; o resto, quem administra).
 * Configurações › E-mails passa a abrir estas abas.
 *
 * Rodada 8: os e-mails enviados pelo sistema (tarefa ou fluxo, a tela E-mails
 * Enviados de hoje) entram em Mensagens, com o filtro rápido "Do sistema", a
 * coluna Status e "Reenviar e-mail". Só quem tem a permissão de ver os
 * enviados vê essas linhas. A tabela é o `_TabelaDoEnspace.vue`, cópia da
 * tabela do develop. Sem nenhum e-mail, a tabela mostra o próximo passo
 * (workspace novo ou primeiro uso, no controle Dados do andaime).
 *
 * A aba Mensagens:
 *
 * Parte do que já existe escondido: a tela nativa "Emails Recebidos"
 * (`/itemEmails`), que hoje só se acha no editor de menus (pesquisa de UX,
 * S2-F1), com os e-mails que chegaram na Mail Box dos itens.
 *
 * Refeita no padrão das telas novas do develop (Logs de Auditoria, Itens,
 * Relatórios), lido no código em 17/11/2026:
 *  - barra (`TablesPartsDataToolbar`): busca, período, "Limpar filtros", Colunas
 *    e o botão que mostra a linha de filtros rápidos;
 *  - tabela (`EntityRendererManyTable`): as mesmas classes, cabeçalho fixo,
 *    ordenação e funil em cada coluna (`useTableHeaders` e os filtros
 *    `EntitySharedFilters*`, em `_FiltroDeColuna.vue`);
 *  - linha: o clique abre a gaveta à direita; a coluna Ações vem primeiro
 *    (menu ⋮), e o clique direito traz o mesmo menu;
 *  - paginador (`EntityRendererPaginator`).
 * O `EnTable` do SDK não tem slot de cabeçalho; por isso a tabela é o `UTable`
 * com as classes do develop, como em meus-relatorios.
 *
 * Fase 1: Recebidos e Enviados com item (os que o ENSPACE já grava).
 * Fase 2: também os enviados sem item, com "Vincular a um item", e Encaminhar.
 * Fase 3: a coluna Tarefa.
 *
 * Rodada 14, em todas as fases (o registro do envio já tem o dado, só a tela não mostra):
 *  - a coluna "Saiu por": Outlook de <pessoa>, caixa, ENSPACE ou domínio da empresa;
 *  - os 5 status do envio do sistema, com "Enviado ao provedor" e a dica de que a entrega
 *    não é confirmada;
 *  - o motivo da falha na dica do status e na gaveta;
 *  - a origem (Tarefa, Spaceflow, Atendimento) em "Enviado por";
 *  - "Reenviar" também no Cancelado e indisponível no Na fila e no Em processamento.
 * Fase 4 (o destino): a central vira "Comunicações", com e-mail, SMS e WhatsApp enviados pelo
 * sistema, a coluna Canal, a coluna Entrega (SendGrid e Twilio), os filtros por canal e "Não
 * entregues", o histórico do envio na gaveta e "Nova mensagem" com SMS pelo número do workspace.
 */
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import { EU, type Email, agora as agoraDoPrototipo, caixas, itemPorId, itens, membroPorId, tarefas } from './mocks'
import { type AbaDaCentral, ABAS_DE_ADMIN, type Rapido, contatosDoItem, partesDoSms, useComunicacao, useMarcaDeProposta } from './estado'
import { useAppExterno } from './simulador'
import { useSms } from './atalhos'
import { type Canal, type Entrega, type OrigemDoEnvio, type SaiuPor, type StatusDoEnvio, textosDeCanais } from './textosDeCanais'
import BuscaDeItem from './_BuscaDeItem.vue'
import AbasDaCentral from './_AbasDaCentral.vue'
import ContaDeEnvio from './_ContaDeEnvio.vue'
import TabelaDoEnspace from './_TabelaDoEnspace.vue'
import Paginador from './_Paginador.vue'
import FiltroDeColuna, { type Filtros } from './_FiltroDeColuna.vue'
import { SEM_VALOR, passaNosFiltros, semAsColunas } from './filtroPorColuna'

const props = defineProps<{ t: Textos }>()

const { emails, config, fase, registrado, abrirCompositor, abrirItem, abaDaCentral, ehAdmin, rapidosDaCentral, dados, outlookIntegrado, ir } = useComunicacao()
const { abrirApp } = useAppExterno()
const { abrirSmsSemNumero } = useSms()
const tc = useTextos(textosDeCanais)
const marca = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const te = computed(() => props.t.emails)
/** Fase 4: a central de todos os canais. */
const todosOsCanais = computed(() => fase.value >= 4)
const titulo = computed(() => todosOsCanais.value ? tc.value.comunicacoes : te.value.titulo)

/** "Nova mensagem" da Fase 4: e-mail, SMS pelo número do workspace e o WhatsApp, que só sai com modelo. */
const novaMensagem = computed<DropdownMenuItem[][]>(() => [[
  { label: tc.value.novaMensagemOpcoes.email, icon: 'i-lucide-mail', onSelect: () => abrirCompositor({ origem: 'emails' }) },
  { label: tc.value.novaMensagemOpcoes.sms, icon: 'i-lucide-message-square-text', onSelect: () => abrirSmsSemNumero('') },
  { label: tc.value.novaMensagemWhatsApp, icon: 'i-simple-icons-whatsapp', description: tc.value.novaMensagemWhatsAppDica, disabled: true, ui: { itemDescription: 'whitespace-normal' } },
]])

/* ---------- abas da central ---------- */

const ICONE_DA_ABA: Record<AbaDaCentral, string> = {
  mensagens: 'i-lucide-inbox', modelos: 'i-lucide-file-text', caixas: 'i-lucide-mailbox', configuracoes: 'i-lucide-settings',
}
/**
 * Rodada 16: a lista de mensagens fica sozinha na entrada do menu, e as abas de quem administra
 * (Modelos, Caixas de E-mail e Regras de envio, ou Canais e regras na Fase 4) viram a página de
 * Configurações › E-mails (Comunicações, na Fase 4). O botão "Configurações" do topo leva até ela.
 */
const naConfiguracao = computed(() => ABAS_DE_ADMIN.includes(abaDaCentral.value))
function rotuloDaAba(a: AbaDaCentral) {
  if (a === 'configuracoes') return todosOsCanais.value ? tc.value.separacao.canaisERegras : tc.value.separacao.regrasDeEnvio
  return props.t.central.abas[a]
}
const abas = computed(() => ABAS_DE_ADMIN.map(a => ({ value: a, label: rotuloDaAba(a), icon: ICONE_DA_ABA[a] })))
const tituloDaConfiguracao = computed(() => todosOsCanais.value ? tc.value.separacao.tituloComunicacoes : tc.value.separacao.tituloEmail)
const descricaoDaConfiguracao = computed(() => todosOsCanais.value ? tc.value.separacao.descricaoComunicacoes : tc.value.separacao.descricaoEmail)

/** O texto do "i" de cada aba. */
function dicaDaAba(a: AbaDaCentral) {
  if (a !== 'mensagens') return a === 'modelos' && todosOsCanais.value ? tc.value.dicaModelos : props.t.central.dicas[a]
  if (todosOsCanais.value) return tc.value.descricaoComunicacoes
  const base = fase.value >= 2 ? props.t.emails.descricaoFase2 : props.t.emails.descricaoFase1
  return ehAdmin.value ? `${base} ${props.t.emails.descricaoDoSistema}` : base
}

/* ---------- barra ---------- */

const busca = ref('')
type Periodo = 'todos' | 'hoje' | 'semana' | 'mes'
const periodo = ref<Periodo>('todos')
const filtros = ref<Filtros>({})
const mostrarRapidos = ref(true)

/** No estado, para Configurações › E-mails › E-mails Enviados abrir com "Do sistema". */
const rapidos = computed<Set<Rapido>>({
  get: () => new Set(rapidosDaCentral.value),
  set: (s) => { rapidosDaCentral.value = [...s] },
})
/** "Sistema" no filtro de "Enviado por" liga o filtro rápido "Do sistema" (RF953). */
watch(filtros, (f) => {
  const marcouSistema = Object.entries(f).some(([k, v]) => k.startsWith('enviadoPor_') && Array.isArray(v) && v.includes('sistema'))
  if (marcouSistema && !rapidos.value.has('sistema')) rapidos.value = new Set([...rapidos.value, 'sistema'])
}, { deep: true })

const COR_DO_RAPIDO: Record<Rapido, 'info' | 'success' | 'primary' | 'neutral' | 'warning' | 'secondary' | 'error'> = {
  recebidos: 'info', enviados: 'success', sistema: 'secondary', naoLidos: 'primary', comAnexo: 'neutral', semItem: 'warning',
  email: 'info', whatsapp: 'success', sms: 'secondary', naoEntregues: 'error',
}
const ICONE_DO_CANAL: Record<Canal, string> = { email: 'i-lucide-mail', whatsapp: 'i-simple-icons-whatsapp', sms: 'i-lucide-message-square-text' }
const ICONE_DO_RAPIDO: Record<Rapido, string> = {
  recebidos: 'i-lucide-inbox', enviados: 'i-lucide-send', sistema: 'i-lucide-workflow', naoLidos: 'i-lucide-mail', comAnexo: 'i-lucide-paperclip', semItem: 'i-lucide-unlink',
  ...ICONE_DO_CANAL, naoEntregues: 'i-lucide-circle-alert',
}
const CANAIS: Canal[] = ['email', 'whatsapp', 'sms']
const rapidosDaFase = computed<Rapido[]>(() => [
  ...(todosOsCanais.value ? CANAIS : []),
  'recebidos', 'enviados', ...(ehAdmin.value ? ['sistema' as const] : []), 'naoLidos', 'comAnexo', ...(fase.value >= 2 ? ['semItem' as const] : []),
  ...(todosOsCanais.value && ehAdmin.value ? ['naoEntregues' as const] : []),
])
function rotuloDoRapido(r: Rapido) {
  return r in te.value.rapidos ? te.value.rapidos[r as keyof typeof te.value.rapidos] : tc.value.rapidos[r as keyof typeof tc.value.rapidos]
}
function alternarRapido(r: Rapido) {
  const s = new Set(rapidos.value)
  if (s.has(r)) s.delete(r)
  else s.add(r)
  rapidos.value = s
}
watch(fase, (f) => {
  if (f < 2 && rapidos.value.has('semItem')) alternarRapido('semItem')
  if (f < 3) filtros.value = semAsColunas(filtros.value, ['tarefa'])
  if (f < 4) filtros.value = semAsColunas(filtros.value, ['canal', 'entrega'])
})
/** O membro não vê Status nem Entrega: os filtros delas saem junto. */
watch(ehAdmin, (a) => { if (!a) filtros.value = semAsColunas(filtros.value, ['status', 'entrega']) })

const qtdDeFiltros = computed(() => Object.keys(filtros.value).length + rapidos.value.size + (periodo.value !== 'todos' ? 1 : 0))
const temFiltro = computed(() => qtdDeFiltros.value > 0 || !!busca.value.trim())
function limparFiltros() {
  filtros.value = {}
  rapidos.value = new Set()
  periodo.value = 'todos'
  busca.value = ''
}

const opcoesDePeriodo = computed(() => (Object.keys(te.value.periodo) as Periodo[]).map(p => ({ value: p, label: te.value.periodo[p] })))

/* ---------- dados ---------- */

// O período conta a partir do dia do protótipo (05/10/2026), não do relógio do computador.
function dentroDoPeriodo(d: Date) {
  const agora = agoraDoPrototipo()
  const dias = { todos: Infinity, hoje: 0, semana: 7, mes: 30 }[periodo.value]
  if (dias === Infinity) return true
  if (dias === 0) return d.toDateString() === agora.toDateString()
  return +agora - +d <= dias * 864e5
}

function tarefaRef(id: number | null | undefined) {
  return id ? tarefas.find(x => x.id === id)?.reference ?? null : null
}
function autorDe(e: Email) {
  if (e.direcao !== 'enviado') return null
  if (e.sistema) {
    const o = origemDe(e)
    if (o === 'pessoa') return tc.value.enviadoPorPessoa(membroPorId(e.autor)?.nome ?? '')
    return tc.value.origem[o]
  }
  return membroPorId(e.autor)?.nome ?? null
}

/** A origem do envio do sistema. O registro de hoje grava a tarefa e a origem Atendimento; sem tarefa, é fluxo. */
function origemDe(e: Email): OrigemDoEnvio {
  return e.sistema?.origem ?? (e.sistema?.tarefa ? 'tarefa' : 'fluxo')
}
const ICONE_DA_ORIGEM: Record<OrigemDoEnvio, string> = { tarefa: 'i-lucide-square-check-big', fluxo: 'i-lucide-git-fork', atendimento: 'i-lucide-headset', pessoa: 'i-lucide-user' }

/** O detalhe da origem: a tarefa ou o fluxo e o nó. */
function detalheDaOrigem(e: Email) {
  const s = e.sistema
  if (!s) return null
  if (s.tarefa) return s.tarefa
  if (s.fluxo) return s.fluxo.nome
  return null
}

/** Por onde o e-mail ou a mensagem saiu (rodada 14). O recebido não tem. */
function saiuPorDe(e: Email): { chave: SaiuPor, rotulo: string } | null {
  if (e.direcao !== 'enviado') return null
  if (e.sistema) return { chave: e.sistema.saiuPor, rotulo: tc.value.saiuPor[e.sistema.saiuPor] }
  const caixa = caixas.find(c => c.email === e.de)
  if (caixa) return { chave: 'caixa', rotulo: tc.value.saiuPor.caixa(caixa.nome) }
  return { chave: 'outlook', rotulo: tc.value.saiuPor.outlook(membroPorId(e.autor)?.nome?.split(' ')[0] ?? e.de) }
}
const ICONE_DO_SAIU_POR: Record<SaiuPor, string> = {
  outlook: 'i-simple-icons-microsoftoutlook', caixa: 'i-lucide-mailbox', enspace: 'i-lucide-server', dominio: 'i-lucide-globe', twilioSms: 'i-lucide-smartphone', twilioWhatsApp: 'i-simple-icons-whatsapp',
}

const canalDe = (e: Email): Canal => e.canal ?? 'email'

const COR_DO_STATUS: Record<StatusDoEnvio, 'neutral' | 'info' | 'success' | 'error' | 'warning'> = {
  naFila: 'neutral', processando: 'info', enviado: 'success', falhou: 'error', cancelado: 'warning',
}
/** A dica do status. Falhou: o motivo gravado. Enviado: a entrega não é confirmada (até a Fase 4). */
function dicaDoStatus(e: Email) {
  const s = e.sistema
  if (!s) return ''
  if (s.status === 'falhou' && s.erro) return `${tc.value.motivoDaFalha}: ${s.erro}`
  if (s.status === 'enviado' && todosOsCanais.value) return tc.value.dicaDoEnviadoComEntrega
  return tc.value.dicaDoStatus[s.status]
}

/** Fase 4: a entrega, pelo aviso de eventos da SendGrid e pelo status da Twilio. */
const COR_DA_ENTREGA: Record<Entrega, 'success' | 'warning' | 'error'> = {
  entregue: 'success', lido: 'success', adiado: 'warning', devolvido: 'error', bloqueado: 'error', naoEntregue: 'error',
}
const ICONE_DA_ENTREGA: Record<Entrega, string> = {
  entregue: 'i-lucide-check', lido: 'i-lucide-check-check', adiado: 'i-lucide-clock', devolvido: 'i-lucide-undo-2', bloqueado: 'i-lucide-shield-x', naoEntregue: 'i-lucide-circle-x',
}
const NAO_ENTREGUE: Entrega[] = ['devolvido', 'bloqueado', 'naoEntregue']
function naoChegou(e: Email) {
  return e.sistema?.status === 'falhou' || (!!e.sistema?.entrega && NAO_ENTREGUE.includes(e.sistema.entrega))
}

/** O valor de cada coluna, usado no filtro, na ordem e na busca. */
function valor(e: Email, campo: string): string {
  switch (campo) {
    case 'tipo': return e.direcao
    case 'canal': return canalDe(e)
    case 'saiuPor': return saiuPorDe(e)?.rotulo ?? ''
    case 'de': return e.de
    case 'para': return e.para.join(', ')
    case 'assunto': return e.assunto
    case 'item': return itemPorId(e.itemId)?.reference ?? ''
    case 'tarefa': return tarefaRef(e.tarefaId) ?? ''
    case 'enviadoPor': return e.sistema ? 'sistema' : e.autor ? String(e.autor) : ''
    case 'status': return e.sistema?.status ?? ''
    case 'entrega': return e.sistema?.entrega ?? ''
    default: return ''
  }
}

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  const r = rapidos.value
  return emails.value
    .filter(registrado)
    // Fase 1: os e-mails do sistema e os dos itens vêm de 2 telas de hoje, e "Do sistema" troca a fonte
    // (RF952). A lista única, com os 2 juntos, é da fase 2 (épico "E-mail sem item e lista por permissão").
    // O SMS que a pessoa enviou pelo ENSPACE (Fase 4) segue a regra do e-mail dela.
    .filter(e => !e.sistema || e.sistema.origem === 'pessoa' || (ehAdmin.value && (fase.value >= 2 || r.has('sistema'))))
    // O e-mail sem item aparece só para quem enviou (épico "E-mail sem item e lista por permissão", RN003).
    .filter(e => !!e.itemId || !!e.sistema || e.direcao === 'recebido' || e.autor === EU.id)
    .filter(e => dentroDoPeriodo(e.data))
    .filter(e => !(r.has('recebidos') && !r.has('enviados')) || e.direcao === 'recebido')
    .filter(e => !(r.has('enviados') && !r.has('recebidos')) || e.direcao === 'enviado')
    .filter(e => !r.has('sistema') || !!e.sistema)
    .filter(e => !r.has('naoLidos') || (e.direcao === 'recebido' && !e.lido))
    .filter(e => !r.has('comAnexo') || e.anexos.length > 0)
    .filter(e => !r.has('semItem') || !e.itemId)
    .filter(e => !CANAIS.some(c => r.has(c)) || r.has(canalDe(e)))
    .filter(e => !r.has('naoEntregues') || naoChegou(e))
    .filter(e => passaNosFiltros(filtros.value, c => valor(e, c)))
    .filter(e => !q || `${e.assunto} ${e.de} ${e.para.join(' ')} ${valor(e, 'item')} ${autorDe(e) ?? ''}`.toLowerCase().includes(q))
})

/* ---------- ordem e página ---------- */

type Ordenavel = 'de' | 'para' | 'assunto' | 'item' | 'data'
const ordem = ref<{ campo: Ordenavel, direcao: 'asc' | 'desc' }>({ campo: 'data', direcao: 'desc' })
function ordenar(c: Ordenavel) {
  if (ordem.value.campo !== c) ordem.value = { campo: c, direcao: c === 'data' ? 'desc' : 'asc' }
  else ordem.value = { campo: c, direcao: ordem.value.direcao === 'asc' ? 'desc' : 'asc' }
}

const ordenados = computed(() => {
  const d = ordem.value.direcao === 'asc' ? 1 : -1
  const c = ordem.value.campo
  return [...filtrados.value].sort((a, b) => {
    if (c === 'data') return (+a.data - +b.data) * d
    return valor(a, c).localeCompare(valor(b, c), idioma.value) * d
  })
})

const pagina = ref(1)
const porPagina = ref(25)
watch([filtrados, porPagina], () => { pagina.value = 1 })
const daPagina = computed(() => ordenados.value.slice((pagina.value - 1) * porPagina.value, pagina.value * porPagina.value))

/* ---------- colunas ---------- */

type Coluna = 'tipo' | 'canal' | 'de' | 'para' | 'assunto' | 'item' | 'tarefa' | 'enviadoPor' | 'saiuPor' | 'status' | 'entrega' | 'data'
/** A coluna Ações (117 px, primeira) vem do `_TabelaDoEnspace.vue`. */
const LARGURA: Record<Coluna, number> = {
  tipo: 120, canal: 130, de: 210, para: 210, assunto: 300, item: 130, tarefa: 110, enviadoPor: 200, saiuPor: 200, status: 180, entrega: 140, data: 150,
}
const OCULTAVEIS: Coluna[] = ['tipo', 'canal', 'de', 'para', 'item', 'tarefa', 'enviadoPor', 'saiuPor', 'status', 'entrega']
const visiveis = ref<Record<string, boolean>>({})

const colunasDaFase = computed<Coluna[]>(() => (Object.keys(LARGURA) as Coluna[])
  .filter(c => c !== 'tarefa' || fase.value >= 3)
  .filter(c => !['canal', 'entrega'].includes(c) || todosOsCanais.value)
  .filter(c => !['status', 'entrega'].includes(c) || ehAdmin.value))

function rotuloDaColuna(c: Coluna) {
  if (c === 'canal' || c === 'saiuPor' || c === 'entrega') return tc.value.col[c]
  if (c === 'assunto' && todosOsCanais.value) return tc.value.col.assuntoOuMensagem
  return te.value.col[c]
}
const colunas = computed<TableColumn<Linha>[]>(() => colunasDaFase.value.map(id => ({
  id,
  accessorKey: id,
  meta: { style: { th: { width: `${LARGURA[id]}px` }, td: { width: `${LARGURA[id]}px` } } },
})))

const menuDeColunas = computed<DropdownMenuItem[]>(() => OCULTAVEIS.filter(c => colunasDaFase.value.includes(c)).map(c => ({
  label: rotuloDaColuna(c),
  type: 'checkbox' as const,
  checked: visiveis.value[c] !== false,
  onUpdateChecked: (v: boolean) => { visiveis.value = { ...visiveis.value, [c]: v } },
  onSelect: (e: Event) => e.preventDefault(),
})))

interface Linha extends Record<string, unknown> { id: number, email: Email }
const linhas = computed<Linha[]>(() => daPagina.value.map(e => ({ id: e.id, email: e })))

const opcoesDeTipo = computed(() => (['recebido', 'enviado'] as const).map(v => ({
  value: v, label: te.value.tipo[v], icon: v === 'recebido' ? 'i-lucide-inbox' : 'i-lucide-send',
})))
const opcoesDeItem = computed(() => {
  const refs = [...new Set(emails.value.filter(registrado).map(e => valor(e, 'item')).filter(Boolean))].sort()
  return [
    ...(fase.value >= 2 ? [{ value: '__sem__', label: te.value.semItem, icon: 'i-lucide-unlink' }] : []),
    ...refs.map(r => ({ value: r, label: r })),
  ]
})
const opcoesDeAutor = computed(() => [
  ...(ehAdmin.value ? [{ value: 'sistema', label: te.value.sistema, icon: 'i-lucide-workflow' }] : []),
  ...[...new Set(emails.value.filter(registrado).map(e => e.autor).filter(Boolean))]
    .map(id => ({ value: String(id), label: membroPorId(id)?.nome ?? String(id) })),
])
/* Rodada 15: as colunas Canal, Saiu por, Status e Entrega ganham o filtro de seleção. */
const opcoesDeCanal = computed(() => CANAIS.map(c => ({ value: c, label: tc.value.canal[c], icon: ICONE_DO_CANAL[c] })))
const opcoesDeSaiuPor = computed(() => [...new Set(emails.value.filter(registrado).map(e => saiuPorDe(e)?.rotulo).filter(Boolean) as string[])]
  .sort((a, b) => a.localeCompare(b, idioma.value))
  .map(r => ({ value: r, label: r })))
const opcoesDeStatus = computed(() => [
  ...(['naFila', 'processando', 'enviado', 'falhou', 'cancelado'] as StatusDoEnvio[]).map(s => ({ value: s, label: tc.value.status[s] })),
  { value: SEM_VALOR, label: tc.value.filtroVazio },
])
const opcoesDeEntrega = computed(() => [
  ...(['entregue', 'lido', 'adiado', 'devolvido', 'bloqueado', 'naoEntregue'] as Entrega[]).map(x => ({ value: x, label: tc.value.entrega[x], icon: ICONE_DA_ENTREGA[x] })),
  { value: SEM_VALOR, label: tc.value.filtroVazio },
])
const opcoesDeTarefa = computed(() => [...new Set(emails.value.filter(registrado).map(e => tarefaRef(e.tarefaId)).filter(Boolean) as string[])]
  .map(r => ({ value: r, label: r })))

function iconeDaOrdem(c: Ordenavel) {
  if (ordem.value.campo !== c) return 'i-lucide-arrow-down-up'
  return ordem.value.direcao === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow'
}

const formato = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))

/* ---------- gaveta e ações ---------- */

const aberto = ref<Email | null>(null)
const gaveta = computed({ get: () => !!aberto.value, set: (v) => { if (!v) aberto.value = null } })
const vinculando = ref(false)

function abrir(e: Email, vincularAgora = false) {
  aberto.value = e
  vinculando.value = vincularAgora
  if (!e.lido) emails.value = emails.value.map(x => x.id === e.id ? { ...x, lido: true } : x)
}

function marcarNaoLido(e: Email) {
  emails.value = emails.value.map(x => x.id === e.id ? { ...x, lido: false } : x)
  aberto.value = null
}

/** Sugestão pelo destinatário: itens em que esse endereço é contato (Pipedrive, HubSpot e monday sugerem antes da busca). */
const sugestoes = computed(() => {
  const e = aberto.value
  if (!e || (e.itemId && !vinculando.value)) return []
  const enderecos = new Set((e.direcao === 'recebido' ? [e.de] : e.para).map(x => x.toLowerCase()))
  return itens
    .filter(i => !i.semAcesso && i.id !== e.itemId && contatosDoItem(i, config.value).some(c => c.email && enderecos.has(c.email.toLowerCase())))
    .slice(0, 3)
})

function vincular(id: number) {
  const e = aberto.value
  if (!e) return
  emails.value = emails.value.map(x => x.id === e.id ? { ...x, itemId: id } : x)
  aberto.value = { ...e, itemId: id }
  vinculando.value = false
  toast.add({ title: te.value.vinculadoTitulo, description: te.value.vinculadoDescricao(itemPorId(id)!.reference), icon: 'i-lucide-link-2', color: 'success' })
}

function responder(e: Email, encaminhar = false) {
  aberto.value = null
  abrirCompositor({
    itemId: e.itemId,
    tarefaId: fase.value >= 3 ? e.tarefaId ?? null : null,
    para: encaminhar ? [] : [e.direcao === 'recebido' ? e.de : e.para[0]!],
    assunto: `${encaminhar ? 'Enc:' : 'Re:'} ${e.assunto.replace(/^(Re|Enc):\s*/i, '')}`,
    corpo: `<p></p><blockquote>${e.corpo}</blockquote>`,
    anexos: encaminhar ? [...e.anexos] : [],
    origem: encaminhar ? 'encaminhar' : 'responder',
  })
}

/** Reenviar volta o envio para a fila (rodada 14: também o Cancelado; nunca o que ainda está na fila ou em processamento). */
function podeReenviar(e: Email) {
  return !!e.sistema && !['naFila', 'processando'].includes(e.sistema.status) && !(canalDe(e) === 'whatsapp' && origemDe(e) === 'atendimento')
}
function rotuloDeReenviar(e: Email) {
  const c = canalDe(e)
  return c === 'sms' ? tc.value.reenviarSms : c === 'whatsapp' ? tc.value.reenviarWhatsApp : props.t.central.reenviar
}
function reenviar(e: Email) {
  const atualizar = (status: StatusDoEnvio) => {
    emails.value = emails.value.map(x => x.id === e.id && x.sistema ? { ...x, sistema: { ...x.sistema, status, erro: undefined, erroCodigo: undefined, entrega: undefined, motivoEntrega: undefined } } : x)
    if (aberto.value?.id === e.id) aberto.value = emails.value.find(x => x.id === e.id) ?? null
  }
  atualizar('naFila')
  setTimeout(() => atualizar('processando'), 1200)
  toast.add({ title: canalDe(e) === 'email' ? props.t.central.reenviado : tc.value.reenviado, icon: 'i-lucide-send', color: 'success' })
}

/** Fase 4: o histórico do envio na gaveta, montado do status e da entrega (no produto, dos eventos gravados). */
const formatoDaHora = computed(() => new Intl.DateTimeFormat(idioma.value, { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
function linhaDoTempo(e: Email) {
  const s = e.sistema
  if (!s) return []
  const em = (seg: number) => new Date(+e.data + seg * 1000)
  const passos: { rotulo: string, quando: Date, icone: string, cor: string, detalhe?: string }[] = [
    { rotulo: tc.value.status.naFila, quando: em(0), icone: 'i-lucide-list-ordered', cor: 'text-muted' },
  ]
  if (s.status === 'naFila') return passos
  if (s.status === 'cancelado') return [...passos, { rotulo: tc.value.status.cancelado, quando: em(60), icone: 'i-lucide-ban', cor: 'text-warning' }]
  passos.push({ rotulo: tc.value.status.processando, quando: em(2), icone: 'i-lucide-loader', cor: 'text-info' })
  if (s.status === 'processando') return passos
  if (s.status === 'falhou') return [...passos, { rotulo: tc.value.status.falhou, quando: em(4), icone: 'i-lucide-circle-x', cor: 'text-error', detalhe: s.erro }]
  passos.push({ rotulo: tc.value.status.enviado, quando: em(5), icone: 'i-lucide-send', cor: 'text-success' })
  if (!s.entrega) return passos
  if (s.entrega === 'lido') passos.push({ rotulo: tc.value.entrega.entregue, quando: em(9), icone: ICONE_DA_ENTREGA.entregue, cor: 'text-success' })
  passos.push({ rotulo: tc.value.entrega[s.entrega], quando: em(s.entrega === 'lido' ? 740 : 9), icone: ICONE_DA_ENTREGA[s.entrega], cor: `text-${COR_DA_ENTREGA[s.entrega]}`, detalhe: s.motivoEntrega })
  return passos
}

function abrirConversa() {
  toast.add({ title: tc.value.abrirConversa, description: tc.value.abreAtendimento, icon: 'i-lucide-info', color: 'neutral' })
}
function abrirFluxo() {
  aberto.value = null
  ir('spaceflow')
}

function acoesDe(e: Email): DropdownMenuItem[][] {
  const a = te.value.acoes
  if (e.sistema) {
    return [
      [
        { label: a.verDetalhes, icon: 'i-lucide-eye', onSelect: () => abrir(e) },
        ...(canalDe(e) === 'whatsapp' && origemDe(e) === 'atendimento'
          ? [{ label: tc.value.abrirConversa, icon: 'i-lucide-headset', onSelect: abrirConversa }]
          : [{ label: rotuloDeReenviar(e), icon: 'i-lucide-send', disabled: !podeReenviar(e), description: podeReenviar(e) ? undefined : tc.value.reenviarIndisponivel, onSelect: () => reenviar(e) }]),
      ],
      e.itemId ? [{ label: a.verItem, icon: 'i-lucide-file-symlink', onSelect: () => abrirItem(e.itemId!, 'visao') }] : [],
    ]
  }
  return [
    [
      { label: a.verDetalhes, icon: 'i-lucide-eye', onSelect: () => abrir(e) },
      { label: a.responder, icon: 'i-lucide-reply', onSelect: () => responder(e) },
      ...(fase.value >= 2 ? [{ label: a.encaminhar, icon: 'i-lucide-forward', onSelect: () => responder(e, true) }] : []),
    ],
    [
      ...(e.direcao === 'recebido' && e.lido ? [{ label: a.marcarNaoLido, icon: 'i-lucide-mail', onSelect: () => marcarNaoLido(e) }] : []),
      e.itemId
        ? { label: a.verItem, icon: 'i-lucide-file-symlink', onSelect: () => abrirItem(e.itemId!, 'mailbox') }
        : { label: a.vincular, icon: 'i-lucide-link-2', onSelect: () => abrir(e, true) },
    ],
  ]
}

/** O estado vazio sem filtro: workspace novo (nada configurado) ou primeiro uso. */
const semNenhumEmail = computed(() => !emails.value.some(e => registrado(e) && (!e.sistema || ehAdmin.value)))
const acoesDoVazio = computed(() => {
  const v = te.value.vazio
  if (!outlookIntegrado.value) {
    return [
      { label: v.integrar, icon: 'i-lucide-plug', onClick: () => abrirApp({ tipo: 'outlook', url: 'https://app.enspace.io/profile?tab=integrations' }) },
      ...(ehAdmin.value && dados.value === 'novo'
        ? [
            { label: v.criarModelo, icon: 'i-lucide-file-text', color: 'neutral' as const, variant: 'outline' as const, onClick: () => { abaDaCentral.value = 'modelos' } },
            { label: v.criarCaixa, icon: 'i-lucide-mailbox', color: 'neutral' as const, variant: 'outline' as const, onClick: () => { abaDaCentral.value = 'caixas' } },
          ]
        : []),
    ]
  }
  return [{ label: v.escrever, icon: 'i-lucide-mail-plus', onClick: () => abrirCompositor({ origem: 'emails' }) }]
})

function nomeDaCaixa(endereco: string) {
  return caixas.find(c => c.email === endereco)?.nome ?? null
}
</script>

<template>
  <div class="flex min-h-0 flex-col">
    <!-- ===== Configurações › E-mails (Comunicações, na Fase 4): só quem administra (rodada 16) ===== -->
    <template v-if="naConfiguracao">
      <div class="flex flex-wrap items-center gap-3 px-4 pb-2 pt-4 sm:px-6" :class="marca">
        <div class="min-w-0">
          <h1 class="text-xl font-semibold text-highlighted">
            {{ tituloDaConfiguracao }}
          </h1>
          <p class="mt-0.5 text-sm text-muted">
            {{ descricaoDaConfiguracao }}
          </p>
        </div>
        <UButton :label="tc.separacao.verMensagens" icon="i-lucide-inbox" color="neutral" variant="outline" class="ml-auto" @click="abaDaCentral = 'mensagens'" />
      </div>
      <UTabs
        v-model="abaDaCentral"
        :items="abas"
        :content="false"
        variant="link"
        size="sm"
        class="shrink-0 px-4 sm:px-6"
        :class="marca"
        :ui="{ list: 'border-b border-default' }"
      >
        <!-- O que a aba guarda: no "i", não num texto solto na barra (pedido da rodada 8) -->
        <template #trailing="{ item }">
          <UTooltip :text="dicaDaAba(item.value as AbaDaCentral)" :content="{ side: 'bottom' }">
            <span role="img" :aria-label="dicaDaAba(item.value as AbaDaCentral)" class="inline-flex">
              <UIcon name="i-lucide-info" class="size-3.5 text-dimmed" />
            </span>
          </UTooltip>
        </template>
      </UTabs>
      <AbasDaCentral :t="t" :aba="abaDaCentral as Exclude<AbaDaCentral, 'mensagens'>" />
    </template>

    <template v-else>
    <!-- Título da lista: a conta de envio, o atalho para as configurações e o envio (rodada 16) -->
    <div class="flex flex-wrap items-center gap-2 px-4 pb-3 pt-4 sm:px-6">
      <h1 class="min-w-0 text-xl font-semibold text-highlighted">
        {{ titulo }}
      </h1>
      <UTooltip :text="dicaDaAba('mensagens')" :content="{ side: 'bottom' }">
        <span role="img" :aria-label="dicaDaAba('mensagens')" class="inline-flex">
          <UIcon name="i-lucide-info" class="size-4 text-dimmed" />
        </span>
      </UTooltip>
      <div class="ml-auto flex flex-wrap items-center gap-2" :class="marca">
        <ContaDeEnvio :t="t" />
        <UTooltip v-if="ehAdmin" :text="tc.separacao.configuracoesDica">
          <UButton :label="tc.separacao.configuracoes" icon="i-lucide-settings" color="neutral" variant="outline" @click="abaDaCentral = 'modelos'" />
        </UTooltip>
        <!-- PROPOSTA (Fase 4): uma ação para os canais que o ENSPACE envia -->
        <UDropdownMenu v-if="todosOsCanais" :items="novaMensagem" :content="{ align: 'end' }" :ui="{ content: 'w-80' }">
          <UButton :label="tc.novaMensagem" icon="i-lucide-plus" trailing-icon="i-lucide-chevron-down" />
        </UDropdownMenu>
        <UButton v-else :label="t.casca.novoEmail" icon="i-lucide-mail-plus" @click="abrirCompositor({ origem: 'emails' })" />
      </div>
    </div>

    <!-- Barra: TablesPartsDataToolbar -->
    <div class="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-default px-3 py-2 sm:px-4" :class="marca">
      <UChip :show="!!busca.trim()" color="error" size="sm">
        <UInput v-model="busca" :placeholder="te.pesquisar" icon="i-lucide-search" size="sm" variant="soft" class="w-48" :aria-label="te.pesquisar">
          <template v-if="busca" #trailing>
            <UButton icon="i-lucide-circle-x" color="neutral" variant="link" size="xs" class="p-0" :aria-label="te.limparBusca" @click="busca = ''" />
          </template>
        </UInput>
      </UChip>
      <USelectMenu
        v-model="periodo"
        :items="opcoesDePeriodo"
        value-key="value"
        :search-input="false"
        icon="i-lucide-calendar"
        size="sm"
        variant="soft"
        class="w-44"
        :aria-label="te.periodoRotulo"
      />
      <UTooltip :text="te.limparFiltros">
        <UButton
          icon="i-lucide-filter-x"
          color="neutral"
          variant="ghost"
          size="sm"
          :class="temFiltro ? 'text-error' : ''"
          :disabled="!temFiltro"
          :aria-label="te.limparFiltros"
          @click="limparFiltros"
        />
      </UTooltip>

      <div class="ml-auto flex items-center gap-1.5">
        <UDropdownMenu :items="menuDeColunas" :content="{ align: 'end' }">
          <UButton :label="te.colunas" icon="i-lucide-columns-3" color="neutral" variant="outline" size="sm" />
        </UDropdownMenu>
        <UTooltip :text="mostrarRapidos ? te.recolherFiltros : te.expandirFiltros">
          <UChip :show="rapidos.size > 0" :text="rapidos.size" color="primary" size="xl">
            <UButton
              :icon="mostrarRapidos ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              color="neutral"
              variant="ghost"
              size="sm"
              :aria-label="mostrarRapidos ? te.recolherFiltros : te.expandirFiltros"
              :aria-expanded="mostrarRapidos"
              @click="mostrarRapidos = !mostrarRapidos"
            />
          </UChip>
        </UTooltip>
      </div>
    </div>

    <!-- Filtros rápidos -->
    <div v-if="mostrarRapidos" class="flex shrink-0 flex-wrap items-center gap-2 border-b border-default px-3 py-1.5 sm:px-4">
      <UButton
        v-for="r in rapidosDaFase"
        :key="r"
        :label="rotuloDoRapido(r)"
        :icon="ICONE_DO_RAPIDO[r]"
        :color="rapidos.has(r) ? COR_DO_RAPIDO[r] : 'neutral'"
        :variant="rapidos.has(r) ? 'subtle' : 'soft'"
        size="sm"
        :aria-pressed="rapidos.has(r)"
        @click="alternarRapido(r)"
      />
    </div>

    <!-- Tabela: EntityRendererManyTable (cópia em _TabelaDoEnspace.vue) -->
    <div class="min-h-0 flex-1 animate-[entrada_.25s_ease-out] overflow-auto">
      <TabelaDoEnspace
        v-model:column-visibility="visiveis"
        :data="linhas"
        :columns="colunas"
        :acoes="(l: Linha) => acoesDe(l.email)"
        :rotulo-acoes="te.col.acoes"
        :get-row-id="(r: Linha) => String(r.id)"
        @select="(l: Linha) => abrir(l.email)"
      >
          <!-- ===== cabeçalhos: ordem, rótulo, funil ===== -->
          <template v-for="c in (['de', 'para', 'assunto', 'item', 'data'] as const)" :key="c" #[`${c}-header`]>
            <div class="flex w-full items-center justify-start gap-1">
              <UButton
                :icon="iconeDaOrdem(c)"
                color="neutral"
                variant="link"
                size="xs"
                class="p-0"
                :class="ordem.campo === c ? 'text-primary' : 'text-dimmed hover:text-primary'"
                :aria-label="te.ordenar(rotuloDaColuna(c))"
                @click.stop="ordenar(c)"
              />
              <span class="truncate">{{ rotuloDaColuna(c) }}</span>
              <FiltroDeColuna
                v-if="c === 'item'"
                v-model="filtros"
                class="ml-2"
                :t="t"
                campo="item"
                :rotulo="te.col.item"
                tipo="selecao"
                :opcoes="opcoesDeItem"
              />
              <FiltroDeColuna
                v-else-if="c === 'data'"
                v-model="filtros"
                v-model:unico="periodo"
                class="ml-2"
                :t="t"
                campo="data"
                :rotulo="te.col.data"
                tipo="unico"
                padrao="todos"
                :opcoes="opcoesDePeriodo"
              />
              <FiltroDeColuna
                v-else
                v-model="filtros"
                class="ml-2"
                :t="t"
                :campo="c"
                :rotulo="rotuloDaColuna(c)"
                tipo="texto"
              />
            </div>
          </template>
          <template #tipo-header>
            <div class="flex w-full items-center justify-start gap-1">
              <span class="truncate">{{ te.col.tipo }}</span>
              <FiltroDeColuna v-model="filtros" class="ml-2" :t="t" campo="tipo" :rotulo="te.col.tipo" tipo="selecao" :opcoes="opcoesDeTipo" />
            </div>
          </template>
          <template #enviadoPor-header>
            <div class="flex w-full items-center justify-start gap-1">
              <span class="truncate">{{ te.col.enviadoPor }}</span>
              <FiltroDeColuna v-model="filtros" class="ml-2" :t="t" campo="enviadoPor" :rotulo="te.col.enviadoPor" tipo="selecao" :opcoes="opcoesDeAutor" />
            </div>
          </template>
          <template #tarefa-header>
            <div class="flex w-full items-center justify-start gap-1" :class="marca">
              <span class="truncate">{{ te.col.tarefa }}</span>
              <FiltroDeColuna v-model="filtros" class="ml-2" :t="t" campo="tarefa" :rotulo="te.col.tarefa" tipo="selecao" :opcoes="opcoesDeTarefa" />
            </div>
          </template>
          <template #status-header>
            <div class="flex w-full items-center justify-start gap-1">
              <span class="truncate">{{ te.col.status }}</span>
              <FiltroDeColuna v-model="filtros" class="ml-2" :t="t" campo="status" :rotulo="te.col.status" tipo="selecao" :opcoes="opcoesDeStatus" />
            </div>
          </template>
          <template #canal-header>
            <div class="flex w-full items-center justify-start gap-1" :class="marca">
              <span class="truncate">{{ rotuloDaColuna('canal') }}</span>
              <FiltroDeColuna v-model="filtros" class="ml-2" :t="t" campo="canal" :rotulo="rotuloDaColuna('canal')" tipo="selecao" :opcoes="opcoesDeCanal" />
            </div>
          </template>
          <template #saiuPor-header>
            <div class="flex w-full items-center justify-start gap-1" :class="marca">
              <span class="truncate">{{ rotuloDaColuna('saiuPor') }}</span>
              <FiltroDeColuna v-model="filtros" class="ml-2" :t="t" campo="saiuPor" :rotulo="rotuloDaColuna('saiuPor')" tipo="selecao" :opcoes="opcoesDeSaiuPor" />
            </div>
          </template>
          <template #entrega-header>
            <div class="flex w-full items-center justify-start gap-1" :class="marca">
              <span class="truncate">{{ rotuloDaColuna('entrega') }}</span>
              <FiltroDeColuna v-model="filtros" class="ml-2" :t="t" campo="entrega" :rotulo="rotuloDaColuna('entrega')" tipo="selecao" :opcoes="opcoesDeEntrega" />
            </div>
          </template>

          <!-- ===== células ===== -->
          <template #tipo-cell="{ row }">
            <UBadge
              :label="te.tipo[row.original.email.direcao]"
              :icon="row.original.email.direcao === 'recebido' ? 'i-lucide-inbox' : 'i-lucide-send'"
              :color="row.original.email.direcao === 'recebido' ? 'info' : 'success'"
              variant="subtle"
              size="sm"
            />
          </template>
          <template #de-cell="{ row }">
            <span class="flex min-w-0 items-center gap-2">
              <span v-if="!row.original.email.lido" role="img" class="size-2 shrink-0 rounded-full bg-primary" :aria-label="te.naoLido" />
              <span class="truncate" :class="row.original.email.lido ? 'text-default' : 'font-semibold text-highlighted'" :title="row.original.email.de">
                {{ nomeDaCaixa(row.original.email.de) ?? row.original.email.de }}
              </span>
            </span>
          </template>
          <template #para-cell="{ row }">
            <span class="block truncate text-default" :title="row.original.email.para.join(', ')">{{ row.original.email.para.join(', ') }}</span>
          </template>
          <template #assunto-cell="{ row }">
            <span class="flex min-w-0 items-center gap-1.5">
              <span class="truncate" :class="row.original.email.lido ? 'text-default' : 'font-semibold text-highlighted'">{{ row.original.email.assunto }}</span>
              <UIcon v-if="row.original.email.anexos.length" name="i-lucide-paperclip" class="size-3.5 shrink-0 text-muted" :aria-label="te.comAnexo" />
            </span>
          </template>
          <template #item-cell="{ row }">
            <UButton
              v-if="itemPorId(row.original.email.itemId)"
              :label="itemPorId(row.original.email.itemId)!.reference"
              icon="i-lucide-file"
              color="neutral"
              variant="outline"
              size="xs"
              class="font-mono"
              @click.stop="abrirItem(row.original.email.itemId!, row.original.email.sistema ? 'visao' : 'mailbox')"
            />
            <UButton
              v-else
              :label="te.vincular"
              icon="i-lucide-link-2"
              color="warning"
              variant="soft"
              size="xs"
              :class="marca"
              @click.stop="abrir(row.original.email, true)"
            />
          </template>
          <template #tarefa-cell="{ row }">
            <UBadge v-if="tarefaRef(row.original.email.tarefaId)" :label="tarefaRef(row.original.email.tarefaId)!" icon="i-lucide-square-check-big" color="neutral" variant="subtle" size="sm" class="font-mono" />
            <span v-else class="text-dimmed">-</span>
          </template>
          <template #enviadoPor-cell="{ row }">
            <!-- Rodada 14: a origem no lugar de "Sistema" (Tarefa, Spaceflow, Atendimento) -->
            <span v-if="row.original.email.sistema" class="flex min-w-0 items-center gap-1.5 text-default" :title="detalheDaOrigem(row.original.email) ?? undefined">
              <UIcon :name="ICONE_DA_ORIGEM[origemDe(row.original.email)]" class="size-3.5 shrink-0 text-muted" />
              <span class="truncate">{{ autorDe(row.original.email) }}<template v-if="detalheDaOrigem(row.original.email)"> · <span :class="row.original.email.sistema.tarefa ? 'font-mono' : ''">{{ detalheDaOrigem(row.original.email) }}</span></template></span>
            </span>
            <span v-else-if="autorDe(row.original.email)" class="block truncate text-default">{{ autorDe(row.original.email) }}</span>
            <span v-else class="text-dimmed">-</span>
          </template>
          <template #data-cell="{ row }">
            <span class="whitespace-nowrap text-muted">{{ formato.format(row.original.email.data) }}</span>
          </template>
          <template #status-cell="{ row }">
            <UTooltip v-if="row.original.email.sistema" :text="dicaDoStatus(row.original.email)">
              <UBadge
                :label="tc.status[row.original.email.sistema.status]"
                :icon="row.original.email.sistema.status === 'falhou' ? 'i-lucide-circle-alert' : undefined"
                :color="COR_DO_STATUS[row.original.email.sistema.status]"
                variant="subtle"
                size="sm"
                tabindex="0"
              />
            </UTooltip>
            <span v-else class="text-dimmed">-</span>
          </template>
          <template #canal-cell="{ row }">
            <span class="flex items-center gap-1.5 text-default">
              <UIcon :name="ICONE_DO_CANAL[canalDe(row.original.email)]" class="size-3.5 shrink-0 text-muted" />
              {{ tc.canal[canalDe(row.original.email)] }}
            </span>
          </template>
          <template #saiuPor-cell="{ row }">
            <UTooltip v-if="saiuPorDe(row.original.email)" :text="tc.dicaDoSaiuPor[saiuPorDe(row.original.email)!.chave]">
              <span class="flex min-w-0 items-center gap-1.5 text-default" tabindex="0">
                <UIcon :name="ICONE_DO_SAIU_POR[saiuPorDe(row.original.email)!.chave]" class="size-3.5 shrink-0 text-muted" />
                <span class="truncate">{{ saiuPorDe(row.original.email)!.rotulo }}</span>
              </span>
            </UTooltip>
            <span v-else class="text-dimmed">-</span>
          </template>
          <template #entrega-cell="{ row }">
            <UTooltip v-if="row.original.email.sistema?.entrega" :text="row.original.email.sistema.motivoEntrega ?? tc.entrega[row.original.email.sistema.entrega]">
              <UBadge
                :label="tc.entrega[row.original.email.sistema.entrega]"
                :icon="ICONE_DA_ENTREGA[row.original.email.sistema.entrega]"
                :color="COR_DA_ENTREGA[row.original.email.sistema.entrega]"
                variant="subtle"
                size="sm"
                tabindex="0"
              />
            </UTooltip>
            <UTooltip v-else-if="row.original.email.direcao === 'enviado' && !row.original.email.sistema" :text="tc.semEntrega">
              <span class="text-dimmed" tabindex="0">-</span>
            </UTooltip>
            <span v-else class="text-dimmed">-</span>
          </template>

          <template #empty>
            <div v-if="temFiltro || !semNenhumEmail" class="flex flex-col items-center justify-center py-12 text-center">
              <UIcon name="i-lucide-inbox" class="mb-3 h-12 w-12 text-dimmed" />
              <p class="text-sm text-muted">
                {{ temFiltro ? te.vazioFiltrado : te.vazioDescricao }}
              </p>
              <UButton v-if="temFiltro" :label="te.limparFiltros" icon="i-lucide-filter-x" color="neutral" variant="outline" size="sm" class="mt-3" @click="limparFiltros" />
            </div>
            <!-- PROPOSTA (rodada 8): sem nenhum e-mail, o próximo passo -->
            <UEmpty
              v-else
              variant="naked"
              icon="i-lucide-inbox"
              :title="outlookIntegrado ? te.vazio.primeiroTitulo : te.vazio.novoTitulo"
              :description="outlookIntegrado ? te.vazio.primeiroDescricao : ehAdmin && dados === 'novo' ? te.vazio.novoDescricao : te.vazio.novoMembroDescricao"
              :actions="acoesDoVazio"
              class="py-12"
              :class="marca"
            />
          </template>
      </TabelaDoEnspace>
    </div>

    <!-- Paginador: EntityRendererPaginator -->
    <Paginador v-model:pagina="pagina" v-model:por-pagina="porPagina" :t="t" :total="ordenados.length" />

    </template>

    <!-- Gaveta à direita: SharedResizableDrawer -->
    <USlideover
      v-model:open="gaveta"
      :title="aberto ? (canalDe(aberto) === 'email' ? aberto.assunto : `${tc.canal[canalDe(aberto)]} · ${aberto.para[0]}`) : undefined"
      :description="aberto ? formato.format(aberto.data) : undefined"
      :ui="{ content: 'sm:max-w-[700px]' }"
    >
      <template #body>
        <div v-if="aberto" class="flex flex-col gap-4">
          <dl class="grid grid-cols-[8rem_1fr] gap-x-3 gap-y-1.5 text-sm">
            <dt class="text-muted">
              {{ te.col.tipo }}
            </dt>
            <dd>
              <UBadge :label="te.tipo[aberto.direcao]" :icon="aberto.direcao === 'recebido' ? 'i-lucide-inbox' : 'i-lucide-send'" :color="aberto.direcao === 'recebido' ? 'info' : 'success'" variant="subtle" size="sm" />
            </dd>
            <template v-if="todosOsCanais">
              <dt class="text-muted">
                {{ tc.col.canal }}
              </dt>
              <dd class="flex items-center gap-1.5 text-highlighted">
                <UIcon :name="ICONE_DO_CANAL[canalDe(aberto)]" class="size-4 text-muted" />{{ tc.canal[canalDe(aberto)] }}
              </dd>
            </template>
            <dt class="text-muted">
              {{ te.col.de }}
            </dt>
            <dd class="break-all text-highlighted">
              {{ aberto.de }}<span v-if="nomeDaCaixa(aberto.de)" class="text-muted"> ({{ nomeDaCaixa(aberto.de) }})</span>
            </dd>
            <dt class="text-muted">
              {{ te.col.para }}
            </dt>
            <dd class="break-all text-highlighted">
              {{ aberto.para.join(', ') }}
            </dd>
            <template v-if="aberto.cc.length">
              <dt class="text-muted">
                {{ t.compositor.cc }}
              </dt>
              <dd class="break-all text-highlighted">
                {{ aberto.cc.join(', ') }}
              </dd>
            </template>
            <template v-if="autorDe(aberto)">
              <dt class="text-muted">
                {{ te.col.enviadoPor }}
              </dt>
              <dd class="flex items-center gap-1.5 text-highlighted">
                <UIcon v-if="aberto.sistema" :name="ICONE_DA_ORIGEM[origemDe(aberto)]" class="size-4 text-muted" />{{ autorDe(aberto) }}
              </dd>
            </template>
            <!-- Rodada 14: por onde saiu, em todas as fases -->
            <template v-if="saiuPorDe(aberto)">
              <dt class="text-muted">
                {{ tc.col.saiuPor }}
              </dt>
              <dd class="flex flex-col text-highlighted" :class="marca">
                <span class="flex items-center gap-1.5"><UIcon :name="ICONE_DO_SAIU_POR[saiuPorDe(aberto)!.chave]" class="size-4 text-muted" />{{ saiuPorDe(aberto)!.rotulo }}</span>
                <span class="text-xs text-muted">{{ tc.dicaDoSaiuPor[saiuPorDe(aberto)!.chave] }}</span>
              </dd>
            </template>
            <template v-if="aberto.sistema">
              <dt class="text-muted">
                {{ te.col.status }}
              </dt>
              <dd class="flex flex-col items-start gap-0.5">
                <UBadge :label="tc.status[aberto.sistema.status]" :color="COR_DO_STATUS[aberto.sistema.status]" variant="subtle" size="sm" />
                <span v-if="aberto.sistema.status !== 'falhou'" class="text-xs text-muted">{{ dicaDoStatus(aberto) }}</span>
              </dd>
              <!-- Rodada 14: o motivo que o envio já grava -->
              <template v-if="aberto.sistema.status === 'falhou' && aberto.sistema.erro">
                <dt class="text-muted">
                  {{ tc.motivoDaFalha }}
                </dt>
                <dd class="text-error" :class="marca">
                  {{ aberto.sistema.erro }}<span v-if="todosOsCanais && aberto.sistema.erroCodigo" class="block text-xs text-muted">{{ tc.codigoDoErro(aberto.sistema.erroCodigo) }}</span>
                </dd>
              </template>
              <!-- Fase 4: a entrega, do aviso de eventos da SendGrid e do status da Twilio -->
              <template v-if="todosOsCanais && aberto.sistema.entrega">
                <dt class="text-muted">
                  {{ tc.col.entrega }}
                </dt>
                <dd class="flex flex-col items-start gap-0.5" :class="marca">
                  <UBadge :label="tc.entrega[aberto.sistema.entrega]" :icon="ICONE_DA_ENTREGA[aberto.sistema.entrega]" :color="COR_DA_ENTREGA[aberto.sistema.entrega]" variant="subtle" size="sm" />
                  <span v-if="aberto.sistema.motivoEntrega" class="text-sm text-highlighted">{{ tc.motivoDaEntrega }}: {{ aberto.sistema.motivoEntrega }}</span>
                  <span v-if="aberto.sistema.erroCodigo" class="text-xs text-muted">{{ tc.codigoDoErro(aberto.sistema.erroCodigo) }}</span>
                </dd>
              </template>
              <template v-if="todosOsCanais && aberto.modeloWhatsApp">
                <dt class="text-muted">
                  {{ tc.modeloAprovado }}
                </dt>
                <dd class="font-mono text-highlighted">
                  {{ aberto.modeloWhatsApp }}
                </dd>
              </template>
              <template v-if="canalDe(aberto) === 'sms'">
                <dt class="text-muted">
                  {{ tc.tamanho }}
                </dt>
                <dd class="text-highlighted">
                  {{ tc.segmentos(partesDoSms(aberto.assunto).partes) }}
                </dd>
              </template>
              <template v-if="aberto.sistema.tarefa">
                <dt class="text-muted">
                  {{ te.col.tarefa }}
                </dt>
                <dd class="font-mono text-highlighted">
                  {{ aberto.sistema.tarefa }}
                </dd>
              </template>
              <template v-if="aberto.sistema.fluxo">
                <dt class="text-muted">
                  {{ tc.origem.fluxo }}
                </dt>
                <dd class="flex flex-wrap items-center gap-2 text-highlighted">
                  {{ tc.noDoFluxo(aberto.sistema.fluxo.nome, aberto.sistema.fluxo.no) }}
                  <UButton v-if="todosOsCanais" :label="tc.abrirFluxo" icon="i-lucide-git-fork" color="neutral" variant="outline" size="xs" @click="abrirFluxo" />
                </dd>
              </template>
            </template>
            <template v-if="fase >= 3 && tarefaRef(aberto.tarefaId)">
              <dt class="text-muted">
                {{ te.col.tarefa }}
              </dt>
              <dd class="font-mono text-highlighted">
                {{ tarefaRef(aberto.tarefaId) }}
              </dd>
            </template>
          </dl>

          <!-- O item -->
          <div class="rounded-lg border p-3" :class="aberto.itemId && !vinculando ? 'border-default' : ['border-warning/40 bg-warning/5', marca]">
            <p class="flex items-center gap-1.5 text-sm font-medium text-highlighted">
              <UIcon name="i-lucide-link-2" class="size-4 text-muted" />{{ te.col.item }}
            </p>
            <div v-if="itemPorId(aberto.itemId) && !vinculando" class="mt-2 flex flex-wrap items-center gap-2">
              <UButton
                :label="`${itemPorId(aberto.itemId)!.reference} · ${itemPorId(aberto.itemId)!.titulo}`"
                icon="i-lucide-file"
                color="neutral"
                variant="outline"
                size="sm"
                class="min-w-0"
                :ui="{ label: 'truncate' }"
                @click="abrirItem(aberto.itemId!, aberto.sistema ? 'visao' : 'mailbox'); aberto = null"
              />
              <UButton v-if="fase >= 2 && !aberto.sistema" :label="t.compositor.trocar" color="neutral" variant="ghost" size="xs" @click="vinculando = true" />
            </div>
            <div v-else class="mt-2">
              <p v-if="!aberto.itemId" class="mb-2 text-xs text-muted">
                {{ te.vincularDepois }}
              </p>
              <div v-if="sugestoes.length" class="mb-2 flex flex-wrap items-center gap-1.5">
                <span class="text-xs text-muted">{{ te.sugestoesPeloRemetente }}</span>
                <UButton
                  v-for="sug in sugestoes"
                  :key="sug.id"
                  :label="`${sug.reference} · ${sug.titulo}`"
                  icon="i-lucide-sparkles"
                  color="primary"
                  variant="soft"
                  size="xs"
                  class="max-w-64"
                  :ui="{ label: 'truncate' }"
                  @click="vincular(sug.id)"
                />
              </div>
              <BuscaDeItem :t="t" @escolher="vincular" />
              <UButton v-if="aberto.itemId" :label="t.compositor.cancelar" color="neutral" variant="ghost" size="xs" class="mt-2" @click="vinculando = false" />
            </div>
          </div>

          <!-- Fase 4: SMS e WhatsApp no balão da mensagem -->
          <div v-if="canalDe(aberto) !== 'email'" class="flex justify-end rounded-lg bg-elevated p-4">
            <p class="max-w-[85%] rounded-2xl rounded-br-sm px-3 py-2 text-sm" :class="canalDe(aberto) === 'whatsapp' ? 'bg-success/15 text-highlighted' : 'bg-primary text-inverted'">
              {{ aberto.assunto }}
            </p>
          </div>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-else class="rounded-lg border border-default p-4 text-sm text-default [&_blockquote]:border-l-2 [&_blockquote]:border-default [&_blockquote]:pl-3 [&_p]:my-1.5" v-html="aberto.corpo" />

          <!-- Fase 4: o histórico do envio -->
          <div v-if="todosOsCanais && aberto.sistema" :class="marca">
            <p class="mb-2 text-sm font-medium text-highlighted">
              {{ tc.linhaDoTempo }}
            </p>
            <ol class="relative flex flex-col gap-3 border-l border-default pl-5">
              <li v-for="(p, i) in linhaDoTempo(aberto)" :key="i" class="relative animate-[entrada_.25s_ease-out_both]" :style="{ animationDelay: `${i * 50}ms` }">
                <span class="absolute -left-[1.85rem] top-0 flex size-5 items-center justify-center rounded-full bg-default ring-1 ring-default">
                  <UIcon :name="p.icone" class="size-3" :class="p.cor" />
                </span>
                <span class="flex flex-wrap items-baseline gap-x-2 text-sm">
                  <span class="font-medium text-highlighted">{{ p.rotulo }}</span>
                  <span class="text-xs tabular-nums text-muted">{{ formatoDaHora.format(p.quando) }}</span>
                </span>
                <span v-if="p.detalhe" class="block text-xs text-muted">{{ p.detalhe }}</span>
              </li>
            </ol>
          </div>
          <div v-if="aberto.anexos.length" class="flex flex-wrap gap-1.5">
            <UBadge v-for="a in aberto.anexos" :key="a" :label="a" icon="i-lucide-paperclip" color="neutral" variant="outline" />
          </div>
        </div>
      </template>
      <template #footer>
        <div v-if="aberto?.sistema && canalDe(aberto) === 'whatsapp' && origemDe(aberto) === 'atendimento'" class="flex flex-wrap gap-2">
          <UButton :label="tc.abrirConversa" icon="i-lucide-headset" @click="abrirConversa" />
        </div>
        <div v-else-if="aberto?.sistema" class="flex flex-wrap items-center gap-2">
          <UButton :label="rotuloDeReenviar(aberto)" icon="i-lucide-send" :disabled="!podeReenviar(aberto)" @click="reenviar(aberto)" />
          <span v-if="!podeReenviar(aberto)" class="text-xs text-muted">{{ tc.reenviarIndisponivel }}</span>
        </div>
        <div v-else-if="aberto" class="flex flex-wrap gap-2">
          <UButton :label="te.acoes.responder" icon="i-lucide-reply" @click="responder(aberto)" />
          <UButton v-if="fase >= 2" :label="te.acoes.encaminhar" icon="i-lucide-forward" color="neutral" variant="outline" :class="marca" @click="responder(aberto, true)" />
          <UButton v-if="aberto.direcao === 'recebido'" :label="te.acoes.marcarNaoLido" icon="i-lucide-mail" color="neutral" variant="ghost" class="ml-auto" @click="marcarNaoLido(aberto)" />
        </div>
      </template>
    </USlideover>
  </div>
</template>
