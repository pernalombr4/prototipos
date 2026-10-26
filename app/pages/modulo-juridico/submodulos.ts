/**
 * Os submódulos do Módulo Jurídico e o que o protótipo mostra de cada um.
 *
 * Rodada 3 (2026-10-26): a redatora pediu submódulos ativados um a um, começando por Capturas (captura e prazo). O
 * resto do que as rodadas 1 e 2 desenharam fica no código e sai da tela até ser liberado. Liberar é mudar a chave
 * aqui para `true`.
 */
export const LIBERADO = {
  /** Captura de publicações, intimações, citações, distribuições e andamentos, e o prazo que nasce delas. */
  capturas: true,
  /** Provisão por data-base (rodada 1). Oculta. */
  provisao: false,
  /** A aba "Casos de uso" da página do módulo e o andaime "Módulo ou caso de uso" (rodada 1). Ocultos. */
  casosDeUso: false,
} as const
