/**
 * O dado da rodada 4 do submódulo Capturas: o que acontece depois da captura. Fictício, sem API.
 *
 * PROPOSTA (o schema não tem):
 * - a ligação do submódulo com a categoria que guarda os processos, feita ao ligar Capturas;
 * - a audiência que nasce da captura e vai para a Agenda, sem cálculo;
 * - os eventos que o submódulo entrega ao Spaceflow. É deles que partem os casos de uso do contencioso (subsídios,
 *   escritório externo, preposto, acordo), que continuam sendo configuração.
 *
 * Os nomes de categoria, de campo e de fluxo são dado do workspace e ficam em português nos 3 idiomas.
 */
import type { CategoriaId, TipoDeAudiencia, TipoDeMovimento } from './mocks'

/* ------------------------------------------------------------------ *
 * A categoria dos processos                                           *
 * ------------------------------------------------------------------ */

/** Os campos de que o submódulo precisa para ligar a captura ao processo e calcular o prazo. */
export type CampoExigido = 'numeroCnj' | 'tribunal' | 'orgao' | 'responsavel' | 'polo'
export type TipoDeCampo = 'texto' | 'lista' | 'pessoa' | 'moeda' | 'data'

export const camposExigidos: { id: CampoExigido, tipo: TipoDeCampo, obrigatorio: boolean }[] = [
  { id: 'numeroCnj', tipo: 'texto', obrigatorio: true },
  { id: 'tribunal', tipo: 'lista', obrigatorio: true },
  { id: 'orgao', tipo: 'texto', obrigatorio: false },
  { id: 'responsavel', tipo: 'pessoa', obrigatorio: true },
  { id: 'polo', tipo: 'lista', obrigatorio: true },
]

export interface CampoDaCategoria { nome: string, tipo: TipoDeCampo }

/** Os campos que cada categoria do workspace já tem. A categoria Processos não tem o polo, de propósito. */
export const camposDaCategoria: Partial<Record<CategoriaId, CampoDaCategoria[]>> = {
  processos: [
    { nome: 'Número do processo', tipo: 'texto' },
    { nome: 'Tribunal', tipo: 'lista' },
    { nome: 'Vara', tipo: 'texto' },
    { nome: 'Advogado responsável', tipo: 'pessoa' },
    { nome: 'Parte contrária', tipo: 'texto' },
    { nome: 'Valor da causa', tipo: 'moeda' },
    { nome: 'Área', tipo: 'lista' },
    { nome: 'Fase', tipo: 'lista' },
    { nome: 'Próximo prazo', tipo: 'data' },
    { nome: 'Risco', tipo: 'lista' },
  ],
  contratos: [
    { nome: 'Número do contrato', tipo: 'texto' },
    { nome: 'Contraparte', tipo: 'texto' },
    { nome: 'Gestor do contrato', tipo: 'pessoa' },
    { nome: 'Vigência', tipo: 'data' },
  ],
}

/** Quantos itens cada categoria tem no workspace fictício. Processos vem do mocks. */
export const itensPorCategoria: Partial<Record<CategoriaId, number>> = {
  contratos: 214, procuracoes: 37, consultas: 88, societario: 19, pagamentos: 142,
}

/** O campo que o submódulo cria quando a categoria não tem um que sirva. */
export const campoNovo: Record<CampoExigido, string> = {
  numeroCnj: 'Número CNJ', tribunal: 'Tribunal', orgao: 'Órgão julgador', responsavel: 'Responsável', polo: 'Polo da empresa',
}

/** A ligação sugerida: o campo da categoria com o mesmo tipo e o nome mais parecido. */
export function sugerirLigacao(categoria: CategoriaId): Record<CampoExigido, string | undefined> {
  const campos = camposDaCategoria[categoria] ?? []
  const achar = (tipo: TipoDeCampo, ...nomes: string[]) => campos.find(c => c.tipo === tipo && nomes.some(n => c.nome.toLowerCase().includes(n)))?.nome
  return {
    numeroCnj: achar('texto', 'número do processo', 'cnj'),
    tribunal: achar('lista', 'tribunal'),
    orgao: achar('texto', 'vara', 'órgão'),
    responsavel: achar('pessoa', 'responsável'),
    polo: achar('lista', 'polo'),
  }
}

/** Como o submódulo está ligado à categoria. `criados`: os campos que o submódulo acrescentou a ela. */
export interface LigacaoDaCategoria {
  categoria: CategoriaId
  origem: 'existente' | 'casoDeUso'
  campos: Record<CampoExigido, string | undefined>
  criados: CampoExigido[]
}

export const ligacaoInicial: LigacaoDaCategoria = {
  categoria: 'processos',
  origem: 'existente',
  campos: { numeroCnj: 'Número do processo', tribunal: 'Tribunal', orgao: 'Vara', responsavel: 'Advogado responsável', polo: 'Polo da empresa' },
  criados: ['polo'],
}

/* ------------------------------------------------------------------ *
 * Audiências                                                          *
 * ------------------------------------------------------------------ */

/** PROPOSTA: a audiência registrada a partir de uma captura. Vira item da categoria Audiências e entra na Agenda. */
export interface Audiencia {
  id: number
  processo: number
  tipo: TipoDeAudiencia
  dia: string
  hora: string
  local?: string
  captura: number
}

/* ------------------------------------------------------------------ *
 * Eventos para o Spaceflow                                            *
 * ------------------------------------------------------------------ */

export type EventoId = 'capturaTratada' | 'citacaoConfirmada' | 'processoCadastrado' | 'andamentoRegistrado' | 'audienciaRegistrada'

/** O que cada evento leva ao fluxo. Nomes de campo da API, iguais nos 3 idiomas. */
export const eventosDoSubmodulo: { id: EventoId, icone: string, dados: string[] }[] = [
  { id: 'citacaoConfirmada', icone: 'i-lucide-mail-check', dados: ['captura.id', 'processo.id', 'citacao.confirmadaEm', 'audiencia.dia', 'resposta.marco'] },
  { id: 'processoCadastrado', icone: 'i-lucide-file-plus-2', dados: ['processo.id', 'processo.numeroCnj', 'processo.valorDaCausa', 'captura.tipo', 'inicial.url'] },
  { id: 'capturaTratada', icone: 'i-lucide-circle-check', dados: ['captura.id', 'captura.tipo', 'processo.id', 'prazo.fatal', 'prazo.responsavel'] },
  { id: 'andamentoRegistrado', icone: 'i-lucide-list-checks', dados: ['captura.id', 'processo.id', 'movimento.tipo', 'movimento.dia', 'movimento.texto'] },
  { id: 'audienciaRegistrada', icone: 'i-lucide-calendar-clock', dados: ['audiencia.id', 'audiencia.tipo', 'audiencia.dia', 'audiencia.hora', 'processo.id'] },
]

/** Os fluxos do workspace que usam os eventos como gatilho. São configuração, do caso de uso Contencioso. */
export interface Fluxo { id: number, nome: string, evento: EventoId, filtro?: TipoDeMovimento }
export const fluxos: Fluxo[] = [
  { id: 1, nome: 'Pedir subsídios à área', evento: 'citacaoConfirmada' },
  { id: 2, nome: 'Designar escritório externo', evento: 'processoCadastrado' },
  { id: 3, nome: 'Designar preposto', evento: 'audienciaRegistrada' },
  { id: 4, nome: 'Avisar a controladoria', evento: 'andamentoRegistrado', filtro: 'sentenca' },
]
export const fluxoPorId = new Map(fluxos.map(f => [f.id, f]))

/** PROPOSTA: cada evento entregue fica registrado na captura, com os fluxos que ele disparou. */
export interface Disparo { id: number, quando: Date, evento: EventoId, captura?: number, processo?: number, fluxos: number[] }

/** A citação 930 foi confirmada em 23/10, e o fluxo de subsídios já começou. */
export const disparosIniciais: Disparo[] = [
  { id: 1, quando: new Date(2026, 9, 23, 9, 12), evento: 'citacaoConfirmada', captura: 930, processo: 4119, fluxos: [1] },
]
