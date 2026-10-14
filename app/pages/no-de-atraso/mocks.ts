/**
 * O dado do protótipo "Nó de Atraso". Fictício, tipado pelo SDK, sem API.
 *
 * Estrutura tirada do develop em 14/10/2026 (workspace de exploração, fluxo de
 * teste 524): o nó `delay` guarda hoje `{ label, delay, unit }`, com `delay`
 * aceitando texto ou número (por isso "abc" grava sem erro) e `unit` em
 * segundos, minutos, horas ou dias.
 *
 * Os campos novos do nó, a proposta, estão em `EsperaAteData` e vão marcados.
 * As empresas e os números dos contratos são inventados.
 */
import type { Field, Item, Workflow, WorkflowNode } from '@be-enlighten/enspace-sdk-schemas'

/** O "agora" do protótipo. Fixo, para a prévia dar sempre o mesmo resultado. */
export const AGORA = new Date(2026, 9, 14, 10, 30)

export const workspace = { nome: 'Jurídico Aurora', slug: 'juridico-aurora' }

/* ------------------------------------------------------------------ *
 * O nó como ele é hoje                                                *
 * ------------------------------------------------------------------ */

export type NoDeAtraso = Extract<WorkflowNode, { type: 'delay' }>
export type Unidade = NoDeAtraso['data']['unit']

/** O nó que se arrasta da paleta: o develop abre com Unidade "Dias" e a quantidade vazia. */
export function noDeAtrasoNovo(): NoDeAtraso {
  return { id: 'delay-1', type: 'delay', position: { x: 420, y: 140 }, data: { label: 'Atraso', delay: '', unit: 'day' } }
}

/* ------------------------------------------------------------------ *
 * A proposta: o que o nó passa a guardar                              *
 * ------------------------------------------------------------------ */

export type ModoDeEspera = 'duration' | 'until_date'
export type Direcao = 'before' | 'after' | 'on'
export type UnidadeDoDeslocamento = 'hour' | 'day' | 'week' | 'month'

/**
 * PROPOSTA. Nada disto existe no schema do nó `delay` hoje. Entra no `data`
 * do nó ao lado de `label`, `delay` e `unit`, que continuam valendo para o
 * modo "por um tempo".
 */
export interface EsperaAteData {
  /** "por um tempo" (o de hoje) ou "até uma data do item". */
  mode: ModoDeEspera
  /** O campo de data, como `<id do nó>.<refId do campo>`. Nulo até a pessoa escolher. */
  date_source: string | null
  offset_amount: number
  offset_unit: UnidadeDoDeslocamento
  offset_direction: Direcao
  /** 'HH:mm' no fuso do workspace, ou 'field' para usar a hora gravada no campo. */
  time: string
  if_past: 'continue' | 'end'
  if_empty: 'end' | 'continue'
  /** Recalcula a espera quando o campo muda durante ela. */
  recalculate: boolean
}

export type ConfiguracaoDoAtraso = NoDeAtraso['data'] & EsperaAteData

export function configuracaoNova(): ConfiguracaoDoAtraso {
  return {
    ...noDeAtrasoNovo().data,
    mode: 'duration',
    date_source: null,
    offset_amount: 30,
    offset_unit: 'day',
    offset_direction: 'before',
    time: '09:00',
    if_past: 'continue',
    if_empty: 'end',
    recalculate: true,
  }
}

/** O caso do cliente, já preenchido: 30 dias antes do vencimento, às 9h. */
export function configuracaoDoCliente(): ConfiguracaoDoAtraso {
  return {
    ...configuracaoNova(),
    label: 'Aguardar 30 dias antes do vencimento',
    mode: 'until_date',
    date_source: 'start.data_de_vencimento',
  }
}

/* ------------------------------------------------------------------ *
 * O fluxo                                                             *
 * ------------------------------------------------------------------ */

export const fluxo: Pick<Workflow, 'id' | 'name' | 'status' | 'version'> = {
  id: 524,
  name: 'Aviso de vencimento de contrato',
  status: 'active',
  version: 'v0.0.1',
}

/* ------------------------------------------------------------------ *
 * Os campos de data que chegam até o Atraso                           *
 * ------------------------------------------------------------------ */

/**
 * Um campo de data disponível como variável. `rotulo` vem do `label` do
 * campo; `comHora` diz se o campo guarda hora (EnlCalendar com hora, ou as
 * datas de sistema).
 */
export interface CampoDeData extends Pick<Field, 'refId' | 'type' | 'label'> {
  /** Inventado pelo protótipo: o nó de onde a variável vem. */
  no: { id: string, rotulo: string }
  comHora: boolean
  /** Inventado pelo protótipo: data de sistema do item (criado, atualizado). */
  sistema?: boolean
}

const doInicio = { id: 'start', rotulo: 'Início' }

export const camposDeData: CampoDeData[] = [
  { refId: 'data_de_vencimento', type: 'EnlCalendar', label: 'Data de vencimento', no: doInicio, comHora: false },
  { refId: 'inicio_da_vigencia', type: 'EnlCalendar', label: 'Início da vigência', no: doInicio, comHora: false },
  { refId: 'data_de_assinatura', type: 'EnlCalendar', label: 'Data de assinatura', no: doInicio, comHora: false },
  { refId: 'prazo_para_aviso_de_rescisao', type: 'EnlCalendar', label: 'Prazo para aviso de rescisão', no: doInicio, comHora: false },
  { refId: 'created_at', type: 'EnlCalendar', label: 'Criado em', no: doInicio, comHora: true, sistema: true },
  { refId: 'updated_at', type: 'EnlCalendar', label: 'Atualizado em', no: doInicio, comHora: true, sistema: true },
]

export function chaveDoCampo(c: CampoDeData) {
  return `${c.no.id}.${c.refId}`
}

/* ------------------------------------------------------------------ *
 * Os contratos que a prévia usa                                       *
 * ------------------------------------------------------------------ */

/** Um contrato aberto, com as datas que a prévia lê. `data` segue o formato do Item. */
export type Contrato = Pick<Item, 'id' | 'reference' | 'status'> & {
  data: {
    titulo: string
    contratante: string
    /** 'AAAA-MM-DD' ou null quando ninguém preencheu. */
    data_de_vencimento: string | null
    inicio_da_vigencia: string | null
    data_de_assinatura: string | null
    prazo_para_aviso_de_rescisao: string | null
  }
  created_at: string
  updated_at: string
}

const empresas = [
  'Transportes Serra Azul', 'Clínica Vida Plena', 'Construtora Horizonte Norte', 'Laticínios Vale Verde',
  'Agência Faro Digital', 'Metalúrgica Duas Pontes', 'Escola Nova Trilha', 'Hotel Mirante do Sol',
  'Farmácia Bem Estar', 'Logística Rota Sul', 'Padaria Trigo de Ouro', 'Cooperativa Agro Planalto',
  'Instituto de Pesquisas Atlântico Sul e Fundação para o Desenvolvimento Regional',
  'Ótica Visão Clara', 'Gráfica Papel e Tinta', 'Auto Peças Cardoso',
]
const objetos = [
  'Prestação de serviços de limpeza', 'Locação de imóvel comercial', 'Licença de software', 'Manutenção predial',
  'Fornecimento de insumos', 'Consultoria tributária', 'Transporte de cargas', 'Segurança patrimonial',
]

function iso(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
function diasDepois(base: Date, dias: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + dias)
  return d
}

/**
 * 40 contratos abertos. A distância até o vencimento cobre os casos de
 * propósito: longe (meses e anos), perto (menos de 30 dias), vencido e sem
 * data. O CT-0042 é o do exemplo do cliente: vence em 15/03/2027.
 */
const distancias = [
  152, 365, 730, 45, 12, 400, 95, 210, 28, -6, 540, 31, 60, 300, 900, 75, null, 180, 3, 250,
  120, 455, 33, 610, null, 88, 14, 200, 365, 47, 720, 160, -40, 270, 99, 30, 500, 66, 1095, null,
]

export const contratos: Contrato[] = distancias.map((dist, i) => {
  const n = 18 + i
  const reference = `CT-${String(n).padStart(4, '0')}`
  const vencimento = reference === 'CT-0042'
    ? new Date(2027, 2, 15)
    : dist === null ? null : diasDepois(AGORA, dist)
  const assinatura = diasDepois(AGORA, -(20 + (i * 37) % 700))
  return {
    id: 9100 + n,
    reference,
    status: 'active',
    data: {
      titulo: `${objetos[i % objetos.length]}`,
      contratante: empresas[i % empresas.length]!,
      data_de_vencimento: vencimento ? iso(vencimento) : null,
      inicio_da_vigencia: iso(diasDepois(assinatura, 5)),
      data_de_assinatura: iso(assinatura),
      prazo_para_aviso_de_rescisao: vencimento ? iso(diasDepois(vencimento, -60)) : null,
    },
    created_at: diasDepois(AGORA, -(i % 9)).toISOString(),
    updated_at: diasDepois(AGORA, -(i % 4)).toISOString(),
  }
})
