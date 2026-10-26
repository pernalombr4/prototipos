/**
 * O dado do submódulo Capturas (rodada 3). Fictício, sem API.
 *
 * PROPOSTA (o schema não tem): `Fonte`, `Execucao`, `Termo` e os campos novos da captura. Valores inventados: CNPJ,
 * OAB, número CNJ, hash e id de fonte são exemplos e não correspondem a pessoas nem a empresas reais. Os nomes dos
 * canais oficiais (DJEN, Domicílio Judicial Eletrônico, e-SAJ, PJe) são reais; o fornecedor externo é um exemplo de
 * tipo de fornecedor ("central de recortes"), sem nome comercial.
 *
 * Fontes da pesquisa: `pesquisa/reports/Captura em softwares jurídicos.md`.
 */
import type { FonteId, Intimacao } from './mocks'
import { intimacoesIniciais } from './mocks'

/* ------------------------------------------------------------------ *
 * Fontes                                                              *
 * ------------------------------------------------------------------ */

export type SaudeDaFonte = 'ok' | 'atencao' | 'falha'

/** PROPOSTA: de onde a captura vem. O robô ENSPACE de hoje vira fonte configurada, ao lado das oficiais. */
export interface Fonte {
  id: FonteId
  icone: string
  /** Quem roda: a API oficial, o robô ENSPACE (o serviço que o cliente contrata hoje) ou um fornecedor do cliente. */
  quem: 'oficial' | 'robo' | 'fornecedor'
  /** Vezes por dia, ou a cada envio do fornecedor. */
  frequencia: number | 'webhook'
  ultima: string
  proxima: string
  amanha?: boolean
  hoje: number
  seteDias: number
  saude: SaudeDaFonte
}

export const fontes: Fonte[] = [
  { id: 'djen', icone: 'i-lucide-newspaper', quem: 'oficial', frequencia: 4, ultima: '09:00', proxima: '13:00', hoje: 6, seteDias: 41, saude: 'ok' },
  { id: 'domicilio', icone: 'i-lucide-mail-open', quem: 'oficial', frequencia: 4, ultima: '09:00', proxima: '13:00', hoje: 1, seteDias: 4, saude: 'ok' },
  { id: 'portais', icone: 'i-lucide-landmark', quem: 'robo', frequencia: 2, ultima: '07:00', proxima: '19:00', hoje: 1, seteDias: 3, saude: 'atencao' },
  { id: 'andamentos', icone: 'i-lucide-list-checks', quem: 'robo', frequencia: 1, ultima: '06:30', proxima: '06:30', amanha: true, hoje: 4, seteDias: 27, saude: 'ok' },
  { id: 'distribuicao', icone: 'i-lucide-file-plus-2', quem: 'robo', frequencia: 1, ultima: '07:00', proxima: '07:00', amanha: true, hoje: 3, seteDias: 5, saude: 'ok' },
  { id: 'externo', icone: 'i-lucide-webhook', quem: 'fornecedor', frequencia: 'webhook', ultima: '08:41', proxima: '', hoje: 5, seteDias: 33, saude: 'ok' },
]
export const fontePorId = new Map(fontes.map(f => [f.id, f]))

/** Os logins de tribunal que a fonte "Portais" usa. Um deles com falha, como na Astrea ("Falha no Login"). */
export interface LoginDeTribunal { sistema: string, tribunal: string, como: 'certificado' | 'senha', saude: SaudeDaFonte, detalhe?: string }
export const loginsDeTribunal: LoginDeTribunal[] = [
  { sistema: 'e-SAJ', tribunal: 'TJSP', como: 'certificado', saude: 'ok' },
  { sistema: 'PJe', tribunal: 'TRT-2', como: 'certificado', saude: 'ok' },
  { sistema: 'PJe', tribunal: 'TRT-15', como: 'certificado', saude: 'ok' },
  { sistema: 'PJe', tribunal: 'TJMG', como: 'certificado', saude: 'falha', detalhe: 'certificado' },
  { sistema: 'eproc', tribunal: 'TRF-3', como: 'senha', saude: 'ok' },
]

/** PROPOSTA: cada execução da fonte fica registrada. É a prova de que a captura rodou, mesmo sem resultado. */
export interface Execucao { quando: Date, resultado: 'ok' | 'vazia' | 'falha', capturas: number, duracao: string, detalhe?: 'ocupado' | 'nova' | 'credencial' | 'certificado' }

export function execucoesDa(fonte: FonteId, falhou: boolean): Execucao[] {
  const base: Execucao[] = [
    { quando: new Date(2026, 9, 26, 9, 0), resultado: 'ok', capturas: 4, duracao: '38 s' },
    { quando: new Date(2026, 9, 26, 5, 0), resultado: 'ok', capturas: 2, duracao: '41 s' },
    { quando: new Date(2026, 9, 25, 21, 0), resultado: 'vazia', capturas: 0, duracao: '12 s' },
    { quando: new Date(2026, 9, 25, 17, 0), resultado: 'vazia', capturas: 0, duracao: '11 s' },
    { quando: new Date(2026, 9, 24, 21, 0), resultado: 'vazia', capturas: 0, duracao: '13 s' },
    { quando: new Date(2026, 9, 24, 13, 0), resultado: 'falha', capturas: 0, duracao: '30 s', detalhe: 'ocupado' },
    { quando: new Date(2026, 9, 24, 13, 15), resultado: 'ok', capturas: 7, duracao: '52 s', detalhe: 'nova' },
  ]
  // "O sistema está muito ocupado" é resposta do DJEN. Nas outras fontes, a mesma hora vira uma execução sem resultado.
  const daFonte = fonte === 'djen' ? base : [...base.slice(0, 5), { quando: new Date(2026, 9, 24, 13, 0), resultado: 'vazia' as const, capturas: 0, duracao: '14 s' }]
  if (fonte === 'domicilio' && falhou) return [{ quando: new Date(2026, 9, 26, 6, 0), resultado: 'falha', capturas: 0, duracao: '2 s', detalhe: 'credencial' }, ...daFonte.slice(2)]
  if (fonte === 'portais') return [{ quando: new Date(2026, 9, 26, 7, 0), resultado: 'falha', capturas: 0, duracao: '9 s', detalhe: 'certificado' }, ...daFonte.slice(1)]
  return daFonte
}

/* ------------------------------------------------------------------ *
 * Termos monitorados                                                  *
 * ------------------------------------------------------------------ */

export type TipoDeTermo = 'cnpj' | 'nome' | 'oab'
export type AlvoDoTermo = 'publicacoes' | 'distribuicoes' | 'domicilio'

/** PROPOSTA: o que se procura nas fontes. Nome tem variações e exceções; OAB e CNPJ não têm homônimo. */
export interface Termo {
  id: number
  tipo: TipoDeTermo
  valor: string
  titular: string
  variacoes: string[]
  excecoes: string[]
  /** UFs onde se procura. Vazio: todos os diários e tribunais. */
  ufs: string[]
  alvos: AlvoDoTermo[]
  ativo: boolean
  /** Última vez que o termo casou com alguma captura. */
  ultimaOcorrencia: string
}

export const termosIniciais: Termo[] = [
  { id: 1, tipo: 'cnpj', valor: '00.000.001/0001-00', titular: 'Grupo Aurora Participações S.A.', variacoes: [], excecoes: [], ufs: [], alvos: ['publicacoes', 'distribuicoes', 'domicilio'], ativo: true, ultimaOcorrencia: '2026-10-26' },
  { id: 2, tipo: 'cnpj', valor: '00.000.002/0001-00', titular: 'Aurora Logística Ltda.', variacoes: [], excecoes: [], ufs: [], alvos: ['publicacoes', 'distribuicoes', 'domicilio'], ativo: true, ultimaOcorrencia: '2026-10-26' },
  { id: 3, tipo: 'nome', valor: 'Grupo Aurora', titular: 'Grupo Aurora Participações S.A.', variacoes: ['Aurora Participações', 'Grupo Aurora S/A'], excecoes: [], ufs: [], alvos: ['publicacoes', 'distribuicoes'], ativo: true, ultimaOcorrencia: '2026-10-26' },
  { id: 4, tipo: 'oab', valor: 'OAB/SP 000.001', titular: 'Bruno Tavares', variacoes: [], excecoes: [], ufs: ['SP'], alvos: ['publicacoes'], ativo: true, ultimaOcorrencia: '2026-10-23' },
  { id: 5, tipo: 'oab', valor: 'OAB/SP 000.002', titular: 'Carla Nunes', variacoes: [], excecoes: [], ufs: ['SP'], alvos: ['publicacoes'], ativo: true, ultimaOcorrencia: '2026-10-23' },
  { id: 6, tipo: 'oab', valor: 'OAB/MG 000.003', titular: 'Ana Ribeiro', variacoes: [], excecoes: [], ufs: ['MG'], alvos: ['publicacoes'], ativo: true, ultimaOcorrencia: '2026-10-21' },
  { id: 7, tipo: 'oab', valor: 'OAB/AM 000.004', titular: 'Ana Ribeiro', variacoes: [], excecoes: [], ufs: ['AM'], alvos: ['publicacoes'], ativo: true, ultimaOcorrencia: '2026-09-21' },
]
/** Quantos termos o contrato do cliente cobre. */
export const TERMOS_CONTRATADOS = 10

/* ------------------------------------------------------------------ *
 * As capturas da rodada 3                                             *
 * ------------------------------------------------------------------ */

const h = (n: number) => `${(0x9f3a10c + n * 7919).toString(16)}e${(n * 104729).toString(16).padStart(6, '0')}`

/** As intimações das rodadas 1 e 2 ganham a prova de chegada: fonte, termo, hora, id e hash. */
const termoDoAdvogado: Record<number, number> = { 901: 4, 902: 5, 904: 6, 905: 4, 906: 4, 908: 3, 909: 5, 910: 4, 911: 4, 912: 5, 913: 4, 914: 4 }
function comProva(i: Intimacao, n: number): Intimacao {
  const [a, m, d] = i.dia.split('-').map(Number) as [number, number, number]
  return {
    ...i,
    recebidaEm: new Date(a, m - 1, d, i.meio === 'djen' ? 9 : 6, 2 + n),
    fonte: i.meio === 'djen' ? 'djen' : 'domicilio',
    termo: i.meio === 'djen' ? termoDoAdvogado[i.id] : 1,
    idNaFonte: i.meio === 'djen' ? String(48_210_000 + i.id * 37) : `DJE-${i.id}-2026`,
    hash: i.meio === 'djen' ? h(i.id) : undefined,
    tratadaPor: i.status !== 'revisar' ? 11 : undefined,
  }
}

const enriquecidas = intimacoesIniciais.map(comProva)
// A mesma publicação chegou também pelo fornecedor do cliente (mesmo hash) e foi aberta antes no portal do e-SAJ.
const pub901 = enriquecidas.find(i => i.id === 901)!
pub901.tambemPor = ['externo']
pub901.outroMeio = { meio: 'portal', dia: '2026-10-21', ciencia: '2026-10-21', fonte: 'portais' }
enriquecidas.find(i => i.id === 906)!.tambemPor = ['externo']

const novas: Intimacao[] = [
  // Distribuições: ações novas contra o CNPJ, antes da citação
  {
    id: 920, meio: 'distribuidor', tipo: 'distribuicao', tribunal: 'tjsp', orgao: '5ª Vara Cível de Santo André', numeroCnj: '1009934-51.2026.8.26.0554', dia: '2026-10-26',
    teor: 'Ação de indenização por danos materiais e morais. Distribuída por sorteio. Ainda sem citação.',
    status: 'revisar', recebidaEm: new Date(2026, 9, 26, 7, 4), fonte: 'distribuicao', termo: 1, idNaFonte: 'DIST-TJSP-88213',
    distribuicao: { classe: 'Procedimento Comum Cível', assunto: 'Indenização por dano moral', autor: 'Rogério Lima Prado', reu: 'Grupo Aurora Participações S.A.', valor: 42_000, distribuidaEm: '2026-10-23' },
  },
  {
    id: 921, meio: 'distribuidor', tipo: 'distribuicao', tribunal: 'trt2', orgao: '31ª Vara do Trabalho de São Paulo', numeroCnj: '1001876-22.2026.5.02.0031', dia: '2026-10-26',
    teor: 'Reclamação trabalhista. Pedidos de horas extras, adicional noturno e reflexos. Ainda sem notificação.',
    status: 'revisar', recebidaEm: new Date(2026, 9, 26, 7, 5), fonte: 'distribuicao', termo: 2, idNaFonte: 'DIST-TRT2-40177',
    distribuicao: { classe: 'Ação Trabalhista, Rito Ordinário', assunto: 'Horas extras', autor: 'Patrícia Gomes Lacerda', reu: 'Aurora Logística Ltda.', valor: 128_000, distribuidaEm: '2026-10-22' },
  },
  {
    id: 922, meio: 'distribuidor', tipo: 'distribuicao', tribunal: 'tjmg', orgao: '3ª Vara Cível de Uberlândia', numeroCnj: '5031122-07.2026.8.13.0702', dia: '2026-10-26',
    teor: 'Execução de título extrajudicial. A parte executada tem CNPJ diferente dos CNPJs monitorados.',
    status: 'revisar', recebidaEm: new Date(2026, 9, 26, 7, 6), fonte: 'distribuicao', termo: 3, idNaFonte: 'DIST-TJMG-11902',
    distribuicao: { classe: 'Execução de Título Extrajudicial', assunto: 'Duplicata', autor: 'Banco Cerrado S.A.', reu: 'Grupo Aurora Transportes Ltda.', valor: 18_500, distribuidaEm: '2026-10-21' },
  },
  // Andamentos: lidos no processo pelo número CNJ
  { id: 923, meio: 'consulta', tipo: 'andamento', tribunal: 'tjrj', orgao: '7ª Vara Cível da Capital', numeroCnj: '0801233-56.2025.8.19.0001', dia: '2026-10-23', teor: 'Audiência de conciliação designada para 18/11/2026, às 14:00, na sala 4.', status: 'revisar', recebidaEm: new Date(2026, 9, 26, 6, 31), fonte: 'andamentos', idNaFonte: 'MOV-0801233-118' },
  { id: 924, meio: 'consulta', tipo: 'andamento', tribunal: 'trt2', orgao: '12ª Vara do Trabalho de São Paulo', numeroCnj: '0007654-31.2025.5.02.0012', dia: '2026-10-23', teor: 'Juntada de laudo pericial complementar.', status: 'revisar', recebidaEm: new Date(2026, 9, 26, 6, 32), fonte: 'andamentos', idNaFonte: 'MOV-0007654-77' },
  { id: 925, meio: 'consulta', tipo: 'andamento', tribunal: 'tjsp', orgao: '3ª Vara Empresarial', numeroCnj: '1104587-33.2024.8.26.0100', dia: '2026-10-22', teor: 'Conclusos para decisão.', status: 'confirmada', tratadaPor: 'automatico', recebidaEm: new Date(2026, 9, 23, 6, 30), fonte: 'andamentos', idNaFonte: 'MOV-1104587-302' },
  { id: 926, meio: 'consulta', tipo: 'andamento', tribunal: 'tjrj', orgao: '15ª Vara Cível da Capital', numeroCnj: '0819877-23.2024.8.19.0001', dia: '2026-10-21', teor: 'Remetidos os autos ao Tribunal de Justiça para julgamento da apelação.', status: 'confirmada', tratadaPor: 'automatico', recebidaEm: new Date(2026, 9, 22, 6, 30), fonte: 'andamentos', idNaFonte: 'MOV-0819877-95' },
  // Intimação no portal do tribunal, ainda sem ciência
  { id: 927, meio: 'portal', tipo: 'intimacao', tribunal: 'trt15', orgao: '2ª Vara do Trabalho de Ribeirão Preto', numeroCnj: '0012003-19.2024.5.15.0093', dia: '2026-10-20', teor: 'Intimação da executada para ciência da decisão dos embargos à execução e manifestação.', regraSugerida: 'clt-manifestacao', status: 'revisar', recebidaEm: new Date(2026, 9, 20, 19, 3), fonte: 'portais', termo: 5, idNaFonte: 'PJE-TRT15-552190' },
  // Só o fornecedor externo trouxe: a redundância cobriu a fonte oficial
  { id: 928, meio: 'djen', tipo: 'intimacao', tribunal: 'tjsp', orgao: '3ª Vara Cível de Guarulhos', numeroCnj: '1018834-45.2025.8.26.0224', dia: '2026-10-23', teor: 'Manifeste-se a requerida sobre a réplica no prazo legal.', regraSugerida: 'cpc-manifestacao', status: 'revisar', recebidaEm: new Date(2026, 9, 23, 8, 41), fonte: 'externo', termo: 3, idNaFonte: 'EXT-77120', hash: h(928) },
]

export const capturasIniciais: Intimacao[] = [...enriquecidas, ...novas]

/** A situação da fonte agora. No cenário "Captura do Domicílio parada", a credencial do Domicílio foi recusada. */
export function saudeAtual(f: Fonte, erroCaptura: boolean): SaudeDaFonte {
  return erroCaptura && f.id === 'domicilio' ? 'falha' : f.saude
}
