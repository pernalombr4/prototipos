/**
 * O aviso depois de criar uma reunião ligada a um item, igual na grade, no item e na tarefa. A reunião nasce no
 * Outlook (1ª chamada) e o vínculo é a 2ª: quando a 2ª falha, o aviso diz que a reunião existe e oferece ligar de
 * novo, em vez de um erro genérico.
 */
import type { Textos } from './textos'
import { type Criado, item, ligar, reuniao } from './estado'

export function avisarReuniao(toast: ReturnType<typeof useToast>, t: Textos, c: Criado, itemId: number | null) {
  const ref = item(itemId)?.reference
  if (!c.vinculoFalhou || !ref) return toast.add({ title: t.avisos.criado.reuniao, description: ref ? t.avisos.ligada(ref) : undefined, icon: 'i-lucide-circle-check', color: 'success' })
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
        ligar(r, itemId)
        toast.add({ title: t.avisos.ligada(ref), icon: 'i-lucide-link-2', color: 'success' })
      },
    }],
  })
}
