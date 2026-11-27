/**
 * Rodada 14 (B11): as opções de pessoa dos campos Responsável e Colaboradores do marco e da tarefa.
 * Aparecem primeiro as pessoas que entram no projeto. Quem administra o projeto vê também as outras pessoas do
 * workspace, no grupo "Sem acesso ao projeto"; escolher uma delas a inclui como participante, com um aviso.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import { iniciais, pessoa, type Pessoa } from './mocks'
import { useProjetos } from './estado'
import { textosDasRelacoes } from './textosDasRelacoes'

export function useOpcoesDePessoas() {
  const prj = useProjetos()
  const toast = useToast()
  const tr = useTextos(textosDasRelacoes)

  const item = (a: Pessoa) => ({ value: a.id, label: a.nome, avatar: { text: iniciais(a.nome) } })
  /** Para USelect e USelectMenu: 1 grupo, ou 2 com o rótulo "Sem acesso ao projeto". */
  function opcoes(projetoId: number) {
    const dentro = prj.pessoasDoProjeto(projetoId).map(item)
    const fora = prj.pessoasDeFora(projetoId).map(item)
    if (!fora.length) return dentro
    return [dentro, [{ type: 'label' as const, label: tr.value.pessoas.semAcesso }, ...fora]]
  }
  /** Para UDropdownMenu (a linha de criar subtarefa). */
  function menu(projetoId: number, escolher: (id: number) => void): DropdownMenuItem[][] {
    const linha = (a: Pessoa): DropdownMenuItem => ({ label: a.nome, avatar: { text: iniciais(a.nome), alt: a.nome }, onSelect: () => escolher(a.id) })
    const fora = prj.pessoasDeFora(projetoId)
    return [
      prj.pessoasDoProjeto(projetoId).map(linha),
      ...(fora.length ? [[{ type: 'label' as const, label: tr.value.pessoas.semAcesso }, ...fora.map(linha)]] : []),
    ]
  }
  /** Inclui no projeto quem foi escolhido sem ter acesso e avisa. */
  function garantir(projetoId: number, ids: number | number[] | undefined) {
    for (const id of ([] as number[]).concat(ids ?? [])) {
      if (prj.garantirAcesso(projetoId, id)) toast.add({ title: tr.value.pessoas.incluida(pessoa(id)?.nome ?? ''), icon: 'i-lucide-user-plus', color: 'info' })
    }
  }
  return { opcoes, menu, garantir }
}
