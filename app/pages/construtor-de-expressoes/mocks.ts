/**
 * O dado do protótipo: uma categoria "Orçamentos" com os tipos de campo que
 * uma expressão usa (número, texto, lista de seleção, sim/não, data e lista).
 *
 * Estrutura tirada do develop (workspace de exploração, 15/10/2026): o tipo de
 * cada campo é o `Field['type']` do SDK, e a referência segue o `snake_case`
 * que o develop gera a partir do nome. Valores inventados. Nenhum dado de cliente.
 */
import type { Field } from '@be-enlighten/enspace-sdk-schemas'
import type { CampoDaCategoria, Modo } from './arvore'

export const workspace = { name: 'Comercial Sul', reference: 'comercial-sul' }
export const categoria = { name: 'Orçamentos', reference: 'orcamentos' }
export const EU = { nome: 'Marina Duarte', iniciais: 'MD' }

/** Hoje, para o protótipo: fixo, para os exemplos de prazo não mudarem com o dia. */
export const HOJE = '2026-10-15'

export interface CampoMock extends Pick<Field, 'refId' | 'name' | 'type'> {
  tipo: CampoDaCategoria['tipo']
  /** Nome do tipo como a tela do develop mostra. */
  tipoNaTela: string
  opcoes?: string[]
  colunas?: CampoMock[]
  /**
   * O Valor Virtual não aparece no enum `Field['type']` do SDK 0.17. No develop o
   * tipo é `EnlExpressionEditor` (lido no bundle). Por isso o campo é opcional aqui.
   */
  virtual?: boolean
}

export const CAMPOS: CampoMock[] = [
  { refId: 'cliente', name: 'Cliente', type: 'inputText', tipo: 'texto', tipoNaTela: 'Texto Curto' },
  { refId: 'status', name: 'Status', type: 'EnlDropdown', tipo: 'texto', tipoNaTela: 'Lista de Seleção', opcoes: ['Rascunho', 'Em análise', 'Aprovado', 'Recusado', 'Entregue'] },
  { refId: 'quantidade', name: 'Quantidade', type: 'EnlNumber', tipo: 'numero', tipoNaTela: 'Número' },
  { refId: 'preco_unitario', name: 'Preço unitário', type: 'EnlNumber', tipo: 'numero', tipoNaTela: 'Número' },
  { refId: 'desconto', name: 'Desconto (%)', type: 'EnlNumber', tipo: 'numero', tipoNaTela: 'Número' },
  { refId: 'urgente', name: 'Urgente', type: 'inputSwitch', tipo: 'logico', tipoNaTela: 'Alternativo Binário' },
  { refId: 'data_do_pedido', name: 'Data do pedido', type: 'EnlCalendar', tipo: 'data', tipoNaTela: 'Data (Calendário)' },
  { refId: 'prazo_de_entrega', name: 'Prazo de entrega', type: 'EnlCalendar', tipo: 'data', tipoNaTela: 'Data (Calendário)' },
  {
    refId: 'parcelas',
    name: 'Parcelas',
    type: 'EnRepeater',
    tipo: 'lista',
    tipoNaTela: 'Repetidor',
    colunas: [
      { refId: 'vencimento', name: 'Vencimento', type: 'EnlCalendar', tipo: 'data', tipoNaTela: 'Data (Calendário)' },
      { refId: 'valor', name: 'Valor', type: 'EnlNumber', tipo: 'numero', tipoNaTela: 'Número' },
      { refId: 'situacao', name: 'Situação', type: 'EnlDropdown', tipo: 'texto', tipoNaTela: 'Lista de Seleção', opcoes: ['Aberta', 'Paga'] },
    ],
  },
]

/** O campo que está sendo editado na gaveta. */
export const CAMPO_VIRTUAL = { refId: 'total_do_orcamento', name: 'Total do orçamento', tipoNaTela: 'Campo virtual (de valor dinâmico)' }

/** Os campos no formato que a árvore usa. */
export const camposDaArvore: CampoDaCategoria[] = CAMPOS.map(c => ({
  ref: c.refId,
  nome: c.name,
  tipo: c.tipo,
  opcoes: c.opcoes,
  colunas: c.colunas?.map(k => ({ ref: k.refId, nome: k.name, tipo: k.tipo, opcoes: k.opcoes })),
}))

export type Valores = Record<string, any>

/** Os 3 cenários do formulário de teste. */
export const CENARIOS: Record<'preenchido' | 'vazio' | 'dificil', Valores> = {
  preenchido: {
    cliente: 'Construtora Horizonte Azul',
    status: 'Em análise',
    quantidade: 12,
    preco_unitario: 1850.4,
    desconto: 7.5,
    urgente: true,
    data_do_pedido: '2026-10-01',
    prazo_de_entrega: '2026-11-14',
    parcelas: [
      { vencimento: '2026-11-01', valor: 7400, situacao: 'Paga' },
      { vencimento: '2026-12-01', valor: 7400, situacao: 'Aberta' },
      { vencimento: '2027-01-01', valor: 5739.04, situacao: 'Aberta' },
    ],
  },
  vazio: {
    cliente: '',
    status: '',
    quantidade: null,
    preco_unitario: null,
    desconto: null,
    urgente: false,
    data_do_pedido: '',
    prazo_de_entrega: '',
    parcelas: [],
  },
  dificil: {
    cliente: 'Padaria D\'Ávila & Filhos "Unidade 2"',
    status: 'Aprovado',
    quantidade: -2,
    preco_unitario: 0.1,
    desconto: 0,
    urgente: false,
    data_do_pedido: '',
    prazo_de_entrega: '2026-10-15',
    parcelas: [
      { vencimento: '2026-10-20', valor: 0.1, situacao: 'Paga' },
      { vencimento: '', valor: null, situacao: '' },
    ],
  },
}

/** Itens da lista da categoria (tela "Itens"), para ver o campo calculado em volume. */
export const ITENS: { reference: string, data: Valores }[] = [
  { reference: 'ORC-0412', data: { ...CENARIOS.preenchido } },
  { reference: 'ORC-0413', data: { cliente: 'Clínica Vida Plena', status: 'Aprovado', quantidade: 3, preco_unitario: 12990, desconto: 10, urgente: false, data_do_pedido: '2026-09-18', prazo_de_entrega: '2026-10-10', parcelas: [{ vencimento: '2026-10-18', valor: 35073, situacao: 'Paga' }] } },
  { reference: 'ORC-0414', data: { cliente: 'Escola Municipal Rio Claro', status: 'Rascunho', quantidade: 40, preco_unitario: 89.9, desconto: null, urgente: false, data_do_pedido: '2026-10-12', prazo_de_entrega: '', parcelas: [] } },
  { reference: 'ORC-0415', data: { cliente: 'Transportes Ligeiro Ltda.', status: 'Recusado', quantidade: 1, preco_unitario: 48000, desconto: 0, urgente: true, data_do_pedido: '2026-08-30', prazo_de_entrega: '2026-09-30', parcelas: [] } },
  { reference: 'ORC-0416', data: { ...CENARIOS.dificil } },
  { reference: 'ORC-0417', data: { cliente: 'Hotel Fazenda Serra Verde (filial Gramado)', status: 'Entregue', quantidade: 150, preco_unitario: 23.45, desconto: 2.5, urgente: false, data_do_pedido: '2026-07-01', prazo_de_entrega: '2026-08-15', parcelas: [{ vencimento: '2026-08-01', valor: 1714.78, situacao: 'Paga' }, { vencimento: '2026-09-01', valor: 1714.78, situacao: 'Paga' }] } },
  { reference: 'ORC-0418', data: { ...CENARIOS.vazio } },
  { reference: 'ORC-0419', data: { cliente: 'Cooperativa Agro Bom Sucesso', status: 'Em análise', quantidade: 8, preco_unitario: 4375, desconto: 5, urgente: true, data_do_pedido: '2026-10-14', prazo_de_entrega: '2026-10-21', parcelas: [{ vencimento: '2026-11-14', valor: 16625, situacao: 'Aberta' }, { vencimento: '2026-12-14', valor: 16625, situacao: 'Aberta' }] } },
]

/** Exemplos que o andaime carrega. Texto exato que o campo grava. */
export const EXEMPLOS: { chave: string, modo: Modo, expressao: string }[] = [
  { chave: 'total', modo: 'hoje', expressao: 'format(math({{data.quantidade | (0)}} * {{data.preco_unitario | (0)}} * (1 - {{data.desconto | (0)}} / 100)), {"type":"number","n_style":"currency","n_currency":"BRL","n_minimumFractionDigits":2,"n_maximumFractionDigits":2})' },
  { chave: 'situacao', modo: 'hoje', expressao: 'math(equalText("{{data.status}}", "Aprovado") ? "Liberar produção" : {{data.urgente | (false)}} ? "Cobrar aprovação hoje" : "Aguardar cliente")' },
  { chave: 'prazo', modo: 'hoje', expressao: 'Faltam dayjs({{data.prazo_de_entrega}}).diff({{$enspace.date.currentDay}}, day) dias' },
  { chave: 'parcelas', modo: 'hoje', expressao: 'format(sumArray(data.parcelas, valor), {"type":"number","n_style":"currency","n_currency":"BRL"})' },
  { chave: 'listaDeParcelas', modo: 'hoje', expressao: '{{~v2}}{{#each data.parcelas}}{{vencimento}}: R$ {{valor}}{{#unless @last}} | {{/unless}}{{/each}}{{#if false}}{{data.parcelas}}{{/if}}' },
  { chave: 'antigo', modo: 'hoje', expressao: 'format(math(subtract({{data.preco_unitario}},{{data.quantidade}},10)), {"locale":"pt-BR","n_style":"decimal","n_maximumFractionDigits":2,"n_minimumFractionDigits":0,"type":"EnlNumber"})' },
  { chave: 'aMao', modo: 'hoje', expressao: 'Pedido de {{data.cliente | (cliente sem nome)}}: math(round({{data.quantidade | (0)}} * {{data.preco_unitario | (0)}}, 2)) e math(log10(1000))' },
  { chave: 'funda', modo: 'hoje', expressao: 'math(round(max(({{data.quantidade | (0)}} + 1) * 2, 3), 2))' },
  { chave: 'passos', modo: 'proposta', expressao: '{{~v3}}subtotal = seVazio(data.quantidade, 0) * seVazio(data.preco_unitario, 0)\ndesconto = subtotal * seVazio(data.desconto, 0) / 100\nsubtotal - desconto' },
  { chave: 'atrasado', modo: 'proposta', expressao: '{{~v3}}antesDe(data.prazo_de_entrega, hoje()) and not igual(data.status, "Entregue") ? "Atrasado" : "No prazo"' },
  { chave: 'pagas', modo: 'proposta', expressao: '{{~v3}}somarColuna(data.parcelas, "valor", "situacao", "Paga")' },
  { chave: 'resumo', modo: 'proposta', expressao: '{{~v3}}juntar(maiusculas(seVazio(data.cliente, "sem cliente")), " · pedido de ", formatarData(data.data_do_pedido, "DD/MM/YYYY"))' },
  { chave: 'faixas', modo: 'proposta', expressao: '{{~v3}}round(seVazio(data.quantidade, 0) * seVazio(data.preco_unitario, 0), 2) > 20000 ? "Faixa A" : round(seVazio(data.quantidade, 0) * seVazio(data.preco_unitario, 0), 2) > 5000 ? "Faixa B" : "Faixa C"' },
]
