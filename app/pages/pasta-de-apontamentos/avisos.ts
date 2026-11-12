/**
 * As notificações do sino, em memória (rodada 4).
 *
 * Proposta: o apontamento atribuído, reaberto ou enviado num retorno avisa cada
 * responsável no sino do topo. Quem fez a ação não recebe o próprio aviso.
 * O texto se monta na hora de mostrar, no idioma da interface; aqui fica só o
 * dado. Recarregar a página volta aos 2 avisos de exemplo.
 */
import { reactive } from 'vue'

export type TipoDeAviso = 'atribuido' | 'reaberto' | 'retorno'

export interface Aviso {
  id: string
  para: number
  /** Quem fez a ação. */
  quem: number
  tipo: TipoDeAviso
  /** Atribuído e reaberto: o apontamento. */
  apontamento?: string
  numero?: number
  titulo?: string
  /** Retorno: a rodada e quantos apontamentos são da pessoa. */
  rodada?: number
  qtd?: number
  quando: Date
  lida: boolean
}

type Dados = Omit<Aviso, 'id' | 'para' | 'quem' | 'quando' | 'lida'>

let seq = 0
const agora = Date.now()

export const avisos = reactive<Aviso[]>([
  // Produto: Ana (1) reabriu o #2 para o Bruno (2).
  { id: 'av-1', para: 2, quem: 1, tipo: 'reaberto', apontamento: 'ap-2', numero: 2, titulo: 'Rodapé avisa "Alterações não salvas" sem nenhuma alteração', quando: new Date(agora - 1000 * 60 * 60 * 26), lida: false },
  // Jurídico: Helena (11) atribuiu o #2 ao Rafael (12).
  { id: 'av-2', para: 12, quem: 11, tipo: 'atribuido', apontamento: 'jap-2', numero: 2, titulo: 'Vigência diverge da proposta comercial', quando: new Date(agora - 1000 * 60 * 60 * 50), lida: false },
])

/** Registra 1 aviso para cada pessoa, menos para quem fez a ação. */
export function avisar(para: number[], quem: number, dados: Dados) {
  for (const p of new Set(para)) {
    if (p === quem) continue
    avisos.unshift({ id: `av-n${++seq}`, para: p, quem, quando: new Date(), lida: false, ...dados })
  }
}

export const avisosDe = (quem: number) => avisos.filter(a => a.para === quem)

export function marcarLidas(quem: number) {
  for (const a of avisos) if (a.para === quem) a.lida = true
}
