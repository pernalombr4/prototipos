/**
 * O catálogo dos tipos de campo do ENSPACE.
 *
 * Esta é a parte TÉCNICA do catálogo: a chave do tipo na API, o ícone, o
 * alinhamento, a largura da coluna e o contrato de back-end (entrada, saída e
 * saída formatada). A parte que a pessoa lê na tela (rótulo, descrição e as
 * três regras de renderização) mora no `textos.ts`, nos três idiomas.
 *
 * De onde veio cada coisa, em 22/09/2026:
 *
 * - a lista de tipos e as chaves saem do `enspace-sdk-schemas` (o enum
 *   `Field.type`) cruzada com o que a API de develop devolve de verdade em
 *   `GET /ws/types/:slug/fields`. As duas listas NÃO batem, e a divergência
 *   está registrada no BRIEFING.md;
 * - o rótulo em português é o do próprio produto, lido do dicionário de i18n
 *   do develop (chave `label` de cada tipo);
 * - o formato de saída foi observado em itens reais de develop, olhando só a
 *   FORMA do valor (nunca o conteúdo), em `GET /ws/types/:slug/items`;
 * - a saída formatada é o que o `cFormat` do campo faz com o valor cru.
 *
 * Nada aqui chama a API: é catálogo escrito à mão, para o protótipo rodar
 * sozinho no navegador.
 */

/**
 * As 32 chaves de tipo: 31 que existem hoje (entre schema, API e seletor) e 2
 * que o `Melhoria dos campos.docx` planeja e ainda não existem.
 */
export type TipoDeCampo =
  | 'inputText'
  | 'EnTextArea'
  | 'EnHtml'
  | 'EnNotes'
  | 'EnlMask'
  | 'email'
  | 'EnlNumber'
  | 'EnCurrency'
  | 'EnlDropdown'
  | 'radioButton'
  | 'multiSelect'
  | 'checkbox'
  | 'EnlCheckbox'
  | 'inputSwitch'
  | 'EnlChips'
  | 'EnlCalendar'
  | 'EnRel'
  | 'EnRelMulti'
  | 'EnTreeSelect'
  | 'EnPerson'
  | 'EnAddress'
  | 'uploadFile'
  | 'uploadImage'
  | 'EnPDF'
  | 'EnOnlyoffice'
  | 'EnESign'
  | 'EnRepeater'
  | 'group'
  | 'EnChats'
  | 'EnCustomCode'
  /* Os dois abaixo eu CRIEI em tela no develop em 23/09/2026, no workspace de
     exploração, para medir o formato. Existem no seletor "Tipo de Campo" e não
     existem na versão do `enspace-sdk-schemas` instalada aqui: são mais novos
     que o pacote. A chave do tipo na API, por isso, é a única coisa deste
     catálogo que está marcada como a confirmar. */
  | 'matrizDeDados'
  | 'idPersonalizado'
  /* Os dois abaixo vêm do `Melhoria dos campos.docx` e NÃO existem no schema
     nem na API. São tipos que o time de produtos está planejando, e estão aqui
     marcados como `proposto` para o padrão já nascer definido. */
  | 'duracao'
  | 'valorDinamico'

/**
 * A família diz que regra de renderização o tipo herda. É ela, e não o tipo,
 * que decide o alinhamento, o transbordo e o desenho da célula. Tipo novo que
 * nasça numa família existente já nasce padronizado.
 */
export type Familia =
  | 'texto'
  | 'numero'
  | 'escolha'
  | 'booleano'
  | 'dataHora'
  | 'relacao'
  | 'pessoa'
  | 'arquivo'
  | 'composto'

/**
 * Como o valor se salva. Ela pediu que isso ficasse claro em TODOS os campos,
 * e é o eixo que faltava: sem ele a pessoa digita e não sabe se gravou.
 */
export type ComoSalva =
  /** Escolher já salva. Não há o que confirmar. */
  | 'imediato'
  /** Enter salva, sair do campo salva, Esc desfaz. */
  | 'enterOuSair'
  /** Fechar o seletor salva. Esc desfaz. */
  | 'aoFechar'
  /** Precisa de um botão Confirmar, porque a edição tem mais de um passo. */
  | 'confirmar'
  /** O sistema preenche: não há salvamento pela pessoa. */
  | 'naoSeAplica'

/** Onde o tipo está na vida do produto. */
export type Disponibilidade =
  /** Aparece no seletor "Tipo de Campo" hoje. */
  | 'ativo'
  /** Existe no schema e em dado gravado, mas não se cria mais pelo seletor. */
  | 'legado'
  /**
   * Aparece no `Melhoria dos campos.docx` e não existe no schema nem na API.
   * É plano do time de produtos, não realidade do produto.
   */
  | 'proposto'

export interface ContratoDeBackend {
  /** O que o formulário manda no `data[refId]` do POST/PUT do item. */
  entrada: string
  /** O que a API devolve em `data[refId]` no GET do item. */
  saida: string
  /** O que o `cFormat` faz do valor cru antes de ele virar texto na tela. */
  formatada: string
  /** As chaves de `cFormat` que mudam alguma coisa neste tipo. */
  cFormat: string[]
  /** As chaves de `config` / `opt_config` que mudam a renderização. */
  config: string[]
}

export interface Campo {
  tipo: TipoDeCampo
  familia: Familia
  disponibilidade: Disponibilidade
  /** Como o valor se salva, e é o que a ficha e a dica de edição anunciam. */
  comoSalva: ComoSalva
  /** A chave do campo no `data` do item, no mock desta tela. */
  refId: string
  icone: string
  /** Alinhamento do conteúdo da célula na tabela. */
  alinhamento: 'inicio' | 'fim'
  /** Largura mínima da coluna, em px, para o valor típico caber. */
  largura: number
  /**
   * Quantos valores a célula mostra antes de virar contador. Só vale para as
   * famílias que guardam lista.
   */
  maximoNaCelula?: number
  /** O tipo abre a linha inteira no formulário, em vez de meia. */
  larguraCheiaNoFormulario?: boolean
  /** O tipo não cabe na coluna 1 da sidebar e por isso fica só na coluna 2. */
  foraDaColunaDeResumo?: boolean
  /**
   * O quadro de edição precisa de LARGURA, e não só da largura da coluna.
   *
   * Toda edição na célula acontece num quadro que salta para fora da tabela
   * (é o gesto do Notion, e ela pediu explicitamente). Este sinalizador diz
   * quais tipos precisam de um quadro largo em vez de um quadro do tamanho da
   * coluna: texto longo, bloco de subcampos, lista de caixas, anexo,
   * repetidor, conversa.
   */
  saltoLargo?: boolean
  /** O valor não se edita: o sistema é que preenche. */
  somenteLeitura?: boolean
  /**
   * Moeda padrão e lista de moedas permitidas, do campo de valor monetário.
   *
   * O ClickUp e o Notion põem a moeda na CONFIGURAÇÃO do campo, e nós no VALOR.
   * Ficamos com o nosso, que é o que serve contrato em moeda estrangeira, e
   * pagamos o custo aqui: quem só trabalha em real não enfrenta um seletor de
   * 179 moedas, porque o campo declara quais valem e qual é a padrão.
   */
  moedaPadrao?: string
  moedasPermitidas?: string[]
  /**
   * A localidade da formatação, quando o tipo tem. Ela é do CAMPO, não de quem
   * lê: no develop fica em "Interface e Formatação", numa aba que só existe ao
   * EDITAR o campo. Trocar o idioma da interface não muda este formato.
   */
  localeDoCampo?: string
  /**
   * O campo tem "Configurar Correção Monetária" ligado. Quando tem, o produto
   * acrescenta um botão de calculadora ao lado do valor.
   */
  correcaoMonetaria?: boolean
  /**
   * As configurações que o tipo oferece no painel de criação de Campo, em
   * "Configurações Específicas" (ou "Configuração de Opções"). Lidas uma a uma
   * no develop em 22/09/2026. Lista vazia quer dizer que o tipo não tem
   * configuração própria, só a base que todos têm.
   */
  configuracoes: string[]
  backend: ContratoDeBackend
}

/**
 * O catálogo, na ordem em que as colunas aparecem na tabela: primeiro o que a
 * pessoa lê mais, depois o que é anexo e por último o que é composto.
 */
export const campos: Campo[] = [
  /* ----------------------------- família texto ---------------------------- */
  {
    tipo: 'inputText',
    familia: 'texto',
    disponibilidade: 'ativo',
    comoSalva: 'enterOuSair',
    refId: 'texto_curto',
    icone: 'i-lucide-type',
    alinhamento: 'inicio',
    largura: 200,
    configuracoes: [
      'Transformadores de Texto',
      'Botão de Cópia',
      'Transcrição de Voz',
      'Máscaras',
    ],
    backend: {
      entrada: '"Contrato de manutenção predial"',
      saida: '"Contrato de manutenção predial"',
      formatada: 'corta em cFormat.t_length e cola cFormat.t_suffix no fim',
      cFormat: ['type: "text"', 't_length', 't_suffix', 'preserve_max_length'],
      config: [
        'config.masks  (e-mail e url são ESTE campo com máscara)',
        'config.mask_validation: cpf | cnpj',
        'config.speechRecognition',
        'config.transformValue',
      ],
    },
  },
  {
    tipo: 'EnTextArea',
    familia: 'texto',
    disponibilidade: 'ativo',
    comoSalva: 'confirmar',
    refId: 'texto_longo',
    icone: 'i-lucide-align-left',
    alinhamento: 'inicio',
    largura: 280,
    larguraCheiaNoFormulario: true,
    saltoLargo: true,
    configuracoes: [
      'Transformadores de Texto',
      'Botão de Cópia',
      'Transcrição de Voz',
    ],
    backend: {
      entrada: '"Trocar as luminárias do 3º andar…"',
      saida: '"Trocar as luminárias do 3º andar…"',
      formatada: 'corta em cFormat.t_length e cola cFormat.t_suffix no fim',
      cFormat: ['type: "text"', 't_length', 't_suffix'],
      config: ['config.text.rows', 'config.speechRecognition'],
    },
  },
  {
    tipo: 'EnHtml',
    familia: 'texto',
    disponibilidade: 'ativo',
    comoSalva: 'confirmar',
    refId: 'texto_rico',
    icone: 'i-lucide-pilcrow',
    alinhamento: 'inicio',
    largura: 280,
    larguraCheiaNoFormulario: true,
    saltoLargo: true,
    configuracoes: [],
    backend: {
      entrada: '"<p>Laudo com <strong>ressalva</strong>.</p>"',
      saida: '"<p>Laudo com <strong>ressalva</strong>.</p>"',
      formatada: 'as tags saem e sobra o texto puro, cortado em cFormat.t_length',
      cFormat: ['type: "text"', 't_length', 't_suffix'],
      config: ['config.html.extensions', 'config.html.textMode'],
    },
  },
  {
    tipo: 'EnNotes',
    familia: 'texto',
    disponibilidade: 'ativo',
    comoSalva: 'confirmar',
    refId: 'anotacoes',
    icone: 'i-lucide-sticky-note',
    alinhamento: 'inicio',
    largura: 240,
    larguraCheiaNoFormulario: true,
    foraDaColunaDeResumo: true,
    saltoLargo: true,
    configuracoes: [],
    backend: {
      entrada: '"Cliente pediu retorno na sexta."',
      saida: '"Cliente pediu retorno na sexta."',
      formatada: 'texto puro, cortado em cFormat.t_length',
      cFormat: ['type: "text"', 't_length', 't_suffix'],
      config: [],
    },
  },
  {
    tipo: 'EnlMask',
    familia: 'texto',
    disponibilidade: 'legado',
    comoSalva: 'enterOuSair',
    refId: 'mascara',
    icone: 'i-lucide-hash',
    alinhamento: 'inicio',
    largura: 180,
    configuracoes: [
      'não carrega no develop: erro ao carregar os campos aninhados',
    ],
    backend: {
      entrada: '"12.345.678/0001-90"',
      saida: '"12.345.678/0001-90"',
      formatada: 'a máscara de config.mask é reaplicada sobre o valor gravado',
      cFormat: ['type: "text"'],
      config: ['config.mask', 'config.masks', 'config.mask_validation: cpf | cnpj'],
    },
  },
  {
    tipo: 'email',
    familia: 'texto',
    disponibilidade: 'legado',
    comoSalva: 'enterOuSair',
    refId: 'email',
    icone: 'i-lucide-at-sign',
    alinhamento: 'inicio',
    largura: 220,
    configuracoes: [],
    backend: {
      entrada: '"compras@nortelux.com.br"',
      saida: '"compras@nortelux.com.br"',
      formatada: 'o texto não muda. O que muda é virar link mailto:',
      cFormat: ['type: "text"'],
      config: ['config.email_validation'],
    },
  },
  {
    tipo: 'EnCustomCode',
    familia: 'texto',
    disponibilidade: 'legado',
    comoSalva: 'naoSeAplica',
    refId: 'codigo',
    icone: 'i-lucide-braces',
    alinhamento: 'inicio',
    largura: 180,
    somenteLeitura: true,
    configuracoes: [
      'Componentes (obrigatório)',
    ],
    backend: {
      entrada: 'o campo não recebe digitação. O valor vem da expressão',
      saida: '"OS-2026-0481"',
      formatada: 'texto puro, sem transformação',
      cFormat: ['type: "text"'],
      config: ['config.expressionEditor'],
    },
  },

  /* ----------------------------- família número --------------------------- */
  {
    tipo: 'EnlNumber',
    familia: 'numero',
    disponibilidade: 'ativo',
    comoSalva: 'enterOuSair',
    refId: 'numero',
    icone: 'i-lucide-hash',
    alinhamento: 'fim',
    largura: 140,
    localeDoCampo: 'pt-BR',
    configuracoes: [
      'Mostrar Botões',
      'Valor Mínimo',
      'Valor Máximo',
    ],
    backend: {
      entrada: '1480.5',
      saida: '1480.5',
      formatada: 'Intl.NumberFormat(cFormat.locale, { style: cFormat.n_style })',
      cFormat: [
        'type: "number"',
        'locale',
        'n_style: decimal | percent | currency',
        'n_minimumFractionDigits',
        'n_minimumIntegerDigits',
        'n_multiplier',
      ],
      config: ['config.min', 'config.max', 'config.buttons'],
    },
  },
  {
    tipo: 'EnCurrency',
    familia: 'numero',
    /* "Valor Monetário" é tipo ATUAL no seletor do develop, não legado. */
    disponibilidade: 'ativo',
    comoSalva: 'confirmar',
    refId: 'moeda',
    icone: 'i-lucide-banknote',
    alinhamento: 'fim',
    largura: 200,
    /* A localidade sai do campo, e o mock a tem em pt-BR. */
    localeDoCampo: 'pt-BR',
    /* O campo declara a moeda padrão e as que valem. Ver o tipo `Campo`. */
    moedaPadrao: 'BRL',
    moedasPermitidas: ['BRL', 'USD', 'EUR', 'GBP'],
    /* Ligada de propósito neste mock, para a calculadora aparecer. */
    correcaoMonetaria: true,
    /*
     * Em camada flutuante, e não dentro da linha: com correção ligada são três
     * controles (moeda, valor e calculadora) e eles não cabem em 200 px. O
     * documento do time de produtos propõe editar os dois na célula, o que
     * funciona sem a calculadora e aperta com ela.
     */
    saltoLargo: true,
    configuracoes: [
      'Moeda padrão',
      'Moedas permitidas',
      'Configurar Correção Monetária',
      'Interface e Formatação: Localidade',
      'Interface e Formatação: Dígitos da Fração Mínima (0 a 20, padrão 0)',
      'Interface e Formatação: Dígitos Máximo da Fração (0 a 20, padrão 2)',
    ],
    backend: {
      entrada: '{ "currency": "USD", "value": 3750.25, "originalValue": 3750.25 }',
      saida: '{ "currency": "USD", "value": 3750.25, "originalValue": 3750.25 }',
      formatada: 'Intl.NumberFormat(cFormat.locale, { style: "currency", currency: value.currency }). A MOEDA vem do valor, a localidade vem do campo',
      cFormat: [
        'type: "currency"',
        'locale  (do campo, não de quem lê)',
        'n_minimumFractionDigits  (0 a 20, padrão 0)',
        'n_maximumFractionDigits  (0 a 20, padrão 2)',
      ],
      config: ['Configurar Correção Monetária (liga a calculadora no campo)'],
    },
  },

  /* ---------------------------- família escolha --------------------------- */
  {
    tipo: 'EnlDropdown',
    familia: 'escolha',
    disponibilidade: 'ativo',
    comoSalva: 'imediato',
    refId: 'selecao_unica',
    icone: 'i-lucide-chevron-down-circle',
    alinhamento: 'inicio',
    largura: 180,
    configuracoes: [
      'Caixa de Busca',
      'Editável',
      'Origem da Lista',
      'Lista Personalizada (obrigatória)',
      'Exportar e Importar opções',
    ],
    backend: {
      entrada: '"em_analise"',
      saida: '"em_analise"',
      formatada: 'o value vira o label da opção correspondente em options[]',
      cFormat: ['type: "list"'],
      config: [
        'options[]: { label, value, icon, description }',
        'opt_config.origin: default | fetch_lists | fetch_entity | members',
        'opt_config.c_list',
        'opt_config.search',
      ],
    },
  },
  {
    tipo: 'radioButton',
    familia: 'escolha',
    disponibilidade: 'ativo',
    comoSalva: 'imediato',
    refId: 'selecao_radio',
    icone: 'i-lucide-circle-dot',
    alinhamento: 'inicio',
    largura: 160,
    configuracoes: [
      'Origem da Lista',
      'Lista Personalizada (obrigatória)',
    ],
    backend: {
      entrada: '"sim"',
      saida: '"sim"',
      formatada: 'o value vira o label da opção correspondente em options[]',
      cFormat: ['type: "list"'],
      config: ['options[]', 'opt_config.origin'],
    },
  },
  {
    tipo: 'multiSelect',
    familia: 'escolha',
    disponibilidade: 'ativo',
    comoSalva: 'aoFechar',
    refId: 'selecao_multipla',
    icone: 'i-lucide-list-checks',
    alinhamento: 'inicio',
    largura: 240,
    maximoNaCelula: 2,
    configuracoes: [
      'Caixa de Busca',
      'Editável',
      'Origem da Lista',
      'Lista Personalizada (obrigatória)',
    ],
    backend: {
      entrada: '["eletrica", "hidraulica"]',
      saida: '["eletrica", "hidraulica"]',
      formatada: 'os labels das opções, unidos por cFormat.l_separator',
      cFormat: ['type: "list"', 'l_separator'],
      config: ['options[]', 'opt_config.origin', 'opt_config.c_list', 'opt_config.multilist'],
    },
  },
  {
    tipo: 'checkbox',
    familia: 'escolha',
    disponibilidade: 'ativo',
    comoSalva: 'imediato',
    refId: 'caixas',
    icone: 'i-lucide-square-check',
    alinhamento: 'inicio',
    largura: 240,
    maximoNaCelula: 2,
    larguraCheiaNoFormulario: true,
    saltoLargo: true,
    configuracoes: [
      'Origem da Lista',
      'Lista Personalizada (obrigatória)',
    ],
    backend: {
      entrada: '["Li e aceito o termo de responsabilidade"]',
      saida: '["Li e aceito o termo de responsabilidade"]',
      formatada: 'os labels marcados, unidos por cFormat.l_separator',
      cFormat: ['type: "list"', 'l_separator'],
      config: ['options[]', 'opt_config.origin'],
    },
  },
  {
    tipo: 'EnlCheckbox',
    familia: 'escolha',
    disponibilidade: 'legado',
    comoSalva: 'imediato',
    refId: 'caixas_legado',
    icone: 'i-lucide-square-check-big',
    alinhamento: 'inicio',
    largura: 200,
    maximoNaCelula: 2,
    saltoLargo: true,
    configuracoes: [
      'Origem da Lista',
      'Lista Personalizada (obrigatória)',
    ],
    backend: {
      entrada: '["a", "b"]',
      saida: '["a", "b"]',
      formatada: 'igual ao checkbox: labels unidos por cFormat.l_separator',
      cFormat: ['type: "list"', 'l_separator'],
      config: ['options[]'],
    },
  },
  {
    tipo: 'EnlChips',
    familia: 'escolha',
    disponibilidade: 'ativo',
    comoSalva: 'enterOuSair',
    refId: 'tags',
    icone: 'i-lucide-tags',
    alinhamento: 'inicio',
    largura: 240,
    maximoNaCelula: 3,
    configuracoes: [],
    backend: {
      entrada: '["urgente", "predial"]',
      saida: '["urgente", "predial"]',
      formatada: 'os próprios valores, unidos por cFormat.l_separator',
      cFormat: ['type: "list"', 'l_separator'],
      config: ['config.buttons'],
    },
  },
  {
    tipo: 'EnTreeSelect',
    familia: 'escolha',
    disponibilidade: 'legado',
    comoSalva: 'imediato',
    refId: 'arvore',
    icone: 'i-lucide-list-tree',
    alinhamento: 'inicio',
    largura: 220,
    configuracoes: [],
    backend: {
      entrada: '"predial.eletrica.quadros"',
      saida: '"predial.eletrica.quadros"',
      formatada: 'o caminho vira os labels da árvore, do pai até a folha',
      cFormat: ['type: "list"', 'l_separator'],
      config: ['options[].children[]', 'opt_config.key_nested'],
    },
  },

  /* --------------------------- família booleano --------------------------- */
  {
    tipo: 'inputSwitch',
    familia: 'booleano',
    disponibilidade: 'ativo',
    comoSalva: 'imediato',
    refId: 'binario',
    icone: 'i-lucide-toggle-right',
    alinhamento: 'inicio',
    largura: 140,
    configuracoes: [],
    backend: {
      entrada: 'true',
      saida: 'true',
      formatada: 'true e false viram Sim e Não no idioma de quem lê',
      cFormat: ['type: "boolean"'],
      config: [],
    },
  },

  /* --------------------------- família data/hora -------------------------- */
  {
    tipo: 'EnlCalendar',
    familia: 'dataHora',
    disponibilidade: 'ativo',
    comoSalva: 'imediato',
    refId: 'data',
    icone: 'i-lucide-calendar',
    alinhamento: 'inicio',
    largura: 170,
    localeDoCampo: 'pt-BR',
    configuracoes: [
      'Exibir Hora',
      'Preencher com a data atual',
    ],
    backend: {
      entrada: '"2026-09-14T21:32:11.000Z"',
      saida: '"2026-09-14T21:32:11.000Z"',
      formatada: 'Intl.DateTimeFormat(cFormat.locale, { dateStyle: cFormat.d_style })',
      cFormat: [
        'type: "date"',
        'locale',
        'd_style: short | medium | long | full',
        'dt_style',
        'dt_utc',
      ],
      config: ['config.min', 'config.max'],
    },
  },

  /* ---------------------------- família relação --------------------------- */
  {
    tipo: 'EnRel',
    familia: 'relacao',
    disponibilidade: 'ativo',
    comoSalva: 'imediato',
    refId: 'relacao_simples',
    icone: 'i-lucide-link',
    alinhamento: 'inicio',
    largura: 240,
    configuracoes: [
      'Categoria',
      'Formulários',
      'Filtros de Exibição',
      'Formato de Visualização',
      'Agrupar por',
      'Desanexar Agrupamento',
      'Desabilitar Criação',
      'Habilitar Dependência',
    ],
    backend: {
      entrada: '{ "id": 43887, "reference": "FORNC55D9212D9" }',
      saida: '{ "id": 43887, "display": "Nortelux Elétrica", "reference": "FORNC55D9212D9" }',
      formatada: 'display, montado pelo template de config.rel.displayString',
      cFormat: ['type: "object"', 'value_path', 'display_string'],
      config: [
        'config.rel.collection',
        'config.rel.displayString',
        'config.rel.type: one-way | one-to-one | one-to-many | many-way',
        'config.rel.disableCreation',
      ],
    },
  },
  {
    tipo: 'EnRelMulti',
    familia: 'relacao',
    disponibilidade: 'ativo',
    comoSalva: 'aoFechar',
    refId: 'relacao_multipla',
    icone: 'i-lucide-link-2',
    alinhamento: 'inicio',
    largura: 280,
    maximoNaCelula: 2,
    configuracoes: [
      'Habilitar Aba deste campo na tabela do item',
      'Categoria',
      'Formulários',
      'Filtros de Exibição',
      'Formato de Visualização',
      'Agrupar por',
      'Desanexar Agrupamento',
      'Desabilitar Criação',
      'Habilitar Dependência',
    ],
    backend: {
      entrada: '[{ "id": 43891, "reference": "OSC1F0A2B" }]',
      saida: '[{ "id": 43891, "display": "OS 2026-0481", "reference": "OSC1F0A2B" }]',
      formatada: 'um display por item, montado por config.rel.displayString',
      cFormat: ['type: "list"', 'value_path', 'l_separator'],
      config: ['config.rel.collection', 'config.rel.displayString', 'config.rel.groupBy'],
    },
  },

  /* ---------------------------- família pessoa ---------------------------- */
  {
    tipo: 'EnPerson',
    /*
     * MEDIDO NA TELA em 23/09/2026, e é bem diferente do que eu tinha
     * prototipado. Eu tinha feito um seletor de MEMBROS do workspace, e o
     * campo não é isso: é um bloco de cadastro de pessoa ou empresa, com
     * revelação progressiva por tipo.
     *
     * | Passo | O que aparece |
     * |---|---|
     * | 1 | **Tipo**, com "Por favor, selecione": Pessoa Física ou Pessoa Jurídica |
     * | 2a, Pessoa Física | **Nome** (opcional) e **CPF** (obrigatório), máscara `999.999.999-99`, contador `0/14` |
     * | 2b, Pessoa Jurídica | **CNPJ** (obrigatório), máscara `**.***.***​/****-##`, contador `0/18`, mais **Razão Social** e **Nome Fantasia**, os dois obrigatórios |
     *
     * E tem duas coisas que nenhum outro campo nosso faz:
     *
     * 1. **valida o documento**, não só mascara: CNPJ com dígito errado dá
     *    "CNPJ Inválido" embaixo do bloco;
     * 2. **consulta o cadastro e preenche sozinho**: com um CNPJ válido, Razão
     *    Social e Nome Fantasia vêm preenchidos da consulta. Testei com
     *    11.222.333/0001-81 e voltou a razão social de uma caixa escolar
     *    estadual.
     */
    familia: 'pessoa',
    disponibilidade: 'ativo',
    comoSalva: 'confirmar',
    refId: 'pessoa',
    icone: 'i-lucide-contact',
    alinhamento: 'inicio',
    largura: 260,
    larguraCheiaNoFormulario: true,
    saltoLargo: true,
    configuracoes: [
      'Ativar preenchimento de endereço',
      'Configurações de Pessoa: cnpj, name, cpf, razao_social, nome_fantasia',
    ],
    backend: {
      entrada: '{ "person_type": "PJ", "cnpj": "11222333000181", "razao_social": "…", "nome_fantasia": "…" }',
      saida: 'em PJ, { "person_type": "PJ", "cnpj": "…", "razao_social": "…", "nome_fantasia": "…" }; em PF, { "person_type": "PF", "name": "…", "cpf": "…" }',
      formatada: 'o nome de exibição (nome fantasia na PJ, nome na PF) e o documento mascarado ao lado',
      cFormat: ['type: "object"', 'display_string', 'value_path'],
      config: ['personConfig.availableFields[]', 'nestedConfig.displayString'],
      /*
       * AS CHAVES SAÍRAM DA TELA, não de palpite.
       *
       * O formulário do develop é FormKit, e o FormKit põe o `for` do rótulo
       * com a chave do campo. Lendo o DOM do bloco em 23/09/2026:
       * `<label for="person_type">Tipo</label>`. Daí sai `person_type`, que eu
       * tinha chamado de `type`.
       *
       * O resto vem da configuração do próprio campo, que lista os subcampos
       * disponíveis com o nome técnico: **`cnpj, name, cpf, razao_social,
       * nome_fantasia`**. Ou seja, o documento NÃO é uma chave só: são `cpf` e
       * `cnpj`, separadas, e é por isso que a máscara e o contador mudam junto
       * com o tipo em vez de se adaptarem ao tamanho.
       *
       * O que ainda não vi com os próprios olhos é o `for` dos rótulos de
       * Nome, CPF, CNPJ, Razão Social e Nome Fantasia, porque eles só existem
       * depois de escolher o tipo e a aba estava em segundo plano (a lista
       * virtualizada do develop não desenha em aba oculta). A lista de
       * subcampos da configuração é evidência do produto, não minha.
       */
    },
  },

  /* ---------------------------- família arquivo --------------------------- */
  {
    tipo: 'uploadFile',
    familia: 'arquivo',
    disponibilidade: 'ativo',
    comoSalva: 'imediato',
    refId: 'arquivo',
    icone: 'i-lucide-paperclip',
    alinhamento: 'inicio',
    largura: 240,
    saltoLargo: true,
    configuracoes: [
      'Tipos Permitidos',
      'Tamanho máximo do arquivo',
      'Quantidade máxima',
    ],
    backend: {
      entrada: 'multipart/form-data. O POST devolve a URL, e é ela que vai no data',
      saida: '{ "url": "…", "filename": "laudo.pdf", "mime": "application/pdf", "size": 45000 }',
      formatada: 'filename na frente, size passado por cFormat type byte',
      cFormat: ['type: "uploadFile"', 'type: "byte"', 'value_path'],
      config: ['config.max_size', 'config.buttons'],
    },
  },
  {
    tipo: 'uploadImage',
    familia: 'arquivo',
    disponibilidade: 'ativo',
    comoSalva: 'imediato',
    refId: 'imagem',
    icone: 'i-lucide-image',
    alinhamento: 'inicio',
    largura: 200,
    saltoLargo: true,
    configuracoes: [
      'Tamanho máximo do arquivo',
    ],
    backend: {
      entrada: 'multipart/form-data, igual ao arquivo',
      saida: '{ "url": "…", "filename": "quadro.jpg", "mime": "image/jpeg", "size": 220400 }',
      formatada: 'a própria imagem, servida pela url',
      cFormat: ['type: "uploadImage"', 'value_path'],
      config: ['config.max_size'],
    },
  },
  {
    tipo: 'EnPDF',
    familia: 'arquivo',
    disponibilidade: 'ativo',
    comoSalva: 'imediato',
    refId: 'pdf',
    icone: 'i-lucide-file-text',
    alinhamento: 'inicio',
    largura: 240,
    saltoLargo: true,
    configuracoes: [
      'Tamanho máximo do arquivo',
      'Quantidade máxima',
      'Inserir Chancela',
      'Posição da Chancela',
      'Tipo de Chancela',
      'Configurar Chancela',
      'Subir Imagem',
    ],
    backend: {
      entrada: 'multipart/form-data, igual ao arquivo',
      saida: '{ "url": "…", "filename": "contrato.pdf", "mime": "application/pdf", "size": 812300 }',
      formatada: 'filename e o selo, quando config.pdf.hasSeal está ligado',
      cFormat: ['type: "uploadFile"', 'type: "byte"'],
      config: ['config.pdf.hasSeal', 'config.pdf.sealType', 'config.pdf.sealPosition'],
    },
  },
  {
    tipo: 'EnOnlyoffice',
    familia: 'arquivo',
    disponibilidade: 'ativo',
    comoSalva: 'naoSeAplica',
    refId: 'documento',
    icone: 'i-lucide-file-pen-line',
    alinhamento: 'inicio',
    largura: 240,
    foraDaColunaDeResumo: true,
    saltoLargo: true,
    configuracoes: [
      'Permitir Upload de Documento Externo',
      'Permitir upload de PDF',
      'Chat',
      'Comentar',
      'Editar',
      'Acompanhar Mudanças',
      'Revisão',
    ],
    backend: {
      entrada: 'o editor grava sozinho. O formulário só escolhe o modelo',
      saida: '{ "url": "…", "filename": "proposta.docx", "mime": "…wordprocessingml…" }',
      formatada: 'filename, com o estado do editor ao lado',
      cFormat: ['type: "onlyoffice"'],
      config: ['ooEditorConfig.enableEdit', 'ooEditorConfig.trackChanges', 'ooEditorConfig.available_templates'],
    },
  },
  {
    tipo: 'EnESign',
    familia: 'arquivo',
    disponibilidade: 'legado',
    comoSalva: 'confirmar',
    refId: 'assinatura',
    icone: 'i-lucide-signature',
    alinhamento: 'inicio',
    largura: 220,
    saltoLargo: true,
    configuracoes: [],
    backend: {
      entrada: '{ "signer": "Marina Toledo", "signedAt": "2026-09-18T13:10:00.000Z" }',
      saida: '{ "signer": "…", "signedAt": "…", "url": "…" }',
      formatada: 'quem assinou e quando, com a data passada por cFormat type date',
      cFormat: ['type: "object"', 'display_string'],
      config: [],
    },
  },

  /* --------------------------- família composto --------------------------- */
  {
    tipo: 'EnAddress',
    familia: 'composto',
    disponibilidade: 'ativo',
    comoSalva: 'confirmar',
    refId: 'endereco',
    icone: 'i-lucide-map-pin',
    alinhamento: 'inicio',
    largura: 300,
    larguraCheiaNoFormulario: true,
    saltoLargo: true,
    configuracoes: [
      'País',
      'Aninhado',
    ],
    backend: {
      entrada: '{ "street": "Av. Paulista", "number": "1000", "city": "São Paulo", … }',
      saida: '{ "street", "number", "complement", "neighborhood", "city", "state", "zip", "country" }',
      formatada: 'uma linha só, montada por nestedConfig.displayString',
      cFormat: ['type: "object"', 'display_string'],
      config: ['config.country', 'nestedConfig.displayString'],
    },
  },
  {
    tipo: 'group',
    familia: 'composto',
    disponibilidade: 'ativo',
    comoSalva: 'confirmar',
    refId: 'grupo',
    icone: 'i-lucide-group',
    alinhamento: 'inicio',
    largura: 260,
    larguraCheiaNoFormulario: true,
    saltoLargo: true,
    configuracoes: [
      'Escopo das condicionais',
      'Aninhados',
      'Formato de Visualização',
    ],
    backend: {
      entrada: '{ "login": "nortelux", "telefone": "+55 11 5555-0100" }',
      saida: '{ "login": "nortelux", "telefone": "+55 11 5555-0100" }',
      formatada: 'nestedConfig.displayString escolhe qual subcampo representa o grupo',
      cFormat: ['type: "group"', 'display_string'],
      config: ['nested[]: os campos filhos, cada um com o próprio tipo', 'nestedConfig.displayString'],
    },
  },
  {
    tipo: 'EnRepeater',
    familia: 'composto',
    disponibilidade: 'ativo',
    comoSalva: 'confirmar',
    refId: 'repetidor',
    icone: 'i-lucide-rows-3',
    alinhamento: 'inicio',
    largura: 260,
    maximoNaCelula: 1,
    larguraCheiaNoFormulario: true,
    foraDaColunaDeResumo: true,
    saltoLargo: true,
    configuracoes: [
      'Habilitar Aba deste campo na tabela do item',
      'Quantidade predefinida de itens',
      'Valor Mínimo',
      'Valor Máximo',
      'Aninhados',
      'Formato de Visualização',
      'Modo de Visualização',
    ],
    backend: {
      entrada: '[{ "item": "Luminária LED", "quantidade": 12 }]',
      saida: '[{ "item": "Luminária LED", "quantidade": 12 }]',
      formatada: 'nestedConfig.displayString por linha, no modo table ou list',
      cFormat: ['type: "repeater"', 'display_string', 'l_separator'],
      config: ['nested[]', 'nestedConfig.viewMode: table | list', 'config.enable_tab'],
    },
  },
  {
    tipo: 'EnChats',
    familia: 'composto',
    disponibilidade: 'ativo',
    comoSalva: 'naoSeAplica',
    refId: 'chat',
    icone: 'i-lucide-message-square',
    alinhamento: 'inicio',
    largura: 220,
    larguraCheiaNoFormulario: true,
    foraDaColunaDeResumo: true,
    saltoLargo: true,
    /*
     * NÃO é somente leitura: o campo não se PREENCHE na criação do item, mas a
     * célula abre a conversa e recebe mensagem. Era um erro meu, que ela
     * apontou: "o campo chat ta sem interaçao na tabela".
     */
    configuracoes: [],
    backend: {
      entrada: 'o campo não é preenchido pelo formulário. A conversa é gravada mensagem a mensagem',
      saida: '[{ "author": "Marina Toledo", "at": "…", "text": "…" }]',
      formatada: 'a última mensagem e o total, fora da conversa aberta',
      cFormat: ['type: "list"'],
      config: [],
    },
  },

  /*
   * MATRIZ DE DADOS. Criada em tela no develop em 23/09/2026: nome "Matriz de
   * dados", Rótulo Complementar "Situacao por disciplina", duas linhas
   * (Eletrica, Hidraulica) e duas colunas (Conforme, Nao conforme). Depois
   * respondida num item e lida nos três formatos.
   */
  {
    tipo: 'matrizDeDados',
    /*
     * Família composto, e não escolha: o valor não é UMA escolha, é um saco de
     * escolhas chaveado por linha. Quem herda de `escolha` ganha a célula de
     * selo único, que aqui mentiria.
     */
    familia: 'composto',
    disponibilidade: 'ativo',
    /*
     * Confirmar, porque a edição tem mais de um passo: são N linhas por
     * responder, e fechar no meio gravaria matriz pela metade sem a pessoa
     * saber.
     */
    comoSalva: 'confirmar',
    refId: 'matriz',
    icone: 'i-lucide-grid-3x3',
    alinhamento: 'inicio',
    largura: 240,
    maximoNaCelula: 1,
    larguraCheiaNoFormulario: true,
    foraDaColunaDeResumo: true,
    saltoLargo: true,
    configuracoes: [
      'Rótulo Complementar (vira o título do bloco)',
      'Linhas (obrigatória): lista ordenada, cada item com rótulo, referência técnica e obrigatoriedade',
      'Colunas (obrigatória): lista ordenada, cada item com rótulo, obrigatoriedade e "valor único por coluna"',
      'Exportar e Importar, nas duas listas',
    ],
    backend: {
      /*
       * A FORMA do valor é PROPOSTA, e é a única coisa aqui que não medi: o
       * formulário do develop manda o item como multipart, e a célula da
       * tabela não imprime o valor cru (imprime um botão de olho). O que medi
       * foi o comportamento e a saída formatada.
       *
       * A proposta é linha -> coluna, porque é o que o controle garante (uma
       * resposta por linha) e o que a leitura mostra. Confirmar com o dev.
       */
      entrada: '{ "eletrica": "nao_conforme", "hidraulica": "conforme" }  (PROPOSTA: ver o comentário)',
      saida: '{ "eletrica": "nao_conforme", "hidraulica": "conforme" }  (PROPOSTA)',
      formatada: 'uma linha por pergunta respondida, `rótulo da linha: rótulo da coluna`, com o Rótulo Complementar de título. MEDIDO em tela',
      cFormat: ['a confirmar: o tipo não existe no schema instalado'],
      config: ['linhas[]', 'colunas[]', 'Rótulo Complementar'],
    },
  },
  /*
   * ID PERSONALIZADO. Criado em tela no develop em 23/09/2026 com dois
   * componentes, Conteúdo "OS-" e Contador de 4 dígitos começando em 1, e
   * depois lido num item novo: veio `OS-004`.
   */
  {
    tipo: 'idPersonalizado',
    familia: 'texto',
    disponibilidade: 'ativo',
    comoSalva: 'naoSeAplica',
    refId: 'id_personalizado',
    icone: 'i-lucide-hash',
    alinhamento: 'inicio',
    largura: 170,
    /*
     * O campo é só leitura de verdade, e não por decisão nossa: no formulário
     * do develop o `<input>` vem com `readonly` E `disabled`. Quem escreve o
     * valor é o back-end, ao salvar, compondo os componentes em ordem.
     */
    somenteLeitura: true,
    configuracoes: [
      'Componentes (obrigatória): lista ordenada, com Acima, Abaixo, Remover e Editar',
      'componente Conteúdo: Conteúdo Fixo (texto)',
      'componente Data: Formato de Data',
      'componente Campo: Campo de Referência, Transformações de Texto, Limite de Caracteres',
      'componente Contador: Dígitos do Contador, Início do Contador',
    ],
    backend: {
      entrada: 'o campo não recebe digitação. No formulário ele vem readonly e disabled',
      saida: '"VIT-2026-0001"  (a composição dos componentes, em ordem)',
      formatada: 'o próprio valor, que já nasce formatado pela composição',
      cFormat: ['a confirmar: o tipo não existe no schema instalado'],
      config: ['componentes[]: { tipo, conteudoFixo | formatoDeData | campoDeReferencia | digitos + inicio }'],
    },
  },

  /* --------------------- os dois propostos pelo doc --------------------- */
  {
    tipo: 'duracao',
    /*
     * Família texto, e não data: medido no develop em 22/09/2026, o controle é
     * um campo de texto com o placeholder
     * `Ex.: "1 dia", "2 semanas", "3 meses", "1 ano" ou "30 min"`.
     * NÃO é um par de datas, ao contrário do que o documento do time de
     * produtos descreve. Ver BRIEFING.md, 6.3.
     */
    familia: 'texto',
    disponibilidade: 'ativo',
    comoSalva: 'enterOuSair',
    refId: 'duracao',
    icone: 'i-lucide-hourglass',
    alinhamento: 'inicio',
    largura: 190,
    configuracoes: [],
    backend: {
      entrada: '"2 semanas"  (duração em linguagem natural)',
      saida: 'a confirmar: o produto aceita texto, e não observei item gravado com valor',
      formatada: 'a confirmar. O campo não tem cFormat próprio no painel',
      cFormat: ['a confirmar'],
      config: [],
    },
  },
  {
    tipo: 'valorDinamico',
    familia: 'texto',
    /* Confirmado no seletor do develop: "Campo virtual (de valor dinâmico)". */
    disponibilidade: 'ativo',
    comoSalva: 'naoSeAplica',
    refId: 'valor_dinamico',
    icone: 'i-lucide-function-square',
    alinhamento: 'inicio',
    largura: 200,
    somenteLeitura: true,
    configuracoes: [
      'Editor de Expressão',
      'Habilitar Editor Visual',
    ],
    backend: {
      entrada: 'o campo não recebe digitação. A expressão é configurada no campo',
      saida: 'o que a expressão devolver. O tipo do resultado varia por expressão',
      formatada: 'o cFormat do resultado, que precisa ser declarado no campo',
      cFormat: ['type: depende do resultado'],
      config: ['config.expressionEditor', 'useExpressionAsStartValue'],
    },
  },
]

/** Busca rápida por chave de tipo. */
export const campoPorTipo = Object.fromEntries(
  campos.map(c => [c.tipo, c]),
) as Record<TipoDeCampo, Campo>

/** A ordem das famílias na ficha e no agrupamento da sidebar. */
export const familias: Familia[] = [
  'texto',
  'numero',
  'escolha',
  'booleano',
  'dataHora',
  'relacao',
  'pessoa',
  'arquivo',
  'composto',
]

/**
 * Os três formatos que este protótipo padroniza. A célula, o formulário e o
 * cru são a mesma informação em três densidades, não três desenhos diferentes.
 */
export type Formato = 'celula' | 'formulario' | 'cru'
export const formatos: Formato[] = ['celula', 'formulario', 'cru']
