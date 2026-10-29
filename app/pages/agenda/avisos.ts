/**
 * O aviso depois de criar uma reunião ligada, igual na grade, no item e na tarefa. A reunião nasce no Outlook (1ª
 * chamada) e o vínculo é a 2ª: quando a 2ª falha, o aviso diz que a reunião existe e oferece ligar de novo, em vez de
 * um erro genérico. A reunião pode nascer ligada a mais de um item, ou à tarefa de onde foi agendada.
 */
import type { Textos } from './textos'
import type { Alvo } from './mocks'
import { type Criado, item, ligar, reuniao, tarefa } from './estado'

/** Como o alvo aparece no aviso: o item pela referência, a tarefa pelo nome. */
export const nomeDoAlvo = (a: Alvo) => a.tipo === 'item' ? item(a.id)?.reference : tarefa(a.id)?.name

export function avisarReuniao(toast: ReturnType<typeof useToast>, t: Textos, c: Criado) {
  const tarefaAlvo = c.alvos.find(a => a.tipo === 'tarefa')
  const ref = c.alvos.map(nomeDoAlvo).filter(Boolean).join(', ')
  const ligada = tarefaAlvo && c.alvos.length === 1 ? t.modelo.ligadaATarefa(nomeDoAlvo(tarefaAlvo)!) : ref ? t.avisos.ligada(ref) : undefined
  if (!c.vinculoFalhou || !ref) return toast.add({ title: t.avisos.criado.reuniao, description: ligada, icon: 'i-lucide-circle-check', color: 'success' })
  toast.add({
    title: t.vinculo.falhouTitulo,
    description: t.vinculo.falhouTexto(ref),
    icon: 'i-lucide-unlink',
    color: 'warning',
    duration: 0,
    actions: [{
      label: t.vinculo.ligarDeNovo,
      color: 'warning',
      variant: 'outline',
      onClick: () => {
        const r = reuniao(c.chave.slice(2))
        if (!r) return
        c.alvos.forEach(a => ligar(r, a, 'criacao'))
        toast.add({ title: ligada ?? t.avisos.ligada(ref), icon: 'i-lucide-link-2', color: 'success' })
      },
    }],
  })
}
