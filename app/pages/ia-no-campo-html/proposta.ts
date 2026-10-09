/**
 * A proposta do BENI dentro do texto, como o Notion faz: o trecho que vai
 * sair fica riscado e o texto novo aparece realçado no lugar, sem gravar
 * nada no documento. Só o Aceitar grava (e o Ctrl Z desfaz em 1 passo).
 *
 * Também realça o trecho em foco enquanto a caixa do BENI está aberta: a
 * seleção do navegador some quando o foco vai para o campo de pedido.
 *
 * É um plugin de decorações do ProseMirror, a peça que o time de front usa no
 * TipTap do produto. O estado entra por `tr.setMeta(chaveDaProposta, {...})`.
 */
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export interface Intervalo { from: number, to: number }

export interface Proposta {
  /** O trecho que sai (riscado). Vazio quando a resposta só acrescenta. */
  riscar: Intervalo | null
  /** Onde o texto novo aparece. */
  em: number
  html: string
  /** true: entra como bloco entre parágrafos; false: no meio da linha. */
  bloco: boolean
}

export interface EstadoDaProposta {
  foco: Intervalo | null
  proposta: Proposta | null
}

export const chaveDaProposta = new PluginKey<EstadoDaProposta>('propostaDoBeni')

const vazio: EstadoDaProposta = { foco: null, proposta: null }

function widget(p: Proposta) {
  const el = document.createElement(p.bloco ? 'div' : 'span')
  el.setAttribute('data-proposta-do-beni', '')
  el.className = p.bloco
    ? 'my-1 block rounded-md bg-primary/10 px-2 py-1 text-highlighted ring-1 ring-primary/20 [&_li]:ms-5 [&_li]:list-disc [&_p]:my-1 [&_strong]:font-semibold [&_ul]:my-1'
    : 'rounded-sm bg-primary/15 px-0.5 text-highlighted'
  el.innerHTML = p.html || '<span class="inline-block h-4 w-1.5 animate-pulse rounded-sm bg-primary align-middle"></span>'
  return el
}

export const PropostaDoBeni = Extension.create({
  name: 'propostaDoBeni',

  addProseMirrorPlugins() {
    return [
      new Plugin<EstadoDaProposta>({
        key: chaveDaProposta,
        state: {
          init: () => vazio,
          apply(tr, valor) {
            const meta = tr.getMeta(chaveDaProposta) as Partial<EstadoDaProposta> | undefined
            let v = meta ? { ...valor, ...meta } : valor
            if (tr.docChanged && (v.foco || v.proposta)) {
              const m = (i: Intervalo | null) => i && { from: tr.mapping.map(i.from), to: tr.mapping.map(i.to) }
              v = {
                foco: m(v.foco),
                proposta: v.proposta && { ...v.proposta, riscar: m(v.proposta.riscar), em: tr.mapping.map(v.proposta.em) },
              }
            }
            return v
          },
        },
        props: {
          decorations(state) {
            const v = chaveDaProposta.getState(state) ?? vazio
            const decos: Decoration[] = []
            if (v.foco && v.foco.from < v.foco.to && !v.proposta) {
              decos.push(Decoration.inline(v.foco.from, v.foco.to, { class: 'rounded-sm bg-primary/15' }))
            }
            const p = v.proposta
            if (p) {
              if (p.riscar && p.riscar.from < p.riscar.to) {
                decos.push(Decoration.inline(p.riscar.from, p.riscar.to, { class: 'text-muted line-through decoration-error/60 bg-error/5' }))
              }
              decos.push(Decoration.widget(p.em, () => widget(p), { side: 1, key: `beni-${p.em}-${p.html.length}` }))
            }
            return decos.length ? DecorationSet.create(state.doc, decos) : DecorationSet.empty
          },
        },
      }),
    ]
  },
})
