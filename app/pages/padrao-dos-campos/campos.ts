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

/** As 31 chaves de tipo que existem hoje, entre schema, API e seletor. */
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
  | 'EnlTimeRange'
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

/** Onde o tipo está na vida do produto. */
export type Disponibilidade =
  /** Aparece no seletor "Tipo de Campo" hoje. */
  | 'ativo'
  /** Existe no schema e em dado gravado, mas não se cria mais pelo seletor. */
  | 'legado'

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
    refId: 'texto_curto',
    icone: 'i-lucide-type',
    alinhamento: 'inicio',
    largura: 200,
    backend: {
      entrada: '"Contrato de manutenção predial"',
      saida: '"Contrato de manutenção predial"',
      formatada: 'corta em cFormat.t_length e cola cFormat.t_suffix no fim',
      cFormat: ['type: "text"', 't_length', 't_suffix', 'preserve_max_length'],
      config: ['config.masks', 'config.speechRecognition', 'config.transformValue'],
    },
  },
  {
    tipo: 'EnTextArea',
    familia: 'texto',
    disponibilidade: 'ativo',
    refId: 'texto_longo',
    icone: 'i-lucide-align-left',
    alinhamento: 'inicio',
    largura: 280,
    larguraCheiaNoFormulario: true,
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
    refId: 'texto_rico',
    icone: 'i-lucide-pilcrow',
    alinhamento: 'inicio',
    largura: 280,
    larguraCheiaNoFormulario: true,
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
    refId: 'anotacoes',
    icone: 'i-lucide-sticky-note',
    alinhamento: 'inicio',
    largura: 240,
    larguraCheiaNoFormulario: true,
    foraDaColunaDeResumo: true,
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
    refId: 'mascara',
    icone: 'i-lucide-hash',
    alinhamento: 'inicio',
    largura: 180,
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
    refId: 'email',
    icone: 'i-lucide-at-sign',
    alinhamento: 'inicio',
    largura: 220,
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
    refId: 'codigo',
    icone: 'i-lucide-braces',
    alinhamento: 'inicio',
    largura: 180,
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
    refId: 'numero',
    icone: 'i-lucide-hash',
    alinhamento: 'fim',
    largura: 140,
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
    disponibilidade: 'legado',
    refId: 'moeda',
    icone: 'i-lucide-banknote',
    alinhamento: 'fim',
    largura: 160,
    backend: {
      entrada: '18400',
      saida: '18400',
      formatada: 'Intl.NumberFormat com style currency e o símbolo de n_currencyDisplay',
      cFormat: [
        'type: "currency"',
        'locale',
        'n_currencyDisplay: symbol | name | code',
        'n_minimumFractionDigits',
      ],
      config: [],
    },
  },

  /* ---------------------------- família escolha --------------------------- */
  {
    tipo: 'EnlDropdown',
    familia: 'escolha',
    disponibilidade: 'ativo',
    refId: 'selecao_unica',
    icone: 'i-lucide-chevron-down-circle',
    alinhamento: 'inicio',
    largura: 180,
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
    refId: 'selecao_radio',
    icone: 'i-lucide-circle-dot',
    alinhamento: 'inicio',
    largura: 160,
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
    refId: 'selecao_multipla',
    icone: 'i-lucide-list-checks',
    alinhamento: 'inicio',
    largura: 240,
    maximoNaCelula: 2,
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
    refId: 'caixas',
    icone: 'i-lucide-square-check',
    alinhamento: 'inicio',
    largura: 240,
    maximoNaCelula: 2,
    larguraCheiaNoFormulario: true,
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
    refId: 'caixas_legado',
    icone: 'i-lucide-square-check-big',
    alinhamento: 'inicio',
    largura: 200,
    maximoNaCelula: 2,
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
    refId: 'tags',
    icone: 'i-lucide-tags',
    alinhamento: 'inicio',
    largura: 240,
    maximoNaCelula: 3,
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
    refId: 'arvore',
    icone: 'i-lucide-list-tree',
    alinhamento: 'inicio',
    largura: 220,
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
    refId: 'binario',
    icone: 'i-lucide-toggle-right',
    alinhamento: 'inicio',
    largura: 140,
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
    refId: 'data',
    icone: 'i-lucide-calendar',
    alinhamento: 'inicio',
    largura: 170,
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
  {
    tipo: 'EnlTimeRange',
    familia: 'dataHora',
    disponibilidade: 'legado',
    refId: 'intervalo',
    icone: 'i-lucide-clock',
    alinhamento: 'inicio',
    largura: 190,
    backend: {
      entrada: '{ "start": "08:00", "end": "17:30" }',
      saida: '{ "start": "08:00", "end": "17:30" }',
      formatada: 'as duas pontas formatadas e unidas por cFormat.l_separator',
      cFormat: ['type: "object"', 'locale', 'l_separator'],
      config: [],
    },
  },

  /* ---------------------------- família relação --------------------------- */
  {
    tipo: 'EnRel',
    familia: 'relacao',
    disponibilidade: 'ativo',
    refId: 'relacao_simples',
    icone: 'i-lucide-link',
    alinhamento: 'inicio',
    largura: 240,
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
    refId: 'relacao_multipla',
    icone: 'i-lucide-link-2',
    alinhamento: 'inicio',
    largura: 280,
    maximoNaCelula: 2,
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
    familia: 'pessoa',
    disponibilidade: 'ativo',
    refId: 'pessoa',
    icone: 'i-lucide-user-round',
    alinhamento: 'inicio',
    largura: 240,
    larguraCheiaNoFormulario: true,
    backend: {
      entrada: '{ "name": "Marina Toledo", "cpf": "000.000.000-00" }',
      saida: '{ "name": "Marina Toledo", "email": "marina@…", "cpf": "…" }',
      formatada: 'nestedConfig.displayString escolhe quais subcampos aparecem',
      cFormat: ['type: "object"', 'display_string', 'value_path'],
      config: ['personConfig.availableFields[]', 'nestedConfig.displayString'],
    },
  },

  /* ---------------------------- família arquivo --------------------------- */
  {
    tipo: 'uploadFile',
    familia: 'arquivo',
    disponibilidade: 'ativo',
    refId: 'arquivo',
    icone: 'i-lucide-paperclip',
    alinhamento: 'inicio',
    largura: 240,
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
    refId: 'imagem',
    icone: 'i-lucide-image',
    alinhamento: 'inicio',
    largura: 200,
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
    refId: 'pdf',
    icone: 'i-lucide-file-text',
    alinhamento: 'inicio',
    largura: 240,
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
    refId: 'documento',
    icone: 'i-lucide-file-pen-line',
    alinhamento: 'inicio',
    largura: 240,
    foraDaColunaDeResumo: true,
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
    refId: 'assinatura',
    icone: 'i-lucide-signature',
    alinhamento: 'inicio',
    largura: 220,
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
    refId: 'endereco',
    icone: 'i-lucide-map-pin',
    alinhamento: 'inicio',
    largura: 300,
    larguraCheiaNoFormulario: true,
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
    refId: 'grupo',
    icone: 'i-lucide-group',
    alinhamento: 'inicio',
    largura: 260,
    larguraCheiaNoFormulario: true,
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
    refId: 'repetidor',
    icone: 'i-lucide-rows-3',
    alinhamento: 'inicio',
    largura: 260,
    maximoNaCelula: 1,
    larguraCheiaNoFormulario: true,
    foraDaColunaDeResumo: true,
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
    refId: 'chat',
    icone: 'i-lucide-message-square',
    alinhamento: 'inicio',
    largura: 220,
    larguraCheiaNoFormulario: true,
    foraDaColunaDeResumo: true,
    backend: {
      entrada: 'o campo não é preenchido pelo formulário. A conversa é gravada mensagem a mensagem',
      saida: '[{ "author": "Marina Toledo", "at": "…", "text": "…" }]',
      formatada: 'a última mensagem e o total, fora da conversa aberta',
      cFormat: ['type: "list"'],
      config: [],
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
