/**
 * O nome de um nó do menu, num lugar só (rodada 15).
 *
 * Nativo vem do dicionário pela chave; o que o workspace criou traz o próprio
 * nome. Desde a rodada 16 é a única cópia deste mapa: antes cada peça tinha a
 * sua, e um menu nativo novo precisava ser lembrado em cinco lugares.
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
    // Integrações, rodada 16: menu nativo novo, com os nomes que já existiam.
    integracoes: t.itens.integracoes ?? '',
    apps: t.itens.apps ?? '',
    credenciais: t.itens.credenciais ?? '',
    webhooks: t.itens.webhooks ?? '',
  }
  return mapa[no.chave ?? ''] ?? (no.chave ?? '')
}
