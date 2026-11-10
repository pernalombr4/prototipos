/**
 * Dado do protótipo "Prazo final nas Tarefas Rápidas".
 *
 * A tarefa segue o `Task` do enspace-sdk-schemas. Datas guardadas como
 * `AAAA-MM-DD` para o protótipo comparar e filtrar sem fuso.
 *
 * Valores fictícios. Nada vem de API; recarregar a página volta tudo.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'

/** "Hoje" fixo no protótipo, para os exemplos dos requisitos baterem (RN005: vencimento 20/11, prazo final 25/11, hoje 22/11). */
export const HOJE = '2026-11-22'

export type Situacao = Task['status']
export type Prioridade = Task['priority']

export interface Membro {
  id: number
  nome: string
}

export const membros: Membro[] = [
  { id: 1, nome: 'Ana Ribeiro' },
  { id: 2, nome: 'Bruno Tavares' },
  { id: 3, nome: 'Carla Nunes' },
  { id: 4, nome: 'Diego Martins' },
]

export interface TarefaRapida extends Pick<Task, 'id' | 'reference' | 'name' | 'status' | 'priority'> {
  /** `due_date` do schema: o vencimento de hoje, que marca o atraso. */
  due_date: string | null
  /**
   * INVENTADO PELO PROTÓTIPO: o prazo final. O nome do campo na API está
   * "a definir" (RI001); `final_due_date` é só o nome de trabalho.
   */
  final_due_date: string | null
  /** `assigned_to` do schema, resolvido para o membro. */
  assigned_to: number | null
}

let proximoId = 22110

export function novaReferencia(): string {
  return `${(proximoId++).toString(16)}a9c4e1f07b3d5a28c6e9f1b4d7a0c3e5`.slice(0, 32)
}

export function tarefasIniciais(): TarefaRapida[] {
  return [
    { id: 22101, reference: '7f3a91c2e4b84d0fa6c15e2b9d8f7a10', name: 'Revisar o contrato de prestação de serviços', status: 'pending', priority: 'high', due_date: '2026-11-20', final_due_date: '2026-11-25', assigned_to: 1 },
    { id: 22102, reference: '2b8e47d1c9a04f6e8b37d2a1c5f9e086', name: 'Enviar a proposta comercial revisada', status: 'working', priority: 'normal', due_date: '2026-11-24', final_due_date: '2026-11-27', assigned_to: 2 },
    { id: 22103, reference: 'c41d9e8a7b2f4c05a9e36b1d8c7f2e43', name: 'Coletar as assinaturas do aditivo', status: 'pending', priority: 'urgent', due_date: '2026-11-21', final_due_date: '2026-11-21', assigned_to: 3 },
    { id: 22104, reference: '9e6f2a1d4c8b47e3b5a09d2e1f6c8a74', name: 'Atualizar o cadastro do fornecedor', status: 'pending', priority: 'normal', due_date: '2026-11-26', final_due_date: null, assigned_to: 4 },
    { id: 22105, reference: '5a0c8e3f1b9d42a6c7e48f1a2d3b9c65', name: 'Conferir as notas fiscais de outubro', status: 'blocked', priority: 'normal', due_date: '2026-11-18', final_due_date: '2026-11-30', assigned_to: 1 },
    { id: 22106, reference: 'e8b1d6c4a2f04e97d3c51a8b6e2f0d19', name: 'Preparar o relatório mensal da equipe', status: 'working', priority: 'low', due_date: '2026-11-28', final_due_date: '2026-12-02', assigned_to: 2 },
    { id: 22107, reference: '1d7c3a9e5f2b48c0a6d94e3b7c1f5a82', name: 'Validar o orçamento do projeto', status: 'pending', priority: 'high', due_date: '2026-11-23', final_due_date: '2026-11-25', assigned_to: 3 },
    { id: 22108, reference: 'b3f9e2c7d1a54b86e0c27f9d4a1b6e38', name: 'Agendar a reunião de alinhamento', status: 'pending', priority: 'low', due_date: null, final_due_date: null, assigned_to: 4 },
    { id: 22109, reference: '6c2a8f4e1d9b43a7c5e80b2d6f3a9c17', name: 'Responder ao chamado do cliente', status: 'completed', priority: 'normal', due_date: '2026-11-19', final_due_date: '2026-11-20', assigned_to: 1 },
    { id: 22110, reference: 'f0e4b7a2c8d14f39b6a52e8c1d7f4b90', name: 'Arquivar os documentos do trimestre', status: 'completed', priority: 'low', due_date: '2026-11-15', final_due_date: null, assigned_to: 2 },
  ]
}

/* ------------------------------------------------------------------ *
 * Spaceflow                                                           *
 * ------------------------------------------------------------------ */

/** Como o nó de ação preenche uma data da tarefa. */
export type ModoDaData = 'manter' | 'vazio' | 'fixa' | 'variavel'

export interface DataDoNo {
  modo: ModoDaData
  fixa: string | null
  variavel: string | null
}

export interface ConfiguracaoDaAcao {
  acao: 'criar' | 'alterar'
  nome: string
  prazo: DataDoNo
  prazoFinal: DataDoNo
}

/** Variáveis que o gatilho "Tarefa atualizada" entrega (RF009). Chave como no seletor. */
export const variaveisDoGatilho = [
  { chave: 'tarefa.nome', tipo: 'texto' },
  { chave: 'tarefa.status', tipo: 'texto' },
  { chave: 'tarefa.responsavel', tipo: 'texto' },
  { chave: 'tarefa.prazo', tipo: 'data' },
  { chave: 'tarefa.prazo_final', tipo: 'data', nova: true },
] as const

export type ChaveDeVariavel = typeof variaveisDoGatilho[number]['chave']

export function configuracaoInicial(): ConfiguracaoDaAcao {
  return {
    acao: 'criar',
    nome: 'Conferir a entrega',
    prazo: { modo: 'variavel', fixa: null, variavel: 'tarefa.prazo' },
    prazoFinal: { modo: 'variavel', fixa: null, variavel: 'tarefa.prazo_final' },
  }
}

export interface Execucao {
  id: number
  quando: string
  tarefa: string
  /** O que mudou na tarefa e disparou o gatilho. */
  mudou: 'prazo_final' | 'status' | 'prazo'
  /** Variáveis que o gatilho entregou (RF009, RF010). */
  recebido: { prazo: string | null, prazoFinal: string | null }
  /** O que o nó "Criar tarefa rápida" tentou gravar. */
  gravado: { prazo: string | null, prazoFinal: string | null }
  resultado: 'ok' | 'falha'
}

export const execucoes: Execucao[] = [
  { id: 9031, quando: '2026-11-22T09:14:00', tarefa: 'Enviar a proposta comercial revisada', mudou: 'prazo_final', recebido: { prazo: '2026-11-24', prazoFinal: '2026-11-27' }, gravado: { prazo: '2026-11-24', prazoFinal: '2026-11-27' }, resultado: 'ok' },
  { id: 9030, quando: '2026-11-22T08:52:00', tarefa: 'Atualizar o cadastro do fornecedor', mudou: 'status', recebido: { prazo: '2026-11-26', prazoFinal: null }, gravado: { prazo: '2026-11-26', prazoFinal: null }, resultado: 'ok' },
  /* Versão anterior do nó, com o prazo final em data fixa (25/11): o prazo que chegou (30/11) fere a RN004. */
  { id: 9029, quando: '2026-11-21T17:30:00', tarefa: 'Emitir a fatura de novembro', mudou: 'prazo', recebido: { prazo: '2026-11-30', prazoFinal: '2026-12-05' }, gravado: { prazo: '2026-11-30', prazoFinal: '2026-11-25' }, resultado: 'falha' },
]
