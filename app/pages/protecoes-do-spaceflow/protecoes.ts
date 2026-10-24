/**
 * O modelo das Proteções de um fluxo do Spaceflow.
 *
 * ⚠️ Tudo aqui é proposta. O `Workflow` do `enspace-sdk-schemas` tem `settings`
 * como objeto livre (`z.ZodObject<{}, $loose>`); este é o formato sugerido para
 * guardar as proteções dentro dele, em `settings.protections`. Nenhum campo
 * abaixo existe hoje.
 *
 * O MVP usa o mesmo modelo: ele esconde campos e fixa o valor deles (ver
 * `valoresFixosDoMvp`).
 */

/** O modo do nó de Início, como o develop chama (Manual, Ações de Itens, Webhook, E-mail recebido, Timer). */
export type Gatilho = 'itens' | 'webhook' | 'email' | 'timer' | 'manual'

/** O que fazer com o disparo que passa do limite de volume. */
export type Excedente = 'fila' | 'ignorar' | 'reter'
/** O que fazer quando todas as vagas de execução estão ocupadas. */
export type Lotado = 'esperar' | 'ignorar' | 'cancelarAnterior'
/** Timer: o horário chega com a execução anterior ainda em andamento. */
export type Sobreposicao = 'junto' | 'pular' | 'esperar'
export type DuranteAPausa = 'guardar' | 'ignorar'
export type NoTetoDeIa = 'aprovar' | 'encerrar'
export type FrequenciaDeAviso = 'naHora' | 'porHora' | 'diario'
export type EventoDeAviso = 'segurou' | 'pausou' | 'cadeia' | 'tetoIa' | 'fila'
export type PeriodoDoLimite = 'minuto' | 'hora'
export type ModoDaJanela = 'comercial' | 'personalizado'
export type UmaVezPorItem = 'nunca' | 'depoisDeTerminar'

export interface Protecoes {
  volume: {
    porPeriodo: { ativo: boolean, limite: number, periodo: PeriodoDoLimite }
    porDia: { ativo: boolean, limite: number }
    excedente: Excedente
    janela: { ativo: boolean, modo: ModoDaJanela, dias: number[], inicio: string, fim: string }
  }
  simultaneas: {
    ativo: boolean
    limite: number
    lotado: Lotado
    /** Ações de Itens: no máximo 1 execução em andamento por item. */
    porItem: boolean
    tempoNaFila: { ativo: boolean, horas: number }
    sobreposicao: Sobreposicao
  }
  repetidos: {
    webhook: { ativo: boolean, chave: string, horas: number }
    juntarEdicoes: { ativo: boolean, minutos: number }
    umaVezPorItem: { ativo: boolean, modo: UmaVezPorItem }
    emailRepetido: { ativo: boolean, minutos: number }
  }
  cadeia: {
    /** Ações de Itens: mudança gravada por um fluxo não dispara este. E-mail: mensagem enviada por um fluxo do workspace não dispara este. */
    ignorarFluxos: boolean
    limite: { ativo: boolean, niveis: number }
  }
  erros: {
    tempoMaximo: { ativo: boolean, horas: number }
    pausarAposErros: { ativo: boolean, erros: number }
    duranteAPausa: DuranteAPausa
  }
  ia: {
    porExecucao: { ativo: boolean, creditos: number }
    porDia: { ativo: boolean, creditos: number }
    noTeto: NoTetoDeIa
  }
  avisos: {
    ativo: boolean
    /** ids de `destinatariosPossiveis` em mocks.ts */
    destinatarios: string[]
    frequencia: FrequenciaDeAviso
    eventos: EventoDeAviso[]
    filaAcimaDe: number
  }
}

/**
 * Os valores recomendados: com o que um fluxo novo nasce.
 * Números tirados do mercado (PESQUISA.md), não de medição do ENSPACE.
 */
export function protecoesRecomendadas(): Protecoes {
  return {
    volume: {
      porPeriodo: { ativo: true, limite: 60, periodo: 'minuto' },
      porDia: { ativo: false, limite: 5000 },
      excedente: 'fila',
      janela: { ativo: false, modo: 'comercial', dias: [1, 2, 3, 4, 5], inicio: '08:00', fim: '18:00' },
    },
    simultaneas: {
      ativo: true,
      limite: 10,
      lotado: 'esperar',
      porItem: true,
      tempoNaFila: { ativo: true, horas: 24 },
      sobreposicao: 'pular',
    },
    repetidos: {
      webhook: { ativo: false, chave: 'id', horas: 24 },
      juntarEdicoes: { ativo: false, minutos: 2 },
      umaVezPorItem: { ativo: false, modo: 'depoisDeTerminar' },
      emailRepetido: { ativo: false, minutos: 10 },
    },
    cadeia: {
      ignorarFluxos: true,
      limite: { ativo: true, niveis: 10 },
    },
    erros: {
      tempoMaximo: { ativo: false, horas: 2 },
      pausarAposErros: { ativo: true, erros: 3 },
      duranteAPausa: 'guardar',
    },
    ia: {
      porExecucao: { ativo: true, creditos: 50 },
      porDia: { ativo: false, creditos: 1000 },
      noTeto: 'aprovar',
    },
    avisos: {
      ativo: true,
      destinatarios: ['dono'],
      frequencia: 'naHora',
      eventos: ['segurou', 'pausou', 'cadeia', 'tetoIa'],
      filaAcimaDe: 100,
    },
  }
}

/**
 * Fluxo que já existe quando a funcionalidade chega: só a Repetição sem fim e
 * os avisos nascem ligados. Volume e execuções ao mesmo tempo ficam como hoje
 * (sem limite), para não mudar o comportamento de um fluxo que já roda em
 * cliente. Decisão registrada no DECISOES.md.
 */
export function protecoesDeFluxoExistente(): Protecoes {
  const p = protecoesRecomendadas()
  p.volume.porPeriodo.ativo = false
  p.simultaneas.ativo = false
  p.simultaneas.porItem = false
  p.simultaneas.sobreposicao = 'junto'
  p.erros.pausarAposErros.ativo = false
  p.ia.porExecucao.ativo = false
  return p
}

/** O que o MVP não pergunta: o valor fica fixo e a tela diz qual é. */
export const valoresFixosDoMvp = {
  excedente: 'fila' as Excedente,
  lotado: 'esperar' as Lotado,
  duranteAPausa: 'guardar' as DuranteAPausa,
  frequencia: 'naHora' as FrequenciaDeAviso,
  destinatarios: ['dono'],
}

export type Secao = 'volume' | 'simultaneas' | 'repetidos' | 'cadeia' | 'erros' | 'ia' | 'avisos'
export const secoesCompletas: Secao[] = ['volume', 'simultaneas', 'repetidos', 'cadeia', 'erros', 'ia', 'avisos']
export const secoesDoMvp: Secao[] = ['volume', 'simultaneas', 'cadeia', 'erros', 'avisos']

export const secaoIcone: Record<Secao, string> = {
  volume: 'i-lucide-gauge',
  simultaneas: 'i-lucide-layers',
  repetidos: 'i-lucide-copy-x',
  cadeia: 'i-lucide-repeat',
  erros: 'i-lucide-octagon-alert',
  ia: 'i-lucide-sparkles',
  avisos: 'i-lucide-bell',
}

/** A seção tem alguma regra ligada? Alimenta o ponto do índice lateral. */
export function secaoLigada(p: Protecoes, s: Secao, gatilho: Gatilho): boolean {
  switch (s) {
    case 'volume': return p.volume.porPeriodo.ativo || p.volume.porDia.ativo || p.volume.janela.ativo
    case 'simultaneas': return p.simultaneas.ativo || (gatilho === 'itens' && p.simultaneas.porItem) || (gatilho === 'timer' && p.simultaneas.sobreposicao !== 'junto')
    case 'repetidos':
      if (gatilho === 'webhook') return p.repetidos.webhook.ativo
      if (gatilho === 'itens') return p.repetidos.juntarEdicoes.ativo || p.repetidos.umaVezPorItem.ativo
      if (gatilho === 'email') return p.repetidos.emailRepetido.ativo
      return false
    case 'cadeia': return p.cadeia.limite.ativo || ((gatilho === 'itens' || gatilho === 'email') && p.cadeia.ignorarFluxos)
    case 'erros': return p.erros.tempoMaximo.ativo || p.erros.pausarAposErros.ativo
    case 'ia': return p.ia.porExecucao.ativo || p.ia.porDia.ativo
    case 'avisos': return p.avisos.ativo
  }
}

/** Quantos campos mudaram desde o último salvar. Conta folhas do objeto. */
export function contarDiferencas(a: unknown, b: unknown): number {
  if (Array.isArray(a) || Array.isArray(b)) return JSON.stringify(a) === JSON.stringify(b) ? 0 : 1
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const chaves = new Set([...Object.keys(a), ...Object.keys(b)])
    let n = 0
    for (const k of chaves) n += contarDiferencas((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])
    return n
  }
  return a === b ? 0 : 1
}

/** Número inteiro dentro dos limites do campo. Vazio ou fora dos limites é inválido. */
export function numeroValido(n: unknown, min: number, max: number): boolean {
  return typeof n === 'number' && Number.isInteger(n) && n >= min && n <= max
}

export interface CampoInvalido { secao: Secao, campo: string }

/** Confere os números das regras ligadas. O salvar fica bloqueado enquanto houver um inválido. */
export function validar(p: Protecoes): CampoInvalido[] {
  const erros: CampoInvalido[] = []
  const conf = (ok: boolean, secao: Secao, campo: string) => { if (!ok) erros.push({ secao, campo }) }
  if (p.volume.porPeriodo.ativo) conf(numeroValido(p.volume.porPeriodo.limite, 1, 10000), 'volume', 'porPeriodo')
  if (p.volume.porDia.ativo) conf(numeroValido(p.volume.porDia.limite, 1, 1000000), 'volume', 'porDia')
  if (p.simultaneas.ativo) conf(numeroValido(p.simultaneas.limite, 1, 500), 'simultaneas', 'limite')
  if (p.simultaneas.tempoNaFila.ativo) conf(numeroValido(p.simultaneas.tempoNaFila.horas, 1, 168), 'simultaneas', 'tempoNaFila')
  if (p.repetidos.webhook.ativo) conf(numeroValido(p.repetidos.webhook.horas, 1, 720), 'repetidos', 'webhook')
  if (p.repetidos.juntarEdicoes.ativo) conf(numeroValido(p.repetidos.juntarEdicoes.minutos, 1, 60), 'repetidos', 'juntarEdicoes')
  if (p.repetidos.emailRepetido.ativo) conf(numeroValido(p.repetidos.emailRepetido.minutos, 1, 1440), 'repetidos', 'emailRepetido')
  if (p.cadeia.limite.ativo) conf(numeroValido(p.cadeia.limite.niveis, 2, 50), 'cadeia', 'niveis')
  if (p.erros.tempoMaximo.ativo) conf(numeroValido(p.erros.tempoMaximo.horas, 1, 720), 'erros', 'tempoMaximo')
  if (p.erros.pausarAposErros.ativo) conf(numeroValido(p.erros.pausarAposErros.erros, 1, 100), 'erros', 'pausarAposErros')
  if (p.ia.porExecucao.ativo) conf(numeroValido(p.ia.porExecucao.creditos, 1, 100000), 'ia', 'porExecucao')
  if (p.ia.porDia.ativo) conf(numeroValido(p.ia.porDia.creditos, 1, 1000000), 'ia', 'porDia')
  if (p.avisos.ativo) conf(p.avisos.destinatarios.length > 0, 'avisos', 'destinatarios')
  return erros
}
