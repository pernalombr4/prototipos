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
  temFormulario: string
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
    maisEtiquetas: n => `mais ${n}`,
    abrirTarefa: 'Abrir tarefa',
    acoesDaTarefa: 'Ações da tarefa',
    temFormulario: 'Pede formulário',
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
    raiaVazia: 'Nada aqui',
    raiaVaziaAjuda: 'Arraste um cartão ou crie uma tarefa.',
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

    vazioTitulo: 'Nenhuma tarefa por aqui',
    vazioDescricao: 'As tarefas rápidas chegam pelos spaceflows. Você também pode criar uma à mão.',
    buscaVaziaTitulo: termo => `Nada encontrado para "${termo}"`,
    buscaVaziaDescricao: 'Tente outro termo ou limpe os filtros.',
    erroTitulo: 'Não deu para carregar as tarefas',
    erroDescricao: 'Suas tarefas continuam lá. É só tentar de novo.',
    tentarDeNovo: 'Tentar de novo',
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
    maisEtiquetas: n => `${n} more`,
    abrirTarefa: 'Open task',
    acoesDaTarefa: 'Task actions',
    temFormulario: 'Asks for a form',
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
    raiaVazia: 'Nothing here',
    raiaVaziaAjuda: 'Drag a card in or create a task.',
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

    vazioTitulo: 'No tasks here',
    vazioDescricao: 'Quick tasks arrive from spaceflows. You can also create one by hand.',
    buscaVaziaTitulo: termo => `Nothing found for "${termo}"`,
    buscaVaziaDescricao: 'Try another term or clear the filters.',
    erroTitulo: 'The tasks could not be loaded',
    erroDescricao: 'Your tasks are still there. Just try again.',
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
    maisEtiquetas: n => `${n} más`,
    abrirTarefa: 'Abrir tarea',
    acoesDaTarefa: 'Acciones de la tarea',
    temFormulario: 'Pide formulario',
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
    raiaVazia: 'Nada por aquí',
    raiaVaziaAjuda: 'Arrastre una tarjeta o cree una tarea.',
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

    vazioTitulo: 'Ninguna tarea por aquí',
    vazioDescricao: 'Las tareas rápidas llegan por los spaceflows. También puede crear una a mano.',
    buscaVaziaTitulo: termo => `Nada encontrado para "${termo}"`,
    buscaVaziaDescricao: 'Pruebe otro término o limpie los filtros.',
    erroTitulo: 'No se pudieron cargar las tareas',
    erroDescricao: 'Sus tareas siguen ahí. Solo hay que intentar de nuevo.',
    tentarDeNovo: 'Intentar de nuevo',
    somenteLeitura: 'Solo lectura',
    somenteLeituraAjuda: 'Puede ver este tablero, pero no mover ni crear tareas.',

    tarefaMovida: (nome, raia) => `"${nome}" pasó a ${raia}.`,
    tarefaSalva: 'Progreso guardado.',
    tarefaConcluidaToast: 'Tarea completada.',
    desfazer: 'Deshacer',
  },
}
