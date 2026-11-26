<script setup lang="ts">
/**
 * Home do workspace, montada em widgets.
 *
 * A proposta (rodadas 1 e 2):
 * - a Home é uma grade de widgets que a pessoa arruma: arrasta pelo título,
 *   puxa o canto, remove, adiciona do catálogo. A mesma grade do Painel de
 *   tarefas (`UxGradeDePaineis`), para o ENSPACE ter um gesto só;
 * - "Personalizar" põe a própria Home em edição (rodada 4): barra no alto,
 *   alça, Subir, Descer e Remover em cada widget (o caminho sem arraste), e o
 *   painel lateral só com o catálogo;
 * - o administrador monta a Home padrão do workspace; quem não personalizou
 *   recebe ela inteira, e quem personalizou recebe só o widget novo, com o
 *   selo "Novo" (HubSpot e Notion);
 * - criar: um botão "Criar" no topo da Home (tecla C), que ramifica em Item
 *   (categoria, depois formulário) e Tarefa (rápida ou agendada), e "Pedir ao
 *   BENI". O menu lateral fica como o develop (rodada 2);
 * - widget "Categorias": acessar a categoria ou criar nela pelo "+";
 * - cada widget carrega, falha e fica sem acesso sozinho.
 *
 * Rodada 5, a partir da Home de develop (en-space@develop be2a5d850,
 * `src/utils/workspaceHome.ts`), que já traz as lâminas do Painel de tarefas:
 * - cada lâmina é um widget (números, Vencidas, Vencem em breve, status,
 *   prioridade, carga, atividade, saúde dos prazos, entrada e saída), e todas
 *   seguem o "Minhas tarefas · Workspace" do topo, como em develop;
 * - o catálogo vira árvore: Tarefas > a lâmina; Categorias > quais e em que
 *   ordem;
 * - saem os widgets de visualização salva (itens e número);
 * - 2 estados de partida: o workspace que acabou de nascer (os widgets da
 *   Home padrão no lugar, sem dado) e o workspace configurado.
 *
 * Rodada 6:
 * - o "Minhas tarefas · Workspace" do topo só aparece para o administrador;
 *   o membro vê sempre as próprias tarefas;
 * - a barra de edição fica mais curta: Adicionar widget, Restaurar padrão
 *   (só ícone), Concluir e Cancelar como X;
 * - Criar ▸ Tarefa abre a tarefa rápida direto; "Pedir ao BENI" abre a
 *   conversa do BENI, que monta o rascunho (`_ChatDoBeni.vue`);
 * - a Home padrão abre com Categorias e traz o BENI, também no workspace vazio;
 * - o widget BENI é só o resumo, com o botão que abre a conversa (o pedido se
 *   digita na conversa, nunca no widget);
 * - o catálogo ganha 5 grupos e 6 widgets novos de agenda e de itens.
 *
 * Rodada 7:
 * - Categorias mostra o nome, a descrição e o botão; "em aberto" sai da Home
 *   (o item não tem esse estado);
 * - "Agenda de hoje" passa a "Compromissos do dia";
 * - barra de edição em 3 grupos: Adicionar widget | Concluir | Restaurar e X;
 * - grupo IA no catálogo: BENI, Agentes de IA, Revisões por IA, Créditos de
 *   IA e Falhas dos agentes (os 2 últimos só do administrador, `_WIa.vue`);
 * - a conversa flutuante atende o agente clicado, não só o BENI.
 *
 * Rodada 8:
 * - saem Prazos de itens (o item não tem prazo), Revisões por IA, Créditos de
 *   IA e Falhas dos agentes;
 * - "Meus itens" são os que a pessoa criou (`Item.user`): o item não tem
 *   responsável. A Agenda junta o item pelo campo de data que a Agenda da
 *   categoria usa, sem filtro de pessoa, como a tela Agenda;
 * - o andaime ganha "Versão: Proposta completa · MVP". O MVP mostra só o que
 *   se faz no front com o que o develop já tem (`mvp` no widgets.ts): sem
 *   Home padrão do administrador, sem rascunho na conversa do BENI, e o
 *   agente abre a conversa em tela cheia.
 *
 * Rodada 11:
 * - o catálogo ganha o grupo Comunicação, com E-mail (os e-mails enviados de
 *   um item e Novo e-mail) e WhatsApp e SMS (o número e a mensagem);
 * - os 2 entram na Home padrão da Proposta completa, logo depois do BENI.
 *
 * O dado é o `mocks.ts`; o catálogo e a Home padrão, o `widgets.ts`. Tudo em
 * memória: o reload volta ao começo.
 */
import type { ItemDaGrade, LimitesDoPainel } from '~/components/ux/UxGradeDePaineis.vue'
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import CascaDaHome from './_CascaDaHome.vue'
import ConfigurarWidget from './_ConfigurarWidget.vue'
import BotaoCriar from './_BotaoCriar.vue'
import ModalNovaTarefa from './_ModalNovaTarefa.vue'
import type { DadosDaTarefa } from './_ModalNovaTarefa.vue'
import ChatDoBeni from './_ChatDoBeni.vue'
import WAgenda from './_WAgenda.vue'
import WItens from './_WItens.vue'
import WIa from './_WIa.vue'
import WSpaceflow from './_WSpaceflow.vue'
import WBeni from './_WBeni.vue'
import ModalNovoItem from './_ModalNovoItem.vue'
import type { DadosDoItem } from './_ModalNovoItem.vue'
import Catalogo from './_Catalogo.vue'
import WidgetMoldura from './_Widget.vue'
import type { EstadoDoWidget } from './_Widget.vue'
import WCategorias from './_WCategorias.vue'
import WListas from './_WListas.vue'
import WMinhasTarefas from './_WMinhasTarefas.vue'
import WLamina from './_WLamina.vue'
import WOutros from './_WOutros.vue'
import WComunicacao from './_WComunicacao.vue'
import type { AgenteDeIA, Atalho, Categoria, DiaDeTarefas, EmailEnviado, Evento, ExecucaoDeFluxo, Item, Recente, TarefaDaHome } from './mocks'
import {
  AGORA, DIA, EU, HORA, agentesDeIA, atalhosIniciais, categoria, categorias as categoriasIniciais, comunicadoInicial, emailsEnviados, eventosDoCalendario,
  execucoesDeFluxos, itensIniciais, metricasDosFluxos, notaInicial, painelDeCompras, recentes as recentesIniciais, resumoDoBeni, serieDasTarefas, tarefasIniciais,
} from './mocks'
import type { AbaDeTarefa } from './formatar'
import { HOJE, abaDa, dataCurta, dataLonga, horaAtual } from './formatar'
import type { ConfigDoWidget, LaminaDeTarefas, TipoDeWidget, Widget } from './widgets'
import { LAMINAS, MVP_LAYOUT, MVP_WIDGETS, PADRAO_LAYOUT, PADRAO_WIDGETS, definicao } from './widgets'
import { textos } from './textos'

definePageMeta({
  titulo: 'Home',
  descricao: 'Home do workspace em widgets que cada pessoa arruma (categorias, lâminas do Painel de tarefas, BENI e agentes, agenda, itens que a pessoa criou, e-mail, WhatsApp e SMS), Home padrão montada pelo administrador, um botão Criar com item, tarefa rápida e a conversa com o BENI, e a versão MVP só com o que o develop já tem.',
  status: 'aprovado',
  atualizado: '2026-11-26',
  tela: 'Início',
})

const t = useTextos(textos)
const toast = useToast()
const SLUG = 'operacoes-lumina'

/* ------------------------------------------------------------------ *
 * ANDAIME: estado e papel. Não é proposta.                             *
 * ------------------------------------------------------------------ */

type EstadoDaHome = 'workspaceVazio' | 'configurado' | 'carregando' | 'vazio' | 'erro' | 'semAcesso'
const estado = ref<EstadoDaHome>('configurado')
const papel = ref<'membro' | 'admin'>('admin')
const estados: { valor: EstadoDaHome, rotulo: string }[] = [
  { valor: 'workspaceVazio', rotulo: 'Workspace vazio (primeiro acesso)' },
  { valor: 'configurado', rotulo: 'Workspace configurado' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'vazio', rotulo: 'Sem widgets' },
  { valor: 'erro', rotulo: 'Erro num widget' },
  { valor: 'semAcesso', rotulo: 'Sem acesso num widget' },
]
const admin = computed(() => papel.value === 'admin')

/* ------------------------------------------------------------------ *
 * Dado em memória                                                      *
 * ------------------------------------------------------------------ */

const tarefas = ref<TarefaDaHome[]>([])
const itens = ref<Item[]>([])
const categorias = ref<Categoria[]>([])
const recentes = ref<Recente[]>([])
const eventos = ref<Evento[]>([])
const series = ref<{ minhas: DiaDeTarefas[], workspace: DiaDeTarefas[] }>({ minhas: [], workspace: [] })
const atalhos = ref<Atalho[]>([])
const nota = ref('')
const comunicado = ref<typeof comunicadoInicial | null>(null)
const beni = ref<{ linhas: { icone: string, texto: string }[] }>({ linhas: [] })
const recemCriados = ref<number[]>([])
/* Rodada 7: o grupo IA. No workspace novo só existe o BENI (agente do sistema). */
const agentes = ref<AgenteDeIA[]>([])
/* Rodada 9: o grupo Spaceflow. No workspace novo não há fluxo nem execução. */
const fluxos = ref<ExecucaoDeFluxo[]>([])
const metricas = ref({ ...metricasDosFluxos })
/* Rodada 11: os e-mails que a pessoa enviou de um item. No workspace novo, nenhum. */
const emails = ref<EmailEnviado[]>([])

/**
 * Andaime. O workspace que acabou de nascer não tem tarefa, item, categoria,
 * atalho nem comunicado, e a série das 4 semanas é toda zero; o configurado
 * é o mocks.ts inteiro.
 */
function carregarDados(vazio: boolean) {
  const zerar = (d: DiaDeTarefas[]) => d.map(x => ({ ...x, criadas: 0, concluidas: 0 }))
  tarefas.value = vazio ? [] : tarefasIniciais.map(x => ({ ...x }))
  itens.value = vazio ? [] : itensIniciais.map(x => ({ ...x }))
  categorias.value = vazio ? [] : [...categoriasIniciais]
  recentes.value = vazio ? [] : [...recentesIniciais]
  eventos.value = vazio ? [] : [...eventosDoCalendario]
  series.value = vazio ? { minhas: zerar(serieDasTarefas.minhas), workspace: zerar(serieDasTarefas.workspace) } : { ...serieDasTarefas }
  atalhos.value = vazio ? [] : [...atalhosIniciais]
  nota.value = vazio ? '' : notaInicial
  comunicado.value = vazio ? null : { ...comunicadoInicial }
  beni.value = vazio ? { linhas: [] } : resumoDoBeni
  agentes.value = vazio ? agentesDeIA.filter(a => a.sistema) : [...agentesDeIA]
  fluxos.value = vazio ? [] : execucoesDeFluxos.map(x => ({ ...x }))
  emails.value = vazio ? [] : [...emailsEnviados]
  metricas.value = vazio ? { working: 0, completed: 0, error: 0, canceled: 0 } : { ...metricasDosFluxos }
  recemCriados.value = []
}
carregarDados(false)

/**
 * PROPOSTA: de quem são as tarefas das lâminas. A Home de develop já tem o
 * alternador (`workspaceHome.ts`, guardado no navegador); aqui ele vale para
 * todas as lâminas de uma vez. Minhas tarefas = as atribuídas a mim.
 */
const escopoDasTarefas = ref<'minhas' | 'workspace'>('minhas')
const opcoesDoEscopoDasTarefas = computed(() => [
  { label: t.value.escopoDeTarefas.minhas, value: 'minhas', icon: 'i-lucide-user' },
  { label: t.value.escopoDeTarefas.workspace, value: 'workspace', icon: 'i-lucide-users' },
])
/* Rodada 6: o alternador é do administrador. O membro vê sempre as próprias tarefas. */
watch(papel, (p) => { if (p === 'membro') escopoDasTarefas.value = 'minhas' })
const tarefasDoEscopo = computed(() => escopoDasTarefas.value === 'minhas' ? tarefas.value.filter(x => x.assigned_to === EU.id) : tarefas.value)
const serieDoEscopo = computed(() => series.value[escopoDasTarefas.value])

interface Home { widgets: Widget[], layout: ItemDaGrade[] }
const copiaDaHome = (h: Home): Home => ({ widgets: h.widgets.map(w => ({ ...w, config: { ...w.config } })), layout: h.layout.map(x => ({ ...x })) })

/**
 * Andaime (rodada 8): a versão que se vê. "MVP" mostra só o que se faz no
 * front com o que o develop já tem; "Proposta completa", tudo.
 */
const versao = ref<'completa' | 'mvp'>('completa')
const mvp = computed(() => versao.value === 'mvp')
const padraoDaVersao = () => mvp.value ? { widgets: MVP_WIDGETS, layout: MVP_LAYOUT } : { widgets: PADRAO_WIDGETS, layout: PADRAO_LAYOUT }

const padrao = ref<Home>(copiaDaHome(padraoDaVersao()))
const minha = ref<Home>(copiaDaHome(padrao.value))

/** O administrador escolhe no Personalizar qual Home está editando. No MVP não há Home padrão gravada no workspace. */
const escopo = ref<'minha' | 'padrao'>('minha')
watch(papel, (p) => { if (p === 'membro') escopo.value = 'minha' })

function escolherVersao(v: 'completa' | 'mvp') {
  if (versao.value === v) return
  sairDaEdicao()
  chatAberto.value = false
  versao.value = v
  padrao.value = copiaDaHome(padraoDaVersao())
  minha.value = copiaDaHome(padrao.value)
}
const home = computed(() => escopo.value === 'padrao' ? padrao.value : minha.value)

const layout = computed({
  get: () => home.value.layout,
  set: (l) => { home.value.layout = l },
})

function widgetPorId(id: string) {
  return home.value.widgets.find(w => w.id === id)
}

/* ------------------------------------------------------------------ *
 * Topo                                                                 *
 * ------------------------------------------------------------------ */

const minhasAbertas = computed(() => tarefas.value.filter(x => x.assigned_to === EU.id && x.status !== 'completed'))
const resumo = computed(() => {
  const abas = minhasAbertas.value.map(abaDa)
  return t.value.resumoDoDia(abas.filter(a => a === 'atraso').length, abas.filter(a => a === 'hoje').length)
})

/* ------------------------------------------------------------------ *
 * O que se cria                                                        *
 * ------------------------------------------------------------------ */

const categoriasComAcesso = computed(() => categorias.value.filter(c => c.acesso))

/** Os itens das categorias que a pessoa acessa: o dado dos widgets de itens. */
const itensComAcesso = computed(() => itens.value.filter(i => categoria(i.categoria)?.acesso))

/**
 * As 3 fontes da Agenda, como a tela Agenda junta: os compromissos do
 * calendário, o prazo das minhas tarefas abertas e os itens pelo campo de data
 * que a Agenda de cada categoria usa (`c-schedule-configs`). A tela Agenda
 * busca esses itens sem filtro de pessoa (en-space@develop be2a5d850
 * `src/pages/workspaces/[workspace]/schedule/index.vue:329`): o item não tem
 * responsável (rodada 8). Tarefa ou item criado agora já entra.
 */
const agendaCompleta = computed<Evento[]>(() => [
  ...eventos.value,
  ...minhasAbertas.value.filter(x => x.due_date).map(x => ({ id: `t-${x.id}`, titulo: x.name, inicio: x.due_date!, fim: x.due_date!, fonte: 'tarefa' as const })),
  ...itensComAcesso.value.filter(i => i.data)
    .map(i => ({ id: `i-${i.id}`, titulo: i.titulo, inicio: new Date(i.data!), fim: new Date(i.data!), fonte: 'item' as const })),
])
const agendaDeHoje = computed(() => agendaCompleta.value.filter(e => e.inicio.getTime() >= HOJE && e.inicio.getTime() < HOJE + DIA))

const menuCriarAberto = ref(false)
const tarefaAberta = ref(false)
const tarefaInicial = ref<Partial<DadosDaTarefa>>()
const novoItemAberto = ref(false)
const itemEmCriacao = ref<{ categoria: string, formulario?: string, inicial?: Partial<DadosDoItem> }>({ categoria: '' })

function abrirItem(slug: string, formulario?: string, inicial?: Partial<DadosDoItem>) {
  itemEmCriacao.value = { categoria: slug, formulario, inicial }
  novoItemAberto.value = true
}

/** Rodada 6: Criar ▸ Tarefa é sempre a tarefa rápida. */
function abrirTarefa(inicial?: Partial<DadosDaTarefa>) {
  tarefaInicial.value = inicial
  tarefaAberta.value = true
}

/* PROPOSTA (rodada 6): a conversa do BENI, aberta pelo Criar ou pelo widget BENI. */
const chatAberto = ref(false)
const pedidoAoBeni = ref<{ texto: string, n: number }>()
/** Rodada 7: o agente da conversa. Nulo = BENI. */
const agenteDoChat = ref<AgenteDeIA | null>(null)
let pedidos = 0
function pedirAoBeni(texto: string, agente: AgenteDeIA | null = null) {
  menuCriarAberto.value = false
  // MVP: a página de conversa já aceita `?prompt=` e `?agent=`; o rascunho na conversa é proposta.
  if (mvp.value) return abrirMaquete(t.value.iaW.conversaEmTelaCheia(agente?.nome ?? 'BENI'))
  agenteDoChat.value = agente
  chatAberto.value = true
  pedidoAoBeni.value = { texto, n: ++pedidos }
}

const algumaCamadaAberta = computed(() => tarefaAberta.value || novoItemAberto.value || configAberto.value || editando.value)

/* Tecla C: abre o Criar fora de campo de texto (o defineShortcuts ignora campo por padrão). */
defineShortcuts({
  c: () => {
    if (!algumaCamadaAberta.value) menuCriarAberto.value = true
  },
})

let proximaTarefa = 13300
/** Cria a tarefa e devolve o número. Pela conversa do BENI, sem toast: a confirmação fica no cartão. */
function criarTarefa(dados: DadosDaTarefa, silencioso = false) {
  proximaTarefa += 3
  const nova: TarefaDaHome = { id: proximaTarefa, reference: `#${proximaTarefa}`, status: 'pending', creator: EU.id, ...dados }
  tarefas.value = [...tarefas.value, nova]
  if (silencioso) return nova.reference
  toast.add({
    title: t.value.novaTarefa.criada(nova.reference),
    icon: 'i-lucide-circle-check',
    color: 'success',
    actions: [{ label: t.value.novaTarefa.abrir, color: 'neutral', variant: 'outline', onClick: () => abrirMaquete(nova.name) }],
  })
  return nova.reference
}

/** "Adicionar tarefa" no pé de Minhas tarefas: o prazo vem da aba. */
function criarTarefaNaAba(nome: string, aba: AbaDeTarefa) {
  const due = aba === 'semPrazo' ? null : new Date(HOJE + (aba === 'proximas' ? DIA : 0) + 18 * HORA)
  criarTarefa({ name: nome, due_date: due, assigned_to: EU.id, priority: 'normal', origem: 'rapida' })
}

let proximoItem = 23400
function criarItem(dados: DadosDoItem) {
  criarItemEm(itemEmCriacao.value.categoria, dados)
}

/** Cria o item e devolve o número. Pela conversa do BENI, sem toast. */
function criarItemEm(slug: string, dados: DadosDoItem, silencioso = false) {
  proximoItem += 7
  const c = categoria(slug)
  const novo: Item = {
    id: proximoItem, reference: `#${proximoItem}`, categoria: slug, titulo: dados.titulo,
    etapa: 'Triagem', criador: EU.id, valor: dados.valor, data: dados.data,
    urgente: dados.urgente, criadoEm: AGORA.getTime() + (proximoItem - 23400) * 1000,
  }
  itens.value = [...itens.value, novo]
  recemCriados.value = [...recemCriados.value, novo.id]
  if (silencioso) return novo.reference
  toast.add({
    title: t.value.novoItem.criado(novo.reference, c?.name ?? ''),
    icon: 'i-lucide-circle-check',
    color: 'success',
    actions: [{ label: t.value.novaTarefa.abrir, color: 'neutral', variant: 'outline', onClick: () => abrirMaquete(novo.titulo) }],
  })
  return novo.reference
}

function concluirTarefa(id: number) {
  const x = tarefas.value.find(y => y.id === id)
  if (!x) return
  const antes = x.status
  x.status = 'completed'
  toast.add({
    title: t.value.tarefas.concluida,
    description: x.name,
    icon: 'i-lucide-circle-check',
    actions: [{ label: t.value.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { x.status = antes } }],
  })
}

/** Comunicado: editar o que existe ou escrever o primeiro (workspace novo). */
function salvarComunicado(texto: string) {
  comunicado.value = { titulo: comunicado.value?.titulo ?? t.value.widgets.comunicado.titulo, texto, autor: EU.nome, ha: 0 }
}

function abrirMaquete(destino: string, link?: string) {
  toast.add({ title: t.value.toasts.abrirMaquete(destino), description: link, icon: 'i-lucide-square-arrow-out-up-right', color: 'neutral', ui: link ? { description: 'break-all font-mono text-xs' } : undefined })
}

/* ------------------------------------------------------------------ *
 * Widgets                                                              *
 * ------------------------------------------------------------------ */

function tituloDo(w: Widget) {
  return t.value.widgets[w.tipo].titulo
}

/** As categorias do widget, na ordem escolhida. Sem escolha, todas as que a pessoa acessa. */
function categoriasDo(w: Widget) {
  const escolhidas = w.config.categorias ?? []
  if (!escolhidas.length) return categoriasComAcesso.value
  return escolhidas.map(s => categoriasComAcesso.value.find(c => c.slug === s)).filter((c): c is Categoria => !!c)
}

function subtituloDo(w: Widget) {
  if (estadoDo(w) !== 'ok') return undefined
  const daLamina = t.value.laminas.subtitulos[w.tipo]
  if (daLamina) return daLamina
  if (w.tipo === 'agenda') return dataLonga(AGORA, t.value)
  if (w.tipo === 'agendaSemana') return `${dataCurta(HOJE, t.value)} - ${dataCurta(HOJE + 6 * DIA, t.value)}`
  if (w.tipo === 'graficoDePainel') return painelDeCompras.tela
  return undefined
}

const ehLamina = (w: Widget) => (LAMINAS as readonly TipoDeWidget[]).includes(w.tipo)

/**
 * Andaime: quem leva o estado. Erro: a primeira lista ou gráfico de tarefas.
 * Sem acesso: o gráfico de um painel, cuja tela a pessoa pode não acessar.
 */
const alvoDoErro = computed(() => layout.value.find((x) => {
  const w = widgetPorId(x.id)
  return !!w && ['listas', 'graficos'].includes(definicao(w.tipo).secao ?? '')
})?.id)
const alvoDoSemAcesso = computed(() => home.value.widgets.find(w => w.tipo === 'graficoDePainel')?.id)
const recuperando = ref<string[]>([])
const recuperados = ref<string[]>([])
watch(estado, () => { recuperados.value = [] })

/**
 * Andaime. Os 2 de partida mostram a Home padrão do workspace, sem nada
 * personalizado: "Workspace vazio" sem dado nenhum, "Workspace configurado"
 * com o mocks.ts inteiro. Os outros partem do configurado.
 */
function escolherEstado(e: EstadoDaHome) {
  sairDaEdicao()
  carregarDados(e === 'workspaceVazio')
  if (e === 'workspaceVazio' || e === 'configurado') minha.value = copiaDaHome(padrao.value)
  estado.value = e
}

function estadoDo(w: Widget): EstadoDoWidget {
  if (estado.value === 'carregando' || recuperando.value.includes(w.id)) return 'carregando'
  if (recuperados.value.includes(w.id)) return 'ok'
  if (estado.value === 'erro' && w.id === alvoDoErro.value) return 'erro'
  if (estado.value === 'semAcesso' && w.id === alvoDoSemAcesso.value) return 'semAcesso'
  /* Rodada 9: o membro do protótipo não tem a permissão `workflows`. */
  if (!admin.value && definicao(w.tipo).permissao) return 'semAcesso'
  return 'ok'
}

function categoriaSemAcessoDo(w: Widget) {
  if (!admin.value && definicao(w.tipo).permissao) return 'Spaceflow'
  return w.id === alvoDoSemAcesso.value ? painelDeCompras.tela : undefined
}

/** Repetir: no produto, `PUT /workflows/nodes/:id/retry`. Aqui sai da lista e conta como em andamento. */
function repetirFluxo(e: ExecucaoDeFluxo) {
  fluxos.value = fluxos.value.filter(x => x.id !== e.id)
  metricas.value = { ...metricas.value, error: Math.max(0, metricas.value.error - 1), working: metricas.value.working + 1 }
  toast.add({ title: t.value.spaceflowW.repetido, description: e.fluxo, icon: 'i-lucide-rotate-cw', color: 'success' })
}

function tentarDeNovo(id: string) {
  recuperando.value = [...recuperando.value, id]
  setTimeout(() => {
    recuperando.value = recuperando.value.filter(x => x !== id)
    recuperados.value = [...recuperados.value, id]
  }, 900)
}

const limites = computed<Record<string, LimitesDoPainel>>(() => Object.fromEntries(home.value.widgets.map(w => [w.id, definicao(w.tipo).limites])))
const rotulos = computed(() => Object.fromEntries(home.value.widgets.map(w => [w.id, tituloDo(w)])))
const textosDaGrade = computed(() => ({ redimensionar: t.value.widget.redimensionar, movido: t.value.widget.movido, tamanho: t.value.widget.tamanho }))

const tiposNaHome = computed(() => home.value.widgets.map(w => w.tipo))

/* Adicionar, remover, mover */

let contador = 0
function adicionar(tipo: TipoDeWidget, config: ConfigDoWidget = tipo === 'categorias' ? { categorias: [] } : {}) {
  const d = definicao(tipo)
  contador++
  const id = `w-${tipo}-${contador}`
  const novo: Widget = { id, tipo, config }
  // Entra no topo, depois de Categorias, para a pessoa ver onde caiu.
  const posicao = layout.value[0] && widgetPorId(layout.value[0].id)?.tipo === 'categorias' ? 1 : 0
  home.value.widgets = [...home.value.widgets, novo]
  const l = [...layout.value]
  l.splice(posicao, 0, { id, w: d.tamanho.w, h: d.tamanho.h })
  layout.value = l

  // Na Home padrão: chega também a quem já personalizou, com o selo "Novo".
  if (escopo.value === 'padrao') {
    minha.value.widgets = [...minha.value.widgets, { ...novo, config: { ...config }, novo: true }]
    const m = [...minha.value.layout]
    m.splice(posicao, 0, { id, w: d.tamanho.w, h: d.tamanho.h })
    minha.value.layout = m
  }

  toast.add({ title: t.value.toasts.adicionado(tituloDo(novo)), icon: 'i-lucide-plus' })
}

/** O botão do 2º nível de Categorias no catálogo: adiciona o widget ou salva a escolha no que já está na Home. */
const widgetDeCategorias = computed(() => home.value.widgets.find(w => w.tipo === 'categorias'))
function aplicarCategorias(escolhidas: string[]) {
  const w = widgetDeCategorias.value
  if (!w) return adicionar('categorias', { categorias: escolhidas })
  w.config = { ...w.config, categorias: escolhidas }
  toast.add({ title: t.value.personalizacao.salva, description: tituloDo(w), icon: 'i-lucide-circle-check', color: 'success' })
}

function remover(id: string) {
  const w = widgetPorId(id)
  if (!w) return
  const anterior = copiaDaHome(home.value)
  const alvo = home.value
  alvo.widgets = alvo.widgets.filter(x => x.id !== id)
  alvo.layout = alvo.layout.filter(x => x.id !== id)
  toast.add({
    title: t.value.toasts.removido(tituloDo(w)),
    icon: 'i-lucide-eye-off',
    actions: [{ label: t.value.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { alvo.widgets = anterior.widgets; alvo.layout = anterior.layout } }],
  })
}

function mover(id: string, passo: -1 | 1) {
  const l = [...layout.value]
  const i = l.findIndex(x => x.id === id)
  const j = i + passo
  if (i < 0 || j < 0 || j >= l.length) return
  ;[l[i], l[j]] = [l[j]!, l[i]!]
  layout.value = l
}

function tamanhoPadrao(id: string) {
  const w = widgetPorId(id)
  if (!w) return
  const d = definicao(w.tipo)
  layout.value = layout.value.map(x => x.id === id ? { ...x, w: d.tamanho.w, h: d.tamanho.h } : x)
}

function restaurar() {
  const anterior = copiaDaHome(minha.value)
  minha.value = copiaDaHome(padrao.value)
  toast.add({
    title: t.value.toasts.restaurada,
    icon: 'i-lucide-rotate-ccw',
    actions: [{ label: t.value.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { minha.value = anterior } }],
  })
}

/* Personalizar: edição na própria Home (rodada 4) */

const editando = ref(false)
const catalogoAberto = ref(false)
let antesDaEdicao: { minha: Home, padrao: Home } | null = null

function entrarNaEdicao(abrirCatalogo = false) {
  if (!editando.value) {
    antesDaEdicao = { minha: copiaDaHome(minha.value), padrao: copiaDaHome(padrao.value) }
    editando.value = true
  }
  catalogoAberto.value = abrirCatalogo
}

function sairDaEdicao() {
  editando.value = false
  catalogoAberto.value = false
  escopo.value = 'minha'
  antesDaEdicao = null
}

/** Cancelar volta as 2 Homes ao que eram ao clicar em Personalizar. */
function cancelarEdicao() {
  if (antesDaEdicao) {
    minha.value = antesDaEdicao.minha
    padrao.value = antesDaEdicao.padrao
  }
  sairDaEdicao()
}

function concluirEdicao() {
  const padraoEditado = escopo.value === 'padrao'
  sairDaEdicao()
  toast.add({ title: padraoEditado ? t.value.toasts.padraoSalvo : t.value.personalizacao.salva, icon: 'i-lucide-circle-check', color: 'success' })
}

const opcoesDeEscopo = computed(() => [
  { label: t.value.personalizacao.minha, value: 'minha', icon: 'i-lucide-user' },
  { label: t.value.personalizacao.padrao, value: 'padrao', icon: 'i-lucide-users' },
])

const posicao = (id: string) => layout.value.findIndex(x => x.id === id)

/* Configurar */

const configAberto = ref(false)
const configId = ref('')
const widgetEmConfig = computed(() => widgetPorId(configId.value))

function abrirConfig(id: string) {
  const w = widgetPorId(id)
  if (!w) return
  if (!configuravel(w)) return
  configId.value = id
  catalogoAberto.value = false
  configAberto.value = true
}

function salvarConfig(config: ConfigDoWidget, novosAtalhos?: Atalho[]) {
  const w = widgetEmConfig.value
  if (!w) return
  w.config = config
  if (novosAtalhos) atalhos.value = novosAtalhos
}

function configuravel(w: Widget) {
  return ['categorias', 'atalhos'].includes(w.tipo)
}
</script>

<template>
  <CascaDaHome :t="t" :slug="SLUG">
    <div class="min-h-0 flex-1 overflow-y-auto pb-28">
      <!-- PROPOSTA: a barra de edição (rodada 4). Fica no topo enquanto a pessoa rola. -->
      <div
        v-if="editando"
        class="sticky top-0 z-30 flex animate-[entrada_0.2s_ease-out_both] flex-wrap items-center gap-x-4 gap-y-2 border-b border-default bg-default/95 px-4 py-2.5 backdrop-blur sm:px-6 lg:px-8 2xl:px-10"
      >
        <div class="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
            <UIcon name="i-lucide-layout-dashboard" class="size-4 text-primary" />
          </span>
          <div class="min-w-0 flex-1 sm:flex-none">
            <p class="text-sm font-semibold text-highlighted">
              {{ t.personalizacao.titulo }}
            </p>
            <p class="hidden truncate text-xs text-muted xl:block">
              {{ t.personalizacao.descricao }}
            </p>
          </div>
          <USelect
            v-if="admin && !mvp"
            v-model="escopo"
            :items="opcoesDeEscopo"
            :icon="escopo === 'padrao' ? 'i-lucide-users' : 'i-lucide-user'"
            size="sm"
            class="w-full shrink-0 sm:w-60"
            :aria-label="t.personalizacao.editando"
          />
        </div>
        <!--
          Rodada 6: "os botões dessa barra estão excessivos... a ordem deles não tá
          muito lógica". Restaurar e Cancelar viram ícone com dica: são os 2 menos
          usados e os 2 que desfazem.

          Rodada 7: Restaurar sai do lado do Adicionar e vai para junto do X (pesquisa
          no PESQUISA.md, "Onde fica o Restaurar padrão"). 3 grupos, por função:
          - montar: Adicionar widget;
          - confirmar: Concluir, o primário;
          - desfazer: Restaurar e o X. O X fica no canto, onde se fecha um modo
            (e à direita do confirmar, como o Cancel no Windows). Restaurar fica
            ao lado dele e separado do Concluir por um divisor, para não ser
            clicado no lugar do primário (NN/g). Não pede confirmação: o aviso
            traz "Desfazer", e o X ainda descarta tudo.
        -->
        <div class="flex items-center gap-1">
          <UButton :label="t.estados.adicionarWidget" icon="i-lucide-plus" color="primary" variant="soft" size="sm" @click="catalogoAberto = true" />
          <span class="mx-1.5 h-5 w-px bg-accented" aria-hidden="true" />
          <UButton :label="t.personalizacao.concluir" icon="i-lucide-check" size="sm" @click="concluirEdicao" />
          <span class="mx-1.5 h-5 w-px bg-accented" aria-hidden="true" />
          <UTooltip v-if="escopo === 'minha'" :text="t.personalizacao.restaurarDica">
            <UButton icon="i-lucide-rotate-ccw" color="neutral" variant="ghost" size="sm" :aria-label="t.personalizacao.restaurar" @click="restaurar" />
          </UTooltip>
          <UTooltip :text="t.personalizacao.cancelarDica">
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.personalizacao.cancelar" @click="cancelarEdicao" />
          </UTooltip>
        </div>
      </div>

      <div class="w-full px-4 py-5 sm:px-6 lg:px-8 2xl:px-10">
        <!-- Aviso da Home padrão (administrador editando) -->
        <UAlert
          v-if="editando && escopo === 'padrao'"
          :title="t.bannerPadrao.titulo"
          :description="t.bannerPadrao.texto"
          icon="i-lucide-users"
          color="primary"
          variant="subtle"
          class="mb-4 animate-[entrada_0.3s_ease-out_both]"
        />

        <!-- Topo: saudação, dia, resumo e Personalizar -->
        <div class="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs font-medium text-muted">
              {{ dataLonga(AGORA, t) }}
            </p>
            <h1 class="text-2xl font-semibold text-highlighted">
              {{ t.saudacao(horaAtual(), EU.nome.split(' ')[0] ?? '') }}
            </h1>
            <p class="mt-0.5 text-sm text-toned">
              {{ resumo }}
            </p>
          </div>
          <div v-if="!editando" class="flex flex-wrap items-center gap-2">
            <!-- PROPOSTA: o escopo das lâminas de tarefas, como em develop (rodada 5); só o administrador vê (rodada 6) -->
            <UTabs
              v-if="admin"
              v-model="escopoDasTarefas"
              :items="opcoesDoEscopoDasTarefas"
              :content="false"
              size="xs"
              :aria-label="t.escopoDeTarefas.rotulo"
            />
            <UButton
              :label="t.personalizar"
              icon="i-lucide-layout-dashboard"
              color="neutral"
              variant="outline"
              size="sm"
              @click="entrarNaEdicao()"
            />
            <!-- PROPOSTA: o botão Criar (rodada 2) -->
            <BotaoCriar
              v-model:open="menuCriarAberto"
              :t="t"
              :categorias="categoriasComAcesso"
              @item="abrirItem"
              @tarefa="abrirTarefa()"
              @beni="pedirAoBeni"
            />
          </div>
        </div>

        <UEmpty
          v-if="estado === 'vazio' || !layout.length"
          icon="i-lucide-layout-dashboard"
          :title="t.estados.vazioTitulo"
          :description="t.estados.vazioTexto"
          :actions="[{ label: t.estados.adicionarWidget, icon: 'i-lucide-plus', color: 'neutral', variant: 'outline', onClick: () => entrarNaEdicao(true) }]"
          variant="outline"
          class="py-16"
        />

        <UxGradeDePaineis
          v-else
          v-model="layout"
          :editavel="editando"
          :limites="limites"
          :rotulos="rotulos"
          :textos="textosDaGrade"
        >
          <template #default="{ item }">
            <template v-for="w in [widgetPorId(item.id)]" :key="item.id">
              <WidgetMoldura
                v-if="w"
                :t="t"
                :titulo="tituloDo(w)"
                :subtitulo="subtituloDo(w)"
                :icone="definicao(w.tipo).icone"
                :estado="estadoDo(w)"
                :categoria-sem-acesso="categoriaSemAcessoDo(w)"
                :configuravel="configuravel(w)"
                :novo="w.novo && escopo === 'minha' && !mvp"
                :editando="editando"
                :primeiro="posicao(w.id) === 0"
                :ultimo="posicao(w.id) === layout.length - 1"
                @subir="mover(w.id, -1)"
                @descer="mover(w.id, 1)"
                @configurar="abrirConfig(w.id)"
                @tamanho-padrao="tamanhoPadrao(w.id)"
                @remover="remover(w.id)"
                @tentar-de-novo="tentarDeNovo(w.id)"
              >
                <template v-if="w.tipo === 'categorias'" #acoes>
                  <UTooltip :text="t.categoriasW.verTodas">
                    <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="xs" :aria-label="t.categoriasW.verTodas" @click="abrirMaquete(t.categoriasW.verTodas)" />
                  </UTooltip>
                </template>
                <template v-else-if="definicao(w.tipo).segueEscopo" #acoes>
                  <UTooltip :text="t.laminas.abrirPainel">
                    <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="xs" :aria-label="t.laminas.abrirPainel" @click="abrirMaquete(t.laminas.abrirPainel)" />
                  </UTooltip>
                </template>
                <template v-else-if="['agenda', 'agendaSemana', 'agendaMes'].includes(w.tipo)" #acoes>
                  <UTooltip :text="t.agenda.abrir">
                    <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="xs" :aria-label="t.agenda.abrir" @click="abrirMaquete(t.agenda.abrir)" />
                  </UTooltip>
                </template>
                <template v-else-if="definicao(w.tipo).grupo === 'spaceflow' && estadoDo(w) === 'ok'" #acoes>
                  <UTooltip :text="t.spaceflowW.abrirSpaceflow">
                    <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="xs" :aria-label="t.spaceflowW.abrirSpaceflow" @click="abrirMaquete(t.spaceflowW.abrirSpaceflow)" />
                  </UTooltip>
                </template>
                <template v-else-if="w.tipo === 'email'" #acoes>
                  <UTooltip :text="t.comunicacaoW.abrirEmails">
                    <UButton icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="xs" :aria-label="t.comunicacaoW.abrirEmails" @click="abrirMaquete(t.comunicacaoW.abrirEmails)" />
                  </UTooltip>
                </template>
                <template v-else-if="w.tipo === 'beni'" #acoes>
                  <UBadge :label="t.ehMaquete" color="warning" variant="subtle" size="sm" />
                </template>

                <WCategorias
                  v-if="w.tipo === 'categorias'"
                  :t="t"
                  :categorias="categoriasDo(w)"
                  :admin="admin"
                  @acessar="(c) => abrirMaquete(c.name)"
                  @criar="abrirItem"
                  @criar-categoria="abrirMaquete(t.vazios.criarCategoria)"
                />

                <WMinhasTarefas
                  v-else-if="w.tipo === 'minhasTarefas'"
                  :t="t"
                  :tarefas="tarefas"
                  :eu="EU.id"
                  @concluir="concluirTarefa"
                  @criar="criarTarefaNaAba"
                  @abrir="(x) => abrirMaquete(x.name)"
                  @ver-todas="abrirMaquete(t.casca.itens.rapidas ?? '')"
                />

                <WLamina
                  v-else-if="ehLamina(w)"
                  :t="t"
                  :tipo="w.tipo as LaminaDeTarefas"
                  :tarefas="tarefasDoEscopo"
                  :serie="serieDoEscopo"
                  @abrir="abrirMaquete"
                />

                <WListas
                  v-else-if="['atalhos', 'recentes', 'agenda', 'tarefasDelegadas'].includes(w.tipo)"
                  :t="t"
                  :tipo="w.tipo as 'atalhos' | 'recentes' | 'agenda' | 'tarefasDelegadas'"
                  :atalhos="atalhos"
                  :recentes="recentes"
                  :eventos="agendaDeHoje"
                  :delegadas="tarefas.filter(x => x.origem === 'rapida' && x.creator === EU.id && x.assigned_to !== EU.id && x.status !== 'completed')"
                  :largura="item.w"
                  @abrir="abrirMaquete"
                  @configurar="abrirConfig(w.id)"
                />

                <WAgenda
                  v-else-if="w.tipo === 'agendaSemana' || w.tipo === 'agendaMes'"
                  :t="t"
                  :tipo="w.tipo"
                  :eventos="agendaCompleta"
                  @abrir="abrirMaquete"
                />

                <WItens
                  v-else-if="['meusItens', 'ultimosItens', 'itensPorCategoria'].includes(w.tipo)"
                  :t="t"
                  :tipo="w.tipo as 'meusItens' | 'ultimosItens' | 'itensPorCategoria'"
                  :itens="itensComAcesso"
                  :recem-criados="recemCriados"
                  @abrir="abrirMaquete"
                />

                <WBeni
                  v-else-if="w.tipo === 'beni'"
                  :t="t"
                  :beni="beni"
                  @conversar="pedirAoBeni('')"
                />

                <WIa
                  v-else-if="w.tipo === 'agentesIa'"
                  :t="t"
                  :agentes="agentes"
                  :admin="admin"
                  @conversar="(a) => pedirAoBeni('', a.slug === 'beni' ? null : a)"
                  @abrir="abrirMaquete"
                />

                <WSpaceflow
                  v-else-if="definicao(w.tipo).grupo === 'spaceflow'"
                  :t="t"
                  :tipo="w.tipo as 'execucoesFluxos' | 'falhasFluxos' | 'fluxosAndamento'"
                  :execucoes="fluxos"
                  :metricas="metricas"
                  @repetir="repetirFluxo"
                  @abrir="abrirMaquete"
                />

                <WComunicacao
                  v-else-if="definicao(w.tipo).grupo === 'comunicacao'"
                  :t="t"
                  :tipo="w.tipo as 'email' | 'whatsappSms'"
                  :emails="emails"
                  @abrir="abrirMaquete"
                />

                <WOutros
                  v-else
                  v-model:nota="nota"
                  :t="t"
                  :tipo="w.tipo as 'saudeDosPrazos' | 'graficoDePainel' | 'notas' | 'comunicado'"
                  :tarefas="tarefasDoEscopo"
                  :comunicado="comunicado ?? undefined"
                  :pode-editar-comunicado="admin"
                  :beni="beni"
                  :sem-dados="estado === 'workspaceVazio'"
                  @abrir="abrirMaquete"
                  @salvar-comunicado="salvarComunicado"
                />
              </WidgetMoldura>
            </template>
          </template>
        </UxGradeDePaineis>
      </div>
    </div>

    <Catalogo
      v-model:open="catalogoAberto"
      :t="t"
      :na-home="tiposNaHome"
      :admin="admin"
      :escopo="escopo"
      :categorias="categoriasComAcesso"
      :categorias-escolhidas="widgetDeCategorias?.config.categorias"
      :mvp="mvp"
      @adicionar="(tipo) => adicionar(tipo)"
      @categorias="aplicarCategorias"
    />

    <ConfigurarWidget
      v-model:open="configAberto"
      :t="t"
      :tipo="widgetEmConfig?.tipo"
      :config="widgetEmConfig?.config"
      :categorias="categoriasComAcesso"
      :atalhos="atalhos"
      @salvar="salvarConfig"
    />

    <ModalNovaTarefa v-model:open="tarefaAberta" :t="t" :inicial="tarefaInicial" @criar="(d) => criarTarefa(d)" />
    <ModalNovoItem
      v-model:open="novoItemAberto"
      :t="t"
      :categoria="categoria(itemEmCriacao.categoria)"
      :formulario="itemEmCriacao.formulario"
      :inicial="itemEmCriacao.inicial"
      @criar="criarItem"
    />

    <ChatDoBeni
      v-model:open="chatAberto"
      :t="t"
      :nome="EU.nome.split(' ')[0] ?? ''"
      :categorias="categoriasComAcesso"
      :resumo="beni.linhas"
      :pedido="pedidoAoBeni"
      :agente="agenteDoChat"
      :criar-tarefa="(d) => criarTarefa(d, true) ?? ''"
      :criar-item="(slug, _formulario, d) => criarItemEm(slug, d, true) ?? ''"
      @revisar-tarefa="abrirTarefa"
      @revisar-item="abrirItem"
      @abrir="abrirMaquete"
      @tela-cheia="abrirMaquete(t.beniChat.titulo)"
    />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
          Protótipo · estado
        </span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado === e.valor ? 'primary' : 'neutral'"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="escolherEstado(e.valor)"
        />

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Versão</span>
        <UTooltip text="O MVP mostra Categorias e tarefas, só com o que o develop já tem (DECISOES.md, rodada 10)">
          <span class="flex gap-2">
            <UButton
              v-for="v in [{ v: 'completa', r: 'Proposta completa' }, { v: 'mvp', r: 'MVP' }] as const"
              :key="v.v"
              :label="v.r"
              size="xs"
              class="transition-transform hover:-translate-y-0.5"
              :color="versao === v.v ? 'primary' : 'neutral'"
              :variant="versao === v.v ? 'solid' : 'subtle'"
              @click="escolherVersao(v.v)"
            />
          </span>
        </UTooltip>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Ver como</span>
        <UButton
          v-for="p in [{ v: 'membro', r: 'Membro' }, { v: 'admin', r: 'Administrador' }] as const"
          :key="p.v"
          :label="p.r"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="papel === p.v ? 'primary' : 'neutral'"
          :variant="papel === p.v ? 'solid' : 'subtle'"
          @click="papel = p.v"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/home"
          />
        </span>
      </div>
    </div>
  </CascaDaHome>
</template>
