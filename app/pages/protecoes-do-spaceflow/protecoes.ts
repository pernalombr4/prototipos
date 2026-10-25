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
 *
 * Rodada 2: todo tempo tem unidade escolhida pela pessoa (`Duracao`), o limite
 * por dia virou uma das unidades do limite por período, "Limitar disparos por
 * item" virou um menu de 3 opções e o aviso "fila acima de N" saiu.
 */

/** O modo do nó de Início, como o develop chama (Manual, Ações de Itens, Webhook, E-mail recebido, Timer). */
export type Gatilho = 'itens' | 'webhook' | 'email' | 'timer' | 'manual'

export type UnidadeDeTempo = 'segundos' | 'minutos' | 'horas' | 'dias'
export interface Duracao { ativo: boolean, valor: number, unidade: UnidadeDeTempo }

/** O período do limite de volume. */
export type PeriodoDoLimite = 'segundo' | 'minuto' | 'hora' | 'dia'
/** O que fazer com o disparo que passa do limite de volume. */
export type Excedente = 'fila' | 'ignorar' | 'reter'
/** O que fazer quando todas as vagas de execução estão ocupadas. */
export type Lotado = 'esperar' | 'ignorar' | 'cancelarAnterior'
/** Timer: o horário chega com a execução anterior ainda em andamento. */
export type Sobreposicao = 'junto' | 'pular' | 'esperar'
/** Quando o mesmo item pode disparar o fluxo outra vez. */
export type RedisparoPorItem = 'sempre' | 'depoisDeTerminar' | 'nunca'
export type DuranteAPausa = 'guardar' | 'ignorar'
export type NoTetoDeIa = 'aprovar' | 'encerrar'
export type FrequenciaDeAviso = 'naHora' | 'porHora' | 'diario'
export type EventoDeAviso = 'segurou' | 'pausou' | 'cadeia' | 'tetoIa'
export type ModoDaJanela = 'comercial' | 'personalizado'

export interface Protecoes {
  volume: {
    limite: { ativo: boolean, maximo: number, periodo: PeriodoDoLimite }
    excedente: Excedente
    janela: { ativo: boolean, modo: ModoDaJanela, dias: number[], inicio: string, fim: string }
  }
  simultaneas: {
    ativo: boolean
    limite: number
    lotado: Lotado
    /** Ações de Itens: no máximo 1 execução em andamento por item. */
    porItem: boolean
    tempoNaFila: Duracao
    sobreposicao: Sobreposicao
  }
  repetidos: {
    webhook: Duracao & { chave: string }
    juntarEdicoes: Duracao
    redisparoPorItem: RedisparoPorItem
    emailRepetido: Duracao
  }
  cadeia: {
    /** Ações de Itens: mudança gravada por um fluxo não dispara este. E-mail: mensagem enviada por um fluxo do workspace não dispara este. */
    ignorarFluxos: boolean
    limite: { ativo: boolean, niveis: number }
  }
  erros: {
    tempoMaximo: Duracao
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
  }
}

/**
 * Os valores recomendados: com o que um fluxo novo nasce.
 * Números tirados do mercado (PESQUISA.md), não de medição do ENSPACE.
 */
export function protecoesRecomendadas(): Protecoes {
  return {
    volume: {
      limite: { ativo: true, maximo: 60, periodo: 'minuto' },
      excedente: 'fila',
      janela: { ativo: false, modo: 'comercial', dias: [1, 2, 3, 4, 5], inicio: '08:00', fim: '18:00' },
    },
    simultaneas: {
      ativo: true,
      limite: 10,
      lotado: 'esperar',
      porItem: true,
      tempoNaFila: { ativo: true, valor: 24, unidade: 'horas' },
      sobreposicao: 'pular',
    },
    repetidos: {
      webhook: { ativo: false, chave: 'id', valor: 24, unidade: 'horas' },
      juntarEdicoes: { ativo: false, valor: 2, unidade: 'minutos' },
      redisparoPorItem: 'sempre',
      emailRepetido: { ativo: false, valor: 10, unidade: 'minutos' },
    },
    cadeia: {
      ignorarFluxos: true,
      limite: { ativo: true, niveis: 10 },
    },
    erros: {
      tempoMaximo: { ativo: false, valor: 2, unidade: 'horas' },
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
  p.volume.limite.ativo = false
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
    case 'volume': return p.volume.limite.ativo || p.volume.janela.ativo
    case 'simultaneas': return p.simultaneas.ativo || (gatilho === 'itens' && p.simultaneas.porItem) || (gatilho === 'timer' && p.simultaneas.sobreposicao !== 'junto')
    case 'repetidos':
      if (gatilho === 'webhook') return p.repetidos.webhook.ativo
      if (gatilho === 'itens') return p.repetidos.juntarEdicoes.ativo || p.repetidos.redisparoPorItem !== 'sempre'
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

/** As faixas de cada número. Proposta do protótipo, sem medição (pergunta P2 dos requisitos). */
export const FAIXAS = {
  maximo: [1, 10000],
  simultaneas: [1, 500],
  duracao: [1, 999],
  niveis: [2, 50],
  erros: [1, 100],
  creditos: [1, 100000],
} as const

/** Número inteiro dentro dos limites do campo. Vazio ou fora dos limites é inválido. */
export function numeroValido(n: unknown, [min, max]: readonly [number, number]): boolean {
  return typeof n === 'number' && Number.isInteger(n) && n >= min && n <= max
}

export type Campo =
  | 'limite' | 'simultaneas' | 'tempoNaFila' | 'webhook' | 'juntarEdicoes' | 'emailRepetido'
  | 'niveis' | 'tempoMaximo' | 'erros' | 'iaExecucao' | 'iaDia' | 'destinatarios'

export interface CampoInvalido { secao: Secao, campo: Campo }

/** Confere os números das regras ligadas. O salvar fica bloqueado enquanto houver um inválido. */
export function validar(p: Protecoes): CampoInvalido[] {
  const erros: CampoInvalido[] = []
  const conf = (ok: boolean, secao: Secao, campo: Campo) => { if (!ok) erros.push({ secao, campo }) }
  if (p.volume.limite.ativo) conf(numeroValido(p.volume.limite.maximo, FAIXAS.maximo), 'volume', 'limite')
  if (p.simultaneas.ativo) conf(numeroValido(p.simultaneas.limite, FAIXAS.simultaneas), 'simultaneas', 'simultaneas')
  if (p.simultaneas.tempoNaFila.ativo) conf(numeroValido(p.simultaneas.tempoNaFila.valor, FAIXAS.duracao), 'simultaneas', 'tempoNaFila')
  if (p.repetidos.webhook.ativo) conf(numeroValido(p.repetidos.webhook.valor, FAIXAS.duracao), 'repetidos', 'webhook')
  if (p.repetidos.juntarEdicoes.ativo) conf(numeroValido(p.repetidos.juntarEdicoes.valor, FAIXAS.duracao), 'repetidos', 'juntarEdicoes')
  if (p.repetidos.emailRepetido.ativo) conf(numeroValido(p.repetidos.emailRepetido.valor, FAIXAS.duracao), 'repetidos', 'emailRepetido')
  if (p.cadeia.limite.ativo) conf(numeroValido(p.cadeia.limite.niveis, FAIXAS.niveis), 'cadeia', 'niveis')
  if (p.erros.tempoMaximo.ativo) conf(numeroValido(p.erros.tempoMaximo.valor, FAIXAS.duracao), 'erros', 'tempoMaximo')
  if (p.erros.pausarAposErros.ativo) conf(numeroValido(p.erros.pausarAposErros.erros, FAIXAS.erros), 'erros', 'erros')
  if (p.ia.porExecucao.ativo) conf(numeroValido(p.ia.porExecucao.creditos, FAIXAS.creditos), 'ia', 'iaExecucao')
  if (p.ia.porDia.ativo) conf(numeroValido(p.ia.porDia.creditos, FAIXAS.creditos), 'ia', 'iaDia')
  if (p.avisos.ativo) conf(p.avisos.destinatarios.length > 0, 'avisos', 'destinatarios')
  return erros
}
