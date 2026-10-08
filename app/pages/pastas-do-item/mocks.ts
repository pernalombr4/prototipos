/**
 * Dado do protótipo: fictício, tipado, sem API.
 *
 * Estrutura copiada da branch de pastas reordenáveis (preview da Vercel, item
 * de Contratos do workspace enspace-releases, 08/10/2026): as 6 pastas que o
 * item mostra, na ordem, com os mesmos ícones e o mesmo menu (Editar, Ocultar,
 * Excluir). Valores inventados.
 */
import type { Item } from '@be-enlighten/enspace-sdk-schemas'

/**
 * Pasta do item. Inventado pelo protótipo: no `enspace-sdk-schemas` o campo
 * `folders` é `Array<Record<string, unknown>>`, sem forma. Os nomes abaixo
 * saem do que a tela mostra (rótulo, ícone, se é do sistema).
 */
export interface Pasta {
  id: string
  /** Rótulo da pasta do sistema vem do `textos.ts`; pasta criada pelo cliente tem nome próprio. */
  nome?: string
  icone: string
  /** Pasta do sistema não se exclui (o produto mostra Excluir para todas; ver BRIEFING). */
  sistema: boolean
  tipo: 'campos' | 'comentarios' | 'logs' | 'spaceflows' | 'anexos' | 'notas' | 'personalizada'
  /** Contador opcional (comentários, anexos). Inventado: o produto ainda não mostra. */
  contagem?: number
}

export const pastasIniciais: Pasta[] = [
  { id: 'visao-geral', icone: 'i-lucide-layers', sistema: true, tipo: 'campos' },
  { id: 'comentarios', icone: 'i-lucide-message-circle', sistema: true, tipo: 'comentarios', contagem: 3 },
  { id: 'logs', icone: 'i-lucide-shield-check', sistema: true, tipo: 'logs' },
  { id: 'spaceflows', icone: 'i-lucide-workflow', sistema: true, tipo: 'spaceflows' },
  { id: 'anexos', icone: 'i-lucide-paperclip', sistema: true, tipo: 'anexos', contagem: 2 },
  { id: 'notas', icone: 'i-lucide-notebook-text', sistema: true, tipo: 'notas' },
  { id: 'aditivos', nome: 'Aditivos e renovações', icone: 'i-lucide-folder', sistema: false, tipo: 'personalizada' },
  { id: 'fornecedor', nome: 'Documentos do fornecedor', icone: 'i-lucide-folder', sistema: false, tipo: 'personalizada' },
]

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
    valor_base: 'R$ 38.900,00',
    resumo: 'Coleta e destinação de resíduos das 3 unidades de Campinas',
    moeda: 'BRL',
    valor: 'R$ 43.358,10',
    resultado: 'IPCA acumulado de 11,46%',
    moeda_corrigida: 'BRL',
    valor_corrigido: 'R$ 48.327,14',
  },
}

/** Os campos da Visão Geral, na ordem do formulário (rótulos da categoria Contratos). */
export const campos = [
  { chave: 'fornecedor', rotulo: 'Fornecedor relacionado', tipo: 'relacao' },
  { chave: 'valor_base', rotulo: 'Valor base', tipo: 'texto' },
  { chave: 'resumo', rotulo: 'Resumo da busca', tipo: 'texto' },
  { chave: 'valor', rotulo: 'Valor do contrato', tipo: 'moeda', moeda: 'moeda' },
  { chave: 'resultado', rotulo: 'Resultado corrigido', tipo: 'texto' },
  { chave: 'valor_corrigido', rotulo: 'Valor corrigido', tipo: 'moeda', moeda: 'moeda_corrigida' },
] as const

export const comentarios = [
  { autor: 'Renata Albuquerque', iniciais: 'RA', quando: '06/10/2026, 16:02', texto: 'Fornecedor mandou a proposta de renovação. Valor corrigido bate com o IPCA do período.' },
  { autor: 'Diego Furtado', iniciais: 'DF', quando: '03/10/2026, 10:41', texto: 'Falta o aditivo assinado da unidade 2. Pedi ao jurídico.' },
  { autor: 'Renata Albuquerque', iniciais: 'RA', quando: '30/09/2026, 09:45', texto: 'Contrato importado da planilha de compras.' },
]

export const logs = [
  { quem: 'Renata Albuquerque', acao: 'Editou Valor corrigido', quando: '06/10/2026, 16:02' },
  { quem: 'Spaceflow Correção anual', acao: 'Calculou Resultado corrigido', quando: '06/10/2026, 16:01' },
  { quem: 'Diego Furtado', acao: 'Comentou', quando: '03/10/2026, 10:41' },
  { quem: 'Renata Albuquerque', acao: 'Criou o item', quando: '30/09/2026, 09:28' },
]

export const anexos = [
  { nome: 'contrato-assinado-tecnoverde.pdf', tamanho: '1,8 MB', quando: '30/09/2026' },
  { nome: 'proposta-renovacao-2027.pdf', tamanho: '640 KB', quando: '06/10/2026' },
]

/** A lista de itens atrás da barra lateral: só para dar contexto ao modo "barra lateral". */
export const linhas = [
  { ref: 'CON7A21F0C93B4E1D8A55B2C10E4F6A9', fornecedor: 'Tecnoverde Soluções Ambientais', valor: 'R$ 43.358,10' },
  { ref: 'CON1B88E2D0F64A4C1E92A0B7D3C5E81', fornecedor: 'Grupo Atalaia Segurança', valor: 'R$ 1.000,00' },
  { ref: 'CON4E09C7A2B13D4F6E8A1C2B9D0E7F3', fornecedor: 'Lumen Facilities', valor: 'R$ 30.000,00' },
  { ref: 'CON9D3F1A7C2E5B4A8D6C0E1F2B3A4C5', fornecedor: 'Ponto Norte Logística', valor: 'R$ 8.600,21' },
  { ref: 'CON2C6A8E0D4F1B3A5C7E9D1F3B5A7C9', fornecedor: 'Ateliê Brasa Comunicação', valor: 'R$ 12.480,00' },
  { ref: 'CON8F1E3D5C7B9A2E4C6A8D0F2B4E6A8', fornecedor: 'Rede Clara Telecom', valor: 'R$ 5.290,00' },
  { ref: 'CON6B4D2F0E8C6A4B2D0F8E6C4A2B0D8', fornecedor: 'Cia. Paulista de Limpeza', valor: 'R$ 19.750,00' },
]
