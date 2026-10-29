/**
 * O menu do botão direito no evento (pedido da redatora em 29/10/2026, a partir da agenda do Teams, que é a do Outlook,
 * e do Google Agenda): as ações do dia a dia sem abrir o popover. Entra só o que a pessoa pode fazer, como no popover.
 *
 * "Agendar reunião sobre isto" vem do Outlook, que marca uma reunião a partir de um evento: aqui, a partir da tarefa ou
 * do item, com o título e o vínculo já feitos. A reunião agendada sobre a tarefa se liga à tarefa (correção da
 * redatora em 29/10/2026); a agendada sobre o item, ao item.
 *
 * Modelagem da rodada 2: "Atribuir a" muda o responsável da tarefa e oferece o horário futuro a quem entra; o horário
 * oferecido tem Aceitar e Recusar; cancelar a reunião a tira da grade e a deixa no histórico do item.
 */
import type { ContextMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { Alvo } from './mocks'
import { aceitarBloco, atribuir, bloco, cancelar, ehMinha, ehOrganizador, estado, foto, item, lerChave, ligacoesDa, meuBloco, participo, removerBloco, responder, restaurar, reuniao, tarefa, temSla, tituloOculto } from './estado'
import { EU, pessoaPorId, pessoas } from './mocks'

export interface AcoesDoMenu {
  abrir: (chave: string) => void
  cumprir: (id: number) => void
  irParaTarefa: (id: number, aba?: 'tarefa' | 'agenda') => void
  acessarItem: (id: number) => void
  agendarReuniao: (chave: string, titulo: string, alvo: Alvo) => void
  avisar: (titulo: string, desfazer?: () => void, descricao?: string) => void
}

export function menuDoEvento(chave: string, t: Textos, a: AcoesDoMenu): ContextMenuItem[][] {
  const { tipo, id } = lerChave(chave)
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
    const { vinculos, semAcesso } = ligacoesDa(r)
    const ligados: ContextMenuItem[] = vinculos.map((v) => {
      if (v.alvo.tipo === 'tarefa') {
        const tf = tarefa(v.alvo.id)!
        return { label: `${t.modelo.tarefa} · ${tf.name}`, icon: 'i-lucide-flag', onSelect: () => a.irParaTarefa(tf.id, 'agenda') }
      }
      const i = item(v.alvo.id)!
      return { label: `${i.reference} · ${i.titulo}`, onSelect: () => a.acessarItem(i.id) }
    })
    if (semAcesso) ligados.push({ label: t.modelo.semAcesso(semAcesso), icon: 'i-lucide-eye-off', disabled: true })
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
      ...(ligados.length && !tituloOculto(r) ? [{ label: m.itensLigados(ligados.length), icon: 'i-lucide-link-2', children: ligados }] : []),
    ])
    if (org) {
      grupos.push([{
        label: m.cancelarReuniao, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => {
          const antes = foto()
          cancelar(r)
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
    // O horário que chegou com a tarefa: aceitar ou recusar vem antes de tudo.
    if (b?.oferecidoA === EU.id) {
      return [
        [{ type: 'label', label: t.modelo.oferecido(pessoaPorId(b.dono)?.nome ?? '--') }],
        [
          { label: t.modelo.aceitar, icon: 'i-lucide-check', onSelect: () => { aceitarBloco(b.id); a.avisar(t.modelo.aceito) } },
          { label: t.modelo.recusar, icon: 'i-lucide-x', onSelect: () => { const antes = foto(); removerBloco(b.id); a.avisar(t.modelo.recusado, () => restaurar(antes)) } },
        ],
        [abrir, { label: t.detalhe.abrirTarefa, icon: 'i-lucide-arrow-up-right', onSelect: () => a.irParaTarefa(tf.id) }],
      ]
    }
    const atribuirA: ContextMenuItem = {
      label: t.modelo.atribuirA,
      icon: 'i-lucide-user-round-cog',
      children: pessoas.filter(p => p.id !== tf.assigned_to).map(p => ({
        label: p.nome,
        avatar: { text: p.iniciais, alt: p.nome },
        onSelect: () => {
          const antes = foto()
          const n = atribuir(tf, p.id)
          a.avisar(t.modelo.atribuida(p.nome), () => restaurar(antes), n ? t.modelo.oferecidos(n, p.nome) : undefined)
        },
      })),
    }
    const tarefaEm: ContextMenuItem[] = [
      ...(minha ? [{ label: feita ? t.detalhe.reabrir : t.detalhe.cumprir, icon: feita ? 'i-lucide-rotate-ccw' : 'i-lucide-circle-check', onSelect: () => a.cumprir(tf.id) }] : []),
      { label: t.detalhe.abrirTarefa, icon: 'i-lucide-arrow-up-right', onSelect: () => a.irParaTarefa(tf.id) },
      ...(participo(tf) && !feita && !b && temSla(tf) ? [{ label: m.reservarHorario, icon: 'i-lucide-timer', onSelect: () => a.irParaTarefa(tf.id, 'agenda') }] : []),
      ...(minha && !feita && !b ? [atribuirA] : []),
    ]
    const ligacoes: ContextMenuItem[] = [
      ...(it ? [{ label: t.detalhe.abrirItem, icon: 'i-lucide-folder-open', onSelect: () => a.acessarItem(it.id) }] : []),
      ...(comOutlook && participo(tf) ? [{ label: m.agendarReuniao, icon: 'i-lucide-calendar-plus', onSelect: () => a.agendarReuniao(chave, tf.name, { tipo: 'tarefa', id: tf.id }) }] : []),
    ]
    const grupos: ContextMenuItem[][] = [[abrir, ...tarefaEm]]
    if (ligacoes.length) grupos.push(ligacoes)
    grupos.push([{ label: m.copiarLinkDaTarefa, icon: 'i-lucide-link', onSelect: copiar(`https://enspace.example/tarefas/${tf.id}`, m.linkDaTarefaCopiado) }])
    if (b && meuBloco(b)) {
      grupos.push([{
        label: t.detalhe.removerBloco, icon: 'i-lucide-timer-off', color: 'error', onSelect: () => {
          const antes = foto()
          removerBloco(b.id)
          a.avisar(m.blocoRemovido, () => restaurar(antes), b.eventoExterno ? t.modelo.saiDoOutlook : undefined)
        },
      }])
    }
    return grupos
  }

  const it = tipo === 'i' ? item(Number(id)) : null
  if (!it) return []
  return [
    [abrir, { label: t.detalhe.abrirItem, icon: 'i-lucide-folder-open', onSelect: () => a.acessarItem(it.id) }],
    ...(comOutlook ? [[{ label: m.agendarReuniao, icon: 'i-lucide-calendar-plus', onSelect: () => a.agendarReuniao(chave, it.titulo, { tipo: 'item', id: it.id }) }]] : []),
    [{ label: m.copiarReferencia, icon: 'i-lucide-copy', onSelect: copiar(it.reference, m.referenciaCopiada(it.reference)) }],
  ]
}
