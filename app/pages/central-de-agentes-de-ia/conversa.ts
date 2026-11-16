/**
 * As conversas do protótipo: o formato das mensagens e os roteiros de cada
 * estado do chat. MAQUETE: nada aqui chama IA. O roteiro é fixo e a resposta
 * a uma mensagem nova é um texto de exemplo.
 *
 * O texto da conversa é dado (como o mocks.ts) e fica só em português.
 */
import type { EstadoDoCartao } from './estado'

export type Parte =
  | { tipo: 'texto', texto: string }
  | { tipo: 'anexo', nome: string }
  /** ferramenta que só lê: executa direto e aparece em 1 linha */
  | { tipo: 'leitura', ferramenta: string, resumo: string }
  /** ferramenta que pede confirmação: o cartão */
  | { tipo: 'confirmacao', ferramenta: string, campos: { chave: string, valor: string, longo?: boolean }[], estado: EstadoDoCartao, lote?: string[], sempre?: boolean, simulado?: boolean, hora?: string }
  /** a minuta montada com um modelo de resposta */
  | { tipo: 'minuta', bloco: string, valores: Record<string, string>, alterados: string[] }

export interface Mensagem {
  id: string
  papel: 'user' | 'assistant'
  partes: Parte[]
  /** o modelo que respondeu */
  modelo?: string
}

let n = 0
export const idDaMensagem = () => `m${++n}-${Date.now() % 10000}`

const OFICIO = 'Ofício 4471-2026, 3ª Vara Cível de Campinas.pdf'

const email = (estado: EstadoDoCartao): Parte => ({
  tipo: 'confirmacao',
  ferramenta: 'sendEmail',
  estado,
  hora: '14:32',
  campos: [
    { chave: 'para', valor: 'campinas3cv@tjsp.jus.br' },
    { chave: 'assunto', valor: 'Resposta ao ofício 4471/2026, processo 0012345-67.2025.8.26.0114' },
    { chave: 'corpo', valor: 'Excelentíssimo(a) Senhor(a) Juiz(a),\n\nSegue em anexo a resposta da Aurora Pagamentos S.A. ao ofício 4471/2026, com o bloqueio de R$ 375,00 na conta do executado.\n\nAtenciosamente,\nDepartamento Jurídico', longo: true },
  ],
})

export function roteiroDeConfirmacao(estado: EstadoDoCartao, modelo: string): Mensagem[] {
  return [
    { id: 'c1', papel: 'user', partes: [{ tipo: 'anexo', nome: OFICIO }, { tipo: 'texto', texto: 'monta a resposta e manda pra vara. o executado tem conta 884201377, saldo 1250, bloqueei 375' }] },
    {
      id: 'c2',
      papel: 'assistant',
      modelo,
      partes: [
        { tipo: 'leitura', ferramenta: 'readFile', resumo: OFICIO },
        { tipo: 'texto', texto: 'Montei a resposta com o modelo **S1, Bloqueio de saldo efetivado**, e anexei ao e-mail para a 3ª Vara Cível de Campinas. Confira o envio:' },
        email(estado),
      ],
    },
  ]
}

const LOTE = [
  'Ofício 4471/2026, 3ª Vara Cível de Campinas',
  'Ofício 1180/2026, 1ª Vara do Trabalho de São Paulo',
  'Ofício 0932/2026, 2ª Vara de Execuções Fiscais de Belo Horizonte',
  'Ofício 5520/2026, 5ª Vara Cível de Ribeirão Preto',
  'Ofício 0207/2026, Vara Única de Itu',
  'Ofício 3318/2026, 4ª Vara Cível de Santos',
  'Ofício 7741/2026, 12ª Vara do Trabalho de São Paulo',
  'Ofício 0645/2026, 1ª Vara Cível de Uberlândia',
  'Ofício 2290/2026, 3ª Vara de Família de Campinas',
  'Ofício 8813/2026, 7ª Vara Cível de Belo Horizonte',
  'Ofício 1402/2026, 2ª Vara Cível de Sorocaba',
  'Ofício 6075/2026, 9ª Vara do Trabalho de Campinas',
]

export function roteiroDeLote(estado: EstadoDoCartao, modelo: string): Mensagem[] {
  return [
    { id: 'l1', papel: 'user', partes: [{ tipo: 'anexo', nome: 'Ofícios recebidos na semana.pdf' }, { tipo: 'texto', texto: 'cria um item em Ofícios recebidos pra cada ofício desse pdf' }] },
    {
      id: 'l2',
      papel: 'assistant',
      modelo,
      partes: [
        { tipo: 'leitura', ferramenta: 'readFile', resumo: 'Ofícios recebidos na semana.pdf' },
        { tipo: 'leitura', ferramenta: 'getWorkspaceSchema', resumo: 'Ofícios recebidos' },
        { tipo: 'texto', texto: 'Encontrei 12 ofícios no arquivo. Cada um vira um item com o número, a vara, o processo e o prazo:' },
        {
          tipo: 'confirmacao',
          ferramenta: 'smartBatchCreateItems',
          estado,
          hora: '09:15',
          lote: LOTE,
          campos: [
            { chave: 'categoria', valor: 'Ofícios recebidos' },
            { chave: 'campos', valor: 'Número do ofício, Vara, Processo, Prazo de resposta' },
          ],
        },
      ],
    },
  ]
}

export function roteiroDeMinuta(modelo: string): Mensagem[] {
  return [
    { id: 'n1', papel: 'user', partes: [{ tipo: 'anexo', nome: OFICIO }, { tipo: 'texto', texto: 've ai' }] },
    {
      id: 'n2',
      papel: 'assistant',
      modelo,
      partes: [
        { tipo: 'leitura', ferramenta: 'readFile', resumo: OFICIO },
        { tipo: 'texto', texto: 'O ofício pede o bloqueio de saldo de **Café Serra Alta Comércio de Alimentos Ltda.**, documento 12.345.678/0001-90, até R$ 50.000,00.\n\nPesquise o documento e me diga o que encontrou:\n- **Sem cadastro:** modelo S3\n- **Conta com saldo bloqueado:** modelo S1 (preciso do código do cliente, do saldo e do valor bloqueado)\n- **Conta sem saldo:** modelo S4\n- **Conta encerrada:** modelo S5' },
      ],
    },
    { id: 'n3', papel: 'user', partes: [{ tipo: 'texto', texto: 'tem conta 884201377 saldo 1250, bloqueei 375' }] },
    {
      id: 'n4',
      papel: 'assistant',
      modelo,
      partes: [
        { tipo: 'texto', texto: 'Montei a minuta com o modelo S1. O ofício não informa a data limite do bloqueio, então o campo ficou sem valor.' },
        {
          tipo: 'minuta',
          bloco: 'b1',
          alterados: [],
          valores: {
            vara: '3ª Vara Cível',
            comarca: 'Campinas',
            processo: '0012345-67.2025.8.26.0114',
            exequente: 'Construtora Horizonte Azul Ltda.',
            executado: 'Café Serra Alta Comércio de Alimentos Ltda.',
            documento: '12.345.678/0001-90',
            id_cliente: '884201377',
            saldo: 'R$ 1.250,00',
            valor_bloqueado: 'R$ 375,00',
            limite: '',
            cidade: 'São Paulo',
            data: '16 de novembro de 2026',
            responsavel: 'Departamento Jurídico',
          },
        },
      ],
    },
  ]
}

/** A resposta de exemplo a uma mensagem nova. */
export function respostaDeExemplo(texto: string, modelo: string, comArquivo: boolean): Mensagem {
  const partes: Parte[] = []
  if (comArquivo) partes.push({ tipo: 'leitura', ferramenta: 'readFile', resumo: 'arquivo anexado' })
  partes.push({ tipo: 'texto', texto: `Resposta de exemplo do protótipo para "${texto.slice(0, 80)}". No produto, o agente responde aqui com as instruções, os arquivos de referência e as ferramentas ligadas.` })
  return { id: idDaMensagem(), papel: 'assistant', modelo, partes }
}
