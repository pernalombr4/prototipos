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
 */
import type { CorDoCalendario, EventoDoCalendario, Lugar } from '~/components/ux/geometriaDoCalendario'
import { AGORA, HOJE, hora, somarDias } from './datas'
import type { Cor, ItemDaAgenda, Provedor, Reuniao, SlugDaCategoria, TarefaDaAgenda } from './mocks'
import { blocosIniciais, categoriaPorSlug, EU, itens, reunioesIniciais, tarefasIniciais } from './mocks'

export type Vista = 'dia' | 'semana' | 'mes' | 'lista'
export type Cenario = 'normal' | 'primeiro' | 'falha' | 'vazia' | 'carregando'
export type Camada = 'tarefas' | 'rapidas' | SlugDaCategoria | 'meu' | 'juridico'

/** PROTÓTIPO: a fonte de categoria com campo de data e, opcionalmente, campos de hora de início e de fim. */
export interface Fonte {
  slug: SlugDaCategoria
  ativa: boolean
  campo: string
  horaInicio: string | null
  horaFim: string | null
  cor: Cor
}

const fontesIniciais = (): Fonte[] => [
  { slug: 'contratos', ativa: true, campo: 'fim_vigencia', horaInicio: null, horaFim: null, cor: 'warning' },
  { slug: 'processos', ativa: true, campo: 'audiencia', horaInicio: 'audiencia_inicio', horaFim: 'audiencia_fim', cor: 'success' },
  { slug: 'clientes', ativa: true, campo: 'proxima_visita', horaInicio: null, horaFim: null, cor: 'neutral' },
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

export const CORES_DO_OUTLOOK: Record<Reuniao['calendario'], CorDoCalendario> = { meu: 'info', juridico: 'neutral' }

const inicial = () => ({
  vista: 'semana' as Vista,
  data: HOJE,
  cenario: 'normal' as Cenario,
  outlook: 'conectado' as 'conectado' | 'desconectado' | 'falha',
  tarefas: tarefasIniciais(),
  reunioes: reunioesIniciais(),
  blocos: blocosIniciais(),
  itens: structuredClone(itens) as ItemDaAgenda[],
  fontes: fontesIniciais(),
  camadas: { tarefas: true, rapidas: true, contratos: true, processos: true, clientes: false, chamados: false, meu: true, juridico: true } as Record<Camada, boolean>,
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

export const tarefa = (id: number) => estado.tarefas.find(t => t.id === id)
export const item = (id: number | null | undefined) => estado.itens.find(i => i.id === id) ?? null
export const reuniao = (id: string) => estado.reunioes.find(r => r.id === id)
export const bloco = (id: string) => estado.blocos.find(b => b.id === id)
export const fonte = (slug: string) => estado.fontes.find(f => f.slug === slug)

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
/** Concluir com 1 clique: só o responsável, e só a tarefa que não pede aprovação nem formulário. */
export const podeEditarItem = (i: ItemDaAgenda) => categoriaPorSlug(i.categoria).permissao.editar && !i.somenteLeitura
export const podeCriarEm = (slug: SlugDaCategoria) => categoriaPorSlug(slug).permissao.criar
/** O Outlook só deixa o organizador mudar o horário. */
export const ehOrganizador = (r: Reuniao) => r.organizador === EU.email
export const organizador = (r: Reuniao) => r.participantes.find(p => p.email === r.organizador)?.nome ?? r.organizador
export const souParticipante = (r: Reuniao) => r.participantes.some(p => p.email === EU.email)
/** O fluxo que roda quando a data da fonte muda: o gesto pede confirmação e perde o Desfazer. */
export const fluxoDoCampo = (i: ItemDaAgenda) => {
  const c = categoriaPorSlug(i.categoria)
  return c.fluxo && c.fluxo.campo === fonte(i.categoria)?.campo ? c.fluxo : null
}

const visivel = (responsavel: number) => !estado.responsaveis.length || estado.responsaveis.includes(responsavel)
export const fontesAtivas = computed(() => estado.fontes.filter(f => f.ativa))
export const outlookNaTela = computed(() => estado.outlook === 'conectado')

/** A sugestão de vínculo: um participante de fora com o mesmo domínio do contato de um item ainda não ligado. */
export function sugestao(r: Reuniao): ItemDaAgenda | null {
  if (r.sugestaoRecusada || r.particular) return null
  const dominios = r.participantes.map(p => p.email.split('@')[1]).filter(d => d !== 'aurora.example')
  return estado.itens.find(i => i.dominio && dominios.includes(i.dominio) && !r.itens.includes(i.id)) ?? null
}

export const blocosDa = (tarefaId: number) => estado.blocos.filter(b => b.tarefaId === tarefaId)
export const reunioesDo = (itemId: number) => estado.reunioes.filter(r => r.itens.includes(itemId)).sort((a, b) => (a.dia + hora(a.inicio ?? 0)).localeCompare(b.dia + hora(b.inicio ?? 0)))

/* ---------------- eventos da grade ---------------- */
export const eventos = computed<EventoDoCalendario[]>(() => {
  if (estado.cenario === 'vazia') return []
  const c = estado.camadas
  const lista: EventoDoCalendario[] = []

  for (const t of estado.tarefasNaAgenda ? estado.tarefas : []) {
    const camada = t.origem === 'fluxo' ? 'tarefas' : 'rapidas'
    if (!t.due_date || !c[camada] || !visivel(t.assigned_to)) continue
    const s = situacao(t)
    lista.push({
      id: `${t.origem === 'fluxo' ? 't' : 'q'}:${t.id}`,
      titulo: t.name,
      dia: diaDe(t.due_date),
      cor: t.origem === 'fluxo' ? 'primary' : 'neutral',
      estilo: 'marcador',
      icone: t.origem === 'fluxo' ? 'i-lucide-flag' : 'i-lucide-clipboard-check',
      rotuloHora: hora(minutoDe(t.due_date)),
      riscado: s === 'concluida',
      alerta: s === 'atrasada' ? 'atrasado' : s === 'hoje' ? 'risco' : undefined,
      arrastavel: s !== 'concluida' && ehMinha(t),
      vaiParaAGrade: true,
    })
  }

  if (c.tarefas && estado.tarefasNaAgenda) {
    for (const b of estado.blocos) {
      const t = tarefa(b.tarefaId)
      if (!t || !visivel(t.assigned_to)) continue
      lista.push({ id: `b:${b.id}`, titulo: t.name, dia: b.dia, inicio: b.inicio, fim: b.fim, cor: 'primary', estilo: 'contorno', icone: 'i-lucide-timer', riscado: t.status === 'completed', passado: jaPassou(b.dia, b.fim), arrastavel: ehMinha(t), redimensionavel: ehMinha(t) })
    }
  }

  for (const f of fontesAtivas.value) {
    if (!c[f.slug]) continue
    const cat = categoriaPorSlug(f.slug)
    for (const i of estado.itens) {
      const dia = i.data[f.campo]
      if (i.categoria !== f.slug || typeof dia !== 'string' || !visivel(i.responsavel)) continue
      const ini = f.horaInicio ? i.data[f.horaInicio] as number | undefined : undefined
      const fim = f.horaFim ? i.data[f.horaFim] as number | undefined : undefined
      lista.push({ id: `i:${i.id}`, titulo: `${i.reference} · ${i.titulo}`, dia, inicio: ini, fim: ini === undefined ? undefined : fim ?? ini + 60, cor: f.cor, icone: cat.icon ?? undefined, passado: jaPassou(dia, fim ?? 1440), arrastavel: podeEditarItem(i), redimensionavel: ini !== undefined && podeEditarItem(i) })
    }
  }

  if (outlookNaTela.value) {
    for (const r of estado.reunioes) {
      if (!c[r.calendario]) continue
      lista.push({ id: `r:${r.id}`, titulo: r.titulo, dia: r.dia, inicio: r.inicio, fim: r.fim, cor: CORES_DO_OUTLOOK[r.calendario], icone: r.particular ? 'i-lucide-lock' : r.itens.length ? 'i-lucide-link-2' : undefined, passado: jaPassou(r.dia, r.fim ?? 1440), arrastavel: ehOrganizador(r), redimensionavel: r.inicio !== undefined && ehOrganizador(r) })
    }
  }
  return lista
})

/* ---------------- tarefas sem data ---------------- */
/** As tarefas da pessoa sem prazo: não têm lugar na grade, então ficam no painel "Sem data". */
export const semData = computed(() => estado.cenario === 'vazia' || !estado.tarefasNaAgenda
  ? []
  : estado.tarefas.filter(t => !t.due_date && t.status !== 'completed' && visivel(t.assigned_to)))

/* ---------------- gestos ---------------- */
let sequencia = 9000

export type Efeito =
  | { tipo: 'reuniao' | 'bloco', titulo: string, dia: string, inicio?: number }
  | { tipo: 'reservado', titulo: string, prazo: Date }
  | { tipo: 'prazo', titulo: string, prazo: Date }
  | { tipo: 'item', referencia: string, campo: string, dia: string, inicio?: number, fluxo?: string }
  | { tipo: 'sla', titulo: string }

/** Aplica um arraste (de dentro da grade ou do painel Para agendar). A chave é `<fonte>:<id>`. */
export function aplicar(chave: string, l: Lugar): Efeito | null {
  const [tipo, id] = [chave.slice(0, 1), chave.slice(2)]

  if (tipo === 'r') {
    const r = reuniao(id)!
    if (!ehOrganizador(r)) return null
    Object.assign(r, { dia: l.dia, inicio: l.inicio, fim: l.fim })
    return { tipo: 'reuniao', titulo: r.titulo, dia: l.dia, inicio: l.inicio }
  }
  if (tipo === 'b') {
    const b = bloco(id)!
    if (!ehMinha(tarefa(b.tarefaId)!)) return null
    Object.assign(b, { dia: l.dia, inicio: l.inicio ?? b.inicio, fim: l.fim ?? b.fim })
    return { tipo: 'bloco', titulo: tarefa(b.tarefaId)!.name, dia: b.dia, inicio: b.inicio }
  }
  if (tipo === 't' || tipo === 'q') {
    const t = tarefa(Number(id))!
    if (!ehMinha(t) || t.status === 'completed') return null
    if (temSla(t)) {
      if (l.inicio === undefined) return { tipo: 'sla', titulo: t.name }
      estado.blocos.push({ id: `b-${Date.now()}`, tarefaId: t.id, dia: l.dia, inicio: l.inicio, fim: l.fim ?? l.inicio + 60 })
      return { tipo: 'reservado', titulo: t.name, prazo: t.due_date! }
    }
    t.due_date = quando(l.dia, l.inicio ?? (t.due_date ? minutoDe(t.due_date) : 18 * 60))
    return { tipo: 'prazo', titulo: t.name, prazo: t.due_date }
  }
  if (tipo === 'i') {
    const i = item(Number(id))!
    if (!podeEditarItem(i)) return null
    const f = fonte(i.categoria)!
    i.data[f.campo] = l.dia
    if (f.horaInicio && l.inicio !== undefined) {
      i.data[f.horaInicio] = l.inicio
      if (f.horaFim) i.data[f.horaFim] = l.fim ?? l.inicio + 60
    }
    const rotulo = categoriaPorSlug(i.categoria).campos.find(c => c.chave === f.campo)!.rotulo
    const fluxo = fluxoDoCampo(i)
    // O fluxo "Aviso de renovação" do mock: cria a tarefa de revisão 5 dias antes da nova data.
    if (fluxo) estado.tarefas.push({ ...structuredClone(toRaw(estado.tarefas[0]!)), id: ++sequencia, reference: `#${sequencia}`, name: 'Revisar renovação', status: 'pending', due_date: quando(somarDias(l.dia, -5), 18 * 60), item: i.id, assigned_to: EU.id, completed_at: null, completed_by: null, acao: undefined })
    return { tipo: 'item', referencia: i.reference, campo: rotulo, dia: l.dia, inicio: f.horaInicio ? l.inicio : undefined, fluxo: fluxo?.nome }
  }
  return null
}

/** Para o Desfazer do toast: uma cópia do que um gesto pode mudar. */
export function foto() {
  return structuredClone({ tarefas: toRaw(estado.tarefas), reunioes: toRaw(estado.reunioes), blocos: toRaw(estado.blocos), itens: toRaw(estado.itens) })
}
export function restaurar(f: ReturnType<typeof foto>) {
  Object.assign(estado, f)
}

export function concluir(t: TarefaDaAgenda) {
  const feita = t.status !== 'completed'
  Object.assign(t, { status: feita ? 'completed' : 'pending', completed_at: feita ? quando(HOJE, AGORA) : null, completed_by: feita ? EU.id : null })
}

export function removerBloco(id: string) {
  estado.blocos = estado.blocos.filter(b => b.id !== id)
}

/** Reservar tempo pelo painel da tarefa: o mesmo bloco que o arraste cria, com a opção de ir ao Outlook. */
export function reservar(tarefaId: number, dia: string, inicio: number, fim: number, outlook: boolean) {
  estado.blocos.push({ id: `b-${++sequencia}`, tarefaId, dia, inicio, fim, outlook: outlook && estado.outlook === 'conectado' })
}

/** A resposta da pessoa ao convite, que vai ao Outlook (aceitar, talvez, recusar do Graph). */
export function responder(r: Reuniao, resposta: 'sim' | 'talvez' | 'nao') {
  const eu = r.participantes.find(p => p.email === EU.email)
  if (eu) eu.resposta = resposta
}

/** A reunião se liga a mais de um item: ligar soma, desligar tira só aquele. */
export function ligar(r: Reuniao, itemId: number) {
  if (!r.itens.includes(itemId)) r.itens.push(itemId)
}
export function desligar(r: Reuniao, itemId: number) {
  r.itens = r.itens.filter(x => x !== itemId)
  r.sugestaoRecusada = true
}

/** O que a pessoa já tem no horário: reuniões em que é participante e os próprios blocos. Serve aos formulários. */
export function conflitos(dia: string, inicio: number, fim: number) {
  const cruza = (a?: number, b?: number) => a !== undefined && a < fim && (b ?? a + 60) > inicio
  return [
    ...(outlookNaTela.value ? estado.reunioes.filter(r => r.dia === dia && souParticipante(r) && cruza(r.inicio, r.fim)).map(r => r.particular ? null : r.titulo) : []),
    ...estado.blocos.filter(b => b.dia === dia && cruza(b.inicio, b.fim) && ehMinha(tarefa(b.tarefaId)!)).map(b => tarefa(b.tarefaId)!.name),
  ].filter((x): x is string => !!x)
}

/** Reuniões do Outlook da pessoa, ainda não ligadas a este item e não particulares, dos próximos 14 dias: o "Ligar reunião existente". */
export const reunioesParaLigar = (itemId: number) => estado.reunioes.filter(r => !r.itens.includes(itemId) && !r.particular && souParticipante(r) && r.dia >= HOJE && r.dia <= somarDias(HOJE, 14) && !r.id.startsWith('daily'))

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
  categoria: SlugDaCategoria
  /** Os outros campos do formulário completo da categoria ("Mais campos"). */
  campos?: Record<string, string | number>
}

/** As categorias em que a pessoa pode criar item pela Agenda: fonte ligada e permissão de criar. */
export const categoriasParaCriar = computed(() => fontesAtivas.value.filter(f => podeCriarEm(f.slug)))

/** Os obrigatórios que a criação rápida não cobre: o título e a data da fonte vêm do popover; o resto, do formulário. */
export function faltam(c: Criacao) {
  const f = fonte(c.categoria)
  const cat = categoriaPorSlug(c.categoria)
  return cat.campos.filter(x => x.obrigatorio && x.chave !== 'titulo' && x.chave !== f?.campo && !c.campos?.[x.chave])
}

/** O que a criação rápida leva ao formulário completo da categoria. */
export interface Rascunho { categoria: SlugDaCategoria, titulo: string, lugar: Lugar }

export interface Criado { chave: string, vinculoFalhou: boolean }

export function criar(c: Criacao): Criado {
  const { dia, inicio, fim } = c.lugar
  sequencia++
  if (c.tipo === 'reuniao') {
    const id = `r-novo-${sequencia}`
    // A reunião nasce no Outlook (1ª chamada); o vínculo é a 2ª. Se a 2ª falha, a reunião fica sem vínculo.
    const vinculoFalhou = c.itens.length > 0 && estado.falharVinculo
    estado.falharVinculo = false
    estado.reunioes.push({
      id,
      titulo: c.titulo,
      dia,
      inicio,
      fim,
      calendario: 'meu',
      provedor: 'outlook',
      teams: c.teams,
      participantes: [{ nome: EU.nome, email: EU.email!, resposta: 'sim' }, ...c.participantes.map(email => ({ nome: email.split('@')[0]!, email, resposta: 'pendente' as const }))],
      itens: vinculoFalhou ? [] : [...c.itens],
      organizador: EU.email!,
    })
    return { chave: `r:${id}`, vinculoFalhou }
  }
  if (c.tipo === 'rapida') {
    const modelo = structuredClone(toRaw(estado.tarefas.find(t => t.origem === 'rapida')!))
    // Com horário, a tarefa ganha o horário reservado na grade; o prazo fica no fim do dia (ou no fim do horário, se for depois).
    const id = sequencia
    const prazo = inicio === undefined ? 18 * 60 : Math.max(18 * 60, fim ?? inicio + 60)
    estado.tarefas.push({ ...modelo, id, reference: `#${id}`, name: c.titulo, status: 'pending', due_date: quando(dia, prazo), item: c.itens[0] ?? null, assigned_to: EU.id, completed_at: null, completed_by: null })
    if (inicio !== undefined) reservar(id, dia, inicio, fim ?? inicio + 60, true)
    return { chave: `q:${id}`, vinculoFalhou: false }
  }
  const f = fonte(c.categoria)!
  const prefixo = { contratos: 'CT', processos: 'PR', clientes: 'CL', chamados: 'CH' }[c.categoria]
  const data: Record<string, string | number> = { ...c.campos, titulo: c.titulo, created_at: HOJE, [f.campo]: dia }
  if (f.horaInicio && inicio !== undefined) data[f.horaInicio] = inicio
  if (f.horaFim && fim !== undefined) data[f.horaFim] = fim
  const contato = typeof data.contato === 'string' ? data.contato : undefined
  estado.itens.push({ id: sequencia, reference: `${prefixo}-${sequencia}`, categoria: c.categoria, titulo: c.titulo, responsavel: EU.id, data, dominio: contato?.split('@')[1] })
  estado.camadas[c.categoria] = true
  return { chave: `i:${sequencia}`, vinculoFalhou: false }
}
