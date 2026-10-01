/**
 * O dado do protótipo: duas estruturas de workspace, a que já existe e a que
 * chega no arquivo. Tudo fictício.
 *
 * A FORMA vem do arquivo que o "Exportar Workspace" baixa (develop, 01/10/2026):
 * as chaves `c-item-types`, `c-fields`, `c-forms`, `c-folders`, `c-lists`,
 * `c-screens`, `module-groups`, `group-email-templates`, `c-type-reports`,
 * `c-document-templates` e `c-menu-items`. Os VALORES são inventados: o arquivo
 * de referência é de cliente e não entra neste repositório, que é público.
 *
 * O protótipo achata o arquivo: os campos, formulários e pastas ficam dentro da
 * categoria (no arquivo eles apontam para ela por `item_type`). É o desenho que
 * a pessoa vê; o dev compara pelo arquivo como ele é.
 */
import type { Field, ItemType, MemberGroup } from '@be-enlighten/enspace-sdk-schemas'

export type TipoDeCampo = Field['type']

/** Campo como entra na comparação. `refId`, `type` e `label` vêm do schema `Field`. */
export type CampoDaEstrutura = Pick<Field, 'refId' | 'type'> & {
  label: NonNullable<Field['label']>
  /** `Field.options[].label`, achatado. Só para campos de escolha. */
  options?: string[]
}

/** Categoria (`ItemType`) com o que pertence a ela no arquivo. */
export type CategoriaDaEstrutura = Pick<ItemType, 'slug' | 'name'> & {
  icon: string
  description?: string
  campos: CampoDaEstrutura[]
  /** `c-forms[].name`. */
  formularios: string[]
  /** `c-folders[].name`. */
  pastas: string[]
  /**
   * Quantos itens a categoria tem cadastrados. NÃO vem do arquivo de exportação
   * (ele só leva estrutura): vem da contagem de itens do workspace atual. É o que
   * a pessoa perde se a categoria sair.
   */
  itens?: number
}

/** Os componentes que o arquivo leva e não pertencem a uma categoria. */
export type TipoDeComponente = 'listas' | 'telas' | 'grupos' | 'emails' | 'relatorios' | 'documentos' | 'menus'

export interface ComponenteDaEstrutura {
  /** A chave de identidade: `slug`, `reference` ou o nome, conforme o tipo. */
  ref: string
  nome: string
  /** Opções de uma lista (`c-lists[].options`). */
  opcoes?: string[]
}

/** Grupo de permissão: `MemberGroup` do schema, só com o que a tela mostra. */
export type GrupoDaEstrutura = Pick<MemberGroup, 'name'> & ComponenteDaEstrutura

export interface Estrutura {
  workspace: string
  /** Só no arquivo: quando foi exportado. */
  exportadoEm?: string
  categorias: CategoriaDaEstrutura[]
  componentes: Record<TipoDeComponente, ComponenteDaEstrutura[]>
}

/* ------------------------------------------------------------------ *
 * O workspace em que a pessoa está.
 * ------------------------------------------------------------------ */

export const workspaceAtual = {
  nome: 'Jurídico Exemplo',
  slug: 'juridico-exemplo',
  /** O e-mail que a confirmação de "Substituir tudo" pede, como a exclusão de categoria pede hoje. */
  emailDeQuemUsa: 'ana.souza@exemplo.com.br',
}

export const estruturaAtual: Estrutura = {
  workspace: 'Jurídico Exemplo',
  categorias: [
    {
      slug: 'processos_judiciais',
      name: 'Processos judiciais',
      icon: 'i-lucide-gavel',
      itens: 312,
      campos: [
        { refId: 'numero_do_processo', label: 'Número do processo', type: 'inputText' },
        { refId: 'vara', label: 'Vara', type: 'inputText' },
        { refId: 'comarca', label: 'Comarca', type: 'EnlDropdown', options: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'] },
        { refId: 'valor_da_causa', label: 'Valor da causa', type: 'EnCurrency' },
        { refId: 'data_de_distribuicao', label: 'Data de distribuição', type: 'EnlCalendar' },
        { refId: 'advogado_responsavel', label: 'Advogado responsável', type: 'EnPerson' },
        { refId: 'fase_processual', label: 'Fase processual', type: 'EnlDropdown', options: ['Conhecimento', 'Recurso', 'Execução'] },
        { refId: 'observacoes', label: 'Observações', type: 'EnTextArea' },
        { refId: 'parte_contraria', label: 'Parte contrária', type: 'EnRel' },
      ],
      formularios: ['Cadastro de processo', 'Avaliar necessidade de audiência'],
      pastas: ['Dados do processo', 'Anexos'],
    },
    {
      slug: 'partes',
      name: 'Partes',
      icon: 'i-lucide-user',
      itens: 845,
      campos: [
        { refId: 'nome', label: 'Nome', type: 'inputText' },
        { refId: 'documento', label: 'CPF ou CNPJ', type: 'EnlMask' },
        { refId: 'email', label: 'E-mail', type: 'email' },
        { refId: 'telefone', label: 'Telefone', type: 'EnlMask' },
      ],
      formularios: ['Cadastro de parte'],
      pastas: [],
    },
    {
      slug: 'audiencias',
      name: 'Audiências',
      icon: 'i-lucide-calendar-clock',
      itens: 127,
      campos: [
        { refId: 'data_da_audiencia', label: 'Data da audiência', type: 'EnlCalendar' },
        { refId: 'tipo_de_audiencia', label: 'Tipo de audiência', type: 'EnlDropdown', options: ['Conciliação', 'Instrução'] },
        { refId: 'processo', label: 'Processo', type: 'EnRel' },
        { refId: 'local', label: 'Local', type: 'inputText' },
      ],
      formularios: ['Cadastro de audiência'],
      pastas: ['Dados da audiência'],
    },
    {
      slug: 'pagamentos',
      name: 'Pagamentos',
      icon: 'i-lucide-banknote',
      itens: 96,
      campos: [
        { refId: 'valor', label: 'Valor', type: 'EnCurrency' },
        { refId: 'vencimento', label: 'Vencimento', type: 'EnlCalendar' },
        { refId: 'comprovante', label: 'Comprovante', type: 'uploadFile' },
      ],
      formularios: ['Tipo de pagamento'],
      pastas: [],
    },
    {
      slug: 'contratos_de_honorarios',
      name: 'Contratos de honorários advocatícios com escritórios parceiros',
      icon: 'i-lucide-file-signature',
      itens: 48,
      campos: [
        { refId: 'contratante', label: 'Contratante', type: 'inputText' },
        { refId: 'vigencia', label: 'Vigência', type: 'EnlCalendar' },
        { refId: 'valor_mensal', label: 'Valor mensal', type: 'EnCurrency' },
        { refId: 'contrato_assinado', label: 'Contrato assinado', type: 'uploadFile' },
      ],
      formularios: ['Cadastro de contrato'],
      pastas: [],
    },
  ],
  componentes: {
    listas: [
      { ref: 'uf', nome: 'UF', opcoes: ['SP', 'RJ', 'MG', 'PR', 'RS'] },
      { ref: 'fase_processual', nome: 'Fase processual', opcoes: ['Conhecimento', 'Recurso', 'Execução'] },
      { ref: 'tipo_de_contrato', nome: 'Tipo de contrato', opcoes: ['Mensal', 'Por êxito'] },
    ],
    telas: [
      { ref: 'cadastro_de_contrato', nome: 'Cadastro de contrato' },
    ],
    grupos: [
      { ref: 'juridico_interno', nome: 'Jurídico interno' },
    ],
    emails: [
      { ref: 'boas_vindas', nome: 'Boas-vindas ao cliente' },
    ],
    relatorios: [
      { ref: 'relatorio_geral', nome: 'Relatório geral' },
    ],
    documentos: [],
    menus: [],
  },
}

/* ------------------------------------------------------------------ *
 * O arquivo que a pessoa arrasta: a estrutura de outro workspace.
 * ------------------------------------------------------------------ */

export const arquivoDeExemplo = {
  nome: 'estructural_export_matriz-contencioso_2026-10-01T12_48_37.json',
  tamanho: '431 KB',
}

export const estruturaDoArquivo: Estrutura = {
  workspace: 'Matriz Contencioso',
  exportadoEm: '2026-10-01T12:48:37',
  categorias: [
    {
      slug: 'processos_judiciais',
      name: 'Processos judiciais',
      icon: 'i-lucide-gavel',
      campos: [
        { refId: 'numero_do_processo', label: 'Número do processo', type: 'inputText' },
        // renomeado no arquivo
        { refId: 'vara', label: 'Vara ou tribunal', type: 'inputText' },
        // 2 opções a mais
        { refId: 'comarca', label: 'Comarca', type: 'EnlDropdown', options: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'] },
        { refId: 'valor_da_causa', label: 'Valor da causa', type: 'EnCurrency' },
        { refId: 'data_de_distribuicao', label: 'Data de distribuição', type: 'EnlCalendar' },
        { refId: 'advogado_responsavel', label: 'Advogado responsável', type: 'EnPerson' },
        { refId: 'fase_processual', label: 'Fase processual', type: 'EnlDropdown', options: ['Conhecimento', 'Recurso', 'Execução'] },
        // tipo trocado: texto longo para texto com formatação
        { refId: 'observacoes', label: 'Observações', type: 'EnHtml' },
        // novos
        { refId: 'instancia', label: 'Instância', type: 'EnlDropdown', options: ['1ª instância', '2ª instância', 'Tribunais superiores'] },
        { refId: 'pedidos', label: 'Pedidos', type: 'EnRelMulti' },
        { refId: 'probabilidade_de_perda', label: 'Probabilidade de perda', type: 'radioButton', options: ['Remota', 'Possível', 'Provável'] },
        // "Parte contrária" não está no arquivo
      ],
      formularios: ['Cadastro de processo', 'Avaliar necessidade de audiência', 'Subsídios trabalhistas'],
      pastas: ['Dados do processo', 'Anexos', 'Fluxos'],
    },
    {
      slug: 'partes',
      name: 'Partes',
      icon: 'i-lucide-user',
      campos: [
        { refId: 'nome', label: 'Nome', type: 'inputText' },
        { refId: 'documento', label: 'CPF ou CNPJ', type: 'EnlMask' },
        { refId: 'email', label: 'E-mail', type: 'email' },
        { refId: 'telefone', label: 'Telefone', type: 'EnlMask' },
      ],
      formularios: ['Cadastro de parte'],
      pastas: [],
    },
    {
      slug: 'audiencias',
      name: 'Audiências',
      icon: 'i-lucide-calendar-clock',
      campos: [
        { refId: 'data_da_audiencia', label: 'Data da audiência', type: 'EnlCalendar' },
        { refId: 'tipo_de_audiencia', label: 'Tipo de audiência', type: 'EnlDropdown', options: ['Conciliação', 'Instrução', 'Una'] },
        { refId: 'processo', label: 'Processo', type: 'EnRel' },
        { refId: 'local', label: 'Local', type: 'inputText' },
      ],
      formularios: ['Cadastro de audiência', 'Juntada de documentos de representação'],
      pastas: ['Dados da audiência'],
    },
    {
      slug: 'pagamentos',
      name: 'Pagamentos',
      icon: 'i-lucide-banknote',
      campos: [
        { refId: 'valor', label: 'Valor', type: 'EnCurrency' },
        { refId: 'vencimento', label: 'Vencimento', type: 'EnlCalendar' },
        { refId: 'comprovante', label: 'Comprovante', type: 'uploadFile' },
      ],
      formularios: ['Tipo de pagamento'],
      pastas: [],
    },
    {
      slug: 'garantias',
      name: 'Garantias',
      icon: 'i-lucide-shield-check',
      campos: [
        { refId: 'tipo_de_garantia', label: 'Tipo de garantia', type: 'EnlDropdown', options: ['Depósito judicial', 'Seguro garantia', 'Fiança bancária'] },
        { refId: 'valor_garantido', label: 'Valor garantido', type: 'EnCurrency' },
        { refId: 'validade', label: 'Validade', type: 'EnlCalendar' },
      ],
      formularios: ['Tipo de garantia'],
      pastas: [],
    },
    {
      slug: 'acordos',
      name: 'Acordos',
      icon: 'i-lucide-handshake',
      campos: [
        { refId: 'valor_do_acordo', label: 'Valor do acordo', type: 'EnCurrency' },
        { refId: 'parcelas', label: 'Parcelas', type: 'EnlNumber' },
        { refId: 'data_do_acordo', label: 'Data do acordo', type: 'EnlCalendar' },
      ],
      formularios: ['Cadastro de acordo'],
      pastas: [],
    },
    {
      slug: 'publicacoes',
      name: 'Publicações',
      icon: 'i-lucide-newspaper',
      campos: [
        { refId: 'data_da_publicacao', label: 'Data da publicação', type: 'EnlCalendar' },
        { refId: 'texto_da_publicacao', label: 'Texto da publicação', type: 'EnHtml' },
        { refId: 'processo_relacionado', label: 'Processo relacionado', type: 'EnRel' },
        { refId: 'providencia', label: 'Providência', type: 'EnlDropdown', options: ['Ciência', 'Recurso', 'Cumprimento'] },
      ],
      formularios: ['Triagem de publicações', 'Providência', 'Aprovação de providência'],
      pastas: ['Tarefas'],
    },
    {
      slug: 'multas',
      name: 'Multas',
      icon: 'i-lucide-car',
      campos: [
        { refId: 'placa', label: 'Placa', type: 'EnlMask' },
        { refId: 'tipo_de_multa', label: 'Tipo de multa', type: 'EnlDropdown', options: ['Velocidade', 'Estacionamento', 'Documentação'] },
        { refId: 'valor_da_multa', label: 'Valor da multa', type: 'EnCurrency' },
        { refId: 'prazo_de_recurso', label: 'Prazo de recurso', type: 'EnlCalendar' },
        { refId: 'auto_de_infracao', label: 'Auto de infração', type: 'uploadFile' },
      ],
      formularios: ['Multa'],
      pastas: [],
    },
  ],
  componentes: {
    listas: [
      { ref: 'uf', nome: 'UF', opcoes: ['SP', 'RJ', 'MG', 'PR', 'RS'] },
      { ref: 'fase_processual', nome: 'Fase processual', opcoes: ['Conhecimento', 'Recurso', 'Execução', 'Cumprimento de sentença'] },
      { ref: 'instancia', nome: 'Instância', opcoes: ['1ª instância', '2ª instância', 'Tribunais superiores'] },
      { ref: 'tipo_de_multa', nome: 'Tipo de multa', opcoes: ['Velocidade', 'Estacionamento', 'Documentação'] },
    ],
    telas: [
      { ref: 'triagem_de_publicacao', nome: 'Triagem de publicação' },
      { ref: 'cadastro_distribuicao', nome: 'Cadastro de distribuição' },
    ],
    grupos: [
      { ref: 'juridico_interno', nome: 'Jurídico interno' },
      { ref: 'automacao', nome: 'Automação' },
    ],
    emails: [
      { ref: 'bloqueio', nome: 'Aviso de bloqueio de pagamento' },
      { ref: 'central_de_documentos', nome: 'Central de documentos' },
    ],
    relatorios: [
      { ref: 'relatorio_geral', nome: 'Relatório geral' },
      { ref: 'processos_trabalhistas', nome: 'Processos trabalhistas' },
      { ref: 'civel', nome: 'Cível' },
    ],
    documentos: [
      { ref: 'roteiro_de_cobranca', nome: 'Roteiro de cobrança' },
    ],
    menus: [
      { ref: 'capturas', nome: 'Capturas' },
    ],
  },
}

/** Um workspace sem nada: o caso em que não há o que comparar. */
export const estruturaVazia: Estrutura = {
  workspace: 'Jurídico Exemplo',
  categorias: [],
  componentes: { listas: [], telas: [], grupos: [], emails: [], relatorios: [], documentos: [], menus: [] },
}
