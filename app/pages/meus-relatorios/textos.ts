/**
 * A copy do protótipo "Meus relatórios" nos três idiomas do ENSPACE.
 *
 * Dois tipos de texto moram aqui:
 * - `casca` e `itens`: cópia do develop (rótulo como está lá, inclusive a
 *   caixa alta de "Relatório Padrão" e "Extrair Relatório"). Não é proposta;
 * - o resto: a proposta, escrito para ir ao produto.
 *
 * Sem travessão em nada que aparece na tela (regra 33).
 */
import type { Idioma } from '~/composables/useIdioma'
import type { ChaveDaOrigem, FiltroAplicado, StatusDoPedido } from './mocks'

type Plural = (n: number) => string

export interface Textos {
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
    novo: string
    itens: Record<string, string>
    /** Leitor de tela do item do menu enquanto há relatório gerando. */
    gerandoNoMenu: string
    /** Leitor de tela do contador de prontos ainda não vistos. */
    prontosNaoVistos: Plural
  }
  workspace: string
  trilhaCategorias: string

  /**
   * O nome da tela, nas 2 opções que o andaime alterna. O mesmo nome vai ao
   * menu, à trilha, ao título e aos avisos.
   */
  nomes: { exportacoes: string, relatorios: string }
  descricao: string

  barra: {
    pesquisar: string
    criadoEm: string
    periodos: { todo: string, hoje: string, d7: string, d30: string, d90: string }
    status: string
    origem: string
    formato: string
    colunas: string
    limparFiltros: string
    atualizado: string
  }


  colunas: {
    relatorio: string
    origem: string
    status: string
    formato: string
    registros: string
    filtros: string
    tamanho: string
    criadoEm: string
  }

  status: Record<StatusDoPedido, string>
  origens: Record<Exclude<ChaveDaOrigem, 'c_items'>, string>
  modeloPadrao: string
  operadores: Record<FiltroAplicado['operador'], string>
  nFiltros: Plural
  semFiltro: string
  registros: Plural
  semRegistros: string
  gerandoPct: (n: number) => string

  acoes: {
    verDetalhes: string
    baixar: string
    baixarArquivo: (formato: string, tamanho: string) => string
    extrairDeNovo: string
    abrirNaOrigem: string
    copiarLink: string
    excluir: string
    tentarDeNovo: string
    maisAcoes: string
    fechar: string
  }

  painel: {
    titulo: string
    resumo: string
    origem: string
    visualizacao: string
    modelo: string
    formato: string
    registros: string
    tamanho: string
    pedidoEm: string
    prontoEm: string
    emSegundos: (s: number) => string
    baixado: string
    vezes: Plural
    nunca: string
    filtrosAplicados: string
    verNoPainel: string
    ordenacao: string
    colunasExportadas: Plural
    verTodas: string
    verMenos: string
    historico: string
    eventos: { pedido: string, gerado: string, baixado: string, falhou: string, naFila: string, gerando: string }
    naFilaAjuda: string
    gerandoAjuda: string
    falhouTitulo: string
    arquivo: string
    semFiltroAjuda: string
  }

  /** O filtro e a ordenação no cabeçalho de cada coluna. */
  coluna: {
    filtrar: (coluna: string) => string
    ordenar: (coluna: string) => string
    limpar: string
    contem: string
    minimo: string
    maximo: string
    comFiltro: string
    faixas: { ate100k: string, ate1m: string, acima1m: string }
  }

  selecao: {
    contagem: (n: number, total: number) => string
    selecionados: Plural
    baixar: string
    excluir: string
    limpar: string
  }

  avisos: {
    gerandoTitulo: (origem: string) => string
    gerandoDescricao: string
    prontoTitulo: string
    prontoDescricao: (origem: string, registros: string) => string
    verNaTela: (tela: string) => string
    falhouTitulo: string
    falhouDescricao: (origem: string, tela: string) => string
    download: (nome: string) => string
    downloadVarios: Plural
    linkCopiado: string
    excluidos: Plural
    desfazer: string
    extraindoDeNovo: string
    abrindoOrigem: (origem: string) => string
  }

  vazio: {
    titulo: string
    descricao: string
    buscaTitulo: (busca: string) => string
    buscaDescricao: string
    erroTitulo: string
    erroDescricao: string
  }

  sino: {
    titulo: string
    marcarLidas: string
    pronto: (origem: string) => string
    falhou: (origem: string) => string
    semNotificacao: string
  }

  /** A tela de itens de hoje, cópia do develop (só a origem da jornada). */
  itens: {
    aba: string
    visualizar: string
    pesquisar: string
    criadoEm: string
    todoPeriodo: string
    extrair: string
    padrao: string
    colunas: string
    filtros: string
    configurar: string
    novoRegistro: string
    formatoTitulo: string
    formatoDescricao: string
    acoes: string
    mostrando: (a: number, b: number, total: number) => string
    porPagina: string
    cabecalho: { referencia: string, status: string, contratante: string, fornecedor: string, valor: string, fim: string }
  }

  data: {
    hoje: (hora: string) => string
    ontem: (hora: string) => string
    agora: string
    haMin: (n: number) => string
    haH: (n: number) => string
  }
}

const casca = {
  'pt-BR': {
    menuLateral: 'Menu do workspace', buscar: 'Buscar...', membro: 'Membro', configuracoes: 'Configurações',
    ajuda: 'Ajuda', trilha: 'Trilha', recolherMenu: 'Recolher o menu', abrirMenu: 'Abrir o menu',
    voltar: 'Voltar', avancar: 'Avançar', recarregar: 'Recarregar', suporte: 'Suporte',
    notificacoes: 'Notificações', idioma: 'Idioma', tema: 'Tema', conta: 'Sua conta', novo: 'Novo',
    itens: {
      inicio: 'Início', spaceflows: 'Spaceflows', categorias: 'Categorias', tarefas: 'Tarefas',
      agendadas: 'Agendadas', rapidas: 'Rápidas', agenda: 'Agenda', knowledge: 'Knowledge',
      visaoGeral: 'Visão Geral', sistema: 'Sistema', estrutura: 'Estrutura', gestaoDeMembros: 'Gestão de Membros',
      interface: 'Interface', emails: 'E-mails', integracoes: 'Integrações', agentesDeIa: 'Agentes de IA',
      logs: 'Logs', releases: 'Releases', documentacao: 'Documentação', todos: 'Todos',
    },
    gerandoNoMenu: 'Relatório gerando',
    prontosNaoVistos: (n: number) => n === 1 ? '1 relatório pronto para baixar' : `${n} relatórios prontos para baixar`,
  },
  'en': {
    menuLateral: 'Workspace menu', buscar: 'Search...', membro: 'Member', configuracoes: 'Settings',
    ajuda: 'Help', trilha: 'Breadcrumb', recolherMenu: 'Collapse menu', abrirMenu: 'Open menu',
    voltar: 'Back', avancar: 'Forward', recarregar: 'Reload', suporte: 'Support',
    notificacoes: 'Notifications', idioma: 'Language', tema: 'Theme', conta: 'Your account', novo: 'New',
    itens: {
      inicio: 'Home', spaceflows: 'Spaceflows', categorias: 'Categories', tarefas: 'Tasks',
      agendadas: 'Scheduled', rapidas: 'Quick', agenda: 'Calendar', knowledge: 'Knowledge',
      visaoGeral: 'Overview', sistema: 'System', estrutura: 'Structure', gestaoDeMembros: 'Member Management',
      interface: 'Interface', emails: 'E-mails', integracoes: 'Integrations', agentesDeIa: 'AI Agents',
      logs: 'Logs', releases: 'Releases', documentacao: 'Documentation', todos: 'All',
    },
    gerandoNoMenu: 'Report generating',
    prontosNaoVistos: (n: number) => n === 1 ? '1 report ready to download' : `${n} reports ready to download`,
  },
  'es': {
    menuLateral: 'Menú del workspace', buscar: 'Buscar...', membro: 'Miembro', configuracoes: 'Configuración',
    ajuda: 'Ayuda', trilha: 'Ruta', recolherMenu: 'Contraer el menú', abrirMenu: 'Abrir el menú',
    voltar: 'Atrás', avancar: 'Adelante', recarregar: 'Recargar', suporte: 'Soporte',
    notificacoes: 'Notificaciones', idioma: 'Idioma', tema: 'Tema', conta: 'Tu cuenta', novo: 'Nuevo',
    itens: {
      inicio: 'Inicio', spaceflows: 'Spaceflows', categorias: 'Categorías', tarefas: 'Tareas',
      agendadas: 'Programadas', rapidas: 'Rápidas', agenda: 'Agenda', knowledge: 'Knowledge',
      visaoGeral: 'Visión General', sistema: 'Sistema', estrutura: 'Estructura', gestaoDeMembros: 'Gestión de Miembros',
      interface: 'Interfaz', emails: 'Correos', integracoes: 'Integraciones', agentesDeIa: 'Agentes de IA',
      logs: 'Logs', releases: 'Releases', documentacao: 'Documentación', todos: 'Todos',
    },
    gerandoNoMenu: 'Informe en proceso',
    prontosNaoVistos: (n: number) => n === 1 ? '1 informe listo para descargar' : `${n} informes listos para descargar`,
  },
} satisfies Record<Idioma, Textos['casca']>

const ptBR: Textos = {
  casca: casca['pt-BR'],
  workspace: 'Operações',
  trilhaCategorias: 'Categorias',
  nomes: { exportacoes: 'Exportações', relatorios: 'Meus relatórios' },
  descricao: 'Os relatórios que você extraiu das tabelas do workspace.',
  barra: {
    pesquisar: 'Pesquisar relatórios',
    criadoEm: 'Criado em',
    periodos: { todo: 'Todo o período', hoje: 'Hoje', d7: 'Últimos 7 dias', d30: 'Últimos 30 dias', d90: 'Últimos 90 dias' },
    status: 'Status',
    origem: 'Origem',
    formato: 'Formato',
    colunas: 'Colunas',
    limparFiltros: 'Limpar filtros',
    atualizado: 'Atualiza sozinho',
  },
  colunas: {
    relatorio: 'Relatório',
    origem: 'Origem',
    status: 'Status',
    formato: 'Formato',
    registros: 'Registros',
    filtros: 'Filtros',
    tamanho: 'Tamanho',
    criadoEm: 'Criado em',
  },
  status: { pending: 'Na fila', processing: 'Gerando', complete: 'Pronto', error: 'Falhou' },
  origens: { tasks: 'Tarefas Rápidas', c_flow_item_tasks: 'Tarefas Agendadas' },
  modeloPadrao: 'Relatório Padrão',
  operadores: { e: 'é', contem: 'contém', entre: 'entre', antes: 'antes de', depois: 'depois de', vazio: 'está vazio' },
  nFiltros: n => n === 1 ? '1 filtro' : `${n} filtros`,
  semFiltro: 'Sem filtro',
  registros: n => n === 1 ? '1 registro' : `${n.toLocaleString('pt-BR')} registros`,
  semRegistros: 'Nenhum registro',
  gerandoPct: n => `Gerando ${n}%`,
  acoes: {
    verDetalhes: 'Ver detalhes',
    baixar: 'Baixar',
    baixarArquivo: (f, t) => `Baixar ${f} · ${t}`,
    extrairDeNovo: 'Extrair novamente',
    abrirNaOrigem: 'Abrir na origem',
    copiarLink: 'Copiar link',
    excluir: 'Excluir',
    tentarDeNovo: 'Tentar novamente',
    maisAcoes: 'Mais ações',
    fechar: 'Fechar',
  },
  painel: {
    titulo: 'Detalhes do relatório',
    resumo: 'Resumo',
    origem: 'Origem',
    visualizacao: 'Visualização',
    modelo: 'Modelo',
    formato: 'Formato',
    registros: 'Registros',
    tamanho: 'Tamanho',
    pedidoEm: 'Pedido em',
    prontoEm: 'Pronto em',
    emSegundos: s => s < 60 ? `${s} s para gerar` : `${Math.round(s / 60)} min para gerar`,
    baixado: 'Baixado',
    vezes: n => n === 1 ? '1 vez' : `${n} vezes`,
    nunca: 'Ainda não',
    filtrosAplicados: 'Filtros aplicados',
    verNoPainel: 'Ver todos os detalhes',
    ordenacao: 'Ordenação',
    colunasExportadas: n => n === 1 ? '1 coluna no arquivo' : `${n} colunas no arquivo`,
    verTodas: 'Ver todas',
    verMenos: 'Ver menos',
    historico: 'Histórico',
    eventos: { pedido: 'Você pediu o relatório', gerado: 'Arquivo gerado', baixado: 'Você baixou', falhou: 'A geração falhou', naFila: 'Na fila para gerar', gerando: 'Gerando o arquivo' },
    naFilaAjuda: 'Começa assim que o relatório da frente terminar. Pode sair desta tela: o menu avisa quando ficar pronto.',
    gerandoAjuda: 'Pode sair desta tela. O menu e o sino avisam quando ficar pronto.',
    falhouTitulo: 'Erro ao gerar o relatório',
    arquivo: 'Arquivo',
    semFiltroAjuda: 'Saíram todos os registros da visualização.',
  },
  coluna: {
    filtrar: c => `Filtrar ${c}`,
    ordenar: c => `Ordenar por ${c}`,
    limpar: 'Limpar',
    contem: 'Contém o texto',
    minimo: 'Mínimo',
    maximo: 'Máximo',
    comFiltro: 'Com filtro',
    faixas: { ate100k: 'Até 100 KB', ate1m: 'De 100 KB a 1 MB', acima1m: 'Acima de 1 MB' },
  },
  selecao: {
    contagem: (n, total) => `${n} de ${total} selecionado(s)`,
    selecionados: n => n === 1 ? '1 selecionado' : `${n} selecionados`,
    baixar: 'Baixar',
    excluir: 'Excluir',
    limpar: 'Limpar seleção',
  },
  avisos: {
    gerandoTitulo: o => `Gerando o relatório de ${o}`,
    gerandoDescricao: 'Pode continuar trabalhando. Avisamos aqui quando ficar pronto.',
    prontoTitulo: 'Relatório pronto',
    prontoDescricao: (o, r) => `${o}, ${r}.`,
    verNaTela: tela => `Ver em ${tela}`,
    falhouTitulo: 'Erro ao gerar o relatório',
    falhouDescricao: (o, tela) => `O relatório de ${o} não foi gerado. O motivo está em ${tela}.`,
    download: n => `Baixando ${n}`,
    downloadVarios: n => `Baixando ${n} arquivos num .zip`,
    linkCopiado: 'Link copiado. Ele só abre para quem tem acesso ao workspace.',
    excluidos: n => n === 1 ? 'Relatório excluído' : `${n} relatórios excluídos`,
    desfazer: 'Desfazer',
    extraindoDeNovo: 'Extraindo novamente, com os mesmos filtros',
    abrindoOrigem: o => `Abrindo ${o} com os filtros deste relatório`,
  },
  vazio: {
    titulo: 'Nenhum relatório ainda',
    descricao: 'Para ter um relatório, abra uma tabela de itens ou de tarefas e clique em Extrair Relatório. O arquivo aparece aqui.',
    buscaTitulo: b => `Nada encontrado para "${b}"`,
    buscaDescricao: 'Procure pelo nome da categoria, da visualização ou do modelo.',
    erroTitulo: 'Erro ao carregar os relatórios',
    erroDescricao: 'Os arquivos continuam salvos. Tente novamente em alguns instantes.',
  },
  sino: {
    titulo: 'Notificações',
    marcarLidas: 'Marcar todas como lidas',
    pronto: o => `Seu relatório de ${o} está pronto`,
    falhou: o => `Erro ao gerar o relatório de ${o}`,
    semNotificacao: 'Nenhuma notificação nova',
  },
  itens: {
    aba: 'Itens',
    visualizar: 'Visualizar',
    pesquisar: 'Pesquisar registros',
    criadoEm: 'Criado em',
    todoPeriodo: 'Todo o período',
    extrair: 'Extrair Relatório',
    padrao: 'Relatório Padrão',
    colunas: 'Colunas',
    filtros: 'Filtros',
    configurar: 'Configurações',
    novoRegistro: 'Novo registro',
    formatoTitulo: 'Formato de extração',
    formatoDescricao: 'Escolha um formato para extrair o relatório',
    acoes: 'Ações',
    mostrando: (a, b, total) => `Mostrando ${a} a ${b} de ${total} resultados`,
    porPagina: '100 por página',
    cabecalho: { referencia: 'Referência', status: 'Status', contratante: 'Contratante', fornecedor: 'Fornecedor', valor: 'Valor do contrato', fim: 'Fim da vigência' },
  },
  data: {
    hoje: h => `Hoje, ${h}`,
    ontem: h => `Ontem, ${h}`,
    agora: 'agora',
    haMin: n => `há ${n} min`,
    haH: n => `há ${n} h`,
  },
}

const en: Textos = {
  casca: casca.en,
  workspace: 'Operations',
  trilhaCategorias: 'Categories',
  nomes: { exportacoes: 'Exports', relatorios: 'My reports' },
  descricao: 'The reports you extracted from the workspace tables.',
  barra: {
    pesquisar: 'Search reports',
    criadoEm: 'Created at',
    periodos: { todo: 'All time', hoje: 'Today', d7: 'Last 7 days', d30: 'Last 30 days', d90: 'Last 90 days' },
    status: 'Status',
    origem: 'Source',
    formato: 'Format',
    colunas: 'Columns',
    limparFiltros: 'Clear filters',
    atualizado: 'Updates on its own',
  },
  colunas: {
    relatorio: 'Report',
    origem: 'Source',
    status: 'Status',
    formato: 'Format',
    registros: 'Records',
    filtros: 'Filters',
    tamanho: 'Size',
    criadoEm: 'Created at',
  },
  status: { pending: 'Queued', processing: 'Generating', complete: 'Ready', error: 'Failed' },
  origens: { tasks: 'Quick Tasks', c_flow_item_tasks: 'Scheduled Tasks' },
  modeloPadrao: 'Standard Report',
  operadores: { e: 'is', contem: 'contains', entre: 'between', antes: 'before', depois: 'after', vazio: 'is empty' },
  nFiltros: n => n === 1 ? '1 filter' : `${n} filters`,
  semFiltro: 'No filter',
  registros: n => n === 1 ? '1 record' : `${n.toLocaleString('en')} records`,
  semRegistros: 'No records',
  gerandoPct: n => `Generating ${n}%`,
  acoes: {
    verDetalhes: 'See details',
    baixar: 'Download',
    baixarArquivo: (f, t) => `Download ${f} · ${t}`,
    extrairDeNovo: 'Extract again',
    abrirNaOrigem: 'Open source',
    copiarLink: 'Copy link',
    excluir: 'Delete',
    tentarDeNovo: 'Try again',
    maisAcoes: 'More actions',
    fechar: 'Close',
  },
  painel: {
    titulo: 'Report details',
    resumo: 'Summary',
    origem: 'Source',
    visualizacao: 'View',
    modelo: 'Template',
    formato: 'Format',
    registros: 'Records',
    tamanho: 'Size',
    pedidoEm: 'Requested at',
    prontoEm: 'Ready at',
    emSegundos: s => s < 60 ? `${s} s to generate` : `${Math.round(s / 60)} min to generate`,
    baixado: 'Downloaded',
    vezes: n => n === 1 ? 'once' : `${n} times`,
    nunca: 'Not yet',
    filtrosAplicados: 'Applied filters',
    verNoPainel: 'See all details',
    ordenacao: 'Sorting',
    colunasExportadas: n => n === 1 ? '1 column in the file' : `${n} columns in the file`,
    verTodas: 'See all',
    verMenos: 'See less',
    historico: 'History',
    eventos: { pedido: 'You requested the report', gerado: 'File generated', baixado: 'You downloaded', falhou: 'Generation failed', naFila: 'Queued to generate', gerando: 'Generating the file' },
    naFilaAjuda: 'It starts as soon as the report ahead finishes. You can leave this screen: the menu tells you when it is ready.',
    gerandoAjuda: 'You can leave this screen. The menu and the bell tell you when it is ready.',
    falhouTitulo: 'Error generating the report',
    arquivo: 'File',
    semFiltroAjuda: 'Every record in the view was exported.',
  },
  coluna: {
    filtrar: c => `Filter ${c}`,
    ordenar: c => `Sort by ${c}`,
    limpar: 'Clear',
    contem: 'Contains the text',
    minimo: 'Minimum',
    maximo: 'Maximum',
    comFiltro: 'With filter',
    faixas: { ate100k: 'Up to 100 KB', ate1m: '100 KB to 1 MB', acima1m: 'Over 1 MB' },
  },
  selecao: {
    contagem: (n, total) => `${n} of ${total} selected`,
    selecionados: n => `${n} selected`,
    baixar: 'Download',
    excluir: 'Delete',
    limpar: 'Clear selection',
  },
  avisos: {
    gerandoTitulo: o => `Generating the ${o} report`,
    gerandoDescricao: 'Keep working. We will tell you here when it is ready.',
    prontoTitulo: 'Report ready',
    prontoDescricao: (o, r) => `${o}, ${r}.`,
    verNaTela: tela => `See in ${tela}`,
    falhouTitulo: 'Error generating the report',
    falhouDescricao: (o, tela) => `The ${o} report was not generated. The reason is in ${tela}.`,
    download: n => `Downloading ${n}`,
    downloadVarios: n => `Downloading ${n} files in a .zip`,
    linkCopiado: 'Link copied. It only opens for people with access to the workspace.',
    excluidos: n => n === 1 ? 'Report deleted' : `${n} reports deleted`,
    desfazer: 'Undo',
    extraindoDeNovo: 'Extracting again, with the same filters',
    abrindoOrigem: o => `Opening ${o} with this report's filters`,
  },
  vazio: {
    titulo: 'No reports yet',
    descricao: 'To get a report, open an items or tasks table and click Extract Report. The file shows up here.',
    buscaTitulo: b => `Nothing found for "${b}"`,
    buscaDescricao: 'Search by category, view or template name.',
    erroTitulo: 'Error loading reports',
    erroDescricao: 'Your files are still saved. Try again in a few moments.',
  },
  sino: {
    titulo: 'Notifications',
    marcarLidas: 'Mark all as read',
    pronto: o => `Your ${o} report is ready`,
    falhou: o => `Error generating the ${o} report`,
    semNotificacao: 'No new notifications',
  },
  itens: {
    aba: 'Items',
    visualizar: 'View',
    pesquisar: 'Search records',
    criadoEm: 'Created at',
    todoPeriodo: 'All time',
    extrair: 'Extract Report',
    padrao: 'Standard Report',
    colunas: 'Columns',
    filtros: 'Filters',
    configurar: 'Settings',
    novoRegistro: 'New record',
    formatoTitulo: 'Extraction format',
    formatoDescricao: 'Choose a format to extract the report',
    acoes: 'Actions',
    mostrando: (a, b, total) => `Showing ${a} to ${b} of ${total} results`,
    porPagina: '100 per page',
    cabecalho: { referencia: 'Reference', status: 'Status', contratante: 'Contracting party', fornecedor: 'Supplier', valor: 'Contract value', fim: 'End of term' },
  },
  data: {
    hoje: h => `Today, ${h}`,
    ontem: h => `Yesterday, ${h}`,
    agora: 'now',
    haMin: n => `${n} min ago`,
    haH: n => `${n} h ago`,
  },
}

const es: Textos = {
  casca: casca.es,
  workspace: 'Operaciones',
  trilhaCategorias: 'Categorías',
  nomes: { exportacoes: 'Exportaciones', relatorios: 'Mis informes' },
  descricao: 'Los informes que extrajiste de las tablas del workspace.',
  barra: {
    pesquisar: 'Buscar informes',
    criadoEm: 'Creado el',
    periodos: { todo: 'Todo el período', hoje: 'Hoy', d7: 'Últimos 7 días', d30: 'Últimos 30 días', d90: 'Últimos 90 días' },
    status: 'Estado',
    origem: 'Origen',
    formato: 'Formato',
    colunas: 'Columnas',
    limparFiltros: 'Limpiar filtros',
    atualizado: 'Se actualiza solo',
  },
  colunas: {
    relatorio: 'Informe',
    origem: 'Origen',
    status: 'Estado',
    formato: 'Formato',
    registros: 'Registros',
    filtros: 'Filtros',
    tamanho: 'Tamaño',
    criadoEm: 'Creado el',
  },
  status: { pending: 'En cola', processing: 'En proceso', complete: 'Listo', error: 'Con error' },
  origens: { tasks: 'Tareas Rápidas', c_flow_item_tasks: 'Tareas Programadas' },
  modeloPadrao: 'Informe Estándar',
  operadores: { e: 'es', contem: 'contiene', entre: 'entre', antes: 'antes de', depois: 'después de', vazio: 'está vacío' },
  nFiltros: n => n === 1 ? '1 filtro' : `${n} filtros`,
  semFiltro: 'Sin filtro',
  registros: n => n === 1 ? '1 registro' : `${n.toLocaleString('es')} registros`,
  semRegistros: 'Ningún registro',
  gerandoPct: n => `En proceso ${n}%`,
  acoes: {
    verDetalhes: 'Ver detalles',
    baixar: 'Descargar',
    baixarArquivo: (f, t) => `Descargar ${f} · ${t}`,
    extrairDeNovo: 'Extraer de nuevo',
    abrirNaOrigem: 'Abrir el origen',
    copiarLink: 'Copiar enlace',
    excluir: 'Eliminar',
    tentarDeNovo: 'Reintentar',
    maisAcoes: 'Más acciones',
    fechar: 'Cerrar',
  },
  painel: {
    titulo: 'Detalles del informe',
    resumo: 'Resumen',
    origem: 'Origen',
    visualizacao: 'Vista',
    modelo: 'Plantilla',
    formato: 'Formato',
    registros: 'Registros',
    tamanho: 'Tamaño',
    pedidoEm: 'Pedido el',
    prontoEm: 'Listo el',
    emSegundos: s => s < 60 ? `${s} s para generar` : `${Math.round(s / 60)} min para generar`,
    baixado: 'Descargado',
    vezes: n => n === 1 ? '1 vez' : `${n} veces`,
    nunca: 'Todavía no',
    filtrosAplicados: 'Filtros aplicados',
    verNoPainel: 'Ver todos los detalles',
    ordenacao: 'Orden',
    colunasExportadas: n => n === 1 ? '1 columna en el archivo' : `${n} columnas en el archivo`,
    verTodas: 'Ver todas',
    verMenos: 'Ver menos',
    historico: 'Historial',
    eventos: { pedido: 'Pediste el informe', gerado: 'Archivo generado', baixado: 'Lo descargaste', falhou: 'La generación falló', naFila: 'En cola para generar', gerando: 'Generando el archivo' },
    naFilaAjuda: 'Empieza en cuanto termine el informe anterior. Puedes salir de esta pantalla: el menú avisa cuando esté listo.',
    gerandoAjuda: 'Puedes salir de esta pantalla. El menú y la campana avisan cuando esté listo.',
    falhouTitulo: 'Error al generar el informe',
    arquivo: 'Archivo',
    semFiltroAjuda: 'Salieron todos los registros de la vista.',
  },
  coluna: {
    filtrar: c => `Filtrar ${c}`,
    ordenar: c => `Ordenar por ${c}`,
    limpar: 'Limpiar',
    contem: 'Contiene el texto',
    minimo: 'Mínimo',
    maximo: 'Máximo',
    comFiltro: 'Con filtro',
    faixas: { ate100k: 'Hasta 100 KB', ate1m: 'De 100 KB a 1 MB', acima1m: 'Más de 1 MB' },
  },
  selecao: {
    contagem: (n, total) => `${n} de ${total} seleccionado(s)`,
    selecionados: n => n === 1 ? '1 seleccionado' : `${n} seleccionados`,
    baixar: 'Descargar',
    excluir: 'Eliminar',
    limpar: 'Limpiar selección',
  },
  avisos: {
    gerandoTitulo: o => `Generando el informe de ${o}`,
    gerandoDescricao: 'Puedes seguir trabajando. Avisamos aquí cuando esté listo.',
    prontoTitulo: 'Informe listo',
    prontoDescricao: (o, r) => `${o}, ${r}.`,
    verNaTela: tela => `Ver en ${tela}`,
    falhouTitulo: 'Error al generar el informe',
    falhouDescricao: (o, tela) => `El informe de ${o} no se generó. El motivo está en ${tela}.`,
    download: n => `Descargando ${n}`,
    downloadVarios: n => `Descargando ${n} archivos en un .zip`,
    linkCopiado: 'Enlace copiado. Solo abre para quien tiene acceso al workspace.',
    excluidos: n => n === 1 ? 'Informe eliminado' : `${n} informes eliminados`,
    desfazer: 'Deshacer',
    extraindoDeNovo: 'Extrayendo de nuevo, con los mismos filtros',
    abrindoOrigem: o => `Abriendo ${o} con los filtros de este informe`,
  },
  vazio: {
    titulo: 'Todavía no hay informes',
    descricao: 'Para tener un informe, abre una tabla de ítems o de tareas y haz clic en Extraer Informe. El archivo aparece aquí.',
    buscaTitulo: b => `Nada encontrado para "${b}"`,
    buscaDescricao: 'Busca por el nombre de la categoría, de la vista o de la plantilla.',
    erroTitulo: 'Error al cargar los informes',
    erroDescricao: 'Tus archivos siguen guardados. Inténtalo de nuevo en unos instantes.',
  },
  sino: {
    titulo: 'Notificaciones',
    marcarLidas: 'Marcar todas como leídas',
    pronto: o => `Tu informe de ${o} está listo`,
    falhou: o => `Error al generar el informe de ${o}`,
    semNotificacao: 'No hay notificaciones nuevas',
  },
  itens: {
    aba: 'Ítems',
    visualizar: 'Visualizar',
    pesquisar: 'Buscar registros',
    criadoEm: 'Creado el',
    todoPeriodo: 'Todo el período',
    extrair: 'Extraer Informe',
    padrao: 'Informe Estándar',
    colunas: 'Columnas',
    filtros: 'Filtros',
    configurar: 'Configuración',
    novoRegistro: 'Nuevo registro',
    formatoTitulo: 'Formato de extracción',
    formatoDescricao: 'Elige un formato para extraer el informe',
    acoes: 'Acciones',
    mostrando: (a, b, total) => `Mostrando ${a} a ${b} de ${total} resultados`,
    porPagina: '100 por página',
    cabecalho: { referencia: 'Referencia', status: 'Estado', contratante: 'Contratante', fornecedor: 'Proveedor', valor: 'Valor del contrato', fim: 'Fin de la vigencia' },
  },
  data: {
    hoje: h => `Hoy, ${h}`,
    ontem: h => `Ayer, ${h}`,
    agora: 'ahora',
    haMin: n => `hace ${n} min`,
    haH: n => `hace ${n} h`,
  },
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': ptBR, en, es }
