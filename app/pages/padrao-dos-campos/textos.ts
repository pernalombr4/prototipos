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
  /** A barra flutuante da seleção em massa, no formato do ClickUp. */
  selecao: {
    selecionados: (n: number) => string
    limpar: string
    lixeira: string
    confirmarTitulo: string
    confirmarTexto: (n: number) => string
    linksCopiados: (n: number) => string
  }
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
  alinhamentoCentro: string
  larguraMinima: string
  nenhumaChave: string
  configuracoesDoTipo: string
  configuracoesOnde: string
  semConfiguracaoPropria: string

  /* ------------------------ como o valor se salva ------------------------ */
  comoSalva: string
  comoSalvaTextos: Record<string, string>

  /* --------------------------- anexos e conversa ------------------------- */
  anexos: string
  adicionarAnexo: string
  renomear: string
  mover: string
  subir: string
  descer: string
  remover: string
  nenhumAnexo: string
  criarNaLinha: string
  criarAbaixo: string
  abrirRegistro: string
  pessoaTipo: string
  pessoaSelecione: string
  pessoaFisica: string
  pessoaJuridica: string
  pessoaNome: string
  pessoaCpf: string
  pessoaCnpj: string
  pessoaRazaoSocial: string
  pessoaNomeFantasia: string
  pessoaConsultando: string
  pessoaDocumentoInvalido: string
  pessoaVeioDaConsulta: string
  totalDaColuna: string
  totalPorMoeda: string
  comentarioEnviado: string
  opcoesDoCampo: string
  renomearOpcao: string
  renomearOpcaoAviso: (quantos: number) => string
  podeConfigurar: string
  hoje: string
  amanha: string
  proximaSemana: string
  duasSemanas: string
  quatroSemanas: string
  criarOpcao: string
  moverParaCima: string
  moverParaBaixo: string
  arrasteParaReordenar: string
  limparCampo: string
  /**
   * O quadro do "i" do valor monetário, copiado do ENSPACE em 24/09/2026.
   * Os textos da legenda são do produto, palavra por palavra, e por isso o
   * português é a fonte: o inglês e o espanhol são tradução nossa.
   */
  correcao: {
    detalhes: string
    valorInicial: string
    acumuladas: string
    valorAtual: string
    mostrarLegenda: string
    periodos: string
    semFim: string
    desde: string
    ate: string
    legenda: {
      vigencia: {
        titulo: string
        entradas: {
          ativo: { rotulo: string, texto: string }
          inativo: { rotulo: string, texto: string }
          naoVinculado: { rotulo: string, texto: string }
        }
      }
      status: {
        titulo: string
        entradas: {
          bemSucedida: { rotulo: string, texto: string }
          erroFatal: { rotulo: string, texto: string }
          pendente: { rotulo: string, texto: string }
          falhaTemporaria: { rotulo: string, texto: string }
        }
      }
    }
  }
  /* O popover de link do editor de texto rico. */
  linkInserir: string
  linkEndereco: string
  linkTexto: string
  linkTextoVazio: string
  linkAplicar: string
  linkAbrir: string
  linkRemover: string
  /** O andaime devolve as colunas ao tamanho do catálogo. */
  largurasOriginais: string
  /* Matriz de dados e ID personalizado, os dois tipos medidos na rodada 15. */
  matrizSemResposta: string
  idGeradoPeloSistema: string
  idComposicao: string
  enterCria: string
  semResultado: string
  umaTagPorEnter: string
  fechar: string
  composerPlaceholder: string
  comentario: string
  anexar: string
  mencionar: string
  pessoas: string
  acoesDeIa: string
  gravarVideo: string
  gravarAudio: string
  enviarMensagem: string
  semMensagens: string
  criarRegistro: string
  buscarOpcao: string

  /* --------------------------- correção monetária ------------------------ */
  correcaoMonetaria: string
  configurarCorrecao: string
  indiceOuAliquota: string
  dataInicial: string
  dataFinal: string
  selecioneIndice: string
  multiplosPeriodos: string
  enviar: string
  valorCorrigido: string

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
  selecao: {
    selecionados: n => (n === 1 ? 'registro selecionado' : 'registros selecionados'),
    limpar: 'Sair da seleção',
    lixeira: 'Lixeira',
    confirmarTitulo: 'Enviar para a lixeira',
    confirmarTexto: n => (n === 1
      ? 'O registro vai para a lixeira e sai da lista. Dá para restaurar de lá.'
      : `Os ${n} registros vão para a lixeira e saem da lista. Dá para restaurar de lá.`),
    linksCopiados: n => (n === 1 ? 'Link copiado.' : `${n} links copiados.`),
  },
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
  alinhamentoCentro: 'Centro',
  larguraMinima: 'Largura mínima da coluna',
  nenhumaChave: 'Nenhuma',
  comoSalva: 'Como salva',
  comoSalvaTextos: {
    imediato: 'Escolher já salva. Não há o que confirmar.',
    enterOuSair: 'Enter salva. Sair do campo salva. Esc desfaz.',
    aoFechar: 'Fechar o seletor salva. Esc desfaz.',
    confirmar: 'Só o botão Confirmar salva. Esc ou sair daqui descarta.',
    naoSeAplica: 'O sistema preenche. Não há o que salvar.',
  },
  anexos: 'Anexos',
  adicionarAnexo: 'Adicionar arquivo',
  renomear: 'Renomear',
  mover: 'Mover',
  subir: 'Subir',
  descer: 'Descer',
  remover: 'Remover',
  nenhumAnexo: 'Nenhum arquivo ainda.',
  criarNaLinha: 'Criar registro aqui',
  criarAbaixo: 'Criar registro abaixo',
  abrirRegistro: 'Abrir o registro',
  pessoaTipo: 'Tipo',
  pessoaSelecione: 'Por favor, selecione',
  pessoaFisica: 'Pessoa Física',
  pessoaJuridica: 'Pessoa Jurídica',
  pessoaNome: 'Nome',
  pessoaCpf: 'CPF',
  pessoaCnpj: 'CNPJ',
  pessoaRazaoSocial: 'Razão Social',
  pessoaNomeFantasia: 'Nome Fantasia',
  pessoaConsultando: 'Consultando o documento',
  pessoaDocumentoInvalido: 'Documento inválido',
  pessoaVeioDaConsulta: 'Preenchido pela consulta ao documento',
  totalDaColuna: 'Total da coluna',
  totalPorMoeda: 'Moedas diferentes nunca somam juntas. O total sai por moeda.',
  comentarioEnviado: 'Comentário enviado para a conversa do item',
  opcoesDoCampo: 'Opções do campo',
  renomearOpcao: 'Renomear a opção',
  renomearOpcaoAviso: (quantos: number) => `Muda o rótulo em ${quantos} registros.`,
  podeConfigurar: 'Configurar campos',
  hoje: 'Hoje',
  amanha: 'Amanhã',
  proximaSemana: 'Semana que vem',
  duasSemanas: '2 semanas',
  quatroSemanas: '4 semanas',
  criarOpcao: 'Criar a opção',
  moverParaCima: 'Mover para cima',
  moverParaBaixo: 'Mover para baixo',
  arrasteParaReordenar: 'Arraste para reordenar',
  limparCampo: 'Limpar o campo',
  correcao: {
    detalhes: 'Detalhes da correção monetária',
    valorInicial: 'Valor inicial',
    acumuladas: 'Correções acumuladas',
    valorAtual: 'Valor atual',
    mostrarLegenda: 'Mostrar Legenda',
    periodos: 'Períodos',
    semFim: 'sem data final',
    desde: 'desde',
    ate: 'até',
    legenda: {
      vigencia: {
        titulo: 'Vigência do Período',
        entradas: {
          ativo: {
            rotulo: 'Ativo',
            texto: 'Período não possui data final ou data final é futura. Está apto a receber correções recorrentes.',
          },
          inativo: {
            rotulo: 'Inativo',
            texto: 'Período possui data final no passado. Já deve estar corrigido.',
          },
          naoVinculado: {
            rotulo: 'Não Vinculado',
            texto: 'Período salvo apenas no campo. Não está vinculado a uma correção monetária. (id ausente)',
          },
        },
      },
      status: {
        titulo: 'Status da Correção',
        entradas: {
          bemSucedida: {
            rotulo: 'Bem-sucedida',
            texto: 'A correção do período foi bem sucedida e seu valor atualizado computado no valor final.',
          },
          erroFatal: {
            rotulo: 'Erro fatal',
            texto: 'Ocorreu um erro não identificado ao processar a correção para o período.',
          },
          pendente: {
            rotulo: 'Pendente',
            texto: 'Aguardando correção recorrente quando houver publicação do Índice.',
          },
          falhaTemporaria: {
            rotulo: 'Falha temporária',
            texto: 'Houve uma falha temporária ao obter o fator de correção para o Índice do Período. Ele deverá ser processado em breve, pois não está mais vigente.',
          },
        },
      },
    },
  },
  linkInserir: 'Inserir link',
  linkEndereco: 'Endereço',
  linkTexto: 'Texto do link',
  linkTextoVazio: 'o próprio endereço',
  linkAplicar: 'Aplicar',
  linkAbrir: 'Abrir em nova aba',
  linkRemover: 'Remover o link',
  largurasOriginais: 'Larguras originais',
  matrizSemResposta: 'Sem resposta',
  idGeradoPeloSistema: 'O sistema gera este identificador ao salvar.',
  idComposicao: 'Composição',
  enterCria: 'Enter cria o registro. Esc descarta.',
  semResultado: 'Nada encontrado',
  umaTagPorEnter: 'Digite e aperte Enter para cada tag',
  fechar: 'Fechar',
  composerPlaceholder: 'Comente ou digite "/" para acionar comandos e ações da IA',
  comentario: 'Comentário',
  anexar: 'Anexar',
  mencionar: 'Mencionar alguém',
  pessoas: 'Pessoas',
  acoesDeIa: 'Ações da IA',
  gravarVideo: 'Gravar vídeo',
  gravarAudio: 'Gravar áudio',
  enviarMensagem: 'Enviar',
  semMensagens: 'Nenhuma mensagem ainda.',
  criarRegistro: 'Criar registro',
  buscarOpcao: 'Buscar opção',
  correcaoMonetaria: 'Correção monetária',
  configurarCorrecao: 'Configurar correção monetária',
  indiceOuAliquota: 'Índice ou alíquota',
  dataInicial: 'Data inicial',
  dataFinal: 'Data final',
  selecioneIndice: 'Selecione um índice antes de definir as datas.',
  multiplosPeriodos: 'Múltiplos períodos',
  enviar: 'Enviar',
  valorCorrigido: 'Valor corrigido. O original está guardado em originalValue.',
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
      rotulo: 'Valor Monetário',
      descricao: 'Valor com moeda escolhida no preenchimento, entre as 179 do produto.',
      celula: 'À direita, com o símbolo da moeda gravada no valor. Valor corrigido ganha a marca de correção.',
      formulario: 'Seletor de moeda com busca, mais o campo de valor com a máscara da moeda escolhida. Com correção ligada, entra o botão da calculadora.',
      cru: 'O valor formatado e, quando houve correção, o valor original riscado ao lado.',
    },
    EnlDropdown: {
      rotulo: 'Lista de Seleção Única',
      descricao: 'Menu suspenso com várias opções, uma escolha só.',
      celula: 'Um selo colorido que ocupa quase a largura da coluna, com o chevron à direita. É o destaque que o status precisa ter.',
      formulario: 'Lista suspensa com busca, e o selo colorido dentro do controle.',
      cru: 'O mesmo selo, na largura do resumo.',
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
      celula: 'Os selos escolhidos, um do lado do outro, e o contador do que não caber.',
      formulario: 'Os escolhidos viram selos com x dentro do campo, e a lista de opções fica aberta abaixo com busca. Vai concatenando conforme cresce.',
      cru: 'Os selos, quebrando em linha.',
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
      celula: 'Uma caixa, vazia ou marcada. Clicar alterna na hora. É o que Notion, Airtable, ClickUp e Monday fazem.',
      formulario: 'Só o controle, sem rótulo ao lado: o rótulo do campo já está acima.',
      cru: 'A mesma caixa da célula.',
    },
    EnlChips: {
      rotulo: 'Tags',
      descricao: 'Vários valores livres, cada um virando uma tag.',
      celula: 'Três tags e o contador do que sobrou.',
      formulario: 'Igual à seleção múltipla, mas sem lista: cada Enter cria uma tag nova, uma por digitação.',
      cru: 'As tags, quebrando em quantas linhas precisar.',
    },
    EnlCalendar: {
      rotulo: 'Data (Calendário)',
      descricao: 'Data, com ou sem hora, para prazos e agendamentos.',
      celula: 'A data curta, em fonte tabular. Data vencida fica em vermelho.',
      formulario: 'Campo com calendário. A digitação aceita o formato do idioma escolhido.',
      cru: 'A data por extenso curta, com o relativo ao lado quando cai nos próximos sete dias.',
    },
    EnRel: {
      rotulo: 'Relacionamento Simples',
      descricao: 'Liga este item a um item de outra categoria.',
      celula: 'Um selo clicável com o display. Display vazio cai para a referência, nunca para nada.',
      formulario: 'Seletor com busca no topo e, no PÉ da lista, o atalho de criar registro. O atalho não fica solto ao lado do campo.',
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
      descricao: 'Cadastro de pessoa ou empresa. O tipo decide os subcampos, e o documento é consultado.',
      celula: 'Nome de exibição, com o selo PF ou PJ e o documento mascarado.',
      formulario: 'Bloco que começa no Tipo e revela os subcampos daquele tipo.',
      cru: 'Nome, documento e razão social, uma por linha.',
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
    matrizDeDados: {
      rotulo: 'Matriz de dados',
      descricao: 'Uma pergunta por linha, uma resposta por coluna. Cada linha aceita uma resposta só.',
      celula: 'A primeira resposta, com contador das outras. O valor inteiro abre no quadro.',
      formulario: 'A grade inteira, com o rótulo complementar de título e o rótulo da coluna no cabeçalho.',
      cru: 'Uma linha por pergunta respondida, no formato pergunta: resposta.',
    },
    idPersonalizado: {
      rotulo: 'ID personalizado',
      descricao: 'Identificador que o sistema compõe de texto fixo, data, campo e contador.',
      celula: 'O identificador em fonte monoespaçada. A célula não entra em edição.',
      formulario: 'Só leitura, com a composição visível em texto de ajuda.',
      cru: 'O identificador, com o ícone de gerado pelo sistema.',
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
  selecao: {
    selecionados: n => (n === 1 ? 'record selected' : 'records selected'),
    limpar: 'Leave selection',
    lixeira: 'Trash',
    confirmarTitulo: 'Move to trash',
    confirmarTexto: n => (n === 1
      ? 'The record goes to the trash and leaves the list. It can be restored from there.'
      : `The ${n} records go to the trash and leave the list. They can be restored from there.`),
    linksCopiados: n => (n === 1 ? 'Link copied.' : `${n} links copied.`),
  },
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
  alinhamentoCentro: 'Center',
  larguraMinima: 'Minimum column width',
  nenhumaChave: 'None',
  comoSalva: 'How it saves',
  comoSalvaTextos: {
    imediato: 'Picking saves right away. Nothing to confirm.',
    enterOuSair: 'Enter saves. Leaving the field saves. Esc undoes.',
    aoFechar: 'Closing the picker saves. Esc undoes.',
    confirmar: 'Only the Confirm button saves. Esc or leaving discards.',
    naoSeAplica: 'The system fills it in. Nothing to save.',
  },
  anexos: 'Attachments',
  adicionarAnexo: 'Add file',
  renomear: 'Rename',
  mover: 'Move',
  subir: 'Move up',
  descer: 'Move down',
  remover: 'Remove',
  nenhumAnexo: 'No files yet.',
  criarNaLinha: 'Create a record here',
  criarAbaixo: 'Create a record below',
  abrirRegistro: 'Open record',
  pessoaTipo: 'Type',
  pessoaSelecione: 'Please select',
  pessoaFisica: 'Individual',
  pessoaJuridica: 'Company',
  pessoaNome: 'Name',
  pessoaCpf: 'CPF',
  pessoaCnpj: 'CNPJ',
  pessoaRazaoSocial: 'Legal name',
  pessoaNomeFantasia: 'Trade name',
  pessoaConsultando: 'Looking up the document',
  pessoaDocumentoInvalido: 'Invalid document',
  pessoaVeioDaConsulta: 'Filled in by the document lookup',
  totalDaColuna: 'Column total',
  totalPorMoeda: 'Different currencies never add up together. The total comes per currency.',
  comentarioEnviado: 'Comment sent to the item conversation',
  opcoesDoCampo: 'Field options',
  renomearOpcao: 'Rename option',
  renomearOpcaoAviso: (quantos: number) => `Changes the label in ${quantos} records.`,
  podeConfigurar: 'Configure fields',
  hoje: 'Today',
  amanha: 'Tomorrow',
  proximaSemana: 'Next week',
  duasSemanas: '2 weeks',
  quatroSemanas: '4 weeks',
  criarOpcao: 'Create option',
  moverParaCima: 'Move up',
  moverParaBaixo: 'Move down',
  arrasteParaReordenar: 'Drag to reorder',
  limparCampo: 'Clear the field',
  correcao: {
    detalhes: 'Monetary correction details',
    valorInicial: 'Initial value',
    acumuladas: 'Accumulated corrections',
    valorAtual: 'Current value',
    mostrarLegenda: 'Show legend',
    periodos: 'Periods',
    semFim: 'no end date',
    desde: 'since',
    ate: 'to',
    legenda: {
      vigencia: {
        titulo: 'Period validity',
        entradas: {
          ativo: {
            rotulo: 'Active',
            texto: 'The period has no end date, or its end date is in the future. It can still receive recurring corrections.',
          },
          inativo: {
            rotulo: 'Inactive',
            texto: 'The period has an end date in the past. It should already be corrected.',
          },
          naoVinculado: {
            rotulo: 'Not linked',
            texto: 'The period is saved on the field only. It is not linked to a monetary correction. (missing id)',
          },
        },
      },
      status: {
        titulo: 'Correction status',
        entradas: {
          bemSucedida: {
            rotulo: 'Successful',
            texto: 'The correction for the period succeeded and its updated value is included in the final value.',
          },
          erroFatal: {
            rotulo: 'Fatal error',
            texto: 'An unidentified error happened while processing the correction for the period.',
          },
          pendente: {
            rotulo: 'Pending',
            texto: 'Waiting for the recurring correction once the index is published.',
          },
          falhaTemporaria: {
            rotulo: 'Temporary failure',
            texto: 'Getting the correction factor for the period index failed temporarily. It should be processed soon, since the period is no longer current.',
          },
        },
      },
    },
  },
  linkInserir: 'Insert link',
  linkEndereco: 'Address',
  linkTexto: 'Link text',
  linkTextoVazio: 'the address itself',
  linkAplicar: 'Apply',
  linkAbrir: 'Open in a new tab',
  linkRemover: 'Remove the link',
  largurasOriginais: 'Original widths',
  matrizSemResposta: 'Not answered',
  idGeradoPeloSistema: 'The system generates this identifier when you save.',
  idComposicao: 'Composition',
  enterCria: 'Enter creates the record. Esc discards.',
  semResultado: 'Nothing found',
  umaTagPorEnter: 'Type and press Enter for each tag',
  fechar: 'Close',
  composerPlaceholder: 'Comment or type "/" for commands and AI actions',
  comentario: 'Comment',
  anexar: 'Attach',
  mencionar: 'Mention someone',
  pessoas: 'People',
  acoesDeIa: 'AI actions',
  gravarVideo: 'Record video',
  gravarAudio: 'Record audio',
  enviarMensagem: 'Send',
  semMensagens: 'No messages yet.',
  criarRegistro: 'Create record',
  buscarOpcao: 'Search option',
  correcaoMonetaria: 'Monetary correction',
  configurarCorrecao: 'Set up monetary correction',
  indiceOuAliquota: 'Index or rate',
  dataInicial: 'Start date',
  dataFinal: 'End date',
  selecioneIndice: 'Pick an index before setting the dates.',
  multiplosPeriodos: 'Multiple periods',
  enviar: 'Submit',
  valorCorrigido: 'Corrected value. The original is kept in originalValue.',
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
      rotulo: 'Monetary Value',
      descricao: 'A value whose currency is picked on fill, out of the 179 the product offers.',
      celula: 'Right aligned, with the symbol of the currency stored in the value. A corrected value gets the correction mark.',
      formulario: 'Currency picker with search, plus the value input masked by the chosen currency. With correction on, the calculator button appears.',
      cru: 'The formatted value and, when there was a correction, the original struck through beside it.',
    },
    EnlDropdown: {
      rotulo: 'Single Select List',
      descricao: 'Dropdown with several options and a single choice.',
      celula: 'A colored pill taking almost the column width, with the chevron on the right. That is the weight a status needs.',
      formulario: 'Dropdown with search, and the colored pill inside the control.',
      cru: 'The same pill, at the summary width.',
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
      celula: 'The chosen tags side by side, and a counter for what does not fit.',
      formulario: 'The chosen ones become tags with an x inside the field, and the option list stays open below with search. It concatenates as it grows.',
      cru: 'The tags, wrapping over lines.',
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
      celula: 'A box, empty or checked. Clicking toggles right away. It is what Notion, Airtable, ClickUp and Monday do.',
      formulario: 'Just the control, with no label beside it: the field label is already above.',
      cru: 'The same box as the cell.',
    },
    EnlChips: {
      rotulo: 'Tags',
      descricao: 'Several free values, each one becoming a tag.',
      celula: 'Three tags and a counter for what is left.',
      formulario: 'Like multi select, but with no list: each Enter creates a new tag, one per typing.',
      cru: 'The tags, wrapping over as many lines as needed.',
    },
    EnlCalendar: {
      rotulo: 'Date (Calendar)',
      descricao: 'Date, with or without time, for deadlines and scheduling.',
      celula: 'The short date, in tabular figures. An overdue date turns red.',
      formulario: 'Input with a calendar. Typing accepts the format of the chosen language.',
      cru: 'The short written date, with the relative one beside it within the next seven days.',
    },
    EnRel: {
      rotulo: 'Single Relation',
      descricao: 'Links this item to one item of another category.',
      celula: 'A clickable tag with the display. An empty display falls back to the reference, never to nothing.',
      formulario: 'Picker with search on top and, at the BOTTOM of the list, the create-record shortcut. The shortcut does not sit loose beside the field.',
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
      descricao: 'A person or company record. The type decides the sub fields, and the document is looked up.',
      celula: 'Display name, with the PF or PJ tag and the masked document.',
      formulario: 'A block that starts at Type and reveals the sub fields of that type.',
      cru: 'Name, document and legal name, one per line.',
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
    matrizDeDados: {
      rotulo: 'Data matrix',
      descricao: 'One question per row, one answer per column. Each row takes a single answer.',
      celula: 'The first answer plus a counter for the rest. The full value opens in the editor.',
      formulario: 'The whole grid, with the complementary label as its title and the column label in the header.',
      cru: 'One line per answered question, as question: answer.',
    },
    idPersonalizado: {
      rotulo: 'Custom ID',
      descricao: 'Identifier the system composes from fixed text, date, field and counter.',
      celula: 'The identifier in a monospaced font. The cell never enters edit mode.',
      formulario: 'Read only, with the composition shown as help text.',
      cru: 'The identifier, with the system generated icon.',
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
  selecao: {
    selecionados: n => (n === 1 ? 'registro seleccionado' : 'registros seleccionados'),
    limpar: 'Salir de la selección',
    lixeira: 'Papelera',
    confirmarTitulo: 'Enviar a la papelera',
    confirmarTexto: n => (n === 1
      ? 'El registro va a la papelera y sale de la lista. Se puede restaurar desde allí.'
      : `Los ${n} registros van a la papelera y salen de la lista. Se pueden restaurar desde allí.`),
    linksCopiados: n => (n === 1 ? 'Enlace copiado.' : `${n} enlaces copiados.`),
  },
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
  alinhamentoCentro: 'Centro',
  larguraMinima: 'Ancho mínimo de la columna',
  nenhumaChave: 'Ninguna',
  comoSalva: 'Cómo guarda',
  comoSalvaTextos: {
    imediato: 'Elegir ya guarda. No hay nada que confirmar.',
    enterOuSair: 'Enter guarda. Salir del campo guarda. Esc deshace.',
    aoFechar: 'Cerrar el selector guarda. Esc deshace.',
    confirmar: 'Solo el botón Confirmar guarda. Esc o salir descarta.',
    naoSeAplica: 'El sistema lo rellena. No hay nada que guardar.',
  },
  anexos: 'Adjuntos',
  adicionarAnexo: 'Agregar archivo',
  renomear: 'Renombrar',
  mover: 'Mover',
  subir: 'Subir',
  descer: 'Bajar',
  remover: 'Quitar',
  nenhumAnexo: 'Todavía no hay archivos.',
  criarNaLinha: 'Crear registro aquí',
  criarAbaixo: 'Crear registro abajo',
  abrirRegistro: 'Abrir el registro',
  pessoaTipo: 'Tipo',
  pessoaSelecione: 'Por favor, seleccione',
  pessoaFisica: 'Persona física',
  pessoaJuridica: 'Persona jurídica',
  pessoaNome: 'Nombre',
  pessoaCpf: 'CPF',
  pessoaCnpj: 'CNPJ',
  pessoaRazaoSocial: 'Razón social',
  pessoaNomeFantasia: 'Nombre comercial',
  pessoaConsultando: 'Consultando el documento',
  pessoaDocumentoInvalido: 'Documento no válido',
  pessoaVeioDaConsulta: 'Rellenado por la consulta al documento',
  totalDaColuna: 'Total de la columna',
  totalPorMoeda: 'Monedas distintas nunca se suman juntas. El total sale por moneda.',
  comentarioEnviado: 'Comentario enviado a la conversación del elemento',
  opcoesDoCampo: 'Opciones del campo',
  renomearOpcao: 'Renombrar la opción',
  renomearOpcaoAviso: (quantos: number) => `Cambia la etiqueta en ${quantos} registros.`,
  podeConfigurar: 'Configurar campos',
  hoje: 'Hoy',
  amanha: 'Mañana',
  proximaSemana: 'La próxima semana',
  duasSemanas: '2 semanas',
  quatroSemanas: '4 semanas',
  criarOpcao: 'Crear la opción',
  moverParaCima: 'Mover hacia arriba',
  moverParaBaixo: 'Mover hacia abajo',
  arrasteParaReordenar: 'Arrastre para reordenar',
  limparCampo: 'Limpiar el campo',
  correcao: {
    detalhes: 'Detalles de la corrección monetaria',
    valorInicial: 'Valor inicial',
    acumuladas: 'Correcciones acumuladas',
    valorAtual: 'Valor actual',
    mostrarLegenda: 'Mostrar leyenda',
    periodos: 'Períodos',
    semFim: 'sin fecha final',
    desde: 'desde',
    ate: 'hasta',
    legenda: {
      vigencia: {
        titulo: 'Vigencia del período',
        entradas: {
          ativo: {
            rotulo: 'Activo',
            texto: 'El período no tiene fecha final o su fecha final es futura. Todavía puede recibir correcciones recurrentes.',
          },
          inativo: {
            rotulo: 'Inactivo',
            texto: 'El período tiene fecha final en el pasado. Ya debería estar corregido.',
          },
          naoVinculado: {
            rotulo: 'No vinculado',
            texto: 'El período está guardado solo en el campo. No está vinculado a una corrección monetaria. (id ausente)',
          },
        },
      },
      status: {
        titulo: 'Estado de la corrección',
        entradas: {
          bemSucedida: {
            rotulo: 'Exitosa',
            texto: 'La corrección del período fue exitosa y su valor actualizado entra en el valor final.',
          },
          erroFatal: {
            rotulo: 'Error fatal',
            texto: 'Ocurrió un error no identificado al procesar la corrección del período.',
          },
          pendente: {
            rotulo: 'Pendiente',
            texto: 'Esperando la corrección recurrente cuando se publique el índice.',
          },
          falhaTemporaria: {
            rotulo: 'Falla temporal',
            texto: 'Hubo una falla temporal al obtener el factor de corrección del índice del período. Debería procesarse pronto, ya que el período no está vigente.',
          },
        },
      },
    },
  },
  linkInserir: 'Insertar enlace',
  linkEndereco: 'Dirección',
  linkTexto: 'Texto del enlace',
  linkTextoVazio: 'la dirección misma',
  linkAplicar: 'Aplicar',
  linkAbrir: 'Abrir en una pestaña nueva',
  linkRemover: 'Quitar el enlace',
  largurasOriginais: 'Anchos originales',
  matrizSemResposta: 'Sin respuesta',
  idGeradoPeloSistema: 'El sistema genera este identificador al guardar.',
  idComposicao: 'Composición',
  enterCria: 'Enter crea el registro. Esc descarta.',
  semResultado: 'Nada encontrado',
  umaTagPorEnter: 'Escriba y pulse Enter para cada etiqueta',
  fechar: 'Cerrar',
  composerPlaceholder: 'Comenta o escribe "/" para comandos y acciones de IA',
  comentario: 'Comentario',
  anexar: 'Adjuntar',
  mencionar: 'Mencionar a alguien',
  pessoas: 'Personas',
  acoesDeIa: 'Acciones de IA',
  gravarVideo: 'Grabar video',
  gravarAudio: 'Grabar audio',
  enviarMensagem: 'Enviar',
  semMensagens: 'Todavía no hay mensajes.',
  criarRegistro: 'Crear registro',
  buscarOpcao: 'Buscar opción',
  correcaoMonetaria: 'Corrección monetaria',
  configurarCorrecao: 'Configurar corrección monetaria',
  indiceOuAliquota: 'Índice o tasa',
  dataInicial: 'Fecha inicial',
  dataFinal: 'Fecha final',
  selecioneIndice: 'Elige un índice antes de definir las fechas.',
  multiplosPeriodos: 'Múltiples períodos',
  enviar: 'Enviar',
  valorCorrigido: 'Valor corregido. El original queda guardado en originalValue.',
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
      rotulo: 'Valor Monetario',
      descricao: 'Valor cuya moneda se elige al rellenar, entre las 179 del producto.',
      celula: 'A la derecha, con el símbolo de la moneda guardada en el valor. Un valor corregido lleva la marca de corrección.',
      formulario: 'Selector de moneda con búsqueda, más el campo de valor con la máscara de la moneda elegida. Con la corrección activa, aparece el botón de la calculadora.',
      cru: 'El valor formateado y, cuando hubo corrección, el valor original tachado al lado.',
    },
    EnlDropdown: {
      rotulo: 'Lista de selección única',
      descricao: 'Menú desplegable con varias opciones y una sola elección.',
      celula: 'Una píldora de color que ocupa casi el ancho de la columna, con el chevron a la derecha. Es el peso que un estado necesita.',
      formulario: 'Lista desplegable con búsqueda, y la píldora de color dentro del control.',
      cru: 'La misma píldora, al ancho del resumen.',
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
      celula: 'Las etiquetas elegidas, una al lado de la otra, y el contador de lo que no cabe.',
      formulario: 'Las elegidas pasan a etiquetas con x dentro del campo, y la lista de opciones queda abierta abajo con búsqueda. Va concatenando conforme crece.',
      cru: 'Las etiquetas, saltando de línea.',
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
      celula: 'Una casilla, vacía o marcada. Hacer clic alterna al instante. Es lo que hacen Notion, Airtable, ClickUp y Monday.',
      formulario: 'Solo el control, sin etiqueta al lado: la etiqueta del campo ya está arriba.',
      cru: 'La misma casilla de la celda.',
    },
    EnlChips: {
      rotulo: 'Etiquetas',
      descricao: 'Varios valores libres, cada uno convertido en etiqueta.',
      celula: 'Tres etiquetas y el contador de lo que sobra.',
      formulario: 'Como la selección múltiple, pero sin lista: cada Enter crea una etiqueta nueva, una por escritura.',
      cru: 'Las etiquetas, saltando a las líneas que hagan falta.',
    },
    EnlCalendar: {
      rotulo: 'Fecha (calendario)',
      descricao: 'Fecha, con hora o sin ella, para plazos y agendamientos.',
      celula: 'La fecha corta, en cifras tabulares. Una fecha vencida se pone en rojo.',
      formulario: 'Campo con calendario. Lo escrito acepta el formato del idioma elegido.',
      cru: 'La fecha corta en letras, con la relativa al lado cuando cae en los próximos siete días.',
    },
    EnRel: {
      rotulo: 'Relación simple',
      descricao: 'Une este elemento a un elemento de otra categoría.',
      celula: 'Una etiqueta clicable con el display. Un display vacío cae a la referencia, nunca a nada.',
      formulario: 'Selector con búsqueda arriba y, al PIE de la lista, el atajo de crear registro. El atajo no queda suelto al lado del campo.',
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
      descricao: 'Registro de persona o empresa. El tipo decide los subcampos, y el documento se consulta.',
      celula: 'Nombre de exhibición, con la etiqueta PF o PJ y el documento con máscara.',
      formulario: 'Bloque que empieza en el Tipo y revela los subcampos de ese tipo.',
      cru: 'Nombre, documento y razón social, uno por línea.',
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
    matrizDeDados: {
      rotulo: 'Matriz de datos',
      descricao: 'Una pregunta por fila, una respuesta por columna. Cada fila acepta una sola respuesta.',
      celula: 'La primera respuesta y un contador para el resto. El valor completo se abre en el cuadro.',
      formulario: 'La cuadrícula completa, con la etiqueta complementaria como título y la etiqueta de columna en el encabezado.',
      cru: 'Una línea por pregunta respondida, con el formato pregunta: respuesta.',
    },
    idPersonalizado: {
      rotulo: 'ID personalizado',
      descricao: 'Identificador que el sistema compone de texto fijo, fecha, campo y contador.',
      celula: 'El identificador en fuente monoespaciada. La celda no entra en edición.',
      formulario: 'Solo lectura, con la composición visible en el texto de ayuda.',
      cru: 'El identificador, con el icono de generado por el sistema.',
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
