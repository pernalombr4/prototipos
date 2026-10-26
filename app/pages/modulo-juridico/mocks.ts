/**
 * O dado do protótipo "Módulo Jurídico". Fictício, tipado pelo SDK, sem API.
 *
 * Estrutura:
 * - o processo é um `Item` da categoria Processos, que vem do caso de uso Contencioso (estrutura, não módulo);
 * - o prazo confirmado é uma `Task` com `due_date` no prazo interno: o módulo não cria um objeto novo de tarefa, ele
 *   calcula a data da tarefa que já existe;
 * - PROPOSTA (o schema não tem, vem do módulo): `Regra`, `Tribunal`, `Suspensao`, `Intimacao`, `Prazo.entrada`,
 *   `Prazo.historico` e as datas-base da provisão.
 *
 * Feriados nacionais de 2026: calendário oficial. Feriados dos tribunais: os da Justiça Federal vêm da Lei
 * 5.010/1966, art. 62; os dos tribunais estaduais e do trabalho são EXEMPLO, marcados na fonte. Empresa, pessoas,
 * processos, números CNJ, valores e teores são inventados. Nomes de categoria, regra e órgão são dado do pacote e
 * ficam em português nos 3 idiomas.
 */
import type { Item, Task } from '@be-enlighten/enspace-sdk-schemas'

/** O "agora" do protótipo: segunda-feira, 26/10/2026, 10:00. Fixo, para os cálculos não mudarem. */
export const HOJE = '2026-10-26'
export const AGORA = new Date(2026, 9, 26, 10, 0)

export const workspace = { nome: 'Grupo Aurora', slug: 'grupo-aurora' }

/* ------------------------------------------------------------------ *
 * Pessoas                                                             *
 * ------------------------------------------------------------------ */

export interface Pessoa { id: number, nome: string, iniciais: string, papel: string }

export const pessoas: Pessoa[] = [
  { id: 11, nome: 'Ana Ribeiro', iniciais: 'AR', papel: 'Coordenadora do contencioso' },
  { id: 12, nome: 'Bruno Tavares', iniciais: 'BT', papel: 'Advogado' },
  { id: 13, nome: 'Carla Nunes', iniciais: 'CN', papel: 'Advogada trabalhista' },
  { id: 14, nome: 'Diego Moura', iniciais: 'DM', papel: 'Paralegal' },
  { id: 15, nome: 'Elisa Campos', iniciais: 'EC', papel: 'Controladoria' },
]
export const pessoaPorId = new Map(pessoas.map(p => [p.id, p]))
/** Quem está usando o protótipo. */
export const EU = 11

/* ------------------------------------------------------------------ *
 * Categorias (vêm dos casos de uso jurídicos, não do módulo)          *
 * ------------------------------------------------------------------ */

export type CategoriaId = 'processos' | 'andamentos' | 'audiencias' | 'contratos' | 'procuracoes' | 'consultas' | 'societario' | 'pagamentos'

export const categorias: { id: CategoriaId, nome: string, icone: string }[] = [
  { id: 'processos', nome: 'Processos', icone: 'i-lucide-gavel' },
  { id: 'andamentos', nome: 'Andamentos', icone: 'i-lucide-list-checks' },
  { id: 'audiencias', nome: 'Audiências', icone: 'i-lucide-calendar-clock' },
  { id: 'contratos', nome: 'Contratos', icone: 'i-lucide-file-signature' },
  { id: 'procuracoes', nome: 'Procurações', icone: 'i-lucide-stamp' },
  { id: 'consultas', nome: 'Consultas jurídicas', icone: 'i-lucide-messages-square' },
  { id: 'societario', nome: 'Societário', icone: 'i-lucide-building-2' },
  { id: 'pagamentos', nome: 'Pagamentos jurídicos', icone: 'i-lucide-banknote' },
]

/* ------------------------------------------------------------------ *
 * Pacote Brasil: regras de prazo                                      *
 * ------------------------------------------------------------------ */

export type Rito = 'cpc' | 'clt' | 'jec' | 'cpp' | 'adm'
export type RegraId =
  | 'cpc-contestacao' | 'cpc-manifestacao' | 'cpc-embargos' | 'cpc-apelacao' | 'cpc-contrarrazoes' | 'cpc-pagamento'
  | 'clt-ro' | 'clt-embargos' | 'clt-manifestacao' | 'jec-recurso' | 'cpp-resposta' | 'adm-alegacoes'

/** PROPOSTA: a regra declarada. Dado do pacote do país, versionado. */
export interface Regra {
  id: RegraId
  rito: Rito
  ato: string
  dias: number
  unidade: 'uteis' | 'corridos'
  fundamento: string
}

export const regras: Regra[] = [
  { id: 'cpc-contestacao', rito: 'cpc', ato: 'Contestação', dias: 15, unidade: 'uteis', fundamento: 'CPC, art. 335' },
  { id: 'cpc-manifestacao', rito: 'cpc', ato: 'Manifestação', dias: 5, unidade: 'uteis', fundamento: 'CPC, art. 218, § 3º' },
  { id: 'cpc-embargos', rito: 'cpc', ato: 'Embargos de declaração', dias: 5, unidade: 'uteis', fundamento: 'CPC, art. 1.023' },
  { id: 'cpc-apelacao', rito: 'cpc', ato: 'Apelação', dias: 15, unidade: 'uteis', fundamento: 'CPC, art. 1.003, § 5º' },
  { id: 'cpc-contrarrazoes', rito: 'cpc', ato: 'Contrarrazões', dias: 15, unidade: 'uteis', fundamento: 'CPC, art. 1.010, § 1º' },
  { id: 'cpc-pagamento', rito: 'cpc', ato: 'Pagamento voluntário', dias: 15, unidade: 'uteis', fundamento: 'CPC, art. 523' },
  { id: 'clt-ro', rito: 'clt', ato: 'Recurso ordinário', dias: 8, unidade: 'uteis', fundamento: 'CLT, art. 895' },
  { id: 'clt-embargos', rito: 'clt', ato: 'Embargos de declaração', dias: 5, unidade: 'uteis', fundamento: 'CLT, art. 897-A' },
  { id: 'clt-manifestacao', rito: 'clt', ato: 'Manifestação', dias: 5, unidade: 'uteis', fundamento: 'CLT, art. 775' },
  { id: 'jec-recurso', rito: 'jec', ato: 'Recurso inominado', dias: 10, unidade: 'uteis', fundamento: 'Lei 9.099/1995, arts. 12-A e 42' },
  { id: 'cpp-resposta', rito: 'cpp', ato: 'Resposta à acusação', dias: 10, unidade: 'corridos', fundamento: 'CPP, arts. 396 e 798' },
  { id: 'adm-alegacoes', rito: 'adm', ato: 'Alegações finais', dias: 10, unidade: 'corridos', fundamento: 'Lei 9.784/1999, arts. 44 e 66' },
]
export const regraPorId = new Map(regras.map(r => [r.id, r]))

export const VERSAO_DO_PACOTE = '2026.10'

/* ------------------------------------------------------------------ *
 * Pacote Brasil: tribunais e calendário forense                       *
 * ------------------------------------------------------------------ */

export type TribunalId = 'tjsp' | 'tjrj' | 'tjmg' | 'tjam' | 'trt2' | 'trt15' | 'trf3'

export interface Feriado { dia: string, nome: string, fonte: string }

/** PROPOSTA: o tribunal com o próprio calendário e o próprio fuso. */
export interface Tribunal {
  id: TribunalId
  sigla: string
  nome: string
  justica: 'estadual' | 'trabalho' | 'federal'
  fuso: string
  feriados: Feriado[]
}

const EXEMPLO = 'Provimento do tribunal (exemplo do protótipo)'

export const feriadosNacionais: Feriado[] = [
  { dia: '2026-01-01', nome: 'Confraternização Universal', fonte: 'Lei 662/1949' },
  { dia: '2026-02-16', nome: 'Carnaval', fonte: 'Res. CNJ 244/2016' },
  { dia: '2026-02-17', nome: 'Carnaval', fonte: 'Res. CNJ 244/2016' },
  { dia: '2026-04-03', nome: 'Paixão de Cristo', fonte: 'Lei 9.093/1995' },
  { dia: '2026-04-21', nome: 'Tiradentes', fonte: 'Lei 662/1949' },
  { dia: '2026-05-01', nome: 'Dia do Trabalho', fonte: 'Lei 662/1949' },
  { dia: '2026-06-04', nome: 'Corpus Christi', fonte: 'Res. CNJ 244/2016' },
  { dia: '2026-09-07', nome: 'Independência', fonte: 'Lei 662/1949' },
  { dia: '2026-10-12', nome: 'Nossa Senhora Aparecida', fonte: 'Lei 6.802/1980' },
  { dia: '2026-11-02', nome: 'Finados', fonte: 'Lei 662/1949' },
  { dia: '2026-11-15', nome: 'Proclamação da República', fonte: 'Lei 662/1949' },
  { dia: '2026-11-20', nome: 'Consciência Negra', fonte: 'Lei 14.759/2023' },
  { dia: '2026-12-08', nome: 'Dia da Justiça', fonte: 'Lei 1.408/1951' },
  { dia: '2026-12-25', nome: 'Natal', fonte: 'Lei 662/1949' },
]

export const tribunais: Record<TribunalId, Tribunal> = {
  tjsp: {
    id: 'tjsp', sigla: 'TJSP', nome: 'Tribunal de Justiça de São Paulo', justica: 'estadual', fuso: 'America/Sao_Paulo',
    feriados: [
      { dia: '2026-07-09', nome: 'Revolução Constitucionalista', fonte: EXEMPLO },
      { dia: '2026-10-28', nome: 'Dia do Servidor Público', fonte: EXEMPLO },
    ],
  },
  tjrj: {
    id: 'tjrj', sigla: 'TJRJ', nome: 'Tribunal de Justiça do Rio de Janeiro', justica: 'estadual', fuso: 'America/Sao_Paulo',
    feriados: [
      { dia: '2026-04-23', nome: 'São Jorge', fonte: EXEMPLO },
      { dia: '2026-10-28', nome: 'Dia do Servidor Público', fonte: EXEMPLO },
    ],
  },
  tjmg: {
    id: 'tjmg', sigla: 'TJMG', nome: 'Tribunal de Justiça de Minas Gerais', justica: 'estadual', fuso: 'America/Sao_Paulo',
    feriados: [
      { dia: '2026-08-15', nome: 'Assunção de Nossa Senhora', fonte: EXEMPLO },
    ],
  },
  tjam: {
    id: 'tjam', sigla: 'TJAM', nome: 'Tribunal de Justiça do Amazonas', justica: 'estadual', fuso: 'America/Manaus',
    feriados: [
      { dia: '2026-09-05', nome: 'Elevação do Amazonas a província', fonte: EXEMPLO },
      { dia: '2026-10-24', nome: 'Aniversário de Manaus', fonte: EXEMPLO },
    ],
  },
  trt2: {
    id: 'trt2', sigla: 'TRT-2', nome: 'Tribunal Regional do Trabalho da 2ª Região', justica: 'trabalho', fuso: 'America/Sao_Paulo',
    feriados: [
      { dia: '2026-07-09', nome: 'Revolução Constitucionalista', fonte: EXEMPLO },
      { dia: '2026-10-30', nome: 'Dia do Servidor Público (transferido)', fonte: EXEMPLO },
    ],
  },
  trt15: {
    id: 'trt15', sigla: 'TRT-15', nome: 'Tribunal Regional do Trabalho da 15ª Região', justica: 'trabalho', fuso: 'America/Sao_Paulo',
    feriados: [
      { dia: '2026-07-09', nome: 'Revolução Constitucionalista', fonte: EXEMPLO },
    ],
  },
  trf3: {
    id: 'trf3', sigla: 'TRF-3', nome: 'Tribunal Regional Federal da 3ª Região', justica: 'federal', fuso: 'America/Sao_Paulo',
    feriados: [
      { dia: '2026-04-01', nome: 'Semana Santa', fonte: 'Lei 5.010/1966, art. 62, II' },
      { dia: '2026-04-02', nome: 'Semana Santa', fonte: 'Lei 5.010/1966, art. 62, II' },
      { dia: '2026-08-11', nome: 'Dia do Advogado', fonte: 'Lei 5.010/1966, art. 62, IV' },
      { dia: '2026-11-01', nome: 'Todos os Santos', fonte: 'Lei 5.010/1966, art. 62, IV' },
    ],
  },
}
export const listaDeTribunais = Object.values(tribunais)

/** PROPOSTA: suspensão de expediente lançada pelo jurídico ou pelo pacote (portaria, falha do sistema do tribunal). */
export interface Suspensao { id: number, tribunal: TribunalId, dia: string, motivo: string, fonte: string }

export const suspensoesIniciais: Suspensao[] = [
  { id: 1, tribunal: 'tjmg', dia: '2026-10-29', motivo: 'Indisponibilidade do PJe', fonte: 'Portaria do tribunal (exemplo do protótipo)' },
]

/* ------------------------------------------------------------------ *
 * Processos (categoria Processos, do caso de uso Contencioso)         *
 * ------------------------------------------------------------------ */

export type Risco = 'provavel' | 'possivel' | 'remota'

/** O que o caso de uso Contencioso grava em `Item.data`. */
export interface CamposDoProcesso {
  numeroCnj: string
  tribunal: TribunalId
  orgao: string
  rito: Rito
  area: 'Cível' | 'Consumidor' | 'Trabalhista' | 'Tributário' | 'Ambiental' | 'Criminal'
  polo: 'Réu' | 'Autor'
  parteContraria: string
  valorDaCausa: number
  responsavel: number
  escritorio: string
  fase: 'Conhecimento' | 'Recursal' | 'Execução'
  /** Campo do caso de uso. Com o módulo, ganha histórico por data-base. */
  risco: Risco
  /** Campo do caso de uso: valor estimado da perda. */
  estimado: number
  /** Campo do caso de uso: sem o módulo, a data que alguém digita. */
  proximoPrazoDigitado?: string
}

export type Processo = Pick<Item, 'id' | 'reference' | 'created_at' | 'status'> & {
  titulo: string
  data: CamposDoProcesso
}

type Linha = [string, TribunalId, string, Rito, CamposDoProcesso['area'], CamposDoProcesso['polo'], string, number, number, string, CamposDoProcesso['fase'], Risco, number]

const linhas: Linha[] = [
  ['1023456-12.2025.8.26.0100', 'tjsp', '12ª Vara Cível do Foro Central', 'cpc', 'Consumidor', 'Réu', 'Marcos Antônio Pereira', 48_500, 12, 'Lima & Teixeira Advogados', 'Conhecimento', 'possivel', 18_000],
  ['1104587-33.2024.8.26.0100', 'tjsp', '3ª Vara Empresarial', 'cpc', 'Cível', 'Réu', 'Transportadora Rota Sul Ltda.', 1_250_000, 11, 'Interno', 'Recursal', 'provavel', 780_000],
  ['0008812-45.2025.5.02.0045', 'trt2', '45ª Vara do Trabalho de São Paulo', 'clt', 'Trabalhista', 'Réu', 'Juliana Ferraz Duarte', 186_000, 13, 'Interno', 'Conhecimento', 'provavel', 92_000],
  ['0010455-08.2024.5.15.0032', 'trt15', '1ª Vara do Trabalho de Campinas', 'clt', 'Trabalhista', 'Réu', 'Roberto Silva Gomes', 74_300, 13, 'Interno', 'Recursal', 'possivel', 30_000],
  ['5003218-77.2025.4.03.6100', 'trf3', '9ª Vara Cível Federal de São Paulo', 'cpc', 'Tributário', 'Autor', 'União Federal (Fazenda Nacional)', 3_480_000, 12, 'Albuquerque Tributário', 'Conhecimento', 'remota', 0],
  ['0801233-56.2025.8.19.0001', 'tjrj', '7ª Vara Cível da Capital', 'cpc', 'Cível', 'Réu', 'Condomínio Edifício Atlântico Norte', 96_000, 12, 'Interno', 'Conhecimento', 'possivel', 40_000],
  ['5012876-14.2025.8.13.0024', 'tjmg', '2ª Vara Cível de Belo Horizonte', 'cpc', 'Ambiental', 'Réu', 'Associação de Moradores do Vale do Rio das Velhas e Comunidades Ribeirinhas', 2_100_000, 11, 'Couto Ambiental Advogados', 'Conhecimento', 'possivel', 650_000],
  ['0623451-88.2025.8.04.0001', 'tjam', '4ª Vara Cível de Manaus', 'cpc', 'Consumidor', 'Réu', 'Raimunda Souza Lopes', 32_000, 14, 'Interno', 'Conhecimento', 'provavel', 15_000],
  ['1002871-20.2025.8.26.0016', 'tjsp', '1º Juizado Especial Cível', 'jec', 'Consumidor', 'Réu', 'Paulo Henrique Matos', 18_200, 14, 'Interno', 'Recursal', 'possivel', 6_000],
  ['0007654-31.2025.5.02.0012', 'trt2', '12ª Vara do Trabalho de São Paulo', 'clt', 'Trabalhista', 'Réu', 'Fernanda Albuquerque Rocha', 245_000, 13, 'Moraes Trabalhista', 'Conhecimento', 'provavel', 120_000],
  ['1045529-61.2023.8.26.0100', 'tjsp', '25ª Vara Cível do Foro Central', 'cpc', 'Cível', 'Autor', 'Construtora Horizonte Azul S.A.', 860_000, 12, 'Lima & Teixeira Advogados', 'Execução', 'remota', 0],
  ['0012003-19.2024.5.15.0093', 'trt15', '2ª Vara do Trabalho de Ribeirão Preto', 'clt', 'Trabalhista', 'Réu', 'Anderson Luiz Batista', 58_000, 13, 'Interno', 'Execução', 'provavel', 41_000],
  ['5021198-02.2024.4.03.6100', 'trf3', '14ª Vara Cível Federal de São Paulo', 'cpc', 'Tributário', 'Autor', 'Agência Nacional de Energia Elétrica', 520_000, 12, 'Albuquerque Tributário', 'Conhecimento', 'possivel', 210_000],
  ['1018834-45.2025.8.26.0224', 'tjsp', '3ª Vara Cível de Guarulhos', 'cpc', 'Consumidor', 'Réu', 'Lúcia Helena Barros', 27_900, 14, 'Interno', 'Conhecimento', 'remota', 0],
  ['0819877-23.2024.8.19.0001', 'tjrj', '15ª Vara Cível da Capital', 'cpc', 'Consumidor', 'Réu', 'Gustavo Rangel Teixeira', 64_000, 12, 'Interno', 'Recursal', 'provavel', 38_000],
  ['0009981-77.2025.5.02.0078', 'trt2', '78ª Vara do Trabalho de São Paulo', 'clt', 'Trabalhista', 'Réu', 'Sindicato dos Trabalhadores em Logística (exemplo)', 410_000, 13, 'Moraes Trabalhista', 'Conhecimento', 'possivel', 150_000],
  ['1500342-90.2025.8.26.0050', 'tjsp', '2ª Vara Criminal da Barra Funda', 'cpp', 'Criminal', 'Autor', 'Ministério Público (assistência de acusação)', 0, 11, 'Interno', 'Conhecimento', 'remota', 0],
  ['5009871-66.2025.8.13.0024', 'tjmg', '5ª Vara Cível de Belo Horizonte', 'cpc', 'Cível', 'Réu', 'Mineração Serra Clara Ltda.', 730_000, 11, 'Couto Ambiental Advogados', 'Conhecimento', 'possivel', 260_000],
  ['1007712-38.2025.8.26.0100', 'tjsp', '8ª Vara Cível do Foro Central', 'cpc', 'Cível', 'Réu', 'Beatriz Nogueira Prado', 140_000, 12, 'Interno', 'Conhecimento', 'provavel', 70_000],
  ['0001278-15.2025.5.15.0001', 'trt15', '1ª Vara do Trabalho de Jundiaí', 'clt', 'Trabalhista', 'Réu', 'Thiago Mendes Carvalho', 96_500, 13, 'Interno', 'Conhecimento', 'remota', 0],
]

export const processos: Processo[] = linhas.map((l, i) => ({
  id: 4100 + i,
  reference: `PROC-${String(312 + i).padStart(4, '0')}`,
  created_at: new Date(2025, (i * 5) % 12, 3 + (i * 7) % 24),
  status: 'active',
  titulo: `${l[6]} x Grupo Aurora`,
  data: {
    numeroCnj: l[0], tribunal: l[1], orgao: l[2], rito: l[3], area: l[4], polo: l[5], parteContraria: l[6],
    valorDaCausa: l[7], responsavel: l[8], escritorio: l[9], fase: l[10], risco: l[11], estimado: l[12],
  },
}))
// O polo autor não leva "x Grupo Aurora" na ordem do réu.
for (const p of processos) if (p.data.polo === 'Autor') p.titulo = `Grupo Aurora x ${p.data.parteContraria}`
// Sem o módulo, o prazo é uma data digitada no campo do caso de uso. Duas delas erradas de propósito.
processos[0]!.data.proximoPrazoDigitado = '2026-11-16'
processos[2]!.data.proximoPrazoDigitado = '2026-11-03'
processos[7]!.data.proximoPrazoDigitado = '2026-11-02'

export const processoPorId = new Map(processos.map(p => [p.id, p]))
export const processoPorCnj = new Map(processos.map(p => [p.data.numeroCnj, p]))

/* ------------------------------------------------------------------ *
 * Intimações capturadas (DJEN e Domicílio)                            *
 * ------------------------------------------------------------------ */

/** O que a captura trouxe. Rodada 3: além de intimação e citação, a distribuição de ação nova e o andamento. */
export type TipoDeCaptura = 'intimacao' | 'citacao' | 'distribuicao' | 'andamento'
/** Por onde a informação saiu do tribunal. `consulta`: andamento lido no processo; `distribuidor`: ação nova. */
export type Canal = 'djen' | 'domicilio' | 'portal' | 'consulta' | 'distribuidor'
/** A fonte configurada que trouxe a captura (`capturas.ts`). */
export type FonteId = 'djen' | 'domicilio' | 'portais' | 'andamentos' | 'distribuicao' | 'externo'

/** PROPOSTA: a comunicação capturada. */
export interface Intimacao {
  id: number
  meio: Canal
  tipo: TipoDeCaptura
  tribunal: TribunalId
  orgao: string
  numeroCnj: string
  /** DJEN: disponibilização. Domicílio: envio ao Domicílio. */
  dia: string
  /** Domicílio: quando alguém abriu o teor pelo ENSPACE (a ciência). */
  ciencia?: string
  teor: string
  /** Sugestão do pacote, pelo teor. `undefined` quando o teor não bate com nenhuma regra. */
  regraSugerida?: RegraId
  status: 'revisar' | 'confirmada' | 'descartada'
  motivoDoDescarte?: string
  /* ---------- rodada 3: o submódulo Capturas ---------- */
  /** Quando a captura chegou ao ENSPACE. É a prova de chegada, com o id e o hash da fonte. */
  recebidaEm?: Date
  fonte?: FonteId
  /** O termo monitorado que casou (`capturas.ts`). Andamento não tem termo: vem do número CNJ do processo. */
  termo?: number
  idNaFonte?: string
  /** O hash da comunicação no DJEN. Junta a mesma comunicação vinda de 2 fontes. */
  hash?: string
  /** Outras fontes que trouxeram a mesma comunicação (mesmo hash). Ficam juntas numa linha só. */
  tambemPor?: FonteId[]
  /** A mesma comunicação feita por outro meio (o portal do tribunal), com outra data. */
  outroMeio?: { meio: 'portal', dia: string, ciencia: string, fonte: FonteId }
  /** Quem tratou: uma pessoa ou a regra de entrada direta dos andamentos. */
  tratadaPor?: number | 'automatico'
  distribuicao?: { classe: string, assunto: string, autor: string, reu: string, valor: number, distribuidaEm: string }
}

export const intimacoesIniciais: Intimacao[] = [
  { id: 901, meio: 'djen', tipo: 'intimacao', tribunal: 'tjsp', orgao: '12ª Vara Cível do Foro Central', numeroCnj: '1023456-12.2025.8.26.0100', dia: '2026-10-22', teor: 'Fica a parte ré intimada para, no prazo legal, apresentar contestação, sob pena de revelia. Advogado(s): Bruno Tavares (OAB/SP 000.000, exemplo).', regraSugerida: 'cpc-contestacao', status: 'revisar' },
  { id: 902, meio: 'djen', tipo: 'intimacao', tribunal: 'trt2', orgao: '45ª Vara do Trabalho de São Paulo', numeroCnj: '0008812-45.2025.5.02.0045', dia: '2026-10-23', teor: 'Publicada a sentença. Ficam as partes intimadas. Julgo parcialmente procedentes os pedidos para condenar a reclamada ao pagamento de horas extras e reflexos.', regraSugerida: 'clt-ro', status: 'revisar' },
  { id: 903, meio: 'domicilio', tipo: 'citacao', tribunal: 'tjmg', orgao: '5ª Vara Cível de Belo Horizonte', numeroCnj: '5009871-66.2025.8.13.0024', dia: '2026-10-21', teor: 'Cite-se a requerida para, querendo, contestar a ação no prazo de 15 dias úteis, com as advertências legais.', regraSugerida: 'cpc-contestacao', status: 'revisar' },
  { id: 904, meio: 'djen', tipo: 'intimacao', tribunal: 'tjam', orgao: '4ª Vara Cível de Manaus', numeroCnj: '0623451-88.2025.8.04.0001', dia: '2026-10-23', teor: 'Intime-se a requerida para se manifestar sobre o laudo pericial juntado aos autos.', regraSugerida: 'cpc-manifestacao', status: 'revisar' },
  { id: 905, meio: 'djen', tipo: 'intimacao', tribunal: 'tjsp', orgao: '1º Juizado Especial Cível', numeroCnj: '1002871-20.2025.8.26.0016', dia: '2026-10-20', teor: 'Sentença publicada. Intimem-se. Julgo procedente o pedido para condenar a ré ao pagamento de R$ 4.800,00 a título de danos morais.', regraSugerida: 'jec-recurso', status: 'revisar' },
  { id: 906, meio: 'djen', tipo: 'intimacao', tribunal: 'tjrj', orgao: '7ª Vara Cível da Capital', numeroCnj: '0801233-56.2025.8.19.0001', dia: '2026-10-22', teor: 'Digam as partes, em provas, especificando-as e justificando sua pertinência.', regraSugerida: 'cpc-manifestacao', status: 'revisar' },
  { id: 907, meio: 'domicilio', tipo: 'intimacao', tribunal: 'trf3', orgao: '9ª Vara Cível Federal de São Paulo', numeroCnj: '5003218-77.2025.4.03.6100', dia: '2026-10-19', teor: 'Intime-se a impetrante para recolher as custas complementares, sob pena de extinção.', regraSugerida: 'cpc-manifestacao', status: 'revisar' },
  { id: 908, meio: 'djen', tipo: 'intimacao', tribunal: 'tjsp', orgao: '30ª Vara Cível do Foro Central', numeroCnj: '1099812-04.2025.8.26.0100', dia: '2026-10-23', teor: 'Cite-se e intime-se a ré Grupo Aurora Participações S.A. para contestar.', regraSugerida: 'cpc-contestacao', status: 'revisar' },
  { id: 909, meio: 'djen', tipo: 'intimacao', tribunal: 'trt15', orgao: '1ª Vara do Trabalho de Campinas', numeroCnj: '0010455-08.2024.5.15.0032', dia: '2026-10-22', teor: 'Vista à reclamada dos cálculos de liquidação apresentados pelo perito contábil. Prazo comum.', status: 'revisar' },
  { id: 910, meio: 'djen', tipo: 'intimacao', tribunal: 'tjsp', orgao: '8ª Vara Cível do Foro Central', numeroCnj: '1007712-38.2025.8.26.0100', dia: '2026-10-16', teor: 'Recebo os embargos de declaração. Intime-se a parte contrária para manifestação.', regraSugerida: 'cpc-embargos', status: 'confirmada' },
  { id: 911, meio: 'djen', tipo: 'intimacao', tribunal: 'tjrj', orgao: '15ª Vara Cível da Capital', numeroCnj: '0819877-23.2024.8.19.0001', dia: '2026-10-14', teor: 'Interposta apelação pela autora. Intime-se a apelada para contrarrazões.', regraSugerida: 'cpc-contrarrazoes', status: 'confirmada' },
  { id: 912, meio: 'djen', tipo: 'intimacao', tribunal: 'trt2', orgao: '12ª Vara do Trabalho de São Paulo', numeroCnj: '0007654-31.2025.5.02.0012', dia: '2026-10-19', teor: 'Manifeste-se a reclamada sobre a impugnação ao laudo.', regraSugerida: 'clt-manifestacao', status: 'confirmada' },
  { id: 913, meio: 'djen', tipo: 'intimacao', tribunal: 'tjsp', orgao: '3ª Vara Empresarial', numeroCnj: '1104587-33.2024.8.26.0100', dia: '2026-10-09', teor: 'Publicado o acórdão. Intimem-se as partes.', regraSugerida: 'cpc-embargos', status: 'confirmada' },
  { id: 914, meio: 'djen', tipo: 'intimacao', tribunal: 'tjsp', orgao: '25ª Vara Cível do Foro Central', numeroCnj: '1045529-61.2023.8.26.0100', dia: '2026-10-15', teor: 'Junte-se. Ciência às partes.', status: 'descartada', motivoDoDescarte: 'Mero expediente, sem prazo' },
]

/* ------------------------------------------------------------------ *
 * Prazos confirmados (tarefas com a data calculada)                   *
 * ------------------------------------------------------------------ */

export interface HistoricoDoPrazo { quando: Date, por: string, motivo: string, fatalAntes: string, fatalDepois: string }

/** A tarefa que já existe, com o que o módulo acrescenta. */
export type Prazo = Pick<Task, 'id' | 'reference' | 'status' | 'assigned_to'> & {
  processo: number
  intimacao?: number
  /** PROPOSTA: a entrada do cálculo, guardada para recalcular. */
  entrada: { meio: 'djen' | 'domicilio' | 'portal', dia: string, regra: RegraId, citacao?: boolean }
  confirmadoPor: number
  confirmadoEm: Date
  historico: HistoricoDoPrazo[]
}

export const prazosIniciais: Prazo[] = [
  { id: 7001, reference: 'TSK-7001', status: 'pending', assigned_to: 12, processo: 4118, intimacao: 910, entrada: { meio: 'djen', dia: '2026-10-16', regra: 'cpc-embargos' }, confirmadoPor: 11, confirmadoEm: new Date(2026, 9, 16, 15, 20), historico: [] },
  { id: 7002, reference: 'TSK-7002', status: 'pending', assigned_to: 12, processo: 4114, intimacao: 911, entrada: { meio: 'djen', dia: '2026-10-14', regra: 'cpc-contrarrazoes' }, confirmadoPor: 11, confirmadoEm: new Date(2026, 9, 14, 11, 5), historico: [] },
  { id: 7003, reference: 'TSK-7003', status: 'working', assigned_to: 13, processo: 4109, intimacao: 912, entrada: { meio: 'djen', dia: '2026-10-19', regra: 'clt-manifestacao' }, confirmadoPor: 13, confirmadoEm: new Date(2026, 9, 19, 17, 40), historico: [] },
  { id: 7004, reference: 'TSK-7004', status: 'completed', assigned_to: 11, processo: 4101, intimacao: 913, entrada: { meio: 'djen', dia: '2026-10-09', regra: 'cpc-embargos' }, confirmadoPor: 11, confirmadoEm: new Date(2026, 9, 9, 9, 30), historico: [] },
  { id: 7005, reference: 'TSK-7005', status: 'pending', assigned_to: 11, processo: 4106, entrada: { meio: 'domicilio', dia: '2026-10-13', regra: 'cpc-contestacao' }, confirmadoPor: 11, confirmadoEm: new Date(2026, 9, 13, 14, 0), historico: [] },
  { id: 7006, reference: 'TSK-7006', status: 'pending', assigned_to: 13, processo: 4111, entrada: { meio: 'djen', dia: '2026-10-21', regra: 'clt-embargos' }, confirmadoPor: 13, confirmadoEm: new Date(2026, 9, 21, 10, 15), historico: [] },
  { id: 7007, reference: 'TSK-7007', status: 'pending', assigned_to: 12, processo: 4112, entrada: { meio: 'djen', dia: '2026-10-21', regra: 'cpc-manifestacao' }, confirmadoPor: 12, confirmadoEm: new Date(2026, 9, 21, 16, 45), historico: [] },
]

/* ------------------------------------------------------------------ *
 * Provisão por data-base                                              *
 * ------------------------------------------------------------------ */

/** PROPOSTA: a foto de um processo numa data-base fechada. Só acréscimo: não se edita depois. */
export interface Foto { processo: number, risco: Risco, estimado: number }
export interface DataBase { dia: string, fechadaEm: Date, fechadaPor: number, fotos: Foto[], motivos?: Record<number, string> }

/** Como cada processo estava nas 3 datas-base fechadas. Diferenças de propósito em 30/09 para 31/10. */
function fotos(muda: Record<number, Partial<Foto>>): Foto[] {
  return processos.map(p => ({ processo: p.id, risco: p.data.risco, estimado: p.data.estimado, ...muda[p.id] }))
}
export const datasBaseFechadas: DataBase[] = [
  { dia: '2026-07-31', fechadaEm: new Date(2026, 7, 3, 18, 2), fechadaPor: 15, fotos: fotos({ 4101: { risco: 'possivel', estimado: 600_000 }, 4102: { risco: 'possivel', estimado: 80_000 }, 4119: { risco: 'possivel', estimado: 30_000 } }) },
  { dia: '2026-08-31', fechadaEm: new Date(2026, 8, 2, 17, 40), fechadaPor: 15, fotos: fotos({ 4101: { risco: 'possivel', estimado: 600_000 }, 4102: { risco: 'provavel', estimado: 85_000 } }) },
  { dia: '2026-09-30', fechadaEm: new Date(2026, 9, 2, 16, 55), fechadaPor: 15, fotos: fotos({ 4101: { risco: 'possivel', estimado: 700_000 }, 4106: { risco: 'remota', estimado: 0 }, 4108: { risco: 'remota', estimado: 0 }, 4117: { risco: 'remota', estimado: 0 } }), motivos: { 4101: 'Laudo contábil elevou a estimativa', 4106: 'Liminar cassada no TJMG', 4108: 'Acordo homologado em audiência', 4117: 'Perícia favorável' } },
]
/** A data-base em aberto. */
export const DATA_BASE_ABERTA = '2026-10-31'
/** Motivos já escritos para as mudanças desde 30/09. As outras pedem motivo antes de fechar. */
export const motivosIniciais: Record<number, string> = {
  4101: 'Acórdão desfavorável no TJSP em 09/10',
}
/** A atualização monetária do mês, calculada pelo módulo Correção Monetária (IPCA-E de exemplo). */
export const ATUALIZACAO_DO_MES = 0.0041

/* ------------------------------------------------------------------ *
 * Agenda: o que ela já mostra hoje, sem o módulo                      *
 * ------------------------------------------------------------------ */

/** Datas de item (a categoria Audiências vem do caso de uso Contencioso) e reuniões. Dado do workspace. */
export interface EventoDoWorkspace { id: string, dia: string, hora: string, titulo: string, processo?: number }
export const eventosDoWorkspace: EventoDoWorkspace[] = [
  { id: 'w1', dia: '2026-10-27', hora: '09:00', titulo: 'Reunião semanal do contencioso' },
  { id: 'w2', dia: '2026-10-28', hora: '14:00', titulo: 'Audiência de conciliação · PROC-0317', processo: 4105 },
  { id: 'w3', dia: '2026-10-29', hora: '10:30', titulo: 'Audiência de instrução · PROC-0314', processo: 4102 },
  { id: 'w4', dia: '2026-11-03', hora: '09:00', titulo: 'Reunião semanal do contencioso' },
  { id: 'w5', dia: '2026-11-05', hora: '15:00', titulo: 'Audiência una · PROC-0321', processo: 4109 },
  { id: 'w6', dia: '2026-11-10', hora: '09:00', titulo: 'Reunião semanal do contencioso' },
  { id: 'w7', dia: '2026-11-12', hora: '11:00', titulo: 'Sustentação oral · PROC-0313', processo: 4101 },
  { id: 'w8', dia: '2026-10-20', hora: '09:00', titulo: 'Reunião semanal do contencioso' },
  { id: 'w9', dia: '2026-10-22', hora: '16:00', titulo: 'Audiência de conciliação · PROC-0326', processo: 4114 },
]
