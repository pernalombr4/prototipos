/**
 * Dado do protótipo: fictício, tipado, sem API.
 *
 * Estrutura tirada do develop (workspace teste-ux, categoria com 3 campos e 1
 * formulário "Geral" com 1 campo, 25/11/2026): a categoria tem mais campos do
 * que o único formulário vinculado, e há itens criados pelo formulário e itens
 * criados sem formulário (importação, API, antes de o formulário existir).
 * Valores inventados. Rótulo de campo e nome de formulário são dado do cliente:
 * não se traduzem.
 */
import type { Item } from '@be-enlighten/enspace-sdk-schemas'

export const workspace = { name: 'Operações', reference: 'operacoes' }

export const categoria = { slug: 'pedidos_de_compra', name: 'Pedidos de compra' }

/**
 * Campo da categoria. Forma reduzida do `Field` do SDK: `refId`, rótulo e o
 * tipo de entrada que a tela desenha. `virtual` é campo calculado, que a tela
 * mostra sem deixar editar.
 */
export interface Campo {
  refId: string
  rotulo: string
  tipo: 'texto' | 'numero' | 'moeda' | 'data' | 'selecao' | 'textoLongo'
  opcoes?: string[]
  virtual?: boolean
}

export const campos: Campo[] = [
  { refId: 'fornecedor', rotulo: 'Fornecedor', tipo: 'texto' },
  { refId: 'centro_de_custo', rotulo: 'Centro de custo', tipo: 'selecao', opcoes: ['Manutenção', 'Logística', 'Administrativo'] },
  { refId: 'quantidade', rotulo: 'Quantidade', tipo: 'numero' },
  { refId: 'preco_unitario', rotulo: 'Preço unitário', tipo: 'moeda' },
  { refId: 'total', rotulo: 'Total', tipo: 'moeda', virtual: true },
  { refId: 'data_de_entrega', rotulo: 'Data de entrega', tipo: 'data' },
  { refId: 'aprovador', rotulo: 'Aprovador', tipo: 'texto' },
  { refId: 'status_do_pedido', rotulo: 'Status do pedido', tipo: 'selecao', opcoes: ['Rascunho', 'Em aprovação', 'Aprovado', 'Recebido'] },
  { refId: 'justificativa', rotulo: 'Justificativa', tipo: 'textoLongo' },
  { refId: 'observacoes', rotulo: 'Observações', tipo: 'textoLongo' },
]

/**
 * Formulário da categoria. Forma reduzida: no SDK, o formulário traz `blocks`
 * com os campos; aqui fica só a lista de `refId`, na ordem dos blocos.
 * `tipo: 'all'` é o "Geral" da tela de formulários.
 */
export interface Formulario {
  id: number
  nome: string
  tipo: 'all' | 'update' | 'create'
  campos: string[]
}

/** O único formulário vinculado: 3 dos 10 campos. É o caso da demanda. */
export const formularios: Formulario[] = [
  { id: 701, nome: 'Pedido rápido', tipo: 'all', campos: ['fornecedor', 'quantidade', 'data_de_entrega'] },
]

/** `form` é o formulário pelo qual o item nasceu (no SDK, `form` é `unknown`; aqui, o id). */
export type ItemDoPrototipo = Item & { form: number | null }

function item(id: number, reference: string, form: number | null, criado: string, data: Record<string, string | number>): ItemDoPrototipo {
  return {
    id,
    reference,
    form,
    created_at: new Date(criado),
    updated_at: new Date(criado),
    deleted_at: null,
    request_email: 'compras@operacoes.example',
    status: 'active',
    stage_status: null,
    data,
  }
}

export const itens: ItemDoPrototipo[] = [
  item(56812, 'PDC7A21F0C93B4E1D8A55B2C10E4F6A9', null, '2026-11-10T09:12:40', {
    fornecedor: 'Aço Forte Distribuidora',
    centro_de_custo: 'Manutenção',
    quantidade: 40,
    preco_unitario: 'R$ 87,50',
    total: 'R$ 3.500,00',
    data_de_entrega: '2026-12-02',
    aprovador: 'Renata Albuquerque',
    status_do_pedido: 'Em aprovação',
    justificativa: 'Reposição do estoque de parafusos da linha 2, importada da planilha de compras.',
    observacoes: 'Entregar na doca 3.',
  }),
  item(56813, 'PDCB9E04D1A7C2F4E6B8D3A5C7E9F1B2', 701, '2026-11-18T14:06:45', {
    fornecedor: 'Papelaria Central',
    centro_de_custo: 'Administrativo',
    quantidade: 12,
    preco_unitario: 'R$ 32,90',
    total: 'R$ 394,80',
    data_de_entrega: '2026-11-28',
    aprovador: 'Diego Furtado',
    status_do_pedido: 'Aprovado',
    justificativa: 'Material de escritório do trimestre.',
    observacoes: '',
  }),
  item(56814, 'PDC3F6A8C0E2B4D6F8A1C3E5B7D9F0A4', null, '2026-11-20T10:31:02', {
    fornecedor: 'Transportes Rio Claro',
    centro_de_custo: 'Logística',
    quantidade: 3,
    preco_unitario: 'R$ 1.250,00',
    total: 'R$ 3.750,00',
    data_de_entrega: '2026-12-10',
    aprovador: 'Renata Albuquerque',
    status_do_pedido: 'Rascunho',
    justificativa: 'Fretes extras para a operação de fim de ano.',
    observacoes: 'Criado pela integração com o ERP.',
  }),
  item(56815, 'PDCD2B4F6A8C0E1D3F5A7B9C2E4F6A8B', 701, '2026-11-22T16:47:19', {
    fornecedor: 'Limpeza Total',
    centro_de_custo: 'Administrativo',
    quantidade: 25,
    preco_unitario: 'R$ 18,00',
    total: 'R$ 450,00',
    data_de_entrega: '2026-12-01',
    aprovador: 'Diego Furtado',
    status_do_pedido: 'Recebido',
    justificativa: 'Produtos de limpeza do mês.',
    observacoes: '',
  }),
  item(56816, 'PDC8E1A3C5F7B9D2E4A6C8F0B1D3E5A7', 701, '2026-11-24T08:55:33', {
    fornecedor: 'Elétrica Paulista',
    centro_de_custo: 'Manutenção',
    quantidade: 60,
    preco_unitario: 'R$ 9,75',
    total: 'R$ 585,00',
    data_de_entrega: '2026-12-05',
    aprovador: '',
    status_do_pedido: 'Em aprovação',
    justificativa: '',
    observacoes: '',
  }),
]

export const formularioPorId = (id: number | null) => formularios.find(f => f.id === id) ?? null
export const campoPorRef = (refId: string) => campos.find(c => c.refId === refId)!
