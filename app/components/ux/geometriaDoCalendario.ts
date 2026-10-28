/**
 * Tipos e geometria do `UxCalendario.vue`.
 *
 * O empacotamento de eventos sobrepostos (cluster e colunas, o mesmo do Google Calendar) e as medidas de arrastar
 * vêm do template oficial "Calendar" do Nuxt UI (`app/utils/layout.ts`, MIT), achado pelo MCP `nuxt-ui`
 * (`list-templates`). Portado para dia `AAAA-MM-DD` e minuto do dia, sem `date-fns`, que este repositório não importa.
 */

export type CorDoCalendario = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'neutral'

export interface EventoDoCalendario {
  id: string
  titulo: string
  dia: string
  /** Minutos do dia. Sem início, o evento vai para a faixa de dia inteiro. */
  inicio?: number
  fim?: number
  cor: CorDoCalendario
  icone?: string
  /** cheio: reunião e item; contorno: bloco de trabalho; marcador: prazo. */
  estilo?: 'cheio' | 'contorno' | 'marcador'
  riscado?: boolean
  passado?: boolean
  alerta?: 'atrasado' | 'risco'
  /** Texto curto ao lado do título do marcador ("18:00"). */
  rotuloHora?: string
  arrastavel?: boolean
  redimensionavel?: boolean
  /** Pode sair da faixa de dia inteiro e cair na grade de horas. */
  vaiParaAGrade?: boolean
}

export interface Movimento { id: string, dia: string, inicio?: number, fim?: number }
export interface Lugar { dia: string, inicio?: number, fim?: number }

export const ALTURA_DA_HORA = 52
export const PX_POR_MINUTO = ALTURA_DA_HORA / 60
export const PASSO = 15
/** Altura mínima pintada: um evento de 15 min aparece com 30 min de altura para o título caber. */
export const MINIMO_PINTADO = 30
export const LIMIAR_DE_ARRASTE = 5

export interface Posicionado { evento: EventoDoCalendario, topo: number, altura: number, esquerda: number, largura: number }

export function empacotarDia(eventos: EventoDoCalendario[]): Posicionado[] {
  const itens = eventos
    .filter(e => e.inicio !== undefined)
    .map(e => ({ evento: e, ini: e.inicio!, fim: Math.max(e.fim ?? e.inicio! + 60, e.inicio! + MINIMO_PINTADO) }))
    .sort((a, b) => a.ini - b.ini || b.fim - a.fim)

  const saida: Posicionado[] = []
  let grupo: typeof itens = []
  let fimDoGrupo = -Infinity

  const fechar = () => {
    const colunas: number[] = []
    const lugar = grupo.map((x) => {
      let i = colunas.findIndex(fim => fim <= x.ini)
      if (i === -1) i = colunas.length
      colunas[i] = x.fim
      return i
    })
    grupo.forEach((x, k) => saida.push({
      evento: x.evento,
      topo: x.ini * PX_POR_MINUTO,
      altura: (x.fim - x.ini) * PX_POR_MINUTO,
      esquerda: (lugar[k]! / colunas.length) * 100,
      largura: 100 / colunas.length,
    }))
  }

  for (const x of itens) {
    if (grupo.length && x.ini >= fimDoGrupo) {
      fechar()
      grupo = []
      fimDoGrupo = -Infinity
    }
    grupo.push(x)
    fimDoGrupo = Math.max(fimDoGrupo, x.fim)
  }
  if (grupo.length) fechar()
  return saida
}

export const encaixar = (min: number) => Math.round(min / PASSO) * PASSO
export const limitar = (min: number) => Math.min(24 * 60, Math.max(0, min))

/** Minuto em que o ponteiro está dentro da coluna do dia. */
export const minutoNaColuna = (y: number, r: DOMRect, modo: 'piso' | 'perto' = 'perto') => {
  const bruto = (y - r.top) / PX_POR_MINUTO
  return limitar(modo === 'piso' ? Math.floor(bruto / PASSO) * PASSO : encaixar(bruto))
}

/* Mapas fixos, para o Tailwind ver o nome inteiro da classe. */
export const fundoCheio: Record<CorDoCalendario, string> = {
  primary: 'bg-primary/12 hover:bg-primary/20',
  secondary: 'bg-secondary/12 hover:bg-secondary/20',
  info: 'bg-info/12 hover:bg-info/20',
  success: 'bg-success/12 hover:bg-success/20',
  warning: 'bg-warning/15 hover:bg-warning/25',
  error: 'bg-error/12 hover:bg-error/20',
  neutral: 'bg-elevated hover:bg-accented',
}
export const borda: Record<CorDoCalendario, string> = {
  primary: 'border-primary/60',
  secondary: 'border-secondary/60',
  info: 'border-info/60',
  success: 'border-success/60',
  warning: 'border-warning/70',
  error: 'border-error/60',
  neutral: 'border-accented',
}
export const barra: Record<CorDoCalendario, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
  neutral: 'bg-inverted/40',
}
export const textoDaCor: Record<CorDoCalendario, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  neutral: 'text-muted',
}

/** Anel do evento aberto no popover. */
export const anel: Record<CorDoCalendario, string> = {
  primary: 'ring-2 ring-primary',
  secondary: 'ring-2 ring-secondary',
  info: 'ring-2 ring-info',
  success: 'ring-2 ring-success',
  warning: 'ring-2 ring-warning',
  error: 'ring-2 ring-error',
  neutral: 'ring-2 ring-inverted/50',
}
