/**
 * Dado do protótipo: fictício, tipado, sem API.
 *
 * O item é o mesmo contrato do protótipo pastas-do-item (categoria Contratos
 * do workspace enspace-releases, estrutura de 08/10/2026). Os 2 campos HTML
 * (Parecer do jurídico e Observações internas) são inventados para esta
 * demanda: o primeiro vem preenchido e com erros de digitação de propósito,
 * para "Corrigir ortografia" ter o que corrigir; o segundo vem vazio, para
 * mostrar o placeholder e o "Rascunhar com os dados do item".
 */
import type { Item } from '@be-enlighten/enspace-sdk-schemas'

export const workspace = { name: 'Enspace Releases', reference: 'enspace-releases' }

export const categoria = { slug: 'contratos', name: 'Contratos' }

export const item: Item = {
  id: 48213,
  created_at: new Date('2026-09-30T09:28:30'),
  updated_at: new Date('2026-10-06T16:02:11'),
  deleted_at: null,
  reference: 'CON7A21F0C93B4E1D8A55B2C10E4F6A9',
  request_email: 'compras@tecnoverde.example',
  status: 'active',
  stage_status: null,
  data: {
    fornecedor: 'Tecnoverde Soluções Ambientais Ltda.',
    objeto: 'Coleta e destinação de resíduos das 3 unidades de Campinas',
    moeda: 'BRL',
    valor: 'R$ 43.358,10',
    indice: 'IPCA acumulado de 11,46%',
    valor_corrigido: 'R$ 48.327,14',
    vigencia: '31/12/2026',
    parecer: [
      '<p>O contrato com a Tecnoverde vence em 31/12/2026. O fornecedor mandou a proposta de renovaçao com reajuste pelo IPCA acumulado de 11,46%, oque leva o valor mensal de R$ 43.358,10 para R$ 48.327,14.</p>',
      '<p>a unidade 2 ainda nao devolveu o aditivo assinado e sem ele a renovaçao fica travada. O juridico pediu o documento em 03/10/2026 e ainda não teve retorno.</p>',
    ].join(''),
    observacoes: '',
  },
}

/** Os campos da Visão Geral, na ordem do formulário. Rótulos da categoria (dado do workspace, não se traduzem). */
export const campos = [
  { chave: 'fornecedor', rotulo: 'Fornecedor relacionado', tipo: 'relacao' },
  { chave: 'objeto', rotulo: 'Objeto do contrato', tipo: 'texto' },
  { chave: 'valor', rotulo: 'Valor do contrato', tipo: 'moeda' },
  { chave: 'valor_corrigido', rotulo: 'Valor corrigido', tipo: 'moeda' },
  { chave: 'vigencia', rotulo: 'Vigência até', tipo: 'texto' },
  { chave: 'parecer', rotulo: 'Parecer do jurídico', tipo: 'html' },
  { chave: 'observacoes', rotulo: 'Observações internas', tipo: 'html' },
] as const

/** Os campos que a BENI lê como contexto: todos menos os HTML. */
export const camposDeContexto = campos.filter(c => c.tipo !== 'html')

/** As folders do item, como a tela mostra hoje. Só a Visão Geral tem conteúdo nesta proposta. */
export const pastas = [
  { id: 'visao-geral', icone: 'i-lucide-layers' },
  { id: 'comentarios', icone: 'i-lucide-message-circle' },
  { id: 'logs', icone: 'i-lucide-shield-check' },
  { id: 'spaceflows', icone: 'i-lucide-workflow' },
  { id: 'anexos', icone: 'i-lucide-paperclip' },
  { id: 'notas', icone: 'i-lucide-notebook-text' },
] as const
