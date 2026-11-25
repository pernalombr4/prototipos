/**
 * MAQUETE do "Pedir ao BENI" (rodada 6): o que o BENI entende do texto e o
 * rascunho que ele devolve. No produto, quem entende é o agente de IA do
 * workspace (BENI AI, `EnAiChatsSharedFloat` do SDK, em develop); aqui são
 * regras de palavra-chave, só para a conversa do protótipo responder.
 *
 * O que ele tira do texto:
 * - o que criar: categoria nomeada (pelo nome, pelo singular ou por um
 *   sinônimo) vira item; "tarefa", "lembrar" ou nada reconhecido vira tarefa
 *   rápida; "categoria" com "criar" ou "montar" vira sugestão de categoria;
 *   pergunta vira ajuda;
 * - quando: hoje, amanhã, dia da semana, "semana que vem", dd/mm e a hora
 *   (15h, 15:30). Sem hora, 18:00, como o modal;
 * - para quem: o primeiro nome de uma pessoa do workspace;
 * - quanto: "R$ 84,90" ou "84,90 reais";
 * - urgência: "urgente", "prioridade alta".
 * O título é o que vem depois dos dois-pontos; sem eles, o texto sem os
 * pedaços que viraram campo.
 */
import type { Categoria, TarefaDaHome } from './mocks'
import { EU, pessoas } from './mocks'
import { HOJE } from './formatar'
import type { DadosDaTarefa } from './_ModalNovaTarefa.vue'
import type { DadosDoItem } from './_ModalNovoItem.vue'

const HORA = 3_600_000
const DIA = 24 * HORA

export type Rascunho =
  | { tipo: 'tarefa', dados: DadosDaTarefa }
  | { tipo: 'item', categoria: string, formulario?: string, dados: DadosDoItem }
  | { tipo: 'categoria', nome: string }
  | { tipo: 'ajuda', resumo: boolean }

/** Sem acento e em minúsculas, para comparar. */
const sem = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Sinônimos de cada categoria do mocks.ts, nos 3 idiomas. */
const SINONIMOS: Record<string, string[]> = {
  'solicitacoes-de-compra': ['solicitacao de compra', 'pedido de compra', 'compra', 'purchase request', 'purchase', 'solicitud de compra', 'compra'],
  'contratos': ['contrato', 'contract'],
  'chamados-de-ti': ['chamado', 'ticket', 'incidente', 'solicitud de ti'],
  'reembolsos': ['reembolso', 'reimbursement', 'expense', 'despesa'],
  'fornecedores': ['fornecedor', 'supplier', 'vendor', 'proveedor'],
  'folha-de-pagamento': ['folha de pagamento', 'payroll', 'nomina'],
}

/** O começo de um pedido: "crie um", "abrir uma", "novo", "add a". */
const PEDIDO = /^(por favor,?\s*)?(cri[ae]r?|crie|abr[ae]|abrir|registr[ae]r?|adicion[ae]r?|nov[oa]|create|add|open|new|crear?|anot[ae]r?|me lembre de|lembrar de|lembre-me de|remind me to|recuerdame)\s+/
const ARTIGO = /^(um|uma|an?|una?|o|a|the|el|la)\s+/

const PALAVRA_DE_TAREFA = /\b(tarefa|task|tarea|lembr\w*|remind\w*|recuerd\w*|lembrete|reminder)\b/
const PERGUNTA = /\?|^(como|o que|quais|qual|onde|por que|how|what|which|where|why|que|cual|cuales|donde)\b|resum|summar/

const DIAS_DA_SEMANA: [RegExp, number][] = [
  [/\b(domingo|sunday)\b/, 0],
  [/\b(segunda|monday|lunes)\b/, 1],
  [/\b(terca|tuesday|martes)\b/, 2],
  [/\b(quarta|wednesday|miercoles)\b/, 3],
  [/\b(quinta|thursday|jueves)\b/, 4],
  [/\b(sexta|friday|viernes)\b/, 5],
  [/\b(sabado|saturday)\b/, 6],
]

/** O dia, em dias a partir de hoje, ou undefined se o texto não diz. */
function lerDia(x: string): number | undefined {
  if (/\b(hoje|today|hoy)\b/.test(x)) return 0
  if (/\b(amanha|tomorrow|manana)\b/.test(x)) return 1
  if (/\b(semana que vem|proxima semana|next week|semana que viene|proxima semana)\b/.test(x)) return 7
  const hoje = new Date(HOJE - 3 * HORA).getUTCDay()
  for (const [re, dia] of DIAS_DA_SEMANA) {
    if (re.test(x)) return ((dia - hoje + 7) % 7) || 7
  }
  const m = x.match(/\b(\d{1,2})\/(\d{1,2})\b/)
  if (m) {
    const alvo = Date.UTC(2026, Number(m[2]) - 1, Number(m[1]), 3)
    const dias = Math.round((alvo - HOJE) / DIA)
    return dias >= 0 ? dias : dias + 365
  }
  return undefined
}

function lerHora(x: string): [number, number] | undefined {
  const m = x.match(/\b(\d{1,2})(?:h(\d{2})?|:(\d{2}))(?!\d)/)
  if (!m) return undefined
  const h = Number(m[1])
  if (h > 23) return undefined
  return [h, Number(m[2] ?? m[3] ?? 0)]
}

function lerValor(texto: string): number | undefined {
  const m = texto.match(/r\$\s*([\d.]+(?:,\d{1,2})?)/i) ?? texto.match(/([\d.]+(?:,\d{1,2})?)\s*reais/i)
  if (!m?.[1]) return undefined
  return Number(m[1].replace(/\./g, '').replace(',', '.'))
}

function lerPessoa(x: string) {
  if (/\b(para mim|pra mim|for me|para mi)\b/.test(x)) return EU
  return pessoas.find(p => p.id !== EU.id && new RegExp(`\\b${sem(p.nome.split(' ')[0] ?? '')}\\b`).test(x))
}

/**
 * A categoria que o texto nomeia, entre as que a pessoa acessa. Vale só no
 * começo do pedido ("novo reembolso", "abrir um chamado") ou com "em" antes
 * ("em Contratos"): "a pauta da reunião de compras" continua tarefa.
 */
function lerCategoria(x: string, categorias: Categoria[]) {
  const inicio = x.replace(PEDIDO, '').replace(ARTIGO, '')
  for (const c of categorias) {
    const termos = [sem(c.name), ...(c.singular ? [sem(c.singular)] : []), ...(SINONIMOS[c.slug] ?? [])].sort((a, b) => b.length - a.length)
    for (const termo of termos) {
      if (new RegExp(`^${termo}s?\\b`).test(inicio) || new RegExp(`\\b(em|na|no|in|en) ${termo}s?\\b`).test(x)) return { c, termo }
    }
  }
  return undefined
}

/** O que sobra do texto depois de tirar o pedido e os pedaços que viraram campo. */
function limparTitulo(texto: string, termoDaCategoria?: string) {
  const doisPontos = texto.indexOf(':')
  let s = doisPontos >= 0 && texto.slice(doisPontos + 1).trim() ? texto.slice(doisPontos + 1) : texto
  if (doisPontos < 0) {
    const cortes: RegExp[] = [PEDIDO, ARTIGO, /^(tarefa|task|tarea|lembrete|reminder)\s*(para|de|to|que|:)?\s*/]
    if (termoDaCategoria) cortes.push(new RegExp(`^${termoDaCategoria}s?\\s*(de|do|da|para|sobre|for|about|:)?\\s*`))
    for (const re of cortes) {
      const m = sem(s).match(re)
      if (m) s = s.slice(m[0].length)
    }
  }
  // Tira os pedaços que viraram campo. Feito no texto com acento: o índice do texto sem acento é o mesmo.
  const tirar = [
    /\b(hoje|today|hoy|amanha|tomorrow|manana|semana que vem|proxima semana|next week)\b/g,
    /\b(na |no |on |el )?(domingo|segunda|terca|quarta|quinta|sexta|sabado|sunday|monday|tuesday|wednesday|thursday|friday|saturday|lunes|martes|miercoles|jueves|viernes)(-feira)?\b/g,
    /\b(as |a las |at )?\d{1,2}(h\d{0,2}|:\d{2})\b/g,
    /\b(ate |until |hasta |dia |em |on )?\d{1,2}\/\d{1,2}\b/g,
    /r\$\s*[\d.]+(,\d{1,2})?|[\d.]+(,\d{1,2})?\s*reais/g,
    /\b(urgente|urgent|prioridade alta|alta prioridade|high priority)\b/g,
    /\b(para mim|pra mim|for me|para mi)\b/g,
    ...pessoas.map(p => new RegExp(`\\b(para o |para a |pro |pra |for |para |o |a )?${sem(p.nome.split(' ')[0] ?? '')}\\b`, 'g')),
  ]
  let n = sem(s)
  for (const re of tirar) {
    n = n.replace(re, m => ' '.repeat(m.length))
  }
  s = [...s].map((ch, i) => n[i] === ' ' && ch !== ' ' ? ' ' : ch).join('')
  s = s.replace(/\s+/g, ' ').replace(/^[\s,.;:-]+|[\s,.;:-]+$/g, '').replace(/^(de|do|da|para|to|el|la)\s+/i, '').trim()
  // "lembrar o Paulo de enviar": sem a pessoa, sobra "lembrar de enviar".
  s = s.replace(/^(lembrar|lembre|lembre-se|remind|recordar)\s+(de|to|que)\s+/i, '').trim()
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''
}

export function entender(texto: string, categorias: Categoria[]): Rascunho {
  const x = sem(texto.trim())
  if (/\bcategori/.test(x) && /\b(cri|mont|nov|new|crea|set ?up|add)/.test(x)) {
    const m = texto.match(/categori[ae]s?\s+(de |para |chamada |called |llamada )?(.+)$/i)
    const nome = (m?.[2] ?? '').replace(/[.!?]+$/, '').trim()
    return { tipo: 'categoria', nome: nome ? nome.charAt(0).toUpperCase() + nome.slice(1) : '' }
  }

  const cat = lerCategoria(x, categorias)
  const ehTarefa = PALAVRA_DE_TAREFA.test(x)
  if (!cat && !ehTarefa && PERGUNTA.test(x)) return { tipo: 'ajuda', resumo: /resum|summar|atras|overdue|pend/.test(x) }

  const dia = lerDia(x)
  const hora = lerHora(x)
  const quem = lerPessoa(x)
  const urgente = /\b(urgente|urgent)\b/.test(x)
  const alta = /\b(prioridade alta|alta prioridade|high priority|importante|important)\b/.test(x)

  if (cat && !ehTarefa) {
    return {
      tipo: 'item',
      categoria: cat.c.slug,
      formulario: cat.c.formularios[0]?.id,
      dados: {
        titulo: limparTitulo(texto, cat.termo) || texto.trim(),
        valor: lerValor(texto),
        prazo: dia === undefined ? undefined : HOJE + dia * DIA + 18 * HORA,
        urgente,
        responsavel: quem?.id ?? EU.id,
      },
    }
  }

  const [h, min] = hora ?? [18, 0]
  const due = dia === undefined && !hora ? null : new Date(HOJE + (dia ?? 0) * DIA + h * HORA + min * 60_000)
  const prioridade: TarefaDaHome['priority'] = urgente ? 'urgent' : alta ? 'high' : 'normal'
  return {
    tipo: 'tarefa',
    dados: {
      name: limparTitulo(texto) || texto.trim(),
      due_date: due,
      assigned_to: quem?.id ?? EU.id,
      priority: prioridade,
      origem: 'rapida',
    },
  }
}
