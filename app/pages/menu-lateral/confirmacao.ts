/**
 * A CONFIRMAÇÃO ANTES DE EXCLUIR UM PAINEL (rodada 34).
 *
 * "pode botar a confirmaçao no painel do menu" (Mikaela, 21/10/2026), a partir
 * do relatório das Telas: excluir um menu custa pouco numa lista, que se
 * refaz em 1 minuto, e custa muito num painel com 20 widgets configurados.
 *
 * Por isso a confirmação vale só para o que leva painel junto:
 *   - o menu cujo tipo é Painéis;
 *   - a seção que tem um painel dentro (a seção sai com os menus dela).
 * O menu comum continua saindo na hora, com o aviso, como na rodada 30.
 *
 * Os 3 caminhos de excluir (botão direito, Personalizar e a trilha) passam
 * por `pedir()`: sem painel, ele exclui na hora; com painel, abre a janela.
 */
import type { NoDoMenu } from './mocks'

interface PedidoDeExclusao {
  no: NoDoMenu
  nome: string
  paineis: number
  executar: () => void
}

/** Quantos painéis saem junto. O menu comum leva só ele; a seção leva tudo dentro. */
function paineisQueSaem(no: NoDoMenu): number {
  if (no.tipo !== 'secao') return no.tipoDeTela === 'paineis' ? 1 : 0
  const contar = (n: NoDoMenu): number =>
    (n.tipo === 'tela' && n.tipoDeTela === 'paineis' ? 1 : 0)
    + (n.filhos ?? []).reduce((soma, f) => soma + contar(f), 0)
  return (no.filhos ?? []).reduce((soma, f) => soma + contar(f), 0)
}

export function useConfirmarExclusao() {
  const pedido = useState<PedidoDeExclusao | null>('menu-confirmar-exclusao', () => null)

  function pedir(no: NoDoMenu, nome: string, executar: () => void) {
    const paineis = paineisQueSaem(no)
    if (!paineis) {
      executar()
      return
    }
    pedido.value = { no, nome, paineis, executar }
  }

  function confirmar() {
    pedido.value?.executar()
    pedido.value = null
  }

  return { pedido, pedir, confirmar }
}
