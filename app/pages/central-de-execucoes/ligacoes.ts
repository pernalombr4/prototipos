/**
 * PROPOSTA: o ajuste das ligações do mapa. Hoje não existe.
 *
 * O ENSPACE desenha as ligações sozinho, pela configuração de cada fluxo (o gatilho e os nós que
 * gravam item) e, na fase 2, pelas execuções. Quando ele não tem certeza, quem administra ajusta:
 * - a ligação "possível" (o nó que grava depende de uma condição): Confirmar ou Descartar;
 * - a gravação que as execuções mostram e a configuração não: Confirmar;
 * - o nó que grava numa categoria definida por campo: Ligar a um fluxo, ou Descartar;
 * - o fluxo que começa por chamada externa (webhook): indicar o fluxo de origem, ou dizer que ele
 *   vem de fora do ENSPACE.
 *
 * O ajuste não muda a regra da operação nem o fluxo: só o desenho. Cada um guarda quem fez e o
 * motivo, e se desfaz. A ligação manual continua conferida pelas execuções.
 *
 * Tudo em memória: "Reiniciar" e o reload voltam ao começo.
 */
import { ref } from 'vue'
import type { Evento } from './mocks'

export type TipoDeAjuste = 'confirmada' | 'descartada' | 'externa'

export interface AjusteDeLigacao {
  /** A ligação ajustada: `<fluxo>>ev:<categoria>:<ação>`, `var:<fluxo>` ou `ext:<fluxo>`. */
  chave: string
  tipo: TipoDeAjuste
  fluxo: number
  evento?: Evento
}

export interface LigacaoManual {
  id: string
  de: number
  para: number
  /** O evento pelo qual o destino começa. Sem evento: chamada direta (webhook, por exemplo). */
  evento?: Evento
  motivo: string
}

export const ajustes = ref<AjusteDeLigacao[]>([])
export const manuais = ref<LigacaoManual[]>([])

export function reiniciarLigacoes() {
  ajustes.value = []
  manuais.value = []
}

export const ajusteDe = (chave: string) => ajustes.value.find(a => a.chave === chave)
export function ajustar(a: AjusteDeLigacao) {
  ajustes.value = [...ajustes.value.filter(x => x.chave !== a.chave), a]
}
export function desfazerAjuste(chave: string) {
  ajustes.value = ajustes.value.filter(a => a.chave !== chave)
}

let proxima = 1
export function ligar(m: Omit<LigacaoManual, 'id'>) {
  const nova = { ...m, id: `manual-${proxima++}` }
  manuais.value = [...manuais.value, nova]
  return nova
}
export function desligar(id: string) {
  manuais.value = manuais.value.filter(m => m.id !== id)
}
