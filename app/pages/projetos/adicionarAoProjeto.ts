/**
 * PROPOSTA (rodada 5 e 6): o que se adiciona dentro de um projeto pelo menu lateral.
 *
 * Uma lista só, usada em 2 lugares: o "+" da linha do projeto (atalho) e o submenu "Adicionar" do
 * "•••" da mesma linha, como o "Criar novo" do menu do espaço no ClickUp.
 * Quem participa sem administrar vê só a nova tarefa: no produto, criar painel e workflow é de quem
 * administra.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Projeto } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { useProjetos } from './estado'

export function useAdicionarAoProjeto() {
  const prj = useProjetos()
  const r = useTextos(textosDoProjeto)

  /** o projeto aceita coisa nova: a pessoa entra nele e ele está ativo */
  const aceita = (p: Projeto) => prj.entra(p) && p.status === 'ativo'

  function itens(p: Projeto): DropdownMenuItem[][] {
    const m = r.value.menu
    const admin = prj.podeAdministrar(p)
    const grupos: DropdownMenuItem[][] = []
    if (admin) {
      grupos.push([
        { type: 'label', label: m.grupoCategoria },
        { label: m.novaCategoria, description: m.novaCategoriaDica, icon: 'i-lucide-folder-plus', onSelect: () => { prj.janelas.novaCategoria.value = p.id } },
        { label: m.categoriaExistente, description: m.categoriaExistenteDica, icon: 'i-lucide-folder-input', onSelect: () => { prj.janelas.configurar.value = { id: p.id, aba: 'categorias' } } },
      ])
    }
    grupos.push([
      { type: 'label', label: m.grupoTrabalho },
      { label: m.novaTarefa, description: m.novaTarefaDica, icon: 'i-lucide-square-check', onSelect: () => { prj.janelas.novaTarefa.value = p.id } },
      ...(admin
        ? [
            { label: m.novoPainel, description: m.novoPainelDica, icon: 'i-lucide-chart-column', onSelect: () => { prj.criarDashboard(p.id, m.nomeDoPainel) } },
            { label: m.novoWorkflow, description: m.novoWorkflowDica, icon: 'i-lucide-workflow', onSelect: () => { prj.janelas.novoFluxo.value = p.id } },
          ]
        : []),
    ])
    return grupos
  }

  /** o grupo que abre o "•••": o submenu Adicionar, com a mesma lista do "+" */
  function grupoDoMenu(p: Projeto): DropdownMenuItem[][] {
    if (!aceita(p)) return []
    return [[{ label: r.value.menu.adicionar, icon: 'i-lucide-plus', children: itens(p), content: { class: 'w-72' } } as DropdownMenuItem]]
  }

  return { aceita, itens, grupoDoMenu }
}
