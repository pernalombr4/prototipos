/**
 * Datas da Agenda. O dia é sempre `AAAA-MM-DD` e a hora é minuto do dia (0 a 1440), sem fuso: o protótipo
 * vive num dia fixo (HOJE) para os prints e a revisão mostrarem sempre a mesma semana.
 */

export const HOJE = '2026-10-28'
/** 10:40 de HOJE: onde fica a linha da hora atual. */
export const AGORA = 10 * 60 + 40

export const paraData = (d: string) => new Date(`${d}T00:00:00Z`)
export const paraDia = (d: Date) => d.toISOString().slice(0, 10)
export const diaDaSemana = (d: string) => paraData(d).getUTCDay()

export function somarDias(d: string, n: number) {
  const x = paraData(d)
  x.setUTCDate(x.getUTCDate() + n)
  return paraDia(x)
}

export function somarMeses(d: string, n: number) {
  const x = paraData(d)
  x.setUTCDate(1)
  x.setUTCMonth(x.getUTCMonth() + n)
  return paraDia(x)
}

/** A semana do ENSPACE começa no domingo, como a grade do develop. */
export const inicioDaSemana = (d: string) => somarDias(d, -diaDaSemana(d))
export const diasEntre = (a: string, b: string) => Math.round((paraData(b).getTime() - paraData(a).getTime()) / 86400000)

/** Os dias de uma grade de mês: do domingo antes do dia 1 até completar 6 semanas. */
export function diasDoMes(d: string) {
  const primeiro = `${d.slice(0, 7)}-01`
  const inicio = inicioDaSemana(primeiro)
  return Array.from({ length: 42 }, (_, i) => somarDias(inicio, i))
}

/** 24 h em todo lugar (a tela de hoje mistura "9:00 AM" com "18:04"). */
export const hora = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
export const paraMinutos = (h: string) => {
  const [hh, mm] = h.split(':').map(Number)
  return (hh ?? 0) * 60 + (mm ?? 0)
}

const fmt = (locale: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...o })

export const diaLongo = (d: string, locale: string) => fmt(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(paraData(d))
export const diaCurto = (d: string, locale: string) => fmt(locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(paraData(d))
export const diaNumerico = (d: string, locale: string) => fmt(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(paraData(d))
export const nomeDoDiaCurto = (d: string, locale: string) => fmt(locale, { weekday: 'short' }).format(paraData(d)).replace('.', '')
export const nomeDoMes = (d: string, locale: string) => fmt(locale, { month: 'long', year: 'numeric' }).format(paraData(d))

/** Rótulo do período no topo: "25 a 31 de outubro de 2026", "28 de outubro de 2026", "outubro de 2026". */
export function rotuloDoPeriodo(vista: 'dia' | 'semana' | 'mes' | 'lista', d: string, locale: string) {
  if (vista === 'mes') return nomeDoMes(d, locale)
  if (vista === 'dia') return fmt(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(paraData(d))
  const inicio = vista === 'semana' ? inicioDaSemana(d) : d
  const fim = somarDias(inicio, vista === 'semana' ? 6 : 13)
  // O formatRange junta as pontas com travessão ("25 – 31"); a regra 33 pede palavra no lugar.
  const ligacao = locale.startsWith('en') ? ' to ' : ' a '
  return fmt(locale, { day: 'numeric', month: 'long', year: 'numeric' }).formatRange(paraData(inicio), paraData(fim)).replace(/\s*[–—]\s*/g, ligacao)
}

/** "1 h 30 min", na língua da tela. */
export function duracao(min: number, h: string, m: string) {
  const hh = Math.floor(min / 60)
  const mm = min % 60
  return [hh ? `${hh} ${h}` : '', mm ? `${mm} ${m}` : ''].filter(Boolean).join(' ')
}
