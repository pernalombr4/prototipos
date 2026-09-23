/**
 * A copy desta tela, nos três idiomas do ENSPACE.
 *
 * O rótulo e a descrição de cada tipo são os do próprio produto, lidos do
 * dicionário de i18n do develop em 22/09/2026. Onde o produto não tem rótulo
 * (os tipos legados, que saíram do seletor), o protótipo propõe um e a
 * divergência está no DECISOES.md.
 *
 * As três regras (célula, formulário e cru) são a PROPOSTA. É o padrão que
 * este protótipo está sugerindo para cada tipo, nos três lugares onde ele
 * aparece.
 *
 * Nenhum texto daqui leva travessão. Regra 33.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { TipoDeCampo } from './campos'

export interface RegraDeCampo {
  rotulo: string
  descricao: string
  celula: string
  formulario: string
  cru: string
}

export interface Textos {
  /* ------------------------------- a casca ------------------------------- */
  casca: {
    menuLateral: string
    buscar: string
    membro: string
    configuracoes: string
    ajuda: string
    recolherMenu: string
    abrirMenu: string
    voltar: string
    avancar: string
    recarregar: string
    trilha: string
    idioma: string
    tema: string
    suporte: string
    notificacoes: string
    conta: string
    lab: string
    itens: Record<string, string>
  }

  /* ------------------------------- a tela -------------------------------- */
  trilhaCategorias: string
  abaItens: string
  abaVisualizar: string
  pesquisar: string
  criadoEm: string
  todoPeriodo: string
  exportar: string
  colunas: string
  densidade: string
  maisOpcoes: string
  novoRegistro: string
  acoes: string
  referencia: string
  mostrando: (de: number, ate: number, total: number) => string
  porPagina: string
  verDetalhes: string
  editar: string
  enviarParaLixeira: string
  copiarLink: string
  vazio: string
  maisN: (n: number) => string
  verMais: string
  verMenos: string
  copiar: string
  copiado: string
  baixar: string
  abrir: string
  sim: string
  nao: string
  ativo: string
  inativo: string
  rascunho: string

  /* ------------------------------ o formulário --------------------------- */
  tituloNovoItem: string
  cancelar: string
  criar: string
  salvar: string
  salvando: string
  salvo: string
  obrigatorio: string
  formularioAjuda: string

  /* ------------------------------- a sidebar ----------------------------- */
  visaoGeral: string
  comentarios: string
  logsDeAuditoria: string
  identificacao: string
  origem: string
  historico: string
  osCampos: string
  id: string
  status: string
  emailDaSolicitacao: string
  criadoEmRotulo: string
  atualizadoEm: string
  itemDe: (i: number, total: number) => string
  anterior: string
  proximo: string
  recolherResumo: string
  abrirResumo: string
  fecharPainel: string

  /* -------------------------------- a ficha ------------------------------ */
  fichaTitulo: string
  fichaVazia: string
  fichaFechar: string
  formatoCelula: string
  formatoFormulario: string
  formatoCru: string
  ondeApareceCelula: string
  ondeApareceFormulario: string
  ondeApareceCru: string
  backend: string
  formatoDeEntrada: string
  formatoDeSaida: string
  saidaFormatada: string
  chavesDeFormato: string
  chavesDeConfig: string
  familia: string
  familias: Record<string, string>
  disponibilidade: string
  tipoAtivo: string
  tipoLegado: string
  tipoLegadoAviso: string
  tipoProposto: string
  tipoPropostoAviso: string
  alinhamento: string
  alinhamentoInicio: string
  alinhamentoFim: string
  larguraMinima: string
  nenhumaChave: string
  configuracoesDoTipo: string
  configuracoesOnde: string
  semConfiguracaoPropria: string

  /* ------------------------------- as facetas ---------------------------- */
  faceta: string
  facetas: Record<string, string>
  facetaDica: Record<string, string>
  telaDedicada: string
  visaoRapida: string
  voltarParaLista: string
  editando: string
  confirmar: string
  descartar: string

  /* ------------------------------- o andaime ----------------------------- */
  andaimeTitulo: string
  estado: string
  estados: Record<string, string>
  verFicha: string
  dicaDeUso: string
  baixarRelatorio: string
  gerandoRelatorio: string
  relatorioPronto: string
  relatorioNome: string
  colunasDoRelatorio: string[]

  /* ------------------------------- os estados ---------------------------- */
  carregando: string
  semItensTitulo: string
  semItensTexto: string
  semItensAcao: string
  erroTitulo: string
  erroTexto: string
  erroAcao: string
  semPermissaoTitulo: string
  semPermissaoTexto: string

  /* -------------------------- os tipos de campo -------------------------- */
  campos: Record<TipoDeCampo, RegraDeCampo>
}

/* ========================================================================== *
 *                                  PORTUGUÊS                                 *
 * ========================================================================== */

const ptBR: Textos = {
  casca: {
    menuLateral: 'Menu lateral',
    buscar: 'Buscar...',
    membro: 'Membro',
    configuracoes: 'Configurações',
    ajuda: 'Ajuda',
    recolherMenu: 'Recolher o menu',
    abrirMenu: 'Abrir o menu',
    voltar: 'Voltar',
    avancar: 'Avançar',
    recarregar: 'Recarregar',
    trilha: 'Trilha de navegação',
    idioma: 'Idioma',
    tema: 'Tema',
    suporte: 'Suporte',
    notificacoes: 'Notificações',
    conta: 'Conta',
    lab: 'Funcionalidade beta do Lab',
    itens: {
      inicio: 'Início',
      spaceflows: 'Spaceflows',
      categorias: 'Categorias',
      tarefas: 'Tarefas',
      agenda: 'Agenda',
      knowledge: 'Knowledge',
      visaoGeral: 'Visão Geral',
      sistema: 'Sistema',
      estrutura: 'Estrutura',
      gestaoDeMembros: 'Gestão de Membros',
      interface: 'Interface',
      emails: 'E-mails',
      integracoes: 'Integrações',
      agentesDeIa: 'Agentes de IA',
      logs: 'Logs',
      credenciais: 'Credenciais',
      releases: 'Releases',
      documentacao: 'Documentação',
      vitrine: 'Vitrine de campos',
      todos: 'Todos',
    },
  },

  trilhaCategorias: 'Categorias',
  abaItens: 'Itens',
  abaVisualizar: 'Visualizar',
  pesquisar: 'Pesquisar registros',
  criadoEm: 'Criado em',
  todoPeriodo: 'Todo o período',
  exportar: 'Exportar',
  colunas: 'Colunas',
  densidade: 'Densidade',
  maisOpcoes: 'Mais opções',
  novoRegistro: 'Novo registro',
  acoes: 'Ações',
  referencia: 'Referência',
  mostrando: (de, ate, total) => `Mostrando ${de} a ${ate} de ${total} resultados`,
  porPagina: 'por página',
  verDetalhes: 'Ver Detalhes',
  editar: 'Editar',
  enviarParaLixeira: 'Enviar para Lixeira',
  copiarLink: 'Copiar Link',
  vazio: 'Vazio',
  maisN: n => `+${n}`,
  verMais: 'ver mais',
  verMenos: 'ver menos',
  copiar: 'Copiar',
  copiado: 'Copiado',
  baixar: 'Baixar',
  abrir: 'Abrir',
  sim: 'Sim',
  nao: 'Não',
  ativo: 'Ativo',
  inativo: 'Inativo',
  rascunho: 'Rascunho',

  tituloNovoItem: 'Novo registro',
  cancelar: 'Cancelar',
  criar: 'Criar',
  salvar: 'Salvar',
  salvando: 'Salvando',
  salvo: 'Registro salvo',
  obrigatorio: 'obrigatório',
  formularioAjuda: 'Os campos seguem a ordem e a largura definidas na categoria.',

  visaoGeral: 'Visão Geral',
  comentarios: 'Comentários',
  logsDeAuditoria: 'Logs de Auditoria',
  identificacao: 'Identificação',
  origem: 'Origem',
  historico: 'Histórico',
  osCampos: 'Campos da categoria',
  id: 'ID',
  status: 'Status',
  emailDaSolicitacao: 'E-mail da solicitação',
  criadoEmRotulo: 'Criado em',
  atualizadoEm: 'Atualizado em',
  itemDe: (i, total) => `${i}/${total}`,
  anterior: 'Registro anterior',
  proximo: 'Próximo registro',
  recolherResumo: 'Recolher o resumo',
  abrirResumo: 'Abrir o resumo',
  fecharPainel: 'Fechar o painel',

  fichaTitulo: 'Ficha do campo',
  fichaVazia: 'Clique em qualquer campo da tela para ver o padrão dele nos três formatos e o contrato de back-end.',
  fichaFechar: 'Fechar a ficha',
  formatoCelula: 'Célula',
  formatoFormulario: 'Formulário',
  formatoCru: 'Cru',
  ondeApareceCelula: 'na tabela',
  ondeApareceFormulario: 'na criação e na edição',
  ondeApareceCru: 'no resumo da sidebar',
  backend: 'Back-end',
  formatoDeEntrada: 'Formato de entrada',
  formatoDeSaida: 'Formato de saída',
  saidaFormatada: 'Saída formatada',
  chavesDeFormato: 'Chaves de cFormat',
  chavesDeConfig: 'Chaves de config',
  familia: 'Família',
  familias: {
    texto: 'Texto',
    numero: 'Número',
    escolha: 'Escolha',
    booleano: 'Booleano',
    dataHora: 'Data e hora',
    relacao: 'Relação',
    pessoa: 'Pessoa',
    arquivo: 'Arquivo',
    composto: 'Composto',
  },
  disponibilidade: 'Disponibilidade',
  tipoAtivo: 'No seletor',
  tipoLegado: 'Legado',
  tipoLegadoAviso: 'Existe em dado gravado, mas não se cria mais pelo seletor de tipo. A tela precisa renderizar mesmo assim.',
  tipoProposto: 'Proposto',
  tipoPropostoAviso: 'Este tipo não existe no produto. Ele vem do documento do time de produtos, e o padrão está aqui para nascer definido junto com o campo.',
  alinhamento: 'Alinhamento na célula',
  alinhamentoInicio: 'Esquerda',
  alinhamentoFim: 'Direita',
  larguraMinima: 'Largura mínima da coluna',
  nenhumaChave: 'Nenhuma',
  configuracoesDoTipo: 'Configurações do tipo',
  configuracoesOnde: 'no painel de criar campo',
  semConfiguracaoPropria: 'Este tipo não tem configuração própria. Só a base que todos têm: nome, referência, rótulo, formulário, largura, esquema de cores, seção, ordenação, ícone e validações.',

  faceta: 'Faceta',
  facetas: {
    tabela: 'Tabela',
    formulario: 'Formulário',
    naked: 'Cru',
  },
  facetaDica: {
    tabela: 'Clique numa célula para editar ali mesmo. Clique no nome da coluna para abrir a ficha do tipo.',
    formulario: 'O formulário de criação, com um campo de cada tipo. O rótulo abre a ficha.',
    naked: 'A visão rápida do item: cru na coluna da esquerda, formulário na parte de dentro. Clique num valor para editar.',
  },
  telaDedicada: 'Tela do item',
  visaoRapida: 'Visão rápida',
  voltarParaLista: 'Voltar para a lista',
  editando: 'Editando',
  confirmar: 'Confirmar',
  descartar: 'Descartar',
  andaimeTitulo: 'Andaime do protótipo, não é produto',
  estado: 'Estado',
  estados: {
    cheio: 'Cheio',
    vazio: 'Vazio',
    carregando: 'Carregando',
    erro: 'Erro',
    bloqueado: 'Sem permissão',
  },
  verFicha: 'Ficha do campo',
  dicaDeUso: 'Clique numa célula, num campo do formulário ou numa linha do resumo para abrir a ficha.',
  baixarRelatorio: 'Baixar relatório (.xlsx)',
  gerandoRelatorio: 'Gerando',
  relatorioPronto: 'Relatório baixado',
  relatorioNome: 'padrao-dos-campos',
  colunasDoRelatorio: [
    'Tipo',
    'Rótulo',
    'Família',
    'Disponibilidade',
    'Célula',
    'Formulário',
    'Cru',
    'Formato de entrada',
    'Formato de saída',
    'Saída formatada',
    'Chaves de cFormat',
    'Chaves de config',
    'Alinhamento',
    'Largura mínima',
    'Exemplo de valor',
  ],

  carregando: 'Carregando os registros',
  semItensTitulo: 'Nenhum registro ainda',
  semItensTexto: 'Esta categoria tem campos configurados e nenhum registro. Crie o primeiro para ver a tabela de pé.',
  semItensAcao: 'Criar o primeiro registro',
  erroTitulo: 'Não foi possível carregar os registros',
  erroTexto: 'A lista continua lá. É só tentar de novo.',
  erroAcao: 'Tentar de novo',
  semPermissaoTitulo: 'Você não tem acesso a esta categoria',
  semPermissaoTexto: 'Peça acesso a quem administra o workspace. Nada foi perdido.',

  campos: {
    inputText: {
      rotulo: 'Texto Curto',
      descricao: 'Uma linha de texto. É o campo de uso geral da categoria.',
      celula: 'Uma linha, à esquerda, com reticências quando não cabe. O texto inteiro fica no tooltip.',
      formulario: 'Campo de uma linha, com contador de caracteres quando existe limite.',
      cru: 'O texto em uma linha. Sem valor, mostra o marcador de vazio.',
    },
    EnTextArea: {
      rotulo: 'Texto Longo',
      descricao: 'Para descrições, comentários ou anotações extensas. Aceita várias linhas.',
      celula: 'Só a primeira linha, com reticências. O resto fica no tooltip e na sidebar.',
      formulario: 'Caixa de três linhas que cresce até seis. Ocupa a linha inteira.',
      cru: 'Até três linhas, com "ver mais" quando sobra texto.',
    },
    EnHtml: {
      rotulo: 'Editor de texto HTML',
      descricao: 'Texto com formatação: negrito, listas, links e títulos.',
      celula: 'O texto sem as tags, em uma linha. Formatação na célula rouba a leitura da coluna.',
      formulario: 'Editor com barra de formatação, na linha inteira.',
      cru: 'O texto já formatado, cortado em três linhas, com "ver mais".',
    },
    EnNotes: {
      rotulo: 'Anotações',
      descricao: 'Conversa ligada ao item, com histórico e compositor de mensagem.',
      celula: 'A última anotação e o total, com reticências quando não cabe.',
      formulario: 'Painel de conversa com o histórico e o compositor embaixo. No produto ele ocupa 759 px.',
      cru: 'Fica só na coluna dos campos: conversa não cabe em resumo.',
    },
    EnlMask: {
      rotulo: 'Texto com máscara',
      descricao: 'Texto que segue um formato fixo, como CPF, CNPJ ou telefone.',
      celula: 'O valor já mascarado, em fonte tabular para os dígitos alinharem entre linhas.',
      formulario: 'Campo que aplica a máscara enquanto a pessoa digita.',
      cru: 'O valor mascarado, com o botão de copiar aparecendo no hover.',
    },
    email: {
      rotulo: 'E-mail',
      descricao: 'Endereço de e-mail, com validação de formato.',
      celula: 'O endereço como link, com reticências quando não cabe.',
      formulario: 'Campo de e-mail, com a validação avisando ao sair do campo.',
      cru: 'O endereço como link, com o botão de copiar no hover.',
    },
    EnCustomCode: {
      rotulo: 'Código gerado',
      descricao: 'Identificador montado por expressão, preenchido pelo sistema.',
      celula: 'O código em fonte tabular, com o botão de copiar no hover.',
      formulario: 'Só leitura, com a explicação de que o valor nasce ao salvar.',
      cru: 'O código, com o botão de copiar.',
    },
    EnlNumber: {
      rotulo: 'Número',
      descricao: 'Valor numérico, inteiro ou com casas decimais.',
      celula: 'À direita, em fonte tabular, já formatado pelo cFormat.',
      formulario: 'Campo alinhado à direita, com os botões de somar e subtrair quando config.buttons está ligado.',
      cru: 'O número formatado, à esquerda, colado no rótulo.',
    },
    EnCurrency: {
      rotulo: 'Moeda',
      descricao: 'Valor monetário, com símbolo e casas decimais fixas.',
      celula: 'À direita, com o símbolo antes do número e as casas sempre presentes.',
      formulario: 'Símbolo fixo à esquerda do campo, para a pessoa não digitar.',
      cru: 'O valor com símbolo, em fonte tabular.',
    },
    EnlDropdown: {
      rotulo: 'Lista de Seleção Única',
      descricao: 'Menu suspenso com várias opções, uma escolha só.',
      celula: 'Um selo com a cor da opção. Sem escolha, o marcador de vazio.',
      formulario: 'Lista suspensa, com busca a partir de dez opções.',
      cru: 'O mesmo selo da célula, sem mudar de cor nem de forma.',
    },
    radioButton: {
      rotulo: 'Botões de Seleção única',
      descricao: 'Todas as opções à vista, uma escolha só.',
      celula: 'Um selo, igual ao da lista única. A célula não mostra o formato de escolha.',
      formulario: 'Todas as opções visíveis, uma por linha, até cinco. Acima disso vira lista suspensa.',
      cru: 'Um selo.',
    },
    multiSelect: {
      rotulo: 'Lista de Seleção Múltipla',
      descricao: 'Menu com várias opções e mais de uma escolha.',
      celula: 'Dois selos e um contador com o que sobrou. O contador abre a lista no hover.',
      formulario: 'Seletor múltiplo com busca. O escolhido vira selo dentro do próprio campo.',
      cru: 'Os selos em até duas linhas, com "ver mais".',
    },
    checkbox: {
      rotulo: 'Caixas de Seleção',
      descricao: 'Lista de caixas, nenhuma, uma ou várias marcadas.',
      celula: 'Os rótulos marcados viram selos: dois e o contador.',
      formulario: 'Uma caixa por opção, na linha inteira. Rótulo longo quebra em várias linhas.',
      cru: 'Os rótulos marcados, um por linha, com a marca de conferido.',
    },
    EnlCheckbox: {
      rotulo: 'Caixas de Seleção (antigo)',
      descricao: 'A versão anterior das caixas de seleção, ainda presente em dado gravado.',
      celula: 'Igual ao checkbox: dois selos e o contador.',
      formulario: 'Igual ao checkbox. A tela não distingue os dois.',
      cru: 'Igual ao checkbox.',
    },
    inputSwitch: {
      rotulo: 'Alternativa Binária',
      descricao: 'Liga ou desliga. Grava verdadeiro ou falso.',
      celula: 'Sim ou Não em texto, com um ponto de cor. Chave ligada na célula promete edição que a célula não faz.',
      formulario: 'Hoje o produto usa caixa de seleção. A proposta é a chave, que diz melhor que o estado alterna.',
      cru: 'Sim ou Não, com o ponto de cor.',
    },
    EnlChips: {
      rotulo: 'Tags',
      descricao: 'Vários valores livres, cada um virando uma tag.',
      celula: 'Três tags e o contador do que sobrou.',
      formulario: 'Campo que transforma o que foi digitado em tag a cada Enter.',
      cru: 'As tags, quebrando em quantas linhas precisar.',
    },
    EnlCalendar: {
      rotulo: 'Data (Calendário)',
      descricao: 'Data, com ou sem hora, para prazos e agendamentos.',
      celula: 'A data curta, em fonte tabular. Data vencida fica em vermelho.',
      formulario: 'Campo com calendário. A digitação aceita o formato do idioma escolhido.',
      cru: 'A data por extenso curta, com o relativo ao lado quando cai nos próximos sete dias.',
    },
    EnlTimeRange: {
      rotulo: 'Intervalo de horas',
      descricao: 'Hora de início e hora de fim, no mesmo campo.',
      celula: 'As duas pontas na mesma linha, em fonte tabular.',
      formulario: 'Dois seletores de hora lado a lado, com o fim validado contra o início.',
      cru: 'As duas pontas, com a duração calculada ao lado.',
    },
    EnRel: {
      rotulo: 'Relacionamento Simples',
      descricao: 'Liga este item a um item de outra categoria.',
      celula: 'Um selo clicável com o display. Display vazio cai para a referência, nunca para nada.',
      formulario: 'Busca pelo display, com o botão de criar quando a categoria permite.',
      cru: 'O selo, que abre o item relacionado na própria sidebar.',
    },
    EnRelMulti: {
      rotulo: 'Relacionamento Múltiplo',
      descricao: 'Liga este item a vários itens de outra categoria.',
      celula: 'Dois selos e o contador.',
      formulario: 'Busca múltipla. Os escolhidos viram selos logo abaixo do campo.',
      cru: 'Os selos, com "ver mais" acima de cinco.',
    },
    EnTreeSelect: {
      rotulo: 'Seleção em árvore',
      descricao: 'Escolha dentro de uma hierarquia de opções.',
      celula: 'Só a folha escolhida, como selo. O caminho inteiro fica no tooltip.',
      formulario: 'Árvore que abre por nível, com busca que achata os resultados.',
      cru: 'O caminho inteiro, do pai até a folha.',
    },
    EnPerson: {
      rotulo: 'Pessoa/Empresa',
      descricao: 'Cadastro de pessoa ou empresa, com os subcampos que a categoria escolher.',
      celula: 'Avatar com as iniciais e o nome ao lado.',
      formulario: 'Bloco com os subcampos de personConfig, na linha inteira.',
      cru: 'Avatar e nome, com o e-mail em segunda linha menor.',
    },
    EnAddress: {
      rotulo: 'Endereço',
      descricao: 'Endereço completo, com os subcampos do país configurado.',
      celula: 'Uma linha só, montada pelo displayString, com reticências.',
      formulario: 'Bloco de subcampos em grade, com o CEP primeiro e o resto preenchendo a partir dele.',
      cru: 'Duas linhas: logradouro em cima, cidade e estado embaixo.',
    },
    uploadFile: {
      rotulo: 'Arquivo',
      descricao: 'Anexo de qualquer formato.',
      celula: 'Selo com o ícone do formato e o nome do arquivo.',
      formulario: 'Área de soltar arquivo, com o limite de tamanho escrito antes de a pessoa tentar.',
      cru: 'Nome, tamanho e o botão de baixar.',
    },
    uploadImage: {
      rotulo: 'Imagem',
      descricao: 'Anexo de imagem, com pré-visualização.',
      celula: 'Miniatura quadrada de 20 pixels e o nome ao lado.',
      formulario: 'Área de soltar com a pré-visualização aparecendo assim que o arquivo entra.',
      cru: 'Miniatura maior, que abre a imagem inteira ao clicar.',
    },
    EnPDF: {
      rotulo: 'Tratamento de PDF',
      descricao: 'PDF com opção de selo e carimbo.',
      celula: 'Selo do PDF com o nome do arquivo.',
      formulario: 'Área de soltar, mais o aviso do selo quando hasSeal está ligado.',
      cru: 'Nome, tamanho e a marca do selo quando existe.',
    },
    EnOnlyoffice: {
      rotulo: 'Editor de Documentos',
      descricao: 'Documento editável dentro do ENSPACE.',
      celula: 'Selo do documento com o nome do arquivo.',
      formulario: 'Escolha do modelo. O editor só abre depois de o item existir.',
      cru: 'Fica só na coluna dos campos: o editor precisa de largura para ser útil.',
    },
    EnESign: {
      rotulo: 'Assinatura eletrônica',
      descricao: 'Assinatura desenhada ou digitada, com registro de quem e quando.',
      celula: 'Quem assinou, com a marca de assinado. Sem assinatura, o marcador de vazio.',
      formulario: 'Área de assinar, com o aviso de que a assinatura é registrada com data e hora.',
      cru: 'Quem assinou e quando, com a miniatura da assinatura.',
    },
    EnRepeater: {
      rotulo: 'Repetidor',
      descricao: 'Várias linhas com a mesma estrutura, dentro do mesmo item.',
      celula: 'A primeira linha, montada pelo displayString, e o contador do total.',
      formulario: 'Tabela de linhas com o botão de acrescentar, na linha inteira.',
      cru: 'Fica só na coluna dos campos: o repetidor é tabela, e tabela não cabe no resumo.',
    },
    group: {
      rotulo: 'Grupo',
      descricao: 'Vários campos reunidos sob um título, gravados juntos.',
      celula: 'O subcampo eleito pelo displayString, e mais nada.',
      formulario: 'Bloco com borda e título, com os campos filhos dentro dele.',
      cru: 'Os subcampos um por linha, recuados sob o nome do grupo.',
    },
    EnChats: {
      rotulo: 'Chat',
      descricao: 'Conversa ligada ao item, mensagem a mensagem.',
      celula: 'A última mensagem e o total, com a marca de não lida quando houver.',
      formulario: 'Não entra na criação: a conversa só começa depois de o item existir.',
      cru: 'Fica só na coluna dos campos.',
    },
    duracao: {
      rotulo: 'Duração',
      descricao: 'Uma duração escrita em linguagem natural: 1 dia, 2 semanas, 30 min.',
      celula: 'A duração como o produto guardou, em uma linha.',
      formulario: 'Campo de texto, com os exemplos do produto no placeholder.',
      cru: 'A duração em uma linha.',
    },
    valorDinamico: {
      rotulo: 'Valor dinâmico',
      descricao: 'Valor calculado por expressão, preenchido pelo sistema.',
      celula: 'O resultado formatado, com o ícone de calculado antes.',
      formulario: 'Só leitura, com a expressão visível em texto de ajuda.',
      cru: 'O resultado, com o ícone de calculado.',
    },
  },
}

/* ========================================================================== *
 *                                   ENGLISH                                  *
 * ========================================================================== */

const en: Textos = {
  casca: {
    menuLateral: 'Sidebar',
    buscar: 'Search...',
    membro: 'Member',
    configuracoes: 'Settings',
    ajuda: 'Help',
    recolherMenu: 'Collapse the sidebar',
    abrirMenu: 'Expand the sidebar',
    voltar: 'Back',
    avancar: 'Forward',
    recarregar: 'Reload',
    trilha: 'Breadcrumb',
    idioma: 'Language',
    tema: 'Theme',
    suporte: 'Support',
    notificacoes: 'Notifications',
    conta: 'Account',
    lab: 'Lab beta feature',
    itens: {
      inicio: 'Home',
      spaceflows: 'Spaceflows',
      categorias: 'Categories',
      tarefas: 'Tasks',
      agenda: 'Calendar',
      knowledge: 'Knowledge',
      visaoGeral: 'Overview',
      sistema: 'System',
      estrutura: 'Structure',
      gestaoDeMembros: 'Member management',
      interface: 'Interface',
      emails: 'E-mails',
      integracoes: 'Integrations',
      agentesDeIa: 'AI agents',
      logs: 'Logs',
      credenciais: 'Credentials',
      releases: 'Releases',
      documentacao: 'Documentation',
      vitrine: 'Field showcase',
      todos: 'All',
    },
  },

  trilhaCategorias: 'Categories',
  abaItens: 'Items',
  abaVisualizar: 'View',
  pesquisar: 'Search records',
  criadoEm: 'Created at',
  todoPeriodo: 'All time',
  exportar: 'Export',
  colunas: 'Columns',
  densidade: 'Density',
  maisOpcoes: 'More options',
  novoRegistro: 'New record',
  acoes: 'Actions',
  referencia: 'Reference',
  mostrando: (de, ate, total) => `Showing ${de} to ${ate} of ${total} results`,
  porPagina: 'per page',
  verDetalhes: 'View details',
  editar: 'Edit',
  enviarParaLixeira: 'Send to trash',
  copiarLink: 'Copy link',
  vazio: 'Empty',
  maisN: n => `+${n}`,
  verMais: 'show more',
  verMenos: 'show less',
  copiar: 'Copy',
  copiado: 'Copied',
  baixar: 'Download',
  abrir: 'Open',
  sim: 'Yes',
  nao: 'No',
  ativo: 'Active',
  inativo: 'Inactive',
  rascunho: 'Draft',

  tituloNovoItem: 'New record',
  cancelar: 'Cancel',
  criar: 'Create',
  salvar: 'Save',
  salvando: 'Saving',
  salvo: 'Record saved',
  obrigatorio: 'required',
  formularioAjuda: 'Fields follow the order and width set on the category.',

  visaoGeral: 'Overview',
  comentarios: 'Comments',
  logsDeAuditoria: 'Audit logs',
  identificacao: 'Identification',
  origem: 'Origin',
  historico: 'History',
  osCampos: 'Category fields',
  id: 'ID',
  status: 'Status',
  emailDaSolicitacao: 'Request e-mail',
  criadoEmRotulo: 'Created at',
  atualizadoEm: 'Updated at',
  itemDe: (i, total) => `${i}/${total}`,
  anterior: 'Previous record',
  proximo: 'Next record',
  recolherResumo: 'Collapse the summary',
  abrirResumo: 'Expand the summary',
  fecharPainel: 'Close the panel',

  fichaTitulo: 'Field sheet',
  fichaVazia: 'Click any field on the screen to see its standard in the three formats and its back-end contract.',
  fichaFechar: 'Close the sheet',
  formatoCelula: 'Cell',
  formatoFormulario: 'Form',
  formatoCru: 'Naked',
  ondeApareceCelula: 'in the table',
  ondeApareceFormulario: 'when creating and editing',
  ondeApareceCru: 'in the sidebar summary',
  backend: 'Back-end',
  formatoDeEntrada: 'Input format',
  formatoDeSaida: 'Output format',
  saidaFormatada: 'Formatted output',
  chavesDeFormato: 'cFormat keys',
  chavesDeConfig: 'config keys',
  familia: 'Family',
  familias: {
    texto: 'Text',
    numero: 'Number',
    escolha: 'Choice',
    booleano: 'Boolean',
    dataHora: 'Date and time',
    relacao: 'Relation',
    pessoa: 'Person',
    arquivo: 'File',
    composto: 'Composite',
  },
  disponibilidade: 'Availability',
  tipoAtivo: 'In the selector',
  tipoLegado: 'Legacy',
  tipoLegadoAviso: 'It exists in stored data but is no longer offered in the type selector. The screen still has to render it.',
  tipoProposto: 'Proposed',
  tipoPropostoAviso: 'This type does not exist in the product yet. It comes from the product team document, and the standard is here so it is defined before the field is built.',
  alinhamento: 'Cell alignment',
  alinhamentoInicio: 'Left',
  alinhamentoFim: 'Right',
  larguraMinima: 'Minimum column width',
  nenhumaChave: 'None',
  configuracoesDoTipo: 'Type settings',
  configuracoesOnde: 'in the field creation panel',
  semConfiguracaoPropria: 'This type has no settings of its own. Only the base every field has: name, reference, label, form, width, color scheme, section, order, icon and validations.',

  faceta: 'Facet',
  facetas: {
    tabela: 'Table',
    formulario: 'Form',
    naked: 'Naked',
  },
  facetaDica: {
    tabela: 'Click a cell to edit it in place. Click a column name to open the type sheet.',
    formulario: 'The creation form, with one field of each type. The label opens the sheet.',
    naked: 'The item quick view: naked on the left column, form inside. Click a value to edit it.',
  },
  telaDedicada: 'Item page',
  visaoRapida: 'Quick view',
  voltarParaLista: 'Back to the list',
  editando: 'Editing',
  confirmar: 'Confirm',
  descartar: 'Discard',
  andaimeTitulo: 'Prototype scaffolding, not product',
  estado: 'State',
  estados: {
    cheio: 'Full',
    vazio: 'Empty',
    carregando: 'Loading',
    erro: 'Error',
    bloqueado: 'No permission',
  },
  verFicha: 'Field sheet',
  dicaDeUso: 'Click a cell, a form field or a summary row to open the sheet.',
  baixarRelatorio: 'Download report (.xlsx)',
  gerandoRelatorio: 'Generating',
  relatorioPronto: 'Report downloaded',
  relatorioNome: 'field-standard',
  colunasDoRelatorio: [
    'Type',
    'Label',
    'Family',
    'Availability',
    'Cell',
    'Form',
    'Naked',
    'Input format',
    'Output format',
    'Formatted output',
    'cFormat keys',
    'config keys',
    'Alignment',
    'Minimum width',
    'Sample value',
  ],

  carregando: 'Loading the records',
  semItensTitulo: 'No records yet',
  semItensTexto: 'This category has fields set up and no records. Create the first one to see the table standing.',
  semItensAcao: 'Create the first record',
  erroTitulo: 'The records could not be loaded',
  erroTexto: 'The list is still there. Just try again.',
  erroAcao: 'Try again',
  semPermissaoTitulo: 'You do not have access to this category',
  semPermissaoTexto: 'Ask whoever administers the workspace for access. Nothing was lost.',

  campos: {
    inputText: {
      rotulo: 'Short Text',
      descricao: 'A single line of text. The general purpose field of a category.',
      celula: 'One line, left aligned, ellipsis when it does not fit. The full text goes in the tooltip.',
      formulario: 'Single line input, with a character counter when there is a limit.',
      cru: 'The text on one line. With no value, it shows the empty marker.',
    },
    EnTextArea: {
      rotulo: 'Long Text',
      descricao: 'For descriptions, comments or long notes. Accepts several lines.',
      celula: 'Only the first line, with ellipsis. The rest lives in the tooltip and in the sidebar.',
      formulario: 'Three line box that grows up to six. Takes the whole row.',
      cru: 'Up to three lines, with "show more" when text is left over.',
    },
    EnHtml: {
      rotulo: 'HTML text editor',
      descricao: 'Text with formatting: bold, lists, links and headings.',
      celula: 'The text without tags, on one line. Formatting inside a cell steals the column reading.',
      formulario: 'Editor with a formatting bar, on the whole row.',
      cru: 'The formatted text, cut at three lines, with "show more".',
    },
    EnNotes: {
      rotulo: 'Notes',
      descricao: 'A conversation attached to the item, with history and a composer.',
      celula: 'The last note and the total, with ellipsis when it does not fit.',
      formulario: 'A conversation panel with the history and the composer below. In the product it takes 759 px.',
      cru: 'Stays only in the fields column: a conversation does not fit a summary.',
    },
    EnlMask: {
      rotulo: 'Masked text',
      descricao: 'Text that follows a fixed format, such as a tax id or a phone number.',
      celula: 'The already masked value, in tabular figures so digits line up across rows.',
      formulario: 'Input that applies the mask while typing.',
      cru: 'The masked value, with the copy button showing on hover.',
    },
    email: {
      rotulo: 'E-mail',
      descricao: 'E-mail address, with format validation.',
      celula: 'The address as a link, with ellipsis when it does not fit.',
      formulario: 'E-mail input, validating on blur.',
      cru: 'The address as a link, with the copy button on hover.',
    },
    EnCustomCode: {
      rotulo: 'Generated code',
      descricao: 'Identifier built by an expression and filled in by the system.',
      celula: 'The code in tabular figures, with the copy button on hover.',
      formulario: 'Read only, explaining that the value is born on save.',
      cru: 'The code, with the copy button.',
    },
    EnlNumber: {
      rotulo: 'Number',
      descricao: 'Numeric value, integer or with decimals.',
      celula: 'Right aligned, tabular figures, already formatted by cFormat.',
      formulario: 'Right aligned input, with plus and minus buttons when config.buttons is on.',
      cru: 'The formatted number, left aligned next to the label.',
    },
    EnCurrency: {
      rotulo: 'Currency',
      descricao: 'Monetary value, with symbol and fixed decimals.',
      celula: 'Right aligned, symbol before the number, decimals always present.',
      formulario: 'Fixed symbol on the left of the input, so nobody types it.',
      cru: 'The value with its symbol, in tabular figures.',
    },
    EnlDropdown: {
      rotulo: 'Single Select List',
      descricao: 'Dropdown with several options and a single choice.',
      celula: 'A tag with the option color. With no choice, the empty marker.',
      formulario: 'Dropdown, with search from ten options on.',
      cru: 'The same tag as the cell, same color and same shape.',
    },
    radioButton: {
      rotulo: 'Single Select Buttons',
      descricao: 'All options in sight, a single choice.',
      celula: 'A tag, the same as the single select. The cell does not show the choice format.',
      formulario: 'All options visible, one per line, up to five. Above that it becomes a dropdown.',
      cru: 'A tag.',
    },
    multiSelect: {
      rotulo: 'Multi Select List',
      descricao: 'Menu with several options and more than one choice.',
      celula: 'Two tags and a counter for what is left. The counter opens the list on hover.',
      formulario: 'Multi select with search. Each choice becomes a tag inside the input.',
      cru: 'The tags on up to two lines, with "show more".',
    },
    checkbox: {
      rotulo: 'Checkboxes',
      descricao: 'A list of boxes, none, one or several ticked.',
      celula: 'The ticked labels become tags: two and the counter.',
      formulario: 'One box per option, on the whole row. A long label wraps over several lines.',
      cru: 'The ticked labels, one per line, with the check mark.',
    },
    EnlCheckbox: {
      rotulo: 'Checkboxes (old)',
      descricao: 'The previous version of checkboxes, still present in stored data.',
      celula: 'Same as checkbox: two tags and the counter.',
      formulario: 'Same as checkbox. The screen does not tell them apart.',
      cru: 'Same as checkbox.',
    },
    inputSwitch: {
      rotulo: 'Binary Choice',
      descricao: 'On or off. Stores true or false.',
      celula: 'Yes or No as text, with a colored dot. A switch in a cell promises an edit the cell does not do.',
      formulario: 'Today the product uses a checkbox. The proposal is the switch, which says better that the state toggles.',
      cru: 'Yes or No, with the colored dot.',
    },
    EnlChips: {
      rotulo: 'Tags',
      descricao: 'Several free values, each one becoming a tag.',
      celula: 'Three tags and a counter for what is left.',
      formulario: 'Input that turns what was typed into a tag on every Enter.',
      cru: 'The tags, wrapping over as many lines as needed.',
    },
    EnlCalendar: {
      rotulo: 'Date (Calendar)',
      descricao: 'Date, with or without time, for deadlines and scheduling.',
      celula: 'The short date, in tabular figures. An overdue date turns red.',
      formulario: 'Input with a calendar. Typing accepts the format of the chosen language.',
      cru: 'The short written date, with the relative one beside it within the next seven days.',
    },
    EnlTimeRange: {
      rotulo: 'Time range',
      descricao: 'Start time and end time, in the same field.',
      celula: 'Both ends on the same line, in tabular figures.',
      formulario: 'Two time pickers side by side, with the end validated against the start.',
      cru: 'Both ends, with the duration calculated beside them.',
    },
    EnRel: {
      rotulo: 'Single Relation',
      descricao: 'Links this item to one item of another category.',
      celula: 'A clickable tag with the display. An empty display falls back to the reference, never to nothing.',
      formulario: 'Search by display, with a create button when the category allows it.',
      cru: 'The tag, which opens the related item in the sidebar itself.',
    },
    EnRelMulti: {
      rotulo: 'Multiple Relation',
      descricao: 'Links this item to several items of another category.',
      celula: 'Two tags and the counter.',
      formulario: 'Multi search. The chosen ones become tags right under the input.',
      cru: 'The tags, with "show more" above five.',
    },
    EnTreeSelect: {
      rotulo: 'Tree select',
      descricao: 'A choice inside a hierarchy of options.',
      celula: 'Only the chosen leaf, as a tag. The full path goes in the tooltip.',
      formulario: 'A tree that opens level by level, with a search that flattens the results.',
      cru: 'The full path, from the parent down to the leaf.',
    },
    EnPerson: {
      rotulo: 'Person/Company',
      descricao: 'A person or company record, with the sub fields the category chooses.',
      celula: 'Avatar with initials and the name beside it.',
      formulario: 'A block with the personConfig sub fields, on the whole row.',
      cru: 'Avatar and name, with the e-mail on a smaller second line.',
    },
    EnAddress: {
      rotulo: 'Address',
      descricao: 'Full address, with the sub fields of the configured country.',
      celula: 'A single line, built by displayString, with ellipsis.',
      formulario: 'A grid of sub fields, postal code first and the rest filling in from it.',
      cru: 'Two lines: street above, city and state below.',
    },
    uploadFile: {
      rotulo: 'File',
      descricao: 'An attachment in any format.',
      celula: 'A tag with the format icon and the file name.',
      formulario: 'Drop area, with the size limit written before anyone tries.',
      cru: 'Name, size and the download button.',
    },
    uploadImage: {
      rotulo: 'Image',
      descricao: 'An image attachment, with preview.',
      celula: 'A 20 pixel square thumbnail and the name beside it.',
      formulario: 'Drop area with the preview showing as soon as the file lands.',
      cru: 'A larger thumbnail, which opens the full image on click.',
    },
    EnPDF: {
      rotulo: 'PDF handling',
      descricao: 'A PDF with optional seal and stamp.',
      celula: 'A PDF tag with the file name.',
      formulario: 'Drop area, plus the seal notice when hasSeal is on.',
      cru: 'Name, size and the seal mark when there is one.',
    },
    EnOnlyoffice: {
      rotulo: 'Document editor',
      descricao: 'A document edited inside ENSPACE.',
      celula: 'A document tag with the file name.',
      formulario: 'Template choice. The editor only opens once the item exists.',
      cru: 'Stays only in the fields column: the editor needs width to be useful.',
    },
    EnESign: {
      rotulo: 'Electronic signature',
      descricao: 'A drawn or typed signature, recording who and when.',
      celula: 'Who signed, with the signed mark. With no signature, the empty marker.',
      formulario: 'Signing area, warning that the signature is recorded with date and time.',
      cru: 'Who signed and when, with the signature thumbnail.',
    },
    EnRepeater: {
      rotulo: 'Repeater',
      descricao: 'Several rows with the same structure, inside the same item.',
      celula: 'The first row, built by displayString, and the total counter.',
      formulario: 'A table of rows with an add button, on the whole row.',
      cru: 'Stays only in the fields column: a repeater is a table, and a table does not fit a summary.',
    },
    group: {
      rotulo: 'Group',
      descricao: 'Several fields gathered under one title and stored together.',
      celula: 'The sub field elected by displayString, and nothing else.',
      formulario: 'A bordered block with a title and the child fields inside it.',
      cru: 'The sub fields one per line, indented under the group name.',
    },
    EnChats: {
      rotulo: 'Chat',
      descricao: 'A conversation attached to the item, message by message.',
      celula: 'The last message and the total, with an unread mark when there is one.',
      formulario: 'Not part of creation: the conversation only starts once the item exists.',
      cru: 'Stays only in the fields column.',
    },
    duracao: {
      rotulo: 'Duration',
      descricao: 'A duration written in plain language: 1 day, 2 weeks, 30 min.',
      celula: 'The duration as the product stored it, on one line.',
      formulario: 'Text input, with the product examples in the placeholder.',
      cru: 'The duration on one line.',
    },
    valorDinamico: {
      rotulo: 'Dynamic value',
      descricao: 'A value computed by an expression and filled in by the system.',
      celula: 'The formatted result, with the computed icon in front.',
      formulario: 'Read only, with the expression visible in the help text.',
      cru: 'The result, with the computed icon.',
    },
  },
}

/* ========================================================================== *
 *                                   ESPAÑOL                                  *
 * ========================================================================== */

const es: Textos = {
  casca: {
    menuLateral: 'Menú lateral',
    buscar: 'Buscar...',
    membro: 'Miembro',
    configuracoes: 'Configuración',
    ajuda: 'Ayuda',
    recolherMenu: 'Contraer el menú',
    abrirMenu: 'Abrir el menú',
    voltar: 'Atrás',
    avancar: 'Adelante',
    recarregar: 'Recargar',
    trilha: 'Ruta de navegación',
    idioma: 'Idioma',
    tema: 'Tema',
    suporte: 'Soporte',
    notificacoes: 'Notificaciones',
    conta: 'Cuenta',
    lab: 'Funcionalidad beta del Lab',
    itens: {
      inicio: 'Inicio',
      spaceflows: 'Spaceflows',
      categorias: 'Categorías',
      tarefas: 'Tareas',
      agenda: 'Agenda',
      knowledge: 'Knowledge',
      visaoGeral: 'Visión general',
      sistema: 'Sistema',
      estrutura: 'Estructura',
      gestaoDeMembros: 'Gestión de miembros',
      interface: 'Interfaz',
      emails: 'Correos',
      integracoes: 'Integraciones',
      agentesDeIa: 'Agentes de IA',
      logs: 'Registros',
      credenciais: 'Credenciales',
      releases: 'Versiones',
      documentacao: 'Documentación',
      vitrine: 'Vitrina de campos',
      todos: 'Todos',
    },
  },

  trilhaCategorias: 'Categorías',
  abaItens: 'Elementos',
  abaVisualizar: 'Visualizar',
  pesquisar: 'Buscar registros',
  criadoEm: 'Creado el',
  todoPeriodo: 'Todo el período',
  exportar: 'Exportar',
  colunas: 'Columnas',
  densidade: 'Densidad',
  maisOpcoes: 'Más opciones',
  novoRegistro: 'Nuevo registro',
  acoes: 'Acciones',
  referencia: 'Referencia',
  mostrando: (de, ate, total) => `Mostrando ${de} a ${ate} de ${total} resultados`,
  porPagina: 'por página',
  verDetalhes: 'Ver detalles',
  editar: 'Editar',
  enviarParaLixeira: 'Enviar a la papelera',
  copiarLink: 'Copiar enlace',
  vazio: 'Vacío',
  maisN: n => `+${n}`,
  verMais: 'ver más',
  verMenos: 'ver menos',
  copiar: 'Copiar',
  copiado: 'Copiado',
  baixar: 'Descargar',
  abrir: 'Abrir',
  sim: 'Sí',
  nao: 'No',
  ativo: 'Activo',
  inativo: 'Inactivo',
  rascunho: 'Borrador',

  tituloNovoItem: 'Nuevo registro',
  cancelar: 'Cancelar',
  criar: 'Crear',
  salvar: 'Guardar',
  salvando: 'Guardando',
  salvo: 'Registro guardado',
  obrigatorio: 'obligatorio',
  formularioAjuda: 'Los campos siguen el orden y el ancho definidos en la categoría.',

  visaoGeral: 'Visión general',
  comentarios: 'Comentarios',
  logsDeAuditoria: 'Registros de auditoría',
  identificacao: 'Identificación',
  origem: 'Origen',
  historico: 'Historial',
  osCampos: 'Campos de la categoría',
  id: 'ID',
  status: 'Estado',
  emailDaSolicitacao: 'Correo de la solicitud',
  criadoEmRotulo: 'Creado el',
  atualizadoEm: 'Actualizado el',
  itemDe: (i, total) => `${i}/${total}`,
  anterior: 'Registro anterior',
  proximo: 'Registro siguiente',
  recolherResumo: 'Contraer el resumen',
  abrirResumo: 'Abrir el resumen',
  fecharPainel: 'Cerrar el panel',

  fichaTitulo: 'Ficha del campo',
  fichaVazia: 'Haz clic en cualquier campo de la pantalla para ver su estándar en los tres formatos y su contrato de back-end.',
  fichaFechar: 'Cerrar la ficha',
  formatoCelula: 'Celda',
  formatoFormulario: 'Formulario',
  formatoCru: 'Crudo',
  ondeApareceCelula: 'en la tabla',
  ondeApareceFormulario: 'al crear y al editar',
  ondeApareceCru: 'en el resumen del panel',
  backend: 'Back-end',
  formatoDeEntrada: 'Formato de entrada',
  formatoDeSaida: 'Formato de salida',
  saidaFormatada: 'Salida formateada',
  chavesDeFormato: 'Claves de cFormat',
  chavesDeConfig: 'Claves de config',
  familia: 'Familia',
  familias: {
    texto: 'Texto',
    numero: 'Número',
    escolha: 'Elección',
    booleano: 'Booleano',
    dataHora: 'Fecha y hora',
    relacao: 'Relación',
    pessoa: 'Persona',
    arquivo: 'Archivo',
    composto: 'Compuesto',
  },
  disponibilidade: 'Disponibilidad',
  tipoAtivo: 'En el selector',
  tipoLegado: 'Heredado',
  tipoLegadoAviso: 'Existe en datos guardados, pero ya no se crea desde el selector de tipo. La pantalla igual tiene que renderizarlo.',
  tipoProposto: 'Propuesto',
  tipoPropostoAviso: 'Este tipo todavía no existe en el producto. Viene del documento del equipo de producto, y el estándar está aquí para nacer definido junto con el campo.',
  alinhamento: 'Alineación en la celda',
  alinhamentoInicio: 'Izquierda',
  alinhamentoFim: 'Derecha',
  larguraMinima: 'Ancho mínimo de la columna',
  nenhumaChave: 'Ninguna',
  configuracoesDoTipo: 'Configuración del tipo',
  configuracoesOnde: 'en el panel de crear campo',
  semConfiguracaoPropria: 'Este tipo no tiene configuración propia. Solo la base que todos tienen: nombre, referencia, etiqueta, formulario, ancho, esquema de colores, sección, orden, icono y validaciones.',

  faceta: 'Faceta',
  facetas: {
    tabela: 'Tabla',
    formulario: 'Formulario',
    naked: 'Crudo',
  },
  facetaDica: {
    tabela: 'Haz clic en una celda para editarla ahí mismo. Haz clic en el nombre de la columna para abrir la ficha del tipo.',
    formulario: 'El formulario de creación, con un campo de cada tipo. La etiqueta abre la ficha.',
    naked: 'La vista rápida del elemento: crudo en la columna izquierda, formulario dentro. Haz clic en un valor para editarlo.',
  },
  telaDedicada: 'Pantalla del elemento',
  visaoRapida: 'Vista rápida',
  voltarParaLista: 'Volver a la lista',
  editando: 'Editando',
  confirmar: 'Confirmar',
  descartar: 'Descartar',
  andaimeTitulo: 'Andamio del prototipo, no es producto',
  estado: 'Estado',
  estados: {
    cheio: 'Lleno',
    vazio: 'Vacío',
    carregando: 'Cargando',
    erro: 'Error',
    bloqueado: 'Sin permiso',
  },
  verFicha: 'Ficha del campo',
  dicaDeUso: 'Haz clic en una celda, en un campo del formulario o en una fila del resumen para abrir la ficha.',
  baixarRelatorio: 'Descargar informe (.xlsx)',
  gerandoRelatorio: 'Generando',
  relatorioPronto: 'Informe descargado',
  relatorioNome: 'estandar-de-campos',
  colunasDoRelatorio: [
    'Tipo',
    'Etiqueta',
    'Familia',
    'Disponibilidad',
    'Celda',
    'Formulario',
    'Crudo',
    'Formato de entrada',
    'Formato de salida',
    'Salida formateada',
    'Claves de cFormat',
    'Claves de config',
    'Alineación',
    'Ancho mínimo',
    'Valor de ejemplo',
  ],

  carregando: 'Cargando los registros',
  semItensTitulo: 'Todavía no hay registros',
  semItensTexto: 'Esta categoría tiene campos configurados y ningún registro. Crea el primero para ver la tabla de pie.',
  semItensAcao: 'Crear el primer registro',
  erroTitulo: 'No se pudieron cargar los registros',
  erroTexto: 'La lista sigue ahí. Solo hay que intentar de nuevo.',
  erroAcao: 'Intentar de nuevo',
  semPermissaoTitulo: 'No tienes acceso a esta categoría',
  semPermissaoTexto: 'Pide acceso a quien administra el workspace. No se perdió nada.',

  campos: {
    inputText: {
      rotulo: 'Texto corto',
      descricao: 'Una línea de texto. Es el campo de uso general de la categoría.',
      celula: 'Una línea, a la izquierda, con puntos suspensivos cuando no cabe. El texto completo va en el tooltip.',
      formulario: 'Campo de una línea, con contador de caracteres cuando hay límite.',
      cru: 'El texto en una línea. Sin valor, muestra la marca de vacío.',
    },
    EnTextArea: {
      rotulo: 'Texto largo',
      descricao: 'Para descripciones, comentarios o notas extensas. Acepta varias líneas.',
      celula: 'Solo la primera línea, con puntos suspensivos. El resto queda en el tooltip y en el panel.',
      formulario: 'Caja de tres líneas que crece hasta seis. Ocupa la fila entera.',
      cru: 'Hasta tres líneas, con "ver más" cuando sobra texto.',
    },
    EnHtml: {
      rotulo: 'Editor de texto HTML',
      descricao: 'Texto con formato: negrita, listas, enlaces y títulos.',
      celula: 'El texto sin etiquetas, en una línea. El formato dentro de la celda le roba la lectura a la columna.',
      formulario: 'Editor con barra de formato, en la fila entera.',
      cru: 'El texto ya formateado, cortado en tres líneas, con "ver más".',
    },
    EnNotes: {
      rotulo: 'Notas',
      descricao: 'Conversación unida al elemento, con historial y compositor de mensaje.',
      celula: 'La última nota y el total, con puntos suspensivos cuando no cabe.',
      formulario: 'Panel de conversación con el historial y el compositor abajo. En el producto ocupa 759 px.',
      cru: 'Queda solo en la columna de campos: una conversación no cabe en un resumen.',
    },
    EnlMask: {
      rotulo: 'Texto con máscara',
      descricao: 'Texto que sigue un formato fijo, como un documento o un teléfono.',
      celula: 'El valor ya enmascarado, en cifras tabulares para que los dígitos se alineen entre filas.',
      formulario: 'Campo que aplica la máscara mientras se escribe.',
      cru: 'El valor enmascarado, con el botón de copiar al pasar el cursor.',
    },
    email: {
      rotulo: 'Correo electrónico',
      descricao: 'Dirección de correo, con validación de formato.',
      celula: 'La dirección como enlace, con puntos suspensivos cuando no cabe.',
      formulario: 'Campo de correo, validando al salir.',
      cru: 'La dirección como enlace, con el botón de copiar al pasar el cursor.',
    },
    EnCustomCode: {
      rotulo: 'Código generado',
      descricao: 'Identificador armado por una expresión y rellenado por el sistema.',
      celula: 'El código en cifras tabulares, con el botón de copiar al pasar el cursor.',
      formulario: 'Solo lectura, explicando que el valor nace al guardar.',
      cru: 'El código, con el botón de copiar.',
    },
    EnlNumber: {
      rotulo: 'Número',
      descricao: 'Valor numérico, entero o con decimales.',
      celula: 'A la derecha, en cifras tabulares, ya formateado por cFormat.',
      formulario: 'Campo alineado a la derecha, con botones de sumar y restar cuando config.buttons está activo.',
      cru: 'El número formateado, a la izquierda, junto a la etiqueta.',
    },
    EnCurrency: {
      rotulo: 'Moneda',
      descricao: 'Valor monetario, con símbolo y decimales fijos.',
      celula: 'A la derecha, con el símbolo antes del número y los decimales siempre presentes.',
      formulario: 'Símbolo fijo a la izquierda del campo, para que nadie lo escriba.',
      cru: 'El valor con símbolo, en cifras tabulares.',
    },
    EnlDropdown: {
      rotulo: 'Lista de selección única',
      descricao: 'Menú desplegable con varias opciones y una sola elección.',
      celula: 'Una etiqueta con el color de la opción. Sin elección, la marca de vacío.',
      formulario: 'Lista desplegable, con búsqueda a partir de diez opciones.',
      cru: 'La misma etiqueta de la celda, sin cambiar de color ni de forma.',
    },
    radioButton: {
      rotulo: 'Botones de selección única',
      descricao: 'Todas las opciones a la vista, una sola elección.',
      celula: 'Una etiqueta, igual que la de la lista única. La celda no muestra el formato de elección.',
      formulario: 'Todas las opciones visibles, una por línea, hasta cinco. Por encima de eso pasa a lista.',
      cru: 'Una etiqueta.',
    },
    multiSelect: {
      rotulo: 'Lista de selección múltiple',
      descricao: 'Menú con varias opciones y más de una elección.',
      celula: 'Dos etiquetas y un contador con lo que sobra. El contador abre la lista al pasar el cursor.',
      formulario: 'Selector múltiple con búsqueda. Lo elegido pasa a etiqueta dentro del propio campo.',
      cru: 'Las etiquetas en hasta dos líneas, con "ver más".',
    },
    checkbox: {
      rotulo: 'Casillas de selección',
      descricao: 'Lista de casillas, ninguna, una o varias marcadas.',
      celula: 'Las etiquetas marcadas pasan a ser etiquetas: dos y el contador.',
      formulario: 'Una casilla por opción, en la fila entera. Una etiqueta larga ocupa varias líneas.',
      cru: 'Las etiquetas marcadas, una por línea, con la marca de verificado.',
    },
    EnlCheckbox: {
      rotulo: 'Casillas de selección (antiguo)',
      descricao: 'La versión anterior de las casillas, todavía presente en datos guardados.',
      celula: 'Igual que checkbox: dos etiquetas y el contador.',
      formulario: 'Igual que checkbox. La pantalla no los distingue.',
      cru: 'Igual que checkbox.',
    },
    inputSwitch: {
      rotulo: 'Alternativa binaria',
      descricao: 'Encendido o apagado. Guarda verdadero o falso.',
      celula: 'Sí o No como texto, con un punto de color. Un interruptor en la celda promete una edición que la celda no hace.',
      formulario: 'Hoy el producto usa una casilla. La propuesta es el interruptor, que dice mejor que el estado alterna.',
      cru: 'Sí o No, con el punto de color.',
    },
    EnlChips: {
      rotulo: 'Etiquetas',
      descricao: 'Varios valores libres, cada uno convertido en etiqueta.',
      celula: 'Tres etiquetas y el contador de lo que sobra.',
      formulario: 'Campo que convierte lo escrito en etiqueta con cada Enter.',
      cru: 'Las etiquetas, saltando a las líneas que hagan falta.',
    },
    EnlCalendar: {
      rotulo: 'Fecha (calendario)',
      descricao: 'Fecha, con hora o sin ella, para plazos y agendamientos.',
      celula: 'La fecha corta, en cifras tabulares. Una fecha vencida se pone en rojo.',
      formulario: 'Campo con calendario. Lo escrito acepta el formato del idioma elegido.',
      cru: 'La fecha corta en letras, con la relativa al lado cuando cae en los próximos siete días.',
    },
    EnlTimeRange: {
      rotulo: 'Intervalo de horas',
      descricao: 'Hora de inicio y hora de fin, en el mismo campo.',
      celula: 'Las dos puntas en la misma línea, en cifras tabulares.',
      formulario: 'Dos selectores de hora lado a lado, con el fin validado contra el inicio.',
      cru: 'Las dos puntas, con la duración calculada al lado.',
    },
    EnRel: {
      rotulo: 'Relación simple',
      descricao: 'Une este elemento a un elemento de otra categoría.',
      celula: 'Una etiqueta clicable con el display. Un display vacío cae a la referencia, nunca a nada.',
      formulario: 'Búsqueda por display, con botón de crear cuando la categoría lo permite.',
      cru: 'La etiqueta, que abre el elemento relacionado en el propio panel.',
    },
    EnRelMulti: {
      rotulo: 'Relación múltiple',
      descricao: 'Une este elemento a varios elementos de otra categoría.',
      celula: 'Dos etiquetas y el contador.',
      formulario: 'Búsqueda múltiple. Los elegidos pasan a etiquetas justo debajo del campo.',
      cru: 'Las etiquetas, con "ver más" por encima de cinco.',
    },
    EnTreeSelect: {
      rotulo: 'Selección en árbol',
      descricao: 'Elección dentro de una jerarquía de opciones.',
      celula: 'Solo la hoja elegida, como etiqueta. La ruta completa va en el tooltip.',
      formulario: 'Árbol que se abre por nivel, con una búsqueda que aplana los resultados.',
      cru: 'La ruta completa, del padre hasta la hoja.',
    },
    EnPerson: {
      rotulo: 'Persona/Empresa',
      descricao: 'Registro de persona o empresa, con los subcampos que elija la categoría.',
      celula: 'Avatar con las iniciales y el nombre al lado.',
      formulario: 'Bloque con los subcampos de personConfig, en la fila entera.',
      cru: 'Avatar y nombre, con el correo en una segunda línea más pequeña.',
    },
    EnAddress: {
      rotulo: 'Dirección',
      descricao: 'Dirección completa, con los subcampos del país configurado.',
      celula: 'Una sola línea, armada por displayString, con puntos suspensivos.',
      formulario: 'Cuadrícula de subcampos, con el código postal primero y el resto rellenando a partir de él.',
      cru: 'Dos líneas: la calle arriba, la ciudad y el estado abajo.',
    },
    uploadFile: {
      rotulo: 'Archivo',
      descricao: 'Adjunto de cualquier formato.',
      celula: 'Etiqueta con el icono del formato y el nombre del archivo.',
      formulario: 'Zona para soltar el archivo, con el límite de tamaño escrito antes de intentarlo.',
      cru: 'Nombre, tamaño y el botón de descargar.',
    },
    uploadImage: {
      rotulo: 'Imagen',
      descricao: 'Adjunto de imagen, con vista previa.',
      celula: 'Miniatura cuadrada de 20 píxeles y el nombre al lado.',
      formulario: 'Zona para soltar con la vista previa apareciendo apenas entra el archivo.',
      cru: 'Miniatura más grande, que abre la imagen entera al hacer clic.',
    },
    EnPDF: {
      rotulo: 'Tratamiento de PDF',
      descricao: 'PDF con opción de sello y estampa.',
      celula: 'Etiqueta de PDF con el nombre del archivo.',
      formulario: 'Zona para soltar, más el aviso del sello cuando hasSeal está activo.',
      cru: 'Nombre, tamaño y la marca del sello cuando existe.',
    },
    EnOnlyoffice: {
      rotulo: 'Editor de documentos',
      descricao: 'Documento editable dentro de ENSPACE.',
      celula: 'Etiqueta de documento con el nombre del archivo.',
      formulario: 'Elección de la plantilla. El editor solo abre cuando el elemento ya existe.',
      cru: 'Queda solo en la columna de campos: el editor necesita ancho para ser útil.',
    },
    EnESign: {
      rotulo: 'Firma electrónica',
      descricao: 'Firma dibujada o escrita, con registro de quién y cuándo.',
      celula: 'Quién firmó, con la marca de firmado. Sin firma, la marca de vacío.',
      formulario: 'Zona para firmar, avisando que la firma se registra con fecha y hora.',
      cru: 'Quién firmó y cuándo, con la miniatura de la firma.',
    },
    EnRepeater: {
      rotulo: 'Repetidor',
      descricao: 'Varias filas con la misma estructura, dentro del mismo elemento.',
      celula: 'La primera fila, armada por displayString, y el contador del total.',
      formulario: 'Tabla de filas con botón de agregar, en la fila entera.',
      cru: 'Queda solo en la columna de campos: el repetidor es una tabla, y una tabla no cabe en un resumen.',
    },
    group: {
      rotulo: 'Grupo',
      descricao: 'Varios campos reunidos bajo un título y guardados juntos.',
      celula: 'El subcampo elegido por displayString, y nada más.',
      formulario: 'Bloque con borde y título, con los campos hijos dentro.',
      cru: 'Los subcampos uno por línea, con sangría bajo el nombre del grupo.',
    },
    EnChats: {
      rotulo: 'Chat',
      descricao: 'Conversación unida al elemento, mensaje a mensaje.',
      celula: 'El último mensaje y el total, con la marca de no leído cuando la haya.',
      formulario: 'No entra en la creación: la conversación solo empieza cuando el elemento existe.',
      cru: 'Queda solo en la columna de campos.',
    },
    duracao: {
      rotulo: 'Duración',
      descricao: 'Una duración escrita en lenguaje natural: 1 día, 2 semanas, 30 min.',
      celula: 'La duración tal como el producto la guardó, en una línea.',
      formulario: 'Campo de texto, con los ejemplos del producto en el placeholder.',
      cru: 'La duración en una línea.',
    },
    valorDinamico: {
      rotulo: 'Valor dinámico',
      descricao: 'Valor calculado por una expresión y rellenado por el sistema.',
      celula: 'El resultado formateado, con el icono de calculado delante.',
      formulario: 'Solo lectura, con la expresión visible en el texto de ayuda.',
      cru: 'El resultado, con el icono de calculado.',
    },
  },
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': ptBR, en, es }
