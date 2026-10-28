/**
 * Estado da Agenda: o que está carregado, as camadas ligadas, a configuração das fontes e as regras de cada gesto.
 *
 * Tudo em memória: o reload zera (regra 4). Os eventos da grade são derivados daqui; o `UxCalendario` só desenha.
 *
 * As 3 regras que a redatora aprovou em 28/10/2026:
 *  1. tarefa com SLA não muda de prazo ao arrastar: ganha um bloco de trabalho; item e tarefa sem SLA mudam de data;
 *  2. a agenda da equipe fica para a rodada 2 (aqui o filtro de responsável só lê tarefas e itens);
 *  3. a agenda do item é uma aba do painel lateral que abre na própria Agenda.
 */
import type { CorDoCalendario, EventoDoCalendario, Lugar } from '~/components/ux/geometriaDoCalendario'
import { AGORA, HOJE, hora, inicioDaSemana, somarDias } from './datas'
import type { Cor, ItemDaAgenda, Reuniao, SlugDaCategoria, TarefaDaAgenda } from './mocks'
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
  /** "Agendar reunião" no painel do item: a próxima criação já nasce ligada a este item. */
  agendandoPara: null as number | null,
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

const visivel = (responsavel: number) => !estado.responsaveis.length || estado.responsaveis.includes(responsavel)
export const fontesAtivas = computed(() => estado.fontes.filter(f => f.ativa))
export const outlookNaTela = computed(() => estado.outlook === 'conectado')

/** A sugestão de vínculo: um participante de fora com o mesmo domínio do contato de um item. */
export function sugestao(r: Reuniao): ItemDaAgenda | null {
  if (r.itemId || r.sugestaoRecusada) return null
  const dominios = r.participantes.map(p => p.email.split('@')[1]).filter(d => d !== 'aurora.example')
  return estado.itens.find(i => i.dominio && dominios.includes(i.dominio)) ?? null
}

export const blocosDa = (tarefaId: number) => estado.blocos.filter(b => b.tarefaId === tarefaId)
export const reunioesDo = (itemId: number) => estado.reunioes.filter(r => r.itemId === itemId).sort((a, b) => (a.dia + hora(a.inicio ?? 0)).localeCompare(b.dia + hora(b.inicio ?? 0)))

/* ---------------- eventos da grade ---------------- */
export const eventos = computed<EventoDoCalendario[]>(() => {
  if (estado.cenario === 'vazia') return []
  const c = estado.camadas
  const lista: EventoDoCalendario[] = []

  for (const t of estado.tarefas) {
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
      arrastavel: s !== 'concluida',
      vaiParaAGrade: true,
    })
  }

  if (c.tarefas) {
    for (const b of estado.blocos) {
      const t = tarefa(b.tarefaId)
      if (!t || !visivel(t.assigned_to)) continue
      lista.push({ id: `b:${b.id}`, titulo: t.name, dia: b.dia, inicio: b.inicio, fim: b.fim, cor: 'primary', estilo: 'contorno', icone: 'i-lucide-timer', riscado: t.status === 'completed', passado: jaPassou(b.dia, b.fim), arrastavel: true, redimensionavel: true })
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
      lista.push({ id: `i:${i.id}`, titulo: `${i.reference} · ${i.titulo}`, dia, inicio: ini, fim: ini === undefined ? undefined : fim ?? ini + 60, cor: f.cor, icone: cat.icon ?? undefined, passado: jaPassou(dia, fim ?? 1440), arrastavel: true, redimensionavel: ini !== undefined })
    }
  }

  if (outlookNaTela.value) {
    for (const r of estado.reunioes) {
      if (!c[r.calendario]) continue
      lista.push({ id: `r:${r.id}`, titulo: r.titulo, dia: r.dia, inicio: r.inicio, fim: r.fim, cor: CORES_DO_OUTLOOK[r.calendario], icone: r.itemId ? 'i-lucide-link-2' : undefined, passado: jaPassou(r.dia, r.fim ?? 1440), arrastavel: true, redimensionavel: r.inicio !== undefined })
    }
  }
  return lista
})

/* ---------------- o que falta agendar ---------------- */
export const paraAgendar = computed(() => {
  if (estado.cenario === 'vazia') return { atrasadas: [], semData: [], semTempo: [] }
  const minhas = estado.tarefas.filter(t => visivel(t.assigned_to) && t.status !== 'completed')
  const ini = inicioDaSemana(estado.data)
  const fim = somarDias(ini, 6)
  return {
    atrasadas: minhas.filter(t => situacao(t) === 'atrasada'),
    semData: minhas.filter(t => !t.due_date),
    semTempo: minhas.filter(t => temSla(t) && situacao(t) !== 'atrasada' && diaDe(t.due_date!) >= ini && diaDe(t.due_date!) <= fim && !blocosDa(t.id).length),
  }
})

/* ---------------- gestos ---------------- */
export type Efeito =
  | { tipo: 'reuniao' | 'bloco', titulo: string, dia: string, inicio?: number }
  | { tipo: 'reservado', titulo: string, prazo: Date }
  | { tipo: 'prazo', titulo: string, prazo: Date }
  | { tipo: 'item', referencia: string, campo: string, dia: string, inicio?: number }
  | { tipo: 'sla', titulo: string }

/** Aplica um arraste (de dentro da grade ou do painel Para agendar). A chave é `<fonte>:<id>`. */
export function aplicar(chave: string, l: Lugar): Efeito | null {
  const [tipo, id] = [chave.slice(0, 1), chave.slice(2)]

  if (tipo === 'r') {
    const r = reuniao(id)!
    Object.assign(r, { dia: l.dia, inicio: l.inicio, fim: l.fim })
    return { tipo: 'reuniao', titulo: r.titulo, dia: l.dia, inicio: l.inicio }
  }
  if (tipo === 'b') {
    const b = bloco(id)!
    Object.assign(b, { dia: l.dia, inicio: l.inicio ?? b.inicio, fim: l.fim ?? b.fim })
    return { tipo: 'bloco', titulo: tarefa(b.tarefaId)!.name, dia: b.dia, inicio: b.inicio }
  }
  if (tipo === 't' || tipo === 'q') {
    const t = tarefa(Number(id))!
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
    const f = fonte(i.categoria)!
    i.data[f.campo] = l.dia
    if (f.horaInicio && l.inicio !== undefined) {
      i.data[f.horaInicio] = l.inicio
      if (f.horaFim) i.data[f.horaFim] = l.fim ?? l.inicio + 60
    }
    const rotulo = categoriaPorSlug(i.categoria).campos.find(c => c.chave === f.campo)!.rotulo
    return { tipo: 'item', referencia: i.reference, campo: rotulo, dia: l.dia, inicio: f.horaInicio ? l.inicio : undefined }
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

export function ligar(r: Reuniao, itemId: number | null) {
  r.itemId = itemId
  if (itemId === null) r.sugestaoRecusada = true
}

/* ---------------- criação rápida ---------------- */
export type TipoDeCriacao = 'reuniao' | 'rapida' | 'item'

export interface Criacao {
  tipo: TipoDeCriacao
  titulo: string
  lugar: Lugar
  participantes: string[]
  teams: boolean
  itemId: number | null
  categoria: SlugDaCategoria
}

let sequencia = 9000
export function criar(c: Criacao): string {
  const { dia, inicio, fim } = c.lugar
  sequencia++
  if (c.tipo === 'reuniao') {
    const id = `r-novo-${sequencia}`
    estado.reunioes.push({
      id,
      titulo: c.titulo,
      dia,
      inicio,
      fim,
      calendario: 'meu',
      teams: c.teams,
      participantes: [{ nome: EU.nome, email: EU.email!, resposta: 'sim' }, ...c.participantes.map(email => ({ nome: email.split('@')[0]!, email, resposta: 'pendente' as const }))],
      itemId: c.itemId,
    })
    return `r:${id}`
  }
  if (c.tipo === 'rapida') {
    const modelo = structuredClone(toRaw(estado.tarefas.find(t => t.origem === 'rapida')!))
    estado.tarefas.push({ ...modelo, id: sequencia, reference: `#${sequencia}`, name: c.titulo, status: 'pending', due_date: quando(dia, inicio ?? 18 * 60), item: c.itemId, assigned_to: EU.id, completed_at: null, completed_by: null })
    return `q:${sequencia}`
  }
  const f = fonte(c.categoria)!
  const prefixo = { contratos: 'CT', processos: 'PR', clientes: 'CL', chamados: 'CH' }[c.categoria]
  const data: Record<string, string | number> = { titulo: c.titulo, created_at: HOJE, [f.campo]: dia }
  if (f.horaInicio && inicio !== undefined) data[f.horaInicio] = inicio
  if (f.horaFim && fim !== undefined) data[f.horaFim] = fim
  estado.itens.push({ id: sequencia, reference: `${prefixo}-${sequencia}`, categoria: c.categoria, titulo: c.titulo, responsavel: EU.id, data })
  estado.camadas[c.categoria] = true
  return `i:${sequencia}`
}
