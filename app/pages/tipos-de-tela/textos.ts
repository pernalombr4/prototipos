// Os textos desta tela nos três idiomas do ENSPACE (regra 35).
//
// A casca copia o rótulo do develop, como a da galeria-de-casos-de-uso
// (conferida em 2026-10-20). O resto é a copy proposta para os 5 tipos de menu
// e para o módulo Requisições. O andaime fica só em português: não é produto.
//
// O dado do workspace (nome de categoria, de formulário, de etapa do fluxo,
// assunto da requisição) vem do mocks.ts e fica no idioma de quem configurou,
// como no produto.

import type { Idioma } from '../../composables/useIdioma'
import type { Area, EtapaDaRequisicao, EtapaDoFluxo, StatusDoItem, TipoDeArquivo, VisualizacaoSalva } from './mocks'

interface Casca {
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
  tiposDeMenu: string
  itens: Record<string, string>
}

export interface Textos {
  locale: string
  casca: Casca

  comum: {
    buscar: string
    exportar: string
    exportado: string
    cancelar: string
    fechar: string
    limpar: string
    desfazer: string
    abrirItem: string
    semValor: string
    tentarDeNovo: string
    carregando: string
    erroTitulo: string
    erroTexto: string
    semPermissaoTitulo: string
    semPermissaoTexto: string
    pedirAcesso: string
    acessoPedido: string
    acoes: string
    itens: (n: number) => string
    ninguem: string
  }

  status: Record<StatusDoItem, string>

  lista: {
    titulo: string
    descricao: string
    escopos: { todos: string, meus: string, grupo: string }
    mostrando: (escopo: 'todos' | 'meus' | 'grupo', n: number, categorias: number, grupo: string) => string
    dicaRecorte: string
    semGrupoTitulo: string
    semGrupoTexto: string
    categorias: string
    categoriasSelecionadas: (n: number) => string
    visualizacao: string
    visualizacoes: Record<VisualizacaoSalva, string>
    colunas: { referencia: string, titulo: string, categoria: string, status: string, responsavel: string, valor: string, dias: string, atualizado: string }
    dicaExpressao: string
    venceu: (n: number) => string
    vence: (n: number) => string
    venceHoje: string
    novoItem: string
    novoEm: (categoria: string) => string
    nadaEncontrado: string
    nadaEncontradoDica: string
    vazioTitulo: string
    vazioTexto: string
    vazioAcao: string
    criadoPor: string
    criadoEm: string
    grupos: string
  }

  fila: {
    titulo: string
    descricao: string
    escopos: { minhas: string, grupo: string, todas: string }
    todasSoGestor: string
    etapa: string
    todasEtapas: string
    etapas: Record<EtapaDoFluxo, string>
    situacao: { pendentes: string, concluidas: string }
    periodo: string
    periodos: { tudo: string, d7: string, d30: string, d90: string }
    ocultosPeloPeriodo: (n: number) => string
    mostrarTudo: string
    colunas: { tarefa: string, item: string, etapa: string, responsavel: string, prazo: string, valor: string, criada: string }
    grupo: (nome: string) => string
    atrasada: (n: number) => string
    venceHoje: string
    venceEm: (n: number) => string
    concluidaEm: string
    lote: (n: number, etapa: string) => string
    loteValor: (v: string) => string
    loteTrava: (etapa: string) => string
    loteDica: string
    removerSelecao: string
    aprovar: string
    reprovar: string
    confirmarTitulo: (acao: 'aprovar' | 'reprovar', n: number) => string
    confirmarTexto: string
    comentario: string
    comentarioPlaceholder: string
    comentarioObrigatorio: string
    executar: (acao: 'aprovar' | 'reprovar', n: number) => string
    processando: (feitas: number, total: number) => string
    resultadoTitulo: (ok: number) => string
    loteProcessado: string
    resultadoFalha: (n: number) => string
    motivoFalha: string
    entendi: string
    detalhes: string
    item: string
    atribuir: string
    atribuirA: string
    atribuida: (nome: string) => string
    pularEtapa: string
    pularEtapaDica: string
    pularEtapaSoGestor: string
    justificativa: string
    pulada: string
    reabrir: string
    reaberta: string
    aprovada: string
    reprovada: string
    vazioTitulo: string
    vazioTexto: string
  }

  painel: {
    titulo: string
    descricao: string
    editar: string
    filtroDoPainel: string
    periodo: string
    periodos: { ano: string, trimestre: string, d30: string, tudo: string }
    categoria: string
    todasCategorias: string
    responsavel: string
    todos: string
    limparFiltros: string
    widgets: {
      abertos: string
      concluidos: string
      atrasados: string
      valorVigente: string
      porStatus: string
      porMes: string
      vencendo: string
      porCategoria: string
    }
    filtroDoWidget: (rotulo: string) => string
    ignoraCategoria: string
    verItens: string
    filtrarWidget: string
    tirarFiltroWidget: string
    drillTitulo: (rotulo: string, n: number) => string
    abrirNaLista: string
    editarTitulo: string
    editarDescricao: string
    editarWidgets: string
    editarFiltros: string
    editarAplicar: string
    editarAplicado: string
    nenhumNoPeriodo: string
    vazioTitulo: string
    vazioTexto: string
    vazioAcao: string
  }

  documentos: {
    titulo: string
    descricao: string
    grade: string
    lista: string
    tipo: string
    todosTipos: string
    tipos: Record<TipoDeArquivo, string>
    categoria: string
    todasCategorias: string
    colunas: { nome: string, item: string, fluxo: string, gerado: string, tamanho: string }
    geradoPor: (fluxo: string) => string
    baixar: string
    baixado: (nome: string) => string
    previa: string
    previaPagina: (n: number, total: number) => string
    origem: string
    vazioTitulo: string
    vazioTexto: string
    vazioAcao: string
  }

  externa: {
    titulo: string
    conteudoDe: string
    aviso: string
    recarregar: string
    novaAba: string
    abriuNovaAba: string
    recusaTitulo: string
    recusaTexto: (dominio: string) => string
    novaAbaTitulo: string
    novaAbaTexto: (dominio: string) => string
  }

  abrir: {
    titulo: string
    descricao: string
    buscar: string
    todas: string
    areas: Record<Area, string>
    prazo: (dias: number) => string
    passaPorTriagem: string
    nenhum: string
    nenhumDica: string
    selecione: string
    obrigatorio: string
    campoObrigatorio: string
    enviar: string
    enviando: string
    sucessoTitulo: (numero: string) => string
    sucessoTexto: string
    sucessoTriagem: string
    acompanhar: string
    abrirOutra: string
    falhaTitulo: string
    falhaTexto: string
    voltar: string
    vazioTitulo: string
    vazioTexto: string
  }

  minhas: {
    titulo: string
    descricao: string
    abas: { andamento: string, concluidas: string, canceladas: string }
    aguardamVoce: (n: number) => string
    origem: string
    origens: { todas: string, formulario: string, email: string }
    area: string
    todasAreas: string
    colunas: { numero: string, assunto: string, formulario: string, etapa: string, responsavel: string, aberta: string, atualizada: string }
    etapas: Record<EtapaDaRequisicao, string>
    aguardaVoce: string
    andamento: string
    historico: string
    eventos: Record<string, string>
    respostas: string
    comentarios: string
    semComentarios: string
    comentarPlaceholder: string
    comentar: string
    comentado: string
    duplicar: string
    duplicada: (numero: string) => string
    cancelar: string
    cancelarTitulo: (numero: string) => string
    cancelarTexto: string
    cancelarConfirmar: string
    cancelada: (numero: string) => string
    vazioTitulo: string
    vazioTexto: string
    vazioAcao: string
  }

  triagem: {
    titulo: string
    descricao: string
    abas: { pendentes: string, revisao: string, decididas: string }
    origens: { formulario: string, email: string }
    solicitante: string
    recebida: string
    respostas: string
    mensagem: string
    aprovar: string
    reprovar: string
    pedirRevisao: string
    justificativa: string
    justificativaReprovar: string
    justificativaRevisao: string
    justificativaPlaceholder: string
    confirmarReprovar: string
    confirmarRevisao: string
    aprovada: (numero: string) => string
    reprovadaToast: (numero: string) => string
    revisaoToast: (numero: string) => string
    atalhos: string
    proxima: string
    anterior: string
    lote: (n: number, formulario: string) => string
    loteTrava: (formulario: string) => string
    aprovarLote: (n: number) => string
    reprovarLote: (n: number) => string
    lotesDecididos: (n: number) => string
    selecionar: string
    nadaSelecionado: string
    vazioTitulo: string
    vazioTexto: string
    decisao: Record<'aprovou' | 'reprovou' | 'pediuRevisao', string>
  }
}

/* ------------------------------------------------------------------ */

const casca: Record<Idioma, Casca> = {
  'pt-BR': {
    menuLateral: 'Menu do workspace', buscar: 'Buscar...', membro: 'Membro', configuracoes: 'Configurações',
    ajuda: 'Ajuda', trilha: 'Trilha', recolherMenu: 'Recolher o menu', abrirMenu: 'Abrir o menu',
    voltar: 'Voltar', avancar: 'Avançar', recarregar: 'Recarregar', suporte: 'Suporte',
    notificacoes: 'Notificações', idioma: 'Idioma', tema: 'Tema', conta: 'Sua conta',
    tiposDeMenu: 'Tipos de menu',
    itens: {
      inicio: 'Início', spaceflows: 'Spaceflows', categorias: 'Categorias', tarefas: 'Tarefas',
      agenda: 'Agenda', knowledge: 'Knowledge', visaoGeral: 'Visão Geral', sistema: 'Sistema',
      estrutura: 'Estrutura', gestaoDeMembros: 'Gestão de Membros', interface: 'Interface',
      menus: 'Menus', casosDeUso: 'Casos de Uso',
      emails: 'E-mails', integracoes: 'Integrações', agentesDeIa: 'Agentes de IA', logs: 'Logs',
      releases: 'Releases', documentacao: 'Documentação',
      requisicoes: 'Requisições', abrir: 'Abrir requisição', minhas: 'Minhas requisições', triagem: 'Triagem',
      lista: 'Lista de itens', fila: 'Fila de tarefas', painel: 'Painel', documentos: 'Documentos', externa: 'Página externa',
    },
  },
  'en': {
    menuLateral: 'Workspace menu', buscar: 'Search...', membro: 'Member', configuracoes: 'Settings',
    ajuda: 'Help', trilha: 'Breadcrumb', recolherMenu: 'Collapse the menu', abrirMenu: 'Open the menu',
    voltar: 'Back', avancar: 'Forward', recarregar: 'Reload', suporte: 'Support',
    notificacoes: 'Notifications', idioma: 'Language', tema: 'Theme', conta: 'Your account',
    tiposDeMenu: 'Menu types',
    itens: {
      inicio: 'Home', spaceflows: 'Spaceflows', categorias: 'Categories', tarefas: 'Tasks',
      agenda: 'Schedule', knowledge: 'Knowledge', visaoGeral: 'Overview', sistema: 'System',
      estrutura: 'Structure', gestaoDeMembros: 'Member management', interface: 'Interface',
      menus: 'Menus', casosDeUso: 'Use Cases',
      emails: 'Emails', integracoes: 'Integrations', agentesDeIa: 'AI agents', logs: 'Logs',
      releases: 'Releases', documentacao: 'Documentation',
      requisicoes: 'Requests', abrir: 'Open a request', minhas: 'My requests', triagem: 'Triage',
      lista: 'Item list', fila: 'Task queue', painel: 'Dashboard', documentos: 'Documents', externa: 'External page',
    },
  },
  'es': {
    menuLateral: 'Menú del workspace', buscar: 'Buscar...', membro: 'Miembro', configuracoes: 'Configuraciones',
    ajuda: 'Ayuda', trilha: 'Ruta', recolherMenu: 'Contraer el menú', abrirMenu: 'Abrir el menú',
    voltar: 'Volver', avancar: 'Avanzar', recarregar: 'Recargar', suporte: 'Soporte',
    notificacoes: 'Notificaciones', idioma: 'Idioma', tema: 'Tema', conta: 'Su cuenta',
    tiposDeMenu: 'Tipos de menú',
    itens: {
      inicio: 'Inicio', spaceflows: 'Spaceflows', categorias: 'Categorías', tarefas: 'Tareas',
      agenda: 'Agenda', knowledge: 'Knowledge', visaoGeral: 'Visión General', sistema: 'Sistema',
      estrutura: 'Estructura', gestaoDeMembros: 'Gestión de Miembros', interface: 'Interfaz',
      menus: 'Menús', casosDeUso: 'Casos de Uso',
      emails: 'Correos', integracoes: 'Integraciones', agentesDeIa: 'Agentes de IA', logs: 'Registros',
      releases: 'Releases', documentacao: 'Documentación',
      requisicoes: 'Solicitudes', abrir: 'Abrir solicitud', minhas: 'Mis solicitudes', triagem: 'Clasificación',
      lista: 'Lista de ítems', fila: 'Cola de tareas', painel: 'Panel', documentos: 'Documentos', externa: 'Página externa',
    },
  },
}

/* ------------------------------------------------------------------ */

const pt: Textos = {
  locale: 'pt-BR',
  casca: casca['pt-BR'],

  comum: {
    buscar: 'Buscar',
    exportar: 'Exportar',
    exportado: 'O arquivo foi gerado com os filtros ativos.',
    cancelar: 'Cancelar',
    fechar: 'Fechar',
    limpar: 'Limpar',
    desfazer: 'Desfazer',
    abrirItem: 'Abrir item',
    semValor: 'Sem valor',
    tentarDeNovo: 'Tentar de novo',
    carregando: 'Carregando',
    erroTitulo: 'Não foi possível carregar esta tela',
    erroTexto: 'O servidor não respondeu. Seus dados continuam salvos.',
    semPermissaoTitulo: 'Você não tem acesso a esta tela',
    semPermissaoTexto: 'Esta tela está liberada para outros grupos. Peça acesso a quem administra o workspace.',
    pedirAcesso: 'Pedir acesso',
    acessoPedido: 'Pedido de acesso enviado a quem administra o workspace.',
    acoes: 'Ações',
    itens: n => (n === 1 ? '1 item' : `${n} itens`),
    ninguem: 'Sem responsável',
  },

  status: {
    novo: 'Novo',
    em_andamento: 'Em andamento',
    aguardando: 'Aguardando',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
  },

  lista: {
    titulo: 'Lista de itens',
    descricao: 'Itens de Contratos, Fornecedores e Chamados de TI na mesma tabela.',
    escopos: { todos: 'Todos', meus: 'Só os meus', grupo: 'Do meu grupo' },
    mostrando: (escopo, n, c, grupo) => {
      const itens = n === 1 ? '1 item' : `${n} itens`
      const cats = c === 1 ? '1 categoria' : `${c} categorias`
      if (escopo === 'meus') return `Mostrando ${itens} criados por você, em ${cats}.`
      if (escopo === 'grupo') return `Mostrando ${itens} criados por pessoas do grupo ${grupo}, em ${cats}.`
      return `Mostrando ${itens} de ${cats}.`
    },
    dicaRecorte: 'O recorte organiza a tela. Quem vê cada item continua sendo decidido pela permissão da categoria.',
    semGrupoTitulo: 'Você não faz parte de nenhum grupo',
    semGrupoTexto: 'Esta opção mostra os itens das pessoas do seu grupo. Peça a quem administra o workspace para incluir você em um grupo.',
    categorias: 'Categorias',
    categoriasSelecionadas: n => (n === 1 ? '1 categoria' : `${n} categorias`),
    visualizacao: 'Visualização',
    visualizacoes: {
      'padrao': 'Padrão',
      'vencendo': 'Vencem em 30 dias',
      'alto-valor': 'Acima de R$ 100 mil',
      'sem-responsavel': 'Sem responsável',
    },
    colunas: { referencia: 'Referência', titulo: 'Título', categoria: 'Categoria', status: 'Status', responsavel: 'Responsável', valor: 'Valor', dias: 'Dias para vencer', atualizado: 'Atualizado em' },
    dicaExpressao: 'Coluna de expressão: data de vencimento menos hoje.',
    venceu: n => (n === 1 ? 'Venceu ontem' : `Venceu há ${n} dias`),
    vence: n => (n === 1 ? 'Amanhã' : `${n} dias`),
    venceHoje: 'Vence hoje',
    novoItem: 'Novo item',
    novoEm: c => `Em ${c}`,
    nadaEncontrado: 'Nenhum item encontrado',
    nadaEncontradoDica: 'Mude a busca, o recorte ou as categorias selecionadas.',
    vazioTitulo: 'Esta lista ainda não tem itens',
    vazioTexto: 'Os itens das categorias escolhidas aparecem aqui assim que alguém criar o primeiro.',
    vazioAcao: 'Criar o primeiro item',
    criadoPor: 'Criado por',
    criadoEm: 'Criado em',
    grupos: 'Grupos',
  },

  fila: {
    titulo: 'Fila de tarefas',
    descricao: 'Tarefas do fluxo de Contratos. Selecione as que pedem a mesma decisão e responda todas de uma vez.',
    escopos: { minhas: 'Aguardando minha ação', grupo: 'Do meu grupo', todas: 'Todas' },
    todasSoGestor: 'Só quem gerencia a categoria vê todas as tarefas.',
    etapa: 'Etapa',
    todasEtapas: 'Todas as etapas',
    etapas: { analise_juridica: 'Análise jurídica', aprovacao_financeira: 'Aprovação financeira', assinatura: 'Assinatura' },
    situacao: { pendentes: 'Pendentes', concluidas: 'Concluídas' },
    periodo: 'Período',
    periodos: { tudo: 'Todo o período', d7: 'Últimos 7 dias', d30: 'Últimos 30 dias', d90: 'Últimos 90 dias' },
    ocultosPeloPeriodo: n => (n === 1 ? '1 tarefa mais antiga fica de fora deste período.' : `${n} tarefas mais antigas ficam de fora deste período.`),
    mostrarTudo: 'Mostrar todo o período',
    colunas: { tarefa: 'Tarefa', item: 'Item', etapa: 'Etapa', responsavel: 'Responsável', prazo: 'Prazo', valor: 'Valor do contrato', criada: 'Criada em' },
    grupo: nome => `Grupo ${nome}`,
    atrasada: n => (n === 1 ? 'Atrasada há 1 dia' : `Atrasada há ${n} dias`),
    venceHoje: 'Vence hoje',
    venceEm: n => (n === 1 ? 'Vence amanhã' : `Vence em ${n} dias`),
    concluidaEm: 'Concluída',
    lote: (n, etapa) => (n === 1 ? `1 tarefa de ${etapa} selecionada` : `${n} tarefas de ${etapa} selecionadas`),
    loteValor: v => `Total: ${v}`,
    loteTrava: etapa => `O lote aceita tarefas de 1 etapa. Ficaram só as de ${etapa}.`,
    loteDica: 'O lote aceita tarefas da mesma etapa, porque a mesma resposta vale para todas.',
    removerSelecao: 'Limpar seleção',
    aprovar: 'Aprovar',
    reprovar: 'Reprovar',
    confirmarTitulo: (acao, n) => {
      const verbo = acao === 'aprovar' ? 'Aprovar' : 'Reprovar'
      return n === 1 ? `${verbo} 1 tarefa?` : `${verbo} ${n} tarefas?`
    },
    confirmarTexto: 'A mesma resposta vale para todas as tarefas da lista. Uma tarefa que falhar não interrompe as outras.',
    comentario: 'Comentário',
    comentarioPlaceholder: 'Escreva o motivo da decisão',
    comentarioObrigatorio: 'Para reprovar, escreva o motivo.',
    executar: (acao, n) => (acao === 'aprovar' ? `Aprovar ${n}` : `Reprovar ${n}`),
    processando: (f, total) => `Processando ${f} de ${total}`,
    resultadoTitulo: ok => (ok === 1 ? '1 tarefa concluída' : `${ok} tarefas concluídas`),
    loteProcessado: 'Lote processado',
    resultadoFalha: n => (n === 1 ? '1 tarefa não foi processada:' : `${n} tarefas não foram processadas:`),
    motivoFalha: 'O item foi alterado por outra pessoa depois que a tarefa abriu. Abra a tarefa para responder.',
    entendi: 'Entendi',
    detalhes: 'Detalhes da tarefa',
    item: 'Item',
    atribuir: 'Atribuir a outra pessoa',
    atribuirA: 'Escolha a pessoa',
    atribuida: nome => `Tarefa atribuída a ${nome}.`,
    pularEtapa: 'Pular etapa',
    pularEtapaDica: 'O fluxo segue para a próxima etapa sem a resposta desta. Fica registrado no histórico do item.',
    pularEtapaSoGestor: 'Só quem gerencia a categoria pode pular uma etapa.',
    justificativa: 'Justificativa',
    pulada: 'Etapa pulada. O fluxo seguiu para a próxima.',
    reabrir: 'Reabrir tarefa',
    reaberta: 'Tarefa reaberta. Ela volta para a fila de quem responde.',
    aprovada: 'Tarefa aprovada.',
    reprovada: 'Tarefa reprovada.',
    vazioTitulo: 'Nenhuma tarefa aguarda você',
    vazioTexto: 'Quando o fluxo de Contratos chegar a uma etapa sua, a tarefa aparece aqui.',
  },

  painel: {
    titulo: 'Painel',
    descricao: 'Indicadores de Contratos, Fornecedores e Chamados de TI.',
    editar: 'Editar painel',
    filtroDoPainel: 'Filtros do painel',
    periodo: 'Período',
    periodos: { ano: 'Este ano', trimestre: 'Último trimestre', d30: 'Últimos 30 dias', tudo: 'Todo o período' },
    categoria: 'Categoria',
    todasCategorias: 'Todas as categorias',
    responsavel: 'Responsável',
    todos: 'Todos',
    limparFiltros: 'Limpar filtros',
    widgets: {
      abertos: 'Itens abertos',
      concluidos: 'Concluídos no período',
      atrasados: 'Contratos vencidos',
      valorVigente: 'Valor em contratos abertos',
      porStatus: 'Itens por status',
      porMes: 'Itens criados por mês',
      vencendo: 'Contratos que vencem em 30 dias',
      porCategoria: 'Chamados de TI por status',
    },
    filtroDoWidget: r => `Filtro deste widget: ${r}`,
    ignoraCategoria: 'O filtro de categoria do painel não vale aqui: este widget lê só Chamados de TI.',
    verItens: 'Ver os itens',
    filtrarWidget: 'Filtrar só este widget',
    tirarFiltroWidget: 'Tirar o filtro deste widget',
    drillTitulo: (r, n) => `${r}: ${n === 1 ? '1 item' : `${n} itens`}`,
    abrirNaLista: 'Abrir na Lista de itens',
    editarTitulo: 'Editar painel',
    editarDescricao: 'Escolha os widgets e o filtro que o painel abre aplicado.',
    editarWidgets: 'Widgets',
    editarFiltros: 'Filtro padrão',
    editarAplicar: 'Aplicar',
    editarAplicado: 'Painel atualizado.',
    nenhumNoPeriodo: 'Nenhum item neste período.',
    vazioTitulo: 'Este painel ainda não tem dados',
    vazioTexto: 'Os widgets contam os itens das categorias ligadas ao painel. Assim que existir o primeiro item, os números aparecem.',
    vazioAcao: 'Ver as categorias do painel',
  },

  documentos: {
    titulo: 'Documentos',
    descricao: 'Arquivos que os fluxos de Contratos e Fornecedores geraram, com o item de origem.',
    grade: 'Grade',
    lista: 'Lista',
    tipo: 'Tipo',
    todosTipos: 'Todos os tipos',
    tipos: { pdf: 'PDF', docx: 'Word', xlsx: 'Excel' },
    categoria: 'Categoria',
    todasCategorias: 'Todas as categorias',
    colunas: { nome: 'Nome', item: 'Item de origem', fluxo: 'Gerado pelo fluxo', gerado: 'Gerado em', tamanho: 'Tamanho' },
    geradoPor: f => `Fluxo ${f}`,
    baixar: 'Baixar',
    baixado: nome => `${nome} baixado.`,
    previa: 'Prévia',
    previaPagina: (n, total) => `Página ${n} de ${total}`,
    origem: 'Item de origem',
    vazioTitulo: 'Nenhum documento ainda',
    vazioTexto: 'Os documentos desta tela vêm dos fluxos da categoria. Quando um fluxo gerar um arquivo, ele aparece aqui com o item de origem.',
    vazioAcao: 'Ver os fluxos de Contratos',
  },

  externa: {
    titulo: 'Página externa',
    conteudoDe: 'Conteúdo de',
    aviso: 'O ENSPACE não controla esta página.',
    recarregar: 'Recarregar a página',
    novaAba: 'Abrir em nova aba',
    abriuNovaAba: 'A página abriu em uma nova aba.',
    recusaTitulo: 'Este site não permite exibição dentro do ENSPACE',
    recusaTexto: d => `O endereço ${d} bloqueia a exibição dentro de outras páginas. Abra em uma nova aba para continuar.`,
    novaAbaTitulo: 'Esta página abre em uma nova aba',
    novaAbaTexto: d => `Quem configurou este menu escolheu abrir ${d} fora do ENSPACE.`,
  },

  abrir: {
    titulo: 'Abrir requisição',
    descricao: 'Escolha o que você precisa. A requisição segue para a equipe responsável, e você acompanha em Minhas requisições.',
    buscar: 'Buscar requisição',
    todas: 'Todas',
    areas: { rh: 'RH', ti: 'TI', compras: 'Compras', juridico: 'Jurídico' },
    prazo: d => (d === 1 ? 'Resposta em 1 dia útil' : `Resposta em ${d} dias úteis`),
    passaPorTriagem: 'Passa por triagem',
    nenhum: 'Nenhuma requisição encontrada',
    nenhumDica: 'Tente outra palavra ou escolha outra área.',
    selecione: 'Selecione',
    obrigatorio: 'Obrigatório',
    campoObrigatorio: 'Preencha este campo.',
    enviar: 'Enviar requisição',
    enviando: 'Enviando',
    sucessoTitulo: n => `Requisição ${n} criada`,
    sucessoTexto: 'A equipe responsável recebeu o pedido. O andamento fica em Minhas requisições.',
    sucessoTriagem: 'Antes do atendimento, a equipe confere o pedido na triagem.',
    acompanhar: 'Acompanhar em Minhas requisições',
    abrirOutra: 'Abrir outra requisição',
    falhaTitulo: 'Não foi possível enviar a requisição',
    falhaTexto: 'O servidor não respondeu. O que você preencheu continua aqui.',
    voltar: 'Voltar ao catálogo',
    vazioTitulo: 'Nenhuma requisição disponível',
    vazioTexto: 'Ainda não há formulários de requisição liberados para você. Quem administra o workspace publica os formulários em Configurações.',
  },

  minhas: {
    titulo: 'Minhas requisições',
    descricao: 'As requisições que você abriu, em todas as áreas.',
    abas: { andamento: 'Em andamento', concluidas: 'Concluídas', canceladas: 'Reprovadas e canceladas' },
    aguardamVoce: n => (n === 1 ? '1 requisição aguarda sua resposta.' : `${n} requisições aguardam sua resposta.`),
    origem: 'Origem',
    origens: { todas: 'Todas as origens', formulario: 'Formulário', email: 'E-mail' },
    area: 'Área',
    todasAreas: 'Todas as áreas',
    colunas: { numero: 'Número', assunto: 'Assunto', formulario: 'Requisição', etapa: 'Etapa', responsavel: 'Responsável', aberta: 'Aberta em', atualizada: 'Atualizada em' },
    etapas: { em_triagem: 'Em triagem', revisao_pedida: 'Aguarda sua resposta', em_atendimento: 'Em atendimento', concluida: 'Concluída', reprovada: 'Reprovada', cancelada: 'Cancelada' },
    aguardaVoce: 'A equipe pediu uma informação. Responda nos comentários.',
    andamento: 'Andamento',
    historico: 'Histórico',
    eventos: { abriu: 'abriu a requisição', aprovou: 'aprovou na triagem', reprovou: 'reprovou na triagem', pediuRevisao: 'pediu uma informação', concluiu: 'concluiu o atendimento', cancelou: 'cancelou a requisição', comentou: 'comentou' },
    respostas: 'O que foi pedido',
    comentarios: 'Comentários',
    semComentarios: 'Nenhum comentário.',
    comentarPlaceholder: 'Escreva para a equipe responsável',
    comentar: 'Comentar',
    comentado: 'Comentário enviado à equipe responsável.',
    duplicar: 'Duplicar',
    duplicada: n => `Requisição ${n} criada a partir da anterior.`,
    cancelar: 'Cancelar requisição',
    cancelarTitulo: n => `Cancelar a requisição ${n}?`,
    cancelarTexto: 'A equipe responsável deixa de atender este pedido. A requisição continua na aba Reprovadas e canceladas.',
    cancelarConfirmar: 'Cancelar requisição',
    cancelada: n => `Requisição ${n} cancelada.`,
    vazioTitulo: 'Você ainda não abriu nenhuma requisição',
    vazioTexto: 'O que você pedir pelo Abrir requisição aparece aqui, com a etapa e a pessoa responsável.',
    vazioAcao: 'Abrir requisição',
  },

  triagem: {
    titulo: 'Triagem',
    descricao: 'Requisições que chegam por formulário e por e-mail para o grupo Jurídico. Aprovada, a requisição vira item e segue para o atendimento.',
    abas: { pendentes: 'Pendentes', revisao: 'Aguardando o solicitante', decididas: 'Decididas' },
    origens: { formulario: 'Formulário', email: 'E-mail' },
    solicitante: 'Solicitante',
    recebida: 'Recebida',
    respostas: 'Respostas do formulário',
    mensagem: 'Mensagem recebida',
    aprovar: 'Aprovar',
    reprovar: 'Reprovar',
    pedirRevisao: 'Pedir informação',
    justificativa: 'Justificativa',
    justificativaReprovar: 'Escreva por que a requisição foi reprovada. O solicitante recebe este texto por e-mail.',
    justificativaRevisao: 'Escreva o que falta. O solicitante recebe este texto e responde pelos comentários.',
    justificativaPlaceholder: 'Por exemplo: falta a versão assinada do contrato original.',
    confirmarReprovar: 'Reprovar e avisar',
    confirmarRevisao: 'Pedir e avisar',
    aprovada: n => `${n} aprovada. Um item novo foi criado.`,
    reprovadaToast: n => `${n} reprovada. O solicitante foi avisado.`,
    revisaoToast: n => `Informação pedida em ${n}.`,
    atalhos: 'Atalhos',
    proxima: 'Próxima',
    anterior: 'Anterior',
    lote: (n, f) => (n === 1 ? `1 requisição de ${f} selecionada` : `${n} requisições de ${f} selecionadas`),
    loteTrava: f => `O lote aceita requisições de 1 formulário. Ficaram só as de ${f}.`,
    aprovarLote: n => `Aprovar ${n}`,
    reprovarLote: n => `Reprovar ${n}`,
    lotesDecididos: n => (n === 1 ? '1 requisição decidida.' : `${n} requisições decididas.`),
    selecionar: 'Selecionar',
    nadaSelecionado: 'Escolha uma requisição na lista para ver os detalhes.',
    vazioTitulo: 'Nenhuma requisição para triar',
    vazioTexto: 'As requisições novas do grupo Jurídico aparecem aqui assim que chegam.',
    decisao: { aprovou: 'Aprovada', reprovou: 'Reprovada', pediuRevisao: 'Informação pedida' },
  },
}

/* ------------------------------------------------------------------ */

const en: Textos = {
  locale: 'en',
  casca: casca.en,

  comum: {
    buscar: 'Search',
    exportar: 'Export',
    exportado: 'The file was generated with the active filters.',
    cancelar: 'Cancel',
    fechar: 'Close',
    limpar: 'Clear',
    desfazer: 'Undo',
    abrirItem: 'Open item',
    semValor: 'No value',
    tentarDeNovo: 'Try again',
    carregando: 'Loading',
    erroTitulo: 'This screen could not be loaded',
    erroTexto: 'The server did not respond. Your data is still saved.',
    semPermissaoTitulo: 'You do not have access to this screen',
    semPermissaoTexto: 'This screen is available to other groups. Ask a workspace administrator for access.',
    pedirAcesso: 'Request access',
    acessoPedido: 'Access request sent to the workspace administrators.',
    acoes: 'Actions',
    itens: n => (n === 1 ? '1 item' : `${n} items`),
    ninguem: 'No owner',
  },

  status: {
    novo: 'New',
    em_andamento: 'In progress',
    aguardando: 'Waiting',
    concluido: 'Done',
    cancelado: 'Canceled',
  },

  lista: {
    titulo: 'Item list',
    descricao: 'Items from Contracts, Suppliers and IT tickets in the same table.',
    escopos: { todos: 'All', meus: 'Only mine', grupo: 'My group' },
    mostrando: (escopo, n, c, grupo) => {
      const itens = n === 1 ? '1 item' : `${n} items`
      const cats = c === 1 ? '1 category' : `${c} categories`
      if (escopo === 'meus') return `Showing ${itens} created by you, in ${cats}.`
      if (escopo === 'grupo') return `Showing ${itens} created by people in the ${grupo} group, in ${cats}.`
      return `Showing ${itens} from ${cats}.`
    },
    dicaRecorte: 'The scope organizes the screen. Who sees each item is still decided by the category permission.',
    semGrupoTitulo: 'You are not in any group',
    semGrupoTexto: 'This option shows the items of the people in your group. Ask a workspace administrator to add you to a group.',
    categorias: 'Categories',
    categoriasSelecionadas: n => (n === 1 ? '1 category' : `${n} categories`),
    visualizacao: 'View',
    visualizacoes: {
      'padrao': 'Default',
      'vencendo': 'Due in 30 days',
      'alto-valor': 'Over R$ 100k',
      'sem-responsavel': 'No owner',
    },
    colunas: { referencia: 'Reference', titulo: 'Title', categoria: 'Category', status: 'Status', responsavel: 'Owner', valor: 'Value', dias: 'Days until due', atualizado: 'Updated on' },
    dicaExpressao: 'Expression column: due date minus today.',
    venceu: n => (n === 1 ? 'Overdue since yesterday' : `Overdue for ${n} days`),
    vence: n => (n === 1 ? 'Tomorrow' : `${n} days`),
    venceHoje: 'Due today',
    novoItem: 'New item',
    novoEm: c => `In ${c}`,
    nadaEncontrado: 'No items found',
    nadaEncontradoDica: 'Change the search, the scope or the selected categories.',
    vazioTitulo: 'This list has no items yet',
    vazioTexto: 'Items from the chosen categories show up here as soon as someone creates the first one.',
    vazioAcao: 'Create the first item',
    criadoPor: 'Created by',
    criadoEm: 'Created on',
    grupos: 'Groups',
  },

  fila: {
    titulo: 'Task queue',
    descricao: 'Tasks from the Contracts flow. Select the ones that need the same decision and answer them all at once.',
    escopos: { minhas: 'Waiting for me', grupo: 'My group', todas: 'All' },
    todasSoGestor: 'Only category managers see all tasks.',
    etapa: 'Step',
    todasEtapas: 'All steps',
    etapas: { analise_juridica: 'Legal review', aprovacao_financeira: 'Financial approval', assinatura: 'Signature' },
    situacao: { pendentes: 'Pending', concluidas: 'Completed' },
    periodo: 'Period',
    periodos: { tudo: 'All time', d7: 'Last 7 days', d30: 'Last 30 days', d90: 'Last 90 days' },
    ocultosPeloPeriodo: n => (n === 1 ? '1 older task is outside this period.' : `${n} older tasks are outside this period.`),
    mostrarTudo: 'Show all time',
    colunas: { tarefa: 'Task', item: 'Item', etapa: 'Step', responsavel: 'Assignee', prazo: 'Due', valor: 'Contract value', criada: 'Created on' },
    grupo: nome => `${nome} group`,
    atrasada: n => (n === 1 ? 'Overdue by 1 day' : `Overdue by ${n} days`),
    venceHoje: 'Due today',
    venceEm: n => (n === 1 ? 'Due tomorrow' : `Due in ${n} days`),
    concluidaEm: 'Completed',
    lote: (n, etapa) => (n === 1 ? `1 ${etapa} task selected` : `${n} ${etapa} tasks selected`),
    loteValor: v => `Total: ${v}`,
    loteTrava: etapa => `A batch takes tasks from 1 step. Only the ${etapa} ones were kept.`,
    loteDica: 'A batch takes tasks from the same step, because the same answer applies to all of them.',
    removerSelecao: 'Clear selection',
    aprovar: 'Approve',
    reprovar: 'Reject',
    confirmarTitulo: (acao, n) => {
      const verbo = acao === 'aprovar' ? 'Approve' : 'Reject'
      return n === 1 ? `${verbo} 1 task?` : `${verbo} ${n} tasks?`
    },
    confirmarTexto: 'The same answer applies to every task in the list. A task that fails does not stop the others.',
    comentario: 'Comment',
    comentarioPlaceholder: 'Write the reason for the decision',
    comentarioObrigatorio: 'To reject, write the reason.',
    executar: (acao, n) => (acao === 'aprovar' ? `Approve ${n}` : `Reject ${n}`),
    processando: (f, total) => `Processing ${f} of ${total}`,
    resultadoTitulo: ok => (ok === 1 ? '1 task completed' : `${ok} tasks completed`),
    loteProcessado: 'Batch processed',
    resultadoFalha: n => (n === 1 ? '1 task was not processed:' : `${n} tasks were not processed:`),
    motivoFalha: 'Someone else changed the item after the task opened. Open the task to answer it.',
    entendi: 'Got it',
    detalhes: 'Task details',
    item: 'Item',
    atribuir: 'Assign to someone else',
    atribuirA: 'Choose the person',
    atribuida: nome => `Task assigned to ${nome}.`,
    pularEtapa: 'Skip step',
    pularEtapaDica: 'The flow moves to the next step without this answer. It is recorded in the item history.',
    pularEtapaSoGestor: 'Only category managers can skip a step.',
    justificativa: 'Reason',
    pulada: 'Step skipped. The flow moved to the next one.',
    reabrir: 'Reopen task',
    reaberta: 'Task reopened. It goes back to the assignee queue.',
    aprovada: 'Task approved.',
    reprovada: 'Task rejected.',
    vazioTitulo: 'No tasks are waiting for you',
    vazioTexto: 'When the Contracts flow reaches one of your steps, the task shows up here.',
  },

  painel: {
    titulo: 'Dashboard',
    descricao: 'Indicators for Contracts, Suppliers and IT tickets.',
    editar: 'Edit dashboard',
    filtroDoPainel: 'Dashboard filters',
    periodo: 'Period',
    periodos: { ano: 'This year', trimestre: 'Last quarter', d30: 'Last 30 days', tudo: 'All time' },
    categoria: 'Category',
    todasCategorias: 'All categories',
    responsavel: 'Owner',
    todos: 'Everyone',
    limparFiltros: 'Clear filters',
    widgets: {
      abertos: 'Open items',
      concluidos: 'Completed in the period',
      atrasados: 'Expired contracts',
      valorVigente: 'Value in open contracts',
      porStatus: 'Items by status',
      porMes: 'Items created per month',
      vencendo: 'Contracts due in 30 days',
      porCategoria: 'IT tickets by status',
    },
    filtroDoWidget: r => `Widget filter: ${r}`,
    ignoraCategoria: 'The dashboard category filter does not apply here: this widget reads only IT tickets.',
    verItens: 'See the items',
    filtrarWidget: 'Filter this widget only',
    tirarFiltroWidget: 'Remove this widget filter',
    drillTitulo: (r, n) => `${r}: ${n === 1 ? '1 item' : `${n} items`}`,
    abrirNaLista: 'Open in Item list',
    editarTitulo: 'Edit dashboard',
    editarDescricao: 'Choose the widgets and the filter the dashboard opens with.',
    editarWidgets: 'Widgets',
    editarFiltros: 'Default filter',
    editarAplicar: 'Apply',
    editarAplicado: 'Dashboard updated.',
    nenhumNoPeriodo: 'No items in this period.',
    vazioTitulo: 'This dashboard has no data yet',
    vazioTexto: 'Widgets count the items of the categories linked to the dashboard. As soon as the first item exists, the numbers show up.',
    vazioAcao: 'See the dashboard categories',
  },

  documentos: {
    titulo: 'Documents',
    descricao: 'Files generated by the Contracts and Suppliers flows, with their source item.',
    grade: 'Grid',
    lista: 'List',
    tipo: 'Type',
    todosTipos: 'All types',
    tipos: { pdf: 'PDF', docx: 'Word', xlsx: 'Excel' },
    categoria: 'Category',
    todasCategorias: 'All categories',
    colunas: { nome: 'Name', item: 'Source item', fluxo: 'Generated by flow', gerado: 'Generated on', tamanho: 'Size' },
    geradoPor: f => `${f} flow`,
    baixar: 'Download',
    baixado: nome => `${nome} downloaded.`,
    previa: 'Preview',
    previaPagina: (n, total) => `Page ${n} of ${total}`,
    origem: 'Source item',
    vazioTitulo: 'No documents yet',
    vazioTexto: 'The documents on this screen come from the category flows. When a flow generates a file, it shows up here with its source item.',
    vazioAcao: 'See the Contracts flows',
  },

  externa: {
    titulo: 'External page',
    conteudoDe: 'Content from',
    aviso: 'ENSPACE does not control this page.',
    recarregar: 'Reload the page',
    novaAba: 'Open in a new tab',
    abriuNovaAba: 'The page opened in a new tab.',
    recusaTitulo: 'This site cannot be displayed inside ENSPACE',
    recusaTexto: d => `The address ${d} blocks being displayed inside other pages. Open it in a new tab to continue.`,
    novaAbaTitulo: 'This page opens in a new tab',
    novaAbaTexto: d => `Whoever configured this menu chose to open ${d} outside ENSPACE.`,
  },

  abrir: {
    titulo: 'Open a request',
    descricao: 'Choose what you need. The request goes to the responsible team, and you follow it in My requests.',
    buscar: 'Search requests',
    todas: 'All',
    areas: { rh: 'HR', ti: 'IT', compras: 'Purchasing', juridico: 'Legal' },
    prazo: d => (d === 1 ? 'Answer in 1 business day' : `Answer in ${d} business days`),
    passaPorTriagem: 'Goes through triage',
    nenhum: 'No requests found',
    nenhumDica: 'Try another word or choose another area.',
    selecione: 'Select',
    obrigatorio: 'Required',
    campoObrigatorio: 'Fill in this field.',
    enviar: 'Send request',
    enviando: 'Sending',
    sucessoTitulo: n => `Request ${n} created`,
    sucessoTexto: 'The responsible team received it. Follow the progress in My requests.',
    sucessoTriagem: 'Before working on it, the team reviews the request in triage.',
    acompanhar: 'Follow in My requests',
    abrirOutra: 'Open another request',
    falhaTitulo: 'The request could not be sent',
    falhaTexto: 'The server did not respond. What you filled in is still here.',
    voltar: 'Back to the catalog',
    vazioTitulo: 'No requests available',
    vazioTexto: 'There are no request forms available to you yet. Workspace administrators publish forms in Settings.',
  },

  minhas: {
    titulo: 'My requests',
    descricao: 'The requests you opened, in every area.',
    abas: { andamento: 'In progress', concluidas: 'Completed', canceladas: 'Rejected and canceled' },
    aguardamVoce: n => (n === 1 ? '1 request is waiting for your answer.' : `${n} requests are waiting for your answer.`),
    origem: 'Source',
    origens: { todas: 'All sources', formulario: 'Form', email: 'Email' },
    area: 'Area',
    todasAreas: 'All areas',
    colunas: { numero: 'Number', assunto: 'Subject', formulario: 'Request', etapa: 'Step', responsavel: 'Assignee', aberta: 'Opened on', atualizada: 'Updated on' },
    etapas: { em_triagem: 'In triage', revisao_pedida: 'Waiting for you', em_atendimento: 'In progress', concluida: 'Completed', reprovada: 'Rejected', cancelada: 'Canceled' },
    aguardaVoce: 'The team asked for more information. Answer in the comments.',
    andamento: 'Progress',
    historico: 'History',
    eventos: { abriu: 'opened the request', aprovou: 'approved it in triage', reprovou: 'rejected it in triage', pediuRevisao: 'asked for information', concluiu: 'completed the work', cancelou: 'canceled the request', comentou: 'commented' },
    respostas: 'What was requested',
    comentarios: 'Comments',
    semComentarios: 'No comments.',
    comentarPlaceholder: 'Write to the responsible team',
    comentar: 'Comment',
    comentado: 'Comment sent to the responsible team.',
    duplicar: 'Duplicate',
    duplicada: n => `Request ${n} created from the previous one.`,
    cancelar: 'Cancel request',
    cancelarTitulo: n => `Cancel request ${n}?`,
    cancelarTexto: 'The responsible team stops working on this request. It stays in the Rejected and canceled tab.',
    cancelarConfirmar: 'Cancel request',
    cancelada: n => `Request ${n} canceled.`,
    vazioTitulo: 'You have not opened any requests yet',
    vazioTexto: 'What you ask for in Open a request shows up here, with the step and the assignee.',
    vazioAcao: 'Open a request',
  },

  triagem: {
    titulo: 'Triage',
    descricao: 'Requests that arrive by form and by email for the Legal group. Once approved, the request becomes an item and moves on.',
    abas: { pendentes: 'Pending', revisao: 'Waiting for requester', decididas: 'Decided' },
    origens: { formulario: 'Form', email: 'Email' },
    solicitante: 'Requester',
    recebida: 'Received',
    respostas: 'Form answers',
    mensagem: 'Message received',
    aprovar: 'Approve',
    reprovar: 'Reject',
    pedirRevisao: 'Ask for information',
    justificativa: 'Reason',
    justificativaReprovar: 'Write why the request was rejected. The requester gets this text by email.',
    justificativaRevisao: 'Write what is missing. The requester gets this text and answers in the comments.',
    justificativaPlaceholder: 'For example: the signed version of the original contract is missing.',
    confirmarReprovar: 'Reject and notify',
    confirmarRevisao: 'Ask and notify',
    aprovada: n => `${n} approved. A new item was created.`,
    reprovadaToast: n => `${n} rejected. The requester was notified.`,
    revisaoToast: n => `Information requested on ${n}.`,
    atalhos: 'Shortcuts',
    proxima: 'Next',
    anterior: 'Previous',
    lote: (n, f) => (n === 1 ? `1 ${f} request selected` : `${n} ${f} requests selected`),
    loteTrava: f => `A batch takes requests from 1 form. Only the ${f} ones were kept.`,
    aprovarLote: n => `Approve ${n}`,
    reprovarLote: n => `Reject ${n}`,
    lotesDecididos: n => (n === 1 ? '1 request decided.' : `${n} requests decided.`),
    selecionar: 'Select',
    nadaSelecionado: 'Choose a request in the list to see its details.',
    vazioTitulo: 'No requests to triage',
    vazioTexto: 'New requests for the Legal group show up here as soon as they arrive.',
    decisao: { aprovou: 'Approved', reprovou: 'Rejected', pediuRevisao: 'Information requested' },
  },
}

/* ------------------------------------------------------------------ */

const es: Textos = {
  locale: 'es',
  casca: casca.es,

  comum: {
    buscar: 'Buscar',
    exportar: 'Exportar',
    exportado: 'El archivo se generó con los filtros activos.',
    cancelar: 'Cancelar',
    fechar: 'Cerrar',
    limpar: 'Limpiar',
    desfazer: 'Deshacer',
    abrirItem: 'Abrir ítem',
    semValor: 'Sin valor',
    tentarDeNovo: 'Intentar de nuevo',
    carregando: 'Cargando',
    erroTitulo: 'No fue posible cargar esta pantalla',
    erroTexto: 'El servidor no respondió. Sus datos siguen guardados.',
    semPermissaoTitulo: 'No tiene acceso a esta pantalla',
    semPermissaoTexto: 'Esta pantalla está habilitada para otros grupos. Solicite acceso a quien administra el workspace.',
    pedirAcesso: 'Solicitar acceso',
    acessoPedido: 'Solicitud de acceso enviada a quien administra el workspace.',
    acoes: 'Acciones',
    itens: n => (n === 1 ? '1 ítem' : `${n} ítems`),
    ninguem: 'Sin responsable',
  },

  status: {
    novo: 'Nuevo',
    em_andamento: 'En curso',
    aguardando: 'En espera',
    concluido: 'Concluido',
    cancelado: 'Cancelado',
  },

  lista: {
    titulo: 'Lista de ítems',
    descricao: 'Ítems de Contratos, Proveedores y Tickets de TI en la misma tabla.',
    escopos: { todos: 'Todos', meus: 'Solo los míos', grupo: 'De mi grupo' },
    mostrando: (escopo, n, c, grupo) => {
      const itens = n === 1 ? '1 ítem' : `${n} ítems`
      const cats = c === 1 ? '1 categoría' : `${c} categorías`
      if (escopo === 'meus') return `Mostrando ${itens} creados por usted, en ${cats}.`
      if (escopo === 'grupo') return `Mostrando ${itens} creados por personas del grupo ${grupo}, en ${cats}.`
      return `Mostrando ${itens} de ${cats}.`
    },
    dicaRecorte: 'El recorte organiza la pantalla. Quién ve cada ítem sigue dependiendo del permiso de la categoría.',
    semGrupoTitulo: 'No forma parte de ningún grupo',
    semGrupoTexto: 'Esta opción muestra los ítems de las personas de su grupo. Solicite a quien administra el workspace que lo incluya en un grupo.',
    categorias: 'Categorías',
    categoriasSelecionadas: n => (n === 1 ? '1 categoría' : `${n} categorías`),
    visualizacao: 'Visualización',
    visualizacoes: {
      'padrao': 'Predeterminada',
      'vencendo': 'Vencen en 30 días',
      'alto-valor': 'Más de R$ 100 mil',
      'sem-responsavel': 'Sin responsable',
    },
    colunas: { referencia: 'Referencia', titulo: 'Título', categoria: 'Categoría', status: 'Estado', responsavel: 'Responsable', valor: 'Valor', dias: 'Días para vencer', atualizado: 'Actualizado el' },
    dicaExpressao: 'Columna de expresión: fecha de vencimiento menos hoy.',
    venceu: n => (n === 1 ? 'Venció ayer' : `Venció hace ${n} días`),
    vence: n => (n === 1 ? 'Mañana' : `${n} días`),
    venceHoje: 'Vence hoy',
    novoItem: 'Nuevo ítem',
    novoEm: c => `En ${c}`,
    nadaEncontrado: 'No se encontraron ítems',
    nadaEncontradoDica: 'Cambie la búsqueda, el recorte o las categorías seleccionadas.',
    vazioTitulo: 'Esta lista aún no tiene ítems',
    vazioTexto: 'Los ítems de las categorías elegidas aparecen aquí apenas alguien cree el primero.',
    vazioAcao: 'Crear el primer ítem',
    criadoPor: 'Creado por',
    criadoEm: 'Creado el',
    grupos: 'Grupos',
  },

  fila: {
    titulo: 'Cola de tareas',
    descricao: 'Tareas del flujo de Contratos. Seleccione las que piden la misma decisión y responda todas a la vez.',
    escopos: { minhas: 'Esperando mi acción', grupo: 'De mi grupo', todas: 'Todas' },
    todasSoGestor: 'Solo quien gestiona la categoría ve todas las tareas.',
    etapa: 'Etapa',
    todasEtapas: 'Todas las etapas',
    etapas: { analise_juridica: 'Análisis jurídico', aprovacao_financeira: 'Aprobación financiera', assinatura: 'Firma' },
    situacao: { pendentes: 'Pendientes', concluidas: 'Concluidas' },
    periodo: 'Período',
    periodos: { tudo: 'Todo el período', d7: 'Últimos 7 días', d30: 'Últimos 30 días', d90: 'Últimos 90 días' },
    ocultosPeloPeriodo: n => (n === 1 ? '1 tarea más antigua queda fuera de este período.' : `${n} tareas más antiguas quedan fuera de este período.`),
    mostrarTudo: 'Mostrar todo el período',
    colunas: { tarefa: 'Tarea', item: 'Ítem', etapa: 'Etapa', responsavel: 'Responsable', prazo: 'Plazo', valor: 'Valor del contrato', criada: 'Creada el' },
    grupo: nome => `Grupo ${nome}`,
    atrasada: n => (n === 1 ? 'Atrasada hace 1 día' : `Atrasada hace ${n} días`),
    venceHoje: 'Vence hoy',
    venceEm: n => (n === 1 ? 'Vence mañana' : `Vence en ${n} días`),
    concluidaEm: 'Concluida',
    lote: (n, etapa) => (n === 1 ? `1 tarea de ${etapa} seleccionada` : `${n} tareas de ${etapa} seleccionadas`),
    loteValor: v => `Total: ${v}`,
    loteTrava: etapa => `El lote acepta tareas de 1 etapa. Quedaron solo las de ${etapa}.`,
    loteDica: 'El lote acepta tareas de la misma etapa, porque la misma respuesta vale para todas.',
    removerSelecao: 'Limpiar selección',
    aprovar: 'Aprobar',
    reprovar: 'Rechazar',
    confirmarTitulo: (acao, n) => {
      const verbo = acao === 'aprovar' ? 'Aprobar' : 'Rechazar'
      return `¿${verbo} ${n === 1 ? '1 tarea' : `${n} tareas`}?`
    },
    confirmarTexto: 'La misma respuesta vale para todas las tareas de la lista. Una tarea que falle no interrumpe las demás.',
    comentario: 'Comentario',
    comentarioPlaceholder: 'Escriba el motivo de la decisión',
    comentarioObrigatorio: 'Para rechazar, escriba el motivo.',
    executar: (acao, n) => (acao === 'aprovar' ? `Aprobar ${n}` : `Rechazar ${n}`),
    processando: (f, total) => `Procesando ${f} de ${total}`,
    resultadoTitulo: ok => (ok === 1 ? '1 tarea concluida' : `${ok} tareas concluidas`),
    loteProcessado: 'Lote procesado',
    resultadoFalha: n => (n === 1 ? '1 tarea no se procesó:' : `${n} tareas no se procesaron:`),
    motivoFalha: 'Otra persona modificó el ítem después de que se abrió la tarea. Abra la tarea para responder.',
    entendi: 'Entendido',
    detalhes: 'Detalles de la tarea',
    item: 'Ítem',
    atribuir: 'Asignar a otra persona',
    atribuirA: 'Elija la persona',
    atribuida: nome => `Tarea asignada a ${nome}.`,
    pularEtapa: 'Saltar etapa',
    pularEtapaDica: 'El flujo pasa a la siguiente etapa sin la respuesta de esta. Queda registrado en el historial del ítem.',
    pularEtapaSoGestor: 'Solo quien gestiona la categoría puede saltar una etapa.',
    justificativa: 'Justificación',
    pulada: 'Etapa saltada. El flujo pasó a la siguiente.',
    reabrir: 'Reabrir tarea',
    reaberta: 'Tarea reabierta. Vuelve a la cola de quien responde.',
    aprovada: 'Tarea aprobada.',
    reprovada: 'Tarea rechazada.',
    vazioTitulo: 'Ninguna tarea espera su acción',
    vazioTexto: 'Cuando el flujo de Contratos llegue a una de sus etapas, la tarea aparece aquí.',
  },

  painel: {
    titulo: 'Panel',
    descricao: 'Indicadores de Contratos, Proveedores y Tickets de TI.',
    editar: 'Editar panel',
    filtroDoPainel: 'Filtros del panel',
    periodo: 'Período',
    periodos: { ano: 'Este año', trimestre: 'Último trimestre', d30: 'Últimos 30 días', tudo: 'Todo el período' },
    categoria: 'Categoría',
    todasCategorias: 'Todas las categorías',
    responsavel: 'Responsable',
    todos: 'Todos',
    limparFiltros: 'Limpiar filtros',
    widgets: {
      abertos: 'Ítems abiertos',
      concluidos: 'Concluidos en el período',
      atrasados: 'Contratos vencidos',
      valorVigente: 'Valor en contratos abiertos',
      porStatus: 'Ítems por estado',
      porMes: 'Ítems creados por mes',
      vencendo: 'Contratos que vencen en 30 días',
      porCategoria: 'Tickets de TI por estado',
    },
    filtroDoWidget: r => `Filtro de este widget: ${r}`,
    ignoraCategoria: 'El filtro de categoría del panel no aplica aquí: este widget lee solo Tickets de TI.',
    verItens: 'Ver los ítems',
    filtrarWidget: 'Filtrar solo este widget',
    tirarFiltroWidget: 'Quitar el filtro de este widget',
    drillTitulo: (r, n) => `${r}: ${n === 1 ? '1 ítem' : `${n} ítems`}`,
    abrirNaLista: 'Abrir en Lista de ítems',
    editarTitulo: 'Editar panel',
    editarDescricao: 'Elija los widgets y el filtro con el que abre el panel.',
    editarWidgets: 'Widgets',
    editarFiltros: 'Filtro predeterminado',
    editarAplicar: 'Aplicar',
    editarAplicado: 'Panel actualizado.',
    nenhumNoPeriodo: 'Ningún ítem en este período.',
    vazioTitulo: 'Este panel aún no tiene datos',
    vazioTexto: 'Los widgets cuentan los ítems de las categorías vinculadas al panel. Apenas exista el primer ítem, aparecen los números.',
    vazioAcao: 'Ver las categorías del panel',
  },

  documentos: {
    titulo: 'Documentos',
    descricao: 'Archivos que generaron los flujos de Contratos y Proveedores, con el ítem de origen.',
    grade: 'Cuadrícula',
    lista: 'Lista',
    tipo: 'Tipo',
    todosTipos: 'Todos los tipos',
    tipos: { pdf: 'PDF', docx: 'Word', xlsx: 'Excel' },
    categoria: 'Categoría',
    todasCategorias: 'Todas las categorías',
    colunas: { nome: 'Nombre', item: 'Ítem de origen', fluxo: 'Generado por el flujo', gerado: 'Generado el', tamanho: 'Tamaño' },
    geradoPor: f => `Flujo ${f}`,
    baixar: 'Descargar',
    baixado: nome => `${nome} descargado.`,
    previa: 'Vista previa',
    previaPagina: (n, total) => `Página ${n} de ${total}`,
    origem: 'Ítem de origen',
    vazioTitulo: 'Aún no hay documentos',
    vazioTexto: 'Los documentos de esta pantalla vienen de los flujos de la categoría. Cuando un flujo genere un archivo, aparece aquí con el ítem de origen.',
    vazioAcao: 'Ver los flujos de Contratos',
  },

  externa: {
    titulo: 'Página externa',
    conteudoDe: 'Contenido de',
    aviso: 'ENSPACE no controla esta página.',
    recarregar: 'Recargar la página',
    novaAba: 'Abrir en una pestaña nueva',
    abriuNovaAba: 'La página se abrió en una pestaña nueva.',
    recusaTitulo: 'Este sitio no permite mostrarse dentro de ENSPACE',
    recusaTexto: d => `La dirección ${d} bloquea su visualización dentro de otras páginas. Ábrala en una pestaña nueva para continuar.`,
    novaAbaTitulo: 'Esta página se abre en una pestaña nueva',
    novaAbaTexto: d => `Quien configuró este menú eligió abrir ${d} fuera de ENSPACE.`,
  },

  abrir: {
    titulo: 'Abrir solicitud',
    descricao: 'Elija lo que necesita. La solicitud va al equipo responsable y usted la sigue en Mis solicitudes.',
    buscar: 'Buscar solicitud',
    todas: 'Todas',
    areas: { rh: 'RR. HH.', ti: 'TI', compras: 'Compras', juridico: 'Jurídico' },
    prazo: d => (d === 1 ? 'Respuesta en 1 día hábil' : `Respuesta en ${d} días hábiles`),
    passaPorTriagem: 'Pasa por clasificación',
    nenhum: 'No se encontraron solicitudes',
    nenhumDica: 'Pruebe otra palabra o elija otra área.',
    selecione: 'Seleccione',
    obrigatorio: 'Obligatorio',
    campoObrigatorio: 'Complete este campo.',
    enviar: 'Enviar solicitud',
    enviando: 'Enviando',
    sucessoTitulo: n => `Solicitud ${n} creada`,
    sucessoTexto: 'El equipo responsable recibió el pedido. El avance queda en Mis solicitudes.',
    sucessoTriagem: 'Antes de atenderla, el equipo revisa la solicitud en la clasificación.',
    acompanhar: 'Seguir en Mis solicitudes',
    abrirOutra: 'Abrir otra solicitud',
    falhaTitulo: 'No fue posible enviar la solicitud',
    falhaTexto: 'El servidor no respondió. Lo que completó sigue aquí.',
    voltar: 'Volver al catálogo',
    vazioTitulo: 'Ninguna solicitud disponible',
    vazioTexto: 'Aún no hay formularios de solicitud habilitados para usted. Quien administra el workspace publica los formularios en Configuraciones.',
  },

  minhas: {
    titulo: 'Mis solicitudes',
    descricao: 'Las solicitudes que usted abrió, en todas las áreas.',
    abas: { andamento: 'En curso', concluidas: 'Concluidas', canceladas: 'Rechazadas y canceladas' },
    aguardamVoce: n => (n === 1 ? '1 solicitud espera su respuesta.' : `${n} solicitudes esperan su respuesta.`),
    origem: 'Origen',
    origens: { todas: 'Todos los orígenes', formulario: 'Formulario', email: 'Correo' },
    area: 'Área',
    todasAreas: 'Todas las áreas',
    colunas: { numero: 'Número', assunto: 'Asunto', formulario: 'Solicitud', etapa: 'Etapa', responsavel: 'Responsable', aberta: 'Abierta el', atualizada: 'Actualizada el' },
    etapas: { em_triagem: 'En clasificación', revisao_pedida: 'Espera su respuesta', em_atendimento: 'En atención', concluida: 'Concluida', reprovada: 'Rechazada', cancelada: 'Cancelada' },
    aguardaVoce: 'El equipo pidió información. Responda en los comentarios.',
    andamento: 'Avance',
    historico: 'Historial',
    eventos: { abriu: 'abrió la solicitud', aprovou: 'aprobó en la clasificación', reprovou: 'rechazó en la clasificación', pediuRevisao: 'pidió información', concluiu: 'concluyó la atención', cancelou: 'canceló la solicitud', comentou: 'comentó' },
    respostas: 'Lo que se pidió',
    comentarios: 'Comentarios',
    semComentarios: 'Ningún comentario.',
    comentarPlaceholder: 'Escriba al equipo responsable',
    comentar: 'Comentar',
    comentado: 'Comentario enviado al equipo responsable.',
    duplicar: 'Duplicar',
    duplicada: n => `Solicitud ${n} creada a partir de la anterior.`,
    cancelar: 'Cancelar solicitud',
    cancelarTitulo: n => `¿Cancelar la solicitud ${n}?`,
    cancelarTexto: 'El equipo responsable deja de atender este pedido. La solicitud sigue en la pestaña Rechazadas y canceladas.',
    cancelarConfirmar: 'Cancelar solicitud',
    cancelada: n => `Solicitud ${n} cancelada.`,
    vazioTitulo: 'Aún no abrió ninguna solicitud',
    vazioTexto: 'Lo que pida en Abrir solicitud aparece aquí, con la etapa y la persona responsable.',
    vazioAcao: 'Abrir solicitud',
  },

  triagem: {
    titulo: 'Clasificación',
    descricao: 'Solicitudes que llegan por formulario y por correo para el grupo Jurídico. Aprobada, la solicitud se convierte en ítem y sigue a la atención.',
    abas: { pendentes: 'Pendientes', revisao: 'Esperando al solicitante', decididas: 'Decididas' },
    origens: { formulario: 'Formulario', email: 'Correo' },
    solicitante: 'Solicitante',
    recebida: 'Recibida',
    respostas: 'Respuestas del formulario',
    mensagem: 'Mensaje recibido',
    aprovar: 'Aprobar',
    reprovar: 'Rechazar',
    pedirRevisao: 'Pedir información',
    justificativa: 'Justificación',
    justificativaReprovar: 'Escriba por qué se rechazó la solicitud. El solicitante recibe este texto por correo.',
    justificativaRevisao: 'Escriba lo que falta. El solicitante recibe este texto y responde en los comentarios.',
    justificativaPlaceholder: 'Por ejemplo: falta la versión firmada del contrato original.',
    confirmarReprovar: 'Rechazar y avisar',
    confirmarRevisao: 'Pedir y avisar',
    aprovada: n => `${n} aprobada. Se creó un ítem nuevo.`,
    reprovadaToast: n => `${n} rechazada. Se avisó al solicitante.`,
    revisaoToast: n => `Información pedida en ${n}.`,
    atalhos: 'Atajos',
    proxima: 'Siguiente',
    anterior: 'Anterior',
    lote: (n, f) => (n === 1 ? `1 solicitud de ${f} seleccionada` : `${n} solicitudes de ${f} seleccionadas`),
    loteTrava: f => `El lote acepta solicitudes de 1 formulario. Quedaron solo las de ${f}.`,
    aprovarLote: n => `Aprobar ${n}`,
    reprovarLote: n => `Rechazar ${n}`,
    lotesDecididos: n => (n === 1 ? '1 solicitud decidida.' : `${n} solicitudes decididas.`),
    selecionar: 'Seleccionar',
    nadaSelecionado: 'Elija una solicitud en la lista para ver los detalles.',
    vazioTitulo: 'Ninguna solicitud para clasificar',
    vazioTexto: 'Las solicitudes nuevas del grupo Jurídico aparecen aquí apenas llegan.',
    decisao: { aprovou: 'Aprobada', reprovou: 'Rechazada', pediuRevisao: 'Información pedida' },
  },
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, en, es }
