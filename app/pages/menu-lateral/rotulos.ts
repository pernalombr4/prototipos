/**
 * O nome de um nó do menu, num lugar só (rodada 15).
 *
 * Nativo vem do dicionário pela chave; o que o workspace criou traz o próprio
 * nome. As peças antigas ainda têm cada uma a sua cópia deste mapa; as novas
 * usam esta.
 */
import type { NoDoMenu } from './mocks'
import type { TextosDaTela } from './textos'

export function rotuloDoNo(no: NoDoMenu, t: TextosDaTela) {
  if (no.rotulo) return no.rotulo
  const mapa: Record<string, string> = {
    inicio: t.inicio,
    inbox: t.inbox,
    chatIa: t.chatIa,
    tarefas: t.tarefas,
    agenda: t.agenda,
    spaceflows: t.spaceflows,
    documentos: t.documentos,
    categorias: t.categorias,
    auditoria: t.grupos.auditoria ?? '',
    logsAuditoria: t.itens['logs-auditoria'] ?? '',
    logsRequisicao: t.itens['logs-requisicao'] ?? '',
  }
  return mapa[no.chave ?? ''] ?? (no.chave ?? '')
}
