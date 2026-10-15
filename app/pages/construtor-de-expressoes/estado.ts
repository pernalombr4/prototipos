/**
 * Estado do protótipo, em memória (o reload volta ao começo).
 *
 * Guarda o motor escolhido no andaime, o rascunho da expressão na gaveta, a
 * expressão salva (que a lista de Orçamentos usa) e os valores do formulário de
 * teste. Trocar de motor converte a expressão: a árvore é a mesma, só o texto
 * gerado muda. Passos (só da proposta) voltam para dentro da conta no modo hoje.
 */
import { type Expressao, type Formato, type Modo, type No, clonar, gerar, ler } from './arvore'
import { CENARIOS, EXEMPLOS, type Valores, camposDaArvore } from './mocks'

export type Tela = 'campos' | 'itens'

/** Árvore de cada texto gerado pelo construtor nesta sessão (ver `_Construtor.vue`). */
export const memoriaDeArvores = new Map<string, Expressao>()

/** Troca cada uso de passo pelo bloco do passo (o motor de hoje não tem passos). */
function semPassos(e: Expressao): Expressao {
  const porNome = new Map(e.passos.map(p => [p.nome, p.no]))
  const abrir = (n: No): No => {
    if (n.k === 'campo' && n.passo && porNome.has(n.ref)) return abrir(clonar(porNome.get(n.ref)!))
    const c: any = clonar(n)
    for (const k of ['a', 'b', 'cond', 'entao', 'senao', 'base', 'qtd', 'outra']) if (c[k]) c[k] = abrir(c[k])
    if (c.k === 'funcao') c.args = c.args.map(abrir)
    return c
  }
  return { ...e, pecas: e.pecas.map(abrir), passos: [] }
}

export function converter(texto: string, de: Modo, para: Modo, formato: Formato | null): { texto: string, formato: Formato | null } {
  if (de === para) return { texto, formato }
  const lido = ler(texto, de).expressao
  if (para === 'proposta') {
    const f = lido.formato
    return { texto: gerar({ ...lido, formato: null }, 'proposta', camposDaArvore), formato: f }
  }
  return { texto: gerar({ ...semPassos(lido), formato }, 'hoje', camposDaArvore), formato: null }
}

export function useConstrutorDeExpressoes() {
  const tela = useState<Tela>('ce-tela', () => 'campos')
  const modo = useState<Modo>('ce-modo', () => 'hoje')
  const gaveta = useState<boolean>('ce-gaveta', () => true)
  const rascunho = useState<string>('ce-rascunho', () => EXEMPLOS[0]!.expressao)
  const formato = useState<Formato | null>('ce-formato', () => null)
  const salva = useState<string>('ce-salva', () => EXEMPLOS[0]!.expressao)
  const formatoSalvo = useState<Formato | null>('ce-formato-salvo', () => null)
  const valores = useState<Valores>('ce-valores', () => structuredClone(CENARIOS.preenchido))

  function trocarModo(novo: Modo) {
    if (novo === modo.value) return
    const r = converter(rascunho.value, modo.value, novo, formato.value)
    const s = converter(salva.value, modo.value, novo, formatoSalvo.value)
    modo.value = novo
    rascunho.value = r.texto
    formato.value = r.formato
    salva.value = s.texto
    formatoSalvo.value = s.formato
  }

  function carregarExemplo(chave: string) {
    const ex = EXEMPLOS.find(e => e.chave === chave)
    if (!ex) return
    if (ex.modo !== modo.value) trocarModo(ex.modo)
    rascunho.value = ex.expressao
    formato.value = chave === 'passos' ? { tipo: 'moeda', moeda: 'BRL', casas: 2 } : chave === 'pagas' ? { tipo: 'moeda', moeda: 'BRL', casas: 2 } : null
    tela.value = 'campos'
    gaveta.value = true
  }

  function salvar() {
    salva.value = rascunho.value
    formatoSalvo.value = formato.value
  }

  return { tela, modo, gaveta, rascunho, formato, salva, formatoSalvo, valores, trocarModo, carregarExemplo, salvar }
}

