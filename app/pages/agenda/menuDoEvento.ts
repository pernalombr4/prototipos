/**
 * O menu do botão direito no evento (pedido da redatora em 29/10/2026, a partir da agenda do Teams, que é a do Outlook,
 * e do Google Agenda): as ações do dia a dia sem abrir o popover. Entra só o que a pessoa pode fazer, como no popover.
 *
 * "Agendar reunião sobre isto" vem do Outlook, que marca uma reunião a partir de um evento: aqui, a partir da tarefa ou
 * do item, com o título e o item já ligados.
 */
import type { ContextMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { bloco, ehMinha, ehOrganizador, estado, foto, item, removerBloco, responder, restaurar, reuniao, tarefa } from './estado'
import { EU } from './mocks'

export interface AcoesDoMenu {
  abrir: (chave: string) => void
  cumprir: (id: number) => void
  irParaTarefa: (id: number, aba?: 'tarefa' | 'agenda') => void
  acessarItem: (id: number) => void
  agendarReuniao: (chave: string, titulo: string, itemId: number | null) => void
  avisar: (titulo: string, desfazer?: () => void) => void
}

export function menuDoEvento(chave: string, t: Textos, a: AcoesDoMenu): ContextMenuItem[][] {
  const tipo = chave.slice(0, 1)
  const id = chave.slice(2)
  const m = t.menu
  const abrir: ContextMenuItem = { label: m.abrir, icon: 'i-lucide-panel-top-open', onSelect: () => a.abrir(chave) }
  const copiar = (texto: string, aviso: string): ContextMenuItem['onSelect'] => () => {
    navigator.clipboard?.writeText(texto).catch(() => {})
    a.avisar(aviso)
  }
  const comOutlook = estado.outlook === 'conectado'

  if (tipo === 'r') {
    const r = reuniao(id)
    if (!r) return []
    const org = ehOrganizador(r)
    const eu = r.participantes.find(p => p.email === EU.email)
    const ligados = r.itens.map(item).filter(x => !!x)
    const grupos: ContextMenuItem[][] = []
    if (!org && eu) {
      grupos.push([
        { type: 'label', label: m.voceVai },
        ...(['sim', 'nao', 'talvez'] as const).map(x => ({ label: t.detalhe.respostas[x], type: 'checkbox' as const, checked: eu.resposta === x, onUpdateChecked: () => responder(r, x) })),
      ])
    }
    if (r.teams) {
      grupos.push([
        { label: m.participar, icon: 'i-lucide-video', onSelect: () => a.avisar(m.abrindoTeams) },
        { label: m.copiarLink, icon: 'i-lucide-link', onSelect: copiar(`https://teams.example/${r.id}`, m.linkCopiado) },
      ])
    }
    grupos.push([
      abrir,
      ...(ligados.length ? [{ label: m.itensLigados(ligados.length), icon: 'i-lucide-link-2', children: ligados.map(i => ({ label: `${i.reference} · ${i.titulo}`, onSelect: () => a.acessarItem(i.id) })) }] : []),
    ])
    if (org) {
      grupos.push([{
        label: m.cancelarReuniao, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => {
          const antes = foto()
          estado.reunioes = estado.reunioes.filter(x => x.id !== r.id)
          a.avisar(m.reuniaoCancelada, () => restaurar(antes))
        },
      }])
    }
    return grupos
  }

  const b = tipo === 'b' ? bloco(id) : undefined
  const tf = b ? tarefa(b.tarefaId) : tipo === 't' || tipo === 'q' ? tarefa(Number(id)) : undefined
  if (tf) {
    const minha = ehMinha(tf)
    const feita = tf.status === 'completed'
    const it = item(tf.item)
    const tarefaEm: ContextMenuItem[] = [
      ...(minha ? [{ label: feita ? t.detalhe.reabrir : t.detalhe.cumprir, icon: feita ? 'i-lucide-rotate-ccw' : 'i-lucide-circle-check', onSelect: () => a.cumprir(tf.id) }] : []),
      { label: t.detalhe.abrirTarefa, icon: 'i-lucide-arrow-up-right', onSelect: () => a.irParaTarefa(tf.id) },
      ...(minha && !feita && !b ? [{ label: m.reservarHorario, icon: 'i-lucide-timer', onSelect: () => a.irParaTarefa(tf.id, 'agenda') }] : []),
    ]
    const ligacoes: ContextMenuItem[] = [
      ...(it ? [{ label: t.detalhe.abrirItem, icon: 'i-lucide-folder-open', onSelect: () => a.acessarItem(it.id) }] : []),
      ...(comOutlook ? [{ label: m.agendarReuniao, icon: 'i-lucide-calendar-plus', onSelect: () => a.agendarReuniao(chave, tf.name, it?.id ?? null) }] : []),
    ]
    const grupos: ContextMenuItem[][] = [[abrir, ...tarefaEm]]
    if (ligacoes.length) grupos.push(ligacoes)
    grupos.push([{ label: m.copiarLinkDaTarefa, icon: 'i-lucide-link', onSelect: copiar(`https://enspace.example/tarefas/${tf.id}`, m.linkDaTarefaCopiado) }])
    if (b && minha) {
      grupos.push([{
        label: t.detalhe.removerBloco, icon: 'i-lucide-timer-off', color: 'error', onSelect: () => {
          const antes = foto()
          removerBloco(b.id)
          a.avisar(m.blocoRemovido, () => restaurar(antes))
        },
      }])
    }
    return grupos
  }

  const it = tipo === 'i' ? item(Number(id)) : null
  if (!it) return []
  return [
    [abrir, { label: t.detalhe.abrirItem, icon: 'i-lucide-folder-open', onSelect: () => a.acessarItem(it.id) }],
    ...(comOutlook ? [[{ label: m.agendarReuniao, icon: 'i-lucide-calendar-plus', onSelect: () => a.agendarReuniao(chave, it.titulo, it.id) }]] : []),
    [{ label: m.copiarReferencia, icon: 'i-lucide-copy', onSelect: copiar(it.reference, m.referenciaCopiada(it.reference)) }],
  ]
}
