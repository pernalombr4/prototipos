/**
 * A copy do protótipo de dashboards nos 3 idiomas do ENSPACE.
 *
 * Regra 33: nenhum texto de interface leva travessão. Número, data e plural saem
 * daqui, nunca concatenados no template.
 *
 * Nome das coisas (achado U9 da pesquisa de UX): a página é o "dashboard"; cada bloco
 * dele é um "painel", como o SDK já chama ("Adicionar painel", "Ocultar painel").
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Funcao, Granularidade, Operador, Ordem, PresetDePeriodo, Visualizacao } from './agregacao'

type Plural = (n: number) => string

export interface Textos {
  locale: string
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
  }
  workspace: string
  trilhaDashboards: string

  pagina: {
    trocarDashboard: string
    novoDashboard: string
    novoPainel: string
    personalizar: string
    concluir: string
    maisAcoes: string
    editarDashboard: string
    atualizarDados: string
    duplicarDashboard: string
    excluirDashboard: string
    atualizado: (hora: string, minutos: number) => string
    atualizadoSemRecarga: (hora: string) => string
    visivelPara: (grupos: string[]) => string
    paineis: Plural
    dadosAtualizados: string
    duplicado: string
    excluido: string
  }

  filtros: {
    adicionar: string
    filtrarPor: string
    ajuda: string
    semCampoComum: string
    emCategorias: Plural
    buscarValor: string
    remover: (nome: string) => string
    limpar: string
    selecionados: Plural
    escolherValores: string
  }

  painel: {
    menu: { editar: string, verItens: string, duplicar: string, baixarCsv: string, excluir: string }
    todoPeriodo: string
    periodoPor: (campo: string) => string
    filtroNaoSeAplica: (nome: string) => string
    filtroNaoSeAplicaCurto: (nome: string) => string
    multiplo: string
    multiploCurto: string
    outros: Plural
    itens: Plural
    verItens: Plural
    semDadosTitulo: string
    semDadosDescricao: string
    erroTitulo: string
    erroDescricao: string
    colunaValor: string
    colunaDoTotal: string
    total: string
    daEtapaAnterior: (p: string) => string
    primeiraEtapa: string
    permissao: string
    comoCalculamos: (frase: string, periodo: string, condicoes: number) => string
    condicoes: Plural
    csvBaixado: string
    clique: string
    excluido: string
    duplicado: string
    desfazer: string
    restaurado: string
  }

  frase: (f: Funcao, categoria: string, medida?: string, agrupar?: string, quebra?: string) => string
  funcoes: Record<Funcao, string>
  ajudaFuncao: Record<Funcao, string>

  construtor: {
    tituloNovo: string
    tituloEditar: string
    descricao: string
    previa: string
    secaoDados: string
    secaoVisualizacao: string
    secaoIdentificacao: string
    categoria: string
    buscarCategoria: string
    buscarCampo: string
    calcular: string
    campoDaMedida: string
    medidaPlaceholder: string
    medidaErro: string
    medidaVazia: string
    virtual: string
    agruparPor: string
    agruparNenhum: string
    agruparAjuda: string
    textoNaoAgrupa: string
    granularidade: string
    granularidades: Record<Granularidade, string>
    quebrarPor: string
    quebrarNenhum: string
    quebrarAjuda: string
    multiploAviso: string
    relacaoAviso: (categoria: string) => string
    condicoes: string
    condicoesVazio: string
    adicionarCondicao: string
    juncao: { e: string, ou: string }
    operadores: Record<Operador, string>
    valorPlaceholder: string
    removerCondicao: string
    periodo: string
    periodoDashboard: string
    periodoTodo: string
    periodoTodoAjuda: string
    campoDeData: string
    visualizacao: string
    visualizacoes: Record<Visualizacao, string>
    ajudaVisualizacao: Record<Visualizacao, string>
    sugerido: string
    visualizacaoAjuda: string
    soNumero: string
    ordem: string
    ordens: Record<Ordem, string>
    limite: string
    limites: Plural
    semLimite: string
    limiteAjuda: string
    mostrarValores: string
    titulo: string
    tituloAjuda: string
    cancelar: string
    salvar: string
    adicionar: string
    salvo: string
    adicionado: string
    sistema: string
  }

  detalhe: {
    itens: Plural
    abrirNaListagem: (categoria: string) => string
    abrirAviso: string
    referencia: string
    criadoEm: string
    periodo: (p: string) => string
    vazio: string
    fechar: string
  }

  formDashboard: {
    tituloEditar: string
    tituloNovo: string
    nome: string
    nomeErro: string
    descricao: string
    quemVe: string
    todosMembros: string
    quemVeAjuda: string
    recarga: string
    recargas: Plural
    semRecarga: string
    salvar: string
    criar: string
    cancelar: string
    salvo: string
    criado: string
  }

  estados: {
    vazioTitulo: string
    vazioDescricao: string
    semAcessoTitulo: string
    semAcessoDescricao: string
    tentarNovamente: string
  }

  rotulos: { vazio: string, outros: string, sim: string, nao: string }
  periodos: Record<PresetDePeriodo, string>
  periodoPersonalizado: (de: string, ate: string) => string
}

const listaPt = (l: string[]) => l.length <= 1 ? l.join('') : `${l.slice(0, -1).join(', ')} e ${l[l.length - 1]}`
const listaEn = (l: string[]) => l.length <= 1 ? l.join('') : `${l.slice(0, -1).join(', ')} and ${l[l.length - 1]}`
const listaEs = (l: string[]) => l.length <= 1 ? l.join('') : `${l.slice(0, -1).join(', ')} y ${l[l.length - 1]}`

const pt: Textos = {
  locale: 'pt-BR',
  casca: {
    menuLateral: 'Menu do workspace', buscar: 'Buscar...', membro: 'Membro', configuracoes: 'Configurações',
    ajuda: 'Ajuda', trilha: 'Trilha', recolherMenu: 'Recolher o menu', abrirMenu: 'Abrir o menu',
    voltar: 'Voltar', avancar: 'Avançar', recarregar: 'Recarregar', suporte: 'Suporte',
    notificacoes: 'Notificações', idioma: 'Idioma', tema: 'Tema', conta: 'Sua conta', novo: 'Novo',
    itens: {
      inicio: 'Início', spaceflows: 'Spaceflows', categorias: 'Categorias', tarefas: 'Tarefas',
      agenda: 'Agenda', dashboards: 'Dashboards', relatorios: 'menu.member.reports.label', knowledge: 'Knowledge',
      visaoGeral: 'Visão Geral', sistema: 'Sistema', estrutura: 'Estrutura', gestaoDeMembros: 'Gestão de Membros',
      interface: 'Interface', emails: 'E-mails', integracoes: 'Integrações', agentesDeIa: 'Agentes de IA',
      logs: 'Logs', releases: 'Releases', documentacao: 'Documentação',
    },
  },
  workspace: 'teste ux 2',
  trilhaDashboards: 'Dashboards',

  pagina: {
    trocarDashboard: 'Trocar de dashboard',
    novoDashboard: 'Novo dashboard',
    novoPainel: 'Novo painel',
    personalizar: 'Personalizar',
    concluir: 'Concluir',
    maisAcoes: 'Mais ações do dashboard',
    editarDashboard: 'Editar dashboard',
    atualizarDados: 'Atualizar dados',
    duplicarDashboard: 'Duplicar dashboard',
    excluirDashboard: 'Excluir dashboard',
    atualizado: (h, m) => `Atualizado às ${h}. Recarrega a cada ${m} min.`,
    atualizadoSemRecarga: h => `Atualizado às ${h}.`,
    visivelPara: g => g.length ? `Visível para ${listaPt(g)}` : 'Visível para todos os membros',
    paineis: n => n === 1 ? '1 painel' : `${n} painéis`,
    dadosAtualizados: 'Dados atualizados',
    duplicado: 'Dashboard duplicado',
    excluido: 'Dashboard excluído',
  },

  filtros: {
    adicionar: 'Filtro',
    filtrarPor: 'Filtrar o dashboard por',
    ajuda: 'Campos que existem em mais de uma categoria deste dashboard.',
    semCampoComum: 'As categorias deste dashboard não têm campo em comum.',
    emCategorias: n => n === 1 ? 'em 1 categoria' : `em ${n} categorias`,
    buscarValor: 'Buscar valor',
    remover: n => `Remover o filtro ${n}`,
    limpar: 'Limpar filtros',
    selecionados: n => n === 1 ? '1 selecionado' : `${n} selecionados`,
    escolherValores: 'Escolha os valores',
  },

  painel: {
    menu: { editar: 'Editar painel', verItens: 'Ver os itens', duplicar: 'Duplicar painel', baixarCsv: 'Baixar CSV', excluir: 'Excluir painel' },
    todoPeriodo: 'Todo o período',
    periodoPor: c => `Período por ${c}`,
    filtroNaoSeAplica: n => `O filtro ${n} não vale neste painel: a categoria não tem esse campo.`,
    filtroNaoSeAplicaCurto: n => `Sem o filtro ${n}`,
    multiplo: 'Um item pode ter mais de uma opção marcada e conta em cada uma. A soma dos grupos passa do total de itens.',
    multiploCurto: 'Conta em cada opção',
    outros: n => n === 1 ? 'Outros junta 1 grupo' : `Outros junta ${n} grupos`,
    itens: n => n === 1 ? '1 item' : `${n.toLocaleString('pt-BR')} itens`,
    verItens: n => n === 1 ? 'Ver 1 item' : `Ver ${n.toLocaleString('pt-BR')} itens`,
    semDadosTitulo: 'Nenhum item no período',
    semDadosDescricao: 'Mude o período do topo ou os filtros do painel.',
    erroTitulo: 'Este painel não carregou',
    erroDescricao: 'Os outros painéis continuam valendo.',
    colunaValor: 'Valor',
    colunaDoTotal: 'Do total',
    total: 'Total',
    daEtapaAnterior: p => `${p} seguiram da etapa anterior`,
    primeiraEtapa: 'Primeira etapa',
    permissao: 'Conta só os itens que você pode ver. Quem vê outros itens pode ver outro número.',
    comoCalculamos: (f, p, c) => `${f}. ${p}.${c ? ` Com ${c === 1 ? '1 condição' : `${c} condições`} do painel.` : ''}`,
    condicoes: n => n === 1 ? '1 condição' : `${n} condições`,
    csvBaixado: 'CSV baixado',
    clique: 'Clique numa barra para ver os itens.',
    excluido: 'Painel excluído',
    duplicado: 'Painel duplicado',
    desfazer: 'Desfazer',
    restaurado: 'Painel restaurado',
  },

  frase: (f, cat, medida, agrupar, quebra) => {
    const inicio = f === 'contagem' || !medida ? `Quantidade de ${cat}` : `${pt.funcoes[f]} de ${medida} em ${cat}`
    return `${inicio}${agrupar ? ` por ${agrupar}` : ''}${quebra ? ` e ${quebra}` : ''}`
  },
  funcoes: { contagem: 'Contagem de itens', soma: 'Soma', media: 'Média', mediana: 'Mediana', minimo: 'Mínimo', maximo: 'Máximo', distintos: 'Valores distintos' },
  ajudaFuncao: {
    contagem: 'Quantos itens caem em cada grupo.',
    soma: 'Soma o campo de todos os itens do grupo.',
    media: 'Soma o campo e divide pelos itens que têm valor.',
    mediana: 'O valor do meio: metade dos itens fica acima, metade abaixo.',
    minimo: 'O menor valor do campo no grupo.',
    maximo: 'O maior valor do campo no grupo.',
    distintos: 'Quantos valores diferentes o campo tem no grupo.',
  },

  construtor: {
    tituloNovo: 'Novo painel',
    tituloEditar: 'Editar painel',
    descricao: 'Escolha o dado primeiro. O tipo de gráfico se ajusta ao que você escolher.',
    previa: 'Prévia',
    secaoDados: 'Dados',
    secaoVisualizacao: 'Visualização',
    secaoIdentificacao: 'Identificação',
    categoria: 'Categoria',
    buscarCategoria: 'Buscar categoria',
    buscarCampo: 'Buscar campo',
    calcular: 'Calcular',
    campoDaMedida: 'Campo',
    medidaPlaceholder: 'Escolha um campo de número',
    medidaErro: 'Escolha o campo que a função calcula.',
    medidaVazia: 'Esta categoria não tem campo de número, de moeda nem campo virtual.',
    virtual: 'Campo virtual',
    agruparPor: 'Agrupar por',
    agruparNenhum: 'Não agrupar (um número só)',
    agruparAjuda: 'Cada valor do campo vira uma barra, uma fatia ou uma linha da tabela.',
    textoNaoAgrupa: 'Texto livre não agrupa',
    granularidade: 'Agrupar as datas por',
    granularidades: { dia: 'Dia', semana: 'Semana', mes: 'Mês', trimestre: 'Trimestre', ano: 'Ano' },
    quebrarPor: 'Dividir por (opcional)',
    quebrarNenhum: 'Não dividir',
    quebrarAjuda: 'Divide cada grupo pelas opções de outro campo, em barras empilhadas.',
    multiploAviso: 'Múltipla seleção: o item conta em cada opção marcada.',
    relacaoAviso: c => `Relação: agrupa pelo item de ${c} ligado a cada item.`,
    condicoes: 'Filtros do painel',
    condicoesVazio: 'Sem filtro, o painel conta todos os itens da categoria.',
    adicionarCondicao: 'Adicionar condição',
    juncao: { e: 'Todas as condições', ou: 'Qualquer condição' },
    operadores: { igual: 'é', diferente: 'não é', maior: 'maior que', menor: 'menor que', preenchido: 'está preenchido', vazio: 'está vazio' },
    valorPlaceholder: 'Valor',
    removerCondicao: 'Remover condição',
    periodo: 'Período',
    periodoDashboard: 'Seguir o período do dashboard',
    periodoTodo: 'Todo o período',
    periodoTodoAjuda: 'Para o que existe agora, como os contratos em negociação.',
    campoDeData: 'Data que o período lê',
    visualizacao: 'Tipo de gráfico',
    visualizacoes: { numero: 'Número', barras: 'Barras', barrasHorizontais: 'Barras horizontais', linha: 'Linha', area: 'Área', rosca: 'Rosca', funil: 'Funil', tabela: 'Tabela' },
    ajudaVisualizacao: {
      numero: 'Um número em destaque, sem agrupamento.',
      barras: 'Compara grupos. Com divisão, as barras ficam empilhadas.',
      barrasHorizontais: 'Ranking. Bom para nomes longos e muitos grupos.',
      linha: 'Evolução no tempo.',
      area: 'Evolução no tempo, com as partes empilhadas.',
      rosca: 'Parte do todo, para até 6 grupos.',
      funil: 'Etapas na ordem das opções. Cada etapa conta os itens que chegaram até ela: os que estão nela e nas seguintes.',
      tabela: 'Os números exatos de cada grupo.',
    },
    sugerido: 'Sugerido',
    visualizacaoAjuda: 'A lista mostra só os tipos que servem para o dado escolhido.',
    soNumero: 'Para ver gráficos, escolha um campo em Agrupar por.',
    ordem: 'Ordem',
    ordens: { natural: 'Ordem das opções', valorDesc: 'Maior valor primeiro', valorAsc: 'Menor valor primeiro', rotulo: 'Ordem alfabética' },
    limite: 'Mostrar no máximo',
    limites: n => `${n} grupos`,
    semLimite: 'Todos os grupos',
    limiteAjuda: 'O resto entra em Outros.',
    mostrarValores: 'Mostrar o valor em cada barra',
    titulo: 'Título',
    tituloAjuda: 'Vazio, o título é a frase da configuração.',
    cancelar: 'Cancelar',
    salvar: 'Salvar painel',
    adicionar: 'Adicionar ao dashboard',
    salvo: 'Painel salvo',
    adicionado: 'Painel adicionado',
    sistema: 'Campos do sistema',
  },

  detalhe: {
    itens: n => n === 1 ? '1 item' : `${n.toLocaleString('pt-BR')} itens`,
    abrirNaListagem: c => `Abrir na listagem de ${c}`,
    abrirAviso: 'Abre a listagem da categoria com este recorte aplicado.',
    referencia: 'Referência',
    criadoEm: 'Criado em',
    periodo: p => `Período: ${p}`,
    vazio: 'Nenhum item neste recorte.',
    fechar: 'Fechar',
  },

  formDashboard: {
    tituloEditar: 'Editar dashboard',
    tituloNovo: 'Novo dashboard',
    nome: 'Nome',
    nomeErro: 'Dê um nome ao dashboard.',
    descricao: 'Descrição (opcional)',
    quemVe: 'Quem vê',
    todosMembros: 'Todos os membros',
    quemVeAjuda: 'Cada painel mostra só os itens que a pessoa pode ver.',
    recarga: 'Recarregar os dados',
    recargas: n => `A cada ${n} min`,
    semRecarga: 'Não recarregar',
    salvar: 'Salvar',
    criar: 'Criar dashboard',
    cancelar: 'Cancelar',
    salvo: 'Dashboard salvo',
    criado: 'Dashboard criado',
  },

  estados: {
    vazioTitulo: 'Este dashboard ainda não tem painéis',
    vazioDescricao: 'Um painel conta, soma ou compara os itens de uma categoria. Comece pelo dado que você quer acompanhar.',
    semAcessoTitulo: 'Você não tem acesso a este dashboard',
    semAcessoDescricao: 'Peça acesso a quem administra o workspace.',
    tentarNovamente: 'Tentar novamente',
  },

  rotulos: { vazio: 'Sem valor', outros: 'Outros', sim: 'Sim', nao: 'Não' },
  periodos: { '7d': 'Últimos 7 dias', '30d': 'Últimos 30 dias', '90d': 'Últimos 90 dias', 'month': 'Este mês', 'quarter': 'Este trimestre', 'year': 'Este ano' },
  periodoPersonalizado: (de, ate) => `${de} a ${ate}`,
}

const en: Textos = {
  locale: 'en',
  casca: {
    menuLateral: 'Workspace menu', buscar: 'Search...', membro: 'Member', configuracoes: 'Settings',
    ajuda: 'Help', trilha: 'Breadcrumb', recolherMenu: 'Collapse the menu', abrirMenu: 'Open the menu',
    voltar: 'Back', avancar: 'Forward', recarregar: 'Reload', suporte: 'Support',
    notificacoes: 'Notifications', idioma: 'Language', tema: 'Theme', conta: 'Your account', novo: 'New',
    itens: {
      inicio: 'Home', spaceflows: 'Spaceflows', categorias: 'Categories', tarefas: 'Tasks',
      agenda: 'Schedule', dashboards: 'Dashboards', relatorios: 'menu.member.reports.label', knowledge: 'Knowledge',
      visaoGeral: 'Overview', sistema: 'System', estrutura: 'Structure', gestaoDeMembros: 'Member management',
      interface: 'Interface', emails: 'Emails', integracoes: 'Integrations', agentesDeIa: 'AI agents',
      logs: 'Logs', releases: 'Releases', documentacao: 'Documentation',
    },
  },
  workspace: 'teste ux 2',
  trilhaDashboards: 'Dashboards',

  pagina: {
    trocarDashboard: 'Switch dashboard',
    novoDashboard: 'New dashboard',
    novoPainel: 'New panel',
    personalizar: 'Customize',
    concluir: 'Done',
    maisAcoes: 'More dashboard actions',
    editarDashboard: 'Edit dashboard',
    atualizarDados: 'Refresh data',
    duplicarDashboard: 'Duplicate dashboard',
    excluirDashboard: 'Delete dashboard',
    atualizado: (h, m) => `Updated at ${h}. Refreshes every ${m} min.`,
    atualizadoSemRecarga: h => `Updated at ${h}.`,
    visivelPara: g => g.length ? `Visible to ${listaEn(g)}` : 'Visible to all members',
    paineis: n => n === 1 ? '1 panel' : `${n} panels`,
    dadosAtualizados: 'Data refreshed',
    duplicado: 'Dashboard duplicated',
    excluido: 'Dashboard deleted',
  },

  filtros: {
    adicionar: 'Filter',
    filtrarPor: 'Filter the dashboard by',
    ajuda: 'Fields that exist in more than one category of this dashboard.',
    semCampoComum: 'The categories of this dashboard have no field in common.',
    emCategorias: n => n === 1 ? 'in 1 category' : `in ${n} categories`,
    buscarValor: 'Search value',
    remover: n => `Remove the ${n} filter`,
    limpar: 'Clear filters',
    selecionados: n => `${n} selected`,
    escolherValores: 'Choose the values',
  },

  painel: {
    menu: { editar: 'Edit panel', verItens: 'View the items', duplicar: 'Duplicate panel', baixarCsv: 'Download CSV', excluir: 'Delete panel' },
    todoPeriodo: 'All time',
    periodoPor: c => `Period by ${c}`,
    filtroNaoSeAplica: n => `The ${n} filter does not apply to this panel: the category does not have this field.`,
    filtroNaoSeAplicaCurto: n => `Without the ${n} filter`,
    multiplo: 'An item can have more than one option checked and counts in each one. The sum of the groups exceeds the total of items.',
    multiploCurto: 'Counts in each option',
    outros: n => n === 1 ? 'Others groups 1 group' : `Others groups ${n} groups`,
    itens: n => n === 1 ? '1 item' : `${n.toLocaleString('en')} items`,
    verItens: n => n === 1 ? 'View 1 item' : `View ${n.toLocaleString('en')} items`,
    semDadosTitulo: 'No items in the period',
    semDadosDescricao: 'Change the period at the top or the panel filters.',
    erroTitulo: 'This panel did not load',
    erroDescricao: 'The other panels are still valid.',
    colunaValor: 'Value',
    colunaDoTotal: 'Of total',
    total: 'Total',
    daEtapaAnterior: p => `${p} moved on from the previous stage`,
    primeiraEtapa: 'First stage',
    permissao: 'Counts only the items you can see. People who see other items may see another number.',
    comoCalculamos: (f, p, c) => `${f}. ${p}.${c ? ` With ${c === 1 ? '1 panel condition' : `${c} panel conditions`}.` : ''}`,
    condicoes: n => n === 1 ? '1 condition' : `${n} conditions`,
    csvBaixado: 'CSV downloaded',
    clique: 'Click a bar to view the items.',
    excluido: 'Panel deleted',
    duplicado: 'Panel duplicated',
    desfazer: 'Undo',
    restaurado: 'Panel restored',
  },

  frase: (f, cat, medida, agrupar, quebra) => {
    const inicio = f === 'contagem' || !medida ? `Number of ${cat}` : `${en.funcoes[f]} of ${medida} in ${cat}`
    return `${inicio}${agrupar ? ` by ${agrupar}` : ''}${quebra ? ` and ${quebra}` : ''}`
  },
  funcoes: { contagem: 'Count of items', soma: 'Sum', media: 'Average', mediana: 'Median', minimo: 'Minimum', maximo: 'Maximum', distintos: 'Distinct values' },
  ajudaFuncao: {
    contagem: 'How many items fall into each group.',
    soma: 'Adds up the field of all items in the group.',
    media: 'Adds up the field and divides by the items that have a value.',
    mediana: 'The middle value: half of the items are above, half below.',
    minimo: 'The lowest value of the field in the group.',
    maximo: 'The highest value of the field in the group.',
    distintos: 'How many different values the field has in the group.',
  },

  construtor: {
    tituloNovo: 'New panel',
    tituloEditar: 'Edit panel',
    descricao: 'Choose the data first. The chart type adjusts to what you choose.',
    previa: 'Preview',
    secaoDados: 'Data',
    secaoVisualizacao: 'Visualization',
    secaoIdentificacao: 'Identification',
    categoria: 'Category',
    buscarCategoria: 'Search category',
    buscarCampo: 'Search field',
    calcular: 'Calculate',
    campoDaMedida: 'Field',
    medidaPlaceholder: 'Choose a number field',
    medidaErro: 'Choose the field the function calculates.',
    medidaVazia: 'This category has no number, currency or virtual field.',
    virtual: 'Virtual field',
    agruparPor: 'Group by',
    agruparNenhum: 'Do not group (a single number)',
    agruparAjuda: 'Each value of the field becomes a bar, a slice or a table row.',
    textoNaoAgrupa: 'Free text does not group',
    granularidade: 'Group dates by',
    granularidades: { dia: 'Day', semana: 'Week', mes: 'Month', trimestre: 'Quarter', ano: 'Year' },
    quebrarPor: 'Split by (optional)',
    quebrarNenhum: 'Do not split',
    quebrarAjuda: 'Splits each group by the options of another field, in stacked bars.',
    multiploAviso: 'Multi-select: the item counts in each checked option.',
    relacaoAviso: c => `Relationship: groups by the ${c} item linked to each item.`,
    condicoes: 'Panel filters',
    condicoesVazio: 'Without a filter, the panel counts all items of the category.',
    adicionarCondicao: 'Add condition',
    juncao: { e: 'All conditions', ou: 'Any condition' },
    operadores: { igual: 'is', diferente: 'is not', maior: 'greater than', menor: 'less than', preenchido: 'is filled', vazio: 'is empty' },
    valorPlaceholder: 'Value',
    removerCondicao: 'Remove condition',
    periodo: 'Period',
    periodoDashboard: 'Follow the dashboard period',
    periodoTodo: 'All time',
    periodoTodoAjuda: 'For what exists now, such as contracts under negotiation.',
    campoDeData: 'Date the period reads',
    visualizacao: 'Chart type',
    visualizacoes: { numero: 'Number', barras: 'Bars', barrasHorizontais: 'Horizontal bars', linha: 'Line', area: 'Area', rosca: 'Donut', funil: 'Funnel', tabela: 'Table' },
    ajudaVisualizacao: {
      numero: 'A highlighted number, without grouping.',
      barras: 'Compares groups. With a split, the bars are stacked.',
      barrasHorizontais: 'Ranking. Good for long names and many groups.',
      linha: 'Evolution over time.',
      area: 'Evolution over time, with the parts stacked.',
      rosca: 'Part of the whole, for up to 6 groups.',
      funil: 'Stages in the order of the options. Each stage counts the items that reached it: those in it and in the following stages.',
      tabela: 'The exact numbers of each group.',
    },
    sugerido: 'Suggested',
    visualizacaoAjuda: 'The list shows only the types that fit the chosen data.',
    soNumero: 'To see charts, choose a field in Group by.',
    ordem: 'Order',
    ordens: { natural: 'Order of the options', valorDesc: 'Highest value first', valorAsc: 'Lowest value first', rotulo: 'Alphabetical order' },
    limite: 'Show at most',
    limites: n => `${n} groups`,
    semLimite: 'All groups',
    limiteAjuda: 'The rest goes into Others.',
    mostrarValores: 'Show the value on each bar',
    titulo: 'Title',
    tituloAjuda: 'When empty, the title is the configuration sentence.',
    cancelar: 'Cancel',
    salvar: 'Save panel',
    adicionar: 'Add to dashboard',
    salvo: 'Panel saved',
    adicionado: 'Panel added',
    sistema: 'System fields',
  },

  detalhe: {
    itens: n => n === 1 ? '1 item' : `${n.toLocaleString('en')} items`,
    abrirNaListagem: c => `Open in the ${c} list`,
    abrirAviso: 'Opens the category list with this slice applied.',
    referencia: 'Reference',
    criadoEm: 'Created at',
    periodo: p => `Period: ${p}`,
    vazio: 'No items in this slice.',
    fechar: 'Close',
  },

  formDashboard: {
    tituloEditar: 'Edit dashboard',
    tituloNovo: 'New dashboard',
    nome: 'Name',
    nomeErro: 'Give the dashboard a name.',
    descricao: 'Description (optional)',
    quemVe: 'Who can see',
    todosMembros: 'All members',
    quemVeAjuda: 'Each panel shows only the items the person can see.',
    recarga: 'Refresh the data',
    recargas: n => `Every ${n} min`,
    semRecarga: 'Do not refresh',
    salvar: 'Save',
    criar: 'Create dashboard',
    cancelar: 'Cancel',
    salvo: 'Dashboard saved',
    criado: 'Dashboard created',
  },

  estados: {
    vazioTitulo: 'This dashboard has no panels yet',
    vazioDescricao: 'A panel counts, adds up or compares the items of a category. Start with the data you want to follow.',
    semAcessoTitulo: 'You do not have access to this dashboard',
    semAcessoDescricao: 'Ask the workspace administrator for access.',
    tentarNovamente: 'Try again',
  },

  rotulos: { vazio: 'No value', outros: 'Others', sim: 'Yes', nao: 'No' },
  periodos: { '7d': 'Last 7 days', '30d': 'Last 30 days', '90d': 'Last 90 days', 'month': 'This month', 'quarter': 'This quarter', 'year': 'This year' },
  periodoPersonalizado: (de, ate) => `${de} to ${ate}`,
}

const es: Textos = {
  locale: 'es',
  casca: {
    menuLateral: 'Menú del workspace', buscar: 'Buscar...', membro: 'Miembro', configuracoes: 'Configuraciones',
    ajuda: 'Ayuda', trilha: 'Ruta', recolherMenu: 'Contraer el menú', abrirMenu: 'Abrir el menú',
    voltar: 'Volver', avancar: 'Avanzar', recarregar: 'Recargar', suporte: 'Soporte',
    notificacoes: 'Notificaciones', idioma: 'Idioma', tema: 'Tema', conta: 'Su cuenta', novo: 'Nuevo',
    itens: {
      inicio: 'Inicio', spaceflows: 'Spaceflows', categorias: 'Categorías', tarefas: 'Tareas',
      agenda: 'Agenda', dashboards: 'Dashboards', relatorios: 'menu.member.reports.label', knowledge: 'Knowledge',
      visaoGeral: 'Visión General', sistema: 'Sistema', estrutura: 'Estructura', gestaoDeMembros: 'Gestión de Miembros',
      interface: 'Interfaz', emails: 'Correos', integracoes: 'Integraciones', agentesDeIa: 'Agentes de IA',
      logs: 'Registros', releases: 'Releases', documentacao: 'Documentación',
    },
  },
  workspace: 'teste ux 2',
  trilhaDashboards: 'Dashboards',

  pagina: {
    trocarDashboard: 'Cambiar de dashboard',
    novoDashboard: 'Nuevo dashboard',
    novoPainel: 'Nuevo panel',
    personalizar: 'Personalizar',
    concluir: 'Concluir',
    maisAcoes: 'Más acciones del dashboard',
    editarDashboard: 'Editar dashboard',
    atualizarDados: 'Actualizar datos',
    duplicarDashboard: 'Duplicar dashboard',
    excluirDashboard: 'Eliminar dashboard',
    atualizado: (h, m) => `Actualizado a las ${h}. Se recarga cada ${m} min.`,
    atualizadoSemRecarga: h => `Actualizado a las ${h}.`,
    visivelPara: g => g.length ? `Visible para ${listaEs(g)}` : 'Visible para todos los miembros',
    paineis: n => n === 1 ? '1 panel' : `${n} paneles`,
    dadosAtualizados: 'Datos actualizados',
    duplicado: 'Dashboard duplicado',
    excluido: 'Dashboard eliminado',
  },

  filtros: {
    adicionar: 'Filtro',
    filtrarPor: 'Filtrar el dashboard por',
    ajuda: 'Campos que existen en más de una categoría de este dashboard.',
    semCampoComum: 'Las categorías de este dashboard no tienen campos en común.',
    emCategorias: n => n === 1 ? 'en 1 categoría' : `en ${n} categorías`,
    buscarValor: 'Buscar valor',
    remover: n => `Quitar el filtro ${n}`,
    limpar: 'Limpiar filtros',
    selecionados: n => n === 1 ? '1 seleccionado' : `${n} seleccionados`,
    escolherValores: 'Elija los valores',
  },

  painel: {
    menu: { editar: 'Editar panel', verItens: 'Ver los ítems', duplicar: 'Duplicar panel', baixarCsv: 'Descargar CSV', excluir: 'Eliminar panel' },
    todoPeriodo: 'Todo el período',
    periodoPor: c => `Período por ${c}`,
    filtroNaoSeAplica: n => `El filtro ${n} no vale en este panel: la categoría no tiene ese campo.`,
    filtroNaoSeAplicaCurto: n => `Sin el filtro ${n}`,
    multiplo: 'Un ítem puede tener más de una opción marcada y cuenta en cada una. La suma de los grupos supera el total de ítems.',
    multiploCurto: 'Cuenta en cada opción',
    outros: n => n === 1 ? 'Otros reúne 1 grupo' : `Otros reúne ${n} grupos`,
    itens: n => n === 1 ? '1 ítem' : `${n.toLocaleString('es')} ítems`,
    verItens: n => n === 1 ? 'Ver 1 ítem' : `Ver ${n.toLocaleString('es')} ítems`,
    semDadosTitulo: 'Ningún ítem en el período',
    semDadosDescricao: 'Cambie el período de arriba o los filtros del panel.',
    erroTitulo: 'Este panel no cargó',
    erroDescricao: 'Los demás paneles siguen siendo válidos.',
    colunaValor: 'Valor',
    colunaDoTotal: 'Del total',
    total: 'Total',
    daEtapaAnterior: p => `${p} avanzaron desde la etapa anterior`,
    primeiraEtapa: 'Primera etapa',
    permissao: 'Cuenta solo los ítems que usted puede ver. Quien ve otros ítems puede ver otro número.',
    comoCalculamos: (f, p, c) => `${f}. ${p}.${c ? ` Con ${c === 1 ? '1 condición' : `${c} condiciones`} del panel.` : ''}`,
    condicoes: n => n === 1 ? '1 condición' : `${n} condiciones`,
    csvBaixado: 'CSV descargado',
    clique: 'Haga clic en una barra para ver los ítems.',
    excluido: 'Panel eliminado',
    duplicado: 'Panel duplicado',
    desfazer: 'Deshacer',
    restaurado: 'Panel restaurado',
  },

  frase: (f, cat, medida, agrupar, quebra) => {
    const inicio = f === 'contagem' || !medida ? `Cantidad de ${cat}` : `${es.funcoes[f]} de ${medida} en ${cat}`
    return `${inicio}${agrupar ? ` por ${agrupar}` : ''}${quebra ? ` y ${quebra}` : ''}`
  },
  funcoes: { contagem: 'Conteo de ítems', soma: 'Suma', media: 'Promedio', mediana: 'Mediana', minimo: 'Mínimo', maximo: 'Máximo', distintos: 'Valores distintos' },
  ajudaFuncao: {
    contagem: 'Cuántos ítems caen en cada grupo.',
    soma: 'Suma el campo de todos los ítems del grupo.',
    media: 'Suma el campo y divide por los ítems que tienen valor.',
    mediana: 'El valor del medio: la mitad de los ítems queda arriba, la mitad abajo.',
    minimo: 'El menor valor del campo en el grupo.',
    maximo: 'El mayor valor del campo en el grupo.',
    distintos: 'Cuántos valores diferentes tiene el campo en el grupo.',
  },

  construtor: {
    tituloNovo: 'Nuevo panel',
    tituloEditar: 'Editar panel',
    descricao: 'Elija primero el dato. El tipo de gráfico se ajusta a lo que elija.',
    previa: 'Vista previa',
    secaoDados: 'Datos',
    secaoVisualizacao: 'Visualización',
    secaoIdentificacao: 'Identificación',
    categoria: 'Categoría',
    buscarCategoria: 'Buscar categoría',
    buscarCampo: 'Buscar campo',
    calcular: 'Calcular',
    campoDaMedida: 'Campo',
    medidaPlaceholder: 'Elija un campo de número',
    medidaErro: 'Elija el campo que la función calcula.',
    medidaVazia: 'Esta categoría no tiene campo de número, de moneda ni campo virtual.',
    virtual: 'Campo virtual',
    agruparPor: 'Agrupar por',
    agruparNenhum: 'No agrupar (un solo número)',
    agruparAjuda: 'Cada valor del campo se vuelve una barra, una porción o una fila de la tabla.',
    textoNaoAgrupa: 'El texto libre no agrupa',
    granularidade: 'Agrupar las fechas por',
    granularidades: { dia: 'Día', semana: 'Semana', mes: 'Mes', trimestre: 'Trimestre', ano: 'Año' },
    quebrarPor: 'Dividir por (opcional)',
    quebrarNenhum: 'No dividir',
    quebrarAjuda: 'Divide cada grupo por las opciones de otro campo, en barras apiladas.',
    multiploAviso: 'Selección múltiple: el ítem cuenta en cada opción marcada.',
    relacaoAviso: c => `Relación: agrupa por el ítem de ${c} vinculado a cada ítem.`,
    condicoes: 'Filtros del panel',
    condicoesVazio: 'Sin filtro, el panel cuenta todos los ítems de la categoría.',
    adicionarCondicao: 'Agregar condición',
    juncao: { e: 'Todas las condiciones', ou: 'Cualquier condición' },
    operadores: { igual: 'es', diferente: 'no es', maior: 'mayor que', menor: 'menor que', preenchido: 'está lleno', vazio: 'está vacío' },
    valorPlaceholder: 'Valor',
    removerCondicao: 'Quitar condición',
    periodo: 'Período',
    periodoDashboard: 'Seguir el período del dashboard',
    periodoTodo: 'Todo el período',
    periodoTodoAjuda: 'Para lo que existe ahora, como los contratos en negociación.',
    campoDeData: 'Fecha que lee el período',
    visualizacao: 'Tipo de gráfico',
    visualizacoes: { numero: 'Número', barras: 'Barras', barrasHorizontais: 'Barras horizontales', linha: 'Línea', area: 'Área', rosca: 'Dona', funil: 'Embudo', tabela: 'Tabla' },
    ajudaVisualizacao: {
      numero: 'Un número destacado, sin agrupamiento.',
      barras: 'Compara grupos. Con división, las barras quedan apiladas.',
      barrasHorizontais: 'Ranking. Bueno para nombres largos y muchos grupos.',
      linha: 'Evolución en el tiempo.',
      area: 'Evolución en el tiempo, con las partes apiladas.',
      rosca: 'Parte del todo, para hasta 6 grupos.',
      funil: 'Etapas en el orden de las opciones. Cada etapa cuenta los ítems que llegaron a ella: los que están en ella y en las siguientes.',
      tabela: 'Los números exactos de cada grupo.',
    },
    sugerido: 'Sugerido',
    visualizacaoAjuda: 'La lista muestra solo los tipos que sirven para el dato elegido.',
    soNumero: 'Para ver gráficos, elija un campo en Agrupar por.',
    ordem: 'Orden',
    ordens: { natural: 'Orden de las opciones', valorDesc: 'Mayor valor primero', valorAsc: 'Menor valor primero', rotulo: 'Orden alfabético' },
    limite: 'Mostrar como máximo',
    limites: n => `${n} grupos`,
    semLimite: 'Todos los grupos',
    limiteAjuda: 'El resto entra en Otros.',
    mostrarValores: 'Mostrar el valor en cada barra',
    titulo: 'Título',
    tituloAjuda: 'Vacío, el título es la frase de la configuración.',
    cancelar: 'Cancelar',
    salvar: 'Guardar panel',
    adicionar: 'Agregar al dashboard',
    salvo: 'Panel guardado',
    adicionado: 'Panel agregado',
    sistema: 'Campos del sistema',
  },

  detalhe: {
    itens: n => n === 1 ? '1 ítem' : `${n.toLocaleString('es')} ítems`,
    abrirNaListagem: c => `Abrir en el listado de ${c}`,
    abrirAviso: 'Abre el listado de la categoría con este recorte aplicado.',
    referencia: 'Referencia',
    criadoEm: 'Creado el',
    periodo: p => `Período: ${p}`,
    vazio: 'Ningún ítem en este recorte.',
    fechar: 'Cerrar',
  },

  formDashboard: {
    tituloEditar: 'Editar dashboard',
    tituloNovo: 'Nuevo dashboard',
    nome: 'Nombre',
    nomeErro: 'Dé un nombre al dashboard.',
    descricao: 'Descripción (opcional)',
    quemVe: 'Quién ve',
    todosMembros: 'Todos los miembros',
    quemVeAjuda: 'Cada panel muestra solo los ítems que la persona puede ver.',
    recarga: 'Recargar los datos',
    recargas: n => `Cada ${n} min`,
    semRecarga: 'No recargar',
    salvar: 'Guardar',
    criar: 'Crear dashboard',
    cancelar: 'Cancelar',
    salvo: 'Dashboard guardado',
    criado: 'Dashboard creado',
  },

  estados: {
    vazioTitulo: 'Este dashboard todavía no tiene paneles',
    vazioDescricao: 'Un panel cuenta, suma o compara los ítems de una categoría. Empiece por el dato que quiere seguir.',
    semAcessoTitulo: 'Usted no tiene acceso a este dashboard',
    semAcessoDescricao: 'Pida acceso a quien administra el workspace.',
    tentarNovamente: 'Intentar de nuevo',
  },

  rotulos: { vazio: 'Sin valor', outros: 'Otros', sim: 'Sí', nao: 'No' },
  periodos: { '7d': 'Últimos 7 días', '30d': 'Últimos 30 días', '90d': 'Últimos 90 días', 'month': 'Este mes', 'quarter': 'Este trimestre', 'year': 'Este año' },
  periodoPersonalizado: (de, ate) => `${de} al ${ate}`,
}

export const textos: Record<Idioma, Textos> = { 'pt-BR': pt, en, es }
