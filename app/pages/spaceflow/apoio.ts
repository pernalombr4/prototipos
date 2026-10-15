/**
 * Apoio do protótipo: o resumo de 1 linha que o card de cada nó mostra e a
 * lista de variáveis que chegam a um nó (painel ENTRADA).
 *
 * O resumo é a proposta de maior retorno da pesquisa (n8n e HubSpot montam o
 * subtítulo do nó a partir da configuração; o develop mostra a descrição
 * genérica do tipo). Ele só lê o que o nó já guarda.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Aresta, No } from './mocks'
import { agentes, categorias, credenciais, membros } from './mocks'
import type { Dado, L } from './nos'
import { definicoes, l, operadores } from './nos'

const t = (x: L, i: Idioma) => x[i]

/** "{{nodes.trig.data.contratante}}" vira "Contratante". */
export function nomeDaVariavel(texto: string, nos: No[]): string {
  return texto.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, chave: string) => {
    const v = indiceDeVariaveis(nos).get(chave.trim())
    return v ? v.rotulo : chave.split('.').at(-1) ?? chave
  })
}

function curto(s: string, n = 48) {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s
}

function membro(id?: string) {
  return membros.find(m => m.id === id)?.nome.split(' ')[0]
}

export function resumir(no: No, i: Idioma, nos: No[]): string {
  const d = no.data as Dado
  const v = (s: string) => nomeDaVariavel(s ?? '', nos)
  const P = (pt: string, en: string, es: string) => t(l(pt, en, es), i)

  switch (no.type) {
    case 'trigger': {
      if (d.type === 'events') {
        const cat = categorias.find(c => c.id === d.scope)?.nome ?? '…'
        const acao = { create: P('criado', 'created', 'creado'), update: P('alterado', 'updated', 'modificado'), delete: P('excluído', 'deleted', 'eliminado') }[d.action as 'create'] ?? '…'
        return P(`Quando um item de ${cat} for ${acao}`, `When a ${cat} item is ${acao}`, `Cuando un ítem de ${cat} sea ${acao}`)
      }
      if (d.type === 'webhook') return P('Quando outro sistema chamar o webhook', 'When another system calls the webhook', 'Cuando otro sistema llame al webhook')
      if (d.type === 'cron') return P('Por agendamento', 'On a schedule', 'Por programación')
      if (d.type === 'mailbox') return P('Quando chegar e-mail na caixa monitorada', 'When an email reaches the watched mailbox', 'Cuando llegue un correo a la casilla')
      return P('Quando alguém iniciar pelo botão Iniciar', 'When someone starts it with the Start button', 'Cuando alguien lo inicie con el botón Iniciar')
    }
    case 'ai_extract': {
      const n = d.fields?.length ?? 0
      if (!n) return ''
      const nomes = d.fields.slice(0, 2).map((c: any) => c.label).join(', ')
      return P(`Extrai ${n} campos: ${nomes}${n > 2 ? '…' : ''}`, `Extracts ${n} fields: ${nomes}${n > 2 ? '…' : ''}`, `Extrae ${n} campos: ${nomes}${n > 2 ? '…' : ''}`)
    }
    case 'http':
      return d.url ? `${d.method} ${curto(v(d.url).replace(/^https?:\/\//, ''), 38)}` : ''
    case 'conditionals': {
      const c = d.conditionals?.and?.[0] ?? d.conditionals?.or?.[0]
      if (!c) return ''
      const op = operadores.find(o => o.valor === c.op)?.rotulo[i] ?? c.op
      const total = (d.conditionals?.and?.length ?? 0) + (d.conditionals?.or?.length ?? 0)
      return `${curto(`${v(c.ref ?? c.field)} ${op} ${c.value ?? ''}`.trim(), 44)}${total > 1 ? P(` e mais ${total - 1}`, ` and ${total - 1} more`, ` y ${total - 1} más`) : ''}`
    }
    case 'approval':
    case 'task':
    case 'form': {
      if (!d.task_name) return ''
      const quem = membro(d.assign_to)
      const prazo = d.task_due_config?.value ? `${Math.abs(d.task_due_config.value)} ${P('dias', 'days', 'días')}` : ''
      const partes = [curto(v(d.task_name), 40), quem && P(`para ${quem}`, `to ${quem}`, `para ${quem}`), prazo && P(`prazo ${prazo}`, `due in ${prazo}`, `plazo ${prazo}`)].filter(Boolean)
      return partes.join(' · ')
    }
    case 'email': {
      if (!d.to?.length) return ''
      return P(`Para ${v(d.to[0])}: ${curto(v(d.subject ?? ''), 34)}`, `To ${v(d.to[0])}: ${curto(v(d.subject ?? ''), 34)}`, `Para ${v(d.to[0])}: ${curto(v(d.subject ?? ''), 34)}`)
    }
    case 'ai_generate':
    case 'ai_agent':
    case 'ai_router':
      if (no.type === 'ai_router' && d.routes?.length) return P(`Escolhe entre ${d.routes.length} rotas`, `Picks between ${d.routes.length} routes`, `Elige entre ${d.routes.length} rutas`)
      if (no.type === 'ai_agent' && d.agent && d.prompt) return `${agentes.includes(d.agent) ? d.agent : '…'}: ${curto(v(d.prompt ?? '').replace(/<[^>]*>/g, ''), 34)}`
      return d.prompt ? curto(v(d.prompt).replace(/<[^>]*>/g, ''), 54) : ''
    case 'merge':
      return d.count_rows?.length ? P(`Junta ${d.count_rows.length} caminhos`, `Joins ${d.count_rows.length} paths`, `Une ${d.count_rows.length} caminos`) : ''
    case 'crud': {
      const cat = categorias.find(c => c.id === d.type)?.nome
      if (!cat || !d.action) return ''
      const acao = { create: P('Cria', 'Creates', 'Crea'), read_one: P('Busca', 'Finds', 'Busca'), update: P('Altera', 'Updates', 'Modifica'), delete: P('Exclui', 'Deletes', 'Elimina'), read_many: P('Busca', 'Finds', 'Busca') }[d.action as 'create']
      const campos = d.fields?.length ? `: ${d.fields.map((f: any) => `${f.field} = ${v(String(f.value))}`).join(', ')}` : ''
      return curto(P(`${acao} item em ${cat}${campos}`, `${acao} item in ${cat}${campos}`, `${acao} ítem en ${cat}${campos}`), 58)
    }
    case 'route':
      return d.routes?.length ? P(`${d.routes.length} rotas e a saída Sempre`, `${d.routes.length} routes plus the Always output`, `${d.routes.length} rutas y la salida Siempre`) : ''
    case 'comparison_notification':
      return d.comparison ? P(`Relatório de ${d.comparison}`, `Report of ${d.comparison}`, `Informe de ${d.comparison}`) : ''
    case 'end':
      return P('Encerra o fluxo.', 'Ends the flow.', 'Termina el flujo.')
    default:
      return ''
  }
}

/* ------------------------------------------------------------------ *
 * Variáveis que chegam a um nó                                        *
 * ------------------------------------------------------------------ */

export interface VariavelDeEntrada {
  /** O que vai para o campo: `{{nodes.trig.data.contratante}}`. */
  chave: string
  rotulo: string
  tipo?: string
}

export interface GrupoDeVariaveis {
  noId: string
  no: string
  icone: string
  variaveis: VariavelDeEntrada[]
}

/** Os nós de onde dá para chegar até `id`, do mais perto para o mais longe. */
export function anteriores(id: string, arestas: Aresta[]): string[] {
  const vistos: string[] = []
  let fila = [id]
  while (fila.length) {
    const prox: string[] = []
    for (const alvo of fila) {
      for (const a of arestas) {
        if (a.target === alvo && !vistos.includes(a.source)) {
          vistos.push(a.source)
          prox.push(a.source)
        }
      }
    }
    fila = prox
  }
  return vistos
}

const ROTULO_DO_TIPO: Record<string, string> = { money: 'number', date: 'date', file: 'file', email: 'email', select: 'select', text: 'text', number: 'number', relation: 'relation' }

function variaveisDoNo(no: No, i: Idioma): VariavelDeEntrada[] {
  const d = no.data as Dado
  if (no.type === 'trigger' && d.type === 'events') {
    const cat = categorias.find(c => c.id === d.scope)
    return [
      { chave: `{{nodes.${no.id}.reference}}`, rotulo: t(l('Referência', 'Reference', 'Referencia'), i), tipo: 'text' },
      ...(cat?.campos ?? []).map(c => ({ chave: `{{nodes.${no.id}.data.${c.chave}}}`, rotulo: c.rotulo, tipo: ROTULO_DO_TIPO[c.tipo] })),
    ]
  }
  const def = definicoes[no.type]
  return (def?.variaveis?.(d) ?? []).map(x => ({ chave: `{{nodes.${no.id}.${x.chave}}}`, rotulo: x.rotulo[i], tipo: x.tipo }))
}

export function variaveisDeEntrada(id: string, nos: No[], arestas: Aresta[], i: Idioma): GrupoDeVariaveis[] {
  return anteriores(id, arestas)
    .map(a => nos.find(n => n.id === a))
    .filter((n): n is No => !!n)
    .map(n => ({ noId: n.id, no: n.data.label, icone: definicoes[n.type]?.icone ?? 'i-lucide-box', variaveis: variaveisDoNo(n, i) }))
    .filter(g => g.variaveis.length)
}

/** Índice chave → rótulo de todas as variáveis do fluxo, para mostrar o nome legível. */
let cache: { nos: No[], mapa: Map<string, VariavelDeEntrada & { no: string }> } | null = null
export function indiceDeVariaveis(nos: No[]) {
  if (cache?.nos === nos) return cache.mapa
  const mapa = new Map<string, VariavelDeEntrada & { no: string }>()
  for (const n of nos) {
    for (const v of variaveisDoNo(n, 'pt-BR')) mapa.set(v.chave.slice(2, -2), { ...v, no: n.data.label })
  }
  cache = { nos, mapa }
  return mapa
}

export function credencialPorId(id?: number) {
  return credenciais.find(c => c.id === id)
}
