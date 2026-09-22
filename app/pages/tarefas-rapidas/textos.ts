/**
 * A copy da tela de Tarefas Rápidas nos três idiomas do ENSPACE.
 *
 * Regra 33: nenhum texto de interface leva travessão. Aqui também não.
 */
import type { Idioma } from '~/composables/useIdioma'

export interface Textos {
  /* casca do produto (nada aqui e proposta: e copia do develop) */
  casca: {
    menuLateral: string
    buscar: string
    membro: string
    configuracoes: string
    ajuda: string
    trilha: string
    recolherMenu: string
    abrirMenu: string
    voltar: string
    avancar: string
    recarregar: string
    suporte: string
    notificacoes: string
    idioma: string
    tema: string
    conta: string
    itens: Record<string, string>
  }

  /* casca */
  workspace: string
  trilhaTarefas: string
  trilhaRapidas: string
  novaVisualizacao: string

  /* o formulario da visualizacao */
  vis: {
    tituloNova: string
    tituloEditar: string
    nome: string
    nomeAjuda: string
    nomePlaceholder: string
    descricao: string
    descricaoPlaceholder: string
    icone: string
    iconePlaceholder: string
    tipo: string
    tabela: string
    kanban: string
    cartoesAjuda: string
    agruparPor: string
    agruparPlaceholder: string
    agruparAjuda: string
    ordenarPor: string
    sentido: string
    oCartao: string
    tamanho: string
    pecas: string
    pecasAjuda: string
    personalizados: string
    personalizadosAjuda: string
    definirCabecalho: string
    definirConteudo: string
    definirTags: string
    definirUtilizador: string
    definirData: string
    raias: string
    raiasAjuda: string
    raiaColuna: string
    limiteColuna: string
    totalColuna: string
    ordemColuna: string
    semLimite: string
    comoNoQuadro: string
    aplicarATodas: string
    escolhaAgrupamento: string
    filtros: string
    filtrosAutomaticos: string
    filtrosPersonalizados: string
    adicionar: string
    visibilidade: string
    visibilidadeAjuda: string
    grupos: string
    gruposAjuda: string
    funcoes: string
    funcoesAjuda: string
    salvar: string
    salvarEdicao: string
    daBarra: string
    daBarraAjuda: string
    trazerDaBarra: string
    alterada: string
    alteradaAjuda: string
    salvarNesta: string
    salvarNestaAjuda: string
    salvarComoNova: string
    voltarAoSalvo: string
    deOutraPessoa: (nome: string) => string
    salvaParaTodos: (nome: string) => string
    voltouAoSalvo: string
  }

  /* barra de comandos */
  buscar: string
  buscarAtalho: string
  filtros: string
  filtrosAtivos: (n: number) => string
  limparFiltros: string
  agrupar: string
  agruparPor: string
  ordenar: string
  ordenarPor: string
  crescente: string
  decrescente: string
  cartao: string
  camposDoCartao: string
  densidade: string
  densidades: { pequeno: string, medio: string, grande: string }
  periodo: string
  todoOPeriodo: string
  campoDeData: string
  diaUnico: string
  intervalo: string
  deData: string
  ateData: string
  periodoDoDia: (dia: string) => string
  periodoDoIntervalo: (de: string, ate: string) => string
  novaTarefa: string
  mais: string
  relatorios: string
  arquivadas: string
  lixeira: string
  exportar: string
  raiasVisiveis: string
  ordemDasRaias: string
  arrastarRaia: string
  moverParaEsquerda: string
  moverParaDireita: string
  mostrarTodas: string
  ocultarVazias: string
  resetar: string
  resumo: (total: number, visiveis: number) => string

  /* campos */
  campos: {
    status: string
    prioridade: string
    responsavel: string
    tipo: string
    prazo: string
    pontos: string
    etiquetas: string
    criadoEm: string
    atualizadoEm: string
    concluidoEm: string
    concluidoPor: string
    criadoPor: string
    descricao: string
    nome: string
    referencia: string
    item: string
    colaboradores: string
    origem: string
    identificador: string
    arquivada: string
    notificacao: string
    linkExterno: string
    permissoes: string
    workspace: string
    tempoRegistrado: string
    estimativa: string
  }

  /* tempo, copiado do ClickUp */
  tempo: {
    secao: string
    iniciar: string
    parar: string
    rodando: string
    registrar: string
    duracao: string
    duracaoAjuda: string
    quando: string
    nota: string
    notaPlaceholder: string
    etiqueta: string
    etiquetaPlaceholder: string
    faturavel: string
    naoFaturavel: string
    adicionar: string
    semRegistros: string
    deEstimativa: (feito: string, estimado: string) => string
    acimaDaEstimativa: (excedente: string) => string
    apagarRegistro: string
    editarRegistro: string
    registroApagado: string
    tempoAdicionado: (duracao: string) => string
    cronometroParado: (duracao: string) => string
    porPessoa: string
    salvar: string
    registroAtualizado: string
  }

  /* valores */
  status: { pending: string, working: string, blocked: string, completed: string }
  prioridade: { low: string, normal: string, high: string, urgent: string }
  tipo: { crud: string, form: string, generic: string, approval: string, start: string }

  /* prazo */
  semPrazo: string
  atrasadaDias: (n: number) => string
  venceHoje: string
  venceAmanha: string
  venceEmDias: (n: number) => string
  concluidaEm: (data: string) => string

  /* cartão */
  semResponsavel: string
  pontos: (n: number) => string
  maisEtiquetas: (n: number) => string
  abrirTarefa: string
  acoesDaTarefa: string
  temDescricao: string
  mostrarTudo: string
  mostrarMenos: string
  descricaoLonga: (linhas: number) => string
  respostaEnviada: string

  /* raia */
  novaTarefaNaRaia: string
  acoesDaRaia: string
  recolher: string
  expandir: string
  ocultarRaia: string
  ordenarNestaRaia: string
  definirLimite: string
  limiteExcedido: (n: number, limite: number) => string
  limiteTitulo: string
  limiteAjuda: string
  limitePergunta: string
  limiteSugestoes: string
  limiteAtual: (n: number, limite: number) => string
  limiteSemLimite: string
  limiteRemover: string
  limiteSalvar: string
  limiteHoje: (n: number) => string
  carregarMais: (n: number) => string
  raiaVazia: string
  raiaVaziaAjuda: string
  soltarAqui: string

  /* calculadora */
  calculadora: string
  escolherCalculo: string
  calculos: {
    nenhum: string
    contagem: string
    somaPontos: string
    mediaPontos: string
    maiorPontuacao: string
    atrasadas: string
    semResponsavel: string
    prazoMaisProximo: string
  }
  aplicarEmTodas: string
  operacoes: { soma: string, media: string, minimo: string, maximo: string, preenchidos: string }
  campoDoCalculo: string
  operacaoDoCalculo: string
  semValorNaRaia: string
  cobertura: (com: number, total: number) => string
  camposDaTarefa: string
  camposDoFormulario: string
  contagens: string
  numeros: string
  comoCalcular: string
  ordemDaRaia: string
  usarOrdemDoQuadro: string
  ordemPropria: (campo: string) => string

  /* edição no painel e no formulário de criação */
  editarTitulo: string
  editarCampo: string
  atribuirAMim: string
  prazoHoje: string
  prazoAmanha: string
  prazoProximaSemana: string
  tirarPrazo: string
  criarEmRaia: (raia: string) => string
  cancelar: string
  nomePlaceholder: string
  dataLimitePlaceholder: string
  responsavelPlaceholder: string
  descricaoPlaceholder: string
  campoObrigatorio: string

  /* painel */
  abaTarefa: string
  abaComentarios: string
  abaLogs: string
  detalhes: string
  formulario: string
  resultado: string
  dadosTecnicos: string
  salvarRascunho: string
  concluirTarefa: string
  reabrirTarefa: string
  tarefaConcluida: string
  obrigatorio: string
  faltaResponder: string
  selecione: string
  escreva: string
  verChamado: string
  copiarReferencia: string
  referenciaCopiada: string
  fechar: string
  semDescricao: string
  semFormulario: string
  comentariosVazios: string
  logsVazios: string
  comentarioPlaceholder: string
  enviarComentario: string
  logCriou: string
  logConcluiu: string
  logCriouFrase: (nome: string) => string
  logConcluiuFrase: (nome: string) => string
  haHoras: (n: number) => string
  haDias: (n: number) => string

  /* estados */
  vazioTitulo: string
  vazioDescricao: string
  buscaVaziaTitulo: (termo: string) => string
  buscaVaziaDescricao: string
  erroTitulo: string
  erroDescricao: string
  tentarDeNovo: string
  somenteLeitura: string
  somenteLeituraAjuda: string

  /* toasts */
  tarefaMovida: (nome: string, raia: string) => string
  tarefaSalva: string
  tarefaConcluidaToast: string
  desfazer: string
}

export const textos: Record<Idioma, Textos> = {
  'pt-BR': {
    casca: {
      menuLateral: 'Menu do workspace',
      buscar: 'Buscar',
      membro: 'Membro',
      configuracoes: 'Configurações',
      ajuda: 'Ajuda',
      trilha: 'Trilha',
      recolherMenu: 'Recolher o menu',
      abrirMenu: 'Abrir o menu',
      voltar: 'Voltar',
      avancar: 'Avançar',
      recarregar: 'Recarregar',
      suporte: 'Suporte',
      notificacoes: 'Notificações',
      idioma: 'Idioma',
      tema: 'Tema',
      conta: 'Sua conta',
      itens: {
        inicio: 'Início', spaceflows: 'Spaceflows', categorias: 'Categorias',
        tarefas: 'Tarefas', agendadas: 'Agendadas', rapidas: 'Rápidas',
        agenda: 'Agenda', knowledge: 'Knowledge', visaoGeral: 'Visão Geral',
        sistema: 'Sistema', estrutura: 'Estrutura', gestaoDeMembros: 'Gestão de Membros',
        interface: 'Interface', emails: 'E-mails', integracoes: 'Integrações',
        agentesDeIa: 'Agentes de IA', logs: 'Logs', credenciais: 'Credenciais',
        releases: 'Releases', documentacao: 'Documentação',
      },
    },

    workspace: 'Produtos',
    trilhaTarefas: 'Tarefas',
    trilhaRapidas: 'Rápidas',
    novaVisualizacao: 'Visualizar',

    vis: {
      tituloNova: 'Nova visualização',
      tituloEditar: 'Editar visualização',
      nome: 'Nome da visualização',
      nomeAjuda: 'Defina um nome claro e descritivo para esta visualização.',
      nomePlaceholder: 'Digite o nome da visualização',
      descricao: 'Descrição',
      descricaoPlaceholder: 'Descrição opcional para esta visualização',
      icone: 'Ícone',
      iconePlaceholder: 'Por favor selecione',
      tipo: 'Tipo de visualização',
      tabela: 'Tabela',
      kanban: 'Kanban',
      cartoesAjuda: 'Configure os cartões para a visualização kanban.',
      agruparPor: 'Agrupar por',
      agruparPlaceholder: 'Selecionar campo',
      agruparAjuda: 'É este campo que vira as raias do quadro.',
      ordenarPor: 'Ordenar cartões em cada coluna por',
      sentido: 'Sentido',
      oCartao: 'O cartão',
      tamanho: 'Tamanho do cartão',
      pecas: 'O que o cartão mostra',
      pecasAjuda: 'Cada peça sabe se comportar: o prazo fica vermelho quando passa, a prioridade tem cor por nível, o tempo vira cronômetro. Ligue as que a equipe precisa ver sem abrir a tarefa.',
      personalizados: 'Campos personalizados',
      personalizadosAjuda: 'Campo que o produto não conhece continua entrando por posição, como hoje.',
      definirCabecalho: 'Definir campo do cabeçalho',
      definirConteudo: 'Definir campo do conteúdo',
      definirTags: 'Adicionar tags',
      definirUtilizador: 'Definir campo de utilizador',
      definirData: 'Definir campos de data',
      raias: 'As raias',
      raiasAjuda: 'Limite, totalizador e ordem são de cada raia, não do quadro inteiro. Quem abrir a visualização começa por aqui, e pode mudar no quadro depois.',
      raiaColuna: 'Raia',
      limiteColuna: 'Limite de cartões',
      totalColuna: 'Totalizador',
      ordemColuna: 'Ordem',
      semLimite: 'Sem limite',
      comoNoQuadro: 'Como o quadro',
      aplicarATodas: 'Aplicar a todas',
      escolhaAgrupamento: 'Escolha o campo do agrupamento para configurar as raias.',
      filtros: 'Filtros',
      filtrosAutomaticos: 'Filtros automáticos',
      filtrosPersonalizados: 'Filtros por campos personalizados',
      adicionar: 'Adicionar',
      visibilidade: 'Visibilidade',
      visibilidadeAjuda: 'Defina quem na sua empresa poderá ver esta tela.',
      grupos: 'Grupos',
      gruposAjuda: 'Selecione os grupos que terão acesso a esta visualização.',
      funcoes: 'Funções',
      funcoesAjuda: 'Selecione as funções que terão acesso a esta visualização.',
      salvar: 'Salvar',
      salvarEdicao: 'Salvar alterações',
      daBarra: 'Trazido do quadro',
      daBarraAjuda: 'Você mudou estas coisas no quadro. Salvar aqui deixa elas assim para quem abrir a visualização.',
      trazerDaBarra: 'Usar o que está no quadro agora',
      alterada: 'Alterada',
      alteradaAjuda: 'O quadro está diferente do que esta visualização guarda. As mudanças são suas e ficam com você.',
      salvarNesta: 'Salvar nesta visualização',
      salvarNestaAjuda: 'Passa a valer para todo mundo que abre esta visualização.',
      salvarComoNova: 'Salvar como nova',
      voltarAoSalvo: 'Voltar ao salvo',
      deOutraPessoa: nome => `Esta visualização é de ${nome}. Você pode salvar as suas mudanças numa visualização nova.`,
      salvaParaTodos: nome => `"${nome}" foi salva para todo mundo que a usa.`,
      voltouAoSalvo: 'O quadro voltou ao que a visualização guarda.',
    },

    buscar: 'Pesquisar tarefas',
    buscarAtalho: 'Buscar por nome, referência ou chamado',
    filtros: 'Filtros',
    filtrosAtivos: n => `${n} ${n === 1 ? 'filtro' : 'filtros'}`,
    limparFiltros: 'Limpar',
    agrupar: 'Agrupar',
    agruparPor: 'Agrupar raias por',
    ordenar: 'Ordenar',
    ordenarPor: 'Ordenar cartões por',
    crescente: 'Do menor para o maior',
    decrescente: 'Do maior para o menor',
    cartao: 'Cartão',
    camposDoCartao: 'O que aparece no cartão',
    densidade: 'Tamanho do cartão',
    densidades: { pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande' },
    periodo: 'Período',
    todoOPeriodo: 'Todo o período',
    campoDeData: 'Contar o período por',
    diaUnico: 'Dia único',
    intervalo: 'Intervalo',
    deData: 'De',
    ateData: 'Até',
    periodoDoDia: dia => dia,
    periodoDoIntervalo: (de, ate) => `${de} a ${ate}`,
    novaTarefa: 'Nova tarefa',
    mais: 'Mais',
    relatorios: 'Relatórios',
    arquivadas: 'Arquivadas',
    lixeira: 'Lixeira',
    exportar: 'Exportar',
    raiasVisiveis: 'Raias',
    ordemDasRaias: 'Arraste para trocar a ordem',
    arrastarRaia: 'Arrastar para reordenar',
    moverParaEsquerda: 'Mover para a esquerda',
    moverParaDireita: 'Mover para a direita',
    mostrarTodas: 'Mostrar todas',
    ocultarVazias: 'Ocultar raias vazias',
    resetar: 'Voltar ao padrão',
    resumo: (total, visiveis) => visiveis === total
      ? `${total} tarefas`
      : `${visiveis} de ${total} tarefas`,

    campos: {
      status: 'Situação',
      prioridade: 'Prioridade',
      responsavel: 'Responsável',
      tipo: 'Tipo',
      prazo: 'Prazo',
      pontos: 'Pontos',
      etiquetas: 'Etiquetas',
      criadoEm: 'Criada em',
      atualizadoEm: 'Atualizada em',
      concluidoEm: 'Concluída em',
      concluidoPor: 'Concluída por',
      criadoPor: 'Criada por',
      descricao: 'Descrição',
      nome: 'Nome',
      referencia: 'Referência',
      item: 'Registro de origem',
      colaboradores: 'Colaboradores',
      origem: 'Veio do fluxo',
      identificador: 'Identificador',
      arquivada: 'Arquivada',
      notificacao: 'Tarefa de notificação',
      linkExterno: 'Link externo',
      permissoes: 'Quem pode executar',
      workspace: 'Workspace',
      tempoRegistrado: 'Tempo registrado',
      estimativa: 'Estimativa',
    },

    tempo: {
      secao: 'Tempo',
      iniciar: 'Iniciar o cronômetro',
      parar: 'Parar o cronômetro',
      rodando: 'Cronômetro rodando',
      registrar: 'Registrar tempo',
      duracao: 'Duração',
      duracaoAjuda: 'Aceita 1h 30m, 90m ou 1:30',
      quando: 'Quando',
      nota: 'Nota',
      notaPlaceholder: 'O que foi feito neste tempo',
      etiqueta: 'Etiqueta do apontamento',
      etiquetaPlaceholder: 'Análise, Correção, Reunião',
      faturavel: 'Faturável',
      naoFaturavel: 'Não faturável',
      adicionar: 'Adicionar',
      semRegistros: 'Nenhum tempo apontado ainda.',
      deEstimativa: (feito, estimado) => `${feito} de ${estimado}`,
      acimaDaEstimativa: excedente => `${excedente} acima da estimativa`,
      apagarRegistro: 'Apagar o apontamento',
      editarRegistro: 'Editar o apontamento',
      registroApagado: 'Apontamento apagado.',
      tempoAdicionado: duracao => `${duracao} apontados.`,
      cronometroParado: duracao => `Cronômetro parado. ${duracao} apontados.`,
      porPessoa: 'Por pessoa',
      salvar: 'Salvar',
      registroAtualizado: 'Apontamento atualizado.',
    },

    status: { pending: 'Pendente', working: 'Em andamento', blocked: 'Bloqueada', completed: 'Concluída' },
    prioridade: { low: 'Baixa', normal: 'Normal', high: 'Alta', urgent: 'Urgente' },
    tipo: { crud: 'Ação em registro', form: 'Formulário', generic: 'Simples', approval: 'Aprovação', start: 'Início de fluxo' },

    semPrazo: 'Sem prazo',
    atrasadaDias: n => n === 0 ? 'Venceu hoje' : `Atrasada ${n} ${n === 1 ? 'dia' : 'dias'}`,
    venceHoje: 'Vence hoje',
    venceAmanha: 'Vence amanhã',
    venceEmDias: n => `Vence em ${n} dias`,
    concluidaEm: data => `Concluída em ${data}`,

    semResponsavel: 'Sem responsável',
    pontos: n => `${n} ${n === 1 ? 'ponto' : 'pontos'}`,
    maisEtiquetas: n => `+${n}`,
    abrirTarefa: 'Abrir tarefa',
    acoesDaTarefa: 'Ações da tarefa',
    temDescricao: 'Tem descrição. Abra a tarefa para ler inteira',
    mostrarTudo: 'Mostrar a descrição inteira',
    mostrarMenos: 'Mostrar menos',
    descricaoLonga: linhas => `Descrição longa, cortada em ${linhas} linhas`,
    respostaEnviada: 'Resposta registrada',

    novaTarefaNaRaia: 'Nova tarefa aqui',
    acoesDaRaia: 'Ações da raia',
    recolher: 'Recolher',
    expandir: 'Expandir',
    ocultarRaia: 'Ocultar raia',
    ordenarNestaRaia: 'Ordenar só esta raia',
    definirLimite: 'Definir limite de cartões',
    limiteExcedido: (n, limite) => `${n} de ${limite}, acima do limite`,
    limiteTitulo: 'Limite de cartões',
    limiteAjuda: 'A raia avisa quando passa do limite. Ninguém fica impedido de mover cartão.',
    limitePergunta: 'Quantos cartões cabem nesta raia?',
    limiteSugestoes: 'Sugestões',
    limiteAtual: (n, limite) => `${n} de ${limite} cartões`,
    limiteSemLimite: 'Sem limite',
    limiteRemover: 'Tirar o limite',
    limiteSalvar: 'Definir limite',
    limiteHoje: n => `Nesta raia há ${n} ${n === 1 ? 'cartão' : 'cartões'} agora`,
    carregarMais: n => `Ver mais ${n}`,
    raiaVazia: 'Nenhuma tarefa nesta raia',
    raiaVaziaAjuda: 'Arraste um cartão para cá ou crie uma tarefa nesta raia.',
    soltarAqui: 'Soltar aqui',

    calculadora: 'Totalizador',
    escolherCalculo: 'Escolher cálculo',
    calculos: {
      nenhum: 'Nenhum',
      contagem: 'Tarefas',
      somaPontos: 'Soma de pontos',
      mediaPontos: 'Média de pontos',
      maiorPontuacao: 'Maior pontuação',
      atrasadas: 'Atrasadas',
      semResponsavel: 'Sem responsável',
      prazoMaisProximo: 'Prazo mais próximo',
    },
    aplicarEmTodas: 'Usar o mesmo cálculo em todas as raias',
    operacoes: { soma: 'Soma', media: 'Média', minimo: 'Mínimo', maximo: 'Máximo', preenchidos: 'Preenchidas' },
    campoDoCalculo: 'Campo',
    operacaoDoCalculo: 'Operação',
    semValorNaRaia: 'sem valor',
    cobertura: (com, total) => `${com} de ${total} preenchidas`,
    camposDaTarefa: 'Da tarefa',
    camposDoFormulario: 'Do formulário',
    contagens: 'Contagens',
    numeros: 'Números',
    comoCalcular: 'Como calcular',
    ordemDaRaia: 'Ordenar só esta raia',
    usarOrdemDoQuadro: 'Usar a ordem do quadro',
    ordemPropria: campo => `Esta raia está ordenada por ${campo}`,

    editarTitulo: 'Editar o título',
    editarCampo: 'Editar',
    atribuirAMim: 'Atribuir a mim',
    prazoHoje: 'Hoje',
    prazoAmanha: 'Amanhã',
    prazoProximaSemana: 'Semana que vem',
    tirarPrazo: 'Sem prazo',
    criarEmRaia: raia => `A tarefa nasce em ${raia}`,
    cancelar: 'Cancelar',
    nomePlaceholder: 'O que precisa ser feito?',
    dataLimitePlaceholder: 'Escolha a data e a hora',
    responsavelPlaceholder: 'Escolha quem faz',
    descricaoPlaceholder: 'Contexto, links e o que a pessoa precisa saber para resolver',
    campoObrigatorio: 'obrigatório',

    abaTarefa: 'Tarefa',
    abaComentarios: 'Comentários',
    abaLogs: 'Histórico',
    detalhes: 'Detalhes',
    formulario: 'Formulário',
    resultado: 'O que foi respondido',
    dadosTecnicos: 'Dados técnicos',
    salvarRascunho: 'Salvar sem concluir',
    concluirTarefa: 'Concluir tarefa',
    reabrirTarefa: 'Reabrir',
    tarefaConcluida: 'Esta tarefa já foi concluída.',
    obrigatorio: 'obrigatório',
    faltaResponder: 'Responda os campos obrigatórios para concluir.',
    selecione: 'Selecione',
    escreva: 'Escreva aqui',
    verChamado: 'Abrir registro',
    copiarReferencia: 'Copiar referência',
    referenciaCopiada: 'Referência copiada.',
    fechar: 'Fechar',
    semDescricao: 'Esta tarefa não tem descrição.',
    semFormulario: 'Esta tarefa não pede formulário. Basta concluir.',
    comentariosVazios: 'Nenhum comentário ainda.',
    logsVazios: 'Nada registrado ainda.',
    comentarioPlaceholder: 'Escreva um comentário. Use @ para mencionar e Ctrl+Enter para enviar',
    enviarComentario: 'Enviar comentário',
    logCriou: 'Criou',
    logConcluiu: 'Concluiu',
    logCriouFrase: nome => `${nome} criou uma tarefa`,
    logConcluiuFrase: nome => `${nome} concluiu a tarefa`,
    haHoras: n => n < 1 ? 'agora há pouco' : `há ${n} ${n === 1 ? 'hora' : 'horas'}`,
    haDias: n => `há ${n} ${n === 1 ? 'dia' : 'dias'}`,

    vazioTitulo: 'Este quadro ainda não tem tarefas',
    vazioDescricao: 'As tarefas rápidas vêm dos spaceflows, quando um fluxo precisa da decisão de uma pessoa. Você também pode criar uma tarefa direto no quadro.',
    buscaVaziaTitulo: termo => `Nenhuma tarefa corresponde a "${termo}"`,
    buscaVaziaDescricao: 'Revise os termos da busca ou limpe os filtros ativos.',
    erroTitulo: 'Não foi possível carregar as tarefas',
    erroDescricao: 'A conexão com o servidor falhou. Nenhuma tarefa foi perdida. Tente novamente e, se o erro continuar, fale com o suporte.',
    tentarDeNovo: 'Tentar novamente',
    somenteLeitura: 'Somente leitura',
    somenteLeituraAjuda: 'Você pode ver este quadro, mas não mover nem criar tarefas.',

    tarefaMovida: (nome, raia) => `"${nome}" foi para ${raia}.`,
    tarefaSalva: 'Progresso salvo.',
    tarefaConcluidaToast: 'Tarefa concluída.',
    desfazer: 'Desfazer',
  },

  en: {
    casca: {
      menuLateral: 'Workspace menu',
      buscar: 'Search',
      membro: 'Member',
      configuracoes: 'Settings',
      ajuda: 'Help',
      trilha: 'Breadcrumb',
      recolherMenu: 'Collapse the menu',
      abrirMenu: 'Open the menu',
      voltar: 'Back',
      avancar: 'Forward',
      recarregar: 'Reload',
      suporte: 'Support',
      notificacoes: 'Notifications',
      idioma: 'Language',
      tema: 'Theme',
      conta: 'Your account',
      itens: {
        inicio: 'Home', spaceflows: 'Spaceflows', categorias: 'Categories',
        tarefas: 'Tasks', agendadas: 'Scheduled', rapidas: 'Quick',
        agenda: 'Schedule', knowledge: 'Knowledge', visaoGeral: 'Overview',
        sistema: 'System', estrutura: 'Structure', gestaoDeMembros: 'Member management',
        interface: 'Interface', emails: 'Emails', integracoes: 'Integrations',
        agentesDeIa: 'AI agents', logs: 'Logs', credenciais: 'Credentials',
        releases: 'Releases', documentacao: 'Documentation',
      },
    },

    workspace: 'Products',
    trilhaTarefas: 'Tasks',
    trilhaRapidas: 'Quick',
    novaVisualizacao: 'View',

    vis: {
      tituloNova: 'New view',
      tituloEditar: 'Edit view',
      nome: 'View name',
      nomeAjuda: 'Give this view a clear, descriptive name.',
      nomePlaceholder: 'Type the view name',
      descricao: 'Description',
      descricaoPlaceholder: 'Optional description for this view',
      icone: 'Icon',
      iconePlaceholder: 'Please select',
      tipo: 'View type',
      tabela: 'Table',
      kanban: 'Kanban',
      cartoesAjuda: 'Set up the cards for the kanban view.',
      agruparPor: 'Group by',
      agruparPlaceholder: 'Select field',
      agruparAjuda: 'This is the field that becomes the lanes of the board.',
      ordenarPor: 'Sort cards in each column by',
      sentido: 'Direction',
      oCartao: 'The card',
      tamanho: 'Card size',
      pecas: 'What the card shows',
      pecasAjuda: 'Each piece knows how to behave: the due date turns red once it passes, priority has a color per level, time becomes a timer. Turn on the ones the team needs to see without opening the task.',
      personalizados: 'Custom fields',
      personalizadosAjuda: 'A field the product does not know still goes in by position, as it does today.',
      definirCabecalho: 'Set the header field',
      definirConteudo: 'Set the content field',
      definirTags: 'Add tags',
      definirUtilizador: 'Set the user field',
      definirData: 'Set the date fields',
      raias: 'The lanes',
      raiasAjuda: 'Limit, totals and order belong to each lane, not to the whole board. Whoever opens the view starts here, and can change it on the board afterwards.',
      raiaColuna: 'Lane',
      limiteColuna: 'Card limit',
      totalColuna: 'Total',
      ordemColuna: 'Order',
      semLimite: 'No limit',
      comoNoQuadro: 'Same as board',
      aplicarATodas: 'Apply to all',
      escolhaAgrupamento: 'Pick the grouping field to set up the lanes.',
      filtros: 'Filters',
      filtrosAutomaticos: 'Automatic filters',
      filtrosPersonalizados: 'Filters by custom fields',
      adicionar: 'Add',
      visibilidade: 'Visibility',
      visibilidadeAjuda: 'Choose who in your company can see this screen.',
      grupos: 'Groups',
      gruposAjuda: 'Select the groups that will have access to this view.',
      funcoes: 'Roles',
      funcoesAjuda: 'Select the roles that will have access to this view.',
      salvar: 'Save',
      salvarEdicao: 'Save changes',
      daBarra: 'Brought from the board',
      daBarraAjuda: 'You changed these on the board. Saving here makes them the starting point for whoever opens the view.',
      trazerDaBarra: 'Use what is on the board now',
      alterada: 'Changed',
      alteradaAjuda: 'The board differs from what this view has saved. The changes are yours and they stay with you.',
      salvarNesta: 'Save to this view',
      salvarNestaAjuda: 'It becomes the starting point for everyone who opens this view.',
      salvarComoNova: 'Save as new',
      voltarAoSalvo: 'Back to saved',
      deOutraPessoa: nome => `This view belongs to ${nome}. You can save your changes as a new view.`,
      salvaParaTodos: nome => `"${nome}" was saved for everyone who uses it.`,
      voltouAoSalvo: 'The board is back to what the view has saved.',
    },

    buscar: 'Search tasks',
    buscarAtalho: 'Search by name, reference or record',
    filtros: 'Filters',
    filtrosAtivos: n => `${n} ${n === 1 ? 'filter' : 'filters'}`,
    limparFiltros: 'Clear',
    agrupar: 'Group',
    agruparPor: 'Group lanes by',
    ordenar: 'Sort',
    ordenarPor: 'Sort cards by',
    crescente: 'Lowest to highest',
    decrescente: 'Highest to lowest',
    cartao: 'Card',
    camposDoCartao: 'What shows on the card',
    densidade: 'Card size',
    densidades: { pequeno: 'Small', medio: 'Medium', grande: 'Large' },
    periodo: 'Period',
    todoOPeriodo: 'All time',
    campoDeData: 'Count the period by',
    diaUnico: 'Single day',
    intervalo: 'Range',
    deData: 'From',
    ateData: 'To',
    periodoDoDia: dia => dia,
    periodoDoIntervalo: (de, ate) => `${de} to ${ate}`,
    novaTarefa: 'New task',
    mais: 'More',
    relatorios: 'Reports',
    arquivadas: 'Archived',
    lixeira: 'Trash',
    exportar: 'Export',
    raiasVisiveis: 'Lanes',
    ordemDasRaias: 'Drag to change the order',
    arrastarRaia: 'Drag to reorder',
    moverParaEsquerda: 'Move left',
    moverParaDireita: 'Move right',
    mostrarTodas: 'Show all',
    ocultarVazias: 'Hide empty lanes',
    resetar: 'Back to default',
    resumo: (total, visiveis) => visiveis === total
      ? `${total} tasks`
      : `${visiveis} of ${total} tasks`,

    campos: {
      status: 'Status',
      prioridade: 'Priority',
      responsavel: 'Assignee',
      tipo: 'Type',
      prazo: 'Due date',
      pontos: 'Points',
      etiquetas: 'Tags',
      criadoEm: 'Created',
      atualizadoEm: 'Updated',
      concluidoEm: 'Completed',
      concluidoPor: 'Completed by',
      criadoPor: 'Created by',
      descricao: 'Description',
      nome: 'Name',
      referencia: 'Reference',
      item: 'Source record',
      colaboradores: 'Collaborators',
      origem: 'Came from flow',
      identificador: 'Identifier',
      arquivada: 'Archived',
      notificacao: 'Notification task',
      linkExterno: 'External link',
      permissoes: 'Who can run it',
      workspace: 'Workspace',
      tempoRegistrado: 'Time tracked',
      estimativa: 'Estimate',
    },

    tempo: {
      secao: 'Time',
      iniciar: 'Start the timer',
      parar: 'Stop the timer',
      rodando: 'Timer running',
      registrar: 'Track time',
      duracao: 'Duration',
      duracaoAjuda: 'Accepts 1h 30m, 90m or 1:30',
      quando: 'When',
      nota: 'Note',
      notaPlaceholder: 'What was done in this time',
      etiqueta: 'Entry label',
      etiquetaPlaceholder: 'Analysis, Fix, Meeting',
      faturavel: 'Billable',
      naoFaturavel: 'Not billable',
      adicionar: 'Add',
      semRegistros: 'No time tracked yet.',
      deEstimativa: (feito, estimado) => `${feito} of ${estimado}`,
      acimaDaEstimativa: excedente => `${excedente} over the estimate`,
      apagarRegistro: 'Delete the entry',
      editarRegistro: 'Edit the entry',
      registroApagado: 'Entry deleted.',
      tempoAdicionado: duracao => `${duracao} tracked.`,
      cronometroParado: duracao => `Timer stopped. ${duracao} tracked.`,
      porPessoa: 'Per person',
      salvar: 'Save',
      registroAtualizado: 'Entry updated.',
    },

    status: { pending: 'Pending', working: 'In progress', blocked: 'Blocked', completed: 'Completed' },
    prioridade: { low: 'Low', normal: 'Normal', high: 'High', urgent: 'Urgent' },
    tipo: { crud: 'Record action', form: 'Form', generic: 'Simple', approval: 'Approval', start: 'Flow start' },

    semPrazo: 'No due date',
    atrasadaDias: n => n === 0 ? 'Due today' : `${n} ${n === 1 ? 'day' : 'days'} late`,
    venceHoje: 'Due today',
    venceAmanha: 'Due tomorrow',
    venceEmDias: n => `Due in ${n} days`,
    concluidaEm: data => `Completed on ${data}`,

    semResponsavel: 'Unassigned',
    pontos: n => `${n} ${n === 1 ? 'point' : 'points'}`,
    maisEtiquetas: n => `+${n}`,
    abrirTarefa: 'Open task',
    acoesDaTarefa: 'Task actions',
    temDescricao: 'Has a description. Open the task to read it in full',
    mostrarTudo: 'Show the whole description',
    mostrarMenos: 'Show less',
    descricaoLonga: linhas => `Long description, cut at ${linhas} lines`,
    respostaEnviada: 'Answer recorded',

    novaTarefaNaRaia: 'New task here',
    acoesDaRaia: 'Lane actions',
    recolher: 'Collapse',
    expandir: 'Expand',
    ocultarRaia: 'Hide lane',
    ordenarNestaRaia: 'Sort this lane only',
    definirLimite: 'Set card limit',
    limiteExcedido: (n, limite) => `${n} of ${limite}, over the limit`,
    limiteTitulo: 'Card limit',
    limiteAjuda: 'The lane warns when it goes over. Nobody is blocked from moving a card.',
    limitePergunta: 'How many cards fit in this lane?',
    limiteSugestoes: 'Suggestions',
    limiteAtual: (n, limite) => `${n} of ${limite} cards`,
    limiteSemLimite: 'No limit',
    limiteRemover: 'Remove the limit',
    limiteSalvar: 'Set limit',
    limiteHoje: n => `This lane has ${n} ${n === 1 ? 'card' : 'cards'} right now`,
    carregarMais: n => `Show ${n} more`,
    raiaVazia: 'No tasks in this lane',
    raiaVaziaAjuda: 'Drag a card here or create a task in this lane.',
    soltarAqui: 'Drop here',

    calculadora: 'Summary',
    escolherCalculo: 'Choose calculation',
    calculos: {
      nenhum: 'None',
      contagem: 'Tasks',
      somaPontos: 'Sum of points',
      mediaPontos: 'Average points',
      maiorPontuacao: 'Highest points',
      atrasadas: 'Late',
      semResponsavel: 'Unassigned',
      prazoMaisProximo: 'Nearest due date',
    },
    aplicarEmTodas: 'Use the same calculation in every lane',
    operacoes: { soma: 'Sum', media: 'Average', minimo: 'Minimum', maximo: 'Maximum', preenchidos: 'Filled' },
    campoDoCalculo: 'Field',
    operacaoDoCalculo: 'Operation',
    semValorNaRaia: 'no value',
    cobertura: (com, total) => `${com} of ${total} filled`,
    camposDaTarefa: 'From the task',
    camposDoFormulario: 'From the form',
    contagens: 'Counts',
    numeros: 'Numbers',
    comoCalcular: 'How to calculate',
    ordemDaRaia: 'Sort this lane only',
    usarOrdemDoQuadro: 'Use the board order',
    ordemPropria: campo => `This lane is sorted by ${campo}`,

    editarTitulo: 'Edit the title',
    editarCampo: 'Edit',
    atribuirAMim: 'Assign to me',
    prazoHoje: 'Today',
    prazoAmanha: 'Tomorrow',
    prazoProximaSemana: 'Next week',
    tirarPrazo: 'No due date',
    criarEmRaia: raia => `The task starts in ${raia}`,
    cancelar: 'Cancel',
    nomePlaceholder: 'What needs to be done?',
    dataLimitePlaceholder: 'Pick the date and time',
    responsavelPlaceholder: 'Choose who does it',
    descricaoPlaceholder: 'Context, links and what the person needs in order to solve it',
    campoObrigatorio: 'required',

    abaTarefa: 'Task',
    abaComentarios: 'Comments',
    abaLogs: 'History',
    detalhes: 'Details',
    formulario: 'Form',
    resultado: 'What was answered',
    dadosTecnicos: 'Technical data',
    salvarRascunho: 'Save without finishing',
    concluirTarefa: 'Complete task',
    reabrirTarefa: 'Reopen',
    tarefaConcluida: 'This task is already completed.',
    obrigatorio: 'required',
    faltaResponder: 'Answer the required fields to complete it.',
    selecione: 'Select',
    escreva: 'Write here',
    verChamado: 'Open record',
    copiarReferencia: 'Copy reference',
    referenciaCopiada: 'Reference copied.',
    fechar: 'Close',
    semDescricao: 'This task has no description.',
    semFormulario: 'This task asks for no form. Just complete it.',
    comentariosVazios: 'No comments yet.',
    logsVazios: 'Nothing recorded yet.',
    comentarioPlaceholder: 'Write a comment. Use @ to mention and Ctrl+Enter to send',
    enviarComentario: 'Send comment',
    logCriou: 'Created',
    logConcluiu: 'Completed',
    logCriouFrase: nome => `${nome} created a task`,
    logConcluiuFrase: nome => `${nome} completed the task`,
    haHoras: n => n < 1 ? 'just now' : `${n} ${n === 1 ? 'hour' : 'hours'} ago`,
    haDias: n => `${n} ${n === 1 ? 'day' : 'days'} ago`,

    vazioTitulo: 'This board has no tasks yet',
    vazioDescricao: 'Quick tasks come from spaceflows, when a flow needs a decision from a person. You can also create a task directly on the board.',
    buscaVaziaTitulo: termo => `No task matches "${termo}"`,
    buscaVaziaDescricao: 'Review the search terms or clear the active filters.',
    erroTitulo: 'The tasks could not be loaded',
    erroDescricao: 'The connection to the server failed. No task was lost. Try again, and contact support if the error continues.',
    tentarDeNovo: 'Try again',
    somenteLeitura: 'Read only',
    somenteLeituraAjuda: 'You can see this board, but not move or create tasks.',

    tarefaMovida: (nome, raia) => `"${nome}" moved to ${raia}.`,
    tarefaSalva: 'Progress saved.',
    tarefaConcluidaToast: 'Task completed.',
    desfazer: 'Undo',
  },

  es: {
    casca: {
      menuLateral: 'Menú del workspace',
      buscar: 'Buscar',
      membro: 'Miembro',
      configuracoes: 'Configuraciones',
      ajuda: 'Ayuda',
      trilha: 'Ruta',
      recolherMenu: 'Contraer el menú',
      abrirMenu: 'Abrir el menú',
      voltar: 'Volver',
      avancar: 'Avanzar',
      recarregar: 'Recargar',
      suporte: 'Soporte',
      notificacoes: 'Notificaciones',
      idioma: 'Idioma',
      tema: 'Tema',
      conta: 'Su cuenta',
      itens: {
        inicio: 'Inicio', spaceflows: 'Spaceflows', categorias: 'Categorías',
        tarefas: 'Tareas', agendadas: 'Programadas', rapidas: 'Rápidas',
        agenda: 'Agenda', knowledge: 'Knowledge', visaoGeral: 'Visión General',
        sistema: 'Sistema', estrutura: 'Estructura', gestaoDeMembros: 'Gestión de Miembros',
        interface: 'Interfaz', emails: 'Correos', integracoes: 'Integraciones',
        agentesDeIa: 'Agentes de IA', logs: 'Registros', credenciais: 'Credenciales',
        releases: 'Releases', documentacao: 'Documentación',
      },
    },

    workspace: 'Productos',
    trilhaTarefas: 'Tareas',
    trilhaRapidas: 'Rápidas',
    novaVisualizacao: 'Vista',

    vis: {
      tituloNova: 'Nueva visualización',
      tituloEditar: 'Editar visualización',
      nome: 'Nombre de la visualización',
      nomeAjuda: 'Defina un nombre claro y descriptivo para esta visualización.',
      nomePlaceholder: 'Escriba el nombre de la visualización',
      descricao: 'Descripción',
      descricaoPlaceholder: 'Descripción opcional para esta visualización',
      icone: 'Icono',
      iconePlaceholder: 'Por favor seleccione',
      tipo: 'Tipo de visualización',
      tabela: 'Tabla',
      kanban: 'Kanban',
      cartoesAjuda: 'Configure las tarjetas para la visualización kanban.',
      agruparPor: 'Agrupar por',
      agruparPlaceholder: 'Seleccionar campo',
      agruparAjuda: 'Es este campo el que se convierte en los carriles del tablero.',
      ordenarPor: 'Ordenar tarjetas en cada columna por',
      sentido: 'Sentido',
      oCartao: 'La tarjeta',
      tamanho: 'Tamaño de la tarjeta',
      pecas: 'Lo que muestra la tarjeta',
      pecasAjuda: 'Cada pieza sabe comportarse: la fecha límite se pone roja al vencer, la prioridad tiene color por nivel, el tiempo se convierte en cronómetro. Active las que el equipo necesita ver sin abrir la tarea.',
      personalizados: 'Campos personalizados',
      personalizadosAjuda: 'Un campo que el producto no conoce sigue entrando por posición, como hoy.',
      definirCabecalho: 'Definir campo del encabezado',
      definirConteudo: 'Definir campo del contenido',
      definirTags: 'Agregar etiquetas',
      definirUtilizador: 'Definir campo de usuario',
      definirData: 'Definir campos de fecha',
      raias: 'Los carriles',
      raiasAjuda: 'Límite, totalizador y orden son de cada carril, no del tablero entero. Quien abra la visualización empieza por aquí, y puede cambiarlo en el tablero después.',
      raiaColuna: 'Carril',
      limiteColuna: 'Límite de tarjetas',
      totalColuna: 'Totalizador',
      ordemColuna: 'Orden',
      semLimite: 'Sin límite',
      comoNoQuadro: 'Como el tablero',
      aplicarATodas: 'Aplicar a todos',
      escolhaAgrupamento: 'Elija el campo de agrupación para configurar los carriles.',
      filtros: 'Filtros',
      filtrosAutomaticos: 'Filtros automáticos',
      filtrosPersonalizados: 'Filtros por campos personalizados',
      adicionar: 'Agregar',
      visibilidade: 'Visibilidad',
      visibilidadeAjuda: 'Defina quién en su empresa podrá ver esta pantalla.',
      grupos: 'Grupos',
      gruposAjuda: 'Seleccione los grupos que tendrán acceso a esta visualización.',
      funcoes: 'Funciones',
      funcoesAjuda: 'Seleccione las funciones que tendrán acceso a esta visualización.',
      salvar: 'Guardar',
      salvarEdicao: 'Guardar cambios',
      daBarra: 'Traído del tablero',
      daBarraAjuda: 'Usted cambió estas cosas en el tablero. Guardar aquí las deja así para quien abra la visualización.',
      trazerDaBarra: 'Usar lo que está en el tablero ahora',
      alterada: 'Modificada',
      alteradaAjuda: 'El tablero está distinto de lo que esta visualización guarda. Los cambios son suyos y se quedan con usted.',
      salvarNesta: 'Guardar en esta visualización',
      salvarNestaAjuda: 'Pasa a valer para todos los que abren esta visualización.',
      salvarComoNova: 'Guardar como nueva',
      voltarAoSalvo: 'Volver a lo guardado',
      deOutraPessoa: nome => `Esta visualización es de ${nome}. Puede guardar sus cambios en una visualización nueva.`,
      salvaParaTodos: nome => `"${nome}" se guardó para todos los que la usan.`,
      voltouAoSalvo: 'El tablero volvió a lo que la visualización guarda.',
    },

    buscar: 'Buscar tareas',
    buscarAtalho: 'Busque por nombre, referencia o registro',
    filtros: 'Filtros',
    filtrosAtivos: n => `${n} ${n === 1 ? 'filtro' : 'filtros'}`,
    limparFiltros: 'Limpiar',
    agrupar: 'Agrupar',
    agruparPor: 'Agrupar carriles por',
    ordenar: 'Ordenar',
    ordenarPor: 'Ordenar tarjetas por',
    crescente: 'De menor a mayor',
    decrescente: 'De mayor a menor',
    cartao: 'Tarjeta',
    camposDoCartao: 'Qué aparece en la tarjeta',
    densidade: 'Tamaño de la tarjeta',
    densidades: { pequeno: 'Pequeña', medio: 'Mediana', grande: 'Grande' },
    periodo: 'Período',
    todoOPeriodo: 'Todo el período',
    campoDeData: 'Contar el período por',
    diaUnico: 'Día único',
    intervalo: 'Intervalo',
    deData: 'De',
    ateData: 'Hasta',
    periodoDoDia: dia => dia,
    periodoDoIntervalo: (de, ate) => `${de} a ${ate}`,
    novaTarefa: 'Nueva tarea',
    mais: 'Más',
    relatorios: 'Informes',
    arquivadas: 'Archivadas',
    lixeira: 'Papelera',
    exportar: 'Exportar',
    raiasVisiveis: 'Carriles',
    ordemDasRaias: 'Arrastre para cambiar el orden',
    arrastarRaia: 'Arrastrar para reordenar',
    moverParaEsquerda: 'Mover a la izquierda',
    moverParaDireita: 'Mover a la derecha',
    mostrarTodas: 'Mostrar todos',
    ocultarVazias: 'Ocultar carriles vacíos',
    resetar: 'Volver al estándar',
    resumo: (total, visiveis) => visiveis === total
      ? `${total} tareas`
      : `${visiveis} de ${total} tareas`,

    campos: {
      status: 'Situación',
      prioridade: 'Prioridad',
      responsavel: 'Responsable',
      tipo: 'Tipo',
      prazo: 'Fecha límite',
      pontos: 'Puntos',
      etiquetas: 'Etiquetas',
      criadoEm: 'Creada el',
      atualizadoEm: 'Actualizada el',
      concluidoEm: 'Completada el',
      concluidoPor: 'Completada por',
      criadoPor: 'Creada por',
      descricao: 'Descripción',
      nome: 'Nombre',
      referencia: 'Referencia',
      item: 'Registro de origen',
      colaboradores: 'Colaboradores',
      origem: 'Vino del flujo',
      identificador: 'Identificador',
      arquivada: 'Archivada',
      notificacao: 'Tarea de notificación',
      linkExterno: 'Enlace externo',
      permissoes: 'Quién puede ejecutarla',
      workspace: 'Workspace',
      tempoRegistrado: 'Tiempo registrado',
      estimativa: 'Estimación',
    },

    tempo: {
      secao: 'Tiempo',
      iniciar: 'Iniciar el cronómetro',
      parar: 'Parar el cronómetro',
      rodando: 'Cronómetro en marcha',
      registrar: 'Registrar tiempo',
      duracao: 'Duración',
      duracaoAjuda: 'Acepta 1h 30m, 90m o 1:30',
      quando: 'Cuándo',
      nota: 'Nota',
      notaPlaceholder: 'Qué se hizo en este tiempo',
      etiqueta: 'Etiqueta del registro',
      etiquetaPlaceholder: 'Análisis, Corrección, Reunión',
      faturavel: 'Facturable',
      naoFaturavel: 'No facturable',
      adicionar: 'Añadir',
      semRegistros: 'Ningún tiempo registrado todavía.',
      deEstimativa: (feito, estimado) => `${feito} de ${estimado}`,
      acimaDaEstimativa: excedente => `${excedente} por encima de la estimación`,
      apagarRegistro: 'Borrar el registro',
      editarRegistro: 'Editar el registro',
      registroApagado: 'Registro borrado.',
      tempoAdicionado: duracao => `${duracao} registrados.`,
      cronometroParado: duracao => `Cronómetro parado. ${duracao} registrados.`,
      porPessoa: 'Por persona',
      salvar: 'Guardar',
      registroAtualizado: 'Registro actualizado.',
    },

    status: { pending: 'Pendiente', working: 'En curso', blocked: 'Bloqueada', completed: 'Completada' },
    prioridade: { low: 'Baja', normal: 'Normal', high: 'Alta', urgent: 'Urgente' },
    tipo: { crud: 'Acción en registro', form: 'Formulario', generic: 'Simple', approval: 'Aprobación', start: 'Inicio de flujo' },

    semPrazo: 'Sin fecha',
    atrasadaDias: n => n === 0 ? 'Vence hoy' : `${n} ${n === 1 ? 'día' : 'días'} de retraso`,
    venceHoje: 'Vence hoy',
    venceAmanha: 'Vence mañana',
    venceEmDias: n => `Vence en ${n} días`,
    concluidaEm: data => `Completada el ${data}`,

    semResponsavel: 'Sin responsable',
    pontos: n => `${n} ${n === 1 ? 'punto' : 'puntos'}`,
    maisEtiquetas: n => `+${n}`,
    abrirTarefa: 'Abrir tarea',
    acoesDaTarefa: 'Acciones de la tarea',
    temDescricao: 'Tiene descripción. Abra la tarea para leerla entera',
    mostrarTudo: 'Mostrar la descripción entera',
    mostrarMenos: 'Mostrar menos',
    descricaoLonga: linhas => `Descripción larga, cortada en ${linhas} líneas`,
    respostaEnviada: 'Respuesta registrada',

    novaTarefaNaRaia: 'Nueva tarea aquí',
    acoesDaRaia: 'Acciones del carril',
    recolher: 'Contraer',
    expandir: 'Expandir',
    ocultarRaia: 'Ocultar carril',
    ordenarNestaRaia: 'Ordenar solo este carril',
    definirLimite: 'Definir límite de tarjetas',
    limiteExcedido: (n, limite) => `${n} de ${limite}, por encima del límite`,
    limiteTitulo: 'Límite de tarjetas',
    limiteAjuda: 'El carril avisa cuando pasa del límite. Nadie queda impedido de mover una tarjeta.',
    limitePergunta: '¿Cuántas tarjetas caben en este carril?',
    limiteSugestoes: 'Sugerencias',
    limiteAtual: (n, limite) => `${n} de ${limite} tarjetas`,
    limiteSemLimite: 'Sin límite',
    limiteRemover: 'Quitar el límite',
    limiteSalvar: 'Definir límite',
    limiteHoje: n => `Este carril tiene ${n} ${n === 1 ? 'tarjeta' : 'tarjetas'} ahora`,
    carregarMais: n => `Ver ${n} más`,
    raiaVazia: 'Ninguna tarea en este carril',
    raiaVaziaAjuda: 'Arrastre una tarjeta aquí o cree una tarea en este carril.',
    soltarAqui: 'Soltar aquí',

    calculadora: 'Totalizador',
    escolherCalculo: 'Elegir cálculo',
    calculos: {
      nenhum: 'Ninguno',
      contagem: 'Tareas',
      somaPontos: 'Suma de puntos',
      mediaPontos: 'Promedio de puntos',
      maiorPontuacao: 'Puntuación máxima',
      atrasadas: 'Atrasadas',
      semResponsavel: 'Sin responsable',
      prazoMaisProximo: 'Fecha más cercana',
    },
    aplicarEmTodas: 'Usar el mismo cálculo en todos los carriles',
    operacoes: { soma: 'Suma', media: 'Promedio', minimo: 'Mínimo', maximo: 'Máximo', preenchidos: 'Completadas' },
    campoDoCalculo: 'Campo',
    operacaoDoCalculo: 'Operación',
    semValorNaRaia: 'sin valor',
    cobertura: (com, total) => `${com} de ${total} completadas`,
    camposDaTarefa: 'De la tarea',
    camposDoFormulario: 'Del formulario',
    contagens: 'Conteos',
    numeros: 'Números',
    comoCalcular: 'Cómo calcular',
    ordemDaRaia: 'Ordenar solo este carril',
    usarOrdemDoQuadro: 'Usar el orden del tablero',
    ordemPropria: campo => `Este carril está ordenado por ${campo}`,

    editarTitulo: 'Editar el título',
    editarCampo: 'Editar',
    atribuirAMim: 'Asignarme',
    prazoHoje: 'Hoy',
    prazoAmanha: 'Mañana',
    prazoProximaSemana: 'La próxima semana',
    tirarPrazo: 'Sin fecha',
    criarEmRaia: raia => `La tarea nace en ${raia}`,
    cancelar: 'Cancelar',
    nomePlaceholder: '¿Qué hay que hacer?',
    dataLimitePlaceholder: 'Elija la fecha y la hora',
    responsavelPlaceholder: 'Elija quién lo hace',
    descricaoPlaceholder: 'Contexto, enlaces y lo que la persona necesita para resolverlo',
    campoObrigatorio: 'obligatorio',

    abaTarefa: 'Tarea',
    abaComentarios: 'Comentarios',
    abaLogs: 'Historial',
    detalhes: 'Detalles',
    formulario: 'Formulario',
    resultado: 'Lo que se respondió',
    dadosTecnicos: 'Datos técnicos',
    salvarRascunho: 'Guardar sin completar',
    concluirTarefa: 'Completar tarea',
    reabrirTarefa: 'Reabrir',
    tarefaConcluida: 'Esta tarea ya está completada.',
    obrigatorio: 'obligatorio',
    faltaResponder: 'Responda los campos obligatorios para completar.',
    selecione: 'Seleccione',
    escreva: 'Escriba aquí',
    verChamado: 'Abrir registro',
    copiarReferencia: 'Copiar referencia',
    referenciaCopiada: 'Referencia copiada.',
    fechar: 'Cerrar',
    semDescricao: 'Esta tarea no tiene descripción.',
    semFormulario: 'Esta tarea no pide formulario. Basta completarla.',
    comentariosVazios: 'Ningún comentario todavía.',
    logsVazios: 'Nada registrado todavía.',
    comentarioPlaceholder: 'Escriba un comentario. Use @ para mencionar y Ctrl+Enter para enviar',
    enviarComentario: 'Enviar comentario',
    logCriou: 'Creó',
    logConcluiu: 'Completó',
    logCriouFrase: nome => `${nome} creó una tarea`,
    logConcluiuFrase: nome => `${nome} completó la tarea`,
    haHoras: n => n < 1 ? 'hace un momento' : `hace ${n} ${n === 1 ? 'hora' : 'horas'}`,
    haDias: n => `hace ${n} ${n === 1 ? 'día' : 'días'}`,

    vazioTitulo: 'Este tablero todavía no tiene tareas',
    vazioDescricao: 'Las tareas rápidas llegan desde los spaceflows, cuando un flujo necesita la decisión de una persona. También puede crear una tarea directamente en el tablero.',
    buscaVaziaTitulo: termo => `Ninguna tarea coincide con "${termo}"`,
    buscaVaziaDescricao: 'Revise los términos de la búsqueda o limpie los filtros activos.',
    erroTitulo: 'No se pudieron cargar las tareas',
    erroDescricao: 'La conexión con el servidor falló. No se perdió ninguna tarea. Inténtelo de nuevo y, si el error continúa, hable con el soporte.',
    tentarDeNovo: 'Intentar de nuevo',
    somenteLeitura: 'Solo lectura',
    somenteLeituraAjuda: 'Puede ver este tablero, pero no mover ni crear tareas.',

    tarefaMovida: (nome, raia) => `"${nome}" pasó a ${raia}.`,
    tarefaSalva: 'Progreso guardado.',
    tarefaConcluidaToast: 'Tarea completada.',
    desfazer: 'Deshacer',
  },
}
