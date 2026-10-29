/**
 * Estado da Agenda: o que está carregado, as camadas ligadas, a configuração das fontes e as regras de cada gesto.
 *
 * Tudo em memória: o reload zera (regra 4). Os eventos da grade são derivados daqui; o `UxCalendario` só desenha.
 *
 * As 3 regras que a redatora aprovou em 28/10/2026:
 *  1. tarefa com SLA não muda de prazo ao arrastar: ganha um bloco de trabalho; item e tarefa sem SLA mudam de data;
 *  2. a agenda da equipe fica para a rodada 2 (aqui o filtro de responsável só lê tarefas e itens);
 *  3. a agenda do item é uma aba do painel lateral que abre na própria Agenda.
 *
 * Rodada 2 (29/10/2026): a permissão decide o que aparece (a Agenda não oferece o gesto que vai falhar), o fluxo no
 * campo de data pede confirmação e perde o Desfazer, a criação leva ao formulário quando faltam obrigatórios, e o
 * vínculo pode falhar (`falharVinculo`, do andaime) para mostrar o "Ligar de novo".
 *
 * Ajuste da rodada 2: as tarefas atribuídas a cada pessoa entram na Agenda pelo prazo, por uma configuração do
 * workspace (`tarefasNaAgenda`, ligada por padrão). O painel "Para agendar" virou "Sem data": só as tarefas que não têm
 * prazo e por isso não aparecem na grade.
 *
 * Modelagem da rodada 2 (29/10/2026, pedido da redatora depois do diagrama de entidades):
 *  - o vínculo é uma entidade (`Vinculo`), do workspace, pela chave da reunião no Outlook (`uid`); liga a reunião a
 *    um item ou a uma tarefa, e a reunião agendada para a tarefa é da tarefa (o item a vê pela tarefa);
 *  - a série se liga inteira, com a opção "Só esta"; a reunião cancelada sai da grade e fica no histórico;
 *  - o bloco tem dono: cada pessoa reserva o próprio horário, e mudar o responsável oferece o horário futuro a quem
 *    entra, que aceita ou recusa;
 *  - uma categoria pode ter várias fontes (uma por campo de data), com data de fim e o campo de pessoa que diz de
 *    quem é o item.
 */
import type { CorDoCalendario, EventoDoCalendario, Lugar } from '~/components/ux/geometriaDoCalendario'
import { AGORA, HOJE, diasEntre, hora, somarDias } from './datas'
import type { Alvo, Cor, IdDoCalendario, ItemDaAgenda, Provedor, Reuniao, SlugDaCategoria, TarefaDaAgenda, Vinculo } from './mocks'
import { blocosIniciais, calendarios, categoriaPorSlug, EU, itens, reunioesIniciais, tarefasIniciais, vinculosIniciais } from './mocks'

export type Vista = 'dia' | 'semana' | 'mes' | 'lista'
export type Cenario = 'normal' | 'primeiro' | 'falha' | 'vazia' | 'carregando'
/** 'tarefas', 'rapidas', o id de uma fonte (`contratos:fim_vigencia`) ou o de um calendário ('meu', 'juridico'). */
export type Camada = string

/** PROTÓTIPO: a fonte de categoria: um campo de data e, opcionalmente, data de fim, horas e o campo de responsável. */
export interface Fonte {
  /** Uma categoria pode ter mais de uma fonte, uma por campo de data: `<categoria>:<campo>`. */
  id: string
  slug: SlugDaCategoria
  ativa: boolean
  campo: string
  /** A data de fim: o item ocupa do campo até ela, de dia inteiro. */
  campoFim: string | null
  horaInicio: string | null
  horaFim: string | null
  /** O campo de pessoa que diz de quem é o item, para o filtro de responsável. Sem ele, todos veem o item. */
  campoResponsavel: string | null
  cor: Cor
}

export const novaFonte = (slug: SlugDaCategoria, campo: string, cor: Cor, extra: Partial<Fonte> = {}): Fonte =>
  ({ id: `${slug}:${campo}`, slug, ativa: true, campo, campoFim: null, horaInicio: null, horaFim: null, campoResponsavel: null, cor, ...extra })

const fontesIniciais = (): Fonte[] => [
  novaFonte('contratos', 'fim_vigencia', 'warning', { campoResponsavel: 'responsavel' }),
  novaFonte('contratos', 'assinatura', 'primary', { campoResponsavel: 'responsavel' }),
  novaFonte('processos', 'audiencia', 'success', { horaInicio: 'audiencia_inicio', horaFim: 'audiencia_fim', campoResponsavel: 'responsavel' }),
  novaFonte('clientes', 'proxima_visita', 'neutral', { campoFim: 'fim_visita' }),
  // O campo saiu do formulário de Clientes depois de a fonte existir: a fonte não mostra nada e a configuração avisa.
  novaFonte('clientes', 'ultima_reuniao', 'info'),
]

/**
 * Os calendários externos que a Agenda conecta. O Google fica pronto na tela e desligado (`disponivel: false`) até a
 * integração existir (pedido da redatora em 29/10/2026): ligar é trocar a flag e ligar a janela do Google.
 */
export const PROVEDORES: { id: Provedor, icone: string, disponivel: boolean }[] = [
  { id: 'outlook', icone: 'i-simple-icons-microsoftoutlook', disponivel: true },
  { id: 'google', icone: 'i-simple-icons-googlecalendar', disponivel: false },
]
export const provedoresEmBreve = PROVEDORES.filter(p => !p.disponivel)

/** Os calendários que a conexão traz, com a cor de cada um. Vale para qualquer provedor. */
export const calendario = (id?: IdDoCalendario) => calendarios.find(c => c.id === id)
export const corDoCalendario = (id?: IdDoCalendario): CorDoCalendario => calendario(id)?.cor ?? 'neutral'

const inicial = () => ({
  vista: 'semana' as Vista,
  data: HOJE,
  cenario: 'normal' as Cenario,
  /** A conexão com o Outlook (o único provedor ligado). Cada calendário dela vem em `calendarios`. */
  outlook: 'conectado' as 'conectado' | 'desconectado' | 'falha',
  tarefas: tarefasIniciais(),
  reunioes: reunioesIniciais(),
  vinculos: vinculosIniciais(),
  blocos: blocosIniciais(),
  itens: structuredClone(itens) as ItemDaAgenda[],
  fontes: fontesIniciais(),
  camadas: Object.fromEntries([
    'tarefas', 'rapidas', 'meu', 'juridico',
    ...fontesIniciais().map(f => f.id),
  ].map(c => [c, true])) as Record<Camada, boolean>,
  responsaveis: [EU.id] as number[],
  /** Configuração do workspace: as tarefas atribuídas a cada pessoa entram na Agenda dela pelo prazo. */
  tarefasNaAgenda: true,
  /** "Agendar reunião" no painel do item: a próxima criação já nasce ligada a este item. */
  agendandoPara: null as number | null,
  /** Andaime: a próxima reunião criada já ligada a um item perde o vínculo (a 2ª chamada falha). */
  falharVinculo: false,
})

export const estado = reactive(inicial())

export function escolherCenario(c: Cenario) {
  Object.assign(estado, inicial(), { cenario: c, vista: estado.vista, data: estado.data })
  if (c === 'primeiro') {
    estado.outlook = 'desconectado'
    estado.fontes.forEach(f => (f.ativa = false))
  }
  if (c === 'falha') estado.outlook = 'falha'
}

export function reiniciar() {
  Object.assign(estado, inicial())
}

/* ---------------- consultas ---------------- */
export const diaDe = (d: Date) => d.toISOString().slice(0, 10)
export const minutoDe = (d: Date) => d.getUTCHours() * 60 + d.getUTCMinutes()
const quando = (dia: string, min: number) => new Date(`${dia}T${hora(min)}:00Z`)
const jaPassou = (dia: string, fim: number) => dia < HOJE || (dia === HOJE && fim <= AGORA)

/**
 * A chave do evento na grade: `<tipo>:<id>`. O item leva o campo da fonte (`i:47231:fim_vigencia`), porque uma
 * categoria tem várias fontes; o pedaço de um evento de vários dias leva o dia (`r:r-congresso@2026-11-05`).
 */
export function lerChave(chave: string) {
  const [base = '', pedaco] = chave.split('@')
  const [tipo = '', id = '', campo] = base.split(':')
  return { base, tipo, id, campo, pedaco }
}

export const tarefa = (id: number) => estado.tarefas.find(t => t.id === id)
export const item = (id: number | null | undefined) => estado.itens.find(i => i.id === id) ?? null
export const reuniao = (id: string) => estado.reunioes.find(r => r.id === id)
export const bloco = (id: string) => estado.blocos.find(b => b.id === id)
/** A fonte principal da categoria (a primeira ligada): é a data que a criação de item preenche. */
export const fonte = (slug: string) => estado.fontes.find(f => f.slug === slug && f.ativa) ?? estado.fontes.find(f => f.slug === slug)
/** A fonte do evento de item: a do campo da chave. */
export const fonteDoEvento = (i: ItemDaAgenda, campo?: string) => (campo && estado.fontes.find(f => f.slug === i.categoria && f.campo === campo)) || fonte(i.categoria)
export const rotuloDoCampo = (slug: SlugDaCategoria, campo: string) => categoriaPorSlug(slug).campos.find(c => c.chave === campo)?.rotulo

/** Prazo que vem do SLA do fluxo: não se arrasta. A tarefa rápida e a do fluxo sem prazo mudam de data. */
export const temSla = (t: TarefaDaAgenda) => t.origem === 'fluxo' && !!t.due_date

export type Situacao = 'concluida' | 'atrasada' | 'hoje' | 'no-prazo' | 'sem-prazo'
export function situacao(t: TarefaDaAgenda): Situacao {
  if (t.status === 'completed') return 'concluida'
  if (!t.due_date) return 'sem-prazo'
  const d = diaDe(t.due_date)
  if (d < HOJE || (d === HOJE && minutoDe(t.due_date) < AGORA)) return 'atrasada'
  return d === HOJE ? 'hoje' : 'no-prazo'
}

/* ---------------- o que a pessoa pode fazer ----------------
 * A Agenda não oferece o gesto que vai falhar: sem permissão, o evento não se arrasta, o botão não aparece e a
 * categoria some da criação. O popover diz o motivo numa linha. */
export const ehMinha = (t: TarefaDaAgenda) => t.assigned_to === EU.id
/** Colaborador da tarefa (`collaborators`): vê na Agenda e reserva o próprio horário; não conclui. */
export const colaboro = (t: TarefaDaAgenda) => !!t.collaborators?.includes(EU.id)
export const participo = (t: TarefaDaAgenda) => ehMinha(t) || colaboro(t)
export const podeVerItem = (i: ItemDaAgenda) => categoriaPorSlug(i.categoria).permissao.ver
export const podeEditarItem = (i: ItemDaAgenda) => categoriaPorSlug(i.categoria).permissao.editar && !i.somenteLeitura
export const podeCriarEm = (slug: SlugDaCategoria) => categoriaPorSlug(slug).permissao.criar
/** O Outlook só deixa o organizador mudar o horário. */
export const ehOrganizador = (r: Reuniao) => r.organizador === EU.email
export const organizador = (r: Reuniao) => r.participantes.find(p => p.email === r.organizador)?.nome ?? r.organizador
export const souParticipante = (r: Reuniao) => r.participantes.some(p => p.email === EU.email)
/** Particular para quem não participa: o vínculo fica, o título não aparece. */
export const tituloOculto = (r: Reuniao) => !!r.particular && !souParticipante(r)
export const meuBloco = (b: { dono: number, oferecidoA?: number }) => b.dono === EU.id && !b.oferecidoA
/** O fluxo que roda quando a data da fonte muda: o gesto pede confirmação e perde o Desfazer. */
export const fluxoDoCampo = (i: ItemDaAgenda, campo?: string) => {
  const c = categoriaPorSlug(i.categoria)
  return c.fluxo && c.fluxo.campo === (campo ?? fonte(i.categoria)?.campo) ? c.fluxo : null
}

/** De quem é o item, pelo campo de pessoa da fonte. Sem o campo na fonte, o item é de todos (null). */
export function responsavelDo(i: ItemDaAgenda, f = fonte(i.categoria)) {
  const v = f?.campoResponsavel ? i.data[f.campoResponsavel] : undefined
  return typeof v === 'number' ? v : null
}

const visivel = (responsavel: number) => !estado.responsaveis.length || estado.responsaveis.includes(responsavel)
const tarefaVisivel = (t: TarefaDaAgenda) => (t.assigned_to != null && visivel(t.assigned_to)) || !!t.collaborators?.some(visivel)
export const fontesAtivas = computed(() => estado.fontes.filter(f => f.ativa))
export const outlookNaTela = computed(() => estado.outlook === 'conectado')
/** A fonte aponta para um campo que saiu do formulário da categoria. */
export const campoSumiu = (f: Fonte) => !categoriaPorSlug(f.slug).campos.some(c => c.chave === f.campo)

/* ---------------- domínio do e-mail ----------------
 * A sugestão de vínculo cruza o domínio dos participantes de fora com o dos campos de e-mail do item. Domínio de
 * e-mail pessoal e o da própria empresa não contam: não dizem de que cliente é a reunião. */
const DOMINIOS_PUBLICOS = ['gmail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'icloud.com', 'uol.com.br', 'bol.com.br']
export const DOMINIO_DA_EMPRESA = 'aurora.example'
export const dominioDe = (email: string) => email.split('@')[1]?.toLowerCase() ?? ''
const contaComoDominio = (d: string) => !!d && d !== DOMINIO_DA_EMPRESA && !DOMINIOS_PUBLICOS.includes(d)
export function dominiosDo(i: ItemDaAgenda) {
  return categoriaPorSlug(i.categoria).campos
    .filter(c => c.tipo === 'email')
    .map(c => i.data[c.chave])
    .filter((v): v is string => typeof v === 'string')
    .map(dominioDe)
    .filter(contaComoDominio)
}
/** O primeiro item que a pessoa pode editar com o domínio de um destes e-mails, fora os excluídos. */
export function itemDoDominio(emails: string[], excluir: (i: ItemDaAgenda) => boolean = () => false) {
  const dominios = emails.map(dominioDe).filter(contaComoDominio)
  if (!dominios.length) return null
  return estado.itens.find(i => podeEditarItem(i) && !excluir(i) && dominiosDo(i).some(d => dominios.includes(d))) ?? null
}

/* ---------------- vínculos ---------------- */
const daReuniao = (v: Vinculo, r: Reuniao) => v.serie ? !!r.serie && v.reuniao === r.serie : v.reuniao === r.uid
const mesmoAlvo = (a: Alvo, b: Alvo) => a.tipo === b.tipo && a.id === b.id
export const vinculosDa = (r: Reuniao, comRecusados = false) => estado.vinculos.filter(v => (comRecusados || v.estado === 'ligado') && daReuniao(v, r))
const alvoVisivel = (a: Alvo) => {
  if (a.tipo === 'tarefa') return !!tarefa(a.id)
  const i = item(a.id)
  return !!i && podeVerItem(i)
}
/** Os vínculos da reunião que a pessoa vê, e quantos ela não vê (item de categoria que ela não tem permissão de ver). */
export function ligacoesDa(r: Reuniao) {
  const todos = vinculosDa(r)
  const vinculos = todos.filter(v => alvoVisivel(v.alvo))
  return { vinculos, semAcesso: todos.length - vinculos.length }
}
export const itensDa = (r: Reuniao) => ligacoesDa(r).vinculos.filter(v => v.alvo.tipo === 'item').map(v => item(v.alvo.id)!)

/**
 * Liga a reunião a um item ou a uma tarefa, para o workspace inteiro. A recorrente liga a série (o padrão), ou só
 * esta ocorrência. Religar o que foi recusado vira ligado.
 */
export function ligar(r: Reuniao, alvo: Alvo, origem: Vinculo['origem'] = 'manual', serie = !!r.serie) {
  const naSerie = serie && !!r.serie
  const chave = naSerie ? r.serie! : r.uid
  const ja = estado.vinculos.find(v => v.reuniao === chave && mesmoAlvo(v.alvo, alvo))
  if (ja) return Object.assign(ja, { estado: 'ligado', origem, por: EU.id, em: HOJE })
  estado.vinculos.push({ id: `v-${++sequencia}`, reuniao: chave, serie: naSerie, alvo, estado: 'ligado', origem, por: EU.id, em: HOJE })
}
/** Desligar o que a sugestão ligou guarda a recusa: a mesma sugestão não volta para esta reunião. */
export function desligar(v: Vinculo) {
  if (v.origem === 'sugestao') v.estado = 'recusado'
  else estado.vinculos = estado.vinculos.filter(x => x.id !== v.id)
}
export function recusarSugestao(r: Reuniao, itemId: number) {
  estado.vinculos.push({ id: `v-${++sequencia}`, reuniao: r.uid, serie: false, alvo: { tipo: 'item', id: itemId }, estado: 'recusado', origem: 'sugestao', por: EU.id, em: HOJE })
}

/** A sugestão de vínculo: um participante de fora com o domínio de um item ainda não ligado nem recusado. */
export function sugestao(r: Reuniao): ItemDaAgenda | null {
  if (r.particular || r.cancelada) return null
  const tocados = vinculosDa(r, true).filter(v => v.alvo.tipo === 'item').map(v => v.alvo.id)
  return itemDoDominio(r.participantes.map(p => p.email), i => tocados.includes(i.id))
}

/** O e-mail do participante que levou à sugestão, para o popover dizer de onde ela veio. */
export const quemSugere = (r: Reuniao, i: ItemDaAgenda) => r.participantes.find(p => dominiosDo(i).includes(dominioDe(p.email)))?.email ?? ''

const porHorario = (a: Reuniao, b: Reuniao) => (a.dia + hora(a.inicio ?? 0)).localeCompare(b.dia + hora(b.inicio ?? 0))
/** A mesma reunião em 2 calendários (o da pessoa e um compartilhado) tem o mesmo uid: conta uma vez só. */
const semRepetir = <T>(lista: T[], uid: (x: T) => string) => lista.filter((x, i) => lista.findIndex(y => uid(y) === uid(x)) === i)

export interface ReuniaoLigada { r: Reuniao, v: Vinculo, pela?: TarefaDaAgenda }
/** As reuniões do item: as ligadas a ele e as das tarefas dele (item → tarefa → reunião). */
export function reunioesDo(itemId: number): ReuniaoLigada[] {
  const lista: ReuniaoLigada[] = []
  for (const r of estado.reunioes) {
    for (const v of vinculosDa(r)) {
      const t = v.alvo.tipo === 'tarefa' ? tarefa(v.alvo.id) : undefined
      if (v.alvo.tipo === 'item' && v.alvo.id === itemId) lista.push({ r, v })
      else if (t?.item === itemId) lista.push({ r, v, pela: t })
    }
  }
  return semRepetir(lista, x => x.r.uid).sort((a, b) => porHorario(a.r, b.r))
}
export const reunioesDaTarefa = (id: number) => semRepetir(estado.reunioes.filter(r => vinculosDa(r).some(v => v.alvo.tipo === 'tarefa' && v.alvo.id === id)), r => r.uid).sort(porHorario)

/** A hora da reunião no fuso de quem organizou. A grade fica no de Brasília (UTC-3, sem horário de verão). */
export function noFuso(r: Reuniao, min: number, locale: string) {
  const d = new Date(`${r.dia}T${hora(min)}:00-03:00`)
  return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: r.fuso }).format(d)
}
/** O nome do fuso no idioma da tela ("Horário da Europa Ocidental"), como o Outlook mostra; o nome da cidade do IANA vem em inglês. */
export function nomeDoFuso(r: Reuniao, locale: string) {
  const d = new Date(`${r.dia}T12:00:00-03:00`)
  return new Intl.DateTimeFormat(locale, { timeZone: r.fuso, timeZoneName: 'longGeneric' }).formatToParts(d).find(p => p.type === 'timeZoneName')?.value ?? r.fuso!
}

export const blocosDa = (tarefaId: number) => estado.blocos.filter(b => b.tarefaId === tarefaId)

/* ---------------- eventos da grade ---------------- */
/** O evento de vários dias vira um pedaço por dia, na faixa de dia inteiro. */
function pedacos(base: string, dia: string, diaFim?: string | null) {
  if (!diaFim || diaFim <= dia) return [{ id: base, dia }]
  return Array.from({ length: diasEntre(dia, diaFim) + 1 }, (_, n) => somarDias(dia, n)).map(d => ({ id: `${base}@${d}`, dia: d }))
}

export const eventos = computed<EventoDoCalendario[]>(() => {
  if (estado.cenario === 'vazia') return []
  const c = estado.camadas
  const lista: EventoDoCalendario[] = []

  for (const t of estado.tarefasNaAgenda ? estado.tarefas : []) {
    const camada = t.origem === 'fluxo' ? 'tarefas' : 'rapidas'
    if (!t.due_date || !c[camada] || !tarefaVisivel(t)) continue
    const s = situacao(t)
    lista.push({
      id: `${t.origem === 'fluxo' ? 't' : 'q'}:${t.id}`,
      titulo: t.name,
      dia: diaDe(t.due_date),
      cor: t.origem === 'fluxo' ? 'primary' : 'neutral',
      estilo: 'marcador',
      icone: colaboro(t) ? 'i-lucide-users' : t.origem === 'fluxo' ? 'i-lucide-flag' : 'i-lucide-clipboard-check',
      rotuloHora: hora(minutoDe(t.due_date)),
      riscado: s === 'concluida',
      alerta: s === 'atrasada' ? 'atrasado' : s === 'hoje' ? 'risco' : undefined,
      arrastavel: s !== 'concluida' && (ehMinha(t) || (temSla(t) && colaboro(t))),
      vaiParaAGrade: true,
    })
  }

  if (c.tarefas && estado.tarefasNaAgenda) {
    for (const b of estado.blocos) {
      const t = tarefa(b.tarefaId)
      if (!t || !(visivel(b.dono) || (b.oferecidoA !== undefined && visivel(b.oferecidoA)))) continue
      const meu = meuBloco(b)
      lista.push({ id: `b:${b.id}`, titulo: t.name, dia: b.dia, inicio: b.inicio, fim: b.fim, cor: 'primary', estilo: 'contorno', icone: b.oferecidoA ? 'i-lucide-user-plus' : 'i-lucide-timer', riscado: t.status === 'completed', passado: jaPassou(b.dia, b.fim), arrastavel: meu, redimensionavel: meu })
    }
  }

  for (const f of fontesAtivas.value) {
    if (!c[f.id]) continue
    const cat = categoriaPorSlug(f.slug)
    for (const i of estado.itens) {
      const dia = i.data[f.campo]
      if (i.categoria !== f.slug || typeof dia !== 'string' || !podeVerItem(i)) continue
      const resp = responsavelDo(i, f)
      if (resp !== null && !visivel(resp)) continue
      const diaFim = f.campoFim ? i.data[f.campoFim] as string | undefined : undefined
      const ini = f.horaInicio && !diaFim ? i.data[f.horaInicio] as number | undefined : undefined
      const fim = f.horaFim ? i.data[f.horaFim] as number | undefined : undefined
      for (const p of pedacos(`i:${i.id}:${f.campo}`, dia, diaFim)) {
        lista.push({ id: p.id, titulo: `${i.reference} · ${i.titulo}`, dia: p.dia, inicio: ini, fim: ini === undefined ? undefined : fim ?? ini + 60, cor: f.cor, icone: cat.icon ?? undefined, passado: jaPassou(diaFim ?? p.dia, fim ?? 1440), arrastavel: podeEditarItem(i), redimensionavel: ini !== undefined && podeEditarItem(i) })
      }
    }
  }

  if (outlookNaTela.value) {
    // O calendário da pessoa vem antes do compartilhado: a reunião que está nos 2 aparece uma vez, com a cor dela.
    const minhas = estado.reunioes.filter(r => r.calendario && c[r.calendario] && !r.cancelada).sort((a, b) => Number(b.calendario === 'meu') - Number(a.calendario === 'meu'))
    for (const r of semRepetir(minhas, x => x.uid)) {
      const ligada = ligacoesDa(r).vinculos.length > 0
      for (const p of pedacos(`r:${r.id}`, r.dia, r.diaFim)) {
        lista.push({ id: p.id, titulo: r.titulo, dia: p.dia, inicio: r.inicio, fim: r.fim, cor: corDoCalendario(r.calendario), icone: r.particular ? 'i-lucide-lock' : ligada ? 'i-lucide-link-2' : r.serie ? 'i-lucide-repeat' : undefined, passado: jaPassou(r.diaFim ?? p.dia, r.fim ?? 1440), arrastavel: ehOrganizador(r), redimensionavel: r.inicio !== undefined && ehOrganizador(r) })
      }
    }
  }
  return lista
})

/* ---------------- tarefas sem data ---------------- */
/** As tarefas da pessoa sem prazo: não têm lugar na grade, então ficam no painel "Sem data". */
export const semData = computed(() => estado.cenario === 'vazia' || !estado.tarefasNaAgenda
  ? []
  : estado.tarefas.filter(t => !t.due_date && t.status !== 'completed' && tarefaVisivel(t)))

/* ---------------- gestos ---------------- */
let sequencia = 9000

export type Efeito =
  | { tipo: 'reuniao', titulo: string, dia: string, inicio?: number }
  | { tipo: 'bloco', titulo: string, dia: string, inicio?: number, outlook: boolean }
  | { tipo: 'reservado', titulo: string, prazo: Date }
  | { tipo: 'prazo', titulo: string, prazo: Date }
  | { tipo: 'item', referencia: string, campo: string, dia: string, inicio?: number, fluxo?: string }
  | { tipo: 'sla', titulo: string }

/** Aplica um arraste (de dentro da grade ou do painel Sem data). A chave é a do evento (`lerChave`). */
export function aplicar(chave: string, l: Lugar): Efeito | null {
  const { tipo, id, campo, pedaco } = lerChave(chave)
  // O pedaço de um evento de vários dias leva o evento inteiro: o deslocamento é o do pedaço arrastado.
  const desloca = (dia: string) => diasEntre(pedaco ?? dia, l.dia)

  if (tipo === 'r') {
    const r = reuniao(id)!
    if (!ehOrganizador(r)) return null
    if (r.diaFim) {
      const d = desloca(r.dia)
      Object.assign(r, { dia: somarDias(r.dia, d), diaFim: somarDias(r.diaFim, d) })
    }
    else Object.assign(r, { dia: l.dia, inicio: l.inicio, fim: l.fim })
    return { tipo: 'reuniao', titulo: r.titulo, dia: r.dia, inicio: r.inicio }
  }
  if (tipo === 'b') {
    const b = bloco(id)!
    if (!meuBloco(b)) return null
    Object.assign(b, { dia: l.dia, inicio: l.inicio ?? b.inicio, fim: l.fim ?? b.fim })
    return { tipo: 'bloco', titulo: tarefa(b.tarefaId)!.name, dia: b.dia, inicio: b.inicio, outlook: !!b.eventoExterno }
  }
  if (tipo === 't' || tipo === 'q') {
    const t = tarefa(Number(id))!
    if (t.status === 'completed') return null
    if (temSla(t)) {
      if (!participo(t)) return null
      if (l.inicio === undefined) return { tipo: 'sla', titulo: t.name }
      reservar(t.id, l.dia, l.inicio, l.fim ?? l.inicio + 60, false)
      return { tipo: 'reservado', titulo: t.name, prazo: t.due_date! }
    }
    if (!ehMinha(t)) return null
    t.due_date = quando(l.dia, l.inicio ?? (t.due_date ? minutoDe(t.due_date) : 18 * 60))
    return { tipo: 'prazo', titulo: t.name, prazo: t.due_date }
  }
  if (tipo === 'i') {
    const i = item(Number(id))!
    if (!podeEditarItem(i)) return null
    const f = fonteDoEvento(i, campo)!
    const fimAtual = f.campoFim ? i.data[f.campoFim] : undefined
    if (typeof fimAtual === 'string') {
      const d = desloca(String(i.data[f.campo]))
      i.data[f.campo] = somarDias(String(i.data[f.campo]), d)
      i.data[f.campoFim!] = somarDias(fimAtual, d)
    }
    else i.data[f.campo] = l.dia
    if (f.horaInicio && l.inicio !== undefined) {
      i.data[f.horaInicio] = l.inicio
      if (f.horaFim) i.data[f.horaFim] = l.fim ?? l.inicio + 60
    }
    const rotulo = rotuloDoCampo(i.categoria, f.campo)!
    const fluxo = fluxoDoCampo(i, f.campo)
    const novoDia = String(i.data[f.campo])
    // O fluxo "Aviso de renovação" do mock: cria a tarefa de revisão 5 dias antes da nova data.
    if (fluxo) estado.tarefas.push({ ...structuredClone(toRaw(estado.tarefas[0]!)), id: ++sequencia, reference: `#${sequencia}`, name: 'Revisar renovação', status: 'pending', due_date: quando(somarDias(novoDia, -5), 18 * 60), item: i.id, assigned_to: EU.id, collaborators: [], completed_at: null, completed_by: null, acao: undefined })
    return { tipo: 'item', referencia: i.reference, campo: rotulo, dia: novoDia, inicio: f.horaInicio ? l.inicio : undefined, fluxo: fluxo?.nome }
  }
  return null
}

/** O item de vários dias: mudar a data de fim pelo popover. */
export function mudarFim(i: ItemDaAgenda, campo: string | undefined, dia: string) {
  const f = fonteDoEvento(i, campo)
  if (!f?.campoFim || dia < String(i.data[f.campo])) return false
  i.data[f.campoFim] = dia
  return true
}

/** Para o Desfazer do toast: uma cópia do que um gesto pode mudar. */
export function foto() {
  return structuredClone({ tarefas: toRaw(estado.tarefas), reunioes: toRaw(estado.reunioes), vinculos: toRaw(estado.vinculos), blocos: toRaw(estado.blocos), itens: toRaw(estado.itens) })
}
export function restaurar(f: ReturnType<typeof foto>) {
  Object.assign(estado, f)
}

/**
 * Concluir ou reabrir. Concluir libera o horário reservado que ainda não começou; o que já passou fica, como registro
 * do tempo gasto. Devolve quantos horários saíram.
 */
export function concluir(t: TarefaDaAgenda) {
  const feita = t.status !== 'completed'
  Object.assign(t, { status: feita ? 'completed' : 'pending', completed_at: feita ? quando(HOJE, AGORA) : null, completed_by: feita ? EU.id : null })
  if (!feita) return 0
  const futuros = estado.blocos.filter(b => b.tarefaId === t.id && !jaPassou(b.dia, b.inicio))
  estado.blocos = estado.blocos.filter(b => !futuros.includes(b))
  return futuros.length
}

/**
 * Mudar o responsável da tarefa. O horário futuro de quem saiu fica oferecido a quem entra: passa a ser dela se ela
 * aceitar, sai da Agenda se recusar. O que já passou fica com quem fez. Devolve quantos horários foram oferecidos.
 */
export function atribuir(t: TarefaDaAgenda, pessoa: number) {
  const antes = t.assigned_to
  t.assigned_to = pessoa
  const oferecidos = estado.blocos.filter(b => b.tarefaId === t.id && b.dono === antes && !jaPassou(b.dia, b.inicio))
  oferecidos.forEach(b => (b.oferecidoA = pessoa))
  return oferecidos.length
}
export function aceitarBloco(id: string) {
  const b = bloco(id)
  if (b?.oferecidoA) Object.assign(b, { dono: b.oferecidoA, oferecidoA: undefined })
}

export function removerBloco(id: string) {
  estado.blocos = estado.blocos.filter(b => b.id !== id)
}

/** Reservar tempo: o mesmo bloco que o arraste cria, da pessoa, com a opção de ocupar o horário no Outlook. */
export function reservar(tarefaId: number, dia: string, inicio: number, fim: number, outlook: boolean) {
  const id = `b-${++sequencia}`
  const noOutlook = outlook && estado.outlook === 'conectado'
  estado.blocos.push({ id, tarefaId, dono: EU.id, dia, inicio, fim, outlook: noOutlook, eventoExterno: noOutlook ? `AAMk-${id}` : undefined })
}

/** A resposta da pessoa ao convite, que vai ao Outlook (aceitar, talvez, recusar do Graph). */
export function responder(r: Reuniao, resposta: 'sim' | 'talvez' | 'nao') {
  const eu = r.participantes.find(p => p.email === EU.email)
  if (eu) eu.resposta = resposta
}

/** Cancelar (o organizador): a reunião sai da grade e fica no histórico do item, riscada. Os vínculos ficam. */
export function cancelar(r: Reuniao) {
  r.cancelada = true
}

/** O que a pessoa já tem no horário: reuniões em que é participante e os próprios blocos. Serve aos formulários. */
export function conflitos(dia: string, inicio: number, fim: number) {
  const cruza = (a?: number, b?: number) => a !== undefined && a < fim && (b ?? a + 60) > inicio
  return [
    ...(outlookNaTela.value ? semRepetir(estado.reunioes.filter(r => r.dia === dia && !r.cancelada && souParticipante(r) && cruza(r.inicio, r.fim)), r => r.uid).map(r => r.particular ? null : r.titulo) : []),
    ...estado.blocos.filter(b => b.dia === dia && cruza(b.inicio, b.fim) && meuBloco(b)).map(b => tarefa(b.tarefaId)!.name),
  ].filter((x): x is string => !!x)
}

/**
 * O "Ligar reunião existente": as reuniões da pessoa nos próximos 14 dias, não particulares, não canceladas e ainda
 * não ligadas a este item. A recorrente entra uma vez, pela próxima ocorrência, e liga a série.
 */
export function reunioesParaLigar(itemId: number) {
  const ligadas = reunioesDo(itemId).filter(x => !x.pela).map(x => x.r.uid)
  const candidatas = estado.reunioes
    .filter(r => r.calendario && !r.cancelada && !r.particular && souParticipante(r) && r.dia >= HOJE && r.dia <= somarDias(HOJE, 14) && !ligadas.includes(r.uid))
    .sort(porHorario)
  return semRepetir(candidatas, r => r.serie ?? r.uid)
}

/* ---------------- criação rápida ---------------- */
export type TipoDeCriacao = 'reuniao' | 'rapida' | 'item'

export interface Criacao {
  tipo: TipoDeCriacao
  titulo: string
  lugar: Lugar
  participantes: string[]
  teams: boolean
  /** A reunião se liga a vários itens; a tarefa rápida, a 1 só (o primeiro). */
  itens: number[]
  /** A reunião agendada para uma tarefa se liga à tarefa (o item a vê pela tarefa). */
  tarefa?: number
  categoria: SlugDaCategoria
  /** Os outros campos do formulário completo da categoria ("Mais campos"). */
  campos?: Record<string, string | number>
}

/** As categorias em que a pessoa pode criar item pela Agenda: fonte ligada e permissão de criar (uma vez cada). */
export const categoriasParaCriar = computed(() => fontesAtivas.value.filter((f, n, l) => podeCriarEm(f.slug) && !campoSumiu(f) && l.findIndex(x => x.slug === f.slug) === n))

/** Os obrigatórios que a criação rápida não cobre: o título e a data da fonte vêm do popover; o resto, do formulário. */
export function faltam(c: Criacao) {
  const f = fonte(c.categoria)
  const cat = categoriaPorSlug(c.categoria)
  return cat.campos.filter(x => x.obrigatorio && x.chave !== 'titulo' && x.chave !== f?.campo && !c.campos?.[x.chave])
}

/** O que a criação já recebe preenchido: o título, os itens e a tarefa do "Agendar reunião sobre isto" e da pasta Agenda. */
export interface Semente { titulo: string, itens: number[], tarefa?: number }

/** O que a criação rápida leva ao formulário completo da categoria. */
export interface Rascunho { categoria: SlugDaCategoria, titulo: string, lugar: Lugar }

export interface Criado { chave: string, vinculoFalhou: boolean, alvos: Alvo[] }

export function criar(c: Criacao): Criado {
  const { dia, inicio, fim } = c.lugar
  sequencia++
  if (c.tipo === 'reuniao') {
    const id = `r-novo-${sequencia}`
    const alvos: Alvo[] = [...(c.tarefa ? [{ tipo: 'tarefa' as const, id: c.tarefa }] : []), ...c.itens.map(i => ({ tipo: 'item' as const, id: i }))]
    // A reunião nasce no Outlook (1ª chamada); o vínculo é a 2ª. Se a 2ª falha, a reunião fica sem vínculo.
    const vinculoFalhou = alvos.length > 0 && estado.falharVinculo
    estado.falharVinculo = false
    const r: Reuniao = {
      id,
      uid: `uid-${id}`,
      titulo: c.titulo,
      dia,
      inicio,
      fim,
      calendario: 'meu',
      provedor: 'outlook',
      teams: c.teams,
      participantes: [{ nome: EU.nome, email: EU.email!, resposta: 'sim' }, ...c.participantes.map(email => ({ nome: email.split('@')[0]!, email, resposta: 'pendente' as const }))],
      organizador: EU.email!,
    }
    estado.reunioes.push(r)
    if (!vinculoFalhou) alvos.forEach(a => ligar(r, a, 'criacao'))
    return { chave: `r:${id}`, vinculoFalhou, alvos }
  }
  if (c.tipo === 'rapida') {
    const modelo = structuredClone(toRaw(estado.tarefas.find(t => t.origem === 'rapida')!))
    // Com horário, a tarefa ganha o horário reservado na grade; o prazo fica no fim do dia (ou no fim do horário, se for depois).
    const id = sequencia
    const prazo = inicio === undefined ? 18 * 60 : Math.max(18 * 60, fim ?? inicio + 60)
    estado.tarefas.push({ ...modelo, id, reference: `#${id}`, name: c.titulo, status: 'pending', due_date: quando(dia, prazo), item: c.itens[0] ?? null, assigned_to: EU.id, collaborators: [], completed_at: null, completed_by: null })
    if (inicio !== undefined) reservar(id, dia, inicio, fim ?? inicio + 60, true)
    return { chave: `q:${id}`, vinculoFalhou: false, alvos: [] }
  }
  const f = fonte(c.categoria)!
  const prefixo = { contratos: 'CT', processos: 'PR', clientes: 'CL', chamados: 'CH' }[c.categoria]
  const data: Record<string, string | number> = { ...c.campos, titulo: c.titulo, created_at: HOJE, [f.campo]: dia }
  if (f.horaInicio && inicio !== undefined) data[f.horaInicio] = inicio
  if (f.horaFim && fim !== undefined) data[f.horaFim] = fim
  if (f.campoResponsavel) data[f.campoResponsavel] = EU.id
  estado.itens.push({ id: sequencia, reference: `${prefixo}-${sequencia}`, categoria: c.categoria, titulo: c.titulo, criador: EU.id, data })
  estado.camadas[f.id] = true
  return { chave: `i:${sequencia}:${f.campo}`, vinculoFalhou: false, alvos: [] }
}
