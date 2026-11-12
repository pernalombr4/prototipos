/**
 * O dado do protótipo de dashboards. Tudo fictício, tudo em memória.
 *
 * Estrutura tirada do develop e da doc (en-docs, Estrutura > Categorias > Campos):
 * categoria (`ItemType`), campo (`Field`, com `type` e `options` do schema) e item
 * (`Item`, com `reference`, `created_at`, `user` e `data`). Os valores são
 * inventados: empresa, cliente e pessoa de mentira.
 *
 * Os itens são gerados por um sorteio com semente fixa: o mesmo número em toda
 * abertura, sem chamada de rede. Volume de propósito alto (1.220 itens) para o
 * gráfico ter cara de workspace de verdade, com casos de canto: opção sem item,
 * campo vazio, item com 3 opções marcadas, cliente com nome longo.
 *
 * Os valores de opção e os nomes de categoria e campo ficam em português nos 3
 * idiomas: são dado criado pela pessoa, não texto da interface.
 */
import type { Field, Item, ItemType } from '@be-enlighten/enspace-sdk-schemas'

/** Data de referência do protótipo: o "hoje" de todo cálculo de período. */
export const AGORA = new Date(2026, 10, 12, 12, 0, 0)

export type TipoDeCampo = Field['type']

/** Um campo como a categoria declara. `refId`, `name`, `type` e `options` são do schema. */
export interface CampoDoMock extends Pick<Field, 'refId' | 'name' | 'type'> {
  options?: { label: string, value: string }[]
  /**
   * Inventado pelo protótipo para ligar a relação: no produto o destino da relação
   * vem de `nestedConfig.endpoint`.
   */
  relacao?: string
  /** Inventado: a expressão do campo virtual, só para a legenda do construtor. */
  expressao?: string
  /** Inventado: campo do sistema (Criado em, Atualizado em, Criado por), que toda categoria tem. */
  sistema?: boolean
}

export interface CategoriaDoMock extends Pick<ItemType, 'name' | 'slug' | 'icon'> {
  campos: CampoDoMock[]
  /** Campo que dá nome ao item (o "Display" da categoria). */
  display: string
}

/** Valor de um item, já resolvido: opção (value), opções (values), relação (id), número, data ISO. */
export type Valor = string | number | string[] | null

export interface ItemDoMock extends Pick<Item, 'id' | 'reference' | 'created_at'> {
  /** Slug da categoria. */
  categoria: string
  /** Quem criou (`Item.user` no schema, que aqui é o nome do membro). */
  user: string
  updated_at: Date
  data: Record<string, Valor>
}

/* ------------------------------------------------------------------ *
 * Sorteio com semente: mulberry32. Mesmo resultado em toda abertura.  *
 * ------------------------------------------------------------------ */
function sorteador(semente: number) {
  let a = semente
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const sorte = sorteador(20261112)
const entre = (min: number, max: number) => min + Math.floor(sorte() * (max - min + 1))
/** Escolhe com peso: [valor, peso][]. */
function comPeso<T>(opcoes: [T, number][]): T {
  const total = opcoes.reduce((s, [, p]) => s + p, 0)
  let r = sorte() * total
  for (const [v, p] of opcoes) {
    r -= p
    if (r <= 0) return v
  }
  return opcoes[opcoes.length - 1]![0]
}
const opcoes = (...rotulos: string[]) => rotulos.map(label => ({ label, value: label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_') }))
const valorDe = (rotulo: string) => opcoes(rotulo)[0]!.value

/* --------------------------------- membros -------------------------------- */

/** Pessoas fictícias do workspace. Sem e-mail: o repositório é público. */
export const MEMBROS = [
  'Ana Ribeiro', 'Bruno Tavares', 'Carla Menezes', 'Diego Fonseca',
  'Elisa Moura', 'Fábio Queiroz', 'Gabriela Antunes', 'Henrique Lobo',
]

/* -------------------------------- categorias ------------------------------ */

const SISTEMA: CampoDoMock[] = [
  { refId: 'created_at', name: 'Criado em', type: 'date', sistema: true },
  { refId: 'updated_at', name: 'Atualizado em', type: 'date', sistema: true },
  { refId: 'user', name: 'Criado por', type: 'EnlDropdown', sistema: true, options: MEMBROS.map(m => ({ label: m, value: m })) },
]

/** Unidade existe em 3 categorias com as mesmas opções: é o campo comum do filtro do dashboard. */
const UNIDADES = opcoes('São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Recife')

export const CATEGORIAS: CategoriaDoMock[] = [
  {
    name: 'Contratos',
    slug: 'contratos',
    icon: 'i-lucide-file-signature',
    display: 'titulo',
    campos: [
      { refId: 'titulo', name: 'Título', type: 'inputText' },
      { refId: 'status', name: 'Status', type: 'EnlDropdown', options: opcoes('Rascunho', 'Em negociação', 'Em assinatura', 'Assinado', 'Encerrado', 'Cancelado') },
      { refId: 'tipo', name: 'Tipo de contrato', type: 'EnlDropdown', options: opcoes('Prestação de serviço', 'Licença de software', 'Fornecimento', 'Parceria', 'Confidencialidade') },
      { refId: 'unidade', name: 'Unidade', type: 'EnlDropdown', options: UNIDADES },
      { refId: 'areas', name: 'Áreas envolvidas', type: 'multiSelect', options: opcoes('Jurídico', 'Financeiro', 'Compras', 'Tecnologia', 'Comercial') },
      { refId: 'renovacao', name: 'Renovação automática', type: 'inputSwitch' },
      { refId: 'cliente', name: 'Cliente', type: 'EnRel', relacao: 'clientes' },
      { refId: 'valor', name: 'Valor do contrato', type: 'EnCurrency' },
      { refId: 'vigencia', name: 'Vigência em meses', type: 'EnlNumber' },
      { refId: 'valor_mensal', name: 'Valor mensal', type: 'EnlExpressionEditor', expressao: 'Valor do contrato / Vigência em meses' },
      { refId: 'assinatura', name: 'Data de assinatura', type: 'date' },
      ...SISTEMA,
    ],
  },
  {
    name: 'Clientes',
    slug: 'clientes',
    icon: 'i-lucide-building-2',
    display: 'nome',
    campos: [
      { refId: 'nome', name: 'Nome', type: 'inputText' },
      { refId: 'segmento', name: 'Segmento', type: 'EnlDropdown', options: opcoes('Indústria', 'Varejo', 'Saúde', 'Educação', 'Serviços financeiros', 'Setor público') },
      { refId: 'porte', name: 'Porte', type: 'EnlDropdown', options: opcoes('Pequeno', 'Médio', 'Grande') },
      { refId: 'unidade', name: 'Unidade', type: 'EnlDropdown', options: UNIDADES },
      { refId: 'receita', name: 'Receita anual', type: 'EnCurrency' },
      { refId: 'ativo', name: 'Cliente ativo', type: 'inputSwitch' },
      ...SISTEMA,
    ],
  },
  {
    name: 'Chamados',
    slug: 'chamados',
    icon: 'i-lucide-headset',
    display: 'assunto',
    campos: [
      { refId: 'assunto', name: 'Assunto', type: 'inputText' },
      { refId: 'status', name: 'Status', type: 'EnlDropdown', options: opcoes('Aberto', 'Em atendimento', 'Aguardando cliente', 'Resolvido', 'Fechado') },
      { refId: 'prioridade', name: 'Prioridade', type: 'EnlDropdown', options: opcoes('Baixa', 'Média', 'Alta', 'Urgente') },
      { refId: 'canal', name: 'Canal', type: 'radioButton', options: opcoes('E-mail', 'Telefone', 'Portal', 'WhatsApp') },
      { refId: 'temas', name: 'Temas', type: 'multiSelect', options: opcoes('Acesso', 'Cobrança', 'Integração', 'Relatórios', 'Treinamento', 'Desempenho') },
      { refId: 'unidade', name: 'Unidade', type: 'EnlDropdown', options: UNIDADES },
      { refId: 'cliente', name: 'Cliente', type: 'EnRel', relacao: 'clientes' },
      { refId: 'horas', name: 'Tempo de resolução em horas', type: 'EnlNumber' },
      { refId: 'nota', name: 'Nota de satisfação', type: 'EnlNumber' },
      ...SISTEMA,
    ],
  },
  {
    name: 'Despesas',
    slug: 'despesas',
    icon: 'i-lucide-receipt',
    display: 'descricao',
    campos: [
      { refId: 'descricao', name: 'Descrição', type: 'inputText' },
      { refId: 'centro', name: 'Centro de custo', type: 'EnlDropdown', options: opcoes('Pessoal', 'Infraestrutura', 'Marketing', 'Viagens', 'Software', 'Jurídico externo') },
      { refId: 'situacao', name: 'Situação', type: 'EnlDropdown', options: opcoes('Lançada', 'Aprovada', 'Paga', 'Recusada') },
      { refId: 'contrato', name: 'Contrato', type: 'EnRel', relacao: 'contratos' },
      { refId: 'valor', name: 'Valor', type: 'EnCurrency' },
      { refId: 'pagamento', name: 'Data de pagamento', type: 'date' },
      ...SISTEMA,
    ],
  },
]

export const categoriaPorSlug = new Map(CATEGORIAS.map(c => [c.slug, c]))

/* ---------------------------------- itens --------------------------------- */

const DIA = 86_400_000
/** Uma data entre `diasAtras` e hoje, com mais peso nos meses recentes. */
function dataRecente(diasAtras: number) {
  const r = sorte() ** 1.4
  return new Date(AGORA.getTime() - Math.floor(r * diasAtras) * DIA - entre(0, 36_000_000))
}
const iso = (d: Date) => d.toISOString()

const NOMES_DE_CLIENTE = [
  'Metalúrgica Serra Azul', 'Rede Bom Preço', 'Clínica Vida Plena', 'Colégio Horizonte', 'Banco Pampa',
  'Prefeitura de Nova Esperança', 'Transportes Rota Sul', 'Farmácias Ponto Verde', 'Instituto de Ensino e Pesquisa Aplicada do Vale do Paraíba',
  'Agro Campo Largo', 'Cooperativa Uniterra', 'Hospital Santa Clara', 'Construtora Pilar', 'Editora Folha Nova',
  'Laticínios Mantiqueira', 'Seguradora Âncora', 'Têxtil Fio de Ouro', 'Hotel Mirante', 'Escola Pequeno Saber',
  'Distribuidora Litoral', 'Energia Ventos do Norte', 'Moinho Real', 'Café Altitude', 'Logística Expressa Já',
]

let id = 1
const itens: ItemDoMock[] = []

function novoItem(categoria: string, prefixo: string, criado: Date, data: Record<string, Valor>): ItemDoMock {
  const n = id++
  const atualizado = new Date(Math.min(AGORA.getTime(), criado.getTime() + entre(0, 40) * DIA))
  const item: ItemDoMock = {
    id: n,
    reference: `${prefixo}${String(n).padStart(5, '0')}`,
    created_at: criado,
    updated_at: atualizado,
    categoria,
    user: MEMBROS[entre(0, MEMBROS.length - 1)]!,
    data,
  }
  itens.push(item)
  return item
}

/* Clientes: 80 */
const clientes: ItemDoMock[] = []
for (let i = 0; i < 80; i++) {
  const base = NOMES_DE_CLIENTE[i % NOMES_DE_CLIENTE.length]!
  const nome = i < NOMES_DE_CLIENTE.length ? base : `${base} ${['Filial Norte', 'Filial Sul', 'Unidade II', 'Matriz'][i % 4]}`
  clientes.push(novoItem('clientes', 'CLI', dataRecente(900), {
    nome,
    segmento: valorDe(comPeso([['Indústria', 5], ['Varejo', 4], ['Saúde', 3], ['Educação', 2], ['Serviços financeiros', 2], ['Setor público', 1]])),
    porte: valorDe(comPeso([['Pequeno', 4], ['Médio', 4], ['Grande', 2]])),
    unidade: UNIDADES[entre(0, 4)]!.value,
    receita: entre(8, 900) * 100_000,
    ativo: sorte() > 0.15 ? 'true' : 'false',
  }))
}
/* Alguns clientes concentram contrato e chamado: deixa o ranking com cara de verdade. */
const clienteSorteado = () => clientes[Math.floor((sorte() ** 2.2) * clientes.length)]!

/* Contratos: 240 */
const OBJETOS = ['Suporte e manutenção', 'Licença anual', 'Implantação', 'Consultoria', 'Fornecimento de insumos', 'Acordo de confidencialidade', 'Parceria comercial', 'Treinamento']
const contratos: ItemDoMock[] = []
for (let i = 0; i < 240; i++) {
  const criado = dataRecente(560)
  const status = comPeso<string>([['Rascunho', 2], ['Em negociação', 4], ['Em assinatura', 2], ['Assinado', 8], ['Encerrado', 3], ['Cancelado', 1]])
  const tipo = comPeso<string>([['Prestação de serviço', 6], ['Licença de software', 4], ['Fornecimento', 3], ['Parceria', 2], ['Confidencialidade', 1]])
  const vigencia = comPeso<number>([[12, 6], [24, 3], [36, 2], [6, 1]])
  const valor = tipo === 'Confidencialidade' ? 0 : entre(12, 480) * 1_000
  const assinado = ['Assinado', 'Encerrado'].includes(status)
  const areas = opcoes('Jurídico', 'Financeiro', 'Compras', 'Tecnologia', 'Comercial')
    .filter((_, k) => k === 0 ? sorte() > 0.25 : sorte() > 0.7)
    .map(o => o.value)
  const cliente = clienteSorteado()
  contratos.push(novoItem('contratos', 'CTR', criado, {
    titulo: `${OBJETOS[entre(0, OBJETOS.length - 1)]} ${cliente.data.nome}`,
    status: valorDe(status),
    tipo: valorDe(tipo),
    unidade: sorte() > 0.04 ? UNIDADES[Math.floor((sorte() ** 1.3) * 5)]!.value : null,
    areas: areas.length ? areas : [],
    renovacao: sorte() > 0.6 ? 'true' : 'false',
    cliente: String(cliente.id),
    valor,
    vigencia,
    valor_mensal: vigencia ? Math.round(valor / vigencia) : null,
    assinatura: assinado ? iso(new Date(Math.min(AGORA.getTime(), criado.getTime() + entre(3, 45) * DIA))) : null,
  }))
}

/* Chamados: 600 */
const ASSUNTOS = ['Não consigo acessar', 'Boleto em duplicidade', 'Integração parou de enviar', 'Relatório com valor errado', 'Pedido de treinamento', 'Tela lenta ao abrir', 'Dúvida sobre fatura', 'Erro ao exportar']
for (let i = 0; i < 600; i++) {
  const criado = dataRecente(420)
  const status = comPeso<string>([['Aberto', 3], ['Em atendimento', 3], ['Aguardando cliente', 2], ['Resolvido', 8], ['Fechado', 5]])
  const temas = opcoes('Acesso', 'Cobrança', 'Integração', 'Relatórios', 'Treinamento', 'Desempenho')
    .filter(() => sorte() > 0.72)
    .map(o => o.value)
  const resolvido = ['Resolvido', 'Fechado'].includes(status)
  novoItem('chamados', 'CHA', criado, {
    assunto: ASSUNTOS[entre(0, ASSUNTOS.length - 1)]!,
    status: valorDe(status),
    prioridade: valorDe(comPeso([['Baixa', 4], ['Média', 5], ['Alta', 3], ['Urgente', 1]])),
    canal: valorDe(comPeso([['E-mail', 5], ['Telefone', 2], ['Portal', 4], ['WhatsApp', 3]])),
    temas: temas.length ? temas : [valorDe('Acesso')],
    unidade: UNIDADES[entre(0, 4)]!.value,
    cliente: String(clienteSorteado().id),
    horas: resolvido ? entre(1, 96) : null,
    nota: resolvido && sorte() > 0.35 ? entre(1, 5) : null,
  })
}

/* Despesas: 300 */
const DESCRICOES = ['Licença de ferramenta', 'Passagem aérea', 'Hospedagem', 'Campanha digital', 'Honorários', 'Servidor em nuvem', 'Folha complementar', 'Evento do setor']
for (let i = 0; i < 300; i++) {
  const criado = dataRecente(420)
  const situacao = comPeso<string>([['Lançada', 2], ['Aprovada', 3], ['Paga', 8], ['Recusada', 1]])
  novoItem('despesas', 'DES', criado, {
    descricao: DESCRICOES[entre(0, DESCRICOES.length - 1)]!,
    centro: valorDe(comPeso([['Pessoal', 3], ['Infraestrutura', 4], ['Marketing', 3], ['Viagens', 2], ['Software', 4], ['Jurídico externo', 1]])),
    situacao: valorDe(situacao),
    contrato: sorte() > 0.5 ? String(contratos[entre(0, contratos.length - 1)]!.id) : null,
    valor: entre(3, 600) * 100,
    pagamento: situacao === 'Paga' ? iso(new Date(Math.min(AGORA.getTime(), criado.getTime() + entre(1, 20) * DIA))) : null,
  })
}

export const ITENS: readonly ItemDoMock[] = itens
export const itemPorId = new Map(itens.map(i => [i.id, i]))
export const itensDa = (slug: string) => itens.filter(i => i.categoria === slug)
