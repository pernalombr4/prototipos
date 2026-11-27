/**
 * Rodada 13: pôr e tirar o projeto do menu, no padrão que o ENSPACE já usa na barra de informações do item e na barra
 * de pastas (lido no código do front em 2026-11-27):
 *  - a mudança pessoal salva na hora e o aviso diz "Só para você.", com Desfazer;
 *  - "Salvar para todos" fica só com quem administra o workspace (Proprietário e Full) e pede confirmação;
 *  - quem personalizou o próprio menu continua com o dele.
 * Usuário comum vê só "Adicionar ao menu" ou "Ocultar do menu". Quem administra vê o mesmo item com a escolha
 * "Salvar para mim" ou "Salvar para todos".
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Projeto } from './mocks'
import { useProjetos } from './estado'
import { textosDoMenu } from './textosDoMenu'

export function useMenuDoProjeto() {
  const prj = useProjetos()
  const toast = useToast()
  const tm = useTextos(textosDoMenu)
  /** A confirmação do "Salvar para todos", aberta por `_ConfirmarMenuParaTodos.vue`. */
  const pendente = useState<{ id: number, mostrar: boolean } | null>('prj-menu-para-todos', () => null)

  function salvarParaMim(p: Projeto, mostrar: boolean) {
    const antes = [...prj.noMenu.value.map(x => x.id)]
    if (mostrar) prj.mostrarNoMenu(p.id)
    else prj.ocultarDoMenu(p.id)
    toast.add({
      title: mostrar ? tm.value.adicionado(p.nome) : tm.value.ocultado(p.nome),
      description: tm.value.soParaVoce,
      icon: mostrar ? 'i-lucide-check' : 'i-lucide-eye-off',
      color: mostrar ? 'success' : 'neutral',
      actions: [{ label: tm.value.desfazer, color: 'neutral', variant: 'outline', onClick: () => prj.reordenar(antes) }],
    })
  }

  /** As 2 escolhas de quem administra, para o submenu ou para o menu do botão. */
  function escolhas(p: Projeto, mostrar: boolean): DropdownMenuItem[] {
    return [
      { label: tm.value.salvarParaMim, icon: 'i-lucide-user-round', onSelect: () => salvarParaMim(p, mostrar) },
      { label: tm.value.salvarParaTodos, icon: 'i-lucide-users', onSelect: () => { pendente.value = { id: p.id, mostrar } } },
    ]
  }

  /** Os itens do menu ⋮ do projeto. */
  function itens(p: Projeto): DropdownMenuItem[] {
    const mostrar = !prj.estaNoMenu(p.id)
    const label = mostrar ? tm.value.adicionar : tm.value.ocultar
    const icon = mostrar ? 'i-lucide-panel-left' : 'i-lucide-eye-off'
    if (!prj.souDono.value) return [{ label, icon, onSelect: () => salvarParaMim(p, mostrar) }]
    const lista: DropdownMenuItem[] = [{ label, icon, children: [escolhas(p, mostrar)] }]
    // está no menu de quem administra, mas não no de todos: o atalho para levar a todos
    if (!mostrar && !p.noMenuDeTodos)
      lista.push({ label: tm.value.adicionarParaTodos, icon: 'i-lucide-users', onSelect: () => { pendente.value = { id: p.id, mostrar: true } } })
    return lista
  }

  function confirmar() {
    const x = pendente.value
    if (!x) return
    prj.salvarParaTodos(x.id, x.mostrar)
    pendente.value = null
    toast.add({ title: tm.value.atualizadoParaTodos, icon: 'i-lucide-users', color: 'success' })
  }

  return { tm, pendente, itens, escolhas, salvarParaMim, confirmar }
}
